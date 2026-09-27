---
type: Business Rules Catalog
title: "BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación"
description: "Catálogo de reglas de negocio, estados, validaciones, permisos y excepciones extraídos de la visión VIS-001, con registro de evidencias, vacíos y preguntas abiertas."
tags: [business-rules, formacion, competencias, acreditacion, certificados, gitlab, ia]
status: draft
generated:
  by: "af-business-rule-extractor/1.0"
  at: "2026-09-26T18:45:38-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: repository-guidelines
    resource: /AGENTS.md
---

# BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación

> **Procedencia:** la única fuente funcional disponible es [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md), que está en `draft` y sin verificación humana. Ninguna regla de este catálogo está verificada. Los localizadores `VIS-001:Lnn` indican la línea del documento fuente.

## Objetivo y alcance

- **Pregunta:** ¿qué reglas de negocio, estados, validaciones, permisos y excepciones se pueden sostener hoy con la evidencia disponible sobre la plataforma?
- **Consumidor previsto:** `af-user-story-refiner` (User Stories con criterios Given/When/Then) y los responsables humanos que validan el catálogo (Jefe de Ingeniería, responsable del producto).
- **Incluye:** catálogo de competencias, requerimientos de proyecto, brechas, acreditación, evidencia de GitLab asistida por IA, certificados, integraciones y transparencia.
- **Excluye:** diseño técnico, modelo de datos, APIs, y todo lo que VIS-001 declara fuera de alcance (§7): hospedar contenido de cursos, verificación pública de certificados, evaluación salarial o de RR. HH. y gestión de proyectos.

## Resultado

Se catalogaron **32 entradas**: 26 reglas y 6 vacíos. Tres áreas tienen reglas suficientes para redactar historias: el catálogo y su escala de niveles, la acreditación con firma humana y los certificados. Hay tres áreas con vacíos que impiden escribir criterios de aceptación completos:

1. **Evidencia por nivel (L1–L4):** no se sabe qué evidencia acredita cada nivel (P-01).
2. **Decisión de asignación:** no se sabe si la plataforma solo recomienda o si hay un flujo de aprobación (P-05).
3. **Permisos:** la fuente no define quién puede ver o editar qué, salvo unos pocos casos (P-08, P-09).

