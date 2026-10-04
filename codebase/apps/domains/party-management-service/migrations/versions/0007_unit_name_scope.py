"""Unicidad del nombre de una unidad por padre, una relación de estructura vigente y versión de fila
(DCP-004 fase 2; API-SPEC-006 §5; BR-PTY-12, BR-PTY-26; Q-8)

BR-PTY-26: el nombre de una unidad es único entre las unidades con el mismo padre. El nombre vive en
tb_organization y el padre en tb_party_relationship, y un índice no cruza tablas. Por eso se guarda en
tb_organization el «alcance del nombre» (`unit_name_scope`): el id de la unidad padre vigente, `ROOT` para una
unidad superior activa, y NULL para lo que no ocupa nombre (unidades inactivas, proveedores, organización interna).
El servicio lo mantiene en cada alta, cambio de padre, desactivación y reactivación; el índice único
(alcance, nombre sin distinguir mayúsculas) tiene la última palabra ante una carrera.

También:
- índice único parcial: una unidad tiene a lo sumo una relación ORG_STRUCTURE vigente (cierra la carrera de dos
  cambios de padre simultáneos);
- `row_version`: versión de fila para la concurrencia optimista con If-Match (Q-8, supuesto de API-SPEC-006).

Si hay hermanas con el mismo nombre en los datos actuales, la migración se detiene y las lista (no corrige nada).

Revision ID: 0007_unit_name_scope
Revises: 0006_internal_org
Create Date: 2026-10-04
"""
import sqlalchemy as sa
from alembic import op

revision = "0007_unit_name_scope"
down_revision = "0006_internal_org"
branch_labels = None
depends_on = None

_ALCANCE = """
SELECT o.pk_party_id,
       COALESCE(
         (SELECT pr.fk_party_id
            FROM tb_party_relationship rel
            JOIN tb_party_role pr ON pr.pk_party_role_id = rel.fk_party_role_to_id
           WHERE rel.fk_party_role_from_id = ur.pk_party_role_id
             AND rel.fk_party_relationship_type_code = 'ORG_STRUCTURE'
             AND rel.thru_date IS NULL
           LIMIT 1),
         'ROOT') AS alcance
  FROM tb_organization o
  JOIN tb_party_role ur ON ur.fk_party_id = o.pk_party_id
 WHERE ur.fk_party_role_type_code = 'ORGANIZATIONAL_UNIT' AND ur.thru_date IS NULL
"""


def upgrade() -> None:
    conn = op.get_bind()
    op.execute("ALTER TABLE tb_organization ADD COLUMN row_version INTEGER NOT NULL DEFAULT 1")
    op.execute("ALTER TABLE tb_organization ADD COLUMN unit_name_scope VARCHAR(36) NULL")
    op.execute(
        f"UPDATE tb_organization o SET unit_name_scope = a.alcance FROM ({_ALCANCE}) a WHERE a.pk_party_id = o.pk_party_id"
    )
    repetidas = conn.execute(
        sa.text(
            "SELECT unit_name_scope, lower(organization_name), count(*) FROM tb_organization "
            "WHERE unit_name_scope IS NOT NULL GROUP BY 1, 2 HAVING count(*) > 1"
        )
    ).all()
    if repetidas:
        raise RuntimeError(f"Hay unidades hermanas con el mismo nombre (BR-PTY-26); corríjalas antes de migrar: {repetidas}")
    op.execute(
        "CREATE UNIQUE INDEX idx_organization_unit_name_scope "
        "ON tb_organization (unit_name_scope, lower(organization_name)) WHERE unit_name_scope IS NOT NULL"
    )
    op.execute(
        "CREATE UNIQUE INDEX idx_party_relationship_org_structure_open "
        "ON tb_party_relationship (fk_party_role_from_id) "
        "WHERE fk_party_relationship_type_code = 'ORG_STRUCTURE' AND thru_date IS NULL"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_party_relationship_org_structure_open")
    op.execute("DROP INDEX IF EXISTS idx_organization_unit_name_scope")
    op.execute("ALTER TABLE tb_organization DROP COLUMN IF EXISTS unit_name_scope")
    op.execute("ALTER TABLE tb_organization DROP COLUMN IF EXISTS row_version")
