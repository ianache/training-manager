import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppRole, SessionService } from '@gf/core';
import { GfAlert, GfButton, GfDialog, GfFormField, GfSelect, GfTextInput } from '@gf/ui';
import { UnitError, parseUnitError } from '../../data-access/unit-errors';
import { OrganizationsService } from '../../data-access/organizations.service';
import { INTERNAL_ORG_URL } from '../../shared/unit-nav';

type FieldId = 'name' | 'ruc';
type Errors = Partial<Record<FieldId, string>>;

const FIELD_DOM: Record<FieldId, string> = { name: 'org-name', ruc: 'org-ruc' };
const MSG = {
  nameRequired: 'Indica la razón social',
  rucRequired: 'Indica el RUC',
  rucFormat: 'El RUC debe tener 11 dígitos',
  // «propuesto»: SCR-017 no fija el texto exacto de la identificación de persona (invalid-identification-type)
  rucPerson: 'Ingresa un RUC: no se admite el DNI ni otra identificación de persona',
  // BR-PTY-07: el texto «La identificación ya existe» lo fija SCR-017-02
  rucDuplicate: 'La identificación ya existe',
  // «propuesto»
  saveError: 'No se pudo registrar la organización interna. Intenta de nuevo.',
  registered: 'Organización interna registrada',
  alreadyExists: 'Ya existe una organización interna registrada.',
} as const;

/**
 * SCR-017-02 — alta inicial única de la organización interna (decisión de ianache del 2026-10-05, EVD-2026-0242;
 * BR-PTY-28 enmendada). Solo Jefe de Ingeniería y ADMIN. Sin edición ni baja.
 * - País emisor: Perú fijo (API-SPEC-007 §2.1 solo acepta PE); se muestra como lista con un valor, deshabilitada.
 * - Vigencia desde: solo lectura, la fija el sistema (la fecha del servidor); no se pide ni se envía (FLW-017-Q1, supuesto).
 * Textos marcados «propuesto» en las constantes MSG no tienen fuente en SCR-017 y están por validar con UX.
 */
