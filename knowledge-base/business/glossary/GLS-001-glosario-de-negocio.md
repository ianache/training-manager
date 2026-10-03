---
type: Business Glossary
title: "GLS-001 — Glosario de negocio"
description: "Catálogo indexado y ordenado alfabéticamente de los conceptos, términos y siglas de negocio de la Plataforma de Gestión de Formación. Cada término reside en su propio archivo OKF en terms/."
tags: [glossary, business, terms, acronyms, formacion, competencias]
status: draft
generated:
  by: "af-business-glossary-curator/1.1"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
---

# GLS-001 — Glosario de negocio

> **Procedencia:** se analizaron [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) y [BRC-001](../rules/BRC-001-reglas-plataforma-gestion-formacion.md), ambos en `draft` y sin verificación humana (fuentes N2). El 2026-09-27 se analizaron además [SPEC-001](../../requirement/specs/SPEC-001-gestion-de-colaboradores.md) (decisiones D1 a D24 de ianache, Jefe de Ingeniería, 2026-09-27), las reglas BR-PTY-01 a BR-PTY-18 de BRC-001 y [ADR-002](../../architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md), todos en `draft` (N2). También el 2026-09-27 se analizaron las decisiones EVD-2026-0096 a EVD-2026-0105 de BRC-001 (ianache, Jefe de Ingeniería, en respuesta a P-21 a P-24, P-26, P-28, P-31, P-36 a P-38): reglas BR-CAT-09, BR-CAT-14, BR-CAT-15, BR-ACR-09, BR-REQ-07 y BR-PRG-01 revisadas, y BR-CAT-16 a BR-CAT-19, BR-ACR-12, BR-REQ-10, BR-PRF-02 y BR-PRG-02 (N2). También el 2026-09-27 se analizaron EVD-2026-0112 (decisión, respuesta a P-47: BR-CER-06 precisada, BR-FOR-03, BR-FOR-04) y EVD-2026-0113 (propuesta en consideración, hipótesis, respuesta parcial a P-48: BR-FOR-05), ambas de BRC-001 (N2), y EVD-2026-0114 a EVD-2026-0118 y EVD-2026-0125 (decisiones dadas en UXR-001: BR-ACR-13, BR-CAT-20, BR-CAT-21, BR-FOR-06 a BR-FOR-10, BR-PRF-03 y BR-TRA-02; N2), y EVD-2026-0126 a EVD-2026-0132 (decisiones en respuesta a P-05, US2-Q2, P-07, P-08, P-52, P-49 y P-50: BR-REQ-02, BR-REQ-04, BR-REQ-11, BR-REQ-12, BR-ACR-14, BR-CER-02, BR-FOR-04, BR-FOR-05 confirmada, BR-TRA-03 a BR-TRA-06, BR-IA-04, BR-PTY-20 precisada y BR-CAT-22; N2). Las siglas y los productos de terceros se contrastaron con fuentes externas N1 consultadas el 2026-09-26 y el 2026-09-27 (RENIEC, SUNAT y keycloak.org). En los sinónimos, `[VIS-001:Lnn]`, `[BRC-001:Lnn]` y `[SPEC-001:Lnn]` abrevian esas rutas. Ninguna definición está verificada hasta que la valide su responsable.

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
| [Alta](terms/TRM-0093-alta.md) | concepto | Registro de una nueva persona colaboradora: se crean la persona, su código de colaborador, su identificación, su correo laboral y su rol de Empleado o de Contratista con fecha desde. El vínculo con Keycloak puede quedar vacío. | draft |
| [Anonimización](terms/TRM-0096-anonimizacion.md) | concepto | Reemplazo irreversible, a demanda del Jefe de Ingeniería, de los datos personales de una persona dada de baja por valores anónimos en todas sus vigencias e historial. Se conservan sus roles, relaciones, asignaciones y certificaciones con sus fechas, su código de colaborador y las referencias de auditoría. | draft |
| [API REST](terms/TRM-0003-api-rest.md) | sigla | Interfaz por la que la plataforma pide a docsuite la generación del PDF de un certificado de curso. | approved |
| *Application programming interface + Representational State Transfer* → [API REST](terms/TRM-0003-api-rest.md) | | | |
| [Asignación](terms/TRM-0004-asignacion.md) | concepto | Designación de un colaborador preparado para cubrir un requerimiento de un proyecto (rol, competencias y nivel). | approved |
| [Asignación de Rol-Nivel](terms/TRM-0088-asignacion-de-rol-nivel.md) | concepto | Asignación, con vigencia, de un Rol-Nivel del catálogo a una persona. Una persona puede tener varios roles asignados, con un solo nivel vigente por rol; cambiar de nivel cierra la asignación anterior y abre otra. Al registrar a un colaborador se le asigna un nivel inicial del rol que se le asigna. | draft |
| [Aviso de anonimización](terms/TRM-0098-aviso-de-anonimizacion.md) | concepto | Aviso que la plataforma genera para una persona dada de baja al vencer el plazo de anonimización, y que envía por correo automático a todos los correos vigentes de las personas con rol vigente de Jefe de Ingeniería. Registra su fecha, sus destinatarios, si fue atendido y si el envío se hizo o falló. | draft |

