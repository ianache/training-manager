import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { GfDialog, GfDialogCloseReason, GfDialogRole } from './dialog';

/*
 * POLYFILL SOLO DE PRUEBA (CMP-018-Q4). jsdom 30 NO implementa HTMLDialogElement.showModal/close/show
 * (verificado: `d.showModal is not a function`). Este polyfill reproduce solo el contrato observable:
 *   - showModal(): pone el atributo `open` y marca `__modal`.
 *   - close(): quita `open` y dispara el evento `close`.
 * A propósito NO reproduce lo que el navegador hace «gratis» y que el componente debe garantizar por sí
 * mismo en estas pruebas: mover el foco al abrir, restaurar el foco al cerrar. Tampoco emula el atrapado
 * de foco ni la inertización del resto de la página (NO verificables en jsdom: requieren un navegador real),
 * ni Escape (el navegador lo traduce a un evento `cancel`; las pruebas lo despachan explícitamente).
 */
type DialogLike = HTMLElement & { open: boolean; __modal?: boolean; showModal(): void; close(): void };
const installed: string[] = [];
function installDialogPolyfill(): void {
  const proto = (globalThis as unknown as { HTMLDialogElement?: { prototype: object } }).HTMLDialogElement?.prototype ?? HTMLElement.prototype;
  const define = (name: string, descriptor: PropertyDescriptor) => {
    if (!(name in proto)) {
      Object.defineProperty(proto, name, { configurable: true, ...descriptor });
      installed.push(name);
    }
  };
  define('open', {
    get(this: HTMLElement) { return this.hasAttribute('open'); },
    set(this: HTMLElement, v: boolean) { this.toggleAttribute('open', !!v); },
  });
  define('showModal', {
    value(this: DialogLike) { this.setAttribute('open', ''); this.__modal = true; },
  });
  define('close', {
    value(this: DialogLike) {
      if (!this.hasAttribute('open')) return;
      this.removeAttribute('open');
      this.__modal = false;
      this.dispatchEvent(new Event('close'));
    },
  });
}
function uninstallDialogPolyfill(): void {
  const proto = (globalThis as unknown as { HTMLDialogElement?: { prototype: object } }).HTMLDialogElement?.prototype ?? HTMLElement.prototype;
  for (const n of installed) delete (proto as Record<string, unknown>)[n];
  installed.length = 0;
}

@Component({
  imports: [GfDialog],
  template: `
    <button id="trigger" type="button">Desactivar</button>
    <gf-dialog
      [(open)]="open"
      heading="Desactivar unidad"
      [role]="role()"
      [initialFocus]="initialFocus()"
      [dismissable]="dismissable()"
      [busy]="busy()"
      (closed)="reasons.push($event)"
    >
      <p gfDialogBody>Cuerpo del diálogo</p>
      <input gfDialogBody id="field" aria-label="Motivo" />
      <div gfDialogActions>
        <button id="cancel" type="button" data-gf-dialog-cancel>Cancelar</button>
        <button id="ok" type="button">Confirmar</button>
      </div>
    </gf-dialog>
  `,
})
class Host {
  open = signal(false);
  role = signal<GfDialogRole>('dialog');
  initialFocus = signal<'first' | 'cancel' | 'none'>('first');
  dismissable = signal(true);
  busy = signal(false);
  reasons: GfDialogCloseReason[] = [];
}

