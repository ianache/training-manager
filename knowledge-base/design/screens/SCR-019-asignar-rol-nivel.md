---
type: Screen
title: SCR-019 — Asignar un Rol-Nivel a una persona
description: Especificación de las pantallas para ver las asignaciones de Rol-Nivel de un colaborador, asignar un rol, cambiar su nivel y consultar el historial.
tags:
- ux-ui
- screen
- party
- rol-nivel
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-04T00:15:00-05:00'
sources:
- id: flw-019
  resource: /knowledge-base/design/user-flows/FLW-019-asignar-rol-nivel.md
- id: uxr-019
  resource: /knowledge-base/design/ux-requirements/UXR-019-asignar-rol-nivel.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-019
  resource: /knowledge-base/requirement/user-stories/US-019-asignar-rol-nivel.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: scr-016
  resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
screens:
- id: SCR-019-01
  name: Rol-Nivel de la persona (vigentes e historial)
  flow: FLW-019
  requirements: &req
  - US-019
  - UXR-019
  - UXR-000
  required_states:
  - default
  - loading
  - empty
  - error
  - read-only
  responsive: &resp
  - desktop
  a11y_requirements: &a11y
  - WCAG-2.2-AA
  - keyboard-nav
  - focus-visible
  - accessible-names
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
- id: SCR-019-02
  name: Asignar un rol o cambiar el nivel
  flow: FLW-019
  requirements: *req
  required_states:
  - default
  - validation-error
  - blocked-lower-levels-pending
  - validating
  - saving
  - save-error
  - disabled
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-019-03
  name: Resultado de la asignación o bloqueo
  flow: FLW-019
  requirements: *req
  required_states:
  - success
  - blocked-person-not-current
  - blocked-level-unavailable
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-019 — Asignar un Rol-Nivel a una persona

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Sigue la estructura de SCR-016 y SCR-017. Tokens «Comsatel Styled» (`TKN-SET-002`). Estado `draft`; revisión humana pendiente.

## Trazabilidad

- **Historia:** US-019 (AC-1 a AC-5) → **UXR:** UXR-019 y UXR-000 → **Flujo:** FLW-019 (SCR-019-01..03).
- **Reglas:** BR-PTY-11, 12, 14, 17, 20, BR-PRF-01 a 03, BR-CAT-09, 14, BR-TRA-03. Decisiones EVD-2026-0145, 0146, 0151.
- **Alcance de dispositivo:** solo escritorio, supuesto heredado (SCR-019-Q3).
- **Terminología:** «Rol-Nivel», «nivel vigente», «Vigente desde», «Historial»; el nivel inicial de la alta no es esta pantalla (FLW-015).

## Permisos por actor

| Actor | Ve | Hace |
|---|---|---|
| Cualquier colaborador | SCR-019-01 en solo lectura | Consultar el rol de una persona (BR-PTY-20) |
| Jefe de Ingeniería | SCR-019-01 a 03 | Asignar y cambiar niveles |
| ADMIN | SCR-019-01 a 03 | Asignar un rol y cambiar niveles, igual que el Jefe de Ingeniería (EVD-2026-0151, 0152); no puede saltarse el bloqueo AC-5 (EVD-2026-0170) |

## SCR-019-01 — Rol-Nivel de la persona

**Propósito:** en la ficha de la persona, mostrar sus Rol-Nivel vigentes y su historial.

| Elemento | Descripción | Fuente |
|---|---|---|
| Vigentes | Lista: rol, nivel, «Vigente desde {fecha}» | AC-1, AC-2, BR-PTY-11 |
| Historial | Asignaciones cerradas con su vigencia desde y hasta | AC-4, BR-PTY-12 |
| Acciones | «Asignar rol» y «Cambiar nivel» por cada rol; solo con permiso | UXR-019.6 a 8 |
| Estado sin asignaciones | «Esta persona no tiene un Rol-Nivel asignado»; con la acción si hay permiso (estado vacío: brecha, sin CMP); texto propuesto | US-019 §10 |

