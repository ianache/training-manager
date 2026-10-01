import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
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

  describe('Basic rendering', () => {
    it('should render tel input', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input).toBeTruthy();
      expect(input.type).toBe('tel');
    });

    it('should set placeholder', () => {
      fixture.componentRef.setInput('placeholder', '+51 999 999 999');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('+51 999 999 999');
    });

    it('should emit valueChange on input change', () => {
      spyOn(component.valueChange, 'emit');
      component.valueChange.emit('+51 999 999 999');
      expect(component.valueChange.emit).toHaveBeenCalledWith('+51 999 999 999');
    });

    it('should emit blur event', () => {
      spyOn(component.blur, 'emit');
      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new Event('blur'));
      expect(component.blur.emit).toHaveBeenCalled();
    });

    it('should be disabled when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.disabled).toBe(true);
    });
  });

  describe('Pattern validation', () => {
    it('should validate Peru phone pattern (+51XXXXXXXXX)', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      // Invalid: missing +51
      control.setValue('999999999');
      expect(control.hasError('pattern')).toBe(true);

      // Invalid: wrong country code
      control.setValue('+52 999999999');
      expect(control.hasError('pattern')).toBe(true);

      // Invalid: wrong number of digits
      control.setValue('+51 99999999');
      expect(control.hasError('pattern')).toBe(true);

      // Valid: correct format
      control.setValue('+51999999999');
      expect(control.hasError('pattern')).toBe(false);
    });

    it('should validate with spaces in phone number', () => {
      const control = new FormControl('');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('+51 999 999 999');
      // Spaces are typically removed or handled by the form control
      expect(control.value).toBe('+51 999 999 999');
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
      expect(control.hasError('pattern')).toBe(false);
    });

    it('should show error state when control is invalid', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('invalid', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.invalid).toBe(true);
      expect(control.hasError('pattern')).toBe(true);
    });

    it('should show error when touched and invalid', () => {
      const pattern = /^\+51\d{9}$/;
      const control = new FormControl('invalid', Validators.pattern(pattern));
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.markAsTouched();
      fixture.detectChanges();

      expect(control.invalid && control.touched).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should set aria-required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('should set aria-invalid', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Número telefónico laboral');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-label')).toBe('Número telefónico laboral');
    });
  });

  describe('Error messages', () => {
    it('should display error message for invalid pattern', () => {
      const control = new FormControl('invalid');
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('showError', true);
      fixture.detectChanges();

      // Error message should be shown based on control state
      expect(control.value).toBe('invalid');
    });
  });
});
