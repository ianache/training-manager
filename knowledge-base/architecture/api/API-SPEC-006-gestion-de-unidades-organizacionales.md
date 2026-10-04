---
type: Technical Design
id: API-SPEC-006
title: API REST — Gestión de la estructura organizacional (organización interna y unidades)
description: Contrato propuesto para US-017, US-028, US-029 y US-030 sobre el recurso /organizations de party. Amplía API-SPEC-002 (consulta, búsqueda y alta) con la organización interna, el listado con filtros y conteos, la edición del nombre, el cambio de unidad padre, desactivar, reactivar y el historial.
tags: [architecture, api, rest, party, organizations, us-017, us-028, us-029, us-030]
status: draft
readiness: REQUIRES_REVIEW
generated: { by: "development-handoff-builder/1.0 (diseño de contrato; sustituye al api-designer hasta su revisión)", at: "2026-10-04T12:00:00-05:00" }
related: [API-SPEC-001, API-SPEC-002, US-017, US-028, US-029, US-030, BR-PTY-03, BR-PTY-04, BR-PTY-07, BR-PTY-12, BR-PTY-17, BR-PTY-21, BR-PTY-22, BR-PTY-23, BR-PTY-24, BR-PTY-25, BR-PTY-26]
sources:
  - id: api-spec-002
    resource: /knowledge-base/architecture/api/API-SPEC-002-organizations.md
  - id: us-017
    resource: /knowledge-base/requirement/user-stories/US-017-gestionar-estructura-organizacional.md
  - id: us-028
    resource: /knowledge-base/requirement/user-stories/US-028-listar-y-buscar-unidades-organizacionales.md
  - id: us-029
    resource: /knowledge-base/requirement/user-stories/US-029-registrar-y-editar-unidades-organizacionales.md
  - id: us-030
    resource: /knowledge-base/requirement/user-stories/US-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# API-SPEC-006 — Gestión de la estructura organizacional

**Estado: `REQUIRES_REVIEW`.** Es una **propuesta**: ningún humano ha revisado este contrato ni `api-contract-reviewer` ni `api-security-reviewer` lo han evaluado. Lo que ya existe en el código (`GET`, `GET /{id}` y `POST /organizations` del servicio y del BFF) se conserva; todo lo demás es nuevo.

## 1. Qué cambia respecto de API-SPEC-002

| Necesidad | Existe hoy | Qué falta |
|---|---|---|
| Listar unidades con búsqueda, estado y padre (US-028) | `GET /organizations` con `type`, `search`, `status`, `parent_id` (hijos directos), `page`, `limit`, `sort` | Filtrar por padre **con descendientes**; ordenar por padre, estado y vigencia; devolver vigencia desde/hasta y los conteos; vista en árbol |
| Registrar unidad (US-029 AC-1) | `POST /organizations` (`type: internal_unit`) | **Conflicto:** hoy exige `contact.email_work` y el diseño (SCR-029-01) no tiene ese campo (ver Q-1) |
| Editar nombre (US-029 AC-2) | — | `PATCH /organizations/{id}` |
| Cambiar la unidad padre (US-029 AC-3 a 6) | — | `POST /organizations/{id}/parent` |
| Desactivar y reactivar (US-030) | — | `POST …/deactivate` y `…/reactivate` |
| Historial de relaciones (SCR-029-04) | — | `GET …/relationships` |
| Registrar la organización interna (US-017) | — (los tipos son solo `internal_unit` y `external_provider`; el servicio ignora el rol `INTERNAL_ORGANIZATION`) | Tipo nuevo `internal_organization` con razón social y RUC |

Se mantiene la decisión ID-1 de API-SPEC-002: **un único recurso `/organizations`**, sin `/units`.

## 2. Convenciones heredadas

Ruta `/api/v1`, envoltorio `{data, pagination, filters_applied}`, errores `{error:{code,message,status,timestamp,request_id}}`, `X-Request-ID`, token de servicio del BFF + `X-User-Name` (ADR-005), esquema estricto (`extra=forbid`). **Valores de estado: `active`/`inactive` en minúsculas**, como party (EVD-2026-0162: BR-CAT-27 no se propaga a las API en uso); la interfaz los muestra como «Activa»/«Inactiva».

## 3. Contrato

### 3.1 `GET /organizations` (ampliado)

| Parámetro | Regla |
|---|---|
| `type` | `internal_unit` · `external_provider` · `internal_organization` |
| `search` | ≤100, coincidencia parcial sin distinguir mayúsculas, sobre `name` |
| `status` | `active` (por defecto) · `inactive` · `all` |
| `parent_id` | hijos directos (existente) |
| `ancestor_id` | **nuevo:** la unidad y todos sus descendientes, para el filtro «Unidad padre» de AC-4 de US-028 |
| `sort` | `name`, `parent_name`, `status`, `from_date` con `:asc`/`:desc`; por defecto `name:asc` |
| `view` | **nuevo:** `list` (por defecto) · `tree` |

