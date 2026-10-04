---
type: User Story
title: "US-030 — Desactivar y reactivar unidades organizacionales"
description: "El Jefe de Ingeniería desactiva una unidad (eliminación lógica) y la reactiva abriendo una nueva vigencia, con bloqueos por dependencias."
tags: [user-story, colaboradores, party, c3, estructura-organizacional, unidades]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-10-03T13:00:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-030 — Desactivar y reactivar unidades organizacionales

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-030 |
| Épica / capacidad | SPEC-001 C3 — Gestionar la estructura organizacional (SPEC-001:L147). Dividida de US-017 el 2026-10-03 |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Should: la estructura puede mantenerse sin desactivar mientras no haya unidades obsoletas |
| Estimación | |
| Dependencias | US-029 y US-028 |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** desactivar una unidad organizacional que ya no se usa y poder reactivarla, **para** mantener la estructura vigente sin perder el historial de las unidades.

## 3. Contexto y valor

- **Problema que resuelve:** las unidades obsoletas no podían retirarse sin borrarse, y el historial debe conservarse (BR-PTY-12).
- **Valor esperado:** Estructura vigente limpia, con historial intacto y sin dejar personas ni unidades huérfanas.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Desactivar una unidad (eliminación lógica) cerrando su vigencia.
  - Bloquear la desactivación si tiene unidades hijas activas o personas vigentes.
  - Reactivar una unidad Inactiva con una nueva vigencia, solo bajo un padre Activo.
- **Excluye:**
  - Borrar físicamente una unidad.
  - Reubicar personas o unidades hijas (se hace antes, en US-016 y US-029).
  - Listado y búsqueda (US-028).

## 5. Criterios de aceptación

### AC-1 — Desactivar una unidad

```gherkin
Escenario: Desactivar una unidad sin dependencias
  Dado una unidad Activa sin unidades hijas activas ni personas con pertenencia vigente
  Cuando la desactivo y confirmo
  Entonces la unidad queda Inactiva con su vigencia cerrada y no se borra
```

- **Regla / fuente:** BR-PTY-12, BR-PTY-21

### AC-2 — Bloquear la desactivación con dependencias

```gherkin
Escenario: Desactivar una unidad con unidades hijas activas o personas vigentes
  Dado una unidad Activa con unidades hijas activas o personas con pertenencia vigente
  Cuando intento desactivarla
  Entonces la desactivación no se realiza y se indica cuántas unidades hijas activas y personas vigentes la impiden
```

- **Regla / fuente:** BR-PTY-23

### AC-3 — Reactivar una unidad

```gherkin
Escenario: Reactivar una unidad inactiva
  Dado una unidad Inactiva
  Y su unidad padre está Activa, o la unidad no tiene padre
  Cuando la reactivo con una fecha desde
  Entonces la unidad queda Activa con una nueva vigencia y el historial conserva la vigencia anterior
```

- **Regla / fuente:** BR-PTY-12, BR-PTY-24

### AC-4 — Reactivar bajo un padre Inactivo

```gherkin
Escenario: Rechazar reactivar una unidad cuyo padre está Inactivo
  Dado una unidad Inactiva cuya unidad padre está Inactiva
  Cuando intento reactivarla
  Entonces la reactivación no se realiza y se indica que primero debe reactivarse su unidad padre
```

