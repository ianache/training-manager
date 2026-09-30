---
type: Architecture Context Pack
title: "ACP-002 — Architecture Context Pack General: Plataforma de Gestión de Formación"
description: "Contexto arquitectónico completo: decisiones (ADRs), bounded contexts, componentes, integraciones, restricciones técnicas y riesgos arquitectónicos."
tags: [architecture-context-pack, platform, microservices, bff, angular, ddd]
status: draft
generated:
  by: "architecture-context-builder/1.0"
  at: "2026-09-29T11:00:00-05:00"
sources:
  - id: bcp-001
    resource: /knowledge-base/business/BCP-001-business-context-pack.md
  - id: acp-001
    resource: /knowledge-base/architecture/ACP-001-contexto-arquitectonico-uxui.md
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-bff-keycloak-pkce.md
  - id: adr-003
    resource: /knowledge-base/architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md
  - id: adr-004
    resource: /knowledge-base/architecture/adrs/ADR-004-secretos-parametria-vault.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
---

# ACP-002 — Architecture Context Pack General

## 1. Resumen Ejecutivo

**Iniciativa:** Plataforma de Gestión de Formación del Recurso Humano (BCP-001)

**Propósito:** Bridge entre demanda de competencias (4 productos) y oferta de colaboradores certificados.

**Alcance:** Solución completa (H1 → H3):
- **H1:** Catálogo + Certificación manual + Búsqueda de candidatos
- **H2:** Rutas de formación + Integración Classroom
- **H3:** Propuestas de IA (GitLab) + Tablero de capacidad

**Arquitectura:** 
- **Frontend:** Shell Angular + MicroUIs por capacidad
- **Backend:** BFF Node.js (orquestador) + Microservicios especializados
- **Persistencia:** MySQL 8.0+ y PostgreSQL (portable)
- **Autenticación:** Keycloak (OAuth 2.0 + PKCE)
- **Secretos:** HashiCorp Vault

**Status:** Architecture Draft (ACP-001 UX/UI + ACP-002 General)

---

## 2. Decisiones Arquitectónicas (ADRs)

### ADR-001 — Estructura: Shell Angular + BFF Node.js + Microservicios

**Status:** ✅ Aceptado (2026-09-20)

**Decisión:**
```
┌─────────────────────────────────────────────┐
│  Users / Browser                            │
└────────────────────┬────────────────────────┘
                     │ HTTPS
                     ▼
        ┌────────────────────────┐
        │  Shell Angular (SPA)   │ ← Navegación global, autenticación
        │  + MicroUIs            │ ← Catálogo, Certificación, Búsqueda, etc.
        └────────────┬───────────┘
                     │ REST API
                     ▼
        ┌────────────────────────────┐
        │  BFF Node.js (Express)     │ ← Orquestación, reglas de negocio
        │  - Auth middleware         │ ← Validación de JWT
        │  - API contracts           │
        └────────────┬───────────────┘
                     │
        ┌────────────┴──────────────────────────────┐
        │                                            │
        ▼                                            ▼
    ┌─────────────────┐              ┌──────────────────────┐
    │ Catalog Service │              │ Collaborators Service│
    │ (Roles, Comps)  │              │ (Party, Assignment)  │
    └────────┬────────┘              └─────────┬────────────┘
             │                                  │
        ┌────▼──────┐                    ┌─────▼──────┐
        │ MySQL 8.0 │                    │ PostgreSQL │
        │ (Maestros)│                    │(Operacional)
        └───────────┘                    └────────────┘

        ┌─────────────────────────────────────────────┐
        │ Certification Service                      │
        │ - Validar evidencias                       │
        │ - Registrar certificaciones (auditable)    │
        └────────────────────┬────────────────────────┘
                             │
                        ┌────▼──────┐
                        │PostgreSQL  │
                        └────────────┘
        
        ┌──────────────────────────┐
        │ AI Service (H3)          │
        │ - Analizar GitLab        │
        │ - Proponer niveles       │
        └────────┬─────────────────┘
                 │
             ┌───▼────────┐
             │ PostgreSQL  │
             └─────────────┘
```

**Justificación:**
- **Aislamiento:** Cambios en Gestión de Formación no afectan otros dominios.
- **Escalabilidad:** Cada microservicio escala independientemente.
- **Team Ownership:** Frontend Team (MicroUIs), Backend Team (APIs), Data Team (Reporting).
- **Portabilidad:** BFF agnóstico a DB; soporta MySQL y PostgreSQL.

