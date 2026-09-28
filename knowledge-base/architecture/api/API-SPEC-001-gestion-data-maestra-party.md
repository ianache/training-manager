---
type: Technical Design
id: API-SPEC-001
title: API REST — Gestión de Data Maestra de Party (Colaboradores)
description: Especificación técnica de endpoints REST para cubrir US-015 a US-025 (11 capacidades de party/organization management). BFF Node.js + Keycloak + PostgreSQL.
tags: [architecture, api, rest, party, collaborators, bff, nodejs, keycloak, specification]
status: draft
generated: { by: "api-designer/claude-haiku-4-5", at: "2026-09-27T23:58:00-05:00" }
related: [SPEC-001, ADR-002, ADR-005, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025, STD-DB-001]
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: rcp-003
    resource: /requirements/context-packs/RCP-003-gestion-data-maestra-party.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: adr-005
    resource: /knowledge-base/architecture/adrs/ADR-005-implementacion-pkce-tokens-y-sesiones.md
  - id: us-015-025
    resource: /requirements/user-stories/US-015-025-gestion-data-maestra-party-consolidated.md
---

# API-SPEC-001 — REST API para Gestión de Data Maestra de Party

**Fecha:** 2026-09-27  
**Producto:** Plataforma de Gestión de Formación del RH  
**Versión API:** v1 (primera iteración)  
**Base Path:** `http://localhost:4000/api/v1` (desarrollo) | `https://api.prod.comsatel.com/api/v1` (producción)

---

## 1. Scope y Objetivos

**Scope:** Diseñar endpoints REST que cubran las 11 capacidades de party/organization management (US-015 a US-025).

**Actores:**
- **Jefe de Ingeniería** — Puede CRUD todo (parties, organizations, role assignments, program roles)
- **Colaborador** — Puede READ su propia ficha y historial; actualizar teléfono/perfiles (parcial)
- **Sistema** — Puede actualizar vigencias al vencer plazo de anonimización (C11)

**Objetivos de calidad:**
- ✅ 100% mapeo US-015–025 → endpoints
- ✅ Autenticación vía Keycloak (ADR-002)
- ✅ Auditoría en cada operación (creado_por, fecha_creacion, etc.)
- ✅ Vigencias temporales (no sobrescritura, cerrar/abrir)
- ✅ Anonimización irreversible (D14)
- ✅ WCAG 2.2 AA (headers, errores descriptivos)
- ✅ Testeable con curl/Postman + integration tests

---

## 2. Decisiones de Diseño

### 2.1 Estilo Arquitectónico

| Decisión | Rationale | Fuente |
|----------|-----------|--------|
| **REST (no GraphQL, RPC)** | Simplicidad; estándar de industria; fácil de cachear | ARQ decision: JSON + HTTP verbs |
| **Resource-oriented** | Cada tabla/concepto = resource (parties, organizations, role-assignments) | REST conventions |
| **Stateless** | BFF es stateless; sesión en Keycloak/cookies HTTP-only | ADR-005 |
| **Versionado en path** | `/api/v1/` permite breaking changes en v2 sin cliente choque | API compatibility |
| **Paginación obligatoria** | 100+ parties = no listar sin limit | Observabilidad |

### 2.2 Autenticación y Autorización

| Decisión | Rationale | Fuente |
|----------|-----------|--------|
| **Keycloak PKCE** | Single sign-on corporativo; federated con AD en QA/PROD | ADR-002 |
| **Tokens HTTP-only cookies** | XSS protection; nunca llegan al navegador | ADR-005 |
| **X-User-Name header** | Auditoría: BFF propaga identidad del usuario final a microservicios | ADR-005 |
| **Role-based access control (RBAC)** | Jefe de Ingeniería tiene permisos explícitos; colaborador tiene read-self | SPEC-001 D11 |
| **No API keys en desarrollo** | Dev usa localhost; production usa Keycloak realm + client secret | ADR-004 |

### 2.3 Versionado y Evolución

