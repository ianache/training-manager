---
type: Generation Prompt
title: "GEN-002 — Diseño Google Stitch del shell y los estados transversales (UXR-000)"
description: "Prompts, pantallas generadas en Google Stitch, lineage y revisión crítica del diseño exploratorio del shell y de los estados comunes de la interfaz."
tags: [ux-ui, stitch, generation-prompt, shell, estados, transversal, h1]
status: draft
generated:
  by: "stitch-ui-generator/1.0"
  at: "2026-09-27T01:25:00-05:00"
sources:
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
  - id: uxr-004
    resource: /knowledge-base/design/ux-requirements/UXR-004-consultar-mi-perfil-de-competencias.md
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: adr-002
    resource: /knowledge-base/architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md
  - id: gen-001
    resource: /knowledge-base/design/stitch/GEN-001-catalogo-de-roles-y-competencias.md
---

# GEN-002 — Diseño Google Stitch del shell y los estados transversales

> **Estado:** diseño **exploratorio**, generado con IA. **No está aprobado**. Las pantallas en Stitch son **referencias**; lo canónico es [UXR-000](../ux-requirements/UXR-000-requisitos-ux-transversales.md).

## Trazabilidad

- **Cadena:** [UXR-000](../ux-requirements/UXR-000-requisitos-ux-transversales.md) → GEN-002 → SCR candidatas → CMP.
- **Otras fuentes:**
  - [ADR-001](../../architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md): el shell se encarga de la navegación global y del layout.
  - [ADR-002](../../architecture/adrs/ADR-002-autenticacion-keycloak-pkce-en-bff.md): la autenticación la hace el BFF con Keycloak.
- **Contenido de ejemplo del shell:** el estado vacío de [UXR-004](../ux-requirements/UXR-004-consultar-mi-perfil-de-competencias.md) (AC-3).
- **Decisión del agente, derivada de ADR-002:** **no se diseñó una pantalla de inicio de sesión**. Con PKCE en el BFF, el formulario lo muestra Keycloak. La plataforma solo muestra el estado "Sesión vencida" con el botón "Iniciar sesión", que redirige al proveedor.
- **Entradas que faltan:**
  - No hay especificación de pantallas ni design system corporativo (UXR-Q4).
  - Se reutilizó el design system que **Stitch generó** en GEN-001 (`assets/3b059f0ae3b445f38a63c3d0f7b02269`), para mantener la coherencia. No es corporativo.
- **Supuestos:** solo escritorio (UXR-Q2) y solo español (UXR-Q3).

## Proyecto en Stitch

- **Proyecto:** `projects/12720539715446738569`, "Plataforma de Gestión de Formación — UXR-000 Shell y estados transversales". Visibilidad: **privado**.

## Pantallas candidatas

| SCR candidata | Pantalla en Stitch | Cubre | Captura (referencia) |
|---|---|---|---|
| SCR-000 — Shell (vista del colaborador) | `screens/ad729d16a77042559700640d2fdd035d` | UXR-000.1, UXR-000.2, UXR-000.3, UXR-000.5; UXR-004 (estado vacío) | [s0-shell.png](GEN-002/s0-shell.png) |
| SCR-000-E — Estados comunes | `screens/1845f6156c2d4bf9b67668a96531acd2` | UXR-000.4 y la tabla de estados obligatorios | [s0-estados.png](GEN-002/s0-estados.png) |

## Prompts (para reproducir la generación)

Los dos usaron `deviceType: DESKTOP` y `designSystem: assets/3b059f0ae3b445f38a63c3d0f7b02269`. A partir de los hallazgos de GEN-001, se prohibió de forma explícita agregar notificaciones, ayuda, sellos, versiones, afirmaciones de cumplimiento y navegación no pedida.

