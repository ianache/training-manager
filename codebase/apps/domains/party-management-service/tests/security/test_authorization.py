import pytest
from httpx import AsyncClient
from unittest.mock import patch


@pytest.mark.asyncio
async def test_authorization_403_no_jefe_role(async_client: AsyncClient, colaborador_token):
    """POST /parties without Jefe role should return 403"""
    payload = {
        "first_names": "Juan",
        "last_names": "Pérez",
        "email_work": "juan@company.com",
        "identification_type": "DNI",
        "identification_number": "12345678",
        "identification_country": "CO",
        "party_type": "Employee",
    }

    async_client.cookies.set("session", colaborador_token)

    with patch("app.core.authorization.get_user_roles") as mock_roles:
        mock_roles.return_value = ["developer"]

        response = await async_client.post("/api/v1/parties", json=payload)
        assert response.status_code == 403


@pytest.mark.asyncio
async def test_authorization_idor_access(async_client: AsyncClient, colaborador_token):
    """GET /parties/{other_id} as Colaborador should return 403 (IDOR check)"""
    async_client.cookies.set("session", colaborador_token)

    other_party_id = "00000000-0000-0000-0000-000000000000"

    with patch("app.core.authorization.get_user_roles") as mock_roles:
        mock_roles.return_value = ["developer"]

        response = await async_client.get(f"/api/v1/parties/{other_party_id}")
        assert response.status_code == 403
