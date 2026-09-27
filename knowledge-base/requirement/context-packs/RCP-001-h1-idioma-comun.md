---
type: Requirement Context Pack
title: "RCP-001 — H1 El idioma común"
description: "Contexto funcional mínimo y trazable del horizonte H1 de la Plataforma de Gestión de Formación: catálogo de competencias, requerimientos de proyecto, perfil con acreditación manual, brechas y búsqueda de personal."
tags: [context-pack, requirements, h1, catalogo, acreditacion, brechas]
status: draft
generated:
  by: "af-requirement-context-builder/1.0"
  at: "2026-09-26T20:49:19-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
---

# RCP-001 — H1 El idioma común

## 1. Metadata y pregunta de trabajo

- **Producto o proceso:** [Plataforma de Gestión de Formación del Recurso Humano](../../business/glossary/terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md) (uso interno de COMSATEL).
- **Iniciativa:** horizonte **H1 — El idioma común** ([VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md):L132).
- **Responsable funcional:** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md), dueño del catálogo (VIS-001:L51). El Responsable de producto tiene un papel por confirmar (P-06).
- **Fecha:** 2026-09-26.
- **Pregunta de trabajo:** ¿qué necesita saber el siguiente rol para especificar y diseñar H1 sin volver a descubrirlo? En concreto: actores, procesos, datos, reglas, dependencias y lo que sigue abierto.
- **Estado:** En validación.

## 2. Objetivo y alcance

### Objetivo de negocio

Que cada [proyecto](../../business/glossary/terms/TRM-0050-proyecto.md) de los 4 productos pueda declarar los roles, competencias y niveles que necesita, y encontrar colaboradores cuyo nivel en esas competencias está acreditado, medido contra un catálogo común.

Resultado observable: los KPI que H1 habilita (VIS-001:L132):
- **1 — Cobertura de roles:** porcentaje de roles requeridos por proyectos activos que se cubren con personal acreditado.
- **2 — Tiempo de asignación.**
- **3 — Cierre de brechas.**
- **6 — Adopción:** perfiles activos y proyectos con requerimientos registrados.

Las metas y la línea base todavía no existen (VIS-001:L152).

### Incluido

- Catálogo de roles, competencias y niveles requeridos por producto (capacidad 1).
- Requerimientos de proyecto (capacidad 3).
- Perfil de competencias con **acreditación manual** (capacidades 2 y 6).
- Brechas y búsqueda de personal (capacidad 4).
- Historias USC-001 que cubren esto: US-001 a US-008.

### Excluido

- Rutas de formación, Google Classroom, Google Drive y certificados de docsuite (H2).
- Agente de IA sobre GitLab y tablero de capacidad (H3).
- Lo que VIS-001 §7 declara fuera de alcance: hospedar cursos, verificación pública de certificados, evaluación salarial o de RR. HH. y gestión de proyectos.
- Diseño técnico, modelo de datos físico y APIs.

### Restricciones conocidas

- Ninguna acreditación ocurre sin firma humana (VIS-001:L81, L101; BR-ACR-04).
- Cada nivel acreditado se puede rastrear hasta sus evidencias y hasta quien lo acreditó (VIS-001:L103; BR-ACR-03).
- La escala es L1–L4 (VIS-001:L62-L69; BR-CAT-02).

## 3. Resumen ejecutivo del contexto

Hoy la asignación de personal depende del conocimiento informal de los líderes, porque no hay un catálogo común de roles y competencias por producto (VIS-001:L35). Esto es un **supuesto** validado en la sesión, sin evidencia documental.

H1 crea ese "idioma común". Sus piezas son cuatro:
- El Jefe de Ingeniería define el catálogo.
- Los Líderes de proyecto declaran qué necesitan sus proyectos.
- Los evaluadores acreditan niveles con evidencias.
- La plataforma calcula brechas (nivel requerido − nivel acreditado) y muestra candidatos.

VIS-001 pone H1 primero porque, sin catálogo, ni la formación (H2) ni la IA (H3) tienen contra qué medir (VIS-001:L136).

