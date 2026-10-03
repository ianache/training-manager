---
type: Screen
title: SCR-016 — Actualizar datos y medios de contacto
description: Especificación de pantallas para que el Jefe de Ingeniería corrija datos y cambie contactos con vigencia, y para que el colaborador edite sus perfiles profesionales y su teléfono laboral.
tags:
- ux-ui
- screen
- party
- c2
- contactos
status: draft
generated:
  by: ui-spec-writer/1.1
  at: '2026-10-02T00:00:00-05:00'
sources:
- id: flw-016
  resource: /knowledge-base/design/user-flows/FLW-016-actualizar-datos-y-contactos.md
- id: uxr-016
  resource: /knowledge-base/design/ux-requirements/UXR-016-actualizar-datos-y-contactos.md
- id: us-016
  resource: /knowledge-base/requirement/user-stories/US-016-actualizar-datos-y-contactos.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: scr-015
  resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
screens:
- id: SCR-016-01
  name: Editar datos de la persona (Jefe de Ingeniería)
  flow: FLW-016
  requirements: &req
  - US-016
  - UXR-016
  required_states:
  - default
  - loading
  - validation-error
  - duplicate-identification
  - saving
  - success
  - disabled
  - forbidden
  - read-only-anonymized
  responsive: &resp
  - desktop
  a11y_requirements: &a11y
  - WCAG-2.2-AA
  - keyboard-nav
  - focus-visible
  - accessible-names
  - error-announcement
  components: &cmp
  - CMP-015
  - CMP-016
  - CMP-ATOM-013
  - CMP-MOL-007
  - CMP-ORG-001
  - CMP-MOL-008
  - CMP-MOL-009
  - CMP-MOL-010
  - CMP-MOL-011
  - CMP-ORG-002
  - CMP-ORG-003
  - CMP-EXT-001
  - CMP-EXT-002
  tokens: &tok
  - TKN-color-primary
  - TKN-color-on-primary
  - TKN-color-surface
  - TKN-color-on-surface
  - TKN-color-on-surface-variant
  - TKN-color-outline
  - TKN-color-outline-variant
  - TKN-color-tertiary
  - TKN-color-error
  - TKN-color-error-container
  - TKN-font-family
  - TKN-radius-default
  - TKN-space-md
  - TKN-space-lg
- id: SCR-016-02
  name: Editar medios de contacto con vigencia (Jefe de Ingeniería)
  flow: FLW-016
  requirements: *req
  required_states:
  - default
  - loading
  - validating
  - valid
  - duplicate
  - invalid-format
  - disabled
  - saving
  - success
  - error
  - forbidden
  - read-only-anonymized
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-016-03
  name: Mis perfiles profesionales (Colaborador)
  flow: FLW-016
  requirements: *req
  required_states:
  - default
  - loading
  - empty
  - adding
  - validation-error
  - confirm-delete
  - saving
  - success
  - error
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-016-04
  name: Editar mi teléfono laboral (Colaborador)
  flow: FLW-016
  requirements: *req
  required_states:
  - default
  - loading
  - empty
  - invalid-format
  - disabled
  - saving
  - success
  - error
  - forbidden
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-016-05
  name: Ficha del colaborador — puntos de entrada de edición
  flow: FLW-016
  requirements: *req
  required_states:
  - default
  - loading
  - error
  - self
  - other-person
  - read-only-anonymized
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
- id: SCR-016-06
  name: Historial de cambios
  flow: FLW-016
  requirements: *req
  required_states:
  - default
  - loading
  - empty
  - error
  - forbidden
  - anonymized
  responsive: *resp
  a11y_requirements: *a11y
  components: *cmp
  tokens: *tok
---

# SCR-016 — Actualizar datos y medios de contacto

Especificación independiente de herramienta (sin referencias a Stitch ni a Figma). Sigue la estructura de SCR-015. Tokens: «Comsatel Styled» (`TKN-SET-002`), vigente desde 2026-10-02.

## Trazabilidad

