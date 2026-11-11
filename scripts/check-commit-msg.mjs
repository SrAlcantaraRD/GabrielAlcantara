#!/usr/bin/env node
/**
 * Validates the message passed to the commit-msg hook.
 *
 * The project convention is `<emoji> <type>(<scope>): <description>`. The AI
 * footers used by some tools are rejected here on purpose: they do not belong
 * in this repository's history.
 */
import fs from "node:fs";
import process from "node:process";

const TYPES = [
	"feature",
	"feat",
	"fix",
	"docs",
	"style",
	"refactor",
	"perf",
	"test",
	"chore",
	"ci",
	"revert",
];

const EMOJI = String.raw`(?:\p{Extended_Pictographic}(?:\p{Emoji_Modifier}|\uFE0F|\u200D\p{Extended_Pictographic})*|(?:\p{Regional_Indicator}{2})|(?:[\d#*]\uFE0F?\u20E3))`;
const EMOJI_PREFIX = new RegExp(`^\\s*${EMOJI}\\s+`, "u");
const HEADER = new RegExp(
	`^(?:${TYPES.join("|")})(?:\\([a-z0-9][a-z0-9/_-]*\\))?: \\S`,
);
const AI_TRAILER = /^\s*(?:Co-Authored-By:|(?:🤖\s*)?Generated with\b)/i;
const FORMAT = "<emoji> <type>(<scope>): <descripción>";

const file = process.argv[2];
if (!file) {
	console.error("ERROR: falta el archivo de mensaje del commit.");
	process.exit(1);
}

let raw;
try {
	raw = fs.readFileSync(file, "utf8");
} catch {
	console.error(`ERROR: no se puede leer el mensaje del commit: ${file}`);
	process.exit(1);
}

const lines = raw.split(/\r?\n/);
const trailers = lines.filter((line) => AI_TRAILER.test(line));

if (trailers.length > 0) {
	console.error("ERROR: el mensaje no puede incluir trailers de IA.");
	console.error("Rechazado:");
	for (const trailer of trailers) console.error(`  ${trailer.trim()}`);
	console.error("Elimina las líneas Co-Authored-By o Generated with.");
	process.exit(1);
}

const header =
	lines.find((line) => line.trim() !== "" && !line.trimStart().startsWith("#"))?.trim() ??
	"";

if (!header) {
	console.error("ERROR: el mensaje del commit está vacío.");
	process.exit(1);
}

if (!EMOJI_PREFIX.test(header)) {
	console.error("ERROR: el mensaje debe empezar por un emoji.");
	console.error(`FORMATO: ${FORMAT}`);
	console.error("");
	console.error("Tu primera línea:");
	console.error(`  ${header}`);
	process.exit(1);
}

const conventional = header.replace(EMOJI_PREFIX, "").trim();

if (!HEADER.test(conventional)) {
	console.error("ERROR: formato de commit no válido.");
	console.error(`FORMATO: ${FORMAT}`);
	console.error(`TIPOS: ${TYPES.join(", ")}`);
	console.error("");
	console.error("Tu primera línea:");
	console.error(`  ${header}`);
	process.exit(1);
}
