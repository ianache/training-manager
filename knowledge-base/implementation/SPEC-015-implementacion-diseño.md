---
okf: google-okf-v0.2
artifact: SPEC-015
id: spec-015-implementacion-us-015
title: "SPEC-015 — Diseño de Implementación: Registrar un Colaborador (US-015)"
description: "Plan de diseño e implementación secuencial en 3 fases (6 semanas) para ejecutar DTC-015 con equipos, roles, criterios de éxito y riesgos definidos."
status: READY_FOR_PLANNING
human-reviewed: false
verified: false
generated:
  by: "brainstorming-skill/superpowers"
  at: "2026-10-01T00:00:00-05:00"
  version: "1.0.0"
sources:
  - id: dtc-015
    title: "DTC-015 — Development Context Pack"
    link: /knowledge-base/implementation/DTC-015-handoff-desarrollo.md
  - id: codebase-analysis-015
    title: "CODEBASE-ANALYSIS-015 — Alineación con codebase actual"
    link: /knowledge-base/implementation/CODEBASE-ANALYSIS-015-alineacion-arch-ui.md
  - id: arch-cmp-015
    title: "ARCH-CMP-015 — Arquitectura Shell + MicroUI + Command"
    link: /knowledge-base/design/architecture/ARCH-CMP-015-libreria-componentes-shell-microui.md
---

# SPEC-015 — Diseño de Implementación

## Resumen Ejecutivo

**Implementar US-015 (Registrar un colaborador) en 6 semanas usando estrategia SECUENCIAL PURO.**

- **3 fases:** @gf/ui (weeks 1-2) → shells+commands (weeks 3-4) → páginas+tests (weeks 5-6)
- **5 personas:** 2 frontend, 2 backend, 1 QA
- **Riesgos:** 9 identificados + mitigaciones
- **Go/No-Go:** AC-015 tests 100% + WCAG 2.2 AA + 80% coverage + staging soak 24h
- **Rollback:** revert branch + deploy previous main

---

## Parte 1: Timeline y Fases

### Phase 1: Extender @gf/ui (Weeks 1-2)

**Objetivo:** Publicar @gf/ui v1.1.0 con 8 atoms + 3 molecules.

**Deliverables:**

| Componente | Tipo | Implementar | Tests | Status |
|-----------|------|-------------|-------|--------|
| gf-text-input | Atom | input text/email/password | unit | 🔲 |
| gf-label | Atom | label + aria-required | unit | 🔲 |
| gf-error-message | Atom | role=alert + aria-live | unit | 🔲 |
| gf-icon | Atom | Material icon wrapper | unit | 🔲 |
| gf-date-input | Atom | date picker | unit | 🔲 |
| gf-select | Atom | dropdown select | unit | 🔲 |
| gf-form-field | Molecule | label + input + error + hint | unit | 🔲 |
| gf-autocomplete | Molecule | combobox async + debounce | unit | 🔲 |
| gf-radio-card | Molecule | radio + card styling | unit | 🔲 |

**Responsibilities:**
- **dev-fe-1 (80%):** Architecture, code review, NPM publish
- **dev-fe-2 (80%):** Implement atoms + molecules

