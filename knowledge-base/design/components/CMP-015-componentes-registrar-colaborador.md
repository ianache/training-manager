---
type: Component Specification
title: "CMP-015 — Componentes reutilizables: Registrar un colaborador"
description: "Especificación de componentes Angular y Material Design 3 para el flujo de registro de colaboradores."
tags: [ux-ui, components, party, h1, material-design-3]
status: draft
generated:
  by: "component-architect/1.0"
  at: "2026-10-01T00:00:00-05:00"
sources:
  - id: scr-015
    resource: /knowledge-base/design/screens/SCR-015-registrar-un-colaborador.md
  - id: ac-015
    resource: /knowledge-base/design/acceptance-criteria/AC-015-registrar-un-colaborador.md
  - id: gen-015
    resource: /knowledge-base/design/generations/GEN-015-stitch-registrar-colaborador.md
---

> **Decisión de `human:ianache` (2026-10-02): se usan los componentes `gf-*` de `@gf/ui`, no Angular Material.** Las referencias `mat-*` de este documento son históricas; el equivalente vigente está en el [catálogo atómico](dtc-015/atomic-component-catalog.md) (`gf-text-input`, `gf-select`, `gf-autocomplete`, `gf-date-input`, …). No se reescribe el detalle: no implementar con Material.

# CMP-015 — Componentes Reutilizables

## Trazabilidad

