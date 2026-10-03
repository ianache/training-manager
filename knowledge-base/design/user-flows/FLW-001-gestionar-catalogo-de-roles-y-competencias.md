---
id: FLW-001
type: User Flow
title: "FLW-001 — Gestionar el catálogo de roles y competencias"
description: "Flujo para consultar el catálogo, crear y editar roles con sus Rol-Nivel y competencias, y versionar y aprobar competencias con su rúbrica y requisitos de evidencia."
tags: [ux-ui, user-flow, catalogo, roles, competencias, versiones]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-03T23:45:00-05:00"
sources:
  - id: uxr-001
    resource: /knowledge-base/design/ux-requirements/UXR-001-gestionar-catalogo-de-roles-y-competencias.md
  - id: us-001
    resource: /knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md
  - id: dsp-001
    resource: /knowledge-base/requirement/scope-packs/DSP-001-catalogo-de-roles-y-niveles.md
  - id: api-spec-003
    resource: /knowledge-base/architecture/api/API-SPEC-003-catalogo-de-roles-y-competencias.md
requirements: [US-001, UXR-001]
screens: [SCR-001-01, SCR-001-02, SCR-001-03, SCR-001-04]
---

# FLW-001 — Gestionar el catálogo de roles y competencias

## Trazabilidad

- **Lineage:** US-001 (AC-1 a AC-13) → UXR-001 → FLW-001 → SCR-001-01..04.
- **Reglas:** BR-CAT-02/03/04/05/07 a 21, BR-CAT-22 (versiones), BR-ACR-07 a 09, 12, 13, BR-TRA-02. Decisiones del 2026-10-03: EVD-2026-0143 a 0151.
- **Pantallas (IDs reservados; las especifica `ui-spec-writer`):**

| SCR | Propósito en el flujo |
|---|---|
| SCR-001-01 | Catálogo: lista de roles (con sus niveles) y de competencias, búsqueda; vista de solo lectura para todo colaborador |
| SCR-001-02 | Rol: sus Rol-Nivel y, por nivel, sus competencias con el L esperado; alta y edición; advertencia donde una competencia referencia una versión anterior |
| SCR-001-03 | Competencia: versiones, versión vigente, rúbrica y requisitos de evidencia por nivel (niveles sin requisitos como no utilizables) y dónde se usa |
| SCR-001-04 | Edición de una versión en borrador (rúbrica y requisitos requerido/deseado) y su aprobación |

Cada SCR debe declarar `flow: FLW-001`.

## Happy path

**Actor:** Jefe de Ingeniería. **Objetivo:** dar de alta un rol con sus niveles y competencias. **Precondición:** sesión con permiso de edición del catálogo.

1. Abre el catálogo (SCR-001-01) y ve roles y competencias.
2. Si la competencia que necesita no existe, la crea (SCR-001-03/04): se crea con su versión 1 en borrador, define la rúbrica y los requisitos de evidencia de los niveles que decida (definición progresiva, BR-CAT-17), marca cada requisito requerido o deseado y la aprueba.
3. Crea el rol en SCR-001-02: nombre, sus Rol-Nivel (cantidad y nombres propios, BR-CAT-09) y, por nivel, las competencias con el L1–L4 esperado.
4. Guarda: el sistema valida las reglas y registra la auditoría; el rol aparece en SCR-001-01 y queda disponible para el asistente de alta y para US-019.

**Variante versionar:** desde SCR-001-03 el Jefe (o ADMIN) crea una versión nueva copiada de la vigente, la edita (SCR-001-04) y la aprueba. La anterior deja de ser la vigente; los Rol-Nivel existentes siguen apuntando a ella y SCR-001-02 muestra la advertencia con la sugerencia de la nueva (EVD-2026-0143).

**Variante lectura:** cualquier colaborador entra a SCR-001-01 y navega a SCR-001-02/03 sin acciones de edición (AC-12, EVD-2026-0118).

## Excepciones, permisos y estados

