---
type: Technical Design
id: API-SPEC-005
title: API REST — Certificaciones de nivel, evidencias, motivos de revocación y nivel certificado vigente
description: Contrato del certification-service (ADR-013) para US-003 y US-004 y para la consulta que necesita US-019 (API-SPEC-004); apoyado en LDM-003 y en las decisiones EVD-2026-0185 a 0222.
tags: [architecture, api, rest, certificacion, evidencia, us-003, us-004, us-019]
status: draft
readiness: REQUIRES_REVIEW
generated: { by: "api-designer/1.0", at: "2026-10-04T10:00:00-05:00" }
related: [API-SPEC-001, API-SPEC-003, API-SPEC-004, ADR-012, ADR-013, LDM-003, DSP-002, US-003, US-004, US-019, BR-ACR-02, BR-ACR-15, BR-TRA-07, BR-TRA-08]
sources:
  - id: ldm-003
    resource: /knowledge-base/architecture/data-model/LDM-003-modelo-de-datos-de-certificaciones.md
  - id: adr-013
    resource: /knowledge-base/architecture/adrs/ADR-013-certification-service-como-microservicio-propio.md
  - id: dsp-002
    resource: /knowledge-base/requirement/scope-packs/DSP-002-certificacion-y-perfil.md
  - id: api-spec-004
    resource: /knowledge-base/architecture/api/API-SPEC-004-asignacion-de-rol-nivel.md
  - id: us-003
    resource: /knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md
---

# API-SPEC-005 — Certificaciones y evidencias

**Estado: `REQUIRES_REVIEW`.** Diseño del agente sin aprobación humana. Nada está implementado: el servicio no existe (ADR-013 lo decide, LDM-003 modela sus datos).

## 1. Rutas y reparto de trabajo

Rutas del portal (BFF) y del servicio coinciden bajo `/api/v1`. El BFF es el único consumidor (ADR-013) y **compone**: valida contra el catálogo (versión aprobada, nivel con requisitos, requisitos del nivel), contra party (persona vigente, no anonimizada) y traduce al usuario a su código de party; el servicio **revalida** lo que puede validar solo, igual que en API-SPEC-004.

| Ruta | Quién la usa | Uso |
|---|---|---|
| `POST /certifications` | Evaluador | Certificar un nivel de una competencia |
| `POST /certifications/{id}/recertify` | Evaluador | Recertificar: nueva certificación del mismo nivel que reemplaza la anterior |
| `POST /certifications/{id}/revoke` | Jefe de Ingeniería, ADMIN | Revocar con motivo tipificado y descripción |
| `GET /certifications` · `GET /certifications/{id}` | Cualquier colaborador | Consultar certificaciones y su auditoría |
| `GET /certified-levels` | BFF (eligibility de API-SPEC-004), US-004 | Nivel certificado vigente por persona y competencia |
| `POST /evidences` · `GET /evidences` · `GET /evidences/{id}` | El colaborador registra; cualquiera consulta | Evidencias |
| `GET /revocation-reasons` · `POST /revocation-reasons` · `POST /revocation-reasons/{code}/deactivate` · `/reactivate` | Lectura abierta; escritura Jefe de Ingeniería o ADMIN | Catálogo ampliable de motivos |

Formato de errores, cabeceras y paginación (`page`, `limit`, `sort`) como API-SPEC-001 §4.

## 2. Identidad del actor

La auditoría identifica a quien certifica, califica o revoca con su **código de party** (EVD-2026-0222). El BFF traduce el usuario de la sesión a ese código con el vínculo de US-022 y lo envía en la cabecera `X-Actor-Party-Code` (**nombre propuesto por el agente**) junto con el token de servicio y `X-User-Roles`. El servicio no acepta el actor en el cuerpo. Un usuario **sin** código de party (por ejemplo, un ADMIN que no es colaborador) se muestra en la auditoría **solo con el nombre de su rol** (EVD-2026-0226): el BFF envía entonces `X-Actor-Role` (el rol que autoriza la acción, por ejemplo `ADMIN`, EVD-2026-0230) en lugar de `X-Actor-Party-Code`. El servicio guarda ese valor en las columnas de actor.

