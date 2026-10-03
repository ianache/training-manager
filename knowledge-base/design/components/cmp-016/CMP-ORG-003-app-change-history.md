---
id: CMP-ORG-003
type: Component
title: 'CMP-ORG-003 — Historial de cambios'
description: 'Mostrar el historial de cambios de la ficha de una persona (quién, cuándo, qué, valor anterior y nuevo, vigencia).'
tags:
- ux-ui
- component
- organism
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

# CMP-ORG-003 — Historial de cambios

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-ORG-003`
- **Nombre y selector:** Historial de cambios · `app-change-history`
- **Nivel atómico:** organism — sección de dominio que reúne filtros, tabla de auditoría, paginación y estados, con responsabilidad de presentar el registro de cambios de una persona.
- **Propósito:** Mostrar el historial de cambios de la ficha de una persona (quién, cuándo, qué, valor anterior y nuevo, vigencia).
- **Fuera de alcance:** Pedir los datos al servidor ni decidir permisos (los decide la página y el servidor).
- **Consumidores:** SCR-016-06.
- **Ubicación:** Local en `mfe-collaborators`; no va a `@gf/ui` por estar ligado al dominio de colaboradores.

## Composición

- **Hijos permitidos:** `gf-view-state` (CMP-MOL-003), `gf-select` (categoría y «realizado por»), `gf-date-range` (CMP-MOL-010), `gf-pagination` (CMP-MOL-009), `gf-vigencia-badge` (CMP-MOL-008), `gf-empty-state` (CMP-MOL-002).
- **Dirección de dependencia:** Presentacional: la página consulta el servicio y le entrega los datos. Sin HTTP dentro del componente.
- **Búsqueda de reutilización y decisión:** No existe una tabla de auditoría. Se usa una tabla HTML semántica dentro del organismo y no se crea un `gf-table` genérico hasta que otra pantalla lo necesite.

## Contrato Angular

```ts
export type HistoryCategory = 'PERSONAL' | 'EMAIL' | 'PHONE' | 'PROFILE';
export type HistoryChange = 'CORRECTION' | 'VIGENCY_CHANGE' | 'PROFILE_ADDED' | 'PROFILE_REMOVED';
export interface HistoryEntry {
  at: string;                                   // fecha y hora ISO con zona horaria
  actor: { name: string; role: string } | null; // null = «Sistema»
  category: HistoryCategory;
  change: HistoryChange;
  field: string;                                // «Apellidos», «Correo laboral», «GitHub»…
  oldValue: string | null;
  newValue: string | null;
  validFrom?: string;
  validTo?: string | null;
}
export interface HistoryFilters {
  category: HistoryCategory | null;
  range: DateRange;
  actorId: string | null;   // solo el Jefe de Ingeniería
}
export interface AppChangeHistoryInputs {
  entries: readonly HistoryEntry[];
  total: number;
  page: number;
  pageSize: number;
  filters: HistoryFilters;
  canFilterByActor: boolean; // true solo para el Jefe de Ingeniería
}
export type AppChangeHistoryOutputs = { filtersChange: HistoryFilters; pageChange: number };
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Columnas (propuesta confirmada, SCR-016-Q18):** fecha y hora, realizado por, categoría, cambio, campo o medio, valor anterior, valor nuevo y vigencia.
- **Entradas:** ver el contrato; `canFilterByActor` es verdadero solo para el Jefe de Ingeniería (decisiones SCR-016-Q18 y Q19); `pageSize` por defecto 10.
- **Salidas:** `filtersChange` y `pageChange`.
- **Orden:** del más reciente al más antiguo.
- **Valores de personas anonimizadas:** se muestran tal como llegan del servidor, que los anonimiza (BR-PTY-14); el componente no reconstruye ni oculta datos.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una |
| Con datos | tabla ordenada de lo más reciente a lo más antiguo, filtros arriba y paginación abajo |
| Cargando / error | con `gf-view-state` (cargando y reintentar) |
| Vacío | «Aún no hay cambios registrados» (texto propuesto); con filtros activos: «Ningún cambio coincide con los filtros» (propuesta) |
| Deshabilitado | No aplica (solo lectura) |
| Responsive | Escritorio (SCR-016) |
| Localización | dd/mm/aaaa y hora de 24 h (HH:mm), en hora de Lima (UTC−5) (decisión CMP-016-Q6) |
| Tokens | `TKN-color-on-surface`, `TKN-color-on-surface-variant`, `TKN-color-outline-variant`, `TKN-color-surface`, `TKN-space-md`, `TKN-space-lg` |

## Accesibilidad y seguridad

- Tabla semántica con `caption`, encabezados `th scope="col"` y filas con `th scope="row"` para la fecha; nada se comunica solo por color.
- Filtros agrupados con `role="search"` o `fieldset` y etiquetas visibles; al aplicar un filtro, el número de resultados se anuncia en una región `aria-live="polite"`.
- Teclado: orden natural filtros → tabla → paginación.
- Seguridad y privacidad: muestra datos personales (identificación, teléfono, correo) solo si el servidor los entrega, es decir, a la propia persona o al Jefe de Ingeniería (SCR-016-Q19); el contenido de los valores se escapa.

## Verificación

- Unitarias: ordena por fecha descendente; vacío con y sin filtros; `canFilterByActor` falso oculta ese filtro; emite `filtersChange` y `pageChange`.
- Interacción: aplicar y limpiar filtros, cambiar de página con teclado.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo (local)
- **Impacto semver:** no aplica (no es parte de la librería)
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q9:** No existe un endpoint de historial. El contrato `HistoryEntry` fue aceptado como base por `human:ianache` (2026-10-02); falta acordarlo con el servicio de Party.
- **CMP-016-Q6:** *Resuelta*: dd/mm/aaaa y hora de 24 h (HH:mm), en hora de Lima (UTC−5). El formato lo decidió `human:ianache` («el más usado»); la hora de Lima fija es decisión del agente (la plataforma usa UTC−5 en toda la documentación), reversible.
- **CMP-016-Q7:** *Resuelta* (`human:ianache`, 2026-10-02): 10 por página, configurable (ver CMP-MOL-009).
- Cómo se identifica a «realizado por» en el filtro (por nombre o por identificador) queda por definir con el servicio.

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-06 → `CMP-ORG-003`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
