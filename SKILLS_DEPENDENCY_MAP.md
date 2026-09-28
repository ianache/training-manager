# Mapa de Dependencias de Skills

Análisis de estructura y relaciones entre los 21 skills organizados por categoría funcional.

---

## 1. Categorías y Clasificación

### **Categoría A: Architecture & Context** (5 skills)
Orquestación de contexto, decisiones y descubrimiento arquitectónico.

- `architecture-discovery` — Descubrir contexto actual, ámbito, actores, capacidades
- `architecture-context-builder` — Consolidar contexto arquitectónico antes de ARQ-102
- `architecture-impact-analyzer` — Trazar requisitos en arquitectura actual y dependencias
- `asr-discovery` — Identificar candidatos de ASR (Architectural Significant Requirements)
- `architecture-adr-writer` — Registrar decisiones arquitectónicas en ADRs

### **Categoría B: Functional Analysis & Knowledge** (6 skills)
Análisis funcional, requisitos, reglas de negocio y glosario empresarial.

- `af-requirement-context-builder` — Construir contexto funcional (inputs: VIS, requisitos)
- `ux-requirements-analyzer` — Analizar requisitos UX sin inventar respuestas
- `af-user-story-refiner` — Transformar contexto en User Stories con Given/When/Then
- `af-business-rule-extractor` — Extraer reglas de negocio, estados, validaciones
- `af-business-glossary-curator` — Mantener glosario de términos empresariales (TRM-*)
- `af-conceptual-model-designer` — Diseñar modelo conceptual (IMD-*, entidades y relaciones)

### **Categoría C: UX/Design & Specifications** (6 skills)
Análisis UX, generación de diseños, especificaciones y validación.

- `ux-requirements-analyzer` — Extraer requisitos UX y aceptación de criterios
- `user-flow-designer` — Mapear flujos de usuario (UXR-*) desde requisitos
- `claude-design-orchestrator` — Orquestar exploración y crítica en Claude Design
- `stitch-ui-generator` — Generar pantallas reproducibles en Google Stitch (SCR-*)
- `web-atomic-component-designer` — Inventariar componentes (atoms/molecules/organisms)
- `ui-spec-writer` — Especificar componentes Angular con contratos públicos (CMP-*)
- `figma-design-validator` — Validar diseños Figma contra spec y design system
- `accessibility-reviewer` — Revisar cumplimiento WCAG 2.2 AA

### **Categoría D: Data & Domain** (1 skill)
Diseño de modelos de datos y esquemas.

- `data-model-designer` — Diseñar modelos lógicos y físicos (DTC-104, DDL)

### **Categoría E: Handoff & Integration** (2 skills)
Consolidación y traspaso a desarrollo.

- `architecture-development-handoff` — Consolidar contexto para desarrolladores
- `ux-development-handoff` — Consolidar especificaciones para frontend team

---

## 2. Grafo de Dependencias

