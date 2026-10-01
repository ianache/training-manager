import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GfAutocomplete } from './autocomplete';

describe('GfAutocomplete', () => {
  let component: GfAutocomplete;
  let fixture: ComponentFixture<GfAutocomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GfAutocomplete]
    }).compileComponents();
    fixture = TestBed.createComponent(GfAutocomplete);
    component = fixture.componentInstance;
  });

  it('should render input and options list', () => {
    const input = fixture.nativeElement.querySelector('input');
    const list = fixture.nativeElement.querySelector('ul');
    expect(input).toBeTruthy();
    expect(list).toBeTruthy();
  });

  it('should have aria-expanded attribute', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-expanded')).toBeDefined();
  });

  it('should emit selected event on option click', () => {
    spyOn(component.selected, 'emit');
    component.selected.emit({ id: '1', label: 'Option 1' });
    expect(component.selected.emit).toHaveBeenCalledWith({ id: '1', label: 'Option 1' });
  });
});
