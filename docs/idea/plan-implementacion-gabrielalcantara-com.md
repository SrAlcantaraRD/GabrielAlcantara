# Plan de implementación por fases para gabrielalcantara.com

## Objetivo

Transformar `gabrielalcantara.com` en una web profesional centrada en:

- CV público.
- Portfolio técnico.
- Blog de autoridad.
- Posicionamiento como Software Architect & Software Engineer.
- Generación de oportunidades profesionales y de consultoría.
- Buena indexación en buscadores y comprensión por agentes de IA.

La web está construida con Astro y desplegada mediante Dokploy. El trabajo debe aplicarse en el repositorio fuente y publicarse mediante un nuevo despliegue.

---

## Sistema de prioridades

### P0, imprescindible

Bloquea o afecta directamente a la comprensión, navegación, contacto o publicación de la web.

### P1, alta prioridad

Mejora de forma notable el posicionamiento profesional, la conversión y la credibilidad técnica.

### P2, prioridad media

Aumenta el alcance, la calidad editorial y la visibilidad en buscadores y agentes de IA.

### P3, mejora continua

Optimizaciones que conviene realizar después de tener una versión sólida publicada.

---

## Resumen de fases

| Fase | Objetivo | Prioridad | Resultado |
|---|---|---:|---|
| 0 | Preparación y línea base | P0 | Repositorio y contenidos inventariados |
| 1 | Mensaje y navegación | P0 | La web explica claramente quién eres y qué haces |
| 2 | CV y contacto | P0 | Perfil profesional consultable y contactable |
| 3 | Portfolio y casos de estudio | P1 | Experiencia demostrada con proyectos concretos |
| 4 | Blog y autoridad | P1 | Sistema editorial preparado para crecer |
| 5 | SEO técnico y semántico | P1 | Páginas optimizadas e indexables |
| 6 | Visibilidad para IA | P2 | Perfil comprensible para buscadores y agentes |
| 7 | Diseño, accesibilidad y rendimiento | P1 | Experiencia sólida en móvil y escritorio |
| 8 | Publicación y validación | P0 | Nueva versión desplegada y verificada |
| 9 | Mejora continua | P2/P3 | Evolución basada en datos y contenido |

---

# Fase 0. Preparación y línea base

**Prioridad: P0**

## Objetivo

Conocer exactamente qué existe antes de cambiar contenido, estructura o diseño.

## Tareas

- Crear una rama de trabajo para la nueva versión.
- Hacer una copia o tag de la versión actualmente publicada.
- Inventariar las rutas existentes.
- Identificar componentes Astro reutilizables.
- Identificar layouts, plantillas y colecciones de contenido.
- Revisar dónde viven los artículos del blog.
- Revisar configuración de metadatos.
- Revisar sitemap y `robots.txt`.
- Revisar fuentes, imágenes y recursos externos.
- Detectar rutas que no deben romperse.
- Registrar el estado actual de la página de inicio, CV, proyectos y blog.
- Comprobar el despliegue actual en Dokploy antes de modificarlo.

## Entregables

- Inventario de rutas.
- Inventario de componentes.
- Lista de contenidos existentes.
- Copia de seguridad o punto de restauración.
- Lista de URLs que deben conservarse o redirigirse.
- Capturas o referencia visual de la versión anterior.

## Criterio de salida

No se empieza la reestructuración hasta saber qué páginas existen y cómo se publican actualmente.

---

# Fase 1. Mensaje, propuesta de valor y navegación

**Prioridad: P0**

## Objetivo

Conseguir que un visitante entienda el perfil profesional en menos de un minuto.

## Tareas

### 1. Hero de la página de inicio

Añadir:

- Nombre completo.
- Titular profesional.
- Especialidad principal.
- Frase de valor.
- Botón para ver proyectos.
- Botón para descargar el CV.
- Enlace de contacto.

Titular recomendado:

> Software Architect & Software Engineer especializado en sistemas distribuidos, arquitecturas orientadas a eventos y soluciones industriales conectadas.

Subtítulo recomendado:

> Diseño y evoluciono sistemas complejos combinando arquitectura, desarrollo backend, automatización, integración con hardware y liderazgo técnico.

### 2. Navegación

Consolidar la navegación en:

- Inicio.
- Sobre mí.
- Experiencia.
- Proyectos.
- Blog.
- Servicios.
- Contacto.

Añadir en la cabecera:

