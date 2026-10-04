---
type: Screen
title: SCR-029 — Registrar y editar unidades organizacionales
description: Especificación de pantallas para que el Jefe de Ingeniería registre unidades, edite su nombre, cambie su unidad padre (con resumen "de X a Y") y consulte el historial de relaciones y vigencias.
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
- id: flw-029
  resource: /knowledge-base/design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md
- id: uxr-029
  resource: /knowledge-base/design/ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-029
  resource: /knowledge-base/requirement/user-stories/US-029-registrar-y-editar-unidades-organizacionales.md
- id: tkn-set-001
  resource: /knowledge-base/design/tokens/TKN-SET-001-sovereign-enterprise.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: scr-016
  resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
screens:
- id: SCR-029-01
  name: Registrar unidad
  flow: FLW-029
  requirements: &req
  - US-029
  - UXR-029
  - UXR-000
  required_states:
  - default
  - loading
  - validation-error
  - duplicate-name
  - cycle-error
  - inactive-parent-error
  - saving
  - success
  - save-error
  - unsaved-changes
  - no-internal-organization
  - forbidden
  responsive: &resp
  - desktop
  a11y_requirements: &a11y
  - WCAG-2.2-AA
  - keyboard-nav
  - focus-visible
  - accessible-names
  - error-announcement
  - logical-focus-after-save
  components: &cmp
  - CMP-015
  - CMP-016
  - CMP-MOL-008
  - CMP-MOL-009
  tokens: &tok
  - TKN-SET-001
  - TKN-SET-002
  - TKN-color-primary
  - TKN-color-on-primary
  - TKN-color-surface
  - TKN-color-on-surface
  - TKN-color-on-surface-variant
  - TKN-color-outline
  - TKN-color-outline-variant
  - TKN-color-error
  - TKN-color-error-container
  - TKN-font-family
  - TKN-radius-default
  - TKN-space-md
  - TKN-space-lg
- id: SCR-029-02
  name: Editar nombre de una unidad
  flow: FLW-029
  requirements: *req
  required_states:
  - default
  - loading
  - validation-error
  - duplicate-name
  - disabled
  - saving
  - success
  - save-error
  - unsaved-changes
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-029-03
  name: Cambiar unidad padre
  flow: FLW-029
  requirements: *req
  required_states:
  - default
  - loading
  - validation-error
  - cycle-error
  - inactive-parent-error
  - duplicate-name
  - summary-confirmation
  - disabled
  - saving
  - success
  - save-error
  - unsaved-changes
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-029-04
  name: Historial de relaciones y vigencias de la unidad
  flow: FLW-029
  requirements: *req
  required_states:
  - default
  - loading
  - empty
  - error
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-029 — Registrar y editar unidades organizacionales

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Sigue la estructura de SCR-016. Tokens: `TKN-SET-001` y `TKN-SET-002`; los IDs semánticos se heredan de SCR-016 y su resolución depende de SCR-029-Q10 (colisión entre sets).

## Trazabilidad

- **Historia:** US-029 (AC-1 a AC-6). **UX:** UXR-029 y UXR-000 (familia UXR-017). **Flujo:** FLW-029 (flujos 1 a 4).
- **Reglas:** BR-PTY-03, 04, 12, 17, 21, 22, 25, 26. **Evidencia:** EVD-2026-0134, 0140, 0141.
- **Puntos de entrada y salida:** el listado de unidades (UXR-028) no se especifica aquí; las pantallas parten de él y vuelven a él con la unidad resaltada.
- **Fuera de alcance:** listado y búsqueda (US-028), desactivar/reactivar (US-030), pertenencia de personas (US-015/016).
- **Alcance de dispositivo:** solo escritorio, supuesto heredado de SCR-015/016 (SCR-029-Q9).

## Permisos por actor

| Actor | Ve | Hace |
|---|---|---|
| Jefe de Ingeniería | Formularios, selector de unidad padre, historial | Registrar, editar nombre, cambiar unidad padre (BR-PTY-17); ADMIN con los mismos permisos (EVD-2026-0238) |
| Otros usuarios | Nada | Nada; las acciones no son visibles y el acceso directo es no autorizado (estado `forbidden`) |

En ninguna pantalla existe una acción «Eliminar» (BR-PTY-12, BR-PTY-21; solo desactivar en UXR-030).

## SCR-029-01 — Registrar unidad

**Propósito:** crear una unidad Activa con su relación de estructura vigente (AC-1). Precondición: organización interna registrada (US-017).

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Nombre | texto (CMP-015 Text-Input) | Sí | único entre hermanas: «Ya existe una unidad con este nombre bajo [padre]»; longitud y caracteres abiertos (SCR-029-Q1) | UXR-029 §3, BR-PTY-26 |
| Correo laboral | email (`email-input` de `@gf/ui`) | Sí | formato de correo: «Ingrese un correo válido»; obligatorio: «El correo laboral es obligatorio» (textos propuestos) | BR-PTY-27, EVD-2026-0239 |
| Unidad padre | selector con búsqueda (CMP-015 Combobox-Search) | Sí, salvo la unidad superior | solo Activas, sin ciclos; «Solo se pueden elegir unidades activas» / «Crearía un ciclo en la jerarquía» | BR-PTY-22, 25 |
| Fecha desde | fecha (CMP-015 Date-Input) | Sí | «Indica la fecha desde»; pasada/futura/hoy abierto (SCR-029-Q2) | UXR-029 §3, BR-PTY-12 |

