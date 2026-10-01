/** Formato estándar de error de la API (API-SPEC-001 §4.2). */
export interface ApiErrorBody {
  error: {
    code: ApiErrorCode | string;
    message: string;
    status: number;
    timestamp: string;
    request_id?: string;
    details?: Record<string, unknown>;
  };
}

export type ApiErrorCode =
  | 'AUTHENTICATION_FAILED'
  | 'AUTHORIZATION_FAILED'
  | 'RESOURCE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'EMAIL_DUPLICATE'
  | 'IDENTIFICATION_DUPLICATE'
  | 'UPSTREAM_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR';

/** Respuesta paginada estándar (API-SPEC-001 §4.1). */
export interface Page<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  filters_applied?: Record<string, unknown>;
}

export interface PageQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [filter: string]: string | number | undefined;
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return !!value && typeof value === 'object' && 'error' in value;
}
