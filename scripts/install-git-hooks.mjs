#!/usr/bin/env node
/**
 * Points git at the versioned hooks in `.githooks`.
 *
 * `prepare` runs this after an install and `pnpm hooks:install` runs it by hand,
 * so a fresh clone gets the pre-commit gate without another dependency.
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

process.chdir(path.resolve(import.meta.dirname, ".."));

try {
	execFileSync("git", ["rev-parse", "--git-dir"], { stdio: "ignore" });
} catch {
	// Installed outside a checkout (for example from a tarball): nothing to do.
	process.exit(0);
}

let current = "";
try {
	current = execFileSync("git", ["config", "--local", "--get", "core.hooksPath"], {
		encoding: "utf8",
	}).trim();
} catch {
	// No custom hooks path yet.
}

if (current && current !== ".githooks") {
	console.warn(
		`core.hooksPath ya apunta a "${current}": no se cambia. Instala el gate allí o ejecuta \`git config core.hooksPath .githooks\`.`,
	);
	process.exit(0);
}

execFileSync("git", ["config", "--local", "core.hooksPath", ".githooks"], {
	stdio: "inherit",
});
console.log("Git hooks instalados desde .githooks.");
