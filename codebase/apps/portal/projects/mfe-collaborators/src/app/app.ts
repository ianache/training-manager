import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Raíz SOLO para desarrollo standalone del microUI (ng serve <proyecto>).
 * Dentro de la plataforma, el shell carga ./routes y esta clase no se usa.
 */
@Component({
  selector: 'gf-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<main style="padding: 1.5rem"><router-outlet /></main>',
})
export class App {}
