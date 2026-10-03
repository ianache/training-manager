---
type: Screen
title: SCR-030 — Desactivar y reactivar unidades organizacionales
description: Especificación de las pantallas para desactivar una unidad (eliminación lógica) con confirmación y bloqueo por dependencias, y para reactivarla bajo un padre Activo.
tags:
- ux-ui
- screen
- party
- estructura-organizacional
- unidades
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-03T16:00:00-05:00'
sources:
- id: flw-030
  resource: /knowledge-base/design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: uxr-030
  resource: /knowledge-base/design/ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-030
  resource: /knowledge-base/requirement/user-stories/US-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: tkn-set-001
  resource: /knowledge-base/design/tokens/TKN-SET-001-sovereign-enterprise.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
screens:
- id: SCR-030-01
  name: Confirmar desactivación de la unidad
  flow: FLW-030
  requirements: &req
  - US-030
  - UXR-030
  - UXR-000
  required_states:
  - default
  - saving
  - success
  - error
  - disabled
  - forbidden
  responsive: &resp
  - desktop
  a11y_requirements: &a11y
  - WCAG-2.2-AA
  - keyboard-nav
  - focus-visible
  - accessible-names
  - focus-trap
  - error-announcement
  components: &cmp
  - CMP-015
  - CMP-016
  tokens: &tok
  - TKN-color-primary
  - TKN-color-on-primary
  - TKN-color-surface
  - TKN-color-on-surface
  - TKN-color-on-surface-variant
  - TKN-color-outline
  - TKN-color-error
  - TKN-color-error-container
  - TKN-font-family
  - TKN-radius-default
  - TKN-space-md
  - TKN-space-lg
- id: SCR-030-02
  name: Desactivación bloqueada por dependencias
  flow: FLW-030
  requirements: *req
  required_states:
  - default
  - loading
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-030-03
  name: Reactivar la unidad (fecha desde)
  flow: FLW-030
  requirements: *req
  required_states:
  - default
  - validation-error
  - saving
  - success
  - error
  - disabled
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components:
  - CMP-015
  - CMP-016
  - CMP-MOL-008
  tokens: *tok
- id: SCR-030-04
  name: Reactivación bloqueada por padre Inactivo
  flow: FLW-030
  requirements: *req
  required_states:
  - default
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-030 — Desactivar y reactivar unidades organizacionales

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Tokens: «Comsatel Styled» (`TKN-SET-002`), con `TKN-SET-001` como conjunto de respaldo (ver SCR-030-Q6). Etiquetas: "Desactivar", "Reactivar", "Inactiva"; nunca "Eliminar" ni "Borrar" (BR-PTY-21).

## Trazabilidad

- **Historia:** US-030 (AC-1 a AC-4). **UX:** UXR-030 (hereda UXR-000). **Flujo:** FLW-030 (flujos 1 y 2; entrada desde el listado de UXR-028).
- **Reglas:** BR-PTY-12, BR-PTY-17, BR-PTY-21, BR-PTY-23, BR-PTY-24.
- **Alcance de dispositivo:** solo escritorio (supuesto heredado de SCR-015/016; ver SCR-030-Q5).
- **Forma de presentación:** no decidida (FLW-030-Q1). Se especifican cuatro pantallas tal como las reserva el FLW; si se resuelve como un diálogo con variantes, se fusionan sin cambiar contenido.

## Permisos por actor

| Actor | Ve y hace | Fuente |
|---|---|---|
| Jefe de Ingeniería | Estado, conteos y acciones; desactiva y reactiva | BR-PTY-17 |
| Otros usuarios | Nada; las acciones no son visibles (estado `forbidden`) | BR-PTY-17 |

## SCR-030-01 — Confirmar desactivación de la unidad

**Propósito:** confirmar la desactivación de una unidad Activa sin dependencias (AC-1). **Entrada:** "Desactivar" en la fila; las dependencias se comprueban antes (FLW-030-Q2).

**Contenido:** nombre de la unidad; texto de consecuencia: la unidad no se borra, conserva su historial y cierra su vigencia; botones "Cancelar" (foco inicial) y "Desactivar".

**Estados:** default; saving (botón "Desactivar" en carga, "Cancelar" deshabilitado); success (confirmación visible, la fila muestra "Inactiva" en texto, foco a la fila, anuncio a lectores); error (mensaje con reintento, la unidad no cambia); disabled (acciones durante saving); forbidden (acciones no visibles). Cancelar o Escape: sin cambios, foco al disparador.

## SCR-030-02 — Desactivación bloqueada por dependencias

**Propósito:** informar que no se puede desactivar (AC-2, BR-PTY-23).

**Contenido:** mensaje con `role="alert"` y conteos concretos de unidades hijas activas y de personas con pertenencia vigente; acción para ir a resolverlas (hijas: UXR-029; personas: US-016; destino sin definir, FLW-030-Q3); botón "Cerrar". No hay botón "Desactivar".

**Estados:** default; loading (solo si el cálculo ocurre al abrir, FLW-030-Q2); forbidden. Un solo tipo de dependencia: ver SCR-030-Q3.

## SCR-030-03 — Reactivar la unidad (fecha desde)

**Propósito:** reactivar una unidad Inactiva con padre Activo o sin padre (AC-3, BR-PTY-24).

