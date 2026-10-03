import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import {
  RoleOption,
  buildCreateBody,
  describedBy,
  emptyData,
  isStepValid,
  mapSubmitError,
  stepErrors,
  stepsFor,
  validateEmail,
  validateIdNumber,
  validateName,
} from './register-collaborator.rules';

const role: RoleOption = {
  id: 'r1',
  label: 'Developer',
  levels: [
    { id: 'l1', label: 'Nivel 1', evidenceCount: 0 },
    { id: 'l2', label: 'Nivel 2', evidenceCount: 4 },
  ],
};

const CTX = { emailCheck: 'idle', idConflict: false, managerStale: false, organizationStale: false } as const;

function filled() {
  return {
    ...emptyData('2026-10-02'),
    type: 'Employee' as const,
    firstNames: ' Carlos ',
    lastNames: 'Mendoza',
    idNumber: '87654321',
    email: 'carlos@comsatel.com.pe',
    organization: { id: 'u1', label: 'Ingeniería' },
    manager: { id: 'm1', label: 'Marina' },
    role,
    levelId: 'l2',
  };
}

describe('flujo por tipo', () => {
  it('Empleado tiene paso Jefe directo; Contratista no', () => {
    expect(stepsFor('Employee')).toContain('jefe');
    expect(stepsFor('Contractor')).not.toContain('jefe');
    expect(stepsFor('Employee').at(-1)).toBe('revisar');
    expect(stepsFor('Contractor')).toHaveLength(7);
    expect(stepsFor('Employee')).toHaveLength(8);
  });
});

describe('validadores de campo', () => {
  it('nombre obligatorio', () => {
    expect(validateName('  ')).toBe('Requerido');
    expect(validateName('Ana')).toBeNull();
    expect(validateName('x'.repeat(101))).toBe('Máximo 100 caracteres');
  });
  it('DNI: 8 dígitos; CE/Pasaporte: 5-20 alfanumérico', () => {
    expect(validateIdNumber('DNI', '1234567')).toMatch(/8 dígitos/);
    expect(validateIdNumber('DNI', '12345678')).toBeNull();
    expect(validateIdNumber('CE', 'AB-1')).toMatch(/5 a 20/);
    expect(validateIdNumber('Passport', 'AB1234567')).toBeNull();
    expect(validateIdNumber('DNI', '')).toBe('Requerido');
  });
  it('correo', () => {
    expect(validateEmail('juan@')).toBe('Ingresa un correo válido');
    expect(validateEmail('@comsatel.com.pe')).toBe('Ingresa un correo válido');
    expect(validateEmail('juan@comsatel.com.pe')).toBeNull();
  });
  it('describedBy une ids existentes', () => {
    expect(describedBy('f', true, true, 'x')).toBe('f-hint f-msg x');
    expect(describedBy('f', false, false)).toBe('');
  });
});

describe('validación por paso', () => {
  it('tipo exige selección', () => {
    expect(isStepValid('tipo', emptyData())).toBe(false);
    expect(isStepValid('tipo', { ...emptyData(), type: 'Contractor' })).toBe(true);
  });
  it('correo duplicado o validando bloquea', () => {
    const d = filled();
    expect(isStepValid('correo', d, { ...CTX, emailCheck: 'valid' })).toBe(true);
    expect(stepErrors('correo', d, { ...CTX, emailCheck: 'duplicate' })['email']).toBe('duplicate');
    expect(isStepValid('correo', d, { ...CTX, emailCheck: 'validating' })).toBe(false);
  });
  it('conflicto de identificación (E5) bloquea hasta editar', () => {
    expect(isStepValid('identificacion', filled(), { ...CTX, idConflict: true })).toBe(false);
  });
  it('rol: nivel sin requisitos de evidencia no es válido (E8)', () => {
    expect(stepErrors('rol', { ...filled(), levelId: 'l1' })['level']).toBe('invalid');
    expect(isStepValid('rol', filled())).toBe(true);
    expect(stepErrors('rol', { ...filled(), levelId: '' })['level']).toBe('Requerido');
  });
  it('jefe vencido (E7) bloquea', () => {
    expect(stepErrors('jefe', filled(), { ...CTX, managerStale: true })['manager']).toBe('stale');
  });
  it('revisar solo es válido con todos los pasos completos; el contratista no exige jefe', () => {
    expect(isStepValid('revisar', filled())).toBe(true);
    expect(isStepValid('revisar', { ...filled(), organization: null })).toBe(false);
    expect(isStepValid('revisar', { ...filled(), type: 'Contractor', manager: null })).toBe(true);
  });
});

describe('payload', () => {
  it('mapea exactamente a PartyCreateRequest (sin campos extra)', () => {
    expect(buildCreateBody(filled())).toEqual({
      first_names: 'Carlos',
      last_names: 'Mendoza',
      identification_type: 'DNI',
      identification_number: '87654321',
      identification_country: 'PE',
      email_work: 'carlos@comsatel.com.pe',
      party_type: 'Employee',
    });
  });
  it('incluye nombre preferido solo si existe', () => {
    expect(buildCreateBody({ ...filled(), preferredName: ' Charlie ' }).preferred_name).toBe('Charlie');
  });
});

describe('mapeo de errores del servicio (E1, E5, E6, E9, E10, E11)', () => {
  const d = { idType: 'DNI' as const, idNumber: '12345678', idCountry: 'PE', email: 'juan.perez@comsatel.com.pe' };
  const http = (status: number, code?: string, requestId?: string) =>
    new HttpErrorResponse({
      status,
      headers: new HttpHeaders(),
      error: code ? { error: { code, request_id: requestId } } : null,
    });

  it('409 identificación → E5 con mensaje y paso', () => {
    expect(mapSubmitError(http(409, 'IDENTIFICATION_DUPLICATE'), d)).toMatchObject({
      kind: 'E5',
      step: 'identificacion',
      message: 'La identificación DNI 12345678 (Perú) ya está registrada.',
    });
  });
  it('409 correo → E6', () => {
    expect(mapSubmitError(http(409, 'EMAIL_DUPLICATE'), d)).toMatchObject({
      kind: 'E6',
      step: 'correo',
      message: 'El correo juan.perez@comsatel.com.pe ya está en uso por otro colaborador vigente.',
    });
  });
  it('403 → E1, 401 → E11, 400 → E9', () => {
    expect(mapSubmitError(http(403), d).kind).toBe('E1');
    expect(mapSubmitError(http(401), d).kind).toBe('E11');
    expect(mapSubmitError(http(400, 'VALIDATION_ERROR'), d).kind).toBe('E9');
  });
  it('500 → E10 con código de seguimiento', () => {
    expect(mapSubmitError(http(500, 'INTERNAL_SERVER_ERROR', 'req-1'), d)).toMatchObject({
      kind: 'E10',
      code: 'req-1',
      message: 'Hubo un problema al registrar. Por favor intenta nuevamente.',
    });
  });
});
