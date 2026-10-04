---
id: HOF-PPM-002
type: UX Development Handoff
title: 'HOF-PPM-002 — Handoff de diseño: Gestión de la estructura organizacional (US-017, 028, 029, 030)'
description: 'Contrato Design-to-Code de SCR-017-01..03, SCR-028-01, SCR-029-01..04 y SCR-030-01..04. Borrador para evaluar el gate; no es un handoff aprobado.'
tags:
- ux-ui
- handoff
- design-to-code
- party
- estructura-organizacional
status: draft
generated:
  by: ux-development-handoff/2.0
  at: '2026-10-04T11:00:00-05:00'
sources:
- id: dtm
  resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
- id: uxs-001
  resource: /knowledge-base/design/specs/UXS-001-gestion-de-unidades-organizacionales.md
initiative: plataforma-gestion-formacion
dtm_ref: DTM-PPM-001
screens:
- SCR-017-01
- SCR-017-02
- SCR-017-03
- SCR-028-01
- SCR-029-01
- SCR-029-02
- SCR-029-03
- SCR-029-04
- SCR-030-01
- SCR-030-02
- SCR-030-03
- SCR-030-04
a11y_reports:
- ARP-UNIDADES-V2
design_decisions: []
open_questions: []
---

# HOF-PPM-002 — Gestión de la estructura organizacional

Borrador creado para **evaluar el gate** `DESIGN_READY_FOR_DEV`. Las secciones A a N del contrato no están redactadas. Diseño de referencia: solo Stitch (decisión de ianache, 2026-10-03); Figma queda descartado.

## Resultado del gate (2026-10-04, perfil `production`)

`FAILED` con 39 hallazgos sobre las 12 pantallas:

| Código | Hallazgos | Qué falta | Quién |
|---|---|---|---|
| `MISSING_GOVERNED_DESIGN` (BLOCKED) | 12 (uno por SCR) | El validador exige un `governed_design` aprobado **en Figma**. Con Figma descartado el diseño de Stitch no cuenta como gobernado | Decisión del Jefe de Ingeniería: cómo se registra el diseño de Stitch como gobernado (el skill y el validador no lo prevén) |
| `MISSING_ACCESSIBILITY_REQUIREMENT` (FAILED) | 12 (uno por SCR) | Ningún SCR tiene un informe de accesibilidad en `pass` (ARP-UNIDADES-V2: 2 `fail` ya corregidos en las hojas, 14 `inconclusive`) | Revisión en navegador con CHK-UNIDADES-001 y luego `accessibility-reviewer` |
| `MISSING_HANDOFF_SECTION` (FAILED) | 14 | Las secciones A a N del contrato no están redactadas (este documento es un borrador) | `ux-development-handoff`, tras resolver lo anterior |
| `HUMAN_REVIEW_PENDING` (BLOCKED) | 1 | Sin aprobación humana del gate | Jefe de Ingeniería |

Sin `open_questions` bloqueantes en este documento: las preguntas abiertas de UXR, FLW y SCR (17, 24 y 36, fusionadas en 44 en UXS-001) no están referenciadas aquí y deben revisarse antes de redactar A a N.
