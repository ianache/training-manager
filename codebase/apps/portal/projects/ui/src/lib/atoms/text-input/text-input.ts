import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'gf-text-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (control()) {
      <input
        [type]="type()"
        [disabled]="disabled()"
        [formControl]="control()!"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-invalid]="shouldShowInvalid()"
        (change)="valueChange.emit($event.target.value)"
        (blur)="blur.emit()"
      />
    } @else {
      <input
        [type]="type()"
        [value]="value()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        [attr.aria-required]="required() || null"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        (change)="valueChange.emit($event.target.value)"
        (blur)="blur.emit()"
      />
    }
  `,
  styles: [`
    input {
      padding: var(--gf-space-2) var(--gf-space-3);
      border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-sm);
      font: inherit;
      font-size: 1rem;
      line-height: 1.5;
    }
    input:focus {
      outline: 2px solid var(--gf-color-primary);
      outline-offset: 2px;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    input[aria-invalid="true"] {
      border-color: var(--gf-color-danger-fg);
    }
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

  readonly shouldShowInvalid = computed(() => {
    const ctrl = this.control();
    return (ctrl?.invalid && ctrl?.touched) ? 'true' : null;
  });

  readonly valueChange = output<string>();
  readonly blur = output<void>();
}
