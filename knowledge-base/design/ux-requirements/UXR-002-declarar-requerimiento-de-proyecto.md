---
type: UX Requirement
title: "UXR-002 — Declarar un requerimiento de proyecto"
description: "Lo que el Jefe de proyecto necesita para declarar qué Rol-Nivel y qué competencias necesita su proyecto."
tags: [ux-ui, ux-requirement, requerimientos, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: us-002
    resource: /knowledge-base/requirement/user-stories/US-002-declarar-requerimientos-de-proyecto.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
---

# UXR-002 — Declarar un requerimiento de proyecto

## Trazabilidad

- **Historia:** [US-002](../../requirement/user-stories/US-002-declarar-requerimientos-de-proyecto.md), criterios AC-1 y AC-3.
- **Reglas:** BR-REQ-01, BR-REQ-02, BR-REQ-06 a BR-REQ-10, BR-CAT-08, BR-CAT-14.
- **Conceptos (IMD-001):** Proyecto, Requerimiento, Rol, Nivel de rol, Competencia, Nivel requerido.
- **Actor:** [Jefe de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Decir qué perfil necesita su proyecto, con la precisión suficiente para encontrar personas certificadas.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-002.1 | Su proyecto y el producto al que pertenece | BR-REQ-01 |
| UXR-002.2 | Los roles del catálogo y sus Rol-Nivel, sea cual sea el producto | BR-CAT-08 |
| UXR-002.3 | Para el Rol-Nivel elegido, sus competencias con el nivel L1–L4 esperado, en solo lectura porque vienen del catálogo | BR-REQ-06, BR-CAT-14 |
| UXR-002.4 | Los requerimientos que ya declaró para su proyecto | BR-REQ-01, BR-REQ-02 |

## Acciones

| ID | El usuario puede… | Fuente |
|---|---|---|
| UXR-002.5 | Elegir un rol y un nivel de rol | BR-REQ-08 |
| UXR-002.6 | Ver preseleccionadas todas las competencias de ese Rol-Nivel y retirar las que no necesite el proyecto; puede volver a incluir una retirada antes de guardar (**inferencia**, confirmar con UX) | BR-REQ-07, BR-REQ-10; AC-3; AMB-06 resuelta (P-38) |
| UXR-002.7 | Guardar el requerimiento asociado a su proyecto | AC-1 |

## Reglas que la interfaz debe hacer visibles

- Solo se ofrecen competencias del Rol-Nivel elegido. Pedir una competencia de fuera del rol no es posible (BR-REQ-09). Solo se pueden retirar competencias, no agregar (BR-REQ-10).
- Solo el Jefe de proyecto que registra el requerimiento puede retirar competencias (BR-REQ-10).
- Solo el Jefe de proyecto de ese proyecto declara sus requerimientos (BR-REQ-02; US2-Q2 respondida el 2026-09-27). Otro usuario no ve la acción de declarar en ese proyecto, o ve el estado "sin permiso" (UXR-000).
- Los niveles L1–L4 no se editan en el requerimiento: vienen del catálogo (BR-REQ-06).

## Estados

- **Vacío:** el proyecto no tiene requerimientos todavía.
- **Sin proyectos:** el usuario no es jefe de ningún proyecto.
- **Sin permiso** y **error:** según UXR-000.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| ~~P-38~~ | ~~¿Se pueden pedir solo algunas competencias del Rol-Nivel o siempre todas?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): por defecto todas; quien registra el requerimiento puede retirar algunas (BR-REQ-07, BR-REQ-10) | Jefe de Ingeniería | — |
| US2-Q4 | ¿Se pueden retirar todas las competencias, o debe quedar al menos una? Define la validación al guardar | Responsable de producto | Baja |
| US2-Q1 | ¿De dónde salen los proyectos y su jefe? Define cómo se elige el proyecto | Responsable de producto | Alta |
| ~~US2-Q2~~ | ~~¿Solo el jefe de ese proyecto declara sus requerimientos?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí (BR-REQ-02) | Responsable de producto | — |
| US2-Q3 | ¿Un requerimiento indica cuántas personas se necesitan? | Responsable de producto | Baja |
| P-11 | ¿Qué estados tiene un proyecto? | Responsable de producto | Media |
