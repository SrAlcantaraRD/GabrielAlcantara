/**
 * Canonical route inventory of the site.
 *
 * Every page, `sitemap.xml`, `llms.txt`, the `getStaticPaths` of the translated
 * templates and the tests read from this table, so a route cannot exist in one
 * place and be missing from another. The table describes routes, not the
 * `.astro` files that render them: a translated page is generated from the same
 * template for every locale.
 */
import {
	ACTIVE_CATEGORIES,
	POSTS,
	categoryHref,
	postHref,
} from "../data/blog.ts";
import { PROJECT_CASES } from "../data/projects.ts";
import {
	TRANSLATED_LOCALES,
	type Locale,
	type TranslatedLocale,
} from "../i18n/routing.ts";

export type RouteKind = "page" | "post" | "case" | "category";

/** The page template that renders a route. */
export type RouteView =
	| "home"
	| "about"
	| "experience"
	| "cv"
	| "projects"
	| "blog"
	| "services"
	| "contact"
	| "post"
	| "case"
	| "category";

export interface Route {
	/** Emitted URL, with the trailing-slash form the build uses. */
	path: string;
	kind: RouteKind;
	view: RouteView;
	locale: Locale;
	/** Post slug, case-study id or category slug, when the route has one. */
	slug?: string;
}

/** Pages that exist only in the base locale. */
const SPANISH_PAGES: { view: RouteView; path: string }[] = [
	{ view: "home", path: "/" },
	{ view: "about", path: "/about/" },
	{ view: "experience", path: "/experience/" },
	{ view: "cv", path: "/cv/" },
	{ view: "projects", path: "/projects/" },
	{ view: "blog", path: "/blog/" },
	{ view: "services", path: "/services/" },
	{ view: "contact", path: "/contact/" },
];

/** One route per translated page and per translated copy of a slug. */
export function indexableRoutes(): Route[] {
	const routes: Route[] = SPANISH_PAGES.map(({ path, view }) => ({
		path,
		kind: "page",
		view,
		locale: "es",
	}));

	for (const locale of TRANSLATED_LOCALES) {
		routes.push(
			{ path: `/${locale}/`, kind: "page", view: "home", locale },
			{ path: `/${locale}/blog/`, kind: "page", view: "blog", locale },
			{
				path: `/${locale}/projects/`,
				kind: "page",
				view: "projects",
				locale,
			},
		);
	}

	for (const category of ACTIVE_CATEGORIES) {
		routes.push({
			path: categoryHref(category.slug),
			kind: "category",
			view: "category",
			locale: "es",
			slug: category.slug,
		});
	}

	for (const post of POSTS) {
		routes.push({
			path: postHref(post.slug),
			kind: "post",
			view: "post",
			locale: "es",
			slug: post.slug,
		});
		for (const locale of TRANSLATED_LOCALES) {
			routes.push({
				path: `/${locale}/blog/${post.slug}/`,
				kind: "post",
				view: "post",
				locale,
				slug: post.slug,
			});
		}
	}

	for (const item of PROJECT_CASES) {
		const href = item.caseStudyHref;
		if (!href) continue;
		routes.push({
			path: href,
			kind: "case",
			view: "case",
			locale: "es",
			slug: item.id,
		});
		for (const locale of TRANSLATED_LOCALES) {
			routes.push({
				path: `/${locale}${href}`,
				kind: "case",
				view: "case",
				locale,
				slug: item.id,
			});
		}
	}

	return routes;
}

/** Routes a given view has to generate for a locale. */
export function routesFor(locale: Locale, view: RouteView): Route[] {
	return indexableRoutes().filter(
		(route) => route.locale === locale && route.view === view,
	);
}

/** Translated locales that render a given view, read from the route table. */
export function translatedLocales(view: RouteView): TranslatedLocale[] {
	const locales = new Set<TranslatedLocale>();

	for (const route of indexableRoutes()) {
		if (route.view === view && route.locale !== "es") {
			locales.add(route.locale as TranslatedLocale);
		}
	}

	return [...locales];
}
