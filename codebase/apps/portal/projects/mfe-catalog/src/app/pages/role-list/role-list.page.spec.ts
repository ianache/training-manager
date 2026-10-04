import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { APP_CONFIG, AppRole, SessionService } from '@gf/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RoleListPage, levelsText } from './role-list.page';

const level = (n: number) => ({ id: `l${n}`, name: `N${n}`, ordinal: n, status: 'ACTIVE', usable: true, evidence_requirements: 1 });
const role = (id: string, name: string, levels: number, status = 'ACTIVE') => ({
  id,
  name,
  description: null,
  status,
  competency_count: 2,
  row_version: 1,
  levels: Array.from({ length: levels }, (_, i) => level(i + 1)),
});
const ROLES = {
  data: [role('r1', 'Developer', 3), role('r2', 'Analista QA', 2), role('r3', 'Jefe de proyecto', 1, 'INACTIVE')],
  pagination: {},
};
const COMPETENCIES = {
  data: [
    { id: 'c1', name: 'Comunicación oral', description: null, status: 'ACTIVE', current_version: { id: 'v', version_number: 2, status: 'APPROVED' }, levels_with_requirements: 4, row_version: 1 },
    { id: 'c2', name: 'Trabajo en equipo', description: null, status: 'ACTIVE', current_version: null, levels_with_requirements: 0, row_version: 1 },
  ],
  pagination: {},
};

const tick = () => new Promise((r) => setTimeout(r, 300)); // el debounce de la búsqueda es de 250 ms

