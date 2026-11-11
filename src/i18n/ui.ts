import {
	DEFAULT_LOCALE,
	LOCALES,
	SECTION_ANCHORS,
	localeRoot,
	type Locale,
	type Section,
} from "./routing.ts";

/** Public language map used by the language picker, following Astro's recipe. */
export const languages = {
	es: "Español",
	en: "English",
	ca: "Català",
} as const;

export const defaultLang: Locale = DEFAULT_LOCALE;
export const showDefaultLang = false;

const es = {
	"nav.home": "Inicio",
	"nav.about": "Sobre mí",
	"nav.experience": "Experiencia",
	"nav.projects": "Proyectos",
	"nav.blog": "Blog",
	"nav.services": "Servicios",
	"nav.contact": "Contacto",
	mainNav: "Navegación principal",
	mobileNav: "Navegación móvil",
	menu: "Menú",
	cv: "CV",
	contact: "Contactar",
	language: "Idioma",
	breadcrumbs: "Ruta de navegación",
	themeToDark: "Cambiar a tema oscuro",
	themeToLight: "Cambiar a tema claro",
	skip: "Saltar al contenido",
	askLabel: "Pregúntale sobre mí a",
	askAria: "Pregúntale a la IA sobre Gabriel Alcántara",
	askPrompt:
		"¿Quién es Gabriel Alcántara y qué experiencia tiene como arquitecto de software? Lee https://gabrielalcantara.com/llms.txt y resúmeme su perfil: sistemas distribuidos, arquitectura orientada a eventos, DDD y liderazgo técnico.",
	"footer.role":
		"Solutions Architect · Software Engineer. Sistemas distribuidos, arquitecturas orientadas a eventos y soluciones industriales conectadas.",
	"footer.sections": "Secciones",
	"footer.profile": "Perfil",
	"footer.contact": "Contacto",
	"footer.fullCv": "CV completo",
	"footer.career": "Trayectoria",
	"footer.stages": "etapas",
	"footer.since": "desde",
	"footer.availability": "Disponible",
	"footer.location": "Barcelona · remoto",
} as const;

export type UiKey = keyof typeof es;

const en: Record<UiKey, string> = {
	"nav.home": "Home",
	"nav.about": "About",
	"nav.experience": "Experience",
	"nav.projects": "Projects",
	"nav.blog": "Writing",
	"nav.services": "Services",
	"nav.contact": "Contact",
	mainNav: "Main navigation",
	mobileNav: "Mobile navigation",
	menu: "Menu",
	cv: "CV",
	contact: "Get in touch",
	language: "Language",
	breadcrumbs: "Breadcrumb",
	themeToDark: "Switch to dark theme",
	themeToLight: "Switch to light theme",
	skip: "Skip to content",
	askLabel: "Ask an assistant about me",
	askAria: "Ask an AI assistant about Gabriel Alcántara",
	askPrompt:
		"Who is Gabriel Alcántara and what experience does he have as a Solutions Architect? Read https://gabrielalcantara.com/llms.txt and summarise his profile: distributed systems, event-driven architecture, DDD and technical leadership.",
	"footer.role":
		"Solutions Architect · Software Engineer. Distributed systems, event-driven architectures and connected industrial solutions.",
	"footer.sections": "Sections",
	"footer.profile": "Profile",
	"footer.contact": "Contact",
	"footer.fullCv": "Full CV",
	"footer.career": "Career",
	"footer.stages": "stages",
	"footer.since": "since",
	"footer.availability": "Available",
	"footer.location": "Barcelona · remote",
};

const ca: Record<UiKey, string> = {
	"nav.home": "Inici",
	"nav.about": "Sobre mi",
	"nav.experience": "Experiència",
	"nav.projects": "Projectes",
	"nav.blog": "Articles",
	"nav.services": "Serveis",
	"nav.contact": "Contacte",
	mainNav: "Navegació principal",
	mobileNav: "Navegació mòbil",
	menu: "Menú",
	cv: "CV",
	contact: "Contactar",
	language: "Idioma",
	breadcrumbs: "Ruta de navegació",
	themeToDark: "Canvia a tema fosc",
	themeToLight: "Canvia a tema clar",
	skip: "Salta al contingut",
	askLabel: "Pregunta-li sobre mi a",
	askAria: "Pregunta a la IA sobre Gabriel Alcántara",
	askPrompt:
		"Qui és Gabriel Alcántara i quina experiència té com a arquitecte de programari? Llegeix https://gabrielalcantara.com/llms.txt i resumeix el seu perfil: sistemes distribuïts, arquitectura orientada a esdeveniments, DDD i lideratge tècnic.",
	"footer.role":
		"Solutions Architect · Software Engineer. Sistemes distribuïts, arquitectures orientades a esdeveniments i solucions industrials connectades.",
	"footer.sections": "Seccions",
	"footer.profile": "Perfil",
	"footer.contact": "Contacte",
	"footer.fullCv": "CV complet",
	"footer.career": "Trajectòria",
	"footer.stages": "etapes",
	"footer.since": "des del",
	"footer.availability": "Disponible",
	"footer.location": "Barcelona · remot",
};

/** Flat dictionaries, so every key is a literal such as `"nav.home"`. */
export const ui = { es, en, ca } as const satisfies Record<
	Locale,
	Record<UiKey, string>
>;

export type NavKey =
	| "home"
	| "about"
	| "experience"
	| "projects"
	| "blog"
	| "services"
	| "contact";

export interface NavItem {
	key: NavKey;
	label: string;
	href: string;
	section?: Section;
}

const NAV_ORDER: NavKey[] = [
	"home",
	"about",
	"experience",
	"projects",
	"blog",
	"services",
	"contact",
];

const NAV_SECTIONS: Partial<Record<NavKey, Section>> = {
	about: "about",
	experience: "experience",
	projects: "projects",
	blog: "blog",
	services: "services",
	contact: "contact",
};

/**
 * Every locale is a one-page profile: the navigation scrolls to the section on
 * the home and the detail lives behind the "see the full section" link.
 */
export function navItems(locale: Locale): NavItem[] {
	const home = localeRoot(locale);
	return NAV_ORDER.map((key) => {
		const section = NAV_SECTIONS[key];
		const href =
			key === "home"
				? home
				: `${home}#${SECTION_ANCHORS[section as Section]}`;
		const labelKey = `nav.${key}` as const;
		return { key, label: ui[locale][labelKey], href, section };
	});
}

export function localeLinks(): {
	locale: Locale;
	label: string;
	short: string;
}[] {
	return LOCALES.map((locale) => ({
		locale,
		label: languages[locale],
		short: locale.toUpperCase(),
	}));
}
