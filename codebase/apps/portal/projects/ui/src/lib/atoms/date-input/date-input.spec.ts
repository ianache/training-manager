import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfDateInput } from './date-input';

describe('GfDateInput', () => {
  let component: GfDateInput;
  let fixture: ComponentFixture<GfDateInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfDateInput]
    }).compileComponents();
    fixture = TestBed.createComponent(GfDateInput);
    component = fixture.componentInstance;
  });

  it('should render date input', () => {
    const input = fixture.nativeElement.querySelector('input[type="date"]');
    expect(input).toBeTruthy();
  });

  it('should emit valueChange on date change', () => {
    spyOn(component.valueChange, 'emit');
    component.valueChange.emit('2026-01-15');
    expect(component.valueChange.emit).toHaveBeenCalledWith('2026-01-15');
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBe(true);
  });
});
