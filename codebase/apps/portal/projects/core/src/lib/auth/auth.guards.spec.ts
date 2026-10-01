import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';
import { AppRole } from './roles';
import { roleGuard } from './auth.guards';

describe('roleGuard', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }),
  );

  async function run(roles: string[]) {
    const result = TestBed.runInInjectionContext(() =>
      (roleGuard(AppRole.JefeIngenieria) as () => unknown)(),
    );
    const obs = (isObservable(result) ? result : of(result)) as Observable<unknown>;
    const pending = firstValueFrom(obs);
    TestBed.inject(HttpTestingController)
      .expectOne('/auth/session')
      .flush({ username: 'u', displayName: 'U', email: '', roles, expiresAt: '' });
    return pending;
  }

  it('en un enlace directo carga la sesión antes de decidir (canMatch corre antes que canActivate)', async () => {
    expect(await run(['colaborador', 'jefe_ingenieria'])).toBe(true);
  });

  it('sin el rol redirige a /sin-permiso', async () => {
    const res = await run(['colaborador']);
    expect(res instanceof UrlTree).toBe(true);
    expect(TestBed.inject(Router).serializeUrl(res as UrlTree)).toBe('/sin-permiso');
  });
});
