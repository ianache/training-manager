---
type: Physical Data Model Annex
title: "PDM-001 — Anexo PostgreSQL"
description: "Diferencias del script PostgreSQL del modelo de partes respecto del DDL portable: índices únicos parciales en lugar de columnas generadas, TIMESTAMP en UTC y CHECK."
tags: [data-model, physical, ddl, postgresql, party]
status: draft
generated:
  by: "data-model-designer/1.0"
  at: "2026-09-27T09:40:00-05:00"
sources:
  - id: pdm-001
    resource: /knowledge-base/architecture/data-model/PDM-001-modelo-fisico-de-partes.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: adr-003
    resource: /knowledge-base/architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md
---

# PDM-001 — Anexo PostgreSQL

Script: [ddl/party-postgresql.sql](ddl/party-postgresql.sql). Base: [PDM-001](PDM-001-modelo-fisico-de-partes.md) y [ADR-003](../adrs/ADR-003-persistencia-mysql-y-postgresql.md). Versión mínima: **pendiente (Q-08)**. El DDL portable exige 12+ (columnas generadas `STORED`). Las pruebas se prepararon para `postgres:16`.

| Tema | Portable | PostgreSQL | Motivo |
|---|---|---|---|
| Instantes | `TIMESTAMP(6)` | `TIMESTAMP(6)` sin zona, con valores en UTC; `SET TIME ZONE 'UTC'` | SPEC-001 §6.2 (DM-Q-04 plantea `TIMESTAMPTZ`) |
| Valor por defecto de `created_at` | ninguno | `DEFAULT (now() AT TIME ZONE 'UTC')` | Red de seguridad; la aplicación envía el instante |
| UUID | `CHAR(36)` | `CHAR(36)` (alternativa: tipo `uuid` nativo, DM-Q-05) | SPEC-001 §6.2 |
| Un nivel vigente por rol | columna generada + UNIQUE | `CREATE UNIQUE INDEX ux_rla_current_role ON role_level_assignment (person_party_id, catalog_role_id) WHERE thru_date IS NULL` | Índice parcial: sin columna auxiliar |
| Código único sin anonimizados | columna generada + UNIQUE | `ux_person_employee_code_active ... (employee_code) WHERE anonymized_at IS NULL` | BR-PTY-14 |
| Correo único | columna generada `LOWER` + UNIQUE | `ux_contact_mechanism_email_active ... (LOWER(contact_value)) WHERE mechanism_type_code = 'EMAIL' AND anonymized_at IS NULL` | PostgreSQL distingue mayúsculas: el índice de expresión lo evita |
| Correo laboral vigente | columna generada + UNIQUE | `ux_pcm_current_work_email ... (contact_mechanism_id) WHERE purpose_type_code = 'WORK_EMAIL' AND thru_date IS NULL` | BR-PTY-08 |
| Identificación única | UNIQUE (tipo, número, país) | `ux_party_ident_active ... WHERE anonymized_at IS NULL` | Equivale al NULL del número, explícito |
| Columnas generadas | 4 | ninguna (`employee_code_key`, `email_key`, `current_work_email_key`, `current_role_id` no existen) | Las consultas no deben usarlas |
| Índices de FK | algunos | los del portable, más `ix_rla_person` e `ix_anon_notice_person` | PostgreSQL no indexa las FK por su cuenta |
| CHECK | sí | sí, iguales | — |

**Cuidados propios de PostgreSQL:**

- El texto distingue mayúsculas y acentos: `EMP-001` y `emp-001` son códigos distintos (DM-Q-03).
- Un error dentro de una transacción explícita la aborta hasta `ROLLBACK`; las pruebas usan sentencias sueltas en modo autocommit para seguir tras los errores esperados.
- Alternativa no adoptada: `EXCLUDE USING gist` para impedir vigencias solapadas (DM-Q-06); no tiene equivalente en MySQL.
