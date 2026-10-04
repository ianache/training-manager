---
type: Component Specification
artifact: component-specification
okf: google-okf-v0.2
id: CMP-018
title: CMP-018 — Diseño atómico de las brechas de componentes de la gestión de unidades
description: Diseño atómico (sin código de producción) de los componentes que CMP-017 declaró como brecha en @gf/ui: lista de descripción, tabla ordenable, árbol, diálogo, grupo de alternancia, chip de filtro activo, paginación y migas de pan. Inventario con IDs estables, contrato Angular, accesibilidad, pruebas, contrato npm y límite MicroUI.
tags: [ux-ui, components, gf-ui, atomic-design, estructura-organizacional, brechas]
status: draft
readiness: REQUIRES_REVIEW
human-reviewed: false
verified: false
provenance:
  created_by: web-atomic-component-designer
  method: derived-from-approved-screens-and-existing-library
  confidence: medium
generated:
  by: web-atomic-component-designer/1.0
  at: "2026-10-04T18:00:00-05:00"
sources:
  - id: cmp-017
    resource: /knowledge-base/design/components/CMP-017-componentes-gestion-de-unidades.md
  - id: scr-017
    resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
  - id: scr-028
    resource: /knowledge-base/design/screens/SCR-028-listar-y-buscar-unidades-organizacionales.md
  - id: scr-029
    resource: /knowledge-base/design/screens/SCR-029-registrar-y-editar-unidades-organizacionales.md
  - id: scr-030
    resource: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
  - id: tkn-set-002
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
  - id: dcp-004
    resource: /knowledge-base/architecture/ad-handoff/DCP-004-gestion-de-unidades-organizacionales.md
  - id: dtc-028
    resource: /knowledge-base/implementation/DTC-028-handoff-desarrollo-listar-y-buscar-unidades-organizacionales.md
  - id: dtc-029
    resource: /knowledge-base/implementation/DTC-029-handoff-desarrollo-registrar-y-editar-unidades-organizacionales.md
  - id: dtc-030
    resource: /knowledge-base/implementation/DTC-030-handoff-desarrollo-desactivar-y-reactivar-unidades-organizacionales.md
  - id: cmp-mol-009
    resource: /knowledge-base/design/components/cmp-016/CMP-MOL-009-gf-pagination.md
  - id: ui-lib
    resource: /codebase/apps/portal/projects/ui/src/lib
---

# CMP-018 — Diseño atómico de las brechas de componentes de la gestión de unidades

**Estado: `draft`, `REQUIRES_REVIEW`, `human-reviewed: false`.** Es una propuesta de diseño: no se escribió código de producción. `READY_FOR_DEV` no se declara porque hay decisiones abiertas (sección 12), no existe el informe de `accessibility-reviewer` sobre estos componentes y la infraestructura de pruebas de accesibilidad y visuales no está en el repositorio (sección 9). Lo marcado **(propuesto)** no viene de una fuente y necesita validación humana.

## 1. Alcance y lo que existe

CMP-017 §3 dejó ocho brechas sin diseño. Este documento las diseña, tras inspeccionar `projects/ui/src/lib`:

- **Existe** (átomos): `badge`, `button`, `date-input`, `email-input`, `error-message`, `icon`, `label`, `level-badge`, `select`, `spinner`, `tel-input`, `text-input`. **Existe** (moléculas): `alert`, `autocomplete`, `empty-state`, `form-field`, `radio-card`, `view-state`. No hay carpeta `organisms/`.
- **Convenciones observadas:** selector `gf-*`; clase `GfXxx`; componentes standalone con `ChangeDetectionStrategy.OnPush`; `input()`/`output()` (signals); plantilla y estilos en línea; estilos con variables `--gf-*` (`--gf-space-1..8`, `--gf-radius-sm`, `--gf-touch-target` 44 px, `--gf-color-*`, `--gf-color-focus-ring` `#0059ba`); archivo `nombre/nombre.ts` más `nombre.spec.ts` con Vitest y `TestBed`; exportación por ruta de archivo en `public-api.ts` (`export * from './lib/atoms/button/button'`); comentario de cabecera con el ID `CMP-…`.
- **Ya diseñado, aún no implementado:** `CMP-MOL-009 gf-pagination` (CMP-016), `CMP-MOL-008 gf-vigencia-badge`, `CMP-MOL-011 gf-tabs`, `CMP-ATOM-013 gf-flag`. No están en `public-api.ts`.
- **Reutilización decidida:** `gf-button`, `gf-icon`, `gf-badge`, `gf-vigencia-badge` (MOL-008), `gf-empty-state`, `gf-view-state`, `gf-spinner`, `gf-alert`, `gf-pagination` (MOL-009) y `gf-autocomplete` se reutilizan tal cual. `gf-tabs` (MOL-011) **no** sirve para el alternador de SCR-028 porque está sincronizado con el router y SCR-028 propone una sola pantalla sin ruta (SCR-028-Q3).
- **Discrepancias detectadas** (no se resuelven aquí): (a) las fuentes piden foco de 2 px `#0059ba` con desplazamiento de 2 px y el CSS global de `@gf/ui` usa 3 px con desplazamiento de 2 px (G-1); (b) CMP-017 pide para el éxito `#065f46` sobre `#ecfdf5` y los tokens actuales usan `#065f46` sobre `#dcfce7` (G-2); (c) `gf-button` tiene un output llamado `pressed` que significa «clic», lo que impide añadirle una entrada de estado «presionado» sin confusión (decisión de CMP-ATOM-015).

## 2. Inventario y clasificación

Numeración: se continúa la existente (átomos hasta `CMP-ATOM-013`, moléculas hasta `CMP-MOL-011`, organismos hasta `CMP-ORG-007` en el catálogo de DTC-015). Observación: CMP-016 reutilizó `CMP-ORG-001..003` con otros significados que el catálogo de DTC-015 (G-3, pregunta CMP-018-Q9); aquí se usa `CMP-ORG-008` en adelante para no ampliar la colisión.

