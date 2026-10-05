import { HttpErrorResponse } from '@angular/common/http';

export type UnitErrorKind =
  | 'duplicate'
  | 'parent-inactive'
  | 'cycle'
  | 'inactive'
  | 'stale'
  | 'dependencies'
  | 'already-inactive'
  | 'already-active'
  | 'validation'
  | 'forbidden'
  | 'not-found'
  | 'unknown';

export interface UnitError {
  kind: UnitErrorKind;
  details: Record<string, unknown>;
  /** Mensajes de VALIDATION_ERROR por campo (`details.fields`). */
  fields: Record<string, string>;
}

const BY_CODE: Record<string, UnitErrorKind> = {
  ORGANIZATION_DUPLICATE: 'duplicate',
  PARENT_INACTIVE: 'parent-inactive',
  ORGANIZATION_CYCLE: 'cycle',
  ORGANIZATION_INACTIVE: 'inactive',
  ORGANIZATION_HAS_DEPENDENCIES: 'dependencies',
  ORGANIZATION_ALREADY_INACTIVE: 'already-inactive',
  ORGANIZATION_ALREADY_ACTIVE: 'already-active',
  PRECONDITION_FAILED: 'stale',
  VALIDATION_ERROR: 'validation',
  RESOURCE_NOT_FOUND: 'not-found',
};

/** Clasifica el error del BFF/servicio (formato API-SPEC-001 §4.2) sin reescribir sus códigos. */
export function parseUnitError(err: unknown): UnitError {
  const out: UnitError = { kind: 'unknown', details: {}, fields: {} };
  if (!(err instanceof HttpErrorResponse)) return out;
  const body = (err.error as { error?: { code?: string; details?: Record<string, unknown> } } | null)?.error;
  out.details = body?.details ?? {};
  const fields = out.details['fields'];
  if (Array.isArray(fields)) {
    for (const f of fields as { field?: string; message?: string }[]) if (f.field) out.fields[f.field] = f.message ?? '';
  }
  const byCode = body?.code ? BY_CODE[body.code] : undefined;
  if (byCode) out.kind = byCode;
  else if (err.status === 403) out.kind = 'forbidden';
  else if (err.status === 412) out.kind = 'stale';
  return out;
}
