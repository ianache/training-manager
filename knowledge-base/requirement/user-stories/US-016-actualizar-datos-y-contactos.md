---
type: User Story
title: "US-016 — Actualizar datos y medios de contacto"
description: "El Jefe de Ingeniería corrige los datos de una persona y cambia sus medios de contacto con vigencias; el colaborador actualiza por sí mismo solo sus perfiles profesionales y su teléfono laboral."
tags: [user-story, colaboradores, party, c2, contactos]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-09-27T11:45:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: rcp-002
    resource: /knowledge-base/requirement/context-packs/RCP-002-gestion-de-colaboradores.md
---

# US-016 — Actualizar datos y medios de contacto

## 1. Ficha

| Campo | Valor |
|---|---|
| ID | US-016 |
| Épica / capacidad | SPEC-001 C2 — Actualizar datos y medios de contacto (SPEC-001:L140) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md); de forma acotada, el [Colaborador](../../business/glossary/terms/TRM-0013-colaborador.md) (D11) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Should: mantiene la ficha correcta; no bloquea el alta |
| Estimación | |
| Dependencias | US-015 |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** corregir los datos de una persona y cambiar sus medios de contacto conservando el historial, **para** que la información maestra esté al día sin perder lo anterior.

## 3. Contexto y valor

- **Problema que resuelve:** los datos cambian (correo, teléfono, perfiles) y el historial debe conservarse (BR-PTY-12).
- **Valor esperado:** ficha correcta y trazable; el colaborador mantiene sus perfiles profesionales sin depender del Jefe de Ingeniería (D11).
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Corregir datos simples de la persona: nombres, apellidos, nombre preferido, identificaciones (SPEC-001:L113).
  - Cambiar medios de contacto (correo laboral, teléfono laboral, perfiles profesionales) cerrando la vigencia anterior y abriendo una nueva.
  - Que el colaborador actualice sus perfiles profesionales y su teléfono laboral.
- **Excluye:**
  - Roles, relaciones y asignaciones (US-017 a US-021).
  - Editar a una persona anonimizada (no se permite, BR-PTY-14).

## 5. Criterios de aceptación

### AC-1 — Corregir un dato simple

```gherkin
Escenario: Corregir el apellido
  Dado que soy el Jefe de Ingeniería y existe una persona registrada
  Cuando corrijo su apellido
  Entonces la persona queda con el apellido corregido y el cambio queda auditado con quién y cuándo
```

- **Regla / fuente:** SPEC-001:L113; BR-PTY-12

### AC-2 — Cambiar un medio de contacto con vigencia

```gherkin
Escenario: Cambiar el correo laboral
  Dado un colaborador con un correo laboral vigente
  Cuando el Jefe de Ingeniería registra un nuevo correo laboral
  Entonces el correo anterior queda con su vigencia cerrada y el nuevo queda vigente desde esa fecha
```

- **Regla / fuente:** BR-PTY-12; SPEC-001:L113

### AC-3 — El colaborador edita sus perfiles profesionales

```gherkin
Escenario: Agregar un perfil de GitHub
  Dado que soy un colaborador
  Cuando agrego a mi ficha un perfil profesional con su URL y la plataforma GitHub
  Entonces el perfil queda vigente en mi ficha
```

- **Regla / fuente:** BR-PTY-09, BR-PTY-17; D8, D11

### AC-4 — El colaborador edita su teléfono laboral

```gherkin
Escenario: Cambiar mi teléfono laboral
  Dado que soy un colaborador
  Cuando cambio mi teléfono laboral
  Entonces el anterior queda con su vigencia cerrada y el nuevo queda vigente
```

- **Regla / fuente:** BR-PTY-12, BR-PTY-17

### AC-5 — El colaborador no puede editar otros datos

```gherkin
Escenario: Intentar cambiar mi correo laboral
  Dado que soy un colaborador
  Cuando intento cambiar mi correo laboral, mis nombres o mi identificación
  Entonces el cambio no se permite
```

- **Regla / fuente:** BR-PTY-17

## 6. Casos negativos y límite

