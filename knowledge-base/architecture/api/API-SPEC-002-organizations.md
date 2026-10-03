---
type: Technical Design
id: API-SPEC-002
title: API REST — Organizaciones (unidades y proveedores): consulta, búsqueda y alta
description: Diseño de GET /organizations, GET /organizations/{id} y POST /organizations para alimentar los pasos Unidad y Proveedor del asistente de registro (US-015), alineado con API-SPEC-001 §3.2.
tags: [architecture, api, rest, party, organizations, us-015, us-017, us-018]
status: draft
readiness: REQUIRES_REVIEW
generated: { by: "api-designer/1.0", at: "2026-10-03T18:00:00-05:00" }
related: [API-SPEC-001, US-015, US-017, US-018, BR-PTY-03, BR-PTY-07, BR-PTY-17]
sources:
  - id: api-spec-001
    resource: /knowledge-base/architecture/api/API-SPEC-001-gestion-data-maestra-party.md
  - id: us-017
    resource: /knowledge-base/requirement/user-stories/US-017-gestionar-estructura-organizacional.md
  - id: us-018
    resource: /knowledge-base/requirement/user-stories/US-018-gestionar-proveedores-y-contratistas.md
---

# API-SPEC-002 — Organizaciones: consulta, búsqueda y alta

**Estado: `REQUIRES_REVIEW`** (sin aprobación humana de este diseño).

**Implementado (2026-10-03):** servicio (`GET`, `GET /{id}`, `POST`, migración 0003), relay del BFF y cliente del asistente. Verificado con pruebas (servicio 90, BFF 27, portal 7+3+105+177). **No** probado contra PostgreSQL ni en navegador.

**Decisiones de `human:ianache` (2026-10-03):** ruta `/organizations` aprobada (ID-1); Q-1 → diseñar e implementar también el alta (`POST`) para que haya datos; Q-2 → `location` y `code` se añaden al modelo (migración). Aprobados el 2026-10-03: alcance solo `POST` y los límites (RUC 11, code 40, location 120). Q-6 queda como seguimiento del modelo de datos.

## 1. Decisión de ruta (ID-1)
**Se sigue API-SPEC-001 §3.2: recurso único `/organizations`.** No se crean `/units` ni `/providers`. Razón: la spec ya define el recurso, y una sola ruta evita duplicar contrato y pruebas. **Consecuencia:** el portal llamaba rutas supuestas (`/units`, `/providers`); `register-collaborator.api.ts` (y su spec) pasan a `/organizations?type=…`. Cambio no compatible solo para ese cliente interno, aún sin servicio.
Procedencia: fuente (API-SPEC-001) + inferencia (consumidor único).

## 2. Alcance
Dentro: `GET /organizations`, `GET /organizations/{id}`, `POST /organizations` en party-management-service, su relay en el BFF y una migración para `location` y `code`. Fuera (supuesto, confirmar en Q-5): `PATCH`, `PATCH …/hierarchy`, `GET /tree`, desactivar (resto de US-017/018) y catálogo de roles (US-001).

## 3. Contrato

### GET /api/v1/organizations
| Parámetro | Tipo | Regla |
|---|---|---|
| `type` | `internal_unit` \| `external_provider` | opcional; el asistente siempre lo envía |
| `search` | string ≤100 | coincidencia parcial, sin distinguir mayúsculas, sobre `name`; para proveedores también RUC exacto |
| `status` | `active` \| `inactive` | por defecto `active` (vigente hoy) |
| `page`, `limit` (≤100), `sort` | como `/parties` | `sort` por defecto `name:asc` |
| `parent_id` | uuid | opcional, hijos directos de una unidad |

Respuesta `200` — mismo envoltorio que `/parties` (`data`, `pagination`, `filters_applied`):
```json
{ "data": [{ "id": "uuid", "name": "Ingeniería", "type": "internal_unit",
             "parent_id": null, "status": "active",
             "location": null, "code": null, "ruc": null }],
  "pagination": { "page": 1, "limit": 10, "total": 1, "total_pages": 1, "has_next": false, "has_prev": false },
  "filters_applied": { "type": "internal_unit", "status": "active" } }
```
`ruc` solo en `external_provider`. `location` y `code` pasan a existir (migración, §5).

### GET /api/v1/organizations/{id}
`200` con el mismo objeto; `404 NOT_FOUND`; `400 VALIDATION_ERROR` si el id no es UUID.

### POST /api/v1/organizations (crear unidad o proveedor)
Solo Jefe de Ingeniería (BR-PTY-17; `403` si no). Cuerpo: subconjunto de API-SPEC-001 §3.2, sin `contact` ni `metadata` libres (PDM-001 no tiene dónde guardarlos):
```json
{ "name": "Ingeniería Backend", "type": "internal_unit", "parent_id": "uuid|null",
  "code": "ING-BE", "location": "Sede Central", "ruc": null }
```
| Campo | Regla |
|---|---|
| `name` | obligatorio, 1–200 (`organization_name`) |
| `type` | obligatorio; `internal_unit` o `external_provider` |
| `parent_id` | solo unidades; debe existir y ser una unidad vigente; `null` = raíz |
| `ruc` | obligatorio en proveedor (11 dígitos), prohibido en unidad; único (BR-PTY-07) |
| `code`, `location` | opcionales, ≤40 y ≤120; solo unidades |

