---
type: Refined User Story
title: "US-005 — Ver mi brecha frente a un rol"
description: "El colaborador ve, por competencia, la diferencia entre el nivel que exige un rol y su nivel acreditado."
tags: [user-story, h1, brecha, perfil]
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

# US-005 — Ver mi brecha frente a un rol

## Objetivo y alcance

- **Pregunta:** ¿qué debe mostrar la brecha para que el colaborador sepa qué le falta para un rol?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Jefe de Ingeniería, que valida.
- **Incluye:** la brecha por competencia entre un rol del catálogo y el propio perfil.
- **Excluye:** la ruta de formación que se genera a partir de la brecha (US-009, H2); las brechas agregadas por producto (US-008).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md), **quiero** ver la diferencia entre mis niveles acreditados y los que exige un rol, **para** saber qué me falta para ese rol (VIS-001:L41).

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un rol del catálogo y mi perfil | consulto mi [brecha](../../business/glossary/terms/TRM-0005-brecha.md) para ese rol | veo, por cada competencia del rol, el nivel requerido, mi nivel acreditado y la diferencia | BR-BRE-01 |

### Casos negativos y límite

- **Límite sin regla:** una competencia del rol en la que no tengo nivel acreditado (P-12).
- **Límite sin regla:** un nivel acreditado mayor que el requerido. No está definido si la brecha es negativa o se muestra como cubierta (P-12).
- **Por confirmar (no es criterio):** la diferencia se calcula restando la posición en la escala (L3 − L1 = 2). Es una inferencia (BR-BRE-02).
- **Sin regla:** qué roles puede consultar el colaborador y cómo declara el rol al que aspira (P-15).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0008 | Brecha = Nivel requerido − Nivel acreditado | VIS-001:L59 | fact | medium |
| EVD-2026-0003 | Escala L1–L4 | VIS-001:L62-L69 | decision | high |
| EVD-2026-0033 | El colaborador sabe "qué le falta para el rol al que aspira"; no se define cómo declara esa aspiración | VIS-001:L41 | gap | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

## Reglas, dependencias e impactos

- **Reglas:** BR-BRE-01; BR-BRE-02 como inferencia; BR-BRE-03 (casos límite abiertos).
- **Depende de:** [US-001](US-001-definir-catalogo-de-competencias.md) (nivel requerido) y [US-003](US-003-acreditar-manualmente-un-nivel.md) (nivel acreditado).
- **Alimenta:** el KPI 3, cierre de brechas (VIS-001:L121), y las rutas de formación de H2 (VIS-001:L79).

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-12 — ¿Cómo se trata la brecha sin nivel acreditado y la brecha negativa? ¿Los niveles se restan como números? | Jefe de Ingeniería | Media | Abierta (BRC-001) |
| P-15 — ¿Cómo declara el colaborador el rol al que aspira? ¿Puede ver la brecha de cualquier rol? | Responsable de producto | Media | Abierta (USC-001) |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el cálculo base está sostenido (AC-1), pero los casos límite (P-12) y la selección del rol (P-15) afectan a lo que el colaborador ve.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde P-12 y el Responsable de producto, P-15.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis (BR-BRE-02 marcada como inferencia)
- [x] Contradicciones visibles (ninguna)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
