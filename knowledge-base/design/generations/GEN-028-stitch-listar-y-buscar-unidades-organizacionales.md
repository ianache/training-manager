---
id: GEN-028
type: Generation Prompt
title: "GEN-028 — Diseño Stitch: Listar y buscar unidades organizacionales"
description: "Prompt, pantalla generada y revisión crítica del diseño exploratorio en Stitch para SCR-028-01."
tags: [ux-ui, stitch, generation-prompt, us-028]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-03T17:00:00-05:00"
sources:
  - id: scr
    resource: /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
  - id: flw
    resource: /knowledge-base/design/user-flows/FLW-028-listar-y-buscar-unidades-organizacionales.md
  - id: uxr
    resource: /knowledge-base/design/ux-requirements/UXR-028-listar-y-buscar-unidades-organizacionales.md
  - id: tkn
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
  - id: gen-016
    resource: /knowledge-base/design/generations/GEN-016-stitch-actualizar-datos-y-contactos.md
flow: FLW-028
screens: [SCR-028-01]
---

# GEN-028 — Diseño Stitch: Listar y buscar unidades organizacionales

> Diseño **exploratorio** (`exploration_design`). No está aprobado, no es el diseño gobernado y no tiene revisión de accesibilidad. Los datos que muestra son de ejemplo. El vínculo SCR ↔ artefacto aún **no** está registrado en `DTM-PPM-001` (pendiente de `register-exploration`).

## Trazabilidad

- Proyecto Stitch: `STP-PPM-001` (acción `REUSE`; no se creó proyecto).
- Screen: `SCR-028-01` → `FLW-028` → `UXR-028` / `US-028`. Tokens: `TKN-SET-002`.

## Verificación en vivo del proyecto

- **Fecha:** 2026-10-03, el orquestador verificó el proyecto `projects/13050549605434273903` en vivo antes de generar (no repetido por este agente); `list_screens` lo respondió después con sus pantallas.
- Design system aplicado: **«Comsatel Styled»** (`assets/f23c7efd2fe44bd59183c1c4308d67f1`). `deviceType = DESKTOP`; `modelId` no indicado.
- Preflight: `READY`.

## Pantalla generada

| SCR | Resource name (Stitch) | Título en Stitch |
|---|---|---|
| SCR-028-01 | `projects/13050549605434273903/screens/078ae7f725e242bcba357e646e1395dd` | SCR-028-01 — Gestión de unidades organizacionales (lista y jerarquía) (Estados A–H) |

La llamada a `generate_screen_from_text` devolvió `The operation timed out`; no se reintentó. La pantalla apareció en `list_screens` en la tercera consulta. Hay exactamente una pantalla para SCR-028-01. Stitch no expone versión del artefacto.

## Prompt (reproducible)

Hoja comparativa de ocho estados (los que declara la spec) con la alternancia Lista/Jerarquía como una sola pantalla (FLW-028-Q1, propuesta pendiente SCR-028-Q3). Stitch reescribe el prompt, por lo que la reproducción exacta no está garantizada.

