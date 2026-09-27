---
type: Business Rules Catalog
title: "BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación"
description: "Catálogo de reglas de negocio, estados, validaciones, permisos y excepciones extraídos de la visión VIS-001, con registro de evidencias, vacíos y preguntas abiertas."
tags: [business-rules, formacion, colaboradores, party, competencias, certificacion, certificados de curso, gitlab, ia]
status: draft
generated:
  by: "af-business-rule-extractor/1.0"
  at: "2026-09-27T15:00:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: repository-guidelines
    resource: /AGENTS.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
---

# BRC-001 — Reglas de negocio de la Plataforma de Gestión de Formación

> **Procedencia:** la única fuente funcional disponible es [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md), que está en `draft` y sin verificación humana. Ninguna regla de este catálogo está verificada. Los localizadores `VIS-001:Lnn` indican la línea del documento fuente.

## Objetivo y alcance

- **Pregunta:** ¿qué reglas de negocio, estados, validaciones, permisos y excepciones se pueden sostener hoy con la evidencia disponible sobre la plataforma?
- **Consumidor previsto:** `af-user-story-refiner` (User Stories con criterios Given/When/Then) y los responsables humanos que validan el catálogo (Jefe de Ingeniería, responsable del producto).
- **Incluye:** catálogo de competencias, requerimientos de proyecto, brechas, certificación, evidencia de GitLab asistida por IA, certificados de curso, integraciones y transparencia.
- **Excluye:** diseño técnico, modelo de datos, APIs, y todo lo que VIS-001 declara fuera de alcance (§7): hospedar contenido de cursos, verificación pública de certificados de curso, evaluación salarial o de RR. HH. y gestión de proyectos. Por decisión del 2026-09-27 también quedan fuera la escala salarial de los niveles de rol y el MOF (Manual de Operaciones y Funciones), BR-CAT-18.

## Resultado

Se catalogaron **32 entradas**: 26 reglas y 6 vacíos. Tres áreas tienen reglas suficientes para redactar historias: el catálogo y su escala de niveles, la certificación con firma humana y los certificados de curso. Hay tres áreas con vacíos que impiden escribir criterios de aceptación completos:

1. **Evidencia por nivel (L1–L4):** respondida en lo esencial. Por decisión de ianache (Jefe de Ingeniería), 2026-09-26, el tipo de evidencia que demuestra cada nivel se define por competencia y nivel (BR-ACR-07). Siguen abiertos los detalles P-21 a P-24.
2. **Decisión de asignación:** no se sabe si la plataforma solo recomienda o si hay un flujo de aprobación (P-05).
3. **Permisos:** la fuente no define quién puede ver o editar qué, salvo unos pocos casos (P-08, P-09).

**Actualización (2026-09-27):** con [SPEC-001](../../requirement/specs/SPEC-001-gestion-de-colaboradores.md) se añadieron 18 reglas de información maestra de colaboradores (BR-PTY-01 a BR-PTY-18) y las evidencias EVD-2026-0076 a EVD-2026-0095. Son decisiones humanas registradas, pero siguen sin verificar.

