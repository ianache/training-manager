---
id: CMP-EXT-001
type: Component
title: 'CMP-EXT-001 — Ampliación de gf-text-input: tipos url y tel'
description: 'Permitir `type="url"` (perfil profesional) y `type="tel"` (campo de número del teléfono) en `gf-text-input`.'
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
screens: [SCR-016-03, SCR-016-02, SCR-016-04]
requirements: [US-016, UXR-016]
---

# CMP-EXT-001 — Ampliación de gf-text-input: tipos url y tel

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-EXT-001`
- **Nombre y selector:** Ampliación de gf-text-input: tipos url y tel · `gf-text-input`
- **Nivel atómico:** atom — ampliación de un átomo existente (CMP-ATOM-005): se agregan dos tipos de entrada sin cambiar su responsabilidad.
- **Propósito:** Permitir `type="url"` (perfil profesional) y `type="tel"` (campo de número del teléfono) en `gf-text-input`.
- **Fuera de alcance:** Validar el formato de la URL o del teléfono: lo hace el consumidor con su validador.
- **Consumidores:** SCR-016-03 (URL del perfil) y CMP-ORG-001 (número).
- **Ubicación:** `@gf/ui` (`ui/src/lib/atoms/text-input/`), cambio sobre el componente existente.

## Composición

- **Hijos permitidos:** Sin cambios.
- **Dirección de dependencia:** Sin cambios.
- **Búsqueda de reutilización y decisión:** Se amplía `gf-text-input` y no se crean `gf-url-input` ni un segundo campo de teléfono: ya tiene los estados `default`, `validating`, `valid` e `invalid` (`FieldState`), `inputId`, `autocomplete` y asociación `aria`.

## Contrato Angular

```ts
// Hoy:   type: 'text' | 'email' | 'password' | 'number'
// Nuevo: type: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel'
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** se amplía `type` con `'url'` y `'tel'`; el resto no cambia.
- **Comportamiento:** `url` usa teclado y atributos adecuados (`inputmode="url"`); `tel` usa `inputmode="tel"` y `autocomplete="tel-national"` cuando se usa dentro de `gf-phone-field`.
- El componente **no valida** la URL ni el teléfono; los mensajes los entrega el consumidor.
- **Exportación pública:** sin cambios.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | dos tipos nuevos; mismas variantes visuales que el resto |
| Estados | `default`, `validating`, `valid`, `invalid` ya existentes |
| Tokens | sin cambios |

## Accesibilidad y seguridad

- Sin cambios en nombre accesible, `aria-invalid` ni `aria-describedby`.
- `url` no activa la validación nativa del navegador para no duplicar ni contradecir los mensajes propios.

## Verificación

- Unitarias: renderiza `type="url"` y `type="tel"` con los `inputmode` indicados; los tipos existentes no cambian.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- La validación de formato de la URL sigue abierta (US-016-Q1, SCR-016-Q3).

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-03, SCR-016-02, SCR-016-04 → `CMP-EXT-001`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
