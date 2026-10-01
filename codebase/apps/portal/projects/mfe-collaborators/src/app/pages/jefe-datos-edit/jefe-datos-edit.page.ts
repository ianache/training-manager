import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { GfTextInput, GfSelect } from '@gf/ui';
import { JefeDatosService } from '../../data-access/jefe-datos.service';

/**
 * Task 4: Jefe-Datos form (edit nombres, apellidos, nombrePreferido,
 * tipoIdentificacion, numeroIdentificacion, paisIdentificacion)
 * Standalone component following Angular 22 patterns.
 * WCAG 2.2 AA compliant.
 */
@Component({
  selector: 'gf-jefe-datos-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GfTextInput, GfSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container" role="main">
      <h1>Actualizar Datos Personales</h1>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form">
        <!-- Nombres -->
        <div class="form-field">
          <label for="nombres">Nombres *</label>
          <gf-text-input
            id="nombres"
            [control]="getControl('nombres')"
            placeholder="ej. Juan Carlos"
            [required]="true"
            ariaLabel="Nombres, campo obligatorio"
            type="text"
          />
          @if (getFieldError('nombres', 'required')) {
            <div class="error" role="alert">Campo obligatorio</div>
          }
          @if (getFieldError('nombres', 'minlength')) {
            <div class="error" role="alert">Mínimo 2 caracteres</div>
          }
        </div>

        <!-- Apellidos -->
        <div class="form-field">
          <label for="apellidos">Apellidos *</label>
          <gf-text-input
            id="apellidos"
            [control]="getControl('apellidos')"
            placeholder="ej. Pérez García"
            [required]="true"
            ariaLabel="Apellidos, campo obligatorio"
            type="text"
          />
          @if (getFieldError('apellidos', 'required')) {
            <div class="error" role="alert">Campo obligatorio</div>
          }
          @if (getFieldError('apellidos', 'minlength')) {
            <div class="error" role="alert">Mínimo 2 caracteres</div>
          }
        </div>

        <!-- Nombre Preferido -->
        <div class="form-field">
          <label for="nombrePreferido">Nombre Preferido</label>
          <gf-text-input
            id="nombrePreferido"
            [control]="getControl('nombrePreferido')"
            placeholder="ej. J.P."
            type="text"
          />
        </div>

        <!-- Tipo Identificación -->
        <div class="form-field">
          <label for="tipoIdentificacion">Tipo de Identificación *</label>
          <gf-select
            id="tipoIdentificacion"
            [control]="getControl('tipoIdentificacion')"
            ariaLabel="Tipo de identificación"
            [required]="true"
          >
            <option value="">-- Seleccionar --</option>
            <option value="DNI">DNI</option>
            <option value="CE">Carné de Extranjería</option>
            <option value="PASAPORTE">Pasaporte</option>
          </gf-select>
          @if (getFieldError('tipoIdentificacion', 'required')) {
            <div class="error" role="alert">Campo obligatorio</div>
          }
        </div>

        <!-- Número Identificación -->
        <div class="form-field">
          <label for="numeroIdentificacion">Número de Identificación *</label>
          <gf-text-input
            id="numeroIdentificacion"
            [control]="getControl('numeroIdentificacion')"
            placeholder="ej. 12345678"
            [required]="true"
            ariaLabel="Número de identificación"
            type="text"
          />
          @if (getFieldError('numeroIdentificacion', 'required')) {
            <div class="error" role="alert">Campo obligatorio</div>
          }
          @if (getFieldError('numeroIdentificacion', 'pattern')) {
            <div class="error" role="alert">Formato inválido</div>
          }
        </div>

        <!-- País Identificación -->
        <div class="form-field">
          <label for="paisIdentificacion">País de Identificación *</label>
          <gf-select
            id="paisIdentificacion"
            [control]="getControl('paisIdentificacion')"
            ariaLabel="País de identificación"
            [required]="true"
          >
            <option value="">-- Seleccionar --</option>
            <option value="PE">Perú</option>
            <option value="CO">Colombia</option>
            <option value="AR">Argentina</option>
            <option value="CL">Chile</option>
            <option value="BO">Bolivia</option>
            <option value="EC">Ecuador</option>
          </gf-select>
          @if (getFieldError('paisIdentificacion', 'required')) {
            <div class="error" role="alert">Campo obligatorio</div>
          }
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-primary"
            [disabled]="isSubmitting()"
            [attr.aria-busy]="isSubmitting()"
          >
            {{ isSubmitting() ? 'Guardando...' : 'Guardar' }}
          </button>
          <button type="button" class="btn-secondary" (click)="cancel()">
            Cancelar
          </button>
        </div>
      </form>

      <!-- Error Message -->
      @if (errorMessage()) {
        <div class="error-banner" role="alert" aria-live="polite">
          {{ errorMessage() }}
        </div>
      }

      <!-- Success Message -->
      @if (successMessage()) {
        <div class="success-banner" role="status" aria-live="polite">
          {{ successMessage() }}
        </div>
      }
    </div>
  `,
  styles: `
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: var(--gf-space-4);
    }

    h1 {
      margin-bottom: var(--gf-space-4);
      font-size: 1.75rem;
      font-weight: 600;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: var(--gf-space-4);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--gf-space-2);
    }

    label {
      font-weight: 500;
      color: var(--gf-color-text);
      font-size: 0.95rem;
    }

    .error {
      color: var(--gf-color-danger-fg);
      font-size: 0.875rem;
      margin-top: var(--gf-space-1);
    }

    .error-banner {
      background-color: var(--gf-color-danger-bg);
      border: 1px solid var(--gf-color-danger-fg);
      color: var(--gf-color-danger-fg);
      padding: var(--gf-space-3);
      border-radius: var(--gf-radius-sm);
      margin-top: var(--gf-space-4);
    }

    .success-banner {
      background-color: var(--gf-color-success-bg);
      border: 1px solid var(--gf-color-success-fg);
      color: var(--gf-color-success-fg);
      padding: var(--gf-space-3);
      border-radius: var(--gf-radius-sm);
      margin-top: var(--gf-space-4);
    }

    .form-actions {
      display: flex;
      gap: var(--gf-space-3);
      margin-top: var(--gf-space-4);
    }

    button {
      padding: var(--gf-space-2) var(--gf-space-4);
      border: none;
      border-radius: var(--gf-radius-sm);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background-color: var(--gf-color-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--gf-color-primary-dark);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--gf-color-text);
      border: 1px solid var(--gf-color-border);
    }

    .btn-secondary:hover {
      background-color: var(--gf-color-bg-secondary);
    }
  `,
})
export class JefeDatosEditPage {
  readonly partyId = input.required<string>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(JefeDatosService);

  protected readonly form = this.buildForm();
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  private buildForm(): FormGroup {
    return this.fb.group({
      nombres: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      nombrePreferido: [
        '',
        [Validators.maxLength(50)],
      ],
      tipoIdentificacion: ['', [Validators.required]],
      numeroIdentificacion: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Z0-9]+$/i),
        ],
      ],
      paisIdentificacion: ['', [Validators.required]],
    });
  }

  getControl(fieldName: string): FormControl | null {
    const control = this.form.get(fieldName);
    return control as FormControl | null;
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const control = this.form.get(fieldName);
    return !!(
      control &&
      control.hasError(errorType) &&
      control.touched
    );
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Por favor, completa los campos requeridos correctamente.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.service.updateDatos(this.partyId(), this.form.value).subscribe({
      next: () => {
        this.successMessage.set('Datos actualizados correctamente.');
        setTimeout(() => {
          this.router.navigate(['/colaboradores', this.partyId()]);
        }, 1500);
      },
      error: (error: any) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error?.message || 'Error al actualizar los datos. Por favor intenta de nuevo.'
        );
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/colaboradores', this.partyId()]);
  }
}
