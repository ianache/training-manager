---
type: UI Inventory
title: "UI-INV-001 — Inventario de pantallas y componentes reutilizables"
description: "Mapeo de SCR-001 a SCR-004 → atoms/molecules/organisms, estados, responsive variants, reuse candidates."
tags: [ux-ui, component-inventory, atomic-design]
status: draft
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-09-27T20:50:00-05:00"
sources:
  - id: gen-002
    resource: /knowledge-base/design/stitch/GEN-002-diseño-consolidado-uxr-001-a-006.md
  - id: scr-001-004
    resource: Stitch project 7424057371727816981 (SCR-001 to SCR-004 generated screens)
  - id: acp-001
    resource: /knowledge-base/architecture/ACP-001-contexto-arquitectonico-uxui.md
---

# UI-INV-001 — Inventario de pantallas y componentes

---

## 1. Pantallas mapeadas (SCR-001 a SCR-004)

| SCR | Nombre | UXR | Estatus | Actores | Componentes críticos |
|---|---|---|---|---|---|
| **SCR-001** | Catálogo de roles (lista) | UXR-001 | ✓ Generada | Jefe de Ingeniería | Table, Button, Badge, Header, Sidebar |
| **SCR-002** | Detalle de rol (editar) | UXR-001 | ✓ Generada | Jefe de Ingeniería | Tabs, Table, Select, Checkbox, Button, Alert (error), Header, Sidebar |
| **SCR-003** | Detalle de competencia | UXR-001 | ✓ Generada | Jefe de Ingeniería | Tabs, Card, List, Badge (✓ Requerida/○ Deseada), Button, Alert (warning), Header, Sidebar |
| **SCR-004** | Mis proyectos | UXR-002 | ✓ Generada | Jefe de Proyecto | Table, Button, Badge, Filter, Header, Sidebar |

---

## 2. Componentes reutilizables identificados

### A. Componentes COMPARTIDOS entre pantallas

| Componente | Atómico | Apariciones | Contextos | Reuse candidata |
|---|---|---|---|---|
| **Header + Navigation Shell** | Template | SCR-001–004 | Todas las pantallas | ✅ Template (Shell layout) |
| **Sidebar (nav lateral)** | Organism | SCR-001–004 | Todas las pantallas | ✅ Organism (navigation) |
| **Table** | Organism | SCR-001, SCR-002, SCR-004 | Listas de datos (roles, competencias, proyectos) | ✅✅✅ CRITICAL reuse candidate |
| **Button (primario/secundario)** | Atom | SCR-001–004 | Guardar, Cancelar, Declarar, Detalle | ✅✅✅ CRITICAL reuse candidate |
| **Badge** | Atom | SCR-001–004 | Estados (Definido/Sin definir, Requerida/Deseada, Activo/Pausado) | ✅✅✅ CRITICAL reuse candidate |
| **Tabs** | Molecule | SCR-002, SCR-003 | Navegación dentro de pantalla (Niveles, Requisitos) | ✅✅ High reuse candidate |
| **Select / Dropdown** | Atom | SCR-002, SCR-004 | Rol-Nivel, Estado, Nivel esperado | ✅✅ High reuse candidate |
| **Checkbox** | Atom | SCR-002, SCR-003 | Transversal, Retirar competencias, Incluir | ✅✅ High reuse candidate |
| **Text Input** | Atom | SCR-002, SCR-003 (form fields) | Búsqueda, campos de texto | ✅ Medium reuse candidate |
| **Card** | Molecule | SCR-003 | Encapsulación de secciones (Rúbrica, Requisitos) | ✅ Medium reuse candidate |
| **Alert / Banner** | Molecule | SCR-002, SCR-003 | Validaciones (error), avisos (impacto BR-CAT-07) | ✅ Medium reuse candidate |
| **Filter** | Molecule | SCR-004 | Filtro por estado, búsqueda | ✅ Medium reuse candidate |
| **Modal/Dialog** | Organism | SCR-001 (inferido: "Nuevo rol"), SCR-005 (inferido) | Formularios, confirmaciones | ✅ Medium reuse candidate (inferida) |

