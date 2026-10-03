---
id: GEN-029
type: Generation Prompt
title: "GEN-029 — Diseño Stitch: Registrar y editar unidades organizacionales"
description: "Prompts, pantallas generadas y revisión crítica del diseño exploratorio en Stitch para SCR-029-01 a SCR-029-04. INCOMPLETO: solo SCR-029-01 y SCR-029-02 tienen artefacto verificado; SCR-029-03 y SCR-029-04 agotaron el tiempo de espera y no aparecieron."
tags: [ux-ui, stitch, generation-prompt, us-029]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-03T18:00:00-05:00"
sources:
  - id: scr
    resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
  - id: flw
    resource: /knowledge-base/design/user-flows/FLW-029-registrar-y-editar-unidades-organizacionales.md
  - id: uxr
    resource: /knowledge-base/design/ux-requirements/UXR-029-registrar-y-editar-unidades-organizacionales.md
  - id: dtm
    resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
  - id: tkn
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
flow: FLW-029
screens: [SCR-029-01, SCR-029-02, SCR-029-03, SCR-029-04]
---

# GEN-029 — Diseño Stitch: Registrar y editar unidades organizacionales

> Diseño **exploratorio** (`exploration_design`). No está aprobado, no es el diseño gobernado y no tiene revisión de accesibilidad. Los datos que muestra son de ejemplo. **Estado: incompleto** (2 de 4 pantallas verificadas).

## Trazabilidad

- Proyecto Stitch: `STP-PPM-001` (acción `REUSE`; no se creó proyecto). El vínculo SCR ↔ artefacto vive en `DTM-PPM-001` y **aún no se registró** (pendiente de decisión humana).
- Screens: `SCR-029-01` a `SCR-029-04` → `FLW-029`. Reglas de referencia: BR-PTY-12, 17, 22 (sin ciclos), 25 (padre Activo), 26 (nombre único entre hermanas).
- Tokens: `TKN-SET-002` (Comsatel Styled).

## Verificación en vivo del proyecto

- **Fecha:** 2026-10-03 (verificación hecha por el orquestador antes de esta ejecución; preflight `READY`).
- Proyecto `projects/13050549605434273903` («Plataforma PPM»), escritorio, con el design system «Comsatel Styled» (`assets/f23c7efd2fe44bd59183c1c4308d67f1`). No se creó ni subió DESIGN.md.

## Pantallas generadas

| SCR | Resource name (Stitch) | Título en Stitch | Estado |
|---|---|---|---|
| SCR-029-01 | `projects/13050549605434273903/screens/00d2d9ec2ecc4fa79429d957ea2e01e8` | SCR-029-01 — Registrar unidad (Estados A, B, C, D, E, F y G) | Verificada (HTML descargado). La llamada dio timeout; apareció en `list_screens` |
| SCR-029-02 | `projects/13050549605434273903/screens/f497a2997e144bd29856800143c8fd1d` | SCR-029-02 — Editar nombre de una unidad (Estados A, B, C, D y E) | Verificada (HTML descargado). ID tomado de la respuesta de la generación; **no apareció** en ninguna consulta de `list_screens` (confirmado con `get_screen`) |
| SCR-029-03 | — (no obtenido) | — | **Sin artefacto**: la llamada dio timeout y la pantalla no apareció en 10 consultas de `list_screens` |
| SCR-029-04 | — (no obtenido) | — | **Sin artefacto**: la llamada dio timeout y la pantalla no apareció en 10 consultas de `list_screens` |

Stitch no expone una versión del artefacto. Tres de las cuatro llamadas (01, 03, 04) devolvieron `The operation timed out`; no se reintentaron. `list_screens` devuelve subconjuntos distintos del proyecto en cada consulta (de unas 40 a 45 pantallas), por lo que 03 y 04 podrían existir y no estar listadas; **no se inventan IDs**. No se detectaron duplicados de SCR-029-01 ni de SCR-029-02.

## Prompts (reproducibles)

`deviceType = DESKTOP`; `modelId` no se indicó; `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1` en todos. Hojas comparativas de estados. Stitch reescribe el prompt antes de generar, así que la reproducción exacta no está garantizada. Los textos marcados «(texto de muestra)» no tienen fuente en el SCR (mensajes de campo vacío, error al guardar, éxito, sin organización, acceso no autorizado).

