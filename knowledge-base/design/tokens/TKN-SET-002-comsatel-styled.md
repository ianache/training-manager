---
id: TKN-SET-002
type: Design Tokens
title: TKN-SET-002 — Tokens semánticos «Comsatel Styled»
description: Design system «Comsatel Styled» aportado por ianache (roles de color
  Material ajustados a WCAG AA, tipografía Inter, radios y espaciado). Base vigente de
  toda la plataforma desde 2026-10-02; sustituye a TKN-SET-001.
tags:
- ux-ui
- tokens
- design-system
status: draft
generated:
  by: manual/1.0
  at: '2026-10-02T09:00:00-05:00'
sources:
- id: user-provided-design-md
  resource: Texto pegado por human:ianache en la sesión del 2026-10-02 (formato design.md con frontmatter YAML)
- id: tkn-set-001
  resource: /knowledge-base/design/tokens/TKN-SET-001-sovereign-enterprise.md
supersedes: TKN-SET-001
defines:
  TKN-color-primary: '#bc0100'
  TKN-color-on-primary: '#ffffff'
  TKN-color-primary-container: '#bc0100'
  TKN-color-on-primary-container: '#ffffff'
  TKN-color-secondary: '#b72114'
  TKN-color-secondary-container: '#930300'
  TKN-color-tertiary: '#0059ba'
  TKN-color-tertiary-container: '#0059ba'
  TKN-color-error: '#ba1a1a'
  TKN-color-error-container: '#ffdad6'
  TKN-color-surface: '#fff8f6'
  TKN-color-on-surface: '#2b1613'
  TKN-color-on-surface-variant: '#603e39'
  TKN-color-outline: '#956d67'
  TKN-color-outline-variant: '#855f59'
  TKN-color-background: '#fff8f6'
  TKN-font-family: Inter
  TKN-radius-default: 0.5rem
  TKN-space-md: 1rem
  TKN-space-lg: 1.5rem
  TKN-space-xl: 2rem
---

# TKN-SET-002 — Tokens «Comsatel Styled»

**Estado:** vigente desde 2026-10-02 (`status: draft` hasta verificación humana de accesibilidad).

**Origen:** design system entregado por `human:ianache` el 2026-10-02 (formato `design.md`). El agente solo lo transcribió; no verificó que sea el design system corporativo oficial de Comsatel ni su procedencia (la herramienta que lo generó no se indicó).

## Decisiones de human:ianache (2026-10-02)

- **TKN-Q1 — resuelta:** «Comsatel Styled» es la base de **toda la plataforma** y sustituye a `TKN-SET-001` «Sovereign Enterprise» (decisión del 2026-10-01, ahora reemplazada). SCR-015, GEN-015 y los demás artefactos que citan TKN-SET-001 quedan pendientes de reconciliar con este set.
- **TKN-Q2 — resuelta, luego reemplazada por un ajuste:** primero se declararon como oficiales primario `#fe0000`, secundario `#db3c2a`, terciario `#007bfc` y neutro `#8f706b`. El mismo día `human:ianache` **ajustó el design system** y esos valores quedaron descartados: el primario es `#bc0100`, el secundario `#b72114`, el terciario `#0059ba` y los neutros `#603e39` / `#2b1613`. Ya no hay colores de marca por encima de los roles semánticos.
- **TKN-Q3 — resuelta:** el ajuste corrige los pares que no cumplían AA (`primary-container` `#eb0000`→`#bc0100`, `secondary-container` `#ff5540`→`#930300`, `tertiary-container` `#0071e8`→`#0059ba`, `outline-variant` `#ebbbb4`→`#855f59`; los `on-*-container` pasan a `#ffffff`). Se recalcularon los contrastes (tabla). Es un cálculo del agente, **no** un informe aprobado de `accessibility-reviewer`; ese informe sigue pendiente para cerrar el gate.
- **TKN-Q4 — resuelta:** los tokens `--gf-*` de `@gf/ui` se actualizaron a este set (`projects/ui/src/styles/tokens.css`), manteniendo los nombres y cambiando valores.

