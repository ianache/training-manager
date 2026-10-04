import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.config import config
from app.core.errors import register_error_handlers
from app.core.logging import logger, setup_logging
from app.database.engine import async_session
from app.routers.competencies import router as competencies_router
from app.routers.roles import router as roles_router

setup_logging()


@asynccontextmanager
async def lifespan(_: FastAPI):
    # El esquema ya existe: lo crea `alembic upgrade head` antes de arrancar (Dockerfile).
    if config.SEED_DEMO_DATA and config.API_ENVIRONMENT == "development":
        from app.database.seed import seed_demo_data

        await seed_demo_data()
    yield


app = FastAPI(
    title="Catalog Service",
    description="Catálogo de roles, niveles de rol y competencias (ADR-011). Solo lo consume el BFF (ADR-001, ADR-005).",
    version="0.1.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)
# Sin CORS: el navegador nunca llama a este servicio, solo el BFF (ADR-001).


@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    request.state.request_id = request_id[:128]
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    caller = getattr(request.state, "caller", None)
    if not request.url.path.startswith("/health"):
        logger.info(
            "request",
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            request_id=request.state.request_id,
            user=caller.username if caller else None,
        )
    return response


register_error_handlers(app)
app.include_router(roles_router)
app.include_router(competencies_router)


@app.get("/health/live", include_in_schema=False)
async def health_live():
    return {"status": "alive"}


@app.get("/health/ready", include_in_schema=False)
async def health_ready():
    """Lista para tráfico si la base responde y las migraciones ya corrieron."""
    try:
        async with async_session() as db:
            version = await db.scalar(text("SELECT version_num FROM alembic_version"))
    except Exception as exc:  # noqa: BLE001 - cualquier fallo de base deja el servicio no listo
        logger.warning("readiness_failed", error=type(exc).__name__)
        return JSONResponse({"status": "not_ready"}, status_code=503)
    return {"status": "ready", "schema_version": version}
