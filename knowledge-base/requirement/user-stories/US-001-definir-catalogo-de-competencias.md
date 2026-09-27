---
type: Refined User Story
title: "US-001 — Definir el catálogo de roles y competencias"
description: "El Jefe de Ingeniería define los roles, comunes a todos los productos, sus niveles de rol (Junior y Senior) y, para cada nivel, las competencias que exige con su nivel requerido L1–L4."
tags: [user-story, h1, catalogo, competencias]
status: draft
generated:
  by: "af-user-story-refiner/1.0"
  at: "2026-09-26T23:20:00-05:00"
sources:
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
  - id: usc-001
    resource: /knowledge-base/requirement/USC-001-user-stories-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
---

# US-001 — Definir el catálogo de roles y competencias

## Objetivo y alcance

- **Pregunta:** ¿qué debe cumplir la definición del catálogo para que proyectos, formación y certificación midan contra la misma referencia?
- **Consumidor:** `ux-requirements-analyzer` (UX-101) y el Jefe de Ingeniería, que valida.
- **Incluye:** alta de roles, competencias y niveles requeridos en un catálogo único, común a todos los productos (BR-CAT-07, BR-CAT-08).
- **Excluye:** versionado y edición con efectos sobre datos vigentes (depende de P-02); rutas de formación (H2).
- **Contexto:** [RCP-001](../context-packs/RCP-001-h1-idioma-comun.md), que está "En validación".

## Resultado

**Como** [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md), **quiero** definir los [roles](../../business/glossary/terms/TRM-0055-rol.md), las [competencias](../../business/glossary/terms/TRM-0014-competencia.md) de cada rol y el [nivel requerido](../../business/glossary/terms/TRM-0043-nivel-requerido.md) de cada una en un [catálogo](../../business/glossary/terms/TRM-0007-catalogo-de-competencias.md) común a todos los [productos](../../business/glossary/terms/TRM-0047-producto.md), **para que** proyectos, formación y certificación midan contra la misma referencia.

### Criterios de aceptación

| ID | Dado | Cuando | Entonces | Regla |
|---|---|---|---|---|
| AC-1 | que soy el Jefe de Ingeniería | registro un rol con sus niveles (Rol-Nivel 1 a 4) y, para cada Rol-Nivel, sus competencias con el nivel L1–L4 esperado | el rol queda en el catálogo y puede pedirse, con su nivel, en proyectos de cualquier producto | BR-CAT-01, BR-CAT-04, BR-CAT-08 a BR-CAT-10, BR-CAT-14 |
| AC-2 | un rol en edición | agrego una competencia sin nivel requerido | el rol no se puede guardar hasta que esa competencia tenga nivel | BR-CAT-03 |
| AC-3 | un rol en edición | asigno un nivel que no pertenece a la [escala L1–L4](../../business/glossary/terms/TRM-0020-escala-de-niveles-de-dominio.md) | el nivel se rechaza | BR-CAT-02 |
| AC-4 | una competencia del catálogo | defino las evidencias necesarias para uno de sus niveles L1–L4 (una o varias) | esas evidencias quedan asociadas a esa competencia y ese nivel, y la certificación exigirá todas | BR-ACR-07, BR-ACR-08, BR-ACR-09 |
| AC-5 | una competencia transversal (por ejemplo, trabajo en equipo) | la asigno a varios roles | es la misma competencia del catálogo en todos ellos, con el nivel esperado que fija cada Rol-Nivel | BR-CAT-07, BR-CAT-11, BR-CAT-14 |
| AC-6 | el catálogo inicial | se consulta la lista de roles | contiene analista funcional, developer, analista QA, analista BI, diseñador UX, diseñador UI y jefe de proyecto, y el Jefe de Ingeniería puede agregar otros | BR-CAT-12 |
| AC-7 | una competencia del catálogo | defino su rúbrica | la rúbrica describe, para cada nivel L1–L4, cómo se evidencia la competencia | BR-CAT-15 |

### Casos negativos y límite

- **Negativo:** un usuario que no es el Jefe de Ingeniería intenta modificar el catálogo, y no puede (BR-CAT-04).
- **Límite sin regla:** un rol sin competencias, o la misma competencia dos veces en un rol. Ninguna fuente lo trata (US1-Q1).

