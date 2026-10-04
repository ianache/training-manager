"""Alta y edición de roles (API-SPEC-003 §2): una prueba por cada fila de la tabla de validaciones."""
import asyncio
import uuid

from tests.conftest import role_payload


def _level(comp, name="Junior", ordinal=1, required_level="L1", **extra):
    return {
        "name": name,
        "ordinal": ordinal,
        "competencies": [{"competency_id": comp["competency_id"], "version_id": comp["version_id"], "required_level": required_level}],
        **extra,
    }


async def _post(client, headers, body):
    return await client.post("/api/v1/roles", json=body, headers=headers)


# ---------------------------------------------------------------- alta


async def test_alta_valida_crea_rol_niveles_y_competencias(async_client, factory, jefe):
    comp = await factory.competency("Git")
    body = role_payload("Developer", [_level(comp, "Junior", 1), _level(comp, "Senior", 2, "L2")])
    r = await _post(async_client, jefe, body)
    assert r.status_code == 201, r.text
    assert r.headers["Location"] == f"/api/v1/roles/{r.json()['id']}" and r.headers["ETag"] == '"1"'
    role = r.json()
    assert role["status"] == "ACTIVE" and role["created_by"] == "jefe.ingenieria" and role["row_version"] == 1
    assert [(lv["name"], lv["ordinal"], lv["usable"]) for lv in role["levels"]] == [("Junior", 1, True), ("Senior", 2, True)]
    assert role["levels"][1]["competencies"][0]["required_level"] == "L2"
    # y se puede leer de vuelta
    assert (await async_client.get(f"/api/v1/roles/{role['id']}", headers=jefe)).json()["name"] == "Developer"


async def test_sin_niveles_es_400(async_client, factory, jefe):
    r = await _post(async_client, jefe, {"name": "Developer", "levels": []})
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


async def test_nivel_sin_competencias_es_400(async_client, jefe):
    r = await _post(async_client, jefe, {"name": "Developer", "levels": [{"name": "Junior", "ordinal": 1, "competencies": []}]})
    assert r.status_code == 400


async def test_nivel_l_fuera_de_rango_es_400(async_client, factory, jefe):
    comp = await factory.competency("Git")
    for bad in ("L0", "L5", "l1", "1"):
        r = await _post(async_client, jefe, role_payload("Developer", [_level(comp, required_level=bad)]))
        assert r.status_code == 400, bad


async def test_competencia_repetida_en_un_nivel_es_409(async_client, factory, jefe):
    comp = await factory.competency("Git")
    level = _level(comp)
    level["competencies"].append(dict(level["competencies"][0]))
    r = await _post(async_client, jefe, role_payload("Developer", [level]))
    assert r.status_code == 409 and r.json()["error"]["code"] == "COMPETENCY_DUPLICATED"


async def test_version_de_otra_competencia_es_400(async_client, factory, jefe):
    a, b = await factory.competency("A"), await factory.competency("B")
    level = _level(a)
    level["competencies"][0]["version_id"] = b["version_id"]
    assert (await _post(async_client, jefe, role_payload("Developer", [level]))).status_code == 400


async def test_version_en_borrador_es_400(async_client, factory, jefe):
    draft = await factory.competency("Git", version_status="DRAFT")
    r = await _post(async_client, jefe, role_payload("Developer", [_level(draft)]))
    assert r.status_code == 400 and r.json()["error"]["code"] == "VALIDATION_ERROR"


async def test_competencia_inactiva_en_un_nivel_nuevo_es_409(async_client, factory, jefe):
    comp = await factory.competency("Git", status="INACTIVE")
    r = await _post(async_client, jefe, role_payload("Developer", [_level(comp)]))
    assert r.status_code == 409 and r.json()["error"]["code"] == "COMPETENCY_INACTIVE"


async def test_nivel_l_sin_requisitos_es_422(async_client, factory, jefe):
    comp = await factory.competency("Git", requirements={"L1": [True]})
    r = await _post(async_client, jefe, role_payload("Developer", [_level(comp, required_level="L2")]))
    assert r.status_code == 422 and r.json()["error"]["code"] == "EVIDENCE_REQUIREMENTS_MISSING"


async def test_requisitos_solo_deseados_es_422(async_client, factory, jefe):
    comp = await factory.competency("Git", requirements={"L1": [False, False]})
    r = await _post(async_client, jefe, role_payload("Developer", [_level(comp)]))
    assert r.status_code == 422


async def test_nombre_repetido_sin_distinguir_mayusculas_es_409(async_client, factory, jefe):
    comp = await factory.competency("Git")
    assert (await _post(async_client, jefe, role_payload("Developer", [_level(comp)]))).status_code == 201
    r = await _post(async_client, jefe, role_payload("  developer ", [_level(comp)]))
    assert r.status_code == 409 and r.json()["error"]["code"] == "ROLE_NAME_DUPLICATE"


