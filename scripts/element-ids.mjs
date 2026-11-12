#!/usr/bin/env node
/**
 * Every element of an Astro template must declare an id, so a change can name
 * the exact element it touches instead of describing a position.
 *
 *   node scripts/element-ids.mjs                   # every template under src/
 *   node scripts/element-ids.mjs src/pages/x.astro # only the files given
 *   node scripts/element-ids.mjs --staged          # the templates in this commit
 *   node scripts/element-ids.mjs --dist [dir]      # ids repeated per page
 *
 * The pre-commit hook runs it over the staged templates; `pnpm build` runs it
 * over the rendered pages.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const TEMPLATE_EXT = ".astro";

/**
 * Names that never become an element of the page: code containers, and the
 * placeholder a slot replaces with the markup it receives.
 */
const NOT_ELEMENTS = new Set(["script", "style", "slot"]);

export function astroTemplates(root) {
	return walk(path.join(root, "src"))
		.filter((file) => file.endsWith(TEMPLATE_EXT))
		.map((file) => path.relative(root, file).split(path.sep).join("/"))
		.sort();
}

function walk(dir) {
	let entries = [];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return [];
	}

	return entries.flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
}

/**
 * `scan` reports every element of one template that breaks the rule: no id, or
 * a literal id that another element in the same file already uses.
 */
export function scan(file, source) {
	const found = [];
	const literals = new Map();

	for (const element of elementsOf(source)) {
		const { line, name, attrs } = element;
		const tag = `${name}${describe(attrs)}`;

		if (!attrs.has("id")) {
			found.push({ line, tag, reason: "falta id" });
			continue;
		}

		const value = attrs.get("id");
		if (value === null || value.startsWith("{")) continue;

		const seen = literals.get(value);
		if (seen) {
			seen.count += 1;
			found.push({
				line,
				tag,
				reason: `repite el id "${value}" de la línea ${seen.line}`,
			});
			continue;
		}
		literals.set(value, { line, count: 1 });
	}

	return found;
}

/**
 * Every element of one template with the offsets its opening tag spans, which
 * is what a backfill needs to place a missing attribute.
 */
export function elementsOf(source) {
	const { text, spans } = tagSpans(source);

	return spans
		.filter((span) => !span.closing && span.element)
		.map((span) => ({
			...span,
			attrs: attributes(text, span.nameEnd, span.end),
			line: lineAt(text, span.start),
		}));
}

/** Every tag of a template, closing tags included, so nesting can be walked. */
export function tagSpans(source) {
	const text = maskTemplate(source);
	const spans = [];

	for (const match of text.matchAll(/<\/?([a-zA-Z][\w.:-]*)/g)) {
		const start = match.index;
		const name = match[1];
		const closing = text[start + 1] === "/";
		const end = tagEnd(text, start);
		if (end === -1) continue;

		spans.push({
			start,
			end,
			name,
			nameEnd: start + match[0].length,
			closing,
			selfClosing: !closing && text[end - 1] === "/",
			// A component's own elements are checked where they are written, and
			// the names below never become an element of the page.
			element: !closing && name === name.toLowerCase() && !NOT_ELEMENTS.has(name),
		});
	}

	return { text, spans };
}

/** The ids a rendered page repeats, which is what breaks an authority to name one. */
export function duplicateIds(html) {
	const counts = new Map();
	for (const match of html.matchAll(/\sid="([^"]+)"/g)) {
		counts.set(match[1], (counts.get(match[1]) ?? 0) + 1);
	}

	return new Map([...counts].filter(([, count]) => count > 1));
}

/**
 * Blanks the regions that hold no markup while keeping every offset and line
 * break, so a `<p>` inside a script, a style or the frontmatter is not an
 * element and a reported line still points at the source.
 */
export function maskTemplate(source) {
	const ranges = [];
	const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---(?=\r?\n|$)/);
	if (frontmatter) ranges.push([0, frontmatter[0].length]);

	let text = blank(source, ranges);

	for (const match of text.matchAll(/<\/?(?:script|style)\b/g)) {
		const end = tagEnd(text, match.index);
		if (end === -1) continue;
		const closing = new RegExp(`</${match[0].slice(1).split(/\s/)[0]}`, "i");
		const rest = text.slice(end);
		const closeAt = rest.search(closing);
		const closeEnd =
			closeAt === -1 ? text.length : end + closeAt + rest.slice(closeAt).indexOf(">") + 1;
		ranges.push([match.index, closeEnd]);
	}

	text = blank(source, ranges);

	for (const match of text.matchAll(/<!--[\s\S]*?-->/g)) {
		ranges.push([match.index, match.index + match[0].length]);
	}

	return blank(source, ranges);
}

function blank(source, ranges) {
	const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
	let out = "";
	let cursor = 0;

	for (const [start, end] of sorted) {
		if (end <= cursor) continue;
		out += source.slice(cursor, start) + source.slice(start, end).replace(/[^\n]/g, " ");
		cursor = end;
	}

	return out + source.slice(cursor);
}

