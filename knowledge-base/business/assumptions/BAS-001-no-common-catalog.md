---
type: Business Assumption
title: "BAS-001 — Hoy No Existe Catálogo Común"
description: "Se asume que actualmente no existe un catálogo común y compartido de roles y competencias entre los 4 productos."
status: draft
generated:
  by: "business-context-builder/1.0"
  at: "2026-09-29T10:35:00-05:00"
sources:
  - id: vis-001
    resource: /knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md
    lines: [35]
  - id: rcp-001
    resource: /knowledge-base/requirement/context-packs/RCP-001-h1-idioma-comun.md
    lines: [71]
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
    lines: [EVD-2026-0014]
---

# BAS-001 — Hoy No Existe Catálogo Común

## Supuesto

Hoy no existe un catálogo común de roles y competencias compartido por los 4 productos.

## Justificación

- VIS-001:L35: "existe la plataforma... **no existe un catálogo común de roles y competencias por producto**. Por eso, asignar personal depende del conocimiento informal de los líderes y no de brechas medibles."
- Esta observación fue validada en sesión con el Jefe de Ingeniería (2026-09-26), pero falta evidencia documental.

## Por Qué Importa

Si esta suposición es **falsa** (es decir, si SÍ existe catálogo común), entonces:
- El alcance de H1 sería menor: solo enriquecer/formalizar lo existente.
- Los productos ya operan con cierto lenguaje común; no hay que empezar de cero.
- El riesgo de resistencia a "un nuevo catálogo" sería mayor.

## Cómo Validar

- Entrevista a responsables de producto: ¿Tienen catálogos propios? ¿Comparten roles?
- Revisión de AGENTS.md o documentación interna de cada producto.
- Análisis de asignaciones históricas: ¿Se usan términos comunes?

## Confianza

**Media** — Validada en sesión, no en documentación.

## Horizonte

**Crítico en H1** — Aclarar antes de Q4 2026.

---

**Validación Humana Pendiente:** Confirmación de Jefe de Ingeniería y responsables de producto
