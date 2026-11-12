import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

const source = fs.readFileSync(
	path.join(ROOT, "src/pages/experience.astro"),
	"utf8",
);

const sectionHeads = () => {
	const chunks = source.split('class="section-head"').slice(1);
	return chunks.map((chunk) => chunk.slice(0, chunk.indexOf("</div>\n    </div>")));
};

describe("experience sticky section heads", () => {
	it("finds the sections this page renders", () => {
		assert.equal(sectionHeads().length, 3);
	});

	it("gives the title the same air above and below inside its sticky box", () => {
		const rule = source.match(/\.section > \.section-head \{([\s\S]*?)\}/);

		assert.ok(rule, "the sticky section head rule is missing");
		assert.match(rule[1], /padding-block:/);
		assert.doesNotMatch(rule[1], /padding-(?:top|bottom):/);
	});
});
