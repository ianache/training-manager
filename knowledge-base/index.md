---
type: Knowledge Base Index
title: "UX/UI Knowledge Base Index"
description: "Índice de los artefactos de conocimiento UX/UI almacenados en esta base."
tags: [ux-ui, knowledge-base, index]
status: draft
generated:
  by: "manual/1.0"
  at: "2026-09-27T18:15:00-05:00"
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
  - id: adr-009
    resource: /knowledge-base/architecture/adrs/ADR-009-composicion-de-microuis-con-native-federation.md
  - id: adr-010
    resource: /knowledge-base/architecture/adrs/ADR-010-lenguaje-del-bff-nodejs.md
  - id: rcp-004
    resource: /knowledge-base/requirement/context-packs/RCP-004-catalogo-de-cursos-con-filtros.md
  - id: rqs-001
    resource: /knowledge-base/requirement/specs/RQS-001-catalogo-de-cursos-con-filtros.md
---

# Índice de la base de conocimiento

## Arquitectura

- [ADR-001 — Estructura: shell y microUIs en Angular, BFF en Node.js](architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) — Aceptado (`human:ianache`), `draft`
- [ADR-002 — Autenticación en el BFF con Keycloak y PKCE](architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md) — Aceptado (`human:ianache`), `draft`
- [ADR-003 — Persistencia compatible con MySQL y PostgreSQL](architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md) — Aceptado (`human:ianache`), `draft`
- [ADR-004 — Secretos y parametría en HashiCorp Vault](architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md) — Aceptado (`human:ianache`), `draft`
- [ADR-009 — Composición de microUIs con Native Federation](architecture/adrs/ADR-009-composicion-de-microuis-con-native-federation.md) — **Rechazado** (`human:ianache`, 2026-09-30), `draft`
- [ADR-010 — Lenguaje del BFF: Node.js](architecture/adrs/ADR-010-lenguaje-del-bff-nodejs.md) — Aceptado (`human:ianache`, 2026-09-30), `draft`. Reemplaza en parte a ADR-008
- [ADR-011 — catalog-service como microservicio propio](architecture/adrs/ADR-011-catalog-service-como-microservicio-propio.md) — Aceptado (`human:ianache`, 2026-10-04), `draft`
- [ADR-012 — Reintentos con espera creciente y cortacircuito](architecture/adrs/ADR-012-reintentos-con-espera-creciente-y-cortacircuito.md) — Aceptado (`human:ianache`, 2026-10-04), `draft`; parámetros sin decidir
- [ACP-001 — Architecture Context Pack](architecture/ACP-001-architecture-context-pack.md) — DRAFT, no READY_FOR_ARQ_102
- [AIM-001 — Matriz de impacto de arquitectura](architecture/AIM-001-matriz-impacto-arquitectura.md) — `draft`
- [ADB-001 — Descubrimiento de arquitectura](architecture/ADB-001-descubrimiento-arquitectura-plataforma.md) — Architecture Discovery Brief, `draft`
- [Catálogo de candidatos ASR](architecture/asr/asr-catalog.md) — 9 candidatos pendientes de disposición del arquitecto, `draft`

- [API-SPEC-002 — Organizaciones (unidades y proveedores): consulta y alta](architecture/api/API-SPEC-002-organizations.md) — Technical Design, `draft`; implementado
- [API-SPEC-003 — Catálogo de roles, niveles y competencias con versiones](architecture/api/API-SPEC-003-catalogo-de-roles-y-competencias.md) — Technical Design, `draft`, REQUIRES_REVIEW; sin implementar
- [DCP-003 — Development Context Pack: catálogo de roles y niveles](architecture/ad-handoff/DCP-003-catalogo-de-roles-y-niveles.md) — `REQUIRES_REVIEW`; alcance completo de DSP-001

## Arquitectura — Modelo de datos

- [LDM-001 — Modelo lógico de partes](architecture/data-model/LDM-001-modelo-logico-de-partes.md) — `draft`, REQUIRES_REVIEW
- [LDM-002 — Modelo de datos del catálogo](architecture/data-model/LDM-002-modelo-de-datos-del-catalogo.md) — `draft`, REQUIRES_REVIEW (DDL en `architecture/data-model/ddl/catalog-postgresql.sql`)
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

## Diseño — Proyecto Stitch y trazabilidad

