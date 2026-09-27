---
type: Refined User Story
title: "US-003 — Certificar manualmente un nivel"
description: "Un evaluador humano revisa las evidencias de un colaborador y certifica su nivel L1–L4 en una competencia, con registro de quién, cuándo y con qué evidencia."
tags: [user-story, h1, certificacion, evidencia]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-27T13:30:00-05:00"
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
- **Excluye:** propuestas de la IA ([US-011](../USC-001-user-stories-plataforma-gestion-formacion.md#us-011), H3) y certificados de curso ([US-010](../USC-001-user-stories-plataforma-gestion-formacion.md#us-010), H2).
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
- **Límite sin regla:** una competencia y nivel sin requisitos de evidencia definidos todavía, posible porque la definición es progresiva (BR-CAT-17): no se sabe si se puede certificar (P-39).
- **Límite sin regla:** certificar un nivel sobre una competencia que ya tiene uno (subir o bajar), o revocarlo (P-14).
- **Límite sin regla:** un evaluador que certifica a alguien de su propio equipo (P-09).
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

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

## Reglas, dependencias e impactos

- **Reglas:** BR-ACR-01 a BR-ACR-05, BR-ACR-07, BR-ACR-09, BR-ACR-12, BR-CAT-15, BR-CAT-17, BR-PRF-02 y BR-PRG-02.
- **Contexto (P-28):** la certificación es el medio por el que se evalúa la evolución del colaborador después de su nivel inicial de rol (BR-PRF-02). Cómo se decide el paso al siguiente nivel de rol está abierto (P-42) y no forma parte de esta historia.
- **Alimenta:** [US-004](US-004-consultar-mi-perfil-de-competencias.md) (perfil), [US-005](US-005-ver-mi-brecha-frente-a-un-rol.md) (brecha) y [US-006](US-006-buscar-candidatos-para-un-requerimiento.md) (búsqueda).
- **Base de:** US-011 (H3), que reutiliza este flujo de certificación.
- **Contradicción vigente:** AMB-03. Gestión de formación / RR. HH. "gestiona certificaciones" (VIS-001:L45), pero el que certifica es el evaluador (VIS-001:L80). Se mantienen las dos fuentes.
- **Ambigüedad vigente:** AMB-01. La formación cuenta como evidencia (VIS-001:L71), pero el certificado de curso no equivale a un nivel (VIS-001:L82).

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-01 — ¿Qué evidencia mínima exige cada nivel L1–L4? | Jefe de Ingeniería | Alta | Respondida en lo esencial (ianache (Jefe de Ingeniería), 2026-09-26): BR-ACR-07 |
| P-22 — ¿"Tipo de evidencia" se refiere a las tres categorías de BR-ACR-01 (formación, práctica evaluada, desempeño en proyecto) o a una evidencia concreta (por ejemplo, un curso o una práctica determinada)? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): evidencia concreta dentro de una de las tres categorías (BR-ACR-08); confirmada (ianache (Jefe de Ingeniería), 2026-09-27) |
| P-23 — ¿El evaluador puede aceptar una evidencia equivalente a la definida? | Jefe de Ingeniería | Media | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27): cada requisito se declara requerida o deseada; se exigen todas las requeridas y las deseadas refuerzan la certificación (BR-ACR-09, BR-ACR-12). Las equivalencias siguen abiertas |
| P-24 — ¿Hay que definir el tipo de evidencia para los cuatro niveles de cada competencia? | Jefe de Ingeniería | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): se definen de forma progresiva (BR-CAT-17). Ver P-39 |
| P-39 — ¿Se puede certificar un nivel de una competencia que aún no tiene requisitos de evidencia definidos? | Jefe de Ingeniería | Alta | Nueva (BRC-001, derivada de P-24) |
| P-41 — ¿Cómo "refuerza" una evidencia deseada la certificación? ¿Solo queda registrada o cambia algo? | Jefe de Ingeniería | Media | Nueva (BRC-001, derivada de P-23) |
| P-31 — ¿El Evaluador y el Jefe de Ingeniería tienen perfil de competencias? | Jefe de Ingeniería | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): son solo gestores del programa y por ahora quedan fuera de la evaluación (BR-PRG-01, BR-PRG-02) |
| P-42 — ¿Cómo se decide el paso de un colaborador al siguiente nivel de su rol? | Jefe de Ingeniería | Alta | Nueva (BRC-001, derivada de P-28); no bloquea esta historia |
| RCP-Q1 — ¿Quiénes son los evaluadores y quién los designa? ¿Instructor y evaluador son el mismo rol (GQ-07)? | Jefe de Ingeniería | Alta | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-26): el Evaluador gestiona el programa junto con el Jefe de Ingeniería (BR-PRG-01). Sigue abierto quién los designa y si instructor y evaluador son el mismo rol |
| P-09 — ¿Qué hace Gestión de formación / RR. HH. en la certificación? ¿Un evaluador puede certificar a su propio equipo? | Responsable de producto | Media | Abierta (BRC-001) |
| RCP-Q2 — ¿En H1 un evaluador puede registrar a mano evidencia de GitLab? | Jefe de Ingeniería | Media | Abierta (RCP-001) |
| P-14 — ¿Una certificación vence o puede revocarse? ¿Se puede recertificar? | Jefe de Ingeniería | Baja | Abierta (BRC-001) |
| P-07 — ¿Aprobar un curso aporta evidencia para algún nivel? | Jefe de Ingeniería | Media | Abierta (BRC-001) |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el flujo de certificación, su trazabilidad y la exigencia de evidencias están sostenidos (AC-1 a AC-7): el requisito es una evidencia concreta (P-22, confirmada) y se exigen todas las requeridas, no las deseadas (BR-ACR-09, BR-ACR-12). Siguen abiertos quién puede certificar (RCP-Q1) y si se puede certificar un nivel sin requisitos definidos (P-39), las dos de prioridad alta; también las equivalencias (P-23) y el efecto de una evidencia deseada (P-41).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y responde RCP-Q1 y P-39.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis
- [x] Contradicciones visibles (AMB-01, AMB-03)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
