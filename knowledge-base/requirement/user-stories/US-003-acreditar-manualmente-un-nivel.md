---
type: Refined User Story
title: "US-003 — Certificar manualmente un nivel"
description: "Un evaluador humano revisa las evidencias de un colaborador y certifica su nivel L1–L4 en una competencia, con registro de quién, cuándo y con qué evidencia."
tags: [user-story, h1, certificacion, evidencia]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-27T18:00:00-05:00"
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

# US-003 — Certificar manualmente un nivel

## Objetivo y alcance

- **Pregunta:** ¿qué debe cumplir la certificación manual de H1 para que cada nivel sea verificable y trazable?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Jefe de Ingeniería, que valida.
- **Incluye:** certificación manual por un evaluador con evidencias de formación, práctica evaluada o desempeño en proyecto.
- **Excluye:** propuestas de la IA ([US-011](../USC-001-user-stories-plataforma-gestion-formacion.md#us-011), H3) y certificados de curso ([US-010](../USC-001-user-stories-plataforma-gestion-formacion.md#us-010), H2). También la **propuesta de certificación a partir de un curso** (H2): cuando las evidencias reunidas en un curso cumplen los requisitos de evidencia requeridos del nivel objetivo, la plataforma propone certificar el nivel objetivo de cada competencia que el curso desarrolla (BR-ACR-14; P-07 respondida el 2026-09-27). **Inferencia:** esa propuesta entra a este mismo flujo y solo certifica con la firma de un evaluador (BR-ACR-02, BR-ACR-04); ninguna historia la cubre todavía. Quién la firma, el Evaluador o el Instructor de la edición (confirmado el 2026-09-27, BR-FOR-05), está abierto (P-07.4, P-49.2).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Evaluador](../../business/glossary/terms/TRM-0021-evaluador.md), **quiero** revisar las [evidencias](../../business/glossary/terms/TRM-0022-evidencia.md) de un colaborador y certificar su nivel en una competencia, **para que** su [nivel certificado](../../business/glossary/terms/TRM-0042-nivel-acreditado.md) sea verificable.

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | un colaborador con al menos una evidencia de formación, práctica evaluada o desempeño en proyecto para una competencia | el evaluador certifica un nivel L1–L4 | el nivel queda en el perfil del colaborador para esa competencia | BR-ACR-01, BR-ACR-02 |
| AC-2 | una certificación registrada | alguien la consulta | ve quién certificó, cuándo y con qué evidencias | BR-ACR-03 |
| AC-3 | que estamos en H1 | se certifica un nivel | la certificación es manual, sin propuestas automáticas | BR-ACR-05 |
| AC-4 | una competencia y un nivel con sus requisitos de evidencia definidos | el evaluador certifica ese nivel | la certificación exige una evidencia que cumpla cada uno de los requisitos declarados como "requerida" | BR-ACR-07, BR-ACR-09, BR-ACR-12 |
| AC-6 | una competencia y un nivel con requisitos "requerida" y "deseada", y un colaborador que cumple todos los requeridos pero no los deseados | el evaluador certifica ese nivel | la certificación se registra: las evidencias deseadas son opcionales | BR-ACR-09, BR-ACR-12 |
| AC-7 | un colaborador que además presenta evidencias de requisitos "deseada" | el evaluador certifica ese nivel | esas evidencias quedan asociadas a la certificación junto con las requeridas. Cómo "refuerzan" la certificación está abierto (P-41) | BR-ACR-03, BR-ACR-12 |
| AC-5 | la rúbrica de una competencia | el evaluador certifica un nivel de esa competencia | evalúa las evidencias contra el comportamiento y el logro visible y verificable que la rúbrica describe para ese nivel | BR-CAT-15 |

### Casos negativos y límite

- **Negativo:** sin ninguna evidencia asociada, la certificación no se puede registrar (BR-ACR-01).
- **Negativo:** nadie que no sea un evaluador humano puede certificar; no hay certificación automática (BR-ACR-02, BR-ACR-04).
- **Negativo:** si falta la evidencia de alguno de los requisitos "requerida" de esa competencia y nivel, el nivel no se puede certificar, aunque se presenten evidencias deseadas (BR-ACR-09, BR-ACR-12).
- **Negativo:** una evidencia distinta de la definida no cumple el requisito (BR-ACR-07). Si se admiten equivalencias, está abierto (P-23).
- **Negativo:** una competencia y nivel sin requisitos de evidencia definidos todavía (posible porque la definición es progresiva, BR-CAT-17) no se puede certificar (BR-ACR-13, P-39 respondida el 2026-09-27). **Inferencia a confirmar (BR-ACR-13):** al menos uno de los requisitos debe ser requerido.
- **Decidido el 2026-10-04:** una certificación se revoca o se recertifica (EVD-2026-0185); el nivel vigente es el más alto de las certificaciones vigentes y no se certifica un nivel inferior (EVD-2026-0186, 0187). **Decidido después (2026-10-04):** no vence (EVD-2026-0190), revocan el Jefe de Ingeniería o ADMIN (0191) y recertificar crea una certificación nueva que reemplaza la anterior (0192). Al revocar se elige un motivo tipificado y se deja una descripción que sustente la decisión, con registro de auditoría (EVD-2026-0194). Motivos: `ERROR_DE_REGISTRO`, `EVIDENCIA_INVALIDA`, `REQUISITOS_NO_CUMPLIDOS` y `OTRO` (se retiró `CONFLICTO_DE_INTERES`, EVD-2026-0200), ampliables (EVD-2026-0195, 0197); descripción de hasta 1000 caracteres (EVD-2026-0196). **Sin regla:** el largo mínimo de la descripción.
- **Decidido el 2026-10-04:** es evaluador quien tiene el rol `evaluador` y cualquier usuario con él puede certificar a cualquier colaborador (EVD-2026-0199, 0200); la restricción del equipo (EVD-2026-0198, BR-ACR-17) se retiró.
- **Fuera de alcance por ahora:** certificar competencias de un Evaluador o del Jefe de Ingeniería. Son solo gestores del programa y quedan fuera del proceso de evaluación, aunque sus roles tienen competencias definidas (BR-PRG-01, BR-PRG-02, EVD-2026-0105). **Inferencia:** "fuera del proceso de evaluación" se lee como "no son evaluados"; no cambia que el Evaluador certifica.

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0009 | El nivel certificado se respalda con evidencia de formación, práctica evaluada o desempeño en proyecto | VIS-001:L57, L71 | fact | medium |
| EVD-2026-0010 | La evidencia exigida por nivel está abierta | VIS-001:L71, L150 | gap | high |
| EVD-2026-0011 | Un evaluador revisa y certifica; se registra quién, cuándo y con qué evidencia | VIS-001:L80 | fact | medium |
| EVD-2026-0012 | Ninguna certificación sin firma humana | VIS-001:L81, L101 | decision | high |
| EVD-2026-0022 | En H1 la certificación es manual | VIS-001:L132, L134 | decision | high |
| EVD-2026-0026 | Gestión de formación / RR. HH. "gestiona certificaciones" | VIS-001:L45 | fact | medium |
| EVD-2026-0029 | No se sabe quiénes son los evaluadores ni quién los designa | RCP-001 §7 (RCP-Q1) | gap | high |
| EVD-2026-0030 | No se sabe si en H1 un evaluador puede registrar a mano evidencia de GitLab | RCP-001 §7 (RCP-Q2) | gap | medium |
| EVD-2026-0052 | Para cada competencia y cada nivel (L1–L4), se define qué tipo de evidencia demuestra el logro de ese nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0057 | Un nivel de una competencia puede exigir varias evidencias: se definen todas las evidencias necesarias para demostrar que el colaborador alcanza ese nivel, y certificarlo exige presentarlas todas. *Revisada por EVD-2026-0098: se exigen todas las requeridas (BR-ACR-09).* | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0062 | El Evaluador y el Jefe de Ingeniería son quienes gestionan todo el programa de formación. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0070 | Por cada competencia hay una rúbrica que, para cada nivel L1 a L4, define cómo se evidencia la competencia, es decir, lo que se espera que el colaborador evidencie para certificarlo en ese nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0097 | Se confirma la respuesta a P-22: el requisito de evidencia es una evidencia concreta dentro de una de las tres categorías. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-22 | decision | high |
| EVD-2026-0098 | Cada requisito de evidencia de una competencia y nivel se declara como "requerida" (se debe satisfacer siempre) o "deseada" (puede o no presentarse; si se presenta, refuerza la certificación del nivel objetivo). | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-23 | decision | high |
| EVD-2026-0099 | La definición de los requisitos de evidencia es un proceso progresivo; lo ideal es tener definidos todos los tipos de evidencia. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-24 | decision | high |
| EVD-2026-0102 | La rúbrica define el comportamiento y el logro visible y verificable (a través de evidencias). Las rúbricas las define y aprueba el Jefe de Ingeniería. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-37 | decision | high |
| EVD-2026-0103 | Al registrar un colaborador se le asigna un nivel inicial según su rol; después se evalúa la evolución en las competencias del rol a través de los cursos o de su desempeño en los proyectos, con evidencias específicas de lo que produce. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-28 | decision | high |
| EVD-2026-0105 | El Evaluador y el Jefe de Ingeniería son solo gestores del programa; por ahora quedan fuera del proceso de evaluación, aunque su rol tiene competencias definidas. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-31 | decision | high |
| EVD-2026-0128 | Aprobar un curso es parte de la demostración del nivel requerido de las competencias que desarrolla; la plataforma propone certificar el nivel objetivo cuando las evidencias reunidas en el curso (evaluaciones o cuestionarios y lo producido en proyectos durante el curso) cumplen los requisitos requeridos. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-07 | decision | high |
| EVD-2026-0129 | Las certificaciones y su auditoría las puede ver cualquier colaborador. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-08 | decision | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

## Reglas, dependencias e impactos

- **Reglas:** BR-ACR-01 a BR-ACR-05, BR-ACR-07, BR-ACR-09, BR-ACR-12, BR-ACR-13, BR-CAT-15, BR-CAT-17, BR-PRF-02 y BR-PRG-02.
- **Contexto (P-28):** la certificación es el medio por el que se evalúa la evolución del colaborador después de su nivel inicial de rol (BR-PRF-02). Cómo se decide el paso al siguiente nivel de rol está abierto (P-42) y no forma parte de esta historia.
- **Alimenta:** [US-004](US-004-consultar-mi-perfil-de-competencias.md) (perfil), [US-005](US-005-ver-mi-brecha-frente-a-un-rol.md) (brecha) y [US-006](US-006-buscar-candidatos-para-un-requerimiento.md) (búsqueda).
- **Base de:** US-011 (H3), que reutiliza este flujo de certificación.
- **Contradicción vigente:** AMB-03. Gestión de formación / RR. HH. "gestiona certificaciones" (VIS-001:L45), pero el que certifica es el evaluador (VIS-001:L80). Se mantienen las dos fuentes.
- **Ambigüedad resuelta:** AMB-01 (ianache (Jefe de Ingeniería), 2026-09-27, P-07). La formación cuenta como evidencia: aprobar el curso es parte de la demostración del nivel y la plataforma propone certificar el nivel objetivo (BR-ACR-14); el certificado de curso sigue sin certificar un nivel por sí solo (BR-CER-02).
- **Visibilidad (P-08, respondida el 2026-09-27):** cualquier colaborador puede ver las certificaciones y su auditoría (BR-TRA-06). Afecta a AC-2: "alguien" es cualquier colaborador. Qué se muestra de las calificaciones y del sustento del evaluador sigue abierto (P-54).

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-01 — ¿Qué evidencia mínima exige cada nivel L1–L4? | Jefe de Ingeniería | Alta | Respondida en lo esencial (ianache (Jefe de Ingeniería), 2026-09-26): BR-ACR-07 |
| P-22 — ¿"Tipo de evidencia" se refiere a las tres categorías de BR-ACR-01 (formación, práctica evaluada, desempeño en proyecto) o a una evidencia concreta (por ejemplo, un curso o una práctica determinada)? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): evidencia concreta dentro de una de las tres categorías (BR-ACR-08); confirmada (ianache (Jefe de Ingeniería), 2026-09-27) |
| P-23 — ¿El evaluador puede aceptar una evidencia equivalente a la definida? | Jefe de Ingeniería | Media | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27): cada requisito se declara requerida o deseada; se exigen todas las requeridas y las deseadas refuerzan la certificación (BR-ACR-09, BR-ACR-12). Las equivalencias siguen abiertas |
| P-24 — ¿Hay que definir el tipo de evidencia para los cuatro niveles de cada competencia? | Jefe de Ingeniería | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): se definen de forma progresiva (BR-CAT-17). Ver P-39 |
| P-39 — ¿Se puede certificar un nivel de una competencia que aún no tiene requisitos de evidencia definidos? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no; siempre debe haber forma de evidenciar (BR-ACR-13) |
| P-41 — ¿Cómo "refuerza" una evidencia deseada la certificación? ¿Solo queda registrada o cambia algo? | Jefe de Ingeniería | Media | Nueva (BRC-001, derivada de P-23) |
| P-31 — ¿El Evaluador y el Jefe de Ingeniería tienen perfil de competencias? | Jefe de Ingeniería | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): son solo gestores del programa y por ahora quedan fuera de la evaluación (BR-PRG-01, BR-PRG-02) |
| P-42 — ¿Cómo se decide el paso de un colaborador al siguiente nivel de su rol? | Jefe de Ingeniería | Alta | Nueva (BRC-001, derivada de P-28); no bloquea esta historia |
| RCP-Q1 — ¿Quiénes son los evaluadores y quién los designa? ¿Instructor y evaluador son el mismo rol (GQ-07)? | Jefe de Ingeniería | Alta | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-26): el Evaluador gestiona el programa junto con el Jefe de Ingeniería (BR-PRG-01). Sigue abierto quién los designa y si instructor y evaluador son el mismo rol. *Actualización (2026-09-27, P-49):* el Instructor está confirmado como un colaborador que el Jefe de Ingeniería o un ADMIN asigna a una edición de curso para evaluar a los inscritos (BR-FOR-05); si puede certificar niveles sigue abierto (P-49.2) → **Designan a los evaluadores el Jefe de Ingeniería o un usuario ADMIN (EVD-2026-0189, 2026-10-04).** Sigue abierto si instructor y evaluador son el mismo rol |
| P-09 — ¿Qué hace Gestión de formación / RR. HH. en la certificación? ¿Un evaluador puede certificar a su propio equipo? | Responsable de producto | Media | Abierta (BRC-001) → **Respondida en parte (ianache, 2026-10-04):** un evaluador no puede certificar a su propio equipo (EVD-2026-0198). Sigue abierto qué hace Gestión de formación / RR. HH. |
| RCP-Q2 — ¿En H1 un evaluador puede registrar a mano evidencia de GitLab? | Jefe de Ingeniería | Media | Abierta (RCP-001) |
| P-14 — ¿Una certificación vence o puede revocarse? ¿Se puede recertificar? | Jefe de Ingeniería | Baja | Abierta (BRC-001) → **Respondida (ianache, 2026-10-04):** se revoca o se recertifica (EVD-2026-0185) |
| P-07 — ¿Aprobar un curso aporta evidencia para algún nivel? | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí; la plataforma propone certificar el nivel objetivo y la certificación sigue exigiendo firma humana (BR-ACR-14, BR-CER-02, BR-FOR-04). AMB-01 resuelta |
| P-54 — ¿Las calificaciones de evaluaciones y cuestionarios y el sustento del evaluador también son visibles para todos, o solo el resultado? | Jefe de Ingeniería | Media | Nueva (BRC-001, derivada de P-08) |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el flujo de certificación, su trazabilidad y la exigencia de evidencias están sostenidos (AC-1 a AC-7): el requisito es una evidencia concreta (P-22, confirmada) y se exigen todas las requeridas, no las deseadas (BR-ACR-09, BR-ACR-12). P-39 quedó respondida el 2026-09-27: un nivel sin requisitos definidos no se certifica (BR-ACR-13). Sigue abierto quién puede certificar (RCP-Q1, prioridad alta); también las equivalencias (P-23) y el efecto de una evidencia deseada (P-41).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y responde RCP-Q1, y confirma la inferencia de BR-ACR-13 (al menos un requisito requerido).

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis
- [x] Contradicciones visibles (AMB-03; AMB-01 resuelta el 2026-09-27)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
