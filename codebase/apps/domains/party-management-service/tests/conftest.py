import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database.engine import get_db
from app.models.base import Base


@pytest.fixture
async def engine():
    """In-memory SQLite engine"""
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def db_session(engine):
    """AsyncSession for testing"""
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session


@pytest.fixture
async def async_client(db_session):
    """FastAPI test client with mocked DB"""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

    app.dependency_overrides.clear()


@pytest.fixture
def jefe_token():
    """Valid JWT for Jefe de Ingeniería"""
    return "jefe.valid.token"


@pytest.fixture
def colaborador_token():
    """Valid JWT for Colaborador"""
    return "dev.valid.token"
