import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, input } from '@angular/core';

export interface GfDescriptionItem {
  readonly id: string;
  /** Etiqueta (dt). */
  readonly term: string;
  /** Texto simple (dd). */
  readonly value?: string;
  /** dd rico (gf-badge, MOL-008). */
  readonly valueTemplate?: TemplateRef<unknown>;
}

/** CMP-MOL-014 — Lista de descripción (CMP-018 §3.6). */
@Component({
  selector: 'gf-description-list',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: block; }
    .gf-dl { margin: 0; display: grid; gap: var(--gf-space-3); }
    .gf-dl__group { display: grid; gap: var(--gf-space-1); }
    .gf-dl--inline .gf-dl__group { grid-template-columns: minmax(10rem, 1fr) 2fr; gap: var(--gf-space-4); }
    .gf-dl dt { color: var(--gf-color-text-muted); font-size: var(--gf-font-size-sm); }
    .gf-dl dd { margin: 0; color: var(--gf-color-text); }
  `,
  template: `<dl [class]="'gf-dl gf-dl--' + layout()">
      @for (item of items(); track item.id) {
        <div class="gf-dl__group">
          <dt>{{ item.term }}</dt>
          <dd>
            @if (item.valueTemplate; as tpl) {
              <ng-container [ngTemplateOutlet]="tpl" />
            } @else {
              {{ item.value || '—' }}
            }
          </dd>
        </div>
      }
    </dl>
`,
})
export class GfDescriptionList {
  readonly items = input.required<readonly GfDescriptionItem[]>();
  readonly layout = input<'stacked' | 'inline'>('stacked');
}
