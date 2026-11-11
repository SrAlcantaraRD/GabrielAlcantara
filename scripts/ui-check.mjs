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

const MOBILE_MENU_VIEWPORTS = [
	{ name: "320x568", width: 320, height: 568 },
	{ name: "360x640", width: 360, height: 640 },
	{ name: "390x480", width: 390, height: 480 },
	{ name: "390x844", width: 390, height: 844 },
	{ name: "430x932", width: 430, height: 932 },
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

async function holdBars(page, time) {
	return page.evaluate((currentTime) => {
		const animations = [...document.querySelectorAll(".locale-bar")].flatMap(
			(bar) => bar.getAnimations(),
		);
		for (const animation of animations) {
			animation.pause();
			animation.currentTime = currentTime;
		}
		return animations.length;
	}, time);
}

async function releaseBars(page) {
	await page.evaluate(() => {
		for (const bar of document.querySelectorAll(".locale-bar")) {
			for (const animation of bar.getAnimations()) animation.play();
		}
	});
}

async function startLocaleTimeline(page) {
	await page.evaluate(() => {
		const timeline = {
			running: true,
			start: performance.now(),
			samples: [],
		};
		window.__localeTimeline = timeline;

		const tick = () => {
			const root = document.querySelector("[data-locale-transition]");
			const bars = [...document.querySelectorAll(".locale-bar")];
			timeline.samples.push({
				t: performance.now() - timeline.start,
				path: location.pathname,
				tops: bars.map((bar) => bar.getBoundingClientRect().top),
				active: root?.classList.contains("is-active") ?? false,
				covering: root?.classList.contains("is-covering") ?? false,
				covered: root?.classList.contains("is-covered") ?? false,
				revealing: root?.classList.contains("is-revealing") ?? false,
				htmlClass: document.documentElement.classList.contains(
					"locale-transition",
				),
				scrollY,
			});
			if (timeline.running) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
	});
}

async function finishLocaleTimeline(page) {
	return page.evaluate(() => {
		window.__localeTimeline.running = false;
		return window.__localeTimeline;
	});
}

function timelineStats(timeline, expectedPath) {
	const active = timeline.samples.filter(
		(sample) => sample.active && sample.tops.length > 0,
	);
	const gaps = timeline.samples
		.slice(1)
		.map((sample, index) => sample.t - timeline.samples[index].t)
		.filter((gap) => gap > 0)
		.sort((a, b) => a - b);
	const maxGap = gaps.at(-1) ?? 0;
	const lastCovered = active.filter((sample) => sample.covered).at(-1);
	const lastSealed = active
		.filter((sample) => sample.covering || sample.covered)
		.at(-1);
	const firstReveal = active.find((sample) => sample.revealing);
	const firstIncoming = active.find((sample) => sample.path === expectedPath);
	const pause =
		firstReveal && lastSealed ? firstReveal.t - lastSealed.t : null;
	const pauseFrames =
		firstReveal && lastSealed
			? active.filter(
					(sample) =>
						sample.t > lastSealed.t && sample.t < firstReveal.t,
				).length
			: null;
	const backwards = [];
	let reanimations = 0;

	for (let index = 1; index < active.length; index += 1) {
		const previous = active[index - 1];
		const current = active[index];
		for (let bar = 0; bar < current.tops.length; bar += 1) {
			if (
				typeof previous.tops[bar] === "number" &&
				typeof current.tops[bar] === "number" &&
				current.tops[bar] < previous.tops[bar] - 0.5
			) {
				backwards.push({
					t: +current.t.toFixed(1),
					bar,
					from: +previous.tops[bar].toFixed(1),
					to: +current.tops[bar].toFixed(1),
				});
			}
		}
		if (current.covering && previous.covered) reanimations += 1;
	}

	return {
		activeSamples: active.length,
		backwards,
		firstIncoming: firstIncoming ? +firstIncoming.t.toFixed(1) : null,
		firstReveal: firstReveal ? +firstReveal.t.toFixed(1) : null,
		lastCovered: lastCovered ? +lastCovered.t.toFixed(1) : null,
		lastSealed: lastSealed ? +lastSealed.t.toFixed(1) : null,
		maxGap: +maxGap.toFixed(1),
		pauseFrames,
		pauseMs: pause === null ? null : +pause.toFixed(1),
		reanimations,
		scrollValues: [...new Set(timeline.samples.map((sample) => sample.scrollY))],
	};
}

async function captureSwapFrames(page, label) {
	const count = await page.locator(".locale-bar").count();
	const coverMs = 420 + Math.max(0, count - 1) * 18 + 40;
	await page.waitForTimeout(Math.max(0, coverMs - 260));

	for (let index = 0; index < 8; index += 1) {
		const state = await page.evaluate(() => {
			const root = document.querySelector("[data-locale-transition]");
			const bar = document.querySelector(".locale-bar");
			return {
				path: location.pathname,
				top: bar ? +bar.getBoundingClientRect().top.toFixed(1) : null,
				covering: root?.classList.contains("is-covering") ?? false,
				covered: root?.classList.contains("is-covered") ?? false,
				revealing: root?.classList.contains("is-revealing") ?? false,
			};
		});
		await saveFrame(page, `${label}-swap-${index}`);
		console.log(
			`locale transition → ${label}-swap-${index}: ${JSON.stringify(state)}`,
		);
		await page.waitForTimeout(35);
	}
}

async function runLocaleTimeline(page, target, expectedPath, label, capture) {
	const fromPath = await page.evaluate(() => location.pathname);
	await page.locator(".locale-trigger").click();
	await startLocaleTimeline(page);
	await page.locator(`.locale-menu a[hreflang="${target}"]`).click();
	await page.waitForSelector("[data-locale-transition].is-active", {
		timeout: 2000,
	});
	if (capture) await captureSwapFrames(page, label);
	await page.waitForFunction(
		(path) =>
			location.pathname === path &&
			!document
				.querySelector("[data-locale-transition]")
				?.classList.contains("is-active"),
		expectedPath,
		{ timeout: 6000 },
	);
	const timeline = await finishLocaleTimeline(page);
	return { ...timeline, expectedPath, fromPath, label };
}

async function saveFrame(page, name) {
	const viewport = page.viewportSize();
	const file = join(OUT, `${name}.png`);
	await page.screenshot({ path: file, fullPage: false });
	const png = await readFile(file);
	const width = png.readUInt32BE(16);
	const height = png.readUInt32BE(20);
	check(
		`locale transition · fotograma ${name}`,
		width === viewport?.width && height === viewport?.height,
		`${width}x${height}`,
	);
	console.log(`locale transition → ${file}`);
}

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
		: ".mobile-menu a[data-nav-key][aria-current='page']";
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
	// The navigation scrolls to home sections, so the detail pages are reached
	// from the "see the full section" link inside each section.
	const go = async (href) => {
		if ((await page.evaluate(() => location.pathname)) !== "/") {
			await page.locator(".brand").click();
			await at("/");
		}
		await page.locator(`main a[href="${href}"]`).first().click();
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
	check(
		`${label} · inicio fuera del header`,
		(await page
			.locator('.site-nav a[data-nav-key="home"], .mobile-menu a[data-nav-key="home"]')
			.count()) === 0,
	);

	// The navigation is a one-page index: it scrolls to the section instead of
	// opening the detail page, and the sticky header must not cover the target.
	if (!desktop) {
		await page.locator(".mobile-menu summary").click();
		const menuContent = await page.evaluate(() => {
			const panel = document.querySelector(".mobile-menu .menu-panel");
			const role = panel?.querySelector(".menu-role");
			const ask = panel?.querySelector(".ask-ai-label");
			return {
				role: role?.textContent?.trim() ?? "",
				roleVisible: role ? getComputedStyle(role).display !== "none" : false,
				ask: ask?.textContent?.trim() ?? "",
				askVisible: ask ? getComputedStyle(ask).display !== "none" : false,
			};
		});
		check(
			`${label} · menú conserva el rol`,
			menuContent.role === "Solutions Architect · Software Engineer" &&
				menuContent.roleVisible,
			JSON.stringify(menuContent),
		);
		check(
			`${label} · menú conserva Pregúntale a`,
			menuContent.ask === "Pregúntale a" && menuContent.askVisible,
			JSON.stringify(menuContent),
		);

		await page.setViewportSize({ width: 390, height: 480 });
		await page.waitForTimeout(50);
		const shortMenu = await page.evaluate(() => {
			const panel = document.querySelector(".mobile-menu .menu-panel");
			if (!panel) return null;
			const box = panel.getBoundingClientRect();
			return {
				bottom: +box.bottom.toFixed(1),
				viewport: innerHeight,
				overflowY: getComputedStyle(panel).overflowY,
				scrollHeight: panel.scrollHeight,
				clientHeight: panel.clientHeight,
			};
		});
		check(
			`${label} · menú no se sale del viewport corto`,
			shortMenu !== null &&
				shortMenu.bottom <= shortMenu.viewport + 1 &&
				shortMenu.overflowY === "auto",
			JSON.stringify(shortMenu),
		);
		await page.setViewportSize({ width: 390, height: 844 });
	}
	await page
		.locator(
			`${desktop ? ".site-nav" : ".mobile-menu"} a[data-nav-key="projects"]`,
		)
		.first()
		.click();
	await page.waitForFunction(() => location.hash === "#proyectos");
	const anchor = await page.evaluate(() => {
		const header =
			document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
		const section =
			document.getElementById("proyectos")?.getBoundingClientRect().top ?? -1;
		const link = document.querySelector(
			'.site-nav a[data-nav-key="projects"], .mobile-menu a[data-nav-key="projects"]',
		);
		return { header, section, active: link?.getAttribute("aria-current") };
	});
	check(
		`${label} · navegación hace scroll a la sección`,
		anchor.section > anchor.header && anchor.section <= anchor.header + 40,
		JSON.stringify(anchor),
	);
	check(`${label} · sección activa tras el scroll`, anchor.active === "page");
	if (!desktop) {
		check(
			`${label} · menú móvil se cierra al saltar`,
			!(await page
				.locator(".mobile-menu")
				.evaluate((element) => element.hasAttribute("open"))),
		);
	}

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
	await page.waitForFunction(
		(selector) => document.querySelectorAll(selector).length === 0,
		activeSelector,
	);
	check(
		`${label} · sin nav activo al volver al inicio`,
		(await page.locator(activeSelector).count()) === 0,
	);
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

async function checkMobileMenu(browser, base) {
	const audit = [];

	for (const viewport of MOBILE_MENU_VIEWPORTS) {
		const context = await browser.newContext({
			viewport: { width: viewport.width, height: viewport.height },
			isMobile: true,
			hasTouch: true,
		});
		const page = await context.newPage();
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("console", (message) => {
			if (message.type() === "error") errors.push(message.text());
		});

		await page.goto(base, { waitUntil: "networkidle" });
		const summary = page.locator(".mobile-menu summary");
		await summary.click();
		await page.waitForTimeout(80);
		const label = `mobile menu · ${viewport.name}`;

		const initial = await page.evaluate(() => {
			const panel = document.querySelector(".mobile-menu .menu-panel");
			const role = panel?.querySelector(".menu-role");
			const askLabel = panel?.querySelector(".ask-ai-label");
			const links = [...(panel?.querySelectorAll(".menu-ask a") ?? [])];
			const box = panel?.getBoundingClientRect();
			const roleBox = role?.getBoundingClientRect();
			const summaryBox = document
				.querySelector(".mobile-menu summary")
				?.getBoundingClientRect();
			const ancestors = [];
			let node = panel?.parentElement;
			while (node) {
				const style = getComputedStyle(node);
				const overflow = `${style.overflowX}/${style.overflowY}`;
				if (/(hidden|clip)/.test(overflow)) {
					ancestors.push({
						tag: node.tagName,
						className: node.className,
						overflow,
					});
				}
				node = node.parentElement;
			}

			return {
				viewport: { width: innerWidth, height: innerHeight },
				panel: box
					? {
							top: +box.top.toFixed(1),
							right: +box.right.toFixed(1),
							bottom: +box.bottom.toFixed(1),
							left: +box.left.toFixed(1),
							width: +box.width.toFixed(1),
							height: +box.height.toFixed(1),
						}
					: null,
				role: role?.textContent?.trim() ?? null,
				roleVisible: Boolean(
					roleBox &&
						box &&
						roleBox.top >= box.top - 1 &&
						roleBox.bottom <= box.bottom + 1 &&
						roleBox.top >= 0 &&
						roleBox.bottom <= innerHeight,
				),
				askLabel: askLabel?.textContent?.trim() ?? null,
				links: links.map((link) => link.textContent?.trim()),
				overflowY: panel ? getComputedStyle(panel).overflowY : null,
				scrollHeight: panel?.scrollHeight ?? null,
				clientHeight: panel?.clientHeight ?? null,
				ancestors,
				summary: summaryBox
					? {
							top: +summaryBox.top.toFixed(1),
							bottom: +summaryBox.bottom.toFixed(1),
							left: +summaryBox.left.toFixed(1),
							right: +summaryBox.right.toFixed(1),
						}
					: null,
			};
		});

		const panelInside = Boolean(
			initial.panel &&
				initial.panel.top >= 0 &&
				initial.panel.left >= 0 &&
				initial.panel.right <= initial.viewport.width + 0.5 &&
				initial.panel.bottom <= initial.viewport.height + 0.5,
		);
		check(
			`${label} · panel dentro del viewport`,
			panelInside,
			JSON.stringify(initial.panel),
		);
		check(
			`${label} · rol visible`,
			initial.role === "Solutions Architect · Software Engineer" &&
				initial.roleVisible,
			JSON.stringify({ role: initial.role, visible: initial.roleVisible }),
		);
		check(
			`${label} · Pregúntale a y asistentes presentes`,
			initial.askLabel === "Pregúntale a" &&
				JSON.stringify(initial.links) ===
					JSON.stringify(["ChatGPT", "Claude", "Gemini"]),
			JSON.stringify({ askLabel: initial.askLabel, links: initial.links }),
		);
		check(
			`${label} · sin ancestros con overflow oculto`,
			initial.ancestors.length === 0,
			JSON.stringify(initial.ancestors),
		);
		check(
			`${label} · toggle alcanzable`,
			initial.summary !== null &&
				initial.summary.top >= 0 &&
				initial.summary.bottom <= initial.viewport.height &&
				initial.summary.left >= 0 &&
				initial.summary.right <= initial.viewport.width,
			JSON.stringify(initial.summary),
		);
		check(
			`${label} · panel con scroll interno`,
			initial.overflowY === "auto" &&
				typeof initial.scrollHeight === "number" &&
				typeof initial.clientHeight === "number",
			JSON.stringify({
				overflowY: initial.overflowY,
				scrollHeight: initial.scrollHeight,
				clientHeight: initial.clientHeight,
			}),
		);

		await page.screenshot({
			path: join(OUT, `mobile-menu-${viewport.name}-open.png`),
		});
		const scrolled = await page.evaluate(async () => {
			const panel = document.querySelector(".mobile-menu .menu-panel");
			if (!panel) return null;
			const max = Math.max(0, panel.scrollHeight - panel.clientHeight);
			panel.scrollTop = max;
			await new Promise((resolve) => requestAnimationFrame(resolve));
			const panelBox = panel.getBoundingClientRect();
			const links = [...panel.querySelectorAll(".menu-ask a")];
			return {
				max,
				scrollTop: panel.scrollTop,
				links: links.map((link) => {
					const box = link.getBoundingClientRect();
					return {
						text: link.textContent?.trim(),
						top: +box.top.toFixed(1),
						bottom: +box.bottom.toFixed(1),
						insidePanel:
							box.top >= panelBox.top - 1 &&
							box.bottom <= panelBox.bottom + 1,
						insideViewport: box.top >= 0 && box.bottom <= innerHeight,
					};
				}),
			};
		});
		check(
			`${label} · scroll alcanza el último enlace`,
			scrolled !== null &&
				Math.abs(scrolled.scrollTop - scrolled.max) < 1 &&
				scrolled.links.every(
					(link) => link.insidePanel && link.insideViewport,
				),
			JSON.stringify(scrolled),
		);
		await page.screenshot({
			path: join(OUT, `mobile-menu-${viewport.name}-scrolled.png`),
		});

		await summary.click();
		await page.waitForTimeout(50);
		const closed = await page.evaluate(() => {
			const menu = document.querySelector(".mobile-menu");
			const panel = document.querySelector(".mobile-menu .menu-panel");
			return {
				open: menu?.hasAttribute("open") ?? null,
				panelVisible: panel
					? panel.checkVisibility({
							checkOpacity: true,
							checkVisibilityCSS: true,
						})
					: false,
				bodyOverflowY: getComputedStyle(document.body).overflowY,
				pageScrollable:
					document.documentElement.scrollHeight > window.innerHeight,
			};
		});
		check(
			`${label} · cierra desde el viewport corto`,
			closed.open === false &&
				closed.panelVisible === false &&
				closed.bodyOverflowY !== "hidden",
			JSON.stringify(closed),
		);
		await page.evaluate(() => window.scrollTo(0, 240));
		const scrollAfterClose = await page.evaluate(() => window.scrollY);
		check(
			`${label} · cierre restaura la página`,
			closed.pageScrollable ? scrollAfterClose > 0 : scrollAfterClose === 0,
			JSON.stringify({ pageScrollable: closed.pageScrollable, scrollAfterClose }),
		);
		await page.screenshot({
			path: join(OUT, `mobile-menu-${viewport.name}-closed.png`),
		});
		check(
			`${label} · sin errores de consola`,
			errors.length === 0,
			errors.join(" | "),
		);
		audit.push({
			viewport: viewport.name,
			initial,
			scrolled,
			closed: { ...closed, scrollAfterClose },
		});
		await context.close();
	}

	const desktopContext = await browser.newContext({
		viewport: { width: 1440, height: 900 },
	});
	const desktopPage = await desktopContext.newPage();
	await desktopPage.goto(base, { waitUntil: "networkidle" });
	const desktop = await desktopPage.evaluate(() => {
		const role = document.querySelector(".brand-role");
		const menu = document.querySelector(".mobile-menu");
		const menuRole = document.querySelector(".menu-role");
		const visibleRoles = [...document.querySelectorAll(".brand-role, .menu-role")].filter(
			(element) => {
				const box = element.getBoundingClientRect();
				return (
					getComputedStyle(element).display !== "none" &&
					box.width > 0 &&
					box.height > 0
				);
			},
		);
		return {
			role: role?.textContent?.trim() ?? null,
			roleVisible: Boolean(
				role &&
					getComputedStyle(role).display !== "none" &&
					role.getBoundingClientRect().width > 0,
			),
			mobileMenuDisplay: menu ? getComputedStyle(menu).display : null,
			menuRoleVisible: Boolean(
				menuRole &&
					menuRole.getBoundingClientRect().width > 0 &&
					menuRole.getBoundingClientRect().height > 0,
			),
			siteNavDisplay: getComputedStyle(
				document.querySelector(".site-nav"),
			).display,
			headerActionsDisplay: getComputedStyle(
				document.querySelector(".header-actions"),
			).display,
			headerAskDisplay: getComputedStyle(
				document.querySelector(".header-ask"),
			).display,
			menuAskDisplay: getComputedStyle(
				document.querySelector(".menu-ask"),
			).display,
			visibleRoleCount: visibleRoles.length,
		};
	});
	check(
		"mobile menu · desktop conserva el rol",
		desktop.role === "Solutions Architect · Software Engineer" &&
			desktop.roleVisible &&
			desktop.visibleRoleCount === 1,
		JSON.stringify(desktop),
	);
	check(
		"mobile menu · desktop sin menú móvil duplicado",
		desktop.mobileMenuDisplay === "none" &&
			desktop.menuRoleVisible === false &&
			desktop.siteNavDisplay === "flex" &&
			desktop.headerActionsDisplay === "flex" &&
			desktop.headerAskDisplay === "block" &&
			desktop.menuAskDisplay === "none",
		JSON.stringify(desktop),
	);
	await desktopPage.screenshot({
		path: join(OUT, "desktop-header-menu-state.png"),
	});
	audit.push({ desktop });
	await desktopContext.close();
	await writeFile(
		join(OUT, "mobile-menu-audit.json"),
		`${JSON.stringify(audit, null, 2)}\n`,
	);
	console.log(`mobile menu → ${join(OUT, "mobile-menu-audit.json")}`);
}

async function checkLocaleTransition(browser, base) {
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		reducedMotion: "no-preference",
	});
	const page = await context.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});

	await page.goto(`${base}en/`, { waitUntil: "load" });
	await page.locator(".locale-trigger").click();
	await page.locator('.locale-menu a[hreflang="ca"]').click();
	await page.waitForSelector("[data-locale-transition].is-active", {
		timeout: 2000,
	});

	const cover = await page.evaluate(() => {
		const overlay = document.querySelector("[data-locale-transition]");
		const bar = document.querySelector(".locale-bar");
		return {
			bars: document.querySelectorAll(".locale-bar").length,
			expected:
				Math.ceil(
					window.innerWidth /
						(Number.parseFloat(
							getComputedStyle(document.documentElement).fontSize,
						) * 4),
				) + 1,
			active: overlay?.classList.contains("is-active") ?? false,
			htmlClass: document.documentElement.classList.contains("locale-transition"),
			barWidth: bar?.getBoundingClientRect().width ?? 0,
			barBackground: bar ? getComputedStyle(bar).backgroundColor : "transparent",
			barAnimation: bar ? getComputedStyle(bar).animationName : "",
			lang: document.documentElement.lang,
			headerViewTransition: getComputedStyle(
				document.querySelector(".site-header"),
			).viewTransitionName,
		};
	});
	check(
		"locale transition · capa activa sobre la página previa",
		cover.active && !cover.htmlClass && cover.lang === "en",
		JSON.stringify({ active: cover.active, htmlClass: cover.htmlClass, lang: cover.lang }),
	);
	check(
		"locale transition · barras cubren el viewport",
		cover.bars === cover.expected,
		`${cover.bars}/${cover.expected}`,
	);
	check(
		"locale transition · barras visibles",
		cover.barWidth >= 64 && cover.barBackground !== "rgba(0, 0, 0, 0)",
		`${cover.barWidth}px ${cover.barBackground}`,
	);
	check(
		"locale transition · barras caen desde arriba",
		cover.barAnimation === "locale-bar-drop",
		cover.barAnimation,
	);
	check(
		"locale transition · snapshot de cabecera activa durante la caída",
		cover.headerViewTransition === "site-header",
		cover.headerViewTransition,
	);

	await page.waitForURL("**/ca/", { timeout: 5000 });
	await page.waitForSelector("[data-locale-transition].is-revealing", {
		timeout: 2000,
	});
	const reveal = await page.evaluate(() => {
		const bar = document.querySelector(".locale-bar");
		return {
			animation: bar ? getComputedStyle(bar).animationName : "",
			htmlClass: document.documentElement.classList.contains("locale-transition"),
			headerViewTransition: getComputedStyle(
				document.querySelector(".site-header"),
			).viewTransitionName,
		};
	});
	check(
		"locale transition · rejas caen sin giro ni snapshot",
		reveal.animation === "locale-bar-exit" &&
			reveal.htmlClass &&
			reveal.headerViewTransition === "none",
		JSON.stringify(reveal),
	);
	await page.waitForFunction(
		() =>
			!document
				.querySelector("[data-locale-transition]")
				?.classList.contains("is-active"),
		{ timeout: 5000 },
	);
	const final = await page.evaluate(() => ({
		path: location.pathname,
		lang: document.documentElement.lang,
		active:
			document
				.querySelector("[data-locale-transition]")
				?.classList.contains("is-active") ?? false,
		htmlClass: document.documentElement.classList.contains("locale-transition"),
	}));
	check("locale transition · ruta traducida", final.path === "/ca/", final.path);
	check("locale transition · html lang", final.lang === "ca", final.lang);
	check(
		"locale transition · capa retirada",
		!final.active && !final.htmlClass,
	);
	check(
		"locale transition · sin errores de consola",
		errors.length === 0,
		errors.join(" | "),
	);
	await context.close();

	const reduced = await browser.newContext({
		viewport: { width: 390, height: 844 },
		reducedMotion: "reduce",
	});
	const reducedPage = await reduced.newPage();
	const reducedErrors = [];
	reducedPage.on("pageerror", (error) => reducedErrors.push(error.message));
	reducedPage.on("console", (message) => {
		if (message.type() === "error") reducedErrors.push(message.text());
	});
	await reducedPage.goto(`${base}`, { waitUntil: "load" });
	const reducedSteps = [
		{ lang: "en", path: "/en/" },
		{ lang: "ca", path: "/ca/" },
		{ lang: "es", path: "/" },
	];
	for (const step of reducedSteps) {
		await reducedPage.locator(".locale-trigger").click();
		await reducedPage.locator(`.locale-menu a[hreflang="${step.lang}"]`).click();
		await reducedPage.waitForURL(
			(url) => new URL(url).pathname === step.path,
			{ timeout: 5000 },
		);
		await reducedPage.waitForFunction(
			() =>
				!document
					.querySelector("[data-locale-transition]")
					?.classList.contains("is-active"),
			{ timeout: 5000 },
		);
		const reducedState = await reducedPage.evaluate(() => ({
			path: location.pathname,
			active:
				document
					.querySelector("[data-locale-transition]")
					?.classList.contains("is-active") ?? false,
			htmlClass: document.documentElement.classList.contains("locale-transition"),
			bars: document.querySelectorAll(".locale-bar").length,
			lang: document.documentElement.lang,
		}));
		check(
			`locale transition · reduced motion ${step.lang} · sin overlay atascado`,
			reducedState.path === step.path &&
				reducedState.lang === step.lang &&
				!reducedState.active &&
				!reducedState.htmlClass &&
				reducedState.bars === 0,
			JSON.stringify(reducedState),
		);
	}
	check(
		"locale transition · reduced motion cadena ES→EN→CA→ES",
		await reducedPage.evaluate(
			() => location.pathname === "/" && document.documentElement.lang === "es",
		),
	);
	check(
		"locale transition · reduced motion sin errores",
		reducedErrors.length === 0,
		reducedErrors.join(" | "),
	);
	await reduced.close();
}

