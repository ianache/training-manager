---
type: Architecture Discovery Brief
title: "ADB-001 — Descubrimiento de arquitectura de la Plataforma de Gestión de Formación"
description: "Entendimiento inicial, basado en evidencia, del alcance, actores, capacidades, integraciones, restricciones, vacíos y preguntas de arquitectura de la plataforma, antes de cualquier diseño."
tags: [architecture, discovery, as-is, integraciones, restricciones]
status: draft
generated:
  by: "architecture-discovery/1.0"
  at: "2026-09-26T21:37:26-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: asr-catalog
    resource: /knowledge-base/architecture/asr/asr-catalog.md
  - id: repository-guidelines
    resource: /AGENTS.md
---

# ADB-001 — Descubrimiento de arquitectura

## Metadata

- **Product:** [Plataforma de Gestión de Formación del Recurso Humano](../business/glossary/terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md), de uso interno de COMSATEL.
- **Initiative:** la plataforma completa, horizontes H1 a H3, con más detalle en H1, que es lo primero que se construye.
- **Architect:** Por asignar.
- **Date:** 2026-09-26.
- **Version:** 0.1 (borrador).
- **Fuentes:** [VIS-001](../vision/VIS-001-plataforma-gestion-formacion.md), [BRC-001](../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md), [GLS-001](../business/glossary/GLS-001-glosario-de-negocio.md), [USC-001](../requirement/USC-001-user-stories-plataforma-gestion-formacion.md), [RCP-001](../requirement/context-packs/RCP-001-h1-idioma-comun.md), AGENTS.md. Todas del 2026-09-26 y en `draft`, salvo 59 términos aprobados del glosario.
- **Nota de secuencia:** el [catálogo de candidatos ASR](asr/asr-catalog.md) se generó **antes** de este brief. Aquí sus candidatos se tratan solo como observaciones; el catálogo debería revisarse cuando este brief esté validado.

## Objective

Que cada proyecto de CLocator (v1), CLocator v2 (C-Go), SIGO y SmartSuite cuente, cuando lo necesita, con colaboradores cuyo dominio de las competencias de su rol esté certificado con evidencia verificable. La plataforma es el puente entre lo que piden los proyectos y lo que las personas demuestran saber (VIS-001:L23-L25).

Resultado observable: los 6 KPI de VIS-001 §8, todavía sin metas ni línea base (VIS-001:L152).

## Scope

### In scope

- **H1:** catálogo de roles, competencias y niveles; requerimientos de proyecto; perfil con certificación manual; brechas y búsqueda de personal (VIS-001:L132).
- **H2:** rutas de formación con Classroom y Drive; certificados de curso en docsuite (VIS-001:L133).
- **H3:** agente de IA sobre GitLab que propone niveles; tablero de capacidad frente a demanda (VIS-001:L134).
- **Integraciones:** Google Classroom, Google Drive, GitLab y docsuite (VIS-001:L91-L96).

### Out of scope

- Hospedar contenido de cursos, salvo que se active la contingencia de Classroom (VIS-001:L108, L89).
- Verificación pública de certificados de curso (VIS-001:L109).
- Evaluación de desempeño salarial o de RR. HH. (VIS-001:L110).
- Gestión de proyectos, que ya cubre GitLab (VIS-001:L111).
- En este brief: el diseño de la arquitectura objetivo, la aprobación de ASR y los ADR.

## Actors and capabilities

