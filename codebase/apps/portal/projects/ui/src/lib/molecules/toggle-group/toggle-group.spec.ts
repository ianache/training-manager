import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfToggleGroup, GfToggleOption } from './toggle-group';

@Component({
  imports: [GfToggleGroup],
  template: `<gf-toggle-group [options]="options" groupLabel="Vista" [(value)]="value" />`,
})
class Host {
  options: readonly GfToggleOption[] = [
    { value: 'list', label: 'Lista' },
    { value: 'tree', label: 'Jerarquía', icon: 'layers' },
  ];
  value = signal('list');
}

describe('GfToggleGroup (CMP-MOL-012)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const buttons = () => Array.from(el().querySelectorAll('button')) as HTMLButtonElement[];
  const pressed = () => buttons().map((b) => b.getAttribute('aria-pressed'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('role=group con aria-label = groupLabel', () => {
    const g = el().querySelector('[role="group"]');
    expect(g?.getAttribute('aria-label')).toBe('Vista');
  });

  it('renderiza un botón por opción con su texto', () => {
    expect(buttons().map((b) => b.textContent?.trim())).toEqual(['Lista', 'Jerarquía']);
  });

  it('solo la opción del valor inicial está presionada', () => {
    expect(pressed()).toEqual(['true', 'false']);
  });

  it('al hacer clic en otra opción cambia el valor (exclusivo) y actualiza el padre', () => {
    buttons()[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('tree');
    expect(pressed()).toEqual(['false', 'true']);
  });

  it('presionar la opción ya presionada no cambia nada', () => {
    buttons()[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('list');
    expect(pressed()).toEqual(['true', 'false']);
  });

  it('un valor que no corresponde a ninguna opción deja todas sin presionar', () => {
    fixture.componentInstance.value.set('otra');
    fixture.detectChanges();
    expect(pressed()).toEqual(['false', 'false']);
  });

  it('cada botón es parada de Tab (sin tabindex negativo)', () => {
    expect(buttons().every((b) => b.tabIndex === 0)).toBe(true);
  });

  it('el icono de la opción es decorativo', () => {
    expect(buttons()[1].querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
});