**Implicaciones:**
- ✅ MicroUIs NO comparten estado global (aislamiento).
- ✅ Orquestación en BFF (reglas de negocio centralizadas).
- ✅ REST APIs entre capas (contratos claros).
- ✅ Autenticación en Shell (Keycloak).

---

### ADR-002 — Autenticación: OAuth 2.0 + PKCE via Keycloak

**Status:** ✅ Aceptado (2026-09-20)

**Decisión:** Todas las llamadas a BFF requieren JWT válido obtenido de Keycloak (OAuth 2.0 PKCE flow).

**Justificación:**
- **Seguridad:** PKCE previene authorization code interception.
- **Escalabilidad:** Keycloak es authority centralizado; fácil de auditar.
- **Compliance:** Soporta RBAC + ABAC; integración con LDAP futura.

**Flow:**
```
1. Usuario abre Shell Angular
2. Shell redirige a Keycloak (si sin JWT)
3. Usuario se autentica (usuario + contraseña)
4. Keycloak retorna JWT + refresh token
5. Shell almacena JWT en sessionStorage
6. Cada llamada a BFF incluye JWT en Authorization header
7. BFF valida JWT; si inválido, retorna 401
8. Shell captura 401 → redirige a Keycloak (re-autenticación)
```

**Restricciones:**
- ✅ Credenciales se guardan en Keycloak, no en la plataforma.
- ✅ Usuarios (identidades) se gestionan aparte de datos maestros (colaboradores).
- ✅ La plataforma solo vincula usuario Keycloak con colaborador (SPEC-001 D4).

---

### ADR-003 — Persistencia: MySQL 8.0+ y PostgreSQL

**Status:** ✅ Aceptado (2026-09-25)

**Decisión:** BFF soporta ambos engines con DDL portable + per-engine variantes.

**Justificación:**
- **No vendor lock-in:** Cliente elige versión open-source.
- **Portabilidad:** Migraciones y scripts documentados para ambos.
- **Testing:** CI/CD corre tests con ambos engines.

**Estructura:**
```
migrations/
  001-initial-schema.sql (common)
  001-initial-schema.mysql.sql (overrides)
  001-initial-schema.postgres.sql (overrides)
  002-add-audit-tables.sql
  ...

tests/
  fixtures/
    employees.json (GUID codes, no conflicts)
    competencies.json
    certifications.json
```

**Convención de Naming:**
- Tablas: `tb_<nombre>` (e.g., `tb_role`, `tb_competency`)
- PKs: `pk_<tabla>_id` (e.g., `pk_role_id`)
- FKs: `fk_<tabla_referenciada>_id` (e.g., `fk_role_id`)
- Índices: `idx_<tabla>_<columnas>` (e.g., `idx_collaborator_employee_code`)

---

### ADR-004 — Secretos y Parametría: HashiCorp Vault

**Status:** ✅ Aceptado (2026-09-25)

**Decisión:** Credenciales, API keys y parámetros sensibles se almacenan en Vault, no en código ni .env.

**Justificación:**
- **Seguridad:** Encriptación en reposo + auditoría de acceso.
- **Rotación:** Cambiar credenciales sin redeploy.
- **Compliance:** Trazabilidad de quién accedió qué.

**Secretos Gestionados:**
- Credenciales de DB (MySQL, PostgreSQL)
- Credenciales de Keycloak (client_id, client_secret)
- API keys de GitLab, Google APIs (H2, H3)
- Credenciales de Gmail (notificaciones — SPEC-001 D22)
- JWT signing key (si aplica)

**Path Pattern:**
```
secret/gestión-formación/
  db/
    mysql/
      host
      user
      password
      port
    postgres/
      host
      user
      password
      port
  auth/
    keycloak/
      client_id
      client_secret
      realm_url
  integrations/
    gitlab/
      api_token
    google/
      api_key
  notifications/
    gmail/
      account_email
      app_password (o service account)
```

---

## 3. Componentes y Capas

### 3.1 Frontend Layer

**Shell Angular (Global):**
- Responsable: Navegación, autenticación (Keycloak), layout global
- Tecnología: Angular 17+ (Standalone components)
- Ubicación: `apps/shell/`
- Rol: Carga MicroUIs; maneja redirecciones de auth

