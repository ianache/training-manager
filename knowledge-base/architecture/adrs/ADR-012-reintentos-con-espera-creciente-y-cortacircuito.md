---
type: ADR
id: ADR-012
title: Las llamadas a servicios downstream reintentan con espera creciente antes de abrir un cortacircuito
description: Por disponibilidad, el BFF reintenta las peticiones fallidas al catalog-service con tiempos crecientes entre intentos y, agotados, abre un cortacircuito (circuit breaker).
tags: [architecture, adr, disponibilidad, reintentos, circuit-breaker, bff, catalog-service]
status: draft
adr_status: Aceptado
decision: { by: human:ianache, at: 2026-10-04T00:00:00-05:00 }
related: [ADR-011, ADR-010, ADR-005, LDM-002, API-SPEC-003]
generated: { by: "architecture-adr-writer/claude-sonnet-5-5", at: "2026-10-04T00:30:00-05:00" }
sources:
  - id: adr-011
    resource: /knowledge-base/architecture/adrs/ADR-011-catalog-service-como-microservicio-propio.md
    title: ADR-011 — catalog-service como microservicio propio
  - id: api-spec-003
    resource: /knowledge-base/architecture/api/API-SPEC-003-catalogo-de-roles-y-competencias.md
    title: API-SPEC-003 — Catálogo de roles y competencias
---

# ADR-012 — Reintentos con espera creciente y cortacircuito

- **Estado:** Aceptado
- **Fecha:** 2026-10-04
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-sonnet-5-5, a partir de la decisión. Falta que un humano revise el texto: no hay `verified`
- **ASR relacionados:** ninguno aprobado; sin métrica de disponibilidad
- **Depende de / Reemplaza a:** [ADR-011](/knowledge-base/architecture/adrs/ADR-011-catalog-service-como-microservicio-propio.md). No reemplaza a ninguno.

## Contexto

- ADR-011 crea el `catalog-service`, un servicio más al que el BFF llama, y dejó abierto qué hace el alta de colaboradores si el catálogo no responde.
- Hoy el `ServiceClient` del BFF (`apps/bff/src/downstream/service-client.ts`) aplica solo un tiempo de espera (`DOWNSTREAM_TIMEOUT_MS`, 5000 ms por defecto) y traduce los fallos de red a `503 UPSTREAM_UNAVAILABLE`. No reintenta ni corta el circuito.
- No existe ASR aprobado que fije disponibilidad ni latencia.

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. El decisor no registró el análisis de alternativas.

1. **Sin reintentos (estado actual).** Simple; un fallo transitorio del catálogo llega al usuario como error.
2. **Reintentos con espera creciente y cortacircuito (elegida).** Absorbe fallos transitorios y evita saturar un servicio caído; añade estado y parámetros que ajustar.
3. **Reintentos a intervalo fijo.** Más simple, pero golpea al servicio caído a ritmo constante.

## Decisión

**Las peticiones al `catalog-service` se reintentan con tiempos crecientes entre cada petición antes de que se abra el circuito (circuit breaker).**

**Justificación:** «Por disponibilidad» (decisor).

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- Número de reintentos, espera inicial, factor de crecimiento, tope y si lleva aleatoriedad (*jitter*).
- Qué cuenta como fallo que se reintenta (tiempo de espera, 5xx, error de red) y qué no (4xx, 409, 412, 422: no se reintentan; se supone, no está decidido).
- Umbral para abrir el circuito, tiempo en abierto y cómo se prueba la recuperación (semiabierto).
- Qué ve el usuario con el circuito abierto: SCR-019 y el asistente de alta no tienen estado para eso.
- Si aplica solo al catalog-service o a todos los servicios downstream (party incluido).
- Reintentar escrituras (`POST`/`PUT`/`approve`): exige idempotencia, que API-SPEC-003 no define.

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica. No se inventan valores de disponibilidad ni de latencia.

## Consecuencias

**Positivas:**
- Los fallos transitorios del catálogo dejan de verse como error inmediato.
- Se evita saturar un servicio caído.

**Negativas y riesgos:**
- Los reintentos suman latencia: con un tiempo de espera de 5 s por intento, la petición puede tardar mucho más antes de fallar.
- Reintentar escrituras sin idempotencia puede duplicar efectos.
- Un cortacircuito abierto bloquea la función aunque el servicio ya se haya recuperado, hasta la siguiente prueba.
- Estado compartido: si hay varias instancias del BFF, cada una lleva su propio contador salvo que se comparta (el BFF ya usa Redis).

**Impacto en pruebas:**
- Pruebas del cortacircuito: abrir, mantener abierto, semiabrir y cerrar; y de la espera creciente con reloj controlado.
- Pruebas de que los 4xx no se reintentan y de que una escritura no se duplica.
- La política concreta necesita una decisión antes de implementarse.