| ID | Componente (selector) | Brecha de CMP-017 | Nivel | Justificación de la clasificación | Pantallas |
|---|---|---|---|---|---|
| CMP-ATOM-014 | Chip (`gf-chip`) | chip de filtro activo | átomo | Una sola etiqueta visual con valor; sin flujo propio ni composición de otros átomos de dominio. | 028-01 |
| CMP-ATOM-015 | Botón de alternancia (`gf-toggle-button`) | grupo de alternancia | átomo | Primitiva de interacción: un botón con estado `aria-pressed`. | (interno de MOL-012) |
| CMP-MOL-012 | Grupo de alternancia (`gf-toggle-group`) | grupo de alternancia Lista/Jerarquía | molécula | Compone varios `gf-toggle-button` para una interacción coherente: elegir una opción entre pocas, exclusiva. | 028-01 |
| CMP-MOL-013 | Filtros activos (`gf-active-filters`) | chip + «Limpiar filtros» | molécula | Compone `gf-chip` y `gf-button`; muestra y limpia un hecho coherente (filtros vigentes) y anuncia cambios. | 028-01 |
| CMP-MOL-014 | Lista de descripción (`gf-description-list`) | lista de descripción | molécula | Pares término/valor semánticos (`dl`); compone texto y, por proyección, `gf-badge`/MOL-008. | 017-01, 029-02, 029-03 |
| CMP-MOL-015 | Migas de pan (`gf-breadcrumb`) | migas de pan | molécula | Lista de enlaces en `nav`; una interacción: ubicarse y volver. | 017-02, 029-0x |
| CMP-MOL-009 | Paginación (`gf-pagination`) | paginación | molécula | **Reutilizada** de CMP-016, sin nuevo ID (sección 3.1). | 028-01, 029-04 |
| CMP-ORG-008 | Diálogo (`gf-dialog`) | diálogo de confirmación/bloqueo | organismo | Sección con cabecera, cuerpo y pie proyectados, gestión de foco y capa modal; entradas neutras al dominio. | 029-03, 030-01..04 |
| CMP-ORG-009 | Tabla de datos (`gf-data-table`) | tabla ordenable | organismo | Encabezados ordenables, filas, acciones por fila, estado de carga y sección vacía; responsabilidad de diseño propia. | 028-01, 029-04 |
| CMP-ORG-010 | Árbol (`gf-tree`) | árbol de unidades | organismo | Patrón compuesto con navegación por teclado, nodos anidados y plantilla de nodo. Neutro al dominio (nodos genéricos). | 028-01 |

No se crean plantillas ni páginas: las páginas (`unidades-lista`, etc.) son de `mfe-collaborators` (sección 10) y no forman parte de `@gf/ui`.

Descartado y por qué: (a) `gf-focus-trap` como directiva aparte: `<dialog>` modal nativo ya atrapa el foco y deja inerte el resto, por lo que no hace falta una primitiva adicional (si las pruebas obligan a un sustituto, es la pregunta CMP-018-Q4); (b) sort-header como componente público: es interno de `gf-data-table` y exportarlo congelaría una API sin segundo consumidor; (c) tabla/árbol de `@angular/material` o CDK: prohibido por DTC-015 y SCR-028.

## 3. Especificaciones por componente

Plantilla: `.claude/skills/web-atomic-component-designer/references/component-spec-template.md`. Texto visible: solo el de los SCR; lo propuesto va marcado. Los tipos son la propuesta de contrato, no código implementado.

### 3.1 CMP-MOL-009 — Paginación (reutilizada, sin cambio de diseño)

- **Decisión:** usar el diseño de `cmp-016/CMP-MOL-009-gf-pagination.md` (entradas `page`, `pageSize` por defecto 10, `total`; salida `pageChange`; `nav aria-label="Paginación"`, botones nativos con nombre «Página anterior»/«Página siguiente», región `aria-live="polite"`). Los textos «Anterior» y «Siguiente» de SCR-028/029 coinciden con el diseño. No se crea otro componente.
- **Sin diseño en `@gf/ui` todavía:** hay que implementarlo (semver en sección 8). Uso en SCR-028 condicionado a UXR-028-Q1 (cantidad de unidades); en SCR-029-04 «si hay muchas filas».
- **Pendiente de revisión:** 10 por página lo resolvió ianache para SCR-016 (CMP-016-Q7); para unidades no hay fuente (CMP-018-Q7).
- **Contrato con la tabla:** `gf-data-table` no pagina; el organismo o la página coloca `gf-pagination` debajo (composición, no dependencia).

### 3.2 CMP-ATOM-014 — Chip (`gf-chip`)

- **Identidad:** átomo. Propósito: mostrar un valor de filtro vigente («Estado: Activa» — formato **propuesto**). No hace: filtrar, ni agruparse (eso es MOL-013). Consumidor: MOL-013.
- **Composición:** hijos: texto proyectado y, solo si `removable`, un `gf-icon` (`close`, existente) dentro de un `button`. Depende de `gf-icon`. Búsqueda de reutilización: `gf-badge` es de estado (tono + icono fijo), no de filtro; no sirve.
- **Contrato Angular:**

```ts
export type GfChipTone = 'neutral' | 'info';
// selector: gf-chip · standalone · OnPush
// inputs: tone = input<GfChipTone>('neutral'); removable = input(false);
//         removeLabel = input<string>(''); // obligatorio si removable
// outputs: removed = output<void>();
// slot: contenido por defecto (texto del chip)
```

- **Variantes/estados:** neutral e info (colores `--gf-color-neutral-*` e `--gf-color-info-*`, ya con contraste ≥4.5:1 en TKN-SET-002); con o sin botón de quitar **(propuesto: SCR-028 solo pide «Limpiar filtros», no quitar un filtro individual; por defecto desactivado)**. Foco visible solo en el botón de quitar. Carga/vacío/error/offline: no aplican (presentacional).
- **Accesibilidad:** el chip es texto, no un control (no recibe foco); el botón de quitar tiene `aria-label` = `removeLabel` (obligatorio, WCAG 4.1.2) y mide ≥ 24×24 px (2.5.8; se usa `--gf-touch-target`). Color no es el único diferenciador: lleva texto «Etiqueta: valor». Contraste 1.4.3 y 1.4.11.
- **Pruebas:** unitarias (render del texto, sin botón por defecto, `removed` al activar); interacción (Enter y Espacio sobre el botón); accesibilidad (nombre accesible del botón; axe); visual (neutral, info, con y sin quitar).
- **Cambio:** aditivo; semver menor. Preguntas: CMP-018-Q5.
- **Trazabilidad:** SCR-028-01 (filtros activos) → CMP-017 brecha → este átomo.

