#!/bin/sh
# Arranque del servicio: el esquema lo crea y versiona Alembic (ASM-002), no la aplicación.
set -e
python -m app.database.preflight
alembic upgrade head
exec uvicorn app.main:app --host "${API_HOST:-0.0.0.0}" --port "${API_PORT:-8000}"
