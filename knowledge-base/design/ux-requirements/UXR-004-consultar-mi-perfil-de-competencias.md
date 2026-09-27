---
type: UX Requirement
title: "UXR-004 — Consultar mi perfil de competencias"
description: "Lo que el colaborador necesita ver sobre sus niveles certificados, su historial y sus evidencias."
tags: [ux-ui, ux-requirement, perfil, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T13:30:00-05:00"
sources:
  - id: us-004
    resource: /knowledge-base/requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
---

# UXR-004 — Consultar mi perfil de competencias

## Trazabilidad

- **Historia:** [US-004](../../requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md), criterios AC-1 a AC-3. Es la única historia READY.
- **Reglas:** BR-TRA-01, BR-ACR-03, BR-PRF-01.
- **Conceptos (IMD-001):** Colaborador, Rol, Certificación, Nivel certificado, Evidencia.
- **Actor:** [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Saber qué nivel tiene certificado en cada competencia y con qué respaldo.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-004.1 | Su rol asignado | BR-PRF-01 |
| UXR-004.2 | Cada competencia con su nivel certificado, la fecha, quién lo certificó y sus evidencias | AC-1; BR-ACR-03 |
| UXR-004.3 | El historial de certificaciones de una competencia | AC-2; VIS-001:L76 |

## Acciones

- **UXR-004.4:** consultar el detalle de una certificación y de sus evidencias (AC-1). No hay acciones de edición: el perfil es de lectura.

## Reglas que la interfaz debe hacer visibles

- Solo muestra los datos del propio colaborador (BR-TRA-01; UXR-000.5).
- El nivel se expresa en la escala L1–L4 con su nombre (Principiante, Autónomo, Avanzado, Experto / Referente), sin depender solo del color (UXR-000.3).

## Estados

- **Vacío:** "Todavía no tienes niveles certificados" (AC-3).
- **Carga, error y sesión vencida:** según UXR-000.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| P-28 | ¿El perfil muestra un nivel de rol (por ejemplo, Developer Junior 2)? Respondida (ianache (Jefe de Ingeniería), 2026-09-27): el colaborador tiene un nivel de rol, asignado al registrarlo (BR-PRF-02). Si el perfil lo muestra es una decisión de UX pendiente | Jefe de Ingeniería | Media |
| P-33 | ¿Un colaborador tiene uno o varios roles asignados? | Jefe de Ingeniería | Alta |
| UXR-004-Q1 | ¿El perfil muestra también las competencias exigidas por su rol que todavía no tiene certificadas? Eso se acerca a la brecha (UXR-005) | Responsable de producto | Media |