Las reglas del catálogo, la acreditación y el cálculo de brecha están sostenidas por la visión y ya tienen términos aprobados en el glosario. Quedan abiertos cinco puntos que bloquean parte de la especificación:
- La **evidencia mínima de cada nivel** (P-01).
- Cómo se **decide una asignación** (P-05).
- **Quién ve el perfil de otra persona** (P-08).
- **De dónde sale la lista de colaboradores** (VIS-001 §11.4).
- **Quiénes son los evaluadores** (RCP-Q1).

## 4. Registro de evidencia

### Inventario de fuentes

| ID | Fuente | Tipo | Fecha o versión | Permiso / alcance |
|---|---|---|---|---|
| S-01 | [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) | Knowledge Base (visión, `draft`) | 2026-09-26 | Interno; sesión con el responsable del producto |
| S-02 | [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) | Knowledge Base (reglas, `draft`) | 2026-09-26 | Derivado de S-01 |
| S-03 | [GLS-001](../../business/glossary/GLS-001-glosario-de-negocio.md) | Knowledge Base (glosario) | 2026-09-26; 59 de 65 términos `approved` | Derivado de S-01 y S-02 |
| S-04 | [USC-001](../USC-001-user-stories-plataforma-gestion-formacion.md) | Knowledge Base (User Stories, `draft`) | 2026-09-26 | Derivado de S-01 a S-03 |

No se consultaron GDrive, GitLab Issues ni fuentes externas: H1 no las necesita para su contexto funcional.

### Hallazgos

| ID | Hallazgo | Fuente y fragmento | Tipo | Confianza |
|---|---|---|---|---|
| E-01 | H1 abarca catálogo; requerimientos de proyecto; perfil con acreditación manual; brechas y búsqueda de personal. | S-01:L132 | Decisión humana | Alta |
| E-02 | El Jefe de Ingeniería es dueño del catálogo de los 4 productos. | S-01:L51, L162 | Decisión humana | Alta |
| E-03 | Modelo: Producto → Rol → Competencia → Nivel requerido; Colaborador → Competencia → Nivel acreditado ← Evidencia. | S-01:L56-L57 | Hecho | Media |
| E-04 | Escala L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto / Referente. | S-01:L62-L69 | Decisión humana | Alta |
| E-05 | Cada rol exige un nivel mínimo por competencia. | S-01:L71 | Hecho | Media |
| E-06 | Proyecto (de un Producto) → Requerimiento (Rol + Competencias + Nivel) → Asignación. | S-01:L58 | Hecho | Media |
| E-07 | Brecha = Nivel requerido − Nivel acreditado. | S-01:L59 | Hecho | Media |
| E-08 | Un evaluador revisa evidencias y acredita; se registra quién, cuándo y con qué evidencia. | S-01:L80 | Hecho | Media |
| E-09 | Ninguna acreditación sin firma humana. | S-01:L81, L101 | Decisión humana | Alta |
| E-10 | El colaborador ve su perfil y sus evidencias. | S-01:L104 | Hecho | Media |
| E-11 | La evidencia exigida por cada nivel está abierta. | S-01:L71, L150 | Vacío | Alta |
| E-12 | Cómo se decide una asignación está abierto. | S-01:L154 | Vacío | Alta |
| E-13 | Integrar el sistema de RR. HH. como fuente de la ficha del colaborador está abierto. | S-01:L153 | Vacío | Alta |
| E-14 | No existe un catálogo común hoy. | S-01:L35 ("Supuesto (validado en la sesión, falta evidencia documental)") | Supuesto | Media |
| E-15 | 59 términos del glosario aprobados; Proyecto activo, Responsable de producto y Sistema de RR. HH. siguen en `draft`. | S-03 | Decisión humana | Alta |
| E-16 | 8 historias de H1: 1 READY (US-004), 5 CONDITIONAL y 2 NOT READY (US-007, US-008). | S-04 | Hecho | Alta |

## 5. Hechos confirmados

Están respaldados por una fuente. Los que vienen de una decisión humana se listan en §10.

