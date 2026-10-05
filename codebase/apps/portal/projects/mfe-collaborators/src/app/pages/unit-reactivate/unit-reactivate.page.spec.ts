import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { SessionService } from '@gf/core';
import { NEVER, Subject, of, throwError } from 'rxjs';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrganizationUnit } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { UNITS_URL } from '../../shared/unit-nav';
import { installDialogPolyfill, uninstallDialogPolyfill } from '../../testing/dialog-polyfill';
import { UnitReactivatePage } from './unit-reactivate.page';

const PARENT = { id: 'u-1', name: 'Ingeniería', type: 'internal_unit', parent_id: null, status: 'active', from_date: '2020-01-01', thru_date: null, row_version: 1 } as OrganizationUnit;
const INACTIVE = {
  id: 'u-2', name: 'Ventas Regionales', type: 'internal_unit', parent_id: 'u-1', status: 'inactive',
  from_date: '2023-03-01', thru_date: '2025-06-30', active_children_count: 0, current_people_count: 0, row_version: 9,
} as OrganizationUnit;
const apiError = (status: number, code: string, details?: Record<string, unknown>) =>
  new HttpErrorResponse({ status, error: { error: { code, message: 'm', status, timestamp: 't', details } } });

describe('UnitReactivatePage (SCR-030-03 reactivar, SCR-030-04 bloqueo por padre inactivo)', () => {
  let fixture: ComponentFixture<UnitReactivatePage>;
  let api: { get: ReturnType<typeof vi.fn>; reactivate: ReturnType<typeof vi.fn> };
  let navigate: ReturnType<typeof vi.spyOn>;
  const el = () => fixture.nativeElement as HTMLElement;
  const dialog = () => el().querySelector('dialog')!;
  const text = () => el().textContent ?? '';
  const dbtn = (label: string) => Array.from(dialog().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.trim() === label)!;
  const alerts = () => Array.from(dialog().querySelectorAll('[role="alert"]')).map((n) => n.textContent!.trim());

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function open(opts: { unit?: OrganizationUnit; parent?: OrganizationUnit; allowed?: boolean } = {}) {
    api = {
      get: vi.fn((id: string) => of(id === 'u-1' ? (opts.parent ?? PARENT) : (opts.unit ?? INACTIVE))),
      reactivate: vi.fn(() => of({ ...INACTIVE, status: 'active' })),
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
    fixture = TestBed.createComponent(UnitReactivatePage);
    document.body.appendChild(el());
    await settle();
  }
  async function setDate(value: string) {
    const i = dialog().querySelector<HTMLInputElement>('input[type="date"]')!;
    i.value = value;
    i.dispatchEvent(new Event('change'));
    await settle();
  }
  async function reactivate() {
    dbtn('Reactivar').click();
    await settle();
  }

  beforeAll(installDialogPolyfill);
  afterAll(uninstallDialogPolyfill);
  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => el()?.remove());

  describe('reactivar con fecha (SCR-030-03)', () => {
    it('abre un diálogo «Reactivar {unidad}» con vigencia anterior, unidad padre con su estado y el campo obligatorio Fecha desde', async () => {
      await open();
      expect(api.get).toHaveBeenCalledWith('u-2');
      expect(api.get).toHaveBeenCalledWith('u-1');
      expect(dialog().open).toBe(true);
      expect(dialog().querySelector('h2')!.textContent).toContain('Reactivar Ventas Regionales');
      const t = dialog().textContent!;
      expect(t).toContain('Vigencia anterior');
      expect(t).toContain('01/03/2023');
      expect(t).toContain('30/06/2025');
      expect(t).toContain('Ingeniería');
      expect(t).toContain('Activa');
      const label = Array.from(dialog().querySelectorAll('label')).find((l) => l.textContent!.includes('Fecha desde'))!;
      expect(dialog().querySelector(`#${label.getAttribute('for')}`)!.getAttribute('aria-required')).toBe('true');
      expect(text()).not.toContain('Eliminar');
    });

    it('sin fecha: error «Indica la fecha desde» (role="alert", aria-invalid), foco en el campo y sin llamar al servicio', async () => {
      await open();
      await reactivate();
      expect(alerts()).toContain('Indica la fecha desde');
      const input = dialog().querySelector<HTMLInputElement>('input[type="date"]')!;
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(document.activeElement).toBe(input);
      expect(api.reactivate).not.toHaveBeenCalled();
    });

    it('con fecha reactiva con from_date y la row_version, sin enviar parent_id, y vuelve al listado con la confirmación', async () => {
      await open();
      await setDate('2026-10-02');
      await reactivate();
      expect(api.reactivate).toHaveBeenCalledWith('u-2', { from_date: '2026-10-02' }, 9);
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2', notice: 'Unidad reactivada: Ventas Regionales ahora figura como Activa' } });
    });

    it('el foco inicial cae en el primer control del diálogo (la fecha); Cancelar y Escape vuelven al listado sin cambios devolviendo el foco a la unidad', async () => {
      await open();
      expect(dialog().contains(document.activeElement)).toBe(true);
      expect(document.activeElement).toBe(dialog().querySelector('input[type="date"]'));
      dialog().dispatchEvent(new Event('cancel', { cancelable: true }));
      await settle();
      expect(api.reactivate).not.toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2' } });
    });

    it('mientras guarda: «Reactivar» en carga, «Cancelar» deshabilitado y sin segunda llamada', async () => {
      await open();
      api.reactivate.mockReturnValue(new Subject());
      await setDate('2026-10-02');
      await reactivate();
      expect(dbtn('Reactivar').getAttribute('aria-busy')).toBe('true');
      expect(dbtn('Cancelar').disabled).toBe(true);
      dbtn('Reactivar').click();
      await settle();
      expect(api.reactivate).toHaveBeenCalledTimes(1);
    });

    it('un error de validación de from_date del servidor se muestra en el campo, conservando la fecha', async () => {
      await open();
      api.reactivate.mockReturnValue(throwError(() => apiError(400, 'VALIDATION_ERROR', { fields: [{ field: 'from_date', message: 'La fecha desde no puede ser futura.' }] })));
      await setDate('2099-01-01');
      await reactivate();
      expect(alerts()).toContain('La fecha desde no puede ser futura.');
      expect(dialog().querySelector<HTMLInputElement>('input[type="date"]')!.value).toBe('2099-01-01');
    });

    it('error inesperado: aviso con «Reintentar»; 412 y ya activa avisan sin cambiar la unidad', async () => {
      await open();
      api.reactivate.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      await setDate('2026-10-02');
      await reactivate();
      expect(alerts().some((a) => a.includes('No se pudo reactivar la unidad'))).toBe(true);
      api.reactivate.mockReturnValue(throwError(() => apiError(412, 'PRECONDITION_FAILED')));
      dbtn('Reintentar').click();
      await settle();
      expect(alerts().some((a) => a.includes('La unidad cambió'))).toBe(true);
      api.reactivate.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_ALREADY_ACTIVE')));
      dbtn('Reintentar').click();
      await settle();
      expect(alerts().some((a) => a.includes('ya está activa'))).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('bloqueo por padre inactivo (SCR-030-04)', () => {
    it('409 PARENT_INACTIVE: mensaje role="alert" con el nombre del padre, enlace para reactivarlo y «Cerrar»; sin «Reactivar»', async () => {
      await open();
      api.reactivate.mockReturnValue(throwError(() => apiError(409, 'PARENT_INACTIVE', { parent_id: 'u-1', parent_name: 'Ingeniería' })));
      await setDate('2026-10-02');
      await reactivate();
      expect(alerts().join(' ')).toContain('No se puede reactivar');
      expect(alerts().join(' ')).toContain('Ingeniería');
      expect(alerts().join(' ')).toContain('Reactívala primero');
      const link = Array.from(dialog().querySelectorAll('a')).find((a) => a.textContent!.includes('Ingeniería'))!;
      expect(link.getAttribute('href')).toBe(`${UNITS_URL}/u-1/reactivar`);
      expect(dbtn('Reactivar')).toBeUndefined();
      expect(dbtn('Cerrar')).toBeTruthy();
    });

    it('si el padre cargado ya está inactivo, muestra el bloqueo sin intentar reactivar y «Cerrar» recibe el foco', async () => {
      await open({ parent: { ...PARENT, status: 'inactive' } });
      expect(alerts().join(' ')).toContain('Ingeniería');
      expect(api.reactivate).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(dbtn('Cerrar'));
    });

    it('«Cerrar» vuelve al listado devolviendo el foco a la unidad', async () => {
      await open({ parent: { ...PARENT, status: 'inactive' } });
      dbtn('Cerrar').click();
      await settle();
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2' } });
    });
  });

  describe('acceso y carga', () => {
    it('sin rol de gestión: estado sin permiso, sin diálogo y sin consultar', async () => {
      await open({ allowed: false });
      expect(text()).toContain('No tiene permiso para reactivar unidades');
      expect(el().querySelector('dialog')).toBeNull();
      expect(api.get).not.toHaveBeenCalled();
    });

    it('403 al reactivar pasa al estado sin permiso', async () => {
      await open();
      api.reactivate.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
      await setDate('2026-10-02');
      await reactivate();
      expect(text()).toContain('No tiene permiso para reactivar unidades');
    });

    it('un error de carga muestra «Reintentar» y mientras carga «Cargando»', async () => {
      await open();
      api.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      fixture = TestBed.createComponent(UnitReactivatePage);
      document.body.appendChild(el());
      await settle();
      expect(text()).toContain('Reintentar');
      api.get.mockReturnValue(NEVER);
      fixture = TestBed.createComponent(UnitReactivatePage);
      document.body.appendChild(el());
      await settle();
      expect(text()).toContain('Cargando');
    });

    it('una unidad ya activa no ofrece reactivar: avisa que ya está activa', async () => {
      await open({ unit: { ...INACTIVE, status: 'active', thru_date: null } });
      expect(text()).toContain('ya está activa');
      expect(el().querySelector('dialog')?.open ?? false).toBe(false);
    });

    it('una unidad sin padre se puede reactivar y muestra «Sin unidad padre»', async () => {
      await open({ unit: { ...INACTIVE, parent_id: null } });
      expect(dialog().textContent).toContain('Sin unidad padre');
      expect(dbtn('Reactivar')).toBeTruthy();
    });
  });
});
