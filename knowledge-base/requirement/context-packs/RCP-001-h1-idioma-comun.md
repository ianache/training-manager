---
type: Requirement Context Pack
title: "RCP-001 — H1 El idioma común"
description: "Contexto funcional mínimo y trazable del horizonte H1 de la Plataforma de Gestión de Formación: catálogo de competencias, requerimientos de proyecto, perfil con certificación manual, brechas y búsqueda de personal."
tags: [context-pack, requirements, h1, catalogo, certificacion, brechas]
status: draft
generated:
  by: "af-requirement-context-builder/1.0"
  at: "2026-09-27T18:00:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
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

Que cada [proyecto](../../business/glossary/terms/TRM-0050-proyecto.md) de los 4 productos pueda declarar los roles, competencias y niveles que necesita, y encontrar colaboradores cuyo nivel en esas competencias está certificado, medido contra un catálogo común.

Resultado observable: los KPI que H1 habilita (VIS-001:L132):
- **1 — Cobertura de roles:** porcentaje de roles requeridos por proyectos activos que se cubren con personal certificado.
- **2 — Tiempo de asignación.**
- **3 — Cierre de brechas.**
- **6 — Adopción:** perfiles activos y proyectos con requerimientos registrados.

Las metas y la línea base todavía no existen (VIS-001:L152).

### Incluido

- Catálogo de roles, competencias y niveles requeridos (capacidad 1). Por decisión del 2026-09-26 es común a todos los productos (BR-CAT-07, BR-CAT-08).
- Requerimientos de proyecto (capacidad 3).
- Perfil de competencias con **certificación manual** (capacidades 2 y 6).
- Brechas y búsqueda de personal (capacidad 4).
- Historias USC-001 que cubren esto: US-001 a US-008.

### Excluido

- Rutas de formación, Google Classroom, Google Drive y certificados de curso de docsuite (H2).
- Agente de IA sobre GitLab y tablero de capacidad (H3).
- Lo que VIS-001 §7 declara fuera de alcance: hospedar cursos, verificación pública de certificados de curso, evaluación salarial o de RR. HH. y gestión de proyectos.
- Diseño técnico, modelo de datos físico y APIs.

### Restricciones conocidas

- Ninguna certificación ocurre sin firma humana (VIS-001:L81, L101; BR-ACR-04).
- Cada nivel certificado se puede rastrear hasta sus evidencias y hasta quien lo certificó (VIS-001:L103; BR-ACR-03).
- La escala es L1–L4 (VIS-001:L62-L69; BR-CAT-02).

## 3. Resumen ejecutivo del contexto

Hoy la asignación de personal depende del conocimiento informal de los líderes, porque no hay un catálogo común de roles y competencias por producto (VIS-001:L35). Esto es un **supuesto** validado en la sesión, sin evidencia documental.

H1 crea ese "idioma común". Sus piezas son cuatro:
- El Jefe de Ingeniería define el catálogo.
- Los Jefes de proyecto declaran qué necesitan sus proyectos.
- Los evaluadores certifican niveles con evidencias.
- La plataforma calcula brechas (nivel requerido − nivel certificado) y muestra candidatos.

VIS-001 pone H1 primero porque, sin catálogo, ni la formación (H2) ni la IA (H3) tienen contra qué medir (VIS-001:L136).

