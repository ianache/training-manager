---
id: CHK-UNIDADES-001
type: Checklist
title: CHK-UNIDADES-001 — Lista de comprobación en navegador de las pantallas de unidades organizacionales (Stitch)
description: Pruebas manuales de teclado, foco, zoom y espaciado que el análisis estático de ARP-UNIDADES-V2 no pudo hacer. Una persona las ejecuta sobre las hojas de Stitch y anota el resultado; sin ellas ninguna pantalla puede pasar a `pass`.
tags:
- ux-ui
- accessibility
- checklist
- estructura-organizacional
status: draft
generated:
  by: accessibility-reviewer/1.1
  at: '2026-10-04T10:00:00-05:00'
sources:
- id: arp-v2
  resource: /knowledge-base/design/handoff/ARP-UNIDADES-REGENERACION-v2.md
- id: dtm
  resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
- id: uxs-001
  resource: /knowledge-base/design/specs/UXS-001-gestion-de-unidades-organizacionales.md
---

# CHK-UNIDADES-001 — Revisión en navegador

**Para qué sirve.** ARP-UNIDADES-V2 es un análisis estático del HTML: contó atributos y calculó contraste. No pudo comprobar el comportamiento. Esta lista cubre lo que falta. **Quien la ejecuta marca el resultado; el agente no puede ejecutarla** (no tiene navegador). Un `pass` solo lo asigna una persona tras recorrerla.

**Cómo abrir una hoja.** En Stitch, proyecto «Plataforma PPM» (`projects/13050549605434273903`), abre la pantalla por su ID (`screens/<id>`) y usa «Vista previa» o exporta el HTML. Usa un navegador de escritorio, 1440 px, sin extensiones.

## 1. Pruebas comunes a todas las pantallas

| # | Criterio WCAG 2.2 AA | Cómo probarlo | Esperado |
|---|---|---|---|
| C1 | 2.1.1 Teclado | Con Tab y Mayús+Tab recorre toda la pantalla sin ratón | Todo control es alcanzable y operable (Enter/Espacio); nada queda atrapado fuera de un diálogo |
| C2 | 2.4.3 Orden del foco | Observa el orden al tabular | Cabecera, menú lateral, migas, contenido; coincide con el orden visual |
| C3 | 2.4.7 y 2.4.11 Foco visible y no oculto | Tabula por cada control | Anillo de 2 px azul `#0059ba` con desplazamiento de 2 px, visible y no tapado por la cabecera |
| C4 | 1.4.4 Cambiar tamaño | Zoom del navegador al 200 % | Sin pérdida de contenido ni de función |
| C5 | 1.4.10 Reflow | Ventana de 320 px de ancho (o zoom 400 %) | Sin desplazamiento horizontal en dos dimensiones. **Nota:** el alcance «solo escritorio» (SCR-017-Q6) no exime a WCAG 2.2 AA; si producto lo acepta, es decisión humana |
| C6 | 1.4.12 Espaciado de texto | Aplica interlineado 1.5, párrafo 2×, letras 0.12×, palabras 0.16× (marcador o extensión «Text Spacing») | Sin recortes ni solapes |
| C7 | 2.5.8 Tamaño del objetivo | Mide botones y enlaces (inspector) | Al menos 24×24 px, o con separación suficiente |
| C8 | 4.1.3 Mensajes de estado | Con un lector de pantalla (NVDA o VoiceOver) provoca el estado | El error, la carga o el éxito se anuncian sin mover el foco |
| C9 | 1.3.1 y 4.1.2 | Lector de pantalla: recorre los campos | Cada campo anuncia su etiqueta, su obligatoriedad y su error |

## 2. Pruebas específicas por pantalla

Marca cada fila con ✔ (cumple), ✘ (no cumple, con nota) o — (no aplica).

