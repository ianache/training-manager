import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, SessionService, ViewState, toViewState } from '@gf/core';
import { GfAlert, GfButton, GfDateInput, GfDescriptionItem, GfDescriptionList, GfDialog, GfEmptyState, GfFormField, GfViewState } from '@gf/ui';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { OrganizationUnit } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UnitError, parseUnitError } from '../../data-access/unit-errors';
import { UNITS_URL, UnitReturnState } from '../../shared/unit-nav';
import { formatDate } from '../unit-list/unit-list.page';

interface Loaded {
  unit: OrganizationUnit;
  parent: OrganizationUnit | null;
}

/**
 * SCR-030-03 (reactivar con «Fecha desde») y SCR-030-04 (bloqueo por padre inactivo) en un mismo diálogo con dos
 * variantes. No se envía `parent_id`: el servicio conserva el padre con el que se desactivó. Sin valor por defecto
 * para la fecha (SCR-030-Q2 abierta). Textos propuestos (SCR-030-Q4).
 */
@Component({
  selector: 'gf-unit-reactivate-page',
  imports: [NgTemplateOutlet, RouterLink, GfAlert, GfButton, GfDateInput, GfDescriptionList, GfDialog, GfEmptyState, GfFormField, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!allowed()) {
      <gf-empty-state title="No tiene permiso para reactivar unidades" icon="🔒">
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
      @if (loaded.unit.status === 'active') {
        <gf-alert tone="info" icon="info">
          <p>{{ loaded.unit.name }} ya está activa.</p>
          <a class="gf-link-button" [routerLink]="unitsUrl">Volver a unidades</a>
        </gf-alert>
      } @else {
        <gf-dialog
          [open]="open()"
          (openChange)="open.set($event)"
          [heading]="blockedParent() ? 'No se puede reactivar ' + loaded.unit.name : 'Reactivar ' + loaded.unit.name"
          [role]="blockedParent() ? 'alertdialog' : 'dialog'"
          [busy]="saving()"
          (closed)="onClosed(loaded.unit)"
        >
          <div gfDialogBody>
            @if (blockedParent(); as p) {
              <gf-alert tone="danger" icon="error">
                No se puede reactivar: la unidad padre {{ p.name }} está inactiva. Reactívala primero.
              </gf-alert>
              <p><a class="gf-link-button" [routerLink]="[unitsUrl, p.id, 'reactivar']">Reactivar {{ p.name }}</a></p>
            } @else {
              <gf-description-list [items]="items(loaded)" layout="inline" />
              @if (error(); as e) {
                <gf-alert tone="danger" icon="error"><p>{{ e }}</p></gf-alert>
              }
              <gf-form-field label="Fecha desde" [required]="true" fieldId="unit-from-date" [state]="dateError() ? 'invalid' : 'default'" [message]="dateError()" [statusIcon]="false">
                <gf-date-input inputId="unit-from-date" [required]="true" [value]="fromDate()" [invalid]="!!dateError()" [ariaDescribedBy]="dateError() ? 'unit-from-date-msg' : ''" (valueChange)="onDate($event)" />
              </gf-form-field>
            }
          </div>
          <div gfDialogActions>
            @if (blockedParent()) {
              <gf-button variant="primary" data-close (pressed)="open.set(false)">Cerrar</gf-button>
            } @else {
              <gf-button variant="secondary" data-gf-dialog-cancel [disabled]="saving()" (pressed)="open.set(false)">Cancelar</gf-button>
              <gf-button variant="primary" [loading]="saving()" [ariaLabel]="(error() ? 'Reintentar' : 'Reactivar') + ' ' + loaded.unit.name" (pressed)="reactivate(loaded.unit)">{{ error() ? 'Reintentar' : 'Reactivar' }}</gf-button>
            }
          </div>
        </gf-dialog>
      }
    </ng-template>
  `,
})
export class UnitReactivatePage {
  private readonly api = inject(OrganizationsService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly unitId = inject(ActivatedRoute).snapshot.paramMap.get('unitId')!;

  protected readonly unitsUrl = UNITS_URL;
  protected readonly allowed = signal(inject(SessionService).hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));
  protected readonly open = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly dateError = signal('');
  protected readonly fromDate = signal('');
  protected readonly blockedParent = signal<{ id: string; name: string } | null>(null);
  private readonly nonce = signal(0);
  private seeded = false;

  protected readonly loadState = toSignal(
    this.allowed() ? toObservable(this.nonce).pipe(switchMap(() => toViewState(this.load()))) : of({ kind: 'loading' } as ViewState<Loaded>),
    { initialValue: { kind: 'loading' } as ViewState<Loaded> },
  );

  constructor() {
    // Padre ya inactivo: bloqueo sin intentar reactivar (FLW-030-Q4 abierta: aquí se evita el viaje al servidor).
    toObservable(this.loadState).subscribe((s) => {
      if (s.kind === 'success' && !this.seeded) {
        this.seeded = true;
        if (s.data.unit.status === 'inactive' && s.data.parent?.status === 'inactive') this.block(s.data.parent.id, s.data.parent.name);
      }
    });
  }

  protected items(l: Loaded): GfDescriptionItem[] {
    const parent = l.parent ? `${l.parent.name} (${l.parent.status === 'active' ? 'Activa' : 'Inactiva'})` : 'Sin unidad padre';
    const hasta = l.unit.thru_date ? ` · Hasta ${formatDate(l.unit.thru_date)}` : '';
    return [
      { id: 'prev', term: 'Vigencia anterior', value: `Desde ${formatDate(l.unit.from_date)}${hasta}` },
      { id: 'parent', term: 'Unidad padre', value: parent },
    ];
  }

  protected onDate(v: string): void {
    this.fromDate.set(v);
    this.dateError.set('');
  }

  protected reload(): void {
    this.nonce.update((n) => n + 1);
  }

  protected reactivate(unit: OrganizationUnit): void {
    if (this.saving()) return;
    if (!this.fromDate()) {
      this.dateError.set('Indica la fecha desde');
      afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>('#unit-from-date')?.focus(), { injector: this.injector });
      return;
    }
    this.saving.set(true);
    this.api.reactivate(unit.id, { from_date: this.fromDate() }, unit.row_version).subscribe({
      next: () => {
        this.saving.set(false);
        const state: UnitReturnState = { highlightUnitId: unit.id, notice: `Unidad reactivada: ${unit.name} ahora figura como Activa` };
        void this.router.navigate([UNITS_URL], { state });
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.fail(parseUnitError(err));
      },
    });
  }

  /** Escape, fondo, «Cancelar» y «Cerrar»: vuelve al listado sin cambios y devuelve el foco a la unidad. */
  protected onClosed(unit: OrganizationUnit): void {
    const state: UnitReturnState = { highlightUnitId: unit.id };
    void this.router.navigate([UNITS_URL], { state });
  }

  private fail(err: UnitError): void {
    this.error.set('');
    switch (err.kind) {
      case 'parent-inactive':
        this.block(String(err.details['parent_id'] ?? ''), String(err.details['parent_name'] ?? 'la unidad padre'));
        return;
      case 'forbidden':
        this.allowed.set(false);
        return;
      case 'validation':
        if (err.fields['from_date']) {
          this.dateError.set(err.fields['from_date']);
          return;
        }
        break;
      case 'stale':
        this.error.set('La unidad cambió mientras la editabas. Vuelve al listado y ábrela de nuevo para ver la versión actual.');
        return;
      case 'already-active':
        this.error.set('La unidad ya está activa.');
        return;
    }
    if (!this.error()) this.error.set('No se pudo reactivar la unidad. Intente de nuevo.');
  }

  private block(id: string, name: string): void {
    this.blockedParent.set({ id, name });
    afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>('[data-close] button')?.focus(), { injector: this.injector });
  }

  private load(): Observable<Loaded> {
    return this.api.get(this.unitId).pipe(
      switchMap((unit) =>
        unit.parent_id ? this.api.get(unit.parent_id).pipe(map((parent) => ({ unit, parent })), catchError(() => of({ unit, parent: null }))) : of({ unit, parent: null }),
      ),
    );
  }
}