## 3. Contratos

### POST /certifications

Portal → BFF:

```json
{ "person_id": "uuid", "competency_id": "uuid", "level": "L2", "outcome": "APPROVED",
  "evidence": [ { "evidence_id": "uuid", "requirement_id": "uuid", "grade": "CUMPLE" },
                { "evidence_id": "uuid", "requirement_id": "uuid", "grade": "NO_CUMPLE" } ] }
```

BFF → servicio (el BFF añade lo que sale del catálogo):

```json
{ "person_id": "uuid", "competency_id": "uuid", "competency_version_id": "uuid", "level": "L2", "outcome": "APPROVED",
  "required_requirement_ids": ["uuid", "uuid"],
  "evidence": [ { "evidence_id": "uuid", "requirement_id": "uuid", "requirement_is_required": true, "grade": "CUMPLE" } ] }
```

Respuesta `201` con `Location`: la certificación (§ detalle) con `status: "ACTIVE"`, sus evidencias con calificación y el evento de auditoría. `competency_version_id` es la versión vigente al certificar (IMD-001 R-46).

**Evaluación no aprobada (EVD-2026-0224).** `outcome` es `APPROVED` (por defecto) o `NOT_APPROVED`. Con `NOT_APPROVED` el servicio guarda la evaluación con sus calificaciones y su auditoría, con estado `NOT_APPROVED`: **no es una certificación**, no cuenta para el nivel vigente y es un estado final (no se revoca ni se recertifica). Responde `201` con ese estado. No se exige `REQUIREMENTS_NOT_MET` (puede no aprobarse porque faltan requisitos, o por decisión del evaluador); el resto de las validaciones se aplican. Quién la ve: AQ-8.

Validaciones, con su regla y dónde se aplican:

| Validación | Código | HTTP | Regla | Dónde |
|---|---|---|---|---|
| Cuerpo inválido, campos extra, nivel fuera de L1–L4, calificación distinta de `CUMPLE`/`NO_CUMPLE` | `VALIDATION_ERROR` | 400 | `extra=forbid` | Servicio |
| Sin el rol `evaluador` | `FORBIDDEN` | 403 | BR-ACR-02, EVD-2026-0199 | BFF y servicio |
| La persona no es un colaborador vigente | `PERSON_NOT_CURRENT` | 422 | BR-ACR-22 | BFF (party) |
| La versión de la competencia no está aprobada | `COMPETENCY_VERSION_NOT_APPROVED` | 422 | LDM-002 | BFF (catálogo) |
| El nivel no tiene requisitos, o ninguno requerido | `LEVEL_WITHOUT_REQUIREMENTS` | 422 | BR-ACR-13, EVD-2026-0149 | BFF (catálogo) |
| Algún requisito requerido sin al menos una pieza `CUMPLE` | `REQUIREMENTS_NOT_MET` (`details.pending`) | 422 | BR-ACR-09, 12, 18, EVD-2026-0208 | Servicio, con `required_requirement_ids` |
| Una evidencia no es de la persona certificada | `EVIDENCE_NOT_OWNED` | 422 | EVD-2026-0215 (CHK-F) | Servicio |
| Nivel inferior al vigente más alto | `LEVEL_LOWER_THAN_CERTIFIED` | 422 | EVD-2026-0187 | Servicio y base (disparador) |
| Ya hay una certificación vigente de ese nivel | `CERTIFICATION_EXISTS` (usa `recertify`) | 409 | `ux_cert_active_level` | Servicio y base |
| Dos certificaciones simultáneas de la misma persona y competencia | `CERTIFICATION_CONFLICT` | 409 | CHK-E de LDM-003 | Servicio (bloqueo) |
| El catálogo o party no responden tras los reintentos | `CATALOG_UNAVAILABLE` / `PARTY_UNAVAILABLE` | 503 | ADR-012 | BFF |