La fuente no define **estados** explícitos. Los únicos que se pueden derivar son los de la propuesta de nivel hecha por la IA (BR-IA-02).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0001 | Los productos en alcance son CLocator (v1), CLocator v2 (C-Go), SIGO y SmartSuite. | VIS-001:L23 | fact | high |
| EVD-2026-0002 | Modelo: Producto → Rol → Competencia → Nivel requerido. | VIS-001:L56 | fact | medium |
| EVD-2026-0003 | Escala de niveles L1 Principiante, L2 Autónomo, L3 Avanzado, L4 Experto / Referente. | VIS-001:L62-69 | decision | high |
| EVD-2026-0004 | Cada rol exige un nivel mínimo por competencia. | VIS-001:L71 | fact | medium |
| EVD-2026-0005 | El Jefe de Ingeniería es el dueño del catálogo de roles y competencias de cada producto. | VIS-001:L51, L162 | decision | high |
| EVD-2026-0006 | El papel del Responsable de producto frente al Jefe de Ingeniería está por confirmar. | VIS-001:L44, L155 | gap | high |
| EVD-2026-0007 | Un proyecto pertenece a un producto y declara requerimientos (Rol + Competencias + Nivel). El PM los declara. | VIS-001:L58, L77 | fact | medium |
| EVD-2026-0008 | Brecha = Nivel requerido − Nivel certificado. | VIS-001:L59 | fact | medium |
| EVD-2026-0009 | El nivel certificado se respalda con evidencia de formación, práctica evaluada o desempeño en proyecto (GitLab). | VIS-001:L57, L71 | fact | medium |
| EVD-2026-0010 | Qué evidencia exige cada nivel es una pregunta abierta. | VIS-001:L71, L150 | gap | high |
| EVD-2026-0011 | Un evaluador revisa las evidencias y certifica el nivel; se registra quién, cuándo y con qué evidencia. | VIS-001:L80 | fact | medium |
| EVD-2026-0012 | Ninguna certificación ocurre sin firma humana; la IA propone y justifica pero no decide. | VIS-001:L81, L101 | decision | high |
| EVD-2026-0013 | Un agente analiza issues, MRs y milestones de GitLab y propone un nivel con justificación; un humano aprueba, ajusta o rechaza. | VIS-001:L81 | decision | high |
| EVD-2026-0014 | La evidencia de GitLab es de uso interno y se accede en solo lectura. | VIS-001:L95, L165 | decision | high |
| EVD-2026-0015 | La cantidad de issues cerrados no prueba dominio; pesan la calidad y el contexto. | VIS-001:L102 | fact | medium |
| EVD-2026-0016 | El colaborador ve su perfil, sus evidencias y las propuestas de la IA sobre él. | VIS-001:L104 | fact | medium |
| EVD-2026-0017 | Se certifica la aprobación del curso final según el cumplimiento de los objetivos del curso. | VIS-001:L82, L164 | decision | high |
| EVD-2026-0018 | El certificado de curso no equivale a un nivel certificado. | VIS-001:L82 | decision | high |
| EVD-2026-0019 | El PDF del certificado de curso se pide a docsuite por API REST y la plataforma guarda la referencia. Sin verificación pública. | VIS-001:L82, L109 | decision | high |
| EVD-2026-0020 | Google Classroom se integra en solo lectura; Drive en enlace y lectura. La plataforma no hospeda contenido. | VIS-001:L87, L93-94, L100 | decision | high |
| EVD-2026-0021 | Si falla la integración con Classroom, se evaluará gestión propia de material y progreso; es una decisión posterior, fuera del alcance actual. | VIS-001:L89, L108 | decision | high |
| EVD-2026-0022 | En H1 la certificación es manual; el agente de GitLab llega en H3. | VIS-001:L132, L134 | decision | high |
| EVD-2026-0023 | Cómo se decide una asignación está abierto. | VIS-001:L154 | gap | high |
| EVD-2026-0024 | Cómo se versiona el catálogo está abierto. | VIS-001:L142, L151 | gap | high |
| EVD-2026-0025 | Cómo se relaciona el certificado de curso con los niveles está abierto. | VIS-001:L156 | gap | high |
| EVD-2026-0026 | Gestión de formación / RR. HH. emite certificados de curso y gestiona certificaciones. | VIS-001:L45 | fact | medium |
| EVD-2026-0027 | El KPI 1 se mide sobre "proyectos activos"; la fuente no define los estados de un proyecto. | VIS-001:L119 | gap | medium |
| EVD-2026-0052 | Para cada competencia y cada nivel (L1–L4), se define qué tipo de evidencia demuestra el logro de ese nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-01 | decision | high |
| EVD-2026-0053 | Las competencias forman un catálogo único: cada competencia existe una sola vez y se puede exigir en varios roles y productos, con el mismo requisito de evidencia por nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q1 (IMD-001) | decision | high |
| EVD-2026-0054 | Un requerimiento de proyecto no indica niveles propios: toma del catálogo las competencias y los niveles requeridos que define su rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q2 (IMD-001) | decision | high |
| EVD-2026-0055 | El requisito de evidencia de cada competencia y nivel es una evidencia concreta (por ejemplo, un curso determinado, una práctica concreta o un tipo de entregable) dentro de una de las tres categorías: formación, práctica evaluada o desempeño en proyecto. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-22 | decision | high |
| EVD-2026-0056 | Los roles son independientes de los productos (por ejemplo, Analista de Calidad o Developer): los mismos roles se desempeñan en los proyectos de cualquier producto. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q4 (IMD-001) | decision | high |
| EVD-2026-0057 | Un nivel de una competencia puede exigir varias evidencias: se definen todas las evidencias necesarias para demostrar que el colaborador alcanza ese nivel, y certificarlo exige presentarlas todas. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-23 | decision | high |
| EVD-2026-0058 | Un requerimiento puede pedir solo algunas de las competencias de su rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q6 (IMD-001) | decision | high |
| EVD-2026-0059 | Un rol tiene un conjunto de competencias (por ejemplo, un Developer debe ser competente creando pruebas unitarias y creando unidades de despliegue). Los roles tienen niveles de rol, normalmente varios niveles Junior y varios Senior, y las competencias del rol se definen para cada nivel de rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q9 (IMD-001) | decision | high |
| EVD-2026-0060 | Algunas competencias son transversales, es decir, comunes a varios roles; por ejemplo, las competencias blandas como el trabajo en equipo. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q9 (IMD-001) | decision | high |
| EVD-2026-0061 | Jefe de proyecto es un rol del catálogo, y quien lo desempeña también tiene un perfil de competencias con niveles (Junior, Senior). | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q3 (IMD-001) | decision | high |
| EVD-2026-0062 | El Evaluador y el Jefe de Ingeniería son quienes gestionan todo el programa de formación. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q3 (IMD-001) | decision | high |
| EVD-2026-0063 | Los roles del catálogo son normalmente: analista funcional, developer, analista QA, analista BI, diseñador UX, diseñador UI y jefe de proyecto. Se pueden definir otros roles como parte del catálogo. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q3 (IMD-001) | decision | high |
| EVD-2026-0064 | El requisito de evidencia determina lo que el colaborador debe cumplir para certificar un determinado nivel de una competencia en el rol que le es asignado. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q5 (IMD-001) | decision | high |
| EVD-2026-0065 | Al colaborador le es asignado un rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en la misma respuesta | decision | high |
| EVD-2026-0066 | Una evidencia específica, como un entregable de un proyecto real (por ejemplo, el Plan de Pruebas del Sprint 1 del proyecto "Optimización de Rutas" de SmartSuite), se puede utilizar para evidenciar el nivel de logro de una competencia. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IM-Q8 (IMD-001) | decision | high |
| EVD-2026-0067 | Un requerimiento indica el nivel de rol que necesita (por ejemplo, Developer Senior 2). | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-25 | decision | high |
| EVD-2026-0068 | Cada nivel de rol exige sus competencias con un nivel L1–L4 esperado; por ejemplo, a un Developer Junior Nivel 1 se le exigen competencias de L1, y a un Developer Junior Nivel 2 se le exige al menos una competencia de nivel superior a L1. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-26 | decision | high |
| EVD-2026-0069 | Las competencias transversales se asignan a los roles. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-27 | decision | high |
| EVD-2026-0070 | Por cada competencia hay una rúbrica que, para cada nivel L1 a L4, define cómo se evidencia la competencia, es decir, lo que se espera que el colaborador evidencie para certificarlo en ese nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IMD-001 (rúbrica) | decision | high |
| EVD-2026-0071 | Cuando se define un Rol-Nivel (niveles 1, 2, 3 o 4 de un rol) se establecen sus competencias y el nivel L1 a L4 esperado del desarrollo de cada competencia. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a IMD-001 (Rol-Nivel) | decision | high |
| EVD-2026-0072 | Un requerimiento no puede pedir competencias que no pertenecen a su rol: si se pide un Developer Junior 1, se entiende que las competencias definidas para ese rol y nivel son las idóneas para el proyecto. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-29 | decision | high |
| EVD-2026-0073 | Líder de proyecto y Jefe de proyecto representan lo mismo; se usa "Jefe de proyecto" en toda la base de conocimiento, con "Líder de proyecto" como sinónimo. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-30 | decision | high |
| EVD-2026-0074 | Los cursos se diseñan para desarrollar competencias en un determinado nivel (L1 a L4), para los roles y niveles de rol a los que están dirigidos. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-32 | decision | high |
| EVD-2026-0075 | Se usa "certificar" (certificación, nivel certificado) para las competencias de la persona, en lugar de "acreditar": en términos académicos se acredita el programa y se certifican las competencias de la persona. El documento que acredita la aprobación de un curso se llama "certificado de curso". | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26, en respuesta a P-32 | decision | high |
| EVD-2026-0076 | La plataforma es el sistema de registro de la información maestra de colaboradores; altas, cambios y bajas se hacen en ella, sin integración con RR. HH. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D2 | decision | high |
| EVD-2026-0077 | Los usuarios de Keycloak se gestionan aparte; la plataforma solo guarda el identificador que vincula a la persona con su usuario. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D4 | decision | high |
| EVD-2026-0078 | La información maestra sigue el patrón Party del Universal Data Model: parte (persona u organización), rol de la parte, relación entre partes, identificación y medio de contacto; la asignación de Rol-Nivel es una entidad aparte. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D5 | decision | high |
| EVD-2026-0079 | Una persona puede tener asignado más de un rol, con un solo nivel vigente por rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D6 | decision | high |
| EVD-2026-0080 | Colaborador es una persona con un rol vigente de Empleado o de Contratista; no es una entidad propia. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D7 | decision | high |
| EVD-2026-0081 | Los medios de contacto incluyen perfiles profesionales en línea (LinkedIn, GitHub y otros relevantes para el personal técnico). | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D8 | decision | high |
| EVD-2026-0082 | Existe un código de colaborador interno, único y obligatorio. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D9 | decision | high |
| EVD-2026-0083 | Se aceptan como identificación DNI, carné de extranjería y pasaporte para personas, y RUC para organizaciones. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D10 | decision | high |
| EVD-2026-0084 | El Jefe de Ingeniería mantiene toda la información maestra; el colaborador edita por sí mismo sus perfiles profesionales y su teléfono laboral. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D11 | decision | high |
| EVD-2026-0085 | El correo laboral de un contratista es el de su proveedor; el de un empleado es el de COMSATEL. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D13 | decision | high |
| EVD-2026-0086 | Cuando una persona se va, sus datos personales (PII) se anonimizan; no se borran los registros. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D14 | decision | high |
| EVD-2026-0087 | La anonimización se ejecuta a demanda, con notificación al Jefe de Ingeniería cuando se cumple un plazo configurable. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D15 | decision | high |
| EVD-2026-0088 | El código de colaborador y las referencias de auditoría no se anonimizan. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D16 | decision | high |
| EVD-2026-0089 | El plazo de anonimización se cuenta desde que se registra la baja. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D17 | decision | high |
| EVD-2026-0090 | Al vencer el plazo, se envía un correo automático al Jefe de Ingeniería vigente, a sus medios de contacto de tipo correo electrónico. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D18 | decision | high |
| EVD-2026-0091 | Los correos se envían desde una cuenta de Gmail empresarial de la empresa. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D19 | decision | high |
| EVD-2026-0092 | Se espera un único Jefe de Ingeniería vigente; si hay más de uno, el correo se envía a todos. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D20 | decision | high |
| EVD-2026-0093 | Al asignar un segundo rol vigente de Jefe de Ingeniería, la plataforma avisa sin impedirlo. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D21 | decision | high |
| EVD-2026-0094 | Las credenciales de la cuenta de Gmail se guardan en HashiCorp Vault, la plataforma para parametría y datos sensibles. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D22 | decision | high |
| EVD-2026-0095 | El plazo de anonimización se guarda en la base de datos, con su auditoría. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D23 | decision | high |
| EVD-2026-0096 | El Jefe de Ingeniería, responsable de las capacitaciones, define los requisitos de evidencia de cada competencia y nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-21 | decision | high |
| EVD-2026-0097 | Se confirma la respuesta a P-22: el requisito de evidencia es una evidencia concreta dentro de una de las tres categorías. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-22 | decision | high |
| EVD-2026-0098 | Cada requisito de evidencia de una competencia y nivel se declara como "requerida" (se debe satisfacer siempre) o "deseada" (puede o no presentarse; si se presenta, refuerza la certificación del nivel objetivo). | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-23 | decision | high |
| EVD-2026-0099 | La definición de los requisitos de evidencia es un proceso progresivo; lo ideal es tener definidos todos los tipos de evidencia. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-24 | decision | high |
| EVD-2026-0100 | No hay una cantidad general de niveles de rol: los niveles se definen para cada rol cuando el rol se registra. Los niveles de un rol se asocian con una escala salarial y determinan las responsabilidades del colaborador, lo que forma parte del MOF (Manual de Operaciones y Funciones), fuera de alcance de la plataforma por ahora. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-26 | decision | high |
| EVD-2026-0101 | Al registrar un rol se definen sus niveles, por ejemplo Developer Junior (Nivel 1), Developer Junior (Nivel 2) y Developer Junior (Nivel 3). En la organización los niveles se asocian con años de experiencia en el rol, formación técnica, entre otros, y se vinculan a una escala salarial (fuera de alcance). | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-36 | decision | high |
| EVD-2026-0102 | La rúbrica define el comportamiento y el logro visible y verificable (a través de evidencias). Las rúbricas las define y aprueba el Jefe de Ingeniería. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-37 | decision | high |
| EVD-2026-0103 | Cuando se registra un colaborador se le asigna inicialmente un nivel según el rol que se le asigna. Después, a medida que se desempeña en los proyectos, se evalúa la evolución en las competencias del rol, a través de los cursos o evaluando directamente su desempeño en los proyectos, donde hay evidencias específicas de lo que produce. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-28 | decision | high |
| EVD-2026-0104 | BR-REQ-07 sigue vigente. Cuando un proyecto requiere colaboradores de un Rol-Nivel, por defecto se asumen todas las competencias de ese rol y nivel; el Jefe de proyecto que registra el requerimiento puede refinarlo retirando las competencias que no considere necesarias para el proyecto. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-38 | decision | high |
| EVD-2026-0105 | El Evaluador y el Jefe de Ingeniería son solo gestores del programa. Por ahora quedan fuera del proceso de evaluación, aunque su rol también tiene competencias definidas, como el de cualquier colaborador. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-31 | decision | high |
| EVD-2026-0106 | El colaborador no declara el rol al que aspira. Al registrarlo, el Jefe de Ingeniería le asigna rol y nivel. El colaborador ve sus propias brechas. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-15 (USC-001) | decision | high |
| EVD-2026-0107 | La búsqueda muestra también los candidatos que no alcanzan el nivel, con su brecha. Por defecto se ordena de mayor a menor cumplimiento (primero los de menor brecha), y se puede cambiar a de mayor a menor brecha. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-16 (USC-001) | decision | high |
| EVD-2026-0108 | Las consultas de brechas agregadas las realizan el Jefe de Ingeniería, el Jefe de proyecto y cualquier usuario con privilegios de ADMIN. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-17 (USC-001) | decision | high |
| EVD-2026-0109 | Al diseñar un curso se define, para cada rol al que se orienta, el nivel mínimo y el nivel objetivo a alcanzar. Como un curso no necesariamente desarrolla todas las competencias del rol y nivel objetivo, quien diseña el curso selecciona cuáles de esas competencias busca desarrollar. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-18 (USC-001) | decision | high |
| EVD-2026-0110 | Cuando se evidencia que se cumplen los requisitos "requeridos", la plataforma propone automáticamente aprobar el curso. El evaluador emite la conclusión final: debe tomar como base la propuesta automática y, si decide distinto, debe sustentar su decisión para que quede registro de auditoría. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-19 (USC-001) | decision | high |
| EVD-2026-0111 | Ajustar o rechazar una propuesta de la IA exige registrar un motivo. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-27, en respuesta a P-20 (USC-001) | decision | high |

