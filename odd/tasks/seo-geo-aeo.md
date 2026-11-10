# SEO técnico, GEO y AEO con contenido de respuesta

Objetivo: cerrar los huecos de SEO técnico (sitemap derivado de datos, robots meta), GEO (llms.txt generado, crawlers de IA declarados) y AEO (FAQ visible con `FAQPage` y `Service` en `/services`).
Rama: trabajo directo sobre la rama actual. Runner: `pnpm test` + `pnpm build` + `pnpm ui:check`.

## Specs

- **S1.** «Lo único que sí te falta» — las páginas indexables emiten `<meta name="robots" content="max-image-preview:large" />`; las marcadas `noindex` mantienen `noindex, nofollow`.
- **S2.** `/projects/nakire-tps/` debe aparecer en el sitemap. Hoy el build genera 17 `<loc>` y solo `projects/bodega-digital/`, porque `STATIC_ROUTES` en `src/pages/sitemap.xml.ts` es una lista escrita a mano. Los casos de estudio se derivan de `PROJECT_CASES`.
- **S3.** `llms.txt` se genera desde los datos (`POSTS`, `PROJECT_CASES`, `SERVICES`, `SITE`) igual que el sitemap, y desaparece el `public/llms.txt` manual con cuatro enlaces que apuntan a `/projects/` en vez de al caso de estudio.
- **S4.** `robots.txt` declara explícitamente los crawlers de respuesta (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`) con `Allow: /`.
- **S5.** `/services` expone `Service` a partir de `SERVICES` y `FAQPage` a partir del mismo dato que renderiza las preguntas visibles.
- **S6.** «FAQ visible en /services» — hay una sección visible de preguntas y respuestas en `/services`; el copy sale solo de `site.ts`, `cv.ts` y `services`/`collaboration`, sin inventar métricas, precios, duraciones ni disponibilidad distinta de `SITE.availability`.
- **S7.** Un test detecta la deriva del sitemap y otro la de `llms.txt`: toda página estática de `src/pages` y todo post/caso debe tener entrada.
- **S8.** No se añade `lastmod` fabricado a las rutas estáticas: sin fecha real de modificación es peor que su ausencia.

## Tasks

- [x] T1 · S2 · inline · `src/lib/seo.ts` con `sitemapEntries()` derivado de datos
- [x] T2 · S2 · inline · `src/pages/sitemap.xml.ts` consume `sitemapEntries()`; entra `/projects/nakire-tps/`
- [x] T3 · S7 · inline · `tests/seo.test.ts`: cobertura de sitemap contra `src/pages`
- [x] T4 · S3 · inline · `src/pages/llms.txt.ts` generado; borrar `public/llms.txt`
- [x] T5 · S3,S7 · inline · cobertura de `llms.txt` en `tests/seo.test.ts`
- [x] T6 · S1 · inline · `src/components/Seo.astro` emite `max-image-preview:large`
- [x] T7 · S4 · inline · `public/robots.txt` con los cinco crawlers de IA
- [x] T8 · S6 · inline · `src/data/faq.ts` con preguntas y respuestas visibles
- [x] T9 · S5,S6 · inline · FAQ + `Service` + `FAQPage` en `src/pages/services.astro`
- [x] T10 · verificación · inline · `pnpm test`, `pnpm build`, `pnpm ui:check`

## Log

### L1 · petición original

> okay, pues toca ampliar para cubrir esos casos nuevos, buscamos optimizar seo geo y aeo.

### L2 · decisión de alcance

> FAQ visible en /services

### L3 · estado del repositorio antes del cambio

`Seo.astro` ya emite title, description, canonical (con normalización de `trailingSlash`), `noindex`, el set completo de Open Graph y Twitter, y un `@graph` JSON-LD con Person, WebSite, BreadcrumbList y nodos por página. `public/llms.txt`, `public/robots.txt` y `src/pages/sitemap.xml.ts` existen. Los tipos JSON-LD por página ya cubren `ProfilePage`, `CollectionPage`, `ItemList`, `BlogPosting`, `Blog`, `WebPage` y `ContactPage`.

### L4 · evidencia de los defectos

- `dist/sitemap.xml`: 17 `<loc>`; `grep -o "projects/[a-z-]*/"` devuelve solo `projects/bodega-digital/`. `src/pages/projects/nakire-tps.astro` existe y `src/data/projects.ts:45` declara `caseStudyHref: "/projects/nakire-tps/"`.
- `public/llms.txt`: Nakire TPS, LoveISDIN, MSyupply y Proyectos ACD enlazan a `/projects/`.
- `Seo.astro`: sin `max-image-preview:large`.
- `public/robots.txt`: `User-agent: *` genérico, sin crawlers de IA nombrados.

### L5 · defecto encontrado durante la implementación

El primer `sitemapEntries()` derivaba el caso de estudio como `caseStudyHref ?? /projects/<id>/`, copiando la regla de `scripts/social-cards.mjs`. Ese fallback es correcto solo para los dos casos que lo invocan con su href explícito. Aplicado a `PROJECT_CASES` completo inventó cinco URLs que ninguna ruta renderiza: `/projects/love-isdin/`, `/projects/msupply/`, `/projects/coleo/`, `/projects/acd-concursal-web/`, `/projects/shelter-gencat/`. El build lo destapó: 23 `<loc>` cuando el sitio tiene 18 rutas reales.

Corrección: `casePath()` devuelve `undefined` cuando no hay `caseStudyHref`, y el sitemap omite ese caso. Se añadió el test que cierra la clase entera: **toda** ruta del sitemap debe existir como página, post o categoría. Con el fallback antiguo ese test falla; con la corrección pasa.

### L6 · evidencia de verificación

- `pnpm test`: 48/48.
- `pnpm build`: 19 páginas, incluidas `/llms.txt` y `/sitemap.xml` como rutas.
- `pnpm ui:check`: 44/44.
- `dist/sitemap.xml`: 18 `<loc>`, con `projects/nakire-tps/` y `projects/bodega-digital/` y ninguna ruta inventada.
- `dist/index.html`: `<meta name="robots" content="max-image-preview:large">`; `dist/404.html`: `noindex, nofollow`.
- `dist/services/index.html`: 8 nodos `Service`, 1 `FAQPage` con 7 preguntas, y las 7 respuestas aparecen literalmente en el HTML visible.
- `dist/llms.txt`: generado, sin enlaces muertos.

### L7 · límites

- El copy del FAQ está en borrador: sale de `SITE`, `SERVICES`, `COLLABORATION`, `STACK_GROUPS` y `EDUCATION`, sin precios, duraciones ni disponibilidad distinta de `SITE.availability`. Requiere revisión editorial del propietario antes de publicarse.
- No hay commit: el árbol ya tenía trabajo en curso sin commitear (feature de Nakire TPS, `AskAiLinks.astro`, tarjetas sociales).

### L8 · revisión de copy contra VOICE.md

Revisión de Nivel B sobre el copy nuevo (FAQ y bloque inicial de `llms.txt`). VOICE.md §10 declara que no hay muestra de escritura directa en copy de producto ni FAQ: §7 solo tiene un brief de marketing marcado *provisional*. La revisión se apoya en las reglas generales (§3.1 concreción, §3.3 objeción, §3.8 registro, §3.10 «no aporta», §5 clichés, §8.2).

Corregido: «nuevos retos» (dos veces) eliminado por ser remate de tarjeta de presentación; «el modelo de colaboración es remoto por defecto» → «Trabajo en remoto desde Barcelona»; «con criterio propio antes de que el sistema crezca de más» → enumeración concreta tomada de `SERVICES`; «En prácticas» → «En métodos y testing», porque en español se lee como becarias; el separador de interfaz «·» sustituido por una coma en prosa.

Sin tocar por ser texto del propietario (§8.2 regla 13): «No trabajo como una agencia» y «si aporto valor», que ya existían en `site.ts` y en el cierre de `/services`.

Abierto para decisión editorial: «Especialidades» y «Áreas de trabajo» en `llms.txt` son dos listas solapadas (la inglesa replica `Person.knowsAbout` del schema, la española sale de `SPECIALTIES`); y la respuesta «¿Cómo empieza una colaboración?» repite casi literal la sección «Cómo trabajo» de la misma página.
