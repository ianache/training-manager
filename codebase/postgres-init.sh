#!/bin/bash
# postgres-init.sh
# Inicializa Keycloak en el mismo PostgreSQL que la app
# Ejecutado durante docker-compose up si el volumen postgres_data está vacío

set -e

# Crear usuario y base de datos para Keycloak
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Crear usuario para Keycloak si no existe
    DO
    \$do\$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'keycloak_user') THEN
        CREATE USER keycloak_user WITH PASSWORD 'keycloak_password';
      END IF;
    END
    \$do\$;

    -- Crear base de datos keycloak
    CREATE DATABASE keycloak
      OWNER keycloak_user
      TEMPLATE template0
      LC_COLLATE 'en_US.UTF-8'
      LC_CTYPE 'en_US.UTF-8';

    -- Asignar permisos
    GRANT CONNECT ON DATABASE keycloak TO keycloak_user;
    GRANT USAGE ON SCHEMA public TO keycloak_user;
    GRANT CREATE ON SCHEMA public TO keycloak_user;

    -- Crear base de datos gestion_formacion si no existe (redundancia de seguridad)
    CREATE DATABASE IF NOT EXISTS gestion_formacion
      OWNER gestion_user
      TEMPLATE template0
      LC_COLLATE 'en_US.UTF-8'
      LC_CTYPE 'en_US.UTF-8';

    GRANT CONNECT ON DATABASE gestion_formacion TO gestion_user;
    GRANT USAGE ON SCHEMA public TO gestion_user;
    GRANT CREATE ON SCHEMA public TO gestion_user;
EOSQL

echo "✅ PostgreSQL initialized for Keycloak and app"
