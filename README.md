# 📚 UX/UI Potenciado por IA — Pack V2 + Gestión de Formación

**Plataforma de Gestión de Formación del Recurso Humano (COMSATEL)**

Artefactos de conocimiento gobernados en formato **Google OKF v0.2** + Diagramas Archify.

---

## 📦 Contenido del Repositorio

### Programa UX/UI (Programa de Formación 2026)
1. **`01_Fichas_Formales/`** — Seis fichas UX-101 a UX-106 (DOCX)
2. **`02_Guias_Laboratorio/`** — Seis guías con laboratorios tecnológicos separados
3. **`03_Skill_Packages/`** — Ocho Skills agentic con SKILL.md, templates y ejemplos

### Gestión de Formación (Iniciativa H1-H3)
- **`knowledge-base/business/`** — Business Context Pack + Conceptos OKF
- **`knowledge-base/architecture/`** — Architecture Context Pack + ADRs
- **`.archify/`** — JSONs candidatos para diagramas Archify (architecture, dataflow, workflow)
- **`archify-diagrams/`** — Visualizadores y especificaciones

---

## 🚀 Secuencia Canónica (Programas UX/UI)

```
UX-101 → UX-102 → {UX-103 | UX-104 | directo} → UX-105 → UX-106
```

| Programa | Tema | Skills Clave |
|----------|------|--------------|
| **UX-101** | Experiencia de Usuario con IA | `ux-requirements-analyzer`, `user-flow-designer` |
| **UX-102** | Diseño de Interfaces con IA | `ui-spec-writer`, `accessibility-reviewer` |
| **UX-103** | Diseño Agentic (Claude Design) | `claude-design-orchestrator` |
| **UX-104** | Prototipado (Google Stitch) | `stitch-ui-generator` |
| **UX-105** | Diseño Gobernado (Figma) | `figma-design-validator` |
| **UX-106** | Design-to-Code & Handoff | `ux-development-handoff` |

---

## 🎯 Iniciativa: Gestión de Formación (H1-H3)

### Propósito
Puente entre demanda de competencias (4 productos) y oferta de colaboradores certificados.

### Documentos Principales

**Leer en este orden:**

1. **[BCP-001: Business Context Pack](knowledge-base/business/BCP-001-business-context-pack.md)**
   - Visión, stakeholders, objetivos, KPIs
   - Modelo de datos conceptual
   - Roadmap H1-H3

2. **[ACP-002: Architecture Context Pack](knowledge-base/architecture/ACP-002-context-pack-general.md)**
   - Decisiones arquitectónicas (ADR-001 a ADR-004)
   - Componentes, capas, integraciones
   - Restricciones técnicas y riesgos

3. **[OKF Concepts Index](knowledge-base/business/OKF-CONCEPTS-INDEX.md)**
   - Navegación de objetivos, stakeholders, riesgos, supuestos

4. **[Diagramas Archify](archify-diagrams/)**
   - Visualizadores HTML interactivos
   - Especificaciones ASCII completas

---

## 📊 Visualizar los Diagramas

### Opción 1: Visualizador Web (Recomendado - Ahora)
```bash
# Abre en navegador:
archify-diagrams/viewer.html
```

**Características:**
- ✅ 3 diagramas ASCII completos
- ✅ Especificaciones visuales
- ✅ Enlaces a JSONs y documentación
- ✅ Interfaz interactiva

### Opción 2: Especificaciones Markdown
```bash
# Abre:
archify-diagrams/INDEX.md
```

### Opción 3: Generar HTMLs Interactivos con Archify

#### Instalación

```bash
# Instalar Archify globalmente
npx skills add tt-a1i/archify -g
```

#### Iniciar Servidor

```bash
# Opción A: Usar Web UI
npx archify serve
# Luego abre: http://localhost:3000
# Carga los JSONs de: .archify/

# Opción B: Ejecutar script automático
.\.claude\scripts\generate-archify-diagrams.ps1
```

#### Archivos de Entrada
```
.archify/
├── 01-architecture-general.json      # Arquitectura general (architecture)
├── 02-data-model-flow.json           # Modelo de datos (dataflow)
├── 03-workflow-procesos.json         # Flujos de procesos (workflow)
└── 04-cache-miss-sequence.json       # Secuencia cache miss (sequence)
```

