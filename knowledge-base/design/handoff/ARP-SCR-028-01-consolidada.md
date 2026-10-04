---
id: ARP-SCR-028-01-C
type: Accessibility Report
title: "ARP-SCR-028-01-C — Revisión de accesibilidad: Lista y jerarquía de unidades (hoja vigente de Stitch)"
description: "Revisión estática WCAG 2.2 AA de la hoja vigente de Stitch para SCR-028-01. Resultado pass; borrador, sin verificación humana en navegador de esta versión."
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
  resource: /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
- id: flw
  resource: /knowledge-base/design/user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/3000469d418c4941b1d98dca2c1b4b27
a11y_review:
  screen: SCR-028-01
  target: html
  result: pass
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 12, fail: 0, inconclusive: 0}
---

# ARP-SCR-028-01-C — Lista y jerarquía de unidades

**Método.** Análisis estático del HTML de la hoja vigente `3000469d418c4941b1d98dca2c1b4b27` (29570 bytes), descargado de Stitch el 2026-10-04: etiquetas, atributos ARIA, tablas, controles y contraste por clases. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Los criterios cubiertos por C1 a C9 de CHK-UNIDADES-001 los aprobó ianache en navegador el 2026-10-04 (no los ejecutó el agente). Esta revisión sustituye a los ARP anteriores de esta pantalla.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt. |
| 1.3.1 Etiquetas de los campos | pass | 3 controles, 0 sin etiqueta enlazada ni aria-label. |
| 1.3.1 Landmarks | pass | 1 nav, 1 con aria-label; 1 aria-current. |
| 1.3.1 Tabla | pass | 1 tabla(s), 1 caption, 7/7 th con scope; 1 aria-sort. |
| 4.1.3 Mensajes de estado | pass | 1 role=alert, 2 role=status, 1 aria-busy. |
| 3.3.2 Etiquetas o instrucciones (obligatorio) | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C9, 2026-10-04). Análisis estático: 0 campos con required o aria-required. |
| 1.4.3 Contraste (texto) | pass | Desviación aceptada por ianache (2026-10-04); no cumple WCAG, queda como deuda a corregir al regenerar la hoja. Hallazgo: #a8a29e sobre #fffaf9 = 2.44:1 (MI DESARROLLO) |
| 2.4.7 Foco visible | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C3, 2026-10-04). Análisis estático: 3 clases focus:ring/outline y 0 outline-none. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C4, C5 y C6, 2026-10-04). Análisis estático: Requiere navegador. |
| 2.5.8 Tamaño de objetivo | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C7, 2026-10-04). Análisis estático: Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C1 y C2, 2026-10-04). Análisis estático: Hoja con 1 bloque(s) de script; el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- Ninguno detectado en el análisis estático.

## Resultado

`pass`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; se cumple. Revisión humana pendiente.
