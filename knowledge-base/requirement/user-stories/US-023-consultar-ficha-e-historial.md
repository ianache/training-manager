---
type: User Story
title: "US-023 — Consultar la ficha y su historial"
description: "El Jefe de Ingeniería consulta la ficha de cualquier persona con su historial de vigencias; el colaborador consulta solo la suya."
tags: [user-story, colaboradores, party, c9, consulta, historial]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T12:20:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-023 — Consultar la ficha y su historial

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-023 |
| Épica / capacidad | SPEC-001 C9 — Consultar la ficha y su historial (SPEC-001:L147) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md); el [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md), la suya |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Should: da visibilidad a lo registrado; la gestión puede operar antes con las historias de edición |
| Estimación | |
| Dependencias | US-015; US-022 para el colaborador |
| Preparación | CONDITIONAL |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** consultar la ficha de una persona con su historial de roles, relaciones, contactos y asignaciones, **para** conocer su situación actual y pasada en la organización.

## 3. Contexto y valor

- **Problema que resuelve:** las vigencias guardan la historia (BR-PTY-12), pero hay que poder verla.
- **Valor esperado:** situación vigente e historial de cada persona; el colaborador ve sus propios datos (transparencia, BR-TRA-01 por analogía).
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Ver datos de la persona, identificaciones, medios de contacto, roles, relaciones (unidad, jefe directo, proveedor), asignaciones de Rol-Nivel e identidad de acceso, con sus vigencias.
  - Que el colaborador vea su propia ficha.
- **Excluye:**
  - Que otras personas (Jefe de proyecto, Evaluador, Dirección) vean fichas ajenas (Q-05 / P-08).
  - El perfil de competencias (US-004).

## 5. Criterios de aceptación

### AC-1 — Ficha vigente

```gherkin
Escenario: Ver la situación actual
  Dado que soy el Jefe de Ingeniería y existe un colaborador con rol, unidad, jefe directo, contactos y Rol-Nivel vigentes
  Cuando consulto su ficha
  Entonces veo sus datos y todos sus elementos vigentes con su fecha desde
```

- **Regla / fuente:** SPEC-001:L147; BR-PTY-17

### AC-2 — Historial

```gherkin
Escenario: Ver vigencias cerradas
  Dado un colaborador que cambió de unidad y de nivel en un rol
  Cuando consulto su historial
  Entonces veo los elementos anteriores con sus fechas desde y hasta
```

- **Regla / fuente:** BR-PTY-12

### AC-3 — El colaborador ve su ficha

```gherkin
Escenario: Consultar mi ficha
  Dado que soy un colaborador vinculado a mi usuario de acceso
  Cuando consulto mi ficha
  Entonces veo mis datos y mi historial
```

- **Regla / fuente:** SPEC-001:L147 ("el colaborador, la suya")

### AC-4 — Persona anonimizada

```gherkin
Escenario: Ficha de una persona anonimizada
  Dado una persona anonimizada
  Cuando el Jefe de Ingeniería consulta su ficha
  Entonces ve valores anónimos en lugar de sus datos personales, conserva roles, relaciones, asignaciones y fechas, y ve cuándo y quién la anonimizó
```

- **Regla / fuente:** BR-PTY-14; SPEC-001:L115

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Un colaborador consulta la ficha de otra persona | Sin regla definitiva; hasta resolver P-08, acceso mínimo (solo la suya) | Q-05 |
| Quién ve el código de colaborador de una persona anonimizada | Sin regla; se restringirá junto con P-08 | SPEC-001:L116; Q-05 |
| Colaborador sin identidad de acceso vinculada | Sin regla | RCP-002 H-04 |
| Persona sin historial (recién registrada) | Se ven solo los elementos vigentes | BR-PTY-12 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-12 | Historial por vigencias | BRC-001 |
| BR-PTY-14 | Anonimización | BRC-001 |
| BR-PTY-17 | El Jefe de Ingeniería mantiene la información | BRC-001 |
| BR-PTY-09 | Perfiles profesionales visibles para la persona y los roles de gestión hasta P-08 | BRC-001; SPEC-001:L132 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Colaborador | Actor acotado | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) |
| Ficha, Vigencia | Vista consultada | Términos nuevos de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio); el historial en tabla o lista debe ser navegable con teclado y lector de pantalla.
- **Privacidad y datos personales:** la ficha es PII; acceso mínimo hasta P-08; el código de anonimizados es cuasi-identificador (SPEC-001:L116).
- **Otros:** Sin requisito identificado.

## 10. Consideraciones de UX

- **Flujo esperado:** buscar persona (Jefe de Ingeniería) o abrir "mi ficha" (colaborador) → ver vigente → ver historial.
- **Estados de la interfaz:** ficha completa; sin historial; persona anonimizada; sin permisos; persona no encontrada.
- **Contenido clave:** rol de Empleado o Contratista vigente, unidad, jefe directo, proveedor, Rol-Nivel vigentes.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-015; US-022 para el colaborador.
- **Es prerrequisito de:** —
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: la búsqueda de personas es parte de la consulta del Jefe de Ingeniería (SPEC-001 no la menciona).

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| Q-05 | ¿Quién ve los datos de otras personas, incluidos los perfiles profesionales? (P-08) | Responsable de producto | Alta | Sí (quién más consulta) | Abierta |
| US-023-Q1 | ¿El colaborador ve todo su historial o solo lo vigente? | Jefe de Ingeniería | Baja | No | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0084 | Permisos de mantenimiento | SPEC-001:L65 (D11) | decision | high |
| EVD-2026-0086 | Anonimización sin borrar | SPEC-001:L68 (D14) | decision | high |
| EVD-2026-0088 | Código y auditoría no se anonimizan | SPEC-001:L70 (D16) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Parcial | Muestra lo que registran US-015 a US-022 |
| Negociable | Sí | Alcance de historial para el colaborador abierto |
| Valiosa | Sí | Visibilidad y transparencia |
| Estimable | Parcial | Q-05 puede agregar actores |
| Pequeña (Small) | Parcial | Dos actores; ver división |
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
- [ ] Una persona anonimizada no muestra PII en ninguna vigencia

## 17. Preparación y validación

- **Estado:** CONDITIONAL
- **Motivo:** la consulta del Jefe de Ingeniería y la propia del colaborador están sostenidas; Q-05 (P-08) bloquea la visibilidad para otros actores y del código de anonimizados.
- **Bloqueos de entrega:** US-015; US-022 para el colaborador.
- **Propuesta de división (si no es pequeña):** por actor: US-023a (Jefe de Ingeniería consulta cualquier ficha) y US-023b (el colaborador consulta la suya).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Responsable de producto responde Q-05; el Jefe de Ingeniería valida.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
