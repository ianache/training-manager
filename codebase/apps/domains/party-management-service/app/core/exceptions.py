"""
Obsoleto: se mantiene solo por compatibilidad. Usar app.core.errors.ApiError, que produce el
formato de error estándar de API-SPEC-001 §4.2.
"""
from app.core.errors import ApiError, authorization_failed, not_found  # noqa: F401