async function checkLocaleFrames(browser, base) {
	const modes = [
		{ theme: "light", suffix: "", colorScheme: "light" },
		{ theme: "dark", suffix: "-dark", colorScheme: "dark" },
	];

	for (const viewport of VIEWPORTS) {
		for (const mode of modes) {
			const context = await browser.newContext({
				viewport: { width: viewport.width, height: viewport.height },
				reducedMotion: "no-preference",
				colorScheme: mode.colorScheme,
			});
			await context.addInitScript((theme) => {
				try {
					localStorage.setItem("theme", theme);
				} catch {
					// Ignore non-web origins while the init script is evaluated.
				}
			}, mode.theme);
			const page = await context.newPage();
			const label = `locale transition · ${viewport.name} · ${mode.theme}`;

			await page.goto(`${base}en/`, { waitUntil: "load" });
			await page.locator(".locale-trigger").click();
			await page.locator('.locale-menu a[hreflang="ca"]').click();
			await page.waitForSelector("[data-locale-transition].is-active", {
				timeout: 2000,
			});

			const dropAnimations = await holdBars(page, 150);
			const drop = await page.evaluate(() => {
				const bars = [...document.querySelectorAll(".locale-bar")];
				const bar = bars[0];
				return {
					firstTop: bar?.getBoundingClientRect().top ?? 0,
					lastTop: bars.at(-1)?.getBoundingClientRect().top ?? 0,
					height: window.innerHeight,
					lang: document.documentElement.lang,
					theme: document.documentElement.dataset.theme,
					barBackground: bar ? getComputedStyle(bar).backgroundColor : "transparent",
					htmlClass: document.documentElement.classList.contains("locale-transition"),
				};
			});
			check(
				`${label} · fotograma de caída`,
				dropAnimations > 0 &&
					drop.firstTop > -drop.height &&
					drop.firstTop < 0 &&
					drop.lastTop < drop.firstTop &&
					!drop.htmlClass &&
					drop.lang === "en" &&
					drop.theme === mode.theme &&
					drop.barBackground !== "rgba(0, 0, 0, 0)",
				JSON.stringify(drop),
			);
			await saveFrame(page, `locale-${viewport.name}${mode.suffix}-drop`);
			await releaseBars(page);

			await page.waitForURL("**/ca/", { timeout: 5000 });
			const swapped = await page.evaluate(() => {
				const root = document.querySelector("[data-locale-transition]");
				const bar = document.querySelector(".locale-bar");
				return {
					active: root?.classList.contains("is-active") ?? false,
					covering: root?.classList.contains("is-covering") ?? false,
					top: bar?.getBoundingClientRect().top ?? null,
					htmlClass: document.documentElement.classList.contains(
						"locale-transition",
					),
				};
			});
			check(
				`${label} · capa no se reinicia tras navegar`,
				swapped.active &&
					!swapped.covering &&
					swapped.top !== null &&
					swapped.top >= -0.5 &&
					swapped.htmlClass,
				JSON.stringify(swapped),
			);
			await page.waitForSelector("[data-locale-transition].is-revealing", {
				timeout: 2000,
			});

			const revealAnimations = await holdBars(page, 120);
			const revealFrame = await page.evaluate(() => {
				const bars = [...document.querySelectorAll(".locale-bar")];
				const bar = bars[0];
				return {
					firstTop: bar?.getBoundingClientRect().top ?? 0,
					lastTop: bars.at(-1)?.getBoundingClientRect().top ?? 0,
					firstLeft: bar?.getBoundingClientRect().left ?? 0,
					height: window.innerHeight,
					theme: document.documentElement.dataset.theme,
					barBackground: bar ? getComputedStyle(bar).backgroundColor : "transparent",
					htmlClass: document.documentElement.classList.contains("locale-transition"),
				};
			});
			check(
				`${label} · fotograma de revelado`,
				revealAnimations > 0 &&
					revealFrame.firstTop > 0 &&
					revealFrame.firstTop < revealFrame.height &&
					revealFrame.lastTop < revealFrame.firstTop &&
					Math.abs(revealFrame.firstLeft) < 0.5 &&
					revealFrame.theme === mode.theme &&
					revealFrame.barBackground !== "rgba(0, 0, 0, 0)" &&
					revealFrame.htmlClass,
				JSON.stringify(revealFrame),
			);
			await saveFrame(page, `locale-${viewport.name}${mode.suffix}-reveal`);
			await releaseBars(page);

			await page.waitForFunction(
				() =>
					!document
						.querySelector("[data-locale-transition]")
						?.classList.contains("is-active"),
				{ timeout: 5000 },
			);
			await context.close();
		}
	}
}

