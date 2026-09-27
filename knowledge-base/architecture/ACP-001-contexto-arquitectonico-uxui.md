---
type: Architecture Context Pack
title: "ACP-001 — Contexto arquitectónico UX/UI: Plataforma de Gestión de Formación"
description: "Decisiones arquitectónicas, bounded contexts (DDD), setup Angular, design system, NPM strategy y testing para el frontend de SPEC-001."
tags: [architecture, ux-ui, context-pack, angular, design-system]
status: draft
generated:
  by: "web-atomic-component-designer/1.0"
  at: "2026-09-27T20:40:00-05:00"
sources:
  - id: spec-001
    resource: /knowledge-base/requirement/specs/SPEC-001-gestion-de-colaboradores.md
  - id: uxr-000-006
    resource: /knowledge-base/design/ux-requirements/UXR-000-requisitos-ux-transversales.md
  - id: adr-001
    resource: /knowledge-base/architecture/adrs/ADR-001-estructura-microui-angular-y-bff-nodejs.md
  - id: gen-001-002
    resource: /knowledge-base/design/stitch/GEN-001-catalogo-de-roles-y-competencias.md
  - id: imd-001
    resource: /knowledge-base/business/information-model/IMD-001-modelo-de-informacion-conceptual.md
---

# ACP-001 — Contexto arquitectónico UX/UI

## 1. Resumen ejecutivo

**Iniciativa:** Plataforma de Gestión de Formación y Competencias (SPEC-001)

**Scope:** Frontend Angular para 6 módulos UX (UXR-000 a UXR-006) que dan cobertura a 6 historias de usuario (US-001 a US-006) y reglas de negocio (BRC-001).

**Estatus:** Diseño exploratorio (GEN-001/GEN-002 generadas en Stitch); component library specification en progreso.

**Entrega esperada:** ui-inventory.md, micro-ui-boundary-analysis.md, atomic-component-catalog.md, component specs, design-token-contract.md, npm-package-contract.md.

---

## 2. Decisiones arquitectónicas (ADRs)

### ADR-001 — Estructura MicroUI Angular + BFF Node.js

**Status:** Aceptado (2026-09-20)

**Decisión:** Frontend arquitecturado como MicroUI en Angular, con BFF en Node.js (Express) como orquestador de backend services.

**Justificación:**
- Aislamiento de cambios en Gestión de Formación respecto a otros dominios
- Team ownership independiente (Frontend Team = Gestión de Formación; Backend Team = APIs y persistencia)
- Deployment autónomo: MicroUI en Vercel/Firebase, BFF en Heroku/Google Cloud Run
- Reusable component library (NPM) para futuros dominios

**Notas:** 
- Shell global responsable de navegación, autenticación (Keycloak), layout
- MicroUI NO comparte estado global; orquestación en BFF
- Comunicación: REST/GraphQL entre MicroUI y BFF, REST entre BFF y backend services

**Referencias:** SPEC-001 D-001, ADR-001 (aceptado)

---

### ADR-002 — Design System corporativo (Corporate Enterprise Learning & Skills)

**Status:** Aceptado (2026-09-27)

**Decisión:** Reutilizar design system generado por Stitch ("Corporate Enterprise Learning & Skills" v1) como base; definir design tokens en TypeScript + Tailwind.

**Justificación:**
- GEN-001 ya lo utilizó; consistencia UX en todas las pantallas generadas
- Tokens de accesibilidad (WCAG 2.2 AA) documentados en el design system
- Extensible: nuevo tokens pueden agregarse sin breaking changes

**Notas:**
- Design tokens definidos como constantes TypeScript (`colors`, `typography`, `spacing`, `roundness`)
- Tailwind config importa tokens; componentes usan clases utility o CSS-in-JS
- Verification: pasar `accessibility-reviewer` sobre HTML exportado (HC-01 critical)

**Referencias:** GEN-001 (design system asset `assets/3b059f0ae3b445f38a63c3d0f7b02269`), GEN-002 (S-04 supuesto)

---

