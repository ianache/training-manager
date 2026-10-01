"""
Q-11: la API escribe y lee el modelo físico PDM-001 (tablas tb_* normalizadas).
Corre en SQLite y, con TEST_DATABASE_URL, sobre el esquema real de Alembic.
"""
from datetime import date, datetime, timedelta

import pytest
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.party import (
    ContactMechanism,
    PartyContactMechanism,
    PartyIdentification,
    PartyRole,
    Person,
)


async def _create(client, headers, payload, **overrides):
    r = await client.post("/api/v1/parties", json={**payload, **overrides}, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()


@pytest.fixture
def session_factory(engine):
    return sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def test_alta_descompone_en_tablas_pdm(async_client, jefe, party_payload, session_factory):
    body = await _create(async_client, jefe, party_payload, phone_work="+51 999 111 222", party_type="Contractor")
    async with session_factory() as db:
        person = await db.get(Person, body["id"])
        assert (person.given_names, person.family_names) == ("Juan", "Pérez López")
        assert person.employee_code == body["code"] and len(body["code"]) == 36  # GUID (D25)
        role = await db.scalar(select(PartyRole).where(PartyRole.fk_party_id == body["id"]))
        assert role.fk_party_role_type_code == "CONTRACTOR" and role.thru_date is None
        ident = await db.scalar(select(PartyIdentification).where(PartyIdentification.fk_party_id == body["id"]))
        assert (ident.fk_identification_type_code, ident.issuing_country_code) == ("DNI", "PE")
        purposes = set(
            await db.scalars(
                select(PartyContactMechanism.fk_contact_purpose_type_code).where(
                    PartyContactMechanism.fk_party_id == body["id"]
                )
            )
        )
        assert purposes == {"WORK_EMAIL", "WORK_PHONE"}
    assert body["role"] == "Contractor"
    assert body["contact"] == {"email_work": "juan.perez@example.com", "phone_work": "+51 999 111 222"}


async def test_pasaporte_se_guarda_con_el_codigo_de_catalogo(async_client, jefe, party_payload, session_factory):
    body = await _create(
        async_client, jefe, party_payload, identification_type="Passport", identification_number="AB12345"
    )
    assert body["identification"]["type"] == "Passport"
    async with session_factory() as db:
        ident = await db.scalar(select(PartyIdentification).where(PartyIdentification.fk_party_id == body["id"]))
        assert ident.fk_identification_type_code == "PASSPORT"


async def test_correo_duplicado_sin_distinguir_mayusculas(async_client, jefe, party_payload):
    await _create(async_client, jefe, party_payload)
    r = await async_client.post(
        "/api/v1/parties",
        json={**party_payload, "email_work": "JUAN.PEREZ@example.com", "identification_number": "87654321"},
        headers=jefe,
    )
    assert r.status_code == 409 and r.json()["error"]["code"] == "EMAIL_DUPLICATE"


async def test_cambio_de_telefono_cierra_el_anterior(async_client, jefe, party_payload, session_factory):
    p = await _create(async_client, jefe, party_payload, phone_work="+51 111 111 111")
    r = await async_client.patch(f"/api/v1/parties/{p['id']}", json={"phone_work": "+51 222 222 222"}, headers=jefe)
    assert r.json()["contact"]["phone_work"] == "+51 222 222 222"
    async with session_factory() as db:
        links = (
            await db.scalars(
                select(PartyContactMechanism).where(
                    PartyContactMechanism.fk_party_id == p["id"],
                    PartyContactMechanism.fk_contact_purpose_type_code == "WORK_PHONE",
                )
            )
        ).all()
        assert sorted(link.thru_date is None for link in links) == [False, True]  # BR-PTY-09: hay historial
        values = set(await db.scalars(select(ContactMechanism.contact_value)))
        assert {"+51 111 111 111", "+51 222 222 222"} <= values
    cleared = await async_client.patch(f"/api/v1/parties/{p['id']}", json={"phone_work": None}, headers=jefe)
    assert cleared.json()["contact"]["phone_work"] is None


async def test_estado_inactivo_y_anonimizado(async_client, jefe, party_payload, session_factory):
    a = await _create(async_client, jefe, party_payload)
    b = await _create(async_client, jefe, party_payload, email_work="b@example.com", identification_number="22222222")
    yesterday = date.today() - timedelta(days=1)
    async with session_factory() as db:
        await db.execute(
            update(PartyRole)
            .where(PartyRole.fk_party_id == a["id"])
            .values(
                from_date=yesterday - timedelta(days=10),
                thru_date=yesterday,
                thru_recorded_at=datetime.utcnow(),
                thru_recorded_by="test",
            )
        )
        await db.execute(
            update(Person)
            .where(Person.pk_party_id == b["id"])
            .values(
                anonymized_at=datetime.utcnow(),
                anonymized_by="test",
                given_names=None,
                family_names=None,
                preferred_name=None,
            )
        )
        await db.commit()
    assert (await async_client.get(f"/api/v1/parties/{a['id']}", headers=jefe)).json()["status"] == "inactive"
    default = (await async_client.get("/api/v1/parties", headers=jefe)).json()
    assert [p["id"] for p in default["data"]] == [a["id"]]  # sin anonimizados por defecto
    inactive = (await async_client.get("/api/v1/parties", params={"status": "inactive"}, headers=jefe)).json()
    assert [p["id"] for p in inactive["data"]] == [a["id"]]
    anonymized = (await async_client.get("/api/v1/parties", params={"status": "anonymized"}, headers=jefe)).json()
    assert [p["status"] for p in anonymized["data"]] == ["anonymized"]


async def test_busqueda_por_correo_y_orden_por_apellido(async_client, jefe, party_payload):
    await _create(async_client, jefe, party_payload, last_names="Zapata")
    await _create(
        async_client,
        jefe,
        party_payload,
        last_names="Alva",
        email_work="alva@example.com",
        identification_number="33333333",
    )
    found = (await async_client.get("/api/v1/parties", params={"search": "ALVA@"}, headers=jefe)).json()
    assert [p["last_names"] for p in found["data"]] == ["Alva"]
    ordered = (await async_client.get("/api/v1/parties", params={"sort": "last_names:asc"}, headers=jefe)).json()
    assert [p["last_names"] for p in ordered["data"]] == ["Alva", "Zapata"]


async def test_numero_de_identificacion_hasta_20(async_client, jefe, party_payload):
    r = await async_client.post(
        "/api/v1/parties", json={**party_payload, "identification_number": "1" * 21}, headers=jefe
    )
    assert r.status_code == 400


async def test_semilla_de_desarrollo(engine, monkeypatch):
    from app.database import seed

    monkeypatch.setattr(seed, "async_session", sessionmaker(engine, class_=AsyncSession, expire_on_commit=False))
    await seed.seed_demo_data()
    await seed.seed_demo_data()  # idempotente
    async with seed.async_session() as db:
        assert len((await db.scalars(select(Person))).all()) == 5
