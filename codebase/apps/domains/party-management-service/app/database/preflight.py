"""
Revisión previa a `alembic upgrade head` (la ejecuta docker-entrypoint.sh).

Si la base tiene tablas pero no tiene la tabla alembic_version, es un volumen creado
antes de que Alembic fuera el dueño del esquema (DDL montado en initdb o create_all).
Migrar encima fallaría con errores confusos; se detiene con instrucciones claras.
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
        tables = set(inspect(engine).get_table_names())
    finally:
        engine.dispose()
    if tables and "alembic_version" not in tables:
        print(
            "ERROR: la base ya tiene tablas (" + ", ".join(sorted(tables)[:5]) + ", ...) pero no la tabla "
            "alembic_version. Es un volumen anterior a las migraciones con Alembic.\n"
            "En desarrollo, borre el volumen y vuelva a levantar el stack:\n"
            "  docker compose -p codebase down -v && docker compose up -d --build",
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
