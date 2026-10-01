# stitch-ui-generator

## Purpose
Generar UI reproducible en Stitch y registrar lineage de variantes.

## Course
UX-104

## Input contract
- Input: Screens + DESIGN.md
- MUST receive a governed Context Pack or canonical source artifacts.
- MUST distinguish facts, assumptions, open questions, and human decisions.
- MUST NOT silently resolve missing business information.

## Output contract
- Output: Generation Prompt + variantes
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

After producing Stitch designs, MUST extract and include:

### Component Specification for Developers

For each design variation, enumerate:
```markdown
### GEN-015-02: Datos Persona — Components Specified for Implementation

**Component: Text Input (nombres)**
- Library: @gf/ui / text-input
- Label: "Nombres *"
- Placeholder: "ej. Juan Carlos"
- Type: text
- Required: true
- Validators: [required, minLength(2)]
- States: normal, focused, filled, error
- Error message: "Campo obligatorio" / "Mínimo 2 caracteres"
- Accessibility:
  - aria-required="true"
  - aria-invalid="true" (on error)
  - aria-label="Nombres, campo obligatorio"
- Focus visible: 2px solid border (high contrast)
- Keyboard: Tab order as per FLW-015

**Validation Behavior (Real-time):**
- On blur: Check required + minLength
- Show error: below input, role="alert"
- Clear error: on user input

**States Implemented:**
- [ ] normal: default styling
- [ ] focused: border highlight + label color change
- [ ] filled: show value + any icons
- [ ] error: red border + error message + aria-invalid
- [ ] disabled: greyed out (if applicable per FLW)
```

### Developer Implementation Checklist

Generate for each component:
```markdown
### Implementation Tasks (Auto-extracted from GEN-015)

- [ ] Create text-input component (nombres)
  - [ ] Props: label, placeholder, required, validators
  - [ ] Output: valueChange, blur events
  - [ ] States: normal, focused, filled, error
  - [ ] Accessibility: aria-required, aria-invalid, aria-label
  - [ ] Verify against GEN-015-02 screenshot

- [ ] Create text-input component (apellidos)
  - [ ] [same as above]

- [ ] Create select component (tipoIdentificacion)
  - [ ] Props: options, required, aria-label
  - [ ] Keyboard nav: Arrow keys, Enter
  - [ ] States: normal, open, selected, error
  - [ ] Verify against GEN-015-03 screenshot
```

### Handoff Contract for Development

```markdown
## Implementation Contract (BINDING)

**Components in this GEN-015:**
Generated at: [date]
Validated against: SCR-015, FLW-015

**ALL components below MUST be implemented:**

| Component Name | Type | Location (GEN Section) | Binding Status |
|---|---|---|---|
| text-input (nombres) | input | GEN-015-02 | MUST IMPLEMENT |
| text-input (apellidos) | input | GEN-015-02 | MUST IMPLEMENT |
| select (tipoIdentificacion) | select | GEN-015-03 | MUST IMPLEMENT |

**No Substitutions Rule:**
- CANNOT replace text-input with Material mat-input (use @gf/ui text-input)
- CANNOT skip error states (all must be present)
- CANNOT omit async validators (duplicate-check, etc.)
- CANNOT change accessibility attributes

**Verification:**
- Code review MUST verify each component against GEN-015
- UI test MUST verify visual match to Stitch design
- A11y test MUST verify WCAG 2.2 AA per GEN-015
```

## Definition of Done
The skill output includes:
- ✅ Visual design in Stitch
- ✅ Component Specifications for Developers (enumerated props, states, validators)
- ✅ Implementation Checklist (extracted from design)
- ✅ Handoff Contract (binding requirements for code)
- ✅ Ready for development-handoff-builder to consume and create DCP
- ✅ Ready for writing-plans to create implementation tasks
