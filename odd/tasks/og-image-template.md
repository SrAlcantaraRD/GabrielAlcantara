# Sistema editable de og-image con puerta de legibilidad

Objetivo: sacar el lienzo de las tarjetas sociales fuera del generador (hoy es HTML dentro de un `.cjs`) a plantillas HTML editables y previsualizables, y sustituir el criterio «se lee» por una comprobación medida que el exportador hace fallar.

Rama: `feat/og-image-template`. Runner: `pnpm social:cards` + `pnpm test` + `pnpm build`.

## Specs

- **S1.** «lo unico leíble es el nombre "Gabriel Alcántara"». Ningún elemento de texto de una tarjeta baja de **34 px** en el lienzo de 1200×630, y el exportador termina en error, nombrando el elemento y su tamaño, cuando alguno lo hace. Justificación: a 504 px de ancho (el tamaño real de un feed) el factor es 0.42, así que 34 px llegan como ~14 px; los 16–18 px monoespaciados de hoy llegan como ~7 px.
- **S2.** «Vamos a montar un sistema como el de `/Users/gabrielalcantara/Documents/personal/projects/sport-analytics/website/docs/og-image`». El lienzo vive en `docs/og-image/card.html` como HTML autónomo, con las fuentes por ruta relativa a `node_modules`, y se previsualiza abriéndolo en el navegador sin servidor ni build.
- **S3.** La previsualización acepta `?kind=`, `?title=`, `?sub=`, `?eyebrow=`, `?footLeft=`, `?footRight=` y `?scale=`. `?scale=504` dibuja el lienzo al tamaño de un feed, para juzgar la legibilidad sin reducirlo a mano.
- **S4.** «Tres niveles: nombre, rol y una línea de cierre» — la escala es tres niveles, sin excepciones: `112 px` (nombre o título), `44 px` (rol o entradilla), `34 px` (dominio, antetítulo, pie). Desaparece la fila monoespaciada en mayúsculas con tracking.
- **S5.** El exportador ajusta el título midiendo el DOM: baja de 96 px hasta un mínimo de 56 px, nunca por debajo de 34 px, hasta que el título quepa en dos líneas y el bloque central quepa en su altura. El ajuste y la auditoría son actores separados: `card.html` hace que quepa, `export.mjs` comprueba que quepa.
- **S6.** Las tarjetas se escriben como PNG de exactamente 1200×630 (`og:image:type` en `Seo.astro` declara `image/png`) y por debajo de `--max-kb`; el exportador rechaza cualquier otra medida o peso.
- **S7.** `pnpm social:cards` sigue siendo el único punto de entrada, y sigue generando además `apple-touch-icon.png`, `icon-192.png` e `icon-512.png`.
- **S8.** `scripts/social-cards.json` cubre también `/og-image.png`, y detecta la deriva de **copy**, no solo de título: cambiar una entradilla sin volver a exportar hace fallar `pnpm test`. El hash del PNG sigue detectando una imagen editada a mano.
- **S9.** `docs/og-image/README.md` documenta el bucle completo (previsualizar → editar → exportar → verificar) y el README raíz apunta a él en lugar de describir el generador.

## Tasks

- [x] T1 · S1,S3,S4 · inline · `docs/og-image/card.html`
- [x] T2 · S3,S5,S6 · inline · `docs/og-image/export.mjs`
- [x] T3 · S7 · inline · `docs/og-image/icon.html` + pasada de iconos en el exportador
- [x] T4 · S8 · inline · `scripts/social-cards.mjs` con `copyHash`; borrar `scripts/generate-social-cards.cjs`
- [x] T5 · S8 · inline · `tests/social-cards.test.ts`: tarjeta por defecto cubierta y deriva de copy detectada
- [x] T6 · S9,S2 · inline · `docs/og-image/README.md` + sección del README raíz
- [x] T7 · verificación · inline · `pnpm social:cards`, `pnpm test`, `pnpm build`

## Slices

