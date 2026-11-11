# Revisión de voz — planes de contenido, casos de estudio y revisión anterior

**Contra:** `~/.agents/VOICE.md` (borrador v6) · **Fecha:** 2026-11-11 · **Estado:** análisis aplicado en parte.

Se aplicaron las siete correcciones marcadas como **[aplicada]**: erratas y eliminaciones que no requieren decisión de producto. Todo lo demás queda como propuesta y espera tu palabra. Cada «Después» es una sugerencia de la IA, no texto aprobado (VOICE.md §8.2, regla 12).

---

## Cobertura revisada

| Documento | Incidencias | Veredicto |
|---|---|---|
| `docs/idea/casos-de-estudio-nakiretps-pachangacommunity-isdin.md` | A1–A7 | contenido honesto, envoltorio con tres violaciones literales |
| `docs/idea/gabrielalcantara-com-seo-geo-aeo-plan-detallado.md` | B1–B8 | mejor estructura, más P1/P3/P5 |
| `VOICE-REVIEW.md` | C-1–C-6 | fiable en hechos y citas; falla en su propia prosa |

---

## Cómo se leyó esto

VOICE.md §7 y §10 declaran **provisional** la documentación técnica y los planes: no hay escritura directa del autor en ese formato, sólo feedback [E1][E2]. Los tres documentos revisados caen ahí. Por tanto:

- Lo que se apoya en rechazo explícito se cita con su ID ([E8], [E9], §5).
- Lo que es corolario de §3.1 se marca como corolario.
- Lo que es lectura mía sobre la percepción del lector se marca como inferencia (§0).

Ninguna propuesta de este documento es una preferencia confirmada del autor.

---

## Verificación de `VOICE-REVIEW.md`

Antes de revisar su prosa se comprobó que sus citas existan. **Son exactas.**

| Afirmación del documento | Verificación |
|---|---|
| C1, C2, C3 citan `pachanga-community.astro` | ✅ L272-273, L90-92, L160-161, texto literal |
| C21 «DDD no es una capa de carpetas…» | ✅ `blog/ddd-dominios-complejos.astro:12` |
| C6 «Diseño sistemas complejos para convertir…» | ✅ `data/site.ts:18` e `index.astro:52` |
| Errata «Vilanova i la Geltrù» | ✅ `data/cv.ts:364` |
| Meta de `experience.astro` con cifras hardcodeadas | ✅ `experience.astro:31` |
| Nota de agencia duplicada | ✅ `data/faq.ts:40` y `services.astro:91` |
| «Cuatro artículos» de blog | ✅ existen los cuatro |

La única desviación es de una línea en algunas referencias. Nada que afecte a las conclusiones.

---

## Diagnóstico de conjunto

Los tres documentos comparten dos patrones y ninguno comete el error contrario: no hay métricas inventadas, ni clientes inventados, ni entusiasmo prefabricado, ni «proactivo». El ruido está en el envoltorio; el criterio se sostiene.

- **P1 ampliado.** A la simetría «no es X, es Y» [E8] se suma su variante de planificación: «no es X, sino Y». Aparece en los tres textos, incluido el que la denuncia: A1, A3, A5, B4, B6, C-2.
- **P2 de trayectoria comprimida.** El §5 tiene fila propia —«Comprimir una trayectoria en una frase que suene bien» [E8], con preferencia por «los sitios, con nombre y fechas»—. Es el patrón de más riesgo, porque un H1 se escribe una vez y se repite en todo el sitio: C-1 (dos veces), B3, B5.

---

## A. `casos-de-estudio-nakiretps-pachangacommunity-isdin.md`

**A1 · L43, L322, L390 — plantilla «no era X, sino Y», tres veces** · [aplicada la de L43]

