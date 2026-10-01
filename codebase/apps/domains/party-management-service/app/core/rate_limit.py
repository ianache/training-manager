"""
Límite de solicitudes por usuario (API-SPEC-001 §4.5, hallazgo SRC-001-001).

- Quién: este microservicio, como dependencia de FastAPI (no lo hace el BFF).
- Clave: el usuario final de X-User-Name (ADR-005), ya validado por get_caller. Así un
  usuario no consume la cuota de otro aunque todos lleguen desde el mismo BFF.
- Cuotas por operación (SRC-001-001): lectura 1000/h, alta 100/h, actualización 500/h,
  anonimización 10/h (todavía sin endpoint). En producción API-SPEC-001 fija 10000/h para
  lectura: se configura con RATE_LIMIT_READ_PER_HOUR.
- Ventana fija de RATE_LIMIT_WINDOW_SECONDS (3600 por defecto).
- Respuestas: X-RateLimit-Limit, X-RateLimit-Remaining y X-RateLimit-Reset (época UNIX)
  en toda respuesta limitada; al exceder, 429 RATE_LIMIT_EXCEEDED con Retry-After y el
  formato de error de §4.2.

Limitación conocida: los contadores viven en la memoria del proceso. Con varias réplicas
o varios workers de uvicorn, cada uno cuenta por su lado. Para eso hay que mover el
almacén a Redis (ver README, "Brechas").
"""
from __future__ import annotations

import asyncio
import math
import time
from collections.abc import Callable
from dataclasses import dataclass

from fastapi import Depends, Response

from app.config import config
from app.core.auth import Caller, get_caller
from app.core.errors import ApiError
from app.core.logging import logger


@dataclass(frozen=True)
class Decision:
    allowed: bool
    limit: int
    remaining: int
    reset_at: int  # época UNIX en segundos


class FixedWindowLimiter:
    """Contador por (usuario, política) en ventanas fijas. Seguro para un solo proceso asyncio."""

    def __init__(self, clock: Callable[[], float] = time.time):
        self._clock = clock
        self._counts: dict[tuple[str, str], tuple[int, int]] = {}  # clave → (inicio de ventana, cuenta)
        self._lock = asyncio.Lock()

    async def hit(self, key: str, policy: str, limit: int, window: int) -> Decision:
        now = self._clock()
        start = int(now // window * window)
        async with self._lock:
            window_start, count = self._counts.get((key, policy), (start, 0))
            if window_start != start:
                count = 0
            allowed = count < limit
            if allowed:
                count += 1
            self._counts[(key, policy)] = (start, count)
            if len(self._counts) > 10_000:
                self._purge(start)
        return Decision(allowed, limit, max(0, limit - count), start + window)

    def _purge(self, current_start: int) -> None:
        for k in [k for k, (s, _) in self._counts.items() if s != current_start]:
            del self._counts[k]

    def reset(self) -> None:
        self._counts.clear()


limiter = FixedWindowLimiter()


def _limit_for(policy: str) -> int:
    return {
        "read": config.RATE_LIMIT_READ_PER_HOUR,
        "create": config.RATE_LIMIT_CREATE_PER_HOUR,
        "update": config.RATE_LIMIT_UPDATE_PER_HOUR,
        "anonymize": config.RATE_LIMIT_ANONYMIZE_PER_HOUR,
    }[policy]


def rate_limited(policy: str):
    """Dependencia de ruta: cuenta la solicitud del usuario y corta con 429 si excede."""
    _limit_for(policy)  # política desconocida → error al importar el router, no en tiempo de ejecución

    async def _dependency(response: Response, caller: Caller = Depends(get_caller)) -> None:
        if not config.RATE_LIMIT_ENABLED:
            return
        limit, window = _limit_for(policy), config.RATE_LIMIT_WINDOW_SECONDS
        decision = await limiter.hit(caller.username, policy, limit, window)
        headers = {
            "X-RateLimit-Limit": str(decision.limit),
            "X-RateLimit-Remaining": str(decision.remaining),
            "X-RateLimit-Reset": str(decision.reset_at),
        }
        if not decision.allowed:
            retry_after = max(1, math.ceil(decision.reset_at - time.time()))
            logger.warning("rate_limit_exceeded", user=caller.username, policy=policy, limit=limit)
            raise ApiError(
                429,
                "RATE_LIMIT_EXCEEDED",
                f"Superaste el límite de {limit} solicitudes por {window // 60} minutos para esta operación.",
                {"policy": policy, "limit": limit, "window_seconds": window, "retry_after": retry_after},
                headers={**headers, "Retry-After": str(retry_after)},
            )
        response.headers.update(headers)

    return _dependency
