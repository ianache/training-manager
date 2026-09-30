---
type: Business Objective
title: "BO-003 — Certificación Transparente y Auditable de Competencias"
description: "Que cada nivel de competencia certificado sea respaldado por evidencia verificable, registrado con trazabilidad completa (quién, cuándo, evidencia) y sea transparent para el colaborador."
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:15:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [80-81, 101-104]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0011, EVD-2026-0012, EVD-2026-0016, EVD-2026-0129]
---

# BO-003 — Certificación Transparente y Auditable de Competencias

## Propósito

Que cada nivel de competencia certificado en un colaborador:
- Sea aprobado por un evaluador humano (firma humana obligatoria)
- Esté respaldado por evidencia concreta (formación, práctica, desempeño en GitLab)
- Sea trazable: quién certificó, cuándo, con qué evidencia
- Sea transparente: el colaborador ve su propio perfil, niveles, evidencias y propuestas de IA

## Principios

1. **Human-in-the-loop:** La IA propone y justifica, pero el evaluador humano decide.
2. **Evidencia sobre volumen:** Calidad y contexto pesan más que cantidad.
3. **Trazabilidad:** Auditoría completa de cada certificación.
4. **Transparencia:** El colaborador ve TODO sobre su propio perfil.

## Modelo Conceptual

```
Evidencia concreta (formación | práctica | desempeño GitLab)
         ↓
Propuesta de certificación (por evaluador o IA en H3)
         ↓
Revisión y validación por Evaluador
         ↓
Aprobación (firma humana) → Registro auditable
         ↓
Colaborador ve: nivel certificado + evidencia + auditoría
```

## KPIs Asociados

- **KPI 1 — Cobertura de roles:** Depende de certificaciones válidas
- **KPI 3 — Cierre de brechas:** Depende de niveles certificados
- **KPI 5 — Evidencia real (H3):** % de certificaciones L3+ respaldadas por GitLab

## Outcomes Esperados

1. No hay certificaciones sin justificación; cada una es verificable.
2. El colaborador confía en el sistema; ve su próprio progreso.
3. La dirección confía en los datos; son auditables.

## Restricciones Clave

- ✅ Ninguna certificación sin firma humana (RCON-001, BR-ACR-04).
- ✅ Cada nivel certificado es trazable hasta evidencias (RCON-002, BR-ACR-03).
- ✅ Evidencia concreta, dentro de una de 3 categorías (EVD-2026-0055).
- ✅ Requisitos pueden ser "requeridos" o "deseados" (EVD-2026-0098).
- ✅ En H1 es certificación manual; IA llega en H3 (EVD-2026-0022).

## Dependencias

- Definición de requisitos de evidencia (BR-ACR-07 a BR-ACR-08).
- Identificación de evaluadores (RCP-Q1).
- Modelo de datos auditable (SPEC-001).

## Horizonte

**H1 — El Idioma Común** (Certificación manual)  
**H3 — Evidencia Real con IA** (Propuestas automatizadas, aprobación humana)

---

**Validación Humana Pendiente:** Jefe de Ingeniería
