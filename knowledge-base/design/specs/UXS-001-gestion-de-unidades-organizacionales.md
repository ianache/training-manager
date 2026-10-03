---
type: UX Design Specification
title: "UXS-001 — Gestión de la estructura organizacional: especificación de diseño UX/UI"
description: "Indexa y evalúa los flujos FLW-017/028/029/030 y las 12 pantallas SCR-017/028/029/030 de la gestión de la organización interna y sus unidades; especificadas y con preflight READY, aún sin exploración, accesibilidad ni diseño gobernado."
tags: [ux-design-specification, party, estructura-organizacional, unidades]
status: draft
generated:
  by: "ux-ui-orchestrator/1.0"
  at: "2026-10-03T16:00:00-05:00"
sources:
  - id: uxr-017
    resource: /knowledge-base/design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md
  - id: uxr-028
    resource: /knowledge-base/design/ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md
  - id: uxr-029
    resource: /knowledge-base/design/ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md
  - id: uxr-030
    resource: /knowledge-base/design/ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md
---

# UXS-001 — Gestión de la estructura organizacional

> Esta especificación indexa y evalúa los artefactos de diseño; no los duplica. El contenido vive en cada artefacto enlazado.

## 1. Alcance y escenario

- **Producto / iniciativa:** plataforma-gestion-formacion (Plataforma PPM), gestión de la estructura organizacional.
- **Escenario orquestado:** A/C — flujos y especificación de pantallas, hasta preflight. Prueba real de `ux-ui-orchestrator`.
- **RQS de origen:** no existe una RQS para este alcance; las historias US-017, US-028, US-029 y US-030 están READY y en `draft` (changelog 2026-10-03). Es una brecha de trazabilidad, no un bloqueo.
- **Historias en alcance:** US-017, US-028, US-029, US-030.
- **Design System / TKN-SET:** TKN-SET-002 (vigente; sustituye a TKN-SET-001 según `index.md`). Los SCR registran la colisión de IDs entre ambos como pregunta (ver sección 5).
- **Corte de la entrega:** 4 flujos y 12 pantallas. Quedan fuera Stitch, Figma, accesibilidad y handoff.

## 2. Artefactos del conjunto

| Tipo | ID | Archivo | Estado |
|---|---|---|---|
| UX Requirement | UXR-017 | [UXR-017](../ux-requirements/UXR-017-registrar-la-organizacion-interna.md) | draft |
| UX Requirement | UXR-028 | [UXR-028](../ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md) | draft |
| UX Requirement | UXR-029 | [UXR-029](../ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md) | draft |
| UX Requirement | UXR-030 | [UXR-030](../ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md) | draft |
| User Flow | FLW-017 | [FLW-017](../user-flows/FLW-017-registrar-la-organizacion-interna.md) | draft |
| User Flow | FLW-028 | [FLW-028](../user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md) | draft |
| User Flow | FLW-029 | [FLW-029](../user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md) | draft |
| User Flow | FLW-030 | [FLW-030](../user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md) | draft |
| Screen | SCR-017-01..03 | [SCR-017](../screens/SCR-017-registrar-la-organizacion-interna.md) | draft |
| Screen | SCR-028-01 | [SCR-028](../screens/SCR-028-listar-y-buscar-unidades-organizacionales.md) | draft |
| Screen | SCR-029-01..04 | [SCR-029](../screens/SCR-029-registrar-y-editar-unidades-organizacionales.md) | draft |
| Screen | SCR-030-01..04 | [SCR-030](../screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md) | draft |
| Exploración | GEN-017, GEN-028, GEN-029, GEN-030 | [GEN-017](../generations/GEN-017-stitch-registrar-la-organizacion-interna.md), [GEN-028](../generations/GEN-028-stitch-listar-y-buscar-unidades-organizacionales.md), [GEN-029](../generations/GEN-029-stitch-registrar-y-editar-unidades-organizacionales.md), [GEN-030](../generations/GEN-030-stitch-desactivar-y-reactivar-unidades-organizacionales.md) | draft; 9 de 12 pantallas registradas en DTM-PPM-001 |
| Accessibility Report | ARP-SCR-017-01..03, ARP-SCR-028-01, ARP-SCR-029-01..02, ARP-SCR-030 | [handoff/](../handoff/) (7 archivos) | draft; 9 pantallas, todas `fail` |
| Anexo de preguntas | — | [UXS-001 anexo](UXS-001-anexo-preguntas-por-responsable.md) | draft; 77 preguntas en 44 |
| DD, HOF | — | no existen aún para este alcance | — |

## 3. Resultado de la auditoría

