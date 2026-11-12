/**
 * Locale routing shared by the server-rendered pages and the tiny browser
 * script that keeps the persisted header in sync.
 *
 * Spanish keeps its existing URLs. English and Catalan live at `/en/` and
 * `/ca/` and use the section anchors of their translated profile page.
 */

export const LOCALES = ["es", "en", "ca"] as const;
export type Locale = (typeof LOCALES)[number];
export type TranslatedLocale = Exclude<Locale, "es">;

/** Locales with a translated site, in display order. */
export const TRANSLATED_LOCALES = [
	"en",
	"ca",
] as const satisfies readonly TranslatedLocale[];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_META: Record<
	Locale,
	{ label: string; short: string; htmlLang: string; ogLocale: string }
> = {
	es: { label: "Español", short: "ES", htmlLang: "es", ogLocale: "es_ES" },
	en: { label: "English", short: "EN", htmlLang: "en", ogLocale: "en_GB" },
	ca: { label: "Català", short: "CA", htmlLang: "ca", ogLocale: "ca_ES" },
};

export type Section =
	| "about"
	| "experience"
	| "projects"
	| "blog"
	| "services"
	| "contact"
	| "cv";

/** The Spanish page that owns each translated profile section. */
export const SECTION_PATHS: Record<Section, string> = {
	about: "/about/",
	experience: "/experience/",
	projects: "/projects/",
	blog: "/blog/",
	services: "/services/",
	contact: "/contact/",
	cv: "/cv/",
};

/** Anchor used by the translated one-page profile. */
export const SECTION_ANCHORS: Record<Section, string> = {
	about: "sobre",
	experience: "experiencia",
	projects: "proyectos",
	blog: "blog",
	services: "servicios",
	contact: "contacto",
	cv: "cv",
};

export function isLocale(value: string | undefined): value is Locale {
	return value === "es" || value === "en" || value === "ca";
}

export function localeFromPath(pathname: string): Locale {
	const first = pathname.split("/")[1];
	return isLocale(first) ? first : DEFAULT_LOCALE;
}

export function localeRoot(locale: Locale): string {
	return locale === "es" ? "/" : `/${locale}/`;
}

/** Path without a leading locale segment, so section matching is shared. */
function pathWithoutLocale(pathname: string): string {
	const withoutLocale = pathname.replace(/^\/(en|ca)(?=\/|$)/, "");
	return withoutLocale || "/";
}

export function sectionFromPath(pathname: string): Section | undefined {
	const path = pathWithoutLocale(pathname);
	if (path === "/" || path === "") return undefined;

	const match = (Object.keys(SECTION_PATHS) as Section[]).find((section) =>
		path.startsWith(SECTION_PATHS[section]),
	);
	return match;
}

/** Translated editorial routes that keep their path when the locale changes. */
function translatedEditorialPath(locale: Locale, path: string): string | undefined {
	if (path === "/blog/categoria/" || path.startsWith("/blog/categoria/")) {
		return locale === "es" ? "/blog/" : `/${locale}/blog/`;
	}
	if (/^\/blog\/(?:[^/]+\/)?$/.test(path)) {
		return locale === "es" ? path : `/${locale}${path}`;
	}
	if (/^\/projects\/(?:[^/]+\/)?$/.test(path)) {
		return locale === "es" ? path : `/${locale}${path}`;
	}
	return undefined;
}

/** Hreflang map for a translated editorial route. */
export function alternateEditorialPaths(path: string): Record<Locale | "x-default", string> {
	return { es: path, en: `/en${path}`, ca: `/ca${path}`, "x-default": path };
}

/**
 * Equivalent URL for a locale, preserving the current section.
 *
 * Editorial routes (`/blog/…`, `/projects/…`) keep their path and only change
 * the locale prefix. The translated profile still uses section anchors for
 * pages that only exist in Spanish.
 */
export function localizedEntry(
	locale: Locale,
	pathname: string,
	hash = "",
): string {
	const current = localeFromPath(pathname);
	const path = pathWithoutLocale(pathname);
	if (path === "/404/" || path === "/404.html") return localeRoot(locale);
	const editorial = !hash ? translatedEditorialPath(locale, path) : undefined;
	if (editorial) return editorial;
	const anchorSection = (Object.entries(SECTION_ANCHORS) as [Section, string][]).find(
		([, anchor]) => hash === `#${anchor}`,
	)?.[0];
	const section = sectionFromPath(pathname) ?? anchorSection;

	if (locale === "es") {
		if (current !== "es" && section) return SECTION_PATHS[section];
		if (current !== "es") return "/";
		return `${pathname}${hash}`;
	}

	if (section && !hash) return `/${locale}/#${SECTION_ANCHORS[section]}`;
	return `/${locale}/${hash}`;
}

export function alternateProfilePaths(): Record<Locale | "x-default", string> {
	return { es: "/", en: "/en/", ca: "/ca/", "x-default": "/" };
}
