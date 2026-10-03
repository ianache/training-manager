---
id: GEN-017
type: Generation Prompt
title: "GEN-017 — Diseño Stitch: Registrar la organización interna"
description: "Prompts, pantallas generadas y revisión crítica del diseño exploratorio en Stitch para SCR-017-01 a SCR-017-03."
tags: [ux-ui, stitch, generation-prompt, us-017]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-03T18:00:00-05:00"
sources:
  - id: scr
    resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
  - id: flw
    resource: /knowledge-base/design/user-flows/FLW-017-registrar-la-organizacion-interna.md
  - id: uxr
    resource: /knowledge-base/design/ux-requirements/UXR-017-registrar-la-organizacion-interna.md
  - id: tkn
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
  - id: gen-016
    resource: /knowledge-base/design/generations/GEN-016-stitch-actualizar-datos-y-contactos.md
flow: FLW-017
screens: [SCR-017-01, SCR-017-02, SCR-017-03]
---

# GEN-017 — Diseño Stitch: Registrar la organización interna

> Diseño **exploratorio** (`exploration_design`). No está aprobado, no es el diseño gobernado y no tiene revisión de accesibilidad. Los datos y varios textos son de ejemplo. El registro en `DTM-PPM-001` lo hace el orquestador (no se hizo aquí).

## Trazabilidad

- Proyecto Stitch: `STP-PPM-001` (`projects/13050549605434273903`, acción `REUSE`; no se creó proyecto).
- Screens `SCR-017-01..03` → `FLW-017` → US-017 / UXR-017 / UXR-000. Vínculo SCR ↔ artefacto: `DTM-PPM-001` (pendiente de registrar).
- Tokens: `TKN-SET-002` «Comsatel Styled».

## Verificación en vivo del proyecto

- **Fecha:** 2026-10-03. El orquestador verificó el proyecto en vivo antes de esta tarea; aquí se confirmó de nuevo con `list_screens` (el proyecto responde y contiene las pantallas nuevas). `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1` («Comsatel Styled», versión 1) respondido por Stitch en cada generación. Preflight `READY` (dado por el orquestador).

## Pantallas generadas

| SCR | Resource name (Stitch) | Título en Stitch |
|---|---|---|
| SCR-017-01 | `projects/13050549605434273903/screens/ebe76a85620f4cb590f9f626d8e428ca` | SCR-017-01 — Organización interna (Estados A, B, C, D y E) — Comsatel Styled |
| SCR-017-02 | `projects/13050549605434273903/screens/f8bc9e0d2d4e4fd685b102f72dd5b921` | SCR-017-02 — Registrar la organización interna (Estados A–F) |
| SCR-017-03 | `projects/13050549605434273903/screens/a4a8d03623454c779678750c37e106bd` | SCR-017-03 — Acceso no autorizado a la gestión de la organización interna |

Stitch no expone versión del artefacto. La llamada de SCR-017-01 devolvió `The operation timed out`; no se reintentó y la pantalla apareció en la primera consulta de `list_screens` (su ID se tomó de ahí). Las de 02 y 03 respondieron sin timeout. Hay exactamente una pantalla por SCR (verificado en `list_screens`).

## Prompts (reproducibles)

`deviceType = DESKTOP`; `modelId` no indicado; `designSystem = assets/f23c7efd2fe44bd59183c1c4308d67f1`. Cierre común: «STRICT CONTENT RULES» como en la regeneración de GEN-016. Stitch reescribe el prompt; la reproducción exacta no está garantizada.

### SCR-017-01

```text
SCR-017-01 — Organización interna (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar with product name "Plataforma de Gestión de Formación", the user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar with a single active item "Organización interna". Full PAGE, not a modal, titled "Organización interna". Present the page as a state comparison sheet with five labeled variants stacked: A "Vacío inicial", B "Organización registrada", C "Cargando", D "Error de carga", E "Sin permiso". Variant A: empty-state block with the text "Aún no has registrado la organización interna." and a primary red button "Registrar organización interna". Variant B: read-only label/value list "Razón social" (sample value "Organización de ejemplo S.A.C."), "RUC" (sample value 20000000001), "País emisor" (Perú), and a badge "Vigente desde 03/10/2026" (check icon + text); a link-style action "Continuar a unidades"; NO "Registrar organización interna" button in this variant. Variant C: loading skeleton with a spinner and the text "Cargando…". Variant D: an error alert with an error icon, a short load-failure message "No se pudo cargar la organización interna." and a button "Reintentar"; it must look different from the empty state. Variant E: the action is not shown and a short note "Sin permiso" refers to the unauthorized screen. Terminology: use "Organización interna", "Organización" and "COMSATEL"; never "empresa" or "compañía". Use clearly sample data; no real people. Never convey state by color alone: always icon plus text. STRICT CONTENT RULES: use only the texts given here. Do NOT add specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, footers, or extra helper text.
```

