import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { GfAutocomplete } from '@gf/ui';
import { Page } from '@gf/core';
import { NEVER, Observable, map, of, throwError, timer } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrganizationUnit, UnitListQuery } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UnitListPage } from './unit-list.page';

function unit(over: Partial<OrganizationUnit> & Pick<OrganizationUnit, 'id' | 'name'>): OrganizationUnit {
  return {
    type: 'internal_unit',
    parent_id: null,
    status: 'active',
    from_date: '2024-01-15',
    thru_date: null,
    active_children_count: 0,
    current_people_count: 0,
    ...over,
  };
}
const ROOT = unit({ id: 'u-1', name: 'Ingeniería', active_children_count: 1, current_people_count: 10 });
const CHILD = unit({ id: 'u-2', name: 'Desarrollo', parent_id: 'u-1', from_date: '2024-03-01', active_children_count: 0, current_people_count: 5 });
const OLD = unit({ id: 'u-3', name: 'Soporte antiguo', parent_id: 'u-1', status: 'inactive', from_date: '2023-01-10', thru_date: '2025-06-30' });

function page(data: OrganizationUnit[], over: Partial<Page<OrganizationUnit>['pagination']> = {}): Page<OrganizationUnit> {
  return { data, pagination: { page: 1, limit: 20, total: data.length, total_pages: 1, has_next: false, has_prev: false, ...over } };
}

/** La consulta del directorio de nombres (status=all, limit=100) la hace la página una vez para resolver «Unidad padre». */
const isDirectory = (q: UnitListQuery) => q.limit === 100 && q.status === 'all' && !q.search;

