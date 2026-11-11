import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/**
 * A throwaway checkout with just what the gate reads: the hook, the card
 * specs, the page data and the exported PNGs. It is a real git worktree root,
 * because the hook resolves it with `git rev-parse --show-toplevel`.
 */
function fixture(): string {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-hook-"));

	for (const file of [
		".githooks/pre-commit",
		"scripts/check-social-cards.mjs",
		"scripts/social-cards.mjs",
		"scripts/social-cards.json",
		"docs/og-image/card.html",
		"public/og-image.png",
	]) {
		const target = path.join(dir, file);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.copyFileSync(path.join(ROOT, file), target);
	}

	fs.cpSync(path.join(ROOT, "src/data"), path.join(dir, "src/data"), {
		recursive: true,
	});
	fs.cpSync(path.join(ROOT, "src/lib"), path.join(dir, "src/lib"), {
		recursive: true,
	});
	fs.cpSync(path.join(ROOT, "public/og"), path.join(dir, "public/og"), {
		recursive: true,
	});

	execFileSync("git", ["init", "--quiet"], { cwd: dir, stdio: "ignore" });
	return dir;
}

function runHook(cwd: string) {
	return spawnSync("sh", [".githooks/pre-commit"], {
		cwd,
		encoding: "utf8",
	});
}

describe("social card pre-commit hook", () => {
	it("accepts the exported manifest and rejects a stale one", () => {
		const dir = fixture();

		try {
			const current = runHook(dir);
			assert.equal(current.status, 0, current.stderr);

			const manifestFile = path.join(dir, "scripts/social-cards.json");
			const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
			assert.ok(manifest.cards?.length > 0, "el manifiesto no tiene tarjetas");

			manifest.cards[0].title = `${manifest.cards[0].title} (obsoleto)`;
			fs.writeFileSync(
				manifestFile,
				`${JSON.stringify(manifest, null, "\t")}\n`,
			);

			const stale = runHook(dir);
			assert.equal(stale.status, 1, stale.stderr);
			assert.match(stale.stderr, /no coinciden con el manifiesto/);
			assert.match(stale.stderr, /anuncia/);
		} finally {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	});
});
