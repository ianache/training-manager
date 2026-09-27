---
type: Product Vision
title: "VIS-001 — Plataforma de Gestión de Formación del Recurso Humano"
description: "Visión de producto de la plataforma interna que conecta los requerimientos de competencias de los proyectos de CLocator, C-Go, SIGO y SmartSuite con colaboradores formados y certificados por niveles de dominio."
tags: [vision, formacion, competencias, rrhh, asignacion, gitlab, ia]
status: draft
generated:
  by: "superpowers-brainstorming/6.4.1"
  at: "2026-09-26T22:05:37-05:00"
sources:
  - id: repository-guidelines
    resource: /AGENTS.md
  - id: training-pack
    resource: /README.md
---

# VIS-001 — Plataforma de Gestión de Formación del Recurso Humano

> **Procedencia:** esta visión se construyó en una sesión de descubrimiento con el responsable del producto (2026-09-26). Las afirmaciones se clasifican como **Hecho** (lo dijo el responsable), **Decisión** (el responsable la tomó en la sesión), **Supuesto** (falta validarlo) o **Pregunta abierta**. La verificación humana del documento está pendiente.

## 1. Declaración de visión

> Que cada proyecto de **CLocator (v1)**, **CLocator v2 (C-Go)**, **SIGO** y **SmartSuite** cuente, en el momento en que lo necesita, con colaboradores cuyo dominio de las competencias requeridas por su rol esté certificado con evidencia verificable, tanto de formación como de trabajo real.

**Propuesta de valor:** es el puente entre lo que piden los proyectos y lo que las personas demuestran saber hacer.

## 2. Contexto y problema

- **Hecho:** la plataforma es de uso **interno** de COMSATEL.
- **Hecho:** el Programa de Formación de Competencias busca que los colaboradores participen de forma efectiva y eficaz en distintos roles dentro de los proyectos de los 4 productos.
- **Decisión:** el resultado principal combina dos cosas: la **preparación por rol** (brecha y ruta de formación) y la **asignación a proyectos** según los requerimientos de competencias de cada proyecto.
- **Hecho:** el material de los cursos está en **Google Drive** y los cursos se dictan en **Google Classroom**.
- **Hecho:** los colaboradores trabajan en **GitLab** (issues, tareas, bugs, milestones). Hoy esa actividad no alimenta la evaluación de competencias.
- **Hecho:** existe la plataforma **docsuite**, que diseña plantillas de certificado de curso, genera PDF por API REST y los guarda en un repositorio propio.
- **Supuesto (validado en la sesión, falta evidencia documental):** no existe un catálogo común de roles y competencias por producto. Por eso, asignar personal depende del conocimiento informal de los líderes y no de brechas medibles.

## 3. Usuarios

| Actor | Valor principal |
|---|---|
| Colaborador | Sabe qué nivel tiene, qué le falta para el rol al que aspira y qué ruta seguir. |
| Jefe de proyecto / PM | Declara lo que su proyecto requiere y encuentra personal certificado. |
| Jefe de Ingeniería | Es dueño del catálogo de roles y competencias de los 4 productos y responsable de la capacitación de todo el equipo. |
| Responsable de producto | Aporta el conocimiento de los roles y competencias de su producto (Supuesto: su rol exacto frente al Jefe de Ingeniería está por confirmar). |
| Gestión de formación / RR. HH. | Diseña programas, gestiona certificaciones y emite certificados de curso. |
| Instructor / evaluador | Evalúa evidencias y valida o rechaza las propuestas de la IA. |
| Dirección / Gerencia | Ve la capacidad frente a la demanda y los riesgos de cobertura por producto. |

**Decisión:** los 7 actores de la tabla forman parte del alcance de la visión.

**Decisión:** el **Jefe de Ingeniería** es el dueño del catálogo de roles y competencias de cada producto, porque tiene la responsabilidad de la capacitación de todo el equipo.

## 4. Modelo conceptual

