---
id: CMP-MOL-008
type: Component
title: 'CMP-MOL-008 — Etiqueta de vigencia'
description: 'Mostrar «Vigente desde {fecha}» o la fecha de cierre de una vigencia (BR-PTY-12).'
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
screens: [SCR-016-02, SCR-016-04, SCR-016-03, SCR-016-06]
requirements: [US-016, UXR-016]
---

# CMP-MOL-008 — Etiqueta de vigencia

Propuesta de diseño (no implementada). Estado `REQUIRES_REVIEW`: faltan decisiones humanas (ver preguntas abiertas), el informe de `accessibility-reviewer` y el diseño gobernado de las pantallas.

## Identidad

- **ID:** `CMP-MOL-008`
- **Nombre y selector:** Etiqueta de vigencia · `gf-vigencia-badge`
- **Nivel atómico:** molecule — compone `gf-badge` y una fecha formateada para comunicar un solo hecho: si un dato está vigente.
- **Propósito:** Mostrar «Vigente desde {fecha}» o la fecha de cierre de una vigencia (BR-PTY-12).
- **Fuera de alcance:** Calcular vigencias ni cerrar o abrir vigencias.
- **Consumidores:** SCR-016-02, SCR-016-04, CMP-ORG-002 y CMP-ORG-003.
- **Ubicación:** `@gf/ui` (`ui/src/lib/molecules/vigencia-badge/`), exportado en `public-api.ts`.

## Composición

- **Hijos permitidos:** `gf-badge` (CMP-ATOM-002), que ya incluye un ícono y el texto.
- **Dirección de dependencia:** Depende de `gf-badge` y `gf-icon`.
- **Búsqueda de reutilización y decisión:** `gf-badge` solo dibuja una etiqueta; la combinación con ícono y fecha aparece en cuatro pantallas, por eso se crea esta molécula y no se repite. API real de `gf-badge`, verificada en el código: una entrada `tone` (`success`, `warning`, `danger`, `neutral`, `info`) con un ícono propio por tono y el texto como contenido proyectado; no tiene otras entradas.

## Contrato Angular

```ts
export interface GfVigenciaBadgeInputs {
  from: string;          // fecha ISO de inicio de la vigencia
  thru?: string | null;  // fecha ISO de cierre; null o ausente = vigente
}
```

- **Estrategia:** componente standalone, `ChangeDetectionStrategy.OnPush`, entradas y salidas con signals.
- **Entradas:** `from` y `thru` (fechas ISO). La vigencia se deduce: sin `thru` está vigente; con `thru` está cerrada.
- **Salidas:** ninguna.
- **Proyección de contenido:** ninguna.
- **Exportación pública:** `GfVigenciaBadge`.

## Contrato visual y de comportamiento

| Dimensión | Especificación |
|---|---|
| Variantes | vigente («Vigente desde {fecha}», tono `success`) y cerrada («Cerrada el {fecha}», tono `neutral`; texto propuesto) |
| Estados | solo lectura; no hay cargando, vacío ni error |
| Responsive | Escritorio; una línea |
| Localización | fecha en español, dd/mm/aaaa (decisión CMP-016-Q6) |
| Tokens | los de `gf-badge`: tonos `success` y `neutral`. Esos dos tonos no existen en «Comsatel Styled» y conservan los valores previos de `tokens.css`; el estado se distingue por ícono y texto, no solo por color |

## Accesibilidad y seguridad

- Texto completo visible; el ícono es decorativo (`aria-hidden`).
- No se usa solo el color para diferenciar vigente de cerrada (WCAG 1.4.1).
- Contraste calculado de pares de `TKN-SET-002`; falta la revisión de `accessibility-reviewer`.

## Verificación

- Unitarias: sin `thru` muestra «Vigente desde»; con `thru` muestra la fecha de cierre; fechas inválidas no rompen la vista.
- Accesibilidad: ejecutar axe-core sobre cada estado y registrar el resultado real; la revisión de WCAG 2.2 AA queda para `accessibility-reviewer` (no se afirma cumplimiento aquí).
- Regresión visual: sin línea base hasta que exista el diseño gobernado de las pantallas de SCR-016.

## Cambio y ciclo de vida

- **Clasificación del cambio:** aditivo
- **Impacto semver:** menor
- **Migración o deprecación:** No aplica.

## Preguntas abiertas

- **CMP-016-Q6:** *Resuelta* (`human:ianache`, 2026-10-02): se usa el formato más usado en Perú, fecha dd/mm/aaaa. Ver la hora y la zona en CMP-ORG-003.
- **CMP-016-Q11:** *Resuelta* (`human:ianache`, 2026-10-02): el cambio aplica de inmediato; no existe una vigencia «pendiente», así que el componente solo tiene los estados vigente y cerrada.
- **CMP-016-Q12:** *Resuelta* (`human:ianache`, 2026-10-02, «ok»): se revisó el código de `gf-badge` y la especificación se ajustó a su API real (`tone`, sin `gf-icon`).

## Trazabilidad

- US-016 (AC-1 a AC-5) → UXR-016 → FLW-016 → SCR-016-02, SCR-016-04, SCR-016-03, SCR-016-06 → `CMP-MOL-008`.
- Resuelve: SCR-016-Q12 (todo componente con su CMP).
- Ver el índice [CMP-016](../CMP-016-componentes-actualizar-datos-y-contactos.md).
