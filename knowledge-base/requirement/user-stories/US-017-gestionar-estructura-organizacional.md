---
type: User Story
title: "US-017 — Gestionar la estructura organizacional"
description: "El Jefe de Ingeniería registra la organización interna, sus unidades organizacionales y la jerarquía entre ellas, con vigencias."
tags: [user-story, colaboradores, party, c3, estructura-organizacional]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T11:50:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-017 — Gestionar la estructura organizacional

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-017 |
| Épica / capacidad | SPEC-001 C3 — Gestionar la estructura organizacional (SPEC-001:L141) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: el alta de empleados necesita la organización interna y sus unidades (US-015) |
| Estimación | |
| Dependencias | — |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** registrar la organización interna, sus unidades y la jerarquía entre ellas, **para** ubicar a cada colaborador en la estructura de COMSATEL.

## 3. Contexto y valor

- **Problema que resuelve:** la pertenencia de las personas a unidades y la estructura entre unidades no tenían dónde registrarse (SPEC-001:L35).
- **Valor esperado:** estructura vigente e histórica de COMSATEL disponible para altas y consultas.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Registrar la organización interna ([COMSATEL](../../business/glossary/terms/TRM-0015-comsatel.md)) con su nombre y su RUC (SPEC-001:L109).
  - Registrar unidades organizacionales (rol de la parte Unidad organizacional) y su relación de estructura con la unidad padre, con vigencia.
  - Cambiar la unidad padre cerrando la vigencia de la relación anterior.
- **Excluye:**
  - La pertenencia de una persona a una unidad (US-015 y US-016).
  - Proveedores (US-018).

## 5. Criterios de aceptación

### AC-1 — Registrar la organización interna

```gherkin
Escenario: Registrar COMSATEL
  Dado que soy el Jefe de Ingeniería
  Cuando registro una organización con su razón social y su RUC, con el rol Organización interna
  Entonces la organización queda disponible como organización interna
```

- **Regla / fuente:** BR-PTY-02, BR-PTY-03, BR-PTY-07

### AC-2 — Registrar una unidad y su padre

```gherkin
Escenario: Crear una unidad dentro de otra
  Dado una unidad organizacional existente
  Cuando registro una nueva unidad y la relaciono con la existente como su unidad padre, con fecha desde
  Entonces la nueva unidad queda en la jerarquía con esa relación vigente
```

- **Regla / fuente:** BR-PTY-03, BR-PTY-04

### AC-3 — Cambiar la unidad padre

```gherkin
Escenario: Mover una unidad
  Dado una unidad con una relación de estructura vigente con su unidad padre
  Cuando la relaciono con otra unidad padre
  Entonces la relación anterior queda con su vigencia cerrada y la nueva queda vigente
```

- **Regla / fuente:** BR-PTY-12

### AC-4 — RUC repetido

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
| Borrar una unidad | No se borra: se cierra la vigencia | BR-PTY-12 |
| Unidad que queda como padre de sí misma o ciclo en la jerarquía | Sin regla | US-017-Q1 |
| Cerrar una unidad con personas vigentes | Sin regla | US-017-Q2 |
| Identificación de persona (DNI) en una organización | Se rechaza: las organizaciones usan RUC | BR-PTY-07 |
| Usuario que no es Jefe de Ingeniería | No puede gestionar la estructura | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-02 | Parte = Persona u Organización, con vigencias | BRC-001 |
| BR-PTY-03 | Roles Organización interna y Unidad organizacional | BRC-001 |
| BR-PTY-04 | Relación de estructura unidad ↔ unidad padre | BRC-001 |
| BR-PTY-07 | RUC para organizaciones, único | BRC-001 |
| BR-PTY-12 | Vigencias y auditoría | BRC-001 |
| BR-PTY-17 | Permiso del Jefe de Ingeniería | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| COMSATEL | Organización interna | [TRM-0015](../../business/glossary/terms/TRM-0015-comsatel.md) |
| Organización, Unidad organizacional, Relación entre partes | Estructura | Términos nuevos de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** No aplica (datos de organizaciones).
- **Otros:** auditoría de cambios (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** ver la jerarquía vigente → crear unidad o cambiar su padre → confirmar.
- **Estados de la interfaz:** sin organización interna (vacío inicial); éxito; RUC duplicado; sin permisos.
- **Contenido clave:** jerarquía vigente y su historial.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** —
- **Es prerrequisito de:** US-015.
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: una unidad organizacional no necesita RUC (SPEC-001:L109 "RUC si aplica").

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| US-017-Q1 | ¿Se impiden los ciclos en la jerarquía de unidades? | Jefe de Ingeniería | Baja | No | Abierta |
| US-017-Q2 | ¿Se puede cerrar una unidad que tiene personas o unidades hijas vigentes? | Jefe de Ingeniería | Media | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0078 | Patrón Party: roles y relaciones con vigencia | SPEC-001:L59, L86-L88 (D5) | decision | high |
| EVD-2026-0083 | RUC para organizaciones | SPEC-001:L64 (D10) | decision | high |
| EVD-2026-0084 | El Jefe de Ingeniería mantiene la información | SPEC-001:L65 (D11) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | No depende de otra historia |
| Negociable | Sí | Ciclos y cierre de unidades abiertos |
| Valiosa | Sí | Necesaria para el alta |
| Estimable | Sí | Reglas claras |
| Pequeña (Small) | Sí | Una estructura simple |
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
- **Motivo:** los criterios están sostenidos por BR-PTY-02 a 04, 07, 12 y 17; las preguntas abiertas son de borde y no bloquean.
- **Bloqueos de entrega:** Ninguno.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y responde US-017-Q1 y Q2.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