| Decisión | Rationale |
|----------|-----------|
| **Additive only (v1)** | Nunca remover fields; renaming = deprecation + new field |
| **API version in path** | `/api/v1/` → `/api/v2/` si breaking changes (ej: remover field) |
| **Deprecation headers** | `Deprecation: true` + `Sunset: 2027-01-01` 90 días antes de remover |
| **Backwards compatibility 2 versions** | v1 + v2 live simultaneously para 6 meses |

### 2.4 Manejo de Vigencias (sin sobrescritura)

**Patrón:** Toda entidad con vigencia (`from_date`, `thru_date`) sigue este flujo:

```
POST /parties/{id}/role-assignments  (crear vigencia nueva)
  1. Busca rol-assignment vigente (thru_date = NULL)
  2. Si existe: SET thru_date = today() (cierra anterior)
  3. Inserta nuevo registro con from_date = today(), thru_date = NULL
  4. Retorna ambos (anterior cerrado + nuevo abierto)
```

**Nunca UPDATE:** Los roles no se actualizan in-place; se crean nuevas vigencias.

### 2.5 Auditoría

Cada tabla tiene campos:

```sql
created_by VARCHAR(255) NOT NULL   -- Email de Keycloak (X-User-Name)
created_at TIMESTAMP NOT NULL      -- NOW()
updated_by VARCHAR(255)            -- NULL si nunca actualizado
updated_at TIMESTAMP               -- NULL si nunca actualizado
```

**No borrar registros:** Las vigencias cerradas quedan para historial/auditoría.

---

## 3. Recursos y Endpoints

### 3.1 PARTY (Personas — US-015, US-016, US-021, US-022, US-023)

```
POST   /parties                      US-015: Registrar colaborador
GET    /parties/{id}                 US-023: Consultar ficha
GET    /parties                      US-023: Listar con filtro + paginación
PATCH  /parties/{id}                 US-016: Actualizar datos
PATCH  /parties/{id}/status          US-021: Dar de baja (cerrar vigencia)
PATCH  /parties/{id}/keycloak-link   US-022: Vincular Keycloak UUID
GET    /parties/{id}/history         US-023: Ver historial de cambios
GET    /parties/{id}/anonymization   Consultar plazo anonimización (C11)
POST   /parties/{id}/anonymize       US-024: Anonimizar datos
```

**POST /parties** (Registrar)

```json
Request {
  "first_names": "Juan",
  "last_names": "Pérez López",
  "preferred_name": "Juan Pérez",
  "identification": {
    "type": "DNI",        // DNI | CE | Passport
    "number": "12345678",
    "country": "PE"       // ISO 3166-1
  },
  "contact": {
    "email_work": "juan.perez@comsatel.com",
    "phone_work": "+51-987654321"
  },
  "role": "Employee",     // Employee | Contractor
  "unit_id": "uuid-ing-backend",
  "direct_manager_id": "uuid-maria-garcia",
  "provider_id": "uuid-techcorp" // solo si Contractor
}

Response {
  "id": "uuid-juan-perez",
  "code": "EMP-2026-0042",  // GUID generado
  "first_names": "Juan",
  "last_names": "Pérez López",
  "identification": { ... },
  "contact": { ... },
  "role": "Employee",
  "unit_id": "uuid-ing-backend",
  "direct_manager_id": "uuid-maria-garcia",
  "status": "active",
  "created_by": "ianache@comsatel.com",
  "created_at": "2026-09-27T23:58:00Z",
  "keycloak_link": null,
  "_links": {
    "self": { "href": "/parties/uuid-juan-perez" },
    "role_assignments": { "href": "/parties/uuid-juan-perez/role-assignments" },
    "history": { "href": "/parties/uuid-juan-perez/history" }
  }
}

Status Codes:
  201 Created
  400 Bad Request (email duplicado, identificación duplicada, unidad no existe)
  401 Unauthorized (Keycloak token inválido)
  403 Forbidden (solo Jefe de Ingeniería)
  409 Conflict (email/identificación duplicada)
```

