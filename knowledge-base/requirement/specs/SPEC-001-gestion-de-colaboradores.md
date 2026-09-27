---
type: Feature Specification
title: "SPEC-001 — Gestión de colaboradores: información maestra alineada con el patrón Party del UDM"
description: "Diseño aprobado de la feature de información maestra de colaboradores, personas externas y estructura organizacional, con modelo Party del Universal Data Model, vigencias, vínculo con Keycloak y persistencia compatible con MySQL y PostgreSQL."
tags: [spec, feature, colaboradores, party, udm, master-data, data-model]
status: draft
generated:
  by: "superpowers-brainstorming/6.4.1"
  at: "2026-09-27T18:00:00-05:00"
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
| D13 | El correo laboral de un **contratista** es **el de su proveedor**. El de un empleado es el de COMSATEL | Q-03 |
| D14 | Cuando una persona se va, sus **datos personales (PII) se anonimizan**; no se borran los registros | Q-04 (ADB-001 KG-04 en parte) |
| D15 | La anonimización se ejecuta **a demanda**. Cuando se cumple un **plazo configurable**, la plataforma **notifica al Jefe de Ingeniería**, que decide si anonimiza | Q-09 |
| D16 | El **código de colaborador** y las **referencias de auditoría** (quién certificó, quién cambió algo) **no se anonimizan** | Q-10 |
| D17 | El plazo de D15 se cuenta **desde que se registra la baja** de la persona | Q-11 (en parte) |
| D18 | Al vencer el plazo, la plataforma **envía automáticamente un correo** al Jefe de Ingeniería (la persona con ese rol vigente en la organización), a los medios de contacto de tipo **correo electrónico** que tenga registrados | Q-11 |
| D19 | Los correos se envían desde una **cuenta de Gmail empresarial** (Google Workspace) de la empresa | Q-12 |
| D20 | Se espera **un único Jefe de Ingeniería vigente**. Si hubiera más de uno (no debería suceder), el correo se envía **a todos** los que tengan el rol vigente | Q-13 |
| D21 | Al asignar un segundo rol vigente de Jefe de Ingeniería, la plataforma **avisa sin impedirlo** | Propuesta del agente sobre D20, aceptada |
| D22 | Las credenciales de la cuenta de Gmail se guardan en **HashiCorp Vault**, la plataforma elegida para almacenar parametría y datos sensibles | Q-14 (en parte) |
| D23 | El **plazo de anonimización** se guarda en la **base de datos** (ANONYMIZATION_SETTING), con su auditoría; Vault se usa para los secretos de esta feature | — |
| D24 | El uso de HashiCorp Vault se registra como **ADR-004** | — |
| D25 | El **código de colaborador** se genera **automáticamente** como un GUID | Q-01 |
| D26 | Un **contratista no tiene jefe directo** dentro de COMSATEL | Q-02 |
| D27 | Los datos de las personas, incluidos los perfiles profesionales, son **data abierta**: los ve cualquier colaborador que ingrese a la plataforma | Q-05 (P-08 en parte) |
| D28 | Se dispone de **Docker** para ejecutar MySQL y PostgreSQL y verificar el DDL | Q-06 |
| D29 | **No es necesario** verificar el modelo contra *The Data Model Resource Book*: el decisor revisó la información disponible y la considera suficiente | Q-07 |
| D30 | Se adopta la **versión estable más reciente de PostgreSQL** (open source) | Q-08 |

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
| Medio de contacto | Correo laboral, obligatorio para colaboradores: el de COMSATEL para empleados y el del proveedor para contratistas (D13); teléfono laboral, opcional; perfiles profesionales en línea, opcionales y múltiples, con URL y plataforma de una lista ampliable (LinkedIn, GitHub, Otro), D8 | Contactos personales y domicilio |
| Organización | Nombre (razón social si es empresa) y RUC si aplica | — |

