import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SessionService } from '@gf/core';
import { Subject, of, throwError } from 'rxjs';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { InternalOrganization } from '../../data-access/organizations.models';
import { OrganizationsService } from '../../data-access/organizations.service';
import { INTERNAL_ORG_URL } from '../../shared/unit-nav';
import { installDialogPolyfill, uninstallDialogPolyfill } from '../../testing/dialog-polyfill';
import { InternalOrganizationFormPage } from './internal-organization-form.page';

const CREATED: InternalOrganization = { id: 'o-1', name: 'COMSATEL S.A.C.', ruc: '20123456780', ruc_country: 'PE', from_date: '2026-10-05', thru_date: null };
const apiError = (status: number, code: string, details?: Record<string, unknown>) =>
  new HttpErrorResponse({ status, error: { error: { code, message: 'm', status, timestamp: 't', details } } });

describe('InternalOrganizationFormPage (SCR-017-02 alta inicial de la organización interna)', () => {
  let fixture: ComponentFixture<InternalOrganizationFormPage>;
  let api: { createInternalOrganization: ReturnType<typeof vi.fn> };
  let navigate: ReturnType<typeof vi.spyOn>;
  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => el().textContent ?? '';
  const alerts = () => Array.from(el().querySelectorAll('[role="alert"]')).map((n) => n.textContent!.trim());
  const input = (id: string) => el().querySelector<HTMLInputElement>(`#${id}`)!;
  const button = (label: string) => Array.from(el().querySelectorAll<HTMLButtonElement>('button')).find((b) => b.textContent!.trim() === label)!;

  async function open(allowed = true) {
    api = { createInternalOrganization: vi.fn(() => of(CREATED)) };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: OrganizationsService, useValue: api }, { provide: SessionService, useValue: { hasAnyRole: () => allowed } }],
    });
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(InternalOrganizationFormPage);
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
  async function fillValid() {
    await type('org-name', '  COMSATEL S.A.C. ');
    await type('org-ruc', '20123456780');
  }
  async function submit() {
    button('Registrar').click();
    await settle();
  }

  beforeAll(installDialogPolyfill);
  afterAll(uninstallDialogPolyfill);
  beforeEach(() => TestBed.resetTestingModule());
  afterEach(() => el()?.remove());

  it('default: título, Razón social y RUC obligatorios, País emisor con Perú prefijado y Vigencia desde de solo lectura', async () => {
    await open();
    expect(el().querySelector('h1')!.textContent).toContain('Registrar organización interna');
    for (const label of ['Razón social', 'RUC', 'País emisor']) {
      const l = Array.from(el().querySelectorAll('label')).find((n) => n.textContent!.includes(label));
      expect(l, label).toBeTruthy();
      expect(document.getElementById(l!.getAttribute('for')!), label).toBeTruthy();
    }
    expect(input('org-name').required || input('org-name').getAttribute('aria-required') === 'true').toBe(true);
    const country = el().querySelector<HTMLSelectElement>('select')!;
    expect(country.value).toBe('PE');
    expect(country.options[country.selectedIndex].textContent!.trim()).toBe('Perú');
    expect(text()).toContain('Vigencia desde');
    expect(text()).toContain('La fija el sistema al registrar');
    expect(el().querySelectorAll('input').length).toBe(2); // la vigencia no es un campo editable
    expect(button('Registrar')).toBeTruthy();
    expect(button('Cancelar')).toBeTruthy();
  });

  it('validation-error: enviar vacío muestra errores con role="alert", no llama al servicio y enfoca el primer campo con error', async () => {
    await open();
    await submit();
    expect(api.createInternalOrganization).not.toHaveBeenCalled();
    expect(alerts()).toEqual(expect.arrayContaining(['Indica la razón social', 'Indica el RUC']));
    expect(document.activeElement).toBe(input('org-name'));
    expect(input('org-name').getAttribute('aria-invalid')).toBe('true');
  });

  it('un RUC con formato inválido (no 11 dígitos) muestra el error en el campo RUC', async () => {
    await open();
    await type('org-name', 'COMSATEL');
    await type('org-ruc', '2012345');
    await submit();
    expect(api.createInternalOrganization).not.toHaveBeenCalled();
    expect(alerts()).toContain('El RUC debe tener 11 dígitos');
    expect(document.activeElement).toBe(input('org-ruc'));
  });

  it('invalid-identification-type: un número de 8 dígitos (DNI) se rechaza como identificación de persona', async () => {
    await open();
    await type('org-name', 'COMSATEL');
    await type('org-ruc', '12345678');
    await submit();
    expect(api.createInternalOrganization).not.toHaveBeenCalled();
    expect(alerts()).toContain('Ingresa un RUC: no se admite el DNI ni otra identificación de persona');
  });

  it('«Registrar» se deshabilita mientras haya errores y vuelve a habilitarse al corregir los campos', async () => {
    await open();
    expect(button('Registrar').disabled).toBe(false);
    await submit();
    expect(button('Registrar').disabled).toBe(true);
    await type('org-name', 'COMSATEL');
    await type('org-ruc', '20123456780');
    expect(button('Registrar').disabled).toBe(false);
  });

  it('success: envía razón social recortada y RUC, y vuelve a SCR-017-01 con confirmación', async () => {
    await open();
    await fillValid();
    await submit();
    expect(api.createInternalOrganization).toHaveBeenCalledWith({ name: 'COMSATEL S.A.C.', ruc: '20123456780' });
    expect(navigate).toHaveBeenCalledWith([INTERNAL_ORG_URL], { state: { notice: 'Organización interna registrada' } });
  });

  it('saving: mientras guarda muestra carga y no permite un segundo envío', async () => {
    await open();
    api.createInternalOrganization.mockReturnValue(new Subject<InternalOrganization>());
    await fillValid();
    await submit();
    button('Registrar').click();
    await settle();
    expect(api.createInternalOrganization).toHaveBeenCalledTimes(1);
    expect(button('Registrar').disabled || button('Registrar').getAttribute('aria-busy') === 'true').toBe(true);
    expect(button('Cancelar').disabled).toBe(true);
  });

  it('duplicate-ruc: 409 ORGANIZATION_DUPLICATE marca el campo RUC, enfoca y conserva los datos', async () => {
    await open();
    api.createInternalOrganization.mockReturnValue(throwError(() => apiError(409, 'ORGANIZATION_DUPLICATE', { field: 'ruc' })));
    await fillValid();
    await submit();
    expect(alerts()).toContain('La identificación ya existe');
    expect(input('org-ruc').getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(input('org-ruc'));
    expect(input('org-name').value).toBe('  COMSATEL S.A.C. ');
    expect(input('org-ruc').value).toBe('20123456780');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('400 VALIDATION_ERROR del servidor sobre el RUC se muestra en el campo RUC', async () => {
    await open();
    api.createInternalOrganization.mockReturnValue(throwError(() => apiError(400, 'VALIDATION_ERROR', { fields: [{ field: 'ruc', message: 'x' }] })));
    await fillValid();
    await submit();
    expect(alerts()).toContain('El RUC debe tener 11 dígitos');
    expect(input('org-ruc').getAttribute('aria-invalid')).toBe('true');
  });

  it('409 INTERNAL_ORGANIZATION_ALREADY_EXISTS: vuelve a SCR-017-01 (que se refresca) con aviso de que ya existe', async () => {
    await open();
    api.createInternalOrganization.mockReturnValue(throwError(() => apiError(409, 'INTERNAL_ORGANIZATION_ALREADY_EXISTS')));
    await fillValid();
    await submit();
    expect(navigate).toHaveBeenCalledWith([INTERNAL_ORG_URL], { state: { notice: 'Ya existe una organización interna registrada.' } });
  });

  it('save-error: alerta con «Reintentar» sin perder los datos; reintentar guarda', async () => {
    await open();
    api.createInternalOrganization.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    await fillValid();
    await submit();
    expect(alerts().some((a) => a.includes('No se pudo registrar la organización interna. Intenta de nuevo.'))).toBe(true);
    expect(input('org-name').value).toBe('  COMSATEL S.A.C. ');
    expect(input('org-ruc').value).toBe('20123456780');
    api.createInternalOrganization.mockReturnValue(of(CREATED));
    button('Reintentar').click();
    await settle();
    expect(api.createInternalOrganization).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalled();
  });

  it('sin rol de gestión no muestra el formulario, sino el mensaje de acceso no autorizado', async () => {
    await open(false);
    expect(text()).toContain('No tienes permiso para gestionar la organización interna.');
    expect(el().querySelector('form')).toBeNull();
  });

  it('403 del servidor al guardar pasa al mensaje de acceso no autorizado', async () => {
    await open();
    api.createInternalOrganization.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));
    await fillValid();
    await submit();
    expect(text()).toContain('No tienes permiso para gestionar la organización interna.');
    expect(el().querySelector('form')).toBeNull();
  });

  it('Cancelar sin datos vuelve a SCR-017-01 sin preguntar', async () => {
    await open();
    button('Cancelar').click();
    await settle();
    expect(navigate).toHaveBeenCalledWith([INTERNAL_ORG_URL]);
  });

  it('Cancelar con datos sin guardar pide confirmación; «Seguir editando» no navega y «Descartar» vuelve', async () => {
    await open();
    await type('org-name', 'Algo');
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
    expect(navigate).toHaveBeenCalledWith([INTERNAL_ORG_URL]);
  });
});
