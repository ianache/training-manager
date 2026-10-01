# UX → Development Alignment Guide

**Objective:** Prevent design-to-code misalignment (as occurred with US-015/PLAN-015).

**Version:** 1.0  
**Updated:** 2026-10-01  
**Authority:** Lessons learned from US-015 execution

---

## The Problem We're Solving

| Phase | What Happened | Result |
|-------|---------------|--------|
| **Sep 30 23:12** | `ui-spec-writer` created SCR-015 | ✅ Design spec produced |
| **Sep 30 23:19** | `stitch-ui-generator` created GEN-015 | ✅ Visual design in Stitch |
| **Oct 1 00:46** | `writing-plans` created PLAN-015 | ❌ **Ignored SCR-015/GEN-015** |
| **Oct 1 00:46+** | Execution of PLAN-015 | ❌ Wizard never implemented, UI mismatch |

**Root Cause:** No gate validated that PLAN aligned to design before execution.

---

## The Workflow (FIXED)

```
UXR-015 (ux-requirements-analyzer)
   ↓
FLW-015 (user-flow-designer)
   ↓
SCR-015 (ui-spec-writer) ← MUST HAVE: Implementation Section
   ↓
GEN-015 (stitch-ui-generator) ← MUST HAVE: Component Specs + Checklist
   ↓
DCP-015 (development-handoff-builder) ← MUST VALIDATE: SCR + GEN present
   ↓ ← NEW GATE: Design Contract Binding Check
   ↓
PLAN-015 (writing-plans) ← MUST CONSUME: DCP + Component Inventory
   ↓
EXECUTION (subagent-driven-development) ← NEW GATE: Design Compliance Review
```

---

## Skills: What Each Must Output

### 1️⃣ ui-spec-writer

**MUST produce in SCR-XXX:**

```markdown
## Implementation Requirements

### Component Inventory
- [ ] List each screen component with @gf/ui mapping
- [ ] Props enumerated (label, placeholder, required, etc.)
- [ ] Validators listed (sync + async)
- [ ] States enumerated (normal, error, loading, etc.)
- [ ] Accessibility (aria-*, role) specified

### Handoff Instructions for Developers
- Framework: Angular 22
- Library: @gf/ui v1.1.0
- Standard: WCAG 2.2 AA (0 violations)
- Reference: GEN-XXX for visual verification
```

**Gate:** Do NOT hand off to stitch-ui-generator without Implementation Requirements section.

---

### 2️⃣ stitch-ui-generator

**MUST produce in GEN-XXX:**

```markdown
## Component Specifications for Developers

For each design:
- Exact props (label, type, required, validators)
- All states (normal, focused, error, etc.)
- Validation behavior (real-time, on-blur, etc.)
- Accessibility (aria-attributes, keyboard nav)
- Error messages (exact text from design)

## Implementation Checklist (Auto-generated)

- [ ] Component: text-input (nombres)
  - Props: label, placeholder, aria-required
  - Validators: required, minLength(2)
  - States: normal, error
  - Verify against screenshot
- [ ] [repeat for each component]

## Handoff Contract (BINDING)

ALL components listed above MUST be implemented.
NO SUBSTITUTIONS without UX approval.
```

**Gate:** Do NOT hand off without Component Specs + Implementation Checklist + Contract.

---

### 3️⃣ development-handoff-builder

**MUST validate inputs (BLOCKING):**

```markdown
## Pre-DCP Gate

IF this is a UI feature:
  REQUIRE: SCR-XXX (from ui-spec-writer)
  REQUIRE: GEN-XXX (from stitch-ui-generator)
  
IF MISSING → Status: BLOCKED
Message: "Cannot create DCP without design specs.
  Require UX to complete SCR + GEN first."

## Output: DCP with Implementation Contract

Include section:

### Implementation Contract (BINDING)

**Components to Implement (extracted from GEN-XXX):**

| Component | Library | Type | States | Validators |
|-----------|---------|------|--------|------------|
| nombres | @gf/ui | text-input | normal, error | required, minLength |

**No Substitutions Rule:**
- CANNOT replace components without UX approval
- CANNOT skip states
- CANNOT omit validators
- CANNOT change accessibility attributes

**Next Step:** Pass DCP to writing-plans with this contract.
```

