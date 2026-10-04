"""PATCH /organizations/{id} (API-SPEC-006 §3.3, US-029 AC-2, BR-PTY-12, BR-PTY-26): renombrar con auditoría."""
import pytest

from tests.integration.org_helpers import CONTACT, GHOST, URL, mk, rows
from tests.integration.test_org_list_extended import close_in_db


@pytest.mark.asyncio
async def test_renombra_y_guarda_el_valor_anterior(async_client, engine, jefe):
    u = await mk(async_client, jefe, "Soporte")
    r = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Soporte Técnico"}, headers=jefe)
    assert r.status_code == 200 and r.json()["name"] == "Soporte Técnico"
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["name"] == "Soporte Técnico"
    hist = await rows(
        engine,
        "SELECT previous_name, new_name, changed_by FROM tb_organization_name_history WHERE fk_party_id = :p",
        p=u["id"],
    )
    assert [tuple(h) for h in hist] == [("Soporte", "Soporte Técnico", "jefe.ingenieria")]


@pytest.mark.asyncio
async def test_cada_renombre_agrega_una_fila_sin_pisar_las_anteriores(async_client, engine, jefe):
    u = await mk(async_client, jefe, "Uno")
    await async_client.patch(f"{URL}/{u['id']}", json={"name": "Dos"}, headers=jefe)
    await async_client.patch(f"{URL}/{u['id']}", json={"name": "Tres"}, headers=jefe)
    hist = await rows(
        engine, "SELECT previous_name, new_name FROM tb_organization_name_history WHERE fk_party_id = :p ORDER BY new_name", p=u["id"]
    )
    assert sorted(tuple(h) for h in hist) == [("Dos", "Tres"), ("Uno", "Dos")]


@pytest.mark.asyncio
async def test_el_nombre_se_recorta_y_el_mismo_nombre_no_deja_historial(async_client, engine, jefe):
    u = await mk(async_client, jefe, "Uno")
    r = await async_client.patch(f"{URL}/{u['id']}", json={"name": "  Uno  "}, headers=jefe)
    assert r.status_code == 200 and r.json()["name"] == "Uno"
    assert await rows(engine, "SELECT 1 FROM tb_organization_name_history WHERE fk_party_id = :p", p=u["id"]) == []


@pytest.mark.asyncio
async def test_admin_tambien_renombra(async_client, as_user, jefe):
    u = await mk(async_client, jefe, "Uno")
    r = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Dos"}, headers=as_user("admin.ti", "admin"))
    assert r.status_code == 200


@pytest.mark.asyncio
async def test_colaborador_no_renombra_403(async_client, jefe, colaborador):
    u = await mk(async_client, jefe, "Uno")
    r = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Dos"}, headers=colaborador)
    assert r.status_code == 403 and r.json()["error"]["code"] == "AUTHORIZATION_FAILED"
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["name"] == "Uno"


@pytest.mark.asyncio
async def test_unidad_inexistente_404(async_client, jefe):
    r = await async_client.patch(f"{URL}/{GHOST}", json={"name": "X"}, headers=jefe)
    assert r.status_code == 404 and r.json()["error"]["code"] == "RESOURCE_NOT_FOUND"


@pytest.mark.asyncio
async def test_un_proveedor_no_es_una_unidad_404(async_client, jefe):
    prov = (
        await async_client.post(
            URL, json={"name": "Seguridad Sur", "type": "external_provider", "ruc": "20123456789", "contact": CONTACT}, headers=jefe
        )
    ).json()
    assert (await async_client.patch(f"{URL}/{prov['id']}", json={"name": "Otro"}, headers=jefe)).status_code == 404


@pytest.mark.asyncio
@pytest.mark.parametrize("body", [{}, {"name": ""}, {"name": "   "}, {"name": "x" * 201}, {"name": "A", "code": "X"}, {"name": 5}])
async def test_cuerpo_invalido_400(async_client, jefe, body):
    u = await mk(async_client, jefe, "Uno")
    r = await async_client.patch(f"{URL}/{u['id']}", json=body, headers=jefe)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_nombre_repetido_entre_hermanas_409_pero_permitido_bajo_otro_padre(async_client, jefe):
    p1 = await mk(async_client, jefe, "P1")
    p2 = await mk(async_client, jefe, "P2")
    await mk(async_client, jefe, "Backend", p1)
    otra = await mk(async_client, jefe, "Frontend", p1)
    en_p2 = await mk(async_client, jefe, "Mobile", p2)
    r = await async_client.patch(f"{URL}/{otra['id']}", json={"name": "BACKEND"}, headers=jefe)
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_DUPLICATE"
    assert (await async_client.patch(f"{URL}/{en_p2['id']}", json={"name": "Backend"}, headers=jefe)).status_code == 200


@pytest.mark.asyncio
async def test_unidad_inactiva_no_se_edita_409(async_client, engine, jefe):
    u = await mk(async_client, jefe, "Vieja")
    await close_in_db(engine, u["id"])
    r = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Nueva"}, headers=jefe)
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_INACTIVE"


@pytest.mark.asyncio
async def test_if_match_con_la_version_vigente_pasa_y_la_vieja_da_412(async_client, jefe):
    u = await mk(async_client, jefe, "Uno")
    v1 = u["row_version"]
    ok = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Dos"}, headers={**jefe, "If-Match": str(v1)})
    assert ok.status_code == 200 and ok.json()["row_version"] == v1 + 1
    assert ok.headers["etag"] == f'"{v1 + 1}"'
    stale = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Tres"}, headers={**jefe, "If-Match": str(v1)})
    assert stale.status_code == 412 and stale.json()["error"]["code"] == "PRECONDITION_FAILED"
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["name"] == "Dos"


@pytest.mark.asyncio
async def test_if_match_acepta_el_etag_entre_comillas_y_rechaza_basura(async_client, jefe):
    u = await mk(async_client, jefe, "Uno")
    ok = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Dos"}, headers={**jefe, "If-Match": f'"{u["row_version"]}"'})
    assert ok.status_code == 200
    bad = await async_client.patch(f"{URL}/{u['id']}", json={"name": "Tres"}, headers={**jefe, "If-Match": "abc"})
    assert bad.status_code == 400


@pytest.mark.asyncio
async def test_registra_quien_y_cuando_en_la_unidad(async_client, engine, as_user, jefe):
    u = await mk(async_client, jefe, "Uno")
    await async_client.patch(f"{URL}/{u['id']}", json={"name": "Dos"}, headers=as_user("admin.ti", "admin"))
    row = (await rows(engine, "SELECT updated_by, updated_at FROM tb_organization WHERE pk_party_id = :p", p=u["id"]))[0]
    assert row[0] == "admin.ti" and row[1] is not None
