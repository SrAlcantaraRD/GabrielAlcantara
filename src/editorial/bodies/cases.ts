/**
 * Translated case-study bodies, one file per locale.
 *
 * Kept separate from the article registry so the article template never pulls
 * these diagrams (and their global CSS) into its pages.
 */
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import type { TranslatedLocale } from "../../i18n/routing.ts";

import EnBodega from "./cases/en/bodega-digital.astro";
import EnNakire from "./cases/en/nakire-tps.astro";
import EnPachanga from "./cases/en/pachanga-community.astro";
import CaBodega from "./cases/ca/bodega-digital.astro";
import CaNakire from "./cases/ca/nakire-tps.astro";
import CaPachanga from "./cases/ca/pachanga-community.astro";

type Bodies = Record<TranslatedLocale, Record<string, AstroComponentFactory>>;

export const CASE_BODIES: Bodies = {
	en: {
		"bodega-digital": EnBodega,
		"nakire-tps": EnNakire,
		"pachanga-community": EnPachanga,
	},
	ca: {
		"bodega-digital": CaBodega,
		"nakire-tps": CaNakire,
		"pachanga-community": CaPachanga,
	},
};
