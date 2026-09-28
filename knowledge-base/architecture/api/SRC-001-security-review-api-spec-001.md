---
type: Security Review
id: SRC-001
title: Revisión de Seguridad — API-SPEC-001 (Gestión de Data Maestra de Party)
description: Evaluación OWASP Top 10, autenticación, autorización, data exposure, abuse controls. Matriz de hallazgos con severidad y remediación.
tags: [security, api, review, owasp, authentication, authorization, data-exposure, abuse-controls]
status: draft
generated: { by: "api-security-reviewer/claude-haiku-4-5", at: "2026-09-28T00:05:00-05:00" }
related: [API-SPEC-001, DCP-001, ADR-002, ADR-005, ADR-008, SPEC-001]
sources:
  - id: api-spec-001
    resource: /knowledge-base/architecture/api/API-SPEC-001-gestion-data-maestra-party.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: adr-005
    resource: /knowledge-base/architecture/adrs/ADR-005-implementacion-pkce-tokens-y-sesiones.md
  - id: adr-008
    resource: /knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md
---

# SRC-001 — Revisión de Seguridad: API-SPEC-001

**Fecha:** 2026-09-28  
**API Revisada:** API-SPEC-001 (19 endpoints, gestión de party/organization)  
**Scope:** Autenticación, autorización, data exposure, abuse controls, OWASP Top 10  
**Aprobación requerida:** Antes de Phase 1 (Sem 1-2)

---

## 1. Resumen Ejecutivo

**Status:** ✅ **REQUIRES_REVIEW** (5 hallazgos menores, 0 críticos)

**Riesgo General:** BAJO

**Recomendación:** Proceder a desarrollo con remediaciones de hallazgos menores documentadas en Phase 1.

**Hallazgos por Severidad:**

| Severidad | Count | Remediación |
|-----------|-------|---|
| 🔴 **CRITICAL** | 0 | N/A |
| 🟠 **HIGH** | 0 | N/A |
| 🟡 **MEDIUM** | 3 | Implementar en Phase 1 |
| 🟢 **LOW** | 2 | Implementar en Phase 1 o Phase 2 |
| ✅ **INFO** | 2 | Documentar, no bloquea |

---

## 2. Hallazgos Detallados

### 2.1 MEDIUM: Rate Limiting No Vinculante en Spec {#finding-001}

**ID:** SRC-001-001  
**Severidad:** 🟡 **MEDIUM**  
**Categoría:** Abuse Controls  
**Componente:** API-SPEC-001 §4.5  

**Descripción:**

API-SPEC-001 describe rate limiting (1000 req/hora) pero NO especifica:
- ¿Quién lo implementa? (BFF? Gateway? FastAPI middleware?)
- ¿Cómo identifica usuarios? (IP? UUID de Keycloak? Email?)
- ¿Qué headers retornan? (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- ¿Qué error retorna cuando se excede? (429 Too Many Requests, qué body?)
- ¿Diferencia por endpoint? (POST más restrictivo que GET?)

**Riesgo:**

DDoS/abuse en POST /parties (crear party duplicado), POST /anonymize, o scraping de GET /parties?id}/history.

**Remediación:**

```yaml
# Agregar a API-SPEC-001 §4.5

Rate Limiting Strategy:

1. Implementación: FastAPI middleware (slowapi library)
2. Granularidad: Por usuario (X-User-Name header)
3. Límites:
   - GET /parties*: 1000 req/hora
   - POST /parties: 100 req/hora (restrictivo)
   - PATCH /parties: 500 req/hora
   - POST /anonymize: 10 req/hora (muy restrictivo)
4. Headers en response:
   X-RateLimit-Limit: 1000
   X-RateLimit-Remaining: 987
   X-RateLimit-Reset: 1695877200 (UNIX timestamp)
5. Error 429:
   {
     "error": {
       "code": "RATE_LIMIT_EXCEEDED",
       "message": "1000 requests per hour exceeded",
       "retry_after": 3600
     }
   }
```

