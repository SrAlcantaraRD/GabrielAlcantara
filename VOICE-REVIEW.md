# Revisión de voz — copy completo del sitio

**Contra:** `~/.agents/VOICE.md` (borrador v6) · **Fecha:** 2026-11-11 · **Estado:** análisis. **No se ha aplicado ningún cambio.**

Todas las propuestas «Después» son sugerencias de la IA, no texto aprobado por el autor (VOICE.md §8.2, regla 12). Donde exista versión tuya, manda la tuya: se corrige la errata y nada más (§3.10).

---

## Cobertura revisada

| Archivo | Veredicto |
|---|---|
| `src/pages/index.astro` | cambios (titulares, «aporto valor», «productos reales») |
| `src/pages/about.astro` | cambios (H1, cita de principios); trayectoria ✅ |
| `src/pages/services.astro` | cambios (H1, «plan ejecutable»); scope-note ✅ |
| `src/pages/contact.astro` | 1 menor; resto ✅ |
| `src/pages/experience.astro` | ✅ sin incidencias de voz |
| `src/pages/cv.astro` | 1 cambio (última frase del lede) |
| `src/pages/404.astro` | ✅ |
| `src/pages/projects/index.astro` | 1 cambio (H1) |
| `src/pages/projects/pachanga-community.astro` | cambios — aquí están las 3 frases señaladas |
| `src/pages/projects/bodega-digital.astro` | 2 cambios; honestidad de resultados ✅ |
| `src/pages/projects/nakire-tps.astro` | cambios (lede, repeticiones, «hoja en blanco» ×2) |
| `src/pages/blog/index.astro` | 1 cambio (H1); lede ✅ |
| `src/pages/blog/*.astro` (4 artículos) | cambios (patrón «no es X, es Y» en cierres y entradas) |
| `src/pages/llms.txt.ts` | ✅ (dato, no prosa) |
| `src/data/site.ts` | cambios (titular, PRINCIPLES genéricos); COLLABORATION ✅ |
| `src/data/projects.ts` | ✅ en su mayor parte (concreto) |
| `src/data/faq.ts` | ✅; nota de repetición con `services.astro` |
| `src/data/blog.ts` | ✅ (descripciones de categoría concretas) |
| `src/data/cv.ts` | ✅ resúmenes concretos; 1 errata factual (abajo) |
| Componentes (footer, cards, diagramas, drawer) | ✅ |
| `src/components/EasterEgg.astro` | los «malos» ✅; los «buenos» genéricos |

---

## Diagnóstico

El contenido es sólido: fechas, stacks, enumeraciones concretas y honestidad sobre resultados («no métricas inventadas») coinciden con tu voz. **La información es tuya; el envoltorio no**: frases que enmarcan el párrafo sin decir nada, remates simétricos «no es X, es Y» (patrón que rechazaste literalmente en [E8] con «frase que jamás escribiría así») y titulares de tarjeta de presentación. Se nota de lejos porque son exactamente los tres dispositivos que VOICE.md documenta como rechazados.

**Patrones detectados (el «por qué se ve de lejos»):**

- **P1 — Simetría «no es X, es Y» / «no está en X, está en Y».** Rechazo explícito [E8], §5. Ej.: «DDD no es una capa de carpetas; es una forma de decidir…».
- **P2 — Frases de encuadre.** [E9] «puro ai-slop»: presentan el párrafo sin información. Ej.: «La parte que nadie ve…», «Ese es el aprendizaje real del proyecto…», «La regla que sostiene todo es simple:».
- **P3 — Titulares/remates de tarjeta de presentación.** [E8] «no suena a mí», §5. Ej.: «Arquitectura, ingeniería y claridad para sistemas complejos.»
- **P4 — Jerga de consultor y clichés.** «aporto valor», «plan ejecutable», «cambia la conversación», «La pregunta no es si, sino cuándo».
- **P5 — Abstracción sin dato.** §3.1: «software evolutivo», «visión de arquitectura», «el mejor banco de pruebas».

Criterio de todas las propuestas (§3.10, regla derivada): **¿qué sabe el lector después que antes no supiera?** Si la respuesta es «nada, pero suena bien», la frase se recorta.

---

## Lo que ya funciona — no tocar

