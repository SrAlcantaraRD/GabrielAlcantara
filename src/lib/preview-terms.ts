/**
 * The build-time half of `<AutoPreviews>`.
 *
 * Prose is written as prose: the spellings the registry knows are wrapped where
 * the sentence touches them, so a template no longer names every term by hand.
 * A term is left alone when wrapping it would be wrong or useless — inside a
 * link, a code sample or a heading, or inside a trigger that is already there.
 *
 * The result is a string for `set:html` plus the slugs that were really placed,
 * so the component renders exactly the cards this block can open. Nothing here
 * runs in the browser: the client still resolves a trigger against the page's
 * pool by `data-preview-id`.
 *
 * The page's pathname decides two things: the language, because a spelling is
 * written in the language of the copy, and the page's own exclusions, because a
 * page about a term does not need a card explaining it.
 *
 * The HTML is scanned, not parsed: the slot is server-rendered markup we wrote
 * ourselves, and a tag walk is enough to know which text is prose.
 */
import { PREVIEW_EXCLUSIONS, PREVIEWS } from "../data/previews.ts";
import { localeFromPath, pathWithoutLocale, type Locale } from "../i18n/routing.ts";

/**
 * Elements whose text is never a term: a link, a code sample, a title — or a
 * figure, whose labels are drawn into a diagram and would break it.
 */
const SKIP_ELEMENTS = new Set([
	"a",
	"code",
	"pre",
	"script",
	"style",
	"figure",
	"svg",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
]);

/** Elements that close themselves; keeping them on the stack would unbalance it. */
const VOID_ELEMENTS = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"source",
	"track",
	"wbr",
]);

/**
 * How many times one slug is explained inside a block. The first mention is the
 * one worth explaining; repeating the card down the page turns prose to dots.
 */
const MAX_PER_SLUG = 2;