```
┌─────────────────────────────────────────────────────────────────┐
│               ARCHITECTURE & CONTEXT (Categoría A)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  architecture-discovery ◄────────────┐                           │
│         ↓                            │                           │
│  architecture-context-builder ◄─────┤── (inputs de requisitos)  │
│         ↓                            │                           │
│  architecture-impact-analyzer        │                           │
│         ↓                            │                           │
│  asr-discovery ◄────────────────────┘                           │
│         ↓                                                         │
│  architecture-adr-writer                                         │
│         ↓                                                         │
│  architecture-development-handoff                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         ▲
         │ (requiere contexto arquitectónico)
         │
┌─────────────────────────────────────────────────────────────────┐
│          FUNCTIONAL ANALYSIS & KNOWLEDGE (Categoría B)           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  af-requirement-context-builder                                  │
│         ↓                                                         │
│  ux-requirements-analyzer ──┐                                   │
│         ↓                   │                                    │
│  af-user-story-refiner      │                                   │
│         ↓                   │                                    │
│  af-business-rule-extractor │ (requiere análisis UX)           │
│         ↓                   │                                    │
│  af-business-glossary-curator                                   │
│  af-conceptual-model-designer ◄─────────────────────────────┐   │
│                                                            │   │
└─────────────────────────────────────────────────────────────────┘
         ▲
         │ (usa términos del glosario, modelo conceptual)
         │
┌─────────────────────────────────────────────────────────────────┐
│            UX/DESIGN & SPECIFICATIONS (Categoría C)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  user-flow-designer ◄───────────────┐                           │
│         ↓                           │                           │
│  claude-design-orchestrator         │ (requiere req UX)        │
│         ↓                           │                           │
│  stitch-ui-generator ◄──────────────┘                           │
│         ↓                                                        │
│  web-atomic-component-designer (inventario + clasificación)    │
│         ↓                                                        │
│  ui-spec-writer (especificaciones técnicas de componentes)     │
│         ↓                                                        │
│  figma-design-validator (validación contra spec)               │
│         ↓                                                        │
│  accessibility-reviewer (WCAG AA compliance)                   │
│         ↓                                                        │
│  ux-development-handoff (consolidación para developers)        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
         ▲
         │
┌─────────────────────────────────────────────────────────────────┐
│              DATA & DOMAIN (Categoría D)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  data-model-designer ◄────────────────────────────────────┐     │
│      (requiere contexto arquitectónico + especificaciones UX)   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Matriz de Dependencias Explícitas

| Skill | Categoría | Depende de (inputs) | Produce (outputs) | Usa en (workflow) |
|---|---|---|---|---|
| `architecture-discovery` | A | Requisitos, NFRs explícitas | Architecture Discovery Brief | → `architecture-context-builder` |
| `architecture-context-builder` | A | Discovery Brief, estándares ADRs | Architecture Context Pack | → `architecture-impact-analyzer` |
| `architecture-impact-analyzer` | A | Context Pack, requisitos | Impact Matrix | → `asr-discovery` |
| `asr-discovery` | A | Context Pack, impact analysis | ASR Candidates Catalog | → `architecture-adr-writer` |
| `architecture-adr-writer` | A | ASR, decisión humana | ADR file (ADR-NNN) | → `architecture-development-handoff` |
| `architecture-development-handoff` | E | ADRs, Context Pack, reviews | Dev Context Pack | Hará referencias a Categoría D |
| `af-requirement-context-builder` | B | VIS, reglas, datos, integraciones | Requirement Context Pack | Insumo para análisis UX |
| `ux-requirements-analyzer` | B | User Stories, Context Pack | UX Requirement + preguntas | → `af-user-story-refiner` |
| `af-user-story-refiner` | B | Contexto validado, reglas | Refined User Story | → `user-flow-designer` |
| `af-business-rule-extractor` | B | Contexto, decisiones, estados | Business Rules Catalog | Usado por `data-model-designer` |
| `af-business-glossary-curator` | B | Documentos de negocio | Business Glossary (GLS-001) | Referencia para todos |
| `af-conceptual-model-designer` | B | Contexto, glosario, reglas | Conceptual Model (IMD-NNN) | → `data-model-designer` |
| `user-flow-designer` | C | UX Requirements + User Stories | User Flow Diagrams (UXR-*) | → `claude-design-orchestrator` |
| `claude-design-orchestrator` | C | UX Requirements, Context Pack | Design Intent Brief + Alternatives | → `stitch-ui-generator` |
| `stitch-ui-generator` | C | Design Brief, design system | Screen Designs (SCR-*) en Stitch | → `web-atomic-component-designer` |
| `web-atomic-component-designer` | C | Screens (SCR-*), design tokens | UI Inventory + Component Catalog | → `ui-spec-writer` |
| `ui-spec-writer` | C | Component Catalog, design system | Component Specs (CMP-*) | → `figma-design-validator` |
| `figma-design-validator` | C | Design files, spec | Validation Report | → `accessibility-reviewer` |
| `accessibility-reviewer` | C | Designs, WCAG target | A11y Matrix + findings | → `ux-development-handoff` |
| `data-model-designer` | D | Context Pack, IMD-*, reglas, requisitos | Logical + Physical Models (DTC-104) | ← `architecture-context-builder` |
| `ux-development-handoff` | E | Specs, A11y, tokens | Dev Context Pack (frontend) | Referencia de implementación |

---

## 4. Flujos de Trabajo Típicos

### **Flujo A: Discovery → Architecture → ASR**
```
1. architecture-discovery (entender el problema actual)
   ↓