1. **`about.astro` trayectoria:** «Empecé en 2011 en ACD Sistemes… Con 21 años viajé a Brasil y Angola para implantar y desplegar soluciones de auditoría en instituciones públicas.» — empieza por el hecho, dato verificable, escena en la frase: es literalmente la forma aprobada en [E9]/[E10].
2. **`services.astro` scope-note:** «No trabajo como una agencia: prefiero pocas colaboraciones donde pueda implicarme en las decisiones y en su ejecución. Si el problema encaja, te lo digo; si no, también.» — honestidad sobre el coste (§3.3) y registro informal-profesional (§3.8).
3. **`pachanga-community.astro`:** «Nada de eso es glamuroso, pero es lo que hace que el producto exista: certificados, rutas, prioridades de Traefik, variables de entorno y una build que falla a la primera si un fichero de configuración no está donde toca.» — enumeración concreta + atenuante (§3.1, §6.1).
4. **`bodega-digital.astro` / `nakire-tps.astro`:** «Los resultados que puedo afirmar son los que el proyecto declara, no métricas inventadas:» — dice lo incómodo dentro del texto que convence (§3.3).
5. **`site.ts` COLLABORATION:** «Empiezo por entender el contexto… Después propongo alternativas… Por último ayudo a convertir la decisión en pasos concretos.» — método como secuencia de verbos (§3.5). También `contact.astro`: «Leo todos los mensajes. Si el tema encaja, propongo una primera conversación corta…».
6. **`bodega-digital.astro`:** «La radiofrecuencia y el líquido no se llevan bien: el hardware marca el diseño tanto como el dominio.» — concreto, coloquial, sin simetría.

---

## Cambios propuestos

### A. Las tres frases que señalaste (pachanga-community.astro)

**C1 · Aprendizajes · L272-273** — patrón P1 (rechazo explícito [E8])

- **Antes:** «La arquitectura no se demuestra en el diagrama, se demuestra cuando toca cambiar una pieza y solo cambia una.»
- **Después (propuesta):** «La prueba de la arquitectura llega cuando cambias una pieza y solo cambia una.»
- **Por qué:** construcción «no se demuestra en X, se demuestra en Y» simétrica: es la misma forma que rechazaste con «frase que jamás escribiría así» (§5). La información útil (la prueba es el cambio localizado) se conserva; el contraste con el diagrama no añade dato.

**C2 · Aprendizajes · L276-277** — patrón P2 (frase de encuadre [E9])

- **Antes:** «La parte que nadie ve —enlaces universales, tiendas, despliegue— es la que decide si el producto se siente terminado.»
- **Después (propuesta):** «Los enlaces universales, las tiendas y el despliegue nadie los ve, y son los que deciden si el producto se siente terminado.»
- **Por qué:** «La parte que nadie ve» presenta el párrafo sin decir nada y esconde el sujeto detrás de un marco (§5: «Empieza por el hecho»). La reordenación empieza por los tres hechos concretos y mantiene la idea completa.

**C3 · Arquitectura móvil · L160** — patrón P2

- **Antes:** «La regla que sostiene todo es simple: el dominio es TypeScript puro y Zod, sin React Native, sin Expo y sin base de datos.»
- **Después (propuesta):** borrar «La regla que sostiene todo es simple:» y empezar: «El dominio es TypeScript puro y Zod, sin React Native, sin Expo y sin base de datos.»
- **Por qué:** el preámbulo no informa: la regla misma ya es concreta. «Sostiene todo» además es grandilocuente sin dato (§3.1). La frase siguiente («Los casos de uso se prueban sin infraestructura…») ya desarrolla la consecuencia.

### B. pachanga-community.astro (resto)

**C4 · Resumen ejecutivo · L90-92** — P2 + P1

- **Antes:** «Ese es el aprendizaje real del proyecto: la complejidad no está en una pieza, está en que todas las piezas tienen que funcionar a la vez.»
- **Después:** «Todas las piezas tienen que funcionar a la vez: ahí estaba la complejidad.»
- **Por qué:** «Ese es el aprendizaje real» es encuadre sin información; la simetría «no está en una pieza, está en que…» repite el patrón rechazado. El resto del párrafo («producto, diseño, app, web, infraestructura y soporte en la misma persona») sí aporta y se queda igual.

