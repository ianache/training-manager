# Docker Compose — Plataforma de Gestión de Formación (entorno local completo)

Un solo `docker compose up` levanta **toda la plataforma**: infraestructura, microservicio, BFF y portal.
El archivo es `codebase/docker-compose.yml`. La arquitectura está en `codebase/apps/ARCHITECTURE.md`.

| Servicio | Imagen / build | Puerto host | Rol | ADR |
|---|---|---|---|---|
| `portal` | build `apps/portal` (nginx) | **4200** | Shell + microUIs (Native Federation); proxy `/api` y `/auth` al BFF | ADR-001 |
| `bff` | build `apps/bff` (Node 24) | 3000 | Único punto de entrada; OIDC + PKCE; sesión en Redis | ADR-001, 002, 005 |
| `party-service` | build `apps/domains/party-management-service` (FastAPI) | 8000 | Data maestra de Party | ADR-008 |
| `keycloak` | quay.io/keycloak/keycloak:22.0.5 | 8080 | Proveedor de identidad; importa el realm de desarrollo | ADR-002 |
| `vault` | hashicorp/vault:1.15.6 (modo dev) | 8200 | Secretos (KV v2 en `secret/`) | ADR-004 |
| `vault-init` | hashicorp/vault:1.15.6 | — | Siembra los secretos de desarrollo y termina | ADR-004 |
| `postgres` | postgres:15-alpine | 5432 | Bases `gestion_formacion` (app) y `keycloak` | ADR-003, 007 |
| `mysql` | mysql:8.0.35 | 3306 | Segundo motor del DDL portable (no lo usa la app en dev) | ADR-003 |
| `redis` | redis:7.2-alpine | 6379 | Sesiones del BFF (tokens del lado servidor) | ADR-005 |
| `adminer` | adminer | 8081 | UI para explorar las bases | — |

---

## Requisitos

- Docker Desktop (Windows/macOS) o Docker Engine ≥ 24 con Compose v2.
- ~6 GB de RAM libres para Docker y ~10 GB de disco.
- Puertos libres en el host: 4200, 3000, 8000, 8080, 5432, 3306, 6379, 8200, 8081.
  Keycloak se publica en `http://localhost:8080` (issuer público); los servicios lo llaman por la red
  interna (`http://keycloak:8080`). No hace falta editar el archivo `hosts`.

---

## Inicio rápido

```bash
cd UX_UI_agentic/codebase
docker compose -p codebase down -v --remove-orphans   # SOLO si alguna vez levantaste la versión anterior del compose
cp .env.example .env            # opcional: sobrescribe credenciales de desarrollo
docker compose up -d --build    # la primera vez compila portal, BFF y party-service (varios minutos)
docker compose ps               # esperar a que todo quede "healthy"; vault-init queda "exited (0)"
```

Abrir **http://localhost:4200** → redirige al login de Keycloak → iniciar sesión con un usuario de prueba:

| Usuario | Contraseña | Roles | Ve en el portal |
|---|---|---|---|
| `ana.colaboradora` | `Colaborador.2026` | colaborador | Mi desarrollo |
| `jefe.ingenieria` | `Jefe.2026` | colaborador, jefe_ingenieria | Mi desarrollo, Catálogo, Colaboradores |
| `admin.plataforma` | `Admin.2026` | colaborador, admin | Mi desarrollo, Colaboradores |

### Orden de arranque

```
postgres ─┬─> keycloak ─────────────┐
          └─> party-service ────────┤
redis ──────────────────────────────┼─> bff ──> portal
vault ──> vault-init (exit 0) ──────┘
mysql, adminer (independientes)
```

Cada flecha es un `depends_on` con `condition: service_healthy` (o `service_completed_successfully`
para `vault-init`). El BFF abre su puerto de inmediato y conecta Redis y Keycloak en segundo plano con
reintentos; `/health/ready` explica qué falta. nginx re-resuelve el DNS del BFF cada 10 s, así que un
reinicio del BFF no deja el portal en 502, y mientras el BFF no responde muestra "La plataforma está iniciando".

---

## Qué se configura automáticamente

