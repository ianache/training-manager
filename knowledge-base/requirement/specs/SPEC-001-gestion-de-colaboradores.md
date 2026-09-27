---
type: Feature Specification
title: "SPEC-001 — Gestión de colaboradores: información maestra alineada con el patrón Party del UDM"
description: "Diseño aprobado de la feature de información maestra de colaboradores, personas externas y estructura organizacional, con modelo Party del Universal Data Model, vigencias, vínculo con Keycloak y persistencia compatible con MySQL y PostgreSQL."
tags: [spec, feature, colaboradores, party, udm, master-data, data-model]
status: draft
generated:
  by: "superpowers-brainstorming/6.4.1"
  at: "2026-09-27T08:45:31-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: asr-br-tra-01
    resource: /knowledge-base/architecture/asr/asr-BR-TRA-01.md
---

# SPEC-001 — Gestión de colaboradores

> **Procedencia:** este diseño se acordó en una sesión de brainstorming con `human:ianache` (Jefe de Ingeniería) el 2026-09-27, aprobando sección por sección. Las decisiones del decisor están en §2. Lo que propuso el agente y el decisor aprobó dentro de una sección se indica como "propuesta aprobada". **Referencia sin verificar:** los patrones del Universal Data Model provienen de *The Data Model Resource Book, Vol. 1* (Len Silverston), que no se consultó en esta sesión; la correspondencia con el UDM debe verificarse contra esa fuente (Q-07).

## 1. Objetivo y alcance

**Objetivo:** que la plataforma mantenga, como sistema de registro, la información maestra de las personas que participan del programa y de las organizaciones con las que se relacionan, con un modelo alineado con el patrón **Party** del UDM, historial por vigencias y un modelo de datos lógico y físico implementable.

**Incluye:**
- Personas colaboradoras: empleados y contratistas.
- Estructura organizacional: COMSATEL, sus unidades internas y la jerarquía entre ellas, la relación laboral y el jefe directo.
- Personas externas: contratistas con su proveedor.
- Historial con vigencias (desde y hasta) para roles, relaciones, contactos y asignaciones.
- El vínculo de cada persona con su usuario de Keycloak.
- La asignación de Rol-Nivel del catálogo a las personas.

**Excluye:**
- La implementación en código.
- La migración de datos existentes, porque no hay.
- El diseño de pantallas, que queda para el flujo UX posterior.
- La integración con RR. HH.
- El aprovisionamiento de usuarios en Keycloak.
- Usar perfiles profesionales como evidencia de nivel.

**Salida acordada:** especificación funcional y modelo de datos lógico y físico (D1).

## 2. Decisiones del decisor (`human:ianache`, 2026-09-27)

| ID | Decisión | Cierra |
|---|---|---|
| D1 | La salida es la especificación funcional más el modelo de datos lógico y físico | — |
| D2 | **La plataforma es el sistema de registro** de la información maestra de colaboradores: altas, cambios y bajas se hacen en ella, sin integración con RR. HH. | VIS-001 §11.4 (P-04), KG-03 en la parte de datos |
| D3 | Alcance: personas colaboradoras, estructura organizacional, personas externas e historial con vigencias | — |
| D4 | Los usuarios de Keycloak se gestionan aparte; **la plataforma solo guarda el identificador** que vincula a la persona con su usuario | ADR-002, pregunta abierta de federación en parte |
| D5 | **Enfoque A:** núcleo Party del UDM, con la asignación de Rol-Nivel como entidad aparte | — |
| D6 | **Una persona puede tener varios roles asignados**, con **un solo nivel vigente por rol** | P-33 |
| D7 | **Colaborador es un concepto derivado:** una persona con un rol vigente de Empleado o de Contratista | IMD-001 R-18, R-28 y R-29 en parte |
| D8 | Los medios de contacto incluyen **perfiles profesionales en línea**: LinkedIn, GitHub y otros relevantes para el personal técnico | — |
| D9 | Existe un **código de colaborador** interno, único y obligatorio | — |
| D10 | Documentos aceptados: **DNI, carné de extranjería y pasaporte** para personas, y **RUC** para organizaciones | — |
| D11 | **El Jefe de Ingeniería** mantiene toda la información maestra; **el colaborador** edita por sí mismo sus perfiles profesionales y su teléfono laboral | — |
| D12 | El modelo físico soporta **MySQL y PostgreSQL**: un único modelo físico con **DDL portable** y **un anexo por motor** con las diferencias | Motor de base de datos (ADB-001 KG-01 en parte) |

