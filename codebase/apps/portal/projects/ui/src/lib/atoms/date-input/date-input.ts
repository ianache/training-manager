import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'gf-date-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input
      type="date"
      [attr.id]="inputId() || null"
      [value]="value()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-required]="required() || null"
      [attr.aria-describedby]="ariaDescribedBy() || null"
      [attr.aria-invalid]="invalid() ? 'true' : null"
      (change)="valueChange.emit($any($event.target).value)"
      (blur)="blur.emit()"
    />
  `,
  styles: [`
    :host { display: block; }
    input {
      width: 100%;
      box-sizing: border-box;
      min-height: var(--gf-touch-target);
      padding: var(--gf-space-2) var(--gf-space-3);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      background: var(--gf-color-surface);
      color: var(--gf-color-text);
      font: inherit;
      font-size: 1rem;
    }
    input:focus-visible {
      outline: 2px solid var(--gf-color-primary);
      outline-offset: 2px;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    input[aria-invalid='true'] { border-width: 2px; border-color: var(--gf-color-danger-fg); }
  `]
})
export class GfDateInput {
  readonly value = input('');
  readonly disabled = input(false);
  readonly ariaLabel = input('');
  readonly inputId = input('');
  readonly required = input(false);
  readonly invalid = input(false);
  readonly ariaDescribedBy = input('');

  readonly valueChange = output<string>();
  readonly blur = output<void>();
}