Todas las evidencias comparten estos campos del esquema:

```yaml
source_type: document
observed_at: 2026-09-26T18:45:38-05:00
freshness: current
owner: Jefe de Ingeniería (catálogo, niveles, certificación) · Responsable del producto (resto)
```

**Criterio de clasificación:** se usa la etiqueta que VIS-001 asigna (Hecho, Decisión, Supuesto). Las afirmaciones sin etiqueta explícita en la fuente se registran como `fact` con confianza `medium`.

## Reglas, dependencias e impactos

### Catálogo de competencias

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-CAT-01 | Estructura (modificada por BR-CAT-08) | ~~El catálogo se organiza por producto.~~ Cada rol tiene competencias, y cada competencia tiene un nivel requerido en ese rol. Roles y competencias son comunes a todos los productos (BR-CAT-07, BR-CAT-08). | EVD-2026-0001, 0002, 0056 |
| BR-CAT-02 | Validación | Todo nivel requerido o certificado debe pertenecer a la escala L1–L4. | EVD-2026-0003 |
| BR-CAT-03 | Validación | Cada competencia de un rol debe tener un nivel mínimo definido; desde BR-CAT-10, para cada nivel de rol. | EVD-2026-0004, 0059 |
| BR-CAT-04 | Permiso | El Jefe de Ingeniería gobierna el catálogo de los 4 productos. | EVD-2026-0005 |
| BR-CAT-05 | Vacío | Participación del Responsable de producto en el mantenimiento del catálogo: sin definir. | EVD-2026-0006 → P-06 |
| BR-CAT-06 | Vacío | Versionado del catálogo y efecto de un cambio sobre requerimientos y certificaciones existentes: sin definir. | EVD-2026-0024 → P-02 |
| BR-CAT-07 | Estructura | Las competencias forman un catálogo único: cada competencia existe una sola vez y se puede exigir en varios roles y productos, con el mismo requisito de evidencia por nivel. | EVD-2026-0053 |
| BR-CAT-08 | Estructura | Los roles son independientes de los productos (por ejemplo, Analista de Calidad o Developer): los mismos roles se desempeñan en los proyectos de cualquier producto. | EVD-2026-0056 |
| BR-CAT-09 | Estructura | Un rol tiene niveles de rol. No hay una cantidad general: los niveles de cada rol se definen al registrar el rol, por ejemplo Developer Junior (Nivel 1), (Nivel 2) y (Nivel 3). *Revisada el 2026-09-27 (P-26, P-36): antes decía "normalmente varios niveles Junior y varios Senior".* | EVD-2026-0059, 0100, 0101 |
| BR-CAT-10 | Estructura | Las competencias de un rol se definen para cada nivel de rol. | EVD-2026-0059 |
| BR-CAT-11 | Estructura | Algunas competencias son transversales, es decir, comunes a varios roles; por ejemplo, las competencias blandas como el trabajo en equipo. Se asignan a los roles; no aplican automáticamente. | EVD-2026-0060, 0069 |
| BR-CAT-12 | Contenido | Los roles del catálogo son normalmente: analista funcional, developer, analista QA, analista BI, diseñador UX, diseñador UI y jefe de proyecto. Se pueden definir otros roles como parte del catálogo. | EVD-2026-0063 |
| BR-CAT-13 | Estructura | Jefe de proyecto es un rol del catálogo, y quien lo desempeña también tiene un perfil de competencias con niveles (Junior, Senior). | EVD-2026-0061 |
| BR-CAT-14 | Estructura | Cuando se define un Rol-Nivel se establecen sus competencias y el nivel L1 a L4 esperado del desarrollo de cada competencia. Por ejemplo, a un Developer Junior Nivel 1 se le exigen competencias de L1, y a un Developer Junior Nivel 2 al menos una de nivel superior a L1. *Revisada el 2026-09-27 (P-26): la cantidad de niveles la define cada rol (BR-CAT-09); ya no se supone "niveles 1 a 4".* | EVD-2026-0068, 0071, 0100 |
| BR-CAT-15 | Estructura | Por cada competencia hay una rúbrica que, para cada nivel L1 a L4, define cómo se evidencia la competencia, es decir, lo que se espera que el colaborador evidencie para certificarlo en ese nivel. La rúbrica describe el comportamiento y el logro visible y verificable; se verifica a través de evidencias. *Precisada el 2026-09-27 (P-37).* | EVD-2026-0070, 0102 |
| BR-CAT-16 | Permiso | El Jefe de Ingeniería, responsable de las capacitaciones, define los requisitos de evidencia de cada competencia y nivel. | EVD-2026-0096 |
| BR-CAT-17 | Proceso | Los requisitos de evidencia se definen de forma progresiva: no es obligatorio definir todos los niveles de todas las competencias a la vez, aunque lo ideal es tenerlos todos definidos. | EVD-2026-0099 |
| BR-CAT-18 | Alcance | La escala salarial asociada a los niveles de rol, las responsabilidades del colaborador (MOF) y los criterios de nivel de la organización (años de experiencia en el rol, formación técnica, entre otros) están fuera de alcance de la plataforma por ahora. | EVD-2026-0100, 0101 |
| BR-CAT-19 | Permiso | El Jefe de Ingeniería define y aprueba las rúbricas de las competencias. | EVD-2026-0102 |

