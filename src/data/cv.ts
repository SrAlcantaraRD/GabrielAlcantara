/**
 * Career dataset behind the experience matrix.
 *
 * Every fact here is derived from the CV copy already published on the site
 * (src/pages/index.astro) and from docs/idea/prd_data_architecture_matrix_engine.md.
 * `startYear`/`endYear` are the precision the CV states: the tenure of each role.
 */

export type Pillar =
	| "web"
	| "micro"
	| "eda"
	| "cloud"
	| "data"
	| "robotics"
	| "security"
	| "lead";

export type Domain = "financial" | "public" | "product" | "health" | "logistics";

export interface Project {
	id: string;
	company: string;
	role: string;
	project: string;
	/** Compact label used inside narrow timeline bars. */
	short: string;
	startYear: number;
	endYear: number;
	domain: Domain;
	pillars: Pillar[];
	summary: string;
	achievements: string[];
	/** Omitted when the CV only names the project. */
	stack?: string[];
}

export const MIN_YEAR = 2011;
export const MAX_YEAR = 2026;

export const PILLAR_LABEL: Record<Pillar, string> = {
	web: "web y desktop",
	micro: "microservicios y apis",
	eda: "eventos (eda)",
	cloud: "cloud y ci/cd",
	data: "datos y persistencia",
	robotics: "iot y robótica",
	security: "seguridad y calidad",
	lead: "liderazgo técnico",
};

export const DOMAIN_LABEL: Record<Domain, string> = {
	financial: "plataforma financiera y concursal",
	public: "sector público",
	product: "producto web y mobile",
	health: "salud y marca",
	logistics: "logística y automatización",
};

export const PILLAR_ORDER: Pillar[] = [
	"web",
	"micro",
	"eda",
	"cloud",
	"data",
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
];

const STAGE_NOTE =
	"Etapa full stack: proyectos web, mobile y desktop, con IA aplicada, IoT y gamificación.";

