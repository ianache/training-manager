---
id: HOF-PPM-001
type: UX Development Handoff
title: 'HOF-PPM-001 — Handoff de diseño: Registrar un colaborador (US-015)'
description: 'Contrato Design-to-Code de SCR-015-01..10. Borrador: el gate aún no
  pasa.'
tags:
- ux-ui
- handoff
- design-to-code
- party
status: draft
generated:
  by: ux-development-handoff/2.0
  at: '2026-10-02T00:10:00-05:00'
sources:
- id: dtm
  resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
- id: scr-015
  resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
initiative: plataforma-gestion-formacion
dtm_ref: DTM-PPM-001
screens:
- SCR-015-01
- SCR-015-02
- SCR-015-03
- SCR-015-04
- SCR-015-05
- SCR-015-06
- SCR-015-07
- SCR-015-08
- SCR-015-09
- SCR-015-10
a11y_reports: []
design_decisions: []
open_questions:
- id: HOF-Q1
  text: 'Color de error: #DC2626 (directrices de Stitch) vs #BA1A1A (design.md). Decidir
    cuál rige cada uso en Figma.'
  blocking: false
  status: open
- id: HOF-Q2
  text: Contrastes «WCAG AAA» del design system de Stitch sin evidencia; requiere
    accessibility-reviewer.
  blocking: false
  status: open
- id: HOF-Q3
  text: Posible pantalla Stitch duplicada (huérfana) de la primera generación de SCR-015-05;
    revisar el proyecto.
  blocking: false
  status: open
- id: HOF-Q4
  text: Contadores de paso incoherentes en SCR-015 («Paso 6 de 5»); corregir antes
    de Figma.
  blocking: true
  status: open
assumptions:
- Solo escritorio (decisión de ianache, 2026-10-01)
- 'Tokens: Sovereign Enterprise (TKN-SET-001)'
- SCR-015-10 es una hoja de referencia de mensajes de error
gate:
  name: DESIGN_READY_FOR_DEV
  result: FAILED
  evaluated_at: '2026-10-02T00:10:00-05:00'
  evaluator: validators/cli.py gate --profile production
  findings:
  - code: BLOCKING_OPEN_QUESTION
    subjects:
    - HOF-Q4
  - code: HUMAN_REVIEW_PENDING
    subjects:
    - HOF-PPM-001
  - code: MISSING_ACCESSIBILITY_REQUIREMENT
    subjects:
    - SCR-015-01
    - SCR-015-02
    - SCR-015-03
    - SCR-015-04
    - SCR-015-05
    - SCR-015-06
    - SCR-015-07
    - SCR-015-08
    - SCR-015-09
    - SCR-015-10
  - code: MISSING_GOVERNED_DESIGN
    subjects:
    - SCR-015-01
    - SCR-015-02
    - SCR-015-03
    - SCR-015-04
    - SCR-015-05
    - SCR-015-06
    - SCR-015-07
    - SCR-015-08
    - SCR-015-09
    - SCR-015-10
  human_review:
    status: pending
---

# HOF-PPM-001 — Handoff de diseño: Registrar un colaborador

> Borrador. **No** apto para Desarrollo: no hay `governed_design` (Figma) para ninguna pantalla.

## A. Requirement Context
US-015 · AC-015 · UXR-015 (ver `knowledge-base/requirement/` y `design/ux-requirements/`).

## B. User Flow
[FLW-015](../user-flows/FLW-015-registrar-un-colaborador.md).

## C. Screens
SCR-015-01 a SCR-015-10 (SCR-015-10 = hoja de referencia de errores). Ver [SCR-015](../screens/SCR-015-registrar-un-colaborador.md).

## D. Governed Design Reference
**Pendiente.** Sin Figma gobernado. Las referencias de Stitch (DTM-PPM-001) son solo `exploration_lineage` y no se implementan.

## E. Components
CMP-015 (ver [CMP-015](../components/CMP-015-componentes-registrar-colaborador.md)).

## F. Design Tokens
[TKN-SET-001](../tokens/TKN-SET-001-sovereign-enterprise.md).

## G. Screen States
Por SCR: `required_states` en SCR-015. Cobertura en Figma: pendiente.

## H. Responsive Behavior
Solo escritorio.

## I. Interaction Rules
Pendiente de redactar a partir de SCR-015 (validación en tiempo real de duplicados E5/E6; combobox con búsqueda; foco al primer campo inválido).

## J. Accessibility Requirements
`a11y_requirements` de SCR-015. Informes ARP-*: pendientes.

## K. Acceptance Criteria
AC-015.

## L. Design Decisions
Pendiente: DD que registre Figma sobre Stitch.

## M. Open Questions / Assumptions
Ver el frontmatter (`open_questions`, `assumptions`).

## N. Provenance / Lineage
US-015 → UXR-015 → FLW-015 → SCR-015-01..10 → Stitch (STP-PPM-001, exploración) → Figma (pendiente) → CMP-015 / TKN-SET-001 → HOF-PPM-001.
