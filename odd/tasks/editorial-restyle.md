# Restyling editorial + fichas de etapa

Ajuste del sitio al mockup HTML que pasó el owner (papel cálido, serif/sans/mono, acentos cobalt/sage/terracotta) y sustitución de la lista de experiencia por fichas de etapa, manteniendo la matriz como única vista temporal.
Rama `feat/matrix-timeline`. Sin framework de UI: Astro + TypeScript.

## Specs

- **S1** — "ajusta la matrix y la trayectoria, según esto: `<!DOCTYPE html> …`" (mockup adjunto en el mensaje L1): la matriz y la trayectoria se reescriben en el lenguaje del mockup, con los mismos datos reales del CV.
- **S2** — "me gusta más el estilo y colores de lo que tepaso": se adopta su sistema visual: papel `#FAF8F5` y papel cálido `#F5F1EA`, tinta `#1A1A1A`, bordes finos `#E6E0D6`, acentos cobalt `#294C60`, sage `#3E5C49` y terracotta `#9E4E36`, tipografías Newsreader / Plus Jakarta Sans / JetBrains Mono, container de 64rem y etiquetas de sección en mono mayúsculas.
- **S3** — "La matriz es la trayectoria" (decisión del owner en L2): no se duplica la tira de barras del mockup; la matriz (con su modo por defecto año × empresa) es la única vista temporal y las fichas de etapa van debajo como lectura.
- **S4** — "los periodos vienen del .ts, que luego yo podré editar" (L3): todos los periodos y rangos viven en `src/data/cv.ts` y se derivan de ahí; ningún año se escribe a mano en componentes. Los periodos no se fusionan: se mantienen las cuatro etapas reales.
- **S5** — No se inventan hechos del mockup: se descartan las métricas y entidades ficticias (`14.2k TPS`, `+12 ingenieros`, `99.9% uptime`, Banco Sabadell, DataMesh Systems, CloudScale Nexus) y el teléfono de relleno. El contenido sale del CV publicado y del PRD del repo.
- **S6** — El contenido de las fichas de etapa se renderiza en el servidor con `<details>` nativo: sin JavaScript se lee entero. La ficha de proyecto (barras de la matriz, chips de proyecto) es una capa adicional en panel lateral.

## Tasks

- [x] **T1** — Tokens, tipografías y layout base. `src/styles/global.css`, `src/layouts/Layout.astro`, `package.json` — S2
- [x] **T2** — Datos editables: `ROLES` con periodos, proyectos resueltos desde su etapa y rango temporal derivado; eje `rol` en el motor. `src/data/cv.ts`, `src/lib/matrix.ts`, `tests/matrix.test.ts` — S4
- [x] **T3** — Ficha lateral de proyecto compartida. `src/components/DetailDrawer.astro` — S1, S6
- [x] **T4** — Fichas de etapa en `<details>`. `src/components/RoleTrajectory.astro` — S1, S3, S6
- [x] **T5** — Matriz restilizada con eje `rol` y apertura de ficha. `src/components/ExperienceMatrix.astro` — S1, S2
- [x] **T6** — Página editorial: cabecera, declaración, secciones, conocimientos, formación y pie. `src/pages/index.astro` — S2
- [x] **T7** — Verificación: tests, build, navegador (desktop/móvil), sin JavaScript.

## Commits

- `c847657` `feat(design): adopt the editorial paper design system` — tokens, fuentes, layout (T1).
- `b9091bb` `feat(data): model stages with editable periods` — `ROLES`, resolución de proyectos, rango derivado y eje `rol` (T2).
- `387c556` `feat(cv): rebuild the page around stage cards and a project drawer` — fichas, drawer, matriz restilizada y página (T3–T6).

Rebanadas: el conjunto suma ~1972 líneas añadidas y 820 borradas; la mayoría es reescritura de datos y de la página. Se deja en tres unidades temáticas en vez de partirlas artificialmente por archivo. Push y PR siguen siendo decisión del owner.

## Log

- **L1** (owner, verbatim): "ajusta la matrix y la trayectoria, según esto: `<!DOCTYPE html> …` (mockup editorial completo en el mensaje), además ,me gusta más el estilo y colores de lo que tepaso"
- **L2** (owner, decisión): vistas — "La matriz es la trayectoria".
- **L3** (owner, decisión): periodos — "los periodos vienen del .ts, que luego yo podré editar."
- **L4** (push-back, S5): el mockup trae métricas y entidades que no están en el CV (`14.2k TPS`, `+12 ingenieros`, `99.9% uptime`, Banco Sabadell, DataMesh Systems, CloudScale Nexus) y un teléfono de relleno. No se copiaron: un CV no puede afirmar lo que el owner no ha hecho. Sí se adoptó su sistema visual y su estructura editorial (cabecera, declaración, secciones, ficha lateral).
- **L5** (ajuste de accesibilidad): la tinta tenue del mockup (`#9E9992`) da 2.6:1 sobre el papel, por debajo del mínimo AA para texto. Se oscureció a `#736D64` (4.8:1) manteniendo el mismo papel en la jerarquía visual.
- **L6** (verificación): 23 tests del motor en verde, `astro build` en verde y 25 comprobaciones en Chrome headless sobre el HTML construido (modo por defecto, ejes y ejes deshabilitados, barras, fichas de etapa con sus periodos, ficha de proyecto con apertura/cierre por ESC, lista de celda densa, eje `rol`, par inválido, URL sincronizada, móvil 390×844 sin desbordamiento) más una pasada con JavaScript desactivado: las cuatro fichas y sus hitos siguen legibles.

- **L7** (continuación): el modelo pasó de "etapas" a "empresa → puesto → proyecto" y el diseño de fichas se reorganizó por empresa con duraciones. Ver `odd/tasks/matrix-ui-month-precision.md`.
