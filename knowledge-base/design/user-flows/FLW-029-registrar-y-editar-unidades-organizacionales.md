---
id: FLW-029
type: User Flow
title: "FLW-029 — Registrar y editar unidades organizacionales"
description: "Happy paths, excepciones, permisos y estados para registrar una unidad, editar su nombre, cambiar su unidad padre y consultar su historial de relaciones."
tags: [user-flow, party, estructura-organizacional, unidades, vigencia, permissions]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-03T15:00:00-05:00"
sources:
  - id: uxr-029
    resource: /knowledge-base/design/ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md
  - id: us-029
    resource: /knowledge-base/requirement/user-stories/US-029-registrar-y-editar-unidades-organizacionales.md
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
  - id: uxr-017
    resource: /knowledge-base/design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md
requirements: [US-029, UXR-029]
screens: [SCR-029-01, SCR-029-02, SCR-029-03, SCR-029-04]
---

# FLW-029 — Registrar y editar unidades organizacionales

Hereda [UXR-000](../ux-requirements/UXR-000-requisitos-ux-transversales.md) y la familia [UXR-017](../ux-requirements/UXR-017-registrar-la-organizacion-interna.md) (UXR-028 listado, UXR-030 desactivar/reactivar). El flujo identifica pasos y estados; el layout lo define `ui-spec-writer`.

## Trazabilidad

| Elemento | Referencia |
|---|---|
| Historia | US-029 (AC-1 a AC-6) |
| UX Requirement | UXR-029 |
| Reglas | BR-PTY-03, 04, 12, 17, 21, 22, 25, 26 |
| Evidencia | EVD-2026-0134, 0140, 0141 |
| Puntos de entrada/salida | Listado de unidades (UXR-028); su pantalla no se reserva aquí |
| Fuera de alcance | Listado y búsqueda (US-028); desactivar/reactivar (US-030); pertenencia de personas (US-015/016) |

**Pantallas reservadas** (se especifican en `ui-spec-writer`; cada una declarará `flow: FLW-029`):

| ID | Paso del flujo que cubre |
|---|---|
| SCR-029-01 | Registrar unidad (nombre, correo laboral, unidad padre, fecha desde) |
| SCR-029-02 | Editar nombre de una unidad |
| SCR-029-03 | Cambiar unidad padre, incluido el resumen "de X a Y" previo a confirmar |
| SCR-029-04 | Historial de relaciones y vigencias de la unidad (quién cambió, desde/hasta) |

## Happy path

### Flow 1: Registrar una unidad (AC-1)

**Actor:** Jefe de Ingeniería · **Precondición:** organización interna registrada (US-017).

1. Desde el listado (UXR-028) elige "Registrar unidad" → SCR-029-01.
2. Ingresa nombre y correo laboral (obligatorio, BR-PTY-27), elige unidad padre (solo Activas; vacía para la unidad superior, ver Q4) e indica fecha desde.
3. Valida: campos obligatorios en línea al salir del campo y al enviar; nombre único entre hermanas (BR-PTY-26) y formato del correo laboral.
4. Confirma → la unidad queda Activa con su relación vigente.
5. Confirmación visible y retorno al listado con la unidad resaltada; el foco vuelve a un punto lógico.

### Flow 2: Editar el nombre (AC-2)

1. Desde la fila del listado elige "Editar" → SCR-029-02.
2. Cambia el nombre y confirma; se valida unicidad entre hermanas.
3. La unidad muestra el nuevo nombre; el cambio queda auditado con el valor anterior (BR-PTY-12, H-3 de US-029).
4. Retorno al listado con la unidad resaltada.

### Flow 3: Cambiar la unidad padre (AC-3)

1. Desde la fila elige "Cambiar unidad padre" → SCR-029-03.
2. El selector ofrece solo unidades Activas, sin la propia ni sus descendientes; con búsqueda y operable por teclado.
3. Indica fecha desde de la nueva relación (ver Q2).
4. Se muestra el resumen "de X a Y" antes de confirmar.
5. Confirma → la relación anterior cierra su vigencia y se abre la nueva.
6. Retorno al listado con la unidad resaltada; el historial (SCR-029-04) refleja el cambio.

### Flow 4: Consultar historial de relaciones

1. Desde la unidad (punto de acceso exacto sin definir, ver Q6) abre el historial → SCR-029-04.
2. Ve de qué padre a cuál, desde/hasta y quién cambió.
3. Sin cambios registrados: estado vacío (comportamiento propuesto, no fuente).

## Excepciones, permisos y estados

### Excepciones

