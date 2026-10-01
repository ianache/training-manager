"""Contrato de API-SPEC-001 §3.1, §4.1 y §4.2."""
import pytest


async def _create(client, headers, payload, **overrides):
    r = await client.post("/api/v1/parties", json={**payload, **overrides}, headers=headers)
    assert r.status_code == 201, r.text
    return r.json()


@pytest.mark.asyncio
async def test_registrar_201_con_auditoria_del_usuario_final(async_client, jefe, party_payload):
    body = await _create(async_client, jefe, party_payload)
    assert body["role"] == "Employee" and body["status"] == "active"
    assert body["contact"] == {"email_work": "juan.perez@example.com", "phone_work": None}
    assert body["created_by"] == "jefe.ingenieria"  # X-User-Name, no la cuenta del BFF
    assert body["role_assignments"] == [] and body["unit_id"] is None


@pytest.mark.asyncio
async def test_correo_duplicado_409(async_client, jefe, party_payload):
    await _create(async_client, jefe, party_payload)
    r = await async_client.post(
        "/api/v1/parties", json={**party_payload, "identification_number": "99999999"}, headers=jefe
    )
    assert r.status_code == 409
    assert r.json()["error"]["code"] == "EMAIL_DUPLICATE"


@pytest.mark.asyncio
async def test_identificacion_duplicada_409(async_client, jefe, party_payload):
    await _create(async_client, jefe, party_payload)
    r = await async_client.post(
        "/api/v1/parties", json={**party_payload, "email_work": "otro@example.com"}, headers=jefe
    )
    assert r.status_code == 409
    assert r.json()["error"]["code"] == "IDENTIFICATION_DUPLICATE"


@pytest.mark.asyncio
async def test_validacion_400_formato_estandar(async_client, jefe, party_payload):
    r = await async_client.post("/api/v1/parties", json={**party_payload, "identification_type": "X"}, headers=jefe)
    assert r.status_code == 400
    err = r.json()["error"]
    assert err["code"] == "VALIDATION_ERROR"
    assert err["details"]["fields"][0]["field"] == "identification_type"
    assert err["request_id"] == "req-test-1"


@pytest.mark.asyncio
async def test_lista_paginada_envoltorio_estandar(async_client, jefe, party_payload):
    for i in range(3):
        await _create(
            async_client, jefe, party_payload, email_work=f"p{i}@example.com", identification_number=f"1000000{i}"
        )
    r = await async_client.get("/api/v1/parties", params={"page": 1, "limit": 2}, headers=jefe)
    assert r.status_code == 200
    body = r.json()
    assert len(body["data"]) == 2
    assert body["pagination"] == {
        "page": 1,
        "limit": 2,
        "total": 3,
        "total_pages": 2,
        "has_next": True,
        "has_prev": False,
    }
    page2 = (await async_client.get("/api/v1/parties", params={"page": 2, "limit": 2}, headers=jefe)).json()
    assert len(page2["data"]) == 1 and page2["pagination"]["has_prev"] is True


@pytest.mark.asyncio
async def test_lista_vacia(async_client, jefe):
    body = (await async_client.get("/api/v1/parties", headers=jefe)).json()
    assert body["data"] == [] and body["pagination"]["total"] == 0 and body["pagination"]["total_pages"] == 0


@pytest.mark.asyncio
async def test_busqueda_y_filtros_aplicados(async_client, jefe, party_payload):
    await _create(async_client, jefe, party_payload)
    await _create(
        async_client,
        jefe,
        party_payload,
        first_names="Lucía",
        last_names="Ramos",
        preferred_name=None,
        email_work="lucia@proveedor.example.com",
        identification_number="55555555",
        party_type="Contractor",
    )
    body = (
        await async_client.get("/api/v1/parties", params={"search": "lucía", "role": "Contractor"}, headers=jefe)
    ).json()
    assert [p["first_names"] for p in body["data"]] == ["Lucía"]
    assert body["filters_applied"] == {"role": "Contractor", "search": "lucía"}


@pytest.mark.asyncio
async def test_orden_no_soportado_400(async_client, jefe):
    r = await async_client.get("/api/v1/parties", params={"sort": "password:asc"}, headers=jefe)
    assert r.status_code == 400 and r.json()["error"]["details"]["field"] == "sort"


@pytest.mark.asyncio
async def test_limite_maximo_100(async_client, jefe):
    assert (await async_client.get("/api/v1/parties", params={"limit": 101}, headers=jefe)).status_code == 400


@pytest.mark.asyncio
async def test_no_encontrado_404(async_client, jefe):
    r = await async_client.get("/api/v1/parties/00000000-0000-0000-0000-000000000000", headers=jefe)
    assert r.status_code == 404 and r.json()["error"]["code"] == "RESOURCE_NOT_FOUND"


@pytest.mark.asyncio
async def test_actualizar_solo_campos_permitidos(async_client, jefe, party_payload):
    p = await _create(async_client, jefe, party_payload)
    r = await async_client.patch(
        f"/api/v1/parties/{p['id']}", json={"preferred_name": "Juancho", "phone_work": "+51 999 888 777"}, headers=jefe
    )
    assert r.status_code == 200
    body = r.json()
    assert body["preferred_name"] == "Juancho" and body["updated_by"] == "jefe.ingenieria"
    r2 = await async_client.patch(f"/api/v1/parties/{p['id']}", json={"email_work": "x@y.z"}, headers=jefe)
    assert r2.status_code == 400  # campos no permitidos (sin sobrescritura de identidad)
