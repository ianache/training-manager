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
- ARP-SCR-017-02-C
- ARP-SCR-028-01-C
- ARP-SCR-029-01-C
- ARP-SCR-029-02-C
- ARP-SCR-029-03-C
- ARP-SCR-029-04-C
design_decisions: []
open_questions: []
---

# HOF-PPM-002 — Gestión de la estructura organizacional

Borrador creado para **evaluar el gate** `DESIGN_READY_FOR_DEV`. Las secciones A a N se redactaron el 2026-10-04 por referencias (abajo). Diseño de referencia: solo Stitch (decisión de ianache, 2026-10-03); Figma queda descartado.

## Resultado del gate (2026-10-04, perfil `production`)

`FAILED` con 39 hallazgos sobre las 12 pantallas:

| Código | Hallazgos | Qué falta | Quién |
|---|---|---|---|
| `MISSING_GOVERNED_DESIGN` (BLOCKED) | 12 (uno por SCR) | El validador exige un `governed_design` aprobado **en Figma**. Con Figma descartado el diseño de Stitch no cuenta como gobernado | Decisión del Jefe de Ingeniería: cómo se registra el diseño de Stitch como gobernado (el skill y el validador no lo prevén) |
| `MISSING_ACCESSIBILITY_REQUIREMENT` (FAILED) | 12 (uno por SCR) | Ningún SCR tiene un informe de accesibilidad en `pass` (ARP-UNIDADES-V2: 2 `fail` ya corregidos en las hojas, 14 `inconclusive`) | Revisión en navegador con CHK-UNIDADES-001 y luego `accessibility-reviewer` |
| `MISSING_HANDOFF_SECTION` (FAILED) | 14 | Las secciones A a N del contrato no están redactadas (este documento es un borrador) | `ux-development-handoff`, tras resolver lo anterior |
| `HUMAN_REVIEW_PENDING` (BLOCKED) | 1 | Sin aprobación humana del gate | Jefe de Ingeniería |

Sin `open_questions` bloqueantes en este documento: las preguntas abiertas de UXR, FLW y SCR (17, 24 y 36, fusionadas en 44 en UXS-001) no están referenciadas aquí y deben revisarse antes de redactar A a N.

## A. Requirement Context
US-017 (organización interna), US-028 (listar y buscar), US-029 (registrar y editar) y US-030 (desactivar y reactivar); UXR-017, UXR-028, UXR-029, UXR-030 (en `design/ux-requirements/`); reglas BR-PTY-02/03/04/07/12/17/21 a 28 de BRC-001. Decisiones del 2026-10-04: ADMIN también gestiona la estructura (EVD-2026-0238), el correo laboral es obligatorio al registrar una unidad (BR-PTY-27) y la organización interna queda fuera de la gestión por API (BR-PTY-28). Anexo: [UXS-001](../specs/UXS-001-gestion-de-unidades-organizacionales.md).

## B. User Flow
[FLW-017](../user-flows/FLW-017-registrar-la-organizacion-interna.md), [FLW-028](../user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md), [FLW-029](../user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md) y [FLW-030](../user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md).

## C. Screens
SCR-017-01 a 03 ([SCR-017](../screens/SCR-017-registrar-la-organizacion-interna.md)), SCR-028-01 ([SCR-028](../screens/SCR-028-listar-y-buscar-unidades-organizacionales.md)), SCR-029-01 a 04 ([SCR-029](../screens/SCR-029-registrar-y-editar-unidades-organizacionales.md)) y SCR-030-01 a 04 ([SCR-030](../screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md)).

## D. Governed Design Reference
**Pendiente de aprobación humana.** Figma está descartado (decisión de ianache, 2026-10-03): el diseño de referencia es el de Stitch (STP-PPM-001), registrado por pantalla en DTM-PPM-001 como `exploration_design`. Un `governed_design` de Stitch exige que un humano lo apruebe con `register-governed-stitch --approved-by human:<id>`; hoy no hay ninguna aprobación registrada. Hojas consolidadas vigentes: SCR-017-02, SCR-028-01, SCR-029-01 (v5, con «Correo laboral *»), SCR-029-02, SCR-029-03 y SCR-029-04; el resto de las pantallas conserva sus hojas por estado (ver DTM y GEN-017, 028, 029 y 030).

## E. Components
[CMP-017](../components/CMP-017-componentes-gestion-de-unidades.md): componentes existentes en `@gf/ui` (incluido `email-input` para el correo laboral) y siete brechas sin diseño atómico (lista de descripción, tabla ordenable, árbol, diálogo, grupo de alternancia, chip de filtro, paginación), más migas de pan. Las brechas requieren `web-atomic-component-designer`; no se sustituyen por Material.

## F. Design Tokens
[TKN-SET-002](../tokens/TKN-SET-002-comsatel-styled.md) (Comsatel Styled, con los tokens de éxito `success` `#065f46` sobre `#ecfdf5`). [TKN-SET-001](../tokens/TKN-SET-001-sovereign-enterprise.md) queda como referencia histórica.

