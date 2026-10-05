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
import { UnitDeactivatePage } from './unit-deactivate.page';

const unit = (over: Partial<OrganizationUnit> = {}): OrganizationUnit => ({
  id: 'u-2', name: 'Dirección de Operaciones', type: 'internal_unit', parent_id: 'u-1', status: 'active',
  from_date: '2024-01-15', thru_date: null, active_children_count: 0, current_people_count: 0, row_version: 7, ...over,
});
const apiError = (status: number, code: string, details?: Record<string, unknown>) =>
  new HttpErrorResponse({ status, error: { error: { code, message: 'm', status, timestamp: 't', details } } });

describe('UnitDeactivatePage (SCR-030-01 confirmar, SCR-030-02 bloqueo por dependencias)', () => {
  let fixture: ComponentFixture<UnitDeactivatePage>;
  let api: { get: ReturnType<typeof vi.fn>; deactivate: ReturnType<typeof vi.fn> };
  let navigate: ReturnType<typeof vi.spyOn>;
  const el = () => fixture.nativeElement as HTMLElement;
  const dialog = () => el().querySelector('dialog')!;
  const text = () => el().textContent ?? '';
  const dbtn = (label: string) => Array.from(dialog().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.trim() === label)!;

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function open(opts: { unit?: OrganizationUnit; allowed?: boolean } = {}) {
    api = { get: vi.fn(() => of(opts.unit ?? unit())), deactivate: vi.fn(() => of(unit({ status: 'inactive' }))) };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: OrganizationsService, useValue: api },
        { provide: SessionService, useValue: { hasAnyRole: () => opts.allowed ?? true } },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ unitId: 'u-2' }) } } },
      ],
    });
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(UnitDeactivatePage);
    document.body.appendChild(el());
    await settle();
  }
  async function confirm() {
    dbtn('Desactivar').click();
    await settle();
  }

  beforeAll(installDialogPolyfill);
  afterAll(uninstallDialogPolyfill);
  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => el()?.remove());

  describe('confirmación (SCR-030-01)', () => {
    it('abre un diálogo con el nombre de la unidad, la consecuencia (no se borra, conserva historial) y los botones Cancelar y Desactivar', async () => {
      await open();
      expect(api.get).toHaveBeenCalledWith('u-2');
      expect(dialog().open).toBe(true);
      expect(dialog().querySelector('h2')!.textContent).toContain('Desactivar Dirección de Operaciones');
      expect(dialog().textContent).toContain('no se borra');
      expect(dialog().textContent).toContain('historial');
      expect(dbtn('Cancelar')).toBeTruthy();
      expect(dbtn('Desactivar').closest('gf-button')!.querySelector('button')!.getAttribute('aria-label')).toBe('Desactivar Dirección de Operaciones');
      expect(text()).not.toContain('Eliminar');
      expect(text()).not.toContain('Borrar');
    });

    it('el foco inicial está en «Cancelar»', async () => {
      await open();
      expect(document.activeElement).toBe(dbtn('Cancelar'));
    });

    it('Cancelar vuelve al listado sin llamar al servicio, devolviendo el foco a la unidad', async () => {
      await open();
      dbtn('Cancelar').click();
      await settle();
      expect(api.deactivate).not.toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2' } });
    });

    it('Escape (evento cancel) cierra el diálogo y vuelve al listado sin cambios', async () => {
      await open();
      dialog().dispatchEvent(new Event('cancel', { cancelable: true }));
      await settle();
      expect(api.deactivate).not.toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2' } });
    });

    it('Desactivar llama al servicio con la row_version y vuelve al listado con la confirmación', async () => {
      await open();
      await confirm();
      expect(api.deactivate).toHaveBeenCalledWith('u-2', 7);
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2', notice: 'Unidad desactivada: Dirección de Operaciones ahora figura como Inactiva' } });
    });

    it('mientras guarda: «Desactivar» en carga, «Cancelar» deshabilitado y sin segunda llamada', async () => {
      await open();
      api.deactivate.mockReturnValue(new Subject());
      await confirm();
      expect(dbtn('Desactivar').getAttribute('aria-busy')).toBe('true');
      expect(dbtn('Cancelar').disabled).toBe(true);
      dbtn('Desactivar').click();
      await settle();
      expect(api.deactivate).toHaveBeenCalledTimes(1);
    });

    it('error al guardar: aviso role="alert" con «Reintentar»; la unidad no cambia y el diálogo sigue abierto', async () => {
      await open();
      api.deactivate.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      await confirm();
      expect(dialog().open).toBe(true);
      expect(dialog().querySelector('[role="alert"]')!.textContent).toContain('No se pudo desactivar la unidad');
      expect(navigate).not.toHaveBeenCalled();
      api.deactivate.mockReturnValue(of(unit({ status: 'inactive' })));
      dbtn('Reintentar').click();
      await settle();
      expect(api.deactivate).toHaveBeenCalledTimes(2);
      expect(navigate).toHaveBeenCalled();
    });

    it('412 avisa que la unidad cambió; ya inactiva avisa que ya está inactiva', async () => {
      await open();
      api.deactivate.mockReturnValue(throwError(() => apiError(412, 'PRECONDITION_FAILED')));
      await confirm();
      expect(dialog().querySelector('[role="alert"]')!.textContent).toContain('La unidad cambió');
      api.deactivate.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_ALREADY_INACTIVE')));
      dbtn('Reintentar').click();
      await settle();
      expect(dialog().querySelector('[role="alert"]')!.textContent).toContain('ya está inactiva');
    });
  });

  describe('bloqueo por dependencias (SCR-030-02)', () => {
    it('409 ORGANIZATION_HAS_DEPENDENCIES: mensaje role="alert" con ambos conteos, sin botón «Desactivar» y con «Cerrar»', async () => {
      await open();
      api.deactivate.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_HAS_DEPENDENCIES', { active_children_count: 3, current_people_count: 12 })));
      await confirm();
      const alert = dialog().querySelector('[role="alert"]')!;
      expect(alert.textContent).toContain('No se puede desactivar');
      expect(alert.textContent).toContain('3 unidades hijas activas');
      expect(alert.textContent).toContain('12 personas con pertenencia vigente');
      expect(dbtn('Desactivar')).toBeUndefined();
      expect(dbtn('Cerrar')).toBeTruthy();
      expect(dialog().querySelector('h2')!.textContent).toContain('No se puede desactivar');
    });

    it('con un solo tipo de dependencia omite el otro conteo (SCR-030-Q3 abierta) y usa el singular', async () => {
      await open();
      api.deactivate.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_HAS_DEPENDENCIES', { active_children_count: 1, current_people_count: 0 })));
      await confirm();
      const t = dialog().querySelector('[role="alert"]')!.textContent!;
      expect(t).toContain('1 unidad hija activa');
      expect(t).not.toContain('personas');
    });

    it('ofrece ir a resolverlas: unidades hijas hacia el listado y personas hacia colaboradores (destino abierto, FLW-030-Q3)', async () => {
      await open();
      api.deactivate.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_HAS_DEPENDENCIES', { active_children_count: 3, current_people_count: 12 })));
      await confirm();
      const hrefs = Array.from(dialog().querySelectorAll('a')).map((a) => a.getAttribute('href'));
      expect(hrefs).toContain(UNITS_URL);
      expect(hrefs).toContain('/colaboradores');
    });

    it('si la unidad ya trae conteos mayores que cero, muestra el bloqueo sin intentar desactivar', async () => {
      await open({ unit: unit({ active_children_count: 2, current_people_count: 0 }) });
      expect(dialog().querySelector('[role="alert"]')!.textContent).toContain('2 unidades hijas activas');
      expect(api.deactivate).not.toHaveBeenCalled();
      expect(dbtn('Desactivar')).toBeUndefined();
    });

    it('el foco pasa a «Cerrar» y «Cerrar» vuelve al listado devolviendo el foco a la unidad', async () => {
      await open();
      api.deactivate.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_HAS_DEPENDENCIES', { active_children_count: 3, current_people_count: 0 })));
      await confirm();
      expect(document.activeElement).toBe(dbtn('Cerrar'));
      dbtn('Cerrar').click();
      await settle();
      expect(navigate).toHaveBeenCalledWith([UNITS_URL], { state: { highlightUnitId: 'u-2' } });
    });
  });

  describe('acceso y carga', () => {
    it('sin rol de gestión no hay diálogo ni acciones: estado sin permiso y volver a unidades', async () => {
      await open({ allowed: false });
      expect(text()).toContain('No tiene permiso para desactivar unidades');
      expect(el().querySelector('dialog')).toBeNull();
      expect(api.get).not.toHaveBeenCalled();
    });

    it('403 del servidor al desactivar pasa al estado sin permiso', async () => {
      await open();
      api.deactivate.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
      await confirm();
      expect(text()).toContain('No tiene permiso para desactivar unidades');
    });

    it('un error de carga muestra «Reintentar»; mientras carga, «Cargando» y ningún diálogo abierto', async () => {
      await open();
      api.get.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      fixture = TestBed.createComponent(UnitDeactivatePage);
      document.body.appendChild(el());
      await settle();
      expect(text()).toContain('Reintentar');
      api.get.mockReturnValue(NEVER);
      fixture = TestBed.createComponent(UnitDeactivatePage);
      document.body.appendChild(el());
      await settle();
      expect(text()).toContain('Cargando');
      expect(el().querySelector('dialog')?.open ?? false).toBe(false);
    });

    it('una unidad ya inactiva no ofrece desactivar: avisa que ya está inactiva', async () => {
      await open({ unit: unit({ status: 'inactive' }) });
      expect(text()).toContain('ya está inactiva');
      expect(el().querySelector('dialog')?.open ?? false).toBe(false);
    });
  });
});
