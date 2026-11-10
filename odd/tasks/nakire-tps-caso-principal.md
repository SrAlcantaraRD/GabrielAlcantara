# Nakire TPS como caso principal y Bodega Digital como su base

Objetivo: mover la narrativa distribuida a Nakire TPS (caso destacado) y reescribir Bodega Digital como el monolito monorepo del que salió.
Rama: trabajo directo sobre la rama actual. Runner: `pnpm test` + `pnpm build`.

## Specs

- **S1.** «el "software distribuido para operaciones industriales en tiempo real" fue el de Nakire TPS» — la frase y el caso de estudio distribuido pertenecen a Nakire TPS.
- **S2.** «el de bodegas, fue más simple con un monolito monorepo, FE + BE + BBDD» — Bodega Digital es un monolito monorepo con frontend, backend y base de datos.
- **S3.** «es cierto que tenía TDD y DDD» — DDD y TDD se quedan atribuidos a Bodega Digital.
- **S4.** «su estructura fue la base de NakireTPS (evolución de esa arquitectura…)» — la página de Bodega declara esa línea, y la de Nakire TPS la recoge.
- **S5.** «muevelo a Nakire TPS, que es el principal» — Nakire TPS pasa a `featured` y a caso de estudio principal.
- **S6.** «Puedes escribir el de Bodega Digital» — Bodega Digital mantiene su propia página, reescrita.
- **S7.** «que tiene su prime con Pachanga Community» — resuelto: Pachanga Community es un producto propio (app móvil React Native/Expo para organizar partidas de fútbol amateur, con dominio puro, Supabase, web en Ghost y despliegue propio). La frase se publica con ese contenido; ver L9 y L11.
- **S8.** No se inventan métricas, dispositivos ni fechas. Bodega no declara robots, PLC, Kafka ni microservicios; Nakire TPS no declara fechas propias.

## Tasks

- [x] T1 · S1-S4 · inline · datos en `src/data/cv.ts` (semillas de bodega-digital y nakire-tps)
- [x] T2 · S5-S6 · inline · `src/data/projects.ts` (destacado y narrativas)
- [x] T3 · S1 · inline · nueva página `/projects/nakire-tps/` + `ArchitectureDiagram`
- [x] T4 · S2-S4 · inline · reescritura de `/projects/bodega-digital/`
- [x] T5 · S1-S3 · inline · atribución en blog (`blog.ts` + 3 artículos)
- [x] T6 · S5 · inline · footer, sitemap, `public/llms.txt`, README, descripciones de `/projects/`
- [x] T7 · S5 · inline · tarjetas sociales (`scripts/social-cards.mjs`) + manifest
- [x] T8 · verificación · inline · `pnpm test`, `pnpm build`, revisión de enlaces

## Log

### L1 · petición original

> el "software distribuido para operaciones industriales en tiempo real" fue el de Nakire TPS, el de bodegas, fue más simple con un monolito monorepo, FE + BE + BBDD, es cierto que tenía TDD y DDD y que su estructura fue la base de NakireTPS (evolución de esa arquitectura que tiene su prime con Pachanga Community).

### L2 · alcance

> muevelo a Nakire TPS, que es el principal. Puedes escribir el de Bodega Digital

### L3 · estado del repositorio antes del cambio

El sitio atribuía a Bodega Digital el H1 «software distribuido para operaciones industriales en tiempo real», el core de agentes, un microservicio por familia de dispositivo, Kafka, Kubernetes, WebSocket y RBAC. Nakire TPS quedaba como una entrada corta sin caso de estudio. La página `docs/idea/plan-implementacion-gabrielalcantara-com.md` es el origen de ese copy y no se toca: es histórico.

### L4 · evidencia de verificación

- `pnpm test`: 36/36.
- `pnpm build`: 19 páginas, incluida `/projects/nakire-tps/`.
- `pnpm ui:check`: 44/44 comprobaciones.
- `pnpm social:cards`: 6 tarjetas, con `public/og/nakire-tps.png` nueva.
- `dist` ya no contiene «Bodega Digital: software distribuido».

### L5 · decisiones y límites

- Fechas aplicadas (todas dentro de la etapa Quabu):
  - Coleo: 2024.01–2024.03.
  - Quabu Atlassian Addons: 2024.01–2024.10, con mantenimiento transversal declarado en el resumen.
  - Bodega Digital: 2024.10–2025.02.
  - Nakire TPS: 2025.04–2026.07.
- Ningún proyecto de Quabu queda sin fechas: el reparto automático ya no actúa en esa etapa.
- Bodega Digital no declara robots, PLC, Kafka ni microservicios: solo monolito monorepo, FE + BE + BDD, DDD y TDD.
- `Pachanga Community` sigue sin definirse; no aparece en el sitio.
- Pendiente: Pachanga Community (ver L8).

