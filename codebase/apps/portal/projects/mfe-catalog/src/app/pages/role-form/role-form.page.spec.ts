import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { APP_CONFIG, AppRole, SessionService } from '@gf/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RoleDetail } from '../../data-access/catalog.models';
import { RoleFormPage } from './role-form.page';

const COMPETENCIES = {
  data: [
    { id: 'c1', name: 'Git', description: null, status: 'ACTIVE', current_version: { id: 'v1', version_number: 1, status: 'APPROVED' }, row_version: 1 },
    { id: 'c2', name: 'Borrador', description: null, status: 'ACTIVE', current_version: null, row_version: 1 },
  ],
  pagination: {},
};

const ROLE: RoleDetail = {
  id: 'r1',
  name: 'Developer',
  description: null,
  status: 'ACTIVE',
  row_version: 3,
  created_at: '2026-10-04T00:00:00Z',
  created_by: 'jefe',
  updated_at: null,
  updated_by: null,
  levels: [
    {
      id: 'lv1',
      name: 'Junior',
      ordinal: 1,
      status: 'ACTIVE',
      usable: true,
      evidence_requirements: 1,
      competencies: [{ competency_id: 'c1', name: 'Git', required_level: 'L1', version: { id: 'v0', version_number: 1, status: 'DEPRECATED' }, is_current: false, suggested_version_id: 'v1' }],
    },
  ],
};

