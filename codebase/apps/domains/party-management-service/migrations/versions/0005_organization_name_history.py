"""Historial de cambios del nombre de una organización (API-SPEC-006 §3.3 y §5, US-029 AC-2, BR-PTY-12)

El nombre de una unidad se corrige conservando el valor anterior y quién lo cambió. La tabla es solo de
inserción: la aplicación no actualiza ni borra filas (BR-PTY-12). La columna de autor guarda el
identificador del actor sin clave foránea, como las demás de auditoría (DM-10 de LDM-001).

Revision ID: 0005_org_name_history
Revises: 0004_org_contact_purposes
Create Date: 2026-10-04
"""
from alembic import op

revision = "0005_org_name_history"
down_revision = "0004_org_contact_purposes"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE tb_organization_name_history (
            pk_organization_name_history_id CHAR(36)     NOT NULL,
            fk_party_id                     CHAR(36)     NOT NULL,
            previous_name                   VARCHAR(200) NOT NULL,
            new_name                        VARCHAR(200) NOT NULL,
            changed_at                      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            changed_by                      VARCHAR(36)  NOT NULL,
            CONSTRAINT pk_tb_organization_name_history PRIMARY KEY (pk_organization_name_history_id),
            CONSTRAINT fk_tb_organization_name_history_tb_organization
                FOREIGN KEY (fk_party_id) REFERENCES tb_organization (pk_party_id),
            CONSTRAINT ck_organization_name_history_previous CHECK (btrim(previous_name) <> ''),
            CONSTRAINT ck_organization_name_history_new CHECK (btrim(new_name) <> ''),
            CONSTRAINT ck_organization_name_history_changed CHECK (previous_name <> new_name)
        )
        """
    )
    op.execute(
        "CREATE INDEX ix_organization_name_history_by_party "
        "ON tb_organization_name_history (fk_party_id, changed_at DESC)"
    )


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS tb_organization_name_history")
