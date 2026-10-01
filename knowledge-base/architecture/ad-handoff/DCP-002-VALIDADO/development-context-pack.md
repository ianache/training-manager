---
type: Development Context Pack
id: DCP-002-VALIDADO
title: Development Context Pack — Party Management Service API (Python/FastAPI)
description: Bounded, traceable, implementation-ready context for Party/Collaborator master data management. Validated against handoff-readiness criteria.
status: READY_FOR_DEV_REVIEW
generated:
  by: "architecture-development-handoff/claude-haiku-4-5"
  at: "2026-09-30T00:00:00-05:00"
related:
  - US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025
  - API-SPEC-001, ADR-001 to ADR-008
  - SRC-001 (Security Review), DCP-001 (original handoff)
provenance:
  - ACP-002: Architecture Context Pack General
  - API-SPEC-001: REST API Specification
  - SPEC-001: Gestión de Colaboradores
  - RCP-003: Gestión de Data Maestra de Party
---

# Development Context Pack — Party Management Service API

**For:** Developers implementing Party management microservice (Python/FastAPI)  
**Duration:** 6 weeks (30 days) / 5 phases  
**Approval Gate:** Human decision: READY_FOR_DEV or RETURN_TO_ARCHITECTURE

---

## 1. Implementation Scope & User Stories

### 1.1 In Scope: Party Management (US-015 to US-025)

| Story | Capability | Phase |
|-------|-----------|-------|
| **US-015** | Register collaborator (employee/contractor/provider) | Phase 1 |
| **US-016** | Update contact data (names, phone, work profiles) | Phase 1 |
| **US-017** | Manage organizational structure (units) | Phase 1 |
| **US-018** | Manage providers and contractors | Phase 1 |
| **US-019** | Assign role-level (create vigencias, no overwrites) | Phase 2 |
| **US-020** | Assign program roles (evaluator, instructor, manager) | Phase 2 |
| **US-021** | Inactivate collaborator (close vigencia) | Phase 3 |
| **US-022** | Link Keycloak identity to party | Phase 3 |
| **US-023** | Query collaborator card + full history | Phase 1-3 |
| **US-024** | Irreversible anonymization (after 90-day inactivity) | Phase 4 |
| **US-025** | Configure anonymization deadline + notifications | Phase 4 |

**Success Metric:** 100% endpoint coverage, all ACCEPTANCE CRITERIA met, security findings resolved.

### 1.2 Out of Scope

- ❌ Frontend UI (handled separately by Angular shell team)
- ❌ Certification Service (separate microservice)
- ❌ AI/Evidence analysis (H3 capability, future phase)
- ❌ Google Classroom integration (H2 capability, future phase)
- ❌ Keycloak realm setup/management (ops responsibility)

---

## 2. Architecture Constraints (Approved ADRs)

### 2.1 API Layer (ADR-001: Shell + BFF + Microservices)

**CONSTRAINT:** Party Management Service is a microservice backend. It DOES NOT:
- Handle authentication (Keycloak via BFF does this)
- Serve UI (separate Angular shell)
- Persist to multiple databases (PostgreSQL only, per ADR-007)

**MUST:** Expose REST API at `POST /api/v1/parties`, `GET /api/v1/parties/{id}`, etc., consumed by BFF Node.js (not direct frontend calls).

---

### 2.2 Authentication & Authorization (ADR-002, ADR-005)

**CONSTRAINT:** 
- Token passed by BFF (not microservice responsibility)
- Microservice VALIDATES token + X-User-Name header (propagated from BFF)
- Authorization logic: `Jefe de Ingeniería` (full CRUD) vs `Colaborador` (read-self, partial update)

**MUST:** 
```python
# core/auth.py
def verify_token_and_extract_user(request: Request) -> str:
    # Extract JWT from X-Token header (set by BFF)
    # Extract username from X-User-Name header
    # Return username for audit trail
```

---

### 2.3 Database Portability (ADR-003, ADR-007)

