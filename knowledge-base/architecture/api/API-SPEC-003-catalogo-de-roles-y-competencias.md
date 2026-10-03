---
type: Technical Design
id: API-SPEC-003
title: API REST — Catálogo de roles, niveles de rol y competencias con versiones
description: Contrato del catalog-service (ADR-011) para US-001 y US-019: roles con Rol-Nivel, competencias versionadas, rúbrica y requisitos de evidencia, alineado con API-SPEC-001 y LDM-002.
tags: [architecture, api, rest, catalogo, competencias, roles, us-001, us-019]
status: draft
readiness: REQUIRES_REVIEW
generated: { by: "api-designer/1.0", at: "2026-10-03T23:00:00-05:00" }
related: [API-SPEC-001, API-SPEC-002, ADR-011, LDM-002, DSP-001, US-001, US-019, BR-CAT-04, BR-CAT-20, BR-CAT-21, BR-CAT-22, BR-ACR-13]
sources:
  - id: ldm-002
    resource: /knowledge-base/architecture/data-model/LDM-002-modelo-de-datos-del-catalogo.md
  - id: adr-011
    resource: /knowledge-base/architecture/adrs/ADR-011-catalog-service-como-microservicio-propio.md
  - id: dsp-001
    resource: /knowledge-base/requirement/scope-packs/DSP-001-catalogo-de-roles-y-niveles.md
  - id: api-spec-002
    resource: /knowledge-base/architecture/api/API-SPEC-002-organizations.md
---

# API-SPEC-003 — Catálogo de roles y competencias

**Estado: `REQUIRES_REVIEW`.** Diseño del agente sin aprobación humana, y ADR-011 está `Propuesto`. Nada de esto está implementado.

## 1. Rutas

El BFF ya expone `/api/v1/catalog/roles[/:id]` (`catalog.router.ts`, hoy 503) y reenvía a `/api/v1/roles` del servicio. Se **mantiene** ese prefijo del portal y se añade `competencies`. Rutas del portal → servicio:

| Portal (BFF) | Servicio | Uso |
|---|---|---|
| `GET /api/v1/catalog/roles` · `/roles/{id}` | `/api/v1/roles` | Asistente de alta (lista con niveles) y consulta |
| `POST /catalog/roles` · `PUT /catalog/roles/{id}` · `POST /catalog/roles/{id}/deactivate` | ídem | Gestionar roles (US-001) |
| `GET /catalog/competencies` · `/competencies/{id}` | `/api/v1/competencies` | Consulta |
| `POST /catalog/competencies/{id}/deactivate` | ídem | Desactivar una competencia (BR-CAT-25) |
| `POST /catalog/competencies` | ídem | Alta con versión 1 en DRAFT |
| `POST /catalog/competencies/{id}/versions` | ídem | Nueva versión DRAFT copiada de la vigente |
| `PUT /catalog/competencies/{id}/versions/{versionId}` | ídem | Editar rúbrica y requisitos de un DRAFT |
| `POST /catalog/competencies/{id}/versions/{versionId}/approve` | ídem | Aprobar |

Lectura y escritura siguen el formato de errores y cabeceras de API-SPEC-001 §4.2 (`{error:{code,message,status,timestamp,request_id}}`, `X-Request-ID`, paginación `page`/`limit`/`sort`).

## 2. Contratos

### GET /roles (lista, compatible con el asistente de alta)

Query: `search`, `status` (`active`|`inactive`), `page`, `limit` (máx. 100), `sort`. Respuesta `200`:

```json
{ "data": [ { "id": "uuid", "name": "Developer", "status": "active",
    "levels": [ { "id": "uuid", "name": "Junior (Nivel 1)", "ordinal": 1, "evidence_requirements": 2 } ] } ],
  "pagination": { "page": 1, "limit": 100, "total": 1, "total_pages": 1 } }
```

`levels[].evidence_requirements` es el número de requisitos **requeridos** de las competencias del nivel, en su nivel L esperado. Es **supuesto del agente**: el portal ya lee ese campo (`register-collaborator.api.ts`) pero ninguna fuente define su significado.

### GET /roles/{id}

Añade, por nivel, `competencies: [{competency_id, name, required_level, version: {id, version_number, status}, is_current, suggested_version_id}]`. `is_current` es falso cuando existe una versión APPROVED posterior; entonces `suggested_version_id` apunta a la vigente y el portal muestra la advertencia de EVD-2026-0143. La versión vigente es la APPROVED de mayor número (LDM-002 CM-03).

