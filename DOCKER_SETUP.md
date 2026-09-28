# Docker Compose Setup — Gestion de Formacion

Configuración de desarrollo local con los servicios básicos requeridos por la arquitectura:

- **MySQL 8.0.16+** — Base de datos principal (Party model)
- **PostgreSQL 12+** — Base de datos alternativa (testing portabilidad)
- **Keycloak 22+** — Autenticación e identidad (ADR-002)
- **Redis 7.2** — Cache de sesiones y colas de trabajos
- **HashiCorp Vault** — Gestión de secretos y parámetros (ADR-004, D22)
- **Adminer** — UI web para explorar MySQL/PostgreSQL (opcional)

---

## Requisitos

- **Docker** ≥ 20.10
- **Docker Compose** ≥ 2.0
- **Espacio en disco** ≥ 10 GB (para volúmenes de datos)

Verificar:
```bash
docker --version
docker-compose --version
```

---

## Quick Start

### 1. Iniciar todos los servicios

```bash
cd /path/to/UX_UI_agentic/codebase
docker-compose up -d
```

Verificar que todos estén corriendo:
```bash
docker-compose ps
```

**Esperado:**
```
CONTAINER ID   IMAGE                              STATUS           PORTS
...
mysql          mysql:8.0.35                       Up (healthy)     0.0.0.0:3306->3306/tcp
postgres       postgres:15-alpine                 Up (healthy)     0.0.0.0:5432->5432/tcp
keycloak       quay.io/keycloak/keycloak:22.0.5  Up (healthy)     0.0.0.0:8080->8080/tcp
redis          redis:7.2-alpine                   Up (healthy)     0.0.0.0:6379->6379/tcp
vault          vault:1.15.6                       Up (healthy)     0.0.0.0:8200->8200/tcp
adminer        adminer:latest                     Up (running)     0.0.0.0:8081->8080/tcp
```

---

## Conexiones y Credenciales

### MySQL
- **URL:** `localhost:3306`
- **Database:** `gestion_formacion`
- **User:** `gestion_user`
- **Password:** `gestion_password`
- **Root password:** `rootpassword`

**Conexión desde Node.js (BFF):**
```javascript
const mysql = require('mysql2/promise');
const connection = await mysql.createConnection({
  host: 'mysql',      // dentro de docker-compose
  user: 'gestion_user',
  password: 'gestion_password',
  database: 'gestion_formacion'
});
```

### PostgreSQL
- **URL:** `localhost:5432`
- **Database:** `gestion_formacion`
- **User:** `gestion_user`
- **Password:** `gestion_password`

**Conexión desde Node.js:**
```javascript
const pg = require('pg');
const client = new pg.Client({
  host: 'postgres',   // dentro de docker-compose
  port: 5432,
  database: 'gestion_formacion',
  user: 'gestion_user',
  password: 'gestion_password'
});
```

### Keycloak (Autenticación PKCE)
- **Admin URL:** http://localhost:8080/admin
- **Realm URL:** http://localhost:8080/realms/gestion-formacion
- **Admin User:** `admin`
- **Admin Password:** `admin`

**Inicialización (primera vez):**
1. Abrir http://localhost:8080/admin
2. Login con admin/admin
3. Crear realm: `gestion-formacion`
4. Crear client: `bff-app`
   - Enable PKCE
   - Redirect URIs: `http://localhost:4200/*` (Angular shell)
   - Post Logout Redirect URIs: `http://localhost:4200/login`
5. Crear usuarios de prueba (opcional)

**Integración con BFF (Node.js, ADR-002):**
```javascript
// BFF obtiene JWT con su propia cuenta de servicio
const axios = require('axios');
const token = await axios.post(
  'http://keycloak:8080/realms/gestion-formacion/protocol/openid-connect/token',
  new URLSearchParams({
    client_id: 'bff-app',
    client_secret: 'your-client-secret',
    grant_type: 'client_credentials'
  })
);
```