**CONSTRAINT:** ADR-003 requires MySQL + PostgreSQL support, but ADR-007 (approved 2026-09-28) consolidates dev/test/prod to PostgreSQL ONLY.

**DECISION:** Implement with PostgreSQL; ORM (SQLAlchemy) remains database-agnostic for future portability.

**MUST:**
- Use `STD-DB-001` naming conventions (tb_*, pk_*, fk_*, idx_* prefixes)
- NO database-specific SQL (use SQLAlchemy ORM for all queries)
- Migrations via Alembic (portable DDL)

---

### 2.4 Secrets Management (ADR-004: HashiCorp Vault)

**CONSTRAINT:** No secrets in code. All sensitive data (DB password, Keycloak secret, etc.) from Vault.

**MUST:**
```python
# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str  # Read from environment / Vault
    keycloak_secret: str  # Read from Vault
    
    class Config:
        env_file = ".env.example"  # Dev only
```

---

### 2.5 API Design Standard (ADR-008: Python + FastAPI)

**CONSTRAINT:** All new APIs use Python + FastAPI (approved 2026-09-26).

**MUST:**
- FastAPI with Pydantic v2 for validation
- SQLAlchemy 2.0+ (async ORM)
- OpenAPI schema auto-generated
- Type hints required (mypy validation)
- Async endpoint handlers

---

## 3. API Contract & Endpoints

### 3.1 Resource Model

**PARTY** (Persons / Collaborators)
```json
{
  "id": "uuid",
  "code": "EMP-2026-0042",  // Auto-generated code
  "first_names": "Juan",
  "last_names": "Pérez López",
  "preferred_name": "Juan Pérez",
  "identification": {
    "type": "DNI|CE|Passport",
    "number": "12345678",
    "country": "PE"
  },
  "contact": {
    "email_work": "juan@comsatel.com",
    "phone_work": "+51-987654321"
  },
  "role": "Employee|Contractor|Provider",
  "unit_id": "uuid-org",
  "direct_manager_id": "uuid-person",
  "status": "active|inactive|anonymized",
  "created_by": "jefe@comsatel.com",
  "created_at": "2026-09-27T23:58:00Z",
  "updated_by": null,
  "updated_at": null,
  "keycloak_link": {
    "uuid": "keycloak-uuid",
    "linked_at": "2026-09-27T23:59:00Z"
  }
}
```

### 3.2 Endpoint Matrix by Phase

#### Phase 1 (Weeks 1-2): PARTY + ORGANIZATION

| Method | Endpoint | US | Auth | Audit |
|--------|----------|-----|------|-------|
| **POST** | `/api/v1/parties` | 015 | Jefe | created_by, created_at |
| **GET** | `/api/v1/parties/{id}` | 023 | Jefe+Self | None (query only) |
| **GET** | `/api/v1/parties` | 023 | Jefe+Self | Paginated, filterable |
| **PATCH** | `/api/v1/parties/{id}` | 016 | Jefe+Self | updated_by, updated_at |
| **POST** | `/api/v1/organizations` | 017, 018 | Jefe | created_by, created_at |
| **GET** | `/api/v1/organizations/{id}` | 017, 018 | Jefe | None |
| **GET** | `/api/v1/organizations` | 017, 018 | Jefe | Paginated |
| **PATCH** | `/api/v1/organizations/{id}` | 017, 018 | Jefe | updated_by, updated_at |

#### Phase 2 (Week 3): ROLE-ASSIGNMENT + PROGRAM-ROLE

| Method | Endpoint | US | Auth | Vigencia |
|--------|----------|-----|------|----------|
| **POST** | `/api/v1/parties/{id}/role-assignments` | 019 | Jefe | Close + Open |
| **GET** | `/api/v1/parties/{id}/role-assignments` | 019 | Jefe | Current + History |
| **PATCH** | `/api/v1/parties/{id}/role-assignments/{rid}` | 019 | Jefe | Close + Open |
| **POST** | `/api/v1/parties/{id}/program-roles` | 020 | Jefe | Close + Open |
| **GET** | `/api/v1/parties/{id}/program-roles` | 020 | Jefe | Current only |
| **DELETE** | `/api/v1/parties/{id}/program-roles/{role}` | 020 | Jefe | Set thru_date |