Las reglas del catálogo, la certificación y el cálculo de brecha están sostenidas por la visión y ya tienen términos aprobados en el glosario. Quedan abiertos cinco puntos que bloquean parte de la especificación:
- ~~El **detalle del tipo de evidencia** por competencia y nivel (P-22)~~: respondida y confirmada el 2026-09-27 (evidencia concreta, BR-ACR-08); cada requisito se declara requerida o deseada (BR-ACR-12) y lo define el Jefe de Ingeniería de forma progresiva (BR-CAT-16, BR-CAT-17). P-39 quedó respondida el 2026-09-27: un nivel sin requisitos definidos no se certifica ni se exige en un Rol-Nivel o requerimiento (BR-ACR-13); es inferencia a confirmar que al menos uno sea requerido.
- ~~Cómo se **decide una asignación** (P-05)~~: respondida el 2026-09-27. La plataforma recomienda y el Jefe de Ingeniería o un ADMIN asigna uno o varios colaboradores, con la decisión final; se puede asignar bajo el nivel y a varios requerimientos, con advertencia (BR-REQ-04, BR-REQ-11, BR-REQ-12). Derivada: P-53.
- ~~**Quién ve el perfil de otra persona** (P-08)~~: respondida el 2026-09-27. Resumen de niveles certificados, evidencias (las de GitLab, según el control de acceso de cada repositorio) y certificaciones con su auditoría, para cualquier colaborador; brechas individuales, para el Jefe de proyecto; propuestas de la IA, para el colaborador, quien evalúa, el Jefe de Ingeniería, Dirección, Gerencia y ADMIN (BR-TRA-03 a BR-TRA-06, BR-IA-04). Derivada: P-54.
- ~~De dónde sale la lista de colaboradores~~ (VIS-001 §11.4): respondida por [SPEC-001](../specs/SPEC-001-gestion-de-colaboradores.md) D2; la plataforma es el sistema de registro.
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
| E-01 | H1 abarca catálogo; requerimientos de proyecto; perfil con certificación manual; brechas y búsqueda de personal. | S-01:L132 | Decisión humana | Alta |
| E-02 | El Jefe de Ingeniería es dueño del catálogo de los 4 productos. | S-01:L51, L162 | Decisión humana | Alta |
| E-03 | Modelo: Producto → Rol → Competencia → Nivel requerido; Colaborador → Competencia → Nivel certificado ← Evidencia. | S-01:L56-L57 | Hecho | Media |
| E-04 | Escala L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto / Referente. | S-01:L62-L69 | Decisión humana | Alta |
| E-05 | Cada rol exige un nivel mínimo por competencia. | S-01:L71 | Hecho | Media |
| E-06 | Proyecto (de un Producto) → Requerimiento (Rol + Competencias + Nivel) → Asignación. | S-01:L58 | Hecho | Media |
| E-07 | Brecha = Nivel requerido − Nivel certificado. | S-01:L59 | Hecho | Media |
| E-08 | Un evaluador revisa evidencias y certifica; se registra quién, cuándo y con qué evidencia. | S-01:L80 | Hecho | Media |
| E-09 | Ninguna certificación sin firma humana. | S-01:L81, L101 | Decisión humana | Alta |
| E-10 | El colaborador ve su perfil y sus evidencias. | S-01:L104 | Hecho | Media |
| E-11 | La evidencia exigida por cada nivel está abierta. | S-01:L71, L150 | Vacío | Alta |
| E-12 | Cómo se decide una asignación está abierto. *Cerrado el 2026-09-27 por EVD-2026-0126 (P-05): recomienda la plataforma, asigna el Jefe de Ingeniería o un ADMIN.* | S-01:L154 | Vacío | Alta |
| E-13 | Integrar el sistema de RR. HH. como fuente de la ficha del colaborador estaba abierto; SPEC-001 D2 lo cierra: no hay integración y la plataforma es el sistema de registro (BR-PTY-01). | S-01:L153; SPEC-001 D2 | Decisión humana | Alta |
| E-14 | No existe un catálogo común hoy. | S-01:L35 ("Supuesto (validado en la sesión, falta evidencia documental)") | Supuesto | Media |
| E-15 | 59 términos del glosario aprobados; Proyecto activo, Responsable de producto y Sistema de RR. HH. siguen en `draft`. | S-03 | Decisión humana | Alta |
| E-16 | 8 historias de H1: 1 READY (US-004), 5 CONDITIONAL y 2 NOT READY (US-007, US-008). *Recalculado el 2026-09-27: 1 READY y 7 CONDITIONAL; US-008 pasó a CONDITIONAL por P-17 y US-007, por P-05.* | S-04 | Hecho | Alta |

## 5. Hechos confirmados

Están respaldados por una fuente. Los que vienen de una decisión humana se listan en §10.

- **Catálogo:** es único y común a los 4 productos (CLocator, CLocator v2 / C-Go, SIGO, SmartSuite): roles y competencias no pertenecen a un producto. Cada competencia de un rol tiene un nivel mínimo L1–L4 (E-01 a E-05; BR-CAT-01 a BR-CAT-04, BR-CAT-07, BR-CAT-08). VIS-001 describía un catálogo por producto (AMB-04).
- **Requerimientos:** cada requerimiento pertenece a un proyecto y cada proyecto a un producto. El Jefe de proyecto declara rol, competencias y nivel (E-06; BR-REQ-01, BR-REQ-02).
- **Certificación:**
  - En H1 es manual (E-01).
  - Un evaluador humano certifica con al menos una evidencia de formación, práctica evaluada o desempeño en proyecto.
  - Queda registro de quién certificó, cuándo y con qué evidencia (E-08, E-09; BR-ACR-01 a BR-ACR-05).
- **Brecha:** se calcula por competencia como nivel requerido − nivel certificado (E-07; BR-BRE-01).
- **Transparencia:** el colaborador ve su perfil y sus evidencias (E-10; BR-TRA-01).

## 6. Supuestos e hipótesis

| ID | Afirmación | Tipo | Origen | Qué la confirmaría |
|---|---|---|---|---|
| H-01 | Hoy no existe un catálogo común de roles y competencias. | Supuesto | S-01:L35 | Evidencia documental o confirmación del Jefe de Ingeniería |
| H-02 | ~~Un requerimiento solo puede usar roles y competencias del catálogo de su producto.~~ | Descartada (2026-09-26) | BR-REQ-03, retirada | Respondida en P-10: los roles son comunes (BR-CAT-08) |
| H-03 | Los niveles L1–L4 se restan como números para calcular la brecha. | Hipótesis (agente) | BR-BRE-02 | Respuesta a P-12 |
| H-04 | ~~El Jefe de proyecto es quien asigna.~~ Descartada el 2026-09-27 (P-05): asigna el Jefe de Ingeniería o un ADMIN (BR-REQ-04) | Hipótesis (agente), descartada | US-007; S-01 solo dice que "encuentra personal" (L42) | Respuesta a P-05 |
| H-05 | ~~Las brechas por producto las consulta el Jefe de Ingeniería o Dirección.~~ Resuelta el 2026-09-27 (P-17): Jefe de Ingeniería, Jefe de proyecto y usuarios ADMIN (BR-BRE-06); Dirección no se nombra | Hipótesis (agente), resuelta | US-008; S-01:L78 no nombra al actor | Respuesta a P-17 |
| H-06 | El Responsable de producto aporta conocimiento del catálogo sin gobernarlo. | Supuesto | S-01:L44 | Respuesta a P-06 |