/** Prueba el formulario de rol renderizado: validación, cuerpo enviado, conflicto 412 y permisos. */
describe('RoleFormPage', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<RoleFormPage>;
  let roles: AppRole[];

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';
  const q = <T extends HTMLElement>(sel: string) => (fixture.nativeElement as HTMLElement).querySelector<T>(sel);
  const type = (sel: string, value: string) => {
    const el = q<HTMLInputElement>(sel)!;
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  };
  const choose = (sel: string, value: string) => {
    const el = q<HTMLSelectElement>(sel)!;
    el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
  };
  const click = (label: string) => {
    const b = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button')).find((x) => x.textContent?.trim() === label);
    expect(b, `botón «${label}»`).toBeTruthy();
    b!.click();
    fixture.detectChanges();
  };

  async function open(roleId: string | undefined, as: AppRole[]) {
    roles = as;
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
    fixture = TestBed.createComponent(RoleFormPage);
    if (roleId) fixture.componentRef.setInput('roleId', roleId);
    fixture.detectChanges();
    http.expectOne((r) => r.url === '/api/v1/catalog/competencies').flush(COMPETENCIES);
    if (roleId) http.expectOne(`/api/v1/catalog/roles/${roleId}`).flush(ROLE);
    fixture.detectChanges();
  }

  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => http.verify());

  it('guardar vacío no llama al servicio y lista qué corregir', async () => {
    await open(undefined, [AppRole.JefeIngenieria]);
    click('Guardar');
    expect(text()).toContain('Corrige estos puntos para guardar');
    expect(text()).toContain('Escribe el nombre del rol.');
    expect(text()).toContain('Cada nivel necesita al menos una competencia.');
    http.expectNone('/api/v1/catalog/roles');
  });

  it('crea un rol con el cuerpo que espera la API', async () => {
    await open(undefined, [AppRole.ProductOwner]);
    type('#rf-name', ' Developer ');
    type('#rf-l0-name', 'Junior');
    click('Agregar competencia');
    choose('#rf-l0-c0', 'c1');
    choose('#rf-l0-r0', 'L1');
    click('Guardar');
    const req = http.expectOne('/api/v1/catalog/roles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Developer',
      description: null,
      levels: [{ name: 'Junior', ordinal: 1, competencies: [{ competency_id: 'c1', version_id: 'v1', required_level: 'L1' }] }],
    });
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    req.flush({ ...ROLE, id: 'new' });
    expect(navigate).toHaveBeenCalledWith(['..', 'roles', 'new'], expect.anything());
  });

  it('una competencia sin versión aprobada no se puede elegir', async () => {
    await open(undefined, [AppRole.JefeIngenieria]);
    click('Agregar competencia');
    const opt = Array.from(q<HTMLSelectElement>('#rf-l0-c0')!.options).find((o) => o.text.includes('Borrador'));
    expect(opt?.disabled).toBe(true);
    expect(opt?.text).toContain('sin versión aprobada');
  });

  it('al editar muestra la advertencia de versión y «Usar la nueva» cambia la versión que se envía', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    expect(text()).toContain('Hay una versión nueva de esta competencia');
    click('Usar la nueva');
    expect(text()).not.toContain('Hay una versión nueva de esta competencia');
    click('Guardar');
    const req = http.expectOne('/api/v1/catalog/roles/r1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('If-Match')).toBe('"3"');
    expect(req.request.body.levels[0]).toMatchObject({ id: 'lv1', competencies: [{ competency_id: 'c1', version_id: 'v1', required_level: 'L1' }] });
    req.flush({ ...ROLE, row_version: 4 });
    fixture.detectChanges();
    expect(text()).toContain('Cambios guardados.');
  });

  it('un 412 explica el conflicto, ofrece recargar y conserva lo escrito', async () => {
    await open('r1', [AppRole.Admin]);
    type('#rf-name', 'Developer 2');
    click('Guardar');
    http.expectOne('/api/v1/catalog/roles/r1').flush({ error: { code: 'PRECONDITION_FAILED', message: 'x' } }, { status: 412, statusText: 'Precondition Failed' });
    fixture.detectChanges();
    expect(text()).toContain('Otra persona modificó este rol. Recarga para ver los cambios.');
    expect(q<HTMLInputElement>('#rf-name')!.value).toBe('Developer 2');
    click('Recargar');
    http.expectOne((r) => r.url === '/api/v1/catalog/competencies').flush(COMPETENCIES);
    http.expectOne('/api/v1/catalog/roles/r1').flush({ ...ROLE, name: 'Developer (otro)', row_version: 4 });
    fixture.detectChanges();
    expect(q<HTMLInputElement>('#rf-name')!.value).toBe('Developer (otro)');
  });

  it('desactivar un nivel pide confirmación y no elimina', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    click('Desactivar nivel');
    expect(text()).toContain('Quien ya lo tiene lo conserva');
    http.expectNone('/api/v1/catalog/roles/r1/levels/lv1/deactivate');
    click('Desactivar nivel'); // el botón de la confirmación
    const req = http.expectOne('/api/v1/catalog/roles/r1/levels/lv1/deactivate');
    expect(req.request.method).toBe('POST');
    req.flush({ ...ROLE, levels: [{ ...ROLE.levels[0], status: 'INACTIVE' }] });
    fixture.detectChanges();
    expect(text()).toContain('Inactivo');
  });

  it('el Responsable de producto edita roles pero no desactiva niveles', async () => {
    await open('r1', [AppRole.ProductOwner]);
    expect(text()).toContain('Guardar');
    expect(text()).not.toContain('Desactivar nivel');
  });

  it('sin permiso de edición es de solo lectura: sin guardar ni agregar', async () => {
    await open('r1', [AppRole.Colaborador]);
    expect(text()).toContain('Solo puedes consultar este rol');
    expect(text()).not.toContain('Guardar');
    expect(text()).not.toContain('Agregar nivel');
    expect(q<HTMLInputElement>('#rf-name')!.disabled).toBe(true);
  });

  it('un rol inexistente muestra el aviso y no el formulario', async () => {
    roles = [AppRole.JefeIngenieria];
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: APP_CONFIG, useValue: { apiBaseUrl: '/api/v1', authBaseUrl: '/auth' } },
        { provide: SessionService, useValue: { hasAnyRole: () => true } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RoleFormPage);
    fixture.componentRef.setInput('roleId', 'nope');
    fixture.detectChanges();
    http.expectOne((r) => r.url === '/api/v1/catalog/competencies').flush(COMPETENCIES);
    http.expectOne('/api/v1/catalog/roles/nope').flush({ error: { code: 'RESOURCE_NOT_FOUND' } }, { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();
    expect(text()).toContain('No encontramos este rol');
    expect(q('#rf-name')).toBeNull();
  });
});
