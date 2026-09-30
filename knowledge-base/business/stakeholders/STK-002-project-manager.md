---
type: Stakeholder
title: "STK-002 — Jefe de Proyecto (PM)"
description: "Declara requerimientos de competencias para su proyecto; busca y valida candidatos; responsable de asignación recomendada."
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:20:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [42, 77]
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
    lines: [73-77]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0127, EVD-2026-0107, EVD-2026-0108]
---

# STK-002 — Jefe de Proyecto (PM)

## Responsabilidad Principal

**Declarar requerimientos de competencias del proyecto; buscar, filtrar y validar candidatos.**

## Intereses y Valores

| Interés | Por Qué | Éxito Se Ve Como |
|---------|--------|-------------------|
| **Rapidez en asignación** | Proyectos empiezan sin retrasos | KPI 2: Tiempo de asignación mínimo |
| **Personal certificado** | Reduce riesgos técnicos | Equipo con brechas chicas o nulas |
| **Visibilidad de candidatos** | Entiende por qué alguien NO califica | Brecha clara: qué falta y cómo cerrarlo |
| **Flexibilidad** | A veces se necesita alguien "casi listo" | Puede asignar bajo nivel, con aviso (EVD-2026-0126) |

## Responsabilidades en la Plataforma

| Tarea | Horizonte | Frecuencia |
|-------|-----------|-----------|
| Registrar requerimiento de proyecto (Rol-Nivel + competencias) | H1–H3 | Por proyecto nuevo |
| Buscar candidatos por requerimiento | H1–H3 | Ad hoc |
| Consultar brechas de candidatos | H1–H3 | Ad hoc |
| Recomendar candidatos al Jefe de Ingeniería para asignación | H1–H3 | Ad hoc |
| Validar propuestas de IA sobre colaboradores (H3) | H3 | Continuo |

## Permiso de Acceso

- ✅ Lectura: Catálogo, perfiles de colaboradores, brechas, candidatos
- ✅ Escritura: Requerimientos de su proyecto (solo del proyecto que gestiona — EVD-2026-0127)
- ❌ NO Escritura: Catálogo, certificaciones, datos maestros de colaboradores
- ❌ NO Lectura: Propuestas de IA (H3) — solo para Jefe de Ingeniería, Evaluador, Dirección, ADMIN (EVD-2026-0129)

## Notas

- **Asignación:** Recomienda candidato al Jefe de Ingeniería/ADMIN; no asigna directamente (EVD-2026-0126).
- **Brechas agregadas:** Jefe de Ingeniería, otro PM y ADMIN sí pueden consultar brechas agregadas (EVD-2026-0108); PM individual solo ve candidatos a sus requerimientos.

## Horizonte

**H1, H2, H3** (rol continuo)

---

**Validación Humana Pendiente:** Confirmación de permisos por rol
