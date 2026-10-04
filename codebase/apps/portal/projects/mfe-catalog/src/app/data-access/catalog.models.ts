/**
 * Modelos de vista del Catálogo, alineados con API-SPEC-003 (catalog-service, ADR-011).
 * Los nombres de campo son los del contrato (snake_case); el portal no los traduce.
 */
export type CatalogStatus = 'ACTIVE' | 'INACTIVE';
export type LevelCode = 'L1' | 'L2' | 'L3' | 'L4';
export const LEVEL_CODES: readonly LevelCode[] = ['L1', 'L2', 'L3', 'L4'];

export interface LevelSummary {
  id: string;
  name: string;
  ordinal: number;
  status: CatalogStatus;
  /** Compuerta de BR-ACR-13: el nivel se puede asignar a una persona. */
  usable: boolean;
  evidence_requirements: number;
}

export interface RoleSummary {
  id: string;
  name: string;
  description: string | null;
  status: CatalogStatus;
  competency_count: number;
  row_version: number;
  levels: LevelSummary[];
}

export interface VersionRef {
  id: string;
  version_number: number;
  status: 'DRAFT' | 'APPROVED' | 'DEPRECATED';
}

export interface LevelCompetency {
  competency_id: string;
  name: string;
  required_level: LevelCode;
  version: VersionRef;
  /** Falso cuando existe una versión aprobada posterior (EVD-2026-0143). */
  is_current: boolean;
  suggested_version_id: string | null;
}

export interface LevelDetail extends LevelSummary {
  competencies: LevelCompetency[];
}

export interface RoleDetail {
  id: string;
  name: string;
  description: string | null;
  status: CatalogStatus;
  row_version: number;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  levels: LevelDetail[];
}

export interface CompetencySummary {
  id: string;
  name: string;
  description: string | null;
  status: CatalogStatus;
  current_version: VersionRef | null;
  /** Niveles L1 a L4 con al menos un requisito de evidencia en la versión vigente (SCR-001-01: «2 de 4»). */
  levels_with_requirements: number;
  row_version: number;
}

/** Cuerpo de POST /roles y PUT /roles/{id}. */
export interface RoleBody {
  name: string;
  description: string | null;
  levels: {
    id?: string;
    name: string;
    ordinal: number;
    competencies: { competency_id: string; version_id: string; required_level: LevelCode }[];
  }[];
}
