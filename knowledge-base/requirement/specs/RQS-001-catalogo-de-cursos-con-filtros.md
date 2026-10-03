---
type: Requirements Specification
title: "RQS-001 — Catálogo de cursos con filtros: especificación de requerimientos"
description: "Índice, evaluación de calidad, trazabilidad y preparación por rol de los requerimientos para que el Colaborador visualice cursos y los ubique con filtros (H2 por hipótesis). Estado global: CONDITIONAL, pendiente de validar D1 y D2."
tags: [requirements-specification, cursos, catalogo-de-cursos, filtros, h2]
status: draft
generated:
  by: "af-requirements-orchestrator/1.0"
  at: "2026-10-03T13:00:00-05:00"
sources:
  - id: rcp-004
    resource: /knowledge-base/requirement/context-packs/RCP-004-catalogo-de-cursos-con-filtros.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
  - id: us-026
    resource: /knowledge-base/requirement/user-stories/US-026-explorar-el-catalogo-de-cursos.md
  - id: us-027
    resource: /knowledge-base/requirement/user-stories/US-027-ubicar-cursos-con-filtros.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
---

# RQS-001 — Catálogo de cursos con filtros

> Esta especificación indexa y evalúa los artefactos de requerimientos; no los duplica. El contenido vive en cada artefacto enlazado.

## 1. Alcance y escenario

- **Producto / iniciativa:** Plataforma de Gestión de Formación del Recurso Humano, capacidad «visualizar cursos y ubicarlos con filtros».
- **Escenario orquestado:** B, cambio sobre producto existente (`references/scenarios.md`).
- **Objetivo de negocio:** que el Colaborador encuentre los cursos que le interesan sin recorrerlos todos. La fuente es solo el pedido de la sesión (2026-10-03); ningún documento de la base lo respalda, y el problema que resuelve es una reformulación sin validar (RCP-004).
- **Incluye:** lista de cursos con sus datos de diseño y filtros por competencia y nivel L1–L4, Rol-Nivel mínimo y objetivo, estado de la versión e Instructor o edición.
- **Excluye:** inscripción (P-57), ordenamiento, búsqueda por texto y resultado vacío (P-58), filtros por duración, modalidad, idioma y producto (BR-FOR-17), y alojar contenido de cursos (VIS-001 §7).
- **Corte de la entrega:** US-026 y US-027.
- **Decisiones de la sesión:** D1 (el actor es el Colaborador) y D2 (solo filtros respaldados por BR-FOR-01 a 10), de `ianache` como usuario de la sesión. Siguen **sin validar** por el Responsable de dominio (BR-FOR-11, BR-FOR-12, P-60).

## 2. Artefactos del conjunto

| Tipo | ID | Archivo | Estado | Preparación |
|---|---|---|---|---|
| Requirement Context Pack | RCP-004 | [RCP-004](../context-packs/RCP-004-catalogo-de-cursos-con-filtros.md) | draft | NOT READY para historias (15 vacíos) |
| Reglas de negocio | BRC-001 | [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) | draft | CONDITIONAL global; NOT READY el cambio (BR-FOR-11 a 17) |
| Glosario | GLS-001 | [GLS-001](../../business/glossary/GLS-001-glosario-de-negocio.md) · [TRM-0106 Curso](../../business/glossary/terms/TRM-0106-curso.md) | draft | CONDITIONAL; GQ-38 abierta |
| Modelo conceptual | IMD-001 | [IMD-001](../../business/information-model/IMD-001-modelo-de-informacion-conceptual.md) | draft | CONDITIONAL; IM-Q13 abierta |
| User Story | US-026 | [Explorar el catálogo de cursos](../user-stories/US-026-explorar-el-catalogo-de-cursos.md) | draft | CONDITIONAL |
| User Story | US-027 | [Ubicar cursos con filtros](../user-stories/US-027-ubicar-cursos-con-filtros.md) | draft | CONDITIONAL |

## 3. Resultado de la auditoría

- **Herramienta:** `audit_requirements.py` sobre el worktree: 0 errores en US-026 y US-027. Quedan 6 errores del conjunto, todos de US-001 a US-006 por formato legado; son previos a este cambio y están fuera del corte.
- **Hallazgos de juicio** (`references/quality-criteria.md`):