| Caso | Comportamiento esperado | Fuente o pregunta |
|---|---|---|
| Nuevo correo laboral ya usado por otro colaborador vigente | Se rechaza | BR-PTY-08 |
| Identificación corregida que duplica otra | Se rechaza | BR-PTY-07 |
| Contratista con correo que no es del proveedor | Sin regla operativa | US-015-Q1 |
| Dejar a un colaborador sin correo laboral vigente | Se rechaza: el correo laboral es obligatorio | BR-PTY-08 |
| Editar a una persona anonimizada | No se permite | BR-PTY-14; SPEC-001:L124 |
| Colaborador edita los datos de otra persona | No se permite | BR-PTY-17 |
| Plataforma del perfil fuera de la lista (LinkedIn, GitHub, Otro) | Se usa "Otro"; la lista es ampliable | BR-PTY-09 |
| URL de perfil inválida | Sin regla | US-016-Q1 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-07 | Identificación única | BRC-001 |
| BR-PTY-08 | Correo laboral obligatorio, único entre vigentes | BRC-001 |
| BR-PTY-09 | Medios de contacto y perfiles profesionales; no son evidencia de nivel | BRC-001 |
| BR-PTY-12 | No se sobrescribe: se cierra la vigencia; todo cambio auditado | BRC-001 |
| BR-PTY-14 | Una persona anonimizada no se edita | BRC-001 |
| BR-PTY-17 | Permisos de edición | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| Colaborador | Actor acotado (D11) | [TRM-0013](../../business/glossary/terms/TRM-0013-colaborador.md) |
| Medio de contacto, Perfil profesional en línea | Datos editados | Términos nuevos de SPEC-001 en curso (artefacto #3) |

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** contactos y perfiles son PII; los perfiles los ven la propia persona y los roles de gestión hasta resolver P-08 (SPEC-001:L132).
- **Otros:** auditoría de cada cambio (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** abrir la ficha → editar dato o medio de contacto → confirmar; el colaborador solo ve editables sus perfiles y su teléfono.
- **Estados de la interfaz:** éxito; duplicado; campo obligatorio vacío; sin permisos; persona anonimizada (solo lectura).
- **Contenido clave:** qué datos puede editar cada actor; historial de contactos anteriores.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** US-015; para el colaborador, US-022 (identidad de acceso) según la hipótesis H-04 de RCP-002.
- **Es prerrequisito de:** —
- **Supuestos:** ninguno.
- **Hipótesis del agente:** H-1: la corrección de datos simples (nombres, identificación) sobrescribe el valor con auditoría, sin vigencia (SPEC-001:L113 "los datos simples se corrigen").

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| US-016-Q1 | ¿Se valida el formato de la URL de un perfil profesional o del teléfono? | Jefe de Ingeniería | Baja | No | Abierta |
| Q-05 | ¿Quién ve los datos de otras personas, incluidos los perfiles? (P-08) | Responsable de producto | Alta | No (esta historia es de edición) | Abierta |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0081 | Perfiles profesionales como medio de contacto | SPEC-001:L62 (D8) | decision | high |
| EVD-2026-0084 | Permisos de edición | SPEC-001:L65 (D11) | decision | high |
| EVD-2026-0085 | Correo laboral por tipo | SPEC-001:L67 (D13) | decision | high |
| EVD-2026-0078 | Patrón Party con vigencias | SPEC-001:L59 (D5) | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-09-27T10:05:00-05:00`, `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | Solo requiere personas registradas (US-015) |
| Negociable | Sí | Validaciones de formato abiertas |
| Valiosa | Sí | Ficha actualizada y trazable |
| Estimable | Sí | Reglas claras |
| Pequeña (Small) | Parcial | Mezcla dos actores; ver división |
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
- [ ] El historial de medios de contacto conserva las vigencias cerradas

## 17. Preparación y validación

- **Estado:** READY
- **Motivo:** todos los criterios están sostenidos por BR-PTY-07 a 09, 12, 14 y 17; las preguntas abiertas no bloquean.
- **Bloqueos de entrega:** US-015.
- **Propuesta de división (si no es pequeña):** por actor: US-016a (Jefe de Ingeniería actualiza datos y contactos, AC-1, AC-2) y US-016b (el colaborador actualiza sus perfiles y teléfono, AC-3 a AC-5). Se mantiene unida porque SPEC-001 la define como una capacidad (C2).
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** el Jefe de Ingeniería valida la historia y decide si se divide.
- **Validación:** Pendiente · Responsable: Jefe de Ingeniería · Fecha: —