- **Antes:** «El reto no era únicamente mover una unidad física, sino sincronizar dispositivos heterogéneos, personas, autenticación, operaciones de frontend y backend y comunicación en tiempo real.»
- **Después (aplicada):** «En el mismo sistema entran operarios, autenticación, operaciones de frontend y backend y comunicación en tiempo real.»
- **Por qué:** dos cosas a la vez. La simetría está rechazada con «frase que jamás escribiría así» [E8], §5. Y «dispositivos heterogéneos» es literalmente la sustitución que prohíbe §8.2 regla 5, cuando dos líneas antes el propio documento escribió «PLC, robots y sistemas LED». El dato estaba en la misma página.
- **Pendiente en L322 y L390:** «El reto de LoveISDIN no consistía únicamente en crear una interfaz nueva.» y «Explicar que una plataforma global necesita dos cosas aparentemente opuestas:». Misma forma, mismo arreglo: empezar por el hecho.

**A2 · L5 — «buenos candidatos para demostrar»**

- **Antes:** «Estos tres proyectos son buenos candidatos para demostrar tres capacidades distintas:»
- **Después (propuesta):** «Tres proyectos, tres problemas distintos:»
- **Por qué:** encuadre evaluativo que presenta la sección sin informar (§5, «frases de encuadre» [E9]). Saber que son «buenos candidatos» no añade nada a la lista que viene después.

**A3 · L11 — «pero no convertirse en una lista de tecnologías»** · [aplicada]

- **Antes:** «La redacción debe ser técnica, pero no convertirse en una lista de tecnologías. Cada caso debe explicar el problema, las decisiones, las restricciones, tu responsabilidad y lo que aprendiste.»
- **Después (aplicada):** «Cada caso debe explicar el problema, las decisiones, las restricciones, tu responsabilidad y lo que aprendiste.»
- **Por qué:** cola simétrica de relleno. La frase siguiente ya enuncia el requisito en positivo y con más precisión.

**A4 · L168 — «El aspecto diferencial es que gran parte del trabajo…»**

- **Antes:** «El aspecto diferencial es que gran parte del trabajo fue asumido por una sola persona, con apoyo de herramientas de IA, dentro de un alcance amplio que incluía producto, frontend, backend, crecimiento y operación.»
- **Después (propuesta):** «Una sola persona asumió producto, frontend, backend, crecimiento y operación, con apoyo de herramientas de IA.»
- **Por qué:** doble encuadre («el aspecto diferencial», «gran parte») sobre un hecho que se sostiene solo (§3.1, §5).

**A5 · L174 y L401 — «superficies», «solución narrativa»**

- **Antes:** «No presentarlo como “hacer una web y una app”, sino como la necesidad de mantener coherencia entre varias superficies:» · «La solución narrativa debe mostrar cómo la arquitectura puede ayudar a la coherencia de marca mediante:»
- **Después (propuesta):** borrar la frase de L174 y dejar la lista que sigue; en L401, «La arquitectura da coherencia de marca con:».
- **Por qué:** P1 en L174; jerga de consultor en L401. «Superficies» es la categoría que §8.2 regla 5 manda sustituir por la lista real, y la lista real ya está escrita en los nueve puntos siguientes.

**A6 · L243, L259, L395 — el documento habla de sí mismo**

- **Antes:** «El caso también sirve para demostrar que una arquitectura de producto no termina en el código.» · «Este es un apartado potente si se redacta sin dramatismo:» · «Esta tensión es una excelente oportunidad GEO porque demuestra experiencia en plataformas configurables, gobernanza técnica y arquitectura de producto.»
- **Después (propuesta):** borrar las tres. En L243 y L395 la lista siguiente hace el trabajo; en L259 el título del apartado basta.
- **Por qué:** tres frases que valoran el plan en lugar de informar. «Potente» y «excelente oportunidad» son adjetivos de capacidad sin prueba (§5).

**A7 · L216 — cadena de abstracción**

- **Antes:** «Conectar esta decisión con la posibilidad de evolucionar web y app sin crear una experiencia fragmentada.»
- **Después (propuesta):** «Decir qué componente se reutiliza en web y en app.»
- **Por qué:** «conectar», «posibilidad de evolucionar» y «experiencia fragmentada» son tres abstracciones seguidas sin un hecho que las ancle (§3.1).

---

## B. `gabrielalcantara-com-seo-geo-aeo-plan-detallado.md`

**B1 · L5-10 — terna abstracta en la apertura**

