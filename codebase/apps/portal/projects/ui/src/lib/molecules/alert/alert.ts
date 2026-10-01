import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/** CMP-MOL-003 — Alert / Banner. `danger` y `warning` se anuncian como alerta. */
@Component({
  selector: 'gf-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'gf-alert gf-alert--' + tone()" [attr.role]="role()">
      @if (heading()) {
        <p class="gf-alert__heading">{{ heading() }}</p>
      }
      <div><ng-content /></div>
    </div>
  `,
  styles: `
    .gf-alert { padding: var(--gf-space-3) var(--gf-space-4); border-radius: var(--gf-radius-md); border-left: 4px solid currentColor; }
    .gf-alert__heading { margin: 0 0 var(--gf-space-1); font-weight: var(--gf-font-weight-semibold); }
    .gf-alert--info    { background: var(--gf-color-info-bg);    color: var(--gf-color-info-fg); }
    .gf-alert--success { background: var(--gf-color-success-bg); color: var(--gf-color-success-fg); }
    .gf-alert--warning { background: var(--gf-color-warning-bg); color: var(--gf-color-warning-fg); }
    .gf-alert--danger  { background: var(--gf-color-danger-bg);  color: var(--gf-color-danger-fg); }
  `,
})
export class GfAlert {
  readonly tone = input<AlertTone>('info');
  readonly heading = input<string>('');
  protected readonly role = computed(() =>
    this.tone() === 'danger' || this.tone() === 'warning' ? 'alert' : 'status',
  );
}
