---
type: UX Requirement
title: "UXR-001 — Gestionar el catálogo de roles y competencias"
description: "Lo que el Jefe de Ingeniería necesita ver y hacer para mantener roles, Rol-Nivel, competencias, rúbricas y requisitos de evidencia en un catálogo único."
tags: [ux-ui, ux-requirement, catalogo, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-03T23:30:00-05:00"
sources:
  - id: us-001
    resource: /knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
---

# UXR-001 — Gestionar el catálogo de roles y competencias

## Trazabilidad

- **Historia:** [US-001](../../requirement/user-stories/US-001-definir-catalogo-de-competencias.md), criterios AC-1 a AC-9.
- **Reglas:** BR-CAT-01 a BR-CAT-04, BR-CAT-07 a BR-CAT-21, BR-ACR-07 a BR-ACR-09, BR-ACR-12, BR-ACR-13, BR-TRA-02.
- **Actualización 2026-10-03:** decisiones de DSP-001 (EVD-2026-0143 a 0151); ver API-SPEC-003.
- **Conceptos (IMD-001):** Rol, Nivel de rol, Competencia, Nivel requerido, Rúbrica, Requisito de evidencia.
- **Actor:** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Mantener un catálogo único y confiable, que proyectos, formación y certificación usen como la misma referencia.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-001.1 | La lista de roles (inicialmente: analista funcional, developer, analista QA, analista BI, diseñador UX, diseñador UI, jefe de proyecto) | BR-CAT-12 |
| UXR-001.2 | Para un rol, sus Rol-Nivel con el nombre que les dio el rol (la cantidad varía por rol; por ejemplo, Developer Junior (Nivel 1) a (Nivel 3)) y, para cada uno, sus competencias con el nivel L1–L4 esperado | BR-CAT-09, BR-CAT-10, BR-CAT-14 |
| UXR-001.3 | Para una competencia, su rúbrica: qué se evidencia en cada nivel L1–L4 | BR-CAT-15 |
| UXR-001.4 | Para una competencia y un nivel, sus requisitos de evidencia (uno o varios), cada uno marcado como "requerida" o "deseada" | BR-ACR-07 a BR-ACR-09, BR-ACR-12 |
| UXR-001.5 | Qué competencias son transversales y en qué roles se usa cada competencia | BR-CAT-07, BR-CAT-11 |
| UXR-001.5b | Qué niveles L1–L4 de cada competencia todavía no tienen requisitos de evidencia definidos (la definición es progresiva) | BR-CAT-17. **Inferencia:** ayuda a completar el catálogo; confirmar con UX |

## Acciones

| ID | El usuario puede… | Fuente |
|---|---|---|
| UXR-001.6 | Crear un rol y definir sus Rol-Nivel al registrarlo: cuántos y con qué nombre | AC-1; BR-CAT-09 |
| UXR-001.7 | Asignar competencias del catálogo a un Rol-Nivel, con su nivel L1–L4 esperado | AC-1; BR-CAT-14 |
| UXR-001.8 | Crear una competencia y marcarla como transversal | AC-5; BR-CAT-11 |
| UXR-001.9 | Definir y aprobar la rúbrica de una competencia: por nivel L1–L4, el comportamiento y el logro visible y verificable que se espera | AC-7; BR-CAT-15, BR-CAT-19 |
| UXR-001.10 | Definir los requisitos de evidencia de cada nivel de una competencia, uno a uno y cuando se decida (no todos a la vez) | AC-4, AC-9; BR-ACR-08, BR-CAT-16, BR-CAT-17 |
| UXR-001.11 | Marcar cada requisito de evidencia como "requerida" o "deseada" | AC-8; BR-ACR-12 |
| UXR-001.12 | Crear una versión nueva de una competencia, revisarla y aprobarla | BR-CAT-22; EVD-2026-0143, 0144 |
| UXR-001.13 | Ver dónde se usa una versión y qué Rol-Nivel referencian una versión anterior (advertencia con sugerencia de la nueva) | EVD-2026-0143 |

## Reglas que la interfaz debe hacer visibles

- Una competencia asignada a un Rol-Nivel no se puede guardar sin nivel L1–L4 esperado (BR-CAT-03). La interfaz lo impide y explica por qué.
- Un rol no se puede guardar sin al menos una competencia (BR-CAT-20, respuesta a US1-Q1, 2026-09-27). Una misma competencia, por ejemplo una general como la comunicación oral o escrita, sí puede estar en varios roles.
- Una competencia no se repite dentro de un rol (BR-CAT-21, respuesta a US1-Q1, 2026-09-27). La interfaz impide agregar dos veces la misma competencia a un Rol-Nivel. **Confirmado (EVD-2026-0148, 2026-10-03):** aparece una sola vez en cada Rol-Nivel, con un solo nivel L1–L4 esperado, y en los niveles superiores del rol puede exigirse con un L mayor (BR-CAT-14), porque los niveles superiores cubren las competencias de los inferiores; por eso no se bloquea que la misma competencia esté en otro Rol-Nivel del mismo rol.
- No se puede exigir en un Rol-Nivel un nivel de una competencia que no tiene requisitos de evidencia definidos (BR-ACR-13, respuesta a P-39, 2026-09-27). La interfaz lo **bloquea** al asignarlo y explica que primero hay que definir cómo se evidencia ese nivel. **Confirmado (EVD-2026-0149, 2026-10-03):** al menos uno de los requisitos del nivel debe ser «requerido»; la interfaz lo exige al guardar.
- El nivel L1–L4 se elige solo dentro de la escala (BR-CAT-02).
- Una competencia es la misma en todos los roles que la usan (BR-CAT-07). Por eso, cambiar su rúbrica o sus requisitos afecta a todos esos roles.
  - **Inferencia:** conviene que la interfaz muestre ese impacto antes de guardar. Confirmar con UX.
- Edita el catálogo el Jefe de Ingeniería y, desde el 2026-10-03, también el Responsable de producto, sin límite por producto (EVD-2026-0147, 0150; el rol aún no existe en Keycloak, AQ-1 de API-SPEC-003). Definir los requisitos de evidencia y definir y aprobar las rúbricas sigue siendo solo del Jefe de Ingeniería (BR-CAT-16, BR-CAT-19). El resto no ve las acciones de edición (UXR-000.2).
- **Versiones de competencia (EVD-2026-0143, 0144):** editar una competencia crea una versión nueva en borrador; al aprobarla (Jefe de Ingeniería o ADMIN) pasa a ser la vigente para nuevas asignaciones, sin alterar los Rol-Nivel existentes. Donde un Rol-Nivel referencia una versión anterior, la interfaz muestra un **símbolo de advertencia** que sugiere asignar la nueva. La advertencia no puede ser solo un color ni solo un icono (UXR-000).
- Un requisito de evidencia no se guarda sin marcarlo como "requerida" o "deseada" (BR-ACR-12). La interfaz explica la diferencia: las requeridas son obligatorias para certificar y las deseadas, opcionales (BR-ACR-09).
- La interfaz no pide escala salarial, responsabilidades (MOF) ni criterios de nivel como los años de experiencia: están fuera de alcance: son parte del MOF (BR-CAT-18; P-40 respondida el 2026-09-27).
- Cualquier colaborador puede consultar el catálogo en modo lectura, sin restricción (BR-TRA-02, respuesta a UXR-001-Q1, 2026-09-27). Solo quien puede editar ve las acciones de edición.

## Estados

- **Vacío:** no hay roles ni competencias.
- **Error de validación:** competencia sin nivel esperado; requisito de evidencia sin marcar como requerida o deseada; rol sin competencias (BR-CAT-20); competencia repetida en un Rol-Nivel (BR-CAT-21); nivel de competencia sin requisitos de evidencia asignado a un Rol-Nivel (BR-ACR-13).
- **Parcial:** competencia con niveles aún sin requisitos de evidencia (BR-CAT-17). Mientras se define el catálogo no es un error, pero ese nivel no se puede certificar ni exigir en un Rol-Nivel o requerimiento hasta tener requisitos (BR-ACR-13, P-39 respondida). La interfaz debe mostrarlo como no utilizable.
- **Solo lectura:** cualquier colaborador que no edita el catálogo lo consulta sin acciones de edición (BR-TRA-02).
- **Carga y error:** según UXR-000.

## Supuestos

- ~~La edición se hace sobre el catálogo vigente.~~ **Reemplazado el 2026-10-03:** las competencias se versionan (reglas arriba) y los roles no. Histórico: P-02 se respondió en parte el 2026-09-27: se versionan los **cursos** (BR-FOR-06 a BR-FOR-10), pero el versionado del **catálogo** sigue abierto (P-50), así que no se diseña ninguna función de versiones del catálogo. **Actualización (2026-09-27, P-50 en parte):** se versionan las **competencias**, no los roles (BR-CAT-22). Una función de versiones aplicaría solo a la competencia (**inferencia:** con su rúbrica y sus requisitos de evidencia, y estados DRAFT, APPROVED y DEPRECATED, como los cursos). Todavía no se diseña: faltan el efecto de una versión nueva sobre Rol-Nivel, requerimientos y certificaciones (P-50.1) y quién la aprueba (P-50.2).

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| ~~P-36~~ | ~~¿Cómo se combinan Junior y Senior con los Rol-Nivel 1 a 4?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): cada rol define sus niveles y nombres al registrarse (BR-CAT-09). La vista de niveles debe admitir una cantidad variable | Jefe de Ingeniería | — |
| ~~P-39~~ | ~~¿Se puede exigir en un Rol-Nivel un nivel de competencia sin requisitos de evidencia definidos?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): no; siempre debe haber forma de evidenciar (BR-ACR-13). La interfaz bloquea la asignación | Jefe de Ingeniería | — |
| ~~P-40~~ | ~~¿Se registran criterios de cada nivel de rol (años de experiencia, formación técnica)?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): por ahora no; son parte del MOF, fuera de alcance (BR-CAT-18) | Jefe de Ingeniería | — |
| P-37 | ¿La rúbrica contiene los requisitos de evidencia, o son cosas distintas? Define si se editan en la misma vista. Respondida (ianache (Jefe de Ingeniería), 2026-09-27): la rúbrica describe el logro verificable y la define y aprueba el Jefe de Ingeniería (BR-CAT-15, BR-CAT-19); que sean cosas distintas es una inferencia a confirmar | Jefe de Ingeniería | Media |
| ~~P-02 / P-50~~ | ~~¿Se versiona el catálogo?~~ Respondida (ianache (Jefe de Ingeniería), 2026-10-03): se versionan las competencias, no los roles; la versión nueva no altera lo vigente y la aprueba el Jefe de Ingeniería o ADMIN (EVD-2026-0143, 0144) | Jefe de Ingeniería | — |
| ~~UXR-001-Q2~~ | ~~¿La versión incluye la rúbrica y los requisitos de evidencia, y qué pasa con la versión anterior al aprobar la nueva (DEPRECATED)? (DM-Q-01, DM-Q-02 de LDM-002)~~ Respondida (ianache, 2026-10-03): sí, incluye rúbrica y requisitos y la anterior pasa a DEPRECATED (EVD-2026-0152, 0153). | Jefe de Ingeniería | Alta |
| ~~UXR-001-Q3~~ | ~~¿Qué rol de Keycloak es el Responsable de producto y qué edita (AQ-1 de API-SPEC-003)?~~ Respondida (ianache, 2026-10-03): rol `product_owner` creado (EVD-2026-0165). | Jefe de Ingeniería | Alta |
| ~~US1-Q1~~ | ~~¿Se permite un rol sin competencias o una competencia repetida?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): un rol debe tener al menos una competencia, y una competencia puede repetirse en varios roles (BR-CAT-20) pero no dentro de un rol (BR-CAT-21; interpretación a confirmar: una vez por Rol-Nivel) | Jefe de Ingeniería | — |
| ~~UXR-001-Q1~~ | ~~¿Otros roles (por ejemplo, el Jefe de proyecto) pueden consultar el catálogo en modo lectura?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): todos los colaboradores, sin restricción (BR-TRA-02) | Jefe de Ingeniería | — |
