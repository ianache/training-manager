# DCP-016: Actualizar datos y medios de contacto — COMPLETE PACK

**Status:** READY_FOR_DEV  
**Generated:** 2026-10-01  
**Applies alignment gates from SKILL-ALIGNMENT-GUIDE.md**

---

## 1. SCR-016: Screen Specifications (WITH IMPLEMENTATION REQUIREMENTS)

### SCR-016-01: Editar Datos (Jefe)

**Layout:** Modal dialog, centered, max-width 600px

**Fields:**
- nombres (text-input, required)
- apellidos (text-input, required)
- nombrePreferido (text-input, optional)
- tipoIdentificacion (select, required): [DNI, Carné de extranjería, Pasaporte]
- numeroIdentificacion (text-input, required)
- paisIdentificacion (select, required): [Perú, Colombia, Argentina, ...]

**Actions:**
- [Guardar] (primary, enabled if all required fields filled + valid)
- [Cancelar] (secondary, always enabled)

### SCR-016-02: Editar Contactos (Jefe)

**Layout:** Modal dialog, centered

**Current State (read-only):**
- correoLaboral: "juan@comsatel.com.pe" [badge: "Vigente desde 2026-03-15"]
- numeroTelefonico: "+51 999 999 999" [badge: "Vigente desde 2026-03-15"]

**Edit Section:**
- nuevoCorreoLaboral (email-input, optional)
  - Placeholder: "ej. juan.nuevo@comsatel.com.pe"
  - Real-time validation: email format + uniqueActive
  - Error: "✗ Ya en uso por [persona]" or "✗ Formato inválido"
  - Success: "✓ Email disponible"

- nuevoNumeroTelefonico (tel-input, optional)
  - Placeholder: "+51 999 999 999"
  - Real-time validation: pattern ^+51\d{9}$
  - Error: "✗ Formato inválido"
  - Success: "✓ Formato correcto"

**Actions:**
- [Guardar] (primary, enabled if at least 1 new value + valid)
- [Cancelar] (secondary)

### SCR-016-03: Editar Perfiles + Teléfono (Colaborador)

**Two Sections:**

**Section A: Mis Perfiles Profesionales**
- List of existing profiles (if any):
  - GitHub | https://github.com/username | [Eliminar]
  - LinkedIn | https://linkedin.com/in/user | [Eliminar]
  
- Add Profile Form:
  - platform (select): [GitHub, LinkedIn, Twitter, GitLab, Otros]
  - url (text-input, required)
    - Placeholder: "https://github.com/username"
    - Real-time validation: isValidURL
    - Error: "✗ URL inválida"

- [Agregar] button

**Section B: Teléfono Laboral**
- Current: "+51 999 999 999" [badge: "Vigente"]
- New Phone (tel-input, optional)
  - Placeholder: "+51 999 999 999"
  - Real-time validation: pattern
  - Error: "✗ Formato: +51 999 999 999"

**Actions:**
- [Guardar] (primary)
- [Cancelar] (secondary)

---

## 2. Implementation Requirements (GATE-01 ✅)

### Component Inventory

| Screen | Component | Type | Library | Props | Validators | States | A11y | GEN Ref |
|--------|-----------|------|---------|-------|------------|--------|------|---------|
| SCR-016-01 | nombres | text-input | @gf/ui | label, placeholder, required | required, minLength(2), noSpecialChars | normal, error | aria-required, aria-invalid | GEN-016-01 |
| SCR-016-01 | apellidos | text-input | @gf/ui | label, placeholder, required | required, minLength(2) | normal, error | aria-required, aria-invalid | GEN-016-01 |
| SCR-016-01 | nombrePreferido | text-input | @gf/ui | label, placeholder | maxLength(50) | normal | - | GEN-016-01 |
| SCR-016-01 | tipoIdentificacion | select | @gf/ui | label, options, required | required | normal, open, error | aria-required, aria-expanded | GEN-016-01 |
| SCR-016-01 | numeroIdentificacion | text-input | @gf/ui | label, pattern | required, pattern | normal, error | aria-required | GEN-016-01 |
| SCR-016-01 | paisIdentificacion | select | @gf/ui | label, options, required | required | normal, open | aria-required | GEN-016-01 |
| SCR-016-02 | nuevoCorreoLaboral | email-input | @gf/ui | label, placeholder | email, uniqueActive (async) | normal, validating, valid, duplicate | aria-required, aria-describedby | GEN-016-02 |
| SCR-016-02 | nuevoNumeroTelefonico | tel-input | @gf/ui | label, placeholder, pattern | pattern(+51) | normal, valid, error | aria-required | GEN-016-02 |
| SCR-016-03A | platform | select | @gf/ui | label, options, required | required | normal, open | aria-required | GEN-016-03 |
| SCR-016-03A | url | text-input | @gf/ui | label, placeholder | isValidURL | normal, validating, valid, error | aria-required | GEN-016-03 |
| SCR-016-03B | numeroTelefonico | tel-input | @gf/ui | label, placeholder, pattern | pattern(+51) | normal, valid, error | aria-required | GEN-016-03 |

