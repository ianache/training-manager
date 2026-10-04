"""
Motor y sesiones. El esquema lo crea y versiona Alembic (`alembic upgrade head`, ver
migrations/); el servicio no ejecuta create_all. Con PostgreSQL, las tablas viven en el
esquema propio del servicio (ADR-011): se fija con search_path.
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.config import config

# SQLite doesn't support pool_size/pool_timeout
engine_kwargs = {
    "echo": False,
    "pool_pre_ping": True,
}
if "sqlite" not in config.DATABASE_URL:
    engine_kwargs["pool_size"] = config.DATABASE_POOL_SIZE
    engine_kwargs["pool_timeout"] = config.DATABASE_POOL_TIMEOUT
    engine_kwargs["connect_args"] = {"server_settings": {"search_path": config.DATABASE_SCHEMA}}

engine = create_async_engine(config.DATABASE_URL, **engine_kwargs)

async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """Dependency: Get AsyncSession"""
    async with async_session() as session:
        yield session
