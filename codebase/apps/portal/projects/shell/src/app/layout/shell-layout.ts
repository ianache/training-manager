import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from '@gf/core';
import { GfButton } from '@gf/ui';
import { NAVIGATION } from './navigation';

/**
 * SCR-000 — Shell (GEN-002): barra superior, navegación lateral por rol,
 * enlace "Saltar al contenido" y región <main> donde se montan los microUIs.
 */
@Component({
  selector: 'gf-shell-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, GfButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.scss',
})
export class ShellLayout {
  protected readonly session = inject(SessionService);

  protected readonly sections = computed(() =>
    NAVIGATION.map((s) => ({
      ...s,
      items: s.items.filter((i) => this.session.hasAnyRole(i.roles)),
    })).filter((s) => s.items.length > 0),
  );

  protected logout(): void {
    this.session.logout();
  }
}
