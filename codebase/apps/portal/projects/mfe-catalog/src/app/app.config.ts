import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideGfCore } from '@gf/core';
import { ROUTES } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideGfCore(),
    provideRouter(ROUTES, withComponentInputBinding()),
  ],
};
