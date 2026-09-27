---
type: ASR Candidate
title: "ASR candidato — Contingencia ante fallas de integración con Google Classroom (BR-INT-02)"
description: "Si la integración con Classroom falla, se evaluará que la plataforma gestione material y progreso propios; la arquitectura debe permitirlo sin rehacer el resto."
tags: [asr, modificabilidad, integracion, classroom, contingencia]
status: draft
generated:
  by: "asr-discovery/1.0"
  at: "2026-09-26T21:14:12-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# ASR candidato — Contingencia ante fallas de integración con Google Classroom

- **Requisito de origen:** BR-INT-02 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)); US-009, US-010 (H2).
- **Atributo de calidad:** modificabilidad / evolución (y resiliencia de la integración).
- **Tipo:** atributo de calidad derivado de una decisión de contingencia.

## Enunciado

Hoy la plataforma integra Classroom en solo lectura y no hospeda contenido. Si esa integración presenta problemas, se evaluará que la plataforma gestione material, visualización y progreso por lección y evaluación. Hoy no forma parte del alcance.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Decisión de negocio tras problemas con Classroom |
| Estímulo | Activar la gestión propia de material y progreso |
| Entorno | Plataforma en producción con H1 y H2 |
| Artefacto | Integración con Classroom y funciones que usan sus datos (rutas, certificados de curso) |
| Respuesta | Se sustituye o complementa la fuente de cursos y calificaciones sin rehacer catálogo, perfil ni certificación |
| Medida de respuesta | **UNKNOWN** (esfuerzo o plazo aceptables) |

## Por qué puede ser significativo

- Pasar de "integrar" a "hospedar" cambia una decisión estructural (VIS-001:L87, L100). Si la dependencia con Classroom no está aislada, la contingencia obligaría a rehacer partes de H2 (INFERENCE a partir de EVD-2026-0021 y EVD-2026-0044).
- La propia visión la registra como riesgo con mitigación (VIS-001:L144).

## Perspectivas afectadas

Integración · Desarrollo (modificabilidad) · Datos

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0020 | Classroom: solo lectura; Drive: enlace y lectura; no se hospeda contenido | VIS-001:L87, L93-L94, L100 | FACT | Alta |
| EVD-2026-0021 | Contingencia: evaluar gestión propia de material y progreso; decisión posterior, fuera del alcance actual | VIS-001:L89, L108 | FACT | Alta |
| EVD-2026-0044 | Principio "Integrar, no hospedar" | VIS-001:L87, L100 | FACT | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- Qué problemas de integración se anticipan: acceso a la API de Classroom, permisos del dominio de Google Workspace, límites.
- La probabilidad y el plazo de activación de la contingencia.

## Preguntas para el arquitecto

1. ¿Hay pruebas o antecedentes de acceso a la API de Classroom en el dominio de COMSATEL?

## Disposición humana

- **Recomendación del agente (no es decisión):** INVESTIGATE. Su significancia depende de la probabilidad de la contingencia.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