### POST /roles y PUT /roles/{id}

```json
{ "name": "Developer", "description": null,
  "levels": [ { "name": "Junior (Nivel 1)", "ordinal": 1,
      "competencies": [ { "competency_id": "uuid", "version_id": "uuid", "required_level": "L1" } ] } ] }
```

Una sola transacción (rol, niveles, competencias). `PUT` exige `If-Match: <row_version>` (concurrencia optimista) y reemplaza los niveles; **no** quita un nivel con asignaciones a personas (conflicto 409). Reglas, con su regla de negocio:

| Validación | Código | HTTP | Regla |
|---|---|---|---|
| Al menos un nivel y cada nivel al menos una competencia | `VALIDATION_ERROR` | 400 | BR-CAT-20 (CHK-A) |
| `required_level` fuera de L1–L4 | `VALIDATION_ERROR` | 400 | BR-CAT-02 |
| La misma competencia dos veces en un nivel | `COMPETENCY_DUPLICATED` | 409 | BR-CAT-21 |
| La versión no pertenece a la competencia o no está APPROVED | `VALIDATION_ERROR` | 400 | R-46 |
| El nivel L exigido no tiene requisitos de evidencia o ninguno es «requerido» | `EVIDENCE_REQUIREMENTS_MISSING` | 422 | BR-ACR-13, EVD-2026-0149 (CHK-B) |
| Nombre de rol repetido | `ROLE_NAME_DUPLICATE` | 409 | LDM-002 CM-10 (supuesto) |
| `If-Match` desactualizado | `PRECONDITION_FAILED` | 412 | LDM-002 CM-09 |

`POST /roles/{id}/deactivate` desactiva (no se elimina; decisión DM-Q-03, BR-CAT-25): los ids siguen válidos para party.

### Competencias y versiones

- `POST /competencies` `{name, description?}` crea la competencia y su versión 1 en DRAFT. Nombre repetido → `COMPETENCY_NAME_DUPLICATE` 409.
- `POST /competencies/{id}/versions` crea un DRAFT copiando la versión vigente (con su rúbrica y requisitos; decisión DM-Q-01/05, BR-CAT-23). Si ya hay un DRAFT → `DRAFT_EXISTS` 409.
- `PUT …/versions/{versionId}` (solo en DRAFT; si no, `VERSION_NOT_EDITABLE` 409):
  ```json
  { "rubric": [ { "level": "L1", "behavior_description": "..." } ],
    "evidence_requirements": [ { "level": "L1", "category": "FORMACION",
        "description": "Aprobar el curso X", "is_required": true, "course_ref": "uuid|null" } ] }
  ```
  La definición es progresiva (BR-CAT-17): no exige los cuatro niveles. Cada requisito declara `is_required` (BR-ACR-12) y `course_ref` solo con `FORMACION` (LDM-002 CM-08).
- `POST /competencies/{id}/deactivate` pasa la competencia de `ACTIVE` a `INACTIVE` (decisión DM-Q-03, BR-CAT-25). No se elimina: sus versiones, rúbricas y requisitos se conservan y los ids siguen válidos para certificaciones y Rol-Nivel existentes. Requiere `If-Match: <row_version>`; ya `INACTIVE` → `COMPETENCY_ALREADY_INACTIVE` 409. `GET /competencies` y `/competencies/{id}` devuelven `status` (`ACTIVE`|`INACTIVE`) y `GET /competencies` admite `status` como filtro. **No hay `reactivate`**: la decisión solo habla de desactivar (DM-Q-07 abierta). Un Rol-Nivel nuevo que incluya una competencia `INACTIVE` y el efecto en los existentes están por decidir (DM-Q-07); hasta entonces el servicio no los rechaza.
- `POST …/approve`: pasa DRAFT a APPROVED y la APPROVED anterior a DEPRECATED, en una transacción (decisión DM-Q-02, BR-CAT-24; solo se aprueba desde DRAFT). Registra `approved_by` y `approved_at`. Las relaciones vigentes no cambian (EVD-2026-0143). Respuesta `200` con la versión y `previous_version_id`.

## 3. Seguridad y privacidad

Token de servicio del BFF + `X-User-Name` y `X-User-Roles`, como party (ADR-005, API-SPEC-002 §4). El servicio vuelve a validar los roles.

