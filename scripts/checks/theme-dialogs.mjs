/**
 * The theme model and the two dialogs' closing paths, driven over the built site.
 *
 * Both live here because they are the same kind of assertion: state that has to
 * hold across the whole site (any page, any viewport) rather than inside one
 * component's geometry. `ui-check.mjs` serves dist/ and passes its collector, so
 * every result lands in the same report and the same exit code.
 *
 *   pnpm build && pnpm ui:check
 */

import { PAPER_DARK, PAPER_LIGHT } from "../../src/lib/theme-colors.ts";

const PAPER = { light: PAPER_LIGHT, dark: PAPER_DARK };

/** The colour the browser paints, resolved from the token, not the hex list. */
const rgb = (hex) => {
	const value = Number.parseInt(hex.slice(1), 16);
	return `rgb(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255})`;
};

/** The palette swaps behind a 1e-05s transition, so the colour computed on the
    body lands a frame after the <meta>: wait for the paint, not for the state. */
const waitPaper = (page, scheme) =>
	page.waitForFunction(
		(color) => getComputedStyle(document.body).backgroundColor === color,
		rgb(PAPER[scheme]),
		{ timeout: 3000 },
	);

const readTheme = (page) =>
	page.evaluate(() => {
		const meta = document.querySelector('meta[name="color-scheme"]');
		const override = document.querySelector(
			'meta[name="theme-color"][data-theme-override]',
		);
		const first = document.querySelector('meta[name="theme-color"]');
		const toggle = document.querySelector("[data-theme-toggle]");
		return {
			meta: meta?.content ?? null,
			override: override?.content ?? null,
			overrideFirst: Boolean(override && override === first),
			pair: [
				...document.querySelectorAll(
					'meta[name="theme-color"][data-theme-scheme]',
				),
			].map((tag) => `${tag.dataset.themeScheme}:${tag.content}`),
			bg: getComputedStyle(document.body).backgroundColor,
			colorScheme: getComputedStyle(document.documentElement).colorScheme,
			stored: localStorage.getItem("theme"),
			pressed: toggle?.getAttribute("aria-pressed") ?? null,
			state: toggle?.dataset.themeState ?? null,
		};
	});

async function openPage(browser, base, options) {
	const context = await browser.newContext(options);
	const page = await context.newPage();
	return { context, page };
}

/**
 * The model: the OS paints the first frame, a click pins the opposite scheme,
 * a second click drops the pin back onto the system, and prepaint does all of
 * that from the head alone (no hydration).
 */
