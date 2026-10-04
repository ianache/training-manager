import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AppRole, Page, SessionService, ViewState, toViewState } from '@gf/core';
import { GfBadge, GfButton, GfEmptyState, GfTextInput, GfViewState } from '@gf/ui';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { CatalogApi } from '../../data-access/catalog.api';
import { RoleSummary } from '../../data-access/catalog.models';

/** SCR-001-01 — Catálogo de roles (UXR-001). La pestaña «Competencias» llega con su pantalla (SCR-001-03). */
@Component({
  selector: 'gf-role-list-page',
  imports: [RouterLink, GfViewState, GfBadge, GfButton, GfEmptyState, GfTextInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-list.page.html',
  styleUrl: './role-list.page.scss',
})
export class RoleListPage {
  private readonly api = inject(CatalogApi);
  private readonly session = inject(SessionService);

  protected readonly search = signal('');
  private readonly query = signal({ search: '', nonce: 0 });

  /** Crear y editar roles: Jefe de Ingeniería, Responsable de producto y ADMIN (BR-CAT-04/05). */
  protected readonly canEdit = computed(() =>
    this.session.hasAnyRole([AppRole.JefeIngenieria, AppRole.ProductOwner, AppRole.Admin]),
  );

  protected readonly state = toSignal(
    toObservable(this.query).pipe(
      debounceTime(250),
      distinctUntilChanged((a, b) => a.search === b.search && a.nonce === b.nonce),
      switchMap((q) => toViewState(this.api.listRoles({ search: q.search, limit: 100 }))),
    ),
    { initialValue: { kind: 'loading' } as ViewState<Page<RoleSummary>> },
  );

  protected onSearch(value: string): void {
    this.search.set(value);
    this.query.update((q) => ({ ...q, search: value.trim() }));
  }

  protected retry(): void {
    this.query.update((q) => ({ ...q, nonce: q.nonce + 1 }));
  }
}