| Acción | Quién | Regla |
|---|---|---|
| Leer | Cualquier sesión autenticada | AC-12, EVD-2026-0118 |
| Alta y edición de roles | `jefe_ingenieria`; también el Responsable de producto (sin límite por producto) | BR-CAT-04/05, EVD-2026-0147/0150 |
| Alta de competencia, rúbrica y requisitos de evidencia | `jefe_ingenieria` | BR-CAT-16, BR-CAT-19 |
| Aprobar una versión | `jefe_ingenieria` o `admin` | EVD-2026-0144 |
| Desactivar una competencia | `jefe_ingenieria` (**supuesto**: igual que su alta y edición, BR-CAT-16/19; la decisión DM-Q-03 no nombra al actor) | BR-CAT-25 |

**Bloqueo:** el realm de Keycloak y `roles.ts` del BFF **no tienen el rol «Responsable de producto»** (solo `colaborador`, `jefe_proyecto`, `evaluador`, `jefe_ingenieria`, `direccion`, `gerencia`, `admin`). Hasta definirlo, solo `jefe_ingenieria` edita roles y la ampliación de EVD-2026-0147 no puede aplicarse. No se asume que equivalga a `jefe_proyecto`.

No hay datos personales. Entrada con esquema estricto (`extra=forbid`), límites de longitud de LDM-002, y consultas parametrizadas. Rate limit como `/parties` (lectura 1000/h, escritura 100/h en desarrollo).

## 4. Compatibilidad y versionado

- La forma de `GET /catalog/roles` (`data[].id`, `name`, `levels[].{id,name,evidence_requirements}`) es la que el portal ya consume: **compatible**.
- Todo lo demás es **aditivo**. Ids y rutas bajo `/api/v1`; un cambio incompatible exige `/v2`.
- Cuando el catálogo exista, `CATALOG_SERVICE_URL` deja de estar vacío y se retira el `catalog-stub`.

## 5. Verificación propuesta

- `deactivate` de una competencia: éxito, doble desactivación (409), `If-Match` desactualizado (412) y que sus versiones y ids siguen consultables.
- Contrato BFF ↔ servicio, y por cada fila de la tabla de §2 un caso (400, 409, 412, 422) con su código.
- Integración con **PostgreSQL real** (no solo SQLite): el DDL de LDM-002 ya cubre los casos de base; el servicio debe cubrir CHK-A a CHK-D.
- Concurrencia: dos `approve` y dos `PUT` simultáneos; una sola gana.
- Autorización: lectura abierta, escritura de roles, rúbrica y aprobación por rol, incluido `admin` en `approve` y sin permiso en rúbrica.
- Advertencia de versión: tras aprobar la versión 2, `GET /roles/{id}` marca `is_current:false` con `suggested_version_id`.

## 6. Riesgos y preguntas abiertas

| ID | Pregunta | Efecto |
|---|---|---|
| AQ-1 | ¿Qué rol de Keycloak es el Responsable de producto y puede editar competencias o solo roles? | Bloquea el permiso de EVD-2026-0147 |
| AQ-2 | Significado de `levels[].evidence_requirements` (§2) | Texto del asistente de alta |
| AQ-3 | **Resuelta (2026-10-03):** la anterior pasa a DEPRECATED y solo se aprueba desde DRAFT (DM-Q-02) | Contrato de `approve` (confirmado) |
| AQ-4 | **Resuelta (2026-10-03):** solo se desactiva; las competencias tienen ACTIVE/INACTIVE (DM-Q-03). `deactivate` de competencias añadido arriba | `deactivate` |
| AQ-7 | ¿Se puede reactivar una competencia y qué pasa con los Rol-Nivel que la usan? (DM-Q-07). ¿Quién desactiva una competencia? (se supone `jefe_ingenieria`) | `deactivate`, CHK-A/CHK-B |
| AQ-5 | ¿Quitar un nivel con personas asignadas? Se rechaza (409) hasta confirmarlo con US-019 | `PUT /roles` |
| AQ-6 | **Resuelta (2026-10-03):** el rol ADMIN es correcto (DM-Q-04, BR-CAT-26) | Asignación de niveles (US-019), fuera de este contrato |

La **asignación de Rol-Nivel a personas** (US-019) no está aquí: vive en party (LDM-001 DM-07) y referencia los ids de este catálogo. Su API se diseña al revisar API-SPEC-001.

## 7. Siguiente acción

1. Responder AQ-1 a AQ-5 y revisar LDM-002 y ADR-011.
2. `api-contract-reviewer` y `api-security-reviewer` sobre este documento.
3. Cadena de diseño de pantallas de US-001 y US-019 (los SCR/GEN que exige el DCP).