**C5 · Aprendizajes · L280-281** — P5

- **Antes:** «Un producto propio sin usuarios de pago sigue siendo el mejor banco de pruebas para decisiones de arquitectura que luego aplico en equipos.»
- **Después (propuesta):** «Un producto propio sin usuarios de pago es donde pruebo decisiones de arquitectura antes de aplicarlas en equipos.»
- **Por qué:** «el mejor» es superlativo sin dato (§3.1: el dato sustituye al adjetivo). La afirmación concreta (probar aquí antes de aplicarlo en equipos) se mantiene.

### C. index.astro y titulares del sitio — P3

**C6 · H1 / `site.ts` headline (L52 y site.ts L17-18)** — P5

- **Antes:** «Diseño sistemas complejos para convertir problemas difíciles en software evolutivo.»
- **Después (propuesta):** «Quince años diseñando sistemas distribuidos, desde Delphi hasta eventos en tiempo real.»
- **Por qué:** «problemas difíciles» y «software evolutivo» son abstracciones sin un solo dato verificable (§3.1). La propuesta usa dos hechos ya publicados en el sitio (2011→2026; migración Delphi→Velneo; EDA en Quabu). Confirmar si te encaja: es tu titular, no el mío.

**C7 · L74** — P4

- **Antes:** «Áreas en las que aporto valor»
- **Después:** «Cuatro áreas de trabajo» (la meta ya dice «4 frentes»)
- **Por qué:** «aportar valor» es jerga de marketing; §5 prohíbe capacidad sin prueba.

**C8 · L140 (igual en `experience.astro` L37)** — P3/P5

- **Antes:** «Experiencia construyendo y evolucionando productos reales.»
- **Después (propuesta):** «Experiencia: producto, consultoría y arquitectura desde 2011.»
- **Por qué:** «productos reales» insinúa que otros no lo son y no informa; la propuesta usa los tres tramos que ya describes en tu propia lede de `about.astro`.

**C9 · H2 blog L175, H1 blog L47, H1 proyectos L55, H1 services L47, H1 about L44** — P3 (grupo)

Ejemplos exactos:
- «Ideas sobre arquitectura y sistemas complejos» / «Ideas sobre arquitectura, sistemas distribuidos y software que evoluciona.»
- «Proyectos donde la arquitectura se encuentra con la realidad.»
- «Ayuda técnica para tomar mejores decisiones sobre sistemas complejos.»
- «Arquitectura, ingeniería y claridad para sistemas complejos.»

- **Después (propuestas, una por página):**
  - Blog: «Artículos escritos desde proyectos concretos.» (tu meta-row ya dice «escritos desde proyectos reales»)
  - Proyectos: «Casos de estudio: problema, rol, decisión y resultado.»
  - Servicios: «Reviso tu arquitectura y te digo qué cambiaría primero.»
  - Sobre mí: «Quince años de arquitectura de software, de auditoría contable a almacenes automatizados.»
- **Por qué:** son tarjetas de presentación redondas [E8] («no suena a mí») que no dicen nada que el lector no supiera ya. §3.10: si no aporta información nueva, sobra. Los ledes de debajo sí son buenos: no se tocan.

### D. about.astro

**C10 · working-quote L106-108** — P5

- **Antes:** «Me interesa entender el dominio antes de elegir la tecnología. Busco soluciones que sean comprensibles para los equipos, sostenibles en producción y capaces de evolucionar cuando cambian las necesidades del negocio.»
- **Después (propuesta):** «Me interesa entender el dominio antes de elegir la tecnología; el resto —interfaces, proveedores, frameworks— llega después.» *(confirmar; solo es borrador)*
- **Por qué:** la segunda frase es una terna de adjetivos en paralelo («comprensibles… sostenibles… capaces de evolucionar») sin un hecho que los ancle: es la estructura de ficha de LinkedIn, no tu registro (§3.1). La primera frase es tuya y se queda.

### E. services.astro

**C11 · L50** — P4

- **Antes:** «…o convertir un problema técnico complejo en un plan ejecutable.»
- **Después:** «…o convertir un problema técnico complejo en pasos concretos.»
- **Por qué:** «plan ejecutable» es corporativo; «pasos concretos» es literalmente tu propia formulación en COLLABORATION (site.ts L183). Misma idea, tu palabra.

