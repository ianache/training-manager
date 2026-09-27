---
type: UX Requirement
title: "UXR-006 — Buscar candidatos para un requerimiento"
description: "Lo que el Jefe de proyecto necesita para ver qué colaboradores cumplen un requerimiento de su proyecto."
tags: [ux-ui, ux-requirement, busqueda-de-personal, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T00:42:35-05:00"
sources:
  - id: us-006
    resource: /knowledge-base/requirement/user-stories/US-006-buscar-candidatos-para-un-requerimiento.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
---

# UXR-006 — Buscar candidatos para un requerimiento

## Trazabilidad

- **Historia:** [US-006](../../requirement/user-stories/US-006-buscar-candidatos-para-un-requerimiento.md), criterio AC-1.
- **Reglas:** BR-BRE-01, BR-REQ-06 a BR-REQ-08.
- **Conceptos (IMD-001):** Requerimiento, Colaborador, Nivel certificado, Nivel requerido.
- **Actor:** [Jefe de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Encontrar personas certificadas al nivel que su proyecto necesita.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-006.1 | El requerimiento: Rol-Nivel y competencias con su nivel esperado | BR-REQ-06 a BR-REQ-08 |
| UXR-006.2 | Los colaboradores cuyo nivel certificado alcanza el nivel esperado | AC-1; VIS-001:L119 |
| UXR-006.3 | Para cada candidato, lo mínimo necesario para decidir. Qué datos exactamente está abierto (P-08) | P-08; UXR-000.5 |

## Acciones

- **UXR-006.4:** iniciar la búsqueda desde un requerimiento de su proyecto (AC-1).
- La asignación no forma parte de este requisito: está abierta (P-05, US-007 NOT READY).

## Reglas que la interfaz debe hacer visibles

- Un candidato alcanza el nivel esperado en las competencias del requerimiento. Que deba alcanzarlo en **todas** es una inferencia (US-006; P-16).

## Estados

- **Sin candidatos:** caso abierto (P-16): mostrar o no a los más cercanos.
- **Carga, error y sin permiso:** según UXR-000.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| P-08 | ¿Qué datos de cada candidato puede ver el Jefe de proyecto? | Responsable de producto | Alta |
| P-16 | ¿Se muestran candidatos que no alcanzan el nivel, con su brecha? ¿Cómo se ordena? ¿Se admite calce parcial? | Responsable de producto | Media |
| US6-Q1 | ¿Se indica si el colaborador ya está asignado a otro proyecto? | Responsable de producto | Media |
| P-05 | ¿Cómo se decide una asignación? Define si esta vista tiene una acción "asignar" | Responsable de producto | Alta |
