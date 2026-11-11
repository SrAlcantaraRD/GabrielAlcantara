# Sistema editable de og-image con puerta de legibilidad

Objetivo: sacar el lienzo de las tarjetas sociales fuera del generador (hoy es HTML dentro de un `.cjs`) a plantillas HTML editables y previsualizables, y sustituir el criterio «se lee» por una comprobación medida que el exportador hace fallar.

Rama: `feat/og-image-template`. Runner: `pnpm social:cards` + `pnpm test` + `pnpm build`.

## Specs

- **S1.** «lo unico leíble es el nombre "Gabriel Alcántara"». Ningún elemento de texto de una tarjeta baja de **34 px** en el lienzo de 1200×630, y el exportador termina en error, nombrando el elemento y su tamaño, cuando alguno lo hace. Justificación: a 504 px de ancho (el tamaño real de un feed) el factor es 0.42, así que 34 px llegan como ~14 px; los 16–18 px monoespaciados de hoy llegan como ~7 px.
- **S2.** «Vamos a montar un sistema como el de `/Users/gabrielalcantara/Documents/personal/projects/sport-analytics/website/docs/og-image`». El lienzo vive en `docs/og-image/card.html` como HTML autónomo, con las fuentes por ruta relativa a `node_modules`, y se previsualiza abriéndolo en el navegador sin servidor ni build.
- **S3.** La previsualización acepta `?kind=`, `?title=`, `?sub=`, `?eyebrow=`, `?footLeft=`, `?footRight=` y `?scale=`. `?scale=504` dibuja el lienzo al tamaño de un feed, para juzgar la legibilidad sin reducirlo a mano.
- **S4.** «hay 5 líneas de contenido, que no varien. Siempre igual, uniformidad. Tamaño de la letra fijo» — la tarjeta es una plantilla rígida de cinco ranuras, **tres caras y tres tamaños** (S14): `34` en mono (dominio, antetítulo, pie), `34` en sans (entradilla) y `96` en serif light (título). Cada ranura ocupa **una sola línea** en una caja de altura fija (34 / 34 / 96 / 46 / 34); las posiciones se derivan por `calc()` de esas alturas y de los dos huecos, no se escriben a mano. Las ocho rellenan las cinco.
- **S14.** «1 solo tipo de letra, nada de cursivas. En mayusuculas y en verde» → **sustituida por L11: la tarjeta usa el sistema tipográfico del sitio.** JetBrains Mono para las etiquetas micro en mayúsculas con tracking, Newsreader 300 para el título y Plus Jakarta Sans para la entradilla. Sin cursivas.
- **S15.** «El footer letras del mismo color y fuente, no verde» → el pie sigue en mono y en el gris apagado `#6f6960`, como la cabecera de la tarjeta; el acento queda solo en el antetítulo. Sustituida en la práctica por L11: la familia del pie es ahora la mono del sitio.
- **S16.** «reduce el espacio a la mitad, que hay arriba/abajo de Gabriel Alcantara» — los dos huecos contiguos al título son `--space-tight` (18), el más pequeño de la retícula, y la caja del título es exactamente su cuerpo (96), así que las tres líneas centrales leen como un bloque. Los márgenes absorben el resto (97) y siguen iguales entre sí.
- **S12.** «el color pasalo a verde…» (L9) → **sustituida por L11: el acento es el terracota del sitio, `#9e4e36`**, el mismo de sus antetítulos. El verde queda como señal de disponibilidad: texto `#3e5c49` con punto `#059669`, tal y como lo pinta el hero.
- **S13.** «Estudia con regla y establece espacios simetricos» — los seis espacios salen de dos declaraciones (`--space` 78, `--space-tight` 18) más el margen calculado (97), y son idénticos en las ocho tarjetas: `97 / 78 / 18 / 18 / 78 / 97`. `export.mjs` los re-deriva de las cajas y los compara con lo declarado, con tolerancia de 0.5 px.
- **S5.** No hay ajuste automático. El copy se recorta para encajar y `export.mjs` rechaza la tarjeta cuyo texto no quepa en su ranura, se salga de la **columna de contenido** (80 px de margen), pase de una línea o deje una ranura vacía. Donde antes se encogía el título, ahora falla el export.
- **S10.** «habría que ajustar los copys para que entren» — el título corto de cada artículo vive en `PostMeta.cardTitle` y su entradilla en `PostMeta.cardSub`; `title` y `description` de la página no cambian. Las entradillas de caso se recortan en `tagline`, que ya era copy de tarjeta, y el pie de un caso lista como mucho tres tecnologías: a 34 px una cuarta invade el margen.
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
- [x] T8 · S4,S5,S10,S12,S13,S14,S15,S16 · inline · `docs/og-image/card.html`, `docs/og-image/export.mjs`, `scripts/social-cards.mjs`, PNG y manifiesto regenerados, `docs/og-image/README.md`
- [x] T9 · S3,S4 · inline · `docs/og-image/editor.html` (taller visual) + sección en `docs/og-image/README.md`
- [x] T10 · S3,S4,S13 · inline · marca, reglas y alineación en `docs/og-image/editor.html`

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

