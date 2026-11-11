/**
 * The home headline reel: a vertical, infinite wheel of words.
 *
 * The reel is a single continuous `position`, measured in rows, exactly like a
 * date picker: integer values put a word in the centre and fractions are the
 * distance someone has dragged. Every frame derives each word's offset from
 * that position, so the wheel can never rest between two words — releasing
 * projects the flick, rounds it and eases to an integer.
 *
 * It is decoration (`aria-hidden`): the H1 keeps its full text for assistive
 * technology, and the wheel adds no focus stops or ARIA noise. That also means
 * there is no keyboard contract to honour: the pointer is the only user input,
 * and a slow clock advances the reel on its own.
 */

import { reelSlot, wrapOffset } from "../hero-wheel";

/** How far one row's worth of flick speed carries the wheel. */
const PROJECT_MS = 120;
/** Cap on how many words a single flick can skip. */
const MAX_PROJECTION = 2;
/** Pointer travel that still counts as a tap on a word. */
const DRAG_SLOP = 4;
/** A flick older than this is a held wheel, not a throw: no projection. */
const FLICK_TTL_MS = 100;
/** Minimum gap between clicks, so inertia cannot machine-gun the sound. */
const TICK_MIN_MS = 40;
const TICK_FREQUENCY = 2100;
/** The internal clock: the word above slides into the centre every 3 s. */
const AUTOPLAY_MS = 3000;

interface ClickBank {
	context: AudioContext;
	lastTick: number;
}

let bank: ClickBank | null = null;
const disposers = new Set<() => void>();

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The click is synthesised, not sampled: a short, bright tick with no asset to
 * download. The context is built lazily on the first gesture, because browsers
 * block audio until someone interacts with the page.
 */
function clickBank(reel: HTMLElement): ClickBank | null {
	if (bank) {
		if (bank.context.state === "suspended") void bank.context.resume();
		return bank;
	}

	const AudioCtor =
		window.AudioContext ??
		(window as unknown as { webkitAudioContext?: typeof AudioContext })
			.webkitAudioContext;
	if (!AudioCtor) return null;

	try {
		const context = new AudioCtor();
		bank = { context, lastTick: 0 };
		reel.dataset.sound = "ready";
		return bank;
	} catch {
		// Audio can be unavailable (policy, private mode): the wheel still works.
		return null;
	}
}

function tick(bankRef: ClickBank): void {
	const { context } = bankRef;
	const now = context.currentTime;
	if (now * 1000 - bankRef.lastTick < TICK_MIN_MS) return;
	bankRef.lastTick = now * 1000;

	const oscillator = context.createOscillator();
	const gain = context.createGain();
	oscillator.type = "triangle";
	oscillator.frequency.setValueAtTime(TICK_FREQUENCY, now);
	oscillator.frequency.exponentialRampToValueAtTime(1150, now + 0.03);
	gain.gain.setValueAtTime(0.0001, now);
	gain.gain.exponentialRampToValueAtTime(0.05, now + 0.006);
	gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
	oscillator.connect(gain);
	gain.connect(context.destination);
	oscillator.start(now);
	oscillator.stop(now + 0.07);
}

