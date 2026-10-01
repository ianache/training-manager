import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterCollaboratorPage } from './register-collaborator.page';
import { RegisterCollaboratorService } from '../../core/services/register-collaborator.service';
import { of, throwError } from 'rxjs';

describe('RegisterCollaboratorPage - AC-015 Tests', () => {
  let component: RegisterCollaboratorPage;
  let fixture: ComponentFixture<RegisterCollaboratorPage>;
  let registerService: jasmine.SpyObj<RegisterCollaboratorService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const registerServiceSpy = jasmine.createSpyObj('RegisterCollaboratorService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterCollaboratorPage, ReactiveFormsModule],
      providers: [
        { provide: RegisterCollaboratorService, useValue: registerServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    registerService = TestBed.inject(RegisterCollaboratorService) as jasmine.SpyObj<RegisterCollaboratorService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(RegisterCollaboratorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('AC-015-01: Step 1 - Seleccionar tipo', () => {
    it('should render form with tipo control', () => {
      expect(component.form.get('tipo')).toBeTruthy();
    });

    it('should have Empleado selected by default', () => {
      expect(component.form.get('tipo')?.value).toBe('empleado');
    });
  });

  describe('AC-015-02: Step 2 - Datos persona', () => {
    it('should mark Nombres as required', () => {
      const control = component.form.get('nombres');
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should validate minLength 2 for Nombres', () => {
      const control = component.form.get('nombres');
      control?.setValue('A');
      expect(control?.hasError('minlength')).toBe(true);
    });
  });

  describe('AC-015-05: Duplicate ID validation', () => {
    it('should have async validator for numeroIdentificacion', () => {
      const control = component.form.get('numeroIdentificacion');
      expect(control?.asyncValidator).toBeTruthy();
    });
  });

  describe('AC-015-06: Duplicate email validation', () => {
    it('should have async validator for correoLaboral', () => {
      const control = component.form.get('correoLaboral');
      expect(control?.asyncValidator).toBeTruthy();
    });

    it('should validate email format', () => {
      const control = component.form.get('correoLaboral');
      control?.setValue('invalid-email');
      expect(control?.hasError('email')).toBe(true);
    });
  });

  describe('E5: Error handling - Duplicate ID', () => {
    it('should display error message on E5', () => {
      registerService.register.and.returnValue(throwError(() => ({
        code: 'E5',
        message: 'DNI 12345678 ya existe'
      })));

      component.submit();
      expect(component.error).toContain('ya existe');
    });
  });

  describe('E6: Error handling - Duplicate email', () => {
    it('should display error message on E6', () => {
      registerService.register.and.returnValue(throwError(() => ({
        code: 'E6',
        message: 'Correo test@example.com ya en uso'
      })));

      component.submit();
      expect(component.error).toContain('ya en uso');
    });
  });

  describe('Success path', () => {
    it('should navigate to success page on successful registration', () => {
      const mockResponse = { codigo: 'COLLAB-001', mensaje: 'Success' };
      registerService.register.and.returnValue(of(mockResponse));

      component.form.patchValue({
        nombres: 'Juan',
        apellidos: 'Pérez',
        numeroIdentificacion: '12345678',
        correoLaboral: 'juan@test.com',
        rolId: 'role-1',
        nivelId: 'level-1'
      });

      component.submit();
      expect(router.navigate).toHaveBeenCalledWith(
        ['/colaboradores/exito'],
        jasmine.objectContaining({ state: { codigo: 'COLLAB-001' } })
      );
    });
  });
});