**Ciclo de vida:**
- **Alta:** se crean la Persona, su código, su identificación, su correo laboral y su rol de Empleado o de Contratista con fecha desde. El vínculo con Keycloak puede quedar vacío.
- **Cambio:** los datos simples se corrigen. Roles, relaciones, asignaciones y contactos no se sobrescriben: se cierra la vigencia anterior y se abre una nueva.
- **Baja:** se cierra la vigencia del rol de Empleado o de Contratista. La persona **no se borra**, porque sus certificaciones históricas la necesitan (BR-ACR-03).
- **Anonimización (D14):** los datos personales de la persona se reemplazan por valores anónimos, **en todas sus vigencias e historial**: nombres, apellidos, nombre preferido, identificaciones, medios de contacto (correo, teléfono y perfiles profesionales) e identidad de acceso. Se conservan el identificador técnico de la parte, sus roles, relaciones, asignaciones de Rol-Nivel y certificaciones, con sus fechas, de modo que los KPI y el historial siguen siendo calculables sin identificar a la persona. Queda registro de cuándo y quién anonimizó. Es irreversible. Se ejecuta **a demanda** del Jefe de Ingeniería; cuando se cumple el plazo configurado, la plataforma le notifica que la persona puede anonimizarse (D15). **No se anonimizan** el código de colaborador ni las referencias de auditoría, así que las certificaciones siguen mostrando quién certificó mediante su código (D16).
- **Riesgo (D16):** el código de colaborador conservado es un **cuasi-identificador**. Si otro sistema usa el mismo código, podría volver a identificar a la persona. Se mitiga restringiendo quién ve el código de las personas anonimizadas (a definir junto con P-08). **Actualización (D25, D27):** el código es un GUID generado por la plataforma, que ningún otro sistema comparte, así que el riesgo baja; pero los datos son visibles para cualquier colaborador, así que la restricción propuesta ya no aplica sin una decisión explícita (P-52). **Actualización (2026-09-27, P-52):** a otros colaboradores solo se les muestran nombre, correo laboral, unidad, rol y perfiles profesionales (BR-PTY-20); el código no está en esa lista (inferencia: no se muestra).
- **Riesgo (D19):** el envío depende de una cuenta de Gmail empresarial. Sus credenciales se custodian en HashiCorp Vault (D22) y hay que respetar los límites de envío de la cuenta. Si la cuenta falla, el aviso queda como fallido con reintentos (ANONYMIZATION_NOTICE).

**Validaciones:**
- La identificación es única por tipo, número y país.
- El código de colaborador es único.
- El correo laboral es único entre los colaboradores vigentes.
- Un contratista tiene una relación de contratación vigente con un proveedor, y su correo laboral es el del proveedor (D13).
- Una persona anonimizada no se puede volver a identificar ni editar. Su código de colaborador y las referencias de auditoría se conservan (D16).
- El correo de aviso se envía a todos los medios de contacto de tipo correo electrónico vigentes de las personas con rol vigente de Jefe de Ingeniería. Se espera una sola; si hay más, se envía a todas (D20). Si no hay ningún Jefe de Ingeniería con correo vigente, el aviso queda registrado como no enviado.
- Al asignar un segundo rol vigente de Jefe de Ingeniería, la plataforma avisa sin impedirlo, porque se espera uno solo (D21).
- Solo se puede anonimizar a una persona sin roles de Empleado o Contratista vigentes, es decir, ya dada de baja. **Inferencia** a partir de C10; confirmar. Las reglas de unicidad (identificación, código y correo) ignoran a las personas anonimizadas.
- De un mismo rol, una persona tiene **un solo nivel vigente** (D6).
- Colaborador = persona con un rol vigente de Empleado o de Contratista (D7).

