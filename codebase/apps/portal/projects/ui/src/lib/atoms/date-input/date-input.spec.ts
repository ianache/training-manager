import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GfDateInput } from './date-input';

describe('GfDateInput', () => {
  let fixture: ComponentFixture<GfDateInput>;
  let component: GfDateInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GfDateInput] }).compileComponents();
    fixture = TestBed.createComponent(GfDateInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;

  it('renderiza un control de fecha nativo', () => {
    expect(input().type).toBe('date');
  });

  it('muestra el valor recibido', () => {
    fixture.componentRef.setInput('value', '2026-01-15');
    fixture.detectChanges();
    expect(input().value).toBe('2026-01-15');
  });

  it('emite valueChange con la fecha elegida cuando el usuario cambia el control', () => {
    const emitted: string[] = [];
    component.valueChange.subscribe((v: string) => emitted.push(v));
    input().value = '2026-01-15';
    input().dispatchEvent(new Event('change'));
    expect(emitted).toEqual(['2026-01-15']);
  });

  it('emite blur al perder el foco', () => {
    const spy = vi.fn();
    component.blur.subscribe(spy);
    input().dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('se deshabilita cuando disabled es true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(input().disabled).toBe(true);
  });

  it('marca aria-invalid solo cuando invalid es true', () => {
    expect(input().getAttribute('aria-invalid')).toBeNull();
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(input().getAttribute('aria-invalid')).toBe('true');
  });
});
