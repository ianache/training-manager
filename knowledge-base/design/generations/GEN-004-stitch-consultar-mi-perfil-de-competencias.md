---
id: GEN-004
type: Stitch Generation
title: "GEN-004 — Diseño Stitch: Consultar mi perfil de competencias"
description: "Prompts, pantallas generadas en el proyecto Stitch gobernado y revisión crítica de SCR-004-01 y SCR-004-02. Exploración, no diseño gobernado."
tags: [ux-ui, stitch, generation, perfil, certificacion]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-04T15:00:00-05:00"
sources:
  - id: scr-004
    resource: /knowledge-base/design/screens/SCR-004-consultar-mi-perfil-de-competencias.md
  - id: flw-004
    resource: /knowledge-base/design/user-flows/FLW-004-consultar-mi-perfil-de-competencias.md
  - id: dtm
    resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
  - id: stp
    resource: /knowledge-base/design/projects/STP-PPM-001-plataforma-ppm.md
  - id: tkn-set-002
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
---

# GEN-004 — Diseño Stitch de consultar mi perfil de competencias

**Estado:** exploración (`exploration_design`), `draft`. No está aprobado ni es diseño gobernado.

## Ejecución

- **Fecha:** 2026-10-04. Se reutiliza `STP-PPM-001`; preflight `READY`. `deviceType = DESKTOP`; sistema «Comsatel Styled» nombrado en el prompt, sin `designSystem`. Las llamadas dieron timeout; ambas pantallas aparecieron en unos 10 a 15 minutos.

## Pantallas registradas en el DTM

`version: v1-comsatel-styled`, `project_ref: STP-PPM-001`, con `--evidence` (el id se extrajo con un script del archivo guardado de `list_screens`).

| SCR | `artifact_ref` | Estados incluidos |
|---|---|---|
| SCR-004-01 | `projects/13050549605434273903/screens/5be3770a5a7142f78d6163158191afbb` | A a D |
| SCR-004-02 | `…/screens/a93c89a1a90743a2b82f8cb23bf21ce4` | A a G |

La evidencia guardada es el nombre del archivo de salida de Stitch, fuera del repositorio: no es reproducible por otra persona.

## Revisión crítica

Verificación automática del HTML:

| SCR | Textos exigidos | Contenido prohibido (vencimiento, equivalencias) | `role="alert"` | `aria-` |
|---|---|---|---|---|
| SCR-004-01 | Todos | Ninguno | 1 | 15 |
| SCR-004-02 | Todos | Ninguno | 2 | 10 |

**Hallazgos:**
1. SCR-004-02 tiene pocos atributos `aria-` (10) para una pantalla con historial, tabla, enlaces y varios estados: revisar.
2. La presentación de la evaluación no aprobada al colaborador (UXR-004-Q3) la decidió Stitch; no es una decisión aprobada.
3. Los textos «propuesto» (SCR-004-Q2) aparecen sin fuente humana.
4. Los componentes sin CMP (lista de competencias, insignias de estado, tabla, enlace con advertencia) los resolvió Stitch con su propio marcado.
5. Solo se revisó el texto del HTML: no las capturas, el contraste ni los tokens valor por valor. Accesibilidad no demostrada; `accessibility-reviewer` pendiente.

## Preguntas abiertas

SCR-004-Q1 y Q2, UXR-004-Q2 a Q4. Revisión humana pendiente.
