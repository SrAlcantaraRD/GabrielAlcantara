import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	compareCards,
	hashRender,
	readManifest,
	socialCardSpecs,
	verifyCards,
} from "../scripts/social-cards.mjs";

type StoredCard = {
	file: string;
	page: string;
	title: string;
	renderHash: string;
};

describe("social cards", () => {
	it("match the current title of every page", async () => {
		const expected = await socialCardSpecs();
		const problems = verifyCards(expected, readManifest());
		assert.deepEqual(problems, []);
	});

	it("cover the fallback card for pages without their own", async () => {
		const expected = await socialCardSpecs();
		const fallback = expected.find((card) => card.file === "/og-image.png");
		assert.ok(fallback, "las specs no incluyen /og-image.png");
		assert.equal(fallback.copy.kind, "default");

		const stored = (readManifest().cards ?? []) as StoredCard[];
		assert.ok(
			stored.some((card) => card.file === "/og-image.png"),
			"el manifiesto no registra /og-image.png",
		);
	});

	it("report a card whose title no longer matches its page", async () => {
		const expected = await socialCardSpecs();
		const manifest = readManifest();
		const [first] = manifest.cards as StoredCard[];
		assert.ok(first);

		const stale = {
			cards: (manifest.cards as StoredCard[]).map((card) =>
				card.file === first.file
					? { ...card, title: `${card.title} (título antiguo)` }
					: card,
			),
		};

		const problems = compareCards(expected, stale);
		assert.equal(problems.length, 1);
		assert.match(problems[0] ?? "", /título antiguo/);
	});

	it("notice a template change as readily as a copy change", async () => {
		const expected = await socialCardSpecs();
		const [card] = expected;
		assert.ok(card);
		assert.notEqual(
			hashRender(card.copy),
			hashRender(card.copy, "<!doctype html><p>otra plantilla</p>"),
		);
	});

	it("report a card whose copy changed without re-exporting", async () => {
		const expected = await socialCardSpecs();
		const target = expected.find((card) => card.copy.sub);
		assert.ok(target?.copy.sub, "ninguna tarjeta tiene entradilla");

		// Editing the tagline leaves title and page untouched, so only the render
		// hash can notice that the exported PNG still says the old sentence.
		const edited = expected.map((card) =>
			card.file === target.file
				? { ...card, copy: { ...card.copy, sub: "Otra entradilla." } }
				: card,
		);

		const problems = compareCards(edited, readManifest());
		assert.equal(problems.length, 1);
		assert.match(problems[0] ?? "", /otra plantilla o con otro texto/);
	});

	it("report a page title that has no card", async () => {
		const expected = await socialCardSpecs();
		const problems = compareCards(expected, { cards: [] });

		assert.equal(problems.length, expected.length);
		assert.ok(problems.every((problem) => problem.includes("Falta")));
	});
});
