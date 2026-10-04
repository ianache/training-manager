---
id: GEN-003
type: Stitch Generation
title: "GEN-003 — Diseño Stitch: Certificar un nivel de competencia"
description: "Prompts, pantallas generadas en el proyecto Stitch gobernado y revisión crítica de SCR-003-01 a SCR-003-05. Exploración, no diseño gobernado. SCR-003-02 pendiente."
tags: [ux-ui, stitch, generation, certificacion, evaluacion]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-04T15:00:00-05:00"
sources:
  - id: scr-003
    resource: /knowledge-base/design/screens/SCR-003-certificar-un-nivel-de-competencia.md
  - id: flw-003
    resource: /knowledge-base/design/user-flows/FLW-003-certificar-un-nivel-de-competencia.md
  - id: dtm
    resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
  - id: stp
    resource: /knowledge-base/design/projects/STP-PPM-001-plataforma-ppm.md
  - id: tkn-set-002
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
---

# GEN-003 — Diseño Stitch de certificar un nivel de competencia

**Estado:** exploración (`exploration_design`), `draft`. No está aprobado ni es diseño gobernado.

## Ejecución

- **Fecha:** 2026-10-04. Se reutiliza `STP-PPM-001` (proyecto verificado en vivo antes, `get_project`); no se creó ninguno. Preflight `READY`.
- **Parámetros:** `deviceType = DESKTOP`; `modelId` no indicado; sistema «Comsatel Styled» nombrado en el prompt, sin `designSystem`.
- **Incidencia:** las siete llamadas dieron timeout; seis pantallas aparecieron en unos 10 a 15 minutos. **SCR-003-02 no apareció tras unos 25 minutos** (su prompt era el más largo) y se relanzó una vez con un prompt más corto; al escribir esto sigue pendiente.

## Pantallas registradas en el DTM

`version: v1-comsatel-styled`, `project_ref: STP-PPM-001`. Cada `artifact_ref` se extrajo con un script del archivo guardado de `list_screens` y se registró con `--evidence` (regla del 2026-10-04), no se tecleó.

| SCR | `artifact_ref` |
|---|---|
| SCR-003-01 | `projects/13050549605434273903/screens/1aa05267f8b04d6f89059407a94d755b` |
| SCR-003-03 | `…/screens/49aa04e599824d4286355d5ad80bd0d1` |
| SCR-003-04 | `…/screens/23160bb7dd334090adb09891936eb54d` |
| SCR-003-05 | `…/screens/57ae3002f15547aeb9125d1f745a69e2` |
| SCR-003-02 | **sin generar** (la pantalla central de la evaluación) |

**La evidencia no vive en el repositorio:** `exploration_design.evidence` guarda solo el nombre del archivo de salida de Stitch, que está fuera del repositorio. La comprobación se hizo, pero otra persona no puede reproducirla.

## Prompts (reproducibles)

Mismo prefijo que GEN-001-G y GEN-019 (sistema «Comsatel Styled», escritorio, español) y cierre «STRICT CONTENT RULES». Cada prompt enumera los estados y los textos de la especificación (SCR-003 §SCR-003-01 a 05); el de SCR-003-02 pedía además que no hubiera acción «aceptar como equivalente» y que CUMPLE y NO CUMPLE usaran texto e icono. Stitch reescribe el prompt; la reproducción exacta no está garantizada.

## Revisión crítica

Verificación automática del HTML devuelto:

| SCR | Textos exigidos | Contenido prohibido | `role="alert"` | `aria-` | Rótulos «Estado A…» |
|---|---|---|---|---|---|
| SCR-003-01 | Todos | Ninguno | 1 | **1** | No aparecen |
| SCR-003-03 | Todos | Ninguno | 3 | 35 | No aparecen |
| SCR-003-04 | Todos | Ninguno | 1 | 22 | 4 |
| SCR-003-05 | Todos | Ninguno | 5 | 22 | No aparecen |

**Hallazgos (no aceptados como resueltos):**
1. **SCR-003-01 casi no tiene atributos `aria-` (solo 1)** pese a tener una búsqueda y varios estados: hay que revisar su accesibilidad.
2. En tres pantallas no aparecen los rótulos «Estado A…» que pedí, aunque sí los textos; no se verificó si los estados están presentes de otra forma.
3. Los textos «propuesto» de la especificación (SCR-003-Q2) aparecen sin fuente humana.
4. Los componentes sin CMP (lista de requisitos con estado, tabla de evidencias, textarea con contador, estado vacío) los resolvió Stitch con su propio marcado.
5. Solo se revisó el texto del HTML: no las capturas, el contraste ni la correspondencia valor por valor con `TKN-SET-002`. La accesibilidad no está demostrada; `accessibility-reviewer` pendiente.

## Preguntas abiertas

SCR-003-Q1 y Q2, UXR-003-Q2 a Q4 y FLW-003-Q1. Revisión humana pendiente.
