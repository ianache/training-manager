---
type: User Story
title: "US-026 — Explorar el catálogo de cursos"
description: "El Colaborador (propuesta D1, sin validar) visualiza los cursos disponibles con los datos de diseño que la plataforma conoce, sin que la plataforma hospede contenido de cursos."
tags: [user-story, h2, cursos, exploracion, classroom, propuesta-sin-validar]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-10-03T14:00:00-05:00"
sources:
  - id: rcp-004
    resource: /knowledge-base/requirement/context-packs/RCP-004-catalogo-de-cursos-con-filtros.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
---

# US-026 — Explorar el catálogo de cursos

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-026 |
| Épica / capacidad | Visualización de cursos (RCP-004, pregunta de trabajo, RCP-004:L31); no figura en USC-001. Sigue el precedente de US-015 a US-025 |
| Horizonte / release | Por definir. H2 es hipótesis (RCP-004 H-01; RCP4-Q14): ninguna fuente lo asigna |
| Actor | [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md), como **propuesta sin validar** (D1; BR-FOR-11; EVD-2026-0136) |
| Responsable de negocio (PO) | Jefe de Ingeniería (Responsable del término [Curso](../../business/glossary/terms/TRM-0106-curso.md), TRM-0106) |
| Prioridad | Propuesta MoSCoW: Should. Es la base de US-027 y de la exploración de H2; ninguna fuente fija prioridad. La decide el PO |
| Estimación | |
| Dependencias | US-001 (catálogo de competencias, de donde salen competencias y Rol-Nivel); US-009 (ruta de formación, NOT READY): relación sin resolver (RCP4-Q4) |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Colaborador (propuesta D1), **quiero** ver los cursos de formación disponibles y los datos de cada uno que ayudan a decidir si me sirven, **para** conocer la oferta de formación sin buscarla a mano en Google Classroom.

## 3. Contexto y valor

- **Problema que resuelve:** los cursos se dictan en Google Classroom y su material está en Google Drive (VIS-001:L32); hoy el colaborador los busca a mano allí (RCP-004:L38, reformulación del agente, sin validar).
- **Valor esperado:** que el Colaborador vea qué cursos existen y qué desarrolla cada uno (competencias, nivel, Rol-Nivel).
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Ver la lista de [cursos](../../business/glossary/terms/TRM-0106-curso.md) y, de cada uno, los datos que la plataforma conoce por su diseño: competencias y nivel L1-L4, Rol-Nivel mínimo y objetivo (BR-FOR-01, BR-FOR-02).
  - Estados de la interfaz de la lista (sección 10).
- **Excluye:**
  - Acotar la lista con filtros: US-027.
  - Hospedar el contenido del curso o modificar cursos y calificaciones en Classroom: restricción de alcance, no un criterio (BR-INT-01, BR-INT-02; VIS-001:L93-L94, L100, L108).
  - Inscribirse desde la exploración: sin regla (P-57).
  - La ruta de formación generada de la brecha: US-009.
  - Definir qué datos se leen de Classroom: P-56.

## 5. Criterios de aceptación

El criterio se sostiene en reglas vigentes de diseño del curso; que sea el Colaborador quien los vea es la propuesta D1, sin validar.

### AC-1 — Ver los datos de diseño de un curso

```gherkin
Escenario: Ver qué desarrolla un curso
  Dado un curso diseñado con competencias en un nivel L1-L4 y un nivel de rol mínimo y uno objetivo para cada rol al que se dirige
  Cuando el Colaborador explora los cursos
  Entonces ve de ese curso las competencias con su nivel y, para cada rol, el nivel de rol mínimo y el objetivo
```

