/**
 * Locale changes use a DOM overlay rather than a single View Transition
 * snapshot: paper bars drop from above in a left-to-right wave, Astro swaps
 * the translated document behind them, and the bars continue falling to reveal it.
 */

import { navigate } from "astro:transitions/client";

const BAR_REM = 4;
const COVER_MS = 420;
const COVER_STAGGER_MS = 18;
const REVEAL_MS = 420;
const REVEAL_STAGGER_MS = 18;
const BUFFER_MS = 40;
const OVERLAY_SELECTOR = "[data-locale-transition]";
const BAR_SELECTOR = ".locale-bar";

let transitioning = false;

function overlay(): HTMLElement | null {
	return document.querySelector<HTMLElement>(OVERLAY_SELECTOR);
}

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function closeLocaleMenu() {
	for (const menu of document.querySelectorAll<HTMLDetailsElement>(
		".locale-switcher[open]",
	)) {
		menu.removeAttribute("open");
	}
}

function barWidth(): number {
	const rootSize = Number.parseFloat(
		getComputedStyle(document.documentElement).fontSize,
	);
	return (Number.isFinite(rootSize) ? rootSize : 16) * BAR_REM;
}

function createBars(root: HTMLElement): number {
	const container = root.querySelector<HTMLElement>("[data-locale-bars]");
	if (!container) return 0;

	const count = Math.ceil(window.innerWidth / barWidth()) + 1;
	const fragment = document.createDocumentFragment();

	for (let index = 0; index < count; index += 1) {
		const bar = document.createElement("span");
		bar.className = "locale-bar";
		bar.setAttribute("aria-hidden", "true");
		bar.style.setProperty("--locale-bar-index", String(index));
		fragment.append(bar);
	}

	container.replaceChildren(fragment);
	return count;
}

function cleanup() {
	for (const root of document.querySelectorAll<HTMLElement>(OVERLAY_SELECTOR)) {
		root.classList.remove(
			"is-active",
			"is-covering",
			"is-covered",
			"is-revealing",
		);
	}
	document.documentElement.classList.remove("locale-transition");
}

function duration(count: number, base: number, stagger: number): number {
	return base + Math.max(0, count - 1) * stagger + BUFFER_MS;
}

async function runTransition(url: URL, link: HTMLAnchorElement) {
	const root = overlay();
	if (!root) {
		await navigate(url.href, { sourceElement: link });
		return;
	}

	const count = createBars(root);
	if (count === 0) {
		await navigate(url.href, { sourceElement: link });
		return;
	}

	transitioning = true;
	root.classList.remove("is-revealing", "is-covered");
	root.classList.add("is-active", "is-covering");

	try {
		await wait(duration(count, COVER_MS, COVER_STAGGER_MS));
		// Freeze the bars at their resting position before navigating. Without
		// this class the persisted overlay restarts the drop animation when the
		// ClientRouter swaps the document.
		root.classList.remove("is-covering");
		root.classList.add("is-covered");

		// Suppress native snapshots only from the moment we navigate. While the
		// bars are falling, the live previous page must remain visible in the gaps.
		document.documentElement.classList.add("locale-transition");
		const swapped = new Promise<void>((resolve) => {
			document.addEventListener("astro:after-swap", () => resolve(), {
				once: true,
			});
		});
		await navigate(url.href, { sourceElement: link });
		await swapped;

		// Restore the class in case the ClientRouter replaced <html>. The
		// after-swap event is the first moment the incoming overlay exists, so
		// the sealed bars can start falling without a fixed settling delay.
		document.documentElement.classList.add("locale-transition");
		const next = overlay();
		if (!next) return;

		const nextCount =
			next.querySelectorAll<HTMLElement>(BAR_SELECTOR).length ||
			createBars(next);
		next.classList.add("is-active", "is-covered");
		next.classList.remove("is-covering");
		next.classList.remove("is-covered");
		next.classList.add("is-revealing");
		await wait(duration(nextCount, REVEAL_MS, REVEAL_STAGGER_MS));
	} catch {
		cleanup();
		window.location.assign(url.href);
		return;
	} finally {
		cleanup();
		transitioning = false;
	}
}

function isModifiedClick(event: MouseEvent): boolean {
	return (
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.altKey ||
		event.shiftKey
	);
}

window.addEventListener(
	"click",
	(event) => {
		if (event.defaultPrevented || isModifiedClick(event)) return;

		const target = event.target;
		if (!(target instanceof Element)) return;

		const link = target.closest<HTMLAnchorElement>("[data-locale-link]");
		if (!link) return;
		if (link.hasAttribute("download")) return;
		if (link.target && link.target !== "_self") return;

		const url = new URL(link.href, window.location.href);
		if (url.origin !== window.location.origin) return;
		if (url.href === window.location.href) {
			closeLocaleMenu();
			return;
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		// The theme transition and the ClientRouter both listen for clicks;
		// this capture listener owns the locale navigation so the bar overlay
		// can run before Astro swaps the document.
		event.preventDefault();
		event.stopPropagation();

		if (transitioning) return;
		closeLocaleMenu();
		void runTransition(url, link);
	},
	true,
);
