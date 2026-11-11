/**
 * Career data behind the trajectory matrix.
 *
 * Source: the owner's LinkedIn export (dates, titles, places, skills) plus the
 * published CV copy. Nothing here is inferred: if a fact is not in either
 * source it is not in this file.
 *
 * Periods are the thing to edit. Everything is written as `"YYYY.MM"` and both
 * ends are inclusive: `start` is the first month worked, `end` the last one.
 *
 *   { start: "2023.01", end: "2023.11" }  → enero a noviembre de 2023
 *
 * A position (POSITIONS) owns its months; its projects inherit them unless a
 * project declares its own `start`/`end`. Undated projects of a position are
 * spread over it in the order they are written. The timeline range is derived,
 * so moving a period moves the matrix with it.
 */

import { currentMonth, monthLabel, parseMonth } from "../lib/period.ts";

export type Pillar =
	| "web"
	| "mobile"
	| "data"
	| "integration"
	| "micro"
	| "eda"
	| "cloud"
	| "robotics"
	| "security"
	| "lead";

export type Domain =
	| "financial"
	| "public"
	| "product"
	| "health"
	| "logistics"
	| "agrifood";

export type Accent = "cobalt" | "sage" | "terracotta";

export interface Company {
	id: string;
	name: string;
	short: string;
	accent: Accent;
}

export interface Position {
	id: string;
	companyId: string;
	title: string;
	/** First month worked, inclusive. */
	start: string;
	/** Last month worked, inclusive. */
	end: string;
	place?: string;
	mode?: string;
	focus: string;
	summary: string;
	achievements: string[];
	stack: string[];
}

export interface PositionView extends Position {
	company: string;
	companyShort: string;
	accent: Accent;
	startMonth: number;
	/** Exclusive, so endMonth - startMonth is the worked months. */
	endMonth: number;
	months: number;
}

export interface ProjectSeed {
	id: string;
	positionId: string;
	name: string;
	/** Compact label used inside narrow timeline bars. */
	short: string;
	/** Optional: defaults to the months of the position. */
	start?: string;
	/** Optional: defaults to the months of the position. */
	end?: string;
	domain: Domain;
	pillars: Pillar[];
	summary: string;
	achievements: string[];
	stack?: string[];
}

export interface Project {
	id: string;
	positionId: string;
	position: string;
	companyId: string;
	company: string;
	companyShort: string;
	accent: Accent;
	name: string;
	short: string;
	startMonth: number;
	endMonth: number;
	domain: Domain;
	pillars: Pillar[];
	summary: string;
	achievements: string[];
	stack?: string[];
}

export interface Education {
	year: string;
	title: string;
	org: string;
}

export const PILLAR_LABEL: Record<Pillar, string> = {
	web: "web y desktop",
	mobile: "mobile",
	data: "datos y sql",
	integration: "integración y crm",
	micro: "microservicios",
	eda: "eventos (eda)",
	cloud: "cloud y ci/cd",
	robotics: "iot y robótica",
	security: "seguridad y rbac",
	lead: "liderazgo",
};

export const DOMAIN_LABEL: Record<Domain, string> = {
	financial: "plataforma financiera y concursal",
	public: "sector público",
	product: "producto digital",
	health: "salud y marca",
	logistics: "logística y automatización",
	agrifood: "vino y agroalimentación",
};

export const PILLAR_ORDER: Pillar[] = [
	"web",
	"mobile",
	"data",
	"integration",
	"micro",
	"eda",
	"cloud",
	"robotics",
	"security",
	"lead",
];

export const DOMAIN_ORDER: Domain[] = [
	"financial",
	"public",
	"product",
	"health",
	"logistics",
	"agrifood",
];

export const COMPANIES: Company[] = [
	{ id: "acd", name: "ACD Sistemes SL", short: "acd", accent: "terracotta" },
	{ id: "basetis", name: "Basetis", short: "basetis", accent: "sage" },
	{ id: "quabu", name: "Quabu Solutions", short: "quabu", accent: "cobalt" },
	{
		id: "pachanga",
		name: "Pachanga Community",
		short: "pachanga",
		accent: "sage",
	},
];

