# Social share cards

Source of every `og:image` / `twitter:image` on gabrielalcantara.com. One
1200×630 PNG per shareable page, plus the fallback card and the app icons.

The artboards are plain HTML. Edit them like a web page, look at the result in
the browser, and export when the copy or the layout changes.

## The one rule

The card is a rigid template: **three faces, three sizes, five slots, one line
each, nothing reflows.** The faces and colours are the site's own: JetBrains Mono
for the labels, Newsreader 300 for the lead, Plus Jakarta Sans for the standfirst.

| # | Slot | Face | Size | Height | Holds |
| --- | --- | --- | --- | --- | --- |
| 1 | domain | mono | 34 px | 34 | `gabrielalcantara.com` on the left, the availability badge on the right |
| 2 | eyebrow | mono | 34 px | 34 | uppercase, tracked, terracotta: category, `Caso de estudio · Company`, place |
| 3 | title | serif 300 | 96 px | 96 | the name or the headline |
| 4 | sub | sans | 34 px | 46 | role or standfirst, in the muted ink |
| 5 | foot | mono | 34 px | 34 | stack or tags on the left, years or date on the right |

All five slots are filled on every card. There is no auto-fit and no second
line — the copy is edited until it fits, which is why the articles carry their own
`cardTitle` and `cardSub` in `src/data/blog.ts` while the page keeps its longer
`title` and `description`. A case card lists at most three technologies in the
foot: at 34 px a fourth one runs into the margin.

`export.mjs` enforces it. It measures the rendered card and refuses to write a
PNG when a slot is empty, wraps to a second line, overflows its width, invades
the 80 px gutter, drops below 34 px, or breaks the rhythm. It also refuses an
image that is not exactly 1200×630 or heavier than `--max-kb`.

34 px is the floor because the canvas is not what people see: a timeline draws
the card near 504 px wide, a factor of 0.42, so 34 px arrives on screen at about
14 px. At 96 px a title fits roughly 24 characters, and in uppercase at 34 px a
label fits roughly 40 — that is the budget the card copy is written to.

The accent is the site's terracotta, `#9e4e36`, and it marks the eyebrow only.
The one other colour is the availability dot, sage `#3e5c49` text with a `#059669`
bullet, the same token the hero uses.

## The rhythm

The five heights and two gaps derive all five tops in `card.html`:

```
--space       78px   between the rows
--space-tight 18px   above and below the title, the tight gap of the block
--margin      97px   above the first row and below the last, whatever is left
```

The six spaces are therefore `97 / 78 / 18 / 18 / 78 / 97`, identical on all
eight cards. `export.mjs` reads `--space`, `--space-tight` and `--margin` from the
stylesheet, re-derives the six spaces from the slot boxes, and refuses the card
when any of them is off by more than half a pixel. Change a gap or a height and
the four tops follow; there are no hand-tuned numbers to forget.

The two hairlines are attached to the outer rows — under the masthead and over
the footer, 24 px from each — which is what closes the composition without
adding a line of text.

The rhythm is measured on the slot boxes, not on ink. A `Q` tail, an accent over
a capital or the descender of a `g` dips into the space below without moving it;
measuring ink would make the gaps depend on which words a card happens to use.

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
| `domain`, `status` | the masthead halves |
| `title`, `sub` | the lead and its standfirst |
| `eyebrow` | terracotta label above the lead |
| `footLeft`, `footRight` | the closing row |
| `scale` | canvas width in px; `504` shows the feed size |

`docs/og-image/icon.html?size=512` previews an app icon the same way.

## Taller visual

`docs/og-image/editor.html` is the same canvas with controls, for deciding a
design instead of describing it: open it directly, no server and no build.

- **Arrastra una fila** en el lienzo para moverla; flechas mueven 1 px y con
  Mayús, 10. Cada ranura tiene además su tamaño, peso, tracking, interlineado,
  mayúsculas, color, desplazamiento fino y **alineación** (extremos, izquierda,
  centro o derecha).
- **Marca**: la visible, su tamaño, la separación al dominio, su color y su
  desplazamiento. La fila de cabecera crece para alojarla, así que la marca nunca
  se sale del filete.
- **Reglas**: las que quieras, añadidas y quitadas desde el panel. Cada una se
  ancla a una fila, por encima o por debajo, con desfase, sangrado lateral,
  grosor y color propios.
- **Guías** (interruptor en Tarjeta): los dos bordes y el centro de la columna,
  más el top de cada fila. Son del taller, no del PNG.
- **Retícula**: los dos huecos, el margen lateral, el ancho de columna y la
  separación de las dos mitades del pie.
- **Colores**: los ocho tokens del sitio, que las ranuras referencian por nombre.
- **Copy real**: las ocho tarjetas del exportador, para comprobar que un título
  entra sin salir del taller.
- Cada ranura avisa en rojo si no cabe en su columna o baja de 34 px, y la línea
  de cierre resume si las cinco pasan.

El estado vive en `localStorage`, así que recargar no pierde el trabajo. La
sección **Salida** muestra el `:root` resultante y un `JSON` con el copy, la
retícula, los colores, la tipografía de cada ranura y la geometría resuelta: ese
JSON es lo que se pega en el chat para que el cambio aterrice en `card.html`. El
editor dibuja; el exportador y su puerta siguen siendo la verdad.

Las copias del taller son una instantánea de `scripts/social-cards.mjs`; si
cambia un `cardTitle`, el exportador manda.

## Files

| Piece | Where |
| --- | --- |
| Artboard, both compositions | `card.html` |
| Visual workshop for designing a card | `editor.html` |
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
