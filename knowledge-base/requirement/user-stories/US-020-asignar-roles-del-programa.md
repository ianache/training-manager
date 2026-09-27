---
type: User Story
title: "US-020 — Asignar roles del programa"
description: "El Jefe de Ingeniería asigna y cierra los roles de la parte Evaluador y Jefe de Ingeniería, con aviso sin bloqueo si queda más de un Jefe de Ingeniería vigente."
tags: [user-story, colaboradores, party, c6, roles-del-programa]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T12:05:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-020 — Asignar roles del programa

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-020 |
| Épica / capacidad | SPEC-001 C6 — Asignar roles del programa (SPEC-001:L144) |
| Horizonte / release | H1 (los evaluadores certifican en US-003) |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: sin Evaluador no hay certificación (US-003) y sin Jefe de Ingeniería vigente no hay destinatario del aviso (US-025) |
| Estimación | |
| Dependencias | US-015 |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** asignar a una persona el rol de Evaluador o de Jefe de Ingeniería, y cerrarlo cuando deja de ejercerlo, **para** que se sepa quién gestiona el programa en cada momento.

## 3. Contexto y valor

- **Problema que resuelve:** no estaba definido quién designa a los evaluadores (RCP-Q1); el Evaluador y el Jefe de Ingeniería gestionan el programa (BR-PRG-01).
- **Valor esperado:** roles del programa vigentes e históricos, y un único Jefe de Ingeniería esperado.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Asignar el rol de la parte [Evaluador](../../business/glossary/terms/TRM-0021-evaluador.md) o Jefe de Ingeniería con fecha desde, y cerrarlo con fecha hasta.
  - Avisar sin impedir cuando se asigna un segundo Jefe de Ingeniería vigente (D21).
- **Excluye:**
  - Rol-Nivel del catálogo (US-019).
  - Permisos de acceso en Keycloak (fuera de alcance, D4).

## 5. Criterios de aceptación

### AC-1 — Asignar Evaluador

```gherkin
Escenario: Designar un evaluador
  Dado que soy el Jefe de Ingeniería y existe una persona registrada
  Cuando le asigno el rol Evaluador desde una fecha
  Entonces la persona queda con el rol Evaluador vigente
```

- **Regla / fuente:** BR-PTY-03, BR-PRG-01, BR-PTY-17

### AC-2 — Cerrar un rol del programa

```gherkin
Escenario: Retirar el rol de evaluador
  Dado una persona con el rol Evaluador vigente
  Cuando cierro ese rol con una fecha hasta
  Entonces el rol queda con su vigencia cerrada y se conserva en el historial
```

- **Regla / fuente:** BR-PTY-12

### AC-3 — Segundo Jefe de Ingeniería

```gherkin
Escenario: Avisar sin bloquear
  Dado que ya existe una persona con el rol Jefe de Ingeniería vigente
  Cuando asigno el rol Jefe de Ingeniería a otra persona
  Entonces la plataforma avisa que ya hay un Jefe de Ingeniería vigente
  Y la asignación se completa si confirmo
```

- **Regla / fuente:** BR-PTY-18; D21

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Cerrar el rol del único Jefe de Ingeniería vigente | Sin regla; consecuencia conocida: los avisos quedarían como no enviados | SPEC-001:L125; US-020-Q1 |
| Asignar a una persona dada de baja o sin rol de Empleado o Contratista | Sin regla | US-020-Q2 |
| El mismo rol del programa dos veces vigente para la misma persona | Sin regla | US-020-Q2 |
| Usuario que no es Jefe de Ingeniería | No puede | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-03 | Roles de la parte Evaluador y Jefe de Ingeniería | BRC-001 |
| BR-PRG-01 | Evaluador y Jefe de Ingeniería gestionan el programa | BRC-001 §Transparencia |
| BR-PTY-12 | Vigencias y auditoría | BRC-001 |
| BR-PTY-17 | Permiso | BRC-001 |
| BR-PTY-18 | Único Jefe de Ingeniería esperado; aviso sin bloqueo | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Evaluador | Rol asignado | [TRM-0021](../../business/glossary/terms/TRM-0021-evaluador.md) |
| Jefe de Ingeniería | Rol asignado y actor | [TRM-0036](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Rol de la parte | Concepto | Término nuevo de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio); el aviso de AC-3 debe ser perceptible por tecnologías de apoyo.
- **Privacidad y datos personales:** No aplica más allá de la identidad de la persona.
- **Otros:** auditoría (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** ficha de la persona → roles del programa → asignar o cerrar → confirmar (con aviso en AC-3).
- **Estados de la interfaz:** éxito; aviso de segundo Jefe de Ingeniería; sin permisos.
- **Contenido clave:** quién es hoy Jefe de Ingeniería y quiénes son evaluadores.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-015.
- **Es prerrequisito de:** US-003 (certificar), US-025 (destinatarios del aviso).
- **Supuestos:** el primer Jefe de Ingeniería se registra por un medio inicial no descrito (nadie puede asignarlo si no existe). S-1, origen: inferencia del agente; confirma el Jefe de Ingeniería (US-020-Q3).
- **Hipótesis del agente:** ninguna más.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| US-020-Q1 | ¿Se puede cerrar el rol del único Jefe de Ingeniería vigente? | Jefe de Ingeniería | Media | No | Abierta |
| US-020-Q2 | ¿Los roles del programa exigen ser colaborador vigente? | Jefe de Ingeniería | Baja | No | Abierta |
| US-020-Q3 | ¿Cómo se registra el primer Jefe de Ingeniería? | Jefe de Ingeniería + ARQ | Media | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0078 | Roles de la parte del programa | SPEC-001:L87 (D5) | decision | high |
| EVD-2026-0092 | Único Jefe de Ingeniería esperado | SPEC-001:L74 (D20) | decision | high |
| EVD-2026-0093 | Aviso sin impedir el segundo | SPEC-001:L75 (D21) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Solo requiere personas (US-015) |
| Negociable | Sí | Casos de borde abiertos |
| Valiosa | Sí | Habilita certificación y avisos |
| Estimable | Sí | Reglas claras |
| Pequeña (Small) | Sí | Asignar y cerrar dos roles |
| Testeable | Sí | Criterios verificables |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [x] No hay preguntas abiertas que bloqueen
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

- **Estado:** READY
- **Motivo:** asignación, cierre y aviso sostenidos por BR-PTY-03, 12, 17, 18 y BR-PRG-01; las preguntas abiertas no bloquean.
- **Bloqueos de entrega:** US-015.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y responde US-020-Q1 a Q3.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