### POST /certifications/{id}/recertify

Mismo cuerpo que certificar, sin `level`: el nivel es el de la certificación reemplazada. En **una transacción**, la anterior pasa a `REPLACED` apuntando a la nueva y se inserta la nueva (EVD-2026-0192; LDM-003 CE-04). Exige evidencias **nuevas**: las que no respaldaron la certificación que se reemplaza (EVD-2026-0216, 0220; se aplica «al menos una»). Respuesta `201`:

```json
{ "operation": "recertified", "certification": { "id": "uuid", "status": "ACTIVE", "…": "…" },
  "replaced": { "id": "uuid", "status": "REPLACED", "replaced_at": "2026-10-04T10:00:00Z" } }
```

Errores adicionales: `CERTIFICATION_NOT_ACTIVE` (409: solo se recertifica una vigente) y `RECERTIFICATION_NEEDS_NEW_EVIDENCE` (422). Se cumplen también las validaciones de certificar sobre las evidencias de la nueva certificación.

### POST /certifications/{id}/revoke

```json
{ "reason_code": "EVIDENCIA_INVALIDA", "description": "La evidencia presentada no corresponde al proyecto indicado." }
```

Requiere `If-Match: <row_version>`. Quién revoca es el actor de la cabecera: debe ser Jefe de Ingeniería o ADMIN (EVD-2026-0191). Pasa de `ACTIVE` a `REVOKED`; no se borra (BR-ACR-15). Respuesta `200` con la certificación. El nivel vigente de la persona vuelve a calcularse (el más alto de las vigentes).

| Validación | Código | HTTP | Regla |
|---|---|---|---|
| Sin permiso | `FORBIDDEN` | 403 | EVD-2026-0191 |
| La certificación no está vigente | `CERTIFICATION_NOT_ACTIVE` | 409 | LDM-003 CE-03 |
| Motivo inexistente o inactivo | `REVOCATION_REASON_INVALID` | 422 | EVD-2026-0195, 0197 |
| Descripción de menos de 10 o más de 1000 caracteres | `VALIDATION_ERROR` | 400 | EVD-2026-0194, 0196, 0201 |
| `If-Match` desactualizado | `PRECONDITION_FAILED` | 412 | LDM-003 |

### GET /certified-levels

Query: `person_id` y `competency_id` (repetible). Con `person_id` y sin `competency_id` devuelve todas las competencias de la persona (el resumen de US-004, BR-TRA-03). **Por competencia (EVD-2026-0228, para la búsqueda de candidatos de US-006):** con `competency_id` y **sin** `person_id` devuelve las personas con nivel vigente en esa competencia, con el filtro opcional `min_level` y paginación; excluye a las personas anonimizadas salvo para ADMIN. El diseño de US-006 está pendiente. Respuesta `200`:

```json
{ "data": [ { "competency_id": "uuid", "level": "L3", "certification_id": "uuid",
              "competency_version_id": "uuid", "certified_at": "2026-09-01T15:00:00Z", "certified_by": "uuid-party" } ] }
```

El nivel es el **más alto de las certificaciones vigentes** (EVD-2026-0186; vista `vw_current_certified_level`). Una competencia sin certificación vigente **no aparece**. Es lo que consume `eligibility` de API-SPEC-004 para sustituir `CERTIFICATION_UNAVAILABLE`: el BFF compara, por cada competencia que exige el Rol-Nivel, el nivel certificado con el `required_level` (mayor o igual: un L3 vigente cumple lo que exige un L2, EVD-2026-0223).

### GET /certifications y GET /certifications/{id}

