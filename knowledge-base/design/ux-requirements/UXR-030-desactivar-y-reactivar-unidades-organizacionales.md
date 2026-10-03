---
type: UX Requirement
title: "UXR-030 — Desactivar y reactivar unidades organizacionales"
description: "Requisitos UX para desactivar una unidad (eliminación lógica) con confirmación y bloqueo por dependencias, y para reactivarla bajo un padre Activo."
tags: [ux-requirement, party, estructura-organizacional, unidades, eliminacion-logica]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-03T14:00:00-05:00"
sources:
  - id: us-030
    resource: /knowledge-base/requirement/user-stories/US-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# UXR-030 — Desactivar y reactivar unidades organizacionales

Familia: [UXR-017](UXR-017-registrar-la-organizacion-interna.md) · [UXR-028](UXR-028-listar-y-buscar-unidades-organizacionales.md) · [UXR-029](UXR-029-registrar-y-editar-unidades-organizacionales.md) · UXR-030. Hereda [UXR-000](UXR-000-requisitos-ux-transversales.md).

## 1. Actor y permisos

| Actor | Ve | Edita | Fuente |
|---|---|---|---|
| Jefe de Ingeniería | Estado, conteos y acciones de la unidad | Desactiva y reactiva | BR-PTY-17 |
| Otros usuarios | Nada | Nada | EVD-2026-0142 |

## 2. Flujos

**Desactivar:** listado (UXR-028) → fila de una unidad Activa → "Desactivar" → diálogo de confirmación que explica que la unidad no se borra, conserva su historial y cierra su vigencia → confirmar → la unidad pasa a Inactiva.

**Desactivación bloqueada:** si tiene unidades hijas activas o personas vigentes, el sistema no la realiza y el diálogo indica **cuántas** unidades hijas activas y **cuántas** personas vigentes la impiden, con la acción de ir a resolverlas (hijas en UXR-029; personas en US-016).

**Reactivar:** fila de una unidad Inactiva → "Reactivar" → fecha desde → confirmar → vuelve a Activa con una nueva vigencia. Si su padre está Inactivo, el sistema no lo permite e indica que primero debe reactivarse el padre, con enlace al padre.

## 3. Estados de la interfaz

| Estado | Comportamiento UX | Origen |
|---|---|---|
| Confirmación de desactivación | Diálogo modal con consecuencia y botones "Desactivar" / "Cancelar"; foco inicial en "Cancelar" | US-030 §10 |
| Desactivación bloqueada | Mensaje con conteos de hijas activas y personas vigentes | AC-2, BR-PTY-23 |
| Reactivación bloqueada | Mensaje: reactivar antes al padre Inactivo | AC-4, BR-PTY-24 |
| Éxito | Confirmación visible; la fila refleja el nuevo estado | AC-1, AC-3 |
| Unidad ya Inactiva | No se ofrece "Desactivar" | US-030 §6 |
| Sin permisos | Acciones no visibles | BR-PTY-17 |
| Error al guardar | Mensaje con reintento | UXR-000 |

## 4. Contenido clave y etiquetas

Estado actual, unidad padre y su estado, conteo de unidades hijas activas y de personas vigentes, vigencia anterior. Etiquetas: **"Desactivar"** y **"Reactivar"**; "Inactiva" para el estado. Nunca "Eliminar" o "Borrar": no describen la eliminación lógica (BR-PTY-21).

## 5. Criterios UX verificables

- [ ] El diálogo de desactivación declara que la unidad no se borra y que conserva su historial.
- [ ] El bloqueo muestra los conteos concretos, no un mensaje genérico.
- [ ] El estado Inactiva se comunica con texto además de color.
- [ ] Un clic accidental no desactiva: se exige confirmación y el foco inicial es "Cancelar".
- [ ] Tras confirmar, el foco vuelve a la fila afectada y el cambio se anuncia a lectores de pantalla.

## 6. Accesibilidad

WCAG 2.2 AA (UXR-000). Diálogo modal con `role="dialog"`, foco atrapado y retorno al disparador; mensajes de bloqueo con `role="alert"`; botones con nombre accesible que incluya el nombre de la unidad.

## 7. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| UXR-030-Q1 | En el bloqueo, ¿basta el conteo de personas o debe listarse cuáles son (nombre) para reubicarlas? Mostrar nombres expone datos de personas (BR-PTY-20 permite nombre y unidad al Jefe). | Jefe de Ingeniería | Media | No |
| UXR-030-Q2 | ¿La desactivación pide un motivo (campo de texto) para la auditoría? La historia solo exige quién, cuándo y valores. | Jefe de Ingeniería | Baja | No |
| UXR-030-Q3 | ¿La fecha desde de la reactivación es hoy por defecto y editable? Igual que UXR-029-Q2. | Jefe de Ingeniería | Baja | No |
| UXR-030-Q4 | ¿Se ofrece reubicar en lote las personas o unidades hijas que impiden desactivar? Hoy se resuelve una por una fuera de esta historia. | Jefe de Ingeniería | Baja | No |

## 8. Trazabilidad

- **Upstream:** US-030 → SPEC-001 C3 → BR-PTY-12, 17, 21, 23, 24; EVD-2026-0135, 0139.
- **Downstream (pendiente):** FLW → SCR → CMP → AC (`user-flow-designer`).
- **Verificación humana:** pendiente.
