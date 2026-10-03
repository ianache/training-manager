import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GfFormField, GfTextInput } from '@gf/ui';
import { RegisterWizardStore } from '../register-collaborator.store';
import { describedBy } from '../register-collaborator.rules';
import { WIZARD_STYLES } from './wizard.styles';

/** SCR-015-02 — Datos de la persona (ambos tipos). */
@Component({
  selector: 'gf-step-datos',
  imports: [GfFormField, GfTextInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fields">
      <gf-form-field
        label="Nombres"
        [required]="true"
        fieldId="rc-nombres"
        [state]="store.fieldError('firstNames') ? 'invalid' : 'default'"
        [message]="store.fieldError('firstNames')"
      >
        <gf-text-input
          inputId="rc-nombres"
          autocomplete="given-name"
          [maxlength]="100"
          [required]="true"
          [value]="store.data().firstNames"
          [state]="store.fieldError('firstNames') ? 'invalid' : 'default'"
          [ariaDescribedBy]="describe('rc-nombres', false, store.fieldError('firstNames'))"
          (valueChange)="store.patch({ firstNames: $event })"
          (blur)="store.touch('firstNames')"
        />
      </gf-form-field>

      <gf-form-field
        label="Apellidos"
        [required]="true"
        fieldId="rc-apellidos"
        [state]="store.fieldError('lastNames') ? 'invalid' : 'default'"
        [message]="store.fieldError('lastNames')"
      >
        <gf-text-input
          inputId="rc-apellidos"
          autocomplete="family-name"
          [maxlength]="100"
          [required]="true"
          [value]="store.data().lastNames"
          [state]="store.fieldError('lastNames') ? 'invalid' : 'default'"
          [ariaDescribedBy]="describe('rc-apellidos', false, store.fieldError('lastNames'))"
          (valueChange)="store.patch({ lastNames: $event })"
          (blur)="store.touch('lastNames')"
        />
      </gf-form-field>

      <gf-form-field
        label="Nombre preferido (opcional)"
        fieldId="rc-preferido"
        hint="Si el usuario prefiere un nombre corto o un apodo, indícalo."
        [state]="store.fieldError('preferredName') ? 'invalid' : 'default'"
        [message]="store.fieldError('preferredName')"
      >
        <gf-text-input
          inputId="rc-preferido"
          [maxlength]="100"
          [value]="store.data().preferredName"
          [state]="store.fieldError('preferredName') ? 'invalid' : 'default'"
          [ariaDescribedBy]="describe('rc-preferido', true, store.fieldError('preferredName'))"
          (valueChange)="store.patch({ preferredName: $event })"
          (blur)="store.touch('preferredName')"
        />
      </gf-form-field>
    </div>
  `,
  styles: [WIZARD_STYLES],
})
export class StepDatos {
  protected readonly store = inject(RegisterWizardStore);
  protected describe(id: string, hint: boolean, message: string): string {
    return describedBy(id, hint, !!message);
  }
}