La rebanada completa son ~1100 líneas, por encima de las ~400 revisables, así que se entrega en cuatro commits sobre `feat/og-image-template`. Cada uno deja el árbol en verde.

1. `feat(social): add the share card artboards` — `card.html` e `icon.html`. Solo diseño: nada los consume todavía.
2. `feat(social): export the cards with a legibility gate` — `export.mjs`, `social-cards.mjs`, borrado del generador, `package.json` y los PNG regenerados. Es la unidad de comportamiento.
3. `test(social): …` — la cobertura del manifiesto.
4. `docs(social): …` — `docs/og-image/README.md`, README raíz y este documento.

Push, PR y merge quedan en manos del dueño.

## Log

### L1 · petición original

> el tema de la og-image tienen un par de problemas, lo unico leíble es el nombre "Gabriel Alcántara". Vamos a montar un sistema como el de /Users/gabrielalcantara/Documents/personal/projects/sport-analytics/website/docs/og-image, para poder editar/ajustar pedirte cambios, de la template de las og-image.

### L2 · diagnóstico medido

A 504 px de ancho el factor de escala es 0.42. Nombre 92 px → ~38 px efectivos (legible); rol 29 px → ~12 px (al límite); meta 21 px → ~9 px; antetítulo, dominio y pie monoespaciados 16–18 px → ~7 px (ruido). Cinco niveles tipográficos, uno solo supera el umbral de lectura. La fila monoespaciada en mayúsculas con tracking es el peor caso de renderizado a tamaño pequeño.

### L3 · decisión del dueño

Composición «Tres niveles: nombre, rol y una línea de cierre» — nombre 112, rol 44, cierre 34. Se conserva una línea de especialidad y la antigüedad; se pierde el matiz «automatización industrial» y el tracking monoespaciado.

### L4 · decisiones técnicas
- Un solo `card.html` con dos composiciones (`kind=default` y `kind=case|post`) en lugar de un archivo por composición: comparten cascarón y escala tipográfica, y duplicar el CSS los volvería a separar.
- No hay `build.mjs` equivalente al de sport-analytics: allí era necesario porque exportaban por canvas (`html-to-image`) y las fuentes por `file://` contaminaban el canvas. Aquí se captura el elemento con Playwright, así que las fuentes se cargan por ruta relativa y no hace falta inlinear nada.
- `playwright-core` ya es dependencia de desarrollo y `scripts/ui-check.mjs` ya lo usa con el Chrome del sistema: el exportador reutiliza ese mecanismo en lugar de `--headless=new` con archivos temporales.

### L5 · hallazgos al verificar

- El ajuste del título corría antes de que resolvieran las fuentes web y medía la cara de reserva: la primera tarjeta de una corrida se ajustaba a 94 px donde el ancho real admitía 96. Ahora `card.html` devuelve una promesa que espera `document.fonts.ready` antes de medir, y el exportador la espera. Confirmado con `--only`: antes 94 px, ahora los mismos 96 px que en la corrida completa.
- La captura no era estable byte a byte: dos corridas idénticas diferían en 2 bytes de 2 268 000, a un nivel de antialiasing, en columnas distintas según qué tarjeta se hubiera dibujado antes en la misma página. Se corrigió con una carga nueva por tarjeta (`goto` dentro del bucle) y con `--disable-lcd-text` y `--run-all-compositor-stages-before-draw`; siete corridas completas seguidas dieron el mismo hash.
- Queda una variación ocasional de ±1 nivel, invisible. No se persigue: `--only` refresca la entrada del manifiesto, así que el manifiesto siempre describe los bytes en disco y el test solo denuncia lo que de verdad cambió.
- La puerta de legibilidad se probó subiendo `MIN_FONT_PX` a 200: falla nombrando los cinco elementos y su tamaño, y se revirtió a 34.

### L6 · verificación

`pnpm social:cards` (8 tarjetas + 3 iconos), `pnpm test` (50 pruebas), `pnpm build`. Revisión visual a 1200 px y a 504 px de las tres composiciones.
