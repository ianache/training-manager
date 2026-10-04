import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfChip } from './chip';

@Component({
  imports: [GfChip],
  template: `<gf-chip [tone]="tone()" [removable]="removable()" removeLabel="Quitar filtro Estado: Activa" (removed)="count.update(c => c + 1)">Estado: Activa</gf-chip>`,
})
class Host {
  tone = signal<'neutral' | 'info'>('neutral');
  removable = signal(false);
  count = signal(0);
}

describe('GfChip (CMP-ATOM-014)', () => {
  let fixture: ComponentFixture<Host>;
  const el = () => fixture.nativeElement as HTMLElement;
  const btn = () => el().querySelector('button') as HTMLButtonElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('muestra el texto proyectado', () => {
    expect(el().textContent).toContain('Estado: Activa');
  });

  it('no muestra botón de quitar por defecto', () => {
    expect(btn()).toBeNull();
  });

  it('aplica el tono neutral por defecto y info cuando se pide', () => {
    expect(el().querySelector('.gf-chip--neutral')).not.toBeNull();
    fixture.componentInstance.tone.set('info');
    fixture.detectChanges();
    expect(el().querySelector('.gf-chip--info')).not.toBeNull();
  });

  it('con removable muestra un botón con aria-label = removeLabel y type=button', () => {
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();
    expect(btn()?.getAttribute('aria-label')).toBe('Quitar filtro Estado: Activa');
    expect(btn()?.getAttribute('type')).toBe('button');
  });

  it('el icono del botón es decorativo (aria-hidden)', () => {
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();
    expect(btn()?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('emite removed al activar el botón', () => {
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();
    btn()!.click();
    expect(fixture.componentInstance.count()).toBe(1);
  });

  it('el chip en sí no es focusable', () => {
    expect(el().querySelector('[tabindex]')).toBeNull();
  });
});
