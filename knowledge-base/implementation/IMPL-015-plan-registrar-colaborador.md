---
type: Implementation Plan
title: "IMPL-015 — Plan de implementación: Registrar un colaborador"
description: "Plan ejecutable con fases, dependencias y checklist para implementar US-015 (CMP-015 + AC-015)"
tags: [implementation, party, angular, fastapi, h1]
status: ready
generated:
  by: "implementation-planner/1.0"
  at: "2026-10-01T00:00:00-05:00"
sources:
  - id: cmp-015
    resource: /knowledge-base/design/components/CMP-015-componentes-registrar-colaborador.md
  - id: ac-015
    resource: /knowledge-base/design/acceptance-criteria/AC-015-registrar-un-colaborador.md
  - id: scr-015
    resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
---

# IMPL-015 — Plan de Implementación

## Objetivo

Construir e integrar el flujo de registro de colaboradores (empleado/contratista) con validaciones real-time, componentes reutilizables Material Angular, tests exhaustivos y auditoría.

**Fases:** 3  
**Estimación:** ~4 semanas (160 horas)  
**Equipo:** 2 Backend (FastAPI), 2 Frontend (Angular), 1 QA

---

## Estructura General

```
Phase 1: Backend (DCP-002 API)
├── 1a. Endpoints POST/GET /api/parties
├── 1b. Validaciones (ID, correo duplicados, nivel vigente)
└── 1c. Tests (unit + integration + E2E)

Phase 2: Frontend (Angular + Material Design 3)
├── 2a. Componentes reutilizables (CMP-015)
├── 2b. Páginas y enrutamiento
└── 2c. Tests (unit + integration)

Phase 3: Integración & QA
├── 3a. Smoke tests (happy path)
├── 3b. Casos límite y error states
└── 3c. Accesibilidad (WCAG 2.2 AA)
```

---

## Phase 1: Backend (FastAPI)

### 1a. Endpoints API (DCP-002)

**File Structure:**
```
codebase/apps/domains/party-management-service/
├── app/
│   ├── core/
│   │   ├── auth.py (permisos: solo Jefe de Ingeniería)
│   │   ├── exceptions.py (E1-E11 mapeados a HTTP status)
│   │   └── validators.py (async: ID, correo duplicados)
│   ├── models/
│   │   ├── party.py (Parte, Persona, Rol de Parte)
│   │   └── party_profile.py (ProfileRole con nivel vigente)
│   ├── routers/
│   │   ├── parties.py (POST /parties, GET /parties/{id})
│   │   └── search.py (GET /unidades, /proveedores, /jefes, /roles)
│   ├── schemas/
│   │   ├── party.py (request/response: RegisterCollaboratorRequest, RegisterCollaboratorResponse)
│   │   └── validators.py (ValidationErrorResponse)
│   ├── services/
│   │   ├── party_service.py (lógica registro, validaciones, auditoría)
│   │   └── search_service.py (búsqueda real-time)
│   ├── database/
│   │   └── models.py (SQLAlchemy: Party, Person, PartyProfile, Unit, etc.)
│   └── main.py (FastAPI app + CORS)
```

**Endpoints:**

| Método | Ruta | Descripción | AC | Status |
|--------|------|-------------|-----|--------|
| POST | `/api/v1/parties` | Registrar colaborador | AC-015-01 a 09 | 🔲 |
| GET | `/api/v1/parties/{id}` | Obtener colaborador registrado | D28 | 🔲 |
| GET | `/api/v1/unidades?q=ing` | Buscar unidades (real-time) | AC-015-05A | 🔲 |
| GET | `/api/v1/proveedores?q=acme` | Buscar proveedores (real-time) | AC-015-05B | 🔲 |
| GET | `/api/v1/jefes?q=maria` | Buscar jefes vigentes (empleados) | AC-015-06 | 🔲 |
| GET | `/api/v1/roles?tipo=Developer` | Listar roles disponibles | AC-015-07 | 🔲 |
| GET | `/api/v1/roles/{rol_id}/niveles` | Listar niveles de un rol | AC-015-07, BR-PRF-02 | 🔲 |

**POST /api/v1/parties — Request Schema:**

