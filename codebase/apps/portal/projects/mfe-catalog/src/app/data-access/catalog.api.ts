import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, Page, PageQuery } from '@gf/core';
import { Observable } from 'rxjs';
import { CompetencySummary, RoleBody, RoleDetail, RoleSummary } from './catalog.models';

/** Acceso a datos del Catálogo. Habla SOLO con el BFF (/api/v1/catalog/*, API-SPEC-003 §1). */
@Injectable({ providedIn: 'root' })
export class CatalogApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(APP_CONFIG).apiBaseUrl}/catalog`;

  listRoles(query: PageQuery = {}): Observable<Page<RoleSummary>> {
    return this.http.get<Page<RoleSummary>>(`${this.base}/roles`, { params: toParams(query) });
  }

  getRole(id: string): Observable<RoleDetail> {
    return this.http.get<RoleDetail>(`${this.base}/roles/${encodeURIComponent(id)}`);
  }

  createRole(body: RoleBody): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(`${this.base}/roles`, body);
  }

  /** `rowVersion` viaja en If-Match: si otra persona editó antes, el servicio responde 412 (LDM-002 CM-09). */
  updateRole(id: string, rowVersion: number, body: RoleBody): Observable<RoleDetail> {
    return this.http.put<RoleDetail>(`${this.base}/roles/${encodeURIComponent(id)}`, body, { headers: ifMatch(rowVersion) });
  }

  deactivateRole(id: string, rowVersion: number): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(`${this.base}/roles/${encodeURIComponent(id)}/deactivate`, {}, { headers: ifMatch(rowVersion) });
  }

  /** Desactiva o reactiva un nivel (BR-CAT-30); quien ya lo tiene lo conserva. */
  setLevelStatus(roleId: string, levelId: string, action: 'deactivate' | 'reactivate'): Observable<RoleDetail> {
    return this.http.post<RoleDetail>(
      `${this.base}/roles/${encodeURIComponent(roleId)}/levels/${encodeURIComponent(levelId)}/${action}`,
      {},
    );
  }

  listCompetencies(query: PageQuery = {}): Observable<Page<CompetencySummary>> {
    return this.http.get<Page<CompetencySummary>>(`${this.base}/competencies`, { params: toParams(query) });
  }
}

function ifMatch(rowVersion: number): HttpHeaders {
  return new HttpHeaders({ 'If-Match': `"${rowVersion}"` });
}

function toParams(query: PageQuery): HttpParams {
  let params = new HttpParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== '') params = params.set(k, String(v));
  }
  return params;
}
