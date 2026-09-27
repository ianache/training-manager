---
type: ADR
id: ADR-004
title: HashiCorp Vault es la plataforma para almacenar la parametría y los datos sensibles, incluidas las credenciales de la cuenta de Gmail empresarial
description: La plataforma usa HashiCorp Vault para la parametría y los datos sensibles, y guarda allí las credenciales de la cuenta de Gmail empresarial que envía los correos.
tags: [architecture, adr, seguridad, secretos, parametria, hashicorp-vault, gmail, correo]
status: draft
adr_status: Aceptado
decision: { by: human:ianache, at: 2026-09-27T08:59:25-05:00 }
related: [ADR-001, ADR-002, ADR-003, SPEC-001, BRC-001, ACP-001, ADB-001]
generated: { by: architecture-adr-writer/claude-opus-5-5, at: 2026-09-27T09:20:00-05:00 }
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
    title: SPEC-001 — Gestión de colaboradores
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    title: BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
    title: ADR-001 — Estructura de la plataforma
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
    title: ADR-002 — Autenticación en el BFF de Node.js con Keycloak y PKCE
  - id: acp-001
    resource: /knowledge-base/architecture/ACP-001-architecture-context-pack.md
    title: ACP-001 — Architecture Context Pack de la Plataforma de Gestión de Formación
  - id: adb-001
    resource: /knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md
    title: ADB-001 — Descubrimiento de arquitectura
  - id: asr-catalog
    resource: /knowledge-base/architecture/asr/asr-catalog.md
    title: Catálogo de candidatos ASR
---

# ADR-004 — Secretos y parametría en HashiCorp Vault

- **Estado:** Aceptado
- **Fecha:** 2026-09-27
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-opus-5-5, a partir de las decisiones D22, D23 y D24 de [SPEC-001](/knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md) §2, tomadas por el decisor en la sesión del 2026-09-27. D24 pide registrar el uso de Vault como este ADR. Falta que un humano revise el texto: no hay `verified`.
- **ASR relacionados:** ninguno lo atiende. Ningún candidato del [catálogo ASR](/knowledge-base/architecture/asr/asr-catalog.md) trata de la custodia de secretos o de la parametría.
- **Depende de / Reemplaza a:** —. Se complementa con [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) (estructura), [ADR-002](/knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md) (identidad) y [ADR-003](/knowledge-base/architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md) (persistencia).

## Contexto

- Al vencer el plazo de anonimización, la plataforma envía automáticamente un correo al Jefe de Ingeniería (SPEC-001 D18; BR-PTY-15 de [BRC-001](/knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)).
- Los correos se envían desde una cuenta de Gmail empresarial (Google Workspace) de la empresa (SPEC-001 D19). Es una integración nueva: no figuraba en [ACP-001](/knowledge-base/architecture/ACP-001-architecture-context-pack.md) ni en [ADB-001](/knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md).
- Hacía falta decidir dónde se guardan las credenciales de esa cuenta (SPEC-001 Q-14). SPEC-001 §4 registra el riesgo: el envío depende de la cuenta, sus credenciales deben custodiarse y hay que respetar sus límites de envío.
- No se conocían estándares corporativos de seguridad ni plataformas aprobadas (ADB-001 KG-01).

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. El decisor no registró el análisis de alternativas. Los pros y contras son razonamiento del agente y no se respaldan en fuentes consultadas en esta sesión.

1. **Credenciales en variables de entorno o archivos de configuración del despliegue.** A favor: simple. En contra: los secretos quedan repartidos y es más difícil controlar su acceso y su rotación.
2. **Credenciales cifradas en la base de datos de la plataforma.** En contra: mezcla secretos con datos de negocio y deja la clave de cifrado sin resolver.
3. **HashiCorp Vault como plataforma de parametría y datos sensibles (elegida).** A favor: un único lugar para los secretos, con control de acceso. En contra: es un componente más que operar, y cada servicio que lo use necesita autenticarse ante él.