```python
class RegisterCollaboratorRequest(BaseModel):
    tipo: Literal["empleado", "contratista"]  # required, AC-1/2
    nombres: str                              # required, min 2
    apellidos: str                            # required, min 2
    nombrePreferido: Optional[str]            # optional
    tipoIdentificacion: Literal["DNI", "CE", "Pasaporte"]  # required, AC-5
    numeroIdentificacion: str                 # required, unique compound (número, tipo, país)
    paisIdentificacion: str                   # required (enum)
    correoLaboral: EmailStr                   # required, unique vigentes only, AC-6
    unidadId: Optional[uuid.UUID]             # required si tipo="empleado", AC-1
    proveedorId: Optional[uuid.UUID]          # required si tipo="contratista", AC-2
    jefeDirectoId: Optional[uuid.UUID]        # required si tipo="empleado", AC-1
    rolId: uuid.UUID                          # required, AC-7
    nivelId: uuid.UUID                        # required, AC-7, con evidence reqs
    fechaDesde: date                          # required, default=today, editable
```

**POST /api/v1/parties — Response Schema (201 Created):**

```python
class RegisterCollaboratorResponse(BaseModel):
    id: uuid.UUID                    # ID de Parte generado
    codigo: uuid.UUID                # GUID código de colaborador (D25)
    nombres: str
    apellidos: str
    correoLaboral: str
    tipo: str                        # "empleado" | "contratista"
    unidadId: Optional[uuid.UUID]
    proveedorId: Optional[uuid.UUID]
    rolId: uuid.UUID
    nivelId: uuid.UUID
    vigente: bool                    # true (nuevo siempre es vigente)
    registradoEn: datetime
    registradoPor: str               # usuario actual (quién → auditoría)
```

**Error Responses (400/409/500):**

```python
# AC-5: ID duplicada
409 {
  "code": "E5",
  "message": "DNI 12345678 (Perú) ya existe",
  "field": "numeroIdentificacion"
}

# AC-6: Correo duplicado
409 {
  "code": "E6",
  "message": "Correo juan.perez@comsatel.com.pe ya está en uso",
  "field": "correoLaboral"
}

# E7: Unidad no vigente
409 {
  "code": "E7",
  "message": "La unidad ya no está vigente",
  "field": "unidadId"
}

# E8: Nivel sin evidence
400 {
  "code": "E8",
  "message": "El nivel Developer Junior no tiene requisitos de evidencia",
  "field": "nivelId"
}

# E10: Error BD
500 {
  "code": "E10",
  "message": "Error al registrar colaborador. Código de transacción: txn-uuid",
  "txnId": "txn-uuid"
}
```

---

### 1b. Validaciones Críticas

**Async Validators (DCP-002 service layer):**

```python
# validators.py

async def validar_identificacion_duplicada(
    tipo: str,
    numero: str,
    pais: str,
    session: AsyncSession
) -> Optional[str]:
    """
    AC-5: Compound key (número, tipo, pais) único entre vigentes.
    Retorna None si OK, error message si existe.
    """
    existing = await session.execute(
        select(Person).where(
            (Person.id_type == tipo) &
            (Person.id_number == numero) &
            (Person.id_country == pais) &
            (Person.party.vigente == True)
        )
    )
    if existing.scalar():
        return f"{tipo} {numero} ({pais}) ya existe"
    return None

async def validar_correo_duplicado(
    correo: str,
    session: AsyncSession
) -> Optional[str]:
    """
    AC-6: Correo único entre colaboradores vigentes.
    Retorna None si OK, error message si existe.
    """
    existing = await session.execute(
        select(Person).where(
            (Person.email == correo) &
            (Person.party.profile.vigente == True)
        )
    )
    if existing.scalar():
        return f"Correo {correo} ya está en uso"
    return None

async def validar_nivel_con_evidence(
    nivel_id: uuid.UUID,
    session: AsyncSession
) -> Optional[str]:
    """
    BR-PRF-02: Nivel debe tener requisitos de evidencia.
    Retorna None si OK, error message si falta.
    """
    nivel = await session.get(RoleLevel, nivel_id)
    if not nivel or not nivel.evidence_requirements:
        return f"Nivel {nivel.name} no tiene requisitos de evidencia"
    return None
```

**Frontend-side Debounce (UI validation NO-OP, backend es source of truth):**

El Angular front-end enviará queries de validación ANTES del submit, pero el backend validará nuevamente en el POST.

---

