"""Rutas nuevas de la gestión de unidades: autenticación, identificadores y límite de solicitudes (ADR-005, API-SPEC-001 §4.5).

Pruebas de caracterización: se escribieron tras las rutas, para fijar lo transversal (token, UUID, cuota).
"""
import pytest

from tests.integration.org_helpers import GHOST, URL, mk

ROUTES = [
    ("patch", f"{URL}/{GHOST}", {"name": "X"}),
    ("post", f"{URL}/{GHOST}/parent", {"parent_id": None, "from_date": "2026-10-04"}),
    ("post", f"{URL}/{GHOST}/deactivate", None),
    ("post", f"{URL}/{GHOST}/reactivate", {"from_date": "2026-10-04"}),
    ("get", f"{URL}/{GHOST}/relationships", None),
    ("get", "/api/v1/internal-organization", None),
]


@pytest.mark.asyncio
@pytest.mark.parametrize("method,path,body", ROUTES)
async def test_sin_token_401(async_client, method, path, body):
    r = await getattr(async_client, method)(path, **({"json": body} if body else {}))
    assert r.status_code == 401 and r.json()["error"]["code"] == "AUTHENTICATION_FAILED"


@pytest.mark.asyncio
@pytest.mark.parametrize("method,path,body", ROUTES[:5])
async def test_identificador_que_no_es_uuid_400(async_client, jefe, method, path, body):
    r = await getattr(async_client, method)(path.replace(GHOST, "no-es-uuid"), headers=jefe, **({"json": body} if body else {}))
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_las_escrituras_llevan_cabeceras_de_cuota_y_se_cortan_con_429(async_client, jefe, monkeypatch):
    from app.config import config

    u = await mk(async_client, jefe, "U")
    monkeypatch.setattr(config, "RATE_LIMIT_UPDATE_PER_HOUR", 2)
    first = await async_client.patch(f"{URL}/{u['id']}", json={"name": "U2"}, headers=jefe)
    assert first.headers["x-ratelimit-limit"] == "2" and first.headers["x-ratelimit-remaining"] == "1"
    assert (await async_client.patch(f"{URL}/{u['id']}", json={"name": "U3"}, headers=jefe)).status_code == 200
    r = await async_client.patch(f"{URL}/{u['id']}", json={"name": "U4"}, headers=jefe)
    assert r.status_code == 429 and r.json()["error"]["code"] == "RATE_LIMIT_EXCEEDED"


@pytest.mark.asyncio
async def test_inyeccion_en_el_nombre_se_guarda_como_texto(async_client, jefe):
    u = await mk(async_client, jefe, "U")
    payload = "x'); DROP TABLE tb_organization;--"
    r = await async_client.patch(f"{URL}/{u['id']}", json={"name": payload}, headers=jefe)
    assert r.status_code == 200 and r.json()["name"] == payload
    assert (await async_client.get(URL, params={"search": "DROP TABLE"}, headers=jefe)).json()["pagination"]["total"] == 1
