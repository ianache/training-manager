---
type: Business Glossary
title: "GLS-001 — Glosario de negocio"
description: "Catálogo indexado y ordenado alfabéticamente de los conceptos, términos y siglas de negocio de la Plataforma de Gestión de Formación. Cada término reside en su propio archivo OKF en terms/."
tags: [glossary, business, terms, acronyms, formacion, competencias]
status: draft
generated:
  by: "af-business-glossary-curator/1.1"
  at: "2026-09-26T23:20:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# GLS-001 — Glosario de negocio

> **Procedencia:** se analizaron [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) y [BRC-001](../rules/BRC-001-reglas-plataforma-gestion-formacion.md), ambos en `draft` y sin verificación humana (fuentes N2). Las siglas y los productos de terceros se contrastaron con fuentes externas N1 consultadas el 2026-09-26. En los sinónimos, `[VIS-001:Lnn]` y `[BRC-001:Lnn]` abrevian esas rutas. Ninguna definición está verificada hasta que la valide su responsable.

- **Alcance:** Plataforma de Gestión de Formación del Recurso Humano (COMSATEL).
- **Consumidor previsto:** `af-user-story-refiner`, `af-business-rule-extractor` y los responsables humanos (Jefe de Ingeniería, Responsable de producto).

## Cómo leer este glosario

- Cada término es un artefacto OKF v0.2 propio en `terms/TRM-NNNN-<slug>.md`, con su estado y su verificación. Este catálogo es solo el índice: se genera con `glossary.py build` y no se edita a mano entre los marcadores.
- El índice está en orden alfabético del español: sin distinguir mayúsculas ni tildes, con la Ñ después de la N y las cifras antes de la A.
- El índice incluye sinónimos y formas completas de siglas en cursiva (*Sinónimo* → Término).
- Niveles de fuente: **N1** primaria, **N2** secundaria confiable, **N3** terciaria (no respalda una definición por sí sola).
- `Clasificación: gap` significa que no hay una fuente N1 o N2 que respalde la definición.

## Índice

<!-- glossary:index:start -->
### A

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Acreditación* → [Certificación](terms/TRM-0001-acreditacion.md) | | | |
| [Adopción](terms/TRM-0002-adopcion.md) | concepto | KPI 6: porcentaje de colaboradores con perfil activo y porcentaje de proyectos con requerimientos registrados. | approved |
| [API REST](terms/TRM-0003-api-rest.md) | sigla | Interfaz por la que la plataforma pide a docsuite la generación del PDF de un certificado de curso. | approved |
| *Application programming interface + Representational State Transfer* → [API REST](terms/TRM-0003-api-rest.md) | | | |
| [Asignación](terms/TRM-0004-asignacion.md) | concepto | Designación de un colaborador preparado para cubrir un requerimiento de un proyecto (rol, competencias y nivel). | approved |

### B

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Brecha](terms/TRM-0005-brecha.md) | concepto | Diferencia entre el nivel requerido por un rol y el nivel certificado de un colaborador, por competencia. | approved |
| [Búsqueda de personal](terms/TRM-0006-busqueda-de-personal.md) | concepto | Capacidad que calcula el calce entre persona y rol, lista candidatos por requerimiento y muestra brechas individuales o por producto. | approved |