2. architecture-context-builder (consolidar contexto)
   ↓
3. architecture-impact-analyzer (medir impacto de requisitos)
   ↓
4. asr-discovery (identificar ASRs)
   ↓
5. architecture-adr-writer (registrar decisiones)
   ↓
6. architecture-development-handoff (traspaso a dev)
```

### **Flujo B: Análisis Funcional → Glosario + Modelo**
```
1. af-requirement-context-builder (contexto inicial)
   ↓
2. ux-requirements-analyzer (analizar UX)
   ↓
3. af-user-story-refiner (refinar user stories)
   ↓
4. af-business-rule-extractor (extraer reglas)
   ↓
5. af-business-glossary-curator (mantener glosario)
   ↓
6. af-conceptual-model-designer (modelar entidades)
```

### **Flujo C: UX → Diseño → Especificación → Desarrollo**
```
1. user-flow-designer (mapear flujos)
   ↓
2. claude-design-orchestrator (orquestar diseño)
   ↓
3. stitch-ui-generator (generar pantallas)
   ↓
4. web-atomic-component-designer (inventariar componentes)
   ↓
5. ui-spec-writer (especificar contratos)
   ↓
6. figma-design-validator (validar contra design system)
   ↓
7. accessibility-reviewer (cumplimiento WCAG)
   ↓
8. ux-development-handoff (traspaso a frontend)
```

### **Flujo D: Data Model (integrado con A y B)**
```
(Requiere outputs de:)
   architecture-context-builder (decisiones de persistencia)
   + af-conceptual-model-designer (modelo conceptual)
   + af-business-rule-extractor (reglas de validación)
   ↓
data-model-designer (diseñar DDL, indices, constraints)
```

---

## 5. Dependencias Técnicas por Skill

### **Fuertemente Acoplados (deben ejecutarse en orden)**
- `architecture-discovery` → `architecture-context-builder` → `architecture-impact-analyzer` → `asr-discovery`
- `ux-requirements-analyzer` → `af-user-story-refiner`
- `user-flow-designer` → `claude-design-orchestrator` → `stitch-ui-generator`
- `web-atomic-component-designer` → `ui-spec-writer` → `figma-design-validator` → `accessibility-reviewer`

### **Débilmente Acoplados (pueden ejecutarse en paralelo)**
- `af-business-glossary-curator` ⊥ `af-business-rule-extractor` (ambos leen desde contexto)
- `af-business-rule-extractor` ⊥ `af-conceptual-model-designer` (usan mismo contexto, outputs independientes)
- Todas las categorías pueden ejecutarse en paralelo si hay suficientes inputs de origen

### **Nunca Deben Ignorarse**
- `architecture-discovery` DEBE preceder a `architecture-impact-analyzer`
- `af-business-glossary-curator` DEBE estar presente antes de `af-conceptual-model-designer`
- `ux-requirements-analyzer` DEBE preceder a `user-flow-designer`

---

## 6. Matriz de Trazabilidad

```
VIS (requisitos) 
  ├─ → architecture-discovery
  ├─ → af-requirement-context-builder
  └─ → ux-requirements-analyzer