### B

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Baja](terms/TRM-0094-baja.md) | concepto | Cierre de la vigencia del rol de Empleado o de Contratista de una persona, que deja de ser colaborador. La persona no se borra, porque sus certificaciones históricas la necesitan; desde el registro de la baja se cuenta el plazo de anonimización. | draft |
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
| [Código de colaborador](terms/TRM-0087-codigo-de-colaborador.md) | concepto | Código interno, único y obligatorio, que identifica a cada persona colaboradora. La plataforma lo genera automáticamente como un GUID. No se anonimiza, para que las certificaciones y la auditoría sigan mostrando quién actuó. | draft |
| [Colaborador](terms/TRM-0013-colaborador.md) | concepto | Persona de COMSATEL que participa en roles de los proyectos, tiene un perfil de competencias y recibe formación y certificación. | approved |
| [Competencia](terms/TRM-0014-competencia.md) | concepto | Elemento del catálogo que un rol exige a un nivel mínimo y que un colaborador certifica con evidencia. | approved |
| [Competencia transversal](terms/TRM-0067-competencia-transversal.md) | concepto | Competencia común a varios roles, como las competencias blandas (por ejemplo, el trabajo en equipo), que se asigna a cada rol que la exige. | draft |
| [COMSATEL](terms/TRM-0015-comsatel.md) | término | Organización que usa internamente la plataforma y cuyo Programa de Formación de Competencias la origina. | approved |
| [Contingencia](terms/TRM-0016-contingencia.md) | concepto | Opción, fuera del alcance actual, de dotar a la plataforma de gestión propia de material, visualización y progreso por lección y evaluación si la integración con Google Classroom presenta problemas. | approved |
| [Contratista](terms/TRM-0076-contratista.md) | concepto | Rol de la parte de una persona externa que tiene una relación de contratación vigente con un proveedor; su correo laboral es el de ese proveedor. Mientras este rol está vigente, la persona es un colaborador. | draft |
| [Correo laboral](terms/TRM-0085-correo-laboral.md) | concepto | Medio de contacto de tipo correo, obligatorio para todo colaborador: el de COMSATEL si es empleado y el de su proveedor si es contratista. Es único entre los colaboradores vigentes. | draft |
| [Curso final](terms/TRM-0017-curso-final.md) | concepto | Curso cuya aprobación, según el cumplimiento de sus objetivos, da derecho a un certificado de curso. | approved |

### D

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Datos personales](terms/TRM-0095-datos-personales.md) | concepto | Datos que identifican a una persona y que se anonimizan cuando se va: nombres, apellidos, nombre preferido, identificaciones, medios de contacto e identidad de acceso. No incluyen el código de colaborador ni las referencias de auditoría. | draft |
| [Dirección](terms/TRM-0018-direccion.md) | concepto | Actor que ve la capacidad frente a la demanda y los riesgos de cobertura por producto. | approved |
| [DNI](terms/TRM-0082-dni.md) | sigla | Tipo de identificación aceptado para las personas. | draft |
| [docsuite](terms/TRM-0019-docsuite.md) | término | Plataforma que diseña plantillas de certificado de curso, genera PDF por API REST y los guarda en un repositorio propio; la plataforma le pide el PDF del certificado de curso. | approved |
| *Documento Nacional de Identidad* → [DNI](terms/TRM-0082-dni.md) | | | |
| *Drive* → [Google Drive](terms/TRM-0030-google-drive.md) | | | |

### E

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Edición de curso](terms/TRM-0102-edicion-de-curso.md) | concepto | Cada ejecución de una versión de un curso, en la que se inscriben colaboradores; el colaborador inscrito termina el curso en esa edición, sin homologar versiones. | draft |
| *Ejecución de un curso* → [Edición de curso](terms/TRM-0102-edicion-de-curso.md) | | | |
| [Empleado](terms/TRM-0075-empleado.md) | concepto | Rol de la parte de una persona que tiene una relación de empleo con la organización interna (COMSATEL); su correo laboral es el de COMSATEL. Mientras este rol está vigente, la persona es un colaborador. | draft |
| [Escala de niveles de dominio](terms/TRM-0020-escala-de-niveles-de-dominio.md) | concepto | Escala de cuatro niveles (L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto / Referente) en la que se expresan los niveles requeridos y certificados. | approved |
| *Escala L1–L4* → [Escala de niveles de dominio](terms/TRM-0020-escala-de-niveles-de-dominio.md) | | | |
| [Evaluador](terms/TRM-0021-evaluador.md) | concepto | Actor que revisa evidencias, certifica el nivel y valida, ajusta o rechaza las propuestas de la IA. | approved |
| [Evidencia](terms/TRM-0022-evidencia.md) | concepto | Prueba que respalda un nivel certificado; puede ser de formación, de práctica evaluada o de desempeño en proyecto (GitLab). | approved |
| [Evidencia de GitLab asistida por IA](terms/TRM-0023-evidencia-de-gitlab-asistida-por-ia.md) | concepto | Capacidad en la que un agente analiza issues, MRs y milestones de GitLab, los asocia a las competencias del rol y propone un nivel con su justificación para que un humano lo apruebe, ajuste o rechace. | approved |
| [Evidencia deseada](terms/TRM-0100-evidencia-deseada.md) | término | Requisito de evidencia de una competencia y nivel que el colaborador puede o no presentar; no es necesario para certificar el nivel, pero si se presenta refuerza la certificación del nivel objetivo. | draft |
| [Evidencia real](terms/TRM-0024-evidencia-real.md) | concepto | KPI 5: porcentaje de certificaciones de L3 o superior respaldadas por evidencia de GitLab. | approved |
| [Evidencia requerida](terms/TRM-0099-evidencia-requerida.md) | término | Requisito de evidencia de una competencia y nivel que se debe satisfacer siempre: para certificar ese nivel el colaborador debe presentar todas las evidencias requeridas. | draft |
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
| [Identidad de acceso](terms/TRM-0089-identidad-de-acceso.md) | concepto | Identificador del usuario de Keycloak de una persona, que la vincula con su usuario; una persona tiene cero o uno. La plataforma no aprovisiona usuarios. | draft |
| [Identificación](terms/TRM-0081-identificacion.md) | concepto | Documento que identifica a una parte, con su tipo, número y país emisor: DNI, carné de extranjería o pasaporte para las personas, y RUC para las organizaciones. Una parte puede tener varias, y cada una es única por tipo, número y país. | draft |
| [Información maestra](terms/TRM-0091-informacion-maestra.md) | concepto | Datos de referencia de las personas colaboradoras y externas, de las organizaciones y de la estructura organizacional, con su historial por vigencias. La plataforma es su sistema de registro (altas, cambios y bajas se hacen en ella) y la mantiene el Jefe de Ingeniería. | draft |
| [Inscripción](terms/TRM-0103-inscripcion.md) | concepto | Registro de un colaborador en una edición de un curso. Solo las versiones de curso APPROVED admiten inscripciones nuevas, y el colaborador inscrito termina el curso en esa edición. | draft |
| *Instructor* → [Evaluador](terms/TRM-0021-evaluador.md) | | | |
| [Instructor (edición de curso)](terms/TRM-0105-instructor-edicion-de-curso.md) | concepto | Colaborador que el Jefe de Ingeniería o un usuario ADMIN asigna para ejecutar una edición de un curso y que evalúa el desempeño de los colaboradores inscritos en ella. | draft |
| [Integrar, no hospedar](terms/TRM-0034-integrar-no-hospedar.md) | concepto | Principio de producto: la plataforma integra y orquesta las herramientas existentes y no reconstruye un LMS ni un repositorio documental. | approved |
| [Issue](terms/TRM-0035-issue.md) | término | Elemento de trabajo de GitLab que el agente analiza como evidencia de desempeño. | approved |

