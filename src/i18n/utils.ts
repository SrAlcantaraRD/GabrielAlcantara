import { localeFromPath, localizedEntry, type Locale } from "./routing.ts";
import { defaultLang, ui, type UiKey } from "./ui.ts";

export type { UiKey };

/** The language of the current URL, with Spanish as the default. */
export function getLangFromUrl(url: URL): Locale {
	return localeFromPath(url.pathname);
}

/**
 * The recipe's `t()` helper. The default language is the fallback, so a
 * missing translation never renders an empty label; the key test keeps the
 * dictionaries complete anyway.
 */
export function useTranslations(lang: Locale) {
	return function t(key: UiKey): string {
		return ui[lang][key] || ui[defaultLang][key];
	};
}

/** Translate a path into another locale, using the site's section mapping. */
export function useTranslatedPath(lang: Locale) {
	return function translatePath(path: string, target: Locale = lang): string {
		return localizedEntry(target, path);
	};
}
