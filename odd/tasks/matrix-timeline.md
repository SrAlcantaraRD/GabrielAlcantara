# Matriz de experiencia interactiva (timeline bidimensional)

Entrega web de la idea del PRD `docs/idea/prd_data_architecture_matrix_engine.md`, simplificada: una matriz donde el visitante elige qué comparar en X y en Y y cada celda contiene la barra temporal del proyecto.
Rama `feat/matrix-timeline`. Sin framework de UI: Astro + TypeScript puro.

## Specs

- **S1** — "una tabla bidimensional, tipo timeline, donde el visitante de la web peuda elegir que ver en X, Y y en la tabla se verá la barra con el projecto en si": la home expone dos selectores de eje y una barra por proyecto dentro de cada celda, posicionada proporcionalmente en su periodo real (2011–2026).
- **S2** — "Las X y las Y, tiene que tener sentido, pues si elijo empresa y proyecto, en la barra el contenido ha de ser interesante": todo par de ejes ofrecido produce celdas con contenido real; la misma dimensión no se puede elegir en ambos ejes; una celda lleva la barra del proyecto con etiqueta cuando el ancho lo permite y siempre abre su detalle.
- **S3** — Ejes pivoteables sobre cinco dimensiones: tiempo (2011–2026), empresa, proyecto, dominio y pilar técnico (decisión del owner).
- **S4** — La matriz se añade encima de la lista de Experiencia existente, que se mantiene intacta (decisión del owner).
- **S5** — El dataset se deriva del copy actual del CV, sin inventar hechos; la precisión temporal es la del periodo de cada rol en el CV (decisión del owner).
- **S6** — "pero simplificada para la web": sin buscador ni filtros extra en esta entrega, sin framework de UI, estado de ejes compartible por URL, y la lista estática en texto queda como fallback sin JavaScript.

## Tasks

- [x] **T1** — Tipos y dataset derivado del CV. `src/data/cv.ts` — S5 — commit `feat(matrix): model career data for the timeline matrix`
- [x] **T2** — Motor puro: expansión de ejes, matching por dimensión, geometría de barras y empaquetado de carriles, con tests en `node --test`. `src/lib/matrix.ts`, `tests/matrix.test.ts` — S1, S2, S3 — commit `feat(matrix): add timeline geometry engine`
- [x] **T3** — Componente de la matriz: selectores de eje, modo timeline y modo matriz, barras, panel de detalle, estado en URL, responsive. `src/components/ExperienceMatrix.astro` — S1, S2, S3, S6 — commit `feat(matrix): add interactive experience matrix`
- [x] **T4** — Integración encima de la lista de Experiencia + script `test` documentado en el README. `src/pages/index.astro`, `package.json`, `README.md` — S4 — commit `feat(matrix): place the matrix above the experience list`
- [x] **T5** — Verificación: tests, build, revisión estructural del HTML generado, responsive.

## Log

- **L1** (owner, verbatim): "vamos a trabajar en esta idea @docs/idea/prd_data_architecture_matrix_engine.md , pero simplificada para la web. La idea es una tabla bidimensional, tipo timeline, donde el visitante de la web peuda elegir que ver en X, Y y en la tabla se verá la barra con el projecto en si. Las X y las Y, tiene que tener sentido, pues si elijo empresa y proyecto, en la barra el contenido ha de ser interesante. el prd es una idea base."
- **L2** (owner, decisión): ejes — "X e Y pivoteables (recomendado)".
- **L3** (owner, decisión): ubicación — "Encima de la lista actual".
- **L4** (owner, decisión): datos — "Derívalos del CV actual (recomendado)".
- **L5** (slices de entrega): el commit `65c5d3c` mide 743 líneas autoradas, casi todas dataset y sus tests; se deja como unidad única porque el resto de la entrega (componente, integración) va en commits posteriores y pequeños. Los slices siguientes se mantienen bajo ~400 líneas.
- **L6** (verificación temprana): el motor se escribió antes que sus tests; se comprobó que la suite es viva mutando `axesAreValid` (1 test en rojo) y restaurando el archivo. 16 tests en verde con `pnpm test`.
- **L7** (slices de entrega, segunda parte): el componente `src/components/ExperienceMatrix.astro` es una unidad indivisible de comportamiento (marcado + renderizador + estilos) de ~900 líneas; se deja en un solo commit porque partir el archivo por estilos no produce un estado revisable. Si se abre PR, la partición razonable es ese commit frente al de integración, no dentro del archivo.
- **L8** (verificación final): 16 tests del motor, `astro build` en verde y 26 comprobaciones en navegador real (Chrome headless por CDP, script temporal fuera del repo) sobre: modo por defecto, filas/barras dibujadas, regla de años, etiquetas que solo aparecen cuando el nombre cabe, aislamiento al enfocar, detalle, pares empresa×proyecto y empresa×dominio con `+N`, lista de celda densa, 13 columnas con scroll horizontal, par inválido recayendo en el estado por defecto, sincronización de URL, chips deshabilitados y vista móvil 390×844. Se corrigieron en el camino: solape de etiquetas del último año, etiquetas recortadas dentro de barras estrechas, línea de rango que desbordaba el contenedor, cabeceras verticales sin límite de alto y columnas demasiado estrechas en móvil.
