"""
Esquema creado por `alembic upgrade head` sobre PostgreSQL (solo con TEST_DATABASE_URL).

Comprueba que el ORM coincide con las tablas reales y que las reglas de PDM-001 que la
API usa siguen en la base.
"""
import pytest
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError

from app.models.base import Base
from tests.conftest import TEST_DATABASE_URL

pytestmark = pytest.mark.skipif(not TEST_DATABASE_URL, reason="requiere TEST_DATABASE_URL (PostgreSQL)")


def test_version_en_head(migrated_postgres):
    with migrated_postgres.connect() as conn:
        assert conn.scalar(text("SELECT version_num FROM alembic_version")) == "0005_org_name_history"


def test_orm_coincide_con_la_base(migrated_postgres):
    insp = inspect(migrated_postgres)
    db_tables = set(insp.get_table_names())
    for table in Base.metadata.sorted_tables:
        assert table.name in db_tables, table.name
        db_cols = {c["name"] for c in insp.get_columns(table.name)}
        orm_cols = {c.name for c in table.columns}
        assert orm_cols <= db_cols, f"{table.name}: faltan {orm_cols - db_cols}"


def test_nombres_std_db_001(migrated_postgres):
    insp = inspect(migrated_postgres)
    assert all(t.startswith("tb_") for t in insp.get_table_names() if t != "alembic_version")
    assert {fk["name"] for fk in insp.get_foreign_keys("tb_party_contact_mechanism")} == {
        "fk_tb_party_contact_mechanism_tb_party",
        "fk_tb_party_contact_mechanism_tb_contact_mechanism",
        "fk_tb_party_contact_mechanism_tb_contact_purpose_type",
        "fk_tb_party_contact_mechanism_tb_profile_platform",
    }
    indexes = {i["name"] for i in insp.get_indexes("tb_contact_mechanism")}
    assert "idx_contact_mechanism_email_active" in indexes
    with migrated_postgres.connect() as conn:
        names = conn.scalars(text("SELECT conname FROM pg_constraint WHERE connamespace = 'public'::regnamespace"))
        assert all(len(n) <= 63 for n in names)


def test_catalogos_sembrados(migrated_postgres):
    with migrated_postgres.connect() as conn:
        roles = set(conn.scalars(text("SELECT pk_code FROM tb_party_role_type")))
        purposes = set(conn.scalars(text("SELECT pk_code FROM tb_contact_purpose_type")))
    assert {"EMPLOYEE", "CONTRACTOR", "ENGINEERING_HEAD"} <= roles
    assert {"WORK_EMAIL", "WORK_PHONE"} <= purposes


def test_correo_unico_sin_distinguir_mayusculas(migrated_postgres):
    insert = text(
        "INSERT INTO tb_contact_mechanism (pk_contact_mechanism_id, fk_contact_mechanism_type_code, "
        "contact_value, created_by) VALUES (:id, 'EMAIL', :v, 'test')"
    )
    with pytest.raises(IntegrityError, match="idx_contact_mechanism_email_active"):
        with migrated_postgres.begin() as conn:
            conn.execute(insert, {"id": "00000000-0000-0000-0000-0000000000a1", "v": "dup@example.com"})
            conn.execute(insert, {"id": "00000000-0000-0000-0000-0000000000a2", "v": "DUP@example.com"})


def test_propositos_de_contacto_de_la_organizacion(migrated_postgres):
    with migrated_postgres.connect() as conn:
        rows = dict(conn.execute(text(
            "SELECT pk_code, fk_contact_mechanism_type_code FROM tb_contact_purpose_type "
            "WHERE pk_code IN ('ORGANIZATION_EMAIL', 'ORGANIZATION_PHONE')")).all())
    assert rows == {"ORGANIZATION_EMAIL": "EMAIL", "ORGANIZATION_PHONE": "PHONE"}


def test_historial_del_nombre_de_la_organizacion(migrated_postgres):
    """US-029 AC-2 / BR-PTY-12: el valor anterior se conserva; nombre vacío o sin cambio, y el padre inexistente, se rechazan."""
    with migrated_postgres.begin() as conn:
        conn.execute(text("INSERT INTO tb_party (pk_party_id, party_kind, created_by) VALUES ('p-hist', 'ORGANIZATION', 't')"))
        conn.execute(text("INSERT INTO tb_organization (pk_party_id, party_kind, organization_name, created_by) VALUES ('p-hist', 'ORGANIZATION', 'Soporte', 't')"))
        conn.execute(text("INSERT INTO tb_organization_name_history (pk_organization_name_history_id, fk_party_id, previous_name, new_name, changed_by) VALUES ('h1', 'p-hist', 'Soporte', 'Soporte Técnico', 'u1')"))
    with migrated_postgres.connect() as conn:
        assert conn.execute(text("SELECT previous_name, new_name FROM tb_organization_name_history WHERE pk_organization_name_history_id = 'h1'")).one() == ("Soporte", "Soporte Técnico")
    for sql in (
        "INSERT INTO tb_organization_name_history (pk_organization_name_history_id, fk_party_id, previous_name, new_name, changed_by) VALUES ('h2', 'p-hist', 'A', 'A', 'u1')",
        "INSERT INTO tb_organization_name_history (pk_organization_name_history_id, fk_party_id, previous_name, new_name, changed_by) VALUES ('h3', 'p-hist', ' ', 'B', 'u1')",
        "INSERT INTO tb_organization_name_history (pk_organization_name_history_id, fk_party_id, previous_name, new_name, changed_by) VALUES ('h4', 'no-existe', 'A', 'B', 'u1')",
    ):
        with pytest.raises(IntegrityError):
            with migrated_postgres.begin() as conn:
                conn.execute(text(sql))
