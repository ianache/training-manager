"""Esquema propio (ADR-011) y salud: las tablas y la alembic_version viven en el esquema catalog."""
from sqlalchemy import text

from app import main
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker


async def test_tablas_y_version_en_el_esquema_propio(migrated_postgres):
    with migrated_postgres.connect() as conn:
        tables = {r[0] for r in conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='catalog'"))}
        version = conn.execute(text("SELECT version_num FROM catalog.alembic_version")).scalar()
    assert {"tb_role", "tb_role_level", "tb_role_level_competency", "tb_competency", "tb_competency_version", "tb_competency_rubric_level", "tb_evidence_requirement", "alembic_version"} <= tables
    assert version == "0001_ldm002_catalog"


async def test_live_y_ready(async_client, engine, monkeypatch):
    monkeypatch.setattr(main, "async_session", sessionmaker(engine, class_=AsyncSession, expire_on_commit=False))
    assert (await async_client.get("/health/live")).json() == {"status": "alive"}
    r = await async_client.get("/health/ready")
    assert r.status_code == 200 and r.json()["schema_version"] == "0001_ldm002_catalog"