## 7. Vacíos y preguntas abiertas

| ID | Pregunta | Destinatario | Prioridad | Estado |
|---|---|---|---|---|
| P-01 | ¿Qué evidencia mínima exige cada nivel L1–L4? | Negocio (Jefe de Ingeniería) | Alta | Respondida en lo esencial (ianache (Jefe de Ingeniería), 2026-09-26): BR-ACR-07 |
| P-21 | ¿Quién define el tipo de evidencia de cada competencia y nivel? ¿Forma parte del catálogo que gobierna el Jefe de Ingeniería? | Negocio (Jefe de Ingeniería) | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): el Jefe de Ingeniería, responsable de las capacitaciones (BR-CAT-16) |
| P-22 | ¿"Tipo de evidencia" se refiere a las tres categorías de BR-ACR-01 (formación, práctica evaluada, desempeño en proyecto) o a una evidencia concreta (por ejemplo, un curso o una práctica determinada)? | Negocio (Jefe de Ingeniería) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): evidencia concreta dentro de una de las tres categorías (BR-ACR-08); confirmada (ianache (Jefe de Ingeniería), 2026-09-27) |
| P-23 | ¿Una competencia y nivel puede exigir más de un tipo de evidencia o una cantidad mínima? ¿El evaluador puede aceptar evidencia de otro tipo como equivalente? | Negocio (Jefe de Ingeniería) | Media | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27): cada evidencia se declara requerida o deseada; se exigen todas las requeridas y las deseadas refuerzan la certificación (BR-ACR-09, BR-ACR-12). Sigue abierta la equivalencia, y cómo "refuerza" una deseada (P-41) |
| P-24 | ¿Hay que definir el tipo de evidencia para los cuatro niveles de cada competencia, o solo para los niveles que exige algún rol? | Negocio (Jefe de Ingeniería) | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): se definen de forma progresiva; lo ideal es tenerlos todos (BR-CAT-17). Ver P-39 |
| P-25 | ¿Un requerimiento indica el nivel de rol que necesita? | Negocio (Responsable de producto) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): sí (BR-REQ-08) |
| P-26 | ¿Cuántos niveles de rol hay y cómo se relacionan con L1–L4? | Negocio (Jefe de Ingeniería) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no hay una cantidad general; cada rol define sus niveles al registrarse (BR-CAT-09), y cada Rol-Nivel fija el nivel L1–L4 esperado (BR-CAT-14). Escala salarial y MOF, fuera de alcance (BR-CAT-18) |
| P-27 | ¿Una competencia transversal aplica automáticamente o se asigna? | Negocio (Jefe de Ingeniería) | Media | Respondida: se asigna a los roles (BR-CAT-11) |
| P-36 | ¿Cómo se combinan Junior/Senior con la numeración 1 a 4 del Rol-Nivel (por ejemplo, ¿Junior 1-2 y Senior 3-4, o Junior 1-4 y Senior 1-4?)? ¿Todos los roles tienen los mismos niveles? | Negocio (Jefe de Ingeniería) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): los niveles y sus nombres se definen al registrar cada rol, por ejemplo Developer Junior (Nivel 1) a (Nivel 3); no son iguales para todos los roles (BR-CAT-09). Ver P-40 |
| P-39 | Mientras la definición es progresiva (BR-CAT-17), ¿se puede certificar un nivel de una competencia que aún no tiene requisitos de evidencia definidos? ¿Y exigirlo en un Rol-Nivel o en un requerimiento? | Negocio (Jefe de Ingeniería) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no; siempre debe haber forma de evidenciar (BR-ACR-13) |
| P-40 | ¿La plataforma registra solo el nombre y las competencias de cada nivel de rol, o también sus criterios (años de experiencia en el rol, formación técnica)? Se supone que no (BR-CAT-18) | Negocio (Jefe de Ingeniería) | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): por ahora no; son parte del MOF, fuera de alcance (BR-CAT-18) |
| P-41 | ¿Cómo "refuerza" una evidencia deseada la certificación? ¿Solo queda registrada o cambia algo? | Negocio (Jefe de Ingeniería) | Media | Nueva (BRC-001, derivada de P-23) |
| P-37 | ¿La rúbrica de una competencia contiene los requisitos de evidencia de cada nivel, o son cosas distintas? ¿Quién define y aprueba las rúbricas? | Negocio (Jefe de Ingeniería) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): la rúbrica describe el comportamiento y el logro visible y verificable, que se verifica con evidencias; la define y aprueba el Jefe de Ingeniería (BR-CAT-15, BR-CAT-19). Inferencia a confirmar: rúbrica y requisito de evidencia son cosas distintas |
| P-28 | ¿Un colaborador tiene un nivel de rol (por ejemplo, Developer Junior 2)? Si lo tiene, ¿se certifica o se deduce de sus competencias certificadas? | Negocio (Jefe de Ingeniería) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): se asigna un nivel inicial al registrar al colaborador, según su rol, y después se evalúa la evolución de sus competencias por cursos o desempeño en proyectos (BR-PRF-02). Ver P-42 |
| P-42 | ¿Cómo se decide el paso de un colaborador al siguiente nivel de su rol? ¿Lo decide una persona a partir de las competencias certificadas, o se deduce de los niveles L1–L4 alcanzados? | Negocio (Jefe de Ingeniería) | Alta | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27, en US1-Q1): para escalar debe haber cumplido las competencias de los niveles inferiores (BR-PRF-03). Siguen abiertos quién decide el paso y si basta con eso |
| P-29 | ¿Un requerimiento puede pedir una competencia que no pertenece a su rol? | Negocio (Responsable de producto) | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): no (BR-REQ-09) |
| P-30 | ¿"Líder de proyecto" (el actor que declara requerimientos) es el mismo rol que "jefe de proyecto" de la lista de roles del catálogo? | Negocio (Jefe de Ingeniería) | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): sí; se usa Jefe de proyecto |
| P-38 | La respuesta a P-29 sugiere que un requerimiento pide el Rol-Nivel completo ("las competencias definidas para el rol y nivel son las idóneas"), pero BR-REQ-07 permite pedir solo algunas competencias del rol. ¿Sigue vigente BR-REQ-07? | Negocio (Jefe de Ingeniería) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí; por defecto se asumen todas las competencias del Rol-Nivel y el Jefe de proyecto que registra el requerimiento puede retirar algunas (BR-REQ-07, BR-REQ-10). AMB-06 resuelta |
| P-31 | ¿El Evaluador y el Jefe de Ingeniería también tienen un perfil de competencias como colaboradores, o solo gestionan el programa? | Negocio (Jefe de Ingeniería) | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): son solo gestores del programa y por ahora quedan fuera del proceso de evaluación, aunque sus roles tienen competencias definidas (BR-PRG-01, BR-PRG-02) |
| P-05 | ¿La plataforma solo recomienda y el Jefe de proyecto decide, o hay un flujo de aprobación? | Negocio (Responsable de producto) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): recomienda; asigna y decide el Jefe de Ingeniería o un ADMIN; bajo el nivel y asignación múltiple permitidas, con advertencia (BR-REQ-04, BR-REQ-11, BR-REQ-12) |
| P-08 | ¿Quién puede ver el perfil y las evidencias de otro colaborador? | Negocio (Responsable de producto) | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): BR-TRA-03 a BR-TRA-06, BR-IA-04 |
| P-53 | Asignar bajo el nivel: ¿la plataforma registra el curso de cierre o un motivo? | Negocio (Jefe de Ingeniería) | Media | Nueva (BRC-001, derivada de P-05) |
| P-54 | ¿Las calificaciones y el sustento del evaluador son visibles para todos? ¿Se mantiene el uso "solo interno" de la evidencia de GitLab (BR-IA-01)? | Negocio (Jefe de Ingeniería) | Media | Nueva (BRC-001, derivada de P-08) |
| VIS-§11.4 | ¿De dónde sale la lista de colaboradores y sus datos básicos? ¿Se integra el sistema de RR. HH.? | Negocio + ARQ | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D2): la plataforma es el sistema de registro de colaboradores, sin integración con RR. HH. (BR-PTY-01) |
| RCP-Q1 | ¿Quiénes son los evaluadores de H1 y quién los designa? ¿Instructor y evaluador son el mismo rol (GQ-07)? | Negocio (Jefe de Ingeniería) | Alta | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-26): el Evaluador gestiona el programa junto con el Jefe de Ingeniería (BR-PRG-01). Sigue abierto quién los designa y si instructor y evaluador son el mismo rol. *2026-09-27 (P-49):* el Instructor está confirmado: un colaborador que el Jefe de Ingeniería o un ADMIN asigna a una edición de curso (BR-FOR-05); si puede certificar niveles sigue abierto (P-49.2) |
| P-02 | ¿Cómo se versiona el catálogo y qué pasa con requerimientos y certificaciones vigentes cuando cambia? | Negocio (Jefe de Ingeniería) | Media | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27): se versionan los cursos (BR-FOR-06 a BR-FOR-10) y, por P-50, las competencias pero no los roles (BR-CAT-22). Siguen abiertos P-50.1 (efecto sobre datos vigentes, Alta) y P-50.2 (quién aprueba) |
| P-06 | ¿Qué papel tiene el Responsable de producto en el mantenimiento del catálogo? | Negocio (Jefe de Ingeniería) | Media | Abierta (BRC-001) |
| P-09 | ¿Qué parte de la certificación hace Gestión de formación / RR. HH. y qué parte el evaluador? ¿El evaluador puede certificar a su propio equipo? | Negocio | Media | Abierta (BRC-001) |
| P-10 | ¿Un requerimiento solo usa roles y competencias del catálogo de su producto? | Negocio (Jefe de Ingeniería) | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): no; roles comunes (BR-CAT-08) |
| P-11 | ¿Qué estados tiene un proyecto y cuándo es "activo"? Lo necesitan el KPI 1 y la búsqueda. | Negocio (Responsable de producto) | Media | Abierta (BRC-001) |
| P-12 | ¿Cómo se trata la brecha sin nivel certificado y la brecha negativa? | Negocio (Jefe de Ingeniería) | Media | Abierta (BRC-001) |
| P-15 | ¿Cómo declara el colaborador el rol al que aspira? | Negocio (Responsable de producto) | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no declara un rol al que aspira; el Jefe de Ingeniería le asigna rol y nivel al registrarlo y él ve sus propias brechas (BR-BRE-04) |
| P-43 | ¿Contra qué Rol-Nivel ve el colaborador su brecha: el asignado, el siguiente de su rol o ambos? ¿Puede ver brechas de otros roles? | Negocio (Jefe de Ingeniería) | Alta | Nueva (BRC-001, derivada de P-15) |
| P-16 | ¿La búsqueda muestra también candidatos por debajo del nivel requerido? ¿Cómo se ordena? | Negocio (Responsable de producto) | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí, con su brecha; por defecto de menor a mayor brecha y el usuario puede invertir el orden (BR-BRE-05) |
| P-44 | ¿Cómo se resume en un solo valor la brecha de un candidato para ordenar la búsqueda? | Negocio (Jefe de Ingeniería) | Media | Nueva (BRC-001, derivada de P-16) |
| P-17 | ¿Quién consulta las brechas agregadas por producto? | Negocio (Jefe de Ingeniería) | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): Jefe de Ingeniería, Jefe de proyecto y cualquier usuario con privilegios de ADMIN (BR-BRE-06) |
| P-45 | ¿Qué es un usuario con privilegios de ADMIN y quién lo otorga? | Negocio (Jefe de Ingeniería) + ARQ | Media | Nueva (BRC-001, derivada de P-17) |
| GQ-08 | ¿Qué es un "perfil activo"? Lo necesita el KPI 6. | Negocio (Responsable de producto) | Media | Abierta (GLS-001) |
| RCP-Q2 | En H1, sin el agente de IA, ¿un evaluador puede registrar a mano evidencia de GitLab (desempeño en proyecto)? | Negocio (Jefe de Ingeniería) | Media | Nueva → **Respondida (ianache, 2026-10-04, EVD-2026-0215 y 0221):** las evidencias las registra el colaborador; un evaluador no las registra a mano en H1. |
| P-14 | ¿Una certificación vence o puede revocarse? | Negocio (Jefe de Ingeniería) | Baja | Abierta (BRC-001) |

