// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://gabrielalcantara.com",
	// Pages are built as directories; keep every URL and canonical on that form.
	trailingSlash: "always",
});
