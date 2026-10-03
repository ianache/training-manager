---
id: FLW-030
type: User Flow
title: "FLW-030 — Desactivar y reactivar unidades organizacionales"
description: "Happy paths, bloqueos, permisos y estados para desactivar una unidad (eliminación lógica) y reactivarla bajo un padre Activo."
tags: [ux-ui, user-flow, party, estructura-organizacional, unidades, eliminacion-logica]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-03T15:00:00-05:00"
sources:
  - id: uxr-030
    resource: /knowledge-base/design/ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: us-030
    resource: /knowledge-base/requirement/user-stories/US-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
requirements: [US-030, UXR-030]
screens: [SCR-030-01, SCR-030-02, SCR-030-03, SCR-030-04]
---

# FLW-030 — Desactivar y reactivar unidades organizacionales

Familia: UXR-017 · UXR-028 · UXR-029 · UXR-030. Hereda UXR-000 (estados de interfaz, WCAG 2.2 AA). Este flujo identifica pasos y estados; el layout lo define `ui-spec-writer`.

## Trazabilidad

| Elemento | Referencia |
|---|---|
| Historia | US-030 (AC-1 a AC-4) |
| UX Requirement | UXR-030 (hereda UXR-000) |
| Reglas | BR-PTY-12, BR-PTY-17, BR-PTY-21, BR-PTY-23, BR-PTY-24 |
| Punto de entrada | Listado de unidades (UXR-028 / US-028); el flujo opera sobre una fila |
| Dependencias | US-029 (unidades existentes), US-028 (listado y filtro de estado) |

**Pantallas reservadas** (IDs reservados, sin especificar; cada SCR declarará `flow: FLW-030`):

| ID | Propósito en el flujo | Origen |
|---|---|---|
| SCR-030-01 | Confirmación de desactivación (consecuencia: no se borra, conserva historial, cierra vigencia) | UXR-030 §2-3, AC-1 |
| SCR-030-02 | Desactivación bloqueada (conteos de hijas activas y personas vigentes, acción de ir a resolverlas) | AC-2, BR-PTY-23 |
| SCR-030-03 | Reactivación (fecha desde y confirmación) | AC-3, BR-PTY-24 |
| SCR-030-04 | Reactivación bloqueada por padre Inactivo (enlace al padre) | AC-4, BR-PTY-24 |

La forma de presentación (diálogo, panel, página) no se decide aquí (ver FLW-030-Q1).

## Happy path

### Flujo 1: Desactivar una unidad Activa

**Actor:** Jefe de Ingeniería · **Precondición:** unidad Activa visible en el listado.

1. El Jefe abre el listado de unidades (UXR-028) y localiza una unidad Activa.
2. Selecciona "Desactivar" en su fila.
3. El sistema comprueba dependencias (unidades hijas activas, personas con pertenencia vigente).
4. Sin dependencias: SCR-030-01 explica que la unidad no se borra, conserva su historial y cierra su vigencia. Foco inicial en "Cancelar".
5. El Jefe confirma con "Desactivar".
6. El sistema cierra la vigencia, la unidad pasa a Inactiva y se registra la auditoría (quién, cuándo, valores; BR-PTY-12).
7. Éxito: confirmación visible, la fila refleja "Inactiva" (texto, no solo color), el foco vuelve a la fila y el cambio se anuncia a lectores de pantalla.

### Flujo 2: Reactivar una unidad Inactiva

**Actor:** Jefe de Ingeniería · **Precondición:** unidad Inactiva visible en el listado (filtro de estado de US-028, hipótesis H-2); su padre está Activo o no tiene padre.

1. El Jefe localiza la unidad Inactiva y selecciona "Reactivar".
2. SCR-030-03 solicita la fecha desde (hipótesis H-1 de US-030) y muestra vigencia anterior, unidad padre y su estado.
3. El Jefe indica la fecha y confirma.
4. El sistema abre una nueva vigencia, conserva la anterior en el historial y la unidad vuelve a Activa; se registra la auditoría.
5. Éxito: confirmación visible, la fila refleja "Activa", foco a la fila, anuncio a lectores de pantalla.

## Excepciones, permisos y estados

### Excepciones

