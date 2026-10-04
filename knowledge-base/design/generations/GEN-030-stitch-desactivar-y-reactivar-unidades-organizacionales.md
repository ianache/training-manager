---
id: GEN-030
type: Generation Prompt
title: "GEN-030 — Diseño Stitch: Desactivar y reactivar unidades organizacionales"
description: "Prompts, pantallas generadas y revisión crítica del diseño exploratorio en Stitch para SCR-030-01 a SCR-030-04."
tags: [ux-ui, stitch, generation-prompt, us-030]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-03T18:00:00-05:00"
sources:
  - id: scr
    resource: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: flw
    resource: /knowledge-base/design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: uxr
    resource: /knowledge-base/design/ux-requirements/UXR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: tkn
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
flow: FLW-030
screens: [SCR-030-01, SCR-030-02, SCR-030-03, SCR-030-04]
---

# GEN-030 — Diseño Stitch: Desactivar y reactivar unidades organizacionales

> Diseño **exploratorio** (`exploration_design`). No está aprobado, no es el diseño gobernado y no tiene revisión de accesibilidad. Los datos que muestra (nombres de unidades, conteos, fechas) son de ejemplo. Los textos de consecuencia, éxito, error y bloqueo no tienen fuente (SCR-030-Q4) y se muestran como marcador de ejemplo.

## Trazabilidad

- Proyecto Stitch: `STP-PPM-001` (acción `REUSE`; no se creó proyecto).
- Screens: `SCR-030-01` a `SCR-030-04` → `FLW-030`. El vínculo SCR ↔ artefacto vive en `DTM-PPM-001` (aún sin registrar; este GEN no lo edita).
- Tokens: `TKN-SET-002`. Reglas: BR-PTY-12, 17, 21, 23, 24.

## Verificación en vivo del proyecto

- **Fecha:** 2026-10-03, verificado en vivo por el orquestador antes de esta ejecución (preflight `READY`).
- **Resultado:** proyecto `projects/13050549605434273903` («Plataforma PPM», escritorio) con el design system **«Comsatel Styled»** (`assets/f23c7efd2fe44bd59183c1c4308d67f1`, versión 1). No se creó ni se subió DESIGN.md.
- Cada generación pasó `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1` y `deviceType = DESKTOP`; `modelId` no se indicó.

## Pantallas generadas

| SCR | Resource name (Stitch) | Título en Stitch |
|---|---|---|
| SCR-030-01 | `projects/13050549605434273903/screens/06e62932b2a94c80a345ff0267378fef` | SCR-030-01 — Confirmar desactivación de la unidad (Estados A, B, C y D) |
| SCR-030-02 | `projects/13050549605434273903/screens/ab28fe4f0b4d4d99a9c4eaee30b8cc18` | SCR-030-02 — Desactivación bloqueada por dependencias (Estados A, B y C) |
| SCR-030-03 | `projects/13050549605434273903/screens/6e368fd66d0f4d5caff850faf7f9dd2e` | SCR-030-03 — Reactivar la unidad (fecha desde) (Estados A, B, C y D) |
| SCR-030-04 | `projects/13050549605434273903/screens/c647294ecb764bada0bb6a6ec1d5cd61` | SCR-030-04 — Reactivación bloqueada por padre Inactivo (Estados A y B) |

Stitch no expone una versión de cada artefacto. Los IDs de 01, 02 y 03 se tomaron de la respuesta de cada generación. 01 y 02 aparecen además en `list_screens`; 03 **no** apareció en ninguna de las cinco consultas (mismo comportamiento que GEN-016: `list_screens` no siempre muestra las pantallas nuevas), pero su HTML se descargó con éxito.

**SCR-030-04:** la llamada devolvió `The operation timed out` y no se reintentó. Se consultó `list_screens` cinco veces (con esperas de 45 a 90 s entre consultas) y no apareció ninguna pantalla titulada «SCR-030-04 …». No se inventa ID: el artefacto de SCR-030-04 queda **sin localizar** y sin registrar. Pendiente: nuevas consultas posteriores a `list_screens` o decisión humana de regenerar (riesgo de duplicado si la generación original terminó después).

