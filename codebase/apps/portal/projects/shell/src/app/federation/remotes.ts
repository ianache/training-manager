import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

/**
 * Registro de microUIs. El nombre debe coincidir con la clave de
 * public/federation.manifest.json, que se sustituye por entorno en el despliegue
 * (las URLs no se compilan dentro del shell).
 *
 * Partición actual: por capacidad de negocio (ACP-002 §3.1). Es una decisión abierta de
 * ADR-001; ver ARCHITECTURE.md, Q-01.
 */
export const REMOTES = {
  catalog: 'mfe-catalog',
  collaborators: 'mfe-collaborators',
} as const;

/** Carga las rutas que un microUI expone como './routes'. */
export const loadRemoteRoutes = (remoteName: string) => (): Promise<Routes> =>
  loadRemoteModule(remoteName, './routes').then((m: { ROUTES: Routes }) => m.ROUTES);