**MicroUIs (Por Capacidad de Negocio):**

| MicroUI | Capacidad | Historias | Ruta |
|---------|-----------|-----------|------|
| **Catálogo** | Gestionar roles y competencias | US-001, US-002 | `/catalog` |
| **Certificación** | Certificar niveles con evidencia | US-003 | `/certification` |
| **Búsqueda** | Buscar candidatos y ver brechas | US-005, US-006 | `/candidates` |
| **Perfil** | Ver perfil de competencias propio | US-004 | `/profile` |
| **Formación** | Rutas y cursos (H2) | US-009–US-014 | `/training` |
| **Propuestas IA** | Ver propuestas de nivel (H3) | US-025–US-030 | `/ai-proposals` |

**Design System:**
- Tokens: Colors, Typography, Spacing, Roundness (TypeScript constants)
- Base: Stitch design (GEN-001, GEN-002)
- Componentes: Atoms (input, button, badge) → Molecules → Organisms
- Accesibilidad: WCAG 2.2 AA (validar con axe-core)

---

### 3.2 Backend Layer (BFF + Services)

**BFF Node.js (Express):**
- Responsable: Orquestación, validación de JWT, reglas de negocio, transacciones
- Ubicación: `apps/bff/`
- Puerto: 3000 (dev), env variable en prod
- Middlewares: Auth, CORS, logging, error handling

**Microservicios:**

| Servicio | Responsabilidad | DB | Puertos |
|----------|-----------------|-----|---------|
| **Catalog Service** | CRUD de roles, competencias, requisitos de evidencia | MySQL | 3001 |
| **Collaborators Service** | Información maestra (Party model) | PostgreSQL | 3002 |
| **Certification Service** | Registro de certificaciones, auditoría | PostgreSQL | 3003 |
| **AI Service (H3)** | Análisis de GitLab, propuestas de nivel | PostgreSQL | 3004 |

**API Contracts (REST):**
```
GET    /api/v1/catalog/roles
GET    /api/v1/catalog/roles/:id
POST   /api/v1/catalog/roles
PATCH  /api/v1/catalog/roles/:id

GET    /api/v1/collaborators
POST   /api/v1/collaborators
GET    /api/v1/collaborators/:id
PATCH  /api/v1/collaborators/:id

POST   /api/v1/certifications
GET    /api/v1/certifications/:id
PATCH  /api/v1/certifications/:id/approve
PATCH  /api/v1/certifications/:id/reject

GET    /api/v1/ai/proposals (H3)
POST   /api/v1/ai/proposals/:id/review (H3)
```

---

### 3.3 Data Layer

**Bases de Datos:**

| Base | Motor | Propósito | Tablas Clave |
|------|-------|----------|--------------|
| **maestros_formacion** | MySQL 8.0+ | Datos de referencia (roles, competencias, catalogo) | tb_role, tb_competency, tb_requirement_type |
| **formacion_operacional** | PostgreSQL | Datos operacionales (colaboradores, certificaciones, propuestas) | tb_collaborator, tb_certification, tb_ai_proposal |

**Modelo de Datos (Party Model):**
```
Parte (Persona u Organización)
├── Persona
│   ├── Identificación (DNI, pasaporte, etc.)
│   ├── Datos de contacto (email, teléfono, perfiles profesionales)
│   └── Medios de contacto (múltiples)
├── Organización
└── Rol de Parte
    ├── Empleado
    ├── Contratista
    ├── Jefe de Proyecto
    └── Jefe de Ingeniería

Asignación Rol-Nivel
├── Colaborador → Rol (e.g., Developer)
├── Nivel del Rol (e.g., Junior Nivel 2)
└── Vigencia (fecha inicio, fecha fin)

Competencia
├── Nombre
├── Descripción
├── Niveles (L1–L4)
└── Rúbrica por nivel

Certificación
├── Colaborador
├── Competencia
├── Nivel Certificado (L1–L4)
├── Evidencias (formación, práctica, desempeño)
├── Evaluador (quién certificó)
├── Fecha de certificación
└── Auditoría (cambios históricos)
```

---

## 4. Integraciones

### 4.1 Integraciones Externas (H1)

