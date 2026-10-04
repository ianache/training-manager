import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfToggleButton } from './toggle-button';

@Component({
  imports: [GfToggleButton],
  template: `<gf-toggle-button [pressed]="pressed()" [disabled]="disabled()" [ariaLabel]="label()" (toggled)="count.update(c => c + 1)">Lista</gf-toggle-button>`,
})
class Host {
  pressed = signal(false);
  disabled = signal(false);
  label = signal('');
  count = signal(0);
}

describe('GfToggleButton (CMP-ATOM-015)', () => {
  let fixture: ComponentFixture<Host>;
  const btn = () => (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('es un button type=button con el contenido proyectado', () => {
    expect(btn().getAttribute('type')).toBe('button');
    expect(btn().textContent).toContain('Lista');
  });

  it('aria-pressed refleja pressed', () => {
    expect(btn().getAttribute('aria-pressed')).toBe('false');
    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();
    expect(btn().getAttribute('aria-pressed')).toBe('true');
  });

  it('emite toggled al hacer clic, sin cambiar el estado por sí mismo', () => {
    btn().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.count()).toBe(1);
    expect(btn().getAttribute('aria-pressed')).toBe('false');
  });

  it('deshabilitado: no emite toggled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(btn().disabled).toBe(true);
    btn().click();
    expect(fixture.componentInstance.count()).toBe(0);
  });

  it('ariaLabel se aplica solo si se indica', () => {
    expect(btn().hasAttribute('aria-label')).toBe(false);
    fixture.componentInstance.label.set('Vista de lista');
    fixture.detectChanges();
    expect(btn().getAttribute('aria-label')).toBe('Vista de lista');
  });

  it('el nombre accesible no cambia con el estado', () => {
    const before = btn().textContent;
    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();
    expect(btn().textContent).toBe(before);
  });
});
