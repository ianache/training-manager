---
type: UX Requirement
title: "UXR-028 — Listar y buscar unidades organizacionales"
description: "Requisitos UX del listado de unidades organizacionales con búsqueda, filtros, ordenamiento y vista jerárquica para el Jefe de Ingeniería."
tags: [ux-requirement, party, estructura-organizacional, unidades, listado]
status: draft
generated:
  by: "ux-requirements-analyzer/1.0"
  at: "2026-10-03T14:00:00-05:00"
sources:
  - id: us-028
    resource: /knowledge-base/requirement/user-stories/US-028-listar-y-buscar-unidades-organizacionales.md
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
---

# UXR-028 — Listar y buscar unidades organizacionales

Familia: [UXR-017](UXR-017-registrar-la-organizacion-interna.md) · UXR-028 · [UXR-029](UXR-029-registrar-y-editar-unidades-organizacionales.md) · [UXR-030](UXR-030-desactivar-y-reactivar-unidades-organizacionales.md). Hereda [UXR-000](UXR-000-requisitos-ux-transversales.md). Esta es la pantalla de entrada de la gestión: UXR-029 y UXR-030 se operan desde ella.

## 1. Actor y permisos

| Actor | Ve | Edita | Fuente |
|---|---|---|---|
| Jefe de Ingeniería | Todas las unidades (Activas e Inactivas) y sus conteos | Nada en esta pantalla; accede a registrar, editar, desactivar y reactivar | BR-PTY-17 |
| Otros colaboradores | No acceden; solo ven la unidad de cada persona (BR-PTY-20) | — | EVD-2026-0142 |

## 2. Flujo esperado

1. El Jefe abre la gestión: ve las unidades **Activas** por defecto.
2. Busca por nombre, filtra por estado y por unidad padre (con descendientes), y ordena por columnas.
3. Alterna entre lista y jerarquía; los filtros y la búsqueda se conservan al alternar y al ordenar.
4. Desde una fila accede a editar (UXR-029) o a desactivar/reactivar (UXR-030).

## 3. Controles y datos

| Elemento | Requisito UX | Origen |
|---|---|---|
| Búsqueda | Texto libre sobre el nombre; coincidencia parcial | AC-2 |
| Filtro de estado | Activa (por defecto) / Inactiva / Todas | AC-1, AC-3 |
| Filtro de unidad padre | Selector de unidad; incluye descendientes | AC-4 |
| Ordenamiento | Columnas nombre, unidad padre, estado, vigencia desde; ascendente/descendente; indicador del orden activo | AC-5 |
| Alternar vista | Lista ↔ jerarquía; la jerarquía muestra cada unidad bajo su padre vigente | AC-6 |
| Columnas | Nombre, unidad padre, estado, vigencia desde/hasta, unidades hijas activas, personas vigentes | US-028 §8 |
| Filtros activos | Siempre visibles, con opción de limpiarlos | US-028 §10 |

## 4. Estados de la interfaz

| Estado | Comportamiento UX |
|---|---|
| Sin organización interna | Remite a registrarla (UXR-017) |
| Sin unidades registradas | Vacío con acción de registrar la primera (UXR-029) |
| Sin resultados para los filtros | Mensaje con los filtros activos y acción "Limpiar filtros" |
| Cargando | Indicador de progreso anunciado a lectores de pantalla |
| Sin permisos | Acceso no autorizado; sin datos de la estructura |
| Error al consultar | Mensaje con reintento |

## 5. Etiquetas

"Activa" / "Inactiva" (estado de la unidad, TRM-0079); "Unidad padre"; "Vigencia desde/hasta" (TRM-0092). No usar "Eliminada" ni "Borrada" para una unidad Inactiva (BR-PTY-21).

## 6. Criterios UX verificables

- [ ] Al abrir, solo se ven unidades Activas y el filtro de estado lo refleja.
- [ ] Cambiar el orden o la vista conserva búsqueda y filtros.
- [ ] El estado de una unidad no se comunica solo por color: lleva texto.
- [ ] La vista jerárquica es operable por teclado (expandir/colapsar con flechas y Enter) y anuncia el nivel y el estado expandido.
- [ ] El orden activo y los filtros activos se anuncian a lectores de pantalla.

## 7. Accesibilidad

WCAG 2.2 AA (UXR-000). Tabla con encabezados asociados y `aria-sort` en la columna ordenada; árbol con roles `tree`/`treeitem`; contraste de estados 4.5:1.

## 8. Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| UXR-028-Q1 | ¿Cuántas unidades se esperan (decenas o cientos)? Define si hace falta paginación y la profundidad máxima razonable de la jerarquía. | Jefe de Ingeniería | Media | No |
| UXR-028-Q2 | ¿Cuál es el orden por defecto (por nombre, o jerárquico)? | Jefe de Ingeniería | Baja | No |
| UXR-028-Q3 | ¿La búsqueda debe resaltar la coincidencia y, en la vista jerárquica, mostrar también las unidades ancestras de un resultado? | Jefe de Ingeniería | Baja | No |
| UXR-028-Q4 | ¿Se recuerdan los filtros y la vista entre sesiones? | Jefe de Ingeniería | Baja | No |
| UXR-028-Q5 | ¿Se necesita ver cuáles son las personas vigentes de una unidad, o basta el conteo? La historia solo pide el conteo. | Jefe de Ingeniería | Media | No |

## 9. Trazabilidad

- **Upstream:** US-028 → SPEC-001 C3 → BR-PTY-04, 17, 21; EVD-2026-0133, 0142.
- **Downstream (pendiente):** FLW → SCR → CMP → AC (`user-flow-designer`).
- **Verificación humana:** pendiente.
