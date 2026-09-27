---
type: ASR Candidate
title: "ASR candidato — Versionado del catálogo de competencias (BR-CAT-06)"
description: "El catálogo cambiará con el tiempo; cómo se versiona y qué pasa con requerimientos, certificaciones y mediciones vigentes está abierto."
tags: [asr, modificabilidad, integridad-de-datos, catalogo]
status: draft
generated:
  by: "asr-discovery/1.0"
  at: "2026-09-27T17:00:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: us-001
    resource: /knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md
---

# ASR candidato — Versionado del catálogo de competencias

- **Requisito de origen:** BR-CAT-06, que es un vacío ([BRC-001](../../business/rules/BRC-001-reglas-plataforma-gestion-formacion.md)); US-001.
- **Atributo de calidad:** modificabilidad / integridad de datos históricos.
- **Tipo:** vacío con posible impacto estructural.

## Enunciado

El catálogo de roles, competencias y niveles cambiará. Hay que decidir si esos cambios se versionan y cómo afectan a los requerimientos, certificaciones y brechas que se calcularon contra una versión anterior.

## Escenario de atributo de calidad

| Elemento | Valor |
|---|---|
| Fuente del estímulo | Jefe de Ingeniería |
| Estímulo | Cambia el nivel requerido de una competencia, o retira una competencia de un rol |
| Entorno | Hay requerimientos y certificaciones vigentes contra la versión anterior |
| Artefacto | Catálogo, requerimientos, certificaciones, brechas, KPI |
| Respuesta | **UNKNOWN**: depende de P-50 (antes P-02). P-02 quedó respondida el 2026-09-27 solo para los **cursos** (BR-FOR-06 a BR-FOR-10); el versionado del catálogo sigue abierto como **P-50**. *Nota (2026-09-27):* P-50 respondida en parte: se versionan las **competencias**, no los roles (BRC-001 BR-CAT-22). Los dos estímulos de esta fila (cambiar el nivel requerido en un Rol-Nivel, retirar una competencia de un rol) son cambios del rol, que no se versiona; cómo se trata su efecto, y el de una versión nueva de competencia, sigue en P-50.1 |
| Medida de respuesta | **UNKNOWN** |

## Por qué puede ser significativo

- Si se exige versionado, cada requerimiento, certificación y brecha debe referirse a una versión del catálogo. Eso condiciona el modelo de datos desde H1 y es costoso de agregar después (INFERENCE a partir de EVD-2026-0024).
- El KPI de cierre de brechas compara brechas en el tiempo (VIS-001:L121). Un catálogo cambiante sin versiones distorsiona esa comparación (INFERENCE).

## Perspectivas afectadas

Datos · Desarrollo (modificabilidad)

## Evidencia

| ID | Afirmación | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0024 | Cómo se versiona el catálogo está abierto | VIS-001:L142, L151 | UNKNOWN | Alta |
| EVD-2026-0041 | Definiciones de los 6 KPI, incluido el cierre de brechas en el tiempo | VIS-001:L117-L124 | FACT | Alta |

Evidencia compartida: `source_type: document`, `freshness: current`, `status: sin verificar`.

## Evidencia faltante

- La respuesta a P-50 (resto de P-02): versionado del catálogo y efecto sobre los datos vigentes. Los cursos ya se versionan (BR-FOR-06 a BR-FOR-10), lo que muestra el patrón DRAFT → APPROVED → DEPRECATED que el decisor usa. *2026-09-27:* respondida en parte (competencias sí, roles no; BR-CAT-22). Faltan P-50.1 (efecto sobre Rol-Nivel, requerimientos y certificaciones) y P-50.2 (quién aprueba; si la versión incluye rúbrica y requisitos de evidencia). La disposición no cambia.
- La frecuencia esperada de cambios del catálogo.

## Preguntas para el arquitecto

1. Si P-02 sigue abierta al empezar H1, ¿se diseña para versionado por precaución?

## Disposición humana

- **Recomendación del agente (no es decisión):** INVESTIGATE. Resolver P-02 antes del diseño de datos de H1.
- **Disposición:** Pendiente (`CANDIDATE` / `REJECT` / `INVESTIGATE`)
- **Arquitecto:** Por asignar · **Fecha:** —
