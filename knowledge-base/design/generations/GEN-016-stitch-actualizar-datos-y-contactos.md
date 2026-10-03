---
id: GEN-016
type: Generation Prompt
title: "GEN-016 — Diseño Stitch: Actualizar datos y medios de contacto"
description: "Prompts, pantallas generadas y revisión crítica del diseño exploratorio en Stitch para SCR-016-01 a SCR-016-06."
tags: [ux-ui, stitch, generation-prompt, us-016]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-02T23:59:00-05:00"
sources:
  - id: scr
    resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
  - id: flw
    resource: /knowledge-base/design/user-flows/FLW-016-actualizar-datos-y-contactos.md
  - id: dtm
    resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
  - id: cmp
    resource: /knowledge-base/design/components/CMP-016-componentes-actualizar-datos-y-contactos.md
  - id: tkn
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
flow: FLW-016
screens: [SCR-016-01, SCR-016-02, SCR-016-03, SCR-016-04, SCR-016-05, SCR-016-06]
---

# GEN-016 — Diseño Stitch: Actualizar datos y medios de contacto

> Diseño **exploratorio** (`exploration_design`). No está aprobado, no es el diseño gobernado y no tiene revisión de accesibilidad. Los datos que muestra son de ejemplo.

## Trazabilidad

- Proyecto Stitch: `STP-PPM-001` (no se copia aquí `external_ref`; ver el concepto).
- Screens: `SCR-016-01` a `SCR-016-06` → `FLW-016`. El vínculo SCR ↔ artefacto vive en `DTM-PPM-001` (entradas registradas con `register-exploration`, `version: not-exposed-by-stitch`).
- Componentes: ver [CMP-016](../components/CMP-016-componentes-actualizar-datos-y-contactos.md). Tokens: `TKN-SET-002`.

## Verificación en vivo del proyecto

- **Fecha:** 2026-10-02, con `get_project` y `list_design_systems` de Stitch.
- **Resultado:** el proyecto `projects/13050549605434273903` («Plataforma PPM») existe, es de escritorio y es visible; tenía 14 pantallas de «Registrar un colaborador» antes de esta generación. Tiene dos design systems: «Sovereign Enterprise» (`assets/bcea74e59ec041d7bc9ccac7f22e82dd`, azul) y **«Comsatel Styled»** (`assets/f23c7efd2fe44bd59183c1c4308d67f1`, versión 1, con los valores ajustados por `human:ianache`). Este último ya estaba cargado en el proyecto; no se creó ni se subió un DESIGN.md.
- **Proyecto nuevo:** no se creó (acción `REUSE`).
- **Preflight:** `READY` para las seis pantallas.

## Cómo se aplicó «Comsatel Styled»

Cada generación pasó `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1`. El tema por defecto del proyecto sigue siendo «Sovereign Enterprise» (ver R-09); no se modificó.

## Pantallas generadas

> Esta tabla es la **generación inicial** (2026-10-02). Cinco de estas pantallas fueron reemplazadas el 2026-10-03; el estado vigente está en «Correcciones, regeneración y tema».

| SCR | Resource name (Stitch) | Título en Stitch |
|---|---|---|
| SCR-016-01 | `screens/b791efba47ec4bf6ab7deab7e8cf2545` | Editar datos de la persona — SCR-016-01 (Estados A, B, C y D) |
| SCR-016-02 | `screens/edcf7d6b2bc14d56b6f23bd03f04e375` | Editar medios de contacto con vigencia — SCR-016-02 (Estados A, B, C y D) |
| SCR-016-03 | `screens/fb1e88e68a4b4d60b3bf29270703e0f7` | SCR-016-03 — Mis perfiles profesionales (Estados A, B, C y D) |
| SCR-016-04 | `screens/ee7a2984ec50455c9433d6adce26d096` | SCR-016-04 — Editar mi teléfono laboral (Estados A, B, C y D) |
| SCR-016-05 | `screens/50ecff8ee6fe4c9fab84ec50645f4cfa` | SCR-016-05 — Ficha del colaborador con puntos de entrada de edición (Estados A, B, C y D) |
| SCR-016-06 | `screens/c40645bf0f9c4ad4888eccad6d8c520f` | SCR-016-06 — Historial de cambios de la ficha (Estados A, B, C y D) |

