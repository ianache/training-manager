---
type: User Story Catalog
title: "USC-001 — User Stories de la Plataforma de Gestión de Formación"
description: "User Stories identificadas a partir de la visión VIS-001, el catálogo de reglas BRC-001 y el glosario GLS-001, con criterios Given/When/Then, casos negativos, vacíos y preparación por historia."
tags: [user-stories, requirements, formacion, competencias, acreditacion]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-26T20:33:31-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
---

# USC-001 — User Stories de la Plataforma de Gestión de Formación

> **Procedencia:** las historias se derivan de las capacidades de [VIS-001](../vision/VIS-001-plataforma-gestion-formacion.md) §5 y de sus horizontes (§9). Las reglas vienen de [BRC-001](../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) y el vocabulario, de [GLS-001](../business/glossary/GLS-001-glosario-de-negocio.md). VIS-001 y BRC-001 están en `draft`, y el glosario tiene 59 de 65 términos aprobados. Ninguna historia está verificada.

## Objetivo y alcance

- **Pregunta:** ¿qué User Stories se pueden sostener con la evidencia disponible, y cuáles están listas para diseño UX (UX-101: `ux-requirements-analyzer`, `user-flow-designer`)?
- **Consumidor previsto:** Jefe de Ingeniería y Responsable de producto (validación), y los Skills de UX-101 que derivan UXR y flujos (cadena `US → UXR → FLW`).
- **Incluye:** las 9 capacidades de VIS-001 §5 en los horizontes H1, H2 y H3.
- **Excluye:** diseño técnico, APIs e integración (salvo las restricciones funcionales de BRC-001), y todo lo que VIS-001 §7 declara fuera de alcance: hospedar cursos, verificación pública de certificados, evaluación salarial o de RR. HH. y gestión de proyectos.

## Resultado

Se identificaron **14 User Stories**. Se derivan solo de capacidades y actores que VIS-001 nombra; no se agregaron actores ni capacidades.

