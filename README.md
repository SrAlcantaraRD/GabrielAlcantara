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
| `pnpm social:check`    | Fails when the social card manifest or its PNGs are stale |
| `pnpm hooks:install`   | Points git at the versioned pre-commit hook |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm url:baseline`    | Compares the built URLs, canonical and hreflang against `tests/fixtures/url-baseline.json` |
| `pnpm url:baseline:write` | Recaptures the baseline after an intentional URL change |
| `pnpm deploy:production` | Production gate: tests, build and URL baseline comparison |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## Deploy

`pnpm deploy:production` is the only command needed before publishing. It runs,
in order, the tests, the Astro build (which checks the social cards first) and
the URL baseline comparison, and leaves the site ready in `dist/`. A page that
changes URL, canonical or hreflang stops the command instead of shipping.

The repository has no deploy target configured: the host that serves
`gabrielalcantara.com` publishes `dist/` after this gate passes.

## Social card and icons

`public/og-image.png` (1200×630) and the app icons are generated, not hand-drawn,
from the HTML artboards in [`docs/og-image/`](docs/og-image/README.md). That
README documents the full loop — preview the artboard in the browser, edit it,
export, verify. The card is a rigid five-slot template: domain, eyebrow, title,
sub and foot, each at a fixed position and size, one line each, with the copy
written to fit. The exporter refuses a card where a slot is empty, wraps, overflows
or drops below 34 px — the floor because a timeline draws the card at about 504 px
and anything smaller turns into a grey smear.

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

Each run records the page, title and a hash of the artboard plus the copy in
`scripts/social-cards.json`. `pnpm test` fails when a card is stale — after a
tagline edit or a template change — and so does `pnpm build`: it runs
`pnpm social:check` before Astro starts, so a stale card cannot ship. Run
`pnpm social:cards` after touching the copy or the artboard.

`pnpm install` points `core.hooksPath` at `.githooks`, whose `pre-commit` runs
the same check before every commit. If that local config is lost, run
`pnpm hooks:install` to restore it. `.githooks/commit-msg` exige un emoji
inicial y el formato `<emoji> <type>(<scope>): <descripción>`, y rechaza los
trailers de IA (`Co-Authored-By:` y `Generated with`).

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
