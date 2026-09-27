---
type: Physical Data Model Annex
title: "PDM-001 — Anexo MySQL 8"
description: "Diferencias del script MySQL 8.0.16+ del modelo de partes respecto del DDL portable: DATETIME(6) en UTC, columnas generadas con índice único, CHECK y collation."
tags: [data-model, physical, ddl, mysql, party]
status: draft
generated:
  by: "data-model-designer/1.0"
  at: "2026-09-27T16:40:00-05:00"
sources:
  - id: pdm-001
    resource: /knowledge-base/architecture/data-model/PDM-001-modelo-fisico-de-partes.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: adr-003
    resource: /knowledge-base/architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md
---

# PDM-001 — Anexo MySQL 8

Script: [ddl/party-mysql.sql](ddl/party-mysql.sql). Base: [PDM-001](PDM-001-modelo-fisico-de-partes.md) y [ADR-003](../adrs/ADR-003-persistencia-mysql-y-postgresql.md). Versión mínima: **8.0.16** (CHECK aplicados) y 8.0.13 para `DEFAULT` con expresión.

| Tema | Portable | MySQL | Motivo |
|---|---|---|---|
| Instantes | `TIMESTAMP(6)` | `DATETIME(6)`, con valores en UTC | SPEC-001 §6.2. `TIMESTAMP` de MySQL convierte según la zona de la sesión y termina en 2038 |
| Zona de la sesión | — | `SET time_zone = '+00:00'` al inicio | Coherencia de `UTC_TIMESTAMP` y de literales |
| Valor por defecto de `created_at` | ninguno | `DEFAULT (UTC_TIMESTAMP(6))` | Red de seguridad; la aplicación sigue enviando el instante |
| Motor y juego de caracteres | — | `ENGINE=InnoDB`, `utf8mb4`, `utf8mb4_0900_ai_ci` | FK y transacciones; texto con tildes |
| UUID | `CHAR(36)` | `CHAR(36)` (alternativa `BINARY(16)`, DM-Q-05) | SPEC-001 §6.2 |
| Un nivel vigente por rol | columna generada + UNIQUE | igual: `current_role_id` = `catalog_role_id` si `thru_date IS NULL`, si no NULL; `UNIQUE (person_party_id, current_role_id)` | MySQL no tiene índices parciales; un UNIQUE admite varios NULL |
| Código de colaborador único | `CHAR(36)` + `UNIQUE (employee_code)` | igual. Incluye a los anonimizados: el GUID no se reutiliza (ya no hay columna `employee_code_key`) | BR-PTY-06, D25 (DM-Q-02 resuelta) |
| Correo único | igual | `email_key` = `LOWER(contact_value)` si es EMAIL y no anonimizado; UNIQUE | DM-05 |
| Correo laboral vigente | igual | `current_work_email_key` = medio si WORK_EMAIL y vigente; UNIQUE | BR-PTY-08 |
| Identificación única | UNIQUE (tipo, número, país) | igual; la anonimizada tiene número NULL y sale sola | BR-PTY-07, BR-PTY-14 |
| CHECK | sí | sí; los nombres de CHECK son únicos en todo el esquema | MySQL exige nombres únicos por esquema |
| Acciones referenciales | ninguna | ninguna. MySQL no permite CASCADE/SET NULL en columnas usadas en CHECK ni en la base de una columna generada | Restricción del motor |

**Cuidados propios de MySQL:**

- Las columnas generadas no se escriben en INSERT ni UPDATE; se omiten de la lista de columnas.
- `utf8mb4_0900_ai_ci` no distingue mayúsculas **ni acentos**: `ABC-1` y `abc-1` chocan en MySQL y no en PostgreSQL (DM-Q-03). Afecta al número de documento; en el código de colaborador (GUID, D25) solo importaría si la aplicación no normaliza las mayúsculas del GUID.
- Los índices sobre `VARCHAR(500)` en `utf8mb4` ocupan hasta 2000 bytes, por debajo del límite de 3072 de InnoDB.
- MySQL crea por su cuenta un índice para cada FK que no tenga uno; los `CREATE INDEX` del script pueden sustituirlo.
