---
type: Codebase Analysis
title: "CODEBASE-ANALYSIS-015 — Alineación: Estructura Angular actual vs ARCH-CMP-015"
description: "Mapeo de componentes existentes, gaps identificados, e implementación recomendada de ARCH-CMP-015 en mfe-collaborators."
tags: [codebase-analysis, architecture, angular, ui-library, party, h1]
status: draft
generated:
  by: "codebase-analyst/1.0"
  at: "2026-10-01T00:00:00-05:00"
sources:
  - id: arch-cmp-015
    resource: /knowledge-base/design/architecture/ARCH-CMP-015-libreria-componentes-shell-microui.md
  - id: cmp-015
    resource: /knowledge-base/design/components/CMP-015-componentes-registrar-colaborador.md
  - id: impl-015
    resource: /knowledge-base/implementation/IMPL-015-plan-registrar-colaborador.md
---

# CODEBASE-ANALYSIS-015 — Alineación Arquitectónica

## Contexto

El portal Angular actual usa **Micro Frontend (MFE) + Module Federation** con una librería compartida `@gf/ui` que implementa **Atomic Design** (Atoms → Molecules → Organisms).

**Estructura actual:**
```
codebase/apps/portal/projects/
├── core/                    # Servicios compartidos (auth, HTTP, state)
├── ui/                      # @gf/ui — librería de componentes (Atomic Design)
├── shell/                   # Shell principal (federated routes)
├── mfe-catalog/             # Micro Frontend: catálogo de roles
└── mfe-collaborators/       # Micro Frontend: colaboradores (US-015 → aquí)
```

---

## Librería UI Actual (`@gf/ui`)

### Atoms Existentes

| Componente | Selector | Estado | Usa | Alineación |
|-----------|----------|--------|-----|-----------|
| Button | `gf-button` | ✅ Existente | Variantes (primary, secondary, destructive), loading, aria-label | ✅ Alineado con ARCH-CMP-015 Atom-Button |
| Badge | `gf-badge` | ✅ Existente | Display text + variant | ⚠️ Minimal, para labels |
| Level Badge | `gf-level-badge` | ✅ Existente | Rol-Nivel visual | ✅ Alineado con UXR-015 |
| Spinner | `gf-spinner` | ✅ Existente | Loading indicator | ✅ Alineado con ARCH-CMP-015 Atom-Spinner |

**Gaps de Atoms:**
- ❌ Atom-Text-Input (input text/email/password)
- ❌ Atom-Label (label + aria-required)
- ❌ Atom-Error-Message (role=alert, aria-live)
- ❌ Atom-Icon (Material icon wrapper)
- ❌ Atom-Date-Input (date picker)
- ❌ Atom-Select (dropdown option)

### Molecules Existentes

| Componente | Selector | Estado | Composición |
|-----------|----------|--------|------------|
| Alert | `gf-alert` | ✅ Existente | Message + icon + variant | 
| Empty State | `gf-empty-state` | ✅ Existente | Icon + title + description + action |
| View State | `gf-view-state` | ✅ Existente | Loading/error/empty state wrapper |

**Gaps de Molecules:**
- ❌ Mol-Form-Field (label + input + error + hint)
- ❌ Mol-Autocomplete (combobox + async search + debounce)
- ❌ Mol-Radio-Card (radio + card)
- ❌ Mol-Button-Group (multiple buttons)
- ❌ Mol-Select-List (dropdown + options)

### Shells/Layouts (No en `@gf/ui`, pero en MFEs)

| Componente | Ubicación | Estado | Responsabilidad |
|-----------|-----------|--------|-----------------|
| shell-layout | `shell/src/app/layout/` | ✅ Existente | Main layout, header, nav |
| (Custom pages) | `mfe-collaborators/src/app/pages/` | 🔨 Por crear | Party list, detail, register |

---

## Mapeo: ARCH-CMP-015 → Codebase Actual

### Layer 1: ATOMS

| ARCH-CMP-015 | Implementación Actual | Recomendación |
|---|---|---|
| Atom-Text-Input | ❌ No existe | **Crear** `gf-text-input` en @gf/ui/atoms/ |
| Atom-Button | ✅ `gf-button` | ✅ Usar tal cual (ya tiene aria-label, loading) |
| Atom-Icon | ❌ Material directo | **Crear** `gf-icon` wrapper (usa mat-icon) |
| Atom-Label | ❌ No existe | **Crear** `gf-label` con aria-required |
| Atom-Error-Message | ❌ No existe | **Crear** `gf-error-message` con role=alert + aria-live |
| Atom-Spinner | ✅ `gf-spinner` | ✅ Usar tal cual |
| Atom-Date-Input | ❌ No existe | **Crear** `gf-date-input` (Material datepicker) |
| Atom-Select | ❌ No existe | **Crear** `gf-select` (Material select) |

