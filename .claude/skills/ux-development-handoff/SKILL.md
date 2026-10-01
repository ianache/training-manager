# ux-development-handoff

## Purpose
Preparar contexto consumible por Arquitectura, Dev y QA.

## Course
UX-106

## Input contract
- Input: Bundle OKF + Figma
- MUST receive a governed Context Pack or canonical source artifacts.
- MUST distinguish facts, assumptions, open questions, and human decisions.
- MUST NOT silently resolve missing business information.

## Output contract
- Output: Handoff Pack + trazabilidad + ASR candidates
- Markdown outputs MUST conform to the UX/UI track conventions for Google OKF v0.2.
- New or modified concepts start with `status: draft`.
- The skill MUST set `generated.by` to its own actor/version.
- The skill MUST NOT set or fabricate `verified`.
- Open questions MUST be explicit.

## Workflow
1. Validate required inputs and provenance.
2. Extract relevant constraints and traceability links.
3. Generate candidate output(s).
4. Critique against UX requirements, acceptance criteria, accessibility, and Design System where applicable.
5. Produce draft OKF concepts and a concise change summary.
6. Stop for human review when a decision, ambiguity, or conflict requires judgment.

## Guardrails
- Never treat generated UI as approved merely because it renders.
- Never invent user research, business rules, accessibility evidence, or approvals.
- Preserve lineage to upstream US/UXR/FLW/SCR/CMP/AC concepts.
- Prefer semantic design tokens over raw visual values.
- External-tool exports are references, not the canonical knowledge artifact.

## Quality checks
- Required sources exist.
- Traceability links are resolvable.
- No critical open question is hidden.
- Output is reproducible from recorded context.
- Human verification remains pending unless supplied by a human workflow.

## Implementation Requirements Section (REQUIRED OUTPUT)

After producing Handoff Pack, MUST generate and include:

### Component Inventory & Implementation Checklist

Extract all components from UX specs and enumerate:

```markdown
## Implementation Requirements (for development-handoff-builder)

### Component Inventory (Auto-extracted)

| Component | Type | Library | Props | Validators | States | A11y | Design Ref |
|-----------|------|---------|-------|------------|--------|------|------------|
| nombres | text-input | @gf/ui | label, placeholder, required | required, minLength(2) | normal, error | aria-required | GEN-015-02 |

### Handoff Instructions for development-handoff-builder

**Next Step:** Pass this Handoff Pack + GEN-XXX to `development-handoff-builder`

**development-handoff-builder MUST:**
1. Read this Component Inventory
2. Extract from GEN-XXX all design specifications
3. Generate DCP with Implementation Contract
4. Bind components to development tasks

**What NOT to do:**
- Do NOT pass to writing-plans without DCP
- Do NOT create development tasks without component mapping
- Do NOT accept implementations that deviate from inventory
```

### Pre-Handoff Quality Gate

```markdown
## Gate Before Handoff: Design Complete?

MUST answer:
- [ ] All screens in SCR have corresponding GEN design?
- [ ] All components in GEN have properties enumerated?
- [ ] All validators specified (sync + async)?
- [ ] All states covered (normal, error, loading, success)?
- [ ] Accessibility (aria-*, role) defined for each?
- [ ] Ready for development-handoff-builder consumption?

If ANY is NO → Stop. Complete design first.
If ALL are YES → Ready to hand off.
```

## Definition of Done
The skill output includes:
- ✅ Handoff Pack with traceability
- ✅ Component Inventory extracted from design
- ✅ Implementation instructions for next phase
- ✅ Ready for development-handoff-builder to consume
- ✅ All artifacts (SCR, GEN, FLW) available for developers
