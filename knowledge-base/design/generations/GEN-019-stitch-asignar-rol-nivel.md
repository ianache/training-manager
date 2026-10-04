---
id: GEN-019
type: Stitch Generation
title: "GEN-019 — Diseño Stitch: Asignar un Rol-Nivel a una persona"
description: "Prompts, pantallas generadas en el proyecto Stitch gobernado y revisión crítica de SCR-019-01 a SCR-019-03. Exploración, no diseño gobernado."
tags: [ux-ui, stitch, generation, party, rol-nivel]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-04T01:00:00-05:00"
sources:
  - id: scr-019
    resource: /knowledge-base/design/screens/SCR-019-asignar-rol-nivel.md
  - id: flw-019
    resource: /knowledge-base/design/user-flows/FLW-019-asignar-rol-nivel.md
  - id: dtm
    resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
  - id: stp
    resource: /knowledge-base/design/projects/STP-PPM-001-plataforma-ppm.md
  - id: tkn-set-002
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
---

# GEN-019 — Diseño Stitch de asignar un Rol-Nivel

**Estado:** exploración (`exploration_design`), `draft`. No está aprobado ni es diseño gobernado.

## Ejecución

- **Fecha:** 2026-10-03/04. Proyecto verificado en vivo con `get_project`; se reutiliza `STP-PPM-001`, sin crear ninguno. Preflight `READY`.
- **Parámetros:** `deviceType = DESKTOP`; `modelId` no indicado; sistema «Comsatel Styled» nombrado en el prompt (no se pasó `designSystem`).
- **Incidencia:** las llamadas agotaron el tiempo de espera, pero Stitch las completó; se verificaron con `list_screens`.

## Pantallas registradas en el DTM

`version: v1-comsatel-styled`, `project_ref: STP-PPM-001`.

| SCR | `artifact_ref` | Estados incluidos |
|---|---|---|
| SCR-019-01 | `projects/13050549605434273903/screens/5223996189a446b0b140af99d1a16e10` | A a E |
| SCR-019-02 (v2, vigente en el DTM) | `…/screens/d5465d68fc1546fbb011c7841a9c7a9b` | A a E, con el bloqueo del nivel destino |
| SCR-019-02 (v1, historial) | `…/screens/7c90ec1d19894fd78a455aa39d76d05a` | A a E, bloqueo solo de niveles inferiores |
| SCR-019-03 | `…/screens/d81b2e4fe6a94d6fae3d86c8003c987e` | A a D |

## Prompts (reproducibles)

Mismo prefijo y cierre que GEN-001-G. SCR-019-01: vigentes, historial, sin asignaciones, carga, error y solo lectura. SCR-019-02: formulario Rol, Nivel y «Vigente desde», aviso de cierre, errores, bloqueo AC-5 con las competencias pendientes, guardado y variante «Asignar rol»; el prompt indica expresamente que **no hay opción de bajar de nivel** (EVD-2026-0166). SCR-019-03: éxito, persona no vigente, nivel no disponible y sin permiso. Stitch reescribe el prompt; la reproducción exacta no está garantizada.

## Revisión crítica

Verificación automática del HTML devuelto:

| SCR | Textos y estados exigidos | Contenido prohibido | `role="alert"` | `aria-` |
|---|---|---|---|---|
| SCR-019-01 | Todos presentes | Ninguno | 0 | 8 |
| SCR-019-02 | Todos presentes | Ninguno | 6 | 26 |
| SCR-019-03 | Todos presentes | Ninguno | 0 | 13 |

**Hallazgos (no aceptados como resueltos):**

1. **SCR-019-01 y SCR-019-03 no usan `role="alert"`** en los estados de error y de bloqueo: el error de carga y los bloqueos deberían anunciarse a lectores de pantalla (UXR-000). Pendiente de corregir.
2. Los textos marcados «propuesto» (SCR-019-Q2) aparecen sin fuente humana; no son aprobados.
3. La lista de asignaciones con historial es una brecha de componentes: Stitch la resolvió con su propio marcado, no con `@gf/ui`.
4. Solo se verificó el texto del HTML: no se revisaron las capturas, el contraste ni la correspondencia valor por valor con `TKN-SET-002`. Accesibilidad no demostrada; `accessibility-reviewer` pendiente.

**Desajuste resuelto (2026-10-04):** la v1 de SCR-019-02 solo bloqueaba por niveles inferiores; la v2 incluye también el nivel destino (EVD-2026-0172).

**Regeneración v2 (2026-10-04):** los intentos con `edit_screens` (dos) no se aplicaron. Una regeneración completa con `generate_screen_from_text` tardó unos 15 minutos y devolvió siempre `timeout` en la llamada, pero la pantalla apareció después: `d5465d68fc1546fbb011c7841a9c7a9b` (v2, la registrada). Apareció además `c3342d35c640412aa9020d5c763df16e`, otra pantalla v2 (probablemente de un intento anterior que llegó tarde): **duplicado huérfano**, no registrado, a borrar en Stitch. Revisión del HTML de la v2: los cinco estados A a E, el bloqueo con «Niveles inferiores» y «Nivel destino: Junior (Nivel 3)», «Sin certificar» y las cuatro competencias de ejemplo, sin opción de bajar de nivel; 35 atributos `aria-` y 4 `role="alert"`. No muestra niveles inactivos (SCR-019 solo los excluye de la lista) y no se revisaron las capturas ni el contraste.

## Preguntas abiertas

SCR-019-Q1 a Q3, FLW-019-Q3 y Q4 (si bastan los niveles inferiores o también el destino, y si ADMIN puede saltarse el bloqueo AC-5). Revisión humana pendiente.
