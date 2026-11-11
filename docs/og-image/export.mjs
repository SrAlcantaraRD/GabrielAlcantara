/**
 * Exports the social share cards and app icons in `public/` from the artboards
 * in this directory.
 *
 * The artboards do the layout; this script does the proof. `card.html` shrinks
 * a title until it fits, and this file then re-measures the rendered card on
 * its own terms and refuses to write anything that breaks a rule: any text
 * below MIN_FONT_PX, any element outside the canvas or overflowing its box, any
 * image that is not exactly 1200x630, any image over --max-kb.
 *
 * Usage: pnpm social:cards
 *        node docs/og-image/export.mjs --only nakire-tps
 *        PW_CHROME=/path/to/chrome node docs/og-image/export.mjs
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { chromium } from "playwright-core";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const PUBLIC = join(ROOT, "public");
const CARD_PAGE = pathToFileURL(join(HERE, "card.html")).href;
const ICON_PAGE = pathToFileURL(join(HERE, "icon.html")).href;

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * The feed-size floor. A timeline draws the card near 504px wide, a factor of
 * 0.42, so anything under 34px on the canvas lands under ~14px on screen.
 */
const MIN_FONT_PX = 34;

/**
 * The template has five slots, each holds exactly one line, and every card
 * fills all five: that is what makes the eight cards look like one family.
 */
const SLOT_NAMES = ["domain", "eyebrow", "title", "sub", "foot"];

/** The six vertical spaces must agree with each other to this many pixels. */
const SPACE_TOLERANCE = 0.5;

const ICONS = [
	{ file: "apple-touch-icon.png", size: 180 },
	{ file: "icon-192.png", size: 192 },
	{ file: "icon-512.png", size: 512 },
];

const CHROME_CANDIDATES = [
	process.env.PW_CHROME,
	process.env.CHROME_PATH,
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Chromium.app/Contents/MacOS/Chromium",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
	"/usr/bin/chromium-browser",
].filter(Boolean);

const args = process.argv.slice(2);
const flag = (name, fallback) => {
	const index = args.indexOf(`--${name}`);
	return index === -1 ? fallback : args[index + 1];
};

const only = flag("only", null);
const maxKb = Number(flag("max-kb", "150"));

const chrome = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
if (!chrome) {
	console.error(
		"No Chrome/Chromium binary found. Install one or set PW_CHROME.",
	);
	process.exit(1);
}

