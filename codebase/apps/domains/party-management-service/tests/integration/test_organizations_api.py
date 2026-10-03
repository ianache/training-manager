import uuid
from datetime import date, timedelta

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app.models.party import Organization, Party, PartyIdentification, PartyRelationship, PartyRole


async def seed(engine, name, kind="ORGANIZATIONAL_UNIT", parent=None, ruc=None, thru=None, code=None, location=None):
    pid, rid = str(uuid.uuid4()), str(uuid.uuid4())
    async with sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)() as db:
        db.add(Party(pk_party_id=pid, party_kind="ORGANIZATION", created_by="t"))
        db.add(Organization(pk_party_id=pid, organization_name=name, code=code, location=location, created_by="t"))
        db.add(
            PartyRole(
                pk_party_role_id=rid,
                fk_party_id=pid,
                party_kind="ORGANIZATION",
                fk_party_role_type_code=kind,
                from_date=date.today() - timedelta(days=30),
                thru_date=thru,
                created_by="t",
            )
        )
        if ruc:
            db.add(
                PartyIdentification(
                    pk_party_identification_id=str(uuid.uuid4()),
                    fk_party_id=pid,
                    party_kind="ORGANIZATION",
                    fk_identification_type_code="RUC",
                    identification_number=ruc,
                    issuing_country_code="PE",
                    created_by="t",
                )
            )
        if parent:
            db.add(
                PartyRelationship(
                    pk_party_relationship_id=str(uuid.uuid4()),
                    fk_party_relationship_type_code="ORG_STRUCTURE",
                    fk_party_role_from_id=rid,
                    fk_party_role_to_id=parent[1],
                    from_date=date.today(),
                    created_by="t",
                )
            )
        await db.commit()
    return pid, rid


URL = "/api/v1/organizations"


@pytest.mark.asyncio
async def test_list_filters_by_type_and_returns_envelope(async_client, engine, colaborador):
    await seed(engine, "Ingeniería")
    await seed(engine, "Seguridad Sur", kind="SUPPLIER", ruc="20123456789")
    r = await async_client.get(URL, params={"type": "external_provider"}, headers=colaborador)
    assert r.status_code == 200
    body = r.json()
    assert [o["name"] for o in body["data"]] == ["Seguridad Sur"]
    assert body["data"][0]["ruc"] == "20123456789" and body["data"][0]["type"] == "external_provider"
    assert body["pagination"]["total"] == 1 and body["filters_applied"]["type"] == "external_provider"


@pytest.mark.asyncio
async def test_unit_has_no_ruc_and_exposes_code_location_parent(async_client, engine, colaborador):
    root = await seed(engine, "Ingeniería")
    await seed(engine, "Backend", parent=root, code="ING-BE", location="Sede Central")
    r = await async_client.get(URL, params={"parent_id": root[0]}, headers=colaborador)
    (o,) = r.json()["data"]
    assert (o["name"], o["parent_id"], o["code"], o["location"], o["ruc"]) == (
        "Backend",
        root[0],
        "ING-BE",
        "Sede Central",
        None,
    )


@pytest.mark.asyncio
async def test_default_status_is_active_only(async_client, engine, colaborador):
    await seed(engine, "Vigente")
    await seed(engine, "Baja", thru=date.today() - timedelta(days=1))

    def names(r):
        return [o["name"] for o in r.json()["data"]]

    assert names(await async_client.get(URL, headers=colaborador)) == ["Vigente"]
    assert names(await async_client.get(URL, params={"status": "inactive"}, headers=colaborador)) == ["Baja"]


@pytest.mark.asyncio
async def test_search_is_case_insensitive_partial_and_literal_for_wildcards(async_client, engine, colaborador):
    await seed(engine, "Ingeniería Backend")
    await seed(engine, "100% Cobertura")
    await seed(engine, "Operaciones")

    def get(s):
        return async_client.get(URL, params={"search": s}, headers=colaborador)

    assert [o["name"] for o in (await get("backend")).json()["data"]] == ["Ingeniería Backend"]
    assert [o["name"] for o in (await get("100%")).json()["data"]] == ["100% Cobertura"]
    assert (await get("%")).json()["pagination"]["total"] == 1  # % es literal, no comodín
    assert (await get("_")).json()["pagination"]["total"] == 0


@pytest.mark.asyncio
async def test_search_by_exact_ruc_finds_the_provider(async_client, engine, colaborador):
    await seed(engine, "Seguridad Sur", kind="SUPPLIER", ruc="20123456789")
    r = await async_client.get(URL, params={"search": "20123456789"}, headers=colaborador)
    assert [o["name"] for o in r.json()["data"]] == ["Seguridad Sur"]


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "params",
    [{"type": "foo"}, {"limit": 0}, {"limit": 101}, {"sort": "ruc:asc"}, {"status": "x"}, {"parent_id": "no-uuid"}],
)
async def test_invalid_query_is_400(async_client, colaborador, params):
    r = await async_client.get(URL, params=params, headers=colaborador)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_pagination_and_default_sort_by_name(async_client, engine, colaborador):
    for n in ("C", "A", "B"):
        await seed(engine, n)
    r = await async_client.get(URL, params={"limit": 2, "page": 2}, headers=colaborador)
    assert [o["name"] for o in r.json()["data"]] == ["C"]
    assert r.json()["pagination"] == {"page": 2, "limit": 2, "total": 3, "total_pages": 2, "has_next": False, "has_prev": True}


@pytest.mark.asyncio
async def test_get_by_id_404_and_400(async_client, engine, colaborador):
    pid, _ = await seed(engine, "Ingeniería")
    assert (await async_client.get(f"{URL}/{pid}", headers=colaborador)).json()["name"] == "Ingeniería"
    assert (await async_client.get(f"{URL}/{uuid.uuid4()}", headers=colaborador)).status_code == 404
    assert (await async_client.get(f"{URL}/no-uuid", headers=colaborador)).status_code == 400


@pytest.mark.asyncio
async def test_requires_service_token(async_client):
    assert (await async_client.get(URL)).status_code == 401


@pytest.mark.asyncio
async def test_sort_direction_is_honoured(async_client, engine, colaborador):
    for n in ("B", "A", "C"):
        await seed(engine, n)
    r = await async_client.get(URL, params={"sort": "name:desc"}, headers=colaborador)
    assert [o["name"] for o in r.json()["data"]] == ["C", "B", "A"]


@pytest.mark.asyncio
async def test_organization_without_contact_returns_empty_lists(async_client, engine, colaborador):
    pid, _ = await seed(engine, "Heredada")
    r = await async_client.get(f"{URL}/{pid}", headers=colaborador)
    assert r.status_code == 200 and r.json()["contact"] == {"emails": [], "phones": []}
