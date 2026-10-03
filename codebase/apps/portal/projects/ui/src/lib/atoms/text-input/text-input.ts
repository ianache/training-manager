import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/** Estado visual del campo (Stitch: defecto, validando, válido, error). */
export type FieldState = 'default' | 'validating' | 'valid' | 'invalid';

@Component({
  selector: 'gf-text-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (control()) {
      <input
        [attr.id]="inputId() || null"
        [type]="type()"
        [disabled]="disabled()"
        [formControl]="control()!"
        [attr.placeholder]="placeholder() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.maxlength]="maxlength()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-invalid]="shouldShowInvalid()"
        [attr.data-state]="state()"
        (change)="valueChange.emit($any($event.target).value)"
        (blur)="blur.emit()"
      />
    } @else {
      <input
        [attr.id]="inputId() || null"
        [type]="type()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.placeholder]="placeholder() || null"
        [attr.autocomplete]="autocomplete() || null"
        [attr.maxlength]="maxlength()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-describedby]="ariaDescribedBy() || null"
        [attr.aria-invalid]="invalid() || state() === 'invalid' ? 'true' : null"
        [attr.data-state]="state()"
        (input)="valueChange.emit($any($event.target).value)"
        (blur)="blur.emit()"
      />
    }
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
      line-height: 1.5;
    }
    input::placeholder { color: var(--gf-color-text-muted); opacity: 0.7; }
    input:focus-visible {
      outline: 2px solid var(--gf-color-primary);
      outline-offset: 2px;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    input[data-state='validating'] { border-width: 2px; border-color: var(--gf-color-primary); }
    input[data-state='valid'] { border-width: 2px; border-color: var(--gf-color-success-fg); }
    input[aria-invalid="true"] { border-width: 2px; border-color: var(--gf-color-danger-fg); }
  `]
})
export class GfTextInput {
  readonly type = input<'text' | 'email' | 'password' | 'number'>('text');
  readonly value = input('');
  readonly required = input(false);
  readonly invalid = input(false);
  readonly disabled = input(false);
  readonly ariaLabel = input('');
  readonly control = input<FormControl | null>(null);
  /** id del <input> interno (el `id` del host no llega al control, así que el label usa este). */
  readonly inputId = input('');
  readonly placeholder = input('');
  readonly autocomplete = input('');
  readonly maxlength = input<number | null>(null);
  readonly ariaDescribedBy = input('');
  readonly state = input<FieldState>('default');

  readonly shouldShowInvalid = computed(() => {
    const ctrl = this.control();
    return (ctrl?.invalid && ctrl?.touched) || this.invalid() || this.state() === 'invalid' ? 'true' : null;
  });

  readonly valueChange = output<string>();
  readonly blur = output<void>();
}
