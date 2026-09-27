---
type: Architecture Impact Matrix
title: "AIM-001 — Matriz de impacto de arquitectura de la Plataforma de Gestión de Formación"
description: "Traza las User Stories y capacidades de la plataforma sobre los elementos existentes con evidencia (Classroom, Drive, GitLab, docsuite, sistema de RR. HH. y el proceso actual de asignación), clasificando cada impacto."
tags: [architecture, impact-analysis, integraciones, as-is]
status: draft
generated:
  by: "architecture-impact-analyzer/1.0"
  at: "2026-09-26T21:43:55-05:00"
sources:
  - id: adb-001
    resource: /knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# AIM-001 — Matriz de impacto de arquitectura

> **Base AS-IS:** la plataforma no tiene evidencia de existir. Se trata como nueva por decisión del usuario del 2026-09-26 (ver [ACP-001](ACP-001-architecture-context-pack.md)). El impacto se analiza sobre los elementos existentes que las fuentes nombran:
>
> | Elemento | Qué se sabe | Evidencia |
> |---|---|---|
> | E-CLS — Google Classroom | Cursos, tareas y calificaciones | VIS-001:L32, L93 |
> | E-DRV — Google Drive | Material de los cursos | VIS-001:L32, L94 |
> | E-GLB — GitLab | Issues, tareas, bugs, milestones y MRs; gestión de proyectos | VIS-001:L33, L95, L111 |
> | E-DOC — docsuite | Plantillas, PDF por API REST y repositorio de certificados de curso | VIS-001:L34, L96 |
> | E-RRH — Sistema de RR. HH. | Existencia no confirmada: se infiere de la pregunta de VIS-001:L153 | VIS-001:L153 (INFERENCE) |
> | E-PRC — Proceso actual de asignación | Informal, a cargo de los líderes (supuesto) | VIS-001:L35 |
> | E-IDP — Proveedor de identidad | Sin evidencia de cuál es | ADB-001 KG-03 (UNKNOWN) |
>
> La plataforma nueva se identifica como **E-NEW**. Su diseño está fuera de este análisis.

## Impact matrix

