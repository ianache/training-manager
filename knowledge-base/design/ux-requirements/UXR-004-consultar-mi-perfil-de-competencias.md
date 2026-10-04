---
type: UX Requirement
title: "UXR-004 — Consultar mi perfil de competencias"
description: "Lo que el colaborador necesita ver sobre sus niveles certificados, su historial y sus evidencias."
tags: [ux-ui, ux-requirement, perfil, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T18:00:00-05:00"
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

- Esta vista muestra los datos del propio colaborador (BR-TRA-01). Desde el 2026-09-27 (P-08) el resumen de sus niveles certificados, sus evidencias y sus certificaciones también los puede ver cualquier colaborador (BR-TRA-03, BR-TRA-05, BR-TRA-06; UXR-000.5). **Inferencia:** conviene que la vista lo indique para que el colaborador sepa qué es público. Las evidencias de GitLab solo se abren si el repositorio lo permite (BR-TRA-05).
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
| UXR-004-Q2 | ¿La vista del perfil de otro colaborador (resumen de niveles, evidencias y certificaciones, visibles para todos desde P-08) reutiliza esta vista en modo lectura, o es otra? No hay historia para ella todavía | Responsable de producto | Media |

## Actualización del 2026-10-04 (decisiones EVD-2026-0185 a 0237)

**Qué más ve el colaborador en su perfil:**

| ID | Necesidad | Fuente |
|---|---|---|
| UXR-004.5 | De cada competencia, el **nivel certificado vigente**: el más alto de sus certificaciones vigentes | EVD-2026-0186; BR-ACR-16 |
| UXR-004.6 | El historial de una competencia con el estado de cada certificación: vigente, **reemplazada** (por una recertificación) o **revocada**, y con las **evaluaciones no aprobadas** de la propia persona | EVD-2026-0192, 0185, 0224, 0229 |
| UXR-004.7 | De una revocación: el motivo tipificado, quién y cuándo, **y la descripción** (la ve la persona certificada) | EVD-2026-0206 |
| UXR-004.8 | De una evaluación no aprobada: el motivo tipificado y la descripción | EVD-2026-0231, 0234 a 0236 |
| UXR-004.9 | Para cada certificación, sus evidencias con la calificación CUMPLE o NO CUMPLE y su enlace (URL), reutilizables entre competencias | EVD-2026-0204, 0210, 0211 |

**Reglas visibles:**
- Las certificaciones no vencen (EVD-2026-0190): la interfaz no muestra fecha de vencimiento.
- Si la persona se anonimiza, sus certificaciones solo las ve ADMIN (EVD-2026-0218).
- Las evidencias de una certificación revocada siguen disponibles (EVD-2026-0219).
- El actor se muestra con el código de party, o solo con el nombre del rol si no lo tiene (EVD-2026-0222, 0226).
- Los enlaces de GitLab abren solo dentro de la organización o con VPN (EVD-2026-0207): la interfaz lo advierte junto al enlace.

**Preguntas que siguen abiertas:**

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| UXR-004-Q3 | ¿Se muestra la **evaluación no aprobada** al colaborador como parte de su historial? Se decidió que la ve (EVD-2026-0229); falta definir cómo se presenta para no desanimar o confundir con una certificación | Jefe de Ingeniería | Media |
| UXR-004-Q4 | El colaborador **registra sus evidencias** (EVD-2026-0215), pero US-004 es de solo lectura: ¿dónde lo hace? (ver UXR-003-Q3) | Jefe de Ingeniería | Alta |
