---
id: GEN-001-G
type: Stitch Generation
title: "GEN-001-G — Diseño Stitch: Gestionar el catálogo de roles y competencias (gobernado por STP-PPM-001)"
description: "Prompts, pantallas generadas en el proyecto Stitch gobernado y revisión crítica de SCR-001-01 a SCR-001-04. Exploración, no diseño gobernado."
tags: [ux-ui, stitch, generation, catalogo, roles, competencias]
status: draft
generated:
  by: "stitch-ui-generator/2.0"
  at: "2026-10-04T01:00:00-05:00"
sources:
  - id: scr-001
    resource: /knowledge-base/design/screens/SCR-001-gestionar-catalogo-de-roles-y-competencias.md
  - id: flw-001
    resource: /knowledge-base/design/user-flows/FLW-001-gestionar-catalogo-de-roles-y-competencias.md
  - id: dtm
    resource: /knowledge-base/design/traceability/DTM-PPM-001-plataforma-ppm.md
  - id: stp
    resource: /knowledge-base/design/projects/STP-PPM-001-plataforma-ppm.md
  - id: tkn-set-002
    resource: /knowledge-base/design/tokens/TKN-SET-002-comsatel-styled.md
---

# GEN-001-G — Diseño Stitch del catálogo de roles y competencias

**Estado:** exploración (`exploration_design`), `draft`. No está aprobado ni es diseño gobernado. El id lleva el sufijo `G` porque ya existe un `GEN-001` exploratorio anterior en `design/stitch/`, fuera del proyecto gobernado.

## Ejecución

- **Fecha:** 2026-10-03/04. Proyecto verificado en vivo con `get_project` (`projects/13050549605434273903`, «Plataforma PPM»); se reutiliza `STP-PPM-001`, no se creó ninguno.
- **Preflight:** `READY` (perfil `example`, iniciativa `plataforma-gestion-formacion`).
- **Parámetros:** `deviceType = DESKTOP`; `modelId` no indicado; el prompt nombra el sistema «Comsatel Styled» (TKN-SET-002) con sus colores. No se pasó `designSystem`: la herramienta lo aplicó por el nombre y los colores del prompt (no verificado el activo exacto).
- **Incidencia:** las 7 llamadas (en paralelo) agotaron el tiempo de espera, pero Stitch las completó después; se verificaron con `list_screens`. SCR-001-02 se lanzó dos veces por error (ver duplicado).

## Pantallas registradas en el DTM

`version: v1-comsatel-styled`, `project_ref: STP-PPM-001`.

| SCR | `artifact_ref` | Estados incluidos |
|---|---|---|
| SCR-001-01 | `projects/13050549605434273903/screens/3f614bf8ca0e4bf394208fcd76393df2` | A a E y variante Colaborador |
| SCR-001-02 | `…/screens/70872fded1bf4c25a027044efdd9c808` | A a F |
| SCR-001-03 | `…/screens/60a3355332104dbfa3b35ab7ff6bb9f4` | A a D, carga y error |
| SCR-001-04 | `…/screens/af95e5279d8d4dd59e6d5797bd068050` | A a E |

**Duplicado huérfano:** `…/screens/40953480d59e41ac9a2cf77028cc5282` es otra generación de SCR-001-02 (por el relanzamiento). No se registró; se eligió `70872fde…` por tener más atributos de accesibilidad (23 `aria-` frente a 3). Conviene borrarlo en Stitch, lo que no se hizo.

## Prompts (reproducibles)

Prefijo común: «Desktop web page, 1440px wide, Spanish UI, enterprise training-management platform. Use the "Comsatel Styled" design system: primary red #bc0100 with white text, secondary #b72114, tertiary blue #0059ba for focus rings and links, warm surface #fff8f6, text #2b1613, input borders #956d67, Inter, 8px radius. Do NOT use the blue navy palette. App shell: top bar "Plataforma de Gestión de Formación" with user label "Jefe de Ingeniería"». Cierre común: «STRICT CONTENT RULES: show only the elements listed; … sample data are examples. Warnings use icon plus text, never color alone. WCAG 2.2 AA». Cada pantalla enumera sus estados A a F con los textos exactos de la especificación (SCR-001 §SCR-001-01 a 04). Stitch reescribe el prompt; la reproducción exacta no está garantizada.

## Revisión crítica

Verificación automática del HTML devuelto, contra la especificación:

| SCR | Textos y estados exigidos | Contenido prohibido (salario, MOF, años, bajar nivel) | `role="alert"` | Atributos `aria-` |
|---|---|---|---|---|
| SCR-001-01 | Todos presentes | Ninguno | 1 | 12 |
| SCR-001-02 | Todos presentes | Ninguno | 1 | 23 |
| SCR-001-03 | Todos presentes | Ninguno | 0 | **0** |
| SCR-001-04 | Todos presentes | Ninguno | 5 | 10 |

**Hallazgos (no aceptados como resueltos):**

1. **SCR-001-03 no trae ningún atributo `aria-`** (pestañas, insignias de estado, advertencia de versión anterior): hay que añadirlos antes de dar la pantalla por accesible. El diseño no demuestra el cumplimiento WCAG 2.2 AA; la revisión de accesibilidad (`accessibility-reviewer`) está pendiente.
2. **Los textos «propuesto» de la especificación (SCR-001-Q1) aparecen tal cual** en el diseño sin fuente humana; no son aprobados.
3. **Las brechas de componentes** (pestañas, tabla, estado vacío, insignias) las resolvió Stitch con su propio marcado; no corresponden a componentes `@gf/ui`.
4. **Solo se verificó el texto del HTML**: no se revisaron las capturas, el contraste real ni los estados visualmente.
5. El diseño usa «Comsatel Styled» según el prompt; no se comprobó contra los tokens `TKN-SET-002` valor por valor.

## Preguntas abiertas

Heredadas de SCR-001 (SCR-001-Q1 a Q4, FLW-001-Q1 y Q3). Revisión humana pendiente.
