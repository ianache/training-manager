# Organizations API (units & providers) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `GET /organizations`, `GET /organizations/{id}` and `POST /organizations` in party-management-service, relayed by the BFF, consumed by the portal wizard (steps Unidad/Proveedor).

**Architecture:** New ORM models (`Organization`, `PartyRelationship`) over the existing PDM-001 tables, one additive Alembic migration (`code`, `location`), a new router + `OrganizationService` mirroring `parties`, a BFF relay router, and the wizard API client switched to `/organizations?type=`.

**Tech Stack:** Python 3.11, FastAPI, SQLAlchemy async (SQLite in tests), Alembic, pytest-asyncio; Node/Express + supertest + vitest (BFF); Angular 22 + Vitest (portal).

**Spec:** `knowledge-base/architecture/api/API-SPEC-002-organizations.md` (approved by ianache 2026-10-03: route `/organizations`, POST only, RUC 11 chars, `code` ≤40, `location` ≤120).

## Global Constraints
- Service root: `codebase/apps/domains/party-management-service` (tests: `python -m pytest tests -q`). BFF: `codebase/apps/bff` (`npx vitest run`). Portal: `codebase/apps/portal` (use Node 22.22.3: `fnm exec --using 22.22.3 cmd /c "<cmd>"`).
- Type names are the API's: `internal_unit` ↔ role `ORGANIZATIONAL_UNIT`; `external_provider` ↔ role `SUPPLIER`.
- RUC: exactly 11 digits, stored as `tb_party_identification` type `RUC`, country `PE` (assumption A-1: the body has no country).
- Reads: any authenticated caller, rate-limit group `"read"`. Create: `require_jefe_ingenieria`, group `"create"`, `created_by = caller.username`.
- Errors use `ApiError` (`app/core/errors.py`): `404 RESOURCE_NOT_FOUND` via `not_found(...)`, `409 ORGANIZATION_DUPLICATE`, validation → `400 VALIDATION_ERROR` (automatic from pydantic).
- Response envelope for lists is the existing `Page` (`data`, `pagination`, `filters_applied`).
- No change to `knowledge-base/` API-SPEC-001. `code`/`location` apply to units only; `ruc` to providers only.
- Commit after each task; run `graphify update .` before each commit (repo rule) and stage `graphify-out/`.

## Review Focus
- `search` containing `%` or `_` must match literally, not as wildcards (Task 2).
- `search` equal to an 11-digit RUC must find the provider by exact RUC (Task 2).
- Invalid `sort` / `limit=0` / `type=foo` / non-UUID id → `400`, never `500` (Task 2).
- Parent that is an inactive unit or a provider → rejected like a missing parent (Task 3).
- Same name under a different parent is allowed; same name (any case) under the same parent is `409` (Task 3).
- Two concurrent creates with the same RUC → one `409`, not `500` (Task 3, DB unique index).
- A `colaborador` (non-jefe) gets `403` on POST at both BFF and service (Tasks 3, 4).

---

### Task 1: Migration and ORM models

**Files:**
- Create: `migrations/versions/0003_organization_code_location.py`
- Modify: `app/models/party.py` (append classes + constants)
- Create: `tests/integration/test_organization_models.py`

**Interfaces:**
- Produces (in `app/models/party.py`): constants `ROLE_UNIT = "ORGANIZATIONAL_UNIT"`, `ROLE_SUPPLIER = "SUPPLIER"`, `ORG_ROLES = (ROLE_UNIT, ROLE_SUPPLIER)`, `REL_ORG_STRUCTURE = "ORG_STRUCTURE"`, `ID_RUC = "RUC"`, `ORGANIZATION = "ORGANIZATION"`; classes `Organization` (`pk_party_id, party_kind, organization_name, code, location, created_at, created_by, updated_at, updated_by`) and `PartyRelationship` (`pk_party_relationship_id, fk_party_relationship_type_code, fk_party_role_from_id, fk_party_role_to_id, from_date, thru_date, created_at, created_by`).

- [ ] **Step 1: Write the failing test**

```python
# tests/integration/test_organization_models.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.party import Organization, Party, PartyRelationship


@pytest.mark.asyncio
async def test_organization_has_code_and_location_and_relationship_roundtrips(engine):
    factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as db:
        db.add(Party(pk_party_id="p1", party_kind="ORGANIZATION", created_by="t"))
        db.add(Organization(pk_party_id="p1", organization_name="Ingeniería", code="ING", location="Sede", created_by="t"))
        await db.commit()
        org = await db.get(Organization, "p1")
        assert (org.code, org.location, org.party_kind) == ("ING", "Sede", "ORGANIZATION")
        db.add(PartyRelationship(pk_party_relationship_id="r1", fk_party_relationship_type_code="ORG_STRUCTURE",
                                 fk_party_role_from_id="a", fk_party_role_to_id="b", from_date=__import__("datetime").date.today(),
                                 created_by="t"))
        await db.commit()
        assert (await db.get(PartyRelationship, "r1")).fk_party_role_to_id == "b"
```

- [ ] **Step 2: Run to verify it fails**

Run: `python -m pytest tests/integration/test_organization_models.py -q`
Expected: FAIL `ImportError: cannot import name 'Organization'`.

- [ ] **Step 3: Implement**

Append to `app/models/party.py`:

```python
ROLE_UNIT = "ORGANIZATIONAL_UNIT"
ROLE_SUPPLIER = "SUPPLIER"
ORG_ROLES = (ROLE_UNIT, ROLE_SUPPLIER)
REL_ORG_STRUCTURE = "ORG_STRUCTURE"
ID_RUC = "RUC"
ORGANIZATION = "ORGANIZATION"


class Organization(Base):
    __tablename__ = "tb_organization"

    pk_party_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("tb_party.pk_party_id"), primary_key=True)
    party_kind: Mapped[str] = mapped_column(String(12), default=ORGANIZATION)
    organization_name: Mapped[str] = mapped_column(String(200))
    code: Mapped[str | None] = mapped_column(String(40))
    location: Mapped[str | None] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))
    updated_at: Mapped[datetime | None] = mapped_column(DateTime)
    updated_by: Mapped[str | None] = mapped_column(String(36))


class PartyRelationship(Base):
    __tablename__ = "tb_party_relationship"

    pk_party_relationship_id: Mapped[str] = mapped_column(CHAR(36), primary_key=True)
    fk_party_relationship_type_code: Mapped[str] = mapped_column(String(40))
    fk_party_role_from_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("tb_party_role.pk_party_role_id"))
    fk_party_role_to_id: Mapped[str] = mapped_column(CHAR(36), ForeignKey("tb_party_role.pk_party_role_id"))
    from_date: Mapped[date] = mapped_column(Date)
    thru_date: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=_utcnow)
    created_by: Mapped[str] = mapped_column(String(36))
```

Create `migrations/versions/0003_organization_code_location.py`:

```python
"""tb_organization: code y location de la unidad (API-SPEC-002)

Revision ID: 0003_organization_code_location
Revises: 0002_std_db_001_alignment
"""
from alembic import op

revision = "0003_organization_code_location"
down_revision = "0002_std_db_001_alignment"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE tb_organization ADD COLUMN code VARCHAR(40) NULL")
    op.execute("ALTER TABLE tb_organization ADD COLUMN location VARCHAR(120) NULL")


def downgrade() -> None:
    op.execute("ALTER TABLE tb_organization DROP COLUMN location")
    op.execute("ALTER TABLE tb_organization DROP COLUMN code")
```

Also update the module docstring line "Las demás tablas…" to say organization and relationships are now used.

- [ ] **Step 4: Run to verify it passes**

Run: `python -m pytest tests -q`
Expected: all pass (existing schema tests unaffected; if `tests/schema/test_migrated_schema.py` lists expected columns of `tb_organization`, add `code`, `location` there).

- [ ] **Step 5: Commit** — `git add` the 4 files; `git commit -m "feat(party): migración 0003 y modelos ORM de organización"`.

---

### Task 2: Schemas, service reads and GET endpoints

**Files:**
- Create: `app/schemas/organization.py`, `app/services/organization_service.py`, `app/routers/organizations.py`
- Modify: `app/main.py` (include router)
- Create: `tests/integration/test_organizations_api.py`

**Interfaces:**
- Consumes: Task 1 models/constants; `Page`, `Pagination` from `app/schemas/party.py`; `total_pages` from `app/services/party_service.py`.
- Produces: `OrganizationType` enum (`internal_unit`, `external_provider`), `OrganizationOut` (`id, name, type, parent_id, status, code, location, ruc`), `OrganizationService(db).list(page, limit, sort, type, status, search, parent_id) -> (rows, total, applied)`, `.get(id) -> OrganizationOut`, `.create(payload, actor)` (Task 3).

- [ ] **Step 1: Write the failing tests**

