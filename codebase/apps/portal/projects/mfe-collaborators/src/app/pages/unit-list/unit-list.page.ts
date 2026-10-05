import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, linkedSignal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Page, ViewState, toViewState } from '@gf/core';
import {
  AutocompleteOption,
  GfActiveFilter,
  GfActiveFilters,
  GfAutocomplete,
  GfBadge,
  GfButton,
  GfCellDef,
  GfDataTable,
  GfEmptyState,
  GfRowActions,
  GfSelect,
  GfToggleGroup,
  GfToggleOption,
  GfTree,
  GfTreeNode,
  GfTreeNodeDef,
  GfSort,
  GfTextInput,
  GfTableColumn,
  GfViewState,
} from '@gf/ui';
import { Observable, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { OrganizationUnit, UnitListQuery, UnitSortField, UnitStatusFilter } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';

const SORT_FIELD: Record<string, UnitSortField> = { name: 'name', parent: 'parent_name', status: 'status', vigencia: 'from_date' };
const SORT_COLUMN = Object.fromEntries(Object.entries(SORT_FIELD).map(([c, f]) => [f, c]));
const STATUS_LABEL: Record<UnitStatusFilter, string> = { active: 'Activa', inactive: 'Inactiva', all: 'Todas' };

/** 'YYYY-MM-DD' → 'dd/mm/aaaa' sin pasar por Date (evita desfases de zona horaria). */
export function formatDate(iso: string | null): string {
  const m = iso ? /^(\d{4})-(\d{2})-(\d{2})/.exec(iso) : null;
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

/**
 * SCR-028-01 — Gestión de unidades organizacionales: consulta con búsqueda, filtros y orden (US-028 AC-1 a AC-6).
 * Las rutas de las acciones de fila son las previstas para SCR-029/030 (aún no implementadas).
 */
@Component({
  selector: 'gf-unit-list-page',
  imports: [RouterLink, GfActiveFilters, GfAutocomplete, GfBadge, GfButton, GfCellDef, GfDataTable, GfEmptyState, GfRowActions, GfSelect, GfTextInput, GfToggleGroup, GfTree, GfTreeNodeDef, GfViewState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './unit-list.page.html',
  styleUrl: './unit-list.page.scss',
})
export class UnitListPage {
  private readonly api = inject(OrganizationsService);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly query = signal<UnitListQuery & { nonce: number }>({ search: '', status: 'active', view: 'list', sort: null, page: 1, nonce: 0 });

  protected readonly ancestorName = signal('');
  protected readonly viewAnnouncement = signal('');
  protected readonly view = computed(() => this.query().view ?? 'list');
  protected readonly viewOptions: GfToggleOption[] = [
    { value: 'list', label: 'Lista' },
    { value: 'tree', label: 'Jerarquía' },
  ];
  protected readonly search = computed(() => this.query().search ?? '');
  protected readonly status = computed(() => this.query().status ?? 'active');
  protected readonly tableSort = computed<GfSort | null>(() => {
    const s = this.query().sort;
    return s ? { columnId: SORT_COLUMN[s.field], direction: s.direction } : null;
  });
  /** Sin búsqueda ni padre y sin filtrar por Inactiva: cero filas significan que no hay unidades registradas. */
  protected readonly pristine = computed(() => !this.search().trim() && !this.query().ancestorId && this.status() !== 'inactive');

  private readonly raw = toSignal(
    toObservable(this.query).pipe(
      debounceTime(250),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap((q) => toViewState(this.api.list(q), { isEmpty: (p) => p.data.length === 0 })),
    ),
    { initialValue: { kind: 'loading' } as ViewState<Page<OrganizationUnit>> },
  );

  /** Últimos datos recibidos: se conservan mientras recarga para no destruir la tabla (y el foco del botón de orden). */
  private readonly lastData = linkedSignal<ViewState<Page<OrganizationUnit>>, Page<OrganizationUnit> | null>({
    source: this.raw,
    computation: (s, prev) => (s.kind === 'success' ? s.data : s.kind === 'loading' ? (prev?.value ?? null) : null),
  });
  protected readonly refreshing = computed(() => this.raw().kind === 'loading' && this.lastData() !== null);
  protected readonly state = computed<ViewState<Page<OrganizationUnit>>>(() => {
    const data = this.lastData();
    return this.raw().kind === 'loading' && data ? { kind: 'success', data } : this.raw();
  });

  /** El servicio solo devuelve `parent_id`: los nombres de los padres salen de un directorio único (hasta 100 unidades). */
  private readonly directory = toSignal(
    this.api.list({ status: 'all', limit: 100 }).pipe(map((p) => new Map(p.data.map((u) => [u.id, u.name])))),
    { initialValue: new Map<string, string>() },
  );

  protected readonly statusOptions = (Object.keys(STATUS_LABEL) as UnitStatusFilter[]).map((value) => ({ value, label: STATUS_LABEL[value] }));

  protected readonly columns: GfTableColumn<OrganizationUnit>[] = [
    { id: 'name', header: 'Nombre', sortable: true, cell: (u) => u.name },
    { id: 'parent', header: 'Unidad padre', sortable: true },
    { id: 'status', header: 'Estado', sortable: true },
    { id: 'vigencia', header: 'Vigencia', sortable: true },
    { id: 'children', header: 'Unidades hijas activas', cell: (u) => this.count(u.active_children_count) },
    { id: 'people', header: 'Personas vigentes', cell: (u) => this.count(u.current_people_count) },
  ];

  protected readonly rowId = (u: OrganizationUnit) => u.id;

  /** Árbol con todas las ramas expandidas cada vez que llegan datos nuevos (UXR-028-Q3 abierta). */
  protected readonly treeNodes = computed<GfTreeNode<OrganizationUnit>[]>(() => {
    const s = this.state();
    return s.kind === 'success' ? s.data.data.map((u) => this.toNode(u)) : [];
  });
  protected readonly expanded = linkedSignal<GfTreeNode<OrganizationUnit>[], ReadonlySet<string>>({
    source: this.treeNodes,
    computation: (nodes) => {
      const ids = new Set<string>();
      const walk = (list: readonly GfTreeNode<OrganizationUnit>[]) => {
        for (const n of list) {
          if (n.children?.length) ids.add(n.id);
          if (n.children) walk(n.children);
        }
      };
      walk(nodes);
      return ids;
    },
  });

  protected readonly activeFilters = computed<GfActiveFilter[]>(() => {
    const filters: GfActiveFilter[] = [{ id: 'status', label: 'Estado', value: STATUS_LABEL[this.status()] }];
    const search = this.search().trim();
    if (search) filters.push({ id: 'search', label: 'Búsqueda', value: search });
    if (this.query().ancestorId) filters.push({ id: 'parent', label: 'Unidad padre', value: this.ancestorName() });
    return filters;
  });

  protected readonly formatDate = formatDate;

  protected parentName(u: OrganizationUnit): string {
    return u.parent_id ? (this.directory().get(u.parent_id) ?? u.parent_id) : '';
  }

  protected statusLabel(u: OrganizationUnit): string {
    return u.status === 'active' ? 'Activa' : 'Inactiva';
  }

  protected onSearch(value: string): void {
    this.query.update((q) => ({ ...q, search: value, page: 1 }));
  }

  protected onStatus(value: string): void {
    this.query.update((q) => ({ ...q, status: value as UnitStatusFilter, page: 1 }));
  }

  protected onSort(sort: GfSort | null): void {
    const field = sort && SORT_FIELD[sort.columnId];
    this.query.update((q) => ({ ...q, sort: field ? { field, direction: sort.direction } : null, page: 1 }));
  }

  protected readonly searchParent = (q: string): Observable<AutocompleteOption[]> =>
    this.api.list({ search: q, status: 'all', limit: 10 }).pipe(map((p) => p.data.map((u) => ({ id: u.id, label: u.name }))));

  protected onParentSelected(opt: AutocompleteOption): void {
    this.ancestorName.set(opt.label);
    this.query.update((q) => ({ ...q, ancestorId: opt.id, page: 1 }));
  }

  protected onParentText(value: string): void {
    if (!value.trim() && this.query().ancestorId) this.query.update((q) => ({ ...q, ancestorId: null, page: 1 }));
  }

  protected onView(value: string | undefined): void {
    const view = value === 'tree' ? 'tree' : 'list';
    this.viewAnnouncement.set(view === 'tree' ? 'Vista Jerarquía' : 'Vista Lista');
    this.query.update((q) => ({ ...q, view, page: 1 }));
  }

  protected goTo(page: number): void {
    this.query.update((q) => ({ ...q, page }));
  }

  /** Vuelve a las Activas sin búsqueda; conserva orden y vista; devuelve el foco a la búsqueda. */
  protected clearFilters(): void {
    this.query.update((q) => ({ ...q, search: '', status: 'active', ancestorId: null, page: 1 }));
    this.host.nativeElement.querySelector<HTMLElement>('#unit-search')?.focus();
  }

  protected retry(): void {
    this.query.update((q) => ({ ...q, nonce: q.nonce + 1 }));
  }

  private toNode(u: OrganizationUnit): GfTreeNode<OrganizationUnit> {
    return { id: u.id, label: u.name, data: u, children: (u.children ?? []).map((c) => this.toNode(c)) };
  }

  private count(n: number | null): string {
    return n === null || n === undefined ? '' : String(n);
  }
}
