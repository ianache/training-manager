import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GfRadioCard } from '@gf/ui';
import { RegisterWizardStore } from '../register-collaborator.store';
import { WIZARD_STYLES } from './wizard.styles';

/** SCR-015-01 — Seleccionar tipo de colaborador. Sin selección inicial: «Siguiente» queda deshabilitado (Stitch). */
@Component({
  selector: 'gf-step-tipo',
  imports: [GfRadioCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack" role="radiogroup" aria-labelledby="rc-tipo-question" [attr.aria-required]="true">
      <gf-radio-card
        name="tipo"
        value="Employee"
        label="Empleado"
        description="Trabajador de COMSATEL con unidad organizacional, jefe directo y correo @comsatel.com.pe"
        [checked]="store.data().type === 'Employee'"
        (selected)="store.setType('Employee')"
      />
      <gf-radio-card
        name="tipo"
        value="Contractor"
        label="Contratista"
        description="Trabajador externo con proveedor y correo del proveedor"
        [checked]="store.data().type === 'Contractor'"
        (selected)="store.setType('Contractor')"
      />
    </div>
  `,
  styles: [WIZARD_STYLES],
})
export class StepTipo {
  protected readonly store = inject(RegisterWizardStore);
}