## 8. Actores, procesos, datos y dependencias

### Actores

| Actor | Papel en H1 | Evidencia | Historias |
|---|---|---|---|
| [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) | Define y gobierna el catálogo | S-01:L43, L51 | US-001 |
| [Responsable de producto](../../business/glossary/terms/TRM-0053-responsable-de-producto.md) | Aporta el conocimiento de los roles de su producto; papel exacto por confirmar | S-01:L44 (supuesto); término en `draft` | US-001 (indirecto) |
| [Jefe de proyecto](../../business/glossary/terms/TRM-0038-lider-de-proyecto.md) (PM) | Declara requerimientos y busca candidatos; es a la vez un colaborador con perfil de competencias y nivel de rol (BR-CAT-13) | S-01:L42, L77; BR-CAT-13 | US-002, US-006, US-007 (hipótesis) |
| [Evaluador](../../business/glossary/terms/TRM-0021-evaluador.md) | Revisa evidencias y certifica niveles; junto con el Jefe de Ingeniería, gestiona el programa. Es solo gestor: por ahora queda fuera del proceso de evaluación (BR-PRG-02) | S-01:L46, L80; BR-PRG-01 | US-003 |
| [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md) | Consulta su perfil y su brecha | S-01:L41, L104 | US-004, US-005 |
| [Gestión de formación / RR. HH.](../../business/glossary/terms/TRM-0027-gestion-de-formacion.md) | "Gestiona certificaciones": no está claro qué hace frente al evaluador | S-01:L45; AMB-03 | — (P-09) |
| [Dirección / Gerencia](../../business/glossary/terms/TRM-0018-direccion.md) | No figura entre quienes consultan brechas agregadas (BR-BRE-06; H-05 resuelta), salvo que tenga privilegios de ADMIN (P-45); su tablero es de H3 | S-01:L47; BR-BRE-06 | US-013, US-014 (H3) |