/** The index of the `>` that closes the tag opening at `start`, or -1. */
function tagEnd(text, start) {
	let index = start + 1;
	let braces = 0;

	while (index < text.length) {
		const char = text[index];

		if (char === '"' || char === "'" || char === "`") {
			index = skipQuoted(text, index);
			continue;
		}
		if (char === "{") {
			braces += 1;
			index += 1;
			continue;
		}
		if (char === "}") {
			braces = Math.max(0, braces - 1);
			index += 1;
			continue;
		}
		if (char === ">" && braces === 0) return index;
		index += 1;
	}

	return -1;
}

function skipQuoted(text, start) {
	const quote = text[start];
	let index = start + 1;

	while (index < text.length) {
		const char = text[index];
		if (char === "\\") {
			index += 2;
			continue;
		}
		if (char === quote) return index + 1;
		if (quote === "`" && char === "$" && text[index + 1] === "{") {
			index = skipBraces(text, index + 1);
			continue;
		}
		index += 1;
	}

	return text.length;
}

function skipBraces(text, start) {
	let depth = 0;
	let index = start;

	while (index < text.length) {
		const char = text[index];
		if (char === '"' || char === "'" || char === "`") {
			index = skipQuoted(text, index);
			continue;
		}
		if (char === "{") depth += 1;
		if (char === "}") {
			depth -= 1;
			if (depth === 0) return index + 1;
		}
		index += 1;
	}

	return text.length;
}

function attributes(text, from, to) {
	const attrs = new Map();
	let index = from;

	while (index < to) {
		while (index < to && /\s/.test(text[index])) index += 1;
		if (index >= to) break;

		const nameStart = index;
		while (index < to && !/[\s=/>]/.test(text[index])) index += 1;
		const name = text.slice(nameStart, index);

		if (!name) {
			index += 1;
			continue;
		}

		while (index < to && /\s/.test(text[index])) index += 1;

		let value = null;
		if (text[index] === "=") {
			index += 1;
			while (index < to && /\s/.test(text[index])) index += 1;

			if (text[index] === '"' || text[index] === "'") {
				const end = skipQuoted(text, index);
				value = text.slice(index + 1, end - 1);
				index = end;
			} else if (text[index] === "{") {
				const end = skipBraces(text, index);
				value = text.slice(index, end);
				index = end;
			} else {
				const start = index;
				while (index < to && !/[\s>]/.test(text[index])) index += 1;
				value = text.slice(start, index);
			}
		}

		if (name) attrs.set(name, value);
	}

	return attrs;
}

function describe(attrs) {
	const label = attrs.get("class");
	if (label) return ` class="${label}"`;

	const name = attrs.get("name") ?? attrs.get("id");
	return name ? ` ${name}` : "";
}

function lineAt(text, index) {
	let line = 1;
	for (let i = 0; i < index; i += 1) if (text[i] === "\n") line += 1;
	return line;
}

function report(file, known) {
	const reasons = known.map(
		(each) => `${file}:${each.line}  <${each.tag}>  ${each.reason}`,
	);
	if (reasons.length > 0) process.stderr.write(`${reasons.join("\n")}\n`);
	return reasons.length;
}

function reportDuplicates(root) {
	const pages = walk(root).filter((file) => file.endsWith(".html"));
	let failures = 0;

	for (const page of pages) {
		const repeated = duplicateIds(fs.readFileSync(page, "utf8"));
		const relative = path.relative(process.cwd(), page);

		for (const [id, count] of repeated) {
			process.stderr.write(`${relative}  el id "${id}" aparece ${count} veces\n`);
			failures += 1;
		}
	}

	if (failures === 0 && pages.length === 0) {
		process.stderr.write(`no hay páginas renderizadas en ${root}\n`);
		return 1;
	}

	return failures;
}

/** The templates this commit adds or changes, as git staged them. */
export function stagedTemplates() {
	const args = [
		"diff",
		"--cached",
		"--name-only",
		"--diff-filter=ACMR",
		"-z",
		"--",
		`*${TEMPLATE_EXT}`,
	];

	try {
		return execFileSync("git", args, { encoding: "utf8" }).split("\0").filter(Boolean);
	} catch {
		// A repository without a commit yet has no cached diff to read.
		const tracked = execFileSync("git", ["ls-files", "-z", "--cached", "--", `*${TEMPLATE_EXT}`], {
			encoding: "utf8",
		});
		return tracked.split("\0").filter(Boolean);
	}
}

function main(argv) {
	if (argv[0] === "--staged") {
		return reportFiles(stagedTemplates());
	}

	if (argv[0] === "--dist") {
		const root = argv[1] ?? "dist";
		const failures = reportDuplicates(root);
		if (failures > 0) {
			process.stderr.write(`\n${failures} id(s) repetidos: cada elemento necesita el suyo.\n`);
		}
		return failures === 0 ? 0 : 1;
	}

	return reportFiles(argv.length > 0 ? argv : astroTemplates(process.cwd()));
}

function reportFiles(files) {
	let failures = 0;

	for (const file of files) {
		let source = "";
		try {
			source = fs.readFileSync(file, "utf8");
		} catch {
			// A path removed by the commit it belongs to: nothing to scan.
			continue;
		}
		failures += report(file, scan(file, source));
	}

	if (failures > 0) {
		process.stderr.write(
			`\n${failures} elemento(s) sin id: cada elemento necesita uno para poder nombrarlo.\n`,
		);
	}

	return failures === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
	process.exit(main(process.argv.slice(2)));
}
