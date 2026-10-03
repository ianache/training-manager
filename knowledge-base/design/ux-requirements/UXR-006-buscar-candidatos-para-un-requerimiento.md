---
type: UX Requirement
title: "UXR-006 — Buscar candidatos para un requerimiento"
description: "Lo que el Jefe de proyecto necesita para ver qué colaboradores cumplen un requerimiento de su proyecto."
tags: [ux-ui, ux-requirement, busqueda-de-personal, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T18:00:00-05:00"
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

- **Historia:** [US-006](../../requirement/user-stories/US-006-buscar-candidatos-para-un-requerimiento.md), criterios AC-1 a AC-4.
- **Reglas:** BR-BRE-01, BR-BRE-05, BR-REQ-06 a BR-REQ-08, BR-REQ-10, BR-TRA-03 a BR-TRA-06, BR-PTY-20; reglas de asignación aún sin historia: BR-REQ-04, BR-REQ-11, BR-REQ-12.
- **Conceptos (IMD-001):** Requerimiento, Colaborador, Nivel certificado, Nivel requerido.
- **Actor:** [Jefe de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Encontrar personas certificadas al nivel que su proyecto necesita.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-006.1 | El requerimiento: Rol-Nivel y las competencias que incluye (por defecto todas las del Rol-Nivel, menos las retiradas al registrarlo) con su nivel esperado | BR-REQ-06 a BR-REQ-08, BR-REQ-10 |
| UXR-006.2 | Los colaboradores cuyo nivel certificado alcanza el nivel esperado | AC-1; VIS-001:L119 |
| UXR-006.2b | También los colaboradores que no alcanzan el nivel esperado, cada uno con su brecha, distinguiendo en texto (no solo con color) quién alcanza y quién no | AC-2; BR-BRE-05; UXR-000.3 |
| UXR-006.3 | Para cada candidato, su brecha individual frente al requerimiento (el Jefe de proyecto la ve de cualquier colaborador, BR-TRA-04), el resumen de sus niveles certificados (BR-TRA-03) y acceso a sus evidencias y certificaciones (BR-TRA-05, BR-TRA-06); de sus datos maestros, solo nombre, correo laboral, unidad, rol y perfiles profesionales (BR-PTY-20). P-08 y P-52 quedaron respondidas el 2026-09-27; calificaciones y sustento del evaluador siguen abiertos (P-54) | BR-TRA-03 a BR-TRA-06, BR-PTY-20; UXR-000.5 |

## Acciones

- **UXR-006.4:** iniciar la búsqueda desde un requerimiento de su proyecto (AC-1).
- **UXR-006.5:** invertir el orden de la lista: por defecto de menor a mayor brecha (primero el mayor cumplimiento), y de mayor a menor si lo cambia (AC-3, AC-4; BR-BRE-05).
- La asignación no es una acción del Jefe de proyecto. P-05 quedó respondida el 2026-09-27: la lista es la **recomendación** de la plataforma y asigna el Jefe de Ingeniería o un usuario ADMIN (BR-REQ-04). La historia de asignación aún no está refinada; los requisitos siguientes son **candidatos** para su UXR, trazados a las reglas:
  - **UXR-006.6 (candidato):** para el Jefe de Ingeniería o un ADMIN, una acción "asignar" que permite elegir uno o varios colaboradores de la lista para el requerimiento (BR-REQ-04). Para el Jefe de proyecto la acción no aparece o muestra "sin permiso" (UXR-000; **inferencia**). Si el Jefe de Ingeniería usa esta misma vista está abierto (US6-Q2).
  - **UXR-006.7 (candidato):** al asignar a alguien que no alcanza el nivel, la interfaz lo permite y muestra su brecha; si además pide el curso de cierre o un motivo depende de P-53 (BR-REQ-11).
  - **UXR-006.8 (candidato):** al asignar a alguien ya asignado a otro requerimiento, la interfaz muestra una advertencia no bloqueante y deja confirmar (BR-REQ-12).

## Reglas que la interfaz debe hacer visibles

- Un candidato alcanza el nivel esperado en las competencias del requerimiento. Las competencias retiradas del requerimiento no cuentan (BR-REQ-07; inferencia de US-006). Que deba alcanzarlo en **todas** es una inferencia (US-006; P-16).
- El orden vigente se indica de forma visible y accesible (**inferencia**, UXR-000). Cómo se calcula la brecha de un candidato para ordenar está abierto (P-44).

## Estados

- **Nadie alcanza el nivel:** se muestran igualmente los candidatos con su brecha, primero los más cercanos (BR-BRE-05; P-16 respondida).
- **Sin colaboradores:** no hay nadie a quien mostrar (**inferencia**: por ejemplo, sin colaboradores registrados con ese rol).
- **Carga, error y sin permiso:** según UXR-000.
- **Evidencia de GitLab no accesible:** el candidato tiene evidencias en un repositorio al que el usuario no tiene acceso; se indica sin mostrar el contenido (BR-TRA-05; **inferencia**).
- **Candidato ya asignado (candidato de asignación):** advertencia no bloqueante (BR-REQ-12).

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| ~~P-08~~ | ~~¿Qué datos de cada candidato puede ver el Jefe de proyecto?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): ver UXR-006.3 (BR-TRA-03 a BR-TRA-06) | Responsable de producto | — |
| P-54 | ¿Las calificaciones y el sustento del evaluador son visibles para todos? | Jefe de Ingeniería | Media |
| ~~P-16~~ | ~~¿Se muestran candidatos que no alcanzan el nivel? ¿Cómo se ordena?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí, con su brecha; por defecto de menor a mayor brecha, invertible (BR-BRE-05) | Jefe de Ingeniería | — |
| P-44 | ¿Cómo se resume en un solo valor la brecha de un candidato para ordenar (suma, competencias no cubiertas, promedio)? | Jefe de Ingeniería | Media |
| US6-Q1 | ¿Se indica si el colaborador ya está asignado a otro proyecto? Parcialmente respondida (2026-09-27): la asignación múltiple se permite con advertencia (BR-REQ-12); si la lista lo muestra sigue abierto | Responsable de producto | Media |
| ~~P-05~~ | ~~¿Cómo se decide una asignación? Define si esta vista tiene una acción "asignar"~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): recomienda la plataforma, asigna el Jefe de Ingeniería o un ADMIN (BR-REQ-04). Ver UXR-006.6 a UXR-006.8 | Responsable de producto | — |
| US6-Q2 | ¿Quién ve la recomendación: el Jefe de proyecto, quien asigna, o ambos? Define si esta vista es compartida | Jefe de Ingeniería | Media |
| P-53 | Al asignar bajo el nivel, ¿se registra el curso de cierre o un motivo? | Jefe de Ingeniería | Media |
