# AGENTS.md — UX/UI Potenciado por IA (Pack V2)

Instrucciones para agentes de IA (Claude Code, Codex, etc.) que trabajan en este repositorio.

## Contexto

Material del track **UX/UI** del Programa de Formación de Competencias 2026 (COMSATEL · Malla V2).
El repositorio contiene fichas formales, guías de laboratorio y Skills agentic que producen
artefactos de conocimiento UX gobernados en formato **Google OKF v0.2**.

Idioma de trabajo: **español**. Identificadores técnicos (campos OKF, nombres de skills) en inglés.

## Estructura

| Ruta | Contenido |
|------|-----------|
| `01_Fichas_Formales/` | Fichas UX-101 a UX-106 (`.docx`). Fuente canónica de objetivos y alcance de cada curso. |
| `02_Guias_Laboratorio/` | Guías de laboratorio UX-101 a UX-106 (`.docx`). |
| `.claude/skills/` | Ocho Skills con `SKILL.md`, `templates/concept-template.md` y `examples/example.md`. |
| `README.md` | Resumen del pack y secuencia canónica. |

## Secuencia canónica de cursos

```
UX-101 → UX-102 → {UX-103 | UX-104 | directo} → UX-105 → UX-106
```

| Curso | Tema | Skills |
|-------|------|--------|
| UX-101 | Experiencia de Usuario con IA | `ux-requirements-analyzer`, `user-flow-designer` |
| UX-102 | Diseño de Interfaces con IA | `ui-spec-writer`, `accessibility-reviewer` |
| UX-103 | Diseño Agentic con Claude Design | `claude-design-orchestrator` |
| UX-104 | Prototipado con Google Stitch | `stitch-ui-generator` |
| UX-105 | Diseño Gobernado con Figma | `figma-design-validator` |
| UX-106 | Design-to-Code & Handoff Agentic | `ux-development-handoff` |

`accessibility-reviewer` aplica de UX-102 a UX-106.

## Cadena de trazabilidad

Todo artefacto debe preservar el linaje hacia sus conceptos upstream:

```
US (User Story) → UXR (UX Requirement) → FLW (Flow) → SCR (Screen) → CMP (Component) → AC (Acceptance Criteria)
```

## Reglas para agentes

### Human-in-the-loop
- Distinguir siempre **hechos, supuestos, preguntas abiertas y decisiones humanas**.
- **Nunca** resolver en silencio información de negocio faltante: registrarla como pregunta abierta.
- Detenerse para revisión humana ante ambigüedad, conflicto o decisión de producto.
- Una UI generada **no** está aprobada solo porque renderiza.

### No inventar
- Investigación de usuarios, reglas de negocio, evidencia de accesibilidad ni aprobaciones.

### Convenciones OKF v0.2
- Los outputs Markdown usan el frontmatter del `concept-template.md` de cada skill.
- Salvo indicación explícita en contrario, todo contenido nuevo o modificado que se genere y almacene en `knowledge-base/` debe cumplir Google OKF v0.2 e incluir su frontmatter estándar.
- `knowledge-base/` debe mantener `index.md` como índice de los artefactos y `changelog.md` como registro cronológico de altas, cambios y retiros. Ambos archivos también deben incluir frontmatter OKF v0.2 y actualizarse junto con cada cambio en la base de conocimiento.
- El índice debe enlazar a artefactos existentes; el changelog debe identificar la fecha y los artefactos afectados, sin registrar como hechos decisiones o verificaciones no confirmadas.
- Conceptos nuevos o modificados inician con `status: draft`.
- `generated.by` = `<skill>/<versión>` (p. ej. `ux-requirements-analyzer/1.0`).
- `generated.at` en ISO 8601 con zona `-05:00`.
- **Nunca** establecer ni fabricar `verified`: solo lo asigna un flujo humano.
- `sources` debe apuntar a artefactos existentes y resolubles.

### Diseño
- Preferir **tokens semánticos** del Design System sobre valores visuales crudos.
- Accesibilidad objetivo: **WCAG 2.2 AA**.
- Los exports de herramientas externas (Figma, Stitch, Claude Design) son **referencias**,
  no el artefacto canónico de conocimiento.

### Archivos
- No modificar los `.docx` de `01_Fichas_Formales/` ni `02_Guias_Laboratorio/` salvo pedido explícito.
- Al crear o editar una skill, mantener la estructura: `SKILL.md` (Purpose, Course, Input/Output
  contract, Workflow, Guardrails, Quality checks, Definition of Done) + `templates/` + `examples/`.

## Definition of Done (general)

Un output está listo cuando:
1. Es trazable a sus fuentes.
2. No oculta preguntas abiertas críticas.
3. Es reproducible desde el contexto registrado.
4. La verificación humana queda pendiente (salvo que la aporte un flujo humano).
5. Puede incorporarse al bundle OKF UX/UI sin perder procedencia.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- Before every commit (`git commit`, including commits made by agents or skills): run `graphify update .` so the graph reflects the staged changes, then stage the refreshed `graphify-out/` (`git add graphify-out/`) and include it in the same commit. If `graphify update .` fails, stop and report the error instead of committing a stale graph.
