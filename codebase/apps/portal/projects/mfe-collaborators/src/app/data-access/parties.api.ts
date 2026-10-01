import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG, Page, PageQuery } from '@gf/core';
import { Observable } from 'rxjs';
import { PartyDetail, PartySummary } from './party.models';

/** Acceso a data maestra de Party a través del BFF (/api/v1/parties). */
@Injectable({ providedIn: 'root' })
export class PartiesApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${inject(APP_CONFIG).apiBaseUrl}/parties`;

  list(query: PageQuery = {}): Observable<Page<PartySummary>> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries({ page: 1, limit: 20, ...query })) {
      if (v !== undefined && v !== '') params = params.set(k, String(v));
    }
    return this.http.get<Page<PartySummary>>(this.base, { params });
  }

  get(id: string): Observable<PartyDetail> {
    return this.http.get<PartyDetail>(`${this.base}/${encodeURIComponent(id)}`);
  }
}
