---
id: ARP-SCR-029-01
type: Accessibility Report
title: "ARP-SCR-029-01 — Accesibilidad de la exploración Stitch de SCR-029-01"
description: "Evaluación WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-029-01 (registrar unidad). Resultado: fail."
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
  resource: "stitch:projects/13050549605434273903/screens/00d2d9ec2ecc4fa79429d957ea2e01e8 (htmlCode, 536 líneas, descargado a C:\\temp\\arp028\\s2901.html)"
a11y_review:
  screen: SCR-029-01
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement, logical-focus-after-save]
---

# ARP-SCR-029-01 — Informe de accesibilidad

## Alcance y método

- **Objetivo:** HTML exploratorio de Stitch, variantes A (predeterminado, con lista del combobox desplegada), B (obligatorios vacíos), C (nombre duplicado), D (ciclo / padre inactivo), E (error al guardar), F (éxito), G (sin organización interna).
- **Método:** lectura estática del HTML y contraste calculado con los hex reales de la configuración Tailwind del propio HTML. Sin navegador, sin lector de pantalla, sin captura. Lo que lo requiere es `inconclusive`.
- El texto de Stitch sobre su propio cumplimiento no se tomó como evidencia.
- SCR-029-03 y SCR-029-04 **no tienen exploración** y quedan fuera de este informe (no evaluadas, sin resultado).

## Resumen

| Criterio | Resultado |
|---|---|
| Errores asociados al campo y marcados (3.3.1, 4.1.2: aria-invalid, aria-describedby) | fail |
| Anuncio de errores y estados (SCR: error-announcement; 4.1.3) | fail |
| Combobox de unidad padre (SCR: role combobox/listbox, aria-expanded; 4.1.2, 2.1.1) | fail |
| Campo obligatorio programático (SCR: aria-required; 3.3.2, 4.1.2) | fail |
| Fecha: formato y placeholder (3.3.2, 1.4.3) | fail |
| Contraste del borde de campos (1.4.11) | fail |
| Iconos de fuente leídos como texto (1.1.1, 4.1.2) | fail |
| Migas de pan no operables (2.1.1) | fail |
| Página actual en navegación sin `aria-current` (1.3.1, 4.1.2) | fail |
| Reflow (1.4.10) | fail |
| Etiquetas ligadas a campos (1.3.1, 3.3.2, 4.1.2) | pass |
| Contraste de texto principal, errores y botones (1.4.3) | pass |
| Foco visible (2.4.7, focus-visible) | pass |
| Tamaño de objetivo (2.5.8) | pass |
| Error no solo por color (1.4.1) | pass |
| Idioma, título, encabezados, orden en DOM | pass |
| Teclado en vivo, foco tras guardar (logical-focus-after-save), unsaved-changes, foco no oculto (2.4.11), zoom/espaciado | inconclusive |

## Hallazgos (fail)

### F-01 — Errores sin vínculo programático con su campo (3.3.1, 4.1.2; SCR a11y `aria-invalid`, `aria-describedby`)
En las variantes B, C y D los campos con error (`name_b`, `parent_b`, `date_b`, `name_c`, `parent_d`) no tienen `aria-invalid`, y los mensajes («Campo obligatorio (texto de muestra)», «Ya existe una unidad con este nombre bajo Ingeniería», «Crearía un ciclo en la jerarquía», «Indica la fecha desde») son `<span>` sin `id` ni referenciados por `aria-describedby`. Un lector de pantalla no sabe que el campo es inválido ni oye el motivo al enfocarlo. El estado se transmite por borde de 2 px de `#bc0100` más icono y texto (cumple 1.4.1, no cumple lo programático). Evidencia: líneas 249-282, 302-311, 354-368 del HTML.

### F-02 — Errores y resultados sin anuncio (4.1.3; SCR a11y `error-announcement`)
0 ocurrencias de `role="alert"`, `role="status"`, `aria-live`. Afecta: avisos en línea, el banner «Ocurrió un error al intentar guardar…» con «Reintentar» (E, líneas 397-406), el éxito «Unidad registrada con éxito» (F, líneas 449-452) y el bloqueo «Debe registrar primero la organización interna» (G, líneas 496-499). Ninguno se anuncia al aparecer.

