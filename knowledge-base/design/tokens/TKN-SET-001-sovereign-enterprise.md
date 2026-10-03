---
id: TKN-SET-001
type: Design Tokens
title: TKN-SET-001 — Tokens semánticos «Sovereign Enterprise»
description: Tokens de la base visual elegida por ianache (design system de Stitch
  «Sovereign Enterprise»).
tags:
- ux-ui
- tokens
- design-system
status: draft
superseded_by: TKN-SET-002
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-01T23:30:00-05:00'
sources:
- id: stp
  resource: /knowledge-base/design/projects/STP-PPM-001-plataforma-ppm.md
defines:
  TKN-color-primary: '#0F4C81'
  TKN-color-primary-hover: '#0D3F6B'
  TKN-color-secondary: '#1F2937'
  TKN-color-tertiary: '#0284C7'
  TKN-color-surface-canvas: '#F8F9FA'
  TKN-color-surface-elevated: '#FFFFFF'
  TKN-color-border-subtle: '#E5E7EB'
  TKN-color-border-default: '#D1D5DB'
  TKN-color-text-primary: '#111827'
  TKN-color-text-secondary: '#4B5563'
  TKN-color-error-border: '#DC2626'
  TKN-color-error: '#BA1A1A'
  TKN-focus-ring: '2px solid #0F4C81, offset 2px #FFFFFF'
  TKN-font-family: Inter
  TKN-radius-default: 8px
  TKN-radius-container: 12px
  TKN-space-md: 16px
  TKN-space-lg: 24px
  TKN-space-xl: 32px
---

# TKN-SET-001 — Tokens «Sovereign Enterprise»

> **Reemplazado el 2026-10-02** por [TKN-SET-002 «Comsatel Styled»](TKN-SET-002-comsatel-styled.md) (decisión de `human:ianache`, TKN-Q1). Se conserva como historial; ya no rige.

**Decisión humana (ianache, 2026-10-01):** usar «Sovereign Enterprise» como base de tokens (responde UXR-Q4 para esta plataforma).

- **Origen:** design system que Stitch creó automáticamente en el proyecto `STP-PPM-001` (`assets/bcea74e59ec041d7bc9ccac7f22e82dd`, v1). **No es un design system corporativo preexistente**; los valores se copiaron de sus directrices y de su `design.md`.
- **Conflicto interno sin resolver:** las directrices de Stitch dan el error de campo como `#DC2626` y su `design.md` da el rol `error` como `#BA1A1A`. Se conservan los dos como tokens distintos (`TKN-color-error-border`, `TKN-color-error`); decidir cuál rige cada uso al construir en Figma.
- **Sin evidencia de contraste:** el texto de Stitch afirma contrastes («exceeds WCAG AAA»). No está verificado; solo `accessibility-reviewer` puede afirmarlo.
- Estos IDs se vinculan a Variables de Figma cuando exista el diseño gobernado.

| Token | Valor |
|---|---|
| `TKN-color-primary` | `#0F4C81` |
| `TKN-color-primary-hover` | `#0D3F6B` |
| `TKN-color-secondary` | `#1F2937` |
| `TKN-color-tertiary` | `#0284C7` |
| `TKN-color-surface-canvas` | `#F8F9FA` |
| `TKN-color-surface-elevated` | `#FFFFFF` |
| `TKN-color-border-subtle` | `#E5E7EB` |
| `TKN-color-border-default` | `#D1D5DB` |
| `TKN-color-text-primary` | `#111827` |
| `TKN-color-text-secondary` | `#4B5563` |
| `TKN-color-error-border` | `#DC2626` |
| `TKN-color-error` | `#BA1A1A` |
| `TKN-focus-ring` | `2px solid #0F4C81, offset 2px #FFFFFF` |
| `TKN-font-family` | `Inter` |
| `TKN-radius-default` | `8px` |
| `TKN-radius-container` | `12px` |
| `TKN-space-md` | `16px` |
| `TKN-space-lg` | `24px` |
| `TKN-space-xl` | `32px` |