### F. cv.astro

**C12 · cv-lede L49-50** — P5

- **Antes:** «Combino visión de arquitectura con capacidad de implementación y acompañamiento a equipos.»
- **Después:** borrar la frase (el resto del lede —especialidades concretas— se queda).
- **Por qué:** «visión de arquitectura» y «capacidad de implementación» son abstracción encadenada sin dato (§3.1); la frase no añade nada a la enumeración que la precede (§3.10).

### G. projects/index.astro

*(Ver C9: solo el H1.)* El lede y el resto de la página ✅.

### H. nakire-tps.astro

**C13 · lede L58-61** — P5

- **Antes:** «La evolución distribuida de la arquitectura que nació en Bodega Digital: servicios, eventos y dispositivos industriales coordinados en tiempo real.»
- **Después (propuesta):** «Nakire TPS lleva al mundo distribuido la arquitectura que empezó en Bodega Digital: servicios, eventos y dispositivos industriales coordinados en tiempo real.»
- **Por qué:** «La evolución distribuida de la arquitectura que nació en…» es nominalización pesada: sujeto abstracto, cero verbos de acción. La propuesta empieza por el nombre (§3.1: nombre propio, no categoría).

**C14 · Repetición literal · L93-94 y L216-217** — P2/§3.10

- **Antes (dos veces):** «La solución se organizó alrededor de dominios y servicios con responsabilidades claras, comunicación orientada a eventos y canales en tiempo real…»
- **Después:** borrar la primera oración de la sección «Arquitectura» (L216): la frase siguiente («El frontend y la API hablan con un core que conoce las tareas; el core no conoce los protocolos…») ya aporta la información nueva.
- **Por qué:** repetir la frase exacta del resumen en el cuerpo no aporta nada (§5: «Párrafos que no aportan información nueva»).

**C15 · Doble metáfora · L106 y L128** — P2

- **Antes:** «Nakire TPS no partió de una hoja en blanco.» … «El punto de partida no era una hoja en blanco: cada almacén tiene su mapa…»
- **Después:** conservar la primera; en L128 empezar por el hecho: «Cada almacén llega con su mapa, sus versiones de robot y sus reglas de negocio.»
- **Por qué:** la misma metáfora dos veces en una página; la segunda además enmarca cuando ya se ha dicho (§3.10).

**C16 · L134-137** — P2

- **Antes:** «El reto no consistía únicamente en construir una aplicación, sino en coordinar distintos actores, dispositivos y flujos operativos dentro de un sistema que debía ser trazable, mantenible y capaz de evolucionar.»
- **Después:** borrar el párrafo: los cuatro bullets que siguen dicen lo mismo, mejor y con casos.
- **Por qué:** «no consistía únicamente en X, sino en Y» retrasa el hecho tras una negación; y el contenido se repite con la lista (§3.10: «fuera, no aporta»).

**C17 · L359-361** — P4 (menor)

- **Antes:** «Probar sobre hardware real cambia la conversación con el equipo: los problemas aparecen antes y con nombre propio.»
- **Después:** «Probar sobre hardware real hace que los problemas aparezcan antes y con nombre propio.»
- **Por qué:** «cambia la conversación» es jerga de consultor; la segunda mitad de tu frase ya es perfecta, se le quita solo el marco.

### I. bodega-digital.astro

**C18 · L231** — P2

- **Antes:** «Esa continuidad es la parte interesante del proyecto.»
- **Después:** borrar la frase; el párrafo continúa con «El monolito no fue un atajo que hubo que deshacer: fue el sitio donde…», que sí aporta.
- **Por qué:** «la parte interesante» es encuadre sin información — exactamente lo que [E9] marcó como «puro ai-slop».

**C19 · L293-294** — P1 (menor)

- **Antes:** «…el vocabulario compartido es parte de la entrega, no un adorno.»
- **Después:** «…el vocabulario compartido forma parte de la entrega.»
- **Por qué:** la cola «no un adorno» es simetría de relleno; la afirmación sola ya es fuerte.

### J. blog — los cuatro artículos

