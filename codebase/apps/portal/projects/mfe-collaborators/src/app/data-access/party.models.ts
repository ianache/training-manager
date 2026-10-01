/** Modelos alineados con API-SPEC-001 §3.1 (GET /parties, GET /parties/{id}). */
export type PartyStatus = 'active' | 'inactive' | 'anonymized';

/** Vista limitada: lo que cualquier colaborador ve de otra persona (UXR-000.5). */
export interface PartySummary {
  id: string;
  code: string;
  first_names: string | null;
  last_names: string | null;
  preferred_name: string | null;
  contact: { email_work: string | null; phone_work?: string | null };
  role: string;
  unit_id: string | null;
  status: PartyStatus;
}

export interface RoleAssignment {
  id: string;
  role: string;
  level: string;
  from_date: string;
  thru_date: string | null;
  status: string;
}

/** Vista completa (Jefe de Ingeniería, ADMIN). Los campos extra pueden no venir. */
export interface PartyDetail extends PartySummary {
  identification?: { type: string | null; number: string | null; country: string | null };
  direct_manager_id?: string | null;
  created_by?: string;
  created_at?: string;
  updated_by?: string | null;
  updated_at?: string | null;
  role_assignments?: RoleAssignment[];
}

/** Nombre a mostrar: preferido, o nombres + apellidos; vacío si fue anonimizado. */
export function displayName(p: Pick<PartySummary, 'preferred_name' | 'first_names' | 'last_names'>): string {
  return p.preferred_name || [p.first_names, p.last_names].filter(Boolean).join(' ') || 'Sin nombre';
}

export const PARTY_ROLE_LABEL: Record<string, string> = {
  Employee: 'Empleado',
  Contractor: 'Contratista',
};
