"""POST /api/v1/internal-organization (API-SPEC-007 §2.1, BR-PTY-28 enmendada 2026-10-05): alta inicial única."""
import asyncio
from datetime import date

import pytest

from tests.conftest import TEST_DATABASE_URL
from tests.integration.org_helpers import CONTACT, add_internal_org, rows, scalar

URL = "/api/v1/internal-organization"
BODY = {"name": "COMSATEL S.A.C.", "ruc": "20123456780"}


@pytest.mark.asyncio
async def test_201_crea_parte_organizacion_rol_y_ruc(async_client, engine, jefe):
    r = await async_client.post(URL, json=BODY, headers=jefe)
    assert r.status_code == 201, r.text
    data = r.json()["data"]
    assert data == {
        "id": data["id"], "name": "COMSATEL S.A.C.", "ruc": "20123456780", "ruc_country": "PE",
        "from_date": date.today().isoformat(), "thru_date": None,
    }
    assert r.headers["ETag"].startswith('"')
    # lo creado se lee por el GET con los mismos datos y el mismo ETag
    g = await async_client.get(URL, headers=jefe)
    assert g.json() == r.json() and g.headers["ETag"] == r.headers["ETag"]
    # auditoría y filas
    for tabla, col in (("tb_party", "pk_party_id"), ("tb_organization", "pk_party_id"), ("tb_party_role", "fk_party_id"),
                       ("tb_party_identification", "fk_party_id")):
        assert await scalar(engine, f"SELECT created_by FROM {tabla} WHERE {col} = :i", i=data["id"]) == "jefe.ingenieria"
    assert await scalar(engine, "SELECT fk_party_role_type_code FROM tb_party_role WHERE fk_party_id = :i", i=data["id"]) == "INTERNAL_ORGANIZATION"


@pytest.mark.asyncio
async def test_admin_puede_darla_de_alta(async_client, as_user):
    r = await async_client.post(URL, json=BODY, headers=as_user("admin.ti", "admin"))
    assert r.status_code == 201


@pytest.mark.asyncio
async def test_pais_pe_explicito_se_acepta_y_otro_se_rechaza(async_client, jefe):
    ok = await async_client.post(URL, json={**BODY, "ruc_country": "PE"}, headers=jefe)
    assert ok.status_code == 201


@pytest.mark.asyncio
async def test_pais_distinto_de_pe_400(async_client, jefe):
    r = await async_client.post(URL, json={**BODY, "ruc_country": "CL"}, headers=jefe)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "body",
    [
        {"ruc": "20123456780"},  # sin razón social
        {"name": "   ", "ruc": "20123456780"},
        {"name": "x" * 201, "ruc": "20123456780"},
        {"name": "COMSATEL"},  # sin RUC
        {"name": "COMSATEL", "ruc": "2012345678"},  # 10 dígitos
        {"name": "COMSATEL", "ruc": "2012345678A"},
        {"name": "COMSATEL", "ruc": "12345678"},  # DNI: identificación de persona
        {"name": "COMSATEL", "ruc": "20123456780", "extra": 1},
    ],
)
async def test_validaciones_400_sin_crear_nada(async_client, engine, jefe, body):
    r = await async_client.post(URL, json=body, headers=jefe)
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"
    assert await scalar(engine, "SELECT count(*) FROM tb_party") == 0


@pytest.mark.asyncio
async def test_razon_social_de_200_caracteres_se_acepta(async_client, jefe):
    assert (await async_client.post(URL, json={**BODY, "name": "x" * 200}, headers=jefe)).status_code == 201


@pytest.mark.asyncio
async def test_409_si_ya_existe_una_organizacion_interna(async_client, engine, jefe):
    await add_internal_org(engine, ruc="20111111111")
    r = await async_client.post(URL, json=BODY, headers=jefe)
    assert r.status_code == 409 and r.json()["error"]["code"] == "INTERNAL_ORGANIZATION_ALREADY_EXISTS"
    assert await scalar(engine, "SELECT count(*) FROM tb_organization") == 1


@pytest.mark.asyncio
async def test_segundo_alta_409_y_no_cambia_la_primera(async_client, jefe):
    primera = await async_client.post(URL, json=BODY, headers=jefe)
    r = await async_client.post(URL, json={"name": "Otra", "ruc": "20222222222"}, headers=jefe)
    assert r.status_code == 409 and r.json()["error"]["code"] == "INTERNAL_ORGANIZATION_ALREADY_EXISTS"
    assert (await async_client.get(URL, headers=jefe)).json() == primera.json()


@pytest.mark.asyncio
async def test_con_el_rol_cerrado_ya_no_cuenta_como_existente(async_client, engine, jefe):
    await add_internal_org(engine, ruc="20111111111", thru=date(2026, 1, 1), days_ago=400)
    assert (await async_client.post(URL, json=BODY, headers=jefe)).status_code == 201


@pytest.mark.asyncio
async def test_409_ruc_ya_registrado_por_un_proveedor(async_client, jefe):
    p = await async_client.post(
        "/api/v1/organizations",
        json={"name": "Seguridad Sur", "type": "external_provider", "ruc": "20123456780", "contact": CONTACT},
        headers=jefe,
    )
    assert p.status_code == 201, p.text
    r = await async_client.post(URL, json=BODY, headers=jefe)
    assert r.status_code == 409 and r.json()["error"]["code"] == "ORGANIZATION_DUPLICATE"
    assert r.json()["error"]["details"]["field"] == "ruc"


@pytest.mark.asyncio
async def test_403_colaborador_y_401_sin_token(async_client, engine, colaborador):
    r = await async_client.post(URL, json=BODY, headers=colaborador)
    assert r.status_code == 403 and r.json()["error"]["code"] == "AUTHORIZATION_FAILED"
    assert (await async_client.post(URL, json=BODY)).status_code == 401
    assert await scalar(engine, "SELECT count(*) FROM tb_party") == 0


@pytest.mark.asyncio
@pytest.mark.parametrize("method", ["patch", "put", "delete"])
async def test_sin_edicion_ni_baja_405(async_client, engine, jefe, method):
    await add_internal_org(engine)
    assert (await getattr(async_client, method)(URL, headers=jefe)).status_code == 405


@pytest.mark.asyncio
@pytest.mark.skipif(not TEST_DATABASE_URL, reason="la carrera exige PostgreSQL")
async def test_dos_altas_simultaneas_solo_una_gana(async_client, engine, jefe):
    a, b = await asyncio.gather(
        async_client.post(URL, json={"name": "A", "ruc": "20111111111"}, headers=jefe),
        async_client.post(URL, json={"name": "B", "ruc": "20222222222"}, headers=jefe),
    )
    assert sorted([a.status_code, b.status_code]) == [201, 409], (a.text, b.text)
    perdedora = a if a.status_code == 409 else b
    assert perdedora.json()["error"]["code"] == "INTERNAL_ORGANIZATION_ALREADY_EXISTS"
    assert await scalar(engine, "SELECT count(*) FROM tb_party_role WHERE fk_party_role_type_code = 'INTERNAL_ORGANIZATION'") == 1
    assert await scalar(engine, "SELECT count(*) FROM tb_party") == 1
