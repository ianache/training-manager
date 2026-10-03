---
id: CMP-ATOM-013
type: Component
title: 'CMP-ATOM-013 — Bandera de país'
description: 'Dibujar la bandera de un país como imagen vectorial decorativa.'
tags:
- ux-ui
- component
- atom
- us-016
status: draft
readiness: REQUIRES_REVIEW
generated:
  by: web-atomic-component-designer/1.0
  at: '2026-10-02T23:30:00-05:00'
sources:
- id: scr-016
  resource: /knowledge-base/design/screens/SCR-016-actualizar-datos-y-contactos.md
- id: flw-016
  resource: /knowledge-base/design/user-flows/FLW-016-actualizar-datos-y-contactos.md
- id: tkn-set-002
  resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
- id: catalog-015
  resource: /knowledge-base/design/components/dtc-015/atomic-component-catalog.md
flow: FLW-016
screens: [SCR-016-02, SCR-016-04]
requirements: [US-016, UXR-016]
---

# CMP-ATOM-013 — Bandera de país

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-ATOM-013`
- **Nombre y selector:** Bandera de país · `gf-flag`
- **Nivel atómico:** atom — primitiva visual indivisible, sin flujo propio.
- **Propósito:** Dibujar la bandera de un país como imagen vectorial decorativa.
- **Fuera de alcance:** Nombrar el país, elegir país o decidir la lista de países.
- **Consumidores:** CMP-MOL-007 gf-country-select y cualquier vista que muestre un país.
- **Ubicación:** `@gf/ui` (`ui/src/lib/atoms/flag/`), exportado en `public-api.ts`.

## Composición

- **Hijos permitidos:** Ninguno (imagen vectorial en línea).
- **Dirección de dependencia:** No depende de otros componentes ni de servicios.
- **Búsqueda de reutilización y decisión:** No existe un componente de banderas; `gf-icon` dibuja íconos de interfaz y no banderas. Se crea un átomo propio en lugar de usar emoji: los emoji de bandera no se dibujan en Windows (se ven las letras del país).

## Contrato Angular

```ts
export type FlagSize = 'sm' | 'md';
export interface GfFlagInputs {
  /** Código de país ISO 3166-1 alfa-2, p. ej. 'PE' o 'US'. */
  country: string;
  size?: FlagSize; // por defecto 'md'
}
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** `country` (obligatoria), `size` (`'md'` por defecto).
- **Salidas:** ninguna.
- **Proyección de contenido:** ninguna.
- **Efectos secundarios:** ninguno. No hace peticiones de red: las imágenes van incluidas en la librería.
- **Exportación pública:** `GfFlag` desde `@gf/ui`.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una por país soportado (Perú y Estados Unidos al inicio); ampliable |
| Tamaños | `sm` y `md` (medidas por tokens de espaciado; valores por definir en el diseño) |
| Cargando / éxito / vacío / error | No aplica. Con un código desconocido no dibuja nada; el texto del país sigue visible en el consumidor |
| Deshabilitado | Hereda la opacidad del contenedor; no es interactiva |
| Responsive | Escritorio (SCR-016); escala con el tamaño de fuente |
| Localización | Sin texto propio |
| Tokens | Ninguno de color: la bandera conserva sus colores; borde fino con `TKN-color-outline-variant` |

## Accesibilidad y seguridad

- **Decorativa siempre:** `aria-hidden="true"`; el país se identifica por su nombre y prefijo en texto en el consumidor (decisión de `human:ianache`, SCR-016-Q16).
- No transmite información por sí sola (WCAG 1.4.1) ni recibe foco.
- Seguridad: SVG incluido por la librería (copiados y revisados), sin cargar SVG desde una URL externa ni `innerHTML` con datos del usuario.

## Origen de los SVG (decisión de `human:ianache`, SCR-016-Q2)

- **Fuente:** el proyecto `flag-icons` (MIT). Se copian únicamente los archivos de Perú (`pe`) y Estados Unidos (`us`); no se agrega el paquete como dependencia.
- **Aviso de licencia:** al copiar los archivos se conserva el aviso MIT del proyecto (por ejemplo en un archivo de avisos de terceros dentro de la librería). Sin ese aviso no se debe publicar.
- **Formato:** `flag-icons` ofrece versiones 4:3 y cuadradas; cuál se usa se decide con el diseño gobernado (por defecto, 4:3). La ruta exacta de los archivos se confirma al copiarlos.
- **Revisión previa:** antes de incluirlos, revisar el contenido de cada SVG (sin scripts, sin referencias externas) y optimizarlos; coherente con el requisito de seguridad de este componente.
- **Procedencia:** el README de `flag-icons` indica que sus SVG parten de una colección de koppi, hoy eliminada, y no documenta la procedencia de cada dibujo. La procedencia del dibujo no está certificada por este equipo; si Legal la exige, la alternativa es dibujar los SVG propios.
- **Ampliación:** agregar un país implica copiar su SVG con el mismo aviso y añadirlo a la lista que entrega el consumidor.

## Verificación

- Unitarias: dibuja el SVG de `PE` y `US`; con un código desconocido no dibuja nada; siempre `aria-hidden`.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor (se agrega un componente exportado)
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q2:** *Resuelta* (`human:ianache`, 2026-10-02, opción B): las banderas se toman de **`flag-icons`** (licencia MIT) copiando **solo los SVG de Perú y Estados Unidos**. Ver «Origen de los SVG» abajo. Pendiente de confirmar al copiar: formato (4:3 o cuadrado) según el diseño gobernado.

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-02, SCR-016-04 → `CMP-ATOM-013`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
