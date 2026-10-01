---
type: Requirement Context Pack
id: RCP-003
title: "RCP-003 — Gestión de data maestra de parties (personas y organizaciones) para mantener información de colaboradores"
description: "Contexto funcional consolidado para la gestión de la información maestra de colaboradores (employees, contractors), personas externas (partners), organizaciones (COMSATEL, unidades, proveedores) y sus relaciones, con vigencias, vínculos con Keycloak, asignación de Rol-Nivel y anonimización."
tags: [requirement-context, master-data, party, colaboradores, data-governance, anonimizacion]
status: draft
generated:
  by: "af-requirement-context-builder/1.0"
  at: "2026-09-27T22:30:00-05:00"
verified: false
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    title: VIS-001 — Plataforma de Gestión de Formación del Recurso Humano
    verification: "Leída en sesión 2026-09-27"
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
    title: SPEC-001 — Gestión de colaboradores (especificación aprobada)
    verification: "Leída en sesión 2026-09-27"
  - id: imd-002
    resource: /knowledge-base/business/information-model/IMD-002-modelo-conceptual-de-partes.md
    title: IMD-002 — Modelo de información conceptual de partes
    verification: "Leída en sesión 2026-09-27"
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    title: BRC-001 — Reglas de negocio de la plataforma
    verification: "Referenciada en SPEC-001 e IMD-002; no leída en sesión"
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
    title: ADR-002 — Autenticación con Keycloak y PKCE
    verification: "Leída en sesión anterior; vigente"
---

# RCP-003 — Gestión de Data Maestra de Party

## 1. Pregunta de trabajo y objetivo

### Pregunta
¿Qué contexto funcional (actores, procesos, datos, restricciones) es necesario entender para especificar las capacidades de gestión de información maestra de colaboradores (employees, contractors) y su relación con organizaciones, antes de refinar User Stories y diseñar pantallas?

### Objetivo de negocio
Que la plataforma sea el **sistema de registro** de la información maestra de las personas que participan del programa (colaboradores, personas externas) y las organizaciones con las que se relacionan, manteniendo un historial completo con vigencias, vínculos con identidad (Keycloak), asignación de Rol-Nivel y capacidad de anonimización de datos personales cuando las personas se van.

### Resultado observable
- Una especificación funcional completa (SPEC-001) aprobada por ianache (Jefe de Ingeniería)
- Un modelo de datos lógico y físico implementable en MySQL 8.0.16+ y PostgreSQL 12+
- Capacidades C1 a C11 definidas y asignadas a actores (Jefe de Ingeniería, colaborador)
- Reglas de negocio BR-PTY-01 a BR-PTY-20 explícitas
- Vacíos identificados y preguntas abiertas asignadas a responsables

---

## 2. Alcance

### Incluido

| Elemento | Descripción | Fuente |
|---|---|---|
| **Personas colaboradoras** | Empleados y contratistas, con su información personal (nombres, apellidos, nombre preferido) | SPEC-001:L34 |
| **Estructura organizacional** | COMSATEL, sus unidades internas, jerarquía, relaciones laborales y jefe directo | SPEC-001:L35 |
| **Personas externas** | Contratistas con su proveedor | SPEC-001:L36 |
| **Documentos de identidad** | DNI, carné de extranjería, pasaporte para personas; RUC para organizaciones | SPEC-001:L38, D10 |
| **Medios de contacto** | Correo laboral (obligatorio), teléfono laboral (opcional), perfiles profesionales en línea | SPEC-001:L39, D8 |
| **Vigencias y historial** | Roles, relaciones, contactos, asignaciones con fecha desde/hasta sin sobrescritura | SPEC-001:L37, BR-PTY-12 |
| **Vínculo con Keycloak** | Cada persona se vincula con su usuario de Keycloak mediante un identificador | SPEC-001:L38, D4, ADR-002 |
| **Asignación de Rol-Nivel** | Personas reciben Rol-Nivel del catálogo, con un solo nivel vigente por rol | SPEC-001:L39, D6 |
| **Anonimización** | Cuando una persona se va, sus datos personales se anonimizan de forma irreversible; auditoría se conserva | SPEC-001:L40, D14, D15 |

### Excluido (explícitamente, pero mencionado)

