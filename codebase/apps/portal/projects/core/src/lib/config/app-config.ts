import { InjectionToken } from '@angular/core';

/**
 * Configuración de runtime compartida por el shell y los microUIs.
 * Todas las URLs son relativas al origen del shell: el navegador solo habla con el BFF
 * (ADR-001), y la cookie de sesión HTTP-only viaja sola (ADR-005).
 */
export interface AppConfig {
  /** Prefijo de la API del BFF. */
  apiBaseUrl: string;
  /** Prefijo de los endpoints de autenticación del BFF. */
  authBaseUrl: string;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  apiBaseUrl: '/api/v1',
  authBaseUrl: '/auth',
};

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_APP_CONFIG,
});
