# Phase 1b: Organization Management — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 5 ORGANIZATION endpoints (POST, GET, GET/{id}, PATCH, GET tree) with hierarchical structure, similar to Phase 1a but handling parent-child org relationships.

**Architecture:** Same monolith as Phase 1a. New model `Organization` (tb_organization) with `parent_org_id` for hierarchy. Response filtering by role (same as PARTY). Atomic transactions for all writes.

**Tech Stack:** Python 3.11+, FastAPI, SQLAlchemy async, Pydantic v2, pytest

**Spec:** `docs/superpowers/specs/2026-09-28-party-management-service-design.md` (Section 1: Overview, 5 ORGANIZATION endpoints)

**Estimate:** 30 hours (Week 2, 6 days)

---

## Global Constraints

- Python 3.11+ minimum
- FastAPI 0.100+ with automatic OpenAPI
- SQLAlchemy 2.0+ async only
- Pydantic v2 for validation
- PostgreSQL 15+ with transactions
- HTTP-only cookies (no localStorage)
- 100% type hints (mypy strict)
- Structured JSON logging (no print)
- No third-party auth except python-keycloak + PyJWT
- Performance: <1000ms for POST /organizations, <500ms for GET /organizations (tree query)

---

## Review Focus

These five input classes are most likely to cause production issues if missed:

1. **Circular hierarchy detection** — POST /organizations with parent_org_id = self or ancestor should return 400, preventing circular structures. Test covers data integrity (no infinite loops on tree traversal).

2. **Orphan organization handling** — DELETE parent org when child orgs exist should return 400 (cannot delete). Orphans block deletion.

3. **Response filtering by role** — Colaborador receives limited org data (no internal_code, no budget). Jefe receives full. Test covers PII/sensitivity (same as PARTY).

4. **Hierarchy tree depth limit** — GET /organizations/tree with max 10 levels (prevent DOS). Test covers performance + safety.

5. **Duplicate organization code** — POST with existing code should return 409 (unique constraint). Test covers uniqueness validation (same pattern as email in PARTY).

---

## File Structure

**Existing files from Phase 1a (reused):**
- `app/main.py` (add router)
- `app/config.py` (no changes)
- `app/core/auth.py` (reused)
- `app/core/authorization.py` (reused)
- `app/database/engine.py` (reused)

**New files for Phase 1b:**

```
codebase/apps/domains/party-management-service/
├── app/
│   ├── models/
│   │   └── organization.py          # Organization model + tree traversal
│   ├── schemas/
│   │   └── organization.py          # Pydantic DTOs (request/response/tree)
│   ├── services/
│   │   └── organization_service.py  # Business logic (CRUD + hierarchy)
│   ├── routers/
│   │   └── organizations.py         # API endpoints (5 routes)
├── tests/
│   ├── unit/
│   │   └── test_organization_service.py
│   ├── integration/
│   │   └── test_organizations_api.py
│   ├── security/
│   │   └── test_organization_hierarchy.py
```

---

# Tasks

## Task 1: Organization Model (SQLAlchemy)

**Files:**
- Create: `app/models/organization.py`

**Interfaces:**
- Consumes: `Base` (from models/base.py)
- Produces: `Organization` model with columns: `pk_org_id`, `code`, `name`, `description`, `parent_org_id`, `status`, `created_by`, `created_at`, etc.
- Consumed by: Task 2 (schemas), Task 3 (services)

- [ ] **Step 1: Define Organization model**

```python
# app/models/organization.py
from sqlalchemy import Column, String, UUID, ForeignKey, Index, Text
from uuid import uuid4
from datetime import datetime
from app.models.base import Base
from typing import Optional

class Organization(Base):
    __tablename__ = "tb_organization"
    
    pk_org_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    internal_code = Column(String(50), nullable=True)  # PII - hidden for non-Jefe
    budget = Column(String(50), nullable=True)  # PII - hidden for non-Jefe
    
    # Hierarchy
    parent_org_id = Column(UUID(as_uuid=True), ForeignKey("tb_organization.pk_org_id"), nullable=True)
    
    # Status
    status = Column(String(20), default="active", index=True)  # active | inactive
    
    # Audit
    created_by = Column(String(255), nullable=False)
    created_at = Column(datetime, default=datetime.utcnow)
    updated_by = Column(String(255), nullable=True)
    updated_at = Column(datetime, nullable=True)
    
    __table_args__ = (
        Index("idx_tb_organization_code", "code"),
        Index("idx_tb_organization_status", "status"),
        Index("idx_tb_organization_parent_id", "parent_org_id"),
    )
    
    def __repr__(self) -> str:
        return f"<Organization {self.code} ({self.name})>"
```