### 3.3 CMP-ATOM-015 — Botón de alternancia (`gf-toggle-button`)

- **Identidad:** átomo. Propósito: un botón con estado presionado/no presionado. No hace: gestionar la exclusividad del grupo (MOL-012). Se descarta añadir `pressed` a `gf-button` porque su output `pressed` ya significa «clic» (colisión semántica) y rompería su contrato.
- **Contrato Angular:**

```ts
// selector: gf-toggle-button · standalone · OnPush
// inputs: pressed = input(false); disabled = input(false);
//         ariaLabel = input<string>('');   // obligatorio si solo hay icono
// outputs: toggled = output<void>();       // el padre decide el nuevo estado
// slot: contenido (texto o gf-icon + texto)
```

- **Estados:** no presionado, presionado (fondo `--gf-color-surface-selected` más borde `--gf-color-border-strong`; **no solo color**: el estado se refuerza con un trazo/subrayado de borde y `aria-pressed`), hover, foco, deshabilitado. Altura mínima `--gf-touch-target`.
- **Accesibilidad:** `<button type="button" aria-pressed>`; Tab para entrar, Enter/Espacio para activar; el nombre accesible no cambia con el estado (regla de `aria-pressed`, 4.1.2); foco visible 1.4.11 y 2.4.7 y 2.4.13 (apariencia del foco, ver G-1).
- **Pruebas:** unitarias (`aria-pressed` refleja `pressed`; `toggled` solo si no está deshabilitado); interacción por teclado; accesibilidad (axe, nombre); visual (4 estados).
- **Cambio:** aditivo; semver menor.

### 3.4 CMP-MOL-012 — Grupo de alternancia (`gf-toggle-group`)

- **Identidad:** molécula. Propósito: elegir entre «Lista» y «Jerarquía» (SCR-028-01). Dependencia: `gf-toggle-button`. No hace: cambiar la ruta, ni cargar datos.
- **Contrato Angular:**

```ts
export interface GfToggleOption<T extends string = string> {
  readonly value: T; readonly label: string; readonly icon?: string; // icon existente en gf-icon
}
// selector: gf-toggle-group · standalone · OnPush
// inputs: options = input.required<readonly GfToggleOption[]>();
//         value = model<string>();           // enlace bidireccional por signal
//         groupLabel = input.required<string>(); // p. ej. 'Vista' (propuesto)
// outputs: (valueChange del model)
```

- **Semántica:** `role="group"` con `aria-label=groupLabel` y botones con `aria-pressed` (SCR-028/CMP-017 piden `aria-pressed`, no `radiogroup`). Exactamente una opción presionada; presionar la ya presionada no cambia nada. Cada botón es una parada de Tab (no roving) para no inventar un patrón no pedido.
- **Estados:** valor seleccionado, deshabilitado (todo el grupo; sin fuente de cuándo, SCR-028-Q4). Foco: 2.4.7. Cambio de vista anunciado por un texto en `role="status"` fuera del grupo en la página (**propuesto**), porque `aria-pressed` solo anuncia el botón activado.
- **Pruebas:** unitarias (exclusividad, valor inicial, opción inexistente); interacción (clic, Enter, Espacio; Tab pasa por ambos botones); accesibilidad (rol de grupo y nombre); visual.
- **Cambio:** aditivo; semver menor. Preguntas: CMP-018-Q3 (alternador con o sin ruta).

### 3.5 CMP-MOL-013 — Filtros activos (`gf-active-filters`)

- **Identidad:** molécula. Propósito: mostrar los filtros vigentes y «Limpiar filtros» (SCR-028 zona 2, siempre visible). Compone `gf-chip` y `gf-button` (variante `text`). No hace: aplicar filtros ni conocer sus nombres de dominio (recibe etiqueta y valor).
- **Contrato Angular:**

```ts
export interface GfActiveFilter {
  readonly id: string;
  readonly label: string;   // p. ej. 'Estado'
  readonly value: string;   // p. ej. 'Activa' (texto de SCR-028)
}
// selector: gf-active-filters · standalone · OnPush
// inputs: filters = input.required<readonly GfActiveFilter[]>();
//         clearLabel = input('Limpiar filtros');   // texto de SCR-028
//         regionLabel = input('Filtros activos');  // propuesto (SCR-028 usa «Filtros activos» como nombre de zona)
// outputs: cleared = output<void>();
```

- **Estados:** sin filtros (se muestra una línea de «sin filtros» **(propuesto, sin texto en las fuentes)** o se oculta: pregunta Q5); con filtros; el botón «Limpiar filtros» se deshabilita sin filtros. En `no-results`, la página lo usa junto a `gf-empty-state` y gestiona el foco (SCR-028 «foco gestionado»).
- **Accesibilidad:** contenedor `role="group"` con `aria-label`; una región `role="status"` visualmente oculta que anuncia el cambio de filtros (SCR-028 «Los cambios se anuncian») con el texto «N filtros activos» **(propuesto)**; botón nativo con nombre visible «Limpiar filtros» (2.5.3). Tras limpiar, el componente emite `cleared` y **no mueve el foco**: lo hace la página (restablece al campo de búsqueda, **propuesto**).
- **Pruebas:** unitarias (render de chips, emisión, deshabilitado sin filtros); interacción (Enter/Espacio en el botón); accesibilidad (región de estado anuncia solo cambios, no en la carga inicial); visual.
- **Cambio:** aditivo; semver menor.

### 3.6 CMP-MOL-014 — Lista de descripción (`gf-description-list`)

- **Identidad:** molécula. Propósito: pares etiqueta/valor de solo lectura (razón social, RUC, país, «Vigente desde» en SCR-017-01; unidad y padre en SCR-029-02/03). No hace: edición, formato de dominio ni acciones.
- **Contrato Angular:**

```ts
export interface GfDescriptionItem {
  readonly id: string;
  readonly term: string;           // etiqueta (dt)
  readonly value?: string;         // texto simple (dd)
  readonly valueTemplate?: TemplateRef<unknown>; // dd rico: gf-badge, MOL-008
}
// selector: gf-description-list · standalone · OnPush
// inputs: items = input.required<readonly GfDescriptionItem[]>();
//         layout = input<'stacked' | 'inline'>('stacked');
// slots: ninguno propio; las plantillas se pasan en items (evita wrappers que invaliden dl)
```

