---
type: Business Context Pack
title: "BCP-001 — Business Context Pack: Plataforma de Gestión de Formación"
description: "Contexto completo de negocio de la iniciativa de Gestión de Formación del Recurso Humano: propuesta de valor, stakeholders, objetivos, capacidades, restricciones y roadmap."
tags: [business-context-pack, formacion, competencias, rrhh, ia, horizontes]
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:00:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    date: "2026-09-26"
    type: Product Vision
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
    date: "2026-09-27"
    type: Requirement Context Pack
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
    date: "2026-09-27"
    type: Requirement Context Pack
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    date: "2026-09-27"
    type: Business Rules
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
    date: "2026-09-26"
    type: Business Glossary
---

# BCP-001 — Business Context Pack: Plataforma de Gestión de Formación

## 1. Propuesta de Valor y Visión

### Declaración de Visión

> **Que cada proyecto de CLocator (v1), CLocator v2 (C-Go), SIGO y SmartSuite cuente, en el momento en que lo necesita, con colaboradores cuyo dominio de las competencias requeridas por su rol esté certificado con evidencia verificable, tanto de formación como de trabajo real.**

**Propuesta de Valor:** La plataforma es el **puente entre lo que piden los proyectos y lo que las personas demuestran saber hacer**. Conecta:
- La demanda de competencias de los 4 productos
- La oferta de colaboradores formados y certificados
- La evidencia verificable (formación + práctica real en GitLab)

### Contexto y Problema

| Aspecto | Hecho / Decisión |
|---------|------------------|
| **Plataforma** | Interna de COMSATEL |
| **Problema actual** | No existe un catálogo común de roles y competencias. La asignación de personal depende del conocimiento informal de líderes, no de brechas medibles. |
| **Alcance inicial** | 4 productos: CLocator, CLocator v2 (C-Go), SIGO, SmartSuite |
| **Enfoque de integración** | La plataforma integra y orquesta herramientas existentes; no hospeda contenido |
| **Materiales del curso** | Google Drive; Cursos en Google Classroom (solo lectura) |
| **Evidencia de desempeño** | GitLab (issues, tareas, bugs, milestones, MRs) — uso interno |
| **Certificados de curso** | docsuite (API REST) |

### Principios de Producto

1. **Integrar, no hospedar:** La plataforma no reconstruye un LMS ni un repositorio documental.
2. **Human-in-the-loop:** Ninguna certificación ocurre sin firma humana. La IA propone y justifica, pero no decide.
3. **Evidencia sobre volumen:** Cuántos issues cierra alguien no prueba dominio. La calidad y el contexto pesan más.
4. **Trazabilidad:** Cada nivel certificado se puede rastrear hasta sus evidencias y hasta quién lo certificó.
5. **Transparencia:** Cada persona ve su perfil, sus evidencias y las propuestas de la IA sobre ella.

---

## 2. Stakeholders y Actores

### Matriz de Stakeholders

| Actor | Valor Principal | Responsabilidad | Rol en la Plataforma |
|-------|-----------------|-----------------|----------------------|
| **Colaborador** | Sabe qué nivel tiene, qué le falta para el rol que aspira y qué ruta seguir. | Participar en formación; evidenciar desempeño. | Usuario consultor: ve su perfil, brechas, propuestas de IA. |
| **Jefe de Proyecto (PM)** | Declara lo que su proyecto requiere; encuentra personal certificado rápido. | Definir requerimientos; validar candidatos. | Usuario creador y consultor: crea requerimientos, busca candidatos, consulta brechas. |
| **Jefe de Ingeniería** | Es dueño del catálogo de roles y competencias de los 4 productos; responsable de la capacitación de todo el equipo. | Gobernar el catálogo; definir requisitos de evidencia; aprobar certificaciones. | Administrador: gestiona catálogo, define competencias, aprueba niveles. |
| **Responsable de Producto** | Aporta el conocimiento de los roles y competencias de su producto. | Validar roles y competencias de su producto. | Usuario consultor (papel por confirmar). |
| **Gestión de Formación / RR. HH.** | Diseña programas; gestiona certificaciones; emite certificados de curso. | Gestionar cursos; certificar aprobación. | Usuario creador: registra cursos, certificados. |
| **Instructor / Evaluador** | Evalúa evidencias; valida o rechaza propuestas de la IA. | Revisar y certificar niveles. | Usuario evaluador: aprueba/rechaza certificaciones. |
| **Dirección / Gerencia** | Ve la capacidad frente a la demanda y los riesgos de cobertura por producto. | Monitorear capacidad; identificar riesgos. | Usuario consultor: accede a tableros de capacidad (H3). |
| **ADMIN** | Soporte operacional de la plataforma. | Mantener integridad de datos; soporte a usuarios. | Administrador de sistemas. |