### L11 · cambio de requisito: la tarjeta adopta la estética del sitio

> vamos a mejorar el og-image. Tal y como está ahora, es asquero y no sigue la estetica de la web. Además, de está está desproporcionado y con demasiado aire entre el bloque central (3 lineas)

Diagnóstico de lo que había, contra la web real: la tarjeta usaba Newsreader
para todo (el sitio reserva la serif al display y usa mono para cada etiqueta
micro), verde `#1b7343` en dos etiquetas (el sitio acentúa con terracota y
reserva el verde a la disponibilidad), un logo que no existe en el sitio, dos
degradados radiales y cinco cajas de 52/40/110/40/65 con huecos de 58: el título
respiraba 110 px para un cuerpo de 96 y el bloque central se deshacía.

Cómo se resolvió:

1. Tres familias, las mismas del sitio y cargadas de `node_modules` por ruta
   relativa: JetBrains Mono para las cinco etiquetas micro, Newsreader 300 para
   el título, Plus Jakarta Sans para la entradilla. Sin cursivas.
2. Composición de cabecera editorial: filo de filete bajo el dominio y sobre el
   pie, los dos a 24 px de su fila, que es lo que cierra el bloque sin añadir
   texto. Se fueron el logo y los degradados.
3. El bloque central se aprieta por geometría: la caja del título pasa a 96 (una
   línea exacta, sin aire de interlineado) y los dos huecos contiguos a 18, con
   los márgenes en 97. Los seis espacios quedan `97 / 78 / 18 / 18 / 78 / 97`.
4. Acento terracota `#9e4e36` en el antetítulo; el verde vuelve a su papel del
   sitio: punto y texto de disponibilidad en la cabecera. La disponibilidad es
   copy (`status`), no un adorno del CSS.
5. Un caso lista tres tecnologías en el pie. Con cuatro, `React Native · Expo ·
   TypeScript · Supabase` empujaba `2026` fuera de la columna.

Dos agujeros de la puerta que aparecieron al rediseñar:

- `--margin` es un `calc()`, y una custom property conserva su texto de origen:
  `Number.parseFloat` devolvía `NaN` y la comparación de los dos espacios
  exteriores nunca se ejecutaba. Ahora se mide con una sonda de `width:
  var(--margin)`. Verificado desviando `--y-sub` 10 px: falla con
  `[97.0, 78.0, 18.0, 28.0, 78.0, 87.0]`.
- La puerta comparaba contra el lienzo de 1200, no contra la columna de 1040, así
  que un pie que invadía los 80 px de margen pasaba. Ahora exige la columna y lo
  nombra. Verificado con el pie de cuatro tecnologías: `span#footRight se sale
  de su columna («2026»): 1041,499 → 1126,533`.

Un primer intento fue un pie con píldoras (la `.pill` del sitio). Se descartó: a
34 px la píldora de `sistemas distribuidos` pesa más que el título y la tarjeta
pasaba de cartel a ficha de catálogo.

Verificación: `pnpm social:cards` (8 tarjetas, mínimo 34 px, espacios idénticos),
`pnpm test` (72 pruebas), `pnpm build`, y revisión de las ocho a 1200 y a 504 px.

