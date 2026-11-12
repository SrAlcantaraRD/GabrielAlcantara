/**
 * Translated article bodies, one file per locale.
 *
 * Kept separate from the case-study registry so the article template never
 * pulls the case-study diagrams (and their global CSS) into its pages.
 */
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

import type { TranslatedLocale } from "../../i18n/routing.ts";

import EnArquitectura from "./blog/en/arquitectura-orientada-a-eventos.astro";
import EnDdd from "./blog/en/ddd-dominios-complejos.astro";
import EnLecciones from "./blog/en/lecciones-plataforma-industrial.astro";
import EnWebsockets from "./blog/en/websockets-operaciones-tiempo-real.astro";
import CaArquitectura from "./blog/ca/arquitectura-orientada-a-eventos.astro";
import CaDdd from "./blog/ca/ddd-dominios-complejos.astro";
import CaLecciones from "./blog/ca/lecciones-plataforma-industrial.astro";
import CaWebsockets from "./blog/ca/websockets-operaciones-tiempo-real.astro";

type Bodies = Record<TranslatedLocale, Record<string, AstroComponentFactory>>;

export const BLOG_BODIES: Bodies = {
	en: {
		"arquitectura-orientada-a-eventos": EnArquitectura,
		"ddd-dominios-complejos": EnDdd,
		"lecciones-plataforma-industrial": EnLecciones,
		"websockets-operaciones-tiempo-real": EnWebsockets,
	},
	ca: {
		"arquitectura-orientada-a-eventos": CaArquitectura,
		"ddd-dominios-complejos": CaDdd,
		"lecciones-plataforma-industrial": CaLecciones,
		"websockets-operaciones-tiempo-real": CaWebsockets,
	},
};
