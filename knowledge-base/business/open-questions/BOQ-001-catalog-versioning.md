---
type: Open Question
title: "BOQ-001 — Versionado del Catálogo de Competencias"
description: "¿Cómo se versiona el catálogo cuando cambian roles, competencias o requisitos de evidencia?"
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:40:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [151]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0024]
references:
  - brisk-001-catalog-drift
---

# BOQ-001 — Versionado del Catálogo de Competencias

## Pregunta

**¿Cómo se versiona el catálogo cuando cambian roles, competencias o requisitos de evidencia?**

Este mapeo es **P-02** en VIS-001.

## Contexto

- El catálogo es único y común a 4 productos.
- Cambia con el tiempo: se añaden competencias, roles, requisitos de evidencia.
- Los proyectos vigentes y históricos pueden estar atados a versiones distintas del catálogo.

## Opciones Bajo Consideración

| Opción | Pros | Contras |
|--------|------|---------|
| **Versiones discretas** (1.0, 1.1, 1.2) | Traceabilidad clara. Proyectos pueden estar atados a una versión. | Requiere decisión de cuándo incrementar. |
| **Catálogo "vivo"** (latest always) | Simplicidad; no hay gestión de versiones. | Cambios afectan todos los proyectos retroactivamente. Auditoría compleja. |
| **Branch por producto** (develop, production) | Control granular. | Rompe la premisa de catálogo común. |
| **Changelog + efectividad** (cambio toma efecto a fecha X) | Cambios planeados. Proyectos saben cuándo entra en vigor. | Requiere planificación adelantada. |

## Dependencias

- Impacta directamente en **BRISK-001** (catálogo drift).
- Afecta a **BO-001** (governance del catálogo).

## Bloques / Desbloquea

- **Bloqueante para H1:** Sí. Necesario para escribir historias sobre catálogo.
- **Respondida por:** Jefe de Ingeniería + responsables de producto.

## Horizonte

**H1 — Q4 2026** (debe resolverse antes de lanzar)

---

**Propietario:** Jefe de Ingeniería  
**Prioridad:** Alta (Bloqueante)
