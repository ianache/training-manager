---
type: Business Objective
title: "BO-002 — Matching Demanda-Oferta de Competencias"
description: "Que cada proyecto encuentre, en tiempo mínimo, colaboradores cuyas competencias certificadas se ajusten a los requerimientos del proyecto, medido y trazable."
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:15:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [77-78, 118-124]
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
    lines: [36-45]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0007, EVD-2026-0126]
---

# BO-002 — Matching Demanda-Oferta de Competencias

## Propósito

Automatizar y hacer trazable el proceso de:
1. Que el PM declare requerimientos de proyecto (Rol-Nivel + Competencias específicas)
2. Que la plataforma calcule brechas de candidatos
3. Que se asigne personal con decisión documentada del Jefe de Ingeniería o ADMIN

## Modelo Conceptual

```
Proyecto → Requerimiento (Rol + Competencias + Niveles)
         ↓
Búsqueda de candidatos + cálculo de brechas
         ↓
Recomendación de plataforma (ordenada por menor brecha)
         ↓
Asignación por Jefe de Ingeniería / ADMIN (con auditoría)
         ↓
Se puede asignar incluso bajo nivel (con advertencia)
```

## KPIs Asociados

- **KPI 2 — Tiempo de asignación:** Días entre solicitud y asignación
- **KPI 3 — Cierre de brechas:** Reducción promedio de brecha por colaborador/producto
- **KPI 6 — Adopción:** % de proyectos con requerimientos registrados

## Outcomes Esperados

1. Los PM declaran requerimientos en minutos, no días de búsqueda informal.
2. La asignación es auditable: quién, cuándo, qué brecha, justificación si es bajo nivel.
3. Se visibiliza la demanda insatisfecha (riesgos de cobertura).

## Restricciones Clave

- ✅ Asigna el Jefe de Ingeniería o ADMIN, no el PM (EVD-2026-0126).
- ✅ Se puede asignar bajo nivel; la plataforma advierte (EVD-2026-0126).
- ✅ Un colaborador puede estar asignado a múltiples requerimientos (EVD-2026-0126).
- ✅ Solo el PM del proyecto declara requerimientos (EVD-2026-0127).

## Dependencias

- Catálogo de roles y competencias (BO-001).
- Perfiles de colaboradores con niveles certificados (BO-003).
- Definición clara de evaluadores y flujo de certificación (RCP-Q1).

## Horizonte

**H1 — El Idioma Común**

---

**Validación Humana Pendiente:** Jefe de Ingeniería