Timeouts: 1 de 4 (SCR-030-04).

## Prompts (reproducibles)

`deviceType = DESKTOP`; `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1`. Cuatro hojas comparativas de estados. Cabecera común (resumida aquí como `[COMÚN]`): «Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar "Plataforma de Gestión de Formación", user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar with "MI DESARROLLO" (Mi perfil de competencias, Mi brecha) and "PERSONAS" (Colaboradores).». Cierre común (`[CIERRE]`): «Never use the words "Eliminar" or "Borrar". Sample data only. Never convey state by color alone: always icon plus text. STRICT CONTENT RULES: use only the texts given here. Do NOT add specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, person codes, job titles, footers, or extra helper text.»

### SCR-030-01

```text
SCR-030-01 — Confirmar desactivación de la unidad (Jefe de Ingeniería). [COMÚN] Present the screen as a state comparison sheet with four labeled variants stacked: A "Predeterminado", B "Guardando", C "Éxito", D "Error al guardar". Each variant shows a modal confirmation dialog (role dialog) over a dimmed units list that has ONE sample row: unit name "Dirección de Operaciones" (sample data) with an "Activa" text badge (icon + text) and a "Desactivar" button. Dialog title includes the unit name: "Desactivar Dirección de Operaciones". Dialog body states the consequence: the unit is not deleted, keeps its history and closes its validity period. Buttons "Cancelar" (secondary, initial focus visible with a focus ring) and "Desactivar" (primary red). Variant B: the "Desactivar" button shows a loading spinner and "Cancelar" is disabled. Variant C: no dialog; a visible success confirmation message, and the row now shows the text badge "Inactiva" (icon + text, not color alone) with the focus ring on the row. Variant D: an error alert inside the dialog with a "Reintentar" action and a note that the unit did not change. Texts of the consequence, success and error messages are sample wording to be validated. [CIERRE]
```

### SCR-030-02

```text
SCR-030-02 — Desactivación bloqueada por dependencias (Jefe de Ingeniería). [COMÚN] State comparison sheet with three labeled variants stacked: A "Predeterminado", B "Cargando", C "Sin permisos". Each variant shows a modal dialog over a dimmed units list with ONE sample row "Dirección de Operaciones" (sample data) with an "Activa" text badge. Variant A: dialog titled "No se puede desactivar Dirección de Operaciones" containing an alert (role alert, error icon + text) with concrete sample counts: "3 unidades hijas activas" and "12 personas con pertenencia vigente" (sample numbers) that prevent the deactivation; an action link to go resolve them for each dependency kind ("Ir a las unidades hijas", "Ir a las personas"); a single button "Cerrar". There is NO "Desactivar" button. Variant B: the dialog while the counts are being calculated, with a spinner and skeleton lines, and "Cerrar". Variant C: the units list with the row showing NO action buttons, because the user lacks permission; add a short text "Sin permisos" with a lock icon. The alert and link wording are sample text to be validated. [CIERRE]
```

### SCR-030-03

```text
SCR-030-03 — Reactivar la unidad (fecha desde) (Jefe de Ingeniería). [COMÚN] State comparison sheet with four labeled variants stacked: A "Predeterminado", B "Fecha inválida", C "Guardando", D "Éxito". Variants A-C show a modal dialog over a dimmed units list with ONE sample row "Dirección de Operaciones" (sample data) with an "Inactiva" text badge (icon + text) and a "Reactivar" button. Dialog title "Reactivar Dirección de Operaciones". Read-only data: "Vigencia anterior" shown as a validity label "Desde 01/03/2024 hasta 30/09/2026" (sample dates, dd/mm/aaaa) and "Unidad padre" "Dirección General" with its state "Activa" (icon + text; sample data). Required field "Fecha desde *" (date input, dd/mm/aaaa). Buttons "Cancelar" (secondary) and "Reactivar" (primary red). Variant B: the Fecha desde field is empty and shows an error (error icon + text, sample wording "Indica una fecha válida"), with aria-invalid styling. Variant C: "Reactivar" shows a loading spinner, the fields and "Cancelar" are disabled. Variant D: no dialog; a visible success message and the row now shows the text badge "Activa" (icon + text) with a focus ring on the row. Do not state any default value or allowed range for the date. [CIERRE]
```