**Exit Criteria:**
- ✅ 90% test coverage (unit tests)
- ✅ All components TypeScript error-free
- ✅ ARIA attributes correct (aria-required, aria-invalid, aria-live, role=)
- ✅ Focus visible (2px outline #0F52BA)
- ✅ @gf/ui v1.1.0 published to NPM
- ✅ Code review approved (2 reviewers)
- ✅ Git tag: `@gf/ui-v1.1.0`

**Tools:**
- Framework: Angular 22, Material Design 3
- Testing: Jasmine, Karma, @testing-library/angular
- Build: ng build @gf/ui
- Publish: npm publish (internal registry)

---

### Phase 2: Shells + Commands (Weeks 3-4)

**Objetivo:** Implementar contenedores (shells) y lógica de orquestación (commands) en mfe-collaborators.

**Deliverables:**

| Componente | Tipo | Responsable | Tests | Status |
|-----------|------|-------------|-------|--------|
| shell-form-step | Shell | dev-fe-2 | unit | 🔲 |
| shell-modal | Shell | dev-fe-2 | unit | 🔲 |
| RegisterCollaboratorCommand | Command | dev-be-2 | unit | 🔲 |
| SearchUnitsCommand | Command | dev-be-2 | unit | 🔲 |
| SearchRolesCommand | Command | dev-be-2 | unit | 🔲 |
| SearchProvidersCommand | Command | dev-be-2 | unit | 🔲 |
| SearchManagersCommand | Command | dev-be-2 | unit | 🔲 |
| duplicate-id.validator | Validator | dev-be-2 | unit | 🔲 |
| duplicate-email.validator | Validator | dev-be-2 | unit | 🔲 |
| Module Federation config | Config | dev-fe-2 | manual | 🔲 |
| Error mapper (E1-E11) | Service | dev-be-2 | unit | 🔲 |

**Responsibilities:**
- **dev-fe-2 (80%):** Shells, Module Federation setup, @gf/ui integration
- **dev-be-2 (80%):** Commands, validators, error mapper
- **dev-be-1 (20%):** Review FastAPI validators alignment
- **qa-1 (20%):** Prepare AC-015 test plan (JIRA, test data setup)

**Exit Criteria:**
- ✅ shell-form-step renders (multi-step, progress bar, action buttons)
- ✅ shell-modal renders (dialog overlay, close button)
- ✅ RegisterCollaboratorCommand.execute() works with mocked API
- ✅ Async validators (duplicate-id, duplicate-email) debounce 300ms
- ✅ Error mapper maps E1-E11 correctly
- ✅ Module Federation: @gf/ui shared between shell and mfe-collaborators
- ✅ 80% test coverage (unit tests, mocked API)
- ✅ Code review approved (2 reviewers)

**Tools:**
- Framework: Angular 22, Express.js (BFF for search endpoints)
- Testing: Jasmine, Karma, jasmine.spyOn (mocking)
- Build: ng build mfe-collaborators
- Observable pattern: RxJS (switchMap, debounceTime, tap, catchError)

---

### Phase 3: Pages + Tests (Weeks 5-6)

**Objetivo:** Implementar 9 páginas, tests (unit + integration + E2E), accesibilidad.

**Deliverables:**

| Página | Paso | Responsable | Tests | Status |
|--------|------|-------------|-------|--------|
| register-collaborator.page | Container (multi-step) | dev-fe-1/2 | unit + integration | 🔲 |
| step-type | 1: Empleado/Contratista | dev-fe-2 | unit | 🔲 |
| step-person-data | 2: Nombres, apellidos | dev-fe-2 | unit | 🔲 |
| step-identification | 3: Tipo ID, número, país | dev-fe-2 | unit | 🔲 |
| step-contact | 4: Correo laboral | dev-fe-2 | unit | 🔲 |
| step-organization | 5: Unidad/Proveedor/Jefe | dev-fe-2 | unit | 🔲 |
| step-role | 6: Rol-Nivel + fecha | dev-fe-2 | unit | 🔲 |
| step-review | 7: Confirmación (summary) | dev-fe-2 | unit | 🔲 |
| step-success | 8: Éxito + GUID + acciones | dev-fe-2 | unit | 🔲 |

**Tests:**

| Test Tipo | Scope | Owner | Criterios | Status |
|-----------|-------|-------|-----------|--------|
| Unit | Form controls, validators, error states | dev-fe-1/2 | 80% coverage | 🔲 |
| Integration | Happy path empleado + contratista | dev-fe-2 | AC-015 test cases | 🔲 |
| E2E | Cypress smoke tests (2 scenarios) | qa-1 | Page load + form submit | 🔲 |
| A11y | WCAG 2.2 AA | qa-1 | axe + WAVE + NVDA/JAWS | 🔲 |
| Regresión | US-016, US-017, US-018, US-001 no roto | qa-1 | Smoke tests otras US | 🔲 |

**Responsibilities:**
- **dev-fe-1 (80%):** Lead pages, Reactive Forms, async validators integration
- **dev-fe-2 (80%):** Implement 9 pages, form logic, navigation
- **qa-1 (80%):** AC-015 tests, E2E, A11y audit, regresión
- **dev-be-1/2 (20%):** Support bugs, API contract verification

**Exit Criteria:**
- ✅ All 9 pages implemented and navigable
- ✅ Reactive Forms working (FormGroup, validators, async validators)
- ✅ AC-015 all test cases green (100%)
- ✅ Cypress smoke tests green (empleado + contratista)
- ✅ WCAG 2.2 AA: 0 violations (axe + WAVE + manual NVDA/JAWS)
- ✅ 80%+ test coverage (unit + integration)
- ✅ No regressions in other user stories (US-016, US-017, US-018, US-001)
- ✅ Code review approved (2 reviewers)
- ✅ Staging soak test 24h (0 errors, < 5% increase in error rate)

**Tools:**
- Framework: Angular 22, Reactive Forms, RxJS
- Testing: Jasmine, Karma (unit), Cypress (E2E), axe (a11y)
- A11y tools: axe DevTools, WAVE, NVDA/JAWS (manual)

---

## Parte 2: Roles y Equipo

### Organización (5 personas)

```
Frontend Team (2):
  └─ dev-fe-1: Frontend Architect (Phase 1 lead, Phase 3 support)
  └─ dev-fe-2: Frontend Developer (Phase 1 atoms, Phase 2 shells, Phase 3 pages)

Backend Team (2):
  └─ dev-be-1: Backend Lead (FastAPI, validator review)
  └─ dev-be-2: Backend Developer (Commands, validators, search endpoints)

QA Team (1):
  └─ qa-1: QA Lead (test planning, execution, a11y audit)
```

### Responsabilidades por Rol y Fase

**dev-fe-1 (Frontend Architect):**
- Phase 1: Design @gf/ui architecture, implement half atoms, review PR, publish NPM
- Phase 2: 20% review shells implementation
- Phase 3: 80% lead pages implementation, Reactive Forms architecture
- Phase 6.5: Support bugs, final code review

**dev-fe-2 (Frontend Developer):**
- Phase 1: 80% implement atoms + molecules
- Phase 2: 80% implement shells, Module Federation config
- Phase 3: 80% implement 9 pages, form logic
- Phase 6.5: Fix bugs, integrate feedback

**dev-be-1 (Backend Lead):**
- Phase 1: —
- Phase 2: 20% verify FastAPI validators (E5-E10), review command implementations
- Phase 3: 20% verify API contracts, support bugs
- Phase 6.5: Production support

**dev-be-2 (Backend Developer):**
- Phase 1: —
- Phase 2: 80% implement RegisterCollaboratorCommand, SearchCommands, async validators
- Phase 3: 20% verify BFF endpoints work correctly
- Phase 6.5: Support bugs

**qa-1 (QA Lead):**
- Phase 1: —
- Phase 2: 20% prepare AC-015 test cases in JIRA, setup test data
- Phase 3: 80% execute AC-015 tests, E2E Cypress tests, A11y audit
- Phase 6.5: 100% regression testing, sign-off

---

## Parte 3: Criterios de Éxito

### Phase 1 Exit Criteria (@gf/ui)

**Code Quality:**
- ✅ 8 atoms: text-input, label, error-message, icon, date-input, select
- ✅ 3 molecules: form-field, autocomplete, radio-card
- ✅ 90% test coverage (unit tests with Jasmine/Karma)
- ✅ 0 TypeScript errors
- ✅ ARIA correct: aria-required, aria-invalid, aria-live, role=
- ✅ Focus visible: 2px outline #0F52BA

**Publishing:**
- ✅ @gf/ui v1.1.0 published to NPM
- ✅ public-api.ts exports all atoms + molecules
- ✅ npm install @gf/ui@latest works in mfe-collaborators

**Verification:**
- ✅ 2 code reviewers approved
- ✅ Git tag: `@gf/ui-v1.1.0`
- ✅ CI/CD pipeline green (build, test, lint)

---

### Phase 2 Exit Criteria (Shells + Commands)

**Architecture:**
- ✅ Module Federation: shell ↔ mfe-collaborators sharing @gf/ui + @gf/core
- ✅ shell-form-step: renders multi-step container, progress bar, action buttons
- ✅ shell-modal: renders dialog overlay with backdrop + close button

**Commands:**
- ✅ RegisterCollaboratorCommand.execute() → mocked API response
- ✅ SearchUnitsCommand, SearchRolesCommand, SearchProvidersCommand, SearchManagersCommand
- ✅ Async validators: duplicate-id, duplicate-email (debounce 300ms)
- ✅ Error mapper: E1-E11 mapped to AppError

**Testing:**
- ✅ Unit tests: commands, validators (80% coverage)
- ✅ No E2E yet (mocked data)
- ✅ Mock strategy: jasmine.spyOn, of() observables

**Verification:**
- ✅ 2 code reviewers approved
- ✅ `ng serve mfe-collaborators` without errors
- ✅ Shells render correctly (visual inspection)
- ✅ Commands execute without crashes (mocked data)

---

### Phase 3 Exit Criteria (Pages + Tests)

**Functionality:**
- ✅ All 9 pages implemented (type → data → ID → email → org → role → review → success)
- ✅ Reactive Forms working (FormGroup, validators, async validators)
- ✅ Error handling E1-E11 (errors mapped to UX)
- ✅ Success page: GUID visible, [Copiar] button working
- ✅ Navigation: next/previous/submit buttons working

**Testing (AC-015):**
- ✅ Unit tests: 80%+ coverage (form controls, validators, error states)
- ✅ Integration tests: happy path empleado + contratista
- ✅ E2E smoke tests: Cypress (2 scenarios, both green)
- ✅ Casos límite: ID duplicada (E5), correo duplicado (E6), sin permisos (E1)

**Accessibility (WCAG 2.2 AA):**
- ✅ Keyboard navigation: Tab/Shift+Tab, Enter, Space, Escape
- ✅ Focus visible: outline 2px en todos inputs
- ✅ Contrast: 4.5:1 (text/bg), 3:1 (graphics)
- ✅ ARIA labels: aria-required, aria-invalid, aria-live, role=alert/status
- ✅ Manual screenreader: NVDA/JAWS lecturas correctas

**Verification:**
- ✅ AC-015 tests: 100% green
- ✅ Cypress smoke tests: 100% green
- ✅ axe accessibility report: 0 violations
- ✅ 2 code reviewers approved
- ✅ Staging soak test: 24h, no errors, < 5% error rate increase

---

## Parte 4: Testing Strategy

### Por Fase

**Phase 1:**
- Unit tests: componentes aislados (Jasmine/Karma)
- Coverage: 90%
- No integration tests (atoms + molecules puramente presentacionales)

**Phase 2:**
- Unit tests: commands mock API, validators mock service
- Coverage: 80% (commands críticos)
- No E2E (shells sin datos reales)

**Phase 3:**
- Unit tests: form controls, async validators (mocked API)
- Integration tests: happy path empleado + contratista
- E2E smoke tests: Cypress (2 scenarios)
- A11y audit: axe, WAVE, NVDA/JAWS (manual)
- Coverage: 80%+

### Go/No-Go Criteria (Before Production)

**MUST-PASS:**
- ✅ AC-015 all tests green (100%)
- ✅ Cypress smoke tests green (2 scenarios)
- ✅ WCAG 2.2 AA: 0 violations
- ✅ Code coverage: 80%+ (Phase 3)
- ✅ No critical bugs in staging (24h soak)
- ✅ Performance: page load < 3s, POST response < 2s

**If ANY FAIL:** → stay in staging, fix, re-test

---

## Parte 5: Rollout y Rollback

### Rollout Strategy

```
Phase 1 (Week 2 end):
  @gf/ui v1.1.0 → NPM published
  mfe-collaborators can npm install
  (No production release)

Phase 2 (Week 4 end):
  feature/us-015-register-collaborator branch
  Module Federation working in DEV
  (No production release)

Phase 3 (Week 6 end):
  PR: us-015-register-collaborator → code review → merge to main
  CI/CD: build, test, deploy to staging
  Staging smoke tests (manual verification)
  → Deploy to production (blue-green or canary)
  → Monitor 24h (error rates, performance)
```

### Rollback Plan

**If bug in Phase 1 (@gf/ui):** 
- Patch @gf/ui v1.1.1 → npm publish → mfe-collaborators npm update

**If bug in Phase 2 (shells):**
- Revert feature branch → deploy previous main

**If bug in Phase 3 (pages):**
- Revert feature branch → deploy previous main
- OR hotfix branch (if < 2h fix)

### Observability

- Error tracking: Sentry (capture E1-E11)
- Performance: Web Vitals (LCP, CLS, FID)
- Logs: X-Request-ID header (end-to-end traceability)
- Runbook: Escalation if error rate > 5%

---

## Parte 6: Riesgos y Mitigación

| # | Riesgo | Prob. | Impacto | Mitigación |
|---|--------|-------|--------|-----------|
| 1 | Phase 1 (@gf/ui) bloqueador | Media | Alto | Start early, dev-fe-1 firefighter, anticipate issues |
| 2 | Module Federation version conflicts | Media | Alto | singleton: true, strictVersion: true, test in DEV first |
| 3 | Async validator timeout en prod | Baja | Medio | Debounce 300ms + 5s timeout, load test before prod |
| 4 | E1 guard (Jefe-Ingenieria) falla | Baja | Alto | Test guard Phase 2, verify con QA en staging |
| 5 | E5/E6 validators no funcionan en backend | Baja | Alto | Verify FastAPI Phase 2, integration test con BD real |
| 6 | Form state loss en navegación | Baja | Medio | Guardar FormGroup en sessionStorage, test navegación |
| 7 | A11y violation late-found | Baja | Medio | Audit week 6, no esperar end of Phase 3 |
| 8 | Bundle size aumenta | Media | Bajo | Monitor @gf/ui size, lazy-load si > 100KB |
| 9 | Equipo no disponible | Baja | Alto | Identify backup por rol, cross-training week 1 |

### Escalation Path

- Phase 1 blocker → dev-fe-1 full-time
- Phase 2 blocker → dev-be-2 + dev-fe-2 pair programming
- Phase 3 blocker → qa-1 stops other work, supports Phase 3

---

## Parte 7: Decisiones Clave

✅ **Secuencial puro** (no paralelización) → riesgo bajo  
✅ **Phase 1 bloqueador** (@gf/ui publish antes Phase 2)  
✅ **Module Federation** (compartir @gf/ui) → reutilización cross-MFE  
✅ **Async validators** (debounce 300ms) → real-time sin overload  
✅ **Commands pattern** → testeable sin UI  
✅ **AC-015 tests como done** → verificable  
✅ **WCAG 2.2 AA mandatory** → no opcional  
✅ **Rollback: revert branch** → simple y confiable  

---

## Próximos Pasos

1. ✅ SPEC-015 escrito
2. 👉 Self-review (verificar placeholders, contradicciones, ambigüedad)
3. 👉 User reviews spec
4. 👉 Invocar writing-plans skill (plan ejecutable detallado)
