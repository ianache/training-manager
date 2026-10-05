import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { APP_CONFIG } from '@gf/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService.list', () => {
  const base = 'http://localhost:3000/api/v1';
  let service: OrganizationsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: APP_CONFIG, useValue: { apiBaseUrl: base } }],
    });
    service = TestBed.inject(OrganizationsService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  const call = (q: Parameters<OrganizationsService['list']>[0]) => {
    service.list(q).subscribe();
    const req = http.expectOne((r) => r.url === `${base}/organizations`);
    req.flush({ data: [], pagination: {} });
    return req.request;
  };

  it('consulta solo unidades internas (type=internal_unit)', () => {
    expect(call({}).params.get('type')).toBe('internal_unit');
  });

  it('envía estado activo, página 1 y límite 20 por defecto', () => {
    const r = call({});
    expect(r.method).toBe('GET');
    expect(r.params.get('status')).toBe('active');
    expect(r.params.get('page')).toBe('1');
    expect(r.params.get('limit')).toBe('20');
  });

  it('envía search recortado y omite la búsqueda vacía', () => {
    expect(call({ search: '  Ing  ' }).params.get('search')).toBe('Ing');
    expect(call({ search: '   ' }).params.has('search')).toBe(false);
  });

  it('mapea la unidad padre a ancestor_id (incluye descendientes) y no a parent_id', () => {
    const r = call({ ancestorId: 'u-1' });
    expect(r.params.get('ancestor_id')).toBe('u-1');
    expect(r.params.has('parent_id')).toBe(false);
  });

  it('serializa el orden como campo:dirección', () => {
    expect(call({ sort: { field: 'parent_name', direction: 'desc' } }).params.get('sort')).toBe('parent_name:desc');
  });

  it('no envía sort si no hay orden elegido', () => {
    expect(call({ sort: null }).params.has('sort')).toBe(false);
  });

  it('envía view=tree solo en la vista jerarquía', () => {
    expect(call({ view: 'tree' }).params.get('view')).toBe('tree');
    expect(call({ view: 'list' }).params.has('view')).toBe(false);
  });

  it('envía el estado elegido, incluido all', () => {
    expect(call({ status: 'all' }).params.get('status')).toBe('all');
    expect(call({ status: 'inactive' }).params.get('status')).toBe('inactive');
  });
});
