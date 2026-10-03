---
type: Requirement Context Pack
title: "RCP-004 — Catálogo de cursos con filtros"
description: "Contexto funcional mínimo y trazable de la visualización de cursos y su búsqueda mediante filtros para el Colaborador (H2, por hipótesis): qué respaldan las reglas existentes, qué filtros no tienen respaldo y qué sigue abierto."
tags: [context-pack, requirements, cursos, catalogo-de-cursos, filtros, h2, classroom]
status: draft
generated:
  by: "af-requirement-context-builder/1.0"
  at: "2026-10-03T12:00:00-05:00"
sources:
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
---

# RCP-004 — Catálogo de cursos con filtros

## 1. Metadata y pregunta de trabajo

- **Producto o proceso:** [Plataforma de Gestión de Formación del Recurso Humano](../../business/glossary/terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md), formación integrada.
- **Horizonte:** H2 — Formación integrada (VIS-001:L133). Es una **hipótesis** (H-01): ninguna fuente dice que esta capacidad pertenezca a H2; se infiere de que los cursos, sus versiones y las rutas son H2 (IMD-001:L171-L176; TRM-0057).
- **Fecha:** 2026-10-03.
- **Sesión:** `ianache` (decisiones D1 y D2 de §10, sin validación del Responsable de dominio).
- **Pregunta de trabajo:** "Visualización de los cursos en el catálogo, con facilidades para ubicar cursos mediante filtros diversos." ¿Qué sabe ya la Knowledge Base para que el siguiente rol pueda plantear esta capacidad sin volver a descubrirlo: qué es un curso, qué datos tiene, qué filtros respaldan las reglas, qué estados de versión se pueden ver y qué sigue abierto?
- **Estado:** Borrador.

## 2. Objetivo y alcance

### Objetivo de negocio (resultado observable)

Que un Colaborador pueda ver los cursos de formación disponibles y ubicar los que le interesan acotando por criterios que la plataforma ya conoce (competencia y nivel, Rol-Nivel, estado de la versión, Instructor y edición), sin tener que buscarlos a mano en Google Classroom. *Reformulación del agente a partir del texto del usuario; el objetivo formal está pendiente de validación.*

### Incluido (según D1 y D2)

- Exploración de cursos por el [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md) (D1).
- Filtros respaldados por reglas: competencia y nivel L1–L4; Rol-Nivel mínimo y objetivo; estado de la versión; Instructor y edición (D2; §5).

### Excluido o no decidido

- **Excluido por VIS-001:** hospedar contenido de cursos (VIS-001:L108); la plataforma no reconstruye un LMS (VIS-001:L100); Classroom es de solo lectura (BR-INT-01, BRC-001:L279).
- **No respaldados, tratados como vacío y no como requisito (D2):** duración, modalidad, idioma y producto (RCP4-Q6).
- **Fuera de este pack:** redactar User Stories, solución técnica, pantallas.
- **Sin decidir:** si explorar implica inscribirse (RCP4-Q5) y la relación con US-009 (RCP4-Q4).

### Restricciones conocidas

- Solo las versiones APPROVED admiten inscripciones nuevas (BR-FOR-08, BRC-001:L270).
- La integración con Classroom es de solo lectura; el material de Drive se enlaza y lee (VIS-001:L93-L94).

## 3. Resumen ejecutivo del contexto

La Knowledge Base ya describe el curso como objeto de formación con estructura suficiente para filtrarlo. Un curso se diseña para desarrollar competencias en un nivel L1–L4, dirigido a ciertos roles y niveles de rol, con un nivel de rol mínimo y uno objetivo por rol (BR-FOR-01, BRC-001:L263); quien lo diseña elige qué competencias desarrolla (BR-FOR-02). Tiene versiones DRAFT, APPROVED y DEPRECATED (BR-FOR-06 a BR-FOR-09), ediciones en las que se inscriben colaboradores (BR-FOR-10) y un Instructor asignado por edición (BR-FOR-05). Cada una de esas dimensiones es un filtro con respaldo (D2).