### 1c. Tests (Phase 1)

**Unit Tests:**
- `test_validar_identificacion_duplicada()` (mock session)
- `test_validar_correo_duplicado()` (mock session)
- `test_validar_nivel_con_evidence()` (mock session)

**Integration Tests:**
- `test_post_parties_empleado_feliz()` (201, GUID generado, auditoría registrada)
- `test_post_parties_contratista_feliz()` (201, sin jefe directo)
- `test_post_parties_id_duplicada()` (409 E5)
- `test_post_parties_correo_duplicado()` (409 E6)
- `test_post_parties_sin_permiso()` (403 E1)
- `test_post_parties_sin_unidades()` (409 E2 si tipo=empleado)
- `test_post_parties_nivel_sin_evidence()` (400 E8)

**Test Database:**
- PostgreSQL fixtures con datos maestros (unidades, proveedores, roles/niveles vigentes)
- Cleanup después de cada test

**Code Coverage:**
- Target: 90% (validadores + servicios críticos)
- Tools: pytest-cov

---

## Phase 2: Frontend (Angular + Material Design 3)

### 2a. Componentes Reutilizables (CMP-015)

**11 componentes a crear:**

| Componente | Material Base | Estados | Tests |
|------------|---------------|--------|-------|
| CMP-Form-Step | mat-stepper | normal, disabled | ✅ |
| CMP-Text-Input | mat-form-field | normal, error, validado | ✅ |
| CMP-Select-Dropdown | mat-select | open, closed, error | ✅ |
| CMP-Combobox-Search | mat-autocomplete | loading, open, empty state | ✅ |
| CMP-Radio-Card | mat-radio + mat-card | selected, unselected, hover | ✅ |
| CMP-Date-Input | mat-datepicker | open, closed | ✅ |
| CMP-Error-Alert | div | error, warning, info | ✅ |
| CMP-Success-Icon | mat-icon | animation 600ms | ✅ |
| CMP-Loading-Button | mat-button | loading, disabled | ✅ |
| CMP-Confirmation-Dialog | mat-dialog | open, confirmed, cancelled | ✅ |
| CMP-Copy-Button | mat-button | copied, failed | ✅ |

**Carpeta Estructura:**
```
src/app/shared/components/
├── cmp-form-step/
│   ├── form-step.component.ts
│   ├── form-step.component.html
│   ├── form-step.component.scss
│   └── form-step.component.spec.ts
├── cmp-text-input/
├── cmp-select-dropdown/
├── cmp-combobox-search/
├── cmp-radio-card/
├── cmp-date-input/
├── cmp-error-alert/
├── cmp-success-icon/
├── cmp-loading-button/
├── cmp-confirmation-dialog/
├── cmp-copy-button/
└── shared.module.ts
```

**Material Imports (shared.module.ts):**
```typescript
@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatStepperModule,
  ]
})
```

**Decoradores ARIA & Accesibilidad (todos):**
- `[attr.aria-required]="required"`
- `[attr.aria-invalid]="control.invalid && control.touched"`
- `[attr.aria-live]="'polite'"|'assertive'"`
- `[attr.aria-label]` para iconos
- `role="combobox"`, `role="listbox"`, `role="status"`

---

### 2b. Páginas & Enrutamiento

**Carpeta Estructura:**
```
src/app/features/party-management/
├── pages/
│   ├── register-collaborator/ (contenedor multi-step)
│   │   ├── register-collaborator.component.ts (FormGroup, navegación)
│   │   ├── register-collaborator.component.html
│   │   ├── register-collaborator.component.scss
│   │   └── register-collaborator.component.spec.ts
│   │
│   ├── register-step-type/ (paso 1: Empleado/Contratista)
│   ├── register-step-data/ (paso 2-3: nombres, identificación)
│   ├── register-step-contact/ (paso 4: correo)
│   ├── register-step-org/ (paso 5-6: unidad/jefe o proveedor)
│   ├── register-step-role/ (paso 7: rol-nivel)
│   ├── register-step-review/ (paso 8: confirmación)
│   └── register-step-success/ (paso 9: éxito + GUID)
│
├── services/
│   ├── collaborator.service.ts (POST /api/v1/parties)
│   ├── search.service.ts (GET /unidades, /proveedores, etc.)
│   └── validation.service.ts (debounce 300ms, async validators)
│
├── guards/
│   └── jefe-ingenieria.guard.ts (AC-1: solo Jefe de Ingeniería)
│
└── party-management.module.ts
```

