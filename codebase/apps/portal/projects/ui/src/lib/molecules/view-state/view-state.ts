import { ChangeDetectionStrategy, Component, TemplateRef, contentChild, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import type { ViewState } from '@gf/core';
import { GfAlert } from '../alert/alert';
import { GfButton } from '../../atoms/button/button';
import { GfEmptyState } from '../empty-state/empty-state';
import { GfSpinner } from '../../atoms/spinner/spinner';

/**
 * Contenedor de estados obligatorios (UXR-000.4): carga, vacío, error, sin permiso y éxito.
 * La vista solo aporta el template de éxito y, opcionalmente, el del vacío.
 *
 * <gf-view-state [state]="state()" (retry)="reload()">
 *   <ng-template #success let-data>…</ng-template>
 * </gf-view-state>
 */
@Component({
  selector: 'gf-view-state',
  imports: [NgTemplateOutlet, GfAlert, GfButton, GfEmptyState, GfSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (state().kind) {
      @case ('loading') {
        <div class="gf-vs__center" aria-live="polite"><gf-spinner [label]="loadingLabel()" /></div>
      }
      @case ('empty') {
        @if (emptyTpl(); as tpl) {
          <ng-container [ngTemplateOutlet]="tpl" />
        } @else {
          <gf-empty-state [title]="emptyTitle()" />
        }
      }
      @case ('forbidden') {
        <gf-empty-state
          icon="⊘"
          title="Esta función no está disponible para tu rol"
          description="Si crees que deberías tener acceso, consulta con el Jefe de Ingeniería."
        />
      }
      @case ('error') {
        <gf-alert tone="danger" heading="Algo salió mal">
          <p>{{ errorMessage() }}</p>
          @if (requestId()) {
            <p><small>Código de seguimiento: {{ requestId() }}</small></p>
          }
          <gf-button variant="secondary" (pressed)="retry.emit()">Reintentar</gf-button>
        </gf-alert>
      }
      @case ('success') {
        <ng-container [ngTemplateOutlet]="successTpl()" [ngTemplateOutletContext]="{ $implicit: data() }" />
      }
    }
  `,
  styles: `.gf-vs__center { display: flex; justify-content: center; padding: var(--gf-space-8); }`,
})
export class GfViewState<T = unknown> {
  readonly state = input.required<ViewState<T>>();
  readonly emptyTitle = input('No hay información para mostrar');
  readonly loadingLabel = input('Cargando información');
  readonly retry = output<void>();

  protected readonly successTpl = contentChild.required<TemplateRef<{ $implicit: T }>>('success');
  protected readonly emptyTpl = contentChild<TemplateRef<unknown>>('empty');

  protected data(): T | undefined {
    const s = this.state();
    return s.kind === 'success' ? s.data : undefined;
  }
  protected errorMessage(): string {
    const s = this.state();
    return s.kind === 'error' ? s.message : '';
  }
  protected requestId(): string | undefined {
    const s = this.state();
    return s.kind === 'error' ? s.requestId : undefined;
  }
}