### B. Componentes ESPECÍFICOS por pantalla

#### SCR-001: Catálogo de roles

| Componente | Atómico | Descripción | Reuso |
|---|---|---|---|
| **RoleCatalog** | Organism | Tabla de roles + botón "Nuevo rol" + filtros (opcional) | Solo SCR-001 |
| **RoleTableRow** | Molecule | Fila de tabla: nombre, niveles, competencias, estado, acciones | Dentro de RoleCatalog |
| **EmptyState** | Molecule | "Catálogo sin roles disponibles" con icono + botón CTA | Potencial reuso en otras listas vacías |

#### SCR-002: Detalle de rol

| Componente | Atómico | Descripción | Reuso |
|---|---|---|---|
| **RoleDetailEditor** | Organism | Pestañas dinámicas + tabla de competencias + validaciones | Solo SCR-002 |
| **LevelTab** | Molecule | Encabezado + lista de competencias para ese nivel | Dentro de RoleDetailEditor |
| **CompetencyRow** | Molecule | Competencia + checkbox Transversal + Select Nivel esperado + acciones | Dentro de LevelTab |
| **ImpactBanner** (BR-CAT-07) | Molecule | "Los cambios afectan a X requerimientos" | Potencial reuso en SCR-005 |

#### SCR-003: Detalle de competencia

| Componente | Atómico | Descripción | Reuso |
|---|---|---|---|
| **CompetencyDetailEditor** | Organism | Pestañas (Rúbrica, Requisitos) + formulario | Solo SCR-003 |
| **RubricTab** | Molecule | Cards L1–L4 con descriptores editables | Dentro de CompetencyDetailEditor |
| **RequirementsTab** | Molecule | Tabla/lista de requisitos por nivel, marcados ✓ Requerida / ○ Deseada | Dentro de CompetencyDetailEditor |
| **RequirementRow** | Atom | Checkbox (tipo) + texto requisito + acciones | Dentro de RequirementsTab |
| **LevelBadge** (L1–L4) | Atom | Badge con etiqueta de nivel (Principiante, Autónomo, Avanzado, Experto) | Potencial reuso en SCR-002, SCR-005 |

#### SCR-004: Mis proyectos

| Componente | Atómico | Descripción | Reuso |
|---|---|---|---|
| **ProjectList** | Organism | Tabla de proyectos + filtros + botón "Declarar requerimiento" | Solo SCR-004 |
| **ProjectTableRow** | Molecule | Nombre, Producto, Estado, Botón "Declarar requerimiento" | Dentro de ProjectList |
| **ProjectFilter** | Molecule | Filtro por estado (Todos, Activos, En pausa, Completados) | Dentro de ProjectList |

---

## 3. Estados y variantes

### Estados genéricos (aplicables a múltiples componentes)

| Estado | Componentes afectados | Visual | Interacción |
|---|---|---|---|
| **Normal/Idle** | Todos | Default appearance | Clickable, hoverable |
| **Hover** | Button, Link, TableRow | Fondo cambia a surface-container | Cursor pointer |
| **Focus** | Button, Input, Link, TableRow | Double ring (white + tertiary) | Keyboard accessible |
| **Disabled** | Button, Input, Select | Opacity 50%, no hover | No clickable, cursor not-allowed |
| **Loading** | Table, Button, Form | Spinner, texto grisado | No interacción |
| **Error/Validation** | Input, Form, Validation badge | Border rojo, texto error rojo | Clear error message |
| **Empty** | Table, List | Empty state visual (icono + texto) | CTA button visible |
| **Success** | Validation badge, Alert | Ícono ✓, fondo verde, texto verde | Temporal (se cierra auto o manual) |

### Estados específicos por componente

