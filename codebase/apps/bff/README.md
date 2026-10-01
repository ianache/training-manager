# BFF — Node.js 22+ / Express 5

Único punto de entrada del portal hacia los microservicios (ADR-001). Autentica con Keycloak
mediante Authorization Code + PKCE y guarda los tokens del lado servidor (ADR-002, ADR-005).
Ver [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Endpoints

| Método y ruta | Sesión | Descripción |
|---|---|---|
| `GET /health/live`, `GET /health/ready` | No | Probes |
| `GET /auth/login?returnTo=` | No | Inicia PKCE, 302 a Keycloak |
| `GET /auth/callback` | No | Canjea el código, crea la sesión |
| `GET /auth/session` | Sí | Usuario y roles (sin tokens) |
| `POST /auth/logout` | Sí + CSRF | Cierre bilateral |
| `/api/v1/parties[/:id]` | Sí | → party-management-service |
| `/api/v1/catalog/roles[/:id]` | Sí | → catalog-service (503 hasta que exista) |

Toda escritura exige el header `X-XSRF-TOKEN` igual a la cookie `XSRF-TOKEN`.
Los errores salen con el formato de API-SPEC-001 §4.2.

## Secretos (ADR-004)

En producción el BFF **no arranca** sin Vault. Lee del motor KV v2:

| Ruta | Claves |
|---|---|
| `secret/gestion-formacion/auth/keycloak` | `client_secret` |
| `secret/gestion-formacion/bff` | `session_secret` (32+ caracteres), `redis_url` |

En desarrollo, si `VAULT_ADDR` está vacío, usa `.env` y lo advierte en el log.

## Comandos

```bash
cp .env.example .env
npm install
npm run dev        # tsx watch, :3000
npm test           # vitest + supertest (incluye conformidad con ADR-001…005)
npm run build && npm start
```

## Agregar un dominio

1. Crear `src/modules/<dominio>/<dominio>.router.ts` que reciba un `ServiceClient`.
2. Agregar `<DOMINIO>_SERVICE_URL` a `config/env.ts` y `.env.example`.
3. Montarlo en `app.ts` bajo `api.use('/<dominio>', …)`, con `requireAnyRole` en las escrituras.
4. Cubrir en `test/` el RBAC y la propagación de `X-User-Name`.
