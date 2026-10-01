# PLAN-016: Aplicar Alignment Gates a US-016 (Actualizar datos y contactos)

**Objetivo:** Demostrar el flujo mejorado UX → Dev con gates en cada fase.

**Entrada:** US-016 spec (knowledge-base/requirement/user-stories/US-016-actualizar-datos-y-contactos.md)

**Salida:** DCP-016 + PLAN-016 (ambos con design backing completo)

**Status:** PLAN (ready to execute)

---

## Workflow Mejorado (Con Gates)

```
Phase 1: UXR-016 (ux-requirements-analyzer)
  ↓
Phase 2: FLW-016 (user-flow-designer)
  ↓
Phase 3: SCR-016 (ui-spec-writer) + GATE-01: Implementation Section?
  ↓
Phase 4: GEN-016 (stitch-ui-generator) + GATE-02: Component Specs?
  ↓
Phase 5: Handoff Pack (ux-development-handoff)
  ↓
Phase 6: DCP-016 (development-handoff-builder) + GATE-03: Implementation Contract?
  ↓
Phase 7: PLAN-016 (writing-plans) + GATE-04: Design References?
```

---

## Phase 1: ux-requirements-analyzer → UXR-016

**Task 1: Analyze UX Requirements**

- [ ] Input: US-016 spec
- [ ] Extract: User stories, actors, AC, dependencies
- [ ] Output: UXR-016.md (requirements with open questions)
- [ ] Location: knowledge-base/design/ux-requirements/UXR-016-actualizar-datos-y-contactos.md

**Expected Output:**
- Structured requirements
- Actors: Jefe de Ingeniería, Colaborador
- Two flows: Admin-edit (full data) vs Self-edit (profiles + phone only)
- AC-1 to AC-4 elaborated

---

## Phase 2: user-flow-designer → FLW-016

**Task 2: Design User Flows**

- [ ] Input: UXR-016.md
- [ ] Create: Happy path (edit nombres → submit → confirm)
- [ ] Create: Exception paths (duplicate email, invalid phone, unsaved changes)
- [ ] Create: Two variants (Jefe vs Colaborador)
- [ ] Output: FLW-016.md

**Expected Output:**
- Flow 1: Jefe editing all fields
- Flow 2: Colaborador editing only profiles + phone
- States: loading, success, error
- Permissions checks

---

## Phase 3: ui-spec-writer → SCR-016

**Task 3: Create Screen Specification (WITH IMPLEMENTATION REQUIREMENTS)**

- [ ] Input: FLW-016.md, Design System
- [ ] Create: 3 screens
  - SCR-016-01: Edit Datos (nombres, apellidos, etc.)
  - SCR-016-02: Edit Contactos (correo, teléfono)
  - SCR-016-03: Edit Perfiles Profesionales (self-service)
- [ ] **GATE-01:** Include Implementation Requirements section
  - Component Inventory (text-input, email-input, url-input, button, etc.)
  - Props enumerated (label, placeholder, required, validators)
  - Validators (required, email format, URL format, minLength, etc.)
  - States (normal, filled, error, loading, success)
  - Accessibility (aria-*, role, keyboard)
- [ ] Output: SCR-016.md

**Gate Check:**
```
MUST HAVE in SCR-016:
✓ Implementation Requirements section
✓ Component Inventory table (for each screen)
✓ Handoff Instructions for Developers
✓ Ready to hand to stitch-ui-generator
```

---

## Phase 4: stitch-ui-generator → GEN-016

**Task 4: Generate Stitch Design (WITH COMPONENT SPECS)**

- [ ] Input: SCR-016.md, Design System
- [ ] Create: Visual designs in Stitch for 3 screens
- [ ] **GATE-02:** Include Component Specifications for Developers
  - For each component: exact props, validators, states, error messages
  - Implementation checklist per component
  - **Binding handoff contract** (no substitutions)
- [ ] Output: GEN-016.md

**Gate Check:**
```
MUST HAVE in GEN-016:
✓ Component Specifications (detailed for each)
✓ Implementation Checklist (per component)
✓ Handoff Contract (binding, no substitutions)
✓ Cross-references to SCR-016
✓ Ready to hand to development-handoff-builder
```

