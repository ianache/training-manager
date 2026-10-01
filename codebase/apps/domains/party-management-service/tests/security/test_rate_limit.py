"""Límite de solicitudes por usuario (API-SPEC-001 §4.5, SRC-001-001)."""
import time

import pytest

from app.config import config
from app.core.rate_limit import FixedWindowLimiter


@pytest.fixture
def small_limits(monkeypatch):
    monkeypatch.setattr(config, "RATE_LIMIT_READ_PER_HOUR", 3)
    monkeypatch.setattr(config, "RATE_LIMIT_CREATE_PER_HOUR", 1)


async def test_cabeceras_en_respuesta_normal(async_client, jefe):
    r = await async_client.get("/api/v1/parties", headers=jefe)
    assert r.status_code == 200
    assert r.headers["X-RateLimit-Limit"] == str(config.RATE_LIMIT_READ_PER_HOUR)
    assert r.headers["X-RateLimit-Remaining"] == str(config.RATE_LIMIT_READ_PER_HOUR - 1)
    assert int(r.headers["X-RateLimit-Reset"]) > time.time()


async def test_429_con_formato_estandar(async_client, jefe, small_limits):
    for remaining in (2, 1, 0):
        r = await async_client.get("/api/v1/parties", headers=jefe)
        assert r.status_code == 200 and r.headers["X-RateLimit-Remaining"] == str(remaining)
    r = await async_client.get("/api/v1/parties", headers=jefe)
    assert r.status_code == 429
    err = r.json()["error"]
    assert err["code"] == "RATE_LIMIT_EXCEEDED" and err["status"] == 429
    assert err["details"]["limit"] == 3 and err["details"]["retry_after"] >= 1
    assert err["request_id"] == "req-test-1"
    assert int(r.headers["Retry-After"]) >= 1 and r.headers["X-RateLimit-Remaining"] == "0"


async def test_cuota_por_usuario_no_compartida(async_client, jefe, colaborador, small_limits):
    for _ in range(3):
        await async_client.get("/api/v1/parties", headers=jefe)
    assert (await async_client.get("/api/v1/parties", headers=jefe)).status_code == 429
    assert (await async_client.get("/api/v1/parties", headers=colaborador)).status_code == 200


async def test_alta_tiene_su_propia_cuota(async_client, jefe, party_payload, small_limits):
    assert (await async_client.post("/api/v1/parties", json=party_payload, headers=jefe)).status_code == 201
    second = await async_client.post(
        "/api/v1/parties", json={**party_payload, "email_work": "x@example.com"}, headers=jefe
    )
    assert second.status_code == 429 and second.json()["error"]["details"]["policy"] == "create"
    assert (await async_client.get("/api/v1/parties", headers=jefe)).status_code == 200  # lectura aparte


async def test_sin_token_no_consume_cuota(async_client, small_limits):
    for _ in range(5):
        assert (await async_client.get("/api/v1/parties")).status_code == 401


async def test_desactivable(async_client, jefe, small_limits, monkeypatch):
    monkeypatch.setattr(config, "RATE_LIMIT_ENABLED", False)
    for _ in range(5):
        r = await async_client.get("/api/v1/parties", headers=jefe)
        assert r.status_code == 200 and "X-RateLimit-Limit" not in r.headers


async def test_la_ventana_se_reinicia():
    now = [1000.0]
    lim = FixedWindowLimiter(clock=lambda: now[0])
    assert (await lim.hit("u", "read", 1, 60)).allowed
    blocked = await lim.hit("u", "read", 1, 60)
    assert not blocked.allowed and blocked.reset_at == 1020
    now[0] = 1020.0
    assert (await lim.hit("u", "read", 1, 60)).allowed
