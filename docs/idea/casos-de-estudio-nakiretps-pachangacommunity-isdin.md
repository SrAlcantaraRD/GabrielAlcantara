# Casos de estudio para gabrielalcantara.com

## Enfoque editorial

Estos tres proyectos son buenos candidatos para demostrar tres capacidades distintas:

- **NakireTPS:** arquitectura de sistemas físicos y digitales en tiempo real.
- **PachangaCommunity:** producto digital completo, móvil, pagos, suscripciones y crecimiento con recursos limitados.
- **ISDIN / LoveISDIN:** transformación de una plataforma internacional con configuración por países y migración desde legacy.

Cada caso debe explicar el problema, las decisiones, las restricciones, tu responsabilidad y lo que aprendiste.

No conviene inventar métricas. Como los resultados todavía no están medidos, se pueden utilizar resultados cualitativos y dejar una sección preparada para incorporar cifras más adelante.

---

# Caso 1: NakireTPS

> Confirmar antes de publicar si el nombre definitivo es `NakireTPS`, `NacreTPS` u otra variante.

## Posicionamiento

**Título SEO sugerido:**

```text
NakireTPS: coordinación en tiempo real de PLC, robots y transporte de pallets
```

**H1 sugerido:**

```text
Diseñar un sistema distribuido para coordinar robots, PLC y personas en tiempo real
```

**Descripción corta:**

```text
Cómo diseñé la arquitectura de una plataforma capaz de coordinar dispositivos industriales, transporte de pallets, eventos en tiempo real, usuarios y operaciones humanas.
```

## Resumen inicial

NakireTPS aborda la coordinación de distintos dispositivos industriales, como PLC, robots y sistemas LED, para transportar pallets desde un punto de origen hasta un destino. En el mismo sistema entran operarios, autenticación, operaciones de frontend y backend y comunicación en tiempo real.

## Historia recomendada

### 1. El problema

Explicar que el sistema debía coordinar:

- Distintos dispositivos industriales.
- Estados físicos y estados digitales.
- Robots y PLC.
- Operarios o personas involucradas en el proceso.
- Transporte de pallets entre puntos.
- Mensajes de error y recuperación.
- Identidad, autenticación y autorización.

### 2. Tu responsabilidad

```text
Mi responsabilidad fue diseñar la arquitectura del sistema y definir cómo debían comunicarse los diferentes componentes, los dispositivos industriales, el backend, el frontend y los usuarios que intervenían en la operación.
```

Si además implementaste partes concretas, añadirlas explícitamente: diseño de eventos, backend, frontend, integración, observabilidad, despliegue o debugging.

### 3. Decisión arquitectónica

Explicar por qué el sistema necesitaba un enfoque basado en eventos:

- Los dispositivos producen cambios de estado.
- Distintos consumidores necesitan reaccionar a esos cambios.
- No todos los componentes evolucionan al mismo ritmo.
- El sistema debe mantener trazabilidad de lo ocurrido.
- La comunicación puede ser asíncrona internamente y en tiempo real hacia los usuarios.

### 4. Real-time y SSE

Describir el uso de Server-Sent Events como mecanismo de comunicación desde el backend hacia los clientes cuando el flujo sea principalmente servidor a cliente.

Explicar:

- Qué eventos necesitaban ver los usuarios.
- Cómo se evitaban conexiones innecesarias.
- Cómo se gestionaba la reconexión.
- Cómo se distinguía un evento operativo de un error.
- Cómo se evitaba que la interfaz mostrara un estado obsoleto.

No afirmar que SSE era la única opción. Presentarlo como una decisión adecuada para la distribución de actualizaciones hacia las interfaces.

### 5. Integración con personas

Este apartado es importante para GEO porque demuestra que no era solo una integración entre máquinas.

Explicar:

- Qué decisiones quedaban en manos de los operarios.
- Cómo se reflejaban sus acciones en el sistema.
- Cómo se controlaban permisos y autenticación.
- Cómo se comunicaban incidencias.
- Cómo se evitaban ambigüedades entre estado físico y estado digital.

### 6. Debugging de eventos e IA

Describir la integración con IA solo desde un punto de vista técnico y verificable:

- Ayuda a explorar eventos.
- Ayuda a localizar patrones o errores.
- Ayuda a acelerar el diagnóstico.
- No sustituye la observabilidad ni la validación humana.

## Preguntas AEO para este caso

- ¿Cómo se coordinan PLC y robots en un sistema de transporte de pallets?
- ¿Por qué utilizar una arquitectura orientada a eventos en automatización industrial?
- ¿Qué papel tiene SSE en una interfaz industrial en tiempo real?
- ¿Cómo se sincronizan dispositivos físicos y usuarios?
- ¿Cómo se depuran errores en sistemas distribuidos con dispositivos industriales?

