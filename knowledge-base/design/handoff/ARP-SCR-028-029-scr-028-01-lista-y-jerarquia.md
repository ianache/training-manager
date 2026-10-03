---
id: ARP-SCR-028-01
type: Accessibility Report
title: "ARP-SCR-028-01 — Accesibilidad de la exploración Stitch de SCR-028-01"
description: "Evaluación WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-028-01 (lista y jerarquía de unidades organizacionales). Resultado: fail."
tags: [ux-ui, accessibility, wcag-2.2, scr-028, stitch-exploration]
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T18:00:00-05:00'
sources:
- id: scr
  resource: /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
- id: gen
  resource: /knowledge-base/design/generations/GEN-028-stitch-listar-y-buscar-unidades-organizacionales.md
- id: html
  resource: "stitch:projects/13050549605434273903/screens/078ae7f725e242bcba357e646e1395dd (htmlCode, 707 líneas, descargado a C:\\temp\\arp028\\s28.html)"
a11y_review:
  screen: SCR-028-01
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, aria-sort, tree-roles, status-announcement]
---

# ARP-SCR-028-01 — Informe de accesibilidad

## Alcance y método

- **Objetivo:** HTML exploratorio de Stitch (`exploration_design`, no gobernado). Variantes A (lista), B (jerarquía), C (cargando), D (sin organización), E (vacío), F (sin resultados), G (sin permisos), H (error).
- **Método:** lectura estática del HTML (marcado, clases Tailwind, CSS en línea) y cálculo de contraste con los colores reales del código (fórmula WCAG 2.x, hex exactos). **No** se abrió en navegador, no hay prueba con lector de pantalla ni de teclado en vivo, no se miró la captura. Lo que depende de ello es `inconclusive`.
- Lo que Stitch afirma de sí mismo (design system «Comsatel Styled», «contraste 4.5:1») no se usó como evidencia.
- Este informe no corrige el diseño ni decide producto; las propuestas son entradas para quien decide.

## Resumen

| Criterio | Resultado |
|---|---|
| Contraste de texto (1.4.3) | fail |
| Contraste de componentes y foco (1.4.11) | fail |
| `aria-sort` / ordenación operable (SCR: aria-sort; 2.1.1, 4.1.2) | fail |
| Roles de árbol (SCR: tree-roles; 4.1.2, 1.3.1) | fail |
| Anuncio de estado (SCR: status-announcement; 4.1.3) | fail |
| Estado del alternador Lista/Jerarquía (4.1.2) | fail |
| Reflow (1.4.10) | fail |
| Nombres accesibles de controles de formulario (4.1.2, 3.3.2) | pass |
| Etiquetas de filtros y búsqueda (1.3.1, 3.3.2) | pass |
| Estado no solo por color (1.4.1) | pass |
| Tamaño de objetivo (2.5.8) | pass |
| Foco visible, aparición (2.4.7) | pass (sujeto a F-02) |
| Idioma y título de página (3.1.1, 2.4.2) | pass |
| Nombres accesibles de acciones por fila (SCR: «nombre accesible con la unidad») | fail |
| Teclado en vivo, orden de foco, foco gestionado en no-results (2.1.1, 2.4.3) | inconclusive |
| Foco no oculto por cabecera fija (2.4.11) | inconclusive |
| Texto redimensionable / espaciado (1.4.4, 1.4.12) | inconclusive |

## Hallazgos (fail)

### F-01 — Contraste de texto insuficiente (WCAG 1.4.3, fail)
Colores del código (hex exactos), cálculo propio:
- Texto de apoyo de los estados D, E, F, G, H: `text-xs text-[#956d67]` sobre el panel `bg-[#fff8f6]` = **4.29:1** (mínimo 4.5:1 para texto de 12 px).
- Fila Inactiva (`Unidad de Ejemplo 3`): `#956d67` sobre `bg-gray-50/50` (fondo aproximado `#fbf9f9`, no determinable de forma exacta sin renderizar) ≈ **4.3:1**. El texto atenuado afecta nombre, padre y conteos.
- Sobre `#fff0ee` (hover/chip) `#956d67` daría 4.07:1; no se usa así en reposo.
- Pasan: `#956d67` sobre blanco 4.51:1 (apenas); chips `#bc0100`/`#fff0ee` 6.03; enlaces `#0059ba`/blanco 6.69; botón primario blanco/`#bc0100` 6.68; Activa 7.29; Inactiva 7.60; Vencida 8.33.
- Evidencia: líneas 533, 560, 643, 670, 692 (texto de apoyo), 246-264 (fila Inactiva).

