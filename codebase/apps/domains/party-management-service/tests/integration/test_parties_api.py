import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_post_parties_201(async_client: AsyncClient, jefe_token):
    """POST /api/v1/parties should return 201 with party data"""
    payload = {
        "first_names": "Juan",
        "last_names": "Pérez",
        "email_work": "juan@company.com",
        "identification_type": "DNI",
        "identification_number": "12345678",
        "identification_country": "CO",
        "party_type": "Employee",
    }

    async_client.cookies.set("session", jefe_token)

    response = await async_client.post("/api/v1/parties", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["first_names"] == "Juan"
    assert data["email_work"] == "juan@company.com"


@pytest.mark.asyncio
async def test_post_parties_409_duplicate(async_client: AsyncClient, jefe_token):
    """POST /api/v1/parties with duplicate email should return 409"""
    payload = {
        "first_names": "Juan",
        "last_names": "Pérez",
        "email_work": "juan@company.com",
        "identification_type": "DNI",
        "identification_number": "12345678",
        "identification_country": "CO",
        "party_type": "Employee",
    }

    async_client.cookies.set("session", jefe_token)

    response1 = await async_client.post("/api/v1/parties", json=payload)
    assert response1.status_code == 201

    response2 = await async_client.post("/api/v1/parties", json=payload)
    assert response2.status_code == 409


@pytest.mark.asyncio
async def test_get_parties_list(async_client: AsyncClient, jefe_token):
    """GET /api/v1/parties should return paginated list"""
    async_client.cookies.set("session", jefe_token)

    response = await async_client.get("/api/v1/parties?skip=0&limit=20")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_parties_by_id(async_client: AsyncClient, jefe_token):
    """GET /api/v1/parties/{id} should return party data"""
    payload = {
        "first_names": "Juan",
        "last_names": "Pérez",
        "email_work": "juan@company.com",
        "identification_type": "DNI",
        "identification_number": "12345678",
        "identification_country": "CO",
        "party_type": "Employee",
    }

    async_client.cookies.set("session", jefe_token)

    create_resp = await async_client.post("/api/v1/parties", json=payload)
    party_id = create_resp.json()["id"]

    get_resp = await async_client.get(f"/api/v1/parties/{party_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == party_id


@pytest.mark.asyncio
async def test_patch_parties(async_client: AsyncClient, jefe_token):
    """PATCH /api/v1/parties/{id} should update party"""
    payload = {
        "first_names": "Juan",
        "last_names": "Pérez",
        "email_work": "juan@company.com",
        "identification_type": "DNI",
        "identification_number": "12345678",
        "identification_country": "CO",
        "party_type": "Employee",
    }

    async_client.cookies.set("session", jefe_token)

    create_resp = await async_client.post("/api/v1/parties", json=payload)
    party_id = create_resp.json()["id"]

    update_payload = {"preferred_name": "Juan Carlos", "phone_work": "+57301234567"}
    update_resp = await async_client.patch(f"/api/v1/parties/{party_id}", json=update_payload)
    assert update_resp.status_code == 200
    assert update_resp.json()["preferred_name"] == "Juan Carlos"