```text
SCR-028-01 — Gestión de unidades organizacionales (lista y jerarquía) (Jefe de Ingeniería). Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar with product name "Plataforma de Gestión de Formación", the user label "Jefe de Ingeniería" and "Cerrar sesión"; left sidebar with sections "MI DESARROLLO" (Mi perfil de competencias, Mi brecha) and "PERSONAS" (Colaboradores). Full PAGE, not a modal, titled "Unidades organizacionales". Present it as a state comparison sheet with eight labeled variants stacked: A "Predeterminado / Resultados (vista Lista)", B "Vista Jerarquía", C "Cargando", D "Sin organización interna", E "Sin unidades registradas", F "Sin resultados para los filtros", G "Sin permisos", H "Error al consultar". Variants A and B share a query bar: search field "Buscar por nombre", status filter select (options Activa, Inactiva, Todas; default "Activa"), parent-unit filter select "Unidad padre", and a view toggle with two options "Lista" and "Jerarquía" (selected one with underline and bold, not color alone). Below it an always-visible row "Filtros activos" with a chip "Estado: Activa" and a text button "Limpiar filtros". Variant A: sortable table with columns "Nombre" (sort icon, ascending indicated), "Unidad padre", "Estado" (badge with text "Activa"/"Inactiva" plus icon), "Vigencia" (Desde and Hasta; Hasta only on Inactiva rows, with a vigencia badge), "Unidades hijas activas" (count), "Personas vigentes" (count), "Acciones" (buttons "Editar" and "Desactivar" for Activa rows, "Editar" and "Reactivar" for Inactiva rows). Show about 5 sample rows with obviously sample names such as "Unidad de Ejemplo 1", "Unidad de Ejemplo 2" (one Inactiva with a Hasta date) and dates in dd/mm/aaaa. Variant B: the same query bar with "Jerarquía" selected and a tree view of the same sample units, each unit nested under its parent unit, with expand/collapse chevrons (one expanded, one collapsed), and each node showing its status badge ("Activa"/"Inactiva") and vigencia. Variant C: a progress indicator with the text "Cargando". Variant D: empty-state panel saying the internal organization does not exist, with a link-style action to register it (sample wording, marked as example). Variant E: empty-state panel for no units registered with a primary button to register the first unit (sample wording). Variant F: query bar with a search text and active filters visible plus "Limpiar filtros" button and a no-results message (sample wording). Variant G: unauthorized access message with no data of the structure (sample wording). Variant H: error alert message with a button "Reintentar" (sample wording). Never use the words "Eliminada" or "Borrada". Never convey state by color alone: always icon plus text. STRICT CONTENT RULES: use only the texts given here. Do NOT add specification sheets, QA checklists, business-rule cards, accessibility or WCAG statements, audit IDs, person codes, job titles, footers, or extra helper text.
```

## Revisión crítica

Método: se descargó el HTML (`44 555` bytes) y se extrajo el texto; se comparó con SCR-028, FLW-028, UXR-028 y BR-PTY-17/20/21, y se buscó contenido inventado, `wcag`, `aria-sort`, roles `tree`/`treeitem`, `aria-live`/`role="alert"`, «Eliminada»/«Borrada» y los colores. La captura se descargó pero **no se inspeccionó a resolución completa**. El HTML de Stitch no es referencia de accesibilidad.

**Cumplen:** textos de fuente presentes («Activa», «Inactiva», «Unidad padre», «Vigencia», «Desde/Hasta», «Limpiar filtros»); sin «Eliminada» ni «Borrada» (BR-PTY-21); sin menciones a WCAG; paleta `#bc0100`/`#0059ba` de «Comsatel Styled»; ocho estados presentes (A–H) con alternador Lista/Jerarquía y acciones por fila Editar/Desactivar/Reactivar según estado; barra de consulta y filtros activos con «Limpiar filtros»; estado comunicado con texto.

