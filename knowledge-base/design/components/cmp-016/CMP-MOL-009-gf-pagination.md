---
id: CMP-MOL-009
type: Component
title: 'CMP-MOL-009 — Paginación'
description: 'Navegar entre páginas de una lista y mostrar el rango visible.'
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
screens: [SCR-016-06]
requirements: [US-016, UXR-016]
---

# CMP-MOL-009 — Paginación

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-MOL-009`
- **Nombre y selector:** Paginación · `gf-pagination`
- **Nivel atómico:** molecule — compone botones y un indicador de página para una sola interacción: moverse entre páginas.
- **Propósito:** Navegar entre páginas de una lista y mostrar el rango visible.
- **Fuera de alcance:** Pedir los datos de cada página ni decidir el tamaño de página.
- **Consumidores:** CMP-ORG-003 (historial); reutilizable por otras listas.
- **Ubicación:** `@gf/ui` (`ui/src/lib/molecules/pagination/`), exportado en `public-api.ts`.

## Composición

- **Hijos permitidos:** `gf-button` (CMP-ATOM-001) para Anterior y Siguiente; texto con el rango.
- **Dirección de dependencia:** Depende de `gf-button`.
- **Búsqueda de reutilización y decisión:** No existe paginación en `@gf/ui`; la lista de colaboradores pagina con parámetros (`page`, `limit`) pero sin componente reutilizable.

## Contrato Angular

```ts
export interface GfPaginationInputs {
  page: number;      // 1-based
  pageSize?: number; // por defecto 10, configurable
  total: number;     // total de registros
}
export type GfPaginationOutputs = { pageChange: number };
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** `page`, `pageSize` (por defecto **10**, configurable por el consumidor), `total`.
- **Salidas:** `pageChange` con la nueva página.
- **Exportación pública:** `GfPagination`.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una |
| Normal | «Anterior», «Página X de Y», «Siguiente» y «Mostrando a–b de N» |
| Deshabilitado | «Anterior» en la primera página y «Siguiente» en la última |
| Vacío | Sin registros no se muestra |
| Responsive | Escritorio (SCR-016) |
| Tokens | `TKN-color-primary`, `TKN-color-on-surface`, `TKN-color-outline` |

## Accesibilidad y seguridad

- Contenedor `nav` con `aria-label="Paginación"`; los botones son `button` nativos con nombre accesible («Página anterior», «Página siguiente»).
- Cambio de página anunciado en una región `aria-live="polite"` («Página 2 de 5»).
- Teclado: Tab y Enter o Espacio; sin atajos propios.

## Verificación

- Unitarias: límites de la primera y la última página; emite `pageChange`; calcula el rango «a–b de N».
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q7:** *Resuelta* (`human:ianache`, 2026-10-02): **10** registros por página, configurable. La lista de colaboradores usa 20 hoy; no se unifican.

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-06 → `CMP-MOL-009`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
