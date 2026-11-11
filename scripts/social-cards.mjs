/**
 * Shared index for the social share cards.
 *
 * `docs/og-image/export.mjs` renders these specs onto the artboard in
 * `docs/og-image/card.html`; this module owns the copy and the manifest. The
 * manifest records two hashes per card — the copy that was rendered and the PNG
 * that came out — so `pnpm test` reports both a card that kept announcing an old
 * title and a PNG edited or replaced by hand.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const MANIFEST_FILE = path.join(ROOT, "scripts", "social-cards.json");
export const PUBLIC_DIR = path.join(ROOT, "public");

/**
 * Card-sized phrasing. The site's own labels ("arquitectura orientada a eventos
 * (EDA)", "domain-driven design (DDD)") do not fit one 34px line.
 */
const SPECIALTIES = "sistemas distribuidos · EDA · DDD";

const cardDate = new Intl.DateTimeFormat("es-ES", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

/** A single year when the project started and ended in the same one. */
function yearSpan(project) {
	const from = Math.floor(project.startMonth / 12);
	const to = Math.floor((project.endMonth - 1) / 12);
	return from === to ? String(from) : `${from} — ${to}`;
}

/** The exact strings the artboard renders, in the order the fields are read. */
function copyKey(copy) {
	return [
		copy.kind,
		copy.eyebrow,
		copy.title,
		copy.sub,
		copy.footLeft,
		copy.footRight,
	]
		.map((value) => value ?? "")
		.join("\n");
}

export function hashCopy(copy) {
	return crypto.createHash("sha256").update(copyKey(copy)).digest("hex");
}

/** Public path, page and the copy rendered inside each card. */
export async function socialCardSpecs() {
	const [blog, projects, site] = await Promise.all([
		import(pathToFileURL(path.join(ROOT, "src/data/blog.ts")).href),
		import(pathToFileURL(path.join(ROOT, "src/data/projects.ts")).href),
		import(pathToFileURL(path.join(ROOT, "src/data/site.ts")).href),
	]);

	const domain = new URL(site.SITE.url).host;

	const fallback = {
		file: "/og-image.png",
		page: "/",
		copy: {
			kind: "default",
			domain,
			eyebrow: null,
			title: site.SITE.name,
			sub: site.SITE.roles.join(" · ").toLowerCase(),
			footLeft: SPECIALTIES,
			footRight: `desde ${site.SITE.careerStart}`,
		},
	};

	const cases = ["nakire-tps", "bodega-digital", "pachanga-community"].map((id) => {
		const project = projects.caseStudyOf(id);
		// “Caso de estudio · Pachanga Community” over a “Pachanga Community”
		// title says the same thing twice.
		const eyebrow =
			project.company === project.name
				? "Caso de estudio"
				: `Caso de estudio · ${project.company}`;
		return {
			file: `/og/${id}.png`,
			page: project.caseStudyHref ?? `/projects/${id}/`,
			copy: {
				kind: "case",
				domain,
				eyebrow,
				title: project.name,
				sub: project.tagline ?? project.outcome,
				footLeft: (project.stack ?? []).slice(0, 4).join(" · "),
				footRight: yearSpan(project),
			},
		};
	});

	const posts = [...blog.POSTS].sort((a, b) => b.date.localeCompare(a.date));

	return [
		fallback,
		...cases,
		...posts.map((post) => ({
			file: `/og/${post.slug}.png`,
			page: blog.postHref(post.slug),
			copy: {
				kind: "post",
				domain,
				eyebrow: blog.categoryOf(post.category).label,
				title: post.title,
				sub: null,
				footLeft: post.tags.slice(0, 2).join(" · "),
				footRight: `${cardDate.format(new Date(`${post.date}T00:00:00Z`))} · ${post.readingMinutes} min`,
			},
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
function manifestEntry(spec) {
	return {
		file: spec.file,
		page: spec.page,
		title: spec.copy.title,
		copyHash: hashCopy(spec.copy),
		sha256: hashFile(path.join(PUBLIC_DIR, spec.file.replace(/^\//, ""))),
	};
}

function writeCards(cards, file) {
	fs.writeFileSync(file, `${JSON.stringify({ cards }, null, "\t")}\n`);
	return cards;
}

export function writeManifest(specs, file = MANIFEST_FILE) {
	return writeCards(specs.map(manifestEntry), file);
}

/**
 * Records one card and leaves the rest alone. A partial export uses it so the
 * manifest keeps describing the bytes that are actually on disk.
 */
export function updateManifest(spec, file = MANIFEST_FILE) {
	const current = readManifest(file);
	const cards = (current.cards ?? []).filter((card) => card.file !== spec.file);
	return writeCards([...cards, manifestEntry(spec)], file);
}

/** Copy and page mismatches between the current metadata and the manifest. */
export function compareCards(expected, manifest) {
	const problems = [];
	const stored = new Map((manifest.cards ?? []).map((card) => [card.file, card]));
	const current = new Set(expected.map((card) => card.file));

	for (const card of expected) {
		const entry = stored.get(card.file);
		if (!entry) {
			problems.push(
				`Falta ${card.file}: ${card.page} se titula «${card.copy.title}». Ejecuta \`pnpm social:cards\`.`,
			);
			continue;
		}
		if (entry.title !== card.copy.title) {
			problems.push(
				`${card.file} anuncia «${entry.title}», pero ${card.page} se titula «${card.copy.title}». Ejecuta \`pnpm social:cards\`.`,
			);
		}
		if (entry.page !== card.page) {
			problems.push(
				`${card.file} apunta a ${entry.page}, pero su página es ${card.page}. Ejecuta \`pnpm social:cards\`.`,
			);
		}
		if (entry.copyHash !== hashCopy(card.copy)) {
			problems.push(
				`${card.file} se exportó con otro texto: el copy de ${card.page} cambió. Ejecuta \`pnpm social:cards\`.`,
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
			problems.push(`Falta public${card.file}. Ejecuta \`pnpm social:cards\`.`);
			continue;
		}
		if (entry.sha256 !== hashFile(file)) {
			problems.push(
				`public${card.file} no es la imagen generada para «${card.copy.title}». Ejecuta \`pnpm social:cards\`.`,
			);
		}
	}

	return problems;
}
