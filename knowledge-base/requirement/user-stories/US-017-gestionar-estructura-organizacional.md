---
type: User Story
title: "US-017 — Gestionar la estructura organizacional"
description: "El Jefe de Ingeniería consulta, busca, registra, edita y desactiva las unidades organizacionales de COMSATEL y la jerarquía entre ellas, con vigencias."
tags: [user-story, colaboradores, party, c3, estructura-organizacional, unidades]
status: draft
generated:
  by: "af-user-story-refiner/2.0"
  at: "2026-10-03T12:00:00-05:00"
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
| Épica / capacidad | SPEC-001 C3 — Gestionar la estructura organizacional (SPEC-001:L147) |
| Horizonte / release | Por definir |
| Actor | [Jefe de Ingeniería](../../business/glossary/terms/TRM-0036-jefe-de-ingenieria.md) |
| Responsable de negocio (PO) | Jefe de Ingeniería |
| Prioridad | Must: el alta de empleados necesita la organización interna y sus unidades (US-015) |
| Estimación | |
| Dependencias | — |
| Preparación | READY |

## 2. Historia

**Como** Jefe de Ingeniería, **quiero** consultar, buscar, registrar, editar y desactivar las unidades organizacionales de COMSATEL y la jerarquía entre ellas, **para** mantener al día la estructura donde se ubica a cada colaborador.

## 3. Contexto y valor

- **Problema que resuelve:** la pertenencia de las personas a unidades y la estructura entre unidades no tenían dónde registrarse ni mantenerse (SPEC-001:L35).
- **Valor esperado:** estructura vigente e histórica de COMSATEL disponible, fácil de ubicar y de mantener, para altas y consultas.
- **Métrica o KPI que impacta:** Sin métrica asociada.

## 4. Alcance

- **Incluye:**
  - Registrar la organización interna ([COMSATEL](../../business/glossary/terms/TRM-0015-comsatel.md)) con su razón social y su RUC.
  - **Listar** las unidades organizacionales con su unidad padre, estado (Activa / Inactiva) y vigencia, por defecto las Activas.
  - **Buscar** por nombre, **filtrar** por estado y por unidad padre (con sus descendientes), **ordenar** por columnas y alternar entre lista y jerarquía.
  - **Registrar** una unidad con su unidad padre y fecha desde.
  - **Editar** el nombre de una unidad y **cambiar su unidad padre**, cerrando la vigencia de la relación anterior.
  - **Desactivar** una unidad (eliminación lógica) y **reactivarla** bajo un padre Activo.
- **Excluye:**
  - La pertenencia de una persona a una unidad (US-015 y US-016).
  - Borrar físicamente una unidad.
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

### AC-2 — Listar las unidades

```gherkin
Escenario: Ver las unidades activas
  Dado que existen unidades Activas e Inactivas
  Cuando abro la gestión de la estructura organizacional
  Entonces veo las unidades Activas, cada una con su nombre, unidad padre, estado y vigencia desde
```

- **Regla / fuente:** BR-PTY-04, BR-PTY-21; EVD-2026-0133

### AC-3 — Buscar por nombre

```gherkin
Escenario: Buscar una unidad
  Dado que existen varias unidades
  Cuando escribo parte del nombre de una unidad en la búsqueda
  Entonces solo veo las unidades cuyo nombre contiene ese texto
```

- **Regla / fuente:** EVD-2026-0133

### AC-4 — Filtrar por estado

```gherkin
Escenario: Ver las unidades inactivas
  Dado que existen unidades Activas e Inactivas
  Cuando filtro por estado Inactiva
  Entonces veo solo las unidades Inactivas, con su vigencia hasta
```

- **Regla / fuente:** BR-PTY-21; EVD-2026-0133

### AC-5 — Filtrar por unidad padre

```gherkin
Escenario: Ver las unidades de una rama
  Dado una unidad con unidades hijas y descendientes
  Cuando filtro por esa unidad padre
  Entonces veo sus unidades hijas y todas sus descendientes que cumplen los demás filtros
```

- **Regla / fuente:** BR-PTY-04; EVD-2026-0133

