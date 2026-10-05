import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, SessionService, ViewState, toViewState } from '@gf/core';
import {
  AutocompleteOption,
  GfAlert,
  GfAutocomplete,
  GfBreadcrumb,
  GfBreadcrumbItem,
  GfButton,
  GfDialog,
  GfEmptyState,
  GfFormField,
  GfTextInput,
  GfViewState,
} from '@gf/ui';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { OrganizationUnit } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UnitError, parseUnitError } from '../../data-access/unit-errors';
import { UNITS_URL, UnitReturnState } from '../../shared/unit-nav';

type FieldId = 'name' | 'email' | 'parent';
type Errors = Partial<Record<FieldId, string>>;

const FIELD_DOM: Record<FieldId, string> = { name: 'unit-name', email: 'unit-email', parent: 'unit-parent' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Loaded {
  unit: OrganizationUnit;
  parentName: string;
}

/**
 * SCR-029-01 (registrar unidad) y SCR-029-02 (editar nombre). Un solo componente con dos modos según `:unitId`
 * (SCR-029-Q4 abierta). El alta no pide «Fecha desde»: POST /organizations no la acepta, el servicio fija «hoy» (ver informe).
 * Los textos de error marcados «propuesto» en SCR-029 salen de las hojas de Stitch (GEN-029) y están por validar.
 */
@Component({
  selector: 'gf-unit-form-page',
  imports: [NgTemplateOutlet, RouterLink, GfAlert, GfAutocomplete, GfBreadcrumb, GfButton, GfDialog, GfEmptyState, GfFormField, GfTextInput, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './unit-form.page.scss',
  template: `
    @if (!allowed() || forbidden()) {
      <gf-empty-state [title]="editing ? 'No tiene permiso para editar unidades' : 'No tiene permiso para registrar unidades'" icon="🔒">
        <a class="gf-link-button" [routerLink]="unitsUrl">Volver a unidades</a>
      </gf-empty-state>
    } @else if (editing) {
      <gf-view-state [state]="loadState()" loadingLabel="Cargando unidad" (retry)="reload()">
        <ng-template #success let-loaded>
          <ng-container [ngTemplateOutlet]="formTpl" />
        </ng-template>
      </gf-view-state>
    } @else {
      <ng-container [ngTemplateOutlet]="formTpl" />
    }

    <ng-template #formTpl>
      <gf-breadcrumb [items]="crumbs()" (navigate)="goList()" />
      <header class="page-header">
        <h1>{{ editing ? 'Editar nombre de la unidad' : 'Registrar unidad' }}</h1>
      </header>

      @if (saveError(); as msg) {
        <gf-alert tone="danger" icon="error">
          <p>{{ msg }}</p>
          <gf-button variant="secondary" (pressed)="submit()">Reintentar</gf-button>
        </gf-alert>
      }

      @if (editing && context(); as ctx) {
        <p class="context">Unidad padre actual: <strong>{{ ctx.parentName || 'Sin unidad padre' }}</strong></p>
      }

      <form class="unit-form" novalidate (submit)="$event.preventDefault(); submit()">
        <gf-form-field label="Nombre" [required]="true" fieldId="unit-name" [state]="errors().name ? 'invalid' : 'default'" [message]="errors().name ?? ''" [statusIcon]="false">
          <gf-text-input
            inputId="unit-name"
            [required]="true"
            [maxlength]="200"
            [value]="name()"
            [state]="errors().name ? 'invalid' : 'default'"
            [ariaDescribedBy]="errors().name ? 'unit-name-msg' : ''"
            (valueChange)="onName($event)"
          />
        </gf-form-field>

        @if (!editing) {
          <gf-form-field label="Correo laboral" [required]="true" fieldId="unit-email" [state]="errors().email ? 'invalid' : 'default'" [message]="errors().email ?? ''" [statusIcon]="false">
            <gf-text-input
              inputId="unit-email"
              type="email"
              autocomplete="off"
              [required]="true"
              [value]="email()"
              [state]="errors().email ? 'invalid' : 'default'"
              [ariaDescribedBy]="errors().email ? 'unit-email-msg' : ''"
              (valueChange)="onEmail($event)"
            />
          </gf-form-field>

          <gf-form-field label="Unidad padre" [required]="parentRequired()" fieldId="unit-parent" [state]="errors().parent ? 'invalid' : 'default'" [message]="errors().parent ?? ''" [statusIcon]="false">
            <gf-autocomplete
              inputId="unit-parent"
              listLabel="Unidades activas"
              [required]="parentRequired()"
              [searchFn]="searchParent"
              [selectedText]="parentLabel()"
              [state]="errors().parent ? 'invalid' : 'default'"
              [ariaDescribedBy]="errors().parent ? 'unit-parent-msg' : ''"
              (selected)="onParent($event)"
              (textChange)="onParentText($event)"
            />
          </gf-form-field>
        }

        <div class="actions">
          <gf-button variant="primary" type="submit" [loading]="saving()" [disabled]="editing && !canSave()" (pressed)="$event.preventDefault(); submit()">{{ editing ? 'Guardar' : 'Registrar' }}</gf-button>
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
    </ng-template>
  `,
})
export class UnitFormPage {
  private readonly api = inject(OrganizationsService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly unitId = inject(ActivatedRoute).snapshot.paramMap.get('unitId');

  protected readonly unitsUrl = UNITS_URL;
  protected readonly editing = this.unitId !== null;
  protected readonly allowed = signal(inject(SessionService).hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));
  protected readonly forbidden = signal(false);

  protected readonly name = signal('');
  protected readonly email = signal('');
  private readonly parentId = signal<string | null>(null);
  protected readonly parentLabel = signal('');
  protected readonly errors = signal<Errors>({});
  protected readonly saving = signal(false);
  protected readonly saveError = signal('');
  protected readonly discardOpen = signal(false);

  private readonly nonce = signal(0);
  private version: number | null | undefined = null;

  /** Edición: la unidad y el nombre de su padre. */
  protected readonly loadState = toSignal(
    toObservable(this.nonce).pipe(
      switchMap(() => (this.unitId ? toViewState(this.loadUnit(this.unitId)) : of({ kind: 'loading' } as ViewState<Loaded>))),
    ),
    { initialValue: { kind: 'loading' } as ViewState<Loaded> },
  );
  protected readonly context = computed(() => {
    const s = this.loadState();
    return s.kind === 'success' ? s.data : null;
  });

  /** Sin ninguna unidad registrada el alta crea la superior, sin padre (SCR-029-Q3 abierta). */
  private readonly hasUnits = toSignal(this.editing ? of(true) : this.api.list({ status: 'all', limit: 1 }).pipe(map((p) => p.data.length > 0), catchError(() => of(true))), { initialValue: true });
  protected readonly parentRequired = computed(() => this.hasUnits());

  protected readonly crumbs = computed<GfBreadcrumbItem[]>(() => [
    { id: 'units', label: 'Unidades organizacionales', href: UNITS_URL },
    { id: 'here', label: this.editing ? 'Editar nombre' : 'Registrar unidad' },
  ]);
  protected readonly dirty = computed(() => (this.editing ? this.name() !== this.initialNameSig() : !!(this.name() || this.email() || this.parentId())));
  private readonly initialNameSig = signal('');
  protected readonly canSave = computed(() => !!this.name().trim() && this.name().trim() !== this.initialNameSig().trim() && !this.saving());

  constructor() {
    // Al cargar la unidad se precarga el nombre y se guarda la versión para If-Match.
    toObservable(this.loadState).subscribe((s) => {
      if (s.kind === 'success' && this.name() === '') {
        this.name.set(s.data.unit.name);
        this.initialNameSig.set(s.data.unit.name);
        this.version = s.data.unit.row_version;
      }
    });
  }

  protected readonly searchParent = (q: string): Observable<AutocompleteOption[]> =>
    this.api.list({ search: q, status: 'active', limit: 10 }).pipe(map((p) => p.data.map((u) => ({ id: u.id, label: u.name }))));

  protected onName(v: string): void {
    this.name.set(v);
    this.clear('name');
  }
  protected onEmail(v: string): void {
    this.email.set(v);
    this.clear('email');
  }
  protected onParent(o: AutocompleteOption): void {
    this.parentId.set(o.id);
    this.parentLabel.set(o.label);
    this.clear('parent');
  }
  protected onParentText(v: string): void {
    if (v !== this.parentLabel()) this.parentId.set(null);
  }

  protected goList(): void {
    void this.router.navigate([UNITS_URL]);
  }

  protected cancel(): void {
    if (this.dirty()) this.discardOpen.set(true);
    else this.goList();
  }

  protected discard(): void {
    this.discardOpen.set(false);
    this.goList();
  }

  protected reload(): void {
    this.nonce.update((n) => n + 1);
  }

  protected submit(): void {
    if (this.saving()) return;
    const errors = this.validate();
    this.errors.set(errors);
    this.saveError.set('');
    const first = (['name', 'email', 'parent'] as FieldId[]).find((f) => errors[f]);
    if (first) {
      afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>(`#${FIELD_DOM[first]}`)?.focus(), { injector: this.injector });
      return;
    }
    this.saving.set(true);
    const call = this.editing
      ? this.api.rename(this.unitId!, this.name().trim(), this.version)
      : this.api.create({ name: this.name().trim(), emailWork: this.email().trim(), parentId: this.parentId() });
    call.subscribe({
      next: (unit) => {
        this.saving.set(false);
        const state: UnitReturnState = { highlightUnitId: this.editing ? this.unitId! : unit.id, notice: this.editing ? 'Nombre actualizado' : 'Unidad registrada' };
        void this.router.navigate([UNITS_URL], { state });
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.fail(parseUnitError(err));
      },
    });
  }

  private validate(): Errors {
    const e: Errors = {};
    if (!this.name().trim()) e.name = 'Indica el nombre de la unidad';
    if (!this.editing) {
      const email = this.email().trim();
      if (!email) e.email = 'El correo laboral es obligatorio';
      else if (!EMAIL_RE.test(email)) e.email = 'Ingrese un correo válido';
      if (this.parentRequired() && !this.parentId()) e.parent = 'Indica la unidad padre';
    }
    return e;
  }

  private fail(err: UnitError): void {
    const under = this.editing ? (this.context()?.parentName ?? '') : this.parentLabel();
    switch (err.kind) {
      case 'duplicate':
        this.errors.set({ name: under ? `Ya existe una unidad con este nombre bajo ${under}` : 'Ya existe una unidad con este nombre' });
        return;
      case 'parent-inactive':
        this.errors.set({ parent: 'Solo se pueden elegir unidades activas' });
        return;
      case 'cycle':
        this.errors.set({ parent: 'Crearía un ciclo en la jerarquía' });
        return;
      case 'forbidden':
        this.forbidden.set(true);
        return;
      case 'inactive':
        this.saveError.set('La unidad está inactiva: reactívala para editarla.');
        return;
      case 'stale':
        this.saveError.set('La unidad cambió mientras la editabas. Vuelve al listado y ábrela de nuevo para ver la versión actual.');
        return;
      case 'validation': {
        const e: Errors = {};
        for (const f of Object.keys(err.fields)) {
          if (f === 'name') e.name = 'Indica el nombre de la unidad';
          else if (f.endsWith('email_work')) e.email = 'Ingrese un correo válido';
          else if (f === 'parent_id') e.parent = 'Indica la unidad padre';
        }
        if (Object.keys(e).length) {
          this.errors.set(e);
          return;
        }
        break;
      }
    }
    this.saveError.set(this.editing ? 'No se pudo guardar el cambio. Intente de nuevo.' : 'No se pudo registrar la unidad. Intente de nuevo.');
  }

  private clear(f: FieldId): void {
    if (this.errors()[f]) this.errors.update(({ [f]: _drop, ...rest }) => rest);
  }

  private loadUnit(id: string): Observable<Loaded> {
    return this.api.get(id).pipe(
      switchMap((unit) =>
        unit.parent_id ? this.api.get(unit.parent_id).pipe(map((p) => ({ unit, parentName: p.name })), catchError(() => of({ unit, parentName: '' }))) : of({ unit, parentName: '' }),
      ),
    );
  }
}
