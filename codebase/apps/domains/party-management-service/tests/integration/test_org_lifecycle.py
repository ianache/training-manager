"""POST …/deactivate y …/reactivate (API-SPEC-006 §3.5 y §3.6, US-030; BR-PTY-12, 21, 23, 24)."""
from datetime import date, timedelta

import pytest

from tests.integration.org_helpers import GHOST, URL, add_member, mk, rows

TODAY = date.today().isoformat()


async def deactivate(c, h, unit, **headers):
    return await c.post(f"{URL}/{unit['id']}/deactivate", headers={**h, **headers})


async def reactivate(c, h, unit, body=None, **headers):
    return await c.post(f"{URL}/{unit['id']}/reactivate", json=body if body is not None else {"from_date": TODAY}, headers={**h, **headers})


def code(r):
    return r.json()["error"]["code"]


async def get(c, h, unit):
    return (await c.get(f"{URL}/{unit['id']}", headers=h)).json()


# ---------------------------------------------------------------- desactivar


@pytest.mark.asyncio
async def test_desactiva_cierra_el_rol_y_la_relacion_sin_borrar(async_client, engine, jefe):
    p = await mk(async_client, jefe, "P")
    u = await mk(async_client, jefe, "U", p)
    r = await deactivate(async_client, jefe, u)
    assert r.status_code == 200
    b = r.json()
    assert b["status"] == "inactive" and b["thru_date"] == TODAY and b["id"] == u["id"] and b["name"] == "U"
    role = (await rows(engine, "SELECT thru_date, thru_recorded_by, thru_recorded_at FROM tb_party_role WHERE fk_party_id = :u", u=u["id"]))[0]
    assert str(role[0]) == TODAY and role[1] == "jefe.ingenieria" and role[2] is not None
    rel = await rows(
        engine,
        "SELECT rel.thru_date, rel.updated_by FROM tb_party_relationship rel JOIN tb_party_role r ON r.pk_party_role_id = rel.fk_party_role_from_id "
        "WHERE r.fk_party_id = :u AND rel.fk_party_relationship_type_code = 'ORG_STRUCTURE'",
        u=u["id"],
    )
    assert [(str(x[0]), x[1]) for x in rel] == [(TODAY, "jefe.ingenieria")]
    assert await rows(engine, "SELECT 1 FROM tb_organization WHERE pk_party_id = :u", u=u["id"])  # no se borra
    assert u["id"] in [o["id"] for o in (await async_client.get(URL, params={"status": "inactive"}, headers=jefe)).json()["data"]]
    assert u["id"] not in [o["id"] for o in (await async_client.get(URL, headers=jefe)).json()["data"]]


@pytest.mark.asyncio
async def test_bloqueada_por_hijas_activas_con_los_conteos(async_client, jefe):
    p = await mk(async_client, jefe, "P")
    await mk(async_client, jefe, "H1", p)
    await mk(async_client, jefe, "H2", p)
    r = await deactivate(async_client, jefe, p)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_HAS_DEPENDENCIES"
    assert r.json()["error"]["details"] == {"active_children_count": 2, "current_people_count": 0}
    assert (await get(async_client, jefe, p))["status"] == "active"


@pytest.mark.asyncio
async def test_bloqueada_por_personas_vigentes_y_reporta_ambos_conteos(async_client, engine, jefe):
    p = await mk(async_client, jefe, "P")
    await mk(async_client, jefe, "H1", p)
    for _ in range(3):
        await add_member(engine, p["id"])
    await add_member(engine, p["id"], thru=date.today())  # cerrada: no cuenta
    r = await deactivate(async_client, jefe, p)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_HAS_DEPENDENCIES"
    assert r.json()["error"]["details"] == {"active_children_count": 1, "current_people_count": 3}


@pytest.mark.asyncio
async def test_una_hija_inactiva_o_una_pertenencia_cerrada_no_bloquean(async_client, engine, jefe):
    p = await mk(async_client, jefe, "P")
    h = await mk(async_client, jefe, "H", p)
    await add_member(engine, p["id"], thru=date.today())
    assert (await deactivate(async_client, jefe, h)).status_code == 200
    assert (await deactivate(async_client, jefe, p)).status_code == 200


@pytest.mark.asyncio
async def test_ya_inactiva_409_inexistente_404_proveedor_404(async_client, jefe):
    u = await mk(async_client, jefe, "U")
    assert (await deactivate(async_client, jefe, u)).status_code == 200
    r = await deactivate(async_client, jefe, u)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_ALREADY_INACTIVE"
    assert (await async_client.post(f"{URL}/{GHOST}/deactivate", headers=jefe)).status_code == 404


