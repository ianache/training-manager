"""Ejecuta un script SQL de migrations/sql/ dentro de la transacción de la revisión."""
from pathlib import Path

from alembic import op

SQL_DIR = Path(__file__).parent / "sql"


def run_sql_file(name: str) -> None:
    sql = (SQL_DIR / name).read_text(encoding="utf-8")
    # exec_driver_sql pasa el texto tal cual a psycopg2, que acepta varias sentencias.
    # Se escapan los % para que el driver no los tome como parámetros.
    op.get_bind().exec_driver_sql(sql.replace("%", "%%"))
