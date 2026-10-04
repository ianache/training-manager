import { ChangeDetectionStrategy, Component, effect, input, output, signal, untracked } from '@angular/core';
import { GfButton } from '../../atoms/button/button';
import { GfChip } from '../../atoms/chip/chip';

export interface GfActiveFilter {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

/** CMP-MOL-013 — Filtros activos (CMP-018 §3.5). */
@Component({
  selector: 'gf-active-filters',
  imports: [GfChip, GfButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .gf-active-filters { display: flex; flex-wrap: wrap; align-items: center; gap: var(--gf-space-2); }
    .gf-active-filters__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  `,
  template: `<div role="group" class="gf-active-filters" [attr.aria-label]="regionLabel()">
      @for (f of filters(); track f.id) {
        <gf-chip>{{ f.label }}: {{ f.value }}</gf-chip>
      }
      <gf-button variant="text" [disabled]="filters().length === 0" (pressed)="cleared.emit()">{{ clearLabel() }}</gf-button>
    </div>
    <div role="status" class="gf-active-filters__sr">{{ announcement() }}</div>
`,
})
export class GfActiveFilters {
  readonly filters = input.required<readonly GfActiveFilter[]>();
  readonly clearLabel = input('Limpiar filtros');
  readonly regionLabel = input('Filtros activos');
  readonly cleared = output<void>();
  /** Texto de la región de estado; vacío hasta el primer cambio de filtros. */
  protected readonly announcement = signal('');
  private initial = true;

  constructor() {
    effect(() => {
      const n = this.filters().length;
      untracked(() => {
        if (this.initial) {
          this.initial = false;
          return;
        }
        // Texto propuesto (CMP-018-Q5): las fuentes no lo redactan.
        this.announcement.set(n === 0 ? 'Sin filtros activos' : n === 1 ? '1 filtro activo' : `${n} filtros activos`);
      });
    });
  }
}
