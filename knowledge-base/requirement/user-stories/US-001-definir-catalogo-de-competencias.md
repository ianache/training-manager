---
type: Refined User Story
title: "US-001 — Definir el catálogo de competencias por producto"
description: "El Jefe de Ingeniería define para cada producto sus roles, las competencias de cada rol y el nivel requerido L1–L4 de cada competencia."
tags: [user-story, h1, catalogo, competencias]
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

# US-001 — Definir el catálogo de competencias por producto

## Objetivo y alcance

- **Pregunta:** ¿qué debe cumplir la definición del catálogo para que proyectos, formación y acreditación midan contra la misma referencia?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Jefe de Ingeniería, que valida.
- **Incluye:** alta de roles, competencias y niveles requeridos por producto.
- **Excluye:** versionado y edición con efectos sobre datos vigentes (depende de P-02); rutas de formación (H2).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md), **quiero** definir para cada [producto](../../business/glossary/terms/TRM-0047-producto.md) sus [roles](../../business/glossary/terms/TRM-0055-rol.md), las [competencias](../../business/glossary/terms/TRM-0014-competencia.md) de cada rol y el [nivel requerido](../../business/glossary/terms/TRM-0043-nivel-requerido.md) de cada una, **para que** proyectos, formación y acreditación midan contra un [catálogo](../../business/glossary/terms/TRM-0007-catalogo-de-competencias.md) común.

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | que soy el Jefe de Ingeniería | registro un rol para un producto, con sus competencias y un nivel L1–L4 para cada una | el rol queda en el catálogo de ese producto | BR-CAT-01, BR-CAT-04 |
| AC-2 | un rol en edición | agrego una competencia sin nivel requerido | el rol no se puede guardar hasta que esa competencia tenga nivel | BR-CAT-03 |
| AC-3 | un rol en edición | asigno un nivel que no pertenece a la [escala L1–L4](../../business/glossary/terms/TRM-0020-escala-de-niveles-de-dominio.md) | el nivel se rechaza | BR-CAT-02 |

### Casos negativos y límite

- **Negativo:** un usuario que no es el Jefe de Ingeniería intenta modificar el catálogo, y no puede (BR-CAT-04).
- **Límite sin regla:** un rol sin competencias, o la misma competencia dos veces en un rol. Ninguna fuente lo trata (US1-Q1).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0001 | Productos en alcance: CLocator, CLocator v2 (C-Go), SIGO, SmartSuite | VIS-001:L23 | fact | high |
| EVD-2026-0002 | Producto → Rol → Competencia → Nivel requerido | VIS-001:L56 | fact | medium |
| EVD-2026-0003 | Escala L1–L4 | VIS-001:L62-L69 | decision | high |
| EVD-2026-0004 | Cada rol exige un nivel mínimo por competencia | VIS-001:L71 | fact | medium |
| EVD-2026-0005 | El Jefe de Ingeniería es dueño del catálogo | VIS-001:L51, L162 | decision | high |
| EVD-2026-0006 | Papel del Responsable de producto por confirmar | VIS-001:L44, L155 | gap | high |
| EVD-2026-0024 | Versionado del catálogo abierto | VIS-001:L142, L151 | gap | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

## Reglas, dependencias e impactos

- **Reglas:** BR-CAT-01 a BR-CAT-04 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)).
- **Es prerrequisito de:** [US-002](US-002-declarar-requerimientos-de-proyecto.md), [US-005](US-005-ver-mi-brecha-frente-a-un-rol.md) y [US-006](US-006-buscar-candidatos-para-un-requerimiento.md). Sin catálogo no hay requerimientos, brechas ni búsqueda (VIS-001:L136).
- **Impacto:** todo cambio posterior del catálogo afecta a requerimientos y acreditaciones vigentes; cómo se trata ese impacto está abierto (P-02).
- **Riesgo:** catálogo sin consenso entre productos (VIS-001:L142).

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-02 — ¿Cómo se versiona el catálogo y qué pasa con requerimientos y acreditaciones vigentes al cambiarlo? | Jefe de Ingeniería | Media | Abierta (BRC-001) |
| P-06 — ¿El Responsable de producto puede proponer o editar roles de su producto? | Jefe de Ingeniería | Media | Abierta (BRC-001) |
| US1-Q1 — ¿Se permite un rol sin competencias, o una competencia repetida en un rol? | Jefe de Ingeniería | Baja | Nueva |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el alta del catálogo está sostenida (AC-1 a AC-3). La edición depende de P-02, y el papel del Responsable de producto, de P-06.
- **Recomendación (no es decisión):** separar "alta del catálogo" (lista para UXR) de "edición y versionado" (espera P-02).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y responde P-02.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis
- [x] Contradicciones visibles (ninguna propia)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