### ADR-003 — Persistencia MySQL + PostgreSQL

**Status:** Aceptado (2026-09-25)

**Decisión:** BFF soporta MySQL 8.0.16+ y PostgreSQL 12+ con DDL portable + per-engine variantes.

**Justificación:**
- SPEC-001 D30: cliente elige versión open-source estable más reciente (PostgreSQL:latest)
- Portabilidad: no vendor lock-in
- Migraciones versionadas, tests con ambos engines

**Notas:**
- Frontend es agnóstico a DB; solo consume APIs del BFF
- Migraciones en BFF (`/migrations` folder)
- Tests usan fixtures con GUID (auto-generated employee codes, no conflicts)

**Referencias:** SPEC-001 D28–D30, ADR-003 (aceptado)

---

## 3. Bounded Contexts (DDD) y MicroUI boundaries

### Contexto de negocio: Plataforma de Gestión de Formación

**Aggregates (BDD):**
- **Rol** (BR-CAT-09): define niveles, competencias, requisitos de evidencia
- **Competencia** (BR-CAT-14): rúbrica L1–L4, requisitos requeridos/deseados
- **Colaborador** (SPEC-001 D26): persona con rol Empleado o Contratista vigente
- **Rol-Nivel de Colaborador** (BR-CAT-02): asignación de rol a un nivel específico
- **Brecha** (derivado): diferencia entre Rol-Nivel actual y objetivo
- **Requerimiento** (BR-REQ-01): necesidad de un proyecto para Rol-Nivel + competencias específicas
- **Certificación** (BR-ACR-02): evaluador certifica que colaborador posee nivel de competencia

**Bounded Context:** Gestión de Formación
- **Language:** roles, competencias, niveles, certificaciones, brechas, requerimientos
- **Team:** Frontend Team (Angular), Backend Team (APIs), Data Team (reporting)
- **Integration:** Keycloak (autenticación), GitLab (evidencias), Vault (credentials), Google Stitch (design)

### MicroUI Candidata: Gestión de Formación

**Decisión:** ✅ **MICROUI_CANDIDATE**

**Justificación:**
- ✅ Coherent business capability: gestión end-to-end de competencias (definir catálogo, declarar requerimientos, certificar, ver brechas)
- ✅ Distinct language and rules: BR-CAT-*, BR-REQ-*, BR-ACR-*, BR-BRE-* (29 reglas explícitas)
- ✅ Accountable team: Frontend Team owns MicroUI, Backend Team owns APIs/BFF
- ✅ Stable integration contracts: REST APIs (BFF) + Keycloak (auth) + GitLab API (evidence)
- ✅ Independent test/deploy: MicroUI separable del Shell global
- ✅ Benefit exceeds cost: Gestión de Formación es dominio independiente; futuros dominios pueden reutilizar component library

**Non-goals:**
- NO es responsable de autenticación (Keycloak en Shell)
- NO persiste datos directamente (APIs del BFF)
- NO maneja navegación global (Shell define estructura)

---

## 4. Angular setup y convenciones

### Versión y dependencias

```json
{
  "name": "@comsatel/gestión-formación",
  "version": "0.1.0",
  "peerDependencies": {
    "@angular/core": "^17.0.0 || ^18.0.0",
    "@angular/common": "^17.0.0 || ^18.0.0",
    "@angular/forms": "^17.0.0 || ^18.0.0",
    "@angular/cdk": "^17.0.0 || ^18.0.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.2.0"
  },
  "devDependencies": {
    "@angular/cli": "^17.0.0",
    "jasmine": "^5.0.0",
    "karma": "^6.4.0",
    "karma-jasmine": "^5.1.0",
    "axe-core": "^4.7.0",
    "@percy/cli": "^1.0.0"
  }
}
```

### Estrategia: Standalone components

**Decisión:** Componentes standalone (Angular 14+) en lugar de módulos.

**Justificación:**
- Menor boilerplate
- Dependency injection inline (providedIn constructor)
- Tree-shaking automático
- Más fácil de testear

