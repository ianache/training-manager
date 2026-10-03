---
id: CMP-MOL-010
type: Component
title: 'CMP-MOL-010 — Rango de fechas'
description: 'Elegir una fecha inicial y una final y validar que el rango sea coherente.'
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

# CMP-MOL-010 — Rango de fechas

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-MOL-010`
- **Nombre y selector:** Rango de fechas · `gf-date-range`
- **Nivel atómico:** molecule — compone dos `gf-date-input` y una regla de coherencia para una sola interacción: elegir un rango.
- **Propósito:** Elegir una fecha inicial y una final y validar que el rango sea coherente.
- **Fuera de alcance:** Aplicar el filtro ni interpretar zonas horarias.
- **Consumidores:** CMP-ORG-003 (filtro del historial).
- **Ubicación:** `@gf/ui` (`ui/src/lib/molecules/date-range/`), exportado en `public-api.ts`.

## Composición

- **Hijos permitidos:** Dos `gf-date-input` (CMP-ATOM-012), etiquetas «Desde» y «Hasta» y `gf-error-message`.
- **Dirección de dependencia:** Depende de `gf-date-input`, `gf-label` y `gf-error-message`.
- **Búsqueda de reutilización y decisión:** `gf-date-input` cubre una fecha; la regla «desde ≤ hasta» y el mensaje compartido justifican la molécula.

## Contrato Angular

```ts
export interface DateRange { from: string | null; to: string | null } // fechas ISO yyyy-mm-dd
export interface GfDateRangeInputs {
  value: DateRange;
  min?: string;
  max?: string;
  disabled?: boolean;
}
export type GfDateRangeOutputs = { rangeChange: DateRange };
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** `value`, límites opcionales `min` y `max`.
- **Salidas:** `rangeChange` solo cuando el rango es válido o está vacío.
- **Validación:** «Desde» no puede ser posterior a «Hasta»; error `rangeInvalid`.
- **Exportación pública:** `GfDateRange`, tipo `DateRange`.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una |
| Normal / error | dos campos de fecha; con rango incoherente muestra «La fecha inicial debe ser anterior o igual a la final» (texto propuesto) y no emite el cambio |
| Vacío | ambos vacíos = sin filtro |
| Deshabilitado | ambos deshabilitados |
| Responsive | Escritorio (SCR-016); dos campos en una fila |
| Localización | etiquetas en español; el selector de fecha nativo del navegador muestra el formato local |
| Tokens | `TKN-color-outline`, `TKN-color-error`, `TKN-color-tertiary` |

## Accesibilidad y seguridad

- Cada campo con su etiqueta visible; el error se asocia con `aria-describedby` y se anuncia con `role="alert"`.
- Teclado: el del campo de fecha nativo.
- Heredado de `gf-date-input`: el control es `<input type="date">` del navegador.

## Verificación

- Unitarias: rango válido emite; rango invertido no emite y muestra el error; limpiar emite el rango vacío.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q6:** *Resuelta*: el valor se maneja como fecha ISO (`yyyy-mm-dd`) y se muestra dd/mm/aaaa (formato más usado en Perú, decisión de `human:ianache`). Los límites del día se interpretan en hora de Lima (UTC−5), decisión del agente, reversible.

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-06 → `CMP-MOL-010`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