| Elemento | Razón | Fuente |
|---|---|---|
| Implementación en código | Es responsabilidad de desarrollo | SPEC-001:L42 |
| Migración de datos existentes | No hay datos que migrar | SPEC-001:L43 |
| Diseño de pantallas | Lo hace el flujo UX posterior (UXR-) | SPEC-001:L44 |
| Integración con RR. HH. | La plataforma es el sistema de registro, no se integra | SPEC-001:L45 |
| Aprovisionamiento de usuarios en Keycloak | Se gestiona aparte; la plataforma solo guarda el identificador | SPEC-001:L46, D4 |
| Perfiles profesionales como evidencia de nivel | Se registran, pero no como evidencia | SPEC-001:L47 |

---

## 3. Resumen ejecutivo del contexto

### ¿Qué es Party (Parte)?

Una **parte** es el patrón del Universal Data Model que representa cualquier entidad que participa en la información maestra: personas (colaboradores, externos) u organizaciones (COMSATEL, unidades, proveedores).

**Supertipo:** Parte
- **PERSONA:** individuo con código de colaborador único, nombres, apellidos, identificaciones, medios de contacto, vínculo con Keycloak
- **ORGANIZACIÓN:** COMSATEL, unidades internas, proveedores; registrada con nombre y RUC

### Ciclo de vida: Alta → Cambio → Baja → Anonimización

```
┌─────────────────────────────────────────────────┐
│ ALTA                                             │
│ Se crea la persona, código, ID, correo laboral, │
│ rol de Employee o Contractor, unidad, jefe      │
│ directo, proveedor (si aplica). Keycloak vacío. │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│ CAMBIO (sin sobrescritura)                       │
│ Datos simples se corrigen. Roles, relaciones,   │
│ contactos, asignaciones: cierra vigencia        │
│ anterior, abre nueva.                           │
└────────────┬────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────┐
│ BAJA (cierre de vigencia)                        │
│ Se cierra vigencia del rol Employee o           │
│ Contractor. La persona NO se borra (su          │
│ historial de certificaciones la necesita).      │
└────────────┬────────────────────────────────────┘
             │ (tras plazo configurable: 90-180 días)
             ▼
┌─────────────────────────────────────────────────┐
│ NOTIFICACIÓN (a demanda o automática)            │
│ Plataforma notifica al Jefe de Ingeniería      │
│ que puede anonimizar. Envía correo a todos     │
│ Jefes de Ingeniería vigentes.                  │
└────────────┬────────────────────────────────────┘
             │ (decisión humana)
             ▼
┌─────────────────────────────────────────────────┐
│ ANONIMIZACIÓN (irreversible)                     │
│ Reemplaza: nombres, apellidos, nombre           │
│ preferido, IDs, medios de contacto,             │
│ identidad de acceso. Conserva: código,          │
│ referencias de auditoría, roles, relaciones,    │
│ asignaciones, certificaciones.                  │
└─────────────────────────────────────────────────┘
```

---

## 4. Registro de evidencia

| Hallazgo | Clasificación | Fuente | Evidencia |
|---|---|---|---|
| La plataforma es el sistema de registro (no se integra con RR. HH.) | HECHO | SPEC-001:L31, D2 | Decisión del Jefe de Ingeniería en brainstorming del 2026-09-27 (session notes: D2) |
| Existe un código de colaborador único y obligatorio | HECHO | SPEC-001:L39, D9, D25 | Especificación aprobada; el código se genera automáticamente como GUID |
| Se registran 7 actores, incluyendo Evaluador y Jefe de Ingeniería | HECHO | VIS-001:§3 | Visión aprobada; el Jefe de Ingeniería es dueño del catálogo |
| Una persona puede tener varios roles asignados, con un solo nivel vigente por rol | HECHO | SPEC-001:L40, D6 | Decisión D6 aprobada |
| El Jefe de Ingeniería mantiene toda la información maestra | HECHO | SPEC-001:D11 | Decisión D11 aprobada |
| El colaborador puede editar solo sus perfiles profesionales y teléfono laboral | HECHO | SPEC-001:D11, BR-PTY-20 | Regla de negocio validada el 2026-09-27 |
| Los datos de personas (incluyendo perfiles) son data abierta para cualquier colaborador | HECHO | SPEC-001:D27, P-52 | Decisión D27 aprobada; P-52 resuelta en sesión del 2026-09-27 (ianache: "mostrar nombre, correo laboral, unidad, rol y perfiles profesionales") |
| No existe un catálogo común de roles y competencias en COMSATEL hoy | SUPUESTO | VIS-001:§2 | "Supuesto (validado en sesión, falta evidencia documental)" |
| PostgreSQL se adopta en versión estable más reciente | HECHO | SPEC-001:D30 | Decisión D30 aprobada |

