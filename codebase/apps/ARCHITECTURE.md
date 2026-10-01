# Arquitectura de la aplicación web — Plataforma de Gestión de Formación

> **Estado:** borrador generado por Claude (2026-09-30) a pedido de ianache. Falta revisión humana.
> Implementa decisiones **aceptadas** (ADR-001 a ADR-005; la conformidad está en la §6). Lo que esas ADR dejaron
> abierto y este scaffold tuvo que resolver figura como **propuesta** en la §9 y como pregunta en la §10.

## 1. Vista general

```
                    Navegador (solo HTML/JS + cookie opaca gf.sid HTTP-only)
                                         │ HTTPS, mismo origen
                                         ▼
 ┌─────────────────────────────── apps/portal (Angular 22) ───────────────────────────────┐
 │  shell (host Native Federation, :4200)                                                  │
 │   • layout global, navegación por rol, estados transversales, guards                    │
 │   • carga microUIs desde federation.manifest.json                                       │
 │        ├── mfe-catalog       (:4201)  /catalogo        US-001/002 · UXR-001             │
 │        └── mfe-collaborators (:4202)  /colaboradores   US-015…025 · RCP-003             │
 │  libs compartidas (singleton): @gf/core (sesión, HTTP, estados) · @gf/ui (design system)│
 └───────────────────────────────────────┬─────────────────────────────────────────────────┘
                                         │ /auth/*  /api/v1/*   (cookie + X-XSRF-TOKEN)
                                         ▼
 ┌──────────────────────────────── apps/bff (Node.js 22+, Express 5) ──────────────────────┐
 │  /auth   OIDC Authorization Code + PKCE con Keycloak · sesión en Redis (30 min)          │
 │  /api/v1 requireSession → RBAC → módulos por dominio → ServiceClient                     │
 │          Authorization: Bearer <token cuenta de servicio> · X-User-Name · X-Request-ID   │
 └──────────────┬───────────────────────────────┬───────────────────────────┬──────────────┘
                ▼                               ▼                           ▼
   domains/party-management-service     catalog-service (pendiente)   Keycloak · Redis · Vault
   (FastAPI, ADR-008)
```

## 2. Estructura de carpetas

```
codebase/apps/
├── ARCHITECTURE.md                ← este documento
├── portal/                        ← workspace Angular (un repo, varios proyectos)
│   ├── angular.json
│   ├── package.json               ← scripts: start, start:all, build, build:libs, test
│   ├── tsconfig.json              ← paths @gf/core y @gf/ui → código fuente
│   ├── tools/check-architecture.mjs ← conformidad ADR (npm run lint:arch)
│   └── projects/
│       ├── shell/                 ← HOST
│       │   ├── federation.config.mjs
│       │   ├── proxy.conf.json    ← /api y /auth → BFF :3000 (dev)
│       │   ├── public/federation.manifest.json   ← URLs de remotes, se reemplaza por entorno
│       │   └── src/app/
│       │       ├── app.routes.ts            ← montaje de microUIs + rutas de estado
│       │       ├── app.config.ts            ← provideGfCore + manejo de error de carga remota
│       │       ├── federation/remotes.ts    ← registro de remotes y loadRemoteRoutes()
│       │       ├── layout/                  ← SCR-000: header, sidebar por rol, skip link, <main>
│       │       └── pages/status-pages.ts    ← sesión vencida, sin permiso, no encontrado, remoto caído
│       ├── mfe-catalog/           ← REMOTE: expone './routes'
│       │   └── src/app/
│       │       ├── routes.ts                ← ROUTES expuestas (relativas, sin prefijo)
│       │       ├── data-access/             ← CatalogApi + modelos (solo habla con el BFF)
│       │       └── pages/                   ← role-list (SCR-001), role-detail (SCR-002, stub)
│       ├── mfe-collaborators/     ← REMOTE: expone './routes'
│       │   └── src/app/{routes.ts, data-access/, pages/party-list, pages/party-detail}
│       ├── core/                  ← @gf/core: sin UI
│       │   └── src/lib/{config, auth, http, state}
│       └── ui/                    ← @gf/ui: design system (Atomic Design)
│           └── src/{styles/tokens.css, lib/atoms, lib/molecules}
└── bff/
    ├── package.json · tsconfig*.json · Dockerfile · .env.example
    ├── src/
    │   ├── main.ts                ← arranque: env → Vault → Redis → Keycloak → app
    │   ├── app.ts                 ← composición (testeable, dependencias inyectadas)
    │   ├── config/                ← env.ts (zod, fail-fast) · secrets.ts (Vault KV v2)
    │   ├── auth/                  ← oidc.ts (puerto Keycloak) · session.ts · auth.router.ts · guards.ts · roles.ts
    │   ├── downstream/            ← service-token.ts (client_credentials cacheado) · service-client.ts
    │   ├── modules/               ← un router por dominio: parties/, catalog/
    │   ├── middleware/            ← request-id · csrf · error-handler
    │   ├── health/ · observability/ · shared/
    └── test/
        ├── app.test.ts            ← login PKCE, CSRF, RBAC, propagación de identidad, logout
        └── adr-compliance.test.ts ← fitness functions ADR-001…005
```