## Evidencias y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0001 | Productos en alcance: CLocator, CLocator v2 (C-Go), SIGO, SmartSuite | VIS-001:L23 | fact | high |
| EVD-2026-0002 | Producto → Rol → Competencia → Nivel requerido | VIS-001:L56 | fact | medium |
| EVD-2026-0003 | Escala L1–L4 | VIS-001:L62-L69 | decision | high |
| EVD-2026-0004 | Cada rol exige un nivel mínimo por competencia | VIS-001:L71 | fact | medium |
| EVD-2026-0005 | El Jefe de Ingeniería es dueño del catálogo | VIS-001:L51, L162 | decision | high |
| EVD-2026-0006 | Papel del Responsable de producto por confirmar | VIS-001:L44, L155 | gap | high |
| EVD-2026-0024 | Versionado del catálogo abierto | VIS-001:L142, L151 | gap | high |
| EVD-2026-0052 | Para cada competencia y cada nivel (L1–L4), se define qué tipo de evidencia demuestra el logro de ese nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0056 | Los roles son independientes de los productos (por ejemplo, Analista de Calidad o Developer): los mismos roles se desempeñan en los proyectos de cualquier producto. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0057 | Un nivel de una competencia puede exigir varias evidencias: se definen todas las evidencias necesarias para demostrar que el colaborador alcanza ese nivel, y certificarlo exige presentarlas todas. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0059 | Un rol tiene un conjunto de competencias (por ejemplo, un Developer debe ser competente creando pruebas unitarias y creando unidades de despliegue). Los roles tienen niveles de rol, normalmente varios niveles Junior y varios Senior, y las competencias del rol se definen para cada nivel de rol. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0060 | Algunas competencias son transversales, es decir, comunes a varios roles; por ejemplo, las competencias blandas como el trabajo en equipo. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0063 | Los roles del catálogo son normalmente: analista funcional, developer, analista QA, analista BI, diseñador UX, diseñador UI y jefe de proyecto. Se pueden definir otros roles como parte del catálogo. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0068 | Cada nivel de rol exige sus competencias con un nivel L1–L4 esperado; por ejemplo, a un Developer Junior Nivel 1 se le exigen competencias de L1, y a un Developer Junior Nivel 2 se le exige al menos una competencia de nivel superior a L1. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0069 | Las competencias transversales se asignan a los roles. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0070 | Por cada competencia hay una rúbrica que, para cada nivel L1 a L4, define cómo se evidencia la competencia, es decir, lo que se espera que el colaborador evidencie para certificarlo en ese nivel. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |
| EVD-2026-0071 | Cuando se define un Rol-Nivel (niveles 1, 2, 3 o 4 de un rol) se establecen sus competencias y el nivel L1 a L4 esperado del desarrollo de cada competencia. | Decisión humana: ianache (Jefe de Ingeniería), 2026-09-26 | decision | high |

Evidencia compartida: `source_type: document`, `observed_at: 2026-09-26T20:55:58-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

## Reglas, dependencias e impactos

- **Reglas:** BR-CAT-01 a BR-CAT-04, BR-CAT-07 a BR-CAT-15 y BR-ACR-07 a BR-ACR-09 ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)).
- **Hipótesis:** el tipo de evidencia se define en el catálogo y lo gobierna el Jefe de Ingeniería. Es una inferencia a partir de BR-CAT-04 (P-21).
- **Es prerrequisito de:** [US-002](US-002-declarar-requerimientos-de-proyecto.md), [US-005](US-005-ver-mi-brecha-frente-a-un-rol.md) y [US-006](US-006-buscar-candidatos-para-un-requerimiento.md). Sin catálogo no hay requerimientos, brechas ni búsqueda (VIS-001:L136).
- **Impacto:** todo cambio posterior del catálogo afecta a requerimientos y certificaciones vigentes; cómo se trata ese impacto está abierto (P-02).
- **Riesgo:** catálogo sin consenso entre productos (VIS-001:L142).

## Vacíos y preguntas abiertas

| Pregunta | Responsable | Prioridad | Estado |
|---|---|---|---|
| P-02 — ¿Cómo se versiona el catálogo y qué pasa con requerimientos y certificaciones vigentes al cambiarlo? | Jefe de Ingeniería | Media | Abierta (BRC-001) |
| P-06 — ¿El Responsable de producto puede proponer o editar roles de su producto? | Jefe de Ingeniería | Media | Abierta (BRC-001) |
| US1-Q1 — ¿Se permite un rol sin competencias, o una competencia repetida en un rol? | Jefe de Ingeniería | Baja | Nueva |
| P-26 — ¿Cuántos niveles de rol hay y cómo se relacionan con L1–L4? | Jefe de Ingeniería | Alta | Parcialmente respondida: Rol-Nivel 1 a 4 (BR-CAT-14); resto en P-36 |
| P-27 — ¿Una competencia transversal aplica automáticamente o se asigna? | Jefe de Ingeniería | Media | Respondida: se asigna a los roles (BR-CAT-11) |
| P-36 — ¿Cómo se combinan Junior/Senior con la numeración 1 a 4 del Rol-Nivel (por ejemplo, ¿Junior 1-2 y Senior 3-4, o Junior 1-4 y Senior 1-4?)? ¿Todos los roles tienen los mismos niveles? | Jefe de Ingeniería | Alta | Nueva |
| P-37 — ¿La rúbrica de una competencia contiene los requisitos de evidencia de cada nivel, o son cosas distintas? ¿Quién define y aprueba las rúbricas? | Jefe de Ingeniería | Alta | Nueva |
| P-21 — ¿Quién define el tipo de evidencia de cada competencia y nivel? ¿Forma parte del catálogo que gobierna el Jefe de Ingeniería? | Jefe de Ingeniería | Media | Nueva |
| P-22 — ¿"Tipo de evidencia" se refiere a las tres categorías de BR-ACR-01 (formación, práctica evaluada, desempeño en proyecto) o a una evidencia concreta (por ejemplo, un curso o una práctica determinada)? | Jefe de Ingeniería | Alta | Nueva |
| P-24 — ¿Hay que definir el tipo de evidencia para los cuatro niveles de cada competencia, o solo para los niveles que exige algún rol? | Jefe de Ingeniería | Baja | Nueva |

## Preparación y entrega

- **Estado:** CONDITIONAL
- **Motivo:** el alta del catálogo, incluido el tipo de evidencia por competencia y nivel, está sostenida (AC-1 a AC-4). La edición depende de P-02, el papel del Responsable de producto de P-06, y el detalle del tipo de evidencia de P-22.
- **Recomendación (no es decisión):** separar "alta del catálogo" (lista para UXR) de "edición y versionado" (espera P-02).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y responde P-02.

## Lista de calidad

- [x] Fuentes y procedencia registradas
- [x] Hechos separados de supuestos e hipótesis
- [x] Contradicciones visibles (ninguna propia)
- [x] Casos negativos y límite considerados
- [ ] Validación humana registrada
