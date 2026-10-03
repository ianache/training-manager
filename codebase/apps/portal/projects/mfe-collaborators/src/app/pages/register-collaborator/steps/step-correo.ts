import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { FieldState, GfAlert, GfButton, GfFormField, GfIcon, GfTextInput } from '@gf/ui';
import { RegisterWizardStore } from '../register-collaborator.store';
import { describedBy, emailDuplicateMessage } from '../register-collaborator.rules';
import { WIZARD_STYLES } from './wizard.styles';

/** SCR-015-04 — Correo laboral con validación asíncrona de unicidad (debounce 300 ms, AC-015 / E6). */
@Component({
  selector: 'gf-step-correo',
  imports: [GfFormField, GfTextInput, GfAlert, GfButton, GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fields">
      <gf-form-field
        label="Correo laboral"
        [required]="true"
        fieldId="rc-correo"
        hint="Para empleados de COMSATEL, usa el correo corporativo (@comsatel.com.pe). Para contratistas, usa el correo del proveedor."
        [state]="fieldState()"
        [message]="formatError()"
      >
        <gf-text-input
          inputId="rc-correo"
          type="email"
          autocomplete="email"
          [required]="true"
          placeholder="ejemplo@comsatel.com.pe"
          [value]="store.data().email"
          [state]="fieldState()"
          [ariaDescribedBy]="describe()"
          (valueChange)="store.setEmail($event)"
          (blur)="store.touch('email')"
        />
      </gf-form-field>

      @switch (store.emailCheck()) {
        @case ('validating') {
          <gf-alert id="rc-correo-status" tone="info" icon="refresh" heading="Validando credencial">
            <p class="alert-text">Verificando disponibilidad del correo en el sistema…</p>
          </gf-alert>
        }
        @case ('valid') {
          <gf-alert id="rc-correo-status" tone="success" icon="check_circle" heading="Correo válido">
            <p class="alert-text">Disponible para registro nuevo en la plataforma.</p>
          </gf-alert>
        }
        @case ('duplicate') {
          <gf-alert id="rc-correo-status" tone="danger" icon="error" heading="Conflicto de registro">
            <p class="alert-text">{{ duplicateText() }}</p>
            <div class="actions-inline">
              <gf-button variant="secondary" (pressed)="focusField()">
                <gf-icon name="edit" size="1rem" [decorative]="true" /> Corregir correo
              </gf-button>
            </div>
          </gf-alert>
        }
        @case ('unknown') {
          <gf-alert id="rc-correo-status" tone="warning" icon="warning" heading="No se pudo verificar ahora">
            <p class="alert-text">La disponibilidad del correo se comprobará al guardar.</p>
          </gf-alert>
        }
        @default {
          <gf-alert id="rc-correo-status" tone="info" icon="info" heading="Información">
            <p class="alert-text">Los datos serán validados automáticamente.</p>
          </gf-alert>
        }
      }
    </div>
  `,
  styles: [WIZARD_STYLES],
})
export class StepCorreo {
  protected readonly store = inject(RegisterWizardStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Solo errores de formato; los de unicidad los comunica el cuadro de estado. */
  protected formatError(): string {
    const m = this.store.fieldError('email');
    return m === 'duplicate' || m === 'validating' ? '' : m;
  }
  protected fieldState(): FieldState {
    if (this.formatError()) return 'invalid';
    switch (this.store.emailCheck()) {
      case 'validating': return 'validating';
      case 'valid': return 'valid';
      case 'duplicate': return 'invalid';
      default: return 'default';
    }
  }
  protected describe(): string {
    return describedBy('rc-correo', true, !!this.formatError(), 'rc-correo-status');
  }
  protected duplicateText(): string {
    return emailDuplicateMessage(this.store.data().email);
  }
  protected focusField(): void {
    this.host.nativeElement.querySelector<HTMLInputElement>('#rc-correo')?.focus();
  }
}
