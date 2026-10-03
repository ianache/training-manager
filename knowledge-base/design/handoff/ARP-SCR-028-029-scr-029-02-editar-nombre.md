---
id: ARP-SCR-029-02
type: Accessibility Report
title: "ARP-SCR-029-02 — Accesibilidad de la exploración Stitch de SCR-029-02"
description: "Evaluación WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-029-02 (editar nombre de una unidad). Resultado: fail."
tags: [ux-ui, accessibility, wcag-2.2, scr-029, stitch-exploration]
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T18:00:00-05:00'
sources:
- id: scr
  resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
- id: gen
  resource: /knowledge-base/design/generations/GEN-029-stitch-registrar-y-editar-unidades-organizacionales.md
- id: html
  resource: "stitch:projects/13050549605434273903/screens/f497a2997e144bd29856800143c8fd1d (htmlCode, 438 líneas, descargado a C:\\temp\\arp028\\s2902.html)"
a11y_review:
  screen: SCR-029-02
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement, logical-focus-after-save]
---

# ARP-SCR-029-02 — Informe de accesibilidad

## Alcance y método

- **Objetivo:** HTML exploratorio de Stitch, variantes A (predeterminado), B (nombre vacío), C (nombre duplicado), D (error al guardar), E (nombre actualizado).
- **Método:** lectura estática del HTML y contraste con los hex reales del código. Sin navegador, sin lector de pantalla, sin captura. Lo que lo requiere es `inconclusive`.
- Lo que Stitch dice de su propio cumplimiento no se usó como evidencia.
- SCR-029-03/04 sin exploración: fuera de alcance.

## Resumen

| Criterio | Resultado |
|---|---|
| Error asociado al campo (3.3.1, 4.1.2: aria-describedby) | fail |
| Anuncio de errores y estados (SCR: error-announcement; 4.1.3) | fail |
| Campo obligatorio programático (SCR: aria-required; 3.3.2) | fail |
| Foco de campos de texto (2.4.7, 1.4.11) | fail |
| Página actual sin `aria-current`, migas sin nombre (1.3.1, 4.1.2) | fail |
| Reflow (1.4.10) | fail |
| `aria-invalid` en campos con error (3.3.1) | pass |
| Etiqueta ligada al campo (1.3.1, 3.3.2) | pass |
| Contraste de texto (1.4.3) | pass |
| Contraste del borde de campo y botón Cancelar (1.4.11) | pass |
| Foco visible de botones y enlaces (2.4.7) | pass |
| Tamaño de objetivo (2.5.8) | pass |
| Error no solo por color (1.4.1) | pass |
| Contexto de solo lectura (`dl`) (1.3.1) | pass |
| Idioma, título, encabezados | pass |
| Teclado en vivo, foco tras guardar, `unsaved-changes`, foco no oculto, zoom | inconclusive |

## Hallazgos (fail)

### F-01 — Mensajes de error sin `aria-describedby` (3.3.1, 4.1.2)
Variantes B y C: el input lleva `aria-invalid="true"` (correcto), pero el mensaje («Campo obligatorio (texto de muestra)», «Ya existe una unidad con este nombre bajo Ingeniería») es un `<div>`/`<span>` sin `id` y el input no tiene `aria-describedby`. Al enfocar el campo el lector no lee el motivo. Evidencia: líneas 196-209, 257-270.

### F-02 — Errores, banner y éxito sin anuncio (4.1.3; SCR `error-announcement`)
0 ocurrencias de `role="alert"`, `role="status"`, `aria-live`. Afecta: errores en línea (B, C), banner «Ocurrió un error al guardar los cambios en el servidor» con «Reintentar» (D, línea 301-319) y éxito «Nombre de la unidad actualizado con éxito» (E). Ninguno se anuncia al aparecer.

### F-03 — Obligatorio sólo con asterisco (3.3.2, 4.1.2; SCR `aria-required`)
«Nombre *» sin `required` ni `aria-required` ni leyenda del asterisco (líneas 142, 195, 256, 338, 288 del HTML original por variante).

### F-04 — Foco de campos de texto con indicador débil (2.4.7 / 1.4.11)
El CSS global `:focus-visible { outline: 2px solid #0059ba }` es anulado en los inputs por `focus:outline-none` (Tailwind, mayor especificidad). El indicador queda en `focus:border-[#bc0100]` más `focus:ring-1 focus:ring-[#bc0100]`: un anillo de 1 px. En reposo el borde es `#956d67` (1 px) y pasa a `#bc0100` (6.68:1 sobre blanco), es decir, existe un cambio visible; pero en las variantes B y C el campo ya tiene `border-2 border-[#bc0100]` y el foco sólo añade 1 px de anillo del mismo color, por lo que **no se distingue "con foco" de "sin foco"** salvo por 1 px. Evaluado por CSS, no renderizado. Los botones y enlaces no tienen `focus:outline-none`, conservan el contorno de 2 px `#0059ba` (pass).