## 3. Reglas de dependencia

| Capa | Puede depender de | No puede |
|---|---|---|
| `@gf/ui` | Angular, tipos de `@gf/core` | HttpClient, servicios de negocio, rutas |
| `@gf/core` | Angular | `@gf/ui`, cualquier microUI |
| microUI (`mfe-*`) | `@gf/core`, `@gf/ui` | otro microUI, el shell, estado global propio |
| shell | `@gf/core`, `@gf/ui`, remotes por manifiesto | importar código de un microUI en compilación |
| BFF `modules/*` | `auth/guards`, `downstream`, `shared` | lógica de negocio del dominio (vive en los microservicios) |

- **Un microUI = una capacidad.** Expone solo `./routes`; no conoce su prefijo de montaje.
- **Comunicación entre microUIs:** por URL (navegación) o por datos del BFF. No hay bus de eventos ni store compartido (ACP-002 TCON-005).
- **El portal solo habla con el BFF**, con rutas relativas (`/api/v1`, `/auth`). Nunca con un microservicio ni con Keycloak directamente.
- **La UI oculta, el BFF autoriza.** Guards y navegación por rol son ergonomía; `requireAnyRole` en el BFF es la barrera.

## 4. Flujos clave

### 4.1 Inicio de sesión (ADR-002, ADR-005 §1 y §5)

1. El usuario abre `/catalogo`. `authGuard` llama `GET /auth/session` → 401.
2. El shell navega a `/auth/login?returnTo=/catalogo`.
3. El BFF genera `code_verifier`, `state`, guarda ambos en la sesión y redirige a Keycloak con `code_challenge` (S256).
4. Keycloak autentica y vuelve a `/auth/callback?code&state` (pasa por el proxy del shell: mismo origen).
5. El BFF valida `state`, canjea el código con el verifier, **regenera el id de sesión** y guarda tokens en Redis.
6. El navegador recibe solo `gf.sid` (HTTP-only, SameSite=Lax, Secure en prod) y vuelve a `/catalogo`.

### 4.2 Llamada de negocio (ADR-005 §2)

`PartyListPage → PartiesApi → GET /api/v1/parties` (cookie + `X-Request-ID`) → BFF `requireSession` (renueva con refresh token si hace falta) → `ServiceClient` → party-service con `Authorization: Bearer <token de servicio>`, `X-User-Name`, `X-Request-ID`.

### 4.3 Sesión vencida y cierre

- Un 401 en `/api/v1/*` → `sessionExpiryInterceptor` marca la sesión como vencida y navega a `/sesion-vencida` (un único botón "Iniciar sesión").
- "Cerrar sesión" envía `POST /auth/logout` con `_csrf`; el BFF destruye la sesión y redirige al `end_session` de Keycloak (cierre bilateral).

