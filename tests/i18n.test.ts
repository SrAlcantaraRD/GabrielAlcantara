import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	alternateProfilePaths,
	localeFromPath,
	localizedEntry,
} from "../src/i18n/routing.ts";
import { navItems } from "../src/i18n/ui.ts";

describe("locale routing", () => {
	it("recognises the three locales and defaults to Spanish", () => {
		assert.equal(localeFromPath("/"), "es");
		assert.equal(localeFromPath("/projects/nakire-tps/"), "es");
		assert.equal(localeFromPath("/en/"), "en");
		assert.equal(localeFromPath("/ca/blog/"), "ca");
	});

	it("keeps Spanish URLs unchanged", () => {
		assert.equal(localizedEntry("es", "/about/"), "/about/");
		assert.equal(localizedEntry("es", "/en/"), "/");
	});

	it("preserves translated editorial routes across locales", () => {
		assert.equal(
			localizedEntry("en", "/projects/nakire-tps/"),
			"/en/projects/nakire-tps/",
		);
		assert.equal(
			localizedEntry("ca", "/blog/ddd-dominios-complejos/"),
			"/ca/blog/ddd-dominios-complejos/",
		);
		assert.equal(localizedEntry("ca", "/blog/"), "/ca/blog/");
		assert.equal(localizedEntry("es", "/en/blog/"), "/blog/");
	});

	it("maps pages without a translated body to their profile section", () => {
		assert.equal(localizedEntry("ca", "/cv/"), "/ca/#cv");
	});

	it("sends the error page to the home of each locale", () => {
		assert.equal(localizedEntry("es", "/404/"), "/");
		assert.equal(localizedEntry("en", "/404/"), "/en/");
		assert.equal(localizedEntry("ca", "/404/"), "/ca/");
	});

	it("returns from a translated anchor to the Spanish owner page", () => {
		assert.equal(localizedEntry("es", "/en/", "#servicios"), "/services/");
		assert.equal(localizedEntry("es", "/ca/", "#contacto"), "/contact/");
	});

	it("preserves the current translated section between languages", () => {
		assert.equal(localizedEntry("ca", "/en/", "#experiencia"), "/ca/#experiencia");
	});

	it("offers the three translated profiles as alternates", () => {
		assert.deepEqual(alternateProfilePaths(), {
			es: "/",
			en: "/en/",
			ca: "/ca/",
			"x-default": "/",
		});
	});

	it("builds localised navigation for every locale", () => {
		assert.deepEqual(
			navItems("en").map((item) => item.label),
			["Home", "About", "Experience", "Projects", "Writing", "Services", "Contact"],
		);
		assert.equal(navItems("en")[3].href, "/en/#proyectos");
		assert.equal(navItems("ca")[0].href, "/ca/");
	});
});
