import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ASK_ASSISTANTS, ASK_PROMPT } from "../src/data/site.ts";

describe("ask the assistants", () => {
	const encoded = encodeURIComponent(ASK_PROMPT);

	it("offers the assistants the header shows, in order", () => {
		assert.deepEqual(
			ASK_ASSISTANTS.map((assistant) => assistant.label),
			["ChatGPT", "Claude", "Gemini"],
		);
	});

	it("hands every assistant the same question, pre-encoded", () => {
		for (const assistant of ASK_ASSISTANTS) {
			assert.match(assistant.href, /^https:\/\//, assistant.id);
			assert.ok(
				assistant.href.endsWith(encoded),
				`${assistant.id} must carry the encoded question verbatim`,
			);
		}
	});

	it("points the answer at the site's own summary", () => {
		assert.match(ASK_PROMPT, /gabrielalcantara\.com\/llms\.txt/);
	});
});
