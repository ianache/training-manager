# ui-spec-writer

## Purpose
Convertir flujos en especificación UI independiente de herramienta.

## Course
UX-102

## Input contract
- Input: User Flows + Design System
- MUST receive a governed Context Pack or canonical source artifacts.
- MUST distinguish facts, assumptions, open questions, and human decisions.
- MUST NOT silently resolve missing business information.

## Output contract
- Output: Screen + Component + Token + AC
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

After producing SCR, MUST generate and include:

### Component Inventory

For each screen, extract all components with:
- Component name (mapped to @gf/ui library)
- Type (text-input, select, button, etc.)
- Props (label, placeholder, required, etc.)
- Validators (sync + async)
- States (normal, focused, filled, error, loading, success)
- Accessibility (aria-*, role)
- Cross-reference to SCR section

**Format:**
```markdown
### SCR-015-02: Datos de Persona — Component Inventory

| Component | Type | Props | Validators | States | A11y |
|-----------|------|-------|------------|--------|------|
| nombres | text-input | label, placeholder, aria-required | required, minLength(2) | normal, focused, error | aria-required, aria-invalid, aria-label |
```

### Implementation Checklist

```markdown
### Implementation Prerequisites

- [ ] All components in inventory mapped to @gf/ui v1.1.0
- [ ] All validators enumerated (sync: required, email, etc. + async: duplicate-check)
- [ ] All states covered in design (normal, error, loading, success, etc.)
- [ ] Accessibility attributes specified (aria-*, role, keyboard nav)
- [ ] Ready for development-handoff-builder consumption
```

### Handoff Instructions for Developers

```markdown
## Handoff to Development

**Framework & Dependencies:**
- Framework: Angular 22 (Standalone components)
- UI Library: @gf/ui v1.1.0
- Design System: Material Design 3
- Accessibility Standard: WCAG 2.2 AA (0 violations required)

**Implementation Binding:**
ALL components listed in Component Inventory above MUST be implemented.
NO SUBSTITUTIONS without UX review and approval.

**Design Verification:**
Post-implementation, code reviewer MUST verify against:
- GEN-XXX design specification (visual match)
- Component Inventory (all components present)
- States (all variations implemented)
- Accessibility (WCAG 2.2 AA verified via axe/WAVE)

**Cross-References:**
- Visual design: GEN-XXX
- Acceptance criteria: SCR-XXX (this document)
- Flow context: FLW-XXX
```

## Definition of Done
The skill output is ready for human review, is traceable to its sources, includes Implementation Requirements section with Component Inventory, and can be handed to development-handoff-builder without rework.