architecture-context-builder output
  ├─ → architecture-impact-analyzer
  ├─ → data-model-designer (input: decisiones de persistencia)
  └─ → architecture-adr-writer (input: validación de decisiones)

af-conceptual-model-designer output (IMD-*)
  ├─ → data-model-designer (input: entidades, relaciones)
  └─ → af-business-glossary-curator (referencia: términos)

UX Requirement output
  ├─ → af-user-story-refiner
  ├─ → user-flow-designer
  └─ → web-atomic-component-designer (reference: actor requirements)

Stitch Design (SCR-*) output
  ├─ → web-atomic-component-designer (input: screens to analyze)
  └─ → ui-spec-writer (reference: visual examples)

Component Specs (CMP-*) output
  ├─ → figma-design-validator (check: design matches spec)
  ├─ → accessibility-reviewer (check: WCAG compliance)
  └─ → ux-development-handoff (input: contracts for developers)

Development Handoff outputs
  └─ → Developer implementation (Angular, Node.js, SQL)
```

---

## 7. Resumen de Dependencias por Nivel

### **Nivel 0: Independientes** (no dependen de otros skills)
- `af-requirement-context-builder` (inicia desde requisitos)
- `architecture-discovery` (inicia desde requisitos)

### **Nivel 1: Primeras transformaciones**
- `ux-requirements-analyzer` (depende de: requisitos)
- `af-user-story-refiner` (depende de: contexto)
- `architecture-context-builder` (depende de: discovery)

### **Nivel 2: Análisis integrados**
- `af-business-rule-extractor` (depende de: contexto, requisitos)
- `af-business-glossary-curator` (depende de: documentos de negocio)
- `af-conceptual-model-designer` (depende de: glosario, reglas, contexto)
- `architecture-impact-analyzer` (depende de: context builder)
- `user-flow-designer` (depende de: UX requirements)

### **Nivel 3: Diseño y consolidación**
- `asr-discovery` (depende de: impact analyzer)
- `claude-design-orchestrator` (depende de: user flow)
- `data-model-designer` (depende de: context, IMD, reglas)

### **Nivel 4: Especificación técnica**
- `stitch-ui-generator` (depende de: design orchestrator)
- `architecture-adr-writer` (depende de: ASR discovery)

### **Nivel 5: Detalle y validación**
- `web-atomic-component-designer` (depende de: stitch output)
- `ui-spec-writer` (depende de: component inventory)

### **Nivel 6: Control de calidad**
- `figma-design-validator` (depende de: ui spec)
- `accessibility-reviewer` (depende de: design validator)

### **Nivel 7: Traspaso (terminal)**
- `architecture-development-handoff` (depende de: ADRs, context)
- `ux-development-handoff` (depende de: accessibility review)

---

## 8. Notas Importantes

1. **Paralelización segura:**
   - Categoría A (Architecture) puede ejecutarse en paralelo con Categoría B (Functional Analysis)
   - Dentro de Categoría B: `af-business-glossary-curator` y `af-business-rule-extractor` son independientes
   - Categoría C (UX/Design) requiere outputs de Categoría B pero puede paralelizarse internamente

2. **Bloqueos críticos:**
   - `architecture-discovery` DEBE completarse antes de `architecture-impact-analyzer`
   - `af-business-glossary-curator` DEBE estar parcialmente completo antes de `af-conceptual-model-designer`
   - `stitch-ui-generator` depende de definición completa de design system

3. **Inputs externos requeridos:**
   - Vision (VIS-001)
   - User Stories iniciales
   - Requisitos NFR
   - Design System (para validación)
   - Base de datos de referencia (para data-model-designer)

4. **Outputs que fluyen hacia desarrollo:**
   - Architecture Development Handoff (arquitectos → desarrolladores backend)
   - UX Development Handoff (UX/diseño → desarrolladores frontend)
   - Data Model Handoff (data architect → desarrolladores backend + DBA)

---

Creado: 2026-09-27