Stitch no expone una versión de cada artefacto. Cuatro de las seis llamadas (SCR-016-01, -02, -05 y -06) devolvieron `The operation timed out`; no se reintentaron y las cuatro pantallas aparecieron después en `list_screens`. Hay exactamente una pantalla por SCR (sin duplicados).

## Prompts (reproducibles)

`deviceType = DESKTOP`; `modelId` no se indicó (modelo por defecto de Stitch); `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1` en todos. Las seis pantallas son hojas comparativas de cuatro estados, como las de SCR-015.

### SCR-016-01

```text
SCR-016-01 — Editar datos de la persona (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar with product name "Plataforma de Gestión de Formación", the user name and "Cerrar sesión"; left sidebar with sections "MI DESARROLLO" (Mi perfil de competencias, Mi brecha) and "PERSONAS" (Colaboradores, active). Breadcrumb "Colaboradores / María García". This is a full PAGE, not a modal. Page title "Editar datos de la persona" with the person's name "María García" and code under it. Present the page as a state comparison sheet with four labeled variants of the same form stacked: A "Predeterminado", B "Error de validación", C "Identificación duplicada", D "Guardado con éxito". Form (single card, 12px radius): "Nombres *" (value María), "Apellidos *" (García), "Nombre preferido" (optional, helper "Máximo 50 caracteres"), "Tipo de identificación *" select (DNI; options DNI, Carné de extranjería, Pasaporte), "Número de identificación *" (40000003), "País emisor *" select (Perú). Buttons: "Guardar" (primary red, disabled when there are no changes or errors) and "Cancelar" (secondary). Short note below the form: "Los cambios conservan el valor anterior en el historial." and a contextual link line "Último cambio: 02/10/2026 14:35 por Jefe de Ingeniería. Ver historial". Variant B: Nombres has the value "J" with the error text "Mínimo 2 caracteres, sin caracteres especiales" in the error color with an error icon, Guardar disabled. Variant C: Número de identificación shows the error "La identificación DNI 40000003 (Perú) ya está registrada." Variant D: a success alert "Datos actualizados" at the top. Use clearly sample data; no real people. Never convey state by color alone: always icon plus text.
```

### SCR-016-02

```text
SCR-016-02 — Editar medios de contacto con vigencia (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell as the rest of the platform: top bar "Plataforma de Gestión de Formación" with user name and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores active). Breadcrumb "Colaboradores / María García". Full PAGE (not a modal) titled "Editar medios de contacto". State comparison sheet with four labeled variants stacked: A "Predeterminado", B "Correo disponible y lista de países abierta", C "Correo duplicado y teléfono inválido", D "Contactos actualizados". Section "Valores vigentes" (read-only): "Correo laboral" maria.garcia@example.com with a badge "Vigente desde 15/03/2026" (check icon + text) and "Teléfono laboral" +51 999 999 999 with the same kind of badge. Section "Nuevos valores": field "Nuevo correo laboral" (placeholder "ej. juan.nuevo@comsatel.com.pe") and the phone control "Nuevo teléfono laboral", which is ONE composite control: a country selector button showing a small flag, the dial code and a chevron (default Perú, +51), next to a digits-only number input. The country list when open shows two options, each with flag, country name and dial code: "Perú +51" (selected) and "Estados Unidos +1". The flag is decorative; the country name and dial code are always readable text. Email states: validating shows a spinner and "Validando…"; valid shows a check and "✓ Email disponible"; duplicate shows "✗ Ya en uso por Carlos Ruiz"; invalid format shows "Formato inválido". Phone invalid shows "Ingresa solo los 9 dígitos del número". Buttons "Guardar" (primary red; disabled until at least one valid change) and "Cancelar" (secondary). Note: "El cambio aplica de inmediato y el valor anterior queda en el historial." Variant D: confirmation panel "Contactos actualizados" listing "maria.garcia@example.com → maria.garcia@comsatel.com.pe" and "+51 999 999 999 → +51 987 654 321" plus a link "Ver historial". Sample data only. Never convey state by color alone.
```

