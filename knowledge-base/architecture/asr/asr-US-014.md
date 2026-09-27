---
type: ASR Candidate
title: "ASR candidato — Medibilidad de los KPI desde H1 (US-014)"
description: "Tres de los seis KPI miden tiempos y evolución; los datos que necesitan nacen en H1 aunque el tablero llegue en H3."
tags: [asr, medibilidad, kpi, datos-historicos]
status: draft
generated:
  by: "asr-discovery/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
---

# ASR candidato — Medibilidad de los KPI desde H1

- **Requisito de origen:** US-014 (ver los KPI), en [USC-001](../../requirement/USC-001-user-stories-plataforma-gestion-formacion.md#us-014); VIS-001 §8.
- **Atributo de calidad:** medibilidad / observabilidad de negocio.
- **Tipo:** requisito funcional con impacto en datos transversales.

## Enunciado

Los KPI 2 (tiempo de asignación), 3 (cierre de brechas) y 4 (tiempo a competencia) se calculan sobre la evolución en el tiempo. Necesitan saber cuándo se pidió un perfil y cuándo se asignó, y cuándo cambió cada nivel. Esos hechos ocurren desde H1, aunque el tablero es de H3.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Dirección / Gerencia |
| Estímulo | Consulta los KPI 2, 3 o 4 sobre un período que incluye H1 |
| Entorno | H3, con datos acumulados desde H1 |
| Artefacto | Datos de requerimientos, asignaciones y certificaciones |
| Respuesta | Los KPI se calculan con los datos de todo el período |
| Medida de respuesta | **UNKNOWN**: sin metas ni línea base (VIS-001:L152) |

## Por qué puede ser significativo

- Si H1 no registra con fecha los eventos que miden los KPI (pedido de perfil, asignación, cambios de nivel), H3 no podrá calcularlos para ese período (INFERENCE a partir de EVD-2026-0041 y del orden de horizontes, VIS-001:L128-L136).
- Se relaciona con [asr-BR-ACR-03](asr-BR-ACR-03.md) (historial de certificaciones) y [asr-BR-CAT-06](asr-BR-CAT-06.md) (versionado del catálogo).

## Perspectivas afectadas

Datos · Operación (analítica)

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0041 | KPI 2: días entre que un proyecto pide un perfil y se asigna a alguien; KPI 3: reducción de la brecha promedio; KPI 4: tiempo para pasar de un nivel al siguiente | VIS-001:L117-L124 | FACT | Alta |
| EVD-2026-0051 | El tablero de capacidad y KPI llega en H3; requerimientos y certificación empiezan en H1 | VIS-001:L132-L134 | FACT | Alta |
| EVD-2026-0023 | Cómo se decide una asignación está abierto (afecta al KPI 2) | VIS-001:L154 | UNKNOWN | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- Metas y línea base de los KPI (P-03).
- Qué evento marca "asignado" (P-05) y qué es un "perfil activo" (GQ-08). *Nota (2026-09-27):* P-05 quedó respondida: la asignación la registra el Jefe de Ingeniería o un ADMIN (BRC-001 BR-REQ-04), así que el evento existe en la plataforma; puede cubrir uno o varios colaboradores y una persona puede estar en varios requerimientos (BR-REQ-12). Desde qué momento se mide el "tiempo de asignación" (¿declaración del requerimiento?) y si cuenta una asignación bajo el nivel (BR-REQ-11, P-53) siguen sin definir. La disposición no cambia.

## Preguntas para el arquitecto

1. ¿Los KPI deben poder calcularse retroactivamente desde el inicio de H1?

## Disposición humana

- **Recomendación del agente (no es decisión):** CANDIDATE. El costo de no capturar estos datos en H1 es irreversible para ese período.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
