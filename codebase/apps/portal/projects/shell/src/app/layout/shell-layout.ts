import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { SessionService } from '@gf/core';
import { GfButton } from '@gf/ui';
import { NAVIGATION } from './navigation';

/**
 * SCR-000 — Shell (GEN-002): barra superior, navegación lateral por rol,
 * enlace "Saltar al contenido" y región <main> donde se montan los microUIs.
 */
@Component({
  selector: 'gf-shell-layout',
  imports: [RouterOutlet, RouterLink, GfButton],
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

  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split(/[?#]/)[0]),
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] },
  );

  /** Gana el ítem con la ruta más específica: /colaboradores/unidades no enciende «Colaboradores». */
  protected isActive(path: string): boolean {
    const url = this.url();
    const matches = (p: string) => url === p || url.startsWith(p + '/');
    if (!matches(path)) return false;
    const longest = NAVIGATION.flatMap((s) => s.items).filter((i) => matches(i.path)).sort((a, b) => b.path.length - a.path.length)[0];
    return longest?.path === path;
  }

  protected logout(): void {
    this.session.logout();
  }
}
