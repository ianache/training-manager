import { Routes } from '@angular/router';

/**
 * Rutas expuestas por el microUI de Colaboradores (data maestra de Party,
 * US-015 a US-025, RCP-003). El shell las monta bajo /colaboradores.
 */
export const ROUTES: Routes = [
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./pages/register-collaborator/register-collaborator.page').then(
        (m) => m.RegisterCollaboratorPage
      ),
    title: 'Registrar colaborador',
  },
  {
    // SCR-028-01 (DTC-028). Las rutas hijas (:unitId/editar, /padre, /desactivar, /reactivar, nueva) son de SCR-029/030, aún sin implementar.
    path: 'unidades',
    loadComponent: () =>
      import('./pages/unit-list/unit-list.page').then((m) => m.UnitListPage),
    title: 'Unidades organizacionales',
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/party-list/party-list.page').then((m) => m.PartyListPage),
    title: 'Colaboradores',
  },
  {
    path: ':partyId/datos/editar',
    loadComponent: () =>
      import('./pages/jefe-datos-edit/jefe-datos-edit.page').then(
        (m) => m.JefeDatosEditPage
      ),
    title: 'Editar datos personales',
  },
  {
    path: ':partyId/contactos/editar',
    loadComponent: () =>
      import('./pages/jefe-contactos-edit/jefe-contactos-edit.page').then(
        (m) => m.JefeContactosEditPage
      ),
    title: 'Editar medios de contacto',
  },
  {
    path: ':partyId/perfiles/editar',
    loadComponent: () =>
      import('./pages/colaborador-perfiles-edit/colaborador-perfiles-edit.page').then(
        (m) => m.ColaboradorPerfilesEditPage
      ),
    title: 'Editar perfiles profesionales',
  },
  {
    path: ':partyId',
    loadComponent: () =>
      import('./pages/party-detail/party-detail.page').then((m) => m.PartyDetailPage),
    title: 'Ficha del colaborador',
  },
];