interface TermIndex {
	pattern: RegExp;
	/** Lowercased spelling to slug, because the match keeps the copy's casing. */
	bySpelling: Map<string, string>;
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTermIndex(locale: Locale, excluded: ReadonlySet<string>): TermIndex {
	const bySpelling = new Map<string, string>();

	for (const entry of PREVIEWS) {
		if (excluded.has(entry.id) || !entry.spellings) continue;
		// The proper nouns read the same in every language; the aliases do not.
		const spellings = [
			...(entry.spellings.all ?? []),
			...(entry.spellings[locale] ?? []),
		];

		for (const spelling of spellings) {
			const key = spelling.toLowerCase();
			if (!bySpelling.has(key)) bySpelling.set(key, entry.id);
		}
	}

	// Longest first, so "Siebel CRM" wins over "Siebel" and "enlaces
	// universales" over any shorter spelling inside it.
	const spellings = [...bySpelling.keys()].sort((a, b) => b.length - a.length);
	const pattern = new RegExp(
		// Whole words only: "ACD" must not fire inside "ACDAuditor".
		`(?<![\\p{L}\\p{N}])(?:${spellings.map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}])`,
		"giu",
	);

	return { pattern, bySpelling };
}

/**
 * One index per language and set of exclusions. A page can only remove terms,
 * so the key stays short and a build compiles each shape once.
 */
const INDEXES = new Map<string, TermIndex>();

function indexFor(pathname: string): TermIndex {
	const locale = localeFromPath(pathname);
	const excluded = new Set(PREVIEW_EXCLUSIONS[pathWithoutLocale(pathname)] ?? []);
	const key = `${locale}|${[...excluded].sort().join(",")}`;

	let index = INDEXES.get(key);
	if (!index) {
		index = buildTermIndex(locale, excluded);
		INDEXES.set(key, index);
	}
	return index;
}

/** The index of the `>` that closes the tag opening at `start`, quotes aware. */
function tagEnd(text: string, start: number): number {
	let index = start + 1;

	while (index < text.length) {
		const char = text[index];
		if (char === '"' || char === "'") {
			index += 1;
			while (index < text.length && text[index] !== char) index += 1;
			index += 1;
			continue;
		}
		if (char === ">") return index;
		index += 1;
	}

	return -1;
}

function trigger(slug: string, text: string, blockId: string, n: number): string {
	const token = `${slug}-auto-${blockId}-${n}`;
	return (
		`<span class="preview" id="preview-${token}" data-preview-root>` +
		`<button class="preview-term" id="preview-term-${token}" type="button" ` +
		`data-preview="${slug}" aria-expanded="false">${text}</button>` +
		`</span>`
	);
}

export interface AutoPreviewResult {
	html: string;
	/** The slugs this block placed, in the order they first appeared. */
	slugs: string[];
}

/**
 * Rewrites a rendered prose block: the known terms become triggers, and the
 * slugs that were placed come back so the caller can pool their cards.
 *
 * `blockId` goes into every generated id, because a page may wrap several prose
 * blocks and an id has to name exactly one element. `pathname` is the page's own
 * URL: it picks the language the copy is written in and the terms this page has
 * excluded.
 */
export function autoPreviews(
	html: string,
	blockId: string,
	pathname: string,
): AutoPreviewResult {
	const terms = indexFor(pathname);
	const placed = new Map<string, number>();
	const slugs = new Set<string>();
	let count = 0;

	const wrap = (text: string): string =>
		text.replace(terms.pattern, (match) => {
			const slug = terms.bySpelling.get(match.toLowerCase());
			if (!slug) return match;
			const used = placed.get(slug) ?? 0;
			if (used >= MAX_PER_SLUG) return match;
			placed.set(slug, used + 1);
			slugs.add(slug);
			count += 1;
			return trigger(slug, match, blockId, count);
		});

	const out: string[] = [];
	/** One entry per open element, remembering whether its text is skipped. */
	const stack: { name: string; skip: boolean }[] = [];
	let skipping = 0;
	let index = 0;

	while (index < html.length) {
		const open = html.indexOf("<", index);
		const textEnd = open === -1 ? html.length : open;

		if (textEnd > index) {
			const text = html.slice(index, textEnd);
			out.push(skipping === 0 ? wrap(text) : text);
		}
		if (open === -1) break;

		if (html.startsWith("<!--", open)) {
			const close = html.indexOf("-->", open + 4);
			const stop = close === -1 ? html.length : close + 3;
			out.push(html.slice(open, stop));
			index = stop;
			continue;
		}

		const end = tagEnd(html, open);
		if (end === -1) {
			// A stray "<" with no tag after it: the rest is text, tags and all.
			out.push(html.slice(open));
			break;
		}

		const tag = html.slice(open, end + 1);
		index = end + 1;

		const parsed = /^<\s*(\/?)\s*([a-zA-Z][\w:-]*)/.exec(tag);
		if (!parsed) {
			out.push(tag);
			continue;
		}

		const name = parsed[2].toLowerCase();
		out.push(tag);

		if (parsed[1] === "/") {
			let at = -1;
			for (let k = stack.length - 1; k >= 0; k -= 1) {
				if (stack[k].name === name) {
					at = k;
					break;
				}
			}
			if (at === -1) continue;

			for (let k = stack.length - 1; k >= at; k -= 1) {
				if (stack[k].skip) skipping -= 1;
			}
			stack.length = at;
			continue;
		}

		// A trigger already there, or the wrapper that holds its card, is not
		// prose: wrapping the card's own title would nest a button in it.
		const already = /\sdata-preview(?:-root)?(?:=|\s|\/?>)/.test(tag);
		const skip = skipping > 0 || SKIP_ELEMENTS.has(name) || already;

		if (VOID_ELEMENTS.has(name) || /\/\s*>$/.test(tag)) continue;

		stack.push({ name, skip });
		if (skip) skipping += 1;
	}

	return { html: out.join(""), slugs: [...slugs] };
}
