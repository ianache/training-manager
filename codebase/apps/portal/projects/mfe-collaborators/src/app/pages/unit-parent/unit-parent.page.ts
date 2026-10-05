import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, SessionService, ViewState, toViewState } from '@gf/core';
import {
  AutocompleteOption,
  GfAlert,
  GfAutocomplete,
  GfBadge,
  GfBreadcrumb,
  GfBreadcrumbItem,
  GfButton,
  GfDateInput,
  GfDialog,
  GfEmptyState,
  GfFormField,
  GfViewState,
} from '@gf/ui';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { OrganizationUnit } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UnitError, parseUnitError } from '../../data-access/unit-errors';
import { UNITS_URL, UnitReturnState } from '../../shared/unit-nav';
import { formatDate } from '../unit-list/unit-list.page';

const NO_PARENT = 'Sin unidad padre';

interface Loaded {
  unit: OrganizationUnit;
  parentName: string;
  /** Fecha desde de la relación vigente (historial), '' si no hay. */
  currentFrom: string;
  /** La propia unidad y sus descendientes: no pueden ser su padre (BR-PTY-22). */
  excluded: ReadonlySet<string>;
}

/**
 * SCR-029-03 — Cambiar unidad padre: selector (solo activas, sin la unidad ni sus descendientes), fecha desde y
 * resumen «{unidad}: de X a Y» en un diálogo antes de confirmar (decisión 2026-10-03). La concurrencia usa la
 * row_version cargada como If-Match. Los descendientes excluidos salen de una sola consulta (hasta 100).
 */
