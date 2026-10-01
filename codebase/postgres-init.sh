#!/bin/bash
# postgres-init.sh — se ejecuta una sola vez, cuando el volumen postgres_data está vacío.
# El esquema de partes NO se crea aquí: lo crea Alembic al arrancar party-service.
#
# Crea:
#   - gestion_user: usuario de la aplicación sobre gestion_formacion (no superusuario)
#   - keycloak_user + base keycloak: base separada para Keycloak (ADR-007)
set -euo pipefail

: "${APP_DB_USER:=gestion_user}"
: "${APP_DB_PASSWORD:=gestion_password}"
: "${KEYCLOAK_DB_PASSWORD:=keycloak_password}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v app_user="$APP_DB_USER" -v app_pass="$APP_DB_PASSWORD" -v kc_pass="$KEYCLOAK_DB_PASSWORD" <<-'EOSQL'
    -- Usuario de la aplicación
    SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'app_user', :'app_pass')
      WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'app_user') \gexec
    SELECT format('GRANT CONNECT, TEMPORARY ON DATABASE gestion_formacion TO %I', :'app_user') \gexec
    SELECT format('GRANT USAGE, CREATE ON SCHEMA public TO %I', :'app_user') \gexec
    SELECT format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO %I', :'app_user') \gexec
    SELECT format('GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO %I', :'app_user') \gexec
    SELECT format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO %I', :'app_user') \gexec
    SELECT format('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO %I', :'app_user') \gexec

    -- Usuario y base de Keycloak
    SELECT format('CREATE ROLE keycloak_user LOGIN PASSWORD %L', :'kc_pass')
      WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'keycloak_user') \gexec
    SELECT 'CREATE DATABASE keycloak OWNER keycloak_user'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak') \gexec
EOSQL

echo "PostgreSQL inicializado: ${APP_DB_USER} sobre gestion_formacion y base keycloak"