- **Semántica:** `<dl>` con grupos `<div><dt/><dd/></div>` (HTML válido); sin `role` extra. Valor ausente: se muestra «—» **(propuesto)** y el `dd` conserva su lugar para no desalinear el par. Responsive: `inline` en escritorio; `stacked` por debajo de un ancho (SCR de escritorio, SCR-028-Q1 abierto).
- **Accesibilidad:** 1.3.1 (información y relaciones); el orden del DOM es término → valor; sin tabindex. Contraste del término con `--gf-color-text-muted` (8.91:1 sobre superficie, TKN-SET-002).
- **Pruebas:** unitarias (estructura dl/dt/dd, valor ausente, plantilla proyectada); accesibilidad (axe: `dl` solo contiene `dt`/`dd`/`div`); visual (stacked/inline).
- **Cambio:** aditivo; semver menor.

### 3.7 CMP-MOL-015 — Migas de pan (`gf-breadcrumb`)

- **Identidad:** molécula. Propósito: ubicar al usuario y volver a niveles superiores. Dependencia: `gf-icon` (`chevron_right`, existente; decorativo). No hace: navegar por sí misma (no depende de `@angular/router`).
- **Contrato Angular:**

```ts
export interface GfBreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly href?: string; // el último elemento (página actual) no lleva href
}
// selector: gf-breadcrumb · standalone · OnPush
// inputs: items = input.required<readonly GfBreadcrumbItem[]>();
//         ariaLabel = input('Migas de pan');          // propuesto; SCR pide nav con aria-label
// outputs: navigate = output<GfBreadcrumbItem>();     // el consumidor enruta; se cancela el href por defecto
```

- **Semántica:** `<nav aria-label><ol><li><a href>…</a></li>…<li><span aria-current="page">…</span></li></ol></nav>`; separadores por CSS o `aria-hidden`. El último elemento no es enlace. Con un solo elemento no se muestra nada **(propuesto)**.
- **Teclado:** Tab por los enlaces; Enter activa; sin atajos. El orden visual y del DOM coinciden (1.3.2).
- **Pruebas:** unitarias (último con `aria-current`; `navigate` y preventDefault con clic normal; con Ctrl/Meta no se intercepta para abrir en pestaña nueva); accesibilidad (landmark `nav` con nombre único si hay otro `nav`, ej. el del shell); visual (truncado de etiquetas largas: Q8).
- **Cambio:** aditivo; semver menor. Pregunta: CMP-018-Q2 (¿vive en el shell?).

### 3.8 CMP-ORG-008 — Diálogo (`gf-dialog`)

- **Identidad:** organismo. Propósito: capa modal con título, cuerpo y acciones, usable para la confirmación de SCR-030-01, el bloqueo informativo de SCR-030-02/04 (solo «Cerrar»), el formulario de reactivación de SCR-030-03 y el resumen «de X a Y» de SCR-029-03. No hace: saber qué se confirma, llamar al servicio ni decidir los textos. Resuelve CMP-017-Q3 (alojamiento) a favor de `@gf/ui` **(propuesto)**: lo usan también SCR-001 y SCR-019.
- **Composición:** `gf-icon` (cerrar, opcional), `gf-button` proyectado por el consumidor. Dirección: depende de átomos; ninguna dependencia hacia páginas.
- **Contrato Angular:**

```ts
export type GfDialogRole = 'dialog' | 'alertdialog';
// selector: gf-dialog · standalone · OnPush
// inputs: open = model(false);                       // abre/cierra con showModal()/close()
//         heading = input.required<string>();        // aria-labelledby
//         role = input<GfDialogRole>('dialog');      // alertdialog para el bloqueo (propuesto)
//         initialFocus = input<'first' | 'cancel' | 'none'>('first'); // SCR-030-01 pide foco inicial en «Cancelar»
//         dismissable = input(true);                 // Escape y clic en fondo cuando no hay guardado
//         busy = input(false);                       // bloquea cierre durante saving
// outputs: closed = output<'escape' | 'backdrop' | 'action'>();
// slots: [gfDialogBody] cuerpo · [gfDialogActions] pie (botones del consumidor)
// side effects: guarda el elemento activo al abrir y lo restaura al cerrar.
```

- **Implementación propuesta:** elemento nativo `<dialog>` con `showModal()` (foco atrapado y resto inerte sin CDK). `aria-modal="true"` se mantiene por exigencia de CMP-017. `aria-labelledby` al título; `aria-describedby` al primer párrafo del cuerpo.
- **Estados:** abierto; guardando (`busy`: Escape y fondo no cierran; el botón de acción del consumidor va en `loading` y «Cancelar» deshabilitado, según SCR-030-01); error y éxito los renderiza el consumidor en el cuerpo con `gf-alert` (SCR-030-01: error con reintento, la unidad no cambia). `loading` propio no aplica. Responsive: ancho 100% en móvil, máx. 600 px en escritorio (ui-inventory, solo como referencia; las pantallas son de escritorio).
- **Teclado/foco:** al abrir, el foco va al elemento indicado por `initialFocus` (en SCR-030-01, «Cancelar»); Tab y Shift+Tab ciclan dentro; Escape cierra y emite `closed('escape')` salvo `busy` o `!dismissable`; al cerrar, el foco regresa al disparador (SCR-030-01: «foco al disparador» al cancelar; tras éxito el consumidor mueve el foco a la fila y lo anuncia, que es responsabilidad de la página).
- **Accesibilidad:** 4.1.2 (rol y nombre), 2.4.3 (orden de foco), 2.1.2 (sin trampa: siempre hay Escape o «Cancelar»/«Cerrar»), 2.4.11 (el foco no queda oculto tras el fondo), 1.4.13. Con `role="alertdialog"` se anuncia el contenido; los conteos del bloqueo (SCR-030-02) van con `role="alert"` según SCR-030, que lo pide en el mensaje: **cuidado de no duplicar el anuncio** (decisión Q4).
- **Pruebas:** unitarias (apertura/cierre, `closed` según causa, `busy`, restauración del foco); interacción (Tab cíclico, Escape, clic en fondo); accesibilidad (nombre, rol, `aria-modal`, foco inicial); visual (confirmación, informativo, guardando, error). **Riesgo:** el entorno de pruebas de `@gf/ui` (Vitest y su DOM) puede no implementar `HTMLDialogElement.showModal`; verificar antes de comprometer la prueba (Q4).
- **Cambio:** aditivo; semver menor.

