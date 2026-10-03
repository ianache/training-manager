---
id: ARP-SCR-017-01
type: Accessibility Report
title: ARP-SCR-017-01 — Revisión de accesibilidad: Organización interna (HTML Stitch)
description: Revisión estática WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-017-01 (estados A a E). Resultado fail; borrador, sin verificación humana.
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
  resource: stitch:projects/13050549605434273903/screens/ebe76a85620f4cb590f9f626d8e428ca
a11y_review:
  screen: SCR-017-01
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 14, fail: 4, inconclusive: 3}
---

# ARP-SCR-017-01 — Organización interna

**Método.** Análisis estático del HTML de Stitch (`C:\temp\arp017\s01.html`) y contraste calculado con los colores de su configuración Tailwind. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. El HTML apila los estados A (vacío), B (registrada), C (cargando), D (error de carga) y E (sin permiso) en una sola página. Estado `draft`; nunca `verified`.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | **fail** | Los iconos son `<span class="material-symbols-outlined">nombre</span>` sin `aria-hidden`. Si no se oculta, el texto de la ligadura se expone: «check_circle Vigente desde 03/10/2026», «refresh Reintentar», «add_business Registrar organización interna», «logout Cerrar sesión», «domain_disabled», «lock», «notifications». |
| 1.3.1 Información y relaciones | **fail** | Los pares etiqueta/valor (Razón social, RUC, País emisor) son `div` sueltos, no una lista de descripción (`dl/dt/dd`), que el SCR exige («lista de descripción semántica»). Los títulos de estado A a E son `span`, no encabezados. |
| 1.3.4 Orientación | pass | Sin bloqueo. |
| 1.4.1 Uso del color | pass | El badge de vigencia lleva icono y texto; el error D lleva icono, texto y borde de 2 px. |
| 1.4.3 Contraste (texto) | pass | on-surface / fondo 16.31; on-surface-variant #5d3f3b / #fff0ee = 8.46; blanco / botón primario #bc0100 = 6.68 (hover #930300 = 9.32); primario / blanco = 6.68; enlace #0059ba / #fff = 6.69; badge #065f46 / #ecfdf5 = 7.29; «Reintentar» #bc0100 / hover #ffe9e6 = 5.74. |
| 1.4.11 Contraste no textual | pass | Anillo de foco #0059ba = 6.69 / 9.22. Los bordes de tarjeta (#e6bdb6 / #fff = 1.70) son decorativos. No hay campos. |
| 1.4.10 Reflow (320 px) | **fail** | `<body ... min-w-[1440px]>`: la página exige 1440 px, así que a 320 px hay desplazamiento horizontal en dos dimensiones. Nota: el SCR declara solo escritorio (SCR-017-Q6); si producto acepta ese alcance, la decisión es humana. |
| 1.4.4 Cambiar tamaño de texto | inconclusive | Requiere navegador (con `min-w` fijo es probable que haya desplazamiento). |
| 1.4.12 Espaciado de texto | inconclusive | Requiere navegador. |
| 2.1.1 Teclado | pass | Solo `a` y `button` nativos (los `href="#"` son marcadores de posición). |
| 2.4.1 Evitar bloques | pass | Landmarks `header`, `aside`, `nav`, `main` (sin skip link; el `nav` no tiene `aria-label`). |
| 2.4.2 Título | pass | «Organización interna - Plataforma de Gestión de Formación». |
| 2.4.3 Orden del foco | pass | El orden DOM es cabecera, lateral, contenido; no hay `tabindex`. |
| 2.4.6 Encabezados y etiquetas | pass | `h1` «Organización interna» y `h2` en B. Los títulos de estado se tratan en 1.3.1. |
| 2.4.7 Foco visible | pass | `focus:ring-2 ring-tertiary ring-offset-2` en botones y enlaces; «Soporte» y «Ajustes» conservan el contorno por defecto del navegador, pues no se suprime. |
| 2.4.11 Foco no oculto | pass | No hay cabecera sticky; el área central desplaza por sí misma. |
| 2.5.3 Etiqueta en el nombre | pass | El texto visible está contenido en el nombre; además el prefijo de ligadura se trata en 1.1.1. |
| 2.5.8 Tamaño de objetivo | pass | `min-h-[44px]` en «Registrar» y «Reintentar»; el enlace «Continuar a unidades» mide 28 px. |
| 3.1.1 Idioma | pass | `lang="es"`. |
| 4.1.3 Mensajes de estado / `error-announcement` | **fail** | D «No se pudo cargar la organización interna.» no tiene `role="alert"` ni `aria-live` (el SCR lo exige: «role alert, aria-live»). C «Cargando…» no tiene `role="status"` ni `aria-busy`. |
| Foco/orden tras cambio de estado (cargando a resultado/vacío) | inconclusive | No hay scripts; el comportamiento depende de la implementación. |

## Hallazgos fail

- **F1 (1.1.1)** — SCR-017-01. Evidencia: ligaduras de Material Symbols como texto sin `aria-hidden` en todos los botones, enlaces y badges. Propuesta: marcar los iconos decorativos como ocultos.
- **F2 (1.3.1)** — Evidencia: datos como `div`, no `dl`. El inventario del SCR pide una lista de descripción.
- **F3 (1.4.10)** — Evidencia: `min-w-[1440px]` en `body`. Sujeto a la decisión de alcance SCR-017-Q6.
- **F4 (4.1.3)** — Evidencia: estados D y C sin rol ni región viva.

## Preguntas abiertas

- SCR-017-Q6: si «solo escritorio» exime de 1.4.10 es decisión de producto; WCAG 2.2 AA no lo exime.
- El estado E del HTML muestra solo «Sin permiso» con candado, sin el mensaje de SCR-017-03; ¿es una variante distinta o debe presentarse SCR-017-03? (SCR-017-Q4).
- ¿Se aplican zoom 200 % y espaciado de texto sin pérdida? Requiere navegador.
- ¿Dónde recibe el foco tras la carga (vacío o registrada)? Sin evidencia.

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Revisión humana pendiente.