### SCR-029-01

```text
SCR-029-01 — Registrar unidad (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar with product name "Plataforma de Gestión de Formación", the user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar with sections "MI DESARROLLO" (Mi perfil de competencias, Mi brecha) and "PERSONAS" (Colaboradores), plus an active item "Unidades organizacionales". Breadcrumb "Unidades organizacionales / Registrar unidad". Full PAGE, not a modal, titled "Registrar unidad". Present as a state comparison sheet with six labeled variants of the same form stacked: A "Predeterminado", B "Campos obligatorios vacíos", C "Nombre duplicado", D "Ciclo o unidad padre inactiva (respaldo del servidor)", E "Error al guardar", F "Registrada con éxito". Form in a single card (12px radius) with fields: "Nombre *" (text input), "Unidad padre *" (searchable combobox; the list offers only active units, example options "Ingeniería", "Operaciones de Formación" as sample data), "Fecha desde *" (date input, dd/mm/aaaa). Buttons: "Registrar" (primary red) and "Cancelar" (secondary). Variant B: errors in line under the empty fields; for the date: "Indica la fecha desde"; for the empty name and parent show a short generic required-field message marked as sample text. Variant C: Nombre error "Ya existe una unidad con este nombre bajo Ingeniería" with error icon. Variant D: Unidad padre error "Crearía un ciclo en la jerarquía" and, in another instance, "Solo se pueden elegir unidades activas". Variant E: an error alert with a "Reintentar" button and the entered values preserved. Variant F: success alert confirming the unit was registered (sample text) with the unit highlighted in a small list excerpt. Also show a small separate panel variant G "Sin organización interna": registering is blocked with a message that the internal organization must be registered first (sample text). Do NOT include any "Eliminar" action anywhere. Use clearly sample data only. Never convey state by color alone: always icon plus text. STRICT CONTENT RULES: use only the texts given here. Do NOT add extra fields (no code, description or manager), specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, footers, or extra helper text.
```

### SCR-029-02

```text
SCR-029-02 — Editar nombre de una unidad (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell: top bar "Plataforma de Gestión de Formación" with user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores) plus active item "Unidades organizacionales". Breadcrumb "Unidades organizacionales / Editar nombre". Full PAGE, not a modal, titled "Editar nombre de la unidad". State comparison sheet with five labeled variants stacked: A "Predeterminado", B "Nombre vacío", C "Nombre duplicado", D "Error al guardar", E "Nombre actualizado". Read-only context at top: the unit name and its current parent (sample data: unit "Calidad de Software", parent "Ingeniería"). One card with field "Nombre *" (text input prefilled with the current name "Calidad de Software"). Buttons: "Guardar" (primary red; disabled when there are no changes or errors) and "Cancelar" (secondary). Variant B: empty name with an error in line (sample text). Variant C: Nombre "Pruebas" with error "Ya existe una unidad con este nombre bajo Ingeniería" (error icon + text). Variant D: error alert with "Reintentar", entered value preserved. Variant E: success alert (sample text) showing the unit with its new name. No date field and no reason field. No "Eliminar" action anywhere. Sample data only. Never convey state by color alone. STRICT CONTENT RULES: use only the texts given here. Do NOT add specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, footers, or extra helper text.
```

### SCR-029-03

```text
SCR-029-03 — Cambiar unidad padre (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell: top bar "Plataforma de Gestión de Formación" with user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores) plus active item "Unidades organizacionales". Breadcrumb "Unidades organizacionales / Cambiar unidad padre". Full PAGE titled "Cambiar unidad padre". State comparison sheet with six labeled variants stacked: A "Predeterminado", B "Ciclo", C "Unidad padre inactiva", D "Resumen previo a confirmar", E "Error al guardar", F "Unidad padre cambiada". Read-only current value (sample data): unit "Calidad de Software", "Unidad padre actual: Ingeniería" with a badge "Vigente desde 15/03/2026" (check icon + text). Fields: "Nueva unidad padre *" (searchable combobox, keyboard operable, lists only active units, never the unit itself or its descendants; sample options "Operaciones de Formación", "Tecnología") and "Fecha desde *" (date, dd/mm/aaaa; error text "Indica la fecha desde"). Buttons: "Continuar" (primary red, disabled until a new parent is chosen) and "Cancelar" (secondary). Variant B: error under Nueva unidad padre "Crearía un ciclo en la jerarquía". Variant C: error "Solo se pueden elegir unidades activas". Variant D: confirmation dialog over the page with summary "de Ingeniería a Operaciones de Formación" and buttons "Confirmar" and "Volver". Variant E: error alert with "Reintentar", values preserved. Variant F: success alert (sample text) stating the parent changed. No "Eliminar" action anywhere. Sample data only. Never convey state by color alone. STRICT CONTENT RULES: use only the texts given here. Do NOT add counts of affected descendants, extra dialog content, specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, footers, or extra helper text.
```

