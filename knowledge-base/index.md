---
type: Knowledge Base Index
title: "UX/UI Knowledge Base Index"
description: "Índice de los artefactos de conocimiento UX/UI almacenados en esta base."
tags: [ux-ui, knowledge-base, index]
status: draft
generated:
  by: "manual/1.0"
  at: "2026-09-27T13:00:00-05:00"
sources:
  - id: repository-guidelines
    resource: /AGENTS.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: asr-catalog
    resource: /knowledge-base/architecture/asr/asr-catalog.md
  - id: adb-001
    resource: /knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md
  - id: aim-001
    resource: /knowledge-base/architecture/AIM-001-matriz-impacto-arquitectura.md
  - id: acp-001
    resource: /knowledge-base/architecture/ACP-001-architecture-context-pack.md
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
  - id: imd-002
    resource: /knowledge-base/business/information-model/IMD-002-modelo-conceptual-de-partes.md
  - id: adr-003
    resource: /knowledge-base/architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md
  - id: adr-004
    resource: /knowledge-base/architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md
  - id: ldm-001
    resource: /knowledge-base/architecture/data-model/LDM-001-modelo-logico-de-partes.md
  - id: pdm-001
    resource: /knowledge-base/architecture/data-model/PDM-001-modelo-fisico-de-partes.md
---

# Índice de la base de conocimiento

## Arquitectura

- [ADR-001 — Estructura: shell y microUIs en Angular, BFF en Node.js](architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) — Aceptado (`human:ianache`), `draft`
- [ADR-002 — Autenticación en el BFF con Keycloak y PKCE](architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md) — Aceptado (`human:ianache`), `draft`
- [ADR-003 — Persistencia compatible con MySQL y PostgreSQL](architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md) — Aceptado (`human:ianache`), `draft`
- [ADR-004 — Secretos y parametría en HashiCorp Vault](architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md) — Aceptado (`human:ianache`), `draft`
- [ACP-001 — Architecture Context Pack](architecture/ACP-001-architecture-context-pack.md) — DRAFT, no READY_FOR_ARQ_102
- [AIM-001 — Matriz de impacto de arquitectura](architecture/AIM-001-matriz-impacto-arquitectura.md) — `draft`
- [ADB-001 — Descubrimiento de arquitectura](architecture/ADB-001-descubrimiento-arquitectura-plataforma.md) — Architecture Discovery Brief, `draft`
- [Catálogo de candidatos ASR](architecture/asr/asr-catalog.md) — 9 candidatos pendientes de disposición del arquitecto, `draft`

## Arquitectura — Modelo de datos

- [LDM-001 — Modelo lógico de partes](architecture/data-model/LDM-001-modelo-logico-de-partes.md) — `draft`, REQUIRES_REVIEW
- [PDM-001 — Modelo físico de partes](architecture/data-model/PDM-001-modelo-fisico-de-partes.md) — `draft`, con anexos [MySQL](architecture/data-model/PDM-001-anexo-mysql.md) y [PostgreSQL](architecture/data-model/PDM-001-anexo-postgresql.md) y [DDL](architecture/data-model/ddl/party-portable.sql)
- [TST-001 — Pruebas de restricciones](architecture/data-model/tests/TST-001-pruebas-de-restricciones.md) — `draft`, ejecución PENDIENTE (Q-06)

## Diseño — Requisitos UX

- [UXR-000 — Requisitos UX transversales de la plataforma](design/ux-requirements/UXR-000-requisitos-ux-transversales.md) — `draft`
- [UXR-001 — Gestionar el catálogo de roles y competencias](design/ux-requirements/UXR-001-gestionar-catalogo-de-roles-y-competencias.md) — `draft`
- [UXR-002 — Declarar un requerimiento de proyecto](design/ux-requirements/UXR-002-declarar-requerimiento-de-proyecto.md) — `draft`
- [UXR-003 — Certificar un nivel de competencia](design/ux-requirements/UXR-003-certificar-un-nivel-de-competencia.md) — `draft`
- [UXR-004 — Consultar mi perfil de competencias](design/ux-requirements/UXR-004-consultar-mi-perfil-de-competencias.md) — `draft`
- [UXR-005 — Ver mi brecha frente a un Rol-Nivel](design/ux-requirements/UXR-005-ver-mi-brecha-frente-a-un-rol-nivel.md) — `draft`
- [UXR-006 — Buscar candidatos para un requerimiento](design/ux-requirements/UXR-006-buscar-candidatos-para-un-requerimiento.md) — `draft`

