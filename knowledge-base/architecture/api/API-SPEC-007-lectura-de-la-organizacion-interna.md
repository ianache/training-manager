---
type: Technical Design
id: API-SPEC-007
title: API REST — Lectura y alta inicial de la organización interna
description: Contrato propuesto de la organización interna (COMSATEL) — lectura (GET) y alta inicial única (POST) — para SCR-017-01 y SCR-017-02, según BR-PTY-28 enmendada el 2026-10-05.
tags: [architecture, api, rest, party, internal-organization, us-017]
status: draft
readiness: REQUIRES_REVIEW
human-reviewed: false
generated: { by: "development-handoff-builder/1.0", at: "2026-10-04T20:00:00-05:00" }
related: [API-SPEC-002, API-SPEC-006, US-017, BR-PTY-02, BR-PTY-03, BR-PTY-07, BR-PTY-17, BR-PTY-28]
sources:
  - id: dtc-017
    resource: /knowledge-base/implementation/DTC-017-handoff-desarrollo-registrar-la-organizacion-interna.md
  - id: api-spec-006
    resource: /knowledge-base/architecture/api/API-SPEC-006-gestion-de-unidades-organizacionales.md
  - id: scr-017
    resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
---

# API-SPEC-007 — Lectura y alta inicial de la organización interna

**Estado: `REQUIRES_REVIEW`.** Propuesta sin revisión humana. Responde la pregunta abierta de DTC-017: cómo lee SCR-017-01 el registro único que carga la migración 0006. **Enmienda del 2026-10-05 (EVD-2026-0242, opción B):** se añade un alta inicial `POST` (sección 2.1), solo mientras no exista ninguna organización interna; sigue sin haber edición ni baja.

## 1. Decisión de diseño

BR-PTY-28 (enmendada el 2026-10-05) deja la organización interna **fuera de la gestión** (listar, editar, desactivar) de `/organizations`; la gestión cubre solo unidades y proveedores. Se necesita leerla y darla de alta una única vez. Se propone un **recurso singular de solo lectura**, fuera de la colección:

`GET /api/v1/internal-organization`

Descartadas: `GET /organizations?type=internal_organization` (reabre el tipo en la colección y en el esquema, contra BR-PTY-28) y `GET /organizations/internal` (choca con `/{orgId}` y confunde un literal con un id).

## 2. Contrato

- **`GET` sin parámetros ni cuerpo.** `PATCH` y `DELETE` responden `405` (sin edición ni baja). `POST` es el alta inicial (2.1).
- **`200 OK`**, envoltorio `{ "data": {...} }`:

| Campo | Tipo | Fuente |
|---|---|---|
| `id` | uuid | `tb_party.pk_party_id` |
| `name` | string | razón social (`tb_organization.organization_name`) |
| `ruc` | string de 11 dígitos | `tb_party_identification` (tipo `RUC`) |
| `ruc_country` | `PE` | `issuing_country_code` |
| `from_date` | fecha | inicio del rol `INTERNAL_ORGANIZATION` (la «Vigente desde» de SCR-017-01) |
| `thru_date` | fecha o `null` | fin del rol; `null` mientras está vigente |

- **`404 INTERNAL_ORGANIZATION_NOT_FOUND`** si no hay una organización con el rol vigente: es el estado vacío de SCR-017-01, distinto de un error de carga.
- **`403`** si no es Jefe de Ingeniería ni ADMIN (BR-PTY-17); SCR-017-01 presenta entonces el estado `forbidden`.
- **`5xx`** con el error estándar `{error:{code,message,status,timestamp,request_id}}`: SCR-017-01 muestra «No se pudo cargar la organización interna.» con «Reintentar».
- Convenciones heredadas de API-SPEC-006 §2: `X-Request-ID`, token de servicio del BFF + `X-User-Name`, esquema estricto.

### 2.1 Alta inicial — `POST /api/v1/internal-organization`

Permitida **solo mientras no exista ninguna organización interna** (EVD-2026-0242). Solo Jefe de Ingeniería y ADMIN (BR-PTY-17).

Cuerpo (esquema estricto, sin campos extra):

