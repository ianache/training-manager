import { AppRole } from '@gf/core';

export interface NavItem {
  label: string;
  path: string;
  /** Vacío = visible para cualquier usuario autenticado. */
  roles: AppRole[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

/**
 * Navegación global: el shell es su única fuente (ACP-002 TCON-006) y solo muestra
 * las funciones de los roles del usuario (UXR-000.2). La UI oculta; el BFF autoriza.
 *
 * Abierto (GEN-002-Q1): con varios roles, hoy se muestran todas las secciones juntas.
 */
export const NAVIGATION: NavSection[] = [
  {
    label: 'Mi desarrollo',
    items: [
      { label: 'Mi perfil de competencias', path: '/perfil', roles: [] },
      { label: 'Mi brecha', path: '/brecha', roles: [] },
    ],
  },
  {
    label: 'Catálogo',
    items: [{ label: 'Roles y competencias', path: '/catalogo', roles: [AppRole.JefeIngenieria] }],
  },
  {
    label: 'Personas',
    items: [
      {
        label: 'Colaboradores',
        path: '/colaboradores',
        roles: [AppRole.JefeIngenieria, AppRole.Admin],
      },
    ],
  },
];
