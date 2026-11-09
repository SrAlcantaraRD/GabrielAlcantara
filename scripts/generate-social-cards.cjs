/**
 * Regenerates the social share card and app icons in `public/`.
 *
 * The card is a committed PNG, so it must be regenerated whenever the
 * headline, role, or tagline changes. Rendering goes through a headless
 * Chrome so the output matches the site's typography exactly, with the
 * Inter Variable woff2 embedded from node_modules.
 *
 * Usage: node scripts/generate-social-cards.cjs
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const SCRATCH = fs.mkdtempSync(path.join(os.tmpdir(), "social-cards-"));

const CHROME_CANDIDATES = [
	process.env.CHROME_PATH,
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Chromium.app/Contents/MacOS/Chromium",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium",
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) {
	console.error("No Chrome/Chromium binary found. Set CHROME_PATH.");
	process.exit(1);
}

const font = fs
	.readFileSync(
		path.join(
			ROOT,
			"node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
		),
	)
	.toString("base64");

// Inline the mark with a fixed fill so it does not depend on color-scheme.
const mark = fs
	.readFileSync(path.join(PUBLIC, "favicon.svg"), "utf8")
	.replace(/<style>[\s\S]*?<\/style>/, "")
	.replace('fill="none"', "")
	.replace("<path ", '<path fill="#111" ');

const fontFace = `
@font-face {
  font-family: "InterV";
  src: url(data:font/woff2;base64,${font}) format("woff2-variations");
  font-weight: 100 900;
  font-display: block;
}`;

const cardHtml = `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fontFace}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; }
body {
  background: #ffffff;
  font-family: "InterV", -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 76px 80px;
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative;
}
.glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(680px 380px at 108% -12%, rgba(52, 211, 153, .16), transparent 62%),
    radial-gradient(560px 320px at -8% 112%, rgba(59, 130, 246, .10), transparent 60%);
}
.top { display: flex; align-items: center; gap: 16px; position: relative; }
.mark { width: 52px; height: 52px; }
.mark svg { width: 100%; height: 100%; display: block; }
.url { font-size: 21px; color: #9b9b9b; letter-spacing: .01em; }
.mid { position: relative; }
.stroke { width: 76px; height: 5px; background: #34d399; border-radius: 99px; margin-bottom: 34px; }
.name { font-size: 86px; line-height: 1.04; font-weight: 700; letter-spacing: -.038em; color: #121212; }
.role {
  margin-top: 26px; font-size: 35px; font-weight: 450; letter-spacing: -.012em;
  color: #5f5f5f; text-transform: lowercase;
}
.bottom {
  position: relative; border-top: 1px solid #ebebeb; padding-top: 26px;
  font-size: 21px; color: #9b9b9b; letter-spacing: .01em; text-transform: lowercase;
}
</style></head><body>
  <div class="glow"></div>
  <div class="top">
    <div class="mark">${mark}</div>
    <div class="url">gabrielalcantara.com</div>
  </div>
  <div class="mid">
    <div class="stroke"></div>
    <div class="name">Gabriel Alcántara</div>
    <div class="role">solutions architect · software engineer</div>
  </div>
  <div class="bottom">desde 2011 · event-driven architecture · tdd · cloud · ia aplicada</div>
</body></html>`;

const iconHtml = (size) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${size}px; height: ${size}px; background: #ffffff; }
body { display: flex; align-items: center; justify-content: center; }
.mark { width: ${Math.round(size * 0.55)}px; height: ${Math.round(size * 0.55)}px; }
.mark svg { width: 100%; height: 100%; display: block; }
</style></head><body><div class="mark">${mark}</div></body></html>`;

function render(html, filename, width, height) {
	const source = path.join(SCRATCH, `${filename}.html`);
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
	console.log(`wrote public/${filename} (${width}x${height})`);
}

render(cardHtml, "og-image.png", 1200, 630);
render(iconHtml(180), "apple-touch-icon.png", 180, 180);
render(iconHtml(192), "icon-192.png", 192, 192);
render(iconHtml(512), "icon-512.png", 512, 512);

fs.rmSync(SCRATCH, { recursive: true, force: true });
