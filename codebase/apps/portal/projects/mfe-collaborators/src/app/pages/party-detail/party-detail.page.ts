import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewState, toViewState } from '@gf/core';
import { GfViewState } from '@gf/ui';
import { switchMap } from 'rxjs';
import { PartiesApi } from '../../data-access/parties.api';
import { PARTY_ROLE_LABEL, PartyDetail, displayName } from '../../data-access/party.models';

/**
 * Ficha del colaborador (US-023). El BFF decide qué campos devuelve según el rol
 * (API-SPEC-001 "visibility"); la vista muestra lo que llega y no infiere permisos.
 */
@Component({
  selector: 'gf-party-detail-page',
  imports: [RouterLink, DatePipe, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="..">← Colaboradores</a>
    <gf-view-state [state]="state()" (retry)="reload.update((n) => n + 1)" loadingLabel="Cargando ficha">
      <ng-template #success let-p>
        <h1>{{ displayName(p) }}</h1>
        <dl class="facts">
          <dt>Código</dt><dd>{{ p.code }}</dd>
          <dt>Correo laboral</dt><dd>{{ p.contact.email_work }}</dd>
          <dt>Tipo</dt><dd>{{ roleLabel(p.role) }}</dd>
          @if (p.contact.phone_work) {
            <dt>Teléfono laboral</dt><dd>{{ p.contact.phone_work }}</dd>
          }
          @if (p.identification; as id) {
            <dt>Identificación</dt><dd>{{ id.type }} {{ id.number }} ({{ id.country }})</dd>
          }
          @if (p.created_at) {
            <dt>Registrado</dt><dd>{{ p.created_at | date: 'medium' }} por {{ p.created_by }}</dd>
          }
        </dl>
        <!-- La vista limitada (otros colaboradores) no trae historial: se omite la sección. -->
        @if (p.role_assignments) {
          <h2>Rol-Nivel vigente e historial</h2>
          <ul>
            @for (a of p.role_assignments; track a.id) {
              <li>{{ a.role }} · {{ a.level }} — desde {{ a.from_date }}{{ a.thru_date ? ' hasta ' + a.thru_date : '' }}</li>
            } @empty {
              <li>Sin asignaciones de Rol-Nivel</li>
            }
          </ul>
        }
      </ng-template>
    </gf-view-state>
  `,
  styles: `.facts { display: grid; grid-template-columns: max-content 1fr; gap: var(--gf-space-2) var(--gf-space-6); }
           dt { color: var(--gf-color-text-muted); }  dd { margin: 0; }`,
})
export class PartyDetailPage {
  private readonly api = inject(PartiesApi);
  readonly partyId = input.required<string>();
  protected readonly reload = signal(0);
  protected readonly displayName = displayName;
  protected roleLabel(role: string): string {
    return PARTY_ROLE_LABEL[role] ?? role;
  }

  protected readonly state = toSignal(
    toObservable(computed(() => ({ id: this.partyId(), n: this.reload() }))).pipe(
      switchMap(({ id }) => toViewState(this.api.get(id))),
    ),
    { initialValue: { kind: 'loading' } as ViewState<PartyDetail> },
  );
}