**GET /parties/{id}**

```json
Response {
  "id": "uuid-juan-perez",
  "code": "EMP-2026-0042",
  "first_names": "Juan",
  "last_names": "Pérez López",
  "preferred_name": "Juan Pérez",
  "identification": { ... },
  "contact": { ... },
  "role": "Employee",
  "unit_id": "uuid-ing-backend",
  "direct_manager_id": "uuid-maria-garcia",
  "status": "active",
  "created_by": "ianache@comsatel.com",
  "created_at": "2026-09-27T23:58:00Z",
  "updated_by": null,
  "updated_at": null,
  "keycloak_link": { "uuid": "keycloak-uuid-12345", "linked_at": "2026-09-27T23:59:00Z" },
  "role_assignments": [
    {
      "id": "uuid-dev-l1-assignment",
      "role": "Developer",
      "level": "Level 1",
      "from_date": "2026-09-27",
      "thru_date": null,
      "status": "active"
    }
  ],
  "program_roles": [
    { "role": "Evaluator", "from_date": "2026-09-27", "thru_date": null }
  ],
  "visibility": {
    "jefe_ingeniera": "full",    // Todas los campos
    "self": "limited",            // P-52: solo nombre, correo, rol, unidad, perfiles
    "other_collaborators": "name_email_role"
  }
}

Status Codes:
  200 OK
  401 Unauthorized
  403 Forbidden (Colaborador viendo ficha ajena)
  404 Not Found
```

**PATCH /parties/{id}** (Actualizar)

```json
Request {
  "first_names": "Juan Carlos",
  "phone_work": "+51-987654322"
  // Otros campos: puede cambiar cualquiera (Jefe) o solo teléfono/perfiles (Colaborador)
}

Response {
  // Retorna objeto completo actualizado
  // Nota: No sobrescribe roles; vigencias se cierran/abren via role-assignments endpoint
}

Status Codes:
  200 OK (actualización exitosa)
  400 Bad Request
  401 Unauthorized
  403 Forbidden
  404 Not Found
  409 Conflict (email/identificación duplicada tras actualización)
```

**PATCH /parties/{id}/status** (Dar de baja — US-021)

```json
Request {
  "action": "deactivate",  // cierra vigencia
  "effective_date": "2026-09-27"  // fecha de baja
}

Response {
  "id": "uuid-juan-perez",
  "status": "inactive",
  "deactivated_at": "2026-09-27T23:58:00Z",
  "deactivated_by": "ianache@comsatel.com",
  "anonymization_eligible_at": "2026-12-27",  // fecha_baja + 90 días (D17)
  "_links": {
    "anonymize": { "href": "/parties/uuid-juan-perez/anonymize" }
  }
}

Status Codes:
  200 OK
  400 Bad Request
  403 Forbidden
```

**POST /parties/{id}/anonymize** (Anonimizar — US-024)

```json
Request {}

Response {
  "id": "uuid-juan-perez",
  "status": "anonymized",
  "anonymized_at": "2026-09-27T23:58:00Z",
  "anonymized_by": "system:automation",
  "fields_anonymized": [
    "first_names", "last_names", "preferred_name",
    "identification", "contact"
  ],
  "retained_fields": [
    "code", "id", "role", "unit_id",
    "created_by", "created_at",
    "role_assignments" (vigencias)
  ],
  "note": "Anonimización irreversible. Los datos personales han sido eliminados. El código y referencias para auditoría se conservan."
}

Status Codes:
  200 OK
  400 Bad Request (no eligible yet, intentó antes de plazo)
  403 Forbidden
  404 Not Found
```

**GET /parties/{id}/history** (Historial)