| Campo / dato | Componente | Oblig. | Nota | Fuente |
|---|---|---|---|---|
| Fecha desde | entrada de fecha (CMP-015) | Sí (H-1 de US-030) | por defecto y reglas abiertas (SCR-030-Q2) | UXR-030 §2 |
| Vigencia anterior | etiqueta de vigencia (CMP-MOL-008), solo lectura | — | | FLW-030 |
| Unidad padre y su estado | texto, solo lectura | — | | FLW-030 |

Botones "Cancelar" y "Reactivar".

**Estados:** default; validation-error (fecha ausente o inválida; mensaje sin definir, SCR-030-Q2); saving; success (fila "Activa", foco a la fila, anuncio); error (reintento, sin cambio); disabled; forbidden.

## SCR-030-04 — Reactivación bloqueada por padre Inactivo

**Propósito:** indicar que primero debe reactivarse el padre (AC-4, BR-PTY-24).

**Contenido:** mensaje con `role="alert"`, nombre del padre y enlace al padre, botón "Cerrar". Si "Reactivar" aparece habilitado o deshabilitado en la fila es FLW-030-Q4.

**Estados:** default; forbidden.

## Implementation Requirements

Biblioteca `@gf/ui` (Angular, componentes standalone), sin Material. Se reutilizan los componentes de CMP-015 (Confirmation-Dialog, Error-Alert, Loading-Button, entrada de fecha) y CMP-MOL-008 de CMP-016. No se crean CMP nuevos aquí; ver SCR-030-Q7.

### SCR-030-01 — Component Inventory

| Componente | Tipo | Props | Estados | A11y |
|---|---|---|---|---|
| Confirmación | dialog (CMP-015 Confirmation-Dialog) | título con nombre de unidad, consecuencia | visible | role dialog, foco atrapado, foco inicial en Cancelar, Escape, retorno al disparador |
| Desactivar / Cancelar | button (CMP-015 Loading-Button) | variant, loading | default, loading, disabled | nombre accesible con el nombre de la unidad |
| Aviso de error | alert (CMP-015 Error-Alert) | message, reintentar | visible | role alert |

### SCR-030-02 y SCR-030-04 — Component Inventory

| Componente | Tipo | Props | Estados | A11y |
|---|---|---|---|---|
| Contenedor | dialog (CMP-015 Confirmation-Dialog; variante informativa es brecha, SCR-030-Q7) | título | visible | role dialog, foco atrapado |
| Mensaje de bloqueo | alert (CMP-015 Error-Alert) | conteos o padre | visible | role alert |
| Ir a resolver / enlace al padre | enlace | destino | default, foco | nombre accesible con el nombre de la unidad |

### SCR-030-03 — Component Inventory

| Componente | Tipo | Props | Estados | A11y |
|---|---|---|---|---|
| Fecha desde | date input (CMP-015) | label, required | normal, error | aria-required, aria-invalid, aria-describedby |
| Vigencia anterior | CMP-MOL-008 | desde, hasta | solo lectura | texto accesible |
| Reactivar / Cancelar | button (CMP-015 Loading-Button) | loading | default, loading, disabled | foco visible |

### Implementation Checklist

- [ ] Etiquetas "Desactivar"/"Reactivar"/"Inactiva"; ninguna acción "Eliminar".
- [ ] Foco inicial en "Cancelar"; foco vuelve a la fila tras éxito; anuncio a lectores de pantalla.
- [ ] Estado Inactiva con texto además de color.
- [ ] WCAG 2.2 AA y navegación por teclado.
- [ ] Preguntas abiertas revisadas antes de generar el diseño.

### Handoff Instructions for Developers

Tokens semánticos `--gf-*`, nunca valores crudos. No sustituir componentes sin revisión de UX. Sin diseño gobernado (DTM inexistente) no se afirma coincidencia visual.

## Preguntas abiertas

Heredadas sin resolver: FLW-030-Q1 a Q6 y UXR-030-Q1 a Q4.

| ID | Pregunta | Bloquea | Origen |
|---|---|---|---|
| SCR-030-Q1 | ¿Cuatro pantallas o variantes de un diálogo? Se especifican como el FLW y pueden fusionarse | No | FLW-030-Q1 |
| SCR-030-Q2 | Fecha desde: valor por defecto, rango permitido (¿anterior a la vigencia previa? ¿futura?) y texto del error de validación | No | UXR-030-Q3, FLW-030-Q5 |
| SCR-030-Q3 | Si solo hay un tipo de dependencia, ¿se muestra el otro conteo en cero o se omite? | No | AC-2 |
| SCR-030-Q4 | Textos exactos de consecuencia, éxito y error: no están en la fuente y requieren validación | No | UXR-030 |
| SCR-030-Q5 | ¿Solo escritorio? Se hereda de SCR-015/016 | No | SCR-016-Q10 |
| SCR-030-Q6 | TKN-SET-001 y TKN-SET-002 definen los mismos IDs con valores distintos; se asume TKN-SET-002 | Gate | SCR-016-Q13 |
| SCR-030-Q7 | Confirmation-Dialog de CMP-015 es de confirmación; no hay variante informativa (solo cerrar) para SCR-030-02/04 ni componente de conteo de dependencias | No | CMP-015 |
| SCR-030-Q8 | La confirmación visible tras éxito: ¿toast o mensaje en el listado? No definido | No | UXR-030 §3 |
