import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfFormField } from './form-field';

describe('GfFormField', () => {
  let component: GfFormField;
  let fixture: ComponentFixture<GfFormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfFormField]
    }).compileComponents();
    fixture = TestBed.createComponent(GfFormField);
    component = fixture.componentInstance;
  });

  it('should render form field with label and input', () => {
    component.label = 'Email';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    const input = fixture.nativeElement.querySelector('input');
    expect(label).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should show error message on blur if error exists', () => {
    component.error = 'Email is required';
    const input = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('gf-error-message');
    expect(error).toBeTruthy();
  });

  it('should show hint text when no error', () => {
    component.hint = 'We'll never share your email';
    fixture.detectChanges();
    const hint = fixture.nativeElement.querySelector('.hint');
    expect(hint?.textContent).toContain('We');
  });
});