En cambio, **ninguna fuente define el "catálogo de cursos"**: en el glosario, "catálogo" es el catálogo de competencias (TRM-0007), y la búsqueda de "catálogo de cursos" en la Knowledge Base no devuelve ningún resultado. Tampoco hay regla sobre qué cursos ve un Colaborador, qué datos del curso salen de Classroom y cuáles guarda la plataforma, cómo se ordena o se busca por texto, qué se muestra sin resultados, ni si desde la exploración se puede inscribir. La relación con US-009 (ruta de formación, NOT READY) y con la inscripción (BR-FOR-08) queda sin resolver; US-009 ya registra como abiertos P-18, P-46 y P-51.

Las reglas de visibilidad existentes cubren datos de personas (BR-PTY-20), niveles certificados, brechas, evidencias y certificaciones (BR-TRA-03 a BR-TRA-06); ninguna habla de cursos.

## 4. Registro de evidencia

### Inventario de fuentes

| ID | Fuente | Tipo | Fecha o versión | Permiso / alcance |
|---|---|---|---|---|
| S-01 | [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) (BR-FOR-01 a 10, BR-INT-01/02, BR-CAT-22, BR-ACR-14, BR-PTY-20, BR-TRA-03 a 06; P-02, P-45, P-46, P-49, P-50, P-51) | Knowledge Base (reglas, `draft`) | 2026-09-27 | Interno |
| S-02 | [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) | Knowledge Base (visión, `draft`) | 2026-09-26 | Interno |
| S-03 | [IMD-001](../../business/information-model/IMD-001-modelo-de-informacion-conceptual.md) §3 y tabla de conceptos | Knowledge Base (modelo conceptual) | 2026-09-27 | Interno |
| S-04 | [Glosario](../../business/glossary/terms/): TRM-0007, 0017, 0029, 0057, 0102, 0103, 0104, 0105 | Knowledge Base (glosario) | 2026-09-27 | Interno |
| S-05 | [USC-001](../USC-001-user-stories-plataforma-gestion-formacion.md) (US-009, US-010) | Knowledge Base (historias) | 2026-09-27 | Interno |
| S-06 | Decisiones de sesión D1 y D2 | Decisión humana (usuario de sesión `ianache`) | 2026-10-03 | Sin validación del Responsable de dominio |

No se consultaron GDrive, GitLab ni la API de Classroom; no se examinó el contenido real de ningún curso. Todos los locators de §4 y §5 se comprobaron abriendo el archivo el 2026-10-03.

### Hallazgos