@pytest.mark.asyncio
async def test_permisos_de_desactivar_y_reactivar(async_client, as_user, jefe, colaborador):
    u = await mk(async_client, jefe, "U")
    r = await deactivate(async_client, colaborador, u)
    assert r.status_code == 403 and code(r) == "AUTHORIZATION_FAILED"
    assert (await get(async_client, jefe, u))["status"] == "active"
    admin = as_user("admin.ti", "admin")
    assert (await deactivate(async_client, admin, u)).status_code == 200
    assert (await reactivate(async_client, colaborador, u)).status_code == 403
    assert (await reactivate(async_client, admin, u)).status_code == 200


@pytest.mark.asyncio
async def test_el_nombre_de_una_unidad_inactiva_queda_libre(async_client, jefe):
    p = await mk(async_client, jefe, "P")
    u = await mk(async_client, jefe, "Soporte", p)
    await deactivate(async_client, jefe, u)
    await mk(async_client, jefe, "Soporte", p)  # BR-PTY-26 solo compara unidades activas


@pytest.mark.asyncio
async def test_desactivar_con_if_match_obsoleto_412(async_client, jefe):
    u = await mk(async_client, jefe, "U")
    r = await deactivate(async_client, jefe, u, **{"If-Match": str(u["row_version"] + 5)})
    assert r.status_code == 412 and code(r) == "PRECONDITION_FAILED"
    ok = await deactivate(async_client, jefe, u, **{"If-Match": str(u["row_version"])})
    assert ok.status_code == 200 and ok.json()["row_version"] == u["row_version"] + 1


# ---------------------------------------------------------------- reactivar


@pytest.mark.asyncio
async def test_reactiva_con_nueva_vigencia_y_conserva_la_anterior(async_client, engine, jefe):
    p = await mk(async_client, jefe, "P")
    u = await mk(async_client, jefe, "U", p)
    await deactivate(async_client, jefe, u)
    r = await reactivate(async_client, jefe, u)
    assert r.status_code == 200
    b = r.json()
    assert b["status"] == "active" and b["parent_id"] == p["id"] and b["from_date"] == TODAY and b["thru_date"] is None
    roles = await rows(
        engine, "SELECT from_date, thru_date FROM tb_party_role WHERE fk_party_id = :u ORDER BY created_at", u=u["id"]
    )
    assert len(roles) == 2 and str(roles[0][1]) == TODAY and roles[1][1] is None  # la vigencia anterior sigue ahí
    rels = await rows(
        engine,
        "SELECT rel.thru_date FROM tb_party_relationship rel JOIN tb_party_role r ON r.pk_party_role_id = rel.fk_party_role_from_id "
        "WHERE r.fk_party_id = :u AND rel.fk_party_relationship_type_code = 'ORG_STRUCTURE' ORDER BY rel.created_at",
        u=u["id"],
    )
    assert [x[0] and str(x[0]) for x in rels] == [TODAY, None]
    listed = [o for o in (await async_client.get(URL, params={"status": "all"}, headers=jefe)).json()["data"] if o["name"] == "U"]
    assert len(listed) == 1  # una sola fila por unidad aunque tenga dos vigencias


@pytest.mark.asyncio
async def test_reactiva_bajo_otro_padre_activo_o_sin_padre(async_client, jefe):
    p, q = await mk(async_client, jefe, "P"), await mk(async_client, jefe, "Q")
    u = await mk(async_client, jefe, "U", p)
    await deactivate(async_client, jefe, u)
    r = await reactivate(async_client, jefe, u, {"from_date": TODAY, "parent_id": q["id"]})
    assert r.status_code == 200 and r.json()["parent_id"] == q["id"]
    await deactivate(async_client, jefe, u)
    r = await reactivate(async_client, jefe, u, {"from_date": TODAY, "parent_id": None})
    assert r.status_code == 200 and r.json()["parent_id"] is None


@pytest.mark.asyncio
async def test_reactivar_bajo_padre_inactivo_409_con_su_nombre_e_id(async_client, jefe):
    p = await mk(async_client, jefe, "Padre")
    u = await mk(async_client, jefe, "U", p)
    await deactivate(async_client, jefe, u)
    await deactivate(async_client, jefe, p)
    r = await reactivate(async_client, jefe, u)  # su padre anterior está inactivo
    assert r.status_code == 409 and code(r) == "PARENT_INACTIVE"
    assert r.json()["error"]["details"] == {"parent_id": p["id"], "parent_name": "Padre"}
    assert (await get(async_client, jefe, u))["status"] == "inactive"
    assert (await get(async_client, jefe, p))["status"] == "inactive"  # el padre no se reactiva solo
    r = await reactivate(async_client, jefe, u, {"from_date": TODAY, "parent_id": p["id"]})  # padre explícito inactivo
    assert code(r) == "PARENT_INACTIVE"
    assert (await reactivate(async_client, jefe, u, {"from_date": TODAY, "parent_id": GHOST})).status_code == 404


