import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AppRole } from './roles';
import { SessionService } from './session.service';

/** Exige sesión. Sin sesión, inicia el login en el BFF conservando la ruta pedida. */
export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);
  if (session.isAuthenticated()) return true;
  return session.load().pipe(
    map((s) => {
      if (s) return true;
      if (session.status() === 'expired') return router.parseUrl('/sesion-vencida');
      session.login(state.url);
      return false;
    }),
  );
};

/**
 * Exige al menos uno de los roles. La UI solo oculta: la autorización real la aplica el BFF
 * (ACP-002 TCON-002). Sin el rol, muestra el estado "Sin permiso" (UXR-000.4).
 *
 * Ojo: Angular evalúa `canMatch` ANTES que el `canActivate` del padre, así que en un enlace
 * directo (p. ej. /catalogo recién abierto) la sesión puede no estar cargada todavía.
 * Por eso el guard la carga si hace falta y, sin sesión, deja que authGuard inicie el login.
 */
export const roleGuard =
  (...roles: AppRole[]): CanMatchFn & CanActivateFn =>
  () => {
    const session = inject(SessionService);
    const router = inject(Router);
    const decide = () => {
      if (!session.isAuthenticated()) return true; // authGuard del padre se encarga
      return session.hasAnyRole(roles) ? true : router.parseUrl('/sin-permiso');
    };
    if (session.status() !== 'unknown') return decide();
    return session.load().pipe(map(decide));
  };