export const POSITIONS: Position[] = [
	{
		id: "acd-junior",
		companyId: "acd",
		title: "Junior Software Developer",
		start: "2011.12",
		end: "2013.09",
		place: "Igualada",
		focus: "primer producto: auditoría contable",
		summary:
			"Primeros años en el producto de auditoría contable: SQL de Fazenda do São Paulo, el importador de datos y el auditor migrando de Delphi a Velneo con sus gráficas.",
		achievements: [
			"Migración de ACDAuditor desde Velasquez y Delphi hacia Velneo.",
			"Primeras gráficas del producto sobre Velneo.",
			"Consultas SQL de la implantación de Fazenda do São Paulo.",
		],
		stack: ["SQL", "Delphi", "Velneo"],
	},
	{
		id: "acd-web-suite",
		companyId: "acd",
		title: "Full Stack Developer",
		start: "2013.09",
		end: "2015.09",
		place: "Igualada",
		focus: "suite web del producto concursal",
		summary:
			"Desarrollo de las soluciones web del producto: concursal, circularización y web comercial, asumiendo responsabilidad técnica progresiva sobre ellas.",
		achievements: [
			"ACDConcursalWeb y ACDCircularizacionWeb de principio a fin.",
			"Web comercial del producto.",
		],
		stack: ["Web", "SQL"],
	},
	{
		id: "acd-concursal-modulo",
		companyId: "acd",
		title: "Full Stack Developer",
		start: "2015.09",
		end: "2016.04",
		place: "Igualada",
		focus: "validación de datos de auditoría",
		summary:
			"Nuevo módulo de ACD Concursal para validar los datos de auditoría antes de consolidarlos.",
		achievements: [],
		stack: ["Web", "SQL"],
	},
	{
		id: "acd-igf",
		companyId: "acd",
		title: "Product Owner & Developer",
		start: "2016.04",
		end: "2016.07",
		place: "Barcelona",
		focus: "entrega internacional y web grids",
		summary:
			"Product owner y desarrollo de la entrega para el IGF de Angola, con ACDWebGrids (AngularJS y jQuery) y un rediseño del importador.",
		achievements: [
			"Rol de product owner además del desarrollo.",
			"Entrega para el Instituto de Gestão de Fundos de Angola.",
			"ACDWebGrids sobre AngularJS y jQuery.",
		],
		stack: ["AngularJS", "jQuery", "SQL"],
	},
	{
		id: "acd-charts",
		companyId: "acd",
		title: "Full Stack Developer",
		start: "2016.07",
		end: "2016.09",
		place: "Barcelona",
		focus: "gráficas dinámicas en javascript",
		summary:
			"ACDCharts: gráficas dinámicas y personalizables en JavaScript para el producto de auditoría.",
		achievements: [],
		stack: ["JavaScript"],
	},
	{
		id: "acd-importador2",
		companyId: "acd",
		title: "Full Stack Developer",
		start: "2016.09",
		end: "2017.04",
		place: "Barcelona",
		focus: "nueva versión del importador",
		summary:
			"Nueva versión del importador de datos contables del producto ACD.",
		achievements: [],
		stack: ["Web", "SQL"],
	},
	{
		id: "basetis-shelter",
		companyId: "basetis",
		title: "Web Software Developer",
		start: "2017.08",
		end: "2017.12",
		place: "Barcelona",
		focus: "primer proyecto en consultora",
		summary:
			"ShelterGencat: desarrollo web con React y React Native para la Generalitat, con Jenkins en el pipeline.",
		achievements: [],
		stack: ["React", "React Native", "CSS", "MySQL", "Jenkins"],
	},
	{
		id: "basetis-siebel",
		companyId: "basetis",
		title: "Siebel Developer",
		start: "2017.12",
		end: "2018.06",
		place: "Barcelona",
		focus: "crm enterprise para aca csv",
		summary: "Desarrollo Siebel para ACA CSV: CRM y Oracle PL/SQL.",
		achievements: [],
		stack: ["Siebel", "CRM", "Oracle PL/SQL"],
	},
	{
		id: "basetis-msupply",
		companyId: "basetis",
		title: "Full Stack Developer",
		start: "2018.06",
		end: "2019.10",
		place: "Barcelona",
		focus: "producto con equipo y cliente propio",
		summary:
			"MSyupply: desarrollo full stack con AngularJS, Redux y Sass, y Mulesoft como capa de integración. Asumí además gestión de equipo, análisis funcional y trato directo con cliente.",
		achievements: [
			"Gestión de equipo y planificación con Jira y Jenkins.",
			"Análisis funcional y gestión de cliente.",
		],
		stack: [
			"AngularJS",
			"Redux",
			"Sass",
			"CSS",
			"SQL",
			"MySQL",
			"Mulesoft",
			"Jira",
			"Jenkins",
		],
	},
	{
		id: "basetis-ema",
		companyId: "basetis",
		title: "Full Stack Developer",
		start: "2019.10",
		end: "2020.09",
		place: "Barcelona",
		focus: "mantenimiento de aplicaciones",
		summary:
			"EMA (Equipo de Mantenimiento de Aplicaciones): mantenimiento y evolución de aplicaciones sobre Amazon EC2.",
		achievements: [],
		stack: ["Amazon EC2"],
	},
	{
		id: "basetis-isdin-pro",
		companyId: "basetis",
		title: "Full Stack Developer",
		start: "2020.09",
		end: "2021.03",
		place: "Barcelona",
		focus: "producto de marca sobre node",
		summary:
			"LoveISDIN Proyect: desarrollo full stack con Node.js, MySQL y React, y Redis para estado y caché.",
		achievements: [],
		stack: ["NodeJS", "MySQL", "JavaScript", "ReactJS", "Redis"],
	},
	{
		id: "basetis-lead",
		companyId: "basetis",
		title: "Senior Technical Team Lead",
		start: "2021.03",
		end: "2024.04",
		place: "Barcelona",
		focus: "liderazgo técnico en loveisdin",
		summary:
			"Lideré técnicamente LoveISDIN: PRDs y análisis de viabilidad, revisión de PRs, mentoría del equipo y los componentes más críticos sobre AWS, Node.js, Next.js y React.",
		achievements: [
			"PRDs y análisis de viabilidad de los requerimientos con negocio.",
			"Revisión de PRs y mentoría del equipo.",
			"Componentes críticos, con seguridad, rendimiento y escalabilidad como requisito.",
		],
		stack: ["AWS", "NodeJS", "NextJS", "React", "Technical Leadership"],
	},
	{
		id: "quabu-architect",
		companyId: "quabu",
		title: "Arquitecto de soluciones de software",
		start: "2024.01",
		end: "2026.08",
		place: "Vilanova i la Geltrú",
		mode: "híbrido",
		focus: "arquitectura de producto y automatización industrial",
		summary:
			"Arquitectura de varios productos en paralelo: una herramienta de inventario de vino con RFID y machine learning, los addons de Atlassian, un producto de microservicios y, más tarde, un sistema distribuido de automatización de almacenes con robótica.",
		achievements: [
			"DDD y TDD para absorber las reglas de negocio, mapas y versiones de robot distintas de cada almacén.",
			"Core orientado a agentes: dictator ordena, ranker prioriza y distributor delega, maximizando la disponibilidad de los dispositivos y minimizando movimientos.",
			"Cada familia de dispositivo (carretilla, PLC, LED, picking, cámara…) es su propio microservicio, con adaptadores según modelo, versión y protocolo.",
			"Frontend reactivo por WebSocket y RBAC: la interfaz se adapta al rol (admin u operador) y al tipo de operador.",
			"Docker en cloud bajo VPN, con CI/CD y QA gates deterministas sobre hardware físico real.",
			"Documentación y comunicación técnica en inglés con fabricantes chinos.",
		],
		stack: [
			"EDA",
			"DDD",
			"TDD",
			"Microservicios",
			"WebSocket",
			"RBAC",
			"Docker",
			"CI/CD",
			"Cloud",
			"English",
		],
	},
	{
		id: "pachanga-own",
		companyId: "pachanga",
		title: "Arquitecto y desarrollador · producto propio",
		start: "2026.01",
		end: "2026.11",
		place: "Barcelona · remoto",
		mode: "producto propio",
		focus: "app móvil y web de fútbol amateur",
		summary:
			"Producto propio de principio a fin: app móvil en React Native y Expo, web en Ghost con tres idiomas, enlaces universales y despliegue en Dokploy.",
		achievements: [
			"App móvil con React Native y Expo, arquitectura hexagonal sobre DDD y Atomic Design.",
			"Web en Ghost con tema generado desde fuentes propias y tres idiomas.",
			"Enlaces universales con AASA y assetlinks, con fallback a tienda para quien no tiene la app.",
			"Despliegue propio: Docker en local y Traefik sobre Dokploy en producción.",
			"Publicada en App Store y Play Store: distribución e ingresos como siguiente frente.",
		],
		stack: [
			"React Native",
			"Expo",
			"TypeScript",
			"Supabase",
			"Drizzle",
			"Ghost",
			"Handlebars",
			"Docker",
			"Traefik",
			"Dokploy",
		],
	},
];