| Capacidad (VIS-001 §5) | Horizonte | Actores | Integración | Fuente |
|---|---|---|---|---|
| 1. Catálogo de competencias | H1 | Jefe de Ingeniería; Responsable de producto (papel por confirmar) | — | VIS-001:L75 |
| 2. Perfil de competencias | H1 | Colaborador | — | VIS-001:L76 |
| 3. Requerimientos de proyecto | H1 | Jefe de proyecto | — (¿los proyectos vienen de GitLab? UNKNOWN, US2-Q1) | VIS-001:L77 |
| 4. Brechas y búsqueda de personal | H1 | Jefe de proyecto, Colaborador; brechas por producto: actor por confirmar | — | VIS-001:L78 |
| 5. Rutas de formación | H2 | Colaborador | Classroom (lectura), Drive (enlace y lectura) | VIS-001:L79 |
| 6. Certificación | H1 (manual) | Evaluador; Gestión de formación / RR. HH. (papel ambiguo) | — | VIS-001:L80 |
| 7. Evidencia de GitLab asistida por IA | H3 | Evaluador, Colaborador | GitLab (lectura) | VIS-001:L81 |
| 8. Certificados de curso | H2 | Gestión de formación / RR. HH. | docsuite (API REST) | VIS-001:L82 |
| 9. Tablero de capacidad | H3 | Dirección / Gerencia | — | VIS-001:L83 |

Los 7 actores están en VIS-001:L37-L51. El glosario los define en GLS-001, y el Responsable de producto sigue en `draft`.

## Architecture concerns

Son preocupaciones que las fuentes plantean. **No son soluciones.**

| ID | Preocupación | Origen | Observación ASR |
|---|---|---|---|
| AC-01 | Plataforma centrada en integraciones: orquesta cuatro sistemas externos, con uno más posible (RR. HH.) | VIS-001:L87, L91-L96, L153 | — |
| AC-02 | Separación entre lo que la IA propone y lo que un humano certifica | VIS-001:L81, L101 | [asr-BR-ACR-04](asr/asr-BR-ACR-04.md) |
| AC-03 | Historial y trazabilidad de cada nivel hasta sus evidencias, incluidas las externas | VIS-001:L76, L80, L103 | [asr-BR-ACR-03](asr/asr-BR-ACR-03.md), [asr-BR-IA-02](asr/asr-BR-IA-02.md) |
| AC-04 | Datos de desempeño de personas: visibilidad por rol y riesgo de vigilancia | VIS-001:L104, L143 | [asr-BR-TRA-01](asr/asr-BR-TRA-01.md) |
| AC-05 | Permisos por rol (y posiblemente por ámbito: INFERENCE a partir de "su proyecto", L42), con una fuente de identidad desconocida | VIS-001:L37-L51, L42, L153 | [asr-BR-ACR-02](asr/asr-BR-ACR-02.md) |
| AC-06 | Confidencialidad de la evidencia de GitLab al procesarla con IA | VIS-001:L95, L165 | [asr-BR-IA-01](asr/asr-BR-IA-01.md) |
| AC-07 | Datos con fecha desde H1 para medir KPI que se muestran en H3 | VIS-001:L117-L124, L128-L136 | [asr-US-014](asr/asr-US-014.md) |
| AC-08 | Evolución del catálogo (versionado) y su efecto en los datos vigentes | VIS-001:L142, L151 | [asr-BR-CAT-06](asr/asr-BR-CAT-06.md) |
| AC-09 | Posible cambio de "integrar" a "hospedar" si Classroom falla | VIS-001:L89, L144 | [asr-BR-INT-02](asr/asr-BR-INT-02.md) |
| AC-10 | Entrega incremental por horizontes: H2 y H3 se agregan sobre H1 | VIS-001:L128-L136 | — |
| AC-11 | La IA no debe premiar volumen: la calidad y el contexto pesan más que la cantidad de issues | VIS-001:L102; BR-IA-03 | [asr-BR-IA-01](asr/asr-BR-IA-01.md) |

## Findings

