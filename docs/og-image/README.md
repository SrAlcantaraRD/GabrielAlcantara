# Social share cards

Source of every `og:image` / `twitter:image` on gabrielalcantara.com. One
1200×630 PNG per shareable page, plus the fallback card and the app icons.

The artboards are plain HTML. Edit them like a web page, look at the result in
the browser, and export when the copy or the layout changes.

## The one rule

Every piece of text is at least **34 px** on the canvas, and there are only three
type sizes: 112 px (name or title), 44 px (role or tagline), 34 px (everything
else). The canvas is not the thing people see — a timeline draws the card near
504 px wide, a factor of 0.42, so 34 px arrives on screen at about 14 px. Anything
smaller than that is a grey smear.

`export.mjs` enforces this. It measures the rendered card and refuses to write a
PNG when a text element is under 34 px, leaves the canvas, overflows its box, or
does not fit between the header and the footer rule. It also refuses an image
that is not exactly 1200×630 or heavier than `--max-kb`.

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
| `title` | the 112/96 px lead, shrunk until it fits its line budget |
| `sub` | role (sans) for `default`, italic tagline for `case` |
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
| Manifest: page, title, copy hash, image hash | `scripts/social-cards.json` |

## What the manifest protects

Each entry records two hashes. `copyHash` covers the strings rendered inside the
card, so editing a tagline and forgetting to export fails `pnpm test` even though
the title did not change. `sha256` covers the PNG, so a card replaced or edited by
hand also fails. Both errors say to run `pnpm social:cards`.

## Adding a page that needs its own card

Add the entry to `socialCardSpecs()` in `scripts/social-cards.mjs`, run
`pnpm social:cards`, then point the page at the new file. The gate will reject a
tagline that does not fit two lines of 44 px — shorten the sentence rather than
lowering the floor.
