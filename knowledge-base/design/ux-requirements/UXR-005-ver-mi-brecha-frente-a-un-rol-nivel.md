---
type: UX Requirement
title: "UXR-005 — Ver mi brecha frente a un Rol-Nivel"
description: "Lo que el colaborador necesita para comparar sus niveles certificados con los que exige un Rol-Nivel."
tags: [ux-ui, ux-requirement, brecha, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: us-005
    resource: /knowledge-base/requirement/user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
---

# UXR-005 — Ver mi brecha frente a un Rol-Nivel

## Trazabilidad

- **Historia:** [US-005](../../requirement/user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md), criterios AC-1 y AC-2.
- **Reglas:** BR-BRE-01, BR-BRE-04, BR-CAT-14.
- **Conceptos (IMD-001):** Brecha (derivado), Nivel requerido, Nivel certificado, Nivel de rol.
- **Actor:** [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).
- **Nota de trazabilidad:** US-005 dice "frente a un rol". Con BR-CAT-14, los niveles esperados se fijan por Rol-Nivel, así que la comparación es frente a un Rol-Nivel. **Inferencia:** conviene actualizar US-005.

## Objetivo del usuario

Saber qué le falta para un Rol-Nivel.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-005.1 | Para un Rol-Nivel, cada competencia con el nivel L1–L4 esperado, su nivel certificado y la diferencia | AC-1; BR-BRE-01, BR-CAT-14 |
| UXR-005.2 | Qué competencias ya alcanza y cuáles no | AC-1 |

## Acciones

- **UXR-005.3:** ver su brecha frente a un Rol-Nivel. No declara un rol al que aspira: su rol y nivel los asigna el Jefe de Ingeniería (BR-BRE-04; P-15 respondida). Si puede elegir otro Rol-Nivel (el siguiente de su rol u otros roles) o solo ve el asignado está abierto (P-43); de eso depende que exista un selector.

## Reglas que la interfaz debe hacer visibles

- La diferencia se muestra por competencia (BR-BRE-01), en texto y no solo con color (UXR-000.3).
- El colaborador solo ve sus propias brechas; no hay acceso a las de otros ni a las agregadas (BR-BRE-04, BR-BRE-06). Desde el 2026-09-27 (P-08) el Jefe de proyecto sí ve la brecha individual de cualquier colaborador (BR-TRA-04); eso se diseña en la búsqueda de candidatos (UXR-006), no en esta vista.

## Estados

- **Sin nivel certificado** en una competencia: caso abierto (P-12).
- **Nivel certificado mayor que el esperado:** caso abierto (P-12).
- **Carga y error:** según UXR-000.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| ~~P-15~~ | ~~¿Con qué Rol-Nivel puede compararse el colaborador?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no declara un rol al que aspira; ve sus propias brechas (BR-BRE-04) | Jefe de Ingeniería | — |
| P-43 | ¿Contra qué Rol-Nivel ve su brecha: el asignado, el siguiente de su rol o ambos? ¿Puede ver brechas de otros roles? Define si hay selector | Jefe de Ingeniería | Alta |
| P-12 | ¿Cómo se muestra la brecha sin nivel certificado o con nivel superior al esperado? | Jefe de Ingeniería | Media |
| UXR-005-Q1 | ¿Desde la brecha se ofrece un camino a formación (cursos del nivel)? Es H2 (BR-FOR-01, US-009) y no se diseña en H1 | Responsable de producto | Baja |
