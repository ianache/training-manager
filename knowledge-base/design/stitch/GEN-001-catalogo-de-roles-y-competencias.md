---
type: Generation Prompt
title: "GEN-001 — Diseño Google Stitch del catálogo de roles y competencias (UXR-001)"
description: "Prompts, pantallas generadas en Google Stitch, lineage y revisión crítica del diseño exploratorio para UXR-001."
tags: [ux-ui, stitch, generation-prompt, catalogo, h1]
status: draft
generated:
  by: "stitch-ui-generator/1.0"
  at: "2026-09-27T01:05:00-05:00"
sources:
  - id: uxr-001
    resource: /knowledge-base/design/ux-requirements/UXR-001-gestionar-catalogo-de-roles-y-competencias.md
  - id: uxr-000
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
  - id: us-001
    resource: /knowledge-base/requirement/user-stories/US-001-definir-catalogo-de-competencias.md
  - id: brc-001
    resource: /knowledge-base/business/rules/BRC-001-reglas-plataforma-gestion-formacion.md
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
---

# GEN-001 — Diseño Google Stitch del catálogo de roles y competencias

> **Estado:** diseño **exploratorio**, generado con IA. **No está aprobado**: que las pantallas se vean bien no significa que sean correctas. Las pantallas en Stitch son **referencias**; lo canónico son UXR-001 y las reglas BR-*.

## Trazabilidad

- **Cadena:** US-001 → [UXR-001](../ux-requirements/UXR-001-gestionar-catalogo-de-roles-y-competencias.md) → GEN-001 (esta generación) → SCR candidatas → CMP.
- **Transversal:** [UXR-000](../ux-requirements/UXR-000-requisitos-ux-transversales.md), con el shell de ADR-001.
- **Entradas que faltan:** el skill espera "Screens + DESIGN.md", y no existe ninguno de los dos:
  - no hay especificación de pantallas ni flujos (FLW);
  - no hay design system corporativo (UXR-Q4).
  
  Por eso las pantallas son una **propuesta del agente** derivada de UXR-001.
- **Supuestos:**
  - **Escritorio:** se generó para escritorio, porque no se sabe en qué dispositivos se usa la plataforma (UXR-Q2).
  - **Idioma:** la interfaz está solo en español (UXR-Q3).

## Proyecto en Stitch

- **Proyecto:** `projects/7424057371727816981`, "Plataforma de Gestión de Formación — UXR-001 Catálogo de roles y competencias". Visibilidad: **privado**.
- **Design system:** `assets/3b059f0ae3b445f38a63c3d0f7b02269`, "Corporate Enterprise Learning & Skills", v1.
  - **Lo creó Stitch automáticamente** en la tercera generación. No es el de COMSATEL.
  - Su texto declara "adherencia estricta a WCAG 2.2 AA" y ratios de contraste. **No está verificado.**

## Pantallas candidatas

| SCR candidata | Pantalla en Stitch | Cubre | Captura (referencia) |
|---|---|---|---|
| SCR-001 — Catálogo de roles | `screens/5b0818fa794c4c1eba472c7e38bdd7d8` | UXR-001.1, UXR-001.6 | [scr1.png](GEN-001/scr1-catalogo-de-roles.png) |
| SCR-002 — Detalle de rol (Rol-Nivel) | `screens/c2ba1406f1c14e1482f08a6e894b1a0c` | UXR-001.2, UXR-001.7; BR-CAT-03 (error), BR-CAT-02 (selector L1–L4) | [scr2.png](GEN-001/scr2-detalle-de-rol.png) |
| SCR-003 — Detalle de competencia | `screens/111812544e784d3bab7fa66e32551c6a` | UXR-001.3 a UXR-001.5, UXR-001.8 a UXR-001.10; BR-CAT-07 (aviso de impacto) | [scr3.png](GEN-001/scr3-detalle-de-competencia.png) |

## Prompts (para reproducir la generación)

Los tres usaron `deviceType: DESKTOP` y el modelo por defecto.

1. **SCR-001:** shell con la barra superior, el usuario "Jefe de Ingeniería" y la opción "Cerrar sesión"; navegación lateral solo con "Catálogo de competencias" > Roles y Competencias; tabla de roles con los 7 roles iniciales (BR-CAT-12); Developer con 4 niveles y 3 competencias; el resto "Sin definir"; y el estado vacío.
2. **SCR-002:** detalle del rol Developer, con pestañas de Nivel 1 a 4 (activa: Nivel 2), las competencias con su nivel esperado L1–L4, "Trabajo en equipo" como transversal y con el error "sin nivel", y el botón "Guardar" deshabilitado. Se pidió de forma explícita no agregar navegación, sellos, versiones ni afirmaciones de cumplimiento.
3. **SCR-003:** detalle de la competencia "Creación de pruebas unitarias", con el aviso de impacto en todos los roles, "Usada en", la rúbrica L1–L4 con descriptores de ejemplo, los requisitos de evidencia del nivel L2 (todos obligatorios) y el formulario de alta con solo tres categorías.

