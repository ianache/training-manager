"""Propósitos de contacto de la organización (API-SPEC-002 §8b, IMD-002 R-31)

El correo de una organización puede coincidir con el de un colaborador (decisión de ianache, 2026-10-03).
Para no tocar BR-PTY-08 (ux_pcm_current_work_email, solo WORK_EMAIL), la organización usa propósitos propios.

Revision ID: 0004_org_contact_purposes
Revises: 0003_organization_code_location
Create Date: 2026-10-03
"""
from alembic import op

revision = "0004_org_contact_purposes"
down_revision = "0003_organization_code_location"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        "INSERT INTO tb_contact_purpose_type (pk_code, name, fk_contact_mechanism_type_code) VALUES "
        "('ORGANIZATION_EMAIL', 'Correo laboral de la organización', 'EMAIL'), "
        "('ORGANIZATION_PHONE', 'Teléfono laboral de la organización', 'PHONE')"
    )


def downgrade() -> None:
    op.execute("DELETE FROM tb_contact_purpose_type WHERE pk_code IN ('ORGANIZATION_EMAIL', 'ORGANIZATION_PHONE')")