---

## 5. Hechos confirmados

### Actores y responsabilidades

| Actor | Responsabilidad primaria | En scope RCP-003 |
|---|---|---|
| **Jefe de Ingeniería** | Dueño del catálogo de roles y competencias; mantiene toda la información maestra (C1–C11) | ✅ Principal |
| **Colaborador** | Edita solo perfiles profesionales y teléfono laboral; consulta su propia ficha | ✅ Limitado |
| **Jefe de Proyecto** | Declara requerimientos; busca personal certificado | ❌ Fuera (es consumidor de datos) |
| **Gestor de Formación** | Gestiona certificaciones y cursos | ❌ Fuera (usa datos del catálogo) |
| **Evaluador** | Revisa evidencias y certifica | ❌ Fuera (usa datos del catálogo) |
| **Dirección/Gerencia** | Ve dashboards de capacidad | ❌ Fuera (es consumidor de datos) |

### Datos maestros que se mantienen

| Concepto | Ejemplo | Obligatorio | Auditoría |
|---|---|---|---|
| **Persona** | Juan Pérez López | Sí | Creado por, Actualizado por, Fechas |
| **Código de colaborador** | 550e8400-e29b-41d4-a716-446655440000 (GUID) | Sí, único | Generado automáticamente (irreversible) |
| **Documentos de identidad** | DNI: 12345678; emisor: Perú | Mínimo 1 | Historia |
| **Correo laboral** | juan.perez@comsatel.com | Sí | Historia por vigencia |
| **Teléfono laboral** | +51-1-2345678 | No | Historia por vigencia |
| **Perfiles profesionales** | LinkedIn: /in/juanperez; GitHub: juanperez | No | Historia por vigencia |
| **Roles de la parte** | Employee, Contractor, Evaluator, Engineering Head | Sí (mínimo 1) | Vigencia desde/hasta |
| **Relaciones con otras partes** | Employment (→ Org. Interna), Reporting (→ Jefe directo) | Sí (depende rol) | Vigencia desde/hasta |
| **Asignación de Rol-Nivel** | Developer Junior Nivel 2 (del catálogo) | Sí (al registrar) | Un solo nivel vigente por rol |
| **Identidad de acceso (Keycloak)** | user-uuid-in-keycloak | Opcional (0..1) | Se vincula en cualquier momento |

### Restricciones y validaciones

| Restricción | Regla | Fuente |
|---|---|---|
| **Código único** | El código de colaborador es único entre todas las personas (anonimizadas incluidas) y no se reutiliza | BR-PTY-06, D25 |
| **Documentos únicos** | La identificación es única por tipo, número y país | SPEC-001:L126 |
| **Correo único vigente** | El correo laboral es único entre colaboradores vigentes | SPEC-001:L128 |
| **Un nivel por rol vigente** | Una persona tiene un solo nivel vigente por rol | BR-PTY-11, D6 |
| **Contratista con proveedor** | Un contratista DEBE tener relación de contratación vigente con un proveedor | SPEC-001:L129 |
| **Sin sobrescritura** | Roles, relaciones, contactos, asignaciones no se sobrescriben: se cierra vigencia anterior, se abre nueva | BR-PTY-12 |
| **Anonimización solo en baja** | Solo se puede anonimizar a persona sin roles Employee ni Contractor vigentes | SPEC-001:L133 |
| **Correo de aviso** | Se envía a todos los Jefes de Ingeniería vigentes; se espera uno, pero si hay más se envía a todos | D20, D21 |

### Decisiones clave ya tomadas

| Decisión | Implicación | Decisor |
|---|---|---|
| **D2:** Plataforma es el sistema de registro | No integra con RR. HH.; todas las altas, cambios, bajas son manuales | Jefe de Ingeniería |
| **D7:** Colaborador es concepto derivado | No es entidad separada; se calcula como "persona con rol vigente de Employee o Contractor" | Jefe de Ingeniería |
| **D11:** El Jefe de Ingeniería mantiene todo | Solo el colaborador edita sus perfiles y teléfono | Jefe de Ingeniería |
| **D14:** Anonimización irreversible | Los datos personales se reemplazan (no se borran); auditoría se conserva | Jefe de Ingeniería |
| **D15/D17/D18:** Notificación automática tras plazo | Cuando vence el plazo de anonimización, la plataforma envía correo de aviso automáticamente al Jefe de Ingeniería | Jefe de Ingeniería |
| **D27:** Data abierta | Los datos de personas (nombres, correos, perfiles) se ven para cualquier colaborador logueado | Jefe de Ingeniería |

