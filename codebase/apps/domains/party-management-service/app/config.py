from pydantic_settings import BaseSettings
from typing import Literal


class Config(BaseSettings):
    """Application configuration from environment variables"""

    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 10
    DATABASE_POOL_TIMEOUT: int = 30

    # Keycloak
    KEYCLOAK_URL: str
    KEYCLOAK_REALM: str
    KEYCLOAK_CLIENT_ID: str
    KEYCLOAK_CLIENT_SECRET: str
    KEYCLOAK_PUBLIC_KEY_URL: str

    # Service
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    API_ENVIRONMENT: Literal["development", "staging", "production"] = "development"

    # Rate Limiting
    RATE_LIMIT_DEFAULT: str = "1000/hour"
    RATE_LIMIT_AUTH: str = "100/hour"

    # Logging
    LOG_FORMAT: Literal["json", "text"] = "json"
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    class Config:
        env_file = ".env"
        case_sensitive = True


config = Config()