- **Regla / fuente:** BR-FOR-01 y BR-FOR-02 (BRC-001:L270-L271); R-34 y R-35 (IMD-001:L232-L233); D1 (BR-FOR-11, BRC-001:L280)

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| El Colaborador ve versiones DRAFT o DEPRECATED | Sin regla: qué versiones ve cada actor. Lo único sostenido es que solo las APPROVED admiten inscripciones nuevas (BR-FOR-08); que la lista oculte las demás no está respaldado | P-55 (BR-FOR-13) |
| Una edición en curso de una versión DEPRECATED | Sin regla sobre si se ve. Se supone que el inscrito termina en su edición (BR-FOR-10, H-06 de RCP-004) | P-55; P-51 |
| Visibilidad por actor o restricción por rol, nivel o producto | Sin regla (BR-PTY-20 y BR-TRA-03 a BR-TRA-06 no mencionan cursos) | P-55 |
| Curso de Classroom sin diseño en la plataforma (sin nivel ni competencias) | Sin regla: si aparece | P-56 (BR-FOR-14) |
| Qué datos del curso salen de Classroom y cuáles guarda la plataforma | Sin regla | P-56 |
| Desde la lista se quiere inscribir | Sin regla: si la inscripción desde la exploración está en alcance y quién inscribe | P-57 (BR-FOR-15) |
| Ordenamiento de la lista y lista vacía | Sin regla | P-58 (BR-FOR-16) |
| Un curso con varias versiones, ¿una entrada o una por versión? | Sin regla | US-026-Q1 |
| Mostrar duración, modalidad, idioma o producto | Sin respaldo: no son requisitos (D2) | P-59 (BR-FOR-17) |
| Persona no autenticada | Sin regla; se asume acceso autenticado (H-07 de RCP-004) | RCP-004 H-07 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-FOR-01 | Los cursos desarrollan competencias en un nivel L1-L4 para roles y niveles de rol; por rol, un nivel mínimo y uno objetivo | BRC-001:L270 |
| BR-FOR-02 | Quien diseña el curso selecciona qué competencias desarrolla | BRC-001:L271 |
| BR-FOR-06 | Un curso tiene versiones DRAFT, APPROVED y DEPRECATED | BRC-001:L275 |
| BR-FOR-08 | Solo las versiones APPROVED admiten inscripciones nuevas | BRC-001:L277 |
| BR-FOR-10 | El inscrito termina el curso en su edición | BRC-001:L279 |
| BR-INT-01, BR-INT-02 | Classroom en solo lectura; integrar, no hospedar | BRC-001:L293; VIS-001:L100, L108 |
| BR-FOR-11 | Propuesta sin validar (D1): el actor que explora el catálogo de cursos es el Colaborador | BRC-001:L280 |
| BR-FOR-13 a BR-FOR-17 | Vacíos (sección 6); no son criterios | BRC-001:L282-L286 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Curso | Lo que se explora; vive en Classroom (BR-INT-01) | [TRM-0106](../../business/glossary/terms/TRM-0106-curso.md) |
| Versión de curso | Estados DRAFT, APPROVED, DEPRECATED | [TRM-0104](../../business/glossary/terms/TRM-0104-version-de-curso.md) |
| Edición de curso | Ejecución en la que se inscribe un colaborador | [TRM-0102](../../business/glossary/terms/TRM-0102-edicion-de-curso.md) |
| Instructor | Colaborador asignado a una edición; si se muestra, RCP4-Q11 | [TRM-0105](../../business/glossary/terms/TRM-0105-instructor-edicion-de-curso.md) |
| Curso final | Curso cuya aprobación se certifica; no es parte de esta historia | [TRM-0017](../../business/glossary/terms/TRM-0017-curso-final.md) |
| Colaborador | Actor propuesto (D1) | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) |
| Competencia | Lo que el curso desarrolla, con nivel L1-L4 | [TRM-0014](../../business/glossary/terms/TRM-0014-competencia.md) |
| Google Classroom, Google Drive | Donde viven el curso y su material, en solo lectura | [TRM-0029](../../business/glossary/terms/TRM-0029-google-classroom.md), [TRM-0030](../../business/glossary/terms/TRM-0030-google-drive.md) |
| "Catálogo de cursos" | Nombre del pedido; **no es término del glosario** y no se define aquí; en el glosario "catálogo" es el catálogo de competencias (TRM-0007). Pregunta GQ-38 (RCP4-Q1) | Sin entrada |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio); la lista y sus estados deben ser navegables con teclado y lector de pantalla.
- **Privacidad y datos personales:** la historia no requiere datos personales de colaboradores. La única excepción posible es el Instructor, que es un colaborador (R-43): si se muestra, BR-PTY-20 permite a cualquier colaborador ver el nombre de otra persona, pero no otros datos; que se muestre en la lista es la pregunta RCP4-Q11 y no se asume. Los inscritos de un curso no se muestran (ninguna fuente lo pide).
- **Otros:** restricción de integración: Classroom en solo lectura y sin hospedar contenido de cursos (BR-INT-01, BR-INT-02; VIS-001:L93-L94, L108).

