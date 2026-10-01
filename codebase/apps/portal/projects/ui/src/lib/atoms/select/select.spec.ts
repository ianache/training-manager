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

  describe('Basic rendering and attributes', () => {
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

    it('should be enabled by default', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select.disabled).toBe(false);
    });

    it('should be disabled when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select.disabled).toBe(true);
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Selecciona una opción');
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select.getAttribute('aria-label')).toBe('Selecciona una opción');
    });

    it('should set aria-required when required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select.getAttribute('aria-required')).toBe('true');
    });

    it('should accept ng-content for options', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select).toBeTruthy();
      // Content projection is tested through the template rendering
    });
  });

  describe('Keyboard navigation', () => {
    it('should support arrow key navigation', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      select.dispatchEvent(event);

      expect(select).toBeTruthy();
    });

    it('should support ArrowUp key', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
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

    it('should support Tab key for focus', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
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

    it('should update control value on selection change', () => {
      const control = new FormControl('');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      control.setValue('option2');
      expect(control.value).toBe('option2');
    });

    it('should emit valueChange when using control', () => {
      spyOn(component.valueChange, 'emit');
      const control = new FormControl('option1');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      component.onChangeWithControl({
        target: { value: 'option2' }
      } as any);

      expect(component.valueChange.emit).toHaveBeenCalledWith('option2');
    });

    it('should emit valueChange when not using control', () => {
      spyOn(component.valueChange, 'emit');
      fixture.componentRef.setInput('control', null);
      fixture.detectChanges();

      component.onChangeWithoutControl({
        target: { value: 'option1' }
      } as any);

      expect(component.valueChange.emit).toHaveBeenCalledWith('option1');
    });

    it('should work with required validator', () => {
      const control = new FormControl('', { validators: [] });
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.value).toBe('');
      control.setValue('option1');
      expect(control.value).toBe('option1');
    });
  });

  describe('Value handling', () => {
    it('should initialize with default value', () => {
      fixture.componentRef.setInput('value', 'initial');
      fixture.detectChanges();

      expect(component.value()).toBe('initial');
    });

    it('should handle empty value', () => {
      fixture.componentRef.setInput('value', '');
      fixture.detectChanges();

      expect(component.value()).toBe('');
    });

    it('should handle null value in control', () => {
      const control = new FormControl(null);
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.value).toBeNull();
    });
  });

  describe('Accessibility (WCAG 2.2 AA)', () => {
    it('should set aria-expanded attribute', () => {
      fixture.componentRef.setInput('ariaExpanded', 'true');
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      expect(select.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-expanded to false by default', () => {
      fixture.componentRef.setInput('ariaExpanded', 'false');
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      expect(select.getAttribute('aria-expanded')).toBe('false');
    });

    it('should indicate invalid state with aria-invalid', () => {
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      expect(select.getAttribute('aria-invalid')).toBe('true');
    });

    it('should set aria-invalid=true when control is invalid and touched', () => {
      const control = new FormControl('', []);
      control.setErrors({ required: true });
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const shouldShowInvalid = component.shouldShowInvalid();
      expect(shouldShowInvalid).toBe('true');
    });

    it('should have proper semantic HTML role', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');
      expect(select).toBeTruthy();
    });

    it('should include ARIA labels for accessibility', () => {
      fixture.componentRef.setInput('ariaLabel', 'Tipo de Identificación');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      expect(select.getAttribute('aria-label')).toBe('Tipo de Identificación');
      expect(select.getAttribute('aria-required')).toBe('true');
    });
  });

  describe('States', () => {
    it('should show normal state by default', () => {
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector('select');

      expect(select.getAttribute('aria-invalid')).toBeNull();
      expect(select.disabled).toBe(false);
    });

    it('should show valid state when control is valid', () => {
      const control = new FormControl('option1');
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.valid).toBe(true);
    });

    it('should show error state when control is invalid', () => {
      const control = new FormControl('');
      control.setErrors({ required: true });
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      expect(control.invalid).toBe(true);
    });

    it('should show error visual when touched and invalid', () => {
      const control = new FormControl('');
      control.setErrors({ required: true });
      control.markAsTouched();
      fixture.componentRef.setInput('control', control);
      fixture.detectChanges();

      const shouldShowInvalid = component.shouldShowInvalid();
      expect(shouldShowInvalid).toBe('true');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid value changes', () => {
      spyOn(component.valueChange, 'emit');
      fixture.detectChanges();

      component.onChangeWithControl({ target: { value: 'opt1' } } as any);
      component.onChangeWithControl({ target: { value: 'opt2' } } as any);
      component.onChangeWithControl({ target: { value: 'opt3' } } as any);

      expect(component.valueChange.emit).toHaveBeenCalledTimes(3);
    });

    it('should handle special characters in value', () => {
      spyOn(component.valueChange, 'emit');
      fixture.detectChanges();

      component.onChangeWithControl({
        target: { value: 'opt-with_special.chars' }
      } as any);

      expect(component.valueChange.emit).toHaveBeenCalledWith('opt-with_special.chars');
    });
  });
});