### 3.9 CMP-ORG-009 — Tabla de datos (`gf-data-table`)

- **Identidad:** organismo. Propósito: tabla semántica ordenable con acciones por fila para SCR-028-01 (vista Lista) y el historial de SCR-029-04. No hace: obtener ni ordenar datos (el consumidor ordena; el organismo emite la intención), paginar, ni conocer «unidades».
- **Composición:** `gf-button` y `gf-icon` internos (botón de orden); celdas por plantilla del consumidor (donde van `gf-badge`, `gf-vigencia-badge`, botones de acción). `gf-pagination` se compone fuera. Estados vacío/error/sin permisos: la página envuelve la tabla con `gf-view-state`/`gf-empty-state` existentes (decisión: la tabla solo conoce `loading`).
- **Contrato Angular:**

```ts
export type GfSortDirection = 'asc' | 'desc';
export interface GfSort { readonly columnId: string; readonly direction: GfSortDirection; }
export interface GfTableColumn<T> {
  readonly id: string;
  readonly header: string;                // texto visible del encabezado
  readonly sortable?: boolean;
  readonly cell?: (row: T) => string;     // texto simple; si falta, se usa gfCellDef
  readonly align?: 'start' | 'end';
}
// selector: gf-data-table · standalone · OnPush · genérico gf-data-table<T>
// inputs: columns = input.required<readonly GfTableColumn<T>[]>();
//         rows = input.required<readonly T[]>();
//         rowId = input.required<(row: T) => string>();
//         caption = input.required<string>();       // <caption>; puede ocultarse visualmente
//         captionHidden = input(false);
//         sort = model<GfSort | null>(null);
//         loading = input(false);                   // aria-busy y filas esqueleto
//         highlightedRowId = input<string | null>(null); // SCR-029: «retorno con la unidad resaltada»
// outputs: sortChange (del model)
// slots: ng-template gfCellDef="columnId" (contexto: $implicit = fila)
//        ng-template gfRowActions (contexto: $implicit = fila) → última columna «Acciones»
//        [gfTableEmpty] contenido cuando rows está vacío y no loading (el consumidor puede no usarlo)
// métodos públicos: focusRow(id: string) para devolver el foco a una fila tras guardar.
```

- **Semántica:** `<table><caption>`, `<thead><tr><th scope="col">`, filas con `<th scope="row">` en la primera columna (nombre) **(propuesto)**; `aria-sort` (`ascending`/`descending`/`none`) solo en el `th` ordenable y en la columna ordenada; el botón de orden vive **dentro** del `th` (`<th aria-sort><button>Nombre</button></th>`). Columna de acciones: encabezado visible «Acciones» (SCR-028).
- **Orden:** ciclo propuesto: sin orden → asc → desc → asc (no se vuelve a «sin orden»); el orden por defecto está abierto (UXR-028-Q2). El orden activo se anuncia por una región `role="status"` oculta («Ordenado por {columna}, {ascendente/descendente}», **propuesto**). Vigencia ordena «por vigencia desde» (SCR-028).
- **Estados:** con datos; ordenada; cargando (`aria-busy="true"` y esqueleto con `gf-spinner` visible y anuncio por `role="status"`: texto de `gf-view-state` «Cargando información», ya existente); vacía (slot); error (la página); `disabled`: sin fuente (SCR-028-Q4). Fila resaltada: fondo `--gf-color-surface-selected` + `aria-current="true"` **(propuesto)**, no solo color.
- **Teclado/foco:** modelo de tabla nativa (no `grid`): Tab recorre botones de orden y acciones por fila en orden de lectura; Enter/Espacio activan. Sin navegación por flechas (se evita prometer un patrón de grid que no se pide). Las acciones llevan nombre accesible con la unidad (SCR-028: «Editar {nombre}», **propuesto**); lo arma el consumidor en su plantilla.
- **Responsive:** escritorio (SCR-028-Q1 abierto); sin desbordamiento horizontal en 1280 px; a menor ancho, desplazamiento horizontal con la tabla en un contenedor enfocable `tabindex="0"` con `role="region"` y `aria-label` (1.4.10, **propuesto**).
- **Pruebas:** unitarias (render de columnas, caption, `scope`, `aria-sort`, ciclo de orden, `loading`, fila resaltada); interacción (clic y teclado en cabecera, acciones, `focusRow`); accesibilidad (axe sobre estructura: `th` asociados, `caption`, sin `aria-sort` en columnas no ordenables); visual (ordenada, cargando, vacía, resaltada, 7 columnas); contrato (el consumidor recibe `sort` y ordena; el componente no reordena `rows`).
- **Rendimiento:** presupuesto propuesto: 200 filas renderizan sin virtualización; si UXR-028-Q1 indica cientos de unidades, se usa paginación (MOL-009) en vez de virtualizar. `@for` con `track rowId`.
- **Cambio:** aditivo; semver menor.

### 3.10 CMP-ORG-010 — Árbol (`gf-tree`)

- **Identidad:** organismo. Propósito: vista Jerarquía de SCR-028-01 («cada unidad bajo su unidad padre vigente», estado y vigencia por nodo). No hace: cargar nodos, filtrar, ni conocer reglas de negocio (BR-PTY-04). Nodos genéricos, de plantilla propia.
- **Contrato Angular:**

```ts
export interface GfTreeNode<T = unknown> {
  readonly id: string;
  readonly label: string;               // nombre accesible del nodo
  readonly children?: readonly GfTreeNode<T>[];
  readonly data?: T;                    // datos para la plantilla (estado, vigencia)
  readonly disabled?: boolean;
}
// selector: gf-tree · standalone · OnPush · gf-tree<T>
// inputs: nodes = input.required<readonly GfTreeNode<T>[]>();
//         treeLabel = input.required<string>();            // aria-label del árbol
//         expandedIds = model<ReadonlySet<string>>(new Set());
//         selectedId = model<string | null>(null);
// outputs: nodeActivated = output<GfTreeNode<T>>();         // Enter/clic
// slots: ng-template gfTreeNodeDef (contexto: $implicit = nodo) → badge de estado y MOL-008
```

