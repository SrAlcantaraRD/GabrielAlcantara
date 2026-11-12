import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
);

const { indexableRoutes } = await import(
	pathToFileURL(path.join(ROOT, "src/lib/routes.ts")).href
);

const dirOf = (kind: "blog" | "cases") =>
	path.join(ROOT, "src/editorial/bodies", kind);

describe("translated bodies", () => {
	for (const locale of ["en", "ca"] as const) {
		for (const [kind, routeKind] of [
			["blog", "post"],
			["cases", "case"],
		] as const) {
			it(`${kind}/${locale} holds exactly the routes the table renders`, () => {
				const files = fs
					.readdirSync(path.join(dirOf(kind), locale))
					.filter((file) => file.endsWith(".astro"))
					.map((file) => file.replace(/\.astro$/, ""))
					.sort();
				const slugs = indexableRoutes()
					.filter(
						(route: { kind: string; locale: string; slug?: string }) =>
							route.kind === routeKind && route.locale === locale,
					)
					.map((route: { slug?: string }) => route.slug)
					.sort();

				assert.deepEqual(files, slugs);
			});
		}
	}

	it("keeps the page layout out of the body files", () => {
		for (const kind of ["blog", "cases"] as const) {
			for (const locale of ["en", "ca"]) {
				for (const file of fs.readdirSync(path.join(dirOf(kind), locale))) {
					const source = fs.readFileSync(
						path.join(dirOf(kind), locale, file),
						"utf8",
					);

					assert.doesNotMatch(
						source,
						/import\s+\w*Layout\s+from/,
						`${kind}/${locale}/${file} imports a layout it does not render`,
					);
				}
			}
		}
	});
});