**Acciones:** «Registrar» (principal, CMP-015 Loading-Button) y «Cancelar». Errores en línea al salir del campo y al enviar. Éxito: confirmación visible y retorno al listado con la unidad resaltada; el foco vuelve a un punto lógico.

**Estados:** default; loading; validation-error (campo obligatorio vacío); duplicate-name; cycle-error y inactive-parent-error (respaldo del servidor; el selector no ofrece esas opciones); saving; success; save-error (mensaje con reintento sin perder lo ingresado); unsaved-changes (aviso al abandonar); no-internal-organization (impide registrar y remite a UXR-017); forbidden. *Empty* no aplica (formulario). Cómo se registra la unidad superior (padre vacío) está abierto (SCR-029-Q3).

## SCR-029-02 — Editar nombre de una unidad

**Propósito:** cambiar el nombre; el cambio queda auditado con el valor anterior (AC-2, BR-PTY-12). Si es un formulario aparte de SCR-029-01 o el mismo está abierto (SCR-029-Q4).

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Nombre | texto (CMP-015 Text-Input), precargado con el actual | Sí | único entre hermanas (E3); texto del error de vacío abierto (SCR-029-Q8) | UXR-029, BR-PTY-26 |

La unidad y su padre actual se muestran como contexto de solo lectura. No se pide fecha ni motivo (SCR-029-Q5).

**Acciones:** «Guardar» (principal; deshabilitada sin cambios o con errores) y «Cancelar». Éxito: la unidad muestra el nuevo nombre y retorna al listado resaltada.

**Estados:** default; loading; validation-error; duplicate-name; disabled (Guardar); saving; success; save-error; unsaved-changes; forbidden.

## SCR-029-03 — Cambiar unidad padre

**Propósito:** mover la unidad bajo otro padre; la relación anterior cierra su vigencia y se abre la nueva (AC-3, AC-4, AC-5).

**Valor actual (solo lectura):** padre actual con etiqueta de vigencia «Vigente desde {fecha}» (CMP-MOL-008).

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Nueva unidad padre | selector con búsqueda, operable por teclado (CMP-015 Combobox-Search) | Sí | solo Activas, sin la propia ni sus descendientes; mensajes de ciclo e inactivo como en SCR-029-01 | BR-PTY-22, 25 |
| Fecha desde | fecha (CMP-015 Date-Input) | Sí | «Indica la fecha desde»; criterio abierto (SCR-029-Q2) | UXR-029 §3 |

**Resumen previo a confirmar:** «de {padre actual} a {padre nuevo}» en un diálogo (CMP-015 Confirmation-Dialog) con «Confirmar» y «Volver». Contenido adicional (fecha, número de descendientes afectadas) abierto (SCR-029-Q6). Éxito: retorno al listado con la unidad resaltada; el historial (SCR-029-04) refleja el cambio. Si el nombre de la unidad ya existe bajo el nuevo padre, se aplicaría duplicate-name (inferido de BR-PTY-26, no cubierto expresamente; SCR-029-Q11).

**Estados:** default; loading; validation-error; cycle-error; inactive-parent-error; duplicate-name; summary-confirmation; disabled (continuar sin padre nuevo); saving; success; save-error; unsaved-changes; forbidden. Cambiar el padre de una unidad Inactiva y la concurrencia al confirmar: abiertos (SCR-029-Q7, Q12).

## SCR-029-04 — Historial de relaciones y vigencias

**Propósito:** consultar de qué padre a cuál pasó la unidad, desde/hasta y quién cambió (Flow 4, BR-PTY-12). Solo lectura.

**Contenido:** tabla de más reciente a más antigua con columnas Padre anterior, Padre nuevo, Desde, Hasta (vacío en la relación vigente, marcada con CMP-MOL-008, no solo por color) y Realizado por. Columnas propuestas a partir de UXR-029 §5; pendiente de confirmación (SCR-029-Q13). Paginación con CMP-MOL-009 si hay muchas filas. Punto de acceso sin definir (SCR-029-Q14).

**Estados:** default; loading; empty («Aún no hay cambios registrados», texto propuesto, comportamiento no fuente); error (reintentar); forbidden.

## Implementation Requirements