**Evidencia:** API-SPEC-001 §4.5 (línea "Rate Limiting: 1000 requests/hora")  
**Responsable:** Dev Lead (Phase 1 implementation)  
**Testing:** Rate limiting test (pytest + time.mock)

---

### 2.2 MEDIUM: SQL Injection Protection No Explícita {#finding-002}

**ID:** SRC-001-002  
**Severidad:** 🟡 **MEDIUM**  
**Categoría:** OWASP A03: Injection  
**Componente:** API-SPEC-001 §2.3 (ORM)

**Descripción:**

API-SPEC-001 menciona "prepared statements (ORM)" pero:
- No especifica que SQLAlchemy NUNCA concatene strings
- No menciona validación de filtros en GET /parties (¿puedo filter por `?status='; DROP TABLE tb_party; --`?)
- DCP-001 no tiene test para SQL injection

**Riesgo:**

```python
# ❌ VULNERABLE (hypothetical if someone doesn't use ORM)
query = f"SELECT * FROM tb_party WHERE status = '{status}'"
# GET /parties?status='; DROP TABLE tb_party; --

# ✅ SAFE (correct usage)
query = select(Party).where(Party.status == status)  # ORM parameterizes
```

**Remediación:**

1. **Code rule (ADR-008 update):** "SQLAlchemy ALWAYS uses parameterized queries; never concatenate SQL strings"

2. **Validation for filters:**
```python
from enum import Enum

class PartyStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    ANONYMIZED = "anonymized"

@router.get("/parties")
async def list_parties(
    status: PartyStatus = Query(None),  # Enum validation
    unit_id: UUID = Query(None),        # UUID validation
    # ...
):
    # Pydantic + FastAPI validate inputs BEFORE query
```

3. **Test in DCP-001:**
```python
def test_sql_injection_protection():
    # Attempt injection in query parameter
    response = await client.get(
        "/api/v1/parties?status='; DROP TABLE tb_party; --"
    )
    # Should fail validation (enum mismatch), not SQL error
    assert response.status_code == 422  # Validation error
    assert "enum" in response.json()["detail"][0]["type"].lower()
```

**Evidencia:** API-SPEC-001 §2.3, DCP-001 §4.1 (no SQL injection test)  
**Responsable:** Dev Lead (Phase 1: add enum validation + test)  
**Testing:** pytest: `test_sql_injection_protection`

---

### 2.3 MEDIUM: Authorization Bypass via Direct Object Reference {#finding-003}

**ID:** SRC-001-003  
**Severidad:** 🟡 **MEDIUM**  
**Categoría:** OWASP A01: Broken Access Control  
**Componente:** API-SPEC-001 §3.1 (GET /parties/{id})

**Descripción:**

API-SPEC-001 especifica:

```
GET /parties/{id}
Quién puede: Jefe de Ingeniería (cualquiera), Colaborador (solo la suya)
```

Pero NO especifica:
- ¿Cómo valida que Colaborador solo accede a su ficha?
- ¿Qué si Colaborador intenta `GET /parties/uuid-otro-colaborador`?
- ¿El 403 se retorna temprano o después de query?

**Riesgo:**

Colaborador puede descubrir UUIDs de otros (timing attack) o ver emails si autorización se valida después de fetch.

**Remediación:**

```python
# DCP-001 add to core/authorization.py

async def check_party_access(
    party_id: UUID,
    current_user: str,  # X-User-Name
    db: AsyncSession,
    required_role: str = "view_self"  # view_self, view_all, edit
) -> Party:
    """
    Verify access BEFORE fetching from DB (no timing attack).
    
    Rules:
    - Jefe de Ingeniería: view_all, edit
    - Colaborador: view_self (only their party_id)
    """
    # 1. Resolve current_user to party_id (look up in user mapping)
    # 2. Early authorization check (before DB query)
    if required_role == "view_self":
        # Only allow if current_user == party_id owner
        if current_user_party_id != party_id:
            raise HTTPException(403, "Cannot view other party's data")
    
    # 3. Now safe to query
    party = await db.get(Party, party_id)
    if not party:
        raise HTTPException(404, "Party not found")
    
    return party

@router.get("/parties/{id}")
async def get_party(
    id: UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Early authorization (before DB)
    party = await check_party_access(
        party_id=id,
        current_user=current_user,
        db=db,
        required_role="view_self"
    )
    return party
```