| ID | Hallazgo | Fuente y fragmento | Tipo | Confianza |
|---|---|---|---|---|
| E-01 | Los cursos se dictan en Google Classroom y su material está en Google Drive. | S-02 VIS-001:L32 | Hecho | Alta |
| E-02 | Classroom: cursos, tareas y calificaciones, solo lectura. Drive: material, enlace y lectura. La plataforma no hospeda material de cursos. | S-02 VIS-001:L93-L94; S-01 BR-INT-01 BRC-001:L279 | Hecho | Alta |
| E-03 | "Integrar, no hospedar"; hospedar contenido de cursos está fuera de alcance, salvo contingencia. | S-02 VIS-001:L100, L108; BR-INT-02 BRC-001:L280 | Hecho | Alta |
| E-04 | H2 — Formación integrada: rutas de formación con Classroom y Drive; certificados de curso. | S-02 VIS-001:L133 | Hecho | Alta |
| E-05 | Un curso se diseña para desarrollar competencias en un nivel L1–L4, para roles y niveles de rol; por cada rol define un nivel de rol mínimo y uno objetivo. | S-01 BR-FOR-01 BRC-001:L263 | Hecho (decisión) | Alta |
| E-06 | Un curso no desarrolla necesariamente todas las competencias del Rol-Nivel objetivo; quien lo diseña elige cuáles. | S-01 BR-FOR-02 BRC-001:L264 | Hecho (decisión) | Alta |
| E-07 | Los objetivos del curso se alinean con las competencias y los niveles de los roles designados. | S-01 BR-FOR-03 BRC-001:L265 | Hecho (decisión) | Alta |
| E-08 | Un curso tiene versiones; cada una pasa por DRAFT, APPROVED y DEPRECATED. | S-01 BR-FOR-06 BRC-001:L268 | Hecho (decisión) | Alta |
| E-09 | Solo el Jefe de Ingeniería o un usuario ADMIN aprueba una versión (DRAFT a APPROVED). | S-01 BR-FOR-07 BRC-001:L269 | Hecho (decisión) | Alta |
| E-10 | Solo las versiones APPROVED admiten inscripciones nuevas. | S-01 BR-FOR-08 BRC-001:L270 | Hecho (decisión) | Alta |
| E-11 | Al pasar una versión a APPROVED, la APPROVED anterior pasa a DEPRECATED. | S-01 BR-FOR-09 BRC-001:L271 | Hecho (decisión) | Alta |
| E-12 | El colaborador inscrito en una edición termina el curso en esa edición; no se homologan versiones. | S-01 BR-FOR-10 BRC-001:L272 | Hecho (decisión) | Alta |
| E-13 | El Jefe de Ingeniería o un ADMIN asigna a un colaborador como Instructor para ejecutar una edición; el Instructor evalúa a los inscritos. | S-01 BR-FOR-05 BRC-001:L267 | Hecho (decisión) | Alta |
| E-14 | El modelo conceptual relaciona CURSO con COMPETENCIA (nivel L1–L4), con NIVEL_DE_ROL (mínimo y objetivo), con VERSION_DE_CURSO, y esta con EDICION_DE_CURSO, INSCRIPCION e INSTRUCTOR. Varias cardinalidades son inferidas. | S-03 IMD-001:L119-L128 | Hecho (con cardinalidades `inf.`) | Media |
| E-15 | El CURSO vive en Classroom, el MATERIAL en Drive; la plataforma los referencia y no los hospeda. | S-03 IMD-001:L141, L170 | Hecho | Alta |
| E-16 | "Catálogo de competencias" (TRM-0007) es el registro de roles, niveles de rol, competencias y evidencias; "catálogo" no designa cursos. No existe el término "catálogo de cursos" en la Knowledge Base. | S-04 TRM-0007; búsqueda en `knowledge-base/` el 2026-10-03 | Hecho (la ausencia se verificó por búsqueda de texto) | Alta |
| E-17 | Las competencias se versionan; los roles no. Qué pasa con requerimientos y certificaciones al aprobar una versión nueva de competencia sigue abierto. | S-01 BR-CAT-22 BRC-001:L193; P-50.1 BRC-001:L411 | Hecho / vacío | Alta |
| E-18 | Aprobar un curso aporta evidencia; la plataforma propone certificar el nivel objetivo de cada competencia que el curso desarrolla. | S-01 BR-ACR-14 BRC-001:L240 | Hecho (decisión) | Alta |
| E-19 | La relación entre una versión de curso y el curso de Classroom (uno por versión, por edición o único) está abierta. | S-01 P-51 BRC-001:L388 | Vacío conocido | Alta |
| E-20 | Cualquier colaborador ve de las demás personas solo nombre, correo laboral, unidad, rol y perfiles profesionales. | S-01 BR-PTY-20 BRC-001:L323 | Hecho (decisión) | Alta |
| E-21 | Niveles certificados (resumen), evidencias y certificaciones son visibles para cualquier colaborador; las brechas individuales, para el Jefe de proyecto. Ninguna regla de visibilidad menciona cursos. | S-01 BR-TRA-03 a BR-TRA-06 BRC-001:L288-L291 | Hecho (alcance verificado: ninguna de ellas trata de cursos) | Alta |
| E-22 | US-009 (Colaborador recibe una ruta de formación, con enlaces a Classroom y Drive) está NOT READY; sus vacíos son P-18, P-46 y P-51. US-010 (certificado de curso) está CONDITIONAL. | S-05 USC-001:L48-L49, L199-L212 | Hecho | Alta |
| E-23 | La inferencia de US-009 es que una ruta solo debería llevar a inscribirse en versiones APPROVED. | S-05 USC-001:L206 | Hipótesis (de USC-001) | Media |
| E-24 | Quién diseña los cursos y cómo se relaciona el nivel de rol mínimo con L1–L4 sigue abierto. | S-01 P-46 BRC-001:L383 | Vacío conocido | Alta |
| E-25 | Qué es un usuario ADMIN (rol de Keycloak, rol de la parte o permiso) sigue abierto. | S-01 P-45 BRC-001:L382 | Vacío conocido | Media |
| E-26 | El Colaborador explora el catálogo de cursos. | S-06 D1 | Decisión humana (pendiente de validación) | Media |
| E-27 | Se proponen solo filtros respaldados por reglas existentes: competencia y nivel, Rol-Nivel mínimo y objetivo, estado de versión, Instructor y edición. | S-06 D2 | Decisión humana (pendiente de validación) | Media |

