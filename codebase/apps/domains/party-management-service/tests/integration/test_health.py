"""Salud: /health/ready exige la base migrada por Alembic (tabla alembic_version)."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

from app import main
from tests.conftest import TEST_DATABASE_URL


async def test_live_sin_base(async_client):
    assert (await async_client.get("/health/live")).json() == {"status": "alive"}


async def test_ready_depende_de_las_migraciones(async_client, engine, monkeypatch):
    monkeypatch.setattr(main, "async_session", sessionmaker(engine, class_=AsyncSession, expire_on_commit=False))
    r = await async_client.get("/health/ready")
    if TEST_DATABASE_URL:  # esquema creado por Alembic
        assert r.status_code == 200 and r.json()["schema_version"] == "0002_std_db_001_alignment"
    else:  # SQLite con create_all: no hay alembic_version
        assert r.status_code == 503 and r.json() == {"status": "not_ready"}