### SCR-030-04

```text
SCR-030-04 — Reactivación bloqueada por padre Inactivo (Jefe de Ingeniería). [COMÚN] State comparison sheet with two labeled variants stacked: A "Predeterminado", B "Sin permisos". Variant A: a modal dialog over a dimmed units list with ONE sample row "Ventas Regionales" (sample data) with an "Inactiva" text badge (icon + text) and a "Reactivar" button. Dialog titled "No se puede reactivar Ventas Regionales" containing an alert (role alert, error icon + text) saying that the parent unit must be reactivated first, naming the parent "Dirección Comercial" (sample data, Inactiva) as a link in the tertiary blue color to the parent; one button "Cerrar". No "Reactivar" button inside the dialog. Variant B: the units list where the row shows NO action buttons because the user lacks permission, with a short text "Sin permisos" and a lock icon. Alert wording is sample text to be validated. [CIERRE]
```

Stitch reescribe el prompt antes de generar, de modo que la reproducción exacta no está garantizada.

## Revisión crítica

Método: se descargó el HTML de SCR-030-01, 02 y 03 (SCR-030-04 no existe aún) y se compararon sus textos con SCR-030, UXR-030, FLW-030 y las reglas BR-PTY-12/17/21/23/24; se buscó contenido inventado, contradicciones con decisiones humanas y afirmaciones de accesibilidad. No se inspeccionaron las capturas a resolución completa. El HTML de Stitch es una exploración y **no** es evidencia de accesibilidad.

**Cumplen:** ninguna pantalla contiene las palabras «Eliminar» ni «Borrar» (BR-PTY-21; verificado por búsqueda en el HTML); la etiqueta de estado es texto («Activa», «Inactiva») con icono, no solo color; 01 tiene «Cancelar» y «Desactivar», título con el nombre de la unidad y consecuencia (no se borra, conserva historial, cierra vigencia); 02 muestra conteos concretos de hijas activas y de personas vigentes y **no ofrece «Desactivar»** en el diálogo (BR-PTY-23, AC-2); 03 muestra vigencia anterior, unidad padre con su estado «Activa» y el campo obligatorio «Fecha desde *» (BR-PTY-24, AC-3); la paleta es la de «Comsatel Styled»; el usuario de la barra es «Jefe de Ingeniería»; hay `role="alert"` en 01 y 02; 02 muestra el estado sin permisos con acciones no visibles.

