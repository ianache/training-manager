"""
Fixtures: PostgreSQL real con el esquema creado por Alembic (ADR-011) y un Keycloak simulado con
llaves RSA reales para probar la validación de firma del token del BFF (ADR-005) sin red.

SQLite no sirve aquí: no habría detectado el orden de INSERT ni los índices parciales del DDL
(lección de party). Hace falta TEST_DATABASE_URL apuntando a una base vacía cuyo usuario sea
dueño (por ejemplo postgres en una base catalog_test); sin ella, las pruebas se omiten.
"""
import os
import time
import uuid
from datetime import datetime, timezone
from typing import Callable

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from httpx import AsyncClient
from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.config import config
from app.core import auth
from app.database.engine import get_db
from app.main import app
from app.models.catalog import (
    Competency,
    CompetencyVersion,
    EvidenceRequirement,
    Role,
    RoleLevel,
    RoleLevelCompetency,
)

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
SCHEMA = config.DATABASE_SCHEMA
DATA_TABLES = ", ".join(
    f"{SCHEMA}.{t}"
    for t in (
        "tb_role_level_competency",
        "tb_role_level",
        "tb_role",
        "tb_evidence_requirement",
        "tb_competency_rubric_level",
        "tb_competency_version",
        "tb_competency",
    )
)

_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
_OTHER_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)


class _FakeJwk:
    def __init__(self, key):
        self.key = key


class _FakeJwksClient:
    def get_signing_key_from_jwt(self, token: str):
        return _FakeJwk(_KEY.public_key())


def pytest_collection_modifyitems(items):
    if not TEST_DATABASE_URL:
        skip = pytest.mark.skip(reason="Requiere TEST_DATABASE_URL (PostgreSQL)")
        for item in items:
            item.add_marker(skip)


@pytest.fixture(autouse=True)
def reset_rate_limit():
    from app.core.rate_limit import limiter

    limiter.reset()
    yield
    limiter.reset()


@pytest.fixture(autouse=True)
def fake_keycloak(monkeypatch):
    auth._jwks_client.cache_clear()
    monkeypatch.setattr(auth, "_jwks_client", lambda: _FakeJwksClient())


@pytest.fixture
def make_token() -> Callable[..., str]:
    def _make(azp: str = "bff-app", iss: str | None = None, exp_in: int = 300, key=None) -> str:
        now = int(time.time())
        claims = {"iss": iss or config.KEYCLOAK_ISSUER, "azp": azp, "iat": now, "exp": now + exp_in, "sub": "service-account-bff-app"}
        return jwt.encode(claims, key or _KEY, algorithm="RS256", headers={"kid": "test"})

    return _make


@pytest.fixture
def other_key():
    return _OTHER_KEY


@pytest.fixture
def as_user(make_token) -> Callable[..., dict]:
    def _headers(username: str = "jefe.ingenieria", roles: str = "colaborador,jefe_ingenieria") -> dict:
        return {"Authorization": f"Bearer {make_token()}", "X-User-Name": username, "X-User-Roles": roles, "X-Request-ID": "req-test-1"}

    return _headers


@pytest.fixture
def jefe(as_user):
    return as_user("jefe.ingenieria", "colaborador,jefe_ingenieria")


@pytest.fixture
def admin(as_user):
    return as_user("admin.plataforma", "colaborador,admin")


@pytest.fixture
def product_owner(as_user):
    return as_user("po.producto", "colaborador,product_owner")


@pytest.fixture
def colaborador(as_user):
    return as_user("ana.colaboradora", "colaborador")


@pytest.fixture(scope="session")
def migrated_postgres():
    """Esquema real creado por Alembic, una vez por sesión."""
    if not TEST_DATABASE_URL:
        yield None
        return
    from alembic import command
    from alembic.config import Config as AlembicConfig

    sync = create_engine(TEST_DATABASE_URL.replace("+asyncpg", "+psycopg2"))
    with sync.begin() as conn:
        conn.execute(text(f"DROP SCHEMA IF EXISTS {SCHEMA} CASCADE"))
    root = os.path.join(os.path.dirname(__file__), "..")
    cfg = AlembicConfig(os.path.join(root, "alembic.ini"))
    cfg.set_main_option("script_location", os.path.join(root, "migrations"))
    cfg.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    command.upgrade(cfg, "head")
    yield sync
    sync.dispose()


