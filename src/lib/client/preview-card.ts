/**
 * Preview cards: the browser half of `<PreviewTerm>`.
 *
 * Every card is server-rendered next to its trigger and hidden, so this file
 * only decides *when* one is shown and *where* it lands. Delegated from the
 * document, the way `site.ts` handles the persisted chrome, so a client
 * navigation never leaves a card bound to a page that no longer exists.
 *
 * The opening copies the project drawer on /experience: the word's fill lands,
 * and out of it a line as wide as the paint grows into the card — one transform
 * from that line's rectangle, so the shell never leaves the compositor — while
 * the copy settles after it (fade, blur and a touch of scale). Closing is that
 * same move backwards and quicker —the card returns into the line it grew from—
 * with no copy animation at all: the surface is simply gone.
 *
 * Pointer opens after a short intent delay and closes with a grace period long
 * enough to travel into the card; keyboard focus opens at once; a tap pins the
 * card open (that is the only way to reach the link inside on touch); Esc
 * closes it and returns focus to the word.
 *
 * Moving to another word while a card is open does not close it: the card
 * travels to the new one —position and size at once— and its copy swaps in
 * place with the same fade and blur the drawer uses between projects.
 */

const OPEN_DELAY = 120;
const CLOSE_DELAY = 200;
const GAP = 8;
/** The term's fill: the line leaves the word once the paint has landed. */
const LINE_DELAY = 60;
const MORPH_MS = 460;
/** Closing is the entrance backwards, and shorter: the line returns at once. */
const EXIT_MS = 200;
const LINE = 2;
/** A visible card follows its word: the move is animated, not a jump. */
const MOVE_MS = 220;
const EASE_IN = "cubic-bezier(.22, 1, .36, 1)";

interface Preview {
	trigger: HTMLElement;
	card: HTMLElement;
	/** A tap or a click keeps the card open until Esc, an outside pointerdown. */
	pinned: boolean;
}

let current: Preview | null = null;
let openTimer: number | undefined;
let closeTimer: number | undefined;
let lineTimer: number | undefined;
let morph: Animation | null = null;
/** The card sliding from one word to the next, or resizing under it. */
let moving: Animation | null = null;
/** Where the card was last placed, so a reflow can animate from it. */
let lastBox: {
	card: HTMLElement;
	left: number;
	top: number;
	width: number;
	height: number;
} | null = null;
/** A card on its way out, with the animation that is taking it there. */
let exiting: { animation: Animation; card: HTMLElement } | null = null;
/** A word whose card waits for the previous one to finish leaving. */
let queued: { preview: Preview; pinned: boolean } | null = null;
let frame = 0;

function reducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canAnimate(card: HTMLElement) {
	return !reducedMotion() && typeof card.animate === "function";
}

function clearTimers() {
	if (openTimer !== undefined) window.clearTimeout(openTimer);
	if (closeTimer !== undefined) window.clearTimeout(closeTimer);
	if (lineTimer !== undefined) window.clearTimeout(lineTimer);
	openTimer = undefined;
	closeTimer = undefined;
	lineTimer = undefined;
}

/**
 * One card per term per page.
 *
 * Every block that mentions a term renders the card it could open, so a page
 * accumulates copies: /experience had one for every position. The first in
 * document order wins and the rest are dropped, so what a page ships is the
 * size of its vocabulary, not of its prose.
 *
 * Inline prose leaves its cards in a template, because a paragraph cannot hold
 * a block. They are moved to the end of the body first: they are fixed
 * positioned and found by `data-preview-id`, so where they wait never mattered.
 */
function adoptPool() {
	for (const template of document.querySelectorAll<HTMLTemplateElement>(
		"template[data-preview-pool]",
	)) {
		let portal = document.querySelector<HTMLElement>("[data-preview-portal]");
		if (!portal) {
			portal = document.createElement("div");
			portal.setAttribute("data-preview-portal", "");
			document.body.append(portal);
		}
		portal.append(...template.content.childNodes);
		template.remove();
	}

	const seen = new Set<string>();
	for (const card of document.querySelectorAll<HTMLElement>("[data-preview-card]")) {
		const slug = card.dataset.previewId;
		if (!slug) continue;
		if (seen.has(slug)) card.remove();
		else seen.add(slug);
	}
}