| ID | Finding | Type | Evidence | Confidence | Notes |
|---|---|---|---|---|---|
| F-01 | La plataforma es de uso interno de COMSATEL | FACT | VIS-001:L29 (EVD-2026-0043) | Alta | |
| F-02 | La plataforma integra y orquesta; no hospeda contenido | FACT | VIS-001:L87, L100 (EVD-2026-0044) | Alta | Decisión del responsable del producto |
| F-03 | Classroom en solo lectura; Drive en enlace y lectura | FACT | VIS-001:L93-L94, L163 (EVD-2026-0020) | Alta | |
| F-04 | GitLab en lectura; su evidencia es de uso interno | FACT | VIS-001:L95, L165 (EVD-2026-0014) | Alta | |
| F-05 | docsuite diseña plantillas, genera PDF por API REST y guarda los certificados de curso en su repositorio | FACT | VIS-001:L34, L96 (EVD-2026-0019) | Alta | No hay contrato de la API (KG-05) |
| F-06 | El material de los cursos está en Google Drive y los cursos se dictan en Google Classroom | FACT | VIS-001:L32 | Alta | |
| F-07 | Los colaboradores trabajan en GitLab; hoy esa actividad no alimenta la evaluación de competencias | FACT | VIS-001:L33 | Alta | |
| F-08 | No existe un catálogo común de roles y competencias por producto | ASSUMPTION | VIS-001:L35 | Media | Validado en la sesión, sin evidencia documental |
| F-09 | No se encontró evidencia de un sistema existente de la plataforma; se trata como nueva | ASSUMPTION | Ausencia en todas las fuentes | Media | Ver KG-01 |
| F-10 | Ninguna certificación sin firma humana; la IA propone y justifica | FACT | VIS-001:L81, L101 (EVD-2026-0012) | Alta | |
| F-11 | Cada nivel certificado se rastrea hasta sus evidencias y quien lo certificó | FACT | VIS-001:L80, L103 (EVD-2026-0011, 0037) | Alta | |
| F-12 | El colaborador ve su perfil, sus evidencias y las propuestas de la IA sobre él | FACT | VIS-001:L104 (EVD-2026-0016) | Alta | |
| F-13 | El modelo conceptual: Producto → Rol → Competencia → Nivel; Colaborador → Nivel certificado ← Evidencia; Proyecto → Requerimiento → Asignación | FACT | VIS-001:L56-L59 | Media | Modelo de negocio, no de datos |
| F-14 | Escala de niveles L1–L4 | FACT | VIS-001:L62-L69 (EVD-2026-0003) | Alta | Término aprobado en el glosario |
| F-15 | Tres KPI (2, 3 y 4) dependen de eventos con fecha que ocurren desde H1 | INFERENCE | VIS-001:L117-L124, L132-L134 (EVD-2026-0041, 0051) | Media | |
| F-16 | La IA de H3 necesita leer issues, MRs y milestones y asociarlos a competencias | FACT | VIS-001:L81 (EVD-2026-0013) | Alta | Frecuencia y volumen desconocidos |
| F-17 | La visión identifica el riesgo de datos pobres en GitLab (etiquetas o asignaciones inconsistentes) | FACT (del riesgo declarado) | VIS-001:L146 (EVD-2026-0040) | Alta | La mitigación ("convenciones mínimas") está por definir |
| F-18 | El sistema de RR. HH. podría ser la fuente de la ficha del colaborador | UNKNOWN | VIS-001:L153 (EVD-2026-0047) | Alta | KG-03 |
| F-19 | Los proyectos y su Líder no tienen fuente definida; la gestión de proyectos está fuera de alcance y la cubre GitLab | UNKNOWN | VIS-001:L111; US-002 (EVD-2026-0028) | Alta | Posible integración adicional con GitLab |
| F-20 | Cómo se decide una asignación | UNKNOWN | VIS-001:L154 (EVD-2026-0023) | Alta | |
| F-21 | Si la evidencia de GitLab puede procesarse con un servicio de IA externo | UNKNOWN | Ausencia en fuentes (EVD-2026-0050) | Alta | CF-01 |
| F-22 | Si falla Classroom, se evaluará gestión propia de material y progreso | FACT | VIS-001:L89 (EVD-2026-0021) | Alta | Decisión posterior, fuera de alcance |
| F-23 | Accesibilidad objetivo WCAG 2.2 AA | ASSUMPTION | AGENTS.md:L71 (EVD-2026-0046) | Media | Es el estándar del repositorio del curso; su aplicabilidad al producto está por confirmar |
| F-24 | Tecnologías, alojamiento, proveedor de identidad, estándares corporativos y ADR previos | UNKNOWN | Ausencia en todas las fuentes | Alta | KG-01 |
| F-25 | Metas de calidad: disponibilidad, rendimiento, RTO/RPO, retención | UNKNOWN | Ausencia en todas las fuentes | Alta | KG-06. No se inventaron metas |

