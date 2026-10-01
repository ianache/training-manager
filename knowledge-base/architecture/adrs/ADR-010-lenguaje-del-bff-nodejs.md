---
type: ADR
id: ADR-010
title: El BFF se mantiene en Node.js; Python + FastAPI aplica a los microservicios de dominio
description: Resuelve el conflicto entre ADR-001 (BFF en Node.js) y ADR-008 (todas las API REST en Python/FastAPI). El BFF sigue en Node.js con TypeScript; ADR-008 queda vigente solo para los microservicios de dominio.
tags: [architecture, adr, bff, nodejs, typescript, python, fastapi, lenguaje, binding-rule]
status: draft
adr_status: Aceptado
decision: { by: human:ianache, at: 2026-09-30T00:00:00-05:00 }
related: [ADR-001, ADR-002, ADR-005, ADR-008, API-SPEC-001, DCP-002]
generated: { by: architecture-adr-writer/claude-opus-5-5, at: 2026-10-01T09:00:00-05:00 }
sources:
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
    title: ADR-001 — Estructura de la plataforma (shell y microUIs en Angular, BFF en Node.js)
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
    title: ADR-002 — Autenticación en el BFF con Keycloak y PKCE
  - id: adr-005
    resource: /knowledge-base/architecture/adrs/ADR-005-implementacion-pkce-tokens-y-sesiones.md
    title: ADR-005 — Implementación de PKCE, tokens y sesiones
  - id: adr-008
    resource: /knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md
    title: ADR-008 — Python + FastAPI como estándar para APIs REST
  - id: web-architecture
    resource: /codebase/apps/ARCHITECTURE.md
    title: Arquitectura de la aplicación web (pregunta abierta Q-12)
  - id: bff-reference
    resource: /codebase/apps/bff/README.md
    title: BFF de referencia (Node.js 22+, Express 5, openid-client v6)
---

# ADR-010 — Lenguaje del BFF: Node.js

- **Estado:** Aceptado
- **Fecha:** 2026-09-30
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-opus-5-5, a partir de la elección del decisor "Mantener Node.js (ADR-010)" del 2026-09-30. Falta que un humano revise el texto: no hay `verified`.
- **Justificación del decisor:** [PENDIENTE]. El decisor eligió la opción, pero no registró el motivo. Las razones de la sección "Contexto" son evidencia del repositorio, no la justificación del decisor.
- **Depende de / Reemplaza a:** reemplaza **en parte** a [ADR-008](/knowledge-base/architecture/adrs/ADR-008-python-fastapi-como-estandar-api.md): solo la parte que llevaba el BFF a Python. Confirma lo que [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) ya decía sobre el BFF.

## Contexto

ADR-001 (2026-09-27) decidió un BFF en Node.js. ADR-008 (2026-09-28) estableció Python + FastAPI para "todas las APIs REST (BFF, microservicios)" y anunció el cambio del BFF a Python. El ADR-008 deja abierta, en "No se decidió todavía", la pregunta "¿Migrar BFF Node.js existente a Python, o desplegar en paralelo?".

La aplicación web de referencia ya tiene un BFF en Node.js (`codebase/apps/bff`) que cumple ADR-002 y ADR-005: login PKCE S256 con `openid-client` v6, sesión en Redis tras la cookie HTTP-only `gf.sid`, CSRF de doble envío, secretos en Vault y llamadas a los servicios con un token `client_credentials` más `X-User-Name` y `X-User-Roles`. Tiene 22 pruebas, incluidas pruebas de cumplimiento de ADR. El arranque completo con `docker compose` funciona con ese BFF.

La pregunta Q-12 de la arquitectura web registró el conflicto. Mientras siguiera abierta, el DCP-002 no podía declarar de forma coherente "sin conflicto con el BFF" (su restricción CON-001).

## Opciones consideradas

| Opción | Descripción | A favor | En contra |
|---|---|---|---|
| **A. Mantener Node.js en el BFF (elegida)** | El BFF sigue en Node.js/TypeScript; los microservicios de dominio siguen ADR-008 | Conserva el BFF que ya funciona y sus pruebas; mismo lenguaje (TypeScript) que el portal Angular; `openid-client` es una implementación certificada de OpenID | Dos lenguajes en el backend; el equipo debe mantener habilidades de Node.js |
| B. Migrar el BFF a Python/FastAPI | Aplicar ADR-008 completo | Un solo lenguaje de backend | Reescribir PKCE, sesión, CSRF y proxy, que hoy funcionan; repetir las pruebas de seguridad |
| C. Desplegar ambos BFF en paralelo | Migración gradual | Riesgo de corte bajo | Dos implementaciones de seguridad a la vez; duplica el esfuerzo |

## Decisión

**Opción A.** El BFF de la plataforma se implementa y mantiene en **Node.js (22 o superior) con TypeScript**. ADR-008 sigue vigente, sin cambios, para los **microservicios de dominio** (por ejemplo, `party-management-service`).

### Reglas vinculantes

1. El BFF es la única pieza de backend en Node.js. Todo microservicio de dominio nuevo sigue ADR-008 (Python 3.11+, FastAPI, SQLAlchemy 2, Pydantic v2, pytest).
2. El BFF no contiene lógica de dominio ni acceso a bases de datos de dominio. Solo hace autenticación, sesión, CSRF, agregación y propagación de identidad (`X-User-Name`, `X-User-Roles`, `X-Request-ID`).
3. El BFF usa TypeScript en modo estricto y valida en tiempo de ejecución las entradas que reenvía.
4. Las reglas transversales de ADR-008 que no dependen del lenguaje también aplican al BFF: verificaciones de salud de *liveness* y *readiness*, registros estructurados sin `print`/`console.log` sueltos y documentación del contrato.

## Consecuencias

### Positivas

- El BFF de referencia que ya cumple ADR-002 y ADR-005 sigue siendo válido; no hay que reescribirlo.
- El DCP-002 puede declarar CON-001 sin conflicto, citando este ADR.
- Frontend y BFF comparten TypeScript.

### Negativas

- El backend usa dos lenguajes: Node.js en el BFF y Python en los microservicios. CI/CD necesita las dos cadenas (Node 22+ y Python 3.11+).
- La afirmación de ADR-008 "100 % de las APIs en Python" deja de ser cierta.

### Mitigaciones

| Riesgo | Mitigación |
|---|---|
| Doble cadena de herramientas | Imágenes base fijas por lenguaje (`node:24-alpine`, `python:3.11-slim`) y plantillas de pipeline separadas |
| Lógica de dominio que se filtra al BFF | Regla vinculante 2; revisar en el *code review* que el BFF no consulte bases de dominio |

## Cambios a documentos relacionados

- **ADR-008:** `adr_status` pasa a "Reemplazado en parte por ADR-010: lenguaje del BFF". Se agrega un aviso en su encabezado.
- **ADR-001:** enlaza ADR-010 en `related`.
- **Arquitectura web (`codebase/apps/ARCHITECTURE.md`):** Q-12 queda resuelta.
- **DCP-002:** la restricción CON-001 cita ADR-010.

## No se decidió todavía

- Si en el futuro habrá un BFF por canal (por ejemplo, móvil) y si seguirá esta regla.
- La justificación del decisor ([PENDIENTE]).
