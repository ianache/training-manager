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
    // SCR-028-01 (DTC-028) y las páginas de gestión que enlaza: SCR-029 (registrar, editar, cambiar padre, historial) y SCR-030 (desactivar, reactivar).
    path: 'unidades',
    loadComponent: () =>
      import('./pages/unit-list/unit-list.page').then((m) => m.UnitListPage),
    title: 'Unidades organizacionales',
  },
  {
    path: 'unidades/nueva',
    loadComponent: () => import('./pages/unit-form/unit-form.page').then((m) => m.UnitFormPage),
    title: 'Registrar unidad',
  },
  {
    path: 'unidades/:unitId/editar',
    loadComponent: () => import('./pages/unit-form/unit-form.page').then((m) => m.UnitFormPage),
    title: 'Editar nombre de la unidad',
  },
  {
    path: 'unidades/:unitId/padre',
    loadComponent: () => import('./pages/unit-parent/unit-parent.page').then((m) => m.UnitParentPage),
    title: 'Cambiar unidad padre',
  },
  {
    path: 'unidades/:unitId/historial',
    loadComponent: () => import('./pages/unit-history/unit-history.page').then((m) => m.UnitHistoryPage),
    title: 'Historial de relaciones',
  },
  {
    path: 'unidades/:unitId/desactivar',
    loadComponent: () => import('./pages/unit-deactivate/unit-deactivate.page').then((m) => m.UnitDeactivatePage),
    title: 'Desactivar unidad',
  },
  {
    path: 'unidades/:unitId/reactivar',
    loadComponent: () => import('./pages/unit-reactivate/unit-reactivate.page').then((m) => m.UnitReactivatePage),
    title: 'Reactivar unidad',
  },
  {
    // SCR-017-01/03 (solo lectura; SCR-017-02 no se implementa, BR-PTY-28).
    path: 'organizacion-interna',
    loadComponent: () =>
      import('./pages/internal-organization/internal-organization.page').then((m) => m.InternalOrganizationPage),
    title: 'Organización interna',
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
