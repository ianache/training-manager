/** El shell monta este microUI bajo /colaboradores (routes.ts); las páginas de gestión vuelven al listado SCR-028-01. */
export const UNITS_URL = '/colaboradores/unidades';

/** Estado de navegación con el que se vuelve al listado: unidad resaltada y confirmación (lo consume UnitListPage). */
export interface UnitReturnState {
  highlightUnitId?: string;
  notice?: string;
}
