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

## Actualización 2026-10-03 (SCR-029-03 y SCR-029-04)

Segundo intento de generación de SCR-029-03 y SCR-029-04 con los mismos prompts: ambas llamadas dieron de nuevo `The operation timed out` y no se reintentaron. `list_screens` y `get_project` no muestran pantallas con esos títulos, y sin su ID no se puede consultar con `get_screen`. **Siguen sin artefacto y sin registrar en `DTM-PPM-001`.** Antes de un tercer intento conviene decidir cómo evitar el duplicado (p. ej. generar una pantalla por llamada con un prompt más corto, o dividir las variantes en varias pantallas).

## Actualización 2026-10-03 (tercer intento, con prompts cortos)

Se regeneraron SCR-029-03 y SCR-029-04 con prompts más cortos y **un solo estado por pantalla** (sin hojas comparativas), una llamada cada una. Esta vez Stitch respondió sin timeout. Ambas verificadas con `get_screen` y registradas en `DTM-PPM-001` (`version: not-exposed-by-stitch`). Siguen sin aparecer en `list_screens`: el ID solo se conoce por la respuesta de la generación.

| SCR | Resource name (Stitch) | Título en Stitch |
|---|---|---|
| SCR-029-03 | `projects/13050549605434273903/screens/24e8c918d78d4db1ab9bc8a6a081e4db` | SCR-029-03 — Cambiar unidad padre (Jefe de Ingeniería) |
| SCR-029-04 | `projects/13050549605434273903/screens/4a7c7d12dfc2459db13fbefd5d8381cd` | SCR-029-04 — Historial de relaciones y vigencias de la unidad |

**Diferencias con el SCR y limitaciones:** (1) solo el estado predeterminado: faltan en el diseño los estados ciclo, padre inactivo, resumen previo a confirmar, error al guardar y éxito de SCR-029-03, y los estados cargando, vacío, error y sin acceso de SCR-029-04; (2) en SCR-029-04 la fila vigente muestra la insignia «Vigente» en la columna «Hasta» (el SCR pide «Hasta» vacío con la insignia en la relación vigente: criterio por confirmar); (3) en SCR-029-03 las opciones del selector llevan una insignia de estado activo no pedida; (4) la insignia «Vigente» se pintó en verde, color que no existe en «Comsatel Styled» (ver R-10 de GEN-016). **No se hizo la revisión crítica del HTML**; la revisión humana y la de accesibilidad siguen pendientes. Es exploración, no diseño gobernado.

## Hojas de estados adicionales y revisión crítica (2026-10-03)

Para cubrir los estados que faltaban se generaron tres hojas más, una llamada cada una. **No están en `DTM-PPM-001`**: el DTM admite un solo `exploration_design` por SCR y registrarlas habría reemplazado la pantalla principal. Su vínculo SCR ↔ artefacto vive aquí.

| SCR | Estados | Resource name (Stitch) |
|---|---|---|
| SCR-029-03 | B ciclo, C padre inactivo | `projects/13050549605434273903/screens/9571f3a48bc840fb98e9f8a7634ab050` |
| SCR-029-03 | D resumen previo, E error al guardar, F éxito | `projects/13050549605434273903/screens/a5558fd6fa2943e3a3fcafb0817db4e1` |
| SCR-029-04 | B cargando, C vacío, D error, E sin acceso | `projects/13050549605434273903/screens/781b835533004ced937b430e00def465` |

Revisión crítica (HTML descargado; textos y estructura comparados con SCR-029, UXR-029 y FLW-029; sin ver las capturas a resolución completa):

| ID | SCR | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| R-20 | 029-03 (B/C, D/E/F) | La barra lateral añade «Soporte» y «Ajustes»; B/C añade «Gestión Operativa / Comsatel Portal» y rótulos «Estado 01/02» | Media | Stitch | Contenido inventado; no copiar |
| R-21 | 029-03 (D) | El diálogo cambia el texto: «¿Deseas cambiar la unidad padre de Calidad de Software?» y «Fecha desde: 03/10/2026»; el SCR solo pide «de X a Y» (SCR-029-Q6) | Media | Stitch | Decisión de producto sobre contenido del resumen |
| R-22 | 029-03 (F) | La vista de éxito dice «Activo desde 03/10/2026» y muestra los campos del formulario | Baja | Stitch | Texto de éxito sin fuente |
| R-23 | 029-03 (A) | Las opciones del selector llevan la insignia «Activa» | Baja | Stitch | No especificado en SCR; coherente con BR-PTY-25 |
| R-24 | 029-04 | La insignia «Vigente» es verde (`emerald`), color ajeno a «Comsatel Styled», y ocupa la columna «Hasta» | Media | Stitch | Decidir color de éxito/vigencia (R-10 de GEN-016) y si «Hasta» va vacío |
| R-25 | 029-04 | La hoja de datos añade «Mostrando 2 de 2 registros» | Baja | Stitch | No pedido |
| R-26 | 030-04 | Anotaciones de lienzo «SCR-030-04 — …» y «A / B» | Baja | Stitch | No son UI |
| R-27 | 029-03, 029-04, 030-04 | Accesibilidad: las tres en `fail` (ver ARP-SCR-029-03, ARP-SCR-029-04, ARP-SCR-030-04) | Alta | Revisión | Corregir en el diseño gobernado |

