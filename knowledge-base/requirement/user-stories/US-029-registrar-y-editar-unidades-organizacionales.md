---
type: User Story
title: "US-029 — Registrar y editar unidades organizacionales"
description: "El Jefe de Ingeniería registra unidades con su unidad padre, edita su nombre y cambia su unidad padre con vigencias, sin ciclos ni duplicados."
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

# US-029 — Registrar y editar unidades organizacionales

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-029 |
| Épica / capacidad | SPEC-001 C3 — Gestionar la estructura organizacional (SPEC-001:L147). Dividida de US-017 el 2026-10-03 |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: el alta de empleados necesita las unidades (US-015) |
| Estimación | |
| Dependencias | US-017 |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** registrar unidades organizacionales, editar su nombre y cambiar su unidad padre, **para** mantener la jerarquía de COMSATEL donde se ubica a cada colaborador.

## 3. Contexto y valor

- **Problema que resuelve:** la estructura entre unidades no tenía dónde registrarse ni cambiarse (SPEC-001:L35).
- **Valor esperado:** Jerarquía correcta y auditada, con historial de cambios de padre.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Registrar una unidad con su unidad padre y fecha desde.
  - Editar el nombre de una unidad.
  - Cambiar la unidad padre cerrando la vigencia de la relación anterior.
  - Rechazar ciclos, padres Inactivos y nombres repetidos bajo el mismo padre.
- **Excluye:**
  - Listado y búsqueda (US-028).
  - Desactivar y reactivar (US-030).
  - La pertenencia de una persona a una unidad (US-015 y US-016).

## 5. Criterios de aceptación

### AC-1 — Registrar una unidad y su padre

```gherkin
Escenario: Crear una unidad dentro de otra
  Dado una unidad organizacional Activa existente
  Cuando registro una nueva unidad con su nombre y su correo laboral, y la relaciono con la existente como su unidad padre, con fecha desde
  Entonces la nueva unidad queda Activa en la jerarquía con esa relación vigente
```

- **Regla / fuente:** BR-PTY-03, BR-PTY-04, BR-PTY-21, BR-PTY-27

### AC-2 — Editar el nombre de una unidad

```gherkin
Escenario: Corregir el nombre
  Dado una unidad existente
  Cuando cambio su nombre y confirmo
  Entonces la unidad muestra el nuevo nombre y el cambio queda auditado con el valor anterior
```

- **Regla / fuente:** BR-PTY-12

### AC-3 — Cambiar la unidad padre

```gherkin
Escenario: Mover una unidad
  Dado una unidad con una relación de estructura vigente con su unidad padre
  Cuando la relaciono con otra unidad padre
  Entonces la relación anterior queda con su vigencia cerrada y la nueva queda vigente
```

- **Regla / fuente:** BR-PTY-12

### AC-4 — Rechazar un ciclo

```gherkin
Escenario: Mover una unidad bajo una de sus descendientes
  Dado una unidad A con una unidad hija B
  Cuando intento relacionar A con B como su unidad padre
  Entonces el cambio se rechaza y se indica que crearía un ciclo en la jerarquía
```

- **Regla / fuente:** BR-PTY-22

### AC-5 — Elegir un padre Inactivo

```gherkin
Escenario: Solo se ofrecen unidades Activas como padre
  Dado unidades Activas e Inactivas
  Cuando elijo la unidad padre al registrar o mover una unidad
  Entonces solo puedo elegir unidades Activas y se rechaza una unidad Inactiva
```

- **Regla / fuente:** BR-PTY-25

### AC-6 — Nombre repetido entre hermanas

```gherkin
Escenario: Rechazar un nombre ya usado bajo el mismo padre
  Dado una unidad padre con una unidad hija llamada Soporte
  Cuando registro o renombro otra unidad bajo el mismo padre como Soporte
  Entonces el cambio no se completa y se indica que el nombre ya existe bajo ese padre
```

