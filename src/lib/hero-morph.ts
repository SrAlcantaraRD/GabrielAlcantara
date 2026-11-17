/**
 * Pure matching for the home headline's Shared Letter Morph.
 *
 * A swap travels the letters the two words share and, to read as one word
 * becoming another, those letters keep their order: the match is a longest
 * common subsequence over characters. A by-position match would strand letters
 * that could have moved, and crossing pairs read as a shuffle instead of a
 * morph.
 */

/**
 * Longest common subsequence of `a` and `b`, returned as `[from, to]` index
 * pairs in order: `a[from]` is the same character as `b[to]`, and both indices
 * only ever grow.
 *
 * The table is one flat `Uint16Array`: a word is tens of characters and a swap
 * runs once a second for as long as the hero is on screen, so the fill must not
 * allocate per cell.
 */
export function matchLetters(a: string, b: string): Array<[number, number]> {
	const n = a.length;
	const m = b.length;
	const width = m + 1;
	const table = new Uint16Array((n + 1) * width);

	for (let i = n - 1; i >= 0; i -= 1) {
		for (let j = m - 1; j >= 0; j -= 1) {
			table[i * width + j] =
				a.charAt(i) === b.charAt(j)
					? (table[(i + 1) * width + j + 1] ?? 0) + 1
					: Math.max(
							table[(i + 1) * width + j] ?? 0,
							table[i * width + j + 1] ?? 0,
						);
		}
	}

	const pairs: Array<[number, number]> = [];
	let i = 0;
	let j = 0;

	while (i < n && j < m) {
		if (a.charAt(i) === b.charAt(j)) {
			pairs.push([i, j]);
			i += 1;
			j += 1;
		} else if ((table[(i + 1) * width + j] ?? 0) >= (table[i * width + j + 1] ?? 0)) {
			i += 1;
		} else {
			j += 1;
		}
	}

	return pairs;
}
