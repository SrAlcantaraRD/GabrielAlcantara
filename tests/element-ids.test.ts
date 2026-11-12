import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
	astroTemplates,
	duplicateIds,
	scan,
} from "../scripts/element-ids.mjs";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

const tags = (source: string) =>
	scan("fixture.astro", source).map((found) => found.tag);

const template = (markup: string) => `---\nconst title = "hola";\n---\n${markup}\n`;

describe("element ids", () => {
	it("flags an element that carries no id", () => {
		const source = template(`<p class="lede">hola</p>`);

		assert.deepEqual(tags(source), ['p class="lede"']);
	});

	it("reports the line the element sits on", () => {
		const source = template(`<div id="wrap">\n  <p class="lede">hola</p>\n</div>`);

		assert.deepEqual(
			scan("fixture.astro", source).map((found) => found.line),
			[5],
		);
	});

	it("accepts literal and interpolated ids", () => {
		const source = template(
			`<p id="lede">hola</p>\n<span id={"a" + "b"}>x</span>\n<a id={\`x-\${title}\`}>y</a>`,
		);

		assert.deepEqual(tags(source), []);
	});

	it("reads elements that carry expressions with markup characters", () => {
		const source = template(
			`<div id="row" class:list={["a", "b"]} data-arrow={a > b ? ">" : "<"}>\n  <em>sin id</em>\n</div>`,
		);

		assert.deepEqual(tags(source), ["em"]);
	});

	it("leaves the frontmatter, scripts, styles and comments alone", () => {
		const source = `---
const el = document.querySelectorAll<HTMLElement>("p");
---
<p id="ok">x</p>
<script>
  const list = document.querySelectorAll<HTMLElement>("li");
  const node = Object.assign(document.createElement("span"), {});
</script>
<style>
  p { color: red; }
</style>
<!-- <span>comentario</span> -->`;

		assert.deepEqual(tags(source), []);
	});

	it("does not ask a component or a slot placeholder for an id", () => {
		const source = template(
			`<Layout>\n  <PostCard post={post} />\n  <slot />\n</Layout>`,
		);

		assert.deepEqual(tags(source), []);
	});

	it("asks SVG shapes for an id too", () => {
		const source = template(
			`<svg id="diagram"><g><rect x="0" y="0" /></g></svg>`,
		);

		assert.deepEqual(tags(source), ["g", "rect"]);
	});

	it("flags the element that reuses a literal id already in the file", () => {
		const source = template(
			`<p id="same">a</p>\n<p id="same">b</p>`,
		);
		const found = scan("fixture.astro", source);

		assert.equal(found.length, 1);
		assert.equal(found[0].line, 5);
		assert.match(found[0].reason, /repite el id "same" de la línea 4/);
	});

	it("counts repeated ids in rendered pages", () => {
		const html = `<p id="a"></p><p id="b"></p><p id="a"></p>`;

		assert.deepEqual([...duplicateIds(html)], [["a", 2]]);
	});
});

describe("the repository", () => {
	it("lists every astro template in the tree", () => {
		assert.ok(astroTemplates(ROOT).length >= 60);
	});

	it("gives an id to every element of every template", () => {
		const found = (astroTemplates(ROOT) as string[]).flatMap((file) =>
			scan(file, fs.readFileSync(path.join(ROOT, file), "utf8")).map(
				(one) => `${file}:${one.line} <${one.tag}>`,
			),
		);

		assert.deepEqual(found, []);
	});
});

describe("element id gate", () => {
	it("exits 0 on a clean file and 1 on a file with a bare element", () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-ids-"));
		const file = path.join(dir, "page.astro");

		try {
			fs.writeFileSync(file, template(`<p id="ok">x</p>`));
			assert.equal(runGate(file).status, 0);

			fs.writeFileSync(file, template(`<p class="bare">x</p>`));
			const bad = runGate(file);

			assert.equal(bad.status, 1);
			assert.match(bad.stderr, /page\.astro:4/);
			assert.match(bad.stderr, /falta id/);
		} finally {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	});
});

function runGate(file: string) {
	return spawnGate([file]);
}

function spawnGate(args: string[]) {
	return spawnSync(process.execPath, ["scripts/element-ids.mjs", ...args], {
		cwd: ROOT,
		encoding: "utf8",
	});
}