function mount(reel: HTMLElement): void {
	if (reel.dataset.bound === "true") return;
	reel.dataset.bound = "true";

	const items = Array.from(
		reel.querySelectorAll<HTMLElement>(".hero-reel-item"),
	);
	const length = items.length;
	if (length < 3) return;

	const controller = new AbortController();
	const { signal } = controller;
	disposers.add(() => controller.abort());

	const modulo = (value: number) => ((value % length) + length) % length;

	let position = Number(reel.dataset.activeIndex ?? 0) || 0;
	let activeIndex = Math.round(position);
	let row = 0;
	let frame = 0;
	let dragging = false;
	let pointerId: number | null = null;
	let startY = 0;
	let startPosition = 0;
	let lastY = 0;
	let lastTime = 0;
	let velocity = 0;
	let travel = 0;
	let pressedItem: HTMLElement | null = null;
	let clock = 0;
	let disposed = false;

	const render = () => {
		const centre = modulo(Math.round(position));

		for (let index = 0; index < length; index += 1) {
			const slot = reelSlot(wrapOffset(index - position, length));
			const item = items[index] as HTMLElement;
			item.style.setProperty("--offset", slot.offset.toFixed(4));
			item.style.setProperty("--reel-scale", slot.scale.toFixed(4));
			item.style.setProperty("--reel-opacity", slot.opacity.toFixed(3));
			// Only the lateral words are click targets; the centred one is not.
			item.toggleAttribute("data-center", index === centre);
		}

		const next = Math.round(position);
		if (next === activeIndex) return;
		activeIndex = next;
		reel.dataset.activeIndex = String(modulo(next));
		if (bank) tick(bank);
	};

	/**
	 * The row distance is measured, never hardcoded: the type size is fluid, and
	 * Newsreader changes its metrics once the webfont arrives.
	 */
	const measure = () => {
		if (!reel.isConnected) return;
		const height = items[0]?.offsetHeight ?? 0;
		if (!height) return;
		row = height;
		reel.style.setProperty("--reel-row", `${height}px`);
		render();
	};

	const stopAnimation = () => {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
	};

	/** Eases to an integer, and lands exactly on it: no half rows, ever. */
	const settle = (goal: number) => {
		stopAnimation();

		if (prefersReducedMotion()) {
			position = goal;
			render();
			return;
		}

		const from = position;
		const distance = Math.abs(goal - from);
		const duration = Math.min(520, 180 + distance * 120);
		const start = performance.now();

		const step = (now: number) => {
			const progress = Math.min(1, (now - start) / duration);
			const eased = 1 - (1 - progress) ** 3;
			position = from + (goal - from) * eased;
			render();

			if (progress < 1) {
				frame = requestAnimationFrame(step);
				return;
			}

			position = goal;
			render();
			frame = 0;
		};

		frame = requestAnimationFrame(step);
	};

	/**
	 * The internal clock. It steps on its own every three seconds, and every
	 * interaction restarts the countdown so the reel never moves away under the
	 * hand that is turning it. The step walks back through the list, so the word
	 * above slides down into the centre: the same sense in which a downward drag
	 * turns the wheel. It stays still for someone who asked for less motion and
	 * while the page is in the background.
	 */
	const scheduleClock = () => {
		if (clock) clearTimeout(clock);
		clock = 0;
		if (disposed) return;

		clock = window.setTimeout(() => {
			clock = 0;
			const canAdvance =
				!dragging &&
				document.visibilityState !== "hidden" &&
				!prefersReducedMotion();
			if (canAdvance) settle(Math.round(position) - 1);
			scheduleClock();
		}, AUTOPLAY_MS);
	};

	const onPointerDown = (event: PointerEvent) => {
		if (event.pointerType === "mouse" && event.button !== 0) return;

		const target = event.target;
		pressedItem =
			target instanceof Element
				? target.closest<HTMLElement>(".hero-reel-item")
				: null;
		dragging = true;
		pointerId = event.pointerId;
		startY = event.clientY;
		lastY = event.clientY;
		startPosition = position;
		lastTime = event.timeStamp;
		velocity = 0;
		travel = 0;
		stopAnimation();
		reel.classList.add("is-dragging");
		scheduleClock();
		clickBank(reel);

		try {
			reel.setPointerCapture(event.pointerId);
		} catch {
			// The pointer may already be gone; the event stream still works.
		}
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!dragging || event.pointerId !== pointerId) return;

		const dy = event.clientY - startY;
		travel = Math.max(travel, Math.abs(dy));

		const elapsed = Math.max(1, event.timeStamp - lastTime);
		velocity = (lastY - event.clientY) / elapsed;
		lastY = event.clientY;
		lastTime = event.timeStamp;

		position = startPosition - dy / (row || 1);
		render();
	};

	const release = (event: PointerEvent) => {
		if (!dragging || event.pointerId !== pointerId) return;

		dragging = false;
		pointerId = null;
		reel.classList.remove("is-dragging");
		if (reel.hasPointerCapture(event.pointerId)) {
			reel.releasePointerCapture(event.pointerId);
		}
		scheduleClock();

		// A tap is a request for a word, not a snap. The item is resolved here,
		// not from the `click` event: pointer capture retargets the click to the
		// reel, so the word would never see it.
		const tappedIndex = pressedItem ? items.indexOf(pressedItem) : -1;
		pressedItem = null;

		if (travel <= DRAG_SLOP) {
			const centre = Math.round(position);

			if (tappedIndex >= 0) {
				const step = Math.sign(wrapOffset(tappedIndex - centre, length));

				// The word already in the centre is a no-op, and a step the clock
				// has started is left to finish instead of being snapped back.
				if (step === 0) return;

				clickBank(reel);
				settle(centre + step);
				return;
			}

			// Tapped the band between rows: close the nearest word.
			settle(centre);
			return;
		}

		const held = event.timeStamp - lastTime > FLICK_TTL_MS;
		const rowsPerMs = row && !held ? velocity / row : 0;
		const projection = Math.max(
			-MAX_PROJECTION,
			Math.min(MAX_PROJECTION, rowsPerMs * PROJECT_MS),
		);
		settle(Math.round(position + projection));
	};

	reel.addEventListener("pointerdown", onPointerDown, { signal });
	reel.addEventListener("pointermove", onPointerMove, { signal });
	reel.addEventListener("pointerup", release, { signal });
	reel.addEventListener("pointercancel", release, { signal });

	window.addEventListener("resize", measure, { signal });

	signal.addEventListener(
		"abort",
		() => {
			stopAnimation();
			disposed = true;
			if (clock) clearTimeout(clock);
			clock = 0;
			reel.classList.remove("is-dragging");
			delete reel.dataset.bound;
		},
		{ once: true },
	);

	measure();
	render();
	scheduleClock();
	void document.fonts.ready.then(measure, measure);
}

function init(): void {
	for (const reel of document.querySelectorAll<HTMLElement>(
		"[data-hero-reel]",
	)) {
		mount(reel);
	}
}

init();
document.addEventListener("astro:page-load", init);

// The ClientRouter reuses the document: stop the loop and the window listeners
// of the reel that is about to be replaced.
document.addEventListener("astro:before-swap", () => {
	for (const dispose of disposers) dispose();
	disposers.clear();
});
