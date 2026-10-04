"""
Migración 0007 (DCP-004 fase 2, API-SPEC-006 §5): unicidad del nombre de una unidad entre las de su mismo padre
(BR-PTY-26), una sola relación de estructura vigente por unidad (BR-PTY-12) y versión de fila para If-Match (Q-8).

Prueba el ascenso con datos previos (rellenado), los índices y el descenso.
"""
import os
import uuid

import pytest
from alembic import command
from alembic.config import Config as AlembicConfig
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import IntegrityError

from tests.conftest import TEST_DATABASE_URL

pytestmark = pytest.mark.skipif(not TEST_DATABASE_URL, reason="requiere TEST_DATABASE_URL (PostgreSQL)")

ANTES = "0006_internal_org"
DESPUES = "0007_unit_name_scope"
NOMBRE, RUC = "COMSATEL DE PRUEBA S.A.C.", "20999999991"


def _cfg() -> AlembicConfig:
    base = os.path.join(os.path.dirname(__file__), "..", "..")
    cfg = AlembicConfig(os.path.join(base, "alembic.ini"))
    cfg.set_main_option("script_location", os.path.join(base, "migrations"))
    cfg.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    return cfg


def _reset_to(engine, revision, monkeypatch=None):
    with engine.begin() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
    os.environ["INTERNAL_ORG_NAME"], os.environ["INTERNAL_ORG_RUC"] = NOMBRE, RUC
    command.upgrade(_cfg(), revision)


@pytest.fixture
def db():
    engine = create_engine(TEST_DATABASE_URL.replace("+asyncpg", "+psycopg2"))
    _reset_to(engine, ANTES)
    yield engine
    _reset_to(engine, "head")  # deja la base como la espera el resto de la suite
    engine.dispose()


def _unidad(conn, nombre, padre_rol=None, activa=True):
    pid, rid = str(uuid.uuid4()), str(uuid.uuid4())
    conn.execute(text("INSERT INTO tb_party (pk_party_id, party_kind, created_by) VALUES (:p, 'ORGANIZATION', 't')"), {"p": pid})
    conn.execute(
        text("INSERT INTO tb_organization (pk_party_id, party_kind, organization_name, created_by) VALUES (:p, 'ORGANIZATION', :n, 't')"),
        {"p": pid, "n": nombre},
    )
    cierre = "" if activa else ", thru_date, thru_recorded_at, thru_recorded_by"
    valores = "" if activa else ", CURRENT_DATE, now(), 't'"
    conn.execute(
        text(
            "INSERT INTO tb_party_role (pk_party_role_id, fk_party_id, party_kind, fk_party_role_type_code, from_date, created_by"
            + cierre
            + ") VALUES (:r, :p, 'ORGANIZATION', 'ORGANIZATIONAL_UNIT', CURRENT_DATE - 5, 't'"
            + valores
            + ")"
        ),
        {"r": rid, "p": pid},
    )
    if padre_rol:
        _relacion(conn, rid, padre_rol)
    return pid, rid


def _relacion(conn, desde, hacia, tipo="ORG_STRUCTURE", cierre=False):
    conn.execute(
        text(
            "INSERT INTO tb_party_relationship (pk_party_relationship_id, fk_party_relationship_type_code, fk_party_role_from_id, "
            "fk_party_role_to_id, from_date, thru_date, created_by) VALUES (:i, :t, :f, :to, CURRENT_DATE - 5, "
            + ("CURRENT_DATE" if cierre else "NULL")
            + ", 't')"
        ),
        {"i": str(uuid.uuid4()), "t": tipo, "f": desde, "to": hacia},
    )


def _datos_previos(engine):
    with engine.begin() as conn:
        raiz, raiz_rol = _unidad(conn, "Raiz")
        h1, h1_rol = _unidad(conn, "Backend", raiz_rol)
        h2, _ = _unidad(conn, "Frontend", raiz_rol)
        baja, _ = _unidad(conn, "Baja", raiz_rol, activa=False)
    return {"raiz": raiz, "raiz_rol": raiz_rol, "h1": h1, "h1_rol": h1_rol, "h2": h2, "baja": baja}