### SCR-016-03

```text
SCR-016-03 — Mis perfiles profesionales (Colaborador). Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell: top bar "Plataforma de Gestión de Formación" with user name and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores active). Breadcrumb "Colaboradores / María García". Full PAGE (not a modal) titled "Mis perfiles profesionales". State comparison sheet with four labeled variants stacked: A "Con perfiles", B "Sin perfiles (vacío)", C "Agregando con «Otro» y URL inválida", D "Confirmar eliminación". Variant A: a list of current profiles; each row shows the platform name, the URL as a link and a text button "Eliminar": "LinkedIn — https://www.linkedin.com/in/maria-garcia-ejemplo" and "GitHub — https://github.com/mgarcia-ejemplo". Below, a card "Agregar perfil" with: "Plataforma *" select with options LinkedIn, GitHub, Otro; "URL del perfil *" input (placeholder "https://"); primary button "Agregar" and secondary "Cancelar". When "Otro" is chosen an extra required field "Nombre de la plataforma *" appears (placeholder "ej. Training Portal"). Variant B: empty state with the text "Aún no has agregado perfiles profesionales" and the Agregar perfil card. Variant C: plataforma "Otro", Nombre de la plataforma "Training Portal", URL "training" with the error "URL inválida" (error icon + text). Variant D: confirmation dialog over the page: title "¿Quitar el perfil GitHub de tu ficha?", text "Quedará en tu historial.", buttons "Eliminar" (primary) and "Cancelar". Sample data only. Never convey state by color alone.
```

### SCR-016-04

```text
SCR-016-04 — Editar mi teléfono laboral (Colaborador). Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell: top bar "Plataforma de Gestión de Formación" with user name and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores active). Breadcrumb "Colaboradores / María García". Full PAGE (not a modal) titled "Editar mi teléfono laboral". State comparison sheet with four labeled variants stacked: A "Predeterminado", B "Número válido (Estados Unidos)", C "Número inválido", D "Teléfono actualizado". Current value, read-only: "Teléfono laboral actual" +51 999 999 999 with a badge "Vigente desde 15/03/2026" (check icon + text). The new-phone control "Nuevo teléfono laboral" is ONE composite control: a country selector button with a small flag, the dial code and a chevron (default Perú, +51), next to a digits-only number input. The country list shows two options, each with flag, name and dial code: "Perú +51" and "Estados Unidos +1". The flag is decorative; the country name and dial code are always visible text. Variant B: Estados Unidos +1 selected, number 2025550143 entered, a positive message "✓ Formato correcto". Variant C: Estados Unidos +1 with the number 20255 and the error "Ingresa solo los 10 dígitos del número" (error icon + text). Variant A shows the helper text "El teléfono es igual al actual" only as a hidden/disabled-state note: Guardar is disabled when the new number equals the current one or is invalid. Buttons: "Guardar" (primary red) and "Cancelar" (secondary). Variant D: confirmation "Teléfono actualizado" with "+51 999 999 999 → +51 987 654 321" and a link "Ver historial". Sample data only. Never convey state by color alone.
```

### SCR-016-05

```text
SCR-016-05 — Ficha del colaborador con puntos de entrada de edición. Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell: top bar "Plataforma de Gestión de Formación" with user name and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores active). Link "← Colaboradores". Page header with the person name "María García" and, right-aligned, the edit actions. Below the header a tab list with two tabs "Resumen" (selected, underline and bold, not color alone) and "Historial". Resumen content: a definition list with Código, Correo laboral (maria.garcia@example.com), Tipo (Empleado), Teléfono laboral (+51 999 999 999), Identificación (DNI 40000003 (PE)), Registrado (02/10/2026 por seed); then a section "Rol-Nivel vigente e historial" with the text "Sin asignaciones de Rol-Nivel". State comparison sheet with four labeled variants stacked: A "Jefe de Ingeniería viendo a una persona": three buttons "Editar datos", "Editar contactos", "Editar perfiles". B "Colaborador viendo su propia ficha": two buttons "Editar perfiles profesionales" and "Editar teléfono laboral", tab "Historial" visible. C "Colaborador viendo a otra persona": no edit buttons, no tabs, and the Teléfono laboral and Identificación rows are not shown. D "Persona anonimizada": read-only banner "Persona anonimizada. Solo lectura.", no edit buttons, personal values masked. Sample data only. Never convey state by color alone.
```

