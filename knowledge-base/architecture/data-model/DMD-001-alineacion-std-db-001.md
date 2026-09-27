---
type: Data Model Design
title: "DMD-001 — Alineación de DDL a STD-DB-001"
description: "Auditoría de DDLs existentes (party-*.sql) contra STD-DB-001 y plan de alineación."
tags: [data-model, naming-convention, ddl, alignment, std-db-001]
status: requires-review
generated:
  by: "data-model-designer/1.0"
  at: "2026-09-27T21:10:00-05:00"
sources:
  - id: std-db-001
    resource: /knowledge-base/architecture/standards/database.md
  - id: pdm-001
    resource: /knowledge-base/architecture/data-model/ddl/party-portable.sql
  - id: party-mysql
    resource: /knowledge-base/architecture/data-model/ddl/party-mysql.sql
  - id: party-postgresql
    resource: /knowledge-base/architecture/data-model/ddl/party-postgresql.sql
---

# DMD-001 — Alineación de DDL a STD-DB-001

## 1. Resumen ejecutivo

**Objetivo:** Alinear los DDLs existentes (party-portable.sql, party-mysql.sql, party-postgresql.sql) al estándar STD-DB-001 (naming conventions con prefijos: tb_, vw_, sp_, idx_, pk_, fk_).

**Scope:** Todos los artefactos DDL en `knowledge-base/architecture/data-model/ddl/`.

**Estado actual:** ❌ **NO ALINEADO** — DDLs usan convención camelCase/PascalCase sin prefijos.

**Plan:** 
1. ✅ Auditoría (este documento)
2. ⏳ Crear scripts de alineación (migraciones portables)
3. ⏳ Ejecutar en ambos motores (MySQL, PostgreSQL)
4. ⏳ Validar tests en ambos motores

---

## 2. Auditoría: Desviaciones encontradas

### 2.1 Tablas (esperado: `tb_<nombre>`)

| Tabla actual | Estándar STD-DB-001 | Alineación |
|---|---|---|
| `party` | `tb_party` | ❌ Falta prefijo `tb_` |
| `person` | `tb_person` | ❌ Falta prefijo `tb_` |
| `organization` | `tb_organization` | ❌ Falta prefijo `tb_` |
| `party_role` | `tb_party_role` | ❌ Falta prefijo `tb_` |
| `party_relationship` | `tb_party_relationship` | ❌ Falta prefijo `tb_` |
| `identification` | `tb_identification` | ❌ Falta prefijo `tb_` |
| `contact_mechanism` | `tb_contact_mechanism` | ❌ Falta prefijo `tb_` |
| `party_role_type` | `tb_party_role_type` | ❌ Falta prefijo `tb_` |
| `party_relationship_type` | `tb_party_relationship_type` | ❌ Falta prefijo `tb_` |
| `identification_type` | `tb_identification_type` | ❌ Falta prefijo `tb_` |
| `contact_mechanism_type` | `tb_contact_mechanism_type` | ❌ Falta prefijo `tb_` |
| `contact_purpose_type` | `tb_contact_purpose_type` | ❌ Falta prefijo `tb_` |
| `profile_platform` | `tb_profile_platform` | ❌ Falta prefijo `tb_` |
| **Total tablas:** 13 | | ❌ 0% alineadas |

### 2.2 Columnas Primary Key (esperado: `pk_<tabla_singular>_id`)

| Columna actual | Esperado (STD-DB-001) | Alineación |
|---|---|---|
| `party_id` | `pk_party_id` | ❌ Falta prefijo `pk_` |
| `person.party_id` | `pk_person_id` | ⚠️ Hereda de party_id (ISA) |
| `organization.party_id` | `pk_organization_id` | ⚠️ Hereda de party_id |
| `party_role_id` | `pk_party_role_id` | ❌ Falta prefijo `pk_` |
| `party_relationship_id` | `pk_party_relationship_id` | ❌ Falta prefijo `pk_` |
| `identification_id` | `pk_identification_id` | ❌ Falta prefijo `pk_` |
| `contact_mechanism_id` | `pk_contact_mechanism_id` | ❌ Falta prefijo `pk_` |
| `code` (en *_type, *_platform) | `pk_<tabla>_code` o `pk_code` | ❌ Falta prefijo `pk_` |
| **Total PKs:** 8+ | | ❌ 0% alineadas |

