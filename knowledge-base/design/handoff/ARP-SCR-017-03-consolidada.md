---
id: ARP-SCR-017-03-C
type: Accessibility Report
title: "ARP-SCR-017-03-C — Revisión de accesibilidad: Acceso no autorizado (hoja vigente de Stitch)"
description: "Revisión estática WCAG 2.2 AA de la hoja vigente de Stitch para SCR-017-03. Resultado inconclusive; borrador, sin verificación humana en navegador de esta versión."
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
  resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
- id: flw
  resource: /knowledge-base/design/user-flows/FLW-017-registrar-la-organizacion-interna.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/08a98db688474629b3ef7a32c9d751ca
a11y_review:
  screen: SCR-017-03
  target: html
  result: inconclusive
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 6, fail: 0, inconclusive: 4}
---

# ARP-SCR-017-03-C — Acceso no autorizado

**Método.** Análisis estático del HTML de la hoja vigente `08a98db688474629b3ef7a32c9d751ca` (7131 bytes), descargado de Stitch el 2026-10-04: etiquetas, atributos ARIA, tablas, controles y contraste por clases. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Los criterios cubiertos por C1 a C9 de CHK-UNIDADES-001 los aprobó ianache en navegador el 2026-10-04 sobre las hojas consolidadas de entonces; **esta hoja es posterior o distinta**, así que esos criterios quedan `inconclusive` hasta que se repitan sobre ella. Esta revisión sustituye a los ARP anteriores de esta pantalla.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt. |
| 1.3.1 Etiquetas de los campos | pass | 0 controles, 0 sin etiqueta enlazada ni aria-label. |
| 1.3.1 Landmarks | pass | 1 nav, 1 con aria-label; 0 aria-current. |
| 4.1.3 Mensajes de estado | pass | 1 role=alert, 0 role=status, 0 aria-busy. |
| 1.4.3 Contraste (texto) | pass | Desviación aceptada por ianache (2026-10-04); no cumple WCAG, queda como deuda a corregir al regenerar la hoja. Hallazgo: #8c6f6a sobre #fff8f7 = 4.36:1 (MI DESARROLLO) |
| 2.4.7 Foco visible | **inconclusive** | 16 clases focus:ring/outline y 0 outline-none. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | **inconclusive** | Requiere navegador. |
| 2.5.8 Tamaño de objetivo | **inconclusive** | Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | **inconclusive** | Hoja con 2 bloque(s) de script; el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- Ninguno detectado en el análisis estático.

## Resultado

`inconclusive`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Lo `inconclusive` depende de la revisión en navegador (CHK-UNIDADES-001). Revisión humana pendiente.
