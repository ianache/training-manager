import os
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    """Configuración desde variables de entorno."""

    # Base de datos: el PostgreSQL común (ADR-007), en un esquema propio (ADR-011).
    DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"
    DATABASE_SCHEMA: str = "catalog"
    """Esquema propio del servicio. Solo se aplica con PostgreSQL (search_path y tabla alembic_version)."""
    DATABASE_POOL_SIZE: int = 10
    DATABASE_POOL_TIMEOUT: int = 30

    # Confianza en el BFF (ADR-005 §2): solo se acepta el JWT de la cuenta de servicio del BFF.
    KEYCLOAK_ISSUER: str = "http://localhost:8080/realms/gestion-formacion"
    KEYCLOAK_JWKS_URL: str = "http://localhost:8080/realms/gestion-formacion/protocol/openid-connect/certs"
    KEYCLOAK_ALLOWED_CLIENTS: str = "bff-app"
    AUTH_LEEWAY_SECONDS: int = 30

    # Servicio
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    SEED_DEMO_DATA: bool = False
    """Solo desarrollo: crea competencias y roles de ejemplo si el catálogo está vacío."""

    # Límite de solicitudes por usuario (API-SPEC-003 §3: lectura 1000/h, escritura 100/h en desarrollo)
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_WINDOW_SECONDS: int = 3600
    RATE_LIMIT_READ_PER_HOUR: int = 1000
    RATE_LIMIT_CREATE_PER_HOUR: int = 100
    RATE_LIMIT_UPDATE_PER_HOUR: int = 100
    RATE_LIMIT_ANONYMIZE_PER_HOUR: int = 10

    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    model_config = SettingsConfigDict(env_file=".env" if os.path.exists(".env") else None, case_sensitive=True)

    @property
    def allowed_clients(self) -> set[str]:
        return {c.strip() for c in self.KEYCLOAK_ALLOWED_CLIENTS.split(",") if c.strip()}


config = Config()
