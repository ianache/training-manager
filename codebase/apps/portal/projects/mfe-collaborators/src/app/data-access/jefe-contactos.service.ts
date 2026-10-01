import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '@gf/core';
import { Observable, forkJoin, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ContactosPayload {
  nuevoCorreoLaboral: string | null;
  nuevoNumeroTelefonico: string | null;
}

export interface VigenciaResponse {
  currentEmail?: { valor: string; desde: string; vigencia_id?: string };
  currentPhone?: { valor: string; desde: string; vigencia_id?: string };
}

/**
 * Task 5 Service: Update party contactos (email, phone) with vigencia lifecycle
 * Handles:
 * - Async email validation for duplicates (uniqueActive)
 * - Vigencia closure (fecha_hasta = TODAY)
 * - New vigencia opening (fecha_desde = TODAY)
 *
 * Calls:
 * - PATCH /api/v1/vigencias/{vigenciaId} (close old)
 * - POST /api/v1/vigencias (open new)
 * - GET /api/v1/parties/{partyId}/check-email/{email} (async validation)
 */
@Injectable({ providedIn: 'root' })
export class JefeContactosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(APP_CONFIG).apiBaseUrl}/parties`;

  updateContactos(
    partyId: string,
    payload: ContactosPayload
  ): Observable<VigenciaResponse> {
    const requests: Observable<any>[] = [];

    // If new email provided, close old and open new vigencia
    if (payload.nuevoCorreoLaboral) {
      requests.push(
        this.http.post(
          `${this.baseUrl}/${encodeURIComponent(partyId)}/contactos/email`,
          { email: payload.nuevoCorreoLaboral }
        )
      );
    }

    // If new phone provided, close old and open new vigencia
    if (payload.nuevoNumeroTelefonico) {
      requests.push(
        this.http.post(
          `${this.baseUrl}/${encodeURIComponent(partyId)}/contactos/phone`,
          { phone: payload.nuevoNumeroTelefonico }
        )
      );
    }

    if (requests.length === 0) {
      return throwError(() => ({
        message: 'Debes proporcionar al menos un medio de contacto.',
      }));
    }

    return forkJoin(requests).pipe(
      map(responses => ({
        currentEmail: responses[0]?.email,
        currentPhone: responses[1]?.phone,
      })),
      catchError(error => {
        console.error('Error updating contactos:', error);
        return throwError(() => ({
          message: error?.error?.message || 'Error al actualizar contactos',
        }));
      })
    );
  }

  /**
   * Async validator: Check if email is available (not duplicate in active vigencias)
   */
  checkEmailAvailable(email: string): Observable<{ available: boolean; person?: string }> {
    return this.http
      .get<{ exists: boolean; person?: string }>(
        `${this.baseUrl}/check-email/${encodeURIComponent(email)}`
      )
      .pipe(
        map(response => ({
          available: !response.exists,
          person: response.person,
        })),
        catchError(() =>
          throwError(() => ({
            message: 'Error al validar email',
          }))
        )
      );
  }
}