#### Table
- **Normal:** rows standard height 44px, borders 1px #CBD5E1
- **Hover:** fila background #F1F5F9
- **Selected:** left border 3px #1E3A8A, background #EFF6FF
- **Empty:** centrado empty state con icono + CTA
- **Loading:** skeleton rows, spinner centrado

#### Button (Primary)
- **Normal:** background #0F2942, text #FFFFFF
- **Hover:** background #1E3A8A
- **Focus:** double ring
- **Active:** background #0B1E30
- **Disabled:** opacity 50%, cursor not-allowed

#### Badge (Status)
- **Definido:** background #DCFCE7, text #065F46, ícono ✓
- **Sin definir:** background #F1F5F9, text #43474d, ícono ⓘ
- **Requerida:** background #FEF3C7, text #92400E, ícono *
- **Deseada:** background #E8EAEF, text #43474d, ícono ◦

#### Tabs
- **Normal tab:** background transparent, underline none
- **Active tab:** underline 3px #1E3A8A, text #0F2942 bold
- **Hover (inactive):** background #F1F5F9

#### Select / Dropdown
- **Closed:** border 1px #94A3B8, caret ⌄
- **Open:** border 1px #0F2942, dropdown visible
- **Selected option:** background #EFF6FF, text #0F2942 bold
- **Disabled:** opacity 50%

---

## 4. Responsive breakpoints

| Breakpoint | Width | Grid | Aplicación |
|---|---|---|---|
| **Mobile** | ≤767px | 4 columnas | SCR-001–004: stack vertical, table → accordion/cards |
| **Tablet** | 768–1279px | 8 columnas | SCR-001–004: 2-column layout (nav lateral colapsable) |
| **Desktop** | ≥1280px | 12 columnas | SCR-001–004: standard layout (nav lateral visible) |

**Notas:**
- Tablas: en mobile, las filas se convierten a cards apiladas (responsive table component)
- Sidebar: colapsable a icono en tablet, oculto en mobile (burger menu)
- Modales: ancho 100% en mobile, máx 90% en tablet, máx 600px en desktop

---

## 5. Reuse map: Atoms y Molecules compartidas

```
┌─ ATOMS (primitivos indivisibles)
│  ├─ Button (primario, secundario, destructivo)
│  ├─ Badge (status: Definido, Sin definir, Requerida, Deseada)
│  ├─ Select / Dropdown
│  ├─ Checkbox
│  ├─ Text Input
│  ├─ LevelBadge (L1–L4: Principiante, Autónomo, Avanzado, Experto)
│  └─ Icon (ícono genérico)
│
├─ MOLECULES (composiciones coherentes)
│  ├─ Tabs (pestañas + contenido)
│  ├─ Card (contenedor + border)
│  ├─ Alert / Banner (mensaje + icono + acción)
│  ├─ Filter (combo filtro + etiquetas)
│  ├─ EmptyState (icono + texto + CTA)
│  ├─ Modal / Dialog (overlay + contenido + acciones)
│  └─ TableRow (fila estándar)
│
└─ ORGANISMS (secciones complejas)
   ├─ Table (headers + rows + paginación/infinito)
   ├─ Header + Navigation (shell top bar)
   ├─ Sidebar (nav lateral)
   ├─ RoleCatalog (lista de roles)
   ├─ RoleDetailEditor (pestañas + tabla competencias)
   ├─ CompetencyDetailEditor (rúbrica + requisitos)
   ├─ ProjectList (tabla proyectos)
   └─ Modal / Dialog (grande, contenido variable)
```

---

## 6. Accessibility: estados y requisitos

