---
type: Screen
title: SCR-003 — Certificar un nivel de competencia
description: Especificación de las pantallas para que el evaluador busque a un colaborador, califique sus evidencias, certifique o no apruebe un nivel, recertifique, y para que el Jefe de Ingeniería o ADMIN revoque una certificación.
tags:
- ux-ui
- screen
- certificacion
- evaluacion
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-04T13:00:00-05:00'
sources:
- id: flw-003
  resource: /knowledge-base/design/user-flows/FLW-003-certificar-un-nivel-de-competencia.md
- id: uxr-003
  resource: /knowledge-base/design/ux-requirements/UXR-003-certificar-un-nivel-de-competencia.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-003
  resource: /knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: api-spec-005
  resource: /knowledge-base/architecture/api/API-SPEC-005-certificaciones-y-evidencias.md
screens:
- id: SCR-003-01
  name: Buscar colaborador y elegir competencia y nivel
  flow: FLW-003
  requirements: &req
  - US-003
  - UXR-003
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
- id: SCR-003-02
  name: Evaluar evidencias y decidir
  flow: FLW-003
  requirements: *req
  required_states:
  - default
  - loading
  - error
  - no-evidence
  - required-incomplete
  - ready-to-certify
  - recertify
  - level-without-requirements
  - lower-than-certified
  - person-not-current
  - conflict
  - saving
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-003-03
  name: No aprobar (motivo y descripción)
  flow: FLW-003
  requirements: *req
  required_states:
  - default
  - validation-error
  - saving
  - save-error
  - disabled
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-003-04
  name: Resultado de la evaluación
  flow: FLW-003
  requirements: *req
  required_states:
  - certified
  - recertified
  - not-approved
  - error
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-003-05
  name: Revocar una certificación
  flow: FLW-003
  requirements: *req
  required_states:
  - default
  - validation-error
  - saving
  - save-error
  - revoked
  - not-active
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-003 — Certificar un nivel de competencia

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Sigue la estructura de SCR-001 y SCR-019. Tokens «Comsatel Styled» (`TKN-SET-002`). Estado `draft`; revisión humana pendiente.

## Trazabilidad

- **Historia:** US-003 (AC-1 a AC-7) → **UXR:** UXR-003 y UXR-000 → **Flujo:** FLW-003 (SCR-003-01..05).
- **Datos:** contrato de API-SPEC-005 (sin implementar).
- **Alcance de dispositivo:** solo escritorio, supuesto heredado (SCR-003-Q1).
- **Terminología:** «Evaluar», «Certificar», «No aprobar», «CUMPLE» y «NO CUMPLE», «Requisito requerido» y «deseado», «Recertificar», «Revocar». No usar «aprobar» para certificar ni «rechazar».

## Permisos por actor

| Actor | Ve | Hace |
|---|---|---|
| Evaluador (rol `evaluador`) | SCR-003-01 a 04 | Evalúa, certifica, no aprueba y recertifica a cualquier colaborador vigente |
| Jefe de Ingeniería, ADMIN | SCR-003-05 | Revoca una certificación vigente |
| Otros usuarios | Nada de estas pantallas | — |

## SCR-003-01 — Buscar colaborador y elegir competencia y nivel

| Elemento | Componente | Descripción | Fuente |
|---|---|---|---|
| Colaborador | combobox de búsqueda (CMP-015 Combobox-Search) | Búsqueda por nombre; el criterio exacto está abierto (UXR-003-Q4) | UXR-003-Q4 |
| Competencia | combobox (CMP-015) | Competencias del catálogo con requisitos definidos | BR-ACR-13 |
| Nivel | select L1–L4 (CMP-015) | Con la versión vigente de la competencia | UXR-003.1 |
| Continuar | button (CMP-015 Loading-Button) | Abre SCR-003-02 | — |

**Estados:** default; loading; empty («No se encontraron colaboradores»); error («Reintentar»); forbidden (sin el rol `evaluador`).

## SCR-003-02 — Evaluar evidencias y decidir

| Zona | Contenido | Fuente |
|---|---|---|
| Encabezado | Colaborador, rol asignado, competencia, nivel y versión; certificaciones anteriores en esa competencia con su estado | UXR-003.1, 003.5 |
| Rúbrica | Descriptor del nivel | UXR-003.2, BR-CAT-15 |
| Requisitos | Lista separada en «Requeridos» y «Deseados»; cada uno con su estado «Cubierto» o «Falta» (texto e icono) | UXR-003.3 |
| Evidencias | Cada pieza: categoría, descripción, enlace (URL) con la advertencia de red privada, requisito que cumple y calificación **CUMPLE / NO CUMPLE** (radio) | UXR-003.4, 003.6, 003.8, 003.9 |
| Acciones | «Certificar» (o «Recertificar» si ya hay una vigente de ese nivel), «No aprobar» y «Volver» | UXR-003.7, 003.10, 003.11 |

