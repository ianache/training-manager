---
type: Knowledge Base Change Log
title: "UX/UI Knowledge Base Change Log"
description: "Registro cronológico de cambios en la base de conocimiento UX/UI."
tags: [ux-ui, knowledge-base, changelog]
status: draft
generated:
  by: "manual/1.0"
  at: "2026-09-26T22:05:37-05:00"
sources:
  - id: repository-guidelines
    resource: /AGENTS.md
---

# Registro de cambios

## 2026-09-26

- Se inicializó el índice y el registro de cambios de `knowledge-base/` con frontmatter Google OKF v0.2.
- Artefactos afectados: `knowledge-base/index.md`, `knowledge-base/changelog.md`.
- Se agregó la visión de producto VIS-001 (Plataforma de Gestión de Formación del Recurso Humano) en estado `draft`, pendiente de verificación humana.
- Artefactos afectados: `knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md`, `knowledge-base/index.md`, `knowledge-base/changelog.md`.
- Se actualizó VIS-001 con las respuestas del responsable a cuatro preguntas abiertas: dueño del catálogo, integración con Classroom, criterio de certificación y uso de la evidencia de GitLab. Se agregaron el actor Jefe de Ingeniería, la contingencia para Classroom y dos preguntas abiertas nuevas. Sigue en `draft`.
- Artefactos afectados: `knowledge-base/vision/VIS-001-plataforma-gestion-formacion.md`, `knowledge-base/changelog.md`.
- Se agregó el catálogo de reglas de negocio BRC-001, extraído de VIS-001 con `af-business-rule-extractor`, en estado `draft` y con preparación CONDITIONAL. Incluye 26 reglas, 6 vacíos, 3 ambigüedades y 7 preguntas abiertas nuevas (P-08 a P-14). Queda pendiente la validación del Jefe de Ingeniería y del responsable del producto.
- Artefactos afectados: `knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md`, `knowledge-base/index.md`, `knowledge-base/changelog.md`.
- Se agregó el glosario de negocio GLS-001, extraído de VIS-001 y BRC-001 con `af-business-glossary-curator`, en estado `draft` y con preparación CONDITIONAL. Tiene 65 términos; 2 quedan como `gap` (Proyecto activo, Riesgo de cobertura) y hay 17 preguntas abiertas (GQ-01 a GQ-17). Las siglas y los productos de terceros se respaldan con fuentes externas N1 consultadas el 2026-09-26. Queda pendiente la validación del Jefe de Ingeniería y del Responsable de producto.
- Artefactos afectados: `knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md`, `knowledge-base/index.md`, `knowledge-base/changelog.md`.
- Se reestructuró GLS-001 al formato de `af-business-glossary-curator/1.1`. Cada uno de los 65 términos pasa a ser un artefacto OKF v0.2 propio en `knowledge-base/business/glossary/terms/TRM-NNNN-<slug>.md`, con los mismos IDs, definiciones y fuentes. El catálogo queda como índice alfabético generado, con las preguntas abiertas y el estado de preparación. Todos los términos siguen en `draft`.
- Artefactos afectados: `knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md`, `knowledge-base/business/glossary/terms/` (65 archivos nuevos), `knowledge-base/changelog.md`.
- Se aprobaron 59 de los 65 términos de GLS-001 (`status: approved`, `verified.by: ianache (Jefe de Ingeniería)`, `verified.at: 2026-09-26T20:02:28-05:00`), por decisión explícita del aprobador. Siguen en `draft` IA y SIGO (forma completa desconocida), Proyecto activo y Riesgo de cobertura (`gap`), Responsable de producto (`assumption`) y Sistema de RR. HH. (`inference`). Se agregó el estado `approved` al skill `af-business-glossary-curator`.
- Artefactos afectados: 59 archivos en `knowledge-base/business/glossary/terms/`, `knowledge-base/business/glossary/GLS-001-glosario-de-negocio.md`, `knowledge-base/changelog.md`.