const PROJECT_SEEDS: ProjectSeed[] = [
	{
		id: "fazenda-sao-paulo",
		positionId: "acd-junior",
		name: "Fazenda do São Paulo",
		short: "fazenda",
		domain: "public",
		pillars: ["data"],
		summary: "Implantación con consultas SQL para Fazenda do São Paulo.",
		achievements: [],
	},
	{
		id: "acd-importador",
		positionId: "acd-junior",
		name: "ACDImportador",
		short: "importador",
		domain: "financial",
		pillars: ["data"],
		summary:
			"Importador de datos contables que alimenta al resto de la suite de auditoría.",
		achievements: [],
	},
	{
		id: "acd-auditor-delphi",
		positionId: "acd-junior",
		name: "ACDAuditor · Velasquez",
		short: "auditor",
		domain: "financial",
		pillars: ["web", "data"],
		summary:
			"Auditor contable del producto, migrado desde Velasquez y Delphi hacia Velneo.",
		achievements: [
			"Implantación y despliegue en cliente en Brasil y Angola.",
		],
	},
	{
		id: "acd-auditor-charts",
		positionId: "acd-junior",
		name: "ACDAuditor · gráficas Velneo",
		short: "gráficas",
		domain: "financial",
		pillars: ["web", "data"],
		summary: "Gráficas del auditor sobre Velneo.",
		achievements: [],
	},
	{
		id: "acd-concursal-web",
		positionId: "acd-web-suite",
		name: "ACDConcursal Web",
		short: "concursal",
		domain: "financial",
		pillars: ["web", "data"],
		summary: "Solución web de gestión concursal del producto ACD.",
		achievements: [
			"Responsabilidad técnica progresiva sobre la solución.",
		],
	},
	{
		id: "acd-circularizacion",
		positionId: "acd-web-suite",
		name: "ACDCircularización Web",
		short: "circularización",
		domain: "financial",
		pillars: ["web", "data"],
		summary:
			"Solución web para el proceso de circularización dentro de la suite de auditoría.",
		achievements: [],
	},
	{
		id: "acd-commercial-web",
		positionId: "acd-web-suite",
		name: "Web comercial",
		short: "comercial",
		domain: "financial",
		pillars: ["web"],
		summary: "Web comercial del producto.",
		achievements: [],
	},
	{
		id: "acd-concursal-modulo",
		positionId: "acd-concursal-modulo",
		name: "ACD Concursal · validación",
		short: "validación",
		domain: "financial",
		pillars: ["web", "data"],
		summary: "Módulo nuevo para validar los datos de auditoría.",
		achievements: [],
	},
	{
		id: "angola-igf",
		positionId: "acd-igf",
		name: "Angola · IGF",
		short: "angola",
		domain: "public",
		pillars: ["web", "data"],
		summary:
			"Entrega para el Instituto de Gestão de Fundos de Angola, con rol de product owner además del desarrollo.",
		achievements: [],
	},
	{
		id: "acd-web-grids",
		positionId: "acd-igf",
		name: "ACDWebGrids",
		short: "webgrids",
		domain: "financial",
		pillars: ["web"],
		summary: "Rejilla web reutilizable sobre AngularJS y jQuery.",
		achievements: [],
		stack: ["AngularJS", "jQuery"],
	},
	{
		id: "acd-charts",
		positionId: "acd-charts",
		name: "ACDCharts",
		short: "charts",
		domain: "financial",
		pillars: ["web", "data"],
		summary: "Gráficas dinámicas y personalizables en JavaScript.",
		achievements: [],
		stack: ["JavaScript"],
	},
	{
		id: "acd-importador-v2",
		positionId: "acd-importador2",
		name: "ACDImportador · nueva versión",
		short: "importador v2",
		domain: "financial",
		pillars: ["data"],
		summary: "Segunda versión del importador de datos contables.",
		achievements: [],
	},
	{
		id: "shelter-gencat",
		positionId: "basetis-shelter",
		name: "ShelterGencat",
		short: "shelter",
		domain: "public",
		pillars: ["web", "mobile"],
		summary:
			"Proyecto web para la Generalitat con React y React Native.",
		achievements: [],
		stack: ["React", "React Native", "MySQL"],
	},
	{
		id: "aca-csv",
		positionId: "basetis-siebel",
		name: "ACA CSV",
		short: "aca csv",
		domain: "public",
		pillars: ["integration", "data"],
		summary: "Desarrollo Siebel del CRM para ACA CSV.",
		achievements: [],
		stack: ["Siebel", "Oracle PL/SQL"],
	},
	{
		id: "msupply",
		positionId: "basetis-msupply",
		name: "MSyupply",
		short: "msyupply",
		domain: "product",
		pillars: ["web", "integration", "lead", "data"],
		summary:
			"Producto con AngularJS, Redux y Sass sobre una capa de integración Mulesoft, con gestión de equipo y de cliente.",
		achievements: [
			"Gestión de equipo y planificación con Jira y Jenkins.",
			"Análisis funcional y trato directo con cliente.",
		],
		stack: ["AngularJS", "Redux", "Sass", "Mulesoft", "MySQL"],
	},
	{
		id: "ema",
		positionId: "basetis-ema",
		name: "EMA · mantenimiento de aplicaciones",
		short: "ema",
		domain: "product",
		pillars: ["web", "cloud"],
		summary:
			"Mantenimiento y evolución de aplicaciones sobre Amazon EC2.",
		achievements: [],
		stack: ["Amazon EC2"],
	},
	{
		id: "love-isdin-pro",
		positionId: "basetis-isdin-pro",
		name: "LoveISDIN Proyect",
		short: "loveisdin pro",
		domain: "health",
		pillars: ["web", "data"],
		summary:
			"Desarrollo full stack con Node.js, MySQL y React, y Redis para estado y caché.",
		achievements: [],
		stack: ["NodeJS", "MySQL", "ReactJS", "Redis"],
	},
	{
		id: "love-isdin",
		positionId: "basetis-lead",
		name: "LoveISDIN",
		short: "loveisdin",
		domain: "health",
		pillars: ["web", "cloud", "lead"],
		summary:
			"Plataforma de marca donde lideré el equipo técnico y los componentes críticos.",
		achievements: [
			"PRDs y análisis de viabilidad con negocio.",
			"Revisión de PRs y mentoría del equipo.",
		],
		stack: ["AWS", "NodeJS", "NextJS", "React"],
	},
	{
		id: "coleo",
		positionId: "quabu-architect",
		name: "Coleo",
		short: "coleo",
		start: "2024.01",
		end: "2024.03",
		domain: "product",
		pillars: ["micro", "cloud"],
		summary:
			"Producto donde diseñé la arquitectura y monté los microservicios que la sostienen.",
		achievements: [
			"Escalabilidad como requisito de diseño.",
			"Pipelines de CI/CD, QA gates e infraestructura cloud.",
		],
		stack: ["Microservicios", "Docker", "AWS"],
	},
	{
		id: "bodega-digital",
		positionId: "quabu-architect",
		name: "Bodega Digital",
		short: "bodega digital",
		start: "2024.03",
		end: "2025.02",
		domain: "agrifood",
		pillars: ["web", "mobile", "data", "integration", "robotics"],
		summary:
			"Herramienta de inventario de vino en tiempo real para bodegas y empresas vinícolas, financiada por el Ministerio de Industria y NextGenerationEU. Identificación de botellas por RFID, predicción de demanda con machine learning y trazabilidad, sobre un monolito monorepo con DDD y TDD.",
		achievements: [
			"Dos fases: RFID y predicción de demanda primero; visión por computadora después.",
			"Adaptadores para lectores RFID, visión artificial y el modelo de predicción, sin arrastrar al dominio.",
			"Frontend, backend y base de datos en un solo repositorio, con un único despliegue.",
			"Su estructura fue el punto de partida de Nakire TPS.",
		],
		stack: [
			"DDD",
			"TDD",
			"Monorepo",
			"SQL",
			"RFID",
			"IoT",
			"Machine Learning",
			"Computer Vision",
			"Blockchain",
			"Mobile",
		],
	},
	{
		id: "jira-addons",
		positionId: "quabu-architect",
		name: "Quabu Atlassian Addons",
		short: "atlassian addons",
		start: "2024.07",
		end: "2024.10",
		domain: "product",
		pillars: ["micro", "cloud"],
		summary:
			"Addons de Jira y del ecosistema Atlassian dentro de las herramientas de Quabu, desarrollados entre las dos fases de Bodega Digital y mantenidos de forma transversal.",
		achievements: [
			"Automatización de procesos operativos.",
			"Desarrollo transversal mientras avanzaban los demás proyectos de la etapa.",
		],
		stack: ["Jira", "Microservicios", "AWS"],
	},
	{
		id: "ondunova",
		positionId: "quabu-architect",
		name: "Ondunova",
		short: "ondunova",
		start: "2025.02",
		end: "2025.04",
		domain: "product",
		pillars: ["mobile", "integration", "robotics"],
		summary:
			"Actualización y ampliación de una app legacy: Flutter en el cliente, backend con ElysiaJS e integración de lectores y sensores.",
		achievements: [
			"Actualización de la app legacy y ampliación de su funcionalidad.",
			"Cliente en Flutter y backend con ElysiaJS.",
			"Integración de lectores y sensores.",
		],
		stack: ["Flutter", "Dart", "ElysiaJS", "Lectores y sensores"],
	},
	{
		id: "nakire-tps",
		positionId: "quabu-architect",
		name: "Nakire TPS",
		short: "nakire tps",
		start: "2025.04",
		end: "2026.06",
		domain: "logistics",
		pillars: ["data", "micro", "eda", "cloud", "robotics", "security"],
		summary:
			"Software distribuido para operaciones industriales en tiempo real: un microservicio por familia de dispositivo, un core de agentes que reparte tareas atómicas y comunicación asíncrona por eventos. Se desarrolló en dos fases.",
		achievements: [
			"Fase I: MVP de abril a julio de 2025.",
			"Fase II: de septiembre de 2025 a junio de 2026.",
			"Un microservicio por familia de dispositivo, con adaptadores por modelo, versión y protocolo.",
			"Core de agentes que ordena, prioriza y reparte tareas entre los dispositivos disponibles.",
			"Frontend reactivo por WebSocket con RBAC por rol y tipo de operador.",
			"Despliegue en Docker y Kubernetes sobre cloud bajo VPN, con QA gates sobre hardware real.",
		],
		stack: [
			"EDA",
			"DDD",
			"TDD",
			"Kafka",
			"Kubernetes",
			"Docker",
			"WebSocket",
			"PostgreSQL",
			"Redis",
			"AWS",
			"Azure",
		],
	},
	{
		id: "essentialist",
		positionId: "quabu-architect",
		name: "Essentialist",
		short: "essentialist",
		start: "2025.07",
		end: "2025.09",
		domain: "product",
		pillars: ["lead"],
		summary:
			"Liderazgo del equipo durante la baja del TechLead: análisis, spikes y revisión de PRs.",
		achievements: [
			"Cobertura del liderazgo técnico del equipo durante la baja del TechLead.",
			"Análisis funcional y técnico, spikes de investigación y revisión de PRs.",
		],
		stack: ["Technical Leadership"],
	},
	{
		id: "pachanga-community",
		positionId: "pachanga-own",
		name: "Pachanga Community",
		short: "pachanga",
		start: "2026.01",
		end: "2026.11",
		domain: "product",
		pillars: ["mobile", "web", "data", "cloud", "lead"],
		summary:
			"App de fútbol amateur con equipos, ligas, temporadas y valoraciones entre jugadores: React Native y Expo sobre hexagonal y DDD, con web en Ghost, enlaces universales y despliegue propio.",
		achievements: [
			"Arquitectura hexagonal con dominio puro en TypeScript y Zod, puertos y adaptadores.",
			"Sincronización local-first con Supabase y Drizzle, sin perfiles públicos indexados.",
			"Web en Ghost con el tema generado desde fuentes propias y tres idiomas.",
			"Enlaces universales iOS y Android, con fallback a tienda para quien no tiene la app.",
		],
		stack: [
			"React Native",
			"Expo",
			"TypeScript",
			"Supabase",
			"Drizzle",
			"Ghost",
			"Docker",
			"Traefik",
			"Dokploy",
			"Atomic Design",
		],
	},
	{
		id: "pachanga-engine",
		positionId: "pachanga-own",
		name: "Pachanga Engine",
		short: "engine",
		start: "2026.07",
		domain: "product",
		pillars: ["data", "integration"],
		summary:
			"Motor de visión por computadora que convierte el vídeo de un partido de fútbol en un MatchModel JSON canónico: detección, seguimiento y OCR por etapas, con una app web local para revisar el resultado.",
		achievements: [
			"Pipeline de puertos y adaptadores: cada etapa del análisis se sustituye sin tocar las demás.",
			"Detección con YOLO26 y seguimiento con ByteTrack; marcador y dorsales por OCR con PaddleOCR.",
			"Evidencia en espacio de píxel y de campo fusionada en un mismo registro de eventos, con calibración, trayectorias y mapas de calor.",
			"Puertas de calidad deterministas: cobertura al 100%, complejidad acotada y mutación sin supervivientes.",
		],
		stack: ["Python", "YOLO26", "ByteTrack", "PaddleOCR", "Pydantic"],
	},
];

