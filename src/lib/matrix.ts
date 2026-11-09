import type { Domain, Pillar, Project } from "../data/cv";

export const MIN_YEAR = 2011;
export const MAX_YEAR = 2026;

export type AxisId = "time" | "company" | "project" | "domain" | "pillar";

export const AXIS_ORDER: AxisId[] = [
	"time",
	"company",
	"project",
	"domain",
	"pillar",
];

export const AXIS_LABEL: Record<AxisId, string> = {
	time: "año",
	company: "empresa",
	project: "proyecto",
	domain: "dominio",
	pillar: "pilar técnico",
};

export interface AxisValue {
	id: string;
	label: string;
}

export interface AxisConfig {
	pillar: Record<Pillar, string>;
	domain: Record<Domain, string>;
	pillarOrder: Pillar[];
	domainOrder: Domain[];
}

export interface Bar {
	id: string;
	startYear: number;
	endYear: number;
	leftPct: number;
	widthPct: number;
}

export interface Geometry {
	leftPct: number;
	widthPct: number;
}

const round = (value: number): number => Number(value.toFixed(2));

export function isAxisId(value: string): value is AxisId {
	return (AXIS_ORDER as string[]).includes(value);
}

/** Both axes answer different questions; the same dimension on both says nothing. */
export function axesAreValid(x: AxisId, y: AxisId): boolean {
	return x !== y;
}

export function yearPct(year: number): number {
	return round(((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100);
}

export function axisValues(
	axis: AxisId,
	projects: Project[],
	config: AxisConfig,
): AxisValue[] {
	switch (axis) {
		case "time": {
			const values: AxisValue[] = [];
			for (let year = MIN_YEAR; year <= MAX_YEAR; year += 1) {
				values.push({ id: String(year), label: String(year) });
			}
			return values;
		}
		case "company": {
			const firstYear = new Map<string, number>();
			for (const project of projects) {
				const known = firstYear.get(project.company);
				if (known === undefined || project.startYear < known) {
					firstYear.set(project.company, project.startYear);
				}
			}
			return [...firstYear.entries()]
				.sort(([a, aYear], [b, bYear]) => aYear - bYear || a.localeCompare(b))
				.map(([company]) => ({ id: company, label: company }));
		}
		case "project":
			return [...projects]
				.sort(
					(a, b) =>
						a.startYear - b.startYear ||
						a.endYear - b.endYear ||
						a.project.localeCompare(b.project),
				)
				.map((project) => ({ id: project.id, label: project.project }));
		case "domain":
			return config.domainOrder
				.filter((domain) => projects.some((item) => item.domain === domain))
				.map((domain) => ({ id: domain, label: config.domain[domain] }));
		case "pillar":
			return config.pillarOrder
				.filter((pillar) => projects.some((item) => item.pillars.includes(pillar)))
				.map((pillar) => ({ id: pillar, label: config.pillar[pillar] }));
	}
}

export function matchesValue(
	project: Project,
	axis: AxisId,
	value: string,
): boolean {
	switch (axis) {
		case "time": {
			const year = Number(value);
			return project.startYear <= year && project.endYear >= year;
		}
		case "company":
			return project.company === value;
		case "project":
			return project.id === value;
		case "domain":
			return project.domain === value;
		case "pillar":
			return project.pillars.includes(value as Pillar);
	}
}

/**
 * Horizontal span of one column or row, in years. A time cell covers a single
 * year, which reads as "filled" for every project alive that year.
 */
export function trackBounds(
	axis: AxisId,
	value: string,
): { from: number; to: number } {
	if (axis === "time") {
		const year = Number(value);
		return { from: year, to: year };
	}
	return { from: MIN_YEAR, to: MAX_YEAR };
}

export function barGeometry(
	project: Project,
	from: number,
	to: number,
): Geometry | null {
	const start = Math.max(project.startYear, from);
	const end = Math.min(project.endYear, to);
	if (end < start) return null;
	if (to === from) return { leftPct: 0, widthPct: 100 };
	return {
		leftPct: round(((start - from) / (to - from)) * 100),
		widthPct: round(((end - start) / (to - from)) * 100),
	};
}

export function cellBars(
	projects: Project[],
	xAxis: AxisId,
	xValue: string,
	yAxis: AxisId,
	yValue: string,
): Bar[] {
	const { from, to } = trackBounds(xAxis, xValue);
	return toBars(
		projects.filter(
			(project) =>
				matchesValue(project, xAxis, xValue) &&
				matchesValue(project, yAxis, yValue),
		),
		from,
		to,
	);
}

/** One row of the timeline mode: every project on a Y value, over the full range. */
export function rowBars(
	projects: Project[],
	yAxis: AxisId,
	yValue: string,
): Bar[] {
	return toBars(
		projects.filter((project) => matchesValue(project, yAxis, yValue)),
		MIN_YEAR,
		MAX_YEAR,
	);
}

function toBars(projects: Project[], from: number, to: number): Bar[] {
	return projects
		.sort(
			(a, b) =>
				a.startYear - b.startYear ||
				a.endYear - b.endYear ||
				a.project.localeCompare(b.project),
		)
		.flatMap((project) => {
			const geometry = barGeometry(project, from, to);
			return geometry
				? [
						{
							id: project.id,
							startYear: project.startYear,
							endYear: project.endYear,
							...geometry,
						},
					]
				: [];
		});
}

/** Assigns each interval the first lane where it does not overlap its neighbour. */
export function packLanes(
	intervals: { startYear: number; endYear: number }[],
): number[] {
	const lastEndPerLane: number[] = [];
	const ordered = intervals
		.map((interval, index) => ({ interval, index }))
		.sort(
			(a, b) =>
				a.interval.startYear - b.interval.startYear ||
				b.interval.endYear - a.interval.endYear ||
				a.index - b.index,
		);

	const lanes = new Array<number>(intervals.length).fill(0);
	for (const { interval, index } of ordered) {
		const free = lastEndPerLane.findIndex((end) => end <= interval.startYear);
		if (free === -1) {
			lanes[index] = lastEndPerLane.length;
			lastEndPerLane.push(interval.endYear);
		} else {
			lanes[index] = free;
			lastEndPerLane[free] = interval.endYear;
		}
	}
	return lanes;
}
