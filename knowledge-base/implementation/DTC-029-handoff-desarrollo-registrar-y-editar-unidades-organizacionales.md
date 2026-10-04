---
okf: google-okf-v0.2
artifact: DTC-029
id: dtc-029-registrar-y-editar-unidades-organizacionales
title: "DTC-029 — Handoff de Desarrollo: Registrar y editar unidades organizacionales (US-029)"
description: "Contrato de desarrollo del alta de unidades con correo laboral, la edición del nombre con historial y el cambio de unidad padre con vigencias."
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
  - id: us-029
    title: "US-029"
    type: user-story
    link: /knowledge-base/requirement/user-stories/US-029-registrar-y-editar-unidades-organizacionales.md
  - id: flw-029
    title: "FLW-029"
    type: user-flow
    link: /knowledge-base/design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md
  - id: scr-029
    title: "SCR-029"
    type: screen-spec
    link: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
  - id: gen-029
    title: "GEN-029"
    type: generation
    link: /knowledge-base/design/generations/GEN-029-stitch-registrar-y-editar-unidades-organizacionales.md
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

# DTC-029 — Registrar y editar unidades organizacionales (US-029)

**Estado: `REQUIRES_REVIEW`.** Registrar una unidad con nombre, correo laboral, unidad padre y fecha desde; editar su nombre con auditoría del valor anterior; cambiar su unidad padre sin ciclos ni nombres repetidos, y consultar el historial de relaciones (US-029 AC-1 a AC-6).

## 1. Qué se implementa

| Pieza | Fuente | Estado |
|---|---|---|
| Alta: `POST /organizations` (`type: internal_unit`) con `contact.email_work` obligatorio | US-029 AC-1, BR-PTY-27 | Existe; el correo laboral ya lo exige. Falta el campo en el formulario (SCR-029-01 v6 lo incluye) |
| `PATCH /organizations/{id}` (solo `name`, 1–200, único entre hermanas) con registro del valor anterior | US-029 AC-2, BR-PTY-12, BR-PTY-26 | Propuesto. **La tabla `tb_organization_name_history` y su modelo ya existen (migración 0005, commit `8df2d92`)**; falta escribirla desde el servicio |
| `POST /organizations/{id}/parent` (`parent_id`, `from_date`): cierra la relación vigente y abre la nueva en una transacción | US-029 AC-3 a 6 | Propuesto |
| `GET /organizations/{id}/relationships` (historial, de más reciente a más antigua, `thru_date` nulo en la vigente) | SCR-029-04 | Propuesto |
| Índice de unicidad del nombre entre unidades con el mismo padre vigente | BR-PTY-26 | **Migración por hacer** |
| Pantallas SCR-029-01 a 04 | SCR-029, GEN-029 | Hojas consolidadas vigentes en el DTM (SCR-029-01 es v6) |

## 2. Rechazos del cambio de padre

| Condición | Código | HTTP | Regla |
|---|---|---|---|
| El padre es la propia unidad o un descendiente | `ORGANIZATION_CYCLE` | 409 | BR-PTY-22 |
| El padre está `inactive` | `PARENT_INACTIVE` | 409 | BR-PTY-25 |
| El nombre ya existe bajo el nuevo padre | `ORGANIZATION_DUPLICATE` | 409 | BR-PTY-26 |
| `from_date` ausente o inválida | `VALIDATION_ERROR` | 400 | AC-3 |
| La unidad está `inactive` | `ORGANIZATION_INACTIVE` | 409 | Q-5 (sin decidir) |

Concurrencia: `If-Match`/`row_version` es un **supuesto** (Q-8), con `412 PRECONDITION_FAILED`.

## 3. Interfaz

El diálogo de resumen del cambio de padre muestra solo «{unidad}: de X a Y» y la columna «Hasta» del historial va vacía en la relación vigente (decisiones de `human:ianache`, 2026-10-03). Campos del alta: Nombre *, Correo laboral * (`email-input`), Unidad padre * (`autocomplete` solo con unidades Activas y sin la propia unidad ni sus descendientes), Fecha desde *. Componentes nuevos: diálogo con foco atrapado, tabla del historial, migas de pan.

## 4. Fallos de diseño anotados

SCR-029-01 (v6): 9 iconos sin `aria-hidden`. SCR-029-03: rótulo «MI DESARROLLO» con contraste 2.52:1 y prueba específica del diálogo pendiente. SCR-029-04: un `nav` sin nombre. SCR-029-01 no tiene en la hoja los estados `unsaved-changes`, `cycle-error` ni `inactive-parent-error`.

## 5. Preguntas abiertas que lo condicionan

Q-5 (editar o mover una unidad inactiva), Q-6 (cómo se registra la unidad superior, sin padre; H-2 de US-029), Q-7 (`code` y `location`: no se piden en los formularios), Q-8 (concurrencia).

## 6. Pruebas

Un caso por AC de US-029 y por fila de errores: ciclo (A↔B y A bajo su propio descendiente), nombre repetido bajo el mismo padre y permitido bajo otro, padre inactivo, `from_date` inválida, correo laboral ausente o con formato inválido, valor anterior guardado en el historial, historial ordenado, concurrencia de dos cambios de padre y `403`.

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