### 4.4 Estados de vista (UXR-000.4)

Toda llamada pasa por `toViewState()` (`@gf/core`) y se pinta con `<gf-view-state>` (`@gf/ui`): carga, vacío, error (mensaje de negocio + código de seguimiento + reintentar), sin permiso (403, sin datos) y éxito. Si un microUI no carga, el shell muestra `/no-disponible` y el resto sigue funcionando.

## 5. Seguridad

| Control | Dónde |
|---|---|
| Tokens fuera del navegador | `auth/session.ts` (Redis) — ADR-005 §1 |
| PKCE S256 + `state` + regeneración de sesión | `auth/oidc.ts`, `auth/auth.router.ts` |
| CSRF double-submit (`XSRF-TOKEN` / `X-XSRF-TOKEN`) | `middleware/csrf.ts`, `provideGfCore()` |
| Anti open-redirect en `returnTo` | `safeReturnTo()` |
| RBAC por endpoint | `auth/guards.ts#requireAnyRole` |
| Allowlist de query params hacia servicios | `shared/http.ts#pickQuery` |
| Secretos en Vault (KV v2); obligatorio en producción | `config/secrets.ts` — ADR-004 |
| Cabeceras seguras, sin `x-powered-by`, logs sin cookies/tokens | `helmet`, `observability/logger.ts` |

## 6. Conformidad con las ADR aceptadas

Cada ADR tiene controles en el código **y** una prueba automática que falla si alguien la contradice
(`bff/test/adr-compliance.test.ts` y `portal/tools/check-architecture.mjs` → `npm run lint:arch`).

| ADR | Qué exige | Cómo se cumple | Verificación automática |
|---|---|---|---|
| **ADR-001** Shell + microUIs + BFF + microservicios | Shell y microUIs en Angular; todo acceso a microservicios pasa por un BFF (Node.js: ADR-001, confirmado por [ADR-010](/knowledge-base/architecture/adrs/ADR-010-lenguaje-del-bff-nodejs.md) frente a ADR-008) | `portal/projects/shell` (host) + `mfe-catalog`, `mfe-collaborators` (remotes Native Federation; técnica sin decisión vigente tras rechazar ADR-009, Q-01); el portal solo usa rutas relativas `/api/v1` y `/auth`; el BFF reenvía a `domains/*` con `ServiceClient`; el BFF no tiene base de datos | Portal: sin URLs absolutas a servicios, sin imports entre microUIs, `@gf/ui` sin HTTP. BFF: sin drivers/ORM de BD, `fetch` solo en `downstream/` |
| **ADR-002** Keycloak + OAuth 2.0 PKCE en el BFF | El BFF se integra con Keycloak con el flujo PKCE | `auth/oidc.ts` (openid-client): Authorization Code + PKCE **S256** + `state`; `auth/auth.router.ts` (`/auth/login`, `/callback`, `/session`, `/logout`); el shell no tiene pantalla de login (la muestra Keycloak) | BFF: prueba de flujo completo con `state` inválido rechazado; chequeo de S256. Portal: sin `/realms/`, `openid-connect` ni librerías OIDC en el navegador |
| ↳ **ADR-005** (complementa ADR-002) | Tokens solo en el BFF; cookie HTTP-only; token de servicio + `X-User-Name`; sesión 30 min; logout bilateral | Sesión en Redis, cookie opaca `gf.sid` HttpOnly/SameSite=Lax/Secure; `ServiceTokenProvider` (client_credentials); `SESSION_TTL_SECONDS=1800` rolling; `POST /auth/logout` → `end_session` | BFF: cookie HttpOnly, `/auth/session` sin tokens, headers hacia microservicios, logout. Portal: sin `localStorage`/`sessionStorage` ni header `Authorization` |
| **ADR-003** MySQL + PostgreSQL portable | Modelo físico con DDL portable y anexo por motor | La persistencia es de los microservicios (`party-management-service` ya usa el DDL portable de `knowledge-base/architecture/data-model/ddl`). El portal y el BFF son **agnósticos al motor**: no contienen SQL, drivers ni configuración de BD, así que cambiar de motor no los afecta. Redis guarda solo sesiones efímeras, no datos de negocio | BFF: sin SQL ni dialectos, `env.ts` sin `DATABASE_URL`/`MYSQL`/`POSTGRES`. Portal: sin SQL ni referencias a motores |
| **ADR-004** HashiCorp Vault | Secretos y parametría sensible en Vault | `config/secrets.ts` lee KV v2: `secret/gestion-formacion/auth/keycloak` → `client_secret`; `secret/gestion-formacion/bff` → `session_secret`, `redis_url`. En **producción Vault es obligatorio** y el BFF no arranca si faltan secretos; en desarrollo se permite `.env` con aviso en el log. Los logs redactan cookies y `Authorization`. El portal no maneja secretos | BFF: producción sin Vault falla; lectura de ambas rutas con `X-Vault-Token`; Vault vacío en prod falla; sin secretos en código. Portal: sin secretos en código |

