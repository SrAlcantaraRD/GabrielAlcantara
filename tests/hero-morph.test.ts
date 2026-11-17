import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { matchLetters } from "../src/lib/hero-morph.ts";

/** Longest common subsequence length, computed independently of the matcher. */
function lcsLength(a: string, b: string): number {
	let previous = new Array<number>(b.length + 1).fill(0);

	for (let i = 1; i <= a.length; i += 1) {
		const row = new Array<number>(b.length + 1).fill(0);

		for (let j = 1; j <= b.length; j += 1) {
			row[j] =
				a[i - 1] === b[j - 1]
					? (previous[j - 1] ?? 0) + 1
					: Math.max(previous[j] ?? 0, row[j - 1] ?? 0);
		}

		previous = row;
	}

	return previous[b.length] ?? 0;
}

/** The headline's vocabulary, in the order the hero plays it. */
const WORDLIST = [
	"construyendo",
	"resolviendo",
	"aprendiendo",
	"solucionando",
	"creciendo",
	"superando retos",
];

describe("shared letter morph", () => {
	it("travels a whole identical word, letter for letter in place", () => {
		const word = "creciendo";
		const expected = Array.from({ length: word.length }, (_, i) => [i, i]);

		assert.deepEqual(matchLetters(word, word), expected);
	});

	it("travels the longest ordered share, not the by-position guess", () => {
		assert.deepEqual(matchLetters("abcd", "bcd"), [
			[1, 0],
			[2, 1],
			[3, 2],
		]);
	});

	it("only pairs equal letters, in order, and as many as the LCS has", () => {
		WORDLIST.forEach((from, i) => {
			const to = WORDLIST[(i + 1) % WORDLIST.length] ?? "";
			const pairs = matchLetters(from, to);

			assert.equal(
				pairs.length,
				lcsLength(from, to),
				`${from} → ${to} should travel every shared letter it can`,
			);

			let lastFrom = -1;
			let lastTo = -1;

			for (const [source, target] of pairs) {
				assert.equal(from[source], to[target]);
				assert.ok(source > lastFrom && target > lastTo);
				lastFrom = source;
				lastTo = target;
			}
		});
	});

	it("travels nothing between words with no letter in common", () => {
		assert.deepEqual(matchLetters("xyz", "abc"), []);
	});
});
