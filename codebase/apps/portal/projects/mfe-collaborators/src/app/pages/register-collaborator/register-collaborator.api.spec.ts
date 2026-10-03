import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { RegisterCollaboratorApi } from './register-collaborator.api';
import { CreatePartyBody } from './register-collaborator.rules';

/**
 * Contrato HTTP del asistente: URL, parámetros y mapeo de respuestas.
 * Los paths de unidades, proveedores y roles son SUPUESTOS (aún no hay API-SPEC); estos tests los fijan
 * para que cambiarlos sea una decisión explícita y no un accidente.
 */
describe('RegisterCollaboratorApi', () => {
  let api: RegisterCollaboratorApi;
  let http: HttpTestingController;

  const summary = (over: object = {}) => ({
    id: 'p-1',
    code: 'c-1',
    first_names: 'Carlos',
    last_names: 'Mendoza',
    preferred_name: null,
    contact: { email_work: 'carlos@comsatel.com.pe' },
    role: 'Employee',
    unit_id: null,
    status: 'active',
    ...over,
  });
  const page = <T>(data: T[]) => ({ data, meta: { page: 1, limit: 20, total: data.length } });

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    api = TestBed.inject(RegisterCollaboratorApi);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('create: POST /api/v1/parties con el cuerpo tal cual', () => {
    const body: CreatePartyBody = {
      first_names: 'Carlos',
      last_names: 'Mendoza',
      identification_type: 'DNI',
      identification_number: '87654321',
      identification_country: 'PE',
      email_work: 'carlos@comsatel.com.pe',
      party_type: 'Employee',
    };
    let created: unknown;
    api.create(body).subscribe((p) => (created = p));
    const req = http.expectOne('/api/v1/parties');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({ id: 'new', code: 'g-1' });
    expect(created).toEqual({ id: 'new', code: 'g-1' });
  });

  describe('emailInUse', () => {
    const run = (email: string, rows: object[]) => {
      let result: boolean | undefined;
      api.emailInUse(email).subscribe((r) => (result = r));
      const req = http.expectOne((r) => r.url === '/api/v1/parties');
      req.flush(page(rows));
      return { result, params: req.request.params };
    };

    it('consulta la lista por el correo en minúsculas, con límite 5', () => {
      const { params } = run('  Carlos@Comsatel.com.pe ', []);
      expect(params.get('search')).toBe('carlos@comsatel.com.pe');
      expect(params.get('limit')).toBe('5');
    });

    it('true solo si algún registro coincide exactamente (sin distinguir mayúsculas)', () => {
      expect(run('carlos@comsatel.com.pe', [summary({ contact: { email_work: 'CARLOS@comsatel.com.pe' } })]).result).toBe(true);
    });

    it('false si solo hay coincidencias parciales', () => {
      expect(run('carlos@comsatel.com.pe', [summary({ contact: { email_work: 'carlos.perez@comsatel.com.pe' } })]).result).toBe(false);
    });

    it('false si la lista viene vacía o sin correo', () => {
      expect(run('a@b.co', []).result).toBe(false);
      expect(run('a@b.co', [summary({ contact: { email_work: null } })]).result).toBe(false);
    });
  });

  it('searchManagers: solo empleados vigentes, límite 8, y mapea nombre, detalle e insignia', () => {
    let out: unknown;
    api.searchManagers('mar').subscribe((o) => (out = o));
    const req = http.expectOne((r) => r.url === '/api/v1/parties');
    expect(req.request.params.get('search')).toBe('mar');
    expect(req.request.params.get('status')).toBe('active');
    expect(req.request.params.get('role')).toBe('Employee');
    expect(req.request.params.get('limit')).toBe('8');
    req.flush(page([summary({ id: 'm-1', preferred_name: 'Marina', contact: { email_work: null } })]));
    expect(out).toEqual([{ id: 'm-1', label: 'Marina', sublabel: 'Empleado', badge: 'Vigente' }]);
  });

  it('getParty: GET /api/v1/parties/{id} con el id codificado', () => {
    api.getParty('a/b').subscribe();
    const req = http.expectOne('/api/v1/parties/a%2Fb');
    expect(req.request.method).toBe('GET');
    req.flush(summary());
  });

  describe('organizaciones (API-SPEC-002)', () => {
    it('searchUnits: GET /organizations?type=internal_unit y mapea nombre y ubicaciÃ³n (o cÃ³digo)', () => {
      let out: unknown;
      api.searchUnits('ing').subscribe((o) => (out = o));
      const req = http.expectOne((r) => r.url === '/api/v1/organizations');
      expect(req.request.params.get('type')).toBe('internal_unit');
      expect(req.request.params.get('search')).toBe('ing');
      expect(req.request.params.get('limit')).toBe('10');
      req.flush(
        page([
          { id: 'u-1', name: 'IngenierÃ­a', location: 'Sede Central', code: 'ING' },
          { id: 'u-2', name: 'Operaciones', location: null, code: 'OP' },
          { id: 'u-3', name: 'Finanzas', location: null, code: null },
        ]),
      );
      expect(out).toEqual([
        { id: 'u-1', label: 'IngenierÃ­a', sublabel: 'Sede Central' },
        { id: 'u-2', label: 'Operaciones', sublabel: 'OP' },
        { id: 'u-3', label: 'Finanzas', sublabel: undefined },
      ]);
    });

    it('searchProviders: GET /organizations?type=external_provider y muestra el RUC', () => {
      let out: unknown;
      api.searchProviders('seg').subscribe((o) => (out = o));
      const req = http.expectOne((r) => r.url === '/api/v1/organizations');
      expect(req.request.params.get('type')).toBe('external_provider');
      expect(req.request.params.get('search')).toBe('seg');
      req.flush(page([{ id: 'v-1', name: 'Seguridad Sur', ruc: '20123456789' }]));
      expect(out).toEqual([{ id: 'v-1', label: 'Seguridad Sur', sublabel: 'RUC: 20123456789' }]);
    });

    it('un error del servicio de organizaciones se propaga (la UI lo trata como E2/E3)', () => {
      let failed = false;
      api.searchUnits('').subscribe({ error: () => (failed = true) });
      http.expectOne((r) => r.url === '/api/v1/organizations').flush('x', { status: 503, statusText: 'Unavailable' });
      expect(failed).toBe(true);
    });
  });

  describe('catÃ¡logo de roles (path supuesto)', () => {
    it('roles: GET /catalog/roles vigentes (límite 100) y cuenta los requisitos de evidencia por nivel', () => {
      let out: unknown;
      api.roles().subscribe((o) => (out = o));
      const req = http.expectOne((r) => r.url === '/api/v1/catalog/roles');
      expect(req.request.params.get('status')).toBe('active');
      expect(req.request.params.get('limit')).toBe('100');
      req.flush(
        page([
          {
            id: 'r-1',
            name: 'Developer',
            levels: [
              { id: 'l-1', name: 'Nivel 1', evidence_requirements: 3 },
              { id: 'l-2', label: 'Nivel 2', evidence_count: 2 },
              { id: 'l-3', name: 'Nivel 3' },
            ],
          },
          { id: 'r-2', name: 'QA' },
        ]),
      );
      expect(out).toEqual([
        {
          id: 'r-1',
          label: 'Developer',
          levels: [
            { id: 'l-1', label: 'Nivel 1', evidenceCount: 3 },
            { id: 'l-2', label: 'Nivel 2', evidenceCount: 2 },
            { id: 'l-3', label: 'Nivel 3', evidenceCount: 0 },
          ],
        },
        { id: 'r-2', label: 'QA', levels: [] },
      ]);
    });

    it('un 404/503 del catálogo se propaga como error (la UI lo trata como E2/E3/E4)', () => {
      let failed = false;
      api.roles().subscribe({ error: () => (failed = true) });
      http.expectOne((r) => r.url === '/api/v1/catalog/roles').flush('x', { status: 503, statusText: 'Unavailable' });
      expect(failed).toBe(true);
    });
  });
});
