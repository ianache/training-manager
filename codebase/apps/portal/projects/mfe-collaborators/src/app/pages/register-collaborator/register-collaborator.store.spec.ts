import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Subject, of, throwError } from 'rxjs';
import { RegisterCollaboratorApi } from './register-collaborator.api';
import { EMAIL_DEBOUNCE_MS, RegisterWizardStore } from './register-collaborator.store';
import { RoleOption } from './register-collaborator.rules';

const role: RoleOption = { id: 'r', label: 'Developer', levels: [{ id: 'l', label: 'Nivel 2', evidenceCount: 3 }] };

describe('RegisterWizardStore', () => {
  let api: {
    emailInUse: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    getParty: ReturnType<typeof vi.fn>;
  };
  let store: RegisterWizardStore;

  beforeEach(() => {
    vi.useFakeTimers();
    api = { emailInUse: vi.fn(() => of(false)), create: vi.fn(), getParty: vi.fn() };
    TestBed.configureTestingModule({
      providers: [RegisterWizardStore, { provide: RegisterCollaboratorApi, useValue: api }],
    });
    store = TestBed.inject(RegisterWizardStore);
  });
  afterEach(() => vi.useRealTimers());

  function fillEmployee() {
    store.setType('Employee');
    store.patch({
      firstNames: 'Carlos',
      lastNames: 'Mendoza',
      idNumber: '87654321',
      organization: { id: 'u', label: 'Ingeniería' },
      manager: { id: 'm', label: 'Marina' },
      role,
      levelId: 'l',
    });
    store.setEmail('carlos@comsatel.com.pe');
    vi.advanceTimersByTime(EMAIL_DEBOUNCE_MS + 1);
  }

  it('no avanza del primer paso sin elegir tipo y avanza al elegirlo', () => {
    expect(store.step()).toBe('tipo');
    store.next();
    expect(store.step()).toBe('tipo');
    store.setType('Contractor');
    store.next();
    expect(store.step()).toBe('datos');
  });

  it('el contratista salta Jefe directo', () => {
    store.setType('Contractor');
    expect(store.steps()).not.toContain('jefe');
    store.setType('Employee');
    expect(store.steps()).toContain('jefe');
  });

  it('cambiar de tipo descarta la selección de unidad/proveedor y jefe', () => {
    store.setType('Employee');
    store.patch({ organization: { id: 'u', label: 'U' }, manager: { id: 'm', label: 'M' } });
    store.setType('Contractor');
    expect(store.data().organization).toBeNull();
    expect(store.data().manager).toBeNull();
  });

  it('Atrás conserva los datos', () => {
    store.setType('Employee');
    store.next();
    store.patch({ firstNames: 'Ana' });
    store.back();
    store.next();
    expect(store.data().firstNames).toBe('Ana');
  });

  it('correo: debounce de 300 ms y una sola consulta con el valor final', () => {
    store.setEmail('a@b.co');
    store.setEmail('ab@b.co');
    store.setEmail('abc@b.co');
    expect(store.emailCheck()).toBe('validating');
    vi.advanceTimersByTime(EMAIL_DEBOUNCE_MS - 10);
    expect(api.emailInUse).not.toHaveBeenCalled();
    vi.advanceTimersByTime(20);
    expect(api.emailInUse).toHaveBeenCalledTimes(1);
    expect(api.emailInUse).toHaveBeenCalledWith('abc@b.co');
    expect(store.emailCheck()).toBe('valid');
  });

  it('correo duplicado → estado duplicate y el paso no avanza (E6)', () => {
    api.emailInUse.mockReturnValue(of(true));
    store.setEmail('juan@comsatel.com.pe');
    vi.advanceTimersByTime(EMAIL_DEBOUNCE_MS + 1);
    expect(store.emailCheck()).toBe('duplicate');
    store.setType('Employee');
    store.goToStep('correo');
    expect(store.canAdvance()).toBe(false);
  });

  it('correo con formato inválido no consulta al servicio', () => {
    store.setEmail('juan@');
    vi.advanceTimersByTime(1000);
    expect(api.emailInUse).not.toHaveBeenCalled();
    expect(store.emailCheck()).toBe('idle');
  });

  it('falla de la consulta de correo → unknown (no bloquea)', () => {
    api.emailInUse.mockReturnValue(throwError(() => new Error('x')));
    store.setEmail('juan@comsatel.com.pe');
    vi.advanceTimersByTime(EMAIL_DEBOUNCE_MS + 1);
    expect(store.emailCheck()).toBe('unknown');
  });

  it('no se muestra error de un campo hasta tocarlo', () => {
    store.setType('Employee');
    store.next();
    expect(store.fieldError('firstNames')).toBe('');
    store.touch('firstNames');
    expect(store.fieldError('firstNames')).toBe('Requerido');
  });

  it('jefe vigente avanza; jefe no vigente marca E7 y no avanza', () => {
    store.setType('Employee');
    store.patch({ manager: { id: 'm', label: 'M' } });
    store.goToStep('jefe');
    api.getParty.mockReturnValueOnce(of({ status: 'inactive' }));
    store.next();
    expect(store.managerStale()).toBe(true);
    expect(store.step()).toBe('jefe');
    store.patch({ manager: { id: 'm2', label: 'M2' } });
    expect(store.managerStale()).toBe(false);
    api.getParty.mockReturnValueOnce(of({ status: 'active' }));
    store.next();
    expect(store.step()).toBe('rol');
  });

  it('guardar con éxito expone el resultado y envía el cuerpo del servicio', () => {
    fillEmployee();
    store.goToStep('revisar');
    api.create.mockReturnValue(of({ id: '1', code: 'EMP-1' }));
    store.submit();
    expect(api.create).toHaveBeenCalledWith(
      expect.objectContaining({ party_type: 'Employee', email_work: 'carlos@comsatel.com.pe' }),
    );
    expect(store.result()?.code).toBe('EMP-1');
    expect(store.submitting()).toBe(false);
  });

  it('409 de identificación vuelve al paso Identificación con E5 y conserva los datos', () => {
    fillEmployee();
    store.goToStep('revisar');
    api.create.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 409, error: { error: { code: 'IDENTIFICATION_DUPLICATE' } } })),
    );
    store.submit();
    expect(store.submitError()?.kind).toBe('E5');
    expect(store.step()).toBe('identificacion');
    expect(store.idConflict()).toBe(true);
    expect(store.canAdvance()).toBe(false);
    expect(store.data().firstNames).toBe('Carlos');
    store.patch({ idNumber: '87654322' });
    expect(store.idConflict()).toBe(false);
    expect(store.canAdvance()).toBe(true);
  });

  it('500 se queda en Revisar con E10, ignora doble clic y permite reintentar', () => {
    fillEmployee();
    store.goToStep('revisar');
    const gate = new Subject<never>();
    api.create.mockReturnValueOnce(gate);
    store.submit();
    expect(store.submitting()).toBe(true);
    store.submit();
    expect(api.create).toHaveBeenCalledTimes(1);
    gate.error(new HttpErrorResponse({ status: 500, error: { error: { code: 'INTERNAL_SERVER_ERROR', request_id: 'abc' } } }));
    expect(store.submitError()).toMatchObject({ kind: 'E10', code: 'abc' });
    expect(store.step()).toBe('revisar');
    api.create.mockReturnValueOnce(of({ id: '1', code: 'X' }));
    store.submit();
    expect(store.result()?.code).toBe('X');
  });

  it('reset deja el formulario limpio para «Registrar otro colaborador»', () => {
    fillEmployee();
    store.goToStep('revisar');
    api.create.mockReturnValue(of({ id: '1', code: 'X' }));
    store.submit();
    store.reset();
    expect(store.result()).toBeNull();
    expect(store.data().firstNames).toBe('');
    expect(store.data().type).toBeNull();
    expect(store.step()).toBe('tipo');
  });
});