### Requerimientos de proyecto y asignación

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-REQ-01 | Estructura | Un proyecto pertenece a un producto. | EVD-2026-0007 |
| BR-REQ-02 | Permiso | El PM declara los requerimientos de su proyecto indicando el rol; competencias y niveles se toman del catálogo (BR-REQ-06). | EVD-2026-0007, EVD-2026-0054 |
| BR-REQ-03 | RETIRADA (2026-09-26) | ~~Un requerimiento solo puede usar roles y competencias del catálogo del producto del proyecto.~~ No aplica: roles y competencias no pertenecen a un producto (BR-CAT-07, BR-CAT-08). | EVD-2026-0056 |
| BR-REQ-04 | Vacío | Decisión de asignación: recomendación al PM o flujo de aprobación. | EVD-2026-0023 → P-05 |
| BR-REQ-05 | Vacío | Estados de un proyecto (qué es "activo"). | EVD-2026-0027 → P-11 |
| BR-REQ-06 | Estructura | Un requerimiento de proyecto no indica niveles de competencia propios: toma del catálogo los niveles L1–L4 esperados de las competencias que pide, según el rol y el nivel de rol que indica (BR-REQ-08). | EVD-2026-0054, 0058, 0067 |
| BR-REQ-07 | Estructura | Un requerimiento puede pedir solo algunas de las competencias de su Rol-Nivel. Por defecto asume todas las competencias del Rol-Nivel indicado; el Jefe de proyecto que lo registra puede refinarlo retirando las que no considere necesarias. *Precisada el 2026-09-27 (P-38).* | EVD-2026-0058, 0104 |
| BR-REQ-08 | Estructura | Un requerimiento indica el nivel de rol que necesita (por ejemplo, Developer Senior 2). | EVD-2026-0067 |
| BR-REQ-09 | Validación | Un requerimiento no puede pedir competencias que no pertenezcan a su Rol-Nivel. | EVD-2026-0072 |
| BR-REQ-10 | Permiso | Solo el Jefe de proyecto que registra el requerimiento puede retirar competencias de las que el Rol-Nivel aporta por defecto. No puede agregar competencias ajenas al Rol-Nivel (BR-REQ-09). | EVD-2026-0104, 0072 |

### Brechas

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-BRE-01 | Cálculo | Brecha = nivel requerido − nivel certificado, por competencia. | EVD-2026-0008 |
| BR-BRE-02 | Cálculo (inferencia) | La resta supone que L1–L4 es una escala ordinal comparable (L1 = 1 … L4 = 4). | Inferida de EVD-2026-0003 y 0008; confirmar → P-12 |
| BR-BRE-03 | Caso límite | Sin definir: cómo se calcula la brecha si el colaborador no tiene nivel certificado, y si una brecha negativa (nivel superior al requerido) cuenta como cubierta. | → P-12 |
| BR-BRE-04 | Permiso | El colaborador ve sus propias brechas. No declara un rol al que aspira: su rol y nivel los asigna el Jefe de Ingeniería al registrarlo (BR-PRF-02, BR-PTY-17). | EVD-2026-0106 |
| BR-BRE-05 | Presentación | La búsqueda de candidatos muestra también a quienes no alcanzan el nivel requerido, con su brecha. Por defecto ordena de menor a mayor brecha (primero el mayor cumplimiento); el usuario puede invertir el orden. | EVD-2026-0107 |
| BR-BRE-06 | Permiso | Consultan las brechas agregadas el Jefe de Ingeniería, el Jefe de proyecto y cualquier usuario con privilegios de ADMIN. | EVD-2026-0108 |

