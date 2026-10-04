---
type: Technical Design
id: API-SPEC-004
title: API REST — Asignación de Rol-Nivel a una persona (consulta, asignar y cambiar nivel)
description: Contrato de GET y POST /parties/{id}/role-assignments y de la consulta de elegibilidad para US-019; reemplaza §3.3 de API-SPEC-001 y se apoya en el catálogo (API-SPEC-003).
tags: [architecture, api, rest, party, rol-nivel, us-019]
status: draft
readiness: REQUIRES_REVIEW
generated: { by: "api-designer/1.0", at: "2026-10-04T03:00:00-05:00" }
related: [API-SPEC-001, API-SPEC-003, ADR-006, ADR-011, ADR-012, LDM-001, LDM-002, US-019, BR-PRF-03, BR-PTY-11, BR-PTY-12, BR-PTY-14, BR-CAT-30]
sources:
  - id: api-spec-001
    resource: /knowledge-base/architecture/api/API-SPEC-001-gestion-data-maestra-party.md
  - id: api-spec-003
    resource: /knowledge-base/architecture/api/API-SPEC-003-catalogo-de-roles-y-competencias.md
  - id: us-019
    resource: /knowledge-base/requirement/user-stories/US-019-asignar-rol-nivel.md
  - id: ldm-001
    resource: /knowledge-base/architecture/data-model/LDM-001-modelo-logico-de-partes.md
  - id: dcp-003
    resource: /knowledge-base/architecture/ad-handoff/DCP-003-catalogo-de-roles-y-niveles.md
---

# API-SPEC-004 — Asignación de Rol-Nivel

**Estado: `REQUIRES_REVIEW`.** Diseño del agente sin aprobación humana. Nada está implementado: la tabla `tb_role_level_assignment` existe en la base de party (renombrada por la migración 0002), pero el servicio no tiene modelo ni rutas para ella.

## 1. Relación con API-SPEC-001 §3.3

API-SPEC-001 §3.3 ya bosquejaba `POST/GET/PATCH /parties/{id}/role-assignments`. Este documento **lo reemplaza** en lo siguiente, por las decisiones posteriores del 2026-10-03:

| §3.3 original | Aquí | Por qué |
|---|---|---|
| `role` y `level` por nombre | `catalog_role_id` y `catalog_role_level_id` | Party referencia el catálogo por ids lógicos (LDM-001 DM-07, ADR-011) |
| `PATCH …/{rid}` para cambiar el nivel | Se elimina; cambiar = `POST` de un nivel nuevo | Las vigencias no se actualizan en el lugar (API-SPEC-001 §2.4) |
| `reason` | Se elimina | Ninguna fuente lo pide |
| Cierra la anterior con `thru_date = today()` | Con `thru_date = from_date` de la nueva | US-019 AC-3: «vigente desde esa fecha» (supuesto, AQ-3) |
| Solo el Jefe de Ingeniería | Jefe de Ingeniería **y ADMIN** | EVD-2026-0152 |

El resto de API-SPEC-001 (autenticación, errores §4.2, paginación, rate limit) se mantiene.

## 2. Alcance

- **Incluye:** consultar asignaciones vigentes e historial, asignar un rol nuevo, cambiar el nivel de un rol y consultar la elegibilidad para subir de nivel.
- **No incluye:** el nivel inicial al registrar al colaborador (FLW-015, paso Rol-Nivel, BR-PRF-02); el cálculo de certificaciones; bajar de nivel (EVD-2026-0166); eliminar o corregir una asignación (sin fuente).

## 3. Quién hace qué

Party solo conoce ids; el catálogo es de otro servicio y no existe servicio de certificación. Por eso la composición vive en el BFF (único consumidor de ambos, ADR-011), y party **vuelve a validar** lo que puede validar solo:

| Paso | Quién | Qué valida |
|---|---|---|
| 1. Existe y está `ACTIVE` el rol y el nivel, y el nivel es del rol | BFF, con `GET /catalog/roles/{id}` | BR-CAT-09, BR-CAT-30 |
| 2. La persona cumple los requisitos de **subir de nivel** (lectura A); no aplica a asignar un rol nuevo | BFF, con catálogo + certificación | BR-PRF-03, EVD-2026-0164, 0169, 0172 |
| 3. Persona vigente, no anonimizada, un solo nivel vigente por rol, no bajar, fechas | Party | BR-PTY-11, 12, 14; EVD-2026-0146, 0166 |
| 4. Permiso | BFF y party | EVD-0152 |

