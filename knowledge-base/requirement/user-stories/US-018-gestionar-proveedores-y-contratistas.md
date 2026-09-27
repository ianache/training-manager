---
type: User Story
title: "US-018 — Gestionar proveedores y contratistas"
description: "El Jefe de Ingeniería registra proveedores y mantiene la relación de contratación de cada contratista con su proveedor, con vigencias."
tags: [user-story, colaboradores, party, c4, proveedores]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T11:55:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-018 — Gestionar proveedores y contratistas

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-018 |
| Épica / capacidad | SPEC-001 C4 — Gestionar proveedores y contratistas (SPEC-001:L142) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: el alta de contratistas exige un proveedor (BR-PTY-10) |
| Estimación | |
| Dependencias | — (el cambio de proveedor de un contratista necesita US-015) |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** registrar proveedores y mantener con qué proveedor está contratado cada contratista, **para** saber a qué empresa pertenece cada persona externa que trabaja en los proyectos.

## 3. Contexto y valor

- **Problema que resuelve:** los contratistas participan del programa pero pertenecen a un proveedor (SPEC-001:L36).
- **Valor esperado:** cada contratista está vinculado a su proveedor vigente, con historial.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Registrar un proveedor: organización con nombre o razón social y RUC, con rol Proveedor (SPEC-001:L109).
  - Cambiar el proveedor de un contratista: cerrar la relación de contratación vigente y abrir una nueva.
- **Excluye:**
  - El alta del contratista (US-015) y su baja (US-021).

## 5. Criterios de aceptación

### AC-1 — Registrar un proveedor

```gherkin
Escenario: Registrar un proveedor
  Dado que soy el Jefe de Ingeniería
  Cuando registro una organización con su razón social, su RUC y el rol Proveedor con fecha desde
  Entonces el proveedor queda disponible para relacionarlo con contratistas
```

- **Regla / fuente:** BR-PTY-03, BR-PTY-07

### AC-2 — Cambiar el proveedor de un contratista

```gherkin
Escenario: El contratista pasa a otro proveedor
  Dado un contratista con una relación de contratación vigente con el proveedor A
  Cuando registro su contratación con el proveedor B desde una fecha
  Entonces la relación con A queda con su vigencia cerrada y la relación con B queda vigente
```

- **Regla / fuente:** BR-PTY-04, BR-PTY-10, BR-PTY-12

### AC-3 — No dejar a un contratista sin proveedor

```gherkin
Escenario: Cerrar la única contratación vigente
  Dado un contratista vigente con una sola relación de contratación vigente
  Cuando intento cerrarla sin abrir otra ni dar de baja al contratista
  Entonces el cambio no se permite
```

- **Regla / fuente:** BR-PTY-10

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Proveedor con RUC ya registrado | Se rechaza | BR-PTY-07 |
| Cambio de proveedor sin cambio de correo laboral | Sin regla: el correo debe ser del proveedor (D13), pero no se dice si se exige cambiarlo en el mismo paso | US-018-Q1 |
| Cerrar un proveedor con contratistas vigentes | Sin regla | US-018-Q2 |
| Jefe directo del contratista | Sin regla | Q-02 |
| Usuario que no es Jefe de Ingeniería | No puede | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-03 | Rol Proveedor | BRC-001 |
| BR-PTY-04 | Relación de contratación contratista ↔ proveedor | BRC-001 |
| BR-PTY-07 | RUC único | BRC-001 |
| BR-PTY-08 | Correo laboral del contratista = del proveedor | BRC-001 |
| BR-PTY-10 | Contratista con contratación vigente | BRC-001 |
| BR-PTY-12 | Vigencias y auditoría | BRC-001 |
| BR-PTY-17 | Permiso | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Proveedor, Contratista, Relación de contratación | Datos gestionados | Términos nuevos de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** el vínculo contratista–proveedor es dato de una persona; acceso mínimo hasta P-08.
- **Otros:** auditoría (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** lista de proveedores → registrar proveedor; desde la ficha del contratista → cambiar proveedor.
- **Estados de la interfaz:** sin proveedores; éxito; RUC duplicado; sin permisos; contratista sin otra contratación (bloqueo de AC-3).
- **Contenido clave:** proveedor vigente del contratista y su historial.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-015 para AC-2 y AC-3.
- **Es prerrequisito de:** US-015 (alta de contratistas).
- **Supuestos:** ninguno.
- **Hipótesis del agente:** ninguna.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| Q-02 | ¿Un contratista tiene jefe directo dentro de COMSATEL? | Jefe de Ingeniería | Media | Sí (qué relaciones se mantienen del contratista) | Abierta |
| US-018-Q1 | ¿Al cambiar de proveedor se exige cambiar el correo laboral en el mismo paso? | Jefe de Ingeniería | Media | Sí (AC-2 completo) | Abierta |
| US-018-Q2 | ¿Se puede cerrar el rol Proveedor con contratistas vigentes? | Jefe de Ingeniería | Baja | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0078 | Roles y relaciones con vigencia | SPEC-001:L59, L87-L88 (D5) | decision | high |
| EVD-2026-0083 | RUC para organizaciones | SPEC-001:L64 (D10) | decision | high |
| EVD-2026-0085 | Correo del contratista = del proveedor | SPEC-001:L67 (D13) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | El registro de proveedores es independiente; el cambio de proveedor necesita US-015 |
| Negociable | Sí | Correo y cierre de proveedor abiertos |
| Valiosa | Sí | Habilita a los contratistas |
| Estimable | Parcial | US-018-Q1 cambia el alcance |
| Pequeña (Small) | Sí | Dos comportamientos acotados |
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
- **Motivo:** registro de proveedores y contratación vigente sostenidos (BR-PTY-03, 04, 07, 10); Q-02 y US-018-Q1 bloquean el cambio de proveedor completo.
- **Bloqueos de entrega:** US-015 para AC-2 y AC-3.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería responde Q-02 y US-018-Q1 y valida la historia.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