Tests seed through the ORM in a helper (create-endpoint doesn't exist yet):

```python
# tests/integration/test_organizations_api.py
import uuid
from datetime import date, timedelta

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.party import (Organization, Party, PartyIdentification, PartyRelationship, PartyRole)


async def seed(engine, name, kind="ORGANIZATIONAL_UNIT", parent=None, ruc=None, thru=None, code=None, location=None):
    pid, rid = str(uuid.uuid4()), str(uuid.uuid4())
    async with sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)() as db:
        db.add(Party(pk_party_id=pid, party_kind="ORGANIZATION", created_by="t"))
        db.add(Organization(pk_party_id=pid, organization_name=name, code=code, location=location, created_by="t"))
        db.add(PartyRole(pk_party_role_id=rid, fk_party_id=pid, party_kind="ORGANIZATION", fk_party_role_type_code=kind,
                         from_date=date.today() - timedelta(days=30), thru_date=thru, created_by="t"))
        if ruc:
            db.add(PartyIdentification(pk_party_identification_id=str(uuid.uuid4()), fk_party_id=pid, party_kind="ORGANIZATION",
                                       fk_identification_type_code="RUC", identification_number=ruc, issuing_country_code="PE", created_by="t"))
        if parent:
            db.add(PartyRelationship(pk_party_relationship_id=str(uuid.uuid4()), fk_party_relationship_type_code="ORG_STRUCTURE",
                                     fk_party_role_from_id=rid, fk_party_role_to_id=parent[1], from_date=date.today(), created_by="t"))
        await db.commit()
    return pid, rid


@pytest.mark.asyncio
async def test_list_filters_by_type_and_returns_envelope(async_client, engine, colaborador):
    await seed(engine, "Ingeniería")
    await seed(engine, "Seguridad Sur", kind="SUPPLIER", ruc="20123456789")
    r = await async_client.get("/api/v1/organizations", params={"type": "external_provider"}, headers=colaborador)
    assert r.status_code == 200
    body = r.json()
    assert [o["name"] for o in body["data"]] == ["Seguridad Sur"]
    assert body["data"][0]["ruc"] == "20123456789" and body["data"][0]["type"] == "external_provider"
    assert body["pagination"]["total"] == 1 and body["filters_applied"]["type"] == "external_provider"


@pytest.mark.asyncio
async def test_unit_has_no_ruc_and_exposes_code_location_parent(async_client, engine, colaborador):
    root = await seed(engine, "Ingeniería")
    await seed(engine, "Backend", parent=root, code="ING-BE", location="Sede Central")
    r = await async_client.get("/api/v1/organizations", params={"parent_id": root[0]}, headers=colaborador)
    (o,) = r.json()["data"]
    assert (o["name"], o["parent_id"], o["code"], o["location"], o["ruc"]) == ("Backend", root[0], "ING-BE", "Sede Central", None)


@pytest.mark.asyncio
async def test_default_status_is_active_only(async_client, engine, colaborador):
    await seed(engine, "Vigente")
    await seed(engine, "Baja", thru=date.today() - timedelta(days=1))
    names = lambda r: [o["name"] for o in r.json()["data"]]
    assert names(await async_client.get("/api/v1/organizations", headers=colaborador)) == ["Vigente"]
    assert names(await async_client.get("/api/v1/organizations", params={"status": "inactive"}, headers=colaborador)) == ["Baja"]


@pytest.mark.asyncio
async def test_search_is_case_insensitive_partial_and_literal_for_wildcards(async_client, engine, colaborador):
    await seed(engine, "Ingeniería Backend")
    await seed(engine, "100% Cobertura")
    await seed(engine, "Operaciones")
    get = lambda s: async_client.get("/api/v1/organizations", params={"search": s}, headers=colaborador)
    assert [o["name"] for o in (await get("backend")).json()["data"]] == ["Ingeniería Backend"]
    assert [o["name"] for o in (await get("100%")).json()["data"]] == ["100% Cobertura"]   # % literal
    assert (await get("%")).json()["pagination"]["total"] == 1                              # no es comodín
    assert (await get("_")).json()["pagination"]["total"] == 0


@pytest.mark.asyncio
async def test_search_by_exact_ruc_finds_the_provider(async_client, engine, colaborador):
    await seed(engine, "Seguridad Sur", kind="SUPPLIER", ruc="20123456789")
    r = await async_client.get("/api/v1/organizations", params={"search": "20123456789"}, headers=colaborador)
    assert [o["name"] for o in r.json()["data"]] == ["Seguridad Sur"]


@pytest.mark.asyncio
@pytest.mark.parametrize("params", [{"type": "foo"}, {"limit": 0}, {"limit": 101}, {"sort": "ruc:asc"}, {"status": "x"}, {"parent_id": "no-uuid"}])
async def test_invalid_query_is_400(async_client, colaborador, params):
    r = await async_client.get("/api/v1/organizations", params=params, headers=colaborador)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_pagination_and_default_sort_by_name(async_client, engine, colaborador):
    for n in ("C", "A", "B"):
        await seed(engine, n)
    r = await async_client.get("/api/v1/organizations", params={"limit": 2, "page": 2}, headers=colaborador)
    assert [o["name"] for o in r.json()["data"]] == ["C"]
    assert r.json()["pagination"] | {} == {"page": 2, "limit": 2, "total": 3, "total_pages": 2, "has_next": False, "has_prev": True}


@pytest.mark.asyncio
async def test_get_by_id_404_and_400(async_client, engine, colaborador):
    pid, _ = await seed(engine, "Ingeniería")
    assert (await async_client.get(f"/api/v1/organizations/{pid}", headers=colaborador)).json()["name"] == "Ingeniería"
    assert (await async_client.get(f"/api/v1/organizations/{uuid.uuid4()}", headers=colaborador)).status_code == 404
    assert (await async_client.get("/api/v1/organizations/no-uuid", headers=colaborador)).status_code == 400


@pytest.mark.asyncio
async def test_requires_service_token(async_client):
    assert (await async_client.get("/api/v1/organizations")).status_code == 401
```

Note: `seed` ids are `uuid4()` strings, so `{parent_id: "no-uuid"}` exercises the `UUID` query type. A non-ASCII name test is covered by "Ingeniería".

- [ ] **Step 2: Run to verify they fail**

Run: `python -m pytest tests/integration/test_organizations_api.py -q`
Expected: FAIL (404 route not found / import errors).

- [ ] **Step 3: Implement**

`app/schemas/organization.py`:

```python
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class OrganizationType(str, Enum):
    internal_unit = "internal_unit"
    external_provider = "external_provider"


class OrganizationStatus(str, Enum):
    active = "active"
    inactive = "inactive"


class OrganizationOut(BaseModel):
    id: str
    name: str
    type: OrganizationType
    parent_id: Optional[str] = None
    status: OrganizationStatus
    code: Optional[str] = None
    location: Optional[str] = None
    ruc: Optional[str] = None
```

`app/services/organization_service.py` (reads; `create` is added in Task 3):

```python
from datetime import date
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.core.errors import ApiError, not_found
from app.models.party import (ID_RUC, ORG_ROLES, REL_ORG_STRUCTURE, ROLE_SUPPLIER, ROLE_UNIT, Organization,
                              PartyIdentification, PartyRelationship, PartyRole)
from app.schemas.organization import OrganizationOut, OrganizationStatus, OrganizationType
from app.services.party_service import total_pages  # noqa: F401  (re-export for the router)

SORTS = {"name": Organization.organization_name, "created_at": Organization.created_at}
ROLE_OF = {OrganizationType.internal_unit: ROLE_UNIT, OrganizationType.external_provider: ROLE_SUPPLIER}
TYPE_OF = {v: k for k, v in ROLE_OF.items()}


def _like(term: str) -> str:
    return "%" + term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"


def _active(role: type[PartyRole], today: date):
    return or_(role.thru_date.is_(None), role.thru_date >= today)


class OrganizationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _build(self, rows) -> list[OrganizationOut]:
        today = date.today()
        role_ids = [r.pk_party_role_id for _, r in rows]
        party_ids = [o.pk_party_id for o, _ in rows]
        to_role = aliased(PartyRole)
        parents = dict((await self.db.execute(
            select(PartyRelationship.fk_party_role_from_id, to_role.fk_party_id)
            .join(to_role, to_role.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
            .where(PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                   PartyRelationship.thru_date.is_(None), PartyRelationship.fk_party_role_from_id.in_(role_ids))
        )).all()) if role_ids else {}
        rucs = dict((await self.db.execute(
            select(PartyIdentification.fk_party_id, PartyIdentification.identification_number)
            .where(PartyIdentification.fk_identification_type_code == ID_RUC,
                   PartyIdentification.anonymized_at.is_(None), PartyIdentification.fk_party_id.in_(party_ids))
        )).all()) if party_ids else {}
        out = []
        for org, role in rows:
            kind = TYPE_OF[role.fk_party_role_type_code]
            is_active = role.thru_date is None or role.thru_date >= today
            out.append(OrganizationOut(
                id=org.pk_party_id, name=org.organization_name, type=kind,
                parent_id=parents.get(role.pk_party_role_id),
                status=OrganizationStatus.active if is_active else OrganizationStatus.inactive,
                code=org.code if kind == OrganizationType.internal_unit else None,
                location=org.location if kind == OrganizationType.internal_unit else None,
                ruc=rucs.get(org.pk_party_id) if kind == OrganizationType.external_provider else None))
        return out

    def _base(self):
        return (select(Organization, PartyRole)
                .join(PartyRole, PartyRole.fk_party_id == Organization.pk_party_id)
                .where(PartyRole.fk_party_role_type_code.in_(ORG_ROLES)))

    async def list(self, page, limit, sort, type_, status, search, parent_id):
        field, _, direction = sort.partition(":")
        if field not in SORTS or direction not in ("", "asc", "desc"):
            raise ApiError(400, "VALIDATION_ERROR", "El criterio de orden no es válido.", {"field": "sort"})
        today = date.today()
        q = self._base()
        applied = {"status": status.value}
        q = q.where(_active(PartyRole, today) if status == OrganizationStatus.active else ~_active(PartyRole, today))
        if type_:
            q = q.where(PartyRole.fk_party_role_type_code == ROLE_OF[type_])
            applied["type"] = type_.value
        if search:
            ruc_match = select(PartyIdentification.fk_party_id).where(
                PartyIdentification.fk_identification_type_code == ID_RUC, PartyIdentification.identification_number == search)
            q = q.where(or_(Organization.organization_name.ilike(_like(search), escape="\\"),
                            Organization.pk_party_id.in_(ruc_match)))
            applied["search"] = search
        if parent_id:
            to_role = aliased(PartyRole)
            child_roles = (select(PartyRelationship.fk_party_role_from_id)
                           .join(to_role, to_role.pk_party_role_id == PartyRelationship.fk_party_role_to_id)
                           .where(PartyRelationship.fk_party_relationship_type_code == REL_ORG_STRUCTURE,
                                  PartyRelationship.thru_date.is_(None), to_role.fk_party_id == str(parent_id)))
            q = q.where(PartyRole.pk_party_role_id.in_(child_roles))
            applied["parent_id"] = str(parent_id)
        total = (await self.db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
        col = SORTS[field]
        q = q.order_by(col.desc() if direction == "desc" else col.asc(), Organization.pk_party_id)
        rows = (await self.db.execute(q.offset((page - 1) * limit).limit(limit))).all()
        return await self._build(rows), total, applied

    async def get(self, org_id: UUID | str) -> OrganizationOut:
        rows = (await self.db.execute(self._base().where(Organization.pk_party_id == str(org_id)))).all()
        if not rows:
            raise not_found("La organización no existe.")
        return (await self._build(rows[:1]))[0]
```

`app/routers/organizations.py`:

```python
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import Caller, get_caller
from app.core.rate_limit import rate_limited
from app.database.engine import get_db
from app.schemas.organization import OrganizationOut, OrganizationStatus, OrganizationType
from app.schemas.party import Page, Pagination
from app.services.organization_service import OrganizationService, total_pages

router = APIRouter(prefix="/api/v1/organizations", tags=["organizations"])


@router.get("", dependencies=[Depends(rate_limited("read"))], response_model=Page[OrganizationOut])
async def list_organizations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("name:asc", max_length=40),
    type: Optional[OrganizationType] = Query(None),
    status: OrganizationStatus = Query(OrganizationStatus.active),
    search: Optional[str] = Query(None, max_length=100),
    parent_id: Optional[UUID] = Query(None),
    caller: Caller = Depends(get_caller),
    db: AsyncSession = Depends(get_db),
):
    rows, total, applied = await OrganizationService(db).list(page, limit, sort, type, status, search, parent_id)
    pages = total_pages(total, limit)
    return {"data": rows, "pagination": Pagination(page=page, limit=limit, total=total, total_pages=pages,
                                                   has_next=page < pages, has_prev=page > 1), "filters_applied": applied}


@router.get("/{org_id}", dependencies=[Depends(rate_limited("read"))], response_model=OrganizationOut)
async def get_organization(org_id: UUID, caller: Caller = Depends(get_caller), db: AsyncSession = Depends(get_db)):
    return await OrganizationService(db).get(org_id)
```

In `app/main.py` add `from app.routers.organizations import router as organizations_router` and `app.include_router(organizations_router)` next to the parties one. If a parameter named `type` shadows the builtin inside `organizations.py` that is acceptable (FastAPI alias is the name); if it causes lint noise, use `type_: ... = Query(None, alias="type")`.

- [ ] **Step 4: Run to verify they pass**

Run: `python -m pytest tests -q` — Expected: all pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(party): GET /organizations y /organizations/{id} (API-SPEC-002)"`.

---

### Task 3: POST /organizations

**Files:**
- Modify: `app/schemas/organization.py` (add `OrganizationCreateRequest`), `app/services/organization_service.py` (add `create`), `app/routers/organizations.py` (add POST)
- Create: `tests/integration/test_organizations_create.py`; extend `tests/security/test_authorization.py` with the colaborador-403 case if that file lists write routes.

**Interfaces:**
- Consumes: Task 2 service/schemas; `require_jefe_ingenieria`.
- Produces: `OrganizationCreateRequest(name, type, parent_id: UUID|None, code, location, ruc)`; `OrganizationService.create(payload, actor) -> OrganizationOut`.

- [ ] **Step 1: Write the failing tests**

```python
# tests/integration/test_organizations_create.py
import asyncio
import pytest

URL = "/api/v1/organizations"
UNIT = {"name": "Ingeniería", "type": "internal_unit"}
PROVIDER = {"name": "Seguridad Sur", "type": "external_provider", "ruc": "20123456789"}


async def post(c, h, body):
    return await c.post(URL, json=body, headers=h)


@pytest.mark.asyncio
async def test_create_unit_201_with_location_header_and_audit(async_client, jefe):
    r = await post(async_client, jefe, {**UNIT, "code": "ING", "location": "Sede Central"})
    assert r.status_code == 201
    b = r.json()
    assert (b["name"], b["type"], b["status"], b["code"], b["location"], b["ruc"], b["parent_id"]) == \
           ("Ingeniería", "internal_unit", "active", "ING", "Sede Central", None, None)
    assert r.headers["location"] == f"{URL}/{b['id']}"
    got = await async_client.get(f"{URL}/{b['id']}", headers=jefe)
    assert got.json() == b


@pytest.mark.asyncio
async def test_create_provider_stores_ruc_and_is_listed(async_client, jefe):
    assert (await post(async_client, jefe, PROVIDER)).status_code == 201
    r = await async_client.get(URL, params={"type": "external_provider", "search": "20123456789"}, headers=jefe)
    assert [o["ruc"] for o in r.json()["data"]] == ["20123456789"]


@pytest.mark.asyncio
async def test_child_unit_links_to_active_parent(async_client, jefe):
    parent = (await post(async_client, jefe, UNIT)).json()
    child = (await post(async_client, jefe, {"name": "Backend", "type": "internal_unit", "parent_id": parent["id"]})).json()
    assert child["parent_id"] == parent["id"]


@pytest.mark.asyncio
@pytest.mark.parametrize("body", [
    {"type": "internal_unit"},                                            # sin nombre
    {"name": "", "type": "internal_unit"},
    {"name": "x" * 201, "type": "internal_unit"},
    {"name": "A", "type": "otro"},
    {"name": "P", "type": "external_provider"},                           # proveedor sin RUC
    {"name": "P", "type": "external_provider", "ruc": "123"},             # RUC corto
    {"name": "P", "type": "external_provider", "ruc": "2012345678a"},     # RUC no numérico
    {"name": "P", "type": "external_provider", "ruc": "201234567890"},    # 12 dígitos
    {"name": "U", "type": "internal_unit", "ruc": "20123456789"},         # unidad con RUC
    {"name": "P", "type": "external_provider", "ruc": "20123456789", "code": "X"},
    {"name": "P", "type": "external_provider", "ruc": "20123456789", "location": "X"},
    {"name": "P", "type": "external_provider", "ruc": "20123456789", "parent_id": "6f1c2a3e-8d4b-4c7a-9e1f-0a2b3c4d5e6f"},
    {"name": "U", "type": "internal_unit", "code": "x" * 41},
    {"name": "U", "type": "internal_unit", "location": "x" * 121},
    {"name": "U", "type": "internal_unit", "parent_id": "no-uuid"},
    {"name": "U", "type": "internal_unit", "extra": 1},                   # extra=forbid
])
async def test_validation_400(async_client, jefe, body):
    r = await post(async_client, jefe, body)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_name_is_trimmed_and_whitespace_only_is_rejected(async_client, jefe):
    assert (await post(async_client, jefe, {**UNIT, "name": "  Ingeniería  "})).json()["name"] == "Ingeniería"
    assert (await post(async_client, jefe, {**UNIT, "name": "   "})).status_code == 400


@pytest.mark.asyncio
async def test_missing_parent_404(async_client, jefe):
    r = await post(async_client, jefe, {**UNIT, "parent_id": "6f1c2a3e-8d4b-4c7a-9e1f-0a2b3c4d5e6f"})
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_provider_as_parent_is_rejected_like_missing(async_client, jefe):
    prov = (await post(async_client, jefe, PROVIDER)).json()
    assert (await post(async_client, jefe, {**UNIT, "parent_id": prov["id"]})).status_code == 404


@pytest.mark.asyncio
async def test_duplicate_name_same_parent_409_any_case_but_other_parent_ok(async_client, jefe):
    a = (await post(async_client, jefe, UNIT)).json()
    b = (await post(async_client, jefe, {"name": "Operaciones", "type": "internal_unit"})).json()
    r = await post(async_client, jefe, {**UNIT, "name": "INGENIERÍA"})            # misma raíz
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_DUPLICATE"
    assert (await post(async_client, jefe, {"name": "Backend", "type": "internal_unit", "parent_id": a["id"]})).status_code == 201
    assert (await post(async_client, jefe, {"name": "Backend", "type": "internal_unit", "parent_id": b["id"]})).status_code == 201
    assert (await post(async_client, jefe, {"name": "Backend", "type": "internal_unit", "parent_id": a["id"]})).status_code == 409


@pytest.mark.asyncio
async def test_duplicate_ruc_409(async_client, jefe):
    await post(async_client, jefe, PROVIDER)
    r = await post(async_client, jefe, {**PROVIDER, "name": "Otra razón social"})
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_DUPLICATE"


@pytest.mark.asyncio
async def test_concurrent_same_ruc_gives_one_201_and_one_409_never_500(async_client, jefe):
    rs = await asyncio.gather(post(async_client, jefe, PROVIDER), post(async_client, jefe, {**PROVIDER, "name": "Gemela"}))
    assert sorted(r.status_code for r in rs) == [201, 409]


@pytest.mark.asyncio
async def test_non_jefe_gets_403_and_nothing_is_created(async_client, colaborador, jefe):
    assert (await post(async_client, colaborador, UNIT)).status_code == 403
    assert (await async_client.get(URL, headers=jefe)).json()["pagination"]["total"] == 0
```

(Concurrency test: SQLite in-memory serializes writes; the partial unique index on RUC makes the second commit fail and `_commit` maps it to 409. If the second request instead sees the first RUC during its pre-check it also returns 409 — both paths are valid.)

- [ ] **Step 2: Run to verify they fail**

Run: `python -m pytest tests/integration/test_organizations_create.py -q` — Expected: FAIL (`405 Method Not Allowed`).

- [ ] **Step 3: Implement**

Add to `app/schemas/organization.py`:

```python
import re
from typing import Self
from uuid import UUID

from pydantic import ConfigDict, Field, field_validator, model_validator

RUC_RE = re.compile(r"^\d{11}$")


class OrganizationCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)
    type: OrganizationType
    parent_id: Optional[UUID] = None
    code: Optional[str] = Field(None, max_length=40)
    location: Optional[str] = Field(None, max_length=120)
    ruc: Optional[str] = None

    @field_validator("ruc")
    @classmethod
    def _ruc_format(cls, v):
        if v is not None and not RUC_RE.match(v):
            raise ValueError("El RUC debe tener 11 dígitos.")
        return v

    @model_validator(mode="after")
    def _by_type(self) -> Self:
        if self.type == OrganizationType.external_provider:
            if self.ruc is None:
                raise ValueError("El proveedor requiere RUC.")
            if self.parent_id or self.code or self.location:
                raise ValueError("El proveedor no admite parent_id, code ni location.")
        elif self.ruc is not None:
            raise ValueError("La unidad no admite RUC.")
        return self
```

Add to `OrganizationService`:

```python
    async def _same_name_under(self, name: str, type_: OrganizationType, parent_id: str | None) -> bool:
        rows = (await self.db.execute(self._base().where(
            PartyRole.fk_party_role_type_code == ROLE_OF[type_], _active(PartyRole, date.today()),
            func.lower(Organization.organization_name) == name.lower()))).all()
        return any(o.parent_id == parent_id for o in await self._build(rows))

    async def create(self, payload, actor: str) -> OrganizationOut:
        parent_id = str(payload.parent_id) if payload.parent_id else None
        parent_role = None
        if parent_id:
            row = (await self.db.execute(self._base().where(
                Organization.pk_party_id == parent_id, PartyRole.fk_party_role_type_code == ROLE_UNIT,
                _active(PartyRole, date.today())))).first()
            if row is None:
                raise not_found("La unidad padre no existe o no está vigente.")
            parent_role = row[1].pk_party_role_id
        if await self._same_name_under(payload.name, payload.type, parent_id):
            raise _duplicate("name")
        if payload.ruc:
            taken = (await self.db.execute(select(PartyIdentification.pk_party_identification_id).where(
                PartyIdentification.fk_identification_type_code == ID_RUC,
                PartyIdentification.identification_number == payload.ruc,
                PartyIdentification.anonymized_at.is_(None)))).first()
            if taken:
                raise _duplicate("ruc")
        pid, rid, today = str(uuid4()), str(uuid4()), date.today()
        self.db.add(Party(pk_party_id=pid, party_kind=ORGANIZATION, created_by=actor))
        self.db.add(Organization(pk_party_id=pid, organization_name=payload.name, code=payload.code,
                                 location=payload.location, created_by=actor))
        self.db.add(PartyRole(pk_party_role_id=rid, fk_party_id=pid, party_kind=ORGANIZATION,
                              fk_party_role_type_code=ROLE_OF[payload.type], from_date=today, created_by=actor))
        if payload.ruc:
            self.db.add(PartyIdentification(pk_party_identification_id=str(uuid4()), fk_party_id=pid,
                                            party_kind=ORGANIZATION, fk_identification_type_code=ID_RUC,
                                            identification_number=payload.ruc, issuing_country_code="PE", created_by=actor))
        if parent_role:
            self.db.add(PartyRelationship(pk_party_relationship_id=str(uuid4()),
                                          fk_party_relationship_type_code=REL_ORG_STRUCTURE,
                                          fk_party_role_from_id=rid, fk_party_role_to_id=parent_role,
                                          from_date=today, created_by=actor))
        await self._commit()
        self.db.expunge_all()
        return await self.get(pid)

    async def _commit(self) -> None:
        try:
            await self.db.commit()
        except IntegrityError as exc:
            await self.db.rollback()
            raise _duplicate("ruc") from exc


def _duplicate(field: str) -> ApiError:
    return ApiError(409, "ORGANIZATION_DUPLICATE", "La organización ya está registrada.", {"field": field})
```

Imports to add: `from uuid import uuid4`, `from sqlalchemy.exc import IntegrityError`, and from models `ORGANIZATION, Party`. `_duplicate` is module-level, defined after the class (fine at call time).

Router:

```python
from fastapi import Response
from app.core.authorization import require_jefe_ingenieria
from app.schemas.organization import OrganizationCreateRequest


@router.post("", status_code=201, dependencies=[Depends(rate_limited("create"))], response_model=OrganizationOut)
async def create_organization(payload: OrganizationCreateRequest, response: Response,
                              caller: Caller = Depends(require_jefe_ingenieria), db: AsyncSession = Depends(get_db)):
    org = await OrganizationService(db).create(payload, caller.username)
    response.headers["Location"] = f"/api/v1/organizations/{org.id}"
    return org
```

- [ ] **Step 4: Run to verify they pass**

Run: `python -m pytest tests -q` — Expected: all pass.

- [ ] **Step 5: Mutation check (tests were designed with the code in view)** — temporarily break each in `organization_service.py` and confirm a test fails, then restore: drop the `_active` filter in the parent lookup; remove `.lower()` in `_same_name_under`; remove `escape="\\"`; remove the RUC pre-check. Report any survivor and add a test.

- [ ] **Step 6: Commit** — `git commit -m "feat(party): POST /organizations (API-SPEC-002)"`.

---

### Task 4: BFF relay

**Files:**
- Create: `codebase/apps/bff/src/modules/organizations/organizations.router.ts`
- Modify: `codebase/apps/bff/src/app.ts` (mount), `codebase/apps/bff/test/app.test.ts` (new tests)

**Interfaces:**
- Consumes: `partiesRouter` pattern; `party` ServiceClient.
- Produces: `organizationsRouter(party: ServiceClient): Router` mounted at `/api/v1/organizations`.

- [ ] **Step 1: Write the failing tests** (inside `describe('BFF', …)` in `test/app.test.ts`, using the existing `setup`/`login` helpers)

```ts
it('reenvía la lectura de organizaciones con solo los query params permitidos', async () => {
  const { agent, calls } = setup(['colaborador']);
  await login(agent);
  await agent.get('/api/v1/organizations?type=internal_unit&search=ing&limit=10&evil=1').expect(200);
  expect(calls.at(-1)!.url).toBe('http://party.test/api/v1/organizations?type=internal_unit&search=ing&limit=10');
});

it('lee una organización por id', async () => {
  const { agent, calls } = setup(['colaborador']);
  await login(agent);
  await agent.get('/api/v1/organizations/abc%2F1').expect(200);
  expect(calls.at(-1)!.url).toBe('http://party.test/api/v1/organizations/abc%2F1');
});

it('aplica RBAC: un colaborador no crea organizaciones', async () => {
  const { agent, calls } = setup(['colaborador']);
  await login(agent);
  const xsrf = await xsrfOf(agent);
  const before = calls.length;
  await agent.post('/api/v1/organizations').set('X-XSRF-TOKEN', xsrf).send({ name: 'X', type: 'internal_unit' }).expect(403);
  expect(calls.length).toBe(before);
});

it('el Jefe de Ingeniería crea una organización (CSRF exigido) y se reenvía el cuerpo', async () => {
  const { agent, calls } = setup(['jefe_ingenieria']);
  await login(agent);
  await agent.post('/api/v1/organizations').send({}).expect(403);                 // sin CSRF
  const xsrf = await xsrfOf(agent);
  await agent.post('/api/v1/organizations').set('X-XSRF-TOKEN', xsrf).send({ name: 'Ingeniería', type: 'internal_unit' }).expect(200);
  expect(calls.at(-1)!.url).toBe('http://party.test/api/v1/organizations');
});
```

`xsrfOf` must match how the existing CSRF tests obtain the token (see tests at app.test.ts lines ~111-125: reuse that exact snippet; extract it into a local helper if it is inline).

- [ ] **Step 2: Run to verify they fail**

Run (in `codebase/apps/bff`): `npx vitest run test/app.test.ts` — Expected: FAIL (404 on `/api/v1/organizations`).

- [ ] **Step 3: Implement**

```ts
// src/modules/organizations/organizations.router.ts
import { Router } from 'express';
import { requireAnyRole } from '../../auth/guards.js';
import { Role } from '../../auth/roles.js';
import { relay } from '../../downstream/relay.js';
import type { ServiceClient } from '../../downstream/service-client.js';
import { pickQuery, requestIdOf, userName, userRoles } from '../../shared/http.js';

const LIST_QUERY = ['page', 'limit', 'sort', 'type', 'status', 'search', 'parent_id'] as const;

/** /api/v1/organizations → party-management-service (API-SPEC-002). La lectura es abierta; el alta es del Jefe de Ingeniería (BR-PTY-17). */
export function organizationsRouter(party: ServiceClient): Router {
  const r = Router();
  const ctx = (req: Parameters<typeof userName>[0]) => ({ userName: userName(req), userRoles: userRoles(req), requestId: requestIdOf(req) });

  r.get('/', async (req, res) => {
    relay(res, await party.call({ path: '/api/v1/organizations', query: pickQuery(req, LIST_QUERY), ...ctx(req) }));
  });
  r.get('/:orgId', async (req, res) => {
    relay(res, await party.call({ path: `/api/v1/organizations/${encodeURIComponent(req.params.orgId)}`, ...ctx(req) }));
  });
  r.post('/', requireAnyRole(Role.JefeIngenieria), async (req, res) => {
    relay(res, await party.call({ method: 'POST', path: '/api/v1/organizations', body: req.body, ...ctx(req) }));
  });
  return r;
}
```

In `app.ts`: `import { organizationsRouter } from './modules/organizations/organizations.router.js';` and, next to the parties mount, reuse the same client instance:

```ts
const partyClient = client('party-management-service', env.PARTY_SERVICE_URL);
api.use('/parties', partiesRouter(partyClient));
api.use('/organizations', organizationsRouter(partyClient));
```

Also check `test/adr-compliance.test.ts` still passes (no absolute URLs added).

- [ ] **Step 4: Run to verify they pass** — `npx vitest run` — Expected: all pass.

- [ ] **Step 5: Commit** — `git commit -m "feat(bff): relay de /organizations"`.

---

### Task 5: Portal client and wizard

**Files:**
- Modify: `codebase/apps/portal/projects/mfe-collaborators/src/app/pages/register-collaborator/register-collaborator.api.ts`
- Modify: `…/register-collaborator.api.spec.ts`
- Modify: `knowledge-base/index.md`, `knowledge-base/changelog.md`; `knowledge-base/architecture/api/API-SPEC-002-organizations.md` (header: add `implemented` note after Task 5 passes)

**Interfaces:**
- Consumes: Task 4 route `GET /api/v1/organizations?type=…&search=…&limit=10` returning `Page<OrganizationRow>`.
- Produces: `searchUnits(q)` / `searchProviders(q)` keep their signatures (`Observable<Option[]>`).

- [ ] **Step 1: Write the failing tests** — in `register-collaborator.api.spec.ts` replace the three `/units` and `/providers` tests' URLs and bodies:

```ts
it('searchUnits: GET /organizations?type=internal_unit y mapea nombre y ubicación (o código)', () => {
  let out: unknown;
  api.searchUnits('ing').subscribe((o) => (out = o));
  const req = http.expectOne((r) => r.url === '/api/v1/organizations');
  expect(req.request.params.get('type')).toBe('internal_unit');
  expect(req.request.params.get('search')).toBe('ing');
  expect(req.request.params.get('limit')).toBe('10');
  req.flush(page([{ id: 'u-1', name: 'Ingeniería', location: 'Sede Central', code: 'ING' }, { id: 'u-2', name: 'Operaciones', location: null, code: 'OP' }]));
  expect(out).toEqual([
    { id: 'u-1', label: 'Ingeniería', sublabel: 'Sede Central' },
    { id: 'u-2', label: 'Operaciones', sublabel: 'OP' },
  ]);
});

it('searchProviders: GET /organizations?type=external_provider y muestra el RUC', () => {
  let out: unknown;
  api.searchProviders('seg').subscribe((o) => (out = o));
  const req = http.expectOne((r) => r.url === '/api/v1/organizations');
  expect(req.request.params.get('type')).toBe('external_provider');
  req.flush(page([{ id: 'v-1', name: 'Seguridad Sur', ruc: '20123456789' }]));
  expect(out).toEqual([{ id: 'v-1', label: 'Seguridad Sur', sublabel: 'RUC: 20123456789' }]);
});
```

Delete the "arreglo plano" unit test (the API always returns the envelope) and update the header comment of the spec/`api.ts` (units/providers are no longer assumptions; `/catalog/roles` still is). Keep the `roles()` tests untouched.

- [ ] **Step 2: Run to verify they fail**

Run (portal, Node 22.22.3): `npx ng test mfe-collaborators --watch=false --include **/register-collaborator.api.spec.ts` — Expected: FAIL on the two changed tests.

- [ ] **Step 3: Implement** — in `register-collaborator.api.ts`:

```ts
interface CatalogRow { /* keep existing fields */ }

private organizations(type: 'internal_unit' | 'external_provider', q: string): Observable<CatalogRow[]> {
  return this.http
    .get<Page<CatalogRow> | CatalogRow[]>(`${this.base}/organizations`, { params: { type, search: q, limit: 10 } })
    .pipe(map((b) => rows(b)));
}

searchUnits(q: string): Observable<Option[]> {
  return this.organizations('internal_unit', q).pipe(
    map((rs) => rs.map((r) => ({ id: r.id, label: r.name ?? r.id, sublabel: r.location ?? r.code ?? undefined }))));
}

searchProviders(q: string): Observable<Option[]> {
  return this.organizations('external_provider', q).pipe(
    map((rs) => rs.map((r) => ({ id: r.id, label: r.name ?? r.id, sublabel: r.ruc ? `RUC: ${r.ruc}` : undefined }))));
}
```

Update `CatalogRow` so `location?: string | null; code?: string | null; ruc?: string | null`. Note `?? undefined` keeps `sublabel` absent (not `null`) so the existing `toEqual` shapes hold.

- [ ] **Step 4: Run to verify, then the full portal gate**

Run: `npm test` and `npm run lint:ui` (portal) and `npx ng build mfe-collaborators`. Expected: all pass (the wizard steps spec mocks `RegisterCollaboratorApi`, so it is unaffected).

- [ ] **Step 5: Docs and commit** — add `API-SPEC-002` to `knowledge-base/index.md` under Arquitectura and a dated entry in `changelog.md` (artifacts: spec, migration, service files, BFF router, portal api). `graphify update .`; commit `feat(portal): el asistente usa /organizations`.

---

## Self-Review
- **Spec coverage:** reads (Task 2), POST + rules + 409/404/403 + transaction + Location (Task 3), migration `code`/`location` (Task 1), BFF RBAC/relay (Task 4), portal switch (Task 5). `Q-6` (contact/metadata storage) is a documented follow-up, not in scope.
- **Assumptions to confirm at review:** A-1 provider RUC country fixed to `PE`; `name` uniqueness is checked in the application (no DB constraint exists), so two simultaneous creates of the same name under the same parent can both succeed — only RUC is DB-protected.
- **Not covered by this plan:** end-to-end run against Postgres (`TEST_DATABASE_URL`); run `tests/` once with it before merge to validate migration 0003 on the real schema.