| Campo | Tipo | Regla |
|---|---|---|
| `name` | string | razón social, obligatoria, máx. 200 |
| `ruc` | string | obligatorio, 11 dígitos (BR-PTY-07); un DNI o formato de persona se rechaza |
| `ruc_country` | string | opcional; default y único valor aceptado `PE` (supuesto: BR-PTY-07 trata el RUC por país y el RUC es peruano) |

La vigencia (`from_date`) **no se envía**: la fija el sistema con la fecha del día del servidor (supuesto, no hay regla que la defina). Crea la parte, la organización, el rol `INTERNAL_ORGANIZATION` vigente y el RUC, con auditoría `created_by` = usuario autenticado.

| Respuesta | Cuándo |
|---|---|
| `201 Created` | cuerpo `{ "data": {...} }` con los seis campos del GET y cabecera `ETag`; `Location` no se define |
| `400 VALIDATION_ERROR` | falta la razón social o excede 200, el RUC no tiene 11 dígitos o es una identificación de persona, país distinto de `PE`, o campos desconocidos |
| `401` | sin sesión |
| `403` | ni Jefe de Ingeniería ni ADMIN |
| `409 INTERNAL_ORGANIZATION_ALREADY_EXISTS` | ya existe una organización interna vigente; ante dos altas simultáneas solo una gana |
| `409 ORGANIZATION_DUPLICATE` | el RUC ya está registrado (BR-PTY-07) |

`ETag`: el `201` y el `GET` devuelven el mismo `ETag` de la representación. Como no hay edición, no se define `If-Match` (pregunta Q-4).

## 3. Capas

- **Servicio (party):** `app/routers/internal_organization.py`, un método de lectura y otro de alta inicial en el servicio (reutiliza la lógica de la migración 0006); consulta el rol `INTERNAL_ORGANIZATION` con `thru_date IS NULL`, une la organización y su RUC; devuelve el más reciente si hubiera más de uno (no debería, la migración es idempotente).
- **BFF:** rutas `GET` y `POST /api/v1/internal-organization` con `requireAnyRole(Role.JefeIngenieria, Role.Admin)`, relay al servicio (cuerpo, cabeceras y ETag; `400` y `409` intactos).
- **Portal:** SCR-017-01 consume el `GET`; su estado vacío ofrece «Registrar organización interna» (solo Jefe y ADMIN) hacia SCR-017-02, que usa el `POST`.

## 4. Seguridad y datos

El `GET` es de lectura; el `POST` recibe entrada del usuario con esquema estricto y consultas parametrizadas, y se limita a un único alta. El RUC de la organización interna no es dato personal. La respuesta no expone quién la creó (`migration-0006`).

## 5. Compatibilidad y pruebas

Aditivo: no cambia API-SPEC-002 ni API-SPEC-006. Pruebas contra PostgreSQL real: `200` con los seis campos tras la migración, `404` sin organización, `403` sin rol, `405` ante `PATCH`/`DELETE`, alta `201` con los seis campos, `409 INTERNAL_ORGANIZATION_ALREADY_EXISTS` (también con dos `POST` simultáneos), `409` por RUC repetido, `400` por DNI o RUC mal formado, `403`/`401` del `POST`, y que una unidad o un proveedor nunca se devuelve por esta ruta.

## 6. Preguntas abiertas

| ID | Pregunta | Quién |
|---|---|---|
| Q-1 | ¿Se acepta la ruta singular `/internal-organization` fuera de `/organizations`? | Jefe de Ingeniería |
| Q-2 | ¿Debe poder leerla cualquier sesión (como la lista de unidades) o solo el Jefe y ADMIN? Se propone solo Jefe y ADMIN | Jefe de Ingeniería |
| Q-3 | ¿Se muestra el país emisor tal cual (`PE`) o su nombre («Perú»)? SCR-017-01 muestra «Perú» | UX |
| Q-4 | ¿Se necesita `ETag`/`If-Match` en el alta, o basta devolver el `ETag`? Se propone solo devolverlo | Jefe de Ingeniería |
| Q-5 | ¿La vigencia es la fecha del sistema (supuesto) o se permite elegirla? | Jefe de Ingeniería |
| Q-6 | ¿Se acepta que el alta inicial deje el país fijo en `PE`? | Jefe de Ingeniería |
