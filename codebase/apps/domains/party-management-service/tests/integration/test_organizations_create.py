import pytest

URL = "/api/v1/organizations"
UNIT = {"name": "Ingeniería", "type": "internal_unit"}
PROVIDER = {"name": "Seguridad Sur", "type": "external_provider", "ruc": "20123456789"}
GHOST = "6f1c2a3e-8d4b-4c7a-9e1f-0a2b3c4d5e6f"


async def post(c, h, body):
    return await c.post(URL, json=body, headers=h)


@pytest.mark.asyncio
async def test_create_unit_201_with_location_header_and_audit(async_client, jefe):
    r = await post(async_client, jefe, {**UNIT, "code": "ING", "location": "Sede Central"})
    assert r.status_code == 201
    b = r.json()
    assert (b["name"], b["type"], b["status"], b["code"], b["location"], b["ruc"], b["parent_id"]) == (
        "Ingeniería",
        "internal_unit",
        "active",
        "ING",
        "Sede Central",
        None,
        None,
    )
    assert r.headers["location"] == f"{URL}/{b['id']}"
    assert (await async_client.get(f"{URL}/{b['id']}", headers=jefe)).json() == b


@pytest.mark.asyncio
async def test_create_provider_stores_ruc_and_is_listed(async_client, jefe):
    assert (await post(async_client, jefe, PROVIDER)).status_code == 201
    r = await async_client.get(URL, params={"type": "external_provider", "search": "20123456789"}, headers=jefe)
    assert [o["ruc"] for o in r.json()["data"]] == ["20123456789"]


@pytest.mark.asyncio
async def test_child_unit_links_to_active_parent(async_client, jefe):
    parent = (await post(async_client, jefe, UNIT)).json()
    child = (await post(async_client, jefe, {"name": "Backend", "type": "internal_unit", "parent_id": parent["id"]})).json()
    assert child["parent_id"] == parent["id"]


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "body",
    [
        {"type": "internal_unit"},
        {"name": "", "type": "internal_unit"},
        {"name": "x" * 201, "type": "internal_unit"},
        {"name": "A", "type": "otro"},
        {"name": "P", "type": "external_provider"},
        {"name": "P", "type": "external_provider", "ruc": "123"},
        {"name": "P", "type": "external_provider", "ruc": "2012345678a"},
        {"name": "P", "type": "external_provider", "ruc": "201234567890"},
        {"name": "U", "type": "internal_unit", "ruc": "20123456789"},
        {"name": "P", "type": "external_provider", "ruc": "20123456789", "code": "X"},
        {"name": "P", "type": "external_provider", "ruc": "20123456789", "location": "X"},
        {"name": "P", "type": "external_provider", "ruc": "20123456789", "parent_id": GHOST},
        {"name": "U", "type": "internal_unit", "code": "x" * 41},
        {"name": "U", "type": "internal_unit", "location": "x" * 121},
        {"name": "U", "type": "internal_unit", "parent_id": "no-uuid"},
        {"name": "U", "type": "internal_unit", "extra": 1},
    ],
)
async def test_validation_400(async_client, jefe, body):
    r = await post(async_client, jefe, body)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_name_is_trimmed_and_whitespace_only_is_rejected(async_client, jefe):
    assert (await post(async_client, jefe, {**UNIT, "name": "  Ingeniería  "})).json()["name"] == "Ingeniería"
    assert (await post(async_client, jefe, {**UNIT, "name": "   "})).status_code == 400


@pytest.mark.asyncio
async def test_missing_parent_404(async_client, jefe):
    assert (await post(async_client, jefe, {**UNIT, "parent_id": GHOST})).status_code == 404


@pytest.mark.asyncio
async def test_provider_as_parent_is_rejected_like_missing(async_client, jefe):
    prov = (await post(async_client, jefe, PROVIDER)).json()
    assert (await post(async_client, jefe, {**UNIT, "parent_id": prov["id"]})).status_code == 404


@pytest.mark.asyncio
async def test_duplicate_name_same_parent_409_any_case_but_other_parent_ok(async_client, jefe):
    a = (await post(async_client, jefe, UNIT)).json()
    b = (await post(async_client, jefe, {"name": "Operaciones", "type": "internal_unit"})).json()
    r = await post(async_client, jefe, {**UNIT, "name": "INGENIERÍA"})
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_DUPLICATE"
    child = {"name": "Backend", "type": "internal_unit"}
    assert (await post(async_client, jefe, {**child, "parent_id": a["id"]})).status_code == 201
    assert (await post(async_client, jefe, {**child, "parent_id": b["id"]})).status_code == 201
    assert (await post(async_client, jefe, {**child, "parent_id": a["id"]})).status_code == 409


@pytest.mark.asyncio
async def test_duplicate_ruc_409(async_client, jefe):
    await post(async_client, jefe, PROVIDER)
    r = await post(async_client, jefe, {**PROVIDER, "name": "Otra razón social"})
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_DUPLICATE"


@pytest.mark.asyncio
async def test_race_on_ruc_is_409_from_the_unique_index_never_500(async_client, jefe, monkeypatch):
    # Carrera: la segunda alta no ve el RUC en la verificación previa; el índice único de PDM-001 decide.
    # (La concurrencia real no es modelable aquí: SQLite en memoria comparte una conexión entre sesiones.)
    from app.services.organization_service import OrganizationService

    assert (await post(async_client, jefe, PROVIDER)).status_code == 201

    async def never_taken(self, ruc):
        return False

    monkeypatch.setattr(OrganizationService, "_ruc_taken", never_taken)
    r = await post(async_client, jefe, {**PROVIDER, "name": "Gemela"})
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_DUPLICATE"


@pytest.mark.asyncio
async def test_non_jefe_gets_403_and_nothing_is_created(async_client, colaborador, jefe):
    assert (await post(async_client, colaborador, UNIT)).status_code == 403
    assert (await async_client.get(URL, headers=jefe)).json()["pagination"]["total"] == 0


@pytest.mark.asyncio
async def test_inactive_unit_cannot_be_a_parent(async_client, engine, jefe):
    from datetime import date, timedelta

    from tests.integration.test_organizations_api import seed

    pid, _ = await seed(engine, "Disuelta", thru=date.today() - timedelta(days=1))
    assert (await post(async_client, jefe, {**UNIT, "parent_id": pid})).status_code == 404