- **Historia:** US-016 (AC-1 a AC-5, casos negativos §6, estados §10).
- **Requisitos UX:** UXR-016 → **Flujo:** FLW-016 (flujos 1 a 4; la ficha es el punto de entrada).
- **Reglas:** BR-PTY-07 (identificación única), BR-PTY-08 (correo obligatorio y único entre vigentes), BR-PTY-09 (contactos y perfiles), BR-PTY-12 (no se sobrescribe; vigencias; auditoría), BR-PTY-14 (anonimizada no se edita), BR-PTY-17 (permisos de edición), BR-PTY-20 (visibilidad de datos de otras personas).
- **Dependencias:** US-015 (la persona debe existir); para el colaborador, US-022 (identidad de acceso).
- **Alcance de dispositivo:** solo escritorio, igual que SCR-015 (supuesto heredado, ver SCR-016-Q10).

## Permisos por actor

| Actor | Puede editar | No puede |
|---|---|---|
| Jefe de Ingeniería | Datos simples, correo laboral, teléfono laboral y perfiles de cualquier persona no anonimizada; consultar el historial de cualquiera | Editar a una persona anonimizada |
| Colaborador (sobre sí mismo) | Perfiles profesionales y teléfono laboral; consultar su propio historial | Nombres, identificación, correo laboral (AC-5); datos o historial de otra persona |
| ADMIN (rol de plataforma) | Nada sobre personas en esta historia, por decisión de `human:ianache` (SCR-016-Q19) | Editar y consultar el historial |
| Otros | Nada | — |

## SCR-016-01 — Editar datos de la persona (Jefe de Ingeniería)

**Propósito:** corregir nombres, apellidos, nombre preferido e identificación (AC-1). Decisión de `human:ianache` (2026-10-02, SCR-016-Q6): **se conserva el historial**; el valor anterior no se pierde y el cambio queda auditado (quién, cuándo, valor anterior y nuevo). Esto reemplaza la hipótesis H-1 de US-016 («sobrescribe sin vigencia»). El historial se consulta en SCR-016-06.

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Nombres | texto | Sí | mínimo 2 caracteres, sin caracteres especiales: «Mínimo 2 caracteres, sin caracteres especiales» | UXR-016 |
| Apellidos | texto | Sí | ídem | UXR-016 |
| Nombre preferido | texto | No | máximo 50: «Máximo 50 caracteres» | UXR-016 |
| Tipo de identificación | selector | Sí | opciones DNI, Carné de extranjería, Pasaporte | SCR-015-03 |
| Número de identificación | texto | Sí | única (BR-PTY-07): «La identificación {tipo} {número} ({país}) ya está registrada.» | SCR-015-03, US-016 §6 |
| País emisor | selector | Sí | lista de países como en SCR-015-03 | SCR-015-03 |

**Acciones:** «Guardar» (principal; deshabilitada sin cambios o con errores) y «Cancelar». Al guardar con éxito: confirmación «Datos actualizados» y regreso a la ficha (FLW-016, flujo 1).

**Estados:** default (datos actuales precargados); loading (carga y guardado); validation-error; duplicate-identification; success; disabled (Guardar); forbidden («No tienes permiso para editar esta persona»); read-only-anonymized (persona anonimizada, solo lectura, BR-PTY-14). *Empty* no aplica: la pantalla siempre parte de una persona existente.

## SCR-016-02 — Editar medios de contacto con vigencia (Jefe de Ingeniería)

**Propósito:** registrar un nuevo correo laboral y/o teléfono laboral cerrando la vigencia anterior y abriendo una nueva (AC-2, BR-PTY-12).

**Valores vigentes (solo lectura):** correo laboral y teléfono laboral actuales con indicación «Vigente desde {fecha}». El teléfono laboral es opcional (BR-PTY-09): si no existe, se muestra como no registrado.

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Nuevo correo laboral | correo | No (al menos un cambio) | formato válido «Formato inválido»; único entre vigentes: «✗ Ya en uso por {persona}» (BR-PTY-08); validación asíncrona con estados validating y valid («✓ Email disponible») | UXR-016, FLW-016 |
| Nuevo teléfono laboral | **organismo teléfono**: selector de país + número | No (al menos un cambio) | países: Perú (predeterminado, +51) y Estados Unidos (+1), cada uno con su bandera; el número se valida según el país (reglas propuestas en SCR-016-Q16) | decisión de `human:ianache`, SCR-016-Q2 y Q16 |

No se puede dejar a la persona sin correo laboral vigente (BR-PTY-08). La unicidad del teléfono **no** es una regla de negocio y no se valida.

