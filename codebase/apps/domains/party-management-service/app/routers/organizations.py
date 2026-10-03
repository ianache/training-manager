"""/api/v1/organizations — API-SPEC-002. Solo lo llama el BFF (ADR-001)."""
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
    type_: Optional[OrganizationType] = Query(None, alias="type"),
    status: OrganizationStatus = Query(OrganizationStatus.active),
    search: Optional[str] = Query(None, max_length=100),
    parent_id: Optional[UUID] = Query(None),
    caller: Caller = Depends(get_caller),
    db: AsyncSession = Depends(get_db),
):
    rows, total, applied = await OrganizationService(db).list(page, limit, sort, type_, status, search, parent_id)
    pages = total_pages(total, limit)
    return {
        "data": rows,
        "pagination": Pagination(
            page=page, limit=limit, total=total, total_pages=pages, has_next=page < pages, has_prev=page > 1
        ),
        "filters_applied": applied,
    }


@router.get("/{org_id}", dependencies=[Depends(rate_limited("read"))], response_model=OrganizationOut)
async def get_organization(org_id: UUID, caller: Caller = Depends(get_caller), db: AsyncSession = Depends(get_db)):
    return await OrganizationService(db).get(org_id)