### Procesos y estados

| Proceso | Actor | Entradas | Resultado | Estados conocidos |
|---|---|---|---|---|
| Definir el catálogo | Jefe de Ingeniería | Roles, competencias, nivel L1–L4, evidencia concreta por nivel | Catálogo común a todos los productos | Se versionan las competencias, no los roles (BR-CAT-22, P-50 en parte); los estados de una versión de competencia son inferencia y el efecto sobre datos vigentes sigue abierto (P-50.1, P-50.2). Validaciones del 2026-09-27: un rol tiene al menos una competencia (BR-CAT-20) y un nivel sin requisitos de evidencia no se exige (BR-ACR-13). Lectura para todos los colaboradores (BR-TRA-02) |
| Declarar requerimiento | Jefe de proyecto (solo el de ese proyecto, BR-REQ-02; US2-Q2 respondida) | Proyecto, rol | Requerimiento del proyecto, con las competencias y niveles del rol | Proyecto "activo" sin definir (P-11) |
| Certificar nivel (manual) | Evaluador | Colaborador, competencia, evidencias | Nivel certificado con registro de quién, cuándo y evidencia | Sin estados definidos; vencimiento o revocación abiertos (P-14) |
| Consultar perfil y brecha | Colaborador | Perfil, rol del catálogo | Niveles, evidencias y brecha por competencia | — |
| Buscar candidatos | Jefe de proyecto | Requerimiento, perfiles | Candidatos que alcanzan el nivel y los que no, con su brecha, ordenados de menor a mayor brecha (BR-BRE-05) | Cómo se resume la brecha para ordenar (P-44) |
| Asignar | Jefe de Ingeniería o usuario ADMIN (BR-REQ-04; P-05 respondida el 2026-09-27) | Requerimiento, candidatos recomendados | Asignación de uno o varios colaboradores; se permite bajo el nivel (BR-REQ-11) y a más de un requerimiento, con advertencia (BR-REQ-12) | Sin estados definidos; si se registra el curso de cierre o un motivo, P-53 |

