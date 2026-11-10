/**
 * Site-wide identity, navigation and editorial copy.
 *
 * Everything here is either a fact already present in `cv.ts` or a framing
 * sentence from the implementation plan. No metrics, employers or links are
 * invented in this file.
 */

export const SITE = {
	name: "Gabriel Alcántara",
	shortName: "G. Alcántara",
	url: "https://gabrielalcantara.com",
	locale: "es_ES",
	lang: "es",
	title: "Software Architect & Software Engineer",
	roles: ["Software Architect", "Software Engineer"],
	headline:
		"Diseño sistemas complejos para convertir problemas difíciles en software evolutivo.",
	description:
		"Soy Gabriel Alcántara, arquitecto de software y Software Engineer especializado en sistemas distribuidos, arquitecturas orientadas a eventos, backend y soluciones industriales conectadas.",
	email: "gabriel@alcantaramoreno.com",
	location: "Barcelona · remoto",
	availability: "Disponible",
	careerStart: 2011,
	socials: [
		{ label: "GitHub", href: "https://github.com/SrAlcantaraRD" },
		{ label: "X", href: "https://x.com/SrAlcantaraRD" },
	],
	knowsAbout: [
		"Software Architecture",
		"Distributed Systems",
		"Event-Driven Architecture",
		"Domain-Driven Design",
		"Backend Engineering",
		"Industrial Automation",
		"Technical Leadership",
		"CI/CD",
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
	"Entender el problema antes de aumentar la complejidad.",
	"Diseñar límites claros entre responsabilidades.",
	"Automatizar todo lo que pueda repetirse.",
	"Validar las decisiones con feedback real.",
	"Compartir contexto para que los equipos puedan avanzar con autonomía.",
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