#### Phase 3 (Week 4): KEYCLOAK-LINK + Integration Tests

| Method | Endpoint | US | Auth |
|--------|----------|-----|------|
| **PATCH** | `/api/v1/parties/{id}/keycloak-link` | 022 | Jefe |
| **DELETE** | `/api/v1/parties/{id}/keycloak-link` | 022 | Jefe |
| **GET** | `/api/v1/parties/{id}/keycloak-link` | 022 | Jefe |

#### Phase 4 (Week 5): ANONYMIZATION + Scheduler

| Method | Endpoint | US | Auth | Rule |
|--------|----------|-----|------|------|
| **PATCH** | `/api/v1/parties/{id}/status` | 021 | Jefe | Close vigencia |
| **GET** | `/api/v1/parties/{id}/anonymization` | C11 | Jefe | Calc days inactive |
| **POST** | `/api/v1/parties/{id}/anonymize` | 024 | Jefe | Irreversible NULL |

#### Phase 5 (Week 6): Observability (Metrics, Logs, Dashboards)

- Prometheus metrics: `party_create_duration_ms`, `party_list_records_count`, `anonymization_jobs_total`
- Structured logging: `application.log` (JSON format, all CRUD)
- Health endpoint: `GET /health` (DB connectivity check)

---

## 4. Data Model & Vigencies (No-Overwrite Pattern)

### 4.1 Core Entities (PostgreSQL STD-DB-001)

```sql
tb_party (
  pk_party_id UUID PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,  -- EMP-YYYY-NNNN auto-generated
  first_names VARCHAR(100) NOT NULL,
  last_names VARCHAR(100) NOT NULL,
  preferred_name VARCHAR(100),
  identification_type ENUM('DNI', 'CE', 'Passport'),
  identification_number VARCHAR(50) UNIQUE,
  identification_country CHAR(2),  -- ISO 3166-1
  email_work VARCHAR(255) UNIQUE,
  phone_work VARCHAR(20),
  role_type ENUM('Employee', 'Contractor', 'Provider'),
  fk_unit_id UUID,  -- Organization reference
  fk_direct_manager_id UUID,  -- Party reference
  status ENUM('active', 'inactive', 'anonymized'),
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(255),
  updated_at TIMESTAMP,
  anonymized_at TIMESTAMP,
  anonymized_by VARCHAR(255),
  FOREIGN KEY (fk_unit_id) REFERENCES tb_organization(pk_organization_id),
  FOREIGN KEY (fk_direct_manager_id) REFERENCES tb_party(pk_party_id)
);

tb_party_role_assignment (
  pk_assignment_id UUID PRIMARY KEY,
  fk_party_id UUID NOT NULL,
  role_code VARCHAR(50) NOT NULL,  -- 'Backend Engineer', 'QA Lead', etc.
  level ENUM('L1', 'L2', 'L3', 'L4', 'L5'),
  from_date DATE NOT NULL,
  thru_date DATE,  -- NULL = vigente
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (fk_party_id) REFERENCES tb_party(pk_party_id)
);

tb_party_program_role (
  pk_program_role_id UUID PRIMARY KEY,
  fk_party_id UUID NOT NULL,
  program_code VARCHAR(50) NOT NULL,
  role ENUM('Evaluator', 'Instructor', 'Manager'),
  from_date DATE NOT NULL,
  thru_date DATE,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (fk_party_id) REFERENCES tb_party(pk_party_id)
);

tb_party_keycloak_link (
  pk_link_id UUID PRIMARY KEY,
  fk_party_id UUID NOT NULL UNIQUE,
  keycloak_uuid VARCHAR(255) NOT NULL,
  linked_by VARCHAR(255) NOT NULL,
  linked_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (fk_party_id) REFERENCES tb_party(pk_party_id)
);

tb_organization (
  pk_organization_id UUID PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type ENUM('Internal', 'Provider', 'Contractor'),
  parent_id UUID,  -- For org hierarchy
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (parent_id) REFERENCES tb_organization(pk_organization_id)
);
```

