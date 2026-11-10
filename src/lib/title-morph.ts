/**
 * Shared-element view transition between a link and the title of the page it
 * opens: the text someone clicks travels and morphs into the destination
 * heading instead of being cross-faded with the rest of the page.
 *
 * Astro's `transition:name` needs a literal name on both sides, which does not
 * scale to "every internal link": the same destination is often linked several
 * times on one page (breadcrumb, kicker, card, CTA) and duplicated names break
 * the transition. Here only the element that took part in the navigation and
 * the heading that received it are named, always with the same constant, so the
 * old and new snapshots always pair up exactly once.
 */

const TRANSITION_NAME = "page-title-morph";
const MARKER = "data-title-morph";
const HEADING_SELECTOR = "#contenido h1";
const SOURCE_HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6";

function release(element: Element | null): void {
	if (!(element instanceof HTMLElement) || !element.hasAttribute(MARKER)) return;
	element.style.removeProperty("view-transition-name");
	element.removeAttribute(MARKER);
}

function releaseAll(): void {
	for (const element of document.querySelectorAll(`[${MARKER}]`)) {
		release(element);
	}
}

function claim(element: Element | null): void {
	if (!(element instanceof HTMLElement)) return;
	element.style.setProperty("view-transition-name", TRANSITION_NAME);
	element.setAttribute(MARKER, "");
}

document.addEventListener("astro:before-preparation", (event) => {
	releaseAll();

	const { from, sourceElement } = event;
	if (!from || !(sourceElement instanceof Element)) return;

	const link = sourceElement.closest("a[href]");
	if (!(link instanceof HTMLAnchorElement)) return;

	let to: URL;
	try {
		to = new URL(link.href);
	} catch {
		return;
	}
	if (to.origin !== from.origin || to.pathname === from.pathname) return;

	// A title link sits inside its heading; naming the block keeps a wrapped
	// title as a single box instead of one box per line.
	claim(link.closest(SOURCE_HEADING_SELECTOR) ?? link);
});

document.addEventListener("astro:after-swap", () => {
	// The old document is gone by now, so this only clears the destination
	// heading claimed by the previous navigation before naming the new one.
	releaseAll();
	claim(document.querySelector(HEADING_SELECTOR));
});