### Certificación

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-ACR-01 | Validación | Un nivel certificado debe estar respaldado por al menos una evidencia de tipo formación, práctica evaluada o desempeño en proyecto. | EVD-2026-0009 |
| BR-ACR-02 | Permiso | Solo un evaluador humano certifica un nivel. | EVD-2026-0011, 0012 |
| BR-ACR-03 | Auditoría | Cada certificación registra quién certificó, cuándo y con qué evidencia. | EVD-2026-0011 |
| BR-ACR-04 | Excepción prohibida | No existe certificación automática: ningún nivel se certifica sin firma humana, tampoco a partir de una propuesta de la IA. | EVD-2026-0012 |
| BR-ACR-05 | Alcance | En H1 la certificación es manual. | EVD-2026-0022 |
| BR-ACR-06 | Vacío (resuelto en lo esencial por BR-ACR-07) | Evidencia mínima exigida por cada nivel L1–L4. | EVD-2026-0010 → P-01 |
| BR-ACR-07 | Validación | Para cada competencia y cada nivel (L1–L4), se define qué tipo de evidencia demuestra el logro de ese nivel. Certificar un nivel exige evidencia del tipo definido para esa competencia y ese nivel. | EVD-2026-0052 |
| BR-ACR-08 | Validación | El requisito de evidencia de cada competencia y nivel es una evidencia concreta (por ejemplo, un curso determinado, una práctica concreta o un tipo de entregable) dentro de una de las tres categorías: formación, práctica evaluada o desempeño en proyecto. | EVD-2026-0055 |
| BR-ACR-09 | Validación | Un nivel de una competencia puede exigir varias evidencias: se definen todas las evidencias necesarias para demostrar que el colaborador alcanza ese nivel, y certificarlo exige presentar todas las **requeridas** (BR-ACR-12). *Revisada el 2026-09-27 (P-23): antes decía "presentarlas todas".* | EVD-2026-0057, 0098 |
| BR-ACR-10 | Validación | El requisito de evidencia determina lo que el colaborador debe cumplir para certificar un nivel de una competencia en el rol que tiene asignado. | EVD-2026-0064 |
| BR-ACR-11 | Validación | Una evidencia específica, como un entregable de un proyecto real (por ejemplo, el Plan de Pruebas del Sprint 1 del proyecto "Optimización de Rutas" de SmartSuite), se puede utilizar para evidenciar el nivel de logro de una competencia. El requisito define qué se exige (por ejemplo, un plan de pruebas); la evidencia es lo que se presenta. | EVD-2026-0066 |
| BR-ACR-12 | Validación | Cada requisito de evidencia de una competencia y nivel se declara como **requerida** (se debe satisfacer siempre para certificar el nivel) o **deseada** (puede o no presentarse; si se presenta, refuerza la certificación del nivel objetivo). | EVD-2026-0098 |

### Evidencia de GitLab asistida por IA (H3)

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-IA-01 | Restricción | La plataforma lee GitLab (issues, MRs, milestones) en solo lectura y usa esa evidencia solo internamente. | EVD-2026-0014 |
| BR-IA-02 | Estado | La propuesta de nivel de la IA siempre incluye justificación y termina en uno de tres estados: aprobada, ajustada o rechazada por un humano. | EVD-2026-0013 |
| BR-IA-03 | Principio | La cantidad de issues cerrados no basta para proponer un nivel. Falta un criterio medible de calidad y contexto. | EVD-2026-0015 → P-13 |
| BR-IA-04 | Permiso | El colaborador puede ver las propuestas de la IA sobre él. | EVD-2026-0016 |
| BR-IA-05 | Auditoría | Ajustar o rechazar una propuesta de nivel de la IA exige registrar el motivo. | EVD-2026-0111 |

### Certificados de curso (H2)

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-CER-01 | Condición | Se emite un certificado de curso cuando el colaborador aprueba el curso final, según el cumplimiento de sus objetivos. | EVD-2026-0017 |
| BR-CER-02 | Restricción | Un certificado de curso no certifica, por sí solo, un nivel de competencia. | EVD-2026-0018 |
| BR-CER-03 | Integración | El PDF se genera en docsuite por API REST y la plataforma guarda solo la referencia. | EVD-2026-0019 |
| BR-CER-04 | Restricción | No hay verificación pública de certificados de curso. | EVD-2026-0019 |
| BR-CER-05 | Permiso | Gestión de formación / RR. HH. emite los certificados de curso. | EVD-2026-0026 |
| BR-CER-06 | Cálculo | Cuando se evidencia que se cumplen los requisitos requeridos, la plataforma propone automáticamente aprobar el curso. La propuesta no aprueba el curso por sí sola. | EVD-2026-0110 |
| BR-CER-07 | Permiso y auditoría | El evaluador emite la conclusión final sobre la aprobación del curso, tomando como base la propuesta automática. Si decide distinto, debe registrar el sustento de su decisión, que queda en la auditoría. | EVD-2026-0110 |
| BR-FOR-01 | Estructura | Los cursos se diseñan para desarrollar competencias en un determinado nivel (L1 a L4), para los roles y niveles de rol a los que están dirigidos. Para cada rol al que se orienta, el curso define un nivel de rol mínimo y un nivel de rol objetivo. *Precisada el 2026-09-27 (P-18).* | EVD-2026-0074, 0109 |
| BR-FOR-02 | Estructura | Un curso no necesariamente desarrolla todas las competencias del Rol-Nivel objetivo: quien diseña el curso selecciona cuáles de ellas desarrolla. | EVD-2026-0109 |
| BR-TER-01 | Terminología | Se usa "certificar" (certificación, nivel certificado) para las competencias de la persona, en lugar de "acreditar": en términos académicos se acredita el programa y se certifican las competencias de la persona. El documento que acredita la aprobación de un curso se llama "certificado de curso". Los IDs de reglas BR-ACR-* y los nombres de archivo conservan "acreditar" porque son permanentes. | EVD-2026-0075 |

### Integraciones y contenido

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-INT-01 | Restricción | Classroom se usa en solo lectura; Drive en enlace y lectura. La plataforma no hospeda material de cursos. | EVD-2026-0020 |
| BR-INT-02 | Excepción | Si la integración con Classroom falla, puede evaluarse una gestión propia de material y progreso. Requiere una decisión humana posterior y no forma parte del alcance actual. | EVD-2026-0021 |

### Transparencia

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-TRA-01 | Permiso | El colaborador puede ver su perfil y sus evidencias. | EVD-2026-0016 |
| BR-PRG-01 | Responsabilidad | El Evaluador y el Jefe de Ingeniería son quienes gestionan todo el programa de formación. Son solo gestores del programa. | EVD-2026-0062, 0105 |
| BR-PRF-01 | Estructura | Al colaborador le es asignado un rol; puede tener varios, con un nivel vigente por rol (BR-PTY-11). | EVD-2026-0065, EVD-2026-0079 |
| BR-PRF-02 | Estructura | Al registrar un colaborador se le asigna un nivel inicial del rol que se le asigna. Después se evalúa la evolución de sus competencias del rol a través de los cursos o de su desempeño en los proyectos, con evidencias específicas de lo que produce. | EVD-2026-0103 |
| BR-PRG-02 | Alcance | Por ahora el Evaluador y el Jefe de Ingeniería quedan fuera del proceso de evaluación, aunque sus roles también tienen competencias definidas. | EVD-2026-0105 |

