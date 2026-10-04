# Pruebas — Party Management Service

```bash
pip install -r requirements.txt
pytest                    # SQLite en memoria, con cobertura (pyproject.toml)
pytest tests/security -v  # solo seguridad
```

## Contra PostgreSQL (esquema real de Alembic)

Con `TEST_DATABASE_URL`, la suite borra el esquema `public` de esa base, ejecuta
`alembic upgrade head` y vacía las tablas entre pruebas. Use una base **solo para pruebas** y un
usuario dueño de ella:

```bash
createdb -h localhost -U postgres party_test
TEST_DATABASE_URL=postgresql+asyncpg://postgres@localhost:5432/party_test pytest
```

Sin esa variable, las pruebas de `tests/schema/test_migrated_schema.py` se omiten.

| Suite | Qué cubre |
|---|---|
| `tests/security/test_service_auth.py` | ADR-005 §2: sin token, firma inválida, cliente no autorizado, emisor distinto, token vencido, falta o es inválido `X-User-Name` |
| `tests/security/test_authorization.py` | RBAC (solo `jefe_ingenieria` registra/modifica), vista limitada vs completa (UXR-000.5) |
| `tests/security/test_sql_injection.py` | Inyección SQL en correo y búsqueda |
| `tests/security/test_rate_limit.py` | API-SPEC-001 §4.5: cabeceras `X-RateLimit-*`, 429 con formato estándar y `Retry-After`, cuota por usuario y por operación, sin token no consume cuota, reinicio de ventana |
| `tests/integration/test_parties_api.py` | Contrato API-SPEC-001: 201 con auditoría del usuario final, 409 por correo e identificación, 400, paginación, búsqueda y filtros, orden inválido, límite 100, 404, actualización sin sobrescribir identidad |
| `tests/integration/test_physical_model.py` | Q-11: el alta se descompone en las tablas de PDM-001, pasaporte → `PASSPORT`, correo único sin distinguir mayúsculas, el teléfono anterior se cierra con vigencia, estados `inactive` y `anonymized`, búsqueda por correo, semilla idempotente |
| `tests/integration/test_health.py` | `/health/ready` exige la base migrada |
| `tests/schema/test_sql_sources.py` | La línea base de Alembic es idéntica a `party-postgresql.sql` |
| `tests/schema/test_migrated_schema.py` | Solo PostgreSQL: revisión en head, el ORM coincide con la base, nombres STD-DB-001 (≤ 63 caracteres), catálogos sembrados, índice único de correo |
| `tests/integration/test_org_*.py`, `test_internal_organization.py` | DCP-004 fase 2 (API-SPEC-006/007): listado ampliado (`ancestor_id`, orden, conteos, `view=tree`), `PATCH` con historial del nombre, cambio de padre (ciclo, padre inactivo, nombre repetido, concurrencia), desactivar/reactivar, historial de relaciones y organización interna; permisos Jefe/ADMIN, `If-Match` y auditoría |
| `tests/security/test_org_management_security.py` | Rutas nuevas: sin token 401, UUID inválido 400, cuota de escrituras 429, inyección en el nombre |
| `tests/schema/test_unit_name_scope_migration.py` | Solo PostgreSQL: migración 0007 (ascenso con rellenado, índice único del nombre por padre, una relación de estructura vigente, descenso) |

Los tokens se firman con una llave RSA generada en `tests/conftest.py`; el cliente JWKS se reemplaza
por uno que devuelve esa llave, así que la validación de firma es real sin depender de Keycloak.
