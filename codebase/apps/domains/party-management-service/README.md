# Party Management Service

Microservicio de data maestra de partes (colaboradores, contratistas). FastAPI (ADR-008),
consumido **solo por el BFF** (ADR-001). Contrato: [API-SPEC-001](../../../../knowledge-base/architecture/api/API-SPEC-001-gestion-data-maestra-party.md).

## Seguridad (ADR-005 §2)

El servicio no autentica usuarios finales. Cada llamada debe traer:

| Header | Qué es | Validación |
|---|---|---|
| `Authorization: Bearer <JWT>` | Token de la cuenta de servicio del BFF (client_credentials en Keycloak) | Firma con el JWKS de Keycloak, `iss = KEYCLOAK_ISSUER`, vigencia, `azp ∈ KEYCLOAK_ALLOWED_CLIENTS` |
| `X-User-Name` | Usuario final | Obligatorio; se usa como autor en la auditoría (`created_by`, `updated_by`) |
| `X-User-Roles` | Roles de realm del usuario final, separados por coma | Para RBAC y visibilidad. Extensión de ADR-005 propuesta (ARCHITECTURE.md, D-07) |
| `X-Request-ID` | Trazabilidad | Se devuelve en la respuesta y en los errores |

Los headers de identidad solo se aceptan **después** de validar el token del BFF. Sin token válido → `401`.

## Endpoints (API-SPEC-001 §3.1)

| Método y ruta | Quién | Notas |
|---|---|---|
| `GET /api/v1/parties` | Cualquier usuario autenticado | `page`, `limit` (≤100), `sort` (`created_at`, `code`, `last_names` + `:asc/:desc`), `status`, `role`, `search`. Respuesta `{data, pagination, filters_applied}` |
| `GET /api/v1/parties/{id}` | Cualquier usuario autenticado | Jefe de Ingeniería/ADMIN: ficha completa. Resto: vista limitada (nombre, correo, unidad, rol, estado; UXR-000.5) |
| `POST /api/v1/parties` | `jefe_ingenieria` | 409 `EMAIL_DUPLICATE` / `IDENTIFICATION_DUPLICATE` |
| `PATCH /api/v1/parties/{id}` | `jefe_ingenieria` | Solo `preferred_name` y `phone_work`. Un teléfono nuevo cierra el anterior con vigencia (BR-PTY-09) |

Errores con el formato estándar (§4.2): `{"error": {"code", "message", "status", "timestamp", "request_id", "details"}}`.
La validación responde `400 VALIDATION_ERROR` con el detalle por campo.

## Límite de solicitudes (API-SPEC-001 §4.5, SRC-001-001)

Por usuario final (`X-User-Name`), en ventanas fijas de una hora. Solo cuentan las llamadas con
token válido.

| Operación | Variable | Desarrollo | Producción (API-SPEC-001) |
|---|---|---|---|
| Lectura (`GET`) | `RATE_LIMIT_READ_PER_HOUR` | 1000 | 10000 |
| Alta (`POST`) | `RATE_LIMIT_CREATE_PER_HOUR` | 100 | 100 |
| Actualización (`PATCH`) | `RATE_LIMIT_UPDATE_PER_HOUR` | 500 | 500 |
| Anonimización (futuro) | `RATE_LIMIT_ANONYMIZE_PER_HOUR` | 10 | 10 |

Toda respuesta limitada trae `X-RateLimit-Limit`, `X-RateLimit-Remaining` y `X-RateLimit-Reset`
(época UNIX). Al exceder: `429 RATE_LIMIT_EXCEEDED` con `Retry-After` y `details.retry_after`.
El BFF reenvía esas cabeceras al portal. `RATE_LIMIT_ENABLED=false` lo apaga.

## Modelo de datos y migraciones (Q-11, ASM-002)

El servicio persiste en el modelo físico **PDM-001** alineado a STD-DB-001 (tablas `tb_*`). El
mapeo entre la "parte" plana de la API y las tablas normalizadas está al inicio de
`app/services/party_service.py`:

| API | Tabla |
|---|---|
| `id`, `code` | `tb_party.pk_party_id`, `tb_person.employee_code` (GUID) |
| nombres | `tb_person.given_names`, `family_names`, `preferred_name` |
| `identification` | `tb_party_identification` (DNI, CE, PASSPORT) |
| `contact.email_work` / `phone_work` | `tb_contact_mechanism` vía `tb_party_contact_mechanism` (`WORK_EMAIL` / `WORK_PHONE`) |
| `role` | último `tb_party_role` `EMPLOYEE` / `CONTRACTOR` |
| `status` | `anonymized` (persona anonimizada), `active` (rol vigente), `inactive` |

**Alembic es el dueño del esquema.** El servicio no ejecuta `create_all`. `docker-entrypoint.sh`
corre `alembic upgrade head` antes de uvicorn.

| Revisión | Qué hace |
|---|---|
| `0001_pdm001_baseline` | Copia exacta de `knowledge-base/.../ddl/party-postgresql.sql` (tablas, catálogos, semillas, índices parciales). Una prueba vigila que la copia no se aparte del original |
| `0002_std_db_001_alignment` | V003 + V004 **corregidos para PostgreSQL** (prefijos `tb_`, `pk_`, `fk_`, `idx_`) |

V003 y V004 (`ddl/migrations/portable/`) **no corren tal cual** sobre el DDL de PostgreSQL:
V003 tiene una línea sin comentar y no renombra `tb_contact_purpose_type.mechanism_type_code`;
V004 hace `DROP CONSTRAINT` de UNIQUE de los que dependen FK, nombra columnas generadas que en
PostgreSQL no existen y usa nombres de más de 63 caracteres. La cabecera de
`migrations/sql/0002_std_db_001_alignment_postgresql.sql` documenta cada corrección (C1 a C5).

```bash
alembic upgrade head          # crea o actualiza el esquema (usa DATABASE_URL)
alembic current               # revisión aplicada
alembic downgrade base        # SOLO desarrollo: borra las tablas
```

Un cambio de esquema es una revisión nueva (`alembic revision -m "..."`); no se editan las ya
aplicadas. Si el arranque falla con "volumen anterior a las migraciones", la base se creó con el
esquema viejo: en desarrollo, `docker compose -p codebase down -v`.

Solo PostgreSQL por ahora. Para MySQL (ADR-003) hace falta una rama de migraciones propia.

## Ejecutar

```bash
python -m venv .venv && . .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest                                            # SQLite en memoria + Keycloak simulado
cp .env.example .env && alembic upgrade head && uvicorn app.main:app --reload
```

En la plataforma completa se levanta con `codebase/docker-compose.yml` (con `SEED_DEMO_DATA=true`:
cinco colaboradores de ejemplo si no hay personas).

## Brechas

- `unit_id`, `direct_manager_id`, `role_assignments` y `program_roles` se devuelven vacíos: las
  tablas existen (`tb_party_relationship`, `tb_role_level_assignment`), pero el servicio todavía
  no las usa.
- El vínculo con Keycloak (`tb_access_identity`, US-022) no se llena, así que el colaborador no
  puede editar "su" ficha.
- `identification_number` acepta hasta 20 caracteres (VARCHAR(20) de PDM-001); el DDL de
  ejemplo de API-SPEC-001 §7 dice 30.
- `created_by` y `updated_by` son VARCHAR(36): un `X-User-Name` más largo se recorta.
- El límite de solicitudes cuenta en memoria: con varias réplicas o workers, cada uno cuenta por
  separado. Pasar a Redis antes de escalar.
