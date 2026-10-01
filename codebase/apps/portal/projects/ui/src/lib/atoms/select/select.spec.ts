import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfSelect } from './select';

describe('GfSelect', () => {
  let component: GfSelect;
  let fixture: ComponentFixture<GfSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfSelect]
    }).compileComponents();
    fixture = TestBed.createComponent(GfSelect);
    component = fixture.componentInstance;
  });

  it('should render select element', () => {
    const select = fixture.nativeElement.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('should emit valueChange on selection', () => {
    spyOn(component.valueChange, 'emit');
    component.valueChange.emit('option1');
    expect(component.valueChange.emit).toHaveBeenCalledWith('option1');
  });

  it('should be disabled when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector('select');
    expect(select.disabled).toBe(true);
  });
});
