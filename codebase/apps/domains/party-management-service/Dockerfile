FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY alembic.ini docker-entrypoint.sh ./
COPY migrations/ migrations/
COPY app/ app/
# Saltos de línea Unix aunque el repositorio se haya clonado en Windows
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 8000

# Listo solo cuando la base responde y las migraciones corrieron (/health/ready)
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/ready')" || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
