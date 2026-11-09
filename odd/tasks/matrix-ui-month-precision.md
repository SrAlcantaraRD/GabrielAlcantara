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

## Commits

- `188f9ff` `feat(period): measure the timeline in months` (T1).
- `67415dd` `feat(data): rebuild the career timeline from the linkedin export` (T2, T3).
- `1dcf31c` `feat(ui): month-precise matrix with a time window and a tooltip` (T4–T6).

## Log

- **L1** (owner, verbatim, extracto): "vamos a hacer focus en la UI, sobretodo en la matrix. vamos a completar mi experiencia con: Experiencia … Quabu Solutions · ene. de 2024 - ago. de 2026 · 2 años 8 meses … Basetis … Senior Technical Team Lead mar. de 2021 - abr. de 2024 … Full Stack Developer sept. de 2020 - mar. de 2021 … oct. de 2019 - sept. de 2020 … jun. de 2018 - oct. de 2019 … Siebel Developer dic. de 2017 - jun. de 2018 … Web Software Developer ago. de 2017 - dic. de 2017 … ACD SISTEMES SL … sept. de 2016 - abr. de 2017 … jul. de 2016 - sept. de 2016 … abr. de 2016 - jul. de 2016 … sept. de 2015 - abr. de 2016 … sept. de 2013 - sept. de 2015 … dic. de 2011 - sept. de 2013" (volcado completo de LinkedIn, incluido el detalle técnico de Quabu, en el mensaje del owner).
- **L2** (verificación): 30 tests en verde (`pnpm test`), `astro build` en verde y 31 comprobaciones en Chrome headless: modo por defecto, 22 barras, ventanas por empresa, rango recalculado, URL con `w`, eje de puestos, tooltip con proyecto/puesto/duración, ficha de proyecto, modo matriz 3×13, y móvil 390×844 sin desbordamiento.
- **L3** (decisiones de UI tomadas al ver): la regla de años se alinea a años completos (si no, la etiqueta del año parcial chocaba con la siguiente); el rótulo de "hoy" solo aparece cuando la ventana llega al presente; las filas de puesto admiten dos líneas para que la desambiguación ("· jul 2016") se lea; el color de la barra codifica la empresa y el pilar queda como etiqueta.
- **L4** (hallazgo de los datos reales): el volcado implica un solape de cuatro meses entre Basetis (hasta abr 2024) y Quabu (desde ene 2024). No se corrigió: la matriz lo muestra tal cual y la ventana de Quabu incluye esos proyectos de Basetis en ese tramo.
