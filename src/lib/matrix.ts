import type { Domain, Pillar, Project } from "../data/cv";
import { monthLabel } from "./period.ts";

/**
 * The timeline is measured in months. The `time` axis still offers years, and
 * every year cell covers its twelve months, so a three-month stint renders at
 * its real width instead of snapping to a year.
 */
export interface MonthRange {
	from: number;
	to: number;
}

/** Only used when a caller omits the range; the site passes the data range. */
export const FALLBACK_RANGE: MonthRange = {
	from: 2011 * 12 + 11,
	to: 2027 * 12,
};

export type AxisId =
	| "time"
	| "company"
	| "position"
	| "project"
	| "domain"
	| "pillar";

export const AXIS_ORDER: AxisId[] = [
	"time",
	"company",
	"position",
	"project",
	"domain",
	"pillar",
];

export const AXIS_LABEL: Record<AxisId, string> = {
	time: "año",
	company: "empresa",
	position: "puesto",
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
	startMonth: number;
	endMonth: number;
	leftPct: number;
	widthPct: number;
}

export interface Geometry {
	leftPct: number;
	widthPct: number;
}

const round = (value: number): number => Number(value.toFixed(2));
const yearOf = (month: number): number => Math.floor(month / 12);

export function isAxisId(value: string): value is AxisId {
	return (AXIS_ORDER as string[]).includes(value);
}

/** Both axes answer different questions; the same dimension on both says nothing. */
export function axesAreValid(x: AxisId, y: AxisId): boolean {
	return x !== y;
}

export function monthPct(month: number, range: MonthRange = FALLBACK_RANGE): number {
	const span = range.to - range.from;
	if (span <= 0) return 0;
	return round(((month - range.from) / span) * 100);
}

function overlapsRange(project: Project, range: MonthRange): boolean {
	return project.startMonth < range.to && project.endMonth > range.from;
}

export function axisValues(
	axis: AxisId,
	projects: Project[],
	config: AxisConfig,
	range: MonthRange = FALLBACK_RANGE,
): AxisValue[] {
	if (axis !== "time") {
		const visible = projects.filter((project) =>
			overlapsRange(project, range),
		);
		if (visible.length > 0 && visible.length < projects.length) {
			return axisValues(axis, visible, config, range);
		}
	}

	switch (axis) {
		case "time": {
			const values: AxisValue[] = [];
			const firstYear = yearOf(range.from);
			const lastYear = yearOf(Math.max(range.from, range.to - 1));
			for (let year = firstYear; year <= lastYear; year += 1) {
				values.push({ id: String(year), label: String(year) });
			}
			return values;
		}
		case "company": {
			const firstMonth = new Map<string, number>();
			const names = new Map<string, string>();
			for (const project of projects) {
				const known = firstMonth.get(project.companyId);
				if (known === undefined || project.startMonth < known) {
					firstMonth.set(project.companyId, project.startMonth);
				}
				names.set(project.companyId, project.company);
			}
			return [...firstMonth.entries()]
				.sort(([, a], [, b]) => a - b)
				.map(([companyId]) => ({
					id: companyId,
					label: names.get(companyId) ?? companyId,
				}));
		}
		case "position": {
			const firstMonth = new Map<string, number>();
			const titles = new Map<string, string>();
			for (const project of projects) {
				const known = firstMonth.get(project.positionId);
				if (known === undefined || project.startMonth < known) {
					firstMonth.set(project.positionId, project.startMonth);
				}
				titles.set(project.positionId, project.position);
			}
			const repeats = new Map<string, number>();
			for (const title of titles.values()) {
				repeats.set(title, (repeats.get(title) ?? 0) + 1);
			}
			const ordered = [...firstMonth.entries()].sort(([, a], [, b]) => a - b);
			const labels = ordered.map(([positionId, first]) => {
				const title = titles.get(positionId) ?? positionId;
				if ((repeats.get(title) ?? 0) === 1) return title;
				return `${title} · ${yearOf(first)}`;
			});
			const clashes = new Map<string, number>();
			for (const label of labels) {
				clashes.set(label, (clashes.get(label) ?? 0) + 1);
			}
			return ordered.map(([positionId, first], index) => {
				const label = labels[index] ?? positionId;
				if ((clashes.get(label) ?? 0) === 1) return { id: positionId, label };
				const title = titles.get(positionId) ?? positionId;
				return { id: positionId, label: `${title} · ${monthLabel(first)}` };
			});
		}
		case "project":
			return [...projects]
				.sort(
					(a, b) =>
						a.startMonth - b.startMonth ||
						a.endMonth - b.endMonth ||
						a.name.localeCompare(b.name),
				)
				.map((project) => ({ id: project.id, label: project.name }));
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
			const from = Number(value) * 12;
			return project.startMonth < from + 12 && project.endMonth > from;
		}
		case "company":
			return project.companyId === value;
		case "position":
			return project.positionId === value;
		case "project":
			return project.id === value;
		case "domain":
			return project.domain === value;
		case "pillar":
			return project.pillars.includes(value as Pillar);
	}
}

