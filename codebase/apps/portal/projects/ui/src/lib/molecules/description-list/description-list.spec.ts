import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, TemplateRef, signal, viewChild } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfDescriptionItem, GfDescriptionList } from './description-list';

@Component({
  imports: [GfDescriptionList],
  template: `<gf-description-list [items]="items()" [layout]="layout()" /><ng-template #badge><span class="probe">Activa</span></ng-template>`,
})
class Host {
  items = signal<readonly GfDescriptionItem[]>([
    { id: 'rs', term: 'Razón social', value: 'Comsatel S.A.' },
    { id: 'ruc', term: 'RUC', value: '20100000001' },
  ]);
  layout = signal<'stacked' | 'inline'>('stacked');
  badge = viewChild.required<TemplateRef<unknown>>('badge');
}

describe('GfDescriptionList (CMP-MOL-014)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('renderiza un dl con un div > dt + dd por ítem, en orden término → valor', () => {
    const groups = Array.from(el().querySelectorAll('dl > div'));
    expect(groups.length).toBe(2);
    expect(groups.map((g) => Array.from(g.children).map((c) => c.tagName + ':' + c.textContent?.trim()))).toEqual([
      ['DT:Razón social', 'DD:Comsatel S.A.'],
      ['DT:RUC', 'DD:20100000001'],
    ]);
  });

  it('valor ausente muestra «—» (propuesto) y el dd conserva su lugar', () => {
    fixture.componentInstance.items.set([{ id: 'x', term: 'Vigente hasta' }]);
    fixture.detectChanges();
    const dd = el().querySelectorAll('dd');
    expect(dd.length).toBe(1);
    expect(dd[0].textContent?.trim()).toBe('—');
  });

  it('valueTemplate se proyecta dentro del dd (p. ej. un gf-badge)', () => {
    fixture.componentInstance.items.set([{ id: 'e', term: 'Estado', valueTemplate: fixture.componentInstance.badge() }]);
    fixture.detectChanges();
    const dd = el().querySelector('dd')!;
    expect(dd.querySelector('.probe')?.textContent).toBe('Activa');
  });

  it('layout: stacked por defecto; inline añade la modificación inline', () => {
    expect(el().querySelector('dl')!.classList.contains('gf-dl--stacked')).toBe(true);
    fixture.componentInstance.layout.set('inline');
    fixture.detectChanges();
    const dl = el().querySelector('dl')!;
    expect(dl.classList.contains('gf-dl--inline')).toBe(true);
    expect(dl.classList.contains('gf-dl--stacked')).toBe(false);
  });
});
