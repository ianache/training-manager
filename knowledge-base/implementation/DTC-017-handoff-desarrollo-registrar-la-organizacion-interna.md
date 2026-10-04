---
okf: google-okf-v0.2
artifact: DTC-017
id: dtc-017-registrar-la-organizacion-interna
title: "DTC-017 — Handoff de Desarrollo: Registrar la organización interna (US-017)"
description: "Contrato de desarrollo de la organización interna (COMSATEL) con razón social y RUC. Pendiente de decidir cómo se carga, porque queda fuera de la API gestionada."
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
  - id: us-017
    title: "US-017"
    type: user-story
    link: /knowledge-base/requirement/user-stories/US-017-gestionar-estructura-organizacional.md
  - id: flw-017
    title: "FLW-017"
    type: user-flow
    link: /knowledge-base/design/user-flows/FLW-017-registrar-la-organizacion-interna.md
  - id: scr-017
    title: "SCR-017"
    type: screen-spec
    link: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
  - id: gen-017
    title: "GEN-017"
    type: generation
    link: /knowledge-base/design/generations/GEN-017-stitch-registrar-la-organizacion-interna.md
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

# DTC-017 — Registrar la organización interna (US-017)

**Estado: `REQUIRES_REVIEW`.** Dejar registrada la organización interna con su razón social y su RUC y rechazar un RUC ya registrado (US-017 AC-1 y AC-2).

## 1. Qué se implementa

| Pieza | Fuente | Estado |
|---|---|---|
| Registro de la organización interna con razón social y RUC | US-017 AC-1 | **Sin mecanismo definido** |
| Rechazo de un RUC ya registrado | US-017 AC-2, BR-PTY-07 | `POST /organizations` ya lo hace con `409 ORGANIZATION_DUPLICATE` |
| Pantallas SCR-017-01 a 03 (organización registrada, formulario, acceso no autorizado) | SCR-017 | Hojas de Stitch; consolidada solo SCR-017-02 |

## 2. Decisión (2026-10-04) y qué se implementó

Decisión de ianache tras explorar tres opciones: **carga inicial por migración**, sin endpoint ni formulario (BR-PTY-28). Diseño aprobado por ianache antes de implementar.

**Implementado** en `party-management-service` (con TDD contra PostgreSQL 15):
- Migración `0006_internal_org`: si no existe una organización con el rol `INTERNAL_ORGANIZATION`, inserta la parte, la organización, el rol vigente y el RUC (tipo `RUC`, país `PE`); si ya existe, no hace nada. `downgrade` retira solo lo que creó (autor `migration-0006`).
- La razón social y el RUC salen de `INTERNAL_ORG_NAME` e `INTERNAL_ORG_RUC`. Si faltan, el RUC no tiene 11 dígitos, ya está registrado o el nombre supera 200 caracteres, la migración se detiene sin crear nada. El «20123456789» de los diseños es un dato de muestra: **no es el RUC real**.
- Pruebas: `tests/schema/test_internal_organization_seed.py` (8 casos) y `tests/conftest.py` fija valores de prueba para el resto de la suite.
- `docker-compose.yml` pasa las dos variables al servicio y `.env.example` las documenta (sin valores).

**Consecuencias que debes conocer**
- **Primer arranque:** el entrypoint del servicio ejecuta `alembic upgrade head`. Al reconstruir la imagen, el contenedor no arrancará hasta definir `INTERNAL_ORG_NAME` e `INTERNAL_ORG_RUC` en `.env`, porque la base de desarrollo todavía no tiene la organización interna.
- **SCR-017-02 (formulario) queda sin uso** y SCR-017-01 solo la muestra; US-017 AC-1 (registrar) se cumple con la carga inicial, no con una pantalla.
- **Pregunta abierta:** cómo lee SCR-017-01 ese registro. BR-PTY-28 la deja fuera de `/organizations`, así que hace falta un contrato de lectura (por ejemplo `GET /organizations?type=internal_organization` solo de lectura, o una ruta propia). Sin decidir.

## 3. Reglas

BR-PTY-02, 03 y 07 (RUC único por número y país, 11 dígitos); BR-PTY-17 (Jefe de Ingeniería y ADMIN); BR-PTY-28. Cambiar el RUC o la razón social después de registrar queda sin decidir (UXR-017-Q2).

## 4. Pruebas

AC-1 y AC-2 de US-017, el caso de DNI o formato de persona (`400 VALIDATION_ERROR`) y la autorización. Dependen de la decisión de la sección 2.

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
