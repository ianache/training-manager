---
type: Technical Design Review
title: "Revisión técnica de componentes — DTC-015 (Registrar un colaborador)"
description: "Análisis atómico y de brecha de DTC-015 contra @gf/ui y mfe-collaborators reales. Resultado: REQUIRES_REVIEW."
tags: [ux-ui, components, atomic-design, angular, party, dtc-015]
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-10-02T00:40:00-05:00"
sources:
  - id: dtc-015
    resource: /knowledge-base/implementation/DTC-015-handoff-desarrollo.md
  - id: cmp-015
    resource: /knowledge-base/design/components/CMP-015-componentes-registrar-colaborador.md
  - id: arch-cmp-015
    resource: /knowledge-base/design/architecture/ARCH-CMP-015-libreria-componentes-shell-microui.md
  - id: codebase-analysis-015
    resource: /knowledge-base/implementation/CODEBASE-ANALYSIS-015-alineacion-arch-ui.md
  - id: scr-015
    resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
  - id: hof-ppm-001
    resource: /knowledge-base/design/handoff/HOF-PPM-001-registrar-colaborador.md
---

# Revisión técnica — DTC-015

**Estado: `REQUIRES_REVIEW`** (no `READY_FOR_DEV`, no `BLOCKED`). `READY_FOR_DEV` no implica aprobación humana; ningún agente fija `human-reviewed`.

Salidas de esta revisión (misma carpeta): [ui-inventory](ui-inventory.md) · [micro-ui-boundary-analysis](micro-ui-boundary-analysis.md) · [atomic-component-catalog](atomic-component-catalog.md) · [npm-package-contract](npm-package-contract.md).

## Método y alcance
Se inspeccionó el código real (`codebase/apps/portal/projects/{ui,mfe-collaborators}`) y se contrastó con DTC-015, CMP-015, ARCH-CMP-015 y CODEBASE-ANALYSIS-015. **Solo lectura estructural**: se listaron archivos, selectores, exports, specs y dependencias. **No se ejecutaron las pruebas ni se compiló**; no se afirma comportamiento (accesibilidad, validaciones) de ningún componente.

No se produjeron (y por qué): especificación por componente (`component-spec-template`) para los 18 componentes existentes — ya existen en código y CMP-015; se recomienda especificar solo los componentes con brecha, tras resolver F-01; `design-token-contract`, `accessibility-matrix`, `visual-test-matrix`, `development-context-pack`: dependen del diseño gobernado, que no existe (gate `DESIGN_READY_FOR_DEV` = FAILED).

## Hallazgos

| ID | Sev. | Hallazgo | Evidencia |
|---|---|---|---|
| F-01 | **Alta** | **DTC-015 y CODEBASE-ANALYSIS-015 están desactualizados.** Marcan como «crear» 5 atoms y 3 molecules que ya existen en `@gf/ui` | `ui/src/lib/atoms/*` (12 atoms), `molecules/*` (6) |
| F-02 | **Alta** | **CMP-015 y GEN-015 especifican Angular Material** (`mat-form-field`, `mat-select`, `mat-datepicker`…). El código **no tiene** `@angular/material` ni `@angular/cdk`; `gf-date-input` usa `<input type="date">` nativo | `package.json` sin Material/CDK; `date-input.ts:9` |
| F-03 | **Alta** | **La página de registro es un esqueleto**: 88 líneas, un `<form>` con «Form content will be populated by 9 step components» y un `<button>` crudo; no usa ningún `gf-*`. Los 9 pasos, el resumen (SCR-015-08) y el éxito con «Copiar» (SCR-015-09) no existen | `register-collaborator.page.ts` |
| F-04 | **Alta** | **Tokens divergentes.** La librería ya define `--gf-*` con primario `#0F2942`; el set elegido por ianache (TKN-SET-001, Sovereign Enterprise) usa `#0F4C81`. Otros valores también difieren (texto, borde) | `ui/src/styles/tokens.css:9,19,21` vs TKN-SET-001 |
| F-05 | Media | 3 molecules (`gf-form-field`, `gf-autocomplete`, `gf-radio-card`) **no se exportan** en `public-api.ts`: no forman parte del paquete publicable. Existen barrels sin usar | `public-api.ts`, `molecules.barrel.ts` |
| F-06 | Media | `@gf/ui` importa `@angular/forms` en 4 atoms pero **no lo declara** como peer dependency | `text/email/tel-input.ts`, `select.ts`; `projects/ui/package.json` |
| F-07 | Media | 7 de 18 componentes de la librería no tienen spec (button, badge, level-badge, spinner, alert, empty-state, view-state) y `duplicate-email.validator.ts` y `url.validator.ts` tampoco | búsqueda de `*.spec.ts` |
| F-08 | Media | Frontera: no hay evidencia de equipo propietario ni autonomía de despliegue de `mfe-collaborators`; ADR-009 (composición con Native Federation) fue **rechazado** y la técnica quedó abierta | ADR-009; ADR-001 |
| F-09 | Baja | SCR-015-10 es una hoja de referencia de mensajes (decisión de ianache): no necesita ruta. `error-mapper.service.ts` ya mapea E-códigos | `error-mapper.service.ts` |
| F-10 | Media | Conflicto de referencias de diseño: CMP-015 (Material) vs código (componentes propios) vs diseño Stitch/Figma (Sovereign). Sin decisión de precedencia | F-02, F-04 |

