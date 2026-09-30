---
type: Business Risk
title: "BRISK-001 — Catálogo Desactualizado o Falta de Consenso"
description: "Si el catálogo de roles y competencias no se mantiene actualizado o hay desacuerdo entre productos, la plataforma pierde valor."
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:30:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [140, 142]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0024]
---

# BRISK-001 — Catálogo Desactualizado o Falta de Consenso

## Riesgo

**Probabilidad:** Media  
**Impacto:** Alto

Si el catálogo de roles, competencias y niveles no se mantiene actualizado o hay desacuerdo entre los 4 productos sobre qué competencias son comunes, la plataforma se vuelve menos útil:
- Los proyectos declaran requerimientos contra información desactualizada.
- No hay lenguaje común; la asignación vuelve a ser informal.
- KPI 1 (Cobertura), KPI 3 (Cierre de brechas) se degradan.

## Escenario

- Product A quiere añadir competencia "Machine Learning" al rol Developer.
- Product B ya la tiene, con requisitos de evidencia diferentes.
- ¿Quién decide cuál versión prevalece? ¿Cómo se actualiza?

## Mitigación Propuesta

1. **Governance clara:** El Jefe de Ingeniería es dueño del catálogo; decisiones en él.
2. **Versionado definido:** P-02 (abierta). Proponer:
   - Catálogo tiene versiones (1.0, 1.1, 1.2, ...).
   - Cambios se registran con fecha, autor, justificación.
   - Proyectos pueden estar atados a una versión o seguir la "latest".
3. **Comunicación con responsables de producto:** Validación de cambios antes de activar.
4. **Auditoría de cambios:** Trazabilidad de quién cambió qué y por qué.

## Dependencias

- **Pregunta abierta P-02:** Cómo se versiona el catálogo.
- **Pregunta abierta P-06:** Papel del Responsable de Producto vs. Jefe de Ingeniería.

## Horizonte

**H1** (crítico antes de lanzar) **→ H2, H3** (mantenimiento)

---

**Validación Humana Pendiente:** Estrategia de versionado
