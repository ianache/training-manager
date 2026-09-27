---
type: Refined User Story
title: "US-002 — Declarar los requerimientos de un proyecto"
description: "El Líder de proyecto declara los roles, competencias y niveles que necesita su proyecto para encontrar personal acreditado."
tags: [user-story, h1, requerimientos, proyecto]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-26T20:55:58-05:00"
sources:
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
---

# US-002 — Declarar los requerimientos de un proyecto

## Objetivo y alcance

- **Pregunta:** ¿qué debe cumplir un requerimiento de proyecto para que la búsqueda de candidatos y el KPI de cobertura funcionen?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Responsable de producto, que valida.
- **Incluye:** alta de requerimientos (rol, competencias y nivel) de un proyecto.
- **Excluye:** gestión de proyectos, que ya cubre GitLab (VIS-001:L111); asignación ([US-007](../USC-001-user-stories-plataforma-gestion-formacion.md#us-007)).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Líder de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md), **quiero** declarar los roles, las competencias y los niveles que necesita mi [proyecto](../../business/glossary/terms/TRM-0050-proyecto.md), **para** encontrar personal acreditado (VIS-001:L42).

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un proyecto de un producto | el Líder de proyecto registra un [requerimiento](../../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) con rol, competencias y nivel | el requerimiento queda asociado a ese proyecto | BR-REQ-01, BR-REQ-02 |
| AC-2 | un requerimiento en registro | se indica un nivel fuera de L1–L4 | el nivel se rechaza | BR-CAT-02 |

### Casos negativos y límite

- **Por confirmar (no es criterio):** el requerimiento solo acepta roles y competencias del catálogo del producto del proyecto. Es una inferencia (BR-REQ-03, P-10).
- **Por confirmar (no es criterio):** solo el Líder de ese proyecto declara sus requerimientos. VIS-001:L42 dice "su proyecto", pero no lo establece como regla (US2-Q2).
- **Límite sin regla:** varios requerimientos del mismo rol en un proyecto (por ejemplo, dos desarrolladores). Ninguna fuente lo trata (US2-Q3).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0007 | Un proyecto pertenece a un producto y declara requerimientos (rol + competencias + nivel); los declara el PM | VIS-001:L58, L77 | fact | medium |
| EVD-2026-0003 | Escala L1–L4 | VIS-001:L62-L69 | decision | high |
| EVD-2026-0027 | "Proyecto activo" sin definir | VIS-001:L119 | gap | medium |
| EVD-2026-0028 | La gestión de proyectos está fuera de alcance; no se sabe de dónde salen los proyectos y su Líder | VIS-001:L111 | gap | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Responsable de producto`.

## Reglas, dependencias e impactos

- **Reglas:** BR-REQ-01, BR-REQ-02, BR-CAT-02; BR-REQ-03 como inferencia.
- **Depende de:** [US-001](US-001-definir-catalogo-de-competencias.md) (catálogo).
- **Es prerrequisito de:** [US-006](US-006-buscar-candidatos-para-un-requerimiento.md) (búsqueda).
- **Alimenta:** los KPI 1 (cobertura de roles) y 6 (proyectos con requerimientos registrados), VIS-001:L119, L124.

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| US2-Q1 — ¿De dónde salen los proyectos y su Líder, si la gestión de proyectos queda en GitLab? | Responsable de producto | Alta | Nueva |
| P-10 — ¿El requerimiento solo usa roles y competencias del catálogo de su producto? | Jefe de Ingeniería | Media | Abierta (BRC-001) |
| P-11 — ¿Qué estados tiene un proyecto y cuándo es "activo"? | Responsable de producto | Media | Abierta (BRC-001) |
| US2-Q2 — ¿Solo el Líder del proyecto puede declarar sus requerimientos? | Responsable de producto | Media | Nueva |
| US2-Q3 — ¿Un requerimiento indica cuántas personas se necesitan para un rol? | Responsable de producto | Baja | Nueva |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el alta está sostenida (AC-1, AC-2). US2-Q1 impide saber sobre qué proyectos se declara, y P-10 y P-11 dejan reglas sin confirmar.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Responsable de producto valida la historia y responde US2-Q1.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis (BR-REQ-03 y "su proyecto" marcados como por confirmar)
- [x] Contradicciones visibles (ninguna propia)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