- [ ] **Step 2: Add Organization to models/__init__.py**

```python
from app.models.organization import Organization
__all__ = ["Base", "Party", "Organization"]
```

- [ ] **Step 3: Test model creation**

```python
# tests/unit/test_organization_model.py
from app.models.organization import Organization
from uuid import uuid4

def test_organization_model():
    org = Organization(
        pk_org_id=uuid4(),
        code="ORG001",
        name="Engineering",
        created_by="admin"
    )
    assert org.code == "ORG001"
    assert org.status == "active"
```

- [ ] **Step 4: Commit**

```bash
git add app/models/organization.py app/models/__init__.py tests/unit/test_organization_model.py
git commit -m "feat: add Organization SQLAlchemy model with hierarchy support"
```

---

## Task 2: Organization Schemas (Pydantic)

**Files:**
- Create: `app/schemas/organization.py`

**Interfaces:**
- Consumes: `Organization` model fields
- Produces: `OrganizationCreateRequest`, `OrganizationResponseFull`, `OrganizationResponseLimited`, `OrganizationTree`
- Consumed by: Task 3 (services), Task 5 (endpoints)

- [ ] **Step 1: Define Pydantic schemas**

```python
# app/schemas/organization.py
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class OrganizationCreateRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    internal_code: Optional[str] = None
    budget: Optional[str] = None
    parent_org_id: Optional[UUID] = None

class OrganizationResponseFull(BaseModel):
    id: UUID
    code: str
    name: str
    description: Optional[str]
    internal_code: Optional[str]
    budget: Optional[str]
    parent_org_id: Optional[UUID]
    status: str
    created_by: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class OrganizationResponseLimited(BaseModel):
    id: UUID
    code: str
    name: str
    description: Optional[str]
    parent_org_id: Optional[UUID]
    status: str
    
    class Config:
        from_attributes = True

class OrganizationTree(BaseModel):
    id: UUID
    code: str
    name: str
    children: List['OrganizationTree'] = []

OrganizationTree.model_rebuild()

class OrganizationUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    budget: Optional[str] = None
    parent_org_id: Optional[UUID] = None
```

- [ ] **Step 2: Test schemas**

```python
# tests/unit/test_organization_schemas.py
from app.schemas.organization import OrganizationCreateRequest
from pydantic import ValidationError
import pytest

def test_org_create_request_valid():
    req = OrganizationCreateRequest(
        code="ENG",
        name="Engineering",
        parent_org_id=None
    )
    assert req.code == "ENG"

def test_org_create_request_missing_name():
    with pytest.raises(ValidationError):
        OrganizationCreateRequest(code="ENG")
```

- [ ] **Step 3: Commit**

```bash
git add app/schemas/organization.py tests/unit/test_organization_schemas.py
git commit -m "feat: add Organization Pydantic schemas with response filtering"
```

---

## Task 3: Organization Service (Business Logic)

**Files:**
- Create: `app/services/organization_service.py`

**Interfaces:**
- Consumes: `Organization` model, `OrganizationCreateRequest` schema, `AsyncSession` (db)
- Produces: `OrganizationService` with methods: `create()`, `get()`, `list()`, `update()`, `get_tree()`
- Consumed by: Task 5 (endpoints)

- [ ] **Step 1: Implement service with hierarchy validation**