async def test_niveles_con_mismo_orden_o_nombre_es_400(async_client, factory, jefe):
    comp = await factory.competency("Git")
    assert (await _post(async_client, jefe, role_payload("A", [_level(comp, "Uno", 1), _level(comp, "Dos", 1)]))).status_code == 400
    assert (await _post(async_client, jefe, role_payload("B", [_level(comp, "Uno", 1), _level(comp, "UNO", 2)]))).status_code == 400


async def test_alta_fallida_no_deja_nada_a_medias(async_client, factory, jefe):
    """Una sola transacción: si el segundo nivel falla, tampoco queda el rol ni el primer nivel."""
    good, bad = await factory.competency("Git"), await factory.competency("Mala", requirements={"L1": [True]})
    r = await _post(async_client, jefe, role_payload("Developer", [_level(good, "Uno", 1), _level(bad, "Dos", 2, "L3")]))
    assert r.status_code == 422
    assert (await async_client.get("/api/v1/roles", headers=jefe)).json()["pagination"]["total"] == 0


async def test_campos_desconocidos_se_rechazan(async_client, factory, jefe):
    comp = await factory.competency("Git")
    body = role_payload("Developer", [_level(comp)])
    body["status"] = "INACTIVE"
    assert (await _post(async_client, jefe, body)).status_code == 400


async def test_nombre_vacio_o_demasiado_largo_es_400(async_client, factory, jefe):
    comp = await factory.competency("Git")
    for name in ("", "   ", "x" * 121):
        assert (await _post(async_client, jefe, role_payload(name, [_level(comp)]))).status_code == 400, name


# ---------------------------------------------------------------- edición


async def _created(client, headers, factory, name="Developer"):
    comp = await factory.competency(f"Git-{name}")
    r = await _post(client, headers, role_payload(name, [_level(comp)]))
    return comp, r.json()


