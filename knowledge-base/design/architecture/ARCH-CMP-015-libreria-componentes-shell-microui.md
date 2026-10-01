---
type: Component Architecture
title: "ARCH-CMP-015 — Arquitectura: Librería de Componentes Shell + MicroUI"
description: "Especificación de arquitectura para librería de componentes reutilizables con Shell pattern, MicroUI atoms, y Command-based composition."
tags: [architecture, components, shell-pattern, microui, party, h1]
status: draft
generated:
  by: "component-architect/1.0"
  at: "2026-10-01T00:00:00-05:00"
sources:
  - id: cmp-015
    resource: /knowledge-base/design/components/CMP-015-componentes-registrar-colaborador.md
  - id: impl-015
    resource: /knowledge-base/implementation/IMPL-015-plan-registrar-colaborador.md
  - id: uxr-015
    resource: /knowledge-base/design/ux-requirements/UXR-015-registrar-un-colaborador.md
---

# ARCH-CMP-015 — Arquitectura de Librería de Componentes

## Objetivo

Diseñar una librería de componentes reutilizables usando **Shell Pattern** (contenedor estructural), **MicroUI** (átomos primitivos), y **Command Pattern** (orquestación de acciones) para maximizar reutilización, testabilidad y consistencia en toda la aplicación.

---

## Principios de Diseño

1. **Shell Pattern**: Separar contenedor (layout, navegación, estructura) de contenido (datos, lógica).
2. **MicroUI Atoms**: Componentes primitivos más pequeños posible (text-input, button, icon).
3. **Composición sobre Herencia**: Combinar átomos en moléculas, luego en organismos.
4. **Command Pattern**: Acciones explícitas desacopladas de UI.
5. **Accesibilidad First**: WCAG 2.2 AA en cada átomo.
6. **Material Design 3**: Tokens, colores, tipografía consistentes.

---

## Jerarquía de Componentes

```
┌─ SHELL (Contenedor)
│  ├─ Shell-Form-Step (multi-paso, progreso)
│  ├─ Shell-Modal (diálogo, overlay)
│  └─ Shell-Page-Layout (header, footer, main)
│
├─ MOLÉCULAS (Composición de átomos)
│  ├─ Mol-Form-Field (label + input + error + hint)
│  ├─ Mol-Select-List (dropdown + search + options)
│  ├─ Mol-Autocomplete (combobox + debounce + async)
│  ├─ Mol-Radio-Card (radio + card + state)
│  └─ Mol-Button-Group (multiple buttons + loading)
│
├─ ÁTOMOS (Primitivos, reutilizables)
│  ├─ Atom-Text-Input (input type=text)
│  ├─ Atom-Email-Input (input type=email)
│  ├─ Atom-Date-Input (date picker)
│  ├─ Atom-Button (button raised/flat)
│  ├─ Atom-Icon (Material icon wrapper)
│  ├─ Atom-Label (label + aria)
│  ├─ Atom-Error-Message (aria-live alert)
│  └─ Atom-Spinner (loading indicator)
│
└─ UTILITIES (Funciones, pipes, validators)
   ├─ debounce-timer
   ├─ async-validator
   ├─ aria-labeler
   └─ error-mapper
```

---

## Layer 1: ATOMS (Primitivos)

Componentes sin lógica de negocio. Puramente visuales + ARIA.

### Atom-Text-Input

```typescript
// atoms/text-input/text-input.component.ts
@Component({
  selector: 'atom-text-input',
  template: `
    <input 
      type="text"
      [value]="value"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel"
      [attr.aria-required]="required"
      [attr.aria-invalid]="invalid"
      (change)="valueChange.emit($event.target.value)"
      (blur)="blur.emit()"
    />
  `
})
export class AtomTextInputComponent {
  @Input() value: string = '';
  @Input() required = false;
  @Input() invalid = false;
  @Input() disabled = false;
  @Input() ariaLabel = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
}
```