**Routing (party-management-routing.module.ts):**
```typescript
const routes: Routes = [
  {
    path: 'colaboradores/nuevo',
    component: RegisterCollaboratorComponent,
    canActivate: [JefeIngenieriaGuard]
  },
  {
    path: 'colaboradores/:id',
    component: CollaboratorDetailComponent
  }
];
```

**collaborator.service.ts:**
```typescript
@Injectable({ providedIn: 'root' })
export class CollaboratorService {
  constructor(private http: HttpClient) {}

  register(payload: RegisterCollaboratorRequest): Observable<RegisterCollaboratorResponse> {
    return this.http.post<RegisterCollaboratorResponse>(
      '/api/v1/parties',
      payload
    ).pipe(
      tap(response => {
        // Auditoría local: registrar en localStorage para analytics
        console.log('Colaborador registrado:', response.codigo);
      }),
      catchError(error => {
        // Manejar E1-E11 y mapear a mensajes amigables
        return throwError(() => this.handleError(error));
      })
    );
  }

  private handleError(error: HttpErrorResponse): Error {
    if (error.status === 409) {
      const code = error.error.code;
      if (code === 'E5') return new DuplicateIdError(error.error.message);
      if (code === 'E6') return new DuplicateEmailError(error.error.message);
      if (code === 'E7') return new UnitNotViableError(error.error.message);
    }
    if (error.status === 400) {
      const code = error.error.code;
      if (code === 'E8') return new InvalidLevelError(error.error.message);
    }
    if (error.status === 403) return new PermissionError('E1');
    if (error.status === 500) return new ServerError(error.error.txnId);
    throw error;
  }
}
```

**validation.service.ts (Async Validators):**
```typescript
@Injectable({ providedIn: 'root' })
export class ValidationService {
  constructor(private search: SearchService) {}

  validatorDuplicateId(
    tipoIdentificacion: string,
    paisIdentificacion: string
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return of(control.value).pipe(
        debounceTime(300),
        switchMap(numero =>
          this.search.checkIdDuplicate(numero, tipoIdentificacion, paisIdentificacion)
        ),
        map(isDuplicate => isDuplicate ? { duplicateId: true } : null),
        catchError(() => of(null))
      );
    };
  }

  validatorDuplicateEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return of(control.value).pipe(
        debounceTime(300),
        switchMap(email => this.search.checkEmailDuplicate(email)),
        map(isDuplicate => isDuplicate ? { duplicateEmail: true } : null),
        catchError(() => of(null))
      );
    };
  }
}
```

**reactive-form en register-collaborator.component.ts:**
```typescript
@Component({
  selector: 'app-register-collaborator',
  templateUrl: './register-collaborator.component.html',
  styleUrls: ['./register-collaborator.component.scss']
})
export class RegisterCollaboratorComponent implements OnInit {
  registerForm!: FormGroup;
  currentStep = 1;
  totalSteps = 9;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private collaborator: CollaboratorService,
    private validation: ValidationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.fb.group({
      // Paso 1: Tipo
      tipo: ['empleado', [Validators.required]],

      // Paso 2-3: Datos
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      nombrePreferido: [''],
      tipoIdentificacion: ['DNI', [Validators.required]],
      numeroIdentificacion: [
        '',
        [Validators.required],
        [this.validation.validatorDuplicateId('DNI', 'Perú')] // async
      ],
      paisIdentificacion: ['Perú', [Validators.required]],

      // Paso 4: Correo
      correoLaboral: [
        '',
        [Validators.required, Validators.email],
        [this.validation.validatorDuplicateEmail()] // async
      ],

      // Paso 5-6: Org
      unidadId: [''],
      proveedorId: [''],
      jefeDirectoId: [''],

      // Paso 7: Rol-Nivel
      rolId: ['', [Validators.required]],
      nivelId: ['', [Validators.required]],
      fechaDesde: [new Date(), [Validators.required]],
    });

    // Validadores cross-field
    this.registerForm.setValidators([
      this.validatorTipoRequiresOrgFields.bind(this),
      this.validatorNivelWithEvidence.bind(this)
    ]);
  }

  next() {
    if (this.isStepValid()) {
      this.currentStep++;
    }
  }

  async submit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.collaborator.register(this.registerForm.value).toPromise();
      // Navigate a success page con código
      this.router.navigate(['/colaboradores/exito'], {
        state: { codigo: response.codigo }
      });
    } catch (error) {
      this.handleSubmitError(error);
    } finally {
      this.isLoading = false;
    }
  }
}
```