| ID | Situación | Comportamiento | Fuente |
|---|---|---|---|
| E1 | Ciclo (unidad bajo una descendiente o sí misma) | El selector no la ofrece; si el servidor la rechaza, error en el campo "Unidad padre": "Crearía un ciclo en la jerarquía"; se conservan los datos | BR-PTY-22, AC-4 |
| E2 | Padre Inactivo | El selector no lo ofrece; si el servidor lo rechaza: "Solo se pueden elegir unidades activas" | BR-PTY-25, AC-5 |
| E3 | Nombre repetido bajo el mismo padre | Error en "Nombre": "Ya existe una unidad con este nombre bajo [padre]"; el mismo nombre bajo otro padre se permite | BR-PTY-26, AC-6 |
| E3b | Correo laboral vacío o con formato inválido | Error en «Correo laboral» al salir del campo y al enviar: «Ingrese un correo válido» (texto propuesto) | BR-PTY-27 |
| E4 | Campo obligatorio vacío | Error en línea al salir del campo y al enviar ("Indica la fecha desde") | UXR-029 §3 |
| E5 | Sin organización interna | Impide registrar y remite a UXR-017 | BR-PTY-03 |
| E6 | Error al guardar | Mensaje con reintento sin perder lo ingresado | UXR-029 §4 |
| E7 | Salir con cambios sin guardar | Aviso al abandonar el formulario | UXR-029 §4 |
| E8 | Sin permisos | Acciones no visibles; acceso directo no autorizado | BR-PTY-17 |
| E9 | Intento de borrar | No existe acción "Eliminar" en formulario ni fila (solo desactivar, UXR-030) | BR-PTY-12, 21 |

Los errores de regla se asocian a su campo y se anuncian con `role="alert"` (UXR-029 §6).

### Permisos

| Actor | Ve | Hace |
|---|---|---|
| Jefe de Ingeniería y ADMIN | Formularios, selector de padre, historial | Registrar, editar nombre, cambiar padre (BR-PTY-17, EVD-2026-0238) |
| Otros usuarios | Nada | Nada |

### Estados de la unidad y de la relación

- Unidad: Activa / Inactiva según vigencia (BR-PTY-21); este flujo solo crea unidades Activas.
- Relación de estructura: vigente (sin hasta) / histórica (vigencia cerrada) (BR-PTY-12).
- Auditoría: nombre anterior, relación anterior y quién cambió.

### Estados de la interfaz

Sin organización interna · éxito (confirmación + resaltado) · error de regla por campo · campo obligatorio vacío · sin permisos · error al guardar · cambios sin guardar · historial vacío.

### Accesibilidad (UXR-000 / UXR-029 §7)

WCAG 2.2 AA; etiquetas ligadas; selector de padre por teclado con búsqueda; errores no solo por color; foco visible y foco lógico tras guardar.

## Preguntas abiertas

Heredadas de UXR-029 (siguen abiertas, no se resuelven aquí): Q1 longitud y caracteres del nombre; Q2 fecha desde pasada/futura/hoy (registro y cambio de padre); Q3 comparación de nombre sin distinguir mayúsculas/acentos; Q4 más datos de la unidad (código, descripción, responsable); Q5 cómo se registra la unidad superior.

Nuevas de este flujo:

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| FLW-029-Q1 | ¿Registrar y editar nombre son pantallas distintas o un mismo formulario? Las historias no lo fijan; se reservaron SCR-029-01 y 02 por separado. | Jefe de Ingeniería | Baja | No |
| FLW-029-Q2 | ¿La edición de nombre pide fecha desde o motivo? UXR-029 solo la exige al registrar y cambiar padre. | Jefe de Ingeniería | Baja | No |
| FLW-029-Q3 | ¿Cambiar el padre de una unidad Inactiva está permitido? Las historias no lo cubren (relacionado con US-030). | Jefe de Ingeniería | Media | No |
| FLW-029-Q4 | ¿Se puede registrar o mover una unidad cuando ya existe otra unidad superior (sin padre)? Depende de UXR-029-Q5. | Jefe de Ingeniería | Media | No |
| FLW-029-Q5 | ¿Qué se muestra en el resumen "de X a Y" además de los nombres de los padres (fecha, número de descendientes afectadas)? | Jefe de Ingeniería | Baja | No |
| FLW-029-Q6 | ¿Desde dónde se accede al historial de relaciones (pestaña, panel, enlace en la fila)? Hoy no hay fuente. | Jefe de Ingeniería | Baja | No |
| FLW-029-Q7 | ¿Qué sucede si, al confirmar, otro usuario ya modificó la unidad o su padre (concurrencia)? | Jefe de Ingeniería | Baja | No |

## Definition of Done

- Lineage US-029 → UXR-029 → FLW-029 resoluble; `screens` presente (IDs reservados, sin especificar).
- Cuatro happy paths, excepciones, permisos y estados explícitos; vacíos como preguntas abiertas.
- Estado `draft`; la verificación humana (`verified`) queda pendiente.
- Listo para que `ui-spec-writer` especifique SCR-029-01 a 04 (cada SCR declarará `flow: FLW-029`).