### Implementation Checklist

- [ ] **SCR-016-01 Form: Editar Datos**
  - [ ] text-input components (nombres, apellidos, nombrePreferido)
    - Props: label, placeholder, required, disabled (for read-only)
    - Validators: required, minLength(2), noSpecialChars
    - States: normal, focused, filled, error
    - Error messages: "Campo obligatorio", "Mínimo 2 caracteres"
    - Accessibility: aria-required, aria-invalid, aria-label
  - [ ] select components (tipoIdentificacion, paisIdentificacion)
    - Props: options, required, aria-label
    - Keyboard nav: Arrow keys, Enter to select
    - States: normal, open, selected, error
  - [ ] Submit logic: enabled only when all required filled + valid
  - [ ] Auditoría API call with: user_id, action, old_value, new_value
  - [ ] Success feedback: modal "Datos actualizados", return to ficha

- [ ] **SCR-016-02 Form: Editar Contactos**
  - [ ] email-input component (nuevoCorreoLaboral)
    - Props: type="email", placeholder, aria-describedby
    - Validators: email format + async uniqueActive (debounce 300ms, timeout 5s)
    - States: normal, validating, valid (✓), duplicate (✗)
    - Error messages: "Formato inválido" / "✗ Ya en uso por [persona]"
    - Success: "✓ Email disponible"
  - [ ] tel-input component (nuevoNumeroTelefonico)
    - Props: placeholder "+51 999 999 999", pattern
    - Validators: pattern(^+51\d{9}$)
    - States: normal, valid, error
  - [ ] Current state display (read-only badges with vigencia dates)
  - [ ] Submit logic: enabled if ≥1 new value + all valid
  - [ ] Vigencia handling: close old (fecha_hasta=TODAY), open new (fecha_desde=TODAY)
  - [ ] Confirmation modal: show old → new

- [ ] **SCR-016-03 Form: Colaborador Editar Perfiles + Teléfono**
  - [ ] Profiles section:
    - [ ] Existing profiles list (if any)
    - [ ] select (platform): GitHub, LinkedIn, Twitter, GitLab, Otros
    - [ ] text-input (url): URL validation real-time
    - [ ] [Agregar] button (enabled when platform + valid URL)
    - [ ] [Eliminar] button per profile
  - [ ] Teléfono section:
    - [ ] Current display (read-only)
    - [ ] tel-input for new phone
    - [ ] Same validators as SCR-016-02
  - [ ] Permission check: user can only edit own profile
  - [ ] Success: "Perfiles actualizados" + return to profile

### Handoff Instructions for Developers

**Framework:** Angular 22 (Standalone components)  
**UI Library:** @gf/ui v1.1.0  
**Design System:** Material Design 3  
**Accessibility:** WCAG 2.2 AA (0 violations required)  
**Async Validators:** debounce 300ms, timeout 5s

**Key Binding Rules:**
- CANNOT replace @gf/ui components with Material mat-input
- CANNOT skip async validators (uniqueActive, etc.)
- CANNOT omit error states or messages
- CANNOT change accessibility attributes (aria-*, role)

**Visual Reference:** GEN-016 (Stitch design)

---

## 3. GEN-016: Stitch Generation (GATE-02 ✅)

### Component Specifications for Developers