Biblioteca: `@gf/ui` (Angular, standalone). Reutiliza `CMP-015` (Text-Input, Combobox-Search, Date-Input, Error-Alert, Loading-Button, Confirmation-Dialog) y `CMP-016` (CMP-MOL-008 etiqueta de vigencia, CMP-MOL-009 paginación). Donde ningún CMP cubre el caso, se registra como propuesta y pregunta abierta; el developer no sustituye componentes sin revisión de UX.

### Component Inventory

| Pantalla | Componente | Tipo | Validadores | Estados | A11y |
|---|---|---|---|---|---|
| 01 | correo laboral | email-input | required, formato correo | normal, focus, error, disabled | aria-required, aria-invalid, aria-describedby, role alert |
| 01, 02 | nombre | text-input (CMP-015) | required, único entre hermanas (servidor) | normal, focus, error, disabled | aria-required, aria-invalid, aria-describedby, role alert |
| 01, 03 | unidadPadre | combobox-search (CMP-015) | required (salvo unidad superior), solo Activas, sin ciclos | normal, open, selected, error | role combobox/listbox, aria-expanded, búsqueda por teclado |
| 01, 03 | fechaDesde | date-input (CMP-015) | required | normal, error | etiqueta ligada, aria-invalid |
| 01-03 | acciones | loading-button (CMP-015) | — | default, disabled, loading | foco visible |
| 01-03 | aviso de error | error-alert (CMP-015) | — | visible | role alert, aria-live |
| 03 | resumen «de X a Y» | confirmation-dialog (CMP-015) | — | visible | role dialog, foco atrapado, Escape |
| 03, 04 | vigencia | badge (CMP-MOL-008) | — | solo lectura | texto accesible, no solo color |
| 04 | historial de relaciones | tabla (sin CMP; propuesta) | — | vacía, con datos, cargando, error | encabezados de tabla, caption |
| 04 | paginación | CMP-MOL-009 | — | default, deshabilitada en extremos | nombre accesible |

### Implementation Checklist

- [ ] Selector de padre excluye la propia unidad, descendientes e Inactivas.
- [ ] Errores de regla asociados a su campo y anunciados con `role="alert"`.
- [ ] Resumen «de X a Y» antes de confirmar; el historial lo refleja.
- [ ] Ninguna acción «Eliminar».
- [ ] Aviso al abandonar con cambios; foco lógico tras guardar.
- [ ] WCAG 2.2 AA y operación completa por teclado.

### Handoff Instructions for Developers

- Tokens semánticos `--gf-*`, nunca valores crudos; sets `TKN-SET-001`/`TKN-SET-002` (SCR-029-Q10).
- Sin diseño gobernado todavía: no se afirma «coincidencia visual».
- Referencias: FLW-029, US-029, UXR-029, UXR-000.

## Preguntas abiertas

Heredadas (siguen abiertas): UXR-029-Q1 a Q5 y FLW-029-Q1 a Q7, reflejadas así:

| ID | Pregunta | Bloquea | Origen |
|---|---|---|---|
| SCR-029-Q1 | Longitud máxima y caracteres del nombre | No | UXR-029-Q1 |
| SCR-029-Q2 | Fecha desde pasada, futura u hoy (registro y cambio de padre) | No | UXR-029-Q2 |
| SCR-029-Q3 | Cómo se registra la unidad superior (padre vacío) y si se permite otra cuando ya existe | No | UXR-029-Q5, FLW-029-Q4 |
| SCR-029-Q4 | ¿SCR-029-01 y 02 son formularios distintos o uno solo? | No | FLW-029-Q1 |
| SCR-029-Q5 | ¿La edición de nombre pide fecha desde o motivo? | No | FLW-029-Q2 |
| SCR-029-Q6 | Contenido del resumen «de X a Y» además de los padres | No | FLW-029-Q5 |
| SCR-029-Q7 | ¿Se permite cambiar el padre de una unidad Inactiva? | No | FLW-029-Q3 |
| SCR-029-Q8 | Texto del error de nombre vacío (no hay mensaje en la fuente) | No | UXR-029 §3 |
| SCR-029-Q9 | ¿Solo escritorio? Se hereda de SCR-015/016; UXR-000 debe confirmarlo | No | SCR-016-Q10 |
| SCR-029-Q10 | `TKN-SET-001` y `TKN-SET-002` definen los mismos IDs semánticos con valores distintos; ¿cuál rige? | Gate | SCR-016-Q13 |
| SCR-029-Q11 | Nombre ya existente bajo el nuevo padre al mover la unidad: ¿se valida y con qué mensaje? | No | BR-PTY-26 |
| SCR-029-Q12 | Concurrencia: otro usuario modificó la unidad o su padre antes de confirmar | No | FLW-029-Q7 |
| SCR-029-Q13 | Columnas del historial de relaciones | No | UXR-029 §5 |
| SCR-029-Q14 | Punto de acceso al historial (pestaña, panel, enlace en la fila) | No | FLW-029-Q6 |
| SCR-029-Q15 | ¿Qué ocurre con las descendientes de la unidad al mover su padre? El resumen no lo menciona | No | US-029 AC-3 |