- **Semántica (patrón árbol WAI-ARIA):** raíz `role="tree"`; cada nodo `role="treeitem"` con `aria-level`, `aria-setsize`, `aria-posinset`; nodos con hijos `aria-expanded` (true/false); hijos agrupados en `role="group"`; hoja sin `aria-expanded`. El elemento seleccionado lleva `aria-selected="true"`. El estado «Activa/Inactiva» y la vigencia se incluyen **dentro del nombre accesible** del treeitem (la plantilla debe producir texto, no solo color; 1.4.1); los hijos interactivos dentro de un treeitem se evitan.
- **Teclado:** modelo de foco **roving tabindex** (un solo tab stop): Flecha abajo/arriba mueven al nodo visible siguiente/anterior; Flecha derecha: expande si está cerrado, si está abierto pasa al primer hijo; Flecha izquierda: contrae si está abierto, si no pasa al padre; Inicio/Fin al primero/último visible; Enter activa (`nodeActivated`) y Espacio selecciona; Tab sale del árbol. Escritura de carácter para buscar: fuera de alcance. El foco no se pierde al colapsar un padre cuyo hijo tenía el foco (pasa al padre).
- **Estados:** nodo cerrado, abierto, foco, seleccionado, hoja, deshabilitado. Estados de la pantalla (loading, empty, no-results, error, forbidden) los resuelve la página con `gf-view-state`/`gf-empty-state`. Todos los nodos cerrados salvo la raíz expandida por defecto **(propuesto)**. Con filtros Inactiva/Todas cuando el padre no cumple el filtro: abierto en FLW-028-Q6; el árbol solo renderiza lo que reciba.
- **Acciones por nodo:** SCR-028 las asigna a la vista Lista y pide solo estado y vigencia en Jerarquía. El árbol emite `nodeActivated` y la página decide (por ejemplo, abrir la edición). No se anidan botones dentro de treeitem (Q6).
- **Responsive:** escritorio; sangría por nivel `--gf-space-6` (propuesto); profundidad máxima razonable depende de UXR-028-Q1.
- **Pruebas:** unitarias (roles y atributos `aria-level/setsize/posinset/expanded`; expansión/contracción; roving tabindex); interacción (todas las teclas anteriores, foco al contraer, selección); accesibilidad (axe `aria-required-children`, nombre del árbol); visual (árbol 3 niveles, nodo Inactiva, foco); rendimiento (500 nodos sin virtualización: medir antes de comprometer).
- **Cambio:** aditivo; semver menor.

## 4. Árbol de dependencias

```
@gf/ui (existente)               nuevo en este diseño
gf-icon, gf-spinner, gf-button   ─┬─ CMP-ATOM-014 gf-chip ─────────────┐
gf-badge (+ MOL-008 pendiente)    │                                     ├─ CMP-MOL-013 gf-active-filters (+ gf-button)
                                  ├─ CMP-ATOM-015 gf-toggle-button ─── CMP-MOL-012 gf-toggle-group
                                  ├─ CMP-MOL-014 gf-description-list (proyecta gf-badge / MOL-008)
                                  ├─ CMP-MOL-015 gf-breadcrumb (gf-icon)
                                  ├─ CMP-MOL-009 gf-pagination (gf-button; CMP-016)
                                  ├─ CMP-ORG-008 gf-dialog (gf-icon; botones proyectados)
                                  ├─ CMP-ORG-009 gf-data-table (gf-button, gf-icon, gf-spinner)
                                  └─ CMP-ORG-010 gf-tree (gf-icon)
Páginas de mfe-collaborators (no @gf/ui) componen todo lo anterior + gf-view-state, gf-empty-state,
gf-alert, gf-autocomplete, gf-select, gf-text-input.
```

Dirección: átomos → moléculas → organismos → páginas; ningún componente nuevo depende de servicios, `HttpClient`, `@angular/router` ni `@gf/core` (solo presentación). Sin dependencias circulares.

## 5. Contrato npm, exports y semver

- **Paquete:** `@gf/ui` (hoy `0.0.1`, `sideEffects: false`, peer deps `@angular/common`, `@angular/core`, `@angular/forms` `^22.2.0` y `@gf/core` `^0.0.1`). **Sin peer deps nuevas**: sin `@angular/cdk`, `@angular/material`, `@angular/router` ni `@angular/animations`.
- **Punto de entrada:** único (`public-api.ts`), sin entry points secundarios (convención actual). Se añade el directorio `lib/organisms/` (hoy no existe; el comentario de `public-api.ts` ya menciona organismos) con su barrel, y las exportaciones por archivo:

```ts
export * from './lib/atoms/chip/chip';                         // GfChip
export * from './lib/atoms/toggle-button/toggle-button';       // GfToggleButton
export * from './lib/molecules/toggle-group/toggle-group';     // GfToggleGroup, GfToggleOption
export * from './lib/molecules/active-filters/active-filters'; // GfActiveFilters, GfActiveFilter
export * from './lib/molecules/description-list/description-list'; // GfDescriptionList, GfDescriptionItem
export * from './lib/molecules/breadcrumb/breadcrumb';         // GfBreadcrumb, GfBreadcrumbItem
export * from './lib/molecules/pagination/pagination';         // GfPagination (CMP-MOL-009)
export * from './lib/organisms/dialog/dialog';                 // GfDialog
export * from './lib/organisms/data-table/data-table';         // GfDataTable, GfTableColumn, GfSort, GfCellDef, GfRowActions
export * from './lib/organisms/tree/tree';                     // GfTree, GfTreeNode, GfTreeNodeDef
```

- **Semver:** todo aditivo; mientras `@gf/ui` esté en `0.x`, un solo incremento menor a **`0.1.0`** agrupando estos componentes y CMP-MOL-009/008/011 si se implementan juntos. Sin cambios en componentes existentes. Los tipos públicos (`GfSort`, `GfTreeNode`, …) quedan congelados al publicar: cambiarlos en `0.x` es ruptura y exige incremento menor y nota de migración.
- **Reglas:** `ChangeDetectionStrategy.OnPush`, componentes standalone, `input()`/`output()`/`model()`, sin efectos globales (`sideEffects: false`) y sin importar el CSS global: el foco depende del `:focus-visible` global de `styles/tokens.css` (que el consumidor ya carga), sin duplicar estilos.
- **Estado de la biblioteca:** no se afirma que se publique en un registro NPM: hoy se consume en el workspace. La obligación de publicación sigue siendo la del contrato del skill.

