---
type: Screen
title: SCR-017 — Registrar la organización interna
description: Especificación de pantallas para que el Jefe de Ingeniería registre COMSATEL como organización interna (razón social, RUC y país emisor), consulte la organización registrada y para el acceso no autorizado.
tags:
- ux-ui
- screen
- party
- estructura-organizacional
- organizacion-interna
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-03T16:00:00-05:00'
sources:
- id: flw-017
  resource: /knowledge-base/design/user-flows/FLW-017-registrar-la-organizacion-interna.md
- id: uxr-017
  resource: /knowledge-base/design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-017
  resource: /knowledge-base/requirement/user-stories/US-017-gestionar-estructura-organizacional.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: scr-016
  resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
screens:
- id: SCR-017-01
  name: Organización interna (vacío inicial / organización registrada)
  flow: FLW-017
  requirements: &req
  - US-017
  - UXR-017
  - UXR-000
  required_states:
  - default
  - loading
  - empty
  - error
  - forbidden
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
  - CMP-MOL-007
  - CMP-MOL-008
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
- id: SCR-017-02
  name: Registrar la organización interna
  flow: FLW-017
  requirements: *req
  required_states:
  - default
  - validation-error
  - duplicate-ruc
  - invalid-identification-type
  - saving
  - save-error
  - success
  - disabled
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-017-03
  name: Acceso no autorizado a la gestión de la organización interna
  flow: FLW-017
  requirements: *req
  required_states:
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-017 — Registrar la organización interna

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Sigue la estructura de SCR-016. Tokens: «Comsatel Styled» (`TKN-SET-002`). Estado `draft`; revisión humana pendiente.

## Trazabilidad

- **Historia:** US-017 (AC-1, AC-2) → **UXR:** UXR-017 y UXR-000 → **Flujo:** FLW-017 (SCR-017-01..03).
- **Reglas:** BR-PTY-02, BR-PTY-03, BR-PTY-07 (identificación única), BR-PTY-12 (auditoría), BR-PTY-17 (permisos).
- **Fuera de alcance:** listado/búsqueda de unidades (FLW-028), alta/edición (FLW-029), desactivar/reactivar (FLW-030): SCR-017-01 solo entrega el control a FLW-028.
- **Alcance de dispositivo:** solo escritorio, supuesto heredado de SCR-015/016 (SCR-017-Q6).
- **Terminología (UXR-017 §4):** «Organización interna», «Organización», «COMSATEL»; no usar «empresa» ni «compañía».

## Permisos por actor

| Actor | Ve | Hace |
|---|---|---|
| Jefe de Ingeniería | SCR-017-01, SCR-017-02 | Registra la organización interna |
| Otros usuarios | SCR-017-03 | Nada (BR-PTY-17, EVD-2026-0142) |

## SCR-017-01 — Organización interna

**Propósito:** primera pantalla de la gestión de la estructura en este flujo. Muestra el estado vacío inicial («aún no registrada») o la organización registrada. La propiedad de esta pantalla como entrada de la gestión frente al listado de UXR-028 está sin resolver (SCR-017-Q1, FLW-017-Q4).

**Contenido:**

| Elemento | Descripción | Fuente |
|---|---|---|
| Estado vacío | Explica que falta registrar COMSATEL como organización interna y ofrece «Registrar organización interna». Distinto de un error de carga. Texto exacto propuesto, sin fuente: «Aún no has registrado la organización interna.» | UXR-017 §3 y §5 |
| Organización registrada | Razón social, RUC, país emisor y «Vigente desde {fecha}» (CMP-MOL-008) en solo lectura | UXR-017 §4 |
| Continuar a unidades | Enlace/acción hacia la gestión de unidades (entrega a FLW-028); forma exacta abierta | FLW-017 paso 7, FLW-017-Q3 |

**Acciones:** «Registrar organización interna» (principal; solo estado vacío y solo para el Jefe). Con organización registrada la acción no se ofrece (variante de entrada; ver UXR-017-Q3).

**Estados:** default (organización registrada); loading (consulta si existe organización); empty (vacío inicial); error (fallo de carga con «Reintentar», distinto de empty, E5); forbidden (usuario sin permiso: no se muestra la acción y se presenta SCR-017-03). *Disabled* no aplica: la pantalla no tiene controles que se deshabiliten (el botón se oculta, no se deshabilita, según FLW-017 E6).