### L12 · el taller visual

> sabes que. genera un html donde yo pueda editar las pocicinoes, tamaño, colores, etc.. y texto. Así será más rápido construir lo que quiero.

`docs/og-image/editor.html`: el mismo lienzo de 1200×630 con panel de control, sin
servidor ni build, con las fuentes del sitio por ruta relativa.

Decisiones:

- Se arrastran **filas**, no cajas sueltas: la tarjeta es una retícula de cinco, y
  arrastrar el título fuera de su fila rompería lo que la puerta defiende. El
  arrastre escribe un desplazamiento (`dx`, `dy`), no un `top` absoluto, así que
  los huecos siguen derivando las cinco posiciones y el JSON exportado se puede
  portar sin reinterpretar nada.
- Las ranuras referencian **tokens de color por nombre** (`ink`, `accent`, …), no
  valores sueltos: cambiar el acento en el panel retiñe lo que lo use, y el JSON
  sale ya en el vocabulario de `card.html`.
- El taller mide lo mismo que la puerta: si una fila no cabe o baja de 34 px, la
  marca en rojo y lo dice en la línea de cierre. Un diseño no puede celebrarse
  como bueno si el exportador lo va a rechazar.
- Las ocho copias reales están dentro (instantánea de `scripts/social-cards.mjs`)
  para juzgar cada título en su sitio, no solo el de la portada.
- El estado vive en `localStorage` y la sección **Salida** emite el `:root`
  resultante y un JSON con geometría resuelta. Ese JSON es el contrato de vuelta:
  el taller dibuja, el exportador decide.

Verificación en navegador: arrastre (dy 30 con zoom 0.7 → 21 px de pantalla),
cambio a 504, cambio de copy real, título a 120 px (1038/1040, al borde), recarga
con el estado intacto, `Restaurar base` y cero errores de consola.

### L13 · marca, reglas y alineación en el taller

> me falta el logo, y reglas, y alineamiento

El taller dibujaba la tarjeta pero solo dejaba tocar la tipografía: no había
marca, los dos filetes eran fijos y todo iba alineado a la izquierda.

- **Marca**: el símbolo del sitio (el mismo de `icon.html`), dentro de la
  cabecera. La fila crece hasta el alto de la marca —`heights[0]` pasa a
  `max(texto, marca)`— para que el símbolo nunca se salga del filete, y el margen
  calculado absorbe la diferencia. Color por token, tamaño, separación y
  desplazamiento propios.
- **Reglas**: pasan de dos filetes derivados de `ruleGap` a una lista. Cada una
  se ancla a una fila (por encima o por debajo), con desfase, sangrado lateral,
  grosor y color. Se añaden y se quitan desde el panel; la retícula ya no sabe
  nada de filetes.
- **Alineación** por ranura: extremos, izquierda, centro o derecha. En las filas
  de dos textos (cabecera y pie) «extremos» es el `space-between`; en las de uno
  es izquierda.
- **Guías** de columna (bordes y centro) y de fila (el top de cada una), con
  interruptor: son del taller y no llegan al PNG.

Dos detalles de fidelidad, porque el taller dibuja a 0.7 y a 0.42:

- Los filetes se dibujan con un mínimo de un píxel de dispositivo
  (`max(grosor, 1/zoom)`): un filete de 1 px a escala 0.42 desaparecía y daba la
  impresión de que la tarjeta no tenía reglas. El grosor exportado sigue siendo
  el declarado.
- La medición cuenta solo hojas con texto. La cabecera envuelve el dominio en un
  `lockup` con la marca, y contar el envoltorio y su hijo sumaba el mismo texto
  dos veces: la fila se declaraba «NO CABE» con 1149/1040 px de un contenido que
  ocupaba 651.

Verificación en navegador: base con marca de 40 px y dos filetes; marca a 64 px
en acento (la fila pasa a 64 y los filetes la siguen); título y entradilla
centrados; antetítulo a la derecha; filete con sangrado 120 y grosor 3; tercera
regla añadida y quitada; cambio a copy de WebSockets; recarga con el estado
intacto; `Restaurar base`; cero errores de consola.