## G. Screen States
Por SCR: `required_states` y la sección «Estados» de cada SCR. Cobertura en Stitch: GEN-017, GEN-028, GEN-029 y GEN-030 (SCR-029-01 sin los estados `loading`, `unsaved-changes`, `cycle-error` ni `inactive-parent-error` en la hoja; «sin permisos» en una hoja suelta).

## H. Responsive Behavior
Solo escritorio (decisión de ianache, 2026-10-01); no se diseñó móvil ni tableta.

## I. Interaction Rules
Las del SCR y el FLW de cada pantalla: validación en línea al salir del campo y al enviar; selector de unidad padre con solo unidades Activas y sin la propia unidad ni sus descendientes; resumen «{unidad}: de X a Y» antes de confirmar un cambio de padre (SCR-029-03); diálogos de confirmación y bloqueo con foco atrapado, Escape y retorno del foco (SCR-030); «Hasta» vacío en la relación vigente; sin «Eliminar» (BR-PTY-21).

## J. Accessibility Requirements
`a11y_requirements` de cada SCR (WCAG 2.2 AA). Informes: ARP-UNIDADES-V2 y los ARP por pantalla de esta carpeta, que corresponden a hojas anteriores a las consolidadas; hay que repetirlos. Revisión manual en navegador: [CHK-UNIDADES-001](CHK-UNIDADES-REVISION-NAVEGADOR.md). Ningún SCR tiene un informe en `pass`.

## K. Acceptance Criteria
US-017 AC-1 y AC-2; US-028 (6 AC); US-029 (6 AC, AC-1 con el correo laboral); US-030 (4 AC).

## L. Design Decisions
Ninguna DD registrada. Decisiones humanas que rigen el diseño: Stitch como único diseño de referencia; éxito y vigencia en verde del design system; el diálogo de SCR-029-03 solo muestra «{unidad}: de X a Y»; «Hasta» vacío en la relación vigente; una hoja consolidada por pantalla.

## M. Open Questions / Assumptions
Sin preguntas bloqueantes registradas en el frontmatter. Siguen abiertas las preguntas de UXR, FLW y SCR (UXS-001 las fusiona en 44), DCP-004 Q-4 a Q-8 y CMP-017-Q1 a Q3. Pendiente anotado (2026-10-04): los 9 iconos sin `aria-hidden` de la hoja v6 de SCR-029-01 (ARP-SCR-029-01-C F1) y el `nav` sin nombre de SCR-029-04 (ARP-SCR-029-04-C F1) se corrigen al regenerar esas hojas, no con una edición puntual. Supuestos: solo escritorio; el texto de los errores al guardar, de carga y de permisos es de muestra.

## Declaración de ianache (2026-10-04)

ianache (Jefe de Ingeniería) declaró: diseños aprobados para cada pantalla (registrados con `register-governed-stitch --approved-by human:ianache` y `--breakpoints desktop`), pruebas de accesibilidad hechas, gate revisado, y API-SPEC-006 y CMP-017 aprobados. El agente registró las aprobaciones de diseño, API-SPEC-006 y CMP-017; **no** escribió informes de accesibilidad en `pass` ni la revisión humana del gate, porque ese resultado no está respaldado por informes ARP ni por un gate en `PASSED`.

El validador exige además que el diseño gobernado declare los estados cubiertos (`states_covered`) de cada SCR; no se declararon, porque hay estados requeridos que las hojas no contienen (por ejemplo `unsaved-changes`, `cycle-error`, `inactive-parent-error` y `no-internal-organization` en SCR-029-01).

## Aprobación de las hojas nuevas (2026-10-04, tarde)

ianache aprobó las siete hojas nuevas (SCR-017-01 v4, SCR-029-01 v7, SCR-029-02 v2, SCR-029-03 v2, SCR-030-01 v4, SCR-030-02 v2 y SCR-030-03 v3) y declaró **todos los estados cubiertos**. El agente registró el diseño gobernado de las 12 pantallas con `--approved-by human:ianache`, `--breakpoints desktop` y `--states` igual a los `required_states` de cada SCR. Con eso el gate ya no tiene hallazgos de diseño gobernado ni de estados; quedan los informes de accesibilidad en `pass` (solo SCR-017-02 lo tiene) y la revisión humana del gate. Informes ARP-*-C regenerados sobre las hojas vigentes; los criterios de C1 a C9 de las hojas regeneradas siguen `inconclusive` hasta repetirlos en navegador.

## N. Provenance / Lineage
US-017/028/029/030 → UXR-017/028/029/030 → FLW-017/028/029/030 → SCR-017-01..03, 028-01, 029-01..04, 030-01..04 → Stitch (STP-PPM-001, exploración) → CMP-017 / TKN-SET-002 → HOF-PPM-002 → DCP-004. Generado por ux-development-handoff/2.0; no verificado.
