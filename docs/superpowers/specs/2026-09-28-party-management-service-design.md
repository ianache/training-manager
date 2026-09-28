---
title: Party Management Service — Implementation Design Spec
date: 2026-09-28
author: Jefe de Ingeniería + Design Team
status: approved
related: [API-SPEC-001, DCP-001, ADR-008, SRC-001]
---

# Party Management Service — Implementation Design Spec

**Document:** `2026-09-28-party-management-service-design.md`  
**Status:** ✅ APPROVED (Brainstorming: Architectural path completed)  
**Next Step:** Invoke `writing-plans` skill for detailed implementation roadmap

---

## 1. Overview

**What:** Implement SPEC-001 (Gestión de Colaboradores/Parties) as a single FastAPI microservice (`party-management-service`) using Python 3.11+.

**Why:** Centralized master data management for employees, contractors, organizations, and role assignments. Supports US-015 to US-025 (11 business capabilities).

**Who:** Backend team (Python/FastAPI developers). Frontend team will consume REST API.

**Success Criteria:**
- ✅ All 19 endpoints from API-SPEC-001 implemented
- ✅ Security review (SRC-001) findings remediated in Phase 1
- ✅ 6-week delivery: Phase 1a (Week 1) + Phase 1b (Week 2) + Phases 2-5 (Weeks 3-6)
- ✅ 100% test coverage (unit + integration + security)
- ✅ Performance: <1000ms for POST /parties, <500ms for GET /parties (1000 rows)
- ✅ Observability: Prometheus metrics + JSON logs + Grafana dashboards (Phase 5)

---

## 2. Architecture

### 2.1 Topology

**One Monolith:** `codebase/apps/domains/party-management-service/`

All 19 endpoints in single FastAPI application:
- PARTY (8 endpoints): POST, GET, PATCH, status, keycloak-link, history, anonymization, anonymize
- ORGANIZATION (5 endpoints): POST, GET, PATCH, hierarchy, tree
- ROLE-ASSIGNMENT (3 endpoints): POST, GET, PATCH
- PROGRAM-ROLE (3 endpoints): POST, GET, DELETE

**Rationale:** Simpler operations, centralized auth/logging, easier testing. If future complexity requires splitting, can refactor into async services.

### 2.2 Stack (Python/FastAPI — ADR-008)

| Component | Technology | Version | Rationale |
|-----------|---|---|---|
| **Runtime** | Python | 3.11+ | Type hints, long-term support |
| **Framework** | FastAPI | 0.100+ | Async, OpenAPI automatic, performance |
| **ORM** | SQLAlchemy | 2.0+ | Async support, type hints, prepared statements |
| **Validation** | Pydantic | 2.0+ | Runtime type checking, JSON schema |
| **Database** | PostgreSQL | 15+ | STD-DB-001 compliance, transactions |
| **Auth** | python-keycloak + PyJWT | Latest | OIDC integration, JWT validation |
| **Logging** | structlog + python-json-logger | Latest | Structured JSON logs |
| **Metrics** | prometheus-client | Latest | Prometheus format |
| **Testing** | pytest + httpx | Latest | Unit + integration + async tests |
| **Code Quality** | ruff + black | Latest | Linting + formatting |
| **Async HTTP** | aiohttp | Latest | Non-blocking requests |
| **Rate Limiting** | slowapi | 0.1.9+ | Anti-abuse controls |

### 2.3 Directory Structure