*Nota de locators:* la mayoría de las reglas pasaron de propuesta a decisión el 2026-09-27 (EVD-2026-0116, 0131); los números de línea pueden moverse si BRC-001 se edita.

## 5. Hechos confirmados

Respaldados por fuente (§4). "Confirmado" significa que lo dice una fuente; ninguna fuente está verificada por el Responsable de dominio en lo relativo a esta capacidad.

**Qué respalda cada filtro propuesto (D2):**

| Filtro | Respaldo | Observación |
|---|---|---|
| Competencia | BR-FOR-02 (E-06); IMD-001:L119 | El curso desarrolla un subconjunto de competencias del Rol-Nivel objetivo |
| Nivel L1–L4 | BR-FOR-01 (E-05); IMD-001:L119 | Nivel en que el curso desarrolla cada competencia; relación con "nivel de rol mínimo" abierta (P-46) |
| Rol-Nivel mínimo / objetivo | BR-FOR-01 (E-05); IMD-001:L120 | Por cada rol al que se dirige el curso |
| Estado de la versión | BR-FOR-06 a BR-FOR-09 (E-08 a E-11) | Solo APPROVED admite inscripciones; qué estados ve cada actor está abierto (RCP4-Q3) |
| Instructor / edición | BR-FOR-05, BR-FOR-10 (E-12, E-13); IMD-001:L124, L127 | Qué atributos tiene una edición (fechas, cupos) no está definido (RCP4-Q11) |

**Otros hechos:**
- Los datos del curso viven en Classroom y el material en Drive, ambos solo lectura; no se hospeda contenido (E-01 a E-03, E-15).
- El término "catálogo de cursos" no existe en el glosario (E-16).
- No hay regla de visibilidad sobre cursos (E-21).
- US-009 es NOT READY y comparte los vacíos P-18, P-46 y P-51 (E-22, E-19, E-24).

## 6. Supuestos e hipótesis

