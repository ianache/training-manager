import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, Page } from '@gf/core';
import { Observable } from 'rxjs';
import { OrganizationUnit, UnitListQuery } from './organizations.models';

/** Acceso a unidades organizacionales a través del BFF (/api/v1/organizations). */
@Injectable({ providedIn: 'root' })
export class OrganizationsService {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(APP_CONFIG).apiBaseUrl}/organizations`;

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
}