### J

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Jefe de Ingeniería](terms/TRM-0036-jefe-de-ingenieria.md) | concepto | Dueño del catálogo de roles y competencias de los cuatro productos y responsable de la capacitación de todo el equipo. | approved |
| [Jefe de proyecto](terms/TRM-0038-lider-de-proyecto.md) | concepto | Actor que declara los roles, competencias y niveles que requiere su proyecto y busca personal certificado. | approved |
| [Jefe directo](terms/TRM-0080-jefe-directo.md) | concepto | Persona a la que otra persona reporta, registrada con una relación de reporte entre partes con vigencia. | draft |

### K

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Key performance indicator* → [KPI](terms/TRM-0037-kpi.md) | | | |
| [Keycloak](terms/TRM-0090-keycloak.md) | término | Sistema de gestión de identidad y acceso donde viven los usuarios de la plataforma; se gestiona aparte y la plataforma solo guarda el identificador del usuario de cada persona. | draft |
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
| *Manual de Operaciones y Funciones* → [MOF](terms/TRM-0101-mof.md) | | | |
| [Medio de contacto](terms/TRM-0084-medio-de-contacto.md) | concepto | Forma de contactar a una parte (correo, teléfono o URL) junto con su uso para esa parte (laboral o perfil profesional), con vigencia. Para un colaborador son el correo laboral, obligatorio, el teléfono laboral, opcional, y los perfiles profesionales en línea, opcionales y múltiples. | draft |
| *Merge request* → [MR](terms/TRM-0041-mr.md) | | | |
| [Milestone](terms/TRM-0040-milestone.md) | término | Elemento de GitLab que el agente analiza como evidencia de desempeño. | approved |
| [MOF](terms/TRM-0101-mof.md) | sigla | Documento de la organización que recoge las responsabilidades del colaborador según el nivel de su rol, niveles que a su vez se asocian con una escala salarial. Está fuera de alcance de la plataforma por ahora. | draft |
| [MR](terms/TRM-0041-mr.md) | sigla | Solicitud de cambio de código en GitLab que el agente analiza como evidencia de desempeño. | approved |

### N

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Nivel acreditado* → [Nivel certificado](terms/TRM-0042-nivel-acreditado.md) | | | |
| [Nivel certificado](terms/TRM-0042-nivel-acreditado.md) | concepto | Nivel de la escala L1–L4 que un evaluador reconoce a un colaborador en una competencia, respaldado por evidencia. | approved |
| [Nivel de rol](terms/TRM-0066-nivel-de-rol.md) | concepto | Nivel en que se desempeña un rol, definido al registrar ese rol; no hay una cantidad general de niveles y cada rol define los suyos (por ejemplo, Developer Junior (Nivel 1), (Nivel 2) y (Nivel 3)). Cada Rol-Nivel establece sus competencias y el nivel L1–L4 esperado en cada una. | draft |
| *Nivel exigido* → [Nivel requerido](terms/TRM-0043-nivel-requerido.md) | | | |
| *Nivel mínimo* → [Nivel requerido](terms/TRM-0043-nivel-requerido.md) | | | |
| [Nivel requerido](terms/TRM-0043-nivel-requerido.md) | concepto | Nivel mínimo de la escala L1–L4 que un rol, en un nivel de rol, exige en cada una de sus competencias. | approved |
| *Niveles de dominio* → [Escala de niveles de dominio](terms/TRM-0020-escala-de-niveles-de-dominio.md) | | | |