Cada elemento añade, solo para `internal_unit`: `from_date` (inicio de la vigencia del rol), `thru_date` (fin, `null` si está activa), `active_children_count` y `current_people_count`. En `view=tree` los elementos llevan `children: [...]` hasta una profundidad máxima (Q-4). `200 OK`; `403` si no es Jefe de Ingeniería (Q-2).

### 3.2 `POST /organizations` con `type: internal_organization`

Cuerpo `{ "name": "COMSATEL", "ruc": "20123456789", "ruc_country": "PE", "contact": {…} }`. Reglas: `ruc` obligatorio, 11 caracteres; único por número y país (BR-PTY-07) → `409 ORGANIZATION_DUPLICATE`; una **organización interna vigente** (Q-3); un DNI o formato de persona → `400 VALIDATION_ERROR` (US-017 AC-2). Crea la parte, la organización y el rol vigente `INTERNAL_ORGANIZATION`. `201` con el objeto. Se aplica a la unidad la misma pregunta sobre `contact` (Q-1).

### 3.3 `PATCH /organizations/{id}`

`{ "name": "Soporte Técnico" }` (solo el nombre en esta versión). Reglas: 1–200; **único entre unidades con el mismo padre** (BR-PTY-26) → `409 ORGANIZATION_DUPLICATE`. Conserva el valor anterior en un registro de auditoría (US-029 AC-2, BR-PTY-12; ver §5). `200` con el objeto; `404`; `403`. Concurrencia optimista con `If-Match` (**supuesto:** `row_version`, como el catálogo; `412 PRECONDITION_FAILED`).

### 3.4 `POST /organizations/{id}/parent`

`{ "parent_id": "uuid", "from_date": "2026-10-03" }`. Una transacción: cierra la relación `ORG_STRUCTURE` vigente y abre la nueva (BR-PTY-12, AC-3). Rechazos:

| Condición | Código | HTTP | Regla |
|---|---|---|---|
| El padre es la propia unidad o uno de sus descendientes | `ORGANIZATION_CYCLE` | 409 | BR-PTY-22 |
| El padre está `inactive` | `PARENT_INACTIVE` | 409 | BR-PTY-25 |
| El nombre ya existe bajo el nuevo padre | `ORGANIZATION_DUPLICATE` | 409 | BR-PTY-26 (inferido, SCR-029-Q11) |
| `from_date` ausente o inválida | `VALIDATION_ERROR` | 400 | AC-3 |
| La unidad está `inactive` | `ORGANIZATION_INACTIVE` | 409 | Q-5 |

`parent_id: null` para la unidad superior (hipótesis H-2 de US-029, Q-6).

### 3.5 `POST /organizations/{id}/deactivate`

Sin cuerpo (confirmación en la interfaz). Cierra la vigencia del rol y de su relación de estructura (`thru_date` = hoy); **no borra** (BR-PTY-12, BR-PTY-21). Si tiene unidades hijas activas o personas con pertenencia vigente: `409 ORGANIZATION_HAS_DEPENDENCIES` con `{ "active_children_count": 3, "current_people_count": 12 }` en `error.details` (US-030 AC-2, BR-PTY-23). Ya `inactive` → `409 ORGANIZATION_ALREADY_INACTIVE`.

### 3.6 `POST /organizations/{id}/reactivate`

`{ "from_date": "2026-10-04", "parent_id": "uuid|null" }`. Abre una **nueva vigencia** del rol y de la relación (US-030 AC-3, BR-PTY-24). Si su padre está `inactive`: `409 PARENT_INACTIVE` con el nombre y el `id` del padre en `error.details` (AC-4); no se reactiva el padre automáticamente. Ya `active` → `409 ORGANIZATION_ALREADY_ACTIVE`.

### 3.7 `GET /organizations/{id}/relationships`

Historial de relaciones de estructura, de la más reciente a la más antigua, paginado: `{ previous_parent: {id,name}|null, new_parent: {id,name}|null, from_date, thru_date|null, changed_by }` (SCR-029-04). La relación vigente lleva `thru_date: null`.

## 4. Seguridad

