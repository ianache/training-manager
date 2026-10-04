import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppRole, Page, SessionService, ViewState, toViewState } from '@gf/core';
import { GfBadge, GfButton, GfIcon, GfTextInput } from '@gf/ui';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { CatalogApi } from '../../data-access/catalog.api';
import { CompetencySummary, LEVEL_CODES, RoleSummary } from '../../data-access/catalog.models';

export type CatalogTab = 'roles' | 'competencies';

type Loaded =
  | { tab: 'roles'; page: Page<RoleSummary> }
  | { tab: 'competencies'; page: Page<CompetencySummary> };

/** Texto del conteo de niveles de la tabla de roles: «1 nivel», «3 niveles» (SCR-001-01). */
export const levelsText = (n: number): string => `${n} ${n === 1 ? 'nivel' : 'niveles'}`;

/**
 * SCR-001-01 — Catálogo de roles y competencias (UXR-001, diseño Stitch GEN-001-G). Pestañas «Roles» y «Competencias»,
 * búsqueda por nombre y, con permiso, «Crear rol» y «Crear competencia». Estados: predeterminado, cargando (filas
 * esqueleto), vacío, error con «Reintentar» (distinto del vacío) y solo lectura sin acciones de edición (BR-TRA-02).
 */
@Component({
  selector: 'gf-role-list-page',
  imports: [RouterLink, GfBadge, GfButton, GfIcon, GfTextInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-list.page.html',
  styleUrl: './role-list.page.scss',
})
export class RoleListPage {
  private readonly api = inject(CatalogApi);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly tab = signal<CatalogTab>('roles');
  protected readonly search = signal('');
  private readonly query = signal({ tab: 'roles' as CatalogTab, search: '', nonce: 0 });

  /** Crear y editar roles: Jefe de Ingeniería, Responsable de producto y ADMIN (BR-CAT-04/05). */
  protected readonly canEditRoles = computed(() =>
    this.session.hasAnyRole([AppRole.JefeIngenieria, AppRole.ProductOwner, AppRole.Admin]),
  );
  /** Alta de competencias: Jefe de Ingeniería y ADMIN (EVD-2026-0168, 0171). */
  protected readonly canEditCompetencies = computed(() => this.session.hasAnyRole([AppRole.JefeIngenieria, AppRole.Admin]));

  protected readonly levelCodes = LEVEL_CODES;
  protected readonly levelsText = levelsText;
  protected readonly skeletonRows = [28, 32, 24, 36];

  protected readonly state = toSignal(
    toObservable(this.query).pipe(
      debounceTime(250),
      distinctUntilChanged((a, b) => a.tab === b.tab && a.search === b.search && a.nonce === b.nonce),
      switchMap((q) => {
        const source =
          q.tab === 'roles'
            ? this.api.listRoles({ search: q.search, limit: 100 }).pipe(map((page): Loaded => ({ tab: 'roles', page })))
            : this.api
                .listCompetencies({ search: q.search, limit: 100 })
                .pipe(map((page): Loaded => ({ tab: 'competencies', page })));
        return toViewState(source, { isEmpty: (d) => d.page.data.length === 0 });
      }),
    ),
    { initialValue: { kind: 'loading' } as ViewState<Loaded> },
  );

  protected roles(): RoleSummary[] {
    const s = this.state();
    return s.kind === 'success' && s.data.tab === 'roles' ? s.data.page.data : [];
  }
  protected competencies(): CompetencySummary[] {
    const s = this.state();
    return s.kind === 'success' && s.data.tab === 'competencies' ? s.data.page.data : [];
  }
  /** La lista cargada corresponde a la pestaña activa (al cambiar de pestaña hay un instante de carga). */
  protected showing(tab: CatalogTab): boolean {
    const s = this.state();
    return s.kind === 'success' && s.data.tab === tab;
  }

  protected selectTab(tab: CatalogTab): void {
    if (tab === this.tab()) return;
    this.tab.set(tab);
    this.query.update((q) => ({ ...q, tab }));
  }

  /** Flechas izquierda y derecha, Inicio y Fin cambian de pestaña (patrón WAI-ARIA de pestañas). */
  protected onTabKey(event: KeyboardEvent): void {
    const order: CatalogTab[] = ['roles', 'competencies'];
    const i = order.indexOf(this.tab());
    const next =
      event.key === 'ArrowRight' ? order[(i + 1) % 2] : event.key === 'ArrowLeft' ? order[(i + 1) % 2] : event.key === 'Home' ? order[0] : event.key === 'End' ? order[1] : null;
    if (!next) return;
    event.preventDefault();
    this.selectTab(next);
    queueMicrotask(() => document.getElementById(`cat-tab-${next}`)?.focus());
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.query.update((q) => ({ ...q, search: value.trim() }));
  }

  protected createRole(): void {
    void this.router.navigate(['roles', 'nuevo'], { relativeTo: this.route });
  }

  protected retry(): void {
    this.query.update((q) => ({ ...q, nonce: q.nonce + 1 }));
  }
}