/**
 * The card a trigger opens: the one rendered beside it, or the page's pooled
 * card for that slug. The experience matrix builds its labels in the browser
 * and renders the cards once, so a trigger there has no sibling to point at.
 */
function cardFor(trigger: HTMLElement): HTMLElement | null {
	const local = trigger
		.closest("[data-preview-root]")
		?.querySelector<HTMLElement>("[data-preview-card]");
	if (local) return local;
	const slug = trigger.dataset.preview;
	if (!slug) return null;
	return document.querySelector<HTMLElement>(
		`[data-preview-card][data-preview-id="${CSS.escape(slug)}"]`,
	);
}

function previewOf(trigger: HTMLElement): Preview | null {
	const card = cardFor(trigger);
	if (!card) return null;
	return { trigger, card, pinned: false };
}

function place(preview: Preview, animate = false) {
	const { trigger, card } = preview;
	// A card that is already open is followed, not rebuilt: measured first, so
	// another word of the same term slides it over instead of teleporting it.
	const follow =
		animate && !card.hidden && card.dataset.previewState === "open" && canAnimate(card);
	if (moving) {
		moving.cancel();
		moving = null;
	}
	// A resize reflows the card before this runs, so its live rectangle already
	// has the new size; only the record of the last placement can animate the
	// width and the height from where they were.
	const before = follow
		? (lastBox?.card === card ? lastBox : card.getBoundingClientRect())
		: null;
	const rect = trigger.getBoundingClientRect();
	const viewportWidth = document.documentElement.clientWidth;
	const viewportHeight = window.innerHeight;

	// Open on the roomier side and cap the card to that room, so its scroll
	// takes the overflow instead of the card covering the word it explains.
	const spaceBelow = viewportHeight - rect.bottom - GAP * 2;
	const spaceAbove = rect.top - GAP * 2;
	const openBelow = spaceBelow >= spaceAbove;
	const room = Math.max(
		Math.min(openBelow ? spaceBelow : spaceAbove, viewportHeight * 0.6),
		160,
	);
	card.style.maxBlockSize = `${Math.round(room)}px`;

	const width = card.offsetWidth;
	const height = card.offsetHeight;
	const top = openBelow ? rect.bottom + GAP : rect.top - GAP - height;
	const left = Math.round(
		Math.min(
			Math.max(rect.left + rect.width / 2 - width / 2, GAP),
			Math.max(viewportWidth - width - GAP, GAP),
		),
	);

	card.style.top = `${Math.round(Math.max(top, GAP))}px`;
	card.style.left = `${left}px`;

	const after = card.getBoundingClientRect();
	lastBox = {
		card,
		left: after.left,
		top: after.top,
		width: after.width,
		height: after.height,
	};
	if (!before) return;
	const dx = Math.round(before.left - after.left);
	const dy = Math.round(before.top - after.top);
	const dw = before.width - after.width;
	const dh = before.height - after.height;
	if (!dx && !dy && Math.abs(dw) < 1 && Math.abs(dh) < 1) return;

	// Translation for the jump, and width and height with it: the card arrives
	// at its new word by travelling, not by being replaced.
	const animation = card.animate(
		[
			{
				transform: `translate(${dx}px, ${dy}px)`,
				width: `${before.width}px`,
				height: `${before.height}px`,
			},
			{ transform: "none", width: `${after.width}px`, height: `${after.height}px` },
		],
		{ duration: MOVE_MS, easing: EASE_IN },
	);
	moving = animation;
	animation.finished
		.then(() => {
			if (moving === animation) moving = null;
		})
		.catch(() => {
			// Interrupted by the next move: the following one measures again.
		});
}

function play(card: HTMLElement) {
	if (reducedMotion()) return;
	const video = card.querySelector<HTMLVideoElement>("video");
	if (!video) return;
	video.play().catch(() => {
		// Autoplay can still be refused; the poster stays, which is the point.
	});
}

function stop(card: HTMLElement) {
	const video = card.querySelector<HTMLVideoElement>("video");
	if (!video) return;
	video.pause();
	video.currentTime = 0;
}

/**
 * The two ends of the morph: the line the fill leaves behind, and the card it
 * grows into.
 *
 * A transform from that line's rectangle — where the paint ends — so the shell
 * changes width and height at once, and the card's own colours take over from
 * the terracotta the line was drawn with. Opening plays the pair in order;
 * closing plays the same pair backwards.
 */
