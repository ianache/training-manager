import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import type { FieldState } from '../text-input/text-input';

@Component({
  selector: 'gf-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (control()) {
      <select
        [attr.id]="inputId() || null"
        [disabled]="disabled()"
        [formControl]="control()!"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-invalid]="shouldShowInvalid()"
        [attr.aria-expanded]="ariaExpanded()"
        [attr.data-state]="state()"
        (change)="onChange($event)"
      >
        <ng-content></ng-content>
      </select>
    } @else {
      <select
        [attr.id]="inputId() || null"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-invalid]="invalid() || state() === 'invalid' ? 'true' : null"
        [attr.aria-expanded]="ariaExpanded()"
        [attr.data-state]="state()"
        (change)="onChange($event)"
      >
        <ng-content></ng-content>
      </select>
    }
  `,
  styles: [`
    :host { display: block; }
    select {
      min-height: var(--gf-touch-target);
      padding: var(--gf-space-2) var(--gf-space-3);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      background: var(--gf-color-surface);
      color: var(--gf-color-text);
      font: inherit;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
      box-sizing: border-box;
    }
    select:focus-visible {
      outline: 2px solid var(--gf-color-primary);
      outline-offset: 2px;
    }
    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    select[data-state='valid'] { border-width: 2px; border-color: var(--gf-color-success-fg); }
    select[aria-invalid="true"] { border-width: 2px; border-color: var(--gf-color-danger-fg); }
  `]
})
export class GfSelect {
  readonly value = input('');
  readonly disabled = input(false);
  readonly ariaLabel = input('');
  readonly required = input(false);
  readonly invalid = input(false);
  readonly control = input<FormControl | null>(null);
  readonly ariaExpanded = input('false');
  readonly inputId = input('');
  readonly ariaDescribedBy = input('');
  readonly state = input<FieldState>('default');

  /**
   * Método y no `computed`: el estado `touched/invalid` de un FormControl no es una señal, así que un `computed`
   * se quedaba con el primer valor y `aria-invalid` no aparecía al salir de un campo inválido.
   */
  shouldShowInvalid(): 'true' | null {
    const ctrl = this.control();
    return (ctrl?.invalid && ctrl?.touched) || this.invalid() || this.state() === 'invalid' ? 'true' : null;
  }

  readonly valueChange = output<string>();

  onChange(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
