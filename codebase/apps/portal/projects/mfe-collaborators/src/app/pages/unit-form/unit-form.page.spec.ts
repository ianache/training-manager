import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { Page, SessionService } from '@gf/core';
import { GfAutocomplete } from '@gf/ui';
import { NEVER, Subject, of, throwError } from 'rxjs';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrganizationUnit } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UNITS_URL } from '../../shared/unit-nav';
import { installDialogPolyfill, uninstallDialogPolyfill } from '../../testing/dialog-polyfill';
import { UnitFormPage } from './unit-form.page';

const unit = (over: Partial<OrganizationUnit> & Pick<OrganizationUnit, 'id' | 'name'>): OrganizationUnit => ({
  type: 'internal_unit', parent_id: null, status: 'active', from_date: '2024-01-15', thru_date: null,
  active_children_count: 0, current_people_count: 0, row_version: 1, ...over,
});
const ROOT = unit({ id: 'u-1', name: 'Ingeniería' });
const EDIT = unit({ id: 'u-2', name: 'Desarrollo', parent_id: 'u-1', row_version: 5 });
const page = (data: OrganizationUnit[]): Page<OrganizationUnit> => ({ data, pagination: { page: 1, limit: 20, total: data.length, total_pages: 1, has_next: false, has_prev: false } });
const apiError = (status: number, code: string, details?: Record<string, unknown>) =>
  new HttpErrorResponse({ status, error: { error: { code, message: 'm', status, timestamp: 't', details } } });