describe('UnitListPage (SCR-028-01)', () => {
  let fixture: ComponentFixture<UnitListPage>;
  let list: ReturnType<typeof vi.fn>;
  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';
  const pageCalls = () => list.mock.calls.map((c) => c[0] as UnitListQuery).filter((q) => !isDirectory(q) && q.limit !== 10);
  const lastQuery = () => pageCalls().at(-1)!;

  async function settle() {
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(400);
    fixture.detectChanges();
  }

  async function open(result: (q: UnitListQuery) => Observable<Page<OrganizationUnit>>) {
    list = vi.fn((q: UnitListQuery) => (isDirectory(q) ? of(page([ROOT, CHILD, OLD])) : result(q)));
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: OrganizationsService, useValue: { list } }],
    });
    fixture = TestBed.createComponent(UnitListPage);
    await settle();
  }

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  describe('consulta inicial y datos (AC-1)', () => {
    it('consulta por defecto solo las Activas, en vista lista, página 1', async () => {
      await open(() => of(page([ROOT, CHILD])));
      expect(lastQuery()).toMatchObject({ status: 'active', view: 'list', page: 1 });
      expect(lastQuery().search ?? '').toBe('');
      expect(lastQuery().ancestorId ?? null).toBeNull();
    });

    it('muestra el filtro de estado en «Activa» y el chip «Estado: Activa»', async () => {
      await open(() => of(page([ROOT])));
      const select = el().querySelector<HTMLSelectElement>('select')!;
      expect(select.value).toBe('active');
      expect(el().querySelector('gf-active-filters')!.textContent).toContain('Estado: Activa');
    });

    it('lista nombre, unidad padre, estado, vigencia desde y conteos de cada unidad', async () => {
      await open(() => of(page([ROOT, CHILD])));
      const rows = el().querySelectorAll('tbody tr');
      expect(rows.length).toBe(2);
      const child = rows[1].textContent!;
      expect(child).toContain('Desarrollo');
      expect(child).toContain('Ingeniería'); // nombre del padre resuelto desde el directorio
      expect(child).toContain('Activa');
      expect(child).toContain('01/03/2024');
      expect(child).toContain('5');
    });

    it('la unidad superior (sin padre) deja vacía la celda «Unidad padre»', async () => {
      await open(() => of(page([ROOT])));
      const cells = el().querySelectorAll('tbody tr:first-child td');
      expect(cells[0].textContent!.trim()).toBe('');
    });

    it('la Inactiva muestra «Inactiva» y su vigencia hasta', async () => {
      await open(() => of(page([OLD])));
      const row = el().querySelector('tbody tr')!.textContent!;
      expect(row).toContain('Inactiva');
      expect(row).toContain('30/06/2025');
      expect(row).toContain('10/01/2023');
    });

    it('el estado va con texto e icono decorativo, en verde de éxito para Activa', async () => {
      await open(() => of(page([ROOT, OLD])));
      const badges = el().querySelectorAll('tbody gf-badge');
      expect(badges[0].querySelector('.gf-badge--success')).not.toBeNull();
      expect(badges[0].querySelector('[aria-hidden="true"]')).not.toBeNull();
      expect(badges[1].querySelector('.gf-badge--success')).toBeNull();
      expect(text()).not.toMatch(/Eliminada|Borrada/);
    });

    it('la tabla tiene caption y encabezados con scope', async () => {
      await open(() => of(page([ROOT])));
      expect(el().querySelector('caption')!.textContent).toContain('Unidades organizacionales');
      const heads = Array.from(el().querySelectorAll('thead th')).map((h) => h.textContent!.trim());
      expect(heads).toEqual(['Nombre', 'Unidad padre', 'Estado', 'Vigencia', 'Unidades hijas activas', 'Personas vigentes', 'Acciones']);
    });
  });

  describe('estados', () => {
    it('cargando: muestra el indicador anunciado', async () => {
      list = vi.fn(() => NEVER);
      TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: OrganizationsService, useValue: { list } }] });
      fixture = TestBed.createComponent(UnitListPage);
      await settle();
      expect(Array.from(el().querySelectorAll('[role="status"]')).map((e) => e.textContent).join(' ')).toContain('Cargando unidades');
    });

    it('sin unidades registradas: vacío con acción para registrar la primera', async () => {
      await open(() => of(page([])));
      expect(text()).toContain('Aún no hay unidades registradas');
      const link = el().querySelector<HTMLAnchorElement>('a[href$="/nueva"]')!;
      expect(link.textContent).toContain('Registrar la primera unidad');
      expect(el().querySelector('table')).toBeNull();
    });

    it('error: alerta con «Reintentar» que repite la consulta con los mismos filtros', async () => {
      let fail = true;
      await open(() => (fail ? throwError(() => new HttpErrorResponse({ status: 500 })) : of(page([ROOT]))));
      expect(el().querySelector('[role="alert"]')).not.toBeNull();
      const before = pageCalls().length;
      fail = false;
      const retry = Array.from(el().querySelectorAll('button')).find((b) => b.textContent!.includes('Reintentar'))!;
      retry.click();
      await settle();
      expect(pageCalls().length).toBe(before + 1);
      expect(lastQuery()).toMatchObject({ status: 'active' });
      expect(el().querySelector('table')).not.toBeNull();
    });

    it('sin permisos (403): no muestra datos de la estructura', async () => {
      await open(() => throwError(() => new HttpErrorResponse({ status: 403 })));
      expect(text()).toContain('no está disponible para tu rol');
      expect(el().querySelector('table')).toBeNull();
      expect(text()).not.toContain('Desarrollo');
      expect(text()).not.toContain('Soporte antiguo');
    });
  });

  describe('acciones por fila (rutas previstas de SCR-029/030)', () => {
    it('Activa: Editar, Cambiar padre y Desactivar con nombre accesible que incluye la unidad', async () => {
      await open(() => of(page([CHILD])));
      const links = Array.from(el().querySelectorAll<HTMLAnchorElement>('tbody td:last-child a'));
      expect(links.map((a) => a.getAttribute('aria-label'))).toEqual(['Editar Desarrollo', 'Cambiar padre de Desarrollo', 'Desactivar Desarrollo']);
      expect(links.map((a) => a.getAttribute('href'))).toEqual(['/u-2/editar', '/u-2/padre', '/u-2/desactivar']);
    });

    it('Inactiva: Editar y Reactivar (no Desactivar)', async () => {
      await open(() => of(page([OLD])));
      const links = Array.from(el().querySelectorAll<HTMLAnchorElement>('tbody td:last-child a'));
      expect(links.map((a) => a.getAttribute('aria-label'))).toEqual(['Editar Soporte antiguo', 'Reactivar Soporte antiguo']);
      expect(links[1].getAttribute('href')).toBe('/u-3/reactivar');
    });
  });

  describe('búsqueda, estado y orden (AC-2, AC-3, AC-5)', () => {
    const type = async (value: string) => {
      const input = el().querySelector<HTMLInputElement>('#unit-search')!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      await settle();
    };
    const chooseStatus = async (value: string) => {
      const select = el().querySelector<HTMLSelectElement>('select')!;
      select.value = value;
      select.dispatchEvent(new Event('change'));
      await settle();
    };
    const sortButton = (name: string) =>
      Array.from(el().querySelectorAll<HTMLButtonElement>('th button')).find((b) => b.textContent!.includes(name))!;

    it('la búsqueda tiene etiqueta «Buscar por nombre» y admite hasta 100 caracteres', async () => {
      await open(() => of(page([ROOT])));
      expect(el().querySelector('label[for="unit-search"]')!.textContent).toContain('Buscar por nombre');
      expect(el().querySelector('#unit-search')!.getAttribute('maxlength')).toBe('100');
    });

    it('al escribir consulta con ese texto, vuelve a la página 1 y muestra el chip de búsqueda', async () => {
      await open(() => of(page([ROOT])));
      await type('Ing');
      expect(lastQuery()).toMatchObject({ search: 'Ing', page: 1, status: 'active' });
      expect(el().querySelector('gf-active-filters')!.textContent).toContain('Búsqueda: Ing');
    });

    it('espera a que se deje de escribir (una sola consulta por ráfaga)', async () => {
      await open(() => of(page([ROOT])));
      const before = pageCalls().length;
      const input = el().querySelector<HTMLInputElement>('#unit-search')!;
      for (const v of ['I', 'In', 'Ing']) {
        input.value = v;
        input.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(50);
      }
      await settle();
      expect(pageCalls().length).toBe(before + 1);
    });

    it('filtrar por Inactiva consulta status=inactive y muestra «Estado: Inactiva»', async () => {
      await open(() => of(page([OLD])));
      await chooseStatus('inactive');
      expect(lastQuery()).toMatchObject({ status: 'inactive' });
      expect(el().querySelector('gf-active-filters')!.textContent).toContain('Estado: Inactiva');
    });

    it('«Todas» consulta status=all', async () => {
      await open(() => of(page([ROOT, OLD])));
      await chooseStatus('all');
      expect(lastQuery()).toMatchObject({ status: 'all' });
    });

    it('ordena por cada columna: Nombre→name, Unidad padre→parent_name, Estado→status, Vigencia→from_date', async () => {
      await open(() => of(page([ROOT, CHILD])));
      const expected: Record<string, string> = { Nombre: 'name', 'Unidad padre': 'parent_name', Estado: 'status', Vigencia: 'from_date' };
      for (const [header, field] of Object.entries(expected)) {
        sortButton(header).click();
        await settle();
        expect(lastQuery().sort).toEqual({ field, direction: 'asc' });
      }
    });

    it('alterna ascendente y descendente, anuncia el orden con aria-sort y conserva búsqueda y estado', async () => {
      await open(() => of(page([ROOT, CHILD])));
      await type('Ing');
      await chooseStatus('all');
      sortButton('Nombre').click();
      await settle();
      sortButton('Nombre').click();
      await settle();
      expect(lastQuery()).toMatchObject({ search: 'Ing', status: 'all', sort: { field: 'name', direction: 'desc' } });
      const th = sortButton('Nombre').closest('th')!;
      expect(th.getAttribute('aria-sort')).toBe('descending');
      expect(text()).toContain('Ordenado por Nombre, descendente');
    });

    it('cambiar el orden vuelve a la página 1', async () => {
      await open((q) => of(page([ROOT], { page: q.page ?? 1, total_pages: 3, has_next: true })));
      (Array.from(el().querySelectorAll('button')).find((b) => b.textContent!.includes('Siguiente')) as HTMLButtonElement).click();
      await settle();
      expect(lastQuery().page).toBe(2);
      sortButton('Nombre').click();
      await settle();
      expect(lastQuery().page).toBe(1);
    });
  });

  describe('sin resultados y limpiar filtros (US-028 §6)', () => {
    it('con búsqueda sin coincidencias: mensaje de sin resultados anunciado, no el vacío inicial', async () => {
      await open((q) => of(page(q.search ? [] : [ROOT])));
      const input = el().querySelector<HTMLInputElement>('#unit-search')!;
      input.value = 'zzz';
      input.dispatchEvent(new Event('input'));
      await settle();
      expect(text()).toContain('Sin resultados para los filtros aplicados');
      expect(text()).not.toContain('Aún no hay unidades registradas');
      expect(el().querySelector('[role="status"] gf-empty-state')).not.toBeNull();
      expect(el().querySelector('gf-active-filters')!.textContent).toContain('Búsqueda: zzz');
    });

    it('con estado Inactiva y 0 filas es sin resultados, no «sin unidades registradas»', async () => {
      await open((q) => of(page(q.status === 'inactive' ? [] : [ROOT])));
      const select = el().querySelector<HTMLSelectElement>('select')!;
      select.value = 'inactive';
      select.dispatchEvent(new Event('change'));
      await settle();
      expect(text()).toContain('Sin resultados para los filtros aplicados');
    });

    it('«Limpiar filtros» vuelve a Activas sin búsqueda, conserva el orden y devuelve el foco a la búsqueda', async () => {
      await open((q) => of(page(q.search ? [] : [ROOT])));
      Array.from(el().querySelectorAll<HTMLButtonElement>('th button')).find((b) => b.textContent!.includes('Nombre'))!.click();
      await settle();
      const input = el().querySelector<HTMLInputElement>('#unit-search')!;
      input.value = 'zzz';
      input.dispatchEvent(new Event('input'));
      await settle();
      const clear = Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.includes('Limpiar filtros'))!;
      expect(clear.disabled).toBe(false);
      clear.click();
      await settle();
      expect(lastQuery()).toMatchObject({ status: 'active', page: 1, sort: { field: 'name', direction: 'asc' } });
      expect(lastQuery().search ?? '').toBe('');
      expect(el().querySelector<HTMLInputElement>('#unit-search')!.value).toBe('');
      expect(document.activeElement).toBe(el().querySelector('#unit-search'));
      expect(el().querySelector('table')).not.toBeNull();
    });
  });

  describe('paginación', () => {
    it('Anterior deshabilitado en la primera página; Siguiente pide la página 2 conservando los filtros', async () => {
      await open((q) => of(page([ROOT], { page: q.page ?? 1, total: 45, total_pages: 3, has_next: (q.page ?? 1) < 3, has_prev: (q.page ?? 1) > 1 })));
      const btn = (name: string) => Array.from(el().querySelectorAll<HTMLButtonElement>('nav button')).find((b) => b.textContent!.includes(name))!;
      expect(btn('Anterior').disabled).toBe(true);
      expect(text()).toContain('Página 1 de 3');
      btn('Siguiente').click();
      await settle();
      expect(lastQuery()).toMatchObject({ page: 2, status: 'active' });
      expect(btn('Anterior').disabled).toBe(false);
      expect(text()).toContain('Página 2 de 3');
    });
  });

  describe('recarga con datos previos (foco)', () => {
    it('al reordenar mientras carga, la tabla y su botón de orden siguen en el DOM con el foco y la tabla marca aria-busy', async () => {
      await open((q) => timer(100).pipe(map(() => page([ROOT, CHILD], { page: q.page ?? 1 }))));
      await vi.advanceTimersByTimeAsync(200);
      fixture.detectChanges();
      const btn = Array.from(el().querySelectorAll<HTMLButtonElement>('th button')).find((b) => b.textContent!.includes('Nombre'))!;
      btn.focus();
      btn.click();
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(260); // pasó el debounce, la respuesta sigue pendiente
      fixture.detectChanges();
      expect(el().contains(btn)).toBe(true);
      expect(document.activeElement).toBe(btn);
      expect(el().querySelector('table')!.getAttribute('aria-busy')).toBe('true');
      await vi.advanceTimersByTimeAsync(200);
      fixture.detectChanges();
      expect(el().querySelector('table')!.getAttribute('aria-busy')).toBeNull();
    });
  });

  describe('filtro por unidad padre (AC-4)', () => {
    const autocomplete = () => fixture.debugElement.query(By.directive(GfAutocomplete)).componentInstance as GfAutocomplete;

    it('tiene la etiqueta «Unidad padre» enlazada al campo', async () => {
      await open(() => of(page([ROOT])));
      expect(el().querySelector('label[for="unit-parent"]')!.textContent).toContain('Unidad padre');
      expect(el().querySelector('input#unit-parent')).not.toBeNull();
    });

    it('sugiere unidades por nombre de cualquier estado (consulta con status=all, límite 10)', async () => {
      await open(() => of(page([ROOT])));
      const options = await new Promise<{ id: string; label: string }[]>((resolve) => autocomplete().searchFn()('Ing').subscribe(resolve));
      const call = list.mock.calls.map((c) => c[0] as UnitListQuery).find((q) => q.limit === 10)!;
      expect(call).toMatchObject({ search: 'Ing', status: 'all', limit: 10 });
      expect(options.map((o) => o.label)).toContain('Ingeniería');
    });

    it('elegir una unidad filtra por ella y sus descendientes (ancestor_id), reinicia la página y muestra el chip', async () => {
      await open(() => of(page([CHILD])));
      autocomplete().selected.emit({ id: 'u-1', label: 'Ingeniería' });
      await settle();
      expect(lastQuery()).toMatchObject({ ancestorId: 'u-1', page: 1, status: 'active' });
      expect(el().querySelector('gf-active-filters')!.textContent).toContain('Unidad padre: Ingeniería');
    });

    it('vaciar el campo quita el filtro de unidad padre', async () => {
      await open(() => of(page([CHILD])));
      autocomplete().selected.emit({ id: 'u-1', label: 'Ingeniería' });
      await settle();
      autocomplete().textChange.emit('');
      await settle();
      expect(lastQuery().ancestorId ?? null).toBeNull();
      expect(el().querySelector('gf-active-filters')!.textContent).not.toContain('Unidad padre');
    });

    it('«Limpiar filtros» también quita la unidad padre', async () => {
      await open(() => of(page([CHILD])));
      autocomplete().selected.emit({ id: 'u-1', label: 'Ingeniería' });
      await settle();
      Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.includes('Limpiar filtros'))!.click();
      await settle();
      expect(lastQuery().ancestorId ?? null).toBeNull();
    });
  });

  describe('vista Lista / Jerarquía (AC-6)', () => {
    const TREE = [{ ...ROOT, children: [CHILD, { ...OLD, children: [] }] }];
    const toggle = (name: string) => Array.from(el().querySelectorAll<HTMLButtonElement>('[role="group"] button')).find((b) => b.textContent!.includes(name))!;
    const openTree = async () => {
      await open((q) => of(q.view === 'tree' ? page(TREE) : page([ROOT, CHILD])));
      toggle('Jerarquía').click();
      await settle();
    };

    it('alternador «Vista» con Lista presionada por defecto', async () => {
      await open(() => of(page([ROOT])));
      expect(el().querySelector('[role="group"][aria-label="Vista"]')).not.toBeNull();
      expect(toggle('Lista').getAttribute('aria-pressed')).toBe('true');
      expect(toggle('Jerarquía').getAttribute('aria-pressed')).toBe('false');
    });

    it('Jerarquía consulta view=tree, conservando búsqueda y estado, y muestra un árbol en lugar de la tabla', async () => {
      await open((q) => of(q.view === 'tree' ? page(TREE) : page([ROOT, CHILD])));
      const input = el().querySelector<HTMLInputElement>('#unit-search')!;
      input.value = 'Ing';
      input.dispatchEvent(new Event('input'));
      await settle();
      toggle('Jerarquía').click();
      await settle();
      expect(lastQuery()).toMatchObject({ view: 'tree', search: 'Ing', status: 'active', page: 1 });
      expect(el().querySelector('[role="tree"]')).not.toBeNull();
      expect(el().querySelector('table')).toBeNull();
      expect(toggle('Jerarquía').getAttribute('aria-pressed')).toBe('true');
    });

    it('cada unidad aparece bajo su padre con nivel, estado y vigencia', async () => {
      await openTree();
      const items = Array.from(el().querySelectorAll('[role="treeitem"]'));
      expect(items.map((i) => i.getAttribute('aria-level'))).toEqual(['1', '2', '2']);
      const child = items[1].textContent!;
      expect(child).toContain('Desarrollo');
      expect(child).toContain('Activa');
      expect(child).toContain('01/03/2024');
      const old = items[2].textContent!;
      expect(old).toContain('Inactiva');
      expect(old).toContain('30/06/2025');
      expect(items[0].getAttribute('aria-expanded')).toBe('true');
    });

    it('el árbol se opera con flechas: ← colapsa la rama', async () => {
      await openTree();
      const root = el().querySelector<HTMLElement>('[role="treeitem"]')!;
      root.focus();
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      fixture.detectChanges();
      expect(el().querySelector('[role="treeitem"]')!.getAttribute('aria-expanded')).toBe('false');
      expect(el().querySelectorAll('[role="treeitem"]').length).toBe(1);
    });

    it('anuncia el cambio de vista en una región de estado', async () => {
      await openTree();
      const live = Array.from(el().querySelectorAll('[role="status"]')).map((e) => e.textContent).join(' ');
      expect(live).toContain('Vista Jerarquía');
    });

    it('volver a Lista consulta sin view=tree y muestra la tabla', async () => {
      await openTree();
      toggle('Lista').click();
      await settle();
      expect(lastQuery().view).toBe('list');
      expect(el().querySelector('table')).not.toBeNull();
      expect(el().querySelector('[role="tree"]')).toBeNull();
    });

    it('la jerarquía pagina por raíces con el mismo paginador', async () => {
      await open((q) => of(q.view === 'tree' ? page(TREE, { total: 40, total_pages: 2, has_next: true }) : page([ROOT])));
      toggle('Jerarquía').click();
      await settle();
      expect(text()).toContain('Página 1 de 2');
    });
  });

  describe('refuerzos tras la mutación', () => {
    it('buscar estando en la página 2 vuelve a la página 1', async () => {
      await open((q) => of(page([ROOT], { page: q.page ?? 1, total_pages: 3, has_next: true, has_prev: (q.page ?? 1) > 1 })));
      Array.from(el().querySelectorAll<HTMLButtonElement>('nav button')).find((b) => b.textContent!.includes('Siguiente'))!.click();
      await settle();
      expect(lastQuery().page).toBe(2);
      const input = el().querySelector<HTMLInputElement>('#unit-search')!;
      input.value = 'Ing';
      input.dispatchEvent(new Event('input'));
      await settle();
      expect(lastQuery()).toMatchObject({ search: 'Ing', page: 1 });
    });

    it('si el padre no está en el directorio muestra su identificador en lugar de ocultarlo', async () => {
      await open(() => of(page([unit({ id: 'u-9', name: 'Huérfana', parent_id: 'id-desconocido' })])));
      expect(el().querySelector('tbody tr:first-child td')!.textContent).toContain('id-desconocido');
    });
  });
});
