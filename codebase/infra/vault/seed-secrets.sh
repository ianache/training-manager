#!/bin/sh
# Siembra en Vault (KV v2, montado en secret/ por el modo dev) los secretos de desarrollo.
# Rutas según ACP-002 §2 y ADR-004. Idempotente: se ejecuta en cada `docker compose up`.
set -eu

echo "Esperando a Vault en ${VAULT_ADDR}..."
i=0
until vault status >/dev/null 2>&1; do
  i=$((i + 1)); [ "$i" -gt 30 ] && { echo "Vault no respondió"; exit 1; }
  sleep 1
done

vault kv put secret/gestion-formacion/auth/keycloak \
  client_id=bff-app \
  client_secret="${BFF_OIDC_CLIENT_SECRET}"

vault kv put secret/gestion-formacion/bff \
  session_secret="${BFF_SESSION_SECRET}" \
  redis_url="${REDIS_URL}"

vault kv put secret/gestion-formacion/db/postgres \
  host=postgres port=5432 user="${APP_DB_USER}" password="${APP_DB_PASSWORD}"

echo "Secretos de desarrollo sembrados en secret/gestion-formacion/{auth/keycloak,bff,db/postgres}"
