---
type: Screen
title: SCR-001 — Gestionar el catálogo de roles y competencias
description: Especificación de las pantallas del catálogo (lista, rol, competencia y edición de versión) para consultar y mantener roles, Rol-Nivel, competencias versionadas, rúbricas y requisitos de evidencia.
tags:
- ux-ui
- screen
- catalogo
- roles
- competencias
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-04T00:15:00-05:00'
sources:
- id: flw-001
  resource: /knowledge-base/design/user-flows/FLW-001-gestionar-catalogo-de-roles-y-competencias.md
- id: uxr-001
  resource: /knowledge-base/design/ux-requirements/UXR-001-gestionar-catalogo-de-roles-y-competencias.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-001
  resource: /knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: api-spec-003
  resource: /knowledge-base/architecture/api/API-SPEC-003-catalogo-de-roles-y-competencias.md
screens:
- id: SCR-001-01
  name: Catálogo (roles y competencias)
  flow: FLW-001
  requirements: &req
  - US-001
  - UXR-001
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
  - TKN-color-tertiary
  - TKN-font-family
  - TKN-radius-default
  - TKN-space-md
  - TKN-space-lg
- id: SCR-001-02
  name: Rol (Rol-Nivel y competencias)
  flow: FLW-001
  requirements: *req
  required_states:
  - default
  - loading
  - error
  - validation-error
  - saving
  - success
  - conflict
  - outdated-version-warning
  - read-only
  - disabled
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-001-03
  name: Competencia (versiones, rúbrica y requisitos)
  flow: FLW-001
  requirements: *req
  required_states:
  - default
  - loading
  - error
  - no-approved-version
  - has-draft
  - partial-levels
  - read-only
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-001-04
  name: Edición y aprobación de una versión en borrador
  flow: FLW-001
  requirements: *req
  required_states:
  - default
  - validation-error
  - saving
  - save-error
  - approving
  - approved
  - disabled
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-001 — Gestionar el catálogo de roles y competencias

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Sigue la estructura de SCR-017. Tokens «Comsatel Styled» (`TKN-SET-002`). Estado `draft`; revisión humana pendiente.

## Trazabilidad

- **Historia:** US-001 (AC-1 a AC-13) → **UXR:** UXR-001 y UXR-000 → **Flujo:** FLW-001 (SCR-001-01..04).
- **Reglas:** BR-CAT-02 a 05, 07 a 22, BR-ACR-07 a 09, 12, 13, BR-TRA-02. Decisiones EVD-2026-0143 a 0151.
- **Datos:** contrato de API-SPEC-003 (sin implementar); los nombres de campo salen de ahí.
- **Alcance de dispositivo:** solo escritorio, supuesto heredado de SCR-015 a 017 (SCR-001-Q4).
- **Terminología:** «Rol», «Rol-Nivel», «Competencia», «Requisito de evidencia»; «requerido» y «deseado». No usar «puesto», «cargo» ni «skill».

## Permisos por actor

| Actor | Ve | Hace |
|---|---|---|
| Cualquier colaborador | SCR-001-01 a 03 en solo lectura | Consultar |
| Jefe de Ingeniería | Todo | Editar roles; definir rúbricas y requisitos; aprobar versiones |
| ADMIN | Todo | Editar roles y requisitos, aprobar versiones y desactivar competencias (EVD-2026-0168, 0144, 0159) |
| Responsable de producto (`product_owner`) | Todo | Editar roles (EVD-2026-0147, 0154) |

## SCR-001-01 — Catálogo

**Propósito:** punto de entrada. Pestañas «Roles» y «Competencias» (brecha: sin CMP), búsqueda por nombre (CMP-015 Text-Input).