| ID | Horizonte | Actor | Historia (resumen) | Preparación | Refinada |
|---|---|---|---|---|---|
| [US-001](#us-001) | H1 | Jefe de Ingeniería | Definir roles, competencias y niveles mínimos por producto | CONDITIONAL | [US-001](user-stories/US-001-definir-catalogo-de-competencias.md) |
| [US-002](#us-002) | H1 | Líder de proyecto | Declarar los requerimientos de competencias de un proyecto | CONDITIONAL | [US-002](user-stories/US-002-declarar-requerimientos-de-proyecto.md) |
| [US-003](#us-003) | H1 | Evaluador | Acreditar manualmente el nivel de un colaborador con evidencias | CONDITIONAL | [US-003](user-stories/US-003-acreditar-manualmente-un-nivel.md) |
| [US-004](#us-004) | H1 | Colaborador | Consultar mi perfil de competencias y mis evidencias | READY | [US-004](user-stories/US-004-consultar-mi-perfil-de-competencias.md) |
| [US-005](#us-005) | H1 | Colaborador | Ver mi brecha frente a un rol | CONDITIONAL | [US-005](user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md) |
| [US-006](#us-006) | H1 | Líder de proyecto | Buscar candidatos para un requerimiento | CONDITIONAL | [US-006](user-stories/US-006-buscar-candidatos-para-un-requerimiento.md) |
| [US-007](#us-007) | H1 | Líder de proyecto | Asignar un colaborador a un requerimiento | NOT READY | — |
| [US-008](#us-008) | H1 | Por confirmar | Ver brechas agregadas por producto | NOT READY | — |
| [US-009](#us-009) | H2 | Colaborador | Recibir una ruta de formación a partir de mi brecha | NOT READY | — |
| [US-010](#us-010) | H2 | Gestión de formación / RR. HH. | Emitir el certificado de un curso final aprobado | CONDITIONAL | — |
| [US-011](#us-011) | H3 | Evaluador | Revisar una propuesta de nivel de la IA | CONDITIONAL | — |
| [US-012](#us-012) | H3 | Colaborador | Ver las propuestas de la IA sobre mí y su evidencia | READY | — |
| [US-013](#us-013) | H3 | Dirección / Gerencia | Ver la capacidad frente a la demanda por producto | NOT READY | — |
| [US-014](#us-014) | H3 | Dirección / Gerencia | Ver los KPI de la plataforma | NOT READY | — |

**Resumen:** 2 READY, 7 CONDITIONAL y 5 NOT READY. H1 tiene el núcleo más sólido. Las historias NOT READY dependen de preguntas abiertas que solo pueden responder los responsables.

---

## H1 — El idioma común

<a id="us-001"></a>
### US-001 — Definir el catálogo de competencias por producto

> **Versión refinada:** [US-001](user-stories/US-001-definir-catalogo-de-competencias.md). Esta sección es el resumen de identificación.

**Como** [Jefe de Ingeniería](../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md), **quiero** definir para cada [producto](../business/glossary/terms/TRM-0047-producto.md) sus [roles](../business/glossary/terms/TRM-0055-rol.md), las [competencias](../business/glossary/terms/TRM-0014-competencia.md) de cada rol y el [nivel requerido](../business/glossary/terms/TRM-0043-nivel-requerido.md) de cada una, **para que** proyectos, formación y acreditación midan contra un [catálogo](../business/glossary/terms/TRM-0007-catalogo-de-competencias.md) común.

- **Reglas:** BR-CAT-01, BR-CAT-02, BR-CAT-03, BR-CAT-04.
- **Criterios de aceptación:**
  - **Dado** que soy el Jefe de Ingeniería, **cuando** registro un rol para un producto con sus competencias y un nivel de L1 a L4 para cada una, **entonces** el rol queda en el catálogo de ese producto.
  - **Dado** un rol en edición, **cuando** agrego una competencia sin nivel requerido, **entonces** el rol no se puede guardar hasta que tenga nivel (BR-CAT-03).
- **Casos negativos:**
  - Un nivel fuera de la [escala L1–L4](../business/glossary/terms/TRM-0020-escala-de-niveles-de-dominio.md) se rechaza (BR-CAT-02).
  - Un usuario que no es el Jefe de Ingeniería no puede modificar el catálogo (BR-CAT-04). Queda abierto si el Responsable de producto puede proponer cambios (P-06).
- **Vacíos:** versionado del catálogo y efecto de un cambio sobre requerimientos y acreditaciones vigentes (P-02).
- **Preparación:** CONDITIONAL. Crear un catálogo está sostenido; editarlo depende de P-02.

<a id="us-002"></a>
### US-002 — Declarar los requerimientos de un proyecto

> **Versión refinada:** [US-002](user-stories/US-002-declarar-requerimientos-de-proyecto.md). Esta sección es el resumen de identificación.

**Como** [Líder de proyecto](../business/glossary/terms/TRM-0038-lider-de-proyecto.md), **quiero** declarar los roles, las competencias y los niveles que necesita mi [proyecto](../business/glossary/terms/TRM-0050-proyecto.md), **para** encontrar personal acreditado.

- **Reglas:** BR-REQ-01, BR-REQ-02, BR-REQ-03 (inferencia), BR-CAT-02.
- **Criterios de aceptación:**
  - **Dado** un proyecto de un producto, **cuando** el Líder de proyecto registra un [requerimiento](../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) con rol, competencias y nivel, **entonces** el requerimiento queda asociado al proyecto.
- **Casos negativos:**
  - Un nivel fuera de L1–L4 se rechaza (BR-CAT-02).
  - Un rol o competencia que no está en el catálogo del producto del proyecto se rechaza. **Por confirmar:** esta regla es una inferencia (BR-REQ-03, P-10).
- **Vacíos:** qué es un [proyecto activo](../business/glossary/terms/TRM-0051-proyecto-activo.md) y qué estados tiene un proyecto (P-11; término en `draft`, `gap`).
- **Preparación:** CONDITIONAL, por P-10 y P-11.

<a id="us-003"></a>
### US-003 — Acreditar manualmente un nivel

> **Versión refinada:** [US-003](user-stories/US-003-acreditar-manualmente-un-nivel.md). Esta sección es el resumen de identificación.

**Como** [Evaluador](../business/glossary/terms/TRM-0021-evaluador.md), **quiero** revisar las [evidencias](../business/glossary/terms/TRM-0022-evidencia.md) de un colaborador y acreditar su nivel en una competencia, **para que** su [nivel acreditado](../business/glossary/terms/TRM-0042-nivel-acreditado.md) sea verificable.

- **Reglas:** BR-ACR-01, BR-ACR-02, BR-ACR-03, BR-ACR-04, BR-ACR-05.
- **Criterios de aceptación:**
  - **Dado** un colaborador con al menos una evidencia (formación, práctica evaluada o desempeño en proyecto) para una competencia, **cuando** el evaluador acredita un nivel L1–L4, **entonces** el nivel queda en el perfil del colaborador.
  - **Dada** una acreditación registrada, **cuando** se consulta, **entonces** muestra quién acreditó, cuándo y con qué evidencias (BR-ACR-03).
- **Casos negativos:**
  - Sin ninguna evidencia asociada, la acreditación no se puede registrar (BR-ACR-01).
  - Nadie que no sea un evaluador humano puede acreditar; no existe acreditación automática (BR-ACR-02, BR-ACR-04).
- **Vacíos:** evidencia mínima de cada nivel (P-01); qué parte hace Gestión de formación / RR. HH. y si un evaluador puede acreditar a su propio equipo (P-09); si una acreditación vence o se revoca (P-14).
- **Preparación:** CONDITIONAL. El flujo está sostenido; sin P-01, el sistema no puede validar si la evidencia alcanza para el nivel.

<a id="us-004"></a>
### US-004 — Consultar mi perfil de competencias

> **Versión refinada:** [US-004](user-stories/US-004-consultar-mi-perfil-de-competencias.md). Esta sección es el resumen de identificación.

**Como** [Colaborador](../business/glossary/terms/TRM-0013-colaborador.md), **quiero** ver mis niveles acreditados, su historial y las evidencias que los respaldan, **para** saber qué nivel tengo en cada competencia.

- **Reglas:** BR-TRA-01, BR-ACR-03.
- **Criterios de aceptación:**
  - **Dado** que soy un colaborador con acreditaciones, **cuando** abro mi [perfil](../business/glossary/terms/TRM-0045-perfil-de-competencias-del-colaborador.md), **entonces** veo cada competencia con su nivel acreditado, la fecha, quién lo acreditó y sus evidencias.
  - **Dado** que no tengo acreditaciones, **cuando** abro mi perfil, **entonces** veo que no tengo niveles acreditados.
- **Casos negativos:** ninguno sostenido por las fuentes. Quién más puede ver este perfil está abierto (P-08) y no forma parte de esta historia.
- **Preparación:** READY.

<a id="us-005"></a>
### US-005 — Ver mi brecha frente a un rol

> **Versión refinada:** [US-005](user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md). Esta sección es el resumen de identificación.

**Como** Colaborador, **quiero** ver la diferencia entre mis niveles acreditados y los que exige un rol, **para** saber qué me falta (VIS-001:L41).

- **Reglas:** BR-BRE-01, BR-BRE-02 (inferencia).
- **Criterios de aceptación:**
  - **Dado** un rol del catálogo y mi perfil, **cuando** consulto mi [brecha](../business/glossary/terms/TRM-0005-brecha.md) para ese rol, **entonces** veo, por competencia, el nivel requerido, mi nivel acreditado y la diferencia.
- **Casos límite sin regla:** una competencia sin nivel acreditado, y un nivel acreditado mayor que el requerido (BR-BRE-03, P-12).
- **Vacíos:** VIS-001:L41 habla del rol "al que aspira", pero ninguna fuente dice cómo el colaborador declara esa aspiración (P-15, nueva).
- **Preparación:** CONDITIONAL, por P-12 y P-15.

<a id="us-006"></a>
### US-006 — Buscar candidatos para un requerimiento

> **Versión refinada:** [US-006](user-stories/US-006-buscar-candidatos-para-un-requerimiento.md). Esta sección es el resumen de identificación.

**Como** Líder de proyecto, **quiero** ver los colaboradores que cumplen un requerimiento de mi proyecto, **para** encontrar personal preparado (VIS-001:L42, L78).

- **Reglas:** BR-BRE-01; depende de US-001, US-002 y US-003.
- **Criterios de aceptación:**
  - **Dado** un requerimiento, **cuando** busco candidatos, **entonces** veo los colaboradores cuyo nivel acreditado alcanza el nivel requerido en cada competencia.
- **Vacíos:**
  - Si la lista incluye candidatos que no alcanzan el nivel, con su brecha, y cómo se ordena (P-16, nueva).
  - Qué datos del perfil de otra persona puede ver el Líder de proyecto (P-08).
- **Preparación:** CONDITIONAL, por P-08 y P-16.

<a id="us-007"></a>
### US-007 — Asignar un colaborador a un requerimiento

**Como** Líder de proyecto, **quiero** asignar un candidato a un requerimiento de mi proyecto, **para** cubrir el rol.

- **Reglas:** ninguna. La [asignación](../business/glossary/terms/TRM-0004-asignacion.md) aparece en el modelo conceptual (VIS-001:L58), pero su decisión no está definida (BR-REQ-04).
- **Criterios de aceptación:** no se pueden escribir sin P-05: si la plataforma solo recomienda y el Líder de proyecto decide, o si hay un flujo de aprobación.
- **Nota:** el actor es una inferencia. VIS-001 dice que el Líder de proyecto "encuentra personal", no que asigna.
- **Preparación:** NOT READY, por P-05.

<a id="us-008"></a>
### US-008 — Ver brechas agregadas por producto

**Como** <actor por confirmar>, **quiero** ver las brechas agregadas por producto, **para** priorizar la formación.

- **Evidencia:** VIS-001:L78 incluye "brechas individuales o por producto" en la capacidad 4, pero no dice quién las consulta.
- **Candidatos a actor (sin confirmar):** el Jefe de Ingeniería, responsable de la capacitación (VIS-001:L43), o Dirección / Gerencia (VIS-001:L47).
- **Preparación:** NOT READY. Falta el actor (P-17, nueva).

## H2 — Formación integrada

<a id="us-009"></a>
### US-009 — Recibir una ruta de formación

**Como** Colaborador, **quiero** una [ruta de formación](../business/glossary/terms/TRM-0057-ruta-de-formacion.md) generada a partir de mi brecha, con enlaces a los cursos de [Google Classroom](../business/glossary/terms/TRM-0029-google-classroom.md) y al material de [Google Drive](../business/glossary/terms/TRM-0030-google-drive.md), **para** saber qué ruta seguir (VIS-001:L41, L79).

- **Reglas:** BR-INT-01 (Classroom solo lectura; la plataforma no hospeda contenido).
- **Criterios de aceptación:** no se pueden escribir. Ninguna fuente dice cómo se asocia una competencia o un nivel a un curso, ni quién arma o aprueba las rutas.
- **Casos negativos sostenidos:** la plataforma no modifica cursos ni calificaciones en Classroom (BR-INT-01).
- **Vacíos:** reglas de generación de la ruta y responsable de la asociación entre competencias y cursos (P-18, nueva).
- **Preparación:** NOT READY, por P-18.

<a id="us-010"></a>
### US-010 — Emitir el certificado de un curso final

**Como** [Gestión de formación / RR. HH.](../business/glossary/terms/TRM-0027-gestion-de-formacion.md), **quiero** emitir el [certificado](../business/glossary/terms/TRM-0008-certificado.md) de un colaborador que aprobó el [curso final](../business/glossary/terms/TRM-0017-curso-final.md), **para** dejar constancia del cumplimiento de sus objetivos.

- **Reglas:** BR-CER-01, BR-CER-02, BR-CER-03, BR-CER-04, BR-CER-05.
- **Criterios de aceptación:**
  - **Dado** un colaborador que aprobó el curso final, **cuando** Gestión de formación emite el certificado, **entonces** el PDF se genera en [docsuite](../business/glossary/terms/TRM-0019-docsuite.md) y la plataforma guarda su referencia (BR-CER-03).
- **Casos negativos:**
  - Emitir un certificado no cambia ningún nivel acreditado (BR-CER-02).
  - No hay forma de verificar un certificado fuera de la organización (BR-CER-04).
  - Sin aprobación del curso final no se emite certificado (BR-CER-01).
- **Vacíos:**
  - De qué es "final" el curso final (GQ-06).
  - Si aprobar un curso aporta evidencia para algún nivel (P-07).
  - Cómo se sabe que un curso se aprobó: las calificaciones vienen de Classroom en solo lectura, pero el criterio de aprobación no está definido (P-19, nueva).
- **Preparación:** CONDITIONAL, por GQ-06 y P-19.

## H3 — Evidencia real con IA

<a id="us-011"></a>
### US-011 — Revisar una propuesta de nivel de la IA

**Como** Evaluador, **quiero** revisar la [propuesta de nivel](../business/glossary/terms/TRM-0049-propuesta-de-nivel.md) que la IA hizo a partir de GitLab, con su justificación, y aprobarla, ajustarla o rechazarla, **para** acreditar con [evidencia de GitLab](../business/glossary/terms/TRM-0023-evidencia-de-gitlab-asistida-por-ia.md) sin ceder la decisión.

- **Reglas:** BR-IA-01, BR-IA-02, BR-IA-03, BR-ACR-02, BR-ACR-04.
- **Criterios de aceptación:**
  - **Dada** una propuesta con su justificación y las issues, MRs o milestones que la sustentan, **cuando** el evaluador la aprueba, **entonces** el nivel se acredita con su [firma](../business/glossary/terms/TRM-0026-firma-humana.md) y esas evidencias.
  - **Cuando** la ajusta, **entonces** se acredita el nivel que eligió el evaluador.
  - **Cuando** la rechaza, **entonces** no cambia ningún nivel.
- **Casos negativos:**
  - Una propuesta sin revisión humana nunca acredita (BR-ACR-04).
  - Una propuesta sin justificación no se presenta para revisión (BR-IA-02).
  - La plataforma no escribe en GitLab (BR-IA-01).
- **Vacíos:** criterios de calidad y contexto de la propuesta (P-13; afecta al agente, no a esta revisión); si un ajuste o un rechazo exige un motivo (P-20, nueva).
- **Preparación:** CONDITIONAL, por P-20.

<a id="us-012"></a>
### US-012 — Ver las propuestas de la IA sobre mí

**Como** Colaborador, **quiero** ver las propuestas de nivel que la IA hizo sobre mí y la evidencia de GitLab que usó, **para** saber qué se usa y cómo (VIS-001:L104, L143).

- **Reglas:** BR-IA-04, BR-IA-01.
- **Criterios de aceptación:**
  - **Dada** una propuesta sobre mí, **cuando** abro mi perfil, **entonces** veo la propuesta, su justificación, las evidencias usadas y su estado (pendiente, aprobada, ajustada o rechazada).
- **Casos negativos:** la evidencia de GitLab no sale del uso interno (BR-IA-01).
- **Preparación:** READY.

<a id="us-013"></a>
### US-013 — Ver la capacidad frente a la demanda por producto

**Como** [Dirección / Gerencia](../business/glossary/terms/TRM-0018-direccion.md), **quiero** ver la capacidad acreditada frente a la demanda de los proyectos por producto, con sus [riesgos de cobertura](../business/glossary/terms/TRM-0054-riesgo-de-cobertura.md), **para** anticipar faltas de personal (VIS-001:L47, L83).

- **Criterios de aceptación:** no se pueden escribir. "Riesgo de cobertura" es un `gap` en el glosario (GQ-05), y "demanda" depende de qué es un proyecto activo (P-11).
- **Preparación:** NOT READY, por GQ-05 y P-11.

<a id="us-014"></a>
### US-014 — Ver los KPI de la plataforma

**Como** Dirección / Gerencia, **quiero** ver los seis [KPI](../business/glossary/terms/TRM-0037-kpi.md) (cobertura de roles, tiempo de asignación, cierre de brechas, tiempo a competencia, evidencia real y adopción), **para** medir el programa (VIS-001:L113-L124).

- **Criterios de aceptación:** las definiciones de los KPI están en VIS-001 §8, pero sin metas ni línea base (P-03) no se pueden escribir umbrales. El KPI "tiempo de asignación" depende de US-007 (P-05).
- **Nota:** que Dirección sea quien ve los KPI es una inferencia: VIS-001 los asocia al tablero de capacidad (L83).
- **Preparación:** NOT READY, por P-03 y P-05.

---

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| E-01 | Las 9 capacidades y los 7 actores del alcance. | VIS-001:L37-L51, L73-L83 | decision | high |
| E-02 | Orden de horizontes: H1 catálogo, requerimientos, perfil y brechas; H2 rutas y certificados; H3 IA y tablero. | VIS-001:L128-L136 | decision | high |
| E-03 | Reglas BR-* usadas en los criterios de aceptación. | BRC-001 §Reglas | fact (N2) | medium |
| E-04 | El colaborador aspira a un rol, pero no se dice cómo lo declara. | VIS-001:L41 | gap | high |
| E-05 | Brechas "por producto" sin actor que las consulte. | VIS-001:L78 | gap | high |
| E-06 | El actor de la asignación y el de los KPI son inferencias. | VIS-001:L42, L58, L83 | inference | medium |
| E-07 | Vocabulario tomado del glosario; 59 términos aprobados, y Proyecto activo y Riesgo de cobertura siguen en `draft`. | GLS-001 | fact | high |

## Reglas, dependencias e impactos

- **Orden de dependencia:** US-001 → US-002 → US-006 → US-007. US-003 → US-004, US-005 y US-006. US-011 depende de US-003 (mismo flujo de acreditación).
- **Impacto de P-01:** afecta a US-003 y US-011, y a través de ellas a todo lo que usa niveles acreditados.
- **Impacto de P-05:** bloquea US-007 y el KPI "tiempo de asignación" (US-014).

## Vacíos y preguntas abiertas

Las preguntas P-01 a P-14 son las de [BRC-001](../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) y GQ-nn, las de [GLS-001](../business/glossary/GLS-001-glosario-de-negocio.md). Estas son las nuevas:

| ID | Pregunta | Historia | Responsable | Prioridad | Estado |
|---|---|---|---|---|---|
| P-15 | ¿Cómo declara el colaborador el rol al que aspira? ¿Puede ver brechas de cualquier rol? | US-005 | Responsable de producto | Media | Abierta |
| P-16 | ¿La búsqueda muestra también candidatos que no alcanzan el nivel, con su brecha? ¿Cómo se ordena? | US-006 | Responsable de producto | Media | Abierta |
| P-17 | ¿Quién consulta las brechas agregadas por producto? | US-008 | Jefe de Ingeniería | Media | Abierta |
| P-18 | ¿Cómo se asocian competencias y niveles a cursos de Classroom, y quién arma o aprueba las rutas? | US-009 | Jefe de Ingeniería | Alta | Abierta |
| P-19 | ¿Qué criterio determina que un curso está aprobado a partir de las calificaciones de Classroom? | US-010 | Gestión de formación | Alta | Abierta |
| P-20 | ¿Ajustar o rechazar una propuesta de la IA exige registrar un motivo? | US-011 | Jefe de Ingeniería | Baja | Abierta |

**Preguntas previas que más historias bloquean:** P-05 (US-007, US-014), P-01 (US-003, US-011), P-11 (US-002, US-013) y P-08 (US-004, US-006).

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** US-004 y US-012 están listas. Otras 7 historias tienen flujo y reglas, pero les faltan respuestas para completar sus criterios. Las 5 NOT READY dependen de P-03, P-05, P-11, P-17, P-18 y GQ-05.
- **Siguiente rol o Skill:** `ux-requirements-analyzer` (UX-101) sobre las historias READY y CONDITIONAL de H1, para derivar UXR.
- **Decisión humana requerida:** el Jefe de Ingeniería y el Responsable de producto validan las 14 historias y responden P-05, P-18 y P-19 (prioridad alta), además de las abiertas de BRC-001 y GLS-001.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos, inferencias y vacíos (actores inferidos marcados en US-007, US-008 y US-014)
- [x] Contradicciones visibles (ninguna nueva; las de BRC-001 siguen vigentes)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