## SCR-017-02 — Registro de la organización interna

**Propósito:** capturar razón social, RUC y país emisor (AC-1). El rol «Organización interna» lo fija el flujo, no el usuario.

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Razón social | text-input (CMP-015) | Sí | obligatoria; longitud máxima sin definir (SCR-017-Q2) | UXR-017 §4 |
| RUC | text-input (CMP-015) | Sí | único por número y país: «La identificación ya existe» (BR-PTY-07); rechaza identificación de persona (DNI); formato/longitud sin regla (UXR-017-Q1) | AC-2, BR-PTY-07 |
| País emisor | country select (CMP-MOL-007) o select (CMP-015) | Sí | selector libre o prefijado en Perú: abierto (FLW-017-Q2) | UXR-017 §4 |
| Vigencia desde | por definir: campo editable o valor de solo lectura (CMP-MOL-008) | Por definir | si la fija el usuario o el sistema: FLW-017-Q1 | UXR-017 §4 |

**Acciones:** «Registrar» (principal, Loading-Button CMP-015) y «Cancelar» (vuelve a SCR-017-01 sin guardar; confirmación si hay datos sin guardar: FLW-017-Q5). Al guardar con éxito: confirmación visible y retorno a SCR-017-01 con la organización registrada. El sistema registra auditoría (BR-PTY-12).

**Estados:** default; validation-error (error de campo con `role="alert"`, foco al primer error); duplicate-ruc (error asociado al campo RUC, se conservan los datos); invalid-identification-type (identificación de persona/DNI rechazada, el campo solo admite RUC); saving (validando/guardando); save-error (mensaje con «Reintentar», sin perder lo ingresado, E4); success; disabled («Registrar» mientras guarda o con errores). *Empty* y *loading* de página no aplican: es un formulario de alta que parte vacío (el estado inicial es default).

## SCR-017-03 — Acceso no autorizado

**Propósito:** mensaje de acceso no autorizado a quien no es Jefe de Ingeniería y accede a la gestión (BR-PTY-17, E6).

**Contenido:** título y mensaje de acceso no autorizado; texto exacto sin fuente (propuesta: «No tienes permiso para gestionar la organización interna.»). Salida (volver/inicio) y la opción «Solicitar acceso» no tienen fuente: SCR-017-Q4 (análogo a SCR-016-Q8).

**Estados:** forbidden (único).

## Implementation Requirements

Biblioteca: `@gf/ui` (Angular 22, componentes standalone). Sin `@angular/material` ni `@angular/cdk`. Todo componente usado tiene CMP (CMP-015 y CMP-016); no hay componentes nuevos propuestos como archivos. El developer no sustituye componentes sin revisión de UX.

### SCR-017-01 — Component Inventory

| Componente | Tipo | Props | Estados | A11y |
|---|---|---|---|---|
| Datos de la organización | lista de pares etiqueta/valor (solo lectura) | razón social, RUC, país, desde | default | lista de descripción semántica, nombres accesibles |
| Vigente desde | badge de vigencia (CMP-MOL-008) | valor, desde | solo lectura | texto accesible, no solo color |
| Registrar organización interna | button (CMP-015 Loading-Button) | variant | default, focus | foco visible |
| Aviso de error de carga | alert (CMP-015 Error-Alert) | message, retry | visible | role alert, aria-live |
| Estado vacío | bloque de estado vacío (sin CMP: brecha, ver informe) | título, texto, acción | visible | encabezado y texto leíble; acción alcanzable por teclado |

### SCR-017-02 — Component Inventory

| Componente | Tipo | Props | Validadores | Estados | A11y |
|---|---|---|---|---|---|
| razonSocial | text-input (CMP-015) | label, required | required | normal, focus, error, disabled | aria-required, aria-invalid, aria-describedby |
| ruc | text-input (CMP-015) | label, required | required, único por número y país (asíncrono), no DNI; formato abierto | normal, validating, duplicate, error | aria-invalid, role alert, aria-describedby |
| paisEmisor | country select (CMP-MOL-007) / select (CMP-015) | label, opciones | required | normal, open, selected | role combobox/listbox, aria-expanded |
| vigenciaDesde | por definir (FLW-017-Q1) | — | por definir | por definir | etiqueta ligada al campo |
| Registrar / Cancelar | button (CMP-015 Loading-Button) | variant, loading | — | default, disabled, loading | foco visible |
| Aviso de error | alert (CMP-015 Error-Alert) | message | — | visible | role alert, aria-live |
| Confirmación de cancelación | dialog (CMP-015 Confirmation-Dialog) | mensaje | — | visible (condicional a FLW-017-Q5) | role dialog, foco atrapado, Escape |

