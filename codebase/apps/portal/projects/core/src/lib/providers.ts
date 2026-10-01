import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { APP_CONFIG, AppConfig, DEFAULT_APP_CONFIG } from './config/app-config';
import { requestIdInterceptor, sessionExpiryInterceptor } from './http/interceptors';

/**
 * Providers comunes para el shell y para cada microUI cuando corre standalone.
 * CSRF: el BFF emite la cookie legible XSRF-TOKEN y valida el header X-XSRF-TOKEN
 * (double-submit), necesario porque la sesión viaja en una cookie.
 */
export function provideGfCore(config: Partial<AppConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: APP_CONFIG, useValue: { ...DEFAULT_APP_CONFIG, ...config } },
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }),
      withInterceptors([requestIdInterceptor, sessionExpiryInterceptor]),
    ),
  ]);
}