---

## Phase 5: ux-development-handoff → Handoff Pack

**Task 5: Prepare Handoff Pack**

- [ ] Input: UXR-016, FLW-016, SCR-016, GEN-016
- [ ] Extract: Component Inventory + Implementation Requirements
- [ ] Create: Handoff instructions for development-handoff-builder
- [ ] Output: Handoff Pack with traceability

---

## Phase 6: development-handoff-builder → DCP-016

**Task 6: Create Development Context Pack (WITH IMPLEMENTATION CONTRACT)**

**Pre-DCP Gate Check:**
```
VALIDATE:
✓ SCR-016 exists? (BLOCK if not)
✓ GEN-016 exists? (BLOCK if not)
✓ Component Inventory extracted?

IF ANY FAIL → Status: BLOCKED
Message: "SCR-016 or GEN-016 missing. Cannot create DCP without design backing."
```

**If Gate Passes:**
- [ ] Extract Component Inventory from GEN-016
- [ ] **GATE-03:** Generate Implementation Contract
  - List all components (text-input, email-input, button, etc.)
  - Props, validators, states for each
  - **NO SUBSTITUTIONS** rule (explicit)
  - Verification workflow (visual match, A11y test)
- [ ] Output: DCP-016.md with Implementation Contract

**Gate Check:**
```
MUST HAVE in DCP-016:
✓ Acknowledgment: "Based on GEN-016 design specs"
✓ Component Inventory (extracted from design)
✓ Implementation Contract (BINDING)
✓ No deviations clause
✓ Status: READY_FOR_DEV (only if contract complete)
```

---

## Phase 7: writing-plans → PLAN-016

**Task 7: Write Implementation Plan (DESIGN-ALIGNED)**

**Pre-Plan Gate:**
```
REQUIRE:
✓ DCP-016 with Implementation Contract

EXTRACT:
✓ Component Inventory
✓ Design references (GEN-016)

IF DCP MISSING → STOP
Message: "Cannot write PLAN without DCP. 
  development-handoff-builder must create DCP-016 first."
```

**If Gate Passes:**
- [ ] Map each task to 1+ components in DCP Inventory
- [ ] **GATE-04:** Each task must reference GEN-016 section
  - Task 1: Create text-input (nombres) per GEN-016-01
  - Task 2: Create email-input (correo) per GEN-016-02
  - Task N: [component] per GEN-016-XX
- [ ] Include visual verification step in each task
- [ ] Output: PLAN-016.md with design references

**Gate Check:**
```
MUST HAVE in PLAN-016:
✓ "Based on DCP-016 Implementation Contract"
✓ Each task references GEN-016 section
✓ Each task AC includes "Verify visual match to GEN-016"
✓ Component substitutions forbidden (noted)
✓ Ready for implementation
```

---

## Execution Checklist

- [ ] **Phase 1:** UXR-016 complete → commit
- [ ] **GATE-01:** SCR-016 has Implementation Requirements → commit
- [ ] **GATE-02:** GEN-016 has Component Specs → commit
- [ ] **GATE-03:** DCP-016 has Implementation Contract → commit
- [ ] **GATE-04:** PLAN-016 references design → commit
- [ ] **Integration Test:** Open GEN-016, open PLAN-016, verify each task references design
- [ ] **Final:** All phases complete, all gates passed, DCP + PLAN ready for implementation

---

## Success Criteria

✅ UXR-016 → FLW-016 → SCR-016 → GEN-016 → DCP-016 → PLAN-016 (complete chain)
✅ Every gate passed (no skipped)
✅ Component Inventory binding (no substitutions allowed)
✅ Design-to-code traceability end-to-end
✅ Ready to demonstrate design-aligned execution vs US-015

---

## Notes

- This plan demonstrates the improved workflow with gates
- Each phase output must satisfy gate before proceeding
- If any gate fails → stop and correct upstream phase
- Goal: Show that design → code alignment is achievable
- Future features (US-017+) should follow this template

