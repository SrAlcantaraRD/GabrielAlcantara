# i18n page generation

Objetivo: generar las páginas en `en` y `ca` desde una plantilla dinámica por tipo de página, con el español como base escrita. Rama de trabajo: la actual. Runner: `pnpm test` (`node --test`).

## Specs

- **S1.** `pnpm deploy:production` ejecuta el flujo completo antes de publicar: tests, build de Astro y comparación con el baseline de URLs. La publicación la hace el host; el comando es la puerta de producción. *(Supuesto: no hay destino de despliegue configurado en el repo.)*
- **S2.** Cada tipo de página traducida (`index`, `blog/index`, `projects/index`, `blog/[slug]`, `projects/[slug]`) existe en un único `.astro` bajo `src/pages/[lang]/`, y `getStaticPaths` genera una página por locale al hacer build.
- **S3.** El cuerpo redactado de cada página traducida vive en un solo archivo por locale bajo `src/editorial/bodies/`; no queda prosa traducida duplicada dentro de páginas.
- **S4.** Una tabla de rutas (`src/lib/routes.ts`) es la fuente única de `getStaticPaths`, `sitemap.xml`, `llms.txt` y los tests.
- **S5.** `tests/seo.test.ts` deja de descubrir rutas leyendo `src/pages` (hoy ignora las plantillas con `[`), y valida la tabla de rutas contra el baseline construido.
- **S6.** Las URLs, canonical y alternates hreflang no cambian (`pnpm url:baseline` sin diferencias) y los cuerpos traducidos son byte a byte idénticos a los originales de `git HEAD`.
- **S7.** Los 20 archivos de página traducida actuales desaparecen; el build sigue emitiendo 40 páginas.
- **S8.** Dos tests estructurales bloquean la regresión: las plantillas y `llms.txt` leen `src/lib/routes.ts`, y los cuerpos de `src/editorial/bodies/` coinciden exactamente con las rutas de la tabla.
- **S9.** Ninguna página de caso carga el CSS de un diagrama que no renderiza: cada diagrama escribe sus estilos en una hoja propia (`src/styles/<diagrama>.css`) que el componente enlaza con `<link>` al renderizarse, de modo que el `<style>` de un diagrama no entra en el grafo de una página que no lo muestra. Medido: las 6 páginas de caso traducidas bajan de 7.378 B a 2.047 B de CSS inline y cada una enlaza como mucho una hoja de diagrama.

## Tasks

- **T1. ✅** Tabla de rutas y `sitemapEntries()` derivado de ella. `src/lib/routes.ts`, `src/lib/seo.ts`.
- **T2. ✅** Cuerpos extraídos a `src/editorial/bodies/` con registro tipado (`src/editorial/bodies/index.ts`). Verificado: los 14 cuerpos son byte a byte idénticos al contenido original de `git HEAD`.
- **T3. ✅** Cinco plantillas dinámicas en `src/pages/[lang]/`.
- **T4. ✅** 20 archivos de página traducida borrados.
- **T5. ✅** `deploy:production` en `package.json` y README.
- **T6. ✅** Test de SEO reescrito sobre la tabla de rutas + baseline construido. Resultado: 87 tests en verde, 40 páginas, sin diferencias de URL.
- **T7. ✅** Revisión independiente: dos defectos encontrados y corregidos (registro único que arrastraba el CSS de los diagramas a los artículos; plantillas y `llms.txt` que no leían la tabla). Añadidos `tests/routes-source.test.ts` y `tests/bodies-integrity.test.ts`.
- **T8. ✅** CSS de los diagramas fuera del grafo de página: `src/styles/architecture-diagram.css` y `src/styles/pachanga-diagram.css`, enlazadas desde su componente con `?url` + `<link>`; `tests/diagram-css.test.ts` bloquea un `<style>` dentro de un diagrama y exige que la hoja cubra todas las clases del marcado. Medido: 7.378 B → 2.047 B de CSS inline en cada página de caso traducida; `architecture-diagram` (1.774 B) y `pachanga-diagram` (2.282 B) se sirven una vez y quedan cacheadas. Verificado en Chrome sobre los dos builds: 22 de 28 comparaciones de estilo computado idénticas, sin cambios de geometría; las 6 restantes son el tema oscuro del diagrama de Pachanga, que ahora sí aplica (L12).

