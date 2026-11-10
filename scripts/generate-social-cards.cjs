/**
 * Regenerates the social share cards and app icons in `public/`.
 *
 * One default card, one card per case study (Nakire TPS and Bodega Digital) and
 * one per blog post. Card copy is read from the same modules that render the
 * pages (`src/data/blog.ts` and `src/data/projects.ts`), so a title change
 * cannot leave the shared image announcing something different.
 *
 * Fonts are embedded from the site's own dependencies — Newsreader for the
 * name and titles, Plus Jakarta Sans for the role and JetBrains Mono for the
 * label row — so the output matches the site's typography and no extra package
 * is needed.
 *
 * Rendering goes through headless Chrome. Each run also records the title,
 * page and SHA-256 of every page card in `scripts/social-cards.json`, which
 * `pnpm test` checks against the current metadata.
 *
 * Usage: pnpm social:cards
 *        CHROME_PATH=/path/to/chrome pnpm social:cards
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OG_DIR = path.join(PUBLIC, "og");

const CHROME_CANDIDATES = [
	process.env.CHROME_PATH,
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Chromium.app/Contents/MacOS/Chromium",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
	"/usr/bin/chromium-browser",
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) {
	console.error(
		"No Chrome/Chromium binary found. Install one or set CHROME_PATH.",
	);
	process.exit(1);
}

/** Reads a font shipped with an already-installed Fontsource package. */
function readFont(relativePath) {
	const file = path.join(ROOT, "node_modules", relativePath);
	if (!fs.existsSync(file)) {
		console.error(
			`Missing font ${relativePath}. Run \`pnpm install\` before regenerating the cards.`,
		);
		process.exit(1);
	}
	return fs.readFileSync(file).toString("base64");
}

const fontFace = `
@font-face {
  font-family: "CardSerif";
  src: url(data:font/woff2;base64,${readFont(
		"@fontsource/newsreader/files/newsreader-latin-400-normal.woff2",
	)}) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "CardSerif";
  src: url(data:font/woff2;base64,${readFont(
		"@fontsource/newsreader/files/newsreader-latin-400-italic.woff2",
	)}) format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: block;
}
@font-face {
  font-family: "CardSans";
  src: url(data:font/woff2;base64,${readFont(
		"@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
	)}) format("woff2-variations");
  font-weight: 100 900;
  font-style: normal;
  font-display: block;
}
@font-face {
  font-family: "CardMono";
  src: url(data:font/woff2;base64,${readFont(
		"@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
	)}) format("woff2-variations");
  font-weight: 100 800;
  font-style: normal;
  font-display: block;
}`;

// Inline the mark with a fixed fill so it does not depend on color-scheme.
const mark = fs
	.readFileSync(path.join(PUBLIC, "favicon.svg"), "utf8")
	.replace(/<style>[\s\S]*?<\/style>/, "")
	.replace('fill="none"', "")
	.replace("<path ", '<path fill="#1a1a1a" ');

const CARD = {
	name: "Gabriel Alcántara",
	role: "software architect · software engineer",
	footer: "sistemas distribuidos · arquitectura orientada a eventos · automatización industrial",
	since: "desde 2011",
	url: "gabrielalcantara.com",
};

const escapeHtml = (value) =>
	String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

/** Titles are one or two lines; shrink long ones instead of clipping them. */
function titleSize(title) {
	const length = title.length;
	if (length <= 22) return 90;
	if (length <= 34) return 76;
	if (length <= 46) return 66;
	if (length <= 62) return 58;
	return 50;
}

