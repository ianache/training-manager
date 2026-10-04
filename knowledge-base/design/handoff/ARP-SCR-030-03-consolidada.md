---
id: ARP-SCR-030-03-C
type: Accessibility Report
title: "ARP-SCR-030-03-C — Revisión de accesibilidad: Reactivar una unidad (hoja vigente de Stitch)"
description: "Revisión estática WCAG 2.2 AA de la hoja vigente de Stitch para SCR-030-03. Resultado inconclusive; borrador, sin verificación humana en navegador de esta versión."
tags:
- ux-ui
- accessibility
- party
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-04T16:00:00-05:00'
sources:
- id: scr
  resource: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: flw
  resource: /knowledge-base/design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/955dec31fce647189e2e8abe59e2e36b
a11y_review:
  screen: SCR-030-03
  target: html
  result: inconclusive
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 8, fail: 0, inconclusive: 6}
---

# ARP-SCR-030-03-C — Reactivar una unidad

**Método.** Análisis estático del HTML de la hoja vigente `955dec31fce647189e2e8abe59e2e36b` (29326 bytes), descargado de Stitch el 2026-10-04: etiquetas, atributos ARIA, tablas, controles y contraste por clases. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Los criterios cubiertos por C1 a C9 de CHK-UNIDADES-001 los aprobó ianache en navegador el 2026-10-04 sobre las hojas consolidadas de entonces; **esta hoja es posterior o distinta**, así que esos criterios quedan `inconclusive` hasta que se repitan sobre ella. Esta revisión sustituye a los ARP anteriores de esta pantalla.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt. |
| 1.1.1 Iconos decorativos | pass | Desviación aceptada por ianache (2026-10-04); no cumple WCAG, queda como deuda a corregir al regenerar la hoja. Hallazgo: 1 de 25 iconos material-symbols sin aria-hidden. |
| 1.3.1 Etiquetas de los campos | pass | 5 controles, 0 sin etiqueta enlazada ni aria-label. |
| 1.3.1 Landmarks | pass | 3 nav, 3 con aria-label; 2 aria-current. |
| 3.3.1 Identificación del error | pass | 1 aria-invalid y 1 aria-describedby. |
| 4.1.3 Mensajes de estado | pass | 3 role=alert, 0 role=status, 0 aria-busy. |
| 3.3.2 Etiquetas o instrucciones (obligatorio) | **inconclusive** | 5 campos con required o aria-required. |
| 4.1.2 Diálogo | **inconclusive** | 5 role=dialog, 5 aria-modal; el nombre accesible y el foco atrapado requieren navegador. |
| 1.4.3 Contraste (texto) | pass | 17 pares calculados por clases y config de Tailwind; ninguno bajo 4.5:1 (se excluyen ligaduras de iconos, separadores decorativos y controles deshabilitados). Cálculo estático sin hover/focus, degradados ni imágenes. |
| 2.4.7 Foco visible | **inconclusive** | 8 clases focus:ring/outline y 4 outline-none. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | **inconclusive** | Requiere navegador. |
| 2.5.8 Tamaño de objetivo | **inconclusive** | Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | **inconclusive** | Hoja con 1 bloque(s) de script; el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- Ninguno detectado en el análisis estático.

## Resultado

`inconclusive`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Lo `inconclusive` depende de la revisión en navegador (CHK-UNIDADES-001). Revisión humana pendiente.