```
Producto → Rol → Competencia → Nivel requerido
Colaborador → Competencia → Nivel certificado ← Evidencia (formación | práctica | GitLab)
Proyecto (de un Producto) → Requerimiento (Rol + Competencias + Nivel) → Asignación
Brecha = Nivel requerido − Nivel certificado
```

### Escala de niveles de dominio (Decisión)

| Nivel | Nombre |
|---|---|
| L1 | Principiante |
| L2 | Autónomo |
| L3 | Avanzado |
| L4 | Experto / Referente |

Cada rol exige un nivel mínimo por competencia. Cada nivel se certifica con evidencia de distinto tipo: formación, práctica evaluada o desempeño en proyecto. Qué evidencia exige cada nivel es una pregunta abierta (§11).

## 5. Capacidades del producto

1. **Catálogo de competencias:** roles, competencias y niveles requeridos por producto, gobernado por el Jefe de Ingeniería.
2. **Perfil de competencias del colaborador:** nivel certificado por competencia, historial y evidencias.
3. **Requerimientos de proyecto:** el PM declara los roles, las competencias y los niveles que necesita.
4. **Brechas y búsqueda de personal:** calce entre persona y rol, candidatos por requerimiento y brechas individuales o por producto.
5. **Rutas de formación:** se generan a partir de la brecha y se vinculan con cursos de Classroom y material de Drive.
6. **Certificación:** un evaluador revisa las evidencias y certifica el nivel. Todo queda registrado: quién, cuándo y con qué evidencia.
7. **Evidencia de GitLab asistida por IA (Decisión):** un agente analiza issues, MRs y milestones, los asocia a las competencias del rol y **propone** un nivel con su justificación. Un humano aprueba, ajusta o rechaza. Nada se certifica sin firma humana.
8. **Certificados de curso (Decisión):** se certifica la **aprobación del curso final**, según el cumplimiento de los objetivos del curso. La plataforma pide el PDF a docsuite por API REST y guarda la referencia. El certificado de curso no equivale a un nivel certificado: el nivel se certifica aparte, con sus evidencias (capacidad 6). El uso es interno y no hay verificación pública.
9. **Tablero de capacidad:** capacidad frente a demanda por producto, riesgos de cobertura y KPI.

## 6. Integraciones

**Decisión:** la plataforma **integra y orquesta**, no hospeda contenido. Ofrece una experiencia unificada sobre las herramientas que ya existen.

**Decisión (contingencia):** si la integración con Google Classroom presenta problemas, se evaluará dotar a la plataforma de capacidades propias para gestionar el material del curso, visualizarlo y controlar el progreso del colaborador en cada lección y evaluación. Esa evaluación sería una decisión posterior, no parte del alcance actual.

| Sistema | Rol | Dirección |
|---|---|---|
| Google Classroom | Cursos, tareas y calificaciones | Solo lectura (Decisión) |
| Google Drive | Material de los cursos | Enlace y lectura |
| GitLab | Evidencia de desempeño real (issues, tareas, bugs, milestones, MRs) | Lectura; uso interno (Decisión) |
| docsuite | Plantillas, generación de PDF y repositorio de certificados de curso | API REST |

## 7. Principios de producto

- **Integrar, no hospedar:** la plataforma no reconstruye un LMS ni un repositorio documental.
- **Human-in-the-loop:** ninguna certificación ocurre sin firma humana. La IA propone y justifica, pero no decide.
- **Evidencia sobre volumen:** cuántos issues cierra alguien no prueba dominio. La calidad y el contexto pesan más.
- **Trazabilidad:** cada nivel certificado se puede rastrear hasta sus evidencias y hasta quien lo certificó.
- **Transparencia para el colaborador:** cada persona ve su perfil, sus evidencias y las propuestas de la IA sobre ella.

### Fuera de alcance

- Hospedar contenido de cursos (se queda en Drive y Classroom), salvo que se active la contingencia de §6.
- Verificación pública de certificados de curso.
- Evaluación de desempeño salarial o de RR. HH.
- Gestión de proyectos (ya la cubre GitLab).

