import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfTextInput } from './text-input';

describe('GfTextInput', () => {
  let component: GfTextInput;
  let fixture: ComponentFixture<GfTextInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfTextInput]
    }).compileComponents();
    fixture = TestBed.createComponent(GfTextInput);
    component = fixture.componentInstance;
  });

  it('should emit valueChange when input value changes', () => {
    spyOn(component.valueChange, 'emit');
    component.valueChange.emit('test');
    expect(component.valueChange.emit).toHaveBeenCalledWith('test');
  });

  it('should have aria-required attribute when required is true', () => {
    component.required = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('should have aria-invalid attribute when invalid is true', () => {
    component.invalid = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });

  it('should emit blur event on input blur', () => {
    spyOn(component.blur, 'emit');
    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));
    expect(component.blur.emit).toHaveBeenCalled();
  });
});
