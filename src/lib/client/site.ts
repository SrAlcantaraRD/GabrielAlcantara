/**
 * Browser behaviour that has to survive Astro's persisted chrome and client
 * navigation: theme persistence, the circular theme reveal, locale links that
 * keep the current section, and theme-toggle labels.
 */

import { localeFromPath, localizedEntry, type Locale } from "../../i18n/routing";
import { ui } from "../../i18n/ui";

type Theme = "light" | "dark";
const STORAGE_KEY = "theme";

function storedTheme(): Theme | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === "light" || value === "dark" ? value : null;
	} catch {
		return null;
	}
}

/**
 * The colours are the `theme-color` pair the head ships (see Layout.astro); this
 * only reads the one for the scheme instead of repeating the hex here.
 */
function themeColor(theme: Theme): string {
	const meta = document.querySelector<HTMLMetaElement>(
		`meta[name="theme-color"][data-theme-scheme="${theme}"]`,
	);
	return meta?.content ?? "";
}

function systemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

/** What is on screen: the pinned scheme, or the system's. */
function renderedTheme(): Theme {
	return storedTheme() ?? systemTheme();
}

/**
 * `null` means "follow the system". The <meta> carries the state — `light dark`
 * for the system, `light`/`dark` for a pin — and global.css turns it into CSS
 * with `:root:has(…)`. The head ships a theme-color pair for the system, so a
 * pin only has to add the tag that wins over both.
 */
function applyTheme(theme: Theme | null) {
	const meta = document.querySelector<HTMLMetaElement>(
		'meta[name="color-scheme"]',
	);
	if (meta) meta.content = theme ?? "light dark";

	const pinned = document.querySelector<HTMLMetaElement>(
		'meta[name="theme-color"][data-theme-override]',
	);
	if (theme) {
		const tag = pinned ?? document.createElement("meta");
		tag.name = "theme-color";
		tag.dataset.themeOverride = "";
		tag.content = themeColor(theme);
		if (!pinned) {
			const first = document.querySelector('meta[name="theme-color"]');
			document.head.insertBefore(tag, first ?? document.head.firstChild);
		}
	} else {
		pinned?.remove();
	}

	const current = theme ?? systemTheme();
	const next = current === "dark" ? "light" : "dark";
	for (const button of document.querySelectorAll<HTMLButtonElement>(
		"[data-theme-toggle]",
	)) {
		button.setAttribute("aria-pressed", String(current === "dark"));
		button.dataset.themeState = current;
		const label =
			next === "dark"
				? button.dataset.themeLabelDark
				: button.dataset.themeLabelLight;
		if (label) {
			button.setAttribute("aria-label", label);
			button.setAttribute("title", label);
		}
	}
}

function localeOfPage(): Locale {
	return localeFromPath(window.location.pathname);
}

function refreshLocaleLink(link: HTMLAnchorElement) {
	const locale = link.dataset.localeLink as Locale;
	if (!locale) return;
	link.href = localizedEntry(
		locale,
		window.location.pathname,
		window.location.hash,
	);
}

function syncLocaleLinks() {
	for (const link of document.querySelectorAll<HTMLAnchorElement>(
		"[data-locale-link]",
	)) {
		refreshLocaleLink(link);
	}
}

let localeLinksBound = false;

/**
 * ClientRouter can update an in-page hash without a hashchange event. Refresh
 * the target on pointerdown/focus, before the click is handled, and keep a
 * capture listener as a final fallback.
 */
function bindLocaleLinks() {
	if (localeLinksBound) return;
	localeLinksBound = true;

	const refreshFromEvent = (event: Event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const link = target.closest<HTMLAnchorElement>("[data-locale-link]");
		if (link) refreshLocaleLink(link);
	};

	document.addEventListener("pointerdown", refreshFromEvent, true);
	document.addEventListener("pointerover", refreshFromEvent, true);
	document.addEventListener("focusin", refreshFromEvent, true);
	document.addEventListener("click", refreshFromEvent, true);
	window.addEventListener("hashchange", syncLocaleLinks);
	window.addEventListener("popstate", syncLocaleLinks);
}

function toggleTheme(button: HTMLButtonElement, event: MouseEvent) {
	// The target is the opposite of what is rendered, so the click always does
	// what the label says. When it matches the system, the pin is dropped:
	// storing it would hold the site against a later OS change.
	const target: Theme = renderedTheme() === "dark" ? "light" : "dark";
	const system = systemTheme();

	const apply = () => {
		try {
			if (target === system) localStorage.removeItem(STORAGE_KEY);
			else localStorage.setItem(STORAGE_KEY, target);
		} catch {
			// Storage can be unavailable in private contexts; the theme still works.
		}
		applyTheme(target === system ? null : target);
	};

	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;

	if (!document.startViewTransition || reduceMotion) {
		apply();
		return;
	}

	const rect = button.getBoundingClientRect();
	const x = event.clientX || rect.left + rect.width / 2;
	const y = event.clientY || rect.top + rect.height / 2;
	const root = document.documentElement;
	root.style.setProperty("--theme-x", `${x}px`);
	root.style.setProperty("--theme-y", `${y}px`);
	root.classList.add("theme-transition");

	const transition = document.startViewTransition(apply);
	transition.finished.finally(() => root.classList.remove("theme-transition"));
}

function initThemeToggles() {
	for (const button of document.querySelectorAll<HTMLButtonElement>(
		"[data-theme-toggle]",
	)) {
		if (button.dataset.bound === "true") continue;
		button.dataset.bound = "true";
		button.addEventListener("click", (event) => toggleTheme(button, event));
	}
	// The inline script already set the <meta> before the first paint; this only
	// puts the buttons in the state that matches it.
	applyTheme(storedTheme());
}

function initLocaleLabels() {
	const locale = localeOfPage();
	const copy = ui[locale];

	for (const element of document.querySelectorAll<HTMLElement>("[data-ui]")) {
		const key = element.dataset.ui;
		if (!key) continue;
		const value = copy[key as keyof typeof copy];
		if (typeof value === "string") element.textContent = value;
	}
}

function init() {
	initThemeToggles();
	bindLocaleLinks();
	syncLocaleLinks();
	initLocaleLabels();
}

init();
document.addEventListener("astro:page-load", init);
window.addEventListener("hashchange", syncLocaleLinks);

window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", () => {
		// A site that follows the system moves with it; a pinned scheme ignores it.
		if (!storedTheme()) applyTheme(null);
	});

// Another tab pinned or un-pinned a scheme: follow it.
window.addEventListener("storage", (event) => {
	if (event.key !== STORAGE_KEY) return;
	applyTheme(storedTheme());
});