export async function checkThemeModel(browser, base, check) {
	/* No JS at all: the palette is pure CSS, so the OS decides. */
	for (const scheme of ["light", "dark"]) {
		const { context, page } = await openPage(browser, base, {
			viewport: { width: 1280, height: 900 },
			colorScheme: scheme,
			javaScriptEnabled: false,
		});
		await page.goto(base, { waitUntil: "load" });
		const read = await readTheme(page);
		const label = `tema · sin JS · sistema ${scheme}`;
		check(`${label} · papel del sistema`, read.bg === rgb(PAPER[scheme]), read.bg);
		check(
			`${label} · meta sigue al sistema`,
			read.meta === "light dark" && read.override === null,
			`${read.meta} / ${read.override ?? "sin override"}`,
		);
		check(
			`${label} · par theme-color del head`,
			JSON.stringify(read.pair) ===
				JSON.stringify([`light:${PAPER_LIGHT}`, `dark:${PAPER_DARK}`]),
			JSON.stringify(read.pair),
		);
		await context.close();
	}

	/* With JS: a click pins, the next one returns to the system. */
	for (const scheme of ["light", "dark"]) {
		const { context, page } = await openPage(browser, base, {
			viewport: { width: 1280, height: 900 },
			colorScheme: scheme,
			reducedMotion: "reduce",
		});
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(base, { waitUntil: "networkidle" });
		const toggle = page.locator("[data-theme-toggle]").first();
		const label = `tema · sistema ${scheme}`;

		const follow = await readTheme(page);
		check(
			`${label} · sigue al sistema sin pin`,
			follow.stored === null &&
				follow.meta === "light dark" &&
				follow.override === null &&
				follow.bg === rgb(PAPER[scheme]) &&
				follow.state === scheme &&
				follow.pressed === String(scheme === "dark"),
			JSON.stringify(follow),
		);

		const pinned = scheme === "light" ? "dark" : "light";
		await toggle.click();
		await waitPaper(page, pinned);
		const pin = await readTheme(page);
		check(
			`${label} · el clic fija ${pinned}`,
			pin.stored === pinned &&
				pin.meta === pinned &&
				pin.override === PAPER[pinned] &&
				pin.overrideFirst &&
				pin.bg === rgb(PAPER[pinned]) &&
				pin.state === pinned,
			JSON.stringify(pin),
		);

		await toggle.click();
		await waitPaper(page, scheme);
		const back = await readTheme(page);
		check(
			`${label} · el segundo clic vuelve al sistema`,
			back.stored === null &&
				back.meta === "light dark" &&
				back.override === null &&
				back.bg === rgb(PAPER[scheme]),
			JSON.stringify(back),
		);
		check(`${label} · sin errores de consola`, errors.length === 0, errors.join(" | "));
		await context.close();
	}

	/* Prepaint: a stored pin and the opposite OS, with hydration blocked. The
	   first frame can only be right if the inline head script did it. */
	{
		const { context, page } = await openPage(browser, base, {
			viewport: { width: 1280, height: 900 },
			colorScheme: "light",
		});
		await context.addInitScript(() => {
			try {
				localStorage.setItem("theme", "dark");
			} catch {
				// The init script also runs on about:blank.
			}
		});
		await page.route(/\/_astro\/.*\.js$/, (route) => route.abort());
		await page.goto(base, { waitUntil: "domcontentloaded" });
		const prepaint = await readTheme(page);
		check(
			"tema · prepaint con pin oscuro y sistema claro",
			prepaint.bg === rgb(PAPER.dark) &&
				prepaint.meta === "dark" &&
				prepaint.override === PAPER_DARK &&
				prepaint.overrideFirst &&
				prepaint.colorScheme === "dark",
			JSON.stringify(prepaint),
		);
		await context.close();
	}

	/* Print: the paper is white and the tokens resolve light, pin or not. */
	{
		const { context, page } = await openPage(browser, base, {
			viewport: { width: 1280, height: 900 },
			colorScheme: "dark",
		});
		await context.addInitScript(() => {
			try {
				localStorage.setItem("theme", "dark");
			} catch {
				// The init script also runs on about:blank.
			}
		});
		await page.goto(base, { waitUntil: "networkidle" });
		await page.emulateMedia({ media: "print" });
		await page.waitForFunction(
			() => getComputedStyle(document.body).backgroundColor === "rgb(255, 255, 255)",
			undefined,
			{ timeout: 3000 },
		);
		const print = await readTheme(page);
		check(
			"tema · impresión en blanco desde oscuro",
			print.bg === "rgb(255, 255, 255)" && print.colorScheme === "light",
			`${print.bg} / ${print.colorScheme}`,
		);
		await context.close();
	}
}

const CLOSE_VIEWPORTS = [
	{ name: "320x568", width: 320, height: 568 },
	{ name: "390x844", width: 390, height: 844 },
	{ name: "844x390", width: 844, height: 390 },
	{ name: "1280x900", width: 1280, height: 900 },
];

const drawerOpen = (page) =>
	page.evaluate(() => Boolean(document.querySelector("#project-drawer")?.open));
const drawerClosing = (page) =>
	page.evaluate(
		() =>
			document.querySelector("#project-drawer")?.dataset.closing === "true",
	);
const projectInUrl = (page) =>
	page.evaluate(() => new URL(location.href).searchParams.get("project"));
const focused = (page) =>
	page.evaluate(() => document.activeElement?.className ?? "");

/**
 * Both dialogs, every closing path, at the widths the layout has to hold: Esc,
 * the backdrop and their buttons. The drawer has to animate out and drop its URL
 * and hand focus back to the chip; the egg simply closes.
 */
