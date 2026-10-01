/** Formato estándar de error hacia el portal (API-SPEC-001 §4.2). */
export type ApiErrorCode =
  | 'AUTHENTICATION_FAILED'
  | 'AUTHORIZATION_FAILED'
  | 'CSRF_FAILED'
  | 'RESOURCE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'UPSTREAM_UNAVAILABLE'
  | 'UPSTREAM_AUTH_FAILED'
  | 'INTERNAL_SERVER_ERROR';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode | string,
    message: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }

  toBody(requestId?: string) {
    return {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
        timestamp: new Date().toISOString(),
        request_id: requestId,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}

export const unauthenticated = () =>
  new ApiError(401, 'AUTHENTICATION_FAILED', 'Tu sesión no es válida o venció.');
export const forbidden = () =>
  new ApiError(403, 'AUTHORIZATION_FAILED', 'No tienes permiso para realizar esta acción.');
