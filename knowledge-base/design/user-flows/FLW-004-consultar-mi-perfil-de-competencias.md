---
id: FLW-004
type: User Flow
title: "FLW-004 — Consultar mi perfil de competencias"
description: "Flujo del colaborador para ver su nivel certificado vigente por competencia, su historial (vigentes, reemplazadas, revocadas y evaluaciones no aprobadas) y las evidencias de cada una."
tags: [ux-ui, user-flow, perfil, certificacion, evidencia]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-04T12:30:00-05:00"
sources:
  - id: uxr-004
    resource: /knowledge-base/design/ux-requirements/UXR-004-consultar-mi-perfil-de-competencias.md
  - id: us-004
    resource: /knowledge-base/requirement/user-stories/US-004-consultar-mi-perfil-de-competencias.md
  - id: dsp-002
    resource: /knowledge-base/requirement/scope-packs/DSP-002-certificacion-y-perfil.md
  - id: api-spec-005
    resource: /knowledge-base/architecture/api/API-SPEC-005-certificaciones-y-evidencias.md
requirements: [US-004, UXR-004]
screens: [SCR-004-01, SCR-004-02]
---

# FLW-004 — Consultar mi perfil de competencias

## Trazabilidad

- **Lineage:** US-004 (AC-1 a AC-3) → UXR-004 → FLW-004 → SCR-004-01..02.
- **Reglas:** BR-TRA-01, 03, 05 a 09, BR-ACR-03, 15, 16, 24; decisiones EVD-2026-0185 a 0237.
- **Pantallas (IDs reservados):**

| SCR | Propósito en el flujo |
|---|---|
| SCR-004-01 | Mi perfil: el nivel certificado vigente de cada competencia, con fecha y quién lo certificó; estado vacío |
| SCR-004-02 | Una competencia: historial de certificaciones (vigente, reemplazada, revocada), evaluaciones no aprobadas propias y evidencias con su calificación |

Cada SCR debe declarar `flow: FLW-004`.

## Happy path

**Actor:** colaborador. **Objetivo:** saber qué nivel tiene certificado y con qué respaldo.

1. Abre su perfil (SCR-004-01) y ve, por competencia, el nivel certificado vigente (el más alto de sus certificaciones vigentes).
2. Elige una competencia y abre SCR-004-02: ve el historial de certificaciones con su estado y las evidencias de cada una con su calificación CUMPLE o NO CUMPLE y su enlace.
3. Si una certificación fue revocada, ve el motivo tipificado, quién y cuándo y la descripción; si tiene evaluaciones no aprobadas, ve su motivo y descripción.

**Variante perfil de otra persona:** el resumen de niveles lo ve cualquier colaborador (BR-TRA-03) y las evidencias y certificaciones también (BR-TRA-05, 06); se oculta la descripción de una revocación y las evaluaciones no aprobadas (UXR-004-Q2: si es la misma vista en modo lectura o una distinta sigue abierto; no hay historia).

## Excepciones, permisos y estados

| Id | Situación | Comportamiento del flujo | Origen |
|---|---|---|---|
| E1 | Sin certificaciones | Estado vacío: «Todavía no tienes niveles certificados» | AC-3 |
| E2 | Competencia con certificación revocada | La revocada aparece en el historial con su estado; el nivel vigente es el más alto de las vigentes restantes | EVD-2026-0186, 0185 |
| E3 | Competencia solo con evaluaciones no aprobadas | Sin nivel vigente; se muestra el historial | EVD-2026-0224 |
| E4 | Enlace de GitLab | Advertencia: abre solo dentro de la organización o con VPN | EVD-2026-0207 |
| E5 | Persona anonimizada | Solo ADMIN ve sus certificaciones; los demás reciben un aviso de acceso restringido | EVD-2026-0218, 0225 |
| E6 | Error o carga | Según UXR-000 | UXR-000 |
| E7 | Actor sin código de party | Se muestra solo el nombre del rol | EVD-2026-0226 |

**Estados de SCR-004-01:** cargando, vacío, con niveles, error. **SCR-004-02:** cargando, historial, con revocada, con evaluación no aprobada, restringida (persona anonimizada), error.

**Permisos:** el propio colaborador ve todo lo suyo, incluida la descripción de revocaciones y evaluaciones no aprobadas; los demás ven según BR-TRA-03, 05, 06 y las excepciones BR-TRA-07 a 09.

**Accesibilidad (UXR-000, WCAG 2.2 AA):** nivel con su nombre (Principiante, Autónomo, Avanzado, Experto / Referente) y no solo color; estados del historial con texto e icono; teclado completo; foco visible.

**Fuera de este flujo:** registrar evidencias (sin historia: UXR-004-Q4); la brecha (UXR-005); certificar (FLW-003).

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| UXR-004-Q3 | Cómo presentar una evaluación no aprobada al colaborador | Jefe de Ingeniería | Media | SCR-004-02 |
| UXR-004-Q4 | ¿Dónde registra el colaborador sus evidencias? | Jefe de Ingeniería | Alta | Fuera de este flujo |
| UXR-004-Q2 | ¿Perfil de otra persona: misma vista o distinta? | Responsable de producto | Media | Variante |
