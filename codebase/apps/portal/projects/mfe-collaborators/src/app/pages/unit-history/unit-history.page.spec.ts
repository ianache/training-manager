import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { Page, SessionService } from '@gf/core';
import { NEVER, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrganizationUnit, UnitRelationship } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UnitHistoryPage } from './unit-history.page';

const DEV = { id: 'u-2', name: 'Desarrollo' } as OrganizationUnit;
const rel = (over: Partial<UnitRelationship>): UnitRelationship => ({
  previous_parent: null, new_parent: null, from_date: '2024-01-01', thru_date: null, changed_by: 'ana', ...over,
});
const CURRENT = rel({ previous_parent: { id: 'u-1', name: 'Ingeniería' }, new_parent: { id: 'u-3', name: 'Operaciones' }, from_date: '2025-06-10', changed_by: 'luis' });
const OLD = rel({ previous_parent: null, new_parent: { id: 'u-1', name: 'Ingeniería' }, from_date: '2024-02-01', thru_date: '2025-06-10', changed_by: 'ana' });
const page = (data: UnitRelationship[], over: Partial<Page<UnitRelationship>['pagination']> = {}): Page<UnitRelationship> => ({
  data, pagination: { page: 1, limit: 20, total: data.length, total_pages: 1, has_next: false, has_prev: false, ...over },
});

describe('UnitHistoryPage (SCR-029-04 historial de relaciones y vigencias)', () => {
  let fixture: ComponentFixture<UnitHistoryPage>;
  let api: { get: ReturnType<typeof vi.fn>; relationships: ReturnType<typeof vi.fn> };
  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';
  const rows = () => Array.from(el().querySelectorAll('tbody tr')).map((r) => Array.from(r.querySelectorAll('th, td')).map((c) => c.textContent!.replace(/\s+/g, ' ').trim()));
  const btn = (label: string) => Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.trim() === label)!;

  async function open(rels: () => Observable<Page<UnitRelationship>>, allowed = true) {
    api = { get: vi.fn(() => of(DEV)), relationships: vi.fn(rels) };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: OrganizationsService, useValue: api },
        { provide: SessionService, useValue: { hasAnyRole: () => allowed } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ unitId: 'u-2' }) } } },
      ],
    });
    fixture = TestBed.createComponent(UnitHistoryPage);
    await settle();
  }
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  beforeEach(() => TestBed.resetTestingModule());

  it('consulta el historial de la unidad y lo muestra en una tabla con caption y las columnas del SCR', async () => {
    await open(() => of(page([CURRENT, OLD])));
    expect(api.relationships).toHaveBeenCalledWith('u-2', 1);
    expect(el().querySelector('h1')!.textContent).toContain('Historial de relaciones');
    expect(text()).toContain('Desarrollo');
    expect(el().querySelector('table caption')!.textContent!.trim()).not.toBe('');
    const headers = Array.from(el().querySelectorAll('thead th')).map((h) => h.textContent!.trim());
    expect(headers).toEqual(['Padre anterior', 'Padre nuevo', 'Desde', 'Hasta', 'Realizado por']);
  });

  it('conserva el orden recibido (más reciente primero), con fechas dd/mm/aaaa y «Sin unidad padre» cuando no había anterior', async () => {
    await open(() => of(page([CURRENT, OLD])));
    const r = rows();
    expect(r[0].slice(0, 2)).toEqual(['Ingeniería', 'Operaciones']);
    expect(r[1][0]).toBe('Sin unidad padre');
    expect(r[1][2]).toContain('01/02/2024');
    expect(r[1][3]).toBe('10/06/2025');
    expect(r[1][4]).toBe('ana');
  });

  it('la relación vigente tiene «Hasta» vacío y se marca con una etiqueta de texto «Vigente», no solo por color', async () => {
    await open(() => of(page([CURRENT, OLD])));
    const current = rows()[0];
    expect(current[3]).toBe('');
    expect(current[2]).toContain('Vigente');
    expect(rows()[1].join(' ')).not.toContain('Vigente');
  });

  it('sin cambios registrados muestra «Aún no hay cambios registrados»', async () => {
    await open(() => of(page([])));
    expect(text()).toContain('Aún no hay cambios registrados');
    expect(el().querySelector('table')).toBeNull();
  });

  it('pagina con Anterior/Siguiente y anuncia la página', async () => {
    await open(() => of(page([CURRENT], { page: 1, total_pages: 2, has_next: true })));
    expect(btn('Anterior').disabled).toBe(true);
    expect(btn('Siguiente').disabled).toBe(false);
    expect(text()).toContain('Página 1 de 2');
    btn('Siguiente').click();
    await settle();
    expect(api.relationships).toHaveBeenCalledWith('u-2', 2);
  });

  it('muestra «Cargando» mientras consulta', async () => {
    await open(() => NEVER);
    expect(text()).toContain('Cargando');
  });

  it('un error muestra el aviso con «Reintentar», que vuelve a consultar', async () => {
    await open(() => throwError(() => new HttpErrorResponse({ status: 500 })));
    expect(el().querySelector('[role="alert"]')).toBeTruthy();
    api.relationships.mockReturnValue(of(page([CURRENT])));
    btn('Reintentar').click();
    await settle();
    expect(rows().length).toBe(1);
  });

  it('403 del servicio o sin rol: estado sin permiso, sin tabla', async () => {
    await open(() => throwError(() => new HttpErrorResponse({ status: 403 })));
    expect(text()).toContain('no está disponible para tu rol');
    TestBed.resetTestingModule();
    await open(() => of(page([CURRENT])), false);
    expect(text()).toContain('No tiene permiso para ver el historial');
    expect(el().querySelector('table')).toBeNull();
    expect(api.relationships).not.toHaveBeenCalled();
  });

  it('la navegación de migas tiene nombre accesible y vuelve a «Unidades organizacionales»', async () => {
    await open(() => of(page([CURRENT])));
    const nav = el().querySelector('nav[aria-label="Migas de pan"]')!;
    expect(nav.textContent).toContain('Unidades organizacionales');
    expect(nav.textContent).toContain('Historial');
  });
});