**Convención:**
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gf-role-catalog', // prefix: gf = gestión formación
  standalone: true,
  imports: [CommonModule, ...],
  template: `...`,
  styles: [`...`],
})
export class RoleCatalogComponent {
  @Input() roles: Role[] = [];
  @Output() roleSelected = new EventEmitter<Role>();
}
```

### Carpeta structure

```
libs/
  gestión-formación/
    src/
      lib/
        components/          # Atoms + Molecules + Organisms
          atoms/             # Form inputs, buttons, badges, etc.
          molecules/         # Card, table, modal, etc.
          organisms/         # Complex sections: role list, competency editor, etc.
        pages/               # Page components (route-level)
        templates/           # Layout templates (header + sidebar + content)
        services/            # API clients, state management
        models/              # TypeScript interfaces (Role, Competency, etc.)
        tokens/              # Design tokens (colors, spacing, etc.)
        utils/               # Helpers (formatters, validators)
      index.ts               # Public exports
      public-api.ts          # NPM public API
```

---

## 5. Design System: Tokens y contrato visual

### Design tokens (TypeScript)

**File:** `libs/gestión-formación/src/lib/tokens/design-tokens.ts`

```typescript
export const DESIGN_TOKENS = {
  colors: {
    primary: '#0F2942',        // Deep institutional navy
    secondary: '#4059aa',      // Cobalt blue
    tertiary: '#2563EB',       // Interactive accent
    error: '#ba1a1a',          // Destructive
    success: '#065F46',        // Success text
    warning: '#92400E',        // Warning text
    surface: '#ffffff',        // Card/modal background
    background: '#f8f9ff',     // Page background
    on_surface: '#0d1c2e',     // Text on surface
    on_surface_variant: '#43474d', // Secondary text
  },
  typography: {
    headline_xl: { fontSize: '32px', fontWeight: 700, lineHeight: '40px' },
    headline_lg: { fontSize: '24px', fontWeight: 600, lineHeight: '32px' },
    headline_md: { fontSize: '20px', fontWeight: 600, lineHeight: '28px' },
    headline_sm: { fontSize: '16px', fontWeight: 600, lineHeight: '24px' },
    body_lg: { fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
    body_md: { fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
    body_sm: { fontSize: '12px', fontWeight: 400, lineHeight: '16px' },
    label_lg: { fontSize: '14px', fontWeight: 600, lineHeight: '20px' },
    label_md: { fontSize: '12px', fontWeight: 600, lineHeight: '16px' },
    label_sm: { fontSize: '11px', fontWeight: 700, lineHeight: '14px' },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1.25rem',   // 20px
    xl: '2rem',      // 32px
  },
  roundness: {
    sm: '0.125rem',  // 2px
    md: '0.25rem',   // 4px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    full: '9999px',  // Pill
  },
  breakpoints: {
    mobile: '0px',       // 4-column grid
    tablet: '768px',     // 8-column grid
    desktop: '1280px',   // 12-column grid
  },
};

export type DesignToken = typeof DESIGN_TOKENS;
```

### Tailwind config

**File:** `tailwind.config.js`

```javascript
const { DESIGN_TOKENS } = require('./libs/gestión-formación/src/lib/tokens/design-tokens.ts');

module.exports = {
  theme: {
    colors: DESIGN_TOKENS.colors,
    fontSize: DESIGN_TOKENS.typography,
    spacing: DESIGN_TOKENS.spacing,
    borderRadius: DESIGN_TOKENS.roundness,
    screens: DESIGN_TOKENS.breakpoints,
  },
};
```

### Responsive breakpoints

| Breakpoint | Width    | Columns | Gutter | Use case |
|---|---|---|---|---|
| Mobile | ≤767px | 4 | 12px | Phones |
| Tablet | 768–1279px | 8 | 16px | Tablets, small laptops |
| Desktop | ≥1280px | 12 | 24px | Desktops, large monitors |

### WCAG target

**Level:** AA (minimum), AAA where feasible (form labels, link contrast)

**Compliance checks:**
- ✅ Contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text and UI components
- ✅ Focus indicators (double ring: white + tertiary)
- ✅ Keyboard navigation (tab order, arrow keys for lists)
- ✅ Screen reader support (ARIA labels, semantic HTML)
- ✅ Color ≠ only differentiator (icons, text patterns)

**Tool:** `axe-core` in unit tests, `@percy/cli` for visual regression

---

## 6. NPM library strategy

### Package name y scope

```
@comsatel/gestión-formación
```

### Entry points (exports)

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./atoms": {
      "import": "./dist/atoms/index.js",
      "require": "./dist/atoms/index.cjs"
    },
    "./molecules": {
      "import": "./dist/molecules/index.js"
    },
    "./organisms": {
      "import": "./dist/organisms/index.js"
    },
    "./tokens": {
      "import": "./dist/tokens/design-tokens.js"
    }
  }
}
```

### Public API

**File:** `libs/gestión-formación/src/public-api.ts`

```typescript
// Atoms
export { ButtonComponent } from './lib/components/atoms/button/button.component';
export { BadgeComponent } from './lib/components/atoms/badge/badge.component';
export { TextInputComponent } from './lib/components/atoms/text-input/text-input.component';
// ... more atoms

// Molecules
export { CardComponent } from './lib/components/molecules/card/card.component';
export { TableComponent } from './lib/components/molecules/table/table.component';
// ... more molecules

// Organisms
export { RoleCatalogComponent } from './lib/components/organisms/role-catalog/role-catalog.component';
// ... more organisms

// Models
export type { Role, Competency, Collaborator } from './lib/models';

// Tokens
export { DESIGN_TOKENS } from './lib/tokens/design-tokens';
```

### Semver policy

| Change | Version bump |
|---|---|
| New atom/molecule (no breaking change) | Minor (0.1.0 → 0.2.0) |
| Breaking API change (component selector, @Input renamed) | Major (0.1.0 → 1.0.0) |
| Bug fix, style adjustment | Patch (0.1.0 → 0.1.1) |
| Design token addition (backward compatible) | Minor |
| Design token removal/rename | Major |

---

## 7. Testing strategy

### Unit tests (Jasmine + Karma)

**Mandatory for:**
- All atoms and molecules (100% coverage)
- All organisms (80% coverage)
- All services (100% coverage)
- Public API contract (inputs, outputs, events)

**Example:**

```typescript
describe('RoleCatalogComponent', () => {
  let component: RoleCatalogComponent;
  let fixture: ComponentFixture<RoleCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleCatalogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleCatalogComponent);
    component = fixture.componentInstance;
  });

  it('should emit roleSelected when role is clicked', () => {
    spyOn(component.roleSelected, 'emit');
    component.roles = [{ id: 1, name: 'Developer' }];
    fixture.detectChanges();

    const row = fixture.debugElement.query(By.css('tr'));
    row.nativeElement.click();

    expect(component.roleSelected.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 1 })
    );
  });
});
```

### Accessibility tests (axe-core)

**Mandatory for:**
- All user-facing components
- Run in unit tests + E2E tests

**Example:**

```typescript
import { axe, toHaveNoViolations } from 'jasmine-axe';

describe('RoleCatalogComponent a11y', () => {
  it('should have no accessibility violations', async () => {
    const fixture = TestBed.createComponent(RoleCatalogComponent);
    fixture.detectChanges();

    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
```

### Visual regression (Percy)

**Mandatory for:**
- All atoms and molecules (golden snapshots)
- Critical organisms (role catalog, competency editor)

**Tool:** `@percy/cli`

### E2E tests (Cypress/Playwright)

**Mandatory for:**
- Page-level flows (SCR-001 → SCR-002 → edit → save)
- Integration with BFF APIs
- Keycloak authentication flows

---

## 8. Accessibility matrix

| Component | WCAG Requirement | Status | Evidence |
|---|---|---|---|
| All components | Focus indicator (double ring) | REQUIRED | CSS: box-shadow with white + tertiary |
| Form inputs | Associated label | REQUIRED | `<label for="...">` + aria-label |
| Tables | Header scope, row headers | REQUIRED | `<th scope="col/row">` |
| Buttons | Minimum 44px touch target | REQUIRED | Padding + min-height |
| Links | Underline or color + bold | REQUIRED | Text decoration + color contrast |
| Modals | Focus trap, ARIA role | REQUIRED | focus-guard + `role="dialog"` aria-modal |
| Alerts/Badges | Color ≠ only differentiator | REQUIRED | Icon + text label |
| Images | Alt text | REQUIRED | `alt="..."` or `aria-label` |

---

## 9. Contexto actual: SCR-001–004

**Pantallas generadas en Stitch:**
- SCR-001 (Catálogo de roles): tabla de 7 roles, estados BR-CAT-20
- SCR-002 (Detalle de rol): pestañas variables, validación BR-CAT-03/BR-CAT-07
- SCR-003 (Detalle de competencia): rúbrica + requisitos marcados ✓/○, BR-ACR-13 bloqueante
- SCR-004 (Mis proyectos): lista con filtros, botón "Declarar requerimiento"

**Siguiente paso:** Inventariar componentes reutilizables (atoms/molecules/organisms) desde SCR-001–004 y crear atomic-component-catalog.md.

---

## 10. Supuestos documentados

| ID | Supuesto | Fuente | Validación requerida |
|---|---|---|---|
| S-ANGULAR | Angular 17+ con standalone components | ADR-001, NPM strategy | ✅ Verificar package.json |
| S-TAILWIND | Tailwind 3.3+ como CSS-in-JS | ADR-002, design tokens | ✅ Verificar tailwind.config.js |
| S-TOKENS | Design tokens en TypeScript constantes | ADR-002 | ✅ Escribir tokens/design-tokens.ts |
| S-TESTING | Jasmine + Karma + axe-core + Percy | Testing strategy | ✅ Configurar karma.conf.js |
| S-A11Y | WCAG 2.2 AA target | ADR-002, accessibility matrix | ✅ Pasar axe-core en tests |
| S-KEYCLOAK | Autenticación en Shell (MicroUI no maneja) | ADR-001 | ✅ Confirmar con Backend Team |
| S-BFF-REST | APIs REST en BFF (no GraphQL) | ADR-001, SPEC-001 D25–D30 | ✅ Confirmar API contract |

---

## 11. Próximos pasos

1. ✅ **ACP-001 (este documento):** Architecture Context Pack completo
2. **Próximo:** Crear `ui-inventory.md` (pantallas + componentes reutilizables desde SCR-001–004)
3. **Próximo:** Crear `micro-ui-boundary-analysis.md` (DDD contexts, team ownership, integration contracts)
4. **Próximo:** Crear `atomic-component-catalog.md` (atoms/molecules/organisms/templates con clasificación y especificaciones)
5. **Próximo:** Crear component specs individuales (`CMP-ATOM-001.md`, `CMP-MOL-001.md`, etc.)
6. **Próximo:** Crear `design-token-contract.md` (tokens, responsive rules, WCAG compliance)
7. **Próximo:** Crear `npm-package-contract.md` (exports, peer dependencies, semver, deprecation policy)
8. **Próximo:** Crear `accessibility-matrix.md` (WCAG compliance por componente)
9. **Próximo:** Crear `development-context-pack.md` (handoff para Developer)

---

## 12. Validación y aprobaciones

**Status:** `REQUIRES_REVIEW` — Contexto documentado; necesita validación de:
- [ ] Backend Team: confirmar ADR-001 (MicroUI + BFF boundaries)
- [ ] Arquitecto responsable: confirmar ADR-002 (design system), ADR-003 (DB)
- [ ] Jefe de Ingeniería: confirmar DDD contexts (Gestión de Formación = MICROUI_CANDIDATE)
- [ ] Frontend Team: confirmar Angular setup (17+, standalone, Tailwind)
- [ ] QA: confirmar testing strategy (Jasmine, axe-core, Percy)

**Revisado por:** [Pending human review]

**Aprobado por:** [Pending]

---