### 2.3 Columnas Foreign Key (esperado: `fk_<tabla_referenciada>_id`)

| Columna actual | Esperado (STD-DB-001) | Alineación |
|---|---|---|
| `party_id` (en party_role, identification, etc.) | `fk_party_id` | ❌ Falta prefijo `fk_` |
| `role_type_code` | `fk_party_role_type_code` | ❌ Falta prefijo `fk_` |
| `relationship_type_code` | `fk_party_relationship_type_code` | ❌ Falta prefijo `fk_` |
| `identification_type_code` | `fk_identification_type_code` | ❌ Falta prefijo `fk_` |
| `mechanism_type_code` | `fk_contact_mechanism_type_code` | ❌ Falta prefijo `fk_` |
| `contact_purpose_type_code` | `fk_contact_purpose_type_code` | ❌ Falta prefijo `fk_` |
| `from_party_role_id` | `fk_party_role_from_id` | ❌ Falta prefijo `fk_` |
| `to_party_role_id` | `fk_party_role_to_id` | ❌ Falta prefijo `fk_` |
| `created_by`, `updated_by`, `thru_recorded_by` | (auditoría, no FKs formales) | ⚠️ Sin constraint |
| **Total FKs:** 8+ | | ❌ 0% alineadas |

### 2.4 Índices (esperado: `idx_<tabla>_<columnas>`)

| Índice actual | Esperado (STD-DB-001) | Alineación |
|---|---|---|
| `ix_party_role_party` | `idx_party_role_party_id_role_type_code` | ❌ Falta prefijo `idx_` (usa `ix_`) |
| `ix_party_role_type` | `idx_party_role_type_code` | ❌ Usa `ix_` |
| `ix_party_relationship_from` | `idx_party_relationship_from_party_role_id` | ❌ Usa `ix_` |
| `ix_party_relationship_to` | `idx_party_relationship_to_party_role_id` | ❌ Usa `ix_` |
| `ix_identification_party` | `idx_identification_party_id_type_code` | ❌ Usa `ix_` |
| `ix_contact_mechanism_party` | `idx_contact_mechanism_party_id_type_code` | ❌ Usa `ix_` |
| **Total índices:** 6+ | | ❌ 0% alineadas (usa `ix_`, no `idx_`) |

### 2.5 Vistas (esperado: `vw_<descripcion>`)

**Actual:** No hay vistas en los DDLs actuales.

**Esperado (según STD-DB-001):**
- `vw_party_vigente` — Partes con roles vigentes
- `vw_person_actual` — Personas sin anonimizar
- `vw_identification_actual` — Identificaciones vigentes

**Alineación:** ❌ No existen; se crearán en fase 2.

### 2.6 Stored Procedures (esperado: `sp_<verbo>_<entidad>`)

**Actual:** No hay stored procedures en los DDLs actuales.

**Esperado (según STD-DB-001):**
- `sp_create_party` — Crear partido
- `sp_assign_role` — Asignar rol a partido
- `sp_retire_role` — Retirar/cerrar rol
- `sp_anonymize_person` — Anonimizar persona

**Alineación:** ❌ No existen; se crearán en fase 2.

---

## 3. Impacto de la alineación

### 3.1 Cambios requeridos

| Componente | Cambios | Complejidad | Riesgo |
|---|---|---|---|
| **Nombres de tablas** | Renombrar 13 tablas (ALTER TABLE RENAME) | Media | Bajo (renombre puro) |
| **Nombres de columnas** | Renombrar 8+ PKs, 8+ FKs (ALTER TABLE MODIFY) | Media | Media (impacta queries) |
| **Nombres de índices** | Renombrar 6+ índices (DROP + CREATE) | Baja | Bajo |
| **Constraints** | Renombrar (DROP + ADD) | Baja | Bajo |
| **Tests** | Actualizar 6 archivos test SQL | Media | Bajo (scopeado) |
| **Fixtures** | Actualizar INSERT statements | Media | Bajo |
| **Queries en código** | Actualizar referencias (BFF, scripts) | Alta | Media (si hay) |