### AC-6 — Ordenar el listado

```gherkin
Escenario: Ordenar por una columna
  Dado el listado de unidades
  Cuando ordeno por nombre, unidad padre, estado o vigencia desde, en sentido ascendente o descendente
  Entonces las unidades se muestran en ese orden y se conservan los filtros aplicados
```

- **Regla / fuente:** EVD-2026-0133

### AC-7 — Ver la jerarquía

```gherkin
Escenario: Alternar a la vista jerárquica
  Dado el listado de unidades
  Cuando cambio a la vista jerárquica
  Entonces veo cada unidad bajo su unidad padre vigente
```

- **Regla / fuente:** BR-PTY-04; EVD-2026-0133

### AC-8 — Registrar una unidad y su padre

```gherkin
Escenario: Crear una unidad dentro de otra
  Dado una unidad organizacional Activa existente
  Cuando registro una nueva unidad y la relaciono con la existente como su unidad padre, con fecha desde
  Entonces la nueva unidad queda Activa en la jerarquía con esa relación vigente
```

- **Regla / fuente:** BR-PTY-03, BR-PTY-04, BR-PTY-21

### AC-9 — Editar el nombre de una unidad

```gherkin
Escenario: Corregir el nombre
  Dado una unidad existente
  Cuando cambio su nombre y confirmo
  Entonces la unidad muestra el nuevo nombre y el cambio queda auditado con el valor anterior
```

- **Regla / fuente:** BR-PTY-12

### AC-10 — Cambiar la unidad padre

```gherkin
Escenario: Mover una unidad
  Dado una unidad con una relación de estructura vigente con su unidad padre
  Cuando la relaciono con otra unidad padre
  Entonces la relación anterior queda con su vigencia cerrada y la nueva queda vigente
```

- **Regla / fuente:** BR-PTY-12

### AC-11 — Rechazar un ciclo

```gherkin
Escenario: Mover una unidad bajo una de sus descendientes
  Dado una unidad A con una unidad hija B
  Cuando intento relacionar A con B como su unidad padre
  Entonces el cambio se rechaza y se indica que crearía un ciclo en la jerarquía
```

- **Regla / fuente:** BR-PTY-22

### AC-12 — Desactivar una unidad

```gherkin
Escenario: Desactivar una unidad sin dependencias
  Dado una unidad Activa sin unidades hijas activas ni personas con pertenencia vigente
  Cuando la desactivo y confirmo
  Entonces la unidad queda Inactiva con su vigencia cerrada y no se borra
```

- **Regla / fuente:** BR-PTY-12, BR-PTY-21

### AC-13 — Bloquear la desactivación con dependencias

```gherkin
Escenario: Desactivar una unidad con unidades hijas activas o personas vigentes
  Dado una unidad Activa con unidades hijas activas o personas con pertenencia vigente
  Cuando intento desactivarla
  Entonces la desactivación no se realiza y se indica cuántas unidades hijas activas y personas vigentes la impiden
```

- **Regla / fuente:** BR-PTY-23

### AC-14 — Reactivar una unidad

```gherkin
Escenario: Reactivar una unidad inactiva
  Dado una unidad Inactiva
  Y su unidad padre está Activa, o la unidad no tiene padre
  Cuando la reactivo con una fecha desde
  Entonces la unidad queda Activa con una nueva vigencia y el historial conserva la vigencia anterior
```

- **Regla / fuente:** BR-PTY-12, BR-PTY-24

### AC-15 — Reactivar bajo un padre Inactivo

```gherkin
Escenario: Rechazar reactivar una unidad cuyo padre está Inactivo
  Dado una unidad Inactiva cuya unidad padre está Inactiva
  Cuando intento reactivarla
  Entonces la reactivación no se realiza y se indica que primero debe reactivarse su unidad padre
```

- **Regla / fuente:** BR-PTY-24

### AC-16 — Elegir un padre Inactivo

```gherkin
Escenario: Solo se ofrecen unidades Activas como padre
  Dado unidades Activas e Inactivas
  Cuando elijo la unidad padre al registrar o mover una unidad
  Entonces solo puedo elegir unidades Activas y se rechaza una unidad Inactiva
```

