---
type: UX Requirement
title: "UXR-001 — Gestionar el catálogo de roles y competencias"
description: "Lo que el Jefe de Ingeniería necesita ver y hacer para mantener roles, Rol-Nivel, competencias, rúbricas y requisitos de evidencia en un catálogo único."
tags: [ux-ui, ux-requirement, catalogo, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T13:30:00-05:00"
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
- **Reglas:** BR-CAT-01 a BR-CAT-04, BR-CAT-07 a BR-CAT-19, BR-ACR-07 a BR-ACR-09, BR-ACR-12.
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

## Reglas que la interfaz debe hacer visibles

- Una competencia asignada a un Rol-Nivel no se puede guardar sin nivel L1–L4 esperado (BR-CAT-03). La interfaz lo impide y explica por qué.
- El nivel L1–L4 se elige solo dentro de la escala (BR-CAT-02).
- Una competencia es la misma en todos los roles que la usan (BR-CAT-07). Por eso, cambiar su rúbrica o sus requisitos afecta a todos esos roles.
  - **Inferencia:** conviene que la interfaz muestre ese impacto antes de guardar. Confirmar con UX.
- Solo el Jefe de Ingeniería edita el catálogo, define los requisitos de evidencia y define y aprueba las rúbricas (BR-CAT-04, BR-CAT-16, BR-CAT-19). El resto no ve las acciones de edición (UXR-000.2).
- Un requisito de evidencia no se guarda sin marcarlo como "requerida" o "deseada" (BR-ACR-12). La interfaz explica la diferencia: las requeridas son obligatorias para certificar y las deseadas, opcionales (BR-ACR-09).
- La interfaz no pide escala salarial, responsabilidades (MOF) ni criterios de nivel como los años de experiencia: están fuera de alcance (BR-CAT-18; P-40).

## Estados

- **Vacío:** no hay roles ni competencias.
- **Error de validación:** competencia sin nivel esperado; requisito de evidencia sin marcar como requerida o deseada.
- **Parcial:** competencia con niveles aún sin requisitos de evidencia (BR-CAT-17). No es un error; qué implica para certificar está abierto (P-39).
- **Sin permiso:** solo lectura.
- **Carga y error:** según UXR-000.

## Supuestos

- La edición se hace sobre el catálogo vigente. No se sabe si hay versionado (P-02), así que no se diseña ninguna función de versiones.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| ~~P-36~~ | ~~¿Cómo se combinan Junior y Senior con los Rol-Nivel 1 a 4?~~ Respondida (ianache (Jefe de Ingeniería), 2026-09-27): cada rol define sus niveles y nombres al registrarse (BR-CAT-09). La vista de niveles debe admitir una cantidad variable | Jefe de Ingeniería | — |
| P-39 | ¿Se puede exigir en un Rol-Nivel un nivel de competencia sin requisitos de evidencia definidos? Define si la interfaz avisa o bloquea al asignarlo | Jefe de Ingeniería | Alta |
| P-40 | ¿Se registran criterios de cada nivel de rol (años de experiencia, formación técnica)? Se supone que no (BR-CAT-18) | Jefe de Ingeniería | Media |
| P-37 | ¿La rúbrica contiene los requisitos de evidencia, o son cosas distintas? Define si se editan en la misma vista. Respondida (ianache (Jefe de Ingeniería), 2026-09-27): la rúbrica describe el logro verificable y la define y aprueba el Jefe de Ingeniería (BR-CAT-15, BR-CAT-19); que sean cosas distintas es una inferencia a confirmar | Jefe de Ingeniería | Media |
| P-02 | ¿Se versiona el catálogo? | Jefe de Ingeniería | Media |
| US1-Q1 | ¿Se permite un rol sin competencias o una competencia repetida? | Jefe de Ingeniería | Baja |
| UXR-001-Q1 | ¿Otros roles (por ejemplo, el Jefe de proyecto) pueden consultar el catálogo en modo lectura? | Jefe de Ingeniería | Media |
