---
type: Screen
title: SCR-004 — Consultar mi perfil de competencias
description: Especificación de las pantallas para que el colaborador vea su nivel certificado vigente por competencia, su historial de certificaciones y evaluaciones, y las evidencias de cada una.
tags:
- ux-ui
- screen
- perfil
- certificacion
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-04T13:00:00-05:00'
sources:
- id: flw-004
  resource: /knowledge-base/design/user-flows/FLW-004-consultar-mi-perfil-de-competencias.md
- id: uxr-004
  resource: /knowledge-base/design/ux-requirements/UXR-004-consultar-mi-perfil-de-competencias.md
- id: uxr-000
  resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
- id: us-004
  resource: /knowledge-base/requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: api-spec-005
  resource: /knowledge-base/architecture/api/API-SPEC-005-certificaciones-y-evidencias.md
screens:
- id: SCR-004-01
  name: Mi perfil de competencias
  flow: FLW-004
  requirements: &req
  - US-004
  - UXR-004
  - UXR-000
  required_states:
  - default
  - loading
  - empty
  - error
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
- id: SCR-004-02
  name: Competencia (historial y evidencias)
  flow: FLW-004
  requirements: *req
  required_states:
  - default
  - loading
  - error
  - with-revoked
  - with-not-approved
  - no-current-level
  - restricted
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-004 — Consultar mi perfil de competencias

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Sigue la estructura de SCR-001 y SCR-003. Tokens «Comsatel Styled» (`TKN-SET-002`). Estado `draft`; revisión humana pendiente.

## Trazabilidad

- **Historia:** US-004 (AC-1 a AC-3) → **UXR:** UXR-004 y UXR-000 → **Flujo:** FLW-004 (SCR-004-01..02).
- **Datos:** `GET /certified-levels`, `GET /certifications` y `GET /evidences` de API-SPEC-005.
- **Alcance de dispositivo:** solo escritorio (SCR-004-Q1).
- **Terminología:** «Nivel certificado», «Vigente», «Reemplazada», «Revocada», «Evaluación no aprobada». No decir «rechazada» ni «vencida»: las certificaciones no vencen.

## Permisos por actor

| Actor | Ve | Hace |
|---|---|---|
| Colaborador | Su propio perfil completo, incluida la descripción de una revocación y sus evaluaciones no aprobadas | Solo lectura |
| Otro colaborador | El resumen de niveles, las certificaciones, su auditoría y las evidencias; no la descripción de una revocación ni las evaluaciones no aprobadas (UXR-004-Q2) | Solo lectura |
| ADMIN | Todo, también de una persona anonimizada | Solo lectura |

## SCR-004-01 — Mi perfil de competencias

| Elemento | Descripción | Fuente |
|---|---|---|
| Rol | El rol asignado; el nivel de rol si se muestra es una decisión de UX pendiente (P-28) | UXR-004.1 |
| Lista de competencias | Por cada una: nombre, **nivel certificado vigente** (con su nombre, no solo color), fecha y quién lo certificó (código de party o solo el nombre del rol) | UXR-004.2, 004.5; EVD-2026-0186, 0226 |
| Acceso al detalle | Cada competencia abre SCR-004-02 | UXR-004.4 |
| Estado vacío | «Todavía no tienes niveles certificados» | AC-3 |

**Estados:** default; loading; empty; error («Reintentar»). La vista indica que otros colaboradores ven este resumen (UXR-004; BR-TRA-03).

## SCR-004-02 — Competencia (historial y evidencias)

| Elemento | Descripción | Fuente |
|---|---|---|
| Nivel vigente | El más alto de las certificaciones vigentes, o «Sin nivel vigente» | EVD-2026-0186 |
| Historial | Cada certificación con su estado (vigente, reemplazada, revocada), nivel, fecha y evaluador | AC-2; UXR-004.6 |
| Revocada | Motivo tipificado, quién, cuándo y la **descripción** (visible para la persona certificada) | UXR-004.7; EVD-2026-0206 |
| Evaluación no aprobada | Motivo tipificado y descripción; presentación pendiente (UXR-004-Q3) | UXR-004.8 |
| Evidencias | Por certificación: categoría, descripción, enlace con la advertencia de red privada y calificación CUMPLE o NO CUMPLE; siguen disponibles aunque la certificación se revoque | UXR-004.9; EVD-2026-0219 |

**Estados:** default; loading; error; with-revoked; with-not-approved; no-current-level; restricted («Acceso restringido»: persona anonimizada, solo ADMIN, EVD-2026-0218).

## Implementation Requirements

Biblioteca: `@gf/ui`; sin `@angular/material` ni `@angular/cdk`. Los componentes cubiertos son CMP-015 y CMP-016; lo demás va como brecha.

| Componente | Tipo | Estados | A11y |
|---|---|---|---|
| Lista de competencias con nivel | lista de pares (sin CMP: brecha) | default, vacío | lista semántica |
| Insignia de nivel y de estado de certificación | badge (sin CMP: brecha) | vigente, reemplazada, revocada, no aprobada | texto e icono, no solo color |
| Historial de certificaciones | tabla (sin CMP: brecha) | default | `th scope` |
| Alertas de error y de acceso restringido | CMP-015 Error-Alert | visible | `role="alert"` |
| Estado vacío | sin CMP (brecha) | visible | acción por teclado |
| Enlace de evidencia con advertencia | sin CMP (brecha) | default, foco | nombre accesible que incluye la advertencia |

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| SCR-004-Q1 | Responsive: solo escritorio, supuesto heredado | Jefe de Ingeniería | Baja |
| SCR-004-Q2 | Textos exactos de vacío, restringido y avisos (sin fuente) | Jefe de Ingeniería | Media |
| UXR-004-Q2 a Q4 | Heredadas: perfil de otra persona, presentación de la evaluación no aprobada, dónde registra evidencias el colaborador | Jefe de Ingeniería | Alta |