- **Regla / fuente:** BR-PTY-25

### AC-17 — Nombre repetido entre hermanas

```gherkin
Escenario: Rechazar un nombre ya usado bajo el mismo padre
  Dado una unidad padre con una unidad hija llamada Soporte
  Cuando registro o renombro otra unidad bajo el mismo padre como Soporte
  Entonces el cambio no se completa y se indica que el nombre ya existe bajo ese padre
```

- **Regla / fuente:** BR-PTY-26

### AC-18 — RUC repetido

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
| Borrar una unidad | No existe el borrado: solo se desactiva, cerrando la vigencia | BR-PTY-12, BR-PTY-21 |
| Unidad que queda como padre de sí misma o ciclo en la jerarquía | Se rechaza | BR-PTY-22 |
| Desactivar una unidad con unidades hijas activas o personas vigentes | No se desactiva; se informa qué la impide | BR-PTY-23 |
| Elegir como padre una unidad Inactiva | Se rechaza | BR-PTY-25 |
| Reactivar una unidad cuyo padre está Inactivo | Se rechaza; primero se reactiva el padre | BR-PTY-24 |
| Nombre de unidad repetido bajo el mismo padre | Se rechaza; el mismo nombre bajo otro padre se permite | BR-PTY-26 |
| Identificación de persona (DNI) en una organización | Se rechaza: las organizaciones usan RUC | BR-PTY-07 |
| Usuario que no es Jefe de Ingeniería | No puede gestionar la estructura | BR-PTY-17 |
| Consulta de la estructura por otros colaboradores | No puede: solo el Jefe de Ingeniería la consulta y gestiona (ven solo la unidad de cada persona, BR-PTY-20) | BR-PTY-17 |

## 7. Reglas de negocio aplicables

| ID | Regla | Fuente |
|---|---|---|
| BR-PTY-02 | Parte = Persona u Organización, con vigencias | BRC-001 |
| BR-PTY-03 | Roles Organización interna y Unidad organizacional | BRC-001 |
| BR-PTY-04 | Relación de estructura unidad ↔ unidad padre | BRC-001 |
| BR-PTY-07 | RUC para organizaciones, único | BRC-001 |
| BR-PTY-12 | Vigencias y auditoría: no se borra, se cierra la vigencia | BRC-001 |
| BR-PTY-17 | Permiso del Jefe de Ingeniería (incluye consultar la estructura) | BRC-001 |
| BR-PTY-21 | Unidad Activa / Inactiva según su vigencia; desactivar = eliminación lógica | BRC-001 |
| BR-PTY-22 | Sin ciclos en la jerarquía | BRC-001 |
| BR-PTY-23 | No se desactiva con unidades hijas activas ni personas vigentes | BRC-001 |
| BR-PTY-24 | Reactivar abre nueva vigencia, solo bajo un padre Activo | BRC-001 |
| BR-PTY-25 | Solo una unidad Activa puede ser padre | BRC-001 |
| BR-PTY-26 | Nombre único entre unidades con el mismo padre | BRC-001 |

## 8. Datos y términos

| Término | Uso en esta historia | Glosario |
|---|---|---|
| COMSATEL | Organización interna | [TRM-0015](../../business/glossary/terms/TRM-0015-comsatel.md) |
| Organización | Parte con RUC | [TRM-0072](../../business/glossary/terms/TRM-0072-organizacion.md) |
| Organización interna | Rol de COMSATEL | [TRM-0078](../../business/glossary/terms/TRM-0078-organizacion-interna.md) |
| Unidad organizacional | Objeto gestionado; Activa / Inactiva | [TRM-0079](../../business/glossary/terms/TRM-0079-unidad-organizacional.md) |
| Relación entre partes | Estructura (unidad ↔ unidad padre) | [TRM-0074](../../business/glossary/terms/TRM-0074-relacion-entre-partes.md) |
| Vigencia | Desde / hasta de rol y relación | [TRM-0092](../../business/glossary/terms/TRM-0092-vigencia.md) |