- **`audit_ux.py`:** 0 errores. Avisos del alcance: las 12 pantallas sin entrada en el DTM (esperado: aún no hay exploración).
- **Preflight** (`--profile production`, 12 pantallas): `READY`, `action: REUSE`, proyecto `STP-PPM-001`, sin hallazgos. Lo ejecuté yo; no me basé solo en los informes de los subagentes.
- **Gate:** no aplica; no hay HOF para este alcance.
- **Hallazgos de juicio:**

| ID | Hallazgo | Severidad | Artefacto | Skill dueño | Estado |
|---|---|---|---|---|---|
| Q-UXS-1 | Faltan componentes que los SCR proponen y no existen como CMP: estado vacío, tabla ordenable, árbol, selector de unidad, filtros activos, diálogo informativo, aviso de dependencias, aviso de cambios sin guardar | Mayor | SCR-017/028/029/030, sección de componentes | `ui-spec-writer` / `web-atomic-component-designer` | Abierto |
| Q-UXS-2 | Los 4 SCR heredan `responsive: [desktop]` de SCR-015/016 como supuesto sin confirmar | Mayor | SCR-017-Q6, 028-Q1, 029-Q9, 030-Q5 | Responsable de producto | Abierto |
| Q-UXS-3 | La pantalla de entrada de la gestión tiene dos candidatos (SCR-017-01 o el listado FLW-028); cada flujo asume el otro como dueño | Mayor | FLW-017-Q4, SCR-017-Q1 | Jefe de Ingeniería / UX | Abierto |
| Q-UXS-4 | Textos de error, vacío, consecuencia y éxito "sin fuente" en las 12 pantallas | Mayor | SCR-017-Q4, 028-Q5, 029-Q8, 030-Q4 | Responsable de producto / UX writing | Abierto |
| Q-UXS-5 | SCR-030 especifica 4 pantallas pero el flujo duda si son variantes de un diálogo; SCR-028 decide una sola pantalla con alternador de forma propuesta | Menor | FLW-030-Q1, SCR-028-Q3 | Jefe de Ingeniería / UX | Abierto |
| Q-UXS-6 | No existe AC-017 como artefacto de diseño | Menor | SCR-017-Q8 | `ui-spec-writer` | Abierto |
| Q-UXS-7 | Las 9 pantallas exploradas dan `fail` de accesibilidad (revisión estática del HTML de Stitch): iconos sin `aria-hidden`, estados sin `role=status/alert`, errores sin `aria-describedby`, nombres sin la unidad, foco de bajo contraste, reflow a 320 px; SCR-028-01 sin `aria-sort` ni roles de árbol; SCR-030-03 con diálogo sin `role=dialog`. Foco, teclado y zoom `inconclusive` (requieren navegador) | Bloqueante para el gate | ARP-SCR-017-01..03, 028-01, 029-01..02, 030 | `figma-design-validator` (el diseño gobernado debe corregirlos) y `accessibility-reviewer` (revisar el Figma) | Abierto |

## 4. Matriz de trazabilidad por pantalla

| SCR | US | UXR | FLW | Exploración | Diseño gobernado | ARP |
|---|---|---|---|---|---|---|
| SCR-017-01, -02, -03 | US-017 | UXR-017 | FLW-017 | STP-PPM-001 (3 de 3) | — | fail ×3 |
| SCR-028-01 | US-028 | UXR-028 | FLW-028 | STP-PPM-001 (1 de 1) | — | fail |
| SCR-029-01, -02 | US-029 | UXR-029 | FLW-029 | STP-PPM-001 | — | fail ×2 |
| SCR-029-03, -04 | US-029 | UXR-029 | FLW-029 | **sin localizar** | — | — |
| SCR-030-01, -02, -03 | US-030 | UXR-030 | FLW-030 | STP-PPM-001 | — | fail ×3 |
| SCR-030-04 | US-030 | UXR-030 | FLW-030 | **sin localizar** | — | — |

Huérfanos detectados: ninguno entre US→UXR→FLW→SCR. Tres pantallas (SCR-029-03, SCR-029-04, SCR-030-04) sin exploración ni ARP. Ninguna pantalla tiene diseño gobernado (pendiente de las fases 6 y 7).

## 5. Preguntas abiertas y decisiones humanas pendientes

Ninguna bloquea el preflight. Abiertas en total: 17 de UXR, 24 de FLW (Q1..Q5 + Q1..Q6 + Q1..Q7 + Q1..Q6) y 36 de SCR (8 + 5 + 15 + 8). Las que más desbloquean:

