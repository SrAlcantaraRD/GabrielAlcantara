# Plan detallado de corrección y mejora para gabrielalcantara.com

## 0. Objetivo

Convertir gabrielalcantara.com en una plataforma profesional que cumpla cuatro funciones al mismo tiempo:

1. Ser un CV indexable y fácil de entender.
2. Demostrar experiencia mediante proyectos y casos de estudio.
3. Captar oportunidades profesionales cualificadas.
4. Ser una fuente clara, citable y reutilizable para buscadores y asistentes de IA.

El sitio parte de una buena base técnica. El escaneo de visibilidad para asistentes de IA obtuvo **79/100, calificación B**. El objetivo razonable de la primera fase es eliminar los puntos técnicos pendientes, mejorar la entidad profesional y hacer que cada página responda mejor a una intención concreta.

---

# 1. Prioridades ejecutivas

## Prioridad P0, corregir primero

- Reforzar el schema de persona y entidad profesional.
- Revisar que cada página importante tenga una intención única.
- Crear una página de preguntas y respuestas para AEO.
- Convertir los proyectos principales en casos de estudio citables.
- Mantener `llms.txt` y el sitemap sincronizados con el contenido real.

## Prioridad P1, segunda fase

- Crear versiones Markdown de páginas relevantes.
- Añadir cabeceras HTTP para anunciar esas versiones.
- Mejorar el enlazado interno por clusters.
- Medir Search Console, descargas del CV, clics de contacto y navegación hacia proyectos.
- Mejorar títulos, descripciones, Open Graph y datos estructurados de cada plantilla.

## Prioridad P2, funciones avanzadas

- Crear una tarjeta MCP pública si realmente se van a ofrecer funciones para agentes.
- Añadir WebMCP solo para acciones seguras y útiles.
- Automatizar la generación del sitemap y `llms.txt` en cada despliegue.
- Crear una capa de contenido bilingüe si existe demanda real en inglés.

---

# 2. Corrección de entidad profesional y Schema.org

## Problema

Los buscadores pueden leer que existe una persona, una web y un perfil, pero necesitan una relación más explícita entre:

- Gabriel Alcántara.
- La marca personal.
- El sitio web.
- El CV.
- Los proyectos.
- Los artículos.
- Los perfiles externos.
- Los servicios profesionales.

## Corrección recomendada

Usar un único bloque JSON-LD en la plantilla principal y reutilizar el mismo identificador de entidad en el resto de páginas.

Ejemplo base que debe adaptarse solo con datos reales:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://gabrielalcantara.com/#person",
      "name": "Gabriel Alcántara",
      "url": "https://gabrielalcantara.com/",
      "jobTitle": "Solutions Architect",
      "description": "Arquitecto de software especializado en sistemas distribuidos, arquitecturas orientadas a eventos y automatización industrial.",
      "knowsAbout": [
        "Solutions Architecture",
        "Distributed systems",
        "Domain-driven design",
        "Event-driven architecture",
        "WebSockets",
        "Industrial automation"
      ],
      "sameAs": [
        "PERFIL_GITHUB",
        "PERFIL_LINKEDIN",
        "OTRO_PERFIL_VERIFICADO"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://gabrielalcantara.com/#professional-service",
      "name": "Gabriel Alcántara, Solutions Architecture",
      "url": "https://gabrielalcantara.com/",
      "provider": {
        "@id": "https://gabrielalcantara.com/#person"
      },
      "areaServed": [
        "Europe",
        "Remote"
      ],
      "serviceType": [
        "Solutions Architecture",
        "Technical leadership",
        "Distributed systems consulting"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://gabrielalcantara.com/#website",
      "url": "https://gabrielalcantara.com/",
      "name": "Gabriel Alcántara",
      "publisher": {
        "@id": "https://gabrielalcantara.com/#person"
      },
      "inLanguage": "es"
    }
  ]
}
</script>
```

## Reglas importantes

- No añadir clientes, cifras, cargos o certificaciones que no estén demostrados.
- No marcar la web como `Organization` si no existe una organización real detrás.
- Si se utiliza `ProfessionalService`, los servicios deben aparecer también en el contenido visible.
- Mantener un único nombre, descripción y especialidades principales.
- Añadir `sameAs` solo para perfiles propios y activos.
- Usar `inLanguage` correcto por página.

## Validación

Después de publicar:

1. Comprobar que el JSON-LD no tiene errores de sintaxis.
2. Revisar que los datos visibles coinciden con los estructurados.
3. Verificar que los enlaces de perfiles funcionan.
4. Revisar que las páginas de artículos incluyen `Article` y que las páginas de proyecto no se marcan falsamente como artículos.

---

# 3. Arquitectura recomendada de páginas

## Página principal

Debe responder en los primeros segundos:

- Quién eres.
- Qué tipo de problemas resuelves.
- En qué especialidades trabajas.
- Qué puede hacer el visitante después.

Estructura sugerida:

```text
H1: Arquitecto de software para sistemas complejos y distribuidos

