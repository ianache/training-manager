"""PDM-001: modelo físico de partes para PostgreSQL (línea base)

Ejecuta una copia exacta de
knowledge-base/architecture/data-model/ddl/party-postgresql.sql (D30), con sus catálogos
de tipos y datos semilla. tests/migrations/test_sql_sources.py comprueba que la copia no
se aparte del original.

Revision ID: 0001_pdm001_baseline
Revises:
Create Date: 2026-10-01
"""
from alembic import op

from migrations.sql_runner import run_sql_file
from migrations.versions import TABLES

revision = "0001_pdm001_baseline"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    run_sql_file("0001_pdm001_party_postgresql.sql")


def downgrade() -> None:
    for table in TABLES:
        op.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
