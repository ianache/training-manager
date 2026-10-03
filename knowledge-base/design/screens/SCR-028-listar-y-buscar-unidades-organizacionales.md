---
type: Screen
title: SCR-028 — Listar y buscar unidades organizacionales
description: Especificación de la pantalla de gestión de unidades organizacionales (consulta con búsqueda, filtros, orden y alternancia lista/jerarquía) para el Jefe de Ingeniería.
tags:
- ux-ui
- screen
- party
- estructura-organizacional
- unidades
- listado
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-03T16:00:00-05:00'
sources:
- id: flw-028
  resource: /knowledge-base/design/user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md
- id: uxr-028
  resource: /knowledge-base/design/ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-028
  resource: /knowledge-base/requirement/user-stories/US-028-listar-y-buscar-unidades-organizacionales.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: scr-016
  resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
screens:
- id: SCR-028-01
  name: Gestión de unidades organizacionales (lista y jerarquía)
  flow: FLW-028
  requirements:
  - US-028
  - UXR-028
  - UXR-000
  required_states:
  - default
  - loading
  - results
  - no-organization
  - empty
  - no-results
  - forbidden
  - error
  responsive:
  - desktop
  a11y_requirements:
  - WCAG-2.2-AA
  - keyboard-nav
  - focus-visible
  - accessible-names
  - aria-sort
  - tree-roles
  - status-announcement
  components:
  - CMP-015
  - CMP-016
  - CMP-MOL-008
  - CMP-MOL-009
  - CMP-MOL-011
  tokens:
  - TKN-color-primary
  - TKN-color-on-primary
  - TKN-color-surface
  - TKN-color-on-surface
  - TKN-color-on-surface-variant
  - TKN-color-outline
  - TKN-color-outline-variant
  - TKN-color-tertiary
  - TKN-color-error
  - TKN-color-error-container
  - TKN-font-family
  - TKN-radius-default
  - TKN-space-md
  - TKN-space-lg
---

# SCR-028 — Listar y buscar unidades organizacionales

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Tokens: «Comsatel Styled» (`TKN-SET-002`), como SCR-016. Componentes reutilizados de `CMP-015` y `CMP-016`; los que faltan se listan como brecha (SCR-028-Q2).

## Trazabilidad

- **Lineage:** US-028 (AC-1 a AC-6) → UXR-028 (hereda UXR-000) → FLW-028 → SCR-028-01.
- **Reglas:** BR-PTY-04, BR-PTY-17, BR-PTY-20, BR-PTY-21. **Evidencia:** EVD-2026-0133, EVD-2026-0142.
- **Alcance de dispositivo:** solo escritorio, supuesto heredado de SCR-015/016 (ver SCR-028-Q1); ni UXR-028 ni FLW-028 lo dicen.
- **FLW-028-Q1:** se especifica **una sola pantalla** con alternancia lista/jerarquía, porque UXR-028 conserva búsqueda y filtros al alternar. Propuesta de este agente, pendiente de confirmación (SCR-028-Q3).

## Permisos

| Actor | Acceso |
|---|---|
| Jefe de Ingeniería | Ve Activas e Inactivas y sus conteos; accede a editar, desactivar y reactivar (BR-PTY-17) |
| Otros colaboradores | No acceden; estado `forbidden` sin datos de la estructura (BR-PTY-20) |

## SCR-028-01 — Gestión de unidades organizacionales

**Propósito:** ubicar una unidad y entender la estructura vigente. Es la pantalla de entrada de la gestión; los flujos de UXR-029 y UXR-030 parten de una fila.

### Zonas

1. **Barra de consulta:** búsqueda por nombre (coincidencia parcial), filtro de estado (Activa por defecto / Inactiva / Todas), filtro de unidad padre (incluye descendientes) y alternador de vista Lista / Jerarquía.
2. **Filtros activos:** siempre visibles, con «Limpiar filtros». Los cambios se anuncian a lectores de pantalla.
3. **Resultados:** vista Lista (tabla) o vista Jerarquía (árbol).
4. **Acciones por fila:** editar (UXR-029), desactivar o reactivar (UXR-030) según el estado de la unidad.

### Vista Lista

| Columna | Contenido | Orden | Fuente |
|---|---|---|---|
| Nombre | Nombre de la unidad | asc/desc | AC-5 |
| Unidad padre | Nombre del padre vigente | asc/desc | AC-5 |
| Estado | «Activa» / «Inactiva», con texto (no solo color) | asc/desc | AC-5, BR-PTY-21 |
| Vigencia | Desde y hasta (hasta solo en Inactivas), con etiqueta de vigencia | por «vigencia desde» | AC-5, TRM-0092 |
| Unidades hijas activas | Conteo | no | US-028 §8 |
| Personas vigentes | Conteo (lista pendiente, UXR-028-Q5) | no | US-028 §8 |
| Acciones | Editar / Desactivar o Reactivar | no | FLW-028 paso 7 |

Encabezados asociados a las celdas y `aria-sort` en la columna ordenada; el orden activo se anuncia. Orden por defecto abierto (UXR-028-Q2).

### Vista Jerarquía

Cada unidad bajo su unidad padre vigente; roles `tree`/`treeitem`; expandir/colapsar con flechas y Enter; anuncia nivel y estado expandido. Muestra estado y vigencia por nodo. Búsqueda y filtros se conservan al alternar. Comportamiento con filtros Inactiva/Todas cuando el padre no cumple el filtro: abierto (FLW-028-Q6).

### Estados