| ID | Afirmación | Tipo | Origen | Qué la confirmaría |
|---|---|---|---|---|
| H-01 | La capacidad pertenece al horizonte H2. | Hipótesis (agente) | Texto de la tarea; E-04; IMD-001:L171-L176 | Responsable de producto |
| H-02 | "Catálogo de cursos" es el conjunto de cursos de formación que la plataforma muestra al Colaborador, y no el catálogo de competencias (TRM-0007). | Hipótesis (agente) | Texto del usuario; E-16 | Responsable de producto (RCP4-Q1) |
| H-03 | El Colaborador solo ve versiones APPROVED; ver DRAFT o DEPRECATED corresponde al Jefe de Ingeniería o a ADMIN. | Hipótesis (agente) | E-10; E-23 | Jefe de Ingeniería (RCP4-Q3) |
| H-04 | La ficha de un curso combina datos que la plataforma conoce (competencias, niveles, Rol-Nivel, versión, edición, Instructor) con datos leídos de Classroom (por ejemplo, nombre y descripción). | Hipótesis (agente) | E-02, E-05 a E-13; no hay evidencia de qué lee Classroom | Gestión de formación + ARQ (RCP4-Q2) |
| H-05 | El filtro por Rol-Nivel serviría al Colaborador para ubicar cursos de su Rol-Nivel actual o del siguiente. | Hipótesis (agente) | E-05; E-14 | Responsable de producto |
| H-06 | Una edición en curso de una versión que pasa a DEPRECATED sigue hasta terminar. | Supuesto (de P-51) | P-51 BRC-001:L388; E-12 | Jefe de Ingeniería + Gestión de formación |
| H-07 | El Colaborador accede a la plataforma autenticado, como en el resto de las historias; no se asume acceso anónimo. | Supuesto | Patrón de USC-001; ninguna fuente lo declara para cursos | Responsable de producto |

## 7. Vacíos y preguntas abiertas

| ID | Pregunta | Destinatario | Prioridad | Estado |
|---|---|---|---|---|
| RCP4-Q1 | En el glosario, "catálogo" es el catálogo de competencias (TRM-0007). ¿Qué es el "catálogo de cursos" y cómo se llama (¿Catálogo de cursos, Oferta formativa, Oferta de cursos?)? ¿Se alimenta de Classroom, de la plataforma, o de ambos? | Responsable de producto | Alta | Nueva |
| RCP4-Q2 | Con Classroom en solo lectura (BR-INT-01): ¿qué metadatos de un curso se pueden leer (nombre, descripción, estado, fechas, docentes, cantidad de inscritos...) y cuáles vive la plataforma (competencias, niveles, versión, edición, Instructor)? Un curso sin su diseño en la plataforma, ¿aparece? | Gestión de formación + ARQ | Alta | Nueva |
| RCP4-Q3 | ¿El catálogo muestra solo versiones APPROVED o también DRAFT y DEPRECATED, y según qué actor? ¿Un curso con edición en curso de una versión DEPRECATED se ve? ¿El estado es un filtro o una restricción de lo que se muestra? | Jefe de Ingeniería | Alta | Nueva |
| RCP4-Q4 | ¿Cómo se relaciona el catálogo con US-009 (ruta de formación generada de la brecha)? ¿Es una alternativa a la ruta, un complemento o lo reemplaza? ¿Los cursos de la ruta se ven desde el catálogo? | Responsable de producto | Alta | Nueva (depende de P-18) |
| RCP4-Q5 | ¿Explorar un curso implica poder inscribirse? ¿La inscripción desde el catálogo está en alcance, y quién inscribe (el propio colaborador, el Jefe de Ingeniería o Gestión de formación)? | Jefe de Ingeniería | Alta | Nueva (deriva de GQ-33 / TRM-0103) |
| RCP4-Q6 | Duración, modalidad, idioma y producto no tienen respaldo en reglas ni en el modelo. ¿Son atributos del curso que importan? ¿De dónde saldrían, de Classroom o de la plataforma? ¿"Producto" significa uno de los 4 productos? | Responsable de producto | Media | Nueva (D2: no son requisitos) |
| RCP4-Q7 | ¿Con qué criterios se ordena la lista (relevancia para el rol, nombre, fecha de edición, nivel)? ¿Hay un orden por defecto? | Responsable de producto + UX | Media | Nueva |
| RCP4-Q8 | ¿Se busca por texto? ¿Sobre qué campos (nombre, descripción, competencia) y con qué tolerancia? | Responsable de producto + UX | Media | Nueva |
| RCP4-Q9 | ¿Qué ve el Colaborador cuando ningún curso cumple los filtros? ¿Se le sugieren filtros alternativos o se le avisa de una brecha de oferta? | UX + Responsable de producto | Baja | Nueva |
| RCP4-Q10 | ¿Todo Colaborador ve todos los cursos? No hay regla de visibilidad sobre cursos (BR-TRA-03 a 06 y BR-PTY-20 no los mencionan). ¿Algún curso se restringe por rol, nivel o producto? | Jefe de Ingeniería | Alta | Nueva |
| RCP4-Q11 | ¿Qué atributos tiene una edición (fechas, cupos, estado, modalidad)? ¿Se muestra el Instructor en el catálogo, dado que BR-PTY-20 limita los datos de personas? ¿"Edición" como filtro es abierta, en curso o histórica? | Jefe de Ingeniería + Gestión de formación | Media | Nueva |
| RCP4-Q12 | El filtro por competencia, ¿usa la competencia en su versión vigente (BR-CAT-22)? Si cambia la versión de una competencia, ¿qué pasa con los cursos que la desarrollan? | Jefe de Ingeniería | Media | Nueva (depende de P-50.1) |
| RCP4-Q13 | ¿Aparecen cursos de Classroom que nadie diseñó en la plataforma (sin nivel, sin competencias)? ¿Cómo se filtran? | Gestión de formación | Media | Nueva |
| RCP4-Q14 | ¿Se confirma H2 como horizonte? | Responsable de producto | Media | Nueva |
| RCP4-Q15 | Heredadas, sin respuesta: cómo se relaciona el nivel de rol mínimo con L1–L4 (P-46); quién diseña los cursos (P-46); relación versión de curso–Classroom (P-51); qué es ADMIN (P-45). | Jefe de Ingeniería + ARQ | Alta | Abierta (P-45, P-46, P-51) |