| Id | Situación | Comportamiento del flujo | Origen |
|---|---|---|---|
| E1 | Competencia sin nivel L esperado | No se guarda el Rol-Nivel; se explica por qué | AC-2, BR-CAT-03 |
| E2 | Nivel fuera de L1–L4 | Se rechaza (selección acotada a la escala) | AC-3, BR-CAT-02 |
| E3 | Rol sin ninguna competencia | No se guarda | AC-10, BR-CAT-20 |
| E4 | Misma competencia repetida en un Rol-Nivel | No se permite agregarla; en otro Rol-Nivel del mismo rol sí, con L mayor | AC-13, EVD-2026-0148 |
| E5 | Exigir un nivel L sin requisitos de evidencia, o sin ninguno requerido | Se bloquea y se explica que primero hay que definir cómo se evidencia | AC-11, BR-ACR-13, EVD-2026-0149 |
| E6 | Requisito de evidencia sin marcar requerido o deseado | No se guarda | AC-8, BR-ACR-12 |
| E7 | Nombre de rol o de competencia repetido | Error asociado al campo, conserva lo ingresado (409) | API-SPEC-003 |
| E8 | Otra persona editó el mismo rol o competencia | Se avisa del conflicto y se ofrece recargar (412) | LDM-002 CM-09 |
| E9 | Ya existe un borrador de la competencia | Se abre el borrador existente en lugar de crear otro | API-SPEC-003 |
| E10 | Editar una versión ya aprobada | No se edita: se crea una versión nueva | BR-CAT-22 |
| E11 | Error al guardar o al cargar | Mensaje con reintentar sin perder lo ingresado | UXR-000 |
| E12 | Usuario sin permiso de edición | No ve las acciones; ve el catálogo en lectura | BR-CAT-04, UXR-000.2 |
| E13 | Cambiar una competencia que usan varios roles | Muestra el impacto (dónde se usa) antes de guardar (inferencia, confirmar) | BR-CAT-07, UXR-001 |

**Estados:** SCR-001-01: cargando, vacío (sin roles ni competencias), lista, error de carga, solo lectura. SCR-001-02: edición, error de validación, guardando, éxito, conflicto, con advertencia de versión anterior. SCR-001-03: sin versión aprobada, con borrador, niveles parciales (no utilizables). SCR-001-04: edición del borrador, error de validación, aprobando, aprobado.

**Permisos**

| Actor | Ve | Hace |
|---|---|---|
| Cualquier colaborador | SCR-001-01 a 03 en lectura | Consultar |
| Jefe de Ingeniería | Todo | Editar roles; definir rúbricas y requisitos; aprobar versiones |
| ADMIN | Todo | Aprobar versiones (EVD-2026-0144); editar roles y requisitos: **no definido** (FLW-001-Q1) |
| Responsable de producto | Todo | Editar roles (EVD-2026-0147); el rol no existe aún en Keycloak (FLW-001-Q2) |

**Accesibilidad (UXR-000, WCAG 2.2 AA):** etiquetas ligadas a campos, errores con `role="alert"`, foco al primer error, teclado completo, contraste 4.5:1. La advertencia de versión anterior y el nivel «no utilizable» no dependen solo del color ni de un icono.

**Fuera de este flujo:** escala salarial, MOF y criterios de nivel (BR-CAT-18); rutas de formación (H2); asignar Rol-Nivel a personas (FLW-019).

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| FLW-001-Q1 | ¿ADMIN puede editar roles, rúbricas y requisitos además de aprobar versiones? | Jefe de Ingeniería | Alta | SCR-001-02..04 (acciones visibles) |
| ~~FLW-001-Q2~~ | ~~¿Qué rol de Keycloak es el Responsable de producto y qué edita? (UXR-001-Q3)~~ Respondida (ianache, 2026-10-03): rol `product_owner` creado en Keycloak (EVD-2026-0154); edita roles. | Jefe de Ingeniería | Alta | Permisos |
| UXR-001-Q2 | ¿La versión incluye rúbrica y requisitos? ¿La anterior pasa a DEPRECATED al aprobar? | Jefe de Ingeniería | Alta | SCR-001-03/04 |
| FLW-001-Q3 | ¿Un rol o competencia se elimina o solo se desactiva? (DM-Q-03) | Jefe de Ingeniería | Media | Acciones de SCR-001-02 |
| ~~FLW-001-Q4~~ | ~~¿Se marca una competencia como «transversal» (UXR-001.8) o es solo una que está en varios roles?~~ Respondida (ianache, 2026-10-03): sí, se marca como transversal (EVD-2026-0156). | Jefe de Ingeniería | Baja | SCR-001-03 |
