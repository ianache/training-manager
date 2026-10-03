"""tb_organization: code y location de la unidad (API-SPEC-002)

Revision ID: 0003_organization_code_location
Revises: 0002_std_db_001_alignment
Create Date: 2026-10-03
"""
from alembic import op

revision = "0003_organization_code_location"
down_revision = "0002_std_db_001_alignment"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TABLE tb_organization ADD COLUMN code VARCHAR(40) NULL")
    op.execute("ALTER TABLE tb_organization ADD COLUMN location VARCHAR(120) NULL")


def downgrade() -> None:
    op.execute("ALTER TABLE tb_organization DROP COLUMN location")
    op.execute("ALTER TABLE tb_organization DROP COLUMN code")