- **Antes:** «Convertir gabrielalcantara.com en una plataforma profesional que cumpla cuatro funciones al mismo tiempo: … 4. Ser una fuente clara, citable y reutilizable para buscadores y asistentes de IA.»
- **Después (propuesta):** «Cuatro cosas concretas: un CV indexable, casos de estudio citables, una FAQ que responda por mí y un `llms.txt` que no mienta.»
- **Por qué:** «plataforma profesional» no dice nada y «clara, citable y reutilizable» es la terna de adjetivos en paralelo ya marcada como ficha de LinkedIn en C10 de la revisión anterior.

**B2 · L12 — elogio donde sobra el dato**

- **Antes:** «El sitio parte de una buena base técnica. El escaneo de visibilidad para asistentes de IA obtuvo **79/100, calificación B**.»
- **Después (propuesta):** «El escaneo de visibilidad para asistentes de IA dio 79/100 (B).»
- **Por qué:** valoración sin dato (§3.1) con el dato en la frase siguiente. La nota ya implica la valoración.

**B3 · L157 — H1 de tarjeta**

- **Antes:** «H1: Arquitecto de software para sistemas complejos y distribuidos»
- **Después (propuesta):** «Diseño la arquitectura de almacenes automatizados y de plataformas que se despliegan en 21 países.»
- **Por qué:** P3/P5, y es la misma abstracción que C6 marcó en el sitio vivo. Una decisión de producto: el H1 lo firmas tú.

**B4 · L175 — P1** · [aplicada]

- **Antes:** «Debe ser una página de entidad, no una biografía genérica.»
- **Después (aplicada):** «Una página de entidad:»
- **Por qué:** contraste simétrico [E8]. La lista de siete puntos que sigue ya define qué es una página de entidad; la negación sólo repite.

**B5 · L262 — afirmación inventada**

- **Antes:** «Gabriel Alcántara es un arquitecto de software especializado en el diseño y evolución de sistemas distribuidos… Trabaja en la conexión entre estrategia técnica, diseño de sistemas y ejecución de equipos.»
- **Después (propuesta):** borrar la segunda oración y conservar la primera.
- **Por qué:** la última oración no tiene hecho detrás y no la has dicho tú: viola §8.2 regla 2 («no inventes hechos ni preferencias»). Además es el relleno de perfil corporativo de §5.

**B6 · L477 y L583 — P1 como cierre de objetivo y de fase** · [aplicadas]

- **Antes:** «El objetivo no es perseguir una puntuación aislada, sino que el contenido principal aparezca rápido y sea usable en móvil.» / «**Resultado esperado:** decisiones basadas en oportunidades reales, no solo en puntuaciones técnicas.»
- **Después (aplicadas):** «El objetivo: que el contenido principal aparezca rápido y sea usable en móvil.» / «**Resultado esperado:** decisiones basadas en lo que Search Console muestre cada mes.»
- **Por qué:** la misma simetría dos veces. La segunda versión además concreta la fuente, que es lo que §3.1 pide.

**B7 · L646 — promesa de cinco resultados**

- **Antes:** «Esa combinación mejora simultáneamente SEO, GEO, AEO, comprensión de marca personal y conversión profesional.»
- **Después (propuesta):** «Es el orden que menos depende de métricas y más depende de contenido que ya existe.»
- **Por qué:** cinco promesas sin medición en un documento que en §8 exige medir. Es la frase que un lector técnico descuenta entera.

**B8 · L9 — «cualificadas»**

- **Antes:** «3. Captar oportunidades profesionales cualificadas.»
- **Después (propuesta):** «3. Que quien tenga un problema de arquitectura me escriba.»
- **Por qué:** adjetivo de marketing que implica que las demás oportunidades no lo son, sin informar de nada (§5).

---

## C. `VOICE-REVIEW.md`

**C-1 · L105 y L132 — propone justo lo que la guía prohíbe**