- **Especificación pantallas:** SCR-015
- **Criterios de aceptación:** AC-015
- **Generación Stitch:** GEN-015
- **Framework:** Angular 22 + Material Design 3
- **Design System:** Fleet Telematics & Security Enterprise (Primary: #0B3C68, Secondary: #0F52BA, Tertiary: #0D9488)

---

## Componentes Base (Material Angular)

### **1. CMP-Form-Step**

**Propósito:** Contenedor de paso del formulario con progreso.

**Props:**
```typescript
interface FormStepProps {
  stepNumber: number;          // Ej: 1
  totalSteps: number;          // Ej: 5
  title: string;               // "Paso 1 de 5: Datos de la persona"
  subtitle?: string;           // "¿Qué tipo de colaborador deseas registrar?"
  showBackButton?: boolean;    // Default: true
}
```

**Variantes:**
- Paso 1 (inicio): Sin [Atrás]
- Paso intermedio: Con [Atrás] y [Siguiente]
- Paso final: [Guardar] + [Cancelar]

**Componentes internos:**
- Progress bar (stepper horizontal)
- Card wrapper (Material elevation Level 1)
- Slot para contenido (form fields)
- Action buttons (flex row)

**Material Components:**
```typescript
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
```

---

### **2. CMP-Text-Input**

**Propósito:** Campo texto con validación inline, label, help text, error message.

**Props:**
```typescript
interface TextInputProps {
  label: string;               // "Nombres *"
  value: string;
  placeholder?: string;        // "ej. Juan Carlos"
  type: 'text' | 'email';
  required: boolean;
  error?: string;              // "Requerido" o validación mensaje
  helperText?: string;         // "Si el usuario prefiere..."
  disabled?: boolean;
  aria-required?: boolean;
  aria-invalid?: boolean;
  onBlur: (value: string) => void;
  onChange: (value: string) => void;
}
```

**Variantes:**
- Estado normal (focus outline #0F52BA)
- Estado error (border rojo #EF4444, msg error inline)
- Estado validado (✓ checkmark verde #0D9488)
- State disabled (background #F1F5F9, text #94A3B8)

**Material Components:**
```typescript
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
```

**Template:**
```html
<mat-form-field appearance="outline" class="w-full">
  <mat-label>{{ label }}</mat-label>
  <input matInput 
    [type]="type"
    [formControl]="control"
    [placeholder]="placeholder"
    (blur)="onBlur($event)"
    [required]="required"
    [attr.aria-required]="required"
    [attr.aria-invalid]="control.invalid && control.touched"
  />
  <mat-error *ngIf="control.hasError('required')">{{ error }}</mat-error>
  <mat-hint *ngIf="helperText">{{ helperText }}</mat-hint>
  <!-- Success icon -->
  <mat-suffix *ngIf="control.valid && control.value">
    <mat-icon class="text-green-600">check_circle</mat-icon>
  </mat-suffix>
</mat-form-field>
```

---

### **3. CMP-Select-Dropdown**

**Propósito:** Dropdown single-select para tipos, países, roles.

**Props:**
```typescript
interface SelectDropdownProps {
  label: string;               // "Tipo de identificación *"
  options: Array<{value: any, label: string}>;
  selected?: any;
  required: boolean;
  error?: string;
  disabled?: boolean;
  (selectionChange): (value: any) => void;
}
```

**Variantes:**
- Closed state
- Open state (lista visible)
- Error state (rojo border)
- Disabled state

**Material Components:**
```typescript
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
```

**Template:**
```html
<mat-form-field appearance="outline" class="w-full">
  <mat-label>{{ label }}</mat-label>
  <mat-select [formControl]="control" (selectionChange)="onSelectionChange($event)">
    <mat-option *ngFor="let opt of options" [value]="opt.value">
      {{ opt.label }}
    </mat-option>
  </mat-select>
  <mat-error *ngIf="control.invalid">{{ error }}</mat-error>
</mat-form-field>
```

---

### **4. CMP-Combobox-Search**

**Propósito:** Combobox con búsqueda real-time y resultados dinámicos (unidad, proveedor, jefe, rol).

**Props:**
```typescript
interface ComboboxSearchProps {
  label: string;               // "Unidad *"
  placeholder: string;         // "Buscar unidad..."
  options: Array<{id: string, label: string, subtitle?: string}>;
  selected?: {id: string, label: string};
  required: boolean;
  isLoading?: boolean;
  error?: string;
  disabled?: boolean;
  (search): (query: string) => Observable<any[]>;  // Async search
  (selectionChange): (value: any) => void;
}
```

**Variantes:**
- Closed (placeholder visible)
- Open (results list visible)
- Loading (spinner)
- Selected (confirmation text below)
- Error state
- Empty state (sin resultados)

**Material Components:**
```typescript
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
```

**ARIA Patterns:**
- `role="combobox"` en input
- `aria-expanded="true/false"` cuando abre/cierra
- `aria-controls="options-id"` linkea a listbox
- `aria-autocomplete="list"` para autocompletar
- `role="listbox"` en contenedor resultados
- `role="option"` en cada resultado

**Template:**
```html
<mat-form-field appearance="outline" class="w-full">
  <mat-label>{{ label }}</mat-label>
  <input matInput 
    [formControl]="control"
    [matAutocomplete]="auto"
    [placeholder]="placeholder"
    (blur)="onBlur()"
    role="combobox"
    [attr.aria-expanded]="isOpen"
    [attr.aria-required]="required"
  />
  <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
  
  <mat-autocomplete #auto="matAutocomplete" [displayWith]="displayFn">
    <mat-option *ngFor="let opt of filteredOptions$ | async" [value]="opt">
      {{ opt.label }}
      <span *ngIf="opt.subtitle" class="text-gray-500">{{ opt.subtitle }}</span>
    </mat-option>
  </mat-autocomplete>
</mat-form-field>

<!-- Confirmation text below -->
<p *ngIf="selected" class="text-gray-500 text-sm mt-2">
  Seleccionado: {{ selected.label }}
</p>
```

**Debounce & Async:**
```typescript
search(query: string): Observable<any[]> {
  return of(query).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(q => this.api.search(this.endpoint, q)),
    catchError(() => of([]))
  );
}
```

---

### **5. CMP-Radio-Card**

**Propósito:** Tarjeta interactiva con radio button (Empleado vs Contratista).

**Props:**
```typescript
interface RadioCardProps {
  label: string;               // "Empleado"
  description: string;         // "Trabajador de COMSATEL con..."
  icon?: string;               // Material icon name
  value: any;
  selected: boolean;
  (change): (value: any) => void;
}
```

**Variantes:**
- Unselected: border 1px #E2E8F0, background #FFFFFF
- Selected: border 2px #0B3C68, background #E3EEFC, checkmark
- Hover: border #94A3B8, elevation Level 2

**Material Components:**
```typescript
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
```

**Template:**
```html
<mat-card 
  class="cursor-pointer p-4"
  [class.selected]="selected"
  (click)="select()"
>
  <mat-card-header>
    <mat-radio-button 
      [value]="value" 
      [checked]="selected"
      (change)="change.emit($event.value)"
    >
      <strong>{{ label }}</strong>
    </mat-radio-button>
    <mat-icon *ngIf="selected" class="absolute top-4 right-4">check_circle</mat-icon>
  </mat-card-header>
  
  <mat-card-content>
    <p class="text-gray-600 text-sm">{{ description }}</p>
  </mat-card-content>
</mat-card>
```

---

### **6. CMP-Date-Input**

**Propósito:** Date picker para "Vigente desde".

**Props:**
```typescript
interface DateInputProps {
  label: string;               // "Vigente desde *"
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  required: boolean;
  error?: string;
  (change): (date: Date) => void;
}
```

**Material Components:**
```typescript
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
```

**Template:**
```html
<mat-form-field appearance="outline" class="w-full">
  <mat-label>{{ label }}</mat-label>
  <input matInput [matDatepicker]="picker" 
    [formControl]="control"
    [required]="required"
    (change)="change.emit($event.value)"
  />
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
  <mat-error *ngIf="control.invalid">{{ error }}</mat-error>
</mat-form-field>
```

---

### **7. CMP-Error-Alert**

**Propósito:** Mensaje de error inline (AC-5, AC-6, E7, E8, E10).

**Props:**
```typescript
interface ErrorAlertProps {
  message: string;             // "DNI 12345678 (Perú) ya existe"
  type: 'error' | 'warning' | 'info';
  icon?: string;               // Default: error_outline
  dismissable?: boolean;
}
```

**Variantes:**
- Error (rojo #BA1A1A)
- Warning (ámbar)
- Info (azul)

**Material Components:**
```typescript
import { MatIconModule } from '@angular/material/icon';
```

**Template:**
```html
<div class="flex items-start gap-2 p-3 rounded-lg" 
  [ngClass]="{
    'bg-red-50 border-red-200 text-red-900': type === 'error',
    'bg-yellow-50 border-yellow-200 text-yellow-900': type === 'warning'
  }"
  role="alert"
  aria-live="polite"
>
  <mat-icon class="text-lg">{{ icon }}</mat-icon>
  <p class="text-sm">{{ message }}</p>
</div>
```

---

### **8. CMP-Success-Icon**

**Propósito:** Icono de éxito con animación (SCR-015-09).

**Props:**
```typescript
interface SuccessIconProps {
  size?: 'small' | 'large';    // Default: large
  showAnimation?: boolean;     // Default: true
}
```

**Material Components:**
```typescript
import { MatIconModule } from '@angular/material/icon';
```

**Template & Animation:**
```html
<div class="flex justify-center mb-6">
  <mat-icon 
    class="text-8xl text-teal-600" 
    [@fadeInScale]="'in'"
  >
    check_circle
  </mat-icon>
</div>
```

**Animation:**
```typescript
@Component({
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
```

---

### **9. CMP-Loading-Button**

**Propósito:** Botón con loading state (Guardar, Siguiente).

**Props:**
```typescript
interface LoadingButtonProps {
  label: string;               // "Guardar" | "Siguiente"
  type: 'primary' | 'secondary'; // Primary: #0B3C68, Secondary: outline
  isLoading: boolean;
  disabled?: boolean;
  (click): () => void;
}
```

**Material Components:**
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
```

**Template:**
```html
<button mat-raised-button 
  [color]="type === 'primary' ? 'primary' : ''"
  [disabled]="isLoading || disabled"
  (click)="click.emit()"
  class="w-full"
>
  <mat-spinner *ngIf="isLoading" diameter="20" class="mr-2"></mat-spinner>
  {{ label }}
</button>
```

---

### **10. CMP-Confirmation-Dialog**

**Propósito:** Dialog para confirmación (Cancelar, Delete, etc).

**Props:**
```typescript
interface ConfirmationDialogProps {
  title: string;               // "¿Descartar los cambios?"
  message: string;
  confirmLabel?: string;       // "Descartar"
  cancelLabel?: string;        // "Continuar"
  (confirmed): () => void;
  (cancelled): () => void;
}
```

**Material Components:**
```typescript
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
```

**Template:**
```html
<h2 mat-dialog-title>{{ title }}</h2>
<mat-dialog-content>
  <p>{{ message }}</p>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button (click)="cancelled.emit()">{{ cancelLabel }}</button>
  <button mat-raised-button color="warn" (click)="confirmed.emit()">
    {{ confirmLabel }}
  </button>
</mat-dialog-actions>
```

---

### **11. CMP-Copy-Button**

**Propósito:** Botón [Copiar] con toast de confirmación (código generado).

**Props:**
```typescript
interface CopyButtonProps {
  text: string;                // "a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d"
  successMessage?: string;     // "✓ Copiado" (default)
  (copied): () => void;
}
```

**Material Components:**
```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
```

**Logic:**
```typescript
copy() {
  navigator.clipboard.writeText(this.text)
    .then(() => {
      this.snackBar.open(this.successMessage, '', { duration: 2000 });
      this.copied.emit();
    })
    .catch(() => {
      // Fallback: manual selection
      const el = document.createElement('textarea');
      el.value = this.text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
}
```

---

## Estructura de Carpetas

```
src/app/
├── shared/
│   ├── components/
│   │   ├── cmp-form-step/
│   │   │   ├── form-step.component.ts
│   │   │   ├── form-step.component.html
│   │   │   └── form-step.component.scss
│   │   ├── cmp-text-input/
│   │   ├── cmp-select-dropdown/
│   │   ├── cmp-combobox-search/
│   │   ├── cmp-radio-card/
│   │   ├── cmp-date-input/
│   │   ├── cmp-error-alert/
│   │   ├── cmp-success-icon/
│   │   ├── cmp-loading-button/
│   │   ├── cmp-confirmation-dialog/
│   │   └── cmp-copy-button/
│   └── shared.module.ts
│
├── features/
│   └── party-management/
│       ├── pages/
│       │   ├── register-collaborator/
│       │   │   ├── register-collaborator.component.ts
│       │   │   ├── register-collaborator.component.html
│       │   │   └── register-collaborator.component.scss
│       │   ├── register-step-type/
│       │   ├── register-step-data/
│       │   ├── register-step-contact/
│       │   └── ...
│       ├── services/
│       │   ├── collaborator.service.ts
│       │   └── validation.service.ts
│       └── party-management.module.ts
```

---

## Módulo Compartido

**shared.module.ts:**
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CmpFormStepComponent } from './components/cmp-form-step/form-step.component';
import { CmpTextInputComponent } from './components/cmp-text-input/text-input.component';
// ... import otros componentes

@NgModule({
  declarations: [
    CmpFormStepComponent,
    CmpTextInputComponent,
    // ...
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    // ... otros Material modules
  ],
  exports: [
    CmpFormStepComponent,
    CmpTextInputComponent,
    // ...
  ]
})
export class SharedModule {}
```

---

## Uso en Formulario de Registro

**register-collaborator.component.ts:**
```typescript
@Component({
  selector: 'app-register-collaborator',
  templateUrl: './register-collaborator.component.html',
  styleUrls: ['./register-collaborator.component.scss']
})
export class RegisterCollaboratorComponent implements OnInit {
  form!: FormGroup;
  currentStep = 1;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private collaboratorService: CollaboratorService,
    private validationService: ValidationService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      tipo: ['empleado', Validators.required],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      nombrePreferido: [''],
      tipoIdentificacion: ['DNI', Validators.required],
      numeroIdentificacion: ['', [Validators.required]],
      paisIdentificacion: ['Perú', Validators.required],
      correoLaboral: ['', [Validators.required, Validators.email]],
      unidad: ['', Validators.required],
      jefeDirecto: ['', Validators.required],
      rol: ['', Validators.required],
      nivel: ['', Validators.required],
      fechaDesde: [new Date(), Validators.required]
    }, {
      validators: [
        this.validationService.validarDuplicadoIdentificacion(),
        this.validationService.validarDuplicadoCorreo(),
      ]
    });
  }

  async guardar() {
    if (this.form.invalid) {
      // Mark all fields as touched para mostrar errores
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    try {
      const result = await this.collaboratorService.registrar(this.form.value).toPromise();
      // Navigate to success page con código generado
      this.router.navigate(['/colaboradores/exito'], { state: { codigo: result.codigo } });
    } catch (error) {
      // Manejar error con modal
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }
}
```

---

## Próximos pasos

1. ✅ CMP-015 especificado
2. 👉 Usar Superpowers para crear plan de implementación
3. 👉 Ejecutar plan: crear componentes + servicio + páginas
4. 👉 Tests: unit + integration + E2E
