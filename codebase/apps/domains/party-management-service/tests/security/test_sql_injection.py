"""Entradas maliciosas: se rechazan por validación o se tratan como datos (consultas parametrizadas)."""
import pytest


async def _create(client, jefe, payload):
    r = await client.post("/api/v1/parties", json=payload, headers=jefe)
    assert r.status_code == 201, r.text
    return r.json()


@pytest.mark.asyncio
async def test_inyeccion_sql_en_email_rechazada(async_client, jefe, party_payload):
    party_payload["email_work"] = "test' OR '1'='1"
    r = await async_client.post("/api/v1/parties", json=party_payload, headers=jefe)
    assert r.status_code == 400
    assert r.json()["error"]["code"] == "VALIDATION_ERROR"


@pytest.mark.asyncio
async def test_busqueda_con_comodines_sql_es_segura(async_client, jefe, party_payload):
    await _create(async_client, jefe, party_payload)
    r = await async_client.get("/api/v1/parties", params={"search": "' OR 1=1 --"}, headers=jefe)
    assert r.status_code == 200 and r.json()["data"] == []
