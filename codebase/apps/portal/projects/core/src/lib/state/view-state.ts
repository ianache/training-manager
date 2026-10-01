import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { isApiErrorBody } from '../http/api-error';

/**
 * Estados obligatorios de toda vista (UXR-000.4). La plantilla decide qué pintar
 * con `<gf-view-state>` de @gf/ui; la vista nunca inventa estados propios.
 */
export type ViewState<T> =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'success'; data: T }
  | { kind: 'forbidden' }
  | { kind: 'error'; message: string; requestId?: string };

export interface ToViewStateOptions<T> {
  isEmpty?: (data: T) => boolean;
}

/** Convierte una llamada HTTP en un flujo de ViewState. */
export function toViewState<T>(
  source: Observable<T>,
  opts: ToViewStateOptions<T> = {},
): Observable<ViewState<T>> {
  const isEmpty = opts.isEmpty ?? defaultIsEmpty;
  return source.pipe(
    map((data): ViewState<T> => (isEmpty(data) ? { kind: 'empty' } : { kind: 'success', data })),
    catchError((err: unknown) => of(errorToViewState<T>(err))),
    startWith<ViewState<T>>({ kind: 'loading' }),
  );
}

export function errorToViewState<T>(err: unknown): ViewState<T> {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 403) return { kind: 'forbidden' };
    if (isApiErrorBody(err.error)) {
      return { kind: 'error', message: err.error.error.message, requestId: err.error.error.request_id };
    }
  }
  // Mensaje genérico: no suponer la causa (hallazgo F-03 de GEN-002).
  return { kind: 'error', message: 'No pudimos cargar la información.' };
}

function defaultIsEmpty(data: unknown): boolean {
  if (Array.isArray(data)) return data.length === 0;
  if (data && typeof data === 'object' && 'data' in data) {
    const inner = (data as { data: unknown }).data;
    return Array.isArray(inner) && inner.length === 0;
  }
  return data === null || data === undefined;
}
