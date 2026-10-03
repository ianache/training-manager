import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GfTextInput } from './text-input';

describe('GfTextInput', () => {
  let component: GfTextInput;
  let fixture: ComponentFixture<GfTextInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfTextInput, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(GfTextInput);
    component = fixture.componentInstance;
  });

  describe('Basic rendering and signals', () => {
    it('emite valueChange con el texto escrito (sin control de formulario)', () => {
      fixture.detectChanges();
      const emitted: string[] = [];
      component.valueChange.subscribe((v: string) => emitted.push(v));
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      expect(emitted).toEqual(['test']);
    });

    it('should have aria-required attribute when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('should have aria-invalid attribute when invalid is true', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('should be disabled when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.disabled).toBe(true);
    });

    it('emite blur al perder el foco', () => {
      fixture.detectChanges();
      const spy = vi.fn();
      component.blur.subscribe(spy);
      fixture.nativeElement.querySelector('input').dispatchEvent(new Event('blur'));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should support different input types', () => {
      fixture.componentRef.setInput('type', 'email');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.type).toBe('email');
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Nombres, campo obligatorio');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-label')).toBe('Nombres, campo obligatorio');
    });
  });

  describe('Form control integration', () => {
    it('should work with FormControl and required validator', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.valid).toBe(false);
      control.setValue('test');
      expect(control.valid).toBe(true);
    });

    it('should work with minLength validator', () => {
      const control = new FormControl('', Validators.minLength(2));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('a');
      expect(control.hasError('minlength')).toBe(true);
      control.setValue('ab');
      expect(control.hasError('minlength')).toBe(false);
    });

    it('should work with maxLength validator', () => {
      const control = new FormControl('', Validators.maxLength(50));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('a'.repeat(51));
      expect(control.hasError('maxlength')).toBe(true);
      control.setValue('a'.repeat(50));
      expect(control.hasError('maxlength')).toBe(false);
    });

    it('should work with pattern validator', () => {
      const control = new FormControl('', Validators.pattern(/^[a-zA-Z\s]*$/));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('test123');
      expect(control.hasError('pattern')).toBe(true);
      control.setValue('test');
      expect(control.hasError('pattern')).toBe(false);
    });

    it('should display error state when control is invalid and touched', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.invalid && control.touched).toBe(false);
      control.markAsTouched();
      fixture.detectChanges();
      expect(control.invalid && control.touched).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes for required field', () => {
      fixture.componentRef.setInput('required', true);
      fixture.componentRef.setInput('ariaLabel', 'Nombres, campo obligatorio');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-required')).toBe('true');
      expect(input.getAttribute('aria-label')).toBe('Nombres, campo obligatorio');
    });

    it('should indicate invalid state with aria-invalid', () => {
      const control = new FormControl('', Validators.required);
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
  });
});


describe('GfTextInput — aria-invalid tras la interacción del usuario', () => {
  it('pasa a aria-invalid=true cuando el usuario sale de un campo obligatorio vacío', async () => {
    await TestBed.configureTestingModule({ imports: [GfTextInput, ReactiveFormsModule] }).compileComponents();
    const fixture = TestBed.createComponent(GfTextInput);
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