describe('UnitFormPage (SCR-029-01 registrar, SCR-029-02 editar nombre)', () => {
  let fixture: ComponentFixture<UnitFormPage>;
  let api: { list: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn>; rename: ReturnType<typeof vi.fn> };
  let navigate: ReturnType<typeof vi.spyOn>;
  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';
  const alerts = () => Array.from(el().querySelectorAll('[role="alert"]')).map((n) => n.textContent!.trim());
  const input = (id: string) => el().querySelector<HTMLInputElement>(`#${id}`)!;
  const button = (label: string) => Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.trim() === label)!;
  const autocomplete = () => fixture.debugElement.query(By.directive(GfAutocomplete)).componentInstance as GfAutocomplete;

  async function open(opts: { unitId?: string; allowed?: boolean; existing?: OrganizationUnit[] } = {}) {
    api = {
      list: vi.fn((q: { limit?: number }) => of(page(q.limit === 1 ? (opts.existing ?? [ROOT]) : [ROOT]))),
      get: vi.fn((id: string) => of(id === 'u-1' ? ROOT : EDIT)),
      create: vi.fn(() => of(unit({ id: 'u-9', name: 'Calidad' }))),
      rename: vi.fn(() => of({ ...EDIT, name: 'Nuevo' })),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: OrganizationsService, useValue: api },
        { provide: SessionService, useValue: { hasAnyRole: () => opts.allowed ?? true } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap(opts.unitId ? { unitId: opts.unitId } : {}) } } },
      ],
    });
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(UnitFormPage);
    document.body.appendChild(el());
    await settle();
  }
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function type(id: string, value: string) {
    const i = input(id);
    i.value = value;
    i.dispatchEvent(new Event('input'));
    await settle();
  }
  async function pickParent(opt = { id: 'u-1', label: 'Ingeniería' }) {
    autocomplete().selected.emit(opt);
    await settle();
  }
  async function fillValid() {
    await type('unit-name', '  Calidad ');
    await type('unit-email', 'calidad@comsatel.com.pe');
    await pickParent();
  }
  async function submit() {
    button('Registrar').click();
    await settle();
  }

  beforeAll(installDialogPolyfill);
  afterAll(uninstallDialogPolyfill);
  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => el()?.remove());

  describe('registrar (SCR-029-01)', () => {
    it('muestra título, migas y los campos Nombre, Correo laboral y Unidad padre, obligatorios; sin Fecha desde ni code/location', async () => {
      await open();
      expect(el().querySelector('h1')!.textContent).toContain('Registrar unidad');
      expect(el().querySelector('nav[aria-label="Migas de pan"]')!.textContent).toContain('Unidades organizacionales');
      for (const label of ['Nombre', 'Correo laboral', 'Unidad padre']) {
        const l = Array.from(el().querySelectorAll('label')).find((n) => n.textContent!.includes(label));
        expect(l, label).toBeTruthy();
        expect(document.getElementById(l!.getAttribute('for')!), label).toBeTruthy();
      }
      expect(text()).not.toContain('Fecha desde');
      expect(text().toLowerCase()).not.toContain('código');
      expect(text().toLowerCase()).not.toContain('ubicación');
      expect(text()).not.toContain('Eliminar');
    });

    it('enviar vacío muestra errores con role="alert" por campo, no llama al servicio y lleva el foco al primer campo con error', async () => {
      await open();
      await submit();
      expect(api.create).not.toHaveBeenCalled();
      expect(alerts()).toEqual(expect.arrayContaining(['Indica el nombre de la unidad', 'El correo laboral es obligatorio', 'Indica la unidad padre']));
      expect(document.activeElement).toBe(input('unit-name'));
      expect(input('unit-name').getAttribute('aria-invalid')).toBe('true');
    });

    it('rechaza un correo con formato inválido', async () => {
      await open();
      await type('unit-name', 'Calidad');
      await type('unit-email', 'no-es-correo');
      await pickParent();
      await submit();
      expect(api.create).not.toHaveBeenCalled();
      expect(alerts()).toContain('Ingrese un correo válido');
    });

    it('registra con nombre, correo laboral y padre, y vuelve al listado con la unidad resaltada y confirmación', async () => {
      await open();
      await fillValid();
      await submit();
      expect(api.create).toHaveBeenCalledWith({ name: 'Calidad', emailWork: 'calidad@comsatel.com.pe', parentId: 'u-1' });
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-9', notice: 'Unidad registrada' } });
    });

    it('mientras guarda no permite un segundo envío', async () => {
      await open();
      const pending = new Subject<OrganizationUnit>();
      api.create.mockReturnValue(pending);
      await fillValid();
      await submit();
      button('Registrar').click();
      await settle();
      expect(api.create).toHaveBeenCalledTimes(1);
      expect(button('Registrar').disabled || button('Registrar').getAttribute('aria-busy') === 'true').toBe(true);
    });

    it('el selector de padre busca solo unidades activas', async () => {
      await open();
      autocomplete().searchFn()('Ing').subscribe();
      expect(api.list).toHaveBeenCalledWith(expect.objectContaining({ search: 'Ing', status: 'active' }));
    });

    it('ORGANIZATION_DUPLICATE: error en el campo Nombre con el padre elegido y conserva lo escrito', async () => {
      await open();
      api.create.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_DUPLICATE', { field: 'name' })));
      await fillValid();
      await submit();
      expect(alerts()).toContain('Ya existe una unidad con este nombre bajo Ingeniería');
      expect(input('unit-name').getAttribute('aria-invalid')).toBe('true');
      expect(input('unit-name').value).toBe('  Calidad ');
      expect(input('unit-email').value).toBe('calidad@comsatel.com.pe');
    });

    it('PARENT_INACTIVE y ORGANIZATION_CYCLE (respaldo del servidor) se muestran en el campo Unidad padre', async () => {
      await open();
      api.create.mockReturnValue(throwError(() => apiError(409, 'PARENT_INACTIVE', { parent_id: 'u-1', parent_name: 'Ingeniería' })));
      await fillValid();
      await submit();
      expect(alerts()).toContain('Solo se pueden elegir unidades activas');
      api.create.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_CYCLE')));
      await submit();
      expect(alerts()).toContain('Crearía un ciclo en la jerarquía');
    });

    it('un error del servidor en el correo (VALIDATION_ERROR contact.email_work) se asocia al campo de correo', async () => {
      await open();
      api.create.mockReturnValue(throwError(() => apiError(400, 'VALIDATION_ERROR', { fields: [{ field: 'contact.email_work', message: 'x' }] })));
      await fillValid();
      await submit();
      expect(alerts()).toContain('Ingrese un correo válido');
      expect(input('unit-email').getAttribute('aria-invalid')).toBe('true');
    });

    it('error al guardar: alerta «No se pudo registrar la unidad. Intente de nuevo.» con «Reintentar» sin perder los datos', async () => {
      await open();
      api.create.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      await fillValid();
      await submit();
      expect(alerts().some((a) => a.includes('No se pudo registrar la unidad. Intente de nuevo.'))).toBe(true);
      expect(input('unit-name').value).toBe('  Calidad ');
      api.create.mockReturnValue(of(unit({ id: 'u-9', name: 'Calidad' })));
      button('Reintentar').click();
      await settle();
      expect(api.create).toHaveBeenCalledTimes(2);
      expect(navigate).toHaveBeenCalled();
    });

    it('sin permiso (rol) no muestra el formulario: «No tiene permiso para registrar unidades» y «Volver a unidades»', async () => {
      await open({ allowed: false });
      expect(text()).toContain('No tiene permiso para registrar unidades');
      expect(el().querySelector('form')).toBeNull();
      expect(text()).toContain('Volver a unidades');
    });

    it('403 del servidor al guardar pasa al estado sin permiso', async () => {
      await open();
      api.create.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
      await fillValid();
      await submit();
      expect(text()).toContain('No tiene permiso para registrar unidades');
    });

    it('si todavía no hay unidades, el padre no es obligatorio (unidad superior) y se envía parentId null', async () => {
      await open({ existing: [] });
      await type('unit-name', 'Raíz');
      await type('unit-email', 'raiz@comsatel.com.pe');
      await submit();
      expect(api.create).toHaveBeenCalledWith({ name: 'Raíz', emailWork: 'raiz@comsatel.com.pe', parentId: null });
    });

    it('Cancelar sin cambios vuelve al listado sin preguntar', async () => {
      await open();
      button('Cancelar').click();
      await settle();
      expect(navigate).toHaveBeenCalledWith([UNITS_URL]);
    });

    it('Cancelar con datos sin guardar pide confirmación en un diálogo; «Seguir editando» no navega y «Descartar» vuelve', async () => {
      await open();
      await type('unit-name', 'Algo');
      button('Cancelar').click();
      await settle();
      const dlg = el().querySelector('dialog')!;
      expect(dlg.open).toBe(true);
      expect(dlg.textContent).toContain('¿Descartar los cambios?');
      Array.from(dlg.querySelectorAll('button')).find((b) => b.textContent!.trim() === 'Seguir editando')!.click();
      await settle();
      expect(navigate).not.toHaveBeenCalled();
      button('Cancelar').click();
      await settle();
      Array.from(el().querySelectorAll<HTMLButtonElement>('dialog button')).find((b) => b.textContent!.trim() === 'Descartar')!.click();
      await settle();
      expect(navigate).toHaveBeenCalledWith([UNITS_URL]);
    });
  });

  describe('editar nombre (SCR-029-02)', () => {
    it('carga la unidad: título, nombre precargado, padre actual solo lectura, sin correo ni padre editables', async () => {
      await open({ unitId: 'u-2' });
      expect(api.get).toHaveBeenCalledWith('u-2');
      expect(el().querySelector('h1')!.textContent).toContain('Editar nombre de la unidad');
      expect(input('unit-name').value).toBe('Desarrollo');
      expect(text()).toContain('Ingeniería');
      expect(el().querySelector('#unit-email')).toBeNull();
      expect(el().querySelector('gf-autocomplete')).toBeNull();
    });

    it('«Guardar» está deshabilitado sin cambios o con el nombre vacío', async () => {
      await open({ unitId: 'u-2' });
      expect(button('Guardar').disabled).toBe(true);
      await type('unit-name', 'Desarrollo 2');
      expect(button('Guardar').disabled).toBe(false);
      await type('unit-name', '   ');
      expect(button('Guardar').disabled).toBe(true);
    });

    it('guarda con la row_version cargada y vuelve al listado resaltando la unidad', async () => {
      await open({ unitId: 'u-2' });
      await type('unit-name', 'Nuevo');
      button('Guardar').click();
      await settle();
      expect(api.rename).toHaveBeenCalledWith('u-2', 'Nuevo', 5);
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2', notice: 'Nombre actualizado' } });
    });

    it('nombre duplicado: error en el campo con el padre actual, conserva lo escrito', async () => {
      await open({ unitId: 'u-2' });
      api.rename.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_DUPLICATE')));
      await type('unit-name', 'Soporte');
      button('Guardar').click();
      await settle();
      expect(alerts()).toContain('Ya existe una unidad con este nombre bajo Ingeniería');
      expect(input('unit-name').value).toBe('Soporte');
    });

    it('412: avisa que la unidad cambió y no pierde el nombre; ORGANIZATION_INACTIVE: avisa que está inactiva', async () => {
      await open({ unitId: 'u-2' });
      api.rename.mockReturnValue(throwError(() => apiError(412, 'PRECONDITION_FAILED')));
      await type('unit-name', 'Otro');
      button('Guardar').click();
      await settle();
      expect(alerts().some((a) => a.includes('La unidad cambió'))).toBe(true);
      expect(input('unit-name').value).toBe('Otro');
      api.rename.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_INACTIVE')));
      button('Guardar').click();
      await settle();
      expect(alerts().some((a) => a.includes('inactiva'))).toBe(true);
    });

    it('si no se puede cargar la unidad muestra un error con «Reintentar»', async () => {
      await open({ unitId: 'u-2' });
      api.get.mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 500 })));
      fixture = TestBed.createComponent(UnitFormPage);
      document.body.appendChild(el());
      await settle();
      expect(text()).toContain('Reintentar');
    });

    it('mientras carga muestra «Cargando» y no el formulario', async () => {
      await open({ unitId: 'u-2' });
      api.get.mockReturnValue(NEVER);
      fixture = TestBed.createComponent(UnitFormPage);
      document.body.appendChild(el());
      await settle();
      expect(text()).toContain('Cargando');
      expect(el().querySelector('#unit-name')).toBeNull();
    });
  });
});
