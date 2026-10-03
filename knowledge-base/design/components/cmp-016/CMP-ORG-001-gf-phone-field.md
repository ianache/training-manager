---
id: CMP-ORG-001
type: Component
title: 'CMP-ORG-001 — Campo de teléfono'
description: 'Capturar un teléfono con selector de país y número, validarlo según el país y entregar el valor en formato internacional completo.'
tags:
- ux-ui
- component
- organism
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

# CMP-ORG-001 — Campo de teléfono

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-ORG-001`
- **Nombre y selector:** Campo de teléfono · `gf-phone-field`
- **Nivel atómico:** organism — decisión de `human:ianache` (SCR-016-Q2): el control de teléfono debe ser un organismo. Reúne selector de país, campo de número, reglas de validación por país, normalización y mensajes. Por la definición estricta de Atomic Design podría considerarse una molécula; se conserva como organismo por esa decisión (CMP-016-Q1).
- **Propósito:** Capturar un teléfono con selector de país y número, validarlo según el país y entregar el valor en formato internacional completo.
- **Fuera de alcance:** Decidir qué países se ofrecen (los entrega el consumidor), consultar el teléfono vigente ni cerrar o abrir vigencias.
- **Consumidores:** SCR-016-02 (Jefe) y SCR-016-04 (Colaborador).
- **Ubicación:** `@gf/ui` (`ui/src/lib/organisms/phone-field/`), exportado en `public-api.ts`. Esta carpeta `organisms/` es nueva en la librería.

## Composición

- **Hijos permitidos:** `gf-country-select` (CMP-MOL-007), `gf-text-input` con `type="tel"` (CMP-EXT-001), `gf-error-message` (CMP-ATOM-010) y texto de ayuda.
- **Dirección de dependencia:** Depende de `gf-country-select`, `gf-text-input` y `gf-error-message`. No usa servicios ni HTTP. Las reglas por país vienen de una tabla interna de la librería.
- **Búsqueda de reutilización y decisión:** Reemplaza a `gf-tel-input` (CMP-ATOM-007), que solo acepta +51 con un patrón fijo. Se compone de átomos y moléculas existentes en lugar de ampliar `gf-tel-input`, porque la regla depende del país y la captura requiere dos controles.

## Contrato Angular

```ts
export interface PhoneCountryRule {
  code: string;            // 'PE' | 'US'
  nationalDigits: number;  // PE: 9, US: 10 (propuesta confirmada por human:ianache)
}
export interface GfPhoneFieldInputs {
  label: string;
  countries: readonly CountryOption[];
  defaultCountry?: string;   // 'PE'
  required?: boolean;
  disabled?: boolean;
  state?: FieldState;        // 'default' | 'validating' | 'valid' | 'invalid'
  hint?: string;
}
/** Valor que entrega al formulario: número internacional completo, o null si está vacío o es inválido. */
export type PhoneValue = string | null; // p. ej. '+51999999999'
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- Implementa `ControlValueAccessor`: el valor del formulario es el número internacional completo (`+51999999999`) o `null` (decisión confirmada, SCR-016-Q16).
- **Entradas:** ver el contrato; `defaultCountry` es `'PE'` (decisión de `human:ianache`).
- **Salidas:** `valueChange` (`PhoneValue`), `countryChange` (código).
- **Validación:** Perú exige 9 dígitos nacionales y Estados Unidos 10 (propuesta confirmada). Expone el error `phoneInvalid` con el país y la cantidad esperada.
- **Sin separadores (decisión de `human:ianache`, CMP-016-Q3):** no se toleran espacios, guiones ni paréntesis; cualquier carácter que no sea un dígito invalida el número y no se normaliza. Mensaje propuesto: «Ingresa solo los {n} dígitos del número».
- **Valor inicial:** al recibir un número internacional de un país soportado, deduce el país por su prefijo (`+51` → Perú; `+1` → Estados Unidos). Si el prefijo no es de un país soportado, lo trata como vacío y **no altera el dato guardado** (decisión CMP-016-Q4). Las pantallas de SCR-016 no precargan el teléfono actual: el campo del nuevo teléfono parte vacío y el valor vigente se muestra aparte como texto de solo lectura.
- **Exportación pública:** `GfPhoneField`, `PhoneCountryRule`.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una; el país predeterminado es Perú |
| Normal | selector de país con bandera, nombre accesible y prefijo, más campo de número |
| Válido | estado `valid` con marca y texto, nunca solo color |
| Inválido | mensaje con la cantidad de dígitos esperada para el país elegido; cualquier carácter no numérico lo invalida; redacción exacta por definir |
| Cargando / vacío | El campo vacío es válido salvo `required`; `validating` no aplica (la validación es local) |
| Deshabilitado | ambos controles deshabilitados |
| Responsive | Escritorio (SCR-016); selector y número en una sola fila |
| Localización | etiquetas y mensajes en español |
| Tokens | `TKN-color-outline`, `TKN-color-error`, `TKN-color-error-container`, `TKN-color-tertiary`, `TKN-radius-default`, `TKN-space-md` |

## Accesibilidad y seguridad

- Contenedor con `role="group"` y nombre accesible igual a la etiqueta; el selector y el número tienen cada uno su propia etiqueta («País del teléfono», «Número de teléfono»).
- Errores con `aria-invalid` y `aria-describedby` hacia el mensaje, anunciados con `role="alert"`; el estado válido se anuncia de forma cortés.
- Orden de teclado: selector de país, luego número; sin atajos propios.
- Teléfono es dato personal: no se escribe en registros ni en el DOM fuera de los controles.

## Verificación

- Unitarias: Perú acepta 9 dígitos y rechaza 8 y 10; Estados Unidos acepta 10; cambiar de país revalida; emite el número internacional completo o `null`; deduce el país de un valor inicial; un número con espacios, guiones o paréntesis es inválido; un valor inicial de un país no soportado se trata como vacío sin modificar el dato.
- Integración con formularios reactivos: `required`, `disabled`, `touched`, `markAsDirty`.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo (nuevo componente) con deprecación de `gf-tel-input`
- **Impacto semver:** menor para agregar; mayor cuando se elimine `gf-tel-input`
- **Migración o deprecación:** `gf-tel-input` (CMP-ATOM-007) queda deprecado desde que exista `gf-phone-field`. Las páginas de US-016 que lo usan migran a este organismo; se elimina en la siguiente versión mayor.

## Preguntas abiertas

- **CMP-016-Q1:** *Resuelta* (`human:ianache`, 2026-10-02): se confirma como organismo; por la definición estricta de Atomic Design sería molécula.
- **CMP-016-Q3:** *Resuelta* (`human:ianache`, 2026-10-02): **no** se toleran separadores; solo dígitos.
- **CMP-016-Q4:** *Resuelta* (decisión delegada por `human:ianache` y tomada por el agente, 2026-10-02): un teléfono guardado de un país no soportado se muestra tal como está (número internacional, sin bandera) como valor vigente de solo lectura y no se modifica. Para reemplazarlo, la persona ingresa un número de un país soportado; cargar uno de otro país exige antes agregar ese país a la lista. Es reversible y no requiere migrar datos. Seguimiento: confirmar con los datos reales qué prefijos existen hoy.
- Redacción exacta de los mensajes (pendiente de redacción UX).

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-02, SCR-016-04 → `CMP-ORG-001`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
