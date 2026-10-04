"""Lectura de roles y competencias (API-SPEC-003 §2): forma de la respuesta, `usable` y versiones."""
import uuid

from tests.conftest import role_payload  # noqa: F401  (se reutiliza en otros módulos)


async def _simple_role(factory, name="Developer", comp_name="Git", requirements=None):
    comp = await factory.competency(comp_name, requirements=requirements)
    role = await factory.role(name, [("Junior", [(comp, "L1")])])
    return comp, role


async def test_lista_con_la_forma_que_consume_el_asistente_de_alta(async_client, factory, colaborador):
    _, role = await _simple_role(factory)
    r = await async_client.get("/api/v1/roles", headers=colaborador)
    assert r.status_code == 200
    body = r.json()
    assert body["pagination"]["total"] == 1
    item = body["data"][0]
    assert item["id"] == role["id"] and item["name"] == "Developer" and item["status"] == "ACTIVE"
    assert item["competency_count"] == 1
    level = item["levels"][0]
    assert level == {"id": role["level_ids"][0], "name": "Junior", "ordinal": 1, "status": "ACTIVE", "usable": True, "evidence_requirements": 1}


async def test_nivel_no_usable_si_la_version_es_borrador(async_client, factory, colaborador):
    comp = await factory.competency("Git", version_status="DRAFT")
    await factory.role("Developer", [("Junior", [(comp, "L1")])])
    level = (await async_client.get("/api/v1/roles", headers=colaborador)).json()["data"][0]["levels"][0]
    assert level["usable"] is False and level["evidence_requirements"] == 0


async def test_nivel_no_usable_sin_requisito_requerido_en_el_nivel_esperado(async_client, factory, colaborador):
    comp = await factory.competency("Git", requirements={"L1": [False]})
    await factory.role("Developer", [("Junior", [(comp, "L1")])])
    level = (await async_client.get("/api/v1/roles", headers=colaborador)).json()["data"][0]["levels"][0]
    assert level["usable"] is False
    assert level["evidence_requirements"] == 1  # informativo: cuenta los configurados, requeridos o deseados


async def test_nivel_usable_con_version_ya_reemplazada(async_client, factory, colaborador):
    """EVD-2026-0143: una versión nueva no altera la relación vigente; DEPRECATED sigue contando como aprobada."""
    comp = await factory.competency("Git")
    await factory.role("Developer", [("Junior", [(comp, "L1")])])
    await factory.competency("Git", competency_id=comp["competency_id"], version_number=2)
    from sqlalchemy import text

    await factory.db.execute(text("UPDATE catalog.tb_competency_version SET status='DEPRECATED' WHERE pk_competency_version_id=:v"), {"v": comp["version_id"]})
    await factory.db.commit()
    level = (await async_client.get("/api/v1/roles", headers=colaborador)).json()["data"][0]["levels"][0]
    assert level["usable"] is True


async def test_filtro_por_estado_y_busqueda(async_client, factory, colaborador):
    c = await factory.competency("Git")
    await factory.role("Developer", [("Junior", [(c, "L1")])])
    await factory.role("Analista", [("Uno", [(c, "L1")])], status="INACTIVE")
    activos = (await async_client.get("/api/v1/roles", params={"status": "ACTIVE"}, headers=colaborador)).json()
    assert [r["name"] for r in activos["data"]] == ["Developer"] and activos["filters_applied"] == {"status": "ACTIVE"}
    todos = (await async_client.get("/api/v1/roles", headers=colaborador)).json()
    assert todos["pagination"]["total"] == 2
    buscados = (await async_client.get("/api/v1/roles", params={"search": "ANAL"}, headers=colaborador)).json()
    assert [r["name"] for r in buscados["data"]] == ["Analista"]


async def test_busqueda_con_comodines_no_se_interpreta(async_client, factory, colaborador):
    c = await factory.competency("Git")
    await factory.role("Developer", [("Junior", [(c, "L1")])])
    r = await async_client.get("/api/v1/roles", params={"search": "%"}, headers=colaborador)
    assert r.json()["pagination"]["total"] == 0


async def test_paginacion_y_orden(async_client, factory, colaborador):
    c = await factory.competency("Git")
    for name in ("Beta", "Alfa", "Gamma"):
        await factory.role(name, [("Uno", [(c, "L1")])])
    p1 = (await async_client.get("/api/v1/roles", params={"limit": 2}, headers=colaborador)).json()
    assert [r["name"] for r in p1["data"]] == ["Alfa", "Beta"] and p1["pagination"]["has_next"] is True
    desc = (await async_client.get("/api/v1/roles", params={"sort": "name:desc", "limit": 1}, headers=colaborador)).json()
    assert desc["data"][0]["name"] == "Gamma"
    assert (await async_client.get("/api/v1/roles", params={"sort": "id:asc"}, headers=colaborador)).status_code == 400
    assert (await async_client.get("/api/v1/roles", params={"limit": 101}, headers=colaborador)).status_code == 400


async def test_detalle_con_competencias_y_advertencia_de_version(async_client, factory, colaborador):
    comp, role = await _simple_role(factory)
    v2 = await factory.competency("Git", competency_id=comp["competency_id"], version_number=2)
    r = await async_client.get(f"/api/v1/roles/{role['id']}", headers=colaborador)
    assert r.status_code == 200 and r.headers["ETag"] == '"1"'
    c = r.json()["levels"][0]["competencies"][0]
    assert c["name"] == "Git" and c["required_level"] == "L1"
    assert c["version"] == {"id": comp["version_id"], "version_number": 1, "status": "APPROVED"}
    assert c["is_current"] is False and c["suggested_version_id"] == v2["version_id"]


async def test_detalle_sin_advertencia_cuando_la_version_es_la_vigente(async_client, factory, colaborador):
    _, role = await _simple_role(factory)
    c = (await async_client.get(f"/api/v1/roles/{role['id']}", headers=colaborador)).json()["levels"][0]["competencies"][0]
    assert c["is_current"] is True and c["suggested_version_id"] is None


async def test_rol_inexistente_404_con_formato_estandar(async_client, colaborador):
    r = await async_client.get(f"/api/v1/roles/{uuid.uuid4()}", headers=colaborador)
    assert r.status_code == 404
    error = r.json()["error"]
    assert error["code"] == "RESOURCE_NOT_FOUND" and error["request_id"] == "req-test-1"


async def test_id_que_no_es_uuid_es_400(async_client, colaborador):
    assert (await async_client.get("/api/v1/roles/no-es-uuid", headers=colaborador)).status_code == 400


async def test_competencias_lista_y_detalle(async_client, factory, colaborador):
    comp = await factory.competency("Git")
    await factory.competency("Inactiva", status="INACTIVE")
    lista = (await async_client.get("/api/v1/competencies", params={"status": "ACTIVE"}, headers=colaborador)).json()
    assert [c["name"] for c in lista["data"]] == ["Git"]
    assert lista["data"][0]["current_version"] == {"id": comp["version_id"], "version_number": 1, "status": "APPROVED"}
    detalle = (await async_client.get(f"/api/v1/competencies/{comp['competency_id']}", headers=colaborador)).json()
    reqs = detalle["versions"][0]["evidence_requirements"]
    assert {r["level"] for r in reqs} == {"L1", "L2", "L3"} and sum(r["is_required"] for r in reqs) == 3
    assert (await async_client.get(f"/api/v1/competencies/{uuid.uuid4()}", headers=colaborador)).status_code == 404