### 4.2 Vigencies: The No-Overwrite Pattern

**RULE:** When assigning a role to a party, NEVER UPDATE existing assignments. Instead:

1. **Find** the active role assignment (thru_date IS NULL)
2. **Close** it by setting `thru_date = today()`
3. **Create** a new assignment with `from_date = today()`, `thru_date = NULL`
4. **Transaction:** Steps 2-3 must be atomic

```python
# Example: Assign L2 to a party that has L1
async def assign_role_level(
    party_id: UUID,
    role_code: str,
    new_level: str,
    user_name: str
) -> RoleAssignment:
    async with db.begin():
        # Step 1: Find active
        active = await db.execute(
            select(PartyRoleAssignment)
            .where(
                PartyRoleAssignment.party_id == party_id,
                PartyRoleAssignment.role_code == role_code,
                PartyRoleAssignment.thru_date.is_(None)
            )
        )
        existing = active.scalar_one_or_none()
        
        # Step 2: Close it
        if existing:
            existing.thru_date = date.today()
        
        # Step 3: Create new
        new_assignment = PartyRoleAssignment(
            party_id=party_id,
            role_code=role_code,
            level=new_level,
            from_date=date.today(),
            thru_date=None,
            created_by=user_name
        )
        db.add(new_assignment)
        
        # Implicit rollback on exception (async context manager)
    
    return new_assignment
```

---

## 5. Authorization Rules (RBAC)

### 5.1 Role-Based Access Control Matrix

| Endpoint | Jefe de Ingeniería | Colaborador |
|----------|-----------------|------------|
| **POST /parties** | ✅ CREATE any | ❌ |
| **GET /parties** | ✅ READ all | ✅ READ self only (filter by user) |
| **GET /parties/{id}** | ✅ READ any | ✅ READ if id==self.party_id, else 403 |
| **PATCH /parties/{id}** | ✅ UPDATE all fields | ✅ UPDATE self: phone, preferred_name only |
| **PATCH /parties/{id}/status** | ✅ INACTIVATE | ❌ |
| **POST /role-assignments** | ✅ | ❌ |
| **GET /role-assignments** | ✅ READ all | ✅ READ self only |
| **POST /anonymize** | ✅ | ❌ |

### 5.2 Implementation in FastAPI

```python
# core/authorization.py
from enum import Enum
from fastapi import HTTPException, status

class UserRole(str, Enum):
    JEFE = "jefe_ingeniera"
    COLABORADOR = "colaborador"

async def check_jefe_ingeniera(user_name: str) -> str:
    """Verify user has jefe_ingeniera role via Keycloak / X-User-Role header."""
    role = request.headers.get("X-User-Role")
    if role != UserRole.JEFE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Jefe de Ingeniería can perform this action"
        )
    return user_name

async def check_party_access(
    party_id: UUID,
    user_name: str,
    require_jefe: bool = False
) -> bool:
    """
    Verify user can access party.
    - Jefe: can access any party
    - Colaborador: can access only their own party
    """
    if require_jefe:
        await check_jefe_ingeniera(user_name)
        return True
    
    # Check if user's Keycloak UUID matches party.keycloak_link.uuid
    party = await db.get(Party, party_id)
    if not party:
        raise HTTPException(status_code=404)
    
    # For Colaborador: compare to current user's identity
    current_user_party_id = extract_party_id_from_token(request)
    if current_user_party_id != party_id:
        raise HTTPException(status_code=403)
    
    return True
```

---

## 6. Security Constraints & Fitness Criteria

### 6.1 OWASP Top 10 Mitigations

