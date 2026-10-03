/**
 * Roles de realm en Keycloak. Deben coincidir con @gf/core (portal) — ver ARCHITECTURE.md Q-04.
 */
export const Role = {
  Colaborador: 'colaborador',
  JefeProyecto: 'jefe_proyecto',
  Evaluador: 'evaluador',
  JefeIngenieria: 'jefe_ingenieria',
  ProductOwner: 'product_owner',
  Direccion: 'direccion',
  Gerencia: 'gerencia',
  Admin: 'admin',
} as const;