#### Archivos de Salida
```
archify-diagrams/
├── 01-architecture-general.html      # Diagrama interactivo
├── 02-data-model-flow.html           # Diagrama interactivo
├── 03-workflow-procesos.html         # Diagrama interactivo
└── 04-cache-miss-sequence.html       # Diagrama interactivo
```

---

## 🛠️ Configuración del Entorno

### Requisitos
- Node.js 16+ (para Archify)
- PowerShell (para scripts automatización)
- Navegador moderno (para visualizadores)

### Herramientas Instaladas
```bash
# Skills Agentic
npx skills add tt-a1i/archify -g       # Generador de diagramas

# Otras herramientas (ver AGENTS.md)
npx skills add <skill-url> -g
```

### Configuración Git
```bash
# Proyecto usa graphify para mantener el knowledge graph
git config --local core.hooksPath .githooks

# Antes de cada commit, graphify actualiza el grafo:
graphify update .
git add graphify-out/
```

---

## 📖 Documentación

### Instrucciones para Agentes
- **[CLAUDE.md](CLAUDE.md)** — Configuración local para Claude Code
- **[AGENTS.md](AGENTS.md)** — Reglas para agentes agentic (Skills, OKF, definición de hecho)

### Contexto de Negocio
- **[BCP-001](knowledge-base/business/BCP-001-business-context-pack.md)** — Business Context Pack completo
- **[OKF Concepts](knowledge-base/business/OKF-CONCEPTS-INDEX.md)** — Índice navegable

### Contexto de Arquitectura
- **[ACP-002](knowledge-base/architecture/ACP-002-context-pack-general.md)** — Architecture Context Pack
- **[ADRs](knowledge-base/architecture/adrs/)** — Decisiones arquitectónicas (ADR-001 a ADR-004)

### Troubleshooting
- **[ARCHIFY-TROUBLESHOOTING.md](ARCHIFY-TROUBLESHOOTING.md)** — Si Archify falla
- **[GENERACION-COMPLETADA.md](GENERACION-COMPLETADA.md)** — Resumen de artefactos generados

---

## ✅ Estado Actual (2026-09-29)

| Artefacto | Status | Ubicación |
|-----------|--------|-----------|
| **BCP-001** | ✅ Completo (Draft) | `knowledge-base/business/` |
| **ACP-002** | ✅ Completo (Draft) | `knowledge-base/architecture/` |
| **10 Conceptos OKF** | ✅ Completo (Draft) | `knowledge-base/business/` |
| **4 JSONs Archify** | ✅ Listos | `.archify/` |
| **Visualizador HTML** | ✅ Funcional | `archify-diagrams/viewer.html` |
| **HTMLs Archify** | ⏳ Esperando finalize | `archify-diagrams/` |

---

## 🎯 Próximos Pasos

### Fase 1: Validación (Esta semana)
1. ✅ Validar BCP-001 y ACP-002 con stakeholders
2. ✅ Resolver preguntas bloqueantes (P-02, RCP-Q1)
3. ⏳ Generar HTMLs Archify finales

### Fase 2: Completar Conceptos OKF (2 semanas)
- Generar 5 stakeholders faltantes (STK-004 a STK-008)
- Generar 4+ constraints adicionales
- Generar 6+ risks adicionales

### Fase 3: Derivar Especificaciones (Próximo mes)
- Especificaciones técnicas (API contracts, DB schema, Design tokens)
- Requirements funcionales (AF-101: RCP-001 detallada)
- Especificaciones UX (UX-101: UX Context Pack)

---

## 📝 Instrucciones para Desarrolladores

### Leer Antes de Empezar
1. [AGENTS.md](AGENTS.md) — Convenciones OKF y reglas para agentes
2. [CLAUDE.md](CLAUDE.md) — Configuración local
3. [BCP-001](knowledge-base/business/BCP-001-business-context-pack.md) — Contexto de negocio

### Generar Diagramas
```bash
# Ver diagramas ahora (HTML + ASCII)
open archify-diagrams/viewer.html

# Generar HTMLs interactivos finales
npx skills add tt-a1i/archify -g
npx archify serve
# Carga JSONs desde: .archify/
```

### Actualizar Knowledge Graph
```bash
# Después de cambios en el código
graphify update .

# Antes de cada commit
git add graphify-out/
```

---

**Generado:** 2026-09-29 | **Estado:** Draft | **Validación Pendiente:** Stakeholders clave