describe('GfDialog (CMP-ORG-008)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const dlg = () => el().querySelector('dialog') as unknown as DialogLike;
  const flush = () => fixture.detectChanges();

  beforeAll(installDialogPolyfill);
  afterAll(uninstallDialogPolyfill);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    flush();
  });

  it('al pasar open a true abre el <dialog> con showModal() (modal, no show)', () => {
    expect(dlg().open).toBe(false);
    fixture.componentInstance.open.set(true);
    flush();
    expect(dlg().open).toBe(true);
    expect(dlg().__modal).toBe(true);
  });

  it('al pasar open a false cierra el <dialog> con close()', () => {
    fixture.componentInstance.open.set(true);
    flush();
    fixture.componentInstance.open.set(false);
    flush();
    expect(dlg().open).toBe(false);
  });

  it('muestra el título y proyecta cuerpo y acciones en sus zonas', () => {
    expect(dlg().querySelector('h2')?.textContent?.trim()).toBe('Desactivar unidad');
    expect(dlg().querySelector('.gf-dialog__body p')?.textContent).toBe('Cuerpo del diálogo');
    expect(Array.from(dlg().querySelectorAll('.gf-dialog__actions button')).map((b) => b.textContent)).toEqual(['Cancelar', 'Confirmar']);
  });

  it('aria: role=dialog por defecto, aria-modal=true y aria-labelledby apunta al título', () => {
    const d = dlg();
    expect(d.getAttribute('role')).toBe('dialog');
    expect(d.getAttribute('aria-modal')).toBe('true');
    const h = d.querySelector('h2')!;
    expect(h.id).not.toBe('');
    expect(d.getAttribute('aria-labelledby')).toBe(h.id);
  });

  it('role=alertdialog cuando se pide (decisión CMP-018-Q4 abierta: no es el valor por defecto)', () => {
    fixture.componentInstance.role.set('alertdialog');
    flush();
    expect(dlg().getAttribute('role')).toBe('alertdialog');
  });

  it('el host <gf-dialog> no duplica el role del diálogo', () => {
    fixture.componentInstance.role.set('alertdialog');
    flush();
    expect(el().querySelector('gf-dialog')!.hasAttribute('role')).toBe(false);
  });

  it('foco inicial «first»: al abrir el foco va al primer elemento enfocable', () => {
    (el().querySelector('#trigger') as HTMLElement).focus();
    fixture.componentInstance.open.set(true);
    flush();
    expect(document.activeElement).toBe(el().querySelector('#field'));
  });

  it('foco inicial «cancel»: el foco va al botón marcado data-gf-dialog-cancel (SCR-030-01: «Cancelar»)', () => {
    fixture.componentInstance.initialFocus.set('cancel');
    flush();
    fixture.componentInstance.open.set(true);
    flush();
    expect(document.activeElement).toBe(el().querySelector('#cancel'));
  });

  it('foco inicial «none»: el foco queda en el propio diálogo, no en un control (propuesto)', () => {
    fixture.componentInstance.initialFocus.set('none');
    flush();
    fixture.componentInstance.open.set(true);
    flush();
    expect(document.activeElement).toBe(dlg());
  });

  /** El navegador traduce Escape en un evento `cancel` cancelable sobre el <dialog>; aquí se despacha explícitamente. */
  const pressEscape = () => {
    const ev = new Event('cancel', { cancelable: true });
    dlg().dispatchEvent(ev);
    flush();
    return ev;
  };

  it('Escape (evento cancel) cierra el diálogo, emite closed(«escape») y toma el control del cierre', () => {
    fixture.componentInstance.open.set(true);
    flush();
    const ev = pressEscape();
    expect(ev.defaultPrevented).toBe(true);
    expect(fixture.componentInstance.open()).toBe(false);
    expect(dlg().open).toBe(false);
    expect(fixture.componentInstance.reasons).toEqual(['escape']);
  });

  it('Escape no cierra mientras busy (guardando)', () => {
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.busy.set(true);
    flush();
    const ev = pressEscape();
    expect(ev.defaultPrevented).toBe(true);
    expect(dlg().open).toBe(true);
    expect(fixture.componentInstance.open()).toBe(true);
    expect(fixture.componentInstance.reasons).toEqual([]);
  });

  it('Escape no cierra si dismissable es false', () => {
    fixture.componentInstance.dismissable.set(false);
    fixture.componentInstance.open.set(true);
    flush();
    const ev = pressEscape();
    expect(ev.defaultPrevented).toBe(true);
    expect(dlg().open).toBe(true);
    expect(fixture.componentInstance.reasons).toEqual([]);
  });

  it('clic en el fondo (el propio <dialog>) cierra con closed(«backdrop»); un clic dentro del panel no', () => {
    fixture.componentInstance.open.set(true);
    flush();
    (el().querySelector('.gf-dialog__panel') as HTMLElement).click();
    flush();
    expect(dlg().open).toBe(true);
    dlg().click();
    flush();
    expect(dlg().open).toBe(false);
    expect(fixture.componentInstance.reasons).toEqual(['backdrop']);
  });

  it('clic en el fondo no cierra mientras busy', () => {
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.busy.set(true);
    flush();
    dlg().click();
    flush();
    expect(dlg().open).toBe(true);
    expect(fixture.componentInstance.reasons).toEqual([]);
  });

  it('al cerrar por Escape el foco regresa al elemento que lo tenía al abrir (disparador)', () => {
    const trigger = el().querySelector('#trigger') as HTMLElement;
    trigger.focus();
    fixture.componentInstance.open.set(true);
    flush();
    expect(document.activeElement).not.toBe(trigger);
    pressEscape();
    expect(document.activeElement).toBe(trigger);
  });

  it('si el consumidor cierra (open=false) se emite closed(«action») y el foco regresa al disparador', () => {
    const trigger = el().querySelector('#trigger') as HTMLElement;
    trigger.focus();
    fixture.componentInstance.open.set(true);
    flush();
    fixture.componentInstance.open.set(false);
    flush();
    expect(fixture.componentInstance.reasons).toEqual(['action']);
    expect(document.activeElement).toBe(trigger);
  });

  it('aria-describedby apunta al primer párrafo del cuerpo al abrir', () => {
    fixture.componentInstance.open.set(true);
    flush();
    const p = dlg().querySelector('.gf-dialog__body p')!;
    expect(p.id).not.toBe('');
    expect(dlg().getAttribute('aria-describedby')).toBe(p.id);
  });
});