**Perfiles profesionales:**
- Son datos personales. ~~Hasta resolver P-08, los ven la propia persona y los roles de gestión.~~ Por D27 y P-52 (2026-09-27), los ve cualquier colaborador que ingrese a la plataforma (BR-PTY-20).
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
| C10 | Anonimizar los datos personales de una persona dada de baja, a demanda (D14, D15) | Jefe de Ingeniería |
| C11 | Configurar el plazo tras el cual se notifica que una persona puede anonimizarse (D15, D17). Al vencer, la plataforma envía un correo automático al Jefe de Ingeniería (D18) | Jefe de Ingeniería (configura); la plataforma (envía) |

**Qué aporta a lo existente:**
- **C5** alimenta UXR-004 (perfil) y UXR-005 (brecha), y define el Rol-Nivel del colaborador (P-28). *Nota 2026-09-27: P-28 quedó respondida (ianache (Jefe de Ingeniería)); el nivel inicial se asigna al registrar al colaborador (BR-PRF-02, EVD-2026-0103) y queda abierto cómo se decide el paso al siguiente nivel (P-42), ver BRC-001.*
- **C1 y C8** resuelven de dónde salen los colaboradores y su vínculo con Keycloak (VIS-001 §11.4, KG-03).

## 6. Modelo de datos (sección 4)

### 6.1 Lógico

| Entidad | Clave y vínculos | Vigencia |
|---|---|---|
| PARTY → PERSON / ORGANIZATION | Supertipo con dos subtipos. PERSON tiene `employee_code`, único, y `anonymized_at` / `anonymized_by`, que marcan la anonimización (D14) | — |
| PARTY_ROLE y PARTY_ROLE_TYPE | Parte y tipo de rol | `from_date` / `thru_date` |
| PARTY_RELATIONSHIP y PARTY_RELATIONSHIP_TYPE | Rol origen, rol destino y tipo | `from_date` / `thru_date` |
| PARTY_IDENTIFICATION e IDENTIFICATION_TYPE | Parte, tipo y país; única por tipo, número y país | — |
| CONTACT_MECHANISM (correo, teléfono, URL) y PARTY_CONTACT_MECHANISM | Parte, medio, propósito y plataforma del perfil | `from_date` / `thru_date` |
| ROLE_LEVEL_ASSIGNMENT | Persona y Rol-Nivel del catálogo; un solo nivel vigente por rol | `from_date` / `thru_date` |
| ACCESS_IDENTITY | Persona e identificador de Keycloak (0..1) | — |
| ANONYMIZATION_SETTING | Plazo configurable (por ejemplo, en días), contado desde el registro de la baja (D17), tras el cual se notifica que una persona dada de baja puede anonimizarse (D15) | — |
| ANONYMIZATION_NOTICE | Aviso generado para una persona cuando vence el plazo: fecha, destinatarios (las personas con rol vigente de Jefe de Ingeniería y sus correos, D18), estado del aviso (pendiente, atendido) y estado del envío del correo (enviado, fallido, con reintentos) | — |

**Reglas transversales:**
- Nada se sobrescribe ni se borra: se cierra la vigencia. La única excepción es la anonimización (D14), que reemplaza los valores de PII y deja registro.
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
| Anonimización | Las columnas de PII admiten un valor anónimo, por ejemplo NULL o un marcador fijo, y los índices únicos de identificación y correo excluyen a las personas anonimizadas. El código de colaborador es único entre todas las personas, anonimizadas incluidas, porque es un GUID que no se reutiliza (D25). En PostgreSQL se usa un índice parcial; en MySQL, una columna generada que vale NULL cuando la persona está anonimizada, el mismo mecanismo que "un nivel vigente por rol". Cada motor documenta su variante en su anexo |

**Entregables:**
- El DDL portable.
- Un anexo MySQL y un anexo PostgreSQL con las diferencias.
- Pruebas de las restricciones clave ejecutadas en los dos motores.

**ADR asociados:** ADR-003 — Persistencia compatible con MySQL y PostgreSQL, y ADR-004 — Secretos y parametría en HashiCorp Vault (decisor `human:ianache` en los dos, justificación pendiente).

## 7. Artefactos y verificación (sección 5)