### SCR-029-04

```text
SCR-029-04 — Historial de relaciones y vigencias de la unidad (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. Same app shell: top bar "Plataforma de Gestión de Formación" with user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar "MI DESARROLLO" and "PERSONAS" (Colaboradores) plus active item "Unidades organizacionales". Breadcrumb "Unidades organizacionales / Calidad de Software / Historial". Full PAGE titled "Historial de relaciones de la unidad" with unit name "Calidad de Software". Read-only. State comparison sheet with five labeled variants stacked: A "Con datos", B "Cargando", C "Sin cambios registrados (vacío)", D "Error al cargar", E "Sin acceso". Variant A: table with caption "Historial de relaciones", newest first, columns "Padre anterior", "Padre nuevo", "Desde", "Hasta", "Realizado por". The current relation has an empty "Hasta" and a badge "Vigente" (check icon + text, not color alone). Sample rows (dd/mm/aaaa): 02/10/2026 · Ingeniería → Operaciones de Formación · Hasta empty · Vigente · Jefe de Ingeniería; 15/03/2026 – 01/10/2026 · Tecnología → Ingeniería · Jefe de Ingeniería. Pagination at the bottom with "Anterior" and "Siguiente". Variant B: loading skeleton. Variant C empty text: "Aún no hay cambios registrados". Variant D: error message with "Reintentar". Variant E: message that the user is not authorized (sample text), no table. No edit or "Eliminar" actions. Sample data only. Never convey state by color alone. STRICT CONTENT RULES: use only the texts given here. Do NOT add extra columns, specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, footers, or extra helper text.
```

## Revisión crítica

Método: se descargó el HTML de SCR-029-01 y SCR-029-02 y se compararon sus textos con el SCR, UXR-029 y las reglas BR-*; se buscó contenido inventado y contradicciones con decisiones humanas. **No se inspeccionaron las capturas** (solo texto y estructura del HTML). El HTML de Stitch es una exploración y no es una referencia de accesibilidad. SCR-029-03 y SCR-029-04 **no se revisaron** porque no tienen artefacto.

**Cumplen (01 y 02):** paleta «Comsatel Styled» (`primary #bc0100`, `tertiary #0059ba`); sin acción «Eliminar» (0 apariciones en ambos HTML; BR-PTY-12/21); sin afirmaciones WCAG (0 apariciones); mensajes de regla tal como en el SCR («Ya existe una unidad con este nombre bajo Ingeniería», «Crearía un ciclo en la jerarquía», «Solo se pueden elegir unidades activas», «Indica la fecha desde»); el selector de padre de 01 ofrece solo unidades marcadas «Activa» (BR-PTY-25); 02 no pide fecha ni motivo (SCR-029-Q5) y muestra la unidad y su padre como solo lectura; «Guardar» deshabilitado sin cambios o con error (02); error al guardar con «Reintentar» y valor conservado.

