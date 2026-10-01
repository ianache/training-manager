import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'gf-date-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="date"
      [value]="value()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      (change)="valueChange.emit($event.target.value)"
    />
  `,
  styles: [`
    input {
      padding: var(--gf-space-2) var(--gf-space-3);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      font: inherit;
      font-size: 1rem;
    }
    input:focus {
      outline: 2px solid var(--gf-color-primary);
      outline-offset: 2px;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class GfDateInput {
  readonly value = input('');
  readonly disabled = input(false);
  readonly ariaLabel = input('');

  readonly valueChange = output<string>();
}