**Responsabilidades:**
- Renderizar input HTML5
- Propagar eventos (change, blur)
- Exponer properties ARIA (required, invalid, label)
- NO validación
- NO lógica de negocio

**Variantes:**
- type: text, email, password, number
- size: small, medium (default), large
- state: normal, focused, disabled, error

### Atom-Button

```typescript
@Component({
  selector: 'atom-button',
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || isLoading"
      (click)="click.emit()"
    >
      <atom-spinner *ngIf="isLoading" [size]="'small'"></atom-spinner>
      {{ label }}
    </button>
  `
})
export class AtomButtonComponent {
  @Input() label: string = '';
  @Input() type: 'submit' | 'button' = 'button';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Output() click = new EventEmitter<void>();
}
```

**Variantes:**
- variant: primary (#0B3C68), secondary (#0F52BA), tertiary (#0D9488), danger (#BA1A1A)
- size: small, medium, large
- fullWidth: boolean

### Atom-Icon

```typescript
@Component({
  selector: 'atom-icon',
  template: `
    <mat-icon 
      [attr.aria-label]="ariaLabel"
      [attr.role]="role"
    >{{ name }}</mat-icon>
  `
})
export class AtomIconComponent {
  @Input() name: string = '';
  @Input() ariaLabel: string = '';
  @Input() role: 'img' | 'presentation' = 'presentation';
}
```

### Atom-Label

```typescript
@Component({
  selector: 'atom-label',
  template: `
    <label [for]="inputId">
      {{ text }}
      <span *ngIf="required" aria-label="required">*</span>
    </label>
  `
})
export class AtomLabelComponent {
  @Input() inputId: string = '';
  @Input() text: string = '';
  @Input() required = false;
}
```

### Atom-Error-Message

```typescript
@Component({
  selector: 'atom-error-message',
  template: `
    <div 
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      class="error-message"
    >
      <atom-icon name="error_outline"></atom-icon>
      {{ message }}
    </div>
  `
})
export class AtomErrorMessageComponent {
  @Input() message: string = '';
}
```

---

## Layer 2: MOLECULES (Composición de Átomos)

Combinan átomos + lógica mínima (validación local, state visibility).

### Mol-Form-Field

Combina: label + input + error + hint

```typescript
@Component({
  selector: 'mol-form-field',
  template: `
    <div class="form-field">
      <atom-label 
        [inputId]="inputId"
        [text]="label"
        [required]="required"
      ></atom-label>
      
      <atom-text-input
        #inputEl
        [value]="value"
        [required]="required"
        [invalid]="showError"
        [disabled]="disabled"
        [ariaLabel]="label"
        (valueChange)="value = $event"
        (blur)="onBlur()"
      ></atom-text-input>
      
      <atom-error-message
        *ngIf="showError"
        [message]="errorMessage"
      ></atom-error-message>
      
      <p *ngIf="!showError && hint" class="hint">{{ hint }}</p>
    </div>
  `
})
export class MolFormFieldComponent {
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() hint = '';
  @Input() validator?: ValidatorFn;
  
  @Output() valueChange = new EventEmitter<string>();
  
  showError = false;
  inputId = `field-${uniqueId()}`;

  onBlur() {
    if (this.validator && this.value) {
      this.showError = !!this.validator(new FormControl(this.value));
    }
  }
}
```

**Composición:**
- atom-label
- atom-text-input
- atom-error-message
- hint text (optional)

### Mol-Autocomplete

Combobox con búsqueda real-time + async loading

```typescript
@Component({
  selector: 'mol-autocomplete',
  template: `
    <div class="autocomplete">
      <atom-label [inputId]="inputId" [text]="label" [required]="required"></atom-label>
      
      <atom-text-input
        [inputId]="inputId"
        [value]="searchText"
        [attr.role]="'combobox'"
        [attr.aria-expanded]="isOpen"
        [attr.aria-autocomplete]="'list'"
        [disabled]="disabled || isLoading"
        (valueChange)="onSearch($event)"
        (blur)="onBlur()"
      ></atom-text-input>
      
      <atom-spinner *ngIf="isLoading" [size]="'small'"></atom-spinner>
      
      <ul *ngIf="isOpen" role="listbox" class="options">
        <li *ngFor="let opt of filteredOptions$ | async" 
          role="option"
          (click)="select(opt)"
        >
          {{ opt.label }}
        </li>
      </ul>
      
      <atom-error-message
        *ngIf="showError"
        [message]="errorMessage"
      ></atom-error-message>
    </div>
  `
})
export class MolAutocompleteComponent {
  @Input() label: string = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() searchFn!: (query: string) => Observable<any[]>;  // Backend search
  
