#!/usr/bin/env node
/**
 * UI check for the trajectory matrix.
 *
 * Serves the built site, drives it with Playwright over the system Chrome and
 * writes screenshots to ui-artifacts/. Run `pnpm build` first.
 *
 *   node scripts/ui-check.mjs            # checks + screenshots
 *   PW_CHROME=/path/to/chrome node …     # other Chrome binary
 */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const ROOT = new URL("../dist/", import.meta.url).pathname;
const OUT = new URL("../ui-artifacts/", import.meta.url).pathname;
const CHROME =
	process.env.PW_CHROME ??
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const MIME = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".webmanifest": "application/manifest+json",
};

const SCENARIOS = [
	{ name: "timeline-companies", query: "" },
	{ name: "timeline-positions", query: "?y=position" },
	{ name: "matrix-company-position", query: "?x=company&y=position" },
	{ name: "window-acd", query: "?y=position&w=acd" },
	{ name: "tooltip", query: "?y=position", hover: "love-isdin" },
	{ name: "drawer", query: "?y=position", click: "acd-charts" },
];

const VIEWPORTS = [
	{ name: "desktop", width: 1440, height: 900 },
	{ name: "mobile", width: 390, height: 844 },
];

if (!existsSync(ROOT)) {
	console.error("dist/ is missing: run `pnpm build` first.");
	process.exit(1);
}

function serve() {
	const server = createServer(async (request, response) => {
		const url = new URL(request.url ?? "/", "http://localhost");
		const relative = normalize(decodeURIComponent(url.pathname)).replace(
			/^(\.\.[/\\])+/,
			"",
		);
		let file = join(ROOT, relative);
		if (relative.endsWith("/")) file = join(file, "index.html");
		try {
			const body = await readFile(file);
			response.writeHead(200, {
				"content-type": MIME[extname(file)] ?? "application/octet-stream",
			});
			response.end(body);
		} catch {
			response.writeHead(404).end("not found");
		}
	});
	return new Promise((resolve) => {
		server.listen(0, "127.0.0.1", () =>
			resolve({ server, port: server.address().port }),
		);
	});
}

const results = [];
const check = (label, ok, detail = "") => {
	results.push(`${ok ? "ok  " : "FAIL"} ${label}${detail ? `: ${detail}` : ""}`);
};

/**
 * The header and footer are persisted across ClientRouter swaps. Drive real
 * navigations on one page and check that the nodes survive, while the header
 * resyncs its active link and breadcrumbs and the mobile menu closes.
 */
