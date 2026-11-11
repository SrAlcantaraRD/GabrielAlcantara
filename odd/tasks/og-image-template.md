# Sistema editable de og-image con puerta de legibilidad

Objetivo: sacar el lienzo de las tarjetas sociales fuera del generador (hoy es HTML dentro de un `.cjs`) a plantillas HTML editables y previsualizables, y sustituir el criterio «se lee» por una comprobación medida que el exportador hace fallar.

Rama: `feat/og-image-template`. Runner: `pnpm social:cards` + `pnpm test` + `pnpm build`.

## Specs

- **S1.** «lo unico leíble es el nombre "Gabriel Alcántara"». Ningún elemento de texto de una tarjeta baja de **34 px** en el lienzo de 1200×630, y el exportador termina en error, nombrando el elemento y su tamaño, cuando alguno lo hace. Justificación: a 504 px de ancho (el tamaño real de un feed) el factor es 0.42, así que 34 px llegan como ~14 px; los 16–18 px monoespaciados de hoy llegan como ~7 px.
- **S2.** «Vamos a montar un sistema como el de `/Users/gabrielalcantara/Documents/personal/projects/sport-analytics/website/docs/og-image`». El lienzo vive en `docs/og-image/card.html` como HTML autónomo, con las fuentes por ruta relativa a `node_modules`, y se previsualiza abriéndolo en el navegador sin servidor ni build.
- **S3.** La previsualización acepta `?kind=`, `?title=`, `?sub=`, `?eyebrow=`, `?footLeft=`, `?footRight=` y `?scale=`. `?scale=504` dibuja el lienzo al tamaño de un feed, para juzgar la legibilidad sin reducirlo a mano.
- **S4.** «hay 5 líneas de contenido, que no varien. Siempre igual, uniformidad. Tamaño de la letra fijo» — la tarjeta es una plantilla rígida de cinco ranuras, **un solo tipo de letra y dos tamaños**: `34` (dominio, antetítulo, entradilla, pie) y `96` (título). Cada ranura ocupa **una sola línea** en una caja de altura fija (52 / 40 / 110 / 40 / 65); las posiciones se derivan por `calc()` de esas alturas y de los dos huecos, no se escriben a mano. Las ocho rellenan las cinco.
- **S14.** «1 solo tipo de letra, nada de cursivas. En mayusuculas y en verde» — Newsreader en toda la tarjeta, sin cursivas ni segunda familia; antetítulo y entradilla en mayúsculas con tracking y en el verde de acento.
- **S15.** «El footer letras del mismo color y fuente, no verde» — el pie usa la misma familia y el mismo gris que el dominio; el acento queda solo en las dos etiquetas.
- **S16.** «reduce el espacio a la mitad, que hay arriba/abajo de Gabriel Alcantara» — los dos huecos contiguos al título son `--space-tight` (29), la mitad de `--space` (58); los márgenes absorben el resto (74.5) y siguen iguales entre sí.
- **S12.** «el color pasalo a verde, manteniendo tonalidad, brillo, contraste» — el acento es `#1b7343`, con L 0.4925 y C 0.1116 en OKLCH frente a 0.5182 y 0.1128 del terracota anterior, y contraste 5.53 contra 5.51 sobre el papel. La entradilla y el antetítulo van en ese acento.
- **S13.** «Estudia con regla y establece espacios simetricos» — los seis espacios salen de dos declaraciones (`--space`, `--space-tight`) más el margen calculado, y son idénticos en las ocho tarjetas. `export.mjs` los re-deriva de las cajas y los compara con lo declarado, con tolerancia de 0.5 px.
- **S5.** No hay ajuste automático. El copy se recorta para encajar y `export.mjs` rechaza la tarjeta cuyo texto no quepa en su ranura, se salga del lienzo, pase de una línea o deje una ranura vacía. Donde antes se encogía el título, ahora falla el export.
- **S10.** «habría que ajustar los copys para que entren» — el título corto de cada artículo vive en `PostMeta.cardTitle` y su entradilla en `PostMeta.cardSub`; `title` y `description` de la página no cambian. Las entradillas de caso se recortan en `tagline`, que ya era copy de tarjeta.
- **S11.** El antetítulo y la entradilla de la tarjeta por defecto se derivan de `SITE.location` y `SITE.roles`: ninguna cadena nueva que pueda desincronizarse.
- **S6.** Las tarjetas se escriben como PNG de exactamente 1200×630 (`og:image:type` en `Seo.astro` declara `image/png`) y por debajo de `--max-kb`; el exportador rechaza cualquier otra medida o peso.
- **S7.** `pnpm social:cards` sigue siendo el único punto de entrada, y sigue generando además `apple-touch-icon.png`, `icon-192.png` e `icon-512.png`.
- **S8.** `scripts/social-cards.json` cubre también `/og-image.png`, y detecta la deriva de **texto y de plantilla**: cambiar una entradilla, un título o `card.html` sin volver a exportar hace fallar `pnpm test`. El test comprueba además que cada tarjeta registrada sigue siendo un PNG de 1200×630.
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

