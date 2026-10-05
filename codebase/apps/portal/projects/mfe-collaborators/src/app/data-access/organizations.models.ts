/** Forma real de GET /api/v1/organizations (OrganizationOut del servicio, API-SPEC-006 §3.1). Solo lo que usa SCR-028-01. */
export type UnitStatus = 'active' | 'inactive';
export type UnitStatusFilter = UnitStatus | 'all';
export type UnitSortField = 'name' | 'parent_name' | 'status' | 'from_date';

export interface OrganizationUnit {
  id: string;
  name: string;
  type: 'internal_unit' | 'external_provider';
  parent_id: string | null;
  status: UnitStatus;
  from_date: string | null;
  thru_date: string | null;
  active_children_count: number | null;
  current_people_count: number | null;
  /** Solo con view=tree. */
  children?: OrganizationUnit[] | null;
}

/** Parámetros de consulta de la pantalla (los nombres de la API se arman en el servicio). */
export interface UnitListQuery {
  search?: string;
  status?: UnitStatusFilter;
  ancestorId?: string | null;
  sort?: { field: UnitSortField; direction: 'asc' | 'desc' } | null;
  view?: 'list' | 'tree';
  page?: number;
  limit?: number;
}
