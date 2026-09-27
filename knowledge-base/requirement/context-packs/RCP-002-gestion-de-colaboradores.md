---
type: Requirement Context Pack
title: "RCP-002 — Gestión de colaboradores"
description: "Contexto funcional mínimo y trazable de la feature de información maestra de colaboradores, personas externas y estructura organizacional (SPEC-001), con el patrón Party del UDM, vigencias, vínculo con Keycloak y anonimización."
tags: [context-pack, requirements, colaboradores, party, master-data, anonimizacion]
status: draft
generated:
  by: "af-requirement-context-builder/1.0"
  at: "2026-09-27T11:30:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: gls-001
    resource: /knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md
---

# RCP-002 — Gestión de colaboradores

## 1. Metadata y pregunta de trabajo

- **Producto o proceso:** [Plataforma de Gestión de Formación del Recurso Humano](../../business/glossary/terms/TRM-0046-plataforma-de-gestion-de-formacion-del-recurso-humano.md), feature de información maestra de colaboradores.
- **Iniciativa:** [SPEC-001 — Gestión de colaboradores](../specs/SPEC-001-gestion-de-colaboradores.md), capacidades C1 a C11 (SPEC-001:L135-L149).
- **Responsable funcional:** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) (`human:ianache`), decisor de D1 a D24 (SPEC-001:L51-L78).
- **Fecha:** 2026-09-27.
- **Pregunta de trabajo:** ¿qué necesita saber el siguiente rol para redactar las User Stories de C1 a C11 y diseñar sus flujos sin volver a descubrir la feature? En concreto: actores, procesos, datos, reglas BR-PTY, dependencias y lo que sigue abierto.
- **Estado:** Borrador.

## 2. Objetivo y alcance

### Objetivo de negocio

Que la plataforma sea el sistema de registro de las personas que participan del programa y de las organizaciones con las que se relacionan (D2, BR-PTY-01), con historial por vigencias, para que el catálogo, la certificación y la búsqueda de personal (H1) tengan de dónde tomar a los colaboradores y su Rol-Nivel (SPEC-001:L29-L31, L151-L153).

Resultado observable:
- Cada colaborador existe una sola vez, con código, identificación, correo laboral y rol de Empleado o Contratista vigente.
- El Rol-Nivel asignado alimenta el perfil (US-004) y la brecha (US-005) (SPEC-001:L152).
- Los datos personales de quien se va se anonimizan a demanda, sin perder el historial ni los KPI (D14, D15).

### Incluido

- Personas colaboradoras (empleados y contratistas), estructura organizacional, proveedores y contratistas, historial con vigencias (D3; SPEC-001:L33-L39).
- Vínculo con el usuario de Keycloak, solo el identificador (D4).
- Asignación de Rol-Nivel del catálogo (D5, D6) y roles del programa (Evaluador, Jefe de Ingeniería).
- Baja, anonimización a demanda y aviso por correo al vencer el plazo (D14 a D23).

### Excluido