## 3. Modelo conceptual (sección 1)

| Concepto | Qué es | Vigencia |
|---|---|---|
| **Parte** (Party) | Supertipo: una Persona o una Organización | — |
| **Persona** | Individuo | — |
| **Organización** | COMSATEL, sus unidades internas y los proveedores. El tipo lo da su rol | — |
| **Rol de la parte** (Party Role) | Cómo participa una parte. Personas: Empleado, Contratista, Evaluador, Jefe de Ingeniería. Organizaciones: Organización interna, Unidad organizacional, Proveedor | desde / hasta |
| **Relación entre partes** (Party Relationship) | Vínculo entre dos roles. Tipos: empleo (empleado ↔ organización interna), contratación (contratista ↔ proveedor), pertenencia (persona ↔ unidad), estructura (unidad ↔ unidad padre) y reporte (persona ↔ jefe directo) | desde / hasta |
| **Identificación** | Documento de la parte: tipo, número y país emisor | — |
| **Medio de contacto** y **uso del medio de contacto** | Correo, teléfono o URL, y su propósito para una parte (laboral o perfil profesional) | desde / hasta |
| **Asignación de Rol-Nivel** | Una persona tiene asignado un Rol-Nivel del catálogo, al estilo *Position Fulfillment* del UDM | desde / hasta |
| **Identidad de acceso** | Identificador del usuario de Keycloak de la persona (0 o 1) | — |

**Correspondencia con IMD-001:**
- **Colaborador:** concepto derivado (D7).
- **Evaluador y Jefe de Ingeniería:** roles de la parte (BR-PRG-01).
- **Jefe de proyecto:** Rol-Nivel del catálogo (BR-CAT-13), asignado con la Asignación de Rol-Nivel.
- **Rol del catálogo:** no es un Rol de la parte del UDM. Así se evita mezclar el catálogo de competencias con los roles de la parte (enfoque A).

## 4. Datos de la persona y la organización, y ciclo de vida (sección 2)

**Campos.** Son una propuesta aprobada, con minimización de datos por tratarse de datos personales (asr-BR-TRA-01):

| Concepto | Campos | Fuera, deliberadamente |
|---|---|---|
| Persona | Código de colaborador (D9), nombres, apellidos y, opcional, un nombre preferido | Fecha de nacimiento, género, estado civil y foto |
| Identificación | Tipo (DNI, carné de extranjería, pasaporte, RUC; D10), número y país emisor. Una parte puede tener varias | — |
| Medio de contacto | Correo laboral, obligatorio para colaboradores; teléfono laboral, opcional; perfiles profesionales en línea, opcionales y múltiples, con URL y plataforma de una lista ampliable (LinkedIn, GitHub, Otro), D8 | Contactos personales y domicilio |
| Organización | Nombre (razón social si es empresa) y RUC si aplica | — |

**Ciclo de vida:**
- **Alta:** se crean la Persona, su código, su identificación, su correo laboral y su rol de Empleado o de Contratista con fecha desde. El vínculo con Keycloak puede quedar vacío.
- **Cambio:** los datos simples se corrigen. Roles, relaciones, asignaciones y contactos no se sobrescriben: se cierra la vigencia anterior y se abre una nueva.
- **Baja:** se cierra la vigencia del rol de Empleado o de Contratista. La persona **no se borra**, porque sus certificaciones históricas la necesitan (BR-ACR-03).

