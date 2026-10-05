import { describe, expect, it } from 'vitest';
import { ROUTES } from './routes';
import { InternalOrganizationPage } from './pages/internal-organization/internal-organization.page';
import { UnitDeactivatePage } from './pages/unit-deactivate/unit-deactivate.page';
import { UnitFormPage } from './pages/unit-form/unit-form.page';
import { UnitHistoryPage } from './pages/unit-history/unit-history.page';
import { UnitListPage } from './pages/unit-list/unit-list.page';
import { UnitParentPage } from './pages/unit-parent/unit-parent.page';
import { UnitReactivatePage } from './pages/unit-reactivate/unit-reactivate.page';

describe('ROUTES de mfe-collaborators', () => {
  it('expone «unidades» (SCR-028-01) con título y carga perezosa de UnitListPage', async () => {
    const route = ROUTES.find((r) => r.path === 'unidades');
    expect(route).toBeDefined();
    expect(route!.title).toBe('Unidades organizacionales');
    expect(await (route!.loadComponent as () => Promise<unknown>)()).toBe(UnitListPage);
  });

  it('«unidades» va antes de «:partyId» para que no se tome como id de colaborador', () => {
    const paths = ROUTES.map((r) => r.path);
    expect(paths.indexOf('unidades')).toBeGreaterThanOrEqual(0);
    expect(paths.indexOf('unidades')).toBeLessThan(paths.indexOf(':partyId'));
  });

  it.each([
    ['unidades/nueva', 'Registrar unidad', UnitFormPage],
    ['unidades/:unitId/editar', 'Editar nombre de la unidad', UnitFormPage],
    ['unidades/:unitId/padre', 'Cambiar unidad padre', UnitParentPage],
    ['unidades/:unitId/historial', 'Historial de relaciones', UnitHistoryPage],
    ['unidades/:unitId/desactivar', 'Desactivar unidad', UnitDeactivatePage],
    ['unidades/:unitId/reactivar', 'Reactivar unidad', UnitReactivatePage],
    ['organizacion-interna', 'Organización interna', InternalOrganizationPage],
  ])('expone «%s» (%s) con carga perezosa de su página', async (path, title, component) => {
    const route = ROUTES.find((r) => r.path === path);
    expect(route, path).toBeDefined();
    expect(route!.title).toBe(title);
    expect(await (route!.loadComponent as () => Promise<unknown>)()).toBe(component);
  });

  it('las rutas de unidades y de organización interna van antes de «:partyId/…» para no confundirse con un colaborador', () => {
    const paths = ROUTES.map((r) => r.path!);
    const party = paths.indexOf(':partyId/datos/editar');
    for (const p of ['unidades/nueva', 'unidades/:unitId/editar', 'unidades/:unitId/padre', 'unidades/:unitId/historial', 'unidades/:unitId/desactivar', 'unidades/:unitId/reactivar', 'organizacion-interna']) {
      expect(paths.indexOf(p), p).toBeGreaterThanOrEqual(0);
      expect(paths.indexOf(p), p).toBeLessThan(party);
    }
  });
});