| ID | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|
| R-01 | Variante A y B con filtro «Estado: Activa» muestran una unidad **Inactiva** (Unidad de Ejemplo 3, con «Reactivar»). Contradice AC-1/AC-3 (por defecto solo Activas; Inactivas solo con filtro Inactiva/Todas). En jerarquía además toca FLW-028-Q6 (abierta) | Alta | Stitch | Corregir el ejemplo: con «Activa» solo Activas; mostrar una Inactiva solo bajo «Todas»/«Inactiva». No resolver Q6 por la vía del diseño |
| R-02 | Etiqueta «Vencida» junto a la vigencia de la Inactiva: la spec solo pide «etiqueta de vigencia» (CMP-MOL-008) sin texto; «Vencida» no tiene fuente | Media | Stitch | Anotar; texto de la etiqueta a definir con CMP-MOL-008 |
| R-03 | «— (Raíz)» como unidad padre de una unidad sin padre: texto inventado (no hay fuente de cómo se muestra la ausencia de padre) | Media | Stitch | Pregunta abierta; no copiar |
| R-04 | Textos de vacío, sin organización, sin permisos, error y sin resultados fueron redactados por Stitch («La organización interna no existe en el sistema», «Por favor intenta nuevamente», etc.). La spec dice que no tienen redacción (SCR-028-Q5). Stitch dejó además los marcadores «(Texto de ejemplo …)» y «(ejemplo)» como texto visible | Media | Stitch | Tratar como marcador; la redacción real queda abierta (Q5). Quitar los marcadores literales al generar el diseño gobernado |
| R-05 | Estado `forbidden` (G) sin acción ni redirección: consistente con FLW-028-Q5 abierta, pero el mensaje «No tienes los permisos requeridos…» es redacción inventada | Baja | Stitch | Q5 / FLW-028-Q5 siguen abiertas |
| R-06 | Estado `loading` (C) solo muestra «Cargando»; SCR-028-Q4 (qué se deshabilita) sin fuente, no se representa | Info | Spec | Sin acción |
| R-07 | Estado `error` (H) no muestra filtros conservados ni su ausencia: FLW-028-Q3 abierta | Info | Spec | Sin acción |
| R-08 | El HTML no contiene `aria-sort`, roles `tree`/`treeitem`/`aria-expanded`, `aria-live` ni `role="alert"`; la spec los exige (UXR-028 §7). Sin afirmaciones de accesibilidad inventadas | Media | Stitch | No es evidencia de accesibilidad; seguir SCR-028 y `accessibility-reviewer` |
| R-09 | Datos de ejemplo inventados: conteos (3, 18, 8, 12…) y fechas. Aceptables como ejemplo, no son requisito | Baja | Stitch | No copiar a la implementación |
| R-10 | La unidad padre en el selector del filtro solo lista «Unidad de Ejemplo 1/2» sin jerarquía visible, mientras la spec la marca como brecha de componente (SCR-028-Q2); el alternador Lista/Jerarquía se dibuja como control sin ruta (SCR-028-Q3 abierta, propuesta de este agente) | Info | Spec | Sin acción |
| R-11 | Limitación: no se vio la captura a resolución completa ni se verificó comportamiento (orden, expandir/colapsar) | Info | Revisión | Revisión humana en Stitch |
| R-12 | Heredados de GEN-016: el tema por defecto del proyecto sigue siendo «Sovereign Enterprise» (R-09 de GEN-016); no se modificó | Info | Proyecto | Ver GEN-016 |

## Preguntas abiertas

- ¿Se corrige R-01 con `edit_screens` o se regenera? (`edit_screens` fue poco fiable en GEN-016.)
- Redacción de los mensajes (SCR-028-Q5), texto de la etiqueta de vigencia y representación de «sin unidad padre».
- Confirmación de una sola pantalla con alternancia (SCR-028-Q3 / FLW-028-Q1).
- Registro en `DTM-PPM-001` con `register-exploration`, diseño gobernado (Figma) e informe de `accessibility-reviewer` siguen pendientes; esta exploración no los sustituye.

## Regeneración v2 (2026-10-03): éxito en verde y semántica de accesibilidad

Decisiones de `human:ianache`: el éxito y la vigencia usan el verde del design system, que se ajustó en Stitch (`Comsatel Styled` v2: roles `success` #065f46, `success-container` #ecfdf5, `success-outline` #a7f3d0, siempre con icono y texto); el diálogo de resumen de SCR-029-03 muestra solo «{unidad}: de X a Y»; la columna «Hasta» va vacía mientras no se defina su valor. Los prompts exigieron además `aria-hidden` en iconos, `label for`, `aria-invalid`/`aria-describedby`, `role=alert`/`status`, `caption`, `aria-label` en `nav` y `aria-current`. El DTM apunta a la primera hoja de cada pantalla (`version: v2-success-green`); las hojas de estados adicionales solo constan aquí. Los artefactos anteriores quedan en Stitch como residuo (no hay herramienta para borrarlos).

| Pantalla | Resource name (Stitch) |
|---|---|
| SCR-028-01 (A lista, B jerarquía) | `projects/13050549605434273903/screens/a4618f57bdec4cd9a4164d6cc0b3020b` |
| SCR-028-01 (F cargando, G error, H sin permisos) | `projects/13050549605434273903/screens/86eba07cd92340b0bbac094a3c0a67f7` |

**Pendiente:** las variantes C (sin resultados), D (sin unidades registradas) y E (sin organización interna) de SCR-028-01 dieron timeout dos veces y no tienen artefacto verificado.

Revisión de accesibilidad: [ARP-UNIDADES-V2](../handoff/ARP-UNIDADES-REGENERACION-v2.md). Es exploración, no diseño gobernado; revisión humana pendiente.