### SCR-016-06

```text
SCR-016-06 — Historial de cambios de la ficha. Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell: top bar "Plataforma de Gestión de Formación" with user name and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores active). Link "← Colaboradores", header with the person name "María García", and the tab list "Resumen" and "Historial" (Historial selected, underline and bold). State comparison sheet with four labeled variants stacked: A "Jefe de Ingeniería (con datos)", B "Colaborador viendo su propio historial", C "Sin cambios registrados (vacío)", D "Filtros sin resultados". Filters row: "Categoría" select (Todas, Datos personales, Correo, Teléfono, Perfil profesional), date range "Desde" and "Hasta" (format dd/mm/aaaa), and "Realizado por" select — the "Realizado por" filter appears ONLY in variant A (the Jefe), not in B. Read-only audit table with caption "Historial de cambios" and columns: "Fecha y hora" (dd/mm/aaaa HH:mm, 24 h, hora de Lima), "Realizado por" (name and role), "Categoría", "Cambio" (Corrección, Cambio con vigencia, Perfil agregado, Perfil eliminado), "Campo o medio", "Valor anterior", "Valor nuevo", "Vigencia" (desde–hasta, only for contacts and profiles, shown with a badge "Vigente" or "Cerrada"). Show about 6 sample rows, newest first, for example 02/10/2026 14:35 · Jefe de Ingeniería · Correo · Cambio con vigencia · Correo laboral · maria.garcia@example.com · maria.garcia@comsatel.com.pe · Vigente desde 02/10/2026; and 01/10/2026 09:10 · Jefe de Ingeniería · Datos personales · Corrección · Apellidos · Garcia · García · (no vigencia). Pagination at the bottom: "Mostrando 1–10 de 27", buttons "Anterior" and "Siguiente", "Página 1 de 3". Variant C empty text: "Aún no hay cambios registrados". Variant D empty text: "Ningún cambio coincide con los filtros". Sample data only. Never convey state by color alone.
```

## Revisión crítica

Método: se descargó el HTML de cada pantalla, se compararon los textos del SCR con los textos del diseño y se buscó contenido inventado y contradicciones con las decisiones humanas; se vieron las capturas, **reducidas** (no se inspeccionó a resolución completa). El HTML de Stitch es una exploración y no es una referencia de accesibilidad.

**Cumplen:** los textos del SCR aparecen en las seis pantallas (01: 17 de 17, 02: 19 de 19, 03: 16 de 16 con «Training Portal» como valor del campo, 04: 14 de 14, 05: 15 de 15, 06: 20 de 20); la paleta es la de «Comsatel Styled» (primario `#bc0100`, terciario `#0059ba`) y no queda rastro del azul marino anterior; el historial usa fecha dd/mm/aaaa HH:mm con la columna «Realizado por» solo en la variante del Jefe; el teléfono es un control compuesto con selector de país; la página de edición no es un modal.