| # | Artefacto | Ubicación | Skill |
|---|---|---|---|
| 1 | Esta especificación | `knowledge-base/requirement/specs/` | superpowers:brainstorming |
| 2 | Reglas `BR-PTY-*` y las decisiones D2 a D23. **Creadas:** BR-PTY-01 a BR-PTY-18 y EVD-2026-0076 a EVD-2026-0095 en [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) | BRC-001 | af-business-rule-extractor |
| 3 | Términos nuevos y la nota de "Colaborador" (derivado). **Creados:** TRM-0070 a TRM-0098 en [GLS-001](../../business/glossary/GLS-001-glosario-de-negocio.md); nota en [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) y pregunta GQ-18 | Glosario | af-business-glossary-curator |
| 4 | IMD-002 — Modelo conceptual Party, y actualización de IMD-001 (R-18, R-28, R-29). **Creado:** [IMD-002](../../business/information-model/IMD-002-modelo-conceptual-de-partes.md); [IMD-001](../../business/information-model/IMD-001-modelo-de-informacion-conceptual.md) actualizado | `business/information-model/` | af-conceptual-model-designer |
| 5 | ADR-003 — Persistencia compatible con MySQL y PostgreSQL (D12). **Creado:** [ADR-003](../../architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md) | `architecture/adrs/` | architecture-adr-writer |
| 5b | ADR-004 — Secretos y parametría en HashiCorp Vault (D22, D24). **Creado:** [ADR-004](../../architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md) | `architecture/adrs/` | architecture-adr-writer |
| 6 | RCP-002, el Context Pack de la feature. **Creado:** [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md) | `requirement/context-packs/` | af-requirement-context-builder |
| 7 | User Stories de C1 a C11. **Creadas:** [US-015](../user-stories/US-015-registrar-un-colaborador.md) (C1), [US-016](../user-stories/US-016-actualizar-datos-y-contactos.md) (C2), [US-017](../user-stories/US-017-gestionar-estructura-organizacional.md) (C3), [US-018](../user-stories/US-018-gestionar-proveedores-y-contratistas.md) (C4), [US-019](../user-stories/US-019-asignar-rol-nivel.md) (C5), [US-020](../user-stories/US-020-asignar-roles-del-programa.md) (C6), [US-021](../user-stories/US-021-dar-de-baja-a-un-colaborador.md) (C7), [US-022](../user-stories/US-022-vincular-identidad-de-acceso.md) (C8), [US-023](../user-stories/US-023-consultar-ficha-e-historial.md) (C9), [US-024](../user-stories/US-024-anonimizar-datos-personales.md) (C10), [US-025](../user-stories/US-025-configurar-plazo-y-aviso.md) (C11) | `requirement/user-stories/` | af-user-story-refiner 2.0 |
| 8 | Modelo lógico y físico: DDL portable y anexos por motor. **Creados:** [LDM-001](../../architecture/data-model/LDM-001-modelo-logico-de-partes.md), [PDM-001](../../architecture/data-model/PDM-001-modelo-fisico-de-partes.md), [DDL portable](../../architecture/data-model/ddl/party-portable.sql), [DDL MySQL](../../architecture/data-model/ddl/party-mysql.sql) y [anexo](../../architecture/data-model/PDM-001-anexo-mysql.md), [DDL PostgreSQL](../../architecture/data-model/ddl/party-postgresql.sql) y [anexo](../../architecture/data-model/PDM-001-anexo-postgresql.md), [TST-001](../../architecture/data-model/tests/TST-001-pruebas-de-restricciones.md) (ejecución pendiente, Q-06) | `architecture/data-model/` | data-model-designer |

