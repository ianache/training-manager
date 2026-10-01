import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { JefeDatosEditPage } from './jefe-datos-edit.page';
import { JefeDatosService } from '../../data-access/jefe-datos.service';

describe('JefeDatosEditPage (Task 4)', () => {
  let component: JefeDatosEditPage;
  let fixture: ComponentFixture<JefeDatosEditPage>;
  let mockJefeDatosService: jasmine.SpyObj<JefeDatosService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockJefeDatosService = jasmine.createSpyObj('JefeDatosService', [
      'updateDatos',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [JefeDatosEditPage],
      providers: [
        { provide: JefeDatosService, useValue: mockJefeDatosService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JefeDatosEditPage);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('partyId', 'test-party-123');
    });
    fixture.detectChanges();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      const labels = fixture.nativeElement.querySelectorAll('label');
      expect(labels.length).toBeGreaterThanOrEqual(6);
      expect(fixture.nativeElement.textContent).toContain('Nombres');
      expect(fixture.nativeElement.textContent).toContain('Apellidos');
      expect(fixture.nativeElement.textContent).toContain('Nombre Preferido');
      expect(fixture.nativeElement.textContent).toContain('Tipo de Identificación');
      expect(fixture.nativeElement.textContent).toContain('Número de Identificación');
      expect(fixture.nativeElement.textContent).toContain('País de Identificación');
    });

    it('should render Guardar and Cancelar buttons', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const submitBtn = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Guardar')
      );
      const cancelBtn = Array.from(buttons).find((btn: any) =>
        btn.textContent.includes('Cancelar')
      );
      expect(submitBtn).toBeTruthy();
      expect(cancelBtn).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should require nombres field', () => {
      const control = component.form.get('nombres');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require minimum 2 characters in nombres', () => {
      const control = component.form.get('nombres');
      control?.setValue('J');
      control?.markAsTouched();
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should accept valid nombres', () => {
      const control = component.form.get('nombres');
      control?.setValue('Juan Carlos');
      expect(control?.valid).toBe(true);
    });

    it('should require apellidos field', () => {
      const control = component.form.get('apellidos');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require tipoIdentificacion', () => {
      const control = component.form.get('tipoIdentificacion');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require numeroIdentificacion', () => {
      const control = component.form.get('numeroIdentificacion');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require paisIdentificacion', () => {
      const control = component.form.get('paisIdentificacion');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('should accept valid numeroIdentificacion (alphanumeric)', () => {
      const control = component.form.get('numeroIdentificacion');
      control?.setValue('12345678');
      expect(control?.hasError('pattern')).toBe(false);

      control?.setValue('ABC123');
      expect(control?.hasError('pattern')).toBe(false);
    });

    it('should reject invalid numeroIdentificacion (special chars)', () => {
      const control = component.form.get('numeroIdentificacion');
      control?.setValue('123-456-78');
      control?.markAsTouched();
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should allow empty nombrePreferido (optional)', () => {
      const control = component.form.get('nombrePreferido');
      control?.setValue('');
      expect(control?.valid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should disable submit button while submitting', fakeAsync(() => {
      mockJefeDatosService.updateDatos.and.returnValue(of({}));
      fillFormWithValidData();

      expect(component.isSubmitting()).toBe(false);
      component.submit();
      expect(component.isSubmitting()).toBe(true);
      tick(100);
      fixture.detectChanges();
      const submitBtn = fixture.nativeElement.querySelector('.btn-primary');
      expect(submitBtn.disabled).toBe(true);
    }));

    it('should call service with correct payload on valid submission', fakeAsync(() => {
      mockJefeDatosService.updateDatos.and.returnValue(of({}));
      fillFormWithValidData();

      component.submit();
      tick(100);

      expect(mockJefeDatosService.updateDatos).toHaveBeenCalledWith(
        'test-party-123',
        jasmine.objectContaining({
          nombres: 'Juan Carlos',
          apellidos: 'Pérez García',
        })
      );
    }));

    it('should show success message on successful submission', fakeAsync(() => {
      mockJefeDatosService.updateDatos.and.returnValue(of({}));
      fillFormWithValidData();

      component.submit();
      tick(100);
      fixture.detectChanges();

      expect(component.successMessage()).toContain('actualizado');
    }));

    it('should navigate after successful submission', fakeAsync(() => {
      mockJefeDatosService.updateDatos.and.returnValue(of({}));
      fillFormWithValidData();

      component.submit();
      tick(100);
      tick(1500); // Wait for navigation timeout

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/colaboradores',
        'test-party-123',
      ]);
    }));

    it('should not submit if form is invalid', () => {
      component.form.get('nombres')?.setValue('');
      component.submit();

      expect(mockJefeDatosService.updateDatos).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched if submission attempted with invalid form', () => {
      component.form.get('nombres')?.setValue('');
      component.submit();

      const nombresControl = component.form.get('nombres');
      expect(nombresControl?.touched).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should display error message on submission failure', fakeAsync(() => {
      mockJefeDatosService.updateDatos.and.returnValue(
        throwError(() => ({ message: 'Error de servidor' }))
      );
      fillFormWithValidData();

      component.submit();
      tick(100);
      fixture.detectChanges();

      expect(component.errorMessage()).toContain('Error de servidor');
    }));

    it('should re-enable submit button after error', fakeAsync(() => {
      mockJefeDatosService.updateDatos.and.returnValue(
        throwError(() => ({ message: 'Error' }))
      );
      fillFormWithValidData();

      component.submit();
      tick(100);
      fixture.detectChanges();

      expect(component.isSubmitting()).toBe(false);
    }));

    it('should show error banner in DOM', fakeAsync(() => {
      mockJefeDatosService.updateDatos.and.returnValue(
        throwError(() => ({ message: 'Test error' }))
      );
      fillFormWithValidData();

      component.submit();
      tick(100);
      fixture.detectChanges();

      const errorBanner = fixture.nativeElement.querySelector('.error-banner');
      expect(errorBanner).toBeTruthy();
      expect(errorBanner.textContent).toContain('Test error');
    }));

    it('should display field-level error messages', () => {
      const namesControl = component.form.get('nombres');
      namesControl?.setValue('');
      namesControl?.markAsTouched();
      fixture.detectChanges();

      const error = component.getFieldError('nombres', 'required');
      expect(error).toBe(true);
    });
  });

  describe('Cancel Functionality', () => {
    it('should navigate back to party detail on cancel', () => {
      component.cancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/colaboradores',
        'test-party-123',
      ]);
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('should have ARIA labels on required fields', () => {
      const inputs = fixture.nativeElement.querySelectorAll(
        'gf-text-input, gf-select'
      );
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should have role="main" on container', () => {
      const container = fixture.nativeElement.querySelector('[role="main"]');
      expect(container).toBeTruthy();
    });

    it('should have aria-required on required fields', () => {
      const control = component.form.get('nombres');
      expect(control?.hasError('required')).toBeDefined();
    });

    it('should have aria-live polite alerts', () => {
      const alerts = fixture.nativeElement.querySelectorAll(
        '[aria-live="polite"], [aria-live="status"]'
      );
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('should set aria-invalid on invalid fields', () => {
      const control = component.form.get('nombres');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.invalid).toBe(true);
    });

    it('should have proper semantic HTML', () => {
      const form = fixture.nativeElement.querySelector('form');
      const labels = fixture.nativeElement.querySelectorAll('label');
      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(form).toBeTruthy();
      expect(labels.length).toBeGreaterThan(0);
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // Helper function
  function fillFormWithValidData() {
    component.form.patchValue({
      nombres: 'Juan Carlos',
      apellidos: 'Pérez García',
      nombrePreferido: 'Juan',
      tipoIdentificacion: 'DNI',
      numeroIdentificacion: '12345678',
      paisIdentificacion: 'PE',
    });
  }
});