- **Antes:** «**Después (propuesta):** “Quince años diseñando sistemas distribuidos, desde Delphi hasta eventos en tiempo real.”» · «Sobre mí: “Quince años de arquitectura de software, de auditoría contable a almacenes automatizados.”»
- **Después (propuesta):** «Empecé en 2011 en ACD Sistemes; hoy diseño los almacenes de Bodega Digital y Nakire TPS.»
- **Por qué:** §5 tiene una fila exacta para esta forma —«Comprimir una trayectoria en una frase que suene bien» [E8]: «Casi todo lo que sé lo aprendí en una consultora pequeña» era falso; la preferencia registrada son «los sitios, con nombre y fechas»—. Las dos propuestas son un arco «desde X hasta Y» sin un solo nombre ni una fecha. La revisión denuncia P3 y ofrece P3 con otro traje.

**C-2 · L39 — diagnostica P1 usando P1** · [aplicada]

- **Antes:** «**El AISlop no está en la información, está en el envoltorio**: frases que enmarcan el párrafo sin decir nada…»
- **Después (aplicada):** «**La información es tuya; el envoltorio no**: frases que enmarcan el párrafo sin decir nada…»
- **Por qué:** simetría «no está en X, está en Y», la forma que el propio párrafo declara rechazada con [E8]. No invalida los hallazgos, pero un documento sobre voz no puede permitirse el patrón que corrige.

**C-3 · L39 — dos valoraciones sin dato**

- **Antes:** «El contenido es sólido…» · «**Se nota de lejos** porque son exactamente los tres dispositivos que VOICE.md documenta como rechazados.»
- **Después (propuesta):** «El contenido tiene fechas, stacks y enumeraciones concretas; lo que falla es el envoltorio. P4 y P5 son corolarios de §3.1, no rechazos observados.»
- **Por qué:** «sólido» y «se nota de lejos» son afirmaciones sin evidencia; la segunda es una inferencia sobre la percepción ajena y §0 obliga a marcarla. «Exactamente» convierte una coincidencia en prueba.

**C-4 · L41 — errata** · [aplicada]

- **Antes:** «**Patrones detectados (el «porqué se ve de lejos»):**»
- **Después (aplicada):** «**Patrones detectados (el «por qué se ve de lejos»):**»
- **Por qué:** «porqué» es sustantivo; aquí es interrogativo, dos palabras.

**C-5 · L98 — anglicismo con errata de concordancia** · [aplicada]

- **Antes:** «La claims concreta (probar aquí antes que en equipo) se mantiene.»
- **Después (aplicada):** «La afirmación concreta (probar aquí antes de aplicarlo en equipos) se mantiene.»
- **Por qué:** «la claims» no concuerda y no es español.

**C-6 · L44-46 — clase de evidencia mal etiquetada**

- **Antes:** «P1 — Simetría … Rechazo explícito [E8], §5.» · «P4 — Jerga de consultor y clichés.» · «P5 — Abstracción sin dato. §3.1.»
- **Después (propuesta):** etiquetar cada patrón con su clase antes de usarlo como argumento: P1 rechazo explícito; P4 y P5 corolarios de §3.1/§5; P2 con [E9].
- **Por qué:** presentar un corolario como rechazo pronunciado es exactamente lo que §0 prohíbe: subir de clase una evidencia. No cambia las propuestas; cambia cuánto peso tienen.

---

## Lo que ya funciona — no tocar

### En los casos de estudio

1. **L15-17:** «No conviene inventar métricas. Como los resultados todavía no están medidos, se pueden utilizar resultados cualitativos y dejar una sección preparada para incorporar cifras más adelante.» — §3.3 y regla 14, y es lo que hace creíble el resto del documento.
2. **L336:** «La cifra de 21 países debe confirmarse antes de publicarla como dato definitivo.» — objeción propia dentro del texto (§6.2).
3. **«Evitar frases como: “Se mejoró el rendimiento un 60%”… Solo deben aparecer cuando exista una fuente o medición que lo confirme.»** — el criterio de §5 escrito por ti.

### En el plan SEO