Datos de una unidad: nombre, unidad padre (vacía en la unidad superior), estado, vigencia desde y hasta, y los conteos de unidades hijas activas y personas vigentes (para explicar el bloqueo de BR-PTY-23). Una unidad no tiene RUC (H-1).

## 9. Requisitos no funcionales

- **Accesibilidad:** WCAG 2.2 AA (estándar del repositorio).
- **Privacidad y datos personales:** No aplica (datos de organizaciones; los conteos de personas no identifican a nadie).
- **Otros:** auditoría de cambios (BR-PTY-12).

## 10. Consideraciones de UX

- **Flujo esperado:** abrir la gestión → ver las unidades Activas → buscar, filtrar y ordenar, o alternar a la jerarquía → registrar una unidad, editarla, cambiar su padre, desactivarla o reactivarla → confirmar. Desactivar pide confirmación.
- **Estados de la interfaz:** sin organización interna (vacío inicial); sin unidades registradas; sin resultados para los filtros aplicados; éxito; RUC duplicado; ciclo, nombre duplicado y padre Inactivo rechazados; desactivación y reactivación bloqueadas con el detalle de lo que la impide; sin permisos; error al guardar.
- **Contenido clave:** por unidad, nombre, unidad padre, estado, vigencia desde/hasta, unidades hijas activas y personas vigentes; filtros activos visibles, con estado Activa por defecto; historial de relaciones y vigencias de la unidad.

## 11. Dependencias, supuestos e hipótesis

- **Depende de:** —
- **Es prerrequisito de:** US-015.
- **Supuestos:** ninguno.
- **Hipótesis del agente:**
  - H-1: una unidad organizacional no necesita RUC (SPEC-001:L109 "RUC si aplica").
  - H-3: la unidad superior se registra sin unidad padre (IMD-002 R-08, inferencia).
  - H-4: el cambio de nombre se audita con su valor anterior, por la regla general de auditoría de BR-PTY-12.

## 12. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea | Estado |
|---|---|---|---|---|---|
| US-017-Q1 | ¿Se impiden los ciclos en la jerarquía de unidades? | Jefe de Ingeniería | Baja | No | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): sí, se rechazan (BR-PTY-22, EVD-2026-0134) |
| US-017-Q2 | ¿Se puede cerrar una unidad que tiene personas o unidades hijas vigentes? | Jefe de Ingeniería | Media | No | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): no, se bloquea (BR-PTY-23, EVD-2026-0135) |
| US-017-Q3 | ¿Se puede reactivar una unidad Inactiva? ¿Con qué unidad padre si la anterior está Inactiva? | Jefe de Ingeniería | Media | No | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): sí, bajo un padre Activo; antes se reactiva el padre (BR-PTY-24, EVD-2026-0139) |
| US-017-Q4 | ¿El nombre de una unidad debe ser único? | Jefe de Ingeniería | Baja | No | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): único entre unidades con el mismo padre (BR-PTY-26, EVD-2026-0140) |
| US-017-Q5 | ¿Puede elegirse como padre una unidad Inactiva? | Jefe de Ingeniería | Baja | No | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): no (BR-PTY-25, EVD-2026-0141) |
| US-017-Q6 | ¿Pueden los demás colaboradores consultar la estructura en solo lectura? | Jefe de Ingeniería | Media | No | Respondida (ianache (Jefe de Ingeniería), 2026-10-03): no, solo el Jefe de Ingeniería (BR-PTY-17, EVD-2026-0142) |

## 13. Evidencia y trazabilidad

