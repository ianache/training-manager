---
type: Technical Design
id: API-SPEC-007
title: API REST — Lectura de la organización interna
description: Contrato propuesto de solo lectura para que SCR-017-01 muestre la organización interna (COMSATEL) cargada por la migración 0006, sin reabrir BR-PTY-28.
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

# API-SPEC-007 — Lectura de la organización interna

**Estado: `REQUIRES_REVIEW`.** Propuesta sin revisión humana. Responde la pregunta abierta de DTC-017: cómo lee SCR-017-01 el registro único que carga la migración 0006.

## 1. Decisión de diseño

BR-PTY-28 deja la organización interna **fuera de la gestión** (listar, registrar, editar, desactivar) de `/organizations`. Se necesita solo leerla. Se propone un **recurso singular de solo lectura**, fuera de la colección:

`GET /api/v1/internal-organization`

Descartadas: `GET /organizations?type=internal_organization` (reabre el tipo en la colección y en el esquema, contra BR-PTY-28) y `GET /organizations/internal` (choca con `/{orgId}` y confunde un literal con un id).

## 2. Contrato

- **Sin parámetros ni cuerpo.** Solo `GET`; cualquier otro método responde `405`.
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

## 3. Capas

- **Servicio (party):** `app/routers/internal_organization.py` y un método de lectura en el servicio; consulta el rol `INTERNAL_ORGANIZATION` con `thru_date IS NULL`, une la organización y su RUC; devuelve el más reciente si hubiera más de uno (no debería, la migración es idempotente).
- **BFF:** ruta `GET /api/v1/internal-organization` con `requireAnyRole(Role.JefeIngenieria, Role.Admin)`, relay al servicio.
- **Portal:** SCR-017-01 consume la ruta; no hay formulario (SCR-017-02 sin uso).

## 4. Seguridad y datos

Lectura únicamente; no hay entrada del usuario, así que no hay vector de inyección ni de escritura. El RUC de la organización interna no es dato personal. La respuesta no expone quién la creó (`migration-0006`).

## 5. Compatibilidad y pruebas

Aditivo: no cambia API-SPEC-002 ni API-SPEC-006. Pruebas contra PostgreSQL real: `200` con los seis campos tras la migración, `404` sin organización, `403` sin rol, `405` ante `POST`/`PATCH`/`DELETE`, y que una unidad o un proveedor nunca se devuelve por esta ruta.

## 6. Preguntas abiertas

| ID | Pregunta | Quién |
|---|---|---|
| Q-1 | ¿Se acepta la ruta singular `/internal-organization` fuera de `/organizations`? | Jefe de Ingeniería |
| Q-2 | ¿Debe poder leerla cualquier sesión (como la lista de unidades) o solo el Jefe y ADMIN? Se propone solo Jefe y ADMIN | Jefe de Ingeniería |
| Q-3 | ¿Se muestra el país emisor tal cual (`PE`) o su nombre («Perú»)? SCR-017-01 muestra «Perú» | UX |
