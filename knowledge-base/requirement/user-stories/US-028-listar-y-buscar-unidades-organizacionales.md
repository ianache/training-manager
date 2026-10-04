---
type: User Story
title: "US-028 — Listar y buscar unidades organizacionales"
description: "El Jefe de Ingeniería consulta las unidades organizacionales con búsqueda, filtros, ordenamiento y vista jerárquica."
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

# US-028 — Listar y buscar unidades organizacionales

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-028 |
| Épica / capacidad | SPEC-001 C3 — Gestionar la estructura organizacional (SPEC-001:L147). Dividida de US-017 el 2026-10-03 |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: sin consulta no se puede mantener la estructura ni ubicar a las personas |
| Estimación | |
| Dependencias | US-017 |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** consultar las unidades organizacionales con búsqueda, filtros, ordenamiento y vista jerárquica, **para** ubicar rápido una unidad y entender la estructura vigente de COMSATEL.

## 3. Contexto y valor

- **Problema que resuelve:** sin un listado no se pueden ubicar ni mantener las unidades de la estructura (SPEC-001:L35).
- **Valor esperado:** Estructura vigente e histórica fácil de ubicar para el alta y el mantenimiento.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Listar las unidades con nombre, unidad padre, estado (Activa / Inactiva) y vigencia, por defecto las Activas.
  - Buscar por nombre, filtrar por estado y por unidad padre (con sus descendientes).
  - Ordenar por columnas y alternar entre lista y jerarquía.
- **Excluye:**
  - Registrar o editar unidades (US-029).
  - Desactivar o reactivar unidades (US-030).
  - Consulta por otros colaboradores: el Jefe de Ingeniería y ADMIN (BR-PTY-17).

## 5. Criterios de aceptación

### AC-1 — Listar las unidades

```gherkin
Escenario: Ver las unidades activas
  Dado que existen unidades Activas e Inactivas
  Cuando abro la gestión de la estructura organizacional
  Entonces veo las unidades Activas, cada una con su nombre, unidad padre, estado y vigencia desde
```

- **Regla / fuente:** BR-PTY-04, BR-PTY-21; EVD-2026-0133

### AC-2 — Buscar por nombre

```gherkin
Escenario: Buscar una unidad
  Dado que existen varias unidades
  Cuando escribo parte del nombre de una unidad en la búsqueda
  Entonces solo veo las unidades cuyo nombre contiene ese texto
```

- **Regla / fuente:** EVD-2026-0133

### AC-3 — Filtrar por estado

```gherkin
Escenario: Ver las unidades inactivas
  Dado que existen unidades Activas e Inactivas
  Cuando filtro por estado Inactiva
  Entonces veo solo las unidades Inactivas, con su vigencia hasta
```

- **Regla / fuente:** BR-PTY-21; EVD-2026-0133

### AC-4 — Filtrar por unidad padre

```gherkin
Escenario: Ver las unidades de una rama
  Dado una unidad con unidades hijas y descendientes
  Cuando filtro por esa unidad padre
  Entonces veo sus unidades hijas y todas sus descendientes que cumplen los demás filtros
```

- **Regla / fuente:** BR-PTY-04; EVD-2026-0133

### AC-5 — Ordenar el listado

```gherkin
Escenario: Ordenar por una columna
  Dado el listado de unidades
  Cuando ordeno por nombre, unidad padre, estado o vigencia desde, en sentido ascendente o descendente
  Entonces las unidades se muestran en ese orden y se conservan los filtros aplicados
```

- **Regla / fuente:** EVD-2026-0133

### AC-6 — Ver la jerarquía

```gherkin
Escenario: Alternar a la vista jerárquica
  Dado el listado de unidades
  Cuando cambio a la vista jerárquica
  Entonces veo cada unidad bajo su unidad padre vigente
```

- **Regla / fuente:** BR-PTY-04; EVD-2026-0133

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Sin unidades que cumplan los filtros | Se muestra el estado sin resultados con los filtros activos | EVD-2026-0133 |
| Consulta de la estructura por otros colaboradores | No puede: ven solo la unidad de cada persona (BR-PTY-20) | BR-PTY-17 |
| Usuario que no es Jefe de Ingeniería ni ADMIN | No puede gestionar la estructura ni consultarla | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-04 | Relación de estructura unidad ↔ unidad padre | BRC-001 |
| BR-PTY-17 | Permiso del Jefe de Ingeniería y de ADMIN (incluye consultar la estructura) | BRC-001 |
| BR-PTY-21 | Unidad Activa / Inactiva según su vigencia; desactivar = eliminación lógica | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Unidad organizacional | Objeto gestionado; Activa / Inactiva | [TRM-0079](../../business/glossary/terms/TRM-0079-unidad-organizacional.md) |
| Relación entre partes | Estructura (unidad ↔ unidad padre) | [TRM-0074](../../business/glossary/terms/TRM-0074-relacion-entre-partes.md) |
| Vigencia | Desde / hasta de rol y relación | [TRM-0092](../../business/glossary/terms/TRM-0092-vigencia.md) |

Datos de una unidad en el listado: nombre, unidad padre (vacía en la unidad superior), estado, vigencia desde y hasta, y los conteos de unidades hijas activas y personas vigentes.

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** No aplica (datos de organizaciones; los conteos de personas no identifican a nadie).
- **Otros:** auditoría de cambios (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** abrir la gestión → ver las unidades Activas → buscar, filtrar y ordenar, o alternar a la jerarquía.
- **Estados de la interfaz:** sin organización interna; sin unidades registradas; sin resultados para los filtros aplicados; cargando; sin permisos; error al consultar.
- **Contenido clave:** por unidad, nombre, unidad padre, estado, vigencia desde/hasta, unidades hijas activas y personas vigentes; filtros activos visibles, con estado Activa por defecto.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-017
- **Es prerrequisito de:** US-029 y US-030 (se operan desde el listado).
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: el conteo de personas vigentes lo aporta la relación de pertenencia (BR-PTY-04), cuyo alta es de US-015.

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
| EVD-2026-0142 | La estructura la consulta y gestiona solo el Jefe de Ingeniería | Decisión humana: ianache, 2026-10-03, US-017-Q6 | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-10-03T10:00:00-05:00` (EVD-0133 a 0142; las demás, 2026-09-27T10:05:00-05:00), `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md), US-017 original (dividida el 2026-10-03)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Solo lee lo que registra US-029; se define sin otra historia |
| Negociable | Sí | Sin preguntas abiertas; los criterios de borde se pueden renegociar con el PO |
| Valiosa | Sí | Permite ubicar y mantener la estructura |
| Estimable | Sí | Reglas claras |
| Pequeña (Small) | Sí | Seis criterios de consulta |
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
- **Motivo:** el actor y el valor están sostenidos; los criterios se apoyan en BR-PTY-04, 17 y 21 y la decisión EVD-2026-0133; no quedan preguntas abiertas.
- **Bloqueos de entrega:** Ninguno.
- **Propuesta de división (si no es pequeña):** No aplica.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** Ninguna.
- **Validación:** Heredada de US-017 · Validada por ianache (Jefe de Ingeniería) · Fecha: 2026-10-03. El estado del archivo sigue en `draft`: la verificación (`verified`) la asigna un flujo humano.
