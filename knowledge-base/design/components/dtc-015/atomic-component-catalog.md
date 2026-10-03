---
type: Atomic Component Catalog
title: "Catálogo atómico — DTC-015 (Registrar un colaborador)"
description: "Componentes de @gf/ui y mfe-collaborators con clasificación atómica, estado real y brecha."
tags: [ux-ui, components, atomic-design, angular, dtc-015]
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-10-02T00:40:00-05:00"
sources:
  - id: review
    resource: /knowledge-base/design/components/dtc-015/technical-design-review.md
  - id: cmp-015
    resource: /knowledge-base/design/components/CMP-015-componentes-registrar-colaborador.md
---

# Catálogo atómico

Rutas relativas a `codebase/apps/portal/projects/`. **Estado** = lo observado en el código (existencia, export en `public-api.ts`, spec). No se verificó comportamiento.

Leyenda: `OK` existe+exportado · `NO-EXPORT` existe, no está en `public-api.ts` · `LOCAL` vive en el MFE (no va a la librería) · `MISSING` no existe.

## Atoms (`@gf/ui`, `ui/src/lib/atoms/`)
| ID | Selector | Estado | Spec | Notas |
|---|---|---|---|---|
| CMP-ATOM-001 | `gf-button` | OK | no | |
| CMP-ATOM-002 | `gf-badge` | OK | no | |
| CMP-ATOM-003 | `gf-level-badge` | OK | no | Rol-Nivel |
| CMP-ATOM-004 | `gf-spinner` | OK | no | |
| CMP-ATOM-005 | `gf-text-input` | OK | sí | usa `@angular/forms` |
| CMP-ATOM-006 | `gf-email-input` | OK | sí | usa `@angular/forms` |
| CMP-ATOM-007 | `gf-tel-input` | OK | sí | usa `@angular/forms`; no requerido por SCR-015 |
| CMP-ATOM-008 | `gf-select` | OK | sí | usa `@angular/forms` |
| CMP-ATOM-009 | `gf-label` | OK | sí | |
| CMP-ATOM-010 | `gf-error-message` | OK | sí | |
| CMP-ATOM-011 | `gf-icon` | OK | sí | |
| CMP-ATOM-012 | `gf-date-input` | OK | sí | `<input type="date">` nativo, no Material |

## Molecules (`@gf/ui`, `ui/src/lib/molecules/`)
| ID | Selector | Estado | Spec | Notas |
|---|---|---|---|---|
| CMP-MOL-001 | `gf-alert` | OK | no | |
| CMP-MOL-002 | `gf-empty-state` | OK | no | |
| CMP-MOL-003 | `gf-view-state` | OK | no | loading/error/empty |
| CMP-MOL-004 | `gf-form-field` | **NO-EXPORT** | sí | label + control + error |
| CMP-MOL-005 | `gf-autocomplete` | **NO-EXPORT** | sí | combobox async |
| CMP-MOL-006 | `gf-radio-card` | **NO-EXPORT** | sí | |

## Shells / páginas / pasos (`mfe-collaborators/src/app/`)
| ID | Elemento | Nivel | Estado | Notas |
|---|---|---|---|---|
| CMP-SHELL-001 | `app-shell-form-step` (`shared/shells/form-step`) | template/shell | LOCAL, existe (69 líneas) | usa `gf-button` ×3; sin spec |
| CMP-SHELL-002 | `modal` (`shared/shells/modal`) | shell | LOCAL, existe (54 líneas) | sin spec |
| PAGE-COLLAB-001 | `register-collaborator.page` | page | LOCAL, **esqueleto** (88 líneas) | no usa `gf-*`; tiene spec |
| ORG-COLLAB-001…009 | 9 pasos del registro (SCR-015-01..09) | organism de dominio | **MISSING** | ligados a campos del colaborador: no van a `@gf/ui` |
| MOL-COLLAB-001 | Resumen de revisión (SCR-015-08) | molecule de dominio | **MISSING** | lista de solo lectura con «Editar» por sección |
| ATOM-NEW-001 | Código con «Copiar» (SCR-015-09) | atom/molecule | **MISSING** | candidato a `@gf/ui` si se reutiliza; decidir |

## No UI (orquestación, ya existen)
`core/commands/register-collaborator.command.ts` (con spec), `search.commands.ts`, `core/services/error-mapper.service.ts`, `register-collaborator.service.ts`, `shared/validators/duplicate-id.validator.ts` (con spec), `duplicate-email.validator.ts` y `url.validator.ts` (sin spec).

## Reglas de dependencia observadas/exigidas
Atoms no dependen de páginas ni de servicios de negocio; la librería declara «sin HttpClient ni lógica de negocio» (`public-api.ts`). Los pasos (ORG-COLLAB) orquestan datos vía comandos, no los atoms.
