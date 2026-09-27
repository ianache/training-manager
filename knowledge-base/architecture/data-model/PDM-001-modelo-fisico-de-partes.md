---
type: Physical Data Model
title: "PDM-001 — Modelo físico de partes para MySQL y PostgreSQL"
description: "Convenciones físicas, DDL portable, scripts y anexos por motor del modelo de partes de SPEC-001, con la trazabilidad de cada restricción a su regla."
tags: [data-model, physical, ddl, mysql, postgresql, party, anonimizacion, dtc]
status: draft
generated:
  by: "data-model-designer/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: ldm-001
    resource: /knowledge-base/architecture/data-model/LDM-001-modelo-logico-de-partes.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: adr-003
    resource: /knowledge-base/architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md
---

# PDM-001 — Modelo físico de partes

- **Estado del gate (data-model-designer):** `REQUIRES_REVIEW`. Pruebas en motores: **PENDIENTE**; hay Docker (D28), pero Docker Desktop no está en marcha ([TST-001](tests/TST-001-pruebas-de-restricciones.md)).
- **Implementa:** [LDM-001](LDM-001-modelo-logico-de-partes.md). **Decisión de persistencia:** [ADR-003](../adrs/ADR-003-persistencia-mysql-y-postgresql.md) y [SPEC-001 §6.2](../../requirement/specs/SPEC-001-gestion-de-colaboradores.md) (D12).

## 1. Archivos

| Archivo | Qué es |
|---|---|
| [ddl/party-portable.sql](ddl/party-portable.sql) | DDL canónico, mínimo común denominador: corre sin cambios en MySQL 8.0.16+ y PostgreSQL 12+. Versión de PostgreSQL adoptada: la estable más reciente (D30) |
| [ddl/party-mysql.sql](ddl/party-mysql.sql) | Script de despliegue para MySQL. Diferencias en el [anexo MySQL](PDM-001-anexo-mysql.md) |
| [ddl/party-postgresql.sql](ddl/party-postgresql.sql) | Script de despliegue para PostgreSQL. Diferencias en el [anexo PostgreSQL](PDM-001-anexo-postgresql.md) |
| [tests/](tests/TST-001-pruebas-de-restricciones.md) | Pruebas de restricciones y su ejecución (TST-001) |

Los dos scripts por motor se derivan del portable y deben mantenerse en sincronía con él: un cambio de tabla se hace en el portable y se propaga.

## 2. Convenciones

| Tema | Convención | Base |
|---|---|---|
| Nombres | Tablas y columnas en `snake_case`, en inglés y en singular. Restricciones con prefijo: `pk_`, `fk_`, `uq_`, `ck_`, `ix_`, `ux_` (índice único) | Propuesta |
| Identificadores | UUID como `CHAR(36)`, generado por la aplicación. El código de colaborador (`employee_code`) sigue la misma convención: GUID generado por el microservicio de partes al registrar la persona (LDM-001 DM-12) | SPEC-001 §6.2 (DM-Q-05), D25 |
| Tipos | Catálogos con clave natural `code VARCHAR(40)` | DM-06 |
| Vigencias | `from_date DATE NOT NULL`, `thru_date DATE NULL`; vigente = `thru_date IS NULL`; CHECK `thru_date >= from_date` | DM-04, DM-11 |
| Instantes | UTC. Portable: `TIMESTAMP(6)`. MySQL: `DATETIME(6)`. PostgreSQL: `TIMESTAMP(6)` | SPEC-001 §6.2 |
| Auditoría | `created_at`, `created_by` y, si la fila puede cambiar, `updated_at`, `updated_by` (identificador del actor, sin FK) | BR-PTY-12, DM-10 |
| PII | Columnas NULL-ables; `NULL` = anonimizado. CHECK "anonimizada ⇔ sin PII" | DM-01, DM-02 |
| Unicidad condicional | Portable y MySQL: columna generada `STORED` que vale NULL fuera de la condición + UNIQUE. PostgreSQL: índice único parcial | SPEC-001 §6.2 |
| CHECK | Sí (MySQL 8.0.16+ los aplica) | SPEC-001 §6.2 |
| Restricciones diferibles | No se usan | SPEC-001 §6.2 |
| Acciones referenciales | Ninguna (`NO ACTION`): no se borra nada (BR-PTY-12). Además, MySQL no admite CASCADE/SET NULL sobre columnas usadas en CHECK o columnas generadas | BR-PTY-12 |

## 3. Trazabilidad de restricciones

