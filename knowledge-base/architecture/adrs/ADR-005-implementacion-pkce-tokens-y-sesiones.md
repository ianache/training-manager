---
type: ADR
id: ADR-005
title: Implementación de PKCE: almacenamiento de tokens, propagación de identidad entre servicios y gestión de sesiones
description: Decisiones de implementación que complementan ADR-002, cerrando los puntos abiertos sobre dónde viven los tokens, cómo se propagan las identidades entre BFF y microservicios, instancia de Keycloak, federación e duración de sesiones.
tags: [architecture, adr, seguridad, autenticacion, pkce, bff, keycloak, tokens, sesiones]
status: draft
adr_status: Aceptado
decision: { by: "human:ianache", at: "2026-09-27T23:00:00-05:00" }
related: [ADR-002, ADR-001, asr-BR-ACR-02]
generated: { by: "architecture-adr-writer/claude-haiku-4-5", at: "2026-09-27T23:30:00-05:00" }
sources:
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
    title: ADR-002 — Autenticación en el BFF de Node.js con Keycloak y PKCE
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
    title: ADR-001 — Estructura: shell Angular y BFF Node.js
  - id: keycloak-instances
    resource: "https://oauth2.qa.comsatel.com.pe, https://oauth2.prod.comsatel.com.pe"
    title: Instancias Keycloak de COMSATEL (QA y Producción)
---

# ADR-005 — Implementación de PKCE: Tokens, Identidad y Sesiones

- **Estado:** Aceptado
- **Fecha:** 2026-09-27
- **Decisor:** ianache (Jefe de Ingeniería)
- **Redacción:** architecture-adr-writer/claude-haiku-4-5, a partir de decisiones del 2026-09-27. Pendiente verificación humana.
- **Complementa a:** [ADR-002](ADR-002-autenticacion-keycloak-pkce-en-bff.md) (que dejó abiertos estos 5 puntos)

## Contexto

ADR-002 estableció que el BFF en Node.js se integra con Keycloak mediante PKCE para autenticar usuarios, pero dejó sin decidir 5 puntos críticos de implementación:

1. ¿Dónde viven los tokens JWT: solo en BFF con cookie, o llegan al navegador?
2. ¿Cómo se propaga la identidad del usuario entre BFF y microservicios (token del usuario, credenciales de cliente, otra estrategia)?
3. ¿Instancia de Keycloak nueva o existente en COMSATEL?
4. ¿Se federar Keycloak con directorio corporativo?
5. ¿Duración de sesión, cierre de sesión y revocación?

Esta sesión cierra esos 5 puntos con decisiones explícitas del Jefe de Ingeniería (ianache).

## Opciones consideradas

**Punto 1: Dónde viven los tokens**

1. Tokens en navegador (localStorage/sessionStorage) — Riesgo XSS: tokens expuestos si JavaScript es comprometido
2. **Tokens solo en BFF con cookie HTTP-only (elegida)** — Cookies se envían automáticamente con requests; JavaScript no puede accederlas; protección contra XSS
3. Token en navegador + refresh token en cookie — Complejidad intermedia

**Punto 2: Propagación de identidad a microservicios**

1. Propagar token JWT del usuario final a microservicios — Cada microservicio valida el token; escalable, pero requiere coordinación de secretos
2. **BFF obtiene JWT con su cuenta de servicio + X-User-Name header para auditoría (elegida)** — Microservicios confían en BFF; BFF impersona al usuario; facilita auditoría centralizada
3. Credenciales de cliente separadas por usuario — No escalable; requiere una cuenta por usuario en cada microservicio

**Punto 3: Instancia de Keycloak**

1. Desplegar Keycloak nuevo — Costo operativo adicional; duplicación innecesaria
2. **Reutilizar instancia existente de COMSATEL (elegida)** — Ya operativa; reduce costo y complejidad
3. Usar SaaS (Auth0, Okta, etc.) — Costo recurrente; dependencia externa

**Punto 4: Federación**

