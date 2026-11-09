import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
	DOMAIN_LABEL,
	DOMAIN_ORDER,
	MAX_YEAR,
	MIN_YEAR,
	PILLAR_LABEL,
	PILLAR_ORDER,
	PROJECTS,
	ROLES,
	YEAR_RANGE,
	resolveProjects,
	type ProjectSeed,
	type Role,
} from "../src/data/cv.ts";
import {
	DEFAULT_RANGE,
	axesAreValid,
	axisValues,
	barGeometry,
	cellBars,
	isAxisId,
	matchesValue,
	packLanes,
	rowBars,
	yearPct,
} from "../src/lib/matrix.ts";

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

const role = (id: string) => {
	const found = ROLES.find((item) => item.id === id);
	assert.ok(found, `missing fixture role ${id}`);
	return found;
};

describe("axes", () => {
	it("rejects the same dimension on both axes and accepts distinct ones", () => {
		assert.equal(axesAreValid("time", "time"), false);
		assert.equal(axesAreValid("company", "project"), true);
		assert.equal(axesAreValid("pillar", "role"), true);
	});

	it("recognises only the offered dimensions", () => {
		assert.equal(isAxisId("role"), true);
		assert.equal(isAxisId("salary"), false);
	});

	it("expands the time axis into every year of the range", () => {
		const values = axisValues("time", PROJECTS, config);
		assert.equal(values.length, MAX_YEAR - MIN_YEAR + 1);
		assert.equal(values[0]?.id, String(MIN_YEAR));
		assert.equal(values.at(-1)?.id, String(MAX_YEAR));
		const years = values.map((value) => Number(value.id));
		assert.deepEqual(years, [...years].sort((a, b) => a - b));
	});

	it("lists companies once, oldest first", () => {
		const values = axisValues("company", PROJECTS, config);
		assert.deepEqual(
			values.map((value) => value.id),
			["ACD Sistemes SL", "BaseTIS S.L.", "Quabu SL"],
		);
	});

	it("lists one value per stage, oldest first", () => {
		const values = axisValues("role", PROJECTS, config);
		assert.deepEqual(
			values.map((value) => value.id),
			["acd", "basetis-fullstack", "basetis-lead", "quabu"],
		);
		assert.deepEqual(
			values.map((value) => value.label),
			[
				"Software Developer",
				"Full Stack Developer",
				"Technical Team Lead",
				"Solutions Architect",
			],
		);
	});

	it("lists projects in chronological order", () => {
		const values = axisValues("project", PROJECTS, config);
		assert.equal(values.length, PROJECTS.length);
		assert.equal(values[0]?.id, "acd-auditor");
		assert.equal(values.at(-1)?.id, "nakire-tps");
		const starts = values.map((value) => projectById(value.id).startYear);
		assert.deepEqual(starts, [...starts].sort((a, b) => a - b));
	});

	it("offers only the domains and pillars the data actually uses", () => {
		const single = [projectById("bodega-digital")];
		assert.deepEqual(
			axisValues("pillar", single, config).map((value) => value.id),
			["eda", "cloud", "data", "robotics"],
		);
		assert.deepEqual(
			axisValues("domain", single, config).map((value) => value.id),
			["logistics"],
		);
	});
});

describe("matching", () => {
	it("counts a project on the boundary years of its period", () => {
		const project = projectById("shelter-gencat");
		assert.equal(matchesValue(project, "time", "2017"), true);
		assert.equal(matchesValue(project, "time", "2021"), true);
		assert.equal(matchesValue(project, "time", "2022"), false);
		assert.equal(matchesValue(project, "time", "2016"), false);
	});

	it("matches company, stage, project, domain and pillar by identity", () => {
		const project = projectById("love-isdin-pin");
		assert.equal(matchesValue(project, "company", "BaseTIS S.L."), true);
		assert.equal(matchesValue(project, "company", "Quabu SL"), false);
		assert.equal(matchesValue(project, "role", "basetis-lead"), true);
		assert.equal(matchesValue(project, "role", "basetis-fullstack"), false);
		assert.equal(matchesValue(project, "project", "love-isdin-pin"), true);
		assert.equal(matchesValue(project, "domain", "health"), true);
		assert.equal(matchesValue(project, "pillar", "lead"), true);
		assert.equal(matchesValue(project, "pillar", "eda"), false);
	});
});

describe("bar geometry", () => {
	it("places a period proportionally inside the full range", () => {
		assert.deepEqual(barGeometry(projectById("coleo"), MIN_YEAR, MAX_YEAR), {
			leftPct: 86.67,
			widthPct: 13.33,
		});
		assert.deepEqual(barGeometry(projectById("shelter-gencat"), MIN_YEAR, MAX_YEAR), {
			leftPct: 40,
			widthPct: 26.67,
		});
	});

	it("fills a single-year track when the project was alive that year", () => {
		assert.deepEqual(barGeometry(projectById("shelter-gencat"), 2019, 2019), {
			leftPct: 0,
			widthPct: 100,
		});
	});

	it("returns nothing when the project and the track do not intersect", () => {
		assert.equal(barGeometry(projectById("coleo"), MIN_YEAR, 2022), null);
		assert.equal(barGeometry(projectById("shelter-gencat"), 2022, MAX_YEAR), null);
	});

	it("maps years to the same scale used by the bars", () => {
		assert.equal(yearPct(MIN_YEAR), 0);
		assert.equal(yearPct(MAX_YEAR), 100);
		assert.equal(yearPct(2018), 46.67);
	});

	it("follows a range that does not start at the first role", () => {
		assert.equal(yearPct(2015, { from: 2011, to: 2021 }), 40);
		assert.deepEqual(
			axisValues("time", PROJECTS, config, { from: 2015, to: 2016 }).map(
				(value) => value.id,
			),
			["2015", "2016"],
		);
	});
});

