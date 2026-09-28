import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_sql_injection_email_field(async_client: AsyncClient, jefe_token):
    """SQL injection attempt in email field should be rejected"""
    payload = {
        "first_names": "Juan",
        "last_names": "Pérez",
        "email_work": "test' OR '1'='1",  # SQL injection attempt
        "identification_type": "DNI",
        "identification_number": "12345678",
        "identification_country": "CO",
        "party_type": "Employee",
    }

    async_client.cookies.set("session", jefe_token)

    response = await async_client.post("/api/v1/parties", json=payload)
    assert response.status_code == 422  # Validation error


@pytest.mark.asyncio
async def test_sql_injection_identification_type(async_client: AsyncClient, jefe_token):
    """SQL injection in identification_type should be blocked by enum validation"""
    payload = {
        "first_names": "Juan",
        "last_names": "Pérez",
        "email_work": "juan@company.com",
        "identification_type": "INVALID_TYPE",  # Not in enum
        "identification_number": "12345678",
        "identification_country": "CO",
        "party_type": "Employee",
    }

    async_client.cookies.set("session", jefe_token)

    response = await async_client.post("/api/v1/parties", json=payload)
    assert response.status_code == 422  # Validation error
