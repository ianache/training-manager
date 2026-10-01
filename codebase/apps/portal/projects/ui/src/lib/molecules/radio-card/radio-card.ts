import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'gf-radio-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="radio-card">
      <input
        type="radio"
        [value]="value()"
        [checked]="checked()"
        (change)="selected.emit(value())"
      />
      <div class="card-content">
        <span class="label">{{ label() }}</span>
        <span *ngIf="description()" class="description">{{ description() }}</span>
      </div>
    </label>
  `,
  styles: [`
    .radio-card {
      display: block;
      padding: var(--gf-space-3);
      border: 2px solid var(--gf-color-border);
      border-radius: var(--gf-radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .radio-card:hover {
      border-color: var(--gf-color-primary);
      background: var(--gf-color-bg-hover);
    }
    input {
      margin-right: var(--gf-space-2);
    }
    input:checked ~ .card-content {
      color: var(--gf-color-primary);
    }
    .card-content {
      display: inline-block;
    }
    .label {
      font-weight: var(--gf-font-weight-semibold);
      display: block;
    }
    .description {
      font-size: 0.875rem;
      color: var(--gf-color-text-secondary);
      display: block;
      margin-top: var(--gf-space-1);
    }
  `]
})
export class GfRadioCard {
  readonly value = input('');
  readonly label = input('');
  readonly description = input('');
  readonly checked = input(false);

  readonly selected = output<string>();
}