| Requirement | Capability | Architecture element | Perspective | Impact type | Evidence | Confidence | Risk | Status |
|---|---|---|---|---|---|---|---|---|
| US-009 | 5. Rutas de formación | E-CLS Classroom | Integration | INDIRECT: requiere acceso de lectura a los cursos; Classroom no cambia | VIS-001:L79, L93; BR-INT-01 | Media | Acceso a la API no confirmado (KG-05) | Por validar |
| US-009 | 5. Rutas de formación | E-DRV Drive | Integration | INDIRECT: enlace y lectura del material; Drive no cambia | VIS-001:L79, L94 | Media | Permisos de compartición no confirmados | Por validar |
| US-010 | 8. Certificados de curso | E-CLS Classroom | Data | UNKNOWN: aprobar el curso final depende de calificaciones de Classroom, pero el criterio de aprobación no está definido | VIS-001:L82, L93; P-19 | Baja | Sin criterio, no se puede saber qué dato leer | Abierto |
| US-010 | 8. Certificados de curso | E-DOC docsuite | Integration | INDIRECT: consumo de su API REST para generar el PDF | VIS-001:L82, L96 (EVD-2026-0019) | Alta | Contrato de la API desconocido (KG-05) | Por validar |
| US-010 | 8. Certificados de curso | E-DOC docsuite | Data | POTENTIAL: puede requerir una plantilla de certificado de curso final en docsuite | VIS-001:L34 (diseña plantillas) | Baja | — | Investigar |
| US-011, US-012 | 7. Evidencia de GitLab con IA | E-GLB GitLab | Integration | INDIRECT: lectura de issues, MRs y milestones; GitLab no cambia | VIS-001:L81, L95 (EVD-2026-0013, 0014) | Alta | Volumen y permisos desconocidos (KG-05, KG-07) | Por validar |
| US-011, US-012 | 7. Evidencia de GitLab con IA | E-GLB GitLab | Data / Quality | POTENTIAL: convenciones mínimas de etiquetado por producto, que cambiarían cómo se usa GitLab | VIS-001:L146 (EVD-2026-0040) | Media | Mitigación "a definir"; sin dueño | Investigar |
| US-011, US-012 | 7. Evidencia de GitLab con IA | E-GLB GitLab | Security | UNKNOWN: credencial de acceso de lectura y posible salida de datos a un servicio de IA | VIS-001:L95, L165; EVD-2026-0050 | Baja | CF-01 (uso interno frente a IA externa) | Abierto |
| US-002 | 3. Requerimientos de proyecto | E-GLB GitLab | Data | UNKNOWN: GitLab podría ser la fuente de proyectos y Líderes | VIS-001:L111; US2-Q1 (EVD-2026-0028) | Baja | Posible integración no prevista | Abierto |
| US-004, US-006 | 2. Perfil; 4. Búsqueda | E-RRH Sistema de RR. HH. | Data | UNKNOWN: posible fuente de la ficha del colaborador | VIS-001:L153 (EVD-2026-0047) | Baja | Datos maestros de personas sin origen | Abierto |
| Todas | Todas | E-IDP Proveedor de identidad | Security | UNKNOWN: se desconoce el proveedor de identidad y el origen de los roles | ADB-001 KG-03; RCP-001 RCP-Q1; BRC-001 P-09 | Baja | Autenticación y autorización sin base | Abierto |
| US-006, US-007 | 4. Búsqueda; asignación | E-PRC Proceso de asignación | Operations | POTENTIAL (proceso, no sistema): la asignación informal pasaría a basarse en requerimientos y niveles certificados. No es DIRECT porque E-PRC es un supuesto (A-04) y la asignación depende de P-05 | VIS-001:L35, L42, L58 | Baja | — | Investigar |
| US-001 | 1. Catálogo | E-CLS, E-DRV, E-GLB, E-DOC | — | NO_IMPACT: la tabla de integraciones (VIS-001:L91-L96) asigna a cada sistema una función que no incluye el catálogo, y el catálogo lo gobierna el Jefe de Ingeniería en la plataforma (L51, L75) | VIS-001:L51, L75, L91-L96 | Media | — | Por validar |
| US-003 | 6. Certificación (manual, H1) | E-GLB GitLab | Data | UNKNOWN: si el evaluador puede adjuntar a mano evidencia de GitLab en H1 | RCP-001 RCP-Q2 (EVD-2026-0030) | Baja | — | Abierto |
| US-005 | 4. Brechas | E-CLS, E-DRV, E-GLB, E-DOC | — | NO_IMPACT: la brecha se define sobre niveles requeridos y certificados (VIS-001:L59), y ninguno de esos sistemas los provee según L91-L96 | VIS-001:L59, L78, L91-L96 | Media | — | Por validar |
| US-005 | 4. Brechas | E-RRH Sistema de RR. HH. | Data | UNKNOWN: la brecha es por colaborador, y la fuente de los colaboradores está sin definir | VIS-001:L153 (EVD-2026-0047) | Baja | — | Abierto |
| US-008 | 4. Brechas por producto | Todos los elementos | — | UNKNOWN: el actor está sin definir (P-17), así que no se puede delimitar el impacto | VIS-001:L78; USC-001 US-008 | Baja | — | Abierto |
| US-013, US-014 | 9. Tablero | E-GLB GitLab | Data | UNKNOWN: la "demanda" y los KPI 1 y 6 dependen de los proyectos (activos), cuya fuente podría ser GitLab (US2-Q1, P-11) | VIS-001:L83, L119, L124 | Baja | Depende también de datos con fecha desde H1 (asr-US-014) | Abierto |
| BR-INT-02 (contingencia) | 5. Rutas; 8. Certificados de curso | E-CLS Classroom | Application / Integration | POTENTIAL: sustitución parcial de Classroom por gestión propia de material y progreso | VIS-001:L89, L144 (EVD-2026-0021) | Media | Cambio de "integrar" a "hospedar" | Investigar |

## Dependency expansion

La expansión se limita a las dependencias que las fuentes nombran. No se agregaron dependencias sin evidencia.