### F-02 — Indicador de foco de botones y enlaces por debajo de 3:1 (1.4.11, con impacto en 2.4.7)
`.focus-ring:focus` usa `outline:none; box-shadow: 0 0 0 3px rgba(0,89,186,.4)`. El color mezclado sobre blanco es `#99bde3`, **1.95:1** frente al fondo. En los botones (Editar, Desactivar, Reactivar, Lista, Jerarquía, X de filtro, Limpiar filtros, Reintentar) `border-color:#0059ba` no tiene efecto porque no tienen borde (preflight `border-width:0`), de modo que el único indicador es esa sombra de 1.95:1. En entradas y selects sí cambia el borde a `#0059ba` (6.69:1, 1 px), por lo que ahí se cumple. Los enlaces del menú lateral no declaran foco y usan el valor por defecto del navegador (no evaluable aquí). Evidencia: líneas 21-25, 58, 157, 173, 218-219.

### F-03 — Ordenación sin `aria-sort` ni operable por teclado (SCR a11y `aria-sort`; 2.1.1, 4.1.2)
Los `<th scope="col">` no llevan `aria-sort` (búsqueda de `aria-sort` en el HTML: 0 ocurrencias). La columna Nombre sólo muestra un SVG de flecha dentro de un `<div>`; el `<th>` tiene `cursor-pointer` pero **no contiene `<button>`**, así que no se enfoca ni se activa con teclado. Las demás columnas ordenables según SCR (Unidad padre, Estado, Vigencia) no tienen ni indicador ni control. Hoy el orden no es operable ni anunciable. Evidencia: líneas 187-198.

### F-04 — Vista Jerarquía sin roles de árbol (SCR a11y `tree-roles`; 1.3.1, 4.1.2)
El «árbol» son `<div>` anidados: 0 `role="tree"`, `treeitem`, `group`, `aria-expanded`, `aria-level`. El estado expandido/colapsado sólo se transmite con el icono (chevron) y con el `aria-label` «Colapsar/Expandir …» del botón, que no refleja estado (`aria-expanded` ausente) y obliga a recorrer cada botón con Tab. La jerarquía (nivel) sólo es visual (sangría y línea). Los nodos hoja usan un `•` como texto sin ocultar. No hay navegación con flechas. Evidencia: líneas 386-496.

### F-05 — Cambios de estado no anunciados (SCR a11y `status-announcement`; 4.1.3)
0 ocurrencias de `role="status"`, `role="alert"`, `aria-live`, `aria-busy`. Afecta: Cargando (C: el spinner `animate-spin` y «Cargando» no se anuncian), Sin resultados (F), Error (H) y los cambios de filtros activos (la región «Filtros activos» no es región viva). Evidencia: líneas 169-180, 510-513, 636-650, 686-700.

### F-06 — Alternador Lista/Jerarquía sin estado programático (4.1.2, 1.3.1)
Los dos botones se distinguen por color, negrita y subrayado; no tienen `aria-pressed`, `aria-selected`/`role="tab"` ni `aria-current`. Un lector de pantalla no sabe qué vista está activa. Sin agrupación (`role="group"` o `tablist`). Evidencia: líneas 157-164, 360-367, 611-618.

### F-07 — Acciones de fila sin nombre accesible que identifique la unidad (SCR: «nombre accesible con la unidad»; 2.4.6, 4.1.2)
Cada fila repite «Editar» y «Desactivar»/«Reactivar» sin `aria-label` ni texto oculto. Para un lector de pantalla hay 5 botones «Editar» indistintos. Lo mismo en la vista Jerarquía, que sí pone `aria-label` en los botones de expandir pero no en las acciones. Evidencia: líneas 218-219, 239-240, 266-267, 287-288, 308-309, 404-405 y análogas.

### F-08 — Reflow a 320 px (1.4.10, fail por cálculo de CSS)
`aside` con `w-64 shrink-0` (256 px) y `main` con `p-8` (32 px por lado) dejan 0 px de ancho útil para contenido en un viewport de 320 px (equivale a 400 % de zoom en 1280 px). La tabla tiene `overflow-x-auto` (aceptable para datos tabulares), pero el resto del contenido queda inutilizable. SCR-028 declara solo escritorio (SCR-028-Q1, abierto), pero 1.4.10 se evalúa con el zoom, no con el dispositivo: la decisión de producto sobre dispositivos no lo excusa. No se verificó en navegador; es deducción del CSS.

