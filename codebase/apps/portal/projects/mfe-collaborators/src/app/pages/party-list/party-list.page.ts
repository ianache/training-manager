import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Page, ViewState, toViewState } from '@gf/core';
import { GfBadge, GfButton, GfViewState } from '@gf/ui';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { PartiesApi } from '../../data-access/parties.api';
import { PARTY_ROLE_LABEL, PartyStatus, PartySummary, displayName } from '../../data-access/party.models';

const STATUS_LABEL: Record<PartyStatus, { label: string; tone: 'success' | 'neutral' | 'info' }> = {
  active: { label: 'Vigente', tone: 'success' },
  inactive: { label: 'De baja', tone: 'neutral' },
  anonymized: { label: 'Anonimizado', tone: 'info' },
};

/** Lista de colaboradores con búsqueda y paginación (US-023, API-SPEC-001 §4.1). */
@Component({
  selector: 'gf-party-list-page',
  imports: [RouterLink, GfViewState, GfBadge, GfButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './party-list.page.html',
  styleUrl: './party-list.page.scss',
})
export class PartyListPage {
  private readonly api = inject(PartiesApi);

  protected readonly search = signal('');
  protected readonly page = signal(1);
  private readonly query = signal({ search: '', page: 1, nonce: 0 });

  protected readonly state = toSignal(
    toObservable(this.query).pipe(
      debounceTime(250),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((q) => toViewState(this.api.list({ search: q.search, page: q.page }))),
    ),
    { initialValue: { kind: 'loading' } as ViewState<Page<PartySummary>> },
  );

  protected readonly displayName = displayName;
  protected roleLabel(role: string): string {
    return PARTY_ROLE_LABEL[role] ?? role;
  }

  protected statusOf(status: PartyStatus) {
    return STATUS_LABEL[status] ?? { label: status, tone: 'neutral' as const };
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
    this.query.set({ search: value, page: 1, nonce: this.query().nonce });
  }

  protected goTo(page: number): void {
    this.page.set(page);
    this.query.update((q) => ({ ...q, page }));
  }

  protected retry(): void {
    this.query.update((q) => ({ ...q, nonce: q.nonce + 1 }));
  }
}