**Consecuencia (EVD-2026-0177, 0178):** la comprobación del paso 2 **no puede ejecutarse hoy** porque no hay servicio de certificación; por eso **subir de nivel se bloquea** con `503 CERTIFICATION_UNAVAILABLE` hasta que existan US-003 y US-004. Asignar un rol nuevo (`assigned`) no comprueba certificaciones y sigue funcionando.

## 4. Contratos

Rutas del portal (BFF) y del servicio coinciden: `/api/v1/parties/{partyId}/role-assignments`.

### GET /parties/{partyId}/role-assignments

Query: `status` = `current` | `history` | `all` (por defecto `all`). Lectura: cualquier sesión (BR-PTY-20, BR-TRA-03). Respuesta `200`:

```json
{ "data": [ {
    "id": "uuid", "party_id": "uuid",
    "catalog_role_id": "uuid", "role_name": "Developer",
    "catalog_role_level_id": "uuid", "level_name": "Junior (Nivel 2)", "level_ordinal": 2,
    "from_date": "2026-03-01", "thru_date": null, "current": true } ] }
```

Orden: vigentes primero, luego historial por `from_date` descendente. `role_name`, `level_name` y `level_ordinal` son la **instantánea del momento de la asignación** (DM-A1); no cambian si el catálogo renombra.

### POST /parties/{partyId}/role-assignments

Portal → BFF:

```json
{ "catalog_role_id": "uuid", "catalog_role_level_id": "uuid", "from_date": "2026-10-03" }
```

**Fecha:** puede ser pasada u hoy, nunca futura (EVD-2026-0180); por defecto, hoy. Al cambiar de nivel, la anterior termina el mismo día que empieza la nueva (EVD-2026-0179). Dos cambios el mismo día son posibles.

BFF → party (el BFF añade la instantánea del catálogo):

```json
{ "catalog_role_id": "uuid", "role_name": "Developer",
  "catalog_role_level_id": "uuid", "level_name": "Junior (Nivel 3)", "level_ordinal": 3,
  "from_date": "2026-10-03" }
```

Una sola operación cubre **asignar un rol nuevo** y **cambiar el nivel**; party decide cuál según haya o no asignación vigente de ese rol:

| Situación de la persona en ese rol | Resultado | `operation` |
|---|---|---|
| Sin asignación vigente | Abre la nueva | `assigned` |
| Vigente con `level_ordinal` menor | Cierra la vigente con `thru_date = from_date` y abre la nueva, en una transacción | `changed` |
| Vigente con el mismo nivel | `409 LEVEL_UNCHANGED` | — |
| Vigente con `level_ordinal` mayor | `422 LEVEL_DOWNGRADE_NOT_ALLOWED` | — |

Respuesta `201` con `Location`:

```json
{ "operation": "changed",
  "assignment": { "id": "uuid", "…": "como en GET", "current": true },
  "previous": { "id": "uuid", "level_name": "Junior (Nivel 2)", "from_date": "2026-03-01", "thru_date": "2026-10-03" } }
```

`previous` es `null` si la operación fue `assigned`.

### GET /parties/{partyId}/role-assignments/eligibility?catalog_role_level_id=…

Solo en el BFF (no existe en party). Responde si se puede asignar ese nivel y, si no, qué falta:

```json
{ "eligible": false,
  "pending": [ { "scope": "lower", "level_name": "Junior (Nivel 1)", "competency_id": "uuid",
                 "competency_name": "Pruebas unitarias", "required_level": "L2" },
               { "scope": "target", "level_name": "Junior (Nivel 3)", "competency_id": "uuid",
                 "competency_name": "Revisión de código", "required_level": "L3" } ] }
```

`pending` sale de comparar las competencias del nivel destino y de **todos los niveles inferiores del mismo rol** (catálogo) contra lo certificado de la persona **en el L exigido por cada Rol-Nivel** (EVD-2026-0164, lectura A). El mismo cuerpo, en `details.pending`, acompaña al error `PROMOTION_REQUIREMENTS_NOT_MET` del `POST`. ADMIN no puede saltarse este resultado (EVD-2026-0170). SCR-019-02 consulta este recurso al elegir el nivel.

### Errores

