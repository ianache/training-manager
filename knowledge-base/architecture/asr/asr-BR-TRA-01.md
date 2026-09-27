---
type: ASR Candidate
title: "ASR candidato — Privacidad y visibilidad de datos de desempeño (BR-TRA-01)"
description: "Perfiles, evidencias y propuestas de IA son datos de desempeño de personas: el colaborador ve lo suyo y la visibilidad para terceros no está definida."
tags: [asr, privacidad, datos-personales, transparencia]
status: draft
generated:
  by: "asr-discovery/1.0"
  at: "2026-09-26T21:14:12-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
---

# ASR candidato — Privacidad y visibilidad de datos de desempeño

- **Requisito de origen:** BR-TRA-01 y BR-IA-04 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)); US-004, US-006, US-012.
- **Atributo de calidad:** privacidad / seguridad (confidencialidad).
- **Tipo:** atributo de calidad transversal.

## Enunciado

El perfil de competencias, las evidencias y las propuestas de la IA son datos de desempeño de una persona. El colaborador ve todo lo suyo. Qué ven los demás actores (Jefe de proyecto, evaluador, Dirección) está por definir, y el análisis de GitLab no debe percibirse como vigilancia.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Un actor distinto del colaborador (p. ej. un Jefe de proyecto que busca candidatos) |
| Estímulo | Consulta datos del perfil, evidencias o propuestas de otra persona |
| Entorno | Operación normal |
| Artefacto | Perfiles, evidencias, propuestas de IA |
| Respuesta | Solo ve los datos que su rol tiene permitido; el colaborador puede ver qué se usa sobre él |
| Medida de respuesta | **UNKNOWN** |

## Por qué puede ser significativo

- Afecta a casi todas las vistas: perfil, búsqueda, brechas agregadas y tablero (INFERENCE a partir de EVD-2026-0016 y EVD-2026-0039).
- La visibilidad por rol y el acceso mínimo condicionan el modelo de autorización a nivel de dato, no solo de pantalla (INFERENCE).
- Hay un riesgo declarado de percepción de vigilancia (VIS-001:L143). Puede haber requisitos regulatorios de protección de datos personales, pero las fuentes no los nombran (UNKNOWN).

## Perspectivas afectadas

Seguridad · Datos · Cumplimiento · UX

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0016 | El colaborador ve su perfil, sus evidencias y las propuestas de la IA sobre él | VIS-001:L104 | FACT | Alta |
| EVD-2026-0039 | Riesgo: que el análisis de GitLab se perciba como vigilancia; mitigación: uso interno y transparencia | VIS-001:L143 | FACT | Alta |
| EVD-2026-0048 | La evaluación de desempeño salarial o de RR. HH. está fuera de alcance | VIS-001:L110 | FACT | Alta |
| EVD-2026-0049 | Quién puede ver el perfil de otra persona está sin definir (P-08) | BRC-001 P-08; RCP-001 §8 | UNKNOWN | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- La matriz de visibilidad por rol (P-08).
- La normativa de protección de datos personales aplicable y la política interna de COMSATEL.
- Si se requiere consentimiento o aviso al colaborador sobre el análisis de GitLab.

## Preguntas para el arquitecto

1. ¿Qué normativa de datos personales aplica a esta plataforma?
2. ¿Hay que registrar los accesos a perfiles ajenos?

## Disposición humana

- **Recomendación del agente (no es decisión):** CANDIDATE. Conviene validar la normativa antes de fijar el alcance.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
