/**
 * Questions rendered on `/services` and published as `FAQPage`.
 *
 * One source for the visible section and the structured data, so the answer a
 * machine reads can never disagree with what a visitor sees. Every answer is
 * composed from facts already published in this repository: no prices, no
 * durations, no availability beyond `SITE.availability`.
 */
import { STACK_GROUPS } from "./cv.ts";
import { SITE } from "./site.ts";

export interface FaqEntry {
	question: string;
	answer: string;
}

const stackOf = (label: string): string =>
	STACK_GROUPS.find((group) => group.label === label)?.items.join(", ") ?? "";

/** `Barcelona · remoto` is a UI label; in prose the separator becomes a clause. */
const location = SITE.location.split(" · ").join(", en ");

export const FAQ: FaqEntry[] = [
	{
		question: "¿Estás disponible para un proyecto nuevo?",
		answer: `Sí, estoy ${SITE.availability.toLowerCase()}. Trabajo desde ${location}.`,
	},
	{
		question: "¿Qué tipo de problemas resuelves?",
		answer:
			"Revisión de arquitectura, diseño de sistemas distribuidos, modernización de plataformas e integraciones entre sistemas. También trabajo junto a equipos: revisión de PRs, decisiones de arquitectura y contexto compartido.",
	},
	{
		question: "¿Trabajas en remoto?",
		answer: "Sí. Trabajo en remoto desde Barcelona.",
	},
	{
		question: "¿Colaboras con un equipo que ya existe?",
		answer:
			"Sí. No trabajo como una agencia: prefiero pocas colaboraciones donde pueda implicarme en las decisiones y en la ejecución, revisar PRs, escribir código con el equipo y compartir contexto.",
	},
	{
		question: "¿Con qué stack trabajas?",
		answer: `En backend, ${stackOf("back")}. En frontend, ${stackOf("front")}. En datos, ${stackOf("datos")}. En infraestructura, ${stackOf("infra")}. En métodos y testing, ${stackOf("prácticas")}.`,
	},
	{
		question: "¿Cómo empieza una colaboración?",
		answer: "Empiezo por entender el contexto, las restricciones y el resultado que se necesita. Después propongo alternativas y explico sus compromisos. Por último ayudo a convertir la decisión en pasos concretos.",
	},
	{
		question: "¿Cómo te contacto?",
		answer: `Puedes escribirme a ${SITE.email}. Cuéntame qué está pasando, en qué fase está el proyecto y qué tipo de ayuda necesitas. Con eso puedo decirte si aporto valor y cómo lo abordaría.`,
	},
];
