---
type: Architecture Context Pack
title: "ACP-001 — Architecture Context Pack de la Plataforma de Gestión de Formación"
description: "Contexto de arquitectura basado en evidencia antes del diseño de solución: plataforma nueva sobre sistemas existentes (Classroom, Drive, GitLab, docsuite), con impacto, incertidumbres, conflictos, candidatos ASR y quality gate."
tags: [architecture, context-pack, arq-101, as-is, greenfield]
status: draft
generated:
  by: "architecture-context-builder/1.0"
  at: "2026-09-26T21:53:16-05:00"
sources:
  - id: adb-001
    resource: /knowledge-base/architecture/ADB-001-descubrimiento-arquitectura-plataforma.md
  - id: aim-001
    resource: /knowledge-base/architecture/AIM-001-matriz-impacto-arquitectura.md
  - id: asr-catalog
    resource: /knowledge-base/architecture/asr/asr-catalog.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
---

# ACP-001 — Architecture Context Pack

## Metadata

- **Product:** [Plataforma de Gestión de Formación del Recurso Humano](../business/glossary/terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md).
- **Initiative:** la plataforma completa, H1 a H3.
- **Architect:** Por asignar.
- **Date:** 2026-09-26.
- **Version:** 0.1.
- **Status:** DRAFT. **No es READY_FOR_ARQ_102** (ver el quality gate).
- **Decisión de base:** la arquitectura actual no se pudo reconstruir porque no hay fuentes. Esto activa una condición de parada del skill. El usuario (ianache) decidió construir el pack tratando la plataforma como nueva y dejarlo marcado como no listo (2026-09-26).

## Executive context

La plataforma es interna y conecta lo que piden los proyectos de los 4 productos con lo que los colaboradores demuestran saber, mediante competencias certificadas con evidencia (VIS-001:L23-L25, L29).

No existe evidencia de un sistema previo. Lo que existe son cuatro sistemas con los que la plataforma debe integrarse, sin reemplazarlos: Google Classroom, Google Drive, GitLab y docsuite (VIS-001:L32-L34, L87). Hay además un posible sistema de RR. HH. (VIS-001:L153).

Las decisiones de producto ya tomadas imponen fuertes restricciones:
- integrar y no hospedar;
- Classroom y GitLab en solo lectura, Drive en enlace y lectura, y docsuite por API REST (genera el PDF y lo guarda);
- firma humana obligatoria en toda certificación;
- trazabilidad y transparencia.

Lo que falta para diseñar es el contexto corporativo: alojamiento, estándares, identidad, política de IA y normativa de datos (KG-01 a KG-04).

## Scope

Igual que en [ADB-001](ADB-001-descubrimiento-arquitectura-plataforma.md) §Scope:
- **Incluye:** H1 a H3, las 9 capacidades y las 4 integraciones.
- **Excluye:** hospedar cursos (salvo la contingencia), verificación pública, evaluación salarial y gestión de proyectos. También el diseño de la arquitectura objetivo, la aprobación de ASR y los ADR.

## Requirements

- **User Stories:** 14 en [USC-001](../requirement/USC-001-user-stories-plataforma-gestion-formacion.md). US-001 a US-006 están refinadas en `requirement/user-stories/`.
- **Reglas de negocio:** [BRC-001](../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) (26 reglas, 6 vacíos).
- **Contexto funcional de H1:** [RCP-001](../requirement/context-packs/RCP-001-h1-idioma-comun.md).
- **NFR explícitos:** C-01 a C-09 de ADB-001. No hay NFR cuantificados.

## Evidence sources

| ID | Fuente | Tipo | Estado | Acceso |
|---|---|---|---|---|
| S-01 | VIS-001 | Visión de producto (sesión con el responsable) | `draft` | Disponible |
| S-02 | BRC-001 | Reglas de negocio | `draft` | Disponible |
| S-03 | GLS-001 | Glosario | 59 de 65 términos `approved` | Disponible |
| S-04 | USC-001, US-001 a US-006 | User Stories | `draft` | Disponible |
| S-05 | RCP-001 | Requirement Context Pack de H1 | `draft`, "En validación" | Disponible |
| S-06 | ADB-001 | Architecture Discovery Brief | `draft` | Disponible |
| S-07 | AGENTS.md | Guía del repositorio del curso | — | Disponible |
| — | Estándares corporativos, ADR, documentación de las API, inventario de sistemas | — | — | **No disponibles** (KG-01, KG-05) |

