import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterCollaboratorService } from '../../core/services/register-collaborator.service';
import { DuplicateIdValidator } from '../../shared/validators/duplicate-id.validator';
import { DuplicateEmailValidator } from '../../shared/validators/duplicate-email.validator';

@Component({
  selector: 'app-register-collaborator',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container">
      <h1>Registrar Colaborador</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <!-- Form content will be populated by 9 step components -->
        <button type="submit">Guardar</button>
      </form>
      <div *ngIf="error" class="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: auto;
      padding: var(--gf-space-4);
    }
    .error {
      color: var(--gf-color-danger-fg);
      margin-top: var(--gf-space-4);
    }
  `]
})
export class RegisterCollaboratorPage implements OnInit {
  form!: FormGroup;
  currentStep = 0;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterCollaboratorService,
    private duplicateIdValidator: DuplicateIdValidator,
    private duplicateEmailValidator: DuplicateEmailValidator,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      tipo: ['empleado', [Validators.required]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      nombrePreferido: [''],
      tipoIdentificacion: ['DNI', [Validators.required]],
      numeroIdentificacion: ['', [Validators.required], [this.duplicateIdValidator as any]],
      paisIdentificacion: ['Perú', [Validators.required]],
      correoLaboral: ['', [Validators.required, Validators.email], [this.duplicateEmailValidator as any]],
      unidadId: [''],
      jefeDirectoId: [''],
      proveedorId: [''],
      rolId: ['', [Validators.required]],
      nivelId: ['', [Validators.required]],
      fechaDesde: [new Date(), [Validators.required]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.registerService.register(this.form.value).subscribe({
      next: (response) => {
        this.router.navigate(['/colaboradores/exito'], {
          state: { codigo: response.codigo }
        });
      },
      error: (error) => {
        this.error = error.message;
      }
    });
  }
}
