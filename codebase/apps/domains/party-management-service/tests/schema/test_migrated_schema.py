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
        assert conn.scalar(text("SELECT version_num FROM alembic_version")) == "0002_std_db_001_alignment"


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