- [STP-PPM-001 — Proyecto Stitch «Plataforma PPM»](design/projects/STP-PPM-001-plataforma-ppm.md) — Design Project, `draft`
- [DTM-PPM-001 — Design Traceability Map](design/traceability/DTM-PPM-001-plataforma-ppm.md) — Design Traceability Map, `draft`
- [HOF-PPM-001 — Handoff de diseño: Registrar un colaborador](design/handoff/HOF-PPM-001-registrar-colaborador.md) — UX Development Handoff, `draft`; gate `DESIGN_READY_FOR_DEV` = FAILED
- Revisión de componentes de DTC-015 (`readiness: REQUIRES_REVIEW`): [revisión técnica](design/components/dtc-015/technical-design-review.md) · [inventario UI](design/components/dtc-015/ui-inventory.md) · [catálogo atómico](design/components/dtc-015/atomic-component-catalog.md) · [frontera MicroUI](design/components/dtc-015/micro-ui-boundary-analysis.md) · [contrato NPM](design/components/dtc-015/npm-package-contract.md)
- [TKN-SET-001 — Tokens «Sovereign Enterprise»](design/tokens/TKN-SET-001-sovereign-enterprise.md) — Design Tokens, `draft`; **reemplazado** por TKN-SET-002 (2026-10-02)
- [TKN-SET-002 — Tokens «Comsatel Styled»](design/tokens/TKN-SET-002-comsatel-styled.md) — Design Tokens, `draft`; base vigente de toda la plataforma, sustituye a TKN-SET-001
- [GEN-015 — Diseño Stitch: Registrar un colaborador](design/generations/GEN-015-stitch-registrar-colaborador.md) — Stitch Generation, `draft` (ejecución 2026-10-01 añadida)
- [UXR-016 — Actualizar datos y medios de contacto](design/ux-requirements/UXR-016-actualizar-datos-y-contactos.md) — UX Requirement, `draft`
- [UXR-017 — Registrar la organización interna](design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md) — UX Requirement, `draft`
- [UXR-019 — Asignar un Rol-Nivel a una persona](design/ux-requirements/UXR-019-asignar-rol-nivel.md) — UX Requirement, `draft`
- [FLW-001 — Gestionar el catálogo de roles y competencias](design/user-flows/FLW-001-gestionar-catalogo-de-roles-y-competencias.md) — User Flow, `draft`; pantallas SCR-001-01..04 reservadas
- [FLW-019 — Asignar un Rol-Nivel a una persona](design/user-flows/FLW-019-asignar-rol-nivel.md) — User Flow, `draft`; pantallas SCR-019-01..03 reservadas
- [SCR-001 — Gestionar el catálogo de roles y competencias](design/screens/SCR-001-gestionar-catalogo-de-roles-y-competencias.md) — Screen, `draft`; SCR-001-01..04
- [SCR-019 — Asignar un Rol-Nivel a una persona](design/screens/SCR-019-asignar-rol-nivel.md) — Screen, `draft`; SCR-019-01..03
- [GEN-001-G — Diseño Stitch del catálogo de roles y competencias (gobernado)](design/generations/GEN-001-G-stitch-catalogo-de-roles-y-competencias.md) — Stitch Generation, `draft`; exploración, SCR-001-01..04
- [GEN-019 — Diseño Stitch de asignar un Rol-Nivel](design/generations/GEN-019-stitch-asignar-rol-nivel.md) — Stitch Generation, `draft`; exploración, SCR-019-01..03
- [UXR-028 — Listar y buscar unidades organizacionales](design/ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md) — UX Requirement, `draft`
- [UXR-029 — Registrar y editar unidades organizacionales](design/ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md) — UX Requirement, `draft`
- [UXR-030 — Desactivar y reactivar unidades organizacionales](design/ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md) — UX Requirement, `draft`
- [FLW-017 — Registrar la organización interna](design/user-flows/FLW-017-registrar-la-organizacion-interna.md) — User Flow, `draft`; SCR-017-01..03; 5 preguntas abiertas
- [FLW-028 — Listar y buscar unidades organizacionales](design/user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md) — User Flow, `draft`; SCR-028-01; 6 preguntas abiertas
- [FLW-029 — Registrar y editar unidades organizacionales](design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md) — User Flow, `draft`; SCR-029-01..04; 7 preguntas abiertas
- [FLW-030 — Desactivar y reactivar unidades organizacionales](design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md) — User Flow, `draft`; SCR-030-01..04; 6 preguntas abiertas
- [SCR-017 — Registrar la organización interna](design/screens/SCR-017-registrar-la-organizacion-interna.md) — Screen (3 pantallas), `draft`; preflight READY; 8 preguntas abiertas
- [SCR-028 — Listar y buscar unidades organizacionales](design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md) — Screen (1 pantalla), `draft`; preflight READY; 5 preguntas abiertas
- [SCR-029 — Registrar y editar unidades organizacionales](design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md) — Screen (4 pantallas), `draft`; preflight READY; 15 preguntas abiertas
- [SCR-030 — Desactivar y reactivar unidades organizacionales](design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md) — Screen (4 pantallas), `draft`; preflight READY; 8 preguntas abiertas
- [GEN-017 — Diseño Stitch: Registrar la organización interna](design/generations/GEN-017-stitch-registrar-la-organizacion-interna.md) — Stitch Generation, `draft`; SCR-017-01..03 registradas en DTM-PPM-001; 13 hallazgos de revisión
- [GEN-028 — Diseño Stitch: Listar y buscar unidades organizacionales](design/generations/GEN-028-stitch-listar-y-buscar-unidades-organizacionales.md) — Stitch Generation, `draft`; SCR-028-01 registrada en DTM-PPM-001; 12 hallazgos de revisión
- [GEN-029 — Diseño Stitch: Registrar y editar unidades organizacionales](design/generations/GEN-029-stitch-registrar-y-editar-unidades-organizacionales.md) — Stitch Generation, `draft`; **incompleta**: SCR-029-01 y 02 registradas; SCR-029-03 y 04 sin localizar
- [GEN-030 — Diseño Stitch: Desactivar y reactivar unidades organizacionales](design/generations/GEN-030-stitch-desactivar-y-reactivar-unidades-organizacionales.md) — Stitch Generation, `draft`; **incompleta**: SCR-030-01..03 registradas; SCR-030-04 sin localizar
- [ARP-SCR-017-01](design/handoff/ARP-SCR-017-01-organizacion-interna.md), [ARP-SCR-017-02](design/handoff/ARP-SCR-017-02-registrar-la-organizacion-interna.md), [ARP-SCR-017-03](design/handoff/ARP-SCR-017-03-acceso-no-autorizado.md) — Accessibility Report (HTML exploratorio de Stitch, revisión estática), `draft`; las tres `fail` (14/4/3, 12/8/7, 15/1/4 en pass/fail/inconclusive)
- [ARP-SCR-028-01](design/handoff/ARP-SCR-028-029-scr-028-01-lista-y-jerarquia.md), [ARP-SCR-029-01](design/handoff/ARP-SCR-028-029-scr-029-01-registrar-unidad.md), [ARP-SCR-029-02](design/handoff/ARP-SCR-028-029-scr-029-02-editar-nombre.md) — Accessibility Report, `draft`; las tres `fail` (9, 10 y 6 hallazgos)
- [ARP-SCR-030](design/handoff/ARP-SCR-030-desactivar-y-reactivar-unidades-organizacionales.md) — Accessibility Report de SCR-030-01..03, `draft`; las tres `fail`; SCR-030-04 sin exploración
- [ARP-SCR-030-04 — Reactivación bloqueada por padre Inactivo](design/handoff/ARP-SCR-030-04-reactivacion-bloqueada.md) — Accessibility Report, `draft`, resultado `fail`
- [ARP-SCR-029-03 — Cambiar unidad padre](design/handoff/ARP-SCR-029-03-cambiar-unidad-padre.md) — Accessibility Report, `draft`, resultado `fail`
- [ARP-SCR-029-04 — Historial de relaciones y vigencias](design/handoff/ARP-SCR-029-04-historial-de-relaciones.md) — Accessibility Report, `draft`, resultado `fail`
- [ARP-UNIDADES-V2 — Regeneración de las pantallas de unidades organizacionales](design/handoff/ARP-UNIDADES-REGENERACION-v2.md) — Accessibility Report, `draft`, 2 `fail` y 14 `inconclusive`
- [UXS-001 anexo — Preguntas abiertas por responsable](design/specs/UXS-001-anexo-preguntas-por-responsable.md) — UX Open Questions Digest, `draft`; 77 preguntas fusionadas en 44, 21 de negocio para `af-requirements-orchestrator`
- [UXS-001 — Gestión de la estructura organizacional](design/specs/UXS-001-gestion-de-unidades-organizacionales.md) — UX Design Specification, `draft`; Stitch y QA CONDITIONAL, Figma y Desarrollo NOT READY
- [FLW-016 — Actualizar datos y medios de contacto](design/user-flows/FLW-016-actualizar-datos-y-contactos.md) — User Flow, `draft`
- [SCR-016 — Actualizar datos y medios de contacto](design/screens/SCR-016-actualizar-datos-y-contactos.md) — Screen (6 pantallas), `draft`; preguntas Q1, Q2, Q5, Q6, Q12 y Q15 decididas; Q16 a Q18 nuevas
- [IB-016 — Intent Brief: Actualizar datos y medios de contacto](design/explorations/IB-016-actualizar-datos-y-contactos.md) — Intent Brief, `draft`; alternativas pendientes (Claude Design sin conexión)
- [CMP-016 — Componentes: Actualizar datos y medios de contacto](design/components/CMP-016-componentes-actualizar-datos-y-contactos.md) — Component (11 especificaciones en `design/components/cmp-016/`), `draft`, `REQUIRES_REVIEW`; 13 preguntas abiertas
- [GEN-016 — Diseño Stitch: Actualizar datos y medios de contacto](design/generations/GEN-016-stitch-actualizar-datos-y-contactos.md) — Stitch Generation, `draft`; 6 pantallas exploratorias (SCR-016-01..06) registradas en DTM-PPM-001; 13 hallazgos de revisión