Todas las fuentes son documentos (`source_type: document`) de la base de conocimiento, del 2026-09-26 y sin verificar, salvo el glosario. **Freshness:** que la fecha sea reciente no prueba que el contenido esté vigente; ver CF-04.

## Explicit NFR and constraints

Solo se listan los que las fuentes declaran:

| ID | NFR o restricción | Fuente |
|---|---|---|
| C-01 | Uso interno; sin verificación pública de certificados de curso | VIS-001:L29, L109 |
| C-02 | Integrar y orquestar, no hospedar | VIS-001:L87, L100 |
| C-03 | Classroom solo lectura; Drive enlace y lectura | VIS-001:L93-L94 |
| C-04 | GitLab solo lectura; uso interno | VIS-001:L95, L165 |
| C-05 | docsuite por API REST; la plataforma guarda la referencia del certificado de curso | VIS-001:L82, L96 |
| C-06 | Firma humana obligatoria para toda certificación | VIS-001:L101 |
| C-07 | Trazabilidad de cada nivel hasta evidencia y certificador | VIS-001:L103 |
| C-08 | Transparencia para el colaborador sobre lo que se usa de él | VIS-001:L104, L143 |
| C-09 | Accesibilidad WCAG 2.2 AA (aplicabilidad al producto por confirmar: F-23) | AGENTS.md:L71 |
| C-10 | Evidencia sobre volumen: la cantidad de issues no prueba dominio | VIS-001:L102 |

No hay NFR explícitos de rendimiento, disponibilidad, escalabilidad, recuperación, retención ni seguridad cuantificada.

## Knowledge gaps

| ID | Vacío | Por qué importa | Destinatario | Prioridad |
|---|---|---|---|---|
| KG-01 | Arquitectura AS-IS y contexto corporativo: plataformas, alojamiento (on-premise o nube), estándares, tecnologías aprobadas, ADR previos | Sin esto no se puede analizar impacto ni validar la significancia de los ASR | Arquitecto | Alta |
| KG-02 | Política corporativa sobre enviar datos internos a servicios de IA | Define si la IA de H3 puede procesar datos de GitLab fuera del perímetro interno | Arquitecto + Seguridad | Alta |
| KG-03 | Proveedor de identidad y fuente de datos de colaboradores (¿sistema de RR. HH.?) | Afecta a la autenticación, los roles y el alta de personas | Arquitecto + Negocio | Alta |
| KG-04 | Normativa de datos personales aplicable; matriz de visibilidad por rol (P-08); quiénes son los evaluadores y quién los designa (RCP-Q1); si un evaluador puede certificar a su propio equipo (P-09) | Afecta a la autorización a nivel de dato y a la auditoría de accesos | Negocio + Legal | Alta |
| KG-05 | Contratos y límites de las API: Classroom, Drive, GitLab (instancia, versión, permisos) y docsuite | Afecta a la viabilidad y a la resiliencia de las integraciones | Arquitecto | Media |
| KG-06 | Metas de calidad: disponibilidad, rendimiento, RTO/RPO, retención, respaldo | Sin metas no se puede dimensionar | Negocio + Arquitecto | Media |
| KG-07 | Volúmenes: colaboradores, proyectos, competencias, actividad de GitLab | Afecta al dimensionamiento y al diseño de la búsqueda y la IA | Negocio | Media |
| KG-08 | Fuente de proyectos y Jefes de proyecto (US2-Q1) | Posible integración adicional con GitLab | Responsable de producto | Media |
| KG-09 | Equipo, presupuesto y plazos de construcción | Restringen las opciones de arquitectura | Dirección | Baja |