describe("matrix cells", () => {
	it("keeps only the projects at the crossing of both axes", () => {
		assert.deepEqual(
			cellBars(PROJECTS, "company", "Quabu SL", "project", "coleo").map(
				(bar) => bar.id,
			),
			["coleo"],
		);
		assert.deepEqual(
			cellBars(PROJECTS, "company", "ACD Sistemes SL", "project", "coleo"),
			[],
		);
		assert.deepEqual(
			cellBars(PROJECTS, "company", "BaseTIS S.L.", "domain", "health").map(
				(bar) => bar.id,
			),
			["love-isdin-pin"],
		);
		assert.deepEqual(
			cellBars(PROJECTS, "company", "BaseTIS S.L.", "pillar", "eda"),
			[],
		);
	});

	it("crosses stage and project", () => {
		assert.deepEqual(
			cellBars(PROJECTS, "role", "quabu", "project", "coleo").map(
				(bar) => bar.id,
			),
			["coleo"],
		);
		assert.deepEqual(cellBars(PROJECTS, "role", "acd", "project", "coleo"), []);
	});

	it("fills a year column for every project alive that year", () => {
		const bars = cellBars(PROJECTS, "time", "2018", "company", "BaseTIS S.L.");
		assert.equal(bars.length, 4);
		assert.ok(bars.every((bar) => bar.leftPct === 0 && bar.widthPct === 100));
	});

	it("builds a timeline row with every project on one Y value", () => {
		assert.deepEqual(
			rowBars(PROJECTS, "company", "Quabu SL").map((bar) => bar.id),
			["bodega-digital", "coleo", "jira-addons", "nakire-tps"],
		);
		assert.deepEqual(
			rowBars(PROJECTS, "pillar", "eda").map((bar) => bar.id),
			["bodega-digital", "nakire-tps"],
		);
		assert.deepEqual(
			rowBars(PROJECTS, "role", "basetis-lead").map((bar) => bar.id),
			["love-isdin-pin"],
		);
	});
});

describe("periods", () => {
	it("derives the timeline range from the roles", () => {
		assert.equal(MIN_YEAR, 2011);
		assert.equal(MAX_YEAR, 2026);
		assert.deepEqual(DEFAULT_RANGE, YEAR_RANGE);
	});

	it("gives every project the period and owner of its stage", () => {
		for (const project of PROJECTS) {
			const stage = role(project.roleId);
			assert.equal(project.startYear, stage.startYear);
			assert.equal(project.endYear, stage.endYear);
			assert.equal(project.company, stage.company);
			assert.equal(project.role, stage.title);
		}
	});

	it("lets a project carry its own years inside the stage", () => {
		const roles: Role[] = [
			{
				id: "r",
				company: "C",
				title: "T",
				startYear: 2010,
				endYear: 2020,
				accent: "cobalt",
				focus: "",
				summary: "",
				achievements: [],
				stack: [],
			},
		];
		const seeds: ProjectSeed[] = [
			{
				id: "p",
				roleId: "r",
				project: "P",
				short: "p",
				startYear: 2012,
				endYear: 2015,
				domain: "product",
				pillars: ["web"],
				summary: "",
				achievements: [],
			},
		];
		const [project] = resolveProjects(roles, seeds);
		assert.deepEqual([project?.startYear, project?.endYear], [2012, 2015]);
		assert.equal(project?.company, "C");
	});

	it("refuses a project that leaves its stage", () => {
		const roles: Role[] = [
			{
				id: "r",
				company: "C",
				title: "T",
				startYear: 2010,
				endYear: 2020,
				accent: "cobalt",
				focus: "",
				summary: "",
				achievements: [],
				stack: [],
			},
		];
		const seed: ProjectSeed = {
			id: "p",
			roleId: "r",
			project: "P",
			short: "p",
			startYear: 2012,
			endYear: 2025,
			domain: "product",
			pillars: ["web"],
			summary: "",
			achievements: [],
		};
		assert.throws(() => resolveProjects(roles, [seed]), /leaves role/);
		assert.throws(
			() => resolveProjects(roles, [{ ...seed, roleId: "nope" }]),
			/unknown role/,
		);
	});
});

describe("lane packing", () => {
	it("gives overlapping intervals their own lane and shares free ones", () => {
		const lanes = packLanes([
			{ startYear: 2011, endYear: 2017 },
			{ startYear: 2011, endYear: 2017 },
			{ startYear: 2017, endYear: 2021 },
		]);
		assert.deepEqual(lanes, [0, 1, 0]);
	});
});
