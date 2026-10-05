"""GET /api/v1/internal-organization (API-SPEC-007, draft; BR-PTY-28): lectura del registro único."""
from datetime import date, timedelta

import pytest

from tests.integration.org_helpers import CONTACT, add_internal_org, mk

URL = "/api/v1/internal-organization"


@pytest.mark.asyncio
async def test_200_con_los_seis_campos(async_client, engine, jefe):
    pid = await add_internal_org(engine, name="COMSATEL S.A.C.", ruc="20123456780", days_ago=5)
    r = await async_client.get(URL, headers=jefe)
    assert r.status_code == 200
    assert r.json() == {
        "data": {
            "id": pid,
            "name": "COMSATEL S.A.C.",
            "ruc": "20123456780",
            "ruc_country": "PE",
            "from_date": (date.today() - timedelta(days=5)).isoformat(),
            "thru_date": None,
        }
    }


@pytest.mark.asyncio
async def test_404_si_no_hay_organizacion_interna_vigente(async_client, engine, jefe):
    r = await async_client.get(URL, headers=jefe)
    assert r.status_code == 404 and r.json()["error"]["code"] == "INTERNAL_ORGANIZATION_NOT_FOUND"
    await add_internal_org(engine, thru=date.today() - timedelta(days=1), days_ago=30)  # con el rol cerrado
    assert (await async_client.get(URL, headers=jefe)).status_code == 404


@pytest.mark.asyncio
async def test_admin_si_colaborador_no(async_client, engine, as_user, colaborador):
    await add_internal_org(engine)
    assert (await async_client.get(URL, headers=as_user("admin.ti", "admin"))).status_code == 200
    r = await async_client.get(URL, headers=colaborador)
    assert r.status_code == 403 and r.json()["error"]["code"] == "AUTHORIZATION_FAILED"


@pytest.mark.asyncio
async def test_sin_token_401(async_client):
    assert (await async_client.get(URL)).status_code == 401


@pytest.mark.asyncio
@pytest.mark.parametrize("method", ["patch", "put", "delete"])
async def test_solo_lectura_405(async_client, engine, jefe, method):
    await add_internal_org(engine)
    r = await getattr(async_client, method)(URL, headers=jefe)
    assert r.status_code == 405 and r.json()["error"]["code"] == "METHOD_NOT_ALLOWED"


@pytest.mark.asyncio
async def test_una_unidad_o_un_proveedor_nunca_se_devuelven(async_client, jefe):
    await mk(async_client, jefe, "Ingeniería")
    await async_client.post(
        "/api/v1/organizations",
        json={"name": "Seguridad Sur", "type": "external_provider", "ruc": "20123456789", "contact": CONTACT},
        headers=jefe,
    )
    assert (await async_client.get(URL, headers=jefe)).status_code == 404


@pytest.mark.asyncio
async def test_con_mas_de_una_vigente_devuelve_la_mas_reciente(async_client, engine, jefe):
    await add_internal_org(engine, name="Vieja", ruc="20111111111", days_ago=40)
    nueva = await add_internal_org(engine, name="Nueva", ruc="20222222222", days_ago=2)
    assert (await async_client.get(URL, headers=jefe)).json()["data"]["id"] == nueva
