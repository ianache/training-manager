---
id: CMP-EXT-002
type: Component
title: 'CMP-EXT-002 — Ampliación de gf-email-input: estados de validación asíncrona'
description: 'Mostrar los estados `validating`, `valid` y `duplicate` de la unicidad del correo entre vigentes (BR-PTY-08).'
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
screens: [SCR-016-02]
requirements: [US-016, UXR-016]
---

# CMP-EXT-002 — Ampliación de gf-email-input: estados de validación asíncrona

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-EXT-002`
- **Nombre y selector:** Ampliación de gf-email-input: estados de validación asíncrona · `gf-email-input`
- **Nivel atómico:** atom — ampliación de un átomo existente (CMP-ATOM-006): se agregan estados visibles sin cambiar su responsabilidad.
- **Propósito:** Mostrar los estados `validating`, `valid` y `duplicate` de la unicidad del correo entre vigentes (BR-PTY-08).
- **Fuera de alcance:** Consultar el servidor (el consumidor entrega la función de verificación) ni decidir quién tiene el correo.
- **Consumidores:** SCR-016-02 (nuevo correo laboral).
- **Ubicación:** `@gf/ui` (`ui/src/lib/atoms/email-input/`), cambio sobre el componente existente.

## Composición

- **Hijos permitidos:** Reutiliza `gf-icon` y `gf-spinner` para los estados.
- **Dirección de dependencia:** Sin cambios; la verificación llega por la entrada `emailCheckFn`.
- **Búsqueda de reutilización y decisión:** `gf-email-input` ya incluye el validador asíncrono con espera de 300 ms y tiempo máximo de 5 s, pero no muestra los estados validando, válido ni duplicado. Se amplía y no se crea otro campo. Reutiliza el tipo `FieldState` de `gf-text-input`.

## Contrato Angular

```ts
export interface GfEmailInputAdditions {
  state?: FieldState;          // 'default' | 'validating' | 'valid' | 'invalid'
  duplicateOwner?: string;     // nombre de quien ya usa el correo, si se informa
  helperText?: string;
}
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas nuevas:** `state`, `duplicateOwner`, `helperText`.
- **Textos (de FLW-016):** válido «✓ Email disponible»; duplicado «✗ Ya en uso por {persona}»; formato «Formato inválido».
- **Salidas:** sin cambios.
- **Exportación pública:** sin cambios.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una |
| `validating` | ícono de progreso y texto «Validando…» |
| `valid` | marca y texto, no solo color |
| `duplicate` | mensaje de error con el nombre de la persona cuando se informa |
| `invalid` | mensaje «Formato inválido» |
| Tokens | `TKN-color-error`, `TKN-color-error-container`, `TKN-color-tertiary`, `TKN-color-outline` |

## Accesibilidad y seguridad

- Los estados `validating` y `valid` se anuncian en una región `aria-live="polite"`; `duplicate` e `invalid` con `role="alert"`.
- `aria-invalid` y `aria-describedby` hacia el mensaje.
- Mostrar el nombre de quien ya usa el correo es coherente con BR-PTY-20 (el nombre y el correo laboral son visibles para cualquier colaborador); la edición de contactos es del Jefe de Ingeniería.

## Verificación

- Unitarias: cada estado muestra su texto; el duplicado incluye el nombre cuando se informa; la espera de 300 ms y el tiempo máximo de 5 s se mantienen.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q5:** *Resuelta* (`human:ianache`, 2026-10-02): si la verificación excede 5 s el validador devuelve «válido» y no bloquea el envío; es aceptable porque el servidor rechaza el duplicado (BR-PTY-08). Queda como requisito para el servidor y como caso de prueba de integración.

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-02 → `CMP-EXT-002`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