---

### 2c. Tests (Phase 2)

**Component Unit Tests:**
```typescript
// register-collaborator.component.spec.ts
describe('RegisterCollaboratorComponent', () => {
  let component: RegisterCollaboratorComponent;
  let fixture: ComponentTestBed;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCollaboratorComponent ],
      imports: [ SharedModule, ReactiveFormsModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterCollaboratorComponent);
    component = fixture.componentInstance;
  });

  it('should initialize form with tipo=empleado', () => {
    fixture.detectChanges();
    expect(component.registerForm.get('tipo')?.value).toBe('empleado');
  });

  it('should mark field invalid if required and empty', () => {
    const control = component.registerForm.get('nombres');
    control?.markAsTouched();
    expect(control?.invalid).toBe(true);
  });

  it('should debounce duplicate ID check', fakeAsync(() => {
    const spy = spyOn(component.validation, 'validatorDuplicateId');
    component.registerForm.get('numeroIdentificacion')?.setValue('12345678');
    tick(300);
    expect(spy).toHaveBeenCalled();
  }));

  it('should disable submit if form invalid', () => {
    fixture.detectChanges();
    component.registerForm.get('nombres')?.setValue('');
    expect(component.isFormValid()).toBe(false);
  });

  it('should POST /api/v1/parties on submit', () => {
    // Fill form
    component.registerForm.patchValue({
      nombres: 'Juan',
      apellidos: 'Pérez',
      correoLaboral: 'juan@comsatel.com.pe',
      tipo: 'empleado',
      unidadId: 'uuid-1',
      jefeDirectoId: 'uuid-2',
      rolId: 'uuid-3',
      nivelId: 'uuid-4'
    });

    spyOn(component.collaborator, 'register').and.returnValue(
      of({ codigo: 'a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d' })
    );

    component.submit();
    fixture.detectChanges();

    expect(component.collaborator.register).toHaveBeenCalled();
  });
});
```

**Integration Tests (E2E with test API):**
```typescript
// register-collaborator.integration.spec.ts
describe('RegisterCollaborator E2E', () => {
  beforeEach(() => {
    // Start mock backend with test data
    TestBed.inject(HttpTestingController);
  });

  it('happy path: empleado registration', () => {
    // 1. Load page
    // 2. Select Empleado
    // 3. Fill datos persona
    // 4. Validate ID real-time
    // 5. Fill correo
    // 6. Select unidad (combobox search)
    // 7. Select jefe directo
    // 8. Select rol-nivel
    // 9. Review
    // 10. Submit → POST /api/v1/parties
    // 11. Expect 201 + código GUID
    // 12. Expect navigate to /colaboradores/exito
  });

  it('error: duplicate ID', () => {
    // Fill form with existing DNI
    // Expect 409 E5
    // Expect error message inline
    // Expect form NOT cleared
  });

  it('error: permission denied', () => {
    // Mock unauthorized guard
    // Expect 403 E1
    // Expect redirect to login
  });
});
```

**Accessibility Tests:**
```typescript
// register-collaborator.accessibility.spec.ts
describe('RegisterCollaborator Accessibility', () => {
  it('should have focus visible on all inputs', () => {
    // Check outline 2px #0F52BA
  });

  it('should have proper ARIA labels', () => {
    // Check aria-required, aria-invalid, aria-live
  });

  it('should pass axe accessibility audit', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toHaveLength(0);
  });

  it('should be keyboard navigable (Tab, Enter, Space)', () => {
    // Simulate Tab key
    // Simulate Enter on button
    // Simulate Space on radio
  });
});
```

---

## Phase 3: Integración & QA

### 3a. Smoke Tests (Happy Path)

