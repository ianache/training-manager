from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.config import config
from app.models.base import Base


# SQLite doesn't support pool_size/pool_timeout
engine_kwargs = {
    "echo": False,
    "pool_pre_ping": True,
}
if "sqlite" not in config.DATABASE_URL:
    engine_kwargs["pool_size"] = config.DATABASE_POOL_SIZE
    engine_kwargs["pool_timeout"] = config.DATABASE_POOL_TIMEOUT

engine = create_async_engine(
    config.DATABASE_URL,
    **engine_kwargs
)

async_session = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db():
    """Create all tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:
    """Dependency: Get AsyncSession"""
    async with async_session() as session:
        yield session