### F-03 — Combobox de unidad padre sin semántica (SCR a11y `role combobox/listbox`, `aria-expanded`; 4.1.2, 2.1.1)
El campo es un `<input type="text">` normal (líneas 205, 263, 316, 357). La lista desplegada de la variante A es `<ul><li>` con `cursor-pointer`: sin `role="listbox"`/`option`, sin `aria-expanded`, `aria-controls`, `aria-activedescendant` ni `aria-autocomplete`, y los `<li>` no son enfocables ni operables por teclado. El estado de la opción («Activa») sólo está en texto de color. La navegación por teclado exigida por el SCR («búsqueda por teclado») no está resuelta en el marcado. Evidencia: líneas 202-221. El icono `expand_more` es decorativo con `pointer-events-none`.

### F-04 — Campos obligatorios sólo con asterisco (3.3.2, 4.1.2; SCR a11y `aria-required`)
«Nombre *», «Unidad padre *», «Fecha desde *»: ninguno tiene `required` ni `aria-required`, y no hay leyenda que explique «*». El SCR pide `aria-required`.

### F-05 — Fecha sin indicación persistente del formato y con placeholder de bajo contraste (3.3.2, 1.4.3)
`date_*` es `type="text"` con `placeholder="dd/mm/aaaa"`; el formato sólo vive en el placeholder (desaparece al escribir). El placeholder usa `on-surface-variant/60`: `#5d3f3b` al 60 % sobre blanco = `#9e8c89`, **3.20:1** (mínimo 4.5:1). Tampoco el placeholder del nombre y de «Buscar unidad…» (mismo color). El icono de calendario es decorativo y no abre ningún selector; no se evalúa dinámica.

### F-06 — Borde de los campos por debajo de 3:1 (1.4.11)
Campos en reposo: `border-brand-border` = `#f8d1cb` sobre blanco = **1.40:1** (mínimo 3:1 para identificar el límite del control). Las entradas dependen de ese borde (fondo blanco sobre `#fff8f6`). En error el borde `#bc0100` sí cumple. El botón Cancelar usa el mismo borde (1.15:1 sobre su relleno `#ffe2dd`), pero su texto lo identifica; se menciona sin contarlo como falla.

### F-07 — Iconos Material Symbols en el árbol de accesibilidad (1.1.1, 4.1.2)
Los iconos son `<span class="material-symbols-outlined">nombre</span>` sin `aria-hidden`. Un lector de pantalla leerá la ligadura como texto: «error», «warning», «check_circle», «expand_more», «calendar_today», «account_tree», «logout» (p. ej. delante de cada mensaje de error y del botón Cerrar sesión). Si la fuente no carga se ven esas palabras. Evidencia: líneas 123, 128, 132, 178, 206, 255, 267, 399, 450.

### F-08 — Migas de pan no operables (2.1.1)
En el `nav` de migas «Unidades organizacionales» es un `<span class="cursor-pointer">` (línea 177): sólo ratón, no enfocable. Además el `nav` no tiene `aria-label` ni marca la última miga con `aria-current="page"`.

### F-09 — Página actual sin `aria-current` (1.3.1, 4.1.2)
El ítem activo del menú («Unidades organizacionales», línea 166) se señala por fondo y negrita; no tiene `aria-current="page"`. Los `nav` (menú y migas) no se distinguen por nombre.

### F-10 — Reflow a 320 px (1.4.10, fail por cálculo de CSS)
`aside` `w-64 flex-shrink-0` (256 px) más `main` con `p-space-xl` (32 px por lado) deja 0 px de contenido en un viewport de 320 px. SCR-029 declara sólo escritorio (SCR-029-Q9, abierto), que no exime a 1.4.10 (zoom). Deducido de CSS, no verificado en navegador.