**Verificación:**
- `check_model.py` sobre IMD-002 y `glossary.py check` sobre el glosario, los dos con 0 errores.
- Trazabilidad: cada historia cita sus reglas `BR-PTY-*`, y cada tabla cita su entidad lógica y su concepto de IMD-002.
- El DDL se ejecuta en **MySQL 8 y en PostgreSQL**, junto con las pruebas de: un nivel vigente por rol, identificación única, código único, correo laboral único entre vigentes y anonimización (que no quede PII en ninguna tabla ni vigencia, y que las unicidades ignoren a los anonimizados; que se conserven el código y la auditoría, D16; y que se genere el aviso al vencer el plazo, D15). Si no hay motores disponibles, por ejemplo Docker, se reporta como verificación pendiente.
- Todo queda en `draft`, salvo ADR-003 y ADR-004, que quedan Aceptados por decisión del decisor.

## 8. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|---|
| Q-01 | ¿Cómo se genera el código de colaborador: automático, manual o con formato? | Jefe de Ingeniería | Media | **Respondida (D25):** automático, GUID |
| Q-02 | ¿Un contratista tiene jefe directo dentro de COMSATEL? | Jefe de Ingeniería | Media | **Respondida (D26):** no |
| Q-03 | ¿Un contratista tiene correo laboral de COMSATEL o el de su proveedor? | Jefe de Ingeniería | Media | **Respondida (D13):** el del proveedor |
| Q-04 | ¿La normativa obliga a borrar o anonimizar a quien se va? | Legal + Jefe de Ingeniería | Alta | **Respondida (D14):** se anonimizan los datos PII |
| Q-05 | ¿Quién ve los datos de otras personas, incluidos los perfiles profesionales? (P-08) | Responsable de producto | Alta | **Respondida (D27):** cualquier colaborador que ingrese a la plataforma (data abierta). P-52 fijó el alcance el 2026-09-27: solo nombre, correo laboral, unidad, rol y perfiles profesionales (BR-PTY-20) |
| Q-06 | ¿Hay Docker u otro medio para ejecutar MySQL 8 y PostgreSQL y verificar el DDL? | Jefe de Ingeniería | Media | **Respondida (D28):** sí, Docker. La ejecución de las pruebas sigue pendiente mientras Docker Desktop no esté en marcha |
| Q-07 | Verificar la correspondencia con el UDM contra *The Data Model Resource Book, Vol. 1* (Silverston), que no se consultó en esta sesión | Arquitecto responsable | Media | **Respondida (D29):** no es necesario |
| Q-08 | ¿Qué versión mínima de PostgreSQL se soporta? | Arquitecto responsable | Baja | **Respondida (D30):** la versión estable más reciente |
| Q-09 | ¿Cuándo se anonimiza y quién lo ejecuta? | Jefe de Ingeniería + Legal | Alta | **Respondida (D15):** a demanda, con notificación al Jefe de Ingeniería al cumplirse un plazo configurable |
| Q-10 | ¿La anonimización alcanza al código de colaborador y a las referencias de auditoría? | Jefe de Ingeniería + Legal | Alta | **Respondida (D16):** no |
| Q-11 | ¿Desde cuándo se cuenta el plazo y por qué canal llega la notificación? | Jefe de Ingeniería | Media | **Respondida (D17, D18):** desde el registro de la baja, por correo automático al Jefe de Ingeniería |
| Q-12 | ¿Qué servicio de envío de correo usa la plataforma? | Arquitecto responsable | Media | **Respondida (D19):** cuenta de Gmail empresarial de la empresa |
| Q-13 | Si hay varias personas con rol vigente de Jefe de Ingeniería, ¿el correo va a todas? | Jefe de Ingeniería | Baja | **Respondida (D20):** se espera una sola; si hay más, a todas |
| Q-14 | ¿Cómo se autentica la plataforma ante la cuenta de Gmail empresarial y dónde se guardan esas credenciales? | Arquitecto responsable | Media | **Parcialmente respondida (D22):** las credenciales van en HashiCorp Vault. Sigue abierto el método de autenticación (OAuth con cuenta de servicio, contraseña de aplicación u otro) |

## 9. Próximo paso

Revisión de esta especificación por el decisor. Con su aprobación, se escribe el plan de implementación de los artefactos (writing-plans).
