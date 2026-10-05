import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { parseUnitError } from './unit-errors';

const err = (status: number, code?: string, details?: Record<string, unknown>) =>
  new HttpErrorResponse({ status, error: code ? { error: { code, message: 'm', status, timestamp: 't', details } } : null });

describe('parseUnitError (errores reales del servicio de unidades)', () => {
  it.each([
    [409, 'ORGANIZATION_DUPLICATE', 'duplicate'],
    [409, 'PARENT_INACTIVE', 'parent-inactive'],
    [409, 'ORGANIZATION_CYCLE', 'cycle'],
    [409, 'ORGANIZATION_INACTIVE', 'inactive'],
    [409, 'ORGANIZATION_HAS_DEPENDENCIES', 'dependencies'],
    [409, 'ORGANIZATION_ALREADY_INACTIVE', 'already-inactive'],
    [409, 'ORGANIZATION_ALREADY_ACTIVE', 'already-active'],
    [412, 'PRECONDITION_FAILED', 'stale'],
    [400, 'VALIDATION_ERROR', 'validation'],
    [404, 'RESOURCE_NOT_FOUND', 'not-found'],
  ])('%i %s → %s', (status, code, kind) => {
    expect(parseUnitError(err(status, code)).kind).toBe(kind);
  });

  it('403 sin cuerpo → forbidden; 500 o red → unknown', () => {
    expect(parseUnitError(err(403)).kind).toBe('forbidden');
    expect(parseUnitError(err(500)).kind).toBe('unknown');
    expect(parseUnitError(new Error('x')).kind).toBe('unknown');
  });

  it('conserva details (conteos, padre) y aplana los mensajes por campo', () => {
    expect(parseUnitError(err(409, 'ORGANIZATION_HAS_DEPENDENCIES', { active_children_count: 3, current_people_count: 12 })).details).toEqual({ active_children_count: 3, current_people_count: 12 });
    expect(parseUnitError(err(400, 'VALIDATION_ERROR', { fields: [{ field: 'from_date', message: 'no futura' }] })).fields).toEqual({ from_date: 'no futura' });
    expect(parseUnitError(err(409, 'PARENT_INACTIVE', { parent_id: 'p', parent_name: 'Ventas' })).details).toMatchObject({ parent_name: 'Ventas' });
  });
});