**Test Case: Empleado**
```gherkin
DADO que accedo como Jefe de Ingeniería a /colaboradores/nuevo
CUANDO completo el formulario de empleado:
  - Tipo: Empleado
  - Nombres: Juan Carlos
  - Apellidos: Pérez García
  - Identificación: DNI 12345678 (Perú)
  - Correo: juan.perez@comsatel.com.pe
  - Unidad: Ingeniería
  - Jefe: María García
  - Rol-Nivel: Developer Junior (2026-10-01)
Y hago clic en [Guardar]
ENTONCES:
  - Backend POST /api/v1/parties → 201
  - Se genera código GUID: a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d
  - Se registra auditoría (quién, cuándo)
  - Frontend navega a /colaboradores/exito
  - Se muestra checkmark + código + 3 opciones
  - [Copiar] funciona (clipboard)
```

**Test Case: Contratista**
```gherkin
DADO que accedo como Jefe de Ingeniería a /colaboradores/nuevo
CUANDO completo el formulario de contratista:
  - Tipo: Contratista
  - Nombres: Pedro
  - Apellidos: López
  - Identificación: Pasaporte ABC123 (España)
  - Correo: pedro@acme.com
  - Proveedor: ACME Corporation
  - Rol-Nivel: Consultant Senior (2026-10-01)
Y hago clic en [Guardar]
ENTONCES:
  - Backend POST /api/v1/parties → 201 (sin jefe directo)
  - Se genera código GUID
  - Frontend navega a /colaboradores/exito
```

**Automatización:** Cypress E2E tests
```typescript
// cypress/e2e/register-colaborador.cy.ts
describe('Register Collaborator Happy Path', () => {
  beforeEach(() => {
    cy.login('jefe-ingenieria');
    cy.visit('/colaboradores/nuevo');
  });

  it('should register empleado successfully', () => {
    cy.get('[data-testid="tipo-empleado"]').click();
    cy.get('[name="nombres"]').type('Juan Carlos');
    cy.get('[name="apellidos"]').type('Pérez García');
    // ... completar resto de campos
    cy.get('[data-testid="submit-btn"]').click();
    cy.url().should('include', '/colaboradores/exito');
    cy.get('[data-testid="success-code"]').should('be.visible');
  });
});
```

---

### 3b. Casos Límite & Error States

**Matrix de Validación:**

| Caso | Input | Resultado Esperado | AC/Status |
|------|-------|-------------------|-----------|
| ID duplicada (mismo país) | DNI 12345678 (Perú) | E5: 409, error inline | AC-5 |
| ID duplicada (otro país) | DNI 12345678 (Colombia) | ✓ acepta (compound key) | AC-5 |
| Correo duplicado | juan@comsatel.com.pe (vigente) | E6: 409, error inline | AC-6 |
| Correo anonimizado | juan@comsatel.com.pe (persona borrada) | ✓ acepta | D13 |
| Sin unidades | Empleado sin unidades registradas | E2: empty state + CTA | UXR-015 |
| Sin proveedores | Contratista sin proveedores | E3: empty state + CTA | UXR-015 |
| Sin roles | Catálogo vacío | E4: empty state + CTA | UXR-015 |
| Jefe no vigente | Selecciona jefe que después pierde vigencia | E7: error POST | AC-015-06 |
| Nivel sin evidence | Nivel sin requisitos | E8: error POST | BR-PRF-02 |
| Sesión vencida | JWT expirado | E11: modal login | UXR-000 |
| Falla BD | Timeout/error | E10: modal con txn-id, retry | FLW-015 |
| Caracteres especiales | "José María O'Brien" | ✓ acepta, no XSS | Privacy |
| Nombres cortos | "A B" | ✗ rechaza (min 2 chars) | SPEC-001 |
| Email inválido | "juan@" | ✗ rechaza (HTML5) | AC-6 |

---

### 3c. Accesibilidad (WCAG 2.2 AA)

**Audit Checklist:**

- [ ] **Keyboard Navigation:** Tab/Shift+Tab, Enter/Space, Escape
- [ ] **Focus Visible:** Outline 2px #0F52BA (no outline: none)
- [ ] **Contrast:** 4.5:1 text/bg, 3:1 graphics (axe/WAVE)
- [ ] **Labels:** `<label>` + `for="input-id"` o `aria-label`
- [ ] **Form Fields:** aria-required, aria-invalid, aria-describedby
- [ ] **Error Messages:** aria-live="polite", role="alert"
- [ ] **Success Message:** aria-live="assertive", role="status"
- [ ] **Focus Management:** Error → focus en primer campo; Success → focus en código
- [ ] **Color:** Rojo + icono X (no solo rojo) para errores
- [ ] **Screenreader:** Test manual con NVDA/JAWS

