---
type: Refined User Story
title: "US-006 — Buscar candidatos para un requerimiento"
description: "El Jefe de proyecto ve los colaboradores cuyo nivel certificado alcanza el nivel exigido por un requerimiento de su proyecto."
tags: [user-story, h1, busqueda-de-personal, requerimientos]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-27T10:45:00-05:00"
sources:
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
---

# US-006 — Buscar candidatos para un requerimiento

## Objetivo y alcance

- **Pregunta:** ¿qué debe mostrar la búsqueda para que el Jefe de proyecto encuentre personal certificado para un requerimiento?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Responsable de producto, que valida.
- **Incluye:** la lista de candidatos para un requerimiento.
- **Excluye:** la decisión de asignación ([US-007](../USC-001-user-stories-plataforma-gestion-formacion.md#us-007), bloqueada por P-05).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Jefe de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md), **quiero** ver los colaboradores que cumplen un [requerimiento](../../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) de mi proyecto, **para** encontrar personal certificado ([búsqueda de personal](../../business/glossary/terms/TRM-0006-busqueda-de-personal.md); VIS-001:L42, L78).

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un requerimiento de mi proyecto | busco candidatos | veo los colaboradores cuyo nivel certificado alcanza el nivel exigido | VIS-001:L42, L119 ("personal certificado al nivel exigido"); BR-BRE-01 |

### Casos negativos y límite

- **Límite sin regla:** ningún colaborador alcanza el nivel. No está definido si se muestran los más cercanos con su brecha (P-16).
- **Por confirmar (no es criterio):** un candidato debe alcanzar el nivel en **todas** las competencias del requerimiento. Es una inferencia; podría admitirse un calce parcial (P-16).
- **Sin regla:** qué datos del perfil de cada candidato puede ver el Jefe de proyecto (P-08).
- **Sin regla:** si la búsqueda excluye a colaboradores ya asignados a otro proyecto. Ninguna fuente lo trata (US6-Q1).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0034 | El Jefe de proyecto "encuentra personal certificado"; la capacidad 4 incluye "candidatos por requerimiento" | VIS-001:L42, L78 | fact | medium |
| EVD-2026-0035 | El KPI 1 considera cubierto un rol con "personal certificado al nivel exigido" | VIS-001:L119 | fact | medium |
| EVD-2026-0023 | Cómo se decide una asignación está abierto | VIS-001:L154 | gap | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Responsable de producto`.

## Reglas, dependencias e impactos

- **Reglas:** BR-BRE-01.
- **Depende de:** [US-001](US-001-definir-catalogo-de-competencias.md), [US-002](US-002-declarar-requerimientos-de-proyecto.md) y [US-003](US-003-acreditar-manualmente-un-nivel.md).
- **Es prerrequisito de:** US-007 (asignación).
- **Alimenta:** los KPI 1 (cobertura de roles) y 2 (tiempo de asignación), VIS-001:L119-L120.
- **Dato personal:** la búsqueda expone datos de desempeño de otras personas; hasta resolver P-08, conviene mostrar lo mínimo.

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-08 — ¿Qué datos del perfil de otra persona puede ver el Jefe de proyecto? | Responsable de producto | Alta | Abierta (BRC-001) |
| P-16 — ¿Se muestran candidatos por debajo del nivel, con su brecha? ¿Cómo se ordena? ¿Se admite calce parcial? | Responsable de producto | Media | Abierta (USC-001) |
| US6-Q1 — ¿La búsqueda considera si el colaborador ya está asignado a otro proyecto? | Responsable de producto | Media | Nueva |
| VIS-§11.4 — ¿De dónde salen los colaboradores que se buscan? | Responsable de producto + ARQ | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D2): la plataforma es el sistema de registro de colaboradores, sin integración con RR. HH. (BR-PTY-01). Se buscan las personas con rol vigente de Empleado o Contratista (BR-PTY-05) |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** la búsqueda base está sostenida (AC-1). P-08 condiciona lo que se muestra de cada candidato y P-16 condiciona el criterio de calce.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Responsable de producto valida la historia y responde P-08 y P-16.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis (calce total marcado como inferencia)
- [x] Contradicciones visibles (ninguna)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