| ID | Situación | Comportamiento | Pantalla | Fuente |
|---|---|---|---|---|
| E1 | Desactivar con hijas activas o personas vigentes | No se desactiva; se indica cuántas hijas activas y cuántas personas vigentes la impiden, con la acción de ir a resolverlas (hijas: UXR-029; personas: US-016). Mensaje con `role="alert"` | SCR-030-02 | AC-2, BR-PTY-23 |
| E2 | Reactivar con padre Inactivo | No se reactiva; se indica que primero debe reactivarse el padre, con enlace al padre | SCR-030-04 | AC-4, BR-PTY-24 |
| E3 | Cancelar la confirmación | Sin cambios; el foco retorna al disparador | SCR-030-01 / 03 | UXR-030 §6 |
| E4 | Unidad ya Inactiva | No se ofrece "Desactivar" | Listado | US-030 §6 |
| E5 | Error al guardar | Mensaje con reintento; el estado de la unidad no cambia | SCR-030-01 / 03 | UXR-000 |
| E6 | Borrar una unidad | No existe la acción; solo "Desactivar"/"Reactivar", nunca "Eliminar" ni "Borrar" | Todas | BR-PTY-12, BR-PTY-21 |

### Permisos

| Actor | Comportamiento | Fuente |
|---|---|---|
| Jefe de Ingeniería | Ve estado, conteos y acciones; desactiva y reactiva | BR-PTY-17 |
| Otros usuarios | No ven la estructura ni las acciones (acciones no visibles) | BR-PTY-17, EVD-2026-0142 |

### Estados

| Estado de la unidad | Acción ofrecida | Resultado |
|---|---|---|
| Activa | "Desactivar" | Inactiva, vigencia cerrada |
| Inactiva, padre Activo o sin padre | "Reactivar" | Activa, nueva vigencia |
| Inactiva, padre Inactivo | "Reactivar" lleva a bloqueo (ver FLW-030-Q4) | Sin cambio |

Estados de interfaz (UXR-030 §3): confirmación de desactivación, desactivación bloqueada, reactivación bloqueada, éxito, unidad ya Inactiva, sin permisos, error al guardar.

### Accesibilidad (UXR-030 §5-6)

Diálogos modales con foco atrapado y retorno al disparador; botones con nombre accesible que incluye el nombre de la unidad; estado Inactiva comunicado con texto; foco inicial en "Cancelar".

## Preguntas abiertas

Heredadas de UXR-030 (siguen abiertas, no se resuelven aquí): UXR-030-Q1 (nombres de personas en el bloqueo), UXR-030-Q2 (motivo de desactivación), UXR-030-Q3 (fecha desde por defecto y editable), UXR-030-Q4 (reubicación en lote).

Nuevas de este flujo:

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| FLW-030-Q1 | ¿Las confirmaciones y bloqueos se presentan como diálogos modales sobre el listado, o como pantallas/paneles propios? UXR-030 habla de diálogo para desactivar; no dice la forma de la reactivación. Condiciona si SCR-030-01 a 04 son cuatro pantallas o variantes de una. | Jefe de Ingeniería / UX | Media | No |
| FLW-030-Q2 | ¿Cuándo se calculan las dependencias: al abrir la acción (antes de confirmar) o al confirmar? ¿Y qué ocurre si cambian entre ambos momentos (otro cambio concurrente)? Hoy el flujo asume comprobación al abrir y revalidación al confirmar. | Jefe de Ingeniería / Arquitecto | Media | No |
| FLW-030-Q3 | La acción "ir a resolverlas" del bloqueo: ¿a qué destino lleva exactamente (listado de unidades hijas filtrado, ficha de personas de la unidad) y qué pantalla de US-016 sirve para reubicar personas? No hay pantalla de reubicación identificada. | Jefe de Ingeniería | Media | No |
| FLW-030-Q4 | Con padre Inactivo, ¿se muestra "Reactivar" habilitado y se bloquea al hacer clic (SCR-030-04), o se muestra deshabilitado con la explicación? UXR-030 describe el bloqueo con mensaje, no el estado del botón. | Jefe de Ingeniería / UX | Baja | No |
| FLW-030-Q5 | Reglas de la fecha desde de reactivación: ¿puede ser anterior a la fecha hasta de la vigencia anterior? ¿Puede ser futura? BR-PTY-12 no lo precisa (relacionada con UXR-030-Q3). | Jefe de Ingeniería | Media | No |
| FLW-030-Q6 | ¿Se avisa al Jefe del efecto de reactivar sobre las unidades hijas Inactivas (siguen Inactivas, se reactivan por separado)? La historia no lo dice. | Jefe de Ingeniería | Baja | No |