| Componente | WCAG Requisito | Estado | Notas |
|---|---|---|---|
| **Button** | 44px min touch, focus ring, aria-label si solo icono | MANDATORY | Test con axe-core |
| **Table** | header scope, row headers (si aplica), focus visible | MANDATORY | aria-label en header, keyboard navigation (arrow keys) |
| **Badge** | color ≠ only differentiator (siempre icono + texto) | MANDATORY | Test con axe-core |
| **Select** | label associated, aria-expanded, arrow keys for navigation | MANDATORY | Keyboard: arrow up/down, enter, escape |
| **Checkbox** | label associated, aria-checked, focus ring | MANDATORY | Keyboard: space para toggle |
| **Tabs** | aria-selected, tabindex, aria-controls | MANDATORY | Keyboard: arrow left/right, home, end |
| **Modal** | focus trap, role="dialog", aria-modal, close on ESC | MANDATORY | Test con axe-core |
| **Form inputs** | label visible (no placeholder solo), error text associated | MANDATORY | aria-invalid, aria-describedby |
| **Links** | underline or bold + color (contrast ≥ 4.5:1) | MANDATORY | aria-label si texto insuficiente |

---

## 7. Preguntas abiertas y supuestos

| ID | Pregunta / Supuesto | Fuente | Resolver |
|---|---|---|---|
| **UIQ-01** | ¿Existe un modal "Nuevo rol" en SCR-001? (inferido de botón "+ Nuevo rol") | GEN-002 prompts | Preguntar a Jefe de Ingeniería o revisar Stitch |
| **UIQ-02** | ¿Paginación o scroll infinito en tablas? | No especificado | Decidir en design review |
| **UIQ-03** | ¿Modal o panel lateral para "Declarar requerimiento" desde SCR-004? | No especificado en GEN-002 | Decidir en design review |
| **SUPO-01** | Sidebar siempre visible en desktop (no colapsable) | GEN-002 SCR-001–004 | Confirmar con UX |
| **SUPO-02** | Sidebar colapsable a icono en tablet, oculto en mobile | Responsive strategy | Confirmar con UX |
| **SUPO-03** | No se implementa drag-drop, multi-select, o drag-reorder en tablas | Scope limpio | Confirmar scope |
| **SUPO-04** | Modales de confirmación manuales (no automáticos) | Patrón UX estándar | Confirmar con UX |

---

## 8. Próximos pasos (Component Catalog)

1. **CMP-ATOM-001:** Button (primario, secundario, destructivo)
2. **CMP-ATOM-002:** Badge (status)
3. **CMP-ATOM-003:** Select / Dropdown
4. **CMP-ATOM-004:** Checkbox
5. **CMP-ATOM-005:** Text Input
6. **CMP-ATOM-006:** LevelBadge (L1–L4)
7. **CMP-MOL-001:** Tabs
8. **CMP-MOL-002:** Card
9. **CMP-MOL-003:** Alert / Banner
10. **CMP-MOL-004:** Filter
11. **CMP-MOL-005:** EmptyState
12. **CMP-MOL-006:** Modal / Dialog
13. **CMP-MOL-007:** TableRow
14. **CMP-ORG-001:** Table (completa)
15. **CMP-ORG-002:** Header + Navigation (Shell)
16. **CMP-ORG-003:** Sidebar (navigation)
17. **CMP-ORG-004:** RoleCatalog
18. **CMP-ORG-005:** RoleDetailEditor
19. **CMP-ORG-006:** CompetencyDetailEditor
20. **CMP-ORG-007:** ProjectList
21. **PAGE-001:** Catálogo de roles (SCR-001)
22. **PAGE-002:** Detalle de rol (SCR-002)
23. **PAGE-003:** Detalle de competencia (SCR-003)
24. **PAGE-004:** Mis proyectos (SCR-004)

---

## 9. Status

**Status:** `REQUIRES_REVIEW`

**Validaciones pendientes:**
- [ ] UX: confirmar responsive breakpoints, paginación vs scroll infinito
- [ ] UX: confirmar modal "Nuevo rol" en SCR-001
- [ ] Backend: confirmar API contracts para tabla data loading
- [ ] QA: confirmar accessibility testing scope (axe-core, keyboard navigation)
- [ ] Frontend Team: confirmar atoms/molecules candidatas, clasificación atómica

**Revisado por:** [Pending]

**Aprobado por:** [Pending]

---
