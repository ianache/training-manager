import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { APP_CONFIG } from '@gf/core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OrganizationsService } from './organizations.service';

/** Forma real de las peticiones de gestión de unidades (BFF → party-management-service, API-SPEC-006/007). */
describe('OrganizationsService (lectura por id, escritura e historial)', () => {
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

  it('get: GET /organizations/{id} codificando el id', () => {
    let got: unknown;
    service.get('a b').subscribe((u) => (got = u));
    const req = http.expectOne(`${base}/organizations/a%20b`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'a b', name: 'X', row_version: 3 });
    expect(got).toMatchObject({ row_version: 3 });
  });

  it('create: POST con type internal_unit, name, parent_id y contact.email_work (BR-PTY-27), sin from_date, code ni location', () => {
    service.create({ name: 'Calidad', emailWork: 'calidad@comsatel.com.pe', parentId: 'u-1' }).subscribe();
    const req = http.expectOne(`${base}/organizations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Calidad', type: 'internal_unit', parent_id: 'u-1', contact: { email_work: 'calidad@comsatel.com.pe' } });
    req.flush({});
  });

  it('create: recorta el nombre y manda parent_id null para la unidad superior', () => {
    service.create({ name: '  Raíz ', emailWork: 'a@b.pe', parentId: null }).subscribe();
    const req = http.expectOne(`${base}/organizations`);
    expect(req.request.body.name).toBe('Raíz');
    expect(req.request.body.parent_id).toBeNull();
    req.flush({});
  });

  it('rename: PATCH solo con name y If-Match con la row_version entre comillas', () => {
    service.rename('u-1', '  Nuevo ', 4).subscribe();
    const req = http.expectOne(`${base}/organizations/u-1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ name: 'Nuevo' });
    expect(req.request.headers.get('If-Match')).toBe('"4"');
    req.flush({});
  });

  it('sin row_version no manda If-Match', () => {
    service.rename('u-1', 'N', null).subscribe();
    const req = http.expectOne(`${base}/organizations/u-1`);
    expect(req.request.headers.has('If-Match')).toBe(false);
    req.flush({});
  });

  it('changeParent: POST /parent con parent_id y from_date, e If-Match', () => {
    service.changeParent('u-1', { parent_id: 'u-9', from_date: '2026-10-01' }, 2).subscribe();
    const req = http.expectOne(`${base}/organizations/u-1/parent`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ parent_id: 'u-9', from_date: '2026-10-01' });
    expect(req.request.headers.get('If-Match')).toBe('"2"');
    req.flush({});
  });

  it('deactivate: POST /deactivate sin cuerpo y con If-Match', () => {
    service.deactivate('u-1', 7).subscribe();
    const req = http.expectOne(`${base}/organizations/u-1/deactivate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    expect(req.request.headers.get('If-Match')).toBe('"7"');
    req.flush({});
  });

  it('reactivate: POST /reactivate con from_date y, solo si se indica, parent_id', () => {
    service.reactivate('u-1', { from_date: '2026-10-02' }, 1).subscribe();
    let req = http.expectOne(`${base}/organizations/u-1/reactivate`);
    expect(req.request.body).toEqual({ from_date: '2026-10-02' });
    expect(req.request.headers.get('If-Match')).toBe('"1"');
    req.flush({});
    service.reactivate('u-1', { from_date: '2026-10-02', parent_id: 'u-3' }, 1).subscribe();
    req = http.expectOne(`${base}/organizations/u-1/reactivate`);
    expect(req.request.body).toEqual({ from_date: '2026-10-02', parent_id: 'u-3' });
    req.flush({});
  });

  it('relationships: GET /relationships con página y límite', () => {
    service.relationships('u-1', 2).subscribe();
    const req = http.expectOne((r) => r.url === `${base}/organizations/u-1/relationships`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('20');
    req.flush({ data: [], pagination: {} });
  });

  it('internalOrganization: GET /internal-organization (solo lectura, BR-PTY-28)', () => {
    service.internalOrganization().subscribe();
    const req = http.expectOne(`${base}/internal-organization`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: { id: 'o', name: 'COMSATEL', ruc: null, ruc_country: null, from_date: '2020-01-01', thru_date: null } });
  });

  it('internalOrganization: desenvuelve el sobre {data}', () => {
    let got: unknown;
    service.internalOrganization().subscribe((o) => (got = o));
    http.expectOne(`${base}/internal-organization`).flush({ data: { id: 'o', name: 'COMSATEL', ruc: '20123456789', ruc_country: 'PE', from_date: '2020-01-01', thru_date: null } });
    expect(got).toMatchObject({ name: 'COMSATEL', ruc: '20123456789' });
  });
});
