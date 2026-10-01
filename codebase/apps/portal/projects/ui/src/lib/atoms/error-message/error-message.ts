import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gf-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div role="alert" aria-live="polite" class="error">
      {{ message() }}
    </div>
  `,
  styles: [`
    .error {
      color: var(--gf-color-danger-fg);
      font-size: 0.875rem;
      margin-top: var(--gf-space-1);
    }
  `]
})
export class GfErrorMessage {
  readonly message = input('');
}
