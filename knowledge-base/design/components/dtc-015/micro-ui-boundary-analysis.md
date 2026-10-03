---
type: MicroUI Boundary Analysis
title: "Frontera MicroUI — registro de colaborador (DTC-015)"
description: "Decisión de frontera para el recorrido «Registrar un colaborador»: FRONTEND_MODULE dentro de mfe-collaborators."
tags: [ux-ui, microui, ddd, boundary, dtc-015]
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-10-02T00:40:00-05:00"
sources:
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: adr-009
    resource: /knowledge-base/architecture/adrs/ADR-009-composicion-de-microuis-con-native-federation.md
  - id: review
    resource: /knowledge-base/design/components/dtc-015/technical-design-review.md
---

# Análisis de frontera — Registrar un colaborador

**Decisión propuesta: `FRONTEND_MODULE`** dentro del MicroUI existente `mfe-collaborators`. No se propone un MicroUI nuevo.

| Dimensión | Evidencia | Estado |
|---|---|---|
| Capacidad y recorrido | Alta de colaborador (US-015) en el contexto Party; el MFE `mfe-collaborators` ya aloja listado, detalle y ediciones (`party-list`, `party-detail`, `*-edit`) | Evidenciado en código |
| Lenguaje y reglas propias | BR-PTY-* (identificación única, correo único entre vigentes, jefe directo) | Evidenciado en la KB |
| Equipo propietario | **Sin evidencia** | Falta |
| Autonomía de despliegue e integración | `mfe-collaborators` existe como proyecto separado del shell; **ADR-009 (Native Federation) fue rechazado** y la técnica de composición quedó abierta en ADR-001 | Abierto |
| Beneficio vs. costo de un MicroUI nuevo | El registro comparte modelo, validadores, comandos y rutas con el resto del MFE; separarlo fragmentaría el recorrido | Argumento a favor de módulo |

**Por qué no `MICROUI_CANDIDATE`:** faltan equipo y autonomía de despliegue, y el recorrido no es independiente del resto de Party.
**Por qué no `COMPOSITE_JOURNEY`:** el recorrido toca dependencias de otros contextos (unidades US-017, proveedores US-018, catálogo US-001) solo como **datos de búsqueda** (comandos `Search*`), no como pantallas de esos contextos.

**Pendiente de decisión humana:** confirmar la propiedad del MFE y que el registro permanezca como módulo (ver F-08 de la [revisión](technical-design-review.md)).

## Actualización 2026-10-02
`human:ianache` confirmó que **`mfe-collaborators` es un MicroUI**; la decisión `FRONTEND_MODULE` dentro de él queda confirmada. Sigue pendiente nombrar el equipo propietario y la técnica de composición en el shell (ADR-009 rechazado).
