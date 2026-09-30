---
type: Open Question
title: "BOQ-002 — Identificación Exacta de Evaluadores"
description: "¿Quiénes exactamente son los evaluadores que certifican niveles de competencia? ¿Solo el Jefe de Ingeniería o hay otros roles?"
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:40:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [46]
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
    lines: [86]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0062, EVD-2026-0105, EVD-2026-0113]
references:
  - bcon-001-human-approval
---

# BOQ-002 — Identificación Exacta de Evaluadores

## Pregunta

**¿Quiénes exactamente son los evaluadores que certifican niveles de competencia?**

Variantes:
1. ¿Solo el Jefe de Ingeniería?
2. ¿El Jefe de Ingeniería + otros evaluadores designados?
3. ¿Instructor del curso también puede evaluar? (Propuesta en consideración — EVD-2026-0113)
4. ¿Gestión de Formación / RR.HH. puede evaluar?

Esta es **RCP-Q1** en RCP-001.

## Contexto

- La plataforma requiere evaluadores humanos para certificar niveles (BCON-001).
- VIS-001:L46 menciona "Instructor / evaluador" como rol, pero no define exactamente quién es quién.
- BRC-001 confirma: "El Evaluador y el Jefe de Ingeniería son solo gestores del programa" (EVD-2026-0105).

## Por Qué Importa

- Define quiénes acceden a "Evaluar" en la UI.
- Define quiénes reciben notificaciones de certificaciones pendientes.
- Afecta a BO-003 (transparencia y auditoría).
- Impacta en escalabilidad: si solo el Jefe de Ingeniería, cuello de botella.

## Opciones Bajo Consideración

| Opción | Pros | Contras |
|--------|------|---------|
| **Solo Jefe de Ingeniería** | Governance centralizado. Decisiones consistentes. | Cuello de botella; no escala si hay muchas certificaciones. |
| **Jefe + Evaluadores designados** | Distribuye carga. Puede haber especialistas por dominio. | Requiere gestión de permisos más compleja. Requiere definir quién designa evaluadores. |
| **Instructor + Jefe** | Instructor sabe el desempeño en el curso; Jefe valida. | ¿Qué pasa si hay desacuerdo? ¿Quién tiene voto final? |
| **Cualquier usuario ADMIN** | Máxima flexibilidad. | Riesgo: aprobar sin entender el dominio. |

## Dependencias

- Impacta a STK-001 (Jefe de Ingeniería).
- Impacta a STK-002 (Gestor de Formación, si evalúa).

## Bloques / Desbloquea

- **Bloqueante para H1:** Sí. Debe estar claro antes de escribir historias sobre certificación.
- **Respondida por:** Jefe de Ingeniería.

## Horizonte

**H1 — Q4 2026** (debe resolverse antes de lanzar)

---

**Propietario:** Jefe de Ingeniería  
**Prioridad:** Alta (Bloqueante)