@pytest.mark.asyncio
async def test_reactivar_ya_activa_409(async_client, jefe):
    u = await mk(async_client, jefe, "U")
    r = await reactivate(async_client, jefe, u)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_ALREADY_ACTIVE"
    assert (await async_client.post(f"{URL}/{GHOST}/reactivate", json={"from_date": TODAY}, headers=jefe)).status_code == 404


@pytest.mark.asyncio
async def test_reactivar_con_nombre_ocupado_bajo_el_padre_409(async_client, jefe):
    p = await mk(async_client, jefe, "P")
    u = await mk(async_client, jefe, "Soporte", p)
    await deactivate(async_client, jefe, u)
    await mk(async_client, jefe, "Soporte", p)  # otra unidad tomó el nombre
    r = await reactivate(async_client, jefe, u)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_DUPLICATE"
    assert (await get(async_client, jefe, u))["status"] == "inactive"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "body",
    [{}, {"from_date": ""}, {"from_date": "ayer"}, {"from_date": (date.today() + timedelta(days=2)).isoformat()}, {"from_date": TODAY, "x": 1}],
    ids=["ausente", "vacia", "texto", "futura", "campo-extra"],
)
async def test_reactivar_con_cuerpo_invalido_400(async_client, jefe, body):
    u = await mk(async_client, jefe, "U")
    await deactivate(async_client, jefe, u)
    r = await reactivate(async_client, jefe, u, body)
    assert r.status_code == 400 and code(r) == "VALIDATION_ERROR"
    assert (await get(async_client, jefe, u))["status"] == "inactive"


@pytest.mark.asyncio
async def test_reactivar_no_puede_empezar_antes_de_que_cerrara_la_vigencia_anterior(async_client, engine, jefe):
    from sqlalchemy import text

    u = await mk(async_client, jefe, "U")
    await deactivate(async_client, jefe, u)
    async with engine.begin() as conn:  # la baja ocurrió hace 3 días
        await conn.execute(
            text("UPDATE tb_party_role SET from_date = :f, thru_date = :t WHERE fk_party_id = :u"),
            {"u": u["id"], "f": date.today() - timedelta(days=10), "t": date.today() - timedelta(days=3)},
        )
    r = await reactivate(async_client, jefe, u, {"from_date": (date.today() - timedelta(days=5)).isoformat()})
    assert r.status_code == 400 and code(r) == "VALIDATION_ERROR"
    ok = await reactivate(async_client, jefe, u, {"from_date": (date.today() - timedelta(days=3)).isoformat()})
    assert ok.status_code == 200 and ok.json()["from_date"] == (date.today() - timedelta(days=3)).isoformat()


@pytest.mark.asyncio
async def test_unidad_reactivada_se_puede_desactivar_de_nuevo(async_client, jefe):
    u = await mk(async_client, jefe, "U")
    await deactivate(async_client, jefe, u)
    await reactivate(async_client, jefe, u)
    r = await deactivate(async_client, jefe, u)
    assert r.status_code == 200 and r.json()["status"] == "inactive"


@pytest.mark.asyncio
@pytest.mark.skipif(not __import__("tests.conftest", fromlist=["x"]).TEST_DATABASE_URL, reason="la concurrencia real exige PostgreSQL")
async def test_crear_una_hija_mientras_se_desactiva_el_padre_no_deja_hija_activa_bajo_padre_inactivo(async_client, engine, jefe):
    import asyncio

    for i in range(6):  # varias vueltas: la carrera depende del orden de las consultas
        p = await mk(async_client, jefe, f"P{i}")
        child = {"name": f"H{i}", "type": "internal_unit", "parent_id": p["id"], "contact": {"email_work": f"h{i}@example.com"}}
        d, c = await asyncio.gather(deactivate(async_client, jefe, p), async_client.post(URL, json=child, headers=jefe))
        parent_after = await get(async_client, jefe, p)
        kids = [o for o in (await async_client.get(URL, params={"parent_id": p["id"]}, headers=jefe)).json()["data"]]
        assert not (parent_after["status"] == "inactive" and kids), (d.status_code, c.status_code)


@pytest.mark.asyncio
async def test_bloqueada_solo_por_personas_vigentes_sin_hijas(async_client, engine, jefe):
    # añadida tras la mutación M04: con hijas y personas a la vez, ignorar las personas pasaba inadvertido
    p = await mk(async_client, jefe, "P")
    await add_member(engine, p["id"])
    r = await deactivate(async_client, jefe, p)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_HAS_DEPENDENCIES"
    assert r.json()["error"]["details"] == {"active_children_count": 0, "current_people_count": 1}
