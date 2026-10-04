"""Carga inicial de la organización interna (DTC-017, US-017, BR-PTY-02/03/07/28)

La organización interna (COMSATEL) es un registro único fuera de la API gestionada (BR-PTY-28, EVD-2026-0240):
no hay endpoint ni formulario para crearla. Esta migración la inserta una sola vez: la parte, la organización,
el rol vigente `INTERNAL_ORGANIZATION` y su RUC (país PE).

La razón social y el RUC no están en el código: llegan por las variables de entorno INTERNAL_ORG_NAME e
INTERNAL_ORG_RUC. Si faltan, o el RUC no tiene 11 dígitos (BR-PTY-07), la migración se detiene sin crear nada.
Es idempotente: si ya hay una organización interna, no hace nada. El `downgrade` retira solo lo que esta
migración creó (autor `migration-0006`).

Revision ID: 0006_internal_org
Revises: 0005_org_name_history
Create Date: 2026-10-04
"""
import os
import re
from uuid import uuid4

import sqlalchemy as sa
from alembic import op

revision = "0006_internal_org"
down_revision = "0005_org_name_history"
branch_labels = None
depends_on = None

AUTOR = "migration-0006"
ROL = "INTERNAL_ORGANIZATION"


def _variable(nombre: str) -> str:
    valor = (os.environ.get(nombre) or "").strip()
    if not valor:
        raise RuntimeError(f"Falta la variable de entorno {nombre}: la organización interna no se carga sin ella.")
    return valor


def upgrade() -> None:
    conn = op.get_bind()
    existe = conn.scalar(sa.text("SELECT count(*) FROM tb_party_role WHERE fk_party_role_type_code = :rol"), {"rol": ROL})
    if existe:
        return
    nombre = _variable("INTERNAL_ORG_NAME")
    ruc = _variable("INTERNAL_ORG_RUC")
    if len(nombre) > 200:
        raise RuntimeError("INTERNAL_ORG_NAME supera los 200 caracteres.")
    if not re.fullmatch(r"[0-9]{11}", ruc):
        raise RuntimeError("INTERNAL_ORG_RUC no es un RUC válido: debe tener 11 dígitos.")
    if conn.scalar(
        sa.text("SELECT count(*) FROM tb_party_identification WHERE fk_identification_type_code = 'RUC' AND identification_number = :r AND issuing_country_code = 'PE'"),
        {"r": ruc},
    ):
        raise RuntimeError("INTERNAL_ORG_RUC ya está registrado para otra organización (BR-PTY-07).")
    pid, rid, iid = str(uuid4()), str(uuid4()), str(uuid4())
    # el orden de INSERT lo fijan las claves foráneas reales de PostgreSQL
    conn.execute(sa.text("INSERT INTO tb_party (pk_party_id, party_kind, created_by) VALUES (:p, 'ORGANIZATION', :a)"), {"p": pid, "a": AUTOR})
    conn.execute(
        sa.text("INSERT INTO tb_organization (pk_party_id, party_kind, organization_name, created_by) VALUES (:p, 'ORGANIZATION', :n, :a)"),
        {"p": pid, "n": nombre, "a": AUTOR},
    )
    conn.execute(
        sa.text(
            "INSERT INTO tb_party_role (pk_party_role_id, fk_party_id, party_kind, fk_party_role_type_code, from_date, created_by) "
            "VALUES (:r, :p, 'ORGANIZATION', :rol, CURRENT_DATE, :a)"
        ),
        {"r": rid, "p": pid, "rol": ROL, "a": AUTOR},
    )
    conn.execute(
        sa.text(
            "INSERT INTO tb_party_identification (pk_party_identification_id, fk_party_id, party_kind, fk_identification_type_code, "
            "identification_number, issuing_country_code, created_by) VALUES (:i, :p, 'ORGANIZATION', 'RUC', :n, 'PE', :a)"
        ),
        {"i": iid, "p": pid, "n": ruc, "a": AUTOR},
    )


def downgrade() -> None:
    conn = op.get_bind()
    ids = conn.scalars(
        sa.text("SELECT fk_party_id FROM tb_party_role WHERE fk_party_role_type_code = :rol AND created_by = :a"),
        {"rol": ROL, "a": AUTOR},
    ).all()
    for pid in ids:
        for tabla, columna in (
            ("tb_party_identification", "fk_party_id"),
            ("tb_party_role", "fk_party_id"),
            ("tb_organization", "pk_party_id"),
            ("tb_party", "pk_party_id"),
        ):
            conn.execute(sa.text(f"DELETE FROM {tabla} WHERE {columna} = :p"), {"p": pid})
