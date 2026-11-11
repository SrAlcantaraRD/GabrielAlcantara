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

`public/og-image.png` (1200×630) and the app icons are generated, not hand-drawn,
from the HTML artboards in [`docs/og-image/`](docs/og-image/README.md). That
README documents the full loop — preview the artboard in the browser, edit it,
export, verify — and the one rule the exporter enforces: every text element is at
least 34 px on the canvas, because a timeline draws the card at about 504 px and
anything smaller turns into a grey smear.

```sh
pnpm social:cards                   # every card and the icons
pnpm social:cards --only nakire     # one card, while iterating
```

The command writes one card per shareable page, all 1200×630:

| File | Used by |
| --- | --- |
| `public/og-image.png` | All pages without a specific card |
| `public/og/nakire-tps.png` | The Nakire TPS case study |
| `public/og/pachanga-community.png` | The Pachanga Community case study |
| `public/og/bodega-digital.png` | The Bodega Digital case study |
| `public/og/<post-slug>.png` | Each blog article |

Card copy comes from `src/data/blog.ts`, `src/data/projects.ts` and
`src/data/site.ts`, so it stays in sync with the pages. The exporter renders
through the system Chrome (set `PW_CHROME` if it is not in the usual location)
and rejects any PNG that is not exactly 1200×630, over `--max-kb`, or that breaks
the legibility floor.

Each run records the page, title, a hash of the rendered copy and a SHA-256 of the
PNG in `scripts/social-cards.json`. `pnpm test` fails when a card is stale —
including a tagline edited without re-exporting — so run `pnpm social:cards`
after changing any copy.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