**Tools:**
- axe DevTools (Chrome extension)
- WAVE (wave.webaim.org)
- Manual NVDA/JAWS testing

---

## Dependencias de Proyecto

| ID | Dependencia | Estado | Bloquea |
|----|----|--------|---------|
| US-001 | Catálogo de Rol-Nivel vigentes | ✅ Exist | No |
| US-017 | Gestionar estructura organizacional (unidades) | ✅ Exist (mock) | No |
| US-018 | Gestionar proveedores | ✅ Exist (mock) | No |
| DCP-002 | API Party Management Service | ✅ Exist | Sí |
| SPEC-001 | Especificación gestión colaboradores | ✅ Exist | No |
| BR-PTY-* | Reglas de negocio party | ✅ Exist | No |

---

## Checklist de Ejecución

### Phase 1 Backend
- [ ] Crear modelos SQLAlchemy (Party, Person, PartyProfile)
- [ ] Implementar POST /api/v1/parties endpoint
- [ ] Validadores async: ID, correo, nivel duplicados
- [ ] Generador GUID código de colaborador
- [ ] Auditoría: registrar quién/cuándo
- [ ] Tests unit: 90% coverage validadores
- [ ] Tests integration: 8+ casos críticos (feliz + E1-E8, E10)
- [ ] Documentación Swagger/OpenAPI

### Phase 2 Frontend
- [ ] Crear 11 componentes Material Angular (CMP-015)
- [ ] Implementar pages (9 pasos)
- [ ] Reactive forms + async validators + debounce
- [ ] Guard: JefeIngenieriaGuard (AC-1)
- [ ] Services: collaborator, search, validation
- [ ] Tests unit: 80%+ coverage componentes
- [ ] Tests integration: happy path empleado + contratista
- [ ] Tests accessibility: WCAG 2.2 AA

### Phase 3 QA
- [ ] Smoke tests: Cypress E2E (2 historias felices)
- [ ] Casos límite: 12+ escenarios
- [ ] Error states: E1-E11 mapeados + UX clara
- [ ] Accessibility audit: axe + WAVE + manual NVDA
- [ ] Regresión: verificar US-016, US-017, US-018, US-001 no roto
- [ ] Performance: load time < 3s, POST < 2s
- [ ] Documentación: guía usuario + guía dev

---

## Timeline

| Semana | Phase | Entregables |
|--------|-------|------------|
| W1 | 1a, 1b | Endpoints API + validadores |
| W2 | 1c, 2a | Tests backend + componentes Material |
| W3 | 2b, 2c | Pages + tests frontend |
| W4 | 3a, 3b, 3c | E2E, casos límite, accessibility, release |

**Estimación:** 160 horas (4 personas × 4 semanas)

---

## Entregables Finales

1. ✅ Backend (FastAPI)
   - POST /api/v1/parties + GET search endpoints
   - Validaciones + auditoría
   - Tests 90%+ coverage

2. ✅ Frontend (Angular)
   - 11 componentes + 9 páginas
   - Reactive forms + async validators
   - Tests 80%+ coverage
   - WCAG 2.2 AA

3. ✅ QA
   - E2E tests Cypress
   - Casos límite matriz
   - Accessibility report
   - Performance metrics

4. ✅ Documentación
   - API Swagger
   - Component storybook
   - User guide + dev guide

---

## Señales de Éxito

- ✅ POST /api/v1/parties 201 (empleado + contratista)
- ✅ Validaciones real-time (ID, correo duplicados bloqueados)
- ✅ Código GUID único generado y auditado
- ✅ UI responsive (Desktop, Tablet, Mobile)
- ✅ WCAG 2.2 AA accesibilidad
- ✅ Smoke tests verdes (E2E)
- ✅ 0 regresiones en otras US

---

## Próximos Pasos

1. ✅ IMPL-015 plan completo
2. 👉 Iniciar Phase 1 (backend): crear modelos + endpoints
3. 👉 Iniciar Phase 2 (frontend) en paralelo: componentes + pages
4. 👉 Phase 3: integración, QA, release

**Go/No-Go:** El plan está listo. Aguardando aprobación o ajustes del usuario.