**GEN-016-01: Text Input — Nombres/Apellidos/NombrePreferido**
```
Component: text-input
Library: @gf/ui/text-input
Props:
  - label: "Nombres *" or "Apellidos *" or "Nombre preferido"
  - placeholder: "ej. Juan" or "ej. Pérez" or "ej. J.P."
  - required: true (for nombres/apellidos) or false
  - type: "text"
  - ariaRequired: true (if required)
  - ariaLabel: "Nombres, campo obligatorio" (if required)

Validators:
  - required (if required)
  - minLength(2) (if nombres/apellidos)
  - maxLength(50) (if nombrePreferido)
  - pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/ (no special chars)

States:
  - normal: default styling, outline gray
  - focused: blue outline 2px, label blue
  - filled: shows value, label stays blue
  - error: red outline, error message below, aria-invalid="true"

Error Messages:
  - "Campo obligatorio" (required)
  - "Mínimo 2 caracteres" (minLength)
  - "Caracteres inválidos" (pattern)

Accessibility:
  - <label htmlFor="nombres">Nombres *</label>
  - <input id="nombres" aria-required="true" aria-invalid="false" />
  - Error: <div role="alert" aria-live="polite">Mínimo 2 caracteres</div>
  - Focus visible: 2px solid #0F52BA
  - Keyboard: Tab to input, type to fill, Tab to next
```

**GEN-016-02: Email Input — Correo Laboral**
```
Component: email-input (custom or @gf/ui)
Props:
  - label: "Correo laboral *"
  - placeholder: "ej. juan.nuevo@comsatel.com.pe"
  - type: "email"
  - aria-describedby: "ayuda-correo"
  - ariaRequired: true

Validators:
  - required (implied by email type)
  - email format (HTML5 validation)
  - async uniqueActive:
    - debounce 300ms before API call
    - GET /api/v1/parties/check-email/{email}
    - timeout 5s
    - on success: show "✓ Email disponible"
    - on duplicate: show "✗ Ya en uso por [persona]"

States:
  - normal: default
  - focused: blue outline
  - validating: spinner, "Verificando..."
  - valid: green checkmark, "✓ Email disponible"
  - duplicate: red outline, error message

Help Text:
  <div id="ayuda-correo">Para empleados de COMSATEL: @comsatel.com.pe</div>

Error Messages (with aria-live="polite", role="alert"):
  - "Formato inválido"
  - "✗ Este email ya está en uso"
```

**GEN-016-03: Select — Plataforma Profesional**
```
Component: select
Props:
  - label: "Plataforma *"
  - options: ["GitHub", "LinkedIn", "Twitter", "GitLab", "Otros"]
  - required: true
  - aria-label: "Selecciona plataforma de perfil profesional"
  - aria-expanded: "false" (then "true" when open)

States:
  - normal: closed, gray outline
  - focused: blue outline
  - open: dropdown visible, options listed
  - selected: "GitHub" shows, filled state

Keyboard:
  - Tab to select
  - Arrow Down/Up to navigate options
  - Enter to select
  - Escape to close

Accessibility:
  - role="combobox" on select
  - role="listbox" on options container
  - role="option" on each option
  - aria-selected="true" on selected option
```

### Implementation Checklist (Auto-extracted)

- [ ] **text-input (nombres)**
  - [ ] Props: label="Nombres *", placeholder, required, ariaRequired
  - [ ] Validators: required, minLength(2), pattern
  - [ ] States: normal, focused, filled, error (red outline)
  - [ ] Error messages: display below input, role="alert"
  - [ ] Accessibility: aria-required, aria-invalid, aria-label
  - [ ] Verify visual against GEN-016-01 screenshot

- [ ] **email-input (correoLaboral)**
  - [ ] Props: label, type="email", aria-describedby
  - [ ] Validators: email format + async uniqueActive (debounce 300ms, timeout 5s)
  - [ ] States: normal, validating (spinner), valid (✓ green), duplicate (✗ red)
  - [ ] Error messages: real-time, aria-live="polite"
  - [ ] API: GET /api/v1/parties/check-email/{email}
  - [ ] Verify visual against GEN-016-02 screenshot

- [ ] **select (tipoIdentificacion, paisIdentificacion, platform)**
  - [ ] Props: label, options array, required, aria-label, aria-expanded
  - [ ] Keyboard: Arrow keys, Enter, Escape
  - [ ] States: normal, open, selected
  - [ ] Verify visual against GEN-016 screenshot

