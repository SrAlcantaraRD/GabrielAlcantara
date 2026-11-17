/**
 * The home headline: a Shared Letter Morph between one word and the next.
 *
 * Ported from the Pachanga hero. A swap is one physical event: the letters both
 * words share travel from where they stand to where they are needed (FLIP), the
 * ones only the old word has sink into the baseline, and the new ones rise out
 * of it a beat behind — exit, travel, enter, in that order and never at once.
 * Only transforms and opacity are written, so nothing reflows, and the slot
 * already reserves the widest word, so a swap never moves the line either.
 *
 * The words in the markup are the source of truth. The layers are built from
 * them at runtime, so the served HTML carries no letter markup and a reader
 * without JS, with reduced motion or without Web Animations keeps the first
 * word.
 */
import { matchLetters } from "../hero-morph";

/**
 * The beats, in ms — this is the choreography. The exit has to be seen before
 * the shared letters leave, and the travel before the new letters arrive: that
 * is the cascade. The enter waits for the exit to be gone, because a word
 * materialising under a word that is still dying reads as two words, never as
 * one becoming another. Exit and enter are short, travel is long, because the
 * eye follows the letters that survive.
 */
const EXIT = 165;
const TRAVEL = 460;
const ENTER = 280;
const TRAVEL_AT = 40;
/**
 * The enter opens under the exit's tail, not after it: by this point the old
 * letters are at a tenth of their ink, so the two words never read as two and
 * the slot is never left holding only the travellers. The handover is a
 * dissolve.
 */
const ENTER_AT = 170;
/**
 * The parallax: each letter starts a beat after the one before it, so the word
 * rises and sinks as a fan instead of as one block. The cap only exists so a
 * very long label cannot outrun the beat.
 */
const STAGGER = 18;
const STAGGER_MAX = 11;
/** The travellers fan too, at a shorter step: they are already in motion. */
const TRAVEL_STAGGER = 10;
/** ms before the spent layer is dropped from the DOM. */
const LEAVE = 700;
/**
 * ms a word sits still before the next morph. A word is in motion for ~580ms
 * and then rests, so every word gets a full fixation before the next one
 * starts taking it apart.
 */
const REST = 760;

const EASE_TRAVEL = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_EXIT = "cubic-bezier(0.4, 0, 0.6, 1)";

interface MorphLayer {
	root: HTMLElement;
	letters: HTMLElement[];
	text: string;
}

const disposers = new Set<() => void>();

function morphable(): boolean {
	return (
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
		typeof Element.prototype.animate === "function"
	);
}

/** One word, one box per character. A space keeps its own box. */
function layer(text: string): MorphLayer {
	const root = document.createElement("span");
	root.className = "hero-morph-layer";
	const letters: HTMLElement[] = [];

	for (const char of Array.from(text)) {
		const box = document.createElement("span");
		box.className = "hero-letter";
		box.textContent = char;
		root.appendChild(box);
		letters.push(box);
	}

	return { root, letters, text };
}

