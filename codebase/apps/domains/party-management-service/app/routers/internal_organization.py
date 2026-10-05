"""/api/v1/internal-organization — API-SPEC-007 (draft). Solo lectura del registro único de la organización interna."""
from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import Caller
from app.core.authorization import require_structure_manager
from app.core.rate_limit import rate_limited
from app.database.engine import get_db
from app.schemas.organization import InternalOrganizationCreateRequest, InternalOrganizationEnvelope
from app.services.organization_service import OrganizationService

def _etag(response: Response, org) -> dict:
    response.headers["ETag"] = f'"{org.row_version}"'
    return {"data": org}


router = APIRouter(prefix="/api/v1/internal-organization", tags=["internal-organization"])


@router.get("", dependencies=[Depends(rate_limited("read"))], response_model=InternalOrganizationEnvelope)
async def get_internal_organization(
    response: Response, caller: Caller = Depends(require_structure_manager), db: AsyncSession = Depends(get_db)
):
    """SCR-017-01: la organización interna con el rol vigente; 404 si no hay (BR-PTY-17: Jefe de Ingeniería o ADMIN)."""
    return _etag(response, await OrganizationService(db).get_internal())


@router.post("", status_code=201, dependencies=[Depends(rate_limited("create"))], response_model=InternalOrganizationEnvelope)
async def create_internal_organization(
    payload: InternalOrganizationCreateRequest,
    response: Response,
    caller: Caller = Depends(require_structure_manager),
    db: AsyncSession = Depends(get_db),
):
    """SCR-017-02: alta inicial única (EVD-2026-0242); 409 si ya existe (BR-PTY-28 enmendada). Sin edición ni baja."""
    return _etag(response, await OrganizationService(db).create_internal(payload, caller.username))