### Contrastes calculados (WCAG 2.x, sin verificación humana)

Las cifras del ajuste (7.0:1, 6.1:1, 4.0:1) no coinciden exactamente con las calculadas; la conclusión (cumple) se mantiene.

| Par | Ratio | Mínimo | Resultado |
|---|---|---|---|
| Blanco sobre `#bc0100` (primary / primary-container) | 6.68 | 4.5 | Cumple |
| Blanco sobre `#930100` (primary hover) | 9.35 | 4.5 | Cumple |
| Blanco sobre `#b72114` (secondary) | 6.48 | 4.5 | Cumple |
| Blanco sobre `#930300` (secondary-container) | 9.32 | 4.5 | Cumple |
| Blanco sobre `#0059ba` (tertiary / tertiary-container) | 6.69 | 4.5 | Cumple |
| `#bc0100` como texto sobre `#fff8f6` | 6.37 | 4.5 | Cumple |
| `#2b1613` sobre `#fff8f6` (texto) | 16.31 | 4.5 | Cumple |
| `#603e39` sobre `#fff8f6` (texto atenuado) | 8.91 | 4.5 | Cumple |
| `#93000a` sobre `#ffdad6` (peligro) | 7.24 | 4.5 | Cumple |
| `#004491` sobre `#d7e2ff` (info) | 7.25 | 4.5 | Cumple |
| `#0059ba` sobre `#fff8f6` (anillo de foco) | 6.38 | 3 | Cumple |
| `#956d67` (outline) sobre `#fff8f6` | 4.29 | 3 | Cumple |
| `#855f59` (outline-variant) sobre `#fff8f6` | 5.30 | 3 | Cumple |
| `#855f59` sobre `#ffe9e6` (surface-container) | 4.78 | 3 | Cumple |
| `#956d67` sobre `#ffe9e6` (surface-container) | 3.87 | 3 | Cumple |

### Mapeo a `--gf-*` en `@gf/ui`

`border` toma `outline` (`#956d67`) y `border-strong` toma `outline-variant` (`#855f59`), ambos ≥3:1 para controles (WCAG 1.4.11). `success`, `warning` y `neutral` no existen en «Comsatel Styled» y se conservaron con sus valores previos. `danger` toma `error-container`/`on-error-container`, `info` toma `tertiary-fixed`/`on-tertiary-fixed-variant`, el anillo de foco toma `tertiary` (azul, distinguible del rojo de acción). La escala de espaciado ya coincidía con el set.

## Colores (roles semánticos)

| Rol | Valor |
|---|---|
| `surface` / `background` / `surface-bright` | `#fff8f6` |
| `surface-dim` | `#f8d1cb` |
| `surface-container-lowest` | `#ffffff` |
| `surface-container-low` | `#fff0ee` |
| `surface-container` | `#ffe9e6` |
| `surface-container-high` | `#ffe2dd` |
| `surface-container-highest` / `surface-variant` | `#ffdad4` |
| `surface-tint` | `#bc0100` |
| `on-surface` / `on-background` | `#2b1613` |
| `on-surface-variant` | `#603e39` |
| `inverse-surface` | `#422a27` |
| `inverse-on-surface` | `#ffedea` |
| `outline` | `#956d67` |
| `outline-variant` | `#855f59` |
| `primary` | `#bc0100` |
| `on-primary` | `#ffffff` |
| `primary-container` | `#bc0100` |
| `on-primary-container` | `#ffffff` |
| `inverse-primary` | `#ffb4a8` |
| `secondary` | `#b72114` |
| `on-secondary` | `#ffffff` |
| `secondary-container` | `#930300` |
| `on-secondary-container` | `#ffffff` |
| `tertiary` | `#0059ba` |
| `on-tertiary` | `#ffffff` |
| `tertiary-container` | `#0059ba` |
| `on-tertiary-container` | `#ffffff` |
| `error` | `#ba1a1a` |
| `on-error` | `#ffffff` |
| `error-container` | `#ffdad6` |
| `on-error-container` | `#93000a` |
| `primary-fixed` | `#ffdad4` |
| `primary-fixed-dim` | `#ffb4a8` |
| `on-primary-fixed` | `#410000` |
| `on-primary-fixed-variant` | `#930100` |
| `secondary-fixed` | `#ffdad4` |
| `secondary-fixed-dim` | `#ffb4a8` |
| `on-secondary-fixed` | `#410100` |
| `on-secondary-fixed-variant` | `#930300` |
| `tertiary-fixed` | `#d7e2ff` |
| `tertiary-fixed-dim` | `#acc7ff` |
| `on-tertiary-fixed` | `#001a40` |
| `on-tertiary-fixed-variant` | `#004491` |

