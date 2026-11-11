#!/usr/bin/env node
/**
 * Fails the build when the social card manifest no longer describes the site.
 *
 * The manifest is only as good as its last export: a renamed title, an edited
 * tagline, a changed artboard or a missing PNG all leave `scripts/social-cards.json`
 * claiming something the deployed page does not. `pnpm build` runs this before
 * Astro so a stale card never ships.
 */
import process from "node:process";

import { readManifest, socialCardSpecs, verifyCards } from "./social-cards.mjs";

const expected = await socialCardSpecs();
const problems = verifyCards(expected, readManifest());

if (problems.length > 0) {
	console.error("Las tarjetas sociales no coinciden con el manifiesto:\n");
	for (const problem of problems) console.error(`- ${problem}`);
	console.error(
		"\nEl build se detiene para no publicar tarjetas desactualizadas. Ejecuta `pnpm social:cards`.",
	);
	process.exit(1);
}

console.log(`Tarjetas sociales al día (${expected.length} comprobadas).`);
