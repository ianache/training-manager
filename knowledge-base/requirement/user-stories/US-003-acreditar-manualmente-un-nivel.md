---
type: Refined User Story
title: "US-003 — Acreditar manualmente un nivel"
description: "Un evaluador humano revisa las evidencias de un colaborador y acredita su nivel L1–L4 en una competencia, con registro de quién, cuándo y con qué evidencia."
tags: [user-story, h1, acreditacion, evidencia]
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

# US-003 — Acreditar manualmente un nivel

## Objetivo y alcance

- **Pregunta:** ¿qué debe cumplir la acreditación manual de H1 para que cada nivel sea verificable y trazable?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Jefe de Ingeniería, que valida.
- **Incluye:** acreditación manual por un evaluador con evidencias de formación, práctica evaluada o desempeño en proyecto.
- **Excluye:** propuestas de la IA ([US-011](../USC-001-user-stories-plataforma-gestion-formacion.md#us-011), H3) y certificados ([US-010](../USC-001-user-stories-plataforma-gestion-formacion.md#us-010), H2).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Evaluador](../../business/glossary/terms/TRM-0021-evaluador.md), **quiero** revisar las [evidencias](../../business/glossary/terms/TRM-0022-evidencia.md) de un colaborador y acreditar su nivel en una competencia, **para que** su [nivel acreditado](../../business/glossary/terms/TRM-0042-nivel-acreditado.md) sea verificable.

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un colaborador con al menos una evidencia de formación, práctica evaluada o desempeño en proyecto para una competencia | el evaluador acredita un nivel L1–L4 | el nivel queda en el perfil del colaborador para esa competencia | BR-ACR-01, BR-ACR-02 |
| AC-2 | una acreditación registrada | alguien la consulta | ve quién acreditó, cuándo y con qué evidencias | BR-ACR-03 |
| AC-3 | que estamos en H1 | se acredita un nivel | la acreditación es manual, sin propuestas automáticas | BR-ACR-05 |

### Casos negativos y límite

- **Negativo:** sin ninguna evidencia asociada, la acreditación no se puede registrar (BR-ACR-01).
- **Negativo:** nadie que no sea un evaluador humano puede acreditar; no hay acreditación automática (BR-ACR-02, BR-ACR-04).
- **Límite sin regla:** evidencia que no alcanza para el nivel pedido. No se puede validar sin P-01.
- **Límite sin regla:** acreditar un nivel sobre una competencia que ya tiene uno (subir o bajar), o revocarlo (P-14).
- **Límite sin regla:** un evaluador que acredita a alguien de su propio equipo (P-09).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0009 | El nivel acreditado se respalda con evidencia de formación, práctica evaluada o desempeño en proyecto | VIS-001:L57, L71 | fact | medium |
| EVD-2026-0010 | La evidencia exigida por nivel está abierta | VIS-001:L71, L150 | gap | high |
| EVD-2026-0011 | Un evaluador revisa y acredita; se registra quién, cuándo y con qué evidencia | VIS-001:L80 | fact | medium |
| EVD-2026-0012 | Ninguna acreditación sin firma humana | VIS-001:L81, L101 | decision | high |
| EVD-2026-0022 | En H1 la acreditación es manual | VIS-001:L132, L134 | decision | high |
| EVD-2026-0026 | Gestión de formación / RR. HH. "gestiona acreditaciones" | VIS-001:L45 | fact | medium |
| EVD-2026-0029 | No se sabe quiénes son los evaluadores ni quién los designa | RCP-001 §7 (RCP-Q1) | gap | high |
| EVD-2026-0030 | No se sabe si en H1 un evaluador puede registrar a mano evidencia de GitLab | RCP-001 §7 (RCP-Q2) | gap | medium |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

## Reglas, dependencias e impactos

- **Reglas:** BR-ACR-01 a BR-ACR-05.
- **Alimenta:** [US-004](US-004-consultar-mi-perfil-de-competencias.md) (perfil), [US-005](US-005-ver-mi-brecha-frente-a-un-rol.md) (brecha) y [US-006](US-006-buscar-candidatos-para-un-requerimiento.md) (búsqueda).
- **Base de:** US-011 (H3), que reutiliza este flujo de acreditación.
- **Contradicción vigente:** AMB-03. Gestión de formación / RR. HH. "gestiona acreditaciones" (VIS-001:L45), pero el que acredita es el evaluador (VIS-001:L80). Se mantienen las dos fuentes.
- **Ambigüedad vigente:** AMB-01. La formación cuenta como evidencia (VIS-001:L71), pero el certificado no equivale a un nivel (VIS-001:L82).

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-01 — ¿Qué evidencia mínima exige cada nivel L1–L4? | Jefe de Ingeniería | Alta | Abierta (BRC-001) |
| RCP-Q1 — ¿Quiénes son los evaluadores y quién los designa? ¿Instructor y evaluador son el mismo rol (GQ-07)? | Jefe de Ingeniería | Alta | Abierta (RCP-001) |
| P-09 — ¿Qué hace Gestión de formación / RR. HH. en la acreditación? ¿Un evaluador puede acreditar a su propio equipo? | Responsable de producto | Media | Abierta (BRC-001) |
| RCP-Q2 — ¿En H1 un evaluador puede registrar a mano evidencia de GitLab? | Jefe de Ingeniería | Media | Abierta (RCP-001) |
| P-14 — ¿Una acreditación vence o puede revocarse? ¿Se puede reacreditar? | Jefe de Ingeniería | Baja | Abierta (BRC-001) |
| P-07 — ¿Aprobar un curso aporta evidencia para algún nivel? | Jefe de Ingeniería | Media | Abierta (BRC-001) |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el flujo de acreditación y su trazabilidad están sostenidos (AC-1 a AC-3). Sin P-01 el sistema no puede saber si la evidencia alcanza para el nivel, y sin RCP-Q1 no se sabe quién puede acreditar.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y responde P-01 y RCP-Q1.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis
- [x] Contradicciones visibles (AMB-01, AMB-03)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