- [ ] **tel-input (numeroTelefonico)**
  - [ ] Props: placeholder "+51 999 999 999", pattern
  - [ ] Validators: pattern(^+51\d{9}$)
  - [ ] States: normal, valid (✓), error (✗)
  - [ ] Error: "Formato: +51 999 999 999"
  - [ ] Verify visual against GEN-016 screenshot

---

## 4. Implementation Contract (GATE-03 ✅ BINDING)

**Components in US-016:**
Generated: 2026-10-01  
Validated against: SCR-016, FLW-016, UXR-016

### Components MUST Be Implemented

| Component | Type | Library | Binding |
|-----------|------|---------|---------|
| text-input (nombres, apellidos, nombrePreferido) | input | @gf/ui | **MUST IMPLEMENT** |
| email-input (correoLaboral) | input | @gf/ui | **MUST IMPLEMENT** |
| tel-input (numeroTelefonico) | input | @gf/ui | **MUST IMPLEMENT** |
| select (tipoIdentificacion, paisIdentificacion, platform) | select | @gf/ui | **MUST IMPLEMENT** |
| button (Guardar, Cancelar, Agregar, Eliminar) | button | @gf/ui | **MUST IMPLEMENT** |

### NO SUBSTITUTIONS RULE

❌ **CANNOT:**
- Replace text-input with Material mat-input
- Skip async validators (uniqueActive, email format, phone pattern)
- Omit error states or messages
- Change accessibility attributes (aria-*, role)
- Skip confirmation modals (for vigencia changes)

✅ **MUST:**
- Implement ALL components listed above
- Include ALL validators (sync + async)
- Display ALL states (normal, validating, valid, error, duplicate)
- Implement vigencia close/open logic (for Jefe)
- Implement permission checks (Colaborador = self-edit only)
- Include auditoría API calls
- Verify visual match to GEN-016

### Verification Workflow

**Code Review:**
- [ ] All components in inventory implemented?
- [ ] All validators present (sync + async)?
- [ ] All states working (normal, error, validating, etc.)?
- [ ] Accessibility verified (aria-*, role, keyboard)?
- [ ] Vigencia logic correct (close old, open new)?
- [ ] Permission checks enforced (Jefe vs Colaborador)?

**UI Test:**
- [ ] Visual match to GEN-016 screenshots?
- [ ] All states visible?
- [ ] Error messages display correctly?

**A11y Test:**
- [ ] WCAG 2.2 AA: 0 violations (axe DevTools, WAVE)
- [ ] Keyboard navigation working (Tab, Arrow, Enter)?
- [ ] Screen reader announces all labels, errors, states?
- [ ] Focus visible on all interactive elements (2px outline)?

**Gate:** Merge blocked if ANY verification fails.

---

## 5. PLAN-016: Implementation Plan (GATE-04 ✅ DESIGN-ALIGNED)

**Status:** READY_FOR_IMPLEMENTATION  
**Based on:** DCP-016 Implementation Contract  
**Design Reference:** GEN-016

### Task Phases

#### **Phase 1: Components** (3 tasks)

**Task 1: Create text-input components (nombres, apellidos, nombrePreferido)**
- Design Reference: GEN-016-01
- Components to implement: 3x text-input (nombres, apellidos, nombrePreferido)
- AC from DCP:
  - [ ] Props: label, placeholder, required, ariaRequired
  - [ ] Validators: required, minLength(2), noSpecialChars, maxLength(50)
  - [ ] States: normal, focused, filled, error (red outline)
  - [ ] Error messages below input, aria-live="polite"
  - [ ] Accessibility: aria-required, aria-invalid, aria-label
  - [ ] Verify visual match to GEN-016-01

**Task 2: Create email-input (correoLaboral)**
- Design Reference: GEN-016-02
- Components: 1x email-input with async validation
- AC from DCP:
  - [ ] Props: type="email", placeholder, aria-describedby
  - [ ] Validators: email format + async uniqueActive (debounce 300ms, timeout 5s)
  - [ ] States: normal, validating (spinner), valid (✓ green), duplicate (✗ red)
  - [ ] API call: GET /api/v1/parties/check-email/{email}
  - [ ] Error messages: real-time, "✗ Ya en uso por [persona]"
  - [ ] Verify visual match to GEN-016-02