```python
# app/services/organization_service.py
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreateRequest, OrganizationUpdateRequest
from app.core.exceptions import DuplicateEmailError, PartyNotFoundError
from app.core.logging import logger

class OrganizationService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, payload: OrganizationCreateRequest, current_user: str) -> Organization:
        """Create organization with hierarchy validation"""
        
        # 1. Validate code not duplicate
        existing = await self.db.execute(
            select(Organization).where(Organization.code == payload.code)
        )
        if existing.scalar():
            raise DuplicateEmailError("Organization code already exists")
        
        # 2. Validate parent exists (if specified)
        if payload.parent_org_id:
            parent = await self.db.get(Organization, payload.parent_org_id)
            if not parent:
                raise PartyNotFoundError("Parent organization not found")
            
            # 3. Check for circular hierarchy
            if await self._has_circular_hierarchy(payload.parent_org_id, None):
                raise ValueError("Circular hierarchy detected")
        
        # 4. Create org
        org = Organization(
            pk_org_id=uuid4(),
            code=payload.code,
            name=payload.name,
            description=payload.description,
            internal_code=payload.internal_code,
            budget=payload.budget,
            parent_org_id=payload.parent_org_id,
            status="active",
            created_by=current_user,
            created_at=datetime.utcnow()
        )
        
        async with self.db.begin():
            self.db.add(org)
            await self.db.flush()
        
        logger.info("org_created", org_id=str(org.pk_org_id), created_by=current_user)
        return org
    
    async def _has_circular_hierarchy(self, org_id, visited=None) -> bool:
        """DFS to detect circular hierarchy"""
        if visited is None:
            visited = set()
        
        if org_id in visited:
            return True  # Circular
        
        visited.add(org_id)
        org = await self.db.get(Organization, org_id)
        
        if org and org.parent_org_id:
            return await self._has_circular_hierarchy(org.parent_org_id, visited)
        
        return False
    
    async def get_tree(self, org_id: str = None) -> dict:
        """Get organization hierarchy tree (max 10 levels)"""
        if org_id:
            org = await self.db.get(Organization, org_id)
            if not org:
                raise PartyNotFoundError()
            return await self._build_tree(org, depth=0)
        else:
            # Root orgs only
            result = await self.db.execute(
                select(Organization).where(Organization.parent_org_id.is_(None))
            )
            roots = result.scalars().all()
            return [await self._build_tree(r, depth=0) for r in roots]
    
    async def _build_tree(self, org, depth=0) -> dict:
        """Recursively build tree (max 10 levels)"""
        if depth > 10:
            return None
        
        result = await self.db.execute(
            select(Organization).where(Organization.parent_org_id == org.pk_org_id)
        )
        children = result.scalars().all()
        
        return {
            "id": org.pk_org_id,
            "code": org.code,
            "name": org.name,
            "children": [await self._build_tree(c, depth + 1) for c in children]
        }
    
    async def get(self, org_id: str) -> Organization:
        org = await self.db.get(Organization, org_id)
        if not org:
            raise PartyNotFoundError("Organization not found")
        return org
    
    async def list(self, skip: int = 0, limit: int = 20) -> list[Organization]:
        result = await self.db.execute(
            select(Organization).offset(skip).limit(limit)
        )
        return result.scalars().all()
    
    async def update(self, org_id: str, payload: OrganizationUpdateRequest, current_user: str) -> Organization:
        org = await self.get(org_id)
        
        if payload.name:
            org.name = payload.name
        if payload.description is not None:
            org.description = payload.description
        if payload.budget is not None:
            org.budget = payload.budget
        if payload.parent_org_id is not None:
            if not await self.db.get(Organization, payload.parent_org_id):
                raise PartyNotFoundError("Parent organization not found")
            org.parent_org_id = payload.parent_org_id
        
        org.updated_by = current_user
        org.updated_at = datetime.utcnow()
        
        async with self.db.begin():
            self.db.add(org)
            await self.db.flush()
        
        logger.info("org_updated", org_id=str(org.pk_org_id), updated_by=current_user)
        return org
```

- [ ] **Step 2: Test service**