### L7 · corrección de diseño: el manifiesto no puede hashear píxeles

El manifiesto guardaba el SHA-256 del PNG y el test lo comparaba. Con `--disable-lcd-text`, `--disable-font-subpixel-positioning`, `--run-all-compositor-stages-before-draw` y una carga por tarjeta, 1 de cada 6 corridas seguía moviendo **2 bytes de 2 268 000, Δ=1, en coordenadas fijas idénticas entre tarjetas distintas**: no era el texto, era la rasterización del motor. Un PNG que se ensucia 1 de cada 6 corridas hace que `pnpm social:cards` deje el árbol modificado sin que nadie haya cambiado nada.

Hashear la salida del motor no es un contrato sostenible. El manifiesto pasa a guardar `renderHash` = hash de `card.html` + el copy exacto de la tarjeta, que es lo que de verdad decide cómo se ve y sí es reproducible; el test comprueba forma del archivo (1200×630) en lugar de bytes. Seis corridas seguidas dan el mismo manifiesto. La puerta de legibilidad, que mide el resultado renderizado, sigue intacta y es la que protege lo que el dueño pidió.

### L8 · cambio de requisito: plantilla rígida

> me gustaría que las posiciones fueran fijas: hay 5 líneas de contenido, que no varien.  Siempre igual, uniformidad. Tamaño de la letra fijo. habría que ajustar los copys para que entren.

Decisiones del dueño: las cinco ranuras en las ocho tarjetas (dominio, antetítulo, título, entradilla, pie); título fijo a **76 px**; los títulos recortados viven **solo en la tarjeta**, la página conserva los suyos.

Medición que sostiene el recorte, con la tipografía real y 1040 px de ancho útil: a 96 px los cuatro títulos de artículo se pasan entre 379 y 1160 px; incluso a 64 px el más largo se pasa 427. El más largo necesitaría 45 px para caber en una línea, que es tamaño de entradilla. El recorte no era una preferencia, era la condición del sistema.

Copy resultante (`cardTitle` / `cardSub`; entradillas de caso en `tagline`):

| Página | Título de tarjeta | Entradilla |
| --- | --- | --- |
| DDD | DDD en dominios complejos | Límites, lenguaje común y decisiones al modelar. |
| WebSockets | WebSockets en tiempo real | El canal, el rol y la reconexión como diseño. |
| EDA | Arquitectura por eventos | Repartir responsabilidades, no añadir mensajería. |
| Industrial | Plataforma industrial conectada | El hardware marca el ritmo; la traza no es opcional. |
| Nakire TPS | Nakire TPS | Software distribuido para la operación industrial. |
| Bodega Digital | Bodega Digital | Inventario de vino con RFID y machine learning. |
| Pachanga | Pachanga Community | App y web de fútbol amateur, de principio a fin. |
| Por defecto | Gabriel Alcántara | Solutions Architect · Software Engineer |

La primera pasada de la puerta contó 6 ranuras en vez de 5: contaba elementos con texto y el pie tiene dos. Se corrigió marcando cada ranura con `data-slot`, así la comprobación es «las cinco, todas con texto» en lugar de un recuento de nodos.

### L9 · jerarquía, color y retícula