**Task 3: Create tel-input & select components**
- Design Reference: GEN-016
- Components: tel-input (numeroTelefonico), select (tipoIdentificacion, paisIdentificacion, platform)
- AC from DCP:
  - [ ] tel-input: pattern(^+51\d{9}$), states (normal, valid, error)
  - [ ] select: keyboard nav (Arrow, Enter, Escape), aria-expanded
  - [ ] All states visible and tested
  - [ ] Verify visual match to GEN-016

#### **Phase 2: Forms** (3 tasks)

**Task 4: Create Jefe-Edit-Datos form**
- Design Reference: GEN-016-01
- Form combines: Task 1 components
- AC:
  - [ ] Modal/dialog layout
  - [ ] Submit enabled only when required fields filled + valid
  - [ ] Click Guardar → API call to update datos
  - [ ] Auditoría: log user_id, action, old/new values
  - [ ] Success: "Datos actualizados" modal
  - [ ] Return to ficha with updated data

**Task 5: Create Jefe-Edit-Contactos form**
- Design Reference: GEN-016-02
- Form combines: Task 2 (email-input) + Task 3 (tel-input)
- AC:
  - [ ] Current state display (read-only badges with vigencia)
  - [ ] Submit enabled if ≥1 new value + all valid
  - [ ] Click Guardar → close old vigencias, open new vigencias
  - [ ] API calls: 2x POST /api/v1/parties/{id}/contactos (for each changed field)
  - [ ] Auditoría trail
  - [ ] Confirmation modal: old → new
  - [ ] Verify visual match to GEN-016-02

**Task 6: Create Colaborador-Edit-Perfiles+Teléfono form**
- Design Reference: GEN-016-03
- Form combines: Task 3 (select + tel-input) + profile list
- AC:
  - [ ] List existing profiles
  - [ ] Add profile: select platform + URL input
  - [ ] Validate URL real-time
  - [ ] [Agregar] button (enabled when valid)
  - [ ] [Eliminar] button per profile
  - [ ] Teléfono section: tel-input with same validators as Task 5
  - [ ] Permission check: user can only edit own profile
  - [ ] API calls: POST perfiles, PUT teléfono, DELETE perfil (if enabled)
  - [ ] Success: "Perfiles actualizados"
  - [ ] Verify visual match to GEN-016-03

#### **Phase 3: Tests** (2 tasks)

**Task 7: AC-016 Unit Tests**
- Test cada form con happy path + error cases
- Test permission enforcement (Jefe vs Colaborador)
- Test vigencia logic (close/open)
- Test async validators (duplicate email/phone)
- Coverage: 80%+

**Task 8: E2E Cypress Tests**
- Jefe happy path: edita datos, edita contactos
- Colaborador happy path: agrega perfil, edita teléfono
- Error cases: duplicate email, invalid phone
- Coverage: 100% happy paths

---

## Commits (Expected)

```
Phase 1 (Tasks 1-3): 3 commits (1 per component type)
  - Create text-input components
  - Create email-input with async validators
  - Create tel-input & select components

Phase 2 (Tasks 4-6): 3 commits (1 per form)
  - Create Jefe-Datos form
  - Create Jefe-Contactos form with vigencia handling
  - Create Colaborador-Perfiles+Teléfono form

Phase 3 (Tasks 7-8): 2 commits
  - AC-016 unit tests (80%+ coverage)
  - E2E Cypress tests (100% happy paths)
```

---

## Success Criteria

✅ All phases complete (3 + 3 + 2 = 8 tasks)  
✅ All gates passed (GATE-01 through GATE-04)  
✅ Component Inventory binding enforced  
✅ Design-to-code traceability end-to-end  
✅ All tests green (80% unit, 100% E2E)  
✅ Visual match to GEN-016 verified  
✅ WCAG 2.2 AA verified (0 violations)  
✅ Ready for merge to main

---

## Design-to-Code Traceability

| Design | Spec | Plan | Code |
|--------|------|------|------|
| GEN-016-01 (text-input) | SCR-016-01 | Task 1 | text-input.ts |
| GEN-016-02 (email-input) | SCR-016-02 | Task 2 | email-input.ts + Task 5 (form) |
| GEN-016-03 (tel-input, select) | SCR-016-03 | Task 3 | tel-input.ts, select.ts + Task 6 (form) |

Every component in GEN-016 is explicitly mapped to a task and gate-checked before code.

