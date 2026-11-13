#!/usr/bin/env node
/**
 * Home critique evidence: screenshots + rendered measurements.
 *
 *   node scripts/home-critique-shots.mjs [base-url] [subdir]
 *
 * Writes to ui-artifacts/critique-home/<subdir>/ and prints one JSON blob of
 * metrics.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = process.argv[2] ?? "http://localhost:4321/";
const SUBDIR = process.argv[3] ?? "";
const OUT = new URL(
	`../ui-artifacts/critique-home/${SUBDIR ? `${SUBDIR}/` : ""}`,
	import.meta.url,
).pathname;
const CHROME =
	process.env.PW_CHROME ??
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

await mkdir(OUT, { recursive: true });

const CASES = [
	{ name: "desktop-light", width: 1440, height: 900, theme: "light" },
	{ name: "desktop-dark", width: 1440, height: 900, theme: "dark" },
	{ name: "laptop-light", width: 1280, height: 800, theme: "light" },
	{ name: "small-laptop-light", width: 1024, height: 768, theme: "light" },
	{ name: "tablet-light", width: 768, height: 1024, theme: "light" },
	{ name: "mobile-light", width: 390, height: 844, theme: "light", touch: true },
	{ name: "mobile-dark", width: 390, height: 844, theme: "dark", touch: true },
	{ name: "mobile-320", width: 320, height: 568, theme: "light", touch: true },
];

const metrics = {};

for (const testCase of CASES) {
	const context = await chromium.launchPersistentContext("", {
		executablePath: CHROME,
		viewport: { width: testCase.width, height: testCase.height },
		deviceScaleFactor: 2,
		colorScheme: testCase.theme,
		isMobile: Boolean(testCase.touch),
		hasTouch: Boolean(testCase.touch),
		reducedMotion: "no-preference",
	});
	await context.addInitScript((theme) => {
		try {
			localStorage.setItem("theme", theme);
		} catch {
			// Non-web origin during init.
		}
	}, testCase.theme);

	const page = context.pages()[0] ?? (await context.newPage());
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	page.on("console", (message) => {
		if (message.type() === "error") errors.push(message.text());
	});

	await page.goto(BASE, { waitUntil: "networkidle" });
	await page.waitForTimeout(900);
	// The Astro dev toolbar is a local-only overlay; production has nothing there.
	await page.addStyleTag({
		content: "astro-dev-toolbar { display: none !important; }",
	});

	await page.screenshot({ path: `${OUT}${testCase.name}-fold.png` });
	await page.screenshot({
		path: `${OUT}${testCase.name}-full.png`,
		fullPage: true,
	});

	metrics[testCase.name] = await page.evaluate(() => {
		const px = (value) => Math.round(Number.parseFloat(value) * 10) / 10;
		const box = (element) => {
			const rect = element.getBoundingClientRect();
			return {
				top: px(rect.top + scrollY),
				height: px(rect.height),
				width: px(rect.width),
			};
		};
		const smallText = [];
		for (const element of document.querySelectorAll(
			"main p, main span, main a, main dt, main dd, main h1, main h2, main h3, main li",
		)) {
			const text = element.textContent?.trim() ?? "";
			if (!text || element.children.length > 0) continue;
			const style = getComputedStyle(element);
			const size = px(style.fontSize);
			if (size < 12) {
				smallText.push({
					size,
					text: text.slice(0, 42),
					className: element.className || element.tagName.toLowerCase(),
				});
			}
		}
		// A stretched link (title cover over a card) hits the card, not the text.
		const smallTargets = [...document.querySelectorAll("main a, main button, main summary")]
			.map((element) => {
				const rect = element.getBoundingClientRect();
				const after = getComputedStyle(element, "::after");
				const stretched =
					after.position === "absolute" &&
					after.inset === "0px" &&
					after.content !== "none";
				const card = element.closest(".project-card, .post-card");
				const hit = stretched && card ? card.getBoundingClientRect() : rect;
				return {
					label: (element.textContent ?? "").trim().slice(0, 34),
					width: px(rect.width),
					height: px(rect.height),
					hitHeight: px(hit.height),
					stretched,
				};
			})
			.filter(
				(target) =>
					target.hitHeight > 0 &&
					(target.hitHeight < 40 || target.width < 40),
			);

		const sections = [...document.querySelectorAll("main > section")].map((section) => ({
			id: section.id || "(sin id)",
			label: section.getAttribute("aria-labelledby") ?? "",
			...box(section),
		}));

		const hero = document.querySelector(".hero");
		const heroActions = hero?.querySelectorAll(".actions > *").length ?? 0;
		const heroText = hero?.innerText.replace(/\s+/g, " ").trim() ?? "";

		return {
			viewport: { width: innerWidth, height: innerHeight },
			pageHeight: px(document.documentElement.scrollHeight),
			viewportCount:
				Math.round((document.documentElement.scrollHeight / innerHeight) * 10) / 10,
			theme: document.documentElement.dataset.theme,
			lang: document.documentElement.lang,
			fontSizeRoot: getComputedStyle(document.documentElement).fontSize,
			hasHorizontalOverflow:
				document.documentElement.scrollWidth > innerWidth + 1,
			scrollWidth: document.documentElement.scrollWidth,
			h1: {
				text: document.querySelector("h1")?.innerText.replace(/\s+/g, " ").trim(),
				size: px(getComputedStyle(document.querySelector("h1")).fontSize),
			},
			h2Sizes: [...new Set(
				[...document.querySelectorAll("main h2")].map((h2) =>
					px(getComputedStyle(h2).fontSize),
				),
			)],
			h3Sizes: [...new Set(
				[...document.querySelectorAll("main h3")].map((h3) =>
					px(getComputedStyle(h3).fontSize),
				),
			)],
			heroActions,
			heroWords: heroText.split(" ").length,
			sections,
			smallTextCount: smallText.length,
			smallText: smallText.slice(0, 14),
			smallTargets,
			linkCount: document.querySelectorAll("main a").length,
			heroFoldRatio:
				Math.round(((hero?.getBoundingClientRect().bottom ?? 0) / innerHeight) * 100) / 100,
		};
	});
	metrics[testCase.name].errors = errors;

	await context.close();
}

await writeFile(`${OUT}metrics.json`, `${JSON.stringify(metrics, null, 2)}\n`);
console.log(JSON.stringify(metrics, null, 2));