  @Output() selected = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();
  
  searchText = '';
  isOpen = false;
  isLoading = false;
  showError = false;
  filteredOptions$!: Observable<any[]>;
  inputId = `autocomplete-${uniqueId()}`;

  onSearch(query: string) {
    this.searchText = query;
    this.isOpen = query.length > 0;
    
    if (query.length === 0) {
      this.filteredOptions$ = of([]);
      return;
    }

    this.isLoading = true;
    this.filteredOptions$ = of(query).pipe(
      debounceTime(300),
      switchMap(q => this.searchFn(q)),
      tap(() => this.isLoading = false),
      catchError(() => {
        this.isLoading = false;
        return of([]);
      })
    );
  }

  select(option: any) {
    this.selected.emit(option);
    this.isOpen = false;
    this.searchText = option.label;
  }

  onBlur() {
    setTimeout(() => this.isOpen = false, 100);
    this.blur.emit();
  }
}
```

**Composición:**
- atom-label
- atom-text-input + role=combobox
- atom-spinner (loading)
- atom-error-message

### Mol-Radio-Card

Radio button + card styling

```typescript
@Component({
  selector: 'mol-radio-card',
  template: `
    <mat-card 
      class="radio-card"
      [class.selected]="selected"
      (click)="select()"
    >
      <mat-radio-button [value]="value" [checked]="selected">
        <strong>{{ label }}</strong>
      </mat-radio-button>
      
      <atom-icon *ngIf="selected" name="check_circle"></atom-icon>
      
      <p class="description">{{ description }}</p>
    </mat-card>
  `,
  styles: [`
    .radio-card { cursor: pointer; border: 1px solid #E2E8F0; }
    .radio-card.selected { border: 2px solid #0B3C68; background: #E3EEFC; }
  `]
})
export class MolRadioCardComponent {
  @Input() label: string = '';
  @Input() description: string = '';
  @Input() value: any;
  @Input() selected = false;
  
  @Output() change = new EventEmitter<any>();

