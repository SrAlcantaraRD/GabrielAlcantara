import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

const read = (relative: string) =>
	fs.readFileSync(path.join(ROOT, relative), "utf8");

const TEMPLATES = [
	"src/pages/[lang]/index.astro",
	"src/pages/[lang]/blog/index.astro",
	"src/pages/[lang]/projects/index.astro",
	"src/pages/[lang]/blog/[slug].astro",
	"src/pages/[lang]/projects/[slug].astro",
];

describe("translated templates", () => {
	for (const template of TEMPLATES) {
		it(`${template} derives its paths from the route table`, () => {
			const source = read(template);

			assert.match(source, /from "\.\.\/(?:\.\.\/)*lib\/routes"/);
			assert.match(source, /getStaticPaths/);
			assert.match(source, /translatedLocales\(|routesFor\(/);
			assert.doesNotMatch(source, /\bPOSTS\b|\bPROJECT_CASES\b/);
		});
	}

	it("llms.txt derives its translated links from the route table", () => {
		const source = read("src/pages/llms.txt.ts");

		assert.match(source, /lib\/routes/);
		assert.match(source, /indexableRoutes\(|routesFor\(/);
	});

	it("keeps no translated page files outside the dynamic template", () => {
		assert.equal(fs.existsSync(path.join(ROOT, "src/pages/en")), false);
		assert.equal(fs.existsSync(path.join(ROOT, "src/pages/ca")), false);
	});
});
