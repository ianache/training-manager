"""
Fixtures: base de datos de prueba y un Keycloak simulado con llaves RSA reales,
para probar la validación de firma del token del BFF (ADR-005) sin red.

Base de datos:
- Por defecto, SQLite en memoria con las tablas del ORM (rápido, sin servicios).
- Con TEST_DATABASE_URL (PostgreSQL), el esquema real: se borra el esquema public, se
  ejecuta `alembic upgrade head` una vez por sesión y se vacían las tablas entre pruebas.
  El usuario de esa URL debe ser dueño de la base (por ejemplo, postgres en una base
  party_test). Ver TESTING.md.
"""
import os
import time
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
from app.models.base import Base

_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
_OTHER_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)


class _FakeJwk:
    def __init__(self, key):
        self.key = key


class _FakeJwksClient:
    def get_signing_key_from_jwt(self, token: str):
        return _FakeJwk(_KEY.public_key())


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
        claims = {
            "iss": iss or config.KEYCLOAK_ISSUER,
            "azp": azp,
            "iat": now,
            "exp": now + exp_in,
            "sub": "service-account-bff-app",
        }
        return jwt.encode(claims, key or _KEY, algorithm="RS256", headers={"kid": "test"})

    return _make


@pytest.fixture
def other_key():
    return _OTHER_KEY


@pytest.fixture
def as_user(make_token) -> Callable[..., dict]:
    """Headers que envía el BFF en nombre de un usuario final."""

    def _headers(username: str = "jefe.ingenieria", roles: str = "colaborador,jefe_ingenieria") -> dict:
        return {
            "Authorization": f"Bearer {make_token()}",
            "X-User-Name": username,
            "X-User-Roles": roles,
            "X-Request-ID": "req-test-1",
        }

    return _headers


@pytest.fixture
def jefe(as_user):
    return as_user("jefe.ingenieria", "colaborador,jefe_ingenieria")


@pytest.fixture
def colaborador(as_user):
    return as_user("ana.colaboradora", "colaborador")


TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")
DATA_TABLES = (
    "tb_party_contact_mechanism, tb_contact_mechanism, tb_party_identification, tb_party_role, tb_person, tb_party"
)


@pytest.fixture(scope="session")
def migrated_postgres():
    """Esquema real de PDM-001 creado por Alembic (solo con TEST_DATABASE_URL)."""
    if not TEST_DATABASE_URL:
        yield None
        return
    from alembic import command
    from alembic.config import Config as AlembicConfig

    sync = create_engine(TEST_DATABASE_URL.replace("+asyncpg", "+psycopg2"))
    with sync.begin() as conn:
        conn.execute(text("DROP SCHEMA public CASCADE"))
        conn.execute(text("CREATE SCHEMA public"))
    cfg = AlembicConfig(os.path.join(os.path.dirname(__file__), "..", "alembic.ini"))
    cfg.set_main_option("script_location", os.path.join(os.path.dirname(__file__), "..", "migrations"))
    cfg.set_main_option("sqlalchemy.url", TEST_DATABASE_URL)
    # la migración 0006 carga la organización interna desde estas variables (DTC-017); valores solo de prueba
    os.environ.setdefault("INTERNAL_ORG_NAME", "COMSATEL DE PRUEBA S.A.C.")
    os.environ.setdefault("INTERNAL_ORG_RUC", "20999999991")
    command.upgrade(cfg, "head")
    yield sync
    sync.dispose()


@pytest.fixture
async def engine(migrated_postgres):
    if migrated_postgres is not None:
        with migrated_postgres.begin() as conn:
            conn.execute(text(f"TRUNCATE {DATA_TABLES} CASCADE"))
        engine = create_async_engine(TEST_DATABASE_URL)
    else:
        engine = create_async_engine("sqlite+aiosqlite:///:memory:")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def async_client(engine):
    session_factory = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_db():
        async with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()


PARTY = {
    "first_names": "Juan",
    "last_names": "Pérez López",
    "preferred_name": "Juan Pérez",
    "email_work": "juan.perez@example.com",
    "identification_type": "DNI",
    "identification_number": "12345678",
    "identification_country": "PE",
    "party_type": "Employee",
}


@pytest.fixture
def party_payload() -> dict:
    return dict(PARTY)
