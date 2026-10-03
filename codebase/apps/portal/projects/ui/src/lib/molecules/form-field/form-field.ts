import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GfLabel } from '../../atoms/label/label';
import { GfIcon } from '../../atoms/icon/icon';
import type { FieldState } from '../../atoms/text-input/text-input';

/**
 * CMP-MOL — Campo de formulario: etiqueta + control proyectado + ayuda + mensaje de estado.
 *
 * Convención de ids para `aria-describedby` del control proyectado:
 *   ayuda → `${fieldId}-hint`, mensaje → `${fieldId}-msg`.
 * El error se anuncia con role="alert"; validando/válido con role="status" (aria-live polite).
 * El estado nunca depende solo del color: icono + texto.
 */
@Component({
  selector: 'gf-form-field',
  standalone: true,
  imports: [GfLabel, GfIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="field">
      <gf-label [inputId]="fieldId()" [text]="label()" [required]="required()" />
      <div class="control">
        <ng-content />
        @if (statusIcon() && state() !== 'default') {
          <span class="status" [attr.data-state]="state()" aria-hidden="true">
            @switch (state()) {
              @case ('validating') { <gf-icon name="refresh" [spin]="true" [decorative]="true" /> }
              @case ('valid') { <gf-icon name="check_circle" [decorative]="true" /> }
              @case ('invalid') { <gf-icon name="error" [decorative]="true" /> }
            }
          </span>
        }
      </div>
      @if (hint()) {
        <p class="hint" [attr.id]="fieldId() + '-hint'">{{ hint() }}</p>
      }
      @if (message()) {
        <p
          class="msg"
          [attr.data-state]="state()"
          [attr.id]="fieldId() + '-msg'"
          [attr.role]="state() === 'invalid' ? 'alert' : 'status'"
        >
          @if (state() === 'invalid') {
            <gf-icon name="warning" size="1rem" [decorative]="true" />
          }
          <span>{{ message() }}</span>
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .field { display: flex; flex-direction: column; }
    gf-label { font-size: var(--gf-font-size-sm); }
    .control { position: relative; }
    .status { position: absolute; right: var(--gf-space-3); top: 50%; transform: translateY(-50%); display: inline-flex; pointer-events: none; }
    .status[data-state='validating'] { color: var(--gf-color-primary); }
    .status[data-state='valid'] { color: var(--gf-color-success-fg); }
    .status[data-state='invalid'] { color: var(--gf-color-danger-fg); }
    .hint { margin: var(--gf-space-2) 0 0; font-size: var(--gf-font-size-sm); color: var(--gf-color-text-muted); }
    .msg { display: flex; align-items: center; gap: var(--gf-space-1); margin: var(--gf-space-2) 0 0; font-size: var(--gf-font-size-sm); }
    .msg[data-state='invalid'] { color: var(--gf-color-danger-fg); }
    .msg[data-state='valid'] { color: var(--gf-color-success-fg); }
  `],
})
export class GfFormField {
  readonly label = input('');
  readonly required = input(false);
  /** Id del control proyectado (el mismo que recibe como `inputId`). */
  readonly fieldId = input.required<string>();
  readonly hint = input('');
  readonly state = input<FieldState>('default');
  readonly message = input('');
  /** Muestra el icono de estado a la derecha del control (no para <select>). */
  readonly statusIcon = input(true);
}
