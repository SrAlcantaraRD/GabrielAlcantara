import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	COMPANIES,
	DOMAIN_LABEL,
	DOMAIN_ORDER,
	FIRST_MONTH,
	LAST_MONTH,
	MONTH_RANGE,
	PILLAR_LABEL,
	PILLAR_ORDER,
	POSITIONS,
	POSITION_VIEWS,
	PROJECTS,
	TODAY_MONTH,
	resolvePositions,
	resolveProjects,
	type Company,
	type Position,
	type Project,
	type ProjectSeed,
} from "../src/data/cv.ts";
import {
	axesAreValid,
	axisValues,
	barGeometry,
	cellBars,
	isAxisId,
	matchesValue,
	monthPct,
	packLanes,
	rowBars,
} from "../src/lib/matrix.ts";
import { parseMonth } from "../src/lib/period.ts";

const config = {
	pillar: PILLAR_LABEL,
	domain: DOMAIN_LABEL,
	pillarOrder: PILLAR_ORDER,
	domainOrder: DOMAIN_ORDER,
};

const projectById = (id: string) => {
	const project = PROJECTS.find((item) => item.id === id);
	assert.ok(project, `missing fixture project ${id}`);
	return project;
};

const positionById = (id: string) => {
	const position = POSITION_VIEWS.find((item) => item.id === id);
	assert.ok(position, `missing fixture position ${id}`);
	return position;
};

const month = parseMonth;

describe("axes", () => {
	it("rejects the same dimension on both axes and accepts distinct ones", () => {
		assert.equal(axesAreValid("time", "time"), false);
		assert.equal(axesAreValid("company", "position"), true);
		assert.equal(axesAreValid("pillar", "project"), true);
	});

	it("recognises only the offered dimensions", () => {
		assert.equal(isAxisId("position"), true);
		assert.equal(isAxisId("salary"), false);
	});

	it("keeps the time axis in years even though the data is monthly", () => {
		const values = axisValues("time", PROJECTS, config);
		assert.deepEqual(
			values.map((value) => value.id),
			Array.from({ length: 16 }, (_, index) => String(2011 + index)),
		);
	});

	it("lists companies by their first month", () => {
		const values = axisValues("company", PROJECTS, config);
		assert.deepEqual(
			values.map((value) => value.id),
			["acd", "basetis", "quabu", "pachanga"],
		);
		assert.deepEqual(
			values.map((value) => value.label),
			["ACD Sistemes SL", "Basetis", "Quabu Solutions", "Pachanga Community"],
		);
	});

	it("lists the fourteen positions, one per stint, oldest first", () => {
		const values = axisValues("position", PROJECTS, config);
		assert.equal(values.length, 14);
		assert.equal(values[0]?.id, "acd-junior");
		assert.equal(values.at(-1)?.id, "pachanga-own");
		const starts = values.map((value) => positionById(value.id).startMonth);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b));
	});

	it("disambiguates a title that repeats across stints", () => {
		const values = axisValues("position", PROJECTS, config);
		const labels = values.map((value) => value.label);
		assert.ok(labels.includes("Full Stack Developer · 2013"));
		assert.ok(labels.includes("Full Stack Developer · 2020"));
		assert.ok(labels.includes("Full Stack Developer · jul 2016"));
		assert.ok(labels.includes("Full Stack Developer · sep 2016"));
		assert.ok(labels.includes("Senior Technical Team Lead"));
		assert.equal(new Set(labels).size, labels.length);
	});

	it("only offers the values present inside the visible range", () => {
		const insideQuabu = { from: month("2025-01"), to: month("2026-01") };
		assert.deepEqual(
			axisValues("company", PROJECTS, config, insideQuabu).map((value) => value.id),
			["quabu"],
		);
		assert.deepEqual(
			axisValues("position", PROJECTS, config, insideQuabu).map((value) => value.id),
			["quabu-architect"],
		);
		assert.equal(axisValues("project", PROJECTS, config, insideQuabu).length, 4);
		assert.equal(axisValues("company", PROJECTS, config).length, 4);
	});

	it("offers only the domains and pillars the data actually uses", () => {
		const single = [projectById("nakire-tps")];
		assert.deepEqual(
			axisValues("pillar", single, config).map((value) => value.id),
			["data", "micro", "eda", "cloud", "robotics", "security"],
		);
		assert.deepEqual(
			axisValues("domain", single, config).map((value) => value.id),
			["logistics"],
		);

		const bodega = [projectById("bodega-digital")];
		assert.deepEqual(
			axisValues("pillar", bodega, config).map((value) => value.id),
			["web", "mobile", "data", "integration", "robotics"],
		);
		assert.deepEqual(
			axisValues("domain", bodega, config).map((value) => value.id),
			["agrifood"],
		);
	});
});

