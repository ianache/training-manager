import { AppRole } from '@gf/core';

export interface NavItem {
  label: string;
  path: string;
  /** Vacío = visible para cualquier usuario autenticado. */
  roles: AppRole[];
  /** `d` de un SVG 24x24 relleno (icono decorativo, aria-hidden). Opcional. */
  icon?: string;
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
      {
        // GEN-028/029/030 (hoja consolidada de SCR-028-01): sección PERSONAS, tras «Colaboradores». Icono: edificio de la hoja de Stitch.
        label: 'Unidades organizacionales',
        path: '/colaboradores/unidades',
        roles: [AppRole.JefeIngenieria, AppRole.Admin],
        icon: 'M19 2H9c-1.1 0-2 .9-2 2v2H5c-1.1 0-2 .9-2 2v14h18V4c0-1.1-.9-2-2-2zm-8 2h8v16h-4v-3h-4v3H9V4h2zm-4 4h2v2H7V8zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm8-8h2v2h-2V8zm0 4h2v2h-2v-2z',
      },
    ],
  },
];
