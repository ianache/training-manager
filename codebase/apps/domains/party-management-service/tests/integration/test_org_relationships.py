"""GET /organizations/{id}/relationships (API-SPEC-006 §3.7, SCR-029-04): historial de relaciones de estructura."""
from datetime import date

import pytest

from tests.integration.org_helpers import GHOST, URL, mk

TODAY = date.today().isoformat()


async def history(c, h, unit, **params):
    r = await c.get(f"{URL}/{unit['id']}/relationships", params=params, headers=h)
    assert r.status_code == 200, r.text
    return r.json()


async def move(c, h, unit, parent):
    r = await c.post(f"{URL}/{unit['id']}/parent", json={"parent_id": parent["id"], "from_date": TODAY}, headers=h)
    assert r.status_code == 200, r.text


@pytest.mark.asyncio
async def test_historial_de_la_mas_reciente_a_la_mas_antigua(async_client, as_user, jefe):
    a, b, c = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B"), await mk(async_client, jefe, "C")
    u = await mk(async_client, jefe, "U", a)
    await move(async_client, jefe, u, b)
    await move(async_client, as_user("admin.ti", "admin"), u, c)
    body = await history(async_client, jefe, u)
    assert body["data"] == [
        {"previous_parent": {"id": b["id"], "name": "B"}, "new_parent": {"id": c["id"], "name": "C"}, "from_date": TODAY, "thru_date": None, "changed_by": "admin.ti"},
        {"previous_parent": {"id": a["id"], "name": "A"}, "new_parent": {"id": b["id"], "name": "B"}, "from_date": TODAY, "thru_date": TODAY, "changed_by": "jefe.ingenieria"},
        {"previous_parent": None, "new_parent": {"id": a["id"], "name": "A"}, "from_date": TODAY, "thru_date": TODAY, "changed_by": "jefe.ingenieria"},
    ]
    assert body["pagination"]["total"] == 3 and body["pagination"]["has_next"] is False


@pytest.mark.asyncio
async def test_unidad_sin_padre_tiene_historial_vacio(async_client, jefe):
    u = await mk(async_client, jefe, "U")
    body = await history(async_client, jefe, u)
    assert body["data"] == [] and body["pagination"]["total"] == 0


@pytest.mark.asyncio
async def test_paginacion(async_client, jefe):
    a, b, c = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B"), await mk(async_client, jefe, "C")
    u = await mk(async_client, jefe, "U", a)
    await move(async_client, jefe, u, b)
    await move(async_client, jefe, u, c)
    p1 = await history(async_client, jefe, u, limit=2, page=1)
    p2 = await history(async_client, jefe, u, limit=2, page=2)
    assert [x["new_parent"]["name"] for x in p1["data"]] == ["C", "B"] and p1["pagination"]["has_next"] is True
    assert [x["new_parent"]["name"] for x in p2["data"]] == ["A"] and p2["pagination"]["has_prev"] is True
    assert (await async_client.get(f"{URL}/{u['id']}/relationships", params={"limit": 0}, headers=jefe)).status_code == 400


@pytest.mark.asyncio
async def test_el_historial_cruza_desactivar_y_reactivar(async_client, jefe):
    a, b = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B")
    u = await mk(async_client, jefe, "U", a)
    await async_client.post(f"{URL}/{u['id']}/deactivate", headers=jefe)
    r = await async_client.post(f"{URL}/{u['id']}/reactivate", json={"from_date": TODAY, "parent_id": b["id"]}, headers=jefe)
    assert r.status_code == 200
    body = await history(async_client, jefe, u)
    assert [(x["new_parent"]["name"], x["thru_date"]) for x in body["data"]] == [("B", None), ("A", TODAY)]


@pytest.mark.asyncio
async def test_404_y_permisos(async_client, as_user, jefe, colaborador):
    a = await mk(async_client, jefe, "A")
    u = await mk(async_client, jefe, "U", a)
    assert (await async_client.get(f"{URL}/{GHOST}/relationships", headers=jefe)).status_code == 404
    r = await async_client.get(f"{URL}/{u['id']}/relationships", headers=colaborador)
    assert r.status_code == 403 and r.json()["error"]["code"] == "AUTHORIZATION_FAILED"
    assert (await async_client.get(f"{URL}/{u['id']}/relationships", headers=as_user("admin.ti", "admin"))).status_code == 200
