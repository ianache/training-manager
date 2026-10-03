---
type: NPM Package Contract
title: "Contrato NPM de @gf/ui — brechas para DTC-015"
description: "Estado real de exports, peer dependencies, tokens y semver de @gf/ui; cambios necesarios."
tags: [ux-ui, npm, angular, library, dtc-015]
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-10-02T00:40:00-05:00"
sources:
  - id: catalog
    resource: /knowledge-base/design/components/dtc-015/atomic-component-catalog.md
  - id: tkn
    resource: /knowledge-base/design/tokens/TKN-SET-001-sovereign-enterprise.md
---

# Contrato NPM — `@gf/ui`

Fuente: `codebase/apps/portal/projects/ui/package.json` y `src/public-api.ts`.

## Estado actual
- Paquete `@gf/ui` **0.0.1**, `sideEffects: false`, dependencia `tslib`.
- Peer dependencies: `@angular/common ^22.2.0`, `@angular/core ^22.2.0`, `@gf/core ^0.0.1`.
- Exports: 12 atoms y `gf-alert`, `gf-empty-state`, `gf-view-state`.

## Brechas y cambio propuesto
| # | Cambio | Impacto semver (paquete 0.x) | Nota |
|---|---|---|---|
| 1 | Exportar `gf-form-field`, `gf-autocomplete`, `gf-radio-card` (los barrels ya existen) | Aditivo (minor) | Decisión de alcance pendiente (F-05) |
| 2 | Declarar `@angular/forms ^22.2.0` como peer dependency (4 atoms lo importan) | Corrige un contrato incompleto | Hoy un consumidor sin `@angular/forms` fallaría al compilar |
| 3 | Reconciliar `src/styles/tokens.css` (`--gf-*`) con TKN-SET-001 | Puede cambiar el aspecto visual (primario `#0F2942` → `#0F4C81`): tratarlo como cambio visible | Decisión de ianache (F-04) |
| 4 | Código con «Copiar» (SCR-015-09) | Aditivo si entra en la librería | Solo si hay segundo consumidor |

No se propone dependencia de `@angular/material` ni `@angular/cdk` (no existen hoy; ver F-02).

## Mapeo de tokens (a completar tras la decisión 2)
| TKN-SET-001 | `--gf-*` actual | Valores |
|---|---|---|
| TKN-color-primary | `--gf-color-primary` | `#0F4C81` ≠ `#0f2942` |
| TKN-color-text-primary | `--gf-color-text` | `#111827` ≠ `#0f172a` |
| TKN-color-border-default | `--gf-color-border` | `#D1D5DB` ≠ `#cbd5e1` |
| TKN-font-family | `--gf-font-family` | Inter = Inter (coincide) |
| TKN-radius-default | `--gf-radius-md` | `8px` = `8px` (coincide) |
| TKN-space-md | `--gf-space-4` | `16px` = `1rem` (coincide) |

Sin cambios de código en este trabajo.
