# SDD Ledger — PLAN-016: Actualizar datos y medios de contacto

**Plan file:** knowledge-base/implementation/DCP-016-complete-pack.md  
**Spec file:** knowledge-base/implementation/PLAN-016-aplicar-alignment-gates.md  
**Started:** 2026-10-01T00:00:00-05:00  
**Execution method:** subagent-driven (batched: Tasks 1-3, 4-6, 7-8 in parallel)

## Pre-Flight Scan (CLEAN)

### Dependency Analysis
- **Batch A (Tasks 1-3: Components)** → Independent, no dependencies
  - Task 1: text-input components (nombres, apellidos, nombrePreferido)
  - Task 2: email-input with async validators (uniqueActive)
  - Task 3: tel-input + select components
  - Output: 4 component files (.ts) exported via @gf/ui
  
- **Batch B (Tasks 4-6: Forms)** → Depends on Batch A (uses components)
  - Task 4: Jefe-Datos form (uses text-input from Task 1)
  - Task 5: Jefe-Contactos form (uses email-input, tel-input)
  - Task 6: Colaborador-Perfiles form (uses select, tel-input, profile list)
  - Output: 3 form pages (.ts) with vigencia logic
  
- **Batch C (Tasks 7-8: Tests)** → Depends on Batch B (tests the forms)
  - Task 7: AC-016 unit tests (80%+ coverage)
  - Task 8: Cypress E2E tests (100% happy paths)
  - Output: 2 test suites passing, ready for merge

### Interface Consistency (OK)
- All components use @gf/ui v1.1.0 (no Material substitutes)
- All async validators: debounce 300ms, timeout 5s ✓
- Vigencia logic consistent across Tasks 4-6 ✓
- Permission checks (Jefe vs Colaborador) explicit ✓
- WCAG 2.2 AA mandatory across all ✓

### File Overlaps (OK - No Conflicts)
- Batch A components: separate files (text-input.ts, email-input.ts, etc.)
- Batch B forms: separate pages (party-edit-datos.page.ts, etc.)
- Batch C tests: separate suites (register.spec.ts, cypress/e2e/)
- No cross-edits between batches

### Scan Result: ✅ CLEAN

No conflicts found. Ready to dispatch Batch A, B, C in parallel.

---

## Batched Execution Plan

### Batch A: Components (Tasks 1-3)
- Model: haiku (mechanical, complete specs)
- Dispatch: Single subagent handles all 3 tasks
- Output: 4 component files + unit tests per component
- Gate: All components exported, no Material substitutes

### Batch B: Forms (Tasks 4-6)
- Model: sonnet (integration, vigencia logic, permissions)
- Dispatch: Single subagent handles all 3 tasks
- Dependency: Waits for Batch A completion
- Output: 3 form pages with vigencia handling
- Gate: Forms use Batch A components, AC-016 criteria met

### Batch C: Tests (Tasks 7-8)
- Model: sonnet (test strategy, E2E coverage)
- Dispatch: Single subagent handles both tasks
- Dependency: Waits for Batch B completion
- Output: Full test suite (80% unit, 100% E2E happy paths)
- Gate: All tests green, coverage met

---

## Task Status

- [ ] Batch A (Tasks 1-3): Components — Pending dispatch
- [ ] Batch B (Tasks 4-6): Forms — Pending (waits for A)
- [ ] Batch C (Tasks 7-8): Tests — Pending (waits for B)
- [ ] Final Review — Pending (waits for C)