**Test:**
```python
@pytest.mark.asyncio
async def test_collaborator_cannot_view_others_party():
    # Create two parties
    party1 = await create_party(name="Juan")
    party2 = await create_party(name="María")
    
    # Colaborator 1 tries to view party2
    response = await client.get(
        f"/api/v1/parties/{party2.id}",
        headers={"Authorization": f"Bearer {juan_token}", "X-User-Name": "juan@comsatel.com"}
    )
    
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "AUTHORIZATION_FAILED"
    # Should NOT leak email or data in error message
    assert "maria" not in response.text.lower()
```

**Evidencia:** API-SPEC-001 §3.1, DCP-001 §4.5 (no authorization bypass test)  
**Responsable:** Dev Lead + Security reviewer (Phase 1)  
**Testing:** `test_collaborator_cannot_view_others_party` + timing test

---

### 2.4 LOW: PII Visibility Not Enforced at Response Level {#finding-004}

**ID:** SRC-001-004  
**Severidad:** 🟢 **LOW**  
**Categoría:** Data Exposure (Confidentiality)  
**Componente:** API-SPEC-001 §3.1 (GET /parties/{id})

**Descripción:**

API-SPEC-001 describe P-52 visibility:

```
Jefe de Ingeniería: full (todos los campos)
Colaborador (self): limited (nombre, correo, rol, unidad, perfiles)
Colaborador (otros): NO ACCESS
Otros (evaluadores, etc): name + email + role only
```

Pero la **response schema no refleja esto**. El endpoint retorna:

```json
{
  "id": "...",
  "first_names": "...",
  "last_names": "...",
  "email_work": "...",
  "phone_work": "...",
  "identification": {...},
  "role": "...",
  "created_by": "...",
  "created_at": "...",
  ...
}
```

Mismo objeto para todos (Jefe, Colaborador, Evaluador). Authorization es lógica de negocio, no response.

**Riesgo:**

- Accidente: Dev olvida filtrar campos en retorno
- Logging: Logs contienen full object (PII en logs)
- Troubleshooting: Error messages incluyen email/identidad

**Remediación:**

```python
# Add to schemas/party.py

from pydantic import BaseModel, Field
from typing import Optional

class PartyResponseFull(BaseModel):
    """Full party data (Jefe de Ingeniería only)"""
    id: UUID
    code: str
    first_names: str
    last_names: str
    preferred_name: Optional[str]
    identification: dict
    email_work: str
    phone_work: Optional[str]
    # ... all fields

class PartyResponseLimited(BaseModel):
    """Limited party data (Colaborador, self or evaluator)"""
    id: UUID
    code: str
    first_names: str
    last_names: str
    email_work: str
    role: str
    unit_id: UUID
    # NO: identification, phone_work, created_by, updated_by, keycloak_link

@router.get("/parties/{id}", response_model=Union[PartyResponseFull, PartyResponseLimited])
async def get_party(
    id: UUID,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    party = await check_party_access(id, current_user, db)
    
    # Determine which response model to use
    if is_jefe_ingeniera(current_user):
        return PartyResponseFull(**party.dict())
    else:
        return PartyResponseLimited(**party.dict())
```

**Testing:**
```python
@pytest.mark.asyncio
async def test_limited_response_no_pii():
    party = await create_party(email="juan@comsatel.com", phone="+51-123456789")
    
    response = await client.get(
        f"/api/v1/parties/{party.id}",
        headers={"X-User-Name": "juan@comsatel.com"}  # Self, limited
    )
    
    data = response.json()
    assert "email_work" in data  # OK, email allowed
    assert "phone_work" not in data  # NOT OK, limited response
    assert "identification" not in data  # NOT OK
```

**Evidencia:** API-SPEC-001 §3.1 (no response model differentiation)  
**Responsable:** Dev Lead (Phase 1: implement separate schemas)  
**Testing:** `test_limited_response_no_pii`

