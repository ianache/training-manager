---
type: UX Requirement
title: "UXR-029 — Registrar y editar unidades organizacionales"
description: "Requisitos UX para registrar unidades, editar su nombre y cambiar su unidad padre, con validación de ciclos, padres Inactivos y nombres repetidos."
tags: [ux-requirement, party, estructura-organizacional, unidades, formulario]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-03T14:00:00-05:00"
sources:
  - id: us-029
    resource: /knowledge-base/requirement/user-stories/US-029-registrar-y-editar-unidades-organizacionales.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# UXR-029 — Registrar y editar unidades organizacionales

Familia: [UXR-017](UXR-017-registrar-la-organizacion-interna.md) · [UXR-028](UXR-028-listar-y-buscar-unidades-organizacionales.md) · UXR-029 · [UXR-030](UXR-030-desactivar-y-reactivar-unidades-organizacionales.md). Hereda [UXR-000](UXR-000-requisitos-ux-transversales.md).

## 1. Actor y permisos

| Actor | Ve | Edita | Fuente |
|---|---|---|---|
| Jefe de Ingeniería | Formulario y selector de unidad padre | Registra unidades, edita nombre, cambia unidad padre | BR-PTY-17 |
| Otros usuarios | Nada | Nada | EVD-2026-0142 |

## 2. Flujos

**Registrar:** desde el listado (UXR-028) → "Registrar unidad" → nombre, unidad padre (solo Activas; vacía para la unidad superior) y fecha desde → confirmar → la unidad queda Activa.

**Editar nombre:** fila → editar → cambiar nombre → confirmar; el cambio queda auditado con el valor anterior.

**Cambiar unidad padre:** fila → cambiar unidad padre → elegir nueva unidad (Activas, sin la propia ni sus descendientes) → confirmar; la relación anterior cierra su vigencia y se abre la nueva. Se muestra un resumen "de X a Y" antes de confirmar.

## 3. Campos y validaciones

| Campo | Obligatorio | Regla | Mensaje (propuesto) |
|---|---|---|---|
| Nombre | Sí | Único entre unidades con el mismo padre (BR-PTY-26) | "Ya existe una unidad con este nombre bajo [padre]" |
| Correo laboral | Sí | Formato de correo (BR-PTY-27, EVD-2026-0239) | "Ingrese un correo válido" (propuesto) |
| Unidad padre | Sí, salvo la unidad superior (H-2) | Solo Activas (BR-PTY-25); sin ciclos (BR-PTY-22) | "Solo se pueden elegir unidades activas" / "Crearía un ciclo en la jerarquía" |
| Fecha desde | Sí | Vigencia de la relación (BR-PTY-12) | "Indica la fecha desde" |

El selector de padre **no ofrece** la propia unidad ni sus descendientes ni unidades Inactivas; la validación del servidor se mantiene como respaldo y su mensaje se muestra si ocurre.

## 4. Estados de la interfaz

| Estado | Comportamiento UX |
|---|---|
| Sin organización interna | Impide registrar y remite a UXR-017 |
| Éxito | Confirmación visible y retorno al listado con la unidad resaltada |
| Ciclo / padre Inactivo / nombre duplicado | Error asociado al campo; se conservan los datos |
| Campo obligatorio vacío | Error en línea al salir del campo y al enviar |
| Sin permisos | Acciones no visibles; acceso no autorizado |
| Error al guardar | Mensaje con reintento sin perder lo ingresado |
| Cambios sin guardar | Aviso al salir del formulario con cambios |

## 5. Contenido clave

Nombre, unidad padre, fecha desde, e historial de relaciones y vigencias de la unidad (de qué padre a cuál, desde/hasta, quién cambió). Etiquetas: "Unidad padre", "Unidad organizacional", "Vigencia" (TRM-0079, TRM-0092).

## 6. Criterios UX verificables

- [ ] El selector de padre excluye a la propia unidad, sus descendientes y las Inactivas.
- [ ] Cada error de regla se asocia a su campo y se anuncia con `role="alert"`.
- [ ] Cambiar el padre muestra un resumen antes de confirmar y el historial lo refleja después.
- [ ] No existe ninguna acción "Eliminar" en el formulario ni en la fila (solo desactivar, UXR-030).
- [ ] El formulario completo es operable por teclado y el foco vuelve a un punto lógico tras guardar.

## 7. Accesibilidad

WCAG 2.2 AA (UXR-000). Etiquetas ligadas, selector de padre accesible por teclado con búsqueda, mensajes de error no solo por color, foco visible.

## 8. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| UXR-029-Q1 | ¿Cuál es la longitud máxima y los caracteres permitidos en el nombre de una unidad? | Jefe de Ingeniería | Baja | No |
| UXR-029-Q2 | ¿La fecha desde puede ser pasada o futura, o solo hoy? Lo mismo para el cambio de padre. | Jefe de Ingeniería | Media | No |
| UXR-029-Q3 | ¿El nombre repetido se compara sin distinguir mayúsculas y acentos? | Jefe de Ingeniería | Baja | No |
| UXR-029-Q4 | ¿Se registra solo nombre y padre, o la unidad lleva más datos (código, descripción, responsable)? Las historias no los piden; no se agregan. | Jefe de Ingeniería | Media | No |
| UXR-029-Q5 | ¿Cómo se registra la unidad superior (sin padre)? Hipótesis H-2 de US-029, no confirmada. | Jefe de Ingeniería | Media | No |

## 9. Trazabilidad

- **Upstream:** US-029 → SPEC-001 C3 → BR-PTY-03, 04, 12, 17, 21, 22, 25, 26; EVD-2026-0134, 0140, 0141.
- **Downstream (pendiente):** FLW → SCR → CMP → AC (`user-flow-designer`).
- **Verificación humana:** pendiente.
