import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PROFILE } from "../src/i18n/profile.ts";
import { LOCALES } from "../src/i18n/routing.ts";
import { defaultLang, languages, ui } from "../src/i18n/ui.ts";
import {
	getLangFromUrl,
	useTranslatedPath,
	useTranslations,
} from "../src/i18n/utils.ts";

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function leafKeys(value: Json, prefix = ""): string[] {
	if (typeof value === "string") return [prefix];
	if (Array.isArray(value)) {
		return value.flatMap((item, index) => leafKeys(item, `${prefix}[${index}]`));
	}
	if (value && typeof value === "object") {
		return Object.entries(value).flatMap(([key, entry]) =>
			leafKeys(entry, prefix ? `${prefix}.${key}` : key),
		);
	}
	return [];
}

function leafValues(value: Json): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(leafValues);
	if (value && typeof value === "object") {
		return Object.values(value).flatMap(leafValues);
	}
	return [];
}

describe("translation keys", () => {
	it("registers the same locales in the dictionary and the languages map", () => {
		assert.deepEqual(Object.keys(languages), [...LOCALES]);
		assert.equal(defaultLang, "es");
		assert.deepEqual(Object.keys(ui), [...LOCALES]);
	});

	it("has exactly the same UI keys in Spanish, English and Catalan", () => {
		const expected = leafKeys(ui[defaultLang] as Json).sort();

		for (const locale of LOCALES) {
			assert.deepEqual(
				leafKeys(ui[locale] as Json).sort(),
				expected,
				`UI keys differ for "${locale}"`,
			);
		}
	});

	it("has exactly the same translated profile keys in English and Catalan", () => {
		assert.deepEqual(
			leafKeys(PROFILE.en as Json).sort(),
			leafKeys(PROFILE.ca as Json).sort(),
		);
	});

	it("does not leave any translated string empty", () => {
		const dictionaries: Json[] = [
			...LOCALES.map((locale) => ui[locale] as Json),
			PROFILE.en as Json,
			PROFILE.ca as Json,
		];

		for (const dictionary of dictionaries) {
			for (const value of leafValues(dictionary)) {
				assert.ok(value.trim().length > 0, "found an empty translation");
			}
		}
	});

	it("resolves the page language and its translations", () => {
		assert.equal(getLangFromUrl(new URL("https://example.com/")), "es");
		assert.equal(
			getLangFromUrl(new URL("https://example.com/en/projects/")),
			"en",
		);
		assert.equal(
			getLangFromUrl(new URL("https://example.com/ca/")),
			"ca",
		);

		assert.equal(useTranslations("es")("nav.home"), "Inicio");
		assert.equal(useTranslations("en")("nav.home"), "Home");
		assert.equal(useTranslations("ca")("footer.fullCv"), "CV complet");
	});

	it("builds the localised path and keeps the section mapping", () => {
		const toEnglish = useTranslatedPath("en");

		assert.equal(toEnglish("/about/"), "/en/#sobre");
		assert.equal(toEnglish("/", "es"), "/");
		assert.equal(
			useTranslatedPath("ca")("/projects/nakire-tps/"),
			"/ca/projects/nakire-tps/",
		);
		assert.equal(
			useTranslatedPath("en")("/blog/"),
			"/en/blog/",
		);
	});
});
