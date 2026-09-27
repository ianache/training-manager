---
type: ASR Candidate
title: "ASR candidato — Explicabilidad de las propuestas de la IA (BR-IA-02)"
description: "Cada propuesta de nivel de la IA debe llevar una justificación trazable a las evidencias que usó, como mitigación del sesgo y base de la revisión humana."
tags: [asr, ia, explicabilidad, trazabilidad]
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

# ASR candidato — Explicabilidad de las propuestas de la IA

- **Requisito de origen:** BR-IA-02 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)); US-011, US-012.
- **Atributo de calidad:** explicabilidad / trazabilidad.
- **Tipo:** atributo de calidad (H3).

## Enunciado

Cada propuesta de nivel de la IA incluye una justificación trazable a las evidencias de GitLab en que se basa. Evaluador y colaborador pueden verla, y la propuesta termina aprobada, ajustada o rechazada.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Evaluador o colaborador |
| Estímulo | Revisa una propuesta de la IA |
| Entorno | H3, operación normal, también después de que la propuesta se resolvió |
| Artefacto | Propuestas de IA y sus justificaciones |
| Respuesta | Muestra la justificación y las evidencias concretas que la sustentan |
| Medida de respuesta | **UNKNOWN** |

## Por qué puede ser significativo

- Obliga a conservar, junto a cada propuesta, su justificación y las referencias a la evidencia usada. Posiblemente también el contexto que usó el modelo (INFERENCE a partir de EVD-2026-0013 y EVD-2026-0038).
- Si el contenido de GitLab cambia después de la propuesta, la justificación puede dejar de coincidir con el origen. Queda por decidir si se conserva una copia (UNKNOWN; relacionado con [asr-BR-ACR-03](asr-BR-ACR-03.md)).
- Es la mitigación declarada del sesgo (VIS-001:L145) y la base de la transparencia (VIS-001:L104, L143).

## Perspectivas afectadas

Datos · Integración (componente de IA) · UX

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0013 | La IA propone un nivel **con su justificación** | VIS-001:L81 | FACT | Alta |
| EVD-2026-0038 | Mitigación del sesgo: justificación trazable en cada propuesta | VIS-001:L145 | FACT | Alta |
| EVD-2026-0016 | El colaborador ve las propuestas de la IA sobre él | VIS-001:L104 | FACT | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- Los criterios de calidad y contexto de la propuesta (P-13).
- Si hay que poder reproducir o auditar una propuesta pasada (versión del modelo, datos de entrada).

## Preguntas para el arquitecto

1. ¿Se exige reproducibilidad de una propuesta, o basta con conservar la justificación y las referencias?

## Disposición humana

- **Recomendación del agente (no es decisión):** CANDIDATE. Puede unirse con [asr-BR-ACR-03](asr-BR-ACR-03.md) si el arquitecto trata la trazabilidad como una sola preocupación.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