**Validaciones:**
- La identificación es única por tipo, número y país.
- El código de colaborador es único.
- El correo laboral es único entre los colaboradores vigentes.
- Un contratista tiene una relación de contratación vigente con un proveedor.
- De un mismo rol, una persona tiene **un solo nivel vigente** (D6).
- Colaborador = persona con un rol vigente de Empleado o de Contratista (D7).

**Perfiles profesionales:**
- Son datos personales. Hasta resolver P-08, los ven la propia persona y los roles de gestión.
- **No son evidencia de nivel**: la evidencia sigue BR-ACR-07 a BR-ACR-11.

## 5. Capacidades (sección 3)

| # | Capacidad | Quién la ejecuta (D11) |
|---|---|---|
| C1 | Registrar un colaborador: persona, código, identificación, correo, rol de Empleado o Contratista, unidad, jefe directo y proveedor si aplica | Jefe de Ingeniería |
| C2 | Actualizar datos y medios de contacto | Jefe de Ingeniería. El colaborador, solo sus perfiles profesionales y su teléfono |
| C3 | Gestionar la estructura organizacional: organización interna, unidades y jerarquía | Jefe de Ingeniería |
| C4 | Gestionar proveedores y contratistas | Jefe de Ingeniería |
| C5 | Asignar Rol-Nivel: varios roles con un nivel vigente por rol, y cambio de nivel cerrando el anterior | Jefe de Ingeniería |
| C6 | Asignar roles del programa: Evaluador y Jefe de Ingeniería | Jefe de Ingeniería |
| C7 | Dar de baja: cerrar la vigencia del rol de Empleado o Contratista | Jefe de Ingeniería |
| C8 | Vincular la identidad de acceso: registrar el identificador de Keycloak | Jefe de Ingeniería |
| C9 | Consultar la ficha y su historial | Jefe de Ingeniería; el colaborador, la suya |

**Qué aporta a lo existente:**
- **C5** alimenta UXR-004 (perfil) y UXR-005 (brecha), y define el Rol-Nivel del colaborador (P-28).
- **C1 y C8** resuelven de dónde salen los colaboradores y su vínculo con Keycloak (VIS-001 §11.4, KG-03).

## 6. Modelo de datos (sección 4)

### 6.1 Lógico

| Entidad | Clave y vínculos | Vigencia |
|---|---|---|
| PARTY → PERSON / ORGANIZATION | Supertipo con dos subtipos. PERSON tiene `employee_code`, único | — |
| PARTY_ROLE y PARTY_ROLE_TYPE | Parte y tipo de rol | `from_date` / `thru_date` |
| PARTY_RELATIONSHIP y PARTY_RELATIONSHIP_TYPE | Rol origen, rol destino y tipo | `from_date` / `thru_date` |
| PARTY_IDENTIFICATION e IDENTIFICATION_TYPE | Parte, tipo y país; única por tipo, número y país | — |
| CONTACT_MECHANISM (correo, teléfono, URL) y PARTY_CONTACT_MECHANISM | Parte, medio, propósito y plataforma del perfil | `from_date` / `thru_date` |
| ROLE_LEVEL_ASSIGNMENT | Persona y Rol-Nivel del catálogo; un solo nivel vigente por rol | `from_date` / `thru_date` |
| ACCESS_IDENTITY | Persona e identificador de Keycloak (0..1) | — |

**Reglas transversales:**
- Nada se sobrescribe ni se borra: se cierra la vigencia.
- Hay auditoría de quién cambió qué y cuándo.
- Los tipos (roles, relaciones, documentos, plataformas) son tablas ampliables.

**Frontera de arquitectura (ADR-001):**
- Un **microservicio de partes** es el único dueño de estos datos.
- El catálogo y la certificación los referencian por el identificador de la parte.
- Solo el BFF los expone al frontend.

### 6.2 Físico: MySQL 8.0.16 o superior, y PostgreSQL (D12)

