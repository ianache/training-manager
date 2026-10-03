---
type: UI Inventory
title: "Inventario UI — DTC-015 (SCR-015 → componentes)"
description: "Mapeo de las pantallas SCR-015-01..10 a componentes existentes y brechas."
tags: [ux-ui, inventory, components, dtc-015]
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-10-02T00:40:00-05:00"
sources:
  - id: scr-015
    resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
  - id: catalog
    resource: /knowledge-base/design/components/dtc-015/atomic-component-catalog.md
---

# Inventario UI — SCR-015

Solo escritorio (decisión de ianache, 2026-10-01). IDs de componentes: ver el [catálogo](atomic-component-catalog.md). El inventario general de SCR-001..004 está en `knowledge-base/components/ui-inventory.md` y no se modifica.

| Pantalla | Paso | Componentes (existentes) | Brecha |
|---|---|---|---|
| SCR-015-01 | Tipo de colaborador | `gf-radio-card` ×2 (**no exportado**), `gf-button` | export de `gf-radio-card`; paso ORG-COLLAB-001 |
| SCR-015-02 | Datos de la persona | `gf-form-field` (**no exportado**), `gf-text-input`, `gf-label`, `gf-error-message`, `gf-button` | paso ORG-COLLAB-002; indicador de progreso (confirmar si lo cubre CMP-SHELL-001) |
| SCR-015-03 | Identificación | `gf-select` (tipo), `gf-text-input` (número), `gf-autocomplete` o `gf-select` (país), `gf-icon`, `gf-error-message`; `duplicate-id.validator` | paso ORG-COLLAB-003; validación en tiempo real (E5) |
| SCR-015-04 | Correo laboral | `gf-email-input`, `gf-form-field`, `gf-error-message`; `duplicate-email.validator` (sin spec) | paso ORG-COLLAB-004 (E6) |
| SCR-015-05 | Unidad / Proveedor | `gf-autocomplete`, `gf-view-state` (cargando/vacío), `gf-empty-state`, `gf-alert`; `search.commands` | paso ORG-COLLAB-005 (E2, E3, E7) |
| SCR-015-06 | Jefe directo | `gf-autocomplete`, `gf-view-state`, `gf-alert` | paso ORG-COLLAB-006 (E7) |
| SCR-015-07 | Rol-Nivel inicial | `gf-select` ×2, `gf-date-input`, `gf-alert` (nota), `gf-empty-state` | paso ORG-COLLAB-007 (E4, E8); dependencia nivel←rol |
| SCR-015-08 | Revisar y confirmar | `gf-button`, `gf-alert` (error al guardar, E10) | **MOL-COLLAB-001 resumen con «Editar»** (no existe) |
| SCR-015-09 | Éxito | `gf-icon`, `gf-button` ×3 | **ATOM-NEW-001 código con «Copiar»** (no existe); anuncio de estado |
| SCR-015-10 | Hoja de referencia de errores | `error-mapper.service` (E-códigos) | **sin ruta**: es documentación; confirmar con ianache |

## Estados transversales a cubrir (UXR-000.4)
Cargando, vacío, error, sin permisos (E1), sesión vencida (E11): `gf-view-state`, `gf-empty-state`, `gf-alert`, `shell modal`. Cobertura real por componente: **no verificada**.