const shell = (body) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><style>
${fontFace}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; }
body {
  background: #faf8f5;
  font-family: "CardSans", -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 72px 80px;
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative;
  overflow: hidden;
}
.glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(660px 360px at 106% -10%, rgba(62, 92, 73, .10), transparent 62%),
    radial-gradient(560px 320px at -6% 110%, rgba(41, 76, 96, .08), transparent 60%);
}
.top { display: flex; align-items: center; gap: 14px; position: relative; }
.mark { width: 46px; height: 46px; }
.mark svg { width: 100%; height: 100%; display: block; }
.url {
  font-family: "CardMono", monospace; font-size: 18px; color: #6f6960;
  letter-spacing: .02em;
}
.mid { position: relative; }
.stroke { width: 72px; height: 4px; background: #9e4e36; border-radius: 99px; margin-bottom: 28px; }
.name {
  font-family: "CardSerif", Georgia, serif;
  font-size: 92px; line-height: 1.02; font-weight: 400; letter-spacing: -.022em;
  color: #1a1a1a;
}
.role {
  margin-top: 22px; font-family: "CardSans", sans-serif;
  font-size: 29px; font-weight: 400; letter-spacing: -.005em;
  color: #4f4b47;
}
.eyebrow {
  font-family: "CardMono", monospace; font-size: 16px; letter-spacing: .13em;
  text-transform: uppercase; color: #9e4e36;
}
.title {
  margin-top: 16px; font-family: "CardSerif", Georgia, serif; font-weight: 400;
  line-height: 1.08; letter-spacing: -.02em; color: #1a1a1a;
  max-width: 1040px; text-wrap: balance;
}
.subtitle {
  margin-top: 20px; max-width: 980px;
  font-family: "CardSerif", Georgia, serif; font-style: italic;
  font-size: 29px; line-height: 1.32; color: #4f4b47;
}
.meta {
  margin-top: 16px; font-family: "CardSans", sans-serif;
  font-size: 21px; color: #6f6960;
}
.bottom {
  position: relative; display: flex; align-items: baseline; justify-content: space-between;
  gap: 28px; border-top: 1px solid #e6e0d6; padding-top: 24px;
  font-family: "CardMono", monospace; font-size: 16px; letter-spacing: .05em;
  text-transform: uppercase; color: #6f6960;
}
.bottom .right { flex: none; color: #9e4e36; }
</style></head><body>
  <div class="glow"></div>
  <div class="top">
    <div class="mark">${mark}</div>
    <div class="url">${CARD.url}</div>
  </div>
  ${body}
</body></html>`;

const defaultCard = () =>
	shell(`<div class="mid">
    <div class="stroke"></div>
    <div class="name">${CARD.name}</div>
    <div class="role">${CARD.role}</div>
  </div>
  <div class="bottom">
    <span>${CARD.footer}</span>
    <span class="right">${CARD.since}</span>
  </div>`);

const detailCard = ({ eyebrow, title, subtitle, meta, footerLeft, footerRight }) =>
	shell(`<div class="mid">
    <div class="stroke"></div>
    <div class="eyebrow">${escapeHtml(eyebrow)}</div>
    <div class="title" style="font-size: ${titleSize(title)}px">${escapeHtml(title)}</div>
    ${subtitle ? `<div class="subtitle">${escapeHtml(subtitle)}</div>` : ""}
    ${meta ? `<div class="meta">${escapeHtml(meta)}</div>` : ""}
  </div>
  <div class="bottom">
    <span>${escapeHtml(footerLeft)}</span>
    <span class="right">${escapeHtml(footerRight)}</span>
  </div>`);

const iconHtml = (size) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${size}px; height: ${size}px; background: #faf8f5; }
body { display: flex; align-items: center; justify-content: center; }
.mark { width: ${Math.round(size * 0.55)}px; height: ${Math.round(size * 0.55)}px; }
.mark svg { width: 100%; height: 100%; display: block; }
</style></head><body><div class="mark">${mark}</div></body></html>`;

/** Reads the IHDR size of a PNG so a wrong viewport cannot slip through. */
function pngSize(file) {
	const buffer = fs.readFileSync(file);
	if (buffer.toString("ascii", 1, 4) !== "PNG") {
		throw new Error(`${file} is not a PNG`);
	}
	return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function render(html, filename, width, height) {
	const source = path.join(SCRATCH, `${filename.replace(/[\\/]/g, "-")}.html`);
	fs.writeFileSync(source, html);
	execFileSync(
		chrome,
		[
			"--headless=new",
			"--disable-gpu",
			"--hide-scrollbars",
			"--no-sandbox",
			"--force-device-scale-factor=1",
			`--window-size=${width},${height}`,
			`--screenshot=${path.join(PUBLIC, filename)}`,
			`file://${source}`,
		],
		{ stdio: "pipe" },
	);

	const size = pngSize(path.join(PUBLIC, filename));
	if (size.width !== width || size.height !== height) {
		throw new Error(
			`public/${filename} is ${size.width}x${size.height}, expected ${width}x${height}`,
		);
	}
	console.log(`wrote public/${filename} (${size.width}x${size.height})`);
}

async function main() {
	const { socialCardSpecs, writeManifest } = await import(
		pathToFileURL(path.join(__dirname, "social-cards.mjs")).href
	);
	const specs = await socialCardSpecs();

	fs.mkdirSync(OG_DIR, { recursive: true });

	render(defaultCard(), "og-image.png", 1200, 630);

	for (const spec of specs) {
		render(detailCard(spec), spec.file.replace(/^\//, ""), 1200, 630);
	}

	const cards = writeManifest(specs);
	console.log(`wrote scripts/social-cards.json (${cards.length} tarjetas)`);

	render(iconHtml(180), "apple-touch-icon.png", 180, 180);
	render(iconHtml(192), "icon-192.png", 192, 192);
	render(iconHtml(512), "icon-512.png", 512, 512);
}

const SCRATCH = fs.mkdtempSync(path.join(os.tmpdir(), "social-cards-"));

main()
	.catch((error) => {
		console.error(error.message ?? error);
		process.exitCode = 1;
	})
	.finally(() => {
		fs.rmSync(SCRATCH, { recursive: true, force: true });
	});