**Decisión:** Los 7 actores de la tabla forman parte del alcance de la visión.

---

## 3. Objetivos de Negocio y Métricas de Éxito

### Objetivos por Horizonte

#### **H1 — El Idioma Común**

**Objetivo:** Establecer un catálogo común de roles y competencias que permita medir brechas y asignar personal de forma objetiva.

**Resultado observable:** 
- Los proyectos declaran requerimientos contra un catálogo conocido.
- Se calcula automáticamente la brecha de cada candidato.
- La asignación es trazable y basada en evidencia.

**KPIs Habilitados en H1:**
- **KPI 1 — Cobertura de roles:** Porcentaje de roles requeridos por proyectos activos que se cubren con personal certificado al nivel exigido.
- **KPI 2 — Tiempo de asignación:** Días entre que un proyecto pide un perfil y se asigna a alguien preparado.
- **KPI 3 — Cierre de brechas:** Reducción de la brecha promedio (nivel requerido − nivel certificado) por colaborador y por producto.
- **KPI 6 — Adopción:** Porcentaje de colaboradores con perfil activo y porcentaje de proyectos con requerimientos registrados.

#### **H2 — Formación Integrada**

**Objetivo:** Vincular cursos y evidencia de Classroom/Drive con la certificación de competencias.

**KPIs Adicionales:**
- **KPI 4 — Tiempo a competencia:** Tiempo que tarda un colaborador en pasar de un nivel al siguiente.

#### **H3 — Evidencia Real con IA**

**Objetivo:** Automatizar la propuesta de niveles basada en evidencia real de GitLab; tablero de capacidad vs. demanda.

**KPIs Adicionales:**
- **KPI 5 — Evidencia real:** Porcentaje de certificaciones de L3 o superior respaldadas por evidencia de GitLab.

### Escala de Niveles de Dominio

| Nivel | Nombre | Descripción |
|-------|--------|-------------|
| **L1** | Principiante | Conocimiento básico; requiere supervisión. |
| **L2** | Autónomo | Desempeño independiente en tareas estándar. |
| **L3** | Avanzado | Soluciona problemas complejos; lidera áreas específicas. |
| **L4** | Experto / Referente | Es referencia en el tema; define estándares. |

---

## 4. Modelo Conceptual de Datos

### Estructura Principal

```
Producto → Rol → Competencia → Nivel requerido
         ↓
Colaborador → Competencia → Nivel certificado ← Evidencia (formación | práctica | GitLab)

Proyecto (de un Producto) → Requerimiento (Rol + Competencias + Nivel) → Asignación

Brecha = Nivel requerido − Nivel certificado
```

### Entidades Clave

| Entidad | Significado | Notas |
|---------|------------|-------|
| **Producto** | CLocator, CLocator v2 (C-Go), SIGO, SmartSuite | Contexto de los 4 productos |
| **Rol** | Analista funcional, Developer, QA, BI, UX/UI, PM, etc. | Independiente de producto; transversal. |
| **Rol-Nivel** | Developer Junior (Nivel 1), Developer Senior (Nivel 2), etc. | Cada rol define sus propios niveles. |
| **Competencia** | Habilidad específica (Pruebas unitarias, Diseño de BD, etc.) | Catálogo único; usada en varios roles. |
| **Nivel Certificado** | L1–L4 certificado de un colaborador en una competencia | Respalda

