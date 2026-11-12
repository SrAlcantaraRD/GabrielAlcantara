# element-ids

Todo elemento de `src/**/*.astro` lleva un `id` explícito, y un hook de pre-commit
rechaza cualquier commit con elementos sin id. Alcance: el sitio entero (60 plantillas), elegido por el dueño.

## Specs

S1. Todo elemento renderizado en una plantilla `.astro` (páginas, componentes, layouts, incluido SVG) declara un atributo `id`. No se cuentan como elementos: los componentes Astro (nombre en mayúscula), `<script>`, `<style>` ni el frontmatter.

S2. Un commit que añada o modifique un `.astro` con elementos sin id se rechaza (`exit 1`) e imprime `fichero:línea  <tag …>  falta id`, uno por elemento.

S3. El gate es universal: se aplica a cualquier `.astro` incluido en el commit, no a una lista de ficheros.

S4. Los ids son únicos en cada página renderizada: los elementos que se repiten dentro de un bucle usan un id dinámico con el índice del bucle (`id={`…-${index}`}`), y los ids literales no se repiten dentro de un fichero.

S5. `pnpm test` cubre el escáner y recorre todo el árbol: si una plantilla vuelve a tener elementos sin id, la suite falla. `pnpm build` falla si una página renderizada repite un id.

## Tasks

- T1 — gate: `scripts/element-ids.mjs` (escáner + CLI `--staged`/`--dist`), `.githooks/pre-commit`, `tests/element-ids.test.ts`, `tests/pre-commit-hook.test.ts` y `pnpm build` con `--dist`. Hecho: gate 0 violaciones, hook KO/OK cubierto, 122 tests en verde. Commit: 3f6b1cf.
- T2 — ids en las 61 plantillas (2025 ids). Hecho: nombre = prefijo de fichero + clase (o ancestro + tag), índice del bucle encadenado, marcador `-item` cuando el id literal de al lado ya lee como una iteración, y `suffix` por instancia en los componentes que se repiten (`AskAiLinks` por variante, `PostCard` por slug, `ProjectCard` por id). Commit: 3da756c (las plantillas que además ganaron previews llevan sus ids en 3b45119 y 26823e4).
- T3 — verificación: gate limpio, `pnpm test` 122/122, `pnpm build` 40 páginas y 0 ids repetidos en `dist`, `/experience` renderiza sin errores de página. Commit: 3f6b1cf (gate y `--dist`) y 3da756c (ids).

## Log

L1. «no! EXPERIENICA NO ENTRA.  quita eso. Añade IDs en todos los elementos, y un gate que de ko si se hace commit sin ids en los elementos. ASí será más facil decirte que cambiar.»

L2. Alcance elegido por el dueño: «Todo el sitio ahora (60 ficheros)» — ids en los ~2500 elementos de todas las plantillas y gate universal desde el primer commit.

L3. Fuera de alcance: el eyebrow volvió a salir del sticky (solo título + meta, aire 12px arriba y 12px abajo). El gate no pide id a componentes Astro, `<slot>`, `<script>` ni `<style>`.

L4. Cambios incidentales, necesarios para que la verificación pase: `AskAiLinks`, `PostCard` y `ProjectCard` ganan un `suffix` por instancia (sus ids se repetían al renderizarse varias veces en la misma página), y el test `diagram-css` deja de fijar el orden de atributos del `<link>` (ahora lleva `id`).
L5. Cierre: los commits se ordenaron para que cada uno deje el árbol verde y el hook nuevo feliz — 91828dc skills, 3b45119 y 26823e4 previews, 3da756c ids, 3f6b1cf gate y tooling, a32b92e experience sticky y bd4bc51 ideas. `pnpm test` 122/122 y el escáner en 0 violaciones antes de commitear.
