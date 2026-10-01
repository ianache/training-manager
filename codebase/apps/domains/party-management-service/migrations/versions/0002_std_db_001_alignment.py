"""STD-DB-001: prefijos tb_/pk_/fk_/idx_ (V003 + V004 corregidos para PostgreSQL)

Las correcciones frente a los scripts portables (C1 a C5) están documentadas en la
cabecera de migrations/sql/0002_std_db_001_alignment_postgresql.sql.

Revision ID: 0002_std_db_001_alignment
Revises: 0001_pdm001_baseline
Create Date: 2026-10-01
"""
from alembic import op

from migrations.sql_runner import run_sql_file
from migrations.versions import TABLES

revision = "0002_std_db_001_alignment"
down_revision = "0001_pdm001_baseline"
branch_labels = None
depends_on = None


def upgrade() -> None:
    run_sql_file("0002_std_db_001_alignment_postgresql.sql")


def downgrade() -> None:
    # Deshacer cada renombrado no aporta nada: se borran las tablas alineadas y se vuelve
    # a crear la línea base de 0001, que es el estado que corresponde a esa revisión.
    # Borra los datos: solo para desarrollo.
    for table in TABLES:
        op.execute(f"DROP TABLE IF EXISTS tb_{table} CASCADE")
    run_sql_file("0001_pdm001_party_postgresql.sql")