> noto inconsistencia visual, de jerarquia. el color pasalo a verde, manteniendo tonalidad, brillo, contraste y demás. En color accent Barcelona, remoto, Solutions Architect. Incrementa el tamaño de Gabriel Alcántara para que el espacio entre las letras inferiores e inferiore sea el mismo. Estudia con regla y establece espacios simetricos.

Medido antes de tocar: los seis espacios eran **71 / 62 / 19 / 54 / 158 / 60**. Ahí estaba la inconsistencia — un hueco de 19 px entre antetítulo y título y otro de 158 px antes del pie.

Cómo se resolvió:

1. Color por OKLCH, no por ojo: se conservaron L y C del terracota y se movió solo el tono a 154° (la familia del sage del sitio, 156°). El contraste resultante es 5.53 contra 5.51.
2. Título a 96 px: el presupuesto de la ranura baja a ~23 caracteres, así que se recortaron tres `cardTitle` (`Dominios complejos`, `WebSockets en operación`, `Plataforma conectada`).
3. La retícula se resolvió por geometría, no por píxeles. Primero intenté medir con bandas de tinta y descubrí dos cosas: un acento sobre mayúscula (`AUTOMATIZACIÓN`) crea una banda separada de 4 px, y los descendentes mueven el borde inferior. Se cambió a **caja tipográfica por ranura**, que es constante para todo texto: dispersión 0.00 entre las ocho tarjetas y 58 px exactos en los seis espacios.
4. La entradilla pasó a ser una sola familia (serif itálica) en las ocho: sans y serif tienen cajas de ascenso distintas y esa diferencia movía los huecos de arriba y abajo de la fila 6 px entre tarjetas.

La tinta sigue variando (59–83 px) porque la cola de la `Q` y los descendentes de `g`, `y`, `p` ocupan parte del hueco. Eso es del glifo, no del sistema: la línea base no se mueve, que es lo que gobierna el ritmo.

Se comprobó en rojo desviando `--y-sub` 10 px: el exportador responde «los seis espacios no son simétricos: [58.0, 58.0, 58.0, 68.0, 48.0, 58.0], dispersión 20.0px».

### L10 · una familia, etiquetas en verde y la mitad de aire en el título

> reduce el espacio a la mitad, que hay arriba/abajo de Gabriel Alcantara. 1 solo tipo de letra, nada de cursivas. En mayusuculas y en verde BARCELONA REMOTO SOLUTIONS ARCHITED SOFTWARE ENGINEER. El footer letras del mismo color y fuente, no verde.

Medido antes de maquetar, con la familia única: la entradilla a 44 px en mayúsculas **no entraba en ninguna de las ocho tarjetas** (+32 a +354 px). Bajarla a 34 la deja en el mismo cuerpo que el antetítulo, así que la escala queda en dos tamaños y sigue entrando (dos `cardSub` hubo que recortar: `Lenguaje común, límites y decisiones.` y `Repartir responsabilidades, no mensajería.`).

Decisiones de la pasada:

- Una familia, Newsreader, en las cinco ranuras; se eliminó la cara sans del archivo y el `@font-face` de la itálica, que ya no usa nadie.
- Antetítulo y entradilla: mayúsculas, tracking 0.06em, verde de acento.
- Pie y dominio: misma familia, gris `#6f6960`; el verde queda solo en las dos etiquetas.
- Huecos: `--space` 58 entre filas y `--space-tight` 29 alrededor del título; los márgenes (74.5) absorben lo que sobra y siguen iguales entre sí. Las cinco posiciones ya no son números escritos a mano: se derivan con `calc()` de las cinco alturas y los dos huecos.
- La puerta pasó de «seis espacios iguales» a «los seis espacios que la hoja declara», leyendo `--space`, `--space-tight` y `--margin` en tiempo de ejecución. Un `top` editado a mano ya no pasa.
- La línea de rol del pie dice «Solutions Architect · Software Engineer». `SITE.roles` sigue diciendo «Software Architect»: se dejó como constante de tarjeta con comentario en lugar de tocar los datos del sitio, que están en migración.

### L6 · verificación

`pnpm social:cards` (8 tarjetas + 3 iconos), `pnpm test` (50 pruebas), `pnpm build`. Revisión visual a 1200 px y a 504 px de las tres composiciones.