| Origin | Dependency | Target | Why relevant | Evidence |
|---|---|---|---|---|
| E-NEW (rutas) | lee cursos | E-CLS | Base de US-009 | VIS-001:L79, L93 |
| E-NEW (certificados de curso) | podría leer calificaciones para saber si se aprobó el curso final | E-CLS | US-010; depende de P-19 | VIS-001:L82, L93 (UNKNOWN) |
| E-NEW (rutas) | enlaza y lee material | E-DRV | US-009 | VIS-001:L94 |
| E-NEW (certificados de curso) | genera el PDF y guarda la referencia | E-DOC | US-010 | VIS-001:L82, L96 |
| E-NEW (IA) | lee issues, MRs y milestones | E-GLB | US-011, US-012 | VIS-001:L81, L95 |
| E-CLS | material de los cursos | E-DRV | El material está en Drive y los cursos en Classroom; no se sabe si Classroom referencia a Drive | VIS-001:L32 (relación no documentada: UNKNOWN) |

**Consumidores downstream:** no hay evidencia de sistemas que consuman datos de la plataforma. Los consumidores conocidos son personas: Dirección (tablero) y Colaborador (perfil). Si RR. HH. debe recibir resultados, es UNKNOWN.

## Risks and gaps

| ID | Risk/gap | Requirement | Severity | Evidence | Action |
|---|---|---|---|---|---|
| RG-01 | Sin arquitectura AS-IS ni estándares corporativos | Todas | Alta | ADB-001 KG-01 | Conseguir estándares, alojamiento y ADR existentes |
| RG-02 | Posible conflicto entre "uso interno" de GitLab y un servicio de IA externo | US-011, US-012 | Alta | CF-01; EVD-2026-0050 | Consultar la política de IA y seguridad |
| RG-03 | Identidad y datos maestros de personas sin origen | Todas | Alta | KG-03; VIS-001:L153 | Identificar el proveedor de identidad y el sistema de RR. HH. |
| RG-04 | Acceso a las API de Classroom, Drive, GitLab y docsuite sin confirmar | US-009 a US-012 | Media | KG-05 | Pruebas de acceso y documentación de las API |
| RG-05 | Criterio de aprobación del curso final sin definir | US-010 | Media | P-19, GQ-06 | Respuesta de Gestión de formación |
| RG-06 | Fuente de proyectos y Líderes sin definir | US-002 | Media | US2-Q1 | Respuesta del Responsable de producto |

## Potential ASR candidates

Candidates only. ARQ-102 owns formal ASR identification and validation.

| Candidate | Triggering requirement/NFR | Significance hypothesis | Evidence | Status |
|---|---|---|---|---|
| [asr-BR-IA-01](asr/asr-BR-IA-01.md) | BR-IA-01; US-011 | La confidencialidad de GitLab puede limitar dónde corre la IA | RG-02 | Pendiente (catálogo ASR) |
| [asr-BR-INT-02](asr/asr-BR-INT-02.md) | BR-INT-02 | La contingencia cambiaría el principio "integrar, no hospedar" | Fila BR-INT-02 | Pendiente (catálogo ASR) |
| [asr-BR-ACR-02](asr/asr-BR-ACR-02.md) | BR-ACR-02 | Identidad y roles sin origen condicionan la seguridad | RG-03 | Pendiente (catálogo ASR) |

Los demás candidatos del [catálogo ASR](asr/asr-catalog.md) no dependen de elementos existentes. Siguen vigentes, pero esta matriz no aporta evidencia nueva sobre ellos.

## Required investigations

1. Estándares corporativos, alojamiento y ADR existentes (RG-01).
2. Política de uso de servicios de IA con datos internos (RG-02).
3. Proveedor de identidad y sistema de RR. HH.: existencia, datos y acceso (RG-03).
4. Acceso real a las API de Classroom, Drive, GitLab y docsuite, y el contrato de docsuite (RG-04).
5. Si Classroom referencia material de Drive o son independientes.

## Human validation

El arquitecto debe:

- [ ] Rechazar los falsos positivos
- [ ] Agregar las omisiones (por ejemplo, otros sistemas corporativos)
- [ ] Validar las clasificaciones, en especial el POTENTIAL sobre el proceso E-PRC y los NO_IMPACT de US-001 y US-005

| Estado | Arquitecto | Fecha | Comentarios |
|---|---|---|---|
| Pendiente | Por asignar | — | |