## Negocio — Modelo de información

- [IMD-001 — Modelo de información conceptual](business/information-model/IMD-001-modelo-de-informacion-conceptual.md) — `draft`; 2026-10-03: enlaza TRM-0106, el catálogo de cursos es una vista (RCP-004), IM-Q13 nueva
- [IMD-002 — Modelo conceptual de partes](business/information-model/IMD-002-modelo-conceptual-de-partes.md) — `draft`, CONDITIONAL

## Negocio — Glosario

- [GLS-001 — Glosario de negocio](business/glossary/GLS-001-glosario-de-negocio.md) — `draft`, 106 términos (59 aprobados); TRM-0106 Curso y GQ-38 añadidos el 2026-10-03 (RCP-004)

## Negocio — Reglas

- [BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación](business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) — `draft`; 2026-10-03: BR-FOR-11 a 17 (2 propuestas sin validar y 5 vacíos), P-55 a P-60, EVD-2026-0136 a 0138 (RCP-004)

## Requerimientos

- [SPEC-001 — Gestión de colaboradores (Party UDM)](requirement/specs/SPEC-001-gestion-de-colaboradores.md) — especificación de feature, `draft`, en revisión; registrada en todos los artefactos de la base
- [RQS-001 — Catálogo de cursos con filtros](requirement/specs/RQS-001-catalogo-de-cursos-con-filtros.md) — Requirements Specification, `draft`; CONDITIONAL; preparación por rol: Arquitecto, QA y UX/UI CONDITIONAL, Developer NOT READY
- [USC-001 — User Stories de la Plataforma de Gestión de Formación](requirement/USC-001-user-stories-plataforma-gestion-formacion.md) — `draft`
- [RCP-001 — H1 El idioma común](requirement/context-packs/RCP-001-h1-idioma-comun.md) — Requirement Context Pack, `draft`
- [RCP-002 — Gestión de colaboradores](requirement/context-packs/RCP-002-gestion-de-colaboradores.md) — Requirement Context Pack, `draft`
- [RCP-004 — Catálogo de cursos con filtros](requirement/context-packs/RCP-004-catalogo-de-cursos-con-filtros.md) — Requirement Context Pack, `draft`, NOT READY para historias (15 vacíos)
- User Stories refinadas de H1 (`draft`): [US-001](requirement/user-stories/US-001-definir-catalogo-de-competencias.md) · [US-002](requirement/user-stories/US-002-declarar-requerimientos-de-proyecto.md) · [US-003](requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md) · [US-004](requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md) · [US-005](requirement/user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md) · [US-006](requirement/user-stories/US-006-buscar-candidatos-para-un-requerimiento.md)
- User Stories de gestión de colaboradores (SPEC-001, `draft`; 4 READY, 7 CONDITIONAL): [US-015](requirement/user-stories/US-015-registrar-un-colaborador.md) · [US-016](requirement/user-stories/US-016-actualizar-datos-y-contactos.md) · [US-017](requirement/user-stories/US-017-gestionar-estructura-organizacional.md) · [US-028](requirement/user-stories/US-028-listar-y-buscar-unidades-organizacionales.md) · [US-029](requirement/user-stories/US-029-registrar-y-editar-unidades-organizacionales.md) · [US-030](requirement/user-stories/US-030-desactivar-y-reactivar-unidades-organizacionales.md) · [US-018](requirement/user-stories/US-018-gestionar-proveedores-y-contratistas.md) · [US-019](requirement/user-stories/US-019-asignar-rol-nivel.md) · [US-020](requirement/user-stories/US-020-asignar-roles-del-programa.md) · [US-021](requirement/user-stories/US-021-dar-de-baja-a-un-colaborador.md) · [US-022](requirement/user-stories/US-022-vincular-identidad-de-acceso.md) · [US-023](requirement/user-stories/US-023-consultar-ficha-e-historial.md) · [US-024](requirement/user-stories/US-024-anonimizar-datos-personales.md) · [US-025](requirement/user-stories/US-025-configurar-plazo-y-aviso.md)
- User Stories del catálogo de cursos (RCP-004, `draft`, 2 CONDITIONAL): [US-026](requirement/user-stories/US-026-explorar-el-catalogo-de-cursos.md) · [US-027](requirement/user-stories/US-027-ubicar-cursos-con-filtros.md)

## Visión

- [VIS-001 — Plataforma de Gestión de Formación del Recurso Humano](vision/VIS-001-plataforma-gestion-formacion.md) — `draft`