**C20 · `arquitectura-orientada-a-eventos` L117-118** — P1 (mismo patrón que C1)

- **Antes:** «Una arquitectura orientada a eventos bien hecha se nota menos en el diagrama que en la operación: se puede añadir una capacidad sin tocar el core…»
- **Después:** borrar la comparación con el diagrama; empezar por las tres pruebas que ya enumera: «Se nota en la operación: se puede añadir una capacidad sin tocar el core, un servicio caído no arrastra a todos y cada hecho tiene un dueño.»
- **Por qué:** «se nota menos en X que en Y» es simetría; las tres pruebas concretas que siguen son tu cierre real y se quedan intactas.

**C21 · `ddd-dominios-complejos` L12-13** — P1 (el caso más claro: es literalmente el patrón rechazado)

- **Antes:** «En esos casos, DDD no es una capa de carpetas; es una forma de decidir dónde vive cada regla.»
- **Después:** «En esos casos, DDD decide dónde vive cada regla.»
- **Por qué:** §5 documenta el rechazo exacto de esta forma: «lo interesante no es el modelo, es el sistema» → «frase que jamás escribiría así» [E8]. La transformación que la propia guía pide es la misma idea como consecuencia, no como contraste simétrico.

**C22 · `ddd-dominios-complejos` L37-38** — P1 (menor)

- **Antes:** «El modelo refleja cómo se trabaja, no cómo se almacena.»
- **Después:** borrar la frase (el párrafo de la botella ya lo demuestra) o recortar a «El modelo refleja cómo se trabaja.»
- **Por qué:** cola «no cómo…» de relleno; el ejemplo anterior («una botella es una unidad identificable…, no una fila de stock») ya lo dice con hechos.

**C23 · `ddd-dominios-complejos` L95-96** — P1 (recorte)

- **Antes:** «La señal de que ha funcionado no es la elegancia del diagrama, sino que añadir una variante nueva toca menos archivos de los que tocaba antes.»
- **Después:** «La señal de que ha funcionado: añadir una variante nueva toca menos archivos de los que tocaba antes.»
- **Por qué:** la segunda mitad es el mejor dato del artículo (medible, tuyo); la primera es el marco simétrico que la contamina. Recorte, no reescritura.

**C24 · `lecciones-plataforma-industrial` L21-22** — P1/repetición

- **Antes:** «El software puede decidir qué debería pasar; no puede decidir que haya pasado.»
- **Después:** borrar: la frase anterior ya lo dice con escena («en una bodega, el estado lo controla el mundo: una carretilla bloqueada, un PLC que no responde…»).
- **Por qué:** repite la misma idea en modo aforismo; el espécimen con escena es mejor que el paralelismo (§3.1, §3.10).

**C25 · `lecciones-plataforma-industrial` L121-122** — P1

- **Antes:** «La arquitectura no empieza en el broker; empieza en el problema.»
- **Después:** borrar el remate; el párrafo ya cierra con tu secuencia («entender la operación, separar los dominios y solo después elegir la tecnología»), que es información.
- **Por qué:** simetría de cierre sin dato; §3.6 permite generalizar, pero tu generalización aprobada ([W3]) siempre dice algo nuevo, no reordena la misma frase.

**C26 · `websockets-operaciones-tiempo-real` L23-26** — P2 + P4

- **Antes:** «Lo importante es tener claro qué se transporta: no un flujo infinito de datos, sino eventos de estado relevantes para ese rol. El canal no es una base de datos en streaming.»
- **Después:** «El canal transporta eventos de estado relevantes para ese rol.»
- **Por qué:** «Lo importante es tener claro» es encuadre [E9]; las dos frases dicen lo mismo (negación + negación). Con una basta.

**C27 · `websockets-operaciones-tiempo-real` L65** — P4

- **Antes:** «Una conexión WebSocket se cae. La pregunta no es si, sino cuándo.»
- **Después:** borrar la segunda frase.
- **Por qué:** «La pregunta no es si, sino cuándo» es cliché de artículo técnico; la frase siguiente («El cliente necesita reconectar con una estrategia acotada…») ya es el contenido.

**C28 · `websockets-operaciones-tiempo-real` L89-90** — P1 (menor)