- **Catálogo:** se organiza por producto (CLocator, CLocator v2 / C-Go, SIGO, SmartSuite), con roles, competencias y un nivel mínimo L1–L4 por competencia (E-01 a E-05; BR-CAT-01 a BR-CAT-04).
- **Requerimientos:** cada requerimiento pertenece a un proyecto y cada proyecto a un producto. El Líder de proyecto declara rol, competencias y nivel (E-06; BR-REQ-01, BR-REQ-02).
- **Acreditación:**
  - En H1 es manual (E-01).
  - Un evaluador humano acredita con al menos una evidencia de formación, práctica evaluada o desempeño en proyecto.
  - Queda registro de quién acreditó, cuándo y con qué evidencia (E-08, E-09; BR-ACR-01 a BR-ACR-05).
- **Brecha:** se calcula por competencia como nivel requerido − nivel acreditado (E-07; BR-BRE-01).
- **Transparencia:** el colaborador ve su perfil y sus evidencias (E-10; BR-TRA-01).

## 6. Supuestos e hipótesis

| ID | Afirmación | Tipo | Origen | Qué la confirmaría |
|---|---|---|---|---|
| H-01 | Hoy no existe un catálogo común de roles y competencias. | Supuesto | S-01:L35 | Evidencia documental o confirmación del Jefe de Ingeniería |
| H-02 | Un requerimiento solo puede usar roles y competencias del catálogo de su producto. | Hipótesis (agente) | BR-REQ-03 | Respuesta a P-10 |
| H-03 | Los niveles L1–L4 se restan como números para calcular la brecha. | Hipótesis (agente) | BR-BRE-02 | Respuesta a P-12 |
| H-04 | El Líder de proyecto es quien asigna. | Hipótesis (agente) | US-007; S-01 solo dice que "encuentra personal" (L42) | Respuesta a P-05 |
| H-05 | Las brechas por producto las consulta el Jefe de Ingeniería o Dirección. | Hipótesis (agente) | US-008; S-01:L78 no nombra al actor | Respuesta a P-17 |
| H-06 | El Responsable de producto aporta conocimiento del catálogo sin gobernarlo. | Supuesto | S-01:L44 | Respuesta a P-06 |

## 7. Vacíos y preguntas abiertas

| ID | Pregunta | Destinatario | Prioridad | Estado |
|---|---|---|---|---|
| P-01 | ¿Qué evidencia mínima exige cada nivel L1–L4? | Negocio (Jefe de Ingeniería) | Alta | Abierta (BRC-001) |
| P-05 | ¿La plataforma solo recomienda y el Líder de proyecto decide, o hay un flujo de aprobación? | Negocio (Responsable de producto) | Alta | Abierta (BRC-001) |
| P-08 | ¿Quién puede ver el perfil y las evidencias de otro colaborador? | Negocio (Responsable de producto) | Alta | Abierta (BRC-001) |
| VIS-§11.4 | ¿De dónde sale la lista de colaboradores y sus datos básicos? ¿Se integra el sistema de RR. HH.? | Negocio + ARQ | Alta | Abierta (VIS-001) |
| RCP-Q1 | ¿Quiénes son los evaluadores de H1 y quién los designa? ¿Instructor y evaluador son el mismo rol (GQ-07)? | Negocio (Jefe de Ingeniería) | Alta | Nueva |
| P-02 | ¿Cómo se versiona el catálogo y qué pasa con requerimientos y acreditaciones vigentes cuando cambia? | Negocio (Jefe de Ingeniería) | Media | Abierta (BRC-001) |
| P-06 | ¿Qué papel tiene el Responsable de producto en el mantenimiento del catálogo? | Negocio (Jefe de Ingeniería) | Media | Abierta (BRC-001) |
| P-09 | ¿Qué parte de la acreditación hace Gestión de formación / RR. HH. y qué parte el evaluador? ¿El evaluador puede acreditar a su propio equipo? | Negocio | Media | Abierta (BRC-001) |
| P-10 | ¿Un requerimiento solo usa roles y competencias del catálogo de su producto? | Negocio (Jefe de Ingeniería) | Media | Abierta (BRC-001) |
| P-11 | ¿Qué estados tiene un proyecto y cuándo es "activo"? Lo necesitan el KPI 1 y la búsqueda. | Negocio (Responsable de producto) | Media | Abierta (BRC-001) |
| P-12 | ¿Cómo se trata la brecha sin nivel acreditado y la brecha negativa? | Negocio (Jefe de Ingeniería) | Media | Abierta (BRC-001) |
| P-15 | ¿Cómo declara el colaborador el rol al que aspira? | Negocio (Responsable de producto) | Media | Abierta (USC-001) |
| P-16 | ¿La búsqueda muestra también candidatos por debajo del nivel requerido? ¿Cómo se ordena? | Negocio (Responsable de producto) | Media | Abierta (USC-001) |
| P-17 | ¿Quién consulta las brechas agregadas por producto? | Negocio (Jefe de Ingeniería) | Media | Abierta (USC-001) |
| GQ-08 | ¿Qué es un "perfil activo"? Lo necesita el KPI 6. | Negocio (Responsable de producto) | Media | Abierta (GLS-001) |
| RCP-Q2 | En H1, sin el agente de IA, ¿un evaluador puede registrar a mano evidencia de GitLab (desempeño en proyecto)? | Negocio (Jefe de Ingeniería) | Media | Nueva |
| P-14 | ¿Una acreditación vence o puede revocarse? | Negocio (Jefe de Ingeniería) | Baja | Abierta (BRC-001) |

