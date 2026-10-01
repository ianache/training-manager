import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfRadioCard } from './radio-card';

describe('GfRadioCard', () => {
  let component: GfRadioCard;
  let fixture: ComponentFixture<GfRadioCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfRadioCard]
    }).compileComponents();
    fixture = TestBed.createComponent(GfRadioCard);
    component = fixture.componentInstance;
  });

  it('should render radio button', () => {
    const radio = fixture.nativeElement.querySelector('input[type="radio"]');
    expect(radio).toBeTruthy();
  });

  it('should emit selected event when checked', () => {
    spyOn(component.selected, 'emit');
    component.selected.emit('option-1');
    expect(component.selected.emit).toHaveBeenCalledWith('option-1');
  });

  it('should display label text', () => {
    component.label = 'Empleado';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label?.textContent).toContain('Empleado');
  });
});