describe("matching", () => {
	it("matches a project on the months its position covers", () => {
		const project = projectById("shelter-gencat");
		assert.equal(project.startMonth, month("2017-08"));
		assert.equal(project.endMonth, month("2017-12") + 1);
		assert.equal(matchesValue(project, "time", "2017"), true);
		assert.equal(matchesValue(project, "time", "2018"), false);
		assert.equal(matchesValue(project, "time", "2016"), false);
	});

	it("matches company, position, project, domain and pillar by identity", () => {
		const project = projectById("love-isdin");
		assert.equal(matchesValue(project, "company", "basetis"), true);
		assert.equal(matchesValue(project, "company", "quabu"), false);
		assert.equal(matchesValue(project, "position", "basetis-lead"), true);
		assert.equal(matchesValue(project, "position", "basetis-ema"), false);
		assert.equal(matchesValue(project, "project", "love-isdin"), true);
		assert.equal(matchesValue(project, "domain", "health"), true);
		assert.equal(matchesValue(project, "pillar", "lead"), true);
		assert.equal(matchesValue(project, "pillar", "eda"), false);
	});
});

const fakeProject = (from: string, to: string): Project => ({
	id: "fake",
	positionId: "fake",
	position: "Fake",
	companyId: "fake",
	company: "Fake",
	companyShort: "fake",
	accent: "cobalt",
	name: "Fake",
	short: "fake",
	startMonth: month(from),
	endMonth: month(to) + 1,
	domain: "product",
	pillars: ["web"],
	summary: "",
	achievements: [],
});

describe("bar geometry", () => {
	it("gives a three-month stint a quarter of a one-year window", () => {
		assert.deepEqual(
			barGeometry(fakeProject("2016-07", "2016-09"), month("2016-01"), month("2017-01")),
			{ leftPct: 50, widthPct: 25 },
		);
	});

	it("covers the whole track when the project spans it", () => {
		assert.deepEqual(
			barGeometry(fakeProject("2024-01", "2026-08"), month("2024-01"), month("2026-09")),
			{ leftPct: 0, widthPct: 100 },
		);
	});

	it("returns nothing when project and track do not intersect", () => {
		assert.equal(
			barGeometry(fakeProject("2024-01", "2026-08"), month("2011-01"), month("2022-01")),
			null,
		);
		assert.equal(
			barGeometry(fakeProject("2016-07", "2016-09"), month("2024-01"), month("2026-01")),
			null,
		);
	});

	it("maps months to the same scale the bars use", () => {
		const range = { from: month("2011-12"), to: month("2026-12") };
		assert.equal(monthPct(range.from, range), 0);
		assert.equal(monthPct(range.to, range), 100);
		assert.equal(monthPct(month("2019-06"), range), 50);
	});
});

describe("matrix cells", () => {
	it("keeps only the projects at the crossing of both axes", () => {
		assert.deepEqual(
			cellBars(PROJECTS, "company", "quabu", "project", "coleo").map(
				(bar) => bar.id,
			),
			["coleo"],
		);
		assert.deepEqual(cellBars(PROJECTS, "company", "acd", "project", "coleo"), []);
		assert.deepEqual(
			cellBars(PROJECTS, "company", "basetis", "domain", "health").map(
				(bar) => bar.id,
			),
			["love-isdin-pro", "love-isdin"],
		);
		assert.deepEqual(cellBars(PROJECTS, "company", "acd", "pillar", "eda"), []);
	});

	it("crosses a position with its projects", () => {
		assert.deepEqual(
			cellBars(PROJECTS, "position", "quabu-architect", "project", "coleo").map(
				(bar) => bar.id,
			),
			["coleo"],
		);
		assert.deepEqual(
			cellBars(PROJECTS, "position", "basetis-lead", "project", "coleo"),
			[],
		);
	});

	it("clips a year cell to the months each project was alive", () => {
		const bars = cellBars(PROJECTS, "time", "2018", "company", "basetis");
		assert.deepEqual(
			bars.map((bar) => bar.id),
			["aca-csv", "msupply"],
		);
		assert.deepEqual(
			bars.map((bar) => [bar.leftPct, bar.widthPct]),
			[
				[0, 50],
				[41.67, 58.33],
			],
		);
	});

	it("builds a timeline row with every project on one Y value", () => {
		assert.deepEqual(
			rowBars(PROJECTS, "position", "quabu-architect")
				.map((bar) => bar.id)
				.sort(),
			[
				"bodega-digital",
				"coleo",
				"essentialist",
				"jira-addons",
				"nakire-tps",
				"ondunova",
			],
		);
		assert.equal(rowBars(PROJECTS, "company", "basetis").length, 6);
		assert.deepEqual(
			rowBars(PROJECTS, "pillar", "eda")
				.map((bar) => bar.id)
				.sort(),
			["nakire-tps"],
		);
	});
});