Resumen corto de 2 o 3 frases.

CTA principal: Ver proyectos
CTA secundario: Descargar CV o Contactar

H2: En qué puedo ayudarte
H2: Proyectos destacados
H2: Especialidades
H2: Cómo trabajo
H2: Artículos recientes
H2: Preguntas frecuentes
H2: Contacto
```

## Página Sobre mí

Una página de entidad:

Incluir:

- Presentación profesional.
- Tipo de sistemas en los que trabajas.
- Sectores o contextos conocidos.
- Forma de trabajo.
- Tecnologías, solo cuando aporten contexto.
- Ubicación y modalidad.
- Enlaces verificables.
- CV descargable.

## Página de servicios

Separar servicios por problema, no solo por tecnología:

- Diseño y evolución de arquitectura.
- Sistemas distribuidos.
- Arquitectura orientada a eventos.
- Integración de sistemas industriales.
- Liderazgo técnico.
- Revisión de arquitectura.
- Acompañamiento a equipos.

Cada servicio debe tener:

- Para quién es.
- Qué problema resuelve.
- Qué incluye.
- Qué no incluye.
- Resultado esperado.
- Preguntas frecuentes.
- CTA.

## Página de proyectos

La página índice debe resumir cada proyecto en 80 a 120 palabras y enlazar al caso completo.

Cada proyecto individual debe incluir:

```text
Título claro
Resumen de una frase
Contexto
Problema
Mi responsabilidad
Restricciones
Arquitectura
Decisiones principales
Alternativas descartadas
Resultado verificable
Aprendizajes
Tecnologías
Preguntas frecuentes
Artículos relacionados
CTA de contacto
```

---

# 4. GEO: optimización para motores generativos

## Objetivo

Conseguir que un sistema de IA pueda contestar correctamente:

- Quién es Gabriel.
- Qué experiencia tiene.
- Qué problemas puede resolver.
- Qué proyectos demuestran esa experiencia.
- En qué tecnologías y dominios tiene autoridad.
- Cómo contactar o solicitar colaboración.

## Cambios de contenido

### 4.1 Crear una página de entidad

Título sugerido:

```text
Gabriel Alcántara, arquitecto de software y sistemas distribuidos
```

Debe incluir una respuesta directa de unas 50 palabras al principio:

```text
Gabriel Alcántara es un arquitecto de software especializado en el diseño y evolución de sistemas distribuidos, arquitecturas orientadas a eventos y soluciones de automatización industrial. Trabaja en la conexión entre estrategia técnica, diseño de sistemas y ejecución de equipos.
```

El texto final debe ajustarse a la realidad profesional del sitio.

### 4.2 Crear páginas citables

Los agentes necesitan páginas que puedan citar por una sola idea. Crear páginas o secciones específicas para:

- Arquitectura de sistemas distribuidos.
- Arquitectura orientada a eventos.
- Diseño impulsado por dominio.
- Comunicación en tiempo real con WebSockets.
- Automatización industrial e integración con PLC.
- Liderazgo técnico y evolución de sistemas existentes.

### 4.3 Mejorar cada artículo

Plantilla recomendada:

```text
H1: Pregunta o problema principal