| Elemento | Descripción | Fuente |
|---|---|---|
| Pestaña Roles | Tabla: nombre del rol, cantidad de niveles, estado (activo/inactivo) | UXR-001.1, 001.2 |
| Pestaña Competencias | Tabla: nombre, versión vigente, niveles con requisitos definidos (por ejemplo «2 de 4») | UXR-001.3, 001.5b |
| Búsqueda | Por nombre; al limpiar, vuelve a la lista completa | API-SPEC-003 |
| Acciones de edición | «Crear rol» y «Crear competencia»; solo con permiso | UXR-001.6, 001.8 |
| Estado vacío | «No hay roles registrados todavía» con la acción de crear si hay permiso (estado vacío: brecha, sin CMP); texto sin fuente, propuesto | AC-6 |

**Estados:** default; loading; empty; error (alerta con «Reintentar», CMP-015 Error-Alert, distinto de empty); read-only (sin acciones de edición, no como error, BR-TRA-02).

## SCR-001-02 — Rol

**Propósito:** ver, crear y editar un rol con sus Rol-Nivel y, por nivel, las competencias con su L1–L4 esperado.

| Campo / elemento | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Nombre del rol | text-input (CMP-015) | Sí | único sin distinguir mayúsculas: «Ya existe un rol con ese nombre» | API-SPEC-003, CM-10 |
| Niveles del rol | lista editable | Sí (≥1) | cada uno con nombre y orden; la cantidad la define el rol | BR-CAT-09 |
| Competencia del nivel | combobox de búsqueda (CMP-015 Combobox-Search) | Sí (≥1 por nivel) | no repetir en el mismo nivel: «Esta competencia ya está en este nivel» | BR-CAT-20, 21 |
| Nivel esperado | select L1–L4 (CMP-015) | Sí | «Elige el nivel esperado de la competencia» | BR-CAT-03, 02 |
| Versión de la competencia | texto + badge | solo lectura | si hay una más reciente: advertencia «Hay una versión nueva (vN) de esta competencia» y acción «Usar la nueva» | EVD-2026-0143 |

**Reglas visibles:** un nivel L sin requisitos de evidencia, o sin ninguno requerido, bloquea guardar y se explica: «Primero define cómo se evidencia el nivel L{n} de {competencia}» (BR-ACR-13, texto sin fuente, propuesto). La advertencia de versión anterior usa icono, texto y color (no solo color).

**Acciones:** «Guardar» (principal, Loading-Button), «Cancelar» (confirmación si hay cambios, CMP-015 Confirmation-Dialog), «Desactivar rol» y «Desactivar nivel» (con «Reactivar»; confirmación; sin eliminar, EVD-2026-0154 y 0174): quien ya tiene un nivel inactivo lo conserva y no se asigna a nadie más. Los niveles inactivos se muestran con el texto «Inactivo», no solo con color. Este estado no figura aún en el diseño de Stitch (GEN-001-G).

**Estados:** default; loading; error; validation-error (`role="alert"`, foco al primer error); saving; success; conflict («Otra persona modificó este rol. Recarga para ver los cambios», 412); outdated-version-warning; read-only; disabled.

## SCR-001-03 — Competencia

**Propósito:** ver una competencia con su versión vigente, su historial de versiones, su rúbrica y los requisitos por nivel, y dónde se usa.

| Elemento | Descripción | Fuente |
|---|---|---|
| Versiones | Lista: número, estado (borrador, aprobada, obsoleta), aprobada por y fecha | BR-CAT-22, EVD-2026-0144 |
| Rúbrica | Por nivel L1–L4: comportamiento y logro verificable | UXR-001.3, BR-CAT-15 |
| Requisitos de evidencia | Por nivel: categoría (formación, práctica evaluada, desempeño en proyecto), descripción, requerido o deseado | UXR-001.4, BR-ACR-08, 12 |
| Niveles sin requisitos | Marcados «No utilizable hasta definir cómo se evidencia» (texto, no solo color) | BR-CAT-17, BR-ACR-13 |
| Dónde se usa | Roles y niveles que referencian cada versión, con la advertencia de versión anterior | UXR-001.13 |
| Transversal | Marca «Transversal» en la competencia (normalmente competencias blandas), editable por quien la define | EVD-2026-0167, BR-CAT-11 |
| Acciones | «Crear versión nueva» (copia la vigente); «Editar borrador»; solo con permiso | UXR-001.12 |