async function checkPersistentChrome(page, viewport) {
	const label = `${viewport.name}/persistencia`;
	const desktop = viewport.name === "desktop";
	const activeSelector = desktop
		? ".site-nav a[aria-current='page']"
		: ".mobile-menu a[aria-current='page']";
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});

	const at = (path) =>
		page.waitForFunction((expected) => location.pathname === expected, path);
	const crumbLabels = () =>
		page.$$eval(".header-crumbs .breadcrumbs li", (nodes) =>
			nodes.map((node) => node.textContent?.trim() ?? ""),
		);
	const waitCrumbs = (expected) =>
		page.waitForFunction(
			(items) =>
				JSON.stringify(
					[...document.querySelectorAll(".header-crumbs .breadcrumbs li")].map(
						(node) => node.textContent?.trim() ?? "",
					),
				) === JSON.stringify(items),
			expected,
		);
	const waitArticleCrumbs = () =>
		page.waitForFunction(() => {
			const items = [
				...document.querySelectorAll(".header-crumbs .breadcrumbs li"),
			].map((node) => node.textContent?.trim() ?? "");
			return (
				items.length === 4 &&
				items[0] === "Inicio" &&
				items[1] === "Blog" &&
				items[2] === "DDD" &&
				items[3].startsWith("DDD")
			);
		});
	const activeLabel = () =>
		page.evaluate(
			(selector) =>
				document.querySelector(selector)?.textContent?.trim() ?? "",
			activeSelector,
		);
	const waitActive = (text) =>
		page.waitForFunction(
			([selector, expected]) =>
				document.querySelector(selector)?.textContent?.trim() === expected,
			[activeSelector, text],
		);
	const sameNode = (selector, key) =>
		page.evaluate(
			([css, name]) => document.querySelector(css) === window[name],
			[selector, key],
		);
	const go = async (href) => {
		if (!desktop) await page.locator(".mobile-menu summary").click();
		await page
			.locator(`${desktop ? ".site-nav" : ".mobile-menu"} a[href="${href}"]`)
			.first()
			.click();
		await at(new URL(href, base).pathname);
	};

	await page.goto(base, { waitUntil: "load" });
	await page.waitForSelector(".site-header");
	await page.evaluate(() => {
		window.__persistedHeader = document.querySelector(".site-header");
		window.__persistedFooter = document.querySelector(".site-footer");
	});

	const names = await page.evaluate(() => ({
		header: getComputedStyle(document.querySelector(".site-header")).viewTransitionName,
		footer: getComputedStyle(document.querySelector(".site-footer")).viewTransitionName,
	}));
	check(
		`${label} · nombres de view transition`,
		names.header === "site-header" && names.footer === "site-footer",
		JSON.stringify(names),
	);
	check(
		`${label} · migas ocultas en inicio`,
		await page
			.locator(".header-crumbs .breadcrumbs")
			.evaluate((element) => element.hidden),
	);

	await go("/about/");
	await waitCrumbs(["Inicio", "Sobre mí"]);
	check(`${label} · header persiste`, await sameNode(".site-header", "__persistedHeader"));
	check(`${label} · footer persiste`, await sameNode(".site-footer", "__persistedFooter"));
	await waitActive("Sobre mí");
	check(`${label} · nav activo`, (await activeLabel()) === "Sobre mí");
	check(
		`${label} · migas actualizadas`,
		JSON.stringify(await crumbLabels()) === JSON.stringify(["Inicio", "Sobre mí"]),
		JSON.stringify(await crumbLabels()),
	);
	if (!desktop) {
		check(
			`${label} · menú móvil se cierra`,
			!(await page
				.locator(".mobile-menu")
				.evaluate((element) => element.hasAttribute("open"))),
		);
	}

	await go("/blog/");
	await waitCrumbs(["Inicio", "Blog"]);
	await waitActive("Blog");
	check(`${label} · blog activo`, (await activeLabel()) === "Blog");
	check(
		`${label} · migas de blog`,
		JSON.stringify(await crumbLabels()) === JSON.stringify(["Inicio", "Blog"]),
		JSON.stringify(await crumbLabels()),
	);

	await page.locator('a[href="/blog/ddd-dominios-complejos/"]').first().click();
	await at("/blog/ddd-dominios-complejos/");
	await waitArticleCrumbs();
	const articleCrumbs = await crumbLabels();
	check(
		`${label} · migas de artículo`,
		articleCrumbs.length === 4 && articleCrumbs[3].startsWith("DDD"),
		JSON.stringify(articleCrumbs),
	);
	await waitActive("Blog");
	check(`${label} · nav activo en artículo`, (await activeLabel()) === "Blog");
	check(
		`${label} · header persiste en artículo`,
		await sameNode(".site-header", "__persistedHeader"),
	);

	await page.locator(".brand").click();
	await at("/");
	await page.waitForFunction(
		() => document.querySelector(".header-crumbs .breadcrumbs")?.hidden === true,
	);
	await waitActive("Inicio");
	check(`${label} · inicio activo de nuevo`, (await activeLabel()) === "Inicio");
	check(
		`${label} · header persiste al inicio`,
		await sameNode(".site-header", "__persistedHeader"),
	);

	await page.goBack();
	await at("/blog/ddd-dominios-complejos/");
	await waitArticleCrumbs();
	check(
		`${label} · atrás conserva header`,
		await sameNode(".site-header", "__persistedHeader"),
	);
	check(
		`${label} · atrás restaura migas`,
		JSON.stringify(await crumbLabels()) === JSON.stringify(articleCrumbs),
		JSON.stringify(await crumbLabels()),
	);
	check(`${label} · sin errores de consola`, errors.length === 0, errors.join(" | "));
}