### Colaboradores e información maestra (Party)

Reglas de [SPEC-001](../../requirement/specs/SPEC-001-gestion-de-colaboradores.md).

| ID | Tipo | Regla | Evidencia |
|---|---|---|---|
| BR-PTY-01 | Responsabilidad | La plataforma es el sistema de registro de la información maestra de colaboradores, personas externas y organizaciones; no hay integración con RR. HH. | EVD-2026-0076 |
| BR-PTY-02 | Estructura | Toda parte es una Persona o una Organización (patrón Party del UDM). Su participación se expresa con roles de la parte y relaciones entre partes, cada uno con vigencia (desde y hasta). | EVD-2026-0078 |
| BR-PTY-03 | Estructura | Tipos de rol de la parte: Empleado, Contratista, Evaluador y Jefe de Ingeniería (personas); Organización interna, Unidad organizacional y Proveedor (organizaciones). Los tipos son ampliables. | EVD-2026-0078 |
| BR-PTY-04 | Estructura | Tipos de relación entre partes: empleo (empleado ↔ organización interna), contratación (contratista ↔ proveedor), pertenencia (persona ↔ unidad), estructura (unidad ↔ unidad padre) y reporte (persona ↔ jefe directo). | EVD-2026-0078 |
| BR-PTY-05 | Cálculo | Un colaborador es una persona con un rol vigente de Empleado o de Contratista. | EVD-2026-0080 |
| BR-PTY-06 | Validación | Toda persona colaboradora tiene un código de colaborador interno, único y obligatorio. | EVD-2026-0082 |
| BR-PTY-07 | Validación | Identificaciones aceptadas: DNI, carné de extranjería y pasaporte (personas) y RUC (organizaciones). Cada identificación es única por tipo, número y país emisor. | EVD-2026-0083 |
| BR-PTY-08 | Validación | Todo colaborador tiene un correo laboral: el de COMSATEL si es empleado y el de su proveedor si es contratista. El correo laboral es único entre los colaboradores vigentes. | EVD-2026-0085 |
| BR-PTY-09 | Estructura | Los medios de contacto son correo laboral, teléfono laboral (opcional) y perfiles profesionales en línea (opcionales y múltiples: LinkedIn, GitHub y otras plataformas de una lista ampliable). Los perfiles no son evidencia de nivel. | EVD-2026-0081 |
| BR-PTY-10 | Validación | Un contratista tiene una relación de contratación vigente con un proveedor. | EVD-2026-0078, EVD-2026-0085 |
| BR-PTY-11 | Validación | Una persona puede tener asignados varios Rol-Nivel, con un solo nivel vigente por rol. Cambiar de nivel cierra la asignación anterior. | EVD-2026-0079 |
| BR-PTY-12 | Auditoría | Roles, relaciones, contactos y asignaciones no se sobrescriben ni se borran: se cierra la vigencia y se abre una nueva. Todo cambio queda auditado (quién y cuándo). | EVD-2026-0078, EVD-2026-0086 |
| BR-PTY-13 | Estado | La baja de un colaborador cierra la vigencia de su rol de Empleado o de Contratista; la persona no se borra. | EVD-2026-0080, EVD-2026-0086 |
| BR-PTY-14 | Privacidad | A demanda del Jefe de Ingeniería, los datos personales (PII) de una persona dada de baja se anonimizan en todas sus vigencias; es irreversible. Se conservan el código de colaborador y las referencias de auditoría. Las unicidades de identificación, código y correo ignoran a las personas anonimizadas. | EVD-2026-0086, EVD-2026-0087, EVD-2026-0088 |
| BR-PTY-15 | Notificación | Al cumplirse el plazo configurable, contado desde el registro de la baja y guardado en la base de datos, la plataforma envía un correo automático a todos los correos vigentes de las personas con rol vigente de Jefe de Ingeniería, desde la cuenta de Gmail empresarial. Las credenciales de esa cuenta se guardan en HashiCorp Vault. | EVD-2026-0087, EVD-2026-0089, EVD-2026-0090, EVD-2026-0091, EVD-2026-0092, EVD-2026-0094, EVD-2026-0095 |
| BR-PTY-16 | Integración | La plataforma guarda solo el identificador del usuario de Keycloak de cada persona (0 o 1); no aprovisiona usuarios. | EVD-2026-0077 |
| BR-PTY-17 | Permiso | El Jefe de Ingeniería mantiene la información maestra. El colaborador edita por sí mismo solo sus perfiles profesionales y su teléfono laboral. | EVD-2026-0084 |
| BR-PTY-18 | Validación | Se espera un único Jefe de Ingeniería vigente. Al asignar un segundo, la plataforma avisa sin impedirlo. | EVD-2026-0092, EVD-2026-0093 |

### Dependencias

- BR-BRE-01 y la búsqueda de personal dependen de BR-CAT-01 a BR-CAT-03 y BR-CAT-08. Así lo justifica VIS-001:L136: "sin un catálogo acordado, ni la formación ni la IA tienen contra qué medir".
- BR-IA-02 depende de BR-ACR-02 y BR-ACR-04: la propuesta de la IA entra al mismo flujo de certificación humana.
- BR-CER-02 depende de P-07: mientras no se resuelva, no se puede decir si un certificado de curso aporta evidencia a BR-ACR-01.

### Contradicciones y ambigüedades

| ID | Descripción | Fuentes |
|---|---|---|
| AMB-01 | VIS-001 cuenta la **formación** como evidencia de nivel (L71), pero también dice que el certificado de curso **no equivale** a un nivel (L82). No es una contradicción, pero sin resolver P-07 no se sabe si aprobar un curso aporta evidencia a algún nivel. | VIS-001:L71, L82, L156 |
| AMB-02 | La ausencia de un catálogo común está clasificada a la vez como "Supuesto" y como "validado en la sesión, falta evidencia documental". | VIS-001:L35 |
| AMB-03 | Gestión de formación / RR. HH. "gestiona certificaciones" (L45), pero el que certifica es el evaluador (L80). No está claro qué parte de la certificación hace cada uno. | VIS-001:L45, L46, L80 |
| AMB-04 | VIS-001 describe un catálogo de roles y competencias **por producto** (L43, L51, L56, L75, L162). Las decisiones del 2026-09-26 establecen roles y competencias comunes a todos los productos (BR-CAT-07, BR-CAT-08). Prevalece la decisión más reciente; VIS-001 queda pendiente de actualización por su responsable. | VIS-001:L43, L51, L56, L75, L162; EVD-2026-0053, 0056 |
| AMB-05 | BR-CAT-07 dice que el requisito de evidencia de un nivel es el mismo en todos los roles; BR-ACR-10 lo refiere al rol asignado al colaborador. **Aclaración probable** (2026-09-26): la rúbrica es por competencia (BR-CAT-15) y el Rol-Nivel fija el nivel esperado (BR-CAT-14), así que el rol cambia el nivel que se exige, no la evidencia de cada nivel. Queda por confirmar (P-34). | EVD-2026-0053, 0064, 0070, 0071 |
| AMB-06 | BR-REQ-07 (IM-Q6) permite pedir solo algunas competencias del rol. La justificación de BR-REQ-09 (P-29) dice que, al pedir un Rol-Nivel, sus competencias definidas son las idóneas, lo que sugiere pedir el Rol-Nivel completo. **Resuelta** (ianache (Jefe de Ingeniería), 2026-09-27, P-38): por defecto se piden todas y el Jefe de proyecto puede retirar algunas (BR-REQ-07, BR-REQ-10). | EVD-2026-0058, 0072, 0104 |

