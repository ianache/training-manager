import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GfTelInput } from './tel-input';

describe('GfTelInput', () => {
  let component: GfTelInput;
  let fixture: ComponentFixture<GfTelInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfTelInput, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(GfTelInput);
    component = fixture.componentInstance;
  });

  describe('Basic rendering and attributes', () => {
    it('should render tel input element', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input).toBeTruthy();
      expect(input.type).toBe('tel');
    });

    it('should have default placeholder for Peru format', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('+51 999 999 999');
    });

    it('should allow custom placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Ingrese teléfono');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('Ingrese teléfono');
    });

    it('emite valueChange con el número cuando el usuario cambia el campo', () => {
      fixture.detectChanges();
      const emitted: string[] = [];
      component.valueChange.subscribe((v: string) => emitted.push(v));
      const input = fixture.nativeElement.querySelector('input');
      input.value = '+51987654321';
      input.dispatchEvent(new Event('change'));
      expect(emitted).toEqual(['+51987654321']);
    });

    it('emite blur al perder el foco', () => {
      fixture.detectChanges();
      const spy = vi.fn();
      component.blur.subscribe(spy);
      fixture.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.disabled).toBe(true);
    });
  });

  describe('Phone pattern validation (Peru +51XXXXXXXXX)', () => {
    it('should validate correct format: +51999999999', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('+51999999999', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.valid).toBe(true);
      expect(control.hasError('pattern')).toBe(false);
    });

    it('should reject format without country code', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('999999999', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.hasError('pattern')).toBe(true);
    });

    it('should reject wrong country code', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('+55987654321', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.hasError('pattern')).toBe(true);
    });

    it('should reject with insufficient digits', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('+5199999999', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.hasError('pattern')).toBe(true);
    });

    it('should reject with too many digits', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('+519999999999', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.hasError('pattern')).toBe(true);
    });

    it('should reject non-numeric characters after country code', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('+51ABCDEFGH9', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.hasError('pattern')).toBe(true);
    });
  });

  describe('Form control integration', () => {
    it('should work with FormControl', () => {
      const control = new FormControl('+51987654321');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.value).toBe('+51987654321');
    });

    it('should work with required validator', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.hasError('required')).toBe(true);
      control.setValue('+51987654321');
      expect(control.hasError('required')).toBe(false);
    });

    it('should track touched state', () => {
      const control = new FormControl('');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.touched).toBe(false);
      control.markAsTouched();
      expect(control.touched).toBe(true);
    });
  });

  describe('States', () => {
    it('should show normal state by default', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-invalid')).toBeNull();
    });

    it('should show valid state when control is valid', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('+51999999999', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.valid).toBe(true);
    });

    it('should show error state when control is invalid', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('invalid', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.invalid).toBe(true);
    });

    it('should show error when touched and invalid', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('invalid', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.markAsTouched();
      fixture.detectChanges();

      const shouldShowInvalid = component.shouldShowInvalid();
      expect(shouldShowInvalid).toBe('true');
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('should set aria-required when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('should set aria-invalid when invalid', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-label for screen readers', () => {
      fixture.componentRef.setInput('ariaLabel', 'Número telefónico laboral');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-label')).toBe('Número telefónico laboral');
    });

    it('should set aria-invalid=true when control is invalid and touched', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('invalid', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.markAsTouched();
      fixture.detectChanges();
      const shouldShowInvalid = component.shouldShowInvalid();
      expect(shouldShowInvalid).toBe('true');
    });

    it('should have proper semantic HTML role', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input[type="tel"]');
      expect(input).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty value', () => {
      const control = new FormControl('');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.value).toBe('');
    });

    it('should handle null value', () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.value).toBeNull();
    });
  });
});


describe('GfTelInput — aria-invalid tras la interacción del usuario', () => {
  it('pasa a aria-invalid=true cuando el usuario sale de un campo obligatorio vacío', async () => {
    await TestBed.configureTestingModule({ imports: [GfTelInput, ReactiveFormsModule] }).compileComponents();
    const fixture = TestBed.createComponent(GfTelInput);
    const control = new FormControl('', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('input') as HTMLElement;
    expect(el.getAttribute('aria-invalid')).toBeNull();

    el.dispatchEvent(new Event('blur')); // el value accessor del formControl marca el control como tocado
    fixture.detectChanges();

    expect(control.touched).toBe(true);
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });
});