### Datos relevantes (funcionales)

| Dato | Descripción | Término | Fuente |
|---|---|---|---|
| Producto | Uno de los 4 productos en alcance | [TRM-0047](../../business/glossary/terms/TRM-0047-producto.md) | S-01:L23 |
| Rol | Rol común a todos los productos, con niveles de rol propios, definidos al registrarlo (por ejemplo, Developer Junior (Nivel 1) a (Nivel 3)), y competencias por nivel | [TRM-0055](../../business/glossary/terms/TRM-0055-rol.md) | S-01:L56; BR-CAT-08 a BR-CAT-10; EVD-2026-0100, 0101 |
| Competencia | Competencia exigida por un rol | [TRM-0014](../../business/glossary/terms/TRM-0014-competencia.md) | S-01:L56 |
| Nivel requerido | L1–L4 mínimo por competencia, para cada rol y nivel de rol | [TRM-0043](../../business/glossary/terms/TRM-0043-nivel-requerido.md) | S-01:L71; BR-CAT-10 |
| Colaborador | Persona con perfil de competencias; se registra en la propia plataforma (SPEC-001 D2) y es derivado: persona con rol vigente de Empleado o Contratista (BR-PTY-05) | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) | S-01:L57, L153 |
| Nivel certificado | Nivel L1–L4 certificado por competencia | [TRM-0042](../../business/glossary/terms/TRM-0042-nivel-acreditado.md) | S-01:L57 |
| Evidencia | Formación, práctica evaluada o desempeño en proyecto | [TRM-0022](../../business/glossary/terms/TRM-0022-evidencia.md) | S-01:L57, L71 |
| Registro de certificación | Quién, cuándo y con qué evidencia | [TRM-0001](../../business/glossary/terms/TRM-0001-acreditacion.md) | S-01:L80 |
| Proyecto | Proyecto de un producto | [TRM-0050](../../business/glossary/terms/TRM-0050-proyecto.md) | S-01:L58 |
| Requerimiento | Rol-Nivel que necesita un proyecto; por defecto incluye todas sus competencias y el Jefe de proyecto que lo registra puede retirar algunas; los niveles se toman del catálogo (BR-REQ-06, BR-REQ-07, BR-REQ-10) | [TRM-0052](../../business/glossary/terms/TRM-0052-requerimiento-de-proyecto.md) | S-01:L58; BR-REQ-06, BR-REQ-07 |
| Brecha | Nivel requerido − nivel certificado | [TRM-0005](../../business/glossary/terms/TRM-0005-brecha.md) | S-01:L59 |
| Asignación | Vínculo entre un requerimiento y un colaborador | [TRM-0004](../../business/glossary/terms/TRM-0004-asignacion.md) | S-01:L58 |

**Datos personales:** el perfil de competencias y las evidencias son datos de una persona. La visibilidad para terceros quedó definida el 2026-09-27 (P-08) y reemplaza el acceso mínimo provisional: resumen de niveles certificados, evidencias y certificaciones con su auditoría, visibles para cualquier colaborador (las evidencias de GitLab, sujetas al control de acceso de cada repositorio); brechas individuales, para el Jefe de proyecto; propuestas de la IA, para el colaborador, quien evalúa, el Jefe de Ingeniería, Dirección, Gerencia y ADMIN (BR-TRA-03 a BR-TRA-06, BR-IA-04). De los datos maestros, otros colaboradores ven solo nombre, correo laboral, unidad, rol y perfiles profesionales (BR-PTY-20, P-52). Abierto: calificaciones y sustento del evaluador (P-54).

### Dependencias y consumidores

