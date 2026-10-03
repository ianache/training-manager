---
id: ARP-SCR-017-02
type: Accessibility Report
title: ARP-SCR-017-02 — Revisión de accesibilidad: Registrar la organización interna (HTML Stitch)
description: Revisión estática WCAG 2.2 AA del HTML exploratorio de Stitch para SCR-017-02 (variantes A a F). Resultado fail; borrador, sin verificación humana.
tags:
- ux-ui
- accessibility
- party
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-03T18:00:00-05:00'
sources:
- id: scr-017
  resource: /knowledge-base/design/screens/SCR-017-registrar-la-organizacion-interna.md
- id: flw-017
  resource: /knowledge-base/design/user-flows/FLW-017-registrar-la-organizacion-interna.md
- id: gen-017
  resource: /knowledge-base/design/generations/GEN-017-stitch-registrar-la-organizacion-interna.md
- id: stitch-html
  resource: stitch:projects/13050549605434273903/screens/f8bc9e0d2d4e4fd685b102f72dd5b921
a11y_review:
  screen: SCR-017-02
  target: html
  result: fail
  requirements_checked: [WCAG-2.2-AA, keyboard-nav, focus-visible, accessible-names, error-announcement]
  counts: {pass: 12, fail: 8, inconclusive: 7}
---

# ARP-SCR-017-02 — Registrar la organización interna

**Método.** Análisis estático del HTML de Stitch (`C:\temp\arp017\s02.html`) y contraste calculado con los colores de su configuración Tailwind. No se ejecutó en navegador ni se examinó la captura. Lo que Stitch afirma de sí mismo no cuenta como evidencia. El HTML apila las variantes A (predeterminado), B (error de validación), C (RUC duplicado), D (identificación de persona), E (guardando / error al guardar) y F (éxito). Estado `draft`; nunca `verified`.

## Criterios

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1.1.1 Contenido no textual | **fail** | Todos los iconos son ligaduras de Material Symbols sin `aria-hidden` («error», «logout», «refresh», «check_circle», «arrow_drop_down»…), que se exponen como texto en el nombre accesible. |
| 1.3.1 Información y relaciones | **fail** | En la variante E los `<label>` no tienen `for` y los campos no tienen `id`, de modo que no hay asociación (6 etiquetas). Los mensajes de error de B, C y D son `div` hermanos sin vínculo con el campo. |
| 1.3.4 Orientación | pass | Sin bloqueo. |
| 1.4.1 Uso del color | pass | Los errores llevan icono y texto, además de borde de 2 px. |
| 1.4.3 Contraste (texto) | **fail** | Los `placeholder` («Ej. Organización de ejemplo S.A.C.», «Ej. 20000000001») usan `on-surface-variant/50` sobre #fff: 2.55:1, por debajo de 4.5:1. Cumplen: etiquetas 16.31; error #bc0100 / #fff = 6.68; alerta #93000a / #ffdad6 = 7.24; badge #410000 / #ffdad5 = 13.26; botón Cancelar 14.0; texto de apoyo 8.94. Los botones y campos `disabled` están exentos. |
| 1.4.10 Reflow (320 px) | **fail** | La barra lateral `w-64 flex-shrink-0` (256 px) más `main p-8` (64 px de relleno) deja 0 px de contenido a 320 px, con desplazamiento horizontal. Cálculo por CSS, no medido en navegador. El SCR declara solo escritorio (SCR-017-Q6); decisión de producto. |
| 1.4.4 Cambiar tamaño de texto | inconclusive | Requiere navegador. |
| 1.4.12 Espaciado de texto | inconclusive | Requiere navegador. |
| 1.4.11 Contraste no textual | pass | Borde de campo #956d67 / #fff = 4.51; anillo de foco #0059ba = 6.69; borde de error #bc0100 = 6.68; los separadores de tarjeta son decorativos. |
| 2.1.1 Teclado | **fail** | El primer elemento del breadcrumb, «Organización interna», es un `<span class="cursor-pointer">` con hover, sin `href`, `tabindex` ni `role`: aparenta ser enlace y no es operable por teclado. |
| 2.4.1 Evitar bloques | pass | Landmarks `header`, `aside/nav`, `main` (sin skip link). Los dos `nav` carecen de `aria-label`. |
| 2.4.2 Título | pass | `<title>` descriptivo (con ID interno SCR-017-02). |
| 2.4.3 Orden del foco | pass | Orden DOM lógico; no hay `tabindex` positivo. |
| 2.4.6 Encabezados y etiquetas | pass | `h1`, y un `h2` por variante. |
| 2.4.7 Foco visible | pass | Campos y botones con `focus:ring-2 ring-tertiary`; el enlace lateral activo conserva el contorno por defecto. |
| 2.4.11 Foco no oculto | inconclusive | La cabecera es `sticky top-0 h-16` y la página mide unos 5598 px sin `scroll-padding`; no se sabe si el foco queda bajo la cabecera. |
| 2.5.3 Etiqueta en el nombre | pass | El texto visible está contenido en el nombre; el prefijo de ligadura se trata en 1.1.1. |
| 2.5.8 Tamaño de objetivo | pass | Botones `h-11` (44 px) y `h-10` (40 px); «Reintentar» (E) mide 24 px (`text-xs` de 16 px + `py-1`), justo en el mínimo. |
| 3.1.1 Idioma | pass | `lang="es"`. |
| 3.3.1 Identificación del error | pass | Cada error se identifica con texto junto al campo (B: «Este campo es obligatorio…»; C: «La identificación ya existe»; D: «…solo admite RUC»). La asociación programática se trata en 1.3.1 y 4.1.2. |
| 3.3.2 Etiquetas o instrucciones | **fail** | El asterisco «*» marca los obligatorios sin leyenda ni `required`/`aria-required`; el SCR exige `aria-required`. En E, las etiquetas no están ligadas (ver 1.3.1). |
| 3.3.3 Sugerencia ante error | inconclusive | Los textos son «de muestra» (B, D); no hay sugerencia de corrección definida para RUC duplicado o DNI. |
| 3.3.7 Entrada redundante | inconclusive | C, D y E muestran los valores conservados solo como maqueta; la persistencia real no es verificable sin ejecución. |
| 4.1.2 Nombre, rol, valor | **fail** | Ningún campo tiene `aria-invalid` ni `aria-describedby` (el SCR los exige, incluso en la variante de error); ninguno usa `required`/`aria-required`. En E el «País emisor» es un `<input type="text" disabled>` y no un selector, y los campos no tienen nombre accesible. |
| 4.1.3 Mensajes de estado / `error-announcement` | **fail** | Los errores de B, C, D, la alerta «Error al guardar en el servidor», «Guardando…» (E) y el éxito de F no tienen `role="alert"`/`role="status"` ni `aria-live`. El SCR exige `role="alert"` en validation-error y duplicate-ruc, y aria-live en el aviso de error. |
| Foco al primer error al enviar (a11y del SCR) | inconclusive | Sin scripts: el formulario usa `onsubmit="event.preventDefault()"`. En B el anillo está fijado por clase, lo que no demuestra gestión de foco. |
| Diálogo de confirmación al cancelar (CMP-015 Confirmation-Dialog) | inconclusive | No está dibujado; depende de FLW-017-Q5. Foco atrapado y Escape no se evalúan. |