Respuesta corta

Qué aprenderás

Contexto

H2: Concepto principal
H2: Cuándo utilizarlo
H2: Cuándo no utilizarlo
H2: Ejemplo práctico
H2: Errores frecuentes
H2: Decisión recomendada

Resumen final
Preguntas frecuentes
Artículos relacionados
```

La respuesta corta debe poder copiarse sin perder significado. Evitar comenzar con una introducción literaria de varias pantallas.

### 4.4 Mejorar la citabilidad

Cada página importante debe tener:

- Una idea principal.
- Una definición concreta.
- Un ejemplo.
- Una conclusión.
- Autor identificable.
- Fecha de publicación y actualización.
- Enlaces a fuentes o páginas propias relacionadas.
- URL estable.

---

# 5. AEO: optimización para respuestas

## Página FAQ prioritaria

Crear una página con preguntas reales y respuestas visibles, no solo un acordeón que oculte el contenido al rastreador.

Preguntas recomendadas:

1. ¿Qué hace un arquitecto de software?
2. ¿Cuándo conviene usar una arquitectura orientada a eventos?
3. ¿Cuándo es mejor un monolito modular que varios microservicios?
4. ¿Cómo se diseña la trazabilidad en un sistema distribuido?
5. ¿Qué problemas resuelve DDD?
6. ¿Qué diferencia hay entre WebSockets y polling?
7. ¿Cómo se integran sistemas industriales con plataformas modernas?
8. ¿Cómo se revisa una arquitectura existente?
9. ¿Qué tipo de colaboración profesional está disponible?
10. ¿Cómo se puede contactar con Gabriel?

## Formato de cada respuesta

- Primera frase: respuesta directa.
- Segundo párrafo: contexto y matices.
- Lista: criterios prácticos.
- Enlace: página propia que amplía el tema.

Ejemplo:

```text
## ¿Cuándo conviene una arquitectura orientada a eventos?

Conviene cuando varios componentes necesitan reaccionar a cambios de forma desacoplada, cuando se requiere trazabilidad de hechos del negocio o cuando diferentes consumidores evolucionan a ritmos distintos.

No es la mejor opción solo por querer usar una tecnología concreta. Primero hay que comprobar si el desacoplamiento, la asincronía y la trazabilidad compensan la complejidad operativa.
```

## Schema FAQPage

Solo utilizar `FAQPage` cuando las preguntas y respuestas estén visibles para cualquier visitante y representen contenido editorial real. No utilizarlo para preguntas falsas, contenido oculto o respuestas generadas únicamente para manipular resultados.

---

# 6. `llms.txt`, Markdown y contenido para agentes

## Estado actual

El sitio ya dispone de `llms.txt`, lo que es una ventaja. La mejora principal es mantenerlo sincronizado y hacer que cada enlace tenga una descripción precisa.

## Estructura recomendada

```markdown
# Gabriel Alcántara

## Perfil
- [Perfil profesional]: resumen de especialidades, experiencia y contexto.
- [CV]: experiencia profesional y tecnologías relevantes.

## Proyectos
- [Proyecto A]: problema, responsabilidad y resultado.
- [Proyecto B]: arquitectura y decisiones principales.

## Conocimiento
- [Artículo A]: explicación de arquitectura orientada a eventos.
- [Artículo B]: sistemas distribuidos y trazabilidad.

