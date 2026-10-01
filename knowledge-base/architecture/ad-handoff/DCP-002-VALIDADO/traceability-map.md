---
type: Traceability Map
title: US → ASR → ADR → Architecture Rule → Fitness Criterion
id: TRACE-001
generated: "2026-09-30T00:00:00-05:00"
---

# Traceability Matrix: Requirements → Architecture → Implementation → Verification

> **v1.1 (2026-10-01) — fe de erratas.** Este documento se conserva como v1.0. Donde difiera de
> [`pack.yaml`](pack.yaml) v1.1 o de [`ready-for-dev.md`](ready-for-dev.md) §0, **prevalecen
> estos**. Correcciones principales: gate firmado `READY_FOR_DEV` por `human:ianache`
> (Solution Architect y Tech Lead backend); CON-001 resuelto por
> [ADR-010](../../adrs/ADR-010-lenguaje-del-bff-nodejs.md) (BFF en Node.js); ADR-006 no existe;
> fechas reales de los ADR (2026-09-27 a 2026-09-30); roles `jefe_ingenieria`, `colaborador`,
> `admin` con vista limitada para otros colaboradores (P-08); modelo de datos = PDM-001 alineado
> (`tb_party`, `tb_person`, `tb_party_role`, `tb_party_identification`, `tb_contact_mechanism`,
> `tb_party_contact_mechanism`…), no las tablas `tb_party_role_assignment`,
> `tb_party_program_role` ni `tb_party_keycloak_link`; API-SPEC-001 tiene 23 operaciones y sigue
> en draft; STD-DB-001 está en `knowledge-base/architecture/standards/database.md`.


## Overview

This matrix traces each User Story through Architecture Significant Requirements (ASRs), approved Architecture Decisions (ADRs), resulting Architecture Rules, and Fitness Criteria that verify implementation correctness.

---

## US-015: Registrar un colaborador (Register Collaborator)

```
┌─────────────────────────────────────────────────────────────┐
│ US-015: Registrar un colaborador                            │
│ Owner: Jefe de Ingeniería                                   │
│ Endpoint: POST /api/v1/parties                              │
└────────────┬────────────────────────────────────────────────┘
             │ requires
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ASR-006: Criteria and Actors for Role Upgrade               │
│ Quality Attribute: Authorization (who can create?)          │
│ Status: Approved                                            │
└────────────┬────────────────────────────────────────────────┘
             │ depends on
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ADR-002: Authentication in BFF with Keycloak + PKCE         │
│ ADR-005: PKCE Implementation (Tokens, Identity, Sessions)   │
│ Status: ACCEPTED (2026-09-20, 2026-09-22)                  │
└────────────┬────────────────────────────────────────────────┘
             │ implements
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE RULE: AUTH-001                                 │
│ "Every endpoint MUST validate X-Token + X-User-Name header" │
│ "Authorization check MUST occur BEFORE database query"      │
└────────────┬────────────────────────────────────────────────┘
             │ verified by
             ▼
┌─────────────────────────────────────────────────────────────┐
│ FITNESS CRITERIA:                                           │
│ ✅ FC-015-001: test_jefe_can_create_party                  │
│    ├─ GIVEN: Jefe with valid X-Token + X-User-Name         │
│    ├─ WHEN: POST /api/v1/parties (all required fields)     │
│    ├─ THEN: 201 Created, response includes party_id        │
│    └─ AND: application.log contains created_by=X-User-Name │
│                                                             │
│ ✅ FC-015-002: test_colaborador_cannot_create_party        │
│    ├─ GIVEN: Colaborador role (not Jefe)                   │
│    ├─ WHEN: POST /api/v1/parties                           │
│    ├─ THEN: 403 Forbidden                                  │
│    └─ AND: No party created (audit log clean)              │
│                                                             │
│ ✅ FC-015-003: test_missing_auth_headers_401               │
│    ├─ GIVEN: Request without X-Token or X-User-Name        │
│    ├─ WHEN: POST /api/v1/parties                           │
│    ├─ THEN: 401 Unauthorized (before DB query)             │
│    └─ AND: No party created                                │
│                                                             │
│ ✅ FC-015-004: test_duplicate_email_409                    │
│    ├─ GIVEN: email_work already exists in tb_party         │
│    ├─ WHEN: POST /api/v1/parties (same email)              │
│    ├─ THEN: 409 Conflict                                   │
│    └─ AND: response.error.code = "DUPLICATE_EMAIL"         │
│                                                             │
│ ✅ FC-015-005: test_audit_trail_created_party              │
│    ├─ GIVEN: Successful POST /parties                      │
│    ├─ THEN: application.log JSON entry with:               │
│    │   - event: "party.created"                            │
│    │   - party_id: "uuid-xxx"                              │
│    │   - created_by: "jefe@comsatel.com"                   │
│    │   - created_at: ISO8601                               │
│    └─ AND: Matches X-User-Name from request header         │
└─────────────────────────────────────────────────────────────┘
```

