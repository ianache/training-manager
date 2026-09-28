from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import config
from app.core.logging import setup_logging
from app.database.engine import init_db
from app.routers.parties import router as parties_router

# Setup logging
setup_logging()

# Create app
app = FastAPI(
    title="Party Management Service",
    description="Master data management for parties (employees, contractors, organizations)",
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(parties_router)


@app.get("/health/live")
async def health_live():
    """Liveness probe"""
    return {"status": "alive"}


@app.get("/health/ready")
async def health_ready():
    """Readiness probe"""
    return {"status": "ready"}


@app.on_event("startup")
async def startup():
    """Initialize database on startup"""
    await init_db()


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global error handler"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=config.API_ENVIRONMENT == "development",
    )
