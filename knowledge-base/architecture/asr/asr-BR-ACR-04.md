---
type: ASR Candidate
title: "ASR candidato — Ninguna certificación sin firma humana (BR-ACR-04)"
description: "Ningún componente automático, incluido el agente de IA, puede certificar un nivel; solo un evaluador humano."
tags: [asr, integridad, human-in-the-loop, ia, certificacion]
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

# ASR candidato — Ninguna certificación sin firma humana

- **Requisito de origen:** BR-ACR-04 y BR-ACR-02 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)); US-003, US-011.
- **Atributo de calidad:** integridad / seguridad (control de la decisión).
- **Tipo:** restricción de negocio con impacto transversal.

## Enunciado

Ningún componente automático puede crear o cambiar un nivel certificado. El agente de IA (H3) solo propone con justificación; la certificación requiere la acción de un evaluador humano.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Agente de IA u otro proceso automático |
| Estímulo | Intenta certificar o modificar un nivel |
| Entorno | Operación normal, H3 |
| Artefacto | Registro de certificaciones |
| Respuesta | El cambio no ocurre; la propuesta queda pendiente de revisión humana |
| Medida de respuesta | **UNKNOWN** (por ejemplo, si debe auditarse cada intento) |

## Por qué puede ser significativo

- Separa la responsabilidad entre el componente que propone (IA) y el que certifica (humano). La IA no debe tener ninguna vía de escritura sobre los niveles certificados (INFERENCE a partir de EVD-2026-0012 y EVD-2026-0013).
- Condiciona el modelo de autorización y el flujo de revisión de H3, aunque H1 ya lo cumple por ser manual (EVD-2026-0022).
- Es la mitigación declarada del riesgo de sesgo de la IA (VIS-001:L145).

## Perspectivas afectadas

Seguridad · Integración (componente de IA) · Datos

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0012 | Ninguna certificación sin firma humana; la IA propone y justifica, pero no decide | VIS-001:L81, L101 | FACT | Alta |
| EVD-2026-0013 | Un humano aprueba, ajusta o rechaza cada propuesta de la IA | VIS-001:L81 | FACT | Alta |
| EVD-2026-0022 | En H1 la certificación es manual; el agente llega en H3 | VIS-001:L132, L134 | FACT | Alta |
| EVD-2026-0038 | Mitigación del sesgo de IA: firma humana obligatoria y justificación trazable | VIS-001:L145 | FACT | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- Qué constituye la "firma humana": una acción de aprobación registrada o una firma formal (electrónica).
- Quiénes son los evaluadores y quién los designa (RCP-Q1).

## Preguntas para el arquitecto

1. ¿"Firma" implica algún requisito de firma electrónica o no repudio, o basta la aprobación autenticada?

## Disposición humana

- **Recomendación del agente (no es decisión):** CANDIDATE.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
