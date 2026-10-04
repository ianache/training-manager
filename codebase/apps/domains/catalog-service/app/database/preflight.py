"""
Revisión previa a `alembic upgrade head` (la ejecuta docker-entrypoint.sh).

El catálogo vive en su propio esquema (ADR-011). Si ese esquema tiene tablas pero no su
tabla alembic_version, alguien creó las tablas a mano: migrar encima fallaría con errores
confusos, así que se detiene con instrucciones claras. Las tablas de otros servicios
(esquema public) no cuentan.
"""
import sys

from sqlalchemy import create_engine, inspect

from app.config import config


def main() -> int:
    url = config.DATABASE_URL.replace("+asyncpg", "+psycopg2")
    if not url.startswith("postgresql"):
        return 0
    engine = create_engine(url)
    try:
        inspector = inspect(engine)
        if config.DATABASE_SCHEMA not in inspector.get_schema_names():
            return 0
        tables = set(inspector.get_table_names(schema=config.DATABASE_SCHEMA))
    finally:
        engine.dispose()
    if tables and "alembic_version" not in tables:
        sample = ", ".join(sorted(tables)[:5])
        print(
            f"ERROR: el esquema {config.DATABASE_SCHEMA} tiene tablas ({sample}, ...) pero no la tabla "
            "alembic_version.\n"
            "En desarrollo, borre el esquema y vuelva a levantar el servicio:\n"
            f"  DROP SCHEMA {config.DATABASE_SCHEMA} CASCADE;",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