**Etapa de investigación de evidencia:** se buscó en la base de conocimiento cualquier mención de tecnologías, alojamiento, identidad, estándares o ADR, y no hubo resultados (ADB-001 F-24). No hay repositorio de código de la plataforma. Las preguntas priorizadas de ADB-001 siguen sin respuesta.

## AS-IS architecture

La plataforma **no existe** en el estado actual (ASSUMPTION, ADB-001 F-09). El estado actual es:
- un ecosistema de sistemas independientes, sin integración entre ellos documentada para este fin;
- un proceso de asignación de personal informal, basado en el conocimiento de los líderes (ASSUMPTION, VIS-001:L35);
- la actividad de GitLab no alimenta la evaluación de competencias (FACT, VIS-001:L33).

## Application landscape

| Elemento | Responsabilidad conocida | Evidencia | Confianza |
|---|---|---|---|
| Google Classroom | Dictado de cursos, tareas y calificaciones | VIS-001:L32, L93 | Alta |
| Google Drive | Material de los cursos | VIS-001:L32, L94 | Alta |
| GitLab | Trabajo diario (issues, tareas, bugs, milestones, MRs) y gestión de proyectos | VIS-001:L33, L95, L111 | Alta |
| docsuite | Diseño de plantillas de certificado de curso, generación de PDF por API REST y repositorio de certificados de curso | VIS-001:L34, L96 | Alta |
| Sistema de RR. HH. | Solo se infiere que existe; su función ("ficha del colaborador") está por confirmar | VIS-001:L153 | Baja (INFERENCE) |
| Plataforma de Gestión de Formación | Nueva; su diseño está fuera de este pack | ADB-001 F-09 | ASSUMPTION |

No se conoce la versión, el alojamiento ni el dueño técnico de ningún sistema (UNKNOWN).

## Integration landscape

| Integración requerida | Dirección | Contrato | Evidencia | Estado |
|---|---|---|---|---|
| Plataforma → Classroom | Solo lectura | Desconocido | VIS-001:L93, L163 | UNKNOWN (acceso no confirmado) |
| Plataforma → Drive | Enlace y lectura | Desconocido | VIS-001:L94 | UNKNOWN |
| Plataforma → GitLab | Solo lectura; uso interno | Desconocido (instancia, versión, permisos) | VIS-001:L95, L165 | UNKNOWN |
| Plataforma → docsuite | API REST (generación de PDF) | "API REST", sin contrato | VIS-001:L34, L96 | FACT (existe), UNKNOWN (contrato) |
| Plataforma → RR. HH. | Por decidir | — | VIS-001:L153 | UNKNOWN |

Hoy no hay integraciones documentadas entre estos sistemas relevantes para la plataforma. Si Classroom referencia material de Drive, es UNKNOWN (AIM-001).

## Data landscape

- **Datos existentes, fuera de la plataforma:** cursos, tareas y calificaciones (Classroom); material (Drive); issues, MRs, milestones y proyectos (GitLab); plantillas y certificados de curso (docsuite); posiblemente la ficha del colaborador (RR. HH.).
- **Datos de negocio que la plataforma introduce:** productos, roles, competencias, niveles requeridos, tipo de evidencia exigido por competencia y nivel (BR-ACR-07), niveles certificados, evidencias, certificaciones con su registro, proyectos, requerimientos, brechas y asignaciones (VIS-001:L56-L59; RCP-001 §8). Es un modelo conceptual, **no** un modelo de datos.
- **Ownership:**
  - El catálogo lo gobierna el Jefe de Ingeniería (VIS-001:L51).
  - El dueño de los datos de las personas es UNKNOWN (KG-03).
  - Que el dueño de los datos de proyectos sea GitLab es UNKNOWN (US2-Q1).