const { server, port } = await serve();
const base = `http://127.0.0.1:${port}/`;
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: CHROME });

for (const viewport of VIEWPORTS) {
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		reducedMotion: "reduce",
	});

	for (const scenario of SCENARIOS) {
		const page = await context.newPage();
		await page.goto(`${base}experience/${scenario.query}`, { waitUntil: "load" });
		await page.waitForFunction(
			() => document.querySelectorAll(".bar").length > 0,
		);

		if (scenario.hover) {
			await page
				.locator(`.bar[data-project="${scenario.hover}"]`)
				.first()
				.hover();
			await page.waitForSelector("#matrix-tip:not([hidden])");
		}
		if (scenario.click) {
			await page.locator(`.bar[data-project="${scenario.click}"]`).first().click();
			await page.waitForSelector("#project-drawer.is-open");
		}

		const label = `${viewport.name}/${scenario.name}`;
		const snapshot = await page.evaluate(() => {
			const surface = document.querySelector(".matrix-surface");
			const tip = document.getElementById("matrix-tip");
			return {
				firstSection: document.querySelector("main > section")?.id,
				mode: document.getElementById("matrix-grid")?.dataset.mode,
				bars: document.querySelectorAll(".bar").length,
				rows: document.querySelectorAll(".gantt-row, .matrix-grid .row-label").length,
				ruler: document.querySelectorAll(".ruler-year").length,
				range: document.getElementById("matrix-range")?.textContent ?? "",
				tipVisible: tip ? !tip.hidden : false,
				drawerOpen: document
					.getElementById("project-drawer")
					?.classList.contains("is-open"),
				overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
				surfaceScroll: surface ? surface.scrollWidth > surface.clientWidth : null,
			};
		});

		check(`${label} · primera sección`, snapshot.firstSection === "trayectoria", snapshot.firstSection);
		check(`${label} · barras dibujadas`, snapshot.bars > 0, String(snapshot.bars));
		check(`${label} · sin desbordamiento de página`, snapshot.overflow === false);
		if (scenario.hover) check(`${label} · tooltip`, snapshot.tipVisible === true);
		if (scenario.click) {
			check(`${label} · ficha abierta`, snapshot.drawerOpen === true);
			check(`${label} · sin tooltip sobre la ficha`, snapshot.tipVisible === false);
		}
		if (snapshot.mode === "matrix")
			check(`${label} · sin regla fija de años`, snapshot.ruler === 0, String(snapshot.ruler));

		const target = await page.evaluate(() => {
			const section = document.getElementById("trayectoria");
			const box = section.getBoundingClientRect();
			return { y: box.top + window.scrollY - 16, height: box.height + 32 };
		});
		const file = join(OUT, `${viewport.name}-${scenario.name}.png`);
		await page.screenshot({
			path: file,
			fullPage: false,
			clip: {
				x: 0,
				y: Math.max(0, target.y),
				width: viewport.width,
				height: Math.min(target.height, 4000),
			},
		});
		console.log(`${label} → ${file}`);
		await page.close();
	}

	const chromePage = await context.newPage();
	try {
		await checkPersistentChrome(chromePage, viewport);
	} finally {
		await chromePage.close();
	}

	await context.close();
}

await browser.close();
server.close();

console.log(`\n${results.join("\n")}`);
const failed = results.filter((line) => line.startsWith("FAIL"));
console.log(`\n${results.length - failed.length}/${results.length} comprobaciones correctas`);
process.exit(failed.length > 0 ? 1 : 0);
