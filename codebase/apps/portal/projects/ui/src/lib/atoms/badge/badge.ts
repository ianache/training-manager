import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral' | 'info';

const ICONS: Record<BadgeTone, string> = {
  success: '✓',
  warning: '*',
  danger: '!',
  neutral: 'ⓘ',
  info: '◦',
};

/**
 * CMP-ATOM-002 — Badge de estado. El color nunca es el único diferenciador:
 * siempre icono + texto (UI-INV-001 §6, WCAG 1.4.1).
 */
@Component({
  selector: 'gf-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'gf-badge gf-badge--' + tone()"
      ><span aria-hidden="true">{{ icon() }}</span> <ng-content
    /></span>`,
  styles: `
    .gf-badge {
      display: inline-flex; align-items: center; gap: var(--gf-space-1);
      padding: 2px var(--gf-space-2); border-radius: var(--gf-radius-sm);
      font-size: var(--gf-font-size-sm); font-weight: var(--gf-font-weight-semibold);
    }
    .gf-badge--success { background: var(--gf-color-success-bg); color: var(--gf-color-success-fg); }
    .gf-badge--warning { background: var(--gf-color-warning-bg); color: var(--gf-color-warning-fg); }
    .gf-badge--danger  { background: var(--gf-color-danger-bg);  color: var(--gf-color-danger-fg); }
    .gf-badge--neutral { background: var(--gf-color-neutral-bg); color: var(--gf-color-neutral-fg); }
    .gf-badge--info    { background: var(--gf-color-info-bg);    color: var(--gf-color-info-fg); }
  `,
})
export class GfBadge {
  readonly tone = input<BadgeTone>('neutral');
  protected readonly icon = computed(() => ICONS[this.tone()]);
}
