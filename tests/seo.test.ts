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
const { indexableRoutes } = await load("src/lib/routes.ts");
const { SITE } = await load("src/data/site.ts");
const {
	ACTIVE_CATEGORIES,
	POSTS,
	categoryHref,
	postHref,
} = await load("src/data/blog.ts");
const { PROJECT_CASES } = await load("src/data/projects.ts");
const { GET: getLlmsTxt } = await load("src/pages/llms.txt.ts");

/**
 * Every page the last build emitted, captured before the translated pages
 * became dynamic routes. It is the outside evidence the route table is checked
 * against: a page that disappears from the table still appears here.
 */
const baseline: {
	path: string;
	canonical: string | null;
	alternates?: Record<string, string>;
	noindex?: boolean;
}[] = JSON.parse(
	fs.readFileSync(
		path.join(ROOT, "tests", "fixtures", "url-baseline.json"),
		"utf8",
	),
);

const builtRoutes = baseline
	.filter((page) => !page.noindex)
	.map((page) => page.path)
	.sort();

const tableRoutes = indexableRoutes()
	.map((route: { path: string }) => route.path)
	.sort();

const sitemapPaths: string[] = sitemapEntries().map(
	(entry: { path: string }) => entry.path,
);

describe("sitemap", () => {
	it("matches every route the build emitted", () => {
		assert.deepEqual(tableRoutes, builtRoutes);
	});

	it("gives every emitted page a canonical URL", () => {
		const missing = baseline
			.filter((page) => !page.canonical)
			.map((page) => page.path);

		assert.deepEqual(missing, []);
	});

	it("lists every route of the table", () => {
		const missing = tableRoutes.filter(
			(route) => !sitemapPaths.includes(route),
		);

		assert.deepEqual(missing, []);
	});

	it("advertises no URL that no route actually renders", () => {
		const invented = sitemapPaths.filter(
			(path) => !tableRoutes.includes(path),
		);

		assert.deepEqual(invented, []);
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

	it("lists every post", () => {
		for (const post of POSTS) {
			assert.ok(sitemapPaths.includes(postHref(post.slug)));
		}
	});

	it("lists every active category", () => {
		for (const category of ACTIVE_CATEGORIES) {
			assert.ok(sitemapPaths.includes(categoryHref(category.slug)));
		}
	});

	it("does not repeat a URL", () => {
		assert.equal(new Set(sitemapPaths).size, sitemapPaths.length);
	});

	it("keeps the error page out", () => {
		assert.ok(!sitemapPaths.includes("/404/"));
		assert.ok(!sitemapPaths.includes("/404.html"));
	});

	it("keeps the static page list in sync with the route table", () => {
		for (const page of STATIC_PAGES) {
			assert.ok(
				tableRoutes.includes(page.path),
				`${page.path} is listed but no route renders it`,
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