## 8. Actores, procesos, datos y dependencias

### Actores

| Actor | Papel | Evidencia |
|---|---|---|
| [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md) | Explora el catálogo y filtra cursos | D1 (E-26) |
| [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) / usuario ADMIN | Aprueba versiones; asigna Instructores | BR-FOR-05, BR-FOR-07 |
| [Instructor](../../business/glossary/terms/TRM-0105-instructor-edicion-de-curso.md) | Ejecuta y evalúa una edición | BR-FOR-05 |
| Gestión de formación / RR. HH. | Emite certificados de curso; posible fuente de metadatos | BR-CER-05 (BRC-001); RCP4-Q2 |

### Procesos y estados

| Proceso | Actor | Resultado | Reglas |
|---|---|---|---|
| Explorar el catálogo y filtrar | Colaborador | Lista de cursos acotada | Sin regla de visibilidad (RCP4-Q10) |
| Versionar un curso (fuera de este pack) | Jefe de Ingeniería / ADMIN | DRAFT, APPROVED, DEPRECATED | BR-FOR-06 a BR-FOR-09 |
| Inscribirse (¿desde el catálogo?) | Por definir | Inscripción en una edición | BR-FOR-08, BR-FOR-10; RCP4-Q5 |
| Recibir ruta de formación (US-009) | Colaborador | Ruta con enlaces a Classroom y Drive | NOT READY; RCP4-Q4 |

Estados del curso: versión DRAFT, APPROVED, DEPRECATED (BR-FOR-06). La ausencia de estados de la edición no es un hecho: no hay regla que los defina.

### Datos relevantes (funcionales)

| Dato | Descripción | Fuente |
|---|---|---|
| Curso | Vive en Classroom; se diseña para competencias L1–L4 y Rol-Nivel | IMD-001:L119-L120, L170 |
| Versión de curso | DRAFT, APPROVED, DEPRECATED | BR-FOR-06 |
| Edición de curso | Ejecución de una versión; recibe inscripciones | BR-FOR-10; TRM-0102 |
| Competencia y nivel L1–L4 | Qué desarrolla el curso | BR-FOR-01, BR-FOR-02 |
| Nivel de rol mínimo y objetivo | Por rol destinatario | BR-FOR-01 |
| Instructor | Colaborador asignado a una edición | BR-FOR-05 |
| Metadatos de Classroom | Sin definir | RCP4-Q2 |