```json
Response {
  "id": "uuid-juan-perez",
  "events": [
    {
      "timestamp": "2026-09-27T23:58:00Z",
      "action": "created",
      "by": "ianache@comsatel.com",
      "changes": { "first_names": "Juan", "email_work": "juan.perez@comsatel.com" }
    },
    {
      "timestamp": "2026-09-27T23:59:00Z",
      "action": "updated",
      "by": "juan.perez@comsatel.com",
      "changes": { "phone_work": "+51-987654321" }
    },
    {
      "timestamp": "2026-09-28T10:00:00Z",
      "action": "role_assigned",
      "by": "ianache@comsatel.com",
      "changes": { "role": "Developer Level 1", "from_date": "2026-09-28" }
    }
  ]
}

Status Codes:
  200 OK
  403 Forbidden (Colaborador viendo historial ajeno)
  404 Not Found
```

---

### 3.2 ORGANIZATION (Unidades, Proveedores — US-017, US-018)

```
POST   /organizations                US-017, US-018: Crear unidad/proveedor
GET    /organizations/{id}           US-017, US-018: Consultar
GET    /organizations                Listar con filtro
PATCH  /organizations/{id}           US-017, US-018: Actualizar
PATCH  /organizations/{id}/hierarchy US-017: Cambiar padre
GET    /organizations/tree            Árbol organizacional
```

**POST /organizations** (Crear unidad o proveedor)

```json
Request {
  "name": "Ingeniería Backend",
  "type": "internal_unit",  // internal_unit | external_provider
  "country": "PE",          // ISO 3166-1
  "contact": {
    "email": "ing-backend@comsatel.com",
    "phone": "+51-987654321"
  },
  "parent_id": "uuid-ingenieria",  // Null si es raíz
  "metadata": {
    "ruc": "20123456789",  // si provider
    "tax_regime": "RUC"
  }
}

Response {
  "id": "uuid-ing-backend",
  "name": "Ingeniería Backend",
  "type": "internal_unit",
  "parent_id": "uuid-ingenieria",
  "created_by": "ianache@comsatel.com",
  "created_at": "2026-09-27T23:58:00Z",
  "_links": {
    "self": { "href": "/organizations/uuid-ing-backend" },
    "members": { "href": "/parties?unit_id=uuid-ing-backend" },
    "children": { "href": "/organizations?parent_id=uuid-ing-backend" }
  }
}

Status Codes:
  201 Created
  400 Bad Request
  403 Forbidden (solo Jefe de Ingeniería)
  409 Conflict (nombre duplicado en mismo padre)
```

---

### 3.3 ROLE-ASSIGNMENT (Asignar Rol-Nivel — US-019)

```
POST   /parties/{id}/role-assignments       Asignar nuevo rol/nivel
GET    /parties/{id}/role-assignments       Listar vigentes + historial
PATCH  /parties/{id}/role-assignments/{rid} Cambiar nivel (crea vigencia nueva)
```

**POST /parties/{id}/role-assignments** (Asignar Rol-Nivel)

```json
Request {
  "role": "Developer",        // Del catálogo
  "level": "Level 1",         // Del catálogo
  "from_date": "2026-09-27",
  "reason": "Registration Level Assignment"
}

Response {
  "id": "uuid-dev-l1-assignment",
  "party_id": "uuid-juan-perez",
  "role": "Developer",
  "level": "Level 1",
  "from_date": "2026-09-27",
  "thru_date": null,
  "previous_assignment": {
    "id": null,  // null si es primer assignment
    "role": null,
    "level": null,
    "thru_date": "2026-09-27"  // cerrado con fecha anterior
  },
  "created_by": "ianache@comsatel.com",
  "created_at": "2026-09-27T23:58:00Z"
}

Status Codes:
  201 Created
  400 Bad Request (nivel/rol no existe en catálogo)
  403 Forbidden
  404 Not Found (party no existe)
```

---

### 3.4 PROGRAM-ROLE (Evaluador, Jefe de Ingeniería — US-020)

```
POST   /parties/{id}/program-roles           Asignar programa role
GET    /parties/{id}/program-roles           Listar programa roles
DELETE /parties/{id}/program-roles/{role}    Remover programa role
```

**POST /parties/{id}/program-roles**