function morphFrames({ trigger, card }: Preview): Keyframe[] | null {
	const word = trigger.getBoundingClientRect();
	const box = card.getBoundingClientRect();
	if (!box.width || !box.height) return null;

	// The line sits on the side the card opens from, as wide as the paint.
	const below = box.top >= word.bottom;
	const lineHeight = LINE;
	const lineTop = below ? box.top : box.bottom - lineHeight;
	// No floor worth a pixel here: the drawer's 0.02 would grow a 2px line to
	// ~8px on a tall card, and the line has to stay the line it says it is.
	const sx = Math.max(0.001, Math.max(word.width, 20) / box.width);
	const sy = Math.max(0.001, lineHeight / box.height);
	const shell = getComputedStyle(card).backgroundColor;
	const accent =
		getComputedStyle(card).getPropertyValue("--color-terracotta").trim() ||
		shell;

	return [
		{
			transformOrigin: "0 0",
			transform: `translate(${word.left - box.left}px, ${lineTop - box.top}px) scale(${sx}, ${sy})`,
			borderRadius: "2px",
			backgroundColor: accent,
		},
		{
			transformOrigin: "0 0",
			transform: "none",
			borderRadius: "10px",
			backgroundColor: shell,
		},
	];
}

function morphIn(preview: Preview) {
	const frames = morphFrames(preview);
	if (!frames) return;
	const { card } = preview;

	morph?.cancel();
	morph = card.animate(frames, { duration: MORPH_MS, easing: EASE_IN });

	morph.finished
		.then(() => {
			if (morph) morph = null;
			if (current?.card === card) card.dataset.previewState = "open";
		})
		.catch(() => {
			// Cancelled by a close or a new word: the next open starts clean.
		});
}

function finishHide(card: HTMLElement) {
	if (lastBox?.card === card) lastBox = null;
	// A card reopened while it was leaving belongs to the new word now.
	if (current?.card === card) return;
	card.hidden = true;
	card.style.opacity = "";
	delete card.dataset.closing;
	card.removeAttribute("data-preview-state");
}

function hide(restoreFocus = false) {
	// Closing cancels a card that was waiting its turn: it belongs to a word
	// someone has just left.
	queued = null;
	if (!current) return;
	const { card, trigger } = current;
	// Hidden before the line ever showed: nothing to fade out, and an exit
	// animation would flash a card nobody saw open.
	const revealed = card.classList.contains("is-open");
	clearTimers();
	morph?.cancel();
	morph = null;
	card.classList.remove("is-open");
	trigger.setAttribute("aria-expanded", "false");
	stop(card);
	// Focus before dropping the state: `focusin` opens the word it lands on, so
	// the trigger has to still be the current one when that event fires, or Esc
	// would close the card and reopen it in the same tick.
	if (restoreFocus && trigger.isConnected) trigger.focus();
	current = null;

	if (!revealed || !canAnimate(card)) {
		finishHide(card);
		return;
	}

	// The entrance, backwards and quicker: the same frames in reverse, so the
	// card goes back into the line it came from. The copy is not faded out on
	// its own — the surface is already hidden while the shell returns.
	card.dataset.closing = "true";
	const frames = morphFrames({ trigger, card, pinned: true });
	const animation = frames
		? card.animate(frames, {
				duration: EXIT_MS,
				easing: EASE_IN,
				direction: "reverse",
			})
		: card.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: EXIT_MS,
				easing: "ease-out",
			});
	exiting = { animation, card };
	animation.finished
		.then(() => {
			if (exiting?.animation === animation) exiting = null;
			finishHide(card);
			flushQueued();
		})
		.catch(() => {
			// Cancelled by a close or by reopening: not ours to run.
		});
}

/**
 * Opens the word that waited for the exit, if it still wants its card.
 *
 * The pointer may have moved on while the previous card was going back into
 * its line, and a keyboard card may have lost focus: only a word that is still
 * hovered or focused gets the card the queue kept for it.
 */
function flushQueued() {
	const waiting = queued;
	queued = null;
	if (!waiting) return;
	const { preview, pinned } = waiting;
	if (!preview.card.isConnected || !preview.trigger.isConnected) return;
	if (
		!pinned &&
		!preview.trigger.matches(":hover") &&
		document.activeElement !== preview.trigger
	) {
		return;
	}
	present(preview, pinned);
}

