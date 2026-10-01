import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfErrorMessage } from './error-message';

describe('GfErrorMessage', () => {
  let component: GfErrorMessage;
  let fixture: ComponentFixture<GfErrorMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfErrorMessage]
    }).compileComponents();
    fixture = TestBed.createComponent(GfErrorMessage);
    component = fixture.componentInstance;
  });

  it('should render error message text', () => {
    component.message = 'Email is required';
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[role="alert"]');
    expect(error.textContent).toContain('Email is required');
  });

  it('should have role=alert for accessibility', () => {
    component.message = 'Error';
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[role="alert"]');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('should have aria-live=polite', () => {
    component.message = 'Error';
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('[role="alert"]');
    expect(error.getAttribute('aria-live')).toBe('polite');
  });
});
