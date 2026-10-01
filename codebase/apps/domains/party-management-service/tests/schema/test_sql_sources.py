"""La línea base de Alembic es una copia exacta del DDL de PDM-001 (sin deriva)."""
from pathlib import Path

import pytest

SERVICE = Path(__file__).resolve().parents[2]
VENDORED = SERVICE / "migrations" / "sql" / "0001_pdm001_party_postgresql.sql"
# codebase/apps/domains/party-management-service → raíz del repositorio
SOURCE = SERVICE.parents[3] / "knowledge-base" / "architecture" / "data-model" / "ddl" / "party-postgresql.sql"


def test_copia_de_la_linea_base_existe():
    assert "CREATE TABLE party_role_type" in VENDORED.read_text(encoding="utf-8")


@pytest.mark.skipif(not SOURCE.exists(), reason="fuera del repositorio (por ejemplo, en la imagen Docker)")
def test_linea_base_igual_al_ddl_de_pdm_001():
    assert VENDORED.read_bytes() == SOURCE.read_bytes(), (
        "El DDL de PDM-001 cambió. Agrega una revisión nueva de Alembic con el cambio; "
        "no edites la línea base ya aplicada."
    )