```
codebase/apps/domains/party-management-service/
├── app/
│   ├── main.py                    # FastAPI app + route registration
│   ├── config.py                  # Pydantic BaseSettings
│   ├── core/
│   │   ├── __init__.py
│   │   ├── auth.py                # Keycloak middleware
│   │   ├── authorization.py       # RBAC enforcement
│   │   ├── exceptions.py          # Custom HTTP exceptions
│   │   ├── dependencies.py        # Dependency injection
│   │   └── logging.py             # structlog setup
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                # SQLAlchemy declarative base
│   │   ├── party.py               # tb_party model
│   │   └── organization.py        # tb_organization (Phase 1b)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── party.py               # Pydantic DTO (request/response)
│   │   └── organization.py        # (Phase 1b)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── party_service.py       # Business logic
│   │   └── organization_service.py # (Phase 1b)
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── parties.py             # Endpoints: /api/v1/parties/*
│   │   └── organizations.py       # (Phase 1b)
│   └── database/
│       ├── __init__.py
│       ├── engine.py              # SQLAlchemy engine + session
│       └── migrations/            # Alembic scripts
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # pytest fixtures
│   ├── unit/
│   │   ├── __init__.py
│   │   ├── test_party_service.py
│   │   └── test_organization_service.py (Phase 1b)
│   ├── integration/
│   │   ├── __init__.py
│   │   ├── test_parties_api.py
│   │   └── test_organizations_api.py (Phase 1b)
│   └── security/
│       ├── __init__.py
│       ├── test_sql_injection.py
│       ├── test_authorization.py
│       └── test_rate_limiting.py
├── requirements.txt
├── pyproject.toml
├── Dockerfile
├── docker-compose.yml (optional, local dev)
├── .env.example
└── README.md
```

---

## 3. Core Components

### 3.1 Authentication & Authorization (ADR-002, ADR-005)

**Middleware: core/auth.py**

```python
async def get_current_user(request: Request) -> str:
    """Extract and validate JWT from HTTP-only cookie"""
    token = request.cookies.get("session")
    if not token:
        raise HTTPException(401, "Unauthorized")
    
    try:
        payload = jwt.decode(token, KEYCLOAK_PUBLIC_KEY, algorithms=["RS256"])
        return payload.get("preferred_username")
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidSignatureError:
        raise HTTPException(401, "Invalid token")
```

**RBAC: core/authorization.py**

```python
async def check_jefe_ingeniera(current_user: str = Depends(get_current_user)) -> str:
    """Verify user is Jefe de Ingeniería"""
    user_roles = await get_user_roles(current_user)  # From Keycloak
    if "jefe_ingeniera" not in user_roles:
        raise HTTPException(403, "Only Jefe de Ingeniería can perform this action")
    return current_user

async def check_party_access(
    party_id: UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Party:
    """Verify access to party (early check, before DB query — no timing attack)"""
    # Get user's party_id
    user_party = await db.execute(
        select(Party).where(Party.keycloak_uuid == current_user)
    )
    
    # RBAC
    user_roles = await get_user_roles(current_user)
    if "jefe_ingeniera" not in user_roles and user_party.pk_party_id != party_id:
        raise HTTPException(403, "Cannot access other party's data")
    
    # Now safe to query
    party = await db.get(Party, party_id)
    if not party:
        raise HTTPException(404, "Party not found")
    
    return party
```

**Keycloak Flow:**

1. Shell (Angular) → Keycloak PKCE flow
2. Keycloak → JWT in HTTP-only cookie (SameSite=Strict)
3. BFF validates JWT signature (from Keycloak public key)
4. BFF propagates X-User-Name header to microservices

### 3.2 Data Models (SQLAlchemy async)

**models/party.py**

```python
from sqlalchemy import Column, String, DateTime, UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Party(Base):
    __tablename__ = "tb_party"
    
    pk_party_id: UUID = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    code: str = Column(String(20), unique=True, nullable=False)
    first_names: str = Column(String(100), nullable=False)
    last_names: str = Column(String(100), nullable=False)
    preferred_name: Optional[str] = Column(String(100))
    identification_type: Optional[str] = Column(String(20))  # DNI, CE, Passport
    identification_number: Optional[str] = Column(String(30))
    identification_country: Optional[str] = Column(String(2))  # ISO 3166-1
    email_work: str = Column(String(255), unique=True, nullable=False, index=True)
    phone_work: Optional[str] = Column(String(20))
    party_type: str = Column(String(20), nullable=False)  # Employee | Contractor
    status: str = Column(String(20), default="active", index=True)  # active | inactive | anonymized
    created_by: str = Column(String(255), nullable=False)  # X-User-Name
    created_at: datetime = Column(DateTime, default=datetime.utcnow)
    updated_by: Optional[str] = Column(String(255))
    updated_at: Optional[datetime] = Column(DateTime, onupdate=datetime.utcnow)
    anonymized_at: Optional[datetime] = Column(DateTime)
    anonymized_by: Optional[str] = Column(String(255))
    
    __table_args__ = (
        Index("idx_tb_party_email_work", "email_work", postgresql_where=sa.text("status != 'anonymized'")),
        Index("idx_tb_party_status", "status"),
        Index("idx_tb_party_created_at", "created_at", desc=True),
    )
```

