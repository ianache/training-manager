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
  resource: stitch:projects/13050549605434273903/screens/fc85e64ad27c4b84b2ce40186a69da97
a11y_review:
  screen: SCR-029-01
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 3, fail: 4, inconclusive: 6}
---

# ARP-SCR-029-01-C — Registrar unidad

**Método.** Análisis estático del HTML de la hoja consolidada `fc85e64ad27c4b84b2ce40186a69da97` (33460 bytes), descargado de Stitch el 2026-10-04: conteo de etiquetas, atributos ARIA, tablas y controles. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Esta revisión sustituye a los ARP anteriores de esta pantalla, que corresponden a hojas por estado ya reemplazadas en el DTM.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt; no se detectaron iconos como ligaduras de texto (0 material-symbols). |
| 1.3.1 / 4.1.2 Etiquetas de los campos | **fail** | 16 controles y 0 etiquetas enlazadas: cada label no tiene for ni envuelve el campo, y los campos no tienen id ni aria-label. El nombre accesible sería solo el placeholder. |
| 1.3.1 Landmarks | **fail** | 3 nav sin aria-label y 0 aria-current en las migas. |
| 1.4.11 Contraste no textual | **fail** | Los campos usan borde slate-300 (#cbd5e1) sobre blanco: 1.48:1, bajo el mínimo de 3:1 (el design system pide outline #916f69). La hoja usa la paleta slate de Tailwind y no los tokens de TKN-SET-002. |
| 3.3.1 Identificación del error | **fail** | 3 role=alert pero 0 aria-invalid y 0 aria-describedby: el mensaje no queda ligado al campo. |
| 4.1.3 Mensajes de estado | pass | 3 role=alert, 1 role=status, 0 aria-busy, 0 aria-live. |
| 3.3.2 Etiquetas o instrucciones (obligatorio) | **inconclusive** | Los obligatorios se marcan con «*» y 0 campos llevan required o aria-required; no se evaluó la leyenda del asterisco. |
| 1.4.3 Contraste (texto) | **inconclusive** | No se calculó el contraste de los colores de esta hoja. |
| 2.4.7 Foco visible | **inconclusive** | 24 clases focus:ring/outline y 12 outline-none; sin navegador no se confirma el indicador de foco. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | **inconclusive** | Requiere navegador. |
| 2.5.8 Tamaño de objetivo | **inconclusive** | Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | **inconclusive** | 1 bloque(s) de script (selector de estados de la hoja); el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- **F1 (1.3.1 / 4.1.2 Etiquetas de los campos)** — SCR-029-01. Evidencia: 16 controles y 0 etiquetas enlazadas: cada label no tiene for ni envuelve el campo, y los campos no tienen id ni aria-label. El nombre accesible sería solo el placeholder.
- **F2 (1.3.1 Landmarks)** — SCR-029-01. Evidencia: 3 nav sin aria-label y 0 aria-current en las migas.
- **F3 (1.4.11 Contraste no textual)** — SCR-029-01. Evidencia: Los campos usan borde slate-300 (#cbd5e1) sobre blanco: 1.48:1, bajo el mínimo de 3:1 (el design system pide outline #916f69). La hoja usa la paleta slate de Tailwind y no los tokens de TKN-SET-002.
- **F4 (3.3.1 Identificación del error)** — SCR-029-01. Evidencia: 3 role=alert pero 0 aria-invalid y 0 aria-describedby: el mensaje no queda ligado al campo.

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Lo `inconclusive` depende de la revisión manual en navegador (CHK-UNIDADES-001). Revisión humana pendiente.
