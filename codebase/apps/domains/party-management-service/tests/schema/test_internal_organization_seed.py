"""
Carga inicial de la organización interna (migración 0006; DTC-017, US-017, BR-PTY-02/03/07/28).

La organización interna es un registro único fuera de la API gestionada (BR-PTY-28): no hay endpoint ni
formulario para crearla. La migración la inserta una sola vez, con la razón social y el RUC que llegan por
las variables de entorno INTERNAL_ORG_NAME e INTERNAL_ORG_RUC; nunca va escrita en el código.
"""
import os

import pytest
from alembic import command
from alembic.config import Config as AlembicConfig
from sqlalchemy import create_engine, text

from tests.conftest import TEST_DATABASE_URL

pytestmark = pytest.mark.skipif(not TEST_DATABASE_URL, reason="requiere TEST_DATABASE_URL (PostgreSQL)")

ANTES = "0005_org_name_history"
NOMBRE = "COMSATEL DE PRUEBA S.A.C."
RUC = "20999999991"

ORG_INTERNA = (
    "SELECT o.pk_party_id, o.organization_name, i.identification_number, i.issuing_country_code, "
    "r.from_date, r.thru_date, r.party_kind "
    "FROM tb_party_role r JOIN tb_organization o ON o.pk_party_id = r.fk_party_id "
    "JOIN tb_party_identification i ON i.fk_party_id = r.fk_party_id "
    "WHERE r.fk_party_role_type_code = 'INTERNAL_ORGANIZATION'"
)


def _cfg() -> AlembicConfig:
    base = os.path.join(os.path.dirname(__file__), "..", "..")
    cfg = AlembicConfig(os.path.join(base, "alembic.ini"))
    cfg.set_main_option("script_location", os.path.join(base, "migrations"))
    cfg.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    return cfg


@pytest.fixture
def antes_de_0006(monkeypatch):
    """Base vacía migrada hasta 0005, sin las variables de la organización interna."""
    monkeypatch.delenv("INTERNAL_ORG_NAME", raising=False)
    monkeypatch.delenv("INTERNAL_ORG_RUC", raising=False)
    engine = create_engine(TEST_DATABASE_URL.replace("+asyncpg", "+psycopg2"))
    with engine.begin() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
    command.upgrade(_cfg(), ANTES)
    yield engine
    # deja la base como la espera el resto de la suite: en head y con la organización de prueba
    with engine.begin() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
    os.environ["INTERNAL_ORG_NAME"] = NOMBRE
    os.environ["INTERNAL_ORG_RUC"] = RUC
    try:
        command.upgrade(_cfg(), "head")
    finally:
        os.environ.pop("INTERNAL_ORG_NAME", None)
        os.environ.pop("INTERNAL_ORG_RUC", None)
    engine.dispose()


def _con_variables(monkeypatch, nombre=NOMBRE, ruc=RUC):
    monkeypatch.setenv("INTERNAL_ORG_NAME", nombre)
    monkeypatch.setenv("INTERNAL_ORG_RUC", ruc)


def test_crea_la_organizacion_interna_con_su_ruc_y_rol_vigente(antes_de_0006, monkeypatch):
    _con_variables(monkeypatch)
    command.upgrade(_cfg(), "head")
    with antes_de_0006.connect() as conn:
        filas = conn.execute(text(ORG_INTERNA)).all()
    assert len(filas) == 1
    _, nombre, ruc, pais, desde, hasta, tipo = filas[0]
    assert (nombre, ruc, pais, tipo) == (NOMBRE, RUC, "PE", "ORGANIZATION")
    assert desde is not None and hasta is None


def test_es_idempotente_si_ya_hay_una_organizacion_interna(antes_de_0006, monkeypatch):
    with antes_de_0006.begin() as conn:
        conn.execute(text("INSERT INTO tb_party (pk_party_id, party_kind, created_by) VALUES ('p-existente', 'ORGANIZATION', 'test')"))
        conn.execute(
            text(
                "INSERT INTO tb_organization (pk_party_id, party_kind, organization_name, created_by) "
                "VALUES ('p-existente', 'ORGANIZATION', 'YA EXISTE', 'test')"
            )
        )
        conn.execute(
            text(
                "INSERT INTO tb_party_role (pk_party_role_id, fk_party_id, party_kind, fk_party_role_type_code, from_date, created_by) "
                "VALUES ('r-existente', 'p-existente', 'ORGANIZATION', 'INTERNAL_ORGANIZATION', CURRENT_DATE, 'test')"
            )
        )
    _con_variables(monkeypatch)
    command.upgrade(_cfg(), "head")
    with antes_de_0006.connect() as conn:
        roles = conn.scalar(text("SELECT count(*) FROM tb_party_role WHERE fk_party_role_type_code = 'INTERNAL_ORGANIZATION'"))
        nombre = conn.scalar(text("SELECT organization_name FROM tb_organization WHERE pk_party_id = 'p-existente'"))
        organizaciones = conn.scalar(text("SELECT count(*) FROM tb_organization"))
    assert (roles, nombre, organizaciones) == (1, "YA EXISTE", 1)


def test_se_detiene_si_falta_la_razon_social_o_el_ruc(antes_de_0006, monkeypatch):
    with pytest.raises(Exception, match="INTERNAL_ORG_NAME|INTERNAL_ORG_RUC"):
        command.upgrade(_cfg(), "head")
    with antes_de_0006.connect() as conn:
        assert conn.scalar(text("SELECT version_num FROM alembic_version")) == ANTES


@pytest.mark.parametrize("ruc", ["2099999999", "209999999912", "2099999999A", " "])
def test_rechaza_un_ruc_que_no_tiene_11_digitos(antes_de_0006, monkeypatch, ruc):
    _con_variables(monkeypatch, ruc=ruc)
    with pytest.raises(Exception, match="RUC"):
        command.upgrade(_cfg(), "head")
    with antes_de_0006.connect() as conn:
        assert conn.scalar(text("SELECT count(*) FROM tb_party_role WHERE fk_party_role_type_code = 'INTERNAL_ORGANIZATION'")) == 0


def test_downgrade_retira_solo_la_organizacion_interna(antes_de_0006, monkeypatch):
    with antes_de_0006.begin() as conn:
        conn.execute(text("INSERT INTO tb_party (pk_party_id, party_kind, created_by) VALUES ('p-unidad', 'ORGANIZATION', 'test')"))
        conn.execute(
            text(
                "INSERT INTO tb_organization (pk_party_id, party_kind, organization_name, created_by) "
                "VALUES ('p-unidad', 'ORGANIZATION', 'Unidad que debe quedar', 'test')"
            )
        )
    _con_variables(monkeypatch)
    command.upgrade(_cfg(), "head")
    command.downgrade(_cfg(), ANTES)
    with antes_de_0006.connect() as conn:
        assert conn.scalar(text("SELECT count(*) FROM tb_party_role WHERE fk_party_role_type_code = 'INTERNAL_ORGANIZATION'")) == 0
        assert conn.scalar(text("SELECT count(*) FROM tb_organization WHERE organization_name = :n"), {"n": NOMBRE}) == 0
        assert conn.scalar(text("SELECT count(*) FROM tb_organization WHERE pk_party_id = 'p-unidad'")) == 1
