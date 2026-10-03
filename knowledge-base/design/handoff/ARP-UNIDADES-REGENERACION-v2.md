---
id: ARP-UNIDADES-V2
type: Accessibility Report
title: ARP-UNIDADES-V2 — Revisión de accesibilidad de la regeneración de las pantallas de unidades organizacionales (HTML Stitch)
description: Revisión estática WCAG 2.2 AA de 16 hojas regeneradas en Stitch (2026-10-03) para SCR-017, SCR-028, SCR-029-01/03/04 y SCR-030, tras añadir requisitos semánticos a los prompts. Sustituye a los ARP anteriores en lo que corrige; ninguna pantalla pasa a pass.
tags:
- ux-ui
- accessibility
- party
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T23:00:00-05:00'
sources:
- id: gen-017
  resource: /knowledge-base/design/generations/GEN-017-stitch-registrar-la-organizacion-interna.md
- id: gen-028
  resource: /knowledge-base/design/generations/GEN-028-stitch-listar-y-buscar-unidades-organizacionales.md
- id: gen-029
  resource: /knowledge-base/design/generations/GEN-029-stitch-registrar-y-editar-unidades-organizacionales.md
- id: gen-030
  resource: /knowledge-base/design/generations/GEN-030-stitch-desactivar-y-reactivar-unidades-organizacionales.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
a11y_review:
  screen: SCR-017-01..03, SCR-028-01, SCR-029-01, SCR-029-03, SCR-029-04, SCR-030-01..04
  target: html
  result: inconclusive
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, focus-trap, error-announcement]
  counts: {pass: 0, fail: 2, inconclusive: 14}
---

# ARP-UNIDADES-V2 — Regeneración de las pantallas de unidades organizacionales

**Método.** Análisis estático del HTML de 16 hojas de Stitch regeneradas con prompts que exigen `aria-hidden` en iconos, `label for`, `aria-invalid` y `aria-describedby`, `role="alert"` y `role="status"`, `caption`, `aria-label` en `nav` y `aria-current`. Se contaron atributos y se calculó el contraste con los tokens de «Comsatel Styled». **No se ejecutó en navegador:** foco atrapado, Escape, orden del foco, teclado real, zoom 200 %, espaciado de texto y objetivos de 24 px no se evaluaron. Por eso ninguna pantalla recibe `pass`.

## Cambio respecto de los informes anteriores

Los prompts con requisitos semánticos corrigieron en Stitch casi todos los `fail` de los ARP previos: iconos con `aria-hidden` (de 0 a la totalidad en 14 de 16 hojas), etiquetas ligadas a campos, `aria-invalid` + `aria-describedby` en errores, `role="alert"`/`role="status"` en errores, cargas y éxitos, `caption` y `th scope` en tablas, `role="tree"` y `aria-sort` en el listado, y `nav` con nombre. Los textos «Soporte» y «Ajustes» desaparecen salvo en SCR-029-01.

## Resultado por pantalla

| SCR (hoja) | Resultado | Hallazgo o motivo |
|---|---|---|
| SCR-017-01 | inconclusive | `dl` (2), `status`/`alert`, iconos ocultos. Foco y teclado sin evaluar. |
| SCR-017-02 (A–D, E–G) | inconclusive | 12 de 12 y 6 de 6 controles con `label for`; `aria-invalid` con `aria-describedby` en las variantes de error. |
| SCR-017-03 | inconclusive | `role="alert"` presente. |
| SCR-028-01 (A, B) | inconclusive | `caption`, `aria-sort`, `role="tree"`, 6 de 6 controles etiquetados. `min-w-[240px]` en un contenedor: reflow sin evaluar. |
| SCR-028-01 (F–H) | inconclusive | `status` y `alert` presentes. **Faltan las variantes C a E** (sin resultados, sin unidades, sin organización interna). |
| SCR-029-01 (A–D, E–H) | **fail** | F1: aparecen «Soporte» y «Ajustes» en la barra lateral (contenido inventado). F2: una de las dos `nav` no tiene `aria-label` en la hoja A–D. |
| SCR-029-03 (A–C) | inconclusive | 6 de 6 controles etiquetados; `aria-invalid` y `aria-describedby` en B y C. |
| SCR-029-03 (D–F) | **fail** | F3: 4 controles y solo 2 `label for` (campos de E y F sin etiqueta); 2 iconos sin `aria-hidden`; color `#059669`, fuera del rol de éxito del design system. |
| SCR-029-04 (datos) | inconclusive | `caption`, `th scope`, `nav` con nombre. Un `outline-none` sin anillo de foco asociado: foco visible sin evaluar. |
| SCR-029-04 (B–E) | inconclusive | `status` con `aria-busy` y `alert`; `caption` y `th scope`. |
| SCR-030-01 | inconclusive | Diálogo con `role`, `aria-modal`, `aria-labelledby`; `aria-busy`. Foco inicial y trampa sin evaluar. |
| SCR-030-02 | inconclusive | Diálogo y `alert`. 13 iconos, todos con `aria-hidden`. |
| SCR-030-03 | inconclusive | 3 de 3 controles etiquetados; error de fecha con `aria-invalid`. |
| SCR-030-04 | inconclusive | Diálogo con `role`; enlace al padre sin verificar `href`. |

## Hallazgos fail

- **F1 — SCR-029-01.** Evidencia: «Soporte» y «Ajustes» en el HTML de las dos hojas. No es un criterio WCAG pero contradice el SCR (contenido inventado).
- **F2 — SCR-029-01 (A–D).** 4.1.2/2.4.1: una `nav` sin nombre accesible (`nav-label` 1 de 2).
- **F3 — SCR-029-03 (D–F).** 1.3.1/3.3.2: 2 campos sin etiqueta ligada; 1.1.1: 2 iconos sin `aria-hidden`.

## Notas de revisión crítica

- **Decisión de producto aplicada:** éxito y vigencia en verde del design system (`success` #065f46 sobre `success-container` #ecfdf5, contraste 7.29:1), siempre con icono y texto. El diálogo de resumen de SCR-029-03 muestra solo «{unidad}: de X a Y». La columna «Hasta» va vacía en la relación vigente y la insignia «Vigente» va en «Padre nuevo» (SCR-029-04).
- **Verdes fuera del rol:** SCR-030-01 y 030-03 usan `emerald-50/200/600/800` (cercanos pero no idénticos a los tokens) y SCR-029-03 (D–F) usa `#059669`. Pendiente alinearlos con `success`.
- Tampoco hay texto de «Eliminar», «Borrar», «empresa» ni «compañía» en ninguna hoja.

## Preguntas abiertas

- ¿Se corrige SCR-029-01 y SCR-029-03 (D–F) con `edit_screens` o se regeneran? `edit_screens` falló antes de forma intermitente.
- ¿Se pasa por navegador (teclado, zoom, foco atrapado) antes de dar un `pass`? Sin eso no hay `pass` posible.

## Resultado

`inconclusive` global, con 2 `fail` (SCR-029-01, SCR-029-03 D–F) y 14 `inconclusive`. `DESIGN_READY_FOR_DEV` exige `pass` por SCR; no se cumple. Revisión humana pendiente.
