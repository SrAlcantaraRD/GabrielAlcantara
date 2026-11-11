# Social share cards

Source of every `og:image` / `twitter:image` on gabrielalcantara.com. One
1200×630 PNG per shareable page, plus the fallback card and the app icons.

The artboards are plain HTML. Edit them like a web page, look at the result in
the browser, and export when the copy or the layout changes.

## The one rule

The card is a rigid template: **five slots, one line each, nothing reflows.**

| # | Slot | Size | Top | Holds |
| --- | --- | --- | --- | --- |
| 1 | domain | 34 px | 64 | the mark and `gabrielalcantara.com` |
| 2 | eyebrow | 34 px | 168 | terracotta label: category, `Caso de estudio · Company`, place |
| 3 | title | 76 px | 224 | the name or the headline |
| 4 | sub | 44 px | 330 | role, tagline or standfirst |
| 5 | foot | 34 px | 512 | stack or tags on the left, years or date on the right |

All five are filled on every card. There is no auto-fit and no second line: the
copy is edited until it fits, which is why the articles carry their own
`cardTitle` and `cardSub` in `src/data/blog.ts` while the page keeps its longer
`title` and `description`.

`export.mjs` enforces it. It measures the rendered card and refuses to write a
PNG when a slot is empty, wraps to a second line, overflows its width, falls
outside the canvas or drops below 34 px. It also refuses an image that is not
exactly 1200×630 or heavier than `--max-kb`.

34 px is the floor because the canvas is not what people see: a timeline draws
the card near 504 px wide, a factor of 0.42, so 34 px arrives on screen at about
14 px. At 76 px a title fits roughly 31 characters, and that is the budget the
card copy is written to.

## The loop

```bash
# 1. Look at the artboard, with real copy, at feed size
open "docs/og-image/card.html?kind=case&eyebrow=Caso%20de%20estudio%20%C2%B7%20Quabu%20Solutions&title=Nakire%20TPS&sub=Software%20distribuido%20para%20operaciones%20industriales%20en%20tiempo%20real.&footLeft=EDA%20%C2%B7%20DDD%20%C2%B7%20TDD%20%C2%B7%20Kafka&footRight=2025%20%E2%80%94%202026&scale=504"

# 2. Edit the artboard (or ask for a change), reload the page

# 3. Export
pnpm social:cards                   # every card and the icons
pnpm social:cards --only nakire     # one card, while iterating

# 4. Verify
pnpm test                           # catches copy that changed without an export
```

`--only` refreshes that card's manifest entry, so a partial export leaves the
repository consistent.

## Previewing without the command line

Open `docs/og-image/card.html` directly from the file system. It needs no server
and no build: the fonts are loaded from `node_modules` by relative path.

| Query | Effect |
| --- | --- |
| `kind` | `default`, `case` or `post` — picks the composition |
| `title` | slot 3 |
| `sub` | slot 4: sans for `default`, italic for `case` and `post` |
| `eyebrow` | terracotta label above the lead |
| `footLeft`, `footRight` | the closing row |
| `scale` | canvas width in px; `504` shows the feed size |

`docs/og-image/icon.html?size=512` previews an app icon the same way.

## Files

| Piece | Where |
| --- | --- |
| Artboard, both compositions | `card.html` |
| App icon artboard | `icon.html` |
| Copy for every card | `scripts/social-cards.mjs` — read from `src/data/`, never hand-typed twice |
| Exporter and legibility gate | `export.mjs` |
| Manifest: page, title, render hash | `scripts/social-cards.json` |

## What the manifest protects

Each entry records a render hash of the artboard plus the exact copy that card
renders. Editing a tagline, a title or `card.html` itself and forgetting to
export fails `pnpm test` and `pnpm build`, and the error says to run
`pnpm social:cards`. The build runs `pnpm social:check` before Astro, so a stale
manifest stops it. Both checks also verify that every recorded card is still a
1200×630 PNG.

The manifest does not record the PNG bytes. Chrome's rasteriser can shift a
couple of antialiased pixels between two identical runs, so a byte hash would
report drift nobody can see and fail the test for no reason. A re-export can
still leave a PNG modified by a byte or two; that is the rasteriser, not the
copy, and it is safe to keep or discard.

## Adding a page that needs its own card

Add the entry to `socialCardSpecs()` in `scripts/social-cards.mjs`, run
`pnpm social:cards`, then point the page at the new file. The gate will reject a
line that does not fit its slot and tell you by how many pixels — shorten the
sentence rather than lowering the size.