**Gate:** Status READY_FOR_DEV ONLY if Implementation Contract complete.

---

### 4️⃣ writing-plans (Superpowers)

**MUST consume DCP:**

```markdown
## Pre-Plan Gate

REQUIRE: DCP from development-handoff-builder

Extract from DCP:
- Component Inventory
- Implementation Contract
- Design references (GEN-XXX)

## Plan Structure: Design-Aligned

Each task maps to 1+ components:

### Task N: Create text-input (nombres)

**Design Reference:** GEN-015-02

**Components to Implement:**
- text-input (nombres) from GEN-015-02

**Acceptance Criteria (from DCP):**
- [ ] Renders with label, placeholder
- [ ] Validates: required, minLength(2)
- [ ] Shows states: normal, error
- [ ] Accessible: aria-required, aria-invalid

**Visual Verification:**
  Post-code: verify UI matches GEN-015-02 screenshot
```

**Gate:** Do NOT write PLAN without DCP. Do NOT plan components without design backing.

---

### 5️⃣ executing-plans (Superpowers)

**NEW gate: Design Compliance Review**

After implementer reports DONE:

```markdown
## Pre-Review: Design Compliance Check

Review MUST verify:

1. **UI Matches Design:**
   - [ ] Open GEN-XXX screenshot
   - [ ] Open running app at component
   - [ ] Visual match? (colors, spacing, states)

2. **Component Inventory Complete:**
   - [ ] All components in DCP Inventory implemented?
   - [ ] All props present?
   - [ ] All states working?

3. **Validators Working:**
   - [ ] Sync validators (required, minLength, etc.)?
   - [ ] Async validators (duplicate-check, etc.)?
   - [ ] Error messages display correctly?

4. **Accessibility (WCAG 2.2 AA):**
   - [ ] aria-required, aria-invalid, aria-label present?
   - [ ] Keyboard nav working (Tab, Arrow keys)?
   - [ ] Focus visible (2px outline)?
   - [ ] Axe/WAVE test passing?

If ANY fail:
  → DO NOT APPROVE
  → List findings to implementer
  → Requires fix + re-review

Gate: Code review BLOCKS merge if UI doesn't match GEN-XXX
```

---

## Checklist: Before Starting Any Feature

### For UX Team

- [ ] **SCR-015 written** with Implementation Requirements section
- [ ] **GEN-015 written** with Component Specs + Checklist
- [ ] **Review:** Every component in GEN has props/validators/states enumerated
- [ ] **Handoff:** Pass SCR + GEN to development-handoff-builder with note:
  ```
  "SCR-015 and GEN-015 ready. Both include Implementation Requirements.
   Ready for DCP creation."
  ```

### For development-handoff-builder

- [ ] **Gate check:** SCR + GEN present? (BLOCK if missing)
- [ ] **Extract:** Component Inventory from GEN
- [ ] **Create:** DCP with Implementation Contract section
- [ ] **Status:** READY_FOR_DEV only if Contract complete
- [ ] **Handoff:** Pass DCP to writing-plans with note:
  ```
  "DCP-015 ready. Implementation Contract binding.
   No component deviations without UX approval."
  ```

### For writing-plans

- [ ] **Input:** DCP with Implementation Contract
- [ ] **Mapping:** Each task maps to ≥1 component in inventory
- [ ] **Verification:** Each task references GEN-XXX for design
- [ ] **Acceptance:** Task AC references DCP requirements
- [ ] **Handoff:** Pass PLAN to implementer with note:
  ```
  "Each task includes design reference (GEN-XXX).
   Implementer MUST verify visual match post-code.
   No component substitutions."
  ```

### For implementer (developer)

