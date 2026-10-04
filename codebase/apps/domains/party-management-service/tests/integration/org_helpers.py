"""Ayudas de las pruebas de la gestión de unidades (DCP-004 fase 2). Respetan el orden de FKs de PostgreSQL."""
import uuid
from datetime import date, timedelta

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.party import (
    Organization,
    Party,
    PartyIdentification,
    PartyRelationship,
    PartyRole,
    Person,
)

URL = "/api/v1/organizations"
CONTACT = {"email_work": "contacto@example.com"}
GHOST = "6f1c2a3e-8d4b-4c7a-9e1f-0a2b3c4d5e6f"
_n = iter(range(10_000))


async def mk(c, h, name, parent=None):
    """Crea una unidad por la API; cada una con su propio correo (un correo es un único medio)."""
    body = {"name": name, "type": "internal_unit", "contact": {"email_work": f"u{next(_n)}@example.com"}}
    if parent:
        body["parent_id"] = parent["id"] if isinstance(parent, dict) else parent
    r = await c.post(URL, json=body, headers=h)
    assert r.status_code == 201, r.text
    return r.json()


def sessions(engine):
    return sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def scalar(engine, sql, **params):
    async with engine.connect() as conn:
        return (await conn.execute(text(sql), params)).scalar()


async def rows(engine, sql, **params):
    async with engine.connect() as conn:
        return (await conn.execute(text(sql), params)).all()


async def add_member(engine, unit_id, thru=None):
    """Una persona con pertenencia (MEMBERSHIP) a la unidad."""
    pid, rid = str(uuid.uuid4()), str(uuid.uuid4())
    async with sessions(engine)() as db:
        unit_role = await db.scalar(
            __import__("sqlalchemy").select(PartyRole.pk_party_role_id).where(
                PartyRole.fk_party_id == unit_id, PartyRole.thru_date.is_(None)
            )
        )
        db.add(Party(pk_party_id=pid, party_kind="PERSON", created_by="t"))
        await db.flush()
        db.add(Person(pk_party_id=pid, employee_code=str(uuid.uuid4()), given_names="Ana", family_names="Gómez", created_by="t"))
        db.add(
            PartyRole(
                pk_party_role_id=rid, fk_party_id=pid, party_kind="PERSON", fk_party_role_type_code="EMPLOYEE",
                from_date=date.today() - timedelta(days=10), created_by="t",
            )
        )
        await db.flush()
        db.add(
            PartyRelationship(
                pk_party_relationship_id=str(uuid.uuid4()), fk_party_relationship_type_code="MEMBERSHIP",
                fk_party_role_from_id=rid, fk_party_role_to_id=unit_role,
                from_date=date.today() - timedelta(days=10), thru_date=thru, created_by="t",
            )
        )
        await db.commit()
    return pid


async def add_internal_org(engine, name="COMSATEL S.A.C.", ruc="20123456780", thru=None, days_ago=5):
    pid, rid = str(uuid.uuid4()), str(uuid.uuid4())
    async with sessions(engine)() as db:
        db.add(Party(pk_party_id=pid, party_kind="ORGANIZATION", created_by="t"))
        await db.flush()
        db.add(Organization(pk_party_id=pid, organization_name=name, created_by="t"))
        await db.flush()
        db.add(
            PartyRole(
                pk_party_role_id=rid, fk_party_id=pid, party_kind="ORGANIZATION",
                fk_party_role_type_code="INTERNAL_ORGANIZATION", from_date=date.today() - timedelta(days=days_ago),
                thru_date=thru, thru_recorded_at=None if thru is None else __import__("datetime").datetime(2026, 1, 1),
                thru_recorded_by=None if thru is None else "t", created_by="t",
            )
        )
        db.add(
            PartyIdentification(
                pk_party_identification_id=str(uuid.uuid4()), fk_party_id=pid, party_kind="ORGANIZATION",
                fk_identification_type_code="RUC", identification_number=ruc, issuing_country_code="PE", created_by="t",
            )
        )
        await db.commit()
    return pid