| ID | Hallazgo | Severidad | Artefacto y sección | Skill dueño | Estado |
|---|---|---|---|---|---|
| Q-RQS-1 | AC-4 daba por hecho «a lo sumo un Instructor por edición»; IMD-001 R-42 clasifica esa cardinalidad como INFERENCIA | Mayor | US-027 §5 | `af-user-story-refiner` | Corregido; la inferencia quedó en §11 y §12 (P-49) |
| Q-RQS-2 | AC-2 de US-026 era una restricción de alcance (no alojar contenido), no un comportamiento observable | Menor | US-026 §5 | `af-user-story-refiner` | Corregido; pasó a §4 Excluye y §9 |
| Q-RQS-3 | GLS-001 decía «59 de 105 términos»; ahora son 106 | Menor | GLS-001 | `af-business-glossary-curator` | Corregido |
| Q-RQS-4 | US-026 queda con un solo criterio de aceptación; es verificable pero cubre poco | Menor | US-026 §5 | `af-user-story-refiner` | Abierto: se completa al responder P-55, P-56 y P-60 |
| Q-RQS-5 | El problema de §3 en US-027 («hoy se busca a mano en Classroom») no tiene fuente | Menor | US-027 §3 | `af-requirement-context-builder` | Abierto: lo valida el Responsable de dominio |

## 4. Matriz de trazabilidad

| Historia | Preparación | Reglas BR-* | Términos TRM-* | Conceptos IMD | Preguntas abiertas | Depende de |
|---|---|---|---|---|---|---|
| US-026 | CONDITIONAL | BR-FOR-01, 02, 06, 08, 10; propuesta BR-FOR-11; vacíos BR-FOR-13 a 17; BR-INT-01, 02; BR-PTY-20; BR-TRA-03, 06 | TRM-0106, 0013, 0014, 0102, 0104, 0105, 0029, 0030, 0007, 0017 | CURSO, VERSION_DE_CURSO, EDICION_DE_CURSO, COMPETENCIA, NIVEL_DE_ROL | P-55, P-56, P-57, P-60 (bloquean); P-58, P-59, P-46, P-51, GQ-38, IM-Q13, RCP4-Q4, RCP4-Q11, RCP4-Q14, US-026-Q1 | US-001, US-009 (NOT READY) |
| US-027 | CONDITIONAL | BR-FOR-01, 02, 03, 05, 06, 08, 09, 10; propuestas BR-FOR-11, 12; vacíos BR-FOR-13, 14, 16, 17; BR-PTY-20 | TRM-0106, 0013, 0014, 0066, 0102, 0104, 0105 | CURSO, VERSION_DE_CURSO, EDICION_DE_CURSO, COMPETENCIA, NIVEL_DE_ROL, INSTRUCTOR (R-34, 35, 37, 38, 42, 43) | P-55, P-56, P-57, P-60, US-027-Q1 (bloquean); P-58, P-59, P-49, P-50.1, P-46, GQ-38, IM-Q13, RCP4-Q4, Q11, Q12, Q14, US-027-Q2, Q3 | US-026, US-001, US-009 (NOT READY) |

**Huérfanos:** ninguno dentro del corte. Fuera del corte: INSCRIPCION y BR-FOR-08 no tienen historia propia porque dependen de P-57.

## 5. Preguntas abiertas y decisiones humanas pendientes

| ID | Pregunta | Responsable | Prioridad | Bloquea | Desbloquea |
|---|---|---|---|---|---|
| P-60 | ¿Se validan D1 (el Colaborador explora) y D2 (los filtros propuestos) como reglas vigentes? | Jefe de Ingeniería / Responsable de producto | Alta | US-026, US-027 | Pasa BR-FOR-11 y 12 de propuesta a regla; si se rechazan, ambas historias pasan a NOT READY |
| P-55 | ¿Qué cursos y versiones (APPROVED, DRAFT, DEPRECATED) ve cada actor? | Jefe de Ingeniería | Alta | US-026, US-027 | Criterios de visibilidad, de estado como filtro y de «sin permiso» |
| P-56 | ¿Qué metadatos se leen de Classroom y cuáles conserva la plataforma? ¿Aparece un curso sin diseño? | Gestión de formación + ARQ | Alta | US-026, US-027, rol Arquitecto | Qué datos puede mostrar y filtrar la lista |
| P-57 | ¿Explorar implica poder inscribirse y quién inscribe? | Jefe de Ingeniería | Alta | US-026, US-027 | Alcance: si hace falta una historia de inscripción |
| US-027-Q1 | Al combinar filtros, ¿todos a la vez (Y) o alguno (O)? | Jefe de Ingeniería | Alta | US-027 | Criterio de combinación; QA y Developer |
| GQ-38 / IM-Q13 | ¿Cómo se llama y qué es el «catálogo de cursos»: vista o concepto con reglas propias? | Responsable de producto | Alta | Terminología de UX y modelo | Término de glosario y posible concepto |
| RCP4-Q4 | ¿Cómo se relaciona la exploración con US-009 (ruta de formación)? | Responsable de producto | Alta | Dependencias | Orden de entrega |
| P-58, P-59, US-026-Q1, US-027-Q2, Q3, RCP4-Q11, RCP4-Q14, P-46, P-51, P-49 | Orden, búsqueda y lista vacía; filtros extra; entrada por curso o por versión; limpiar filtros; Rol-Nivel mínimo, objetivo o ambos; datos de la edición y del Instructor; horizonte H2; nivel de rol mínimo frente a L1–L4; versión y curso de Classroom; Instructor | Varios, ver US-026 y US-027 §12 | Media | No bloquean | Refinan las historias |

