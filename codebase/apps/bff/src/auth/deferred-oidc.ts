import type { OidcPort } from './oidc.js';
import { ApiError } from '../shared/api-error.js';

/**
 * OidcPort que se resuelve después de arrancar. Permite que el BFF escuche de inmediato
 * (health/live, diagnóstico en health/ready) mientras reintenta el discovery de Keycloak,
 * en lugar de quedarse colgado antes de abrir el puerto.
 */
export class DeferredOidc {
  private impl?: OidcPort;
  lastError?: string;

  get ready(): boolean {
    return !!this.impl;
  }

  resolve(impl: OidcPort): void {
    this.impl = impl;
    this.lastError = undefined;
  }

  private get(): OidcPort {
    if (!this.impl) {
      throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'La plataforma está iniciando. Intenta en unos segundos.', {
        service: 'keycloak',
      });
    }
    return this.impl;
  }

  readonly port: OidcPort = {
    startLogin: () => this.get().startLogin(),
    completeLogin: (u, v, s) => this.get().completeLogin(u, v, s),
    refresh: (rt) => this.get().refresh(rt),
    serviceToken: () => this.get().serviceToken(),
    logoutUrl: (id, post) => this.get().logoutUrl(id, post),
  };
}
