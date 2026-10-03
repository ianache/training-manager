---
id: CMP-016
type: Component
title: "CMP-016 — Componentes: Actualizar datos y medios de contacto"
description: "Índice de los componentes nuevos y ampliados que necesita SCR-016, cada uno con su especificación CMP."
tags:
- ux-ui
- component
- us-016
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: web-atomic-component-designer/1.0
  at: '2026-10-02T23:30:00-05:00'
sources:
- id: scr-016
  resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
- id: flw-016
  resource: /knowledge-base/design/user-flows/FLW-016-actualizar-datos-y-contactos.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: catalog-015
  resource: /knowledge-base/design/components/dtc-015/atomic-component-catalog.md
flow: FLW-016
screens: [SCR-016-01, SCR-016-02, SCR-016-03, SCR-016-04, SCR-016-05, SCR-016-06]
requirements: [US-016, UXR-016]
---

# CMP-016 — Componentes de Actualizar datos y medios de contacto

Resuelve SCR-016-Q12 (decisión de `human:ianache`, 2026-10-02: todo componente usado debe tener su CMP). Son especificaciones de propuesta: no se implementó código ni se modificó `@gf/ui`. Estado `REQUIRES_REVIEW`.

**Contexto de fuentes:** no existe un paquete DTC-016 de diseño web; las fuentes son SCR-016, FLW-016, UXR-016, US-016, `TKN-SET-002` y el estado real de `@gf/ui`. Se registra como supuesto.

## Componentes

| ID | Selector | Nivel | Nombre | Pantallas |
|---|---|---|---|---|
| [CMP-ATOM-013](cmp-016/CMP-ATOM-013-gf-flag.md) | `gf-flag` | atom | Bandera de país | SCR-016-02, SCR-016-04 |
| [CMP-MOL-007](cmp-016/CMP-MOL-007-gf-country-select.md) | `gf-country-select` | molecule | Selector de país con bandera | SCR-016-02, SCR-016-04 |
| [CMP-ORG-001](cmp-016/CMP-ORG-001-gf-phone-field.md) | `gf-phone-field` | organism | Campo de teléfono | SCR-016-02, SCR-016-04 |
| [CMP-MOL-008](cmp-016/CMP-MOL-008-gf-vigencia-badge.md) | `gf-vigencia-badge` | molecule | Etiqueta de vigencia | SCR-016-02, SCR-016-04, SCR-016-03, SCR-016-06 |
| [CMP-MOL-009](cmp-016/CMP-MOL-009-gf-pagination.md) | `gf-pagination` | molecule | Paginación | SCR-016-06 |
| [CMP-MOL-010](cmp-016/CMP-MOL-010-gf-date-range.md) | `gf-date-range` | molecule | Rango de fechas | SCR-016-06 |
| [CMP-MOL-011](cmp-016/CMP-MOL-011-gf-tabs.md) | `gf-tabs` | molecule | Pestañas | SCR-016-05 |
| [CMP-ORG-002](cmp-016/CMP-ORG-002-app-profile-list.md) | `app-profile-list` | organism | Lista de perfiles profesionales | SCR-016-03 |
| [CMP-ORG-003](cmp-016/CMP-ORG-003-app-change-history.md) | `app-change-history` | organism | Historial de cambios | SCR-016-06 |
| [CMP-EXT-001](cmp-016/CMP-EXT-001-gf-text-input-url-tel.md) | `gf-text-input` | atom | Ampliación de gf-text-input: tipos url y tel | SCR-016-03, SCR-016-02, SCR-016-04 |
| [CMP-EXT-002](cmp-016/CMP-EXT-002-gf-email-input-estados.md) | `gf-email-input` | atom | Ampliación de gf-email-input: estados de validación asíncrona | SCR-016-02 |

Los componentes que SCR-016 reutiliza sin cambios siguen especificados en CMP-015 y en el catálogo de DTC-015: botón, selector nativo (`gf-select`), etiqueta, mensaje de error, ícono, alerta, estado vacío, estado de vista y diálogo de confirmación.

## Decisión de límite (MicroUI)

Todos quedan dentro de lo existente: los siete genéricos van a `@gf/ui` y los dos de dominio (perfiles e historial) viven en `mfe-collaborators`. Decisión: `FRONTEND_MODULE`; no se crea un MicroUI nuevo, porque no hay un equipo ni un despliegue independientes que lo justifiquen (sin evidencia contraria).

