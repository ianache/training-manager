---
id: CMP-ORG-002
type: Component
title: 'CMP-ORG-002 — Lista de perfiles profesionales'
description: 'Mostrar los perfiles profesionales vigentes de una persona y permitir eliminarlos.'
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
screens: [SCR-016-03]
requirements: [US-016, UXR-016]
---

# CMP-ORG-002 — Lista de perfiles profesionales

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-ORG-002`
- **Nombre y selector:** Lista de perfiles profesionales · `app-profile-list`
- **Nivel atómico:** organism — sección de dominio que reúne ítems de perfil, acciones y estado vacío, ligada al concepto de perfil profesional.
- **Propósito:** Mostrar los perfiles profesionales vigentes de una persona y permitir eliminarlos.
- **Fuera de alcance:** Pedir los datos, confirmar la eliminación (lo hace la página con el diálogo de CMP-015) ni agregar perfiles.
- **Consumidores:** SCR-016-03.
- **Ubicación:** Local en `mfe-collaborators` (`pages/` o `shared/`); **no** va a `@gf/ui` porque está ligado al dominio de colaboradores.

## Composición

- **Hijos permitidos:** `gf-button` (Eliminar), `gf-empty-state` (CMP-MOL-002), `gf-vigencia-badge` (opcional).
- **Dirección de dependencia:** Presentacional: recibe datos por entrada y emite eventos; no llama servicios.
- **Búsqueda de reutilización y decisión:** Ninguna lista existente cubre perfiles. Los ítems usan `gf-button` y `gf-empty-state` ya existentes.

## Contrato Angular

```ts
export type ProfilePlatform = 'LINKEDIN' | 'GITHUB' | 'OTHER';
export interface ProfileItem {
  id: string;
  platform: ProfilePlatform;
  platformName?: string; // obligatorio si platform es 'OTHER' (ej. «Training Portal»)
  url: string;
  validFrom: string;   // fecha ISO
}
export interface AppProfileListInputs {
  profiles: readonly ProfileItem[];
  canEdit: boolean;
}
export type AppProfileListOutputs = { remove: string }; // id del perfil
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** `profiles` (solo vigentes), `canEdit`.
- **Salidas:** `remove` con el id del perfil; la página abre la confirmación.
- **Eliminar** cierra la vigencia del perfil y no lo borra (decisión de `human:ianache`, SCR-016-Q5); el ítem desaparece de esta lista y queda en el historial.
- **Plataformas:** LinkedIn, GitHub y «Otro» (BR-PTY-09), lista ampliable. Para «Otro», la lista muestra el nombre libre que escribió la persona (decisión CMP-016-Q10).

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | una (lista vertical) |
| Con datos | por perfil: plataforma, URL como enlace y acción «Eliminar» |
| Vacío | estado vacío con texto propuesto «Aún no has agregado perfiles profesionales» |
| Cargando / error | los resuelve la página con `gf-view-state` |
| Deshabilitado | con `canEdit` en falso no muestra «Eliminar» |
| Responsive | Escritorio (SCR-016) |
| Tokens | `TKN-color-on-surface`, `TKN-color-outline-variant`, `TKN-color-primary` (enlace), `TKN-space-md` |

## Accesibilidad y seguridad

- Lista semántica (`ul` y `li`); cada enlace con nombre accesible «{plataforma}: {url}» e indicación de que se abre en una pestaña nueva.
- Botón «Eliminar» con nombre «Eliminar perfil {plataforma}»; tras eliminar, el foco pasa al siguiente ítem o al encabezado de la lista.
- Seguridad: la URL la escribe el usuario; solo se aceptan los esquemas `http` y `https` al renderizar el enlace (nunca `javascript:`), con `rel="noopener noreferrer"`; el texto se escapa.

## Verificación

- Unitarias: lista vacía muestra el estado vacío; `remove` emite el id; sin `canEdit` no hay botón; una URL con esquema no permitido no se renderiza como enlace.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo (local, no afecta a `@gf/ui`)
- **Impacto semver:** no aplica (no es parte de la librería)
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q10:** *Resuelta* (`human:ianache`, 2026-10-02, opción a): «Otro» pide un nombre de plataforma de texto libre; «Training Portal» es un ejemplo.
- **CMP-016-Q14:** Longitud máxima y validación del nombre libre de «Otro». El modelo de datos solo guarda un código de plataforma de una lista (`fk_profile_platform_code`) y la URL, no un nombre libre: requiere un cambio en el servicio de Party.
- Formato de validación de URL abierto (US-016-Q1, SCR-016-Q3); este componente no valida la URL.

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-03 → `CMP-ORG-002`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