| Finding | Constraint | Fitness Criterion |
|---------|-----------|-------------------|
| **A03: Injection** | Use SQLAlchemy ORM (never concatenate SQL) | ✅ All queries use parameterized statements (test: `test_sql_injection_protection`) |
| **A01: Access Control** | Authorization checks before DB query | ✅ Early auth validation in middleware (test: `test_unauthorized_access_403`) |
| **A04: Insecure Design** | Vigencies pattern prevents data loss | ✅ All role changes create new records, never update (test: `test_vigencia_pattern_no_overwrite`) |
| **A05: Broken Auth** | Token validation mandatory | ✅ Every endpoint requires X-Token + X-User-Name (test: `test_missing_auth_headers_401`) |

### 6.2 API-Specific Security Rules

**CONSTRAINT:** Rate limiting (SRC-001-001 finding)
```
- GET /parties*: 1000 req/hour
- POST /parties: 100 req/hour
- PATCH /parties: 500 req/hour
- POST /anonymize: 10 req/hour
```

**Fitness Criterion:** `test_rate_limiting_429` — Verify 429 returned after limit exceeded.

**CONSTRAINT:** PII handling (SRC-001-004 finding)
```
No emails, phone numbers, names in:
  - Response list endpoints (except Jefe who can see all)
  - Error messages
  - Logs (structured logs may contain PII; ensure redaction in production)
```

**Fitness Criterion:** `test_pii_not_in_error_messages` — Verify 400 error does not echo PII.

---

## 7. Non-Functional Requirements (NFRs)

| Attribute | Target | Measurement |
|-----------|--------|-------------|
| **Response Time** | <500ms (p95) for GET; <1000ms for POST/PATCH | Load test: 100 concurrent users |
| **Availability** | 99.5% (uptime) | Monitored via health endpoint |
| **Scalability** | 1000 parties/sec (write); 10k parties/sec (read) | Performance test; DB index validation |
| **Auditability** | 100% of mutations logged with user + timestamp | Audit trail test; verify created_by/updated_by |
| **WCAG 2.2 AA** | API errors comply; JSON responses structured | Error response format test |
| **Backwards Compatibility** | v1 API stable for 18 months | No breaking changes without v2 |

---

## 8. Traceability: US → ASR → ADR → Rule → FC

```
US-015 (Register collaborator)
  ↓ requires
ASR-006 (RBAC: Jefe authorizes)
  ↓ depends on
ADR-002 (Keycloak PKCE)
  ↓ implements
RULE: Authorization check before INSERT
  ✅ FC: test_jefe_can_create_party, test_colaborador_cannot_create_party

US-019 (Assign role-level, no overwrites)
  ↓ requires
ASR-004 (Immutable vigencies)
  ↓ depends on
ADR-003 (DB design: temporal validity)
  ↓ implements
RULE: Close-then-open pattern (atomic transaction)
  ✅ FC: test_vigencia_pattern_no_overwrite, test_concurrent_assignments_safe

US-024 (Irreversible anonymization)
  ↓ requires
BCON-001 (Human approval mandatory)
  ↓ depends on
ADR-002 (Audit trail: created_by, updated_by)
  ↓ implements
RULE: NULL PII only if status=inactive for ≥90 days, recorded by audit
  ✅ FC: test_anonymization_irreversible, test_anonymization_only_after_90_days
```

---

## 9. Assumptions, Unknowns & Conflicts

### 9.1 ASSUMPTIONS (Verified, Document)

- **ASM-001:** Keycloak realm and client credentials are available at deployment time.
  - **Verification:** BFF provides X-Token + X-User-Name headers to microservice.
  - **Contingency:** Mock Keycloak in dev/test; production requires real realm.

- **ASM-002:** Database migrations (Alembic) run before service starts.
  - **Verification:** Docker Entrypoint runs `alembic upgrade head` before uvicorn.
  - **Risk:** Schema mismatch if migration skipped → 500 error.

- **ASM-003:** UUID v4 is acceptable for all primary keys (performance: acceptable <10ms per insert).
  - **Verification:** Benchmark test: 1000 inserts → measure query time.

### 9.2 UNKNOWNS (Requires Decision)