### 3.3 Validation & DTOs (Pydantic v2)

**schemas/party.py**

```python
from pydantic import BaseModel, EmailStr, Field, field_validator
from enum import Enum

class PartyType(str, Enum):
    EMPLOYEE = "Employee"
    CONTRACTOR = "Contractor"

class PartyCreateRequest(BaseModel):
    first_names: str = Field(..., min_length=1, max_length=100)
    last_names: str = Field(..., min_length=1, max_length=100)
    preferred_name: Optional[str] = None
    identification: dict = Field(...)  # type, number, country
    contact: dict = Field(...)  # email_work, phone_work
    role: PartyType
    unit_id: UUID
    direct_manager_id: Optional[UUID] = None
    provider_id: Optional[UUID] = None
    
    @field_validator("identification")
    def validate_identification(cls, v):
        if v.get("type") not in ["DNI", "CE", "Passport"]:
            raise ValueError("Invalid identification type")
        return v

class PartyResponseFull(BaseModel):
    """Full response (Jefe de Ingeniería)"""
    id: UUID
    code: str
    first_names: str
    last_names: str
    identification: dict
    email_work: str
    phone_work: Optional[str]
    # ... all fields

class PartyResponseLimited(BaseModel):
    """Limited response (Colaborador, self)"""
    id: UUID
    code: str
    first_names: str
    last_names: str
    email_work: str
    role: str
    unit_id: UUID
    # NO: identification, phone_work, keycloak_link, created_by
```

### 3.4 Business Logic (Services)

**services/party_service.py**

```python
class PartyService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, payload: PartyCreateRequest, current_user: str) -> Party:
        """Create party with validation and audit"""
        # 1. Validate email not duplicate
        existing = await self.db.execute(
            select(Party).where(
                (Party.email_work == payload.contact["email_work"]) &
                (Party.status != "anonymized")
            )
        )
        if existing.scalar():
            raise DuplicateEmailError("Email already registered")
        
        # 2. Validate identification not duplicate
        existing = await self.db.execute(
            select(Party).where(
                (Party.identification_number == payload.identification["number"]) &
                (Party.identification_country == payload.identification["country"]) &
                (Party.status != "anonymized")
            )
        )
        if existing.scalar():
            raise DuplicateIdentificationError("Identification already registered")
        
        # 3. Create party + default role assignment (atomic TX)
        async with self.db.begin():
            party = Party(
                code=str(uuid4())[:20],
                first_names=payload.first_names,
                email_work=payload.contact["email_work"],
                party_type=payload.role.value,
                created_by=current_user,
                created_at=datetime.utcnow()
            )
            self.db.add(party)
            await self.db.flush()  # Get party.id
            
            # Assign default level (BR-PRF-02)
            role_assignment = RoleAssignment(
                party_id=party.pk_party_id,
                role="Developer",
                level="Level 1",
                from_date=date.today(),
                thru_date=None,
                created_by=current_user
            )
            self.db.add(role_assignment)
        
        logger.info("party_created", party_id=party.pk_party_id, created_by=current_user)
        return party
```

### 3.5 API Endpoints (Routers)

**routers/parties.py**