**Estados:** default; loading; error; no-approved-version (solo borrador); has-draft (ofrece abrir el borrador, no crear otro, E9); partial-levels; read-only.

## SCR-001-04 — Edición y aprobación de una versión

**Propósito:** completar la rúbrica y los requisitos de un borrador y aprobarlo.

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Rúbrica por nivel | textarea | No (progresivo) | no vacío si se completa; longitud máxima 1000 (LDM-002) | BR-CAT-17 |
| Categoría | select (CMP-015) | Sí | formación, práctica evaluada, desempeño en proyecto | BR-ACR-08 |
| Descripción del requisito | text-input (CMP-015) | Sí | longitud máxima 300 | BR-ACR-08 |
| Requerido / deseado | radio (CMP-015 Radio-Card) | Sí | «Indica si es requerido o deseado» | AC-8, BR-ACR-12 |
| Curso asociado | combobox | No, solo con formación | referencia a un curso (otro dominio): abierto (SCR-001-Q3) | R-21 |

**Acciones:** «Guardar borrador», «Aprobar versión» (principal; solo Jefe de Ingeniería o ADMIN; confirmación que explica que pasa a ser la vigente para nuevas asignaciones y que lo vigente no cambia, EVD-2026-0143), «Cancelar».

**Estados:** default; validation-error; saving; save-error («Reintentar» sin perder lo ingresado); approving; approved; disabled. Una versión aprobada no se edita (E10).

## Implementation Requirements

Biblioteca: `@gf/ui` (Angular 22, componentes standalone). Sin `@angular/material` ni `@angular/cdk` (decisión de `human:ianache` para DTC-015). Todo componente tiene CMP; los no cubiertos van en la sección de brechas.

### Component Inventory (resumen)

| Componente | Tipo | Estados | A11y |
|---|---|---|---|
| Pestañas Roles/Competencias | tabs (brecha: sin CMP) | default, seleccionada | `role="tablist"`, flechas, foco visible |
| Tabla de roles y de competencias | tabla (sin CMP: brecha) | default, vacío | encabezados `th scope`, nombre accesible |
| Búsqueda | CMP-015 Text-Input | default, con texto | etiqueta ligada |
| Campos de texto, selects, radio | CMP-015 | normal, foco, error, disabled | aria-required, aria-invalid, aria-describedby |
| Combobox de competencia | CMP-015 Combobox-Search | cerrado, abierto, sin resultados | role combobox, aria-expanded |
| Alertas de error y advertencia | CMP-015 Error-Alert | visible | `role="alert"`, texto además de icono |
| Confirmaciones | CMP-015 Confirmation-Dialog | visible | role dialog, foco atrapado, Escape |
| Estado vacío | estado vacío (sin CMP: brecha) | visible | encabezado y acción por teclado |
| Insignia de estado de versión | badge (sin CMP: brecha) | borrador, aprobada, obsoleta | texto, no solo color |

### Brechas y verificación

- **Brechas de componentes:** pestañas, tabla de datos, estado vacío, insignia de estado y editor de lista de niveles no figuran en CMP-015/016 (CMP-MOL-001 a 006 solo aparecen en `ui-inventory.md`, no como conceptos). Se registran para `web-atomic-component-designer`; no se inventan.
- **Verificación previa a Stitch:** `preflight` del skill `ux-development-handoff`.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| SCR-001-Q1 | Textos exactos de vacío, advertencias y confirmaciones (los marcados «propuesto» no tienen fuente) | Jefe de Ingeniería | Media |
| SCR-001-Q2 | ¿Se edita un rol y su competencia en la misma pantalla o la competencia se abre aparte? | Jefe de Ingeniería | Media |
| SCR-001-Q3 | Cómo se elige el curso de un requisito de formación (dominio de cursos) | Jefe de Ingeniería | Baja |
| SCR-001-Q4 | Responsive: solo escritorio, supuesto heredado | Jefe de Ingeniería | Baja |
| FLW-001-Q1 a Q4 | Todas respondidas el 2026-10-03 (EVD-2026-0165, 0167, 0168, 0154) | — | — |