Query de la lista: `person_id`, `competency_id`, `status` (`ACTIVE`|`REPLACED`|`REVOKED`|`NOT_APPROVED`|`all`), `page`, `limit`. El detalle devuelve la certificación, sus evidencias con calificación y la auditoría:

```json
{ "id": "uuid", "person_id": "uuid", "competency_id": "uuid", "competency_version_id": "uuid",
  "level": "L2", "status": "REVOKED", "certified_by": "uuid-party", "certified_at": "…",
  "evidence": [ { "evidence_id": "uuid", "requirement_id": "uuid", "requirement_is_required": true,
                  "grade": "CUMPLE", "graded_by": "uuid-party", "graded_at": "…" } ],
  "revocation": { "reason_code": "EVIDENCIA_INVALIDA", "revoked_by": "uuid-party", "revoked_at": "…",
                  "description": "…solo para quien puede verla…" },
  "events": [ { "type": "CERTIFIED", "actor": "uuid-party", "at": "…" }, { "type": "REVOKED", "actor": "uuid-party", "at": "…", "reason_code": "…" } ] }
```

**Visibilidad (BR-TRA-06, BR-TRA-07, BR-TRA-08):**
- Cualquier colaborador ve la certificación, sus evidencias y su auditoría: quién, cuándo y con qué evidencia.
- De una revocación, todos ven el hecho, el motivo tipificado, quién y cuándo. La **`description`** solo la ven la persona certificada, todos los evaluadores (cualquier usuario con el rol `evaluador`), el Jefe de Ingeniería y ADMIN (EVD-2026-0206, 0209); a los demás el campo se omite.
- Una evaluación no aprobada (`status = NOT_APPROVED`) la ven solo el colaborador evaluado, el Jefe de Ingeniería y ADMIN (EVD-2026-0229, BR-TRA-09); no figura en las listas ni en el detalle de los demás (AQ-12).
- Si la persona está **anonimizada**, sus certificaciones solo las ve ADMIN (EVD-2026-0218): los demás reciben `403 PERSON_ANONYMIZED` (EVD-2026-0225).

### Evidencias

`POST /evidences` (solo el propio colaborador, EVD-2026-0215; CHK-H):

```json
{ "category": "DESEMPENO_PROYECTO", "description": "Merge request del sprint 1",
  "reference_url": "https://gitlab.interno/grupo/proy/-/merge_requests/12", "course_ref": null }
```

Reglas: `category` en `FORMACION`, `PRACTICA_EVALUADA`, `DESEMPENO_PROYECTO`; `description` hasta 300 caracteres; `reference_url` `http` o `https`, sin espacios; `course_ref` solo con `FORMACION` (LDM-003 / LDM-002 CM-08). El servicio **no resuelve ni descarga la URL**: es solo una referencia (EVD-2026-0211); GitLab está en red privada y el control de acceso es el del repositorio y la VPN (EVD-2026-0207). Una evidencia puede respaldar varias competencias y niveles y no se anonimiza (EVD-2026-0204, 0218); las de una certificación revocada siguen disponibles (EVD-2026-0219). `GET /evidences?person_id=` y `GET /evidences/{id}`: lectura abierta a cualquier colaborador (BR-TRA-05). No hay `PUT` ni `DELETE`.

### Motivos de revocación

`GET /revocation-reasons?status=ACTIVE` (lectura abierta); `POST` con `{code, name}` (código en mayúsculas `^[A-Z][A-Z0-9_]*$`); `POST /{code}/deactivate` y `/reactivate`. Escriben el Jefe de Ingeniería o ADMIN (EVD-2026-0227); un motivo ya usado no se elimina. Sembrados: `ERROR_DE_REGISTRO`, `EVIDENCIA_INVALIDA`, `REQUISITOS_NO_CUMPLIDOS`, `OTRO` (EVD-2026-0195, 0200).

## 4. Seguridad y privacidad