**Límites de esta conformidad (no lo cubre el scaffold):**

- ADR-003 se verifica en los microservicios, no aquí. party-management-service persiste en PDM-001 alineado (Q-11) con migraciones Alembic solo para PostgreSQL; MySQL necesita su propia rama de migraciones.
- ADR-004 deja abiertos el método de autenticación ante Vault (hoy token, Q-07) y si otros secretos (Classroom, Drive, GitLab, docsuite) van a Vault.
- La conformidad estática no reemplaza una prueba E2E del login contra un Keycloak real (próximo paso 3).

## 7. Cómo ejecutar en local

Todo como una unidad (detalle en `DOCKER_SETUP.md`, en la raíz del repositorio):

```bash
cd codebase
docker compose up -d --build     # postgres, mysql, redis, vault(+init), keycloak, party-service, bff, portal
# http://localhost:4200  →  login en Keycloak con jefe.ingenieria / Jefe.2026
```

El compose importa el realm de Keycloak (`infra/keycloak/`), siembra Vault (`infra/vault/`) y crea los
usuarios de base (`postgres-init.sh`). El portal corre en nginx (`apps/portal/Dockerfile`) con los remotes
en `/mfe/<nombre>/` y `/api`, `/auth` reenviados al BFF, todo en un mismo origen.

Para desarrollo con recarga en caliente: levantar solo la infraestructura con compose y correr
`npm run dev` (BFF) y `npm run start:all` (portal) desde el código.

Pruebas: `npm test` en `bff` (22: integración + conformidad ADR) y `npm test` + `npm run lint:arch` en `portal`.

## 8. Trazabilidad

| Elemento | Fuente |
|---|---|
| Shell + microUIs Angular, BFF Node.js intermediario | ADR-001 |
| Autenticación en el BFF con Keycloak y PKCE | ADR-002 |
| Tokens solo en el BFF, X-User-Name, sesión 30 min, logout bilateral | ADR-005 |
| Secretos en Vault | ADR-004 |
| Persistencia portable, fuera del portal y del BFF | ADR-003, ADR-007 |
| Microservicios en FastAPI | ADR-008 |
| Rutas por capacidad (/catalogo, /colaboradores) | ACP-002 §3.1 |
| Formato de error y paginación | API-SPEC-001 §4.1–4.2 |
| Shell, skip link, estados, sin pantalla de login propia | UXR-000, GEN-002 |
| Tokens, componentes y estados visuales | UI-INV-001 |

## 9. Decisiones tomadas en este scaffold (propuestas, requieren ADR o confirmación)

