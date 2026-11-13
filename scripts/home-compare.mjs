#!/usr/bin/env node
/**
 * Side-by-side sheets: production (before) against the local build (after).
 *
 *   node scripts/home-compare.mjs
 *
 * Reads the captures in ui-artifacts/critique-home/{before,after}/ and writes
 * ui-artifacts/critique-home/compare-*.png, one sheet per view.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const ROOT = new URL("../ui-artifacts/critique-home/", import.meta.url).pathname;
const CHROME =
	process.env.PW_CHROME ??
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SHEETS = [
	{
		name: "compare-01-desktop-fold",
		title: "Portada · escritorio 1440 · claro",
		width: 880,
		before: "before/desktop-light-fold.png",
		after: "after/desktop-light-fold.png",
	},
	{
		name: "compare-02-desktop-dark",
		title: "Portada · escritorio 1440 · oscuro",
		width: 880,
		before: "before/desktop-dark-fold.png",
		after: "after/desktop-dark-fold.png",
	},
	{
		name: "compare-03-mobile-fold",
		title: "Portada · móvil 390 · claro",
		width: 400,
		before: "before/mobile-light-fold.png",
		after: "after/mobile-light-fold.png",
	},
	{
		name: "compare-04-featured",
		title: "Proyecto destacado · escritorio 1440",
		width: 880,
		before: "crop-featured-before.png",
		after: "crop-featured-after.png",
	},
	{
		name: "compare-05-selected",
		title: "Proyectos seleccionados · escritorio 1440",
		width: 880,
		before: "crop-selected-before.png",
		after: "crop-selected-after.png",
	},
	{
		name: "compare-06-full",
		title: "Página completa · escritorio 1440",
		width: 640,
		before: "before/desktop-light-full.png",
		after: "after/desktop-light-full.png",
	},
];

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({
	viewport: { width: 1900, height: 1200 },
	deviceScaleFactor: 1,
});

// Inlined as data URLs: a setContent page has no origin of its own to read
// file:// images from, and a fixture server would be one more moving part.
const dataUrl = async (relative) =>
	`data:image/png;base64,${(await readFile(ROOT + relative)).toString("base64")}`;

for (const sheet of SHEETS) {
	// The sheet is only as wide as its two columns, not the whole viewport.
	await page.setViewportSize({
		width: 34 * 2 + sheet.width * 2 + 22 + 2,
		height: 900,
	});
	const before = await dataUrl(sheet.before);
	const after = await dataUrl(sheet.after);
	const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 34px 34px 30px; background: #f2ede4;
         font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
         color: #1a1a1a; }
  h1 { margin: 0 0 22px; font-size: 19px; font-weight: 600; letter-spacing: -0.01em; }
  .row { display: flex; align-items: flex-start; gap: 22px; }
  figure { margin: 0; }
  figcaption { margin: 0 0 9px; font-size: 12px; letter-spacing: 0.1em;
               text-transform: uppercase; color: #6f6960;
               font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  figure.after figcaption { color: #9e4e36; }
  img { display: block; width: ${sheet.width}px; height: auto;
        border: 1px solid #d9d2c6; background: #faf8f5; }
</style></head>
<body>
  <h1>${sheet.title}</h1>
  <div class="row">
    <figure class="before"><figcaption>Antes · producción</figcaption>
      <img src="${before}" alt=""></figure>
    <figure class="after"><figcaption>Después · local</figcaption>
      <img src="${after}" alt=""></figure>
  </div>
</body></html>`;

	await page.setContent(html, { waitUntil: "load" });
	await page.waitForFunction(() =>
		[...document.images].every((image) => image.complete && image.naturalWidth > 0),
	);
	const box = await page.locator("body").boundingBox();
	const out = `${ROOT}${sheet.name}.png`;
	await page.screenshot({
		path: out,
		clip: { x: 0, y: 0, width: box.width, height: box.height },
	});
	const bytes = (await readFile(out)).length;
	console.log(`${sheet.name}.png  ${Math.round(box.width)}x${Math.round(box.height)}  ${Math.round(bytes / 1024)} kB`);
}

await browser.close();

// The manifest of what was produced, next to the images.
const listing = SHEETS.map((sheet) => `${sheet.name}.png — ${sheet.title}`).join("\n");
await mkdir(ROOT, { recursive: true });
await writeFile(`${ROOT}README.txt`, `Comparativas antes/después de la portada.\n\n${listing}\n`);