**Acciones:** «Guardar» (principal; habilitada solo con al menos un cambio válido) y «Cancelar». Al guardar con éxito: confirmación «Contactos actualizados» con el cambio «{anterior} → {nuevo}» y regreso a la ficha (FLW-016, flujo 2). El cambio **aplica de inmediato**: la vigencia nueva abre en el momento del cambio, sin fechas futuras ni fecha editable (decisión de `human:ianache`, SCR-016-Q9).

**Estados:** default; loading; validating; valid; duplicate; invalid-format; disabled (Guardar sin cambios); saving; success; error (fallo del servidor, reintentar); forbidden; read-only-anonymized.

## SCR-016-03 — Mis perfiles profesionales (Colaborador)

**Propósito:** que el colaborador agregue y quite sus perfiles profesionales en línea (AC-3). Solo opera sobre su propia ficha (BR-PTY-17).

**Lista de perfiles vigentes:** plataforma, URL y acción «Eliminar». Estado vacío: «Aún no has agregado perfiles profesionales» (texto propuesto, sin fuente).

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Plataforma | selector | Sí | LinkedIn, GitHub, Otro; lista ampliable (ver SCR-016-Q4) | BR-PTY-09 |
| Nombre de la plataforma | texto | Sí, solo si la plataforma es «Otro» | placeholder «ej. Training Portal»; longitud máxima por definir (SCR-016-Q20) | decisión de `human:ianache`, CMP-016-Q10 |
| URL del perfil | texto (URL) | Sí | «URL inválida» (la validación de formato está abierta, ver SCR-016-Q3) | UXR-016, US-016-Q1 |

**Acciones:** «Agregar» (principal), «Eliminar» por perfil con confirmación y «Cancelar». Decisión de `human:ianache` (2026-10-02, SCR-016-Q5): **eliminar cierra la vigencia del perfil**, no lo borra; deja de aparecer en la lista de vigentes y se conserva en el historial (BR-PTY-12, SCR-016-06). El texto de confirmación debe decir que se quita de la ficha y se conserva en el historial; redacción exacta pendiente (propuesta: «¿Quitar el perfil {plataforma} de tu ficha? Quedará en tu historial.»).

**Estados:** default; loading; empty; adding; validation-error; confirm-delete; saving; success; error; forbidden («No puedes editar perfiles de otra persona»).

## SCR-016-04 — Editar mi teléfono laboral (Colaborador)

**Propósito:** que el colaborador cambie su propio teléfono laboral cerrando la vigencia anterior (AC-4). El colaborador no edita correo, nombres ni identificación (AC-5).

**Valor vigente (solo lectura):** teléfono actual con «Vigente desde {fecha}»; si no tiene teléfono, estado empty («Sin teléfono laboral registrado»).

| Campo | Componente | Oblig. | Validación y mensaje | Fuente |
|---|---|---|---|---|
| Nuevo teléfono laboral | **organismo teléfono**: selector de país + número | Sí | países: Perú (predeterminado, +51) y Estados Unidos (+1), con bandera; el número se valida según el país (SCR-016-Q16); distinto del actual: «El teléfono es igual al actual» | decisión de `human:ianache` (SCR-016-Q2 y Q16), FLW-016 |

**Acciones:** «Guardar» (principal; deshabilitada si es igual al actual o inválido) y «Cancelar». Al guardar con éxito: confirmación «Teléfono actualizado» con «{anterior} → {nuevo}» y regreso a la ficha (FLW-016, flujo 4).

**Estados:** default; loading; empty; invalid-format; disabled; saving; success; error; forbidden («No puedes editar teléfono de otra persona»).

## SCR-016-05 — Ficha del colaborador: puntos de entrada de edición

**Propósito:** exponer, según el actor, las acciones que llevan a SCR-016-01 a SCR-016-04. La ficha completa pertenece a US-023; aquí solo se especifican los puntos de entrada (ver SCR-016-Q11).

| Situación | Acciones visibles |
|---|---|
| Jefe de Ingeniería viendo a una persona | «Editar datos», «Editar contactos», «Editar perfiles»; pestaña «Historial» (propuesta, SCR-016-Q18) |
| ADMIN viendo a una persona | Ninguna acción de edición ni historial (SCR-016-Q19) |
| Colaborador viendo su propia ficha | «Editar perfiles profesionales», «Editar teléfono laboral»; pestaña «Historial» con su propio historial |
| Colaborador viendo a otra persona | Ninguna acción de edición ni historial; no ve teléfono ni identificación (BR-PTY-20) |
| Persona anonimizada | Ninguna acción; solo lectura (BR-PTY-14) |