### SCR-017-03 — Component Inventory

| Componente | Tipo | Estados | A11y |
|---|---|---|---|
| Mensaje de acceso no autorizado | alert/estado de página (CMP-015 Error-Alert o bloque de página) | visible | encabezado; foco movido al mensaje |

### Implementation Checklist

- [ ] Componentes mapeados a `@gf/ui` o declarados como brecha (estado vacío, SCR-017-Q5).
- [ ] Validadores síncronos y asíncrono (RUC único) enumerados.
- [ ] Estados de cada pantalla cubiertos por el diseño.
- [ ] Accesibilidad y teclado (WCAG 2.2 AA, UXR-000): etiquetas, `role="alert"`, foco al primer error, contraste 4.5:1.
- [ ] Datos ingresados conservados tras error de validación o de guardado.
- [ ] Preguntas abiertas resueltas antes de generar el diseño.

### Handoff Instructions for Developers

- **Framework y dependencias:** Angular 22 (standalone), `@gf/ui`, tokens semánticos `--gf-*` (nunca valores crudos).
- **Sistema de diseño:** `TKN-SET-002` «Comsatel Styled».
- **Binding:** todo componente del inventario se implementa; sin sustituciones sin revisión de UX.
- **Verificación posterior:** el diseño gobernado de cada SCR (referenciado desde su DTM) es la referencia visual; hasta que exista, no se afirma «coincidencia visual».
- **Referencias cruzadas:** FLW-017; US-017; UXR-017; UXR-000.

## Preguntas abiertas

Heredadas (no resueltas): UXR-017-Q1 (formato/longitud/dígito verificador del RUC), UXR-017-Q2 (edición tras registrar), UXR-017-Q3 (más de una organización interna), FLW-017-Q1 (vigencia desde: campo o sistema), FLW-017-Q2 (país emisor libre o prefijado en Perú), FLW-017-Q3 (tras registrar, ¿ir a FLW-028 o permanecer?), FLW-017-Q4 (propiedad de la pantalla de entrada con FLW-028), FLW-017-Q5 (confirmación al cancelar).

| ID | Pregunta | Bloquea | Origen |
|---|---|---|---|
| SCR-017-Q1 | Propiedad de la pantalla de entrada a la gestión: ¿SCR-017-01 sustituye al listado de UXR-028 cuando no hay organización, o éste remite a aquél? Debe coordinarse con FLW-028. No se resuelve aquí. | No | FLW-017-Q4 |
| SCR-017-Q2 | ¿Longitud máxima y reglas de la razón social? Sin fuente. | No | UXR-017 §4 |
| SCR-017-Q3 | ¿Con qué forma se continúa a la gestión de unidades desde SCR-017-01 (botón, enlace, navegación automática)? | No | FLW-017-Q3 |
| SCR-017-Q4 | SCR-017-03: ¿texto del mensaje, acción de salida y existencia de «Solicitar acceso»? Sin fuente. | No | BR-PTY-17 |
| SCR-017-Q5 | El estado vacío no tiene CMP en CMP-015/016. ¿Se crea un componente de estado vacío genérico? | Gate | CMP-015/016 |
| SCR-017-Q6 | ¿Solo escritorio también para US-017? Se hereda de SCR-015/016. | No | SCR-016-Q10 |
| SCR-017-Q7 | `TKN-SET-001` y `TKN-SET-002` definen los mismos IDs con valores distintos (SCR-016-Q13); sigue vigente. No existe token semántico de éxito para la confirmación. | Gate | TKN-SET-001/002 |
| SCR-017-Q8 | No existe AC-017 como artefacto de diseño; se usan AC-1 y AC-2 de US-017. | No | US-017 |