export function resolvePositions(
	companies: Company[],
	positions: Position[],
): PositionView[] {
	return positions.map((position) => {
		const company = companies.find((item) => item.id === position.companyId);
		if (!company) {
			throw new Error(
				`position "${position.id}" points at unknown company "${position.companyId}"`,
			);
		}
		const startMonth = parseMonth(position.start);
		const endMonth = parseMonth(position.end) + 1;
		if (endMonth <= startMonth) {
			throw new Error(`position "${position.id}" ends before it starts`);
		}
		return {
			...position,
			company: company.name,
			companyShort: company.short,
			accent: company.accent,
			startMonth,
			endMonth,
			months: endMonth - startMonth,
		};
	});
}

/**
 * The export states the projects of each stint but not their dates, so the
 * undated ones are spread across the stint in the order they are written, one
 * after another, instead of all claiming the whole period. Pin a project with
 * `from`/`to` when its real dates are known.
 */
export function resolveProjects(
	positions: PositionView[],
	seeds: ProjectSeed[],
): Project[] {
	const byPosition = new Map<string, ProjectSeed[]>();
	for (const seed of seeds) {
		const group = byPosition.get(seed.positionId) ?? [];
		group.push(seed);
		byPosition.set(seed.positionId, group);
	}

	const spans = new Map<string, { startMonth: number; endMonth: number }>();

	for (const [positionId, group] of byPosition) {
		const position = positions.find((item) => item.id === positionId);
		if (!position) {
			throw new Error(
				`project "${group[0]?.id ?? positionId}" points at unknown position "${positionId}"`,
			);
		}

		const undated = group.filter((seed) => !seed.start && !seed.end);
		if (undated.length > 0) {
			const months = position.endMonth - position.startMonth;
			if (undated.length > months) {
				throw new Error(
					`position "${position.id}" has more undated projects than months`,
				);
			}
			const base = Math.floor(months / undated.length);
			const extra = months % undated.length;
			let cursor = position.startMonth;
			for (const [index, seed] of undated.entries()) {
				const size = base + (index < extra ? 1 : 0);
				spans.set(seed.id, { startMonth: cursor, endMonth: cursor + size });
				cursor += size;
			}
		}

		for (const seed of group) {
			if (!seed.start && !seed.end) continue;
			spans.set(seed.id, {
				startMonth: seed.start ? parseMonth(seed.start) : position.startMonth,
				endMonth: seed.end ? parseMonth(seed.end) + 1 : position.endMonth,
			});
		}
	}

	return seeds.map((seed) => {
		const position = positions.find((item) => item.id === seed.positionId);
		const span = spans.get(seed.id);
		if (!position) {
			throw new Error(
				`project "${seed.id}" points at unknown position "${seed.positionId}"`,
			);
		}
		if (!span) {
			throw new Error(`project "${seed.id}" has no resolved months`);
		}
		if (span.startMonth < position.startMonth || span.endMonth > position.endMonth) {
			throw new Error(`project "${seed.id}" leaves position "${position.id}"`);
		}
		if (span.endMonth <= span.startMonth) {
			throw new Error(`project "${seed.id}" ends before it starts`);
		}

		return {
			id: seed.id,
			positionId: seed.positionId,
			position: position.title,
			companyId: position.companyId,
			company: position.company,
			companyShort: position.companyShort,
			accent: position.accent,
			name: seed.name,
			short: seed.short,
			startMonth: span.startMonth,
			endMonth: span.endMonth,
			domain: seed.domain,
			pillars: seed.pillars,
			summary: seed.summary,
			achievements: seed.achievements,
			stack: seed.stack,
		};
	});
}