**Navegación propuesta (SCR-016-Q18):** la ficha se organiza en dos pestañas, «Resumen» y «Historial», con ruta propia para la segunda (enlace directo). Detalle de la propuesta en SCR-016-06.

**Estados:** default; loading; error; self; other-person; read-only-anonymized.

## SCR-016-06 — Historial de cambios

**Propósito:** consultar lo que cambió en la ficha de una persona, sin perder lo anterior. Existe por decisión de `human:ianache` (2026-10-02): el historial se conserva al corregir datos simples (SCR-016-Q6) y al cerrar vigencias de contactos y perfiles (SCR-016-Q5, BR-PTY-12), y SCR-016-Q15 confirmó que hace falta una pantalla.

**Quién lo ve (decisiones de `human:ianache`, 2026-10-02, SCR-016-Q18 y Q19):** el colaborador ve **su propio** historial y el Jefe de Ingeniería ve el de cualquier persona. El ADMIN no tiene acceso, en línea con BR-PTY-17 (la información maestra la mantiene el Jefe de Ingeniería); no hace falta modificar BR-PTY-17 ni BR-PTY-20.

**Contenido (propuesta del agente según buenas prácticas de registros de auditoría; pendiente de confirmación, SCR-016-Q18):** una tabla de solo lectura, de lo más reciente a lo más antiguo, con una fila por cambio y estas columnas:

| Columna | Contenido |
|---|---|
| Fecha y hora | Momento del cambio: dd/mm/aaaa y hora de 24 h (HH:mm), en hora de Lima (UTC−5) (CMP-016-Q6) |
| Realizado por | Nombre y rol de quien lo hizo («Sistema» si no fue una persona) |
| Categoría | Datos personales, Correo, Teléfono o Perfil profesional |
| Cambio | Corrección, Cambio con vigencia (cierra y abre), Perfil agregado o Perfil eliminado (cierra vigencia) |
| Campo o medio | Cuál (por ejemplo «Apellidos», «Correo laboral», «GitHub») |
| Valor anterior | El valor antes del cambio (vacío si es un alta) |
| Valor nuevo | El valor después del cambio (vacío si es una baja) |
| Vigencia | Desde y hasta, solo para contactos y perfiles |

Prácticas aplicadas: registro inmutable y cronológico, respuesta a quién, qué, cuándo, antes y después en una sola fila, ningún dato transmitido solo por color, encabezados de tabla accesibles y paginación.

**Filtros propuestos:** categoría, rango de fechas y «realizado por» (este último solo para el Jefe, porque el colaborador solo ve su propio historial).

**Cómo se llega (propuesta):**
1. **Pestaña «Historial»** en la ficha (SCR-016-05), junto a «Resumen», con ruta propia para poder compartir el enlace.
2. **Enlace contextual en cada página de edición** (SCR-016-01 a -04): «Último cambio: {fecha} por {quién}. Ver historial», que abre la pestaña con la categoría ya filtrada.
3. **Tras guardar con éxito**, la confirmación ofrece «Ver historial» para que quien edita compruebe que el cambio quedó registrado.

Por qué esta propuesta: el historial pertenece a una persona, así que vive en su ficha y conserva el contexto; se descubre sin depender de un menú global; los enlaces contextuales llevan al registro relevante sin perder lo que se estaba editando; y una pestaña es operable con teclado y lector de pantalla. Alternativas descartadas: ítem de menú global (separa el historial de la persona), panel lateral (poco ancho para mostrar «anterior» y «nuevo») y ventana emergente por campo (fragmenta la consulta).

**Estados:** default (lista de cambios); loading; empty («Aún no hay cambios registrados», texto propuesto); error (fallo del servidor, reintentar); forbidden; anonymized (los valores históricos de una persona anonimizada están anonimizados, BR-PTY-14); forbidden (un colaborador que intenta ver el historial de otra persona, o un ADMIN).

## Implementation Requirements