| Acción | Quién |
|---|---|
| Certificar, recertificar | Rol `evaluador`; cualquier usuario con él, a cualquier colaborador (EVD-2026-0199, 0200) |
| Revocar | `jefe_ingenieria` o `admin` |
| Registrar una evidencia | El colaborador dueño de la evidencia |
| Consultar certificaciones y evidencias | Cualquier sesión autenticada, con las excepciones de §3 |
| Gestionar motivos | `jefe_ingenieria` o `admin` (supuesto) |

- Token de servicio del BFF + `X-User-Name`, `X-User-Roles` y `X-Actor-Party-Code` (ADR-005); el servicio vuelve a validar los roles.
- Datos sensibles: la `description` de una revocación puede contener información delicada sobre una persona; se omite según §3. La `description` de una evidencia puede contener datos personales y no se anonimiza (decisión EVD-2026-0218); queda anotado como riesgo.
- Entrada con esquema estricto, ids UUID, consultas parametrizadas; límites de longitud de LDM-003.
- Rate limit como las demás escrituras (valor por confirmar).

## 5. Disponibilidad y reintentos

El BFF reintenta con espera creciente y abre el cortacircuito en las llamadas **de lectura** al catálogo, y, si ADR-012 se extiende, a party y al certification-service (hoy sin decidir). **Las escrituras de esta API no se reintentan automáticamente** (criterio de EVD-2026-0182 y ADR-012). Una repetición del `POST /certifications` devuelve `409 CERTIFICATION_EXISTS`; una repetición de `revoke`, `409 CERTIFICATION_NOT_ACTIVE`: no duplican, pero el cliente ve un error aunque la primera llamada haya tenido éxito.

## 6. Datos y migración

Una migración inicial del servicio con el DDL de [LDM-003](../data-model/LDM-003-modelo-de-datos-de-certificaciones.md): sus cinco tablas, la vista, las funciones y los disparadores. Las referencias a persona, competencia, versión y requisito son ids lógicos.

## 7. Compatibilidad

Servicio nuevo: todo es aditivo bajo `/api/v1`. Cuando exista, `eligibility` de API-SPEC-004 deja de devolver `CERTIFICATION_UNAVAILABLE` y consume `GET /certified-levels`; hasta entonces, subir de nivel sigue bloqueado (EVD-2026-0177).

## 8. Verificación propuesta

- Una prueba por fila de las tablas de errores (400, 403, 409, 412, 422, 503), con **PostgreSQL real**.
- Recertificar: la anterior queda `REPLACED` y la nueva `ACTIVE` en una transacción; si falla el INSERT, la anterior sigue vigente.
- `GET /certified-levels`: con varias vigentes devuelve la más alta; tras revocar la más alta, devuelve la siguiente; una competencia sin vigentes no aparece.
- Visibilidad: la `description` de una revocación se omite a un colaborador cualquiera y se muestra a la persona certificada, a un evaluador, al Jefe de Ingeniería y a ADMIN; una persona anonimizada solo la ve ADMIN.
- Concurrencia: dos certificaciones simultáneas de la misma persona y competencia; dos revocaciones simultáneas de la misma certificación.
- Autorización por rol y por dueño de la evidencia.
- Contrato BFF ↔ servicio ↔ catálogo ↔ party, con el catálogo caído y el cortacircuito abierto.
- Que la auditoría no se pueda modificar ni borrar (cubierto por LDM-003 §7).

## 9. Riesgos y preguntas abiertas