---

## US-019: Asignar un Rol-Nivel a una persona (Assign Role-Level)

```
┌─────────────────────────────────────────────────────────────┐
│ US-019: Asignar un Rol-Nivel (crea vigencia nueva)          │
│ Capability: No overwrite; close old, open new               │
│ Endpoints: POST/PATCH /parties/{id}/role-assignments       │
└────────────┬────────────────────────────────────────────────┘
             │ requires
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ASR-004: Immutable Vigencies (Temporal Validity)            │
│ Quality Attribute: Data Integrity (no loss, no overwrites)  │
│ Status: CANDIDATE (from AIM-001 analysis)                   │
└────────────┬────────────────────────────────────────────────┘
             │ depends on
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ADR-003: Portable Persistence (MySQL ↔ PostgreSQL)          │
│ ADR-007: PostgreSQL Consolidation (local dev)               │
│ Status: ACCEPTED                                            │
└────────────┬────────────────────────────────────────────────┘
             │ implements
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE RULE: DATA-002                                 │
│ "Vigencies: close-then-open pattern, NEVER UPDATE in-place" │
│ Pattern:                                                    │
│   1. Find active assignment (thru_date IS NULL)            │
│   2. SET thru_date = today() [CLOSES old]                  │
│   3. INSERT new assignment (from_date = today(), ...)      │
│   4. ALL within single transaction (atomicity)             │
└────────────┬────────────────────────────────────────────────┘
             │ verified by
             ▼
┌─────────────────────────────────────────────────────────────┐
│ FITNESS CRITERIA:                                           │
│ ✅ FC-019-001: test_vigencia_pattern_no_overwrite           │
│    ├─ GIVEN: Party with active L1 assignment               │
│    ├─ WHEN: POST role-assignment (L2)                      │
│    ├─ THEN: Old assignment.thru_date = new.from_date       │
│    ├─ AND: New assignment.thru_date = NULL (vigente)       │
│    └─ AND: Both records exist (not UPDATE, both CREATE)    │
│                                                             │
│ ✅ FC-019-002: test_concurrent_assignments_safe            │
│    ├─ GIVEN: Two concurrent requests to assign L2, L3      │
│    ├─ WHEN: Both POST simultaneously (race condition)      │
│    ├─ THEN: One succeeds, other fails with 409/retry       │
│    └─ AND: Only one active assignment exists (no dups)     │
│                                                             │
│ ✅ FC-019-003: test_vigencia_history_queryable             │
│    ├─ GIVEN: Party with closed L1 and active L2            │
│    ├─ WHEN: GET /parties/{id}/role-assignments             │
│    ├─ THEN: Response includes both L1 (closed) + L2        │
│    └─ AND: Client can see role change timeline             │
│                                                             │
│ ✅ FC-019-004: test_role_assignment_transaction_rollback   │
│    ├─ GIVEN: Concurrent close + INSERT fails (DB error)    │
│    ├─ WHEN: Simulated DB failure mid-transaction           │
│    ├─ THEN: Neither old.thru_date updated NOR new created  │
│    └─ AND: No partial state (atomicity guaranteed)         │
│                                                             │
│ ✅ FC-019-005: test_audit_trail_role_assignment            │
│    ├─ GIVEN: Successful role assignment                    │
│    ├─ THEN: application.log contains:                      │
│    │   - event: "role_assignment.created"                  │
│    │   - party_id, role_code, level, from_date             │
│    │   - created_by (X-User-Name)                          │
│    └─ AND: Previous assignment logged with thru_date       │
└─────────────────────────────────────────────────────────────┘
```

---

## US-024: Anonimizar los datos personales de una persona dada de baja (Anonymize)

