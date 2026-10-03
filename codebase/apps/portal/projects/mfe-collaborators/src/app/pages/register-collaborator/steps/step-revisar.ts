import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GfBadge, GfButton, GfIcon } from '@gf/ui';
import { RegisterWizardStore } from '../register-collaborator.store';
import { COUNTRIES, ID_TYPES, StepId, TYPE_LABEL } from '../register-collaborator.rules';
import { WIZARD_STYLES } from './wizard.styles';

/** SCR-015-08 — Revisar y confirmar: resumen semántico (<dl>) con «Editar» por sección. */
@Component({
  selector: 'gf-step-revisar',
  imports: [GfButton, GfIcon, GfBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.submitError(); as err) {
      @if (err.kind === 'E10' || err.kind === 'E9') {
        <div class="banner" role="alert">
          <gf-icon name="error" size="1.5rem" [decorative]="true" />
          <div>
            <p class="alert-title">No fue posible completar el registro</p>
            <p class="alert-text">{{ err.message }}</p>
            @if (err.code) {
              <p class="alert-text"><code># Código: {{ err.code }}</code></p>
            }
          </div>
        </div>
        <p class="lead">Los datos ingresados se mantienen listos para ser procesados una vez reintentada la conexión:</p>
      }
    } @else {
      <p class="lead lead--strong">Revisa los datos antes de registrar:</p>
      <p class="lead">Asegúrate de que la información institucional y contractual sea correcta antes de emitir la confirmación.</p>
    }

    <div class="items">
      @for (it of items(); track it.step) {
        <section class="item" [attr.aria-labelledby]="'rev-' + it.step">
          <div class="item-main">
            <h3 class="item-title" [id]="'rev-' + it.step">{{ it.title }}</h3>
            @if (it.grid) {
              <dl class="grid">
                @for (g of it.grid; track g.k) {
                  <div><dt>{{ g.k }}</dt><dd>{{ g.v }}</dd></div>
                }
              </dl>
            } @else {
              <p class="value">
                {{ it.value }}
                @if (it.badge) { <gf-badge tone="info">{{ it.badge }}</gf-badge> }
              </p>
              @if (it.extra) { <p class="extra">{{ it.extra }}</p> }
            }
          </div>
          <gf-button variant="text" [ariaLabel]="'Editar ' + it.title" (pressed)="store.goToStep(it.step)">
            <gf-icon name="edit" size="1rem" [decorative]="true" /> Editar
          </gf-button>
        </section>
      }
    </div>
  `,
  styles: [
    WIZARD_STYLES,
    `
      .lead { margin: 0 0 var(--gf-space-4); font-size: var(--gf-font-size-sm); color: var(--gf-color-text-muted); }
      .lead--strong { font-size: var(--gf-font-size-md); color: var(--gf-color-text); margin-bottom: var(--gf-space-1); }
      .banner { display: flex; gap: var(--gf-space-3); padding: var(--gf-space-4); margin-bottom: var(--gf-space-4); border: 1px solid var(--gf-color-danger-fg); border-radius: var(--gf-radius-md); background: var(--gf-color-danger-bg); color: var(--gf-color-danger-fg); }
      .banner p { margin: 0 0 var(--gf-space-1); }
      .banner code { font-family: ui-monospace, monospace; font-size: 0.8125rem; }
      .items { display: grid; gap: var(--gf-space-3); }
      .item { display: flex; justify-content: space-between; gap: var(--gf-space-3); align-items: flex-start; padding: var(--gf-space-3) var(--gf-space-4); border: 1px solid color-mix(in srgb, var(--gf-color-border) 45%, transparent); border-radius: var(--gf-radius-md); background: var(--gf-color-surface); }
      .item-title { margin: 0 0 var(--gf-space-1); font-size: 0.75rem; font-weight: var(--gf-font-weight-regular); color: var(--gf-color-text-muted); }
      .value { margin: 0; font-size: var(--gf-font-size-md); font-weight: var(--gf-font-weight-semibold); display: flex; gap: var(--gf-space-2); align-items: center; flex-wrap: wrap; }
      .extra { margin: var(--gf-space-1) 0 0; font-size: var(--gf-font-size-sm); color: var(--gf-color-text-muted); }
      .grid { display: flex; gap: var(--gf-space-8); margin: 0; }
      .grid dt { font-size: 0.75rem; color: var(--gf-color-text-muted); }
      .grid dd { margin: 0; font-weight: var(--gf-font-weight-semibold); }
    `,
  ],
})
export class StepRevisar {
  protected readonly store = inject(RegisterWizardStore);

  protected readonly items = computed(() => {
    const d = this.store.data();
    const contractor = d.type === 'Contractor';
    const country = COUNTRIES.find((c) => c.code === d.idCountry)?.name ?? d.idCountry;
    const idLabel = ID_TYPES.find((t) => t.value === d.idType)?.short ?? d.idType;
    const level = d.role?.levels.find((l) => l.id === d.levelId);
    const [y, m, day] = d.fromDate.split('-');
    const list: Array<{ step: StepId; title: string; value?: string; extra?: string; badge?: string; grid?: Array<{ k: string; v: string }> }> = [
      { step: 'tipo', title: 'Tipo de colaborador', value: d.type ? TYPE_LABEL[d.type] : '' },
      {
        step: 'datos',
        title: 'Datos de la persona',
        value: `${d.firstNames.trim()} ${d.lastNames.trim()}`,
        extra: d.preferredName.trim() ? `Nombre preferido: ${d.preferredName.trim()}` : undefined,
      },
      { step: 'identificacion', title: 'Identificación', grid: [{ k: 'Tipo', v: idLabel }, { k: 'Número', v: d.idNumber.trim() }, { k: 'País', v: country }] },
      { step: 'correo', title: 'Correo laboral', value: d.email.trim() },
      { step: 'organizacion', title: contractor ? 'Proveedor' : 'Unidad', value: d.organization?.label ?? '', extra: d.organization?.sublabel },
    ];
    if (!contractor) list.push({ step: 'jefe', title: 'Jefe directo', value: d.manager?.label ?? '', extra: d.manager?.sublabel });
    list.push({
      step: 'rol',
      title: 'Rol-Nivel inicial',
      value: d.role?.label ?? '',
      badge: level?.label,
      extra: `Vigente desde: ${day}/${m}/${y}`,
    });
    return list;
  });
}