- **Datos personales:** perfiles, evidencias y propuestas de IA son datos de desempeño de personas (asr-BR-TRA-01).

## Security landscape

- **Identidad y autenticación:** decidido en ADR-002 (2026-09-27): Keycloak, integrado en el BFF mediante PKCE. Siguen UNKNOWN el origen de los usuarios y sus roles (KG-03).
- **Autorización:** 7 actores (VIS-001:L37-L51) con permisos distintos según BRC-001 (BR-CAT-04, BR-ACR-02, BR-REQ-02). Que los permisos dependan también del ámbito (proyecto propio) es una INFERENCE a partir de "su proyecto" (L42; asr-BR-ACR-02). La visibilidad de datos ajenos está sin definir (P-08), igual que quiénes son los evaluadores (RCP-Q1) y si pueden certificar a su propio equipo (P-09).
- **Acceso a sistemas externos:** INFERENCE a partir de las integraciones requeridas: hará falta algún mecanismo de acceso autorizado a Classroom, Drive, GitLab y docsuite. Ninguno está documentado (UNKNOWN).
- **Límites de confianza:** la plataforma es interna (VIS-001:L29). Si los datos de GitLab pueden cruzar a un servicio de IA externo es UNKNOWN (CF-01).
- **Auditoría:** trazabilidad obligatoria de cada certificación (VIS-001:L80, L103).

## Architecture impact analysis

El detalle está en [AIM-001](AIM-001-matriz-impacto-arquitectura.md). Resumen:

- **INDIRECT:** Classroom, Drive, GitLab y docsuite. No cambian, pero hay que validar el acceso y los contratos para US-009 a US-012.
- **POTENTIAL:**
  - una plantilla de certificado de curso en docsuite;
  - convenciones de etiquetado en GitLab;
  - la sustitución parcial de Classroom si se activa la contingencia.
- **UNKNOWN:**
  - el criterio de aprobación a partir de Classroom (P-19);
  - GitLab como fuente de proyectos (US2-Q1);
  - el sistema de RR. HH. como fuente de personas;
  - la identidad;
  - la seguridad del acceso de la IA a GitLab.
- **Proveedor de identidad:** UNKNOWN para todas las historias.
- **POTENTIAL sobre el proceso de asignación**, que es organizativo y no un sistema. No es DIRECT porque el proceso actual es un supuesto (A-04) y la asignación depende de P-05.
- **NO_IMPACT externo:** catálogo (US-001) y brechas (US-005), con exclusión basada en la tabla de integraciones (VIS-001:L91-L96). US-005 conserva un UNKNOWN sobre el origen de los colaboradores.
- **UNKNOWN:** US-008 (actor sin definir) y el tablero (US-013, US-014), porque la demanda depende de la fuente de proyectos.
- **Consumidores downstream:** no se identificaron sistemas; solo personas.

## Constraints

Son las restricciones C-01 a C-10 de ADB-001:
- **C-01:** uso interno; sin verificación pública de certificados de curso.
- **C-02:** integrar y orquestar, no hospedar.
- **C-03:** Classroom solo lectura; Drive enlace y lectura.
- **C-04:** GitLab solo lectura; uso interno.
- **C-05:** docsuite por API REST; la plataforma guarda la referencia del certificado de curso.
- **C-06:** firma humana obligatoria.
- **C-07:** trazabilidad de cada nivel.
- **C-08:** transparencia para el colaborador.
- **C-09:** WCAG 2.2 AA (aplicabilidad al producto por confirmar).
- **C-10:** evidencia sobre volumen.

Los IDs `KG-nn` y `C-nn` de este pack son los de ADB-001. El catálogo ASR usa `ASR-KG-nn` y `ASR-C-nn`.

## Existing standards

No se encontraron estándares corporativos de arquitectura, desarrollo, seguridad ni datos (UNKNOWN, KG-01). WCAG 2.2 AA viene de la guía del repositorio del curso (AGENTS.md:L71), no de un estándar de COMSATEL confirmado.

## Existing ADR

