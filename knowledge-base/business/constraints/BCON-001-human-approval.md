---
type: Business Constraint
title: "BCON-001 — Aprobación Humana Obligatoria para Certificación"
description: "Ninguna certificación de nivel ocurre sin firma humana de un evaluador. La IA propone y justifica, pero no decide."
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:25:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [81, 101]
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
    lines: [65]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0012, EVD-2026-0111]
---

# BCON-001 — Aprobación Humana Obligatoria para Certificación

## Restricción

**Ninguna certificación de competencia ocurre sin la firma explícita de un evaluador humano.**

- En **H1:** El evaluador revisa evidencias y certifica manualmente.
- En **H3:** La IA propone nivel con justificación; el evaluador aprueba, ajusta o rechaza.

En ambos casos, **la decisión es humana y auditable**.

## Por Qué

1. **Riesgo de sesgo de IA:** Las máquinas pueden premiar volumen sobre calidad.
2. **Confianza:** Colaboradores y dirección confían en decisiones humanas validadas.
3. **Contexto:** Solo un humano entiende el contexto completo de una situación.
4. **Responsabilidad:** Alguien es responsable de cada certificación.

## Implicaciones

| Implicación | Impacto |
|-------------|--------|
| **Workflow obligatorio** | Cada certificación pasa por estado "pendiente aprobación" → evaluador revisa → aprueba/rechaza. |
| **Auditoría obligatoria** | Si el evaluador rechaza una propuesta de IA, debe registrar el motivo (EVD-2026-0111). |
| **No automatización total** | La IA en H3 NO puede autoproclamar certificaciones; siempre hay review. |
| **Escalabilidad** | Requiere suficientes evaluadores; RCP-Q1 abierta. |

## Evidencias Asociadas

- EVD-2026-0012: "Ninguna certificación sin firma humana; la IA propone pero no decide."
- EVD-2026-0111: "Ajustar o rechazar propuesta de IA exige registrar un motivo."
- BR-ACR-04: Regla de negocio equivalente.

## Horizonte

**H1, H2, H3** (restricción permanente)

---

**Validación Humana Pendiente:** Confirmación de workflow de aprobación