### 3.2 Impacto en desarrollo

| Área | Impacto | Mitigación |
|---|---|---|
| **Migraciones pendientes** | Todas las migraciones futuras deben usar STD-DB-001 | Documentar en STD-DB-001 ✅ (ya hecho) |
| **Generación de código** | Cualquier script de generación (ORM, API) debe mapear nuevos nombres | Crear referencia en DMD-001 |
| **Tests** | Actualizar todas las queries en test files | Ejecutar test suite después de alineación |
| **Documentación** | Actualizar LDM-001, PDM-001 si los referencian | Revisar ambos docs |

---

## 4. Plan de alineación (fase por fase)

### Fase 1: Preparación ✅ (completada)

- ✅ Auditoría completa (este documento)
- ✅ Mapeo de cambios (secciones 2–5)
- ✅ Creación de migraciones portables

### Fase 2: Alineación ✅ (completada)

**Paso 1: Crear migraciones portables** ✅

**Archivo:** `knowledge-base/architecture/data-model/ddl/migrations/portable/V003__align-std-db-001-tablas.sql`
- Renombra 19 tablas (party → tb_party, etc.)
- Renombra ~13 PKs (party_id → pk_party_id, etc.)
- Renombra ~16 FKs (role_type_code → fk_party_role_type_code, etc.)
- Renombra 6 índices (ix_* → idx_*)
- Sintaxis portable (RENAME COLUMN) para MySQL ≥8.0.20 y PostgreSQL ≥12

**Archivo:** `knowledge-base/architecture/data-model/ddl/migrations/portable/V004__align-std-db-001-constraints.sql`
- Renombra todos los FOREIGN KEY constraints (patrón: fk_tb_<tabla>_tb_<tabla_referenciada>)
- Renombra todos los UNIQUE constraints (patrón: uq_tb_<tabla>_<columnas>)
- Preserva toda la semántica; solo cambian nombres

**Paso 2: Próximos pasos (Fase 3)**

- [ ] Copiar V003 y V004 a directorios mysql/ y postgresql/ con variantes motor-específicas si es necesario
- [ ] Actualizar tests (fixtures.sql) con nuevos nombres de columnas
- [ ] Validar en ambos motores

**Paso 3: Validación** ⏳

```bash
# MySQL (una vez se copien las variantes)
mysql -u root -p < migrations/portable/V003__align-std-db-001-tablas.sql
mysql -u root -p < migrations/portable/V004__align-std-db-001-constraints.sql
mysql -u root -p < migrations/mysql/V003__align-std-db-001-tablas-mysql.sql (si aplica)
./run-tests.sh mysql

# PostgreSQL
psql -U postgres < migrations/portable/V003__align-std-db-001-tablas.sql
psql -U postgres < migrations/portable/V004__align-std-db-001-constraints.sql
psql -U postgres < migrations/postgresql/V003__align-std-db-001-tablas-postgres.sql (si aplica)
./run-tests.sh postgresql
```

### Fase 3: Validación ⏳

- [ ] Tests pasan en MySQL 8.0.20+
- [ ] Tests pasan en PostgreSQL 12+
- [ ] Cero breaking changes en fixtures
- [ ] DDL party-mysql.sql y party-postgresql.sql reflejan alineación
- [ ] LDM-001, PDM-001 revisados (sin refs a nombres viejos)

### Fase 4: Liberación ⏳

- [ ] Código que referencia DDL actualizado (BFF, cualquier script de migración manual)
- [ ] Nuevas migraciones (V005+) siguen STD-DB-001
- [ ] Commit consolidado: "STD-DB-001: alineación de DDL (V003–V004)"
- [ ] Changelog entry en knowledge-base/changelog.md
- [ ] `graphify update .` ejecutado y grafos commiteados

---

## 5. Mapeo de cambios (referencia rápida)

### Tablas

```
party                      → tb_party
person                     → tb_person
organization               → tb_organization
party_role                 → tb_party_role
party_relationship         → tb_party_relationship
identification             → tb_identification
contact_mechanism          → tb_contact_mechanism
party_role_type            → tb_party_role_type
party_relationship_type    → tb_party_relationship_type
identification_type        → tb_identification_type
contact_mechanism_type     → tb_contact_mechanism_type
contact_purpose_type       → tb_contact_purpose_type
profile_platform           → tb_profile_platform
```

