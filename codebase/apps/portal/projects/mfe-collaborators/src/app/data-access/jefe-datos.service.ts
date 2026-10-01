import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '@gf/core';
import { Observable, catchError, throwError } from 'rxjs';

export interface JefeDatosPayload {
  nombres: string;
  apellidos: string;
  nombrePreferido?: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  paisIdentificacion: string;
}

/**
 * Task 4 Service: Update party data (nombres, apellidos, etc.)
 * Calls: POST /api/v1/parties/{partyId}/data
 */
@Injectable({ providedIn: 'root' })
export class JefeDatosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(APP_CONFIG).apiBaseUrl}/parties`;

  updateDatos(partyId: string, payload: JefeDatosPayload): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/${encodeURIComponent(partyId)}/data`, payload)
      .pipe(
        catchError(error => {
          console.error('Error updating datos:', error);
          return throwError(() => ({
            message: error?.error?.message || 'Error al actualizar datos',
          }));
        })
      );
  }
}