**Reglas visibles:** «Certificar» se habilita solo con cada requisito requerido cubierto por al menos una pieza en CUMPLE (BR-ACR-09, 12, EVD-2026-0208); si falta, se listan los que faltan. No hay equivalencias ni acción «aceptar como equivalente» (EVD-2026-0202). Si el nivel es inferior al ya certificado, se explica y no se permite (EVD-2026-0187). **Recertificar** exige al menos una evidencia nueva (EVD-2026-0216, 0220). La confirmación de certificar advierte que cualquier colaborador verá la certificación y su auditoría (BR-TRA-06). «No aprobar» siempre está disponible (FLW-003-Q1).

**Estados:** default; loading; error; no-evidence («El colaborador aún no registró evidencias»); required-incomplete; ready-to-certify; recertify; level-without-requirements («Primero hay que definir cómo se evidencia este nivel»); lower-than-certified; person-not-current; conflict («Otra persona certificó mientras evaluabas. Recarga para ver los cambios»); saving; forbidden.

## SCR-003-03 — No aprobar

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Motivo | select (CMP-015) con el catálogo de motivos de no aprobación | Sí | `REQUISITOS_NO_CUMPLIDOS`, `EVIDENCIA_INSUFICIENTE`, `EVIDENCIA_INVALIDA`, `OTRO`; «Elige el motivo» | EVD-2026-0235 |
| Descripción | textarea (CMP-015) con contador | Sí | De 10 a 1000 caracteres; «Describe el motivo (entre 10 y 1000 caracteres)» | EVD-2026-0236 |

**Acciones:** «Registrar evaluación no aprobada» (principal), «Cancelar» (confirmación si hay datos). **Estados:** default; validation-error; saving; save-error («Reintentar», conserva lo escrito); disabled. Aviso: quedará visible para el colaborador, quien la registró, el Jefe de Ingeniería y ADMIN (EVD-2026-0229, 0232).

## SCR-003-04 — Resultado de la evaluación

**Contenido:** certificada: «{Competencia} {nivel} certificado a {colaborador}», con quién y cuándo y la advertencia de visibilidad; recertificada: indica que reemplaza a la anterior; no aprobada: «La evaluación quedó registrada. No es una certificación»; error: mensaje con reintentar. Salida: «Volver al colaborador» y «Evaluar otro nivel». Textos exactos sin fuente, propuestos (SCR-003-Q2).

**Estados:** certified; recertified; not-approved; error.

## SCR-003-05 — Revocar una certificación

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Certificación | solo lectura (competencia, nivel, vigente desde, evaluador) | — | — | — |
| Motivo | select (CMP-015) | Sí | `ERROR_DE_REGISTRO`, `EVIDENCIA_INVALIDA`, `REQUISITOS_NO_CUMPLIDOS`, `OTRO` | EVD-2026-0195 |
| Descripción | textarea (CMP-015) con contador | Sí | De 10 a 1000 caracteres | EVD-2026-0194, 0201 |

**Reglas visibles:** la revocación la ven todos (hecho, motivo, quién y cuándo) salvo la descripción, que solo ven la persona certificada, los evaluadores, el Jefe y ADMIN (EVD-2026-0206, 0209); el nivel vigente se recalcula; las evidencias siguen disponibles (EVD-2026-0219). **Acciones:** «Revocar» (principal, con confirmación), «Cancelar». **Estados:** default; validation-error; saving; save-error; revoked; not-active («Esta certificación ya no está vigente»); forbidden.

## Implementation Requirements

Biblioteca: `@gf/ui`; sin `@angular/material` ni `@angular/cdk`. Todo componente usado tiene CMP en CMP-015 y CMP-016; lo que no está cubierto va como brecha, no se inventa.

| Componente | Tipo | Estados | A11y |
|---|---|---|---|
| Búsqueda de colaborador, competencia y nivel | CMP-015 Combobox-Search, Select-Dropdown | cerrado, abierto, sin resultados, error | role combobox, aria-expanded |
| Calificación CUMPLE / NO CUMPLE | CMP-015 Radio-Card | sin elegir, CUMPLE, NO CUMPLE | grupo con nombre accesible; texto e icono, no solo color |
| Motivo y descripción | CMP-015 Select-Dropdown, Text-Input (textarea, brecha) | normal, error | aria-required, aria-invalid, contador anunciado |
| Alertas y bloqueos | CMP-015 Error-Alert | visible | `role="alert"` |
| Confirmaciones | CMP-015 Confirmation-Dialog | visible | foco atrapado, Escape |
| Botones | CMP-015 Loading-Button | default, loading, disabled | foco visible |
| Lista de requisitos con estado «Cubierto / Falta» | **sin CMP (brecha)** | — | texto e icono |
| Tabla de evidencias con enlace y advertencia | **sin CMP (brecha)** | — | encabezados `th scope` |
| Textarea con contador | **sin CMP (brecha)** | — | contador anunciado |
| Estado vacío | **sin CMP (brecha)** | — | acción por teclado |

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| SCR-003-Q1 | Responsive: solo escritorio, supuesto heredado | Jefe de Ingeniería | Baja |
| SCR-003-Q2 | Textos exactos de aviso, bloqueo y resultado (los «propuesto» no tienen fuente) | Jefe de Ingeniería | Media |
| UXR-003-Q2 a Q4, FLW-003-Q1 | Heredadas del flujo: quién inicia, historia de registro de evidencias, cómo se busca al colaborador, «No aprobar» siempre disponible | Jefe de Ingeniería | Alta |