---

## 6. Supuestos e hipótesis

| Supuesto | Fundamento | Validar con |
|---|---|---|
| **Ausencia de catálogo hoy** | No existe un catálogo común de roles y competencias en COMSATEL | VIS-001:§2 "validado en sesión, falta evidencia documental" |
| **H1 como horizonte** | Las capacidades H1 (perfil, certificación manual, brechas) necesitan saber quiénes son los colaboradores y su Rol-Nivel | SPEC-001:L146 (inferencia del diseño) |
| **Keycloak ya en COMSATEL** | Se asume la existencia de un servidor Keycloak corporativo, pero falta confirmación (vacío KG-01) | Arquitecto de infraestructura |
| **Directorio corporativo disponible** | Se menciona posible federación con directorio corporativo o sistema de RR. HH., pero está abierto (D30, SPEC-001:L68) | Responsable de integraciones |
| **Un solo Jefe de Ingeniería vigente** | Se espera uno, pero el sistema advierte si hay más | D20, D21 |

---

## 7. Vacíos y preguntas abiertas

| ID | Pregunta | Prioridad | Responsable | Impacto |
|---|---|---|---|---|
| **KG-01** | ¿Existe una instancia de Keycloak operativa en COMSATEL? ¿Dónde está alojada? ¿Versión? | ALTA | Arquitecto de infraestructura | Define si se reutiliza o se desplega nueva |
| **P-28** | ¿Cómo se decide el paso de un colaborador al siguiente nivel de Rol-Nivel después de registrarse? | ALTA | Jefe de Ingeniería | Define capacidades C5 (upgrade de nivel) |
| **P-42** | ¿Cuáles son los criterios de evaluación para ascender de nivel? (cursada, desempeño, evaluación manual, IA) | ALTA | Jefe de Ingeniería | Define criterios de promoción |
| **P-52** | Cuando se muestran datos de personas a otros colaboradores, ¿qué campos específicos se muestran? | RESPONDIDA | Jefe de Ingeniería | "nombre, correo laboral, unidad, rol y perfiles profesionales" (sin código) |
| **IM-Q1** | ¿Qué fecha exacta cuenta para el plazo de anonimización: fecha de baja o fecha de cierre de rol? | MEDIA | Jefe de Ingeniería | Define trigger del plazo (D17 dice "desde que se registra la baja") |
| **IM-Q2** | ¿Cómo se sincroniza el modelo de roles en Keycloak con el modelo de roles de la parte (Employee, Contractor, etc.)? | MEDIA | Arquitecto de seguridad | Define estrategia de sincronización |
| **SPEC-001:Q-07** | ¿Se verifica el modelo contra "The Data Model Resource Book"? | BAJA | Arquitecto de datos | D29: el Jefe de Ingeniería resolvió que no es necesario |
| **GQ-18** | Definición de "Colaborador" en el glosario necesita revisión (hoy dice "Persona con roles de Employee o Contractor") | BAJA | Curador de glosario | Alineación con TRM-0013 |
| **GQ-19** | Definición de "Jefe de Ingeniería" necesita revisión (¿es solo un rol o incluye responsabilidades?). | MEDIA | Curador de glosario | Claridad de término |
| **INTEG-01** | ¿Cómo se maneja la cuenta de Gmail para enviar correos de aviso si falla? ¿Reintentos? ¿Escalada manual? | MEDIA | Responsable de integraciones | Define plan de contingencia (D19, D22) |

---

## 8. Actores, procesos, datos y dependencias

### Actores en scope

```
┌─────────────────────┐
│ Jefe de Ingeniería  │ (mantiene toda la data maestra)
│                     │
│ Capacidades:        │
│ • Registrar colabo. │
│ • Actualizar datos  │
│ • Gestionar estruc. │
│ • Asignar roles     │
│ • Dar de baja       │
│ • Anonimizar        │
└──────────┬──────────┘
           │
           ▼
     (leen datos)
        │
        ├──► Colaborador (edita solo perfiles + teléfono)
        ├──► Jefe de Proyecto (busca personal)
        ├──► Gestor de Formación (gestiona cursos)
        ├──► Evaluador (certifica competencias)
        ├──► Dirección (ve dashboards)
        └──► Cualquier colaborador logueado (ve data abierta)
```

