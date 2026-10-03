import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { GfAlert, GfAutocomplete, GfButton, GfFormField, GfIcon } from '@gf/ui';
import type { AutocompleteOption } from '@gf/ui';
import { RegisterCollaboratorApi } from '../register-collaborator.api';
import { RegisterWizardStore } from '../register-collaborator.store';
import { E_MESSAGES } from '../register-collaborator.rules';
import { WIZARD_STYLES } from './wizard.styles';

/** SCR-015-06 — Jefe directo (solo Empleado, BR-PTY-19). Solo colaboradores vigentes. */
@Component({
  selector: 'gf-step-jefe',
  imports: [GfFormField, GfAutocomplete, GfAlert, GfButton, GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fields">
      <gf-form-field label="Jefe directo" [required]="true" fieldId="rc-jefe" [state]="state()" [statusIcon]="false">
        <gf-autocomplete
          inputId="rc-jefe"
          placeholder="Buscar colaborador…"
          [required]="true"
          [searchIcon]="true"
          [state]="state()"
          [ariaDescribedBy]="store.managerStale() ? 'rc-jefe-status' : 'rc-jefe-note'"
          listLabel="Colaboradores vigentes"
          loadingText="Consultando padrón…"
          emptyText="No se encontraron colaboradores vigentes"
          [selectedText]="store.data().manager?.label ?? ''"
          [searchFn]="search"
          (selected)="choose($event)"
        />
      </gf-form-field>

      <div class="selection" [class.selection--ok]="!!store.data().manager && !store.managerStale()" role="group" aria-label="Selección actual">
        <p class="eyebrow">Selección actual</p>
        @if (store.data().manager; as m) {
          <div class="split split--center">
            <div>
              <p class="alert-title">{{ m.label }}</p>
              @if (m.sublabel) {
                <p class="alert-text">{{ m.sublabel }}</p>
              }
            </div>
            @if (!store.managerStale()) {
              <span class="badge-ok">Vigente</span>
            }
          </div>
        } @else {
          <p class="muted">Ningún colaborador seleccionado</p>
        }
      </div>

      @if (store.managerStale()) {
        <gf-alert id="rc-jefe-status" tone="danger" icon="warning">
          <p class="alert-title">{{ staleMessage }}</p>
          <div class="actions-inline">
            <gf-button variant="secondary" (pressed)="selectOther()">
              <gf-icon name="edit" size="1rem" [decorative]="true" /> Seleccionar otra
            </gf-button>
          </div>
        </gf-alert>
      }

      <div class="note" id="rc-jefe-note">
        <gf-icon name="info" size="1.125rem" [decorative]="true" />
        <p>Solo colaboradores vigentes pueden ser jefe directo.</p>
      </div>
    </div>
  `,
  styles: [
    WIZARD_STYLES,
    `.badge-ok { font-size: 0.75rem; padding: 2px var(--gf-space-2); border-radius: var(--gf-radius-sm); background: var(--gf-color-success-bg); color: var(--gf-color-success-fg); font-weight: var(--gf-font-weight-semibold); }`,
  ],
})
export class StepJefe {
  protected readonly store = inject(RegisterWizardStore);
  private readonly api = inject(RegisterCollaboratorApi);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly staleMessage = E_MESSAGES.E7_MANAGER;

  protected readonly search = (q: string) => this.api.searchManagers(q);

  protected state(): 'default' | 'valid' | 'invalid' {
    if (this.store.managerStale()) return 'invalid';
    return this.store.data().manager ? 'valid' : 'default';
  }
  protected choose(o: AutocompleteOption): void {
    this.store.patch({ manager: { id: o.id, label: o.label, sublabel: o.sublabel } });
    this.store.touch('manager');
  }
  protected selectOther(): void {
    this.store.patch({ manager: null });
    queueMicrotask(() => this.host.nativeElement.querySelector<HTMLInputElement>('#rc-jefe')?.focus());
  }
}
