---
type: Component Specification
id: CMP-017
title: CMP-017 — Componentes de la gestión de la estructura organizacional
description: Inventario de componentes de SCR-017, SCR-028, SCR-029 y SCR-030 frente a @gf/ui. Mapea lo que ya existe y declara las brechas que exigen web-atomic-component-designer antes de implementar.
tags: [ux-ui, components, gf-ui, atomic-design, estructura-organizacional]
status: draft
readiness: REQUIRES_REVIEW
generated: { by: "development-handoff-builder/1.0", at: "2026-10-04T12:00:00-05:00" }
sources:
  - id: scr-017
    resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
  - id: scr-028
    resource: /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
  - id: scr-029
    resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
  - id: scr-030
    resource: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: cmp-015
    resource: /knowledge-base/design/components/CMP-015-componentes-registrar-colaborador.md
  - id: arp
    resource: /knowledge-base/design/handoff/ARP-UNIDADES-REGENERACION-v2.md
---

# CMP-017 — Componentes de la gestión de la estructura organizacional

**Estado: `REQUIRES_REVIEW`.** Es un inventario derivado de los SCR y de la biblioteca `@gf/ui` tal como está en el repositorio (`projects/ui/src/lib`). **No** pasó por `web-atomic-component-designer`: las brechas de abajo no tienen diseño atómico. Los GEN de Stitch no etiquetan componentes, así que el inventario sale de los SCR y del HTML revisado.

## 1. Lo que existe en `@gf/ui`

Átomos: `badge`, `button`, `date-input`, `email-input`, `error-message`, `icon`, `label`, `level-badge`, `select`, `spinner`, `tel-input`, `text-input`. Moléculas: `alert`, `autocomplete`, `empty-state`, `form-field`, `radio-card`, `view-state`.

## 2. Inventario por pantalla