## Decisión

**HashiCorp Vault es la plataforma elegida para almacenar la parametría y los datos sensibles, y las credenciales de la cuenta de Gmail empresarial desde la que la plataforma envía los correos se guardan en Vault.**

**Frontera con la base de datos, tal como la fija SPEC-001 D23:** el plazo de anonimización se guarda en la **base de datos** (ANONYMIZATION_SETTING), con su auditoría; **Vault se usa para los secretos de esta feature**. Es decir, en la feature de gestión de colaboradores el plazo configurable, aunque es un parámetro, no va a Vault.

**Justificación:** [PENDIENTE]. El decisor no la registró.

**Argumentos del agente (no son del decisor):**
- Responde en parte SPEC-001 Q-14: dónde se guardan las credenciales. El método de autenticación ante Gmail sigue abierto.
- Guardar el plazo en la base de datos permite auditar quién lo cambió y cuándo, como el resto de la información de la feature (BR-PTY-12; SPEC-001 D23 menciona "con su auditoría").

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- El método de autenticación de la plataforma ante la cuenta de Gmail: OAuth con cuenta de servicio, contraseña de aplicación u otro (SPEC-001 Q-14). Decide: arquitecto responsable.
- El criterio general para decidir qué parametría va a Vault y cuál a la base de datos. D22 habla de "parametría y datos sensibles", pero D23 deja el plazo de anonimización en la base de datos. Fuera de esta feature, la frontera no está fijada. Decide: arquitecto responsable, con el decisor.
- Qué componente lee Vault y envía los correos: el microservicio de partes, un servicio de notificaciones u otro. ADR-001 deja abierta la descomposición en microservicios.
- El método de autenticación de los servicios ante Vault (por ejemplo, AppRole, Kubernetes, tokens u otro) y las políticas de acceso por servicio.
- La rotación de las credenciales de Gmail y de los demás secretos, y quién la ejecuta.
- Si otros secretos de la plataforma (credenciales de base de datos, secreto del cliente de Keycloak del BFF, acceso a Classroom, Drive, GitLab y docsuite) también van a Vault. Es probable por D22, pero la decisión solo nombra las credenciales de Gmail.
- Qué instancia de Vault se usa (existente o nueva), dónde se aloja, su versión, su alta disponibilidad y su respaldo (ADB-001 KG-01, KG-06).
- Cómo se respetan los límites de envío de la cuenta de Gmail y la política de reintentos (SPEC-001 §4 menciona reintentos en ANONYMIZATION_NOTICE, sin fijar cuántos ni cada cuánto).

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica. Ninguna fuente fija metas de disponibilidad de Vault ni del envío de correos (ADB-001 KG-06).

## Consecuencias

**Positivas:**
- Las credenciales de Gmail no quedan en el código, en la configuración del despliegue ni en la base de datos.
- Hay una plataforma definida para los datos sensibles que aparezcan en las siguientes features.

**Negativas y riesgos:**
- Vault es una dependencia nueva que hay que operar, salvo que ya exista en COMSATEL (sin evidencia; ADB-001 KG-01). Si Vault no está disponible, el servicio que envía los correos no puede obtener las credenciales y los avisos quedan como fallidos.
- La cuenta de Gmail empresarial es también una dependencia nueva, con límites de envío.
- La frontera entre parametría en Vault y en la base de datos puede aplicarse de forma distinta en cada feature si no se fija un criterio.

**Impacto en pruebas:**
- Pruebas de que el servicio que envía los correos obtiene las credenciales desde Vault y de que no aparecen en registros, configuración ni base de datos.
- Pruebas del aviso cuando Vault o la cuenta de Gmail fallan: el aviso queda como fallido y se reintenta (SPEC-001 §4, ANONYMIZATION_NOTICE).
- Pruebas de que el plazo de anonimización se lee de ANONYMIZATION_SETTING y su cambio queda auditado.