Biblioteca: `@gf/ui` (Angular 22, componentes standalone). Sin `@angular/material` ni `@angular/cdk`. Los componentes de `CMP-015` que aplican son Text-Input, Select-Dropdown, Error-Alert, Loading-Button y Confirmation-Dialog. Donde `CMP-015` no cubre el caso, la fila lo indica y remite a SCR-016-Q12. Decisión de `human:ianache` (2026-10-02): **todo componente usado debe tener su CMP**; los CMP faltantes se especificaron en CMP-016 (índice) y sus archivos `cmp-016/` (estado `REQUIRES_REVIEW`). El developer no sustituye componentes sin revisión de UX.

### SCR-016-01 — Component Inventory

| Componente | Tipo | Props | Validadores | Estados | A11y |
|---|---|---|---|---|---|
| nombres | text-input (CMP-015) | label, required | required, minLength(2), sin especiales | normal, focus, error, disabled | aria-required, aria-invalid, aria-describedby |
| apellidos | text-input | label, required | ídem | ídem | ídem |
| nombrePreferido | text-input | label | maxLength(50) | normal, focus, error | aria-invalid |
| tipoIdentificacion | select (CMP-015) | label, opciones | required | normal, open, selected | role combobox/listbox, aria-expanded |
| numeroIdentificacion | text-input | label, required | required, único (asíncrono) | normal, validating, valid, duplicate | aria-invalid, role alert |
| paisIdentificacion | select | label, opciones | required | normal, open, selected | aria-expanded |
| Guardar / Cancelar | button (CMP-015 Loading-Button) | variant, loading | — | default, disabled, loading | foco visible |
| Aviso de error | alert (CMP-015 Error-Alert) | message | — | visible | role alert, aria-live |

### SCR-016-02 — Component Inventory

| Componente | Tipo | Props | Validadores | Estados | A11y |
|---|---|---|---|---|---|
| vigente (correo/teléfono) | badge de vigencia (CMP-MOL-008) | valor, desde | — | solo lectura | texto accesible, no solo color |
| nuevoCorreoLaboral | email-input con estados asíncronos (CMP-EXT-002) | label, placeholder | email, único entre vigentes (debounce 300 ms, timeout 5 s según implementación) | normal, validating, valid, duplicate, invalid | aria-invalid, aria-describedby, aria-live polite |
| nuevoNumeroTelefonico | **organismo teléfono** (selector de país con bandera + número; CMP-ORG-001, CMP-MOL-007, CMP-ATOM-013) | label, país por defecto (Perú), placeholder | número válido según país | normal, valid, invalid, disabled | grupo con nombre accesible; selector y número con etiqueta propia; la bandera es decorativa (aria-hidden) y el país se identifica por nombre y prefijo en texto; aria-invalid, aria-describedby |
| Guardar / Cancelar | button | variant, loading | — | default, disabled, loading | foco visible |
| Confirmación | dialog (CMP-015 Confirmation-Dialog) | resumen anterior→nuevo | — | visible | role dialog, foco atrapado, Escape |

### SCR-016-03 — Component Inventory

| Componente | Tipo | Props | Validadores | Estados | A11y |
|---|---|---|---|---|---|
| Lista de perfiles | lista de perfiles (CMP-ORG-002) | perfiles | — | vacía, con datos | lista semántica, nombre accesible por ítem |
| plataforma | select | opciones | required | normal, open, selected | aria-expanded |
| nombrePlataforma (solo «Otro») | text-input | label, placeholder «ej. Training Portal» | required si la plataforma es «Otro» | normal, error | aria-required, aria-invalid, aria-describedby |
| urlPerfil | text-input tipo URL (CMP-EXT-001) | label, placeholder | URL válida (abierto, Q3) | normal, error | aria-invalid, aria-describedby |
| Agregar / Eliminar | button | variant | — | default, disabled, loading | foco visible |
| Confirmar eliminación | dialog (CMP-015 Confirmation-Dialog) | mensaje | — | visible | role dialog, foco atrapado |

### SCR-016-04 y SCR-016-05 — Component Inventory

| Pantalla | Componente | Tipo | Validadores | Estados |
|---|---|---|---|---|
| 04 | vigente | badge de vigencia (CMP-MOL-008) | — | solo lectura |
| 04 | nuevoNumeroTelefonico | organismo teléfono: selector de país + número (CMP-ORG-001) | válido según país; distinto del actual | normal, valid, invalid, disabled |
| 04 | Guardar / Cancelar, Confirmación | button, dialog | — | default, disabled, loading |
| 05 | Acciones de edición | button | visibilidad por actor (tabla de SCR-016-05) | visible, oculta |
| 05 | Navegación Resumen / Historial | pestañas (CMP-MOL-011) | — | seleccionada, no seleccionada |