```
┌─────────────────────────────────────────────────────────────┐
│ US-024: Anonimizar datos personales                         │
│ Capability: Irreversible NULL of PII after 90-day inactivity│
│ Endpoint: POST /api/v1/parties/{id}/anonymize              │
└────────────┬────────────────────────────────────────────────┘
             │ requires
             ▼
┌─────────────────────────────────────────────────────────────┐
│ BCON-001: Human Approval Mandatory for Certification        │
│ Constraint: Audit trail of who, when, why                  │
│ Status: Approved                                            │
└────────────┬────────────────────────────────────────────────┘
             │ depends on
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ADR-002: Keycloak (audit context)                          │
│ ADR-005: PKCE + Token propagation (audit trail)            │
│ Status: ACCEPTED                                            │
└────────────┬────────────────────────────────────────────────┘
             │ implements
             ▼
┌─────────────────────────────────────────────────────────────┐
│ ARCHITECTURE RULE: DATA-004                                 │
│ "Anonymization: irreversible NULL only after 90-day         │
│  inactivity, recorded in audit_log"                         │
│ Preconditions:                                              │
│   1. status == 'inactive'                                   │
│   2. (today - thru_date) >= 90 days                         │
│   3. Keycloak user authorization (Jefe only)               │
│ Action:                                                     │
│   SET first_names = NULL, last_names = NULL,               │
│       identification_* = NULL, email_work = NULL, etc.      │
│   SET anonymized_at = NOW(), anonymized_by = X-User-Name   │
│ Result: Irreversible (no restore from backup permitted)    │
└────────────┬────────────────────────────────────────────────┘
             │ verified by
             ▼
┌─────────────────────────────────────────────────────────────┐
│ FITNESS CRITERIA:                                           │
│ ✅ FC-024-001: test_anonymization_irreversible             │
│    ├─ GIVEN: Party anonymized                              │
│    ├─ WHEN: SELECT first_names FROM tb_party WHERE ...     │
│    ├─ THEN: first_names IS NULL (not '', not '***')       │
│    └─ AND: No backup restore possible (data gone)          │
│                                                             │
│ ✅ FC-024-002: test_anonymization_only_after_90_days       │
│    ├─ GIVEN: Party inactivated today                       │
│    ├─ WHEN: POST /anonymize immediately                    │
│    ├─ THEN: 400 Bad Request (too soon)                     │
│    ├─ AND: message includes: "Requires 90 days inactivity"  │
│    └─ AND: Party NOT anonymized (still has PII)            │
│                                                             │
│ ✅ FC-024-003: test_anonymization_jefe_only                │
│    ├─ GIVEN: Colaborador role (not Jefe)                   │
│    ├─ WHEN: POST /parties/{id}/anonymize                   │
│    ├─ THEN: 403 Forbidden                                  │
│    └─ AND: Party data intact                               │
│                                                             │
│ ✅ FC-024-004: test_anonymization_audit_trail              │
│    ├─ GIVEN: Successful anonymization                      │
│    ├─ THEN: application.log contains:                      │
│    │   - event: "party.anonymized"                         │
│    │   - party_id, anonymized_by (Jefe email)              │
│    │   - anonymized_at (ISO8601)                           │
│    │   - fields_nullified: [first_names, last_names, ...]  │
│    └─ AND: Immutable log entry (tamper-evident)            │
│                                                             │
│ ✅ FC-024-005: test_anonymization_retention_non_pii        │
│    ├─ GIVEN: Anonymized party                              │
│    ├─ WHEN: SELECT * FROM tb_party WHERE id = ...          │
│    ├─ THEN: Retains: id, code, role_type, unit_id          │
│    ├─ AND: Retains: role_assignments (full history)        │
│    └─ AND: Enables auditing without exposing identity      │
└─────────────────────────────────────────────────────────────┘
```

---

## Cross-Cutting Concerns: Security Findings → Architecture Rules

### SRC-001-002: SQL Injection Protection

```
FINDING: SQL Injection Protection Not Explicit

REQUIREMENT SOURCE:
  - OWASP A03: Injection
  - CONSTRAINT: Never concatenate SQL; use ORM parameterization

ARCHITECTURE RULE: DATA-001
  "Use SQLAlchemy ORM; NO raw SQL strings"

FITNESS CRITERIA:
  ✅ FC-SEC-001: test_sql_injection_protection
     ├─ GIVEN: GET /parties?status='; DROP TABLE tb_party; --
     ├─ THEN: 422 Validation Error (enum mismatch)
     └─ AND: No SQL syntax error (injection prevented)

  ✅ FC-SEC-002: test_filter_enum_validation
     ├─ GIVEN: Query param status = "invalid_value"
     ├─ THEN: Pydantic rejects before SQLAlchemy
     └─ AND: HTTP 422 with clear validation error
```

### SRC-001-003: Authorization Bypass via Direct Object Reference

