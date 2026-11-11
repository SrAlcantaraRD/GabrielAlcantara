import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function runHook(message: string) {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-commit-msg-"));
	const file = path.join(dir, "message.txt");
	fs.writeFileSync(file, message);

	try {
		return spawnSync("sh", [".githooks/commit-msg", file], {
			cwd: ROOT,
			encoding: "utf8",
		});
	} finally {
		fs.rmSync(dir, { recursive: true, force: true });
	}
}

describe("commit-msg hook", () => {
	it("accepts an emoji and the project's conventional format", () => {
		const result = runHook("✨ feature(nav): persist the header\n");
		assert.equal(result.status, 0, result.stderr);
	});

	it("rejects a message without a leading emoji", () => {
		const result = runHook("feature(nav): persist the header\n");
		assert.equal(result.status, 1);
		assert.match(result.stderr, /emoji/i);
	});

	it("rejects AI co-author trailers", () => {
		const result = runHook(
			"✨ feature(nav): persist the header\n\n🤖 Generated with Codebuff\nCo-Authored-By: Codebuff <noreply@codebuff.com>\n",
		);
		assert.equal(result.status, 1);
		assert.match(result.stderr, /Co-Authored-By|Generated with/);
	});

	it("rejects a malformed conventional header", () => {
		const result = runHook("✨ feature(nav) persist the header\n");
		assert.equal(result.status, 1);
		assert.match(result.stderr, /formato/i);
	});
});