@pytest.fixture
async def engine(migrated_postgres):
    with migrated_postgres.begin() as conn:
        conn.execute(text(f"TRUNCATE {DATA_TABLES} CASCADE"))
    engine = create_async_engine(TEST_DATABASE_URL, connect_args={"server_settings": {"search_path": SCHEMA}})
    yield engine
    await engine.dispose()


@pytest.fixture
def session_factory(engine):
    return sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture
async def async_client(session_factory):
    async def override_get_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
async def db(session_factory):
    async with session_factory() as session:
        yield session


# ---------------------------------------------------------------- fábricas de datos


def _id() -> str:
    return str(uuid.uuid4())


class Factory:
    """Crea competencias y roles directamente en la base, para probar la lectura y las reglas del servicio."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def competency(
        self,
        name: str,
        status: str = "ACTIVE",
        version_status: str = "APPROVED",
        requirements: dict[str, list[bool]] | None = None,
        version_number: int = 1,
        competency_id: str | None = None,
    ) -> dict:
        """`requirements`: nivel → lista de `is_required` de sus requisitos. Por defecto L1..L3 con uno requerido."""
        requirements = {"L1": [True], "L2": [True], "L3": [True, False]} if requirements is None else requirements
        cid = competency_id
        if cid is None:
            cid = _id()
            self.db.add(Competency(id=cid, name=name, status=status, created_by="test"))
            await self.db.flush()
        vid = _id()
        approved = version_status != "DRAFT"
        self.db.add(
            CompetencyVersion(
                id=vid,
                competency_id=cid,
                version_number=version_number,
                status=version_status,
                approved_at=datetime.now(timezone.utc) if approved else None,
                approved_by="test" if approved else None,
                created_by="test",
            )
        )
        await self.db.flush()
        for level, flags in requirements.items():
            for i, required in enumerate(flags):
                self.db.add(
                    EvidenceRequirement(
                        id=_id(), competency_version_id=vid, level_code=level, category="FORMACION", description=f"Requisito {level}-{i}", is_required=required, created_by="test"
                    )
                )
        await self.db.commit()
        return {"competency_id": cid, "version_id": vid}

    async def role(self, name: str, levels: list[tuple[str, list[tuple[dict, str]]]], status: str = "ACTIVE") -> dict:
        """`levels`: [(nombre del nivel, [(competencia de `competency()`, L esperado)])]."""
        rid = _id()
        self.db.add(Role(id=rid, name=name, status=status, created_by="test"))
        await self.db.flush()
        level_ids = []
        for ordinal, (level_name, comps) in enumerate(levels, start=1):
            lid = _id()
            level_ids.append(lid)
            self.db.add(RoleLevel(id=lid, role_id=rid, name=level_name, ordinal=ordinal, created_by="test"))
            await self.db.flush()
            for comp, required_level in comps:
                self.db.add(
                    RoleLevelCompetency(role_level_id=lid, competency_id=comp["competency_id"], competency_version_id=comp["version_id"], required_level=required_level, created_by="test")
                )
        await self.db.commit()
        return {"id": rid, "level_ids": level_ids}


@pytest.fixture
def factory(db) -> Factory:
    return Factory(db)


def role_payload(name: str = "Developer", levels: list[dict] | None = None, comp: dict | None = None) -> dict:
    """Cuerpo válido de POST/PUT /roles con un nivel y una competencia."""
    if levels is None:
        levels = [
            {"name": "Junior", "ordinal": 1, "competencies": [{"competency_id": comp["competency_id"], "version_id": comp["version_id"], "required_level": "L1"}]}
        ]
    return {"name": name, "description": None, "levels": levels}