/**
 * Another word takes over the card that is already open.
 *
 * The shell is not closed and reopened: the incoming card is parked on the box
 * the outgoing one occupied, the outgoing one steps aside in the same frame (so
 * the swap is invisible and only one card is ever on screen), and then the
 * travelling card moves to its own word, growing or shrinking on the way. Its
 * copy comes in with the fade and the blur the drawer uses between projects.
 */
function transfer(from: Preview, to: Preview, pinned: boolean) {
	const shell = from.card.getBoundingClientRect();
	if (!shell.width || !shell.height) {
		if (current) hide();
		present(to, pinned);
		return;
	}

	const { card, trigger } = to;
	clearTimers();
	from.trigger.setAttribute("aria-expanded", "false");
	current = null;
	morph?.cancel();
	morph = null;
	moving?.cancel();
	moving = null;
	// A card still on its way out would sit under the travelling one.
	if (exiting?.card === card) {
		exiting.animation.cancel();
		exiting = null;
	}
	finishHide(from.card);

	trigger.setAttribute("aria-expanded", "true");
	delete card.dataset.closing;
	card.hidden = false;
	card.style.opacity = "1";
	card.classList.add("is-open");
	card.dataset.previewState = "open";

	// Parked on the old box first, so the first frame is the card that was
	// already there; then measured at its own size from its own word.
	card.style.width = `${shell.width}px`;
	card.style.height = `${shell.height}px`;
	card.style.top = `${shell.top}px`;
	card.style.left = `${shell.left}px`;
	card.style.width = "";
	card.style.height = "";
	place(to);
	const target = card.getBoundingClientRect();

	current = to;
	to.pinned = pinned;

	const dx = Math.round(shell.left - target.left);
	const dy = Math.round(shell.top - target.top);
	const animation = card.animate(
		[
			{
				transform: `translate(${dx}px, ${dy}px)`,
				width: `${shell.width}px`,
				height: `${shell.height}px`,
			},
			{ transform: "none", width: `${target.width}px`, height: `${target.height}px` },
		],
		{ duration: MOVE_MS, easing: EASE_IN },
	);
	moving = animation;
	animation.finished
		.then(() => {
			if (moving === animation) moving = null;
		})
		.catch(() => {});

	// The copy, on the drawer's clock: it does not pop, it arrives.
	card
		.querySelector<HTMLElement>(".preview-card-surface")
		?.animate(
			[
				{ opacity: 0.35, filter: "blur(5px)" },
				{ opacity: 1, filter: "blur(0px)" },
			],
			{ duration: MOVE_MS, easing: "ease-out" },
		);
}

function show(next: Preview, pinned = false) {
	// The same pooled card, reached from another word of the same term: it is
	// already open, so it only moves instead of collapsing and growing again.
	if (current && current.card === next.card) {
		clearTimers();
		current.trigger.setAttribute("aria-expanded", "false");
		next.trigger.setAttribute("aria-expanded", "true");
		current = next;
		next.pinned = pinned;
		place(next, true);
		return;
	}

	if (current) {
		// A different card: the open one does not close, it takes the new word.
		if (canAnimate(next.card) && !reducedMotion()) {
			transfer(current, next, pinned);
			return;
		}
		hide();
	}
	if (exiting) {
		// The card that is leaving gets to finish its morph: this word opens when
		// the line is back, never on top of the one still going into it.
		queued = { preview: next, pinned };
		return;
	}
	present(next, pinned);
}

function present(next: Preview, pinned = false) {
	clearTimers();

	current = next;
	next.pinned = pinned;
	const { card, trigger } = next;
	trigger.setAttribute("aria-expanded", "true");
	delete card.dataset.closing;
	card.hidden = false;
	card.style.opacity = "0";
	place(next);

	// Reduced motion: no line, no grow, no staged copy. The card is simply there.
	if (!canAnimate(card)) {
		card.style.opacity = "1";
		card.classList.add("is-open");
		card.dataset.previewState = "open";
		play(card);
		return;
	}

	card.classList.remove("is-open");
	card.dataset.previewState = "opening";
	// The paint runs on the word for a beat; the line takes over when it lands.
	lineTimer = window.setTimeout(() => {
		lineTimer = undefined;
		if (!current || current.card !== card) return;
		card.style.opacity = "1";
		card.classList.add("is-open");
		morphIn(next);
		play(card);
	}, LINE_DELAY);
}