- Descargar CV.
- Contactar.

### 3. Secciones iniciales

Orden recomendado para la página de inicio:

1. Hero.
2. Especialidades.
3. Proyecto destacado.
4. Otros proyectos.
5. Experiencia.
6. Artículos destacados.
7. Llamada a la acción.

### 4. Reescritura del mensaje

Eliminar o reducir:

- Listas de tecnologías sin contexto.
- Párrafos genéricos.
- Frases pasivas.
- Repeticiones entre CV, inicio y perfil.

Sustituir responsabilidades por acciones e impacto:

> Diseñé y evolucioné servicios distribuidos para separar dominios de negocio, mejorar la autonomía de los equipos y permitir despliegues independientes.

## Entregables

- Nueva página de inicio.
- Navegación actualizada.
- Titular profesional en español.
- Versión inglesa del titular.
- Llamadas a la acción principales.

## Criterio de salida

Una persona que no conozca previamente tu trayectoria entiende qué haces, qué problemas resuelves y dónde puede ver pruebas de experiencia.

---

# Fase 2. CV, perfil profesional y contacto

**Prioridad: P0**

## Objetivo

Convertir la web en un CV profesional consultable, descargable y fácil de compartir.

## Tareas

### 1. Página de perfil

Crear o consolidar `/about` con:

- Resumen profesional.
- Más de 15 años de experiencia, si esta cifra se mantiene vigente.
- Especialidades técnicas.
- Forma de trabajo.
- Tipo de retos buscados.
- Enlaces profesionales.

### 2. Página de experiencia

Crear o consolidar `/experience`.

Cada posición debe incluir:

- Empresa.
- Cargo.
- Periodo.
- Contexto.
- Responsabilidades.
- Decisiones técnicas.
- Resultados.
- Tecnologías.

Usar verbos de acción como diseñé, lideré, evolucioné, migré, definí, automatizé y mentoricé.

### 3. Página de CV

Crear `/cv` o `/resume` con:

- Versión HTML.
- Enlace de descarga a PDF.
- Resumen ejecutivo.
- Especialidades.
- Experiencia.
- Proyectos.
- Tecnologías.
- Formación.
- Certificaciones.
- Idiomas.
- Enlaces profesionales.

La versión HTML debe ser completa. El PDF debe ser una alternativa, no el único lugar donde existe la información.

### 4. Página de contacto

Crear `/contact` con:

- Motivos de contacto.
- Email profesional.
- LinkedIn.
- GitHub.
- Descarga del CV.
- Formulario seguro, únicamente si puede mantenerse correctamente.

## Entregables

- Página “Sobre mí”.
- Página de experiencia.
- Página de CV.
- Página de contacto.
- CV PDF actualizado.
- Enlaces profesionales revisados.

## Criterio de salida

Un recruiter o potencial cliente puede entender el perfil, consultar el CV y contactar sin buscar información en varias páginas externas.

---

# Fase 3. Portfolio y casos de estudio

**Prioridad: P1**

## Objetivo

Demostrar la experiencia mediante proyectos concretos, no solo mediante listas de tecnologías.

## Tareas

### 1. Índice de proyectos

Crear o consolidar `/projects` con tarjetas que incluyan:

- Nombre.
- Problema resuelto.
- Rol de Gabriel.
- Tecnologías principales.
- Una frase de impacto.
- Enlace al caso completo.

### 2. Caso principal: Bodega Digital

Crear `/projects/bodega-digital` con esta estructura:

1. Resumen ejecutivo.
2. Contexto industrial.
3. Problema original.
4. Restricciones.
5. Rol personal.
6. Arquitectura.
7. Dominios y servicios.
8. Eventos y comunicación.
9. Integración con robots, PLC, LEDs y cámaras.
10. WebSockets y operaciones en tiempo real.
11. RBAC.
12. CI/CD y despliegue.
13. Decisiones técnicas.
14. Resultados.
15. Aprendizajes.

Añadir un diagrama de arquitectura en SVG o Mermaid.

No inventar métricas. Usar cifras solo cuando puedan publicarse. Si no hay cifras públicas, describir resultados observables como trazabilidad, automatización, integración de sistemas o reducción de intervención manual.

### 3. Otros proyectos

Preparar casos resumidos para:

- LoveISDIN.
- ACD Sistemes.
- Basetis.
- Quabu.
- Otros proyectos empresariales o industriales relevantes.