### O

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Organización](terms/TRM-0072-organizacion.md) | concepto | Parte que es COMSATEL, una de sus unidades internas o un proveedor; su tipo lo da su rol de la parte. Se registra con su nombre (la razón social si es empresa) y su RUC si aplica. | draft |
| [Organización interna](terms/TRM-0078-organizacion-interna.md) | concepto | Rol de la parte de la organización COMSATEL, con la que los empleados tienen una relación de empleo. | draft |

### P

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Parte](terms/TRM-0070-parte.md) | concepto | Supertipo que agrupa a toda persona u organización de la que la plataforma guarda información maestra; su participación se expresa con roles de la parte y relaciones entre partes, cada uno con vigencia. | draft |
| *Party* → [Parte](terms/TRM-0070-parte.md) | | | |
| *Party Relationship* → [Relación entre partes](terms/TRM-0074-relacion-entre-partes.md) | | | |
| *Party Role* → [Rol de la parte](terms/TRM-0073-rol-de-la-parte.md) | | | |
| [PDF](terms/TRM-0044-pdf.md) | sigla | Formato del certificado de curso que genera docsuite. | approved |
| [Perfil de competencias del colaborador](terms/TRM-0045-perfil-de-competencias-del-colaborador.md) | concepto | Registro del nivel certificado por competencia de un colaborador, con su historial y sus evidencias. | approved |
| *Perfil profesional* → [Perfil profesional en línea](terms/TRM-0086-perfil-profesional-en-linea.md) | | | |
| [Perfil profesional en línea](terms/TRM-0086-perfil-profesional-en-linea.md) | concepto | Medio de contacto de tipo URL que apunta al perfil de una persona en una plataforma de una lista ampliable (LinkedIn, GitHub u otra relevante para el personal técnico); es opcional y puede haber varios. No es evidencia de nivel. | draft |
| [Persona](terms/TRM-0071-persona.md) | concepto | Parte que es un individuo. Se registra con su código de colaborador, sus nombres, sus apellidos y, opcionalmente, un nombre preferido; no se borra y, tras su baja, sus datos personales pueden anonimizarse. | draft |
| *PII* → [Datos personales](terms/TRM-0095-datos-personales.md) | | | |
| *Plataforma de Gestión de Formación* → [Plataforma de Gestión de Formación del Recurso Humano](terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md) | | | |
| [Plataforma de Gestión de Formación del Recurso Humano](terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md) | término | Plataforma interna de COMSATEL que conecta los requerimientos de competencias de los proyectos con colaboradores formados y certificados por niveles de dominio. | approved |
| [Plazo de anonimización](terms/TRM-0097-plazo-de-anonimizacion.md) | concepto | Plazo configurable, contado desde el registro de la baja de una persona, tras el cual la plataforma avisa al Jefe de Ingeniería de que la persona puede anonimizarse. Lo configura el Jefe de Ingeniería y se guarda con su auditoría. | draft |
| *PM* → [Jefe de proyecto](terms/TRM-0038-lider-de-proyecto.md) | | | |
| *Portable Document Format* → [PDF](terms/TRM-0044-pdf.md) | | | |
| [Producto](terms/TRM-0047-producto.md) | concepto | Cada una de las cuatro líneas en alcance (CLocator, CLocator v2, SIGO y SmartSuite) a las que pertenecen los proyectos. Los roles y las competencias no dependen del producto. | approved |
| [Programa de Formación de Competencias](terms/TRM-0048-programa-de-formacion-de-competencias.md) | término | Programa de COMSATEL que busca que los colaboradores participen de forma efectiva y eficaz en distintos roles de los proyectos de los cuatro productos. | approved |
| [Propuesta de nivel](terms/TRM-0049-propuesta-de-nivel.md) | concepto | Nivel que la IA sugiere para un colaborador, siempre con justificación, y que termina aprobado, ajustado o rechazado por un humano. | approved |
| [Proveedor](terms/TRM-0077-proveedor.md) | concepto | Rol de la parte de una organización externa con la que los contratistas tienen una relación de contratación; el correo laboral de sus contratistas es el del proveedor. | draft |
| [Proyecto](terms/TRM-0050-proyecto.md) | concepto | Iniciativa de un producto que declara requerimientos de rol, competencias y nivel. | approved |
| [Proyecto activo](terms/TRM-0051-proyecto-activo.md) | concepto | Proyecto que cuenta para el KPI 1 (cobertura de roles). Las fuentes no dicen cuándo un proyecto está activo. | draft |