## Log

- **L1.** «el flow de deploy prefiero que sea "pnpm deploy:production" y que venga ya con todo. Si es así, dale y haz el refactor.»
- **L2.** El baseline se capturó antes del refactor: 40 páginas, 21 con alternates, 1 con noindex (`/404.html`).
- **L3.** No hay destino de despliegue configurado (sin `netlify.toml`, `vercel.json`, `wrangler.toml` ni workflows). `deploy:production` ejecuta la puerta completa y deja `dist/`: tests → build → baseline. La publicación la hace el host.
- **L4.** El build tras el refactor emite las mismas 40 páginas con el mismo canonical y los mismos alternates: `pnpm url:baseline` sale sin diferencias.
- **L5.** La extracción de cuerpos se hizo con un script de una pasada; el diff contra `git HEAD` confirmó que solo cambió el envoltorio de la página, no la prosa.
- **L6.** `tests/seo.test.ts` ya no descubre rutas leyendo `src/pages` (ignoraba `[lang]`): compara la tabla de rutas contra `tests/fixtures/url-baseline.json` y el sitemap contra la tabla.
- **L7.** La verificación independiente midió el HTML emitido contra un build de `HEAD`: 34 de 40 páginas idénticas; las 8 de blog quedaron idénticas tras separar el registro de cuerpos de blog y de casos. Las 6 de caso traducidas conservan +5.331 B, +3.557 B y +1.774 B de CSS de diagramas ajenos al proyecto; es el precio de una plantilla única por tipo y no afecta al HTML renderizado ni al SEO.
- **L8.** `llms.txt` se genera ahora desde la tabla de rutas y su salida es byte a byte idéntica a la anterior.
- **L9.** `/en/` y `/ca/` cambian solo el nombre del asset CSS compartido (`LocalizedProfile.*.css` → `index.*.css`), con bytes idénticos.
- **L10.** «tenemos que atacar estos problemas Las 6 páginas de caso traducidas incluyen el CSS de los tres diagramas: +5.331 B (bodega-digital), +3.557 B (nakire-tps), +1.774 B (pachanga-community). Es el precio de una sola plantilla por tipo —su grafo contiene los tres cuerpos— y no afecta al HTML renderizado ni al SEO. Queda medido y documentado en odd/tasks/i18n-page-generation.md (S6, L7).»
- **L11.** Causa confirmada: no es la plantilla única sino el registro de cuerpos. `CASE_BODIES` importa los tres cuerpos de cada locale, así que el grafo de cada página de caso contiene los tres diagramas y Astro recoge sus `<style>` aunque el componente no se renderice. Un intento de carga perezosa (`() => import(...)`) emitió el mismo HTML: el reparto en chunks no cambia la recogida de estilos.
- **L12.** Verificación del cambio (T8): `pnpm test` 93 en verde, `pnpm url:baseline` sin diferencias, 40 páginas. Chrome sobre el build previo y el nuevo, 7 páginas × 2 temas × 2 anchos: 22 de 28 comparaciones de estilo computado y geometría idénticas; las 6 restantes son el tema oscuro del diagrama de Pachanga. Astro compilaba `[data-theme="dark"] .pd-box` como `[data-astro-cid-fgf6sato][data-theme=dark] .pd-box[data-astro-cid-fgf6sato]`, que exige el atributo de tema dentro del componente mientras `data-theme` vive en `<html>`: la regla estaba muerta. Al pasar a hoja global aplica los mismos tokens que el diagrama de arquitectura. Es una corrección, no una diferencia pendiente.
- **L13.** El HTML emitido cambia de forma acotada: desaparece el `<style>` de diagramas (y el `data-astro-cid-fgf6sato` del marcado de Pachanga), aparece un `<link rel="stylesheet">` antes de la figura del diagrama que sí se renderiza, y el marcado de arquitectura queda byte a byte idéntico.

