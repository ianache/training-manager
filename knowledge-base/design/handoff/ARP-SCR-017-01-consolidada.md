---
id: ARP-SCR-017-01-C
type: Accessibility Report
title: "ARP-SCR-017-01-C — Revisión de accesibilidad: Organización interna (hoja vigente de Stitch)"
description: "Revisión estática WCAG 2.2 AA de la hoja vigente de Stitch para SCR-017-01. Resultado pass; borrador, sin verificación humana en navegador de esta versión."
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
  resource: stitch:projects/13050549605434273903/screens/7f3c5875bd8246738b4506470dc89daa
a11y_review:
  screen: SCR-017-01
  target: html
  result: pass
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 10, fail: 0, inconclusive: 0}
---

# ARP-SCR-017-01-C — Organización interna

**Método.** Análisis estático del HTML de la hoja vigente `7f3c5875bd8246738b4506470dc89daa` (18322 bytes), descargado de Stitch el 2026-10-04: etiquetas, atributos ARIA, tablas, controles y contraste por clases. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Los criterios cubiertos por C1 a C9 de CHK-UNIDADES-001 los aprobó ianache en navegador el 2026-10-04 y confirmó que aplican igual a las hojas regeneradas (no los ejecutó el agente). Esta revisión sustituye a los ARP anteriores de esta pantalla.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt. |
| 1.3.1 Etiquetas de los campos | pass | 0 controles, 0 sin etiqueta enlazada ni aria-label. |
| 1.3.1 Landmarks | pass | 2 nav, 2 con aria-label; 2 aria-current. |
| 4.1.3 Mensajes de estado | pass | 2 role=alert, 1 role=status, 1 aria-busy. |
| 1.4.3 Contraste (texto) | pass | 10 pares calculados por clases y config de Tailwind; ninguno bajo 4.5:1 (se excluyen ligaduras de iconos, separadores decorativos y controles deshabilitados). Cálculo estático sin hover/focus, degradados ni imágenes. |
| 2.4.7 Foco visible | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C3, 2026-10-04; confirmó que C1 a C9 aplican igual a las hojas nuevas). Análisis estático: 20 clases focus:ring/outline y 6 outline-none. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C4, C5 y C6, 2026-10-04; confirmó que C1 a C9 aplican igual a las hojas nuevas). Análisis estático: Requiere navegador. |
| 2.5.8 Tamaño de objetivo | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C7, 2026-10-04; confirmó que C1 a C9 aplican igual a las hojas nuevas). Análisis estático: Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C1 y C2, 2026-10-04; confirmó que C1 a C9 aplican igual a las hojas nuevas). Análisis estático: Hoja con 1 bloque(s) de script; el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- Ninguno detectado en el análisis estático.

## Resultado

`pass`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; se cumple. Revisión humana pendiente.
