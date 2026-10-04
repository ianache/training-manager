import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { GfIcon } from '../icon/icon';

export type GfChipTone = 'neutral' | 'info';

/**
 * CMP-ATOM-014 — Chip (CMP-018 §3.2). Etiqueta de un valor de filtro vigente.
 * El chip es texto (no recibe foco); solo el botón de quitar, si `removable`, es un control.
 * `removeLabel` es obligatorio cuando `removable` es true (WCAG 4.1.2).
 * El foco visible lo da el `:focus-visible` global de tokens.css (CMP-018 G-1: 2 px vs 3 px, sin resolver).
 */
@Component({
  selector: 'gf-chip',
  imports: [GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'gf-chip gf-chip--' + tone()"
    ><ng-content />
    @if (removable()) {
      <button type="button" class="gf-chip__remove" [attr.aria-label]="removeLabel()" (click)="removed.emit()">
        <gf-icon name="close" [decorative]="true" size="1rem" />
      </button>
    }</span
  >`,
  styles: `
    :host { display: inline-flex; }
    .gf-chip {
      display: inline-flex; align-items: center; gap: var(--gf-space-1);
      padding: 2px var(--gf-space-2); border-radius: var(--gf-radius-sm);
      font-size: var(--gf-font-size-sm); font-weight: var(--gf-font-weight-semibold);
    }
    .gf-chip--neutral { background: var(--gf-color-neutral-bg); color: var(--gf-color-neutral-fg); }
    .gf-chip--info { background: var(--gf-color-info-bg); color: var(--gf-color-info-fg); }
    .gf-chip__remove {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: var(--gf-touch-target); min-height: var(--gf-touch-target);
      margin: calc(var(--gf-space-2) * -1) calc(var(--gf-space-2) * -1) calc(var(--gf-space-2) * -1) 0;
      padding: 0; border: 0; background: transparent; color: inherit; cursor: pointer;
      border-radius: var(--gf-radius-sm);
    }
  `,
})
export class GfChip {
  readonly tone = input<GfChipTone>('neutral');
  /** Propuesto: SCR-028 solo pide «Limpiar filtros»; por defecto desactivado. */
  readonly removable = input(false);
  /** Obligatorio si `removable`. */
  readonly removeLabel = input<string>('');
  readonly removed = output<void>();
}