## Diseño — Generaciones Stitch

- [GEN-001 — Diseño Google Stitch del catálogo de roles y competencias (UXR-001)](design/stitch/GEN-001-catalogo-de-roles-y-competencias.md) — exploratorio, `draft`
- [GEN-002 — Diseño Google Stitch del shell y los estados transversales (UXR-000)](design/stitch/GEN-002-shell-y-estados-transversales.md) — exploratorio, `draft`

## Negocio — Modelo de información

- [IMD-001 — Modelo de información conceptual](business/information-model/IMD-001-modelo-de-informacion-conceptual.md) — `draft`
- [IMD-002 — Modelo conceptual de partes](business/information-model/IMD-002-modelo-conceptual-de-partes.md) — `draft`, CONDITIONAL

## Negocio — Glosario

- [GLS-001 — Glosario de negocio](business/glossary/GLS-001-glosario-de-negocio.md) — `draft`, 98 términos (59 aprobados)

## Negocio — Reglas

- [BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación](business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) — `draft`

## Requerimientos

- [SPEC-001 — Gestión de colaboradores (Party UDM)](requirement/specs/SPEC-001-gestion-de-colaboradores.md) — especificación de feature, `draft`, en revisión; registrada en todos los artefactos de la base
- [USC-001 — User Stories de la Plataforma de Gestión de Formación](requirement/USC-001-user-stories-plataforma-gestion-formacion.md) — `draft`
- [RCP-001 — H1 El idioma común](requirement/context-packs/RCP-001-h1-idioma-comun.md) — Requirement Context Pack, `draft`
- [RCP-002 — Gestión de colaboradores](requirement/context-packs/RCP-002-gestion-de-colaboradores.md) — Requirement Context Pack, `draft`
- User Stories refinadas de H1 (`draft`): [US-001](requirement/user-stories/US-001-definir-catalogo-de-competencias.md) · [US-002](requirement/user-stories/US-002-declarar-requerimientos-de-proyecto.md) · [US-003](requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md) · [US-004](requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md) · [US-005](requirement/user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md) · [US-006](requirement/user-stories/US-006-buscar-candidatos-para-un-requerimiento.md)
- User Stories de gestión de colaboradores (SPEC-001, `draft`; 4 READY, 7 CONDITIONAL): [US-015](requirement/user-stories/US-015-registrar-un-colaborador.md) · [US-016](requirement/user-stories/US-016-actualizar-datos-y-contactos.md) · [US-017](requirement/user-stories/US-017-gestionar-estructura-organizacional.md) · [US-018](requirement/user-stories/US-018-gestionar-proveedores-y-contratistas.md) · [US-019](requirement/user-stories/US-019-asignar-rol-nivel.md) · [US-020](requirement/user-stories/US-020-asignar-roles-del-programa.md) · [US-021](requirement/user-stories/US-021-dar-de-baja-a-un-colaborador.md) · [US-022](requirement/user-stories/US-022-vincular-identidad-de-acceso.md) · [US-023](requirement/user-stories/US-023-consultar-ficha-e-historial.md) · [US-024](requirement/user-stories/US-024-anonimizar-datos-personales.md) · [US-025](requirement/user-stories/US-025-configurar-plazo-y-aviso.md)

## Visión

- [VIS-001 — Plataforma de Gestión de Formación del Recurso Humano](vision/VIS-001-plataforma-gestion-formacion.md) — `draft`
