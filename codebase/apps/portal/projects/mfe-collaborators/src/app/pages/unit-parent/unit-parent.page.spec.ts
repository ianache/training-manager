import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { Page, SessionService } from '@gf/core';
import { GfAutocomplete } from '@gf/ui';
import { NEVER, Subject, firstValueFrom, of, throwError } from 'rxjs';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrganizationUnit, UnitRelationship } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UNITS_URL } from '../../shared/unit-nav';
import { installDialogPolyfill, uninstallDialogPolyfill } from '../../testing/dialog-polyfill';
import { UnitParentPage } from './unit-parent.page';

const unit = (over: Partial<OrganizationUnit> & Pick<OrganizationUnit, 'id' | 'name'>): OrganizationUnit => ({
  type: 'internal_unit', parent_id: null, status: 'active', from_date: '2024-01-15', thru_date: null,
  active_children_count: 0, current_people_count: 0, row_version: 1, ...over,
});
const ING = unit({ id: 'u-1', name: 'Ingeniería' });
const OPS = unit({ id: 'u-3', name: 'Operaciones de Formación' });
const DEV = unit({ id: 'u-2', name: 'Desarrollo', parent_id: 'u-1', row_version: 5 });
const SUB = unit({ id: 'u-4', name: 'Descendiente', parent_id: 'u-2' });
const page = <T>(data: T[]): Page<T> => ({ data, pagination: { page: 1, limit: 20, total: data.length, total_pages: 1, has_next: false, has_prev: false } });
const REL: UnitRelationship = { previous_parent: null, new_parent: { id: 'u-1', name: 'Ingeniería' }, from_date: '2024-02-01', thru_date: null, changed_by: 'ana' };
const apiError = (status: number, code: string, details?: Record<string, unknown>) =>
  new HttpErrorResponse({ status, error: { error: { code, message: 'm', status, timestamp: 't', details } } });