Cada uno debe responder:

- ¿Cuál era el problema?
- ¿Cuál fue el rol?
- ¿Qué decisión técnica fue importante?
- ¿Qué resultado se obtuvo?

## Entregables

- Índice de proyectos.
- Caso completo de Bodega Digital.
- Al menos tres proyectos resumidos.
- Diagramas técnicos optimizados para web.
- Plantilla reutilizable para nuevos casos.

## Criterio de salida

El portfolio demuestra capacidad de diseño, liderazgo y ejecución mediante evidencias concretas.

---

# Fase 4. Blog y autoridad técnica

**Prioridad: P1**

## Objetivo

Convertir el blog en una demostración continua de experiencia profesional.

## Tareas

### 1. Estructura editorial

Crear o consolidar `/blog` con:

- Artículos destacados.
- Categorías.
- Fecha.
- Tiempo estimado de lectura.
- Etiquetas.
- Autor.
- Artículos relacionados.

### 2. Categorías iniciales

- Arquitectura.
- Sistemas distribuidos.
- Backend.
- DDD.
- Automatización industrial.
- IA y agentes.
- Liderazgo técnico.
- Testing y calidad.

### 3. Primer bloque de contenidos

Priorizar artículos basados en experiencia real:

1. Lecciones de diseñar una plataforma industrial conectada.
2. Arquitectura orientada a eventos en sistemas reales.
3. DDD cuando el dominio es complejo.
4. WebSockets para operaciones en tiempo real.
5. CI/CD cuando el software controla hardware.
6. Decisiones de arquitectura que evitan complejidad innecesaria.
7. Cómo trabajar como Software Architect en equipos multidisciplinares.

### 4. Plantilla de artículo

Cada artículo debe incluir:

- Título específico.
- Resumen inicial.
- Problema o pregunta.
- Desarrollo por secciones.
- Ejemplos.
- Código accesible.
- Conclusión.
- Artículos relacionados.
- Proyecto relacionado, cuando corresponda.
- Fecha de publicación y actualización.

## Entregables

- Plantilla de post.
- Categorías.
- Página de índice.
- Calendario inicial de contenidos.
- Entre tres y cinco artículos prioritarios.

## Criterio de salida

El blog deja de ser una colección aislada de textos y se convierte en una biblioteca conectada con el CV y el portfolio.

---

# Fase 5. SEO técnico y editorial

**Prioridad: P1**

## Objetivo

Asegurar que cada página sea indexable, entendible y compartible.

## Tareas

### 1. Metadatos

Configurar por página:

- `title` único.
- `description` única.
- URL canónica.
- Open Graph.
- Imagen social.
- Idioma.
- Fecha cuando corresponda.

Títulos iniciales:

- Inicio: `Gabriel Alcántara | Software Architect & Software Engineer`
- Perfil: `Sobre Gabriel Alcántara | Arquitectura de software`
- Proyectos: `Proyectos de arquitectura de software y sistemas distribuidos`
- Blog: `Blog de arquitectura de software, backend y sistemas distribuidos`
- Contacto: `Contacto | Gabriel Alcántara`

### 2. Datos estructurados

Añadir JSON-LD para:

- `Person`.
- `ProfilePage`.
- `Article`.
- `BreadcrumbList`.
- `WebSite`.

### 3. Indexación

Comprobar:

- Sitemap XML.
- `robots.txt`.
- Canonicals.
- Redirecciones.
- Ausencia de páginas duplicadas.
- Ausencia de borradores indexables.

### 4. SEO de contenidos

Cada página debe tener:

- Un único H1.
- Encabezados jerárquicos.
- Enlaces internos.
- Texto alternativo.
- Slug limpio.
- Descripción orientada a intención de búsqueda.

## Entregables

- Componente centralizado de SEO.
- Metadatos para todas las páginas principales.
- JSON-LD validado.
- Sitemap revisado.
- Robots revisado.
- Enlazado interno entre proyectos y artículos.

## Criterio de salida

Las páginas principales tienen metadatos completos y no existen errores estructurales evidentes de indexación.

---

# Fase 6. Visibilidad para agentes de IA

**Prioridad: P2**

## Objetivo

Hacer que la web describa con claridad quién eres, qué experiencia tienes y qué tipo de problemas resuelves.

## Tareas