### Dependencias y consumidores

- **Consumidores posibles:** US-009 (ruta de formación) y US-010 (certificado de curso) usan el curso; ninguna dependencia se confirma sin RCP4-Q4.
- **Dependencias:** integración con Classroom y Drive (VIS-001:L93-L94); catálogo de competencias (US-001) para competencias y Rol-Nivel; datos de personas para el Instructor (BR-PTY-20).
- No se confirma ninguna dependencia técnica; el pack no propone solución.

## 9. Restricciones y riesgos funcionales

| Tipo | Descripción | Mitigación conocida | Fuente |
|---|---|---|---|
| Restricción | Classroom solo lectura; no se hospeda contenido | Ninguna; es una decisión | BR-INT-01 |
| Restricción | Solo APPROVED admite inscripciones nuevas | Ninguna | BR-FOR-08 |
| Ambigüedad | "Catálogo" ya significa catálogo de competencias | Nombre propio para los cursos (RCP4-Q1) | TRM-0007 |
| Riesgo | Mostrar filtros sin dato disponible (duración, modalidad, idioma, producto) crearía filtros vacíos o inventados | D2 los excluye | E-27 |
| Riesgo | Mostrar al Instructor choca con el límite de datos de personas | Pendiente de RCP4-Q11 | BR-PTY-20 |
| Riesgo | Si los metadatos de Classroom no alcanzan, el catálogo depende de que alguien diseñe cada curso en la plataforma | Ninguna conocida | RCP4-Q2, RCP4-Q13 |
| Riesgo | Si Classroom falla, la contingencia podría cambiar el alcance | Decisión humana posterior | BR-INT-02 |

## 10. Decisiones y validación humana

| Decisión o validación | Responsable | Evidencia | Fecha |
|---|---|---|---|
| **D1:** el actor que explora el catálogo de cursos es el Colaborador | Usuario de sesión `ianache` | Sesión 2026-10-03; sin validación del Responsable de dominio | 2026-10-03 |
| **D2:** los filtros propuestos son solo los respaldados por reglas existentes (competencia y nivel, Rol-Nivel mínimo y objetivo, estado de versión, Instructor y edición); duración, modalidad, idioma y producto no son requisitos | Usuario de sesión `ianache` | Sesión 2026-10-03; sin validación del Responsable de dominio | 2026-10-03 |
| **Validación de D1 y D2** | Pendiente: Responsable de dominio (Jefe de Ingeniería / Responsable de producto) | — | — |
| **Validación de este pack** | Pendiente: Responsable de dominio | — | — |

D1 y D2 son **Decisión humana pendiente de validación**: no cambian ninguna regla de la Knowledge Base ni cierran ningún vacío.

### Checklist de validación humana

- [ ] El objetivo describe un resultado de negocio y no una solución técnica.
- [ ] El alcance incluido y excluido está explícito.
- [ ] Las fuentes utilizadas son autorizadas y suficientes.
- [ ] Cada afirmación relevante tiene evidencia o está marcada como hipótesis.
- [ ] Hechos, supuestos, vacíos, hipótesis y decisiones humanas están separados.
- [ ] Los actores y procesos afectados están identificados.
- [ ] Los datos relevantes y sus dependencias están descritos.
- [ ] Las preguntas abiertas tienen destinatario y prioridad.
- [ ] Las contradicciones entre fuentes están visibles.
- [ ] El siguiente rol puede continuar sin repetir todo el descubrimiento.
- [ ] Los Knowledge Candidates tienen provenance y verificador.
- [ ] Una persona responsable aprobó el contenido o registró los pendientes.

- **Estado:** Aprobado / Aprobado con pendientes / No aprobado
- **Responsable:**
- **Fecha:**
- **Comentarios:**

## 11. Knowledge Candidates

