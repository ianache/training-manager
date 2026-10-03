---
id: FLW-019
type: User Flow
title: "FLW-019 — Asignar un Rol-Nivel a una persona"
description: "Flujo para ver las asignaciones de Rol-Nivel de un colaborador vigente, asignar un rol, cambiar su nivel y consultar el historial."
tags: [ux-ui, user-flow, party, rol-nivel]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-03T23:45:00-05:00"
sources:
  - id: uxr-019
    resource: /knowledge-base/design/ux-requirements/UXR-019-asignar-rol-nivel.md
  - id: us-019
    resource: /knowledge-base/requirement/user-stories/US-019-asignar-rol-nivel.md
  - id: dsp-001
    resource: /knowledge-base/requirement/scope-packs/DSP-001-catalogo-de-roles-y-niveles.md
requirements: [US-019, UXR-019]
screens: [SCR-019-01, SCR-019-02, SCR-019-03]
---

# FLW-019 — Asignar un Rol-Nivel a una persona

## Trazabilidad

- **Lineage:** US-019 (AC-1 a AC-5) → UXR-019 → FLW-019 → SCR-019-01..03.
- **Reglas:** BR-PTY-11, BR-PTY-12, BR-PRF-01 a 03, BR-CAT-09, BR-CAT-14, BR-PTY-14, BR-PTY-17. Decisiones del 2026-10-03: EVD-2026-0145, 0146, 0151.
- **Pantallas (IDs reservados):**

| SCR | Propósito en el flujo |
|---|---|
| SCR-019-01 | Rol-Nivel de la persona (en su ficha): vigentes, historial, sin asignaciones, sin permisos |
| SCR-019-02 | Asignar un rol o cambiar el nivel: elegir rol y nivel del catálogo y fecha desde; aviso de que cierra el anterior; bloqueo con las competencias pendientes (AC-5) |
| SCR-019-03 | Confirmación del resultado o del bloqueo (persona no vigente, Rol-Nivel no disponible) |

Cada SCR debe declarar `flow: FLW-019`.

## Happy path

**Actor:** Jefe de Ingeniería (o ADMIN, por EVD-2026-0151). **Objetivo:** subir a una persona de Developer Junior 2 a Junior 3. **Precondición:** la persona es un colaborador vigente.

1. Abre la ficha de la persona y ve sus Rol-Nivel vigentes (SCR-019-01).
2. Elige «Cambiar nivel» en el rol Developer (SCR-019-02): ve los niveles que define el rol y la fecha desde.
3. Selecciona Junior 3. El sistema comprueba las competencias de los niveles inferiores (AC-5) y avisa de que Junior 2 quedará cerrado.
4. Confirma; el sistema cierra Junior 2 y abre Junior 3 desde esa fecha, con auditoría (BR-PTY-12).
5. Éxito (SCR-019-03) y SCR-019-01 muestra Junior 3 vigente y Junior 2 en el historial (AC-3, AC-4).

**Variante asignar un rol nuevo:** en SCR-019-02 elige un rol que la persona no tiene y su nivel (AC-1, AC-2).

## Excepciones, permisos y estados

| Id | Situación | Comportamiento del flujo | Origen |
|---|---|---|---|
| E1 | Faltan competencias de los niveles inferiores | No se permite; se listan las pendientes | AC-5, BR-PRF-03 |
| E2 | Rol-Nivel que no existe o que el rol no define | No se ofrece; si desapareció, aviso «no disponible en el catálogo» | BR-CAT-09 |
| E3 | Persona no vigente | No se asigna | EVD-2026-0146 |
| E4 | Persona anonimizada | No se edita | BR-PTY-14 |
| E5 | Usuario sin permiso | No ve las acciones | BR-PTY-17, UXR-000.2 |
| E6 | Catálogo no responde | Error con reintento; no se permite asignar | ADR-011 |
| E7 | Error al guardar | Mensaje con reintentar sin perder lo ingresado | UXR-000 |
| E8 | Se vuelve a elegir el mismo nivel vigente | Sin cambio: se avisa (sin regla, FLW-019-Q5) | propuesta |

**Estados de SCR-019-01:** cargando, sin asignaciones, con asignaciones e historial, error de carga, solo lectura. **SCR-019-02:** inicial, validando, bloqueado por AC-5, guardando, error. **SCR-019-03:** éxito, bloqueado.

**Permisos:** Jefe de Ingeniería y ADMIN asignan y cambian niveles (EVD-2026-0145, 0151; ADMIN asignando un rol nuevo: FLW-019-Q1). Cualquier colaborador ve el rol de una persona (BR-PTY-20, BR-TRA-03).

**Accesibilidad (UXR-000, WCAG 2.2 AA):** etiquetas ligadas, errores con `role="alert"`, foco al primer error o al bloqueo, teclado completo, contraste 4.5:1; el bloqueo AC-5 no depende solo del color.

**Fuera de este flujo:** nivel inicial al registrar (FLW-015, paso Rol-Nivel); evaluación de la evolución de un nivel; definir el catálogo (FLW-001).

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| ~~FLW-019-Q1~~ | ~~¿ADMIN también asigna un Rol-Nivel nuevo, y se ajusta BR-PTY-17? (UXR-019-Q1)~~ Respondida (ianache, 2026-10-03): sí (EVD-2026-0163). | Jefe de Ingeniería | Alta | Permisos de SCR-019-02 |
| ~~FLW-019-Q2~~ | ~~¿«Haber cumplido» = certificada en el L que exige el Rol-Nivel inferior? (UXR-019-Q2)~~ Respondida (ianache, 2026-10-03): sí (EVD-2026-0164). | Jefe de Ingeniería | Alta | E1 |
| ~~FLW-019-Q3~~ | ~~¿Basta con los niveles inferiores o también el destino? (UXR-019-Q3, P-42)~~ Respondida (ianache, 2026-10-03): también las del nivel destino, todas certificadas (lectura A, EVD-2026-0169, 0172). El bloqueo E1 lista las pendientes de los niveles inferiores y del destino. | Jefe de Ingeniería | Media | E1 |
| ~~FLW-019-Q4~~ | ~~¿ADMIN puede saltarse AC-5 al cambiar directamente el nivel? (UXR-019-Q4)~~ Respondida (ianache, 2026-10-03): no (EVD-2026-0170). | Jefe de Ingeniería | Alta | E1 |
| ~~FLW-019-Q5~~ | ~~¿Se puede bajar de nivel? US-019 solo describe subir~~ Respondida (ianache, 2026-10-03): no se baja de nivel por ahora (EVD-2026-0166). | Jefe de Ingeniería | Media | SCR-019-02 |
