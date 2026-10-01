import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';

/** CMP-ATOM-001 — Botón (UI-INV-001). Altura mínima 44 px y foco visible. */
@Component({
  selector: 'gf-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [attr.type]="type()"
      [class]="'gf-button gf-button--' + variant()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading() || null"
      [attr.aria-label]="ariaLabel() || null"
      (click)="pressed.emit($event)"
    >
      <ng-content />
    </button>
  `,
  styles: `
    .gf-button {
      min-height: var(--gf-touch-target);
      padding: 0 var(--gf-space-4);
      border-radius: var(--gf-radius-sm);
      font: inherit;
      font-weight: var(--gf-font-weight-semibold);
      cursor: pointer;
      border: 1px solid transparent;
    }
    .gf-button:disabled { opacity: 0.5; cursor: not-allowed; }
    .gf-button--primary { background: var(--gf-color-primary); color: var(--gf-color-on-primary); }
    .gf-button--primary:hover:not(:disabled) { background: var(--gf-color-primary-hover); }
    .gf-button--primary:active:not(:disabled) { background: var(--gf-color-primary-active); }
    .gf-button--secondary { background: var(--gf-color-surface); color: var(--gf-color-primary); border-color: var(--gf-color-border-strong); }
    .gf-button--secondary:hover:not(:disabled) { background: var(--gf-color-surface-container); }
    .gf-button--destructive { background: var(--gf-color-danger-fg); color: var(--gf-color-on-primary); }
  `,
})
export class GfButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  /** Obligatorio si el botón solo tiene icono. */
  readonly ariaLabel = input<string>('');
  readonly pressed = output<MouseEvent>();
}