- **Orden funcional:** catálogo → requerimientos → búsqueda → asignación. La certificación alimenta el perfil, la brecha y la búsqueda (S-01:L136; USC-001).
- **Consumidores de H1:**
  - H2 (las rutas de formación se generan a partir de la brecha, S-01:L79).
  - H3 (la IA propone niveles contra el catálogo, S-01:L81).
  - Los KPI 1, 2, 3 y 6.
- **Dependencia externa descartada:** el sistema de RR. HH. no es fuente de colaboradores; la plataforma es el sistema de registro (SPEC-001 D2, BR-PTY-01).

## 9. Restricciones y riesgos funcionales

| Tipo | Descripción | Mitigación conocida | Fuente |
|---|---|---|---|
| Restricción | Sin firma humana no hay certificación | — | S-01:L101 |
| Restricción | Trazabilidad de cada nivel hasta su evidencia y quien lo certificó | — | S-01:L103 |
| Riesgo | Catálogo desactualizado o sin consenso entre productos | El Jefe de Ingeniería lo gobierna; se versionan las competencias, no los roles (BR-CAT-22); falta el efecto de una versión nueva sobre datos vigentes (P-50.1) y quién la aprueba (P-50.2) | S-01:L142 |
| Riesgo | Certificaciones inconsistentes entre evaluadores si el tipo de evidencia no se concreta | BR-ACR-07, BR-ACR-08 (P-22 confirmada) y BR-ACR-12 lo acotan; falta P-23 (equivalencias); P-39 quedó respondida (BR-ACR-13) | Inferencia a partir de S-01:L150 |
| Riesgo | KPI 1 y 6 imposibles de medir mientras "proyecto activo" y "perfil activo" no estén definidos | Ninguna todavía (P-11, GQ-08) | S-01:L119, L124 |
| Riesgo | Exposición de datos de desempeño de personas | P-08 respondida el 2026-09-27: la visibilidad abierta es decisión del negocio (BR-TRA-03 a BR-TRA-06); los datos maestros se limitan a cinco (BR-PTY-20, P-52). Sigue abierto P-54 (calificaciones, sustento del evaluador, GitLab) | S-01:L104; P-08 |

**Contradicciones y ambigüedades vigentes** (de BRC-001):
- ~~**AMB-01:** formación como evidencia frente a certificado de curso ≠ nivel.~~ Resuelta el 2026-09-27 (P-07): aprobar el curso es parte de la demostración del nivel y la plataforma propone certificar el nivel objetivo (BR-ACR-14); el certificado de curso no certifica por sí solo (BR-CER-02). La propuesta es de H2.
- **AMB-02:** la ausencia de catálogo está clasificada a la vez como supuesto y como validada.
- **AMB-03:** Gestión de formación / RR. HH. "gestiona certificaciones", pero el que certifica es el evaluador.

## 10. Decisiones y validación humana

