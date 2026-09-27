---
type: ASR Candidate Catalog
title: "Catálogo de candidatos ASR — Plataforma de Gestión de Formación"
description: "Candidatos a requerimientos de impacto arquitectónico (ASR) de la plataforma, con evidencia, confianza, evidencia faltante y disposición humana pendiente."
tags: [asr, architecture, catalog, quality-attributes]
status: draft
generated:
  by: "asr-discovery/1.0"
  at: "2026-09-26T22:27:48-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: repository-guidelines
    resource: /AGENTS.md
---

# Catálogo de candidatos ASR

## Metadata

| Campo | Valor |
|---|---|
| Producto / iniciativa | [Plataforma de Gestión de Formación del Recurso Humano](../../business/glossary/terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md), horizontes H1 a H3 |
| Arquitecto | Por asignar |
| Fecha | 2026-09-26 |
| Versión | 0.1 (borrador) |
| Fuentes | [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md), [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md), [USC-001](../../requirement/USC-001-user-stories-plataforma-gestion-formacion.md), [RCP-001](../../requirement/context-packs/RCP-001-h1-idioma-comun.md), AGENTS.md. Todas en `draft` y sin verificar. |
| Entradas faltantes | No existen un **Architecture Context Pack** ni un **Architecture Impact Analysis** (ver ASR-KG-01). La significancia de cada candidato se argumenta desde requisitos y riesgos, no desde la arquitectura actual. |

## Candidates

| ID | Requirement | Quality Concern | Why Architecture-Significant? | Impact Evidence | Evidence IDs | Confidence | Missing Evidence | Human Disposition |
|---|---|---|---|---|---|---|---|---|
| [asr-BR-ACR-03](asr-BR-ACR-03.md) | BR-ACR-03; US-003, US-004, US-011 | Auditabilidad / trazabilidad | Transversal a la certificación manual y la de IA; exige historial no destructivo y referencias de evidencia resolubles | VIS-001:L76, L80, L103 | EVD-2026-0011, 0014, 0036, 0037 | Alta (necesidad) · UNKNOWN (medida) | Retención, requisitos de auditoría, copia de la evidencia externa, revocación (P-14) | Pendiente (sugerido: CANDIDATE) |
| [asr-BR-ACR-04](asr-BR-ACR-04.md) | BR-ACR-04, BR-ACR-02; US-003, US-011 | Integridad / control de la decisión | La IA no debe tener ninguna vía de escritura sobre niveles certificados; separa proponer de certificar | VIS-001:L81, L101, L145 | EVD-2026-0012, 0013, 0022, 0038 | Alta | Qué es "firma humana"; quiénes son los evaluadores (RCP-Q1) | Pendiente (sugerido: CANDIDATE) |
| [asr-BR-ACR-02](asr-BR-ACR-02.md) | BR-ACR-02, BR-CAT-04, BR-REQ-02 | Seguridad: identidad y autorización | 7 actores con permisos por rol y ámbito (producto, proyecto propio); fuente de identidad desconocida | VIS-001:L37-L51, L153 | EVD-2026-0005, 0011, 0045, 0047 | Media | Proveedor de identidad; matriz de permisos; US2-Q2 | Pendiente (sugerido: INVESTIGATE) |
| [asr-BR-TRA-01](asr-BR-TRA-01.md) | BR-TRA-01, BR-IA-04; US-004, US-006, US-012 | Privacidad / confidencialidad | Datos de desempeño de personas en casi todas las vistas; visibilidad por rol a nivel de dato; riesgo de vigilancia | VIS-001:L104, L110, L143 | EVD-2026-0016, 0039, 0048, 0049 | Alta (necesidad) · UNKNOWN (alcance) | Matriz de visibilidad (P-08); normativa de datos personales | Pendiente (sugerido: CANDIDATE) |
| [asr-BR-IA-01](asr-BR-IA-01.md) | BR-IA-01, BR-IA-02; capacidad 7; US-011 | Confidencialidad, interoperabilidad, calidad de datos | Componente de IA con integración de lectura de GitLab; posible **CONFLICT** entre "uso interno" y un proveedor de IA externo | VIS-001:L81, L95, L102, L146, L165 | EVD-2026-0013, 0014, 0015, 0040, 0050 | Media | Política de IA corporativa; volumen de GitLab; frecuencia de análisis; P-13 | Pendiente (sugerido: INVESTIGATE) |
| [asr-BR-IA-02](asr-BR-IA-02.md) | BR-IA-02; US-011, US-012 | Explicabilidad | Justificación y evidencias conservadas por propuesta; posible desfase si GitLab cambia | VIS-001:L81, L104, L145 | EVD-2026-0013, 0016, 0038 | Alta | Reproducibilidad exigida; P-13 | Pendiente (sugerido: CANDIDATE; posible fusión con asr-BR-ACR-03) |
| [asr-BR-INT-02](asr-BR-INT-02.md) | BR-INT-02; US-009, US-010 | Modificabilidad / resiliencia de la integración | La contingencia cambia "integrar" por "hospedar"; sin aislamiento de Classroom obligaría a rehacer H2 | VIS-001:L87, L89, L100, L144 | EVD-2026-0020, 0021, 0044 | Media | Riesgos concretos de la API de Classroom; probabilidad de activación | Pendiente (sugerido: INVESTIGATE) |
| [asr-BR-CAT-06](asr-BR-CAT-06.md) | BR-CAT-06 (vacío); US-001 | Modificabilidad / integridad histórica | Si hay versionado, requerimientos, certificaciones y brechas se atan a una versión desde H1; afecta al KPI 3 | VIS-001:L121, L142, L151 | EVD-2026-0024, 0041 | Media | Respuesta a P-02; frecuencia de cambios | Pendiente (sugerido: INVESTIGATE) |
| [asr-US-014](asr-US-014.md) | US-014; VIS-001 §8 | Medibilidad | Los KPI 2, 3 y 4 necesitan eventos con fecha desde H1; si no se capturan, no se recuperan | VIS-001:L117-L124, L132-L134 | EVD-2026-0023, 0041, 0051 | Media | Metas y línea base (P-03); evento de asignación (P-05); "perfil activo" (GQ-08) | Pendiente (sugerido: CANDIDATE) |

