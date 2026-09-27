---
type: Refined User Story
title: "US-005 — Ver mi brecha frente a un rol"
description: "El colaborador ve, por competencia, la diferencia entre el nivel que exige un rol y su nivel certificado."
tags: [user-story, h1, brecha, perfil]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-27T14:10:00-05:00"
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

**Como** [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md), **quiero** ver la diferencia entre mis niveles certificados y los que exige un rol, **para** saber qué me falta para ese rol (VIS-001:L41).

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un Rol-Nivel del catálogo y mi perfil | consulto mi [brecha](../../business/glossary/terms/TRM-0005-brecha.md) para ese rol | veo, por cada competencia del rol, el nivel requerido, mi nivel certificado y la diferencia | BR-BRE-01 |
| AC-2 | que soy un colaborador | consulto brechas | solo veo las mías, no las de otros colaboradores | BR-BRE-04 |

### Casos negativos y límite

- **Límite sin regla:** una competencia del rol en la que no tengo nivel certificado (P-12).
- **Límite sin regla:** un nivel certificado mayor que el requerido. No está definido si la brecha es negativa o se muestra como cubierta (P-12).
- **Por confirmar (no es criterio):** la diferencia se calcula restando la posición en la escala (L3 − L1 = 2). Es una inferencia (BR-BRE-02).
- **Negativo:** el colaborador no declara un rol al que aspira; su rol y nivel los asigna el Jefe de Ingeniería al registrarlo (BR-BRE-04, BR-PRF-02; P-15 respondida el 2026-09-27).
- **Negativo:** un colaborador intenta ver la brecha de otra persona, y no puede (BR-BRE-04). **Inferencia:** BR-BRE-04 dice que ve sus propias brechas; que no vea las ajenas se deduce de que es una regla de permiso, junto con BR-BRE-06 (brechas agregadas solo para otros actores).
- **Sin regla:** contra qué Rol-Nivel ve su brecha: el asignado, el siguiente nivel de su rol, ambos, u otros roles (P-43).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0008 | Brecha = Nivel requerido − Nivel certificado | VIS-001:L59 | fact | medium |
| EVD-2026-0003 | Escala L1–L4 | VIS-001:L62-L69 | decision | high |
| EVD-2026-0033 | El colaborador sabe "qué le falta para el rol al que aspira"; no se define cómo declara esa aspiración | VIS-001:L41 | gap | high |
| EVD-2026-0106 | El colaborador no declara el rol al que aspira. Al registrarlo, el Jefe de Ingeniería le asigna rol y nivel. El colaborador ve sus propias brechas. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-15 (USC-001) | decision | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

## Reglas, dependencias e impactos

- **Reglas:** BR-BRE-01; BR-BRE-02 como inferencia; BR-BRE-03 (casos límite abiertos); BR-BRE-04; BR-PRF-02.
- **Depende de:** [US-001](US-001-definir-catalogo-de-competencias.md) (nivel requerido) y [US-003](US-003-acreditar-manualmente-un-nivel.md) (nivel certificado).
- **Alimenta:** el KPI 3, cierre de brechas (VIS-001:L121), y las rutas de formación de H2 (VIS-001:L79).

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-12 — ¿Cómo se trata la brecha sin nivel certificado y la brecha negativa? ¿Los niveles se restan como números? | Jefe de Ingeniería | Media | Abierta (BRC-001) |
| P-15 — ¿Cómo declara el colaborador el rol al que aspira? ¿Puede ver la brecha de cualquier rol? | Responsable de producto | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no declara un rol al que aspira; su rol y nivel los asigna el Jefe de Ingeniería y ve sus propias brechas (BR-BRE-04) |
| P-43 — ¿Contra qué Rol-Nivel ve el colaborador su brecha: el asignado, el siguiente de su rol o ambos? ¿Puede ver brechas de otros roles? | Jefe de Ingeniería | Alta | Nueva (BRC-001, derivada de P-15) |
## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el cálculo base y la restricción a las propias brechas están sostenidos (AC-1, AC-2; P-15 respondida). Siguen abiertos los casos límite (P-12) y contra qué Rol-Nivel se calcula la brecha (P-43, alta), que decide lo que el colaborador ve.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde P-12 y P-43.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis (BR-BRE-02 marcada como inferencia)
- [x] Contradicciones visibles (ninguna)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
