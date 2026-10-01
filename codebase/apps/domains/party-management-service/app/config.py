import os
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Config(BaseSettings):
    """Configuración desde variables de entorno."""

    # Base de datos
    DATABASE_URL: str = "sqlite+aiosqlite:///:memory:"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_POOL_TIMEOUT: int = 30

    # Confianza en el BFF (ADR-005 §2): el servicio solo acepta el JWT de la cuenta de
    # servicio del BFF, emitido por Keycloak, y toma la identidad del usuario de X-User-Name.
    KEYCLOAK_ISSUER: str = "http://localhost:8080/realms/gestion-formacion"
    """Issuer público tal como viene en el claim `iss` del token."""
    KEYCLOAK_JWKS_URL: str = "http://localhost:8080/realms/gestion-formacion/protocol/openid-connect/certs"
    """URL de las llaves públicas; en docker-compose, por la red interna (keycloak:8080)."""
    KEYCLOAK_ALLOWED_CLIENTS: str = "bff-app"
    """Clientes (claim `azp`) autorizados a llamar al servicio, separados por coma."""
    AUTH_LEEWAY_SECONDS: int = 30

    # Servicio
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    SEED_DEMO_DATA: bool = False
    """Solo desarrollo: crea colaboradores de ejemplo si la tabla está vacía."""

    # Límite de solicitudes por usuario (API-SPEC-001 §4.5, SRC-001-001)
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_WINDOW_SECONDS: int = 3600
    RATE_LIMIT_READ_PER_HOUR: int = 1000
    """1000 en desarrollo; API-SPEC-001 fija 10000 en producción."""
    RATE_LIMIT_CREATE_PER_HOUR: int = 100
    RATE_LIMIT_UPDATE_PER_HOUR: int = 500
    RATE_LIMIT_ANONYMIZE_PER_HOUR: int = 10

    # Logging
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    model_config = SettingsConfigDict(env_file=".env" if os.path.exists(".env") else None, case_sensitive=True)

    @property
    def allowed_clients(self) -> set[str]:
        return {c.strip() for c in self.KEYCLOAK_ALLOWED_CLIENTS.split(",") if c.strip()}


config = Config()