| Decisión o validación | Responsable | Evidencia | Fecha |
|---|---|---|---|
| Alcance de H1 y orden de horizontes | Responsable del producto (sesión de descubrimiento) | S-01:L128-L136 | 2026-09-26 |
| Dueño del catálogo: Jefe de Ingeniería | Responsable del producto | S-01:L162 | 2026-09-26 |
| Escala de niveles L1–L4 | Responsable del producto | S-01:L62 | 2026-09-26 |
| Aprobación de 59 términos del glosario | ianache (Jefe de Ingeniería) | S-03, `verified` por término | 2026-09-26 |
| Alcance de este pack: H1 | ianache | Elección en esta sesión | 2026-09-26 |
| P-01: el tipo de evidencia se define por competencia y nivel (BR-ACR-07) | ianache (Jefe de Ingeniería) | Respuesta en esta sesión (EVD-2026-0052) | 2026-09-26 |
| Catálogo único de competencias (BR-CAT-07), requerimiento que hereda del rol (BR-REQ-06) y evidencia concreta (BR-ACR-08) | ianache (Jefe de Ingeniería) | Respuestas en esta sesión (EVD-2026-0053 a 0055) | 2026-09-26 |
| Roles independientes de los productos (BR-CAT-08) | ianache (Jefe de Ingeniería) | Respuesta en esta sesión (EVD-2026-0056) | 2026-09-26 |
| Varias evidencias por competencia y nivel, todas obligatorias (BR-ACR-09; revisada el 2026-09-27: obligatorias solo las requeridas, BR-ACR-12) | ianache (Jefe de Ingeniería) | Respuesta en esta sesión (EVD-2026-0057) | 2026-09-26 |
| Requerimiento con todas o algunas competencias del rol (BR-REQ-07); niveles de rol y competencias por nivel (BR-CAT-09, BR-CAT-10); competencias transversales (BR-CAT-11) | ianache (Jefe de Ingeniería) | Respuestas en esta sesión (EVD-2026-0058 a 0060) | 2026-09-26 |
| Jefe de proyecto como rol con perfil (BR-CAT-13); Evaluador y Jefe de Ingeniería gestionan el programa (BR-PRG-01); roles iniciales del catálogo (BR-CAT-12) | ianache (Jefe de Ingeniería) | Respuestas en esta sesión (EVD-2026-0061 a 0063) | 2026-09-26 |
| Requerimiento con nivel de rol (BR-REQ-08); Rol-Nivel 1 a 4 con nivel L1–L4 esperado (BR-CAT-14); rúbrica por competencia (BR-CAT-15); transversales asignadas a roles (BR-CAT-11) | ianache (Jefe de Ingeniería) | Respuestas en esta sesión (EVD-2026-0067 a 0071) | 2026-09-26 |
| El Jefe de Ingeniería define los requisitos de evidencia (BR-CAT-16), de forma progresiva (BR-CAT-17); cada requisito es requerida o deseada y certificar exige las requeridas (BR-ACR-12, BR-ACR-09 revisada); P-22 confirmada | ianache (Jefe de Ingeniería) | Respuestas a P-21 a P-24 (EVD-2026-0096 a 0099) | 2026-09-27 |
| Sin cantidad general de niveles de rol: cada rol define los suyos al registrarse (BR-CAT-09 y BR-CAT-14 revisadas; ya no "Rol-Nivel 1 a 4"); escala salarial, MOF y criterios de nivel fuera de alcance (BR-CAT-18) | ianache (Jefe de Ingeniería) | Respuestas a P-26 y P-36 (EVD-2026-0100, 0101) | 2026-09-27 |
| Rúbrica como logro visible y verificable, definida y aprobada por el Jefe de Ingeniería (BR-CAT-15, BR-CAT-19); requerimiento con todas las competencias del Rol-Nivel por defecto y retiro opcional (BR-REQ-07, BR-REQ-10; AMB-06 resuelta); nivel inicial de rol al registrar (BR-PRF-02); Evaluador y Jefe de Ingeniería solo gestores, fuera de la evaluación por ahora (BR-PRG-01, BR-PRG-02) | ianache (Jefe de Ingeniería) | Respuestas a P-37, P-28, P-38 y P-31 (EVD-2026-0102 a 0105) | 2026-09-27 |
| Asignación por el Jefe de Ingeniería o ADMIN, con recomendación de la plataforma, bajo el nivel y múltiple con advertencia (BR-REQ-04, BR-REQ-11, BR-REQ-12); solo el Jefe de proyecto del proyecto declara sus requerimientos (BR-REQ-02); el curso aporta evidencia y la plataforma propone certificar el nivel objetivo (BR-ACR-14; AMB-01 resuelta); visibilidad de perfil, brechas, evidencias, certificaciones y propuestas de la IA (BR-TRA-03 a BR-TRA-06, BR-IA-04) | ianache (Jefe de Ingeniería) | Respuestas a P-05, US2-Q2, P-07 y P-08 (EVD-2026-0126 a 0129) | 2026-09-27 |
| Datos maestros visibles para otros colaboradores (BR-PTY-20, P-52); Instructor confirmado (BR-FOR-05, P-49 en parte); se versionan las competencias, no los roles (BR-CAT-22, P-50 en parte) | ianache (Jefe de Ingeniería) | EVD-2026-0130 a 0132 | 2026-09-27 |
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
| Regla: no existe certificación automática; toda certificación la firma un evaluador humano y queda registrada con quién, cuándo y evidencias | S-01:L80-L81, L101, L103; BR-ACR-02 a BR-ACR-04 | Jefe de Ingeniería | Pendiente |
| Regla: la brecha se calcula por competencia como nivel requerido − nivel certificado | S-01:L59; BR-BRE-01 | Jefe de Ingeniería | Pendiente (depende de P-12) |
| Proceso: orden funcional catálogo → requerimiento → búsqueda → asignación | S-01:L58, L136 | Responsable de producto | Pendiente (P-05 respondida el 2026-09-27: la asignación la hace el Jefe de Ingeniería o un ADMIN) |
| Supuesto H-01: hoy no hay catálogo común | S-01:L35 | Jefe de Ingeniería | Pendiente de evidencia documental |

## 12. Handoff para el siguiente rol

### Qué puede usar el siguiente rol

- Para **`ux-requirements-analyzer` (UX-101)**, derivar UXR de:
  - US-004, que está READY.
  - US-001, US-002, US-003, US-005 y US-006, que están CONDITIONAL. En cada UXR hay que citar el vacío que la condiciona.
- Actores, procesos, datos y reglas de las §5 y §8, con su evidencia.
- El vocabulario de GLS-001: usar los términos aprobados tal como están definidos.

### Qué debe validar antes de continuar

- Las preguntas de prioridad alta: P-42, P-50.1 y RCP-Q1 (VIS-§11.4 quedó respondida por SPEC-001 D2; P-22, P-26, P-28, P-36, P-37, P-38 y P-39 quedaron respondidas el 2026-09-27, y P-05, P-07 y P-08 también, con P-50 en parte).
- La validación humana de este pack (§10).
- US-007 (asignación) ya se puede refinar y llevar a UXR: P-05 quedó respondida el 2026-09-27; quedan P-53 y P-45. US-008 (brechas por producto) ya tiene actor (P-17 respondida, BR-BRE-06); falta P-45 y la regla de agregación por producto.

### Artefactos relacionados

- [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) · [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) · [GLS-001](../../business/glossary/GLS-001-glosario-de-negocio.md) · [USC-001](../USC-001-user-stories-plataforma-gestion-formacion.md)