### C

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Catálogo de competencias](terms/TRM-0007-catalogo-de-competencias.md) | concepto | Registro único, común a todos los productos, de los roles, sus niveles de rol, las competencias que exige cada rol en cada nivel con su nivel requerido y las evidencias que demuestran cada nivel de competencia. Lo gobierna el Jefe de Ingeniería. | approved |
| *Catálogo de roles y competencias* → [Catálogo de competencias](terms/TRM-0007-catalogo-de-competencias.md) | | | |
| [Certificación](terms/TRM-0001-acreditacion.md) | concepto | Acto por el que un evaluador humano revisa las evidencias de un colaborador y le reconoce un nivel de dominio en una competencia; queda registrado quién certificó, cuándo y con qué evidencia. | approved |
| *Certificado* → [Certificado de curso](terms/TRM-0008-certificado.md) | | | |
| [Certificado de curso](terms/TRM-0008-certificado.md) | concepto | Documento PDF que certifica la aprobación del curso final según el cumplimiento de sus objetivos; lo genera docsuite y la plataforma guarda su referencia. No equivale a un nivel certificado. | approved |
| *C-Go* → [CLocator v2](terms/TRM-0011-clocator-v2.md) | | | |
| [Cierre de brechas](terms/TRM-0009-cierre-de-brechas.md) | concepto | KPI 3: reducción de la brecha promedio (nivel requerido − nivel certificado) por colaborador y por producto. | approved |
| *Classroom* → [Google Classroom](terms/TRM-0029-google-classroom.md) | | | |
| [CLocator](terms/TRM-0010-clocator.md) | término | Primera versión (v1) de uno de los cuatro productos cuyos proyectos atiende la plataforma. | approved |
| *CLocator (v1)* → [CLocator](terms/TRM-0010-clocator.md) | | | |
| [CLocator v2](terms/TRM-0011-clocator-v2.md) | término | Segunda versión de CLocator, uno de los cuatro productos cuyos proyectos atiende la plataforma. | approved |
| [Cobertura de roles](terms/TRM-0012-cobertura-de-roles.md) | concepto | KPI 1: porcentaje de roles requeridos por proyectos activos que se cubren con personal certificado al nivel exigido. | approved |
| [Colaborador](terms/TRM-0013-colaborador.md) | concepto | Persona de COMSATEL que participa en roles de los proyectos, tiene un perfil de competencias y recibe formación y certificación. | approved |
| [Competencia](terms/TRM-0014-competencia.md) | concepto | Elemento del catálogo que un rol exige a un nivel mínimo y que un colaborador certifica con evidencia. | approved |
| [Competencia transversal](terms/TRM-0067-competencia-transversal.md) | concepto | Competencia común a varios roles, como las competencias blandas (por ejemplo, el trabajo en equipo), que se asigna a cada rol que la exige. | draft |
| [COMSATEL](terms/TRM-0015-comsatel.md) | término | Organización que usa internamente la plataforma y cuyo Programa de Formación de Competencias la origina. | approved |
| [Contingencia](terms/TRM-0016-contingencia.md) | concepto | Opción, fuera del alcance actual, de dotar a la plataforma de gestión propia de material, visualización y progreso por lección y evaluación si la integración con Google Classroom presenta problemas. | approved |
| [Curso final](terms/TRM-0017-curso-final.md) | concepto | Curso cuya aprobación, según el cumplimiento de sus objetivos, da derecho a un certificado de curso. | approved |

### D

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Dirección](terms/TRM-0018-direccion.md) | concepto | Actor que ve la capacidad frente a la demanda y los riesgos de cobertura por producto. | approved |
| [docsuite](terms/TRM-0019-docsuite.md) | término | Plataforma que diseña plantillas de certificado de curso, genera PDF por API REST y los guarda en un repositorio propio; la plataforma le pide el PDF del certificado de curso. | approved |
| *Drive* → [Google Drive](terms/TRM-0030-google-drive.md) | | | |

### E

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Escala de niveles de dominio](terms/TRM-0020-escala-de-niveles-de-dominio.md) | concepto | Escala de cuatro niveles (L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto / Referente) en la que se expresan los niveles requeridos y certificados. | approved |
| *Escala L1–L4* → [Escala de niveles de dominio](terms/TRM-0020-escala-de-niveles-de-dominio.md) | | | |
| [Evaluador](terms/TRM-0021-evaluador.md) | concepto | Actor que revisa evidencias, certifica el nivel y valida, ajusta o rechaza las propuestas de la IA. | approved |
| [Evidencia](terms/TRM-0022-evidencia.md) | concepto | Prueba que respalda un nivel certificado; puede ser de formación, de práctica evaluada o de desempeño en proyecto (GitLab). | approved |
| [Evidencia de GitLab asistida por IA](terms/TRM-0023-evidencia-de-gitlab-asistida-por-ia.md) | concepto | Capacidad en la que un agente analiza issues, MRs y milestones de GitLab, los asocia a las competencias del rol y propone un nivel con su justificación para que un humano lo apruebe, ajuste o rechace. | approved |
| [Evidencia real](terms/TRM-0024-evidencia-real.md) | concepto | KPI 5: porcentaje de certificaciones de L3 o superior respaldadas por evidencia de GitLab. | approved |
| [Evidencia sobre volumen](terms/TRM-0025-evidencia-sobre-volumen.md) | concepto | Principio de producto: la cantidad de issues cerrados no prueba dominio; pesan más la calidad y el contexto. | approved |

