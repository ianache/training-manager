import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { GfIcon } from '../../atoms/icon/icon';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/** CMP-MOL-003 — Alert / Banner. `danger` y `warning` se anuncian como alerta. Con `icon` muestra un icono decorativo (el estado nunca depende solo del color). */
@Component({
  selector: 'gf-alert',
  imports: [GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'gf-alert gf-alert--' + tone()" [attr.role]="role()">
      @if (icon()) {
        <gf-icon class="gf-alert__icon" [name]="icon()" [decorative]="true" />
      }
      <div class="gf-alert__body">
        @if (heading()) {
          <p class="gf-alert__heading">{{ heading() }}</p>
        }
        <div><ng-content /></div>
      </div>
    </div>
  `,
  styles: `
    .gf-alert { display: flex; gap: var(--gf-space-3); padding: var(--gf-space-3) var(--gf-space-4); border-radius: var(--gf-radius-md); border-left: 4px solid currentColor; }
    .gf-alert__icon { margin-top: 2px; }
    .gf-alert__body { flex: 1; min-width: 0; }
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
  /** Nombre de icono de <gf-icon>; vacío = sin icono. */
  readonly icon = input<string>('');
  protected readonly role = computed(() =>
    this.tone() === 'danger' || this.tone() === 'warning' ? 'alert' : 'status',
  );
}