**Action:** Crear 5 nuevos atoms en `@gf/ui/src/lib/atoms/`

### Layer 2: MOLECULES

| ARCH-CMP-015 | Implementación Actual | Recomendación |
|---|---|---|
| Mol-Form-Field | ❌ No existe | **Crear** `gf-form-field` (label + input + error + hint) |
| Mol-Autocomplete | ❌ No existe | **Crear** `gf-autocomplete` (combobox con async) |
| Mol-Radio-Card | ❌ No existe | **Crear** `gf-radio-card` (radio + card) |
| Mol-Alert | ✅ `gf-alert` | ✅ Usar (también cubre Atom-Error-Message) |
| Mol-Empty-State | ✅ `gf-empty-state` | ✅ Usar |
| Mol-View-State | ✅ `gf-view-state` | ✅ Usar |

**Action:** Crear 3 nuevos molecules en `@gf/ui/src/lib/molecules/`

### Layer 3: SHELLS

Shells NO van en `@gf/ui` (específicas de cada MFE):

| ARCH-CMP-015 | Ubicación Recomendada | Responsabilidad |
|---|---|---|
| Shell-Form-Step | `mfe-collaborators/src/app/shared/shells/` | Multi-step form container |
| Shell-Modal | `mfe-collaborators/src/app/shared/shells/` | Dialog overlay |
| Shell-Page-Layout | Ya existe en `shell/` | Main layout |

**Action:** Crear carpeta `mfe-collaborators/src/app/shared/shells/`

### Layer 4: COMMANDS

Commands NO van en `@gf/ui` (lógica de negocio):

| ARCH-CMP-015 | Ubicación Recomendada | Responsabilidad |
|---|---|---|
| RegisterCollaboratorCommand | `mfe-collaborators/src/app/core/commands/` | Orquestar registro de colaborador |
| SearchUnitsCommand | `core/src/lib/commands/` | Búsqueda real-time de unidades |
| SearchRolesCommand | `core/src/lib/commands/` | Búsqueda de roles |

**Action:** Crear carpeta `core/src/lib/commands/` y `mfe-collaborators/src/app/core/commands/`

---

## Plan de Implementación: Alineación + CMP-015

### Phase 1: Extender @gf/ui (2 semanas)

**Crear atoms:**
```
@gf/ui/src/lib/atoms/
├── text-input/
│   ├── text-input.ts (nuevo)
│   ├── text-input.spec.ts
│   └── README.md
├── label/
│   ├── label.ts (nuevo)
│   ├── label.spec.ts
│   └── README.md
├── error-message/
│   ├── error-message.ts (nuevo)
│   ├── error-message.spec.ts
│   └── README.md
├── icon/
│   ├── icon.ts (nuevo)
│   ├── icon.spec.ts
│   └── README.md
├── date-input/
│   ├── date-input.ts (nuevo)
│   ├── date-input.spec.ts
│   └── README.md
└── select/
    ├── select.ts (nuevo)
    ├── select.spec.ts
    └── README.md
```

**Crear molecules:**
```
@gf/ui/src/lib/molecules/
├── form-field/
│   ├── form-field.ts (nuevo)
│   ├── form-field.spec.ts
│   └── README.md
├── autocomplete/
│   ├── autocomplete.ts (nuevo)
│   ├── autocomplete.spec.ts
│   └── README.md
└── radio-card/
    ├── radio-card.ts (nuevo)
    ├── radio-card.spec.ts
    └── README.md
```

**Update public-api.ts:**
```typescript
export * from './lib/atoms/text-input/text-input';
export * from './lib/atoms/label/label';
export * from './lib/atoms/error-message/error-message';
export * from './lib/atoms/icon/icon';
export * from './lib/atoms/date-input/date-input';
export * from './lib/atoms/select/select';

export * from './lib/molecules/form-field/form-field';
export * from './lib/molecules/autocomplete/autocomplete';
export * from './lib/molecules/radio-card/radio-card';
```

### Phase 2: Crear Shells + Commands en mfe-collaborators (2 semanas)

**Crear shells (mfe-collaborators):**
```
mfe-collaborators/src/app/shared/shells/
├── form-step/
│   ├── form-step.ts (nuevo)
│   ├── form-step.html
│   ├── form-step.spec.ts
│   └── README.md
└── modal/
    ├── modal.ts (nuevo)
    ├── modal.html
    ├── modal.spec.ts
    └── README.md
```

**Crear commands (mfe-collaborators):**
```
mfe-collaborators/src/app/core/commands/
├── command.interface.ts (nuevo)
├── register-collaborator.command.ts (nuevo)
├── register-collaborator.command.spec.ts
└── commands.service.ts (nuevo)
```

