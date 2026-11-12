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

/**
 * A diagram is rendered only by the pages that show it, but Astro collects the
 * styles of every component in the page graph. A `<style>` block inside a
 * diagram therefore rides along with pages that never render it, which is what
 * happened to the translated case studies: their body registry reaches every
 * body, so the CSS of all three diagrams landed on all six pages. The styles
 * live in their own stylesheet, linked by the component when it renders.
 */
const DIAGRAMS = [
	{
		name: "ArchitectureDiagram",
		component: "src/components/ArchitectureDiagram.astro",
		stylesheet: "src/styles/architecture-diagram.css",
	},
	{
		name: "PachangaDiagram",
		component: "src/components/PachangaDiagram.astro",
		stylesheet: "src/styles/pachanga-diagram.css",
	},
];

describe("diagram styles", () => {
	for (const diagram of DIAGRAMS) {
		const source = read(diagram.component);

		it(`${diagram.name} keeps no style block in the page graph`, () => {
			assert.doesNotMatch(source, /^<style[^>]*>/m);
		});

		it(`${diagram.name} links its stylesheet from the page that renders it`, () => {
			const imported = source.match(
				/import\s+(\w+)\s+from\s+"([^"]+\.css\?url)"/,
			);

			assert.ok(imported, `${diagram.name} imports no .css?url`);

			const [, binding, specifier] = imported;
			const resolved = path
				.join(path.dirname(diagram.component), specifier.replace(/\?url$/, ""))
				.replace(/\\/g, "/");

			assert.equal(
				resolved,
				diagram.stylesheet,
				`${diagram.name} points at ${diagram.stylesheet}`,
			);
			assert.equal(fs.existsSync(path.join(ROOT, resolved)), true);
			assert.match(
				source,
				new RegExp(`<link[^>]*\\srel="stylesheet"[^>]*\\shref=\\{${binding}\\}`),
			);
		});

		it(`${diagram.name} styles every class its markup carries`, () => {
			const css = read(diagram.stylesheet);
			const classes = new Set(
				[...source.matchAll(/class="([^"]+)"/g)]
					.flatMap((match) => match[1].split(/\s+/))
					.filter((name) => name.length > 0),
			);

			assert.ok(classes.size > 0, `${diagram.name} carries no classes`);

			for (const name of classes) {
				assert.match(
					css,
					new RegExp(`\\.${name}(?![\\w-])`),
					`${diagram.stylesheet} does not style .${name}`,
				);
			}
		});
	}
});