### F

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Firma humana](terms/TRM-0026-firma-humana.md) | concepto | Aprobación de una persona sin la cual ningún nivel se certifica, tampoco a partir de una propuesta de la IA. | approved |

### G

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Gerencia* → [Dirección](terms/TRM-0018-direccion.md) | | | |
| [Gestión de formación](terms/TRM-0027-gestion-de-formacion.md) | concepto | Actor que diseña programas, gestiona certificaciones y emite certificados de curso. | approved |
| [GitLab](terms/TRM-0028-gitlab.md) | término | Herramienta donde los colaboradores trabajan (issues, tareas, bugs, milestones, MRs); la plataforma la lee en solo lectura como evidencia de desempeño real. | approved |
| [Google Classroom](terms/TRM-0029-google-classroom.md) | término | Herramienta donde se dictan los cursos; la plataforma la integra en solo lectura para cursos, tareas y calificaciones. | approved |
| [Google Drive](terms/TRM-0030-google-drive.md) | término | Repositorio donde está el material de los cursos; la plataforma lo enlaza y lee. | approved |

### H

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Horizonte](terms/TRM-0031-horizonte.md) | concepto | Etapa de la estrategia de producto: H1 "El idioma común" (catálogo, requerimientos, perfil con certificación manual, brechas), H2 "Formación integrada" (rutas y certificados de curso) y H3 "Evidencia real con IA" (agente de GitLab y tablero). | approved |
| [Human-in-the-loop](terms/TRM-0032-human-in-the-loop.md) | término | Principio de producto: ninguna certificación ocurre sin firma humana; la IA propone y justifica, pero no decide. | approved |

### I

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [IA](terms/TRM-0033-ia.md) | sigla | Agente de análisis que propone niveles con su justificación a partir de la evidencia de GitLab; no certifica. | draft |
| *Instructor* → [Evaluador](terms/TRM-0021-evaluador.md) | | | |
| [Integrar, no hospedar](terms/TRM-0034-integrar-no-hospedar.md) | concepto | Principio de producto: la plataforma integra y orquesta las herramientas existentes y no reconstruye un LMS ni un repositorio documental. | approved |
| [Issue](terms/TRM-0035-issue.md) | término | Elemento de trabajo de GitLab que el agente analiza como evidencia de desempeño. | approved |

### J

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Jefe de Ingeniería](terms/TRM-0036-jefe-de-ingenieria.md) | concepto | Dueño del catálogo de roles y competencias de los cuatro productos y responsable de la capacitación de todo el equipo. | approved |
| [Jefe de proyecto](terms/TRM-0038-lider-de-proyecto.md) | concepto | Actor que declara los roles, competencias y niveles que requiere su proyecto y busca personal certificado. | approved |

### K

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Key performance indicator* → [KPI](terms/TRM-0037-kpi.md) | | | |
| [KPI](terms/TRM-0037-kpi.md) | sigla | Cada uno de los seis indicadores de éxito adoptados para la plataforma: cobertura de roles, tiempo de asignación, cierre de brechas, tiempo a competencia, evidencia real y adopción. | approved |

### L

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Learning Management System* → [LMS](terms/TRM-0039-lms.md) | | | |
| *Líder de proyecto* → [Jefe de proyecto](terms/TRM-0038-lider-de-proyecto.md) | | | |
| [LMS](terms/TRM-0039-lms.md) | sigla | Tipo de sistema que la plataforma no reconstruye, según el principio "Integrar, no hospedar". | approved |

### M

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Merge request* → [MR](terms/TRM-0041-mr.md) | | | |
| [Milestone](terms/TRM-0040-milestone.md) | término | Elemento de GitLab que el agente analiza como evidencia de desempeño. | approved |
| [MR](terms/TRM-0041-mr.md) | sigla | Solicitud de cambio de código en GitLab que el agente analiza como evidencia de desempeño. | approved |

### N

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Nivel acreditado* → [Nivel certificado](terms/TRM-0042-nivel-acreditado.md) | | | |
| [Nivel certificado](terms/TRM-0042-nivel-acreditado.md) | concepto | Nivel de la escala L1–L4 que un evaluador reconoce a un colaborador en una competencia, respaldado por evidencia. | approved |
| [Nivel de rol](terms/TRM-0066-nivel-de-rol.md) | concepto | Nivel, numerado del 1 al 4, en que se desempeña un rol (por ejemplo, Developer Junior Nivel 1). Cada Rol-Nivel establece sus competencias y el nivel L1–L4 esperado en cada una. | draft |
| *Nivel exigido* → [Nivel requerido](terms/TRM-0043-nivel-requerido.md) | | | |
| *Nivel mínimo* → [Nivel requerido](terms/TRM-0043-nivel-requerido.md) | | | |
| [Nivel requerido](terms/TRM-0043-nivel-requerido.md) | concepto | Nivel mínimo de la escala L1–L4 que un rol, en un nivel de rol, exige en cada una de sus competencias. | approved |
| *Niveles de dominio* → [Escala de niveles de dominio](terms/TRM-0020-escala-de-niveles-de-dominio.md) | | | |