/**
 * Horizontal span of one column or row, in months. A time cell covers a whole
 * year, which reads as "filled" for every project alive that year.
 */
export function trackBounds(
	axis: AxisId,
	value: string,
	range: MonthRange = FALLBACK_RANGE,
): MonthRange {
	if (axis === "time") {
		const from = Number(value) * 12;
		return { from, to: from + 12 };
	}
	return { from: range.from, to: range.to };
}

export function barGeometry(
	project: Project,
	from: number,
	to: number,
): Geometry | null {
	const start = Math.max(project.startMonth, from);
	const end = Math.min(project.endMonth, to);
	if (end <= start) return null;
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
	range: MonthRange = FALLBACK_RANGE,
): Bar[] {
	const bounds = trackBounds(xAxis, xValue, range);
	return toBars(
		projects.filter(
			(project) =>
				matchesValue(project, xAxis, xValue) &&
				matchesValue(project, yAxis, yValue),
		),
		bounds.from,
		bounds.to,
	);
}

/** One row of the timeline mode: every project on a Y value, over the range. */
export function rowBars(
	projects: Project[],
	yAxis: AxisId,
	yValue: string,
	range: MonthRange = FALLBACK_RANGE,
): Bar[] {
	return toBars(
		projects.filter((project) => matchesValue(project, yAxis, yValue)),
		range.from,
		range.to,
	);
}

function toBars(projects: Project[], from: number, to: number): Bar[] {
	return projects
		.sort(
			(a, b) =>
				a.startMonth - b.startMonth ||
				a.endMonth - b.endMonth ||
				a.name.localeCompare(b.name),
		)
		.flatMap((project) => {
			const geometry = barGeometry(project, from, to);
			return geometry
				? [
						{
							id: project.id,
							startMonth: project.startMonth,
							endMonth: project.endMonth,
							...geometry,
						},
					]
				: [];
		});
}

/** Assigns each interval the first lane where it does not overlap its neighbour. */
export function packLanes(
	intervals: { startMonth: number; endMonth: number }[],
): number[] {
	const lastEndPerLane: number[] = [];
	const ordered = intervals
		.map((interval, index) => ({ interval, index }))
		.sort(
			(a, b) =>
				a.interval.startMonth - b.interval.startMonth ||
				b.interval.endMonth - a.interval.endMonth ||
				a.index - b.index,
		);

	const lanes = new Array<number>(intervals.length).fill(0);
	for (const { interval, index } of ordered) {
		const free = lastEndPerLane.findIndex((end) => end <= interval.startMonth);
		if (free === -1) {
			lanes[index] = lastEndPerLane.length;
			lastEndPerLane.push(interval.endMonth);
		} else {
			lanes[index] = free;
			lastEndPerLane[free] = interval.endMonth;
		}
	}
	return lanes;
}
