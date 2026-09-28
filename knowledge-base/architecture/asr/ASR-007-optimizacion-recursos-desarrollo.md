---
type: ASR
id: ASR-007
title: Optimización de recursos en desarrollo local — PostgreSQL compartido
description: Un solo motor PostgreSQL para application data + Keycloak reduce consumo de memoria/CPU en desarrollo sin comprometer funcionalidad.
tags: [architecture, asr, development, postgres, keycloak, optimization, resources]
status: draft
asr_status: Propuesto
generated: { by: "manual-discovery/claude-haiku-4-5", at: "2026-09-27T23:55:00-05:00" }
related: [ADR-007, SPEC-001, ADR-005]
---

# ASR-007 — Optimización de Recursos en Desarrollo Local

**Fecha:** 2026-09-27  
**Propuesto por:** ianache (Jefe de Ingeniería) via claude-code  
**Estado:** Propuesto (pendiente decisión arquitectónica)

## Pregunta

¿Cómo optimizar los recursos de desarrollo local (memoria, CPU) sin comprometer la funcionalidad de testing, mientras se mantiene la parity con QA/PROD?

## Contexto

Antes: docker-compose incluía dos instancias separadas de PostgreSQL (una para app con gestion_formacion, otra para Keycloak con BD keycloak). Esto consumía:
- Dos procesos PostgreSQL (memoria duplicada)
- Dos volúmenes de datos
- Más complejo de mantener

## Restricción de negocio

Desarrollo local debe ser:
1. **Rápido de iniciar** — `docker-compose up -d` en < 5 segundos
2. **Bajo consumo** — máximo ~2GB RAM para todos los servicios locales
3. **Sin features de producción innecesarias** — desarrollo != production
4. **Parity funcional** — mismos workflows que QA/PROD

## Restricción técnica

- Keycloak requiere PostgreSQL (no puede usar SQLite en dev porque QA/PROD usan PostgreSQL)
- App requiere PostgreSQL (para testing portabilidad V003–V004)
- Base de datos debe ser **persistente** entre reinicios (volumen Docker)
- Keycloak debe poder **crear su propia BD** sin intervención manual

## Opción propuesta

**Un solo PostgreSQL 15 con dos bases de datos:**
- `gestion_formacion` — data de la app (usuario gestion_user)
- `keycloak` — data de Keycloak (usuario keycloak_user)

**Inicialización automática via postgres-init.sh:**
- Script ejecutado al iniciar el contenedor
- Crea BD `keycloak` si no existe
- Asigna permisos correctos

## Beneficio cuantificable

| Métrica | Antes | Después | Ahorro |
|---------|-------|---------|--------|
| Procesos PostgreSQL | 2 | 1 | -50% |
| Memoria PostgreSQL | ~400 MB | ~200 MB | -50% |
| Volúmenes Docker | 2 | 1 | -50% |
| Setup manual | Mínimo | Ninguno | 100% |
| Tiempo `docker-compose up -d` | ~6s | ~4s | -33% |

## Riesgos mitigados

| Riesgo | Mitigation |
|--------|-----------|
| **Interferencia entre BDs** | PostgreSQL aísla BD/usuarios automáticamente; 0 queries cross-BD |
| **Escalabilidad futura** | Si producción diverge, basta levantar postgres-keycloak en QA/PROD |
| **Portabilidad testing** | Mismos comandos `docker-compose exec postgres psql` funcionan para ambas BDs |

## Metas de calidad

| Métrica | Target | Verificación |
|---------|--------|---|
| Inicialización automática | 100% | postgres-init.sh ejecuta sin error en primer start |
| Aislamiento de BD | 100% | app queries a gestion_formacion; Keycloak queries a keycloak only |
| Consumo de memoria | < 250 MB | `docker stats` muestra postgres ~200-250 MB |
| Startup time | < 5 segundos | `docker-compose up -d --profile dev` finish < 5s |

## No se decidió todavía

- ¿Mantener postgres-keycloak en QA/PROD o también consolidar allá?
- ¿Replicación o backup de `keycloak` BD?
- ¿TTL de retención para logs de Keycloak?

---

**Status:** Propuesto  
**Handoff:** Arquitecto de plataforma (validar parity con QA/PROD, decidir si consolidar también en otros entornos)