### F-09 — Controles de filtro de la búsqueda (menor, 4.1.2)
La eliminación de filtros por chip existe sólo en la variante A/B (`aria-label="Remover filtro Estado: Activa"`, correcto); en la variante F los chips «Búsqueda: …» y «Estado: Activa» no tienen botón para quitar, a diferencia de A y B. Incoherencia que afecta a quien opera por teclado. Evidencia: líneas 625-630.

## Lo evaluado y cumplido (pass)

- **Etiquetas:** búsqueda, estado y unidad padre tienen `<label for>` con `sr-only` y `id` coincidentes (líneas 127, 136, 146; repetido en B y F). Placeholder de búsqueda `#956d67`/blanco 4.51.
- **Estado no solo por color (1.4.1):** Activa/Inactiva con texto e icono; Vencida con texto.
- **Tamaño de objetivo (2.5.8):** los botones de texto `text-xs` tienen unos 16 px de alto, pero separados por 8 px de otros objetivos; cumplen por la excepción de espaciado. Lista/Jerarquía (~24 px), Reintentar y Registrar primera unidad (≥ 36 px). Evaluado por cálculo, no medido en pantalla.
- **Estructura:** `lang="es"`, `<title>`, `h1` + `h2`, `header`/`aside`/`nav`/`main`, tabla con `<th scope="col">`.
- **Entradas y selects:** borde `#956d67` (4.51:1) cumple 1.4.11 y el foco cambia el borde a `#0059ba`.

## Inconclusive (preguntas abiertas)

| ID | Pregunta | Criterio |
|---|---|---|
| ARP-028-Q1 | ¿El orden de Tab y el uso real con teclado (sin ratón) son lógicos, sin trampas? Requiere probar el HTML en navegador. | 2.1.1, 2.4.3 |
| ARP-028-Q2 | ¿El foco queda fuera del área tapada por la cabecera `sticky` de 64 px (sin `scroll-padding`)? Requiere navegador. | 2.4.11 |
| ARP-028-Q3 | ¿Cómo se comporta con texto al 200 %, con `line-height`/espaciado del 1.4.12 y con la fuente Inter cargada (el HTML depende de Tailwind CDN y Google Fonts)? | 1.4.4, 1.4.12 |
| ARP-028-Q4 | ¿Dónde va el foco tras «Limpiar filtros», «Reintentar», cambiar de vista o al resultar sin coincidencias («foco gestionado» en SCR)? El HTML es estático y no lo define. | 2.4.3, 3.2.2 |
| ARP-028-Q5 | ¿Cómo se ven los enlaces del menú lateral al recibir foco (no tienen estilo propio; depende del navegador)? | 2.4.7 |
| ARP-028-Q6 | Estados fuera del HTML: filtro de unidad padre (brecha SCR-028-Q2) con jerarquía y teclado; paginación; `loading` con controles deshabilitados. No hay exploración. | spec |
| ARP-028-Q7 | La decisión de producto sobre ordenación por defecto y alcance de dispositivo (UXR-028-Q2, SCR-028-Q1) sigue abierta; este informe no la resuelve. | decisión humana |

## Resultado

`result: fail`. Nueve hallazgos (F-01 a F-09); los requisitos propios del SCR `aria-sort`, `tree-roles` y `status-announcement` no se cumplen en la exploración. `DESIGN_READY_FOR_DEV` no se cumple para SCR-028-01 con este diseño. No se declara `verified`; revisión humana pendiente.

## Propuestas (no aplicadas; decide diseño/UX)

- F-01: usar un color de texto de apoyo con ≥ 4.5:1 sobre `#fff8f6` y sobre filas inactivas, y no usar opacidad ni gris para filas inactivas.
- F-02: foco con contorno sólido ≥ 3:1 (el HTML de SCR-029-01 usa anillo `#0059ba` de 2 px con separación y cumple).
- F-03 a F-07: el diseño debería incluir `button` en encabezados con `aria-sort`, `role="tree"`/`treeitem`/`aria-expanded`/`aria-level`, región viva para estado/orden/filtros, estado seleccionado del alternador y nombres con la unidad en las acciones; se especifican como requisitos de CMP (brecha SCR-028-Q2).

## Estado de revisión

`status: draft`. Revisión humana pendiente.