## Decisiones humanas necesarias
1. **Material o `gf-*`** (F-02/F-10): recomendación basada en la evidencia — mantener `gf-*` ya construidos (sin Material) y **actualizar CMP-015/GEN-015**. Decisión de ianache / arquitectura.
2. **Tokens** (F-04): ¿el diseño (Sovereign `#0F4C81`) o el código (`#0F2942`) manda? Hay que reconciliar `TKN-SET-001` ↔ `--gf-*`.
3. **Frontera** (F-08): confirmar que el registro vive como módulo dentro de `mfe-collaborators` y quién lo posee.
4. **Alcance de exportación** (F-05): ¿se publican las 3 molecules?

## Siguiente acción por responsable
- **ianache (decisiones 1–4)** → habilita especificar solo las brechas.
- **Diseño:** autorizar Figma y cerrar el gate para SCR-015 (ver HOF-PPM-001).
- **Desarrollo (tras lo anterior):** implementar los 9 pasos, resumen y éxito; exportar molecules; declarar el peer `@angular/forms`; añadir specs faltantes. Se debe corregir DTC-015 antes de usarlo como contexto.

## Compatibilidad con la convención del repositorio
La skill pide `status ∈ {READY_FOR_DEV, REQUIRES_REVIEW, BLOCKED}` y `AGENTS.md` pide `status: draft`. Aquí `status: draft` (convención OKF del repositorio) y el estado de la skill va en `readiness`. No se fijó `verified` ni `human-reviewed`.

## Actualización 2026-10-02 — decisiones y estado del árbol

**Decisiones de `human:ianache`:**
1. **Material o `gf-*`** (F-02/F-10): **`gf-*`**. CMP-015 y GEN-015 llevan un aviso; no se usa Material.
2. **Tokens** (F-04): se pidió `#0F4C81` (TKN-SET-001), pero una decisión posterior del mismo día **lo sustituyó** por [TKN-SET-002](../tokens/TKN-SET-002-comsatel-styled.md) «Comsatel Styled» (primario `#bc0100`). Rige TKN-SET-002; `tokens.css` ya lo refleja.
3. **Frontera** (F-08): `mfe-collaborators` **es un MicroUI**; el registro permanece como módulo dentro de él (`FRONTEND_MODULE`). El **equipo propietario sigue sin nombrarse**.
4. **Exports** (F-05): **sí**. Aplicado por otra sesión; `node tools/check-ui-library.mjs` pasa (exports, peer `@angular/forms`, sin Material/CDK, token primario).

**Este documento está desactualizado respecto del árbol de trabajo.** Tras redactarlo, otra sesión modificó `codebase/` (sin commit): la página de registro dejó de ser un esqueleto (295 líneas, 9 `steps/*`, `store`, `rules`, `api`) y se **eliminaron** `core/commands/*`, `core/services/*`, `shared/shells/*`, `duplicate-email/duplicate-id.validator*`, `register-collaborator.page.spec.ts` y cuatro specs de `@gf/ui` (icon, autocomplete, form-field, radio-card). Por tanto:

| Hallazgo | Estado |
|---|---|
| F-01 DTC-015 desactualizado | Sigue vigente y ahora también refiere archivos eliminados |
| F-02 Material | Resuelto (decisión 1) |
| F-03 página esqueleto | **Obsoleto**: existe una implementación sin revisar |
| F-04 tokens | Resuelto por decisión posterior (TKN-SET-002) |
| F-05 molecules sin exportar | Resuelto (verificado por el check) |
| F-06 peer `@angular/forms` | Resuelto (verificado por el check) |
| F-07 specs faltantes | **Empeoró**: se eliminaron specs de 3 molecules y de `gf-icon` |
| F-08 frontera | Parcial (MicroUI confirmado; falta equipo) |

El [catálogo atómico](atomic-component-catalog.md) y el [inventario UI](ui-inventory.md) describen el árbol anterior (shells, comandos y validadores que ya no existen) y deben regenerarse contra el árbol actual. Esa implementación **no fue revisada aquí** y no pasó el gate de diseño (`DESIGN_READY_FOR_DEV` = FAILED para SCR-015).