- Mantener una identidad profesional consistente en todas las páginas.
- Exponer el contenido importante como HTML real.
- Añadir JSON-LD de persona, perfil y artículos.
- Estructurar los casos de estudio con contexto, rol, arquitectura y resultados.
- Crear una página de autoridad técnica.
- Evaluar un archivo `llms.txt`.
- Evitar que la información crítica dependa exclusivamente de animaciones o interacción JavaScript.
- Relacionar proyectos con tecnologías y artículos.
- Repetir de forma natural el nombre profesional y las especialidades.

## Preguntas que la web debe responder

- ¿Quién es Gabriel Alcántara?
- ¿Es arquitecto de software?
- ¿Tiene experiencia con sistemas distribuidos?
- ¿Ha trabajado con automatización industrial?
- ¿Qué proyectos ha realizado?
- ¿Qué tipo de colaboración ofrece?
- ¿Cómo se puede contactar con él?

## Entregables

- Perfil profesional semánticamente claro.
- Datos estructurados.
- Casos de estudio mejor organizados.
- Página de autoridad técnica.
- Evaluación de `llms.txt`.
- Nuevo escaneo de visibilidad después de publicar.

## Criterio de salida

Un buscador o agente puede extraer una descripción fiable del perfil sin depender de información externa.

---

# Fase 7. Diseño, accesibilidad y rendimiento

**Prioridad: P1**

## Objetivo

Mejorar la experiencia de lectura y reforzar la percepción de calidad técnica.

## Tareas

### Diseño

- Simplificar la primera pantalla.
- Mejorar la jerarquía visual.
- Unificar tarjetas de proyectos.
- Crear una cronología legible para la experiencia.
- Usar un sistema consistente de espaciado, color y tipografía.
- Evitar elementos decorativos que oculten el contenido principal.

### Responsive

Comprobar en móvil:

- Menú.
- Hero.
- Botones.
- Tarjetas.
- Cronología.
- Diagramas.
- Código.
- Formularios.

### Accesibilidad

Implementar:

- Contraste suficiente.
- Foco visible.
- Navegación con teclado.
- Textos alternativos.
- Etiquetas de formularios.
- Enlaces descriptivos.
- Jerarquía correcta de encabezados.
- Respeto a `prefers-reduced-motion`.

### Rendimiento

Revisar:

- Peso de imágenes.
- Fuentes externas.
- JavaScript innecesario.
- Animaciones.
- Carga diferida.
- Código enviado al navegador.
- Visibilidad rápida del contenido principal.

## Entregables

- Sistema visual coherente.
- Revisión responsive.
- Revisión de accesibilidad.
- Imágenes optimizadas.
- Reducción de JavaScript innecesario.
- Lista de problemas pendientes, si queda alguno.

## Criterio de salida

La web se puede leer y navegar correctamente desde móvil, escritorio y teclado.

---

# Fase 8. Publicación y validación

**Prioridad: P0**

## Objetivo

Publicar la nueva versión sin romper las rutas, el dominio ni los redireccionamientos existentes.

## Tareas

### Antes del despliegue

- Ejecutar build local.
- Ejecutar validación de tipos si existe.
- Ejecutar lint si existe.
- Revisar enlaces internos.
- Revisar imágenes.
- Revisar metadatos.
- Revisar sitemap.
- Revisar `robots.txt`.
- Comprobar las rutas antiguas.
- Confirmar que el dominio principal sigue apuntando al despliegue correcto.

### Despliegue

- Crear un nuevo despliegue en Dokploy.
- Revisar logs de build.
- Comprobar que la aplicación queda saludable.
- Verificar SSL.
- Verificar el dominio principal.
- Verificar las versiones `.es` y `.eu` si mantienen redirecciones hacia `.com`.

### Después del despliegue

- Probar inicio.
- Probar CV.
- Probar experiencia.
- Probar proyectos.
- Probar Bodega Digital.
- Probar blog.
- Probar contacto.
- Probar descarga de PDF.
- Probar móvil.
- Probar enlaces externos.
- Revisar el HTML generado.
- Ejecutar de nuevo el análisis de visibilidad en IA.

## Criterio de salida

La nueva versión está publicada, las rutas principales funcionan y no se han perdido contenidos ni enlaces relevantes.

---

# Fase 9. Mejora continua

**Prioridad: P2/P3**

## Objetivo

Mejorar la web usando datos reales y mantenerla actualizada.

## Tareas recurrentes

