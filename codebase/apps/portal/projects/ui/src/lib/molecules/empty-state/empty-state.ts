import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * CMP-MOL-005 — Estado vacío. La acción se proyecta solo si el rol puede ejecutarla
 * (GEN-002 F-05): el consumidor decide si pasa contenido o no.
 */
@Component({
  selector: 'gf-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="gf-empty" [attr.aria-label]="title()">
      <span class="gf-empty__icon" aria-hidden="true">{{ icon() }}</span>
      <h2 class="gf-empty__title">{{ title() }}</h2>
      @if (description()) {
        <p class="gf-empty__text">{{ description() }}</p>
      }
      <div class="gf-empty__action"><ng-content /></div>
    </section>
  `,
  styles: `
    .gf-empty { display: grid; justify-items: center; gap: var(--gf-space-2); padding: var(--gf-space-8) var(--gf-space-4); text-align: center; }
    .gf-empty__icon { font-size: 2rem; color: var(--gf-color-text-muted); }
    .gf-empty__title { margin: 0; font-size: var(--gf-font-size-lg); }
    .gf-empty__text { margin: 0; color: var(--gf-color-text-muted); max-width: 48ch; }
  `,
})
export class GfEmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly icon = input<string>('○');
}
