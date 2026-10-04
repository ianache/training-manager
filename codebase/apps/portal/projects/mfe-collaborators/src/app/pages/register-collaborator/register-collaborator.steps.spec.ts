import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, Subject, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RegisterCollaboratorApi } from './register-collaborator.api';
import { RegisterCollaboratorPage } from './register-collaborator.page';
import { Option, RoleOption, StepId, WizardData, todayIso } from './register-collaborator.rules';

/**
 * Comportamiento visible de los pasos SCR-015-03..09 a través de la página real,
 * con la API simulada. Los pasos 01 y 02 ya los cubre register-collaborator.page.spec.ts.
 */

interface WizardStoreHandle {
  patch(p: Partial<WizardData>): void;
  setType(t: 'Employee' | 'Contractor'): void;
  goToStep(s: StepId): void;
  idConflict: { set(v: boolean): void };
  organizationStale: { set(v: boolean): void };
  emailCheck: { set(v: string): void };
  data(): WizardData;
  step(): StepId;
}

const role: RoleOption = {
  id: 'r-1',
  label: 'Developer',
  levels: [
    { id: 'l-1', label: 'Nivel 1', evidenceCount: 3, usable: true },
    { id: 'l-2', label: 'Nivel 2', evidenceCount: 2, usable: true },
    { id: 'l-x', label: 'Nivel sin requisitos', evidenceCount: 0, usable: false },
    { id: 'l-y', label: 'Nivel con requisitos no utilizable', evidenceCount: 4, usable: false },
  ],
};
const unit: Option = { id: 'u-1', label: 'Ingeniería', sublabel: 'Sede Central' };
const provider: Option = { id: 'v-1', label: 'Seguridad Sur', sublabel: 'RUC: 20123456789' };
const manager: Option = { id: 'm-1', label: 'Marina Ramos', sublabel: 'marina@comsatel.com.pe' };

type Api = {
  emailInUse: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  getParty: ReturnType<typeof vi.fn>;
  searchUnits: ReturnType<typeof vi.fn>;
  searchProviders: ReturnType<typeof vi.fn>;
  searchManagers: ReturnType<typeof vi.fn>;
  roles: ReturnType<typeof vi.fn>;
};

