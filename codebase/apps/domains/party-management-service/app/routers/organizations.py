"""/api/v1/organizations — API-SPEC-002. Solo lo llama el BFF (ADR-001)."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import Caller, get_caller
from app.core.authorization import require_structure_manager
from app.core.errors import ApiError
from app.core.rate_limit import rate_limited
from app.database.engine import get_db
from app.schemas.organization import OrganizationCreateRequest, OrganizationRenameRequest, OrganizationOut, OrganizationStatusFilter, ParentChangeRequest, ReactivateRequest, RelationshipOut, OrganizationType, OrganizationView
from app.schemas.party import Page, Pagination
from app.services.organization_service import OrganizationService, total_pages

def if_match_version(if_match: Optional[str] = Header(None)) -> Optional[int]:
    """If-Match con la `row_version` de la unidad (Q-8, supuesto de API-SPEC-006). Ausente o `*`: sin control."""
    if if_match is None or if_match.strip() == "*":
        return None
    token = if_match.strip().removeprefix("W/").strip('"')
    if not token.isdigit():
        raise ApiError(400, "VALIDATION_ERROR", "If-Match debe ser la versión de la unidad.", {"field": "If-Match"})
    return int(token)


def _etag(response: Response, org: OrganizationOut) -> OrganizationOut:
    response.headers["ETag"] = f'"{org.row_version}"'
    return org


router = APIRouter(prefix="/api/v1/organizations", tags=["organizations"])


@router.get("", dependencies=[Depends(rate_limited("read"))], response_model=Page[OrganizationOut])
async def list_organizations(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("name:asc", max_length=40),
    type_: Optional[OrganizationType] = Query(None, alias="type"),
    status: OrganizationStatusFilter = Query(OrganizationStatusFilter.active),
    search: Optional[str] = Query(None, max_length=100),
    parent_id: Optional[UUID] = Query(None),
    ancestor_id: Optional[UUID] = Query(None),
    view: OrganizationView = Query(OrganizationView.list),
    caller: Caller = Depends(get_caller),
    db: AsyncSession = Depends(get_db),
):
    rows, total, applied = await OrganizationService(db).list(
        page, limit, sort, type_, status, search, parent_id, ancestor_id, view
    )
    pages = total_pages(total, limit)
    return {
        "data": rows,
        "pagination": Pagination(
            page=page, limit=limit, total=total, total_pages=pages, has_next=page < pages, has_prev=page > 1
        ),
        "filters_applied": applied,
    }


@router.get("/{org_id}", dependencies=[Depends(rate_limited("read"))], response_model=OrganizationOut)
async def get_organization(
    org_id: UUID, response: Response, caller: Caller = Depends(get_caller), db: AsyncSession = Depends(get_db)
):
    return _etag(response, await OrganizationService(db).get(org_id))


@router.post("", status_code=201, dependencies=[Depends(rate_limited("create"))], response_model=OrganizationOut)
async def create_organization(
    payload: OrganizationCreateRequest,
    response: Response,
    caller: Caller = Depends(require_structure_manager),
    db: AsyncSession = Depends(get_db),
):
    """US-017 / US-018: alta de unidad o proveedor (Jefe de Ingeniería o ADMIN)."""
    org = await OrganizationService(db).create(payload, caller.username)
    response.headers["Location"] = f"/api/v1/organizations/{org.id}"
    return org


@router.patch("/{org_id}", dependencies=[Depends(rate_limited("update"))], response_model=OrganizationOut)
async def rename_organization(
    org_id: UUID,
    payload: OrganizationRenameRequest,
    response: Response,
    version: Optional[int] = Depends(if_match_version),
    caller: Caller = Depends(require_structure_manager),
    db: AsyncSession = Depends(get_db),
):
    """US-029 AC-2: renombrar una unidad conservando el valor anterior (BR-PTY-12)."""
    return _etag(response, await OrganizationService(db).rename(org_id, payload.name, caller.username, version))


@router.post("/{org_id}/parent", dependencies=[Depends(rate_limited("update"))], response_model=OrganizationOut)
async def change_parent(
    org_id: UUID,
    payload: ParentChangeRequest,
    response: Response,
    version: Optional[int] = Depends(if_match_version),
    caller: Caller = Depends(require_structure_manager),
    db: AsyncSession = Depends(get_db),
):
    """US-029 AC-3 a AC-6: cambia la unidad padre cerrando la relación vigente y abriendo la nueva (BR-PTY-12)."""
    org = await OrganizationService(db).change_parent(org_id, payload.parent_id, payload.from_date, caller.username, version)
    return _etag(response, org)


@router.post("/{org_id}/deactivate", dependencies=[Depends(rate_limited("update"))], response_model=OrganizationOut)
async def deactivate_organization(
    org_id: UUID,
    response: Response,
    version: Optional[int] = Depends(if_match_version),
    caller: Caller = Depends(require_structure_manager),
    db: AsyncSession = Depends(get_db),
):
    """US-030 AC-1/AC-2: desactiva (eliminación lógica) una unidad sin dependencias; nada se borra (BR-PTY-12, 21, 23)."""
    return _etag(response, await OrganizationService(db).deactivate(org_id, caller.username, version))


@router.post("/{org_id}/reactivate", dependencies=[Depends(rate_limited("update"))], response_model=OrganizationOut)
async def reactivate_organization(
    org_id: UUID,
    payload: ReactivateRequest,
    response: Response,
    version: Optional[int] = Depends(if_match_version),
    caller: Caller = Depends(require_structure_manager),
    db: AsyncSession = Depends(get_db),
):
    """US-030 AC-3/AC-4: reactiva una unidad con una nueva vigencia y solo bajo un padre activo (BR-PTY-24)."""
    org = await OrganizationService(db).reactivate(
        org_id, payload.from_date, payload.parent_id, "parent_id" in payload.model_fields_set, caller.username, version
    )
    return _etag(response, org)


@router.get("/{org_id}/relationships", dependencies=[Depends(rate_limited("read"))], response_model=Page[RelationshipOut])
async def organization_relationships(
    org_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    caller: Caller = Depends(require_structure_manager),
    db: AsyncSession = Depends(get_db),
):
    """SCR-029-04: historial de relaciones de estructura, de la más reciente a la más antigua."""
    rows, total = await OrganizationService(db).relationships(org_id, page, limit)
    pages = total_pages(total, limit)
    return {
        "data": rows,
        "pagination": Pagination(page=page, limit=limit, total=total, total_pages=pages, has_next=page < pages, has_prev=page > 1),
        "filters_applied": {},
    }