| Componente | Biblioteca | Pantalla | Estados | A11y exigida | Cobertura |
|---|---|---|---|---|---|
| Correo laboral de la unidad (obligatorio, BR-PTY-27) | `email-input` + `form-field` | 029-01 | normal, foco, error, deshabilitado | `label for`, `aria-required`, `aria-invalid`, error con `role="alert"` | **Existe** |
| Campo de texto (razón social, RUC, nombre) | `text-input` + `form-field` | 017-02, 029-01, 029-02 | normal, foco, error, deshabilitado, guardando | `label for`, `aria-required`, `aria-invalid`, `aria-describedby`, error con `role="alert"` | **Existe** |
| País emisor | `select` | 017-02 | normal, abierto, error | etiqueta ligada | **Existe** (la versión con bandera de CMP-MOL-007 no está en `@gf/ui`; no se pide aquí) |
| Fecha desde | `date-input` | 029-01, 029-03, 030-03 | normal, error | etiqueta, formato dd/mm/aaaa | **Existe** |
| Unidad padre (búsqueda, solo Activas) | `autocomplete` | 029-01, 029-03, 028-01 (filtro) | cerrado, abierto, sin resultados, error | `role="combobox"`, `aria-expanded`, `aria-controls`, teclado (flechas, Enter, Escape) | **Existe, por verificar**: debe filtrar por estado y excluir la propia unidad y sus descendientes |
| Insignia de estado «Activa»/«Inactiva» y «Vigente desde» | `badge` | 017-01, 028-01, 029-03/04, 030-0x | éxito (verde), neutro | icono + texto, no solo color | **Existe, por ajustar**: el tono de éxito debe ser `success` (#065f46 sobre #ecfdf5) |
| Botones (Registrar, Guardar, Continuar, Desactivar, Reactivar, Cancelar, Editar, Reintentar) | `button` | todas | primario, secundario, deshabilitado, cargando | foco visible 2 px #0059ba, `aria-busy` al cargar | **Existe** (variante de carga por confirmar) |
| Mensajes de error, éxito y carga | `alert`, `error-message`, `spinner`, `view-state` | todas | error, éxito, cargando | `role="alert"` (error), `role="status"` (éxito, carga), iconos `aria-hidden` | **Existe** |
| Estado vacío («Aún no hay unidades…», «Sin resultados», sin organización interna) | `empty-state` | 017-01, 028-01 | vacío | mensaje en `role="status"` | **Existe** (SCR-017-Q5 pedía confirmarlo) |
| Lista de datos de solo lectura (razón social, RUC, país) | — | 017-01, 029-03, 029-02 | solo lectura | `dl/dt/dd` | **Brecha**: no hay componente de lista de descripción |
| **Tabla ordenable** (caption, `th scope`, `aria-sort`, acciones por fila) | — | 028-01, 029-04 | normal, ordenada, vacía, cargando (esqueleto) | `caption`, `aria-sort`, filas con acciones alcanzables por teclado | **Brecha** |
| **Árbol de unidades** (`tree`/`treeitem`, expandir/contraer) | — | 028-01 | nodo cerrado/abierto/seleccionado | `role="tree"`, `aria-level`, `aria-expanded`, flechas | **Brecha** |
| **Diálogo de confirmación / bloqueo** (modal) | — | 029-03 (resumen), 030-01 a 04 | abierto, guardando, error | `role="dialog"`, `aria-modal`, `aria-labelledby`, **foco atrapado**, Escape, retorno del foco | **Brecha** |
| **Grupo de alternancia** Lista/Jerarquía | — | 028-01 | seleccionado | `aria-pressed` | **Brecha** |
| **Filtro activo + «Limpiar filtros»** (chip) | — | 028-01 | activo | anunciar cambios de filtro | **Brecha** |
| **Paginación** (Anterior/Siguiente) | — | 028-01, 029-04 | habilitado, deshabilitado | botones nativos | **Brecha** |
| **Migas de pan** (`nav` con `aria-label`, `aria-current`) | — | 017-02, 029-0x | — | `aria-label`, `aria-current="page"` | **Brecha** (aunque pertenece al shell) |

## 3. Brechas (7 componentes) y decisión de límite

Las siete brechas (lista de descripción, tabla ordenable, árbol, diálogo, grupo de alternancia, chip de filtro, paginación) más las migas de pan **no tienen diseño en `@gf/ui`**. Antes de implementarlas hay que pasar por `web-atomic-component-designer`, que decide si cada una es un átomo, una molécula o un organismo y su contrato npm. La tabla ordenable, el árbol y el diálogo son los de mayor riesgo de accesibilidad (ver ARP-UNIDADES-V2 y CHK-UNIDADES-001). **No se sustituyen por Material ni otra biblioteca** (decisión de DTC-015).

## 4. Dónde vive la pantalla (decisión de límite, propuesta)

El flujo de la estructura pertenece al dominio de colaboradores y party: se propone una página nueva dentro de `mfe-collaborators` (como US-015 y US-016) y no un MicroUI nuevo. **No está confirmado** (UXR-017-Q4 y FLW-017-Q4 dejan sin resolver qué pantalla es la entrada de la gestión).

## 5. Reglas de implementación

- Textos exactos de los SCR; los marcados «propuesto» o «de muestra» están por validar (mensajes de error al guardar, de carga, de permisos).
- Estados en minúsculas en la API (`active`/`inactive`) y «Activa»/«Inactiva» en pantalla.
- Éxito y vigencia en verde del design system, siempre con icono y texto; ningún otro verde.
- Foco visible 2 px `#0059ba` con desplazamiento de 2 px en todo elemento interactivo.

## 6. Preguntas abiertas

| ID | Pregunta |
|---|---|
| CMP-017-Q1 | ¿`autocomplete` ya filtra por estado y excluye la propia unidad y sus descendientes, o hay que extenderlo? Requiere leer su código y pruebas |
| CMP-017-Q2 | ¿La variante de botón en carga (`aria-busy`, deshabilitado) ya existe en `button`? |
| CMP-017-Q3 | ¿Dónde se aloja el diálogo: en `@gf/ui` o en el shell? (lo usan también SCR-001 y SCR-019) |
