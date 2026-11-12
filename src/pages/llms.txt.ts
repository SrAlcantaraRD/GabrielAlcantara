import type { APIRoute } from "astro";

import { POSTS, categoryOf, postHref } from "../data/blog.ts";
import { COMPANIES } from "../data/cv.ts";
import {
	OTHER_PROJECTS,
	PROJECT_CASES,
	caseStudyOf,
} from "../data/projects.ts";
import { SERVICES, SITE } from "../data/site.ts";
import type { TranslatedLocale } from "../i18n/routing.ts";
import { PROFILE } from "../i18n/profile.ts";
import { indexableRoutes, routesFor, translatedLocales } from "../lib/routes.ts";import { STATIC_PAGES, casePath } from "../lib/seo.ts";

/**
 * `llms.txt` generated from the same data that renders the site.
 *
 * The previous version was a hand-written file in `public/`, and four project
 * links had already drifted to `/projects/`. Deriving it makes that impossible:
 * a new post or case study appears here without a second edit, and a project
 * without its own page links to the index instead of to a URL that never existed.
 */
const NOTE =
	"Las cifras de impacto no publicadas se describen en términos cualitativos (trazabilidad, automatización, integración, autonomía de equipo). No se publican métricas que no puedan verificarse.";

const absolute = (path: string) => new URL(path, SITE.url).href;

const LOCALE_LABELS: Record<
	TranslatedLocale,
	{ profile: string; writing: string; projects: string; suffix: string }
> = {
	en: {
		profile: "English profile",
		writing: "English writing",
		projects: "English projects",
		suffix: "English",
	},
	ca: {
		profile: "Perfil en català",
		writing: "Articles en català",
		projects: "Projectes en català",
		suffix: "català",
	},
};

export const GET: APIRoute = () => {
	const profile = [
		`- Nombre profesional: ${SITE.name}`,
		`- Titular: ${SITE.roles.join(" · ")}`,
		`- Especialidades: ${SITE.knowsAbout.map((item) => item.es).join(", ")}`,
		`- Experiencia: desde ${SITE.careerStart} en ${COMPANIES.map((company) => company.name).join(", ")}`,
		`- Ubicación: ${SITE.location}`,
		`- Idiomas: ${SITE.languages.join(", ")}`,
	];

	const pages = STATIC_PAGES.map(
		(page) => `- [${page.label}](${absolute(page.path)}): ${page.summary}`,
	);

	const projects = [
		...PROJECT_CASES.map((item) => ({
			name: item.name,
			href: casePath(item) ?? "/projects/",
			summary: item.tagline ?? item.outcome,
		})),
		...OTHER_PROJECTS.map((project) => ({
			name: project.name,
			href: "/projects/",
			summary: project.summary,
		})),
	].map((item) => `- [${item.name}](${absolute(item.href)}): ${item.summary}`);

	const services = SERVICES.map(
		(service) =>
			`- [${service.title}](${absolute("/services/")}): ${service.body}`,
	);

	const articles = [...POSTS]
		.sort((a, b) => b.date.localeCompare(a.date))
		.map(
			(post) =>
				`- [${post.title}](${absolute(postHref(post.slug))}) · ${categoryOf(post.category).label} · ${post.date}`,
		);

	const contact = [
		`- Email: ${SITE.email}`,
		...SITE.socials.map((social) => `- ${social.label}: ${social.href}`),
	];

	const translated = [
		...translatedLocales("home").flatMap((locale) =>
			routesFor(locale, "home").map(
				(route) =>
					`- [${LOCALE_LABELS[locale].profile}](${absolute(route.path)}): ${PROFILE[locale].metaDescription}`,
			),
		),
		...translatedLocales("blog").flatMap((locale) =>
			routesFor(locale, "blog").map(
				(route) =>
					`- [${LOCALE_LABELS[locale].writing}](${absolute(route.path)}): ${PROFILE[locale].writing.title}`,
			),
		),
		...translatedLocales("projects").flatMap((locale) =>
			routesFor(locale, "projects").map(
				(route) =>
					`- [${LOCALE_LABELS[locale].projects}](${absolute(route.path)}): ${PROFILE[locale].selected.title}`,
			),
		),
		...translatedLocales("post").flatMap((locale) =>
			routesFor(locale, "post").map((route) => {
				const copy = PROFILE[locale].posts[route.slug as string];
				return `- [${copy.title}](${absolute(route.path)}) · ${copy.category}`;
			}),
		),
		...indexableRoutes()
			.filter((route) => route.kind === "case" && route.locale !== "es")
			.map(
				(route) =>
					`- [${caseStudyOf(route.slug as string).name} (${LOCALE_LABELS[route.locale as TranslatedLocale].suffix})](${absolute(route.path)})`,
			),
	];

	const body = [
		`# ${SITE.name}`,
		"",
		`> ${SITE.description} Trabajo desde ${SITE.location.split(" · ").join(", en ")}. Estoy ${SITE.availability.toLowerCase()}.`,
		"",
		"## Perfil",
		"",
		...profile,
		"",
		"## Páginas principales",
		"",
		...pages,
		"",
		"## Proyectos",
		"",
		...projects,
		"",
		"## Servicios",
		"",
		...services,
		"",
		"## Artículos",
		"",
		...articles,
		"",
		"## Contenido traducido",
		"",
		...translated,
		"",
		"## Contacto",
		"",
		...contact,
		"",
		"## Nota",
		"",
		NOTE,
		"",
	].join("\n");

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