### P

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [PDF](terms/TRM-0044-pdf.md) | sigla | Formato del certificado de curso que genera docsuite. | approved |
| [Perfil de competencias del colaborador](terms/TRM-0045-perfil-de-competencias-del-colaborador.md) | concepto | Registro del nivel certificado por competencia de un colaborador, con su historial y sus evidencias. | approved |
| *Plataforma de Gestión de Formación* → [Plataforma de Gestión de Formación del Recurso Humano](terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md) | | | |
| [Plataforma de Gestión de Formación del Recurso Humano](terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md) | término | Plataforma interna de COMSATEL que conecta los requerimientos de competencias de los proyectos con colaboradores formados y certificados por niveles de dominio. | approved |
| *PM* → [Jefe de proyecto](terms/TRM-0038-lider-de-proyecto.md) | | | |
| *Portable Document Format* → [PDF](terms/TRM-0044-pdf.md) | | | |
| [Producto](terms/TRM-0047-producto.md) | concepto | Cada una de las cuatro líneas en alcance (CLocator, CLocator v2, SIGO y SmartSuite) a las que pertenecen los proyectos. Los roles y las competencias no dependen del producto. | approved |
| [Programa de Formación de Competencias](terms/TRM-0048-programa-de-formacion-de-competencias.md) | término | Programa de COMSATEL que busca que los colaboradores participen de forma efectiva y eficaz en distintos roles de los proyectos de los cuatro productos. | approved |
| [Propuesta de nivel](terms/TRM-0049-propuesta-de-nivel.md) | concepto | Nivel que la IA sugiere para un colaborador, siempre con justificación, y que termina aprobado, ajustado o rechazado por un humano. | approved |
| [Proyecto](terms/TRM-0050-proyecto.md) | concepto | Iniciativa de un producto que declara requerimientos de rol, competencias y nivel. | approved |
| [Proyecto activo](terms/TRM-0051-proyecto-activo.md) | concepto | Proyecto que cuenta para el KPI 1 (cobertura de roles). Las fuentes no dicen cuándo un proyecto está activo. | draft |

### R

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Recursos humanos* → [RR. HH.](terms/TRM-0056-rr-hh.md) | | | |
| [Requerimiento de proyecto](terms/TRM-0052-requerimiento-de-proyecto.md) | concepto | Declaración del PM de un rol que necesita su proyecto y de las competencias de ese rol que pide, todas o algunas. Los niveles requeridos se toman del catálogo. | approved |
| [Requisito de evidencia](terms/TRM-0068-requisito-de-evidencia.md) | concepto | Lo que un colaborador debe cumplir para certificar un determinado nivel de una competencia en el rol que tiene asignado: una o varias evidencias concretas (un curso, una práctica o un entregable), cada una de una de las tres categorías, y todas obligatorias. | draft |
| [Responsable de producto](terms/TRM-0053-responsable-de-producto.md) | concepto | Actor que aporta el conocimiento de los roles y competencias de su producto. | draft |
| *Responsable del producto* → [Responsable de producto](terms/TRM-0053-responsable-de-producto.md) | | | |
| [Riesgo de cobertura](terms/TRM-0054-riesgo-de-cobertura.md) | concepto | Riesgo, por producto, que Dirección ve en el tablero de capacidad. Las fuentes no lo definen ni dicen cómo se mide. | draft |
| [Rol](terms/TRM-0055-rol.md) | concepto | Función que un colaborador desempeña en los proyectos de cualquier producto (por ejemplo, Developer o Analista de Calidad). Tiene niveles de rol, normalmente varios Junior y varios Senior, y para cada nivel un conjunto de competencias con su nivel requerido. | approved |
| *Rol-Nivel* → [Nivel de rol](terms/TRM-0066-nivel-de-rol.md) | | | |
| [RR. HH.](terms/TRM-0056-rr-hh.md) | abreviatura | Área o función de recursos humanos; en las fuentes acompaña a Gestión de formación y nombra el sistema de RR. HH. | approved |
| [Rúbrica](terms/TRM-0069-rubrica.md) | concepto | Descripción asociada a una competencia que, para cada nivel de L1 a L4, define cómo se evidencia la competencia: lo que se espera que el colaborador evidencie para certificarlo en ese nivel. | draft |
| [Ruta de formación](terms/TRM-0057-ruta-de-formacion.md) | concepto | Secuencia de formación que se genera a partir de la brecha de un colaborador y se vincula con cursos de Classroom y material de Drive. | approved |

