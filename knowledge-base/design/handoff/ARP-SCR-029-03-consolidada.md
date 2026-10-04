---
id: ARP-SCR-029-03-C
type: Accessibility Report
title: "ARP-SCR-029-03-C — Revisión de accesibilidad: Cambiar unidad padre (hoja consolidada de Stitch)"
description: "Revisión estática WCAG 2.2 AA de la hoja consolidada de Stitch para SCR-029-03. Resultado inconclusive; borrador, sin verificación humana ni prueba en navegador."
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
  resource: stitch:projects/13050549605434273903/screens/c53d12f7720c49e4a73c193b62b517a5
a11y_review:
  screen: SCR-029-03
  target: html
  result: inconclusive
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 6, fail: 0, inconclusive: 7}
---

# ARP-SCR-029-03-C — Cambiar unidad padre

**Método.** Análisis estático del HTML de la hoja consolidada `c53d12f7720c49e4a73c193b62b517a5` (34734 bytes), descargado de Stitch el 2026-10-04: conteo de etiquetas, atributos ARIA, tablas y controles. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Esta revisión sustituye a los ARP anteriores de esta pantalla, que corresponden a hojas por estado ya reemplazadas en el DTM.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt; no se detectaron iconos como ligaduras de texto (0 material-symbols). |
| 1.3.1 Etiquetas de los campos | pass | 8 controles, 0 sin etiqueta enlazada ni aria-label. |
| 1.3.1 Landmarks | pass | 2 nav, 2 con aria-label; 2 aria-current. |
| 3.3.1 Identificación del error | pass | 2 aria-invalid y 2 aria-describedby. |
| 4.1.3 Mensajes de estado | pass | 3 role=alert, 1 role=status, 0 aria-busy, 0 aria-live. |
| 3.3.2 Etiquetas o instrucciones (obligatorio) | **inconclusive** | Los obligatorios se marcan con «*» y 0 campos llevan required o aria-required; no se evaluó la leyenda del asterisco. |
| 4.1.2 Diálogo | **inconclusive** | 1 role=dialog con 1 aria-modal; el nombre accesible y el foco atrapado no se verifican sin navegador. |
| 1.4.3 Contraste (texto) | **inconclusive** | No se calculó el contraste de los colores de esta hoja. |
| 2.4.7 Foco visible | **inconclusive** | 0 clases focus:ring/outline y 0 outline-none; sin navegador no se confirma el indicador de foco. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | **inconclusive** | Requiere navegador. |
| 2.5.8 Tamaño de objetivo | **inconclusive** | Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | **inconclusive** | 2 bloque(s) de script (selector de estados de la hoja); el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- Ninguno detectado en el análisis estático.

## Resultado

`inconclusive`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Lo `inconclusive` depende de la revisión manual en navegador (CHK-UNIDADES-001). Revisión humana pendiente.
