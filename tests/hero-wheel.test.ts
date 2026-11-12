import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { pauseBefore } from "../src/lib/hero-wheel.ts";

describe("autoplay budget", () => {
	it("keeps the pause plus the move inside the 2 s of a word", () => {
		const ease = 300;
		const pause = pauseBefore(2000, ease);

		assert.equal(pause, 1700);
		assert.equal(pause + ease, 2000);
	});

	it("waits the whole budget when there is no move to draw", () => {
		assert.equal(pauseBefore(2000, 0), 2000);
	});

	it("never waits a negative time when the ease outgrows the budget", () => {
		assert.equal(pauseBefore(2000, 2400), 0);
		assert.equal(pauseBefore(0, 300), 0);
	});
});