- **Regla / fuente:** BR-PTY-24

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Borrar una unidad | No existe el borrado: solo se desactiva, cerrando la vigencia | BR-PTY-12, BR-PTY-21 |
| Desactivar una unidad con unidades hijas activas o personas vigentes | No se desactiva; se informa qué la impide | BR-PTY-23 |
| Reactivar una unidad cuyo padre está Inactivo | Se rechaza; primero se reactiva el padre | BR-PTY-24 |
| Desactivar una unidad ya Inactiva | La opción no se ofrece | BR-PTY-21 |
| Usuario que no es Jefe de Ingeniería ni ADMIN | No puede gestionar la estructura ni consultarla | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-12 | Vigencias y auditoría: no se borra, se cierra la vigencia | BRC-001 |
| BR-PTY-17 | Permiso del Jefe de Ingeniería y de ADMIN (incluye consultar la estructura) | BRC-001 |
| BR-PTY-21 | Unidad Activa / Inactiva según su vigencia; desactivar = eliminación lógica | BRC-001 |
| BR-PTY-23 | No se desactiva con unidades hijas activas ni personas vigentes | BRC-001 |
| BR-PTY-24 | Reactivar abre nueva vigencia, solo bajo un padre Activo | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Unidad organizacional | Objeto gestionado; Activa / Inactiva | [TRM-0079](../../business/glossary/terms/TRM-0079-unidad-organizacional.md) |
| Vigencia | Desde / hasta de rol y relación | [TRM-0092](../../business/glossary/terms/TRM-0092-vigencia.md) |

Datos: estado de la unidad, vigencia desde/hasta, y los conteos de unidades hijas activas y personas vigentes que explican el bloqueo.

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** No aplica (datos de organizaciones; los conteos de personas no identifican a nadie).
- **Otros:** auditoría de cambios (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** abrir la gestión → elegir la unidad en el listado → desactivarla (con confirmación) o reactivarla.
- **Estados de la interfaz:** confirmación de desactivación; desactivación bloqueada con el detalle de lo que la impide; reactivación bloqueada por padre Inactivo; éxito; sin permisos; error al guardar.
- **Contenido clave:** estado actual, conteo de unidades hijas activas y de personas vigentes, unidad padre y su estado, vigencia anterior.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-029 y US-028
- **Es prerrequisito de:** —
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: la reactivación pide una fecha desde, como el alta (BR-PTY-12). H-2: una unidad Inactiva sigue visible con el filtro de estado (US-028).

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| — | Sin preguntas abiertas: las de la historia origen (US-017-Q1 a Q6) se respondieron el 2026-10-03 | Jefe de Ingeniería | — | No | Respondidas |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0084 | El Jefe de Ingeniería mantiene la información | SPEC-001:L65 (D11) | decision | high |
| EVD-2026-0133 | Gestión de unidades con listado (filtros y orden), alta, edición y eliminación lógica | Decisión humana: ianache (Jefe de Ingeniería), 2026-10-03 | decision | high |
| EVD-2026-0135 | No se desactiva una unidad con hijas activas o personas vigentes | Decisión humana: ianache, 2026-10-03, US-017-Q2 | decision | high |
| EVD-2026-0139 | Reactivar solo bajo un padre Activo | Decisión humana: ianache, 2026-10-03, US-017-Q3 | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-10-03T10:00:00-05:00` (EVD-0133 a 0142; las demás, 2026-09-27T10:05:00-05:00), `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md), US-017 original (dividida el 2026-10-03)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Opera sobre unidades ya registradas (US-029) desde el listado (US-028) |
| Negociable | Sí | Sin preguntas abiertas; los criterios de borde se pueden renegociar con el PO |
| Valiosa | Sí | Mantiene la estructura vigente sin perder historial |
| Estimable | Sí | Reglas claras |
| Pequeña (Small) | Sí | Cuatro criterios de un mismo cambio de estado |
| Testeable | Sí | Criterios verificables |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [x] No hay preguntas abiertas que bloqueen
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario
- [x] El PO validó la historia (heredada: ianache validó US-017 completa el 2026-10-03, antes de la división; el contenido no cambió)

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión

## 17. Preparación y validación

- **Estado:** READY
- **Motivo:** el actor y el valor están sostenidos; los criterios se apoyan en BR-PTY-12, 17, 21, 23 y 24; no quedan preguntas abiertas.
- **Bloqueos de entrega:** US-029 (debe existir para que haya unidades que desactivar).
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** Ninguna.
- **Validación:** Heredada de US-017 · Validada por ianache (Jefe de Ingeniería) · Fecha: 2026-10-03. El estado del archivo sigue en `draft`: la verificación (`verified`) la asigna un flujo humano.
