---
id: ARP-SCR-030-04
type: Accessibility Report
title: ARP-SCR-030-04 — Revisión de accesibilidad: Reactivación bloqueada por padre Inactivo (HTML Stitch)
description: Revisión estática WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-030-04 (estados A y B). Resultado fail; borrador, sin verificación humana.
tags:
- ux-ui
- accessibility
- party
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T21:00:00-05:00'
sources:
- id: scr-030
  resource: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: flw-030
  resource: /knowledge-base/design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: gen-030
  resource: /knowledge-base/design/generations/GEN-030-stitch-desactivar-y-reactivar-unidades-organizacionales.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/c647294ecb764bada0bb6a6ec1d5cd61
a11y_review:
  screen: SCR-030-04
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, focus-trap, error-announcement]
  counts: {pass: 9, fail: 1, inconclusive: 5}
---

# ARP-SCR-030-04 — Reactivación bloqueada por padre Inactivo

**Método.** Análisis estático del HTML de Stitch (11 163 bytes) y contraste calculado con los tokens de «Comsatel Styled». No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. El HTML apila el estado A (diálogo sobre la lista) y el B (sin permisos).

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | **fail** | 12 `<span class="material-symbols-outlined">` con el nombre de la ligadura como texto y 0 `aria-hidden`: se expondría «lock», «error», etc. junto al texto. |
| 1.3.1 Información y relaciones | pass | `h1`, `main` y `nav`; el diálogo tiene `aria-labelledby`. Los títulos de variante A/B no son encabezados (menor). |
| 1.4.1 Uso del color | pass | «Inactiva» y la alerta llevan icono y texto. |
| 1.4.3 Contraste (texto) | pass | blanco/#bc0100 = 6.68; #2b1613/#fff8f6 = 16.31; #0059ba/#fff = 6.69 (enlace al padre); #93000a/#ffdad6 = 7.24. |
| 1.4.11 Contraste no textual | pass | Borde de controles #956d67/#fff = 4.51; anillo de foco #0059ba. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | inconclusive | No hay `min-w` fijo, pero requiere navegador. |
| 2.1.1 Teclado | pass | Solo elementos nativos; `tabindex` aparece una vez (valor sin evaluar). |
| 2.1.2 / `focus-trap` | inconclusive | El HTML no incluye scripts: no hay evidencia de foco atrapado ni de Escape (el SCR lo exige). |
| 2.4.3 Orden del foco | inconclusive | Depende del comportamiento al abrir y cerrar el diálogo. |
| 2.4.7 Foco visible | pass | `focus:ring-2 focus:ring-tertiary` en los botones. |
| 2.5.8 Tamaño de objetivo | inconclusive | Sin medición en navegador. |
| 3.1.1 Idioma | pass | `lang="es"`. |
| 4.1.2 Nombre, función, valor | pass | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`. |
| 4.1.3 Mensajes de estado / `error-announcement` | pass | La alerta de padre Inactivo tiene `role="alert"` (2 apariciones). |
| Foco inicial en «Cerrar» y retorno al disparador | inconclusive | Sin scripts. |

## Hallazgos fail

- **F1 (1.1.1)** — SCR-030-04. Evidencia: ligaduras de Material Symbols como texto, sin `aria-hidden`. Propuesta (decisión de implementación): ocultar los iconos decorativos.

## Notas de revisión crítica (no son criterios WCAG)

- El HTML añade un rótulo «SCR-030-04 — Reactivación bloqueada por padre Inactivo» y «A / B»: anotaciones de lienzo, no UI.
- No se halló «Eliminar» ni «Borrar» (BR-PTY-21).
- El enlace al padre («Dirección Comercial») no se verificó como enlace funcional (`href`): destino abierto, FLW-030-Q3.

## Preguntas abiertas

- ¿Foco atrapado, foco inicial y Escape en el diálogo? Requiere navegador o la implementación.
- ¿Texto definitivo de la alerta? (SCR-030: «texto de muestra por validar»).

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Revisión humana pendiente.