### L8 · Ondunova, Essentialist y Pachanga Community

Datos del usuario:

> en ondunova fue una actualización de la app legacy que tenía y una ampliación, flutter + BE con ElyisJS, además de integrar lectores y sensores. Essentialist fue un liderar el equipo durante la baja del TechLead, y fue sobretodo tareas de analisis, spikes, pr reviews.

Aplicado:
- **Ondunova**: pilares mobile, integration, robotics; stack Flutter, Dart, ElysiaJS, lectores y sensores; resumen y logros reales.
- **Essentialist**: pilar lead; stack Technical Leadership; liderazgo durante la baja del TechLead, análisis, spikes y PR reviews.

Pachanga Community (fuente: `~/Documents/personal/projects/sport-analytics/mobile`, proyecto Engram `pachanga-app-mobile`; no hay memorias en Engram):
- App de fútbol amateur: equipos, ligas, temporadas, partidos, valoraciones entre jugadores («Yo Relativo»), jugadores fantasma y códigos de reclamación.
- React Native + Expo + TypeScript, Supabase, Drizzle, local-first con sincronización.
- Arquitectura: hexagonal + DDD + Atomic Design.
- Identificador de Play Store `com.alcantaramoreno.pachanga`; primer commit 2026-07-16; sigue activo.
- **Pendiente de decisión**: cómo entra en el CV. El modelo actual obliga a colgarla de una empresa y un puesto, lo que cambiaría el contador de empresas y la línea temporal de empleo. No se ha añadido.
- Los cambios quedan sin commit: la rama actual es `main` y el usuario no lo pidió.

### L6 · parón de Nakire TPS (resuelto)

> sería algo más o menos: - Coleo: 2024.01 → 2024.03
> - Bodega Digital Fase I: 2024.03 → 2024.07
> - Atlassian Addons: 2024.07 to 2024.10
> - Bodega Digital Fase 2: 2024.10 → 2025.02
> - Ondunova: feb 2025 → abr 2025
> - Nakire TPS Fase I MVP: 2025.04 → 2025.07
> - Essentialist: 2025.07 to 2025.09
> - Nakire TPS Fase II: 2025.09 → 2026.06

Modelado con una ficha por producto y las fases declaradas en el resumen y en los logros, porque `resolveProjects` solo admite un tramo continuo por proyecto. Fechas efectivas:

| Proyecto | Periodo |
| --- | --- |
| Coleo | 2024.01–2024.03 |
| Bodega Digital | 2024.03–2025.02 (Fase I mar–jul 2024; Fase II oct 2024–feb 2025) |
| Quabu Atlassian Addons | 2024.07–2024.10 |
| Ondunova | 2025.02–2025.04 |
| Nakire TPS | 2025.04–2026.06 (Fase I MVP abr–jul 2025; Fase II sep 2025–jun 2026) |
| Essentialist | 2025.07–2025.09 |

Ondunova y Essentialist entran sin pilares y con un resumen de posición, no de contenido: falta una línea real de qué fue cada uno.

Nota: otra sesión reescribió `sitemap.xml.ts` y sustituyó `public/llms.txt` por `src/pages/llms.txt.ts`, ambos derivados de `src/lib/seo.ts`. Los cambios manuales que había hecho en esos dos ficheros quedaron obsoletos y no se han repuesto; la ruta de Nakire TPS aparece por `caseStudyHref`.

### L7 · corrección de dominio: Bodega Digital es vino, no almacén

Fuente: https://www.tecnovino.com/bodega-digital-una-herramienta-inteligente-para-la-gestion-del-inventario-de-vino

Bodega Digital es una herramienta de inventario de vino para bodegas y empresas vinícolas, no un sistema de automatización de almacenes. El «bodega» de la etapa anterior era bodega de vino.

Hechos comprobados en el artículo:
- Proyecto financiado por el Ministerio de Industria, Comercio y Turismo y NextGenerationEU.
- Dos fases: RFID (tags UHF en el cuello de botella) + predicción de demanda con machine learning; después, visión por computadora para refinar el inventario.
- Consorcio de seis socios: Clúster Digital de Cataluña, INNOVI, Grupo ICA, Quabu Solutions, Raw Data y DO5 Hispanobodegas.
- Quabu Solutions: socio tecnológico, desarrollo de software e integración.

