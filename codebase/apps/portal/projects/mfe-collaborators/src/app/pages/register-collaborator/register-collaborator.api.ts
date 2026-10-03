import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, Page } from '@gf/core';
import { Observable, map } from 'rxjs';
import { PartiesApi } from '../../data-access/parties.api';
import { PARTY_ROLE_LABEL, PartyDetail, displayName } from '../../data-access/party.models';
import { CreatePartyBody, Option, RoleOption } from './register-collaborator.rules';

/** Forma tolerante de un registro de catálogo (los servicios de unidades, proveedores y roles aún no tienen API-SPEC). */
interface CatalogRow {
  id: string;
  name?: string;
  label?: string;
  code?: string | null;
  location?: string | null;
  ruc?: string | null;
  levels?: Array<{ id: string; name?: string; label?: string; evidence_requirements?: number; evidence_count?: number }>;
}

function rows<T>(body: Page<T> | T[]): T[] {
  return Array.isArray(body) ? body : (body?.data ?? []);
}

/**
 * Acceso a datos del asistente de alta (US-015).
 * - POST /api/v1/parties y GET /api/v1/parties existen en el BFF (API-SPEC-001 §3.1).
 * - Unidades, proveedores y catálogo de roles NO tienen servicio todavía: los paths
 *   (/units, /providers, /catalog/roles) son SUPUESTOS y hoy responden 404/503; la UI lo trata como E2/E3/E4.
 */
@Injectable({ providedIn: 'root' })
export class RegisterCollaboratorApi {
  private readonly http = inject(HttpClient);
  private readonly parties = inject(PartiesApi);
  private readonly base = inject(APP_CONFIG).apiBaseUrl;

  create(body: CreatePartyBody): Observable<PartyDetail> {
    return this.http.post<PartyDetail>(`${this.base}/parties`, body);
  }

  /** El servicio no expone un endpoint de unicidad: se consulta la lista por correo y se compara exacto. */
  emailInUse(email: string): Observable<boolean> {
    const needle = email.trim().toLowerCase();
    return this.parties
      .list({ search: needle, limit: 5 })
      .pipe(map((p) => p.data.some((r) => r.contact?.email_work?.toLowerCase() === needle)));
  }

  searchManagers(q: string): Observable<Array<Option & { badge: string }>> {
    return this.parties.list({ search: q, limit: 8, status: 'active', role: 'Employee' }).pipe(
      map((p) =>
        p.data.map((r) => ({
          id: r.id,
          label: displayName(r),
          sublabel: r.contact?.email_work ?? PARTY_ROLE_LABEL[r.role] ?? r.role,
          badge: 'Vigente',
        })),
      ),
    );
  }

  getParty(id: string): Observable<PartyDetail> {
    return this.parties.get(id);
  }

  /** GET /organizations (API-SPEC-002): una sola ruta para unidades y proveedores, distinguidos por `type`. */
  private organizations(type: 'internal_unit' | 'external_provider', q: string): Observable<CatalogRow[]> {
    return this.http
      .get<Page<CatalogRow> | CatalogRow[]>(`${this.base}/organizations`, { params: { type, search: q, limit: 10 } })
      .pipe(map((b) => rows(b)));
  }

  searchUnits(q: string): Observable<Option[]> {
    return this.organizations('internal_unit', q).pipe(
      map((rs) => rs.map((r) => ({ id: r.id, label: r.name ?? r.id, sublabel: r.location ?? r.code ?? undefined }))),
    );
  }

  searchProviders(q: string): Observable<Option[]> {
    return this.organizations('external_provider', q).pipe(
      map((rs) => rs.map((r) => ({ id: r.id, label: r.name ?? r.id, sublabel: r.ruc ? `RUC: ${r.ruc}` : undefined }))),
    );
  }

  roles(): Observable<RoleOption[]> {
    return this.http.get<Page<CatalogRow> | CatalogRow[]>(`${this.base}/catalog/roles`, { params: { status: 'ACTIVE', limit: 100 } }).pipe(
      map((b) =>
        rows(b).map((r) => ({
          id: r.id,
          label: r.name ?? r.label ?? r.id,
          levels: (r.levels ?? []).map((l) => ({
            id: l.id,
            label: l.name ?? l.label ?? l.id,
            evidenceCount: l.evidence_requirements ?? l.evidence_count ?? 0,
          })),
        })),
      ),
    );
  }
}
