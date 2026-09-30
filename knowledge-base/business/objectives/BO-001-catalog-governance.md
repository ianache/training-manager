---
type: Business Objective
title: "BO-001 — Governance del Catálogo de Roles y Competencias"
description: "Establecer un catálogo único y común de roles, competencias y niveles que permita medir brechas y asignar personal de forma objetiva y trazable."
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:15:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [51, 56-59, 132]
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
    lines: [38-45]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0002, EVD-2026-0005, EVD-2026-0053]
---

# BO-001 — Governance del Catálogo de Roles y Competencias

## Propósito

Que el Jefe de Ingeniería (dueño del catálogo) defina y gobierne un único catálogo de roles, competencias y niveles de dominio (L1–L4) que sea:
- **Común a los 4 productos** (CLocator, C-Go, SIGO, SmartSuite)
- **Transversal:** roles y competencias no pertenecen a un producto; se reutilizan
- **Auditable:** cambios registrados, versiones controladas
- **Progresivo:** se enriquece en el tiempo con requisitos de evidencia por competencia/nivel

## Modelo Conceptual

```
Producto (4) ← Rol (N) ← Competencia (M) ← Nivel (L1-L4)
                            ↓
                      Requisitos de Evidencia
                      (formación | práctica | desempeño)
```

## KPIs Asociados

- **KPI 1 — Cobertura de roles:** % de roles requeridos cubiertos con personal certificado
- **KPI 6 — Adopción:** % de proyectos con requerimientos registrados contra el catálogo

## Outcomes Esperados

1. Los 4 productos operan contra un lenguaje común (no hay catálogos paralelos o informales).
2. La asignación de personal es medible: brecha = nivel requerido − nivel certificado.
3. Se can rastrear todas las decisiones sobre competencias (versión, cambios, auditoría).

## Restricciones Clave

- ✅ Catálogo único (no por producto).
- ✅ Niveles fijos: L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto.
- ✅ Requisitos de evidencia definidos por competencia/nivel (decisión del Jefe de Ingeniería).
- ⚠️ Versionado del catálogo: **abierto (P-02)**.

## Dependencias

- Definición de requisitos de evidencia por competencia/nivel (BR-ACR-07 a BR-ACR-08).
- Aprobación de catálogo inicial por Jefe de Ingeniería y responsables de producto.

## Horizonte

**H1 — El Idioma Común** (Q4 2026 – Q1 2027)

---

**Validación Humana Pendiente:** Jefe de Ingeniería