- **Regla / fuente:** BR-PTY-26

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Borrar una unidad | No existe el borrado: solo se desactiva (US-030) | BR-PTY-12, BR-PTY-21 |
| Unidad que queda como padre de sí misma o ciclo en la jerarquía | Se rechaza | BR-PTY-22 |
| Elegir como padre una unidad Inactiva | Se rechaza | BR-PTY-25 |
| Nombre repetido bajo el mismo padre | Se rechaza; el mismo nombre bajo otro padre se permite | BR-PTY-26 |
| Registrar una unidad sin organización interna | No se puede: primero se registra COMSATEL (US-017) | BR-PTY-03 |
| Usuario que no es Jefe de Ingeniería ni ADMIN | No puede gestionar la estructura ni consultarla | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-03 | Roles Organización interna y Unidad organizacional | BRC-001 |
| BR-PTY-04 | Relación de estructura unidad ↔ unidad padre | BRC-001 |
| BR-PTY-12 | Vigencias y auditoría: no se borra, se cierra la vigencia | BRC-001 |
| BR-PTY-17 | Permiso del Jefe de Ingeniería y de ADMIN (incluye consultar la estructura) | BRC-001 |
| BR-PTY-21 | Unidad Activa / Inactiva según su vigencia; desactivar = eliminación lógica | BRC-001 |
| BR-PTY-22 | Sin ciclos en la jerarquía | BRC-001 |
| BR-PTY-25 | Solo una unidad Activa puede ser padre | BRC-001 |
| BR-PTY-26 | Nombre único entre unidades con el mismo padre | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| COMSATEL | Organización interna | [TRM-0015](../../business/glossary/terms/TRM-0015-comsatel.md) |
| Unidad organizacional | Objeto gestionado; Activa / Inactiva | [TRM-0079](../../business/glossary/terms/TRM-0079-unidad-organizacional.md) |
| Relación entre partes | Estructura (unidad ↔ unidad padre) | [TRM-0074](../../business/glossary/terms/TRM-0074-relacion-entre-partes.md) |
| Vigencia | Desde / hasta de rol y relación | [TRM-0092](../../business/glossary/terms/TRM-0092-vigencia.md) |

Datos de una unidad: nombre, unidad padre (vacía en la unidad superior), vigencia desde y hasta. Una unidad no tiene RUC (H-1).

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** No aplica (datos de organizaciones; los conteos de personas no identifican a nadie).
- **Otros:** auditoría de cambios (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** abrir la gestión → registrar una unidad o abrir una existente → editar el nombre o cambiar el padre → confirmar.
- **Estados de la interfaz:** sin organización interna; éxito; ciclo, padre Inactivo y nombre duplicado rechazados; campo obligatorio vacío; sin permisos; error al guardar.
- **Contenido clave:** nombre, unidad padre (solo Activas), fecha desde, e historial de relaciones y vigencias de la unidad.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-017
- **Es prerrequisito de:** US-015 (alta de colaboradores) y US-030.
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: una unidad no necesita RUC (SPEC-001:L109). H-2: la unidad superior se registra sin padre (IMD-002 R-08, inferencia). H-3: el cambio de nombre se audita con su valor anterior por la regla general de BR-PTY-12.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| — | Sin preguntas abiertas: las de la historia origen (US-017-Q1 a Q6) se respondieron el 2026-10-03 | Jefe de Ingeniería | — | No | Respondidas |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0078 | Patrón Party: roles y relaciones con vigencia | SPEC-001:L59, L86-L88 (D5) | decision | high |
| EVD-2026-0084 | El Jefe de Ingeniería mantiene la información | SPEC-001:L65 (D11) | decision | high |
| EVD-2026-0133 | Gestión de unidades con listado (filtros y orden), alta, edición y eliminación lógica | Decisión humana: ianache (Jefe de Ingeniería), 2026-10-03 | decision | high |
| EVD-2026-0134 | Se rechazan los ciclos en la jerarquía | Decisión humana: ianache, 2026-10-03, US-017-Q1 | decision | high |
| EVD-2026-0140 | Nombre único entre unidades con el mismo padre | Decisión humana: ianache, 2026-10-03, US-017-Q4 | decision | high |
| EVD-2026-0141 | Solo una unidad Activa puede ser padre | Decisión humana: ianache, 2026-10-03, US-017-Q5 | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-10-03T10:00:00-05:00` (EVD-0133 a 0142; las demás, 2026-09-27T10:05:00-05:00), `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md), US-017 original (dividida el 2026-10-03)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Depende solo de US-017 (organización interna) |
| Negociable | Sí | Sin preguntas abiertas; los criterios de borde se pueden renegociar con el PO |
| Valiosa | Sí | Necesaria para el alta de colaboradores |
| Estimable | Sí | Reglas claras |
| Pequeña (Small) | Sí | Seis criterios sobre un mismo registro |
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
- **Motivo:** el actor y el valor están sostenidos; los criterios se apoyan en BR-PTY-03, 04, 12, 17, 21, 22, 25 y 26; no quedan preguntas abiertas.
- **Bloqueos de entrega:** Ninguno.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** Ninguna.
- **Validación:** Heredada de US-017 · Validada por ianache (Jefe de Ingeniería) · Fecha: 2026-10-03. El estado del archivo sigue en `draft`: la verificación (`verified`) la asigna un flujo humano.