## Vacíos y preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|---|
| P-01 | ¿Qué evidencia mínima exige cada nivel L1–L4? | Jefe de Ingeniería | Alta | Respondida en lo esencial (ianache (Jefe de Ingeniería), 2026-09-26): se define por competencia y nivel (BR-ACR-07). Detalles en P-21 a P-24 |
| P-02 | ¿Cómo se versiona el catálogo y qué pasa con los requerimientos y certificaciones vigentes cuando cambia? | Jefe de Ingeniería | Alta | Abierta (VIS-001 §11.2) |
| P-05 | ¿La plataforma solo recomienda y el PM decide la asignación, o hay un flujo de aprobación? ¿Quién aprueba? | Responsable del producto | Alta | Abierta (VIS-001 §11.5) |
| P-06 | ¿Qué papel tiene el Responsable de producto frente al Jefe de Ingeniería en el mantenimiento del catálogo? | Jefe de Ingeniería | Media | Abierta (VIS-001 §11.6) |
| P-07 | ¿Aprobar un curso aporta evidencia para algún nivel? ¿Para cuál? | Jefe de Ingeniería | Alta | Abierta (VIS-001 §11.7). Con BR-ACR-08, un curso determinado puede ser el requisito de evidencia de un nivel; falta confirmarlo como respuesta. BR-FOR-01 (los cursos se diseñan para una competencia y un nivel L1–L4) refuerza esa lectura |
| P-08 | ¿Quién puede ver el perfil y las evidencias de otro colaborador (PM, evaluador, Dirección)? | Responsable del producto | Alta | Nueva |
| P-09 | ¿Qué parte de la certificación hace Gestión de formación / RR. HH. y qué parte el evaluador? ¿El evaluador puede certificar a alguien de su propio equipo? | Responsable del producto | Media | Nueva (AMB-03) |
| P-10 | ¿Un requerimiento solo puede usar roles y competencias del catálogo de su producto? | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): no hay catálogo por producto; cualquier rol se puede pedir en un proyecto de cualquier producto (BR-CAT-08) |
| P-11 | ¿Qué estados tiene un proyecto y cuándo se considera "activo"? | Responsable del producto | Media | Nueva |
| P-12 | ¿Cómo se trata la brecha sin nivel certificado y la brecha negativa? ¿Los niveles se restan como números? | Jefe de Ingeniería | Media | Nueva |
| P-13 | ¿Qué criterios de calidad y contexto debe usar la IA para proponer un nivel? | Jefe de Ingeniería | Media | Nueva (H3) |
| P-14 | ¿Una certificación vence o puede revocarse? | Jefe de Ingeniería | Media | Nueva |
| P-21 | ¿Quién define el tipo de evidencia de cada competencia y nivel? ¿Forma parte del catálogo que gobierna el Jefe de Ingeniería? | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): el Jefe de Ingeniería, responsable de las capacitaciones (BR-CAT-16) |
| P-22 | ¿"Tipo de evidencia" se refiere a las tres categorías de BR-ACR-01 o a una evidencia concreta? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): evidencia concreta dentro de una de las tres categorías (BR-ACR-08); confirmada (ianache (Jefe de Ingeniería), 2026-09-27) |
| P-23 | ¿Una competencia y nivel puede exigir más de un tipo de evidencia o una cantidad mínima? ¿El evaluador puede aceptar evidencia de otro tipo como equivalente? | Jefe de Ingeniería | Media | Parcialmente respondida (ianache (Jefe de Ingeniería), 2026-09-27): cada evidencia se declara requerida o deseada; se exigen todas las requeridas y las deseadas refuerzan la certificación (BR-ACR-09, BR-ACR-12). Sigue abierto si el evaluador puede aceptar una evidencia equivalente a la definida, y cómo "refuerza" una evidencia deseada (P-41) |
| P-24 | ¿Hay que definir el tipo de evidencia para los cuatro niveles de cada competencia, o solo para los niveles que exige algún rol? | Jefe de Ingeniería | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): se definen de forma progresiva; lo ideal es tenerlos todos (BR-CAT-17). Ver P-39 |
| P-25 | ¿Un requerimiento indica el nivel de rol que necesita (por ejemplo, Developer Senior 2)? | Responsable de producto | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): sí (BR-REQ-08) |
| P-26 | ¿Cuántos niveles de rol hay (Junior y Senior), cómo se nombran y son los mismos para todos los roles? ¿Cómo se relacionan con la escala L1–L4 de las competencias? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no hay una cantidad general; cada rol define sus niveles al registrarse (BR-CAT-09), y cada Rol-Nivel fija el nivel L1–L4 esperado de sus competencias (BR-CAT-14). Escala salarial y MOF, fuera de alcance (BR-CAT-18) |
| P-27 | ¿Una competencia transversal aplica automáticamente a todos los roles, o se asigna a cada rol? ¿Tiene un nivel requerido distinto por rol y nivel de rol? | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): se asigna a los roles (BR-CAT-11) y, como toda competencia, su nivel esperado lo fija cada Rol-Nivel (BR-CAT-14) |
| P-28 | ¿Un colaborador tiene un nivel de rol (por ejemplo, Developer Junior 2)? Si lo tiene, ¿se acredita o se deduce de sus competencias certificadas? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): se asigna un nivel inicial al registrar al colaborador, según su rol, y después se evalúa la evolución de sus competencias por cursos o por desempeño en proyectos (BR-PRF-02, BR-PTY-11). Ver P-42 |
| P-29 | ¿Un requerimiento puede pedir una competencia que no pertenece a su rol? | Responsable de producto | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): no (BR-REQ-09). Ver AMB-06 y P-38 |
| P-30 | ¿"Líder de proyecto" (el actor que declara requerimientos) es el mismo rol que "jefe de proyecto" de la lista de roles del catálogo? | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): sí; se usa "Jefe de proyecto" y "Líder de proyecto" queda como sinónimo |
| P-31 | ¿El Evaluador y el Jefe de Ingeniería también tienen un perfil de competencias como colaboradores, o solo gestionan el programa? | Jefe de Ingeniería | Baja | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): son solo gestores del programa y por ahora quedan fuera de la evaluación, aunque sus roles tienen competencias definidas (BR-PRG-01, BR-PRG-02) |
| P-32 | ¿"Certificar" un nivel equivale a acreditarlo? | Jefe de Ingeniería | Media | Respondida (ianache (Jefe de Ingeniería), 2026-09-26): se usa "certificar" para las competencias de la persona; el programa se acredita (BR-TER-01) |
| P-33 | ¿Un colaborador tiene asignado un solo rol o puede tener varios? ¿Quién le asigna el rol y con qué nivel de rol? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27, SPEC-001 D6, D11): varios roles, un nivel vigente por rol; los asigna el Jefe de Ingeniería (BR-PTY-11, BR-PTY-17) |
| P-34 | ¿El requisito de evidencia de un nivel de una competencia es el mismo en todos los roles (BR-CAT-07), o depende del rol asignado al colaborador (BR-ACR-10)? | Jefe de Ingeniería | Alta | Parcialmente respondida (inferencia a confirmar): la rúbrica es por competencia (BR-CAT-15), así que lo que se exige para un nivel no depende del rol; el rol solo determina qué nivel se espera (BR-CAT-14) |
| P-35 | ¿Una misma evidencia (por ejemplo, un plan de pruebas de un proyecto) puede respaldar varias competencias o varios niveles, o solo uno? | Jefe de Ingeniería | Media | Nueva (resto de IMD-001 IM-Q8) |
| P-36 | ¿Cómo se combinan Junior/Senior con la numeración 1 a 4 del Rol-Nivel (por ejemplo, ¿Junior 1-2 y Senior 3-4, o Junior 1-4 y Senior 1-4?)? ¿Todos los roles tienen los mismos niveles? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): los niveles y sus nombres se definen al registrar cada rol, por ejemplo Developer Junior (Nivel 1) a (Nivel 3); no son iguales para todos los roles (BR-CAT-09). Ver P-40 |
| P-37 | ¿La rúbrica de una competencia contiene los requisitos de evidencia de cada nivel, o son cosas distintas? ¿Quién define y aprueba las rúbricas? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): la rúbrica define el comportamiento y el logro visible y verificable, que se verifica con evidencias; la define y aprueba el Jefe de Ingeniería (BR-CAT-15, BR-CAT-19). **Inferencia a confirmar:** rúbrica y requisito de evidencia son cosas distintas; el requisito dice con qué evidencia se verifica lo que la rúbrica describe |
| P-38 | La respuesta a P-29 sugiere que un requerimiento pide el Rol-Nivel completo ("las competencias definidas para el rol y nivel son las idóneas"), pero BR-REQ-07 permite pedir solo algunas competencias del rol. ¿Sigue vigente BR-REQ-07? | Jefe de Ingeniería | Alta | Respondida (ianache (Jefe de Ingeniería), 2026-09-27): sí; por defecto se asumen todas y el Jefe de proyecto puede retirar algunas (BR-REQ-07, BR-REQ-10). AMB-06 resuelta |
| P-39 | Mientras la definición es progresiva (BR-CAT-17), ¿se puede certificar un nivel de una competencia que aún no tiene requisitos de evidencia definidos? ¿Y exigirlo en un Rol-Nivel o en un requerimiento? | Jefe de Ingeniería | Alta | Nueva (derivada de P-24) |
| P-40 | ¿La plataforma registra solo el nombre y las competencias de cada nivel de rol, o también sus criterios (años de experiencia en el rol, formación técnica)? Se supone que no, porque están ligados a la escala salarial (BR-CAT-18) | Jefe de Ingeniería | Media | Nueva (derivada de P-36) |
| P-41 | ¿Cómo "refuerza" una evidencia deseada la certificación? ¿Solo queda registrada o cambia algo (por ejemplo, la confianza de la certificación, la búsqueda de candidatos o la propuesta de la IA)? | Jefe de Ingeniería | Media | Nueva (derivada de P-23) |
| P-42 | ¿Cómo se decide el paso de un colaborador al siguiente nivel de su rol? ¿Lo decide una persona (quién) a partir de las competencias certificadas, o se deduce cuando alcanza los niveles L1–L4 esperados del Rol-Nivel siguiente? | Jefe de Ingeniería | Alta | Nueva (derivada de P-28) |
| P-43 | ¿Contra qué Rol-Nivel ve el colaborador su brecha: el que tiene asignado, el siguiente nivel de su rol, o ambos? ¿Puede ver brechas de otros roles? | Jefe de Ingeniería | Alta | Nueva (derivada de P-15 de USC-001) |
| P-44 | ¿Cómo se resume en un solo valor la brecha de un candidato frente a varias competencias, para ordenar la búsqueda (suma, cantidad de competencias no cubiertas, promedio)? | Jefe de Ingeniería | Media | Nueva (derivada de P-16 de USC-001) |
| P-45 | ¿Qué es un usuario con privilegios de ADMIN: un rol de acceso en Keycloak, un rol de la parte o un permiso de la plataforma? ¿Quién lo otorga y qué más puede hacer? | Jefe de Ingeniería + ARQ | Media | Nueva (derivada de P-17 de USC-001; ver P-08) |
| P-46 | ¿Quién diseña los cursos y registra su nivel mínimo, nivel objetivo y competencias? ¿Lo aprueba el Jefe de Ingeniería? ¿Cómo se relaciona el nivel de rol mínimo con los niveles L1–L4 de las competencias? | Jefe de Ingeniería | Alta | Nueva (derivada de P-18 de USC-001) |
| P-47 | En P-19, ¿qué son los requisitos "requeridos" de un curso: actividades o calificaciones de Classroom con un mínimo, o los requisitos de evidencia requeridos de las competencias que el curso desarrolla (BR-ACR-12)? ¿De dónde sale la evidencia de que se cumplen? | Jefe de Ingeniería + Gestión de formación | Alta | Nueva (derivada de P-19 de USC-001) |
| P-48 | ¿Quién es el "evaluador" que concluye la aprobación de un curso: el rol Evaluador, el Jefe de Ingeniería o Gestión de formación (que emite el certificado, BR-CER-05)? | Jefe de Ingeniería | Media | Nueva (derivada de P-19 de USC-001; ver AMB-03) |

