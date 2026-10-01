import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '@gf/core';
import { GfButton, GfEmptyState } from '@gf/ui';

/** Estado "Sesión vencida" (UXR-000, SCR-000-E). Un único botón que redirige al IdP. */
@Component({
  selector: 'gf-session-expired-page',
  imports: [GfEmptyState, GfButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gf-empty-state
      icon="⏱"
      title="Tu sesión venció"
      description="Por seguridad, la sesión se cierra tras 30 minutos sin actividad. Vuelve a iniciar sesión para continuar."
    >
      <gf-button (pressed)="session.login('/')">Iniciar sesión</gf-button>
    </gf-empty-state>
  `,
})
export class SessionExpiredPage {
  protected readonly session = inject(SessionService);
}

/** Estado "Sin permiso": no muestra datos (UXR-000.4). */
@Component({
  selector: 'gf-forbidden-page',
  imports: [GfEmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gf-empty-state
    icon="⊘"
    title="Esta función no está disponible para tu rol"
    description="Si crees que deberías tener acceso, consulta con el Jefe de Ingeniería."
  />`,
})
export class ForbiddenPage {}

@Component({
  selector: 'gf-not-found-page',
  imports: [GfEmptyState, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gf-empty-state icon="?" title="No encontramos esta página">
    <a routerLink="/">Ir al inicio</a>
  </gf-empty-state>`,
})
export class NotFoundPage {}

/** Error al cargar un microUI (remoto caído o manifiesto mal configurado). */
@Component({
  selector: 'gf-remote-unavailable-page',
  imports: [GfEmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gf-empty-state
    icon="!"
    title="Esta sección no está disponible en este momento"
    description="El resto de la plataforma sigue funcionando. Intenta nuevamente en unos minutos."
  />`,
})
export class RemoteUnavailablePage {}

/** Placeholder para microUIs aún no construidos (perfil, brecha). */
@Component({
  selector: 'gf-coming-soon-page',
  imports: [GfEmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gf-empty-state icon="○" title="Sección en construcción" />`,
})
export class ComingSoonPage {}
