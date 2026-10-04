import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, ElementRef, computed, contentChild, contentChildren, inject, input, model } from '@angular/core';
import { GfIcon } from '../../atoms/icon/icon';
import { GfSpinner } from '../../atoms/spinner/spinner';

export type GfSortDirection = 'asc' | 'desc';
export interface GfSort {
  readonly columnId: string;
  readonly direction: GfSortDirection;
}
export interface GfTableColumn<T> {
  readonly id: string;
  /** Texto visible del encabezado. */
  readonly header: string;
  readonly sortable?: boolean;
  /** Texto simple; si falta, se usa la plantilla `gfCellDef`. */
  readonly cell?: (row: T) => string;
  readonly align?: 'start' | 'end';
}

/** Plantilla de celda por columna: `<ng-template gfCellDef="columnId" let-row>`. */
@Directive({ selector: 'ng-template[gfCellDef]' })
export class GfCellDef {
  readonly columnId = input.required<string>({ alias: 'gfCellDef' });
  readonly template = inject(TemplateRef);
}

/** Plantilla de la última columna «Acciones»: `<ng-template gfRowActions let-row>`. */
@Directive({ selector: 'ng-template[gfRowActions]' })
export class GfRowActions {
  readonly template = inject(TemplateRef);
}

/** CMP-ORG-009 — Tabla de datos (CMP-018 §3.9). */
@Component({
  selector: 'gf-data-table',
  imports: [NgTemplateOutlet, GfIcon, GfSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .gf-table__scroll { overflow-x: auto; }
    .gf-table { width: 100%; border-collapse: collapse; }
    .gf-table th, .gf-table td { padding: var(--gf-space-2) var(--gf-space-3); text-align: start; border-bottom: 1px solid var(--gf-color-border); }
    .gf-table thead th { background: var(--gf-color-surface-container); }
    .gf-table__caption--hidden, .gf-table__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .gf-table caption { text-align: start; font-weight: var(--gf-font-weight-semibold); padding: var(--gf-space-2) 0; }
    .gf-table__sort { display: inline-flex; align-items: center; gap: var(--gf-space-1); min-height: var(--gf-touch-target); padding: 0; border: 0; background: transparent; color: inherit; font: inherit; font-weight: var(--gf-font-weight-semibold); cursor: pointer; }
    .gf-table__row--highlighted { background: var(--gf-color-surface-selected); }
  `,
  template: `<div class="gf-table__scroll" role="region" tabindex="0" [attr.aria-label]="caption()"><table class="gf-table" [attr.aria-busy]="loading() || null">
      <caption [class.gf-table__caption--hidden]="captionHidden()">{{ caption() }}</caption>
      <thead>
        <tr>
          @for (col of columns(); track col.id) {
            <th scope="col" [attr.aria-sort]="ariaSort(col)">
              @if (col.sortable) {
                <button type="button" class="gf-table__sort" (click)="toggleSort(col)">
                  {{ col.header }}
                  <gf-icon name="arrow_upward" [decorative]="true" size="1rem" />
                </button>
              } @else {
                {{ col.header }}
              }
            </th>
          }
          @if (rowActions()) {
            <th scope="col">Acciones</th>
          }
        </tr>
      </thead>
      <tbody>
        @if (loading()) {
          <tr>
            <td [attr.colspan]="columns().length + (rowActions() ? 1 : 0)">
              <span aria-hidden="true"><gf-spinner label="Cargando información" /></span>
            </td>
          </tr>
        } @else {
        @for (row of rows(); track rowId()(row)) {
          <tr tabindex="-1" [attr.data-row-id]="rowId()(row)" [attr.aria-current]="rowId()(row) === highlightedRowId() ? 'true' : null" [class.gf-table__row--highlighted]="rowId()(row) === highlightedRowId()">
            @for (col of columns(); track col.id; let first = $first) {
              @if (first) {
                <th scope="row"><ng-container [ngTemplateOutlet]="cellContent" [ngTemplateOutletContext]="{ $implicit: row, col: col }" /></th>
              } @else {
                <td><ng-container [ngTemplateOutlet]="cellContent" [ngTemplateOutletContext]="{ $implicit: row, col: col }" /></td>
              }
            }
            @if (rowActions(); as actions) {
              <td><ng-container [ngTemplateOutlet]="actions.template" [ngTemplateOutletContext]="{ $implicit: row }" /></td>
            }
          </tr>
        }
        }
      </tbody>
    </table>
    </div>
    @if (!loading() && rows().length === 0) {
      <div class="gf-table__empty"><ng-content select="[gfTableEmpty]" /></div>
    }
    <div role="status" class="gf-table__sr">{{ statusMessage() }}</div>
    <ng-template #cellContent let-row let-col="col">
      @if (col.cell) {
        {{ col.cell(row) }}
      } @else if (cellDefs().get(col.id); as tpl) {
        <ng-container [ngTemplateOutlet]="tpl" [ngTemplateOutletContext]="{ $implicit: row }" />
      }
    </ng-template>
  `,
})
export class GfDataTable<T> {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly columns = input.required<readonly GfTableColumn<T>[]>();
  readonly rows = input.required<readonly T[]>();
  readonly rowId = input.required<(row: T) => string>();
  readonly caption = input.required<string>();
  readonly captionHidden = input(false);
  readonly sort = model<GfSort | null>(null);
  readonly loading = input(false);
  readonly highlightedRowId = input<string | null>(null);

  protected readonly rowActions = contentChild(GfRowActions);
  private readonly cellDefList = contentChildren(GfCellDef);
  protected readonly cellDefs = computed(() => new Map(this.cellDefList().map((d) => [d.columnId(), d.template])));

  /** Devuelve el foco a la fila `id` (p. ej. tras guardar). */
  focusRow(id: string): void {
    this.host.nativeElement.querySelector<HTMLElement>(`tr[data-row-id="${CSS.escape(id)}"]`)?.focus();
  }

  /** Anuncio del orden activo (texto propuesto; las fuentes no lo redactan). */
  protected readonly statusMessage = computed(() => {
    if (this.loading()) return 'Cargando información';
    const s = this.sort();
    const col = s && this.columns().find((c) => c.id === s.columnId);
    return s && col ? `Ordenado por ${col.header}, ${s.direction === 'asc' ? 'ascendente' : 'descendente'}` : '';
  });

  /** `aria-sort` solo en columnas ordenables (CMP-018 §3.9). */
  protected ariaSort(col: GfTableColumn<T>): 'ascending' | 'descending' | 'none' | null {
    if (!col.sortable) return null;
    const s = this.sort();
    if (s?.columnId !== col.id) return 'none';
    return s.direction === 'asc' ? 'ascending' : 'descending';
  }

  /** Ciclo propuesto: sin orden → asc → desc → asc (no vuelve a «sin orden»). La tabla NO reordena `rows`. */
  protected toggleSort(col: GfTableColumn<T>): void {
    const cur = this.sort();
    this.sort.set({ columnId: col.id, direction: cur?.columnId === col.id && cur.direction === 'asc' ? 'desc' : 'asc' });
  }
}
