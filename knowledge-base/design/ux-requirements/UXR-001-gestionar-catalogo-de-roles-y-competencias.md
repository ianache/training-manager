---
type: UX Requirement
title: "UXR-001 — Gestionar el catálogo de roles y competencias"
description: "Lo que el Jefe de Ingeniería necesita ver y hacer para mantener roles, Rol-Nivel, competencias, rúbricas y requisitos de evidencia en un catálogo único."
tags: [ux-ui, ux-requirement, catalogo, h1]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-09-27T00:42:35-05:00"
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

- **Historia:** [US-001](../../requirement/user-stories/US-001-definir-catalogo-de-competencias.md), criterios AC-1 a AC-7.
- **Reglas:** BR-CAT-01 a BR-CAT-04, BR-CAT-07 a BR-CAT-15, BR-ACR-07 a BR-ACR-09.
- **Conceptos (IMD-001):** Rol, Nivel de rol, Competencia, Nivel requerido, Rúbrica, Requisito de evidencia.
- **Actor:** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md).
- **Transversal:** [UXR-000](UXR-000-requisitos-ux-transversales.md).

## Objetivo del usuario

Mantener un catálogo único y confiable, que proyectos, formación y certificación usen como la misma referencia.

## Necesidades de información

| ID | El usuario necesita ver… | Fuente |
|---|---|---|
| UXR-001.1 | La lista de roles (inicialmente: analista funcional, developer, analista QA, analista BI, diseñador UX, diseñador UI, jefe de proyecto) | BR-CAT-12 |
| UXR-001.2 | Para un rol, sus Rol-Nivel (1 a 4) y, para cada uno, sus competencias con el nivel L1–L4 esperado | BR-CAT-09, BR-CAT-10, BR-CAT-14 |
| UXR-001.3 | Para una competencia, su rúbrica: qué se evidencia en cada nivel L1–L4 | BR-CAT-15 |
| UXR-001.4 | Para una competencia y un nivel, sus requisitos de evidencia (uno o varios, todos obligatorios) | BR-ACR-07 a BR-ACR-09 |
| UXR-001.5 | Qué competencias son transversales y en qué roles se usa cada competencia | BR-CAT-07, BR-CAT-11 |

## Acciones

| ID | El usuario puede… | Fuente |
|---|---|---|
| UXR-001.6 | Crear un rol y sus Rol-Nivel | AC-1; BR-CAT-09 |
| UXR-001.7 | Asignar competencias del catálogo a un Rol-Nivel, con su nivel L1–L4 esperado | AC-1; BR-CAT-14 |
| UXR-001.8 | Crear una competencia y marcarla como transversal | AC-5; BR-CAT-11 |
| UXR-001.9 | Definir la rúbrica de una competencia, un descriptor por nivel L1–L4 | AC-7; BR-CAT-15 |
| UXR-001.10 | Definir los requisitos de evidencia de cada nivel de una competencia | AC-4; BR-ACR-08 |

## Reglas que la interfaz debe hacer visibles

- Una competencia asignada a un Rol-Nivel no se puede guardar sin nivel L1–L4 esperado (BR-CAT-03). La interfaz lo impide y explica por qué.
- El nivel L1–L4 se elige solo dentro de la escala (BR-CAT-02).
- Una competencia es la misma en todos los roles que la usan (BR-CAT-07). Por eso, cambiar su rúbrica o sus requisitos afecta a todos esos roles.
  - **Inferencia:** conviene que la interfaz muestre ese impacto antes de guardar. Confirmar con UX.
- Solo el Jefe de Ingeniería edita el catálogo (BR-CAT-04). El resto no ve las acciones de edición (UXR-000.2).

## Estados

- **Vacío:** no hay roles ni competencias.
- **Error de validación:** competencia sin nivel esperado.
- **Sin permiso:** solo lectura.
- **Carga y error:** según UXR-000.

## Supuestos

- La edición se hace sobre el catálogo vigente. No se sabe si hay versionado (P-02), así que no se diseña ninguna función de versiones.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| P-36 | ¿Cómo se combinan Junior y Senior con los Rol-Nivel 1 a 4? Define cómo se muestran los niveles | Jefe de Ingeniería | Alta |
| P-37 | ¿La rúbrica contiene los requisitos de evidencia, o son cosas distintas? Define si se editan en la misma vista | Jefe de Ingeniería | Alta |
| P-02 | ¿Se versiona el catálogo? | Jefe de Ingeniería | Media |
| US1-Q1 | ¿Se permite un rol sin competencias o una competencia repetida? | Jefe de Ingeniería | Baja |
| UXR-001-Q1 | ¿Otros roles (por ejemplo, el Jefe de proyecto) pueden consultar el catálogo en modo lectura? | Jefe de Ingeniería | Media |