- [ ] **Read:** GEN-XXX before coding (understand design intent)
- [ ] **Implement:** Each component per DCP Component Inventory
- [ ] **Verify:** Visual match to GEN-XXX screenshot
- [ ] **Test:** All states, validators, accessibility working
- [ ] **Report:** "Component rendered per GEN-XXX. Ready for review."

### For code-reviewer

- [ ] **Check:** UI visually matches GEN-XXX design
- [ ] **Verify:** All components in DCP Inventory implemented
- [ ] **Test:** States, validators, keyboard nav, WCAG 2.2 AA
- [ ] **Gate:** BLOCK merge if ANY deviation from design
- [ ] **Approval:** Only if UI matches design + all checklist items pass

---

## How to Avoid This in Future

### Rule 1: Design BEFORE Code

```
❌ WRONG:
  PLAN-015 written Sep 30 00:46
  SCR-015 written Oct 1 23:12 (after plan)

✅ RIGHT:
  UXR-015 written (requirements)
  FLW-015 written (flow)
  SCR-015 written (spec) ← BEFORE
  GEN-015 written (design) ← BEFORE
  DCP-015 created (binding contract) ← BEFORE
  PLAN-015 written (implementation)
```

### Rule 2: Every Spec Outputs "What Code Must Do"

```
❌ WRONG:
  GEN-015 says "Text input for names"
  (Implementer guesses: What validator? What error message? What aria-label?)

✅ RIGHT:
  GEN-015 says:
    Component: text-input (nombres)
    - Label: "Nombres *"
    - Placeholder: "ej. Juan Carlos"
    - Validators: required, minLength(2)
    - Error message: "Campo obligatorio" / "Mínimo 2 caracteres"
    - aria-required="true", aria-label="Nombres, campo obligatorio"
    (Implementer: "I know exactly what to build")
```

### Rule 3: Gates Between Each Phase

```
UX skills → GATE → development-handoff-builder
  "Does DCP have Implementation Contract? NO → BLOCKED"

development-handoff-builder → GATE → writing-plans
  "Does PLAN reference DCP components? NO → BLOCKED"

writing-plans → GATE → implementation
  "Does code match GEN-XXX? NO → BLOCKED"
```

---

## What to Do if Misalignment Happens Again

1. **Stop execution** - do not proceed to next phase
2. **Identify gap** - which skill output is missing/wrong?
3. **Trace back** - read the input that skill received
4. **Fix source** - correct the upstream skill output
5. **Re-run** downstream skill with corrected input
6. **Re-verify** before proceeding

Example:
```
PROBLEM: Code doesn't match GEN-015

TRACE BACK:
  Code Review → GEN-015 (implementer didn't read it)
  → GEN-015 (missing Component Specs section)
  → development-handoff-builder (didn't enforce GEN specs)
  
FIX:
  1. development-handoff-builder outputs implementation contract from GEN
  2. writing-plans requires DCP in input
  3. implementer reads GEN before coding
  4. reviewer verifies visual match to GEN
```

---

## Roles & Responsibilities

| Role | Responsibility | Gate |
|------|-----------------|------|
| **UX Designer** | Produce SCR + GEN with Implementation Sections | UI spec complete? |
| **development-handoff-builder** | Extract DCP + Contract from SCR/GEN | DCP has Implementation Contract? |
| **Architect (writing-plans)** | Map tasks to components in DCP | PLAN references design? |
| **Developer** | Implement per GEN-XXX design | UI matches screenshot? |
| **Reviewer** | Verify code matches design | All design requirements met? |

---

## Questions?

- **"What if design changes mid-implementation?"** → UX updates GEN + DCP, architect updates PLAN, developer adjusts code. All in sync.
- **"What if component doesn't exist in @gf/ui?"** → Add to @gf/ui first (or substitute with UX written approval). Update GEN + DCP + PLAN.
- **"What if developer thinks design is wrong?"** → Create GitHub issue, tag UX, do NOT deviate without approval.

---

**Effective Date:** 2026-10-01  
**Applies to:** All US-016+ features + future development