- Publicar un artículo técnico de forma periódica.
- Añadir proyectos cuando finalice un trabajo relevante.
- Actualizar el CV cuando cambie el rol o la experiencia.
- Revisar enlaces rotos.
- Revisar rendimiento.
- Revisar datos de Search Console.
- Identificar consultas de búsqueda útiles.
- Actualizar artículos antiguos.
- Mejorar páginas con tráfico pero poca conversión.
- Revisar anualmente la página de experiencia.
- Revisar el perfil en inglés.

## Métricas útiles

- Visitas a la página de inicio.
- Visitas al CV.
- Descargas del CV.
- Visitas a casos de estudio.
- Tiempo de lectura de artículos.
- Clics hacia contacto.
- Consultas de búsqueda.
- Páginas indexadas.
- Errores de rastreo.
- Rendimiento móvil.

---

# Orden de ejecución recomendado

## Sprint 1: claridad profesional

- Fase 0.
- Hero.
- Navegación.
- Mensaje principal.
- Llamadas a la acción.

## Sprint 2: CV y contacto

- Sobre mí.
- Experiencia.
- CV HTML.
- PDF.
- Contacto.

## Sprint 3: portfolio

- Índice de proyectos.
- Bodega Digital.
- Tres proyectos adicionales.
- Primer diagrama técnico.

## Sprint 4: blog

- Plantilla de artículos.
- Categorías.
- Artículos destacados.
- Enlaces entre blog y proyectos.

## Sprint 5: SEO y accesibilidad

- Metadatos.
- JSON-LD.
- Sitemap.
- Robots.
- Canonicals.
- Responsive.
- Accesibilidad.

## Sprint 6: publicación y validación

- Build.
- Despliegue.
- Revisión de dominio y SSL.
- Pruebas completas.
- Nuevo análisis de visibilidad.

## Después de la primera versión sólida

- Traducción al inglés.
- Página de servicios.
- Página de autoridad técnica.
- `llms.txt`.
- Nuevos artículos.
- Mejoras basadas en datos.

---

# Qué no debe hacerse al principio

Para evitar dispersión, dejar fuera de la primera versión:

- Rediseños visuales complejos sin mejorar el mensaje.
- Animaciones pesadas.
- Blog sin estrategia editorial.
- Formularios que no tengan un flujo de recepción mantenible.
- Listas interminables de tecnologías.
- Publicar métricas no verificables.
- Crear muchas páginas vacías.
- Traducir todo antes de cerrar el contenido principal en español.
- Construir funcionalidades que no ayuden a presentar el perfil o generar contacto.

---

# Resultado final esperado

La versión final debe funcionar como una combinación de:

- CV profesional.
- Portfolio técnico.
- Biblioteca de conocimiento.
- Página de autoridad.
- Landing de consultoría.
- Identidad profesional indexable.

La prioridad inicial no es añadir más funcionalidades, sino hacer que el valor profesional existente sea evidente, demostrable y fácil de encontrar.

---

# Detalle de copy y estructura final de las páginas

Esta sección define el contenido recomendado para la primera versión sólida de la web. El copy debe adaptarse después con los datos exactos del CV, proyectos y preferencias profesionales de Gabriel. Las frases propuestas son una base de trabajo, no afirmaciones que deban publicarse sin validación.

## 1. Página de inicio `/`

### Objetivo

Explicar rápidamente quién es Gabriel, qué problemas resuelve y hacia dónde debe continuar el visitante.

### Estructura final

1. Hero profesional.
2. Especialidades principales.
3. Proyecto destacado.
4. Proyectos seleccionados.
5. Resumen de experiencia.
6. Artículos destacados.
7. Llamada a la acción final.

### Copy recomendado

#### Hero

**Eyebrow:**

> Software Architect · Software Engineer · Distributed Systems

**H1:**

> Diseño sistemas complejos para convertir problemas difíciles en software evolutivo.

**Párrafo:**

> Soy Gabriel Alcántara, Software Architect & Software Engineer especializado en sistemas distribuidos, arquitecturas orientadas a eventos, backend y soluciones industriales conectadas.

**CTA principal:**

> Ver proyectos

**CTA secundario:**

> Descargar CV

**Enlace adicional:**

> Contactar conmigo

#### Especialidades

Título:

> Áreas en las que aporto valor

Tarjetas:

- **Arquitectura de software:** diseño y evolución de sistemas complejos.
- **Sistemas distribuidos:** servicios, eventos, comunicación y resiliencia.
- **Liderazgo técnico:** decisiones de arquitectura, mentoring y alineamiento de equipos.
- **Automatización industrial:** integración entre software, operaciones y hardware.

#### Proyecto destacado

Título:

> Del dominio de negocio a la operación industrial

Texto:

> En Bodega Digital trabajé en una solución que conecta software, operaciones y hardware para coordinar procesos industriales en tiempo real.

CTA:

> Ver el caso de estudio

#### Experiencia

Título:

> Experiencia construyendo y evolucionando productos reales

Texto:

> He trabajado en productos digitales, plataformas empresariales y sistemas industriales, participando tanto en las decisiones de arquitectura como en su implementación y evolución.

CTA:

> Ver experiencia

#### Blog

Título:

> Ideas sobre arquitectura y sistemas complejos

Texto:

> Escribo sobre decisiones técnicas, sistemas distribuidos, diseño de dominios, automatización y las prácticas que ayudan a construir software sostenible.

CTA:

> Leer el blog

#### CTA final

Título:

> ¿Hablamos de arquitectura, sistemas distribuidos o evolución técnica?

Texto:

> Si estás trabajando en un problema complejo o necesitas una segunda perspectiva técnica, puedes escribirme.

CTA:

> Contactar

---

## 2. Página “Sobre mí” `/about`

### Objetivo

Presentar la trayectoria, la forma de trabajar y el tipo de problemas que interesan a Gabriel.

### Estructura final

1. Título y resumen.
2. Trayectoria profesional.
3. Principios de trabajo.
4. Áreas de especialización.
5. Qué tipo de retos busca.
6. Enlaces al CV, proyectos y contacto.

### Copy recomendado

**H1:**

> Arquitectura, ingeniería y claridad para sistemas complejos.

**Introducción:**

> Soy Software Architect & Software Engineer con más de 15 años de experiencia diseñando, construyendo y evolucionando sistemas de software. Mi trabajo combina arquitectura, desarrollo backend, sistemas distribuidos, automatización y liderazgo técnico.

**Forma de trabajar:**

> Me interesa entender el dominio antes de elegir la tecnología. Busco soluciones que sean comprensibles para los equipos, sostenibles en producción y capaces de evolucionar cuando cambian las necesidades del negocio.

**Principios:**

- Entender el problema antes de aumentar la complejidad.
- Diseñar límites claros entre responsabilidades.
- Automatizar todo lo que pueda repetirse.
- Validar las decisiones con feedback real.
- Compartir contexto para que los equipos puedan avanzar con autonomía.

**Cierre:**

> Actualmente me interesan especialmente los retos relacionados con arquitectura de plataformas, sistemas distribuidos, productos industriales y liderazgo técnico.

---

## 3. Página de experiencia `/experience`

### Objetivo

Mostrar progresión profesional y responsabilidad, no solamente una lista cronológica de empleos.

### Estructura de cada posición

1. Cargo.
2. Empresa.
3. Periodo.
4. Contexto.
5. Responsabilidades.
6. Decisiones técnicas.
7. Impacto.
8. Tecnologías.

### Plantilla de copy

**[Cargo] · [Empresa]**  
`[Periodo]`

> Participé en la evolución de [producto, plataforma o sistema], trabajando en [contexto principal]. Mi responsabilidad se centró en [responsabilidad principal] y en ayudar al equipo a [resultado buscado].

**Responsabilidades principales:**

- Diseñé o evolucioné [sistema, dominio o componente].
- Colaboré con [equipos o perfiles].
- Definí decisiones relacionadas con [arquitectura, integración o despliegue].
- Mejoré [calidad, autonomía, velocidad, trazabilidad o mantenibilidad].

**Tecnologías y prácticas:**

`[Tecnología]` · `[Tecnología]` · `[Práctica]`

No publicar frases genéricas como “responsable de desarrollo” si pueden sustituirse por una acción concreta y su contexto.

---

## 4. Página de CV `/cv`

### Objetivo

Ofrecer una versión completa, rápida de leer y fácil de descargar.

### Estructura final

1. Nombre y titular.
2. Resumen ejecutivo.
3. Especialidades.
4. Experiencia.
5. Proyectos destacados.
6. Tecnologías.
7. Formación y certificaciones.
8. Idiomas.
9. Enlaces profesionales.
10. Descarga PDF.

### Copy recomendado

**Resumen ejecutivo:**