### S

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [SIGO](terms/TRM-0058-sigo.md) | sigla | Uno de los cuatro productos cuyos proyectos atiende la plataforma. | draft |
| [Sistema de RR. HH.](terms/TRM-0059-sistema-de-rr-hh.md) | término | Sistema de recursos humanos que podría integrarse como fuente de la ficha del colaborador. | draft |
| [SmartSuite](terms/TRM-0060-smartsuite.md) | término | Uno de los cuatro productos cuyos proyectos atiende la plataforma. | approved |

### T

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Tablero de capacidad](terms/TRM-0061-tablero-de-capacidad.md) | concepto | Vista de la capacidad frente a la demanda por producto, con riesgos de cobertura y KPI. | approved |
| [Tiempo a competencia](terms/TRM-0062-tiempo-a-competencia.md) | concepto | KPI 4: tiempo que tarda un colaborador en pasar de un nivel al siguiente. | approved |
| [Tiempo de asignación](terms/TRM-0063-tiempo-de-asignacion.md) | concepto | KPI 2: días entre que un proyecto pide un perfil y se asigna a alguien preparado. | approved |
| [Transparencia para el colaborador](terms/TRM-0064-transparencia-para-el-colaborador.md) | concepto | Principio de producto: cada persona ve su perfil, sus evidencias y las propuestas de la IA sobre ella. | approved |
| [Trazabilidad](terms/TRM-0065-trazabilidad.md) | concepto | Principio de producto: cada nivel certificado se puede rastrear hasta sus evidencias y hasta quien lo certificó. | approved |
<!-- glossary:index:end -->

## Preguntas abiertas

