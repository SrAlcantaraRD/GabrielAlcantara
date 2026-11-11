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
 * Runs inside the rendered page. Deliberately independent of the fitting logic
 * in card.html: this measures what actually shipped, not what tried to fit.
 */
function audit(minFontPx) {
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

	for (const element of elements) {
		const label = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}`;
		const excerpt = element.textContent.trim().slice(0, 42);
		const size = Number.parseFloat(getComputedStyle(element).fontSize);
		const box = element.getBoundingClientRect();

		if (size < minFontPx) {
			problems.push(`${label} a ${size}px («${excerpt}»), mínimo ${minFontPx}px`);
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
			problems.push(
				`${label} desborda su caja («${excerpt}»): ${element.scrollWidth} > ${element.clientWidth}`,
			);
		}
	}

	const lead = document.getElementById("lead");
	const leadStyle = getComputedStyle(lead);
	const lineHeight = Number.parseFloat(leadStyle.lineHeight);

	// The measured block sits between the brand row and the footer rule, so
	// overflowing it collides with them without ever leaving the canvas.
	const mid = document.getElementById("mid");
	const midBox = mid.getBoundingClientRect();
	for (const child of mid.children) {
		if (child.getClientRects().length === 0) continue;
		const box = child.getBoundingClientRect();
		if (box.top < midBox.top - 0.5 || box.bottom > midBox.bottom + 0.5) {
			problems.push(
				`${child.tagName.toLowerCase()}${child.id ? `#${child.id}` : ""} no cabe entre la cabecera y el pie: ${Math.round(box.top)}→${Math.round(box.bottom)} contra ${Math.round(midBox.top)}→${Math.round(midBox.bottom)}`,
			);
		}
	}

	return {
		problems,
		count: elements.length,
		leadSize: Number.parseFloat(leadStyle.fontSize),
		leadLines: Math.round(lead.getBoundingClientRect().height / lineHeight),
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
	// The PNG hash in the manifest is a gate, so the rasteriser has to be
	// reproducible: grayscale antialiasing and a fully drawn frame per capture.
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

		const fitted = await page.evaluate(
			(copy) => window.__setCard(copy),
			spec.copy,
		);

		const report = await page.evaluate(audit, MIN_FONT_PX);
		if (report.problems.length) {
			throw new Error(
				`${spec.file} no pasa la puerta de legibilidad:\n  - ${report.problems.join("\n  - ")}`,
			);
		}

		const buffer = await page.locator("#card").screenshot({ type: "png" });
		const file = spec.file.replace(/^\//, "");
		const kb = assertPng(buffer, file);
		writeFileSync(join(PUBLIC, file), buffer);

		console.log(
			`wrote public/${file} ${WIDTH}x${HEIGHT} ${kb.toFixed(0)} KB · ` +
				`título ${report.leadSize}px ×${report.leadLines} (ajustado a ${fitted.leadSize}px)`,
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