- **Antes:** «Un canal abierto es un recurso, no un detalle.»
- **Después:** borrar (las tres medidas de protección de la frase anterior ya lo sostienen).
- **Por qué:** cola simétrica sin dato nuevo.

**C29 · `websockets-operaciones-tiempo-real` L106-110** — P1

- **Antes:** «El tiempo real en una interfaz operativa no va de la tecnología del canal, sino de la confianza: el servidor decide, el cliente muestra y el usuario sabe cuándo la información está al día.»
- **Después:** «El servidor decide, el cliente muestra y el usuario sabe cuándo la información está al día: eso es tiempo real en una interfaz operativa.»
- **Por qué:** «no va de X, sino de Y» enmarca; los tres hechos que lo siguen son buenos y pasan a abrir. El resto del cierre («Si esa confianza se rompe…») se queda.

### K. data/site.ts

**C30 · PRINCIPLES (L132-138)** — P5 · *necesita tu input*

- **Antes:** «Entender el problema antes de aumentar la complejidad. / Diseñar límites claros entre responsabilidades. / Automatizar todo lo que pueda repetirse. / Validar las decisiones con feedback real. / Compartir contexto para que los equipos puedan avanzar con autonomía.»
- **Por qué:** cualquiera de los cinco los firmaría cualquier senior; ninguno dice nada que solo tú puedas decir (§3.10). No propongo texto: inventar tus principios violaría la regla 2 («No inventes hechos… ni preferencias»). **Acción sugerida:** reemplazar uno o dos por principios anclados en hechos tuyos que ya publicas (ej. los PRDs escritos con negocio, los «decisiones escritas, límites explícitos, pruebas sobre el comportamiento real» de tu propio `about.astro` L147-148).

### L. componentes

**C31 · EasterEgg — solo los «buenos»** — P5

- **Antes (ej.):** «Capacidad estructurada para resolver problemas complejos y ordenar lo que parece caótico.» / «Miro el impacto antes que la tecnología y me muevo bien con información incompleta.»
- **Por qué:** auto-descripción genérica sin prueba (§5: «Adjetivos de capacidad sin prueba»). **Los «malos» sí funcionan** («a veces sigo puliendo cuando el problema ya estaba resuelto»): son objeción propia declarada, exactamente §3.3. **Acción sugerida:** si tocas este componente, cambia solo los «buenos» por algo con dato o humor; los «malos» se quedan.

---

## Fuera de alcance de voz (fact-checking)

- **Errata:** `cv.ts` L364 `place: "Vilanova i la Geltrù"` → lo correcto es **«Vilanova i la Geltrú»** (acento agudo). No es voz, es dato.
- **Riesgo de desfase (técnico):** la meta description de `experience.astro` L31 hardcodea «14 puestos en 4 etapas, 25 proyectos» mientras la página renderiza contadores dinámicos. Si algún día cambian los datos, la meta mentirá.
- **Repetición intencionada:** el texto «No trabajo como una agencia: prefiero pocas colaboraciones…» aparece idéntico en `services.astro` L91-92 y en `faq.ts` L40. Duplicado entre superficies distintas es aceptable (mismo mensaje), pero si lo cambias, cámbialo en los dos sitios.
- No detecté contradicciones factuales entre páginas: fechas de Quabu (2024.01–2026.08), fases de Bodega y Nakire, y «desde 2011» son coherentes en todo el sitio.

---

## Nota de alcance de la guía

VOICE.md §7 y §10 marcan que no hay escritura directa observada para documentación técnica, README ni marketing (provisional), y que el blog queda fuera de las muestras W1–W5. Los artículos del blog los he juzgado contra el registro ensayístico más cercano ([W3], texto de presentación) y contra §5 (lo que rechazaste explícitamente). Donde la guía no tiene evidencia directa, lo marco como propuesta, no como regla.

## Próximo paso sugerido

1. Empezar por las tres frases señaladas (C1–C3): son las de rechazo explícito.
2. Después el grupo P1 del blog (C20–C29): es donde más se repite el patrón.
3. Los titulares (C6–C9) y PRINCIPLES (C30) requieren tu palabra: son decisiones de producto, no correcciones.
4. Cada «Después» que apruebes se aplica; el que no, se queda como está. Tu versión gana siempre (§3.10, regla segunda).
