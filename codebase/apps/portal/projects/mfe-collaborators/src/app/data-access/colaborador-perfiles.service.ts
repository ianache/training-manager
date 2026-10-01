import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '@gf/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface PerfilPayload {
  plataforma: string;
  url: string;
}

/**
 * Task 6 Service: Update party perfiles (professional profiles)
 * All profiles marked vigente (fecha_desde = TODAY)
 * Calls: POST /api/v1/parties/{partyId}/perfiles
 */
@Injectable({ providedIn: 'root' })
export class ColaboradorPerfilesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(APP_CONFIG).apiBaseUrl}/parties`;

  addPerfil(partyId: string, payload: PerfilPayload): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/${encodeURIComponent(partyId)}/perfiles`, payload)
      .pipe(
        catchError(error => {
          console.error('Error adding perfil:', error);
          return throwError(() => ({
            message: error?.error?.message || 'Error al agregar perfil',
          }));
        })
      );
  }

  deletePerfil(partyId: string, perfilId: string): Observable<any> {
    return this.http
      .delete(
        `${this.baseUrl}/${encodeURIComponent(partyId)}/perfiles/${encodeURIComponent(
          perfilId
        )}`
      )
      .pipe(
        catchError(error => {
          console.error('Error deleting perfil:', error);
          return throwError(() => ({
            message: error?.error?.message || 'Error al eliminar perfil',
          }));
        })
      );
  }

  updatePhone(partyId: string, phone: string): Observable<any> {
    return this.http
      .patch(`${this.baseUrl}/${encodeURIComponent(partyId)}/phone`, {
        phone,
      })
      .pipe(
        catchError(error => {
          console.error('Error updating phone:', error);
          return throwError(() => ({
            message: error?.error?.message || 'Error al actualizar teléfono',
          }));
        })
      );
  }
}