```json
Request {
  "role": "Evaluator",  // Evaluator | Engineering Manager | Instructor
  "from_date": "2026-09-27"
}

Response {
  "id": "uuid-eval-assignment",
  "party_id": "uuid-maria-garcia",
  "role": "Evaluator",
  "from_date": "2026-09-27",
  "thru_date": null,
  "previous_assignment": {
    "id": null,
    "thru_date": null  // Si hubo anterior, se cierra aquí
  },
  "created_by": "ianache@comsatel.com",
  "created_at": "2026-09-27T23:58:00Z"
}

Status Codes:
  201 Created
  400 Bad Request
  403 Forbidden
```

---

### 3.5 KEYCLOAK-LINK (Vincular Identidad — US-022)

```
PATCH  /parties/{id}/keycloak-link          Vincular/actualizar UUID
DELETE /parties/{id}/keycloak-link          Remover vínculo
GET    /parties/{id}/keycloak-link          Consultar vínculo
```

**PATCH /parties/{id}/keycloak-link**

```json
Request {
  "keycloak_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}

Response {
  "party_id": "uuid-juan-perez",
  "keycloak_uuid": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "linked_at": "2026-09-27T23:58:00Z",
  "linked_by": "ianache@comsatel.com",
  "previous_link": {
    "keycloak_uuid": null,
    "unlinked_at": null
  }
}

Status Codes:
  200 OK
  400 Bad Request (UUID inválido)
  403 Forbidden
  404 Not Found
```

---

## 4. Cross-Cutting Concerns

### 4.1 Paginación (Obligatoria)

```
GET /parties?page=1&limit=20&sort=created_at:desc

Response {
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 457,
    "total_pages": 23,
    "has_next": true,
    "has_prev": false
  },
  "filters_applied": {
    "status": "active",
    "unit_id": "uuid-ing-backend"
  }
}
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sort` (default: `created_at:desc`)
- `status` (active | inactive | anonymized)
- `unit_id` (filtrar por unidad)
- `role` (filtrar por rol)
- `search` (búsqueda de texto: nombres, email, código)

### 4.2 Errores Estandarizados

```json
{
  "error": {
    "code": "EMAIL_DUPLICATE",
    "message": "El email juan.perez@comsatel.com ya está registrado",
    "status": 409,
    "timestamp": "2026-09-27T23:58:00Z",
    "request_id": "req-12345abc",
    "details": {
      "field": "contact.email_work",
      "conflicting_party": {
        "id": "uuid-otro-juan",
        "name": "Juan Pérez García"
      }
    }
  }
}
```

**Códigos de error comunes:**
- `AUTHENTICATION_FAILED` (401)
- `AUTHORIZATION_FAILED` (403)
- `RESOURCE_NOT_FOUND` (404)
- `EMAIL_DUPLICATE` (409)
- `IDENTIFICATION_DUPLICATE` (409)
- `VALIDATION_ERROR` (400)
- `INTERNAL_SERVER_ERROR` (500)

### 4.3 Autenticación en Headers

```
Authorization: Bearer <JWT-from-cookie>  // HTTP-only, no visible a JS
X-User-Name: juan.perez@comsatel.com     // Auditoría
X-Request-ID: req-12345abc               // Trazabilidad
```

**BFF obtiene JWT con:**
```
POST /realms/gestion-formacion/protocol/openid-connect/token
  client_id: bff-app
  client_secret: <secret>
  grant_type: client_credentials
```

Luego propaga a microservicios con `X-User-Name: {usuario final}` (no retransmite JWT).

### 4.4 Observabilidad

**Métricas expuestas en `/metrics`:**
- `api_requests_total{method, endpoint, status}`
- `api_request_duration_seconds{endpoint}`
- `db_query_duration_seconds{table, operation}`
- `keycloak_auth_failures_total`
- `party_anonymizations_total`

**Logs estructurados:**
```json
{
  "timestamp": "2026-09-27T23:58:00Z",
  "level": "INFO",
  "service": "bff-node",
  "action": "party_created",
  "party_id": "uuid-juan-perez",
  "created_by": "ianache@comsatel.com",
  "duration_ms": 145,
  "status": "success"
}
```

