import { describe, expect, it } from 'vitest';
import { ROUTES } from './routes';
import { UnitListPage } from './pages/unit-list/unit-list.page';

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
});