do por evidencia; auditable. |
| **Brecha** | Nivel requerido − Nivel certificado | Se calcula por competencia. |
| **Proyecto** | Instancia de trabajo dentro de un producto | Declara requerimientos. |
| **Requerimiento** | Rol-Nivel + Competencias + Niveles específicos de un proyecto | Define qué necesita un proyecto. |
| **Asignación** | Vínculo entre Colaborador y Requerimiento | Trazable; puede ser bajo nivel (con aviso). |
| **Evidencia** | Formación (curso aprobado), Práctica (evaluación), Desempeño (GitLab) | Concreta (ej. un curso específico, un issue resuelto). |
| **Certificación** | Registro de quién certificó, cuándo y con qué evidencia | Auditable; obligatoriamente con firma humana. |

---

## 5. Capacidades de Negocio

| # | Capacidad | Descripción | Horizonte |
|---|-----------|-------------|-----------|
| 1 | **Catálogo de competencias** | Roles, competencias y niveles requeridos por producto, gobernado por el Jefe de Ingeniería. | H1 |
| 2 | **Perfil de competencias** | Nivel certificado por competencia, historial y evidencias del colaborador. | H1 |
| 3 | **Requerimientos de proyecto** | El PM declara los roles, competencias y niveles que necesita. | H1 |
| 4 | **Brechas y búsqueda de personal** | Calce entre persona y rol; candidatos por requerimiento; brechas individuales. | H1 |
| 5 | **Rutas de formación** | Se generan a partir de la brecha; vinculadas con cursos de Classroom y Drive. | H2 |
| 6 | **Certificación** | Evaluador revisa evidencias y certifica nivel. Todo registrado: quién, cuándo, evidencia. | H1 |
| 7 | **Evidencia de GitLab asistida por IA** | Agente analiza issues, MRs, milestones; propone nivel con justificación. Humano aprueba/rechaza. | H3 |
| 8 | **Certificados de curso** | Se certifica aprobación del curso final; docsuite genera PDF; plataforma guarda referencia. | H2 |
| 9 | **Tablero de capacidad** | Capacidad frente a demanda por producto; riesgos de cobertura; KPI. | H3 |

---

## 6. Restricciones Clave

### Restricciones de Negocio

| ID | Restricción | Fuente | Impacto |
|----|-------------|--------|--------|
| **RCON-001** | Ninguna certificación ocurre sin firma humana. La IA propone pero no decide. | VIS-001, BR-ACR-04 | Requiere workflow de aprobación humana obligatoria. |
| **RCON-002** | Cada nivel certificado es trazable hasta sus evidencias y quién lo certificó. | VIS-001, BR-ACR-03 | Requiere auditoría completa de certificaciones. |
| **RCON-003** | La plataforma **integra**, no hospeda contenido de cursos. | VIS-001:L100 | Las integraciones con Classroom y Drive son de solo lectura. |
| **RCON-004** | Catálogo único y común a los 4 productos; roles y competencias no pertenecen a un producto. | VIS-001:L51, BR-CAT-07/08 | Requiere gobernanza central del Jefe de Ingeniería. |
| **RCON-005** | La plataforma es el sistema de registro de información maestra de colaboradores. | SPEC-001 D2 | No hay integración con RR. HH.; altas/bajas se hacen en la plataforma. |
| **RCON-006** | Las credenciales y secretos se guardan en HashiCorp Vault. | SPEC-001 D22 | Integración obligatoria con Vault; cumplimiento de seguridad. |
| **RCON-007** | Escala de niveles: L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto / Referente. | VIS-001:L62-69, BR-CAT-02 | Fija; no personalizable por producto. |
| **RCON-008** | Los datos personales (PII) se anonimizan cuando una persona se va; no se borran. | SPEC-001 D14, BR-PTY-14 | Requiere proceso de anonimización programable. |

### Restricciones Técnicas (Derivadas)

