import { Routes } from '@angular/router';

/**
 * Rutas expuestas por el microUI de Colaboradores (data maestra de Party,
 * US-015 a US-025, RCP-003). El shell las monta bajo /colaboradores.
 */
export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/party-list/party-list.page').then((m) => m.PartyListPage),
    title: 'Colaboradores',
  },
  {
    path: ':partyId',
    loadComponent: () =>
      import('./pages/party-detail/party-detail.page').then((m) => m.PartyDetailPage),
    title: 'Ficha del colaborador',
  },
];