| ID | Hallazgo | Fuente | Clasificación | Confianza |
|---|---|---|---|---|
| EVD-2026-0078 | Patrón Party: roles y relaciones con vigencia | SPEC-001:L59, L86-L88 (D5) | decision | high |
| EVD-2026-0083 | RUC para organizaciones | SPEC-001:L64 (D10) | decision | high |
| EVD-2026-0084 | El Jefe de Ingeniería mantiene la información | SPEC-001:L65 (D11) | decision | high |
| EVD-2026-0133 | Gestión de unidades con listado (filtros y orden), alta, edición y eliminación lógica | Decisión humana: ianache (Jefe de Ingeniería), 2026-10-03 | decision | high |
| EVD-2026-0134 | Se rechazan los ciclos en la jerarquía | Decisión humana: ianache, 2026-10-03, US-017-Q1 | decision | high |
| EVD-2026-0135 | No se desactiva una unidad con hijas activas o personas vigentes | Decisión humana: ianache, 2026-10-03, US-017-Q2 | decision | high |
| EVD-2026-0139 | Reactivar solo bajo un padre Activo | Decisión humana: ianache, 2026-10-03, US-017-Q3 | decision | high |
| EVD-2026-0140 | Nombre único entre unidades con el mismo padre | Decisión humana: ianache, 2026-10-03, US-017-Q4 | decision | high |
| EVD-2026-0141 | Solo una unidad Activa puede ser padre | Decisión humana: ianache, 2026-10-03, US-017-Q5 | decision | high |
| EVD-2026-0142 | La estructura la consulta y gestiona solo el Jefe de Ingeniería | Decisión humana: ianache, 2026-10-03, US-017-Q6 | decision | high |

Evidencia compartida: `source_type: human`, `observed_at: 2026-10-03T10:00:00-05:00` (EVD-0133 a 0135 y 0139 a 0142; las demás, 2026-09-27T10:05:00-05:00), `freshness: current`, `owner: Jefe de Ingeniería`.

- **Upstream:** SPEC-001, BRC-001, [RCP-002](../context-packs/RCP-002-gestion-de-colaboradores.md)
- **Downstream (pendiente):** UXR → FLW → SCR → CMP → AC

## 14. Evaluación INVEST

| Criterio | ¿Cumple? | Justificación |
|---|---|---|
| Independiente | Sí | No depende de otra historia |
| Negociable | Sí | Sin preguntas abiertas; los criterios de borde se pueden renegociar con el PO |
| Valiosa | Sí | Necesaria para el alta y el mantenimiento de la estructura |
| Estimable | Sí | Reglas claras; ver división propuesta |
| Pequeña (Small) | Parcial | 18 criterios; ver división propuesta en la sección 17 |
| Testeable | Sí | Criterios verificables |

## 15. Definition of Ready

- [x] El actor y el valor están sostenidos por una fuente
- [x] Los criterios de aceptación son verificables y citan su regla o fuente
- [x] Los casos negativos y límite tienen comportamiento o pregunta asignada
- [x] No hay preguntas abiertas que bloqueen
- [x] Las dependencias están identificadas
- [x] Los términos de negocio están en el glosario, o tienen una pregunta para el glosario
- [x] El PO validó la historia

## 16. Definition of Done (funcional)

- [ ] Todos los criterios de aceptación pasan sus pruebas de aceptación
- [ ] Los casos negativos y límite están cubiertos por pruebas
- [ ] La accesibilidad WCAG 2.2 AA está revisada
- [ ] Los requisitos de privacidad se cumplen
- [ ] El PO aceptó la historia en la revisión

## 17. Preparación y validación

- **Estado:** READY
- **Motivo:** el actor y el valor están sostenidos; los criterios se apoyan en BR-PTY-02 a 04, 07, 12, 17 y 21 a 26 y en la decisión EVD-2026-0133; no quedan preguntas abiertas.
- **Bloqueos de entrega:** Ninguno.
- **Propuesta de división (si no es pequeña):** si el equipo la considera grande, dividir por paso del flujo: (a) organización interna (AC-1, AC-18); (b) consulta del listado (AC-2 a AC-7); (c) alta y edición (AC-8 a AC-11, AC-16, AC-17); (d) desactivar y reactivar (AC-12 a AC-15). Es una recomendación; decide el PO. Se mantiene un solo ID para conservar la trazabilidad con US-015.
- **Siguiente rol o Skill:** `ux-requirements-analyzer`.
- **Decisión humana requerida:** Ninguna.
- **Validación:** Validada por ianache (Jefe de Ingeniería) · Fecha: 2026-10-03. El estado del archivo sigue en `draft`: la verificación (`verified`) la asigna un flujo humano.
