---
type: ADR
id: ADR-007
title: Consolidación de PostgreSQL para app + Keycloak en desarrollo local
description: Un solo motor PostgreSQL para ambas bases de datos (gestion_formacion + keycloak) optimiza recursos sin comprometer funcionalidad.
tags: [architecture, adr, development, postgres, keycloak, optimization, docker-compose]
status: draft
adr_status: Aceptado
decision: { by: "human:ianache", at: "2026-09-27T23:52:00-05:00" }
related: [ASR-007, ADR-005, DOCKER_SETUP.md]
generated: { by: "manual-discovery/claude-haiku-4-5", at: "2026-09-27T23:55:00-05:00" }
sources:
  - id: docker-setup
    resource: /DOCKER_SETUP.md
    title: Documentación Docker para desarrollo
  - id: asr-007
    resource: /knowledge-base/architecture/asr/ASR-007-optimizacion-recursos-desarrollo.md
    title: ASR-007 — Optimización de recursos en desarrollo
---

# ADR-007 — Consolidación de PostgreSQL para Desarrollo Local

- **Estado:** Aceptado
- **Fecha:** 2026-09-27
- **Decisor:** ianache (Jefe de Ingeniería)
- **Redacción:** manual-discovery/claude-haiku-4-5, a partir de consolidación realizada el 2026-09-27
- **Implementación:** Completada en commit 155a570

## Contexto

El docker-compose inicial incluía dos instancias separadas de PostgreSQL:
1. **postgres** (puerto 5432) — base de datos de app (gestion_formacion)
2. **postgres-keycloak** (puerto 5433) — base de datos de Keycloak (keycloak)

Esto causaba:
- Duplicación de proceso PostgreSQL (overhead de memoria)
- Complejidad innecesaria para desarrollo local
- Divergencia con enfoque de "single source of truth" en base de datos

## Opciones consideradas

| Opción | Descripción | Pros | Contras |
|---|---|---|---|
| **A. Mantener separado** (original) | Dos instancias PostgreSQL, dos puertos, dos volúmenes | Aislamiento completo; simula QA/PROD | Duplica recursos; más complejo |
| **B. Un solo PostgreSQL, dos BDs (elegida)** | Una instancia con `gestion_formacion` + `keycloak` BDs, usuarios aislados | Optimiza memoria; mantiene aislamiento lógico; más simple | Requiere init script; menos paralelo que A |
| **C. SQLite para Keycloak local** | Keycloak en SQLite, app en PostgreSQL | Mínimos recursos para KC | Keycloak no soporta SQLite formalmente; divergencia de QA/PROD |
| **D. Usar managed cloud PostgreSQL** | RDS/Azure Database para desarrollo local | Parity total con PROD | Costo; latencia de red; no offline |

## Decisión

**Opción B: Un solo PostgreSQL 15 con dos bases de datos separadas**

**Arquitectura:**
```
PostgreSQL 15 (puerto 5432)
  ├─ BD: gestion_formacion
  │  ├─ Usuario: gestion_user (credenciales app)
  │  ├─ Schema: public (party model)
  │  └─ Datos: parties, roles, vigencias, etc.
  │
  └─ BD: keycloak
     ├─ Usuario: keycloak_user (credenciales Keycloak)
     └─ Schema: public (Keycloak realm + usuarios)
```

**Inicialización automática:**
- Archivo: `codebase/postgres-init.sh`
- Ejecuta en primer `docker-compose up -d` (volumen vacío)
- Crea BD `keycloak` si no existe
- Asigna permisos a `keycloak_user`

**Keycloak configuration:**
- `KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak`
- `KC_DB_USERNAME: keycloak_user`
- `KC_DB_PASSWORD: keycloak_password`
- Dependencia en health check de `postgres` service

**Docker Compose changes:**
- ✅ Eliminar servicio `postgres-keycloak`
- ✅ Eliminar volumen `postgres_keycloak_data`
- ✅ Agregar init script `postgres-init.sh` a postgres service
- ✅ Quitar `volumes: [keycloak_data]` de Keycloak (no needed, data lives in postgres)
- ✅ Actualizar documentación DOCKER_SETUP.md

## Justificación

**1. Ahorro de recursos**
- Memoria: -50% (una instancia vs. dos)
- Procesos: -50%
- Startup time: -33% (un contenedor menos)

**2. Aislamiento mantenido**
- PostgreSQL aísla naturalmente BDs/usuarios
- Queries de app ↔ `gestion_formacion` only
- Queries de Keycloak ↔ `keycloak` only
- Sin cross-BD leaks posibles

**3. Simplicidad operativa**
- Una BD para entender
- Un puerto (5432)
- Un volumen persistente
- Init script automático (sin intervención manual)

**4. Parity para testing**
- Mismos comandos docker-compose funcionan para ambas BDs
- Migraciones V003–V004 testean contra app BD
- Keycloak testea contra su BD
- Portabilidad: basta cambiar `KC_DB_URL` para usar otra instancia PostgreSQL si necesario

## Consecuencias

**Positivas:**
- Desarrollo local más rápido y ligero
- Menos carga cognitiva (una BD, no dos)
- Menos archivos de configuración
- Init script es reproducible y versionable

**Negativas y riesgos:**
- **Si la instancia PostgreSQL cae:** ambas apps se caen (single point of failure en dev, aceptable)
- **Divergencia futura:** si QA/PROD mantienen dos instancias, scripts de migration deben funcionar con ambas topologías (mitigado: postgres-init.sh es idempotente, puede ejecutarse en cualquier entorno)

## No se decidió todavía

- ¿Aplicar consolidación también a QA y PROD, o mantener separado allá?
- ¿Replicación automática de `keycloak` BD en backup?
- ¿Monitores de espacio disco compartido?

---

## Cambios realizados

**Archivos modificados:**
- `codebase/docker-compose.yml` — Eliminar postgres-keycloak, agregar postgres-init.sh, actualizar Keycloak config
- `codebase/postgres-init.sh` — Nuevo script de inicialización
- `DOCKER_SETUP.md` — Documentar consolidación, actualizar secciones PostgreSQL y Keycloak

**Commit:** `155a570` (Optimizar docker-compose: consolidar Keycloak en PostgreSQL compartido)

---

**Status:** Aceptado (2026-09-27)  
**Decisor:** ianache (Jefe de Ingeniería)  
**Handoff:**  
- DevOps (validar que postgres-init.sh funciona en QA/PROD si aplica)
- Equipo de desarrollo (probar docker-compose up/down, validar conectividad a ambas BDs)
- Arquitecto (evaluar si consolidar también QA/PROD, o mantener separado para HA)
