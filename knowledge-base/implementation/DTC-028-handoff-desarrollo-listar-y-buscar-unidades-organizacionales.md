---
okf: google-okf-v0.2
artifact: DTC-028
id: dtc-028-listar-y-buscar-unidades-organizacionales
title: "DTC-028 — Handoff de Desarrollo: Listar y buscar unidades organizacionales (US-028)"
description: "Contrato de desarrollo del listado de unidades con búsqueda, filtros, ordenamiento y vista jerárquica."
status: REQUIRES_REVIEW
human-reviewed: false
verified: false
generated:
  by: "development-handoff-builder/1.0"
  at: "2026-10-04T14:00:00-05:00"
  version: "0.1.0"
sources:
  - id: dcp-004
    title: "DCP-004 — Development Context Pack de la gestión de la estructura organizacional"
    type: development-context-pack
    link: /knowledge-base/architecture/ad-handoff/DCP-004-gestion-de-unidades-organizacionales.md
  - id: us-028
    title: "US-028"
    type: user-story
    link: /knowledge-base/requirement/user-stories/US-028-listar-y-buscar-unidades-organizacionales.md
  - id: flw-028
    title: "FLW-028"
    type: user-flow
    link: /knowledge-base/design/user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md
  - id: scr-028
    title: "SCR-028"
    type: screen-spec
    link: /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
  - id: gen-028
    title: "GEN-028"
    type: generation
    link: /knowledge-base/design/generations/GEN-028-stitch-listar-y-buscar-unidades-organizacionales.md
  - id: api-spec-006
    title: "API-SPEC-006 — Gestión de la estructura organizacional"
    type: api-spec
    link: /knowledge-base/architecture/api/API-SPEC-006-gestion-de-unidades-organizacionales.md
  - id: cmp-017
    title: "CMP-017 — Componentes de la gestión de unidades"
    type: component-spec
    link: /knowledge-base/design/components/CMP-017-componentes-gestion-de-unidades.md
  - id: hof-ppm-002
    title: "HOF-PPM-002 — Handoff de diseño"
    type: ux-handoff
    link: /knowledge-base/design/handoff/HOF-PPM-002-gestion-unidades-organizacionales.md
---

# DTC-028 — Listar y buscar unidades organizacionales (US-028)

**Estado: `REQUIRES_REVIEW`.** Consultar las unidades con búsqueda, filtros por estado y por unidad padre, ordenamiento por columnas y vista en árbol (US-028 AC-1 a AC-6).

## 1. Qué se implementa

| Pieza | Fuente | Estado |
|---|---|---|
| `GET /organizations` ampliado: `ancestor_id` (la unidad y sus descendientes), orden por `parent_name`, `status` y `from_date`, `view=tree`, `from_date`/`thru_date`, `active_children_count`, `current_people_count` | API-SPEC-006 §3.1 | Propuesto; el `GET` actual cubre solo `type`, `search`, `status`, `parent_id`, `page`, `limit`, `sort` |
| Ruta del BFF con `LIST_QUERY` ampliado (`ancestor_id`, `view`) y permiso Jefe de Ingeniería + ADMIN | `organizations.router.ts` | Código existente a ampliar |
| SCR-028-01: tabla ordenable, filtros con chips y «Limpiar filtros», alternancia lista/jerarquía, árbol, paginación, estados vacío/sin resultados/error/cargando/sin permisos | SCR-028, GEN-028 | Hoja consolidada vigente en el DTM; fallo anotado: rótulo «MI DESARROLLO» con contraste 2.44:1 |

## 2. Contrato de la consulta

`search` ≤100 caracteres, parcial y sin distinguir mayúsculas sobre `name`; `status` `active` (por defecto), `inactive` o `all`; `sort` por `name`, `parent_name`, `status`, `from_date` con `:asc`/`:desc` (por defecto `name:asc`); `view` `list` o `tree`. `403` si no es Jefe de Ingeniería ni ADMIN. Lectura de la lista de unidades por cualquier sesión para el asistente de US-015, pero la **pantalla de gestión** es solo del Jefe de Ingeniería y ADMIN (EVD-2026-0142, EVD-2026-0238).