export const POSITION_VIEWS: PositionView[] = resolvePositions(
	COMPANIES,
	POSITIONS,
);

export const PROJECTS: Project[] = resolveProjects(
	POSITION_VIEWS,
	PROJECT_SEEDS,
);

/** The timeline runs from the first month worked to the current one. */
export const TODAY_MONTH = currentMonth();
export const FIRST_MONTH = Math.min(
	...POSITION_VIEWS.map((position) => position.startMonth),
);
export const LAST_MONTH = Math.max(
	...POSITION_VIEWS.map((position) => position.endMonth),
);
export const MONTH_RANGE = {
	from: FIRST_MONTH,
	to: Math.max(LAST_MONTH, TODAY_MONTH + 1),
};

/** Server-rendered label for the whole timeline. */
export const YEAR_LABEL = `${monthLabel(MONTH_RANGE.from)} — ${monthLabel(MONTH_RANGE.to - 1)}`;

export const STACK_GROUPS: { label: string; items: string[] }[] = [
	{
		label: "front",
		items: ["React", "React Native", "Next.js", "AngularJS", "Redux", "Sass"],
	},
	{
		label: "back",
		items: ["Node.js", "TypeScript", "Symfony", "ElysiaJS", "Mulesoft"],
	},
	{
		label: "datos",
		items: [
			"PostgreSQL",
			"MySQL",
			"Oracle PL/SQL",
			"MongoDB",
			"Redis",
			"Kafka",
		],
	},
	{
		label: "enterprise",
		items: ["Siebel CRM", "Velneo", "Delphi", "Jira", "Jenkins"],
	},
	{
		label: "prácticas",
		items: [
			"TDD",
			"BDD",
			"DDD",
			"Clean Arch",
			"Hexagonal",
			"Event Arch",
			"CI/CD",
		],
	},
	{
		label: "infra",
		items: ["AWS", "Amazon EC2", "Docker", "Kubernetes", "VPN", "SSE"],
	},
];

