from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.schemas.party import (
    PartyCreateRequest,
    PartyResponseFull,
    PartyResponseLimited,
    PartyUpdateRequest,
)
from app.services.party_service import PartyService
from app.core.auth import get_current_user
from app.core.authorization import check_jefe_ingeniera, get_user_roles
from app.database.engine import get_db

router = APIRouter(prefix="/api/v1/parties", tags=["parties"])


@router.post("", status_code=201, response_model=PartyResponseFull)
async def create_party(
    payload: PartyCreateRequest,
    current_user: str = Depends(check_jefe_ingeniera),
    db: AsyncSession = Depends(get_db),
):
    """Create a new party (employee or contractor). Only Jefe de Ingeniería can create."""
    service = PartyService(db)
    party = await service.create(payload, current_user)
    return PartyResponseFull.from_orm(party)


@router.get("", response_model=list[PartyResponseLimited])
async def list_parties(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all parties (paginated). Jefe sees full data, Colaborador sees limited."""
    service = PartyService(db)
    parties = await service.list(skip, limit)

    roles = await get_user_roles(current_user)
    if "jefe_ingeniera" in roles:
        return [PartyResponseFull.from_orm(p) for p in parties]
    else:
        return [PartyResponseLimited.from_orm(p) for p in parties]


@router.get("/{party_id}", response_model=PartyResponseFull)
async def get_party(
    party_id: UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve a single party by ID. Jefe can see any; Colaborador only their own."""
    service = PartyService(db)
    party = await service.get(str(party_id))

    roles = await get_user_roles(current_user)
    if "jefe_ingeniera" not in roles:
        raise HTTPException(status_code=403, detail="Cannot access other party's data")

    return PartyResponseFull.from_orm(party)


@router.patch("/{party_id}", response_model=PartyResponseFull)
async def update_party(
    party_id: UUID,
    payload: PartyUpdateRequest,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a party (limited fields only: preferred_name, phone_work)."""
    service = PartyService(db)
    party = await service.update(str(party_id), payload, current_user)
    return PartyResponseFull.from_orm(party)