## Datos estructurados

Usar:

- `Article` si se presenta como artículo técnico.
- `TechArticle` si el contenido es claramente técnico.
- `Person` como autor.
- `BreadcrumbList`.
- `about` para relacionar el artículo con sistemas distribuidos, automatización industrial y arquitectura orientada a eventos.

## Datos que conviene añadir después

- Número aproximado de dispositivos.
- Tipo de PLC y robots, si es publicable.
- Número de flujos o estados principales.
- Tiempo de actualización esperado.
- Tipo de despliegue.
- Resultado operativo observable.
- Incidencias o errores que se redujeron.

---

# Caso 2: PachangaCommunity

## Posicionamiento

**Título SEO sugerido:**

```text
PachangaCommunity: construir una web y app móvil con pagos, suscripciones y tiempo real
```

**H1 sugerido:**

```text
Diseñar y evolucionar un producto digital móvil con pagos, comunidad y crecimiento orgánico
```

**Descripción corta:**

```text
Caso de estudio sobre la construcción de una web y una app móvil con Astro, notificaciones push, pagos, suscripciones, tracking, rendimiento y posicionamiento en tiendas.
```

## Resumen inicial

PachangaCommunity es un producto digital que combina website y aplicación móvil. El proyecto exigía coordinar experiencia de usuario, notificaciones push, pagos, suscripciones, rendimiento, control de usuarios, tracking y posicionamiento en las tiendas de aplicaciones.

El aspecto diferencial es que gran parte del trabajo fue asumido por una sola persona, con apoyo de herramientas de IA, dentro de un alcance amplio que incluía producto, frontend, backend, crecimiento y operación.

## Historia recomendada

### 1. El problema

No presentarlo como “hacer una web y una app”, sino como la necesidad de mantener coherencia entre varias superficies:

- Website.
- Aplicación móvil.
- Usuarios.
- Suscripciones.
- Pagos.
- Notificaciones.
- Tracking.
- Tiendas de aplicaciones.
- Rendimiento.

### 2. Tu responsabilidad

```text
Mi responsabilidad cubrió la arquitectura y la coordinación de las principales piezas técnicas del producto: web, app móvil, usuarios, pagos, suscripciones, notificaciones, rendimiento, tracking y publicación en tiendas.
```

Ajustar esta frase si hubo componentes que no implementaste directamente.

### 3. Astro y experiencia web

Explicar qué papel cumplía Astro:

- Rendimiento inicial.
- Generación de páginas.
- Separación entre contenido estático e interacción.
- Reducción de JavaScript enviado cuando era posible.
- Organización visual mediante Atomic Design.

No afirmar métricas de rendimiento sin medición.

### 4. Atomic Design

Explicar cómo ayudó a mantener consistencia:

- Componentes básicos.
- Componentes compuestos.
- Patrones reutilizables.
- Pantallas coherentes.
- Menor duplicación visual.

Conectar esta decisión con la posibilidad de evolucionar web y app sin crear una experiencia fragmentada.

### 5. Pagos y suscripciones

Describir el problema de negocio y técnico:

- Usuarios con distintos estados.
- Renovaciones.
- Cancelaciones.
- Fallos de pago.
- Permisos asociados a la suscripción.
- Sincronización entre proveedor de pagos y sistema propio.

Si se utilizó RevenueCat, mencionar su papel solo en las capacidades que realmente se hayan usado: compras dentro de la aplicación, suscripciones, restauración de compras, estado de entitlement o sincronización.

### 6. Notificaciones y sincronía

Explicar:

- Qué eventos generaban push notifications.
- Cómo se evitaban duplicados.
- Cómo se controlaban permisos.
- Qué ocurría cuando un dispositivo estaba offline.
- Cómo se mantenía la coherencia entre app y backend.

### 7. ASO y crecimiento

El caso también sirve para demostrar que una arquitectura de producto no termina en el código.

Incluir:

- Optimización de fichas en stores.
- Nombres y descripciones.
- Capturas.
- Palabras relacionadas con la intención del usuario.
- Rendimiento percibido.
- Tracking de eventos.
- Relación entre adquisición, activación y suscripción.

Usar “ASO” como término correcto y evitar errores como “ASC”.

### 8. Trabajo individual y límites

Este es un apartado potente si se redacta sin dramatismo:

- El alcance incluía muchas áreas distintas.
- Se usaron herramientas de IA para acelerar tareas.
- Aun así, una sola persona no puede cubrir indefinidamente producto, frontend, backend, móvil, pagos, ASO, analítica y operación al mismo nivel.
- Esta experiencia permite explicar qué conviene automatizar, qué conviene delegar y qué debe simplificarse.