/** Reads the IHDR size of a PNG so a wrong viewport cannot slip through. */
function pngSize(buffer) {
	if (buffer.toString("ascii", 1, 4) !== "PNG") {
		throw new Error("expected a PNG");
	}
	return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/**
 * Runs inside the rendered page. The template is rigid, so this does not try to
 * help it fit: it reports every way the copy breaks the five fixed slots.
 */
function audit({ minFontPx, slotNames, tolerance }) {
	const card = document.getElementById("card");
	const frame = card.getBoundingClientRect();
	const problems = [];

	const carriesText = (element) =>
		Array.from(element.childNodes).some(
			(node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
		);

	const elements = Array.from(card.querySelectorAll("*"))
		.filter(carriesText)
		.filter((element) => element.getClientRects().length > 0);

	const filled = new Set();

	for (const element of elements) {
		const host = element.closest("[data-slot]");
		if (host) filled.add(host.dataset.slot);

		const label = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}`;
		const excerpt = element.textContent.trim().slice(0, 42);
		const style = getComputedStyle(element);
		const size = Number.parseFloat(style.fontSize);
		const lineHeight = Number.parseFloat(style.lineHeight);
		const box = element.getBoundingClientRect();
		const lines = lineHeight ? Math.round(box.height / lineHeight) : 1;

		if (size < minFontPx) {
			problems.push(`${label} a ${size}px («${excerpt}»), mínimo ${minFontPx}px`);
		}
		if (lines > 1) {
			problems.push(
				`${label} ocupa ${lines} líneas («${excerpt}»), la ranura admite una`,
			);
		}
		if (
			box.left < frame.left - 0.5 ||
			box.top < frame.top - 0.5 ||
			box.right > frame.right + 0.5 ||
			box.bottom > frame.bottom + 0.5
		) {
			problems.push(
				`${label} se sale del lienzo («${excerpt}»): ${Math.round(box.left)},${Math.round(box.top)} → ${Math.round(box.right)},${Math.round(box.bottom)}`,
			);
		}
		if (element.scrollWidth > element.clientWidth + 1) {
			const over = element.scrollWidth - element.clientWidth;
			problems.push(
				`${label} no cabe en su ranura («${excerpt}»): sobran ${over}px de ${element.clientWidth}`,
			);
		}
	}

	for (const name of slotNames) {
		if (!filled.has(name)) problems.push(`la ranura "${name}" quedó sin texto`);
	}

	// The rhythm is measured on the typographic box of each slot rather than on
	// ink: a Q tail or a descender dips into the space below without moving it,
	// and measuring ink would make the gaps depend on which words a card uses.
	const slotBox = (name) => {
		const host = card.querySelector(`[data-slot="${name}"]`);
		if (!host) return null;

		const rects = [];
		const mark = host.querySelector(".mark");
		if (mark) rects.push(mark.getBoundingClientRect());

		const carriesText = (node) =>
			Array.from(node.childNodes).some(
				(child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim(),
			);

		const leaves = Array.from(host.querySelectorAll("*")).filter(carriesText);
		if (!leaves.length && carriesText(host)) leaves.push(host);

		for (const leaf of leaves) {
			const range = document.createRange();
			range.selectNodeContents(leaf);
			for (const rect of range.getClientRects()) rects.push(rect);
		}

		if (!rects.length) return null;
		return {
			top: Math.min(...rects.map((rect) => rect.top)) - frame.top,
			bottom: Math.max(...rects.map((rect) => rect.bottom)) - frame.top,
		};
	};

	const boxes = slotNames.map(slotBox).filter(Boolean);
	const spaces = [boxes[0].top];

	for (let i = 1; i < boxes.length; i += 1) {
		spaces.push(boxes[i].top - boxes[i - 1].bottom);
	}
	spaces.push(card.offsetHeight - boxes[boxes.length - 1].bottom);

	const spread = Math.max(...spaces) - Math.min(...spaces);
	if (spread > tolerance) {
		problems.push(
			`los seis espacios no son simétricos: [${spaces.map((s) => s.toFixed(1)).join(", ")}], dispersión ${spread.toFixed(1)}px`,
		);
	}

	return {
		problems,
		spaces,
		slots: filled.size,
		smallest: elements.reduce(
			(min, element) =>
				Math.min(min, Number.parseFloat(getComputedStyle(element).fontSize)),
			Number.POSITIVE_INFINITY,
		),
	};
}

function assertPng(buffer, file) {
	const size = pngSize(buffer);
	if (size.width !== WIDTH || size.height !== HEIGHT) {
		throw new Error(
			`public/${file} is ${size.width}x${size.height}, expected ${WIDTH}x${HEIGHT}`,
		);
	}
	const kb = buffer.length / 1024;
	if (kb > maxKb) {
		throw new Error(
			`public/${file} is ${kb.toFixed(0)} KB, over --max-kb ${maxKb}`,
		);
	}
	return kb;
}

const { socialCardSpecs, updateManifest, writeManifest } = await import(
	pathToFileURL(join(ROOT, "scripts/social-cards.mjs")).href
);

const specs = await socialCardSpecs();
const selected = specs.filter(
	(spec) => !only || spec.file.includes(only) || spec.page.includes(only),
);

if (!selected.length) {
	console.error(`--only ${only} matched no card`);
	process.exit(1);
}

mkdirSync(join(PUBLIC, "og"), { recursive: true });

const browser = await chromium.launch({
	executablePath: chrome,
	// A grey, un-hinted rasteriser keeps exported text looking the same on any
	// host display, and a fully drawn frame keeps the capture from racing the paint.
	args: ["--disable-lcd-text", "--run-all-compositor-stages-before-draw"],
});
const context = await browser.newContext({
	viewport: { width: WIDTH, height: HEIGHT },
	deviceScaleFactor: 1,
});
const page = await context.newPage();

try {
	for (const spec of selected) {
		// A fresh load per card keeps its output independent of which card was
		// rendered before it: Chrome's text rasterisation is order-sensitive, and
		// the manifest hash would otherwise depend on the batch composition.
		await page.goto(CARD_PAGE, { waitUntil: "load" });
		await page.waitForFunction(() => window.__cardReady !== undefined);

		await page.evaluate((copy) => window.__setCard(copy), spec.copy);

		const report = await page.evaluate(audit, {
			minFontPx: MIN_FONT_PX,
			slotNames: SLOT_NAMES,
			tolerance: SPACE_TOLERANCE,
		});
		if (report.problems.length) {
			throw new Error(
				`${spec.file} no encaja en la plantilla:\n  - ${report.problems.join("\n  - ")}`,
			);
		}

		const buffer = await page.locator("#card").screenshot({ type: "png" });
		const file = spec.file.replace(/^\//, "");
		const kb = assertPng(buffer, file);
		writeFileSync(join(PUBLIC, file), buffer);

		console.log(
			`wrote public/${file} ${WIDTH}x${HEIGHT} ${kb.toFixed(0)} KB · ` +
				`${report.slots} ranuras, mínimo ${report.smallest}px, espacios ${report.spaces.map((s) => s.toFixed(1)).join("/")}`,
		);
	}

	if (only) {
		for (const spec of selected) updateManifest(spec);
		console.log(
			`actualizadas ${selected.length} entradas de scripts/social-cards.json`,
		);
	} else {
		const cards = writeManifest(specs);
		console.log(`wrote scripts/social-cards.json (${cards.length} tarjetas)`);
	}

	for (const icon of only ? [] : ICONS) {
		await page.setViewportSize({ width: icon.size, height: icon.size });
		await page.goto(`${ICON_PAGE}?size=${icon.size}`, { waitUntil: "load" });
		await page.evaluate(() => document.fonts.ready);

		const buffer = await page.screenshot({ type: "png" });
		const size = pngSize(buffer);
		if (size.width !== icon.size || size.height !== icon.size) {
			throw new Error(
				`public/${icon.file} is ${size.width}x${size.height}, expected ${icon.size}x${icon.size}`,
			);
		}
		writeFileSync(join(PUBLIC, icon.file), buffer);
		console.log(`wrote public/${icon.file} ${size.width}x${size.height}`);
	}
} finally {
	await browser.close();
}
