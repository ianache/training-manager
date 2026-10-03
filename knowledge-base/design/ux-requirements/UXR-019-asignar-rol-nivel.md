---
type: UX Requirement
title: "UXR-019 — Asignar un Rol-Nivel a una persona"
description: "Lo que el Jefe de Ingeniería o un ADMIN necesita ver y hacer para asignar Rol-Nivel del catálogo a un colaborador vigente, cambiar su nivel y consultar el historial."
tags: [ux-ui, ux-requirement, party, rol-nivel, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-03T23:30:00-05:00"
sources:
  - id: us-019
    resource: /knowledge-base/requirement/user-stories/US-019-asignar-rol-nivel.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: dsp-001
    resource: /knowledge-base/requirement/scope-packs/DSP-001-catalogo-de-roles-y-niveles.md
  - id: uxr-001
    resource: /knowledge-base/design/ux-requirements/UXR-001-gestionar-catalogo-de-roles-y-competencias.md
---

# UXR-019 — Asignar un Rol-Nivel a una persona

## Trazabilidad

- **Historia:** [US-019](../../requirement/user-stories/US-019-asignar-rol-nivel.md), AC-1 a AC-5.
- **Reglas:** BR-PTY-11, BR-PTY-12, BR-PRF-01 a BR-PRF-03, BR-CAT-09, BR-CAT-13, BR-CAT-14, BR-CAT-18, BR-PTY-14, BR-PTY-17.
- **Decisiones del 2026-10-03:** EVD-2026-0145 (decide el Jefe de Ingeniería o ADMIN), 0146 (solo colaboradores vigentes), 0151 (ADMIN cambia el nivel directamente).
- **Catálogo:** [UXR-001](UXR-001-gestionar-catalogo-de-roles-y-competencias.md); lista de roles y niveles de [API-SPEC-003](../../architecture/api/API-SPEC-003-catalogo-de-roles-y-competencias.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Que el perfil y la brecha de cada persona se midan contra el Rol-Nivel correcto, con su historial.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-019.1 | Los Rol-Nivel vigentes de la persona, con su fecha desde | AC-1, AC-2; BR-PTY-11 |
| UXR-019.2 | El historial: asignaciones anteriores con su vigencia cerrada | AC-4; BR-PTY-12 |
| UXR-019.3 | El catálogo de roles y, por rol, sus niveles con su nombre (la cantidad varía por rol) | BR-CAT-09 |
| UXR-019.4 | Al subir de nivel, las competencias de los niveles inferiores que la persona aún no ha cumplido | AC-5; BR-PRF-03 |
| UXR-019.5 | Que cambiar de nivel **cierra** el anterior (aviso previo a confirmar) | US-019 §10 |

## Acciones

| ID | El usuario puede… | Fuente |
|---|---|---|
| UXR-019.6 | Asignar un Rol-Nivel, con fecha desde, a un colaborador **vigente** | AC-1; EVD-2026-0146 |
| UXR-019.7 | Asignar varios roles a la misma persona | AC-2 |
| UXR-019.8 | Cambiar el nivel en un rol, con fecha desde | AC-3; EVD-2026-0151 |

## Reglas que la interfaz debe hacer visibles

- Solo hay un nivel vigente por rol: al elegir otro nivel del mismo rol se muestra que cerrará el actual (BR-PTY-11).
- Solo se ofrecen Rol-Nivel del catálogo y niveles que el rol define (BR-CAT-09). Un Rol-Nivel que deja de estar disponible se avisa, no se oculta en silencio (estado «no disponible en el catálogo»).
- **Subir de nivel exige haber cumplido las competencias de los niveles inferiores** (BR-PRF-03): si faltan, no se permite y se listan las pendientes (AC-5). **Inferencia a confirmar:** «cumplida» = certificada al menos en el nivel L1–L4 que exige el Rol-Nivel inferior.
- El **nivel inicial** al registrar al colaborador no exige competencias certificadas (BR-PRF-02): esa pantalla es el paso «Rol-Nivel inicial» de UXR-015, no esta.
- Solo se asigna a **colaboradores vigentes**; una persona anonimizada no se edita (BR-PTY-14).
- Asignan o cambian niveles el Jefe de Ingeniería y ADMIN (EVD-2026-0145, 0151). El resto no ve las acciones (UXR-000.2). Al no ser el Jefe de Ingeniería ni ADMIN: estado «sin permisos».
- El rol (y el resumen de niveles certificados) de una persona lo ve cualquier colaborador (BR-PTY-20, BR-TRA-03).
- La interfaz no pide escala salarial ni criterios de nivel (BR-CAT-18).

## Estados

- **Sin asignaciones:** la persona no tiene Rol-Nivel vigente.
- **Con asignaciones:** vigentes e historial.
- **Éxito:** asignación o cambio de nivel registrado.
- **Bloqueado:** faltan competencias de niveles inferiores (AC-5); persona no vigente o anonimizada; Rol-Nivel no disponible; sin permisos.
- **Carga y error:** según UXR-000.

## Supuestos

- La pantalla vive en la ficha de la persona (US-019 §10: ficha → asignaciones → asignar o cambiar → confirmar).
- El catálogo y la asignación son servicios distintos (ADR-011): si el catálogo no responde, la pantalla muestra error y no permite asignar; no hay ASR que fije el comportamiento.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| ~~UXR-019-Q1~~ | ~~US-019 y BR-PTY-17 dicen «solo el Jefe de Ingeniería» asigna, pero EVD-2026-0151 añade que ADMIN cambia el nivel directamente: ¿ADMIN también asigna un Rol-Nivel nuevo (no solo cambia)? ¿Hay que ajustar BR-PTY-17?~~ Respondida (ianache, 2026-10-03): ADMIN también asigna; BR-PTY-17 se amplía (EVD-2026-0163). | Jefe de Ingeniería | Alta |
| ~~UXR-019-Q2~~ | ~~¿«Haber cumplido» una competencia significa tenerla certificada en el nivel L que exige el Rol-Nivel inferior? (inferencia de AC-5)~~ Respondida (ianache, 2026-10-03): sí, certificada en el nivel L que exige el Rol-Nivel inferior (EVD-2026-0164). | Jefe de Ingeniería | Alta |
| ~~UXR-019-Q3~~ | ~~¿Basta con cumplir los niveles inferiores o también las del nivel destino? (P-42, parte abierta)~~ Respondida (ianache, 2026-10-03): también las del nivel destino, todas certificadas (lectura A, EVD-2026-0169, 0172). | Jefe de Ingeniería | Media |
| ~~UXR-019-Q4~~ | ~~¿Puede ADMIN saltarse AC-5 al cambiar directamente el nivel?~~ Respondida (ianache, 2026-10-03): no (EVD-2026-0170). | Jefe de Ingeniería | Alta |