## Conflicts

| ID | Conflicto | Fuente A | Fuente B | Estado |
|---|---|---|---|---|
| CF-01 | **Potencial:** la evidencia de GitLab es de "uso interno", pero la IA de H3 podría requerir un servicio externo. Ninguna fuente dice si está permitido. | VIS-001:L95, L165 | VIS-001:L81 (sin proveedor definido) | Sin resolver (KG-02) |
| CF-02 | Gestión de formación / RR. HH. "gestiona certificaciones", pero quien certifica es el evaluador | VIS-001:L45 | VIS-001:L80 | Sin resolver (AMB-03, P-09) |
| CF-03 | La formación cuenta como evidencia de nivel, pero el certificado de curso no equivale a un nivel | VIS-001:L71 | VIS-001:L82 | Sin resolver (AMB-01, P-07) |
| CF-04 | Los `generated.at` de VIS-001, `index.md` y `changelog.md` (22:02 y 22:05) son posteriores a documentos derivados de ellos; la cronología de procedencia no es confiable | VIS-001 frontmatter | BRC-001, GLS-001 y siguientes | Sin resolver: corregir las marcas de tiempo |

## Prioritized architecture questions

| Priority | Question | Why it matters | Required evidence |
|---|---|---|---|
| 1 | ¿Dónde se aloja la plataforma y qué estándares y tecnologías corporativas son obligatorios? | Condiciona todas las decisiones posteriores | Estándares de arquitectura de COMSATEL, ADR existentes Parcialmente respondida: la tecnología y la estructura están en ADR-001 (Angular, Node.js, microUIs, BFF, microservicios); el alojamiento sigue abierto |
| 2 | ¿Pueden los datos de GitLab procesarse con un servicio de IA externo? | Define si la IA puede procesar datos fuera del perímetro interno (CF-01) | Política de IA / seguridad de la información |
| 3 | ¿Cuál es el proveedor de identidad y de dónde salen los colaboradores y sus roles? | Autenticación, autorización y datos maestros | Inventario de sistemas de identidad y de RR. HH. Parcialmente respondida: el proveedor es Keycloak, integrado en el BFF (ADR-002); el origen de los colaboradores y sus roles sigue abierto |
| 4 | ¿Qué normativa de datos personales aplica y quién ve qué? | Autorización a nivel de dato, auditoría de accesos | Normativa aplicable; respuesta a P-08 |
| 5 | ¿El historial y la evidencia deben conservarse con copia o basta la referencia externa, y por cuánto tiempo? ¿Una certificación vence o se revoca (P-14)? | Persistencia, trazabilidad y retención | Política de retención; requisitos de auditoría; respuesta a P-14 |
| 6 | ¿De dónde salen los proyectos y sus Líderes? | Posible integración adicional con GitLab | Respuesta a US2-Q1 |
| 7 | ¿Se versiona el catálogo? | Modelo de datos de H1 | Respuesta a P-02 |
| 8 | ¿Qué acceso real hay a las API de Classroom, Drive, GitLab y docsuite? | Viabilidad de las integraciones y de la contingencia | Credenciales de prueba, documentación de las API, contrato de docsuite |
| 9 | ¿Qué volúmenes y metas de calidad se esperan? | Dimensionamiento | Cifras de negocio; SLA internos |
| 10 | ¿Qué equipo, presupuesto y plazo hay? | Restringe las opciones | Plan del proyecto |

## Human validation

El arquitecto debe validar:

- [ ] El alcance y las exclusiones
- [ ] Las clasificaciones de los hallazgos, en especial las ASSUMPTION F-08 y F-09 y la INFERENCE F-15
- [ ] Qué inferencias acepta o rechaza
- [ ] Los conflictos CF-01 a CF-04 y quién los resuelve
- [ ] La prioridad de las preguntas
- [ ] Si el catálogo ASR debe revisarse después de validar este brief

| Estado | Arquitecto | Fecha | Comentarios |
|---|---|---|---|
| Pendiente | Por asignar | — | |
