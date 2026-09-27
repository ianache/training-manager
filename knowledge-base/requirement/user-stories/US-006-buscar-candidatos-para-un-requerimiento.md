---
type: Refined User Story
title: "US-006 — Buscar candidatos para un requerimiento"
description: "El Jefe de proyecto ve los colaboradores cuyo nivel certificado alcanza el nivel exigido por un requerimiento de su proyecto."
tags: [user-story, h1, busqueda-de-personal, requerimientos]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-27T14:10:00-05:00"
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
- **Excluye:** la decisión de asignación ([US-007](../USC-001-user-stories-plataforma-gestion-formacion.md#us-007), bloqueada por P-05).
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
- **Sin regla:** qué datos del perfil de cada candidato puede ver el Jefe de proyecto (P-08).
- **Sin regla:** si la búsqueda excluye a colaboradores ya asignados a otro proyecto. Ninguna fuente lo trata (US6-Q1).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0034 | El Jefe de proyecto "encuentra personal certificado"; la capacidad 4 incluye "candidatos por requerimiento" | VIS-001:L42, L78 | fact | medium |
| EVD-2026-0035 | El KPI 1 considera cubierto un rol con "personal certificado al nivel exigido" | VIS-001:L119 | fact | medium |
| EVD-2026-0023 | Cómo se decide una asignación está abierto | VIS-001:L154 | gap | high |
| EVD-2026-0104 | Por defecto, un requerimiento asume todas las competencias del Rol-Nivel; el Jefe de proyecto que lo registra puede retirar las que no considere necesarias | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-38 | decision | high |
| EVD-2026-0107 | La búsqueda muestra también los candidatos que no alcanzan el nivel, con su brecha. Por defecto se ordena de mayor a menor cumplimiento (primero los de menor brecha), y se puede cambiar a de mayor a menor brecha. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-16 (USC-001) | decision | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Responsable de producto`.

## Reglas, dependencias e impactos

- **Reglas:** BR-BRE-01, BR-BRE-05; BR-REQ-07 y BR-REQ-10 (qué competencias trae el requerimiento).
- **Depende de:** [US-001](US-001-definir-catalogo-de-competencias.md), [US-002](US-002-declarar-requerimientos-de-proyecto.md) y [US-003](US-003-acreditar-manualmente-un-nivel.md).
- **Es prerrequisito de:** US-007 (asignación).
- **Alimenta:** los KPI 1 (cobertura de roles) y 2 (tiempo de asignación), VIS-001:L119-L120.
- **Dato personal:** la búsqueda expone datos de desempeño de otras personas; hasta resolver P-08, conviene mostrar lo mínimo.

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-08 — ¿Qué datos del perfil de otra persona puede ver el Jefe de proyecto? | Responsable de producto | Alta | Abierta (BRC-001) |
| P-16 — ¿Se muestran candidatos por debajo del nivel, con su brecha? ¿Cómo se ordena? ¿Se admite calce parcial? | Responsable de producto | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí, con su brecha; por defecto de menor a mayor brecha, y se puede invertir (BR-BRE-05) |
| P-44 — ¿Cómo se resume en un solo valor la brecha de un candidato para ordenar? | Jefe de Ingeniería | Media | Nueva (BRC-001, derivada de P-16) || US6-Q1 — ¿La búsqueda considera si el colaborador ya está asignado a otro proyecto? | Responsable de producto | Media | Nueva |
| VIS-§11.4 — ¿De dónde salen los colaboradores que se buscan? | Responsable de producto + ARQ | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D2): la plataforma es el sistema de registro de colaboradores, sin integración con RR. HH. (BR-PTY-01). Se buscan las personas con rol vigente de Empleado o Contratista (BR-PTY-05) |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** la búsqueda, los candidatos por debajo del nivel y el orden están sostenidos (AC-1 a AC-4; P-16 respondida). P-08 condiciona lo que se muestra de cada candidato y P-44 condiciona cómo se calcula el orden.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Responsable de producto valida la historia y responde P-08; el Jefe de Ingeniería responde P-44.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis (calce total marcado como inferencia)
- [x] Contradicciones visibles (ninguna)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