| ID | SCR | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| R-01 | 03 | En la variante C («Guardando») el campo «Fecha desde» aparece precargado con `01/10/2026`. Eso fija un valor por defecto que la fuente no decide (SCR-030-Q2, UXR-030-Q3, FLW-030-Q5) | Media | Stitch | No tomar como decisión; el valor por defecto sigue abierto |
| R-02 | 03 | La variante D («Éxito») muestra en la fila botones «Editar» y «Desactivar». «Editar» no existe en SCR-030 ni en FLW-030 | Media | Stitch | No copiar «Editar»; en la fila tras reactivar solo corresponde «Desactivar» (estado Activa) |
| R-03 | 03 | Aparece un rótulo de unidad «Gestión Operativa» en la barra lateral, no pedido ni presente en el SCR | Baja | Stitch | Ignorar; la navegación real no está definida aquí |
| R-04 | 01 | Etiqueta «Período cerrado» junto a «Inactiva» y el texto «Conserva su historial y ha cerrado su período de vigencia» en el éxito: son textos de ejemplo extendidos sin fuente (SCR-030-Q4) | Baja | Stitch | Tratar como marcador; validar los textos con el PO |
| R-05 | 01 | El texto de consecuencia dice «La unidad no se elimina…». El verbo no es una acción ni una etiqueta, pero BR-PTY-21 pide evitar «Eliminar»/«Borrar» para describir la eliminación lógica | Baja | Stitch | Revisar el wording con el PO; preferir «no se borra» solo si se acepta, o una formulación sin ese vocabulario |
| R-06 | 02 | La variante B incluye «Cargando dependencias…» como texto; el SCR solo exige un estado `loading` sin texto fijado. Los enlaces «Ir a las unidades hijas» e «Ir a las personas» fijan etiquetas cuyo destino sigue sin definir (FLW-030-Q3, UXR-030-Q1/Q4) | Baja | Stitch | Marcadores de ejemplo; el destino y el texto real quedan abiertos |
| R-07 | 02 | Se muestran ambos conteos (3 y 12) como ejemplo; el caso de un solo tipo de dependencia (SCR-030-Q3: ¿cero u omitido?) no está explorado | Info | Prompt | Pendiente de decisión humana |
| R-08 | Todas | El HTML trae atributos `aria-*`, `role` y el resumen de Stitch afirma cumplimiento de accesibilidad («aria-invalid», anillo de foco, etc.) | Info | Stitch | No son evidencia; el informe de `accessibility-reviewer` sigue pendiente |
| R-09 | Todas | Se presenta cada estado como hoja comparativa de variantes, no como diálogo real con el listado detrás; FLW-030-Q1 (¿cuatro pantallas o variantes de un diálogo?) sigue abierta. Los estados del SCR 01 `forbidden`/`disabled` y 03 `forbidden` no se muestran todos | Info | Prompt | La forma de presentación queda para la decisión humana |
| R-10 | 04 | **SCR-030-04 no se localizó**: la llamada agotó el tiempo y `list_screens` no mostró una pantalla con ese título en cinco consultas. No se revisó contra AC-4 ni BR-PTY-24 | Alta | Herramienta | Consultar de nuevo `list_screens` o decidir regenerar; no registrar en DTM hasta tener ID real |
| R-11 | Proyecto | El tema por defecto del proyecto sigue siendo «Sovereign Enterprise» (R-09 de GEN-016); las pantallas usan `designSystem` explícito | Info | Proyecto | Sin cambio |
| R-12 | — | Limitación del método: revisión de texto y estructura; sin verificación visual a resolución completa ni de comportamiento | Info | Revisión | Revisión humana de cada pantalla en Stitch |

## Preguntas abiertas

- SCR-030-04: ¿se espera y se vuelve a consultar `list_screens`, o se regenera (con riesgo de duplicado)?
- Los textos de consecuencia, éxito, error y bloqueo (SCR-030-Q4), la fecha por defecto (SCR-030-Q2) y el destino de «ir a resolverlas» (FLW-030-Q3) siguen sin decisión; las pantallas muestran solo marcadores.
- FLW-030-Q1: ¿diálogos sobre el listado o pantallas propias?
- El diseño gobernado (Figma, `figma-design-validator`) y el informe de `accessibility-reviewer` siguen pendientes; esta exploración no los sustituye.

## Actualización 2026-10-03 (SCR-030-04)

Se volvió a generar SCR-030-04 con el mismo prompt (una sola llamada, sin reintentos). Esta vez Stitch respondió con la pantalla y el ID `c647294ecb764bada0bb6a6ec1d5cd61`, verificado con `get_screen` (título «SCR-030-04 — Reactivación bloqueada por padre Inactivo (Estados A y B)»). **Sigue sin aparecer en `list_screens` ni en `screenInstances` de `get_project`**; el ID solo se conoce por la respuesta de la generación. Registrada en `DTM-PPM-001` con `register-exploration` (`version: not-exposed-by-stitch`). Cierra R-10 en cuanto a la existencia de la pantalla. **No se hizo la revisión crítica contra AC-4 y BR-PTY-24** (no se descargó su HTML): sigue pendiente, igual que la revisión humana. Es exploración, no diseño gobernado.

