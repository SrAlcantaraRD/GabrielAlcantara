/**
 * Career data behind the trajectory matrix.
 *
 * Every fact comes from the published CV copy (src/pages/index.astro before the
 * restyle) and from docs/idea/prd_data_architecture_matrix_engine.md.
 *
 * Periods are the precise thing to edit: a role owns its years, and its projects
 * inherit them unless a project sets its own `startYear`/`endYear`. The timeline
 * range is derived from the roles, so extending a period widens the matrix.
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

export type Accent = "cobalt" | "sage" | "terracotta";

export interface Role {
	id: string;
	company: string;
	title: string;
	startYear: number;
	endYear: number;
	accent: Accent;
	/** One factual line about what this stage is about. */
	focus: string;
	summary: string;
	achievements: string[];
	/** Empty when the CV names the work but not the tooling. */
	stack: string[];
}

export interface ProjectSeed {
	id: string;
	roleId: string;
	project: string;
	/** Compact label used inside narrow timeline bars. */
	short: string;
	startYear?: number;
	endYear?: number;
	domain: Domain;
	pillars: Pillar[];
	summary: string;
	achievements: string[];
	stack?: string[];
}

export interface Project {
	id: string;
	roleId: string;
	company: string;
	role: string;
	project: string;
	short: string;
	startYear: number;
	endYear: number;
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

export const ROLES: Role[] = [
	{
		id: "acd",
		company: "ACD Sistemes SL",
		title: "Software Developer",
		startYear: 2011,
		endYear: 2017,
		accent: "terracotta",
		focus: "auditoría contable y gestión concursal",
		summary:
			"Participé en todas las fases del ciclo de vida del software y asumí progresivamente la responsabilidad técnica de varias soluciones web de la suite.",
		achievements: [
			"Todas las fases del ciclo de vida: análisis, desarrollo, implantación y soporte.",
			"Responsabilidad técnica progresiva sobre varias soluciones web.",
			"Implantación y despliegue en cliente en Brasil y Angola.",
		],
		stack: [],
	},
	{
		id: "basetis-fullstack",
		company: "BaseTIS S.L.",
		title: "Full Stack Developer",
		startYear: 2017,
		endYear: 2021,
		accent: "sage",
		focus: "producto web, mobile y desktop",
		summary:
			"Evolucioné a un perfil full stack participando en proyectos web, mobile y desktop, con componentes de IA aplicada, IoT y gamificación.",
		achievements: [
			"Desarrollo full stack de punta a punta.",
			"Componentes de IA aplicada, IoT y gamificación.",
			"Proyectos de sector público y de producto.",
		],
		stack: [],
	},
	{
		id: "basetis-lead",
		company: "BaseTIS S.L.",
		title: "Technical Team Lead",
		startYear: 2021,
		endYear: 2024,
		accent: "sage",
		focus: "liderazgo técnico, prds y seguridad",
		summary:
			"Lideré el equipo y el análisis de viabilidad de los requerimientos: definía las PRDs, revisaba las PRs, mentorizaba al equipo y desarrollaba los componentes más críticos del sistema.",
		achievements: [
			"PRDs y análisis de viabilidad de los requerimientos con negocio.",
			"Revisión de PRs y mentoría del equipo.",
			"Componentes críticos, con seguridad, rendimiento y escalabilidad como requisito.",
		],
		stack: ["OAuth2", "JWT", "API Gateway", "UML", "ITIL"],
	},
	{
		id: "quabu",
		company: "Quabu SL",
		title: "Solutions Architect",
		startYear: 2024,
		endYear: 2026,
		accent: "cobalt",
		focus: "eda + ddd + tdd sobre robótica industrial",
		summary:
			"Diseñé la arquitectura y monté los microservicios que la sostienen, con la escalabilidad como requisito de diseño, y orquesté la automatización de almacenes donde la IA vive en los propios procesos del sistema.",
		achievements: [
			"Arquitectura orientada a eventos para el sistema transaccional y la automatización de almacén.",
			"Microservicios contenerizados (Docker/Kubernetes) en AWS y Azure.",
			"Pipelines de CI/CD (Jenkins/Bitbucket) con QA gates y observabilidad.",
			"Persistencia heterogénea: time-series para métricas, PostgreSQL y Redis para transacciones.",
		],
		stack: ["EDA", "DDD", "TDD", "Kafka", "Kubernetes", "AWS", "Redis"],
	},
];

const PROJECT_SEEDS: ProjectSeed[] = [
	{
		id: "acd-auditor",
		roleId: "acd",
		project: "ACDAuditor",
		short: "auditor",
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
		id: "acd-concursal",
		roleId: "acd",
		project: "ACDConcursal Web",
		short: "concursal",
		domain: "financial",
		pillars: ["web", "data"],
		summary:
			"Solución web del producto de gestión concursal de ACD Sistemes.",
		achievements: [
			"Todas las fases del ciclo de vida: análisis, desarrollo, implantación y soporte.",
			"Responsabilidad técnica progresiva sobre la solución.",
		],
	},
	{
		id: "acd-circularizacion",
		roleId: "acd",
		project: "ACDCircularización Web",
		short: "circularización",
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
		roleId: "acd",
		project: "ACDImportador v2",
		short: "importador",
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
		roleId: "basetis-fullstack",
		project: "Shelter Gencat",
		short: "shelter",
		domain: "public",
		pillars: ["web"],
		summary:
			"Proyecto web para la Generalitat dentro de mi primera etapa en BaseTIS.",
		achievements: [
			"Desarrollo full stack de punta a punta.",
			"Proyecto para el sector público catalán.",
		],
	},
	{
		id: "aca-csv",
		roleId: "basetis-fullstack",
		project: "ACA CSV",
		short: "aca csv",
		domain: "public",
		pillars: ["web"],
		summary: "Proyecto web para el ACA dentro de la etapa full stack en BaseTIS.",
		achievements: [
			"Desarrollo full stack de punta a punta.",
			"Proyecto para el sector público catalán.",
		],
	},
	{
		id: "mambo-supply",
		roleId: "basetis-fullstack",
		project: "Mambo Supply",
		short: "mambo",
		domain: "product",
		pillars: ["web"],
		summary: "Producto digital dentro de la etapa full stack en BaseTIS.",
		achievements: ["Desarrollo full stack de punta a punta."],
	},
	{
		id: "ema",
		roleId: "basetis-fullstack",
		project: "EMA",
		short: "ema",
		domain: "product",
		pillars: ["web"],
		summary: "Producto digital dentro de la etapa full stack en BaseTIS.",
		achievements: ["Desarrollo full stack de punta a punta."],
	},
	{
		id: "love-isdin-pin",
		roleId: "basetis-lead",
		project: "Love ISDIN PIN",
		short: "love isdin pin",
		domain: "health",
		pillars: ["security", "micro", "lead"],
		summary:
			"Plataforma de marca para ISDIN donde lideré el equipo y el análisis de viabilidad, con seguridad, rendimiento y escalabilidad como requisito.",
		achievements: [
			"PRDs y análisis de viabilidad con negocio.",
			"Revisión de PRs y mentoría del equipo.",
			"Componentes críticos con seguridad desde el diseño.",
		],
		stack: ["OAuth2", "JWT", "API Gateway", "UML", "ITIL"],
	},
	{
		id: "bodega-digital",
		roleId: "quabu",
		project: "Bodega Digital",
		short: "bodega digital",
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
		roleId: "quabu",
		project: "Nakire TPS",
		short: "nakire tps",
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
		id: "coleo",
		roleId: "quabu",
		project: "Coleo",
		short: "coleo",
		domain: "product",
		pillars: ["micro", "cloud"],
		summary:
			"Producto donde diseñé la arquitectura y monté los microservicios que la sostienen, con la escalabilidad como requisito de diseño.",
		achievements: [
			"Arquitectura de microservicios con la escalabilidad como requisito de diseño.",
			"Pipelines de CI/CD (Jenkins/Bitbucket), QA gates e infraestructura cloud.",
		],
		stack: ["Microservicios", "Docker", "AWS", "CI/CD"],
	},
	{
		id: "jira-addons",
		roleId: "quabu",
		project: "Jira Addons",
		short: "jira addons",
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

/**
 * Resolves every project against its role: the role owns the company, the title
 * and the period, and a project only carries years when it needs its own.
 */
export function resolveProjects(
	roles: Role[],
	seeds: ProjectSeed[],
): Project[] {
	return seeds.map((seed) => {
		const role = roles.find((item) => item.id === seed.roleId);
		if (!role) {
			throw new Error(`project "${seed.id}" points at unknown role "${seed.roleId}"`);
		}

		const startYear = seed.startYear ?? role.startYear;
		const endYear = seed.endYear ?? role.endYear;

		if (startYear < role.startYear || endYear > role.endYear) {
			throw new Error(
				`project "${seed.id}" (${startYear}–${endYear}) leaves role "${role.id}" (${role.startYear}–${role.endYear})`,
			);
		}
		if (endYear < startYear) {
			throw new Error(`project "${seed.id}" ends before it starts`);
		}

		return {
			id: seed.id,
			roleId: seed.roleId,
			company: role.company,
			role: role.title,
			project: seed.project,
			short: seed.short,
			startYear,
			endYear,
			domain: seed.domain,
			pillars: seed.pillars,
			summary: seed.summary,
			achievements: seed.achievements,
			stack: seed.stack,
		};
	});
}

export const PROJECTS: Project[] = resolveProjects(ROLES, PROJECT_SEEDS);

export const MIN_YEAR = Math.min(...ROLES.map((role) => role.startYear));
export const MAX_YEAR = Math.max(...ROLES.map((role) => role.endYear));

export const YEAR_RANGE = { from: MIN_YEAR, to: MAX_YEAR };

export const STACK_GROUPS: { label: string; items: string[] }[] = [
	{
		label: "front",
		items: ["React", "React Native", "Next.js", "Flutter"],
	},
	{
		label: "back",
		items: ["Symfony", "ElysiaJS", "TypeScript", "Dart"],
	},
	{
		label: "datos",
		items: ["MySQL", "MongoDB", "PostgreSQL", "Redis"],
	},
	{
		label: "prácticas",
		items: [
			"TDD",
			"BDD",
			"DDD",
			"SDD",
			"Clean Arch",
			"Hexagonal",
			"Event Arch",
		],
	},
	{
		label: "infra",
		items: ["AWS Services", "Docker", "SSE", "JIRA", "Agile · Scrum"],
	},
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
