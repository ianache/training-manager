import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { APP_CONFIG } from '../config/app-config';
import { AppRole } from './roles';
import { SessionStatus, UserSession } from './session.model';

/**
 * Estado de sesión del usuario en el navegador.
 *
 * Es `providedIn: 'root'` y `@gf/core` se comparte como singleton por Native Federation,
 * así que el shell y todos los microUIs ven la misma instancia: un solo inicio de sesión
 * para toda la plataforma (UXR-000.1).
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly document = inject(DOCUMENT);

  private readonly _session = signal<UserSession | null>(null);
  private readonly _status = signal<SessionStatus>('unknown');

  readonly session = this._session.asReadonly();
  readonly status = this._status.asReadonly();
  readonly isAuthenticated = computed(() => this._status() === 'authenticated');
  readonly roles = computed<readonly AppRole[]>(() => this._session()?.roles ?? []);

  /** Consulta al BFF quién es el usuario. 401 = no hay sesión. */
  load(): Observable<UserSession | null> {
    return this.http.get<UserSession>(`${this.config.authBaseUrl}/session`).pipe(
      tap((s) => {
        this._session.set(s);
        this._status.set('authenticated');
      }),
      catchError(() => {
        this._session.set(null);
        if (this._status() !== 'expired') this._status.set('anonymous');
        return of(null);
      }),
    );
  }

  /** Lo llama el interceptor ante un 401 en una llamada de negocio. */
  markExpired(): void {
    this._session.set(null);
    this._status.set('expired');
  }

  hasAnyRole(roles: readonly AppRole[]): boolean {
    if (roles.length === 0) return true;
    const mine = this.roles();
    return roles.some((r) => mine.includes(r));
  }

  /**
   * Inicia el flujo Authorization Code + PKCE. Lo ejecuta el BFF (ADR-002): el navegador
   * solo navega. El formulario de credenciales lo muestra Keycloak (GEN-002).
   */
  login(returnTo: string = this.currentPath()): void {
    const url = `${this.config.authBaseUrl}/login?returnTo=${encodeURIComponent(returnTo)}`;
    this.document.location.assign(url);
  }

  /** Cierre bilateral: BFF borra la sesión y redirige al logout de Keycloak (ADR-005 §5). */
  logout(): void {
    const form = this.document.createElement('form');
    form.method = 'POST';
    form.action = `${this.config.authBaseUrl}/logout`;
    const xsrf = this.readCookie('XSRF-TOKEN');
    if (xsrf) {
      const input = this.document.createElement('input');
      input.type = 'hidden';
      input.name = '_csrf';
      input.value = xsrf;
      form.appendChild(input);
    }
    this.document.body.appendChild(form);
    form.submit();
  }

  private currentPath(): string {
    const l = this.document.location;
    return `${l.pathname}${l.search}`;
  }

  private readCookie(name: string): string | null {
    const match = this.document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  }
}
