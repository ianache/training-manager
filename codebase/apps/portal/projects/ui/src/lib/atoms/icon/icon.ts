import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gf-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <i
      class="material-icons"
      [attr.aria-hidden]="decorative() || null"
      role="img"
      [attr.aria-label]="label() || null"
    >{{ name() }}</i>
  `,
  styles: [`
    i {
      display: inline-block;
      vertical-align: middle;
      font-size: 1.5rem;
    }
  `]
})
export class GfIcon {
  readonly name = input('');
  readonly label = input('');
  readonly decorative = input(false);
}