| ID | Restricción | Impacto |
|----|-------------|--------|
| **TCON-001** | Autenticación OAuth 2.0 + PKCE via Keycloak | ADR-002 |
| **TCON-002** | Persistencia: MySQL 8.0+ y PostgreSQL (portable). | ADR-003 |
| **TCON-003** | BFF en Node.js; Shell en Angular; MicroUIs para cada flujo principal. | ADR-001 |

---

## 7. Riesgos y Mitigación

| ID | Riesgo | Probabilidad | Impacto | Mitigación Propuesta |
|----|--------|-------------|--------|----------------------|
| **RISK-001** | Catálogo desactualizado o sin consenso entre productos. | Media | Alto | El Jefe de Ingeniería gobierna; versioning del catálogo por definir (P-02). |
| **RISK-002** | El análisis de GitLab se perciba como vigilancia. | Media | Medio | Transparencia al colaborador; evidencia de uso interno; comunicación clara. |
| **RISK-003** | Fallo de integración con Google Classroom. | Baja | Alto | Contingencia: evaluar gestión propia de material y progreso (VIS-001:§6). |
| **RISK-004** | Sesgo de la IA: premiar volumen o ciertos tipos de issue. | Baja | Medio | Firma humana obligatoria; justificación trazable en cada propuesta (BR-IA-01 a BR-IA-04). |
| **RISK-005** | Datos pobres en GitLab: etiquetas o asignaciones inconsistentes. | Media | Medio | Convenciones mínimas de etiquetado por producto (a definir en H3). |
| **RISK-006** | Resistencia a adoptar catálogo común en productos con culturas distintas. | Media | Alto | Validación del Jefe de Ingeniería con responsables de producto; comunicación. |
| **RISK-007** | Capacidad limitada del equipo para mantener catálogo y reglas de evidencia. | Media | Medio | Definir proceso claro y progresivo (BR-CAT-16/17); documentación. |

---

## 8. Supuestos y Preguntas Abiertas

### Supuestos Confirmados

| ID | Supuesto | Validación | Confianza |
|----|----------|-----------|----------|
| **SUP-001** | Hoy no existe un catálogo común de roles y competencias. | Sesión con Jefe de Ingeniería (2026-09-26); falta evidencia documental. | Media |
| **SUP-002** | Los niveles L1–L4 se restan como números para calcular brecha. | Derivado de modelo; por confirmar en ejecución. | Media |
| **SUP-003** | El Responsable de producto aporta conocimiento sin gobernar catálogo. | VIS-001:L44; papel exacto por confirmar. | Media |

### Preguntas Abiertas (Bloqueantes y No Bloqueantes)

| ID | Pregunta | Impacto | Estado | Propietario |
|----|---------|---------|----|--------|
| **P-01** | ¿Qué evidencia mínima exige cada nivel L1–L4? | Bloqueante | Respondida en lo esencial (BR-ACR-07) | Jefe de Ingeniería |
| **P-02** | ¿Cómo se versiona el catálogo de competencias? | Bloqueante | Abierta | Jefe de Ingeniería |
| **P-05** | ¿Quién asigna: Jefe de Proyecto o Jefe de Ingeniería? | Bloqueante | Respondida (2026-09-27): Jefe de Ingeniería o ADMIN (BR-REQ-04) | — |
| **P-06** | ¿Papel exacto del Responsable de Producto? | No bloqueante | Abierta | Jefe de Ingeniería |
| **P-08** | ¿Quién ve el perfil de otra persona? | Bloqueante | Respondida (2026-09-27): BR-TRA-03 a BR-TRA-06 | — |
| **P-21** | ¿Detalles de evidencia por competencia y nivel? | Bloqueante | Parcialmente respondida (BR-ACR-08 define concretitud) | Jefe de Ingeniería |
| **P-25** | ¿Indicadores de nivel de rol en requerimientos? | Bloqueante | Respondida (BR-REQ-08): sí, "Developer Senior Nivel 2" | — |
| **P-52** | ¿Acceso granular a propuestas de IA según rol? | No bloqueante | Respondida (BR-IA-04) | — |
| **RCP-Q1** | ¿Quiénes son los evaluadores exactamente? | Bloqueante | Abierta | Jefe de Ingeniería |