> Software Architect & Software Engineer con experiencia en sistemas distribuidos, arquitectura orientada a eventos, backend, automatización industrial y liderazgo técnico. Combino visión de arquitectura con capacidad de implementación y acompañamiento a equipos.

**Especialidades:**

- Software architecture.
- Distributed systems.
- Event-driven architecture.
- Domain-driven design.
- Backend engineering.
- Industrial automation.
- Technical leadership.
- CI/CD and engineering practices.

**CTA:**

> Descargar CV en PDF

El PDF debe tener una versión visualmente cuidada, pero la información principal debe permanecer disponible en HTML para accesibilidad, búsqueda e indexación.

---

## 5. Página de proyectos `/projects`

### Objetivo

Permitir que el visitante encuentre rápidamente evidencias de experiencia.

### Estructura final

1. Introducción.
2. Proyecto destacado.
3. Proyectos seleccionados.
4. Filtros opcionales por área.
5. CTA de contacto.

### Copy recomendado

**H1:**

> Proyectos donde la arquitectura se encuentra con la realidad.

**Introducción:**

> Estos proyectos muestran algunos de los problemas técnicos y de negocio en los que he trabajado, desde plataformas empresariales hasta sistemas industriales conectados.

### Plantilla de tarjeta

**Nombre del proyecto**

> [Una frase que describa el problema y el resultado, no solo la tecnología.]

`[Rol]` · `[Área]` · `[Tecnologías principales]`

CTA:

> Ver caso de estudio

---

## 6. Caso de estudio Bodega Digital `/projects/bodega-digital`

### Objetivo

Convertir el proyecto en la principal prueba de experiencia arquitectónica e industrial.

### Estructura final

1. Resumen ejecutivo.
2. Contexto.
3. Problema.
4. Restricciones.
5. Rol personal.
6. Arquitectura.
7. Comunicación y eventos.
8. Integración con hardware.
9. Seguridad y roles.
10. Despliegue.
11. Resultados.
12. Aprendizajes.

### Copy recomendado

**H1:**

> Bodega Digital: software distribuido para operaciones industriales en tiempo real.

**Resumen:**

> Una plataforma conectada con la operación de una bodega, diseñada para coordinar procesos, usuarios y dispositivos físicos mediante servicios distribuidos y comunicación en tiempo real.

**Contexto:**

> El sistema debía conectar necesidades de negocio con operaciones físicas, manteniendo una comunicación fiable entre aplicaciones, usuarios y dispositivos industriales.

**Problema:**

> El reto no consistía únicamente en construir una aplicación, sino en coordinar distintos actores, dispositivos y flujos operativos dentro de un sistema que debía ser trazable, mantenible y capaz de evolucionar.

**Rol:**

> Mi trabajo combinó diseño de arquitectura, modelado de dominios, desarrollo de servicios, integración con dispositivos, definición de flujos de comunicación y acompañamiento de las decisiones técnicas.

**Arquitectura:**

> La solución se organizó alrededor de dominios y servicios con responsabilidades claras, comunicación orientada a eventos y canales en tiempo real para reflejar el estado de las operaciones.

**Resultado:**

> El sistema permitió conectar software y operación industrial, mejorar la trazabilidad de los procesos y automatizar interacciones que antes requerían coordinación manual.

El texto definitivo debe sustituir las formulaciones generales por datos concretos que puedan publicarse sin revelar información confidencial.

---

## 7. Página de blog `/blog`

### Objetivo

Presentar el blog como una biblioteca técnica y no como una lista aislada de publicaciones.

### Estructura final

1. Título.
2. Descripción editorial.
3. Artículo destacado.
4. Filtros por categoría.
5. Lista de artículos.
6. CTA hacia proyectos o contacto.

### Copy recomendado

**H1:**

> Ideas sobre arquitectura, sistemas distribuidos y software que evoluciona.

**Introducción:**

> Escribo sobre los problemas que aparecen al diseñar y mantener sistemas reales: límites de dominio, comunicación entre servicios, automatización, testing, despliegue y liderazgo técnico.

**CTA final:**

> Explorar proyectos relacionados

### Plantilla de artículo

1. Categoría y fecha.
2. H1 específico.
3. Resumen de dos o tres líneas.
4. Problema que se quiere resolver.
5. Desarrollo.
6. Ejemplos o diagramas.
7. Conclusión.
8. Artículos relacionados.
9. Proyecto relacionado.
10. CTA final.

