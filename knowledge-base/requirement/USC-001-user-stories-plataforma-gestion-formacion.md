---
type: User Story Catalog
title: "USC-001 — User Stories de la Plataforma de Gestión de Formación"
description: "User Stories identificadas a partir de la visión VIS-001, el catálogo de reglas BRC-001 y el glosario GLS-001, con criterios Given/When/Then, casos negativos, vacíos y preparación por historia."
tags: [user-stories, requirements, formacion, competencias, certificacion]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T14:10:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# USC-001 — User Stories de la Plataforma de Gestión de Formación

> **Procedencia:** las historias se derivan de las capacidades de [VIS-001](../vision/VIS-001-plataforma-gestion-formacion.md) §5 y de sus horizontes (§9). Las reglas vienen de [BRC-001](../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) y el vocabulario, de [GLS-001](../business/glossary/GLS-001-glosario-de-negocio.md). VIS-001 y BRC-001 están en `draft`, y el glosario tiene 59 de 65 términos aprobados. Ninguna historia está verificada.

## Objetivo y alcance

- **Pregunta:** ¿qué User Stories se pueden sostener con la evidencia disponible, y cuáles están listas para diseño UX (UX-101: `ux-requirements-analyzer`, `user-flow-designer`)?
- **Consumidor previsto:** Jefe de Ingeniería y Responsable de producto (validación), y los Skills de UX-101 que derivan UXR y flujos (cadena `US → UXR → FLW`).
- **Incluye:** las 9 capacidades de VIS-001 §5 en los horizontes H1, H2 y H3.
- **Excluye:** diseño técnico, APIs e integración (salvo las restricciones funcionales de BRC-001), y todo lo que VIS-001 §7 declara fuera de alcance: hospedar cursos, verificación pública de certificados de curso, evaluación salarial o de RR. HH. y gestión de proyectos.

## Resultado

Se identificaron **14 User Stories**. Se derivan solo de capacidades y actores que VIS-001 nombra; no se agregaron actores ni capacidades.