## Constraints

Son restricciones que la arquitectura debe respetar. No son candidatos ASR por sí mismas, pero condicionan a varios de ellos.

| ID | Restricción | Fuente | Evidencia | Candidatos afectados |
|---|---|---|---|---|
| ASR-C-01 | Integrar y orquestar, no hospedar: no se reconstruye un LMS ni un repositorio documental | VIS-001:L87, L100 | EVD-2026-0044 | asr-BR-INT-02 |
| ASR-C-02 | Google Classroom en solo lectura; Google Drive en enlace y lectura | VIS-001:L93-L94, L163 | EVD-2026-0020 | asr-BR-INT-02 |
| ASR-C-03 | GitLab en solo lectura; evidencia de uso interno | VIS-001:L95, L165 | EVD-2026-0014 | asr-BR-IA-01 |
| ASR-C-04 | Certificados de curso: el PDF se genera en docsuite por API REST y la plataforma guarda la referencia | VIS-001:L82, L96 | EVD-2026-0019 | — |
| ASR-C-05 | Uso interno de COMSATEL; sin verificación pública de certificados de curso | VIS-001:L29, L82, L109 | EVD-2026-0043 | asr-BR-ACR-02, asr-BR-TRA-01 |
| ASR-C-06 | Catálogo único de roles y competencias, común a los 4 productos, con un único dueño (Jefe de Ingeniería) | VIS-001:L23, L51; BR-CAT-07, BR-CAT-08 | EVD-2026-0001, 0005, 0053, 0056 | asr-BR-ACR-02 |
| ASR-C-07 | Accesibilidad objetivo WCAG 2.2 AA | AGENTS.md:L71 | EVD-2026-0046 | — |
| ASR-C-08 | Fuera de alcance: evaluación salarial o de RR. HH. y gestión de proyectos | VIS-001:L110-L111 | EVD-2026-0048 | asr-BR-TRA-01 |

## Rejected Candidates

El agente los consideró y **no** los propone como candidatos. El arquitecto puede revertir esa decisión.

