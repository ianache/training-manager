from datetime import date

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
        db.add(
            PartyRelationship(
                pk_party_relationship_id="r1",
                fk_party_relationship_type_code="ORG_STRUCTURE",
                fk_party_role_from_id="a",
                fk_party_role_to_id="b",
                from_date=date.today(),
                created_by="t",
            )
        )
        await db.commit()
        assert (await db.get(PartyRelationship, "r1")).fk_party_role_to_id == "b"