### Redis (Session Cache)
- **URL:** `localhost:6379`
- **Password:** `redis_password`
- **Database:** 0 (default)

**Conexión desde Node.js (BFF):**
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: 'redis',
  port: 6379,
  password: 'redis_password'
});
```

### HashiCorp Vault (Secrets Management)
- **URL:** http://localhost:8200
- **Dev mode:** Automáticamente unsealed
- **Root token:** Impreso en logs

```bash
docker-compose logs vault | grep "Root Token"
```

**Integración (ADR-004, D22):**
```bash
# Login
vault login <root-token>

# Guardar secretos
vault kv put secret/gestion/gmail \
  email=your-email@gmail.com \
  password=your-app-password

vault kv put secret/gestion/bff-service-account \
  client_id=bff-app \
  client_secret=your-secret
```

**Desde Node.js:**
```javascript
const VaultClient = require('node-vault');
const vault = new VaultClient({
  endpoint: 'http://vault:8200',
  token: process.env.VAULT_TOKEN
});

const secret = await vault.read('secret/data/gestion/gmail');
```

### Adminer (Web UI)
- **URL:** http://localhost:8081
- Permite explorar MySQL y PostgreSQL desde navegador
- Select database, enter credentials, browse tables

---

## Datos Iniciales

### Cargar DDL (Modelo Party)

**MySQL:**
```bash
docker-compose exec mysql mysql \
  -u gestion_user -pgestion_password \
  gestion_formacion < knowledge-base/architecture/data-model/ddl/party-mysql.sql
```

**PostgreSQL:**
```bash
docker-compose exec postgres psql \
  -U gestion_user -d gestion_formacion \
  -f /docker-entrypoint-initdb.d/01-party-model.sql
```

El DDL se carga automáticamente al iniciar el contenedor (en `docker-entrypoint-initdb.d/`).

---

## Testing de Migraciones

Las migraciones V003 y V004 (alineación STD-DB-001) pueden ser testeadas en ambos motores:

**MySQL:**
```bash
docker-compose exec mysql mysql \
  -u gestion_user -pgestion_password \
  gestion_formacion < knowledge-base/architecture/data-model/ddl/migrations/portable/V003__align-std-db-001-tablas.sql

docker-compose exec mysql mysql \
  -u gestion_user -pgestion_password \
  gestion_formacion < knowledge-base/architecture/data-model/ddl/migrations/portable/V004__align-std-db-001-constraints.sql
```

**PostgreSQL:**
```bash
docker-compose exec postgres psql \
  -U gestion_user -d gestion_formacion \
  -f knowledge-base/architecture/data-model/ddl/migrations/portable/V003__align-std-db-001-tablas.sql

docker-compose exec postgres psql \
  -U gestion_user -d gestion_formacion \
  -f knowledge-base/architecture/data-model/ddl/migrations/portable/V004__align-std-db-001-constraints.sql
```

---

## Validación de Servicios

### Health Checks

Todos los servicios tienen health checks configurados:

```bash
# Ver estado de health
docker-compose ps

# Ver logs de un servicio
docker-compose logs <service-name>

# Ejemplos:
docker-compose logs mysql
docker-compose logs keycloak
docker-compose logs vault
```

### Verificar conectividad

**Desde host:**
```bash
# MySQL
mysql -h localhost -P 3306 -u gestion_user -pgestion_password gestion_formacion -e "SELECT 1;"

# PostgreSQL
psql -h localhost -p 5432 -U gestion_user -d gestion_formacion -c "SELECT 1;"

# Keycloak
curl http://localhost:8080/health

# Redis
redis-cli -h localhost -p 6379 -a redis_password ping

# Vault
curl http://localhost:8200/v1/sys/health
```

---

## Development Workflow

### 1. Iniciar entorno
```bash
docker-compose up -d
```

### 2. Esperar health checks
```bash
# Esperar a que todos estén healthy (5-30 segundos)
docker-compose ps