## 3. Componentes (CMP-017)

Brechas sin diseño atómico: tabla ordenable (`aria-sort`, `caption`), árbol (`role="tree"`, flechas), grupo de alternancia, chip de filtro, paginación, migas de pan. Existentes: `text-input`, `select`, `autocomplete` (por verificar el filtro por estado y la exclusión de descendientes), `badge` (tono `success`), `empty-state`, `view-state`.

## 4. Preguntas abiertas que lo condicionan

Q-4 de API-SPEC-006 (volumen y profundidad del árbol, paginación del árbol; sin ello no se puede dimensionar la consulta recursiva ni los conteos). UXR-028-Q1.

## 5. Pruebas

Un caso por AC de US-028 (AC-1 a AC-6) y por parámetro: búsqueda parcial, filtro por estado y por padre con descendientes, orden por cada columna, vista en árbol, vacío y sin resultados, y `403`. Accesibilidad: orden por columna con teclado con `aria-sort` anunciado, árbol operable con flechas (prueba específica de CHK-UNIDADES-001).

## Cómo usar este DTC

Es un contrato de trabajo **derivado** de [DCP-004](../architecture/ad-handoff/DCP-004-gestion-de-unidades-organizacionales.md), que manda. No repite lo que ya está en las fuentes: señala qué construir, contra qué contrato y con qué pruebas. Todo lo marcado «propuesto» o «de muestra» está por confirmar con el Jefe de Ingeniería.

## Estado y bloqueos comunes

- **`REQUIRES_REVIEW`, no `READY_FOR_DEV`.** El gate `DESIGN_READY_FOR_DEV` de [HOF-PPM-002](../design/handoff/HOF-PPM-002-gestion-unidades-organizacionales.md) está en `FAILED` (23 hallazgos, 2026-10-04): falta la aprobación humana del diseño de Stitch por pantalla, informes de accesibilidad en `pass` en varias pantallas y la revisión humana del gate.
- [API-SPEC-006](../architecture/api/API-SPEC-006-gestion-de-unidades-organizacionales.md) y [CMP-017](../design/components/CMP-017-componentes-gestion-de-unidades.md) son propuestas sin revisión humana ni de `api-contract-reviewer`, `api-security-reviewer` o `web-atomic-component-designer`.
- Diseño de referencia: solo Stitch (Figma descartado, decisión de `human:ianache`, 2026-10-03), en exploración; no es diseño gobernado hasta que un humano lo apruebe.
- Decisiones del 2026-10-04: ADMIN también gestiona la estructura (EVD-2026-0238); el correo laboral es obligatorio al registrar una unidad (BR-PTY-27); solo unidades y proveedores se gestionan por la API (BR-PTY-28); el historial del nombre vive en `tb_organization_name_history`, migración 0005 ya en el código (EVD-2026-0241).

## No sustituciones

Sin Material ni otra biblioteca: se usa `@gf/ui` y las brechas de CMP-017 pasan antes por `web-atomic-component-designer`. No omitir estados ni validadores, no cambiar atributos de accesibilidad y no inventar campos sin aprobación de UX. Solo escritorio. Estados de la API en minúsculas (`active`/`inactive`) y en pantalla «Activa»/«Inactiva». Nada se borra físicamente.

## Verificación común

Las pruebas de la API corren contra **PostgreSQL real** (SQLite no detecta sus errores). Hoy 13 pruebas de integración ya fallan en PostgreSQL por el orden de inserción de claves foráneas en las pruebas, anteriores a esta capacidad. Accesibilidad: [CHK-UNIDADES-001](../design/handoff/CHK-UNIDADES-REVISION-NAVEGADOR.md) (C1 a C9 aprobados por ianache el 2026-10-04 en las hojas consolidadas) y los informes ARP de cada pantalla.
