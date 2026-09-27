---
type: Refined User Story
title: "US-006 — Buscar candidatos para un requerimiento"
description: "El Jefe de proyecto ve los colaboradores cuyo nivel certificado alcanza el nivel exigido por un requerimiento de su proyecto."
tags: [user-story, h1, busqueda-de-personal, requerimientos]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
---

# US-006 — Buscar candidatos para un requerimiento

## Objetivo y alcance

- **Pregunta:** ¿qué debe mostrar la búsqueda para que el Jefe de proyecto encuentre personal certificado para un requerimiento?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Responsable de producto, que valida.
- **Incluye:** la lista de candidatos para un requerimiento.
- **Excluye:** la decisión de asignación ([US-007](../USC-001-user-stories-plataforma-gestion-formacion.md#us-007)). P-05 quedó respondida el 2026-09-27 (EVD-2026-0126): la plataforma **recomienda** candidatos y el **Jefe de Ingeniería o un usuario ADMIN** asigna uno o varios colaboradores al requerimiento, con la decisión final (BR-REQ-04). Se puede asignar a alguien que no alcanza el nivel (BR-REQ-11) y a alguien ya asignado a otro requerimiento, con advertencia y sin bloqueo (BR-REQ-12).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Jefe de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md), **quiero** ver los colaboradores que cumplen un [requerimiento](../../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) de mi proyecto, **para** encontrar personal certificado ([búsqueda de personal](../../business/glossary/terms/TRM-0006-busqueda-de-personal.md); VIS-001:L42, L78).

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un requerimiento de mi proyecto | busco candidatos | veo los colaboradores cuyo nivel certificado alcanza el nivel exigido | VIS-001:L42, L119 ("personal certificado al nivel exigido"); BR-BRE-01 |
| AC-2 | un requerimiento con colaboradores que no alcanzan el nivel exigido | busco candidatos | también los veo, cada uno con su brecha frente al requerimiento | BR-BRE-05 |
| AC-3 | el resultado de la búsqueda | no cambio el orden | se ordena de menor a mayor brecha: primero los de mayor cumplimiento | BR-BRE-05 |
| AC-4 | el resultado ordenado por defecto | invierto el orden | se ordena de mayor a menor brecha | BR-BRE-05 |

### Casos negativos y límite

- **Aclarado:** si ningún colaborador alcanza el nivel, la lista muestra igualmente a los demás con su brecha, primero los más cercanos (BR-BRE-05; P-16 respondida el 2026-09-27).
- **Límite sin regla:** cómo se resume en un solo valor la brecha de un candidato frente a varias competencias para ordenar (suma, cantidad de competencias no cubiertas, promedio) (P-44). Tampoco cómo se desempata.
- **Por confirmar (no es criterio):** un candidato "alcanza el nivel" solo si lo alcanza en **todas** las competencias del requerimiento; los demás aparecen con su brecha (BR-BRE-05). Es una inferencia.
- **Aclarado (2026-09-27):** las competencias del requerimiento son, por defecto, todas las del Rol-Nivel, menos las que el Jefe de proyecto retiró al registrarlo; las retiradas no cuentan en la búsqueda (BR-REQ-07, BR-REQ-10, EVD-2026-0104). **Inferencia:** "no cuentan" se deduce de que el requerimiento ya no las incluye.
- **Aclarado (2026-09-27, P-08):** el Jefe de proyecto ve la brecha individual de cualquier candidato, sin restricción (BR-TRA-04); el resumen de niveles certificados, las evidencias (las de GitLab, sujetas al control de acceso de cada repositorio) y las certificaciones con su auditoría son visibles para cualquier colaborador (BR-TRA-03, BR-TRA-05, BR-TRA-06). Qué se muestra de calificaciones y del sustento del evaluador sigue abierto (P-54); no afecta a AC-1 a AC-4.
- **Aclarado en parte (2026-09-27, P-05):** un colaborador ya asignado a otro requerimiento se puede volver a asignar, con advertencia (BR-REQ-12). **Inferencia:** la búsqueda no lo excluye; si la lista debe indicar esa asignación previa sigue abierto (US6-Q1).
- **Aclarado (2026-09-27, P-05):** la lista es la **recomendación** de la plataforma (BR-REQ-04); no asigna a nadie por sí sola. Los candidatos que no alcanzan el nivel también se pueden asignar (BR-REQ-11).
- **Sin regla:** si el Jefe de Ingeniería o el ADMIN, que son quienes asignan, ven esta misma búsqueda, o si el Jefe de proyecto les propone candidatos (US6-Q2).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0034 | El Jefe de proyecto "encuentra personal certificado"; la capacidad 4 incluye "candidatos por requerimiento" | VIS-001:L42, L78 | fact | medium |
| EVD-2026-0035 | El KPI 1 considera cubierto un rol con "personal certificado al nivel exigido" | VIS-001:L119 | fact | medium |
| EVD-2026-0023 | Cómo se decide una asignación está abierto *(respondido por EVD-2026-0126)* | VIS-001:L154 | gap | high |
| EVD-2026-0126 | La plataforma recomienda candidatos y el Jefe de Ingeniería o un ADMIN asigna uno o varios colaboradores al requerimiento, con la decisión final; se puede asignar bajo el nivel (con un curso que cubra la brecha antes de integrarse) y a más de un requerimiento, con advertencia y sin límite. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-05 | decision | high |
| EVD-2026-0129 | El Jefe de proyecto ve las brechas individuales de cualquier colaborador; resumen de niveles certificados, evidencias y certificaciones son visibles para cualquier colaborador. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-08 | decision | high |
| EVD-2026-0104 | Por defecto, un requerimiento asume todas las competencias del Rol-Nivel; el Jefe de proyecto que lo registra puede retirar las que no considere necesarias | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-38 | decision | high |
| EVD-2026-0107 | La búsqueda muestra también los candidatos que no alcanzan el nivel, con su brecha. Por defecto se ordena de mayor a menor cumplimiento (primero los de menor brecha), y se puede cambiar a de mayor a menor brecha. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-16 (USC-001) | decision | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Responsable de producto`.

## Reglas, dependencias e impactos

- **Reglas:** BR-BRE-01, BR-BRE-05; BR-REQ-07 y BR-REQ-10 (qué competencias trae el requerimiento); BR-TRA-03 a BR-TRA-05 (qué se ve de cada candidato); BR-REQ-04, BR-REQ-11 y BR-REQ-12 (contexto de la asignación, en US-007).
- **Depende de:** [US-001](US-001-definir-catalogo-de-competencias.md), [US-002](US-002-declarar-requerimientos-de-proyecto.md) y [US-003](US-003-acreditar-manualmente-un-nivel.md).
- **Es prerrequisito de:** US-007 (asignación).
- **Alimenta:** los KPI 1 (cobertura de roles) y 2 (tiempo de asignación), VIS-001:L119-L120.
- **Dato personal:** la búsqueda expone datos de desempeño de otras personas. P-08 quedó respondida el 2026-09-27: el Jefe de proyecto puede ver la brecha individual de cualquier candidato (BR-TRA-04), así que ya no aplica el "mostrar lo mínimo" provisional.

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-08 — ¿Qué datos del perfil de otra persona puede ver el Jefe de proyecto? | Responsable de producto | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): brechas individuales de cualquier colaborador (BR-TRA-04); resumen de niveles, evidencias y certificaciones, como cualquier colaborador (BR-TRA-03, BR-TRA-05, BR-TRA-06). Derivada: P-54 |
| P-05 — ¿La plataforma solo recomienda o hay un flujo de aprobación de la asignación? | Responsable de producto | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): recomienda; asigna el Jefe de Ingeniería o un ADMIN (BR-REQ-04, BR-REQ-11, BR-REQ-12). Derivada: P-53 |
| P-16 — ¿Se muestran candidatos por debajo del nivel, con su brecha? ¿Cómo se ordena? ¿Se admite calce parcial? | Responsable de producto | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí, con su brecha; por defecto de menor a mayor brecha, y se puede invertir (BR-BRE-05) |
| P-44 — ¿Cómo se resume en un solo valor la brecha de un candidato para ordenar? | Jefe de Ingeniería | Media | Nueva (BRC-001, derivada de P-16) |
| US6-Q1 — ¿La búsqueda considera si el colaborador ya está asignado a otro proyecto? | Responsable de producto | Media | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27, P-05): la asignación múltiple se permite con advertencia (BR-REQ-12); **inferencia:** la búsqueda no excluye a los ya asignados. Sigue abierto si la lista lo indica |
| US6-Q2 — ¿Quién ve la recomendación de candidatos: el Jefe de proyecto, quien asigna (Jefe de Ingeniería o ADMIN), o ambos? | Jefe de Ingeniería | Media | Nueva (derivada de P-05) |
| VIS-§11.4 — ¿De dónde salen los colaboradores que se buscan? | Responsable de producto + ARQ | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D2): la plataforma es el sistema de registro de colaboradores, sin integración con RR. HH. (BR-PTY-01). Se buscan las personas con rol vigente de Empleado o Contratista (BR-PTY-05) |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** la búsqueda, los candidatos por debajo del nivel y el orden están sostenidos (AC-1 a AC-4; P-16 respondida). P-08 quedó respondida el 2026-09-27 (qué se ve de cada candidato, BR-TRA-03 a BR-TRA-05) y P-05 también (la lista es una recomendación; asignan el Jefe de Ingeniería o un ADMIN). Sigue CONDITIONAL por P-44, que condiciona cómo se calcula el orden, y en menor medida por US6-Q2 (quién ve la recomendación).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Responsable de producto valida la historia; el Jefe de Ingeniería responde P-44 y US6-Q2.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis (calce total marcado como inferencia)
- [x] Contradicciones visibles (ninguna)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
