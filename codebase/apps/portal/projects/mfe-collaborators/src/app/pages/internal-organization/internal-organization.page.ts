import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AppRole, SessionService, ViewState, toViewState } from '@gf/core';
import { GfBadge, GfDescriptionItem, GfDescriptionList, GfEmptyState, GfViewState } from '@gf/ui';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { InternalOrganization } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UNITS_URL } from '../../shared/unit-nav';
import { formatDate } from '../unit-list/unit-list.page';

const COUNTRY: Record<string, string> = { PE: 'Perú' };

/**
 * SCR-017-01 (organización interna, solo lectura) y SCR-017-03 (acceso no autorizado).
 * SCR-017-02 (formulario de registro) NO se implementa: la organización interna es un registro único cargado por
 * migración, fuera de la API gestionada (BR-PTY-28, DTC-017 §2); no existe endpoint de escritura. Por eso el estado
 * vacío no ofrece «Registrar organización interna» (el SCR lo pedía) y se reporta como bloqueo/desviación.
 * Textos «propuestos» sin fuente: estado vacío y acceso no autorizado (SCR-017 §SCR-017-01/03, SCR-017-Q4).
 */
@Component({
  selector: 'gf-internal-organization-page',
  imports: [RouterLink, GfBadge, GfDescriptionList, GfEmptyState, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './internal-organization.page.scss',
  template: `
    <header class="page-header"><h1>Organización interna</h1></header>

    @if (forbidden()) {
      <section class="forbidden" tabindex="-1" aria-labelledby="forbidden-title">
        <h2 id="forbidden-title">Acceso no autorizado</h2>
        <p>No tienes permiso para gestionar la organización interna.</p>
      </section>
    } @else {
      <gf-view-state [state]="state()" loadingLabel="Cargando organización interna" (retry)="retry()">
        <ng-template #empty>
          <gf-empty-state title="Aún no has registrado la organización interna." />
        </ng-template>
        <ng-template #success let-org>
          <gf-description-list [items]="items(org)" layout="inline" />
          <p class="since"><gf-badge tone="success">Vigente desde {{ fmt(org.from_date) }}</gf-badge></p>
          <p><a class="gf-link-button" [routerLink]="unitsUrl">Continuar a unidades</a></p>
        </ng-template>
      </gf-view-state>
    }
  `,
})
export class InternalOrganizationPage {
  private readonly api = inject(OrganizationsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly unitsUrl = UNITS_URL;
  protected readonly fmt = formatDate;
  private readonly allowed = inject(SessionService).hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]);
  private readonly nonce = signal(0);

  protected readonly state = toSignal(
    this.allowed
      ? toObservable(this.nonce).pipe(
          switchMap(() =>
            toViewState(
              this.api.internalOrganization().pipe(
                // 404 = aún no registrada (estado vacío, no error); el resto se clasifica en toViewState.
                catchError((err: unknown) => (err instanceof HttpErrorResponse && err.status === 404 ? of(null) : throwError(() => err))),
              ),
              { isEmpty: (o) => o === null },
            ),
          ),
        )
      : of({ kind: 'forbidden' } as ViewState<InternalOrganization | null>),
    { initialValue: { kind: 'loading' } as ViewState<InternalOrganization | null> },
  );
  protected readonly forbidden = computed(() => this.state().kind === 'forbidden');

  constructor() {
    effect(() => {
      if (this.forbidden()) {
        afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>('.forbidden')?.focus(), { injector: this.injector });
      }
    });
  }

  protected items(o: InternalOrganization): GfDescriptionItem[] {
    return [
      { id: 'name', term: 'Razón social', value: o.name },
      { id: 'ruc', term: 'RUC', value: o.ruc ?? '' },
      { id: 'country', term: 'País emisor', value: o.ruc_country ? (COUNTRY[o.ruc_country] ?? o.ruc_country) : '' },
    ];
  }

  protected retry(): void {
    this.nonce.update((n) => n + 1);
  }
}
