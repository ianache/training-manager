---
type: ASR Candidate
title: "ASR candidato — Procesamiento de evidencia de GitLab por IA bajo uso interno (BR-IA-01)"
description: "Un agente de IA analiza issues, MRs y milestones de GitLab en solo lectura y con uso interno; la calidad de esos datos es irregular y se desconoce si pueden salir hacia un proveedor de IA."
tags: [asr, ia, integracion, gitlab, calidad-de-datos, confidencialidad]
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

# ASR candidato — Procesamiento de evidencia de GitLab por IA bajo uso interno

- **Requisito de origen:** BR-IA-01 (lectura de GitLab, uso interno) y BR-IA-02 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)); capacidad 7 de VIS-001; US-011, US-012.
- **Atributo de calidad:** confidencialidad, interoperabilidad y calidad de datos.
- **Tipo:** requisito funcional significativo (H3).

## Enunciado

En H3, un agente analiza la actividad de GitLab (issues, MRs, milestones), la asocia a las competencias del rol y propone un nivel. Lee GitLab en solo lectura, la evidencia es de uso interno y los datos de GitLab pueden ser inconsistentes.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Nueva actividad de un colaborador en GitLab, o una solicitud de análisis |
| Estímulo | El agente debe analizarla y producir una propuesta justificada |
| Entorno | H3; datos de GitLab con etiquetas o asignaciones inconsistentes |
| Artefacto | Agente de IA y su integración con GitLab |
| Respuesta | Genera una propuesta con justificación y evidencias, sin escribir en GitLab ni sacar la evidencia del uso interno |
| Medida de respuesta | **UNKNOWN**: frecuencia, volumen, latencia y precisión esperada |

## Por qué puede ser significativo

- Agrega un componente de IA con una integración de lectura sobre GitLab. Su frecuencia (por lotes o continua) y su volumen condicionan la integración (INFERENCE a partir de EVD-2026-0013 y EVD-2026-0014).
- **CONFLICT potencial:** "uso interno" (VIS-001:L95, L165) frente a usar un modelo de IA alojado por un proveedor externo. Las fuentes no dicen si los datos de GitLab pueden salir de la organización hacia un servicio de IA. Esto puede restringir dónde corre el modelo (UNKNOWN).
- La calidad irregular de los datos de GitLab (VIS-001:L146) y el principio "evidencia sobre volumen" (VIS-001:L102) afectan a cómo se preparan los datos antes de proponer (INFERENCE).

## Perspectivas afectadas

Integración · Seguridad (confidencialidad) · Datos · Despliegue · Operación

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0013 | Un agente analiza issues, MRs y milestones y propone un nivel con justificación | VIS-001:L81 | FACT | Alta |
| EVD-2026-0014 | GitLab: lectura; uso interno | VIS-001:L95, L165 | FACT | Alta |
| EVD-2026-0015 | La cantidad de issues cerrados no prueba dominio | VIS-001:L102 | FACT | Media |
| EVD-2026-0040 | Riesgo: datos pobres en GitLab; mitigación: convenciones mínimas de etiquetado (a definir) | VIS-001:L146 | FACT | Alta |
| EVD-2026-0050 | No se sabe si la evidencia de GitLab puede procesarse con un servicio de IA externo | Ausencia en VIS-001 y BRC-001 | UNKNOWN | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- La política corporativa sobre el envío de datos internos a servicios de IA.
- Qué instancia de GitLab es, su volumen (proyectos, issues, usuarios) y los permisos de lectura disponibles.
- La frecuencia de análisis que espera el negocio.
- Los criterios de calidad de la propuesta (P-13).

## Preguntas para el arquitecto

1. ¿Los datos de GitLab pueden enviarse a un proveedor de IA externo, o el modelo debe correr dentro de la organización?
2. ¿El análisis es por lotes, a demanda o continuo?

## Disposición humana

- **Recomendación del agente (no es decisión):** INVESTIGATE. Es significativo si el conflicto de confidencialidad se confirma; falta la política de IA.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