## 10. Consideraciones de UX

- **Flujo esperado:** el Colaborador entra a la exploración, ve la lista de cursos y revisa los datos de cada uno.
- **Estados de la interfaz:** lista con cursos; carga; sin cursos (contenido sin regla, P-58); error al leer Classroom (la contingencia puede cambiar el alcance, BR-INT-02; sin regla del mensaje); sin permiso (sin regla, P-55).
- **Contenido clave:** nombre del curso, competencias con nivel L1-L4, Rol-Nivel mínimo y objetivo, estado de la versión (si se muestra, P-55). Nombre y descripción del curso son hipótesis H-04 de RCP-004 (P-56).

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-001 (catálogo de competencias: competencias y Rol-Nivel, USC-001:L64); datos de Classroom y Drive en solo lectura (VIS-001:L93-L94).
- **Es prerrequisito de:** US-027.
- **Supuestos:** S-1: el Colaborador accede autenticado; origen RCP-004 H-07; lo confirmaría el Responsable de producto.
- **Hipótesis del agente:** H-1: el actor es el Colaborador (D1, EVD-2026-0136; BR-FOR-11 sin validar); lo confirmaría P-60. H-2: la capacidad es de H2 (RCP-004 H-01); lo confirmaría RCP4-Q14. H-3: la lista muestra cursos y no versiones (hipótesis de US-026-Q1).

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| P-60 | ¿Se validan D1 (Colaborador explora) y D2 (filtros) como reglas vigentes? | Jefe de Ingeniería / Responsable de producto | Alta | Sí | Abierta |
| P-55 | ¿Qué cursos y versiones (APPROVED, DRAFT, DEPRECATED) ve cada actor? | Jefe de Ingeniería | Alta | Sí | Abierta |
| P-56 | ¿Qué metadatos se leen de Classroom y cuáles conserva la plataforma? ¿Aparece un curso sin diseño? | Gestión de formación + ARQ | Alta | Sí | Abierta |
| P-57 | ¿Explorar implica poder inscribirse y quién inscribe? | Jefe de Ingeniería | Alta | Sí | Abierta |
| P-58 | ¿Criterio de orden, búsqueda por texto y qué se ve con lista vacía? | Responsable de producto + UX | Media | No | Abierta |
| GQ-38 | ¿Cómo se llama y qué es el "catálogo de cursos"? (RCP4-Q1; vista o concepto, IM-Q13) | Responsable de producto | Alta | No | Abierta |
| IM-Q13 | ¿El catálogo de cursos es solo una vista o un concepto con reglas propias? | Responsable de producto | Media | No | Abierta |
| RCP4-Q4 | ¿Cómo se relaciona la exploración con US-009 (ruta de formación)? | Responsable de producto | Alta | No | Abierta |
| RCP4-Q11 | ¿Qué atributos tiene una edición y se muestra el Instructor, dado BR-PTY-20? | Jefe de Ingeniería + Gestión de formación | Media | No | Abierta |
| RCP4-Q14 | ¿Se confirma H2 como horizonte? | Responsable de producto | Media | No | Abierta |
| P-46 | ¿Quién diseña los cursos y cómo se relaciona el nivel de rol mínimo con L1-L4? | Jefe de Ingeniería | Alta | No | Abierta |
| P-51 | ¿Cómo se relaciona la versión con el curso de Classroom y qué pasa con la edición de una versión DEPRECATED? | Jefe de Ingeniería + Gestión de formación | Media | No | Abierta |
| US-026-Q1 | ¿La lista muestra una entrada por curso o una por versión de curso? | Jefe de Ingeniería | Media | No | Nueva |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0136 | D1: el actor que explora el catálogo de cursos es el Colaborador; pendiente de validación | BRC-001:L158 (RCP-004 §10) | hypothesis | medium |
| EVD-2026-0137 | D2: filtros solo los respaldados por reglas; pendiente de validación | BRC-001:L159 | hypothesis | medium |
| EVD-2026-0138 | Sin fuente: visibilidad, metadatos de Classroom, inscripción, orden, búsqueda, resultado vacío; tampoco existe el término "catálogo de cursos" | BRC-001:L160 | gap | high |
| EVD-2026-0074 | Los cursos desarrollan competencias en un nivel L1-L4 para roles y niveles de rol | BR-FOR-01, BRC-001:L270 | decision | high |
| EVD-2026-0116 | Versiones DRAFT/APPROVED/DEPRECATED; solo APPROVED admite inscripciones nuevas | BR-FOR-06 a BR-FOR-10, BRC-001:L275-L279 | decision | high |