### 4.5 Rate Limiting

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1695877200

429 Too Many Requests
```

Por IP/usuario: 1000 requests/hora (development), 10000/hora (production).

---

## 5. Seguridad y Privacidad

### 5.1 Autenticación

| Escenario | Mecánica | Responsable |
|-----------|----------|-------------|
| **Browser login** | Shell (Angular) → BFF → Keycloak PKCE → browser cookie | Keycloak |
| **API call** | Shell → BFF (cookie valida) → BFF extrae identidad → microservicio | BFF (valida cookie) |
| **Microservicio** | Recibe X-User-Name header, no token (no valida JWT) | BFF (confía en BFF) |

### 5.2 Autorización

```sql
-- tabla: party_access_control
party_id UUID NOT NULL,
user_id  VARCHAR(255) NOT NULL,
permission VARCHAR(50) NOT NULL,  -- read_self | read_all | write | manage_roles
from_date DATE NOT NULL,
thru_date DATE,  -- NULL = vigente
created_at TIMESTAMP NOT NULL,

PRIMARY KEY (party_id, user_id, permission, from_date)
```

**Reglas:**
- Jefe de Ingeniería: `write` + `manage_roles` sobre todos
- Colaborador: `read_self` (su ficha) + `write` (teléfono/perfiles)
- Evaluador: `read_all` (para evaluar) + `manage_program_roles`

### 5.3 Privacidad (WCAG 2.2 AA, GDPR)

| Dato | Clasificación | Acción |
|------|---|---|
| **Nombres** | PII | Anonimizable (C10, C11) |
| **Identificación** | PII | Anonimizable |
| **Correo laboral** | PII | Anonimizable |
| **Teléfono** | PII | Anonimizable |
| **Rol/Nivel** | No-PII | Se retiene (historial certificaciones) |
| **Código** | Identifier | Se retiene (auditoría) |
| **Auditoría** | Metadata | Se retiene siempre |

**Anonimización es irreversible:** Una vez ejecutada, no se puede recuperar.

---

## 6. Testing

### 6.1 Contract Tests

```typescript
describe("POST /parties — Registrar colaborador", () => {
  it("debe crear party con código GUID único", async () => {
    const res1 = await api.post("/parties", { first_names: "Juan", ... });
    const res2 = await api.post("/parties", { first_names: "Juan", ... });
    expect(res1.body.code).not.toBe(res2.body.code);
  });

  it("debe retornar 409 si email duplicado", async () => {
    await api.post("/parties", { email_work: "juan@comsatel.com", ... });
    const res = await api.post("/parties", { email_work: "juan@comsatel.com", ... });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("EMAIL_DUPLICATE");
  });

  it("debe retornar 403 si no es Jefe de Ingeniería", async () => {
    const res = await api.post("/parties", {...}, { 
      headers: { "X-User-Name": "collaborator@comsatel.com" } 
    });
    expect(res.status).toBe(403);
  });
});

describe("PATCH /parties/{id} — Sin sobrescritura", () => {
  it("debe cerrar rol vigente al asignar nuevo rol", async () => {
    const party = await api.post("/parties", {...});
    const assign1 = await api.post(`/parties/${party.id}/role-assignments`, {
      role: "Developer", level: "Level 1"
    });
    const assign2 = await api.post(`/parties/${party.id}/role-assignments`, {
      role: "Developer", level: "Level 2"
    });
    
    const history = await api.get(`/parties/${party.id}/role-assignments`);
    expect(history.body[0].thru_date).toBe(assign2.body.from_date);  // anterior cerrado
    expect(history.body[1].thru_date).toBeNull();  // nuevo vigente
  });
});