La fuente no define **estados** explícitos. Los únicos que se pueden derivar son los de la propuesta de nivel hecha por la IA (BR-IA-02).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0001 | Los productos en alcance son CLocator (v1), CLocator v2 (C-Go), SIGO y SmartSuite. | VIS-001:L23 | fact | high |
| EVD-2026-0002 | Modelo: Producto → Rol → Competencia → Nivel requerido. | VIS-001:L56 | fact | medium |
| EVD-2026-0003 | Escala de niveles L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto / Referente. | VIS-001:L62-69 | decision | high |
| EVD-2026-0004 | Cada rol exige un nivel mínimo por competencia. | VIS-001:L71 | fact | medium |
| EVD-2026-0005 | El Jefe de Ingeniería es el dueño del catálogo de roles y competencias de cada producto. | VIS-001:L51, L162 | decision | high |
| EVD-2026-0006 | El papel del Responsable de producto frente al Jefe de Ingeniería está por confirmar. | VIS-001:L44, L155 | gap | high |
| EVD-2026-0007 | Un proyecto pertenece a un producto y declara requerimientos (Rol + Competencias + Nivel). El PM los declara. | VIS-001:L58, L77 | fact | medium |
| EVD-2026-0008 | Brecha = Nivel requerido − Nivel acreditado. | VIS-001:L59 | fact | medium |
| EVD-2026-0009 | El nivel acreditado se respalda con evidencia de formación, práctica evaluada o desempeño en proyecto (GitLab). | VIS-001:L57, L71 | fact | medium |
| EVD-2026-0010 | Qué evidencia exige cada nivel es una pregunta abierta. | VIS-001:L71, L150 | gap | high |
| EVD-2026-0011 | Un evaluador revisa las evidencias y acredita el nivel; se registra quién, cuándo y con qué evidencia. | VIS-001:L80 | fact | medium |
| EVD-2026-0012 | Ninguna acreditación ocurre sin firma humana; la IA propone y justifica pero no decide. | VIS-001:L81, L101 | decision | high |
| EVD-2026-0013 | Un agente analiza issues, MRs y milestones de GitLab y propone un nivel con justificación; un humano aprueba, ajusta o rechaza. | VIS-001:L81 | decision | high |
| EVD-2026-0014 | La evidencia de GitLab es de uso interno y se accede en solo lectura. | VIS-001:L95, L165 | decision | high |
| EVD-2026-0015 | La cantidad de issues cerrados no prueba dominio; pesan la calidad y el contexto. | VIS-001:L102 | fact | medium |
| EVD-2026-0016 | El colaborador ve su perfil, sus evidencias y las propuestas de la IA sobre él. | VIS-001:L104 | fact | medium |
| EVD-2026-0017 | Se certifica la aprobación del curso final según el cumplimiento de los objetivos del curso. | VIS-001:L82, L164 | decision | high |
| EVD-2026-0018 | El certificado no equivale a un nivel acreditado. | VIS-001:L82 | decision | high |
| EVD-2026-0019 | El PDF del certificado se pide a docsuite por API REST y la plataforma guarda la referencia. Sin verificación pública. | VIS-001:L82, L109 | decision | high |
| EVD-2026-0020 | Google Classroom se integra en solo lectura; Drive en enlace y lectura. La plataforma no hospeda contenido. | VIS-001:L87, L93-94, L100 | decision | high |
| EVD-2026-0021 | Si falla la integración con Classroom, se evaluará gestión propia de material y progreso; es una decisión posterior, fuera del alcance actual. | VIS-001:L89, L108 | decision | high |
| EVD-2026-0022 | En H1 la acreditación es manual; el agente de GitLab llega en H3. | VIS-001:L132, L134 | decision | high |
| EVD-2026-0023 | Cómo se decide una asignación está abierto. | VIS-001:L154 | gap | high |
| EVD-2026-0024 | Cómo se versiona el catálogo está abierto. | VIS-001:L142, L151 | gap | high |
| EVD-2026-0025 | Cómo se relaciona el curso certificado con los niveles está abierto. | VIS-001:L156 | gap | high |
| EVD-2026-0026 | Gestión de formación / RR. HH. emite certificados y gestiona acreditaciones. | VIS-001:L45 | fact | medium |
| EVD-2026-0027 | El KPI 1 se mide sobre "proyectos activos"; la fuente no define los estados de un proyecto. | VIS-001:L119 | gap | medium |

Todas las evidencias comparten estos campos del esquema:

```yaml
source_type: document
observed_at: 2026-09-26T18:45:38-05:00
freshness: current
owner: Jefe de Ingeniería (catálogo, niveles, acreditación) · Responsable del producto (resto)
```

**Criterio de clasificación:** se usa la etiqueta que VIS-001 asigna (Hecho, Decisión, Supuesto). Las afirmaciones sin etiqueta explícita en la fuente se registran como `fact` con confianza `medium`.

## Reglas, dependencias e impactos

### Catálogo de competencias

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-CAT-01 | Estructura | El catálogo se organiza por producto. Cada producto tiene roles, cada rol tiene competencias y cada competencia tiene un nivel requerido. | EVD-2026-0001, 0002 |
| BR-CAT-02 | Validación | Todo nivel requerido o acreditado debe pertenecer a la escala L1–L4. | EVD-2026-0003 |
| BR-CAT-03 | Validación | Cada competencia de un rol debe tener un nivel mínimo definido. | EVD-2026-0004 |
| BR-CAT-04 | Permiso | El Jefe de Ingeniería gobierna el catálogo de los 4 productos. | EVD-2026-0005 |
| BR-CAT-05 | Vacío | Participación del Responsable de producto en el mantenimiento del catálogo: sin definir. | EVD-2026-0006 → P-06 |
| BR-CAT-06 | Vacío | Versionado del catálogo y efecto de un cambio sobre requerimientos y acreditaciones existentes: sin definir. | EVD-2026-0024 → P-02 |

### Requerimientos de proyecto y asignación

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-REQ-01 | Estructura | Un proyecto pertenece a un producto. | EVD-2026-0007 |
| BR-REQ-02 | Permiso | El PM declara los requerimientos de su proyecto (rol, competencias y nivel). | EVD-2026-0007 |
| BR-REQ-03 | Validación (inferencia) | Un requerimiento solo puede usar roles y competencias del catálogo del producto del proyecto. | Inferida de EVD-2026-0002 y 0007; confirmar → P-10 |
| BR-REQ-04 | Vacío | Decisión de asignación: recomendación al PM o flujo de aprobación. | EVD-2026-0023 → P-05 |
| BR-REQ-05 | Vacío | Estados de un proyecto (qué es "activo"). | EVD-2026-0027 → P-11 |

