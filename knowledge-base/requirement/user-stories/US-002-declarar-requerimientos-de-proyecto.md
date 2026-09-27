---
type: Refined User Story
title: "US-002 — Declarar los requerimientos de un proyecto"
description: "El Jefe de proyecto declara los roles que necesita su proyecto y, de cada rol, todas o algunas de sus competencias; los niveles se toman del catálogo."
tags: [user-story, h1, requerimientos, proyecto]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-26T23:30:00-05:00"
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

**Como** [Jefe de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md), **quiero** declarar los roles que necesita mi [proyecto](../../business/glossary/terms/TRM-0050-proyecto.md), **para** encontrar personal certificado (VIS-001:L42).

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un proyecto de un producto | el Jefe de proyecto registra un [requerimiento](../../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) indicando un rol, su nivel de rol (por ejemplo, Developer Senior 2) y las competencias de ese rol que necesita (todas o algunas) | el requerimiento queda asociado a ese proyecto y toma del catálogo los niveles L1–L4 esperados para ese Rol-Nivel | BR-REQ-01, BR-REQ-02, BR-REQ-06 a BR-REQ-08 |
| AC-2 | — | — | **Retirado** (2026-09-26): el requerimiento ya no indica niveles, así que no hay nivel que validar (BR-REQ-06) | — |

### Casos negativos y límite

- **Aclarado:** cualquier rol del catálogo se puede pedir, sea cual sea el producto del proyecto (BR-CAT-08).
- **Aclarado:** puede pedir todas o algunas de las competencias del rol (BR-REQ-07).
- **Aclarado:** el requerimiento indica el nivel de rol (BR-REQ-08).
- **Negativo:** pedir una competencia que no pertenece al Rol-Nivel se rechaza (BR-REQ-09).
- **Por confirmar:** si se pueden pedir solo algunas competencias del rol o siempre todas (AMB-06, P-38).
- **Por confirmar (no es criterio):** solo el Líder de ese proyecto declara sus requerimientos. VIS-001:L42 dice "su proyecto", pero no lo establece como regla (US2-Q2).
- **Límite sin regla:** varios requerimientos del mismo rol en un proyecto (por ejemplo, dos desarrolladores). Ninguna fuente lo trata (US2-Q3).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0007 | Un proyecto pertenece a un producto y declara requerimientos (rol + competencias + nivel); los declara el PM | VIS-001:L58, L77 | fact | medium |
| EVD-2026-0003 | Escala L1–L4 | VIS-001:L62-L69 | decision | high |
| EVD-2026-0027 | "Proyecto activo" sin definir | VIS-001:L119 | gap | medium |
| EVD-2026-0028 | La gestión de proyectos está fuera de alcance; no se sabe de dónde salen los proyectos y su Líder | VIS-001:L111 | gap | high |
| EVD-2026-0054 | Un requerimiento de proyecto no indica niveles propios: toma del catálogo las competencias y los niveles requeridos que define su rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0056 | Los roles son independientes de los productos (por ejemplo, Analista de Calidad o Developer): los mismos roles se desempeñan en los proyectos de cualquier producto. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0058 | Un requerimiento puede pedir solo algunas de las competencias de su rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0067 | Un requerimiento indica el nivel de rol que necesita (por ejemplo, Developer Senior 2). | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0072 | Un requerimiento no puede pedir competencias que no pertenecen a su rol: si se pide un Developer Junior 1, se entiende que las competencias definidas para ese rol y nivel son las idóneas para el proyecto. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Responsable de producto`.

## Reglas, dependencias e impactos

- **Reglas:** BR-REQ-01, BR-REQ-02, BR-REQ-06 a BR-REQ-09, BR-CAT-08, BR-CAT-14. BR-REQ-03 quedó retirada.
- **Depende de:** [US-001](US-001-definir-catalogo-de-competencias.md) (catálogo).
- **Es prerrequisito de:** [US-006](US-006-buscar-candidatos-para-un-requerimiento.md) (búsqueda).
- **Alimenta:** los KPI 1 (cobertura de roles) y 6 (proyectos con requerimientos registrados), VIS-001:L119, L124.

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| US2-Q1 — ¿De dónde salen los proyectos y su Líder, si la gestión de proyectos queda en GitLab? | Responsable de producto | Alta | Nueva |
| P-10 — ¿El requerimiento solo usa roles y competencias del catálogo de su producto? | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): no; los roles son comunes (BR-CAT-08) |
| P-11 — ¿Qué estados tiene un proyecto y cuándo es "activo"? | Responsable de producto | Media | Abierta (BRC-001) |
| US2-Q2 — ¿Solo el Jefe del proyecto puede declarar sus requerimientos? | Responsable de producto | Media | Nueva |
| US2-Q3 — ¿Un requerimiento indica cuántas personas se necesitan para un rol? | Responsable de producto | Baja | Nueva |
| IM-Q6 — ¿Un requerimiento puede pedir solo algunas de las competencias del rol? | Responsable de producto | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): sí (BR-REQ-07) |
| P-25 — ¿Un requerimiento indica el nivel de rol que necesita? | Responsable de producto | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): sí (BR-REQ-08) |
| P-29 — ¿Un requerimiento puede pedir una competencia que no pertenece a su rol? | Responsable de producto | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): no (BR-REQ-09) |
| P-38 — La respuesta a P-29 sugiere que un requerimiento pide el Rol-Nivel completo ("las competencias definidas para el rol y nivel son las idóneas"), pero BR-REQ-07 permite pedir solo algunas competencias del rol. ¿Sigue vigente BR-REQ-07? | Jefe de Ingeniería | Alta | Nueva |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el alta está sostenida (AC-1): rol y nivel de rol, todas o algunas de sus competencias y niveles del catálogo (BR-REQ-06 a BR-REQ-08). US2-Q1 impide saber sobre qué proyectos se declara.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Responsable de producto valida la historia y responde US2-Q1.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis
- [x] Contradicciones visibles (ninguna propia)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