Cambios aplicados:
- Nuevo dominio `agrifood` → «vino y agroalimentación» en `DOMAIN_LABEL` y `DOMAIN_ORDER`.
- Bodega Digital: pilares web, mobile, data, integration, robotics; stack con RFID, IoT, ML, Computer Vision, Blockchain y Mobile.
- Página `/projects/bodega-digital/` reescrita (contexto, problema, restricciones, rol, arquitectura, integraciones, resultados, aprendizajes).
- `projects.ts`: área «Vino y agroalimentación», problema, decisión, resultado y tagline nuevos.
- Artículo de DDD reescrito: el vocabulario de ejemplo pasa de tareas/carretillas/picking a botellas/referencias/añadas/lotes; los adaptadores pasan de microservicios por dispositivo a RFID, visión y predicción.
- `arquitectura-orientada-a-eventos` deja de citar Bodega (es un monolito sin EDA).
- Nakire TPS pasa a decir «almacén» en vez de «bodega» para no chocar con el proyecto del vino.
- Resumen del puesto Quabu actualizado: ya no lo describe solo como automatización de almacenes.

### L9 · Pachanga Community: producto propio + caso de estudio

> producto propio + caso de estudio, pues es mucho lo que aprendo de la compljidad de llevarto todo yo, ya que tambien tiene la web /Users/gabrielalcantara/Documents/personal/projects/sport-analytics/website, que viene con tralla, y la parte de dokploy... telita.

Decisión: entrada propia de producto propio en la trayectoria **y** caso de estudio.

Aplicado:
- `COMPANIES` + Pachanga Community (accent sage).
- `POSITIONS` + `pachanga-own`, «Arquitecto y desarrollador · producto propio», 2026.07–2026.11, modo «producto propio».
- `PROJECT_SEEDS` + `pachanga-community`, pilares mobile, web, data, cloud, lead.
- `projects.ts` + caso «Producto propio», tercero en el orden, con `caseStudyHref: /projects/pachanga-community/`.
- Página nueva `/projects/pachanga-community/`: arquitectura móvil (hexagonal sobre DDD + Atomic Design, dominio puro con Zod, Supabase y Drizzle tras puertos), dominio (equipos, temporadas, jugadores fantasma, códigos de reclamación, «Yo Relativo»), web en Ghost con tema generado y tres idiomas, enlaces universales AASA/assetlinks con fallback a tienda, y despliegue Docker + Traefik sobre Dokploy.
- Tarjeta social `public/og/pachanga-community.png`.
- Contadores y etiquetas: «empresas» → «etapas» en pie, home, CV, experiencia y `aria-label` de la matriz, para no contar un producto propio como empleador.

Verificación: `pnpm test` 48/48, `pnpm build` 20 páginas, `pnpm ui:check` 44/44, `pnpm social:cards` 7 tarjetas.

Nota: el caso de estudio no menciona ingresos ni métricas de negocio. El «revenue 0» es contexto del usuario, no contenido publicable.

### L10 · Diagrama de arquitectura en el caso de Pachanga

Añadido `src/components/PachangaDiagram.astro`: SVG escrito a mano, sin runtime, con dos paneles.

- Izquierda, flujo real: `src/app/` (Expo Router) → hooks de dominio → casos de uso → puertos `I*Port` → (frontera del dominio) ← adaptadores `src/adapter` → Supabase. Flecha ascendente del adaptador al puerto.
- Derecha, UI: particles → atoms → molecules → organisms → layouts → screens, con nota de que cada capa compone la anterior y que las pantallas solo hablan con los hooks.

Insertado en la sección «Arquitectura móvil» con un párrafo `diagram-alt` que repite la estructura en texto, igual que el diagrama de Nakire TPS. Verificado con captura real a 2x y `pnpm ui:check` 44/44.

### L11 · S7 cerrado: qué es Pachanga Community

El bloqueo de S7 no era editorial, era de referente: faltaba saber qué es Pachanga Community para poder escribir la frase sin inventarla. Fuentes consultadas, todas del propietario:

- `sport-analytics/mobile/README.md`: «Pachanga Community organiza tus pachangas de fútbol: los partidos de tu grupo en un solo sitio». Datos guardados en el móvil y sincronizados con la nube; sin perfiles públicos indexados ni venta de información.
- `sport-analytics/website/README.md`: marketing site, host de Universal Links y CMS Ghost para `pachangaapp.com`; tres idiomas (es/ca/en), AASA y `assetlinks.json`, fallback `/deep-link/` a App Store y Play Store. Release pública en App Store 1.0.7 (2026-10-18).
- `mobile/src/ui/screens/team/components/organisms/leaderboard/`: pantalla de clasificación por equipo con pestañas de métrica y podio.
- Engram #1562: diagrama de arquitectura del caso (Expo Router → hooks → casos de uso → puertos `I*Port` ← adaptadores → Supabase; Atomic Design en la UI).

Conclusión: producto propio, no cliente ni empleador. S7 queda cerrado; las líneas 59-60 del log se dejan como estaban porque registran el estado en ese momento, no el actual.

Verificación de este cierre: `pnpm test` 48/48, `pnpm build` 20 páginas, `pnpm ui:check` 44/44.
