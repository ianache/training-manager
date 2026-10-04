import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { APP_CONFIG, AppRole, SessionService } from '@gf/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RoleDetail } from '../../data-access/catalog.models';
import { RoleFormPage } from './role-form.page';

const v = (id: string, n: number) => ({ id, version_number: n, status: 'APPROVED' as const });
const COMPETENCIES = {
  data: [
    { id: 'c1', name: 'Git', description: null, status: 'ACTIVE', current_version: v('v2', 2), levels_with_requirements: 3, row_version: 1 },
    { id: 'c2', name: 'Borrador', description: null, status: 'ACTIVE', current_version: null, levels_with_requirements: 0, row_version: 1 },
    { id: 'c3', name: 'Docker', description: null, status: 'ACTIVE', current_version: v('v3', 1), levels_with_requirements: 2, row_version: 1 },
  ],
  pagination: {},
};

const ROLE: RoleDetail = {
  id: 'r1',
  name: 'Developer',
  description: null,
  status: 'ACTIVE',
  row_version: 3,
  created_at: '2026-10-01T00:00:00Z',
  created_by: 'ana',
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
      competencies: [{ competency_id: 'c1', name: 'Git', required_level: 'L1', version: { id: 'v1', version_number: 1, status: 'DEPRECATED' }, is_current: false, suggested_version_id: 'v2' }],
    },
  ],
};
/** El mismo rol con su competencia en la versión vigente. */
const CURRENT: RoleDetail = {
  ...ROLE,
  levels: [{ ...ROLE.levels[0], competencies: [{ ...ROLE.levels[0].competencies[0], version: v('v2', 2), is_current: true, suggested_version_id: null }] }],
};

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms)); // el combobox consulta con debounce de 300 ms

