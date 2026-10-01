import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError, toArray } from 'rxjs';
import { toViewState } from './view-state';

describe('toViewState', () => {
  it('emite loading y luego success con datos', async () => {
    const states = await firstValueFrom(toViewState(of([1, 2])).pipe(toArray()));
    expect(states).toEqual([{ kind: 'loading' }, { kind: 'success', data: [1, 2] }]);
  });

  it('trata una página sin filas como vacío', async () => {
    const states = await firstValueFrom(toViewState(of({ data: [] })).pipe(toArray()));
    expect(states.at(-1)).toEqual({ kind: 'empty' });
  });

  it('mapea 403 a "sin permiso" sin exponer datos', async () => {
    const err = new HttpErrorResponse({ status: 403 });
    const states = await firstValueFrom(toViewState(throwError(() => err)).pipe(toArray()));
    expect(states.at(-1)).toEqual({ kind: 'forbidden' });
  });

  it('usa el mensaje de negocio del formato de error estándar', async () => {
    const err = new HttpErrorResponse({
      status: 409,
      error: { error: { code: 'EMAIL_DUPLICATE', message: 'El correo ya existe', status: 409, timestamp: '', request_id: 'req-1' } },
    });
    const states = await firstValueFrom(toViewState(throwError(() => err)).pipe(toArray()));
    expect(states.at(-1)).toEqual({ kind: 'error', message: 'El correo ya existe', requestId: 'req-1' });
  });

  it('no supone la causa en errores desconocidos', async () => {
    const states = await firstValueFrom(toViewState(throwError(() => new Error('x'))).pipe(toArray()));
    expect(states.at(-1)).toEqual({ kind: 'error', message: 'No pudimos cargar la información.' });
  });
});