## 6. Tokens (sin tokens nuevos)

Solo se usan los `--gf-*` existentes (`color-text`, `color-text-muted`, `color-surface`, `color-surface-container`, `color-surface-selected`, `color-border`, `color-border-strong`, `color-focus-ring`, `color-*-bg/fg`, `space-*`, `radius-sm/md`, `font-size-*`, `touch-target`, `row-height`). No se propone ningún token nuevo. G-1 (grosor del foco) y G-2 (verde de éxito) son discrepancias entre CMP-017 y el código, no tokens por crear.

## 7. Matriz de accesibilidad (WCAG 2.2 AA)

| Criterio | Chip | Toggle (ATOM+MOL) | Filtros activos | Lista desc. | Migas | Paginación (009) | Diálogo | Tabla | Árbol |
|---|---|---|---|---|---|---|---|---|---|
| 1.3.1 Información y relaciones | texto | `group` + `aria-pressed` | `group` + `status` | `dl/dt/dd` | `nav>ol` | `nav` | `labelledby` | `caption`, `th scope`, `aria-sort` | `tree/treeitem/group`, `aria-level` |
| 1.4.1 Uso del color | texto con valor | estado ≠ solo color | texto | — | texto + separador | — | — | «Activa/Inactiva» y fila resaltada con texto/atributo | estado en el nombre accesible |
| 1.4.3 / 1.4.11 Contraste | tonos de TKN-SET-002 | borde ≥3:1 | = chip | 8.91:1 | enlace 6.38:1 | — | fondo/capa | bordes ≥3:1 | foco 6.38:1 |
| 2.1.1 Teclado | botón quitar | Tab, Enter, Espacio | Tab, Enter | sin foco | Tab, Enter | Tab, Enter | Tab cíclico, Escape | Tab, Enter | roving + flechas |
| 2.1.2 Sin trampa | — | — | — | — | — | — | Escape y botón | — | Tab sale |
| 2.4.3 Orden del foco | — | orden DOM | orden DOM | — | orden DOM | orden DOM | foco inicial + retorno | orden de lectura | un tab stop |
| 2.4.7 / 2.4.13 Foco visible | quitar | sí | sí | — | sí | sí | sí | sí | nodo activo |
| 2.4.11 Foco no oculto | — | — | — | — | — | — | verificar con fondo | verificar con cabecera fija | — |
| 2.5.3 Etiqueta en el nombre | `removeLabel` incluye el valor | texto visible | «Limpiar filtros» | — | texto | «Anterior», «Siguiente» | botones del consumidor | acciones con nombre de la unidad | — |
| 2.5.8 Tamaño del objetivo (24 px) | `--gf-touch-target` | 44 px | 44 px | — | ≥24 px | 44 px | 44 px | 44 px | fila ≥ `--gf-row-height` |
| 3.3.x / 4.1.2 Nombre, rol, valor | `aria-label` | `aria-pressed` | región | — | `aria-current` | `aria-live` | `role`, `aria-modal` | `aria-sort` | `aria-expanded/selected` |
| 4.1.3 Mensajes de estado | — | anuncio en página | `role="status"` | — | — | `aria-live` | `role="alert"` (bloqueo) | orden y carga en `status` | — |

Ningún cumplimiento se afirma: son requisitos de diseño. La revisión formal queda para `accessibility-reviewer` y las pruebas de la sección 9.

## 8. Cambio, ciclo de vida y semver

Todos los componentes: **aditivos, semver menor (0.1.0)**. No hay deprecaciones ni migración. Los selectores `gf-*` siguen la convención; ningún selector existente se modifica.

## 9. Matriz de pruebas

Convención observada: Vitest + `TestBed`, `*.spec.ts` junto al componente (`atoms/label/label.spec.ts`). **No hay** `axe-core`, Storybook, pruebas visuales ni de contrato en el workspace (`package.json`): se consideran propuestas y exigen decisión (Q10).

| Componente | Unitarias | Interacción | Accesibilidad | Visual | Contrato consumidor |
|---|---|---|---|---|---|
| ATOM-014 chip | texto, `removed`, sin botón por defecto | Enter/Espacio | nombre del botón | 2 tonos × quitar | `GfChipTone` |
| ATOM-015 toggle-button | `aria-pressed`, `toggled`, disabled | teclado | rol/nombre | 4 estados | — |
| MOL-012 toggle-group | exclusividad, valor | clic, teclado, Tab | rol group y nombre | seleccionada | `GfToggleOption` |
| MOL-013 active-filters | chips, `cleared`, disabled | botón | `status` solo en cambios | con/sin filtros | `GfActiveFilter` |
| MOL-014 description-list | estructura, vacío, plantilla | — | axe `dl` | stacked/inline | `GfDescriptionItem` |
| MOL-015 breadcrumb | `aria-current`, `navigate`, Ctrl-clic | Tab/Enter | landmark con nombre | largo | `GfBreadcrumbItem` |
| MOL-009 pagination | límites, rango, `pageChange` | Tab/Enter | `aria-live` | extremos | (CMP-016) |
| ORG-008 dialog | abrir/cerrar, `closed`, `busy`, foco | Tab cíclico, Escape, fondo | rol, `aria-modal`, nombre, foco inicial | confirmar, informativo, guardando | `GfDialogRole` |
| ORG-009 data-table | caption, `scope`, `aria-sort`, orden, loading | cabecera, acciones, `focusRow` | axe tabla | ordenada, cargando, vacía, resaltada | `GfSort`, `GfTableColumn` |
| ORG-010 tree | roles/atributos, expandir | flechas, Inicio/Fin, Enter, Espacio | `aria-required-children` | 3 niveles, foco, Inactiva | `GfTreeNode` |

Pruebas manuales exigidas antes de dar por buenos tabla, árbol y diálogo (los de mayor riesgo, CMP-017 §3): NVDA o JAWS sobre Windows y verificación de navegador (ARP-UNIDADES-V2/CHK-UNIDADES-001). Quién las ejecuta: sin dato (Q10).

## 10. Análisis de límite MicroUI (DDD)

Plantilla: `references/micro-ui-ddd-boundary-template.md`.

