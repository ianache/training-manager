import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CatalogApi } from './catalog.api';
import { RoleBody } from './catalog.models';

/** Contrato HTTP con el BFF (API-SPEC-003 §1): URL, parámetros, If-Match y cuerpos. */
describe('CatalogApi', () => {
  let api: CatalogApi;
  let http: HttpTestingController;
  const body: RoleBody = { name: 'Developer', description: null, levels: [] };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(CatalogApi);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('lista roles con búsqueda y límite, sin parámetros vacíos', () => {
    api.listRoles({ search: 'dev', limit: 100, status: '' }).subscribe();
    const req = http.expectOne((r) => r.url === '/api/v1/catalog/roles');
    expect(req.request.params.get('search')).toBe('dev');
    expect(req.request.params.get('limit')).toBe('100');
    expect(req.request.params.has('status')).toBe(false);
    req.flush({ data: [], pagination: {} });
  });

  it('lee un rol con el id codificado', () => {
    api.getRole('a/b').subscribe();
    http.expectOne('/api/v1/catalog/roles/a%2Fb').flush({});
  });

  it('crea con POST y el cuerpo tal cual', () => {
    api.createRole(body).subscribe();
    const req = http.expectOne('/api/v1/catalog/roles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('edita con PUT y la versión del rol en If-Match', () => {
    api.updateRole('r1', 4, body).subscribe();
    const req = http.expectOne('/api/v1/catalog/roles/r1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('If-Match')).toBe('"4"');
    req.flush({});
  });

  it('desactiva un rol con If-Match y un nivel sin él', () => {
    api.deactivateRole('r1', 2).subscribe();
    const role = http.expectOne('/api/v1/catalog/roles/r1/deactivate');
    expect(role.request.method).toBe('POST');
    expect(role.request.headers.get('If-Match')).toBe('"2"');
    role.flush({});

    api.setLevelStatus('r1', 'l1', 'reactivate').subscribe();
    const level = http.expectOne('/api/v1/catalog/roles/r1/levels/l1/reactivate');
    expect(level.request.method).toBe('POST');
    expect(level.request.headers.has('If-Match')).toBe(false);
    level.flush({});
  });

  it('lista competencias activas', () => {
    api.listCompetencies({ status: 'ACTIVE', limit: 100 }).subscribe();
    const req = http.expectOne((r) => r.url === '/api/v1/catalog/competencies');
    expect(req.request.params.get('status')).toBe('ACTIVE');
    req.flush({ data: [], pagination: {} });
  });
});