No se halló «Eliminar» ni «Borrar» en ninguna. Es exploración, no diseño gobernado; la revisión humana sigue pendiente.

## Regeneración v2 (2026-10-03): éxito en verde y semántica de accesibilidad

Decisiones de `human:ianache`: el éxito y la vigencia usan el verde del design system, que se ajustó en Stitch (`Comsatel Styled` v2: roles `success` #065f46, `success-container` #ecfdf5, `success-outline` #a7f3d0, siempre con icono y texto); el diálogo de resumen de SCR-029-03 muestra solo «{unidad}: de X a Y»; la columna «Hasta» va vacía mientras no se defina su valor. Los prompts exigieron además `aria-hidden` en iconos, `label for`, `aria-invalid`/`aria-describedby`, `role=alert`/`status`, `caption`, `aria-label` en `nav` y `aria-current`. El DTM apunta a la primera hoja de cada pantalla (`version: v2-success-green`); las hojas de estados adicionales solo constan aquí. Los artefactos anteriores quedan en Stitch como residuo (no hay herramienta para borrarlos).

| Pantalla | Resource name (Stitch) |
|---|---|
| SCR-029-01 (A–D) | `projects/13050549605434273903/screens/b8210fe9bfd949ab8d64a8cf46ac9632` |
| SCR-029-01 (E–H) | `projects/13050549605434273903/screens/d14e0605943c4639a07570bda8e0782c` |
| SCR-029-03 (A–C) | `projects/13050549605434273903/screens/8c7e545751404313aee0ed6cd6c1c94a` |
| SCR-029-03 (D–F) | `projects/13050549605434273903/screens/8adf727de4b648bcbc3af8a945a27ac0` |
| SCR-029-04 (datos) | `projects/13050549605434273903/screens/c6e84489643249fda7636832f349a3a8` |
| SCR-029-04 (B–E) | `projects/13050549605434273903/screens/2c3406fbc34e48f584a73ed71e0bfe26` |

**Pendiente:** SCR-029-02 (editar nombre) no se regeneró: dos llamadas dieron timeout; sigue vigente su artefacto anterior (`f497a2997e144bd29856800143c8fd1d`). **Defectos abiertos** (ARP-UNIDADES-V2): SCR-029-01 incluye «Soporte» y «Ajustes» en la barra lateral; SCR-029-03 (D–F) tiene campos sin etiqueta y un verde fuera del design system.

Revisión de accesibilidad: [ARP-UNIDADES-V2](../handoff/ARP-UNIDADES-REGENERACION-v2.md). Es exploración, no diseño gobernado; revisión humana pendiente.

## Correcciones v3 (2026-10-03)

Dos hojas de una sola variante, generadas en serie, corrigen los defectos del ARP-UNIDADES-V2:

| Pantalla | Resource name (Stitch) | Corrige |
|---|---|---|
| SCR-029-01 (formulario vacío) | `projects/13050549605434273903/screens/12e3390b33c04a3e999434240a947ab2` | Sin «Soporte» ni «Ajustes» (solo queda un comentario HTML); 3 de 3 controles con `label for`; todas las `nav` con nombre. **Registrada en el DTM** (`version: v3-clean-shell`). |
| SCR-029-03 (E error al guardar, F éxito) | `projects/13050549605434273903/screens/1a449427811041479e3a60465018472f` | 2 de 2 campos con `label for`; iconos con `aria-hidden`; sin el verde `#059669`. No está en el DTM (que apunta a la hoja A–C). |

Las hojas de SCR-029-01 (A–D, E–H) y SCR-029-03 (D–F) anteriores quedan **reemplazadas** en lo que toca a esos defectos, pero conservan los estados de validación (SCR-029-01 B a D) y el resumen previo D de SCR-029-03, que no se regeneraron. **Pendientes:** el resumen D de SCR-029-03, SCR-029-02 y los estados C y E de SCR-028-01.

## Cierre de pendientes (2026-10-03, v3 en serie)

Con la fórmula «Create a NEW screen …» y una sola variante por llamada se generaron dos hojas más; HTML descargado y revisado (iconos ocultos o dentro de contenedores `aria-hidden`, controles con `label for`, `aria-invalid` + `aria-describedby`, sin «Soporte»/«Ajustes»):

| Pantalla | Resource name (Stitch) | Notas |
|---|---|---|
| SCR-029-03 (resumen previo D) | `projects/13050549605434273903/screens/34736ed5134349e6b5c37ee7bd9390ad` | Diálogo con `role`, `aria-modal`, `aria-labelledby`; cuerpo solo «Calidad de Software: de Ingeniería a Operaciones de Formación»; formulario de fondo atenuado. Cierra el pendiente del resumen. |
| SCR-029-02 (nombre duplicado) | `projects/13050549605434273903/screens/b00dc58356824c6d907d47c0932d7081` | Campo con etiqueta ligada, `aria-invalid`, `aria-describedby`, error con `role="alert"`. Complementa la hoja vigente del DTM (`f497a299…`, estados A a E), que no se reemplaza. |

Con esto, SCR-029-03 queda con todos sus estados regenerados (A–C, D, E–F). Los estados B a D de SCR-029-01 siguen solo en la hoja anterior (con «Soporte» y «Ajustes»). Una llamada de SCR-029-02 (estado predeterminado) respondió con texto pero sin devolver pantalla ni ID. Pendientes por timeout: SCR-028-01 C (sin resultados) y E (sin organización interna).

## SCR-029-01: estados de validación v4 (2026-10-04)

Tras el timeout, la hoja apareció en `list_screens` pasado un rato (la llamada sí había generado la pantalla). Verificada con `get_screen` y con el HTML descargado:

| Pantalla | Resource name (Stitch) | Revisión |
|---|---|---|
| SCR-029-01 (B campos obligatorios, C nombre duplicado, D unidad padre inactiva) | `projects/13050549605434273903/screens/2be6838e89aa48b898b98b11aa15e5fc` | Sin «Soporte» ni «Ajustes» (la única coincidencia es el valor de ejemplo «Soporte» del campo); 9 de 9 controles con `label for`; 4 errores con `role="alert"`, `aria-invalid` y `aria-describedby`; las 4 `nav` con `aria-label`; iconos ocultos. |

Con esta hoja, SCR-029-01 tiene sus estados A (`12e3390b…`), B a D (`2be6838e…`) y E a H (`d14e0605…`). La hoja E a H es la única que conserva «Soporte» y «Ajustes» en la barra lateral: pendiente de regenerar si se quiere eliminar ese defecto. Foco y teclado siguen sin evaluarse en navegador.

### SCR-029-01 v5 — correo laboral (2026-10-04)

Se añadió el campo «Correo laboral *» (BR-PTY-27, EVD-2026-0239) y se generó la hoja `projects/13050549605434273903/screens/f971cc7dc0c34577a14e8858dfb4bc64` (solo estado A, normal), registrada en el DTM como `exploration_design` vigente de SCR-029-01 (`v5-correo-laboral`); `12e3390b…` pasó a `superseded`. Dos ediciones y dos generaciones previas agotaron el tiempo de espera; la generación corta respondió tras subir `MCP_TOOL_TIMEOUT` a 600000. **Pendiente:** las hojas de los estados B a D (`2be6838e…`) y E a H (`d14e0605…`) no tienen el campo; el estado de errores debe mostrar «Ingrese un correo válido». El HTML de v5 no se revisó contra el SCR ni en accesibilidad.

**Estado B (errores de validación), 2026-10-04.** Hoja `projects/13050549605434273903/screens/d4e43fd2b7394ccfab0f4f19a6889f25` («SCR-029-01 v5 — Registrar unidad (errores de validación)»): Nombre «Operaciones» con «Ya existe una unidad con este nombre bajo Dirección Comercial» y Correo laboral «nombre@» con «Ingrese un correo válido». Stitch añadió un banner de alerta superior, un subtítulo y un pie «Comsatel Perú S.A.C.» que el SCR no pide: por revisar. No se registra en el DTM (una sola `exploration_design` por SCR); sin revisión de accesibilidad. Faltan los estados C a H con el campo.

**Estado C (guardando), 2026-10-04.** Hoja `projects/13050549605434273903/screens/f78e671a95c342ccba8dcb281460f0cc`: campos deshabilitados con «Operaciones», «operaciones@comsatel.com.pe», «Dirección Comercial» y «01/11/2026»; «Registrar unidad» con indicador y «Guardando…»; «Cancelar» deshabilitado. Stitch añadió el subtítulo «Complete la información…» y, según su resumen, un texto de ayuda «La unidad se creará como dependencia jerárquica directa.» que ni el SCR ni las historias piden: por revisar y quitar. Sin revisión de accesibilidad ni registro en el DTM. Faltan los estados D a H con el campo.

**Estado D (éxito), 2026-10-04.** Hoja `projects/13050549605434273903/screens/a6492308597b4aa28adb2399375fd377`: alerta verde con icono de check y «Unidad registrada» sobre el formulario vacío (cuatro campos, «Registrar unidad» y «Cancelar»). El prompt que Stitch reescribió internamente pide el verde como `#e6f4ea`/`#137333` o `emerald-50`/`emerald-800`, no los tokens `success` de TKN-SET-002 (`#065f46` sobre `#ecfdf5`): verificar el HTML y corregir si usó otros. Sin revisión de accesibilidad ni registro en el DTM. Faltan los estados E a H con el campo.

**Estado E (error al guardar), 2026-10-04.** Hoja `projects/13050549605434273903/screens/105ae4a34c034ddcb3a7462b6d400ee6`: alerta roja con icono y «No se pudo registrar la unidad. Intente de nuevo.» más «Reintentar», sobre el formulario con los valores conservados («Operaciones», «operaciones@comsatel.com.pe», «Dirección Comercial», «01/11/2026»). El texto del error es de muestra (SCR-029: «mensajes de error al guardar» por validar). Stitch mantuvo el subtítulo «Complete la información…» que el SCR no pide. Sin revisión de accesibilidad ni registro en el DTM. Faltan los estados F a H con el campo (sin permisos y los dos restantes).

**Estado F (sin permisos), 2026-10-04.** Hoja `projects/13050549605434273903/screens/4be5649fca404590b69ccdd0abd7c0c0`: sin formulario, con icono de candado, «No tiene permiso para registrar unidades» y «Volver a unidades». Textos de muestra por validar (SCR-029: permisos). Revisar que no queden textos extra. Sin revisión de accesibilidad ni registro en el DTM. Con A (registrada), B, C, D, E y F cubren los estados con campo salvo `loading` y `unsaved-changes` del SCR-029-01 y los errores de servidor `cycle-error` e `inactive-parent-error`; la consolidación en una hoja sigue pendiente.

**Hoja consolidada v5 (2026-10-04).** La primera generación larga, que había dado timeout, apareció después como `projects/13050549605434273903/screens/fc85e64ad27c4b84b2ce40186a69da97` («SCR-029-01 v5 — Registrar unidad organizacional (todos los estados)»). Su HTML contiene «Correo laboral» (9), «Ingrese un correo válido», «Guardando», «Unidad registrada» y «No se pudo registrar» con «Reintentar»; «Soporte» y «Ajustes» solo aparecen en un comentario del código. **No contiene** «sin permisos» ni «cargando»: el primero está en la hoja suelta `4be5649f…` (estado F) y el segundo (estado G) no se generó, porque la llamada se abortó a los 300 s. Registrada en el DTM como `exploration_design` vigente de SCR-029-01 (`v5-todos-los-estados`); la hoja del estado A (`f971cc7d…`) queda `superseded`. Sin revisión de accesibilidad ni de contenido inventado.

**Hojas consolidadas de SCR-029-02, 03 y 04.** `…/234079448a8b438cb5ecb9e601093c39` (029-02), `…/c53d12f7720c49e4a73c193b62b517a5` (029-03) y `…/54b227ae20d649e698b804011e3e00af` (029-04), registrada en el DTM como `exploration_design` vigente (`v-consolidada`, 2026-10-04); las hojas anteriores quedan `superseded`. Verificación estática del HTML: sin «Soporte», «Ajustes», «Eliminar» ni «Borrar» en la interfaz; iconos con `aria-hidden` y `role="alert"` presentes. Sin revisión completa de accesibilidad, de contenido inventado ni de estados contra el SCR. Las de 029-02 y 029-03 no incluyen el cambio de correo laboral (solo afecta a 029-01).

**Hoja consolidada v6 (2026-10-04).** Regenerada tras ARP-SCR-029-01-C (labels sin enlazar, borde slate-300 a 1.48:1): `projects/13050549605434273903/screens/f60d9b006fc643d0b0120e95ef04e9a6`. Su HTML tiene 20 controles con `label for`/`id`, `aria-required` en los 20, `aria-invalid` y `aria-describedby` en los campos con error, `nav` con `aria-label` y `aria-current`, 0 clases slate, y los siete estados A a G (normal, errores, guardando, éxito, error al guardar, sin permisos y cargando) con «Correo laboral». Sin «Soporte», «Ajustes», «Eliminar» ni «Borrar». Registrada en el DTM como vigente (`v6-consolidada`); `fc85e64a…` queda `superseded`. Pendiente: 9 iconos sin `aria-hidden` (único fallo estático, ver el ARP), contraste de los bordes de campo no calculado y todo lo que requiere navegador.

**Hoja consolidada v7 de SCR-029-01 (2026-10-04).** `projects/13050549605434273903/screens/88756f6053b14af6b7237ffbcd5b43f4`: añade a la v6 los estados que faltaban frente a `required_states` — H error de ciclo («Crearía un ciclo en la jerarquía»), I padre inactivo («Solo se pueden elegir unidades activas»), J cambios sin guardar (diálogo con `role=dialog`, `aria-modal` y `aria-labelledby`: «Tiene cambios sin guardar», «Seguir editando», «Salir sin guardar») y K sin organización interna («Aún no hay una organización interna registrada»). Los textos de J y K son **propuestos**: el SCR no los fija. Verificación estática del HTML: 28 controles con etiqueta enlazada y `aria-required`, `aria-invalid`/`aria-describedby` en los campos con error, 0 clases slate, sin Soporte/Ajustes/Eliminar, 0 iconos como ligaduras de texto. Registrada como `exploration_design` vigente (`v7-consolidada`). **La aprobación humana registrada el 2026-10-04 corresponde a la v6; la v7 necesita aprobación nueva.**

**Hoja consolidada v2 de SCR-029-03 (2026-10-04).** `projects/13050549605434273903/screens/8fe751ab95ab4ae18907be06e14f65ab`: cubre los 13 `required_states` (A normal, B ciclo, C padre inactivo, D resumen en diálogo «Calidad de Software: de Ingeniería a Operaciones de Formación», E error al guardar, F éxito, G cargando, H errores de validación, I nombre repetido, J guardando, K cambios sin guardar, L sin permisos, M «Continuar» deshabilitado). Textos propuestos por el agente, no fijados por el SCR: «Seleccione la nueva unidad padre», «No tiene permiso para cambiar la unidad padre», «Tiene cambios sin guardar» y sus botones. Verificación estática: 16 controles con etiqueta enlazada y `aria-required`, `aria-invalid`/`aria-describedby`, 2 `role=dialog` con `aria-modal`, 3 `nav` con nombre, 0 slate, sin Soporte/Ajustes/Eliminar y desapareció el rótulo «MI DESARROLLO» de bajo contraste. Pendiente: 3 iconos sin `aria-hidden` (`swap_horiz`, `warning`, `lock`). Registrada como `exploration_design` vigente (`v2-consolidada`); la aprobación humana del 2026-10-04 era de la hoja anterior, así que la v2 necesita aprobación nueva.

**Hoja consolidada v2 de SCR-029-02 (2026-10-04).** `projects/13050549605434273903/screens/5a2d1ac4aea84efa9c104340c61c042d`: cubre los 10 `required_states` (A normal, B nombre vacío, C nombre duplicado, D error al guardar, E guardado, F cargando, G guardando, H cambios sin guardar, I sin permisos, J «Guardar» deshabilitado sin cambios). Textos propuestos por el agente, no fijados por el SCR: «No tiene permiso para editar unidades» y los del diálogo de cambios sin guardar. Verificación estática: 7 controles con etiqueta enlazada y `aria-required`, `aria-invalid`/`aria-describedby`, `role=dialog` con `aria-modal`, 3 `nav` con nombre, 0 slate, sin Soporte/Ajustes/Eliminar. Pendiente: 2 iconos sin `aria-hidden` (`warning`, `lock`) y contraste de los botones deshabilitados «Guardar» (4.49:1) y «Cancelar» (4.05:1), exentos por estar deshabilitados. Registrada como `exploration_design` vigente (`v2-consolidada`); la aprobación humana del 2026-10-04 era de la hoja anterior, así que la v2 necesita aprobación nueva.