async def test_put_sin_if_match_es_428(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Developer", [_level(comp)]), headers=jefe)
    assert r.status_code == 428


async def test_put_con_if_match_desactualizado_es_412(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Developer", [_level(comp)]), headers={**jefe, "If-Match": '"7"'})
    assert r.status_code == 412 and r.json()["error"]["code"] == "PRECONDITION_FAILED"


async def test_put_renombra_el_rol_y_un_nivel_y_sube_la_version(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    level = _level(comp, "Junior II", 1, id=role["levels"][0]["id"])
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Developer 2", [level]), headers={**jefe, "If-Match": '"1"'})
    assert r.status_code == 200, r.text
    out = r.json()
    assert out["name"] == "Developer 2" and out["row_version"] == 2 and r.headers["ETag"] == '"2"'
    assert out["levels"][0]["id"] == role["levels"][0]["id"] and out["levels"][0]["name"] == "Junior II"
    assert out["updated_by"] == "jefe.ingenieria"


async def test_put_agrega_un_nivel_y_no_quita_los_omitidos(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    r = await async_client.put(
        f"/api/v1/roles/{role['id']}", json=role_payload("Developer", [_level(comp, "Senior", 2, "L2")]), headers={**jefe, "If-Match": "1"}
    )
    assert r.status_code == 200
    assert [lv["name"] for lv in r.json()["levels"]] == ["Junior", "Senior"]  # el nivel omitido se conserva


async def test_put_reemplaza_las_competencias_de_un_nivel(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    other = await factory.competency("Otra")
    level = _level(other, "Junior", 1, id=role["levels"][0]["id"])
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Developer", [level]), headers={**jefe, "If-Match": "1"})
    names = [c["name"] for c in r.json()["levels"][0]["competencies"]]
    assert names == ["Otra"]


async def test_put_conserva_una_competencia_ya_inactiva_pero_no_admite_otra_nueva(async_client, factory, jefe, db):
    from sqlalchemy import text

    comp, role = await _created(async_client, jefe, factory)
    await db.execute(text("UPDATE catalog.tb_competency SET status='INACTIVE' WHERE pk_competency_id=:c"), {"c": comp["competency_id"]})
    await db.commit()
    keep = _level(comp, "Junior", 1, id=role["levels"][0]["id"])
    assert (await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Developer", [keep]), headers={**jefe, "If-Match": "1"})).status_code == 200
    # en un nivel nuevo, la inactiva sigue prohibida (BR-CAT-28)
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Developer", [_level(comp, "Nuevo", 2)]), headers={**jefe, "If-Match": "2"})
    assert r.status_code == 409 and r.json()["error"]["code"] == "COMPETENCY_INACTIVE"


async def test_put_con_nivel_de_otro_rol_es_400(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory, "Uno")
    _, other = await _created(async_client, jefe, factory, "Dos")
    level = _level(comp, "Junior", 1, id=other["levels"][0]["id"])
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Uno", [level]), headers={**jefe, "If-Match": "1"})
    assert r.status_code == 400


async def test_put_con_nombre_de_otro_rol_es_409(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory, "Uno")
    await _created(async_client, jefe, factory, "Dos")
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("dos", [_level(comp, id=role["levels"][0]["id"])]), headers={**jefe, "If-Match": "1"})
    assert r.status_code == 409 and r.json()["error"]["code"] == "ROLE_NAME_DUPLICATE"


async def test_put_que_choca_con_un_nivel_omitido_es_409_y_no_cambia_nada(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    r = await async_client.put(f"/api/v1/roles/{role['id']}", json=role_payload("Developer", [_level(comp, "Junior", 2)]), headers={**jefe, "If-Match": "1"})
    assert r.status_code == 409  # "Junior" ya existe en el orden 1
    again = (await async_client.get(f"/api/v1/roles/{role['id']}", headers=jefe)).json()
    assert again["row_version"] == 1 and len(again["levels"]) == 1


async def test_dos_put_simultaneos_solo_gana_uno(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    headers = {**jefe, "If-Match": "1"}

    def body(name):
        return role_payload(name, [_level(comp, id=role["levels"][0]["id"])])

    a, b = await asyncio.gather(
        async_client.put(f"/api/v1/roles/{role['id']}", json=body("Gana A"), headers=headers),
        async_client.put(f"/api/v1/roles/{role['id']}", json=body("Gana B"), headers=headers),
    )
    assert sorted([a.status_code, b.status_code]) == [200, 412]


async def test_put_de_rol_inexistente_404(async_client, factory, jefe):
    comp = await factory.competency("Git")
    r = await async_client.put(f"/api/v1/roles/{uuid.uuid4()}", json=role_payload("X", [_level(comp)]), headers={**jefe, "If-Match": "1"})
    assert r.status_code == 404


# ---------------------------------------------------------------- desactivar


async def test_desactivar_rol_conserva_los_datos_y_no_se_repite(async_client, factory, jefe):
    comp, role = await _created(async_client, jefe, factory)
    r = await async_client.post(f"/api/v1/roles/{role['id']}/deactivate", headers=jefe)
    assert r.status_code == 200 and r.json()["status"] == "INACTIVE" and r.json()["row_version"] == 2
    assert (await async_client.get(f"/api/v1/roles/{role['id']}", headers=jefe)).json()["levels"][0]["competencies"]
    again = await async_client.post(f"/api/v1/roles/{role['id']}/deactivate", headers=jefe)
    assert again.status_code == 409 and again.json()["error"]["code"] == "ROLE_ALREADY_INACTIVE"


async def test_desactivar_rol_con_if_match_viejo_es_412(async_client, factory, jefe):
    _, role = await _created(async_client, jefe, factory)
    r = await async_client.post(f"/api/v1/roles/{role['id']}/deactivate", headers={**jefe, "If-Match": "9"})
    assert r.status_code == 412


async def test_desactivar_y_reactivar_un_nivel(async_client, factory, jefe):
    _, role = await _created(async_client, jefe, factory)
    base = f"/api/v1/roles/{role['id']}/levels/{role['levels'][0]['id']}"
    off = await async_client.post(f"{base}/deactivate", headers=jefe)
    assert off.status_code == 200 and off.json()["levels"][0]["status"] == "INACTIVE"
    dup = await async_client.post(f"{base}/deactivate", headers=jefe)
    assert dup.status_code == 409 and dup.json()["error"]["code"] == "LEVEL_ALREADY_INACTIVE"
    on = await async_client.post(f"{base}/reactivate", headers=jefe)
    assert on.status_code == 200 and on.json()["levels"][0]["status"] == "ACTIVE"
    dup2 = await async_client.post(f"{base}/reactivate", headers=jefe)
    assert dup2.status_code == 409 and dup2.json()["error"]["code"] == "LEVEL_ALREADY_ACTIVE"


async def test_nivel_de_otro_rol_o_inexistente_404(async_client, factory, jefe):
    _, role = await _created(async_client, jefe, factory, "Uno")
    _, other = await _created(async_client, jefe, factory, "Dos")
    r = await async_client.post(f"/api/v1/roles/{role['id']}/levels/{other['levels'][0]['id']}/deactivate", headers=jefe)
    assert r.status_code == 404
    assert (await async_client.post(f"/api/v1/roles/{role['id']}/levels/{uuid.uuid4()}/deactivate", headers=jefe)).status_code == 404