## Preguntas AEO para este caso

- ¿Cómo coordinar una web y una app móvil con el mismo producto?
- ¿Cómo sincronizar pagos y suscripciones entre una app y un backend?
- ¿Qué problemas aparecen al integrar notificaciones push?
- ¿Cómo usar Atomic Design en un producto digital multiplataforma?
- ¿Cómo combinar rendimiento web, ASO y monetización?
- ¿Qué puede cubrir una sola persona con apoyo de IA y dónde aparecen los límites?

## Datos estructurados

Usar:

- `Article` o `TechArticle`.
- `SoftwareApplication` únicamente si la página describe claramente la aplicación.
- `Person` como autor.
- `BreadcrumbList`.
- `about` para pagos, suscripciones, aplicaciones móviles, rendimiento y ASO.

## Datos que conviene añadir después

- Usuarios registrados o activos, si es publicable.
- Número de plataformas.
- Número de eventos de tracking.
- Tiempo de publicación.
- Mejoras de conversión.
- Rendimiento antes y después.
- Descargas o posición en stores.
- Porcentaje de suscripciones renovadas.

---

# Caso 3: ISDIN / LoveISDIN

## Posicionamiento

**Título SEO sugerido:**

```text
ISDIN LoveISDIN: migrar una plataforma internacional configurable para 21 países
```

**H1 sugerido:**

```text
Centralizar la experiencia digital de una marca global sin perder las diferencias locales
```

**Descripción corta:**

```text
Cómo evolucionar una plataforma internacional con frontend dinámico, BackOffice, reglas por país y migración desde un sistema legacy hacia una arquitectura común.
```

## Resumen inicial

El reto de LoveISDIN no consistía únicamente en crear una interfaz nueva. La plataforma debía servir a diferentes países, con normas, contenidos, configuraciones y necesidades locales, mientras se construía una identidad digital más coherente para la marca.

La solución debía centralizar la experiencia sin borrar las diferencias necesarias entre mercados.

## Historia recomendada

### 1. El problema

Presentar la tensión principal:

- Cada país tenía necesidades y reglas propias.
- La plataforma anterior estaba basada en legacy.
- El frontend debía ser dinámico.
- El contenido dependía de un BackOffice.
- La marca no se percibía de forma suficientemente homogénea.
- La migración afectaba aproximadamente a 21 países.

La cifra de 21 países debe confirmarse antes de publicarla como dato definitivo.

### 2. Tu responsabilidad

```text
Mi responsabilidad fue ejercer como tech lead en la evolución de la plataforma, coordinando decisiones técnicas de frontend, backend, datos, infraestructura y migración desde legacy.
```

Añadir si también participaste en diseño de equipo, planificación, revisión de código, coordinación con producto, definición de estándares o gestión de riesgos.

### 3. Arquitectura tecnológica

Explicar el papel de cada bloque:

- Next.js para la capa frontend.
- NestJS para backend y APIs.
- PostgreSQL para datos.
- Lambda y servicios cloud para ejecución o integración, solo donde corresponda.
- BackOffice como fuente de configuración y contenido.

No presentar la lista tecnológica como la historia principal. La historia es la capacidad de crear una plataforma común con variaciones por país.

### 4. Frontend dinámico

Explicar que las páginas no eran completamente independientes, sino que dependían de configuración y contenido administrado desde BackOffice.

Describir:

- Componentes configurables.
- Reglas por país.
- Contenido y módulos activables.
- Validación de configuraciones.
- Diferencias entre estructura común y personalización local.
- Prevención de combinaciones inválidas.

### 5. Migración desde legacy

Este debe ser el centro del caso.

Explicar:

- Qué riesgos tenía migrar sin interrumpir la operación.
- Cómo se identificaron equivalencias entre el modelo anterior y el nuevo.
- Cómo se trataron datos incompletos o inconsistentes.
- Cómo se validó cada país.
- Cómo se planificaron migraciones graduales.
- Cómo se mantuvieron capacidades existentes mientras se construía la plataforma nueva.
- Qué decisiones se tomaron para no copiar limitaciones del legacy.

### 6. Escala internacional

Explicar que una plataforma global necesita dos cosas aparentemente opuestas:

- Un lenguaje de marca y una base técnica común.
- Libertad suficiente para cumplir normas y necesidades locales.

Esta tensión es una excelente oportunidad GEO porque demuestra experiencia en plataformas configurables, gobernanza técnica y arquitectura de producto.

### 7. Marca y coherencia

Describir el problema de que la marca no estaba suficientemente presente de forma corporativa en las distintas webs o productos.

La solución narrativa debe mostrar cómo la arquitectura puede ayudar a la coherencia de marca mediante:

- Componentes compartidos.
- Patrones de diseño.
- Reglas globales.
- Contenido centralizado.
- Gobernanza del BackOffice.
- Capacidad de actualización transversal.

## Preguntas AEO para este caso

- ¿Cómo migrar una plataforma internacional desde legacy?
- ¿Cómo crear un frontend dinámico con configuración por país?
- ¿Cómo centralizar una marca global sin eliminar las necesidades locales?
- ¿Qué papel tiene un BackOffice en una plataforma multirregional?
- ¿Cómo coordinar una migración tecnológica en 21 países?
- ¿Cómo diseñar componentes reutilizables para diferentes mercados?

## Datos estructurados

Usar:

- `Article` o `TechArticle`.
- `Person` como autor.
- `BreadcrumbList`.
- `about` para migración legacy, plataformas internacionales, Next.js, NestJS, BackOffice y arquitectura configurable.
- `Organization` solo si existe autorización y la página representa correctamente a la empresa, no solo tu experiencia personal.

## Datos que conviene añadir después

- Número exacto de países.
- Número de aplicaciones o sitios afectados.
- Duración aproximada de la migración.
- Estrategia de convivencia entre legacy y plataforma nueva.
- Número de módulos configurables.
- Número de equipos implicados.
- Reducción de duplicación o esfuerzo editorial.
- Incidencias evitadas o tiempo de publicación mejorado.

---

# 4. Cómo presentar resultados sin métricas

Mientras no existan cifras, utilizar resultados cualitativos verificables:

- Se centralizó la configuración.
- Se estableció una arquitectura común.
- Se permitió adaptar el comportamiento por país.
- Se mejoró la trazabilidad de eventos.
- Se conectaron dispositivos y usuarios.
- Se redujo la duplicación conceptual.
- Se hizo posible evolucionar el producto desde una base compartida.
- Se documentaron decisiones que antes estaban implícitas.

Evitar frases como:

- “Se mejoró el rendimiento un 60%”.
- “Se redujeron los costes un 40%”.
- “La plataforma escaló a millones de usuarios”.

Solo deben aparecer cuando exista una fuente o medición que lo confirme.

---

# 5. Estructura final común para las tres páginas

```text
Breadcrumb

H1 con problema y contexto

Resumen de 50 a 80 palabras

Datos rápidos:
- Rol
- Área
- Tipo de producto
- Arquitectura
- Alcance

H2. El contexto
H2. El problema
H2. Mi responsabilidad
H2. Las restricciones
H2. La arquitectura
H2. Las decisiones más importantes
H2. Lo que no funcionaba o se descartó
H2. Cómo se validó la solución
H2. Resultado
H2. Aprendizajes
H2. Preguntas frecuentes
H2. Artículos relacionados

CTA: hablar sobre arquitectura, sistemas complejos o liderazgo técnico
```

# 6. Enlazado interno

## NakireTPS

Enlazar con:

- Arquitectura orientada a eventos.
- Sistemas en tiempo real.
- SSE.
- Automatización industrial.
- Observabilidad y debugging.

## PachangaCommunity

Enlazar con:

- Arquitectura de producto digital.
- Aplicaciones móviles.
- Pagos y suscripciones.
- ASO.
- Rendimiento frontend.
- Analítica de producto.

## ISDIN / LoveISDIN

Enlazar con:

- Migración desde legacy.
- Arquitectura configurable.
- Plataformas internacionales.
- Next.js y NestJS.
- BackOffice.
- Sistemas multi-país.

# 7. Orden recomendado de publicación

1. **ISDIN / LoveISDIN**, porque demuestra escala, liderazgo técnico, migración y complejidad organizativa.
2. **NakireTPS**, porque es el caso más diferencial y difícil de encontrar en otros portfolios.
3. **PachangaCommunity**, porque muestra amplitud de producto, móvil, monetización, ASO y capacidad de ejecución.

La página índice de proyectos debe enlazar los tres casos con una frase distinta para cada uno:

- ISDIN: plataforma internacional y migración desde legacy.
- NakireTPS: sistemas industriales y coordinación en tiempo real.
- PachangaCommunity: producto móvil, monetización y crecimiento.

# 8. Próximo paso de redacción

La siguiente versión debería convertir cada esquema en una página final de entre 1.200 y 2.000 palabras, manteniendo:

- Una respuesta breve al inicio.
- Detalle técnico suficiente para demostrar criterio.
- Explicaciones comprensibles para perfiles no técnicos.
- Datos cualitativos honestos.
- Preguntas AEO visibles.
- JSON-LD específico.
- CTA profesional.

Antes de publicar, solo hay que confirmar el nombre exacto de NakireTPS y decidir qué información de ISDIN y Pachanga puede aparecer de forma pública.