```python
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/v1/parties", tags=["parties"])

@router.post("", status_code=201, response_model=PartyResponseFull)
async def create_party(
    payload: PartyCreateRequest,
    current_user: str = Depends(check_jefe_ingeniera),
    db: AsyncSession = Depends(get_db)
):
    """POST /api/v1/parties — Register new collaborator (US-015)"""
    service = PartyService(db)
    party = await service.create(payload, current_user)
    return party

@router.get("/{party_id}", response_model=Union[PartyResponseFull, PartyResponseLimited])
async def get_party(
    party_id: UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """GET /api/v1/parties/{id} — Consult party (US-023)"""
    party = await check_party_access(party_id, current_user, db)
    
    # Response filtering by visibility (P-52)
    user_roles = await get_user_roles(current_user)
    if "jefe_ingeniera" in user_roles:
        return PartyResponseFull(**party.dict())
    else:
        return PartyResponseLimited(**party.dict())

@router.get("", response_model=PaginatedResponse[PartyResponseLimited])
async def list_parties(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[PartyStatus] = None,
    unit_id: Optional[UUID] = None,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """GET /api/v1/parties?page=1&limit=20 — List parties (US-023)"""
    query = select(Party)
    
    if status:
        query = query.where(Party.status == status.value)
    if unit_id:
        query = query.where(Party.unit_id == unit_id)
    
    # Pagination
    result = await db.execute(query.limit(limit).offset((page - 1) * limit))
    parties = result.scalars().all()
    
    return PaginatedResponse(
        data=[PartyResponseLimited(**p.dict()) for p in parties],
        page=page,
        limit=limit,
        total=len(parties)
    )
```

---

## 4. Security & Compliance (SRC-001)

### 4.1 Remediation of SRC-001 Findings

| Finding | Remediation | Phase |
|---------|---|---|
| **SRC-001-001** (Rate limiting) | slowapi middleware + /config.py | Phase 1a |
| **SRC-001-002** (SQL injection) | Enum validation + test | Phase 1a |
| **SRC-001-003** (IDOR) | Early auth check + timing test | Phase 1a |
| **SRC-001-004** (PII visibility) | Separate schemas (Full/Limited) | Phase 1a |
| **SRC-001-005** (PII in logs) | Logging rules (no PII fields) | Phase 1a |

### 4.2 OWASP Top 10 Coverage

- ✅ A01: Broken Access Control — RBAC middleware
- ✅ A02: Cryptographic Failures — HTTP-only + TLS
- ✅ A03: Injection — SQLAlchemy ORM + Pydantic validation
- ✅ A04: Insecure Design — Keycloak OIDC
- ✅ A05: Security Misconfiguration — FastAPI defaults
- ✅ A06: Vulnerable Components — Python/FastAPI latest
- ✅ A07: Authentication Failures — Keycloak PKCE
- ✅ A08: Data Integrity Failures — Atomic transactions
- ✅ A09: Logging & Monitoring — structlog + Prometheus
- ✅ A10: SSRF — N/A (no external API calls)

---

## 5. Testing Strategy

### 5.1 Test Pyramid (Phase 1a: PARTY)

```
        /\
       /E2E\          Integration tests: end-to-end flows
      /------\
     /Integr.\       Integration: API endpoints + DB
    /---------\
   / Unit     /      Unit: services, models, schemas
  /-----------\
```

**Unit Tests** (tests/unit/test_party_service.py)
- `test_create_party_success` — Happy path
- `test_create_party_duplicate_email` — Validation error
- `test_create_party_duplicate_identification` — Validation error
- `test_create_party_generates_guid` — Code generation
- `test_list_parties_pagination` — Pagination logic

**Integration Tests** (tests/integration/test_parties_api.py)
- `test_post_parties_201` — POST /parties returns 201
- `test_post_parties_409_duplicate_email` — Conflict error
- `test_get_parties_200` — GET /parties returns 200
- `test_get_parties_pagination` — Pagination headers
- `test_get_parties_filter_by_status` — Filtering

**Security Tests** (tests/security/)
- `test_sql_injection_protection` — Enum validation blocks injection
- `test_authorization_403` — Colaborador cannot POST
- `test_rate_limiting_429` — 429 after limit exceeded
- `test_http_only_cookie` — Set-Cookie: HttpOnly flag

**Performance Tests**
- `test_post_parties_lt_1000ms` — <1000ms for POST
- `test_get_parties_1000_rows_lt_500ms` — <500ms for large GET

### 5.2 Test Fixtures (conftest.py)

```python
@pytest.fixture
async def async_client():
    """FastAPI test client"""

@pytest.fixture
async def db_session():
    """In-memory SQLite session"""

@pytest.fixture
def jefe_token():
    """Valid JWT for Jefe de Ingeniería"""

@pytest.fixture
def colaborador_token():
    """Valid JWT for Colaborador"""
```

---