### R

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| *Recursos humanos* → [RR. HH.](terms/TRM-0056-rr-hh.md) | | | |
| *Registro Único de Contribuyentes* → [RUC](terms/TRM-0083-ruc.md) | | | |
| [Relación entre partes](terms/TRM-0074-relacion-entre-partes.md) | concepto | Vínculo con vigencia entre dos roles de la parte. Tipos: empleo (empleado ↔ organización interna), contratación (contratista ↔ proveedor), pertenencia (persona ↔ unidad organizacional), estructura (unidad ↔ unidad padre) y reporte (persona ↔ jefe directo). | draft |
| [Requerimiento de proyecto](terms/TRM-0052-requerimiento-de-proyecto.md) | concepto | Declaración del PM de un rol que necesita su proyecto y de las competencias de ese rol que pide, todas o algunas. Los niveles requeridos se toman del catálogo. | approved |
| [Requisito de evidencia](terms/TRM-0068-requisito-de-evidencia.md) | concepto | Lo que un colaborador debe cumplir para certificar un determinado nivel de una competencia en el rol que tiene asignado: una o varias evidencias concretas (un curso, una práctica o un entregable), cada una de una de las tres categorías y declarada como requerida o deseada; certificar el nivel exige presentar todas las requeridas. Lo define el Jefe de Ingeniería. | draft |
| [Responsable de producto](terms/TRM-0053-responsable-de-producto.md) | concepto | Actor que aporta el conocimiento de los roles y competencias de su producto. | draft |
| *Responsable del producto* → [Responsable de producto](terms/TRM-0053-responsable-de-producto.md) | | | |
| [Riesgo de cobertura](terms/TRM-0054-riesgo-de-cobertura.md) | concepto | Riesgo, por producto, que Dirección ve en el tablero de capacidad. Las fuentes no lo definen ni dicen cómo se mide. | draft |
| [Rol](terms/TRM-0055-rol.md) | concepto | Función que un colaborador desempeña en los proyectos de cualquier producto (por ejemplo, Developer o Analista de Calidad). Tiene niveles de rol, normalmente varios Junior y varios Senior, y para cada nivel un conjunto de competencias con su nivel requerido. | approved |
| [Rol de la parte](terms/TRM-0073-rol-de-la-parte.md) | concepto | Forma en que una parte participa, con vigencia desde y hasta: Empleado, Contratista, Evaluador o Jefe de Ingeniería para las personas, y Organización interna, Unidad organizacional o Proveedor para las organizaciones. Los tipos son ampliables. | draft |
| *Rol-Nivel* → [Nivel de rol](terms/TRM-0066-nivel-de-rol.md) | | | |
| [RR. HH.](terms/TRM-0056-rr-hh.md) | abreviatura | Área o función de recursos humanos; en las fuentes acompaña a Gestión de formación y nombra el sistema de RR. HH. | approved |
| [Rúbrica](terms/TRM-0069-rubrica.md) | concepto | Descripción asociada a una competencia que, para cada nivel de L1 a L4, define el comportamiento y el logro visible y verificable que se espera del colaborador para certificarlo en ese nivel, y que se verifica a través de evidencias. La define y aprueba el Jefe de Ingeniería. | draft |
| [RUC](terms/TRM-0083-ruc.md) | sigla | Tipo de identificación aceptado para las organizaciones; una organización se registra con su RUC si aplica. | draft |
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

### U

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Unidad organizacional](terms/TRM-0079-unidad-organizacional.md) | concepto | Rol de la parte de una unidad interna de COMSATEL. Las unidades forman una jerarquía (relación de estructura con su unidad padre) y las personas pertenecen a ellas (relación de pertenencia). Está Activa mientras su rol tiene vigencia abierta e Inactiva cuando la cerró (eliminación lógica: no se borra). | draft |

### V