---

## 9. Roadmap: Horizontes H1, H2, H3

### Estrategia de Ejecución

> **"Sin un catálogo acordado, ni la formación ni la IA tienen contra qué medir."**
>
> Por eso empezamos por la demanda (H1 — El idioma común).

### H1 — El Idioma Común (Actual)

**Plazo estimado:** Q4 2026 — Q1 2027  
**Objetivo:** Establecer el catálogo y la certificación manual.

**Alcance:**
- Catálogo de roles, competencias, niveles (único, común a 4 productos)
- Requerimientos de proyecto
- Perfil de competencias con certificación **manual**
- Cálculo de brechas
- Búsqueda de candidatos
- Rastreabilidad: quién certificó, cuándo, con qué evidencia

**Capacidades Habilitadas:** 1, 2, 3, 4, 6  
**KPIs Medibles:** 1, 2, 3, 6  
**Historias:** US-001 a US-008 (en draft, con dependencias de P-05, P-08, P-21)

**Decisiones Clave:**
- ✅ Jefe de Ingeniería es dueño del catálogo.
- ✅ Catálogo común a los 4 productos.
- ✅ Certificación solo con firma humana.
- ✅ Integración con Classroom: solo lectura.

**Preguntas por Resolver:**
- P-02: Cómo versionar el catálogo.
- P-06: Papel del Responsable de Producto.
- RCP-Q1: Quiénes son los evaluadores exactamente.

---

### H2 — Formación Integrada

**Plazo estimado:** Q1 2027 — Q2 2027  
**Objetivo:** Vincular cursos y evidencia de formación con certificación.

**Alcance Incremental:**
- Rutas de formación generadas automáticamente a partir de brechas
- Integración con Google Classroom: lectura de cursos, tareas, calificaciones
- Integración con Google Drive: enlaces a materiales
- Certificados de curso generados vía docsuite (API REST)
- Relación entre certificado de curso y certificación de competencia (P-07)

**Capacidades Habilitadas:** 5, 8 (además de 1–4, 6 de H1)  
**KPIs Medibles:** 1, 2, 3, **4**, 6  
**Historias:** US-009 a US-014 (por derivar)

**Decisiones Clave:**
- Integración no es hospedaje; Drive y Classroom quedan en su lugar.
- Contingencia: si falla Classroom, evaluar gestión propia de material (post-H2).

---

### H3 — Evidencia Real con IA

**Plazo estimado:** Q2 2027 — Q3 2027  
**Objetivo:** Automatizar propuestas de nivel basadas en evidencia real de GitLab; tablero de capacidad.

**Alcance Incremental:**
- Agente de IA que analiza GitLab (issues, MRs, milestones)
- Propone nivel de competencia con justificación trazable
- Evaluador aprueba/rechaza; firma humana obligatoria
- Tablero de capacidad: cobertura vs. demanda por producto
- KPI 5: Porcentaje de certificaciones L3+ respaldadas por GitLab

**Capacidades Habilitadas:** 7, 9 (además de 1–6, 8 de H1–H2)  
**KPIs Medibles:** 1, 2, 3, **4, 5**, 6  
**Historias:** US-025 a US-030 (por derivar)

**Decisiones Clave:**
- ✅ Ninguna certificación sin firma humana.
- ✅ Evidencia de GitLab es interna; acceso según control de repo.
- ✅ Calidad y contexto pesan más que volumen de issues.

**Convenciones por Definir:**
- Etiquetado mínimo de issues por producto (competencia, nivel esperado).

---

## 10. Lineage y Consumidores

### E2E Lineage

```
Business Objective (BO-*)
    ↓
Requirements Context Pack (RCP-*)
    ↓
User Stories (US-*, UXR-*)
    ↓
UX Flows & Screens
    ↓
Components & Tokens
    ↓
Acceptance Criteria & ASR / ADR
    ↓
Implementation
    ↓
Test Evidence
    ↓
Business Outcome (medido en KPIs)
```

