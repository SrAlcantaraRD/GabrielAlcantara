import type { APIRoute } from "astro";

import { ACTIVE_CATEGORIES, POSTS } from "../data/blog";
import { SITE } from "../data/site";

/**
 * Static sitemap: every indexable route of the site.
 *
 * The list is derived from the same data that renders the pages, so a new post
 * or category appears here without a second edit.
 */
const STATIC_ROUTES = [
	"/",
	"/about/",
	"/experience/",
	"/cv/",
	"/projects/",
	"/projects/bodega-digital/",
	"/blog/",
	"/services/",
	"/contact/",
];

export const GET: APIRoute = () => {
	const origin = SITE.url.replace(/\/$/, "");

	const entries: { path: string; lastmod?: string }[] = [
		...STATIC_ROUTES.map((path) => ({ path })),
		...ACTIVE_CATEGORIES.map((category) => ({
			path: `/blog/categoria/${category.slug}/`,
		})),
		...POSTS.map((post) => ({
			path: `/blog/${post.slug}/`,
			lastmod: post.updated ?? post.date,
		})),
	];

	const urls = entries
		.map(({ path, lastmod }) =>
			[
				"  <url>",
				`    <loc>${origin}${path}</loc>`,
				...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
				"  </url>",
			].join("\n"),
		)
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(xml, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