### SCR-016-06 — Component Inventory

| Componente | Tipo | Validadores | Estados |
|---|---|---|---|
| Lista de cambios | tabla de auditoría (CMP-ORG-003) | — | vacía, con datos, cargando, error |
| Etiqueta de vigencia | badge de vigencia (CMP-MOL-008) | — | solo lectura |
| Filtros (categoría, fechas, realizado por) | selector nativo (CMP-015) y rango de fechas (CMP-MOL-010) | rango de fechas válido | default, aplicado |
| Paginación | paginación (CMP-MOL-009) | — | default, deshabilitada en los extremos |

### Implementation Checklist

- [ ] Todos los componentes de los inventarios mapeados a `@gf/ui` o declarados como brecha (Q12).
- [ ] Validadores síncronos y asíncronos enumerados.
- [ ] Estados de cada pantalla cubiertos por el diseño.
- [ ] Atributos de accesibilidad y navegación por teclado especificados (WCAG 2.2 AA).
- [ ] Preguntas bloqueantes resueltas antes de generar el diseño (ver abajo).

### Handoff Instructions for Developers

- **Framework y dependencias:** Angular 22 (componentes standalone), `@gf/ui`, tokens semánticos `--gf-*` (nunca valores crudos).
- **Sistema de diseño:** `TKN-SET-002` «Comsatel Styled». No se usa Material Design 3 (la plantilla genérica lo menciona; el repositorio lo prohíbe en `@gf/ui`).
- **Binding:** todo componente del inventario se implementa; sin sustituciones sin revisión de UX.
- **Verificación posterior:** el diseño gobernado de cada SCR (referenciado desde su DTM, aún inexistente) es la referencia visual; hasta que exista, no se afirma «coincidencia visual».
- **Referencias cruzadas:** flujo FLW-016; historia US-016; requisitos UXR-016.

## Preguntas abiertas