| ID | Pregunta | Efecto |
|---|---|---|
| ~~AQ-1~~ | ~~¿Una certificación **mayor** que el nivel exigido cuenta? Se propone «mayor o igual»: un L3 vigente cumple lo que exige un L2~~ **Respondida (ianache, 2026-10-04):** mayor o igual (EVD-2026-0223). | `eligibility` de API-SPEC-004 |
| ~~AQ-2~~ | ~~Nombre de la cabecera del actor (`X-Actor-Party-Code`) y DM-Q-07: qué identifica a un usuario sin código de party~~ **Respondida (ianache, 2026-10-04):** un usuario sin código de party se muestra solo con el nombre de su rol (EVD-2026-0226); el nombre de la cabecera sigue siendo una propuesta del agente. | Quién puede certificar o revocar |
| ~~AQ-3~~ | ~~Respuesta ante una persona anonimizada: se propone `403 PERSON_ANONYMIZED`; la alternativa es `404`, que no revela que la certificación existe~~ **Respondida (ianache, 2026-10-04):** 403 `PERSON_ANONYMIZED` (EVD-2026-0225). | Privacidad |
| ~~AQ-4~~ | ~~¿Quién gestiona los motivos? Se supone el Jefe de Ingeniería y ADMIN, como el catálogo~~ **Respondida (ianache, 2026-10-04):** el Jefe de Ingeniería o ADMIN (EVD-2026-0227). | Permisos |
| ~~AQ-5~~ | ~~¿Se registra una **evaluación no aprobada**? Hoy una certificación solo existe si se cumplen los requisitos, así que una evaluación con todo `NO_CUMPLE` no deja rastro ni auditoría. Las calificaciones `NO_CUMPLE` solo se guardan dentro de una certificación que sí se emitió~~ **Respondida (ianache, 2026-10-04):** sí, se registra la evaluación no aprobada (EVD-2026-0224). | UX de evaluación; auditoría |
| ~~AQ-6~~ | ~~Consumidores futuros: la búsqueda de candidatos (US-006) necesitará `GET /certified-levels` por competencia y nivel mínimo, para varias personas. No se diseña aquí~~ **Respondida (ianache, 2026-10-04):** la consulta también por competencia (EVD-2026-0228); US-006 sigue sin diseñarse. | US-006 |
| AQ-7 | ¿Se añade `Idempotency-Key` a los `POST`? (como AQ-5 de API-SPEC-004, se decidió no reintentar) | Reintentos |
| ~~AQ-8~~ | ~~De la evaluación no aprobada: ¿quién la ve y lleva motivo o descripción? Se propone, por defecto restrictivo, la persona evaluada, los evaluadores, el Jefe de Ingeniería y ADMIN (DM-Q-08 de LDM-003)~~ **Respondida (ianache, 2026-10-04):** la ven el colaborador evaluado, el Jefe de Ingeniería y ADMIN (EVD-2026-0229). Sigue abierto si lleva motivo o descripción (AQ-10) y qué pasa con el evaluador que la registró (AQ-11). | Privacidad y API de consulta |
| ~~AQ-9~~ | ~~Si un usuario tiene varios roles y no tiene código de party, ¿qué nombre de rol se muestra? Se propone el rol que autoriza la acción~~ **Respondida (ianache, 2026-10-04):** el rol que autoriza la acción (EVD-2026-0230). | Auditoría |
| AQ-10 | ¿La evaluación no aprobada lleva un motivo o una descripción? Hoy solo guarda las calificaciones por evidencia | Auditoría |
| AQ-11 | El evaluador que registró una evaluación no aprobada **no figura** entre quienes la ven (EVD-2026-0229): ¿ni siquiera la propia? Sin verla no puede saber que ya evaluó a esa persona. Se propone que la vea quien la registró (a confirmar) | Privacidad y flujo de evaluación |
| AQ-12 | Respuesta ante quien no puede ver una evaluación no aprobada: se propone omitirla de las listas y responder `404` en el detalle | API de consulta |

## 10. Siguiente acción

1. Revisar este contrato y responder AQ-1 a AQ-5; DM-Q-07 de LDM-003.
2. `api-contract-reviewer` y `api-security-reviewer`.
3. FLW, SCR y GEN de UXR-003 (certificar) y UXR-004 (perfil), que el DCP exige.
4. Un DCP del alcance de DSP-002.