1. No federar (gestionar usuarios directamente en Keycloak) — Duplicación de datos; sincronización manual
2. **Federar con directorio corporativo (elegida)** — Única fuente de verdad; usuarios se sincronizan automáticamente
3. Integración bilateral (cambios en Keycloak → directorio) — Complejidad bidireccional

**Punto 5: Sesiones**

1. Sesión larga (24 horas) — Riesgo de exposición prolongada
2. **Sesión media (30 minutos) (elegida)** — Balance entre experiencia y seguridad
3. Sesión corta (5-10 minutos) — Fricción: usuarios deben volver a loguearse frecuentemente

## Decisión

### 1. Almacenamiento de tokens

**Los tokens JWT se almacenan solo en el BFF, dentro de cookies HTTP-only. Nunca llegan al navegador.**

**Flujo:**
```
Shell (Angular) 
  │ (credenciales usuario)
  ↓
BFF (Node.js)
  │ intercambia credenciales con Keycloak
  ↓
Keycloak 
  ├─ valida credenciales
  └─ retorna JWT al BFF
  
BFF almacena JWT en cookie HTTP-only
  │ (JavaScript de Angular NO puede leerla)
  ├─ cada request del navegador incluye la cookie automáticamente
  └─ BFF valida JWT y ejecuta la solicitud en microservicios
```

**Justificación:**
- HTTP-only previene ataques XSS (JavaScript no puede robar la cookie)
- Cookies se envían automáticamente con requests (sin código adicional)
- El navegador es un cliente inseguro; el BFF es un componente confiable

### 2. Propagación de identidad a microservicios

**El BFF obtiene un JWT con su propia cuenta de servicio Keycloak. La identidad del usuario final se transfiere a los microservicios mediante el header `X-User-Name` para auditoría y trazabilidad.**

**Flujo:**
```
Shell → BFF (sesión del usuario final, validada en BFF)
  │ BFF conoce al usuario (ej: juan.perez@comsatel.com)
  ├─ BFF obtiene su propio JWT con su cuenta de servicio
  │  (ej: jwt-bff-service-account)
  │
  ├─ BFF llama a microservicio
  │  POST /api/competencies
  │  Header: X-User-Name: juan.perez@comsatel.com
  │  Header: Authorization: Bearer <JWT-BFF>
  │
  └─ Microservicio
     ├─ valida JWT-BFF (trusts BFF)
     ├─ lee X-User-Name para auditoría
     └─ ejecuta operación en nombre de juan.perez@comsatel.com
     
Logs de auditoría: "juan.perez@comsatel.com realizó X a través de BFF"
```

**Justificación:**
- **Impersonalización centralizada:** el BFF es el único punto que autentica usuarios finales
- **Escalabilidad:** microservicios NO necesitan contactar a Keycloak por cada request
- **Auditoría:** trazabilidad clara del usuario final (X-User-Name)
- **Seguridad:** credenciales de servicio (BFF) no son credenciales de usuarios finales; se rota con menor frecuencia
- **Limitación:** Las cuentas de servicio de los usuarios finales NUNCA se usan como credenciales para consumo directo de microservicios

### 3. Instancia de Keycloak

**Se reutiliza la instancia existente de COMSATEL.**

**Topología:**
```
Desarrollo (local):
  Keycloak en docker-compose (sin federación, usuarios de prueba)

QA:
  https://oauth2.qa.comsatel.com.pe (federado con directorio corporativo)

Producción:
  https://oauth2.prod.comsatel.com.pe (federado con directorio corporativo)
```

**Justificación:**
- Keycloak ya está operativo en COMSATEL
- Reduce costo operativo y complejidad
- Los desarrolladores usan docker-compose con usuarios de prueba locales

### 4. Federación con directorio corporativo

**Keycloak se federar con el directorio corporativo de COMSATEL en QA y Producción.**

**Configuración:**
```
Keycloak QA/PROD 
  ├─ federado con directorio corporativo (ej: LDAP/AD)
  ├─ usuarios se sincronizan automáticamente
  └─ cambios en directorio → Keycloak (automático)

Keycloak local (desarrollo)
  └─ sin federación; usuarios creados manualmente en docker-compose
```