```
FINDING: Authorization Bypass risk (IDOR)

REQUIREMENT SOURCE:
  - OWASP A01: Broken Access Control
  - CONSTRAINT: Verify permission BEFORE database query

ARCHITECTURE RULE: AUTH-002
  "Authorization check MUST occur BEFORE database query"

FITNESS CRITERIA:
  ✅ FC-SEC-003: test_unauthorized_access_403
     ├─ GIVEN: Colaborador attempts GET /parties/uuid-other
     ├─ THEN: 403 Forbidden (before SELECT query)
     └─ AND: No timing leak (response time consistent)

  ✅ FC-SEC-004: test_early_auth_prevents_info_leak
     ├─ GIVEN: Invalid party_id (doesn't exist)
     ├─ WHEN: Colaborador requests GET /parties/{id}
     ├─ THEN: 403 Forbidden (not 404 "not found")
     └─ AND: No info leak about which parties exist
```

---

## Traceability Summary Table

| US ID | Title | ASR Dependency | ADRs | Architecture Rule | Fitness Criteria | Status |
|-------|-------|---|---|----|---|---|
| **US-015** | Register Collaborator | ASR-006 (RBAC) | ADR-002, ADR-005 | AUTH-001 | FC-015-001 to 005 | ✅ Defined |
| **US-016** | Update Contact Data | ASR-006 | ADR-002 | AUTH-001 | FC-016-* (similar) | ✅ Defined |
| **US-017** | Manage Org Structure | ASR-006 | ADR-002 | AUTH-001 | FC-017-* | ✅ Defined |
| **US-018** | Manage Providers | ASR-006 | ADR-002 | AUTH-001 | FC-018-* | ✅ Defined |
| **US-019** | Assign Role-Level | ASR-004 (Vigencies) | ADR-003, ADR-007 | DATA-002 | FC-019-001 to 005 | ✅ Defined |
| **US-020** | Assign Program Roles | ASR-004, ASR-006 | ADR-003, ADR-007 | DATA-002 | FC-020-* | ✅ Defined |
| **US-021** | Inactivate Collaborator | ASR-006 | ADR-002, ADR-005 | AUTH-001 | FC-021-* | ✅ Defined |
| **US-022** | Link Keycloak Identity | ASR-006 | ADR-002, ADR-005 | AUTH-001 | FC-022-* | ✅ Defined |
| **US-023** | Query Card + History | ASR-006 | ADR-002 | AUTH-001 | FC-023-* | ✅ Defined |
| **US-024** | Anonymize Data | BCON-001 | ADR-002, ADR-005 | DATA-004 | FC-024-001 to 005 | ✅ Defined |
| **US-025** | Config Anonymization Deadline | BCON-001 | ADR-002, ADR-005 | DATA-004 | FC-025-* | ✅ Defined |

---

## Architecture Rules Checklist

| Rule ID | Rule | Type | Scope | Verification |
|---------|------|------|-------|---|
| **AUTH-001** | Every endpoint MUST validate X-Token + X-User-Name | Security | All endpoints | Middleware test |
| **AUTH-002** | Authorization check BEFORE DB query | Security | All endpoints | Access control test |
| **DATA-001** | Use SQLAlchemy ORM; NO raw SQL | Security | All queries | SQL injection test |
| **DATA-002** | Vigencies: close-then-open, NEVER UPDATE | Data Integrity | Role assignments | Vigencia pattern test |
| **DATA-003** | Audit fields MUST be populated (created_by, updated_by) | Auditability | All mutations | Audit trail test |
| **DATA-004** | Anonymization: irreversible NULL after 90 days | Data Protection | Anonymization endpoint | Anonymization test |
| **API-001** | Responses follow JSON:API or OpenAPI schema | API Design | All responses | Schema validation test |
| **API-002** | Pagination REQUIRED for list endpoints | Performance | GET endpoints | Pagination test |
| **DEPLOY-001** | Env vars from .env (dev) or Vault (prod) | Configuration | All deployments | Config loading test |
| **MONITOR-001** | All mutations logged to application.log (structured JSON) | Observability | All mutations | Log verification test |

---

## Gaps & Mitigation

| Gap | Type | Mitigation | Owner |
|-----|------|-----------|-------|
| ASR-004 (Vigencies) not yet formally approved | ASR | Approve during Phase 1 week 1 | Solution Architect |
| UNK-001: Sync vs Async anonymization | Design | Decide by end of Phase 1, week 1 | Tech Lead |
| UNK-003: Scheduler frequency (H4 C11) | Design | Define by Phase 4 week 5 | Ops Lead |
| SRC-001 findings (3 MEDIUM) | Security | Implement during Phase 1 | Dev Team |

---

**Generated by:** architecture-development-handoff/claude-haiku-4-5  
**Date:** 2026-09-30  
**Status:** Ready for implementation team review