### Brechas

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-BRE-01 | Cálculo | Brecha = nivel requerido − nivel acreditado, por competencia. | EVD-2026-0008 |
| BR-BRE-02 | Cálculo (inferencia) | La resta supone que L1–L4 es una escala ordinal comparable (L1 = 1 … L4 = 4). | Inferida de EVD-2026-0003 y 0008; confirmar → P-12 |
| BR-BRE-03 | Caso límite | Sin definir: cómo se calcula la brecha si el colaborador no tiene nivel acreditado, y si una brecha negativa (nivel superior al requerido) cuenta como cubierta. | → P-12 |

### Acreditación

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-ACR-01 | Validación | Un nivel acreditado debe estar respaldado por al menos una evidencia de tipo formación, práctica evaluada o desempeño en proyecto. | EVD-2026-0009 |
| BR-ACR-02 | Permiso | Solo un evaluador humano acredita un nivel. | EVD-2026-0011, 0012 |
| BR-ACR-03 | Auditoría | Cada acreditación registra quién acreditó, cuándo y con qué evidencia. | EVD-2026-0011 |
| BR-ACR-04 | Excepción prohibida | No existe acreditación automática: ningún nivel se acredita sin firma humana, tampoco a partir de una propuesta de la IA. | EVD-2026-0012 |
| BR-ACR-05 | Alcance | En H1 la acreditación es manual. | EVD-2026-0022 |
| BR-ACR-06 | Vacío | Evidencia mínima exigida por cada nivel L1–L4. | EVD-2026-0010 → P-01 |

### Evidencia de GitLab asistida por IA (H3)

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-IA-01 | Restricción | La plataforma lee GitLab (issues, MRs, milestones) en solo lectura y usa esa evidencia solo internamente. | EVD-2026-0014 |
| BR-IA-02 | Estado | La propuesta de nivel de la IA siempre incluye justificación y termina en uno de tres estados: aprobada, ajustada o rechazada por un humano. | EVD-2026-0013 |
| BR-IA-03 | Principio | La cantidad de issues cerrados no basta para proponer un nivel. Falta un criterio medible de calidad y contexto. | EVD-2026-0015 → P-13 |
| BR-IA-04 | Permiso | El colaborador puede ver las propuestas de la IA sobre él. | EVD-2026-0016 |

### Certificados (H2)

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-CER-01 | Condición | Se emite un certificado cuando el colaborador aprueba el curso final, según el cumplimiento de sus objetivos. | EVD-2026-0017 |
| BR-CER-02 | Restricción | Un certificado no acredita un nivel por sí mismo. | EVD-2026-0018 |
| BR-CER-03 | Integración | El PDF se genera en docsuite por API REST y la plataforma guarda solo la referencia. | EVD-2026-0019 |
| BR-CER-04 | Restricción | No hay verificación pública de certificados. | EVD-2026-0019 |
| BR-CER-05 | Permiso | Gestión de formación / RR. HH. emite los certificados. | EVD-2026-0026 |

### Integraciones y contenido

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-INT-01 | Restricción | Classroom se usa en solo lectura; Drive en enlace y lectura. La plataforma no hospeda material de cursos. | EVD-2026-0020 |
| BR-INT-02 | Excepción | Si la integración con Classroom falla, puede evaluarse una gestión propia de material y progreso. Requiere una decisión humana posterior y no forma parte del alcance actual. | EVD-2026-0021 |

### Transparencia

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-TRA-01 | Permiso | El colaborador puede ver su perfil y sus evidencias. | EVD-2026-0016 |

### Dependencias

- BR-BRE-01, BR-REQ-03 y la búsqueda de personal dependen de BR-CAT-01 a BR-CAT-03. Así lo justifica VIS-001:L136: "sin un catálogo acordado, ni la formación ni la IA tienen contra qué medir".
- BR-IA-02 depende de BR-ACR-02 y BR-ACR-04: la propuesta de la IA entra al mismo flujo de acreditación humana.
- BR-CER-02 depende de P-07: mientras no se resuelva, no se puede decir si un certificado aporta evidencia a BR-ACR-01.

### Contradicciones y ambigüedades