## 8. Actores, procesos, datos y dependencias

### Actores

| Actor | Papel en H1 | Evidencia | Historias |
|---|---|---|---|
| [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) | Define y gobierna el catálogo | S-01:L43, L51 | US-001 |
| [Responsable de producto](../../business/glossary/terms/TRM-0053-responsable-de-producto.md) | Aporta el conocimiento de los roles de su producto; papel exacto por confirmar | S-01:L44 (supuesto); término en `draft` | US-001 (indirecto) |
| [Líder de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md) (PM) | Declara requerimientos y busca candidatos | S-01:L42, L77 | US-002, US-006, US-007 (hipótesis) |
| [Evaluador](../../business/glossary/terms/TRM-0021-evaluador.md) | Revisa evidencias y acredita niveles | S-01:L46, L80 | US-003 |
| [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md) | Consulta su perfil y su brecha | S-01:L41, L104 | US-004, US-005 |
| [Gestión de formación / RR. HH.](../../business/glossary/terms/TRM-0027-gestion-de-formacion.md) | "Gestiona acreditaciones": no está claro qué hace frente al evaluador | S-01:L45; AMB-03 | — (P-09) |
| [Dirección / Gerencia](../../business/glossary/terms/TRM-0018-direccion.md) | Posible consumidor de brechas por producto (hipótesis H-05); su tablero es de H3 | S-01:L47 | US-008 (por confirmar) |

### Procesos y estados

| Proceso | Actor | Entradas | Resultado | Estados conocidos |
|---|---|---|---|---|
| Definir el catálogo | Jefe de Ingeniería | Productos, roles, competencias, nivel L1–L4 | Catálogo por producto | Sin estados definidos; versionado abierto (P-02) |
| Declarar requerimiento | Líder de proyecto | Proyecto, rol, competencias, nivel | Requerimiento del proyecto | Proyecto "activo" sin definir (P-11) |
| Acreditar nivel (manual) | Evaluador | Colaborador, competencia, evidencias | Nivel acreditado con registro de quién, cuándo y evidencia | Sin estados definidos; vencimiento o revocación abiertos (P-14) |
| Consultar perfil y brecha | Colaborador | Perfil, rol del catálogo | Niveles, evidencias y brecha por competencia | — |
| Buscar candidatos | Líder de proyecto | Requerimiento, perfiles | Candidatos que alcanzan el nivel | Criterios de la lista abiertos (P-16) |
| Asignar | Por confirmar (H-04) | Requerimiento, candidato | Asignación | **Sin definir** (P-05) |

### Datos relevantes (funcionales)

