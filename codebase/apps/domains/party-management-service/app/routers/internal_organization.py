"""/api/v1/internal-organization — API-SPEC-007 (draft). Solo lectura del registro único de la organización interna."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import Caller
from app.core.authorization import require_structure_manager
from app.core.rate_limit import rate_limited
from app.database.engine import get_db
from app.schemas.organization import InternalOrganizationEnvelope
from app.services.organization_service import OrganizationService

router = APIRouter(prefix="/api/v1/internal-organization", tags=["internal-organization"])


@router.get("", dependencies=[Depends(rate_limited("read"))], response_model=InternalOrganizationEnvelope)
async def get_internal_organization(
    caller: Caller = Depends(require_structure_manager), db: AsyncSession = Depends(get_db)
):
    """SCR-017-01: la organización interna con el rol vigente; 404 si no hay (BR-PTY-17: Jefe de Ingeniería o ADMIN)."""
    return {"data": await OrganizationService(db).get_internal()}
