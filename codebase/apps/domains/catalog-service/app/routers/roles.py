"""/api/v1/roles — API-SPEC-003. Solo lo llama el BFF (ADR-001)."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import Caller, get_caller
from app.core.authorization import require_level_status_editor, require_role_editor
from app.core.errors import ApiError
from app.core.rate_limit import rate_limited
from app.database.engine import get_db
from app.schemas.catalog import Page, Pagination, RoleDetailOut, RoleIn, RoleSummaryOut, Status
from app.services.role_service import RoleService, total_pages

router = APIRouter(prefix="/api/v1/roles", tags=["roles"])


def _row_version(if_match: Optional[str], required: bool) -> Optional[int]:
    """`If-Match: <row_version>` (LDM-002 CM-09); acepta las comillas de un ETag."""
    if if_match is None:
        if required:
            raise ApiError(428, "PRECONDITION_REQUIRED", "Falta el header If-Match con la versión del rol.")
        return None
    try:
        return int(if_match.strip().strip('"'))
    except ValueError:
        raise ApiError(400, "VALIDATION_ERROR", "If-Match debe ser el número de versión del rol.")


def _with_etag(response: Response, role: dict) -> dict:
    response.headers["ETag"] = f'"{role["row_version"]}"'
    return role


@router.get("", dependencies=[Depends(rate_limited("read"))], response_model=Page[RoleSummaryOut])
async def list_roles(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort: str = Query("name:asc", max_length=40),
    status: Optional[Status] = Query(None),
    search: Optional[str] = Query(None, max_length=100),
    caller: Caller = Depends(get_caller),
    db: AsyncSession = Depends(get_db),
):
    rows, total, applied = await RoleService(db).list(page, limit, sort, status.value if status else None, search)
    pages = total_pages(total, limit)
    return {
        "data": rows,
        "pagination": Pagination(
            page=page, limit=limit, total=total, total_pages=pages, has_next=page < pages, has_prev=page > 1
        ),
        "filters_applied": applied,
    }


@router.get("/{role_id}", dependencies=[Depends(rate_limited("read"))], response_model=RoleDetailOut)
async def get_role(
    role_id: UUID, response: Response, caller: Caller = Depends(get_caller), db: AsyncSession = Depends(get_db)
):
    return _with_etag(response, await RoleService(db).get(str(role_id)))


@router.post("", status_code=201, dependencies=[Depends(rate_limited("create"))], response_model=RoleDetailOut)
async def create_role(
    payload: RoleIn,
    response: Response,
    caller: Caller = Depends(require_role_editor),
    db: AsyncSession = Depends(get_db),
):
    role = await RoleService(db).create(payload, caller.username)
    response.headers["Location"] = f"/api/v1/roles/{role['id']}"
    return _with_etag(response, role)


@router.put("/{role_id}", dependencies=[Depends(rate_limited("update"))], response_model=RoleDetailOut)
async def update_role(
    role_id: UUID,
    payload: RoleIn,
    response: Response,
    if_match: Optional[str] = Header(default=None),
    caller: Caller = Depends(require_role_editor),
    db: AsyncSession = Depends(get_db),
):
    version = _row_version(if_match, True)
    return _with_etag(response, await RoleService(db).update(str(role_id), payload, caller.username, version))


@router.post("/{role_id}/deactivate", dependencies=[Depends(rate_limited("update"))], response_model=RoleDetailOut)
async def deactivate_role(
    role_id: UUID,
    response: Response,
    if_match: Optional[str] = Header(default=None),
    caller: Caller = Depends(require_role_editor),
    db: AsyncSession = Depends(get_db),
):
    version = _row_version(if_match, False)
    return _with_etag(response, await RoleService(db).deactivate(str(role_id), caller.username, version))


@router.post(
    "/{role_id}/levels/{level_id}/deactivate",
    dependencies=[Depends(rate_limited("update"))],
    response_model=RoleDetailOut,
)
async def deactivate_level(
    role_id: UUID,
    level_id: UUID,
    response: Response,
    caller: Caller = Depends(require_level_status_editor),
    db: AsyncSession = Depends(get_db),
):
    role = await RoleService(db).set_level_status(str(role_id), str(level_id), "INACTIVE", caller.username)
    return _with_etag(response, role)


@router.post(
    "/{role_id}/levels/{level_id}/reactivate",
    dependencies=[Depends(rate_limited("update"))],
    response_model=RoleDetailOut,
)
async def reactivate_level(
    role_id: UUID,
    level_id: UUID,
    response: Response,
    caller: Caller = Depends(require_level_status_editor),
    db: AsyncSession = Depends(get_db),
):
    role = await RoleService(db).set_level_status(str(role_id), str(level_id), "ACTIVE", caller.username)
    return _with_etag(response, role)