1. **SCR-000:** shell para el rol "Colaborador". Barra superior con el nombre de la plataforma, el usuario de ejemplo "Ana Colaboradora" y "Cerrar sesión". Una sola sección de navegación, "Mi desarrollo", con "Mi perfil de competencias" (activa) y "Mi brecha frente a un Rol-Nivel". Enlace "Saltar al contenido". Estado vacío del perfil y la nota "Solo tú ves estos datos".
2. **SCR-000-E:** tablero con cinco tarjetas: Carga, Vacío, Error, Sin permiso y Sesión vencida, cada una con icono, texto y a lo sumo un botón. Nota al pie sobre el proveedor de identidad.

El texto completo de cada prompt está en el campo `prompt` de cada pantalla en Stitch.

## Revisión crítica

La revisé contra UXR-000, ADR-001 y ADR-002, y contra el HTML exportado del shell.

**Qué cumple:**
- **Shell:**
  - Solo la navegación pedida y ningún elemento inventado.
  - El enlace "Saltar al contenido" existe en el HTML y apunta a `#main-content`.
  - El contenido está dentro de un `<main>`, y el documento declara `lang="es"`.
  - La nota de privacidad aparece.
- **Estados:** los cinco muestran icono más texto. El estado "Sin permiso" no expone datos, y el de sesión vencida tiene un único botón, "Iniciar sesión".

**Hallazgos:**

| ID | Pantalla | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| F-01 | SCR-000 | Tipografía **IBM Plex Sans**, mientras que el design system y GEN-001 usan **Inter**. La interfaz queda inconsistente entre pantallas | Media | Stitch | Unificar al regenerar |
| F-02 | SCR-000 | "Mi brecha frente a un Rol-Nivel" se corta en dos líneas y separa "Rol-" de "Nivel" | Baja | Stitch | Acortar a "Mi brecha" o ajustar el ancho |
| F-03 | SCR-000-E | El error supone la causa ("Revisa tu conexión"), y la insignia dice "Fallo de conexión". No todos los errores son de red | Media | Prompt del agente | Usar un mensaje genérico y detallar la causa solo si se conoce |
| F-04 | SCR-000-E | "Redirección única hacia el mecanismo de autenticación **corporativo**": no se sabe si Keycloak será una instancia corporativa existente (ADR-002, "No se decidió todavía") | Baja | Stitch | Decir "proveedor de identidad" |
| F-05 | SCR-000-E | El estado vacío incluye "Crear el primero". Solo aplica si el rol puede crear; en el perfil del colaborador no corresponde | Baja | Prompt del agente | Hacer la acción opcional según el permiso |
| F-06 | SCR-000 | Solo muestra el rol Colaborador. No se sabe cómo navega un usuario con varios roles de acceso, por ejemplo un colaborador que también es jefe de proyecto | Media | Vacío | Pregunta GEN-002-Q1 |
| F-07 | Todas | Solo escritorio | Media | Supuesto | UXR-Q2 |

**No verificado:** el contraste real, el orden de foco completo y el comportamiento con lector de pantalla. Hace falta `accessibility-reviewer`.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| GEN-002-Q1 | Un usuario con varios roles de acceso (colaborador, jefe de proyecto, evaluador), ¿ve todas sus secciones juntas o cambia de rol? | Responsable de producto | Alta |
| P-08 | ¿Qué ve cada rol de los datos de otras personas? Define qué secciones del shell existen para cada rol | Responsable de producto | Alta |
| UXR-Q2, UXR-Q4 | ¿Qué dispositivos se usan? ¿Hay un design system corporativo? | Responsable de producto / Jefe de Ingeniería | Alta |

## Próximos pasos propuestos (no son decisiones)

1. Unificar la tipografía y corregir F-02 a F-05.
2. Pasar `accessibility-reviewer` sobre el HTML de GEN-001 y GEN-002.
3. Con GEN-001 y GEN-002 validados, seguir con los UXR-002 a UXR-006 o con la identificación de componentes (`web-atomic-component-designer`).
