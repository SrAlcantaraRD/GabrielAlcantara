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

function preferredTheme(): Theme {
	const stored = storedTheme();
	if (stored) return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.dataset.theme = theme;
	root.style.colorScheme = theme;

	const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
	if (meta) meta.content = theme === "dark" ? "#141311" : "#faf8f5";

	for (const button of document.querySelectorAll<HTMLButtonElement>(
		"[data-theme-toggle]",
	)) {
		const next = theme === "dark" ? "light" : "dark";
		button.setAttribute("aria-pressed", String(theme === "dark"));
		button.dataset.themeState = theme;
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
	const next: Theme =
		(document.documentElement.dataset.theme as Theme) === "dark"
			? "light"
			: "dark";
	const apply = () => {
		applyTheme(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Storage can be unavailable in private contexts; the theme still works.
		}
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
	applyTheme(
		(document.documentElement.dataset.theme as Theme) || preferredTheme(),
	);
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
	.addEventListener("change", (event) => {
		if (!storedTheme()) applyTheme(event.matches ? "dark" : "light");
	});
