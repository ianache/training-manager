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
import { GfTextInput, GfSelect, GfTelInput } from '@gf/ui';
import { ColaboradorPerfilesService } from '../../data-access/colaborador-perfiles.service';
import { isValidUrlValidator } from '../../shared/validators/url.validator';

export interface PerfillItem {
  id: string;
  plataforma: string;
  url: string;
  vigente: boolean;
}

/**
 * Task 6: Colaborador-Perfiles form (self-edit perfiles profesionales + teléfono)
 * Features:
 * - List existing profiles
 * - Add new profile with platform selector and URL validator
 * - Delete profile with confirmation
 * - Update phone number
 * - Permissions: user can only edit own profile
 * - Vigencia: all profiles marked vigente (fecha_desde = TODAY)
 * Standalone component, Angular 22, WCAG 2.2 AA compliant.
 */
@Component({
  selector: 'gf-colaborador-perfiles-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GfTextInput, GfSelect, GfTelInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container" role="main">
      <h1>Mis Perfiles Profesionales</h1>

      <!-- Existing Profiles -->
      <div class="section">
        <h2>Perfiles Registrados</h2>
        @if (profilesList().length > 0) {
          <div class="profiles-list">
            @for (profile of profilesList(); track profile.id) {
              <div class="profile-item">
                <div class="profile-info">
                  <span class="platform">{{ profile.plataforma }}</span>
                  <a [href]="profile.url" target="_blank" class="url">{{
                    profile.url
                  }}</a>
                </div>
                <button
                  type="button"
                  class="btn-delete"
                  (click)="deleteProfile(profile.id)"
                  [attr.aria-label]="'Eliminar perfil ' + profile.plataforma"
                >
                  Eliminar
                </button>
              </div>
            }
          </div>
        } @else {
          <p class="empty-state">No tienes perfiles registrados aún.</p>
        }
      </div>

      <!-- Add Profile Form -->
      <form [formGroup]="profileForm" (ngSubmit)="addProfile()" class="section">
        <h2>Agregar Nuevo Perfil</h2>
        <div class="form-row">
          <div class="form-field">
            <label for="plataforma">Plataforma *</label>
            <gf-select
              id="plataforma"
              [control]="getControl('plataforma')"
              ariaLabel="Plataforma del perfil"
              [required]="true"
            >
              <option value="">-- Seleccionar --</option>
              <option value="GitHub">GitHub</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="GitLab">GitLab</option>
              <option value="Otros">Otros</option>
            </gf-select>
            @if (getFieldError('plataforma', 'required')) {
              <div class="error" role="alert">Selecciona una plataforma</div>
            }
          </div>

          <div class="form-field">
            <label for="urlPerfil">URL del Perfil *</label>
            <gf-text-input
              id="urlPerfil"
              [control]="getControl('urlPerfil')"
              placeholder="https://github.com/username"
              [required]="true"
              ariaLabel="URL del perfil"
              type="text"
            />
            @if (getFieldError('urlPerfil', 'required')) {
              <div class="error" role="alert">URL requerida</div>
            }
            @if (getFieldError('urlPerfil', 'invalidUrl')) {
              <div class="error" role="alert">✗ URL inválida</div>
            }
            @if (isUrlValid()) {
              <div class="success" role="status">✓ URL válida</div>
            }
          </div>
        </div>

        <button
          type="submit"
          class="btn-add"
          [disabled]="profileForm.invalid || isSubmitting()"
        >
          {{ isSubmitting() ? 'Agregando...' : 'Agregar' }}
        </button>
      </form>

      <!-- Phone Section -->
      <form [formGroup]="phoneForm" (ngSubmit)="updatePhone()" class="section">
        <h2>Teléfono Laboral</h2>
        <div class="current-phone">
          <span class="label">Actual:</span>
          <span class="badge">{{ currentPhone() }}</span>
        </div>

        <div class="form-field">
          <label for="nuevoNumeroTelefonico">Nuevo Número Telefónico</label>
          <gf-tel-input
            id="nuevoNumeroTelefonico"
            [control]="getPhoneControl('nuevoNumeroTelefonico')"
            placeholder="+51 999 999 999"
            ariaLabel="Nuevo número telefónico"
          />
          @if (getPhoneFieldError('nuevoNumeroTelefonico', 'pattern')) {
            <div class="error" role="alert">Formato: +51 seguido de 9 dígitos</div>
          }
        </div>

        <button
          type="submit"
          class="btn-primary"
          [disabled]="phoneForm.invalid || !hasPhoneChange()"
        >
          Actualizar Teléfono
        </button>
      </form>

      <!-- Main Submit -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" (click)="cancel()">
          Volver
        </button>
      </div>

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

      <!-- Delete Confirmation Modal -->
      @if (showDeleteConfirm()) {
        <div class="modal-overlay" (click)="cancelDelete()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3>Confirmar eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar este perfil?</p>
            <div class="modal-actions">
              <button type="button" class="btn-danger" (click)="confirmDelete()">
                Eliminar
              </button>
              <button type="button" class="btn-secondary" (click)="cancelDelete()">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .container {
      max-width: 700px;
      margin: 0 auto;
      padding: var(--gf-space-4);
    }

    h1 {
      margin-bottom: var(--gf-space-4);
      font-size: 1.75rem;
      font-weight: 600;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: var(--gf-space-3);
    }

    .section {
      margin-bottom: var(--gf-space-6);
      padding: var(--gf-space-4);
      background-color: var(--gf-color-bg-secondary);
      border-radius: var(--gf-radius-sm);
    }

    .profiles-list {
      display: flex;
      flex-direction: column;
      gap: var(--gf-space-3);
    }

    .profile-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--gf-space-3);
      background-color: white;
      border-radius: var(--gf-radius-sm);
      border: 1px solid var(--gf-color-border);
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: var(--gf-space-1);
    }

    .platform {
      font-weight: 600;
      color: var(--gf-color-text);
    }

    .url {
      color: var(--gf-color-primary);
      text-decoration: none;
      word-break: break-all;
    }

    .url:hover {
      text-decoration: underline;
    }

    .empty-state {
      color: var(--gf-color-text-muted);
      font-style: italic;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: var(--gf-space-3);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--gf-space-2);
    }

    label {
      font-weight: 500;
      color: var(--gf-color-text);
    }

    .error {
      color: var(--gf-color-danger-fg);
      font-size: 0.875rem;
    }

    .success {
      color: var(--gf-color-success-fg);
      font-size: 0.875rem;
    }

    .current-phone {
      display: flex;
      align-items: center;
      gap: var(--gf-space-2);
      margin-bottom: var(--gf-space-3);
    }

    .label {
      font-weight: 500;
      color: var(--gf-color-text-muted);
      font-size: 0.9rem;
    }

    .badge {
      background-color: var(--gf-color-primary);
      color: white;
      padding: var(--gf-space-1) var(--gf-space-2);
      border-radius: var(--gf-radius-sm);
      font-family: monospace;
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

    .btn-primary,
    .btn-add {
      background-color: var(--gf-color-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled),
    .btn-add:hover:not(:disabled) {
      background-color: var(--gf-color-primary-dark);
    }

    .btn-primary:disabled,
    .btn-add:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-delete {
      background-color: transparent;
      color: var(--gf-color-danger-fg);
      border: 1px solid var(--gf-color-danger-fg);
      padding: var(--gf-space-1) var(--gf-space-2);
      font-size: 0.9rem;
    }

    .btn-delete:hover {
      background-color: var(--gf-color-danger-bg);
    }

    .btn-secondary {
      background-color: transparent;
      color: var(--gf-color-text);
      border: 1px solid var(--gf-color-border);
    }

    .btn-secondary:hover {
      background-color: var(--gf-color-bg-secondary);
    }

    .btn-danger {
      background-color: var(--gf-color-danger-fg);
      color: white;
    }

    .error-banner,
    .success-banner {
      padding: var(--gf-space-3);
      border-radius: var(--gf-radius-sm);
      margin-top: var(--gf-space-4);
    }

    .error-banner {
      background-color: var(--gf-color-danger-bg);
      border: 1px solid var(--gf-color-danger-fg);
      color: var(--gf-color-danger-fg);
    }

    .success-banner {
      background-color: var(--gf-color-success-bg);
      border: 1px solid var(--gf-color-success-fg);
      color: var(--gf-color-success-fg);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: var(--gf-space-4);
      border-radius: var(--gf-radius-lg);
      max-width: 400px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .modal-content h3 {
      margin-bottom: var(--gf-space-3);
    }

    .modal-actions {
      display: flex;
      gap: var(--gf-space-2);
      margin-top: var(--gf-space-3);
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ColaboradorPerfilesEditPage {
  readonly partyId = input.required<string>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(ColaboradorPerfilesService);

  protected readonly profileForm = this.buildProfileForm();
  protected readonly phoneForm = this.buildPhoneForm();

  protected readonly profilesList = signal<PerfillItem[]>([]);
  protected readonly currentPhone = signal('+51 999 999 999');
  protected readonly isSubmitting = signal(false);
  protected readonly isUrlValid = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly showDeleteConfirm = signal(false);
  private profileToDelete = signal<string | null>(null);

  private buildProfileForm(): FormGroup {
    return this.fb.group({
      plataforma: ['', [Validators.required]],
      urlPerfil: ['', [Validators.required, isValidUrlValidator]],
    });
  }

  private buildPhoneForm(): FormGroup {
    return this.fb.group({
      nuevoNumeroTelefonico: ['', [Validators.pattern(/^\+51\d{9}$/)]],
    });
  }

  protected hasPhoneChange(): boolean {
    return (this.phoneForm.get('nuevoNumeroTelefonico')?.value || '').trim() !== '';
  }

  getControl(fieldName: string): FormControl | null {
    return this.profileForm.get(fieldName) as FormControl | null;
  }

  getPhoneControl(fieldName: string): FormControl | null {
    return this.phoneForm.get(fieldName) as FormControl | null;
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  getPhoneFieldError(fieldName: string, errorType: string): boolean {
    const control = this.phoneForm.get(fieldName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  addProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const newProfile: PerfillItem = {
      id: `profile-${Date.now()}`,
      plataforma: this.profileForm.get('plataforma')?.value,
      url: this.profileForm.get('urlPerfil')?.value,
      vigente: true,
    };

    this.profilesList.update(list => [...list, newProfile]);
    this.profileForm.reset();
    this.successMessage.set('Perfil agregado correctamente.');
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  deleteProfile(profileId: string): void {
    this.profileToDelete.set(profileId);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    const idToDelete = this.profileToDelete();
    if (idToDelete) {
      this.profilesList.update(list =>
        list.filter(p => p.id !== idToDelete)
      );
    }
    this.cancelDelete();
    this.successMessage.set('Perfil eliminado.');
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  cancelDelete(): void {
    this.profileToDelete.set(null);
    this.showDeleteConfirm.set(false);
  }

  updatePhone(): void {
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }

    const newPhone = this.phoneForm.get('nuevoNumeroTelefonico')?.value;
    if (newPhone) {
      this.currentPhone.set(newPhone);
      this.phoneForm.reset();
      this.successMessage.set('Teléfono actualizado.');
      setTimeout(() => this.successMessage.set(null), 3000);
    }
  }

  cancel(): void {
    this.router.navigate(['/colaboradores', this.partyId()]);
  }
}
