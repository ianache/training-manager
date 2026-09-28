---
type: Development Context Pack
id: DCP-001
title: Handoff de Desarrollo — API-SPEC-001 (Gestión de Data Maestra de Party)
description: Guía de implementación para desarrolladores. Qué construir, cómo testear, qué no asumir, criterios de éxito.
tags: [development, api, handoff, dcp, party, nodejs, express, postgresql, testing]
status: draft
generated: { by: "api-designer/claude-haiku-4-5", at: "2026-09-27T23:59:00-05:00" }
related: [API-SPEC-001, SPEC-001, US-015, US-016, US-017, US-018, US-019, US-020, US-021, US-022, US-023, US-024, US-025, ADR-002, ADR-005]
sources:
  - id: api-spec-001
    resource: /knowledge-base/architecture/api/API-SPEC-001-gestion-data-maestra-party.md
    title: API-SPEC-001 — Especificación técnica completa
  - id: us-015-025
    resource: /requirements/user-stories/US-015-025-gestion-data-maestra-party-consolidated.md
    title: US-015 a US-025 — Historias de usuario
---

# DCP-001 — Handoff de Desarrollo: API-SPEC-001

**Fecha:** 2026-09-27  
**Para:** Equipo de Desarrollo (Backend Node.js + Frontend Angular)  
**Responsable:** ianache (Jefe de Ingeniería) + api-designer  
**Entrega esperada:** Semana 6 (30 días: fases Phase 1 a Phase 5)

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen)
2. [Qué Construir](#qué-construir)
3. [Qué NO Asumir](#qué-no-asumir)
4. [Cómo Testear](#cómo-testear)
5. [Dependencias y Bloqueadores](#dependencias)
6. [Criterios de Éxito](#criterios)
7. [FAQ](#faq)

---

## 1. Resumen Ejecutivo {#resumen}

Implementar una **REST API en Node.js/Express** que cubra 11 capacidades de gestión de colaboradores (party/organization master data). 

**Scope:** 5 grupos de recursos, 19 endpoints, autenticación Keycloak, auditoría, vigencias (sin sobrescritura), anonimización irreversible.

**Duración:** 6 semanas (30 días)
- **Phase 1 (Sem 1-2):** Core PARTY + ORGANIZATION endpoints
- **Phase 2 (Sem 3):** ROLE-ASSIGNMENT + PROGRAM-ROLE
- **Phase 3 (Sem 4):** KEYCLOAK-LINK + integration tests
- **Phase 4 (Sem 5):** Anonymization + scheduler
- **Phase 5 (Sem 6):** Observability (metrics, logs, dashboards)

**Métricas de Éxito:**
- ✅ 100% cobertura de US-015–025
- ✅ Autenticación Keycloak funcionando
- ✅ Vigencias sin sobrescritura validadas
- ✅ Contract tests passing (happy + error paths)
- ✅ Performance tests passing (<500ms, <1000ms, <200ms)
- ✅ Security tests: OWASP Top 10 + authorization checks
- ✅ Observability: métricas, logs, dashboards

---

## 2. Qué Construir {#qué-construir}

### 2.1 Matriz de Endpoints por Fase

#### Phase 1 (Sem 1-2): Core PARTY + ORGANIZATION

**PARTY — Personas**

| Endpoint | Método | Descripción | US | Status |
|----------|--------|---|---|---|
| `/parties` | POST | Registrar colaborador | US-015 | 🟢 |
| `/parties` | GET | Listar (paginado, filtrado) | US-023 | 🟢 |
| `/parties/{id}` | GET | Consultar ficha de colaborador | US-023 | 🟢 |
| `/parties/{id}` | PATCH | Actualizar datos (nombres, teléfono, perfiles) | US-016 | 🟢 |

**ORGANIZATION — Unidades y Proveedores**

| Endpoint | Método | Descripción | US | Status |
|----------|--------|---|---|---|
| `/organizations` | POST | Crear unidad/proveedor | US-017, US-018 | 🟢 |
| `/organizations` | GET | Listar (paginado) | US-017, US-018 | 🟢 |
| `/organizations/{id}` | GET | Consultar unidad/proveedor | US-017, US-018 | 🟢 |
| `/organizations/{id}` | PATCH | Actualizar datos | US-017, US-018 | 🟢 |

**Implementación (Python/FastAPI — ADR-008):**
- Framework: FastAPI (async, OpenAPI automático)
- Database: PostgreSQL (STD-DB-001: tb_party, tb_organization, etc.)
- ORM: SQLAlchemy 2.0+ (type hints, async, prepared statements)
- Validación: Pydantic v2 (runtime type checking, JSON schema)
- Auth middleware: Valida JWT desde cookie + X-User-Name header (ADR-005)

**Archivos a crear:**

```
app/
  main.py                  # Entrada FastAPI
  config.py                # Configuración (DB, auth, logging)
  core/
    auth.py                # Middleware: valida JWT + extrae X-User-Name
    authorization.py       # Verifica permisos (Jefe vs Colaborador)
    dependencies.py        # Inyección de dependencias
    exceptions.py          # Excepciones personalizadas
  models/
    party.py               # SQLAlchemy model: tb_party
    organization.py        # SQLAlchemy model: tb_organization
    role_assignment.py     # SQLAlchemy model: tb_party_role_assignment
  schemas/
    party.py               # Pydantic schemas (request/response)
    organization.py
    role_assignment.py
  services/
    party_service.py       # Lógica de negocio
    organization_service.py
    role_assignment_service.py
  routers/
    parties.py             # Endpoints: /api/v1/parties
    organizations.py       # Endpoints: /api/v1/organizations
    role_assignments.py    # Endpoints: /api/v1/parties/{id}/role-assignments
  database/
    engine.py              # SQLAlchemy engine + session factory
    migrations/            # Alembic migrations
  tests/
    conftest.py            # Pytest fixtures
    unit/
      test_party_service.py
      test_organization_service.py
    integration/
      test_parties_api.py
      test_organizations_api.py
      test_role_assignments_api.py
    e2e/
      test_party_workflow.py
requirements.txt           # Dependencias Python
```

---

#### Phase 2 (Sem 3): ROLE-ASSIGNMENT + PROGRAM-ROLE

**ROLE-ASSIGNMENT — Asignar Rol-Nivel**

| Endpoint | Método | Descripción | US | Status |
|----------|--------|---|---|---|
| `/parties/{id}/role-assignments` | POST | Asignar Rol-Nivel (crea vigencia nueva) | US-019 | 🟡 |
| `/parties/{id}/role-assignments` | GET | Listar vigentes + historial | US-019 | 🟡 |
| `/parties/{id}/role-assignments/{rid}` | PATCH | Cambiar nivel (crea vigencia nueva) | US-019 | 🟡 |

**PROGRAM-ROLE — Roles de Programa**

| Endpoint | Método | Descripción | US | Status |
|----------|--------|---|---|---|
| `/parties/{id}/program-roles` | POST | Asignar Evaluador/Jefe/Instructor | US-020 | 🟡 |
| `/parties/{id}/program-roles` | GET | Listar vigentes | US-020 | 🟡 |
| `/parties/{id}/program-roles/{role}` | DELETE | Remover programa role | US-020 | 🟡 |

**Implementación:**
- Patrón de vigencias: Cuando asigna nuevo rol, busca vigente + cierra + abre nuevo
- Transacciones: Garantizar atomicidad (cierre + apertura = una sola transacción)
- Validación: Rol/nivel debe existir en catálogo (lookup table tb_role_catalog)

**Archivos a crear:**

```
src/
  models/
    RoleAssignment.ts
    ProgramRole.ts
  services/
    roleAssignmentService.ts
      • closeActiveAssignment(partyId, role)
      • createAssignment(partyId, role, level)
      • listAssignments(partyId, includeHistory=false)
    programRoleService.ts
  tests/
    roleAssignment.test.ts
    programRole.test.ts
```

**Testing específico:**
```typescript
it("debe cerrar rol vigente al asignar nuevo nivel", () => {
  // 1. Asignar L1
  // 2. Asignar L2
  // 3. Verificar L1.thru_date = L2.from_date
  // 4. Verificar L2.thru_date = NULL (vigente)
});
```

---

#### Phase 3 (Sem 4): KEYCLOAK-LINK + Integration Tests

**KEYCLOAK-LINK — Identidad de Acceso**

| Endpoint | Método | Descripción | US | Status |
|----------|--------|---|---|---|
| `/parties/{id}/keycloak-link` | PATCH | Vincular/actualizar UUID de Keycloak | US-022 | 🟠 |
| `/parties/{id}/keycloak-link` | DELETE | Remover vínculo | US-022 | 🟠 |
| `/parties/{id}/keycloak-link` | GET | Consultar vínculo | US-022 | 🟠 |

**Integración con Keycloak:**
- No valida UUID con Keycloak (Keycloak es externa)
- Solo almacena UUID en tabla tb_party_keycloak_link
- BFF es responsable de sincronizar con Keycloak

**Archivos a crear:**

```
src/
  models/
    KeycloakLink.ts
  services/
    keycloakLinkService.ts
  tests/
    keycloakLink.test.ts
    integration/
      party.integration.test.ts
        • Crear party → asignar rol → vincular Keycloak → consultar
        • Verificar flujo end-to-end
```

---

#### Phase 4 (Sem 5): Anonymization + Scheduler

**ANONYMIZATION — Anonimización Irreversible**

| Endpoint | Método | Descripción | US | Status |
|----------|--------|---|---|---|
| `/parties/{id}/status` | PATCH | Dar de baja (cerrar vigencia) | US-021 | 🔵 |
| `/parties/{id}/anonymization` | GET | Consultar plazo de anonimización | C11 | 🔵 |
| `/parties/{id}/anonymize` | POST | Anonimizar datos (irreversible) | US-024 | 🔵 |

**Lógica de anonimización:**
```
1. GET /parties/{id} → obtener party
2. Validar que thru_date != NULL (debe estar inactivo)
3. Validar que (today - thru_date) >= 90 días
4. Si válido:
   - SET anonymized_at = today()
   - SET anonymized_by = X-User-Name
   - NULL out: first_names, last_names, preferred_name, 
              identification, email_work, phone_work
   - Retener: code, id, role, unit_id, role_assignments, auditoría
5. Retornar 200 OK con resumen de lo que se borró
```

**Scheduler (cron job):**
```typescript
// Cada día a las 3 AM UTC
scheduleJob("0 3 * * *", async () => {
  // 1. Buscar parties donde (today - thru_date) = 90 días
  // 2. Enviar notificación a Jefe de Ingeniería:
  //    "X colaboradores pueden ser anonimizados. Revisar en /admin/anonymizations"
  // 3. Registrar en tabla tb_anonymization_queue para auditoría
});
```

**Archivos a crear:**

```
src/
  models/
    AnonymizationLog.ts
  services/
    anonymizationService.ts
      • canAnonymize(partyId)
      • anonymizeParty(partyId)
      • getAnonymizationQueue()
  jobs/
    anonymizationScheduler.ts
  tests/
    anonymization.test.ts
```

---

#### Phase 5 (Sem 6): Observability

**Métricas (Prometheus format):**

```
# HELP api_requests_total Total HTTP requests
# TYPE api_requests_total counter
api_requests_total{method="POST",endpoint="/parties",status="201"} 42

# HELP api_request_duration_seconds Request duration in seconds
# TYPE api_request_duration_seconds histogram
api_request_duration_seconds_bucket{endpoint="/parties",le="0.1"} 38
api_request_duration_seconds_bucket{endpoint="/parties",le="0.5"} 41
api_request_duration_seconds_bucket{endpoint="/parties",le="1.0"} 42

# HELP db_query_duration_seconds Database query duration
# TYPE db_query_duration_seconds histogram
db_query_duration_seconds_bucket{table="tb_party",operation="INSERT",le="0.05"} 40

# HELP party_anonymizations_total Total anonymizations
# TYPE party_anonymizations_total counter
party_anonymizations_total 5

# HELP keycloak_auth_failures_total Failed authentication attempts
# TYPE keycloak_auth_failures_total counter
keycloak_auth_failures_total 2
```

**Logs estructurados (JSON):**

```json
{
  "timestamp": "2026-09-27T23:58:00Z",
  "level": "INFO",
  "service": "bff-node",
  "action": "party_created",
  "party_id": "uuid-juan-perez",
  "party_code": "EMP-2026-0042",
  "created_by": "ianache@comsatel.com",
  "duration_ms": 145,
  "status": "success",
  "request_id": "req-12345abc"
}
```

**Dashboards (Grafana):**
- Request rate, latency, errors (404, 403, 500, 409, etc.)
- Database query performance by table
- Keycloak authentication failures
- Party anonymizations over time

**Archivos a crear:**

```
src/
  middleware/
    metrics.ts          // Prometheus metrics
    logging.ts          // JSON structured logging
  monitoring/
    prometheus.config.yml
    grafana/
      dashboards.json   // Grafana dashboard definitions
  tests/
    observability.test.ts
```

---

### 2.2 Stack Técnico

| Layer | Technology | Versión | Rationale |
|-------|---|---|---|
| **Runtime** | Python | 3.11+ | Moderno, type hints, comunidad activa |
| **Framework** | FastAPI | 0.100+ | Async, OpenAPI automático, performance |
| **Database** | PostgreSQL | 15+ | STD-DB-001, transacciones ACID |
| **ORM** | SQLAlchemy | 2.0+ | Type hints, async support, prepared statements |
| **Validation** | Pydantic | 2.0+ | Runtime type checking, JSON schema |
| **Auth** | python-keycloak | Latest | Keycloak integration via OIDC |
| **Logging** | structlog + python-json-logger | Latest | Structured JSON logs |
| **Metrics** | prometheus-client | Latest | Prometheus format |
| **Testing** | pytest + httpx | Latest | Unit + integration + async tests |
| **Code Quality** | ruff + black | Latest | Linting + formatting (ADR-008) |
| **CI/CD** | GitHub Actions | N/A | Linting, tests, docker build |

---

### 2.3 Estructura de Base de Datos

**Tablas principales (STD-DB-001):**

```sql
-- Parties (personas)
CREATE TABLE tb_party (
  pk_party_id UUID PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  first_names VARCHAR(100) NOT NULL,
  last_names VARCHAR(100) NOT NULL,
  preferred_name VARCHAR(100),
  identification_type VARCHAR(20),
  identification_number VARCHAR(30),
  identification_country VARCHAR(2),
  email_work VARCHAR(255) UNIQUE,
  phone_work VARCHAR(20),
  party_type VARCHAR(20) NOT NULL,  -- Employee | Contractor
  status VARCHAR(20) NOT NULL DEFAULT 'active',  -- active | inactive | anonymized
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR(255),
  updated_at TIMESTAMP,
  anonymized_at TIMESTAMP,
  anonymized_by VARCHAR(255)
);

-- Organizations (unidades, proveedores)
CREATE TABLE tb_organization (
  pk_organization_id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,  -- internal_unit | external_provider
  parent_id UUID REFERENCES tb_organization(pk_organization_id),
  country VARCHAR(2),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by VARCHAR(255),
  updated_at TIMESTAMP
);

-- Role assignments (Rol-Nivel)
CREATE TABLE tb_party_role_assignment (
  pk_role_assignment_id UUID PRIMARY KEY,
  fk_tb_party_id UUID NOT NULL REFERENCES tb_party(pk_party_id),
  role VARCHAR(50) NOT NULL,
  level VARCHAR(50) NOT NULL,
  from_date DATE NOT NULL,
  thru_date DATE,  -- NULL = vigente
  reason VARCHAR(255),
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Program roles (Evaluador, Jefe, Instructor)
CREATE TABLE tb_party_program_role (
  pk_program_role_id UUID PRIMARY KEY,
  fk_tb_party_id UUID NOT NULL REFERENCES tb_party(pk_party_id),
  role VARCHAR(50) NOT NULL,  -- Evaluator | Engineering Manager | Instructor
  from_date DATE NOT NULL,
  thru_date DATE,  -- NULL = vigente
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Keycloak links
CREATE TABLE tb_party_keycloak_link (
  pk_link_id UUID PRIMARY KEY,
  fk_tb_party_id UUID NOT NULL UNIQUE REFERENCES tb_party(pk_party_id),
  keycloak_uuid VARCHAR(255) UNIQUE NOT NULL,
  linked_at TIMESTAMP NOT NULL DEFAULT NOW(),
  linked_by VARCHAR(255) NOT NULL,
  unlinked_at TIMESTAMP,
  unlinked_by VARCHAR(255)
);

-- Anonymization logs
CREATE TABLE tb_anonymization_log (
  pk_log_id UUID PRIMARY KEY,
  fk_tb_party_id UUID NOT NULL REFERENCES tb_party(pk_party_id),
  anonymized_at TIMESTAMP NOT NULL DEFAULT NOW(),
  anonymized_by VARCHAR(255) NOT NULL,
  fields_anonymized TEXT,  -- JSON array
  retained_fields TEXT      -- JSON array
);

-- Indices (STD-DB-001)
CREATE INDEX idx_tb_party_email_work ON tb_party(email_work) WHERE status != 'anonymized';
CREATE INDEX idx_tb_party_status ON tb_party(status);
CREATE INDEX idx_tb_party_created_at ON tb_party(created_at DESC);
CREATE INDEX idx_tb_party_role_assignment_party_thru_date 
  ON tb_party_role_assignment(fk_tb_party_id, thru_date) WHERE thru_date IS NULL;
CREATE INDEX idx_tb_party_program_role_party_thru_date
  ON tb_party_program_role(fk_tb_party_id, thru_date) WHERE thru_date IS NULL;
CREATE INDEX idx_tb_organization_parent_id ON tb_organization(parent_id);
```

---

## 3. Qué NO Asumir {#qué-no-asumir}

**❌ NO asumir:**

| Asunción | Realidad | Acción |
|----------|----------|--------|
| **Catálogo de roles existe** | No está en el scope de esta API | Usar seed data en fixtures; crear tabla tb_role_catalog + seed |
| **Keycloak tiene usuarios** | No; se sincroniza después | Solo almacenar UUID; no validar contra Keycloak |
| **Correo laboral es único globalmente** | Sí, pero vigentes only | Index en email_work WHERE status != 'anonymized' |
| **Jefe directo siempre existe** | No; contratistas no tienen | Validar que existe si party_type = 'Employee' |
| **Proveedor siempre existe** | No; crear si no existe (o error 400) | Validar/crear en POST /parties si Contractor |
| **Identificación es única** | Sí, pero puede cambiar (nueva cédula) | Permitir actualizar; pero si ya existe con otro party → 409 |
| **Vigencias son limpias** | No; data histórica puede ser inconsistente | Migración de datos limpia (runbook) antes de Go Live |
| **BFF está corriendo** | Sí, pero puede caer | Implementar retry logic + circuit breaker |
| **PostgreSQL tiene data inicial** | No; usar flyway/migrate para DDL + seeds | Archivos de migración en db/migrations/ |

---

## 4. Cómo Testear {#cómo-testear}

### 4.1 Contract Tests (Unit + Integration)

**Setup:**
```bash
npm install --save-dev jest supertest @testing-library/express
npm install --save-dev ts-jest @types/jest
```

**Test file structure:**
```
tests/
  unit/
    services/
      partyService.test.ts
      roleAssignmentService.test.ts
  integration/
    parties.integration.test.ts
    organizations.integration.test.ts
    roleAssignments.integration.test.ts
    anonymization.integration.test.ts
  e2e/
    party.e2e.test.ts  (flujo completo: crear → asignar → anonimizar)
```

**Example: Party creation with validation**

```typescript
describe("POST /parties — Registrar colaborador", () => {
  
  beforeAll(async () => {
    await db.migrate();
    await db.seed("organizations");  // Crear unidades para FK
  });

  afterEach(async () => {
    await db.truncate(["tb_party", "tb_party_role_assignment"]);
  });

  it("201: debe crear party y asignar nivel inicial", async () => {
    const res = await request(app)
      .post("/api/v1/parties")
      .set("Authorization", `Bearer ${keycloakToken}`)
      .set("X-User-Name", "ianache@comsatel.com")
      .send({
        first_names: "Juan",
        last_names: "Pérez López",
        identification: { type: "DNI", number: "12345678", country: "PE" },
        contact: { email_work: "juan.perez@comsatel.com" },
        role: "Employee",
        unit_id: "uuid-ing-backend",
        direct_manager_id: "uuid-maria-garcia"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("code");
    expect(res.body.code).toMatch(/^EMP-\d{4}-\d{4}$/);  // GUID pattern
    expect(res.body.created_by).toBe("ianache@comsatel.com");
    expect(res.body.role_assignments).toHaveLength(1);
    expect(res.body.role_assignments[0].level).toBe("Level 1");  // Default
  });

  it("409: debe retornar error si email duplicado", async () => {
    // Crear primer party
    await request(app)
      .post("/api/v1/parties")
      .set("Authorization", `Bearer ${keycloakToken}`)
      .send({
        first_names: "Juan",
        contact: { email_work: "juan@comsatel.com" },
        // ...
      });

    // Intentar crear segundo con mismo email
    const res = await request(app)
      .post("/api/v1/parties")
      .set("Authorization", `Bearer ${keycloakToken}`)
      .send({
        first_names: "Otro Juan",
        contact: { email_work: "juan@comsatel.com" },
        // ...
      });

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("EMAIL_DUPLICATE");
  });

  it("403: debe retornar error si no es Jefe de Ingeniería", async () => {
    const res = await request(app)
      .post("/api/v1/parties")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .set("X-User-Name", "collaborator@comsatel.com")
      .send({ /* ... */ });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("AUTHORIZATION_FAILED");
  });
});
```

### 4.2 Vigencias (Sin Sobrescritura)

```typescript
describe("Role Assignment — Vigencias (no sobrescritura)", () => {
  
  it("debe cerrar rol vigente al asignar nuevo nivel", async () => {
    // 1. Crear party con nivel inicial
    const party = await partyService.create({...});
    const assign1 = party.role_assignments[0];
    expect(assign1.thru_date).toBeNull();  // vigente

    // 2. Asignar nuevo nivel
    const res = await request(app)
      .post(`/api/v1/parties/${party.id}/role-assignments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        role: "Developer",
        level: "Level 2",
        from_date: "2026-09-28"
      });

    expect(res.status).toBe(201);
    expect(res.body.thru_date).toBeNull();  // nuevo es vigente

    // 3. Verificar que anterior se cerró
    const history = await request(app)
      .get(`/api/v1/parties/${party.id}/role-assignments`)
      .set("Authorization", `Bearer ${token}`);

    const vigentes = history.body.filter(a => !a.thru_date);
    expect(vigentes).toHaveLength(1);
    expect(vigentes[0].level).toBe("Level 2");

    const cerrado = history.body.find(a => a.level === "Level 1");
    expect(cerrado.thru_date).toBe("2026-09-28");
  });
});
```

### 4.3 Anonimización (Irreversible)

```typescript
describe("Anonymization — Irreversible", () => {
  
  it("debe anonimizar after 90 días de baja", async () => {
    // 1. Crear party
    const party = await partyService.create({
      first_names: "Juan",
      contact: { email_work: "juan@comsatel.com" },
      // ...
    });

    // 2. Dar de baja
    const res1 = await request(app)
      .patch(`/api/v1/parties/${party.id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ action: "deactivate", effective_date: "2026-09-27" });

    expect(res1.body.status).toBe("inactive");
    expect(res1.body.anonymization_eligible_at).toBe("2026-12-27");  // +90 días

    // 3. Intentar anonimizar antes de plazo → 400
    const res2 = await request(app)
      .post(`/api/v1/parties/${party.id}/anonymize`)
      .set("Authorization", `Bearer ${token}`);

    expect(res2.status).toBe(400);
    expect(res2.body.error.code).toBe("ANONYMIZATION_NOT_ELIGIBLE");

    // 4. Mock fecha a +91 días
    jest.setSystemTime(new Date("2026-12-28"));

    // 5. Anonimizar
    const res3 = await request(app)
      .post(`/api/v1/parties/${party.id}/anonymize`)
      .set("Authorization", `Bearer ${token}`);

    expect(res3.status).toBe(200);
    expect(res3.body.status).toBe("anonymized");
    expect(res3.body.fields_anonymized).toContain("first_names");

    // 6. Verificar que PII se borraron
    const anonymized = await request(app)
      .get(`/api/v1/parties/${party.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(anonymized.body.first_names).toBeUndefined();
    expect(anonymized.body.email_work).toBeUndefined();
    expect(anonymized.body.code).toBeDefined();  // audit data retained
  });
});
```

### 4.4 Performance Tests

```typescript
describe("Performance — <500ms, <1000ms, <200ms", () => {
  
  it("GET /parties (1000 rows) < 500ms", async () => {
    // Seed 1000 parties
    await db.seed("parties", 1000);

    const start = performance.now();
    const res = await request(app)
      .get("/api/v1/parties?limit=20&page=1")
      .set("Authorization", `Bearer ${token}`);
    const elapsed = performance.now() - start;

    expect(res.status).toBe(200);
    expect(elapsed).toBeLessThan(500);
  });

  it("POST /parties + 5 role-assignments < 1000ms", async () => {
    const start = performance.now();
    
    const res = await request(app)
      .post("/api/v1/parties")
      .set("Authorization", `Bearer ${token}`)
      .send({ /* ... */ });

    for (let i = 1; i <= 5; i++) {
      await request(app)
        .post(`/api/v1/parties/${res.body.id}/role-assignments`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          role: "Developer",
          level: `Level ${i}`,
          from_date: `2026-09-2${i}`
        });
    }

    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(1000);
  });

  it("GET /parties/{id}/history (100 events) < 200ms", async () => {
    const party = await partyService.create({...});
    
    // Generar 100 eventos en historial
    for (let i = 0; i < 100; i++) {
      await partyService.update(party.id, { phone_work: `+51-9876543${i}` });
    }

    const start = performance.now();
    const res = await request(app)
      .get(`/api/v1/parties/${party.id}/history`)
      .set("Authorization", `Bearer ${token}`);
    const elapsed = performance.now() - start;

    expect(res.status).toBe(200);
    expect(res.body.events).toHaveLength(100);
    expect(elapsed).toBeLessThan(200);
  });
});
```

### 4.5 Security Tests

```typescript
describe("Security — OWASP + Authorization", () => {
  
  it("401: debe retornar error si no hay Authorization header", async () => {
    const res = await request(app)
      .get("/api/v1/parties");
    
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("AUTHENTICATION_FAILED");
  });

  it("403: debe retornar error si token expirado", async () => {
    const expiredToken = jwt.sign({ sub: "user" }, "secret", { expiresIn: "-1h" });
    
    const res = await request(app)
      .get("/api/v1/parties")
      .set("Authorization", `Bearer ${expiredToken}`);

    expect(res.status).toBe(401);
  });

  it("403: Colaborador no puede POST /parties", async () => {
    const res = await request(app)
      .post("/api/v1/parties")
      .set("Authorization", `Bearer ${collaboratorToken}`)
      .set("X-User-Name", "collaborator@comsatel.com")
      .send({...});

    expect(res.status).toBe(403);
  });

  it("403: Colaborador puede leer solo su ficha", async () => {
    // Crear dos parties
    const party1 = await partyService.create({ first_names: "Juan" });
    const party2 = await partyService.create({ first_names: "María" });

    // Colaborador 1 intenta leer ficha de Colaborador 2
    const res = await request(app)
      .get(`/api/v1/parties/${party2.id}`)
      .set("Authorization", `Bearer ${collaborator1Token}`)
      .set("X-User-Name", "juan@comsatel.com");

    expect(res.status).toBe(403);
  });

  it("400: debe retornar error si entrada inválida (schema mismatch)", async () => {
    const res = await request(app)
      .post("/api/v1/parties")
      .set("Authorization", `Bearer ${token}`)
      .send({
        first_names: "Juan",
        identification: { type: "INVALID_TYPE", number: "123" },
        // ...
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details).toBeDefined();
  });
});
```

---

## 5. Dependencias y Bloqueadores {#dependencias}

### 5.1 Dependencias Externas

| Dependencia | Responsable | Bloqueador |
|----------|---|---|
| **Keycloak OIDC endpoint** | DevOps | Debe estar disponible antes de Phase 1 |
| **PostgreSQL 15+** | DevOps | Debe estar disponible antes de Phase 1 |
| **Catálogo de roles** | Product Manager | Seed data para tb_role_catalog (antes Phase 2) |
| **Catálogo de competencias** | Product Manager | Seed data para tb_competency_catalog (si aplica) |
| **Docker registry** | DevOps | Para desplegar imagen Node.js |
| **Monitoring (Prometheus/Grafana)** | DevOps | Para Phase 5 (observability) |

### 5.2 Bloqueadores Potenciales

| Bloqueador | Mitigation | Responsable |
|----------|---|---|
| **Keycloak no funciona** | Usar token mock/fixture en tests (no bloquea development) | Dev Lead |
| **PostgreSQL no disponible** | Usar SQLite in-memory para tests; pg en staging | Dev Lead |
| **DDL incompleto** | Usar Flyway/Migrate con seeds; incluir en repo | DB Admin |
| **Cambios en SPEC-001** | Congellar spec hasta Phase 1 completada | Product |
| **Recursos insuficientes** | Priorizar Phase 1 > Phase 2 > Phase 3 > 4 > 5 | PM |

---

## 6. Criterios de Éxito {#criterios}

### 6.1 Funcionales

- ✅ **100% cobertura US-015–025:** Cada US tiene al menos 1 endpoint + test
- ✅ **Vigencias sin sobrescritura:** Crear nuevo rol cierra anterior automáticamente
- ✅ **Auditoría completa:** created_by, created_at, updated_by, updated_at en todas las tablas
- ✅ **Anonimización irreversible:** After 90 días inactivo, datos PII borrados (no recuperables)
- ✅ **Autenticación Keycloak:** Login via PKCE, tokens en HTTP-only cookies
- ✅ **Autorización RBAC:** Jefe (write all) vs Colaborador (read self + partial write)

### 6.2 No-Funcionales

**Performance:**
- ✅ POST /parties: <1000ms (con 5 role-assignments)
- ✅ GET /parties (1000 rows, limit=20): <500ms
- ✅ GET /parties/{id}/history (100 eventos): <200ms

**Security:**
- ✅ No tokens en localStorage (HTTP-only cookies)
- ✅ SQL Injection: Prepared statements (0 vulnerabilidades)
- ✅ CSRF: SameSite=Strict on cookies
- ✅ Authorization: 403 para operaciones no permitidas
- ✅ Rate limiting: 1000 req/hora por IP/usuario

**Observability:**
- ✅ Métricas Prometheus: api_requests_total, api_request_duration_seconds, db_query_duration_seconds
- ✅ Logs JSON estructurados: timestamp, level, action, party_id, duration_ms
- ✅ Dashboards Grafana: latency, error rates, database performance

**Testing:**
- ✅ Contract tests: ≥80% cobertura
- ✅ Integration tests: Happy + error paths
- ✅ E2E tests: Flujo completo (crear → asignar → anonimizar)
- ✅ Security tests: OWASP Top 10 + authorization

---

## 7. FAQ {#faq}

**P: ¿Puedo modificar el DDL después de Phase 1?**  
A: Sí, pero con migration scripts (Flyway). Congelá schema en Phase 2+ para evitar conflictos.

**P: ¿Qué si Keycloak no está disponible en desarrollo?**  
A: Usa token mock en tests. En local, docker-compose tiene Keycloak (DOCKER_SETUP.md).

**P: ¿Anonimización es reversible o irreversible?**  
A: **Irreversible.** Una vez ejecutada, datos PII se borran completamente. No hay undo.

**P: ¿Puedo sobrescribir un rol directamente?**  
A: **No.** Siempre crea vigencia nueva + cierra anterior. No UPDATE in-place.

**P: ¿Cómo manejo cambio de email?**  
A: PATCH /parties/{id} con nuevo email. Índice UNIQUE en tb_party.email_work WHERE status != 'anonymized'.

**P: ¿Qué si un Colaborador es eliminado de Keycloak pero sigue en BD?**  
A: BD no se sincroniza con Keycloak. Usar /parties/{id}/keycloak-link con DELETE para remover vínculo.

**P: ¿Tamaño máximo para X-User-Name?**  
A: VARCHAR(255). Típicamente: email (hasta 254 chars).

**P: ¿Puedo usar caché para listados?**  
A: Sí. Redis para /parties (paginado), invalidar on POST/PATCH.

**P: ¿Qué si falla la transacción de role assignment?**  
A: Transacción atómica: cierre + apertura = una sola TX. Si falla, ambas se revierten.

---

## Checklist de Entrega

**Phase 1 (Sem 1-2: PARTY + ORGANIZATION)**

- [ ] POST /parties: Crea party + valida email/identificación
- [ ] GET /parties: Listar paginado, filtrado
- [ ] GET /parties/{id}: Consultar ficha
- [ ] PATCH /parties/{id}: Actualizar datos
- [ ] POST /organizations: Crear unidad/proveedor
- [ ] GET /organizations: Listar paginado
- [ ] Autenticación Keycloak funcionando
- [ ] Contract tests passing (happy + error paths)
- [ ] Performance tests < 500ms, < 1000ms

**Phase 2 (Sem 3: ROLE-ASSIGNMENT + PROGRAM-ROLE)**

- [ ] POST /parties/{id}/role-assignments: Asignar nivel (cierra anterior)
- [ ] GET /parties/{id}/role-assignments: Listar vigentes + historial
- [ ] POST /parties/{id}/program-roles: Asignar Evaluador/Jefe
- [ ] Vigencias sin sobrescritura validadas
- [ ] Transacciones atómicas

**Phase 3 (Sem 4: KEYCLOAK-LINK + INTEGRATION TESTS)**

- [ ] PATCH /parties/{id}/keycloak-link: Vincular UUID
- [ ] E2E tests: crear → asignar → vincular Keycloak → consultar
- [ ] Authorization tests: Jefe vs Colaborador

**Phase 4 (Sem 5: ANONYMIZATION + SCHEDULER)**

- [ ] PATCH /parties/{id}/status: Dar de baja
- [ ] POST /parties/{id}/anonymize: Anonimizar after 90 días
- [ ] Scheduler cron job: Notificaciones diarias
- [ ] Irreversibilidad validada (PII borrado)

**Phase 5 (Sem 6: OBSERVABILITY)**

- [ ] Métricas Prometheus
- [ ] Logs JSON estructurados
- [ ] Dashboards Grafana
- [ ] Health check endpoint

---

**Entrega:** Viernes Sem 6 18:00 UTC  
**Responsables:** Backend Dev Lead + Team  
**Revisores:** api-contract-reviewer + api-security-reviewer + QA

---

**Versión:** 1.0  
**Última actualización:** 2026-09-27  
**Fuente:** API-SPEC-001  
**Estado:** READY FOR DEVELOPMENT