| ID | Descripción | Fuentes |
|---|---|---|
| AMB-01 | VIS-001 cuenta la **formación** como evidencia de nivel (L71), pero también dice que el certificado **no equivale** a un nivel (L82). No es una contradicción, pero sin resolver P-07 no se sabe si aprobar un curso aporta evidencia a algún nivel. | VIS-001:L71, L82, L156 |
| AMB-02 | La ausencia de un catálogo común está clasificada a la vez como "Supuesto" y como "validado en la sesión, falta evidencia documental". | VIS-001:L35 |
| AMB-03 | Gestión de formación / RR. HH. "gestiona acreditaciones" (L45), pero el que acredita es el evaluador (L80). No está claro qué parte de la acreditación hace cada uno. | VIS-001:L45, L46, L80 |

## Vacíos y preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|---|
| P-01 | ¿Qué evidencia mínima exige cada nivel L1–L4? | Jefe de Ingeniería | Alta | Abierta (VIS-001 §11.1) |
| P-02 | ¿Cómo se versiona el catálogo y qué pasa con los requerimientos y acreditaciones vigentes cuando cambia? | Jefe de Ingeniería | Alta | Abierta (VIS-001 §11.2) |
| P-05 | ¿La plataforma solo recomienda y el PM decide la asignación, o hay un flujo de aprobación? ¿Quién aprueba? | Responsable del producto | Alta | Abierta (VIS-001 §11.5) |
| P-06 | ¿Qué papel tiene el Responsable de producto frente al Jefe de Ingeniería en el mantenimiento del catálogo? | Jefe de Ingeniería | Media | Abierta (VIS-001 §11.6) |
| P-07 | ¿Aprobar un curso aporta evidencia para algún nivel? ¿Para cuál? | Jefe de Ingeniería | Alta | Abierta (VIS-001 §11.7) |
| P-08 | ¿Quién puede ver el perfil y las evidencias de otro colaborador (PM, evaluador, Dirección)? | Responsable del producto | Alta | Nueva |
| P-09 | ¿Qué parte de la acreditación hace Gestión de formación / RR. HH. y qué parte el evaluador? ¿El evaluador puede acreditar a alguien de su propio equipo? | Responsable del producto | Media | Nueva (AMB-03) |
| P-10 | ¿Un requerimiento solo puede usar roles y competencias del catálogo de su producto? | Jefe de Ingeniería | Media | Nueva (BR-REQ-03) |
| P-11 | ¿Qué estados tiene un proyecto y cuándo se considera "activo"? | Responsable del producto | Media | Nueva |
| P-12 | ¿Cómo se trata la brecha sin nivel acreditado y la brecha negativa? ¿Los niveles se restan como números? | Jefe de Ingeniería | Media | Nueva |
| P-13 | ¿Qué criterios de calidad y contexto debe usar la IA para proponer un nivel? | Jefe de Ingeniería | Media | Nueva (H3) |
| P-14 | ¿Una acreditación vence o puede revocarse? | Jefe de Ingeniería | Media | Nueva |

Las preguntas P-03 (metas de KPI) y P-04 (integración con el sistema de RR. HH.) de VIS-001 §11 no afectan a las reglas de este catálogo y siguen abiertas en la visión.

## Riesgos y supuestos

- **Riesgo:** la fuente única está en `draft`. Si VIS-001 cambia, este catálogo debe revisarse.
- **Riesgo:** sin P-01, cualquier historia de acreditación quedará con criterios de aceptación incompletos.
- **Supuesto:** las afirmaciones sin etiqueta en VIS-001 reflejan lo que dijo el responsable del producto en la sesión de descubrimiento del 2026-09-26.

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** las reglas del catálogo, la acreditación con firma humana, los certificados y las integraciones bastan para redactar historias. P-01, P-05, P-07 y P-08 bloquean los criterios completos de acreditación, asignación y visibilidad.
- **Siguiente rol o Skill:** `af-user-story-refiner`, empezando por H1 (catálogo, requerimientos, perfil con acreditación manual, brechas).
- **Decisión humana requerida:** el Jefe de Ingeniería y el responsable del producto validan las reglas y responden las preguntas de prioridad alta. `verified` queda sin asignar hasta esa validación.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos, inferencias y vacíos
- [x] Contradicciones y ambigüedades visibles
- [x] Casos negativos y límite considerados (BR-ACR-04, BR-BRE-03, BR-CER-02)
- [ ] Validación humana registrada