## 8. Indicadores de éxito

**Decisión:** se adoptan los 6 KPI. Las metas numéricas y la línea base están pendientes (§11).

| # | KPI | Definición |
|---|---|---|
| 1 | Cobertura de roles | Porcentaje de roles requeridos por proyectos activos que se cubren con personal certificado al nivel exigido. |
| 2 | Tiempo de asignación | Días entre que un proyecto pide un perfil y se asigna a alguien preparado. |
| 3 | Cierre de brechas | Reducción de la brecha promedio (nivel requerido − nivel certificado) por colaborador y por producto. |
| 4 | Tiempo a competencia | Tiempo que tarda un colaborador en pasar de un nivel al siguiente. |
| 5 | Evidencia real | Porcentaje de certificaciones de L3 o superior respaldadas por evidencia de GitLab. |
| 6 | Adopción | Porcentaje de colaboradores con perfil activo y porcentaje de proyectos con requerimientos registrados. |

## 9. Horizontes

**Decisión:** la estrategia empieza por la demanda (primero el "idioma común").

| Horizonte | Alcance | KPI habilitados |
|---|---|---|
| **H1 — El idioma común** | Catálogo de roles, competencias y niveles; requerimientos de proyecto; perfil con certificación manual; brechas y búsqueda de personal. | 1, 2, 3, 6 |
| **H2 — Formación integrada** | Rutas de formación con Classroom y Drive; certificados de curso en docsuite. | 4 |
| **H3 — Evidencia real con IA** | Agente sobre GitLab que propone niveles; tablero de capacidad frente a demanda. | 5 |

**Por qué este orden:** sin un catálogo acordado, ni la formación ni la IA tienen contra qué medir.

## 10. Riesgos

| Riesgo | Mitigación propuesta |
|---|---|
| Catálogo desactualizado o sin consenso entre productos | El Jefe de Ingeniería gobierna el catálogo; falta definir cómo se versiona (§11). |
| Que el análisis de GitLab se perciba como vigilancia | La evidencia es de uso interno. Además, transparencia para el colaborador sobre qué se usa y cómo. |
| Problemas de integración con Google Classroom | Contingencia de §6: evaluar gestión propia de material y progreso. |
| Sesgo de la IA (premiar volumen o ciertos tipos de issue) | Firma humana obligatoria y justificación trazable en cada propuesta. |
| Datos pobres en GitLab (etiquetas o asignaciones inconsistentes) | Convenciones mínimas de etiquetado por producto (a definir). |

## 11. Preguntas abiertas

1. Qué evidencia exige cada nivel (L1–L4) para certificarse.
2. Cómo se versiona el catálogo de competencias.
3. Metas numéricas y línea base de los KPI (Hecho: aún no se tienen).
4. Si hay que integrar el sistema de RR. HH. como fuente de la ficha del colaborador.
5. Cómo se decide una asignación: la plataforma recomienda y el PM decide, o hay un flujo de aprobación.
6. Qué papel exacto tiene el Responsable de producto frente al Jefe de Ingeniería en el mantenimiento del catálogo.
7. Cómo se relaciona el certificado de curso con los niveles: si aprobar un curso aporta evidencia para algún nivel y para cuál.

## 12. Preguntas resueltas

| Pregunta | Respuesta (Decisión) | Fecha |
|---|---|---|
| Dueño del catálogo de cada producto | Jefe de Ingeniería, responsable de la capacitación de todo el equipo. | 2026-09-26 |
| Integración con Classroom | Solo lectura. Si hay problemas de integración, se evaluará gestión propia de material y progreso (§6). | 2026-09-26 |
| Qué se certifica | La aprobación del curso final, según el cumplimiento de los objetivos del curso. | 2026-09-26 |
| Reglas de uso de la evidencia de GitLab | Uso interno. | 2026-09-26 |