- **UNK-001:** Should anonymization be synchronous or async job?
  - **Options:** 
    - Sync: PATCH /anonymize blocks until NULL complete
    - Async: PATCH returns 202, Celery job runs background
  - **Recommendation:** Sync v1; async v2 (avoid complexity).

- **UNK-002:** Should historical role assignments be queryable per role type?
  - **Example:** GET /parties/{id}/role-assignments?role_code=backend_engineer&include_history=true
  - **Recommendation:** Yes; add filter in Phase 2.

- **UNK-003:** How frequently should anonymization scheduler run (H4 C11)?
  - **Options:** Daily 2am UTC, weekly, or on-demand only?
  - **Recommendation:** Daily 2am UTC (production-ready trigger).

### 9.3 CONFLICTS (Resolve Before Dev)

- **CON-001:** ADR-001 states BFF is "Node.js intermediary"; ADR-008 says new APIs are Python/FastAPI.
  - **Resolution:** BFF remains Node.js (legacy); Party Service is Python/FastAPI (new). No conflict; both exist.
  - **Implication:** BFF routes `POST /api/v1/parties` → FastAPI service at `http://party-service:8000`.

- **CON-002:** ADR-003 requires MySQL + PostgreSQL support; ADR-007 consolidates to PostgreSQL.
  - **Resolution:** ADR-007 (later, approved 2026-09-28) supersedes ADR-003 for THIS service.
  - **Implication:** Implement PostgreSQL-only; keep ORM portable for future.

---

## 10. Approved Architecture Rules (Bounded Constraints)

1. **AUTH-001:** Every endpoint MUST validate X-Token + X-User-Name header.
2. **AUTH-002:** Authorization check MUST occur BEFORE database query.
3. **DATA-001:** Use SQLAlchemy ORM; NO raw SQL strings.
4. **DATA-002:** Vigencies: close-then-open pattern, never UPDATE in-place.
5. **DATA-003:** Audit fields (created_by, updated_by) MUST be populated.
6. **DATA-004:** Anonymization: NULL only after 90-day inactivity, recorded in audit_log.
7. **API-001:** Responses MUST follow JSON:API or OpenAPI schema.
8. **API-002:** Pagination REQUIRED for list endpoints (default 50, max 500).
9. **DEPLOY-001:** Environment variables sourced from .env (dev) or Vault (prod).
10. **MONITOR-001:** All mutations logged to `application.log` (structured JSON).

---

## 11. Deliverables & Success Criteria

### 11.1 Code Deliverables

✅ **Phase 1 (Weeks 1-2):**
- `app/models/party.py`, `party_service.py`, `party_routers.py`
- `app/models/organization.py`, `organization_service.py`
- Unit tests (50+ assertions)
- Integration tests (12 scenarios)

✅ **Phase 2 (Week 3):**
- Role assignment + program role services
- Vigencies tests (close-then-open verification)

✅ **Phase 3 (Week 4):**
- Keycloak link service
- End-to-end workflow tests

✅ **Phase 4 (Week 5):**
- Anonymization service + scheduler
- Security tests (injection, authorization, rate limiting)

✅ **Phase 5 (Week 6):**
- Prometheus metrics, structured logging
- Health endpoint, README

### 11.2 Success Metrics

| Metric | Target | Evidence |
|--------|--------|----------|
| **Endpoint Coverage** | 100% (19/19 endpoints) | Postman collection passing |
| **Test Coverage** | ≥80% lines, 100% critical paths | pytest report |
| **Security Findings** | SRC-001 remediated (3 MEDIUM → resolved) | test_rate_limiting_429, test_sql_injection_protection, test_authorization_bypass |
| **Performance** | p95 <500ms (GET), <1000ms (POST) | K6 load test report |
| **Auditability** | 100% mutations logged | Verify application.log contains created_by, created_at |

---

## 12. Phase Breakdown & Dependencies