```python
# tests/unit/test_organization_service.py
import pytest
from app.services.organization_service import OrganizationService
from app.schemas.organization import OrganizationCreateRequest

@pytest.mark.asyncio
async def test_org_service_create(db_session):
    service = OrganizationService(db_session)
    req = OrganizationCreateRequest(
        code="ENG",
        name="Engineering"
    )
    org = await service.create(req, "admin")
    assert org.code == "ENG"

@pytest.mark.asyncio
async def test_org_service_circular_hierarchy(db_session):
    service = OrganizationService(db_session)
    org1 = Organization(code="ORG1", name="Org 1", created_by="admin")
    db_session.add(org1)
    await db_session.flush()
    
    # Try to create org2 with org1 as parent, then set org1.parent = org2
    # Should be blocked
```

- [ ] **Step 3: Commit**

```bash
git add app/services/organization_service.py tests/unit/test_organization_service.py
git commit -m "feat: add OrganizationService with hierarchy + circular-check validation"
```

---

## Task 4: Organization Routers (Endpoints)

**Files:**
- Create: `app/routers/organizations.py`

**Interfaces:**
- Consumes: `OrganizationService`, schemas, `check_jefe_ingeniera`
- Produces: 5 REST endpoints
- Consumed by: Task 6 (main.py registration)

- [ ] **Step 1: Implement 5 endpoints**

```python
# app/routers/organizations.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.schemas.organization import (
    OrganizationCreateRequest,
    OrganizationResponseFull,
    OrganizationResponseLimited,
    OrganizationTree,
    OrganizationUpdateRequest,
)
from app.services.organization_service import OrganizationService
from app.core.auth import get_current_user
from app.core.authorization import check_jefe_ingeniera, get_user_roles
from app.database.engine import get_db

router = APIRouter(prefix="/api/v1/organizations", tags=["organizations"])

@router.post("", status_code=201, response_model=OrganizationResponseFull)
async def create_organization(
    payload: OrganizationCreateRequest,
    current_user: str = Depends(check_jefe_ingeniera),
    db: AsyncSession = Depends(get_db),
):
    """Create organization. Only Jefe de Ingeniería."""
    service = OrganizationService(db)
    org = await service.create(payload, current_user)
    return OrganizationResponseFull.from_orm(org)

@router.get("", response_model=list[OrganizationResponseLimited])
async def list_organizations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List organizations (paginated)."""
    service = OrganizationService(db)
    orgs = await service.list(skip, limit)
    
    roles = await get_user_roles(current_user)
    if "jefe_ingeniera" in roles:
        return [OrganizationResponseFull.from_orm(o) for o in orgs]
    else:
        return [OrganizationResponseLimited.from_orm(o) for o in orgs]

@router.get("/{org_id}", response_model=OrganizationResponseFull)
async def get_organization(
    org_id: UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get organization by ID."""
    service = OrganizationService(db)
    org = await service.get(str(org_id))
    return OrganizationResponseFull.from_orm(org)

@router.patch("/{org_id}", response_model=OrganizationResponseFull)
async def update_organization(
    org_id: UUID,
    payload: OrganizationUpdateRequest,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update organization."""
    service = OrganizationService(db)
    org = await service.update(str(org_id), payload, current_user)
    return OrganizationResponseFull.from_orm(org)

@router.get("/tree/hierarchy", response_model=dict)
async def get_organization_tree(
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get full organization hierarchy tree (max 10 levels)."""
    service = OrganizationService(db)
    tree = await service.get_tree()
    return {"tree": tree}
```

- [ ] **Step 2: Update main.py to register router**

```python
# In app/main.py, add:
from app.routers.organizations import router as organizations_router
app.include_router(organizations_router)
```

- [ ] **Step 3: Test endpoints**

```python
# tests/integration/test_organizations_api.py
@pytest.mark.asyncio
async def test_post_organizations_201(async_client, jefe_token):
    payload = {
        "code": "ENG",
        "name": "Engineering",
        "parent_org_id": None
    }
    async_client.cookies.set("session", jefe_token)
    response = await async_client.post("/api/v1/organizations", json=payload)
    assert response.status_code == 201

@pytest.mark.asyncio
async def test_get_organization_tree(async_client, jefe_token):
    async_client.cookies.set("session", jefe_token)
    response = await async_client.get("/api/v1/organizations/tree/hierarchy")
    assert response.status_code == 200
    assert "tree" in response.json()
```

