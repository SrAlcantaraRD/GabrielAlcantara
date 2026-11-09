# Matriz: precisión por mes y UI editorial

Completar la experiencia con los puestos reales (13 posiciones con fecha de mes) y llevar la UI de la matriz a un estado cuidado: barras precisas al mes, ventana temporal por empresa, tooltip y jerarquía visual.
Rama `feat/matrix-timeline`.

## Specs

- **S1** — "vamos a hacer focus en la UI, sobretodo en la matrix": la matriz es la pieza central y recibe el trabajo fino de interacción, tipografía, densidad y estados.
- **S2** — "vamos a completar mi experiencia con: …" (volcado de LinkedIn en L1): el dataset pasa de 4 etapas a las **13 posiciones reales** con sus fechas a mes, lugar, modo, skills y proyectos por puesto.
- **S3** — La unidad temporal interna es el **mes**; el eje `año` sigue mostrando años, pero la posición y el ancho de cada barra son exactos al mes (necesario para puestos de 3–5 meses).
- **S4** — Jerarquía de datos: **empresa → puesto → proyecto**. El color de la barra codifica la empresa (cobalt/sage/terracotta), no el pilar; los pilares quedan como etiquetas.
- **S5** — La experiencia se lee agrupada por empresa, con la duración total calculada, y cada puesto muestra su resumen, hitos, proyectos y stack. Todo en el servidor.
- **S6** — No se inventan hechos: se usa el volcado del owner tal cual (fechas, títulos, lugares, skills). Las métricas que no aparecen no se añaden.

## Tasks

- [x] **T1** — Utilidades de periodo (parsear `YYYY-MM`, etiquetas, duraciones) con tests. `src/lib/period.ts`, `tests/period.test.ts` — S3
- [x] **T2** — Datos: empresas, 13 puestos, 22 proyectos, resolución validada y rangos en meses. `src/data/cv.ts` — S2, S4
- [x] **T3** — Motor en meses: eje `puesto`, rango por meses, geometría exacta y etiquetas desambiguadas. `src/lib/matrix.ts`, `tests/matrix.test.ts` — S3
- [x] **T4** — Matriz: ventana temporal por empresa, barras al mes, tooltip, líneas de año, leyenda de empresas y estados de hover/foco. `src/components/ExperienceMatrix.astro` — S1, S4
- [x] **T5** — Trayectoria agrupada por empresa con duración y puestos. `src/components/RoleTrajectory.astro` — S5
- [x] **T6** — Página: conteos, copy alineado con las fechas nuevas y ajustes de encabezado. `src/pages/index.astro` — S2, S5
- [x] **T7** — Verificación: tests, build, navegador (desktop/móvil, ambos modos, ventana, tooltip) y sin JS.
- [x] **T8** — Reparto aproximado de los proyectos de cada puesto en tramos secuenciales; los que tienen fechas propias se respetan. `src/data/cv.ts`, `tests/matrix.test.ts` — S2, S7
- [x] **T9** — UI: barras sólidas con la tinta de la empresa, banda de la etapa detrás, línea de "hoy", regla de años que se adapta a la regla visible, modo matriz sin regla fija, etiquetas legibles en móvil y timeline con scroll horizontal en pantallas pequeñas. `src/components/ExperienceMatrix.astro`, `src/pages/index.astro` — S1, S7
- [x] **T10** — Verificación de UI reproducible: `scripts/ui-check.mjs` con Playwright sobre Chrome del sistema, capturas en `ui-artifacts/` y `pnpm ui:check`. — S7

## Commits

- `188f9ff` `feat(period): measure the timeline in months` (T1).
- `67415dd` `feat(data): rebuild the career timeline from the linkedin export` (T2, T3).
- `1dcf31c` `feat(ui): month-precise matrix with a time window and a tooltip` (T4–T6).

