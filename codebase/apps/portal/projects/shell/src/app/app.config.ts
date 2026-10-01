import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  NavigationError,
  Router,
  provideRouter,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from '@angular/router';
import { inject } from '@angular/core';
import { provideGfCore } from '@gf/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideGfCore(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // Si un microUI no carga, el shell sigue vivo y muestra un estado de error (aislamiento).
      withNavigationErrorHandler((e: NavigationError) => {
        console.error('[shell] navegación fallida', e.error);
        return inject(Router).parseUrl('/no-disponible');
      }),
    ),
  ],
};