| Dato | Descripción | Término | Fuente |
|---|---|---|---|
| Producto | Uno de los 4 productos en alcance | [TRM-0047](../../business/glossary/terms/TRM-0047-producto.md) | S-01:L23 |
| Rol | Rol de un producto con sus competencias | [TRM-0055](../../business/glossary/terms/TRM-0055-rol.md) | S-01:L56 |
| Competencia | Competencia exigida por un rol | [TRM-0014](../../business/glossary/terms/TRM-0014-competencia.md) | S-01:L56 |
| Nivel requerido | L1–L4 mínimo por competencia de un rol | [TRM-0043](../../business/glossary/terms/TRM-0043-nivel-requerido.md) | S-01:L71 |
| Colaborador | Persona con perfil de competencias; su origen está abierto (VIS-§11.4) | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) | S-01:L57, L153 |
| Nivel acreditado | Nivel L1–L4 acreditado por competencia | [TRM-0042](../../business/glossary/terms/TRM-0042-nivel-acreditado.md) | S-01:L57 |
| Evidencia | Formación, práctica evaluada o desempeño en proyecto | [TRM-0022](../../business/glossary/terms/TRM-0022-evidencia.md) | S-01:L57, L71 |
| Registro de acreditación | Quién, cuándo y con qué evidencia | [TRM-0001](../../business/glossary/terms/TRM-0001-acreditacion.md) | S-01:L80 |
| Proyecto | Proyecto de un producto | [TRM-0050](../../business/glossary/terms/TRM-0050-proyecto.md) | S-01:L58 |
| Requerimiento | Rol + competencias + nivel de un proyecto | [TRM-0052](../../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) | S-01:L58 |
| Brecha | Nivel requerido − nivel acreditado | [TRM-0005](../../business/glossary/terms/TRM-0005-brecha.md) | S-01:L59 |
| Asignación | Vínculo entre un requerimiento y un colaborador | [TRM-0004](../../business/glossary/terms/TRM-0004-asignacion.md) | S-01:L58 |

**Datos personales:** el perfil de competencias y las evidencias son datos de una persona. La visibilidad para terceros no está definida (P-08). Hasta que se defina, el siguiente rol debe asumir el acceso mínimo: el colaborador ve lo suyo.

### Dependencias y consumidores

- **Orden funcional:** catálogo → requerimientos → búsqueda → asignación. La acreditación alimenta el perfil, la brecha y la búsqueda (S-01:L136; USC-001).
- **Consumidores de H1:**
  - H2 (las rutas de formación se generan a partir de la brecha, S-01:L79).
  - H3 (la IA propone niveles contra el catálogo, S-01:L81).
  - Los KPI 1, 2, 3 y 6.
- **Dependencia externa sin confirmar:** el sistema de RR. HH. como fuente de colaboradores (VIS-§11.4). Queda como vacío, no como dependencia.

## 9. Restricciones y riesgos funcionales

| Tipo | Descripción | Mitigación conocida | Fuente |
|---|---|---|---|
| Restricción | Sin firma humana no hay acreditación | — | S-01:L101 |
| Restricción | Trazabilidad de cada nivel hasta su evidencia y quien lo acreditó | — | S-01:L103 |
| Riesgo | Catálogo desactualizado o sin consenso entre productos | El Jefe de Ingeniería lo gobierna; falta el versionado (P-02) | S-01:L142 |
| Riesgo | Acreditaciones inconsistentes entre evaluadores si no hay evidencia mínima por nivel | Ninguna todavía (P-01) | Inferencia a partir de S-01:L150 |
| Riesgo | KPI 1 y 6 imposibles de medir mientras "proyecto activo" y "perfil activo" no estén definidos | Ninguna todavía (P-11, GQ-08) | S-01:L119, L124 |
| Riesgo | Exposición de datos de desempeño de personas | Acceso mínimo hasta resolver P-08 | S-01:L104; P-08 |

**Contradicciones y ambigüedades vigentes** (de BRC-001):
- **AMB-01:** formación como evidencia frente a certificado ≠ nivel. Afecta el tipo de evidencia "formación" en H1.
- **AMB-02:** la ausencia de catálogo está clasificada a la vez como supuesto y como validada.
- **AMB-03:** Gestión de formación / RR. HH. "gestiona acreditaciones", pero el que acredita es el evaluador.

## 10. Decisiones y validación humana