`201` con el objeto (como GET) y cabecera `Location`. `400 VALIDATION_ERROR`; `403`; `404` si el padre no existe; `409 ORGANIZATION_DUPLICATE` (nombre repetido bajo el mismo padre, o RUC repetido).
Crea `tb_party` + `tb_organization` + rol vigente (`ORGANIZATIONAL_UNIT` o `SUPPLIER`, `from_date` = hoy) y, con padre, la relación `ORG_STRUCTURE`, todo en una transacción; `created_by` = usuario final. Idempotencia: sin `Idempotency-Key`; un reintento da `409` por la unicidad (igual que `POST /parties`).

### Errores y cabeceras
Formato estándar existente (`{error:{code,message,status,timestamp,request_id}}`), `X-Request-ID`, `429` por rate limit "read" (igual que `/parties`).

## 4. Seguridad y privacidad
- Token de servicio del BFF + `X-User-Name` (ADR-005), igual que `/parties`.
- Escritura (`POST`): solo Jefe de Ingeniería, validado en el BFF (`requireAnyRole`) y de nuevo en el servicio; auditoría `created_by`/`created_at`.
- Lectura: cualquier rol autenticado del portal (los combobox del asistente la usan; el registro mismo ya exige Jefe de Ingeniería, BR-PTY-17). No expone datos personales: solo nombre, tipo, jerarquía, RUC de proveedor.
- Entrada validada con esquema estricto (`extra=forbid`), como `PartyCreateRequest`.

## 5. Datos (una migración)
Fuente: `tb_organization` + `tb_party_role` (`ORGANIZATIONAL_UNIT` / `SUPPLIER`, vigente = `thru_date IS NULL`), nombre en `organization_name`, RUC en `tb_party_identification` (tipo `RUC`), padre en `tb_party_relationship` (`ORG_STRUCTURE`). **Migración nueva (Alembic):** `tb_organization` gana `code VARCHAR(40) NULL` y `location VARCHAR(120) NULL` (aditiva y reversible). Falta el modelo ORM de `organization`; se añade.

## 6. Compatibilidad y versionado
`/api/v1`, aditivo. API-SPEC-001 §3.2 no cambia; este documento detalla lectura y alta (cuerpo reducido respecto de §3.2). Migración aditiva.

## 7. Verificación propuesta
Pruebas de contrato del servicio (lista, filtros, paginación, 404/400, vigencia, alta con todas sus reglas y 409, rol 403), pruebas del relay del BFF (RBAC, 503 sin servicio, query permitida) y prueba del cliente del portal contra el nuevo path. TDD: cada una fallando antes.

## 8. Riesgos y preguntas abiertas
| ID | Pregunta / riesgo | Bloquea |
|---|---|---|
| ~~Q-1~~ | Resuelta: se diseña el alta (`POST`). | — |
| ~~Q-2~~ | Resuelta: `code` y `location` se añaden al modelo. Los límites 40/120 son supuestos míos. | — |
| ~~Q-5~~ | Resuelta (ianache): solo `POST`. | — |
| ~~Q-6~~ | Resuelta (ianache, 2026-10-03): el contacto de la organización pertenece al **dominio y microservicio Party** (no hay dominio nuevo). Modelo conceptual: IMD-002 R-11 ya cubre medios de contacto de cualquier parte; qué contactos se registran queda en IM-Q8 y `tax_regime`/metadata en IM-Q9 (sin fuente de negocio). El cuerpo del `POST` sigue reducido hasta responderlas; añadir contacto será un cambio aditivo en este mismo servicio. | — |
| ~~Q-7~~ | Resuelta (ianache): RUC de 11 caracteres; `code` ≤40 y `location` ≤120 aceptados. | — |
| Q-3 | US-017 y US-018 siguen `draft`; su contrato de lectura puede cambiar al refinarse | No |
| Q-4 | `type` usa los nombres de API-SPEC-001 (`internal_unit`/`external_provider`), no los códigos de BD | No |

## 8b. Cambio propuesto v3 (pendiente de aprobación; no implementado)
Decisiones de ianache (2026-10-03): la organización registra **correo laboral y teléfono laboral**, y el proveedor un **régimen tributario** (IMD-002 R-31, R-32).

| Aspecto | Propuesta | Estado |
|---|---|---|
| Contacto | `POST` acepta `contact: {email_work?, phone_work?}`; se guardan en `tb_contact_mechanism` + `tb_party_contact_mechanism` con propósito `WORK_EMAIL` / `WORK_PHONE`, vigentes desde hoy. **Sin migración**: el modelo físico ya lo permite para cualquier parte. Respuesta y `GET` devuelven `contact` | Esperando IM-Q10 (obligatoriedad, cuántos, unicidad frente a colaboradores) |
| Régimen tributario | `tax_regime` solo para `external_provider`. **Requiere migración**: `tb_organization.tax_regime VARCHAR(40) NULL` | Esperando IM-Q11 (valores admitidos) |
| Validación | correo con el formato ya usado en `PartyCreateRequest`; teléfono con el formato del servicio de partes | A confirmar |
| Privacidad | el contacto de una organización no es dato personal de una persona; aun así se entrega solo a usuarios autenticados, como el resto | Supuesto |
| `metadata` genérico | **No** se acepta un objeto libre: cada metadato será un campo con nombre cuando IM-Q11 lo defina | Propuesta |


## 9. Siguiente acción
Plan de implementación y desarrollo TDD (servicio → BFF → portal). Q-6 pendiente como seguimiento.