| SCR | Hoja de Stitch (resource name) | Prueba específica | Resultado |
|---|---|---|---|
| SCR-017-01 | `ead458becb59418fb0cf15f0c601beb5` | El enlace «Continuar a unidades» se alcanza y se activa con teclado; «Cargando» y el error se anuncian | |
| SCR-017-02 | `4368eace9ac44ba6b630ad0391cf2bc4` (consolidada) | Foco al primer error al enviar con campos vacíos; el error de RUC duplicado se anuncia; el botón «Registrar» no se activa dos veces | |
| SCR-017-03 | `08a98db688474629b3ef7a32c9d751ca` | El mensaje de acceso no autorizado recibe el foco o se anuncia al cargar | |
| SCR-028-01 | `3000469d418c4941b1d98dca2c1b4b27` (consolidada) | Ordenar por columna con teclado y que se anuncie `aria-sort`; el árbol: flechas expanden y contraen, Enter activa; los filtros se conservan al alternar lista y jerarquía | |
| SCR-029-01 | `f60d9b006fc643d0b0120e95ef04e9a6` (v6, consolidada) | El combobox «Unidad padre» con teclado (flechas, Enter, Escape) y solo ofrece unidades Activas; foco al primer error **Correo laboral \*:** el lector de pantalla anuncia su etiqueta y que es obligatorio; con «nombre@» anuncia «Ingrese un correo válido» sin mover el foco (BR-PTY-27). | |
| SCR-029-02 | `234079448a8b438cb5ecb9e601093c39` (consolidada) | «Guardar» deshabilitado sin cambios; el error de nombre repetido se anuncia | |
| SCR-029-03 | `c53d12f7720c49e4a73c193b62b517a5` (consolidada) | **Diálogo de resumen:** el foco entra, queda atrapado, Escape cierra y el foco vuelve al botón que lo abrió; el fondo no es alcanzable | |
| SCR-029-04 | `54b227ae20d649e698b804011e3e00af` (consolidada) | La tabla se lee con `caption` y encabezados; la paginación «Anterior»/«Siguiente» es operable; el estado de carga se anuncia | |
| SCR-030-01 | `11e52a5f6d6d401eb239180750c1df9d` | **Diálogo:** foco inicial en «Cancelar», foco atrapado, Escape cancela y el foco vuelve a la fila; tras confirmar, el foco va a la fila y se anuncia «Inactiva» | |
| SCR-030-02 | `fc1cfa0bf4d9442d926d1ab37aff49d1` | **Diálogo** de bloqueo: se anuncian los conteos; «Cerrar» devuelve el foco | |
| SCR-030-03 | `727b36fe16884700ac3329309f09c644` | **Diálogo** con la fecha: error «Indica la fecha desde» ligado al campo; foco atrapado y devuelto | |
| SCR-030-04 | `836b9b73b01e4191afab8798ba562000` | **Diálogo:** el enlace al padre se alcanza y funciona; foco atrapado y devuelto | |

## 3. Cómo registrar el resultado

1. Anota por pantalla qué criterios fallaron, con una frase y, si puedes, una captura.
2. Un criterio sin fallo y sin duda se marca ✔. Lo que no puedas probar (por ejemplo, sin lector de pantalla) queda `inconclusive`, nunca ✔.
3. Pásale las notas al agente con `accessibility-reviewer` para que actualice ARP-UNIDADES-V2 con `result: pass`, `fail` o `inconclusive` por SCR. **El agente no asigna `pass` sin tus notas.**
4. Los fallos que exijan cambios de diseño se corrigen regenerando la hoja en Stitch (de a una, y consultando `list_screens` tras un timeout).

## 4. Fuera de esta lista

- La verificación de contraste de color ya está hecha (ARP-UNIDADES-V2): texto 4.5:1, componentes 3:1.
- Que el texto de los mensajes sea el definitivo (están marcados como muestra en los SCR) es revisión de contenido, no de accesibilidad.
- El HTML de Stitch es exploración: el comportamiento real (foco atrapado, anuncios) lo define la implementación en `@gf/ui`; esta lista valida que el diseño no lo impida y detecta lo que habrá que exigir al implementarlo.
