---
id: FLW-028
type: User Flow
title: "FLW-028 — Listar y buscar unidades organizacionales"
description: "Happy path, excepciones, permisos y estados de la consulta de unidades organizacionales (búsqueda, filtros, orden y vista jerárquica) por el Jefe de Ingeniería."
tags: [ux-ui, user-flow, party, estructura-organizacional, unidades, listado]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-03T15:00:00-05:00"
sources:
  - id: uxr-028
    resource: /knowledge-base/design/ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md
  - id: us-028
    resource: /knowledge-base/requirement/user-stories/US-028-listar-y-buscar-unidades-organizacionales.md
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
requirements: [US-028, UXR-028]
screens: [SCR-028-01]
---

# FLW-028 — Listar y buscar unidades organizacionales

Familia UXR-017: [UXR-017](../ux-requirements/UXR-017-registrar-la-organizacion-interna.md) · UXR-028 · [UXR-029](../ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md) · [UXR-030](../ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md). Hereda UXR-000 (WCAG 2.2 AA). Este flujo es la pantalla de entrada de la gestión: los flujos de UXR-029 y UXR-030 parten de una fila de este listado.

## Trazabilidad

- **Lineage:** US-028 (AC-1 a AC-6, READY) → UXR-028 → FLW-028 → SCR-028-NN.
- **Reglas:** BR-PTY-04 (unidad ↔ unidad padre), BR-PTY-17 (solo el Jefe consulta y gestiona), BR-PTY-20 (otros colaboradores solo ven la unidad de cada persona), BR-PTY-21 (Activa/Inactiva; desactivar = eliminación lógica).
- **Evidencia:** EVD-2026-0133, EVD-2026-0142.
- **Screens (IDs reservados; se especifican en `ui-spec-writer`, no aquí):**

| Screen | Alcance reservado en este flujo |
|---|---|
| SCR-028-01 | Gestión de unidades: consulta con búsqueda, filtros, orden y alternancia lista/jerarquía, y sus estados de interfaz |

  Si `ui-spec-writer` decide separar lista y jerarquía u otros estados en más pantallas, reservará IDs adicionales (ver FLW-028-Q1). Cada SCR listado debe declarar `flow: FLW-028`.

## Happy path

**Actor:** Jefe de Ingeniería. **Objetivo:** ubicar una unidad y entender la estructura vigente. **Precondición:** organización interna registrada (UXR-017/US-017) y sesión con rol Jefe.

| Paso | Acción del usuario | Respuesta del sistema | AC / UXR | Screen |
|---|---|---|---|---|
| 1 | Abre la gestión de la estructura organizacional | Estado Cargando (anunciado a lectores de pantalla); luego lista de unidades **Activas** con nombre, unidad padre, estado, vigencia desde/hasta, unidades hijas activas y personas vigentes; filtro de estado muestra "Activa" | AC-1 | SCR-028-01 |
| 2 | Escribe parte del nombre en la búsqueda | Solo unidades cuyo nombre contiene el texto (coincidencia parcial); filtros activos visibles | AC-2 | SCR-028-01 |
| 3 | Cambia el filtro de estado (Activa / Inactiva / Todas) | Lista filtrada; las Inactivas muestran vigencia hasta | AC-3 | SCR-028-01 |
| 4 | Elige una unidad padre en el filtro | Unidades hijas y todas sus descendientes que cumplen los demás filtros | AC-4 | SCR-028-01 |
| 5 | Ordena por nombre, unidad padre, estado o vigencia desde (asc/desc) | Nuevo orden con indicador y anuncio del orden activo; búsqueda y filtros se conservan | AC-5 | SCR-028-01 |
| 6 | Alterna a vista jerárquica | Cada unidad bajo su unidad padre vigente; operable por teclado (expandir/colapsar), anuncia nivel y estado expandido; búsqueda y filtros se conservan | AC-6 | SCR-028-01 |
| 7 | Desde una fila, elige editar, desactivar o reactivar | Sale hacia el flujo de UXR-029 (editar) o UXR-030 (desactivar/reactivar) | UXR-028 §2 | SCR-028-01 |
| 8 | Opcional: "Limpiar filtros" | Vuelve al estado por defecto (Activas) | US-028 §10 | SCR-028-01 |

Notas de flujo:
- Registrar una unidad (UXR-029) se alcanza desde el estado "Sin unidades registradas" y, si la gestión lo ofrece, desde el listado: el punto de entrada de "Registrar" fuera del vacío no está fijado (FLW-028-Q2).
- Las etiquetas del estado son "Activa" / "Inactiva"; nunca "Eliminada" ni "Borrada" (BR-PTY-21). El estado se comunica con texto, no solo con color.