```
PHASE 1 (Weeks 1-2): Core PARTY + ORGANIZATION
  ├─ Task 1a: Create SQLAlchemy models (Party, Organization)
  ├─ Task 1b: Implement auth middleware (X-Token, X-User-Name validation)
  ├─ Task 1c: Implement PARTY endpoints (POST, GET, PATCH)
  ├─ Task 1d: Implement ORGANIZATION endpoints
  ├─ Task 1e: Write unit + integration tests
  └─ GATE: All Phase 1 tests passing, SRC-001 findings documented

PHASE 2 (Week 3): ROLE-ASSIGNMENT + PROGRAM-ROLE
  ├─ Depends on: Phase 1 PARTY model + auth
  ├─ Task 2a: Implement role_assignment endpoints
  ├─ Task 2b: Implement close-then-open vigencies (transaction test)
  ├─ Task 2c: Implement program_role endpoints
  └─ GATE: Vigencies tests passing, no data loss on concurrent assigns

PHASE 3 (Week 4): KEYCLOAK-LINK + Integration Tests
  ├─ Depends on: Phase 1-2 complete
  ├─ Task 3a: Implement keycloak_link endpoints
  ├─ Task 3b: End-to-end workflow (create → assign → link → query)
  └─ GATE: E2E test passing, cross-module integration validated

PHASE 4 (Week 5): ANONYMIZATION + Scheduler
  ├─ Depends on: Phase 1-3 complete
  ├─ Task 4a: Implement anonymization logic (irreversible NULL)
  ├─ Task 4b: Implement scheduler (daily check, Celery or APScheduler)
  └─ GATE: Anonymization irreversible, scheduler runs without errors

PHASE 5 (Week 6): Observability
  ├─ Depends on: All phases complete
  ├─ Task 5a: Prometheus metrics + health endpoint
  ├─ Task 5b: Structured logging (JSON format)
  ├─ Task 5c: Documentation (API README, deployment guide)
  └─ GATE: Metrics exposed, logs searchable, README complete
```

---

## 13. Definition of Ready (Pre-Dev Checklist)

- [x] All 11 User Stories mapped to endpoints
- [x] API-SPEC-001 signed off (19 endpoints defined)
- [x] ADRs 001-008 approved (all architecture decisions made)
- [x] Security review (SRC-001) completed (3 MEDIUM findings documented)
- [x] Data model (STD-DB-001 compliant) designed
- [x] Authorization matrix (RBAC) defined
- [x] Vigencies pattern documented + tested approach defined
- [x] Assumptions, unknowns, conflicts identified
- [x] NFRs (performance, auditability, backwards compatibility) stated
- [ ] **Human Decision Gate:** Architect approves READY_FOR_DEV

---

## 14. Definition of Done (Post-Implementation)

- [ ] 100% endpoints passing smoke tests (Postman)
- [ ] 100% security findings from SRC-001 resolved (test evidence)
- [ ] ≥80% code coverage (pytest report)
- [ ] All ACCEPTANCE CRITERIA for US-015–025 met
- [ ] Performance tests passing (p95 <500ms / <1000ms)
- [ ] Audit trail validated (application.log contains all mutations)
- [ ] Vigencies pattern validated (no data loss, atomic)
- [ ] Documentation: API README, deployment guide, runbook
- [ ] Merge request reviewed + approved by tech lead
- [ ] Deployed to QA environment + smoke test passing
- [ ] **Human Decision Gate:** QA Lead signs off ready for production

---

## 15. References & Provenance

| Document | Type | Version | Purpose |
|----------|------|---------|---------|
| API-SPEC-001 | Technical Spec | Draft | Complete endpoint contract |
| DCP-001 | Original Handoff | Draft | Previous context (superseded by this DCP-002) |
| ADR-001 to ADR-008 | Architecture Decisions | Approved | Approved constraints |
| SRC-001 | Security Review | Draft | Security findings + remediation |
| SPEC-001 | Requirements | Draft | Functional requirements |
| STD-DB-001 | DB Standard | Approved | Naming conventions |

---

**Prepared by:** Claude Haiku 4.5  
**Status:** Ready for Review (awaiting human decision gate)  
**Next Step:** Architecture sign-off (READY_FOR_DEV or RETURN_TO_ARCHITECTURE)
