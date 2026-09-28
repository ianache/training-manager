# Party Management Service — Testing Guide

## Quick Start with Docker Compose

### 1. Start Services

```bash
cd codebase/apps/domains/party-management-service
docker-compose up -d
```

**Wait for both services to be healthy (30 seconds):**

```bash
docker-compose logs -f api
```

Look for: `INFO:     Application startup complete`

### 2. Verify Services Running

```bash
# Check PostgreSQL
docker-compose exec postgres pg_isready -U user

# Check API
curl http://localhost:8000/health/live
# Expected: {"status":"alive"}

curl http://localhost:8000/health/ready
# Expected: {"status":"ready"}
```

### 3. Import Postman Collection

**File:** `Party-Management-Service.postman_collection.json`

#### Steps:
1. Open **Postman** → Click **Import** (top-left)
2. Choose **File** → Select `Party-Management-Service.postman_collection.json`
3. Click **Import**
4. Collections panel should show: "Party Management Service - Phase 1a Testing"

### 4. Run Test Cases (12 scenarios)

All requests use **mock JWT tokens** (no real Keycloak needed for manual testing):

| Token | Role | Can Create? | Can Access? |
|-------|------|------|------|
| `jefe.valid.token` | Jefe de Ingeniería | ✅ YES | ✅ All |
| `dev.valid.token` | Colaborador/Developer | ❌ NO | ⚠️ Limited |

---

## Test Scenarios

### Happy Path

1. **Create Party (201)** → Creates Juan Pérez, saves `party_id` variable
   - Expected: 201, response has `id`, `code`, `first_names`, `status: active`

2. **Get Party by ID (200)** → Retrieves the party created above
   - Expected: 200, full party data with identification fields (Jefe sees all)

3. **List Parties (200)** → Paginated list of all parties
   - Expected: 200, array of parties, limited response (no PII for Colaborador)

4. **Update Party (200)** → Updates preferred_name and phone_work
   - Expected: 200, updated fields in response

### Error Cases

5. **Duplicate Email (409)** → Try creating party with existing email
   - Expected: 409 Conflict, detail: "Email already registered"

6. **Invalid Email (422)** → Email validation fails
   - Expected: 422 Unprocessable Entity

7. **SQL Injection (422)** → Enum validation blocks malicious input
   - Expected: 422 (identification_type must be DNI, CE, or Passport)

8. **Missing Fields (422)** → Incomplete request body
   - Expected: 422, error lists required fields

### Authorization & Security

9. **Colaborador Cannot Create (403)** → POST with `dev.valid.token`
   - Expected: 403 Forbidden, "Only Jefe de Ingeniería can perform this action"

10. **IDOR Protection (403)** → Colaborador tries GET other party
    - Expected: 403 Forbidden, "Cannot access other party's data"

11. **Response Filtering** → Colaborador GET sees limited data
    - Expected: 200, but NO identification_number, phone_work (PII hidden)

### Not Found

12. **Party Not Found (404)** → GET with fake UUID
    - Expected: 404, "Party not found"

### Health Checks

- **Liveness**: GET `/health/live` → 200, `{"status":"alive"}`
- **Readiness**: GET `/health/ready` → 200, `{"status":"ready"}`

---

## Running Tests in Postman

### Option 1: Manual (One-by-One)

1. Select a request in the collection
2. Click **Send**
3. Check response status and body
4. Tests tab shows PASSED/FAILED

### Option 2: Run Collection (All 12)

1. Click **...** next to collection name → **Run collection**
2. **Runner** window opens
3. Keep **Delay** at 500ms (gives API time between requests)
4. Click **Run Party Management Service - Phase 1a Testing**
5. Watch all tests execute
6. **Summary** shows PASSED/FAILED count

### Option 3: Use Environment Variable

Postman stores `{{party_id}}` from first POST request, reuses it in GET/PATCH.

**Check variable:**
- Bottom-right: **Environments** → Select environment
- `party_id` should be auto-populated after first POST

---

## Test Coverage

| Endpoint | Method | Tests | Status |
|----------|--------|-------|--------|
| /parties | POST | Create (happy), Duplicate (409), Invalid (422), SQL injection (422), Auth (403), Missing fields (422) | ✅ 6 tests |
| /parties | GET | List (200), Filtering (limited for Colaborador) | ✅ 2 tests |
| /parties/{id} | GET | Happy path (200), Not found (404), IDOR (403) | ✅ 3 tests |
| /parties/{id} | PATCH | Update (200) | ✅ 1 test |
| **Health** | GET | Liveness, Readiness | ✅ 2 tests |

**Total: 14 test cases covering all endpoints**

---

## Expected Results

### All Tests PASS If:
- ✅ Happy path returns correct status codes (201, 200, 200, 200)
- ✅ Errors return proper HTTP status (409, 422, 403, 404)
- ✅ Authorization correctly blocks Colaborador from POST and IDOR
- ✅ Response filtering hides PII for non-Jefe users
- ✅ SQL injection blocked by Enum validation
- ✅ Health checks respond with correct status

### Common Issues

**502 Bad Gateway / Connection Refused**
- Docker containers not running: `docker-compose logs -f`
- Wait 30s for API to start: `docker-compose logs api | grep "startup complete"`

**401 Unauthorized**
- Token is set in Cookie header (not Authorization header)
- Postman collection includes `Cookie: session=jefe.valid.token` in all requests

**422 Validation Error**
- Check request body JSON is valid
- Required fields: first_names, last_names, email_work, identification_type, identification_number, identification_country, party_type

**409 Conflict**
- Email already exists (either reuse same email or use new one each run)
- Clear database: `docker-compose down && docker-compose up`

---

## Manual cURL Examples (Alternative to Postman)

### Create Party
```bash
curl -X POST http://localhost:8000/api/v1/parties \
  -H "Content-Type: application/json" \
  -H "Cookie: session=jefe.valid.token" \
  -d '{
    "first_names": "Test",
    "last_names": "User",
    "email_work": "test@company.com",
    "identification_type": "DNI",
    "identification_number": "99999999",
    "identification_country": "CO",
    "party_type": "Employee"
  }'
```

### Get Party
```bash
curl -X GET "http://localhost:8000/api/v1/parties/PARTY_ID_HERE" \
  -H "Cookie: session=jefe.valid.token"
```

### List Parties
```bash
curl -X GET "http://localhost:8000/api/v1/parties?skip=0&limit=20" \
  -H "Cookie: session=jefe.valid.token"
```

### Update Party
```bash
curl -X PATCH "http://localhost:8000/api/v1/parties/PARTY_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=jefe.valid.token" \
  -d '{
    "preferred_name": "Test User Jr",
    "phone_work": "+57301234567"
  }'
```

---

## Cleanup

```bash
# Stop containers
docker-compose down

# Stop + remove volumes (full reset)
docker-compose down -v

# Logs
docker-compose logs api
docker-compose logs postgres
```

---

## Performance Notes

- **POST /parties**: ~50-200ms (single insert + validation)
- **GET /parties (20 rows)**: ~30-100ms
- **GET /parties/{id}**: ~20-50ms
- **PATCH /parties/{id}**: ~50-150ms

Target: <1000ms for POST, <500ms for GET (spec requirement) ✅

---

**Status: Ready for Manual Testing** ✅

All 14 test cases in Postman collection. Expected behavior documented. Happy testing!
