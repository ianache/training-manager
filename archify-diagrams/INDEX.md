# Archify Diagrams — Plataforma de Gestión de Formación

Candidatos JSON para generar diagramas interactivos con [Archify](https://github.com/tt-a1i/archify).

## 📊 Diagramas Generados

### 1. Arquitectura General (Architecture)
**Archivo:** `01-architecture-general.json`

**Vista:** Sistema completo con componentes, capas e integraciones.

```
Usuarios → Shell Angular (SPA)
            ├── MicroUI: Catálogo (Roles, Competencias)
            ├── MicroUI: Búsqueda (Candidatos, Brechas)
            ├── MicroUI: Certificación (Evaluar, Registrar)
            └── MicroUI: Perfil (Mi Competencias)
            
            ↓ REST + JWT
            
BFF Node.js (Express)
├── Catalog Service (MySQL) - Roles, Competencias
├── Collaborators Service (PostgreSQL) - Party, Asignaciones
├── Certification Service (PostgreSQL) - Certificaciones, Auditoría
└── AI Service (PostgreSQL) - Análisis GitLab (H3)

↔ Keycloak (OAuth 2.0 PKCE)
↔ Vault (Secretos & Parametría)

↔ Integraciones:
  ├── Google Classroom (Solo lectura, H2)
  ├── Google Drive (Enlaces a material, H2)
  ├── GitLab (Issues, MRs, H3)
  └── docsuite (Certificados PDF, H2)
```

**Componentes:**
- **Frontend:** Shell + 4 MicroUIs (Catálogo, Búsqueda, Certificación, Perfil)
- **Backend:** BFF + 4 Microservicios
- **Data:** MySQL 8.0+ (maestros) + PostgreSQL (operacional)
- **Security:** Keycloak (autenticación) + Vault (secretos)
- **External:** Google Classroom, Drive, GitLab, docsuite

**Decisiones Arquitectónicas:**
- ✅ ADR-001: Shell + MicroUIs + BFF + Microservicios
- ✅ ADR-002: Keycloak (OAuth 2.0 PKCE)
- ✅ ADR-003: MySQL + PostgreSQL (portable)
- ✅ ADR-004: HashiCorp Vault

---

### 2. Modelo de Datos Conceptual (Dataflow)
**Archivo:** `02-data-model-flow.json`

**Vista:** Entidades, relaciones y flujo de datos (Party Model).

```
Parte (Persona u Organización)
  ├── Persona
  │   ├── Identificación (DNI, Pasaporte)
  │   └── Medios de Contacto (Email, Teléfono, Perfiles)
  └── Organización

Rol de Parte
  ├── Empleado
  ├── Contratista
  ├── Jefe de Proyecto
  └── Jefe de Ingeniería

Colaborador (Persona + Rol Vigente)
  │
  ├── Rol-Nivel Asignado (Developer Junior Lvl 2)
  │   └── Define: Competencias requeridas + Niveles
  │
  └── Certificación (Competencia + Nivel L1-L4)
      ├── Respaldada por: Evidencia
      │   ├── Formación (Curso aprobado)
      │   ├── Práctica (Evaluación)
      │   └── Desempeño (GitLab - H3)
      ├── Evaluador (Quién certificó)
      ├── Fecha de Certificación
      └── Auditoría (Cambios históricos)

Catálogo (Único, Común a 4 Productos)
├── Rol (Developer, PM, QA, etc.)
├── Competencia (Skill con L1-L4)
├── Rol-Nivel (Developer Junior Lvl 1, 2, 3)
└── Requisitos de Evidencia (por Competencia/Nivel)

Proyecto
  └── Requerimiento (Rol-Nivel + Competencias específicas)
      │
      ├── Calcula: Brecha (Nivel Requerido − Nivel Certificado)
      │
      └── Asignación (Colaborador → Requerimiento)

Propuesta IA (H3)
  ├── Analiza: Evidencia de GitLab
  ├── Propone: Nivel de competencia
  └── Justificación: Trazable
```

**Agregates (DDD):**
1. **Catálogo Agregado** (Rol, Competencias, Requisitos)
2. **Colaborador Agregado** (Persona, Certificaciones)
3. **Requerimiento Agregado** (Proyecto, Rol-Nivel, Competencias)
4. **Propuesta IA Agregado** (Análisis GitLab, Propuestas)

**Convenciones de Datos:**
- **Party Model:** Persona u Organización + Rol de Parte
- **Portabilidad:** Mismo DDL para MySQL y PostgreSQL
- **Auditoría:** Tabla inmutable de cambios en certificaciones
- **Identificadores:** GUIDs para Employee Code (sin conflictos)

---

### 3. Flujos de Procesos Principales (Workflow)
**Archivo:** `03-workflow-procesos.json`

**Vista:** Tres flujos principales con actores y decisiones.

#### Flujo 1: Certificación (BO-003, H1-H3)
```
Evaluador
  ├── Abre pantalla de certificación
  ├── Sistema carga: Colaborador + Competencia + Evidencias
  ├── Revisa evidencias (formación, práctica, GitLab)
  ├── Decisión: ¿Evidencia válida?
  │   ├── SÍ → Aprueba nivel
  │   └── NO → Rechaza + registra motivo
  ├── Sistema registra certificación (auditable)
  └── Notifica a colaborador

Principios:
✅ Firma humana obligatoria (BCON-001)
✅ Trazabilidad: quién, cuándo, evidencia
✅ Motivo registrado si rechaza (BR-ACR-11)
```

#### Flujo 2: Búsqueda de Candidatos (BO-002, H1-H3)
```
PM (Jefe de Proyecto)
  ├── Abre búsqueda de candidatos
  ├── Declara requerimiento: Rol-Nivel + Competencias
  ├── Sistema calcula brecha para cada colaborador
  ├── Muestra candidatos ordenados por menor brecha
  ├── Valida candidatos (puede ver detalles + brechas)
  └── Recomienda candidatos al Jefe de Ingeniería

Restricción:
✅ PM recomienda, no asigna (EVD-2026-0126)
```

#### Flujo 3: Asignación (BO-002, H1-H3)
```
Jefe de Ingeniería
  ├── Recibe recomendación de PM
  ├── Valida candidatos
  ├── Asigna uno o varios colaboradores al requerimiento
  │   └── Puede asignar incluso bajo nivel (con advertencia)
  ├── Sistema registra asignación (auditable)
  └── Asignación completada

Decisión Final:
✅ Jefe de Ingeniería o ADMIN asigna (EVD-2026-0126)
✅ Se registra brecha en momento de asignación
✅ Una persona puede estar en múltiples requerimientos
```

---

### 4. Cache Miss Request Sequence (Sequence)
**Archivo:** `04-cache-miss-sequence.json`

**Vista:** Secuencia de una solicitud web con fallida de caché (cache miss).

```
Browser → API → Redis (check) → PostgreSQL (query) → Redis (fill) → Response

FASE 1: Request (HTTP GET)
Browser
   │ HTTP GET /api/data
   └────────────────────> API Server
                            │ (recibe solicitud)

FASE 2: Cache Check & Miss
API Server
   │ GET cache_key
   └────────────────> Redis
                      │ nil (cache miss)
                      └────────────────> API Server
                                         │ (caché vacío)

FASE 3: Database Query
API Server
   │ SELECT * FROM users
   └─────────────────────────────> PostgreSQL
                                   │ rows (user data)
                                   └─────────────────────────> API Server
                                                               │ (obtiene datos)

FASE 4: Cache Replenish & Response
API Server
   │ SET cache_key (TTL 3600s)
   └────────────────> Redis
                      │ OK
                      └────────────────> API Server
                                         │ (caché lleno)
   │ 200 JSON response
   └────────────────────> Browser
                          │ (cliente recibe datos)
```

**Flujo Temporal:**
1. **Request:** ~5ms (latencia de red)
2. **Cache Check:** ~2ms (Redis, muy rápido)
3. **Cache Miss Detection:** Inmediato
4. **Database Query:** ~100-500ms (dependiendo de la consulta)
5. **Cache Fill:** ~5ms (Redis write, asincrónico)
6. **Total (primera vez):** ~500-600ms
7. **Cache Hit (próximas requests):** ~7-10ms

**Garantías:**
- ✅ **Source of Truth:** PostgreSQL es la autoridad
- ✅ **TTL:** 3600 segundos (1 hora) para refrescar automáticamente
- ✅ **Transparencia:** El cliente no conoce la implementación interna
- ✅ **Escalabilidad:** Redis escala horizontalmente si es necesario

**Casos de Uso:**
- Búsqueda de catálogo de competencias (H1, alto volumen)
- Búsqueda de colaboradores certificados (H1, frecuente)
- Listado de roles y niveles (H1, muy frecuente)
- Propuestas IA (H3, después de análisis de GitLab)

---

## 📝 Generación de Diagramas HTML Interactivos

Para generar los diagramas HTML completos con Archify:

```bash
# Instalar Archify
npx skills add tt-a1i/archify -g

# Generar Arquitectura
node archify finalize architecture 01-architecture-general.json 01-architecture-general.html --quality showcase

# Generar Modelo de Datos
node archify finalize dataflow 02-data-model-flow.json 02-data-model-flow.html --quality showcase

# Generar Workflows
node archify finalize workflow 03-workflow-procesos.json 03-workflow-procesos.html --quality showcase

# Generar Cache Miss Sequence
node archify finalize sequence 04-cache-miss-sequence.json 04-cache-miss-sequence.html --quality showcase
```

**Resultado:** Tres archivos HTML interactivos con:
- ✅ Tema oscuro/claro
- ✅ Zoom y pan
- ✅ Búsqueda de componentes
- ✅ Exportación a PNG/SVG/WebP

---

## 🔗 Relación con Documentos de Contexto

| Diagrama | Linkedto | Propósito |
|----------|----------|-----------|
| **Arquitectura** | ACP-002 (Architecture Context Pack) | Decisiones técnicas (ADR-001 a ADR-004) |
| **Modelo de Datos** | BCP-001 (Business Context Pack) | Entidades de negocio, Party Model |
| **Workflows** | BO-001, BO-002, BO-003 (Business Objectives) | Procesos de certificación, búsqueda, asignación |
| **Cache Miss Sequence** | ACP-002 (ADR-005: Caching Strategy) | Mejora de rendimiento, escalabilidad |

---

## 📊 Cobertura de Horizontes

| Diagrama | H1 | H2 | H3 |
|----------|----|----|-----|
| **Arquitectura** | ✅ Shell, BFF, DB | ✅ Integraciones Classroom | ✅ AI Service, Tableros |
| **Modelo de Datos** | ✅ Party, Certificación, Brecha | ✅ Rutas de Formación | ✅ Propuesta IA |
| **Workflows** | ✅ Certificación Manual, Búsqueda | ✅ (No nuevos flujos) | ✅ Propuestas IA (aprobación) |
| **Cache Miss Sequence** | ✅ Búsqueda de catálogo y colaboradores | ✅ Consultas frecuentes | ✅ Análisis de propuestas IA |

---

## 🎯 Próximos Pasos

1. **Ejecutar generación Archify** con los JSON candidates
2. **Validar diagramas** con:
   - Arquitecto de Soluciones
   - Tech Lead Frontend
   - Tech Lead Backend
3. **Documentar decisiones adicionales:**
   - ADR-005: Estrategia de caching (Redis)
   - ADR-006: Event sourcing (H3, opcional)
   - ADR-007: GraphQL vs REST (opcional)
4. **Derivar especificaciones técnicas:**
   - API contracts (OpenAPI 3.0)
   - Database schema (DDL)
   - Component library spec (Design Tokens)

---

**Generado:** 2026-09-29  
**Estado:** Draft - Candidates JSON listos para Archify  
**Validación Pendiente:** Arquitecto de Soluciones + Tech Leads