Al construir el pack no existía ningún ADR (KG-01), y este pack no creó ninguno. El 2026-09-27 se registraron dos ADR por decisión de `human:ianache`:

- [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md): shell y microUIs en Angular, y BFF en Node.js intermediario con los microservicios.
- [ADR-002](/knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md): autenticación en el BFF con Keycloak y PKCE.

Responden en parte KG-01 (tecnologías) y KG-03 (proveedor de identidad). El AS-IS corporativo sigue sin reconstruir, y el pack sigue NOT READY_FOR_ARQ_102.

## Architecture debt

No aplica a la plataforma, porque no existe. No se conoce la deuda de los sistemas existentes.

## Risks

| ID | Riesgo | Evidencia |
|---|---|---|
| R-01 | Diseñar sin conocer estándares ni alojamiento obliga a rehacer decisiones | KG-01 |
| R-02 | Uso de IA incompatible con "uso interno" de GitLab | CF-01; RG-02 |
| R-03 | Identidad y datos de personas sin origen | KG-03; RG-03 |
| R-04 | APIs externas inaccesibles o limitadas (sobre todo Classroom, que ya tiene contingencia) | VIS-001:L144; KG-05 |
| R-05 | Percepción de vigilancia por el análisis de GitLab | VIS-001:L143 |
| R-06 | Sesgo de la IA | VIS-001:L145 |
| R-07 | Datos pobres en GitLab | VIS-001:L146 |
| R-08 | Catálogo sin consenso ni versionado | VIS-001:L142 |

## Assumptions

| ID | Supuesto | Origen | Qué lo confirmaría |
|---|---|---|---|
| A-01 | La plataforma es un sistema nuevo | Decisión del usuario; ADB-001 F-09 | Confirmación del arquitecto |
| A-02 | No existe catálogo común hoy | VIS-001:L35 | Evidencia documental |
| A-03 | Existe un sistema de RR. HH. | Inferido de VIS-001:L153 | Inventario de sistemas |
| A-04 | La asignación actual es informal | VIS-001:L35 | Confirmación del Responsable de producto |

## Unknowns

Son los KG-01 a KG-09 de ADB-001. Los críticos:
- **KG-01:** estándares y alojamiento.
- **KG-02:** política de IA.
- **KG-03:** identidad y RR. HH.
- **KG-04:** normativa de datos personales.

## Conflicting evidence

Son los CF-01 a CF-04 de ADB-001:
- **CF-01:** uso interno frente a una IA externa.
- **CF-02:** RR. HH. frente al evaluador en la certificación.
- **CF-03:** la formación como evidencia frente a que el certificado de curso no equivale a un nivel.
- **CF-04:** marcas de tiempo inconsistentes en la base de conocimiento.

## Potential ASR candidates

Candidates only. ARQ-102 owns formal ASR identification and validation.

Los 9 candidatos del [catálogo ASR](asr/asr-catalog.md) están **pendientes de revisión** cuando se valide ADB-001, porque el catálogo se generó antes del brief. Todos tienen disposición humana pendiente. La matriz AIM-001 aporta evidencia a tres: [asr-BR-IA-01](asr/asr-BR-IA-01.md), [asr-BR-INT-02](asr/asr-BR-INT-02.md) y [asr-BR-ACR-02](asr/asr-BR-ACR-02.md).

## Open questions

Son las 10 preguntas priorizadas de ADB-001, con P-14 (vencimiento y revocación de certificaciones) agregada a la 5. Las cuatro primeras bloquean ARQ-102:
1. ¿Dónde se aloja la plataforma y qué estándares y tecnologías son obligatorios?
2. ¿Pueden los datos de GitLab procesarse con un servicio de IA externo?
3. ¿Cuál es el proveedor de identidad y de dónde salen los colaboradores y sus roles?
4. ¿Qué normativa de datos personales aplica y quién ve qué?

## Provenance

