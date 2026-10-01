import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { GfLabel, GfTextInput, GfErrorMessage } from '../../atoms';

@Component({
  selector: 'gf-form-field',
  standalone: true,
  imports: [CommonModule, GfLabel, GfTextInput, GfErrorMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="form-field">
      <gf-label [inputId]="inputId" [text]="label()" [required]="required()"></gf-label>
      <gf-text-input
        [attr.id]="inputId"
        [type]="type()"
        [value]="value()"
        [required]="required()"
        [invalid]="showError()"
        (valueChange)="valueChange.emit($event)"
        (blur)="onBlur()"
      ></gf-text-input>
      <gf-error-message *ngIf="showError()" [message]="error()"></gf-error-message>
      <p *ngIf="!showError() && hint()" class="hint">{{ hint() }}</p>
    </div>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--gf-space-4);
    }
    .hint {
      font-size: 0.875rem;
      color: var(--gf-color-text-secondary);
      margin-top: var(--gf-space-1);
    }
  `]
})
export class GfFormField {
  readonly label = input('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly value = input('');
  readonly required = input(false);
  readonly error = input('');
  readonly hint = input('');

  readonly valueChange = output<string>();

  showError = signal(false);
  inputId = `field-${Math.random().toString(36).substr(2, 9)}`;

  onBlur() {
    if (this.error()) {
      this.showError.set(true);
    }
  }
}