@Component({
  selector: 'gf-unit-parent-page',
  imports: [NgTemplateOutlet, RouterLink, GfAlert, GfAutocomplete, GfBadge, GfBreadcrumb, GfButton, GfDateInput, GfDialog, GfEmptyState, GfFormField, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './unit-parent.page.scss',
  template: `
    @if (!allowed() || forbidden()) {
      <gf-empty-state title="No tiene permiso para cambiar la unidad padre" icon="🔒">
        <a class="gf-link-button" [routerLink]="unitsUrl">Volver a unidades</a>
      </gf-empty-state>
    } @else {
      <gf-view-state [state]="loadState()" loadingLabel="Cargando unidad" (retry)="reload()">
        <ng-template #success let-loaded>
          <ng-container [ngTemplateOutlet]="body" [ngTemplateOutletContext]="{ $implicit: loaded }" />
        </ng-template>
      </gf-view-state>
    }

    <ng-template #body let-loaded>
      <gf-breadcrumb [items]="crumbs(loaded)" (navigate)="goList()" />
      <header class="page-header"><h1>Cambiar unidad padre</h1></header>

      @if (saveError(); as msg) {
        <gf-alert tone="danger" icon="error">
          <p>{{ msg }}</p>
          @if (retryable()) {
            <gf-button variant="secondary" (pressed)="apply()">Reintentar</gf-button>
          }
        </gf-alert>
      }

      <section class="current" aria-labelledby="current-title">
        <h2 id="current-title">Unidad padre actual</h2>
        <p>
          <strong>{{ loaded.parentName || noParent }}</strong>
          @if (loaded.currentFrom) {
            <gf-badge tone="success">Vigente desde {{ fmt(loaded.currentFrom) }}</gf-badge>
          }
        </p>
        <a class="gf-link-button" [routerLink]="[unitsUrl, loaded.unit.id, 'historial']">Ver historial de relaciones</a>
      </section>

      <form class="unit-form" novalidate (submit)="$event.preventDefault(); next(loaded)">
        <gf-form-field label="Nueva unidad padre" [required]="true" fieldId="unit-parent" [state]="errors().parent ? 'invalid' : 'default'" [message]="errors().parent ?? ''" [statusIcon]="false">
          <gf-autocomplete
            inputId="unit-parent"
            listLabel="Unidades activas"
            [required]="true"
            [searchFn]="searchFn(loaded)"
            [selectedText]="parentLabel()"
            [state]="errors().parent ? 'invalid' : 'default'"
            [ariaDescribedBy]="errors().parent ? 'unit-parent-msg' : ''"
            (selected)="onParent($event)"
            (textChange)="onParentText($event)"
          />
        </gf-form-field>
        <gf-form-field label="Fecha desde" [required]="true" fieldId="unit-from-date" [state]="errors().date ? 'invalid' : 'default'" [message]="errors().date ?? ''" [statusIcon]="false">
          <gf-date-input inputId="unit-from-date" [required]="true" [value]="fromDate()" [invalid]="!!errors().date" [ariaDescribedBy]="errors().date ? 'unit-from-date-msg' : ''" (valueChange)="onDate($event)" />
        </gf-form-field>
        <div class="actions">
          <gf-button variant="primary" type="submit" [disabled]="saving()" (pressed)="$event.preventDefault(); next(loaded)">Continuar</gf-button>
          <gf-button variant="secondary" [disabled]="saving()" (pressed)="goList()">Cancelar</gf-button>
        </div>
      </form>

      <gf-dialog [(open)]="summaryOpen" heading="Confirmar cambio de unidad padre" initialFocus="cancel" [busy]="saving()">
        <p gfDialogBody>{{ loaded.unit.name }}: de {{ loaded.parentName || noParent }} a {{ parentLabel() }}</p>
        <div gfDialogActions>
          <gf-button variant="secondary" data-gf-dialog-cancel [disabled]="saving()" (pressed)="summaryOpen.set(false)">Volver</gf-button>
          <gf-button variant="primary" [loading]="saving()" (pressed)="apply()">Confirmar</gf-button>
        </div>
      </gf-dialog>
    </ng-template>
  `,
})
export class UnitParentPage {
  private readonly api = inject(OrganizationsService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly unitId = inject(ActivatedRoute).snapshot.paramMap.get('unitId')!;

  protected readonly unitsUrl = UNITS_URL;
  protected readonly noParent = NO_PARENT;
  protected readonly fmt = formatDate;
  protected readonly allowed = signal(inject(SessionService).hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));
  protected readonly forbidden = signal(false);

  private readonly parentId = signal<string | null>(null);
  protected readonly parentLabel = signal('');
  protected readonly fromDate = signal('');
  protected readonly errors = signal<{ parent?: string; date?: string }>({});
  protected readonly saving = signal(false);
  protected readonly saveError = signal('');
  protected readonly retryable = signal(false);
  protected readonly summaryOpen = signal(false);

  private readonly nonce = signal(0);
  private loaded: Loaded | null = null;

  protected readonly loadState = toSignal(
    toObservable(this.nonce).pipe(switchMap(() => toViewState(this.load()))),
    { initialValue: { kind: 'loading' } as ViewState<Loaded> },
  );

  protected crumbs(l: Loaded): GfBreadcrumbItem[] {
    return [
      { id: 'units', label: 'Unidades organizacionales', href: UNITS_URL },
      { id: 'unit', label: l.unit.name },
      { id: 'here', label: 'Cambiar unidad padre' },
    ];
  }

  protected searchFn(l: Loaded) {
    return (q: string): Observable<AutocompleteOption[]> =>
      this.api.list({ search: q, status: 'active', limit: 10 }).pipe(
        map((p) => p.data.filter((u) => !l.excluded.has(u.id)).map((u) => ({ id: u.id, label: u.name }))),
      );
  }

  protected onParent(o: AutocompleteOption): void {
    this.parentId.set(o.id);
    this.parentLabel.set(o.label);
    this.errors.update((e) => ({ ...e, parent: undefined }));
  }
  protected onParentText(v: string): void {
    if (v !== this.parentLabel()) this.parentId.set(null);
  }
  protected onDate(v: string): void {
    this.fromDate.set(v);
    this.errors.update((e) => ({ ...e, date: undefined }));
  }

  protected goList(): void {
    void this.router.navigate([UNITS_URL]);
  }
  protected reload(): void {
    this.nonce.update((n) => n + 1);
  }

  /** «Continuar»: valida y abre el resumen. */
  protected next(l: Loaded): void {
    this.loaded = l;
    this.saveError.set('');
    const errors: { parent?: string; date?: string } = {};
    if (!this.parentId()) errors.parent = 'Indica la nueva unidad padre';
    if (!this.fromDate()) errors.date = 'Indica la fecha desde';
    this.errors.set(errors);
    const first = errors.parent ? 'unit-parent' : errors.date ? 'unit-from-date' : null;
    if (first) {
      afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>(`#${first}`)?.focus(), { injector: this.injector });
      return;
    }
    this.summaryOpen.set(true);
  }

  /** «Confirmar» del resumen (y «Reintentar»). */
  protected apply(): void {
    const l = this.loaded;
    if (!l || this.saving()) return;
    this.saving.set(true);
    this.api.changeParent(l.unit.id, { parent_id: this.parentId(), from_date: this.fromDate() }, l.unit.row_version).subscribe({
      next: () => {
        this.saving.set(false);
        const state: UnitReturnState = { highlightUnitId: l.unit.id, notice: 'Unidad padre actualizada' };
        void this.router.navigate([UNITS_URL], { state });
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.summaryOpen.set(false);
        this.fail(parseUnitError(err));
      },
    });
  }

  private fail(err: UnitError): void {
    this.retryable.set(false);
    switch (err.kind) {
      case 'cycle':
        this.errors.set({ parent: 'Crearía un ciclo en la jerarquía' });
        return;
      case 'parent-inactive':
        this.errors.set({ parent: 'Solo se pueden elegir unidades activas' });
        return;
      case 'duplicate':
        this.errors.set({ parent: `Ya existe una unidad con este nombre bajo ${this.parentLabel()}` });
        return;
      case 'forbidden':
        this.forbidden.set(true);
        return;
      case 'inactive':
        this.saveError.set('La unidad está inactiva: reactívala para moverla.');
        return;
      case 'stale':
        this.saveError.set('La unidad cambió mientras la editabas. Vuelve al listado y ábrela de nuevo para ver la versión actual.');
        return;
      case 'validation':
        if (err.fields['from_date']) {
          this.errors.set({ date: err.fields['from_date'] });
          return;
        }
        break;
    }
    this.saveError.set('No se pudo cambiar la unidad padre. Intente de nuevo.');
    this.retryable.set(true);
  }

  private load(): Observable<Loaded> {
    return this.api.get(this.unitId).pipe(
      switchMap((unit) =>
        forkJoin({
          parentName: unit.parent_id ? this.api.get(unit.parent_id).pipe(map((p) => p.name), catchError(() => of(''))) : of(''),
          currentFrom: this.api.relationships(unit.id).pipe(
            map((p) => p.data.find((r) => !r.thru_date)?.from_date ?? ''),
            catchError(() => of('')),
          ),
          excluded: this.api.list({ ancestorId: unit.id, status: 'all', limit: 100 }).pipe(
            map((p) => new Set([unit.id, ...p.data.map((u) => u.id)])),
            catchError(() => of(new Set([unit.id]))),
          ),
        }).pipe(map((x) => ({ unit, ...x }))),
      ),
    );
  }
}