| Claim/section | Evidence ID | Source | Confidence |
|---|---|---|---|
| Plataforma interna | EVD-2026-0043 | VIS-001:L29 | Alta |
| Integrar, no hospedar | EVD-2026-0044 | VIS-001:L87, L100 | Alta |
| Classroom y Drive: lectura | EVD-2026-0020 | VIS-001:L93-L94 | Alta |
| GitLab: lectura, uso interno | EVD-2026-0014 | VIS-001:L95, L165 | Alta |
| docsuite por API REST | EVD-2026-0019 | VIS-001:L34, L96 | Alta |
| Firma humana | EVD-2026-0012 | VIS-001:L81, L101 | Alta |
| Trazabilidad | EVD-2026-0011, 0037 | VIS-001:L80, L103 | Alta |
| Sistema de RR. HH. posible | EVD-2026-0047 | VIS-001:L153 | Baja |
| IA externa sin política | EVD-2026-0050 | Ausencia | Alta (del vacío) |
| Plataforma nueva | — | Decisión del usuario; ADB-001 F-09 | ASSUMPTION |
| Impactos | — | AIM-001 | Según cada fila |

## Architecture Critic summary

La revisión crítica la hizo un agente independiente, de solo lectura, sobre ACP-001, AIM-001 y ADB-001, contrastando con VIS-001, BRC-001 y USC-001. Revisó unas 35 citas y encontró 23 problemas: ninguno de severidad alta, 12 de severidad media y 11 de severidad baja. Todos se corrigieron en esta versión.

| Tipo | Hallazgos principales | Corrección aplicada |
|---|---|---|
| Citas que exceden su fuente | "Permisos por rol y ámbito" presentado como hecho; "integraciones de solo lectura" no se cumple con docsuite; Classroom → calificaciones atribuido a US-009; existencia del sistema de RR. HH. afirmada | Marcadas como INFERENCE o redactadas según la fuente |
| Clasificación de impacto | DIRECT sobre un proceso que es supuesto; NO_IMPACT del tablero en contradicción con GitLab como fuente de proyectos; NO_IMPACT por silencio de la fuente; RR. HH. confundido con la identidad | POTENTIAL; UNKNOWN; exclusión con evidencia; elemento E-IDP separado |
| Clasificación de evidencia | WCAG como FACT y restricción del producto; F-17 (riesgo) como hecho; "Google Workspace" sin fuente | ASSUMPTION; riesgo declarado; eliminado |
| Omisiones | US-008 sin fila; RCP-Q1, P-09 y P-14; principio "evidencia sobre volumen" | Agregados |
| Deslizamiento a diseño | "Dónde corre el componente de IA", "aislar la dependencia", "cuentas de servicio" | Reformulados como preguntas o necesidades |
| Inconsistencias | Colisión de IDs KG y C con el catálogo ASR; candidatos ASR "vigentes" sin revisión; handoff parcial ambiguo | Prefijo ASR-; "pendientes de revisión"; "insumo informativo" |

**Veredicto del crítico:** NOT READY está justificado (KG-01 a KG-04, CF-01, sin disposición humana). Las correcciones no cambian el veredicto.

## ARQ-101 quality gate

- [ ] Current state is understood. **No:** el estado corporativo (alojamiento, identidad, estándares) es desconocido.
- [x] Impact is traceable. Cada impacto de AIM-001 cita requisito, elemento y evidencia.
- [x] Sources/provenance are available.
- [x] Critical unknowns are visible.
- [x] Critic was executed.
- [x] No Solution Architecture was designed.
- [x] No ASR was formally approved.
- [x] No new ADR was created.

**Resultado:** NO READY_FOR_ARQ_102. Falta entender el estado actual, y ningún hallazgo crítico tiene disposición humana.

## Handoff to ARQ-102

**Todavía no hay handoff.** Para llegar a READY_FOR_ARQ_102:

1. Responder las preguntas 1 a 4 (KG-01 a KG-04).
2. Que el arquitecto valide ADB-001 y AIM-001 y dé disposición a los 9 candidatos ASR.
3. Resolver o aceptar explícitamente CF-01.
4. Reconstruir el AS-IS corporativo con esas respuestas y volver a ejecutar el quality gate.

Como **insumo informativo, que no habilita ARQ-102**, sirven las restricciones C-01 a C-10, el paisaje de integraciones y los candidatos ASR, que no son decisiones.
