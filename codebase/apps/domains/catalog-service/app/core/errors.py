"""
Errores con el formato estándar de API-SPEC-001 §4.2:

    {"error": {"code", "message", "status", "timestamp", "request_id", "details"}}
"""
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging import logger


class ApiError(Exception):
    def __init__(
        self,
        status: int,
        code: str,
        message: str,
        details: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
    ):
        super().__init__(message)
        self.status = status
        self.code = code
        self.message = message
        self.details = details
        self.headers = headers


def authentication_failed(message: str = "La credencial del servicio llamante no es válida.") -> ApiError:
    return ApiError(401, "AUTHENTICATION_FAILED", message)


def authorization_failed(message: str = "No tienes permiso para realizar esta acción.") -> ApiError:
    return ApiError(403, "AUTHORIZATION_FAILED", message)


def not_found(message: str = "El recurso no existe.") -> ApiError:
    return ApiError(404, "RESOURCE_NOT_FOUND", message)


def _body(request: Request, status: int, code: str, message: str, details: Any = None) -> dict:
    error: dict[str, Any] = {
        "code": code,
        "message": message,
        "status": status,
        "timestamp": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "request_id": getattr(request.state, "request_id", None),
    }
    if details:
        error["details"] = details
    return {"error": error}


_STATUS_CODES = {
    400: "VALIDATION_ERROR",
    401: "AUTHENTICATION_FAILED",
    403: "AUTHORIZATION_FAILED",
    404: "RESOURCE_NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    409: "CONFLICT",
    412: "PRECONDITION_FAILED",
    428: "PRECONDITION_REQUIRED",
    422: "UNPROCESSABLE_ENTITY",
    429: "RATE_LIMIT_EXCEEDED",
}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def _api_error(request: Request, exc: ApiError):
        return JSONResponse(
            _body(request, exc.status, exc.code, exc.message, exc.details), status_code=exc.status, headers=exc.headers
        )

    @app.exception_handler(RequestValidationError)
    async def _validation(request: Request, exc: RequestValidationError):
        fields = [
            {"field": ".".join(str(p) for p in e["loc"] if p != "body"), "message": e["msg"]} for e in exc.errors()
        ]
        return JSONResponse(
            _body(request, 400, "VALIDATION_ERROR", "Los datos enviados no son válidos.", {"fields": fields}),
            status_code=400,
        )

    @app.exception_handler(StarletteHTTPException)
    async def _http(request: Request, exc: StarletteHTTPException):
        code = _STATUS_CODES.get(exc.status_code, "INTERNAL_SERVER_ERROR")
        return JSONResponse(_body(request, exc.status_code, code, str(exc.detail)), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def _unexpected(request: Request, exc: Exception):
        logger.error("unhandled_error", error=str(exc), request_id=getattr(request.state, "request_id", None))
        return JSONResponse(
            _body(request, 500, "INTERNAL_SERVER_ERROR", "Ocurrió un error inesperado."), status_code=500
        )
