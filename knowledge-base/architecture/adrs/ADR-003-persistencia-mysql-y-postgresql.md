---
type: ADR
id: ADR-003
title: El modelo físico de datos es compatible con MySQL y PostgreSQL mediante un DDL portable y un anexo por motor
description: El modelo físico de datos soporta MySQL 8.0.16 o superior y PostgreSQL con un único DDL portable y un anexo por motor que documenta sus diferencias.
tags: [architecture, adr, datos, persistencia, mysql, postgresql, ddl, party]
status: draft
adr_status: Aceptado
decision: { by: human:ianache, at: 2026-09-27T08:47:13-05:00 }
related: [ADR-001, ADR-004, SPEC-001, BRC-001, ACP-001, ADB-001]
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
  - id: adb-001
    resource: /knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md
    title: ADB-001 — Descubrimiento de arquitectura
  - id: acp-001
    resource: /knowledge-base/architecture/ACP-001-architecture-context-pack.md
    title: ACP-001 — Architecture Context Pack de la Plataforma de Gestión de Formación
  - id: asr-catalog
    resource: /knowledge-base/architecture/asr/asr-catalog.md
    title: Catálogo de candidatos ASR
  - id: asr-br-acr-03
    resource: /knowledge-base/architecture/asr/asr-BR-ACR-03.md
    title: ASR candidato — Trazabilidad auditable de las certificaciones
  - id: asr-br-tra-01
    resource: /knowledge-base/architecture/asr/asr-BR-TRA-01.md
    title: ASR candidato — Privacidad y visibilidad de datos de desempeño
---

# ADR-003 — Persistencia compatible con MySQL y PostgreSQL

- **Estado:** Aceptado
- **Fecha:** 2026-09-27
- **Decisor:** ianache (`human:ianache`)
- **Redacción:** architecture-adr-writer/claude-opus-5-5, a partir de la decisión D12 de [SPEC-001](/knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md) §2, tomada por el decisor en la sesión del 2026-09-27. Falta que un humano revise el texto: no hay `verified`.
- **ASR relacionados:** ninguno lo atiende. Ningún candidato del [catálogo ASR](/knowledge-base/architecture/asr/asr-catalog.md) trata del motor de base de datos. El diseño físico que acompaña esta decisión tiene en cuenta [asr-BR-TRA-01](/knowledge-base/architecture/asr/asr-BR-TRA-01.md) (anonimización) y el historial no destructivo que pide [asr-BR-ACR-03](/knowledge-base/architecture/asr/asr-BR-ACR-03.md), pero elegir los motores no resuelve esos candidatos.
- **Depende de / Reemplaza a:** depende de [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) (microservicios detrás del BFF). Se complementa con [ADR-004](/knowledge-base/architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md). No reemplaza a ninguno.

## Contexto

- El motor de base de datos era desconocido: formaba parte del vacío KG-01 (tecnologías aprobadas) de [ADB-001](/knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md). SPEC-001 D12 dice que esta decisión cierra "Motor de base de datos (ADB-001 KG-01 en parte)".
- SPEC-001 define la información maestra de colaboradores con el patrón Party del UDM, con vigencias (desde y hasta) en roles, relaciones, contactos y asignaciones, y pide un modelo de datos lógico y físico implementable (SPEC-001 §1, D1).
- Frontera de arquitectura según SPEC-001 §6.1, sobre la estructura de ADR-001: un **microservicio de partes** es el único dueño de estos datos; el catálogo y la certificación los referencian por el identificador de la parte, y solo el BFF los expone al frontend.
- Las reglas que el modelo físico debe poder garantizar vienen de [BRC-001](/knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md): código de colaborador único (BR-PTY-06), identificación única por tipo, número y país (BR-PTY-07), correo laboral único entre vigentes (BR-PTY-08), un solo nivel vigente por rol (BR-PTY-11), nada se sobrescribe ni se borra (BR-PTY-12) y las unicidades ignoran a las personas anonimizadas (BR-PTY-14).

## Opciones consideradas

Las opciones y sus pros y contras son una reconstrucción del agente. El decisor no registró el análisis de alternativas. Los pros y contras son razonamiento del agente y no se respaldan en fuentes consultadas en esta sesión.

1. **Solo MySQL.** A favor: un único dialecto y un único conjunto de pruebas. En contra: ata la plataforma a un motor sin conocer los estándares ni el alojamiento corporativos (KG-01).
2. **Solo PostgreSQL.** A favor: índices parciales y restricciones más expresivas. En contra: el mismo acoplamiento a un motor.
3. **MySQL y PostgreSQL con un DDL portable y un anexo por motor (elegida).** A favor: el modelo no depende del motor que se elija al desplegar. En contra: se limita a lo común de los dos motores, y hay que mantener dos anexos y probar en los dos.
4. **Dos modelos físicos independientes, uno por motor.** En contra: duplica el diseño y facilita que diverjan.

