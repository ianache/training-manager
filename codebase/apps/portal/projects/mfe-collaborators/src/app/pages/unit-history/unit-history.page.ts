import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, Page, SessionService, ViewState, toViewState } from '@gf/core';
import { GfBadge, GfBreadcrumb, GfBreadcrumbItem, GfButton, GfCellDef, GfDataTable, GfEmptyState, GfTableColumn, GfViewState } from '@gf/ui';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { UnitRelationship } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UNITS_URL } from '../../shared/unit-nav';
import { formatDate } from '../unit-list/unit-list.page';

/**
 * SCR-029-04 — Historial de relaciones y vigencias (solo lectura). Columnas propuestas (SCR-029-Q13); punto de
 * acceso: enlace desde SCR-029-03 (SCR-029-Q14 abierta). «Hasta» queda vacío en la relación vigente (decisión
 * 2026-10-03), que se marca con la etiqueta de texto «Vigente».
 */
@Component({
  selector: 'gf-unit-history-page',
  imports: [RouterLink, GfBadge, GfBreadcrumb, GfButton, GfCellDef, GfDataTable, GfEmptyState, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './unit-history.page.scss',
  template: `
    @if (!allowed) {
      <gf-empty-state title="No tiene permiso para ver el historial" icon="🔒">
        <a class="gf-link-button" [routerLink]="unitsUrl">Volver a unidades</a>
      </gf-empty-state>
    } @else {
      <gf-breadcrumb [items]="crumbs()" (navigate)="goList()" />
      <header class="page-header">
        <h1>Historial de relaciones y vigencias</h1>
        @if (unitName()) {
          <p class="unit">Unidad: <strong>{{ unitName() }}</strong></p>
        }
      </header>

      <gf-view-state [state]="state()" loadingLabel="Cargando historial" (retry)="retry()">
        <ng-template #empty>
          <gf-empty-state title="Aún no hay cambios registrados" />
        </ng-template>
        <ng-template #success let-result>
          <gf-data-table [columns]="columns" [rows]="result.data" [rowId]="rowId" caption="Historial de relaciones de la unidad">
            <ng-template gfCellDef="previous" let-r>{{ r.previous_parent?.name ?? noParent }}</ng-template>
            <ng-template gfCellDef="next" let-r>{{ r.new_parent?.name ?? noParent }}</ng-template>
            <ng-template gfCellDef="from" let-r>
              {{ fmt(r.from_date) }}
              @if (!r.thru_date) {
                <gf-badge tone="success">Vigente</gf-badge>
              }
            </ng-template>
            <ng-template gfCellDef="thru" let-r>{{ fmt(r.thru_date) }}</ng-template>
          </gf-data-table>

          <nav class="pager" aria-label="Paginación">
            <gf-button variant="secondary" [disabled]="!result.pagination.has_prev" (pressed)="goTo(result.pagination.page - 1)">Anterior</gf-button>
            <span aria-live="polite">Página {{ result.pagination.page }} de {{ result.pagination.total_pages }}</span>
            <gf-button variant="secondary" [disabled]="!result.pagination.has_next" (pressed)="goTo(result.pagination.page + 1)">Siguiente</gf-button>
          </nav>
        </ng-template>
      </gf-view-state>
    }
  `,
})
export class UnitHistoryPage {
  private readonly api = inject(OrganizationsService);
  private readonly router = inject(Router);
  private readonly unitId = inject(ActivatedRoute).snapshot.paramMap.get('unitId')!;

  protected readonly unitsUrl = UNITS_URL;
  protected readonly noParent = 'Sin unidad padre';
  protected readonly fmt = formatDate;
  protected readonly allowed = inject(SessionService).hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]);

  private readonly query = signal({ page: 1, nonce: 0 });

  protected readonly state = toSignal(
    this.allowed
      ? toObservable(this.query).pipe(switchMap((q) => toViewState(this.api.relationships(this.unitId, q.page), { isEmpty: (p: Page<UnitRelationship>) => p.data.length === 0 })))
      : of({ kind: 'forbidden' } as ViewState<Page<UnitRelationship>>),
    { initialValue: { kind: 'loading' } as ViewState<Page<UnitRelationship>> },
  );

  protected readonly unitName = toSignal(
    this.allowed ? this.api.get(this.unitId).pipe(map((u) => u.name), catchError(() => of(''))) : of(''),
    { initialValue: '' },
  );

  protected readonly crumbs = computed<GfBreadcrumbItem[]>(() => [
    { id: 'units', label: 'Unidades organizacionales', href: UNITS_URL },
    { id: 'here', label: 'Historial de relaciones' },
  ]);

  protected readonly columns: GfTableColumn<UnitRelationship>[] = [
    { id: 'previous', header: 'Padre anterior' },
    { id: 'next', header: 'Padre nuevo' },
    { id: 'from', header: 'Desde' },
    { id: 'thru', header: 'Hasta' },
    { id: 'by', header: 'Realizado por', cell: (r) => r.changed_by },
  ];
  protected readonly rowId = (r: UnitRelationship) => `${r.from_date}|${r.new_parent?.id ?? ''}`;

  protected goTo(page: number): void {
    this.query.update((q) => ({ ...q, page }));
  }
  protected retry(): void {
    this.query.update((q) => ({ ...q, nonce: q.nonce + 1 }));
  }
  protected goList(): void {
    void this.router.navigate([UNITS_URL]);
  }
}