export async function checkDialogs(browser, base, check) {
	for (const viewport of CLOSE_VIEWPORTS) {
		const { context, page } = await openPage(browser, base, {
			viewport: { width: viewport.width, height: viewport.height },
		});
		const errors = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("console", (message) => {
			if (message.type() === "error") errors.push(message.text());
		});
		await page.goto(`${base}experience/`, { waitUntil: "networkidle" });

		const openDrawer = async () => {
			const chip = page.locator(".chip-project").first();
			if ((await chip.count()) === 0) {
				await page.locator(".bar[data-project]").first().click();
			} else {
				await chip.click();
			}
			await page.waitForSelector("#project-drawer[open]", {
				state: "attached",
			});
			await page.waitForTimeout(750);
		};

		const waitClosed = () =>
			page.waitForFunction(
				() => !document.querySelector("#project-drawer")?.open,
				undefined,
				{ timeout: 4000 },
			);

		await openDrawer();
		const box = await page.evaluate(() => {
			const surface = document.querySelector(".drawer-surface");
			const prev = document.querySelector("#drawer-prev");
			const next = document.querySelector("#drawer-next");
			const card = surface?.getBoundingClientRect();
			const a = prev?.getBoundingClientRect();
			const b = next?.getBoundingClientRect();
			return {
				viewport: { width: innerWidth, height: innerHeight },
				card: card && {
					top: +card.top.toFixed(1),
					right: +card.right.toFixed(1),
					bottom: +card.bottom.toFixed(1),
					left: +card.left.toFixed(1),
				},
				prev: a && {
					left: +a.left.toFixed(1),
					right: +a.right.toFixed(1),
					bottom: +a.bottom.toFixed(1),
				},
				next: b && {
					left: +b.left.toFixed(1),
					right: +b.right.toFixed(1),
					bottom: +b.bottom.toFixed(1),
				},
			};
		});
		check(
			`diálogos · ${viewport.name} · la ficha cabe en el viewport`,
			box.card !== null &&
				box.card.left >= -0.5 &&
				box.card.top >= -0.5 &&
				box.card.right <= box.viewport.width + 0.5 &&
				box.card.bottom <= box.viewport.height + 0.5,
			JSON.stringify(box.card),
		);
		check(
			`diálogos · ${viewport.name} · el pie no se solapa`,
			box.prev !== null &&
				box.next !== null &&
				box.prev.right <= box.next.left &&
				box.prev.left >= (box.card?.left ?? 0) &&
				box.next.right <= (box.card?.right ?? 0),
			JSON.stringify({ prev: box.prev, next: box.next }),
		);

		/* Esc: the native cancel goes through the animated exit. */
		await page.keyboard.press("Escape");
		await page.waitForTimeout(80);
		check(
			`diálogos · ${viewport.name} · Esc anima la salida`,
			await drawerClosing(page),
		);
		await waitClosed();
		check(
			`diálogos · ${viewport.name} · Esc cierra`,
			!(await drawerOpen(page)) && (await projectInUrl(page)) === null,
		);
		check(
			`diálogos · ${viewport.name} · Esc devuelve el foco al chip`,
			(await focused(page)).includes("chip-project"),
			await focused(page),
		);

		/* Backdrop: the corner is outside the card at every width. */
		await openDrawer();
		await page.mouse.click(2, 2);
		await page.waitForTimeout(80);
		check(
			`diálogos · ${viewport.name} · el backdrop anima la salida`,
			await drawerClosing(page),
		);
		await waitClosed();
		check(
			`diálogos · ${viewport.name} · el backdrop cierra`,
			!(await drawerOpen(page)) && (await projectInUrl(page)) === null,
		);

		/* The X button in the footer. */
		await openDrawer();
		await page.locator("#drawer-close").click();
		await page.waitForTimeout(80);
		check(
			`diálogos · ${viewport.name} · el botón anima la salida`,
			await drawerClosing(page),
		);
		await waitClosed();
		check(
			`diálogos · ${viewport.name} · el botón cierra`,
			!(await drawerOpen(page)) && (await projectInUrl(page)) === null,
		);

		/* The egg: opened by typing its word, closed three ways. */
		await page.goto(base, { waitUntil: "networkidle" });
		const openEgg = async () => {
			await page.locator("body").click({ position: { x: 4, y: 4 } });
			await page.keyboard.type("gabriel");
			await page.waitForSelector("#gabriel-egg[open]", {
				state: "attached",
			});
			await page.waitForTimeout(250);
		};
		const eggOpen = () =>
			page.evaluate(() =>
				Boolean(document.querySelector("#gabriel-egg")?.open),
			);
		const waitEggClosed = () =>
			page.waitForFunction(
				() => !document.querySelector("#gabriel-egg")?.open,
				undefined,
				{ timeout: 3000 },
			);

		for (const path of [
			{ name: "Esc", run: () => page.keyboard.press("Escape") },
			{
				name: "la X",
				run: () => page.locator("#easter-egg-head-close").click(),
			},
			{
				name: "volver",
				run: () => page.locator("#easter-egg-foot-ok").click(),
			},
		]) {
			await openEgg();
			await path.run();
			await waitEggClosed();
			check(
				`diálogos · ${viewport.name} · el huevo cierra con ${path.name}`,
				!(await eggOpen()),
			);
		}

		check(
			`diálogos · ${viewport.name} · sin errores de consola`,
			errors.length === 0,
			errors.join(" | "),
		);
		await context.close();
	}
}