/** SCR-001-01 (diseño Stitch GEN-001-G): pestañas, barra de controles, tablas y los estados A a E y solo lectura. */
describe('RoleListPage (SCR-001-01)', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<RoleListPage>;

  const host = () => fixture.nativeElement as HTMLElement;
  const text = () => host().textContent ?? '';
  const button = (label: string) => Array.from(host().querySelectorAll('button')).find((b) => b.textContent?.trim() === label);
  const headers = () => Array.from(host().querySelectorAll('thead th')).map((th) => th.textContent?.trim());
  const cells = (row: number) => Array.from(host().querySelectorAll('tbody tr')[row].children).map((c) => c.textContent?.replace(/\s+/g, ' ').trim());

  async function open(roles: AppRole[]) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', children: [] }]),
        { provide: APP_CONFIG, useValue: { apiBaseUrl: '/api/v1', authBaseUrl: '/auth' } },
        { provide: SessionService, useValue: { hasAnyRole: (r: readonly AppRole[]) => r.some((x) => roles.includes(x)) } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RoleListPage);
    fixture.detectChanges();
    await tick();
  }
  const answer = async (url: string, body: object, status = 200) => {
    const req = http.expectOne((r) => r.url === url);
    req.flush(body, { status, statusText: String(status) });
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => http.verify());

  it('título, pestañas «Roles» y «Competencias» y búsqueda por nombre', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', ROLES);
    expect(host().querySelector('h1')?.textContent).toBe('Catálogo de roles y competencias');
    const tabs = Array.from(host().querySelectorAll('[role="tab"]'));
    expect(tabs.map((t) => t.textContent?.trim())).toEqual(['Roles', 'Competencias']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(host().querySelector('label[for="cat-search"]')?.textContent).toBe('Buscar por nombre');
    expect(host().querySelector<HTMLInputElement>('#cat-search')?.placeholder).toBe('Buscar por nombre');
  });

  it('tabla de roles: Rol, Niveles y Estado, sin columna de competencias', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', ROLES);
    expect(headers()).toEqual(['Rol', 'Niveles', 'Estado']);
    expect(cells(0)).toEqual(['Developer', '3 niveles', expect.stringContaining('Activo')]);
    expect(cells(1)[1]).toBe('2 niveles');
    expect(cells(2)).toEqual(['Jefe de proyecto', '1 nivel', expect.stringContaining('Inactivo')]);
  });

  it('con permiso muestra «Crear rol» y «Crear competencia» (esta última aún sin alta)', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', ROLES);
    expect(button('Crear rol')).toBeTruthy();
    expect(button('Crear competencia')?.disabled).toBe(true);
  });

  it('el Responsable de producto crea roles pero no competencias', async () => {
    await open([AppRole.ProductOwner]);
    await answer('/api/v1/catalog/roles', ROLES);
    expect(button('Crear rol')).toBeTruthy();
    expect(button('Crear competencia')).toBeUndefined();
  });

  it('solo lectura (colaborador): ve la tabla y la búsqueda, sin botones de creación', async () => {
    await open([AppRole.Colaborador]);
    await answer('/api/v1/catalog/roles', ROLES);
    expect(cells(0)[0]).toBe('Developer');
    expect(button('Crear rol')).toBeUndefined();
    expect(button('Crear competencia')).toBeUndefined();
    expect(host().querySelector('#cat-search')).toBeTruthy();
  });

  it('«Crear rol» abre el formulario de rol nuevo', async () => {
    await open([AppRole.Admin]);
    await answer('/api/v1/catalog/roles', ROLES);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    button('Crear rol')!.click();
    expect(navigate).toHaveBeenCalledWith(['roles', 'nuevo'], expect.anything());
  });

  it('pestaña Competencias: versión vigente y niveles con requisitos «X de 4»', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', ROLES);
    (host().querySelector('#cat-tab-competencies') as HTMLElement).click();
    fixture.detectChanges();
    await tick();
    await answer('/api/v1/catalog/competencies', COMPETENCIES);
    expect(headers()).toEqual(['Competencia', 'Versión vigente', 'Niveles con requisitos']);
    expect(cells(0)).toEqual(['Comunicación oral', 'v2', '4 de 4']);
    expect(cells(1)).toEqual(['Trabajo en equipo', 'Sin versión aprobada', '0 de 4']);
    expect(host().querySelector('#cat-tab-competencies')?.getAttribute('aria-selected')).toBe('true');
  });

  it('las flechas cambian de pestaña con el teclado', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', ROLES);
    host().querySelector('[role="tablist"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(host().querySelector('#cat-tab-competencies')?.getAttribute('aria-selected')).toBe('true');
    expect(host().querySelector('#cat-tab-roles')?.getAttribute('tabindex')).toBe('-1');
    await tick();
    http.expectOne((r) => r.url === '/api/v1/catalog/competencies').flush(COMPETENCIES);
  });

  it('cargando: filas esqueleto, aviso accesible y la tabla aún con sus encabezados', async () => {
    await open([AppRole.JefeIngenieria]);
    expect(host().querySelectorAll('tbody tr.skeleton').length).toBe(4);
    expect(host().querySelector('[role="status"]')?.textContent).toContain('Cargando roles');
    expect(host().querySelector('[role="tabpanel"]')?.getAttribute('aria-busy')).toBe('true');
    await answer('/api/v1/catalog/roles', ROLES);
    expect(host().querySelectorAll('tbody tr.skeleton').length).toBe(0);
  });

  it('vacío: «No hay roles registrados todavía» con «Crear rol» si hay permiso', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', { data: [], pagination: {} });
    expect(host().querySelector('.empty h2')?.textContent).toBe('No hay roles registrados todavía');
    expect(host().querySelectorAll('.empty button').length).toBe(1);
    expect(host().querySelector('table')).toBeNull();
  });

  it('vacío sin permiso: el mismo texto y sin acción', async () => {
    await open([AppRole.Colaborador]);
    await answer('/api/v1/catalog/roles', { data: [], pagination: {} });
    expect(host().querySelector('.empty h2')?.textContent).toBe('No hay roles registrados todavía');
    expect(host().querySelectorAll('.empty button').length).toBe(0);
  });

  it('error: alerta «No se pudo cargar el catálogo» con «Reintentar», distinta del vacío; reintentar vuelve a pedir', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', { error: { code: 'X', message: 'interno', status: 500 } }, 500);
    const alert = host().querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('No se pudo cargar el catálogo');
    expect(text()).not.toContain('interno');
    expect(host().querySelector('.empty')).toBeNull();
    expect(host().querySelector('#cat-search')).toBeTruthy();
    button('Reintentar')!.click();
    fixture.detectChanges();
    await tick();
    await answer('/api/v1/catalog/roles', ROLES);
    expect(cells(0)[0]).toBe('Developer');
  });

  it('buscar por nombre pide la lista con el texto y limpiar vuelve a la completa', async () => {
    await open([AppRole.JefeIngenieria]);
    await answer('/api/v1/catalog/roles', ROLES);
    const input = host().querySelector<HTMLInputElement>('#cat-search')!;
    input.value = 'qa';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await tick();
    const req = http.expectOne((r) => r.url === '/api/v1/catalog/roles');
    expect(req.request.params.get('search')).toBe('qa');
    req.flush({ data: [ROLES.data[1]], pagination: {} });
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await tick();
    const all = http.expectOne((r) => r.url === '/api/v1/catalog/roles');
    expect(all.request.params.has('search')).toBe(false);
    all.flush(ROLES);
  });
});

describe('levelsText', () => {
  it('singular y plural', () => {
    expect([levelsText(1), levelsText(2), levelsText(0)]).toEqual(['1 nivel', '2 niveles', '0 niveles']);
  });
});
