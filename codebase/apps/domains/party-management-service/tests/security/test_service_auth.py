"""ADR-005 §2: solo el BFF (token de servicio válido) puede llamar; identidad por X-User-Name."""
import pytest


async def _status(client, headers):
    return (await client.get("/api/v1/parties", headers=headers)).status_code


@pytest.mark.asyncio
async def test_sin_token_401_con_formato_estandar(async_client):
    r = await async_client.get("/api/v1/parties", headers={"X-User-Name": "x", "X-Request-ID": "req-9"})
    assert r.status_code == 401
    body = r.json()["error"]
    assert body["code"] == "AUTHENTICATION_FAILED"
    assert body["request_id"] == "req-9"
    assert r.headers["X-Request-ID"] == "req-9"


@pytest.mark.asyncio
async def test_la_cookie_de_usuario_ya_no_autentica(async_client):
    async_client.cookies.set("session", "cualquier-cosa")
    assert await _status(async_client, {"X-User-Name": "ana"}) == 401


@pytest.mark.asyncio
async def test_firma_invalida_401(async_client, make_token, other_key):
    h = {"Authorization": f"Bearer {make_token(key=other_key)}", "X-User-Name": "ana"}
    assert await _status(async_client, h) == 401


@pytest.mark.asyncio
async def test_cliente_no_autorizado_401(async_client, make_token):
    h = {"Authorization": f"Bearer {make_token(azp='otro-cliente')}", "X-User-Name": "ana"}
    assert await _status(async_client, h) == 401


@pytest.mark.asyncio
async def test_emisor_distinto_401(async_client, make_token):
    h = {"Authorization": f"Bearer {make_token(iss='http://evil/realms/x')}", "X-User-Name": "ana"}
    assert await _status(async_client, h) == 401


@pytest.mark.asyncio
async def test_token_vencido_401(async_client, make_token):
    h = {"Authorization": f"Bearer {make_token(exp_in=-120)}", "X-User-Name": "ana"}
    assert await _status(async_client, h) == 401


@pytest.mark.asyncio
async def test_falta_x_user_name_401(async_client, make_token):
    assert await _status(async_client, {"Authorization": f"Bearer {make_token()}"}) == 401


@pytest.mark.asyncio
async def test_x_user_name_invalido_401(async_client, make_token):
    h = {"Authorization": f"Bearer {make_token()}", "X-User-Name": "ana; DROP TABLE"}
    assert await _status(async_client, h) == 401


@pytest.mark.asyncio
async def test_token_valido_200(async_client, colaborador):
    assert await _status(async_client, colaborador) == 200


@pytest.mark.asyncio
async def test_health_sin_autenticacion(async_client):
    assert (await async_client.get("/health/live")).status_code == 200
