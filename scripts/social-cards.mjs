/**
 * Shared index for the social share cards.
 *
 * The generator uses these specs to render each card; the tests compare them
 * with `scripts/social-cards.json` (title, page and SHA-256) so a card cannot
 * keep announcing an old title after the page copy changes.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

export const MANIFEST_FILE = path.join(ROOT, "scripts", "social-cards.json");
export const PUBLIC_DIR = path.join(ROOT, "public");

/** Public path, display page, and the copy rendered inside each detail card. */
export async function socialCardSpecs() {
	const [blog, projects] = await Promise.all([
		import(pathToFileURL(path.join(ROOT, "src/data/blog.ts")).href),
		import(pathToFileURL(path.join(ROOT, "src/data/projects.ts")).href),
	]);

	const bodega = projects.caseStudyOf("bodega-digital");
	const posts = [...blog.POSTS].sort((a, b) => b.date.localeCompare(a.date));

	return [
		{
			file: "/og/bodega-digital.png",
			page: bodega.caseStudyHref ?? "/projects/bodega-digital/",
			eyebrow: `Caso de estudio · ${bodega.company}`,
			title: bodega.name,
			subtitle:
				"Software distribuido para operaciones industriales en tiempo real.",
			meta: bodega.position,
			footerLeft: (bodega.stack ?? []).slice(0, 4).join(" · "),
			footerRight: `${Math.floor(bodega.startMonth / 12)} — ${Math.floor(
				(bodega.endMonth - 1) / 12,
			)}`,
		},
		...posts.map((post) => ({
			file: `/og/${post.slug}.png`,
			page: blog.postHref(post.slug),
			eyebrow: blog.categoryOf(post.category).label,
			title: post.title,
			meta: blog.formatDate(post.date),
			footerLeft: post.tags.slice(0, 3).join(" · "),
			footerRight: `${post.readingMinutes} min de lectura`,
		})),
	];
}

export function hashFile(file) {
	return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

export function readManifest(file = MANIFEST_FILE) {
	if (!fs.existsSync(file)) return { cards: [] };
	return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * Records what each card currently announces. Runs after the PNGs are written
 * so a failed render never leaves a manifest that looks valid.
 */
export function writeManifest(specs, file = MANIFEST_FILE) {
	const cards = specs.map((spec) => ({
		file: spec.file,
		page: spec.page,
		title: spec.title,
		sha256: hashFile(path.join(PUBLIC_DIR, spec.file.replace(/^\//, ""))),
	}));
	fs.writeFileSync(file, `${JSON.stringify({ cards }, null, "\t")}\n`);
	return cards;
}

/** Title and page mismatches between the current metadata and the manifest. */
export function compareCards(expected, manifest) {
	const problems = [];
	const stored = new Map((manifest.cards ?? []).map((card) => [card.file, card]));
	const current = new Set(expected.map((card) => card.file));

	for (const card of expected) {
		const entry = stored.get(card.file);
		if (!entry) {
			problems.push(
				`Falta ${card.file}: ${card.page} se titula «${card.title}». Ejecuta \`pnpm social:cards\`.`,
			);
			continue;
		}
		if (entry.title !== card.title) {
			problems.push(
				`${card.file} anuncia «${entry.title}», pero ${card.page} se titula «${card.title}». Ejecuta \`pnpm social:cards\`.`,
			);
		}
		if (entry.page !== card.page) {
			problems.push(
				`${card.file} apunta a ${entry.page}, pero su página es ${card.page}. Ejecuta \`pnpm social:cards\`.`,
			);
		}
	}

	for (const entry of manifest.cards ?? []) {
		if (!current.has(entry.file)) {
			problems.push(
				`${entry.file} ya no corresponde a ninguna página. Ejecuta \`pnpm social:cards\`.`,
			);
		}
	}

	return problems;
}

/** Adds a check that the PNG on disk is still the one described by the manifest. */
export function verifyCards(expected, manifest) {
	const problems = compareCards(expected, manifest);
	const stored = new Map((manifest.cards ?? []).map((card) => [card.file, card]));

	for (const card of expected) {
		const entry = stored.get(card.file);
		if (!entry) continue;

		const file = path.join(PUBLIC_DIR, card.file.replace(/^\//, ""));
		if (!fs.existsSync(file)) {
			problems.push(
				`Falta public${card.file}. Ejecuta \`pnpm social:cards\`.`,
			);
			continue;
		}
		if (entry.sha256 !== hashFile(file)) {
			problems.push(
				`public${card.file} no es la imagen generada para «${card.title}». Ejecuta \`pnpm social:cards\`.`,
			);
		}
	}

	return problems;
}
