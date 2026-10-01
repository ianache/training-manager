import type { OidcPort } from '../auth/oidc.js';

/**
 * Cachea el token client_credentials de la cuenta de servicio del BFF (ADR-005 §2)
 * y lo renueva 30 s antes de vencer. Una sola petición en vuelo a la vez.
 */
export class ServiceTokenProvider {
  private cached?: { accessToken: string; expiresAt: number };
  private inflight?: Promise<string>;

  constructor(private readonly oidc: OidcPort) {}

  async get(): Promise<string> {
    if (this.cached && this.cached.expiresAt - 30_000 > Date.now()) return this.cached.accessToken;
    this.inflight ??= this.oidc
      .serviceToken()
      .then((t) => {
        this.cached = t;
        return t.accessToken;
      })
      .finally(() => (this.inflight = undefined));
    return this.inflight;
  }
}