export const PROJECTS: Project[] = [
	{
		id: "acd-concursal",
		company: "ACD Sistemes SL",
		role: "Software Developer",
		project: "ACDConcursal Web",
		short: "concursal",
		startYear: 2011,
		endYear: 2017,
		domain: "financial",
		pillars: ["web", "data"],
		summary:
			"Solución web del producto de gestión concursal de ACD Sistemes. Entré participando en todas las fases del ciclo de vida del software y fui asumiendo la responsabilidad técnica de varias de las soluciones web.",
		achievements: [
			"Todas las fases del ciclo de vida: análisis, desarrollo, implantación y soporte.",
			"Responsabilidad técnica progresiva sobre varias soluciones web de la suite.",
		],
	},
	{
		id: "acd-auditor",
		company: "ACD Sistemes SL",
		role: "Software Developer",
		project: "ACDAuditor",
		short: "auditor",
		startYear: 2011,
		endYear: 2017,
		domain: "financial",
		pillars: ["data", "web"],
		summary:
			"Herramienta de auditoría contable del producto de ACD, implantada en instituciones públicas.",
		achievements: [
			"Implantación y despliegue en cliente en Brasil y Angola.",
			"Puesta en marcha trabajando hombro con hombro con el usuario final.",
		],
	},
	{
		id: "acd-circularizacion",
		company: "ACD Sistemes SL",
		role: "Software Developer",
		project: "ACDCircularización Web",
		short: "circularización",
		startYear: 2011,
		endYear: 2017,
		domain: "financial",
		pillars: ["web", "data"],
		summary:
			"Solución web para el proceso de circularización dentro de la suite de auditoría contable.",
		achievements: [
			"Desarrollo web dentro de la suite de auditoría.",
			"Responsabilidad técnica progresiva sobre la solución.",
		],
	},
	{
		id: "acd-importador",
		company: "ACD Sistemes SL",
		role: "Software Developer",
		project: "ACDImportador v2",
		short: "importador",
		startYear: 2011,
		endYear: 2017,
		domain: "financial",
		pillars: ["data"],
		summary:
			"Importador de datos contables que alimenta al resto de la suite de auditoría.",
		achievements: [
			"Segunda versión del importador de datos contables.",
			"Integración con el resto de soluciones de la suite.",
		],
	},
	{
		id: "shelter-gencat",
		company: "BaseTIS S.L.",
		role: "Full Stack Developer",
		project: "Shelter Gencat",
		short: "shelter",
		startYear: 2017,
		endYear: 2021,
		domain: "public",
		pillars: ["web"],
		summary:
			"Proyecto web para la Generalitat dentro de mi primera etapa en BaseTIS, donde pasé de developer a full stack.",
		achievements: [
			"Desarrollo full stack de punta a punta.",
			STAGE_NOTE,
		],
	},
	{
		id: "aca-csv",
		company: "BaseTIS S.L.",
		role: "Full Stack Developer",
		project: "ACA CSV",
		short: "aca csv",
		startYear: 2017,
		endYear: 2021,
		domain: "public",
		pillars: ["web"],
		summary: "Proyecto web para el ACA dentro de la etapa full stack en BaseTIS.",
		achievements: ["Desarrollo full stack de punta a punta.", STAGE_NOTE],
	},
	{
		id: "mambo-supply",
		company: "BaseTIS S.L.",
		role: "Full Stack Developer",
		project: "Mambo Supply",
		short: "mambo",
		startYear: 2017,
		endYear: 2021,
		domain: "product",
		pillars: ["web"],
		summary: "Producto digital dentro de la etapa full stack en BaseTIS.",
		achievements: ["Desarrollo full stack de punta a punta.", STAGE_NOTE],
	},
	{
		id: "ema",
		company: "BaseTIS S.L.",
		role: "Full Stack Developer",
		project: "EMA",
		short: "ema",
		startYear: 2017,
		endYear: 2021,
		domain: "product",
		pillars: ["web"],
		summary: "Producto digital dentro de la etapa full stack en BaseTIS.",
		achievements: ["Desarrollo full stack de punta a punta.", STAGE_NOTE],
	},
	{
		id: "love-isdin-pin",
		company: "BaseTIS S.L.",
		role: "Technical Team Lead",
		project: "Love ISDIN PIN",
		short: "love isdin pin",
		startYear: 2021,
		endYear: 2024,
		domain: "health",
		pillars: ["security", "micro", "lead"],
		summary:
			"Lideré el equipo y el análisis de viabilidad de los requerimientos: definía las PRDs, revisaba las PRs, mentorizaba al equipo y desarrollaba los componentes más críticos del sistema, donde la seguridad, el rendimiento y la escalabilidad no se negociaban.",
		achievements: [
			"PRDs y análisis de viabilidad con negocio.",
			"Revisión de PRs y mentoría del equipo.",
			"Desarrollo de los componentes críticos del sistema.",
		],
		stack: ["OAuth2", "JWT", "API Gateway", "UML", "ITIL"],
	},
	{
		id: "coleo",
		company: "Quabu SL",
		role: "Solutions Architect",
		project: "Coleo",
		short: "coleo",
		startYear: 2024,
		endYear: 2026,
		domain: "product",
		pillars: ["micro", "cloud"],
		summary:
			"Diseñé la arquitectura y monté los microservicios que la sostienen, con la escalabilidad como requisito de diseño.",
		achievements: [
			"Arquitectura de microservicios con la escalabilidad como requisito de diseño.",
			"Pipelines de CI/CD (Jenkins/Bitbucket), QA gates e infraestructura cloud.",
		],
		stack: ["Microservicios", "Docker", "AWS", "CI/CD"],
	},
	{
		id: "bodega-digital",
		company: "Quabu SL",
		role: "Solutions Architect",
		project: "Bodega Digital",
		short: "bodega digital",
		startYear: 2024,
		endYear: 2026,
		domain: "logistics",
		pillars: ["eda", "robotics", "cloud", "data"],
		summary:
			"Arquitectura por eventos (EDA + DDD + TDD) para la automatización de almacenes con robots, PLC, LEDs y sonidos, donde la IA no solo vive en el desarrollo, sino en los propios procesos del sistema: priorizar tareas y ejecutarlas, como mover un pallet de x1,y1,z1 a x2,y2,z2.",
		achievements: [
			"Arquitectura orientada a eventos con DDD y TDD como base del diseño.",
			"Orquestación de robots, PLC, LEDs y sonidos desde los procesos del sistema.",
			"IA dentro de los procesos: priorizar y ejecutar tareas de movimiento de pallets.",
		],
		stack: ["EDA", "DDD", "TDD", "Kafka", "Kubernetes"],
	},
	{
		id: "nakire-tps",
		company: "Quabu SL",
		role: "Solutions Architect",
		project: "Nakire TPS",
		short: "nakire tps",
		startYear: 2024,
		endYear: 2026,
		domain: "logistics",
		pillars: ["eda", "micro", "cloud", "data"],
		summary:
			"Diseño integral de la arquitectura del sistema transaccional, orquestando robótica en tiempo real y eventos de alto rendimiento.",
		achievements: [
			"EDA para la comunicación asíncrona con el middleware robótico.",
			"Microservicios contenerizados (Docker/Kubernetes) en AWS y Azure.",
			"Persistencia heterogénea: time-series para métricas, PostgreSQL y Redis para transacciones.",
			"QA gates y observabilidad dentro de los pipelines de CI/CD.",
		],
		stack: [
			"Kafka",
			"Microservicios",
			"Docker",
			"Kubernetes",
			"AWS",
			"Azure",
			"PostgreSQL",
			"Redis",
			"ElysiaJS",
		],
	},
	{
		id: "jira-addons",
		company: "Quabu SL",
		role: "Solutions Architect",
		project: "Jira Addons",
		short: "jira addons",
		startYear: 2024,
		endYear: 2026,
		domain: "product",
		pillars: ["micro", "cloud"],
		summary: "Addons de Jira dentro del ecosistema de herramientas de Quabu.",
		achievements: [
			"Extensiones sobre la plataforma Jira.",
			"Automatización de procesos operativos.",
		],
		stack: ["Jira", "Microservicios", "AWS"],
	},
];