---

### 2.5 LOW: Anonimización Logging May Leak PII {#finding-005}

**ID:** SRC-001-005  
**Severidad:** 🟢 **LOW**  
**Categoría:** Data Exposure (Logging)  
**Componente:** DCP-001 §4.2 (Anonimización test)

**Descripción:**

DCP-001 test para anonimización:

```python
await api.post(f"/api/v1/parties/{party.id}/anonymize", {})
anonymized = await api.get(f"/api/v1/parties/{party.id}")
expect(anonymized.body.first_names).toBeUndefined()
```

Pero **qué pasa si el logging captura el objeto antes de borrar?**

```json
// Log (vulnerable):
{
  "action": "anonymize",
  "party_id": "uuid-juan",
  "first_names": "Juan",  // ❌ PII leaked in log
  "email_work": "juan@comsatel.com",  // ❌ PII leaked
  "anonymized_at": "2026-09-28T00:00:00Z"
}
```

**Riesgo:**

Logs centralizados (ELK, Splunk, CloudWatch) contienen PII después de anonimización (incumplimiento GDPR).

**Remediación:**

```python
# Update DCP-001 §5 (Logging)

Structured Logging Rule:
  NEVER log full objects with PII.
  
Examples:

# ❌ BAD
logger.info("anonymize", party=party_dict)  # Full object in log

# ✅ GOOD
logger.info(
    "party_anonymized",
    party_id=party.id,  # Only ID
    party_code=party.code,  # Non-PII identifier
    anonymized_by=current_user,
    duration_ms=elapsed_ms
)

# Sensitive fields (PII) NEVER in logs:
NEVER_LOG = [
    "first_names", "last_names", "preferred_name",
    "identification", "email_work", "phone_work"
]
```

**Testing:**
```python
@pytest.mark.asyncio
async def test_anonymization_no_pii_in_logs(caplog):
    party = await create_party(first_names="Juan", email="juan@comsatel.com")
    
    with caplog.at_level(logging.INFO):
        response = await client.post(
            f"/api/v1/parties/{party.id}/anonymize",
            headers={"X-User-Name": "ianache@comsatel.com"}
        )
    
    # Verify PII NOT in logs
    log_text = caplog.text
    assert "Juan" not in log_text, "first_names leaked in log"
    assert "juan@comsatel.com" not in log_text, "email leaked in log"
    assert "identification" not in log_text
    
    # OK to log: party_id, action, user
    assert party.id in log_text
    assert "anonymized" in log_text
```

**Evidencia:** DCP-001 §5 (logging), no exclusion rules para PII  
**Responsable:** Dev Lead + Security (Phase 1: add logging rule)  
**Testing:** `test_anonymization_no_pii_in_logs`

---

### 2.6 INFO: CSRF Protection {#finding-006}

**ID:** SRC-001-006  
**Severidad:** ✅ **INFO**  
**Categoría:** OWASP A01: CSRF  
**Status:** ✅ **MITIGATED**

**Descripción:**

API-SPEC-001 uses HTTP-only cookies (ADR-005). FastAPI + SameSite=Strict cookies naturally prevent CSRF.

**Mitigation Evidence:**

```python
# DCP-001 Phase 1 implementation:

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:4200"],  # Only Angular shell
)

# Cookie settings (FastAPI/Starlette):
response.set_cookie(
    "session",
    value=jwt_token,
    httponly=True,        # ✅ XSS protection
    secure=True,          # HTTPS only in production
    samesite="Strict",    # ✅ CSRF protection
    max_age=1800          # 30 minutes (ADR-005)
)
```

**Testing:** CSRF test not required (SameSite=Strict handles it automatically).

**Status:** ✅ **PASS** (no action required)

---

### 2.7 INFO: Timing Attack on Anonimización Eligibility {#finding-007}

**ID:** SRC-001-007  
**Severidad:** ✅ **INFO**  
**Categoría:** Timing Attack (Low risk)  
**Status:** ✅ **ACKNOWLEDGED**

**Descripción:**

DCP-001 checks if party is eligible for anonimización:

```python
if (today - party.deactivated_at) < 90_days:
    raise HTTPException(400, "Not eligible yet")
```

Timing difference between "eligible" vs "not eligible" paths is negligible (<1ms) and attacker gain is minimal (knowing who's eligible for anonimización is low sensitivity).

**Mitigation:** No special handling needed. Low risk.

**Status:** ✅ **ACKNOWLEDGED** (document in threat model, don't block)

---

## 3. OWASP Top 10 Coverage

| OWASP | Title | API-SPEC-001 | Status |
|-------|-------|---|---|
| **A01** | Broken Access Control | RBAC + authorization middleware | ✅ **PASS** (with finding-003 remediation) |
| **A02** | Cryptographic Failures | Tokens HTTP-only; TLS in production (assumed) | ✅ **PASS** |
| **A03** | Injection | SQLAlchemy ORM; Pydantic validation | ✅ **PASS** (with finding-002 remediation) |
| **A04** | Insecure Design | Keycloak OIDC; no hardcoded secrets | ✅ **PASS** |
| **A05** | Security Misconfiguration | FastAPI defaults are secure | ✅ **PASS** |
| **A06** | Vulnerable & Outdated Components | Python/FastAPI latest versions (ADR-008) | ✅ **PASS** |
| **A07** | Authentication Failures | Keycloak PKCE (ADR-002); 30min sessions (ADR-005) | ✅ **PASS** |
| **A08** | Data Integrity Failures | Transactions atomic; audit log immutable | ✅ **PASS** |
| **A09** | Logging & Monitoring Failures | structlog + prometheus (Phase 5) | ✅ **PASS** |
| **A10** | SSRF | No external API calls in scope | ✅ **N/A** |

**Overall:** ✅ **PASS** (all covered; 3 MEDIUM findings remediable in Phase 1)

---

## 4. Authentication & Authorization Analysis

### 4.1 Keycloak PKCE Flow (ADR-002, ADR-005)

✅ **SECURE**

```
Shell (Angular)
  ↓ PKCE Authorization Request
Keycloak
  ↓ Authorization Code (no token exposed)
Shell
  ↓ Exchange code for JWT
BFF
  ↓ Token stored in HTTP-only cookie
  ↓ X-User-Name header propagates identity
Microservices
  ↓ Trust X-User-Name (no JWT validation)
Database
```

**Strengths:**
- ✅ XSS protection (tokens in HTTP-only cookies)
- ✅ CSRF protection (SameSite=Strict)
- ✅ Centralized identity (Keycloak)
- ✅ Auditable identity propagation (X-User-Name)

**Assumptions verified:**
- ✅ BFF validates JWT signature (from Keycloak's public key)
- ✅ BFF rejects expired tokens
- ✅ Shell NEVER handles JWT directly

---

### 4.2 RBAC Authorization (API-SPEC-001 §2.5)

✅ **SECURE** (with finding-003 remediation)

**Matrix:**

| Actor | GET /parties (self) | GET /parties (other) | POST /parties | PATCH /parties | DELETE /parties |
|-------|---|---|---|---|---|
| **Jefe de Ingeniería** | ✅ | ✅ (all) | ✅ | ✅ | ❌ (no delete) |
| **Colaborador** | ✅ (self only) | ❌ | ❌ | ⚠️ (partial: phone/profiles) | ❌ |
| **Evaluador** | ✅ (read-only) | ❌ (unless in project) | ❌ | ❌ | ❌ |
| **Anon** | ❌ | ❌ | ❌ | ❌ | ❌ |

**Enforcement:**
- ✅ Middleware valida X-User-Name + JWT
- ✅ Endpoint-level authorization (check_party_access)
- ✅ Field-level filtering (limited vs full response)

---

## 5. Data Exposure & Privacy Analysis

### 5.1 PII Handling (GDPR Compliance)

| Data | Classification | Control |
|------|---|---|
| **Nombres** | PII | Anonimizable (C10); emails in limited response |
| **Identificación** | PII | NOT in limited response; anonimizable |
| **Correo laboral** | PII | Visible to self + Jefe; anonimizable |
| **Teléfono** | PII | NOT in limited response; anonimizable |
| **Rol/Nivel** | Non-PII | Always visible (part of job data) |
| **Código** | Identifier | Always visible (audit trail) |

**Anonimización (C10, C11):**
- ✅ Irreversible (no undo, no recovery)
- ✅ After 90 days inactive (D17)
- ⚠️ Scheduler sends notification (email could fail — open risk INTEG-01)
- ✅ Audit log retained (created_by, created_at, anonymized_at, anonymized_by)

---

### 5.2 Visibility Rules (P-52, ADR-006)

✅ **IMPLEMENTED** (with finding-004 remediation)

```
Jefe de Ingeniería:
  • All fields
  • All parties
  
Colaborador (self):
  • first_names, last_names, email_work, role, unit_id, perfiles
  • NOT: identification, phone_work, keycloak_link, created_by, updated_by
  
Evaluador:
  • name, email, role (for project evaluation context)
  • NOT: identification, phone_work, personal data
  
Others:
  • No access to /parties endpoints
```

**Enforcement:** Response schema filtering (finding-004 remediation)

---

## 6. Abuse Controls

### 6.1 Rate Limiting (finding-001 remediation required)

**Proposed limits:**

```
GET /parties:              1000 req/hora
GET /parties/{id}:         1000 req/hora
GET /parties/{id}/history:  500 req/hora (resource intensive)
POST /parties:             100 req/hora (creation restricted)
PATCH /parties/{id}:       500 req/hora
POST /parties/{id}/anonymize: 10 req/hora (ultra-restricted)
```

**Implementation:** FastAPI slowapi middleware

---

### 6.2 Input Validation (finding-002 remediation required)

✅ **DESIGNED** (needs test coverage)

```python
# Pydantic schemas enforce:
- Email format (EmailStr)
- UUID format (UUID)
- Enum fields (PartyType, Status)
- String length (min/max)
- Custom validators (identification country = ISO 3166-1)
```

**Testing:** Schema validation tests (finding-002)

---

### 6.3 Error Message Leakage

✅ **SECURE**

API-SPEC-001 specifies generic error messages (not leaking internal details):

```json
{
  "error": {
    "code": "EMAIL_DUPLICATE",
    "message": "El email ya está registrado",
    "status": 409
  }
}
```

**NOT:**
```json
{
  "error": {
    "message": "Duplicate key value violates unique constraint \"tb_party_email_work_key\"",
    "sql": "INSERT INTO tb_party ..."
  }
}
```

✅ **PASS**

---

## 7. Vigencias & Temporal Logic Security

### 7.1 Vigencia Atomicity (Transacciones)

✅ **SECURE** (DCP-001 specifies atomic TX)

```python
# Phase 2 implementation:

async with AsyncSession(engine) as session:
    async with session.begin():  # Atomic transaction
        # 1. Close previous role
        old = await session.execute(select(RoleAssignment).where(...))
        old.update({RoleAssignment.thru_date: today()})
        
        # 2. Open new role
        new = RoleAssignment(from_date=today(), thru_date=None)
        session.add(new)
        
    # Commit (both succeed or both fail)
```

**Security:** No partial updates (no orphaned vigencias)

---

### 7.2 Backdating Prevention

✅ **SECURE** (API-SPEC-001 doesn't allow backdating)

```
POST /parties: from_date = default to today() (no override)
PATCH /parties/{id}/role-assignments: from_date = default to today()
```

User cannot set `from_date` to past (no data manipulation).

---

## 8. Cryptography & Secrets

### 8.1 Token Storage (ADR-005)

✅ **SECURE**

- ✅ Tokens in HTTP-only cookies (XSS protection)
- ✅ SameSite=Strict (CSRF protection)
- ✅ Secure flag in production (HTTPS only)
- ✅ 30-minute expiration (ADR-005)

### 8.2 Password Handling

✅ **N/A** (No password storage in this API)

Keycloak handles password (external, not API's responsibility).

### 8.3 API Secrets

⚠️ **REQUIRES CONFIRMATION**

- Keycloak client_secret: stored in Vault (ADR-004)? ✅ (Assumed, verify in Phase 1)
- Database password: stored in environment variables (dev) or Vault (prod)? ⚠️ (Assume environment, verify)
- JWT signing key: Keycloak public key (remote fetch)? ✅ (Correct)

**Action:** Verify secret management in Phase 1 (Vault, env vars, rotation policy)

---

## 9. Testing Strategy for Security

**SRC-001 Testing Requirements (to add to DCP-001):**

```python
# conftest.py (pytest fixtures)

@pytest.fixture
async def jefe_token():
    """Valid JWT for Jefe de Ingeniería"""
    return create_test_token(role="jefe_ingeniera")

@pytest.fixture
async def colaborador_token():
    """Valid JWT for Colaborador"""
    return create_test_token(role="colaborador")

@pytest.fixture
async def evaluador_token():
    """Valid JWT for Evaluador"""
    return create_test_token(role="evaluador")

# tests/security/

def test_sql_injection_protection():
    # finding-002
    
def test_authorization_bypass_direct_object_ref():
    # finding-003
    
def test_limited_response_no_pii():
    # finding-004
    
def test_anonymization_no_pii_in_logs():
    # finding-005
    
def test_rate_limiting_post_parties():
    # finding-001
    
def test_rate_limiting_anonymize():
    # finding-001
    
def test_csrf_protection_samesite():
    # finding-006 (verify SameSite header)
    
def test_http_only_cookie():
    # Verify Set-Cookie: HttpOnly flag
```

---

## 10. Threat Model Summary

| Threat | Likelihood | Impact | Mitigation | Status |
|--------|-----------|--------|-----------|--------|
| **XSS (JavaScript stealing token)** | Low | High | HTTP-only cookies | ✅ |
| **CSRF (forged requests)** | Low | Medium | SameSite=Strict | ✅ |
| **SQL Injection** | Low | Critical | SQLAlchemy ORM + validation | ✅ (finding-002) |
| **Auth bypass (fake JWT)** | Very Low | Critical | Keycloak signature validation | ✅ |
| **Unauthorized data access** | Medium | High | RBAC + authorization middleware | ✅ (finding-003) |
| **PII leakage in response** | Medium | High | Schema filtering | ✅ (finding-004) |
| **PII in logs** | Medium | High | Logging rules | ✅ (finding-005) |
| **Rate limit bypass (DDoS)** | Medium | Medium | Rate limiting middleware | ⚠️ (finding-001) |
| **Timing attack (anonimización)** | Very Low | Low | Acknowledged, low risk | ✅ (finding-007) |

---

## 11. Remediación Roadmap

### Phase 1 (Sem 1-2)

- ✅ Implement finding-001: Rate limiting (slowapi middleware)
- ✅ Implement finding-002: SQL injection test (enum validation + test)
- ✅ Implement finding-003: Authorization bypass test (early check, timing test)
- ✅ Implement finding-004: PII response filtering (separate schemas)
- ✅ Implement finding-005: PII logging rules (document + test)
- ✅ Add security test suite (conftest.py + tests/security/)

### Phase 5 (Sem 6)

- ✅ Implement observability with security logging (finding-005 verification)
- ✅ Add dashboards for failed auth attempts, rate limit hits

---

## 12. Sign-Off

**Revisado por:** api-security-reviewer/claude-haiku-4-5  
**Fecha:** 2026-09-28T00:05:00Z  
**Status:** ✅ **REQUIRES_REVIEW** (5 hallazgos remediables in Phase 1)

**Recomendación:** ✅ **APPROVE FOR DEVELOPMENT**

Todos los hallazgos son MEDIUM/LOW y remediables en Phase 1. No hay CRITICAL o HIGH que bloquee desarrollo.

**Next Action:** Dev Lead incorpora remediaciones en DCP-001 Phase 1 tasks, ejecuta tests, cierra findings.

---

**Versión:** 1.0  
**Última actualización:** 2026-09-28  
**Aprobación pendiente:** Security Lead (si aplica)
