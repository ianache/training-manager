import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { GfIcon } from '../../atoms/icon/icon';

export interface GfBreadcrumbItem {
  readonly id: string;
  readonly label: string;
  /** El último elemento (página actual) no lleva href. */
  readonly href?: string;
}

/**
 * CMP-MOL-015 — Migas de pan (CMP-018 §3.7). nav > ol > li; el último elemento es texto con aria-current="page".
 * No depende de @angular/router: emite `navigate` y cancela el href con clic normal; con Ctrl/Meta/Shift/Alt
 * o botón distinto del principal no intercepta (abrir en pestaña nueva).
 * Con un solo elemento no se muestra nada (propuesto). Truncado de etiquetas largas: CMP-018-Q8 abierta.
 */
@Component({
  selector: 'gf-breadcrumb',
  imports: [GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (items().length > 1) {
      <nav [attr.aria-label]="ariaLabel()">
        <ol class="gf-breadcrumb">
          @for (item of items(); track item.id; let last = $last) {
            <li class="gf-breadcrumb__item">
              @if (!last && item.href) {
                <a [attr.href]="item.href" (click)="onClick($event, item)">{{ item.label }}</a>
              } @else if (last) {
                <span aria-current="page">{{ item.label }}</span>
              } @else {
                <span>{{ item.label }}</span>
              }
              @if (!last) {
                <gf-icon name="chevron_right" [decorative]="true" size="1rem" />
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
  styles: `
    :host { display: block; }
    .gf-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: var(--gf-space-1); margin: 0; padding: 0; list-style: none; }
    .gf-breadcrumb__item { display: inline-flex; align-items: center; gap: var(--gf-space-1); color: var(--gf-color-text-muted); }
    .gf-breadcrumb__item a { color: var(--gf-color-primary); text-decoration: underline; }
    .gf-breadcrumb__item [aria-current='page'] { color: var(--gf-color-text); font-weight: var(--gf-font-weight-semibold); }
  `,
})
export class GfBreadcrumb {
  readonly items = input.required<readonly GfBreadcrumbItem[]>();
  /** Propuesto; SCR pide nav con aria-label. */
  readonly ariaLabel = input('Migas de pan');
  readonly navigate = output<GfBreadcrumbItem>();

  protected onClick(event: MouseEvent, item: GfBreadcrumbItem): void {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    this.navigate.emit(item);
  }
}
