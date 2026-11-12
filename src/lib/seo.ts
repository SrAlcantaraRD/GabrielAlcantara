/**
 * Canonical route inventory behind the SEO artifacts.
 *
 * `sitemap.xml` and `llms.txt` are both built from this module, so a page, post,
 * category or case study cannot appear in one and be missing from the other.
 * `tests/seo.test.ts` reads the same functions, which is what turns a forgotten
 * route into a failing test instead of a silent gap.
 */
import { POSTS } from "../data/blog.ts";
import { OTHER_PROJECTS } from "../data/projects.ts";
import { indexableRoutes } from "./routes.ts";

export interface SitemapEntry {
	path: string;
	/** ISO date of the last content change, when the data declares one. */
	lastmod?: string;
}

export interface PageEntry {
	path: string;
	label: string;
	summary: string;
}

/**
 * Indexable pages that have no data source to derive them from.
 *
 * Adding a page means adding it to the route table in `src/lib/routes.ts` and
 * to this list: the sitemap test fails otherwise. Pages that exist for machines
 * (`sitemap.xml`, `llms.txt`) and the error page are not part of the list.
 */
export const STATIC_PAGES: PageEntry[] = [
	{
		path: "/",
		label: "Inicio",
		summary: "propuesta de valor y proyectos destacados",
	},
	{
		path: "/about/",
		label: "Sobre mí",
		summary: "trayectoria, principios y retos",
	},
	{
		path: "/experience/",
		label: "Experiencia",
		summary: "puestos, proyectos y línea temporal",
	},
	{ path: "/cv/", label: "CV", summary: "currículum completo en HTML" },
	{ path: "/projects/", label: "Proyectos", summary: "casos de estudio" },
	{
		path: "/blog/",
		label: "Blog",
		summary: "arquitectura, sistemas distribuidos, DDD y automatización",
	},
	{
		path: "/services/",
		label: "Servicios",
		summary: "tipos de colaboración técnica",
	},
	{ path: "/contact/", label: "Contacto", summary: "canales directos" },
	{
		path: "/en/",
		label: "English profile",
		summary:
			"translated profile: about, selected work, experience, writing and services",
	},
	{
		path: "/ca/",
		label: "Perfil en català",
		summary:
			"perfil traduït: sobre mi, treball seleccionat, experiència, articles i serveis",
	},
];

/**
 * Case study URL, only when the project actually has its own page.
 *
 * Five of the seven cases are documented on `/projects/` itself and declare no
 * `caseStudyHref`. Deriving `/projects/<id>/` from the id would advertise a URL
 * that was never built, so the absence stays an absence and the caller falls
 * back to the index.
 */
export function casePath(item: { caseStudyHref?: string }): string | undefined {
	return item.caseStudyHref;
}

/** Every indexable route, derived from the same table that renders the pages. */
export function sitemapEntries(): SitemapEntry[] {
	const posts = new Map(POSTS.map((post) => [post.slug, post]));

	return dedupe(
		indexableRoutes().map((route) => {
			const post =
				route.kind === "post" ? posts.get(route.slug ?? "") : undefined;

			return {
				path: route.path,
				lastmod: post ? (post.updated ?? post.date) : undefined,
			};
		}),
	);
}

/**
 * Collapses duplicate paths, keeping the entry that carries a `lastmod`.
 *
 * A case study linked from two places must not be emitted twice; the sitemap
 * protocol treats duplicate `<loc>` entries as a defect.
 */
function dedupe(entries: SitemapEntry[]): SitemapEntry[] {
	const byPath = new Map<string, SitemapEntry>();

	for (const entry of entries) {
		const previous = byPath.get(entry.path);
		if (!previous || (!previous.lastmod && entry.lastmod)) {
			byPath.set(entry.path, entry);
		}
	}

	return [...byPath.values()];
}

/** Projects without a written case study, listed by `llms.txt`. */
export function projectsWithoutCase() {
	return OTHER_PROJECTS;
}