### SCR-017-02

```text
SCR-017-02 — Registrar la organización interna (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar "Plataforma de Gestión de Formación", user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar with a single active item "Organización interna". Full PAGE, not a modal, titled "Registrar la organización interna". State comparison sheet with six labeled variants stacked: A "Predeterminado", B "Error de validación", C "RUC duplicado", D "Identificación de persona rechazada", E "Guardando y error al guardar", F "Éxito". Form (single card, 12px radius): "Razón social *" text input, "RUC *" text input, "País emisor *" select (sample options Perú and Estados Unidos). Do NOT add a role field (the role "Organización interna" is fixed by the flow). Do NOT add a "Vigencia desde" field. Buttons: "Registrar" (primary red; disabled while saving or with errors; shows a spinner when saving) and "Cancelar" (secondary). Variant A: empty form. Variant B: Razón social left empty with an error icon and text "Este campo es obligatorio" (sample text), focus on the first error. Variant C: RUC with sample value 20000000001 and the error "La identificación ya existe" associated to the RUC field; the entered data is kept. Variant D: RUC field with a sample DNI-like value 40000003 and an error icon and text stating that the field only admits RUC (sample text: "Este campo solo admite RUC"). Variant E: two states side by side: "Guardando…" with button spinner and disabled, and a save-error alert with "Reintentar" keeping the entered values. Variant F: a visible success confirmation "Organización interna registrada" (sample text). Sample data only: "Organización de ejemplo S.A.C.". Terminology: "Organización interna", "COMSATEL"; never "empresa" or "compañía". Never convey state by color alone: icon plus text. STRICT CONTENT RULES: use only the texts given here. Do NOT add specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, footers, RUC format rules, or extra helper text.
```

### SCR-017-03

```text
SCR-017-03 — Acceso no autorizado a la gestión de la organización interna. Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar "Plataforma de Gestión de Formación" with a user name "Usuario de ejemplo" and "Cerrar sesión". Full PAGE with a single state, "Acceso no autorizado" (forbidden): a heading "Acceso no autorizado" and a message, shown as an alert block with a lock/error icon plus text: "No tienes permiso para gestionar la organización interna." (sample text, no source). Do NOT show any "Registrar organización interna" button. Do NOT add "Solicitar acceso" or any exit action. Never convey state by color alone. STRICT CONTENT RULES: use only the texts given here. Do NOT add specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, footers, or extra helper text.
```

## Revisión crítica

Método: se descargó el HTML de cada pantalla y se extrajo su texto; se comparó con SCR-017, FLW-017, UXR-017 y BR-PTY-*. **No se vieron las capturas** y no se verificó comportamiento. El HTML de Stitch es exploración, no evidencia de accesibilidad: no contiene `wcag`, `role="alert"` ni `aria-live` (búsqueda en los tres archivos).

**Cumplen:** textos del SCR presentes («Aún no has registrado la organización interna.», «Registrar organización interna», «Vigente desde 03/10/2026», «Razón social», «RUC», «País emisor», «La identificación ya existe», «Reintentar», «Registrar», «Cancelar», «Acceso no autorizado», «No tienes permiso para gestionar la organización interna.»); paleta «Comsatel Styled»; sin los términos «empresa» ni «compañía»; vacío y error de carga son bloques distintos; 02 no tiene campo de rol ni «Vigencia desde» editable; 03 sin «Solicitar acceso» ni salida.

