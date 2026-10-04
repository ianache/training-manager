"""POST /organizations/{id}/parent (API-SPEC-006 §3.4, US-029 AC-3..6; BR-PTY-12, 22, 25, 26)."""
import asyncio
from datetime import date, timedelta

import pytest

from tests.conftest import TEST_DATABASE_URL
from tests.integration.org_helpers import CONTACT, GHOST, URL, mk, rows
from tests.integration.test_org_list_extended import close_in_db

TODAY = date.today().isoformat()


async def move(c, h, unit, parent, from_date=TODAY, **headers):
    body = {"parent_id": parent["id"] if isinstance(parent, dict) else parent, "from_date": from_date}
    return await c.post(f"{URL}/{unit['id']}/parent", json=body, headers={**h, **headers})


def code(r):
    return r.json()["error"]["code"]


@pytest.mark.asyncio
async def test_mueve_la_unidad_cierra_la_relacion_anterior_y_abre_la_nueva(async_client, engine, jefe):
    a, b = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B")
    u = await mk(async_client, jefe, "U", a)
    r = await move(async_client, jefe, u, b)
    assert r.status_code == 200 and r.json()["parent_id"] == b["id"]
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["parent_id"] == b["id"]
    rels = await rows(
        engine,
        "SELECT p.organization_name, rel.thru_date, rel.created_by, rel.updated_by FROM tb_party_relationship rel "
        "JOIN tb_party_role fr ON fr.pk_party_role_id = rel.fk_party_role_from_id "
        "JOIN tb_party_role tr ON tr.pk_party_role_id = rel.fk_party_role_to_id "
        "JOIN tb_organization p ON p.pk_party_id = tr.fk_party_id "
        "WHERE fr.fk_party_id = :u AND rel.fk_party_relationship_type_code = 'ORG_STRUCTURE' ORDER BY rel.created_at",
        u=u["id"],
    )
    assert [(x[0], x[1] and str(x[1])) for x in rels] == [("A", TODAY), ("B", None)]  # la anterior queda cerrada, nada se borra
    assert rels[0][3] == "jefe.ingenieria" and rels[1][2] == "jefe.ingenieria"  # quién cerró y quién abrió


@pytest.mark.asyncio
async def test_a_la_unidad_superior_con_parent_id_nulo(async_client, jefe):
    a = await mk(async_client, jefe, "A")
    u = await mk(async_client, jefe, "U", a)
    r = await async_client.post(f"{URL}/{u['id']}/parent", json={"parent_id": None, "from_date": TODAY}, headers=jefe)
    assert r.status_code == 200 and r.json()["parent_id"] is None


@pytest.mark.asyncio
async def test_mover_al_mismo_padre_no_cambia_nada(async_client, engine, jefe):
    a = await mk(async_client, jefe, "A")
    u = await mk(async_client, jefe, "U", a)
    r = await move(async_client, jefe, u, a)
    assert r.status_code == 200 and r.json()["parent_id"] == a["id"] and r.json()["row_version"] == u["row_version"]
    assert len(await rows(engine, "SELECT 1 FROM tb_party_relationship WHERE fk_party_relationship_type_code = 'ORG_STRUCTURE'")) == 1


@pytest.mark.asyncio
async def test_ciclo_consigo_misma_con_hija_y_con_nieta_409(async_client, jefe):
    a = await mk(async_client, jefe, "A")
    b = await mk(async_client, jefe, "B", a)
    c = await mk(async_client, jefe, "C", b)
    for unit, parent in ((a, a), (a, b), (a, c)):  # A bajo sí misma, bajo su hija, bajo su nieta
        r = await move(async_client, jefe, unit, parent)
        assert r.status_code == 409 and code(r) == "ORGANIZATION_CYCLE", (unit["name"], parent["name"])
    assert (await async_client.get(f"{URL}/{a['id']}", headers=jefe)).json()["parent_id"] is None  # nada cambió


@pytest.mark.asyncio
async def test_padre_inactivo_409_y_padre_inexistente_o_proveedor_404(async_client, engine, jefe):
    u, p = await mk(async_client, jefe, "U"), await mk(async_client, jefe, "P")
    await close_in_db(engine, p["id"])
    r = await move(async_client, jefe, u, p)
    assert r.status_code == 409 and code(r) == "PARENT_INACTIVE"
    assert (await move(async_client, jefe, u, GHOST)).status_code == 404
    prov = (
        await async_client.post(
            URL, json={"name": "Seguridad Sur", "type": "external_provider", "ruc": "20123456789", "contact": CONTACT}, headers=jefe
        )
    ).json()
    assert (await move(async_client, jefe, u, prov)).status_code == 404


@pytest.mark.asyncio
async def test_nombre_repetido_bajo_el_nuevo_padre_409_y_permitido_bajo_otro(async_client, jefe):
    p1, p2, p3 = await mk(async_client, jefe, "P1"), await mk(async_client, jefe, "P2"), await mk(async_client, jefe, "P3")
    await mk(async_client, jefe, "Backend", p1)
    u = await mk(async_client, jefe, "BACKEND", p2)
    r = await move(async_client, jefe, u, p1)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_DUPLICATE"
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["parent_id"] == p2["id"]
    assert (await move(async_client, jefe, u, p3)).status_code == 200