## Regeneración v2 (2026-10-03): éxito en verde y semántica de accesibilidad

Decisiones de `human:ianache`: el éxito y la vigencia usan el verde del design system, que se ajustó en Stitch (`Comsatel Styled` v2: roles `success` #065f46, `success-container` #ecfdf5, `success-outline` #a7f3d0, siempre con icono y texto); el diálogo de resumen de SCR-029-03 muestra solo «{unidad}: de X a Y»; la columna «Hasta» va vacía mientras no se defina su valor. Los prompts exigieron además `aria-hidden` en iconos, `label for`, `aria-invalid`/`aria-describedby`, `role=alert`/`status`, `caption`, `aria-label` en `nav` y `aria-current`. El DTM apunta a la primera hoja de cada pantalla (`version: v2-success-green`); las hojas de estados adicionales solo constan aquí. Los artefactos anteriores quedan en Stitch como residuo (no hay herramienta para borrarlos).

| Pantalla | Resource name (Stitch) |
|---|---|
| SCR-030-01 (A–D) | `projects/13050549605434273903/screens/11e52a5f6d6d401eb239180750c1df9d` |
| SCR-030-02 (A, B) | `projects/13050549605434273903/screens/fc1cfa0bf4d9442d926d1ab37aff49d1` |
| SCR-030-03 (A–D) | `projects/13050549605434273903/screens/727b36fe16884700ac3329309f09c644` |
| SCR-030-04 (A, B) | `projects/13050549605434273903/screens/836b9b73b01e4191afab8798ba562000` |

Revisión de accesibilidad: [ARP-UNIDADES-V2](../handoff/ARP-UNIDADES-REGENERACION-v2.md). Es exploración, no diseño gobernado; revisión humana pendiente.

**Hoja consolidada v3 de SCR-030-01 (2026-10-04).** `projects/13050549605434273903/screens/00639d1bc02d41308ff174f3b6f90a8a`: cubre los 6 `required_states` (A diálogo de desactivación, B guardando, C éxito con insignia «Inactiva», D error al guardar, E «Desactivar» deshabilitado, F sin permisos). El texto «No tiene permiso para desactivar unidades» y «Desactivando…» los propuso el agente. Verificación estática: éxito con los tokens exactos `#065f46`/`#ecfdf5`/`#a7f3d0`, 3 `nav` con nombre, 3 `role=dialog` con `aria-modal`, 19 iconos con `aria-hidden`, 0 slate, sin Soporte/Ajustes/Eliminar. **Pendiente:** contraste de los rótulos de menú y migas (`#916f69` sobre `#fff0ee` = 4.05:1 y sobre `#fff8f7` = 4.28:1, mínimo 4.5:1). Registrada como `exploration_design` vigente; necesita aprobación humana nueva.

**Hoja consolidada v4 de SCR-030-01 (2026-10-04).** `projects/13050549605434273903/screens/1116d52abf2548839f6d08073e98747b`: regenerada para corregir el contraste de la v3, con el texto de rótulos del menú, migas y textos secundarios en `#5d3f3b` (el `#916f69` queda solo para bordes), como pidió ianache. Mismos 6 estados. Verificación estática: contraste de texto sin pares bajo el mínimo salvo la ligadura `corporate_fare` del logo (icono oculto con `aria-hidden`, no texto); éxito con los tokens exactos; 3 `nav` con nombre; 3 `role=dialog` con `aria-modal`; 19 iconos con `aria-hidden`; 0 slate; sin Soporte/Ajustes/Eliminar. El cálculo estático solo resolvió 5 pares de color (los colores van en el config de Tailwind), por lo que el contraste completo se confirma en navegador. `11e52a5f…` y `00639d1b…` quedan reemplazadas. Necesita aprobación humana nueva.