Evidencia compartida: `source_type: knowledge-base`, `observed_at: 2026-10-03T14:00:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`. EVD-2026-0136 y 0134 son propuestas de la sesión de `ianache` sin validación del Responsable de dominio.

- **Upstream:** [RCP-004](../context-packs/RCP-004-catalogo-de-cursos-con-filtros.md), [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md), [IMD-001](../../business/information-model/IMD-001-modelo-de-informacion-conceptual.md) (R-34, R-35, R-37, R-38; vista, IM-Q13), [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | Necesita US-001 (datos de competencias y Rol-Nivel); US-027 depende de esta; relación con US-009 sin resolver |
| Negociable | Sí | Qué datos se muestran y el orden quedan abiertos (P-56, P-58) |
| Valiosa | Parcial | El valor es una reformulación del agente sin validar (RCP-004:L38) |
| Estimable | Parcial | P-56 deja sin definir los datos y la fuente |
| Pequeña (Small) | Sí | Una sola conducta (ver la lista) con un criterio; cabe en una iteración. Los filtros están en US-027 |
| Testeable | Parcial | Solo AC-1 es verificable; el resto es "Sin regla" |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente (como propuesta D1; BR-FOR-11 sin validar)
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [ ] No hay preguntas abiertas que bloqueen (P-55, P-56, P-57 y P-60 bloquean)
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario ("catálogo de cursos": GQ-38)
- [ ] El PO validó la historia

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión
- [ ] La plataforma no aloja ni modifica contenido de cursos ni calificaciones de Classroom (restricción BR-INT-01)

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** el actor es una propuesta (D1) y el valor una reformulación; pero lo que ve el Colaborador del diseño del curso está sostenido por BR-FOR-01 y BR-FOR-02 (AC-1); la restricción de Classroom (BR-INT-01) es de alcance (sección 4). No puede ser READY: P-55, P-56, P-57 y P-60 (prioridad alta) bloquean parte del comportamiento y la validación del PO falta. Si P-60 rechaza D1, pasa a NOT READY.
- **Partición:** se evaluó una sola historia (ver y filtrar) y se separó en US-026 (ver) y US-027 (filtrar): los filtros tienen su propio respaldo (D2) y su propia pregunta de combinación. No hay otra división; no se propone fusionar ni dividir más.
- **Bloqueos de entrega:** US-001; US-009 sin resolver (RCP4-Q4).
- **Propuesta de división (si no es pequeña):** No aplica; ver US-027 para los filtros.
- **Siguiente rol o Skill:** `af-business-glossary-curator` (nombre del catálogo de cursos, GQ-38) y `af-business-rule-extractor` (BR-FOR-13 a BR-FOR-17) cuando se respondan las preguntas; luego `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería y el Responsable de producto responden P-60, P-55, P-56 y P-57 y validan la historia.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