### Procesos principales

| Proceso | Descripción | Capacidad |
|---|---|---|
| **Registrar colaborador** | Alta de persona, código, ID, correo laboral, rol (Employee/Contractor), unidad, jefe directo, proveedor (si aplica) | C1 |
| **Actualizar datos** | Corregir datos simples (nombres, apellidos). Cambiar roles/relaciones/contactos sin sobrescritura (nueva vigencia) | C2 |
| **Gestionar estructura organizacional** | Crear/editar COMSATEL, unidades, jerarquía | C3 |
| **Gestionar proveedores y contratistas** | Registrar proveedores; vincular contratistas a proveedores | C4 |
| **Asignar Rol-Nivel** | Asignar o cambiar nivel de un rol (cierra nivel anterior, abre nuevo) | C5 |
| **Asignar roles del programa** | Asignar Evaluador o Jefe de Ingeniería (roles específicos del programa) | C6 |
| **Dar de baja** | Cerrar vigencia del rol de Employee o Contractor (sin borrar registro) | C7 |
| **Vincular identidad de acceso** | Registrar el UUID de usuario de Keycloak | C8 |
| **Consultar ficha e historial** | Jefe de Ingeniería: ve ficha y toda la historia de una persona; Colaborador: ve la suya | C9 |
| **Anonimizar datos personales** | Reemplazar nombres, IDs, contactos (no el código); marcar quién y cuándo | C10 |
| **Configurar plazo de anonimización** | Establecer X días tras baja; la plataforma envía aviso automático | C11 |

### Datos y su origen

| Dato | Creado por | Modificado por | Auditoría | Eliminado |
|---|---|---|---|---|
| Código de colaborador | Sistema (GUID) | Nunca | Quién/cuándo creó | Nunca |
| Nombres, apellidos | Jefe de Ingeniería | Jefe de Ingeniería | Quién/cuándo | Anonimizado |
| Documentos (ID) | Jefe de Ingeniería | Jefe de Ingeniería | Vigencia + quién/cuándo | Anonimizado |
| Correo laboral | Jefe de Ingeniería | Jefe de Ingeniería | Vigencia + quién/cuándo | Anonimizado |
| Teléfono laboral | Jefe de Ingeniería | Jefe de Ingeniería + Colaborador | Vigencia + quién/cuándo | Anonimizado |
| Perfiles profesionales | Jefe de Ingeniería | Jefe de Ingeniería + Colaborador | Vigencia + quién/cuándo | Anonimizado |
| Roles, relaciones | Jefe de Ingeniería | Jefe de Ingeniería | Vigencia + quién/cuándo | Nunca (historia) |
| Asignación de Rol-Nivel | Jefe de Ingeniería | Jefe de Ingeniería | Vigencia + quién/cuándo | Nunca (historia) |
| UUID de Keycloak | Jefe de Ingeniería | Jefe de Ingeniería | Quién/cuándo | Anonimizado |

### Dependencias con otros dominios

| Dependencia | Dirección | Razón | Gestión |
|---|---|---|---|
| **Catálogo de competencias (IMD-001)** | ← Party → Catálogo | Party asigna Rol-Nivel del catálogo | La plataforma mantiene ambos; Jefe de Ingeniería es dueño de ambos |
| **Certificaciones (IMD-001)** | ← Party ← Certificación | Certificación registra a qué persona se otorgó | Party se consulta desde Certificación; no se sobrescribe |
| **Keycloak (ADR-002)** | ↔ Party | Party vincula personas con usuarios de Keycloak | La plataforma solo guarda el UUID; Keycloak no se provisiona desde aquí |
| **Gmail empresarial** | → (salida) Party | Se usa para enviar aviso de anonimización al Jefe de Ingeniería | Las credenciales se guardan en HashiCorp Vault (D22); no es parte del modelo de Party |

---

## 9. Restricciones y riesgos funcionales

### Restricciones de negocio

