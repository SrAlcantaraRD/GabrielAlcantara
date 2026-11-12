import assert from "node:assert/strict";
import { test } from "node:test";
import { autoPreviews } from "../src/lib/preview-terms.ts";

test("wraps a known spelling and reports the slug", () => {
	const { html, slugs } = autoPreviews(
		"<p>La web es Ghost con un tema.</p>",
		"bloque",
		"/about/",
	);

	assert.deepEqual(slugs, ["ghost"]);
	assert.match(html, /<span class="preview" id="preview-ghost-auto-bloque-1"/);
	assert.match(html, /data-preview="ghost"/);
	assert.match(html, />Ghost<\/button>/);
});

test("keeps the copy's own casing and longer spellings win", () => {
	const { html, slugs } = autoPreviews(
		"<p>Desarrollo Siebel CRM para la ACA.</p>",
		"b",
		"/about/",
	);

	assert.deepEqual(slugs, ["siebel"]);
	assert.match(html, />Siebel CRM<\/button>/);
});

test("does not fire inside a longer word", () => {
	const { slugs } = autoPreviews(
		"<p>ACDAuditor importaba por posiciones.</p>",
		"b",
		"/about/",
	);
	assert.deepEqual(slugs, []);
});

test("leaves links, code, headings and existing triggers alone", () => {
	const source =
		'<h2>Kafka</h2><p><a href="/x">Kafka</a> y <code>Kafka</code></p>' +
		'<p><span class="preview" id="preview-kafka" data-preview-root>' +
		'<button class="preview-term" data-preview="kafka">Kafka</button></span></p>';
	const { html, slugs } = autoPreviews(source, "b", "/about/");

	assert.deepEqual(slugs, []);
	assert.equal(html, source);
});

test("explains one slug at most twice per block", () => {
	const { html, slugs } = autoPreviews(
		"<p>Kafka</p><p>Kafka</p><p>Kafka</p>",
		"b",
		"/about/",
	);

	assert.deepEqual(slugs, ["kafka"]);
	assert.equal(html.match(/data-preview="kafka"/g)?.length, 2);
	assert.match(html, /<p>Kafka<\/p>$/);
});

test("gives every trigger its own id, tied to the block", () => {
	const { html } = autoPreviews("<p>Kafka y Kafka</p>", "caso", "/about/");

	assert.match(html, /id="preview-term-kafka-auto-caso-1"/);
	assert.match(html, /id="preview-term-kafka-auto-caso-2"/);
});

test("reads the aliases of the language the page is written in", () => {
	const english = autoPreviews(
		"<p>An event-driven system.</p>",
		"b",
		"/en/blog/nota/",
	);
	const spanish = autoPreviews(
		"<p>Una arquitectura orientada a eventos.</p>",
		"b",
		"/blog/nota/",
	);

	assert.deepEqual(english.slugs, ["event-driven"]);
	assert.deepEqual(spanish.slugs, ["event-driven"]);

	// The same sentence in the other language finds nothing: a term is written
	// in one language, and the copy of an English page is not Spanish.
	assert.deepEqual(
		autoPreviews("<p>An event-driven system.</p>", "b", "/blog/nota/").slugs,
		[],
	);
	assert.deepEqual(
		autoPreviews(
			"<p>Una arquitectura orientada a eventos.</p>",
			"b",
			"/ca/blog/nota/",
		).slugs,
		[],
	);
});

test("proper nouns are read in every locale", () => {
	for (const path of ["/about/", "/en/about/", "/ca/about/"]) {
		assert.deepEqual(autoPreviews("<p>Zod</p>", "b", path).slugs, ["zod"]);
	}
});

test("a page can exclude a term, in any of its locales", () => {
	const source = "<p>Pachanga Community y los enlaces universales.</p>";

	assert.deepEqual(
		autoPreviews(source, "b", "/projects/pachanga-community/").slugs,
		[],
	);
	assert.deepEqual(
		autoPreviews(source, "b", "/en/projects/pachanga-community/").slugs,
		[],
	);
	assert.deepEqual(
		autoPreviews(source, "b", "/about/").slugs,
		["pachanga", "universal-link"],
	);
	// Same page in English: the proper noun is read, the Spanish alias is not.
	assert.deepEqual(autoPreviews(source, "b", "/en/about/").slugs, ["pachanga"]);
});