| Restricción física | Tabla | Regla / decisión | Prueba |
|---|---|---|---|
| `fk_person_party`, `fk_organization_party`, `ck_person_kind`, `ck_organization_kind` (FK compuesta con `party_kind`) | person, organization | BR-PTY-02 | T03.3 |
| `fk_party_role_type` (tipo, clase) | party_role | BR-PTY-03 | Indirecta (T06.2 usa un tipo válido); sin caso negativo |
| `ck_party_role_dates`, `ck_party_role_thru_rec` | party_role | BR-PTY-12, BR-PTY-13, D17 | T05.1 |
| `ck_party_rel_distinct`, `ck_party_rel_dates` | party_relationship | BR-PTY-04 | — |
| `uq_person_employee_code` (UNIQUE simple, incluye anonimizadas; igual en los tres scripts) | person | BR-PTY-06, D9, D16, D25 (DM-Q-02 resuelta) | T03.1, T05.7 |
| `employee_code NOT NULL` | person | BR-PTY-06 | T03.2 |
| `ck_person_pii`, `ck_person_anon_by` | person | BR-PTY-14, D14, D16 | T05.2, T05.4 |
| `uq_party_ident` / `ux_party_ident_active` | party_identification | BR-PTY-07, BR-PTY-14 | T02.2–T02.4, T05.6 |
| `fk_party_ident_type` (tipo, clase) | party_identification | BR-PTY-07, D10 | T02.5, T02.6 |
| `ck_party_ident_pii` | party_identification | BR-PTY-14 | T02.7, T05.4 |
| `uq_contact_mechanism_email` / `ux_contact_mechanism_email_active` | contact_mechanism | BR-PTY-08, BR-PTY-14 (DM-05) | T04.2, T05.6 |
| `ck_contact_mechanism_pii` | contact_mechanism | BR-PTY-14 | T05.4 |
| `uq_pcm_current_work_email` / `ux_pcm_current_work_email` | party_contact_mechanism | BR-PTY-08 | T04.3, T04.4 |
| `fk_pcm_purpose` (propósito, tipo de medio) | party_contact_mechanism | BR-PTY-09 | T04.5 |
| `ck_pcm_platform` | party_contact_mechanism | BR-PTY-09, D8 | T04.6 |
| `uq_rla_current_role` / `ux_rla_current_role` | role_level_assignment | BR-PTY-11, D6 | T01.2–T01.4 |
| `ck_rla_dates` | role_level_assignment | BR-PTY-12 | T01.5 |
| `pk_access_identity`, `uq_access_identity_keycloak`, `ck_access_identity_pii` | access_identity | BR-PTY-16, BR-PTY-14, D4 | T05.4 |
| `ck_anon_setting_singleton`, `ck_anon_setting_days` | anonymization_setting | D15, D23 (A-08) | — |
| `uq_anon_notice_termination`, `ck_anon_notice_*` | anonymization_notice | BR-PTY-15, D15, D17, D18 (DM-09, A-09) | T06.3–T06.6 |
| Segundo Jefe de Ingeniería vigente permitido | party_role | BR-PTY-18, D21 | T06.2 |

## 4. Lo que la base no garantiza

Lo aplica el microservicio de partes; queda fuera del DDL: la generación del GUID del código de colaborador (D25), que un contratista no tenga relación de reporte (BR-PTY-19, D26), la visibilidad para otros colaboradores de solo nombre, correo laboral, unidad, rol y perfiles profesionales (BR-PTY-20, precisada el 2026-09-27 por P-52), BR-PTY-05 (derivado), la obligatoriedad y el dominio del correo laboral (BR-PTY-08, D13), la contratación vigente del contratista (BR-PTY-10), los pares de roles por tipo de relación (A-10), vigencias solapadas (DM-Q-06), no editar a un anonimizado y anonimizar solo tras la baja (BR-PTY-14), el envío del correo (BR-PTY-15, D19, D22), los permisos (BR-PTY-17) y el aviso de BR-PTY-18.

## 5. Procedimiento de referencia de anonimización

En una sola transacción, para la persona *p* (ver [T05](tests/t05-anonimizacion.sql)):

1. `person`: `given_names`, `family_names`, `preferred_name` ← NULL; `anonymized_at`, `anonymized_by` ← ahora (UTC) y el actor.
2. `party_identification` de *p*: `identification_number` ← NULL; `anonymized_at` ← ahora.
3. `contact_mechanism` usados por *p*: `contact_value` ← NULL; `anonymized_at` ← ahora. **Si el medio lo usa también otra parte no anonimizada** (A-06), no se modifica: se crea un medio nuevo ya anonimizado y el uso de *p* se reapunta a él, conservando sus fechas. T05 solo cubre el caso sin medio compartido.
4. `access_identity` de *p*: `keycloak_user_id` ← NULL; `anonymized_at` ← ahora.
5. No se tocan roles, relaciones, asignaciones, fechas, código ni columnas de auditoría (D16).

## 6. Operación

- **Borrado:** la cuenta de la aplicación no debería tener `DELETE` sobre estas tablas (BR-PTY-12). Propuesta; decide el arquitecto.
- **Copias de seguridad:** una copia anterior a una anonimización conserva la PII. La retención de copias debe acotarse (relacionado con asr-BR-TRA-01; sin decisión).
- **Despliegue y reversión:** es un esquema nuevo, sin migración de datos (SPEC-001 §1). Revertir = eliminar el esquema en entornos sin datos reales.
