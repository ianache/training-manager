---
id: FLW-017
type: User Flow
title: "FLW-017 — Registrar la organización interna"
description: "Flujo del Jefe de Ingeniería para registrar COMSATEL como organización interna (razón social y RUC) y punto de entrega a la gestión de unidades."
tags: [ux-ui, user-flow, party, estructura-organizacional, organizacion-interna]
status: draft
generated:
  by: "user-flow-designer/1.1"
  at: "2026-10-03T15:00:00-05:00"
sources:
  - id: uxr-017
    resource: /knowledge-base/design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md
  - id: us-017
    resource: /knowledge-base/requirement/user-stories/US-017-gestionar-estructura-organizacional.md
  - id: uxr-028
    resource: /knowledge-base/design/ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md
requirements: [US-017, UXR-017]
screens: [SCR-017-01, SCR-017-02, SCR-017-03]
---

# FLW-017 — Registrar la organización interna

## Trazabilidad

- **Lineage:** US-017 (AC-1, AC-2) → UXR-017 → FLW-017 → SCR-017-01..03.
- **Reglas:** BR-PTY-02, BR-PTY-03, BR-PTY-07, BR-PTY-12, BR-PTY-17.
- **Alcance respecto a la familia:** UXR-017 es un UXR propio (no un marco vacío): cubre el registro de la organización interna. Este flujo diseña solo (a) la entrada a la gestión de la estructura en cuanto depende de que exista la organización interna, (b) el registro y (c) la consulta de la organización registrada. **No duplica** el listado/búsqueda de unidades (UXR-028, pantalla de entrada de la gestión una vez existe la organización), el alta/edición de unidades (UXR-029) ni desactivar/reactivar (UXR-030): FLW-017 solo entrega el control a FLW-028.
- **Pantallas (IDs reservados, sin especificar; las define `ui-spec-writer`):**

| SCR | Propósito en el flujo |
|---|---|
| SCR-017-01 | Organización interna: estado vacío inicial («aún no registrada») o vista de la organización registrada |
| SCR-017-02 | Registro de la organización interna (razón social, RUC, país emisor) con sus errores de validación y de guardado |
| SCR-017-03 | Acceso no autorizado a esta gestión |

Cada SCR debe declarar `flow: FLW-017`.

## Happy path

**Actor:** Jefe de Ingeniería. **Objetivo:** registrar COMSATEL como organización interna. **Precondición:** sesión con permiso BR-PTY-17.

1. El Jefe abre la gestión de la estructura organizacional.
2. El sistema consulta si existe organización interna.
3. No existe: SCR-017-01 en estado vacío inicial, que explica que falta COMSATEL y ofrece «Registrar organización interna» (distinto de un error de carga).
4. El Jefe abre SCR-017-02 e ingresa razón social, RUC y país emisor. El rol Organización interna lo fija el flujo (AC-1); la vigencia desde se muestra (UXR-017 §4); si la fija el usuario o el sistema es la pregunta FLW-017-Q1.
5. Confirma. El sistema valida, guarda y registra auditoría (BR-PTY-12).
6. Éxito: confirmación visible y SCR-017-01 muestra la organización registrada (razón social, RUC, país emisor, vigencia desde).
7. Desde la organización registrada, el Jefe continúa a la gestión de unidades: **entrega a FLW-028** (fuera de este flujo).

**Variante de entrada con organización ya registrada:** en el paso 3 el sistema muestra directamente la organización (SCR-017-01) y la acción de registrar no se ofrece (ver UXR-017-Q3 sobre más de una).

## Excepciones, permisos y estados

| Id | Situación | Comportamiento del flujo | Origen |
|---|---|---|---|
| E1 | RUC duplicado (mismo RUC y país) | El registro no se completa; error asociado al campo RUC («la identificación ya existe»), anunciado a lectores de pantalla (`role="alert"`); se conservan los datos ingresados | AC-2, BR-PTY-07 |
| E2 | Se ingresa identificación de persona (DNI) | Se rechaza; el campo solo admite RUC | BR-PTY-07 |
| E3 | Formato/longitud del RUC | Sin regla definida: pregunta UXR-017-Q1 | UXR-017-Q1 |
| E4 | Error al guardar | Mensaje con reintentar sin perder lo ingresado | UXR-000 |
| E5 | Error al cargar la organización | Estado de error distinto del vacío inicial, con reintento | UXR-017 §5 |
| E6 | Usuario sin permiso | No se muestra la acción; si accede, SCR-017-03 | BR-PTY-17 |
| E7 | Cancelar el registro | Vuelve a SCR-017-01 sin guardar; confirmación si hay datos sin guardar: no definida (ver Q5) | propuesta |

**Estados de SCR-017-01:** cargando, vacío inicial, organización registrada, error de carga, sin permiso.
**Estados de SCR-017-02:** inicial, validando/guardando, error de campo (RUC duplicado, DNI), error al guardar, éxito (retorna a SCR-017-01).

**Permisos**

| Actor | Ve | Hace |
|---|---|---|
| Jefe de Ingeniería | SCR-017-01, SCR-017-02 | Registra la organización interna |
| Otros usuarios | SCR-017-03 | Nada (BR-PTY-17, EVD-2026-0142) |

**Accesibilidad (UXR-000, WCAG 2.2 AA):** etiquetas ligadas a campos, errores con `role="alert"`, foco visible y manejo de foco hacia el primer error, teclado completo, contraste 4.5:1.

**Fuera de este flujo:** editar razón social/RUC una vez registrada (sin fuente, UXR-017-Q2); gestión de unidades (FLW-028/029/030); proveedores (US-018).

## Preguntas abiertas

Heredadas de UXR-017 (no resueltas, no se inventa respuesta):

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| UXR-017-Q1 | Formato y longitud del RUC (11 dígitos) y dígito verificador | Jefe de Ingeniería | Media | No |
| UXR-017-Q2 | Edición de razón social o RUC tras el registro | Jefe de Ingeniería | Baja | No |
| UXR-017-Q3 | Si puede haber más de una organización interna (afecta la variante de entrada) | Jefe de Ingeniería | Media | No |

Nuevas de este flujo:

| ID | Pregunta | Responsable | Prioridad | Bloquea |
|---|---|---|---|---|
| FLW-017-Q1 | ¿La «vigencia desde» la ingresa el Jefe (¿puede ser pasada o futura?) o el sistema la fija a la fecha de registro? UXR-017 la lista como contenido pero no como campo. | Jefe de Ingeniería | Media | No |
| FLW-017-Q2 | ¿El país emisor del RUC es un selector libre o está prefijado en Perú? | Jefe de Ingeniería | Baja | No |
| FLW-017-Q3 | ¿Tras el registro exitoso el sistema lleva automáticamente al listado de unidades (FLW-028) o permanece en la organización con un enlace? | Jefe de Ingeniería | Baja | No |
| FLW-017-Q4 | ¿Cómo se llega a la gestión (ítem de menú, ruta) y cómo se comporta la entrada cuando no hay organización: SCR-017-01 sustituye al listado de UXR-028 o éste remite a aquél? UXR-028 dice «remite a registrarla (UXR-017)»; falta confirmar quién es dueño de la pantalla de entrada. | Jefe de Ingeniería / UX | Media | No |
| FLW-017-Q5 | ¿Se pide confirmación al cancelar el registro con datos sin guardar? | Jefe de Ingeniería | Baja | No |
