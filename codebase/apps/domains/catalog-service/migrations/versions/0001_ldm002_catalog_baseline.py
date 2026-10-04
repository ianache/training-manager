"""LDM-002: modelo físico del catálogo de roles y competencias (línea base)

Ejecuta una copia exacta de
knowledge-base/architecture/data-model/ddl/catalog-postgresql.sql, dentro del esquema
propio del servicio (ADR-011). tests/schema comprueba que la copia no se aparte del original.

Revision ID: 0001_ldm002_catalog
Revises:
Create Date: 2026-10-04
"""
from alembic import op

from migrations.sql_runner import run_sql_file
from migrations.versions import TABLES

revision = "0001_ldm002_catalog"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    run_sql_file("0001_ldm002_catalog_postgresql.sql")


def downgrade() -> None:
    for table in TABLES:
        op.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
