import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gf-label',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [for]="inputId()">
      {{ text() }}
      <span *ngIf="required()" aria-label="required" class="required">*</span>
    </label>
  `,
  styles: [`
    label {
      display: block;
      font-weight: var(--gf-font-weight-semibold);
      margin-bottom: var(--gf-space-1);
    }
    .required {
      color: var(--gf-color-danger-fg);
      margin-left: var(--gf-space-1);
    }
  `]
})
export class GfLabel {
  readonly inputId = input('');
  readonly text = input('');
  readonly required = input(false);
}