describe("periods", () => {
	it("runs the timeline from the first month worked to the present", () => {
		assert.equal(MONTH_RANGE.from, FIRST_MONTH);
		assert.equal(FIRST_MONTH, month("2011-12"));
		assert.equal(LAST_MONTH, month("2026-11") + 1);
		assert.equal(MONTH_RANGE.to, Math.max(LAST_MONTH, TODAY_MONTH + 1));
		assert.ok(MONTH_RANGE.to > MONTH_RANGE.from);
	});

	it("keeps the authored durations of the source data", () => {
		const durations = Object.fromEntries(
			POSITION_VIEWS.map((position) => [position.id, position.months]),
		);
		assert.equal(durations["quabu-architect"], 32);
		assert.equal(durations["basetis-lead"], 38);
		assert.equal(durations["basetis-msupply"], 17);
		assert.equal(durations["acd-junior"], 22);
		assert.equal(durations["acd-charts"], 3);
	});

	it("keeps every project inside the months of its position", () => {
		for (const project of PROJECTS) {
			const position = positionById(project.positionId);
			assert.equal(project.companyId, position.companyId);
			assert.equal(project.company, position.company);
			assert.equal(project.position, position.title);
			assert.ok(project.startMonth >= position.startMonth);
			assert.ok(project.endMonth <= position.endMonth);
			assert.ok(project.endMonth > project.startMonth);
		}
	});

	it("spreads the undated projects of a stint one after another", () => {
		const junior = [
			"fazenda-sao-paulo",
			"acd-importador",
			"acd-auditor-delphi",
			"acd-auditor-charts",
		].map(projectById);
		assert.deepEqual(
			junior.map((project) => [project.startMonth, project.endMonth]),
			[
				[month("2011-12"), month("2012-06")],
				[month("2012-06"), month("2012-12")],
				[month("2012-12"), month("2013-05")],
				[month("2013-05"), month("2013-09") + 1],
			],
		);
		const covered = junior.reduce(
			(sum, project) => sum + (project.endMonth - project.startMonth),
			0,
		);
		assert.equal(covered, positionById("acd-junior").months);
	});

	it("keeps a project pinned to its own dates", () => {
		const bodega = projectById("bodega-digital");
		assert.deepEqual(
			[bodega.startMonth, bodega.endMonth],
			[month("2024-03"), month("2025-02") + 1],
		);
	});

	it("lets a project carry its own months inside the position", () => {
		const companies: Company[] = [
			{ id: "c", name: "C", short: "c", accent: "cobalt" },
		];
		const positions: Position[] = [
			{
				id: "p",
				companyId: "c",
				title: "T",
				start: "2020.01",
				end: "2020.12",
				focus: "",
				summary: "",
				achievements: [],
				stack: [],
			},
		];
		const seeds: ProjectSeed[] = [
			{
				id: "x",
				positionId: "p",
				name: "X",
				short: "x",
				start: "2020.03",
				end: "2020.05",
				domain: "product",
				pillars: ["web"],
				summary: "",
				achievements: [],
			},
		];
		const [view] = resolvePositions(companies, positions);
		assert.ok(view);
		const [project] = resolveProjects([view], seeds);
		assert.ok(project);
		assert.equal(project.startMonth, month("2020-03"));
		assert.equal(project.endMonth, month("2020-05") + 1);
		assert.equal(project.company, "C");
	});

	it("refuses positions and projects that do not add up", () => {
		const companies: Company[] = [
			{ id: "c", name: "C", short: "c", accent: "cobalt" },
		];
		const base: Position = {
			id: "p",
			companyId: "c",
			title: "T",
			start: "2020.01",
			end: "2020.12",
			focus: "",
			summary: "",
			achievements: [],
			stack: [],
		};
		assert.throws(
			() => resolvePositions(companies, [{ ...base, companyId: "nope" }]),
			/unknown company/,
		);
		assert.throws(
			() => resolvePositions(companies, [{ ...base, end: "2019.12" }]),
			/ends before it starts/,
		);

		const [view] = resolvePositions(companies, [base]);
		assert.ok(view);
		const seed: ProjectSeed = {
			id: "x",
			positionId: "p",
			name: "X",
			short: "x",
			start: "2020.03",
			end: "2025.05",
			domain: "product",
			pillars: ["web"],
			summary: "",
			achievements: [],
		};
		assert.throws(() => resolveProjects([view], [seed]), /leaves position/);
		assert.throws(
			() => resolveProjects([view], [{ ...seed, positionId: "nope" }]),
			/unknown position/,
		);
	});

	it("keeps every authored position reachable", () => {
		assert.equal(POSITIONS.length, 14);
		assert.equal(COMPANIES.length, 4);
		assert.equal(PROJECTS.length, 25);
	});
});

describe("lane packing", () => {
	it("gives overlapping intervals their own lane and shares free ones", () => {
		const lanes = packLanes([
			{ startMonth: month("2011-01"), endMonth: month("2017-01") },
			{ startMonth: month("2011-01"), endMonth: month("2017-01") },
			{ startMonth: month("2017-01"), endMonth: month("2021-01") },
		]);
		assert.deepEqual(lanes, [0, 1, 0]);
	});
});