| ID | Propuesta | Motivo | Quién decide |
|---|---|---|---|
| D-01 | **Native Federation** como técnica de composición. **La propuesta [ADR-009](/knowledge-base/architecture/adrs/ADR-009-composicion-de-microuis-con-native-federation.md) fue rechazada** por `human:ianache` (2026-09-30): el portal la usa sin una decisión que la respalde | ADR-001 deja abierta la técnica | Arquitecto responsable |
| D-02 | Partición de microUIs **por capacidad** (catálogo, colaboradores; luego certificación, búsqueda, perfil…) | ACP-002 §3.1 | Arquitecto + Jefe de Ingeniería |
| D-03 | **Un solo BFF** para el portal web, con un router por dominio | ADR-001 lo dejó abierto; un solo canal hoy | Arquitecto responsable |
| D-04 | Cookie **opaca** + tokens en **Redis**, en lugar de guardar el JWT en la cookie | Un JWT de Keycloak suele superar 4 KB; permite revocar en el servidor. Cumple "nunca llegan al navegador" | Arquitecto de seguridad |
| D-05 | Renovación silenciosa con refresh token mientras la sesión de 30 min siga activa | ADR-005 dejó abierta la estrategia de refresh | Arquitecto de seguridad |
| D-06 | Workspace Angular único con libs por path mapping (sin Nx) | Menos herramientas; `@gf/ui` y `@gf/core` siguen siendo empaquetables como NPM | Tech Lead Frontend |
| D-07 | El BFF propaga también **`X-User-Roles`** (roles de realm del usuario) junto a `X-User-Name` | ADR-005 solo nombra `X-User-Name`, pero el servicio dueño de los datos necesita los roles para RBAC y visibilidad (UXR-000.5) sin consultar Keycloak. Mismo modelo de confianza: el header solo se acepta tras validar el token del BFF | Arquitecto de seguridad (enmendar ADR-005) |
| D-09 | El **límite de solicitudes** por usuario (API-SPEC-001 §4.5) lo aplica cada microservicio con la clave `X-User-Name`; el BFF solo reenvía `429`, `Retry-After` y `X-RateLimit-*` | SRC-001-001 pedía decidir quién lo implementa. Contadores en memoria por ahora (no compartidos entre réplicas) | Arquitecto de seguridad |
| D-10 | **Alembic es el dueño del esquema** de cada microservicio; Postgres solo crea usuarios y bases en initdb. La línea base es una copia exacta del DDL de PDM-001 | ASM-002 de DCP-002; evita dos fuentes del esquema (initdb y la aplicación) | Arquitecto de datos |
| D-08 | Issuer público `http://localhost:8080` en local; los servicios llaman a Keycloak por la red interna (`OIDC_INTERNAL_URL` en el BFF, `KEYCLOAK_JWKS_URL` en los microservicios) | Evita depender de `host.docker.internal` en el navegador | Arquitecto responsable |

## 10. Preguntas abiertas y discrepancias encontradas

