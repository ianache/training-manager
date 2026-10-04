import { ChangeDetectionStrategy, Component, ElementRef, effect, input, model, output, untracked, viewChild } from '@angular/core';

export type GfDialogRole = 'dialog' | 'alertdialog';
export type GfDialogCloseReason = 'escape' | 'backdrop' | 'action';

let nextId = 0;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** CMP-ORG-008 — Diálogo (CMP-018 §3.8). */
@Component({
  selector: 'gf-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host { display: contents; }
    .gf-dialog {
      width: min(100%, 600px); max-width: 100%; padding: 0; border: 1px solid var(--gf-color-border);
      border-radius: var(--gf-radius-md); background: var(--gf-color-surface); color: var(--gf-color-text);
    }
    .gf-dialog::backdrop { background: rgb(0 0 0 / 0.5); }
    .gf-dialog__panel { display: grid; gap: var(--gf-space-4); padding: var(--gf-space-6); }
    .gf-dialog__title { margin: 0; font-size: var(--gf-font-size-lg); }
    .gf-dialog__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: var(--gf-space-2); }
  `,
  template: `
    <dialog #dlg class="gf-dialog" (cancel)="onCancel($event)" (click)="onClick($event)" tabindex="-1" [attr.role]="role()" aria-modal="true" [attr.aria-labelledby]="titleId">
      <div class="gf-dialog__panel">
        <h2 class="gf-dialog__title" [id]="titleId">{{ heading() }}</h2>
        <div class="gf-dialog__body"><ng-content select="[gfDialogBody]" /></div>
        <div class="gf-dialog__actions"><ng-content select="[gfDialogActions]" /></div>
      </div>
    </dialog>
  `,
})
export class GfDialog {
  readonly open = model(false);
  readonly heading = input.required<string>();
  readonly role = input<GfDialogRole>('dialog');
  readonly initialFocus = input<'first' | 'cancel' | 'none'>('first');
  readonly dismissable = input(true);
  readonly busy = input(false);
  readonly closed = output<GfDialogCloseReason>();

  protected readonly titleId = `gf-dialog-title-${nextId++}`;
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const wantOpen = this.open();
      const d = this.dlg().nativeElement;
      if (wantOpen && !d.open) {
        this.opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        d.showModal();
        untracked(() => {
          this.describe(d);
          this.focusInitial(d);
        });
      }
      else if (!wantOpen && d.open) {
        d.close();
        untracked(() => this.afterClose());
      }
    });
  }

  private reason: GfDialogCloseReason | null = null;
  /** Elemento enfocado al abrir (disparador); recibe el foco al cerrar. */
  private opener: HTMLElement | null = null;

  protected onCancel(event: Event): void {
    // Escape: el navegador lanza `cancel`; el cierre lo gobierna el componente (busy / dismissable).
    event.preventDefault();
    this.requestClose('escape');
  }

  protected onClick(event: MouseEvent): void {
    // Un clic sobre el fondo (::backdrop) tiene como destino el propio <dialog>; el contenido va en el panel.
    if (event.target === event.currentTarget) this.requestClose('backdrop');
  }

  private requestClose(reason: GfDialogCloseReason): void {
    if (this.busy() || !this.dismissable()) return;
    this.reason = reason;
    this.open.set(false);
  }

  private afterClose(): void {
    const reason = this.reason;
    this.reason = null;
    this.opener?.focus();
    this.opener = null;
    this.closed.emit(reason ?? 'action');
  }

  /** aria-describedby → primer párrafo del cuerpo (CMP-018 §3.8). */
  private describe(d: HTMLDialogElement): void {
    const p = d.querySelector('.gf-dialog__body p');
    if (!p) return;
    if (!p.id) p.id = `${this.titleId}-desc`;
    d.setAttribute('aria-describedby', p.id);
  }

  /** Foco explícito (en el navegador showModal() ya enfoca el primero; aquí se fija el elemento pedido por `initialFocus`). */
  private focusInitial(d: HTMLDialogElement): void {
    const first = d.querySelector<HTMLElement>(FOCUSABLE);
    const cancel = d.querySelector<HTMLElement>('[data-gf-dialog-cancel]');
    const mode = this.initialFocus();
    if (mode === 'none') d.focus();
    else (mode === 'cancel' ? (cancel ?? first) : first)?.focus();
  }
}