/**
 * Re-place the open card; a scroll or a resize moves the word under it.
 *
 * Scrolling snaps, so the card keeps up with the word frame by frame; a resize
 * is a jump and is animated, size included.
 */
function track(animate = false) {
	if (frame || !current) return;
	frame = window.requestAnimationFrame(() => {
		frame = 0;
		if (current) place(current, animate);
	});
}

function triggerFrom(target: EventTarget | null): HTMLElement | null {
	return target instanceof Element
		? target.closest<HTMLElement>("[data-preview]")
		: null;
}

function bind() {
	document.addEventListener("pointerover", (event) => {
		// Hover is a mouse idea; touch and pen open on tap instead.
		if (event.pointerType !== "mouse") return;
		const target = event.target;
		if (!(target instanceof Element)) return;

		const trigger = triggerFrom(target);
		if (trigger) {
			const preview = previewOf(trigger);
			if (!preview) return;
			if (openTimer !== undefined) window.clearTimeout(openTimer);
			if (closeTimer !== undefined) window.clearTimeout(closeTimer);
			closeTimer = undefined;
			if (current?.trigger === trigger) return;
			openTimer = window.setTimeout(() => {
				openTimer = undefined;
				show(preview);
			}, OPEN_DELAY);
			return;
		}

		// The card is a hover target too: the pointer has to cross the gap.
		if (target.closest("[data-preview-card]")) {
			if (closeTimer !== undefined) window.clearTimeout(closeTimer);
			closeTimer = undefined;
			return;
		}

		if (current && !current.pinned) {
			if (closeTimer !== undefined) window.clearTimeout(closeTimer);
			closeTimer = window.setTimeout(() => {
				closeTimer = undefined;
				hide();
			}, CLOSE_DELAY);
		}
	});

	document.addEventListener("pointerdown", (event) => {
		if (!current) return;
		const target = event.target;
		if (!(target instanceof Node)) return hide();
		if (current.card.contains(target) || current.trigger.contains(target)) return;
		hide();
	});

	document.addEventListener("click", (event) => {
		const trigger = triggerFrom(event.target);
		if (!trigger) return;
		const preview = previewOf(trigger);
		if (!preview) return;
		// A second activation of the same word closes what it opened.
		if (current?.trigger === trigger) hide();
		else show(preview, true);
	});

	document.addEventListener("focusin", (event) => {
		// Tab into the card's own link: the card is outside the trigger's root
		// when the page pools it, so this cannot be left to `focusout`.
		if (current && event.target instanceof Node && current.card.contains(event.target)) {
			return;
		}
		const trigger = triggerFrom(event.target);
		if (!trigger || current?.trigger === trigger) return;
		// Only keyboard focus opens the card. A tap or a click focuses the
		// button on its way to the click handler, so opening here would hand
		// the click something to close and the first tap would do nothing.
		if (!trigger.matches(":focus-visible")) return;
		const preview = previewOf(trigger);
		if (preview) show(preview);
	});

	document.addEventListener("focusout", (event) => {
		if (!current) return;
		const next = event.relatedTarget;
		if (
			next instanceof Node &&
			(current.card.contains(next) || current.trigger.contains(next))
		) {
			return;
		}
		hide();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		// Esc also drops a card that was waiting for its turn.
		queued = null;
		if (!current) return;
		event.stopPropagation();
		hide(true);
	});

	window.addEventListener("scroll", () => track(), { passive: true });
	window.addEventListener("resize", () => track(true));
	// A navigation takes the cards with it, so the reference has to go — but
	// `astro:page-load` also fires once on the first load, and closing a card
	// someone has just opened with the page still in front of them is a bug.
	// Only the card leaving the document is the signal to reset.
	document.addEventListener("astro:page-load", () => {
		adoptPool();
		if (current && current.card.isConnected) return;
		current = null;
		queued = null;
		clearTimers();
		morph?.cancel();
		morph = null;
		moving?.cancel();
		moving = null;
		lastBox = null;
		exiting?.animation.cancel();
		exiting = null;
	});

	// Before anything can be hovered: templates out of the way, one card per
	// term.
	adoptPool();
}

if (!(window as unknown as { __previewCardsBound?: boolean }).__previewCardsBound) {
	(window as unknown as { __previewCardsBound?: boolean }).__previewCardsBound = true;
	bind();
}