| Sistema | Rol | Dirección | Protocolo | Notas |
|---------|-----|-----------|-----------|-------|
| **Keycloak** | Autenticación | Bidireccional | OAuth 2.0 PKCE | ADR-002; validación de JWT en BFF |
| **HashiCorp Vault** | Secretos | Una dirección (lectura) | REST API | ADR-004; BFF obtiene credenciales |
| **Google Classroom** | Cursos y tareas | Solo lectura | Google APIs | H2; integración condicional |
| **Google Drive** | Material del curso | Enlace y lectura | Google APIs + Embeds | H2; links a documentos |
| **GitLab** | Evidencia de desempeño | Solo lectura | GraphQL + REST API | H3; issues, MRs, milestones |
| **docsuite** | Generación de certificados | API REST | REST API | H2; genera PDF y guarda referencia |

### 4.2 Integración Keycloak (ADR-002)

**Flujo de Autenticación:**
1. Shell redirija a Keycloak `/realms/{realm}/protocol/openid-connect/auth`
2. Usuario ingresa credenciales
3. Keycloak retorna authorization code
4. Shell intercambia código por JWT (+ refresh token)
5. Cada llamada a BFF incluye JWT en `Authorization: Bearer {token}`
6. BFF valida JWT; extrae claims (sub, email, roles)

**Setup Keycloak (Docker Compose):**
```yaml
keycloak:
  image: keycloak/keycloak:latest
  environment:
    KEYCLOAK_ADMIN: admin
    KEYCLOAK_ADMIN_PASSWORD: ${KEYCLOAK_PASSWORD}
  ports:
    - "8080:8080"
  volumes:
    - ./keycloak/realm-export.json:/opt/keycloak/data/import/realm.json
  command: start-dev --import-realm
```

---

## 5. Bounded Contexts (DDD)

### Bounded Context: Gestión de Formación

**Language (Ubiquitous Language):**
- Rol (Role)
- Competencia (Competency)
- Nivel de Dominio (L1–L4)
- Rol-Nivel de Colaborador (Role-Level Assignment)
- Certificación (Certification)
- Brecha (Gap = Required Level − Certified Level)
- Requerimiento (Requirement)
- Evidencia (Evidence: formación, práctica, desempeño)
- Asignación (Assignment: Colaborador → Requerimiento)

**Aggregates:**
1. **Catálogo Agregado**
   - Root: Rol
   - Entities: Competencia (del rol), Requisitos de Evidencia
   - Value Objects: Nivel (L1–L4), Rúbrica

2. **Colaborador Agregado**
   - Root: Colaborador
   - Entities: Certificación (del colaborador)
   - Value Objects: Brecha, Nivel Certificado

3. **Requerimiento Agregado**
   - Root: Requerimiento
   - Entities: (ninguna)
   - Value Objects: Rol-Nivel requerido, Competencias

4. **Propuesta IA Agregado (H3)**
   - Root: Propuesta de Nivel
   - Entities: Evidencia de GitLab
   - Value Objects: Justificación, Score de confianza

**Integration with Other Contexts:**
- **Context: Autenticación** (Shell ↔ Keycloak): Integración via JWT
- **Context: Reporting** (H3): Consume datos de Certificación para KPIs
- **Context: GitLab (Evidencia):** Lectura de issues, MRs (H3)

---

## 6. Restricciones Técnicas

| ID | Restricción | Impacto |
|----|-------------|--------|
| **TCON-001** | Frontend solo puede hacer llamadas autenticadas a BFF | Toda llamada requiere JWT válido |
| **TCON-002** | BFF valida JWT + extrae claims (sub, email, roles) | RBAC implementado en BFF |
| **TCON-003** | Credenciales en Vault; nunca en código | Renovación sin redeploy |
| **TCON-004** | DB DDL portable: MySQL y PostgreSQL | Migraciones duplicadas |
| **TCON-005** | MicroUIs are stateless; estado en BFF | Sincronización de estado fácil |
| **TCON-006** | Shell = única fuente de navegación global | Evita estado duplicado |
| **TCON-007** | Auditoría de certificaciones: quién, cuándo, evidencia | Tabla de auditoría inmutable |

---

## 7. Riesgos Arquitectónicos

