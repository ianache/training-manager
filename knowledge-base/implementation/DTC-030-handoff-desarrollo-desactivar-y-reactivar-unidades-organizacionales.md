---
okf: google-okf-v0.2
artifact: DTC-030
id: dtc-030-desactivar-y-reactivar-unidades-organizacionales
title: "DTC-030 — Handoff de Desarrollo: Desactivar y reactivar unidades organizacionales (US-030)"
description: "Contrato de desarrollo de la baja lógica de unidades con bloqueo por dependencias y de la reactivación con una nueva vigencia bajo un padre Activo."
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
  - id: us-030
    title: "US-030"
    type: user-story
    link: /knowledge-base/requirement/user-stories/US-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: flw-030
    title: "FLW-030"
    type: user-flow
    link: /knowledge-base/design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: scr-030
    title: "SCR-030"
    type: screen-spec
    link: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: gen-030
    title: "GEN-030"
    type: generation
    link: /knowledge-base/design/generations/GEN-030-stitch-desactivar-y-reactivar-unidades-organizacionales.md
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

# DTC-030 — Desactivar y reactivar unidades organizacionales (US-030)

**Estado: `REQUIRES_REVIEW`.** Desactivar una unidad (cierra vigencias, no borra) con bloqueo si tiene unidades hijas activas o personas vigentes, y reactivarla abriendo una nueva vigencia bajo un padre Activo (US-030 AC-1 a AC-4).

## 1. Qué se implementa

| Pieza | Fuente | Estado |
|---|---|---|
| `POST /organizations/{id}/deactivate`, sin cuerpo: cierra la vigencia del rol y de la relación de estructura (`thru_date` = hoy) | US-030 AC-1, BR-PTY-12, BR-PTY-21 | Propuesto |
| Bloqueo: `409 ORGANIZATION_HAS_DEPENDENCIES` con `active_children_count` y `current_people_count` en `error.details` | US-030 AC-2, BR-PTY-23 | Propuesto |
| `POST /organizations/{id}/reactivate` (`from_date`, `parent_id`): abre una nueva vigencia | US-030 AC-3, BR-PTY-24 | Propuesto |
| Bloqueo: `409 PARENT_INACTIVE` con nombre e `id` del padre en `error.details`; no se reactiva el padre automáticamente | US-030 AC-4 | Propuesto |
| `409 ORGANIZATION_ALREADY_INACTIVE` y `…_ALREADY_ACTIVE` | API-SPEC-006 §3.5 y §3.6 | Propuesto |
| SCR-030-01 a 04: diálogos de confirmación, de bloqueo, de fecha y de reactivación bloqueada | SCR-030, GEN-030 | **Hojas por estado, sin consolidar**; informes de accesibilidad previos (ARP-SCR-030) en `fail` |

## 2. Reglas

- **No se borra nada:** prohibido `DELETE` para la cuenta de la aplicación (BR-PTY-21).
- Reactivar solo es posible con padre Activo (BR-PTY-24, BR-PTY-25). Si el padre anterior está Inactivo, este se reactiva antes (BR-PTY-24, EVD-2026-0139); la API no lo reactiva automáticamente (API-SPEC-006 §3.6).
- Desactivar no se permite con unidades hijas activas ni personas con pertenencia vigente (BR-PTY-23). El conteo de personas depende de la pertenencia persona ↔ unidad que registra US-015 (en curso).
- Permiso: Jefe de Ingeniería y ADMIN (EVD-2026-0238).

## 3. Interfaz

Diálogos con foco inicial en «Cancelar», foco atrapado, Escape que cancela y retorno del foco a la fila; tras confirmar, el foco va a la fila y se anuncia «Inactiva». El diálogo de bloqueo anuncia los conteos y «Cerrar» devuelve el foco. El diálogo de reactivación con fecha enlaza el error «Indica la fecha desde» al campo. Es el componente de mayor riesgo de accesibilidad (diálogo, brecha de CMP-017-Q3: dónde se aloja).

## 4. Estado del diseño

Es la capacidad con **más trabajo de diseño pendiente**: sin hoja consolidada, sin informe de accesibilidad en `pass` y sin las pruebas específicas de CHK-UNIDADES-001 (foco atrapado y retorno en cada diálogo).

## 5. Pruebas

Un caso por AC de US-030 y por fila de error: desactivar sin dependencias, bloqueo con conteos, reactivar con padre Activo, reactivación bloqueada con padre Inactivo (con el nombre y el `id` del padre), ya inactiva o ya activa, concurrencia y `403`. Verificar que ninguna operación borra filas ni deja vigencias solapadas.

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
