import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GfErrorMessage } from './error-message';

describe('GfErrorMessage', () => {
  let fixture: ComponentFixture<GfErrorMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GfErrorMessage] }).compileComponents();
    fixture = TestBed.createComponent(GfErrorMessage);
    fixture.componentRef.setInput('message', 'Email is required');
    fixture.detectChanges();
  });

  const alert = () => fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;

  it('muestra el texto del mensaje', () => {
    expect(alert().textContent).toContain('Email is required');
  });

  it('se anuncia como alerta, sin interrumpir (aria-live polite)', () => {
    expect(alert().getAttribute('role')).toBe('alert');
    expect(alert().getAttribute('aria-live')).toBe('polite');
  });

  it('refleja un cambio de mensaje', () => {
    fixture.componentRef.setInput('message', 'Otro error');
    fixture.detectChanges();
    expect(alert().textContent).toContain('Otro error');
    expect(alert().textContent).not.toContain('Email is required');
  });
});