@Component({
  selector: 'gf-internal-organization-form-page',
  imports: [GfAlert, GfButton, GfDialog, GfFormField, GfSelect, GfTextInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './internal-organization-form.page.scss',
  template: `
    @if (!allowed() || forbidden()) {
      <section class="forbidden" tabindex="-1" aria-labelledby="forbidden-title">
        <h1 id="forbidden-title">Acceso no autorizado</h1>
        <p>No tienes permiso para gestionar la organización interna.</p>
      </section>
    } @else {
      <header class="page-header"><h1>Registrar organización interna</h1></header>

      @if (saveError(); as msg) {
        <gf-alert tone="danger" icon="error">
          <p>{{ msg }}</p>
          <gf-button variant="secondary" (pressed)="submit()">Reintentar</gf-button>
        </gf-alert>
      }

      <form class="org-form" novalidate (submit)="$event.preventDefault(); submit()">
        <gf-form-field label="Razón social" [required]="true" fieldId="org-name" [state]="errors().name ? 'invalid' : 'default'" [message]="errors().name ?? ''" [statusIcon]="false">
          <gf-text-input
            inputId="org-name"
            autocomplete="off"
            [required]="true"
            [maxlength]="200"
            [value]="name()"
            [state]="errors().name ? 'invalid' : 'default'"
            [ariaDescribedBy]="errors().name ? 'org-name-msg' : ''"
            (valueChange)="onName($event)"
          />
        </gf-form-field>

        <gf-form-field label="RUC" [required]="true" fieldId="org-ruc" [state]="errors().ruc ? 'invalid' : 'default'" [message]="errors().ruc ?? ''" [statusIcon]="false">
          <gf-text-input
            inputId="org-ruc"
            autocomplete="off"
            [required]="true"
            [maxlength]="11"
            [value]="ruc()"
            [state]="errors().ruc ? 'invalid' : 'default'"
            [ariaDescribedBy]="errors().ruc ? 'org-ruc-msg' : ''"
            (valueChange)="onRuc($event)"
          />
        </gf-form-field>

        <gf-form-field label="País emisor" [required]="true" fieldId="org-country" hint="Por ahora solo Perú (propuesto)." [statusIcon]="false">
          <gf-select inputId="org-country" value="PE" [disabled]="true" [required]="true">
            <option value="PE" selected>Perú</option>
          </gf-select>
        </gf-form-field>

        <div class="readonly">
          <span class="readonly__label" id="org-from-label">Vigencia desde</span>
          <p class="readonly__value" aria-labelledby="org-from-label">La fija el sistema al registrar (propuesto)</p>
        </div>

        <div class="actions">
          <gf-button variant="primary" type="submit" [loading]="saving()" [disabled]="hasErrors()" (pressed)="$event.preventDefault(); submit()">Registrar</gf-button>
          <gf-button variant="secondary" [disabled]="saving()" (pressed)="cancel()">Cancelar</gf-button>
        </div>
      </form>

      <gf-dialog [(open)]="discardOpen" heading="¿Descartar los cambios?" initialFocus="cancel">
        <p gfDialogBody>Los datos que escribiste no se han guardado.</p>
        <div gfDialogActions>
          <gf-button variant="secondary" data-gf-dialog-cancel (pressed)="discardOpen.set(false)">Seguir editando</gf-button>
          <gf-button variant="destructive" (pressed)="discard()">Descartar</gf-button>
        </div>
      </gf-dialog>
    }
  `,
})
export class InternalOrganizationFormPage {
  private readonly api = inject(OrganizationsService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly allowed = signal(inject(SessionService).hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));
  protected readonly forbidden = signal(false);

  protected readonly name = signal('');
  protected readonly ruc = signal('');
  protected readonly errors = signal<Errors>({});
  protected readonly saving = signal(false);
  protected readonly saveError = signal('');
  protected readonly discardOpen = signal(false);

  protected readonly dirty = computed(() => !!(this.name() || this.ruc()));
  protected readonly hasErrors = computed(() => Object.keys(this.errors()).length > 0);

  protected onName(v: string): void {
    this.name.set(v);
    this.clear('name');
  }

  protected onRuc(v: string): void {
    this.ruc.set(v);
    this.clear('ruc');
  }

  protected cancel(): void {
    if (this.dirty()) this.discardOpen.set(true);
    else this.goBack();
  }

  protected discard(): void {
    this.discardOpen.set(false);
    this.goBack();
  }

  protected submit(): void {
    if (this.saving()) return;
    const errors = this.validate();
    this.errors.set(errors);
    this.saveError.set('');
    const first = (['name', 'ruc'] as FieldId[]).find((f) => errors[f]);
    if (first) {
      this.focus(first);
      return;
    }
    this.saving.set(true);
    this.api.createInternalOrganization({ name: this.name().trim(), ruc: this.ruc().trim() }).subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate([INTERNAL_ORG_URL], { state: { notice: MSG.registered } });
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.fail(parseUnitError(err));
      },
    });
  }

  private validate(): Errors {
    const e: Errors = {};
    const ruc = this.ruc().trim();
    if (!this.name().trim()) e.name = MSG.nameRequired;
    if (!ruc) e.ruc = MSG.rucRequired;
    else if (/^\d{8}$/.test(ruc)) e.ruc = MSG.rucPerson;
    else if (!/^\d{11}$/.test(ruc)) e.ruc = MSG.rucFormat;
    return e;
  }

  private fail(err: UnitError): void {
    switch (err.kind) {
      case 'duplicate':
        this.errors.set({ ruc: MSG.rucDuplicate });
        this.focus('ruc');
        return;
      case 'internal-exists':
        // otra sesión ya la registró: SCR-017-01 se vuelve a consultar y muestra la organización
        void this.router.navigate([INTERNAL_ORG_URL], { state: { notice: MSG.alreadyExists } });
        return;
      case 'forbidden':
        this.forbidden.set(true);
        return;
      case 'validation': {
        const e: Errors = {};
        if ('name' in err.fields) e.name = MSG.nameRequired;
        if ('ruc' in err.fields) e.ruc = MSG.rucFormat;
        if (Object.keys(e).length) {
          this.errors.set(e);
          this.focus(e.name ? 'name' : 'ruc');
          return;
        }
        break;
      }
    }
    this.saveError.set(MSG.saveError);
  }

  private focus(field: FieldId): void {
    afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>(`#${FIELD_DOM[field]}`)?.focus(), { injector: this.injector });
  }

  private clear(f: FieldId): void {
    if (this.errors()[f]) this.errors.update(({ [f]: _drop, ...rest }) => rest);
  }

  private goBack(): void {
    void this.router.navigate([INTERNAL_ORG_URL]);
  }
}
