/**
 * Pure geometry for the home headline reel.
 *
 * The wheel is one continuous `position` measured in rows: the integer part is
 * the word in the centre and the fraction is how far the reel has been dragged.
 * The server-rendered first paint and the browser module both derive every
 * word's transform from these helpers, so the static markup and the drag can
 * never disagree.
 */

export interface ReelSlot {
	/** Shortest signed distance from the centre, in rows. */
	offset: number;
	/** Scale of the word: 1 in the centre, 0.62 one row away. */
	scale: number;
	/** Opacity of the word: 1 in the centre, 0.38 one row away. */
	opacity: number;
}

/** Scale and opacity of the adjacent rows, from the original drawing. */
const NEIGHBOUR_SCALE = 0.62;
const NEIGHBOUR_OPACITY = 0.38;
/** Rows a word takes to fade out completely past its neighbour. */
const FADE_ROWS = 0.55;

/**
 * Shortest signed distance between a word and the centre. `delta` may be
 * fractional (mid-drag) and outside `[0, length)`: the result always lands in
 * `[-length / 2, length / 2)`, which is what makes the reel infinite without
 * cloning nodes. Anything beyond ±1.55 rows is already invisible, so the jump
 * at the wrap boundary never shows.
 */
export function wrapOffset(delta: number, length: number): number {
	if (length <= 0) return 0;
	const half = length / 2;
	return ((((delta + half) % length) + length) % length) - half;
}

/** Visual state of a word sitting `offset` rows away from the centre. */
export function reelSlot(offset: number): ReelSlot {
	const distance = Math.abs(offset);

	if (distance <= 1) {
		return {
			offset,
			scale: 1 - (1 - NEIGHBOUR_SCALE) * distance,
			opacity: 1 - (1 - NEIGHBOUR_OPACITY) * distance,
		};
	}

	const fade = Math.max(0, 1 - (distance - 1) / FADE_ROWS);
	return {
		offset,
		scale: NEIGHBOUR_SCALE - 0.1 * Math.min(1, distance - 1),
		opacity: NEIGHBOUR_OPACITY * fade,
	};
}
