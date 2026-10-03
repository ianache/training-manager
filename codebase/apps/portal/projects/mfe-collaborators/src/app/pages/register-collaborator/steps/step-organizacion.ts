import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, inject, signal } from '@angular/core';
import { GfAlert, GfAutocomplete, GfButton, GfFormField, GfIcon, GfSpinner } from '@gf/ui';
import type { AutocompleteOption } from '@gf/ui';
import { Observable } from 'rxjs';
import { RegisterCollaboratorApi } from '../register-collaborator.api';
import { RegisterWizardStore } from '../register-collaborator.store';
import { E_MESSAGES, Option } from '../register-collaborator.rules';
import { WIZARD_STYLES } from './wizard.styles';

type Availability = 'loading' | 'ready' | 'empty';

/**
 * SCR-015-05 — Unidad (Empleado) o Proveedor (Contratista).
 * Estados: cargando, vacío (E2/E3), por defecto, seleccionada, no vigente (E7).
 * Hoy no existe servicio de unidades/proveedores: la consulta falla y se muestra E2/E3.
 */
@Component({
  selector: 'gf-step-organizacion',
  imports: [GfFormField, GfAutocomplete, GfAlert, GfButton, GfIcon, GfSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (availability()) {
      @case ('loading') {
        <div class="stack" aria-live="polite">
          <p class="muted"><gf-spinner [label]="'Cargando ' + noun().plural" /> Cargando {{ noun().plural }}…</p>
        </div>
      }
      @case ('empty') {
        <div class="panel-empty" role="status">
          <span class="icon-circle"><gf-icon [name]="isContractor() ? 'work' : 'business'" size="2rem" [decorative]="true" /></span>
          <h3>{{ emptyMessage() }}</h3>
          <p>{{ emptyHelp() }}</p>
          <div class="btn-row">
            <gf-button variant="secondary" [disabled]="true" [ariaLabel]="createLabel() + ' (disponible con ' + createStory() + ')'">
              <gf-icon name="person_add" size="1rem" [decorative]="true" /> {{ createLabel() }}
            </gf-button>
            <gf-button variant="secondary" (pressed)="store.back()">Volver</gf-button>
          </div>
        </div>
      }
      @default {
        <div class="fields">
          <gf-form-field
            [label]="noun().label"
            [required]="true"
            fieldId="rc-org"
            [state]="state()"
            [statusIcon]="false"
          >
            <gf-autocomplete
              inputId="rc-org"
              [placeholder]="isContractor() ? 'Buscar proveedor…' : 'Buscar unidad…'"
              [required]="true"
              [state]="state()"
              [ariaDescribedBy]="stale() ? 'rc-org-status' : ''"
              [listLabel]="'Resultados de ' + noun().plural"
              [loadingText]="'Cargando ' + noun().plural + '…'"
              [emptyText]="'Sin coincidencias'"
              [selectedText]="store.data().organization?.label ?? ''"
              [searchFn]="search"
              (selected)="choose($event)"
            />
          </gf-form-field>

          @if (stale()) {
            <gf-alert id="rc-org-status" tone="danger" icon="error">
              <p class="alert-title">{{ staleMessage() }}</p>
              <div class="actions-inline">
                <gf-button variant="secondary" (pressed)="selectOther()">
                  <gf-icon name="refresh" size="1rem" [decorative]="true" /> Seleccionar otra
                </gf-button>
              </div>
            </gf-alert>
          } @else if (store.data().organization; as org) {
            <div class="selection selection--set" role="group" [attr.aria-label]="noun().selected">
              <div class="split">
                <div>
                  <p class="eyebrow">{{ noun().selected }}:</p>
                  <p class="alert-title">{{ org.label }}</p>
                  @if (org.sublabel) {
                    <p class="alert-text">{{ org.sublabel }}</p>
                  }
                </div>
                <gf-button variant="text" ariaLabel="Quitar selección" (pressed)="clear()">
                  <gf-icon name="close" [decorative]="true" />
                </gf-button>
              </div>
            </div>
          }
        </div>
      }
    }
  `,
  styles: [WIZARD_STYLES],
})
export class StepOrganizacion implements OnInit {
  protected readonly store = inject(RegisterWizardStore);
  private readonly api = inject(RegisterCollaboratorApi);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly availability = signal<Availability>('loading');

  protected isContractor(): boolean {
    return this.store.data().type === 'Contractor';
  }
  protected noun(): { label: string; plural: string; selected: string } {
    return this.isContractor()
      ? { label: 'Proveedor', plural: 'proveedores', selected: 'Proveedor homologado' }
      : { label: 'Unidad', plural: 'unidades', selected: 'Unidad seleccionada' };
  }
  protected emptyMessage(): string {
    return this.isContractor() ? E_MESSAGES.E3 : E_MESSAGES.E2;
  }
  protected emptyHelp(): string {
    return this.isContractor()
      ? 'El contratista debe vincularse obligatoriamente a una razón social activa.'
      : 'Es necesario asociar una estructura operativa antes de continuar.';
  }
  protected createLabel(): string {
    return this.isContractor() ? 'Crear proveedor' : 'Crear unidad';
  }
  protected createStory(): string {
    return this.isContractor() ? 'US-018' : 'US-017';
  }
  protected stale(): boolean {
    return this.store.organizationStale();
  }
  protected staleMessage(): string {
    return this.isContractor() ? E_MESSAGES.E7_PROVIDER : E_MESSAGES.E7_UNIT;
  }
  protected state(): 'default' | 'valid' | 'invalid' {
    if (this.stale()) return 'invalid';
    return this.store.data().organization ? 'valid' : 'default';
  }

  protected readonly search = (q: string): Observable<AutocompleteOption[]> =>
    this.isContractor() ? this.api.searchProviders(q) : this.api.searchUnits(q);

  ngOnInit(): void {
    // Sondeo inicial: sin registros (o sin servicio) no hay nada que elegir → E2/E3.
    const sub = this.search('').subscribe({
      next: (rows) => this.availability.set(rows.length ? 'ready' : 'empty'),
      error: () => this.availability.set('empty'),
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  protected choose(o: AutocompleteOption): void {
    const option: Option = { id: o.id, label: o.label, sublabel: o.sublabel };
    this.store.patch({ organization: option });
    this.store.touch('organization');
  }
  protected clear(): void {
    this.store.patch({ organization: null });
    this.focusInput();
  }
  protected selectOther(): void {
    this.clear();
  }
  private focusInput(): void {
    queueMicrotask(() => this.host.nativeElement.querySelector<HTMLInputElement>('#rc-org')?.focus());
  }
}