## 6. Preparación por rol

| Rol | Veredicto | Razón y bloqueos | Skill siguiente |
|---|---|---|---|
| Arquitecto | CONDITIONAL | El RCP no está validado y la fuente de los datos del curso no está decidida: P-56 (metadatos de Classroom frente a la plataforma) condiciona la integración y el modelo de datos. Las cardinalidades Edición 0..1 : Instructor (R-42) y Curso–Versión son inferencias. Los RNF están declarados (WCAG 2.2 AA, privacidad). Si se avanza igual, queda pospuesta la decisión sobre la fuente de datos del catálogo. | `architecture-context-builder` |
| QA | CONDITIONAL | Hay 5 criterios Given/When/Then verificables (US-026 AC-1; US-027 AC-1 a AC-4) con regla citada. Los casos negativos y límite son «Sin regla» con pregunta, y QA no debe inventarlos. US-027-Q1 deja sin criterio la combinación de filtros y P-60 puede invalidar la premisa. Si se avanza igual, queda pospuesto todo caso negativo, la combinación, la lista vacía y la visibilidad. | `test-case-generator` |
| Developer | NOT READY | Las dos historias son CONDITIONAL y los bloqueos P-55, P-56 y P-57 están dentro de su alcance: definen qué se muestra y de dónde sale. Además dependen de US-009 (NOT READY) y, si se rechaza D1 o D2, pasan a NOT READY. | `development-scope-pack-builder` cuando se resuelvan P-55, P-56, P-57 y P-60 |
| UX/UI | CONDITIONAL | El actor (hipótesis D1), el flujo, los estados de interfaz (§10) y WCAG 2.2 AA están declarados. Falta confirmar permisos y visibilidad por actor (P-55), qué datos del curso se muestran (P-56) y el nombre de la vista (GQ-38). Si se avanza igual, queda pospuesto qué pantallas existen por actor y las etiquetas definitivas. | `ux-requirements-analyzer` |

## 7. Registro de orquestación

**Aislamiento:** worktree `req-catalogo-de-cursos`, rama `worktree-req-catalogo-de-cursos`, desde el commit 7379575. No contenía el orquestador (sin commitear) ni los 21 cambios pendientes del checkout principal; el auditor se ejecutó con la ruta de ese checkout.

| Pasada | Skill | Artefactos creados o actualizados | Resultado de su verificación |
|---|---|---|---|
| 1 | `af-requirement-context-builder` | RCP-004 | 12 secciones; las 17 reglas citadas existen; sin `verified` |
| 2a | `af-business-glossary-curator` | TRM-0106, GLS-001 | `glossary.py check`: 0 errores (106 términos) |
| 2b | `af-business-rule-extractor` | BRC-001 (BR-FOR-11 a 17, P-55 a P-60, EVD-2026-0136 a 0138) | Diff solo con líneas añadidas; IDs únicos |
| 3 | `af-conceptual-model-designer` | IMD-001 | `check_model.py`: 28 conceptos, 46 relaciones, 0 errores; R-34, 35, 37, 38, 42, 43 verificadas |
| 4 | `af-user-story-refiner` | US-026, US-027 | Auditor: 0 errores en ambas |
| Costuras 1 | refiner y curator | US-026, US-027, GLS-001 | Q-RQS-1, 2 y 3 corregidos |

## 8. Validación humana

- **Estado:** Pendiente
- **Responsable:** Jefe de Ingeniería / Responsable de producto
- **Fecha:** —
- **Decisión humana requerida:** validar D1 y D2 (P-60) y responder P-55, P-56, P-57 y US-027-Q1; nombrar el «catálogo de cursos» (GQ-38).