## 6. 6-Week Roadmap

| Semana | Fase | Endpoints | Estimated Hours | Acceptance |
|--------|------|-----------|---|---|
| **1** | **Phase 1a (PARTY)** | POST, GET, GET/{id}, PATCH /parties | 40h | Unit + Integration tests passing |
| **2** | **Phase 1b (ORGANIZATION)** | POST, GET, GET/{id}, PATCH, tree /organizations | 30h | Integration tests passing |
| **3** | **Phase 2 (ROLE-ASSIGNMENT)** | POST, GET, PATCH /role-assignments | 25h | Vigencia tests passing |
| **4** | **Phase 3 (KEYCLOAK-LINK)** | PATCH, DELETE, GET /keycloak-link | 20h | E2E test: login → party → link |
| **5** | **Phase 4 (ANONYMIZATION)** | PATCH /status, POST /anonymize + scheduler | 25h | Anonimización irreversible validated |
| **6** | **Phase 5 (OBSERVABILITY)** | Prometheus metrics, JSON logs, Grafana | 20h | Dashboards live + health checks |

**Total:** ~160 hours (4 developers × 6 weeks = 120 hours budgeted; 40h buffer)

---

## 7. Implementation Approach (Phase 1a: PARTY)

**Week 1 Breakdown:**

| Day | Task | Hours | Deliverable |
|-----|------|-------|---|
| **Mon** | Scaffolding + cookiecutter + setup | 8h | Repo ready, CI green |
| **Tue-Wed** | Models (tb_party) + schemas (Pydantic) | 12h | Models tested, migration ready |
| **Wed-Thu** | Services (create, list, get, update) | 12h | Business logic tested, 80%+ coverage |
| **Thu-Fri** | Routers + security remediation | 8h | Endpoints working, SRC-001 findings fixed |

---

## 8. Success Criteria & Sign-Off

**Phase 1a Complete When:**
- ✅ All 4 PARTY endpoints implemented (POST, GET, GET/{id}, PATCH)
- ✅ Comprehensive test suite (unit + integration + security) ≥80% coverage
- ✅ SRC-001 security findings remediated (5 issues)
- ✅ Performance tests passing (<1000ms, <500ms)
- ✅ Observability (structlog logging + prometheus metrics)
- ✅ CI/CD pipeline green (lint, test, build)
- ✅ README + setup guide complete
- ✅ Code review + approval from Tech Lead

**Sign-off by:** Jefe de Ingeniería + Tech Lead

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **Keycloak integration delays** | Medium | High | Use mock token in tests; dev env has local Keycloak (docker-compose) |
| **PostgreSQL async driver issues** | Low | High | Unit tests with in-memory SQLite; integration tests with real PG |
| **Rate limiting complexity** | Low | Medium | slowapi library handles it; tests validate behavior |
| **Vigencia logic edge cases** | Medium | Medium | Dedicated tests for close/open scenarios; atomic transactions |
| **Team unfamiliar with FastAPI** | Medium | Medium | Code review + pair programming first 3 days; templates provided |

---

## 10. Deliverables & Handoff

**Code:**
- ✅ `codebase/apps/domains/party-management-service/` (complete, tested)
- ✅ Dockerfile + docker-compose.yml
- ✅ GitHub Actions CI pipeline

**Documentation:**
- ✅ README.md (setup, running tests, development)
- ✅ API docs (auto-generated OpenAPI via FastAPI)
- ✅ Architecture decision log (this spec)

**Testing:**
- ✅ Unit tests: 80%+ coverage
- ✅ Integration tests: all happy + error paths
- ✅ Security tests: SRC-001 remediation verified

**Handoff To:**
- Frontend team: REST API ready, OpenAPI docs at /docs
- QA team: test setup ready, test fixtures available
- DevOps team: Dockerfile + docker-compose ready for staging

---

## Sign-Off

**Approved by:** Jefe de Ingeniería (ianache@comsatel.com)  
**Date:** 2026-09-28  
**Next Step:** Invoke `writing-plans` skill for detailed implementation tasks & timeline

---

**This spec is READY FOR IMPLEMENTATION. Proceed with Phase 1a (Week 1: PARTY endpoints).**
