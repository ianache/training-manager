import { AppRole } from './roles';

/**
 * Lo único que el navegador sabe de la sesión. Los tokens viven en el BFF y nunca llegan
 * al navegador (ADR-005 §1); el BFF expone esta vista en `GET /auth/session`.
 */
export interface UserSession {
  username: string;
  displayName: string;
  email: string;
  roles: AppRole[];
  /** Instante ISO 8601 en que vence la sesión (30 min deslizantes, ADR-005 §5). */
  expiresAt: string;
}

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous' | 'expired';