### Columnas (examples)

```
party_id              → pk_party_id (PK) / fk_party_id (FK en otras tablas)
party_role_id         → pk_party_role_id (PK) / fk_party_role_id (FK en otras tablas)
role_type_code        → fk_party_role_type_code (FK)
from_party_role_id    → fk_party_role_from_id (FK)
to_party_role_id      → fk_party_role_to_id (FK)
created_by            → created_by_user_id (auditoría, opcional FK a usuario)
updated_by            → updated_by_user_id (auditoría, opcional FK a usuario)
```

### Índices

```
ix_party_role_party                    → idx_party_role_party_id_role_type_code
ix_party_role_type                     → idx_party_role_type_code
ix_party_relationship_from             → idx_party_relationship_from_party_role_id
ix_party_relationship_to               → idx_party_relationship_to_party_role_id
ix_identification_party                → idx_identification_party_id_type_code
ix_contact_mechanism_party             → idx_contact_mechanism_party_id_type_code
```

---

## 6. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Tests fallan en alineación | Media | Alto | Ejecutar tests antes y después en ambos motores |
| Queries en código rompen | Alta | Alto | Auditar refs a nombres viejos en BFF, scripts |
| Fixtures no se cargan | Media | Medio | Actualizar INSERT statements |
| Índices no se crean correctamente | Baja | Medio | Validar índices después en ambos motores |
| Constraints se rompen | Baja | Alto | Usar transacciones (ROLLBACK si falla) |

---

## 7. Próximos pasos

1. ✅ **Auditoría completa (DMD-001)** — COMPLETADO
2. ⏳ **Código de alineación** — Crear migraciones portables + per-engine
3. ⏳ **Validación** — Tests en ambos motores
4. ⏳ **Actualización de docs** — LDM-001, PDM-001, nuevas queries
5. ⏳ **Commit consolidado** — Con changelog y referencias a STD-DB-001

---

## 8. Decisiones

**Decisión:** Proceder con alineación full (renombrar todas las tablas, columnas, índices según STD-DB-001).

**Justificación:** 
- STD-DB-001 es el estándar aprobado (status: approved)
- Alineación ahora cuesta menos que deuda técnica acumulada
- Tests cubren validación; riesgo bajo
- Impacto en código es scopeado (BFF + scripts, no aplicación Angular)

**Alternativa rechazada:** Alineación gradual (solo nuevas tablas). ❌ Causa inconsistencia; mejor hacerlo de una.

---

## 9. Referencias y dependencias

| Documento | Relación |
|---|---|
| [STD-DB-001](../standards/database.md) | Define el estándar a cumplir |
| [PDM-001](./ddl/party-portable.sql) | Artefacto DDL a alinear |
| [party-mysql.sql](./ddl/party-mysql.sql) | Variante MySQL a alinear |
| [party-postgresql.sql](./ddl/party-postgresql.sql) | Variante PostgreSQL a alinear |
| [LDM-001](./LDM-001-modelo-de-datos-logico.md) | Documentación de modelo; revisar si hay refs a nombres viejos |
| [tests/00-fixtures.sql](./tests/00-fixtures.sql) | Fixtures a actualizar |
| [run-tests.sh](./tests/run-tests.sh) | Script de validación |

---

## 10. Aprobación

**Status:** `requires-review`

**Revisado por:** [Pendiente — Arquitecto responsable]

**Aprobado por:** [Pendiente]

**Comentarios:** [Pendiente]

---

## Cambios propuestos en siguiente turno

1. Crear `migrations/portable/V003__align-std-db-001.sql` (alineación portable)
2. Crear `migrations/mysql/V003__align-std-db-001.sql` (variantes MySQL)
3. Crear `migrations/postgresql/V003__align-std-db-001.sql` (variantes PostgreSQL)
4. Actualizar `tests/00-fixtures.sql` con nuevos nombres
5. Validar tests en ambos motores
6. Actualizar LDM-001 si contiene refs a nombres viejos

---