| Término | Tipo | Definición | Estado |
|---|---|---|---|
| [Versión de curso](terms/TRM-0104-version-de-curso.md) | concepto | Cada diseño de un curso a lo largo del tiempo, porque los cursos se rediseñan o refinan. Pasa por los estados DRAFT (al crearse), APPROVED (cuando la aprueba el Jefe de Ingeniería o un usuario ADMIN) y DEPRECATED (cuando se aprueba la versión siguiente); solo las versiones APPROVED admiten inscripciones nuevas. | draft |
| [Vigencia](terms/TRM-0092-vigencia.md) | concepto | Periodo, con fecha desde y fecha hasta, en que un rol de la parte, una relación entre partes, un medio de contacto o una asignación de Rol-Nivel está en efecto. Un cambio no sobrescribe: cierra la vigencia anterior y abre una nueva. | draft |
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
| GQ-07 | [Evaluador](terms/TRM-0021-evaluador.md) | ¿Instructor y evaluador son el mismo rol o dos roles distintos? *Actualización del 2026-09-27:* BRC-001 BR-FOR-05 (confirmada, EVD-2026-0131) define al Instructor como un colaborador asignado a una edición de curso, y el Evaluador es un rol de la parte (BR-PTY-03); se leen como distintos (**inferencia**), y si el Instructor puede certificar niveles sigue en BRC-001 P-49.2. Ver GQ-37 | Jefe de Ingeniería | Media | Abierta |
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
| GQ-18 | [Colaborador](terms/TRM-0013-colaborador.md) | ¿Se revisa la definición aprobada para reflejar que Colaborador es un concepto derivado (persona con un rol vigente de Empleado o de Contratista, BR-PTY-05, SPEC-001 D7) que incluye a contratistas externos, y no solo "persona de COMSATEL"? | Responsable de producto | Alta | Abierta |
| GQ-19 | [Jefe de Ingeniería](terms/TRM-0036-jefe-de-ingenieria.md) | ¿Se amplía la definición aprobada con que es un rol de la parte con vigencia (BR-PTY-03), que mantiene la información maestra (BR-PTY-17) y que se espera uno solo vigente (BR-PTY-18)? Desde el 2026-09-27 también: define los requisitos de evidencia (BR-CAT-16) y define y aprueba las rúbricas (BR-CAT-19); es solo gestor del programa y queda fuera del proceso de evaluación (BR-PRG-01, BR-PRG-02). | Jefe de Ingeniería | Media | Abierta |
| GQ-20 | [Evaluador](terms/TRM-0021-evaluador.md) | ¿Se añade a la definición aprobada que Evaluador es un rol de la parte con vigencia, asignado por el Jefe de Ingeniería (BR-PTY-03, SPEC-001 C6)? Desde el 2026-09-27 también: es solo gestor del programa y por ahora queda fuera del proceso de evaluación, aunque su rol tiene competencias definidas (BR-PRG-01, BR-PRG-02). | Jefe de Ingeniería | Baja | Abierta |
| GQ-21 | [Sistema de RR. HH.](terms/TRM-0059-sistema-de-rr-hh.md) | Con SPEC-001 D2 (BR-PTY-01) no hay integración con RR. HH. ¿Se retira el término (`deprecated`) o se redefine? | Responsable de producto | Media | Abierta |
| GQ-22 | [Código de colaborador](terms/TRM-0087-codigo-de-colaborador.md) | ¿Cómo se genera el código de colaborador: automático, manual o con formato? (SPEC-001 Q-01) | Jefe de Ingeniería | Media | Cerrada — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L79 (D25: automático, GUID) (N2, sin verificar) |
| GQ-23 | [Contratista](terms/TRM-0076-contratista.md), [Jefe directo](terms/TRM-0080-jefe-directo.md) | ¿Un contratista tiene jefe directo dentro de COMSATEL? (SPEC-001 Q-02) | Jefe de Ingeniería | Media | Cerrada — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L80 (D26: no) (N2, sin verificar) |
| GQ-24 | [Keycloak](terms/TRM-0090-keycloak.md) | ¿Qué rol es el responsable del término Keycloak? Ninguna fuente lo asigna. | Jefe de Ingeniería | Baja | Abierta |
| GQ-25 | [Parte](terms/TRM-0070-parte.md) | ¿Se verifica la correspondencia de Parte, Rol de la parte, Relación entre partes y Asignación de Rol-Nivel con el Universal Data Model contra *The Data Model Resource Book, Vol. 1*, para citarlo como fuente N1? (SPEC-001 Q-07) | Arquitecto responsable | Media | Cerrada — /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md:L83 (D29: no es necesario; la correspondencia con UDM no se citará como N1) (N2, sin verificar) |
| GQ-26 | [Anonimización](terms/TRM-0096-anonimizacion.md) | ¿Solo se puede anonimizar a una persona ya dada de baja? SPEC-001:L127 lo infiere y pide confirmarlo. | Jefe de Ingeniería | Media | Abierta |
| GQ-27 | [Datos personales](terms/TRM-0095-datos-personales.md) | ¿Cuál es la forma completa de la sigla PII en el negocio? Las fuentes no la expanden. | Jefe de Ingeniería | Baja | Abierta |
| GQ-28 | [Rol](terms/TRM-0055-rol.md) | La definición aprobada dice que un rol tiene "normalmente varios Junior y varios Senior" niveles de rol. BRC-001 BR-CAT-09 (revisada el 2026-09-27, L153) dice que no hay una cantidad general y que cada rol define sus niveles al registrarse. ¿Se cambia la definición a "Tiene niveles de rol, definidos al registrar el rol, y para cada nivel un conjunto de competencias con su nivel requerido" y vuelve a `draft`? | Jefe de Ingeniería | Alta | Abierta |
| GQ-29 | [Evidencia deseada](terms/TRM-0100-evidencia-deseada.md), [Certificación](terms/TRM-0001-acreditacion.md) | ¿Cómo "refuerza" una evidencia deseada la certificación del nivel? ¿Solo queda registrada o cambia algo (confianza, búsqueda de candidatos, propuesta de la IA)? (BRC-001 P-41) | Jefe de Ingeniería | Media | Abierta |
| GQ-30 | [MOF](terms/TRM-0101-mof.md) | ¿Qué rol es el responsable del MOF (Manual de Operaciones y Funciones)? Ninguna fuente lo asigna; está fuera de alcance de la plataforma (BR-CAT-18). | Jefe de Ingeniería | Baja | Abierta |
| GQ-31 | [Evaluador](terms/TRM-0021-evaluador.md) | BRC-001 BR-PRG-02 (2026-09-27) dice que el Evaluador "queda fuera del proceso de evaluación". Por el contexto de P-31 se interpreta que no es evaluado como colaborador, no que deje de revisar evidencias y certificar, como dice su definición aprobada. ¿Se confirma esa lectura? | Jefe de Ingeniería | Media | Abierta |
| GQ-32 | [Requerimiento de proyecto](terms/TRM-0052-requerimiento-de-proyecto.md) | ¿Se revisa la definición aprobada para decir que el Jefe de proyecto declara un **Rol-Nivel** (BR-REQ-08) y que por defecto pide todas sus competencias, pudiendo retirar algunas (BR-REQ-07 precisada y BR-REQ-10, 2026-09-27), en lugar de "todas o algunas"? | Responsable de producto | Media | Abierta |
| GQ-33 | [Evaluador](terms/TRM-0021-evaluador.md) | Términos candidatos **Instructor** (colaborador asignado a una edición de curso, que evalúa a los inscritos) y **Edición de curso** (cada ejecución de un curso), y de paso **Inscripción**. Vienen de una propuesta que el decisor solo está considerando (BRC-001 BR-FOR-05, EVD-2026-0113, hipótesis, 2026-09-27), así que no se crean todavía. Si BRC-001 P-49 la confirma: ¿se crean como términos, y el Instructor es un rol distinto del Evaluador (ver GQ-07, sinónimo "Instructor" de VIS-001:L46)? **Actualización del 2026-09-27:** la respuesta a P-02 (BRC-001 EVD-2026-0116, BR-FOR-06 a BR-FOR-10) atestigua como hechos la edición de curso y la inscripción, así que se crearon en `draft` [Edición de curso](terms/TRM-0102-edicion-de-curso.md), [Inscripción](terms/TRM-0103-inscripcion.md) y [Versión de curso](terms/TRM-0104-version-de-curso.md). Siguen abiertos: el término **Instructor** (depende de P-49) y el responsable de Edición de curso e Inscripción, que ninguna fuente asigna. **Actualización del 2026-09-27:** P-49 confirmó al Instructor (BRC-001 EVD-2026-0131, BR-FOR-05); se creó en `draft` [Instructor (edición de curso)](terms/TRM-0105-instructor-edicion-de-curso.md). Queda abierto solo el responsable de Edición de curso e Inscripción | Jefe de Ingeniería | Alta | Parcialmente cerrada — /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L137, L257-L261, L152, L267 (N2, sin verificar); abierto solo el responsable de Edición de curso e Inscripción |
| GQ-34 | [Curso final](terms/TRM-0017-curso-final.md) | ¿Se precisa la definición aprobada ("según el cumplimiento de sus objetivos") para decir que la aprobación se propone cuando se cumplen los requisitos de evidencia requeridos de las competencias que el curso desarrolla (BRC-001 BR-CER-06 precisada, BR-FOR-03, 2026-09-27)? | Responsable de producto | Media | Abierta |
| GQ-35 | [Asignación](terms/TRM-0004-asignacion.md) | La definición aprobada dice "designación de un colaborador **preparado**". BRC-001 BR-REQ-04, BR-REQ-11 y BR-REQ-12 (EVD-2026-0126, respuesta a P-05, 2026-09-27, /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L202, L209-L210) dicen que el Jefe de Ingeniería o un ADMIN asigna uno o varios colaboradores, que se puede asignar a alguien que no alcanza el nivel y que una persona puede estar en varios requerimientos. ¿Se cambia la definición a "Designación, por el Jefe de Ingeniería o un usuario ADMIN, de uno o varios colaboradores para cubrir un requerimiento de un proyecto, a partir de los candidatos que recomienda la plataforma" y vuelve a `draft`? | Responsable de producto | Media | Abierta |
| GQ-36 | [Competencia](terms/TRM-0014-competencia.md), [Catálogo de competencias](terms/TRM-0007-catalogo-de-competencias.md) | BRC-001 BR-CAT-22 (EVD-2026-0132, respuesta a P-50, 2026-09-27, /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md:L193) dice que las competencias se versionan. ¿Se crea el término **Versión de competencia**? No se crea todavía: sus estados y su contenido (rúbrica, requisitos de evidencia) son inferencia y dependen de BRC-001 P-50.1 y P-50.2 | Jefe de Ingeniería | Media | Abierta |
| GQ-37 | [Evaluador](terms/TRM-0021-evaluador.md), [Instructor (edición de curso)](terms/TRM-0105-instructor-edicion-de-curso.md) | El término aprobado Evaluador tiene el sinónimo "Instructor" (VIS-001:L46, "Instructor / evaluador"). Desde el 2026-09-27 el Instructor es un colaborador asignado a una edición de curso (BRC-001 BR-FOR-05 confirmada, EVD-2026-0131). ¿Se retira "Instructor" de los sinónimos del Evaluador y el término nuevo pasa a llamarse solo "Instructor"? Mientras tanto se nombra "Instructor (edición de curso)" para no duplicar el alias | Jefe de Ingeniería | Media | Abierta |
## Preparación y entrega