def test_ascenso_rellena_el_alcance_del_nombre_y_la_version(db):
    d = _datos_previos(db)
    command.upgrade(_cfg(), DESPUES)
    with db.connect() as conn:
        alcance = dict(conn.execute(text("SELECT pk_party_id, unit_name_scope FROM tb_organization")).all())
        versiones = set(conn.scalars(text("SELECT row_version FROM tb_organization")))
    assert alcance[d["raiz"]] == "ROOT"
    assert alcance[d["h1"]] == alcance[d["h2"]] == d["raiz"]
    assert alcance[d["baja"]] is None  # una unidad inactiva no ocupa nombre
    interna = [v for k, v in alcance.items() if k not in d.values()]
    assert interna == [None]  # la organización interna de 0006 no es una unidad
    assert versiones == {1}


def test_indice_unico_del_nombre_por_padre_sin_distinguir_mayusculas(db):
    d = _datos_previos(db)
    command.upgrade(_cfg(), DESPUES)
    with pytest.raises(IntegrityError) as err:
        with db.begin() as conn:
            pid = str(uuid.uuid4())
            conn.execute(text("INSERT INTO tb_party (pk_party_id, party_kind, created_by) VALUES (:p, 'ORGANIZATION', 't')"), {"p": pid})
            conn.execute(
                text(
                    "INSERT INTO tb_organization (pk_party_id, party_kind, organization_name, unit_name_scope, created_by) "
                    "VALUES (:p, 'ORGANIZATION', 'BACKEND', :s, 't')"
                ),
                {"p": pid, "s": d["raiz"]},
            )
    assert "idx_organization_unit_name_scope" in str(err.value)
    with db.begin() as conn:  # otro padre, o sin alcance (inactiva / proveedor): se permite
        for scope in ("otro-padre", None):
            pid = str(uuid.uuid4())
            conn.execute(text("INSERT INTO tb_party (pk_party_id, party_kind, created_by) VALUES (:p, 'ORGANIZATION', 't')"), {"p": pid})
            conn.execute(
                text(
                    "INSERT INTO tb_organization (pk_party_id, party_kind, organization_name, unit_name_scope, created_by) "
                    "VALUES (:p, 'ORGANIZATION', 'Backend', :s, 't')"
                ),
                {"p": pid, "s": scope},
            )


def test_una_sola_relacion_de_estructura_vigente_por_unidad(db):
    d = _datos_previos(db)
    command.upgrade(_cfg(), DESPUES)
    with db.begin() as conn:
        _, otro_rol = _unidad(conn, "Otro")
        _relacion(conn, d["h1_rol"], otro_rol, cierre=True)  # una cerrada junto a la vigente: bien
        _relacion(conn, d["h1_rol"], otro_rol, tipo="MEMBERSHIP")  # otro tipo: bien
    with pytest.raises(IntegrityError) as err:
        with db.begin() as conn:
            _relacion(conn, d["h1_rol"], otro_rol)  # segunda vigente
    assert "idx_party_relationship_org_structure_open" in str(err.value)


def test_el_orm_declara_las_columnas_nuevas(db):
    command.upgrade(_cfg(), DESPUES)
    from app.models.party import Organization

    columnas = {c["name"] for c in inspect(db).get_columns("tb_organization")}
    assert {"row_version", "unit_name_scope"} <= columnas
    assert {c.name for c in Organization.__table__.columns} <= columnas


def test_descenso_quita_columnas_e_indices_y_conserva_los_datos(db):
    d = _datos_previos(db)
    command.upgrade(_cfg(), DESPUES)
    command.downgrade(_cfg(), ANTES)
    insp = inspect(db)
    assert not {"row_version", "unit_name_scope"} & {c["name"] for c in insp.get_columns("tb_organization")}
    assert "idx_organization_unit_name_scope" not in {i["name"] for i in insp.get_indexes("tb_organization")}
    assert "idx_party_relationship_org_structure_open" not in {i["name"] for i in insp.get_indexes("tb_party_relationship")}
    with db.connect() as conn:
        assert conn.scalar(text("SELECT count(*) FROM tb_organization WHERE pk_party_id = :p"), {"p": d["raiz"]}) == 1
        assert conn.scalar(text("SELECT version_num FROM alembic_version")) == ANTES
    command.upgrade(_cfg(), DESPUES)  # y vuelve a subir
    assert "unit_name_scope" in {c["name"] for c in inspect(db).get_columns("tb_organization")}