| ID | SCR | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| R-01 | 02 (F), 01 (B) | Stitch agregó la etiqueta «COMSATEL Portal» / «COMSATEL Portal de Formación» y un chip «Registrada» en la tarjeta de organización registrada; no están en la spec | Media | Stitch | No copiar; la spec solo da razón social, RUC, país y «Vigente desde» |
| R-02 | 02 (F) | La confirmación agrega botones «Continuar a unidades» y «Volver» y una tarjeta resumen. FLW-017-Q3 (¿ir a FLW-028 o quedarse?) y la acción tras éxito siguen abiertas; la spec dice solo «confirmación visible y retorno a SCR-017-01» | Media | Stitch | Decidir FLW-017-Q3; no tomar como decisión |
| R-03 | 02 (E) | Mensaje «Error al guardar en el servidor» y título «Error al guardar»: texto sin fuente y con detalle técnico («servidor») | Baja | Stitch | Texto por definir; la spec solo exige mensaje con «Reintentar» |
| R-04 | 02 (B, D, F) | Textos de ejemplo «Este campo es obligatorio», «Este campo solo admite RUC» y «Organización interna registrada» quedan marcados «(texto de muestra)» en pantalla (útil), pero los dos primeros afirman reglas sin fuente (SCR-017-Q2, E2 sin texto exacto) | Baja | Prompt/Stitch | Mantener rotulados como ejemplo hasta tener texto validado |
| R-05 | 02 | País emisor lista Perú y Estados Unidos como opciones de ejemplo; si es libre o prefijado en Perú está abierto (FLW-017-Q2) | Baja | Spec abierta | No inferir decisión |
| R-06 | 01 | El shell agrega «Gestión Operativa», «Comsatel Portal», «Soporte», «Ajustes» y notificaciones, ítems de menú inventados; la spec no define la navegación (FLW-017-Q4) | Media | Stitch | No copiar; la navegación sigue abierta |
| R-07 | 01 (B) | «Continuar a unidades» se muestra como enlace con flecha; la forma exacta es SCR-017-Q3 (abierta) | Baja | Spec abierta | Registrar como una opción, no decisión |
| R-08 | 01 (E) | La variante «Sin permiso» agrega un candado y el texto «Sin permiso» dentro de la pantalla de entrada; la spec dice que el usuario sin permiso ve SCR-017-03, no un estado dentro de 01. Texto «Sin permiso» sin fuente | Baja | Prompt | Es una representación del estado `forbidden` de 01; verificar con SCR-017-03 |
| R-09 | 03 | «Usuario de ejemplo» es un marcador (el prompt lo pidió); el diseño no usa el sidebar | Info | Prompt | Sin acción |
| R-10 | Todas | El HTML no incluye `role="alert"`/`aria-live` ni manejo de foco: no es evidencia de accesibilidad | Info | Stitch | Informe de `accessibility-reviewer` pendiente |
| R-11 | Proyecto | El tema por defecto del proyecto sigue en «Sovereign Enterprise» (R-09 de GEN-016); los HTML usan primario `#bc0100`, y 01 usa terciario `#00428e`/`#0059ba` mezclados | Baja | Proyecto | Verificar en el diseño gobernado |
| R-12 | 02 | Falta el estado `disabled` explícito del botón «Registrar» no se comprobó en capturas, y no hay estado del diálogo de cancelación (condicional a FLW-017-Q5, no pedido) | Info | Revisión | Revisión humana |
| R-13 | Todas | Limitación: no se vieron capturas ni se probó comportamiento | Info | Revisión | Revisión humana en Stitch |

## Preguntas abiertas

- ¿Se corrigen R-01, R-02 y R-06 con `edit_screens` o se espera a la revisión humana?
- Preguntas heredadas de SCR-017 siguen abiertas (Q1–Q8, FLW-017-Q1..Q5, UXR-017-Q1..Q3); esta exploración no las resuelve.
- El diseño gobernado (Figma) y el informe de `accessibility-reviewer` siguen pendientes.

## Regeneración v2 (2026-10-03): éxito en verde y semántica de accesibilidad

Decisiones de `human:ianache`: el éxito y la vigencia usan el verde del design system, que se ajustó en Stitch (`Comsatel Styled` v2: roles `success` #065f46, `success-container` #ecfdf5, `success-outline` #a7f3d0, siempre con icono y texto); el diálogo de resumen de SCR-029-03 muestra solo «{unidad}: de X a Y»; la columna «Hasta» va vacía mientras no se defina su valor. Los prompts exigieron además `aria-hidden` en iconos, `label for`, `aria-invalid`/`aria-describedby`, `role=alert`/`status`, `caption`, `aria-label` en `nav` y `aria-current`. El DTM apunta a la primera hoja de cada pantalla (`version: v2-success-green`); las hojas de estados adicionales solo constan aquí. Los artefactos anteriores quedan en Stitch como residuo (no hay herramienta para borrarlos).

| Pantalla | Resource name (Stitch) |
|---|---|
| SCR-017-01 (A–D) | `projects/13050549605434273903/screens/ead458becb59418fb0cf15f0c601beb5` |
| SCR-017-02 (A–D) | `projects/13050549605434273903/screens/5256b92d20f04c31b720dd32e26a9259` |
| SCR-017-02 (E–G) | `projects/13050549605434273903/screens/ec2726f18a154d88a0d1ae7d3e475980` |
| SCR-017-03 | `projects/13050549605434273903/screens/08a98db688474629b3ef7a32c9d751ca` |

Revisión de accesibilidad: [ARP-UNIDADES-V2](../handoff/ARP-UNIDADES-REGENERACION-v2.md). Es exploración, no diseño gobernado; revisión humana pendiente.