### Consumidores de Este Pack

- **AF-101** → Deriva Requirements Context Pack (RCP-001, RCP-002, ...)
- **UX-101** → Deriva UX Context Pack (flujos, personas, necesidades)
- **ARQ-101** → Deriva Architecture Context Pack (ACP-001)

---

## 11. Definición de Éxito (BUSINESS_CONTEXT_READY)

✅ **Propuesta de valor clara:** El puente entre demanda (qué piden los proyectos) y oferta (qué demuestran los colaboradores).

✅ **Stakeholders identificados:** 7 actores con roles y responsabilidades claras.

✅ **Modelo conceptual establecido:** Producto → Rol → Competencia → Nivel; Colaborador → Competencia → Nivel certificado ← Evidencia.

✅ **Objetivos y KPIs definidos:** 6 KPIs, escalados por horizonte (H1, H2, H3).

✅ **Capacidades de negocio mapeadas:** 9 capacidades, ordenadas por horizonte.

✅ **Restricciones y riesgos catalogados:** 8 restricciones de negocio + 5 técnicas; 7 riesgos con mitigación.

✅ **Supuestos y preguntas visibles:** Supuestos confirmados; 9 preguntas abiertas, algunas bloqueantes, con propietario.

✅ **Roadmap articulado:** H1 (catálogo + certificación), H2 (formación), H3 (IA + tableros).

✅ **Provenance trazable:** Cada decisión vinculada a fuentes (VIS-001, RCP-001, BRC-001, SPEC-001).

---

## 12. Próximos Pasos

### Inmediatos (Antes de Iniciar AF-101)

1. **Validación humana de este pack** por el Jefe de Ingeniería y Responsable de Producto.
2. **Resolver preguntas bloqueantes:**
   - P-02: Estrategia de versionado del catálogo.
   - RCP-Q1: Identificación exacta de evaluadores.
3. **Derivar Requirements Context Pack (RCP-001)** para H1 en detalle funcional.

### Fase H1

1. Especificar Catálogo de Competencias (User Stories US-001 a US-008).
2. Definir Requisitos de Evidencia por Competencia/Nivel (matriz).
3. Diseñar UX para Jefe de Ingeniería, PM y Evaluador.
4. Implementar BFF + persistencia (MySQL + PostgreSQL).
5. Integración con Keycloak y HashiCorp Vault.

### Fase H2

1. Integración con Google Classroom (API de lectura).
2. Integración con docsuite (API de generación de certificados).
3. Rutas de formación automáticas.

### Fase H3

1. Agente de IA sobre GitLab (análisis y propuestas de nivel).
2. Tablero de capacidad vs. demanda.
3. Métricas en tiempo real (KPI 5).

---

## Apéndice: Referencias Cruzadas a Conceptos OKF

| Concepto OKF | Documentos Generados | Identificador |
|--------------|---------------------|---------------|
| Business Objective | BO-CATALOG, BO-MATCH, BO-TRANSPARENCY | [Por generar] |
| Stakeholder | STK-CHIEF-ENG, STK-PM, STK-COLLABORATOR, ... | [Por generar] |
| Business Capability | BC-CATALOG-MGMT, BC-MATCHING, BC-CERTIFICATION, ... | [Por generar] |
| Business Constraint | BCON-HUMAN-APPROVAL, BCON-COMMON-CATALOG, ... | [Por generar] |
| Business Risk | BRISK-CATALOG-DRIFT, BRISK-GITLAB-PERCEPTION, ... | [Por generar] |
| Business Assumption | BAS-NO-COMMON-CATALOG, BAS-NUMERIC-SCALE, ... | [Por generar] |
| Open Question | BOQ-VERSIONING, BOQ-EVALUATORS, ... | [Por generar] |

---

**Documento Generado:** 2026-09-29  
**Estado:** Draft (Pendiente validación humana)  
**Responsable de Validación:** Jefe de Ingeniería (ianache@COMSATEL)  
**Fecha de Validación Esperada:** 2026-10-05
