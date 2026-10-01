"""
/api/v1/parties — API-SPEC-001 §3.1.

Solo lo llama el BFF (ADR-001). Toda ruta exige el token de servicio del BFF y X-User-Name
(ADR-005 §2); la autoría de cada cambio es el usuario final, no el BFF.
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import Caller, get_caller
from app.core.authorization import can_see_full, require_jefe_ingenieria
from app.core.errors import ApiError
from app.core.rate_limit import rate_limited
from app.database.engine import get_db
from app.schemas.party import (
    Contact,
    ContactLimited,
    Identification,
    Page,
    Pagination,
    PartyCreateRequest,
    PartyDetail,
    PartyStatus,
    PartySummary,
    PartyType,
    PartyUpdateRequest,
)
from app.services.party_service import PartyService, PartyView, total_pages

router = APIRouter(prefix="/api/v1/parties", tags=["parties"])


def to_summary(p: PartyView) -> PartySummary:
    return PartySummary(
        id=p.id,
        code=p.code,
        first_names=p.first_names,
        last_names=p.last_names,
        preferred_name=p.preferred_name,
        contact=ContactLimited(email_work=p.email_work),
        role=p.role or "",
        status=p.status,
    )


def to_detail(p: PartyView) -> PartyDetail:
    return PartyDetail(
        **to_summary(p).model_dump(exclude={"contact"}),
        contact=Contact(email_work=p.email_work, phone_work=p.phone_work),
        identification=Identification(
            type=p.identification_type, number=p.identification_number, country=p.identification_country
        ),
        created_by=p.created_by,
        created_at=p.created_at,
        updated_by=p.updated_by,
        updated_at=p.updated_at,
    )


def present(p: PartyView, caller: Caller) -> PartySummary | PartyDetail:
    return to_detail(p) if can_see_full(caller) else to_summary(p)


@router.get(
    "",
    dependencies=[Depends(rate_limited("read"))],
    response_model=Page[PartyDetail] | Page[PartySummary],
    response_model_exclude_none=False,
)
async def list_parties(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("created_at:desc", max_length=40),
    status: Optional[PartyStatus] = Query(None),
    role: Optional[PartyType] = Query(None),
    search: Optional[str] = Query(None, max_length=100),
    unit_id: Optional[str] = Query(None),
    caller: Caller = Depends(get_caller),
    db: AsyncSession = Depends(get_db),
):
    """US-023: lista paginada. El Jefe de Ingeniería ve la ficha completa; el resto, la limitada."""
    if unit_id:
        raise ApiError(
            400, "VALIDATION_ERROR", "El filtro por unidad todavía no está disponible.", {"field": "unit_id"}
        )
    rows, total, applied = await PartyService(db).list(page, limit, sort, status, role.value if role else None, search)
    pages = total_pages(total, limit)
    return {
        "data": [present(p, caller) for p in rows],
        "pagination": Pagination(
            page=page, limit=limit, total=total, total_pages=pages, has_next=page < pages, has_prev=page > 1
        ),
        "filters_applied": applied,
    }


@router.get("/{party_id}", dependencies=[Depends(rate_limited("read"))], response_model=PartyDetail | PartySummary)
async def get_party(party_id: UUID, caller: Caller = Depends(get_caller), db: AsyncSession = Depends(get_db)):
    """US-023: ficha. Otros colaboradores reciben la vista limitada (UXR-000.5), no un 403."""
    return present(await PartyService(db).get(party_id), caller)


@router.post("", status_code=201, dependencies=[Depends(rate_limited("create"))], response_model=PartyDetail)
async def create_party(
    payload: PartyCreateRequest,
    caller: Caller = Depends(require_jefe_ingenieria),
    db: AsyncSession = Depends(get_db),
):
    """US-015: registrar colaborador (solo Jefe de Ingeniería)."""
    return to_detail(await PartyService(db).create(payload, caller.username))


@router.patch("/{party_id}", dependencies=[Depends(rate_limited("update"))], response_model=PartyDetail)
async def update_party(
    party_id: UUID,
    payload: PartyUpdateRequest,
    caller: Caller = Depends(require_jefe_ingenieria),
    db: AsyncSession = Depends(get_db),
):
    """US-016: actualizar nombre preferido y teléfono. Por ahora solo el Jefe de Ingeniería
    (que el colaborador edite lo suyo requiere el vínculo con Keycloak, US-022)."""
    return to_detail(await PartyService(db).update(party_id, payload, caller.username))
