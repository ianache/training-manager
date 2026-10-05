/*
 * POLYFILL SOLO DE PRUEBA (mismo contrato que ui/.../dialog.spec.ts, CMP-018-Q4): jsdom no implementa
 * HTMLDialogElement.showModal/close. Pone/quita `open` y dispara `close`. NO emula el atrapado de foco ni
 * Escape del navegador (no verificables en jsdom).
 */
type DialogLike = HTMLElement & { open: boolean; showModal(): void; close(): void };
const installed: string[] = [];

export function installDialogPolyfill(): void {
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
  define('showModal', { value(this: DialogLike) { this.setAttribute('open', ''); } });
  define('close', {
    value(this: DialogLike) {
      if (!this.hasAttribute('open')) return;
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    },
  });
}

export function uninstallDialogPolyfill(): void {
  const proto = (globalThis as unknown as { HTMLDialogElement?: { prototype: object } }).HTMLDialogElement?.prototype ?? HTMLElement.prototype;
  for (const n of installed) delete (proto as Record<string, unknown>)[n];
  installed.length = 0;
}