**Justificación:**
- Única fuente de verdad (directorio corporativo)
- Usuarios nuevos en COMSATEL → automáticamente en Keycloak
- Bajas de usuarios → se propagan automáticamente
- Desarrollo local sin fricción (sin necesidad de conectar a directorio corporativo)

### 5. Duración de sesión, cierre y revocación

**Las sesiones de usuarios finales duran 30 minutos. El cierre de sesión debe ejecutarse tanto en el navegador como en Keycloak, redirigiendo a la pantalla de login.**

**Flujo de login:**
```
1. Shell (Angular) redirige a BFF: GET /auth/login
2. BFF redirige a Keycloak: https://oauth2.prod.comsatel.com.pe/auth/...
3. Usuario entra credenciales en Keycloak
4. Keycloak redirige a BFF con código de autorización
5. BFF intercambia código por JWT
6. BFF almacena JWT en cookie HTTP-only
7. BFF redirige a Shell → dashboard

[Sesión activa, 30 minutos]

Si token vence o usuario cierra sesión:
  Opción 1 (timeout automático):
    Sesión expira en Keycloak (30 min)
    BFF detecta y redirige a login

  Opción 2 (logout manual):
    Usuario hace click en "Cerrar sesión"
    BFF redirige a Keycloak: https://oauth2.prod.comsatel.com.pe/auth/logout
    Keycloak invalida sesión
    Keycloak redirige a Shell → login
    BFF borra cookie HTTP-only (u otra limpieza local)
```

**Justificación:**
- **30 minutos:** balance entre experiencia y seguridad (evita tokens vivos por horas si dispositivo se roba)
- **Cierre bilateral (browser + Keycloak):** garantiza que la sesión se invalida en ambos lados
- **Revocación:** Keycloak revoca token; el BFF ve que el token ya no es válido en siguientes requests

## Metas de calidad

| Métrica | Target | Cómo se verifica |
|---|---|---|
| **Zero tokens en navegador** | 100% | Auditoría de requests del navegador (DevTools); no debe haber tokens en localStorage/sessionStorage |
| **Tiempo de propagación de usuario entre directorio y Keycloak** | < 5 minutos | Test de sincronización en QA (crear usuario en AD → verificar que aparece en Keycloak) |
| **Duración de sesión** | 30 ± 2 minutos | Test automático de timeout |
| **Revocación completa en logout** | 100% | Token debe ser inválido en BFF y Keycloak dentro de 1 segundo |

## Consecuencias

**Positivas:**
- Tokens no expuestos a ataques XSS del navegador
- Única fuente de verdad de usuarios (directorio corporativo)
- Impersonalización centralizada facilita auditoría
- Experiencia aceptable (30 min) sin comprometer seguridad

**Negativas y riesgos:**
- **Punto único de fallo:** el BFF es crítico para autenticación de todos los usuarios
- **Sincronización de directorio:** depende de que la federación Keycloak-AD siga funcionando
- **Complejidad operativa:** hay que mantener 2 instancias Keycloak (QA y PROD) sincronizadas
- **Desarrollo local:** requiere docker-compose configurado; nuevos desarrolladores necesitan setup

## No se decidió todavía

- ¿Qué estrategia de refresh token usar (si es necesaria) cuando la sesión está próxima a vencer?
- ¿Notificar al usuario 5 minutos antes de que expire la sesión?
- ¿Rotación de credenciales de servicio del BFF en Keycloak? ¿Cada cuánto?

---

## Cambios a documentos relacionados

**ADR-002:** Agregar sección "Decisiones posteriores (ADR-005)" con referencia a este ADR

**SPEC-001 (futuro):** Cuando se diseñen capacidades de logout, incluir el flujo de cierre bilateral

**Arquitectura de microservicios (futuro ADR-006 u otro):** Documentar cómo validan JWT-BFF los microservicios y cómo leen X-User-Name

---

**Status:** Aceptado (2026-09-27)
**Decisor:** ianache (Jefe de Ingeniería)
**Handoff:** Arquitecto de seguridad (implementar), DevOps (mantener instancias Keycloak), Frontend team (integración con BFF)
