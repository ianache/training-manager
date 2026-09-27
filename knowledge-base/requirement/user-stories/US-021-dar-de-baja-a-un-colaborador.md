---
type: User Story
title: "US-021 — Dar de baja a un colaborador"
description: "El Jefe de Ingeniería registra la baja de un colaborador cerrando la vigencia de su rol de Empleado o Contratista, sin borrar a la persona ni su historial."
tags: [user-story, colaboradores, party, c7, baja]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T12:10:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-021 — Dar de baja a un colaborador

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-021 |
| Épica / capacidad | SPEC-001 C7 — Dar de baja (SPEC-001:L145) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: sin baja no se sabe quién es colaborador vigente (BR-PTY-05) ni empieza el plazo de anonimización (D17) |
| Estimación | |
| Dependencias | US-015 |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** registrar la baja de un colaborador que se va, **para** que deje de ser colaborador vigente sin perder sus certificaciones ni su historial.

## 3. Contexto y valor

- **Problema que resuelve:** las certificaciones históricas necesitan a la persona (BR-ACR-03), así que no se puede borrar (SPEC-001:L114).
- **Valor esperado:** colaboradores vigentes correctos; historial y KPI conservados; inicio del plazo de anonimización.
- **Métrica o KPI que impacta:** KPI 1 Cobertura de roles y KPI 6 Adopción cuentan colaboradores vigentes (inferencia a partir de RCP-001 §2).

## 4. Alcance

- **Incluye:**
  - Cerrar la vigencia del rol de Empleado o de Contratista con una fecha hasta (BR-PTY-13).
  - Registrar el momento de la baja, desde el que se cuenta el plazo de anonimización (D17).
- **Excluye:**
  - La anonimización (US-024) y el aviso (US-025).
  - Qué pasa con las demás vigencias de la persona (RCP2-Q2).

## 5. Criterios de aceptación

### AC-1 — Registrar la baja

```gherkin
Escenario: Baja de un empleado
  Dado que soy el Jefe de Ingeniería y existe un colaborador con el rol de Empleado vigente
  Cuando registro su baja con una fecha
  Entonces su rol de Empleado queda con la vigencia cerrada en esa fecha
  Y la persona deja de ser colaborador vigente
```

- **Regla / fuente:** BR-PTY-13, BR-PTY-05

### AC-2 — La persona no se borra

```gherkin
Escenario: Conservar a la persona y sus certificaciones
  Dado un colaborador dado de baja que tiene certificaciones
  Cuando se consultan esas certificaciones
  Entonces siguen mostrando a la persona certificada y quién certificó
```

- **Regla / fuente:** BR-PTY-13; BR-ACR-03; SPEC-001:L114

### AC-3 — Inicio del plazo

```gherkin
Escenario: Registrar el inicio del plazo de anonimización
  Dado un colaborador vigente
  Cuando registro su baja
  Entonces queda registrado cuándo se registró la baja, que es el inicio del plazo de anonimización
```

- **Regla / fuente:** BR-PTY-15; D17

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Dar de baja a una persona sin rol de Empleado o Contratista vigente | Sin regla explícita; no hay rol que cerrar | US-021-Q1 |
| Fecha de baja anterior a la fecha desde del rol | Sin regla | US-021-Q1 |
| Asignaciones de Rol-Nivel, roles del programa, pertenencia y reporte vigentes al dar de baja | Sin regla | RCP2-Q2 |
| Correo laboral de la persona dada de baja | Deja de contar para la unicidad entre vigentes | BR-PTY-08 |
| Borrar a la persona | No se permite | BR-PTY-13 |
| Usuario que no es Jefe de Ingeniería | No puede | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-05 | Colaborador = rol vigente de Empleado o Contratista | BRC-001 |
| BR-PTY-08 | Correo único entre vigentes | BRC-001 |
| BR-PTY-12 | No se borra: se cierra la vigencia | BRC-001 |
| BR-PTY-13 | La baja cierra el rol; la persona no se borra | BRC-001 |
| BR-PTY-15 | El plazo se cuenta desde el registro de la baja | BRC-001 |
| BR-PTY-17 | Permiso | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Colaborador | Deja de serlo | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) |
| Baja, Vigencia | Evento y dato | Términos nuevos de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** la PII se conserva hasta la anonimización (US-024); acceso mínimo hasta P-08.
- **Otros:** auditoría de quién registró la baja y cuándo (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** ficha del colaborador → dar de baja → fecha → confirmar.
- **Estados de la interfaz:** éxito; persona ya dada de baja; sin permisos.
- **Contenido clave:** consecuencia de la baja (deja de ser colaborador; empieza el plazo de anonimización).

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-015.
- **Es prerrequisito de:** US-024 y US-025.
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: la fecha de baja (fin de la vigencia) y el momento en que se registra la baja pueden ser distintos; D17 cuenta el plazo desde el registro.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| RCP2-Q2 | ¿Al dar de baja se cierran también las asignaciones de Rol-Nivel, los roles del programa y las relaciones vigentes? | Jefe de Ingeniería | Media | Sí (alcance de la baja) | Abierta |
| US-021-Q1 | ¿Qué fechas de baja son válidas (pasada, futura, anterior al inicio del rol)? | Jefe de Ingeniería | Baja | No | Abierta |
| US-021-Q2 | ¿Se puede revertir una baja registrada por error (antes de anonimizar)? | Jefe de Ingeniería | Media | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0080 | Colaborador derivado del rol vigente | SPEC-001:L61 (D7) | decision | high |
| EVD-2026-0086 | No se borran los registros | SPEC-001:L68 (D14) | decision | high |
| EVD-2026-0089 | El plazo cuenta desde el registro de la baja | SPEC-001:L71 (D17) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Solo requiere US-015 |
| Negociable | Sí | Alcance de cierres abierto |
| Valiosa | Sí | Mantiene vigentes correctos |
| Estimable | Parcial | RCP2-Q2 cambia el alcance |
| Pequeña (Small) | Sí | Un evento |
| Testeable | Sí | Criterios verificables |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [ ] No hay preguntas abiertas que bloqueen
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario
- [ ] El PO validó la historia

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** el cierre del rol y la conservación de la persona están sostenidos (BR-PTY-13); RCP2-Q2 bloquea qué otras vigencias se cierran.
- **Bloqueos de entrega:** US-015.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde RCP2-Q2 y valida la historia.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
