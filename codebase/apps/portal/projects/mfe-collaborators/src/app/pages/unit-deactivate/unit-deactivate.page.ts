import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Injector, afterNextRender, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, SessionService, ViewState, toViewState } from '@gf/core';
import { GfAlert, GfButton, GfDialog, GfDialogCloseReason, GfEmptyState, GfViewState } from '@gf/ui';
import { of, switchMap } from 'rxjs';
import { OrganizationUnit } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UnitError, parseUnitError } from '../../data-access/unit-errors';
import { UNITS_URL, UnitReturnState } from '../../shared/unit-nav';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * SCR-030-01 (confirmar desactivación) y SCR-030-02 (bloqueo por dependencias) en un mismo diálogo con dos
 * variantes (SCR-030-Q1 permite fusionarlas). La ruta `unidades/:unitId/desactivar` ya la enlaza el listado.
 * Los textos de consecuencia, éxito y error son «propuestos» (SCR-030-Q4); el bloqueo omite el conteo en cero (SCR-030-Q3).
 */
@Component({
  selector: 'gf-unit-deactivate-page',
  imports: [NgTemplateOutlet, RouterLink, GfAlert, GfButton, GfDialog, GfEmptyState, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!allowed()) {
      <gf-empty-state title="No tiene permiso para desactivar unidades" icon="🔒">
        <a class="gf-link-button" [routerLink]="unitsUrl">Volver a unidades</a>
      </gf-empty-state>
    } @else {
      <gf-view-state [state]="loadState()" loadingLabel="Cargando unidad" (retry)="reload()">
        <ng-template #success let-unit>
          <ng-container [ngTemplateOutlet]="body" [ngTemplateOutletContext]="{ $implicit: unit }" />
        </ng-template>
      </gf-view-state>
    }

    <ng-template #body let-unit>
      @if (unit.status === 'inactive') {
        <gf-alert tone="info" icon="info">
          <p>{{ unit.name }} ya está inactiva.</p>
          <a class="gf-link-button" [routerLink]="unitsUrl">Volver a unidades</a>
        </gf-alert>
      } @else {
        <gf-dialog
          [open]="open()"
          (openChange)="open.set($event)"
          [heading]="blocked() ? 'No se puede desactivar ' + unit.name : 'Desactivar ' + unit.name"
          [role]="blocked() ? 'alertdialog' : 'dialog'"
          [busy]="saving()"
          (closed)="onClosed(unit, $event)"
        >
          <div gfDialogBody>
            @if (blocked(); as b) {
              <gf-alert tone="danger" icon="error">
                No se puede desactivar: {{ b }}.
              </gf-alert>
              <p>Resuélvelas primero y vuelve a intentarlo.</p>
              <ul class="links">
                @if (children() > 0) {
                  <li><a class="gf-link-button" [routerLink]="unitsUrl">Ir a las unidades hijas</a></li>
                }
                @if (people() > 0) {
                  <li><a class="gf-link-button" routerLink="/colaboradores">Ir a las personas</a></li>
                }
              </ul>
            } @else {
              <p>La unidad no se borra: conserva su historial y cierra su vigencia.</p>
              @if (error(); as e) {
                <gf-alert tone="danger" icon="error"><p>{{ e }}</p></gf-alert>
              }
            }
          </div>
          <div gfDialogActions>
            @if (blocked()) {
              <gf-button variant="primary" data-close (pressed)="open.set(false)">Cerrar</gf-button>
            } @else {
              <gf-button variant="secondary" data-gf-dialog-cancel [disabled]="saving()" (pressed)="open.set(false)">Cancelar</gf-button>
              <gf-button variant="destructive" [loading]="saving()" [ariaLabel]="'Desactivar ' + unit.name" (pressed)="deactivate(unit)">{{ error() ? 'Reintentar' : 'Desactivar' }}</gf-button>
            }
          </div>
        </gf-dialog>
      }
    </ng-template>
  `,
})
export class UnitDeactivatePage {
  private readonly api = inject(OrganizationsService);
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly unitId = inject(ActivatedRoute).snapshot.paramMap.get('unitId')!;

  protected readonly unitsUrl = UNITS_URL;
  protected readonly allowed = signal(inject(SessionService).hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));
  protected readonly open = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly children = signal(0);
  protected readonly people = signal(0);
  protected readonly blocked = signal('');
  private readonly nonce = signal(0);
  private seeded = false;

  protected readonly loadState = toSignal(
    this.allowed() ? toObservable(this.nonce).pipe(switchMap(() => toViewState(this.api.get(this.unitId)))) : of({ kind: 'loading' } as ViewState<OrganizationUnit>),
    { initialValue: { kind: 'loading' } as ViewState<OrganizationUnit> },
  );

  constructor() {
    // Si la unidad ya trae conteos de dependencias, se muestra el bloqueo sin intentar desactivar (FLW-030-Q2).
    toObservable(this.loadState).subscribe((s) => {
      if (s.kind === 'success' && !this.seeded) {
        this.seeded = true;
        this.block(s.data.active_children_count ?? 0, s.data.current_people_count ?? 0, true);
      }
    });
  }

  protected reload(): void {
    this.nonce.update((n) => n + 1);
  }

  protected deactivate(unit: OrganizationUnit): void {
    if (this.saving()) return;
    this.saving.set(true);
    this.api.deactivate(unit.id, unit.row_version).subscribe({
      next: () => {
        this.saving.set(false);
        const state: UnitReturnState = { highlightUnitId: unit.id, notice: `Unidad desactivada: ${unit.name} ahora figura como Inactiva` };
        void this.router.navigate([UNITS_URL], { state });
      },
      error: (err: unknown) => {
        this.saving.set(false);
        this.fail(parseUnitError(err));
      },
    });
  }

  /** Escape, fondo, «Cancelar» y «Cerrar»: vuelve al listado sin cambios y devuelve el foco a la unidad. */
  protected onClosed(unit: OrganizationUnit, _reason: GfDialogCloseReason): void {
    const state: UnitReturnState = { highlightUnitId: unit.id };
    void this.router.navigate([UNITS_URL], { state });
  }

  private fail(err: UnitError): void {
    switch (err.kind) {
      case 'dependencies':
        this.block(Number(err.details['active_children_count'] ?? 0), Number(err.details['current_people_count'] ?? 0), true);
        return;
      case 'forbidden':
        this.allowed.set(false);
        return;
      case 'stale':
        this.error.set('La unidad cambió mientras la editabas. Vuelve al listado y ábrela de nuevo para ver la versión actual.');
        return;
      case 'already-inactive':
        this.error.set('La unidad ya está inactiva.');
        return;
      default:
        this.error.set('No se pudo desactivar la unidad. Intente de nuevo.');
    }
  }

  private block(children: number, people: number, moveFocus: boolean): void {
    if (children <= 0 && people <= 0) return;
    this.children.set(children);
    this.people.set(people);
    const parts: string[] = [];
    if (children > 0) parts.push(`la unidad tiene ${plural(children, 'unidad hija activa', 'unidades hijas activas')}`);
    if (people > 0) parts.push(`${children > 0 ? '' : 'la unidad tiene '}${plural(people, 'persona con pertenencia vigente', 'personas con pertenencia vigente')}`);
    this.blocked.set(parts.join(' y '));
    this.error.set('');
    if (moveFocus) afterNextRender(() => this.host.nativeElement.querySelector<HTMLElement>('[data-close] button')?.focus(), { injector: this.injector });
  }
}
