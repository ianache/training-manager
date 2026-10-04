"""Quién puede qué (API-SPEC-003 §3) y confianza en el BFF (ADR-005 §2)."""
from tests.conftest import role_payload


async def _body(factory):
    comp = await factory.competency("Git")
    return role_payload("Developer", [{"name": "Junior", "ordinal": 1, "competencies": [{"competency_id": comp["competency_id"], "version_id": comp["version_id"], "required_level": "L1"}]}])


async def test_leer_esta_abierto_a_cualquier_sesion(async_client, colaborador):
    assert (await async_client.get("/api/v1/roles", headers=colaborador)).status_code == 200
    assert (await async_client.get("/api/v1/competencies", headers=colaborador)).status_code == 200


async def test_colaborador_no_puede_crear_ni_editar_ni_desactivar(async_client, factory, colaborador, jefe):
    body = await _body(factory)
    assert (await async_client.post("/api/v1/roles", json=body, headers=colaborador)).status_code == 403
    role = (await async_client.post("/api/v1/roles", json=body, headers=jefe)).json()
    assert (await async_client.put(f"/api/v1/roles/{role['id']}", json=body, headers={**colaborador, "If-Match": "1"})).status_code == 403
    assert (await async_client.post(f"/api/v1/roles/{role['id']}/deactivate", headers=colaborador)).status_code == 403
    level = f"/api/v1/roles/{role['id']}/levels/{role['levels'][0]['id']}"
    assert (await async_client.post(f"{level}/deactivate", headers=colaborador)).status_code == 403


async def test_edita_roles_jefe_product_owner_y_admin(async_client, factory, jefe, product_owner, admin):
    comp = await factory.competency("Git")
    for i, who in enumerate((jefe, product_owner, admin)):
        body = role_payload(f"Rol {i}", [{"name": "Junior", "ordinal": 1, "competencies": [{"competency_id": comp["competency_id"], "version_id": comp["version_id"], "required_level": "L1"}]}])
        r = await async_client.post("/api/v1/roles", json=body, headers=who)
        assert r.status_code == 201, (i, r.text)


async def test_product_owner_no_desactiva_niveles(async_client, factory, jefe, product_owner, admin):
    """BR-CAT-30: desactivar o reactivar un nivel es del Jefe de Ingeniería o ADMIN, no del Responsable de producto."""
    role = (await async_client.post("/api/v1/roles", json=await _body(factory), headers=jefe)).json()
    path = f"/api/v1/roles/{role['id']}/levels/{role['levels'][0]['id']}"
    assert (await async_client.post(f"{path}/deactivate", headers=product_owner)).status_code == 403
    assert (await async_client.post(f"{path}/deactivate", headers=admin)).status_code == 200
    assert (await async_client.post(f"{path}/reactivate", headers=product_owner)).status_code == 403


async def test_sin_token_o_con_token_ajeno_es_401(async_client, make_token, other_key):
    assert (await async_client.get("/api/v1/roles")).status_code == 401
    forged = {"Authorization": f"Bearer {make_token(key=other_key)}", "X-User-Name": "x"}
    assert (await async_client.get("/api/v1/roles", headers=forged)).status_code == 401
    wrong_client = {"Authorization": f"Bearer {make_token(azp='otro-cliente')}", "X-User-Name": "x"}
    assert (await async_client.get("/api/v1/roles", headers=wrong_client)).status_code == 401
    expired = {"Authorization": f"Bearer {make_token(exp_in=-3600)}", "X-User-Name": "x"}
    assert (await async_client.get("/api/v1/roles", headers=expired)).status_code == 401


async def test_sin_nombre_de_usuario_es_401(async_client, make_token):
    assert (await async_client.get("/api/v1/roles", headers={"Authorization": f"Bearer {make_token()}"})).status_code == 401


async def test_busqueda_con_inyeccion_sql_es_texto(async_client, factory, colaborador):
    comp = await factory.competency("Git")
    await factory.role("Developer", [("Junior", [(comp, "L1")])])
    r = await async_client.get("/api/v1/roles", params={"search": "x'; DROP TABLE catalog.tb_role;--"}, headers=colaborador)
    assert r.status_code == 200 and r.json()["pagination"]["total"] == 0
    assert (await async_client.get("/api/v1/roles", headers=colaborador)).json()["pagination"]["total"] == 1


async def test_limite_de_escritura_por_usuario(async_client, factory, jefe, monkeypatch):
    from app.config import config

    monkeypatch.setattr(config, "RATE_LIMIT_CREATE_PER_HOUR", 2)
    body = await _body(factory)
    codes = []
    for i in range(3):
        body = {**body, "name": f"Rol {i}"}
        codes.append((await async_client.post("/api/v1/roles", json=body, headers=jefe)).status_code)
    assert codes == [201, 201, 429]
