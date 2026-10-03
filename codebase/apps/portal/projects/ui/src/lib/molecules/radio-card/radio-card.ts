import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * CMP-MOL — Tarjeta de opción (radio). Varias con el mismo `name` forman un grupo;
 * el consumidor las envuelve en <fieldset><legend>. Radio nativo: teclado y lectores de pantalla gratis.
 */
@Component({
  selector: 'gf-radio-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="radio-card" [class.radio-card--checked]="checked()">
      <input
        type="radio"
        [attr.name]="name()"
        [value]="value()"
        [checked]="checked()"
        [attr.aria-describedby]="description() ? descId : null"
        (change)="selected.emit(value())"
      />
      <span class="card-content">
        <span class="label">{{ label() }}</span>
        @if (description()) {
          <span class="description" [attr.id]="descId">{{ description() }}</span>
        }
      </span>
    </label>
  `,
  styles: [`
    :host { display: block; }
    .radio-card {
      display: flex;
      align-items: flex-start;
      gap: var(--gf-space-3);
      padding: var(--gf-space-4) var(--gf-space-6);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-md);
      background: var(--gf-color-surface);
      cursor: pointer;
    }
    .radio-card:hover { background: var(--gf-color-surface-container); }
    .radio-card--checked {
      border: 2px solid var(--gf-color-primary);
      padding: calc(var(--gf-space-4) - 1px) calc(var(--gf-space-6) - 1px);
      background: var(--gf-color-surface-selected);
    }
    .radio-card:has(input:focus-visible) { outline: 3px solid var(--gf-color-focus-ring); outline-offset: 2px; }
    input { margin: 5px 0 0; width: 18px; height: 18px; flex: none; accent-color: var(--gf-color-primary); }
    .card-content { display: flex; flex-direction: column; gap: var(--gf-space-1); }
    .label { font-size: var(--gf-font-size-lg); font-weight: var(--gf-font-weight-semibold); color: var(--gf-color-text); }
    .description { font-size: var(--gf-font-size-sm); color: var(--gf-color-text-muted); }
  `],
})
export class GfRadioCard {
  readonly name = input('');
  readonly value = input('');
  readonly label = input('');
  readonly description = input('');
  readonly checked = input(false);

  readonly selected = output<string>();

  protected readonly descId = `gf-radio-desc-${Math.random().toString(36).slice(2, 9)}`;
}