- **S7** — "es poco realista eso de estar en proyectos a la vez, solapados durante tanto tiempo (ajusta de forma aproximada). además parece que los años sean fijos (auqnue varie X). Le falta cariño a ese componente ,prueba con playwirght + captura, y ajusta la UI para que la UX sea exceccional": los proyectos de un puesto se reparten en tramos consecutivos (el export no da fechas por proyecto), el eje temporal deja de dibujarse como escala fija cuando X no es el tiempo, y la matriz se pule con verificación visual real.

## Log

- **L1** (owner, verbatim, extracto): "vamos a hacer focus en la UI, sobretodo en la matrix. vamos a completar mi experiencia con: Experiencia … Quabu Solutions · ene. de 2024 - ago. de 2026 · 2 años 8 meses … Basetis … Senior Technical Team Lead mar. de 2021 - abr. de 2024 … Full Stack Developer sept. de 2020 - mar. de 2021 … oct. de 2019 - sept. de 2020 … jun. de 2018 - oct. de 2019 … Siebel Developer dic. de 2017 - jun. de 2018 … Web Software Developer ago. de 2017 - dic. de 2017 … ACD SISTEMES SL … sept. de 2016 - abr. de 2017 … jul. de 2016 - sept. de 2016 … abr. de 2016 - jul. de 2016 … sept. de 2015 - abr. de 2016 … sept. de 2013 - sept. de 2015 … dic. de 2011 - sept. de 2013" (volcado completo de LinkedIn, incluido el detalle técnico de Quabu, en el mensaje del owner).
- **L2** (verificación): 30 tests en verde (`pnpm test`), `astro build` en verde y 31 comprobaciones en Chrome headless: modo por defecto, 22 barras, ventanas por empresa, rango recalculado, URL con `w`, eje de puestos, tooltip con proyecto/puesto/duración, ficha de proyecto, modo matriz 3×13, y móvil 390×844 sin desbordamiento.
- **L3** (decisiones de UI tomadas al ver): la regla de años se alinea a años completos (si no, la etiqueta del año parcial chocaba con la siguiente); el rótulo de "hoy" solo aparece cuando la ventana llega al presente; las filas de puesto admiten dos líneas para que la desambiguación ("· jul 2016") se lea; el color de la barra codifica la empresa y el pilar queda como etiqueta.
- **L4** (hallazgo de los datos reales): el volcado implica un solape de cuatro meses entre Basetis (hasta abr 2024) y Quabu (desde ene 2024). No se corrigió: la matriz lo muestra tal cual y la ventana de Quabu incluye esos proyectos de Basetis en ese tramo.
- **L5** (owner, verbatim): "es poco realista eso de estar en proyectos a la vez, solapados durante tanto tiempo (ajusta de forma aproximada). además parece que los años sean fijos (auqnue varie X). Le falta cariño a ese componente ,prueba con playwirght + captura, y ajusta la UI para que la UX sea exceccional".
- **L6** (decisiones): los proyectos sin fechas propias de un puesto se reparten en tramos consecutivos del mismo tamaño (resto al principio), en el orden en que están escritos; un proyecto puede fijarse con `from`/`to` y así se hizo con Bodega Digital, que abarcó toda la etapa de Quabu. En modo matriz se elimina la regla superior de años (era una escala fija que no correspondía al eje X) y el panel avisa de que cada celda recorre la línea temporal completa. Las barras pasan a relleno sólido con la tinta de la empresa, la etapa se dibuja como banda tenue detrás y una línea discontinua marca hoy.
- **L7** (verificación): 32 tests del motor, `astro build`, y 44 comprobaciones de UI con Playwright en Chrome del sistema sobre 6 escenarios × 2 viewports (primera sección, barras, sin desbordamiento, tooltip, ficha abierta, ausencia de tooltip sobre la ficha, ausencia de regla fija en modo matriz). Encontró y se corrigieron: desbordamiento horizontal de la página en móvil (el `grid` de `main` imponía el ancho mínimo de la matriz), la regla fija en modo matriz, la tooltip quedándose encima de la ficha, y etiquetas de puesto ilegibles en móvil.
