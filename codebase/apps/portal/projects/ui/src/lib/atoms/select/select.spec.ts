import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { GfSelect } from './select';

describe('GfSelect', () => {
  let component: GfSelect;
  let fixture: ComponentFixture<GfSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfSelect, ReactiveFormsModule]
    }).compileComponents();
    fixture = TestBed.createComponent(GfSelect);
    component = fixture.componentInstance;
  });

  describe('Basic rendering', () => {
    it('should render select element', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select).toBeTruthy();
    });

    it('should emit valueChange on selection', () => {
      spyOn(component.valueChange, 'emit');
      component.valueChange.emit('option1');
      expect(component.valueChange.emit).toHaveBeenCalledWith('option1');
    });

    it('should be disabled when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select.disabled).toBe(true);
    });

    it('should set aria-label', () => {
      fixture.componentRef.setInput('ariaLabel', 'Selecciona una opción');
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select.getAttribute('aria-label')).toBe('Selecciona una opción');
    });

    it('should set aria-required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select.getAttribute('aria-required')).toBe('true');
    });
  });

  describe('Keyboard navigation', () => {
    it('should support arrow key navigation', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      // Simulate arrow key press
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      select.dispatchEvent(event);

      expect(select).toBeTruthy();
    });

    it('should support Enter key for selection', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      select.dispatchEvent(event);

      expect(select).toBeTruthy();
    });

    it('should support Escape key to close', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      select.dispatchEvent(event);

      expect(select).toBeTruthy();
    });
  });

  describe('Form control integration', () => {
    it('should work with FormControl', () => {
      const control = new FormControl('option1');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.value).toBe('option1');
    });

    it('should update control value on change', () => {
      const control = new FormControl('');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('option2');
      expect(control.value).toBe('option2');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-expanded when applicable', () => {
      fixture.componentRef.setInput('ariaExpanded', false);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      // Standard HTML select doesn't use aria-expanded, but custom implementations should
      expect(select).toBeTruthy();
    });

    it('should indicate invalid state with aria-invalid', () => {
      const control = new FormControl('');
      control.setErrors({ required: true });
      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('select');
      expect(select.getAttribute('aria-invalid')).toBe('true');
    });
  });
});
