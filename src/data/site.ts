/**
 * Site-wide identity, navigation and editorial copy.
 *
 * Everything here is either a fact already present in `cv.ts` or a framing
 * sentence from the implementation plan. No metrics, employers or links are
 * invented in this file.
 */

/**
 * The home H1: three beats with the same stem. `headlineLines` is what the
 * heading actually says (assistive technology, metadata); the home paints it
 * once, hidden, and plays the wheel underneath.
 */
const HEADLINE_LINES = [
	"15 años construyendo.",
	"15 años resolviendo.",
	"15 años aprendiendo.",
] as const;

/**
 * The words the wheel can stop on, in order. Adding one is enough: the reel
 * wraps around the list and only ever shows the words next to the centre.
 */
const HEADLINE_WORDS = [
	"construyendo",
	"resolviendo",
	"aprendiendo",
	"solucionando",
	"creciendo",
	"superando retos",
] as const;

export const SITE = {
	name: "Gabriel Alcántara",
	shortName: "G. Alcántara",
	url: "https://gabrielalcantara.com",
	locale: "es_ES",
	lang: "es",
	title: "Software Architect & Software Engineer",
	roles: ["Software Architect", "Software Engineer"],
	headlineLines: HEADLINE_LINES,
	headlineWords: HEADLINE_WORDS,
	headline: HEADLINE_LINES.join(" "),
	description:
		"Soy Gabriel Alcántara, arquitecto de software y Software Engineer especializado en sistemas distribuidos, arquitecturas orientadas a eventos, backend y soluciones industriales conectadas.",
	email: "gabriel@alcantaramoreno.com",
	location: "Barcelona · remoto",
	availability: "Disponible",
	careerStart: 2011,
	languages: ["español (nativo)", "inglés (profesional)"],
	socials: [
		{ label: "GitHub", href: "https://github.com/SrAlcantaraRD" },
		{ label: "X", href: "https://x.com/SrAlcantaraRD" },
	],
	/**
	 * The same list twice: `en` feeds `Person.knowsAbout` in the JSON-LD, `es`
	 * is the prose `llms.txt` writes. One array, so the two cannot drift.
	 */
	knowsAbout: [
		{ en: "Software Architecture", es: "arquitectura de software" },
		{ en: "Distributed Systems", es: "sistemas distribuidos" },
		{
			en: "Event-Driven Architecture",
			es: "arquitectura orientada a eventos (EDA)",
		},
		{ en: "Domain-Driven Design", es: "domain-driven design (DDD)" },
		{ en: "Backend Engineering", es: "backend" },
		{ en: "Industrial Automation", es: "automatización industrial" },
		{ en: "Technical Leadership", es: "liderazgo técnico" },
		{ en: "CI/CD", es: "CI/CD" },
	],
} as const;

export interface NavItem {
	label: string;
	href: string;
}

export interface Breadcrumb {
	label: string;
	href?: string;
}

/** The consolidated navigation from the plan: seven sections, no dead ends. */
export const NAV: NavItem[] = [
	{ label: "Inicio", href: "/" },
	{ label: "Sobre mí", href: "/about/" },
	{ label: "Experiencia", href: "/experience/" },
	{ label: "Proyectos", href: "/projects/" },
	{ label: "Blog", href: "/blog/" },
	{ label: "Servicios", href: "/services/" },
	{ label: "Contacto", href: "/contact/" },
];

export function isNavActive(pathname: string, href: string): boolean {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(href);
}

/**
 * The question the header hands to an assistant. It points at llms.txt first so
 * the answer comes from the site instead of from whatever the model remembers.
 */
export const ASK_PROMPT =
	"¿Quién es Gabriel Alcántara y qué experiencia tiene como arquitecto de software? Lee https://gabrielalcantara.com/llms.txt y resúmeme su perfil: sistemas distribuidos, arquitectura orientada a eventos, DDD y liderazgo técnico.";

export interface AskAssistant {
	id: "chatgpt" | "claude" | "gemini";
	label: string;
	href: string;
}

const askQuestion = encodeURIComponent(ASK_PROMPT);

export const ASK_ASSISTANTS: AskAssistant[] = [
	{
		id: "chatgpt",
		label: "ChatGPT",
		href: `https://chatgpt.com/?q=${askQuestion}`,
	},
	{
		id: "claude",
		label: "Claude",
		href: `https://claude.ai/new?q=${askQuestion}`,
	},
	{
		id: "gemini",
		label: "Gemini",
		href: `https://www.google.com/search?udm=50&q=${askQuestion}`,
	},
];

export interface Specialty {
	title: string;
	body: string;
}

export const SPECIALTIES: Specialty[] = [
	{
		title: "Arquitectura de software",
		body: "Diseño y evolución de sistemas complejos: límites entre dominios, decisiones documentadas y margen real para cambiar.",
	},
	{
		title: "Sistemas distribuidos",
		body: "Servicios, eventos, comunicación y resiliencia. Desacoplar lo que cambia a distinta velocidad sin perder trazabilidad.",
	},
	{
		title: "Liderazgo técnico",
		body: "Decisiones de arquitectura, revisión de PRs, PRDs y mentoría para que el equipo avance con criterio propio.",
	},
	{
		title: "Automatización industrial",
		body: "Integración entre software, operaciones y hardware: robots, PLC, LEDs y cámaras dentro del mismo flujo de trabajo.",
	},
];

export const PRINCIPLES: string[] = [
	"Entiendo negocio y requisitos antes de elegir tecnología.",
	"Propongo alternativas y explico sus compromisos.",
	"Decisiones escritas y límites explícitos.",
	"Pruebas sobre el comportamiento real, no sobre la intención.",
];

export interface Service {
	title: string;
	body: string;
}

export const SERVICES: Service[] = [
	{
		title: "Revisión de arquitectura",
		body: "Una lectura externa de tu sistema: dónde están los acoplamientos, qué decisiones conviene revisar y qué se puede posponer.",
	},
	{
		title: "Diseño de sistemas distribuidos",
		body: "Límites de servicio, comunicación por eventos, consistencia y resiliencia antes de que el sistema crezca de más.",
	},
	{
		title: "Modernización de plataformas",
		body: "Evolucionar un sistema existente sin reescribirlo: separar dominios, aislar lo que más cambia y permitir despliegues independientes.",
	},
	{
		title: "Diseño de integraciones",
		body: "APIs, capas de integración y adaptadores para conectar software entre sí y con dispositivos o proveedores externos.",
	},
	{
		title: "Modelado de dominios",
		body: "Entender el negocio antes de elegir la tecnología: lenguaje común, agregados y límites que sobrevivan al siguiente requisito.",
	},
	{
		title: "Acompañamiento técnico a equipos",
		body: "Trabajar junto al equipo en las decisiones y en el código, con revisión de PRs y contexto compartido.",
	},
	{
		title: "Mentoría para perfiles senior",
		body: "Acompañar el salto a responsabilidades de arquitectura o liderazgo técnico con problemas reales, no con teoría genérica.",
	},
	{
		title: "Revisión de decisiones técnicas",
		body: "Contrastar una decisión concreta (un stack, una integración, un despliegue) con sus compromisos y alternativas.",
	},
];

export const COLLABORATION = [
	"Empiezo por entender el contexto, las restricciones y el resultado que se necesita.",
	"Después propongo alternativas y explico sus compromisos.",
	"Por último ayudo a convertir la decisión en pasos concretos.",
];
