---
type: ASR Candidate
title: "ASR candidato — Trazabilidad auditable de las certificaciones (BR-ACR-03)"
description: "Cada nivel certificado debe poder rastrearse hasta sus evidencias, quien lo certificó y cuándo, con historial, en todas las vías de certificación."
tags: [asr, auditabilidad, trazabilidad, certificacion]
status: draft
generated:
  by: "asr-discovery/1.0"
  at: "2026-09-26T21:14:12-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: us-003
    resource: /knowledge-base/requirement/user-stories/US-003-acreditar-manualmente-un-nivel.md
---

# ASR candidato — Trazabilidad auditable de las certificaciones

- **Requisito de origen:** BR-ACR-03 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)); US-003, US-004, US-011.
- **Atributo de calidad:** auditabilidad / trazabilidad (integridad de la información).
- **Tipo:** requisito funcional con atributo de calidad transversal.

## Enunciado

Todo nivel certificado, por cualquier vía (manual en H1, propuesta de IA aprobada en H3), se puede rastrear hasta sus evidencias, quién lo certificó y cuándo. El perfil conserva el historial de niveles.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Colaborador, evaluador, Jefe de Ingeniería o una auditoría interna |
| Estímulo | Consulta cómo se obtuvo un nivel certificado, actual o pasado |
| Entorno | Operación normal, en cualquier momento posterior a la certificación |
| Artefacto | Registro de certificaciones y perfil de competencias |
| Respuesta | Muestra el nivel, las evidencias asociadas, quién certificó y cuándo, y las certificaciones anteriores de esa competencia |
| Medida de respuesta | **UNKNOWN**: ninguna fuente fija retención, completitud ni tiempo de consulta |

## Por qué puede ser significativo

- Atraviesa varias capacidades: certificación manual (H1), revisión de propuestas de IA (H3), perfil, brechas y KPI (VIS-001:L76, L80, L103).
- Exige conservar el historial en lugar de sobrescribir el nivel vigente. Eso condiciona cómo se persisten las certificaciones y sus evidencias (INFERENCE a partir de EVD-2026-0036 y EVD-2026-0037).
- Si una evidencia vive fuera de la plataforma (GitLab, Classroom), la trazabilidad depende de que esa referencia siga siendo resoluble (INFERENCE; ver evidencia faltante).

## Perspectivas afectadas

Datos · Seguridad (integridad) · Integración · Operación

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0011 | Un evaluador certifica; se registra quién, cuándo y con qué evidencia | VIS-001:L80 | FACT | Alta |
| EVD-2026-0036 | El perfil incluye nivel certificado por competencia, **historial** y evidencias | VIS-001:L76 | FACT | Alta |
| EVD-2026-0037 | Principio: cada nivel certificado se puede rastrear hasta sus evidencias y quien lo certificó | VIS-001:L103 | FACT | Alta |
| EVD-2026-0014 | La evidencia de GitLab se lee (solo lectura) | VIS-001:L95 | FACT | Alta |

Evidencia compartida: `source_type: document`, `freshness: current` (documentos del 2026-09-26, en `draft`), `status: sin verificar`.

## Evidencia faltante

- Retención: cuánto tiempo debe conservarse el historial.
- Si hay requisitos legales o de auditoría interna sobre certificaciones.
- Si la evidencia externa debe copiarse (snapshot) o basta la referencia, en caso de que el origen cambie o se borre.
- Si una certificación puede revocarse y cómo queda en el historial (P-14).

## Preguntas para el arquitecto

1. ¿La trazabilidad exige conservar la evidencia o basta con referenciarla?
2. ¿Hay una política de retención corporativa aplicable?

## Disposición humana

- **Recomendación del agente (no es decisión):** CANDIDATE. La evidencia de la necesidad es alta; su medida de respuesta es UNKNOWN.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