### F-05 — Página actual y navegación (1.3.1, 4.1.2)
El ítem activo del menú («Unidades organizacionales», línea 90) se marca sólo por fondo `#bc0100` y negrita, sin `aria-current="page"`. Los `nav` (migas y menú lateral) no tienen `aria-label` y la miga final no tiene `aria-current`. El menú lateral usa `ul`/`li`, pero sin nombre de región.

### F-06 — Reflow a 320 px (1.4.10, fail por cálculo de CSS)
`aside` `w-64 shrink-0` (256 px) y `main` `p-8` (32 px por lado) dejan 0 px de contenido a 320 px. Se declara sólo escritorio (SCR-029-Q9, abierto), pero 1.4.10 depende del zoom. Deducido de CSS, no verificado.

## Lo evaluado y cumplido (pass)

- `aria-invalid="true"` presente en los campos con error (líneas 200, 261).
- `<label for>` con `id` coincidente en las 5 variantes.
- **Contraste** (cálculo propio): texto `#2b1613` sobre blanco > 15; `dt` `#7a4843` sobre `#fff8f6` 7.06; error `#bc0100` sobre blanco 6.68; botón Reintentar blanco sobre `#bc0100` 6.68; éxito `#125828` 7.85, `#2e6d42` 5.69, badge `#1b7938` 5.04 (sobre fondos `#ecf8f0`/`#eef8f1`); menú lateral `#5c3732` 10.26; títulos de grupo `#8b5a54` 5.69. Borde de campo y de Cancelar `#956d67` 4.51:1 (cumple 3:1).
- **Guardar deshabilitado** (`#8b5a54` sobre `#f3d9d5` 4.26): control inactivo con `disabled` real; exento de 1.4.3.
- **Objetivos:** campos `h-11` (44 px), Guardar/Cancelar `h-10`, Reintentar `h-9` (36 px).
- **No solo color (1.4.1):** error con icono + texto + borde; el éxito con icono + texto + badge «Actualizado».
- **Contexto de solo lectura:** `dl`/`dt`/`dd` con unidad y padre.
- **Estructura:** `lang="es"`, `<title>`, `h1`/`h2`, `header`/`aside`/`nav`/`main`.

## Inconclusive (preguntas abiertas)

| ID | Pregunta | Criterio |
|---|---|---|
| ARP-029-02-Q1 | ¿Recorrido por teclado completo y sin trampas? Requiere navegador. | 2.1.1, 2.4.3 |
| ARP-029-02-Q2 | `logical-focus-after-save` y retorno al listado con la unidad resaltada: la variante E es estática. ¿Dónde queda el foco? | 2.4.3 |
| ARP-029-02-Q3 | `unsaved-changes`, `saving`, `loading` y `forbidden` no aparecen en la exploración (sólo A a E). | SCR estados |
| ARP-029-02-Q4 | Variante A: Guardar deshabilitado sin cambios, no enfocable: ¿cómo sabe un usuario de teclado/lector por qué? Depende de si se usa `aria-disabled` y texto de ayuda (decisión de diseño). | 3.3.2, 4.1.2 |
| ARP-029-02-Q5 | ¿La cabecera `sticky` tapa el campo enfocado? Sin `scroll-padding`. | 2.4.11 |
| ARP-029-02-Q6 | Texto al 200 %, 1.4.12, y dependencia de Tailwind CDN/Google Fonts. | 1.4.4, 1.4.12 |
| ARP-029-02-Q7 | El texto del error de nombre vacío es de muestra («texto de muestra», SCR-029-Q8 abierto); su idoneidad (3.3.3) no se puede evaluar. | decisión humana |

## Resultado

`result: fail`. Seis hallazgos (F-01 a F-06); no se cumple el requisito del SCR `error-announcement`. `DESIGN_READY_FOR_DEV` no se cumple para SCR-029-02 con este diseño. No se declara `verified`; revisión humana pendiente.

## Propuestas (no aplicadas; decide diseño/UX)

- F-01/F-02: `aria-describedby` al id del mensaje y `role="alert"`/región viva para errores, banner y éxito.
- F-04: conservar el contorno de foco de 2 px `#0059ba` también en los inputs (no usar `focus:outline-none`), como hace la exploración de SCR-029-01.
- F-03: `aria-required`/`required` y leyenda del asterisco.

## Estado de revisión

`status: draft`. Revisión humana pendiente.