| ID | Pregunta / discrepancia | Impacto | Responsable |
|---|---|---|---|
| Q-01 | ¿Qué técnica de composición se adopta, tras el rechazo de ADR-009? ¿Se confirma la partición por capacidad (D-02)? Si no es Native Federation, el portal se debe reestructurar (shell, remotos, `Dockerfile`, manifiesto) | Estructura del portal | Arquitecto |
| Q-02 | **API-SPEC-001 §2.1 dice "BFF stateless"**, pero ADR-005 exige que los tokens vivan solo en el BFF. El scaffold guarda la sesión en Redis (D-04) | Operación y escalado del BFF | Arquitecto de seguridad |
| Q-03 | La visibilidad por campo (P-08, BR-TRA-03…06): ¿la aplica el servicio dueño (hoy) o el BFF? | Dónde viven las reglas de privacidad | Arquitecto |
| ~~Q-04~~ | ~~Nombres de roles~~. **Resuelto 2026-09-30:** realm `gestion-formacion` con `colaborador`, `jefe_proyecto`, `evaluador`, `jefe_ingenieria`, `direccion`, `gerencia`, `admin`; party-service alineado. El alcance de ADMIN sigue en P-45 | — | Jefe de Ingeniería |
| Q-05 | No existe API-SPEC del catálogo. `CatalogApi` y `catalog.router.ts` usan paths supuestos | Integración de mfe-catalog | Arquitecto / api-designer |
| ~~Q-06~~ | ~~party-management-service no sigue ADR-005 ni API-SPEC-001~~. **Resuelto 2026-09-30:** valida el JWT del BFF (firma JWKS, `iss`, `azp`), usa `X-User-Name` para auditoría, paginación `{data, pagination, filters_applied}`, errores estándar, vista limitada/completa | — | Backend |
| ~~Q-12~~ | ~~ADR-008 vs BFF en Node.js~~. **Resuelto 2026-09-30:** [ADR-010](/knowledge-base/architecture/adrs/ADR-010-lenguaje-del-bff-nodejs.md) mantiene el BFF en Node.js; ADR-008 queda para los microservicios (reemplazado en parte). Justificación del decisor: [PENDIENTE] | — | Jefe de Ingeniería |
| ~~Q-11~~ | ~~party-service fuera del modelo físico~~. **Resuelto 2026-10-01:** el ORM usa las tablas de PDM-001 alineadas a STD-DB-001 (`tb_party`, `tb_person`, `tb_party_role`, `tb_party_identification`, `tb_contact_mechanism`, `tb_party_contact_mechanism`), creadas por Alembic. Siguen sin exponerse unidad, jefe directo, Rol-Nivel y vínculo con Keycloak (US-022); roles del programa e historial no tienen tabla en PDM-001 | — | Backend + Arquitecto de datos |
| Q-13 | **V003 y V004 (`ddl/migrations/portable/`) no corren sobre el DDL de PostgreSQL:** línea sin comentar en V003, columna no renombrada en `tb_contact_purpose_type`, `DROP CONSTRAINT` de UNIQUE con FK dependientes, columnas generadas que no existen en PostgreSQL y nombres de más de 63 caracteres. La migración `0002` del servicio los corrige; los scripts del modelo de datos siguen sin corregir | Fuente del modelo físico inconsistente | Arquitecto de datos |
| Q-07 | Método de autenticación del BFF ante Vault en QA/PROD (token, AppRole, Kubernetes) | Despliegue | DevOps |
| Q-08 | ACP-002 §2 y §4.2 todavía describen tokens en `sessionStorage` y el intercambio de código en el shell; ADR-005 lo reemplazó | Documentación desactualizada | Arquitecto |
| Q-09 | Navegación con varios roles (GEN-002-Q1), dispositivos (UXR-Q2) y design system corporativo (UXR-Q4) | Shell y `@gf/ui` | Responsable de producto |
| Q-10 | ¿Avisar antes de que venza la sesión? (ADR-005, "No se decidió") | UX de sesión | Producto / seguridad |

## 11. Próximos pasos sugeridos

1. ADR-009 (Native Federation) fue **rechazado**: definir la técnica de composición (Q-01). ~~Lenguaje del BFF (Q-12)~~: resuelto por ADR-010.
2. ~~Alinear party-management-service con ADR-005 (Q-06), roles (Q-04), modelo físico (Q-11), Alembic y límite de solicitudes~~ (hecho). Siguiente: ORGANIZATION (US-017, US-018) sobre `tb_organization` y `tb_party_relationship`, y corregir V003/V004 en el modelo de datos (Q-13).
3. ~~Realm de Keycloak de desarrollo y `bff`/`portal` en el `docker-compose.yml`~~ (hecho el 2026-09-30). Falta un E2E del login con Playwright contra el stack.
4. Agregar pruebas de accesibilidad automáticas (axe-core + Playwright) y E2E del login.
5. Construir los microUIs restantes de H1: certificación, búsqueda de candidatos, perfil y brecha.
