"""GET /organizations ampliado (API-SPEC-006 §3.1, US-028): ancestor_id, orden, vigencia, conteos y árbol."""
from datetime import date, datetime, timedelta

import pytest
from sqlalchemy import text

from tests.integration.org_helpers import URL, add_member, mk


async def names(c, h, **params):
    r = await c.get(URL, params=params, headers=h)
    assert r.status_code == 200, r.text
    return [o["name"] for o in r.json()["data"]]


async def close_in_db(engine, unit_id, days_ago=1):
    """Cierra la vigencia del rol directamente (la ruta de desactivar se prueba en otro archivo)."""
    async with engine.begin() as conn:
        await conn.execute(
            text(
                "UPDATE tb_party_role SET thru_date = :t, from_date = :f, thru_recorded_at = :n, thru_recorded_by = 't' "
                "WHERE fk_party_id = :p AND fk_party_role_type_code = 'ORGANIZATIONAL_UNIT'"
            ),
            {"p": unit_id, "t": date.today() - timedelta(days=days_ago), "f": date.today() - timedelta(days=30), "n": datetime.now()},
        )


@pytest.mark.asyncio
async def test_cada_unidad_trae_vigencia_y_conteos(async_client, engine, jefe):
    root = await mk(async_client, jefe, "Raíz")
    await mk(async_client, jefe, "A", root)
    await mk(async_client, jefe, "B", root)
    gone = await mk(async_client, jefe, "C", root)
    await close_in_db(engine, gone["id"])
    await add_member(engine, root["id"])
    await add_member(engine, root["id"])
    await add_member(engine, root["id"], thru=date.today())  # pertenencia cerrada: no cuenta
    item = (await async_client.get(URL, params={"search": "Raíz"}, headers=jefe)).json()["data"][0]
    assert item["from_date"] == date.today().isoformat() and item["thru_date"] is None
    assert item["active_children_count"] == 2  # A y B; C inactiva no cuenta
    assert item["current_people_count"] == 2
    inactive = (await async_client.get(URL, params={"status": "inactive"}, headers=jefe)).json()["data"][0]
    assert inactive["name"] == "C"
    assert inactive["thru_date"] == (date.today() - timedelta(days=1)).isoformat()


@pytest.mark.asyncio
async def test_status_all_trae_activas_e_inactivas(async_client, engine, jefe):
    await mk(async_client, jefe, "Viva")
    muerta = await mk(async_client, jefe, "Muerta")
    await close_in_db(engine, muerta["id"])
    assert await names(async_client, jefe, status="all", sort="name:asc") == ["Muerta", "Viva"]
    assert await names(async_client, jefe) == ["Viva"]


@pytest.mark.asyncio
async def test_ancestor_id_devuelve_la_unidad_y_todos_sus_descendientes(async_client, jefe):
    root = await mk(async_client, jefe, "Raíz")
    a = await mk(async_client, jefe, "A", root)
    a1 = await mk(async_client, jefe, "A1", a)
    await mk(async_client, jefe, "A11", a1)
    await mk(async_client, jefe, "B", root)
    assert await names(async_client, jefe, ancestor_id=a["id"]) == ["A", "A1", "A11"]
    assert await names(async_client, jefe, parent_id=a["id"]) == ["A1"]  # hijos directos: sin cambios


@pytest.mark.asyncio
async def test_ancestor_id_respeta_los_demas_filtros(async_client, engine, jefe):
    root = await mk(async_client, jefe, "Raíz")
    a = await mk(async_client, jefe, "Alfa", root)
    await mk(async_client, jefe, "Beta", a)
    gone = await mk(async_client, jefe, "Gamma", a)
    await close_in_db(engine, gone["id"])
    assert await names(async_client, jefe, ancestor_id=root["id"], search="et") == ["Beta"]
    assert await names(async_client, jefe, ancestor_id=root["id"], status="all", search="amm") == ["Gamma"]
    assert await names(async_client, jefe, ancestor_id=root["id"]) == ["Alfa", "Beta", "Raíz"]


@pytest.mark.asyncio
async def test_ancestor_id_invalido_400(async_client, jefe):
    assert (await async_client.get(URL, params={"ancestor_id": "no-uuid"}, headers=jefe)).status_code == 400


