---
id: ARP-SCR-029-01-C
type: Accessibility Report
title: "ARP-SCR-029-01-C — Revisión de accesibilidad: Registrar unidad (hoja consolidada de Stitch)"
description: "Revisión estática WCAG 2.2 AA de la hoja consolidada de Stitch para SCR-029-01. Resultado fail; borrador, sin verificación humana ni prueba en navegador."
tags:
- ux-ui
- accessibility
- party
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-04T13:00:00-05:00'
sources:
- id: scr
  resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
- id: flw
  resource: /knowledge-base/design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/f60d9b006fc643d0b0120e95ef04e9a6
a11y_review:
  screen: SCR-029-01
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 11, fail: 1, inconclusive: 1}
---

# ARP-SCR-029-01-C — Registrar unidad

**Método.** Análisis estático del HTML de la hoja consolidada `f60d9b006fc643d0b0120e95ef04e9a6` (38341 bytes), descargado de Stitch el 2026-10-04: conteo de etiquetas, atributos ARIA, tablas y controles. Los criterios cubiertos por las pruebas comunes C1 a C9 de CHK-UNIDADES-001 los aprobó ianache en navegador el 2026-10-04 (no los ejecutó el agente); las pruebas específicas por pantalla no se han registrado. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Esta revisión sustituye a los ARP anteriores de esta pantalla, que corresponden a hojas por estado ya reemplazadas en el DTM.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt; 29 iconos material-symbols, 20 con aria-hidden. |
| 1.1.1 Iconos decorativos | **fail** | 9 iconos sin aria-hidden: un lector de pantalla leería el nombre de la ligadura junto al texto. |
| 1.3.1 Etiquetas de los campos | pass | 20 controles, 0 sin etiqueta enlazada ni aria-label. |
| 1.3.1 Landmarks | pass | 3 nav, 3 con aria-label; 2 aria-current. |
| 3.3.1 Identificación del error | pass | 2 aria-invalid y 2 aria-describedby. |
| 4.1.3 Mensajes de estado | pass | 3 role=alert, 1 role=status, 2 aria-busy, 1 aria-live. |
| 3.3.2 Etiquetas o instrucciones (obligatorio) | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C9, 2026-10-04). Análisis estático: Los obligatorios se marcan con «*» y 20 campos llevan required o aria-required; no se evaluó la leyenda del asterisco. |
| 1.4.3 Contraste (texto) | **inconclusive** | No se calculó el contraste de los colores de esta hoja. |
| 2.4.7 Foco visible | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C3, 2026-10-04). Análisis estático: 48 clases focus:ring/outline y 16 outline-none; sin navegador no se confirma el indicador de foco. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C4, C5 y C6, 2026-10-04). Análisis estático: Requiere navegador. |
| 2.5.8 Tamaño de objetivo | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C7, 2026-10-04). Análisis estático: Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C1 y C2, 2026-10-04). Análisis estático: 2 bloque(s) de script (selector de estados de la hoja); el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- **F1 (1.1.1 Iconos decorativos)** — SCR-029-01. Evidencia: 9 iconos sin aria-hidden: un lector de pantalla leería el nombre de la ligadura junto al texto.

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Lo `inconclusive` depende de la revisión manual en navegador (CHK-UNIDADES-001). Revisión humana pendiente.
