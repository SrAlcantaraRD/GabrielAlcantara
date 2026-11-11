/**
 * Curated portfolio layer on top of the career data.
 *
 * `cv.ts` owns dates, companies, roles and stacks. This file only adds the
 * narrative of each selected project: problem, personal role, key decision and
 * observable outcome. No metric is invented: when a number could not be
 * published, the outcome is described in terms of traceability, automation or
 * integration.
 */

import { PROJECTS, type Project } from "./cv.ts";

export interface CaseStudy {
	/** Must match an id in `PROJECTS`. */
	projectId: string;
	/** Short area label used on cards. */
	area: string;
	role: string;
	problem: string;
	decision: string;
	outcome: string;
	/** Extra evidence shown on the case-study page or the featured block. */
	highlights?: string[];
	/** One-line subtitle used by the social share cards. */
	tagline?: string;
	/** Full write-up, when one exists. */
	caseStudyHref?: string;
	featured?: boolean;
}

const CASES: CaseStudy[] = [
	{
		projectId: "nakire-tps",
		area: "Sistemas distribuidos",
		role: "Arquitecto de soluciones · diseño de arquitectura, dominios y servicios",
		problem:
			"Coordinar personas, software y dispositivos industriales —robots, PLC, LEDs, cámaras y sonido— dentro de una operación de almacén que debía ser trazable y capaz de evolucionar.",
		decision:
			"Separar el sistema en dominios y servicios con un core de agentes que ordena, prioriza y reparte tareas atómicas entre familias de dispositivos, cada una con adaptadores por modelo, versión y protocolo.",
		outcome:
			"Un sistema distribuido que conecta software y operación industrial con comunicación en tiempo real y trazabilidad de las tareas.",
		highlights: [
			"Cada familia de dispositivo es su propio microservicio: carretilla, PLC, LED, picking o cámara.",
			"Los adaptadores absorben modelo, versión y protocolo sin arrastrar al dominio.",
			"Frontend reactivo por WebSocket y RBAC: la interfaz se adapta al rol y al tipo de operador.",
		],
		caseStudyHref: "/projects/nakire-tps/",
		tagline:
			"Software distribuido para operaciones industriales en tiempo real.",
		featured: true,
	},
	{
		projectId: "bodega-digital",
		area: "Vino y agroalimentación",
		role: "Arquitecto de soluciones · arquitectura, modelado de dominio y desarrollo",
		problem:
			"Identificar y localizar cada botella en bodegas con miles de referencias parecidas —añada, variedad, parcela— y crianzas de hasta quince años.",
		decision:
			"Un monolito monorepo con DDD y TDD, con adaptadores para lectores RFID, visión por computadora y el modelo de predicción de demanda.",
		outcome:
			"Inventario en tiempo real, predicción de demanda y trazabilidad por botella. La forma de trabajar —dominio modelado, adaptadores por integración y pruebas primero— pasó a los proyectos siguientes.",
		highlights: [
			"Identificación individual por RFID (UHF) y predicción de demanda con machine learning.",
			"Adaptadores para RFID, visión por computadora y predicción: el dominio no conoce protocolos.",
			"Frontend, backend y base de datos versionados juntos, con un único despliegue.",
		],
		caseStudyHref: "/projects/bodega-digital/",
		tagline:
			"Inventario de vino en tiempo real con RFID y machine learning.",
	},

	{
		projectId: "pachanga-community",
		area: "Producto propio",
		role: "Arquitecto y desarrollador · producto completo",
		problem:
			"Organizar las pachangas de un grupo de fútbol acaba en un chat interminable: quién juega, cómo se reparten los equipos y qué pasó en el último partido.",
		decision:
			"Construir el producto entero: app móvil con arquitectura hexagonal sobre DDD y Atomic Design, web en Ghost con tres idiomas y enlaces universales, con despliegue y soporte propios.",
		outcome:
			"Una app publicada en App Store y Play Store, con su web, sus enlaces universales y su canal de soporte, sostenida por una sola persona.",
		highlights: [
			"Dominio puro en TypeScript y Zod; Supabase y Drizzle detrás de puertos y adaptadores.",
			"Web en Ghost con el tema generado desde fuentes propias y tres idiomas.",
			"AASA y assetlinks para que los enlaces abran la app, con fallback a tienda si no está.",
		],
		caseStudyHref: "/projects/pachanga-community/",
		tagline: "App y web de fútbol amateur, de principio a fin.",
	},
	{
		projectId: "love-isdin",
		area: "Producto digital · salud",
		role: "Senior Technical Team Lead",
		problem:
			"Una plataforma de marca donde los requisitos de seguridad, rendimiento y escalabilidad crecían con el producto.",
		decision:
			"Definir PRDs y análisis de viabilidad con negocio, revisar PRs y asumir personalmente los componentes críticos sobre AWS, Node.js, Next.js y React.",
		outcome:
			"Un equipo con más autonomía y un criterio técnico compartido para las partes críticas del producto.",
	},
	{
		projectId: "msupply",
		area: "Producto digital",
		role: "Full Stack Developer · gestión de equipo",
		problem:
			"Un producto con varios frentes a la vez: desarrollo, integración con Mulesoft y un cliente que necesitaba respuestas rápidas.",
		decision:
			"Asumir análisis funcional y planificación con Jira y Jenkins además del desarrollo, para que decisiones, alcance y entrega compartieran el mismo contexto.",
		outcome:
			"Un producto entregado con un canal directo con el cliente y visibilidad del trabajo del equipo.",
	},
	{
		projectId: "coleo",
		area: "Microservicios",
		role: "Arquitecto de soluciones",
		problem:
			"Un producto nuevo que debía nacer con escalabilidad como requisito, no como reacción.",
		decision:
			"Diseñar la arquitectura y montar los microservicios que la sostienen, con CI/CD y QA gates desde el inicio.",
		outcome:
			"Una plataforma preparada para crecer por servicios, con despliegue automatizado.",
	},
	{
		projectId: "acd-concursal-web",
		area: "Plataforma financiera",
		role: "Full Stack Developer",
		problem:
			"La gestión concursal del producto ACD dependía de herramientas difíciles de extender y de compartir.",
		decision:
			"Construir la solución web completa —concursal y circularización— asumiendo responsabilidad técnica progresiva sobre ella.",
		outcome:
			"Una suite web que dio continuidad al producto y sirvió de base para los módulos siguientes.",
	},
	{
		projectId: "shelter-gencat",
		area: "Sector público",
		role: "Web Software Developer",
		problem:
			"Un servicio público necesitaba una interfaz web y móvil con una entrega ya condicionada por su pipeline.",
		decision:
			"React y React Native sobre un pipeline Jenkins, manteniendo una sola forma de construir la interfaz.",
		outcome:
			"Una base compartida entre web y móvil para el servicio de la Generalitat.",
	},
];