| ID | Horizonte | Actor | Historia (resumen) | Preparación | Refinada |
|---|---|---|---|---|---|
| [US-001](#us-001) | H1 | Jefe de Ingeniería | Definir roles, competencias y niveles mínimos (catálogo común) | CONDITIONAL | [US-001](user-stories/US-001-definir-catalogo-de-competencias.md) |
| [US-002](#us-002) | H1 | Jefe de proyecto | Declarar los requerimientos de competencias de un proyecto | CONDITIONAL | [US-002](user-stories/US-002-declarar-requerimientos-de-proyecto.md) |
| [US-003](#us-003) | H1 | Evaluador | Certificar manualmente el nivel de un colaborador con evidencias | CONDITIONAL | [US-003](user-stories/US-003-acreditar-manualmente-un-nivel.md) |
| [US-004](#us-004) | H1 | Colaborador | Consultar mi perfil de competencias y mis evidencias | READY | [US-004](user-stories/US-004-consultar-mi-perfil-de-competencias.md) |
| [US-005](#us-005) | H1 | Colaborador | Ver mi brecha frente a un rol | CONDITIONAL | [US-005](user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md) |
| [US-006](#us-006) | H1 | Jefe de proyecto | Buscar candidatos para un requerimiento | CONDITIONAL | [US-006](user-stories/US-006-buscar-candidatos-para-un-requerimiento.md) |
| [US-007](#us-007) | H1 | Jefe de proyecto | Asignar un colaborador a un requerimiento | NOT READY | — |
| [US-008](#us-008) | H1 | Jefe de Ingeniería, Jefe de proyecto, usuario ADMIN | Ver brechas agregadas por producto | CONDITIONAL | — |
| [US-009](#us-009) | H2 | Colaborador | Recibir una ruta de formación a partir de mi brecha | NOT READY | — |
| [US-010](#us-010) | H2 | Gestión de formación / RR. HH. | Emitir el certificado de un curso final aprobado | CONDITIONAL | — |
| [US-011](#us-011) | H3 | Evaluador | Revisar una propuesta de nivel de la IA | CONDITIONAL | — |
| [US-012](#us-012) | H3 | Colaborador | Ver las propuestas de la IA sobre mí y su evidencia | READY | — |
| [US-013](#us-013) | H3 | Dirección / Gerencia | Ver la capacidad frente a la demanda por producto | NOT READY | — |
| [US-014](#us-014) | H3 | Dirección / Gerencia | Ver los KPI de la plataforma | NOT READY | — |

**Resumen:** 2 READY, 7 CONDITIONAL y 5 NOT READY. H1 tiene el núcleo más sólido. Las historias NOT READY dependen de preguntas abiertas que solo pueden responder los responsables.

**Actualización (2026-09-27):** se agregaron 11 historias de la feature de gestión de colaboradores ([SPEC-001](specs/SPEC-001-gestion-de-colaboradores.md), capacidades C1 a C11), US-015 a US-025, en la sección [Gestión de colaboradores](#gestion-de-colaboradores). Están refinadas con `af-user-story-refiner/2.0` y su contexto es [RCP-002](context-packs/RCP-002-gestion-de-colaboradores.md). Total del catálogo: 25 historias.

---

## H1 — El idioma común

<a id="us-001"></a>
### US-001 — Definir el catálogo de roles y competencias

> **Versión refinada:** [US-001](user-stories/US-001-definir-catalogo-de-competencias.md). Esta sección es el resumen de identificación.

**Como** [Jefe de Ingeniería](../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md), **quiero** definir los [roles](../business/glossary/terms/TRM-0055-rol.md), las [competencias](../business/glossary/terms/TRM-0014-competencia.md) de cada rol y el [nivel requerido](../business/glossary/terms/TRM-0043-nivel-requerido.md) de cada una, comunes a todos los [productos](../business/glossary/terms/TRM-0047-producto.md), **para que** proyectos, formación y certificación midan contra un [catálogo](../business/glossary/terms/TRM-0007-catalogo-de-competencias.md) común.

- **Reglas:** BR-CAT-01, BR-CAT-02, BR-CAT-03, BR-CAT-04, BR-CAT-07, BR-CAT-08, BR-CAT-09, BR-CAT-16, BR-CAT-17, BR-CAT-18, BR-ACR-12.
- **Criterios de aceptación:**
  - **Dado** que soy el Jefe de Ingeniería, **cuando** registro un rol y defino sus niveles de rol (su cantidad y nombres son propios de cada rol, por ejemplo Developer Junior (Nivel 1) a (Nivel 3)) y, para cada nivel, sus competencias con un nivel de L1 a L4, **entonces** el rol queda en el catálogo común y puede pedirse en proyectos de cualquier producto (BR-CAT-08, BR-CAT-09).
  - **Dado** un rol en edición, **cuando** agrego una competencia sin nivel requerido, **entonces** el rol no se puede guardar hasta que tenga nivel (BR-CAT-03).
  - **Dado** un requisito de evidencia de una competencia y nivel, **cuando** el Jefe de Ingeniería lo define, **entonces** queda declarado como "requerida" o "deseada" (BR-CAT-16, BR-ACR-12); no hace falta definir todos los niveles a la vez (BR-CAT-17).
- **Casos negativos:**
  - Un nivel fuera de la [escala L1–L4](../business/glossary/terms/TRM-0020-escala-de-niveles-de-dominio.md) se rechaza (BR-CAT-02).
  - Un usuario que no es el Jefe de Ingeniería no puede modificar el catálogo ni los requisitos de evidencia (BR-CAT-04, BR-CAT-16). Queda abierto si el Responsable de producto puede proponer cambios (P-06).
- **Vacíos:** versionado del catálogo y efecto de un cambio sobre requerimientos y certificaciones vigentes (P-02); confirmar que rúbrica y requisito de evidencia son cosas distintas (inferencia de P-37, respondida el 2026-09-27: la rúbrica la define y aprueba el Jefe de Ingeniería, BR-CAT-19); qué pasa con un nivel sin requisitos definidos (P-39); si se registran criterios de nivel de rol (P-40). Escala salarial y MOF, fuera de alcance (BR-CAT-18).
- **Preparación:** CONDITIONAL. Crear un catálogo está sostenido, incluidos los niveles por rol y los requisitos requeridos o deseados (respuestas del 2026-09-27 a P-21, P-22, P-24, P-26 y P-36); editarlo depende de P-02, y P-39 sigue abierta.

<a id="us-002"></a>
### US-002 — Declarar los requerimientos de un proyecto

> **Versión refinada:** [US-002](user-stories/US-002-declarar-requerimientos-de-proyecto.md). Esta sección es el resumen de identificación.

**Como** [Jefe de proyecto](../business/glossary/terms/TRM-0038-lider-de-proyecto.md), **quiero** declarar los roles que necesita mi [proyecto](../business/glossary/terms/TRM-0050-proyecto.md), **para** encontrar personal certificado.

- **Reglas:** BR-REQ-01, BR-REQ-02, BR-REQ-06, BR-REQ-07, BR-REQ-10, BR-CAT-08.
- **Criterios de aceptación:**
  - **Dado** un proyecto de un producto, **cuando** el Jefe de proyecto registra un [requerimiento](../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) indicando un rol y su nivel de rol, **entonces** el requerimiento queda asociado al proyecto, incluye por defecto todas las competencias de ese Rol-Nivel y toma del catálogo sus niveles requeridos (BR-REQ-06, BR-REQ-07).
  - **Dado** ese requerimiento, **cuando** el Jefe de proyecto que lo registró retira competencias que no considera necesarias, **entonces** el requerimiento queda con las restantes (BR-REQ-07, BR-REQ-10; P-38 respondida el 2026-09-27).
- **Casos negativos:**
  - Cualquier rol del catálogo se puede pedir, sea cual sea el producto del proyecto (BR-CAT-08).
  - No se pueden agregar competencias ajenas al Rol-Nivel; solo retirar (BR-REQ-09, BR-REQ-10).
- **Vacíos:** qué es un [proyecto activo](../business/glossary/terms/TRM-0051-proyecto-activo.md) y qué estados tiene un proyecto (P-11; término en `draft`, `gap`).
- **Preparación:** CONDITIONAL, por P-11 y US2-Q1 (IM-Q6 y P-38 quedaron respondidas).

<a id="us-003"></a>
### US-003 — Certificar manualmente un nivel

> **Versión refinada:** [US-003](user-stories/US-003-acreditar-manualmente-un-nivel.md). Esta sección es el resumen de identificación.

**Como** [Evaluador](../business/glossary/terms/TRM-0021-evaluador.md), **quiero** revisar las [evidencias](../business/glossary/terms/TRM-0022-evidencia.md) de un colaborador y certificar su nivel en una competencia, **para que** su [nivel certificado](../business/glossary/terms/TRM-0042-nivel-acreditado.md) sea verificable.

- **Reglas:** BR-ACR-01, BR-ACR-02, BR-ACR-03, BR-ACR-04, BR-ACR-05.
- **Criterios de aceptación:**
  - **Dado** un colaborador con al menos una evidencia (formación, práctica evaluada o desempeño en proyecto) para una competencia, **cuando** el evaluador certifica un nivel L1–L4, **entonces** el nivel queda en el perfil del colaborador.
  - **Dada** una certificación registrada, **cuando** se consulta, **entonces** muestra quién certificó, cuándo y con qué evidencias (BR-ACR-03).
- **Casos negativos:**
  - Sin ninguna evidencia asociada, la certificación no se puede registrar (BR-ACR-01).
  - Nadie que no sea un evaluador humano puede certificar; no existe certificación automática (BR-ACR-02, BR-ACR-04).
  - Si falta la evidencia de algún requisito "requerida" de esa competencia y nivel, el nivel no se puede certificar; las evidencias "deseadas" son opcionales (BR-ACR-09, BR-ACR-12).
- **Vacíos:** si se aceptan evidencias equivalentes (P-23) y cómo refuerza una evidencia deseada (P-41); si se puede certificar un nivel sin requisitos definidos (P-39); qué parte hace Gestión de formación / RR. HH. y si un evaluador puede certificar a su propio equipo (P-09); si una certificación vence o se revoca (P-14). P-22 quedó respondida y confirmada (evidencia concreta, BR-ACR-08).
- **Preparación:** CONDITIONAL. El flujo y la exigencia de las evidencias requeridas (BR-ACR-07, BR-ACR-09, BR-ACR-12) están sostenidos; faltan RCP-Q1 y P-39.

<a id="us-004"></a>
### US-004 — Consultar mi perfil de competencias

> **Versión refinada:** [US-004](user-stories/US-004-consultar-mi-perfil-de-competencias.md). Esta sección es el resumen de identificación.

**Como** [Colaborador](../business/glossary/terms/TRM-0013-colaborador.md), **quiero** ver mis niveles certificados, su historial y las evidencias que los respaldan, **para** saber qué nivel tengo en cada competencia.

- **Reglas:** BR-TRA-01, BR-ACR-03.
- **Criterios de aceptación:**
  - **Dado** que soy un colaborador con certificaciones, **cuando** abro mi [perfil](../business/glossary/terms/TRM-0045-perfil-de-competencias-del-colaborador.md), **entonces** veo cada competencia con su nivel certificado, la fecha, quién lo certificó y sus evidencias.
  - **Dado** que no tengo certificaciones, **cuando** abro mi perfil, **entonces** veo que no tengo niveles certificados.
- **Casos negativos:** ninguno sostenido por las fuentes. Quién más puede ver este perfil está abierto (P-08) y no forma parte de esta historia.
- **Preparación:** READY.

<a id="us-005"></a>
### US-005 — Ver mi brecha frente a un rol

> **Versión refinada:** [US-005](user-stories/US-005-ver-mi-brecha-frente-a-un-rol.md). Esta sección es el resumen de identificación.

**Como** Colaborador, **quiero** ver la diferencia entre mis niveles certificados y los que exige un rol, **para** saber qué me falta (VIS-001:L41).

- **Reglas:** BR-BRE-01, BR-BRE-02 (inferencia), BR-BRE-04.
- **Criterios de aceptación:**
  - **Dado** un rol del catálogo y mi perfil, **cuando** consulto mi [brecha](../business/glossary/terms/TRM-0005-brecha.md) para ese rol, **entonces** veo, por competencia, el nivel requerido, mi nivel certificado y la diferencia.
- **Casos límite sin regla:** una competencia sin nivel certificado, y un nivel certificado mayor que el requerido (BR-BRE-03, P-12).
- **Negativo:** el colaborador no declara un rol al que aspira; su rol y nivel los asigna el Jefe de Ingeniería al registrarlo, y solo ve sus propias brechas (BR-BRE-04; P-15 respondida el 2026-09-27).
- **Vacíos:** contra qué Rol-Nivel ve su brecha: el asignado, el siguiente de su rol u otros roles (P-43, nueva en BRC-001).
- **Preparación:** CONDITIONAL, por P-12 y P-43.

<a id="us-006"></a>
### US-006 — Buscar candidatos para un requerimiento

> **Versión refinada:** [US-006](user-stories/US-006-buscar-candidatos-para-un-requerimiento.md). Esta sección es el resumen de identificación.

**Como** Jefe de proyecto, **quiero** ver los colaboradores que cumplen un requerimiento de mi proyecto, **para** encontrar personal preparado (VIS-001:L42, L78).

- **Reglas:** BR-BRE-01, BR-BRE-05; depende de US-001, US-002 y US-003.
- **Criterios de aceptación:**
  - **Dado** un requerimiento, **cuando** busco candidatos, **entonces** veo los colaboradores cuyo nivel certificado alcanza el nivel requerido y también los que no lo alcanzan, cada uno con su brecha (BR-BRE-05).
  - **Dado** el resultado, **cuando** no cambio el orden, **entonces** aparecen primero los de menor brecha (mayor cumplimiento); **cuando** invierto el orden, primero los de mayor brecha (BR-BRE-05).
- **Vacíos:**
  - Cómo se resume en un solo valor la brecha de un candidato para ordenar (P-44, nueva en BRC-001). P-16 quedó respondida el 2026-09-27 (BR-BRE-05).
  - Qué datos del perfil de otra persona puede ver el Jefe de proyecto (P-08).
- **Preparación:** CONDITIONAL, por P-08 y P-44.

<a id="us-007"></a>
### US-007 — Asignar un colaborador a un requerimiento

**Como** Jefe de proyecto, **quiero** asignar un candidato a un requerimiento de mi proyecto, **para** cubrir el rol.

- **Reglas:** ninguna. La [asignación](../business/glossary/terms/TRM-0004-asignacion.md) aparece en el modelo conceptual (VIS-001:L58), pero su decisión no está definida (BR-REQ-04).
- **Criterios de aceptación:** no se pueden escribir sin P-05: si la plataforma solo recomienda y el Jefe de proyecto decide, o si hay un flujo de aprobación.
- **Nota:** el actor es una inferencia. VIS-001 dice que el Jefe de proyecto "encuentra personal", no que asigna.
- **Preparación:** NOT READY, por P-05.

<a id="us-008"></a>
### US-008 — Ver brechas agregadas por producto

**Como** Jefe de Ingeniería, Jefe de proyecto o usuario con privilegios de ADMIN, **quiero** ver las brechas agregadas por producto, **para** priorizar la formación.

- **Evidencia:** VIS-001:L78 incluye "brechas individuales o por producto" en la capacidad 4. El actor quedó definido el 2026-09-27 (P-17): Jefe de Ingeniería, Jefe de proyecto y cualquier usuario con privilegios de ADMIN (BR-BRE-06, EVD-2026-0108).
- **Reglas:** BR-BRE-01, BR-BRE-06.
- **Criterios de aceptación:**
  - **Dado** que soy Jefe de Ingeniería, Jefe de proyecto o usuario ADMIN, **cuando** consulto las brechas agregadas de un producto, **entonces** las veo (BR-BRE-06).
- **Casos negativos:** un colaborador sin esos roles o privilegios no puede consultar brechas agregadas; solo ve las suyas (BR-BRE-04, BR-BRE-06).
- **Vacíos:** qué es un usuario ADMIN (P-45); cómo se agregan las brechas por producto (sin regla; los roles son comunes a todos los productos, BR-CAT-08, así que no está claro qué une una brecha a un producto: **inferencia**, vía los requerimientos de sus proyectos). Si el Jefe de proyecto ve todos los productos o solo los suyos, sin regla.
- **Preparación:** CONDITIONAL (antes NOT READY): el actor ya está definido; faltan P-45 y la regla de agregación por producto.

## H2 — Formación integrada

<a id="us-009"></a>
### US-009 — Recibir una ruta de formación

**Como** Colaborador, **quiero** una [ruta de formación](../business/glossary/terms/TRM-0057-ruta-de-formacion.md) generada a partir de mi brecha, con enlaces a los cursos de [Google Classroom](../business/glossary/terms/TRM-0029-google-classroom.md) y al material de [Google Drive](../business/glossary/terms/TRM-0030-google-drive.md), **para** saber qué ruta seguir (VIS-001:L41, L79).

- **Reglas:** BR-INT-01 (Classroom solo lectura; la plataforma no hospeda contenido), BR-FOR-01, BR-FOR-02.
- **Sostenido (2026-09-27, P-18 en parte):** un curso define, para cada rol al que se orienta, un nivel de rol mínimo y un nivel de rol objetivo, y quien lo diseña selecciona qué competencias del Rol-Nivel objetivo desarrolla (BR-FOR-01, BR-FOR-02, EVD-2026-0109).
- **Criterios de aceptación:** todavía no se pueden escribir. Siguen sin respuesta cómo se asocia un curso de Classroom a esa definición, cómo se genera la ruta a partir de la brecha y quién arma o aprueba las rutas; también quién diseña los cursos y cómo se relaciona el nivel de rol mínimo con L1–L4 (P-46).
- **Casos negativos sostenidos:** la plataforma no modifica cursos ni calificaciones en Classroom (BR-INT-01).
- **Vacíos:** asociación con Classroom, generación y aprobación de la ruta (resto de P-18, abierto); P-46.
- **Preparación:** NOT READY, por el resto de P-18 y P-46.

<a id="us-010"></a>
### US-010 — Emitir el certificado de un curso final

**Como** [Gestión de formación / RR. HH.](../business/glossary/terms/TRM-0027-gestion-de-formacion.md), **quiero** emitir el [certificado de curso](../business/glossary/terms/TRM-0008-certificado.md) de un colaborador que aprobó el [curso final](../business/glossary/terms/TRM-0017-curso-final.md), **para** dejar constancia del cumplimiento de sus objetivos.

- **Reglas:** BR-CER-01 a BR-CER-07.
- **Criterios de aceptación:**
  - **Dado** un colaborador en un curso, **cuando** se evidencia que cumple los requisitos requeridos del curso, **entonces** la plataforma propone automáticamente aprobar el curso (BR-CER-06).
  - **Dada** esa propuesta, **cuando** el evaluador emite la conclusión final igual a la propuesta, **entonces** el curso queda aprobado; **cuando** decide distinto, **entonces** debe registrar el sustento, que queda en la auditoría (BR-CER-07).
  - **Dado** un colaborador que aprobó el curso final, **cuando** Gestión de formación emite el certificado de curso, **entonces** el PDF se genera en [docsuite](../business/glossary/terms/TRM-0019-docsuite.md) y la plataforma guarda su referencia (BR-CER-03).
- **Casos negativos:**
  - La propuesta automática no aprueba el curso por sí sola (BR-CER-06).
  - Una conclusión distinta de la propuesta sin sustento no se registra (BR-CER-07).
  - Emitir un certificado de curso no cambia ningún nivel certificado (BR-CER-02).
  - No hay forma de verificar un certificado de curso fuera de la organización (BR-CER-04).
  - Sin aprobación del curso final no se emite certificado de curso (BR-CER-01).
- **Vacíos:**
  - De qué es "final" el curso final (GQ-06).
  - Si aprobar un curso aporta evidencia para algún nivel (P-07).
  - P-19 quedó respondida en parte el 2026-09-27 (BR-CER-06, BR-CER-07): siguen abiertos qué son los "requisitos requeridos" de un curso (actividades o calificaciones de Classroom, o requisitos de evidencia de las competencias) y de dónde sale su evidencia (P-47), y quién es el "evaluador" que concluye (P-48; ver AMB-03).
- **Preparación:** CONDITIONAL, por GQ-06, P-47 y P-48.

## H3 — Evidencia real con IA

<a id="us-011"></a>
### US-011 — Revisar una propuesta de nivel de la IA

**Como** Evaluador, **quiero** revisar la [propuesta de nivel](../business/glossary/terms/TRM-0049-propuesta-de-nivel.md) que la IA hizo a partir de GitLab, con su justificación, y aprobarla, ajustarla o rechazarla, **para** certificar con [evidencia de GitLab](../business/glossary/terms/TRM-0023-evidencia-de-gitlab-asistida-por-ia.md) sin ceder la decisión.

- **Reglas:** BR-IA-01, BR-IA-02, BR-IA-03, BR-IA-05, BR-ACR-02, BR-ACR-04.
- **Criterios de aceptación:**
  - **Dada** una propuesta con su justificación y las issues, MRs o milestones que la sustentan, **cuando** el evaluador la aprueba, **entonces** el nivel se certifica con su [firma](../business/glossary/terms/TRM-0026-firma-humana.md) y esas evidencias.
  - **Cuando** la ajusta, registrando el motivo, **entonces** se certifica el nivel que eligió el evaluador (BR-IA-05).
  - **Cuando** la rechaza, registrando el motivo, **entonces** no cambia ningún nivel (BR-IA-05).
  - Un ajuste o un rechazo sin motivo no se registra (BR-IA-05; P-20 respondida el 2026-09-27).
- **Casos negativos:**
  - Una propuesta sin revisión humana nunca certifica (BR-ACR-04).
  - Una propuesta sin justificación no se presenta para revisión (BR-IA-02).
  - La plataforma no escribe en GitLab (BR-IA-01).
- **Vacíos:** criterios de calidad y contexto de la propuesta (P-13; afecta al agente, no a esta revisión); si se puede certificar un nivel sin requisitos de evidencia definidos (P-39, heredada del flujo de certificación de US-003). P-20 quedó respondida (BR-IA-05).
- **Preparación:** CONDITIONAL, por P-39 (ya no por P-20).

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

**Como** [Dirección / Gerencia](../business/glossary/terms/TRM-0018-direccion.md), **quiero** ver la capacidad certificada frente a la demanda de los proyectos por producto, con sus [riesgos de cobertura](../business/glossary/terms/TRM-0054-riesgo-de-cobertura.md), **para** anticipar faltas de personal (VIS-001:L47, L83).

- **Criterios de aceptación:** no se pueden escribir. "Riesgo de cobertura" es un `gap` en el glosario (GQ-05), y "demanda" depende de qué es un proyecto activo (P-11).
- **Preparación:** NOT READY, por GQ-05 y P-11.

<a id="us-014"></a>
### US-014 — Ver los KPI de la plataforma

**Como** Dirección / Gerencia, **quiero** ver los seis [KPI](../business/glossary/terms/TRM-0037-kpi.md) (cobertura de roles, tiempo de asignación, cierre de brechas, tiempo a competencia, evidencia real y adopción), **para** medir el programa (VIS-001:L113-L124).

- **Criterios de aceptación:** las definiciones de los KPI están en VIS-001 §8, pero sin metas ni línea base (P-03) no se pueden escribir umbrales. El KPI "tiempo de asignación" depende de US-007 (P-05).
- **Nota:** que Dirección sea quien ve los KPI es una inferencia: VIS-001 los asocia al tablero de capacidad (L83).
- **Preparación:** NOT READY, por P-03 y P-05.

<a id="gestion-de-colaboradores"></a>
## Gestión de colaboradores (SPEC-001)

> **Procedencia:** una historia por capacidad C1 a C11 de [SPEC-001](specs/SPEC-001-gestion-de-colaboradores.md) §5, con las reglas BR-PTY-01 a BR-PTY-18 de [BRC-001](../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) y el contexto de [RCP-002](context-packs/RCP-002-gestion-de-colaboradores.md). Ninguna capacidad se dividió: C2, C9 y C11 tienen una propuesta de división en su sección 17, pendiente del PO. El horizonte no está asignado: la feature es prerrequisito de H1.

| ID | Horizonte | Actor | Historia (resumen) | Preparación | Refinada |
|---|---|---|---|---|---|
| US-015 | Por definir | Jefe de Ingeniería | Registrar un colaborador (C1), con su nivel inicial de rol (BR-PRF-02) | CONDITIONAL | [US-015](user-stories/US-015-registrar-un-colaborador.md) |
| US-016 | Por definir | Jefe de Ingeniería; Colaborador (acotado) | Actualizar datos y medios de contacto (C2) | READY | [US-016](user-stories/US-016-actualizar-datos-y-contactos.md) |
| US-017 | Por definir | Jefe de Ingeniería | Gestionar la estructura organizacional (C3) | READY | [US-017](user-stories/US-017-gestionar-estructura-organizacional.md) |
| US-018 | Por definir | Jefe de Ingeniería | Gestionar proveedores y contratistas (C4) | CONDITIONAL | [US-018](user-stories/US-018-gestionar-proveedores-y-contratistas.md) |
| US-019 | H1 | Jefe de Ingeniería | Asignar un Rol-Nivel a una persona (C5) | CONDITIONAL | [US-019](user-stories/US-019-asignar-rol-nivel.md) |
| US-020 | H1 | Jefe de Ingeniería | Asignar roles del programa: Evaluador y Jefe de Ingeniería (C6) | READY | [US-020](user-stories/US-020-asignar-roles-del-programa.md) |
| US-021 | Por definir | Jefe de Ingeniería | Dar de baja a un colaborador (C7) | CONDITIONAL | [US-021](user-stories/US-021-dar-de-baja-a-un-colaborador.md) |
| US-022 | Por definir | Jefe de Ingeniería | Vincular la identidad de acceso de Keycloak (C8) | READY | [US-022](user-stories/US-022-vincular-identidad-de-acceso.md) |
| US-023 | Por definir | Jefe de Ingeniería; Colaborador (la suya) | Consultar la ficha y su historial (C9) | CONDITIONAL | [US-023](user-stories/US-023-consultar-ficha-e-historial.md) |
| US-024 | Por definir | Jefe de Ingeniería | Anonimizar los datos personales de una persona dada de baja (C10) | CONDITIONAL | [US-024](user-stories/US-024-anonimizar-datos-personales.md) |
| US-025 | Por definir | Jefe de Ingeniería | Configurar el plazo de anonimización y recibir el aviso (C11) | CONDITIONAL | [US-025](user-stories/US-025-configurar-plazo-y-aviso.md) |

**Resumen:** 4 READY y 7 CONDITIONAL. Las preguntas que más historias bloquean son Q-01 y Q-02 (US-015, US-018), Q-05 / P-08 (US-023), RCP2-Q1 (US-024), RCP2-Q2 (US-021) y RCP2-Q3 (US-025); las preguntas `Q-nn` son de SPEC-001 §8 y las `RCP2-Qn`, de RCP-002 §7.

- **Orden de dependencia:** US-017 y US-018 → US-015 → US-016, US-019, US-020, US-021, US-022 y US-023; US-021 → US-024 y US-025; US-020 → US-025. US-001 → US-019.
- **Impacto en H1:** US-015 y US-022 dan origen a los colaboradores de US-003 a US-006; US-019 alimenta US-004 y US-005 (SPEC-001:L152); US-020 designa a los evaluadores de US-003 (RCP-Q1, en parte).

---

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| E-01 | Las 9 capacidades y los 7 actores del alcance. | VIS-001:L37-L51, L73-L83 | decision | high |
| E-02 | Orden de horizontes: H1 catálogo, requerimientos, perfil y brechas; H2 rutas y certificados de curso; H3 IA y tablero. | VIS-001:L128-L136 | decision | high |
| E-03 | Reglas BR-* usadas en los criterios de aceptación. | BRC-001 §Reglas | fact (N2) | medium |
| E-04 | El colaborador aspira a un rol, pero no se dice cómo lo declara. | VIS-001:L41 | gap | high |
| E-05 | Brechas "por producto" sin actor que las consulte. | VIS-001:L78 | gap | high |
| E-06 | El actor de la asignación y el de los KPI son inferencias. | VIS-001:L42, L58, L83 | inference | medium |
| E-07 | Vocabulario tomado del glosario; 59 términos aprobados, y Proyecto activo y Riesgo de cobertura siguen en `draft`. | GLS-001 | fact | high |

## Reglas, dependencias e impactos

- **Orden de dependencia:** US-001 → US-002 → US-006 → US-007. US-003 → US-004, US-005 y US-006. US-011 depende de US-003 (mismo flujo de certificación).
- **Impacto de P-01 (respondida en lo esencial, BR-ACR-07):** US-001 define el tipo de evidencia por competencia y nivel, y US-003 y US-011 lo exigen al certificar. El detalle quedó resuelto el 2026-09-27: evidencia concreta (P-22, confirmada), definida por el Jefe de Ingeniería (BR-CAT-16) de forma progresiva (BR-CAT-17), y declarada requerida o deseada; certificar exige las requeridas (BR-ACR-09, BR-ACR-12). Abiertas: P-23 (equivalencias), P-39 (nivel sin requisitos definidos) y P-41 (efecto de una evidencia deseada).
- **Impacto de P-05:** bloquea US-007 y el KPI "tiempo de asignación" (US-014).

## Vacíos y preguntas abiertas

Las preguntas P-01 a P-14 son las de [BRC-001](../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) y GQ-nn, las de [GLS-001](../business/glossary/GLS-001-glosario-de-negocio.md). Estas son las nuevas:

| ID | Pregunta | Historia | Responsable | Prioridad | Estado |
|---|---|---|---|---|---|
| P-15 | ¿Cómo declara el colaborador el rol al que aspira? ¿Puede ver brechas de cualquier rol? | US-005 | Responsable de producto | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no declara un rol al que aspira; el Jefe de Ingeniería le asigna rol y nivel al registrarlo y él ve sus propias brechas (BR-BRE-04). Derivada: P-43 |
| P-16 | ¿La búsqueda muestra también candidatos que no alcanzan el nivel, con su brecha? ¿Cómo se ordena? | US-006 | Responsable de producto | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí, con su brecha; por defecto de menor a mayor brecha, y el usuario puede invertir el orden (BR-BRE-05). Derivada: P-44 |
| P-17 | ¿Quién consulta las brechas agregadas por producto? | US-008 | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): Jefe de Ingeniería, Jefe de proyecto y cualquier usuario ADMIN (BR-BRE-06). Derivada: P-45 |
| P-18 | ¿Cómo se asocian competencias y niveles a cursos de Classroom, y quién arma o aprueba las rutas? | US-009 | Jefe de Ingeniería | Alta | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27): el curso define por rol un nivel de rol mínimo y uno objetivo, y quien lo diseña elige qué competencias desarrolla (BR-FOR-01, BR-FOR-02). Siguen abiertos la asociación con Classroom y quién arma o aprueba las rutas. Derivada: P-46 |
| P-19 | ¿Qué criterio determina que un curso está aprobado a partir de las calificaciones de Classroom? | US-010 | Gestión de formación | Alta | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27): cuando se cumplen los requisitos requeridos, la plataforma propone aprobar el curso y el evaluador concluye, con sustento si decide distinto (BR-CER-06, BR-CER-07). Derivadas abiertas: P-47 (qué son los requisitos requeridos y de dónde sale su evidencia) y P-48 (quién es el evaluador del curso) |
| P-20 | ¿Ajustar o rechazar una propuesta de la IA exige registrar un motivo? | US-011 | Jefe de Ingeniería | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí, exige registrar el motivo (BR-IA-05) |

**Preguntas previas que más historias bloquean:** P-05 (US-007, US-014), P-39 (US-001, US-003, US-011; reemplaza a P-22, respondida el 2026-09-27), P-11 (US-002, US-013) y P-08 (US-004, US-006).

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** US-004 y US-012 están listas. Otras 8 historias tienen flujo y reglas, pero les faltan respuestas para completar sus criterios (US-008 pasó de NOT READY a CONDITIONAL el 2026-09-27, al responderse P-17). Las 4 NOT READY dependen de P-03, P-05, P-11, P-18 (en parte), P-46 y GQ-05.
- **Siguiente rol o Skill:** `ux-requirements-analyzer` (UX-101) sobre las historias READY y CONDITIONAL de H1, para derivar UXR.
- **Decisión humana requerida:** el Jefe de Ingeniería y el Responsable de producto validan las 14 historias y responden P-05, lo que queda abierto de P-18, P-47 y las derivadas de alta prioridad P-43 y P-46, además de las abiertas de BRC-001 y GLS-001.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos, inferencias y vacíos (actores inferidos marcados en US-007, US-008 y US-014)
- [x] Contradicciones visibles (ninguna nueva; las de BRC-001 siguen vigentes)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