| Candidato | Provenance | Verificador | Estado |
|---|---|---|---|
| Término nuevo "Catálogo de cursos" (nombre por decidir; no confundir con TRM-0007) | RCP4-Q1; E-16 | Responsable de producto (vía af-business-glossary-curator) | Pendiente |
| Término nuevo "Curso" (hoy solo existe como concepto en IMD-001:L170; no hay TRM propio) | IMD-001:L170; búsqueda de glosario 2026-10-03 | Responsable de producto (vía af-business-glossary-curator) | Pendiente |
| Regla faltante: qué cursos y versiones ve cada actor (visibilidad de cursos) | RCP4-Q3, RCP4-Q10; sin fuente | Jefe de Ingeniería | Pendiente |
| Regla faltante: qué metadatos del curso se leen de Classroom y cuáles guarda la plataforma | RCP4-Q2; sin fuente | Gestión de formación + ARQ | Pendiente |
| Regla faltante: si se puede inscribir desde el catálogo y quién inscribe | RCP4-Q5; sin fuente | Jefe de Ingeniería | Pendiente |
| Regla faltante: ordenamiento, búsqueda por texto y resultado vacío | RCP4-Q7 a RCP4-Q9; sin fuente | Responsable de producto + UX | Pendiente |
| Posible concepto de modelo: atributos de EDICION_DE_CURSO (fechas, cupos) y metadatos de CURSO | RCP4-Q2, RCP4-Q11; IMD-001:L124 | Responsable de producto (vía af-conceptual-model-designer) | Pendiente |

Ninguno es conocimiento canónico hasta que lo verifique la persona indicada.

## 12. Handoff para el siguiente rol

### Qué puede usar el siguiente rol

- `af-user-story-refiner`: **todavía no**. Solo se pueden redactar historias con criterios parciales sobre los 5 filtros respaldados (§5); RCP4-Q1 a RCP4-Q5 y RCP4-Q10 bloquean los criterios de aceptación completos. Preparación estimada: NOT READY.
- `af-business-glossary-curator`: términos "Catálogo de cursos" y "Curso" (§11), cuando se responda RCP4-Q1.
- `af-business-rule-extractor`: reglas faltantes de §11, cuando las preguntas estén respondidas.
- `ux-requirements-analyzer`: sin estados de edición ni de resultado vacío definidos aún (RCP4-Q9, RCP4-Q11).

### Qué debe validar antes de continuar

1. D1 y D2 (§10), por el Responsable de dominio.
2. RCP4-Q1 (qué es y cómo se llama el catálogo), RCP4-Q2 (metadatos de Classroom), RCP4-Q3 (estados visibles), RCP4-Q4 y RCP4-Q5 (US-009 e inscripción), RCP4-Q10 (visibilidad).
3. La validación humana de este pack (§10).

### Artefactos relacionados

- [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) · [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) · [IMD-001](../../business/information-model/IMD-001-modelo-de-informacion-conceptual.md) · [USC-001](../USC-001-user-stories-plataforma-gestion-formacion.md) · [RCP-001](RCP-001-h1-idioma-comun.md) · [RCP-002](RCP-002-gestion-de-colaboradores.md)
- Glosario: [TRM-0007](../../business/glossary/terms/TRM-0007-catalogo-de-competencias.md) · [TRM-0017](../../business/glossary/terms/TRM-0017-curso-final.md) · [TRM-0029](../../business/glossary/terms/TRM-0029-google-classroom.md) · [TRM-0057](../../business/glossary/terms/TRM-0057-ruta-de-formacion.md) · [TRM-0102](../../business/glossary/terms/TRM-0102-edicion-de-curso.md) · [TRM-0103](../../business/glossary/terms/TRM-0103-inscripcion.md) · [TRM-0104](../../business/glossary/terms/TRM-0104-version-de-curso.md) · [TRM-0105](../../business/glossary/terms/TRM-0105-instructor-edicion-de-curso.md)