Formato estándar (`{error:{code,message,status,timestamp,request_id,details}}`, API-SPEC-001 §4.2).

| Situación | Código | HTTP | Regla |
|---|---|---|---|
| Cuerpo inválido, campos extra, fecha mal formada | `VALIDATION_ERROR` | 400 | `extra=forbid` |
| Sin permiso | `FORBIDDEN` | 403 | EVD-0152 |
| La persona no existe | `NOT_FOUND` | 404 | — |
| Persona anonimizada | `PARTY_ANONYMIZED` | 409 | BR-PTY-14 |
| Persona sin rol vigente de Empleado o Contratista | `PERSON_NOT_CURRENT` | 422 | EVD-0146 |
| Rol o nivel que no existe, o nivel que no es del rol | `CATALOG_LEVEL_NOT_FOUND` | 400 | BR-CAT-09 |
| Nivel o rol de **destino** `INACTIVE` (el nivel vigente de origen puede estar inactivo, EVD-2026-0184) | `CATALOG_LEVEL_INACTIVE` | 422 | BR-CAT-30 |
| Mismo nivel que el vigente | `LEVEL_UNCHANGED` | 409 | BR-PTY-11 |
| Nivel menor que el vigente | `LEVEL_DOWNGRADE_NOT_ALLOWED` | 422 | EVD-0166 |
| `from_date` anterior al `from_date` de la vigente, o posterior a hoy | `INVALID_DATE_RANGE` | 422 | `ck_rla_dates`, EVD-0180 |
| Faltan competencias certificadas | `PROMOTION_REQUIREMENTS_NOT_MET` | 422 | BR-PRF-03, EVD-0172 |
| Dos altas simultáneas de la misma persona y rol | `ASSIGNMENT_CONFLICT` | 409 | `ux_rla_current_role` |
| El catálogo no responde (tras los reintentos) | `CATALOG_UNAVAILABLE` | 503 | ADR-012 |
| La certificación no está disponible | `CERTIFICATION_UNAVAILABLE` | 503 | AQ-1 |

## 5. Datos (una migración, `0005`)

- La tabla `tb_role_level_assignment` ya tiene `person_party_id`, `catalog_role_id`, `catalog_role_level_id`, `from_date`, `thru_date`, auditoría, `ck_rla_dates` y `ux_rla_current_role` (un nivel vigente por persona y rol, BR-PTY-11): no hace falta tocarlos.
- **Decidido (EVD-2026-0181):** **añadir** `role_name VARCHAR(120)`, `level_name VARCHAR(80)` y `level_ordinal SMALLINT` (DM-A1): la instantánea evita consultar al catálogo para listar el historial y permite comparar niveles sin llamarlo. `NOT NULL` para filas nuevas; las filas previas, si las hubiera, se rellenan en la migración (hoy la tabla no tiene filas porque no hay ruta que las cree).
- Se descartó que el BFF complete los nombres desde el catálogo: el historial se reescribiría ante un renombrado y listar dependería del catálogo (ADR-012).

## 6. Seguridad y privacidad

- Token de servicio del BFF + `X-User-Name` y `X-User-Roles` (ADR-005), como el resto de party.
- **Escritura:** `jefe_ingenieria` o `admin`. Hoy `authorization.py` tiene `WRITE_ROLES = (jefe_ingenieria,)`: hay que añadir `admin` para esta ruta; y el BFF `requireAnyRole(JefeIngenieria, Admin)`.
- **Lectura:** cualquier sesión autenticada; el rol y el resumen de niveles de una persona los ve cualquier colaborador (BR-PTY-20, BR-TRA-03).
- Auditoría: `created_by` del `X-User-Name`; el historial no se sobrescribe (BR-PTY-12).
- Entrada con esquema estricto; ids como UUID; consultas parametrizadas.
- Rate limit: el de las demás escrituras de `/parties` (límites en el compose); el cubo exacto, por confirmar.

## 7. Compatibilidad y reintentos

- Es **aditivo** en `/api/v1`; el §3.3 de API-SPEC-001 nunca se implementó, así que nadie consume el contrato viejo.
- Reintentos (ADR-012): el BFF reintenta los `GET` y las lecturas al catálogo. **No reintenta el `POST`** (EVD-2026-0182): ADR-012 cubre las llamadas al catalog-service, no a party, y las escrituras exigirían idempotencia. Si falla, el usuario reintenta; repetir el mismo nivel devuelve `409 LEVEL_UNCHANGED` y no duplica. Se reconsidera si ADR-012 se extiende a party.