function mount(slot: HTMLElement): void {
	if (slot.dataset.bound === "true") return;
	slot.dataset.bound = "true";
	if (!morphable()) return;

	const words = Array.from(
		slot.querySelectorAll<HTMLElement>(".hero-morph-word"),
	);
	const labels = words.map((word) =>
		(word.textContent ?? "").replace(/\s+/g, " ").trim(),
	);
	if (labels.length < 2) return;

	const first = labels[0];
	if (first === undefined) return;

	const controller = new AbortController();
	disposers.add(() => controller.abort());

	let current = layer(first);
	let index = 0;
	let timer = 0;

	/*
	 * Arming: the static first word becomes the first morph layer in the same
	 * frame the slot hides its words, and the slot already reserved the widest
	 * word's width and one line's height, so nothing under the hero moves.
	 */
	slot.appendChild(current.root);
	slot.setAttribute("data-hero-live", "");

	const morph = (text: string) => {
		const from = current;
		const next = layer(text);

		/* Writes first: the arriving layer exists and is laid out, but hidden, so
		   nothing has been painted at the wrong place. */
		next.root.style.visibility = "hidden";
		slot.appendChild(next.root);

		/* One read pass. visibility: hidden still has geometry, and neither layer
		   carries a transform at rest, so these rects are the two words' real
		   places. */
		const fromRects: DOMRect[] = [];
		for (const box of from.letters) fromRects.push(box.getBoundingClientRect());
		const toRects: DOMRect[] = [];
		for (const box of next.letters) toRects.push(box.getBoundingClientRect());

		const sharedTo = new Map<number, number>();
		const sharedFrom = new Set<number>();
		for (const [source, target] of matchLetters(from.text, next.text)) {
			sharedTo.set(target, source);
			sharedFrom.add(source);
		}

		/* Writes only from here: geometry is done. */
		next.root.style.visibility = "";

		next.letters.forEach((box, k) => {
			const origin = sharedTo.get(k);
			const landing = toRects[k];

			if (origin === undefined || landing === undefined) {
				/* New letter: it rises out of the baseline and grows upward. The box
				   is anchored at its foot, so the top edge is what travels: the glyph
				   is never resized, it is revealed, which is the parallax the eye
				   reads as depth. */
				box.animate(
					[
						{ opacity: 0, transform: "translateY(0.34em) scaleY(0.42)" },
						{ opacity: 1, transform: "none" },
					],
					{
						duration: ENTER,
						delay: ENTER_AT + Math.min(k, STAGGER_MAX) * STAGGER,
						easing: EASE_TRAVEL,
						fill: "both",
					},
				);
				return;
			}

			const standing = fromRects[origin];

			if (standing === undefined) {
				box.animate(
					[
						{ opacity: 0, transform: "translateY(0.34em) scaleY(0.42)" },
						{ opacity: 1, transform: "none" },
					],
					{
						duration: ENTER,
						delay: ENTER_AT + Math.min(k, STAGGER_MAX) * STAGGER,
						easing: EASE_TRAVEL,
						fill: "both",
					},
				);
				return;
			}

			/* Shared letter: FLIP. It is painted where it stood — the outgoing copy
			   is hidden in this same frame, so there is never a double — and then
			   travels to the place it already occupies in the layout. */
			const dx = Math.round(standing.left - landing.left);
			const dy = Math.round(standing.top - landing.top);

			box.classList.add("is-shared");

			const source = from.letters[origin];
			if (source) {
				/* Marked on both sides: the outgoing copy is the letter that stayed,
				   not one that is dying. */
				source.classList.add("is-shared");
				source.style.visibility = "hidden";
			}

			const travel = box.animate(
				[
					{ transform: `translate(${dx}px, ${dy}px)` },
					{ transform: "none" },
				],
				{
					duration: TRAVEL,
					delay: TRAVEL_AT + Math.min(k, STAGGER_MAX) * TRAVEL_STAGGER,
					easing: EASE_TRAVEL,
					fill: "both",
				},
			);
			/* Drop the finished animation: a held fill is a permanent style on every
			   letter of the word, and a word lives a second. */
			travel.onfinish = () => travel.cancel();
		});

		from.letters.forEach((box, k) => {
			if (sharedFrom.has(k)) return;

			/* Letter only the old word has: it goes first, sinking into the baseline
			   while its top edge comes down — the same axis as the rise, in reverse,
			   so the two read as one surface. */
			box.animate(
				[
					{ opacity: 1, transform: "none" },
					{ opacity: 0, transform: "translateY(0.16em) scaleY(0.3)" },
				],
				{
					duration: EXIT,
					delay: Math.min(k, STAGGER_MAX) * STAGGER,
					easing: EASE_EXIT,
					fill: "forwards",
				},
			);
		});

		current = next;

		/* The spent layer leaves only once nothing on it is moving; a detached
		   node keeps its animations running otherwise. */
		const spent = from.root;
		window.setTimeout(() => spent.remove(), LEAVE);
	};

	const tick = () => {
		index = (index + 1) % labels.length;
		const next = labels[index];
		if (next === undefined) return;
		morph(next);
	};

	/* One timeout, re-armed per word: the rest is the word's own hold, not a
	   fixed period. */
	const start = () => {
		if (timer) return;
		timer = window.setTimeout(() => {
			timer = 0;
			tick();
			start();
		}, LEAVE + REST);
	};

	const stop = () => {
		if (!timer) return;
		window.clearTimeout(timer);
		timer = 0;
	};

	if ("IntersectionObserver" in window) {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) start();
					else stop();
				}
			},
			{ threshold: 0.2 },
		);
		observer.observe(slot);
		controller.signal.addEventListener("abort", () => observer.disconnect(), {
			once: true,
		});
	}

	controller.signal.addEventListener(
		"abort",
		() => {
			stop();
			delete slot.dataset.bound;
		},
		{ once: true },
	);

	start();
}

function init(): void {
	for (const slot of document.querySelectorAll<HTMLElement>(
		"[data-hero-morph]",
	)) {
		mount(slot);
	}
}

init();
document.addEventListener("astro:page-load", init);

// The ClientRouter reuses the document: stop the loop and the observer of the
// slot that is about to be replaced.
document.addEventListener("astro:before-swap", () => {
	for (const dispose of disposers) dispose();
	disposers.clear();
});