---

## 8. Página de servicios `/services`

### Objetivo

Explicar cómo puede colaborar Gabriel sin convertir la web en una agencia genérica.

### Estructura final

1. Introducción.
2. Tipos de colaboración.
3. Servicios concretos.
4. Cómo se trabaja.
5. CTA de contacto.

### Copy recomendado

**H1:**

> Ayuda técnica para tomar mejores decisiones sobre sistemas complejos.

**Introducción:**

> Puedo colaborar con equipos que necesiten revisar una arquitectura, evolucionar una plataforma o convertir un problema técnico complejo en un plan ejecutable.

**Servicios:**

- Revisión de arquitectura.
- Diseño de sistemas distribuidos.
- Modernización de plataformas.
- Diseño de integraciones.
- Modelado de dominios.
- Acompañamiento técnico a equipos.
- Mentoría para perfiles senior.
- Revisión de decisiones técnicas.

**Cómo trabajo:**

> Empiezo por entender el contexto, las restricciones y el resultado que se necesita. Después propongo alternativas, explico sus compromisos y ayudo a convertir la decisión en pasos concretos.

**CTA:**

> Comentar un reto técnico

Esta página solo debe publicarse si realmente se desea aceptar colaboraciones o conversaciones de consultoría.

---

## 9. Página de contacto `/contact`

### Objetivo

Eliminar fricción para iniciar una conversación profesional.

### Estructura final

1. Título.
2. Motivos de contacto.
3. Canales.
4. Formulario opcional.
5. Expectativas sobre el mensaje.

### Copy recomendado

**H1:**

> Hablemos de tu próximo reto técnico.

**Texto:**

> Puedes escribirme si quieres hablar sobre arquitectura de software, sistemas distribuidos, automatización, liderazgo técnico o evolución de una plataforma existente.

**Para ayudarme a responder mejor, incluye:**

- Qué problema estás intentando resolver.
- En qué fase se encuentra el proyecto.
- Qué tipo de ayuda necesitas.
- Cómo prefieres continuar la conversación.

**CTA:**

> Enviar mensaje

En caso de no usar formulario, mostrar directamente los canales de contacto que se quieran hacer públicos.

---

## 10. Página de autoridad técnica `/speaking` o `/writing`

### Objetivo

Agrupar publicaciones, charlas, certificaciones, contribuciones y otras pruebas públicas de experiencia.

### Estructura final

- Presentaciones.
- Publicaciones.
- Proyectos open source.
- Certificaciones.
- Comunidades.
- Enlaces externos.

### Copy recomendado

**H1:**

> Compartir conocimiento también forma parte de la ingeniería.

**Texto:**

> Esta sección reúne contenidos, proyectos y actividades que reflejan mi forma de entender la arquitectura y el trabajo técnico.

No crear la página hasta disponer de contenido suficiente para que no parezca vacía.

---

## 11. Reglas editoriales para todo el sitio

- Escribir en primera persona cuando se hable del perfil.
- Usar frases concretas y evitar lenguaje corporativo vacío.
- Explicar el problema antes que la tecnología.
- Diferenciar claramente responsabilidad personal y trabajo del equipo.
- No publicar información confidencial.
- No inventar métricas.
- Mantener el mismo titular profesional en todas las páginas.
- Mantener la misma forma de escribir el nombre y los perfiles externos.
- Preferir párrafos cortos y listas con intención.
- Enlazar cada proyecto con artículos relacionados.
- Enlazar cada artículo con un proyecto o especialidad cuando sea natural.

## 12. Prioridad de redacción

### Primera entrega

- Inicio.
- Sobre mí.
- CV.
- Contacto.
- Bodega Digital.

### Segunda entrega

- Índice de proyectos.
- Experiencia completa.
- Blog.
- Tres artículos prioritarios.
- Página de servicios, si procede.

### Tercera entrega

- Versión inglesa.
- Página de autoridad técnica.
- Casos de estudio adicionales.
- `llms.txt`.
- Contenido editorial recurrente.

## Criterio de aceptación del contenido

El copy estará listo cuando:

- Se entienda el perfil sin leer todo el sitio.
- Cada afirmación importante tenga contexto.
- Los proyectos demuestren responsabilidades y resultados.
- El CV y la web no se contradigan.
- El blog refuerce las especialidades principales.
- Todas las páginas importantes tengan una acción siguiente clara.