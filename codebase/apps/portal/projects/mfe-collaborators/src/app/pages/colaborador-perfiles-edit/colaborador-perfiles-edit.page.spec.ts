import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ColaboradorPerfilesEditPage } from './colaborador-perfiles-edit.page';
import { ColaboradorPerfilesService } from '../../data-access/colaborador-perfiles.service';

describe('ColaboradorPerfilesEditPage (Task 6)', () => {
  let component: ColaboradorPerfilesEditPage;
  let fixture: ComponentFixture<ColaboradorPerfilesEditPage>;
  let mockService: jasmine.SpyObj<ColaboradorPerfilesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ColaboradorPerfilesService', [
      'addPerfil',
      'deletePerfil',
      'updatePhone',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ColaboradorPerfilesEditPage],
      providers: [
        { provide: ColaboradorPerfilesService, useValue: mockService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ColaboradorPerfilesEditPage);
    component = fixture.componentInstance;
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('partyId', 'test-user-123');
    });
    fixture.detectChanges();
  });

  describe('Profile List Rendering', () => {
    it('should render empty state when no profiles', () => {
      fixture.detectChanges();
      const emptyMsg = fixture.nativeElement.textContent;
      expect(emptyMsg).toContain('No tienes perfiles registrados');
    });

    it('should render profiles when added', () => {
      component.profilesList.set([
        {
          id: '1',
          plataforma: 'GitHub',
          url: 'https://github.com/username',
          vigente: true,
        },
      ]);
      fixture.detectChanges();

      const profiles = fixture.nativeElement.querySelectorAll('.profile-item');
      expect(profiles.length).toBe(1);
      expect(fixture.nativeElement.textContent).toContain('GitHub');
    });
  });

  describe('Add Profile Form', () => {
    it('should render platform select and URL input', () => {
      const selects = fixture.nativeElement.querySelectorAll('gf-select');
      const inputs = fixture.nativeElement.querySelectorAll('gf-text-input');
      expect(selects.length).toBeGreaterThan(0);
      expect(inputs.length).toBeGreaterThan(0);
    });

    it('should require platform', () => {
      const control = component.profileForm.get('plataforma');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require valid URL', () => {
      const control = component.profileForm.get('urlPerfil');
      control?.setValue('not-a-url');
      control?.markAsTouched();
      expect(control?.hasError('invalidUrl')).toBe(true);
    });

    it('should accept valid URLs', () => {
      const control = component.profileForm.get('urlPerfil');
      control?.setValue('https://github.com/username');
      expect(control?.hasError('invalidUrl')).toBe(false);
    });

    it('should add profile to list on valid submit', () => {
      component.profileForm.patchValue({
        plataforma: 'GitHub',
        urlPerfil: 'https://github.com/user',
      });

      component.addProfile();

      expect(component.profilesList().length).toBe(1);
      expect(component.profilesList()[0].plataforma).toBe('GitHub');
    });

    it('should clear form after adding profile', () => {
      component.profileForm.patchValue({
        plataforma: 'GitHub',
        urlPerfil: 'https://github.com/user',
      });

      component.addProfile();

      expect(component.profileForm.get('plataforma')?.value).toBeFalsy();
      expect(component.profileForm.get('urlPerfil')?.value).toBeFalsy();
    });
  });

  describe('Delete Profile', () => {
    it('should show confirmation modal on delete click', () => {
      component.profilesList.set([
        {
          id: '1',
          plataforma: 'GitHub',
          url: 'https://github.com/user',
          vigente: true,
        },
      ]);
      fixture.detectChanges();

      expect(component.showDeleteConfirm()).toBe(false);
      component.deleteProfile('1');
      expect(component.showDeleteConfirm()).toBe(true);
    });

    it('should remove profile on confirm delete', () => {
      component.profilesList.set([
        { id: '1', plataforma: 'GitHub', url: 'https://github.com/user', vigente: true },
        { id: '2', plataforma: 'LinkedIn', url: 'https://linkedin.com/user', vigente: true },
      ]);

      component.deleteProfile('1');
      component.confirmDelete();

      expect(component.profilesList().length).toBe(1);
      expect(component.profilesList()[0].id).toBe('2');
    });

    it('should close modal on cancel delete', () => {
      component.deleteProfile('1');
      expect(component.showDeleteConfirm()).toBe(true);

      component.cancelDelete();
      expect(component.showDeleteConfirm()).toBe(false);
    });
  });

  describe('Phone Update', () => {
    it('should require valid Peru phone pattern', () => {
      const control = component.phoneForm.get('nuevoNumeroTelefonico');
      control?.setValue('999999999');
      control?.markAsTouched();
      expect(control?.hasError('pattern')).toBe(true);
    });

    it('should accept valid Peru phone', () => {
      const control = component.phoneForm.get('nuevoNumeroTelefonico');
      control?.setValue('+51999999999');
      expect(control?.hasError('pattern')).toBe(false);
    });

    it('should detect phone changes', () => {
      expect(component.hasPhoneChange()).toBe(false);
      component.phoneForm.get('nuevoNumeroTelefonico')?.setValue('+51988888888');
      expect(component.hasPhoneChange()).toBe(true);
    });

    it('should update current phone display', () => {
      component.phoneForm.get('nuevoNumeroTelefonico')?.setValue('+51988888888');
      component.updatePhone();

      expect(component.currentPhone()).toBe('+51988888888');
    });

    it('should clear form after update', () => {
      component.phoneForm.get('nuevoNumeroTelefonico')?.setValue('+51988888888');
      component.updatePhone();

      expect(component.phoneForm.get('nuevoNumeroTelefonico')?.value).toBeFalsy();
    });
  });

  describe('Permissions & Access Control', () => {
    it('should have partyId input for permission check', () => {
      // Verify component receives partyId which should be used for permission check
      expect(component.partyId()).toBe('test-user-123');
    });
  });

  describe('Accessibility', () => {
    it('should have role="main" on container', () => {
      const container = fixture.nativeElement.querySelector('[role="main"]');
      expect(container).toBeTruthy();
    });

    it('should have aria-labels on delete buttons', () => {
      component.profilesList.set([
        {
          id: '1',
          plataforma: 'GitHub',
          url: 'https://github.com/user',
          vigente: true,
        },
      ]);
      fixture.detectChanges();

      const deleteBtn = fixture.nativeElement.querySelector('.btn-delete');
      expect(deleteBtn.getAttribute('aria-label')).toContain('GitHub');
    });

    it('should have aria-live alerts for messages', () => {
      const alerts = fixture.nativeElement.querySelectorAll(
        '[aria-live="polite"], [aria-live="status"]'
      );
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  describe('Cancel Navigation', () => {
    it('should navigate back to party detail on cancel', () => {
      component.cancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/colaboradores',
        'test-user-123',
      ]);
    });
  });
});