| Restricción | Impacto | Decisor |
|---|---|---|
| **No integra con RR. HH.** | Todos los cambios son manuales; requiere disciplina operativa | Jefe de Ingeniería (D2) |
| **Sin sobrescritura** | Aumenta volumen de datos (historial completo); requiere índices eficientes | Jefe de Ingeniería (BR-PTY-12) |
| **Anonimización irreversible** | Una vez ejecutada, no se puede deshacer; requiere confirmación clara | Jefe de Ingeniería (D14) |
| **Un solo nivel vigente por rol** | Si un colaborador requiere dos niveles simultáneos, se modela como dos roles distintos | Jefe de Ingeniería (D6) |
| **Data abierta** | Cualquier colaborador logueado ve datos de personas (mitigación: mostrar solo nombre/correo/rol/perfiles, sin código) | Jefe de Ingeniería (D27, P-52) |

### Riesgos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Sincronización con Keycloak** | Media | Alto | Definir estrategia de sincronización (IM-Q2); usar eventos para mantener coherencia |
| **Fallo en envío de aviso** | Media | Medio | Implementar reintentos; auditoría de envíos fallidos; escalada manual (INTEG-01) |
| **Inconsistencia entre roles de Party y roles del catálogo** | Media | Medio | Mantener mapeo explícito; Jefe de Ingeniería es dueño de ambos; documentar en Keycloak |
| **Cuasi-identificación tras anonimización** | Baja | Medio | El código es GUID único (no reutilizable); los ven solo Jefe de Ingeniería y referencias de auditoría; P-52 mitiga (no se muestra a otros) |
| **Acumulación de datos históricos** | Media | Bajo | Implementar particionamiento o archivado de datos antiguos (no en scope actual) |
| **Múltiples Jefes de Ingeniería** | Baja | Bajo | Sistema advierte si hay más de uno (D21); se envían avisos a todos |

---

## 10. Decisiones aprobadas y validación humana

### Decisiones del Jefe de Ingeniería (2026-09-27)

✅ **APROBADAS y EXPLÍCITAS en SPEC-001 §2:**

- D2: Plataforma es sistema de registro (no integra con RR. HH.)
- D4: Se guarda solo el UUID de Keycloak (no se provisiona desde aquí)
- D6: Una persona puede tener varios roles, con un solo nivel vigente por rol
- D7: Colaborador es concepto derivado (no es entidad propia)
- D9: Código de colaborador obligatorio y único
- D10: Documentos aceptados (DNI, CE, Pasaporte, RUC)
- D11: Jefe de Ingeniería mantiene todo; colaborador edita solo perfiles y teléfono
- D14: Anonimización irreversible; conserva código y referencias de auditoría
- D15/D17/D18: Notificación automática tras plazo configurable
- D25: Código generado automáticamente como GUID
- D27: Data abierta para cualquier colaborador logueado (pero P-52: mostrar solo nombre/correo/rol/perfiles, sin código)
- D30: PostgreSQL en versión estable más reciente

### Validaciones pendientes

❌ **REQUIERE REVISIÓN HUMANA (Jefe de Ingeniería):**

1. ¿Es correcta la clasificación de datos mostrados en P-52 (nombre, correo, rol, perfiles, sin código)?
2. ¿Cómo se decide el upgrade de nivel tras el registro inicial (P-28, P-42)?
3. ¿Existe Keycloak en COMSATEL? ¿Dónde? ¿Versión? (KG-01)
4. ¿Se federar Keycloak con directorio corporativo? (abierto en SPEC-001:L68)

---

## 11. Knowledge Candidates para crear/actualizar

| Candidato | Tipo | Razón | Crear en |
|---|---|---|---|
| **Colaborador** | Término (GLS-001) | Definición actual es "Persona con rol vigente de Employee o Contractor"; necesita revisión y alineación con TRM-0013 | GLS-001 / glosario/terms/TRM-0013-colaborador.md |
| **Jefe de Ingeniería** | Término (GLS-001) | Necesita claridad: ¿es rol de Party o rol del catálogo? BR-PRG-01 y BR-PRG-02 lo mencionan | GLS-001 / glosario/terms/TRM-0036-jefe-de-ingenieria.md |
| **Evaluador** | Término (GLS-001) | BR-PRG-02 lo marca como "solo gestor, fuera de proceso de evaluación"; definición necesita actualización | GLS-001 / glosario/terms/TRM-0021-evaluador.md |
| **BR-PTY-20** | Regla de negocio | "Los datos de personas (incluyendo perfiles) son data abierta para colaboradores logueados, excepto el código" | BRC-001 |
| **Nivel de rol vigente** | Concepto | Explicar cómo se calcula (una asignación de Rol-Nivel vigente por persona y rol); relacionar con "Un solo nivel vigente por rol" (D6) | IMD-002 o concepto nuevo |

