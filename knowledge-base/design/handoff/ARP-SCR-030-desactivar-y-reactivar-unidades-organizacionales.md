---
id: ARP-SCR-030
type: Accessibility Report
title: 'ARP-SCR-030 — Informe de accesibilidad: Desactivar y reactivar unidades organizacionales (SCR-030-01, -02, -03)'
description: 'Revisión WCAG 2.2 AA del HTML exploratorio de Stitch de SCR-030-01..03. Resultado fail en las tres; SCR-030-04 sin exploración, fuera de alcance.'
tags:
- ux-ui
- accessibility
- a11y-report
- party
- estructura-organizacional
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T20:00:00-05:00'
sources:
- id: scr-030
  resource: /knowledge-base/design/screens/SCR-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: flw-030
  resource: /knowledge-base/design/user-flows/FLW-030-desactivar-y-reactivar-unidades-organizacionales.md
- id: gen-030
  resource: /knowledge-base/design/generations/GEN-030-stitch-desactivar-y-reactivar-unidades-organizacionales.md
a11y_reviews:
- {screen: SCR-030-01, target: html, result: fail, requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, focus-trap, error-announcement]}
- {screen: SCR-030-02, target: html, result: fail, requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, focus-trap, error-announcement]}
- {screen: SCR-030-03, target: html, result: fail, requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, focus-trap, error-announcement]}
# Formato por pantalla (a11y_review del skill), una entrada por SCR en a11y_reviews.
a11y_review: {screen: [SCR-030-01, SCR-030-02, SCR-030-03], target: html, result: fail, requirements_checked: [WCAG-2.2-AA]}
out_of_scope: [SCR-030-04]
human_review: pending
---

# ARP-SCR-030 — Informe de accesibilidad

## Alcance y método

- **Objetivo:** HTML exploratorio de Stitch (proyecto `13050549605434273903`), descargado a `C:\temp\arp030\s01.html`, `s02.html`, `s03.html` (pantallas `06e62932…`, `ab28fe4f…`, `6e368fd6…`). Cada HTML apila las variantes de estado (01: A predeterminado, B guardando, C éxito, D error; 02: A, B cargando, C sin permisos; 03: A, B fecha inválida, C guardando, D éxito).
- **Fuera de alcance:** SCR-030-04 (Reactivación bloqueada por padre Inactivo) no tiene exploración en Stitch; no se revisa y no tiene resultado.
- **Método:** lectura estática del marcado y de los colores del HTML; contraste calculado (fórmula WCAG) con los hex reales, mezclando opacidades cuando aplica. **No hubo navegador ni captura renderizada ni lector de pantalla:** lo que depende de comportamiento (trampa de foco, Escape, retorno de foco, anuncios dinámicos, reflow real) es `inconclusive`. El HTML no contiene JavaScript propio, así que ese comportamiento no está en el artefacto.
- **Aviso:** Stitch afirma "Comsatel Styled"/WCAG en su título; eso no se toma como evidencia.
- **Alcance de pantalla:** los hallazgos de la cromática del shell (barra superior y menú lateral) se anotan, pero pertenecen al shell y no a SCR-030; se marcan así.
- **Requisitos del SCR** (`a11y_requirements`): WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, focus-trap, error-announcement.

## Resumen

| SCR | Resultado | fail | inconclusive |
|---|---|---|---|
| SCR-030-01 | **fail** | F-01-1..F-01-4, F-X-1, F-X-2 | I-01-1..I-01-4 |
| SCR-030-02 | **fail** | F-02-1..F-02-3, F-X-1, F-X-2 | I-02-1..I-02-4 |
| SCR-030-03 | **fail** | F-03-1..F-03-5, F-X-1, F-X-2 | I-03-1..I-03-3 |

## Hallazgos transversales (SCR-030-01, -02, -03)