describe('Asistente «Registrar un colaborador» — pasos SCR-015-03 a SCR-015-09', () => {
  let fixture: ComponentFixture<RegisterCollaboratorPage>;
  let el: HTMLElement;
  let store: WizardStoreHandle;
  let api: Api;
  const navigateByUrl = vi.fn();

  const defaultApi = (): Api => ({
    emailInUse: vi.fn(() => of(false)),
    create: vi.fn(() => of({ id: 'new-1', code: 'a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d' })),
    getParty: vi.fn(() => of({ id: 'm-1', status: 'active' })),
    searchUnits: vi.fn(() => of([unit])),
    searchProviders: vi.fn(() => of([provider])),
    searchManagers: vi.fn(() => of([{ ...manager, badge: 'Vigente' }])),
    roles: vi.fn(() => of([role])),
  });

  async function setup(over: Partial<Api> = {}): Promise<void> {
    api = { ...defaultApi(), ...over };
    await TestBed.configureTestingModule({
      imports: [RegisterCollaboratorPage],
      providers: [
        { provide: RegisterCollaboratorApi, useValue: api },
        { provide: Router, useValue: { navigateByUrl } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(RegisterCollaboratorPage);
    el = fixture.nativeElement;
    store = (fixture.componentInstance as unknown as { store: WizardStoreHandle }).store;
    await tick();
  }

  const tick = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const wait = async (ms: number) => {
    await new Promise((r) => setTimeout(r, ms));
    await tick();
  };
  const q = <T extends HTMLElement>(sel: string) => el.querySelector<T>(sel);
  const button = (label: RegExp) =>
    [...el.querySelectorAll<HTMLButtonElement>('gf-button button')].find((b) => label.test(b.textContent ?? '') || label.test(b.getAttribute('aria-label') ?? ''));
  const next = () => button(/^\s*Siguiente/)!;
  const type = async (sel: string, value: string) => {
    const i = q<HTMLInputElement>(sel)!;
    i.value = value;
    i.dispatchEvent(new Event('input'));
    await tick();
  };
  const blur = async (sel: string) => {
    q(sel)!.dispatchEvent(new Event('blur'));
    await tick();
  };
  const text = () => el.textContent ?? '';

  /** Llena lo que los pasos anteriores exigen y salta al paso pedido. */
  async function goTo(step: StepId, kind: 'Employee' | 'Contractor' = 'Employee'): Promise<void> {
    store.setType(kind);
    store.patch({
      firstNames: 'Carlos',
      lastNames: 'Mendoza',
      idNumber: '87654321',
      email: 'carlos@comsatel.com.pe',
      organization: kind === 'Employee' ? unit : provider,
      manager: kind === 'Employee' ? manager : null,
      role,
      levelId: 'l-2',
    });
    store.emailCheck.set('valid');
    store.goToStep(step);
    await tick();
  }

  beforeEach(() => navigateByUrl.mockReset());
  afterEach(() => vi.useRealTimers());

  // ------------------------------------------------------------------ SCR-015-03
  describe('SCR-015-03 Identificación', () => {
    beforeEach(async () => {
      await setup();
      store.setType('Employee');
      store.goToStep('identificacion');
      await tick();
    });

    it('un DNI de menos de 8 dígitos muestra el error al salir del campo y bloquea Siguiente', async () => {
      await type('#rc-id-numero', '123');
      await blur('#rc-id-numero');
      const msg = q('#rc-id-numero-msg')!;
      expect(msg.textContent).toContain('El DNI debe tener 8 dígitos');
      expect(msg.getAttribute('role')).toBe('alert');
      expect(q('#rc-id-numero')!.getAttribute('aria-invalid')).toBe('true');
      expect(next().disabled).toBe(true);
    });

    it('con Pasaporte la regla cambia: acepta alfanuméricos de 5 a 20', async () => {
      const select = q<HTMLSelectElement>('#rc-id-tipo')!;
      select.value = 'Passport';
      select.dispatchEvent(new Event('change'));
      await tick();
      await type('#rc-id-numero', 'AB-1234');
      expect(next().disabled).toBe(false);
      expect(store.data().idType).toBe('Passport');
    });

    it('E5: el conflicto del servicio nombra tipo, número y país, y «Corregir identificación» enfoca el número', async () => {
      await type('#rc-id-numero', '87654321');
      store.idConflict.set(true);
      await tick();
      expect(text()).toContain('La identificación DNI 87654321 (Perú) ya está registrada.');
      expect(next().disabled).toBe(true);
      button(/Corregir identificación/)!.click();
      await tick();
      expect(document.activeElement?.id).toBe('rc-id-numero');
    });

    it('editar el número después de un conflicto quita el error y vuelve el aviso informativo', async () => {
      await type('#rc-id-numero', '87654321');
      store.idConflict.set(true);
      await tick();
      await type('#rc-id-numero', '87654322');
      expect(text()).not.toContain('ya está registrada');
      expect(text()).toContain('Los datos serán validados automáticamente.');
      expect(next().disabled).toBe(false);
    });
  });

  // ------------------------------------------------------------------ SCR-015-04
  describe('SCR-015-04 Correo laboral', () => {
    const useFake = async (over: Partial<Api> = {}) => {
      vi.useFakeTimers();
      await setup(over);
      store.setType('Employee');
      store.goToStep('correo');
      fixture.detectChanges();
    };
    const typeFake = async (value: string) => {
      const i = q<HTMLInputElement>('#rc-correo')!;
      i.value = value;
      i.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    const flush = async (ms = 301) => {
      await vi.advanceTimersByTimeAsync(ms);
      fixture.detectChanges();
    };

    it('muestra «Verificando…» mientras consulta y «Correo válido» si está libre', async () => {
      await useFake();
      await typeFake('carlos@comsatel.com.pe');
      expect(text()).toContain('Verificando disponibilidad del correo en el sistema…');
      expect(next().disabled).toBe(true);
      await flush();
      expect(text()).toContain('Correo válido');
      expect(api.emailInUse).toHaveBeenCalledTimes(1);
      expect(api.emailInUse).toHaveBeenCalledWith('carlos@comsatel.com.pe');
      expect(next().disabled).toBe(false);
    });

    it('E6: un correo en uso lo dice con el correo, bloquea Siguiente y «Corregir correo» enfoca el campo', async () => {
      await useFake({ emailInUse: vi.fn(() => of(true)) });
      await typeFake('juan.perez@comsatel.com.pe');
      await flush();
      expect(text()).toContain('El correo juan.perez@comsatel.com.pe ya está en uso por otro colaborador vigente.');
      expect(q('#rc-correo')!.getAttribute('aria-invalid')).toBe('true');
      expect(next().disabled).toBe(true);
      button(/Corregir correo/)!.click();
      fixture.detectChanges();
      expect(document.activeElement?.id).toBe('rc-correo');
    });

    it('si la consulta falla avisa que se comprobará al guardar y no bloquea', async () => {
      await useFake({ emailInUse: vi.fn(() => throwError(() => new Error('down'))) });
      await typeFake('carlos@comsatel.com.pe');
      await flush();
      expect(text()).toContain('No se pudo verificar ahora');
      expect(text()).toContain('La disponibilidad del correo se comprobará al guardar.');
      expect(next().disabled).toBe(false);
    });

    it('un correo mal formado muestra el error de formato y no consulta al servicio', async () => {
      await useFake();
      await typeFake('no-es-correo');
      q('#rc-correo')!.dispatchEvent(new Event('blur'));
      await flush();
      expect(q('#rc-correo-msg')?.textContent).toContain('Ingresa un correo válido');
      expect(api.emailInUse).not.toHaveBeenCalled();
      expect(next().disabled).toBe(true);
    });
  });

  // ------------------------------------------------------------------ SCR-015-05
  describe('SCR-015-05 Unidad / Proveedor', () => {
    it('Contratista: sin proveedores muestra E3 y «Crear proveedor» queda deshabilitado con su historia', async () => {
      await setup({ searchProviders: vi.fn(() => of([])) });
      await goTo('organizacion', 'Contractor');
      expect(text()).toContain('No hay proveedores registrados. Crea uno primero (US-018).');
      const create = button(/Crear proveedor/)!;
      expect(create.disabled).toBe(true);
      expect(create.getAttribute('aria-label')).toContain('US-018');
    });

    it('Empleado: mientras consulta unidades muestra «Cargando unidades…»', async () => {
      await setup({ searchUnits: vi.fn(() => new Subject<Option[]>() as Observable<Option[]>) });
      await goTo('organizacion');
      expect(text()).toContain('Cargando unidades…');
    });

    it('si el servicio de unidades falla se trata como E2', async () => {
      await setup({ searchUnits: vi.fn(() => throwError(() => new Error('503'))) });
      await goTo('organizacion');
      expect(text()).toContain('No hay unidades registradas. Crea una primero (US-017).');
    });

    it('elegir una unidad de la lista la muestra como seleccionada y habilita Siguiente; «Quitar selección» la limpia', async () => {
      await setup();
      store.setType('Employee');
      store.goToStep('organizacion');
      await tick();
      const combo = q<HTMLInputElement>('#rc-org')!;
      combo.dispatchEvent(new Event('focus'));
      await wait(350);
      const option = el.querySelector<HTMLElement>('[role=option]')!;
      expect(option.textContent).toContain('Ingeniería');
      option.click();
      await tick();
      expect(text()).toContain('Unidad seleccionada:');
      expect(el.querySelector('[aria-label="Unidad seleccionada"]')?.textContent).toContain('Ingeniería');
      expect(store.data().organization?.id).toBe('u-1');
      expect(next().disabled).toBe(false);
      button(/Quitar selección/)!.click();
      await tick();
      expect(store.data().organization).toBeNull();
      expect(next().disabled).toBe(true);
    });

    it('E7: una unidad que dejó de estar vigente lo avisa y «Seleccionar otra» la descarta', async () => {
      await setup();
      await goTo('organizacion');
      store.organizationStale.set(true);
      await tick();
      expect(text()).toContain('La unidad ya no está vigente. Elige otra.');
      expect(next().disabled).toBe(true);
      button(/Seleccionar otra/)!.click();
      await tick();
      expect(store.data().organization).toBeNull();
      expect(text()).not.toContain('ya no está vigente');
    });
  });

  // ------------------------------------------------------------------ SCR-015-06
  describe('SCR-015-06 Jefe directo', () => {
    it('sin selección: «Ningún colaborador seleccionado», nota de vigencia y Siguiente deshabilitado', async () => {
      await setup();
      store.setType('Employee');
      store.patch({ organization: unit });
      store.goToStep('jefe');
      await tick();
      expect(text()).toContain('Ningún colaborador seleccionado');
      expect(text()).toContain('Solo colaboradores vigentes pueden ser jefe directo.');
      expect(next().disabled).toBe(true);
    });

    it('Siguiente con un jefe vigente avanza a Rol-Nivel inicial', async () => {
      await setup();
      await goTo('jefe');
      next().click();
      await tick();
      expect(api.getParty).toHaveBeenCalledWith('m-1');
      expect(q('#rc-step-title')?.textContent).toContain('Rol-Nivel inicial');
    });

    it('E7: si al avanzar el jefe ya no está vigente se queda en el paso, avisa y permite elegir otro', async () => {
      await setup({ getParty: vi.fn(() => of({ id: 'm-1', status: 'inactive' })) });
      await goTo('jefe');
      next().click();
      await tick();
      expect(q('#rc-step-title')?.textContent).toContain('Jefe directo');
      expect(text()).toContain('El jefe directo ya no está vigente. Elige otro.');
      button(/Seleccionar otra/)!.click();
      await tick();
      expect(store.data().manager).toBeNull();
      expect(text()).toContain('Ningún colaborador seleccionado');
    });
  });

  // ------------------------------------------------------------------ SCR-015-07
  describe('SCR-015-07 Rol-Nivel inicial', () => {
    it('E4: sin roles vigentes muestra el catálogo no configurado y «Crear catálogo» deshabilitado', async () => {
      await setup({ roles: vi.fn(() => of([])) });
      await goTo('rol');
      expect(text()).toContain('No hay roles vigentes en el catálogo. Crea el catálogo primero (US-001).');
      expect(button(/Crear catálogo/)!.disabled).toBe(true);
    });

    it('el nivel está deshabilitado hasta elegir un rol y luego solo ofrece niveles con requisitos de evidencia', async () => {
      await setup();
      store.setType('Employee');
      store.goToStep('rol');
      await tick();
      expect(q<HTMLSelectElement>('#rc-nivel')!.disabled).toBe(true);
      expect(text()).toContain('Se habilitará tras definir el rol.');
      const rolSel = q<HTMLSelectElement>('#rc-rol')!;
      rolSel.value = 'r-1';
      rolSel.dispatchEvent(new Event('change'));
      await tick();
      const levels = [...q<HTMLSelectElement>('#rc-nivel')!.options].map((o) => o.textContent?.trim());
      expect(levels).toContain('Nivel 1');
      expect(levels).toContain('Nivel 2');
      expect(levels).not.toContain('Nivel sin requisitos');
      expect(levels).not.toContain('Nivel con requisitos no utilizable');
      expect(q<HTMLSelectElement>('#rc-nivel')!.disabled).toBe(false);
    });

    it('elegir un nivel (no solo el primero) lo confirma con su número de requisitos y habilita Siguiente', async () => {
      await setup();
      store.setType('Employee');
      store.goToStep('rol');
      await tick();
      const rolSel = q<HTMLSelectElement>('#rc-rol')!;
      rolSel.value = 'r-1';
      rolSel.dispatchEvent(new Event('change'));
      await tick();
      const lvl = q<HTMLSelectElement>('#rc-nivel')!;
      lvl.value = 'l-2';
      lvl.dispatchEvent(new Event('change'));
      await tick();
      expect(text()).toContain('Requisitos de Nivel 2 confirmados');
      expect(text()).toContain('2 requisitos de evidencia configurados');
      expect(store.data().levelId).toBe('l-2');
      expect(next().disabled).toBe(false);
    });

    it('E8: un rol sin ningún nivel con requisitos muestra el error y «Seleccionar otra» reinicia el rol', async () => {
      const bare: RoleOption = { id: 'r-2', label: 'QA', levels: [{ id: 'q-1', label: 'Nivel 1', evidenceCount: 0, usable: false }] };
      await setup({ roles: vi.fn(() => of([bare])) });
      store.setType('Employee');
      store.goToStep('rol');
      await tick();
      const rolSel = q<HTMLSelectElement>('#rc-rol')!;
      rolSel.value = 'r-2';
      rolSel.dispatchEvent(new Event('change'));
      await tick();
      expect(text()).toContain('El rol o nivel no es válido. Asegúrate de que existe en el catálogo vigente.');
      expect(next().disabled).toBe(true);
      button(/Seleccionar otra/)!.click();
      await tick();
      expect(store.data().role).toBeNull();
    });

    it('«Vigente desde» parte en la fecha de hoy y vaciarla bloquea Siguiente con «Requerido»', async () => {
      await setup();
      await goTo('rol');
      expect(q<HTMLInputElement>('#rc-desde')!.value).toBe(todayIso());
      const date = q<HTMLInputElement>('#rc-desde')!;
      date.value = '';
      date.dispatchEvent(new Event('change')); // gf-date-input emite en «change», no en «input»
      await tick();
      await blur('#rc-desde');
      expect(q('#rc-desde-msg')?.textContent).toContain('Requerido');
      expect(next().disabled).toBe(true);
    });
  });

  // ------------------------------------------------------------------ SCR-015-08 / 09
  describe('SCR-015-08 Revisar y confirmar', () => {
    it('resume los datos capturados y, para el contratista, no muestra «Jefe directo»', async () => {
      await setup();
      await goTo('revisar', 'Contractor');
      const t = text();
      expect(t).toContain('Revisa los datos antes de registrar:');
      expect(t).toContain('Contratista');
      expect(t).toContain('Carlos Mendoza');
      expect(t).toContain('87654321');
      expect(t).toContain('carlos@comsatel.com.pe');
      expect(t).toContain('Seguridad Sur');
      expect(t).toContain('Developer');
      expect(t).not.toContain('Jefe directo');
      expect(t).toContain(`Vigente desde: ${todayIso().split('-').reverse().join('/')}`);
    });

    it('«Editar» de una sección vuelve a ese paso conservando los datos', async () => {
      await setup();
      await goTo('revisar');
      button(/Editar Correo laboral/)!.click();
      await tick();
      expect(q('#rc-step-title')?.textContent).toContain('Correo laboral');
      expect(q<HTMLInputElement>('#rc-correo')!.value).toBe('carlos@comsatel.com.pe');
    });

    it('Guardar envía el cuerpo del servicio una sola vez y muestra la confirmación con el código', async () => {
      await setup();
      await goTo('revisar');
      button(/Guardar/)!.click();
      await tick();
      expect(api.create).toHaveBeenCalledTimes(1);
      expect(api.create.mock.calls[0][0]).toMatchObject({
        first_names: 'Carlos',
        identification_number: '87654321',
        email_work: 'carlos@comsatel.com.pe',
        party_type: 'Employee',
      });
      expect(text()).toContain('¡Colaborador registrado!');
      expect(q<HTMLInputElement>('#rc-code')!.value).toBe('a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d');
      expect(q<HTMLInputElement>('#rc-code')!.readOnly).toBe(true);
      expect(q('#rc-exito')?.getAttribute('role')).toBe('status');
      for (const label of [/Registrar otro colaborador/, /Volver a la lista/, /Ir al dashboard/]) expect(button(label)).toBeTruthy();
    });

    it('«Copiar» escribe el código en el portapapeles y lo confirma con «Copiado»', async () => {
      const writeText = vi.fn(() => Promise.resolve());
      Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
      await setup();
      await goTo('revisar');
      button(/Guardar/)!.click();
      await tick();
      button(/Copiar/)!.click();
      await tick();
      expect(writeText).toHaveBeenCalledWith('a3b2c5d4-e7f1-4a2b-8c3d-9e4f5a6b7c8d');
      expect(button(/Copiado/)).toBeTruthy();
    });

    it('«Registrar otro colaborador» vuelve al primer paso con el formulario limpio', async () => {
      await setup();
      await goTo('revisar');
      button(/Guardar/)!.click();
      await tick();
      button(/Registrar otro colaborador/)!.click();
      await tick();
      expect(store.step()).toBe('tipo');
      expect(store.data().firstNames).toBe('');
      expect(store.data().type).toBeNull();
      expect(q('#rc-tipo-question')).toBeTruthy();
    });

    it('«Volver a la lista» y «Ir al dashboard» navegan a sus rutas', async () => {
      await setup();
      await goTo('revisar');
      button(/Guardar/)!.click();
      await tick();
      button(/Volver a la lista/)!.click();
      button(/Ir al dashboard/)!.click();
      expect(navigateByUrl).toHaveBeenNthCalledWith(1, '/colaboradores');
      expect(navigateByUrl).toHaveBeenNthCalledWith(2, '/');
    });

    it('E10: un error del servicio muestra el banner con el código de seguimiento y permite reintentar', async () => {
      const err = new HttpErrorResponse({ status: 500, error: { error: { code: 'INTERNAL', request_id: 'req-123' } } });
      const create = vi.fn().mockReturnValueOnce(throwError(() => err)).mockReturnValue(of({ id: 'n', code: 'ok-code' }));
      await setup({ create });
      await goTo('revisar');
      button(/Guardar/)!.click();
      await tick();
      expect(text()).toContain('No fue posible completar el registro');
      expect(text()).toContain('Hubo un problema al registrar. Por favor intenta nuevamente.');
      expect(text()).toContain('Código: req-123');
      expect(button(/Guardar bloqueado/)!.disabled).toBe(true);
      button(/Reintentar/)!.click();
      await tick();
      expect(create).toHaveBeenCalledTimes(2);
      expect(text()).toContain('¡Colaborador registrado!');
    });

    it('E1: sin permisos reemplaza el formulario por «Sin permisos» y «Volver» regresa a la lista', async () => {
      await setup({ create: vi.fn(() => throwError(() => new HttpErrorResponse({ status: 403 }))) });
      await goTo('revisar');
      button(/Guardar/)!.click();
      await tick();
      expect(text()).toContain('Sin permisos');
      expect(text()).toContain('No tienes permiso para registrar colaboradores. Solo el Jefe de Ingeniería puede hacerlo.');
      expect(q('form')).toBeNull();
      button(/^\s*Volver\s*$/)!.click();
      expect(navigateByUrl).toHaveBeenCalledWith('/colaboradores');
    });

    it('E5 al guardar: vuelve a Identificación con el mensaje de duplicado y conserva los demás datos', async () => {
      const err = new HttpErrorResponse({ status: 409, error: { error: { code: 'IDENTIFICATION_DUPLICATE' } } });
      await setup({ create: vi.fn(() => throwError(() => err)) });
      await goTo('revisar');
      button(/Guardar/)!.click();
      await tick();
      expect(q('#rc-step-title')?.textContent).toContain('Identificación');
      expect(text()).toContain('La identificación DNI 87654321 (Perú) ya está registrada.');
      expect(store.data().email).toBe('carlos@comsatel.com.pe');
    });
  });
});
