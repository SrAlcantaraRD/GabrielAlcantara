import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

const load = (relative: string) =>
	import(pathToFileURL(path.join(ROOT, relative)).href);

const { sitemapEntries, STATIC_PAGES } = await load("src/lib/seo.ts");
const { SITE } = await load("src/data/site.ts");
const {
	ACTIVE_CATEGORIES,
	POSTS,
	categoryHref,
	postHref,
} = await load("src/data/blog.ts");
const { PROJECT_CASES } = await load("src/data/projects.ts");
const { GET: getLlmsTxt } = await load("src/pages/llms.txt.ts");

const sitemapPaths: string[] = sitemapEntries().map(
	(entry: { path: string }) => entry.path,
);

/** Static `.astro` pages, without the error page and the dynamic templates. */
function pageRoutes(): string[] {
	const dir = path.join(ROOT, "src", "pages");

	return (fs.readdirSync(dir, { recursive: true }) as string[])
		.map((file) => file.split(path.sep).join("/"))
		.filter((file) => file.endsWith(".astro"))
		.filter((file) => !file.includes("["))
		.filter((file) => !file.startsWith("404."))
		.map((file) => {
			const route = file
				.replace(/\.astro$/, "")
				.replace(/(^|\/)index$/, "");
			return route ? `/${route}/` : "/";
		});
}

describe("sitemap", () => {
	it("lists every static page under src/pages", () => {
		const missing = pageRoutes().filter(
			(route) => !sitemapPaths.includes(route),
		);
		assert.deepEqual(missing, []);
	});

	it("lists every case study that has its own page", () => {
		const withPage = PROJECT_CASES.filter((item) => item.caseStudyHref);

		assert.ok(withPage.length > 0);

		for (const item of withPage) {
			assert.ok(
				sitemapPaths.includes(item.caseStudyHref as string),
				`case study "${item.name}" is not in the sitemap (${item.caseStudyHref})`,
			);
		}
	});

	it("advertises no URL that no route actually renders", () => {
		const real = new Set<string>([
			...pageRoutes(),
			...POSTS.map((post: { slug: string }) => postHref(post.slug)),
			...ACTIVE_CATEGORIES.map((category: { slug: string }) =>
				categoryHref(category.slug),
			),
		]);

		const invented = sitemapPaths.filter((path) => !real.has(path));

		assert.deepEqual(invented, []);
	});

	it("lists every post", () => {
		for (const post of POSTS) {
			assert.ok(sitemapPaths.includes(postHref(post.slug)));
		}
	});

	it("does not repeat a URL", () => {
		assert.equal(new Set(sitemapPaths).size, sitemapPaths.length);
	});

	it("keeps the error page out", () => {
		assert.ok(!sitemapPaths.includes("/404/"));
	});

	it("keeps the static page list in sync with the pages it claims", () => {
		const routes = new Set(pageRoutes());
		for (const page of STATIC_PAGES) {
			assert.ok(
				routes.has(page.path),
				`${page.path} is listed but no page renders it`,
			);
		}
	});
});

describe("llms.txt", () => {
	const parse = async () => {
		const response = await getLlmsTxt({} as never);
		return response.text();
	};

	it("links only to routes the sitemap knows about", async () => {
		const text = await parse();
		const origin = SITE.url.replace(/\/$/, "");
		const links = [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(
			(match) => match[1] as string,
		);

		assert.ok(links.length > 0);

		const dead = links.filter((href) => {
			assert.ok(
				href.startsWith(origin),
				`llms.txt links outside the site: ${href}`,
			);
			return !sitemapPaths.includes(href.slice(origin.length));
		});

		assert.deepEqual(dead, []);
	});

	it("mentions every post and every case study", async () => {
		const text = await parse();

		for (const post of POSTS) {
			assert.ok(
				text.includes(postHref(post.slug)),
				`llms.txt is missing the post "${post.slug}"`,
			);
		}

		for (const item of PROJECT_CASES) {
			assert.ok(
				text.includes(item.caseStudyHref ?? "/projects/"),
				`llms.txt is missing the case study "${item.name}"`,
			);
		}
	});
});