- **Quién:** hoy BR-PTY-17 y las historias dicen «Jefe de Ingeniería». La decisión del 2026-10-03 amplió a ADMIN la asignación de Rol-Nivel y el catálogo; **no está dicho si ADMIN gestiona la estructura** (Q-2). Hasta que se decida: solo `jefe_ingenieria`, validado en el BFF (`requireAnyRole`) y de nuevo en el servicio.
- **Lectura:** cualquier sesión puede leer la lista de unidades (la usa el asistente de US-015), pero **la pantalla de gestión es solo del Jefe** (EVD-2026-0142). Los conteos de personas no identifican a nadie. Los demás colaboradores ven únicamente la unidad de cada persona (BR-PTY-20).
- **Auditoría:** cada cambio guarda quién, cuándo, valor anterior y nuevo (BR-PTY-12).
- **Entrada:** esquema estricto, consultas parametrizadas, rate limit como `/organizations` (lectura 1000/h, escritura 100/h en desarrollo).

## 5. Datos

La estructura vigente ya se representa con `tb_party_role` (`ORGANIZATIONAL_UNIT`, `from_date`/`thru_date`) y `tb_party_relationship` (`ORG_STRUCTURE`, con vigencia). Desactivar y reactivar no necesita columnas nuevas: cierran y abren vigencias. Para cumplir los criterios hacen falta:

| Cambio | Motivo |
|---|---|
| Registrar `INTERNAL_ORGANIZATION` y su RUC en el servicio (el rol ya está sembrado) | US-017 |
| **Historial de cambios del nombre** con el valor anterior (tabla de auditoría o histórico) | US-029 AC-2; hoy solo hay columnas `created_by`/`updated_by` y `DM-Q-01` de LDM-001 («¿historial campo a campo?») sigue abierta |
| Índice de unicidad del nombre **entre unidades con el mismo padre vigente** | BR-PTY-26 |
| Consulta de ciclos (recursiva) y de descendientes | BR-PTY-22 y `ancestor_id` |
| Cálculo de `active_children_count` y `current_people_count` | BR-PTY-23 (la pertenencia persona ↔ unidad existe: `BR-PTY-04`) |

Requiere una migración (siguiente a `0004`) para la auditoría y el índice; el resto es lógica de servicio. No se escribe aquí el DDL (no se ejecutó nada).

## 6. Compatibilidad

Todo es **aditivo** salvo la decisión sobre `contact` (Q-1), que cambia el contrato publicado de `POST`. El BFF añade las rutas nuevas con `requireAnyRole(Role.JefeIngenieria)` y amplía `LIST_QUERY` con `ancestor_id` y `view`.

## 7. Verificación propuesta

Un caso por fila de errores (400, 404, 409, 412), incluido el ciclo (A↔B, A bajo su propio descendiente), el nombre repetido bajo el mismo padre y permitido bajo otro, la desactivación bloqueada con conteos, la reactivación con padre inactivo, el historial ordenado y la autorización (no Jefe → 403). Concurrencia de dos cambios de padre. **Contra PostgreSQL real**, no solo SQLite.

## 8. Preguntas abiertas

| ID | Pregunta | Quién | Bloquea |
|---|---|---|---|
| Q-1 | `POST /organizations` exige `contact.email_work` (API-SPEC-002 v3) pero ni US-029 ni SCR-029-01 ni SCR-017-02 tienen campo de contacto. ¿Se pide el contacto al registrar una unidad y la organización interna, o se hace opcional para ellas? | Jefe de Ingeniería | `POST` y los formularios |
| Q-2 | ¿ADMIN también gestiona la estructura (BR-PTY-17 ampliado el 2026-10-03)? | Jefe de Ingeniería | Permisos |
| Q-3 | ¿Puede haber más de una organización interna vigente? (UXR-017-Q3) | Jefe de Ingeniería | `POST` interna |
| Q-4 | Profundidad máxima y volumen esperado de unidades; ¿paginación del árbol? (UXR-028-Q1) | Jefe de Ingeniería | `view=tree` |
| Q-5 | ¿Se puede editar el nombre o cambiar el padre de una unidad `inactive`? (SCR-029-Q7) | Jefe de Ingeniería | `PATCH`, `…/parent` |
| Q-6 | ¿Cómo se registra la unidad superior (sin padre)? Hipótesis H-2 de US-029 | Jefe de Ingeniería | `POST` unidad |
| Q-7 | `code` y `location` existen en la API y no en las pantallas: ¿se gestionan en la interfaz? (UXR-029-Q4) | Jefe de Ingeniería | Formularios |
| Q-8 | `If-Match`/`row_version` en `PATCH` y cambio de padre: supuesto mío | Arquitecto | Concurrencia |
| Q-9 | Historial: ¿tabla de auditoría genérica o específica? (DM-Q-01 de LDM-001) | Arquitecto + Jefe | Migración |