# Ver logs si algo no inicia
docker-compose logs
```

### 3. Configurar Keycloak (primera vez)
```bash
# Admin console
open http://localhost:8080/admin
# Login: admin / admin
# Create realm, client, users
```

### 4. Inicializar Vault (primera vez)
```bash
# Ver root token
docker-compose logs vault | grep "Root Token"

# Login
vault login <root-token>

# Guardar credenciales necesarias
vault kv put secret/gestion/gmail email=... password=...
```

### 5. Cargar DDL
```bash
docker-compose exec mysql mysql \
  -u gestion_user -pgestion_password \
  gestion_formacion < knowledge-base/architecture/data-model/ddl/party-mysql.sql
```

### 6. Ejecutar migraciones de testing
```bash
# Alineación STD-DB-001
docker-compose exec mysql mysql \
  -u gestion_user -pgestion_password \
  gestion_formacion < knowledge-base/architecture/data-model/ddl/migrations/portable/V003__align-std-db-001-tablas.sql

docker-compose exec mysql mysql \
  -u gestion_user -pgestion_password \
  gestion_formacion < knowledge-base/architecture/data-model/ddl/migrations/portable/V004__align-std-db-001-constraints.sql
```

### 7. Conectar desde BFF (Node.js)
```javascript
// environment variables
process.env.DB_HOST = 'mysql';      // 'localhost' si está en otra container
process.env.DB_PORT = 3306;
process.env.DB_USER = 'gestion_user';
process.env.DB_PASSWORD = 'gestion_password';
process.env.DB_NAME = 'gestion_formacion';

process.env.KEYCLOAK_URL = 'http://keycloak:8080';
process.env.REDIS_HOST = 'redis';
process.env.VAULT_ADDR = 'http://vault:8200';
```

---

## Parar y Limpiar

```bash
# Parar servicios (conservar volúmenes)
docker-compose stop

# Reiniciar
docker-compose start

# Parar y remover containers (conservar volúmenes)
docker-compose down

# Parar, remover containers y volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Remover imágenes también
docker-compose down -v --rmi all
```

---

## Troubleshooting

### Servicio no inicia

```bash
# Ver logs completos
docker-compose logs <service-name>

# Ver últimas 50 líneas
docker-compose logs --tail=50 <service-name>

# Seguir logs en vivo
docker-compose logs -f <service-name>
```

### Puerto ya en uso

Si Puerto 3306, 5432, 8080, 6379, 8200, 8081 ya está en uso, editar `docker-compose.yml`:

```yaml
mysql:
  ports:
    - "3307:3306"  # cambiar puerto host
```

### Keycloak no inicia

Keycloak necesita PostgreSQL. Esperar a que postgres esté healthy:

```bash
docker-compose logs postgres
docker-compose logs keycloak
```

Reintentar:
```bash
docker-compose restart keycloak
```

### Base de datos corrupta

Limpiar todo y reiniciar:
```bash
docker-compose down -v
docker-compose up -d
```

---

## Producción (NOT THIS SETUP)

⚠️ Esta configuración es SOLO PARA DESARROLLO.

Para producción:
- Usar managed databases (AWS RDS, Azure Database, Google Cloud SQL)
- Keycloak: Desplegar en Kubernetes o VM con TLS, respaldo de BD
- Redis: Usar managed Redis (AWS ElastiCache, Azure Cache)
- Vault: Usar Vault en Alta Disponibilidad con Raft o Consul backend
- No usar volúmenes locales; usar persistent storage
- Configurar backups automáticos
- Monitoreo y alertas

---

## Referencias

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [MySQL 8.0 Docs](https://dev.mysql.com/doc/)
- [PostgreSQL 15 Docs](https://www.postgresql.org/docs/15/)
- [Keycloak Admin Guide](https://www.keycloak.org/docs/latest/server_admin/)
- [Redis Docs](https://redis.io/documentation)
- [HashiCorp Vault Docs](https://www.vaultproject.io/docs)

---

**Última actualización:** 2026-09-27
**Generado por:** Docker setup automation