| Requisito | Motivo para no proponerlo | Qué lo reabriría |
|---|---|---|
| BR-CER-03 — Emisión de certificados de curso vía docsuite | Integración puntual con un sistema existente; sin evidencia de impacto estructural | Volumen alto de emisión, o requisitos de disponibilidad de docsuite |
| BR-CAT-01 — Catálogo por producto | Ya no aplica: por decisión del 2026-09-26 el catálogo es común a todos los productos (BR-CAT-07, BR-CAT-08), así que no hay datos de catálogo que separar por producto | Que algún producto necesite roles o competencias propios |
| US-006 — Búsqueda de candidatos | Consulta sobre datos propios; sin volumen ni exigencia de tiempo de respuesta en las fuentes (EVD-2026-0042) | Cifras de colaboradores, proyectos y competencias que la hagan costosa |
| ASR-C-07 — WCAG 2.2 AA | NFR de diseño e implementación de la interfaz; no se encontró evidencia de que condicione la estructura | Requisitos de tecnologías de asistencia o de canales adicionales |

## Knowledge Gaps

| ID | Vacío | Afecta a | Destinatario | Prioridad |
|---|---|---|---|---|
| ASR-KG-01 | No hay Architecture Context Pack ni Architecture Impact Analysis; se desconoce la arquitectura AS-IS (plataformas corporativas, alojamiento, estándares, ADR previos) | Todos | Arquitecto | Alta |
| ASR-KG-02 | Política corporativa sobre el envío de datos internos a servicios de IA (EVD-2026-0050) | asr-BR-IA-01 | Arquitecto + Seguridad | Alta |
| ASR-KG-03 | Proveedor de identidad y fuente de datos de colaboradores; ¿sistema de RR. HH.? (VIS-001:L153) | asr-BR-ACR-02 | Arquitecto + Negocio | Alta |
| ASR-KG-04 | Normativa de datos personales aplicable y matriz de visibilidad por rol (P-08) | asr-BR-TRA-01 | Negocio + Legal | Alta |
| ASR-KG-05 | Volúmenes: colaboradores, proyectos, competencias, actividad de GitLab (EVD-2026-0042) | asr-BR-IA-01; US-006 (descartado) | Negocio | Media |
| ASR-KG-06 | Disponibilidad, recuperación (RTO/RPO), retención y respaldo: ninguna fuente los fija. **No se inventaron metas.** | asr-BR-ACR-03; general | Arquitecto + Negocio | Media |
| ASR-KG-07 | Acceso y límites de las API de Classroom, Drive, GitLab y docsuite | asr-BR-INT-02, asr-BR-IA-01 | Arquitecto | Media |
| ASR-KG-08 | Versionado del catálogo (P-02) y evento de asignación (P-05) | asr-BR-CAT-06, asr-US-014 | Jefe de Ingeniería / Responsable de producto | Media |

Evidencia nueva de este catálogo (sin archivo de candidato propio): EVD-2026-0042 (no hay volúmenes documentados; UNKNOWN), EVD-2026-0043 (uso interno, VIS-001:L29; FACT) y EVD-2026-0046 (WCAG 2.2 AA, AGENTS.md:L71; FACT).

## Human Validation

La disposición de cada candidato es **obligatoriamente humana**. Las sugerencias del agente no son decisiones.

| Candidato | Sugerencia del agente | Disposición (`CANDIDATE` / `REJECT` / `INVESTIGATE`) | Arquitecto | Fecha | Comentario |
|---|---|---|---|---|---|
| asr-BR-ACR-03 | CANDIDATE | Pendiente | | | |
| asr-BR-ACR-04 | CANDIDATE | Pendiente | | | |
| asr-BR-ACR-02 | INVESTIGATE | Pendiente | | | |
| asr-BR-TRA-01 | CANDIDATE | Pendiente | | | |
| asr-BR-IA-01 | INVESTIGATE | Pendiente | | | |
| asr-BR-IA-02 | CANDIDATE | Pendiente | | | |
| asr-BR-INT-02 | INVESTIGATE | Pendiente | | | |
| asr-BR-CAT-06 | INVESTIGATE | Pendiente | | | |
| asr-US-014 | CANDIDATE | Pendiente | | | |

**Decisiones registradas (2026-09-27):** [ADR-001](/knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) define la estructura: shell y microUIs en Angular, y BFF en Node.js intermediario con los microservicios. [ADR-002](/knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md) define la autenticación: Keycloak y PKCE en el BFF, y atiende en parte asr-BR-ACR-02. Ninguno cambia la disposición de los candidatos.

- [ ] El arquitecto revisó los candidatos y registró su disposición
- [ ] Se revisaron los candidatos descartados
- [ ] Los vacíos ASR-KG-01 a ASR-KG-04 tienen responsable y fecha
