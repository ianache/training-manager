import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { SessionService } from '../auth/session.service';

/** Agrega X-Request-ID para trazar una acción del usuario hasta los microservicios. */
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('X-Request-ID')) return next(req);
  return next(req.clone({ setHeaders: { 'X-Request-ID': crypto.randomUUID() } }));
};

/**
 * 401 en la API de negocio → sesión vencida (UXR-000, estado "Sesión vencida").
 * Los 403 NO redirigen: cada vista los muestra como estado "Sin permiso" en su contexto.
 */
export const sessionExpiryInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);
  const session = inject(SessionService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: unknown) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        req.url.startsWith(config.apiBaseUrl)
      ) {
        session.markExpired();
        void router.navigateByUrl('/sesion-vencida');
      }
      return throwError(() => err);
    }),
  );
};