| Estado | Condición y comportamiento | Fuente |
|---|---|---|
| default / results | Lista de unidades Activas; el filtro de estado muestra «Activa» | AC-1 |
| loading | Indicador de progreso anunciado a lectores de pantalla | UXR-028 §4 |
| no-organization | No existe la organización interna; remite a registrarla (UXR-017) | UXR-028 §4 |
| empty | Sin unidades registradas; acción para registrar la primera (UXR-029) | UXR-028 §4 |
| no-results | Sin coincidencias; muestra filtros activos y «Limpiar filtros»; foco gestionado | US-028 §6 |
| forbidden | Usuario no Jefe; sin datos de la estructura; qué se ofrece queda abierto (FLW-028-Q5) | BR-PTY-17 |
| error | Falla la consulta; mensaje con «Reintentar» (vuelve a loading); conservación de filtros abierta (FLW-028-Q3) | UXR-028 §4 |

No se especifica estado `disabled`: la pantalla no tiene formulario ni guardado; qué se deshabilita durante `loading` no tiene fuente (SCR-028-Q4). Tampoco se especifica confirmación tras editar/desactivar/reactivar: abierto (FLW-028-Q4).

### Textos (de fuente)

«Activa», «Inactiva», «Unidad padre», «Vigencia desde/hasta», «Limpiar filtros». Nunca «Eliminada» ni «Borrada» (BR-PTY-21). Los demás textos (vacío, error, sin permisos) no tienen redacción en las fuentes y quedan pendientes (SCR-028-Q5).

## Implementation Requirements

Biblioteca: `@gf/ui` (Angular 22, componentes standalone), sin `@angular/material` ni `@angular/cdk`. Todo componente usado debe tener su CMP; los faltantes se declaran como brecha y no se sustituyen sin revisión de UX.

### SCR-028-01 — Component Inventory

| Componente | Tipo | Cobertura | Estados | A11y |
|---|---|---|---|---|
| Búsqueda por nombre | text-input (CMP-015) | existe | normal, focus | etiqueta accesible, resultados anunciados |
| Filtro de estado | select nativo `gf-select` (CMP-015) | existe | normal, selected | etiqueta, valor anunciado |
| Filtro de unidad padre | selector de unidad con jerarquía | **brecha** (SCR-028-Q2) | normal, selected | aria, teclado |
| Alternador Lista / Jerarquía | pestañas `gf-tabs` (CMP-MOL-011) o grupo de botones | CMP-MOL-011 cubre pestañas sincronizadas con router; si es alternador sin ruta, brecha (SCR-028-Q3) | seleccionada, no seleccionada | teclado, estado anunciado |
| Filtros activos con «Limpiar filtros» | chips/etiquetas + botón | **brecha** (SCR-028-Q2) | visible, vacío | región anunciada |
| Tabla ordenable | tabla de datos | **brecha** (CMP-ORG-003 es de auditoría; no aplica sin revisión) | cargando, con datos, vacía | `aria-sort`, encabezados asociados |
| Árbol jerárquico | tree view | **brecha** (SCR-028-Q2) | colapsado, expandido, foco | `tree`/`treeitem`, `aria-expanded`, `aria-level` |
| Estado de la unidad | etiqueta `gf-badge` (CMP-015) | existe | Activa, Inactiva | texto, contraste 4.5:1 |
| Vigencia desde/hasta | `gf-vigencia-badge` (CMP-MOL-008) | existe | solo lectura | texto accesible |
| Paginación | `gf-pagination` (CMP-MOL-009) | existe; uso condicionado a UXR-028-Q1 | default, deshabilitada en extremos | teclado |
| Vacío, error, cargando, sin permisos | estado vacío / estado de vista / alerta (CMP-015) | existe | según estado | `role=alert` / `aria-live` |
| Acciones de fila | botón (CMP-015) | existe | default, focus | nombre accesible con la unidad |

### Implementation Checklist

- [ ] Componentes mapeados a `@gf/ui` o declarados como brecha (SCR-028-Q2).
- [ ] Estados cubiertos por el diseño.
- [ ] `aria-sort`, roles de árbol y anuncios de orden/filtros especificados (WCAG 2.2 AA).
- [ ] Preguntas abiertas atendidas antes de generar el diseño.

### Handoff Instructions for Developers

- Angular 22 standalone, `@gf/ui`, tokens semánticos `--gf-*` (nunca valores crudos); sistema `TKN-SET-002`.
- Sin afirmar «coincidencia visual» hasta que exista el diseño gobernado (DTM aún inexistente).
- Referencias cruzadas: FLW-028, US-028, UXR-028, UXR-000.

## Preguntas abiertas

Heredadas (siguen abiertas, ninguna bloquea): UXR-028-Q1 a Q5; FLW-028-Q1 a Q6.

| ID | Pregunta | Bloquea | Origen |
|---|---|---|---|
| SCR-028-Q1 | ¿Solo escritorio o también tableta/móvil? Hoy se hereda de SCR-015/016 | No | UXR-000 |
| SCR-028-Q2 | Brechas de componentes: tabla ordenable, árbol, selector de unidad padre, chips de filtros activos. ¿Se especifican como CMP nuevos? | Diseño | CMP-015/016 |
| SCR-028-Q3 | ¿El alternador Lista/Jerarquía es pestañas con ruta propia o un control sin ruta? Propuesta: una sola pantalla (FLW-028-Q1) | No | FLW-028-Q1 |
| SCR-028-Q4 | ¿Qué controles se deshabilitan durante `loading`? Sin fuente | No | UXR-028 §4 |
| SCR-028-Q5 | Redacción de los mensajes de vacío, sin resultados, error y sin permisos | No | UXR-028 §4 |