| Decisión o validación | Responsable | Evidencia | Fecha |
|---|---|---|---|
| Alcance de H1 y orden de horizontes | Responsable del producto (sesión de descubrimiento) | S-01:L128-L136 | 2026-09-26 |
| Dueño del catálogo: Jefe de Ingeniería | Responsable del producto | S-01:L162 | 2026-09-26 |
| Escala de niveles L1–L4 | Responsable del producto | S-01:L62 | 2026-09-26 |
| Aprobación de 59 términos del glosario | ianache (Jefe de Ingeniería) | S-03, `verified` por término | 2026-09-26 |
| Alcance de este pack: H1 | ianache | Elección en esta sesión | 2026-09-26 |
| **Validación de este pack** | Pendiente: Jefe de Ingeniería y Responsable de producto | — | — |

### Checklist de validación humana

- [ ] El objetivo describe un resultado de negocio y no una solución técnica.
- [ ] El alcance incluido y excluido está explícito.
- [ ] Las fuentes utilizadas son autorizadas y suficientes.
- [ ] Cada afirmación relevante tiene evidencia o está marcada como hipótesis.
- [ ] Hechos, supuestos, vacíos, hipótesis y decisiones humanas están separados.
- [ ] Los actores y procesos afectados están identificados.
- [ ] Los datos relevantes y sus dependencias están descritos.
- [ ] Las preguntas abiertas tienen destinatario y prioridad.
- [ ] Las contradicciones entre fuentes están visibles.
- [ ] El siguiente rol puede continuar sin repetir todo el descubrimiento.
- [ ] Los Knowledge Candidates tienen provenance y verificador.
- [ ] Una persona responsable aprobó el contenido o registró los pendientes.

- **Estado:** Aprobado / Aprobado con pendientes / No aprobado
- **Responsable:**
- **Fecha:**
- **Comentarios:**

## 11. Knowledge Candidates

Son propuestas para incorporar al conocimiento canónico. Ninguna es canónica hasta que su verificador la apruebe.

| Candidato | Provenance | Verificador | Estado |
|---|---|---|---|
| Regla: toda competencia de un rol tiene un nivel mínimo L1–L4 | S-01:L62-L71; BR-CAT-02, BR-CAT-03 | Jefe de Ingeniería | Pendiente |
| Regla: no existe acreditación automática; toda acreditación la firma un evaluador humano y queda registrada con quién, cuándo y evidencias | S-01:L80-L81, L101, L103; BR-ACR-02 a BR-ACR-04 | Jefe de Ingeniería | Pendiente |
| Regla: la brecha se calcula por competencia como nivel requerido − nivel acreditado | S-01:L59; BR-BRE-01 | Jefe de Ingeniería | Pendiente (depende de P-12) |
| Proceso: orden funcional catálogo → requerimiento → búsqueda → asignación | S-01:L58, L136 | Responsable de producto | Pendiente (la asignación depende de P-05) |
| Supuesto H-01: hoy no hay catálogo común | S-01:L35 | Jefe de Ingeniería | Pendiente de evidencia documental |

## 12. Handoff para el siguiente rol

### Qué puede usar el siguiente rol

- Para **`ux-requirements-analyzer` (UX-101)**, derivar UXR de:
  - US-004, que está READY.
  - US-001, US-002, US-003, US-005 y US-006, que están CONDITIONAL. En cada UXR hay que citar el vacío que la condiciona.
- Actores, procesos, datos y reglas de las §5 y §8, con su evidencia.
- El vocabulario de GLS-001: usar los términos aprobados tal como están definidos.

### Qué debe validar antes de continuar

- Las preguntas de prioridad alta: P-01, P-05, P-08, VIS-§11.4 y RCP-Q1.
- La validación humana de este pack (§10).
- No derivar UXR ni flujos para US-007 (asignación) ni US-008 (brechas por producto) hasta resolver P-05 y P-17.

### Artefactos relacionados

- [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) · [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) · [GLS-001](../../business/glossary/GLS-001-glosario-de-negocio.md) · [USC-001](../USC-001-user-stories-plataforma-gestion-formacion.md)
