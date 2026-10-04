import { Routes } from '@angular/router';

/**
 * Rutas expuestas por el microUI de Catálogo (US-001, UXR-001).
 * El shell las monta bajo /catalogo. Paths relativos: el microUI no conoce su prefijo.
 */
export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/role-list/role-list.page').then((m) => m.RoleListPage),
    title: 'Catálogo de roles',
  },
  {
    path: 'roles/nuevo',
    loadComponent: () => import('./pages/role-form/role-form.page').then((m) => m.RoleFormPage),
    title: 'Crear rol',
  },
  {
    path: 'roles/:roleId',
    loadComponent: () => import('./pages/role-form/role-form.page').then((m) => m.RoleFormPage),
    title: 'Rol',
  },
];