| ID | Pregunta | Bloquea | Origen |
|---|---|---|---|
| SCR-016-Q1 | **Resuelta** (`human:ianache`, 2026-10-02): la edición es una **página**, no un modal. DCP-016 (que asumía modal) queda corregido por esta decisión | — | FLW-016, DCP-016 |
| SCR-016-Q2 | **Resuelta** (`human:ianache`, 2026-10-02): el teléfono se captura con **selector de país + número** y el control es un **organismo** (Atomic Design). Sustituye el patrón `^+51\d{9}$` de UXR-016, que además estaba mal escrito. Deriva en SCR-016-Q16 | — | UXR-016 |
| SCR-016-Q3 | ¿Se valida el formato de URL y del teléfono? (US-016-Q1, abierta). La advertencia «dominio no coincide con la plataforma» de FLW-016 no tiene fuente y no se especifica | No | US-016-Q1 |
| SCR-016-Q4 | Plataformas: BR-PTY-09 y US-016 dicen LinkedIn, GitHub y «Otro» (lista ampliable). DCP-016 había agregado Twitter y GitLab sin fuente. ¿Quién amplía la lista y con qué criterio? Con «Otro» de nombre libre (CMP-016-Q10) la ampliación de la lista deja de ser urgente. | No | BR-PTY-09 |
| SCR-016-Q5 | **Resuelta** (`human:ianache`, 2026-10-02): eliminar un perfil **cierra su vigencia** (se conserva el historial, BR-PTY-12) | — | UXR-016 Q2 |
| SCR-016-Q6 | **Resuelta** (`human:ianache`, 2026-10-02): al corregir un dato simple **se conserva la historia con auditoría**. Reemplaza la hipótesis H-1 de US-016 (sobrescribir sin vigencia); US-016 debe actualizarse (SCR-016-Q17) | — | US-016, UXR-016 |
| SCR-016-Q7 | ¿Se notifica a la persona o al Jefe cuando cambia un contacto? | No | UXR-016 Q1 |
| SCR-016-Q8 | Sin permisos: ¿se ocultan o se deshabilitan las acciones? FLW-016 propone «Solicitar acceso», sin fuente | No | US-016 §10 |
| SCR-016-Q9 | **Resuelta** (`human:ianache`, 2026-10-02): el cambio de contacto **aplica de inmediato**; no hay fechas futuras ni fecha editable, y por tanto no existe un estado de vigencia «pendiente» (CMP-016-Q11) | — | UXR-016 Q4 |
| SCR-016-Q10 | ¿Solo escritorio también para US-016? Se hereda de SCR-015 | No | SCR-015 |
| SCR-016-Q11 | La ficha pertenece a US-023 y no tiene FLW/SCR propio. ¿SCR-016-05 se mantiene aquí o se mueve al flujo de US-023? | No | US-023 |
| SCR-016-Q12 | **Resuelta** (`human:ianache`, 2026-10-02: todo componente con su CMP): se especificaron 11 CMP en `CMP-016` (7 nuevos genéricos, 2 de dominio, 2 ampliaciones; `gf-tel-input` queda deprecado). Quedan 13 preguntas abiertas en CMP-016 (CMP-016-Q1 a Q13) | — | CMP-016 |
| SCR-016-Q13 | `TKN-SET-001` y `TKN-SET-002` definen los mismos IDs (`TKN-color-primary`, `TKN-font-family`, `TKN-radius-default`, `TKN-space-md/lg`) con valores distintos y SCR-015 sigue citando TKN-SET-001. Hay que reconciliar | Gate | TKN-SET-001/002 |
| SCR-016-Q14 | No existe un AC-016 como artefacto de diseño; se usan AC-1 a AC-5 del propio US-016. ¿Se elabora AC-016? | No | US-016 |
| SCR-016-Q15 | **Resuelta** (`human:ianache`, 2026-10-02): **sí** hace falta historial. Se agregó la pantalla SCR-016-06; su acceso y alcance quedan en SCR-016-Q18 | — | US-016 §10, UXR-016 Q5 |
| SCR-016-Q16 | **Resuelta** (`human:ianache`, 2026-10-02): países Perú (predeterminado) y Estados Unidos con bandera; se **confirmaron** las propuestas: Perú 9 dígitos, Estados Unidos 10, valor guardado como número internacional completo (p. ej. `+51999999999`), bandera como imagen vectorial decorativa con nombre y prefijo en texto, lista ampliable. Especificado en CMP-ORG-001, CMP-MOL-007 y CMP-ATOM-013; `gf-tel-input` queda deprecado. Decisiones posteriores: sin separadores al teclear el número (CMP-016-Q3) y el teléfono de un país no soportado se muestra de solo lectura (CMP-016-Q4) | — | SCR-016-Q2 |
| SCR-016-Q17 | **Resuelta** (`human:ianache`, 2026-10-02: «ok»): se actualizaron US-016 (H-1 y AC-1) y BR-PTY-12 en BRC-001 para cubrir la historia de los datos simples (nombres, apellidos, nombre preferido e identificaciones). Queda por alinear SPEC-001:L113 («los datos simples se corrigen») y el servicio, que probablemente sobrescribe | — | SCR-016-Q6 |
| SCR-016-Q18 | **Resuelta con un detalle abierto** (`human:ianache`, 2026-10-02): se **confirmaron** las propuestas (columnas, filtros, pestaña «Historial» en la ficha, enlace contextual en las páginas de edición y «Ver historial» tras guardar); el colaborador ve el suyo y el Jefe de Ingeniería el de cualquiera (Q19). Abierto: contrato de datos del historial (no existe endpoint, CMP-016-Q9) | Diseño y datos | SCR-016-Q15 |
| SCR-016-Q19 | **Resuelta** (`human:ianache`, 2026-10-02): el acceso se mantiene **solo para el Jefe de Ingeniería** (y el colaborador sobre sí mismo); el ADMIN no ve ni edita personas ni su historial. Sin cambios en BR-PTY-17 ni BR-PTY-20 | — | BR-PTY-17 |
| SCR-016-Q20 | «Otro» pide un nombre de plataforma de texto libre (decisión de `human:ianache`, CMP-016-Q10, ejemplo «Training Portal»). ¿Longitud máxima y validación del nombre? El modelo de datos observado guarda un código de plataforma de una lista (`fk_profile_platform_code`) y la URL; no hay dónde guardar un nombre libre, así que requiere un cambio en el servicio de Party | Datos | CMP-016-Q10 |
