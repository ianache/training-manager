---
id: CMP-MOL-011
type: Component
title: 'CMP-MOL-011 — Pestañas'
description: 'Cambiar entre secciones de una vista (Resumen e Historial en la ficha).'
tags:
- ux-ui
- component
- molecule
- us-016
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: web-atomic-component-designer/1.0
  at: '2026-10-02T23:30:00-05:00'
sources:
- id: scr-016
  resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
- id: flw-016
  resource: /knowledge-base/design/user-flows/FLW-016-actualizar-datos-y-contactos.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: catalog-015
  resource: /knowledge-base/design/components/dtc-015/atomic-component-catalog.md
flow: FLW-016
screens: [SCR-016-05]
requirements: [US-016, UXR-016]
---

# CMP-MOL-011 — Pestañas

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-MOL-011`
- **Nombre y selector:** Pestañas · `gf-tabs`
- **Nivel atómico:** molecule — agrupa pestañas y su selección para una sola interacción: cambiar de sección.
- **Propósito:** Cambiar entre secciones de una vista (Resumen e Historial en la ficha).
- **Fuera de alcance:** Cargar el contenido de cada sección ni sincronizar la ruta (lo hace el consumidor).
- **Consumidores:** SCR-016-05 (ficha).
- **Ubicación:** `@gf/ui` (`ui/src/lib/molecules/tabs/`), exportado en `public-api.ts`.

## Composición

- **Hijos permitidos:** Una lista de pestañas y un panel por pestaña (contenido proyectado).
- **Dirección de dependencia:** No depende de otros componentes; no conoce el router.
- **Búsqueda de reutilización y decisión:** `@gf/ui` no tiene pestañas. Decisión (CMP-016-Q8): patrón de pestañas `tablist` sincronizado con el router; no se usa una navegación con enlaces.

## Contrato Angular

```ts
export interface GfTab { id: string; label: string; disabled?: boolean }
export interface GfTabsInputs {
  tabs: readonly GfTab[];
  selected: string;      // id de la pestaña activa
  ariaLabel: string;     // p. ej. 'Secciones de la ficha'
}
export type GfTabsOutputs = { selectedChange: string };
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** `tabs`, `selected`, `ariaLabel`.
- **Salidas:** `selectedChange` con el id elegido; el consumidor actualiza la ruta (por ejemplo `/colaboradores/:id/historial`).
- **Proyección de contenido:** un panel por pestaña, identificado por su id.
- **Exportación pública:** `GfTabs`, tipo `GfTab`.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una (horizontal) |
| Normal | pestaña activa resaltada por subrayado y peso, no solo por color |
| Deshabilitado | pestaña no seleccionable |
| Responsive | Escritorio (SCR-016) |
| Tokens | `TKN-color-primary`, `TKN-color-on-surface`, `TKN-color-outline-variant`, `TKN-color-tertiary` (foco) |

## Accesibilidad y seguridad

- Patrón de pestañas de WAI-ARIA APG: `role="tablist"`, `role="tab"` con `aria-selected` y `aria-controls`, `role="tabpanel"` con `aria-labelledby`.
- Teclado: Flechas izquierda y derecha mueven entre pestañas, Inicio y Fin saltan a los extremos; solo la pestaña activa está en el orden de tabulación.
- Activación automática al mover el foco (propuesta); foco visible con `TKN-color-tertiary`.

## Verificación

- Unitarias: selecciona por clic y por teclado; emite `selectedChange`; ignora pestañas deshabilitadas.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q8:** *Resuelta* (`human:ianache`, 2026-10-02): pestañas con `tablist`, sincronizadas con el router (cada pestaña tiene su ruta, por ejemplo `/colaboradores/:id/historial`).

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-05 → `CMP-MOL-011`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
