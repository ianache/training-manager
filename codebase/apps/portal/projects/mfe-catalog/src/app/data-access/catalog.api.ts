import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, Page, PageQuery } from '@gf/core';
import { Observable } from 'rxjs';
import { RoleSummary } from './catalog.models';

/** Acceso a datos del Catálogo. Habla SOLO con el BFF (/api/v1/catalog/*). */
@Injectable({ providedIn: 'root' })
export class CatalogApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(APP_CONFIG).apiBaseUrl}/catalog`;

  listRoles(query: PageQuery = {}): Observable<Page<RoleSummary>> {
    return this.http.get<Page<RoleSummary>>(`${this.base}/roles`, { params: toParams(query) });
  }

  getRole(id: string): Observable<RoleSummary> {
    return this.http.get<RoleSummary>(`${this.base}/roles/${encodeURIComponent(id)}`);
  }
}

function toParams(query: PageQuery): HttpParams {
  let params = new HttpParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== '') params = params.set(k, String(v));
  }
  return params;
}