- **F-X-1 (fail, WCAG 1.1.1 / 4.1.2; severidad media).** Los iconos Material Symbols son `<span>` con texto-ligadura ("warning", "check_circle", "error", "hub", "open_in_new", "sync", "block", "lock"…) sin `aria-hidden="true"`. Evidencia: 0 ocurrencias de `aria-hidden` en los tres HTML. Un lector de pantalla leerá el nombre del icono; p. ej. el enlace "Ir a las unidades hijas" queda con nombre "Ir a las unidades hijas open_in_new" y el estado queda "check_circle Activa". Aplica a SCR-030-01, -02 y -03.
- **F-X-2 (fail, requisito `accessible-names` del SCR; severidad media).** El SCR exige que los botones y enlaces de acción tengan nombre accesible con el nombre de la unidad. Ningún botón ni enlace lo tiene: "Desactivar", "Cancelar", "Reactivar", "Cerrar", "Ir a las personas" no llevan `aria-label` ni texto oculto con "Dirección de Operaciones". Los botones de fila de fondo también son "Desactivar"/"Reactivar" sin unidad. Matiz: el diálogo (01 y 02) se nombra con un título que incluye la unidad, lo que mitiga pero no cumple lo que pide el SCR.
- **Contraste no textual (1.4.11), pass evaluado.** Foco azul `#0059ba`: 6.69:1 sobre blanco, 6.38:1 sobre `#fff8f6`. Bordes de campos/botones `#956d67`: 4.51:1 sobre blanco.
- **Iconos + texto, no solo color (1.4.1), pass evaluado:** los estados "Activa" (check) e "Inactiva" (block/cancel) llevan texto además de icono y color en 01, 02 y 03. Cumple el punto "Estado Inactiva con texto" del checklist del SCR.
- **Objetivos táctiles (2.5.8), pass evaluado:** botones de diálogo ~36–40 px de alto; botones de fila `text-xs` + `py-1.5` ≈ 28 px (≥ 24 px). Los enlaces `text-xs` de SCR-030-02 (≈16 px de alto) quedan separados de otros objetivos más de 24 px, lo que cumple por la excepción de espaciado. Evaluado por dimensiones del CSS, no medido en pantalla.
- **Idioma (3.1.1):** `lang="es"` presente en las tres. Pass.

## SCR-030-01 — Confirmar desactivación de la unidad — fail

| Criterio | Resultado | Evidencia |
|---|---|---|
| 4.1.2 role/nombre del diálogo | pass | `role="dialog" aria-modal="true" aria-labelledby` apuntando al título con el nombre de la unidad, en A, B y D. |
| 1.4.3 contraste de texto | pass (con F-01-1) | Cuerpo del diálogo 10.84:1; botón primario blanco/`#bc0100` 6.68:1; error `#bc0100` sobre `#fff0ee` 6.03:1; subtexto de error 8.47:1; éxito `emerald-900` sobre `emerald-50` 9.23:1; Inactiva 13.34:1. |
| 1.4.3 contraste (shell) | **fail** F-01-1 | Cabeceras del menú lateral "MI DESARROLLO"/"PERSONAS" `text-gray-400` (`#9ca3af`) sobre blanco: **2.54:1** (<4.5:1). Texto de 12 px en negrita. Es el shell, no el diálogo. |
| 2.4.7 foco visible | pass parcial | El estado A muestra "Cancelar" con anillo `#0059ba` (foco inicial, como pide el SCR). El resto de botones no tienen estilo de foco propio y no se anula el contorno del navegador; se asume el contorno por defecto sin comprobar el render. |
| 4.1.3 estado "guardando" | **fail** F-01-2 | En B el botón sigue diciendo "Desactivar" y el spinner SVG no tiene texto ni `role="status"`/`aria-live`/`aria-busy`. No hay texto como "Desactivando…" que un lector pueda anunciar. |
| 2.4.3 foco al deshabilitar | **fail** F-01-3 | En B, "Cancelar" (foco inicial) pasa a `disabled`, y "Desactivar" también; no queda ningún elemento enfocable en el diálogo y el diseño no declara dónde queda el foco; deshabilitar el elemento enfocado lo pierde. El SCR pide deshabilitar durante saving, por lo que se registra la tensión, no una decisión. |
| 4.1.3 error | pass de marcado | D: `role="alert"` en el aviso de error con texto + icono + "Reintentar". El anuncio real al inyectarse es `I-01-2`. |
| 4.1.3 éxito | pass de marcado | C: `role="status"` en el mensaje. |
| 4.1.2 fila enfocable | **fail** F-01-4 (severidad baja) | C: la fila de éxito es `<div tabindex="0">` sin rol ni nombre. El SCR pide foco a la fila, pero `tabindex="0"` la mete en el orden de tabulación como parada sin función, y no tiene rol/nombre. Se propone (sin decidir) `tabindex="-1"` con nombre accesible. |
| Requisito `accessible-names` | fail | F-X-2. |