## Lo evaluado y cumplido (pass)

- **Etiquetas:** todos los campos tienen `<label for>` con `id` coincidente (líneas 198-199, 203-205, 224-226 y análogas en B a G).
- **Contraste de texto:** `#2b1613` sobre blanco/`#fff8f6` > 15; error `#bc0100` sobre blanco 6.68; banner `#93000a` sobre `#ffdad6` 7.24; enlace Cerrar sesión `tertiary` `#0059ba` sobre blanco 6.69; botón primario blanco sobre `#bc0100` 6.68; badge Activa `#410000` sobre `#ffdad5` 13.26; Activa en la lista `#0059ba` 6.69.
- **Foco visible:** `focus:ring-2 focus:ring-tertiary focus:ring-offset-2` con `#0059ba` (6.69:1) en campos y botones de la página. Los enlaces del menú no declaran foco (valor por defecto del navegador, no evaluable).
- **Objetivos (2.5.8):** botones `h-11` (44 px); Reintentar `py-1.5` + texto ≈ 36 px.
- **No solo color (1.4.1):** error con icono + texto + borde grueso.
- **Estructura:** `lang="es"`, `<title>`, `h1`, `h2` por variante, `header`/`aside`/`nav`/`main`, orden DOM lógico.
- **Deshabilitado (G):** los controles de la variante G usan `disabled` real; la excepción de contraste de 1.4.3 aplica a controles inactivos. El texto de la etiqueta queda con `opacity-50` (no evaluable con exactitud).

## Inconclusive (preguntas abiertas)

| ID | Pregunta | Criterio |
|---|---|---|
| ARP-029-01-Q1 | ¿Recorrido por teclado completo y sin trampas (incluida la lista del combobox, que no existe como control)? | 2.1.1, 2.4.3 |
| ARP-029-01-Q2 | «foco lógico tras guardar» y retorno al listado con la unidad resaltada: el HTML es estático (F no define dónde queda el foco). | SCR logical-focus-after-save, 2.4.3 |
| ARP-029-01-Q3 | `unsaved-changes` (aviso al abandonar) y `saving` (Loading-Button) no aparecen en la exploración (sólo A a G). ¿Cómo se anunciarán? | SCR estados |
| ARP-029-01-Q4 | ¿La cabecera `sticky` (64 px) tapa el campo enfocado al navegar con Tab? Sin `scroll-padding`. | 2.4.11 |
| ARP-029-01-Q5 | Texto al 200 %, espaciado 1.4.12 y dependencia de Tailwind CDN / Google Fonts / Material Symbols. | 1.4.4, 1.4.12 |
| ARP-029-01-Q6 | Estado `forbidden` y `loading` del SCR no tienen variante en la exploración. | spec |
| ARP-029-01-Q7 | La variante D muestra a la vez «Crearía un ciclo…» y «Solo se pueden elegir unidades activas», ambos en color de error: ¿se muestran juntos o es uno según la causa? Es decisión de producto. | decisión humana |

## Resultado

`result: fail`. Diez hallazgos (F-01 a F-10). El requisito propio `error-announcement` no se cumple, ni los roles del combobox del inventario del SCR. `DESIGN_READY_FOR_DEV` no se cumple para SCR-029-01 con este diseño. SCR-029-03 y 04 sin exploración, fuera de alcance. No se declara `verified`; revisión humana pendiente.

## Propuestas (no aplicadas; decide diseño/UX)

- F-01/F-02: exigir en el CMP de campo `aria-invalid`, `aria-describedby` al mensaje y `role="alert"` (o región viva) para errores y banners.
- F-03: especificar el combobox con patrón ARIA (combobox/listbox/option, `aria-expanded`, `aria-activedescendant`).
- F-05/F-06: placeholder y borde con contraste suficiente; formato de fecha como texto de ayuda visible.
- F-07: ocultar los iconos decorativos (`aria-hidden="true"`).

## Estado de revisión

`status: draft`. Revisión humana pendiente.