## Excepciones, permisos y estados

### Permisos

| Actor | Acceso |
|---|---|
| Jefe de Ingeniería | Ve todas las unidades (Activas e Inactivas) y sus conteos; accede a editar, desactivar y reactivar (BR-PTY-17) |
| Otros colaboradores | No acceden a la gestión; solo ven la unidad de cada persona (BR-PTY-20) |

### Estados de la interfaz

| Estado | Condición | Comportamiento del flujo | Salida |
|---|---|---|---|
| Cargando | Consulta en curso | Indicador de progreso anunciado | Resultados / error |
| Resultados | Hay unidades que cumplen los filtros | Happy path | Pasos 2 a 8 |
| Sin organización interna | No existe la organización interna | Remite a registrarla (UXR-017) | Flujo de UXR-017 |
| Sin unidades registradas | Organización existe, sin unidades | Vacío con acción de registrar la primera | Flujo de UXR-029 |
| Sin resultados para los filtros | Búsqueda/filtros sin coincidencias | Mensaje con filtros activos y acción "Limpiar filtros" | Paso 8 |
| Sin permisos | Usuario no es Jefe | Acceso no autorizado; sin datos de la estructura | Fin |
| Error al consultar | Falla la consulta | Mensaje con reintento | Reintentar vuelve a Cargando |

### Excepciones

| ID | Excepción | Tratamiento | Fuente |
|---|---|---|---|
| E1 | Usuario no Jefe intenta abrir la gestión | Estado "Sin permisos"; no se expone la estructura | BR-PTY-17, EVD-2026-0142 |
| E2 | Filtros sin coincidencias | Estado sin resultados + "Limpiar filtros" | US-028 §6 |
| E3 | Falla de consulta | Mensaje con reintento; filtros conservados (supuesto del flujo, ver FLW-028-Q3) | UXR-028 §4 |
| E4 | Filtro de unidad padre combinado con estado Activa | Muestra solo descendientes que cumplan el estado (AC-4 "demás filtros") | AC-4 |

### Accesibilidad del flujo (UXR-000, UXR-028 §7)

Tabla con encabezados asociados y `aria-sort` en la columna ordenada; árbol con roles `tree`/`treeitem`; estados con texto y contraste 4.5:1; orden y filtros activos anunciados; foco gestionado al cambiar de vista y al limpiar filtros.

## Preguntas abiertas

Heredadas de UXR-028 (siguen abiertas, ninguna bloquea): UXR-028-Q1 (volumen y paginación), Q2 (orden por defecto), Q3 (resaltado y ancestros en jerarquía), Q4 (recordar filtros y vista), Q5 (personas vigentes: lista o solo conteo).

Nuevas de este flujo:

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| FLW-028-Q1 | ¿Lista y jerarquía son una sola pantalla con alternancia o dos pantallas? Hoy se reserva solo SCR-028-01; lo decide `ui-spec-writer` con el Jefe. | Jefe de Ingeniería / UX | Baja | No |
| FLW-028-Q2 | ¿Dónde está el punto de entrada de "Registrar unidad" cuando ya hay unidades? UXR-028 solo lo menciona en el estado vacío; UXR-029 lo parte de la gestión. | Jefe de Ingeniería | Media | No |
| FLW-028-Q3 | Tras un error de consulta, ¿se conservan búsqueda y filtros al reintentar? Los requisitos no lo dicen. | Jefe de Ingeniería | Baja | No |
| FLW-028-Q4 | Al volver de editar, desactivar o reactivar (UXR-029/030), ¿el listado conserva filtros, orden y vista, y cómo se confirma el resultado? | Jefe de Ingeniería | Media | No |
| FLW-028-Q5 | En "Sin permisos", ¿qué se ofrece al usuario (solo mensaje o redirección)? | Jefe de Ingeniería | Baja | No |
| FLW-028-Q6 | ¿La vista jerárquica filtrada por estado Inactiva o Todas muestra una unidad Inactiva bajo un padre Activo/Inactivo, y qué hace si su padre no cumple el filtro? | Jefe de Ingeniería | Media | No |

## Definition of Done

- [x] Lineage US-028 → UXR-028 → FLW-028 resoluble
- [x] Happy path, excepciones, permisos y estados explícitos
- [x] `screens` presente (SCR-028-01 reservado, sin especificar)
- [x] Vacíos registrados como preguntas abiertas; ninguna bloquea
- [ ] Verificación humana pendiente (`status: draft`)
- Siguiente: `ui-spec-writer` especifica SCR-028-01 y declara `flow: FLW-028`.