**Crear commands (core library):**
```
core/src/lib/commands/
├── search-units.command.ts (nuevo)
├── search-roles.command.ts (nuevo)
├── search-providers.command.ts (nuevo)
└── search-managers.command.ts (nuevo)
```

### Phase 3: Implementar páginas US-015 en mfe-collaborators (2 semanas)

**Crear pages:**
```
mfe-collaborators/src/app/pages/register-collaborator/
├── register-collaborator.page.ts (nuevo — contenedor multi-step)
├── register-collaborator.page.html
├── register-collaborator.page.spec.ts
├── steps/
│   ├── step-type/ (Empleado/Contratista)
│   ├── step-person-data/ (nombres, apellidos)
│   ├── step-identification/ (ID)
│   ├── step-contact/ (correo)
│   ├── step-organization/ (unidad/proveedor/jefe)
│   ├── step-role/ (rol-nivel)
│   ├── step-review/ (confirmación)
│   └── step-success/ (éxito + GUID)
├── validators/
│   ├── duplicate-id.validator.ts (async)
│   └── duplicate-email.validator.ts (async)
└── services/
    ├── register-collaborator.service.ts (API call)
    └── register-form.service.ts (state management)
```

---

## Estructura de Carpetas Post-Implementación

```
codebase/apps/portal/projects/

├── core/
│   └── src/lib/
│       ├── commands/
│       │   ├── search-units.command.ts
│       │   ├── search-roles.command.ts
│       │   ├── search-providers.command.ts
│       │   └── search-managers.command.ts
│       └── ... (auth, HTTP, state)
│
├── ui/ (@gf/ui)
│   └── src/lib/
│       ├── atoms/
│       │   ├── button/
│       │   ├── badge/
│       │   ├── level-badge/
│       │   ├── spinner/
│       │   ├── text-input/ (NUEVO)
│       │   ├── label/ (NUEVO)
│       │   ├── error-message/ (NUEVO)
│       │   ├── icon/ (NUEVO)
│       │   ├── date-input/ (NUEVO)
│       │   └── select/ (NUEVO)
│       └── molecules/
│           ├── alert/
│           ├── empty-state/
│           ├── view-state/
│           ├── form-field/ (NUEVO)
│           ├── autocomplete/ (NUEVO)
│           └── radio-card/ (NUEVO)
│
├── shell/
│   └── src/app/
│       ├── layout/
│       ├── federation/
│       └── ... (routes, config)
│
├── mfe-catalog/
│   └── src/app/
│       ├── pages/
│       └── data-access/
│
└── mfe-collaborators/ ⭐ (US-015 aquí)
    └── src/app/
        ├── pages/
        │   └── register-collaborator/ (NUEVO)
        │       ├── register-collaborator.page.ts
        │       ├── steps/
        │       ├── validators/
        │       └── services/
        ├── shared/
        │   ├── shells/ (NUEVO)
        │   │   ├── form-step/
        │   │   └── modal/
        │   └── components/
        ├── core/
        │   └── commands/ (NUEVO)
        │       └── register-collaborator.command.ts
        ├── data-access/
        └── ... (routes, config)
```

---

## Decisiones Arquitectónicas

### 1. Module Federation Boundaries

**Decisión:** Mantener Module Federation entre shell ↔ MFEs, pero compartir @gf/ui y core.

```typescript
// shell/tsconfig.federation.json
{
  "remotes": {
    "@mfe/catalog": "http://localhost:4201/remoteEntry.js",
    "@mfe/collaborators": "http://localhost:4202/remoteEntry.js"
  },
  "shared": {
    "@angular/common": {},
    "@gf/ui": { singleton: true, strictVersion: true },
    "@gf/core": { singleton: true, strictVersion: true }
  }
}
```

**Ventaja:** @gf/ui se carga una sola vez, se comparte entre MFEs.

### 2. Reactive Forms + Async Validators

**Decisión:** Usar Reactive Forms (FormGroup) + async validators en mfe-collaborators.

```typescript
// register-collaborator.page.ts
this.form = this.fb.group({
  numeroIdentificacion: [
    '',
    [Validators.required],
    [this.duplicateIdValidator.bind(this)] // async
  ],
  correoLaboral: [
    '',
    [Validators.required, Validators.email],
    [this.duplicateEmailValidator.bind(this)] // async
  ]
});
```

**Ventaja:** Validación real-time, debounce integrado, UI actualiza automáticamente.

### 3. State Management: Commands vs NgRx

**Decisión:** Usar Command Pattern simple (sin NgRx por ahora) para US-015.

