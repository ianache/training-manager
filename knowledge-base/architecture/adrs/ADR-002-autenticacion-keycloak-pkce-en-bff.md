---
type: ADR
id: ADR-002
title: La autenticación se resuelve en el BFF de Node.js integrado con Keycloak mediante el flujo con PKCE
description: El BFF en Node.js se integra con Keycloak como proveedor de identidad usando PKCE para la autenticación de la plataforma.
tags: [architecture, adr, seguridad, identidad, keycloak, pkce, bff, nodejs]
status: draft
adr_status: Aceptado
decision: { by: human:ianache, at: 2026-09-27T00:29:16-05:00 }
related: [ADR-001, asr-BR-ACR-02, asr-BR-TRA-01, ACP-001, ADB-001]
generated: { by: architecture-adr-writer/claude-opus-5-5, at: 2026-09-27T00:29:16-05:00 }
sources:
  - id: acp-001
    resource: /knowledge-base/architecture/ACP-001-architecture-context-pack.md
    title: ACP-001 — Architecture Context Pack de la Plataforma de Gestión de Formación
  - id: adb-001
    resource: /knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md
    title: ADB-001 — Descubrimiento de arquitectura
  - id: asr-br-acr-02
    resource: /knowledge-base/architecture/asr/asr-BR-ACR-02.md
    title: ASR candidato — Identidad y autorización por rol
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    title: BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación
  - id: asr-br-tra-01
    resource: /knowledge-base/architecture/asr/asr-BR-TRA-01.md
    title: ASR candidato — Privacidad y visibilidad de datos de desempeño
---

# ADR-002 — Autenticación en el BFF de Node.js con Keycloak y PKCE

- **Estado:** Aceptado
- **Fecha:** 2026-09-27
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-opus-5-5, a partir de la decisión del decisor en la sesión del 2026-09-27. Falta que un humano revise el texto: no hay `verified`.
- **ASR relacionados:** [asr-BR-ACR-02](/knowledge-base/architecture/asr/asr-BR-ACR-02.md) (identidad y autorización por rol), candidato sin disposición.
- **Depende de / Reemplaza a:** depende de [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md), que define el BFF.

## Contexto

- La plataforma tiene 7 actores con permisos distintos por rol ([asr-BR-ACR-02](/knowledge-base/architecture/asr/asr-BR-ACR-02.md)).
- El proveedor de identidad y el origen de los usuarios y sus roles eran desconocidos (vacío KG-03 y pregunta 3 de [ADB-001](/knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md); en ACP-001 figuraba como UNKNOWN en "Security landscape").
- Los perfiles, las evidencias y las propuestas de la IA son datos de desempeño de personas, con acceso restringido por rol ([asr-BR-TRA-01](/knowledge-base/architecture/asr/asr-BR-TRA-01.md)).
- Según [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md), todo acceso del frontend pasa por el BFF.

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. El decisor no registró el análisis de alternativas. Los pros y contras son razonamiento del agente y no se respaldan en fuentes consultadas en esta sesión.

1. **PKCE en el navegador: los microUIs actúan como cliente público y guardan los tokens.** En contra: los tokens quedan expuestos en el navegador.
2. **El BFF en Node.js se integra con Keycloak mediante PKCE (elegida).** A favor: centraliza la autenticación en el componente que ya intermedia todo el acceso (ADR-001). En contra: el BFF debe gestionar sesiones y tokens de forma segura.
3. **Autenticación propia de la plataforma.** En contra: duplica lo que ofrece un proveedor de identidad y aumenta el riesgo.

## Decisión

**El BFF en Node.js se integra con Keycloak como proveedor de identidad y autentica a los usuarios de la plataforma mediante el flujo con PKCE.**

**Justificación:** [PENDIENTE]. El decisor no la registró.

**Argumentos del agente (no son del decisor):**
- Responde, en la parte de autenticación, el vacío KG-03 de ADB-001 y la pregunta 1 de asr-BR-ACR-02 ("¿Existe un proveedor de identidad corporativo obligatorio?").
- Deja en un solo componente el punto donde aplicar los permisos por rol y la visibilidad de datos (asr-BR-ACR-02, asr-BR-TRA-01). Aplicarlos no queda decidido por este ADR.

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- Si los tokens quedan solo en el BFF, con una cookie de sesión en el navegador, o si llegan al navegador. La decisión dice "PKCE en el BFF", no dónde viven los tokens. Decide: arquitecto responsable.
- Cómo se autentican el BFF ante los microservicios y los microservicios entre sí (propagar el token del usuario, credenciales de cliente u otro).
- Cómo se modelan en Keycloak los 7 actores y los permisos por rol y ámbito, incluida la visibilidad de perfiles ajenos (P-08).
- Si Keycloak se federa con un directorio corporativo o con el sistema de RR. HH. como fuente de usuarios (ADB-001 KG-03, VIS-001 §11.4).
- Qué instancia de Keycloak se usa (existente o nueva), dónde se aloja y su versión.
- La duración de las sesiones, el cierre de sesión y la revocación.

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica. asr-BR-ACR-02 es un candidato sin disposición y no fija metas de seguridad.

## Consecuencias

**Positivas:**
- Queda definido el proveedor de identidad (Keycloak) y el componente que autentica (el BFF).
- La autenticación no se implementa por separado en cada microUI.

**Negativas y riesgos:**
- El BFF pasa a ser un componente crítico de seguridad: si falla, nadie entra a la plataforma.
- Keycloak es una dependencia nueva que hay que operar, salvo que ya exista en COMSATEL (sin evidencia; ADB-001 KG-01).
- El modelo de roles en Keycloak debe mantenerse en sincronía con el catálogo de roles de la plataforma. Qué es rol de acceso y qué es rol del catálogo está abierto (asr-BR-ACR-02).

**Impacto en pruebas:**
- Pruebas del flujo completo de inicio de sesión con PKCE entre el shell, el BFF y Keycloak, incluidos los errores: sesión vencida, código inválido y cierre de sesión.
- Pruebas de autorización por rol en el BFF para cada acción restringida (BR-CAT-04, BR-ACR-02, BR-REQ-02).
- Pruebas de que un colaborador ve solo sus propios datos mientras P-08 siga abierta.