describe('UnitParentPage (SCR-029-03 cambiar unidad padre)', () => {
  let fixture: ComponentFixture<UnitParentPage>;
  let api: Record<'list' | 'get' | 'relationships' | 'changeParent', ReturnType<typeof vi.fn>>;
  let navigate: ReturnType<typeof vi.spyOn>;
  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';
  const alerts = () => Array.from(el().querySelectorAll('[role="alert"]')).map((n) => n.textContent!.trim());
  const dialog = () => el().querySelector('dialog')!;
  const button = (label: string) => Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.trim() === label)!;
  const autocomplete = () => fixture.debugElement.query(By.directive(GfAutocomplete)).componentInstance as GfAutocomplete;

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function open(opts: { allowed?: boolean } = {}) {
    api = {
      list: vi.fn((q: { ancestorId?: string; search?: string }) =>
        of(page(q.ancestorId ? [DEV, SUB] : [ING, OPS, DEV, SUB])),
      ),
      get: vi.fn((id: string) => of(id === 'u-1' ? ING : DEV)),
      relationships: vi.fn(() => of(page([REL]))),
      changeParent: vi.fn(() => of({ ...DEV, parent_id: 'u-3' })),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: OrganizationsService, useValue: api },
        { provide: SessionService, useValue: { hasAnyRole: () => opts.allowed ?? true } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ unitId: 'u-2' }) } } },
      ],
    });
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(UnitParentPage);
    document.body.appendChild(el());
    await settle();
  }
  async function setDate(value: string) {
    const i = el().querySelector<HTMLInputElement>('input[type="date"]')!;
    i.value = value;
    i.dispatchEvent(new Event('change'));
    await settle();
  }
  async function pick(opt = { id: 'u-3', label: 'Operaciones de Formación' }) {
    autocomplete().selected.emit(opt);
    await settle();
  }
  async function cont() {
    button('Continuar').click();
    await settle();
  }
  async function confirmFlow() {
    await pick();
    await setDate('2026-10-01');
    await cont();
  }
  async function confirm() {
    Array.from(dialog().querySelectorAll('button')).find((b) => b.textContent!.trim() === 'Confirmar')!.click();
    await settle();
  }

  beforeAll(installDialogPolyfill);
  afterAll(uninstallDialogPolyfill);
  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => el()?.remove());

  it('muestra el padre actual con «Vigente desde» (de la relación vigente) y enlaza al historial', async () => {
    await open();
    expect(el().querySelector('h1')!.textContent).toContain('Cambiar unidad padre');
    expect(api.get).toHaveBeenCalledWith('u-2');
    expect(text()).toContain('Ingeniería');
    expect(text()).toContain('Vigente desde 01/02/2024');
    const link = Array.from(el().querySelectorAll('a')).find((a) => a.textContent!.includes('historial'))!;
    expect(link.getAttribute('href')).toContain('/u-2/historial');
  });

  it('el selector ofrece solo unidades activas y excluye la propia unidad y sus descendientes', async () => {
    await open();
    expect(api.list).toHaveBeenCalledWith(expect.objectContaining({ ancestorId: 'u-2', status: 'all' }));
    const found = await firstValueFrom(autocomplete().searchFn()('o'));
    expect(api.list).toHaveBeenCalledWith(expect.objectContaining({ search: 'o', status: 'active' }));
    expect(found.map((o) => o.id)).toEqual(['u-1', 'u-3']);
  });

  it('«Continuar» sin datos muestra los errores por campo con role="alert" y no abre el resumen', async () => {
    await open();
    await cont();
    expect(alerts()).toEqual(expect.arrayContaining(['Indica la nueva unidad padre', 'Indica la fecha desde']));
    expect(dialog().open).toBe(false);
    expect(document.activeElement?.id).toBe('unit-parent');
  });

  it('con datos válidos abre el diálogo de resumen con solo «{unidad}: de X a Y»', async () => {
    await open();
    await confirmFlow();
    expect(dialog().open).toBe(true);
    expect(dialog().textContent).toContain('Desarrollo: de Ingeniería a Operaciones de Formación');
    expect(dialog().textContent).not.toContain('2026');
    expect(dialog().querySelector('h2')!.textContent).toContain('Confirmar');
    expect(api.changeParent).not.toHaveBeenCalled();
  });

  it('«Volver» cierra el resumen sin llamar al servicio y conserva lo ingresado', async () => {
    await open();
    await confirmFlow();
    Array.from(dialog().querySelectorAll('button')).find((b) => b.textContent!.trim() === 'Volver')!.click();
    await settle();
    expect(dialog().open).toBe(false);
    expect(api.changeParent).not.toHaveBeenCalled();
    expect(el().querySelector<HTMLInputElement>('input[type="date"]')!.value).toBe('2026-10-01');
  });

  it('«Confirmar» cambia el padre con la row_version cargada y vuelve al listado con la unidad resaltada', async () => {
    await open();
    await confirmFlow();
    await confirm();
    expect(api.changeParent).toHaveBeenCalledWith('u-2', { parent_id: 'u-3', from_date: '2026-10-01' }, 5);
    expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2', notice: 'Unidad padre actualizada' } });
  });

  it('mientras guarda no permite confirmar dos veces', async () => {
    await open();
    api.changeParent.mockReturnValue(new Subject());
    await confirmFlow();
    await confirm();
    await confirm();
    expect(api.changeParent).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['ORGANIZATION_CYCLE', 'Crearía un ciclo en la jerarquía'],
    ['PARENT_INACTIVE', 'Solo se pueden elegir unidades activas'],
    ['ORGANIZATION_DUPLICATE', 'Ya existe una unidad con este nombre bajo Operaciones de Formación'],
  ])('409 %s se muestra en el campo Unidad padre y cierra el resumen', async (code, message) => {
    await open();
    api.changeParent.mockReturnValue(throwError(() => apiError(409, code)));
    await confirmFlow();
    await confirm();
    expect(dialog().open).toBe(false);
    expect(alerts()).toContain(message);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('un error de validación de from_date del servidor se muestra en el campo Fecha desde', async () => {
    await open();
    api.changeParent.mockReturnValue(throwError(() => apiError(400, 'VALIDATION_ERROR', { fields: [{ field: 'from_date', message: 'La fecha desde no puede ser futura.' }] })));
    await confirmFlow();
    await confirm();
    expect(alerts()).toContain('La fecha desde no puede ser futura.');
  });

  it('412 y ORGANIZATION_INACTIVE se avisan en una alerta sin perder lo ingresado', async () => {
    await open();
    api.changeParent.mockReturnValue(throwError(() => apiError(412, 'PRECONDITION_FAILED')));
    await confirmFlow();
    await confirm();
    expect(alerts().some((a) => a.includes('La unidad cambió'))).toBe(true);
    expect(el().querySelector<HTMLInputElement>('input[type="date"]')!.value).toBe('2026-10-01');
    api.changeParent.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_INACTIVE')));
    await cont();
    await confirm();
    expect(alerts().some((a) => a.includes('inactiva'))).toBe(true);
  });

  it('error inesperado: alerta con «Reintentar» que repite el cambio', async () => {
    await open();
    api.changeParent.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    await confirmFlow();
    await confirm();
    expect(alerts().some((a) => a.includes('No se pudo cambiar la unidad padre. Intente de nuevo.'))).toBe(true);
    api.changeParent.mockReturnValue(of(DEV));
    button('Reintentar').click();
    await settle();
    expect(api.changeParent).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalled();
  });

  it('sin permiso (rol) no muestra el formulario y ofrece volver a unidades', async () => {
    await open({ allowed: false });
    expect(text()).toContain('No tiene permiso para cambiar la unidad padre');
    expect(el().querySelector('input[type="date"]')).toBeNull();
    expect(text()).toContain('Volver a unidades');
  });

  it('403 al guardar pasa al estado sin permiso', async () => {
    await open();
    api.changeParent.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
    await confirmFlow();
    await confirm();
    expect(text()).toContain('No tiene permiso para cambiar la unidad padre');
  });

  it('un error al cargar muestra «Reintentar» y mientras carga «Cargando»', async () => {
    await open();
    api.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    fixture = TestBed.createComponent(UnitParentPage);
    document.body.appendChild(el());
    await settle();
    expect(text()).toContain('Reintentar');
    api.get.mockReturnValue(NEVER);
    fixture = TestBed.createComponent(UnitParentPage);
    document.body.appendChild(el());
    await settle();
    expect(text()).toContain('Cargando');
  });

  it('una unidad sin padre muestra «Sin unidad padre» y el resumen dice «de Sin unidad padre»', async () => {
    await open();
    api.get.mockReturnValue(of({ ...DEV, parent_id: null }));
    api.relationships.mockReturnValue(of(page<UnitRelationship>([])));
    fixture = TestBed.createComponent(UnitParentPage);
    document.body.appendChild(el());
    await settle();
    expect(text()).toContain('Sin unidad padre');
    await confirmFlow();
    expect(dialog().textContent).toContain('Desarrollo: de Sin unidad padre a Operaciones de Formación');
  });
});