const stackItems = (label: string): string[] =>
	STACK_GROUPS.find((group) => group.label === label)?.items ?? [];

/** Las etiquetas del header y lo que revela cada una. Todo sale de `STACK_GROUPS` o de `EDUCATION`. */
export const EXPERTISE: { label: string; items: string[] }[] = [
	{ label: "EDA", items: ["Event Arch", "Kafka", "Mulesoft", "SSE"] },
	{ label: "DDD", items: ["Clean Arch", "Hexagonal", "Event Arch"] },
	{
		label: "IA",
		items: [
			"Desarrollo Agéntico",
			"Introducción a Machine Learning",
			"IA en Bodega Digital",
			"Visión por computadora",
		],
	},
	{ label: "TDD", items: ["BDD", "CI/CD", "Jenkins"] },
	{ label: "Design Patterns", items: ["Clean Arch", "Hexagonal", "Redux"] },
	{ label: "FE", items: stackItems("front") },
	{ label: "BE", items: stackItems("back") },
];

export const SOFT_SKILLS: string[] = [
	"Resiliente",
	"Autodidacta",
	"Autogestión del tiempo",
	"Comunicación activa",
	"Trabajo en equipo",
	"Enfoque en el outcome",
	"Curioso",
	"Diseño al fallo",
];

export const EDUCATION: Education[] = [
	{
		year: "2026",
		title: "Grado en Ing. Informática",
		org: "Universitat Oberta de Catalunya",
	},
	{
		year: "Actualidad",
		title: "Desarrollo Agéntico",
		org: "Canales oficiales de Anthropic, Google, OpenAI",
	},
	{
		year: "2021",
		title: "Desarrollo Seguro",
		org: "CyberAcademy",
	},
	{
		year: "2021",
		title: "Introducción a la Seguridad Informática",
		org: "Udemy Alumni",
	},
	{
		year: "2018",
		title: "ISTQB® Certified Tester, Foundation Level",
		org: "ISTQB Certification Institute · 18-CTFL-145497-09",
	},
	{
		year: "2018",
		title: "ITIL Foundation certificate in IT Service Management",
		org: "APMG International & AXELOS Global Best Practice",
	},
	{
		year: "2017",
		title: "Introducción a Machine Learning",
		org: "Universidad de Stanford — Coursera",
	},
];