| Qué | Dónde | Detalle |
|---|---|---|
| Esquema de Party en PostgreSQL | `apps/domains/party-management-service/migrations/` (Alembic) | `party-service` ejecuta `alembic upgrade head` al arrancar: PDM-001 + alineación STD-DB-001 (tablas `tb_*`). Postgres ya no carga DDL en initdb |
| DDL del modelo Party en MySQL | `knowledge-base/architecture/data-model/ddl/party-mysql.sql` | Se ejecuta al crear el volumen de MySQL (segundo motor; la app no lo usa en dev) |
| Usuarios de base | `codebase/postgres-init.sh` | `gestion_user` (app, sin superusuario) sobre `gestion_formacion`; `keycloak_user` dueño de la base `keycloak`. Idempotente |
| Realm de Keycloak | `codebase/infra/keycloak/realm-gestion-formacion.json` | Realm `gestion-formacion`, roles de la plataforma, cliente confidencial `bff-app` con PKCE S256 y service account, usuarios de prueba. Se importa solo si el realm no existe |
| Secretos en Vault | `codebase/infra/vault/seed-secrets.sh` | `secret/gestion-formacion/auth/keycloak` (`client_id`, `client_secret`), `secret/gestion-formacion/bff` (`session_secret`, `redis_url`), `secret/gestion-formacion/db/postgres` |
| Colaboradores de ejemplo | `party-service` con `SEED_DEMO_DATA=true` | 5 personas si no hay ninguna (solo desarrollo) |
| Manifiesto de federación | `apps/portal/docker/40-federation-manifest.sh` | Se genera al iniciar nginx con `PORTAL_PUBLIC_ORIGIN`; la misma imagen sirve en cualquier entorno |

El BFF **lee sus secretos de Vault** (`VAULT_ADDR=http://vault:8200`), no de variables de entorno: el
entorno local ejercita el mismo camino que QA/PROD (ADR-004).

---

## URLs y credenciales (solo desarrollo)

| Servicio | URL / conexión | Credenciales |
|---|---|---|
| Portal | http://localhost:4200 | usuarios de prueba |
| BFF | http://localhost:3000/health/ready | — |
| Party service | http://localhost:8000/docs | — |
| Keycloak admin | http://localhost:8080/admin | `admin` / `admin` |
| Vault UI | http://localhost:8200 | token `dev-root-token` |
| PostgreSQL | `localhost:5432` | app: `gestion_user` / `gestion_password` · admin: `postgres` / `postgres` |
| MySQL | `localhost:3306` | `gestion_user` / `gestion_password` · root: `rootpassword` |
| Redis | `localhost:6379` | `redis_password` |
| Adminer | http://localhost:8081 | las de cada base |

Todas se pueden cambiar en `codebase/.env` (ver `.env.example`). Si cambias `BFF_OIDC_CLIENT_SECRET`,
cambia también el `secret` del cliente `bff-app` en el realm (o en la consola de Keycloak).

---

## Trabajo diario

```bash
docker compose up -d --build bff            # recompilar y reiniciar solo el BFF
docker compose up -d --build portal         # idem para el portal
docker compose logs -f bff party-service    # seguir logs
docker compose stop                         # detener conservando datos
docker compose down                         # borrar contenedores (conserva volúmenes)
docker compose down -v                      # borrar TODO, incluidos los datos (vuelve a importar DDL y realm)
```

**Desarrollo con recarga en caliente:** levantar solo la infraestructura y correr portal/BFF desde el código:

```bash
docker compose up -d postgres redis vault vault-init keycloak party-service
cd apps/bff    && cp .env.example .env && npm run dev        # OIDC_ISSUER=http://localhost:8080/realms/gestion-formacion
cd apps/portal && npm run build:libs && npm run start:all    # proxy de /api y /auth a localhost:3000
```

---

## Datos y migraciones (ADR-003)

**PostgreSQL (lo que usa la app):** el esquema lo crea y versiona Alembic dentro de `party-service`
(revisiones `0001_pdm001_baseline` y `0002_std_db_001_alignment`). No ejecutes V003/V004 a mano
sobre PostgreSQL: no corren tal cual (ver `apps/domains/party-management-service/README.md` y Q-13).

```bash
docker compose exec party-service alembic current     # revisión aplicada
docker compose exec party-service alembic history     # revisiones disponibles
```

**MySQL (segundo motor, sin uso en dev):** el DDL se carga al crear su volumen. Para probar las
migraciones portables:

```bash
docker compose exec -T mysql mysql -u gestion_user -pgestion_password gestion_formacion \
  < ../knowledge-base/architecture/data-model/ddl/migrations/portable/V003__align-std-db-001-tablas.sql
docker compose exec -T mysql mysql -u gestion_user -pgestion_password gestion_formacion \
  < ../knowledge-base/architecture/data-model/ddl/migrations/portable/V004__align-std-db-001-constraints.sql
```

---

## Solución de problemas

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El login redirige a una URL inaccesible | Keycloak con un hostname distinto de `localhost` (versión anterior del compose) | `docker compose up -d keycloak bff` con el compose actual (`KC_HOSTNAME=localhost`) |
| `bff` queda *unhealthy* y el portal da **502 / "La plataforma está iniciando"** | El BFF no logra el discovery de Keycloak, no conecta a Redis o no lee Vault | Ver el motivo exacto: `docker compose exec bff wget -qO- http://127.0.0.1:3000/health/ready` (muestra `keycloak`/`redis` con su error) y `docker compose logs bff`. El BFF reintenta solo; al corregir la causa pasa a *healthy* sin reiniciar |
| Error de *issuer* en los logs del BFF | El issuer que publica Keycloak no coincide con `OIDC_ISSUER` | Deben ser iguales a `http://localhost:8080/realms/gestion-formacion` (`KC_HOSTNAME`/`KC_HOSTNAME_PORT` en Keycloak) |
| "Invalid redirect uri" en Keycloak | Se cambió el puerto del portal | Ajustar `redirectUris` del cliente `bff-app` y `PUBLIC_ORIGIN`/`OIDC_REDIRECT_URI` del BFF |
| Colaboradores muestra "rechazó la credencial de la plataforma" (502) | `party-service` rechazó el token del BFF: `KEYCLOAK_ISSUER` no coincide con el `iss` de Keycloak, o el JWKS no es accesible | `docker compose logs party-service`; el issuer debe ser `http://localhost:8080/realms/gestion-formacion` |
| Catálogo muestra "todavía no está disponible" (503) | `catalog-service` no existe aún | Esperado |
| `postgres` no crea usuarios | El volumen ya existía | `docker compose down -v` y volver a subir |
| `party-service` no arranca: *"volumen anterior a las migraciones con Alembic"* | El volumen de Postgres se creó cuando el DDL se cargaba en initdb (o con la tabla `tb_party` antigua) | `docker compose -p codebase down -v` y `docker compose up -d --build`. Borra los datos locales |
| Colaboradores muestra "Superaste el límite de … solicitudes" (429) | Límite por usuario de `party-service` (API-SPEC-001 §4.5) | Esperar el `Retry-After` o subir `RATE_LIMIT_READ_PER_HOUR` en el compose |
| `redis` (u otro servicio) no inicia: *container name already in use* o *port is already allocated* | Siguen vivos los contenedores de la versión anterior del compose (proyecto `codebase`, mismos puertos) o un Redis local en 6379 | `docker compose -p codebase down -v --remove-orphans` y volver a `docker compose up -d`. Si es un Redis local, detenerlo o cambiar el puerto host |
| `redis` queda *unhealthy* | Contraseña distinta entre `command` y healthcheck, o volumen viejo | `docker compose logs redis`; `docker compose exec redis redis-cli -a redis_password ping` debe responder `PONG` |
| Puerto ocupado | Otro proceso usa 4200/3000/8000/8080/5432/3306/6379/8200/8081 | Cambiar el puerto host en el compose |

> Si tienes carpetas vacías `codebase/codebase/postgres-init.sh/` o
> `codebase/knowledge-base/architecture/data-model/ddl/*.sql/`, las creó Docker por rutas de volumen
> incorrectas de la versión anterior del compose. Ya no se usan y se pueden borrar.

---

## Producción (NO es esta configuración)

Este compose es **solo para desarrollo**: Vault en modo dev (en memoria, token raíz fijo), HTTP sin TLS,
credenciales de ejemplo y Keycloak `start-dev`. En QA/PROD: Keycloak corporativo
(`oauth2.qa|prod.comsatel.com.pe`, ADR-005), Vault en alta disponibilidad con autenticación por
servicio (pendiente, ADR-004), TLS en todos los saltos, cookies `Secure` (`NODE_ENV=production`),
bases administradas con respaldo.

---

**Última actualización:** 2026-09-30 — compose unificado con portal, BFF y party-service.