| ID | Riesgo | Probabilidad | Impacto | Mitigación |
|----|--------|-------------|--------|-----------|
| **ARISK-001** | Latencia BFF: muchas llamadas a microservicios | Media | Medio | Caching (Redis), query optimization, batching |
| **ARISK-002** | Monolito en BFF: reglas de negocio centralizadas | Baja | Alto | Refactorizar en funciones puras; testing exhaustivo |
| **ARISK-003** | DB split (MySQL + PostgreSQL): consistencia cross-DB | Media | Medio | Sagas distribuidas; event sourcing (H3) |
| **ARISK-004** | Keycloak como SPOF (Single Point of Failure) | Baja | Alto | HA Keycloak; failover plan; JWT caching en Shell |
| **ARISK-005** | GitLab API rate limiting (H3) | Baja | Medio | Batch processing; queue de propuestas; retry logic |
| **ARISK-006** | Integración Classroom falla | Baja | Alto | Contingencia: gestión propia de cursos (post-H2) |

---

## 8. Supuestos Técnicos

| ID | Supuesto | Validación | Confianza |
|----|----------|-----------|----------|
| **TSUP-001** | Keycloak estará disponible 99.9% del tiempo | Por configurar en QA | Media |
| **TSUP-002** | Red es confiable; tolerancia a latencia 200ms BFF-Svc | Por medir en staging | Media |
| **TSUP-003** | MicroUIs cargan en <2s (shell fast enough) | Por medir en staging | Media |
| **TSUP-004** | PostgreSQL soporta 1000+ transacciones/sec | Por confirmar en load test | Baja |
| **TSUP-005** | GitLab API estará disponible (H3) | Por confirmar con GitLab | Baja |

---

## 9. Non-Functional Requirements (Derivados de BCP-001)

| NFR | Target | Justificación |
|-----|--------|---------------|
| **Latencia API** | p95 < 500ms | KPI 2: Tiempo de asignación rápido |
| **Disponibilidad** | 99.5% (business hours) | Plataforma interna; horas de trabajo |
| **Escalabilidad** | Soportar 1000 usuarios concurrentes | 4 productos × ~250 usuarios activos |
| **Seguridad** | OWASP Top 10; WCAG 2.2 AA | Compliance + inclusión |
| **Auditoría** | Audit trail inmutable de certificaciones | Regla de negocio: trazabilidad |
| **Recoverability** | RTO 4h, RPO 1h | Datos operacionales; backup diario |

---

## 10. Roadmap Arquitectónico

### H1 — El Idioma Común
- ✅ Shell Angular + Catálogo MicroUI
- ✅ BFF Node.js + Catalog Service + Collaborators Service
- ✅ Keycloak (autenticación)
- ✅ MySQL (catálogo) + PostgreSQL (operacional)
- ✅ Vault (secretos)
- ⏳ Testing (unit, integration, E2E)

### H2 — Formación Integrada
- ⏳ Formación MicroUI
- ⏳ Integración Google Classroom (API)
- ⏳ Integración Google Drive (embeds)
- ⏳ Integración docsuite (genera certificados)
- ⏳ Rutas de formación automáticas

### H3 — Evidencia Real con IA
- ⏳ AI Service + análisis de GitLab
- ⏳ Propuestas MicroUI
- ⏳ Tablero de capacidad
- ⏳ Event sourcing (opcional para auditoría)
- ⏳ GraphQL (opcional para queries complejas)

---

## 11. Prójimos Pasos

1. **Validación técnica** de ACP-002 con:
   - Arquitecto de Soluciones
   - Tech Lead del Frontend
   - Tech Lead del Backend

2. **Generar diagramas Archify:**
   - Arquitectura general (componentes + integraciones)
   - Modelo de datos (ER diagram)
   - Flujos de procesos principales (secuencia)

3. **Desglose en decisiones ADR:**
   - ADR-005: Estrategia de caching (Redis)
   - ADR-006: Event sourcing para H3
   - ADR-007: GraphQL vs REST (si aplica)

4. **Plan de implementación:**
   - Sprint 1–4: H1 (Backend + Frontend)
   - Sprint 5–8: H2 (Integraciones)
   - Sprint 9–12: H3 (IA + Tableros)

---

**Documento Generado:** 2026-09-29  
**Estado:** Draft (Pendiente validación técnica)  
**Responsable de Validación:** Arquitecto de Soluciones + Tech Leads