```typescript
// RegisterCollaboratorCommand
export class RegisterCollaboratorCommand implements ICommand {
  execute(): Observable<RegisterCollaboratorResponse> {
    return this.api.register(this.payload).pipe(
      tap(response => console.log('Success:', response)),
      catchError(error => this.handleError(error))
    );
  }
}
```

**Ventaja:** Menos boilerplate, fácil de testear, escalable si después se agrega NgRx.

### 4. API Error Mapping

**Decisión:** Mapear errores HTTP (E1-E11) a mensajes amigables en error handler centralizado.

```typescript
// core/src/lib/http/error-mapper.ts
export class ErrorMapper {
  map(error: HttpErrorResponse, context: 'registration' | 'search'): AppError {
    if (context === 'registration' && error.status === 409) {
      const code = error.body.code;
      if (code === 'E5') return new DuplicateIdError(...);
      if (code === 'E6') return new DuplicateEmailError(...);
      // ... E7-E11
    }
  }
}
```

**Ventaja:** Errores centralizados, reutilizables en múltiples MFEs.

---

## Checklist de Implementación

### Phase 1: Extender @gf/ui
- [ ] Crear Atom-Text-Input con tests
- [ ] Crear Atom-Label con aria-required
- [ ] Crear Atom-Error-Message con role=alert
- [ ] Crear Atom-Icon (Material wrapper)
- [ ] Crear Atom-Date-Input (Material datepicker)
- [ ] Crear Atom-Select (Material select)
- [ ] Crear Mol-Form-Field (composición de atoms)
- [ ] Crear Mol-Autocomplete (async + debounce)
- [ ] Crear Mol-Radio-Card (radio + card)
- [ ] Update @gf/ui/public-api.ts
- [ ] Publicar @gf/ui v1.1.0 (npm)

### Phase 2: Crear infrastructure en mfe-collaborators
- [ ] Crear Shell-Form-Step container
- [ ] Crear Shell-Modal dialog
- [ ] Crear RegisterCollaboratorCommand
- [ ] Crear search commands (en core)
- [ ] Crear async validators (debounce 300ms)
- [ ] Setup error mapper centralizado

### Phase 3: Implementar páginas US-015
- [ ] Crear register-collaborator.page.ts (FormGroup + multi-step)
- [ ] Crear 9 step components
- [ ] Implementar validadores (ID, correo duplicados)
- [ ] Integrar API calls (POST /api/v1/parties)
- [ ] Manejo de errores (E1-E11)
- [ ] Tests: unit + integration + E2E

### QA & Release
- [ ] Tests @gf/ui: 90% coverage
- [ ] Tests mfe-collaborators: 80% coverage
- [ ] E2E smoke tests (Cypress)
- [ ] A11y audit (WCAG 2.2 AA)
- [ ] Performance check (< 3s load, < 2s POST)

---

## Timeline Estimado

| Fase | Duración | Equipo |
|------|----------|--------|
| Phase 1: @gf/ui | 2 semanas | 1 FE architect + 1 dev |
| Phase 2: Shells + Commands | 2 semanas | 1 dev (FE) + 1 dev (core) |
| Phase 3: Páginas US-015 | 2 semanas | 2 devs (FE) + 1 QA |
| **Total** | **~6 semanas** | **~4-5 personas** |

---

## Riesgos y Mitigación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|--------|-----------|
| Module Federation version conflicts | Media | Alto | Usar `singleton: true` en shared config |
| Async validators timeout en prod | Media | Medio | Debounce 300ms + request timeout 5s |
| Form state loss en navegación | Baja | Alto | Guardar en sessionStorage (no localStorage) |
| Bundle size (@gf/ui) | Media | Medio | Lazy load molecules en MFEs (si es necesario) |
| Accesibilidad regresion | Baja | Medio | Test NVDA/JAWS en cada release |

---

## Próximos Pasos

1. ✅ ARCH-CMP-015 especificado
2. ✅ CODEBASE-ANALYSIS-015 alineación completa
3. 👉 **DTC-015**: Development Context Pack final (para handoff a devs)
4. 👉 Iniciar Phase 1: Extender @gf/ui con 5 atoms + 3 molecules
5. 👉 Iniciar Phase 2: Shells + Commands en paralelo
6. 👉 Fase 3: Implementar páginas US-015 + tests

---

## Referencias

- **Codebase:** `codebase/apps/portal/projects/`
- **UI Library:** `@gf/ui` in `codebase/apps/portal/projects/ui/`
- **Collaborators MFE:** `codebase/apps/portal/projects/mfe-collaborators/`
- **Module Federation:** Angular 15+ `tsconfig.federation.json`
- **Design System:** Material Design 3 tokens (@gf/ui)
- **Tests:** Jasmine + Karma (unit), Cypress (E2E)