## Decisión

**El modelo físico de datos soporta MySQL (8.0.16 o superior) y PostgreSQL mediante un único modelo físico con DDL portable y un anexo por motor que documenta las diferencias.**

**Justificación:** [PENDIENTE]. El decisor no la registró.

**Lineamientos de diseño físico acordados en SPEC-001 §6.2** (sección del diseño aprobada por el decisor; se citan como están, sin agregar):

| Tema | Lineamiento |
|---|---|
| Identificadores | UUID como `CHAR(36)` en los dos motores, o `BINARY(16)` en MySQL si se prioriza el rendimiento, según el diccionario de tipos |
| Fechas | Todo en UTC: `TIMESTAMP` en PostgreSQL y `DATETIME(6)` en MySQL |
| Un nivel vigente por rol | Columna generada `current_role_id` (el rol mientras la asignación está vigente, NULL cuando está cerrada) más un índice único sobre la persona y esa columna. Funciona en los dos motores porque ambos admiten varios NULL en un índice único |
| CHECK | Se usan (MySQL 8.0.16 o superior) |
| Restricciones diferibles | No se usan |
| Anonimización | Las columnas de PII admiten un valor anónimo (NULL o un marcador fijo). Los índices únicos de identificación, código y correo excluyen a las personas anonimizadas: índice parcial en PostgreSQL; en MySQL, una columna generada que vale NULL cuando la persona está anonimizada. Cada motor documenta su variante en su anexo |

Entregables acordados (SPEC-001 §6.2): el DDL portable, un anexo MySQL y un anexo PostgreSQL, y pruebas de las restricciones clave ejecutadas en los dos motores.

**Argumentos del agente (no son del decisor):**
- Con los estándares y el alojamiento corporativos todavía desconocidos (ADB-001 KG-01, pregunta 1), no fijar un único motor evita rehacer el modelo cuando se conozcan.
- Los lineamientos de §6.2 se apoyan en mecanismos que los dos motores comparten (columnas generadas, índices únicos con varios NULL, CHECK), así que la mayor parte del DDL puede ser común.

**No se decidió todavía**, y el desarrollo no debe asumirlo:
- Qué motor se usa en cada entorno (desarrollo, pruebas, producción), o si se despliegan los dos. La decisión dice "soporta", no "se usa". Decide: arquitecto responsable.
- La versión mínima de PostgreSQL (SPEC-001 Q-08). Decide: arquitecto responsable.
- Si en MySQL el UUID se guarda como `CHAR(36)` o `BINARY(16)`. SPEC-001 §6.2 deja las dos opciones, según el diccionario de tipos y si se prioriza el rendimiento.
- Cómo se verifica el DDL en los dos motores: si hay Docker u otro medio para ejecutar MySQL 8 y PostgreSQL (SPEC-001 Q-06). Sin eso, la verificación queda pendiente.
- La correspondencia del modelo con el UDM, que debe verificarse contra *The Data Model Resource Book, Vol. 1* (SPEC-001 Q-07).
- Si los demás microservicios (catálogo, certificación, etc.) siguen esta misma regla de portabilidad. D12 se tomó en SPEC-001, sobre el modelo de colaboradores. Decide: arquitecto responsable.
- Si cada microservicio tiene su propia base de datos o esquema, la herramienta de migraciones, el acceso a datos (ORM u otro) y el alojamiento, la alta disponibilidad, el respaldo y la retención de la base (ADB-001 KG-06).

## Metas de calidad

[PENDIENTE]: sin ASR aprobado con métrica. Ninguna fuente fija metas de rendimiento, disponibilidad, RTO/RPO ni retención (ADB-001 KG-06).

## Consecuencias

**Positivas:**
- Queda cerrado, en parte, el motor de base de datos de KG-01: MySQL 8.0.16+ o PostgreSQL.
- Las reglas de unicidad, vigencia y anonimización de BR-PTY-* se garantizan en la base de datos con mecanismos comunes a los dos motores.

**Negativas y riesgos:**
- Dos anexos que mantener y dos motores en los que probar cada cambio de esquema.
- Solo se pueden usar las capacidades comunes: por ejemplo, no se usan restricciones diferibles, y los índices parciales de PostgreSQL necesitan un equivalente en MySQL.
- Si no hay forma de ejecutar los dos motores (Q-06), las restricciones clave quedan sin verificar.

**Impacto en pruebas:**
- Ejecutar el DDL en MySQL 8 y en PostgreSQL, con pruebas de: un nivel vigente por rol, identificación única, código único, correo laboral único entre vigentes y anonimización (que no quede PII en ninguna tabla ni vigencia, que las unicidades ignoren a los anonimizados y que se conserven el código y la auditoría) (SPEC-001 §7).
- Pruebas de fechas en UTC en los dos motores.
