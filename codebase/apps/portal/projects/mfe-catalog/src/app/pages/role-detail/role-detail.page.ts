import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GfEmptyState } from '@gf/ui';

/** SCR-002 — Detalle de rol (UXR-001). Pendiente: pestañas por nivel y competencias. */
@Component({
  selector: 'gf-role-detail-page',
  imports: [RouterLink, GfEmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="../..">← Catálogo de roles</a>
    <gf-empty-state title="Detalle de rol en construcción" [description]="'Rol: ' + roleId()" />
  `,
})
export class RoleDetailPage {
  /** Viene del path param :roleId (withComponentInputBinding). */
  readonly roleId = input.required<string>();
}
