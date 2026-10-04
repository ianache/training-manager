---
id: ARP-SCR-029-04
type: Accessibility Report
title: "ARP-SCR-029-04 — Revisión de accesibilidad: Historial de relaciones y vigencias (HTML Stitch)"
description: "Revisión estática WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-029-04, en dos hojas (estado con datos; estados cargando, vacío, error y sin acceso). Resultado fail; borrador, sin verificación humana."
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
- id: stitch-html-datos
  resource: stitch:projects/13050549605434273903/screens/4a7c7d12dfc2459db13fbefd5d8381cd
- id: stitch-html-estados
  resource: stitch:projects/13050549605434273903/screens/781b835533004ced937b430e00def465
a11y_review:
  screen: SCR-029-04
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 8, fail: 4, inconclusive: 4}
---

# ARP-SCR-029-04 — Historial de relaciones y vigencias

**Método.** Análisis estático de dos HTML de Stitch: **datos** (12 931 bytes) y **estados B, C, D y E** (13 830). Contraste calculado con los tokens de «Comsatel Styled». No se ejecutó en navegador. Las afirmaciones de Stitch sobre accesibilidad no cuentan como evidencia.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | **fail** | Iconos como ligaduras de texto (datos: 10 `material-symbols`; estados: 11; 0 `aria-hidden` en ambos). |
| 1.3.1 Información y relaciones | **fail** | La tabla tiene `th scope` (5) pero **no `<caption>`** ni `aria-label`: «Historial de relaciones» es un `div`, y el SCR pide tabla con título. Los tres `nav` (lateral, migas) no llevan `aria-label` (las migas tampoco `aria-current`). |
| 1.4.1 Uso del color | pass | «Vigente» lleva icono y texto (verde: color ajeno al design system, ver nota). |
| 1.4.3 Contraste (texto) | pass | #2b1613/#fff8f6 = 16.31; #603e39/#fff8f6 = 8.91; blanco/#bc0100 = 6.68. Texto «emerald-800» del badge no calculado (sin la paleta Tailwind en el análisis): no evaluado. |
| 1.4.10 Reflow / 1.4.4 / 1.4.12 | inconclusive | Requiere navegador. |
| 2.1.1 Teclado | pass | Elementos nativos (`a`, `button`, `table`). |
| 2.4.3 Orden del foco | inconclusive | Sin scripts. |
| 2.4.7 Foco visible | inconclusive | 0 clases `focus:` y 0 `outline-none`: queda el contorno por defecto del navegador, cuyo contraste no se evaluó. |
| 2.4.1 Evitar bloques / 2.4.2 Título | pass | `header`, `aside`, `nav`, `main`, `h1`; títulos «Historial de relaciones de la unidad - Comsatel» y «Historial de relaciones y vigencias - SCR-029-04» (el segundo incluye el ID, ruido). |
| 2.5.8 Tamaño de objetivo | inconclusive | Sin medición. |
| 3.1.1 Idioma | pass | `lang="es"`. |
| 4.1.3 Mensajes de estado / `error-announcement` | **fail** | Estados: «Cargando» (esqueleto) sin `role="status"`/`aria-busy`; error D sin `role="alert"`; «Sin acceso» sin rol. 0 apariciones de `role=alert`/`aria-live`. |
| Paginación (Anterior/Siguiente) | pass | Botones nativos con `disabled`. |

## Hallazgos fail

- **F1 (1.1.1)** — SCR-029-04, ambas hojas. Evidencia: ligaduras sin `aria-hidden`.
- **F2 (1.3.1)** — Hoja de datos. Evidencia: tabla sin `caption` y `nav` sin nombre.
- **F3 (4.1.3)** — Hoja de estados. Evidencia: cargando, error y sin acceso sin rol ni región viva.
- **F4 (1.3.1)** — Hoja de estados: el esqueleto de carga conserva los encabezados de columna sin indicar que la tabla está cargando (`aria-busy` ausente).

## Notas de revisión crítica (no son criterios WCAG)

- El badge «Vigente» se pintó con la paleta `emerald` (verde), color que no existe en «Comsatel Styled» (ver R-10 de GEN-016). En la fila vigente el badge ocupa la columna «Hasta»; el SCR pide «Hasta» vacío con la insignia en la relación.
- La hoja de datos añade «Mostrando 2 de 2 registros», no pedido por el SCR.
- Las hojas no incluyen «Soporte»/«Ajustes» (se corrigió en el prompt); no se halló «Eliminar» ni «Borrar».
- Los textos de error y de sin acceso son muestra («No se pudo cargar el historial», «No tienes permiso para ver este historial»): redacción por validar.

## Preguntas abiertas

- ¿El vacío («Aún no hay cambios registrados») debe ocultar la tabla o mostrarla con encabezados? Sin fuente.
- ¿Foco visible: se acepta el contorno por defecto o se define el anillo de foco del sistema? Requiere decisión de diseño.

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Revisión humana pendiente.