  select() {
    this.selected = true;
    this.change.emit(this.value);
  }
}
```

---

## Layer 3: SHELLS (Contenedores Estructurales)

Definen layout, progreso, navegación.

### Shell-Form-Step

Multi-step form container

```typescript
@Component({
  selector: 'shell-form-step',
  template: `
    <div class="form-step-container">
      <mat-stepper linear>
        <mat-step *ngFor="let step of steps; let i = index" [completed]="i < currentStep">
          <ng-template matStepLabel>{{ step.label }}</ng-template>
          
          <div class="step-content">
            <h2>{{ step.title }}</h2>
            <ng-container *ngIf="i === currentStep">
              <ng-content></ng-content>
            </ng-container>
          </div>
          
          <div class="step-actions">
            <atom-button 
              *ngIf="i > 0"
              label="Atrás"
              (click)="previousStep()"
            ></atom-button>
            
            <atom-button 
              *ngIf="i < steps.length - 1"
              label="Siguiente"
              [disabled]="!isStepValid"
              (click)="nextStep()"
            ></atom-button>
            
            <atom-button 
              *ngIf="i === steps.length - 1"
              label="Guardar"
              variant="primary"
              [isLoading]="isSubmitting"
              (click)="submit()"
            ></atom-button>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `
})
export class ShellFormStepComponent {
  @Input() steps: Array<{label: string, title: string}> = [];
  @Input() currentStep = 0;
  @Input() isStepValid = false;
  @Input() isSubmitting = false;
  
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}
```

### Shell-Modal

Modal/dialog container

```typescript
@Component({
  selector: 'shell-modal',
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onBackdropClick()">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <atom-button 
            (click)="close()"
            aria-label="Cerrar diálogo"
          >
            <atom-icon name="close"></atom-icon>
          </atom-button>
        </div>
        
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        
        <div class="modal-footer">
          <atom-button label="Cancelar" (click)="close()"></atom-button>
          <atom-button label="Confirmar" variant="primary" (click)="confirm()"></atom-button>
        </div>
      </div>
    </div>
  `
})
export class ShellModalComponent {
  @Input() title: string = '';
  @Input() isOpen = false;
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onBackdropClick() {
    this.close();
  }

  close() {
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit();
  }
}
```

---

## Layer 4: COMMANDS (Orquestación de Acciones)

Desacoplar acciones de UI usando Command Pattern.

```typescript
// core/commands/command.interface.ts
export interface ICommand {
  execute(): Observable<any>;
  canExecute(): boolean;
  undo(): void;
}

// core/commands/register-collaborator.command.ts
@Injectable()
export class RegisterCollaboratorCommand implements ICommand {
  constructor(
    private collaboratorService: CollaboratorService,
    private store: Store
  ) {}

  payload!: RegisterCollaboratorRequest;

  execute(): Observable<any> {
    if (!this.canExecute()) {
      return throwError(() => new Error('Command cannot execute'));
    }

    return this.collaboratorService.register(this.payload).pipe(
      tap(response => {
        // Dispatch success action
        this.store.dispatch(new RegisterCollaboratorSuccess(response));
      }),
      catchError(error => {
        // Dispatch error action
        this.store.dispatch(new RegisterCollaboratorError(error));
        return throwError(() => error);
      })
    );
  }

  canExecute(): boolean {
    return !!this.payload && this.validatePayload(this.payload);
  }

  undo(): void {
    // Revert backend changes if supported
    this.store.dispatch(new ReverseCollaboratorRegistration());
  }

  private validatePayload(payload: RegisterCollaboratorRequest): boolean {
    // Validaciones críticas
    return !!payload.nombres && !!payload.apellidos && !!payload.correoLaboral;
  }
}
```

**Ventajas:**
- Acciones desacopladas de UI
- Testeable sin componentes
- Undo/redo soportado
- Logging centralizado

---

## Estructura de Carpetas

```
src/app/shared/
├── atoms/
│   ├── text-input/
│   ├── button/
│   ├── icon/
│   ├── label/
│   ├── error-message/
│   ├── spinner/
│   └── atoms.module.ts
│
├── molecules/
│   ├── form-field/
│   ├── autocomplete/
│   ├── radio-card/
│   ├── button-group/
│   └── molecules.module.ts
│
├── shells/
│   ├── form-step/
│   ├── modal/
│   ├── page-layout/
│   └── shells.module.ts
│
├── commands/
│   ├── command.interface.ts
│   ├── register-collaborator.command.ts
│   ├── search-units.command.ts
│   └── commands.service.ts
│
├── utilities/
│   ├── debounce-timer.ts
│   ├── async-validator.ts
│   ├── aria-labeler.ts
│   └── error-mapper.ts
│
└── shared.module.ts (exports atoms + molecules + shells)
```

---

## Module Imports (shared.module.ts)

```typescript
import { AtomsModule } from './atoms/atoms.module';
import { MoleculesModule } from './molecules/molecules.module';
import { ShellsModule } from './shells/shells.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AtomsModule,
    MoleculesModule,
    ShellsModule,
  ],
  exports: [
    AtomsModule,
    MoleculesModule,
    ShellsModule,
  ]
})
export class SharedModule {}
```

---

## Reutilización en US-015

Usando Shell + MicroUI + Commands:

```typescript
// register-collaborator.component.ts
@Component({
  selector: 'app-register-collaborator',
  template: `
    <shell-form-step
      [steps]="formSteps"
      [currentStep]="currentStep"
      [isStepValid]="isCurrentStepValid()"
      [isSubmitting]="isSubmitting$ | async"
      (nextStep)="goToNextStep()"
      (previousStep)="goToPreviousStep()"
      (submit)="submitForm()"
    >
      <!-- Paso 1: Tipo -->
      <mol-radio-card
        *ngIf="currentStep === 0"
        label="Empleado"
        description="Trabajador de COMSATEL..."
        [value]="'empleado'"
        [selected]="form.get('tipo')?.value === 'empleado'"
        (change)="form.patchValue({tipo: $event})"
      ></mol-radio-card>

      <!-- Paso 2: Datos persona -->
      <mol-form-field
        *ngIf="currentStep === 1"
        label="Nombres *"
        [value]="form.get('nombres')?.value"
        (valueChange)="form.patchValue({nombres: $event})"
      ></mol-form-field>

      <!-- Paso 4: Correo -->
      <mol-form-field
        *ngIf="currentStep === 3"
        label="Correo laboral *"
        type="email"
        [value]="form.get('correoLaboral')?.value"
        (valueChange)="form.patchValue({correoLaboral: $event})"
      ></mol-form-field>

      <!-- Paso 5A: Unidad (combobox) -->
      <mol-autocomplete
        *ngIf="currentStep === 4 && tipo === 'empleado'"
        label="Unidad *"
        [searchFn]="searchUnidades"
        (selected)="form.patchValue({unidadId: $event.id})"
      ></mol-autocomplete>
    </shell-form-step>
  `
})
export class RegisterCollaboratorComponent {
  form: FormGroup;
  currentStep = 0;
  isSubmitting$ = new BehaviorSubject(false);

  formSteps = [
    { label: '1', title: 'Tipo de colaborador' },
    { label: '2', title: 'Datos de la persona' },
    { label: '3', title: 'Identificación' },
    { label: '4', title: 'Correo laboral' },
    { label: '5A', title: 'Unidad' },
    { label: '6', title: 'Jefe directo' },
    { label: '7', title: 'Rol-Nivel' },
    { label: '8', title: 'Revisar' },
    { label: '9', title: 'Éxito' },
  ];

  constructor(
    private fb: FormBuilder,
    private registerCommand: RegisterCollaboratorCommand,
    private searchService: SearchService
  ) {
    this.form = this.fb.group({
      tipo: ['empleado'],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      // ... resto de campos
    });
  }

  searchUnidades = (query: string) => this.searchService.searchUnidades(query);

  submitForm() {
    this.registerCommand.payload = this.form.value;
    this.isSubmitting$.next(true);

    this.registerCommand.execute().subscribe({
      next: (response) => {
        this.router.navigate(['/colaboradores/exito'], { state: { codigo: response.codigo } });
      },
      error: (error) => {
        this.showError(error.message);
      },
      complete: () => this.isSubmitting$.next(false)
    });
  }
}
```

---

## Beneficios

| Beneficio | Cómo se logra |
|-----------|--------------|
| **Reutilización** | Átomos usables en múltiples moléculas |
| **Testabilidad** | Cada capa testeable independientemente |
| **Accesibilidad** | ARIA integrada en cada átomo |
| **Mantenibilidad** | Cambios de UI centralizados en átomos |
| **Escalabilidad** | Fácil agregar nuevos átomos/moléculas |
| **Desacoplamiento** | Commands independientes de UI |
| **Reutilización de Commands** | Misma lógica en múltiples UIs |

---

## Próximos Pasos

1. ✅ ARCH-CMP-015 especificado (Shell + MicroUI + Command)
2. 👉 CMP-015 v2: Componentes implementados basados en ARCH-CMP-015
3. 👉 DTC-015: Development Context Pack completo
4. 👉 IMPL-015 Phase 1: Comenzar implementación con esta arquitectura