| ID | SCR | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| R-01 | 02, 04 | La confirmación muestra «Hoy, 10:45 AM», que contradice el formato decidido (dd/mm/aaaa HH:mm, 24 h, hora de Lima) | Media | Stitch | Editar con `edit_screens` a «02/10/2026 10:45» |
| R-02 | 06 | Aparece «Administrador General» como autor y como opción de «Realizado por», y «Sistema (Seed/Integración)». Solo el Jefe edita (BR-PTY-17) y el ADMIN queda fuera (SCR-016-Q19); «Sistema» sí está previsto (actor nulo), no el detalle «Seed/Integración» | Media | Stitch | Quitar al administrador; dejar «Jefe de Ingeniería», «María García (Colaborador)» y «Sistema» |
| R-03 | 06 | Una fila «Perfil eliminado» de «Twitter / X»: esa plataforma no existe (BR-PTY-09: LinkedIn, GitHub y «Otro») | Baja | Stitch | Cambiar por GitHub o «Otro: Training Portal» |
| R-04 | Todas | Anotaciones de lienzo inventadas: «Matriz de Estados…», bloques «Cumplimiento WCAG AA» con afirmaciones sobre accesibilidad, etiquetas «SCR-016-0N» y listas de aseguramiento de calidad | Media | Stitch | No son evidencia de accesibilidad; no usarlas como tal. El informe de `accessibility-reviewer` sigue pendiente |
| R-05 | Todas | Datos de ejemplo inventados: código «COL-2024-8839», rol «Analista de Aseguramiento de Calidad», cargo «Jefe de Ingeniería Operaciones de Formación». En SCR-016-02, «Ya en uso por Carlos Ruiz (Código COL-2023-4410)» agrega el código de la otra persona, que el SCR no pide | Media | Stitch | No copiar a la implementación; el mensaje es solo «✗ Ya en uso por {persona}» |
| R-06 | 02, 03, 04 | Textos ampliados que introducen reglas no decididas: «Debe incluir un protocolo válido (ej: https://miportal.com)» (la validación de URL sigue abierta, SCR-016-Q3), «(faltan 5 dígitos)», y «9 dígitos del teléfono móvil o fijo sin prefijo» | Media | Stitch | Usar solo «URL inválida» e «Ingresa solo los {n} dígitos del número» |
| R-07 | 02 | La bandera es un **emoji** (`🇵🇪`) y no una imagen vectorial; en Windows los emoji de bandera se muestran como letras. La decisión (CMP-ATOM-013) es SVG decorativo | Media | Stitch | La implementación usa SVG; en el diseño gobernado representar la bandera como imagen |
| R-08 | 05, 06 | Las pestañas son `tablist` en 05 y enlaces de navegación con `aria-current` en 06; la decisión es `tablist` (CMP-016-Q8) | Baja | Stitch | Unificar al diseñar el gobernado; la implementación sigue CMP-MOL-011 |
| R-09 | Proyecto | El tema del proyecto sigue siendo «Sovereign Enterprise» y las 14 pantallas de SCR-015 siguen en azul, lo que contradice la decisión de usar «Comsatel Styled» en toda la plataforma (TKN-Q1) | Media | Proyecto | Pendiente de decisión: aplicar «Comsatel Styled» a SCR-015 (`apply_design_system`) y como tema del proyecto. No se hizo |
| R-10 | 02, 04 | El estado «válido» usa un verde (`#006d3b`) que no existe en «Comsatel Styled»; en `@gf/ui` se conservó el verde anterior (`#065f46`) | Baja | Stitch | Decidir el color de éxito del design system |
| R-11 | Design system | Los colores con nombre que Stitch calculó para «Comsatel Styled» difieren del DESIGN.md (primario `#8f0100` frente a `#bc0100`; terciario `#00428e` frente a `#0059ba`); las pantallas usan `#bc0100` y `#0059ba` | Baja | Stitch | Verificar en el diseño gobernado |
| R-12 | 01, 02 | El HTML no tiene `role="alert"`/`aria-live` en los errores ni `combobox`/`listbox` en el selector de país | Baja | Stitch | Seguir CMP y SCR para accesibilidad; el HTML de Stitch no se toma como referencia |
| R-13 | — | Limitación del método: no se vieron las pantallas a resolución completa ni se verificó el comportamiento (solo texto, estructura y capturas reducidas) | Info | Revisión | Revisión humana de cada pantalla en Stitch |

## Preguntas abiertas

- ¿Se corrigen R-01, R-02, R-03 y R-06 con `edit_screens` ahora, o se esperan a la revisión humana de las pantallas?
- ¿Se aplica «Comsatel Styled» a las pantallas de SCR-015 y al tema del proyecto (R-09)?
- ¿Qué color de éxito usa el design system (R-10)?
- El diseño gobernado (Figma, `figma-design-validator`) y el informe de `accessibility-reviewer` siguen pendientes; esta exploración no los sustituye.

## Correcciones, regeneración y tema (2026-10-03)

Autorizado por `human:ianache`: reintentar las correcciones en SCR-016 y aplicar «Comsatel Styled» a las 14 pantallas de SCR-015.

### Qué pasó con `edit_screens`

La herramienta se comportó de tres maneras distintas, y por eso se pasó a regenerar:

- **SCR-016-05:** la edición se guardó en la misma pantalla y quedó verificada en el archivo exportado.
- **SCR-016-01 (dos intentos):** Stitch informó que aplicó los cambios, pero el archivo exportado siguió idéntico byte a byte; el segundo intento encontró de nuevo los textos originales, lo que confirma que el primero no se guardó.
- **SCR-016-02:** esta vez la herramienta creó una **pantalla nueva** (`7a1965fe65374dbfadfe96098e264820`) que corregía lo sospechoso pero perdió los estados «Validando» y «Formato inválido», el prefijo «+1» y el enlace «Ver historial», y su resumen indica que quitó un panel de reglas sin que se pidiera. Quedó sin registrar y sin usar.
- Las ediciones de 03, 04 y 06 (primer intento, en paralelo) tampoco se reflejaron en los archivos exportados.

### Estado vigente (registrado en `DTM-PPM-001`)

| SCR | Artefacto vigente | Cómo se obtuvo | Anterior (en `exploration_history`) |
|---|---|---|---|
| SCR-016-01 | `screens/ac1aa670517c4159a161ae680269cac6` | regenerado | `b791efba…` |
| SCR-016-02 | `screens/0a79e69a06a3476cbddac42aeb3648d7` | regenerado | `edcf7d6b…` |
| SCR-016-03 | `screens/4cefc05e98274cf1bb65c011126b87c4` | regenerado | `fb1e88e6…` |
| SCR-016-04 | `screens/afb2fe1acd504e42b689ddbf348eea12` | regenerado | `ee7a2984…` |
| SCR-016-05 | `screens/50ecff8ee6fe4c9fab84ec50645f4cfa` | editado en el lugar y verificado | — |
| SCR-016-06 | `screens/d0827d410d0649068a0dd8f90a6df955` | regenerado | `c40645bf…` |

Las pantallas anteriores siguen existiendo en el proyecto (Stitch no permite borrarlas con las herramientas disponibles) y quedan como historial. `list_screens` no mostró las pantallas nuevas en ninguna de las consultas, así que sus IDs se tomaron de la respuesta de cada generación y se verificaron descargando su HTML.

### Prompts de la regeneración

Parten de los prompts de la sección anterior con estos cambios, iguales en las cinco pantallas regeneradas:

- **Etiqueta de usuario de la barra superior** explícita: «Jefe de Ingeniería» (01, 02, 06) o «María García» (03, 04); sin cargo secundario.
- **Se quitó** la mención al código de la persona bajo el título.
- **Bandera** (02 y 04): imagen vectorial (SVG), «nunca emoji»; en 02, ambos prefijos «+51» y «+1» visibles y los cuatro estados del correo (validando, válido, duplicado, formato inválido) «deben aparecer».
- **Fecha** de la confirmación (02 y 04): «02/10/2026 10:45», nunca «Hoy» ni AM/PM.
- **Historial (06):** pestañas «reales» (no enlaces), autores solo «Jefe de Ingeniería», «María García (Colaborador)» y «Sistema», opciones del filtro «Realizado por» acotadas, plataformas solo LinkedIn, GitHub y «Otro», y filas de ejemplo dadas.
- **Cierre común:** «STRICT CONTENT RULES: use only the texts given here. Do NOT add specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, person codes, job titles, footers, or extra helper text.»
- `deviceType = DESKTOP` y `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1`, como antes.

Stitch **reescribe el prompt** antes de generar (cada respuesta trae el texto que usó), de modo que la reproducción exacta no está garantizada.

### Verificación de los HTML vigentes

Se descargó el HTML de cada pantalla y se repitieron las comprobaciones de la revisión inicial.

| SCR | Textos del SCR presentes | Resultado |
|---|---|---|
| SCR-016-01 | 17 de 17 | sin WCAG, códigos ni cargos; queda un rótulo «Matriz de…» |
| SCR-016-02 | 17 de 19 | **faltan «Validando» y «Formato inválido»**; sin emoji, sin «Hoy», con «Ver historial»; Stitch agregó un botón «Editar de nuevo» no pedido |
| SCR-016-03 | 16 de 16 (el valor «Training Portal» está en el campo) | sin hallazgos |
| SCR-016-04 | 14 de 14 | sin emoji ni «Hoy»; sin hallazgos |
| SCR-016-05 | 15 de 15 | verificada: sin códigos, WCAG ni cargos |
| SCR-016-06 | 20 de 20 | pestañas con `tablist`; sin «Administrador», Twitter ni «Seed»; fechas en dd/mm/aaaa HH:mm |

### Estado de los hallazgos de la revisión inicial

| ID | Estado |
|---|---|
| R-01 (fecha «Hoy…AM») | Resuelto en 02 y 04 |
| R-02 (administrador en el historial) | Resuelto en 06 |
| R-03 (Twitter/X) | Resuelto en 06 |
| R-04 (anotaciones y afirmaciones de accesibilidad) | Resuelto en 01 a 06; permanecen en 02, 04 y 06 una etiqueta con el texto «SCR-016-0N» y en 01 un rótulo «Matriz de…» |
| R-05 (códigos y cargos inventados) | Resuelto |
| R-06 (mensajes ampliados) | Resuelto en 02, 03 y 04 |
| R-07 (emoji de bandera) | Resuelto en 02 y 04 |
| R-08 (pestañas) | Resuelto en 06 |
| R-09 (tema del proyecto y SCR-015 en azul) | **Resuelto para las pantallas de SCR-015** (regeneradas en «Comsatel Styled» el 2026-10-03, ver GEN-015). **Abierto** el tema por defecto del proyecto, que sigue en «Sovereign Enterprise» |
| R-10, R-11, R-12, R-13 | Sin cambios |
| **R-14 (nuevo)** | SCR-016-02 no muestra los estados `validating` e `invalid-format` del correo, que SCR-016 exige, y trae un botón no pedido |
| **R-15 (nuevo)** | Del texto interno que Stitch usó se desprende contenido de ejemplo agregado por su cuenta (p. ej. «Mari» como nombre preferido, teléfonos de ejemplo en el historial, una fila de corrección hecha por «Sistema»); no se comprobó en todos los HTML |

### Aplicar «Comsatel Styled» a SCR-015 (`apply_design_system`)

- La herramienta **no modificó las 14 pantallas existentes**: devolvió 14 pantallas nuevas con otros IDs (`681bb943…`, `db1ad297…`, `5d694dd2…`, `2330f5ea…`, `5d1550e1…`, `c8f75f52…`, `2f48bacd…`, `1064eff0…`, `a4ee0a7b…`, `1f60848d…`, `b0c4bf8c…`, `f6aaee4e…`, `c12231bc…`, `856b1bd4…`).
- Todas siguen **vacías** (alto 0, sin HTML ni captura) en cada consulta del 2026-10-03, incluida la primera y la última de la lista; no se sabe si Stitch las está procesando o fallaron.
- `DTM-PPM-001` no se modificó para SCR-015: sigue apuntando a las pantallas originales (azules).
- **Tema del proyecto:** no se cambió; la única herramienta disponible (`update_design_system`) modifica un design system existente y habría sobrescrito «Sovereign Enterprise».

### Preguntas abiertas

- SCR-016-02 sin los estados `validating` e `invalid-format` (R-14): **decisión de `human:ianache` (2026-10-03, «conforme»)**: se acepta como exploración incompleta. Los estados faltantes siguen exigidos por SCR-016 para el diseño gobernado y para la implementación.
- Las 14 pantallas de tema de SCR-015 siguen vacías: **decisión de `human:ianache` (2026-10-03, «conforme»)**: se descartan y se regeneró SCR-015 con `generate_screen_from_text` (ver GEN-015). Las 14 quedan como residuo sin registrar.
- ¿Cómo se fija «Comsatel Styled» como tema del proyecto sin sobrescribir «Sovereign Enterprise»?
- El diseño gobernado (Figma, `figma-design-validator`) y el informe de `accessibility-reviewer` siguen pendientes; esta exploración no los sustituye.