- [ ] **Step 4: Commit**

```bash
git add app/routers/organizations.py app/main.py tests/integration/test_organizations_api.py
git commit -m "feat: add 5 ORGANIZATION endpoints (POST, GET, GET/{id}, PATCH, tree)"
```

---

## Task 5: Organization Integration Tests

**Files:**
- Create: `tests/integration/test_organizations_api.py` (comprehensive)

- [ ] **Step 1: Happy path tests (create, get, list, update)**
- [ ] **Step 2: Error cases (duplicate code 409, not found 404, circular hierarchy 400)**
- [ ] **Step 3: Tree hierarchy tests (max 10 levels, circular detection)**
- [ ] **Step 4: Authorization tests (Colaborador sees limited, Jefe sees full)**
- [ ] **Step 5: Run full test suite**

```bash
pytest tests/ -v --cov=app
```

- [ ] **Step 6: Commit**

```bash
git add tests/
git commit -m "test: add comprehensive organization integration + security tests"
```

---

## Task 6: Update Postman Collection

**Files:**
- Update: `Party-Management-Service.postman_collection.json`

- [ ] **Add 10 new test scenarios:**
  1. Create Organization (happy path)
  2. Create with circular hierarchy (error)
  3. Create with duplicate code (409)
  4. Get organization by ID
  5. List organizations (pagination)
  6. Update organization
  7. Get organization tree
  8. Authorization: Colaborador sees limited
  9. Hierarchy: Max 10 levels
  10. Orphan check: cannot delete org with children

- [ ] **Commit**

```bash
git add Party-Management-Service.postman_collection.json
git commit -m "test: update Postman collection with 10 organization test scenarios"
```

---

## Task 7: Update Docker Compose & TESTING Guide

**Files:**
- Update: `TESTING.md`

- [ ] **Add Organization test section**
- [ ] **Add tree hierarchy examples**
- [ ] **Test scenarios table**

- [ ] **Commit**

```bash
git add TESTING.md
git commit -m "docs: add ORGANIZATION testing guide + hierarchy examples"
```

---

## Success Criteria (Phase 1b Complete)

✅ **All 5 ORGANIZATION endpoints implemented:**
- POST /api/v1/organizations (create)
- GET /api/v1/organizations (list)
- GET /api/v1/organizations/{id} (get)
- PATCH /api/v1/organizations/{id} (update)
- GET /api/v1/organizations/tree/hierarchy (tree)

✅ **Hierarchy features:**
- Parent-child relationships tracked
- Circular hierarchy detection (prevents cycles)
- Tree traversal (max 10 levels)
- Atomic transactions for all writes

✅ **Security controls:**
- Response filtering (limited vs full by role)
- Authorization checks (RBAC)
- SQL injection prevention (Pydantic validation)

✅ **Testing:**
- Unit tests: service, schemas, model
- Integration tests: happy path + errors + hierarchy
- 10 Postman test scenarios
- Coverage ≥80%

✅ **Documentation:**
- Updated TESTING.md with hierarchy examples
- Updated Postman collection
- README references Phase 1b (optional)

---

## Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| POST /organizations | <1000ms | Single insert + validation |
| GET /organizations (20 rows) | <500ms | Paginated query |
| GET /organizations/tree | <2000ms | Tree traversal (max 10 levels) |
| PATCH /organizations/{id} | <500ms | Update + circular check |

---

## Next Steps After Phase 1b

- **Phase 2 (Week 3):** ROLE-ASSIGNMENT endpoints (POST, GET, PATCH) with vigencia logic
- **Phase 3 (Week 4):** KEYCLOAK-LINK endpoints + E2E flows
- **Phase 4 (Week 5):** ANONYMIZATION + scheduler + irreversibility
- **Phase 5 (Week 6):** Prometheus metrics + Grafana dashboards + observability

---

**Status: READY FOR IMPLEMENTATION** ✅

Phase 1b follows the same patterns as Phase 1a, adds hierarchy validation, and expands tree traversal capability.