Las preguntas P-15 a P-20 de USC-001 fueron respondidas el 2026-09-27; sus respuestas están en BR-BRE-04 a BR-BRE-06, BR-FOR-01, BR-FOR-02, BR-CER-06, BR-CER-07 y BR-IA-05, y sus derivadas son P-43 a P-48.

La pregunta P-03 (metas de KPI) de VIS-001 §11 sigue abierta en la visión. La P-04 (integración con el sistema de RR. HH.) quedó respondida por SPEC-001 D2: la plataforma es el sistema de registro, sin integración con RR. HH. (BR-PTY-01).

## Riesgos y supuestos

- **Riesgo:** la fuente única está en `draft`. Si VIS-001 cambia, este catálogo debe revisarse.
- **Riesgo:** con BR-ACR-08, el catálogo debe describir una evidencia concreta por competencia y nivel; mantenerlo es un esfuerzo continuo del dueño del catálogo (P-21).
- **Supuesto:** las afirmaciones sin etiqueta en VIS-001 reflejan lo que dijo el responsable del producto en la sesión de descubrimiento del 2026-09-26.

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** las reglas del catálogo, la certificación con firma humana, los certificados de curso y las integraciones bastan para redactar historias. P-05, P-07 y P-08 bloquean los criterios completos de certificación, asignación y visibilidad. P-01 quedó respondida en lo esencial (BR-ACR-07).
- **Siguiente rol o Skill:** `af-user-story-refiner`, empezando por H1 (catálogo, requerimientos, perfil con certificación manual, brechas).
- **Decisión humana requerida:** el Jefe de Ingeniería y el responsable del producto validan las reglas y responden las preguntas de prioridad alta. `verified` queda sin asignar hasta esa validación.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos, inferencias y vacíos
- [x] Contradicciones y ambigüedades visibles
- [x] Casos negativos y límite considerados (BR-ACR-04, BR-BRE-03, BR-CER-02)
- [ ] Validación humana registrada
