"""RBAC y visibilidad (US-015, US-016, UXR-000.5 / P-08)."""
import pytest


async def _create(client, jefe, payload):
    r = await client.post("/api/v1/parties", json=payload, headers=jefe)
    assert r.status_code == 201, r.text
    return r.json()


@pytest.mark.asyncio
async def test_colaborador_no_registra_403(async_client, colaborador, party_payload):
    r = await async_client.post("/api/v1/parties", json=party_payload, headers=colaborador)
    assert r.status_code == 403
    assert r.json()["error"]["code"] == "AUTHORIZATION_FAILED"


@pytest.mark.asyncio
async def test_colaborador_no_modifica_403(async_client, jefe, colaborador, party_payload):
    p = await _create(async_client, jefe, party_payload)
    r = await async_client.patch(
        f"/api/v1/parties/{p['id']}", json={"phone_work": "+51 999 888 777"}, headers=colaborador
    )
    assert r.status_code == 403


@pytest.mark.asyncio
async def test_colaborador_ve_ficha_ajena_limitada(async_client, jefe, colaborador, party_payload):
    p = await _create(async_client, jefe, party_payload)
    r = await async_client.get(f"/api/v1/parties/{p['id']}", headers=colaborador)
    assert r.status_code == 200
    body = r.json()
    assert body["first_names"] == "Juan" and body["contact"] == {"email_work": "juan.perez@example.com"}
    for oculto in ("identification", "created_by", "role_assignments"):
        assert oculto not in body
    assert "phone_work" not in body["contact"]


@pytest.mark.asyncio
async def test_jefe_ve_ficha_completa(async_client, jefe, party_payload):
    p = await _create(async_client, jefe, party_payload)
    body = (await async_client.get(f"/api/v1/parties/{p['id']}", headers=jefe)).json()
    assert body["identification"] == {"type": "DNI", "number": "12345678", "country": "PE"}
    assert body["created_by"] == "jefe.ingenieria"


@pytest.mark.asyncio
async def test_lista_limitada_para_colaborador(async_client, jefe, colaborador, party_payload):
    await _create(async_client, jefe, party_payload)
    item = (await async_client.get("/api/v1/parties", headers=colaborador)).json()["data"][0]
    assert "identification" not in item