@pytest.mark.asyncio
async def test_el_nombre_ocupado_se_libera_en_el_padre_anterior(async_client, jefe):
    p1, p2 = await mk(async_client, jefe, "P1"), await mk(async_client, jefe, "P2")
    u = await mk(async_client, jefe, "Backend", p1)
    assert (await move(async_client, jefe, u, p2)).status_code == 200
    await mk(async_client, jefe, "Backend", p1)  # ya se puede reutilizar bajo P1


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "from_date",
    [None, "", "no-es-fecha", "2026-13-40", (date.today() + timedelta(days=1)).isoformat(), "1999-01-01"],
    ids=["ausente", "vacia", "texto", "calendario", "futura", "anterior-a-la-relacion-vigente"],
)
async def test_from_date_invalida_400(async_client, jefe, from_date):
    a, b = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B")
    u = await mk(async_client, jefe, "U", a)
    body = {"parent_id": b["id"]} if from_date is None else {"parent_id": b["id"], "from_date": from_date}
    r = await async_client.post(f"{URL}/{u['id']}/parent", json=body, headers=jefe)
    assert r.status_code == 400 and code(r) == "VALIDATION_ERROR"
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["parent_id"] == a["id"]


@pytest.mark.asyncio
@pytest.mark.parametrize("body", [{"from_date": TODAY}, {"parent_id": "no-uuid", "from_date": TODAY}, {"parent_id": None, "from_date": TODAY, "x": 1}])
async def test_cuerpo_invalido_400(async_client, jefe, body):
    u = await mk(async_client, jefe, "U")
    r = await async_client.post(f"{URL}/{u['id']}/parent", json=body, headers=jefe)
    assert r.status_code == 400 and code(r) == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_unidad_inactiva_409_e_inexistente_404(async_client, engine, jefe):
    a, u = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "U")
    await close_in_db(engine, u["id"])
    r = await move(async_client, jefe, u, a)
    assert r.status_code == 409 and code(r) == "ORGANIZATION_INACTIVE"
    assert (await async_client.post(f"{URL}/{GHOST}/parent", json={"parent_id": a["id"], "from_date": TODAY}, headers=jefe)).status_code == 404


@pytest.mark.asyncio
async def test_permisos(async_client, as_user, jefe, colaborador):
    a, u = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "U")
    r = await move(async_client, colaborador, u, a)
    assert r.status_code == 403 and code(r) == "AUTHORIZATION_FAILED"
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["parent_id"] is None
    assert (await move(async_client, as_user("admin.ti", "admin"), u, a)).status_code == 200


@pytest.mark.asyncio
async def test_if_match_obsoleto_412(async_client, jefe):
    a, b = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B")
    u = await mk(async_client, jefe, "U")
    ok = await move(async_client, jefe, u, a, **{"If-Match": str(u["row_version"])})
    assert ok.status_code == 200 and ok.json()["row_version"] == u["row_version"] + 1
    stale = await move(async_client, jefe, u, b, **{"If-Match": str(u["row_version"])})
    assert stale.status_code == 412 and code(stale) == "PRECONDITION_FAILED"
    assert (await async_client.get(f"{URL}/{u['id']}", headers=jefe)).json()["parent_id"] == a["id"]


@pytest.mark.asyncio
async def test_listado_y_arbol_siguen_al_nuevo_padre(async_client, jefe):
    a, b = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B")
    u = await mk(async_client, jefe, "U", a)
    await mk(async_client, jefe, "U1", u)
    await move(async_client, jefe, u, b)
    r = await async_client.get(URL, params={"ancestor_id": b["id"]}, headers=jefe)
    assert [o["name"] for o in r.json()["data"]] == ["B", "U", "U1"]  # la rama se movió completa
    r = await async_client.get(URL, params={"ancestor_id": a["id"]}, headers=jefe)
    assert [o["name"] for o in r.json()["data"]] == ["A"]


@pytest.mark.asyncio
@pytest.mark.skipif(not TEST_DATABASE_URL, reason="la concurrencia real exige PostgreSQL")
async def test_dos_cambios_de_padre_simultaneos_dejan_una_sola_relacion_vigente(async_client, engine, jefe):
    a, b, c = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B"), await mk(async_client, jefe, "C")
    u = await mk(async_client, jefe, "U", a)
    r1, r2 = await asyncio.gather(move(async_client, jefe, u, b), move(async_client, jefe, u, c))
    assert sorted([r1.status_code, r2.status_code]) == [200, 200]  # sin If-Match se serializan, ninguna da 500
    abiertas = await rows(
        engine,
        "SELECT 1 FROM tb_party_relationship rel JOIN tb_party_role fr ON fr.pk_party_role_id = rel.fk_party_role_from_id "
        "WHERE fr.fk_party_id = :u AND rel.fk_party_relationship_type_code = 'ORG_STRUCTURE' AND rel.thru_date IS NULL",
        u=u["id"],
    )
    assert len(abiertas) == 1


@pytest.mark.asyncio
@pytest.mark.skipif(not TEST_DATABASE_URL, reason="la concurrencia real exige PostgreSQL")
async def test_dos_cambios_simultaneos_con_la_misma_version_solo_uno_gana(async_client, jefe):
    a, b, c = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B"), await mk(async_client, jefe, "C")
    u = await mk(async_client, jefe, "U", a)
    h = {"If-Match": str(u["row_version"])}
    r1, r2 = await asyncio.gather(move(async_client, jefe, u, b, **h), move(async_client, jefe, u, c, **h))
    assert sorted([r1.status_code, r2.status_code]) == [200, 412]


@pytest.mark.asyncio
@pytest.mark.skipif(not TEST_DATABASE_URL, reason="la concurrencia real exige PostgreSQL")
async def test_dos_movimientos_cruzados_no_crean_un_ciclo(async_client, jefe):
    # A bajo B y B bajo A a la vez: una de las dos debe rechazarse por ciclo
    a, b = await mk(async_client, jefe, "A"), await mk(async_client, jefe, "B")
    r1, r2 = await asyncio.gather(move(async_client, jefe, a, b), move(async_client, jefe, b, a))
    assert sorted([r1.status_code, r2.status_code]) == [200, 409]