## 8. Verificación propuesta

- Una prueba por fila de la tabla de errores, contra **PostgreSQL real** (no solo SQLite): la unicidad parcial `ux_rla_current_role` y el cierre de la vigente deben comprobarse con carrera real.
- Cambio de nivel: la vigente queda cerrada y la nueva abierta en la misma transacción; si falla el INSERT, la vigente no se cierra.
- Dos `POST` simultáneos: uno gana y el otro recibe `ASSIGNMENT_CONFLICT`.
- Persona anonimizada y persona sin rol vigente.
- `eligibility` y `PROMOTION_REQUIREMENTS_NOT_MET` con competencias pendientes de niveles inferiores y del destino; ADMIN recibe el mismo bloqueo.
- Contrato BFF ↔ party ↔ catálogo, con el catálogo caído y el cortacircuito abierto.
- Autorización: `jefe_ingenieria` y `admin` escriben; `colaborador` solo lee.

## 9. Riesgos y preguntas abiertas

| ID | Pregunta | Efecto |
|---|---|---|
| ~~AQ-1~~ | ~~**No hay servicio de certificación.** Mientras no exista, el cambio de nivel, ¿se bloquea (más seguro: nadie sube de nivel sin comprobar) o se permite sin comprobación (hay que registrarlo)? Se propone bloquearlo con `CERTIFICATION_UNAVAILABLE`.~~ Respondida (ianache, 2026-10-04): se bloquea con `CERTIFICATION_UNAVAILABLE` (EVD-2026-0177). | Hace inutilizable el cambio de nivel hasta que exista la certificación |
| ~~AQ-2~~ | ~~¿La lectura A (todo certificado) aplica también a **asignar un rol nuevo** (AC-1, AC-2) o solo a **subir de nivel**? Las fuentes hablan de «escalar a un nivel superior» (BR-PRF-03). Se asume que solo a subir.~~ Respondida (ianache, 2026-10-04): solo al subir de nivel; asignar un rol nuevo no comprueba certificaciones (EVD-2026-0178). | Si aplica al rol nuevo, nadie puede recibir un rol nuevo sin certificaciones previas |
| ~~AQ-3~~ | ~~Fechas: ¿la anterior termina el mismo día que empieza la nueva (`thru_date = from_date`) o el día previo? ¿Se admiten `from_date` pasadas o futuras? (SCR-019-Q1)~~ Respondida (ianache, 2026-10-04): igual día (`thru_date = from_date`) y fecha pasada u hoy, sin futuras (EVD-2026-0179, 0180). | Cierre de vigencias |
| ~~AQ-4~~ | ~~Instantánea de nombres y orden en party (propuesta) frente a completarlos desde el catálogo.~~ Respondida (ianache, 2026-10-04): instantánea de nombres y orden en party (EVD-2026-0181). | Migración 0005 |
| ~~AQ-5~~ | ~~Idempotencia: ¿se añade `Idempotency-Key` al `POST`?~~ Respondida (ianache, 2026-10-04): el BFF no reintenta el `POST` (EVD-2026-0182). | Reintentos de escrituras (ADR-012) |
| ~~AQ-6~~ | ~~¿Quién desactiva o reactiva un nivel? (BR-CAT-30, se asume como las competencias)~~ Respondida (ianache, 2026-10-04): el Jefe de Ingeniería o ADMIN (EVD-2026-0183). | Fuera de esta API, en API-SPEC-003 |
| ~~AQ-7~~ | ~~Si un nivel se desactiva después de asignarlo, la persona lo conserva (BR-CAT-30); ¿puede cambiar **desde** él a otro nivel activo? Se asume que sí.~~ Respondida (ianache, 2026-10-04): sí, se puede cambiar desde un nivel inactivo a otro nivel activo (EVD-2026-0184). | `CATALOG_LEVEL_INACTIVE` solo para el destino |

## 10. Siguiente acción

1. Revisar el documento: AQ-1 a AQ-7 están resueltas (EVD-2026-0177 a 0184).
2. `api-contract-reviewer` y `api-security-reviewer`.
3. Diseñar el servicio de certificación (o su sustituto) que alimenta `eligibility`; sin él, US-019 AC-5 no se puede cumplir.
