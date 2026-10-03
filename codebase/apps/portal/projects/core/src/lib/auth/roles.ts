/**
 * Roles de acceso de la plataforma (realm roles en Keycloak).
 *
 * SUPUESTO: los nombres técnicos todavía no están acordados. La matriz completa de permisos
 * sigue abierta (UXR-000.2, P-45 "qué es ADMIN"). party-management-service usa hoy
 * `jefe_ingeniera`; alinear el nombre antes de integrar (ver ARCHITECTURE.md, Q-04).
 */
export const AppRole = {
  Colaborador: 'colaborador',
  JefeProyecto: 'jefe_proyecto',
  Evaluador: 'evaluador',
  JefeIngenieria: 'jefe_ingenieria',
  ProductOwner: 'product_owner',
  Direccion: 'direccion',
  Gerencia: 'gerencia',
  Admin: 'admin',
} as const;

export type AppRole = (typeof AppRole)[keyof typeof AppRole];
