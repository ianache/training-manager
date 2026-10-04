import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * CMP-ATOM-015 — Botón de alternancia (CMP-018 §3.3). `<button aria-pressed>`.
 * No gestiona exclusividad (MOL-012): emite `toggled` y el padre decide el nuevo estado.
 * El estado presionado no depende solo del color: fondo seleccionado + borde grueso inferior + peso de fuente + aria-pressed.
 * Foco visible: `:focus-visible` global de tokens.css (CMP-018 G-1 sin resolver).
 */
@Component({
  selector: 'gf-toggle-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="gf-toggle"
      [class.gf-toggle--pressed]="pressed()"
      [attr.aria-pressed]="pressed()"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="disabled()"
      (click)="toggled.emit()"
    >
      <ng-content />
    </button>
  `,
  styles: `
    :host { display: inline-block; }
    .gf-toggle {
      display: inline-flex; align-items: center; justify-content: center; gap: var(--gf-space-2);
      min-height: var(--gf-touch-target); padding: 0 var(--gf-space-4);
      border: 1px solid var(--gf-color-border); border-radius: var(--gf-radius-sm);
      background: var(--gf-color-surface); color: var(--gf-color-text);
      font: inherit; cursor: pointer;
    }
    .gf-toggle:hover:not(:disabled) { background: var(--gf-color-surface-container); }
    .gf-toggle--pressed {
      background: var(--gf-color-surface-selected); border-color: var(--gf-color-border-strong);
      box-shadow: inset 0 -3px 0 var(--gf-color-border-strong);
      font-weight: var(--gf-font-weight-semibold);
    }
    .gf-toggle:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
})
export class GfToggleButton {
  readonly pressed = input(false);
  readonly disabled = input(false);
  /** Obligatorio si solo hay icono. */
  readonly ariaLabel = input<string>('');
  readonly toggled = output<void>();
}