**Inconclusive (preguntas abiertas)**
- **I-01-1 Trampa de foco, Escape y retorno al disparador** (`focus-trap`, `keyboard-nav`): el HTML no tiene JS. Los botones del fondo atenuado solo llevan `pointer-events-none` (no impide Tab) ni `inert`/`aria-hidden`. ¿Se comprobará en la implementación o en un prototipo con navegador?
- **I-01-2 Anuncio de D y C:** ¿el aviso `role="alert"` y el `role="status"` se insertarán dinámicamente en una región viva ya presente? En el mock están estáticos.
- **I-01-3 Foco no oculto (2.4.11):** la barra superior es `sticky h-16`; al llevar el foco a la fila en C podría quedar tapada si no hay `scroll-padding-top`. Requiere navegador.
- **I-01-4 Reflow (1.4.10):** el menú lateral es `w-64 shrink-0` (256 px) y el SCR es solo escritorio (SCR-030-Q5). A 400 % de zoom en 1280 px el viewport equivale a 320 px y el menú ocuparía casi todo; no se midió. ¿Aplica reflow al escritorio de esta plataforma, o se acepta como excepción?

## SCR-030-02 — Desactivación bloqueada por dependencias — fail

| Criterio | Resultado | Evidencia |
|---|---|---|
| 4.1.2 role/nombre del diálogo | pass | `role="dialog" aria-modal="true" aria-labelledby` en A y B. |
| 4.1.3 bloqueo con `role="alert"` | pass de marcado | A: el contenedor de conteos ("3 unidades hijas activas", "12 personas con pertenencia vigente") lleva `role="alert"`; conteos concretos como pide el SCR. Anuncio real: `I-02-1`. |
| 1.4.3 contraste | pass | Enlace `#0059ba` sobre `error-container/60` 5.75:1; icono/texto primario sobre ese fondo 5.74:1; `on-surface` sobre fondo del botón Cerrar 14.0:1; badge "Activa" 13.26:1; chip "Sin permisos" 8.46:1. |
| 2.4.7 foco visible | pass | Enlaces y "Cerrar" definen `focus:ring-2 focus:ring-tertiary` (6.69:1). Sin `ring-offset` en los enlaces, pero el anillo contrasta. |
| 2.5.8 objetivos | pass | Ver transversales. |
| 1.3.1 / 4.1.3 estado "cargando" | **fail** F-02-1 | B: el título dice "No se puede desactivar Dirección de Operaciones" mientras se cargan las dependencias, es decir, afirma un bloqueo antes de saberlo. Además "Cargando dependencias…" no está en `role="status"`/`aria-live` ni hay `aria-busy`; los esqueletos (`animate-pulse`) sin texto alternativo. |
| 4.1.2 alerta con contenido interactivo | **fail** F-02-2 (severidad baja) | Los enlaces "Ir a…" están dentro del `role="alert"`; las alertas se anuncian completas y no deben contener controles. Verboso con F-X-1 ("open_in_new"). |
| Foco inicial (2.4.3) | **fail** F-02-3 | El SCR no fija foco inicial para este diálogo y el diseño tampoco muestra ninguno en A ni en B; con diálogo modal, el primer foco debería estar en un control del diálogo o en el título. No se puede juzgar sin comportamiento, pero el diseño no lo declara y falta un estado visible: se registra como falta de declaración. |
| Requisito `accessible-names` | fail | F-X-2 (enlaces "Ir a las unidades hijas"/"Ir a las personas" sin unidad). |
| Variante C "Sin permisos" | pass parcial | Texto + icono "Sin permisos", contraste 8.46:1. No es diálogo. Divergencia con el SCR (las acciones "no son visibles") no es de accesibilidad y no se juzga aquí. |

**Inconclusive**
- **I-02-1 Anuncio del bloqueo:** un `role="alert"` presente al renderizar el diálogo puede no anunciarse; ¿se inserta tras el cálculo? ¿El título y el foco inicial bastan para el lector?
- **I-02-2 Trampa de foco/Escape/retorno:** igual que I-01-1; los botones del fondo siguen siendo enfocables por teclado.
- **I-02-3 Destino de los enlaces** (FLW-030-Q3, sin definir): `href="#"` no permite evaluar propósito del enlace (2.4.4) más allá del texto.
- **I-02-4 Reflow y foco no oculto:** igual que I-01-3/I-01-4.

## SCR-030-03 — Reactivar la unidad (fecha desde) — fail