## Contacto
- [Contacto]: colaboración profesional y datos de contacto.
```

## Reglas para `llms.txt`

- No incluir páginas duplicadas.
- No incluir URLs privadas o temporales.
- Priorizar páginas con contenido completo.
- Añadir una descripción de una línea por recurso.
- Mantener el archivo ordenado por importancia.
- Actualizarlo automáticamente al publicar.
- Excluir páginas legales o técnicas que no aporten contexto, salvo que sean relevantes.

## Versiones Markdown

Crear una representación Markdown de las páginas más importantes:

```text
/about.md
/projects/project-name.md
/blog/article-name.md
/services.md
/faq.md
```

El HTML sigue siendo la versión principal para personas. Markdown sería una representación complementaria para agentes y herramientas.

## Cabecera `Link`

En las respuestas HTTP de las páginas HTML se puede anunciar el recurso Markdown relacionado:

```http
Link: </about.md>; rel="alternate"; type="text/markdown"
```

La ruta final debe corresponder a un archivo real. No publicar una cabecera que apunte a un recurso inexistente.

---

# 7. Correcciones técnicas recomendadas

## 7.1 Plantilla SEO por página

Cada página indexable debe definir:

- `title` único, idealmente con el tema y la marca.
- `meta description` específica.
- `link rel="canonical"` absoluto y coherente.
- Open Graph title, description, URL e image.
- Twitter Card equivalente.
- `lang` correcto en HTML.
- Un solo H1.
- Fecha visible en artículos.
- Autor visible.
- Breadcrumbs cuando ayuden a la navegación.

## 7.2 Sitemap

- Incluir solo URLs canónicas y públicas.
- Excluir páginas 404, duplicadas, de búsqueda interna y filtros.
- Actualizar `lastmod` solo cuando el contenido cambie realmente.
- Mantenerlo consistente con `llms.txt`.

## 7.3 Robots

- Permitir el rastreo de páginas públicas.
- Bloquear únicamente áreas privadas, búsquedas internas y endpoints sin valor.
- No bloquear CSS, JavaScript o imágenes necesarios para representar la página.
- No usar `robots.txt` para retirar una página ya indexada; para eso hay que usar la estrategia de indexación correspondiente.

## 7.4 Errores y redirecciones

- Mantener 404 real para recursos inexistentes.
- Redirigir permanentemente solo cuando exista una equivalencia clara.
- Evitar cadenas de redirecciones.
- Evitar que las versiones con y sin `www`, HTTP y HTTPS compitan.
- Revisar que los dominios alternativos redirigen con una sola redirección al dominio canónico.

## 7.5 Rendimiento

Revisar especialmente:

- Imágenes sobredimensionadas.
- Fuentes y pesos no utilizados.
- JavaScript enviado antes del contenido principal.
- Imágenes sin `width` y `height`.
- Scripts de analítica o widgets innecesarios.
- CSS no utilizado.
- Tiempo hasta el primer contenido visible.
- Cambios de layout durante la carga.

El objetivo: que el contenido principal aparezca rápido y sea usable en móvil.

## 7.6 Accesibilidad con impacto SEO

- Contraste suficiente.
- Foco visible con teclado.
- Texto alternativo descriptivo.
- Enlaces que expliquen su destino.
- Botones con nombres accesibles.
- Formularios con etiquetas visibles.
- Jerarquía de encabezados lógica.
- No comunicar información solo mediante color.

---

# 8. Instrumentación y medición

## Eventos recomendados

Medir como mínimo:

- Vista de página de proyecto.
- Clic en email.
- Envío correcto del formulario.
- Descarga del CV.
- Clic en GitHub.
- Clic en LinkedIn.
- Clic en cada CTA de servicio.
- Lectura profunda de un artículo.

## Search Console

Configurar y revisar:

- Consultas por nombre propio.
- Consultas de servicios.
- Consultas técnicas.
- Páginas con impresiones pero bajo CTR.
- Páginas que aparecen para términos no deseados.
- Páginas descubiertas pero no indexadas.
- Problemas de datos estructurados.

## Métricas de negocio

No quedarse solo con tráfico. Medir:

- Contactos cualificados.
- Descargas del CV.
- Visitas a proyectos desde búsquedas.
- Clics a perfiles profesionales.
- Artículos que generan oportunidades.
- Tiempo hasta el contacto después de leer un caso de estudio.

---

# 9. Plan de implementación por fases

## Fase 1: corrección técnica y entidad

- Consolidar title, description y canonical.
- Revisar Open Graph.
- Implementar JSON-LD de entidad.
- Añadir autor y fechas.
- Revisar sitemap y `llms.txt`.
- Validar 404, redirecciones y dominio canónico.

**Resultado esperado:** los buscadores y agentes entienden mejor quién eres y qué representa cada página.

## Fase 2: AEO y contenido citable

- Crear FAQ.
- Añadir respuestas directas al inicio de artículos.
- Reescribir títulos como problemas o preguntas.
- Añadir conclusiones y preguntas frecuentes a proyectos.
- Crear enlaces internos por temática.

**Resultado esperado:** más oportunidades de aparecer como respuesta concreta y más navegación hacia proyectos.

## Fase 3: GEO y autoridad

- Crear páginas pilares.
- Publicar casos de estudio profundos.
- Añadir comparativas técnicas.
- Obtener menciones externas reales.
- Homogeneizar perfiles profesionales.

**Resultado esperado:** mayor asociación entre tu nombre, tus especialidades y tus pruebas de experiencia.

## Fase 4: Capa agent-native

- Crear Markdown alternativo.
- Añadir cabeceras `Link`.
- Automatizar `llms.txt`.
- Evaluar tarjeta MCP.
- Evaluar WebMCP para contacto o exploración de proyectos.

**Resultado esperado:** agentes capaces de consumir el portfolio con menos ambigüedad y menor dependencia de HTML visual.

## Fase 5: Medición y mejora continua

- Conectar Search Console.
- Configurar eventos.
- Revisar consultas mensualmente.
- Actualizar contenidos con impresiones pero bajo CTR.
- Ampliar los temas que atraigan visitas cualificadas.

**Resultado esperado:** decisiones basadas en lo que Search Console muestre cada mes.

---

# 10. Checklist de validación antes de publicar

## SEO

- [ ] La página tiene una intención única.
- [ ] Tiene un H1 claro.
- [ ] El title no está duplicado.
- [ ] La descripción explica el valor de la página.
- [ ] El canonical apunta a la versión correcta.
- [ ] La página está en el sitemap si debe indexarse.
- [ ] La página está enlazada desde otra página relevante.

## GEO

- [ ] Se identifica claramente la persona o proyecto.
- [ ] El autor es visible.
- [ ] La especialidad aparece en texto natural.
- [ ] Hay una respuesta corta y citable.
- [ ] Se enlazan pruebas propias.
- [ ] La información coincide con perfiles externos.

## AEO

- [ ] El título refleja una pregunta o problema.
- [ ] La respuesta principal aparece al principio.
- [ ] Hay listas o pasos cuando son útiles.
- [ ] Se incluyen matices y cuándo no aplicar la recomendación.
- [ ] Existe una FAQ visible cuando corresponde.
- [ ] El contenido no depende de un acordeón inaccesible.

## Técnico para agentes

- [ ] `llms.txt` está actualizado.
- [ ] El sitemap está actualizado.
- [ ] Las páginas importantes tienen representación Markdown si se implementa esa capa.
- [ ] Las cabeceras anuncian recursos que realmente existen.
- [ ] No se exponen datos privados.
- [ ] El formulario no ejecuta acciones sin consentimiento.
- [ ] Las integraciones agent-native tienen límites claros.

---

# 11. Qué puedo preparar como siguiente entregable

1. Un bloque JSON-LD final adaptado a los datos reales de Gabriel.
2. El texto completo de la página FAQ.
3. La estructura y copy de la página de servicios.
4. Un caso de estudio completo para el proyecto más importante.
5. Una nueva versión de `llms.txt`.
6. Las plantillas Markdown para perfil, proyectos y artículos.
7. Los metadatos SEO de todas las páginas.
8. Un calendario editorial de 8 a 12 artículos.
9. Un checklist técnico para integrarlo en el repositorio y desplegarlo en Dokploy.
10. Un plan de medición para Search Console y analítica.

# 12. Límite operativo

La web pública se puede auditar y el código se puede preparar aquí. La aplicación no aparece como un proyecto editable de Hostinger AI Builder, por lo que los cambios de código deben incorporarse en el repositorio o en el flujo de despliegue de Dokploy.

La prioridad recomendada es implementar primero **entidad + JSON-LD + FAQ + casos de estudio + `llms.txt` sincronizado**. Esa combinación mejora simultáneamente SEO, GEO, AEO, comprensión de marca personal y conversión profesional.
