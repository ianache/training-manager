---
type: Refined User Story
title: "US-004 — Consultar mi perfil de competencias"
description: "El colaborador ve sus niveles certificados por competencia, su historial y las evidencias que los respaldan."
tags: [user-story, h1, perfil, transparencia]
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

# US-004 — Consultar mi perfil de competencias

## Objetivo y alcance

- **Pregunta:** ¿qué debe ver un colaborador en su propio perfil para saber qué nivel tiene?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Responsable de producto, que valida.
- **Incluye:** la vista del propio perfil: niveles certificados, historial y evidencias.
- **Excluye:** la vista del perfil de otra persona (P-08); la brecha ([US-005](US-005-ver-mi-brecha-frente-a-un-rol.md)); las propuestas de la IA (US-012, H3).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md), **quiero** ver mis niveles certificados, su historial y las evidencias que los respaldan, **para** saber qué nivel tengo en cada competencia (VIS-001:L41, L76).

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | que soy un colaborador con certificaciones | abro mi [perfil](../../business/glossary/terms/TRM-0045-perfil-de-competencias-del-colaborador.md) | veo cada competencia con su nivel certificado, la fecha, quién lo certificó y sus evidencias | BR-TRA-01, BR-ACR-03 |
| AC-2 | que soy un colaborador con varias certificaciones de una misma competencia a lo largo del tiempo | abro mi perfil | veo su historial | VIS-001:L76 ("historial") |
| AC-3 | que no tengo certificaciones | abro mi perfil | veo que no tengo niveles certificados | Estado vacío (no es una regla de negocio) |

### Casos negativos y límite

- **Negativo:** ninguno sostenido por las fuentes.
- **Fuera de esta historia:** quién más puede ver este perfil (P-08). Hasta que se resuelva, RCP-001 indica que el colaborador vea solo lo suyo.

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0016 | El colaborador ve su perfil y sus evidencias | VIS-001:L104 | fact | medium |
| EVD-2026-0011 | Se registra quién, cuándo y con qué evidencia se certificó | VIS-001:L80 | fact | medium |
| EVD-2026-0031 | El perfil incluye nivel certificado por competencia, historial y evidencias | VIS-001:L76 | fact | medium |
| EVD-2026-0032 | No está definido de dónde salen los colaboradores (¿sistema de RR. HH.?) | VIS-001:L153 | gap | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Responsable de producto`.

## Reglas, dependencias e impactos

- **Reglas:** BR-TRA-01, BR-ACR-03.
- **Depende de:** [US-003](US-003-acreditar-manualmente-un-nivel.md) (sin certificaciones, el perfil solo muestra el estado vacío).
- **Alimenta:** el KPI 6, porcentaje de colaboradores con perfil activo (VIS-001:L124). "Perfil activo" está sin definir (GQ-08).
- **Dato personal:** el perfil contiene datos de desempeño de una persona.

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| VIS-§11.4 — ¿De dónde salen los colaboradores y sus datos básicos? | Responsable de producto + ARQ | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D2): la plataforma es el sistema de registro de colaboradores, sin integración con RR. HH. (BR-PTY-01). Las fichas las mantiene el Jefe de Ingeniería (US de SPEC-001). |
| GQ-08 — ¿Qué es un "perfil activo"? | Responsable de producto | Media | Abierta (GLS-001). Afecta al KPI 6, no a esta historia. |

## Preparación y entrega

- **Estado:** READY
- **Motivo:** la historia y sus criterios están sostenidos por VIS-001 y BRC-001, y no depende de ninguna pregunta abierta para su comportamiento funcional.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Responsable de producto valida la historia.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis
- [x] Contradicciones visibles (ninguna)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