El texto completo de cada prompt quedó en el historial de la sesión y en Stitch, en el campo `prompt` de cada pantalla.

## Revisión crítica

Revisé cada pantalla contra UXR-001, UXR-000, las reglas BR-* y el glosario. **Hallazgos:**

| ID | Pantalla | Hallazgo | Severidad | Origen | Acción |
|---|---|---|---|---|---|
| F-01 | SCR-001 | Navegación inventada: "Panel de control", "Planes de carrera", "Configuración", "Enterprise Workforce Hub" | Media | Stitch | Corregido en SCR-002 y SCR-003; falta regenerar SCR-001 |
| F-02 | SCR-001 | Afirmación **"Cumplimiento WCAG 2.2 AA"** y "Versión 2.8.4 Enterprise": no hay evidencia | Alta | Stitch | Quitar; la conformidad solo puede venir de una revisión de accesibilidad |
| F-03 | SCR-001 | "7 activos": el estado "activo" de un rol no está definido | Media | Stitch | Quitar |
| F-04 | SCR-001 | El botón "Nuevo rol" aparece dos veces, y uno dice "+ + Nuevo rol" | Baja | Stitch | Dejar un solo botón |
| F-05 | SCR-002 | Tipo de competencia "**Técnica**": ninguna fuente lo define; solo "transversal" está sustentado (BR-CAT-11) | Media | **Prompt del agente** | Pregunta GEN-001-Q1 |
| F-06 | SCR-001 a 003 | Subtítulo "Gestor de Competencias" bajo el usuario: rol no definido | Baja | Stitch | Quitar |
| F-07 | SCR-003 | Subtítulos de nivel inventados: "Nivel inicial", "Ejecución independiente", "Dominio extendido", "Liderazgo técnico". El glosario solo define Principiante, Autónomo, Avanzado y Experto / Referente | Media | Stitch | Quitar |
| F-08 | SCR-003 | Pie: "**Los cambios guardados se aplicarán de inmediato a los perfiles vinculados**". Esto decide el comportamiento ante cambios del catálogo, que está abierto (P-02) | **Alta** | Stitch | Quitar hasta resolver P-02 |
| F-09 | SCR-003 | "**Evidencias** configuradas para L2" mezcla evidencia y requisito de evidencia (BR-ACR-11; TRM-0068) | **Alta** | Stitch | Usar "Requisitos de evidencia de L2" |
| F-10 | SCR-003 | Ejemplo "Certificación JUnit o informe de cobertura" y ayuda "vía de validación institucional": sin fuente | Baja | Stitch | Sustituir por un texto neutro |
| F-11 | SCR-003 | Rúbrica y requisitos aparecen como secciones separadas de una misma vista. Es una propuesta: si la rúbrica contiene los requisitos está abierto (P-37) | Media | Prompt del agente | Pregunta P-37 |
| F-12 | Todas | Solo escritorio; no hay variantes para móvil | Media | Supuesto | Pregunta UXR-Q2 |

**Qué cumple:**
- Los 7 roles iniciales.
- Rol-Nivel 1 a 4.
- Selector L1–L4 con los nombres correctos.
- Error y botón "Guardar" deshabilitado cuando una competencia no tiene nivel (BR-CAT-03).
- Aviso de impacto de las competencias compartidas (BR-CAT-07).
- Categorías de evidencia limitadas a las tres de BR-ACR-01.
- Etiquetas con texto además de color.
- Estado vacío.

**No verificado:**
- Contraste real, orden de foco, navegación por teclado y lectores de pantalla. Hace falta pasar `accessibility-reviewer` sobre el HTML.

## Preguntas abiertas

| ID | Pregunta | Responsable | Prioridad |
|---|---|---|---|
| GEN-001-Q1 | ¿Las competencias se clasifican en tipos, además de "transversal"? Si sí, ¿cuáles? El agente usó "Técnica" sin fuente | Jefe de Ingeniería | Media |
| P-02 | ¿Qué pasa con los perfiles y los requerimientos vigentes cuando cambia el catálogo? Define el texto del pie (F-08) | Jefe de Ingeniería | Alta |
| P-36 | ¿Cómo se nombran los Rol-Nivel: Junior/Senior y números? Las pestañas dicen "Nivel 1 a 4" | Jefe de Ingeniería | Alta |
| P-37 | ¿Rúbrica y requisitos de evidencia se editan juntos? | Jefe de Ingeniería | Alta |
| UXR-Q2, UXR-Q4 | ¿Qué dispositivos se usan? ¿Hay un design system corporativo? | Responsable de producto / Jefe de Ingeniería | Alta |

## Próximos pasos propuestos (no son decisiones)

1. Corregir F-01 a F-10 regenerando o editando las pantallas en Stitch.
2. Pasar `accessibility-reviewer` sobre el HTML exportado.
3. Validar las pantallas con el Jefe de Ingeniería.
4. Con las pantallas validadas, identificar los componentes con `web-atomic-component-designer`, que era el objetivo inicial.