| Tema | Decisión de diseño |
|---|---|
| Identificadores | UUID como `CHAR(36)` en los dos motores, o `BINARY(16)` en MySQL si se prioriza el rendimiento, según el diccionario de tipos |
| Fechas | Todo en **UTC**: `TIMESTAMP` en PostgreSQL y `DATETIME(6)` en MySQL |
| Un nivel vigente por rol | Columna generada `current_role_id`, que vale el rol mientras la asignación está vigente y NULL cuando está cerrada, más un índice único sobre la persona y esa columna. Funciona en los dos motores, porque ambos admiten varios NULL en un índice único |
| CHECK | Se usan (MySQL 8.0.16 o superior) |
| Restricciones diferibles | No se usan |

**Entregables:**
- El DDL portable.
- Un anexo MySQL y un anexo PostgreSQL con las diferencias.
- Pruebas de las restricciones clave ejecutadas en los dos motores.

**ADR asociado:** ADR-003 — Persistencia compatible con MySQL y PostgreSQL (decisor `human:ianache`, justificación pendiente).

## 7. Artefactos y verificación (sección 5)

| # | Artefacto | Ubicación | Skill |
|---|---|---|---|
| 1 | Esta especificación | `knowledge-base/requirement/specs/` | superpowers:brainstorming |
| 2 | Reglas `BR-PTY-*` y las decisiones D2 a D12 | BRC-001 | af-business-rule-extractor |
| 3 | Términos nuevos y la nota de "Colaborador" (derivado) | Glosario | af-business-glossary-curator |
| 4 | IMD-002 — Modelo conceptual Party, y actualización de IMD-001 (R-18, R-28, R-29) | `business/information-model/` | af-conceptual-model-designer |
| 5 | ADR-003 | `architecture/adrs/` | architecture-adr-writer |
| 6 | RCP-002, el Context Pack de la feature | `requirement/context-packs/` | af-requirement-context-builder |
| 7 | User Stories de C1 a C9 | `requirement/user-stories/` | af-user-story-refiner 2.0 |
| 8 | Modelo lógico y físico: DDL portable y anexos por motor | `architecture/data-model/` | data-model-designer |

**Verificación:**
- `check_model.py` sobre IMD-002 y `glossary.py check` sobre el glosario, los dos con 0 errores.
- Trazabilidad: cada historia cita sus reglas `BR-PTY-*`, y cada tabla cita su entidad lógica y su concepto de IMD-002.
- El DDL se ejecuta en **MySQL 8 y en PostgreSQL**, junto con las pruebas de: un nivel vigente por rol, identificación única, código único y correo laboral único entre vigentes. Si no hay motores disponibles, por ejemplo Docker, se reporta como verificación pendiente.
- Todo queda en `draft`, salvo el ADR-003, que queda Aceptado por decisión del decisor.

## 8. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| Q-01 | ¿Cómo se genera el código de colaborador: automático, manual o con formato? | Jefe de Ingeniería | Media |
| Q-02 | ¿Un contratista tiene jefe directo dentro de COMSATEL? | Jefe de Ingeniería | Media |
| Q-03 | ¿Un contratista tiene correo laboral de COMSATEL o el de su proveedor? Afecta a la unicidad del correo | Jefe de Ingeniería | Media |
| Q-04 | ¿La normativa de datos personales obliga a borrar o anonimizar a quien se va? (ADB-001 KG-04) | Legal + Jefe de Ingeniería | Alta |
| Q-05 | ¿Quién ve los datos de otras personas, incluidos los perfiles profesionales? (P-08) | Responsable de producto | Alta |
| Q-06 | ¿Hay Docker u otro medio para ejecutar MySQL 8 y PostgreSQL y verificar el DDL? | Jefe de Ingeniería | Media |
| Q-07 | Verificar la correspondencia con el UDM contra *The Data Model Resource Book, Vol. 1* (Silverston), que no se consultó en esta sesión | Arquitecto responsable | Media |
| Q-08 | ¿Qué versión mínima de PostgreSQL se soporta? | Arquitecto responsable | Baja |

## 9. Próximo paso

Revisión de esta especificación por el decisor. Con su aprobación, se escribe el plan de implementación de los artefactos (writing-plans).
