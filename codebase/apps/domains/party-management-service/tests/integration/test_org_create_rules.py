"""POST /organizations: permisos (BR-PTY-17), correo laboral (BR-PTY-27) y organización interna fuera de la API (BR-PTY-28)."""
import pytest

from tests.integration.org_helpers import CONTACT, URL, add_internal_org

UNIT = {"name": "Ingeniería", "type": "internal_unit", "contact": CONTACT}


@pytest.mark.asyncio
async def test_admin_tambien_registra_unidades(async_client, as_user):
    admin = as_user("admin.ti", "colaborador,admin")
    r = await async_client.post(URL, json=UNIT, headers=admin)
    assert r.status_code == 201 and r.json()["name"] == "Ingeniería"


@pytest.mark.asyncio
async def test_colaborador_no_registra_403(async_client, colaborador):
    r = await async_client.post(URL, json=UNIT, headers=colaborador)
    assert r.status_code == 403 and r.json()["error"]["code"] == "AUTHORIZATION_FAILED"


@pytest.mark.asyncio
async def test_unidad_sin_correo_laboral_400(async_client, jefe):
    r = await async_client.post(URL, json={"name": "Sin correo", "type": "internal_unit"}, headers=jefe)
    assert r.status_code == 400
    r = await async_client.post(URL, json={"name": "Sin correo", "type": "internal_unit", "contact": {}}, headers=jefe)
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_la_organizacion_interna_no_se_crea_por_la_api(async_client, jefe):
    body = {"name": "COMSATEL", "type": "internal_organization", "ruc": "20123456789", "contact": CONTACT}
    r = await async_client.post(URL, json=body, headers=jefe)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_la_organizacion_interna_no_se_lista_ni_se_consulta_por_organizations(async_client, engine, jefe):
    pid = await add_internal_org(engine)
    assert (await async_client.get(URL, params={"status": "all"}, headers=jefe)).json()["data"] == []
    assert (await async_client.get(f"{URL}/{pid}", headers=jefe)).status_code == 404
    r = await async_client.get(URL, params={"type": "internal_organization"}, headers=jefe)
    assert r.status_code == 400