- **Candidato evaluado:** la página de gestión de unidades organizacionales (SCR-017/028/029/030) y su uso de estos componentes.
- **Contexto delimitado:** party-management (`/organizations`, DCP-004). **Capacidad y recorrido:** estructura organizacional del Jefe de Ingeniería (registrar organización, listar, editar, desactivar/reactivar). **Actor:** Jefe de Ingeniería (BR-PTY-17).
- **Decisión: `FRONTEND_MODULE`.** Las páginas viven en `mfe-collaborators` (módulo ya existente, como US-015/016) y los componentes genéricos en `@gf/ui`. Razones: (1) autonomía de despliegue no evidenciada: DCP-004 asigna los cambios a `party-management-service`, `bff`, `portal (mfe-collaborators)` y `@gf/ui` en una sola entrega; (2) el lenguaje y las reglas son de party y colaboradores (BR-PTY-*), sin lenguaje propio distinto que justifique aislar; (3) el recorrido es corto y el costo de UX y de integración en tiempo de ejecución de un MicroUI nuevo supera el beneficio; (4) no hay evidencia de un equipo con propiedad independiente.
- **Faltan evidencias** (no se inventan): equipo propietario y su autonomía de despliegue (Q1); dónde está la entrada (UXR-017-Q4/FLW-017-Q4 sin resolver).
- **Los componentes de esta propuesta no son una frontera de MicroUI**: son artefactos de biblioteca. Solo presentación, sin estado global ni agregados compartidos. El Shell sigue siendo dueño de la navegación global; las migas de pan pueden ser del Shell (Q2).

## 11. Qué no se asume

- Que haya más de un consumidor real de cada componente nuevo antes de implementarlo (tabla: SCR-028 y SCR-029-04; diálogo: SCR-029/030 y SCR-001/019 por inferencia de CMP-017; árbol, chip, toggle y filtros: solo SCR-028).
- Que `gf-autocomplete` ya excluya la propia unidad y sus descendientes o filtre por estado: sigue siendo CMP-017-Q1 (no es una brecha de estos componentes).
- Que `gf-button` tenga variante de carga completa (existe `loading` con `aria-busy` y deshabilitado: ver código; CMP-017-Q2 queda como verificada en lectura, no en prueba).
- Textos de vacío, error, sin permisos, éxito, consecuencia, y de anuncios: no hay redacción en las fuentes (SCR-028-Q5, SCR-030-Q4); los textos marcados «propuesto» son de este documento.
- Que el DOM de pruebas soporte `<dialog>` modal, que `axe-core` esté disponible o que exista Storybook.
- Acciones dentro del árbol, quitar un filtro individual, comportamiento móvil o de tableta.
- Ninguna revisión humana: `human-reviewed` queda en `false`.

## 12. Preguntas abiertas

| ID | Pregunta | Propietario sugerido | Bloquea |
|---|---|---|---|
| CMP-018-Q1 | ¿Qué equipo es dueño del flujo de unidades y qué autonomía de despliegue tiene? Confirma o cambia `FRONTEND_MODULE` | ianache / Arquitectura | Límite |
| CMP-018-Q2 | ¿Las migas de pan viven en `@gf/ui` o en el shell? (CMP-017 las marca «pertenece al shell») | ianache | MOL-015 |
| CMP-018-Q3 | ¿El alternador Lista/Jerarquía es un control sin ruta (MOL-012) o pestañas con ruta (MOL-011)? Hereda SCR-028-Q3 | ianache | MOL-012 |
| CMP-018-Q4 | ¿Se acepta `<dialog>` nativo? Si el DOM de pruebas no lo soporta, ¿se acepta un polyfill de prueba o una directiva de foco propia? Bloqueo con `role="alert"` frente a `alertdialog`: ¿un solo anuncio? | Developer + `accessibility-reviewer` | ORG-008 |
| CMP-018-Q5 | ¿«Quitar» por chip individual y la línea «sin filtros»? ¿Qué texto del anuncio de cambios? | ianache / UX | ATOM-014, MOL-013 |
| CMP-018-Q6 | ¿Hay acciones en los nodos del árbol (SCR-028 solo las pide en la lista) y qué hace Enter sobre un nodo? | ianache / UX | ORG-010 |
| CMP-018-Q7 | Tamaño de página en unidades y si hace falta paginar (UXR-028-Q1) | ianache | MOL-009 en 028 |
| CMP-018-Q8 | Textos largos en migas y celdas: ¿truncar o ajustar? | UX | ORG-009, MOL-015 |
| CMP-018-Q9 | Colisión de `CMP-ORG-001..003` entre CMP-016 y el catálogo de DTC-015: ¿se renumera CMP-016? | ianache | Trazabilidad |
| CMP-018-Q10 | ¿Se añade `axe-core` (devDependency) y quién ejecuta las pruebas con lector de pantalla? ¿Storybook o pruebas visuales? | Developer / QA | Pruebas |
| CMP-018-G1 | Foco: ¿2 px (fuentes) o 3 px (CSS global de `@gf/ui`)? | UX | Visual |
| CMP-018-G2 | Verde de éxito: `#ecfdf5` (CMP-017) o `#dcfce7` (tokens actuales) | UX | Visual |

## 13. Estado y siguientes pasos

- **Readiness:** `REQUIRES_REVIEW`. Propietario: ianache. Acción siguiente: resolver Q2, Q3, Q4 y Q6 (definen contrato), y encargar a `accessibility-reviewer` el informe de ORG-008, ORG-009 y ORG-010 antes de implementar.
- **Compuertas del skill:** inventario con IDs y trazabilidad: cumple. Contrato Angular, estados, accesibilidad, exports y semver: especificados. Pruebas: especificadas, con infraestructura faltante (Q10). MicroUI: decisión `FRONTEND_MODULE` con evidencia parcial (Q1).
- **Trazabilidad:** US-017/028/029/030 → UXR → FLW → SCR-017/028/029/030 → CMP-017 (brecha) → CMP-018 → DTC-028/029/030. Entradas y enlaces: [CMP-017](CMP-017-componentes-gestion-de-unidades.md), [CMP-MOL-009](cmp-016/CMP-MOL-009-gf-pagination.md), [CMP-016](CMP-016-componentes-actualizar-datos-y-contactos.md).
