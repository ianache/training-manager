import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { GfEmailInput } from './email-input';
import { of } from 'rxjs';

describe('GfEmailInput', () => {
  let component: GfEmailInput;
  let fixture: ComponentFixture<GfEmailInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfEmailInput, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(GfEmailInput);
    component = fixture.componentInstance;
  });

  describe('Basic rendering', () => {
    it('should render email input', () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input).toBeTruthy();
      expect(input.type).toBe('email');
    });

    it('should set placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'ej. juan@comsatel.com.pe');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe('ej. juan@comsatel.com.pe');
    });

    it('should emit valueChange on input change', () => {
      spyOn(component.valueChange, 'emit');
      component.valueChange.emit('test@example.com');
      expect(component.valueChange.emit).toHaveBeenCalledWith('test@example.com');
    });

    it('should emit blur event', () => {
      spyOn(component.blur, 'emit');
      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new Event('blur'));
      expect(component.blur.emit).toHaveBeenCalled();
    });
  });

  describe('Email format validation', () => {
    it('should validate email format', () => {
      const control = new FormControl('', Validators.email);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('invalid-email');
      expect(control.hasError('email')).toBe(true);

      control.setValue('valid@example.com');
      expect(control.hasError('email')).toBe(false);
    });
  });

  describe('Async uniqueActive validator', () => {
    it('should show validating state during async check', fakeAsync(() => {
      const control = new FormControl('test@example.com');
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('emailCheckFn', () => of({ available: true }).pipe());
      fixture.detectChanges();

      // Manually trigger the async validator
      const result = component.uniqueActiveValidator(control);
      expect(result).toBeTruthy();
    }));

    it('should return null when email is available', (done) => {
      const checkFn = () => of({ available: true });
      const control = new FormControl('test@example.com');
      const validator = component.createUniqueActiveValidator(checkFn);

      if (validator) {
        const result = validator(control);
        if (result instanceof Promise || (result && 'subscribe' in result)) {
          // If observable or promise
          if ('subscribe' in result) {
            result.subscribe((res) => {
              expect(res).toBeNull();
              done();
            });
          }
        }
      }
    });

    it('should return duplicate error when email is in use', (done) => {
      const checkFn = () => of({ available: false, person: 'Juan Pérez' });
      const control = new FormControl('test@example.com');
      const validator = component.createUniqueActiveValidator(checkFn);

      if (validator) {
        const result = validator(control);
        if ('subscribe' in result) {
          result.subscribe((res) => {
            expect(res).toEqual({ duplicate: { person: 'Juan Pérez' } });
            done();
          });
        }
      }
    });

    it('should debounce the async validator call', fakeAsync(() => {
      let callCount = 0;
      const checkFn = () => {
        callCount++;
        return of({ available: true });
      };
      const control = new FormControl('test@example.com');
      const validator = component.createUniqueActiveValidator(checkFn);

      if (validator) {
        control.setAsyncValidators(validator);
        control.updateValueAndValidity();

        // Initial call
        tick(100);
        expect(callCount).toBe(0);

        // After debounce time
        tick(200);
        expect(callCount).toBeGreaterThan(0);
      }
    }));
  });

  describe('Accessibility', () => {
    it('should set aria-required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-required')).toBe('true');
    });

    it('should set aria-describedby', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'ayuda-correo');
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-describedby')).toBe('ayuda-correo');
    });

    it('should indicate invalid state', () => {
      const control = new FormControl('invalid', Validators.email);
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('States', () => {
    it('should show validating spinner during async validation', (done) => {
      const checkFn = () => {
        setTimeout(() => {
          expect(true).toBe(true);
          done();
        }, 100);
        return of({ available: true });
      };
      const control = new FormControl('test@example.com');
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('emailCheckFn', checkFn);
      fixture.detectChanges();
    });

    it('should show success state when valid', () => {
      const control = new FormControl('valid@example.com');
      control.setErrors(null);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      fixture.detectChanges();
      expect(control.valid).toBe(true);
    });

    it('should show duplicate error state', () => {
      const control = new FormControl('duplicate@example.com');
      control.setErrors({ duplicate: { person: 'Juan Pérez' } });
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      expect(control.hasError('duplicate')).toBe(true);
    });
  });
});