export interface ProjectCase extends Project {
	area: string;
	role: string;
	problem: string;
	decision: string;
	outcome: string;
	highlights: string[];
	/** One-line subtitle used by the social share cards. */
	tagline?: string;
	caseStudyHref?: string;
	featured: boolean;
}

const caseById = new Map(CASES.map((item) => [item.projectId, item]));

const build = (item: CaseStudy): ProjectCase => {
	const project = PROJECTS.find((entry) => entry.id === item.projectId);
	if (!project) {
		throw new Error(
			`case study "${item.projectId}" does not match any project in cv.ts`,
		);
	}
	return {
		...project,
		area: item.area,
		role: item.role,
		problem: item.problem,
		decision: item.decision,
		outcome: item.outcome,
		highlights: item.highlights ?? [],
		tagline: item.tagline,
		caseStudyHref: item.caseStudyHref,
		featured: item.featured ?? false,
	};
};

export const PROJECT_CASES: ProjectCase[] = CASES.map(build);

export const FEATURED_CASE: ProjectCase = PROJECT_CASES.find(
	(item) => item.featured,
) as ProjectCase;

export const SELECTED_CASES: ProjectCase[] = PROJECT_CASES.filter(
	(item) => !item.featured,
);

/** Projects documented in `cv.ts` but not written up as a case study. */
export const OTHER_PROJECTS: Project[] = PROJECTS.filter(
	(project) => !caseById.has(project.id),
);

export function caseStudyOf(id: string): ProjectCase {
	const item = PROJECT_CASES.find((project) => project.id === id);
	if (!item) {
		throw new Error(`no case study for project "${id}"`);
	}
	return item;
}
