import type { APIRoute } from "astro";

import { sitemapEntries } from "../lib/seo.ts";
import { SITE } from "../data/site.ts";

/**
 * Static sitemap: every indexable route of the site.
 *
 * The list comes from `src/lib/seo.ts`, which derives it from the same data
 * that renders the pages. A new post, category or case study appears here
 * without a second edit, and `tests/seo.test.ts` fails if a page is missing.
 */
export const GET: APIRoute = () => {
	const origin = SITE.url.replace(/\/$/, "");

	const urls = sitemapEntries()
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
