import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DomainLevel = 1 | 2 | 3 | 4;

/** Escala de niveles de dominio (GLS-001, TRM-0020). */
export const DOMAIN_LEVEL_LABELS: Record<DomainLevel, string> = {
  1: 'Principiante',
  2: 'Autónomo',
  3: 'Avanzado',
  4: 'Experto',
};

/** CMP-ATOM-006 — Nivel L1–L4 con su nombre, nunca solo el número. */
@Component({
  selector: 'gf-level-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="gf-level"><strong>L{{ level() }}</strong> {{ label() }}</span>`,
  styles: `
    .gf-level {
      display: inline-flex; gap: var(--gf-space-1); padding: 2px var(--gf-space-2);
      border: 1px solid var(--gf-color-border-strong); border-radius: var(--gf-radius-sm);
      font-size: var(--gf-font-size-sm);
    }
  `,
})
export class GfLevelBadge {
  readonly level = input.required<DomainLevel>();
  protected readonly label = computed(() => DOMAIN_LEVEL_LABELS[this.level()]);
}
