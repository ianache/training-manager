import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, Page } from '@gf/core';
import { Observable, map } from 'rxjs';
import { CreateInternalOrganizationInput, CreateUnitInput, InternalOrganization, OrganizationUnit, UnitListQuery, UnitRelationship } from './organizations.models';

/** Acceso a unidades organizacionales a través del BFF (/api/v1/organizations). */
@Injectable({ providedIn: 'root' })
export class OrganizationsService {
  private readonly http = inject(HttpClient);
  private readonly root = inject(APP_CONFIG).apiBaseUrl;
  private readonly base = `${this.root}/organizations`;

  /** El estado por defecto es `active` (AC-1); `ancestorId` incluye la unidad y sus descendientes (AC-4). */
  list(query: UnitListQuery = {}): Observable<Page<OrganizationUnit>> {
    let params = new HttpParams()
      .set('type', 'internal_unit')
      .set('status', query.status ?? 'active')
      .set('page', String(query.page ?? 1))
      .set('limit', String(query.limit ?? 20));
    const search = query.search?.trim();
    if (search) params = params.set('search', search);
    if (query.ancestorId) params = params.set('ancestor_id', query.ancestorId);
    if (query.sort) params = params.set('sort', `${query.sort.field}:${query.sort.direction}`);
    if (query.view === 'tree') params = params.set('view', 'tree');
    return this.http.get<Page<OrganizationUnit>>(this.base, { params });
  }

  get(id: string): Observable<OrganizationUnit> {
    return this.http.get<OrganizationUnit>(this.path(id));
  }

  /** `contact.email_work` es obligatorio (BR-PTY-27). El servicio fija la fecha desde (hoy): el alta no acepta `from_date`, `code` ni `location`. */
  create(input: CreateUnitInput): Observable<OrganizationUnit> {
    return this.http.post<OrganizationUnit>(this.base, {
      name: input.name.trim(),
      type: 'internal_unit',
      parent_id: input.parentId,
      contact: { email_work: input.emailWork.trim() },
    });
  }

  rename(id: string, name: string, version: number | null | undefined): Observable<OrganizationUnit> {
    return this.http.patch<OrganizationUnit>(this.path(id), { name: name.trim() }, this.ifMatch(version));
  }

  changeParent(id: string, body: { parent_id: string | null; from_date: string }, version: number | null | undefined): Observable<OrganizationUnit> {
    return this.http.post<OrganizationUnit>(`${this.path(id)}/parent`, body, this.ifMatch(version));
  }

  deactivate(id: string, version: number | null | undefined): Observable<OrganizationUnit> {
    return this.http.post<OrganizationUnit>(`${this.path(id)}/deactivate`, null, this.ifMatch(version));
  }

  reactivate(id: string, body: { from_date: string; parent_id?: string | null }, version: number | null | undefined): Observable<OrganizationUnit> {
    return this.http.post<OrganizationUnit>(`${this.path(id)}/reactivate`, body, this.ifMatch(version));
  }

  relationships(id: string, page = 1): Observable<Page<UnitRelationship>> {
    const params = new HttpParams().set('page', String(page)).set('limit', '20');
    return this.http.get<Page<UnitRelationship>>(`${this.path(id)}/relationships`, { params });
  }

  /** Solo lectura (BR-PTY-28, API-SPEC-007 borrador): 404 = aún no registrada; 403 = sin permiso. */
  internalOrganization(): Observable<InternalOrganization> {
    return this.http.get<{ data: InternalOrganization }>(`${this.root}/internal-organization`).pipe(map((r) => r.data));
  }

  /**
   * Alta inicial única (API-SPEC-007 §2.1, EVD-2026-0242): país fijo PE; la vigencia la fija el sistema.
   * 409 INTERNAL_ORGANIZATION_ALREADY_EXISTS si ya existe; 409 ORGANIZATION_DUPLICATE si el RUC está repetido.
   */
  createInternalOrganization(input: CreateInternalOrganizationInput): Observable<InternalOrganization> {
    const body = { name: input.name.trim(), ruc: input.ruc.trim(), ruc_country: 'PE' };
    return this.http.post<{ data: InternalOrganization }>(`${this.root}/internal-organization`, body).pipe(map((r) => r.data));
  }

  private path(id: string): string {
    return `${this.base}/${encodeURIComponent(id)}`;
  }

  /** If-Match con la row_version de la unidad cargada (412 si cambió, Q-8). */
  private ifMatch(version: number | null | undefined) {
    return version === null || version === undefined ? {} : { headers: { 'If-Match': `"${version}"` } };
  }
}