describe("POST /parties/{id}/anonymize", () => {
  it("debe marcar como anonymized y borrar PII", async () => {
    const party = await api.post("/parties", { first_names: "Juan", ... });
    await api.patch(`/parties/${party.id}/status`, { action: "deactivate" });
    await delay(90 * 24 * 60 * 60 * 1000);  // esperar 90 días
    
    const res = await api.post(`/parties/${party.id}/anonymize`, {});
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("anonymized");
    
    const anonymized = await api.get(`/parties/${party.id}`);
    expect(anonymized.body.first_names).toBeUndefined();  // PII removida
    expect(anonymized.body.code).toBeDefined();  // audit data retained
  });
});
```

### 6.2 Performance Tests

- Listar 1000 parties con paginación: < 500ms
- Crear party con 5 role-assignments: < 1000ms
- Consultar historial (100 eventos): < 200ms

### 6.3 Security Tests

- ✅ XSS: Token never in localStorage
- ✅ CSRF: SameSite=Strict on cookies
- ✅ SQL Injection: Prepared statements (ORM)
- ✅ Authorization: 403 para operaciones no permitidas
- ✅ Rate limiting: 429 después de límite

---

## 7. Cambios de Base de Datos

**DDL compatible con STD-DB-001:**

```sql
CREATE TABLE tb_party (
  pk_party_id UUID PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  first_names VARCHAR(100) NOT NULL,
  last_names VARCHAR(100) NOT NULL,
  preferred_name VARCHAR(100),
  identification_type VARCHAR(20),
  identification_number VARCHAR(30),
  identification_country VARCHAR(2),
  email_work VARCHAR(255) UNIQUE NOT NULL,
  phone_work VARCHAR(20),
  party_type VARCHAR(20) NOT NULL,  -- Employee | Contractor
  status VARCHAR(20) NOT NULL,  -- active | inactive | anonymized
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR(255),
  updated_at TIMESTAMP,
  CONSTRAINT fk_tb_party_tb_organization FOREIGN KEY (unit_id) REFERENCES tb_organization(pk_organization_id)
);

CREATE INDEX idx_tb_party_email_work ON tb_party(email_work) WHERE status != 'anonymized';
CREATE INDEX idx_tb_party_status ON tb_party(status);
CREATE INDEX idx_tb_party_created_at ON tb_party(created_at DESC);

-- Vigencias
CREATE TABLE tb_party_role_assignment (
  pk_role_assignment_id UUID PRIMARY KEY,
  fk_tb_party_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL,
  from_date DATE NOT NULL,
  thru_date DATE,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_tb_party_role_party FOREIGN KEY (fk_tb_party_id) REFERENCES tb_party(pk_party_id)
);

CREATE INDEX idx_tb_party_role_assignment_party_thru_date 
  ON tb_party_role_assignment(fk_tb_party_id, thru_date) 
  WHERE thru_date IS NULL;  -- Vigentes only
```

---

## 8. Roadmap y Próximos Pasos

| Fase | Fecha | Entregable |
|------|-------|-----------|
| **Phase 1: Core** | Sem 1-2 | POST/GET /parties, /organizations |
| **Phase 2: Roles** | Sem 3 | POST /role-assignments, /program-roles |
| **Phase 3: Keycloak** | Sem 4 | PATCH /keycloak-link, integration tests |
| **Phase 4: Anonymization** | Sem 5 | POST /anonymize, scheduler para C11 |
| **Phase 5: Observability** | Sem 6 | Metrics, logs, dashboards |

---

## 9. Verificación de Calidad

| Gate | Verificación | Responsable |
|------|---|---|
| **Spec Completeness** | Todos US-015–025 mapeados a endpoints | API Designer |
| **Security Review** | OWASP Top 10, autenticación, autorización | Security team |
| **API Contract Review** | Compatibilidad, errores, examples | Code Reviewer |
| **Database Compatibility** | DDL con STD-DB-001, índices, constraints | DB team |
| **Integration Tests** | 100% cobertura de happy path + error paths | QA |

---

**Status:** REQUIRES_REVIEW (validar con Security + DB team antes de READY_FOR_DEV)

**Handoff:** Enviar a api-contract-reviewer (validar semántica + ejemplos) → api-security-reviewer (validar OWASP) → DEV (implementar en Node.js/Express)
