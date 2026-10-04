import { ApiError } from '../shared/api-error.js';
import type { ServiceTokenProvider } from './service-token.js';

export interface DownstreamCall {
  method?: string;
  path: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
  /** Usuario final, para auditoría en el microservicio (ADR-005 §2: X-User-Name). */
  userName: string;
  /** Roles de realm del usuario final (X-User-Roles), para RBAC y visibilidad en el servicio. */
  userRoles: readonly string[];
  requestId: string;
  /** `If-Match` del navegador (concurrencia optimista, LDM-002 CM-09): se reenvía tal cual. */
  ifMatch?: string;
}

export interface DownstreamResponse {
  status: number;
  body: unknown;
  /** Solo las cabeceras que el portal necesita ver (PASSTHROUGH_HEADERS). */
  headers: Record<string, string>;
}

/**
 * Cabeceras del microservicio que el BFF reenvía al navegador: el límite de solicitudes
 * por usuario (API-SPEC-001 §4.5) lo aplica el servicio, y el portal necesita Retry-After
 * para el 429. ETag lleva la versión de fila de un rol, que el portal devuelve en If-Match al editar. Las demás cabeceras no se reenvían.
 */
export const PASSTHROUGH_HEADERS = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'retry-after', 'etag'] as const;

export type FetchLike = typeof fetch;

/**
 * Cliente HTTP hacia un microservicio de dominio.
 * - Authorization: Bearer <token de la cuenta de servicio del BFF>; el token del usuario no se reenvía.
 * - X-User-Name y X-Request-ID para auditoría y trazabilidad; X-User-Roles para que el dueño
 *   de los datos aplique RBAC y visibilidad (extensión de ADR-005 propuesta en ARCHITECTURE.md, D-07).
 * - Timeout y traducción de fallas de red a 503 UPSTREAM_UNAVAILABLE.
 */
export class ServiceClient {
  constructor(
    readonly name: string,
    private readonly baseUrl: string,
    private readonly tokens: ServiceTokenProvider,
    private readonly timeoutMs: number,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  async call(c: DownstreamCall): Promise<DownstreamResponse> {
    const url = new URL(c.path, this.baseUrl);
    for (const [k, v] of Object.entries(c.query ?? {})) if (v !== undefined && v !== '') url.searchParams.set(k, v);

    let res: Response;
    try {
      res = await this.fetchImpl(url, {
        method: c.method ?? 'GET',
        headers: {
          Authorization: `Bearer ${await this.tokens.get()}`,
          'X-User-Name': c.userName,
          'X-User-Roles': c.userRoles.join(','),
          'X-Request-ID': c.requestId,
          Accept: 'application/json',
          ...(c.ifMatch ? { 'If-Match': c.ifMatch } : {}),
          ...(c.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: c.body !== undefined ? JSON.stringify(c.body) : undefined,
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch {
      throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'El servicio no está disponible en este momento.', {
        service: this.name,
      });
    }
    // Un 401 del microservicio significa que rechazó la credencial del BFF (cuenta de servicio),
    // no que venció la sesión del usuario. Se traduce a 502 para que el portal no muestre
    // "Sesión vencida" ni fuerce un nuevo login. Los 403 sí se reenvían: son decisiones de
    // autorización del dueño de los datos sobre X-User-Name.
    if (res.status === 401) {
      throw new ApiError(502, 'UPSTREAM_AUTH_FAILED', 'El servicio rechazó la credencial de la plataforma.', {
        service: this.name,
      });
    }
    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Respuesta inválida del servicio.', status: 502 } };
      }
    }
    const headers: Record<string, string> = {};
    for (const name of PASSTHROUGH_HEADERS) {
      const value = res.headers.get(name);
      if (value !== null) headers[name] = value;
    }
    return { status: res.status, body, headers };
  }
}
