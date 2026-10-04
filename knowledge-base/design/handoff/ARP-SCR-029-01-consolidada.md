---
id: ARP-SCR-029-01-C
type: Accessibility Report
title: "ARP-SCR-029-01-C — Revisión de accesibilidad: Registrar unidad (hoja vigente de Stitch)"
description: "Revisión estática WCAG 2.2 AA de la hoja vigente de Stitch para SCR-029-01. Resultado pass; borrador, sin verificación humana en navegador de esta versión."
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
  resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
- id: flw
  resource: /knowledge-base/design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/88756f6053b14af6b7237ffbcd5b43f4
a11y_review:
  screen: SCR-029-01
  target: html
  result: pass
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 13, fail: 0, inconclusive: 0}
---

# ARP-SCR-029-01-C — Registrar unidad

**Método.** Análisis estático del HTML de la hoja vigente `88756f6053b14af6b7237ffbcd5b43f4` (52778 bytes), descargado de Stitch el 2026-10-04: etiquetas, atributos ARIA, tablas, controles y contraste por clases. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. Los criterios cubiertos por C1 a C9 de CHK-UNIDADES-001 los aprobó ianache en navegador el 2026-10-04 y confirmó que aplican igual a las hojas regeneradas (no los ejecutó el agente). Esta revisión sustituye a los ARP anteriores de esta pantalla.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | 0 img sin alt. |
| 1.3.1 Etiquetas de los campos | pass | 28 controles, 0 sin etiqueta enlazada ni aria-label. |
| 1.3.1 Landmarks | pass | 1 nav, 1 con aria-label; 1 aria-current. |
| 3.3.1 Identificación del error | pass | 4 aria-invalid y 4 aria-describedby. |
| 4.1.3 Mensajes de estado | pass | 6 role=alert, 0 role=status, 0 aria-busy. |
| 3.3.2 Etiquetas o instrucciones (obligatorio) | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C9, 2026-10-04). Análisis estático: 28 campos con required o aria-required. |
| 4.1.2 Diálogo | pass | 1 role=dialog y 1 aria-modal con aria-labelledby. Aceptado por ianache (2026-10-04): el foco atrapado, Escape y el retorno del foco no se pueden demostrar en una hoja estática y quedan como obligación de la implementación (DCP-004, DTC-029 y DTC-030). |
| 1.4.3 Contraste (texto) | pass | 2 pares calculados por clases y config de Tailwind; ninguno bajo 4.5:1 (se excluyen ligaduras de iconos, separadores decorativos y controles deshabilitados). Cálculo estático sin hover/focus, degradados ni imágenes. |
| 2.4.7 Foco visible | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C3, 2026-10-04). Análisis estático: 127 clases focus:ring/outline y 40 outline-none. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C4, C5 y C6, 2026-10-04). Análisis estático: Requiere navegador. |
| 2.5.8 Tamaño de objetivo | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C7, 2026-10-04). Análisis estático: Sin medición. |
| 2.1.1 Teclado / 2.4.3 Orden del foco / foco inicial | pass | Aprobado por ianache en navegador (CHK-UNIDADES-001 C1 y C2, 2026-10-04). Análisis estático: Hoja con 1 bloque(s) de script; el comportamiento real no se evaluó. |
| 3.1.1 Idioma / 2.4.1 Bloques / 2.4.2 Título | pass | lang es: True; main: True; h1: 1. |

## Hallazgos fail

- Ninguno detectado en el análisis estático.

## Resultado

`pass`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; se cumple. Revisión humana pendiente.