## Tipografía (familia: Inter)

| Rol | Tamaño | Peso | Altura de línea |
|---|---|---|---|
| `headline-lg` | 32px | 600 | 40px |
| `body-md` | 16px | 400 | 24px |
| `label-md` | 14px | 500 | 20px |

## Radios

| Token | Valor |
|---|---|
| `sm` | `0.25rem` |
| `DEFAULT` | `0.5rem` |
| `md` | `0.75rem` |
| `lg` | `1rem` |
| `xl` | `1.5rem` |
| `full` | `9999px` |

## Espaciado

| Token | Valor |
|---|---|
| `space-xs` | `0.25rem` |
| `space-sm` | `0.5rem` |
| `space-md` | `1rem` |
| `space-lg` | `1.5rem` |
| `space-xl` | `2rem` |
| `gutter` | `1.5rem` |
| `margin` | `2rem` |

## Directrices (resumen de las secciones del design system ajustado)

- **Marca y estilo:** estética corporativa moderna y de alta fidelidad; Inter en todos los roles; limpia, confiable y profesional; legibilidad y densidad de información bajo cumplimiento WCAG AA; esquinas suavemente redondeadas sobre una cuadrícula estructurada.
- **Color:** rojo primario `#bc0100` para estados interactivos con alto contraste; secundario `#b72114`; terciario azul `#0059ba` para foco, acentos e información; neutros cálidos `#603e39` / `#2b1613` para superficies y texto.
- **Tipografía:** solo Inter; jerarquía clara de titulares a etiquetas de datos.
- **Layout y espaciado:** escala de espaciado consistente; márgenes y gutters que se adaptan al viewport mediante tokens de padding estándar.
- **Elevación:** jerarquía por capas tonales y contornos con al menos 3:1 de contraste para los límites de la UI; sombras mínimas.
- **Formas:** radio base `0.5rem`.
- **Componentes:** botones con fondo `primary`, `secondary` o `tertiary` y texto blanco (≥6:1); campos con borde `outline` (`#956d67`) u `outline-variant` (`#855f59`) y foco con `tertiary`; tarjetas y contenedores con `surface-container-low` / `surface-container-high` y texto `on-surface`.

## Trazabilidad

- Sustituye a: `TKN-SET-001` (Sovereign Enterprise).
- Implementado en: `codebase/apps/portal/projects/ui/src/styles/tokens.css`.
- Pendiente: reconciliar SCR-015, GEN-015, DTM-PPM-001, HOF-PPM-001 y los DTC-015 que citan TKN-SET-001; sin vínculo todavía con Variables de Figma.

## Ajuste 2026-10-03: roles de éxito (verde)

Decisión de `human:ianache`: el éxito y la vigencia usan verde. Se añadieron al design system «Comsatel Styled» en Stitch (v2) `success` `#065f46`, `on-success` `#ffffff`, `success-container` `#ecfdf5`, `on-success-container` `#065f46` y `success-outline` `#a7f3d0`; contraste texto/fondo 7.29:1. Solo para estados de éxito y vigencia, siempre con icono y texto. Estos valores son los que `@gf/ui` conservaba como `success` (`#065f46`), así que el set y la biblioteca vuelven a coincidir. Pendiente: transcribir los tokens al `tokens.css` de `@gf/ui` si cambia algún valor.