async function checkLocaleContinuity(browser, base) {
	const modes = [
		{ theme: "light", suffix: "", colorScheme: "light" },
		{ theme: "dark", suffix: "-dark", colorScheme: "dark" },
	];
	const sequence = [
		{ target: "en", expectedPath: "/en/", name: "ES→EN" },
		{ target: "ca", expectedPath: "/ca/", name: "EN→CA" },
		{ target: "es", expectedPath: "/", name: "CA→ES" },
	];
	const evidence = [];

	for (const viewport of VIEWPORTS) {
		for (const mode of modes) {
			const context = await browser.newContext({
				viewport: { width: viewport.width, height: viewport.height },
				reducedMotion: "no-preference",
				colorScheme: mode.colorScheme,
			});
			await context.addInitScript((theme) => {
				try {
					localStorage.setItem("theme", theme);
				} catch {
					// Ignore non-web origins while the init script is evaluated.
				}
			}, mode.theme);
			const page = await context.newPage();
			const errors = [];
			page.on("pageerror", (error) => errors.push(error.message));
			page.on("console", (message) => {
				if (message.type() === "error") errors.push(message.text());
			});

			await page.goto(base, { waitUntil: "load" });

			for (const [index, step] of sequence.entries()) {
				const label = `locale continuity · ${viewport.name} · ${mode.theme} · ${step.name}`;
				const timeline = await runLocaleTimeline(
					page,
					step.target,
					step.expectedPath,
					`locale-${viewport.name}${mode.suffix}`,
					index === 0,
				);
				const stats = timelineStats(timeline, step.expectedPath);
				const firstReveal = timeline.samples.find(
					(sample) => sample.revealing,
				);
				const revealTop = firstReveal?.tops[0] ?? null;

				check(
					`${label} · barras solo hacia abajo`,
					stats.backwards.length === 0,
					JSON.stringify(stats.backwards.slice(0, 3)),
				);
				check(
					`${label} · revelado desde estado congelado`,
					revealTop !== null && Math.abs(revealTop) < 1,
					String(revealTop),
				);
				check(
					`${label} · sin pausa perceptible`,
					stats.pauseFrames !== null && stats.pauseFrames <= 2,
					JSON.stringify({
						pauseMs: stats.pauseMs,
						pauseFrames: stats.pauseFrames,
						lastCovered: stats.lastCovered,
						lastSealed: stats.lastSealed,
						firstReveal: stats.firstReveal,
					}),
				);
				check(
					`${label} · sin reinicio de cobertura`,
					stats.reanimations === 0,
					String(stats.reanimations),
				);
				check(
					`${label} · documento nuevo antes del revelado`,
					stats.firstIncoming !== null &&
						stats.firstReveal !== null &&
						stats.firstIncoming <= stats.firstReveal + stats.maxGap,
					JSON.stringify({
						firstIncoming: stats.firstIncoming,
						firstReveal: stats.firstReveal,
					}),
				);
				check(
					`${label} · sin reset de scroll`,
					stats.scrollValues.every((scrollY) => scrollY === 0),
					JSON.stringify(stats.scrollValues),
				);

				evidence.push({
					viewport: viewport.name,
					theme: mode.theme,
					from: timeline.fromPath,
					to: step.expectedPath,
					barCount: firstReveal?.tops.length ?? 0,
					...stats,
					samples: timeline.samples.map((sample) => ({
						t: +sample.t.toFixed(1),
						path: sample.path,
						tops: sample.tops.map((top) => +top.toFixed(1)),
						active: sample.active,
						covering: sample.covering,
						covered: sample.covered,
						revealing: sample.revealing,
						htmlClass: sample.htmlClass,
						scrollY: sample.scrollY,
					})),
				});
			}

			const final = await page.evaluate(() => ({
				path: location.pathname,
				lang: document.documentElement.lang,
				theme: document.documentElement.dataset.theme,
				active:
					document
						.querySelector("[data-locale-transition]")
						?.classList.contains("is-active") ?? false,
				htmlClass: document.documentElement.classList.contains(
					"locale-transition",
				),
			}));
			check(
				`locale continuity · ${viewport.name} · ${mode.theme} · ciclo final`,
				final.path === "/" &&
					final.lang === "es" &&
					final.theme === mode.theme &&
					!final.active &&
					!final.htmlClass,
				JSON.stringify(final),
			);
			check(
				`locale continuity · ${viewport.name} · ${mode.theme} · sin errores`,
				errors.length === 0,
				errors.join(" | "),
			);
			await context.close();
		}
	}

	await writeFile(
		join(OUT, "locale-continuity.json"),
		`${JSON.stringify(evidence, null, 2)}\n`,
	);
	console.log(`locale transition → ${join(OUT, "locale-continuity.json")}`);
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

await checkLocaleTransition(browser, base);
await checkLocaleFrames(browser, base);
await checkLocaleContinuity(browser, base);
await checkMobileMenu(browser, base);

await browser.close();
server.close();

console.log(`\n${results.join("\n")}`);
const failed = results.filter((line) => line.startsWith("FAIL"));
console.log(`\n${results.length - failed.length}/${results.length} comprobaciones correctas`);
process.exit(failed.length > 0 ? 1 : 0);
