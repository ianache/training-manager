/**
 * Modelos de vista del Catálogo. SUPUESTO: no existe todavía el contrato de
 * catalog-service (ver ARCHITECTURE.md, Q-05). Ajustar al API-SPEC cuando se publique.
 */
export type RoleDefinitionStatus = 'defined' | 'undefined';

export interface RoleSummary {
  id: string;
  name: string;
  levelCount: number;
  competencyCount: number;
  status: RoleDefinitionStatus;
}