4. **§2, reglas:** «No añadir clientes, cifras, cargos o certificaciones que no estén demostrados.» / «No marcar la web como `Organization` si no existe una organización real detrás.» — §3.3 aplicada a datos estructurados, donde más se falsea.
5. **§12 «Límite operativo»:** «La web pública se puede auditar y el código se puede preparar aquí. La aplicación no aparece como un proyecto editable de Hostinger AI Builder…» — dice lo incómodo y sigue dando el camino (§3.3).
6. **§6:** «La ruta final debe corresponder a un archivo real. No publicar una cabecera que apunte a un recurso inexistente.» — concreto y comprobable.

### En `VOICE-REVIEW.md`

7. **Las cuatro primeras líneas:** «Todas las propuestas «Después» son sugerencias de la IA, no texto aprobado por el autor (VOICE.md §8.2, regla 12). Donde exista versión tuya, manda la tuya…» — §3.10 segunda regla y regla 12, y es lo que hace usable el resto.
8. **C16 y C21:** las dos aplicaciones correctas de [E8], con el reemplazo empezando por el hecho. Es el patrón de edición que la guía pide.
9. **La sección «Fuera de alcance de voz (fact-checking)»:** separar errata y riesgo técnico de las decisiones de voz evita que un cambio de dato se cuele como cambio de estilo.
10. **L305:** «Cada «Después» que apruebes se aplica; el que no, se queda como está. Tu versión gana siempre.» — registro informal-profesional (§3.8) y §3.10.

---

## Fuera de alcance de voz (fact-checking y producto)

- **Los «Título SEO sugerido» de los casos de estudio** están escritos para el buscador, no para una persona. Ahí decide el SERP, no tu registro. No se juzgan con esta guía.
- **La pregunta 1 de la FAQ del plan** («¿Qué hace un arquitecto de software?») es volumen genérico y roza la regla del propio §5 contra preguntas creadas para manipular resultados. Decisión de producto.
- **`VOICE-REVIEW.md` L105/L132** además de la voz tienen un problema de producto: un H1 sin nombres ni fechas es difícil de sostener con datos si alguien lo pregunta.
- **Las referencias de línea de `VOICE-REVIEW.md`** derivan una línea en algunos casos (C3: L160 → L160-161; C4: L90-92 → L90-93). Sin efecto sobre las conclusiones.

---

## Pendiente de tu palabra

Ninguna de estas requiere más análisis, sólo tu decisión:

| ID | Documento | Qué decide |
|---|---|---|
| A2 | casos | si la sección de enfoque abre con «Tres proyectos, tres problemas distintos:» |
| A4 | casos | si «el aspecto diferencial» se borra y el hecho abre la frase |
| A5 | casos | si se borra la frase de L174 y se reescribe L401 |
| A6 | casos | si se borran las tres frases de valoración del plan |
| A7 | casos | si L216 pasa a «Decir qué componente se reutiliza en web y en app.» |
| A1 (resto) | casos | L322 y L390, misma plantilla que la corregida |
| B1 | plan | apertura con cuatro cosas concretas |
| B2 | plan | borrar el elogio y dejar el 79/100 |
| B3 | plan | **el H1 del sitio**: propuesta, no corrección |
| B5 | plan | borrar la oración inventada de la bio |
| B7 | plan | cambiar la promesa de cinco resultados |
| B8 | plan | reescribir el objetivo 3 |
| C-1 | revisión | **los dos H1 alternativos**: propuesta, no corrección |
| C-3 | revisión | marcar la inferencia y quitar «sólido» |
| C-6 | revisión | etiquetar P4 y P5 como corolarios |

**Riesgo:** ninguno. Son documentos de planificación: no hay código, datos ni contratos afectados, y las siete correcciones aplicadas se reducen a erratas y supresiones.

---

## Próximo paso

Las siete correcciones de errata y simetría ya están aplicadas. De la tabla anterior, B2, B5, C-3 y C-6 son correcciones de honestidad —no de gusto— y se pueden aplicar en el mismo movimiento: B5 elimina una afirmación que no has hecho, C-3 y C-6 corrigen cómo se etiqueta la evidencia. Los H1 (B3, C-1) y la apertura del plan (B1) son decisiones de producto y esperan tu texto o tu aprobación.
