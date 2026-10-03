import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { GfAlert, GfButton, GfFormField, GfIcon, GfSelect, GfTextInput } from '@gf/ui';
import { RegisterWizardStore } from '../register-collaborator.store';
import { COUNTRIES, ID_TYPES, IdType, describedBy, idDuplicateMessage } from '../register-collaborator.rules';
import { WIZARD_STYLES } from './wizard.styles';

/**
 * SCR-015-03 — Identificación.
 * El servicio no expone una consulta de unicidad de identificación: la duplicidad (E5) la devuelve
 * POST /parties (409 IDENTIFICATION_DUPLICATE) y entonces se vuelve a este paso.
 */
@Component({
  selector: 'gf-step-identificacion',
  imports: [GfFormField, GfTextInput, GfSelect, GfAlert, GfButton, GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fields">
      <gf-form-field label="Tipo de identificación" [required]="true" fieldId="rc-id-tipo" [statusIcon]="false">
        <gf-select
          inputId="rc-id-tipo"
          [required]="true"
          [value]="store.data().idType"
          (valueChange)="store.patch({ idType: $any($event) })"
        >
          @for (t of idTypes; track t.value) {
            <option [value]="t.value" [selected]="t.value === store.data().idType">{{ t.label }}</option>
          }
        </gf-select>
      </gf-form-field>

      <gf-form-field
        label="Número"
        [required]="true"
        fieldId="rc-id-numero"
        [state]="numberState()"
        [message]="numberMessage()"
      >
        <gf-text-input
          inputId="rc-id-numero"
          autocomplete="off"
          [maxlength]="20"
          [required]="true"
          placeholder="Ej. 12345678"
          [value]="store.data().idNumber"
          [state]="numberState()"
          [ariaDescribedBy]="describe()"
          (valueChange)="store.patch({ idNumber: $event })"
          (blur)="store.touch('idNumber')"
        />
      </gf-form-field>

      <gf-form-field label="País emisor" [required]="true" fieldId="rc-id-pais" [statusIcon]="false">
        <gf-select
          inputId="rc-id-pais"
          [required]="true"
          [value]="store.data().idCountry"
          (valueChange)="store.patch({ idCountry: $event })"
        >
          @for (c of countries; track c.code) {
            <option [value]="c.code" [selected]="c.code === store.data().idCountry">{{ c.name }}</option>
          }
        </gf-select>
      </gf-form-field>

      @if (store.idConflict()) {
        <gf-alert id="rc-id-status" tone="danger" icon="error">
          <p class="alert-text">{{ duplicateText() }}</p>
          <div class="actions-inline">
            <gf-button variant="secondary" (pressed)="fixNumber()">
              <gf-icon name="edit" size="1rem" [decorative]="true" /> Corregir identificación
            </gf-button>
          </div>
        </gf-alert>
      } @else {
        <gf-alert id="rc-id-status" tone="info" icon="info">
          <p class="alert-text">Los datos serán validados automáticamente.</p>
        </gf-alert>
      }
    </div>
  `,
  styles: [WIZARD_STYLES],
})
export class StepIdentificacion {
  protected readonly store = inject(RegisterWizardStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly idTypes = ID_TYPES as ReadonlyArray<{ value: IdType; label: string }>;
  protected readonly countries = COUNTRIES;

  protected numberState(): 'default' | 'invalid' {
    return this.store.idConflict() || this.store.fieldError('idNumber') ? 'invalid' : 'default';
  }
  protected numberMessage(): string {
    return this.store.idConflict() ? '' : this.store.fieldError('idNumber');
  }
  protected describe(): string {
    return describedBy('rc-id-numero', false, !!this.numberMessage(), 'rc-id-status');
  }
  protected duplicateText(): string {
    return idDuplicateMessage(this.store.data());
  }
  protected fixNumber(): void {
    this.host.nativeElement.querySelector<HTMLInputElement>('#rc-id-numero')?.focus();
  }
}