## Hallazgos fail

- **F1 (4.1.2 / 1.3.1)** — SCR-017-02, variantes B, C, D. Evidencia: `<input id="ruc_c" ...>` y su `<div>` de error sin `aria-describedby`, `aria-invalid` ni `role="alert"`; incumple `a11y_requirements` (`accessible-names`, `error-announcement`).
- **F2 (4.1.3)** — Evidencia: ningún estado dinámico (error, guardando, error al guardar, éxito) expone rol o región viva.
- **F3 (1.3.1 / 3.3.2 / 4.1.2)** — Evidencia: en la variante E, `<label class="text-xs ...">Razón social *</label>` sin `for` y el campo sin `id`; el «País emisor» es un campo de texto.
- **F4 (1.4.3)** — Evidencia: placeholders a 2.55:1 (`on-surface-variant/50`).
- **F5 (2.1.1)** — Evidencia: breadcrumb con `<span class="cursor-pointer">` no operable.
- **F6 (1.1.1)** — Evidencia: ligaduras de icono expuestas como texto.
- **F7 (3.3.2)** — Evidencia: asterisco sin `required`/`aria-required` ni leyenda.
- **F8 (1.4.10)** — Evidencia: lateral de 256 px fijo. Sujeto a SCR-017-Q6.

## Observaciones (no cuentan como criterio)

- «Registrar» queda `disabled` en B, C y D, como pide el SCR. Un botón deshabilitado no recibe foco y el motivo solo se ve en el error; es un riesgo de usabilidad que debe decidir producto, no un fallo WCAG determinado.
- La variante F muestra «Continuar a unidades» y «Volver», que el SCR deja abiertos (FLW-017-Q3).

## Preguntas abiertas

- SCR-017-Q6: ¿el alcance solo de escritorio exime de 1.4.10? WCAG 2.2 AA no lo exime; la decisión es humana.
- ¿Dónde recibe el foco el sistema tras guardar con éxito, tras error de validación y tras error de guardado?
- ¿Cuál es el texto real de error para B y D («texto de muestra») y qué sugerencia de corrección incluye?
- ¿Queda el foco oculto bajo la cabecera sticky al desplazarse?
- ¿Se aplican zoom 200 % y espaciado de texto sin pérdida?
- FLW-017-Q5: ¿hay confirmación al cancelar con datos?

## Resultado

`fail`. `DESIGN_READY_FOR_DEV` exige `pass` para este SCR; no se cumple. Revisión humana pendiente.