| ID | Pregunta o decisión | Responsable | Prioridad | Desbloquea |
|---|---|---|---|---|
| FLW-017-Q4 / SCR-017-Q1 | ¿Quién es dueño de la pantalla de entrada: SCR-017-01 o el listado? | Jefe de Ingeniería / UX | Media | Fusionar o separar pantallas; Stitch |
| SCR-017-Q7, 029-Q10, 030-Q6 | TKN-SET-001 y TKN-SET-002 definen los mismos IDs con valores distintos; falta token semántico de éxito (marcada Gate) | UX / Design System | Alta | El gate de desarrollo; consistencia en Figma |
| SCR-028-Q2, 030-Q7, 017-Q5 | Crear como CMP nuevos los componentes faltantes | UX / Arquitecto frontend | Media | Spec de componentes; Stitch sin inventar |
| SCR-017-Q6, 028-Q1, 029-Q9, 030-Q5 | ¿Solo desktop? | Responsable de producto | Media | `responsive` de las 12 pantallas |
| SCR-029-Q12, 030 (FLW-030-Q2) | Concurrencia al confirmar y momento del cálculo de dependencias | Jefe de Ingeniería / Arquitecto | Media | Estados de conflicto |
| SCR-029-Q11, Q15 | Nombre repetido bajo el nuevo padre y efecto sobre las descendientes al mover | Jefe de Ingeniería | Media | Reglas BR-PTY-26/22 aplicadas en UI |

## 6. Preparación por consumidor

| Consumidor | Veredicto | Razón y bloqueos | Skill siguiente |
|---|---|---|---|
| Stitch | CONDITIONAL | Ejecutado: 9 de 12 pantallas exploradas y registradas. Faltan SCR-029-03, SCR-029-04 y SCR-030-04 (timeout, sin localizar; regenerar solo tras buscarlas por título en Stitch para no duplicar). Stitch inventó contenido que prejuzga preguntas abiertas (ver GEN-017/028/029/030). | `stitch-ui-generator` (completar las 3) |
| Figma | NOT READY | Falta acceso a Figma verificado. La exploración existe para 9 de 12 pantallas y su ARP da `fail`: el diseño en Figma debe nacer corrigiendo esos fallos, no copiando Stitch | `figma-design-validator` (con acceso autorizado a Figma) |
| Desarrollo | NOT READY | Sin `governed_design`, sin HOF, sin accesibilidad; colisión de tokens marcada Gate | `ux-development-handoff` |
| QA | CONDITIONAL | Hay estados, permisos y criterios con resultado visible; pospone las aserciones de textos sin fuente (Q-UXS-4) | `test-case-generator` |

## 7. Registro de orquestación

| Pasada | Skill | Artefactos creados | Verificación |
|---|---|---|---|
| 1 | `user-flow-designer` (4 subagentes en paralelo) | FLW-017, FLW-028, FLW-029, FLW-030 | `audit_ux.py`: los SCR reservados aún no existían (12 errores esperados) |
| 2 | `ui-spec-writer` (4 subagentes en paralelo) | SCR-017, SCR-028, SCR-029, SCR-030 (12 pantallas) | `audit_ux.py`: 0 errores; preflight production: READY |
| 3 | `stitch-ui-generator` (4 subagentes en paralelo; REUSE de `STP-PPM-001`) | GEN-017, GEN-028, GEN-029, GEN-030; 9 entradas en DTM-PPM-001 | `get_screen` confirmó los 9 IDs; `register-exploration`: READY ×9; 3 pantallas sin localizar |
| 4 | `accessibility-reviewer` (3 subagentes) y digest de preguntas (1 subagente) | 7 ARP; anexo de preguntas | Archivos verificados en disco (`draft`, sin `verified`); `audit_ux.py`: 0 errores; conteo de preguntas 77 = 17 + 24 + 36 |

**Aislamiento:** sin worktree, por decisión del usuario: el orquestador y otros cambios estaban sin commitear en el checkout principal. **Efectos externos:** 9 pantallas exploratorias creadas en el proyecto Stitch `STP-PPM-001` (visibilidad PUBLIC, aceptada por ianache el 2026-10-01) y hasta 3 generaciones con timeout cuyo resultado se desconoce (pueden existir sin estar listadas). Figma: ninguno.

**Observación del proceso:** el informe del subagente de FLW-029 llegó vacío (solo "placeholder"); el archivo sí existía y se verificó por separado. Ante un informe vacío, comprobar siempre el disco.

## 8. Validación humana

- **Estado:** Pendiente
- **Responsable:** Jefe de Ingeniería (flujos y permisos) y UX (pantallas y componentes)
- **Fecha:** —
- **Decisión humana requerida:** resolver las preguntas de la sección 5, empezando por la colisión de tokens y la propiedad de la pantalla de entrada, y autorizar el uso del proyecto Stitch `STP-PPM-001` para generar la exploración.
