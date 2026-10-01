import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gf-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="gf-spinner" role="status"
    ><span class="gf-spinner__ring" aria-hidden="true"></span
    ><span class="gf-visually-hidden">{{ label() }}</span></span
  >`,
  styles: `
    .gf-spinner { display: inline-flex; }
    .gf-spinner__ring {
      width: 24px; height: 24px; border-radius: 50%;
      border: 3px solid var(--gf-color-border); border-top-color: var(--gf-color-primary);
      animation: gf-spin 0.8s linear infinite;
    }
    @keyframes gf-spin { to { transform: rotate(360deg); } }
  `,
})
export class GfSpinner {
  readonly label = input('Cargando');
}
