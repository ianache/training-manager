---
id: ARP-SCR-017-03
type: Accessibility Report
title: ARP-SCR-017-03 — Revisión de accesibilidad: Acceso no autorizado (HTML Stitch)
description: Revisión estática WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-017-03. Resultado fail; borrador, sin verificación humana.
tags:
- ux-ui
- accessibility
- party
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T18:00:00-05:00'
sources:
- id: scr-017
  resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
- id: flw-017
  resource: /knowledge-base/design/user-flows/FLW-017-registrar-la-organizacion-interna.md
- id: gen-017
  resource: /knowledge-base/design/generations/GEN-017-stitch-registrar-la-organizacion-interna.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/a4a8d03623454c779678750c37e106bd
a11y_review:
  screen: SCR-017-03
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 15, fail: 1, inconclusive: 4}
---

# ARP-SCR-017-03 — Acceso no autorizado

**Método.** Análisis estático del HTML de Stitch (descargado a `C:\temp\arp017\s03.html`) y cálculo de contraste con los colores del propio HTML. No se ejecutó en navegador ni se examinó la captura. Lo afirmado por Stitch sobre sí mismo no se usa como evidencia. Estado `draft`; revisión humana pendiente; nunca `verified`.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | pass | Los SVG (logo, usuario, candado, salida) llevan `aria-hidden="true"`; no hay ligaduras de texto de icono. |
| 1.3.1 Información y relaciones | pass | `header`, `main`, `h1`, `h2`, `p`. Observación: `h1` y `h2` repiten el texto «Acceso no autorizado». |
| 1.3.4 Orientación | pass | Sin bloqueo de orientación. |
| 1.4.3 Contraste (texto) | pass | on-surface #2b1613 / #fff8f6 = 16.31; on-surface-variant #5c413e / #fff = 9.21; título primario #bc0100 / #fff = 6.68. |
| 1.4.11 Contraste no textual | pass | Anillo de foco #0059ba / #fff = 6.69. El borde de la tarjeta (#e0cecb / #fff = 1.52) es decorativo, no identifica un control. |
| 1.4.10 Reflow (320 px) | inconclusive | Sin anchos fijos, pero la cabecera `flex` con título largo, usuario y botón no se midió sin navegador. |
| 1.4.4 Cambiar tamaño de texto (200 %) | inconclusive | Requiere navegador. |
| 1.4.12 Espaciado de texto | inconclusive | Requiere navegador. |
| 2.1.1 Teclado | pass | Único control: `<button type="button">` nativo. |
| 2.4.1 Evitar bloques | pass | Landmarks `header` y `main` (no hay skip link). |
| 2.4.2 Título | pass | `<title>` descriptivo (incluye el ID interno SCR-017-03). |
| 2.4.3 Orden del foco | pass | Orden DOM lógico, sin `tabindex` positivo. |
| 2.4.6 Encabezados y etiquetas | pass | `h1` descriptivo. |
| 2.4.7 Foco visible | pass | `focus:ring-2 focus:ring-tertiary` en «Cerrar sesión». |
| 2.4.11 Foco no oculto | pass | Página corta, sin contenido que desplace bajo la cabecera sticky. |
| 2.5.8 Tamaño de objetivo | pass | «Cerrar sesión»: 20 px de línea + `py-1` = 28 px, mayor que 24 px. |
| 3.1.1 Idioma | pass | `lang="es"`. |
| 4.1.2 Nombre, rol, valor | pass | Nombre accesible «Cerrar sesión» (icono oculto). |
| 4.1.3 Mensajes de estado / `error-announcement` | **fail** | El mensaje «No tienes permiso para gestionar la organización interna.» está en un `div` y un `p` sin `role="alert"`, `role="status"` ni `aria-live`. El SCR exige alert/estado de página. |
| Gestión de foco al mensaje (a11y del SCR: «foco movido al mensaje») | inconclusive | No hay `tabindex="-1"` ni script; si el foco se mueve depende de la implementación. |

## Hallazgos fail

- **F1 (4.1.3, `error-announcement`)** — SCR-017-03. Evidencia: el bloque del mensaje no tiene ningún `role` ni `aria-live`. El SCR lista «alert/estado de página» con «foco movido al mensaje». Propuesta, sin decidir producto: ofrecer el mensaje con `role="alert"` o mover el foco al encabezado (`tabindex="-1"`).

## Preguntas abiertas

- SCR-017-Q4 (heredada): sin acción de salida ni «Solicitar acceso». Solo «Cerrar sesión» es operable, de modo que no hay camino de vuelta. No es un fallo WCAG por sí mismo; la decisión es de producto.
- ¿Se movió el foco al mensaje en la implementación real? Requiere navegador o lector de pantalla.
- ¿Se cumple reflow a 320 px y zoom 200 %? Requiere navegador.

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Revisión humana pendiente.
