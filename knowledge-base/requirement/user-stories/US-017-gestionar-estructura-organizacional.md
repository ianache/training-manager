---
type: User Story
title: "US-017 — Registrar la organización interna"
description: "El Jefe de Ingeniería registra la organización interna (COMSATEL) con su razón social y su RUC, base de la estructura organizacional."
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

# US-017 — Registrar la organización interna

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-017 |
| Épica / capacidad | SPEC-001 C3 — Gestionar la estructura organizacional (SPEC-001:L147). Dividida de US-017 el 2026-10-03 |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: sin organización interna no hay unidades ni altas de empleados (US-015) |
| Estimación | |
| Dependencias | — |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** registrar la organización interna con su razón social y su RUC, **para** contar con la organización a la que pertenecen las unidades y los empleados de COMSATEL.

## 3. Contexto y valor

- **Problema que resuelve:** la estructura organizacional y el empleo no tenían una organización interna en la que apoyarse (SPEC-001:L35, L109).
- **Valor esperado:** COMSATEL registrada como organización interna con identificación única.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Registrar la organización interna (COMSATEL) con su razón social y su RUC.
  - Rechazar un RUC ya registrado.
- **Excluye:**
  - Gestión de unidades organizacionales (US-028, US-029, US-030).
  - La pertenencia de una persona a una unidad (US-015 y US-016).
  - Proveedores (US-018).
  - Gestión por API de la organización interna: es un registro único fuera de la gestión (BR-PTY-28, EVD-2026-0240); no se lista, edita ni desactiva en las pantallas de unidades.

## 5. Criterios de aceptación

### AC-1 — Registrar la organización interna

```gherkin
Escenario: Registrar COMSATEL
  Dado que soy el Jefe de Ingeniería
  Cuando registro una organización con su razón social y su RUC, con el rol Organización interna
  Entonces la organización queda disponible como organización interna
```

- **Regla / fuente:** BR-PTY-02, BR-PTY-03, BR-PTY-07

### AC-2 — RUC repetido

```gherkin
Escenario: Rechazar un RUC ya registrado
  Dado una organización con el RUC 20123456789
  Cuando registro otra organización con el mismo RUC y país
  Entonces el registro no se completa y se indica que la identificación ya existe
```

- **Regla / fuente:** BR-PTY-07

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Identificación de persona (DNI) en una organización | Se rechaza: las organizaciones usan RUC | BR-PTY-07 |
| Usuario que no es Jefe de Ingeniería | No puede gestionar la estructura ni consultarla | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-02 | Parte = Persona u Organización, con vigencias | BRC-001 |
| BR-PTY-03 | Roles Organización interna y Unidad organizacional | BRC-001 |
| BR-PTY-07 | RUC para organizaciones, único | BRC-001 |
| BR-PTY-12 | Vigencias y auditoría: no se borra, se cierra la vigencia | BRC-001 |
| BR-PTY-17 | Permiso del Jefe de Ingeniería (incluye consultar la estructura) | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| COMSATEL | Organización interna | [TRM-0015](../../business/glossary/terms/TRM-0015-comsatel.md) |
| Organización | Parte con RUC | [TRM-0072](../../business/glossary/terms/TRM-0072-organizacion.md) |
| Organización interna | Rol de COMSATEL | [TRM-0078](../../business/glossary/terms/TRM-0078-organizacion-interna.md) |

Datos de la organización: razón social, RUC (con país emisor) y rol Organización interna.

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** No aplica (datos de organizaciones; los conteos de personas no identifican a nadie).
- **Otros:** auditoría de cambios (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** abrir la gestión → registrar la organización interna → confirmar.
- **Estados de la interfaz:** sin organización interna (vacío inicial); éxito; RUC duplicado; sin permisos; error al guardar.
- **Contenido clave:** razón social, RUC, país emisor y vigencia.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** —
- **Es prerrequisito de:** US-028, US-029, US-030 y US-015.
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: una unidad organizacional no necesita RUC (SPEC-001:L109 "RUC si aplica"); aplica a las unidades, ver US-029.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| — | Sin preguntas abiertas: las de la historia origen (US-017-Q1 a Q6) se respondieron el 2026-10-03 | Jefe de Ingeniería | — | No | Respondidas |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0078 | Patrón Party: roles y relaciones con vigencia | SPEC-001:L59, L86-L88 (D5) | decision | high |
| EVD-2026-0083 | RUC para organizaciones | SPEC-001:L64 (D10) | decision | high |
| EVD-2026-0084 | El Jefe de Ingeniería mantiene la información | SPEC-001:L65 (D11) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-10-03T10:00:00-05:00` (EVD-0133 a 0142; las demás, 2026-09-27T10:05:00-05:00), `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md), US-017 original (dividida el 2026-10-03)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | No depende de otra historia |
| Negociable | Sí | Sin preguntas abiertas; los criterios de borde se pueden renegociar con el PO |
| Valiosa | Sí | Base de la estructura y del alta |
| Estimable | Sí | Reglas claras |
| Pequeña (Small) | Sí | Un solo registro con dos criterios |
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
- **Motivo:** el actor y el valor están sostenidos; los criterios se apoyan en BR-PTY-02, 03, 07, 12 y 17; no quedan preguntas abiertas.
- **Bloqueos de entrega:** Ninguno.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** Ninguna.
- **Validación:** Heredada de US-017 · Validada por ianache (Jefe de Ingeniería) · Fecha: 2026-10-03. El estado del archivo sigue en `draft`: la verificación (`verified`) la asigna un flujo humano.
