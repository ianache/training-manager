"""
Entorno de Alembic.

- La URL viene de DATABASE_URL (la misma del servicio). Las migraciones usan el driver
  síncrono psycopg2 porque ejecutan scripts SQL con varias sentencias, que asyncpg no
  acepta en una sola llamada.
- Solo PostgreSQL: el DDL de origen es el anexo PostgreSQL de LDM-002.
"""
from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine, pool

from app.config import config as app_config

alembic_config = context.config
if alembic_config.config_file_name is not None:
    fileConfig(alembic_config.config_file_name)


def sync_url() -> str:
    url = alembic_config.get_main_option("sqlalchemy.url") or app_config.DATABASE_URL
    return url.replace("+asyncpg", "+psycopg2")


def run_migrations_offline() -> None:
    context.configure(url=sync_url(), literal_binds=True, transaction_per_migration=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    url = sync_url()
    if not url.startswith("postgresql"):
        raise RuntimeError(f"Las migraciones solo soportan PostgreSQL; DATABASE_URL={url.split('://')[0]}")
    engine = create_engine(url, poolclass=pool.NullPool)
    schema = app_config.DATABASE_SCHEMA
    with engine.connect() as connection:
        # Esquema propio del servicio (ADR-011): se crea, se usa como search_path y guarda
        # su propia alembic_version, sin chocar con la de party en public.
        connection.exec_driver_sql(f'CREATE SCHEMA IF NOT EXISTS "{schema}"')
        connection.exec_driver_sql(f'SET search_path TO "{schema}"')
        connection.commit()
        # Cada revisión en su propia transacción: PostgreSQL tiene DDL transaccional,
        # así que una revisión que falla no deja el esquema a medias.
        context.configure(connection=connection, transaction_per_migration=True, version_table_schema=schema)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
