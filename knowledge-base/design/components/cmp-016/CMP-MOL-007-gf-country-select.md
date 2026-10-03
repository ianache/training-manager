---
id: CMP-MOL-007
type: Component
title: 'CMP-MOL-007 — Selector de país con bandera'
description: 'Elegir un país mostrando bandera, nombre y prefijo telefónico.'
tags:
- ux-ui
- component
- molecule
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

# CMP-MOL-007 — Selector de país con bandera

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-MOL-007`
- **Nombre y selector:** Selector de país con bandera · `gf-country-select`
- **Nivel atómico:** molecule — compone `gf-flag` y texto en una sola interacción: elegir un país.
- **Propósito:** Elegir un país mostrando bandera, nombre y prefijo telefónico.
- **Fuera de alcance:** Validar el número de teléfono, decidir la lista de países ni guardar datos.
- **Consumidores:** CMP-ORG-001 gf-phone-field.
- **Ubicación:** `@gf/ui` (`ui/src/lib/molecules/country-select/`), exportado en `public-api.ts`.

## Composición

- **Hijos permitidos:** `gf-flag`; texto del país y del prefijo.
- **Dirección de dependencia:** Depende de `gf-flag`. No conoce servicios ni reglas de negocio.
- **Búsqueda de reutilización y decisión:** `gf-select` es un `<select>` nativo y no puede mostrar imágenes en sus opciones; `gf-autocomplete` es un combobox con búsqueda asíncrona y excede la necesidad de una lista corta. Se crea un selector de lista simple con el patrón *select-only combobox* de WAI-ARIA APG, sin `@angular/cdk`.

## Contrato Angular

```ts
export interface CountryOption {
  code: string;      // ISO 3166-1 alfa-2, p. ej. 'PE'
  name: string;      // 'Perú'
  dialCode: string;  // '+51'
}
export interface GfCountrySelectInputs {
  countries: readonly CountryOption[];
  value: string;          // código de país seleccionado
  disabled?: boolean;
  invalid?: boolean;
  inputId?: string;
  ariaLabel?: string;     // p. ej. 'País del teléfono'
  ariaDescribedBy?: string;
}
export type CountrySelectOutputs = { valueChange: string };
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** ver el contrato. La lista de países la entrega el consumidor; el predeterminado lo decide el consumidor (Perú en SCR-016).
- **Salidas:** `valueChange` con el código elegido.
- **Proyección de contenido:** ninguna.
- **Efectos secundarios:** abre y cierra la lista; cierra al perder el foco o con Escape.
- **Exportación pública:** `GfCountrySelect`, tipo `CountryOption`.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una (botón + lista desplegable) |
| Cerrado | muestra la bandera (imagen vectorial) y el prefijo del país elegido, por ejemplo bandera de Perú y «+51»; el nombre completo va en el nombre accesible |
| Abierto | lista con cada opción: bandera, nombre del país y prefijo |
| Cargando / vacío / error | No aplica a la lista (es estática). `invalid` marca el borde con `TKN-color-error` |
| Deshabilitado | No abre; opacidad reducida |
| Responsive | Escritorio (SCR-016); la lista se ancla bajo el botón |
| Localización | nombres de país en español |
| Tokens | `TKN-color-outline`, `TKN-color-surface`, `TKN-color-on-surface`, `TKN-color-tertiary` (foco), `TKN-radius-default` |

## Accesibilidad y seguridad

- Patrón *select-only combobox* (WAI-ARIA APG): botón con `role="combobox"`, `aria-expanded`, `aria-controls` hacia una lista con `role="listbox"` y opciones con `role="option"` y `aria-selected`.
- Nombre accesible: «{etiqueta}: {país} {prefijo}», por ejemplo «País del teléfono: Perú +51»; la bandera es `aria-hidden`.
- Teclado: Enter, Espacio y Flecha abajo abren; Flechas mueven; Inicio y Fin saltan a los extremos; Enter o Espacio seleccionan; Escape cierra y devuelve el foco al botón; escribir la inicial salta a la opción (typeahead).
- Foco visible con `TKN-color-tertiary` (WCAG 2.4.7); la opción activa se distingue por más que el color (WCAG 1.4.1).

## Verificación

- Unitarias: selecciona por clic y por teclado; emite `valueChange`; cierra con Escape; respeta `disabled`.
- Interacción: typeahead y navegación por Inicio y Fin; el foco vuelve al botón al cerrar.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q13:** *Resuelta* (`human:ianache`, 2026-10-02): basta posicionar la lista con CSS bajo el botón, sin `@angular/cdk` ni lógica de superposición. Caso de prueba visual: que no quede cortada por el contenedor de la página.

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-02, SCR-016-04 → `CMP-MOL-007`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
