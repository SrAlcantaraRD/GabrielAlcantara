# Astro Starter Kit: Minimal

```sh
pnpm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm test`            | Runs the timeline engine tests (`node --test`)   |
| `pnpm ui:check`        | Drives the built site with Playwright and writes screenshots to `ui-artifacts/` |
| `pnpm social:cards`    | Regenerates `og-image.png` and the app icons in `public/` |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## Social card and icons

`public/og-image.png` (1200×630) and the app icons are generated, not hand-drawn.
After changing the name, role or positioning, regenerate them with:

```sh
pnpm social:cards
```

The command writes one card per shareable page, all 1200×630:

| File | Used by |
| --- | --- |
| `public/og-image.png` | All pages without a specific card |
| `public/og/nakire-tps.png` | The Nakire TPS case study |
| `public/og/pachanga-community.png` | The Pachanga Community case study |
| `public/og/bodega-digital.png` | The Bodega Digital case study |
| `public/og/<post-slug>.png` | Each blog article |

Card copy comes from `src/data/blog.ts` and `src/data/projects.ts`, so it stays
in sync with the pages. The script renders with headless Chrome (set
`CHROME_PATH` if it is not in the usual location) and embeds the fonts the site
already depends on — Newsreader, Plus Jakarta Sans and JetBrains Mono — so no
extra package is required. It also asserts the dimensions of every PNG it
writes, which must match the `og:image:width`, `og:image:height` and
`manifest.json` declarations.

Each run records the title, page and SHA-256 of every page card in
`scripts/social-cards.json`. `pnpm test` compares that manifest with the current
titles and fails when a card is stale, so run `pnpm social:cards` after editing
a title or adding a post.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
