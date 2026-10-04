import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { GfIcon } from '../../atoms/icon/icon';
import { GfToggleButton } from '../../atoms/toggle-button/toggle-button';

export interface GfToggleOption<T extends string = string> {
  readonly value: T;
  readonly label: string;
  /** Nombre de un icono existente de gf-icon. */
  readonly icon?: string;
}

/**
 * CMP-MOL-012 — Grupo de alternancia (CMP-018 §3.4). `role="group"` + botones con `aria-pressed`
 * (no radiogroup, no roving tabindex: cada botón es una parada de Tab). Exactamente una opción presionada;
 * presionar la ya presionada no cambia nada. El anuncio del cambio de vista es de la página (propuesto).
 */
@Component({
  selector: 'gf-toggle-group',
  imports: [GfToggleButton, GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="group" class="gf-toggle-group" [attr.aria-label]="groupLabel()">
      @for (opt of options(); track opt.value) {
        <gf-toggle-button [pressed]="value() === opt.value" (toggled)="select(opt.value)">
          @if (opt.icon) {
            <gf-icon [name]="opt.icon" [decorative]="true" />
          }
          {{ opt.label }}
        </gf-toggle-button>
      }
    </div>
  `,
  styles: `
    :host { display: inline-block; }
    .gf-toggle-group { display: inline-flex; gap: var(--gf-space-2); }
  `,
})
export class GfToggleGroup {
  readonly options = input.required<readonly GfToggleOption[]>();
  readonly value = model<string>();
  readonly groupLabel = input.required<string>();

  protected select(v: string): void {
    if (v !== this.value()) this.value.set(v);
  }
}
