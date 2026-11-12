#!/usr/bin/env node
/**
 * URL baseline: every page the build emits, with its canonical and hreflang
 * alternates.
 *
 * `--write` captures the current `dist/` into the committed fixture; the
 * default mode compares the current build against that fixture. A page that
 * changes URL, canonical or alternates fails the comparison, which is what
 * makes an i18n or routing refactor provably equivalent: the fixture is
 * captured before the refactor and diffed after it.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const FIXTURE = path.join(ROOT, "tests", "fixtures", "url-baseline.json");

/** Emitted URL for a built HTML file, keeping the trailing-slash form. */
function routeOf(file) {
	const relative = file.split(path.sep).join("/");
	if (relative === "index.html") return "/";
	if (relative.endsWith("/index.html")) {
		return `/${relative.slice(0, -"/index.html".length)}/`;
	}
	return `/${relative}`;
}

function attr(tag, name) {
	const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
	return match?.[1];
}

function readPage(file) {
	const html = fs.readFileSync(file, "utf8");
	const links = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => match[0]);

	const canonicalTag = links.find(
		(tag) => attr(tag, "rel") === "canonical",
	);
	const alternates = {};
	for (const tag of links) {
		if (attr(tag, "rel") !== "alternate") continue;
		const lang = attr(tag, "hreflang");
		const href = attr(tag, "href");
		if (lang && href) alternates[lang] = href;
	}

	const robots = html.match(/<meta\b[^>]*name="robots"[^>]*>/)?.[0];
	const page = {
		path: routeOf(path.relative(DIST, file)),
		canonical: canonicalTag ? attr(canonicalTag, "href") : null,
	};

	if (Object.keys(alternates).length > 0) {
		const ordered = {};
		for (const lang of ["es", "en", "ca", "x-default"]) {
			if (alternates[lang]) ordered[lang] = alternates[lang];
		}
		for (const lang of Object.keys(alternates).sort()) {
			if (!ordered[lang]) ordered[lang] = alternates[lang];
		}
		page.alternates = ordered;
	}

	if (robots && attr(robots, "content")?.includes("noindex")) {
		page.noindex = true;
	}

	return page;
}

function capture() {
	if (!fs.existsSync(DIST)) {
		console.error("No hay `dist/`. Ejecuta `npm run build` antes de capturar el baseline.");
		process.exit(1);
	}

	const files = fs
		.readdirSync(DIST, { recursive: true })
		.map((file) => path.join(DIST, file.toString()))
		.filter((file) => file.endsWith(".html") && fs.statSync(file).isFile());

	return files.map(readPage).sort((a, b) => a.path.localeCompare(b.path));
}

function diff(current, baseline) {
	const byPath = new Map(baseline.map((page) => [page.path, page]));
	const problems = [];

	for (const page of current) {
		const previous = byPath.get(page.path);
		if (!previous) {
			problems.push(`nueva: ${page.path}`);
			continue;
		}
		byPath.delete(page.path);
		if (JSON.stringify(page) !== JSON.stringify(previous)) {
			problems.push(`cambiada: ${page.path}`);
		}
	}

	for (const page of byPath.values()) {
		problems.push(`desaparecida: ${page.path}`);
	}

	return problems;
}

const pages = capture();

if (process.argv.includes("--write")) {
	fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
	fs.writeFileSync(FIXTURE, `${JSON.stringify(pages, null, 2)}\n`);
	console.log(
		`Baseline escrito: ${pages.length} páginas en ${path.relative(ROOT, FIXTURE)}.`,
	);
} else {
	if (!fs.existsSync(FIXTURE)) {
		console.error(
			`No existe el baseline (${path.relative(ROOT, FIXTURE)}). Ejecuta \`npm run url:baseline:write\`.`,
		);
		process.exit(1);
	}

	const baseline = JSON.parse(fs.readFileSync(FIXTURE, "utf8"));
	const problems = diff(pages, baseline);

	if (problems.length > 0) {
		console.error("La build no coincide con el baseline de URLs:\n");
		for (const problem of problems) console.error(`- ${problem}`);
		process.exit(1);
	}

	console.log(`URLs sin cambios respecto al baseline (${pages.length} páginas).`);
}