- Implementación en código, migración de datos (no hay), diseño de pantallas, integración con RR. HH., aprovisionamiento de usuarios en Keycloak y el uso de perfiles profesionales como evidencia de nivel (SPEC-001:L41-L47).
- El modelo de datos lógico y físico se documenta aparte (SPEC-001 §6; artefacto #8).

### Restricciones conocidas

- Nada se sobrescribe ni se borra: se cierra la vigencia; la única excepción es la anonimización (BR-PTY-12, BR-PTY-14; SPEC-001:L172).
- Minimización de datos personales: sin fecha de nacimiento, género, estado civil, foto, contactos personales ni domicilio (SPEC-001:L102-L109; asr-BR-TRA-01).
- Solo el BFF expone los datos al frontend; un microservicio de partes es el único dueño (ADR-001; SPEC-001:L176-L179).
- La autenticación la hace el BFF con Keycloak y PKCE (ADR-002).

## 3. Resumen ejecutivo del contexto

RCP-001 dejaba abierto de dónde salen los colaboradores (VIS-001 §11.4). SPEC-001 lo cierra: la plataforma es el sistema de registro, sin integración con RR. HH. (D2). La información sigue el patrón Party del UDM: una Parte es una Persona o una Organización; su participación se expresa con roles (Empleado, Contratista, Evaluador, Jefe de Ingeniería; Organización interna, Unidad organizacional, Proveedor) y relaciones (empleo, contratación, pertenencia, estructura, reporte), todos con vigencia (BR-PTY-02 a BR-PTY-04). "Colaborador" no es una entidad: es una persona con un rol vigente de Empleado o Contratista (D7, BR-PTY-05).

El Jefe de Ingeniería mantiene toda la información; el colaborador solo edita sus perfiles profesionales y su teléfono laboral (D11, BR-PTY-17). La baja cierra la vigencia del rol; la persona no se borra (BR-PTY-13). Después de la baja, un plazo configurable (guardado en la base de datos) dispara un correo automático al Jefe de Ingeniería vigente, enviado desde Gmail empresarial con credenciales en HashiCorp Vault; él decide si anonimiza (D15 a D23, BR-PTY-14, BR-PTY-15).

Quedan abiertos, con impacto en las historias: cómo se genera el código de colaborador (Q-01), si un contratista tiene jefe directo en COMSATEL (Q-02), quién ve los datos de otras personas (Q-05 / P-08), el método de autenticación ante Gmail (Q-14) y si solo se puede anonimizar a alguien dado de baja (inferencia de SPEC-001:L127).

## 4. Registro de evidencia

### Inventario de fuentes

| ID | Fuente | Tipo | Fecha o versión | Permiso / alcance |
|---|---|---|---|---|
| S-01 | [SPEC-001](../specs/SPEC-001-gestion-de-colaboradores.md) | Knowledge Base (especificación, `draft`) | 2026-09-27 | Interno; sesión con el decisor |
| S-02 | [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) §Colaboradores (BR-PTY-01 a BR-PTY-18; EVD-2026-0076 a 0095) | Knowledge Base (reglas, `draft`) | 2026-09-27 | Derivado de S-01 |
| S-03 | [ADR-001](../../architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md), [ADR-002](../../architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md) | Knowledge Base (ADR aceptados) | 2026-09-26 | Restricciones de arquitectura |
| S-04 | [GLS-001](../../business/glossary/GLS-001-glosario-de-negocio.md) | Knowledge Base (glosario) | 2026-09-26 | Términos existentes; los nuevos de SPEC-001 están en curso (artefacto #3) |

No se consultaron GDrive, GitLab ni *The Data Model Resource Book* (Q-07).

### Hallazgos

| ID | Hallazgo | Fuente y fragmento | Tipo | Confianza |
|---|---|---|---|---|
| E-01 | La plataforma es el sistema de registro, sin integración con RR. HH. | S-01:L57 (D2); EVD-2026-0076 | Decisión humana | Alta |
| E-02 | Solo se guarda el identificador de Keycloak (0 o 1); no se aprovisionan usuarios. | S-01:L58 (D4); EVD-2026-0077; BR-PTY-16 | Decisión humana | Alta |
| E-03 | Patrón Party: parte, rol de la parte, relación, identificación, medio de contacto; Asignación de Rol-Nivel aparte. | S-01:L59, L80-L92 (D5); EVD-2026-0078 | Decisión humana | Alta |
| E-04 | Varios Rol-Nivel por persona, un nivel vigente por rol. | S-01:L60 (D6); EVD-2026-0079; BR-PTY-11 | Decisión humana | Alta |
| E-05 | Colaborador = persona con rol vigente de Empleado o Contratista. | S-01:L61 (D7); EVD-2026-0080; BR-PTY-05 | Decisión humana | Alta |
| E-06 | Perfiles profesionales en línea como medio de contacto; no son evidencia de nivel. | S-01:L62, L131-L133 (D8); EVD-2026-0081; BR-PTY-09 | Decisión humana | Alta |
| E-07 | Código de colaborador único y obligatorio. | S-01:L63 (D9); EVD-2026-0082; BR-PTY-06 | Decisión humana | Alta |
| E-08 | Identificaciones: DNI, carné de extranjería, pasaporte y RUC; únicas por tipo, número y país. | S-01:L64, L120 (D10); EVD-2026-0083; BR-PTY-07 | Decisión humana | Alta |
| E-09 | Jefe de Ingeniería mantiene todo; el colaborador edita sus perfiles y su teléfono. | S-01:L65 (D11); EVD-2026-0084; BR-PTY-17 | Decisión humana | Alta |
| E-10 | Correo laboral: COMSATEL para empleados, proveedor para contratistas; único entre vigentes. | S-01:L67, L122 (D13); EVD-2026-0085; BR-PTY-08 | Decisión humana | Alta |
| E-11 | Anonimización de PII a demanda, irreversible, sin borrar registros; se conservan código y auditoría. | S-01:L68-L70, L115 (D14-D16); EVD-2026-0086 a 0088; BR-PTY-14 | Decisión humana | Alta |
| E-12 | Plazo desde la baja, en BD; correo automático a todos los correos vigentes de los Jefes de Ingeniería vigentes, desde Gmail empresarial; credenciales en Vault. | S-01:L71-L77 (D17-D23); EVD-2026-0089 a 0095; BR-PTY-15 | Decisión humana | Alta |
| E-13 | Se espera un único Jefe de Ingeniería vigente; un segundo se avisa sin impedirlo. | S-01:L74-L75 (D20, D21); EVD-2026-0092, 0093; BR-PTY-18 | Decisión humana | Alta |
| E-14 | Cambios de roles, relaciones, contactos y asignaciones cierran la vigencia; todo cambio se audita. | S-01:L113, L171-L173; BR-PTY-12 | Decisión humana | Alta |
| E-15 | Solo se anonimiza a una persona ya dada de baja. | S-01:L127 ("Inferencia a partir de C10; confirmar") | Hipótesis | Media |
| E-16 | Si no hay Jefe de Ingeniería con correo vigente, el aviso queda registrado como no enviado; si la cuenta falla, queda como fallido con reintentos. | S-01:L117, L125 | Hecho (propuesta aprobada) | Media |
| E-17 | Los campos de persona y organización son una propuesta aprobada con minimización de datos. | S-01:L102-L109 | Hecho (propuesta aprobada) | Media |
| E-18 | Cómo se genera el código de colaborador está abierto. | S-01:L223 (Q-01) | Vacío | Alta |
| E-19 | Si un contratista tiene jefe directo en COMSATEL está abierto. | S-01:L224 (Q-02) | Vacío | Alta |
| E-20 | Quién ve los datos de otras personas está abierto; hasta resolverlo, la propia persona y los roles de gestión ven los perfiles. | S-01:L132, L227 (Q-05 / P-08) | Vacío | Alta |

## 5. Hechos confirmados

Todos provienen de decisiones del decisor o de propuestas aprobadas en SPEC-001; ninguno está verificado.

- **Sistema de registro:** altas, cambios y bajas en la plataforma (E-01).
- **Modelo:** Party del UDM con vigencias; tipos de rol y de relación ampliables (E-03; BR-PTY-02 a BR-PTY-04).
- **Colaborador derivado** (E-05).
- **Alta:** persona, código, identificación, correo laboral y rol de Empleado o Contratista con fecha desde; el vínculo con Keycloak puede quedar vacío (SPEC-001:L112).
- **Validaciones:** código único (E-07), identificación única (E-08), correo laboral único entre vigentes y dependiente del tipo de colaborador (E-10), contratista con contratación vigente con un proveedor (BR-PTY-10), un nivel vigente por rol (E-04).
- **Permisos:** E-09.
- **Historial:** E-14.
- **Baja y anonimización:** E-11, E-12, E-13.

## 6. Supuestos e hipótesis

| ID | Afirmación | Tipo | Origen | Qué la confirmaría |
|---|---|---|---|---|
| H-01 | Solo se puede anonimizar a una persona sin roles de Empleado o Contratista vigentes. | Hipótesis (SPEC-001) | S-01:L127 | Confirmación del Jefe de Ingeniería |
| H-02 | "Roles de gestión" que ven los perfiles profesionales son el Jefe de Ingeniería y el Evaluador (BR-PRG-01). | Hipótesis (agente) | S-01:L132; BR-PRG-01 | Respuesta a Q-05 / P-08 |
| H-03 | El aviso de anonimización se genera una sola vez por persona y baja. | Hipótesis (agente) | S-01:L169 no lo dice | Jefe de Ingeniería |
| H-04 | El colaborador consulta su ficha a través de su usuario de Keycloak vinculado (C8), así que sin vínculo no puede consultarla. | Hipótesis (agente) | ADR-002; C8, C9 | Jefe de Ingeniería + arquitecto |
| S-01 | La correspondencia con el UDM es correcta. | Supuesto | S-01:L27 | Q-07 |

## 7. Vacíos y preguntas abiertas

| ID | Pregunta | Destinatario | Prioridad | Estado |
|---|---|---|---|---|
| Q-01 | ¿Cómo se genera el código de colaborador: automático, manual o con formato? | Negocio (Jefe de Ingeniería) | Media | Abierta (SPEC-001) |
| Q-02 | ¿Un contratista tiene jefe directo dentro de COMSATEL? | Negocio (Jefe de Ingeniería) | Media | Abierta (SPEC-001) |
| Q-05 | ¿Quién ve los datos de otras personas, incluidos los perfiles profesionales? (P-08) | Negocio (Responsable de producto) | Alta | Abierta (SPEC-001) |
| Q-06 | ¿Hay Docker u otro medio para verificar el DDL en MySQL 8 y PostgreSQL? | ARQ / DEV | Media | Abierta (SPEC-001); no afecta a las historias |
| Q-07 | Verificar la correspondencia con el UDM (Silverston). | ARQ | Media | Abierta (SPEC-001) |
| Q-08 | ¿Qué versión mínima de PostgreSQL se soporta? | ARQ | Baja | Abierta (SPEC-001); no afecta a las historias |
| Q-14 | ¿Cómo se autentica la plataforma ante Gmail empresarial? | ARQ | Media | Parcialmente respondida (D22: credenciales en Vault) |
| RCP2-Q1 | ¿Confirmar H-01: solo se anonimiza a una persona dada de baja? | Negocio (Jefe de Ingeniería) | Alta | Nueva |
| RCP2-Q2 | ¿Qué pasa con las asignaciones de Rol-Nivel, los roles del programa y las relaciones vigentes al dar de baja? ¿Se cierran también? | Negocio (Jefe de Ingeniería) | Media | Nueva |
| RCP2-Q3 | ¿Qué valor tiene el plazo por defecto y qué rango es válido? | Negocio (Jefe de Ingeniería) | Media | Nueva |
| RCP2-Q4 | ¿Una persona externa que no es colaboradora (por ejemplo, un contacto del proveedor) se registra en esta feature? SPEC-001 incluye "personas externas" solo como contratistas. | Negocio (Jefe de Ingeniería) | Baja | Nueva |
| P-28 | ¿La asignación de Rol-Nivel debe justificarse con competencias certificadas? | Negocio (Jefe de Ingeniería) | Alta | Parcialmente respondida (BRC-001) |

## 8. Actores, procesos, datos y dependencias

### Actores

| Actor | Papel | Evidencia | Capacidades |
|---|---|---|---|
| [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) | Mantiene toda la información maestra; decide la anonimización; recibe el aviso | D11, D15, D18; BR-PTY-17 | C1 a C11 |
| [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md) | Edita sus perfiles profesionales y su teléfono; consulta su ficha | D11; BR-PTY-17 | C2 (parcial), C9 |
| La plataforma | Envía el correo automático al vencer el plazo | D18; BR-PTY-15 | C11 |
| [Evaluador](../../business/glossary/terms/TRM-0021-evaluador.md) | Rol del programa que se asigna (no actúa en esta feature) | BR-PTY-03, BR-PRG-01 | C6 (objeto) |

La definición aprobada de Colaborador (TRM-0013) dice "Persona de COMSATEL"; D7 lo redefine como concepto derivado que incluye contratistas. La actualización del término está en curso (SPEC-001 artefacto #3).

### Procesos y estados

| Proceso | Actor | Resultado | Reglas |
|---|---|---|---|
| Alta (C1) | Jefe de Ingeniería | Persona colaboradora con rol vigente | BR-PTY-05 a 08, 10 |
| Cambio (C2, C3, C4, C5, C6, C8) | Jefe de Ingeniería; colaborador en C2 parcial | Datos corregidos o vigencia cerrada y nueva abierta | BR-PTY-12, 17 |
| Baja (C7) | Jefe de Ingeniería | Rol de Empleado o Contratista cerrado; persona conservada | BR-PTY-13 |
| Aviso (C11) | Plataforma | Correo al Jefe de Ingeniería; aviso pendiente/atendido; envío enviado/fallido/no enviado | BR-PTY-15 |
| Anonimización (C10) | Jefe de Ingeniería | PII reemplazada, irreversible | BR-PTY-14 |

Estados derivables: persona vigente → dada de baja → anonimizada (SPEC-001:L111-L115); aviso: pendiente, atendido; envío: enviado, fallido (con reintentos), no enviado (SPEC-001:L117, L125, L169).

### Datos relevantes (funcionales)

| Dato | Descripción | Fuente |
|---|---|---|
| Persona | Código, nombres, apellidos, nombre preferido opcional | SPEC-001:L106 |
| Identificación | Tipo, número, país emisor; varias por parte | SPEC-001:L107 |
| Medio de contacto | Correo laboral, teléfono laboral, perfiles profesionales (URL y plataforma) | SPEC-001:L108 |
| Organización | Nombre o razón social, RUC si aplica | SPEC-001:L109 |
| Rol de la parte, relación | Con vigencia desde/hasta | SPEC-001:L87-L88 |
| Asignación de Rol-Nivel | Persona y Rol-Nivel del catálogo, con vigencia | SPEC-001:L91 |
| Identidad de acceso | Identificador de Keycloak (0..1) | SPEC-001:L92 |
| Plazo de anonimización | Configurable, en BD, auditado | D23 |
| Aviso de anonimización | Fecha, destinatarios, estado del aviso y del envío | SPEC-001:L169 |

**Datos personales:** nombres, identificaciones, contactos y perfiles son PII. Minimización (SPEC-001:L102) y acceso mínimo hasta resolver Q-05.

### Dependencias y consumidores

- **Consumidores:** US-004 (perfil) y US-005 (brecha) usan el Rol-Nivel asignado (C5); US-003 usa a la persona como certificado y certificador; el catálogo (US-001) provee los Rol-Nivel.
- **Técnicas (restricciones, no diseño):** Keycloak (ADR-002), Gmail empresarial (D19), HashiCorp Vault (D22; ADR-004 previsto en `../../architecture/adrs/ADR-004-secretos-y-parametria-en-hashicorp-vault.md`), MySQL y PostgreSQL (D12; ADR-003 previsto en `../../architecture/adrs/ADR-003-persistencia-mysql-y-postgresql.md`).
- **Modelo:** IMD-002 previsto en `../../business/information-model/IMD-002-modelo-conceptual-de-partes.md` y LDM-001 en `../../architecture/data-model/LDM-001-modelo-logico-de-partes.md`.

## 9. Restricciones y riesgos funcionales

| Tipo | Descripción | Mitigación conocida | Fuente |
|---|---|---|---|
| Riesgo | El código de colaborador conservado es un cuasi-identificador | Restringir quién ve el código de anonimizados (junto con P-08) | SPEC-001:L116 |
| Riesgo | La cuenta de Gmail falla o alcanza su límite | Aviso fallido con reintentos | SPEC-001:L117 |
| Riesgo | Sin Jefe de Ingeniería con correo vigente, nadie recibe el aviso | Queda registrado como no enviado | SPEC-001:L125 |
| Riesgo | Dos Jefes de Ingeniería vigentes | Aviso sin impedir (D21); correo a todos (D20) | BR-PTY-18 |
| Restricción | Anonimización irreversible | Decisión a demanda del Jefe de Ingeniería | BR-PTY-14 |
| Ambigüedad | TRM-0013 "Colaborador" (persona de COMSATEL) frente a D7 (incluye contratistas) | Actualización del glosario en curso | S-04; D7 |

## 10. Decisiones y validación humana

| Decisión o validación | Responsable | Evidencia | Fecha |
|---|---|---|---|
| D1 a D24 de SPEC-001 | ianache (Jefe de Ingeniería) | SPEC-001 §2; EVD-2026-0076 a 0095 | 2026-09-27 |
| Propuestas aprobadas (campos, ciclo de vida, validaciones) | ianache (Jefe de Ingeniería) | SPEC-001 §4 | 2026-09-27 |
| **Validación de este pack** | Pendiente: Jefe de Ingeniería | — | — |

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

| Candidato | Provenance | Verificador | Estado |
|---|---|---|---|
| Regla: solo se anonimiza a una persona dada de baja (H-01) | SPEC-001:L127 | Jefe de Ingeniería | Pendiente |
| Regla: al dar de baja se cierran también Rol-Nivel, roles del programa y relaciones (RCP2-Q2) | Sin fuente; pregunta | Jefe de Ingeniería | Pendiente |
| Actualización de TRM-0013 Colaborador como concepto derivado | D7; BR-PTY-05 | Jefe de Ingeniería (vía af-business-glossary-curator) | En curso |

## 12. Handoff para el siguiente rol

### Qué puede usar el siguiente rol

- `af-user-story-refiner`: una historia por capacidad, US-015 a US-025 (C1 a C11), con las reglas BR-PTY-01 a BR-PTY-18 y las hipótesis de §6 etiquetadas.
- `ux-requirements-analyzer`: los estados de §8 y los permisos de E-09.

### Qué debe validar antes de continuar

- Q-05 (visibilidad), RCP2-Q1 (anonimizar solo a dados de baja), Q-01 (código) y Q-02 (jefe directo del contratista).
- La validación humana de este pack (§10).

### Artefactos relacionados

- [SPEC-001](../specs/SPEC-001-gestion-de-colaboradores.md) · [BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md) · [RCP-001](RCP-001-h1-idioma-comun.md) · [USC-001](../USC-001-user-stories-plataforma-gestion-formacion.md) · [ADR-001](../../architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md) · [ADR-002](../../architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md)
- Previstos (en elaboración): ADR-003, ADR-004, IMD-002, LDM-001 (rutas en §8).
