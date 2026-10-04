import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfBreadcrumb, GfBreadcrumbItem } from './breadcrumb';

@Component({
  imports: [GfBreadcrumb],
  template: `<gf-breadcrumb [items]="items()" (navigate)="last = $event" />`,
})
class Host {
  items = signal<readonly GfBreadcrumbItem[]>([
    { id: 'home', label: 'Inicio', href: '/' },
    { id: 'org', label: 'Organización', href: '/org' },
    { id: 'u', label: 'Unidades' },
  ]);
  last: GfBreadcrumbItem | null = null;
}

describe('GfBreadcrumb (CMP-MOL-015)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const links = () => Array.from(el().querySelectorAll('a')) as HTMLAnchorElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('nav con aria-label «Migas de pan» y lista ordenada', () => {
    const nav = el().querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Migas de pan');
    expect(nav?.querySelectorAll('ol > li').length).toBe(3);
  });

  it('los elementos con href son enlaces y el último no es enlace', () => {
    expect(links().map((a) => a.textContent?.trim())).toEqual(['Inicio', 'Organización']);
    expect(links()[0].getAttribute('href')).toBe('/');
  });

  it('el último elemento lleva aria-current=page', () => {
    const cur = el().querySelector('[aria-current="page"]');
    expect(cur?.textContent?.trim()).toBe('Unidades');
    expect(cur?.tagName).toBe('SPAN');
  });

  it('los separadores son decorativos (aria-hidden)', () => {
    const seps = el().querySelectorAll('svg');
    expect(seps.length).toBe(2);
    seps.forEach((s) => expect(s.getAttribute('aria-hidden')).toBe('true'));
  });

  it('un clic normal emite navigate y cancela el href por defecto', () => {
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
    links()[1].dispatchEvent(ev);
    expect(fixture.componentInstance.last?.id).toBe('org');
    expect(ev.defaultPrevented).toBe(true);
  });

  it('Ctrl/Meta/Shift+clic no se intercepta (pestaña nueva)', () => {
    for (const init of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }]) {
      const ev = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
      links()[0].dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    }
    expect(fixture.componentInstance.last).toBeNull();
  });

  it('con un solo elemento no muestra nada', () => {
    fixture.componentInstance.items.set([{ id: 'u', label: 'Unidades' }]);
    fixture.detectChanges();
    expect(el().querySelector('nav')).toBeNull();
  });
});
