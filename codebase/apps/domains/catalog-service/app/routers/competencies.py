"""/api/v1/competencies — API-SPEC-003. Solo lectura en este tramo."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import Caller, get_caller
from app.core.rate_limit import rate_limited
from app.database.engine import get_db
from app.schemas.catalog import CompetencyDetailOut, CompetencySummaryOut, Page, Pagination, Status
from app.services.competency_service import CompetencyService
from app.services.role_service import total_pages

router = APIRouter(prefix="/api/v1/competencies", tags=["competencies"])


@router.get("", dependencies=[Depends(rate_limited("read"))], response_model=Page[CompetencySummaryOut])
async def list_competencies(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[Status] = Query(None),
    search: Optional[str] = Query(None, max_length=100),
    caller: Caller = Depends(get_caller),
    db: AsyncSession = Depends(get_db),
):
    rows, total, applied = await CompetencyService(db).list(page, limit, status.value if status else None, search)
    pages = total_pages(total, limit)
    return {
        "data": rows,
        "pagination": Pagination(
            page=page, limit=limit, total=total, total_pages=pages, has_next=page < pages, has_prev=page > 1
        ),
        "filters_applied": applied,
    }


@router.get("/{competency_id}", dependencies=[Depends(rate_limited("read"))], response_model=CompetencyDetailOut)
async def get_competency(
    competency_id: UUID, caller: Caller = Depends(get_caller), db: AsyncSession = Depends(get_db)
):
    return await CompetencyService(db).get(str(competency_id))
