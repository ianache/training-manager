import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Page, ViewState, toViewState } from '@gf/core';
import { GfBadge, GfButton, GfEmptyState, GfViewState } from '@gf/ui';
import { switchMap } from 'rxjs';
import { CatalogApi } from '../../data-access/catalog.api';
import { RoleSummary } from '../../data-access/catalog.models';

/** SCR-001 — Catálogo de roles (UXR-001). */
@Component({
  selector: 'gf-role-list-page',
  imports: [RouterLink, GfViewState, GfBadge, GfButton, GfEmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './role-list.page.html',
  styleUrl: './role-list.page.scss',
})
export class RoleListPage {
  private readonly api = inject(CatalogApi);
  private readonly reload = signal(0);

  protected readonly state = toSignal(
    toObservable(this.reload).pipe(switchMap(() => toViewState(this.api.listRoles()))),
    { initialValue: { kind: 'loading' } as ViewState<Page<RoleSummary>> },
  );

  protected retry(): void {
    this.reload.update((n) => n + 1);
  }
}