| ID | Término | Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|---|---|
| GQ-01 | [IA](terms/TRM-0033-ia.md) | ¿Cuál es la forma completa de la sigla IA en el negocio? Ninguna fuente analizada la expande. | Responsable de producto | Baja | Abierta |
| GQ-02 | [SIGO](terms/TRM-0058-sigo.md) | ¿Qué significa la sigla SIGO y qué hace el producto? | Responsable de producto | Media | Abierta |
| GQ-03 | [Jefe de proyecto](terms/TRM-0038-lider-de-proyecto.md) | ¿Qué significa PM y es exactamente el mismo actor que Jefe de proyecto? | Responsable de producto | Baja | Abierta |
| GQ-04 | [Proyecto activo](terms/TRM-0051-proyecto-activo.md) | ¿Qué estados tiene un proyecto y cuándo es activo? (BRC-001 P-11) | Responsable de producto | Alta | Abierta |
| GQ-05 | [Riesgo de cobertura](terms/TRM-0054-riesgo-de-cobertura.md) | ¿Qué es un riesgo de cobertura y cómo se mide? | Responsable de producto | Media | Abierta |
| GQ-06 | [Curso final](terms/TRM-0017-curso-final.md) | ¿De qué es "final" el curso final: de un programa, de una ruta o de cada curso? | Gestión de formación | Alta | Abierta |
| GQ-07 | [Evaluador](terms/TRM-0021-evaluador.md) | ¿Instructor y evaluador son el mismo rol o dos roles distintos? | Jefe de Ingeniería | Media | Abierta |
| GQ-08 | [Perfil de competencias del colaborador](terms/TRM-0045-perfil-de-competencias-del-colaborador.md) | ¿Qué es un "perfil activo"? ¿Se usa otro término para el "perfil" que pide un proyecto (VIS-001:L120)? | Responsable de producto | Media | Abierta |
| GQ-09 | [Gestión de formación](terms/TRM-0027-gestion-de-formacion.md) | ¿Qué parte de la certificación gestiona Gestión de formación / RR. HH. y qué parte el evaluador? (AMB-03, P-09) | Responsable de producto | Media | Abierta |
| GQ-10 | [docsuite](terms/TRM-0019-docsuite.md) | ¿docsuite es un sistema interno o de terceros? ¿Dónde está su documentación oficial? | Responsable de producto | Baja | Abierta |
| GQ-11 | [Escala de niveles de dominio](terms/TRM-0020-escala-de-niveles-de-dominio.md) | ¿Qué significa y qué evidencia exige cada nivel L1–L4? (P-01) | Jefe de Ingeniería | Alta | Parcialmente respondida — BRC-001 BR-ACR-07 (N2, sin verificar): la evidencia se define por competencia y nivel. Sigue abierto qué significa cada nivel y el detalle del tipo (P-22) |
| GQ-12 | [Human-in-the-loop](terms/TRM-0032-human-in-the-loop.md) | ¿Hay una fuente N1 de referencia para Human-in-the-loop o basta la definición de negocio? | Jefe de Ingeniería | Baja | Abierta |
| GQ-13 | [Brecha](terms/TRM-0005-brecha.md) | ¿Cómo se trata la brecha sin nivel certificado y la brecha negativa? (P-12) | Jefe de Ingeniería | Media | Abierta |
| GQ-14 | [CLocator v2](terms/TRM-0011-clocator-v2.md) | ¿C-Go es el nombre oficial de CLocator v2? ¿Qué hacen CLocator, C-Go y SmartSuite? | Responsable de producto | Media | Abierta |
| GQ-15 | [Evidencia](terms/TRM-0022-evidencia.md) | ¿Qué es una "práctica evaluada" y en qué se distingue de la formación? | Jefe de Ingeniería | Media | Abierta |
| GQ-17 | [KPI](terms/TRM-0037-kpi.md) | ¿Se confirma la Introducción de ISO 22400-2 en una fuente de ISO (iso.org) en lugar de la vista previa del distribuidor? | Responsable de producto | Baja | Abierta |
| GQ-16 | [LMS](terms/TRM-0039-lms.md) | ¿Se acepta el glosario de 1EdTech como referencia o hay que conseguir ISO/IEC 2382-36? | Responsable de producto | Baja | Abierta |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Términos con `gap`:** Proyecto activo, Riesgo de cobertura
- **Aprobación:** 59 de 69 términos aprobados (`status: approved`) por ianache (Jefe de Ingeniería) el 2026-09-26. Siguen en `draft` los 6 que no están del todo sustentados: [IA](terms/TRM-0033-ia.md), [Proyecto activo](terms/TRM-0051-proyecto-activo.md), [Responsable de producto](terms/TRM-0053-responsable-de-producto.md), [Riesgo de cobertura](terms/TRM-0054-riesgo-de-cobertura.md), [SIGO](terms/TRM-0058-sigo.md), [Sistema de RR. HH.](terms/TRM-0059-sistema-de-rr-hh.md). El 2026-09-26 se revisaron las definiciones de Catálogo de competencias, Nivel requerido, Producto, Requerimiento de proyecto y Rol, y ianache (Jefe de Ingeniería) las volvió a aprobar. Los términos nuevos [Nivel de rol](terms/TRM-0066-nivel-de-rol.md) y [Competencia transversal](terms/TRM-0067-competencia-transversal.md) están en `draft`, igual que [Requisito de evidencia](terms/TRM-0068-requisito-de-evidencia.md) y [Rúbrica](terms/TRM-0069-rubrica.md).
- **Motivo:** quedan 6 términos sin aprobar, y GQ-04, GQ-06 y GQ-11 (prioridad alta) siguen abiertas. Las fuentes internas VIS-001 y BRC-001 siguen en `draft`: la aprobación valida las definiciones del glosario, no esos documentos.
- **Siguiente rol o Skill:** `af-user-story-refiner`, usando este glosario como vocabulario común.
- **Decisión humana requerida:** responder las preguntas abiertas de los 6 términos pendientes y aprobarlos. Los términos cuyo responsable es el Responsable de producto fueron aprobados por el Jefe de Ingeniería; el Responsable de producto puede revisarlos.

## Lista de calidad

- [x] Cada definición tiene al menos una fuente N1 o N2 con localizador (salvo las `gap`)
- [x] Sinónimos y formas completas respaldados por una fuente
- [x] Sin conocimiento propio del modelo como fuente
- [x] `glossary.py check` sin errores
- [x] Validación humana registrada (59 de 69 términos)