- **Estado:** CONDITIONAL
- **Términos con `gap`:** Proyecto activo, Riesgo de cobertura
- **Aprobación:** 59 de 105 términos aprobados (`status: approved`) por ianache (Jefe de Ingeniería) el 2026-09-26. Siguen en `draft` los 6 que no están del todo sustentados: [IA](terms/TRM-0033-ia.md), [Proyecto activo](terms/TRM-0051-proyecto-activo.md), [Responsable de producto](terms/TRM-0053-responsable-de-producto.md), [Riesgo de cobertura](terms/TRM-0054-riesgo-de-cobertura.md), [SIGO](terms/TRM-0058-sigo.md), [Sistema de RR. HH.](terms/TRM-0059-sistema-de-rr-hh.md). El 2026-09-26 se revisaron las definiciones de Catálogo de competencias, Nivel requerido, Producto, Requerimiento de proyecto y Rol, y ianache (Jefe de Ingeniería) las volvió a aprobar. Los términos nuevos [Nivel de rol](terms/TRM-0066-nivel-de-rol.md) y [Competencia transversal](terms/TRM-0067-competencia-transversal.md) están en `draft`, igual que [Requisito de evidencia](terms/TRM-0068-requisito-de-evidencia.md) y [Rúbrica](terms/TRM-0069-rubrica.md). El 2026-09-27 se añadieron en `draft` 29 términos de información maestra de colaboradores (Party) a partir de SPEC-001 y BR-PTY-01 a BR-PTY-18: TRM-0070 a TRM-0098. Se añadieron notas, sin cambiar definiciones, sinónimos ni fuentes, a los términos aprobados Colaborador, Jefe de Ingeniería, Evaluador, Rol, Asignación, COMSATEL, Jefe de proyecto y Perfil de competencias del colaborador, y se abrieron GQ-18 a GQ-20 para que sus responsables decidan si cambian las definiciones. También el 2026-09-27, por las decisiones EVD-2026-0096 a EVD-2026-0101 de BRC-001, se revisaron las definiciones en `draft` de [Nivel de rol](terms/TRM-0066-nivel-de-rol.md) (ya no "numerado del 1 al 4") y [Requisito de evidencia](terms/TRM-0068-requisito-de-evidencia.md) (requerida o deseada), se añadieron en `draft` [Evidencia requerida](terms/TRM-0099-evidencia-requerida.md), [Evidencia deseada](terms/TRM-0100-evidencia-deseada.md) y [MOF](terms/TRM-0101-mof.md), se añadieron notas a los términos aprobados Rol, Catálogo de competencias, Evidencia, Certificación y Nivel requerido, y se abrieron GQ-28 a GQ-30. Por las decisiones EVD-2026-0102 a EVD-2026-0105 se revisaron las definiciones en `draft` de [Rúbrica](terms/TRM-0069-rubrica.md) (comportamiento y logro verificable; la aprueba el Jefe de Ingeniería) y [Asignación de Rol-Nivel](terms/TRM-0088-asignacion-de-rol-nivel.md) (nivel inicial al registrar al colaborador), se añadieron notas a los términos aprobados Evaluador, Jefe de Ingeniería, Requerimiento de proyecto y Jefe de proyecto, se ampliaron GQ-19 y GQ-20 y se abrieron GQ-31 y GQ-32. Por EVD-2026-0112 y EVD-2026-0113 (respuestas a P-47 y P-48) se añadieron notas a los términos aprobados Curso final, Certificado de curso, Evidencia y Evaluador, sin cambiar definiciones, sinónimos ni fuentes, y se abrieron GQ-33 (términos candidatos Instructor y Edición de curso, pendientes de BRC-001 P-49; no se crean) y GQ-34. Después, por EVD-2026-0114 a EVD-2026-0118 (respuestas a P-02, P-39, P-40, US1-Q1 y UXR-001-Q1), se añadieron en `draft` [Edición de curso](terms/TRM-0102-edicion-de-curso.md), [Inscripción](terms/TRM-0103-inscripcion.md) y [Versión de curso](terms/TRM-0104-version-de-curso.md) (GQ-33 queda abierta solo para Instructor y los responsables), se añadieron notas a los términos aprobados Catálogo de competencias, Rol y Curso final, y se actualizaron las notas en `draft` de Nivel de rol, Requisito de evidencia y Evidencia requerida. Por EVD-2026-0126 a EVD-2026-0132 (respuestas a P-05, US2-Q2, P-07, P-08, P-52, P-49 y P-50) se añadió en `draft` [Instructor (edición de curso)](terms/TRM-0105-instructor-edicion-de-curso.md) (GQ-33 queda abierta solo para los responsables); se añadieron notas, sin cambiar definiciones, sinónimos ni fuentes, a los términos aprobados Asignación, Búsqueda de personal, Catálogo de competencias, Certificación, Certificado de curso, Competencia, Curso final, Dirección / Gerencia, Evaluador, Evidencia, Jefe de proyecto, Perfil de competencias del colaborador, Propuesta de nivel y Rol; se actualizaron las notas en `draft` de Edición de curso, Inscripción, Versión de curso y Perfil profesional en línea; y se abrieron GQ-35 (definición de Asignación: ya no solo colaboradores "preparados"), GQ-36 (término candidato Versión de competencia) y GQ-37 (sinónimo "Instructor" del Evaluador).
- **Motivo:** quedan 46 términos sin aprobar (entre ellos los 29 de información maestra, los 3 nuevos de requisitos de evidencia y MOF, los 3 nuevos de formación y el Instructor, del 2026-09-27), y GQ-04, GQ-06, GQ-11, GQ-18 y GQ-28 (prioridad alta) siguen abiertas. SPEC-001 también está en `draft`. Las fuentes internas VIS-001 y BRC-001 siguen en `draft`: la aprobación valida las definiciones del glosario, no esos documentos.
- **Siguiente rol o Skill:** `af-user-story-refiner`, usando este glosario como vocabulario común.
- **Decisión humana requerida:** responder las preguntas abiertas de los términos pendientes y aprobarlos; revisar los 29 términos de información maestra (TRM-0070 a TRM-0098) y decidir GQ-18 a GQ-21 sobre los términos aprobados afectados por SPEC-001, GQ-28 sobre la definición aprobada de Rol, GQ-31 sobre Evaluador, GQ-32 sobre Requerimiento de proyecto, GQ-33 (responsables de Edición de curso e Inscripción), GQ-34 sobre Curso final, GQ-35 sobre Asignación, GQ-36 (Versión de competencia, tras BRC-001 P-50.1 y P-50.2) y GQ-37 (sinónimo "Instructor" del Evaluador); y revisar el término nuevo Instructor (edición de curso). Los términos cuyo responsable es el Responsable de producto fueron aprobados por el Jefe de Ingeniería; el Responsable de producto puede revisarlos.

## Lista de calidad

- [x] Cada definición tiene al menos una fuente N1 o N2 con localizador (salvo las `gap`)
- [x] Sinónimos y formas completas respaldados por una fuente
- [x] Sin conocimiento propio del modelo como fuente
- [x] `glossary.py check` sin errores
- [x] Validación humana registrada (59 de 104 términos)
