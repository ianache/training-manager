import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfLabel } from './label';

describe('GfLabel', () => {
  let component: GfLabel;
  let fixture: ComponentFixture<GfLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfLabel]
    }).compileComponents();
    fixture = TestBed.createComponent(GfLabel);
    component = fixture.componentInstance;
  });

  it('should render label with correct text', () => {
    component.text = 'Name';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label.textContent.trim()).toContain('Name');
  });

  it('should link label to input using for attribute', () => {
    component.inputId = 'email-input';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label.getAttribute('for')).toBe('email-input');
  });

  it('should show asterisk when required is true', () => {
    component.required = true;
    fixture.detectChanges();
    const asterisk = fixture.nativeElement.querySelector('[aria-label="required"]');
    expect(asterisk).toBeTruthy();
  });
});
