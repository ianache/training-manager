import { Routes } from '@angular/router';
import { AppRole, authGuard, roleGuard } from '@gf/core';
import { ShellLayout } from './layout/shell-layout';
import { REMOTES, loadRemoteRoutes } from './federation/remotes';
import {
  ComingSoonPage,
  ForbiddenPage,
  NotFoundPage,
  RemoteUnavailablePage,
  SessionExpiredPage,
} from './pages/status-pages';

/**
 * Rutas del shell. Cada microUI se monta bajo un prefijo y define sus propias rutas hijas.
 * Rutas públicas (sin sesión): /sesion-vencida.
 */
export const routes: Routes = [
  { path: 'sesion-vencida', component: SessionExpiredPage, title: 'Sesión vencida' },
  {
    path: '',
    component: ShellLayout,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'perfil' },
      { path: 'perfil', component: ComingSoonPage, title: 'Mi perfil de competencias' },
      { path: 'brecha', component: ComingSoonPage, title: 'Mi brecha' },
      {
        path: 'catalogo',
        canMatch: [roleGuard(AppRole.JefeIngenieria)],
        loadChildren: loadRemoteRoutes(REMOTES.catalog),
      },
      {
        path: 'colaboradores',
        canMatch: [roleGuard(AppRole.JefeIngenieria, AppRole.Admin)],
        loadChildren: loadRemoteRoutes(REMOTES.collaborators),
      },
      { path: 'sin-permiso', component: ForbiddenPage, title: 'Sin permiso' },
      { path: 'no-disponible', component: RemoteUnavailablePage, title: 'No disponible' },
      { path: '**', component: NotFoundPage, title: 'No encontrado' },
    ],
  },
];
