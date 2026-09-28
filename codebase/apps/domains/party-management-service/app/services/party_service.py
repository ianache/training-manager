from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.party import Party
from app.schemas.party import PartyCreateRequest, PartyUpdateRequest
from app.core.exceptions import DuplicateEmailError, PartyNotFoundError
from app.core.logging import logger


class PartyService:
    """Business logic for Party operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, payload: PartyCreateRequest, current_user: str) -> Party:
        """
        Create a new party with validation and audit.

        Raises:
            DuplicateEmailError: if email already exists (active parties only)
        """
        existing = await self.db.execute(
            select(Party).where(
                (Party.email_work == payload.email_work) &
                (Party.status != "anonymized")
            )
        )
        if existing.scalar():
            logger.warning("duplicate_email_attempt", email="<redacted>")
            raise DuplicateEmailError()

        party = Party(
            pk_party_id=uuid4(),
            code=str(uuid4())[:20],
            first_names=payload.first_names,
            last_names=payload.last_names,
            preferred_name=payload.preferred_name,
            identification_type=payload.identification_type.value,
            identification_number=payload.identification_number,
            identification_country=payload.identification_country,
            email_work=payload.email_work,
            phone_work=payload.phone_work,
            party_type=payload.party_type.value,
            status="active",
            created_by=current_user,
            created_at=datetime.utcnow()
        )

        async with self.db.begin():
            self.db.add(party)
            await self.db.flush()

        logger.info("party_created", party_id=str(party.pk_party_id), created_by=current_user)
        return party

    async def get(self, party_id: str) -> Party:
        """Retrieve party by ID"""
        party = await self.db.get(Party, party_id)
        if not party:
            raise PartyNotFoundError()
        return party

    async def list(self, skip: int = 0, limit: int = 20) -> list[Party]:
        """List parties with pagination"""
        result = await self.db.execute(
            select(Party)
            .where(Party.status != "anonymized")
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def update(self, party_id: str, payload: PartyUpdateRequest, current_user: str) -> Party:
        """Update party (limited fields)"""
        party = await self.get(party_id)

        if payload.preferred_name is not None:
            party.preferred_name = payload.preferred_name
        if payload.phone_work is not None:
            party.phone_work = payload.phone_work

        party.updated_by = current_user
        party.updated_at = datetime.utcnow()

        async with self.db.begin():
            self.db.add(party)
            await self.db.flush()

        logger.info("party_updated", party_id=str(party.pk_party_id), updated_by=current_user)
        return party
