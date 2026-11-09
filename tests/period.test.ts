import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	currentMonth,
	durationLabel,
	monthLabel,
	parseMonth,
	spanLabel,
} from "../src/lib/period.ts";

describe("month index", () => {
	it("parses the authored YYYY-MM form", () => {
		assert.equal(parseMonth("2024-01"), 2024 * 12);
		assert.equal(parseMonth("2026-08"), 2026 * 12 + 7);
		assert.equal(parseMonth("2011-12"), 2011 * 12 + 11);
	});

	it("rejects malformed months", () => {
		assert.throws(() => parseMonth("2024"), /expected YYYY-MM/);
		assert.throws(() => parseMonth("2024-13"), /month must be 01-12/);
		assert.throws(() => parseMonth("2024-00"), /month must be 01-12/);
	});

	it("labels a month and an inclusive span", () => {
		assert.equal(monthLabel(parseMonth("2024-01")), "ene 2024");
		assert.equal(monthLabel(parseMonth("2026-08")), "ago 2026");
		assert.equal(
			spanLabel(parseMonth("2024-01"), parseMonth("2026-08") + 1),
			"ene 2024 — ago 2026",
		);
	});

	it("counts durations the way the CV states them", () => {
		const quabu = parseMonth("2026-08") + 1 - parseMonth("2024-01");
		assert.equal(quabu, 32);
		assert.equal(durationLabel(quabu), "2 años 8 meses");
		assert.equal(durationLabel(3), "3 meses");
		assert.equal(durationLabel(12), "1 año");
		assert.equal(durationLabel(13), "1 año 1 mes");
		assert.equal(durationLabel(0), "0 meses");
	});

	it("knows the current month", () => {
		assert.equal(currentMonth(new Date(2026, 10, 9)), 2026 * 12 + 10);
	});
});