---

## 12. Handoff para el siguiente rol

### Entrada de User Story Refiner

**Artefactos listos:**
- [SPEC-001](../../requirement/specs/SPEC-001-gestion-de-colaboradores.md) — Especificación funcional completa y aprobada
- [IMD-002](../../business/information-model/IMD-002-modelo-conceptual-de-partes.md) — Modelo conceptual de parties
- [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) — Reglas de negocio (BR-PTY-01 a BR-PTY-20)
- **RCP-003** — Este contexto

**Capacidades a refinar en User Stories (C1–C11 de SPEC-001:§5):**
- US-015: Registrar un colaborador (C1)
- US-016: Actualizar datos y medios de contacto (C2)
- US-017: Gestionar la estructura organizacional (C3)
- US-018: Gestionar proveedores y contratistas (C4)
- US-019: Asignar un Rol-Nivel a una persona (C5)
- US-020: Asignar roles del programa (C6)
- US-021: Dar de baja a un colaborador (C7)
- US-022: Vincular la identidad de acceso (C8)
- US-023: Consultar la ficha y su historial (C9)
- US-024: Anonimizar los datos personales de una persona dada de baja (C10)
- US-025: Configurar el plazo de anonimización y recibir el aviso (C11)

**Preguntas a resolver antes de diseño UX:**
- IM-Q1: ¿Qué fecha exacta cuenta para el plazo?
- IM-Q2: ¿Cómo se sincroniza Keycloak?
- P-28: ¿Cómo se decide el upgrade de nivel?
- P-42: ¿Criterios de evaluación?
- KG-01: ¿Keycloak en COMSATEL?

### Entrada de Data Model Designer

**Artefactos listos:**
- IMD-002 — Modelo conceptual (entidades, relaciones, cardinalidades)
- SPEC-001 — Requisitos funcionales (validaciones, ciclo de vida, anonimización)
- BRC-001 — Reglas de negocio (restricciones, auditoría)
- ADR-002 — Decisión de autenticación con Keycloak

**Salida esperada:**
- Modelo lógico (tablas, claves, vínculos)
- Modelo físico MySQL 8.0.16+
- Modelo físico PostgreSQL 12+
- DDL portable + anexos por motor (SPEC-001:L197–200)

---

## 13. Conclusiones

### Estado del contexto

✅ **COMPLETO** para especificación y diseño funcional:
- Objetivo y alcance explícitos
- Actores y responsabilidades definidas
- 11 capacidades (C1–C11) descompuestas
- 20 reglas de negocio (BR-PTY-01 a BR-PTY-20) mapeadas
- Ciclo de vida documentado (alta → cambio → baja → anonimización)
- Restricciones y riesgos identificados

⚠️ **REQUIERE CONFIRMACIÓN TÉCNICA:**
- Existencia y ubicación de Keycloak en COMSATEL (KG-01)
- Estrategia de sincronización de roles entre Party y Keycloak (IM-Q2)
- Plan de contingencia para fallos en envío de avisos (INTEG-01)

❓ **PENDIENTE DE DECISIÓN DE NEGOCIO:**
- Criterios de upgrade de nivel de Rol-Nivel después del registro inicial (P-28, P-42)

---

## 14. Referencias

| Documento | Rol | Estado |
|---|---|---|
| [VIS-001](../../vision/VIS-001-plataforma-gestion-formacion.md) | Visión de producto | Draft |
| [SPEC-001](../../requirement/specs/SPEC-001-gestion-de-colaboradores.md) | Especificación funcional aprobada | Draft |
| [IMD-002](../../business/information-model/IMD-002-modelo-conceptual-de-partes.md) | Modelo conceptual | Draft |
| [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) | Reglas de negocio | Draft |
| [GLS-001](../../business/glossary/GLS-001-glosario-de-negocio.md) | Glosario de términos | Draft |
| [ADR-002](../../architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md) | Autenticación con Keycloak | Draft |
| [ADR-004](../../architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md) | Gestión de secretos (Vault) | Draft |

---

**RCP-003 creado:** 2026-09-27
**Fuente de autoridad:** SPEC-001 (decisiones del Jefe de Ingeniería, ianache)
**Próximo paso:** Refinar en User Stories (US-015 a US-025)
