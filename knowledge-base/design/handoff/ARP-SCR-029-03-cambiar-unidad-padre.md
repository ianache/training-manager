---
id: ARP-SCR-029-03
type: Accessibility Report
title: "ARP-SCR-029-03 — Revisión de accesibilidad: Cambiar unidad padre (HTML Stitch)"
description: "Revisión estática WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-029-03, en tres hojas (estado A; variantes B y C; variantes D, E y F). Resultado fail; borrador, sin verificación humana."
tags:
- ux-ui
- accessibility
- party
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T21:00:00-05:00'
sources:
- id: scr-029
  resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
- id: flw-029
  resource: /knowledge-base/design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md
- id: gen-029
  resource: /knowledge-base/design/generations/GEN-029-stitch-registrar-y-editar-unidades-organizacionales.md
- id: stitch-html-a
  resource: stitch:projects/13050549605434273903/screens/24e8c918d78d4db1ab9bc8a6a081e4db
- id: stitch-html-bc
  resource: stitch:projects/13050549605434273903/screens/9571f3a48bc840fb98e9f8a7634ab050
- id: stitch-html-def
  resource: stitch:projects/13050549605434273903/screens/a5558fd6fa2943e3a3fcafb0817db4e1
a11y_review:
  screen: SCR-029-03
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, focus-trap, error-announcement]
  counts: {pass: 7, fail: 5, inconclusive: 5}
---

# ARP-SCR-029-03 — Cambiar unidad padre

**Método.** Análisis estático de tres HTML de Stitch: **A** estado predeterminado (10 561 bytes), **B/C** ciclo y padre inactivo (19 426) y **D/E/F** resumen, error y éxito (20 333). Contraste calculado con los tokens de «Comsatel Styled». No se ejecutó en navegador. Las afirmaciones de Stitch sobre accesibilidad no cuentan como evidencia.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | **fail** | Iconos como ligaduras de texto (A: 12 `material-symbols`, 0 `aria-hidden`; B/C: 18, 0; D/E/F: 13, 1 `aria-hidden` que es del fondo atenuado). |
| 1.3.1 Información y relaciones | **fail** | A: 2 `label for`; B/C: 4; **D/E/F: 0** (los campos de las variantes E y F no tienen etiqueta ligada). Los pares de «solo lectura» son `div`. |
| 1.4.1 Uso del color | pass | Los errores llevan icono y texto además de borde rojo; el badge de vigencia lleva icono y texto. |
| 1.4.3 Contraste (texto) | pass | #2b1613/#fff8f6 = 16.31; #603e39/#fff8f6 = 8.91; blanco/#bc0100 = 6.68; error #93000a/#ffdad6 = 7.24. |
| 1.4.11 Contraste no textual | pass | Borde de campo #956d67/#fff = 4.51; anillo de foco #0059ba = 6.69. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | inconclusive | Requiere navegador. |
| 2.1.1 Teclado | pass | Controles nativos (`input`, `button`). El selector se evalúa en 4.1.2. |
| 2.1.2 / `focus-trap` (diálogo D) | inconclusive | Sin scripts: no hay evidencia de foco atrapado ni de Escape. |
| 2.4.3 Orden del foco | inconclusive | Sin scripts; depende de la implementación. |
| 2.4.7 Foco visible | pass | `focus:ring` en los controles de A y B/C; en D/E/F `focus:ring-1` (grosor menor, sin medir). |
| 2.5.8 Tamaño de objetivo | inconclusive | Sin medición. |
| 3.1.1 Idioma | pass | `lang="es"`. |
| 3.3.1 Identificación del error | **fail** | B/C: el mensaje no se asocia al campo (`aria-invalid`: 0, `aria-describedby`: 0). |
| 4.1.2 Nombre, función, valor | **fail** | El diálogo de la variante D es un `div` sin `role="dialog"`, `aria-modal` ni nombre accesible. En A el selector aparece como `combobox` (1 mención) pero sin evidencia de `aria-expanded`/`listbox` en B/C. |
| 4.1.3 Mensajes de estado / `error-announcement` | **fail** | B/C, E: 0 `role="alert"` y 0 `aria-live`; el error al guardar y el éxito no se anunciarían. |

## Hallazgos fail

- **F1 (1.1.1)** — SCR-029-03, hojas A, B/C y D/E/F. Evidencia: ligaduras sin `aria-hidden`.
- **F2 (1.3.1)** — Hoja D/E/F. Evidencia: 0 `label for`; los campos de E y F no tienen etiqueta.
- **F3 (3.3.1)** — Hoja B/C. Evidencia: errores de ciclo y padre inactivo sin asociación al campo.
- **F4 (4.1.2)** — Hoja D/E/F. Evidencia: diálogo sin rol ni nombre.
- **F5 (4.1.3)** — Hojas B/C y D/E/F. Evidencia: sin `role="alert"`/`aria-live` en errores y éxito.

## Notas de revisión crítica (no son criterios WCAG)

- Las hojas B/C y D/E/F **añaden «Soporte» y «Ajustes»** a la barra lateral, «Gestión Operativa / Comsatel Portal», rótulos «Estado 01/02» y subtítulos como «Validación de relación recursiva»: contenido inventado, fuera del SCR.
- La hoja D/E/F cambia el texto del diálogo («¿Deseas cambiar…?», «Fecha desde: 03/10/2026») y usa «Activo desde» en la vista de éxito; el SCR solo pide el resumen «de {padre actual} a {padre nuevo}» (SCR-029-Q6).
- En la hoja A, las opciones del selector llevan la insignia «Activa» (no pedida; coherente con BR-PTY-25 pero no especificada).
- B/C usa un campo con valores («Pruebas de Rendimiento», «Operaciones Históricas») que no existen en el SCR.

## Preguntas abiertas

- ¿Foco atrapado, foco inicial y Escape en el diálogo de resumen? Requiere navegador o implementación.
- ¿La fecha desde puede ser pasada o futura? (SCR-029-Q2) Afecta a su validación y a su mensaje.

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Revisión humana pendiente.