**Estados:** default; loading; empty; error (con «Reintentar», distinto de empty); read-only (sin acciones).

## SCR-019-02 — Asignar un rol o cambiar el nivel

**Propósito:** elegir un Rol-Nivel del catálogo y la fecha desde.

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Rol | select (CMP-015) con roles activos del catálogo | Sí | solo roles del catálogo | SPEC-001:L91 |
| Nivel | select (CMP-015) con los niveles que define el rol | Sí | solo niveles del rol (BR-CAT-09) | BR-CAT-09 |
| Vigente desde | date-input (CMP-015 Date-Input) | Sí | fecha válida; reglas de fecha pasada o futura sin definir (SCR-019-Q1) | AC-1, AC-3 |
| Aviso de cierre | texto | solo lectura | «Al cambiar el nivel se cierra {nivel actual} desde la fecha elegida» (texto propuesto) | US-019 §10 |

**Bloqueo AC-5:** si faltan competencias certificadas de los niveles inferiores o del nivel destino (EVD-2026-0172), no se permite confirmar y se lista cada una pendiente con su nivel L: «No se puede asignar {nivel}: faltan competencias certificadas de niveles inferiores o de este nivel» (texto propuesto). No depende solo del color.

**Acciones:** «Confirmar» (principal, Loading-Button), «Cancelar» (confirmación si hay cambios).

**Estados:** default; validation-error; blocked-lower-levels-pending; validating; saving; save-error; disabled.

## SCR-019-03 — Resultado

**Propósito:** confirmar el resultado o explicar el bloqueo.

**Contenido:** éxito: «{Rol} {nivel} vigente desde {fecha}» y vuelve a SCR-019-01. Bloqueos: persona no vigente o anonimizada, Rol-Nivel que dejó de estar disponible en el catálogo, y acceso sin permiso (forbidden). Cada uno con su mensaje (texto propuesto, SCR-019-Q2) y salida.

**Estados:** success; blocked-person-not-current; blocked-level-unavailable; forbidden.

## Implementation Requirements

Biblioteca: `@gf/ui`. Sin `@angular/material` ni `@angular/cdk`. Todo componente tiene CMP, salvo las brechas.

### Component Inventory (resumen)

| Componente | Tipo | Estados | A11y |
|---|---|---|---|
| Lista de Rol-Nivel vigentes e historial | lista de pares (sin CMP: brecha) | default, vacío | lista semántica |
| Select de rol y de nivel | CMP-015 Select-Dropdown | normal, abierto, error, disabled | aria-required, aria-invalid |
| Fecha desde | CMP-015 Date-Input | normal, error | etiqueta ligada |
| Bloqueo con competencias pendientes | alerta (CMP-015 Error-Alert) con lista | visible | `role="alert"`, texto además de color |
| Confirmar / Cancelar | CMP-015 Loading-Button / Confirmation-Dialog | default, loading | foco visible, Escape |
| Estado vacío | estado vacío (sin CMP: brecha) | visible | acción por teclado |

**Brechas:** el estado vacío y la lista de asignaciones con historial no figuran en CMP-015/016; se registra para `web-atomic-component-designer`.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| SCR-019-Q1 | Reglas de la fecha «desde» (¿se admite pasada?, ¿futura?) | Jefe de Ingeniería | Media |
| SCR-019-Q2 | Textos exactos de aviso, bloqueo y resultado (los «propuesto» no tienen fuente) | Jefe de Ingeniería | Media |
| SCR-019-Q3 | Responsive: solo escritorio, supuesto heredado | Jefe de Ingeniería | Baja |
| FLW-019-Q3, Q4 | Heredadas del flujo, aún abiertas (niveles destino y si ADMIN puede saltar AC-5). Q1, Q2 y Q5 respondidas el 2026-10-03; solo se sube de nivel (EVD-2026-0166) | Jefe de Ingeniería | Alta |
