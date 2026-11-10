import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	compareCards,
	readManifest,
	socialCardSpecs,
	verifyCards,
} from "../scripts/social-cards.mjs";

type StoredCard = {
	file: string;
	page: string;
	title: string;
	sha256: string;
};

describe("social cards", () => {
	it("match the current title of every page", async () => {
		const expected = await socialCardSpecs();
		const problems = verifyCards(expected, readManifest());
		assert.deepEqual(problems, []);
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

	it("report a page title that has no card", async () => {
		const expected = await socialCardSpecs();
		const problems = compareCards(expected, { cards: [] });

		assert.equal(problems.length, expected.length);
		assert.ok(problems.every((problem) => problem.includes("Falta")));
	});
});