| ID | SCR | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| R-01 | 01, 02 | Textos de campo vacío con la leyenda literal «Campo obligatorio (texto de muestra)»: el mensaje no tiene fuente (SCR-029-Q8). La etiqueta «(texto de muestra)» quedó dentro de la interfaz | Baja | Prompt | No usar como texto final; decidir el mensaje (Q8) |
| R-02 | 01, 02 | Mensajes de error al guardar inventados: «Ocurrió un error al intentar guardar los datos en el servidor» (01) y «Ocurrió un error al guardar los cambios en el servidor» (02); el SCR solo exige mensaje con reintento | Baja | Stitch | No copiar; redactar en el diseño gobernado |
| R-03 | 01 | Variante F agrega los botones «Registrar otra unidad» y «Volver a unidades» y una tarjeta con «Ingeniería de Software», «Activa» y fecha 03/10/2026. El SCR define solo confirmación visible y retorno al listado con la unidad resaltada; «Registrar otra unidad» no existe en la fuente | Media | Stitch | Quitar «Registrar otra unidad»; el retorno al listado resaltado se diseña con SCR-028 |
| R-04 | 01 | Variante G (sin organización interna): el SCR dice que impide registrar y remite a UXR-017; el diseño muestra el aviso «Debe registrar primero la organización interna (texto de muestra)» y el formulario de campos, sin evidencia de enlace/remisión a UXR-017 | Media | Stitch | Verificar el remitido en el diseño gobernado |
| R-05 | 01 | «Unidad padre *» aparece obligatoria sin excepción. El SCR dice «Sí, salvo la unidad superior»; cómo se registra la unidad superior está abierto (SCR-029-Q3) | Media | Prompt/Spec | No se resuelve aquí; sigue como SCR-029-Q3 |
| R-06 | 01, 02 | Menú lateral con un ítem «Unidades organizacionales» (activo), migas «Unidades organizacionales / …» y el título de 02 «Editar nombre de la unidad» (el SCR dice «Editar nombre de una unidad»). El SCR no define el shell de unidades; la navegación se tomó del patrón de GEN-016 y del listado UXR-028 | Baja | Prompt | Confirmar la navegación con el SCR del listado (UXR-028/SCR-028) |
| R-07 | 02 | Etiqueta «Actualizado» junto al nombre en la variante E y texto de éxito con comillas «Aseguramiento de la Calidad»: contenido de ejemplo y badge sin fuente | Baja | Stitch | No copiar |
| R-08 | 01, 02 | Estados del SCR **no representados**: `loading`, `saving`, `unsaved-changes` y `forbidden` (01 y 02); `disabled` solo en 02. La hoja de estados se limitó a los comparativos pedidos | Info | Prompt | Cubrirlos en el diseño gobernado (Figma) |
| R-09 | 01, 02 | El diseño no demuestra BR-PTY-22 (sin ciclos) ni BR-PTY-26 en el comportamiento: solo muestra los mensajes del respaldo del servidor; el selector «sin ciclos» se ve únicamente por la ausencia de opciones | Info | Revisión | Verificación humana de cada pantalla |
| R-10 | 03, 04 | Sin artefacto: no se pudo revisar el resumen «de X a Y» (AC-3), la restricción de ciclo/inactivo ni el historial (Flow 4) | Alta | Stitch | Decisión humana: regenerar 03 y 04 (ver preguntas) |
| R-11 | Design system | Los colores con nombre calculados por Stitch para «Comsatel Styled» difieren del DESIGN.md (`primary #8f0100` frente a `#bc0100`; `tertiary #00428e` frente a `#0059ba`), igual que en R-11 de GEN-016; las pantallas usan `#bc0100`/`#0059ba` | Baja | Stitch | Verificar en el diseño gobernado |
| R-12 | Todas | Limitación del método: solo se revisó texto y estructura de 01 y 02; no se vieron las capturas ni se verificó comportamiento ni accesibilidad (el informe de `accessibility-reviewer` sigue pendiente) | Info | Revisión | Revisión humana |

## Preguntas abiertas

- SCR-029-03 y SCR-029-04 no tienen artefacto verificado: ¿se autoriza regenerarlas con `generate_screen_from_text` (con riesgo de duplicados si las primeras llamadas sí se completaron), o se busca antes en la interfaz de Stitch por título «SCR-029-03» y «SCR-029-04»?
- ¿Se registran 01 y 02 en `DTM-PPM-001` (`register-exploration`) antes de completar 03 y 04?
- Se mantienen abiertas SCR-029-Q1 a Q15 (en particular Q3, Q8 y Q10); esta exploración no las resuelve.
- El diseño gobernado (Figma, `figma-design-validator`) y el informe de `accessibility-reviewer` siguen pendientes.