## Contrato del paquete `@gf/ui` (cambio propuesto)

- **Nuevas exportaciones:** `GfFlag`, `GfCountrySelect` (y tipo `CountryOption`), `GfPhoneField`, `GfVigenciaBadge`, `GfPagination`, `GfDateRange` (y tipo `DateRange`), `GfTabs` (y tipo `GfTab`).
- **Ampliaciones:** `gf-text-input` (tipos `url` y `tel`), `gf-email-input` (estados y mensajes).
- **Deprecación:** `gf-tel-input` (CMP-ATOM-007), reemplazado por `gf-phone-field`.
- **Dependencias de pares:** sin cambios; `@angular/forms` ya está declarada. Sin `@angular/material` ni `@angular/cdk` (lo exige `tools/check-ui-library.mjs`).
- **Versión:** menor (1.1.0 → 1.2.0) por las incorporaciones; el retiro de `gf-tel-input` será una versión mayor.

## Reglas de dependencia

Átomos y moléculas no dependen de páginas ni de servicios. `gf-phone-field` → `gf-country-select` → `gf-flag`; `gf-vigencia-badge` → `gf-badge`. Los organismos de dominio (`app-profile-list`, `app-change-history`) son presentacionales: la página consulta los servicios y entrega los datos.

## Preguntas abiertas

| ID | Pregunta | Componentes |
|---|---|---|
| CMP-016-Q1 | **Resuelta** (`human:ianache`, 2026-10-02): `gf-phone-field` se confirma como organismo, aunque por la definición estricta sería molécula | CMP-ORG-001 |
| CMP-016-Q2 | **Resuelta** (`human:ianache`, 2026-10-02, opción B): `flag-icons` (MIT), copiando solo los SVG de Perú y Estados Unidos con su aviso de licencia | CMP-ATOM-013 |
| CMP-016-Q3 | **Resuelta** (`human:ianache`, 2026-10-02): **no** se toleran separadores al teclear el número | CMP-ORG-001 |
| CMP-016-Q4 | **Resuelta** (decisión delegada, tomada por el agente): el teléfono de un país no soportado se muestra de solo lectura y no se modifica | CMP-ORG-001 |
| CMP-016-Q5 | **Resuelta** (`human:ianache`, 2026-10-02, «ok»): es aceptable que el validador devuelva «válido» tras 5 s, con el servidor como respaldo (BR-PTY-08). El servidor debe rechazar el duplicado | CMP-EXT-002 |
| CMP-016-Q6 | **Resuelta**: dd/mm/aaaa y hora de 24 h (HH:mm), en hora de Lima (UTC−5) (formato por `human:ianache`; hora de Lima por el agente) | CMP-MOL-008, 010, ORG-003 |
| CMP-016-Q7 | **Resuelta** (`human:ianache`): 10 por página, configurable | CMP-MOL-009, ORG-003 |
| CMP-016-Q8 | **Resuelta** (`human:ianache`): `tablist` sincronizado con el router | CMP-MOL-011 |
| CMP-016-Q9 | **Aceptada la propuesta** (`human:ianache`, 2026-10-02, «ok»): el contrato `HistoryEntry` de CMP-ORG-003 es la base. Falta acordarlo con el servicio de Party, que no tiene endpoint de historial | CMP-ORG-003 |
| CMP-016-Q10 | **Resuelta** (`human:ianache`, opción a): «Otro» pide un nombre de plataforma libre (ejemplo «Training Portal») | CMP-ORG-002 |
| CMP-016-Q11 | **Resuelta** (`human:ianache`): el cambio aplica de inmediato; sin vigencia «pendiente» | CMP-MOL-008 |
| CMP-016-Q12 | **Resuelta** (`human:ianache`, «ok»): se revisó `gf-badge` y `gf-vigencia-badge` compone solo `gf-badge` | CMP-MOL-008 |
| CMP-016-Q13 | **Resuelta** (`human:ianache`): basta posicionar con CSS | CMP-MOL-007 |
| CMP-016-Q14 | **Abierta**: longitud máxima y validación del nombre libre de «Otro»; el modelo de datos no tiene dónde guardarlo | CMP-ORG-002 |

## Pendiente antes de `READY_FOR_DEV`

Respuesta a las preguntas anteriores, diseño gobernado de las pantallas de SCR-016, informe de `accessibility-reviewer` y revisión humana. Nada de esto lo establece el agente.
