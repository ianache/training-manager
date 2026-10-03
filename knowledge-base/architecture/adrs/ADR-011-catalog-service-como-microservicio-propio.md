---
type: ADR
id: ADR-011
title: El catálogo de roles y competencias se implementa como un microservicio propio (catalog-service)
description: Se propone un catalog-service en FastAPI con esquema propio en el PostgreSQL común, al que solo llama el BFF y que party referencia por identificadores lógicos.
tags: [architecture, adr, catalogo, microservicio, fastapi, postgresql]
status: draft
adr_status: Propuesto
related: [ADR-001, ADR-006, ADR-007, ADR-008, ADR-010, LDM-001, LDM-002, DSP-001, BR-CAT-04, BR-CAT-22]
generated: { by: "architecture-adr-writer/claude-sonnet-5-5", at: "2026-10-03T22:30:00-05:00" }
sources:
  - id: ldm-002
    resource: /knowledge-base/architecture/data-model/LDM-002-modelo-de-datos-del-catalogo.md
    title: LDM-002 — Modelo de datos del catálogo
  - id: ldm-001
    resource: /knowledge-base/architecture/data-model/LDM-001-modelo-logico-de-partes.md
    title: LDM-001 — Modelo lógico de partes
  - id: dsp-001
    resource: /knowledge-base/requirement/scope-packs/DSP-001-catalogo-de-roles-y-niveles.md
    title: DSP-001 — Catálogo de roles y niveles
  - id: adr-008
    resource: /knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md
    title: ADR-008 — Python + FastAPI como estándar para APIs REST
  - id: adr-007
    resource: /knowledge-base/architecture/adrs/ADR-007-consolidacion-postgresql-desarrollo.md
    title: ADR-007 — Consolidación de PostgreSQL para desarrollo local
  - id: adr-006
    resource: /knowledge-base/architecture/adrs/ADR-006-criterios-upgrade-rol-nivel.md
    title: ADR-006 — Criterios y actores para upgrade de Rol-Nivel
---

# ADR-011 — catalog-service como microservicio propio

- **Estado:** Propuesto
- **Fecha:** 2026-10-03
- **Decisor:** [PENDIENTE: arquitecto responsable]
- **Redacción:** architecture-adr-writer/claude-sonnet-5-5, a partir de una propuesta del agente, sin decisión humana. Falta que un humano revise el texto: no hay `verified`
- **ASR relacionados:** ninguno aprobado; los candidatos del catálogo ASR no tienen disposición humana
- **Depende de / Reemplaza a:** [ADR-008](/knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md) (estándar de microservicios) y [ADR-007](/knowledge-base/architecture/adrs/ADR-007-consolidacion-postgresql-desarrollo.md) (PostgreSQL común). No reemplaza a ninguno.

## Contexto

- LDM-001 ya parte de que el catálogo de Rol-Nivel **lo posee otro servicio** y que party lo referencia con ids lógicos, sin clave foránea (LDM-001 §1 y DM-07).
- Ese servicio no existe: el BFF responde 503 en `/api/v1/catalog/*` y el paso «Rol-Nivel inicial» del asistente de alta usa hoy un `catalog-stub` solo de desarrollo.
- DSP-001 acota el alcance (US-001 y US-019) y LDM-002 define el modelo de datos, con 7 tablas.
- ADR-008 fija Python/FastAPI para los microservicios; ADR-007 consolida el PostgreSQL de desarrollo.

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. No hay decisor que las registrara.

1. **Dentro del party-service.** Una sola base y despliegue. Mezcla dos dominios con dueños y ritmos distintos y contradice LDM-001 §1.
2. **catalog-service propio (propuesta).** Separa el dominio y deja que cada servicio evolucione y se despliegue por su cuenta. Cuesta un servicio más y las referencias entre servicios son lógicas, no físicas.
3. **Mantener el stub.** Sin coste, pero no cubre BR-CAT, versiones ni permisos; no sirve más allá del desarrollo.

## Decisión (propuesta del agente, sin decisión humana)

| Aspecto | Propuesta |
|---|---|
| Servicio | `catalog-service`, nuevo, con Python 3.11+ y FastAPI (ADR-008) |
| Datos | Las 7 tablas de LDM-002, en un esquema propio del PostgreSQL común (ADR-007); migraciones propias con Alembic, como party |
| Acceso | Solo el BFF lo llama, con el token de servicio, como party. El portal no lo ve (variable `CATALOG_SERVICE_URL` del BFF, hoy vacía) |
| Referencias | Party, certificación y requerimientos guardan ids lógicos: rol, Rol-Nivel y **versión** de competencia (LDM-002 §4) |
| Autorización | El servicio vuelve a validar el rol del usuario (BR-CAT-04, BR-CAT-05, versiones: Jefe de Ingeniería o ADMIN), como party |

**Justificación:** [PENDIENTE]. No hay decisor.

**Argumentos del agente (no son del decisor):**
- Respeta lo que LDM-001 ya asume y evita rehacer party.
- Las versiones de competencia (R-46) y sus reglas son un dominio con vida propia.

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- Si el catalog-service comparte instancia de PostgreSQL con party o tiene la suya (aquí se supone la misma, por ADR-007).
- ~~Si la aprobación deja la anterior en DEPRECATED y si se desactiva o se elimina~~ **Resuelto el 2026-10-03** (DM-Q-02, DM-Q-03 de LDM-002): la anterior pasa a DEPRECATED, solo se aprueba desde DRAFT y solo se desactiva (BR-CAT-24, BR-CAT-25).
- ~~Que ADR-006 y las decisiones del 2026-10-03 sean coherentes~~ **Resuelto el 2026-10-03** (DM-Q-04): el rol ADMIN es correcto; ADR-006 se enmienda (BR-CAT-26).
- Qué hace party si el catálogo no responde (degradación del alta); no hay ASR que fije disponibilidad.

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica.

## Consecuencias

**Positivas:**
- Cierra el 503 del catálogo y permite retirar el `catalog-stub`.
- El modelo de LDM-002 tiene un dueño claro.

**Negativas y riesgos:**
- Un servicio más que desplegar, monitorear y proteger en el compose.
- Sin clave foránea física entre servicios, un id de catálogo en party puede quedar huérfano si se desactiva un rol: hace falta una regla (desactivar, no eliminar).
- Consistencia eventual entre catálogo y party en las asignaciones de Rol-Nivel.

**Impacto en pruebas:**
- Pruebas de contrato entre el BFF y el servicio, e integración con PostgreSQL real: SQLite no habría detectado el orden de INSERT ni la longitud de la revisión de Alembic que sí fallaron en party.
- La API-SPEC del catálogo debe traducirse a pruebas de CHK-A a CHK-D de LDM-002 §5.