@pytest.mark.asyncio
async def test_orden_por_nombre_del_padre(async_client, jefe):
    p1 = await mk(async_client, jefe, "Zeta")
    p2 = await mk(async_client, jefe, "Alfa")
    await mk(async_client, jefe, "hijo-de-zeta", p1)
    await mk(async_client, jefe, "hijo-de-alfa", p2)
    assert await names(async_client, jefe, sort="parent_name:asc", search="hijo") == ["hijo-de-alfa", "hijo-de-zeta"]
    assert await names(async_client, jefe, sort="parent_name:desc", search="hijo") == ["hijo-de-zeta", "hijo-de-alfa"]


@pytest.mark.asyncio
async def test_orden_por_estado_y_por_vigencia_desde(async_client, engine, jefe):
    await mk(async_client, jefe, "Nueva")
    vieja = await mk(async_client, jefe, "Vieja")
    gone = await mk(async_client, jefe, "Baja")
    await close_in_db(engine, gone["id"])
    async with engine.begin() as conn:
        await conn.execute(
            text("UPDATE tb_party_role SET from_date = :f WHERE fk_party_id = :p"),
            {"p": vieja["id"], "f": date.today() - timedelta(days=100)},
        )
    assert (await names(async_client, jefe, status="all", sort="from_date:asc"))[0] == "Vieja"
    assert (await names(async_client, jefe, status="all", sort="from_date:desc"))[0] == "Nueva"
    assert (await names(async_client, jefe, status="all", sort="status:asc"))[0] == "Baja"  # inactive < active
    assert (await names(async_client, jefe, status="all", sort="status:desc"))[-1] == "Baja"


@pytest.mark.asyncio
@pytest.mark.parametrize("params", [{"sort": "otro:asc"}, {"sort": "name:sideways"}, {"view": "grid"}, {"status": "todas"}])
async def test_parametros_invalidos_400(async_client, jefe, params):
    r = await async_client.get(URL, params=params, headers=jefe)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_vista_arbol_anida_los_hijos(async_client, jefe):
    root = await mk(async_client, jefe, "Raíz")
    a = await mk(async_client, jefe, "A", root)
    await mk(async_client, jefe, "A1", a)
    await mk(async_client, jefe, "B", root)
    await mk(async_client, jefe, "Otra raíz")
    r = await async_client.get(URL, params={"view": "tree"}, headers=jefe)
    data = r.json()["data"]
    assert [o["name"] for o in data] == ["Otra raíz", "Raíz"]
    raiz = data[1]
    assert [c["name"] for c in raiz["children"]] == ["A", "B"]
    assert [c["name"] for c in raiz["children"][0]["children"]] == ["A1"]
    assert data[0]["children"] == [] and r.json()["pagination"]["total"] == 2  # la paginación cuenta raíces


@pytest.mark.asyncio
async def test_vista_lista_no_trae_children(async_client, jefe):
    await mk(async_client, jefe, "Raíz")
    item = (await async_client.get(URL, headers=jefe)).json()["data"][0]
    assert item.get("children") is None


@pytest.mark.asyncio
async def test_arbol_con_ancestor_id_parte_de_esa_unidad(async_client, jefe):
    root = await mk(async_client, jefe, "Raíz")
    a = await mk(async_client, jefe, "A", root)
    await mk(async_client, jefe, "A1", a)
    data = (await async_client.get(URL, params={"view": "tree", "ancestor_id": a["id"]}, headers=jefe)).json()["data"]
    assert [o["name"] for o in data] == ["A"] and [c["name"] for c in data[0]["children"]] == ["A1"]


@pytest.mark.asyncio
async def test_arbol_corta_en_la_profundidad_maxima(async_client, jefe, monkeypatch):
    from app.services import organization_service

    monkeypatch.setattr(organization_service, "MAX_TREE_DEPTH", 2, raising=False)
    n1 = await mk(async_client, jefe, "N1")
    n2 = await mk(async_client, jefe, "N2", n1)
    await mk(async_client, jefe, "N3", n2)
    data = (await async_client.get(URL, params={"view": "tree"}, headers=jefe)).json()["data"]
    assert data[0]["children"][0]["name"] == "N2" and data[0]["children"][0]["children"] == []