| Criterio | Resultado | Evidencia |
|---|---|---|
| 4.1.2 role del diálogo | **fail** F-03-1 (severidad alta) | El contenedor de A, B y C es un `<div>` sin `role="dialog"`/`alertdialog`, sin `aria-modal` y sin `aria-labelledby`; el título es un `<h4>` suelto. Incumple el requisito de diálogo (`focus-trap`, SCR inventory). Contraste con SCR-030-01/02, que sí lo declaran. |
| 4.1.2 campo requerido | **fail** F-03-2 | El SCR exige `aria-required`; ningún `<input>` lleva `required` ni `aria-required`. El `*` solo está en la etiqueta y no se explica (3.3.2). |
| 3.3.2 instrucción y 1.4.3 placeholder | **fail** F-03-3 | El formato "dd/mm/aaaa" solo está como placeholder (`#5c413e` al 60 %): **3.17:1** sobre blanco y 3.11:1 sobre `#fff8f6` (<4.5:1). El hint desaparece al escribir y no hay otra instrucción. |
| 4.1.3 éxito sin región viva | **fail** F-03-4 | D: el mensaje "La unidad … ha sido reactivada con éxito." es un `<div>` sin `role="status"`/`aria-live`; no se anunciará. (Contraste del mensaje 5.24:1 pass.) |
| 4.1.3 / 2.4.3 estado "guardando" | **fail** F-03-5 | C: igual que F-01-2/F-01-3: sin texto de estado anunciable, el botón conserva "Reactivar" con spinner, y el campo, "Cancelar" y "Reactivar" quedan `disabled` sin foco declarado. |
| 3.3.1 identificación del error | pass de marcado | B: `aria-invalid="true"`, `aria-describedby="error-fecha-b"`, texto "Indica una fecha válida" + icono (no solo color); etiqueta y mensaje `#bc0100` sobre blanco 6.68:1. El texto exacto sigue sin definir (SCR-030-Q2). |
| 1.4.3 contraste restante | pass | Vigencia/padre `#5c413e` sobre `#fff0ee` 8.31:1; Inactiva 7.92:1; "Activa" `#137333` sobre `#e6f4ea` 5.24:1; botón blanco/`#bc0100` 6.68:1. Disabled exento (1.4.3). |
| 2.4.7 foco visible | pass parcial | Campos y "Reactivar" definen `focus:ring-2 #0059ba` (6.69:1), pero se anula el contorno (`focus:outline-none`) y "Cancelar" no define foco propio, ni se anula; se asume el contorno por defecto sin comprobar el render. La fila de éxito D muestra anillo azul (`border-2`, 6.69:1). |
| 2.5.8 objetivos | pass | Campo ≈ 38 px; botones ≈ 36–38 px. |
| Requisito `accessible-names` | fail | F-X-2. |

**Inconclusive**
- **I-03-1 Teclado, trampa de foco, Escape y retorno:** sin JS; sin `aria-modal` en el marcado no hay indicio de intención de modalidad.
- **I-03-2 Selector de fecha:** el campo es `type="text"` y el icono de calendario es decorativo con `pointer-events-none`; no hay botón de calendario. ¿Habrá selector? De haberlo debe ser operable por teclado. (SCR-030-Q2 también deja abiertos el defecto y el rango.)
- **I-03-3 Anuncio del error de validación:** ¿se anuncia al enviar (por `role="alert"` o foco al campo)? El mock es estático. Reflow y foco no oculto: igual que I-01-3/I-01-4.

## Preguntas abiertas

| ID | Pregunta | Bloquea |
|---|---|---|
| ARP-030-Q1 | Trampa de foco, Escape y retorno al disparador en 01, 02, 03 (I-01-1, I-02-2, I-03-1): ¿se comprueban en un prototipo con navegador o en la implementación? | Gate |
| ARP-030-Q2 | Dónde queda el foco cuando el control enfocado se deshabilita en `saving` (F-01-3, F-03-5)? Es decisión de producto/UX. | Gate |
| ARP-030-Q3 | Texto de estado en `saving` y `loading` (F-01-2, F-02-1, F-03-5): ¿visible, solo accesible o ambos? | Gate |
| ARP-030-Q4 | ¿Aplica reflow a 320 px (1.4.10) a un SCR solo de escritorio (SCR-030-Q5)? | No |
| ARP-030-Q5 | SCR-030-04 sin exploración: queda sin revisar hasta que exista el HTML. | Gate |

## Decisiones humanas

Ninguna registrada. Este informe no corrige el diseño ni decide producto; las propuestas citadas son sugerencias para `ui-spec-writer` / Stitch y requieren decisión humana. Estado `draft`; revisión humana pendiente; nunca `verified`.
