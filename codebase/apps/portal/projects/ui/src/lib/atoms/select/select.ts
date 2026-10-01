import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'gf-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      [value]="value()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      (change)="valueChange.emit($event.target.value)"
    >
      <ng-content></ng-content>
    </select>
  `,
  styles: [`
    select {
      padding: var(--gf-space-2) var(--gf-space-3);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      font: inherit;
      font-size: 1rem;
      cursor: pointer;
    }
    select:focus {
      outline: 2px solid var(--gf-color-primary);
      outline-offset: 2px;
    }
    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class GfSelect {
  readonly value = input('');
  readonly disabled = input(false);
  readonly ariaLabel = input('');

  readonly valueChange = output<string>();
}