/** SCR-001-02 (diseño Stitch GEN-001-G): estados predeterminado, errores, versión nueva, guardando, guardado, conflicto y solo lectura. */
describe('RoleFormPage (SCR-001-02)', () => {
  let http: HttpTestingController;
  let fixture: ComponentFixture<RoleFormPage>;
  let roles: AppRole[];

  const host = () => fixture.nativeElement as HTMLElement;
  /** Texto visible con un espacio entre elementos (textContent los pega; el diseño los separa con estilos). */
  const spaced = (el: Element) => el.innerHTML.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const text = () => spaced(host());
  const q = <T extends HTMLElement>(sel: string) => host().querySelector<T>(sel);
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
  const button = (label: string) => Array.from(host().querySelectorAll('button')).find((x) => x.textContent?.replace(/\s+/g, ' ').trim() === label);
  const click = (label: string) => {
    const b = button(label);
    expect(b, `botón «${label}»`).toBeTruthy();
    b!.click();
    fixture.detectChanges();
  };
  /** Elige una competencia en el combobox de un nivel y pulsa «Asignar». */
  async function assignCompetency(level: number, name: string) {
    const input = q<HTMLInputElement>(`#rf-l${level}-ac`)!;
    input.dispatchEvent(new Event('focus'));
    await wait();
    fixture.detectChanges();
    const option = Array.from(host().querySelectorAll<HTMLElement>('[role="option"]')).find((o) => o.textContent?.includes(name));
    expect(option, `opción «${name}»`).toBeTruthy();
    option!.click();
    fixture.detectChanges();
    click('Asignar');
  }

  async function open(roleId: string | undefined, as: AppRole[], role: RoleDetail = ROLE) {
    roles = as;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', children: [] }]),
        { provide: APP_CONFIG, useValue: { apiBaseUrl: '/api/v1', authBaseUrl: '/auth' } },
        { provide: SessionService, useValue: { hasAnyRole: (r: readonly AppRole[]) => r.some((x) => roles.includes(x)), roles: () => roles } },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RoleFormPage);
    if (roleId) fixture.componentRef.setInput('roleId', roleId);
    fixture.detectChanges();
    http.expectOne((r) => r.url === '/api/v1/catalog/competencies').flush(COMPETENCIES);
    if (roleId) http.expectOne(`/api/v1/catalog/roles/${roleId}`).flush(role);
    fixture.detectChanges();
  }

  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => http.verify());

  // ---------------------------------------------------------------- Estado A

  it('encabezado: migas de pan, título «Editar rol: …» y subtítulo del diseño', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    const crumbs = q('nav[aria-label="Migas de pan"]')!;
    expect(spaced(crumbs)).toBe('Catálogo de roles Developer Editar rol');
    expect(q('h1')?.textContent).toBe('Editar rol: Developer');
    expect(text()).toContain('Asignación estructurada de competencias y requerimientos de nivel por cada etapa del perfil.');
  });

  it('sección «Niveles y competencias asignadas» con «Agregar nivel» y la tarjeta del nivel', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    expect(text()).toContain('Niveles y competencias asignadas');
    expect(text()).toContain('Establezca los requerimientos de competencia por cada nivel de seniority.');
    expect(button('Agregar nivel')).toBeTruthy();
    expect(q('.level h3')?.textContent).toBe('Junior');
    expect(text()).toContain('1 competencia');
    expect(text()).toContain('Nivel esperado:');
    expect(q('#rf-l0-ac')?.getAttribute('placeholder')).toBe('Agregar competencia...');
    expect(button('Asignar')).toBeTruthy();
  });

  it('barra inferior: «Desactivar rol» a la izquierda; «Cancelar» y «Guardar» a la derecha', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    const bar = q('.bar')!;
    expect(Array.from(bar.querySelectorAll('button')).map((b) => b.textContent?.replace(/\s+/g, ' ').trim())).toEqual(['Desactivar rol', 'Cancelar', 'Guardar']);
  });

  it('un nivel guardado se desactiva, no se elimina (EVD-2026-0174): no hay «Eliminar nivel»', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    expect(button('Desactivar nivel')).toBeTruthy();
    expect(text()).not.toContain('Eliminar nivel');
  });

  // ---------------------------------------------------------------- combobox y alta

  it('el combobox ofrece solo competencias con versión aprobada', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    q<HTMLInputElement>('#rf-l0-ac')!.dispatchEvent(new Event('focus'));
    await wait();
    fixture.detectChanges();
    const labels = Array.from(host().querySelectorAll('[role="option"]')).map((o) => spaced(o));
    expect(labels).toEqual(['Git v2', 'Docker v1']);
  });

  it('crear: asignar una competencia deja el nivel esperado por elegir y lo exige al guardar', async () => {
    await open(undefined, [AppRole.ProductOwner]);
    expect(q('h1')?.textContent).toBe('Crear rol');
    type('#rf-name', ' Developer ');
    type('#rf-l0-name', 'Junior');
    await assignCompetency(0, 'Git');
    expect(text()).toContain('Git');
    expect(text()).toContain('v2');
    click('Guardar');
    expect(text()).toContain('Elige el nivel esperado de la competencia');
    expect(text()).toContain('1 incidencia');
    http.expectNone('/api/v1/catalog/roles');
    choose('#rf-l0-r0', 'L1');
    click('Guardar');
    const req = http.expectOne('/api/v1/catalog/roles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Developer',
      description: null,
      levels: [{ name: 'Junior', ordinal: 1, competencies: [{ competency_id: 'c1', version_id: 'v2', required_level: 'L1' }] }],
    });
    req.flush({ ...CURRENT, id: 'nuevo' });
  });

  // ---------------------------------------------------------------- Estado B

  it('guardar vacío no llama al servicio: error del nombre, incidencias y el nivel vacío con su acción', async () => {
    await open(undefined, [AppRole.JefeIngenieria]);
    click('Guardar');
    expect(text()).toContain('Escribe el nombre del rol.');
    expect(text()).toContain('2 incidencias');
    const empty = q('.empty-level')!;
    expect(empty.getAttribute('role')).toBe('alert');
    expect(empty.textContent).toContain('Este nivel no tiene ninguna competencia asignada. Agrega al menos una competencia.');
    expect(empty.textContent).toContain('se encuentra actualmente vacío.');
    expect(empty.textContent).toContain('Asignar primera competencia');
    http.expectNone('/api/v1/catalog/roles');
  });

  it('el nombre repetido (409) se muestra junto al campo y lo marca inválido', async () => {
    await open('r1', [AppRole.JefeIngenieria], CURRENT);
    type('#rf-name', 'Analista QA');
    click('Guardar');
    http.expectOne('/api/v1/catalog/roles/r1').flush({ error: { code: 'ROLE_NAME_DUPLICATE', message: 'x' } }, { status: 409, statusText: 'Conflict' });
    fixture.detectChanges();
    expect(q('#rf-name-msg')?.textContent).toContain('Ya existe un rol con ese nombre');
    expect(q('#rf-name')?.getAttribute('aria-invalid')).toBe('true');
    expect(q('.banner--danger')).toBeNull();
  });

  it('422: «Acción bloqueada: Primero define cómo se evidencia el nivel L1 de Git» con su detalle', async () => {
    await open('r1', [AppRole.JefeIngenieria], CURRENT);
    click('Guardar');
    http.expectOne('/api/v1/catalog/roles/r1').flush(
      { error: { code: 'EVIDENCE_REQUIREMENTS_MISSING', message: 'x', details: { competency_id: 'c1', required_level: 'L1' } } },
      { status: 422, statusText: 'Unprocessable' },
    );
    fixture.detectChanges();
    const banner = q('.banner--danger')!;
    expect(banner.getAttribute('role')).toBe('alert');
    expect(banner.textContent).toContain('Acción bloqueada: Primero define cómo se evidencia el nivel L1 de Git');
    expect(banner.textContent).toContain('Existen discrepancias en la matriz de descriptores requeridos antes de confirmar los cambios.');
  });

  // ---------------------------------------------------------------- Estado C

  it('versión desactualizada: «(asignada v1)», aviso con la versión nueva y «Usar la nueva» cambia lo que se envía', async () => {
    await open('r1', [AppRole.JefeIngenieria]);
    expect(text()).toContain('(asignada v1)');
    expect(text()).toContain('Hay una versión nueva (v2) de esta competencia');
    click('Usar la nueva');
    expect(text()).not.toContain('Hay una versión nueva');
    expect(text()).toContain('v2');
    click('Guardar');
    const req = http.expectOne('/api/v1/catalog/roles/r1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('If-Match')).toBe('"3"');
    expect(req.request.body.levels[0]).toMatchObject({ id: 'lv1', competencies: [{ competency_id: 'c1', version_id: 'v2', required_level: 'L1' }] });
    req.flush(CURRENT);
  });

  // ---------------------------------------------------------------- Estado D

  it('guardando: campos bloqueados, «Cancelar» deshabilitado y «Guardando...»; luego la confirmación con el resumen', async () => {
    await open('r1', [AppRole.JefeIngenieria], CURRENT);
    click('Guardar');
    expect(button('Guardando...')).toBeTruthy();
    expect(q<HTMLInputElement>('#rf-name')!.disabled).toBe(true);
    expect(button('Cancelar')?.disabled).toBe(true);
    http.expectOne('/api/v1/catalog/roles/r1').flush({ ...CURRENT, row_version: 4, updated_by: 'jefe.ingenieria', updated_at: new Date().toISOString() });
    fixture.detectChanges();
    expect(text()).toContain('El rol se actualizó correctamente.');
    expect(text()).toContain('Los niveles y asignaciones de competencias fueron guardados en el catálogo vigente.');
    expect(text()).toContain('Rol del catálogo');
    expect(text()).toContain('Estado: Activo');
    expect(text()).toContain('Niveles activos 1 nivel');
    expect(text()).toContain('Competencias asignadas 1 asignación total');
    expect(text()).toContain('Última modificación Hoy, por jefe.ingenieria');
    expect(q('form')).toBeNull();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    click('Volver al catálogo');
    expect(navigate).toHaveBeenCalledWith(['..'], expect.anything());
  });

  // ---------------------------------------------------------------- Estado E

  it('conflicto (412): aviso del diseño, campos y «Guardar» bloqueados, «Recargar» vuelve a leer el rol', async () => {
    await open('r1', [AppRole.Admin], CURRENT);
    type('#rf-name', 'Developer 2');
    click('Guardar');
    http.expectOne('/api/v1/catalog/roles/r1').flush({ error: { code: 'PRECONDITION_FAILED', message: 'x' } }, { status: 412, statusText: 'Precondition Failed' });
    fixture.detectChanges();
    const banner = q('.banner--warn')!;
    expect(banner.getAttribute('role')).toBe('alert');
    expect(banner.textContent).toContain('Conflicto de edición: Otra persona modificó este rol.');
    expect(banner.textContent).toContain('Recarga para ver los cambios recientes antes de continuar con la edición.');
    expect(text()).toContain('Bloqueado temporalmente');
    expect(q<HTMLInputElement>('#rf-name')!.disabled).toBe(true);
    expect(button('Guardar')?.disabled).toBe(true);
    expect(button('Cancelar')?.disabled).toBe(false);
    click('Recargar');
    http.expectOne((r) => r.url === '/api/v1/catalog/competencies').flush(COMPETENCIES);
    http.expectOne('/api/v1/catalog/roles/r1').flush({ ...CURRENT, name: 'Developer (otro)', row_version: 4 });
    fixture.detectChanges();
    expect(q<HTMLInputElement>('#rf-name')!.value).toBe('Developer (otro)');
    expect(q('.banner--warn')).toBeNull();
  });

  // ---------------------------------------------------------------- Estado F y permisos

  it('solo lectura: perfil activo, «Modo solo lectura», nombre como texto, niveles con su L y un solo «Volver»', async () => {
    await open('r1', [AppRole.Colaborador], CURRENT);
    expect(text()).toContain('Perfil activo: Colaborador');
    expect(text()).toContain('Modo solo lectura');
    expect(q('#rf-name')).toBeNull();
    expect(q('.static-field__value')?.textContent).toBe('Developer');
    expect(q('.row--static')?.textContent?.replace(/\s+/g, ' ')).toContain('Git');
    expect(q('.lvl-badge')?.textContent).toBe('L1');
    expect(text()).toContain('1 competencia');
    expect(Array.from(host().querySelectorAll('button')).map((b) => b.textContent?.trim())).toEqual(['Volver']);
  });

  it('el Responsable de producto edita roles pero no desactiva niveles', async () => {
    await open('r1', [AppRole.ProductOwner]);
    expect(button('Guardar')).toBeTruthy();
    expect(button('Desactivar nivel')).toBeUndefined();
  });

  it('desactivar un nivel pide confirmación y no elimina', async () => {
    await open('r1', [AppRole.JefeIngenieria], CURRENT);
    click('Desactivar nivel');
    expect(text()).toContain('Quien ya lo tiene lo conserva');
    http.expectNone('/api/v1/catalog/roles/r1/levels/lv1/deactivate');
    click('Desactivar nivel'); // el botón de la confirmación
    const req = http.expectOne('/api/v1/catalog/roles/r1/levels/lv1/deactivate');
    expect(req.request.method).toBe('POST');
    req.flush({ ...CURRENT, levels: [{ ...CURRENT.levels[0], status: 'INACTIVE' }] });
    fixture.detectChanges();
    expect(text()).toContain('Inactivo');
    expect(button('Reactivar nivel')).toBeTruthy();
  });

  it('un nivel nuevo se agrega y se quita con «Quitar nivel»; solo uno guardado se desactiva', async () => {
    await open('r1', [AppRole.JefeIngenieria], CURRENT);
    click('Agregar nivel');
    expect(host().querySelectorAll('.level').length).toBe(2);
    expect(q('.level:nth-of-type(2) h3')?.textContent).toContain('Nivel 2 (sin nombre)');
    click('Quitar nivel');
    expect(host().querySelectorAll('.level').length).toBe(1);
  });

  it('un rol inexistente muestra el aviso y no el formulario', async () => {
    roles = [AppRole.JefeIngenieria];
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', children: [] }]),
        { provide: APP_CONFIG, useValue: { apiBaseUrl: '/api/v1', authBaseUrl: '/auth' } },
        { provide: SessionService, useValue: { hasAnyRole: () => true, roles: () => roles } },
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
